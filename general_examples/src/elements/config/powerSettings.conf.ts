/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Configuration } from "vrotsc-annotations";

@Configuration({
  name: "power_settings",
  path: "my_path",
  attributes: {
    powerMin: {
      type: "number",
      value: "1",
      description: "Minimum power"
    },
    powerMax: {
      type: "number",
      value: "2",
      description: "Maximum power"
    },
    domainName: {
      type: "string",
      value: "domain.local",
      description: "Domain name"
    }
  }
})
export class MyClass {}
