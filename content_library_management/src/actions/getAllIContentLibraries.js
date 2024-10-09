/*-
 * #%L
 * content_library_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * @param {string} vapiEndpoint - vCenter VAPI Endpoint Name
 * @returns {Array/string} - Arrays of all content libraries
 */
(function (vapiEndpoint) {
  // Main function to fetch OVF library items
  if (!validateParameters(vapiEndpoint)) {
    return [];
  }
  var vapiEndpointObject = findEndpoint(vapiEndpoint);
  var client = vapiEndpointObject.client();
  try {
    var contentLibraries = findContentLibraryObjects(client);
    if (!contentLibraries.length) {
      System.log("No content libraries found.");
      return [];
    }
    var ovfLibraryItems = findContentLibraryNames(client, contentLibraries);
    return ovfLibraryItems.sort();
  } catch (error) {
    System.error("Error occurred: " + error.message);
    throw error;
  } finally {
    client.close();
  }
  // Function to validate input parameters
  function validateParameters(vapiEndpoint) {
    return vapiEndpoint;
  }
  // Function to find the vapiEndpoint
  function findEndpoint(vapiEndpoint) {
    var vapiEndpointObject = VAPIManager.findEndpoint(vapiEndpoint);
    if (!vapiEndpointObject) {
      throw new Error("Failed to find vapiEndpoint: " + vapiEndpoint);
    }
    System.log("VAPI Endpoint: " + vapiEndpointObject.endpointUrl);
    return vapiEndpointObject;
  }

  function findContentLibraryObjects(client) {
    var contentLibraryService = new com_vmware_content_library(client);
    return contentLibraryService.list();
  }

  function findContentLibraryNames(client, libraries) {
    var contentLibraryService = new com_vmware_content_library(client);
    return libraries.map(function (libraryId) {
      return contentLibraryService.get(libraryId).name;
    });
  }
});
