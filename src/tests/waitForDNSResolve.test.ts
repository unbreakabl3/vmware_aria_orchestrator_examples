/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { GeneralFunctions } from "../actions/generalFunctions"
import { Network } from "../actions/waitForDNSResolve"

const func = new GeneralFunctions()
const net = new Network()

describe( 'isValidIPv4', () => {
    let fakeIp;

    beforeEach( () => {
    } );

    it( 'should return true for a valid IP address', () => {
        fakeIp = '192.168.1.10';
        const result = func.isValidIPv4( fakeIp );

        expect( result ).toBe( true );
    } );

    it( 'should return false for an invalid IP address', () => {
        fakeIp = '256.0.0.1'; // Invalid IP
        const result = func.isValidIPv4( fakeIp );

        expect( result ).toBe( false );
    } );
} );


describe( 'waitForDNSResolve', () => {
    let fakeHostFqdn;
    let fakeIp;

    beforeEach( () => {
        fakeIp = '192.168.1.10';
        fakeHostFqdn = 'example.com';

        spyOn( System, 'error' );
        spyOn( System, 'log' );
        spyOn( System, 'warn' );
    } );

    it( 'should resolve DNS successfully', () => {
        spyOn( System, 'resolveHostName' ).and.returnValue( fakeIp );
        net.waitForDNSResolve( fakeHostFqdn );

        expect( System.resolveHostName ).toHaveBeenCalledWith( fakeHostFqdn );
    } );

    it( 'should log an error if DNS resolution fails', () => {
        const errorMessage = 'DNS resolution failed';
        spyOn( System, 'resolveHostName' ).and.throwError( errorMessage );
        net.waitForDNSResolve( fakeHostFqdn );

        expect( System.resolveHostName ).toHaveBeenCalledWith( fakeHostFqdn );
        expect( System.error ).toHaveBeenCalledWith( `Error resolving ${ fakeHostFqdn }: Error: ${ errorMessage }` );
    } );

    it( 'should log a warning after max attempts', () => {
        spyOn( System, 'sleep' );
        net.waitForDNSResolve( fakeHostFqdn );

        expect( System.sleep ).toHaveBeenCalledTimes( 20 );
        expect( System.warn ).toHaveBeenCalledWith( `DNS resolution failed after 20 attempts.` );
    } );
} );
