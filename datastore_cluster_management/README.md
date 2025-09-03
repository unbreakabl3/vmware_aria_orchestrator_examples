# datastore_cluster_management

This package provides vRealize Orchestrator (vRO) actions and a helper class to discover vCenter SDK connections, list datastore clusters (Storage Pods), and configure Storage DRS (Storage Distributed Resource Scheduler) settings on a Storage Pod.

## What it does

- Discover vCenter SDK connections available in the vRO Server.
- List Storage Pods (datastore clusters) for a selected vCenter.
- Build a Storage DRS configuration spec and apply it to a Storage Pod using the vCenter SDK.

## Actions

### getvCenters

- Signature: () -> string[]
- Behavior: finds all `VC:SdkConnection` objects on the vRO Server and returns their `id` values. These ids are used as the `vCenter` parameter by other actions.

Example return value:

```
["vcenter-1", "vcenter-2"]
```

### getDatastoreClusters

- Signature: (vCenter: string) -> string[] | [""]
- Parameters:
	- `vCenter` — the vCenter id/name returned by `getvCenters`.
- Behavior: when a `vCenter` id is provided the action resolves the SDK connection and calls `getAllVimManagedObjects("StoragePod")` to list Storage Pods, then returns an array of their names. If `vCenter` is not provided the action returns [""] (useful as an empty selection placeholder in forms).

Example return value:

```
["Datastore Cluster A", "Datastore Cluster B"]
```

## DatastoreClusterManagement class

- Location: `src/integration-service-1/classes/datastoreClusterManagement.ts`
- Purpose: build a `VcStorageDrsConfigSpec` from supplied parameters and call `configureStorageDrsForPod_Task` on the vCenter `StorageResourceManager` to apply Storage DRS settings to a Storage Pod.

Main method: `configureStorageDrsForPod(params)`

Inputs (object):

- `vc: VcSdkConnection` — the vCenter SDK connection object
- `datastoreClusterName: string` — Storage Pod name to configure
- `defaultVmBehavior: string`
- `ioLoadImbalanceThreshold: number`
- `ioLatencyThreshold: number`
- `minSpaceUtilizationDifference: number`
- `spaceThresholdMode: string`
- `freeSpaceThresholdGB: number`
- `spaceUtilizationThreshold: number`
- `ioLoadBalanceEnabled: boolean`
- `defaultIntraVmAffinity: boolean`
- `loadBalanceInterval: number` (seconds)
- `isEnabled: boolean`

Behavior details:

- The class finds the Storage Pod by name using an XPath name match; if no pod or multiple pods are found it throws an Error asking for a unique name.
- It creates `VcStorageDrsIoLoadBalanceConfig` and `VcStorageDrsSpaceLoadBalanceConfig` and combines them into a `VcStorageDrsPodConfigSpec`, then into a `VcStorageDrsConfigSpec`.
- Calls `managedObject.configureStorageDrsForPod_Task(pod, spec, true)` and returns the `VcTask` so callers can monitor the operation.

## Example usage (workflow / action)

1) Use `getvCenters()` to populate a vCenter dropdown.
2) Use `getDatastoreClusters(selectedVc)` to populate datastore cluster choices.
3) Construct the parameters and call the class method (or wrap it in an action) to apply the Storage DRS configuration.

Sample parameter object:

```
{
	"vc": <VcSdkConnection object>,
	"datastoreClusterName": "Datastore Cluster A",
	"defaultVmBehavior": "manual",
	"ioLoadImbalanceThreshold": 10,
	"ioLatencyThreshold": 20,
	"minSpaceUtilizationDifference": 5,
	"spaceThresholdMode": "percent",
	"freeSpaceThresholdGB": 50,
	"spaceUtilizationThreshold": 80,
	"ioLoadBalanceEnabled": true,
	"defaultIntraVmAffinity": false,
	"loadBalanceInterval": 3600,
	"isEnabled": true
}
```

## Notes

- This code is intended to run inside vRealize Orchestrator where types such as `VcSdkConnection`, `VcStoragePod`, `VcStorageDrsConfigSpec`, etc. are available.
- `getDatastoreClusters` intentionally returns [""] when `vCenter` is not provided; this pattern is commonly used to show an empty/placeholder option in vRO form inputs.

## Files of interest

- `src/integration-service-1/actions/getvCenters.ts` — discover vCenter SDK connections
- `src/integration-service-1/actions/getDatastoreClusters.js` — list Storage Pods for a vCenter
- `src/integration-service-1/classes/datastoreClusterManagement.ts` — build and apply Storage DRS specs

