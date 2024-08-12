/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2024 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { VirtualNetworkAdapterManagement } from "../actions/virtualNetworkManagement";

describe("disableVirtualNetworkAdapter", function () {
  let vm, devices;
  let func: VirtualNetworkAdapterManagement;
  beforeEach(function () {
    func = new VirtualNetworkAdapterManagement();
    devices = [{ connectable: { startConnected: false, connected: false } }, { connectable: { startConnected: false, connected: false } }];

    vm = {
      config: {
        hardware: {
          device: devices
        }
      },
      reconfigVM_Task: jasmine.createSpy("reconfigVM_Task").and.callFake(() => {
        return {};
      })
    };
    const systemModule = {
      isSupportedNic: jasmine.createSpy("isSupportedNic"),
      error: jasmine.createSpy("error")
    };
    spyOn(System, "getModule").and.returnValue(systemModule);
  });

  it("should disable all supported network adapters", function () {
    func.disableVirtualNetworkAdapter(vm);

    expect(System.getModule("com.vmware.library.vc.vm.network").isSupportedNic);
    expect(vm.reconfigVM_Task).not.toHaveBeenCalled();
  });
});
