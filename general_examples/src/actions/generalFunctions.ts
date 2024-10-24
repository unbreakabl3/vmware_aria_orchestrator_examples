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
  public throwError(errorMessage: string): never {
    throw new Error(errorMessage);
  }

  public isValidIPv4(ip: string): boolean {
    const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
    return ipv4Regex.test(ip);
  }

  public convertBytes(bytes: number) {
    if (bytes === null || bytes === undefined) {
      throw new Error("Mandatory input 'bytes' is null or undefined");
    }

    if (typeof bytes !== "number" || bytes < 0) {
      throw new Error("'bytes' must be a non-negative number");
    }

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const result = (bytes / Math.pow(1024, i)).toFixed(2);

    return `${result} ${sizes[i]}`;
  }
}
