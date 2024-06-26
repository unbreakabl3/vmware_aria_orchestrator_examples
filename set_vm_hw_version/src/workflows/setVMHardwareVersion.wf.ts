/*
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Set VM hardware version",
  path: "MyOrg/MyProject",
  id: "",
  description: "The workflow will configure the VM hardware default and maximum version on selected cluster",
  input: {
    defaultHardwareVersion: {
      type: "string"
    },
    maxHardwareVersion: {
      type: "string"
    },
    cluster: {
      type: "VC:ClusterComputeResource",
      description: "VC Cluster to configure the VM hardware"
    }
  },
  attributes: {
    rsName: { type: "string", bind: true, value: "MyOrg/MyProject/ConfigurationEl/rsName" },
    rsPath: { type: "string", bind: true, value: "MyOrg/MyProject/ConfigurationEl/rsPath" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SetVMHardwareVersion {
  public install(rsPath: string, rsName: string, cluster: VcClusterComputeResource, defaultHardwareVersion: string, maxHardwareVersion: string, @Out result: any): void {
    const clusterFunctions = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").clusterComputeResourceManagement();
    const jsonData = System.getModule("com.clouddepth.set_vm_hw_version.actions").getVmHwVersionsConfigElement(rsName, rsPath);
    const maxHardwareVersionKey = System.getModule("com.clouddepth.set_vm_hw_version.actions").getKeyByValue(jsonData, maxHardwareVersion);
    const defaultHardwareVersionKey = System.getModule("com.clouddepth.set_vm_hw_version.actions").getKeyByValue(jsonData, defaultHardwareVersion);
    clusterFunctions.ClusterComputeResourceManagement.prototype.setVmHardwareVersion(cluster, defaultHardwareVersionKey, maxHardwareVersionKey);
  }
}
