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
 * https://www.clouddepth.com/posts/vro-how-to-ssh
 */
export class SSH {
  public executeSshCommand({ sshHostname, sshCommand }: { sshHostname: string; sshCommand: string }): Promise<string> {
    const encoding = "UTF-8";
    const path = "/var/lib/vco/app-server/conf/vco_key";
    const sshKeyPassword = "";
    const sshPort = 22;
    const sshUsername = "root";
    return new Promise<string>((resolve, reject) => {
      const session = this.setNewSshSessions(sshHostname, sshUsername, sshPort);
      session.connectWithIdentity(path, sshKeyPassword);
      session.setEncoding(encoding);
      System.log(`Connected to ${sshHostname}`);
      System.log(`Execute '${sshCommand}' using encoding '${encoding}'`);
      try {
        session.executeCommand(sshCommand, true);
        resolve(session.output);
      } catch (error) {
        reject(`Failed to execute SSH command. ${error}`);
      } finally {
        if (session) {
          session.disconnect();
        }
      }
    });
  }

  private setNewSshSessions(host: string, sshUsername: string, port: number): SSHSession {
    return new SSHSession(host, sshUsername, port);
  }
}
