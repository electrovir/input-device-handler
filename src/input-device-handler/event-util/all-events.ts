import {ArrayElement, typedObjectFromEntries} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AllDevicesUpdatedEvent} from '../events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from '../events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../events/devices-removed.event';
import {NewDevicesAddedEvent} from '../events/new-devices-added.event';

export const allEvents = [
    /**
     * Make this this event is listed before the others so that devices get updated before their
     * inputs are changed.
     */
    AllDevicesUpdatedEvent,
    NewDevicesAddedEvent,
    DevicesRemovedEvent,
    CurrentInputsChangedEvent,
] as const;

export type AnyDeviceHandlerEventConstructor = ArrayElement<typeof allEvents>;
export type AnyDeviceHandlerEvent = InstanceType<ArrayElement<typeof allEvents>>;
export type DeviceHandlerEventType = AnyDeviceHandlerEventConstructor['type'];

export type DeviceHandlerEventsMap = {
    [PropKey in DeviceHandlerEventType]: ExtractEventByType<AnyDeviceHandlerEvent, PropKey>[];
};

export type AnyDeviceHandlerEventsMap = Record<
    keyof DeviceHandlerEventsMap,
    AnyDeviceHandlerEvent[]
>;

export function createEmptyDeviceHandlerEventsMap(): DeviceHandlerEventsMap {
    return typedObjectFromEntries(
        allEvents.map((eventConstructor) => [
            eventConstructor.type,
            [],
        ]),
    );
}

export const deviceHandlerEventConstructorsByType = Object.fromEntries(
    allEvents.map((eventConstructor) => [
        eventConstructor.type,
        eventConstructor,
    ]),
) as {
    [PropKey in DeviceHandlerEventType]: Extract<ArrayElement<typeof allEvents>, {type: PropKey}>;
};
