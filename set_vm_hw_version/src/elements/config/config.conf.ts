/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 https://www.clouddepth.com
 * %%
 * TODO: Define header text
 * #L%
 */
import { Configuration } from "vrotsc-annotations";

@Configuration({
  name: "ConfigurationEl",
  path: "MyOrg/MyProject",
  attributes: {
    rsPath: {
      type: "string",
      value: "/MyOrg/SetVMHardwareVersion",
      description: "Resource Element Path"
    },
    rsName: {
      type: "string",
      value: "vm_hw_versions.json",
      description: "Resource Element Name"
    }
  }
})
export class TestConfiguration {}
