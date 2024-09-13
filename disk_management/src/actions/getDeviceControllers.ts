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
(function (vm: VcVirtualMachine): Array<object> {
  if (!vm) return [];
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  const deviceControllers: Array<object> = [];
  devices.forEach((device) => {
    if (
      device instanceof VcParaVirtualSCSIController ||
      device instanceof VcVirtualIDEController ||
      device instanceof VcVirtualAHCIController ||
      device instanceof VcVirtualLsiLogicSASController
    ) {
      deviceControllers.push(device);
    }
  });
  return deviceControllers;
});
