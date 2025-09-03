/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export type Header = {
  key: string;
  value: string;
};

export type RestAPIAttributes = {
  baseUrl: string;
  restUri: string;
  contentType: string;
  content?: string;
  expectedResponseCodes: Array<number>;
  headers: Array<Properties>;
};

export type ResponseContent = {
  contentAsString: string;
  authHeader: string;
  statusCode: number | string;
};

type AttributeMap = {
  username: string;
  password: string;
  hostname: string;
};

type Credentials = {
  username: string;
  password: string;
  hostname: string;
};

type DeploymentDay2Actions = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  valid: boolean;
  actionType: string;
};
