/*-
 * #%L
 * upgrade_vm_tools
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Functions } from "../actions/functions";

let func: Functions;
describe("isUpgradePoweredOffVmAllowed", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should allow upgrade for powered-on VM regardless of allowUpgradePoweredOffVm setting", () => {
    const vm = { runtime: { powerState: { value: "poweredOn" } } };
    const allowUpgradePoweredOffVm = true;
    //@ts-ignore
    //TODO: convert 'vm' to be of type VCVirtualMachine
    const result = func.isUpgradePoweredOffVmAllowed(allowUpgradePoweredOffVm, vm);
    expect(result).toBe(true);
  });

  it("should allow upgrade if allowUpgradePoweredOffVm is true", () => {
    const vm = { runtime: { powerState: { value: "poweredOff" } } };
    const allowUpgradePoweredOffVm = true;
    //@ts-ignore
    //TODO: convert 'vm' to be of type VCVirtualMachine
    const result = func.isUpgradePoweredOffVmAllowed(allowUpgradePoweredOffVm, vm);
    expect(result).toBe(true);
  });

  it("should disallow upgrade and warn for powered-off VM when allowUpgradePoweredOffVm is false", () => {
    const spy = spyOn(System, "warn");
    const vm = { runtime: { powerState: { value: "poweredOff" } } };
    const allowUpgradePoweredOffVm = false;
    //@ts-ignore
    //TODO: convert 'vm' to be of type VCVirtualMachine
    const result = func.isUpgradePoweredOffVmAllowed(allowUpgradePoweredOffVm, vm);
    expect(result).toBe(false);
    expect(spy).toHaveBeenCalledWith(`The current state '${vm.runtime.powerState.value}' is prohibited for the upgrade.`);
  });
});

// describe("isUpgradeVmTemplatesAllowed", () => {
//   beforeEach(() => {
//     func = new Functions();
//   });
//   it("should allow upgrade when allowUpgradeTemplates is true", () => {
//     const allowUpgradeTemplates = true;
//     const result = func.isUpgradeVmTemplatesAllowed(allowUpgradeTemplates);
//     expect(result).toBe(true);
//   });

//   it("should disallow upgrade when allowUpgradeTemplates is false", () => {
//     const allowUpgradeTemplates = false;
//     const result = func.isUpgradeVmTemplatesAllowed(allowUpgradeTemplates);
//     expect(result).toBe(false);
//   });
// });

describe("getResourcePool", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should return the resource pool and log its name", () => {
    const mockComputeResource = {
      resourcePool: { name: "MyResourcePool" }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func.getResourcePool(mockComputeResource);
    //@ts-ignore
    expect(result).toBe(mockComputeResource.resourcePool);
    expect(spy).toHaveBeenCalledWith(`Resource pool: ${mockComputeResource.resourcePool.name}`);
  });

  it("should throw an error if compute resource has no resource pool", () => {
    const mockComputeResource = { resourcePool: null };
    //@ts-ignore
    expect(() => func.getResourcePool(mockComputeResource)).toThrowError("Compute resource does not have a resource pool.");
  });
});

describe("getComputeResource", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should return the compute resource and log its name", () => {
    const mockHostSystem = {
      parent: { name: "MyCluster" }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func.getComputeResource(mockHostSystem);
    //@ts-ignore
    expect(result).toBe(mockHostSystem.parent);
    expect(spy).toHaveBeenCalledWith(`Cluster: ${mockHostSystem.parent.name}`);
  });

  it("should return null if host system has no parent", () => {
    const mockHostSystem = { parent: null };
    //@ts-ignore
    expect(() => func.getComputeResource(mockHostSystem)).toThrowError("Hostsystem does not have a compute resource");
  });
});

describe("getVmParentHost", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should return the parent host and log its name", () => {
    const mockVm = {
      runtime: { host: { name: "MyHost" } }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func["getVmParentHost"](mockVm);
    //@ts-ignore
    expect(result).toBe(mockVm.runtime.host);
    expect(spy).toHaveBeenCalledWith(`Host: ${mockVm.runtime.host.name}`);
  });

  it("should return null if VM has no runtime or host", () => {
    const mockVm = { runtime: null };
    //@ts-ignore
    expect(() => func["getVmParentHost"](mockVm)).toThrowError("Failed to get VM parent host");
  });
});

describe("getVmType", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should return true for a template VM and log the value", () => {
    const mockVm = {
      config: { template: true }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func.getVmType(mockVm);
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith(`isTemplate: ${mockVm.config.template}`);
  });

  it("should return false for a non-template VM and log the value", () => {
    const mockVm = {
      config: { template: false }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func.getVmType(mockVm);
    expect(result).toBe(false);
    expect(spy).toHaveBeenCalledWith(`isTemplate: ${mockVm.config.template}`);
  });

  it("should throw an error if VM configuration is missing", () => {
    const mockVm = { config: null };
    //@ts-ignore
    expect(() => func.getVmType(mockVm)).toThrowError("VM configuration is missing.");
  });
});

describe("getVmPowerState", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should return the VM power state and log the value", () => {
    const mockVm = {
      runtime: { powerState: { value: "poweredOn" } }
    };
    const spy = spyOn(System, "log");
    //@ts-ignore
    const result = func.getVmPowerState(mockVm);
    expect(result).toBe("poweredOn");
    expect(spy).toHaveBeenCalledWith(`Current power state: ${result}`);
  });

  it("should throw an error if VM runtime or power state information is missing", () => {
    const mockVm = { runtime: null };
    //@ts-ignore
    expect(() => func.getVmPowerState(mockVm)).toThrowError("VM runtime or power state information is missing.");
  });
});

describe("isUpgradeVmTemplatesAllowed", () => {
  beforeEach(() => {
    func = new Functions();
  });
  it("should allow upgrade when allowUpgradeTemplates is true", () => {
    const allowUpgradeTemplates = true;
    const result = func.isUpgradeVmTemplatesAllowed(allowUpgradeTemplates);
    expect(result).toBe(true);
  });

  it("should disallow upgrade when allowUpgradeTemplates is false", () => {
    const allowUpgradeTemplates = false;
    const result = func.isUpgradeVmTemplatesAllowed(allowUpgradeTemplates);
    expect(result).toBe(false);
  });
});
