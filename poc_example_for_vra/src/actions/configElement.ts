/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
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
    const attributes: AttributeMap = {
      username: "",
      password: "",
      hostname: ""
    };
    try {
      attributes.username = elementName.getAttributeWithKey("username")?.value;
      attributes.password = elementName.getAttributeWithKey("password")?.value;
      attributes.hostname = elementName.getAttributeWithKey("hostname")?.value;
    } catch (error) {
      throw new Error(`Could not getAttributeWithKey() from element '${elementName}'. ${error}`);
    }

    if (this.validateConfigElementAttributes(attributes)) return attributes;
  }

  private validateConfigElementAttributes(attrs: AttributeMap): AttributeMap {
    const areAttributesValid = (attrs: AttributeMap): boolean =>
      attrs.username !== undefined &&
      typeof attrs.username === "string" &&
      attrs.password !== undefined &&
      typeof attrs.password === "string" &&
      attrs.hostname !== undefined &&
      typeof attrs.hostname === "string";

    if (areAttributesValid(attrs)) {
      return attrs;
    } else {
      throw new Error("One or more attributes are missing, null, or not a string");
    }
  }
}
