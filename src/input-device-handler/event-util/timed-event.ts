import {kebabCaseToCamelCase, Overwrite} from '@augment-vir/common';
import {defineTypedCustomEvent, TypedCustomEvent, TypedCustomEventInit} from 'typed-event-target';
import {AllDevices} from '../../device/all-input-devices';

/**
 * Details for a timed event, which includes a timestamp.
 *
 * @category Internal
 */
export type TimedEventDetail<DataTypeGeneric> = {
    timestamp: number;
    inputs: DataTypeGeneric;
};

/**
 * An event which contains a timestamp.
 *
 * @category Internal
 */
export type TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric extends string> = TypedCustomEvent<
    TimedEventDetail<DataTypeGeneric>,
    SpecificEventTypeGeneric
>;

/**
 * A function type used to determine if, given and current device data, a new event should be
 * constructed.
 *
 * @category Internal
 */
export type ConstructEventIfDataIsNew<EventDataGeneric> = (
    previousValues: AllDevices | undefined,
    latestValues: AllDevices,
) => EventDataGeneric | undefined;

/**
 * The constructor for `TimedEvent`.
 *
 * @category Internal
 */
export type TimedEventConstructor<DataTypeGeneric, SpecificEventTypeGeneric extends string> = (new (
    eventInitDict: TypedCustomEventInit<TimedEventDetail<DataTypeGeneric>>,
) => TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric>) &
    Overwrite<typeof Event, Pick<TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric>, 'type'>> & {
        getNewData: ConstructEventIfDataIsNew<DataTypeGeneric>;
        /** Callback that determines if the event should be constructed. */
        constructIfDataIsNew: (
            timestamp: number,
            ...inputs: Parameters<ConstructEventIfDataIsNew<DataTypeGeneric>>
        ) => TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric> | undefined;
    };

/**
 * Created a constructor for a `TimedEvent` with specific type parameters. This creates the base
 * class for all `InputDeviceHandler` events.
 *
 * @category Internal
 */
export function defineTimedEvent<const DataTypeGeneric>() {
    return <SpecificEventTypeGeneric extends string>(
        type: SpecificEventTypeGeneric,
        isDataNewCallback: ConstructEventIfDataIsNew<DataTypeGeneric>,
    ) => {
        type DetailType = TimedEventDetail<DataTypeGeneric>;
        const className = kebabCaseToCamelCase(type, {
            capitalizeFirstLetter: true,
        });
        const TimedEventConstructor = class extends defineTypedCustomEvent<DetailType>()(type) {
            public readonly eventType = type;
            static readonly getNewData = isDataNewCallback;
            /**
             * Determines if the event should be constructed or not. If so, it returns the
             * constructed event.
             */
            static constructIfDataIsNew(
                timestamp: number,
                ...inputs: Parameters<ConstructEventIfDataIsNew<DataTypeGeneric>>
            ) {
                const newDataOutput = TimedEventConstructor.getNewData(...inputs);
                if (newDataOutput) {
                    const newEvent = new TimedEventConstructor({
                        detail: {timestamp, inputs: newDataOutput},
                    });
                    return newEvent;
                } else {
                    return undefined;
                }
            }
        };

        Object.defineProperty(TimedEventConstructor, 'name', {
            value: className,
            writable: true,
        });

        return TimedEventConstructor as TimedEventConstructor<
            DataTypeGeneric,
            SpecificEventTypeGeneric
        >;
    };
}
