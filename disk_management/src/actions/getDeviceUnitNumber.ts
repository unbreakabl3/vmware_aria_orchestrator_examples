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
 * Get the device unit number not in use
 *
 * @param {VC:VirtualMachine} vm - The name of the virtual machine to check.
 * @returns {Array/number} - Array of used device unit numbers
 */
(function getDeviceUnitNumber(vm: VcVirtualMachine): Array<number> {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  const usedUnitNumbers: Array<number> = [];
  devices.forEach((device) => {
    if (device instanceof VcVirtualDisk) {
      usedUnitNumbers.push(device.unitNumber);
    }
  });
  return usedUnitNumbers;
});
