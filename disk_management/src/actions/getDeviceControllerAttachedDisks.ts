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
 * Get number of disks attached to the specified controller
 *
 * @param {Array/object} deviceControllers - Virtual Machine device controllers
 * @param {string} diskControllerLabel - The name of the device controller
 * @returns {Array/number} - Number of disks attached to the specified controller
 */
(function (deviceControllers: Array<VcVirtualDevice>, diskControllerLabel: string): Array<number> | undefined {
  if (!diskControllerLabel || !deviceControllers) throw new Error("Missing required parameters: deviceControllers or diskControllerLabel");
  const controller = deviceControllers.find((device) => device.deviceInfo.label === diskControllerLabel);

  if (!controller) {
    throw new Error(`No controller found for label: ${diskControllerLabel}`);
  }

  if (
    controller instanceof VcParaVirtualSCSIController ||
    controller instanceof VcVirtualIDEController ||
    controller instanceof VcVirtualAHCIController ||
    controller instanceof VcVirtualLsiLogicSASController ||
    controller instanceof VcVirtualNVMEController
  ) {
    return controller.device;
  }
  return undefined;
});
