/*-
 * #%L
 * add_new_nic_to_vm
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
    variables: {
        sample: {
            type: "string",
            value: "",
            description: "Description"
        }
    },
    elements: {
        sample: {
            type: "AMQP:Subscription",
            events: {
                onMessage: "onMessage"
            }
        }
    }
})
export class SamplePolicy {
    onMessage(self: AMQPSubscription, event: any) {
        let message = self.retrieveMessage(event);
        System.log(`Received message ${message.bodyAsText}`);
    }
}
