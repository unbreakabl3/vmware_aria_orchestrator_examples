/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";
import { functionsHostProfile } from "../actions/functionsHostProfile";

@Workflow({
  name: "Host Profile",
  path: "MyOrg/MyProject",
  id: "",
  description: "Update host profile",
  attributes: {},
  input: {
    vmHost: { type: "VC:HostSystem" },
    hostFQDN: { type: "string" },
    hostSubnet: { type: "string" },
    hostIP: { type: "string" },
    availableHostProfiles: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(vmHost: VcHostSystem, hostFQDN: string, hostSubnet: string, hostIP: string, availableHostProfiles: string, @Out result: any): void {
    const func = new functionsHostProfile();
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

    func.updateHostCustomization(hostToConfigSpecMap, hostProfileManager);
    const profiles = System.getModule("com.clouddepth.host_profiles.actions").getHostProfileDetails;
    const selectedProfile = profiles(vmHost, availableHostProfiles);
    const attachedProfile = func.findAssociatedProfile(vmHost, hostProfileManager);
    if (attachedProfile && selectedProfile[0].profileName != attachedProfile.name) {
      func.associateHostProfile(vmHost, selectedProfile[0].profileObject);
    }
    const profileExecuteResult: VcProfileExecuteResult = func.executeHostProfile(vmHost, userInput, selectedProfile[0].profileObject);
    func.applyHostConfig(vmHost, profileExecuteResult);
  }
}
