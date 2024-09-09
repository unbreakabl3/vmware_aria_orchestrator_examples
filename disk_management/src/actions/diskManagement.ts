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
  public createDisk(vm: VcVirtualMachine, deviceUnitNumber: number) {
    // Create Disk BackingInfo
    System.debug("Create and add temp disk to VM : " + vm.name);
    var diskBackingInfo = new VcVirtualDiskFlatVer2BackingInfo();
    diskBackingInfo.diskMode = "persistent";
    diskBackingInfo.fileName = "[" + vm.datastore[0].name + "]";
    diskBackingInfo.thinProvisioned = true;

    // Create VirtualDisk
    var disk = new VcVirtualDisk();
    disk.backing = diskBackingInfo;
    disk.controllerKey = 1000;
    disk.unitNumber = deviceUnitNumber;
    disk.capacityInKB = 108003328;

    // Create Disk ConfigSpec
    var deviceConfigSpec = new VcVirtualDeviceConfigSpec();
    deviceConfigSpec.device = disk;
    deviceConfigSpec.fileOperation = VcVirtualDeviceConfigSpecFileOperation.create;
    deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.add;

    var deviceConfigSpecs = [];
    deviceConfigSpecs.push(deviceConfigSpec);

    // List of devices
    var configSpec = new VcVirtualMachineConfigSpec();
    configSpec.deviceChange = deviceConfigSpecs;
  }

  // public removeDisk(vm: VcVirtualMachine, unitNumber: number): boolean {
  //     System.debug("Going to detach VMDK from VM : " + (vm.name));
  //     if (vm)
  //     {
  //         var devices = vm.config.hardware.device;
  //     }
  //     else
  //     {
  //         throw "Mandatory input 'vcVm' is NULL or EMPTY";
  //     }
  //     var result = false;

  //     for each (var device in devices) {
  //         if (device instanceof VcVirtualDisk)
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
  //                 var task = vm.reconfigVM_Task(spec);
  //                 System.log("Initiating reconfigure. Detaching disk " + device.backing.fileName);
  //                 System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task,true,3);
  //                 System.log("Reconfigure of VM '" + vm.name + "' successful.");
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
    //         }
    
    private reconfigureVM(vm: VcVirtualMachine, configSpec: VcVirtualMachineConfigSpec) {
        // Launch the reconfigVM task
        try {
            var task = vm.reconfigVM_Task(configSpec);
            System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task,true,3);
            System.debug("Temp disk was successfully created and attached to VM : " + vm.name);
            
            //get temp VMDK full path
            const devices = vm.config.hardware.device;
            for each (var device in devices) {
                if (device instanceof VcVirtualDisk) {
                        if (device.unitNumber == deviceUnitNumber) {
                            System.debug("Temp VMDK full path: " + device.backing.fileName);
                            return device.backing;
                        }
                }
            }
        } catch (e) {
            throw "Failed to create temp disk and attach to VM : " + vm.name + "ERROR: " + e;
        }
            }
}
