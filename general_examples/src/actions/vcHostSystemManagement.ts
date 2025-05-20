/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class AdvancedSettingsManagement {
  public validateParameters(key: string, value: string): void {
    if (!key) {
      throw "Mandatory parameter 'advancedSettingKey' is not defined";
    }
    if (!value) {
      throw "Mandatory parameter 'advancedSettingValue' is not defined";
    }
    System.log("Advanced setting key: " + key);
    System.log("Advanced setting value: " + value);
  }

  public createAdvancedSetting(key: string, value: any): VcOptionValue {
    let setting: VcOptionValue = new VcOptionValue();
    try {
      setting.key = key;
      if (typeof value === "number") {
        setting.value_IntValue = value;
      } else {
        setting.value_AnyValue = value;
      }
      return setting;
    } catch (e) {
      throw "Failed to create advanced setting. " + e;
    }
  }

  public applyAdvancedSettingsToHost(host: any, settingsArray: VcOptionValue[]): void {
    try {
      System.log("Applying advanced settings on host...");
      host.configManager.advancedOption.updateOptions(settingsArray);
      System.log("Advanced settings have been applied");
    } catch (e) {
      throw "Failed to add/update host advanced settings. " + e;
    }
  }

  public logHostInfo(host: any): void {
    System.log("ESXi host: " + host.name);
  }
}
