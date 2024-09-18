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
  description: "This workflow is used to create and attached a new disk to the VM",
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
    const attachedDisks: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerAttachedDisks(deviceControllers, diskControllerName);
    if (!attachedDisks) System.log("No attached disks found");
    const usedDeviceUnits: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceUsedUnitsNumber(vm, attachedDisks);
    const maxDeviceUnits: number = System.getModule("com.clouddepth.disk_management.actions").setDeviceUnusedUnitsNumber(deviceControllers, diskControllerName);
    if (!maxDeviceUnits) throw new Error("No free device units available");
    const freeDeviceUnit: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnusedUnitsNumber(vm, maxDeviceUnits, usedDeviceUnits);
    if (freeDeviceUnit === 0) throw new Error("No device unit number available");
    const deviceControllerKey: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerKey(diskControllerName, deviceControllers);
    const configSpec = diskManagement.createDisk(vm, freeDeviceUnit, diskSize, deviceControllerKey);
    try {
      diskManagement.reconfigureVM(vm, configSpec);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM. ${error}`);
    }
  }
}
