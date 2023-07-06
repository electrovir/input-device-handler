import {ArrayElement, getEnumTypedValues, typedObjectFromEntries} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AllDevicesUpdatedEvent} from '../events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from '../events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../events/devices-removed.event';
import {NewDevicesAddedEvent} from '../events/new-devices-added.event';
import {InputDeviceEventTypeEnum} from './event-types';

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

export type AnyInputHandlerEvent = InstanceType<ArrayElement<typeof allEvents>>;

export type InputHandlerEventsMap = {
    [PropKey in InputDeviceEventTypeEnum]: ExtractEventByType<AnyInputHandlerEvent, PropKey>[];
};

export type AnyInputHandlerEventsMap = Record<keyof InputHandlerEventsMap, AnyInputHandlerEvent[]>;

export function createEmptyEventsMap(): InputHandlerEventsMap {
    return typedObjectFromEntries(
        getEnumTypedValues(InputDeviceEventTypeEnum).map((eventType) => [
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
    [PropKey in InputDeviceEventTypeEnum]: Extract<ArrayElement<typeof allEvents>, {type: PropKey}>;
};
