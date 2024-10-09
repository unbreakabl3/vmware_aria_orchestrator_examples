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
 * @returns {Array/string} - Array of all VAPI endpoints
 */
(function () {
  let vapiEndpoints = [];

  try {
    vapiEndpoints = Server.findAllForType("VAPI:VAPIEndpoint");
  } catch (e) {
    throw new Error(`Failed to retrieve vAPI Endpoints: ${e.message || e}`);
  }

  return vapiEndpoints.length ? vapiEndpoints.map((endpoint) => endpoint.name) : [];
});
