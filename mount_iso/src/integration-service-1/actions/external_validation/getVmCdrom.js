/*-
 * #%L
 * mount_iso
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * Checks if a virtual machine with the given name already exists.
 *
 * @param {VC:VirtualMachine} vm - The name of the virtual machine to check.
 * @returns {string} - An error message if the CD-ROM is not found, otherwise an empty string.
 */
(function validateVM(vm) {
	if (!vm) return "No VM provided";

	let hasCdRom = false;

	for (const dev of vm.config.hardware.device) {
		if (dev instanceof VcVirtualCdrom) {
			hasCdRom = true;
			break;
		}
	}

	if (!hasCdRom) {
		return "VM does not have a CD-ROM";
	}
});
