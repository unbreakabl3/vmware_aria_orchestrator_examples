/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class VirtualMachineManagement {
  // Reconfigure VM CD-ROM
  public answerVmQuestion(vm: VcVirtualMachine) {
    if (!vm) {
      throw new Error("VM is not defined.");
    }

    const MAX_ATTEMPTS = 30; // Total of 5 minutes (30 * 10s)
    let attempts = 0;

    while (!vm.runtime.question && attempts < MAX_ATTEMPTS) {
      System.log("Waiting for a VM question... Sleeping for 10 seconds.");
      System.sleep(10000);
      attempts++;
    }

    if (!vm.runtime.question) {
      throw new Error("Timed out waiting for VM question.");
    }

    let question: VcVirtualMachineQuestionInfo = vm.runtime.question;
    attempts = 0;

    while (!question.id && attempts < MAX_ATTEMPTS) {
      System.log("Waiting for a valid question ID... Sleeping for 10 seconds.");
      System.sleep(10000);
      attempts++;
      question = vm.runtime.question; // Refresh question object
    }

    if (!question.id) {
      throw new Error("Timed out waiting for a valid question ID.");
    }

    const questionId: string = question.id;

    if (!question.choice || !Array.isArray(question.choice.choiceInfo)) {
      throw new Error("Invalid choice information in the VM question.");
    }

    const choiceList = "0"; // Answer "yes"

    try {
      vm.answerVM(questionId, choiceList);
      System.log("Successfully answered VM question. CD-ROM has been disconnected.");
    } catch (e) {
      throw new Error(`Failed to answer YES. Could not disconnect CD-ROM. Error: ${e}`);
    }
  }

  public reconfigureCdrom(vm: VcVirtualMachine) {
    if (!vm) {
      throw new Error("Required parameter 'vm' is not defined.");
    }

    const deviceConfigSpecs: Array<VcVirtualDeviceConfigSpec> = this.getCdromDeviceSpecs(vm);
    if (deviceConfigSpecs.length === 0) {
      System.log("No CD-ROM devices found. No changes made.");
      return;
    }

    const configSpec = new VcVirtualMachineConfigSpec();
    configSpec.deviceChange = deviceConfigSpecs;

    this.executeReconfigTask(vm, configSpec);
  }

  private executeReconfigTask(vm: VcVirtualMachine, configSpec: VcVirtualMachineConfigSpec) {
    System.log("Reconfiguring VM CD-ROM...");

    try {
      const task: VcTask = vm.reconfigVM_Task(configSpec);
      const taskActionResult = System.getModule("com.vmware.library.vc.basic").WaitTaskEndOrVMQuestion(task, true, 2, vm);

      this.handleVmQuestion(vm, taskActionResult);
    } catch (error) {
      throw new Error(`Failed to reconfigure VM CD-ROM. Error: ${error}`);
    }
  }

  private handleVmQuestion(vm: VcVirtualMachine, taskActionResult: any) {
    if (taskActionResult instanceof VcVirtualMachineQuestionInfo) {
      System.log("VM requires a question response. Answering now...");
      this.answerVmQuestion(vm);
    } else {
      System.log("VM reconfiguration completed successfully.");
    }
  }

  private getCdromDeviceSpecs(vm: VcVirtualMachine): Array<VcVirtualDeviceConfigSpec> {
    if (!vm || !vm.config || !vm.config.hardware || !vm.config.hardware.device) {
      throw new Error("Invalid VM configuration.");
    }

    return vm.config.hardware.device.filter((device) => device instanceof VcVirtualCdrom).map((device) => this.createCdromConfigSpec(device));
  }

  private createCdromConfigSpec(device: VcVirtualCdrom): VcVirtualDeviceConfigSpec {
    const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
    const backingInfo = new VcVirtualCdromRemotePassthroughBackingInfo();
    backingInfo.deviceName = "";
    device.backing = backingInfo;
    deviceConfigSpec.device = device;
    deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.edit;

    return deviceConfigSpec;
  }

  // vCenter snapshot deletion scheduled task
  private getServiceInstance(vm: VcVirtualMachine): VcServiceInstance {
    let sdkConnection: VcSdkConnection = vm.sdkConnection;
    let serviceInstanceReference: VcManagedObjectReference = new VcManagedObjectReference();
    serviceInstanceReference.type = "ServiceInstance";
    serviceInstanceReference.value = "ServiceInstance";
    return VcPlugin.convertToVimManagedObject(sdkConnection, serviceInstanceReference);
  }

  private createOnceTaskScheduler(taskRunAt: Date): VcOnceTaskScheduler {
    let onceTaskScheduler: VcOnceTaskScheduler = new VcOnceTaskScheduler();
    onceTaskScheduler.runAt = taskRunAt;
    return onceTaskScheduler;
  }

  private removeSnapshotsActionTask(): VcMethodAction {
    let actionTask: VcMethodAction = new VcMethodAction();
    actionTask.name = "RemoveAllSnapshots_Task";
    let argument: VcMethodActionArgument = new VcMethodActionArgument();
    actionTask.argument = [argument];
    return actionTask;
  }

  private createSnapshotsActionTask({
    snapName,
    snapDescription,
    snapMemory,
    snapQuiesce
  }: {
    snapName: string;
    snapDescription: string;
    snapMemory: boolean;
    snapQuiesce: boolean;
  }): VcMethodAction {
    const actionTask = new VcMethodAction();
    actionTask.name = "CreateSnapshot_Task";

    const createArgument = (value: any): VcMethodActionArgument => {
      const arg = new VcMethodActionArgument();
      arg.value_AnyValue = value;
      return arg;
    };
    const snapshotName: VcMethodActionArgument = createArgument(`${snapName}_scheduledSnapshot_${new Date().toISOString()}`);
    const description: VcMethodActionArgument = createArgument(snapDescription);
    const memory: VcMethodActionArgument = createArgument(snapMemory);
    const quiesce: VcMethodActionArgument = createArgument(snapQuiesce);
    actionTask.argument = [snapshotName, description, memory, quiesce];

    return actionTask;
  }

  public createScheduledSnapshotTaskSpec({
    vm,
    scheduledTaskSpecName,
    scheduledTaskSpecDescription,
    scheduledTaskRunAt,
    useRemoveSnapshotsAction,
    scheduledTaskEmailNotification,
    snapshotName,
    snapshotDescription,
    snapshotMemory,
    snapshotQuiesce
  }: {
    vm: VcVirtualMachine;
    scheduledTaskSpecName: string;
    scheduledTaskSpecDescription: string;
    scheduledTaskRunAt: Date;
    useRemoveSnapshotsAction: boolean;
    scheduledTaskEmailNotification: string;
    snapshotName: string;
    snapshotDescription: string;
    snapshotMemory: boolean;
    snapshotQuiesce: boolean;
  }): VcScheduledTaskSpec {
    let scheduledTaskSpec: VcScheduledTaskSpec = new VcScheduledTaskSpec();
    scheduledTaskSpec.name = vm.name + " " + scheduledTaskSpecName;
    scheduledTaskSpec.description = scheduledTaskSpecDescription;
    scheduledTaskSpec.enabled = true;
    scheduledTaskSpec.scheduler = this.createOnceTaskScheduler(scheduledTaskRunAt);
    scheduledTaskSpec.notification = scheduledTaskEmailNotification;
    scheduledTaskSpec.action = useRemoveSnapshotsAction
      ? this.removeSnapshotsActionTask()
      : this.createSnapshotsActionTask({ snapName: snapshotName, snapDescription: snapshotDescription, snapMemory: snapshotMemory, snapQuiesce: snapshotQuiesce });

    return scheduledTaskSpec;
  }

  public createScheduledSnapshotTask(vm: VcVirtualMachine, scheduledTaskSpec: VcScheduledTaskSpec): VcScheduledTask {
    let serviceInstance: VcServiceInstance = this.getServiceInstance(vm);
    let serviceContent: VcServiceContent = serviceInstance.content;
    let vcScheduledTaskManager = serviceContent.scheduledTaskManager;

    try {
      let scheduledTask: VcScheduledTask = vcScheduledTaskManager.createScheduledTask(vm, scheduledTaskSpec);
      System.log("Scheduled Task Created: " + scheduledTask.info.name);
      return scheduledTask;
    } catch (e) {
      System.error("Failed to create scheduled task: " + e);
      throw e;
    }
  }
}
