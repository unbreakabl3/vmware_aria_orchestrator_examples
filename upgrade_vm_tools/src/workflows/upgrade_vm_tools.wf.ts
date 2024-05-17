/*-
 * #%L
 * upgrade_vm_tools
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
  name: "Upgrade VM Tools",
  path: "MyOrg/MyProject",
  id: "",
  description: "Upgrading vm tools for any kind of vm",
  attributes: {},
  input: {
    vm: {
      type: "VC:VirtualMachine",
      description: "VM to update the vmtools on",
      required: true,
      title: "Foo"
    },
    __tokenName: {
      type: "string",
      description: "Internal property"
    },
    setVmToolsUpgradePolicy: {
      type: "boolean",
      description: "Set VMTools upgrade policy?"
    },
    desiredVmToolsUpgradePolicy: {
      type: "string",
      description: "Desired VMTools upgrade policy (manual or upgradeAtPowerCycle) - case-sensitive"
    },
    allowUpgradeTemplates: {
      type: "boolean",
      description: ""
    },
    allowUpgradePoweredOffVms: {
      type: "boolean",
      description: ""
    }
  },
  output: {
    result: { type: "Any" }
  },
  presentation: ""
})
export class UpgradeVMTools {
  public install(
    vm: VcVirtualMachine,
    __tokenName: string,
    setVmToolsUpgradePolicy: boolean,
    desiredVmToolsUpgradePolicy: string,
    allowUpgradeTemplates: boolean,
    allowUpgradePoweredOffVms: boolean,
    @Out result: any
  ): void {}
}
