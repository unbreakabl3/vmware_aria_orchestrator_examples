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
 * getDeviceControllers.ts
 *
 * Get the device controllers associated
 *
 * @param {VC:VirtualMachine} vm - The name of the virtual machine to check.
 * @returns {Array/object} - Array of used device controllers associated
 */
(function (vm: VcVirtualMachine): Array<object> {
  if (!vm) return [];
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  return devices.filter(
    (device) =>
      device instanceof VcParaVirtualSCSIController ||
      device instanceof VcVirtualIDEController ||
      device instanceof VcVirtualAHCIController ||
      device instanceof VcVirtualLsiLogicSASController ||
      device instanceof VcVirtualNVMEController
  );
});
