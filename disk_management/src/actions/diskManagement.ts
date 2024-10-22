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

  public increaseDiskSize(vm: VcVirtualMachine, diskToIncrease: VcVirtualDisk, diskSizeGB: number): VcVirtualMachineConfigSpec {
    const newSizeKB = diskToIncrease.capacityInKB + diskSizeGB * 1024 * 1024;
    const spec = new VcVirtualMachineConfigSpec();
    spec.changeVersion = vm.config.changeVersion;
    spec.deviceChange = [new VcVirtualDeviceConfigSpec()];
    spec.deviceChange[0].operation = VcVirtualDeviceConfigSpecOperation.edit;
    spec.deviceChange[0].device = new VcVirtualDisk();
    spec.deviceChange[0].device.key = diskToIncrease.key;
    spec.deviceChange[0].device.deviceInfo = new VcDescription();
    spec.deviceChange[0].device.deviceInfo.label = diskToIncrease.deviceInfo.label;
    spec.deviceChange[0].device.deviceInfo.summary = diskToIncrease.deviceInfo.summary;
    //@ts-ignore
    spec.deviceChange[0].device.backing = new VcVirtualDiskFlatVer2BackingInfo();
    //@ts-ignore
    spec.deviceChange[0].device.backing.fileName = diskToIncrease.backing.fileName;
    //@ts-ignore
    spec.deviceChange[0].device.backing.diskMode = diskToIncrease.backing.diskMode;
    //@ts-ignore
    spec.deviceChange[0].device.backing.uuid = diskToIncrease.backing.uuid;
    //@ts-ignore
    spec.deviceChange[0].device.backing.contentId = diskToIncrease.backing.contentId;
    spec.deviceChange[0].device.controllerKey = diskToIncrease.controllerKey;
    spec.deviceChange[0].device.unitNumber = diskToIncrease.unitNumber;
    //@ts-ignore
    spec.deviceChange[0].device.capacityInKB = newSizeKB;
    return spec;
  }

  public reconfigureVM(vm: VcVirtualMachine, configSpec: VcVirtualMachineConfigSpec) {
    try {
      const task = vm.reconfigVM_Task(configSpec);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 3);
    } catch (e) {
      throw `Failed to increase disk size ${e}`;
    }
  }
}
