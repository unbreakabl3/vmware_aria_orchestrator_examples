/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate( {
  name: "Sample Policy",
  path: "MyOrg/MyProject",
  type: "AMQP:Subscription"
} )
export class SamplePolicy {
  onMessage ( self: AMQPSubscription, event: any ) {
    let message = self.retrieveMessage( event );
    System.log( `Received message ${message.bodyAsText}` );
  }
}
