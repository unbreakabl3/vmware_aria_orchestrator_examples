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
 * @returns {Array/string} - Array of content library objects
 */
(function (vapiEndpoint, contentLibraryName) {
  // Main function to fetch OVF library items
  if (!validateParameters(vapiEndpoint, contentLibraryName)) {
    return [];
  }

  var vapiEndpointObject = findEndpoint(vapiEndpoint);
  var client = vapiEndpointObject.client();

  try {
    var contentLibraries = findContentLibraries(client, contentLibraryName, vapiEndpoint);
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
  function validateParameters(vapiEndpoint, contentLibraryName) {
    return vapiEndpoint && contentLibraryName;
  }

  // Function to find the vapiEndpoint
  function findEndpoint(vapiEndpoint) {
    var vapiEndpointObject = VAPIManager.findEndpoint(vapiEndpoint);
    if (!vapiEndpointObject) {
      throw new Error("Failed to find  VAPI Endpoint: " + vapiEndpoint);
    }
    System.log("VAPI Endpoint: " + vapiEndpointObject.endpointUrl);
    return vapiEndpointObject;
  }

  // Function to find content libraries
  function findContentLibraries(client, contentLibraryName, vapiEndpoint) {
    var contentLibrarySpec = new com_vmware_content_library_find__spec(client);
    contentLibrarySpec.name = contentLibraryName;
    contentLibrarySpec.type = String(setLibraryType(vapiEndpoint, contentLibraryName));
    var contentLibraryService = new com_vmware_content_library(client);
    var libraries = contentLibraryService.find(contentLibrarySpec);
    return libraries;
  }

  function setLibraryType(vapiEndpoint, contentLibraryName) {
    return System.getModule("com.clouddepth.content_library_management.actions").getContentLibraryType(vapiEndpoint, contentLibraryName);
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
