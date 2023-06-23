import {ArrayElement} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AllDevicesUpdatedEvent} from '../events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from '../events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../events/devices-removed.event';
import {NewDevicesAddedEvent} from '../events/new-devices-added.event';
import {InputDeviceHandlerEventTypeEnum} from './event-types';
import {TimedEventConstructor} from './timed.event';

export const allEvents = [
    AllDevicesUpdatedEvent,
    // make this this even is listed before the others so that devices get updated before their inputs are changed
    NewDevicesAddedEvent,
    DevicesRemovedEvent,
    CurrentInputsChangedEvent,
] as const;

export type AllEventTypes = InstanceType<ArrayElement<typeof allEvents>>;

export type EventMap = {
    [PropKey in InputDeviceHandlerEventTypeEnum]: ExtractEventByType<AllEventTypes, PropKey>;
};

export type EventsMap = {
    [PropKey in InputDeviceHandlerEventTypeEnum]: ExtractEventByType<AllEventTypes, PropKey>[];
};

export const inputHandlerEventMap: EventMap = allEvents.reduce((accum, currentEntry) => {
    accum[currentEntry.type] = currentEntry as TimedEventConstructor<
        any,
        (typeof currentEntry)['type']
    > as any;
    return accum;
}, {} as EventMap);
