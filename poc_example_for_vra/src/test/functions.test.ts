/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Functions } from "../actions/functions";
import { HttpClient } from "../actions/httpClient";
import { DeploymentDay2Actions } from "../types/types";

let func: Functions;
describe("getVraRefreshToken", () => {
  const mockCreateTransientHostFrom = (host: any) => {
    return { url: "https://mocked-url.com" };
  };

  beforeEach(() => {
    func = new Functions();
    (<any>RESTHostManager) = {
      createHost: function () {},
      createTransientHostFrom: function () {}
    };
  });

  it("should resolve with a valid refresh token", async () => {
    const mockResponse = {
      statusCode: 200,
      contentAsString: JSON.stringify({ refresh_token: "mockRefreshToken" })
    };
    //@ts-ignore
    spyOn(HttpClient.prototype, "post").and.returnValue(mockResponse);
    //@ts-ignore
    spyOn(RESTHostManager, "createTransientHostFrom").and.callFake(mockCreateTransientHostFrom);
    const input = {
      username: "testUser",
      password: "testPassword",
      hostname: "example.com"
    };

    try {
      const refreshToken = await func.getVraRefreshToken(input);

      expect(refreshToken).toBe("mockRefreshToken");
    } catch (error) {
      fail(`Unexpected error: ${error}`);
    }
  });

  it("should reject with an error message for invalid status code", async () => {
    const mockResponse = {
      statusCode: 401,
      contentAsString: "Unauthorized"
    };
    //@ts-ignore
    spyOn(HttpClient.prototype, "post").and.returnValue(mockResponse);

    //@ts-ignore
    spyOn(RESTHostManager, "createTransientHostFrom").and.callFake(mockCreateTransientHostFrom);

    const input = {
      username: "testUser",
      password: "testPassword",
      hostname: "example.com"
    };

    try {
      await func.getVraRefreshToken(input);
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).toContain("Failed to get refresh token");
      expect(error).toContain("Status code: 401");
    }
  });
});

describe("getVraAccessToken", () => {
  const mockCreateTransientHostFrom = (host: any) => {
    return { url: "https://mocked-url.com" };
  };

  beforeEach(() => {
    func = new Functions();
    (<any>RESTHostManager) = {
      createHost: function () {},
      createTransientHostFrom: function () {}
    };
  });

  it("should resolve with a valid access token", async () => {
    const mockResponse = {
      statusCode: 200,
      contentAsString: JSON.stringify({ token: "mockAccessToken" })
    };
    //@ts-ignore
    spyOn(HttpClient.prototype, "post").and.returnValue(mockResponse);
    //@ts-ignore
    spyOn(RESTHostManager, "createTransientHostFrom").and.callFake(mockCreateTransientHostFrom);

    try {
      const accessToken = await func.getVraAccessToken("refreshToken", "vra01");

      expect(accessToken).toBe("mockAccessToken");
    } catch (error) {
      fail(`Unexpected error: ${error}`);
    }
  });

  it("should reject with an error message for invalid status code", async () => {
    const mockResponse = {
      statusCode: 401,
      contentAsString: "Unauthorized"
    };
    //@ts-ignore
    spyOn(HttpClient.prototype, "post").and.returnValue(mockResponse);

    //@ts-ignore
    spyOn(RESTHostManager, "createTransientHostFrom").and.callFake(mockCreateTransientHostFrom);

    try {
      await func.getVraAccessToken("refreshToken", "vra01");
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).toContain("Failed to get access token");
      expect(error).toContain("Status code: 401");
    }
  });
});

describe('DeploymentDay2ActionsService', () => {
  describe('validateChangeleaseAction', () => {
    it('should return true if changeleaseAction contains a valid Deployment.ChangeLease action', () => {
      const validChangeleaseAction: DeploymentDay2Actions[] = [
        {
          id: 'SomeOtherAction', valid: false,
          name: "",
          displayName: "",
          description: "",
          actionType: ""
        },
        {
          id: 'Deployment.ChangeLease', valid: true,
          name: "",
          displayName: "",
          description: "",
          actionType: ""
        },
      ];

      const isValid = func.validateChangeleaseAction(validChangeleaseAction);

      expect(isValid).toBe(true);
    });

    it('should return false if changeleaseAction does not contain a valid Deployment.ChangeLease action', () => {
      const invalidChangeleaseAction: DeploymentDay2Actions[] = [
        {
          id: 'SomeOtherAction', valid: false,
          name: "",
          displayName: "",
          description: "",
          actionType: ""
        },
        {
          id: 'AnotherAction', valid: true,
          name: "",
          displayName: "",
          description: "",
          actionType: ""
        },
      ];

      const isValid = func.validateChangeleaseAction(invalidChangeleaseAction);

      expect(isValid).toBe(false);
    });

    it('should return false if changeleaseAction is empty', () => {
      const emptyChangeleaseAction: DeploymentDay2Actions[] = [];
      const isValid = func.validateChangeleaseAction(emptyChangeleaseAction);

      expect(isValid).toBe(false);
    });
  });
});
