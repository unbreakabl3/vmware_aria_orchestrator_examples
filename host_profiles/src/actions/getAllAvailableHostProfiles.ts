/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 *
 *
 * @param {VC:HostSystem} vmHost - The name of the ESXi host to check.
 * @returns {Array/string} - Host profile details
 */
(function getAllAvailableHostProfiles(vmHost: VcHostSystem) {
  const hostProfileManager: VcProfileManager = vmHost.sdkConnection.hostProfileManager;
  const profileDetails: Array<string> = [];
  let customProperties;
  const profiles: VcProfile[] = hostProfileManager.profile;
  if (isArrayNotEmpty(profiles)) {
    profiles.forEach((element) => {
      profileDetails.push(element.name);
    });
  }
  return profileDetails.sort();

  function isArrayNotEmpty<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0;
  }
});
