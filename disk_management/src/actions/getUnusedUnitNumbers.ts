/*-
 * #%L
 * disk_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * Get the device unit number not in use
 *
 * @param {Array/number} predefinedArray - Array of device unit numbers
 * @param {Array/number} numbersToRemove - Array of used device unit numbers
 * @returns {string} - Array of unused device unit numbers
 */
(function (predefinedArray: Array<number>, numbersToRemove: Array<number>): Array<number> {
  const aa =  predefinedArray.filter((num) => numbersToRemove.indexOf(num) === -1);
  return aa
  });
