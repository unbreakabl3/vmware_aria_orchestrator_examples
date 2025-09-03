/*-
 * #%L
 * poc_example
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
const validation = System.getModule("com.clouddepth.poc_example.actions.external_validation").validateDecommissionDate;

describe("validateDecommissionDate", () => {
  it("should return an error message if provided date is in the past", () => {
    const pastDate = new Date("2022-01-01");
    const result = validation(pastDate);
    expect(result).toContain("Provided decommission date cannot be in the past");
  });

  it("should not return an error message if provided date is in the future", () => {
    const futureDate = new Date("2044-12-31");
    const result = validation(futureDate);
    expect(result).toBeUndefined();
  });
});
