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
  public createDisk(vm: VcVirtualMachine, deviceUnitNumber: number): VcVirtualMachineConfigSpec {
    // Create Disk BackingInfo
    const diskBackingInfo = new VcVirtualDiskFlatVer2BackingInfo();
    diskBackingInfo.diskMode = "persistent";
    diskBackingInfo.fileName = "[" + vm.datastore[0].name + "]";
    diskBackingInfo.thinProvisioned = true;

    // Create VirtualDisk
    const disk = new VcVirtualDisk();
    //@ts-ignore
    disk.backing = diskBackingInfo;
    disk.controllerKey = 1000;
    disk.unitNumber = deviceUnitNumber;
    disk.capacityInKB = 108003328;

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

  /**
   * Remove attached VMDK  from Virtual Machine
   */
  // public removeVmdk(vm: VcVirtualMachine, unitNumber: number): boolean {
  //     var result = false;
  //     foreach (var device in devices) {
  //       if (device instanceof VcVirtualDisk)
  //         {
  //             System.debug("Checking disk: " + (device.backing.fileName));
  //             System.debug("device.unitNumber is : " + (device.unitNumber));
  //             if (device.unitNumber == unitNumber)
  //             {
  //                 var deviceChange = new VcVirtualDeviceConfigSpec();
  //                 deviceChange.operation = VcVirtualDeviceConfigSpecOperation.remove;
  //                 deviceChange.device = device;
  //                 var deviceChangeArray = new Array();
  //                 deviceChangeArray.push(deviceChange);
  //                 var spec = new VcVirtualMachineConfigSpec();
  //                 spec.deviceChange = deviceChangeArray;
  //                 var task = vcVm.reconfigVM_Task(spec);
  //                 System.log("Initiating reconfigure. Detaching disk " + device.backing.fileName);
  //                 System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task,true,3);
  //                 System.log("Reconfigure of VM '" + vcVm.name + "' successful.");
  //                 result = true;
  //             }
  //             else
  //             {
  //                 System.warn("Unable to find unitNumber " + unitNumber + " attached to that VM.");
  //                 result = false;
  //             }
  //         }
  //     }
  //     return result;
  // }

  public reconfigureVM(vm: VcVirtualMachine, configSpec: VcVirtualMachineConfigSpec) {
    try {
      const task = vm.reconfigVM_Task(configSpec);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 3);
    } catch (e) {
      throw "Failed to create and attach disk to VM : " + vm.name + "ERROR: " + e;
    }
  }
}
