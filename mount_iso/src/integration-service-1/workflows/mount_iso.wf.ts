/*-
 * #%L
 * mount_iso
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Out, Workflow } from "vrotsc-annotations";

@Workflow({
	name: "Mount ISO",
	path: "MyOrg/MyProject",
	id: "",
	description: "This workflow mounts an ISO to a VM",
	input: {
		datastore: {
			type: "VC:Datastore",
			description: "Datastore Value",
			required: true,
			title: "Datastore",
		},
		folder: {
			type: "string",
			description: "Folder path",
			required: true,
			title: "Folder",
		},
		iso: {
			type: "string",
			description: "ISO file name",
			required: true,
			title: "ISO",
		},
		vm: {
			type: "VC:VirtualMachine",
			description: "VM name",
			required: true,
			title: "VM",
		},
	},
	output: {
		result: { type: "Any" },
	},
	presentation: "",
})
export class MountIsoWorkflow {
	public install(
		datastore: VcDatastore,
		vm: VcVirtualMachine,
		iso: string,
		folder: string,
		@Out result: any
	): void {
		function createCdromDeviceConfig(
			isoPath: string
		): VcVirtualDeviceConfigSpec {
			let cdromConfig: VcVirtualDeviceConfigSpec =
				new VcVirtualDeviceConfigSpec();
			let cdrom: VcVirtualCdrom = new VcVirtualCdrom();

			// Set up connectable properties
			cdrom.connectable = new VcVirtualDeviceConnectInfo();
			cdrom.connectable.connected = false;
			cdrom.connectable.allowGuestControl = true;
			cdrom.connectable.startConnected = true;

			// Set up ISO backing
			cdrom.backing = new VcVirtualCdromIsoBackingInfo();
			//@ts-ignore
			cdrom.backing.fileName = isoPath;

			// Set device properties
			cdrom.controllerKey = 15000;
			cdrom.unitNumber = 0;
			cdrom.deviceInfo = new VcDescription();
			cdrom.deviceInfo.summary = "Remote ATAPI";
			cdrom.deviceInfo.label = "CD/DVD drive 1";
			cdrom.key = 16000;

			// Assign device to config spec
			cdromConfig.device = cdrom;
			cdromConfig.operation = VcVirtualDeviceConfigSpecOperation.edit;

			return cdromConfig;
		}

		function createReconfigSpec(isoPath: string): VcVirtualMachineConfigSpec {
			let spec: VcVirtualMachineConfigSpec = new VcVirtualMachineConfigSpec();
			spec.deviceChange = [createCdromDeviceConfig(isoPath)];
			//@ts-ignore
			spec.virtualNuma = new VcVirtualMachineVirtualNuma();
			return spec;
		}

		function reconfigureVm(vm: VcVirtualMachine, isoPath: string): void {
			let spec: VcVirtualMachineConfigSpec = createReconfigSpec(isoPath);
			System.log(`Reconfiguring the virtual machine to mount '${isoPath}'...`);
			try {
				const task: VcTask = vm.reconfigVM_Task(spec);
				System.getModule("com.vmware.library.vc.basic").vim3WaitTaskEnd(
					task,
					true,
					2
				);
			} catch (error) {
				throw new Error("Failed to reconfigure VM: " + error);
			}
		}

		function isValidIsoFile(fileName: string): boolean {
			return fileName.toLowerCase().endsWith(".iso");
		}

		if (!isValidIsoFile(iso)) {
			throw new Error("Invalid ISO file name.");
		}

		const isoFilePath: string = `[${datastore.name}] ${folder}/${iso}`;
		reconfigureVm(vm, isoFilePath);
	}
}
