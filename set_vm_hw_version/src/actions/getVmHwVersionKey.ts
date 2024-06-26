/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * @param {string} rsName - Resource element name
 * @param {string} rsPath - Resource element path
 * @returns {Array/string} - Array of keys
 */
(function getVmHwVersionKey(rsName: string, rsPath: string): Array<string> {
  if (!rsName || !rsPath) return [];
  const values: Array<string> = [];
  const jsonData = System.getModule("com.clouddepth.set_vm_hw_version.actions").getVmHwVersionsConfigElement(rsName, rsPath);
  for (var key in jsonData) {
    values.push(key);
  }
  return values;
});
