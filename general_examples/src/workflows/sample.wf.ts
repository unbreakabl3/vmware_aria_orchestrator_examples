/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Sample Workflow",
  path: "MyOrg/MyProject",
  id: "",
  description: "Sample workflow description",
  attributes: {},
  input: {
    vmName: { type: "string" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(vmName: string, @Out result: any): void {
    System.log(`vmName=${vmName}`);
    result = "result value";
  }
}
