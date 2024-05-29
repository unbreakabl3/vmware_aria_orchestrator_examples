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
    },
    createSnapshot: {
      type: "boolean",
      description: "Create a snapshot before any changes"
    },
    removeChildren: {
      type: "boolean",
      description: "Remove children snapshots"
    },
    consolidate: {
      type: "boolean",
      description: "Consolidate snapshot"
    },
    snapshotName: {
      type: "string",
      description: "Snapshot name"
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
    allowReboot: boolean,
    setVmToolsUpgradePolicy: boolean,
    desiredVmToolsUpgradePolicy: string,
    allowUpgradeTemplates: boolean,
    allowUpgradePoweredOffVms: boolean,
    createSnapshot: boolean,
    removeChildren: boolean,
    consolidate: boolean,
    snapshotName: string,
    @Out result: any
  ): void {
    const func = new Functions();
    const shutdownTimeout = 10; // seconds
    const vmtoolsTimeout = 10; // minutes
    const waitForTools = true;
    const snapshotDescription = `Upgrade VM Tools. Created by ${Server.getCurrentLdapUser()}`;
    const snapshotWithMemory = false;
    const snapshotWithQuiesce = false;
    enum diskPersistencyType {
      persistent = "persistent",
      nonpersistent = "independent_nonpersistent"
    }
    const vars = {
      vm: vm,
      name: snapshotName,
      description: snapshotDescription,
      memory: snapshotWithMemory,
      quiesce: snapshotWithQuiesce
    };
    const isVmTemplate = func.isVmTemplate(vm);
    const initialPowerState = func.getVmPowerState(vm);
    if (!allowUpgradePoweredOffVms && initialPowerState === "poweredOff") throw new Error("VM is powered off and not allowed for upgrade");
    if (!allowUpgradeTemplates && isVmTemplate) throw new Error("VM is template and templates are not allowed for upgrade");

    if (isVmTemplate) {
      const currentHostSystem = func.getVmParentHost(vm);
      const currentComputeResource = func.getComputeResource(currentHostSystem);
      //@ts-ignore
      const currentResourcePool = func.getResourcePool(currentComputeResource);
      const vars = {
        vm: vm,
        pool: currentResourcePool,
        host: currentHostSystem
      };
      func.convertTemplateToVm(vars);
    }
    if (createSnapshot) func.createVmSnapshot(vars);
    const vmDisks = func.getVmDisks(vm);
    if (!vmDisks) throw new Error(`No disks found for virtual machine '${vm.name}'`);
    const isDiskNonPersistent = func.getVmNonPersistentDisks(vmDisks, diskPersistencyType.persistent).length !== 0;
    if (isDiskNonPersistent) {
      System.log(`Preparing disks for conversion to ${diskPersistencyType.persistent}`);
      func.shutdownVmBasedOnCurrentState(vm, shutdownTimeout);
      if (vm.snapshot != null) throw new Error("Disks cannot be converted because the virtual machine has at least one snapshot");
      const diskPersistency: VcVirtualMachineConfigSpec = func.prepareVmDiskPersistency(vmDisks, diskPersistencyType.persistent);
      func.changeVmDiskPersistency(diskPersistency, vm);
    }

    if (initialPowerState !== "poweredOn") func.powerOnVm(vm);
    func.checkVmToolsStatus(vm, vmtoolsTimeout);
    func.upgradeVmTools({ vm, allowReboot, waitForTools });
    func.checkVmToolsStatus(vm, vmtoolsTimeout);

    if (setVmToolsUpgradePolicy) func.setVmToolsUpgradePolicy(vm, desiredVmToolsUpgradePolicy);
    if (initialPowerState === "poweredOff") func.handlePoweredOnVm(vm, shutdownTimeout);
    if (initialPowerState === "suspended") func.handleSuspendedVm(vm);
    if (isDiskNonPersistent) {
      const diskPersistency: VcVirtualMachineConfigSpec = func.prepareVmDiskPersistency(vmDisks, diskPersistencyType.nonpersistent);
      func.changeVmDiskPersistency(diskPersistency, vm);
    }
    if (createSnapshot) {
      const snapshotVars = {
        vm: vm,
        removeChildren: removeChildren,
        consolidate: consolidate,
        snapshotName: snapshotName
      };
      func.removeSnapshot(snapshotVars);
    }
    if (isVmTemplate) func.convertVmToTemplate(vm);
  }
}
