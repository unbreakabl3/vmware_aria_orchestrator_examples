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

(function (vm: VcVirtualMachine): Array<{ label: string; summary: string }> {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;

  const diskInfo = devices
    .filter((device) => device?.deviceInfo?.label?.includes("Hard disk"))
    .map((device) => ({
      label: device.deviceInfo.label,
      summary: device.deviceInfo.summary
    }));

  return diskInfo;
});
