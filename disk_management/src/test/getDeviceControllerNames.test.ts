/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
const getDeviceControllerNames = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerNames;
describe("getDeviceControllerNames", () => {
  let mockModule: any;

  beforeEach(() => {
    mockModule = {
      getDeviceControllers: jasmine.createSpy("getDeviceControllers")
    };

    spyOn(System, "getModule").and.returnValue(mockModule);
  });

  it("should return an empty array if vm is null", () => {
    const result = getDeviceControllerNames(null);
    expect(result).toEqual([]);
  });

  it("should return an empty array if vm is undefined", () => {
    const result = getDeviceControllerNames(undefined);
    expect(result).toEqual([]);
  });

  it("should return an empty array if no device controllers are found", () => {
    mockModule.getDeviceControllers.and.returnValue([]);

    const result = getDeviceControllerNames({} as VcVirtualMachine);
    expect(result).toEqual([]);
  });

  it("should return an array of device controller names when device controllers are present", () => {
    const mockVm = {} as VcVirtualMachine;
    const mockDeviceControllers = [{ deviceInfo: { label: "Controller 1" } }, { deviceInfo: { label: "Controller 2" } }];

    mockModule.getDeviceControllers.and.returnValue(mockDeviceControllers);

    const result = getDeviceControllerNames(mockVm);

    expect(result).toEqual(["Controller 1", "Controller 2"]);
  });
});
