/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";
import { Functions } from "../actions/functions";
import { ConfigElement } from "../actions/configElement";
import { AttributeMap, Credentials } from "../types/types";

@Workflow({
  name: "POC Example for vRA",
  path: "MyOrg/MyProject",
  id: "",
  description: "Create a new virtual machine for POC",
  attributes: {},
  input: {
    inputProperties: {
      type: "Properties",
      description: "Deployment properties",
      required: false,
      defaultValue: "false"
    }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class Main {
  public install(inputProperties: Properties, @Out result: any) {
    const config = new ConfigElement();
    let workflowExecutionResult = true;
    const func = new Functions();
    const confElementVars = {
      configName: "vra_properties",
      configPath: "vra"
    };
    const vraConfigElement = config.getConfigElement(confElementVars);
    const configElementAttributes = vraConfigElement ? config.getConfElementAttributes(vraConfigElement) : undefined;
    if (!configElementAttributes) {
      throw new Error(`Failed to get properties from the configuration element ${confElementVars.configName}`);
    }
    const creds = {
      username: configElementAttributes.username,
      password: configElementAttributes.password,
      hostname: configElementAttributes.hostname
    };
    const deploymentId = inputProperties.get("deploymentId");
    const requestInputs = inputProperties.get("requestInputs");
    const decommissionDate = requestInputs["dateTime_f6f3c80d"];

    // Main code
    async function main() {
      const vRaRefreshToken = await func.retryPromise(() => getRefreshToken(creds), 20, 1000, false);
      const vRaAccessToken = await func.retryPromise(() => getAccessToken(vRaRefreshToken, creds.hostname), 20, 1000, false);
      const vRaDay2Actions = await func.retryPromise(() => getDeploymentDay2Actions(creds.hostname, vRaAccessToken, deploymentId), 20, 1000, false);
      const vRaValidateChangeleaseAction = func.validateChangeleaseAction(vRaDay2Actions);
      if (!vRaValidateChangeleaseAction) {
        throw new Error("Failed to validate changelease action");
      }
      const vRaSetLeaseDateTaskId = await setDeploymentLeaseDate({ vraHostname: creds.hostname, accessToken: vRaAccessToken, deploymentId, changeleaseDate: decommissionDate });
      let vRaGetChangeleaseActionStatusResult = await func.retryPromise(
        () => getDeploymentChangeleaseActionStatus(creds.hostname, vRaAccessToken, vRaSetLeaseDateTaskId),
        20,
        1000,
        false
      );
      let retries = 0;
      while (retries < 20) {
        if (vRaGetChangeleaseActionStatusResult !== "SUCCESSFUL") {
          System.log(`vRaGetChangeleaseActionStatusResult is ${vRaGetChangeleaseActionStatusResult}`);
          vRaGetChangeleaseActionStatusResult = await func.retryPromise(
            () => getDeploymentChangeleaseActionStatus(creds.hostname, vRaAccessToken, vRaSetLeaseDateTaskId),
            20,
            1000,
            false
          );
        }
        System.sleep(1000);
        retries++;
      }
    }

    async function getRefreshToken(creds: Credentials) {
      return await func.getVraRefreshToken(creds);
    }

    async function getAccessToken(refreshToken: string, vraHostname: string) {
      return await func.getVraAccessToken(refreshToken, vraHostname);
    }

    async function getDeploymentDay2Actions(vraHostname: string, accessToken: string, deploymentId: string) {
      return await func.getVraDayTwoActions(vraHostname, deploymentId, accessToken);
    }

    async function setDeploymentLeaseDate({
      vraHostname,
      accessToken,
      deploymentId,
      changeleaseDate
    }: {
      vraHostname: string;
      accessToken: string;
      deploymentId: string;
      changeleaseDate: Date;
    }) {
      return await func.setLeaseDate({ vraHostname, accessToken, deploymentId, changeleaseDate });
    }

    async function getDeploymentChangeleaseActionStatus(vraHostname: string, accessToken: string, setLeaseDateTaskId: string) {
      return await func.getChangeleaseActionStatus(vraHostname, accessToken, setLeaseDateTaskId);
    }

    main().catch((err) => {
      System.error(`Stack: ${err}`);
      workflowExecutionResult = false;
    });
    if (!workflowExecutionResult) throw new Error("The workflow execution failed");
  }
}
