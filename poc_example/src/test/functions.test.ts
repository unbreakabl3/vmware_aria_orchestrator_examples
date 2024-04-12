/*-
 * #%L
 * poc_example
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Functions } from "../actions/functions";

describe("YourClass", () => {
  let func: Functions;
  beforeEach(() => {
    func = new Functions();
    let user!: LdapUser;
    spyOn(Server, "getCurrentLdapUser").and.returnValue(user);
  });

  it("should execute decommission workflow successfully", () => {
    const vmObject: VcVirtualMachine = {} as VcVirtualMachine;
    const decommissionWfId = "XXX";
    const decommissionDate = new Date();
    const decommissionDelay = 30;

    //@ts-ignore
    spyOn(Server, "getWorkflowWithId").and.returnValue({
      schedule: jasmine.createSpy("schedule").and.returnValue({})
    });
    func.executeDecommissionWorkflow(vmObject, decommissionWfId, decommissionDate, decommissionDelay);

    expect(Server.getWorkflowWithId).toHaveBeenCalledWith(decommissionWfId);
    expect(Server.getWorkflowWithId(decommissionWfId).schedule).toHaveBeenCalled();
  });

  it("should throw error if scheduling fails", () => {
    const vmObject: VcVirtualMachine = {} as VcVirtualMachine;
    const decommissionWfId = "decommissionWfId";
    const decommissionDate = new Date();
    const decommissionDelay = 30;

    //@ts-ignore
    spyOn(Server, "getWorkflowWithId").and.returnValue({
      schedule: jasmine.createSpy("schedule").and.throwError("Failed to schedule")
    });

    expect(() => func.executeDecommissionWorkflow(vmObject, decommissionWfId, decommissionDate, decommissionDelay)).toThrow(
      "Failed to schedule the decommission flow. Error: Failed to schedule"
    );
  });
});
