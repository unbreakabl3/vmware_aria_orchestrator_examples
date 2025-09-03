/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Header, ResponseContent } from "../types/types.d";

export class HttpClient {
  reqResponse!: ResponseContent;
  restHost: RESTHost;
  transientHost: RESTHost;

  constructor(baseUrl: string) {
    this.restHost = RESTHostManager.createHost("DynamicRequest");
    this.transientHost = RESTHostManager.createTransientHostFrom(this.restHost);
    this.transientHost.url = baseUrl;
  }

  /**
   * Defines the GET method.
   * @method
   * @param {string} baseUrl - The host FQDN.
   * @param {string} restUri - The request uri.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  public get({
    restUri,
    expectedResponseCodes,
    contentType,
    headers
  }: {
    restUri: string;
    expectedResponseCodes: Array<number>;
    contentType: string;
    headers: Array<Header>;
  }): RESTResponse {
    return this.executeRequest({
      restMethod: "GET",
      restUri,
      contentType,
      expectedResponseCodes,
      headers
    });
  }

  /**
   * Defines the POST method.
   * @method
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} contentType - The encoding for content.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  public post({
    restUri,
    content,
    contentType,
    expectedResponseCodes,
    headers
  }: {
    restUri: string;
    content: string;
    contentType: string;
    expectedResponseCodes: Array<number>;
    headers: Array<Header>;
  }): RESTResponse {
    if (!content) {
      content = "{}";
    }
    return this.executeRequest({
      restMethod: "POST",
      restUri,
      content,
      contentType,
      expectedResponseCodes,
      headers
    });
  }
  /**
   * Defines the PUT method.
   * @method
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} contentType - The encoding for content.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  public put({
    restUri,
    content,
    contentType,
    expectedResponseCodes,
    headers
  }: {
    restUri: string;
    content: string;
    contentType: string;
    expectedResponseCodes: Array<number>;
    headers: Array<Header>;
  }): RESTResponse {
    return this.executeRequest({
      restMethod: "PUT",
      restUri,
      content,
      contentType,
      expectedResponseCodes,
      headers
    });
  }

  /**
   * Defines the DELETE method.
   * @method
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} contentType - The encoding for content.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  public delete({
    restUri,
    content,
    contentType,
    expectedResponseCodes,
    headers
  }: {
    restUri: string;
    content?: string;
    contentType: string;
    expectedResponseCodes: Array<number>;
    headers: Array<Header>;
  }): RESTResponse {
    return this.executeRequest({
      restMethod: "DELETE",
      restUri,
      content,
      contentType,
      expectedResponseCodes,
      headers
    });
  }

  /**
   * Defines the PATCH method.
   * @method
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} contentType - The encoding for content.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  public patch({
    restUri,
    content,
    contentType,
    expectedResponseCodes,
    headers
  }: {
    restUri: string;
    content: string;
    contentType: string;
    expectedResponseCodes: Array<number>;
    headers: Array<Header>;
  }): RESTResponse {
    return this.executeRequest({
      restMethod: "PATCH",
      restUri,
      content,
      contentType,
      expectedResponseCodes,
      headers
    });
  }

  /**
   * A private method that executes the request.
   * @method
   * @private
   * @param {string} restMethod - The request method.
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} contentType - The encoding for content.
   * @param {number[]} expectedResponseCodes - A list of expected response codes.
   * @param {Header[]} headers - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  private executeRequest({
    restMethod,
    restUri,
    content,
    expectedResponseCodes,
    headers
  }: {
    restMethod: string;
    restUri: string;
    content?: string;
    contentType: string;
    expectedResponseCodes: Array<number>;
    headers: Array<Header>;
  }): RESTResponse {
    const maxAttempts = 5;
    const timeout = 10;
    let success = false;
    let response!: RESTResponse;
    // Default to status code '200' if no expected codes have been defined.
    if (!expectedResponseCodes || (Array.isArray(expectedResponseCodes) && expectedResponseCodes.length < 1)) {
      expectedResponseCodes = [200];
    }
    const request = this.createRequest({
      restMethod,
      restUri,
      content,
      headers
    });
    for (let i = 0; i < maxAttempts; i++) {
      try {
        response = request.execute();
        success = true;
        break;
      } catch (e) {
        System.sleep(timeout * 1000);
        System.warn(`Request failed: ${e}. Retrying...`);
        continue;
      }
    }
    if (!success) {
      System.error(`Request failed after ${maxAttempts.toString} attempts. Aborting.`);
    }
    const statusCode = response.statusCode;
    if (expectedResponseCodes.indexOf(statusCode) > -1) {
      System.debug(`Request executed successfully with status: ${statusCode}`);
    } else {
      System.error(
        "Request failed, incorrect response code received: '" + statusCode + "'. Expected one of: '" + expectedResponseCodes.join(",") + "'\n" + response.contentAsString
      );
    }
    return response;
  }

  /**
   * A private method that creates the request.
   * @method
   * @private
   * @param {string} restMethod - The request method.
   * @param {string} restUri - The request uri.
   * @param {string} content - The request content.
   * @param {string} [contentType] - The encoding for content.
   * @param {Header[]} [headers] - A key/value set of headers to include in the request.
   * @returns {*} The request response object.
   */
  private createRequest({ restMethod, restUri, content, headers }: { restMethod: string; restUri: string; content?: string; headers: Array<Header> }) {
    const uri = encodeURI(restUri.replace(/\s/g, "%20")); // support for whitespace in URI
    let request: RESTRequest;
    System.debug(`Executing ${restMethod} REST request...`);
    System.debug(`Query string: ${restUri}`);
    try {
      request = this.transientHost.createRequest(restMethod, uri, content);
    } catch (error) {
      throw new Error(`Error creating REST request. Error: ${error}`);
    }
    System.debug("Setting headers...");
    this.setHeaders({ headers, request: request });
    return request;
  }

  /**
   * A private method that sets the request headers.
   * @method
   * @private
   * @param {Properties} [headers]
   */
  private setHeaders({ headers, request }: { headers: Array<Header>; request: RESTRequest }): void {
    if (headers) {
      headers.forEach((header) => {
        System.debug(`Setting header ${header.key} with value ${header.value}`);
        try {
          request.setHeader(header.key, header.value);
        } catch (e) {
          throw `Failed to set header ${header.key} with value ${header.value}. ${e}`;
        }
        System.debug("Header has been set");
      });
    }
  }
}
