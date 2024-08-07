/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 https://www.clouddepth.com
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * Checks if a virtual machine with the given name already exists.
 *
 * @param {string} defaultHardwareVersion - The name of the virtual machine to check.
 * @param {string} maxHardwareVersion - The name of the virtual machine to check.
 * @param {string} rsName - Resource element name.
 * @param {string} rsPath - Resource element path.
 * @returns {string} - An error message if the virtual machine exists, or undefined if it does not.
 */
(function validateVmHwVersion(defaultHardwareVersion: string, maxHardwareVersion: string, rsName: string, rsPath: string) {
  if (!defaultHardwareVersion || !maxHardwareVersion || (!rsName && !rsPath)) return `Required parameters are missing`;
  const jsonData = System.getModule("com.clouddepth.set_vm_hw_version.actions").getVmHwVersionsResourceElement(rsName, rsPath);
  const defaultHardwareVersionKey = System.getModule("com.clouddepth.set_vm_hw_version.actions").getKeyByValue(jsonData, defaultHardwareVersion)?.split("-")[1];
  const maxHardwareVersionKey = System.getModule("com.clouddepth.set_vm_hw_version.actions").getKeyByValue(jsonData, maxHardwareVersion)?.split("-")[1];
  const defaultKeyInt = parseInt(defaultHardwareVersionKey);
  const maxKeyInt = parseInt(maxHardwareVersionKey);
  if (defaultKeyInt > maxKeyInt) {
    return "maxHardwareVersion must be higher than defaultHardwareVersion";
  }
});
