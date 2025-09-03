/*-
 * #%L
 * upgrade_vm_tools
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class Functions {
  /**
   * upgradePoweredOfVMs
   */

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

  public isVmTemplate(vm: VcVirtualMachine): boolean {
    System.log(`VM template: ${vm.isTemplate}`);
    if (vm.isTemplate !== undefined) {
      return vm.isTemplate;
    } else {
      throw new Error("VM property isTemplate is missing."); // Or return a default value (e.g., false)
    }
  }

  public convertTemplateToVm({ vm, pool, host }: { vm: VcVirtualMachine; pool: VcResourcePool; host: VcHostSystem }): void {
    System.log(`pool: ${pool.name}`);
    try {
      vm.markAsVirtualMachine(pool, host);
      System.log("Converted template to VM");
    } catch (error) {
      throw new Error(`Failed to convert template to VM: ${error}`);
    }
  }

  public convertVmToTemplate(vm: VcVirtualMachine): void {
    try {
      vm.markAsTemplate();
      System.log("Converted VM to template");
    } catch (error) {
      throw new Error(`Failed to convert VM to template: ${error}`);
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

  public getVmDisks(vm: VcVirtualMachine): Array<VcVirtualDisk> | undefined {
    const devices: Array<VcVirtualDisk> = [];
    if (vm.config && vm.config.hardware && vm.config.hardware.device) {
      for (const device of vm.config.hardware.device) {
        if (device instanceof VcVirtualDisk) {
          devices.push(device);
        }
      }
      return devices;
    }
  }

  public getVmNonPersistentDisks(disks: Array<VcVirtualDisk>, diskPersistencyType: string): Array<VcVirtualDisk> {
    const nonPersistentDisks: Array<VcVirtualDisk> = [];
    disks.forEach((disk) => {
      if (disk.backing instanceof VcVirtualDiskFlatVer2BackingInfo && disk.backing.diskMode !== diskPersistencyType) {
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
      System.log("VM was powered on successfully");
    } catch (e) {
      throw new Error(`Failed to power on VM: ${e}`);
    }
  }

  public handlePoweredOnVm(vm: VcVirtualMachine, shutdownTimeout: number): void {
    System.getModule("com.vmware.library.vc.vm.tools").vim3WaitToolsStarted(vm, 2, 5);
    const vmToolsRunning = vm.vmToolsStatus === "guestToolsRunning";
    try {
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

  public handleSuspendedVm(vm: VcVirtualMachine): void {
    try {
      vm.suspendVM_Task();
      System.log("VM was suspended successfully");
    } catch (e) {
      throw new Error(`Failed to suspend VM '${vm.name}': ${e}`);
    }
  }

  public shutdownVmGracefully(vm: VcVirtualMachine, shutdownTimeout: number): void {
    try {
      System.getModule("com.vmware.library.vc.vm.power").shutdownVMAndForce(vm, shutdownTimeout, 2);
      System.log("VM was powered off successfully");
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

  public prepareVmDiskPersistency(devices: Array<VcVirtualDisk>, diskPersistencyType: string): VcVirtualMachineConfigSpec {
    const configSpec: VcVirtualMachineConfigSpec = new VcVirtualMachineConfigSpec();
    const deviceConfigSpecs: VcVirtualDeviceConfigSpec[] = [];
    devices.forEach((device) => {
      if (device.backing instanceof VcVirtualDiskFlatVer2BackingInfo && device.backing.diskMode !== diskPersistencyType) {
        device.backing.diskMode = diskPersistencyType;
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
        System.log("Disks have been converted");
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
      throw new Error(`VMTools status: ${toolsStatus}: ${e}`);
    }
  }

  public upgradeVmTools({ vm, allowReboot = false, waitForTools }: { vm: VcVirtualMachine; allowReboot: boolean; waitForTools: boolean }): boolean {
    const toolsStatus = vm.guest.toolsVersionStatus2;
    System.log("tools status: " + toolsStatus);
    switch (toolsStatus) {
      case "guestToolsSupportedNew":
        System.log("VMtools are newer than available. Skipping the upgrade");
      case "guestToolsUnmanaged":
        System.log("3rd party managed VMtools (open-vm-tools). Skipping the upgrade");
      case "guestToolsCurrent":
        System.log("VMware Tools are already running and up to date. Nothing to do.");
        return true;
      case "guestToolsBlacklisted":
      case "guestToolsNeedUpgrade":
      case "guestToolsSupportedOld":
        System.log("Starting VMware Tools upgrade...");
        const upgradeArgs = allowReboot ? "/s /vqn" : '/s /v"/qn REBOOT=ReallySuppress"';
        try {
          const task = vm.upgradeTools_Task(upgradeArgs);
          System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
          System.log("VMware Tools have been upgraded.");

          if (waitForTools) {
            System.getModule("com.vmware.library.vc.vm.tools").vim3WaitToolsStarted(vm, 2, 10);
          }
          return true;
        } catch (e) {
          throw new Error(`Failed to upgrade VMware Tools: ${e}`);
        }

      case "guestToolsNotInstalled":
        throw new Error(`Unable to upgrade VMware Tools because they are not currently installed.`);

      default:
        throw new Error(`Unexpected VMware Tools status: ${toolsStatus}`);
    }
  }

  public setVmToolsUpgradePolicy(vm: VcVirtualMachine, desiredVmToolsUpgradePolicy: string) {
    const currentVmToolsUpgradePolicy = vm.config.tools.toolsUpgradePolicy;
    if (currentVmToolsUpgradePolicy === desiredVmToolsUpgradePolicy) {
      System.log(`VMTools upgrade policy is already set to '${desiredVmToolsUpgradePolicy}'. No changes needed.`);
      return;
    }

    System.log(`Current VMTools upgrade policy is '${currentVmToolsUpgradePolicy}'. Updating to '${desiredVmToolsUpgradePolicy}'.`);
    const configSpec = new VcVirtualMachineConfigSpec();
    const toolsSpec = new VcToolsConfigInfo();
    toolsSpec.toolsUpgradePolicy = desiredVmToolsUpgradePolicy;
    configSpec.tools = toolsSpec;

    try {
      const task = vm.reconfigVM_Task(configSpec);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      System.log(`Successfully set VMTools upgrade policy to '${desiredVmToolsUpgradePolicy}'.`);
    } catch (e) {
      throw new Error(`Failed to set VMTools upgrade policy to '${desiredVmToolsUpgradePolicy}': ${e}`);
    }
  }

  public createVmSnapshot({ vm, name, description, memory, quiesce }: { vm: VcVirtualMachine; name: string; description: string; memory: boolean; quiesce: boolean }) {
    if (!vm.name || !name || !description) {
      throw new Error("Required parameters are missing");
    }
    try {
      const task: VcTask = vm.createSnapshot_Task(name, description, memory, quiesce);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      System.log(`Creating snapshot '${name}' on VM '${vm.name} was completed successfully'`);
    } catch (error) {
      throw new Error(`Failed to create snapshot '${name}' on VM '${vm.name}': ${error}`);
    }
  }

  private getVmSnapshot(vm: VcVirtualMachine): VcVirtualMachineSnapshot[] {
    const snapshots: VcVirtualMachineSnapshot[] = [];
    if (vm?.snapshot?.rootSnapshotList) {
      const snapshotsTree = function traverseSnapshotTree(tree: VcVirtualMachineSnapshotTree) {
        snapshots.push(tree.snapshot);
        const childTrees: VcVirtualMachineSnapshotTree[] = tree.childSnapshotList?.filter(Boolean);
        if (childTrees?.length) {
          childTrees.forEach(traverseSnapshotTree);
        }
      };
      vm.snapshot.rootSnapshotList.forEach(snapshotsTree);
    }
    return snapshots;
  }

  public removeSnapshot({ vm, removeChildren, consolidate, snapshotName }: { vm: VcVirtualMachine; removeChildren: boolean; consolidate: boolean; snapshotName: string }): void {
    const vmSnapshots: VcVirtualMachineSnapshot[] = this.getVmSnapshot(vm);
    if (!vmSnapshots) return;
    vmSnapshots.forEach((snapshot) => {
      if (snapshot.name === snapshotName) {
        try {
          const task = snapshot.removeSnapshot_Task(removeChildren, consolidate);
          System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
          System.log(`Snapshot '${snapshotName}' was removed successfully`);
        } catch (error) {
          const errorMessage = `Failed to remove snapshot '${snapshotName}' on VM '${vm.name}': ${error instanceof Error ? error.message : String(error)}`;
          throw new Error(errorMessage);
        }
      }
    });
  }
}
