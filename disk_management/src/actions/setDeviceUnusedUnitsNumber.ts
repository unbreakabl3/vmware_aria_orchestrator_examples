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
 * @param {Array/object} deviceControllers - Virtual Machine device controller type
 * @param {string} diskControllerLabel - Storage controller label
 * @returns {number} - maximum number of devices supported by the device controller
 */
(function (deviceControllers: Array<VcVirtualDevice>, diskControllerLabel: string) {
  if (!diskControllerLabel || !deviceControllers) throw new Error("Provide parameters are missing");
  const controller = deviceControllers.find((device) => {
    return device.deviceInfo.label === diskControllerLabel;
  });

  if (!controller) {
    throw new Error(`No controller found for label: ${diskControllerLabel}`);
  }
  switch (true) {
    case controller instanceof VcParaVirtualSCSIController:
      return 64;
    case controller instanceof VcVirtualIDEController:
      return 2;
    case controller instanceof VcVirtualAHCIController:
      return 29;
    case controller instanceof VcVirtualLsiLogicSASController:
      return 16;
    case controller instanceof VcVirtualNVMEController:
      return 15;
    default:
      throw new Error("Unknown controller type");
  }
});
