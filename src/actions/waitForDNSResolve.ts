/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { GeneralFunctions } from "./generalFunctions"
export class Network {
    private func = new GeneralFunctions()
    public waitForDNSResolve ( hostFqdn: string ) {
        const maxAttempts = 20;
        const sleepTime = 60000; // Sleep for a minute

        for ( let i = 0; i < maxAttempts; i++ ) {
            try {
                const ip = System.resolveHostName( hostFqdn );
                if ( ip && this.func.isValidIPv4( ip ) ) {
                    return; // DNS resolved successfully
                }
            } catch ( error ) {
                System.error( `Error resolving ${ hostFqdn }: ${ error }` );
            }
            System.log( `Not yet resolvable. Sleeping for ${ sleepTime / 1000 } seconds` );
            System.sleep( sleepTime )
        }
        System.warn( `DNS resolution failed after ${ maxAttempts } attempts.` );
    }
}
