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
 * @returns {VcVirtualDevice} - Disk object
 */

(function (vm: VcVirtualMachine, labelToMatch: string): VcVirtualDevice | null {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;

  // Extract the part of the label before the "|" character
  const labelPart = labelToMatch.split("|")[0].trim();
  const matchedDevice: VcVirtualDevice | undefined = devices.find((device) => device?.deviceInfo?.label === labelPart);
  return matchedDevice ? matchedDevice : null;
});
