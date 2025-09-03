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
 * @param {string} contentLibraryName - Content Library Name
 * @returns {string} - Content Library Type
 */
(function (vapiEndpoint, contentLibraryName) {
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
    return findContentLibraryType(client, contentLibraries, contentLibraryName);
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
    return vapiEndpointObject;
  }

  function findContentLibraryObjects(client) {
    var contentLibraryService = new com_vmware_content_library(client);
    return contentLibraryService.list();
  }

  function findContentLibraryType(client, libraries, contentLibraryName) {
    var contentLibraryService = new com_vmware_content_library(client);

    // Filter libraries by name
    var matchingLibraries = libraries.filter(function (libraryId) {
      return contentLibraryService.get(libraryId).name === contentLibraryName;
    });

    // Map to extract the 'type' of the matching libraries
    return matchingLibraries.map(function (libraryId) {
      return contentLibraryService.get(libraryId).type;
    });
  }
});
