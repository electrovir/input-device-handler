import {ArrayElement, wrapNarrowTypeWithTypeCheck} from 'augment-vir';
import {Constructed} from '../../augments/constructor';
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

type EventMap = {[PropKey in InputDeviceHandlerEventTypeEnum]: TimedEventConstructor<any, PropKey>};

const allEventsMap = allEvents.reduce((accum, currentEntry) => {
    accum[currentEntry.type] = currentEntry as TimedEventConstructor<
        any,
        typeof currentEntry['type']
    > as any;
    return accum;
}, {} as {[PropKey in ArrayElement<typeof allEvents>['type']]: TimedEventConstructor<any, PropKey>});

export const inputHandlerEventMap = wrapNarrowTypeWithTypeCheck<EventMap>()(allEventsMap);

export type AllEventTypes = Constructed<ArrayElement<typeof allEvents>>;
