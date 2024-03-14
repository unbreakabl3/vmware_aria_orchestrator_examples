/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { ConfigElement, InvalidConfigElementError } from "../actions/configElement"
import { AttributeMap } from "../types/types"

describe ( "findConfigurationElementByName", () => {
  let func: ConfigElement;
  beforeEach ( () => {
    func = new ConfigElement ();
  } );

  const mockElements: Array<ConfigurationElement> = [
    //@ts-ignore
    { name: "Config1", description: "Description1", version: "1.0", /* ... other properties */ },
    //@ts-ignore
    { name: "Config2", description: "Description2", version: "2.0", /* ... other properties */ },
    //@ts-ignore
    { name: "Config3", description: "Description3", version: "3.0", /* ... other properties */ },
    ];

    it ( "should find an existing configuration element by name", () => {
        const result: ConfigurationElement | undefined = func["findConfigurationElementByName"] ( mockElements, "Config2" );
        expect ( result ).toBeDefined ();
        expect ( result?.name ).toBe ( "Config2" );
    } );

    it ( "should return undefined for a non-existing configuration element", () => {
        const result: ConfigurationElement | undefined = func["findConfigurationElementByName"] ( mockElements, "NonExistentConfig" );
        expect ( result ).toBeUndefined ();
    } );
} );

describe ( "handleConfigError", () => {
  let func: ConfigElement;
  beforeEach ( () => {
    func = new ConfigElement ();
  } );

  it ( "should throw an InvalidConfigElementError with the correct message", () => {
    const configName = "myConfig";
    const error = new Error ( "Some error message" );

    expect ( () => {
      func["handleConfigError"] ( configName, error );
    } ).toThrow ( new Error ( `Could not find configuration element ${configName}. ${error}` ) );
  } );
} );

describe ( "getConfigElement", () => {
  let func: ConfigElement;
  const configName = "someName";
  const configPath = "somePath"

  beforeEach ( () => {
    func = new ConfigElement ();
  } );

  it ( "should return undefined if configName or configPath is missing", () => {
    const result: ConfigurationElement | undefined = func.getConfigElement ( { configName: "", configPath: "" } );
    expect ( result ).toBeUndefined ();
  } );

  it ( "should handle missing configuration elements category", () => {
    spyOn ( Server, "getConfigurationElementCategoryWithPath" ).and.returnValue ( null );
    const result = () => func.getConfigElement ( { configName: configName, configPath: configPath } );

    expect ( ( result ) ).toThrow ( new InvalidConfigElementError ( `Could not find configuration element ${configName}. InvalidConfigElementError: Could not find configuration element ${configName}. Configuration element category not found` ) );
  } );

  it ( "should handle missing configuration element", () => {
    const mockConfigurationElements = [{ name: "otherElement" }];
    spyOn<any> ( Server, "getConfigurationElementCategoryWithPath" ).and.returnValue ( { allConfigurationElements: mockConfigurationElements } );
    spyOn<any> ( func, "findConfigurationElementByName" ).and.returnValue ( null );
    const error = "Configuration element not found";

    const result = () => func.getConfigElement ( { configName: "someName", configPath: "somePath" } );

    expect ( ( result ) ).toThrow ( new InvalidConfigElementError ( `Could not find configuration element ${configName}. InvalidConfigElementError: Could not find configuration element ${configName}. ${error}` ) );
  } );

  it ( "should return the configuration element", () => {
    const mockConfigurationElements = [{ name: "someName", value: "someValue" }];
    spyOn<any> ( Server, "getConfigurationElementCategoryWithPath" ).and.returnValue ( { allConfigurationElements: mockConfigurationElements } );
    spyOn<any> ( func, "findConfigurationElementByName" ).and.returnValue ( mockConfigurationElements[0] );

    const result: ConfigurationElement | undefined = func.getConfigElement ( { configName: "someName", configPath: "somePath" } );

    expect ( result ).toBeDefined ()
    //@ts-ignore
    expect ( result ).toEqual ( mockConfigurationElements[0] );
  } );

  it ( "should handle errors", () => {
    const mockError = new Error ( "Some error message" );
    spyOn ( Server, "getConfigurationElementCategoryWithPath" ).and.throwError ( mockError );

    const result = () => func.getConfigElement ( { configName: "someName", configPath: "somePath" } );
    expect ( ( result ) ).toThrow ( new Error ( `Could not find configuration element someName. ${mockError}` ) );
  } );
} );

describe ( "getConfElementAttributes", () => {
  let func: ConfigElement;
  let elementSpy: jasmine.SpyObj<ConfigurationElement>;
  let spyAttributeMap: jasmine.SpyObj<AttributeMap>;

  beforeEach ( () => {
    func = new ConfigElement ();
    elementSpy = jasmine.createSpyObj ( "ConfigurationElement", [
      "getAttributeWithKey",
    ] );
  } );

  it ( "should return undefined if getAttributeWithKey throws an error", () => {
    const elementName = {
            powerMin: 10,
            powerMax: 100,
            domainName: "example.com",
          }

    elementSpy.getAttributeWithKey.and.throwError ( new Error ( "getAttributeWithKey error" ) );

    expect ( () => func.getConfElementAttributes ( elementSpy ) ).toThrow (
      new Error ( `Could not getAttributeWithKey() from element '${elementName}'. Error: getAttributeWithKey error` )
    );
  } );

  it ( "should return an AttributeMap with extracted attributes", () => {
    const powerMin: Attribute = {
      name: "powerMin",
      description: "someElement description",
      type: "someType",
      value: 10
    }
    const powerMax: Attribute = {
      name: "powerMin",
      description: "someElement description",
      type: "someType",
      value: 20
    }
    const domainName: Attribute = {
      name: "powerMin",
      description: "someElement description",
      type: "someType",
      value: "example.com"
    }
    spyAttributeMap = jasmine.createSpyObj ( "AttributeMap", ["powerMin", "powerMax", "domainName"] );
    spyAttributeMap.powerMin = 10;
    spyAttributeMap.powerMax = 20;
    spyAttributeMap.domainName  = "example.com";

    elementSpy.getAttributeWithKey.withArgs ( "powerMin" ).and.returnValue ( powerMin );
    elementSpy.getAttributeWithKey.withArgs ( "powerMax" ).and.returnValue ( powerMax );
    elementSpy.getAttributeWithKey.withArgs ( "domainName" ).and.returnValue ( domainName );
    spyOn<any> ( func, "validateConfigElementAttributes" ).and.callThrough ();
    
    const actualAttributes: AttributeMap | undefined = func.getConfElementAttributes ( elementSpy );
    expect ( actualAttributes ).toEqual ( spyAttributeMap );
    expect ( func["validateConfigElementAttributes"] ).toHaveBeenCalledWith ( spyAttributeMap )
  } );

} );

describe ( "validateConfigElementAttributes", () => {
  let mockAttrs: AttributeMap;
  let func: ConfigElement;

  beforeEach ( () => {
    mockAttrs = {
      powerMin: 10,
      powerMax: 100,
      domainName: "example.com",
    };
    func = new ConfigElement ();
  } );

  it ( "should return valid attributes", () => {
    const result: AttributeMap = func["validateConfigElementAttributes"] ( mockAttrs );
    expect ( result ).toEqual ( mockAttrs );
  } );

  it ( "should throw an error for missing attributes", () => {
    const invalidAttrs = { powerMin: 10, domainName: "example.com" };
    expect ( () => func["validateConfigElementAttributes"] ( invalidAttrs ) ).toThrowError (
      "One or more attributes are missing, null, or not a number (powerMin/powerMax) or string (domainName)"
    );
  } );

  it ( "should throw an error for non-numeric powerMin", () => {
    // @ts-ignore
    mockAttrs.powerMin = "invalid";
    expect ( () => func["validateConfigElementAttributes"] ( mockAttrs ) ).toThrowError (
      "One or more attributes are missing, null, or not a number (powerMin/powerMax) or string (domainName)"
    );
  } );

  it ( "should throw an error for non-numeric powerMax", () => {
    // @ts-ignore
    mockAttrs.powerMax = "invalid";
    expect ( () => func["validateConfigElementAttributes"] ( mockAttrs ) ).toThrowError (
      "One or more attributes are missing, null, or not a number (powerMin/powerMax) or string (domainName)"
    );
  } );

  it ( "should throw an error for non-string domainName", () => {
    // @ts-ignore
    mockAttrs.domainName = 123;
    expect ( () => func["validateConfigElementAttributes"] ( mockAttrs ) ).toThrowError (
      "One or more attributes are missing, null, or not a number (powerMin/powerMax) or string (domainName)"
    );
  } );
} );

describe ( "InvalidConfigElementError", () => {
  it ( "should create an instance with the provided message", () => {
    const errorMessage = "This is a custom error.";
    const error = new InvalidConfigElementError ( errorMessage );

    expect ( error instanceof Error ).toBe ( true );
    expect ( error.message ).toBe ( errorMessage );
    expect ( error.name ).toBe ( "InvalidConfigElementError" );
  } );

  it ( "should have the correct name property", () => {
    const errorMessage = "This is a custom error.";
    const error = new InvalidConfigElementError ( errorMessage );

    expect ( error.name ).toBe ( "InvalidConfigElementError" );
  } );

  it ( "should have the correct message property", () => {
    const errorMessage = "This is a custom error.";
    const error = new InvalidConfigElementError ( errorMessage );

    expect ( error.message ).toBe ( errorMessage );
  } );

  it ( "should have the correct stack trace", () => {
    const errorMessage = "This is a custom error.";
    const error = new InvalidConfigElementError ( errorMessage );

    expect ( error.stack ).toBeDefined ();
    expect ( error.stack?.includes ( "InvalidConfigElementError" ) ).toBe ( true );
  } );
} );
