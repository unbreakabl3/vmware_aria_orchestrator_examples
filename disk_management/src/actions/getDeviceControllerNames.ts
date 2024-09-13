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
 * Get the device controllers associated
 *
 * @param {VC:VirtualMachine} vm - The name of the virtual machine to check.
 * @returns {Array/string} - Array of used device controllers associated
 */
(function (vm: VcVirtualMachine): Array<string> {
  if (!vm) return [];
  const deviceControllers: Array<VcVirtualDevice> = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllers(vm);
  const deviceControllersNames: Array<string> = [];
  deviceControllers.forEach((device) => {
    deviceControllersNames.push(device.deviceInfo.label);
  });
  return deviceControllersNames;
});
