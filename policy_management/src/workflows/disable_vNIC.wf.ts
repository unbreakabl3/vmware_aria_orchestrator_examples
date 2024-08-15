/*-
 * #%L
 * policy_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Disable vNIC",
  path: "MyOrg/MyProject",
  id: "",
  description: "This workflow disables the vNIC for the specific VM",
  input: {
    payload: {
      type: "string",
      description: "Payload as JSON"
    }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class DisableVNIC {
  public install(payload: string, @Out result: any): void {
    const payloadAsJson = JSON.parse(payload);
    if (!payloadAsJson || !payloadAsJson.event || !payloadAsJson.event.metadata || !payloadAsJson.event.metadata.source) {
      throw new Error("Invalid payload");
    }
    const hostname = payloadAsJson.event.metadata.source;
    let networkManagement;
    const vms: Array<VcVirtualMachine> = VcPlugin.getAllVirtualMachines(null, "xpath:name='" + hostname + "'");
    vms.forEach((vm) => {
      if (vm.name === hostname) {
        try {
          networkManagement = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions").virtualNetworkManagement();
        } catch (error) {
          throw new Error(`Failed to get 'virtualNetworkManagement' from 'com.examples.vmware_aria_orchestrator_examples.actions'. ${error.message}`);
        }
        networkManagement.VirtualNetworkAdapterManagement.prototype.disableVirtualNetworkAdapter(hostname);
      }
    });
  }
}
