/*-
 * #%L
 * upgrade_vm_tools
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class Functions {
  /**
   * upgradePoweredOfVMs
   */

  //TODO: rename it to upgradePoweredOfVM
  public isUpgradePoweredOffVmAllowed(allowUpgradePoweredOffVm: boolean, vm: VcVirtualMachine): boolean {
    if (allowUpgradePoweredOffVm || vm.runtime.powerState.value === "poweredOn") return true;
    System.warn(`The current state '${vm.runtime.powerState.value}' is prohibited for the upgrade.`);
    return false;
  }

  /**
   * isUpgradeVMTemplatesAllowed
   */
  public isUpgradeVmTemplatesAllowed(allowUpgradeTemplates: boolean): boolean {
    return allowUpgradeTemplates;
  }

  /**
   * getVMPowerState
   */
  public getVmPowerState(vm: VcVirtualMachine): string {
    if (vm.runtime && vm.runtime.powerState) {
      const powerState = vm.runtime.powerState.value;
      System.log(`Current power state: ${powerState}`);
      return powerState;
    } else {
      throw new Error("VM runtime or power state information is missing.");
    }
  }

  /**
   * getVMType
   */
  public getVmType(vm: VcVirtualMachine): boolean {
    if (vm.config) {
      System.log(`isTemplate: ${vm.config.template}`);
      return vm.config.template;
    } else {
      throw new Error("VM configuration is missing.");
    }
  }

  /**
   * getVMParentHost
   */
  public getVmParentHost(vm: VcVirtualMachine): VcHostSystem {
    if (vm.runtime && vm.runtime.host) {
      System.log(`Host: ${vm.runtime.host.name}`);
      return vm.runtime.host;
    } else {
      throw new Error("Failed to get VM parent host");
    }
  }

  /**
   * getResourcePool
   */
  // public getResourcePool(vm: VcVirtualMachine): VcResourcePool {
  //   if (vm) {
  //     return vm.resourcePool;
  //   } else {
  //     throw new Error("VM object is null or undefined.");
  //   }
  // }

  /**
   * isVmTemplate
   */
  public isVmTemplate(vm: VcVirtualMachine): boolean {
    System.log(`VM template: ${vm.isTemplate}`);
    if (vm.isTemplate !== undefined) {
      return vm.isTemplate;
    } else {
      throw new Error("VM property isTemplate is missing."); // Or return a default value (e.g., false)
    }
  }

  /**
   * convertVmTemplateToVm
   */
  public convertVmTemplateToVm({ vm, pool, host }: { vm: VcVirtualMachine; pool: VcResourcePool; host: VcHostSystem }): void {
    System.log(`pool: ${pool.name}`);
    try {
      vm.markAsVirtualMachine(pool, host);
      System.log("Converted template to VM");
    } catch (error) {
      throw new Error(`Failed to convert template to VM: ${error.message}`);
    }
  }

  /**
   * getComputeResource
   */
  public getComputeResource(hostSystem: VcHostSystem) {
    if (hostSystem.parent) {
      System.log(`Cluster: ${hostSystem.parent.name}`);
      return hostSystem.parent;
    } else {
      throw new Error("HostSystem does not have a compute resource");
    }
  }

  /**
   * getResourcePool
   */
  public getResourcePool(computeResource: VcComputeResource) {
    if (computeResource.resourcePool) {
      System.log(`Resource pool: ${computeResource.resourcePool.name}`);
      return computeResource.resourcePool;
    } else {
      throw new Error("Compute resource does not have a resource pool.");
    }
  }

  /**
   * getVmDiskMode
   */
  public getVmDiskMode(vm: VcVirtualMachine): VcVirtualDevice & VcVirtualDiskFlatVer2BackingInfo {
    if (vm.config.hardware.device !== null) {
      for (let i in vm.config.hardware.device) {
        const device: VcVirtualDevice = vm.config.hardware.device[i];
        if (device instanceof VcVirtualDiskFlatVer2BackingInfo) {
          return device;
        }
      }
    } else {
      System.log(`No disks found for virtual machine '${vm.name}'`);
    }
  }

  /**
   * isVmDiskModePersistent
   */
  public isVmDiskModePersistent(disk: VcVirtualDevice & VcVirtualDiskFlatVer2BackingInfo) {
    if (disk.diskMode === "persistent") {
      System.log("Virtual machine disks are persistent");
      return true;
    } else {
      System.log("Virtual machine disks are not persistent");
      return false;
    }
  }

  /**
   * handleVmPowerState
   */
  public changeVmPowerState(vm: VcVirtualMachine, shutdownTimeout: number) {
    if (!vm) {
      throw "Mandatory parameter vm is not defined.";
    }

    if (vm.runtime.powerState.value === "poweredOff") {
      System.debug("VM is already powered off");
    } else {
      if (!shutdownTimeout || shutdownTimeout === null || shutdownTimeout === undefined) {
        shutdownTimeout = 5;
      }

      System.debug("Timeout before forcing the shutdown (minutes): " + shutdownTimeout);

      if (vm.runtime.powerState.value === "suspended") {
        System.debug("VM is suspended. Starting VM");

        try {
          let task = System.getModule("com.vmware.library.vc.vm.power").startVM(vm, null);
          System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
        } catch (e) {
          throw "Failed to power on VM. " + e;
        }

        System.debug("Successfully powered on VM");

        if (vm.runtime.powerState.value === "poweredOn") {
          System.debug("VM is powered on");

          try {
            System.getModule("com.vmware.library.vc.vm.tools").vim3WaitToolsStarted(vm, 2, 5);

            if (vm.vmToolsStatus === "guestToolsRunning") {
              System.debug("VM is powered on and VMware Tools are running. The virtual machine will be shutdown gracefully");

              try {
                System.getModule("com.vmware.library.vc.vm.power").shutdownVMAndForce(vm, shutdownTimeout, 2);
              } catch (e) {
                throw "Failed to power off VM. " + e;
              }

              System.debug("Successfully powered off VM");
            } else {
              System.debug("VM is powered on but VMware Tools are not running. The virtual machine will be powered off ungracefully");

              try {
                task = System.getModule("com.vmware.library.vc.vm.power").forcePowerOff(vm);
                System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
              } catch (e) {
                throw "Failed to power off VM. " + e;
              }
            }
          } catch (e) {
            System.debug("Failed to wait for VMTools. " + e + ". Will try to force shutdown");
            try {
              var task = System.getModule("com.vmware.library.vc.vm.power").forcePowerOff(vm);
              System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
            } catch (e) {
              throw "Failed to power off VM. " + e;
            }
            System.debug("Successfully powered off VM");
          }
        }
      } else {
        if (vm.runtime.powerState.value == "poweredOn") {
          if (vm.vmToolsStatus == "guestToolsRunning") {
            System.debug("VM is powered on and VMware Tools are running. The virtual machine will be shutdown gracefully");

            try {
              System.getModule("com.vmware.library.vc.vm.power").shutdownVMAndForce(vm, shutdownTimeout, 2);
            } catch (e) {
              throw "Failed to power off VM. " + e;
            }

            System.debug("Successfully powered off VM");
          } else {
            System.debug("VM is powered on but VMware Tools are not running. The virtual machine will be powered off ungracefully");

            try {
              var task = System.getModule("com.vmware.library.vc.vm.power").forcePowerOff(vm);
              System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
            } catch (e) {
              throw "Failed to power off VM. " + e;
            }
          }
        }
      }
    }
  }
}
