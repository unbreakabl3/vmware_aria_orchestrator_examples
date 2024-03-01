/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class GeneralFunctions {
  public throwError ( errorMessage: string ): never {
    throw new Error( errorMessage )
  }

  public isValidIPv4 ( ip: string ): boolean {
    const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    return ipv4Regex.test( ip )
  }
}
