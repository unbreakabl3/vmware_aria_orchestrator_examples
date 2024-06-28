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
 * @param {string} rsName - Resource element name
 * @param {string} rsPath - Resource element path
 * @returns {Array/string} - Array of values
 */
(function getVmHwVersionValue(rsName: string, rsPath: string): Array<string> {
  if (!rsName || !rsPath) return [];
  try {
    const values: Array<string> = [];
    const jsonData = System.getModule("com.clouddepth.set_vm_hw_version.actions").getVmHwVersionsResourceElement(rsName, rsPath);
    for (var key in jsonData) {
      values.push(jsonData[key]);
    }
    return values;
  } catch (error) {
    System.error(`Error fetching VM hardware versions from resource element: ${error}`);
    return [];
  }
});
