/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, In, Item, Out } from "vrotsc-annotations";
import { DiskManagement } from "../actions/diskManagement";

@Workflow({
  name: "Increase Disk Size",
  path: "MyOrg/MyProject",
  id: "",
  description: "This workflow allows to increase the disk size of the VM",
  input: {
    vm: { type: "VC:VirtualMachine" },
    disks: { type: "string" },
    diskSize: { type: "number" }
  },
  attributes: {
    result: { type: "any" }
  }
})
export class IncreaseDiskSize {
  @Item({ target: "getAttachedDisks" })
  // public getDeviceControllers(vm: VcVirtualMachine, @Out deviceControllers: Array<VcVirtualDevice>) {
  //   deviceControllers = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllers(vm);
  //   if (!deviceControllers) throw new Error("No controllers found");
  // }

  // @Item({ target: "getUsedDeviceUnits" })
  // public getAttachedDisks(@In deviceControllers: Array<VcVirtualDevice>, @In diskControllerName: string, @Out attachedDisks: Array<number>) {
  //   attachedDisks = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerAttachedDisks(deviceControllers, diskControllerName);
  //   if (!attachedDisks) System.log("No attached disks found");
  // }

  // @Item({ target: "getMaxDeviceUnits" })
  // public getUsedDeviceUnits(@In vm: VcVirtualMachine, @In attachedDisks: Array<number>, @Out usedDeviceUnits: Array<number>) {
  //   usedDeviceUnits = System.getModule("com.clouddepth.disk_management.actions").getDeviceUsedUnitsNumber(vm, attachedDisks);
  // }

  // @Item({ target: "getFreeDeviceUnit" })
  // public getMaxDeviceUnits(@In deviceControllers: Array<VcVirtualDevice>, @In diskControllerName: string, @Out maxDeviceUnits: number) {
  //   maxDeviceUnits = System.getModule("com.clouddepth.disk_management.actions").setDeviceUnusedUnitsNumber(deviceControllers, diskControllerName);
  //   if (!maxDeviceUnits) throw new Error("No free device units available");
  // }

  // @Item({ target: "getDeviceControllerKey" })
  // public getFreeDeviceUnit(@In vm: VcVirtualMachine, @In maxDeviceUnits: number, @In usedDeviceUnits: Array<number>, @Out freeDeviceUnit: number) {
  //   freeDeviceUnit = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnusedUnitsNumber(vm, maxDeviceUnits, usedDeviceUnits);
  //   if (freeDeviceUnit === 0) throw new Error("No device unit number available");
  // }

  // @Item({ target: "createNewDisk" })
  // public getDeviceControllerKey(@In diskControllerName: string, @In deviceControllers: Array<VcVirtualDevice>, @Out deviceControllerKey: number) {
  //   deviceControllerKey = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerKey(diskControllerName, deviceControllers);
  // }
  @Item({ target: "end" })
  public createNewDisk(@In vm: VcVirtualMachine, @In freeDeviceUnit: number, @In diskSize: number, @In deviceControllerKey: number, @Out result: any) {
    const diskManagement = new DiskManagement();
    const configSpec = diskManagement.createDisk(vm, freeDeviceUnit, diskSize, deviceControllerKey);
    try {
      diskManagement.reconfigureVM(vm, configSpec);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM. ${error}`);
    }
  }
}
