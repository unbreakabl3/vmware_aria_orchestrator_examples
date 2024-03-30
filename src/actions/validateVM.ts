/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */

/**
 * Checks if a virtual machine with the given name already exists.
 *
 * @param {string} vmName - The name of the virtual machine to check.
 * @returns {string} - An error message if the virtual machine exists, or undefined if it does not.
 */
(function validateVM(vmName: string) {
  /**
   * @type {Array<VirtualMachine>}
   */
  const vms: VcVirtualMachine[] = VcPlugin.getAllVirtualMachines(null, `xpath:name[matches(.,'${vmName}')]`);

  if (vms.length > 0) {
    return `Virtual Machine with that name is already exists`;
  }
});
