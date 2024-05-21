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

  public isUpgradeVmTemplatesAllowed(allowUpgradeTemplates: boolean): boolean {
    return allowUpgradeTemplates;
  }

  public getVmPowerState(vm: VcVirtualMachine): string {
    if (vm.runtime && vm.runtime.powerState) {
      const powerState = vm.runtime.powerState.value;
      System.log(`Current power state: ${powerState}`);
      return powerState;
    } else {
      throw new Error("VM runtime or power state information is missing.");
    }
  }

  public getVmType(vm: VcVirtualMachine): boolean {
    if (vm.config) {
      System.log(`isTemplate: ${vm.config.template}`);
      return vm.config.template;
    } else {
      throw new Error("VM configuration is missing.");
    }
  }

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

  public isVmTemplate(vm: VcVirtualMachine): boolean {
    System.log(`VM template: ${vm.isTemplate}`);
    if (vm.isTemplate !== undefined) {
      return vm.isTemplate;
    } else {
      throw new Error("VM property isTemplate is missing."); // Or return a default value (e.g., false)
    }
  }

  public convertVmTemplateToVm({ vm, pool, host }: { vm: VcVirtualMachine; pool: VcResourcePool; host: VcHostSystem }): void {
    System.log(`pool: ${pool.name}`);
    try {
      vm.markAsVirtualMachine(pool, host);
      System.log("Converted template to VM");
    } catch (error) {
      throw new Error(`Failed to convert template to VM: ${error.message}`);
    }
  }

  public getComputeResource(hostSystem: VcHostSystem) {
    if (hostSystem.parent) {
      System.log(`Cluster: ${hostSystem.parent.name}`);
      return hostSystem.parent;
    } else {
      throw new Error("HostSystem does not have a compute resource");
    }
  }

  public getResourcePool(computeResource: VcComputeResource) {
    if (computeResource.resourcePool) {
      System.log(`Resource pool: ${computeResource.resourcePool.name}`);
      return computeResource.resourcePool;
    } else {
      throw new Error("Compute resource does not have a resource pool.");
    }
  }

  public getVmDisks(vm: VcVirtualMachine): VcVirtualDisk[] | null {
    const devices: VcVirtualDisk[] = [];
    if (vm.config && vm.config.hardware && vm.config.hardware.device) {
      for (const device of vm.config.hardware.device) {
        if (device instanceof VcVirtualDisk) {
          devices.push(device);
        }
      }
      return devices;
    }
  }

  public getVmNonPersistentDisks(disks: VcVirtualDisk[]): VcVirtualDisk[] {
    const nonPersistentDisks: VcVirtualDisk[] = [];
    disks.forEach((disk) => {
      if (disk.backing instanceof VcVirtualDiskFlatVer2BackingInfo && disk.backing.diskMode !== "persistent") {
        nonPersistentDisks.push(disk);
      }
    });
    return nonPersistentDisks;
  }

  public shutdownVmBasedOnCurrentState(vm: VcVirtualMachine, shutdownTimeout: number) {
    const currentState = vm.runtime.powerState.value;
    switch (currentState) {
      case "poweredOff":
        System.log("VM is already powered off");
        return;
      case "suspended":
        return this.powerOnVm(vm);
      case "poweredOn":
        return this.handlePoweredOnVm(vm, shutdownTimeout);
      default:
        System.log(`Unknown VM power state: ${currentState}`);
    }
  }

  public powerOnVm(vm: VcVirtualMachine): void {
    try {
      const task = vm.powerOnVM_Task(null);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      System.log("Successfully powered on VM");
    } catch (e) {
      throw new Error(`Failed to power on VM: ${e}`);
    }
  }

  public handlePoweredOnVm(vm: VcVirtualMachine, shutdownTimeout: number): void {
    try {
      System.getModule("com.vmware.library.vc.vm.tools").vim3WaitToolsStarted(vm, 2, 5);
      const vmToolsRunning = vm.vmToolsStatus === "guestToolsRunning";

      if (vmToolsRunning) {
        this.shutdownVmGracefully(vm, shutdownTimeout);
      } else {
        this.powerOffVmUngracefully(vm);
      }
    } catch (e) {
      System.log(`Failed to wait for vmtools: ${e}. Will try to force shutdown`);
      try {
        this.powerOffVmUngracefully(vm);
      } catch (e) {
        throw new Error(`Failed to power off VM '${vm.name}': ${e}`);
      }
      System.log(`VM '${vm.name}' powered off successfully`);
    }
  }

  public shutdownVmGracefully(vm: VcVirtualMachine, shutdownTimeout: number): void {
    try {
      System.getModule("com.vmware.library.vc.vm.power").shutdownVMAndForce(vm, shutdownTimeout, 2);
      System.log("Successfully powered off VM");
    } catch (e) {
      throw new Error(`Failed to power off VM: ${e}`);
    }
  }

  public powerOffVmUngracefully(vm: VcVirtualMachine): void {
    try {
      const task = System.getModule("com.vmware.library.vc.vm.power").forcePowerOff(vm);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
    } catch (e) {
      throw new Error(`Failed to power off VM: ${e}`);
    }
  }

  public prepareVmDiskPersistency(devices: VcVirtualDisk[]): VcVirtualMachineConfigSpec {
    // if (vm.snapshot != null) {
    //   throw new Error(`Disks cannot be converted because the virtual machine has at least one snapshot`);
    // }
    const configSpec: VcVirtualMachineConfigSpec = new VcVirtualMachineConfigSpec();
    const deviceConfigSpecs = [];
    devices.forEach((device) => {
      if (device.backing instanceof VcVirtualDiskFlatVer2BackingInfo && device.backing.diskMode !== "persistent") {
        device.backing.diskMode = `persistent`;
        const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
        deviceConfigSpec.device = device;
        deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.edit;
        deviceConfigSpecs.push(deviceConfigSpec);
      }
    });
    configSpec.deviceChange = deviceConfigSpecs;
    return configSpec;
  }

  public changeVmDiskPersistency(configSpec: VcVirtualMachineConfigSpec, vm: VcVirtualMachine): void {
    try {
      const task: VcTask = vm.reconfigVM_Task(configSpec);
      if (task) {
        System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
        System.log("Disks have been converted to persistent");
      }
    } catch (e) {
      throw new Error(`Failed to convert virtual machine disks. ${e}`);
    }
  }

  public checkVmToolsStatus(vm: VcVirtualMachine, vmtoolsTimeout: number) {
    try {
      System.getModule("com.vmware.library.vc.vm.tools").vim3WaitToolsStarted(vm, 2, vmtoolsTimeout);
    } catch (e) {
      const toolsStatus = vm.guest.toolsStatus.value;
      throw new Error(`VMTools status: ${toolsStatus}. ${e}`);
    }
  }
}
