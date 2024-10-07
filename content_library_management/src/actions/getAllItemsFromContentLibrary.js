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
 * @param {string} endpoint - vCenter endpoint
 * @param {string} contentLibraryName - Content Library Name
 * @param {string} contentLibraryType - Content Library Type: LOCAL or SUBSCRIBED
 * @returns {Array/string} - Number of disks attached to the specified controller
 */
(function (endpoint, contentLibraryName, contentLibraryType) {
  // Main function to fetch OVF library items
  if (!validateParameters(endpoint, contentLibraryName, contentLibraryType)) {
    throw new Error("Mandatory parameter is not defined. Ensure 'endpoint', 'contentLibraryName', and 'contentLibraryType' are provided.");
  }

  var vapiEndpointObject = findEndpoint(endpoint);
  var client = vapiEndpointObject.client();

  try {
    var contentLibraries = findContentLibraries(client, contentLibraryName, contentLibraryType);
    if (!contentLibraries.length) {
      System.log("No content libraries found.");
      return [];
    }

    var ovfLibraryItems = getOvfLibraryItems(client, contentLibraries);
    return ovfLibraryItems.sort();
  } catch (error) {
    System.error("Error occurred: " + error.message);
    throw error;
  } finally {
    client.close();
  }

  // Function to validate input parameters
  function validateParameters(endpoint, contentLibraryName, contentLibraryType) {
    return endpoint && contentLibraryName && contentLibraryType;
  }

  // Function to find the endpoint
  function findEndpoint(endpoint) {
    var vapiEndpointObject = VAPIManager.findEndpoint(endpoint);
    if (!vapiEndpointObject) {
      throw new Error("Failed to find vAPI endpoint: " + endpoint);
    }
    System.log("vAPI Endpoint: " + vapiEndpointObject.endpointUrl);
    return vapiEndpointObject;
  }

  // Function to find content libraries
  function findContentLibraries(client, contentLibraryName, contentLibraryType) {
    var contentLibrarySpec = new com_vmware_content_library_find__spec(client);
    var libraryType = new com_vmware_content_library__model_library__type();

    contentLibrarySpec.name = contentLibraryName;
    contentLibrarySpec.type = libraryType[contentLibraryType];

    var contentLibraryService = new com_vmware_content_library(client);
    var libraries = contentLibraryService.find(contentLibrarySpec);

    System.log("Found content libraries IDs: " + (libraries.map((lib) => lib).join(", ") || "none"));
    return libraries;
  }

  // Function to get OVF library items from found libraries
  function getOvfLibraryItems(client, libraries) {
    var libraryItemService = new com_vmware_content_library_item(client);
    var ovfLibraryItems = [];

    libraries.forEach(function (library) {
      var items = libraryItemService.list(library);

      if (items && items.length > 0) {
        items.forEach(function (item) {
          var ovfItem = libraryItemService.get(item.toLowerCase());
          System.log("Found content library item: " + ovfItem.name);
          ovfLibraryItems.push(ovfItem.name);
        });
      } else {
        System.log("No items found in content library: " + library.name);
      }
    });

    return ovfLibraryItems;
  }
});
