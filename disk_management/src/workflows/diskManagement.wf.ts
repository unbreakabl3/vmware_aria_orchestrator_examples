/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";
import { DiskManagement } from "../actions/diskManagement";

@Workflow({
  name: "Disk Management",
  path: "MyOrg/MyProject",
  id: "",
  description: "This workflow is used to create and attached a new disk or delete the existing disk from the VM",
  input: {
    vm: { type: "VC:VirtualMachine" },
    diskSize: { type: "number" },
    diskControllerName: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(vm: VcVirtualMachine, diskSize: number, diskControllerName: string, @Out result: any): void {
    const diskManagement = new DiskManagement();
    const deviceControllers: Array<VcVirtualDevice> = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllers(vm);
    const deviceUnitNumber = System.getModule("com.clouddepth.disk_management.actions").getUnusedDeviceUnitNumbers(vm);
    if (!deviceUnitNumber) throw new Error("No device unit number available");
    const deviceKey: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerKey(diskControllerName, deviceControllers);
    if (!deviceKey) throw new Error("No device key available");
    const configSpec = diskManagement.createDisk(vm, deviceUnitNumber, diskSize, deviceKey); //TODO: change 2001 to variable
    try {
      diskManagement.reconfigureVM(vm, configSpec);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM. ${error}`);
    }
  }
}
