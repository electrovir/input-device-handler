import {kebabCaseToCamelCase, Overwrite} from '@augment-vir/common';
import {defineTypedCustomEvent, TypedCustomEvent, TypedCustomEventInit} from 'typed-event-target';
import {ConstructEventIfDataIsNew, InputDeviceEventTypeEnum} from './event-types';

export type TimedEventDetail<DataTypeGeneric> = {
    timestamp: number;
    inputs: DataTypeGeneric;
};

export type TimedEvent<
    DataTypeGeneric,
    SpecificEventTypeGeneric extends InputDeviceEventTypeEnum,
> = TypedCustomEvent<TimedEventDetail<DataTypeGeneric>, SpecificEventTypeGeneric>;

export type TimedEventConstructor<
    DataTypeGeneric,
    SpecificEventTypeGeneric extends InputDeviceEventTypeEnum,
> = (new (eventInitDict: TypedCustomEventInit<TimedEventDetail<DataTypeGeneric>>) => TimedEvent<
    DataTypeGeneric,
    SpecificEventTypeGeneric
>) &
    Overwrite<typeof Event, Pick<TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric>, 'type'>> & {
        getNewData: ConstructEventIfDataIsNew<DataTypeGeneric>;
        constructIfDataIsNew: (
            timestamp: number,
            ...inputs: Parameters<ConstructEventIfDataIsNew<DataTypeGeneric>>
        ) => TimedEvent<DataTypeGeneric, SpecificEventTypeGeneric> | undefined;
    };

export function defineTimedEvent<DataTypeGeneric>() {
    return <SpecificEventTypeGeneric extends InputDeviceEventTypeEnum>(
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
