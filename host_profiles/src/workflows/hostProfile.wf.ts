/*-
 * #%L
 * host_profiles
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
    name: "Host Profile",
    path: "MyOrg/MyProject",
    id: "",
    description: "Update host profile",
    attributes: {
    },
    input: {
        vmHost: { type: "VC:HostSystem" },
        hostFQDN: { type: "string" },
        hostSubnet: { type: "string" },
        hostIP: { type: "string" },        
    },
    output: {
        result: { type: "Any" }
    },
    presentation: ""
})
export class SampleWorkflow {
    public install(vmHost: VcHostSystem, hostFQDN: string, hostSubnet: string, hostIP: string, @Out result: any): void {
        
    }
}
