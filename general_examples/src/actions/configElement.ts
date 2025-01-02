/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * https://www.clouddepth.com/posts/vro-configuration-element-how-to/
 */
import { AttributeMap } from "../types/types";

export class InvalidConfigElementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidConfigElementError";
  }
}

export class ConfigElement {
  private findConfigurationElementByName(elements: Array<ConfigurationElement>, name: string): ConfigurationElement | undefined {
    return elements.find((element) => element.name === name);
  }

  private handleConfigError(configName: string, error: unknown): never {
    throw new InvalidConfigElementError(`Could not find configuration element ${configName}. ${error}`);
  }

  public getConfigElement({ configName, configPath }: { configName: string; configPath: string }): ConfigurationElement | undefined {
    if (!configName || !configPath) {
      return undefined;
    }
    try {
      const configurationElements: Array<ConfigurationElement> = Server.getConfigurationElementCategoryWithPath(configPath)?.allConfigurationElements;
      if (!configurationElements) {
        this.handleConfigError(configName, "Configuration element category not found");
      }

      const configurationElement: ConfigurationElement | undefined = this.findConfigurationElementByName(configurationElements, configName);
      if (!configurationElement) {
        this.handleConfigError(configName, "Configuration element not found");
      }

      return configurationElement;
    } catch (error) {
      this.handleConfigError(configName, error);
    }
  }

  public getConfElementAttributes(elementName: ConfigurationElement): AttributeMap | undefined {
    const attributes: AttributeMap = {};
    try {
      attributes.powerMin = elementName.getAttributeWithKey("powerMin")?.value;
      attributes.powerMax = elementName.getAttributeWithKey("powerMax")?.value;
      attributes.domainName = elementName.getAttributeWithKey("domainName")?.value;
    } catch (error) {
      throw new Error(`Could not getAttributeWithKey() from element '${elementName}'. ${error}`);
    }

    if (this.validateConfigElementAttributes(attributes)) return attributes;
  }

  private validateConfigElementAttributes(attrs: AttributeMap): AttributeMap {
    const areAttributesValid = (attrs: AttributeMap): boolean =>
      attrs.powerMin !== undefined &&
      typeof attrs.powerMin === "number" &&
      attrs.powerMax !== undefined &&
      typeof attrs.powerMax === "number" &&
      attrs.domainName !== undefined &&
      typeof attrs.domainName === "string";

    if (areAttributesValid(attrs)) {
      return attrs;
    } else {
      throw new Error("One or more attributes are missing, null, or not a number (powerMin/powerMax) or string (domainName)");
    }
  }
}
