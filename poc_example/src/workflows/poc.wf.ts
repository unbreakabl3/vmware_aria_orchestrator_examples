/*-
 * #%L
 * poc_example
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";
import { Functions } from "../actions/functions";

@Workflow({
  name: "POC Example",
  path: "MyOrg/MyProject",
  id: "",
  description: "Create a new virtual machine for POC",
  attributes: {},
  input: {
    vm_in: {
      type: "VC:VirtualMachine",
      description: "VM Name",
      required: true
    },
    decommissionDate_in: {
      type: "Date",
      description: "Automatic Decommissioning Target Date",
      required: true
    },
    decommissionDelay_in: {
      type: "number",
      description: "Days until decommissioning",
      required: true
    },
    isPOC_in: {
      type: "boolean",
      description: "Is this resource deployed for a Proof of Concept (POC)?",
      required: false,
      defaultValue: "false"
    }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class Main {
  public install(decommissionDate_in: Date, isPOC_in: boolean, decommissionDelay_in: number, vm_in: VcVirtualMachine, @Out result: any): void {
    const func = new Functions();
    const decommissionWf = "f87bedce-cf1f-3964-8a7d-xxxxxxxx"; // 'Decommissions VM' workflow ID

    if (isPOC_in) {
      System.log(`The POC VM named '${vm_in.name}' has been scheduled for decommissioning on ${decommissionDate_in}.`);
      func.executeDecommissionWorkflow(vm_in, decommissionWf, decommissionDate_in, decommissionDelay_in);
    }
  }
}
