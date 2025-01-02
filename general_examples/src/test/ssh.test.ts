/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { SSH } from "../actions/ssh";

describe("sshCommands", () => {
  it("should execute SSH command successfully", async () => {
    const testInstance = new SSH();
    const sshHostname = "example.com";
    const sshCommand = "ls -l";
    const path = "/var/lib/vco/app-server/conf/vco_key"; // A static path. Should be always the same
    const sshKeyPassword = "";

    const sessionMock = {
      connectWithIdentity: jasmine.createSpy().and.callThrough(),
      executeCommand: jasmine.createSpy().and.callFake((command: string, _: boolean) => {
        if (command === sshCommand) {
          // Simulate successful execution
          sessionMock.output = "Directory listing";
        } else {
          // Simulate an invalid command
          throw new Error("Invalid command");
        }
      }),
      disconnect: jasmine.createSpy(),
      error: "Error message",
      output: "",
      setEncoding: jasmine.createSpy()
    } as unknown as SSHSession;

    spyOn<any>(testInstance, "setNewSshSessions").and.returnValue(sessionMock);
    const result = await testInstance.executeSshCommand({ sshHostname, sshCommand });

    expect(testInstance["setNewSshSessions"]).toHaveBeenCalled();
    expect(sessionMock.connectWithIdentity).toHaveBeenCalledWith(path, sshKeyPassword);
    expect(sessionMock.executeCommand).toHaveBeenCalledWith(sshCommand, true);
    expect(sessionMock.disconnect).toHaveBeenCalled();
    expect(result).toEqual("Directory listing");
  });

  it("should reject when SSH command fails", async () => {
    const testInstance = new SSH();
    const sshHostname = "example.com";
    const invalidCommand = "invalid-command";

    const sessionMock = {
      connectWithIdentity: jasmine.createSpy(),
      executeCommand: jasmine.createSpy().and.throwError("Invalid command"),
      disconnect: jasmine.createSpy(),
      setEncoding: jasmine.createSpy()
    } as unknown as SSHSession;

    spyOn<any>(testInstance, "setNewSshSessions").and.returnValue(sessionMock);

    try {
      await testInstance.executeSshCommand({ sshHostname, sshCommand: invalidCommand });
      fail("Expected rejection but promise resolved.");
    } catch (error) {
      expect(error).toContain("Invalid command");
    }
  });
});
