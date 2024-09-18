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
 *  Validate if there are any free storage controller slots available
 * @param {string} diskControllerName - Disk controller name
 * @param {VC:VirtualMachine} vm - Virtual machine
 * @returns {string}
 */
(function validateFreeDeviceUnits(vm: VcVirtualMachine, diskControllerName: string) {
  const deviceControllers = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllers(vm);
  if (!deviceControllers) return "No controllers found";
  const attachedDisks: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerAttachedDisks(deviceControllers, diskControllerName);
  const usedDeviceUnits: Array<number> = System.getModule("com.clouddepth.disk_management.actions").getDeviceUsedUnitsNumber(vm, attachedDisks);
  const maxDeviceUnits: number = System.getModule("com.clouddepth.disk_management.actions").setDeviceUnusedUnitsNumber(deviceControllers, diskControllerName);
  if (!maxDeviceUnits) return "No free device units available";
  const freeDeviceUnit: number = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnusedUnitsNumber(vm, maxDeviceUnits, usedDeviceUnits);
  if (freeDeviceUnit === 0) return "No free device unit number is available to attach a new disk. Select another controller.";
});
