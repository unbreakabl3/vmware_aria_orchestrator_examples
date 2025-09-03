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
 * getDeviceUnusedUnitsNumber.ts
 *
 * Get the device unit number not in use
 *
 * @param {VC:VirtualMachine} vm - Virtual Machine to get the unit number
 * @param {number} maximumDeviceUnitsNumber - Number of maximum device units
 * @param {Array/number} deviceUnitToRemove - Array of device units to remove from the list of all available devices
 * @returns {number} - Array of unused device unit numbers
 */
(function (vm: VcVirtualMachine, maximumDeviceUnitsNumber: number, deviceUnitToRemove: Array<number>): number | Array<number> {
  if (!vm || !maximumDeviceUnitsNumber) throw new Error("Provide parameters are missing");
  const predefinedArray: Array<number> = Array.from({ length: maximumDeviceUnitsNumber }, (_, i) => i);

  if (deviceUnitToRemove && deviceUnitToRemove.length > 0) {
    const unusedDeviceUnits = predefinedArray.filter((num) => deviceUnitToRemove.indexOf(num) === -1);
    return unusedDeviceUnits.length > 0 ? unusedDeviceUnits[0] : 0;
  }

  return predefinedArray;
});
