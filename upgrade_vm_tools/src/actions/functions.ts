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
    if (allowUpgradePoweredOffVm || vm.runtime.powerState.value == "poweredOn") return true;
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
  private getVmParentHost(vm: VcVirtualMachine): VcHostSystem {
    if (vm.runtime && vm.runtime.host) {
      System.log(`Host: ${vm.runtime.host.name}`);
      return vm.runtime.host;
    } else {
      throw new Error("Failed to get VM parent host");
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
      throw new Error("Hostsystem does not have a compute resource");
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
}
