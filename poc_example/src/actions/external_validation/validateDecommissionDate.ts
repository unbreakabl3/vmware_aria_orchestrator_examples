/*-
 * #%L
 * poc_example
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * Checks if the provided date is not in the past
 *
 * @param {Date} providedDate - The name of the virtual machine to check.
 * @returns {string} - An error message if the provided date is in the past
 */
(function validateDecommissionDate(providedDate: Date) {
  const dateTime = new Date();
  if (providedDate <= dateTime) {
    return "Provided decommission date cannot be in the past";
  }
});
