/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * @param {string} json - JSON
 * @param {string} value - Value to look for
 * @returns {Array/string} -Key of the value
 */
(function getKeyByValue(json: { [key: string]: string }, value: string): string | undefined {
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (json[key] === value) {
        return key;
      }
    }
  }
  return undefined;
});
