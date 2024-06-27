/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class ClusterComputeResourceManagement {
  private getClusterOfVm(vm: VcVirtualMachine): VcManagedEntity {
    if (!vm) {
      throw new Error("Required parameter vm is not defined");
    }

    let parent: VcHostSystem = vm.runtime.host;
    let cluster: VcManagedEntity | null = null;
    //@ts-ignore
    while (parent !== null && !(parent instanceof VcClusterComputeResource)) {
      cluster = parent.parent;
    }

    if (!cluster) throw "Cluster could not be found for VM '" + vm.name + "'";
    return cluster;
  }

  public setVmHardwareVersion(cluster: VcClusterComputeResource, defaultHardwareVersion: string, maxHardwareVersion: string): void {
    if (!cluster) {
      throw new Error("Invalid cluster resource provided.");
    }
    const spec = new VcComputeResourceConfigSpec();
    //@ts-ignore
    spec.maximumHardwareVersionKey = maxHardwareVersion;
    //@ts-ignore
    spec.defaultHardwareVersionKey = defaultHardwareVersion;
    //@ts-ignore
    try {
      const task = cluster.reconfigureComputeResource_Task(spec, true);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
      System.log("Cluster was successfully configured");
    } catch (e) {
      throw new Error(`Failed to reconfigure cluster: ${e}`);
    }
  }
}
