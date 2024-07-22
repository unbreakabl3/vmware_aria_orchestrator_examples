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
    var networkManagement = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").virtualNetworkManagement();
    try {
      networkManagement.VirtualNetworkManagement.prototype.addVnicToDistributedSwitch(vm, distributedPortGroup, adapterType);
    } catch (error) {
      throw new Error("Failed to add NIC to VM: " + error);
    }
  }
}
