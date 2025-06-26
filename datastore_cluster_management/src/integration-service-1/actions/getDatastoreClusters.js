/*-
 * #%L
 * datastore_cluster_management
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * @param {string} vCenter - vCenter name
 *
 * @return {Array/string}
 */
(function (vCenter) {
  if (!vCenter) return [""];
  let datastoreClusters = [];

  if (vCenter) {
    const sdkConnection = System.getModule('com.examples.vmware_aria_orchestrator_examples.actions')
      .vcSdkManagement()
      .VcSdkManagement.prototype.getVcSdkConnectionByName(vCenter);
    datastoreClusters = sdkConnection.getAllVimManagedObjects("StoragePod", null, null);
  } else {
    datastoreClusters = VcPlugin.getAllVimManagedObjects("StoragePod", null, null);
  }

  if (datastoreClusters.length !== 0) {
    let datastoreClusterNames = [];
    for (var i = 0; i < datastoreClusters.length; i++) {
      datastoreClusterNames.push(datastoreClusters[i].name);
    }
    return datastoreClusterNames;
  }
});
