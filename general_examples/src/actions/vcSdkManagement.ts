/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class VcSdkManagement {
  /**
   * Get SDK connection object by provided vCenter name
   * @param sdkConnectionName {string} - vCenter name
   * @returns {VcSdkConnection} - SDK object
   * @throws {Error} If the parameter is missing or no match is found
   */
  getVcSdkConnectionByName(sdkConnectionName: string): VcSdkConnection {
    if (!sdkConnectionName?.trim()) {
      throw new Error('Mandatory parameter "sdkConnectionName" is not defined or empty');
    }

    const normalizedName = sdkConnectionName.trim().toLowerCase();
    System.log(`Looking for SDK connection with name: ${normalizedName}`);

    const sdkConnections = Server.findAllForType('VC:SdkConnection') as VcSdkConnection[];
    const matchedConnection = sdkConnections.find(connection =>
      connection.sdkId?.toLowerCase() === normalizedName
    );

    if (!matchedConnection) {
      throw new Error(`No SDK connection found with name "${sdkConnectionName}"`);
    }

    System.log(`Found SDK connection: ${matchedConnection.sdkId}`);
    return matchedConnection;
  }
}
