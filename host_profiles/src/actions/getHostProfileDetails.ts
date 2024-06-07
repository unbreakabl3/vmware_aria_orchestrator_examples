/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 *
 *
 * @param {VC:HostSystem} vmHost - The name of the ESXi host to check.
 * @param {string} hostProfileName
 * @returns {Array/Properties} - Host profile details
 */
(function getHostProfileDetails(vmHost: VcHostSystem, hostProfileName: string): Properties[] {
  const hostProfileManager: VcProfileManager = vmHost.sdkConnection.hostProfileManager;
  const profileDetails: Array<Properties> = [];
  let customProperties;
  let filteredProfile: VcProfile[] = [];
  const profiles: VcProfile[] = hostProfileManager.profile;
  if (isArrayNotEmpty(profiles)) {
    filteredProfile = profiles.filter((profile) => {
      return profile.name === hostProfileName;
    });
  }

  if (isArrayNotEmpty(filteredProfile)) {
    filteredProfile.forEach((element) => {
      customProperties = {
        profileName: element.name,
        //@ts-ignore
        profileValidationState: element.validationState,
        profileDescription: element.config.annotation,
        profileObject: element
      };
      //@ts-ignore
      profileDetails.push(customProperties);
    });
  }
  return profileDetails.sort();

  function isArrayNotEmpty<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0;
  }
});
