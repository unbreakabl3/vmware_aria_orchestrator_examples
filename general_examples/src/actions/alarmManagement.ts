/*-
 * #%L
 * vmware_aria_orchestrator_examples
 * %%
 * Copyright (C) 2025 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
export class AlarmManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlarmManagementError";
  }
}

export class AlarmManagement {
  private handleError(errorDescription: string): never {
    throw new AlarmManagementError(`Error: ${errorDescription}.`);
  }

  public getTriggeredAlarms(vCenter: VcSdkConnection) {
    if (!vCenter) {
      throw this.handleError("No vCenter connections available.");
    }

    const alarmManager = vCenter.alarmManager;
    if (!alarmManager) {
      throw this.handleError("Alarm Manager not found.");
    }

    // Validate objects to check
    const objectsToCheck = VcPlugin.allHostSystems;
    if (!objectsToCheck || objectsToCheck.length === 0) {
      throw this.handleError("No host systems available to check.");
    }

    // Helper function to extract triggered alarms from alarm states
    const extractTriggeredAlarms = (managedObject, alarmStates) => {
      return alarmStates
        .filter((state) => state.overallStatus === VcManagedEntityStatus.red || state.overallStatus === VcManagedEntityStatus.yellow)
        .map((state) => ({
          vcHost: managedObject,
          alarmName: state.alarm.info.name,
          status: state.overallStatus.value,
          time: state.time,
          alarmObject: state.alarm
        }));
    };

    // Collect triggered alarms
    const triggeredAlarms = [];
    objectsToCheck.forEach((managedObject) => {
      try {
        const alarmStates: Array<VcAlarmState> = alarmManager.getAlarmState(managedObject);
        const unAcknowledgedAlarms: Array<VcAlarmState> = alarmStates.filter((state) => state.acknowledged === false);
        if (alarmStates) {
          triggeredAlarms.push(...extractTriggeredAlarms(managedObject, unAcknowledgedAlarms));
        }
      } catch (error) {
        System.warn(`Failed to get alarm states for ${managedObject.name}: ${error}`);
      }
    });

    return triggeredAlarms;
  }

  public processAlarms(vCenter: VcSdkConnection, vcHost: VcManagedEntity, alarmName: string, alarm: VcAlarm): void {
    const alarmManager: VcAlarmManager = vCenter.alarmManager;
    const alarmToAcknowledge: VcAlarm | undefined = this.getAlarmByName(alarm, alarmName);
    if (alarmToAcknowledge) {
      this.acknowledgeSpecificAlarm(alarmManager, vcHost, alarmToAcknowledge);
    } else {
      System.warn(`Alarm with name ${alarmName} not found.`);
    }
  }

  private getAlarmByName(alarm: VcAlarm, alarmName: string): VcAlarm | undefined {
    return alarm.info.name === alarmName ? alarm : undefined;
  }

  private acknowledgeSpecificAlarm(alarmManager: VcAlarmManager, vcHost: VcManagedEntity, alarm: VcAlarm): void {
    try {
      alarmManager.acknowledgeAlarm(alarm, vcHost);
    } catch (error) {
      this.handleError(`Failed to acknowledge alarm ${alarm.info.name} on ${vcHost.name}: ${error}`);
    }
  }

  private clearTriggeredAlarm(
    alarmManager: VcAlarmManager,
    entityType: VcAlarmFilterSpecAlarmTypeByEntity,
    triggerType: VcAlarmFilterSpecAlarmTypeByTrigger,
    status: VcManagedEntityStatus
  ): void {
    var vcAlarmFilterSpec = new VcAlarmFilterSpec();
    vcAlarmFilterSpec.typeEntity = entityType.entityTypeHost;
    vcAlarmFilterSpec.typeTrigger = triggerType.triggerTypeMetric;
    //@ts-ignore
    vcAlarmFilterSpec.status = [status.red];

    try {
      alarmManager.clearTriggeredAlarms(vcAlarmFilterSpec);
    } catch (error) {
      this.handleError(`Failed to clear triggered alarms: ${error}`);
    }
  }
}
