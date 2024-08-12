/*-
 * #%L
 * policy_management
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
    name: "Sample Policy",
    path: "MyOrg/MyProject",
    templateVersion: "v2", // or v1
})
export class SamplePolicy {
    onMessage(self: AMQPSubscription, event: any) {
        let message = self.retrieveMessage(event);
        System.log(`Received message ${message.bodyAsText}`);
    }
}
