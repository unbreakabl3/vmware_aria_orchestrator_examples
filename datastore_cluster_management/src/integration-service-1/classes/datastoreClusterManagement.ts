/*-
 * #%L
 * datastore_cluster_management
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class DatastoreClusterManagement {
  public configureStorageDrsForPod(
    vc: VcSdkConnection,
    datastoreClusterName: string,
    defaultVmBehavior: string,
    ioLoadImbalanceThreshold: number,
    ioLatencyThreshold: number,
    minSpaceUtilizationDifference: number,
    spaceThresholdMode: string,
    freeSpaceThresholdGB: number,
    spaceUtilizationThreshold: number,
    ioLoadBalanceEnabled: boolean,
    defaultIntraVmAffinity: boolean,
    loadBalanceInterval: number,
    isEnabled: boolean
  ): VcTask {
    const managedObject: VcStorageResourceManager = vc.storageResourceManager;
    const pod: VcStoragePod = this.findStoragePod(vc, datastoreClusterName);
    const storageDrsConfigSpec = {
      defaultVmBehavior,
      ioLoadImbalanceThreshold,
      ioLatencyThreshold,
      minSpaceUtilizationDifference,
      spaceThresholdMode,
      freeSpaceThresholdGB,
      spaceUtilizationThreshold,
      ioLoadBalanceEnabled,
      defaultIntraVmAffinity,
      loadBalanceInterval,
      isEnabled
    };
    const spec: VcStorageDrsConfigSpec = this.buildStorageDrsConfigSpec(storageDrsConfigSpec);
    const modify = true;
    return managedObject.configureStorageDrsForPod_Task(pod, spec, modify);
  }

  public findStoragePod(vCenter: VcSdkConnection, storagePodName: string): VcStoragePod {
    const storagePods = vCenter.getAllVimManagedObjects('StoragePod', [], "xpath:name[matches(.,'" + storagePodName + "')]");
    if (storagePods.length === 0) {
      throw new Error(`Storage Pod with name ${storagePodName} not found.`);
    }
    if (storagePods.length > 1) {
      throw new Error(`Multiple Storage Pods found with name ${storagePodName}. Please specify a unique name.`);
    }
    return storagePods[0] as VcStoragePod;
  }

  public buildStorageDrsConfigSpec({
    defaultVmBehavior,
    ioLoadImbalanceThreshold,
    ioLatencyThreshold,
    minSpaceUtilizationDifference,
    spaceThresholdMode,
    freeSpaceThresholdGB,
    spaceUtilizationThreshold,
    ioLoadBalanceEnabled,
    defaultIntraVmAffinity,
    loadBalanceInterval,
    isEnabled
  }: {
    defaultVmBehavior: string;
    ioLoadImbalanceThreshold: number;
    ioLatencyThreshold: number;
    minSpaceUtilizationDifference: number;
    spaceThresholdMode: string;
    freeSpaceThresholdGB: number;
    spaceUtilizationThreshold: number;
    ioLoadBalanceEnabled: boolean;
    defaultIntraVmAffinity: boolean;
    loadBalanceInterval: number;
    isEnabled: boolean;
  }): VcStorageDrsConfigSpec {
    const spec = new VcStorageDrsConfigSpec();
    const podConfig = new VcStorageDrsPodConfigSpec();
    const spaceLoadBalanceConfig = { minSpaceUtilizationDifference, spaceThresholdMode, freeSpaceThresholdGB, spaceUtilizationThreshold };

    podConfig.defaultVmBehavior = defaultVmBehavior;
    podConfig.ioLoadBalanceConfig = this.buildIoLoadBalanceConfig(ioLoadImbalanceThreshold, ioLatencyThreshold);
    podConfig.spaceLoadBalanceConfig = this.buildSpaceLoadBalanceConfig(spaceLoadBalanceConfig);
    podConfig.ioLoadBalanceEnabled = ioLoadBalanceEnabled;
    podConfig.defaultIntraVmAffinity = defaultIntraVmAffinity;
    podConfig.automationOverrides = new VcStorageDrsAutomationConfig();
    podConfig.loadBalanceInterval = loadBalanceInterval;
    podConfig.enabled = isEnabled;

    spec.podConfigSpec = podConfig;

    return spec;
  }

  public buildIoLoadBalanceConfig(ioLoadImbalanceThreshold: number, ioLatencyThreshold: number): VcStorageDrsIoLoadBalanceConfig {
    const config = new VcStorageDrsIoLoadBalanceConfig();
    config.ioLoadImbalanceThreshold = ioLoadImbalanceThreshold;
    config.ioLatencyThreshold = ioLatencyThreshold;
    return config;
  }

  public buildSpaceLoadBalanceConfig({
    minSpaceUtilizationDifference,
    spaceThresholdMode,
    freeSpaceThresholdGB,
    spaceUtilizationThreshold
  }: {
    minSpaceUtilizationDifference: number;
    spaceThresholdMode: string;
    freeSpaceThresholdGB: number;
    spaceUtilizationThreshold: number;
  }): VcStorageDrsSpaceLoadBalanceConfig {
    const config = new VcStorageDrsSpaceLoadBalanceConfig();
    config.minSpaceUtilizationDifference = minSpaceUtilizationDifference;
    config.spaceThresholdMode = spaceThresholdMode;
    config.freeSpaceThresholdGB = freeSpaceThresholdGB;
    config.spaceUtilizationThreshold = spaceUtilizationThreshold;
    return config;
  }
}
