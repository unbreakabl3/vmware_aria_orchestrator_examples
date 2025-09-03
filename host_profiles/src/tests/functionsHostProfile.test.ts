/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { functionsHostProfile } from "../actions/functionsHostProfile";
let func: functionsHostProfile;
describe("isArrayNotEmpty", () => {
  beforeEach(() => {
    func = new functionsHostProfile();
  });
  it("should return true for a non-empty array", () => {
    const nonEmptyArray = [1, 2, 3];
    expect(func.isArrayNotEmpty(nonEmptyArray)).toBeTrue();
  });

  it("should return false for an empty array", () => {
    const emptyArray: number[] = [];
    expect(func.isArrayNotEmpty(emptyArray)).toBeFalse();
  });
});

describe("updateHostCustomization", () => {
  //@ts-ignore
  const mockHostToConfigSpecMap = [];
  beforeEach(() => {
    func = new functionsHostProfile();
  });

  it("should call updateHostCustomizations_Task and wait for task completion", () => {
    const mockHostProfileManager = {
      updateHostCustomizations_Task: jasmine.createSpy("updateHostCustomizations_Task").and.returnValue({})
    };
    const systemModule = {
      vim3WaitTaskEnd: jasmine.createSpy("vim3WaitTaskEnd")
    };

    spyOn(System, "getModule").and.returnValue(systemModule);
    //@ts-ignore
    func.updateHostCustomization(mockHostToConfigSpecMap, mockHostProfileManager);

    //@ts-ignore
    expect(mockHostProfileManager.updateHostCustomizations_Task).toHaveBeenCalledWith(mockHostToConfigSpecMap);
    expect(System.getModule).toHaveBeenCalledWith("com.vmware.library.vc.basic");
    expect(System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd).toHaveBeenCalledWith({}, true, 2);
  });

  it("should throw an error if an exception occurs", () => {
    const mockHostProfileManager = {
      updateHostCustomizations_Task: jasmine.createSpy("updateHostCustomizations_Task").and.throwError("Some error message")
    };

    //@ts-ignore
    expect(() => func.updateHostCustomization(mockHostToConfigSpecMap, mockHostProfileManager)).toThrowError("updateHostCustomization: Error: Some error message");
  });
});

describe("findAssociatedProfile", () => {
  let vmHost: VcHostSystem;
  let hostProfileManager: VcProfileManager;
  const mockProfile: VcProfile[] = [];
  beforeEach(() => {
    func = new functionsHostProfile();
    //@ts-ignore
    vmHost = {};
    //@ts-ignore
    hostProfileManager = {
      findAssociatedProfile: jasmine.createSpy("findAssociatedProfile").and.returnValue([mockProfile])
    };
  });

  it("should call findAssociatedProfile with the correct arguments", () => {
    func.findAssociatedProfile(vmHost, hostProfileManager);

    expect(hostProfileManager.findAssociatedProfile).toHaveBeenCalledWith(vmHost);
  });

  it("should return the first profile if profiles exist", () => {
    hostProfileManager.findAssociatedProfile;
    const result = func.findAssociatedProfile(vmHost, hostProfileManager);
    //@ts-ignore
    expect(result).toBe(mockProfile);
  });

  it("should return null if no profiles exist", () => {
    func.findAssociatedProfile(vmHost, hostProfileManager);
    expect(hostProfileManager.findAssociatedProfile).toHaveBeenCalled();
  });

  it("should throw an error if an exception occurs", () => {
    const hostProfileManager = {
      findAssociatedProfile: jasmine.createSpy("findAssociatedProfile").and.throwError("Some error message")
    };
    //@ts-ignore
    expect(() => func.findAssociatedProfile(vmHost, hostProfileManager)).toThrowError("findAssociatedProfile: Error: Some error message");
  });
});

describe("updateHostCustomization", function () {
  let hostToConfigSpecMap;
  let hostProfileManager;
  let mockTask;
  let systemModule;

  beforeEach(function () {
    func = new functionsHostProfile();
    hostToConfigSpecMap = [];
    mockTask = {};
    hostProfileManager = {
      updateHostCustomizations_Task: jasmine.createSpy("updateHostCustomizations_Task").and.returnValue(mockTask)
    };
    systemModule = {
      vim3WaitTaskEnd: jasmine.createSpy("vim3WaitTaskEnd")
    };
    spyOn(System, "getModule").and.returnValue(systemModule);
  });

  it("should successfully update host customization", function () {
    //@ts-ignore
    func.updateHostCustomization(hostToConfigSpecMap, hostProfileManager);

    //@ts-ignore
    expect(hostProfileManager.updateHostCustomizations_Task).toHaveBeenCalledWith(hostToConfigSpecMap);
    expect(System.getModule).toHaveBeenCalledWith("com.vmware.library.vc.basic");
    //@ts-ignore
    expect(systemModule.vim3WaitTaskEnd).toHaveBeenCalledWith(mockTask, true, 2);
  });

  it("should throw an error when updateHostCustomizations_Task fails", function () {
    const errorMessage = "Task creation failed";
    //@ts-ignore
    hostProfileManager.updateHostCustomizations_Task.and.throwError(errorMessage);

    expect(function () {
      //@ts-ignore
      func.updateHostCustomization(hostToConfigSpecMap, hostProfileManager);
    }).toThrowError(`updateHostCustomization: Error: ${errorMessage}`);
  });

  it("should throw an error when vim3WaitTaskEnd fails", function () {
    const errorMessage = "Task waiting failed";
    //@ts-ignore
    systemModule.vim3WaitTaskEnd.and.throwError(errorMessage);

    expect(function () {
      //@ts-ignore
      func.updateHostCustomization(hostToConfigSpecMap, hostProfileManager);
    }).toThrowError(`updateHostCustomization: Error: ${errorMessage}`);
  });
});

describe("findAssociatedProfile", function () {
  let vmHost: VcHostSystem;
  let hostProfileManager;

  beforeEach(function () {
    func = new functionsHostProfile();
    hostProfileManager = {
      findAssociatedProfile: jasmine.createSpy("findAssociatedProfile")
    };
  });

  it("should return the first associated profile when profiles are found", function () {
    const profiles = [{ name: "Profile1" }, { name: "Profile2" }];
    //@ts-ignore
    hostProfileManager.findAssociatedProfile.and.returnValue(profiles);
    //@ts-ignore
    const result = func.findAssociatedProfile(vmHost, hostProfileManager);

    //@ts-ignore
    expect(hostProfileManager.findAssociatedProfile).toHaveBeenCalledWith(vmHost);
    //@ts-ignore
    expect(result).toBe(profiles[0]);
  });

  it("should return null when no profiles are found", function () {
    //@ts-ignore
    hostProfileManager.findAssociatedProfile.and.returnValue([]);
    //@ts-ignore
    const result = func.findAssociatedProfile(vmHost, hostProfileManager);

    //@ts-ignore
    expect(hostProfileManager.findAssociatedProfile).toHaveBeenCalledWith(vmHost);
    expect(result).toBeNull();
  });

  it("should throw an error when findAssociatedProfile fails", function () {
    const errorMessage = "Finding profile failed";
    //@ts-ignore
    hostProfileManager.findAssociatedProfile.and.throwError(errorMessage);

    expect(function () {
      //@ts-ignore
      func.findAssociatedProfile(vmHost, hostProfileManager);
    }).toThrowError(`findAssociatedProfile: Error: ${errorMessage}`);
  });
});

describe("executeHostProfile", function () {
  let vmHost: VcHostSystem;
  let userInput: Array<VcProfileDeferredPolicyOptionParameter>;
  let profile: VcProfile;

  beforeEach(function () {
    func = new functionsHostProfile();
    //@ts-ignore
    profile = { executeHostProfile: jasmine.createSpy("executeHostProfile") };
  });

  it("should successfully execute the host profile", function () {
    const expectedResponse = "success";
    //@ts-ignore
    profile.executeHostProfile.and.returnValue(expectedResponse);
    const result = func.executeHostProfile(vmHost, userInput, profile);

    //@ts-ignore
    expect(profile.executeHostProfile).toHaveBeenCalledWith(vmHost, userInput);
    expect(result).toBe(expectedResponse);
  });

  it("should throw an error when executeHostProfile fails", function () {
    const errorMessage = "Execution failed";
    //@ts-ignore
    profile.executeHostProfile.and.throwError(errorMessage);

    expect(function () {
      func.executeHostProfile(vmHost, userInput, profile);
    }).toThrowError(`profile execution: Error: ${errorMessage}`);
  });
});

describe("applyHostConfig", function () {
  let vmHost: VcHostSystem;
  let profileExecuteResult;
  let mockTask;
  let systemModule;

  beforeEach(function () {
    func = new functionsHostProfile();
    vmHost = {
      //@ts-ignore
      sdkConnection: {
        hostProfileManager: jasmine.createSpyObj("hostProfileManager", ["applyHostConfig_Task"])
      }
    };

    profileExecuteResult = {
      configSpec: {},
      requireInput: {}
    };

    mockTask = {};

    //@ts-ignore
    vmHost.sdkConnection.hostProfileManager.applyHostConfig_Task.and.returnValue(mockTask);
    systemModule = {
      vim3WaitTaskEnd: jasmine.createSpy("vim3WaitTaskEnd")
    };

    spyOn(System, "getModule").and.returnValue(systemModule);
  });

  it("should successfully apply host configuration", function () {
    //@ts-ignore
    func.applyHostConfig(vmHost, profileExecuteResult);

    //@ts-ignore
    expect(vmHost.sdkConnection.hostProfileManager.applyHostConfig_Task).toHaveBeenCalledWith(vmHost, profileExecuteResult.configSpec, profileExecuteResult.requireInput);
    expect(System.getModule).toHaveBeenCalledWith("com.vmware.library.vc.basic");
    //@ts-ignore
    expect(systemModule.vim3WaitTaskEnd).toHaveBeenCalledWith(mockTask, true, 2);
  });

  it("should throw an error when applyHostConfig_Task fails", function () {
    const errorMessage = "Task creation failed";
    //@ts-ignore
    vmHost.sdkConnection.hostProfileManager.applyHostConfig_Task.and.throwError(errorMessage);

    expect(function () {
      //@ts-ignore
      func.applyHostConfig(vmHost, profileExecuteResult);
    }).toThrowError(`hostProfileManager: Error: ${errorMessage}`);
  });

  it("should throw an error when vim3WaitTaskEnd fails", function () {
    const errorMessage = "Task waiting failed";
    //@ts-ignore
    systemModule.vim3WaitTaskEnd.and.throwError(errorMessage);

    expect(function () {
      //@ts-ignore
      func.applyHostConfig(vmHost, profileExecuteResult);
    }).toThrowError(`hostProfileManager: Error: ${errorMessage}`);
  });
});
