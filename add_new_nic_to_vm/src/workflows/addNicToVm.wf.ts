/*-
 * #%L
 * add_new_nic_to_vm
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Add NIC to VM",
  path: "MyOrg/MyProject",
  id: "",
  description: "This workflow create and add new vNIC to the VM.",
  input: {
    vm: {
      type: "VC:VirtualMachine"
    },
    distributedPortGroup: { type: "VC:DistributedVirtualPortgroup" },
    standardPortGroup: { type: "VC:Network" },
    adapterType: { type: "string" },
    switchType: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(
    vm: VcVirtualMachine,
    distributedPortGroup: VcDistributedVirtualPortgroup,
    adapterType: string,
    switchType: string,
    standardPortGroup: VcNetwork,
    @Out result: any
  ): void {
    const networkManagement = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").virtualNetworkManagement();
    let virtualSwitch = "";
    if (switchType === "dvswitch") {
      const aa = networkManagement.DistributedVirtualSwitchPortConnection.prototype.createDistributedVirtualSwitchPortConnection(distributedPortGroup);
      virtualSwitch = networkManagement.DistributedVirtualPortBackingInfo.prototype.createVirtualEthernetCardDistributedVirtualPortBackingInfo(aa);
    } else if (switchType === "standard") {
      virtualSwitch = networkManagement.StandardVirtualSwitchPortConnection.prototype.createStandardVirtualSwitchPortConnection(standardPortGroup);
    } else throw new Error("Unsupported switch type");
    try {
      networkManagement.VirtualNetworkManagement.prototype.addVnicToDistributedSwitch(vm, virtualSwitch, adapterType);
    } catch (error) {
      throw new Error(`Failed to add NIC to VM: ${error}`);
    }
  }
}
