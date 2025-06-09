/*-
 * #%L
 * datastore_cluster_management
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
	name: "Event Listener",
	path: "PSCoE/my-project/integration-service-1/policies",
	templateVersion: "v2",
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
export class EventListener {
	onMessage(self: AMQPSubscription, event: any) {
		let message = self.retrieveMessage(event);
		System.log(`Received message ${message.bodyAsText}`);
	}
}
