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
 * Get storage controller device key
 *
 * @param {string} diskControllerLabel - The name of the device controller
 * @param {Array/VcVirtualDevice} deviceControllers - Array of deviceControllers objects //TODO: change it to object
 * @returns {number} - The key number of the device controller
 */
(function (diskControllerLabel: string, deviceControllers: Array<VcVirtualDevice>): number | Array<never> | undefined {
  if (!diskControllerLabel || !deviceControllers) throw new Error("Both 'diskControllerLabel' and 'deviceControllers' parameters are required.");
  const device = deviceControllers.find((device) => device.deviceInfo.label === diskControllerLabel);
  return device?.key;
});
