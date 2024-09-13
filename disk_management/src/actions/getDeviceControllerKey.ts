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
 * @param {string} diskControllerLabel - The name of the device controller
 * @param {Array/VcVirtualDevice} deviceControllers - Array of deviceControllers objects
 * @returns {number} - The key number of the device controller
 */
(function (diskControllerLabel: string, deviceControllers: Array<VcVirtualDevice>): number | Array<never> | undefined {
  if (!diskControllerLabel || !deviceControllers) throw new Error("Provide parameters are missing");
  const deviceKey = deviceControllers.find((device) => {
    return device.deviceInfo.label === diskControllerLabel;
  });
  if (deviceKey) return deviceKey.key;
});
