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
 * @returns {Properties} - Array of strings
 */
(function getVmHwVersionsResourceElement(rsName: string, rsPath: string): Array<string> {
  if (!rsName || !rsPath) return [];
  const resourceElement = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").resourceElementManagement();
  const vars = {
    rsName: rsName,
    rsPath: rsPath
  };
  try {
    const content = resourceElement.ResourceElementManagement.prototype.getResourceElement(vars);
    const jsonObject = content.getContentAsMimeAttachment().content;
    if (typeof jsonObject !== "string") {
      throw new Error("Invalid content format received");
    }
    const jsonData = JSON.parse(jsonObject);
    return jsonData;
  } catch (error) {
    throw new Error(`Error getting VM hardware versions: ${error}`);
  }
});
