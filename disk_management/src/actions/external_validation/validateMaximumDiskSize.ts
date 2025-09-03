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
 * validateMaximumDiskSize.ts
 *
 * Validate disk size doesnt exceed 62TB
 * @param {string} currentDiskSize - Current Disk Size
 * @param {number} sizeToAdd - GB to add
 * @returns {string}
 */
(function validateFreeDeviceUnits(currentDiskSize: string, sizeToAdd: number): string {
  const maxDiskSizeInGb = 57741; // 62 TB in GB

  // Use a regular expression to extract the number from the currentDiskSize string
  const match: RegExpMatchArray | null = currentDiskSize.match(/\d+(?=\s*GB)/);
  if (!match) {
    return "Invalid disk size format";
  }

  // Convert the extracted string to a number
  const currentDiskSizeInGb = parseInt(match[0], 10);

  // Perform the size validation
  return currentDiskSizeInGb + sizeToAdd > maxDiskSizeInGb ? "Disk size will be bigger than 62TB" : "";
});
