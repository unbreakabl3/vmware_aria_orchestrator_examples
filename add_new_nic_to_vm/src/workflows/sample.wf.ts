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
  description: "A",
  input: {
    vm: {
      type: "VC:VirtualMachine"
    },
    portGroup: { type: "VC:DistributedVirtualPortgroup" },
    adapterType: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(vm: VcVirtualMachine, portGroup: VcDistributedVirtualPortgroup, adapterType: string, @Out result: any): void {
    var networkManagement = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").virtualNetworkManagement();
    try {
      networkManagement.VirtualNetworkManagement.prototype.addVnicToDistributedSwitch(vm, portGroup, adapterType);
    } catch (error) {
      throw new Error("Failed to add NIC to VM: " + error);
    }
  }
}
