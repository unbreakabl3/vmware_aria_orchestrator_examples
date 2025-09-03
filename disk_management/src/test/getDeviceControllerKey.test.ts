/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */

const getDeviceKeyByLabel = System.getModule("com.clouddepth.disk_management.actions").getDeviceControllerKey;
describe("getDeviceKeyByLabel", () => {
  let deviceControllers: Array<VcVirtualDevice>;

  beforeEach(() => {
    deviceControllers = [
      {
        key: 1001,
        //@ts-ignore
        deviceInfo: { label: "SCSI Controller 0" }
      },
      {
        key: 1002,
        //@ts-ignore
        deviceInfo: { label: "SCSI Controller 1" }
      }
    ];
  });

  it("should return the correct device key when the label matches", () => {
    const result = getDeviceKeyByLabel("SCSI Controller 0", deviceControllers);
    expect(result).toBe(1001);
  });

  it("should return undefined when the label does not match any device", () => {
    const result = getDeviceKeyByLabel("Non-existent Controller", deviceControllers);
    expect(result).toBeUndefined();
  });

  it("should throw an error if diskControllerLabel is missing", () => {
    expect(() => getDeviceKeyByLabel("", deviceControllers)).toThrowError("Both 'diskControllerLabel' and 'deviceControllers' parameters are required.");
  });

  it("should throw an error if deviceControllers is missing", () => {
    expect(() => getDeviceKeyByLabel("SCSI Controller 0", undefined as any)).toThrowError("Both 'diskControllerLabel' and 'deviceControllers' parameters are required.");
  });

  it("should return undefined if deviceControllers is an empty array", () => {
    const result = getDeviceKeyByLabel("SCSI Controller 0", []);
    expect(result).toBeUndefined();
  });
});
