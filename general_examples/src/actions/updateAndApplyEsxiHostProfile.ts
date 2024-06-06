/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class EsxiHostProfile {
  /**
   * name
   */
  public updateAndApplyEsxiHostProfile(vmHost: VcHostSystem, hostFQDN: string, hostSubnet: string, hostIP: string) {
    if (!vmHost || !hostFQDN || !hostIP) throw new Error("input arguments are missing");
    const sdkConnection: VcSdkConnection = vmHost.sdkConnection;
    const hostProfileManager: VcProfileManager = sdkConnection.hostProfileManager;
    const hostToConfigSpecMap = [];
    const vcHostProfileManagerHostToConfigSpecMap = new VcHostProfileManagerHostToConfigSpecMap();
    const configSpec = new VcAnswerFileOptionsCreateSpec();
    configSpec.validating = true;
    vcHostProfileManagerHostToConfigSpecMap.configSpec = configSpec;
    vcHostProfileManagerHostToConfigSpecMap.host = vmHost;
    const userInput: Array<VcProfileDeferredPolicyOptionParameter> = [];

    // HostNamePolicy
    const hostNameInput = new VcProfileDeferredPolicyOptionParameter();
    hostNameInput.inputPath = new VcProfilePropertyPath();
    hostNameInput.inputPath.policyId = "HostNamePolicy";
    hostNameInput.inputPath.profilePath = 'network.GenericNetStackInstanceProfile["key-vim-profile-host-GenericNetStackInstanceProfile-defaultTcpipStack"].GenericDnsConfigProfile';

    //@ts-ignore
    const hostNameParameter = new VcKeyAnyValue();
    hostNameParameter.key = "hostName";
    hostNameParameter.value_AnyValue = hostFQDN;
    hostNameInput.parameter = [hostNameParameter];
    userInput.push(hostNameInput);

    // IpAddressPolicy
    const ipInput = new VcProfileDeferredPolicyOptionParameter();
    //@ts-ignore
    const subnetParameter = new VcKeyAnyValue();
    subnetParameter.key = "subnetmask";
    subnetParameter.value_AnyValue = hostSubnet;
    //@ts-ignore
    const ipParameter = new VcKeyAnyValue();
    ipParameter.key = "address";
    ipParameter.value_AnyValue = hostIP;
    ipInput.inputPath = new VcProfilePropertyPath();
    ipInput.inputPath.policyId = "IpAddressPolicy";
    ipInput.inputPath.profilePath = 'network.hostPortGroup["key-vim-profile-host-HostPortgroupProfile-ManagementNetwork"].ipConfig';
    ipInput.parameter = [subnetParameter, ipParameter];
    userInput.push(ipInput);
    configSpec.userInput = userInput;
    hostToConfigSpecMap.push(vcHostProfileManagerHostToConfigSpecMap);

    this.updateHostCustomization(hostToConfigSpecMap, hostProfileManager);
    const profile = this.findAssociatedProfile(vmHost, hostProfileManager);
    if (profile) {
      const profileExecuteResult: VcProfileExecuteResult = this.executeHostProfile(vmHost, userInput, profile);
      this.applyHostConfig(vmHost, profileExecuteResult);
    }
  }

  private applyHostConfig(vmHost: VcHostSystem, profileExecuteResult: VcProfileExecuteResult) {
    try {
      const { configSpec, requireInput } = profileExecuteResult;
      //@ts-ignore
      const task: VcTask = hostProfileManager.applyHostConfig_Task(vmHost, configSpec, requireInput);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
    } catch (error) {
      throw new Error(`hostProfileManager: ${error}`);
    }
  }

  private executeHostProfile(vmHost: VcHostSystem, userInput: Array<VcProfileDeferredPolicyOptionParameter>, profile: VcProfile) {
    try {
      //@ts-ignore
      return profile.executeHostProfile(vmHost, userInput);
    } catch (error) {
      throw new Error(`profile execution: ${error}`);
    }
  }

  private findAssociatedProfile(vmHost: VcHostSystem, hostProfileManager: VcProfileManager) {
    try {
      const profiles: Array<VcProfile> = hostProfileManager.findAssociatedProfile(vmHost);
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      throw new Error(`findAssociatedProfile: ${error}`);
    }
  }

  private updateHostCustomization(hostToConfigSpecMap: Array<any>, hostProfileManager: VcProfileManager) {
    try {
      //@ts-ignore
      const task = hostProfileManager.updateHostCustomizations_Task(hostToConfigSpecMap);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      return;
    } catch (error) {
      throw new Error(`updateHostCustomization: ${error}`);
    }
  }
}
