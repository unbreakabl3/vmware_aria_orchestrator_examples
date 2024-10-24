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
 * getListOfDisksProperties.ts
 *
 * Get disks properties
 *
 * @param {VC:VirtualMachine} vm - Virtual Machine
 * @returns {Array/string} - Array of available disks labels
 */

(function getListOfDisksProperties(vm: VcVirtualMachine): Array<string> {
  const getVmSnapshots = System.getModule("com.clouddepth.disk_management.actions").getVmSnapshot(vm);
  if (getVmSnapshots.length > 0) throw new Error("There are one or more snapshots found. Cannot increase the disk size.");

  const devices: Array<VcVirtualDevice> = vm.config.hardware.device;
  const convertBytes = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").generalFunctions();
  const diskInfo: Array<string> = devices
    .filter((device) => device instanceof VcVirtualDisk)
    .map((device) => {
      //@ts-ignore
      const convertedBytes = convertBytes.GeneralFunctions.prototype.convertBytes(device.capacityInBytes);
      return `${device.deviceInfo.label} | ${convertedBytes}`;
    });

  return diskInfo;
});
