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
 * @returns {string} - Host profile name.
 */
(function getAttachedProfile(vmHost: VcHostSystem): string | null {
  const hostProfileManager: VcProfileManager = vmHost.sdkConnection.hostProfileManager;
  try {
    const profiles: Array<VcProfile> = hostProfileManager.findAssociatedProfile(vmHost);
    return profiles.length > 0 ? profiles[0].name : null;
  } catch (error) {
    throw new Error("Unable to find attached host profile");
  }
});
