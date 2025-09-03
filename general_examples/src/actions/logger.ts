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
 * This action creates a Logger object that can be used to standardize the log output in workflows.
 * This provides greater visibility into what code is executing and where, which makes troubleshooting easier.
 * @param {string} logType - The component type i.e. Action or Workflow.
 * @param {string} logName - The Action or Workflow name.
 * @returns {void} The Logger object.
 */

export class Logger {
  logType: string;
  logName: string;
  constructor(logType: string, logName: string) {
    this.logType = logType;
    this.logName = logName;
  }

  public log(logMsg: string): void {
    System.log(`[${this.logType}: ${this.logName}] ${logMsg}`);
  }

  public warn(logMsg: string): void {
    System.warn(`[${this.logType}: ${this.logName}] ${logMsg}`);
  }

  public error(logMsg: string, exception?: string): void {
    System.error(`[${this.logType}: ${this.logName}] ${logMsg}`);
    if (exception !== null) {
      throw `[${this.logType}: ${this.logName}] ${logMsg}. Exception: ${exception}`;
    }
  }

  public debug(logMsg: string): void {
    System.debug(`[${this.logType}: ${this.logName}] ${logMsg}`);
  }
}
