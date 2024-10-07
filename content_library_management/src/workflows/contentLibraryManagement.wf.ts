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
  attributes: {
    field1: {
      type: string,
      bind: true,
      value: "MyOrg/MyProject/field1"
    }
  },
  input: {
    foo: {
      type: "string",
      availableValues: ["a", "b"],
      defaultValue: "а",
      description: "foo Value",
      required: true,
      title: "Foo"
    },
    bar: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(foo: string, bar: string, field1: string, @Out result: any): void {
    System.log(`foo=${foo}, bar=${bar}, field1=${field1}`);
    result = "result value";
  }
}
