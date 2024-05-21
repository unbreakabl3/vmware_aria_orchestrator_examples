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
import { Functions } from "../actions/functions";

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
    allowReboot: {
      type: "boolean",
      description: "Allow reboot? If true, VM will be rebooted if required by the installation. If false, reboot will be suppressed."
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
  ): void {
    const func = new Functions();
    const shutdownTimeout = 10; // seconds
    const vmtoolsTimeout = 10; // minutes
    const isVmTemplate = func.isVmTemplate(vm);
    if (isVmTemplate) {
      //const vmType = func.getVmType(vm);
      const currentHostSystem = func.getVmParentHost(vm);
      const currentComputeResource = func.getComputeResource(currentHostSystem);
      //@ts-ignore
      const currentResourcePool = func.getResourcePool(currentComputeResource);
      const vars = {
        vm: vm,
        pool: currentResourcePool,
        host: currentHostSystem
      };
      func.convertVmTemplateToVm(vars);
    }
    const currentPowerState = func.getVmPowerState(vm);
    const vmDisks: VcVirtualDisk[] = func.getVmDisks(vm);
    if (!vmDisks) throw new Error(`No disks found for virtual machine '${vm.name}'`);
    System.log(`AA: ${func.getVmNonPersistentDisks(vmDisks).length}`);
    if (func.getVmNonPersistentDisks(vmDisks).length !== 0) {
      func.shutdownVmBasedOnCurrentState(vm, shutdownTimeout);
      if (vm.snapshot != null) throw new Error(`Disks cannot be converted because the virtual machine has at least one snapshot`);
      const diskPersistency = func.prepareVmDiskPersistency(vmDisks);
      func.changeVmDiskPersistency(diskPersistency, vm);
    }
    if (currentPowerState === "poweredOff") {
      System.log(`Powering on VM`);
      func.powerOnVm(vm);
    }
    func.checkVmToolsStatus(vm, vmtoolsTimeout);
  }
}
