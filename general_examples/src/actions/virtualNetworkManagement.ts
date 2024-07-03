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
  public addVnicToDistributedSwitch(vm: VcVirtualMachine, portGroup: VcDistributedVirtualPortgroup, adapterType: string) {
    const configSpec = new VcVirtualMachineConfigSpec();
    const vmConfigSpecs: Array<VcVirtualDeviceConfigSpec> = [];

    // Create virtual device config spec for adding a new device
    const vmDeviceConfigSpec: VcVirtualDeviceConfigSpec = this.createVirtualDeviceConfigSpec(VcVirtualDeviceConfigSpecOperation.add);

    // Create connection info for port group
    const connectInfo: VcVirtualDeviceConnectInfo = this.createVirtualDeviceConnectInfo(true, true, true);

    // Create distributed virtual switch port connection
    const distributedPortConnection: VcDistributedVirtualSwitchPortConnection = this.createDistributedVirtualSwitchPortConnection(portGroup);

    // Create virtual ethernet adapter based on adapter type
    const vNetwork = this.createVirtualEthernetAdapter(adapterType);

    if (vNetwork) {
      //@ts-ignore
      vNetwork.backing = this.createVirtualEthernetCardDistributedVirtualPortBackingInfo(distributedPortConnection);
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
      throw new Error("Failed to create virtual ethernet adapter");
    }
  }

  // Helper functions to improve readability and reusability
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

  private createDistributedVirtualSwitchPortConnection(portGroup: VcDistributedVirtualPortgroup): VcDistributedVirtualSwitchPortConnection {
    const distributedPortConnection = new VcDistributedVirtualSwitchPortConnection();
    const distributedVirtualSwitch = VcPlugin.convertToVimManagedObject(portGroup, portGroup.config.distributedVirtualSwitch);
    distributedPortConnection.switchUuid = distributedVirtualSwitch.uuid;
    distributedPortConnection.portgroupKey = portGroup.key;
    return distributedPortConnection;
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
    // return null;
  }

  private createVirtualEthernetCardDistributedVirtualPortBackingInfo(port: VcDistributedVirtualSwitchPortConnection): VcVirtualEthernetCardDistributedVirtualPortBackingInfo {
    const backingInfoDvs = new VcVirtualEthernetCardDistributedVirtualPortBackingInfo();
    backingInfoDvs.port = port;
    return backingInfoDvs;
  }

  // public addVnicToDistributedSwitch(vm: VcVirtualMachine, portGroup: VcDistributedVirtualPortgroup, adapterType: string) {
  //   const configSpec = new VcVirtualMachineConfigSpec();
  //   const vmConfigSpecs: Array<VcVirtualDeviceConfigSpec> = [];

  //   // Create operation for device config spec
  //   const vmConfigSpec = new VcVirtualDeviceConfigSpec();
  //   vmConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.add;

  //   // Create connect info for portGroup
  //   const connectInfo = new VcVirtualDeviceConnectInfo();
  //   connectInfo.allowGuestControl = true;
  //   connectInfo.connected = true;
  //   connectInfo.startConnected = true;

  //   // Creating distributed virtual switch port connection
  //   const distributedPortConnection = new VcDistributedVirtualSwitchPortConnection();
  //   const distributedVirtualSwitch = VcPlugin.convertToVimManagedObject(portGroup, portGroup.config.distributedVirtualSwitch);
  //   distributedPortConnection.switchUuid = distributedVirtualSwitch.uuid;
  //   distributedPortConnection.portgroupKey = portGroup.key;

  //   // Creating backing info for distributed switch
  //   const backingInfoDvs = new VcVirtualEthernetCardDistributedVirtualPortBackingInfo();
  //   backingInfoDvs.port = distributedPortConnection;

  //   // Create virtual ethernet adapter
  //   let vNetwork: VcVirtualEthernetCard | null = null;
  //   switch (adapterType) {
  //     case "E1000":
  //       vNetwork = new VcVirtualE1000();
  //       break;
  //     case "E1000e":
  //       vNetwork = new VcVirtualE1000e();
  //       break;
  //     case "Vmxnet":
  //       vNetwork = new VcVirtualVmxnet();
  //       break;
  //     case "Vmxnet2":
  //       vNetwork = new VcVirtualVmxnet2();
  //       break;
  //     case "Vmxnet3":
  //       vNetwork = new VcVirtualVmxnet3();
  //       break;
  //     default:
  //       throw new Error(`Unknown adapter type: ${adapterType}`);
  //   }

  //   if (vNetwork) {
  //     //@ts-ignore
  //     vNetwork.backing = backingInfoDvs;
  //     vNetwork.unitNumber = 0;
  //     vNetwork.addressType = "Generated";
  //     vNetwork.wakeOnLanEnabled = true;
  //     vNetwork.connectable = connectInfo;

  //     // Creating device specs configured in vNetwork object
  //     vmConfigSpec.device = vNetwork;
  //     vmConfigSpecs.push(vmConfigSpec);

  //     // Adding the device to the configSpec
  //     configSpec.deviceChange = vmConfigSpecs;

  //     System.log("Reconfiguring the virtual machine to add new vNIC");
  //     const task = vm.reconfigVM_Task(configSpec);
  //   } else {
  //     throw new Error("Failed to create virtual ethernet adapter");
  //   }
  // }
}
