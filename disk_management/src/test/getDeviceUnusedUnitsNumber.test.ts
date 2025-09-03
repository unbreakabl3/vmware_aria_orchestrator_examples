/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
const getDeviceUnusedUnitsNumber = System.getModule("com.clouddepth.disk_management.actions").getDeviceUnusedUnitsNumber;
describe("VcVirtualMachine Device Unit Function", () => {
  let vm: any;
  const maximumDeviceUnitsNumber = 5;

  beforeEach(() => {
    vm = {};
  });

  it("should throw an error if vm is missing", () => {
    expect(() => {
      getDeviceUnusedUnitsNumber(undefined, maximumDeviceUnitsNumber, []);
    }).toThrowError("Provide parameters are missing");
  });

  it("should throw an error if maximumDeviceUnitsNumber is missing", () => {
    expect(() => {
      getDeviceUnusedUnitsNumber(vm, 0, []);
    }).toThrowError("Provide parameters are missing");
  });

  it("should return predefined array if deviceUnitToRemove is empty", () => {
    const result = getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, []);
    expect(result).toEqual([0, 1, 2, 3, 4]); // Expected predefined array for 5 units
  });

  it("should return first available unit if some device units are removed", () => {
    const result = getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, [1, 3]);
    expect(result).toBe(0); // First available unit, in this case, is 0
  });

  it("should return next available unit if earlier ones are removed", () => {
    const result = getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, [0, 1, 2]);
    expect(result).toBe(3); // First available unit after removal
  });

  it("should return 0 if all units are removed", () => {
    const result = getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, [0, 1, 2, 3, 4]);
    expect(result).toBe(0); // No available units, return 0 as default
  });

  it("should return the entire array if no deviceUnitToRemove is provided", () => {
    const result = getDeviceUnusedUnitsNumber(vm, maximumDeviceUnitsNumber, undefined);
    expect(result).toEqual([0, 1, 2, 3, 4]); // Full array when no removals specified
  });
});
