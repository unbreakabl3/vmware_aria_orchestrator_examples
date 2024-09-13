/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";
import { DiskManagement } from "../actions/diskManagement";

@Workflow({
  name: "Disk Management",
  path: "MyOrg/MyProject",
  id: "",
  description: "Sample workflow description",
  input: {
    vm: { type: "VC:VirtualMachine" },
    deviceUnitNumber: { type: "number" }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class SampleWorkflow {
  public install(vm: VcVirtualMachine, deviceUnitNumber: number, @Out result: any): void {
    const diskManagement = new DiskManagement();
    const configSpec = diskManagement.createDisk(vm, deviceUnitNumber);
    diskManagement.reconfigureVM(vm, configSpec);
  }
}
