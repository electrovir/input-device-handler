import {ArrayElement, getEnumTypedValues, typedObjectFromEntries} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AllDevicesUpdatedEvent} from '../events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from '../events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../events/devices-removed.event';
import {NewDevicesAddedEvent} from '../events/new-devices-added.event';
import {DeviceHandlerEventTypeEnum} from './event-types';

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

export type DeviceHandlerEventsMap = {
    [PropKey in DeviceHandlerEventTypeEnum]: ExtractEventByType<AnyDeviceHandlerEvent, PropKey>[];
};

export type AnyDeviceHandlerEventsMap = Record<
    keyof DeviceHandlerEventsMap,
    AnyDeviceHandlerEvent[]
>;

export function createEmptyEventsMap(): DeviceHandlerEventsMap {
    return typedObjectFromEntries(
        getEnumTypedValues(DeviceHandlerEventTypeEnum).map((eventType) => [
            eventType,
            [],
        ]),
    );
}

export const eventsByType = Object.fromEntries(
    allEvents.map((event) => [
        event.type,
        event,
    ]),
) as {
    [PropKey in DeviceHandlerEventTypeEnum]: Extract<
        ArrayElement<typeof allEvents>,
        {type: PropKey}
    >;
};
