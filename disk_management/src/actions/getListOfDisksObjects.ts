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
 * Get list of available disks
 *
 * @param {VC:VirtualMachine} vm - Virtual Machine
 * @returns {Array/Properties} - Array of available disks labels
 */

(function (vm: VcVirtualMachine, diskLabel: string) {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;

  const diskLabels = devices.filter((device) => device?.deviceInfo?.label?.includes(diskLabel)).map((device) => device);

  return diskLabels;
});
