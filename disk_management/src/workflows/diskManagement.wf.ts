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
    if (!deviceControllers) throw new Error("No controllers found");
    const deviceControllerAttachedDisks: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerAttachedDisks(
      deviceControllers,
      diskControllerName
    );
    if (!deviceControllerAttachedDisks) throw new Error("No controller's key found");
    const deviceUnitToRemove: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceUsedUnitsNumber(vm, deviceControllerAttachedDisks);
    const maximumDeviceUnitsNumber: number = System.getModule("com.clouddepth.disk_management.actions").setDeviceUnusedUnitsNumber(deviceControllers, diskControllerName);
    if (!maximumDeviceUnitsNumber) throw new Error("No free device units available");
    const deviceUnitNumber: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, deviceUnitToRemove);
    if (!deviceUnitNumber && deviceUnitNumber !== 0) throw new Error("No device unit number available");
    const deviceKey: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerKey(diskControllerName, deviceControllers);
    const configSpec = diskManagement.createDisk(vm, deviceUnitNumber, diskSize, deviceKey);
    try {
      diskManagement.reconfigureVM(vm, configSpec);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM. ${error}`);
    }
  }
}
