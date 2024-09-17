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
 * @param {VC:VirtualMachine} vm - Virtual Machine to get the unit number
 * @param {number} maximumDeviceUnitsNumber - Number of maximum device units
 * @param {Array/number} deviceUnitToRemove
 * @returns {number} - Array of unused device unit numbers
 */
(function (vm: VcVirtualMachine, maximumDeviceUnitsNumber: number, deviceUnitToRemove: Array<number>): number | undefined {
  if (!vm || !maximumDeviceUnitsNumber) throw new Error("Provide parameters are missing");
  let predefinedArray: Array<number> = [];
  let unusedDeviceUnits: Array<number> = [];
  for (let i = 0; i < maximumDeviceUnitsNumber; i++) {
    predefinedArray.push(i);
  }
  if (deviceUnitToRemove && deviceUnitToRemove.length > 0) {
    unusedDeviceUnits = predefinedArray.filter(function (num) {
      return deviceUnitToRemove.indexOf(num) === -1;
    });
  }
  // const unusedDeviceUnits = predefinedArray.filter(function (num) {
  //   return deviceUnitToRemove.indexOf(num) === -1;
  // });
  return unusedDeviceUnits.length > 0 ? unusedDeviceUnits[0] : undefined;
});
