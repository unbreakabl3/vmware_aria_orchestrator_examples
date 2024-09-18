/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class DiskManagement {
  public createDisk(vm: VcVirtualMachine, deviceUnitNumber: number, diskSize: number, deviceControllerKey: number): VcVirtualMachineConfigSpec {
    // Create Disk BackingInfo
    const diskBackingInfo = new VcVirtualDiskFlatVer2BackingInfo();
    diskBackingInfo.diskMode = "persistent";
    diskBackingInfo.fileName = "[" + vm.datastore[0].name + "]";
    diskBackingInfo.thinProvisioned = true;

    // Create VirtualDisk
    const disk = new VcVirtualDisk();
    //@ts-ignore
    disk.backing = diskBackingInfo;
    disk.controllerKey = deviceControllerKey;
    disk.unitNumber = deviceUnitNumber;
    disk.capacityInKB = diskSize * 1024 * 1024;

    // Create Disk ConfigSpec
    const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
    deviceConfigSpec.device = disk;
    deviceConfigSpec.fileOperation = VcVirtualDeviceConfigSpecFileOperation.create;
    deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.add;

    const deviceConfigSpecs = [];
    deviceConfigSpecs.push(deviceConfigSpec);

    // List of devices
    const configSpec = new VcVirtualMachineConfigSpec();
    configSpec.deviceChange = deviceConfigSpecs;
    return configSpec;
  }

  public reconfigureVM(vm: VcVirtualMachine, configSpec: VcVirtualMachineConfigSpec) {
    try {
      const task = vm.reconfigVM_Task(configSpec);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 3);
    } catch (e) {
      throw `Failed to create and attach disk to VM  ${vm.name}. ${e}`;
    }
  }
}
