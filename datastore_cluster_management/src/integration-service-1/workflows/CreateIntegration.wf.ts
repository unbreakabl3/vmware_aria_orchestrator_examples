/*-
 * #%L
 * datastore_cluster_management
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Out, Workflow } from "vrotsc-annotations";
import { DatastoreClusterManagement } from "../classes/datastoreClusterManagement";

@Workflow({
  name: "Datastore Cluster Management Workflow",
  path: "MyOrg/MyProject",
  id: "",
  description: "Sample workflow description",
  attributes: {
    // field1: {
    //   type: string,
    //   bind: true,
    //   value: "PSCoE/my-project/field1"
    // }
  },
  input: {
    datastoreClusterName: {
      type: "string",
      title: "Foo"
    },
    vCenter: {
      type: "string",
      title: "vCenter"
    },
    defaultVmBehavior: { type: "string" },
    ioLoadImbalanceThreshold: { type: "number" },
    ioLatencyThreshold: { type: "number" },
    minSpaceUtilizationDifference: { type: "number" },
    spaceThresholdMode: { type: "string" },
    freeSpaceThresholdGB: { type: "number" },
    spaceUtilizationThreshold: { type: "number" },
    ioLoadBalanceEnabled: { type: "boolean" },
    defaultIntraVmAffinity: { type: "boolean" },
    loadBalanceInterval: { type: "number" },
    isEnabled: { type: "boolean" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class DatastoreClusterManagementWorkflow {
  public install(
    datastoreClusterName: string,
    vCenter: string,
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
    isEnabled: boolean,
    @Out result: any
  ): void {
    const sdkConnection: VcSdkConnection = System.getModule('com.examples.vmware_aria_orchestrator_examples.actions')
      .vcSdkManagement()
      .VcSdkManagement.prototype.getVcSdkConnectionByName(vCenter);
    const datastoreCluster = new DatastoreClusterManagement();
    datastoreCluster.configureStorageDrsForPod(
      sdkConnection,
      datastoreClusterName,
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
    );
  }
}
