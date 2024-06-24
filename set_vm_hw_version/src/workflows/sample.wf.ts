/*-
 * #%L
 * set_vm_hw_version
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
	name: "Set VM hardware version",
	path: "MyOrg/MyProject",
	id: "",
	description:
		"The workflow will configure the VM hardware default and maximum version",
	input: {
		defaultHardwareVersion: {
			type: "string",
		},
		maxHardwareVersion: {
			type: "string",
		},
		cluster: {
			type: "VC:ClusterComputeResource",
			description: "VM to update the vmtools on",
		},
	},

	output: {
		result: { type: "Any" },
	},
	presentation: "",
})
export class SetVMHardwareVersion {
	public install(
		cluster: VcClusterComputeResource,
		defaultHardwareVersion: string,
		maxHardwareVersion: string,
		@Out result: any
	): void {
		defaultHardwareVersion = `vmx-14`;
		maxHardwareVersion = `vmx-15`;
		const clusterFunctions = System.getModule(
			"com.examples.vmware_aria_orchestrator_examples.actions"
		).clusterComputeResourceManagement();
		clusterFunctions.ClusterComputeResourceManagement.prototype.setVmHardwareVersion(
			cluster,
			defaultHardwareVersion,
			maxHardwareVersion
		);
	}
}
