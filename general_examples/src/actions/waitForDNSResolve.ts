/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
/**
 * https://www.clouddepth.com/posts/vro-how-to-resolve-ip-address/
 */
import { GeneralFunctions } from "./generalFunctions";
export class Network {
  private func = new GeneralFunctions();
  public waitForDNSResolve(hostFqdn: string) {
    const maxAttempts = 1;
    const sleepTime = 600;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const ip = System.resolveHostName(hostFqdn);
        if (ip && this.func.isValidIPv4(ip)) {
          return; // hostFqdn resolved successfully
        }
      } catch (error) {
        System.error(`Error resolving ${hostFqdn}: ${error}`);
      }
      System.log(`Not yet resolvable. Sleeping for ${sleepTime / 1000} seconds`);
      System.sleep(sleepTime);
    }
    System.warn(`DNS resolution failed after ${maxAttempts} attempts.`);
  }
}
