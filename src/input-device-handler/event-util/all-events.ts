import {ArrayElement, typedObjectFromEntries} from '@augment-vir/common';
import {ExtractEventByType} from 'typed-event-target';
import {AllDevicesUpdatedEvent} from '../events/all-devices-updated.event';
import {CurrentInputsChangedEvent} from '../events/current-inputs-changed.event';
import {DevicesRemovedEvent} from '../events/devices-removed.event';
import {NewDevicesAddedEvent} from '../events/new-devices-added.event';

/**
 * All possible `InputDeviceHandler` events.
 *
 * @category Internal
 */
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

/**
 * A union of all possible `InputDeviceHandler` event constructors.
 *
 * @category Internal
 */
export type DeviceHandlerEventConstructor = ArrayElement<typeof allEvents>;
/**
 * A union of all possible `InputDeviceHandler` event instances.
 *
 * @category Events
 */
export type DeviceHandlerEvent = InstanceType<ArrayElement<typeof allEvents>>;
/**
 * A union of all possible `InputDeviceHandler` event strings.
 *
 * @category Internal
 */
export type DeviceHandlerEventType = DeviceHandlerEventConstructor['type'];

/**
 * An object that maps all possible `InputDeviceHandler` event strings to an array of their
 * respective event instances.
 *
 * @category Internal
 */
export type DeviceHandlerEventsMap = {
    [PropKey in DeviceHandlerEventType]: ExtractEventByType<DeviceHandlerEvent, PropKey>[];
};

/**
 * Creates an instance of `DeviceHandlerEventsMap` with empty arrays, ready for population.
 *
 * @category Internal
 */
export function createEmptyDeviceHandlerEventsMap(): DeviceHandlerEventsMap {
    return typedObjectFromEntries(
        allEvents.map((eventConstructor) => [
            eventConstructor.type,
            [],
        ]),
    );
}

/**
 * An object that maps all possible `InputDeviceHandler` event strings to their respective event
 * constructors.
 *
 * @category Internal
 */
export const deviceHandlerEventConstructorsByType = Object.fromEntries(
    allEvents.map((eventConstructor) => [
        eventConstructor.type,
        eventConstructor,
    ]),
) as {
    [PropKey in DeviceHandlerEventType]: Extract<ArrayElement<typeof allEvents>, {type: PropKey}>;
};
