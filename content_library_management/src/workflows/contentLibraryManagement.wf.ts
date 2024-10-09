/*-
 * #%L
 * content_library_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Content Library Management",
  path: "MyOrg/MyProject",
  id: "",
  description: "Get items from the content library",
  input: {
    contentLibraryName: {
      type: "string",
      required: true,
      description: "Name of the content library"
    },
    contentLibraryItems: {
      type: "string",
      required: true,
      description: "VAPI Endpoint"
    },
    vapiEndpoint: {
      type: "string"
    }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(contentLibraryItems: string, @Out result: any): void {
    System.log(contentLibraryItems);
  }
}
