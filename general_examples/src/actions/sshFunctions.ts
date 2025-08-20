import { Logger } from "./logger";

export class SSHFunctions {
  // Static map to store active SSH sessions (hostname -> session)
  private static sessionPool: Map<string, SSHSession> = new Map();

  public logger(logType: string, logName: string): Logger {
    return new Logger(logType, logName);
  }

  /**
   * Check if the SSH session is still active by running a lightweight command.
   */
  private isSessionAlive(session: SSHSession): boolean {
    try {
      session.executeCommand("echo 'ping'", true);
      return session.exitCode === 0; // Session is alive if command succeeds
    } catch (error) {
      System.error(`Failed to check SSH session status. Error: ${error}`);
      return false; // Session is dead if command fails
    }
  }

  /**
   * Get an existing session or create a new one
   */
  private getOrCreateSession(sshHostname: string): SSHSession {
    const encoding = "UTF-8";
    const path = "/var/lib/vco/app-server/conf/vco_key"; // Path where the SSH private key is stored
    const sshKeyPassword = "";
    const sshPort = 22;
    const sshUsername = "<username>";
    const sshSessionTimeout = 10000; //ms

    // Check if session exists and is still valid
    if (SSHFunctions.sessionPool.has(sshHostname)) {
      const existingSession = SSHFunctions.sessionPool.get(sshHostname);
      if (existingSession && this.isSessionAlive(existingSession)) {
        return existingSession; // Reuse existing session
      } else {
        // Remove stale session
        this.closeSession(sshHostname);
      }
    }

    // Create a new SSH session
    const session = new SSHSession(sshHostname, sshUsername, sshPort);
    session.connectWithIdentity(path, sshKeyPassword);
    session.setEncoding(encoding);
    //@ts-ignore
    session.setKeepAliveInterval(60000); // ms
    session.soTimeout = sshSessionTimeout;

    // Store the session in the pool
    SSHFunctions.sessionPool.set(sshHostname, session);
    return session;
  }

  /**
   * Execute an SSH command using a reusable session
   */
  public executeSshCommand({
    sshHostname,
    sshCommand,
  }: {
    sshHostname: string;
    sshCommand: string;
  }): Promise<string> {
    const log: Logger = this.logger("Method", "executeSshCommand");
    const encoding = "UTF-8";
    const sshSessionTimeout = 10000; //ms

    return new Promise((resolve, reject) => {
      try {
        // Get or create an SSH session
        const session = this.getOrCreateSession(sshHostname);
        session.setEncoding(encoding);
        session.soTimeout = sshSessionTimeout;

        log.log(`Using SSH session for ${sshHostname}`);

        // Execute SSH command and wait for it to complete
        session.executeCommand(sshCommand, true);

        // Ensure the output is logged AFTER execution
        if (session.exitCode === 0) {
          resolve(session.output.trim());
        } else {
          log.log(
            `SSH execution error (Node: ${sshHostname}):\n${session.error}`
          );
          reject(
            new Error(
              `Failed to execute command: ${sshCommand}. ${session.error}`
            )
          );
        }
      } catch (error) {
        reject(
          new Error(
            `Failed to execute SSH command on ${sshHostname}. Error: ${error}`
          )
        );
      }
    });
  }

  /**
   * Close a specific SSH session
   */
  public closeSession(sshHostname: string): void {
    if (SSHFunctions.sessionPool.has(sshHostname)) {
      const session = SSHFunctions.sessionPool.get(sshHostname);
      if (session) {
        session.disconnect();
      }
      SSHFunctions.sessionPool.delete(sshHostname);
    }
  }

  /**
   * Close all active SSH sessions
   */
  public closeAllSessions(): void {
    SSHFunctions.sessionPool.forEach((session) => {
      if (session) {
        session.disconnect();
      }
    });
    SSHFunctions.sessionPool.clear();
  }
}
