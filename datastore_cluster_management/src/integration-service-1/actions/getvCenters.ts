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
 *
 * @return {Array/string}
 */
(function () {
  const sdkConnections = Server.findAllForType('VC:SdkConnection') as VcSdkConnection[];
  const vcNames = sdkConnections.map(vc =>
    vc.id
  );
  return vcNames;
});
