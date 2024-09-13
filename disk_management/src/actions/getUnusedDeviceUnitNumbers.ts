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
 * @returns {Array/number} - Array of unused device unit numbers
 */
(function (vm: VcVirtualMachine): number | undefined {
  if (!vm) return;
  let predefinedArray: Array<number> = [];
  for (var i = 1; i <= 64; i++) {
    predefinedArray.push(i);
  }
  const deviceUnitToRemove = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnitNumber(vm);
  const unusedDeviceUnits = predefinedArray.filter(function (num) {
    return deviceUnitToRemove.indexOf(num) === -1;
  });
  return unusedDeviceUnits.length > 0 ? unusedDeviceUnits[0] : undefined;
});
