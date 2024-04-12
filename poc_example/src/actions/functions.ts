/*-
 * #%L
 * poc_example
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class Functions {
  private workflowParameters = new Properties();
  public executeDecommissionWorkflow(vmObject: VcVirtualMachine, decommissionWfId: string, decommissionDate: Date, decommissionDelay: number) {
    const workflowParameters = new Properties();
    workflowParameters.put("vm_in", vmObject);
    workflowParameters.put("__taskName", `Decommission of VM ${vmObject.name}`);
    workflowParameters.put("decommissionDate_in", decommissionDate.setDate(decommissionDate.getDate() + decommissionDelay));
    workflowParameters.put(
      "__taskDescription",
      `Automatically scheduled task to decommission POC VM '${vmObject.name}' on ${decommissionDate}. Triggered by ${Server.getCurrentLdapUser()}`
    );
    const workflowObject: Workflow = Server.getWorkflowWithId(decommissionWfId);
    try {
      workflowObject.schedule(this.workflowParameters, decommissionDate, "", "");
      System.log(`The scheduled decommission for VM '${vmObject.name}' has been successfully done.`);
    } catch (error) {
      throw `Failed to schedule the decommission flow. ${error}`;
    }
  }
}
