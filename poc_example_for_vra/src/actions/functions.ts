/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { DeploymentDay2Actions } from "../types/types";
import { HttpClient } from "./httpClient";

export class Functions {
  public getVraRefreshToken({ username, password, hostname }: { username: string; password: string; hostname: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers = [];
      headers.push({
        key: "Content-Type",
        value: "application/json"
      });
      const jsonContent = {
        username: username,
        password: password
      };
      const restAttr = {
        restUri: "/csp/gateway/am/api/login?access_token",
        contentType: "application/json",
        content: JSON.stringify(jsonContent),
        expectedResponseCodes: [200],
        headers: headers
      };
      const responseContent = new HttpClient(`https://${hostname}`);
      const response: RESTResponse = responseContent.post(restAttr);
      if (response.statusCode >= 400) {
        reject(`Failed to get refresh token. Status code: ${response.statusCode}`);
      } else {
        resolve(JSON.parse(response.contentAsString).refresh_token);
      }
    });
  }

  public getVraAccessToken(refreshToken: string, vraHostname: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers = [];
      headers.push({
        key: "Content-Type",
        value: "application/json"
      });
      const jsonContent = {
        refreshToken: refreshToken
      };
      const restAttr = {
        restUri: "/iaas/api/login",
        contentType: "application/json",
        content: JSON.stringify(jsonContent),
        expectedResponseCodes: [200],
        headers: headers
      };
      const responseContent = new HttpClient(`https://${vraHostname}`);
      const response: RESTResponse = responseContent.post(restAttr);
      if (response.statusCode >= 400) {
        reject(`Failed to get access token. Status code: ${response.statusCode}`);
      } else {
        resolve(JSON.parse(response.contentAsString).token);
      }
    });
  }

  public getVraDayTwoActions(vraHostname: string, deploymentId: string, accessToken: string): Promise<Array<DeploymentDay2Actions>> {
    return new Promise((resolve, reject) => {
      const headers = [];
      headers.push({
        key: "Content-Type",
        value: "application/json"
      });
      headers.push({
        key: "csp-auth-token",
        value: accessToken
      });
      const restAttr = {
        restUri: `/deployment/api/deployments/${deploymentId}/actions`,
        contentType: "application/json",
        expectedResponseCodes: [200],
        headers: headers
      };
      const responseContent = new HttpClient(`https://${vraHostname}`);
      const response: RESTResponse = responseContent.get(restAttr);
      if (response.statusCode >= 400) {
        reject(`Failed to get day 2 actions. Status code: ${response.statusCode}`);
      } else {
        resolve(JSON.parse(response.contentAsString));
      }
    });
  }

  public validateChangeleaseAction(changeleaseAction: Array<DeploymentDay2Actions>): boolean {
    return changeleaseAction.some((item) => {
      return item.id === "Deployment.ChangeLease" && item.valid === true;
    });
  }

  public setLeaseDate({
    vraHostname,
    deploymentId,
    accessToken,
    changeleaseDate
  }: {
    vraHostname: string;
    deploymentId: string;
    accessToken: string;
    changeleaseDate: Date;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers = [];
      headers.push({
        key: "Content-Type",
        value: "application/json"
      });
      headers.push({
        key: "csp-auth-token",
        value: accessToken
      });
      const jsonContent = {
        actionId: "Deployment.ChangeLease",
        inputs: {
          "Lease Expiration Date": changeleaseDate
        }
      };
      const restAttr = {
        restUri: `/deployment/api/deployments/${deploymentId}/requests`,
        contentType: "application/json",
        content: JSON.stringify(jsonContent),
        expectedResponseCodes: [200],
        headers: headers
      };
      const responseContent = new HttpClient(`https://${vraHostname}`);
      const response: RESTResponse = responseContent.post(restAttr);
      if (response.statusCode >= 400) {
        reject(`Failed to get access token. Status code: ${response.statusCode}`);
      } else {
        resolve(JSON.parse(response.contentAsString).id);
      }
    });
  }

  public async retryPromise<T>(func: () => Promise<T>, retries: number = 5, interval: number = 10000, progressive: boolean = false): Promise<T> {
    try {
      return await func();
    } catch (error) {
      if (retries) {
        System.log(`Retry number ${retries}`);
        await new Promise((resolve) => resolve(System.sleep(interval)));
        return this.retryPromise(func, retries - 1, progressive ? interval * 2 : interval, progressive);
      } else throw new Error(`Max retries reached for function ${func.name}`);
    }
  }

  public getChangeleaseActionStatus(vraHostname: string, accessToken: string, setLeaseDateTaskId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers = [];
      headers.push({
        key: "Content-Type",
        value: "application/json"
      });
      headers.push({
        key: "csp-auth-token",
        value: accessToken
      });
      const restAttr = {
        restUri: `/deployment/api/requests/${setLeaseDateTaskId}`,
        contentType: "application/json",
        expectedResponseCodes: [200],
        headers: headers
      };
      const responseContent = new HttpClient(`https://${vraHostname}`);
      const response: RESTResponse = responseContent.get(restAttr);
      if (response.statusCode >= 400) {
        reject(`Failed to get day 2 actions. Status code: ${response.statusCode}`);
      } else {
        resolve(JSON.parse(response.contentAsString).status);
      }
    });
  }
}
