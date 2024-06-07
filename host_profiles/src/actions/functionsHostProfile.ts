/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class functionsHostProfile {
  public applyHostConfig(vmHost: VcHostSystem, profileExecuteResult: VcProfileExecuteResult) {
    try {
      const { configSpec, requireInput } = profileExecuteResult;
      //@ts-ignore
      const task: VcTask = hostProfileManager.applyHostConfig_Task(vmHost, configSpec, requireInput);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
    } catch (error) {
      throw new Error(`hostProfileManager: ${error}`);
    }
  }

  public executeHostProfile(vmHost: VcHostSystem, userInput: Array<VcProfileDeferredPolicyOptionParameter>, profile: VcProfile) {
    try {
      //@ts-ignore
      return profile.executeHostProfile(vmHost, userInput);
    } catch (error) {
      throw new Error(`profile execution: ${error}`);
    }
  }

  public findAssociatedProfile(vmHost: VcHostSystem, hostProfileManager: VcProfileManager) {
    try {
      const profiles: Array<VcProfile> = hostProfileManager.findAssociatedProfile(vmHost);
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      throw new Error(`findAssociatedProfile: ${error}`);
    }
  }

  public updateHostCustomization(hostToConfigSpecMap: Array<any>, hostProfileManager: VcProfileManager) {
    try {
      //@ts-ignore
      const task = hostProfileManager.updateHostCustomizations_Task(hostToConfigSpecMap);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      return;
    } catch (error) {
      throw new Error(`updateHostCustomization: ${error}`);
    }
  }

  public associateHostProfile(vmHost: VcHostSystem, profile: VcProfile) {
    try {
      return profile.associateProfile([vmHost]);
    } catch (error) {
      throw new Error(`associateHostProfile: ${error}`);
    }
  }
}
