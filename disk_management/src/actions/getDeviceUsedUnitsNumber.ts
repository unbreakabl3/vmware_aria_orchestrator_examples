/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * getDeviceUsedUnitsNumber.ts
 *
 * Get the device unit number not in use
 *
 * @param {VC:VirtualMachine} vm - The name of the virtual machine to check.
 * @param {Array/number} deviceControllerAttachedDisks - Array of disks attached to the controller
 * @returns {Array/number} - Array of used device unit numbers
 */
(function (vm: VcVirtualMachine, deviceControllerAttachedDisks: Array<number>): Array<number> {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  const usedUnitNumbers: Array<number> = [];
  if (!deviceControllerAttachedDisks || deviceControllerAttachedDisks.length === 0) {
    return usedUnitNumbers;
  }
  const attachedDiskSet = new Set(deviceControllerAttachedDisks);
  return devices.filter((device) => device instanceof VcVirtualDisk && attachedDiskSet.has(device.key)).map((device) => device.unitNumber);
});
