/*-
 * #%L
 * poc_example_for_vra
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Configuration } from "vrotsc-annotations";

@Configuration({
  name: "vra_properties",
  path: "vra",
  attributes: {
    username: {
      type: "string",
      value: "admin",
      description: "vRA username"
    },
    password: {
      type: "SecureString",
      value: "65BT31W71Q33M55I76R01O62I1BI...",
      description: "vRA password"
    },
    hostname: {
      type: "string",
      value: "vra01",
      description: "vRA FQDN"
    }
  }
})
export class VRAProperties {}
