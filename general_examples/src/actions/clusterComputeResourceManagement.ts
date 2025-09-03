/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */

export class InvalidClusterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidClusterError";
  }
}

export class ClusterComputeResourceManagement {
  private handleError(errorDescription: string): never {
    throw new InvalidClusterError(`Error: ${errorDescription}.`);
  }

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

  /**
   * Retrieves all vCenter hosts within a specified cluster.
   *
   * @param {VcClusterComputeResource} cluster - The cluster from which to retrieve the hosts.
   * @returns {Array<VcHostSystem>} An array of vCenter host systems within the specified cluster.
   * @throws Will throw an error if the cluster input is not provided or is invalid.
   */
  public getAllvcHostsOfCluster(cluster: VcClusterComputeResource): Array<VcHostSystem> {
    if (!cluster) {
      throw "Cluster input is not provided or is invalid.";
    }

    const hosts: Array<VcHostSystem> = cluster.host;

    if (!hosts || hosts.length === 0) {
      this.handleError(`No hosts found in the cluster '${cluster.name}'`);
      return [];
    } else {
      System.log(`${hosts.length} hosts found in the cluster '${cluster.name}'`);
      return hosts;
    }
  }
}
