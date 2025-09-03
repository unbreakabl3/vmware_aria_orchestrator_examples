/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
const validateVM = System.getModule("com.examples.vmware_aria_orchestrator_examples.actions.external_validation").validateVM;

describe("validateVM", () => {
  let vm: VcVirtualMachine;
  beforeEach(() => {
    (<any>VcPlugin) = {
      getAllVirtualMachines: function () {}
    };
  });

  it("should return an error message if a VM with the same name already exists", () => {
    spyOn(VcPlugin, "getAllVirtualMachines").and.returnValue([vm]);

    const result = validateVM("existingVMName");
    expect(result).toEqual("Virtual Machine with that name is already exists");
  });

  it("should return undefined if no VM with the same name exists", () => {
    spyOn(VcPlugin, "getAllVirtualMachines").and.returnValue([]);

    const result = validateVM("uniqueVMName");
    expect(result).toBeUndefined();
  });
});
