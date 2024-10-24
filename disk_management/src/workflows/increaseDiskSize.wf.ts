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
    disk: { type: "any" },
    result: { type: "any" }
  }
})
export class IncreaseDiskSize {
  @Item({ target: "increaseDisk" })
  public getDiskObjectByLabel(vm: VcVirtualMachine, disks: string, @Out disk: VcVirtualDisk) {
    disk = System.getModule("com.clouddepth.disk_management.actions").getDiskObjectByLabel(vm, disks);
    if (!disk) throw new Error("No disk found");
  }
  @Item({ target: "end" })
  public increaseDisk(vm: VcVirtualMachine, disk: VcVirtualDisk, diskSize: number, @Out diskSpec: VcVirtualMachineConfigSpec) {
    const diskManagement = new DiskManagement();
    diskSpec = diskManagement.increaseDiskSize(vm, disk, diskSize);
    if (!diskSpec) throw new Error("No diskSpec found");
    try {
      diskManagement.reconfigureVM(vm, diskSpec);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM. ${error}`);
    }
  }
}
