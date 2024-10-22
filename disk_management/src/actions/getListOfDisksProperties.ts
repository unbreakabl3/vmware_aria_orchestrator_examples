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
 * @returns {Array/string} - Array of available disks labels
 */

(function (vm: VcVirtualMachine): Array<string> {
  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  const convertBytes = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").generalFunctions();
  const diskInfo: Array<string> = devices
    .filter((device) => device?.deviceInfo?.label?.includes("Hard disk"))
    .map((device) => {
      const convertedToNumber = convertStringToNumber(device.deviceInfo.summary) * 1024;
      const convertedBytes = convertBytes.GeneralFunctions.prototype.convertBytes(convertedToNumber);
      return `${device.deviceInfo.label} | ${convertedBytes}`;
    });

  function convertStringToNumber(size: string): number {
    // Remove commas from the string
    const cleanedString = size.replace(/,/g, "");

    // Extract the numeric part by removing non-numeric characters (like 'KB')
    const numericPart = parseFloat(cleanedString);

    return numericPart;
  }

  return diskInfo;
});
