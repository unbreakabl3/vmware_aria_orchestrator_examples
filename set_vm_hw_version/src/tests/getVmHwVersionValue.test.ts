/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 https://www.clouddepth.com
 * %%
 * TODO: Define header text
 * #L%
 */
describe("getVmHwVersionValue", function () {
  const getVmHwVersionValue = System.getModule("com.clouddepth.set_vm_hw_version.actions").getVmHwVersionValue;

  beforeEach(function () {
    //@ts-ignore
    global.System = {
      getModule: function (moduleName) {
        return {
          getVmHwVersionsResourceElement: function (rsName, rsPath) {
            return {
              "hw-1": "1",
              "hw-2": "2",
              "hw-3": "3"
            };
          }
        };
      },
      error: jasmine.createSpy("error")
    };
  });

  it("should return an empty array if rsName or rsPath is missing", function () {
    expect(getVmHwVersionValue(null, "somePath")).toEqual([]);
    expect(getVmHwVersionValue("someName", null)).toEqual([]);
    expect(getVmHwVersionValue(null, null)).toEqual([]);
  });

  it("should return an array of hardware versions if rsName and rsPath are provided", function () {
    expect(getVmHwVersionValue("someName", "somePath")).toEqual(["1", "2", "3"]);
  });

  it("should return an empty array and log an error if an exception occurs", function () {
    System.getModule = function () {
      return {
        getVmHwVersionsResourceElement: function () {
          throw new Error("Test error");
        }
      };
    };

    expect(getVmHwVersionValue("someName", "somePath")).toEqual([]);
    expect(System.error).toHaveBeenCalledWith("Error fetching VM hardware versions from resource element: Error: Test error");
  });
});
