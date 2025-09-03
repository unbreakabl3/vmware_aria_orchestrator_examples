/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 https://www.clouddepth.com
 * %%
 * TODO: Define header text
 * #L%
 */
describe("getKeyByValue", function () {
  const getKeyByValue = System.getModule("com.clouddepth.set_vm_hw_version.actions").getKeyByValue;

  it("should return the key when the value is found", function () {
    const json = { a: "1", b: "2", c: "3" };
    expect(getKeyByValue(json, "2")).toBe("b");
  });

  it("should return undefined when the value is not found", function () {
    const json = { a: "1", b: "2", c: "3" };
    expect(getKeyByValue(json, "4")).toBeUndefined();
  });

  it("should return undefined for an empty object", function () {
    const json = {};
    expect(getKeyByValue(json, "1")).toBeUndefined();
  });

  it("should return the key when the value is found and multiple keys exist", function () {
    const json = { a: "1", b: "1", c: "3" };
    expect(getKeyByValue(json, "1")).toBe("a"); // should return the first matching key
  });

  it("should return undefined if the value is an empty string and not present in the object", function () {
    const json = { a: "1", b: "2", c: "3" };
    expect(getKeyByValue(json, "")).toBeUndefined();
  });

  it("should return the key if the value is an empty string and present in the object", function () {
    const json = { a: "", b: "2", c: "3" };
    expect(getKeyByValue(json, "")).toBe("a");
  });
});
