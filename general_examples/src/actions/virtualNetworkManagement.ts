/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class VirtualNetworkManagement {
  private switchType: VcVirtualEthernetCardDistributedVirtualPortBackingInfo | VcNetwork;
  constructor(switchType: VcVirtualEthernetCardDistributedVirtualPortBackingInfo | VcNetwork) {
    this.switchType = switchType;
  }
  public addVnicToDistributedSwitch(vm: VcVirtualMachine, switchType: VcVirtualEthernetCardDistributedVirtualPortBackingInfo | VcNetwork, adapterType: string) {
    const configSpec = new VcVirtualMachineConfigSpec();
    const vmConfigSpecs: Array<VcVirtualDeviceConfigSpec> = [];

    // Create virtual device config spec for adding a new device
    const vmDeviceConfigSpec: VcVirtualDeviceConfigSpec = this.createVirtualDeviceConfigSpec(VcVirtualDeviceConfigSpecOperation.add);

    // Create connection info for port group
    const connectInfo: VcVirtualDeviceConnectInfo = this.createVirtualDeviceConnectInfo(true, true, true);

    // Create virtual ethernet adapter based on adapter type
    const vNetwork: VcVirtualEthernetCard | null = this.createVirtualEthernetAdapter(adapterType);

    if (vNetwork) {
      //@ts-ignore
      vNetwork.backing = switchType;
      vNetwork.unitNumber = 0;
      vNetwork.addressType = "Generated";
      vNetwork.wakeOnLanEnabled = true;
      vNetwork.connectable = connectInfo;

      // Add the configured virtual ethernet adapter to device specs
      vmDeviceConfigSpec.device = vNetwork;
      vmConfigSpecs.push(vmDeviceConfigSpec);

      configSpec.deviceChange = vmConfigSpecs;

      System.log("Reconfiguring the virtual machine to add new vNIC");
      const task: VcTask = vm.reconfigVM_Task(configSpec);
      System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(task, true, 2);
    } else {
      throw new Error("Failed to create vNIC");
    }
  }

  private createVirtualDeviceConfigSpec(operation: VcVirtualDeviceConfigSpecOperation): VcVirtualDeviceConfigSpec {
    const vmConfigSpec = new VcVirtualDeviceConfigSpec();
    vmConfigSpec.operation = operation;
    return vmConfigSpec;
  }

  private createVirtualDeviceConnectInfo(allowGuestControl: boolean, connected: boolean, startConnected: boolean): VcVirtualDeviceConnectInfo {
    const connectInfo = new VcVirtualDeviceConnectInfo();
    connectInfo.allowGuestControl = allowGuestControl;
    connectInfo.connected = connected;
    connectInfo.startConnected = startConnected;
    return connectInfo;
  }

  private createVirtualEthernetAdapter(adapterType: string): VcVirtualEthernetCard | null {
    switch (adapterType) {
      case "E1000":
        return new VcVirtualE1000();
      case "E1000e":
        return new VcVirtualE1000e();
      case "Vmxnet":
        return new VcVirtualVmxnet();
      case "Vmxnet2":
        return new VcVirtualVmxnet2();
      case "Vmxnet3":
        return new VcVirtualVmxnet3();
      default:
        throw new Error(`Unknown adapter type: ${adapterType}`);
    }
  }
}

export class DistributedVirtualPortBackingInfo {
  createVirtualEthernetCardDistributedVirtualPortBackingInfo(port: VcDistributedVirtualSwitchPortConnection): VcVirtualEthernetCardDistributedVirtualPortBackingInfo {
    if (!port) throw new Error("'Port' argument is required");
    const backingInfoDvs = new VcVirtualEthernetCardDistributedVirtualPortBackingInfo();
    backingInfoDvs.port = port;
    return backingInfoDvs;
  }
}

export class DistributedVirtualSwitchPortConnection {
  createDistributedVirtualSwitchPortConnection(portGroup: VcDistributedVirtualPortgroup): VcDistributedVirtualSwitchPortConnection {
    if (!portGroup) throw new Error("'portGroup' argument is required");
    const distributedPortConnection = new VcDistributedVirtualSwitchPortConnection();
    const distributedVirtualSwitch = VcPlugin.convertToVimManagedObject(portGroup, portGroup.config.distributedVirtualSwitch);
    distributedPortConnection.switchUuid = distributedVirtualSwitch.uuid;
    distributedPortConnection.portgroupKey = portGroup.key;
    return distributedPortConnection;
  }
}

export class StandardVirtualSwitchPortConnection {
  createStandardVirtualSwitchPortConnection(standardNetworkGroup: VcNetwork): VcVirtualEthernetCardLegacyNetworkBackingInfo {
    if (!standardNetworkGroup) throw new Error("'standardNetworkGroup' argument is required");
    const backingInfo = new VcVirtualEthernetCardLegacyNetworkBackingInfo();
    backingInfo.useAutoDetect = true;
    backingInfo.deviceName = standardNetworkGroup.name;
    return backingInfo;
  }
}
