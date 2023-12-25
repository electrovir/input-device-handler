import {
    AnyFunction,
    Writeable,
    getEnumTypedValues,
    typedObjectFromEntries,
} from '@augment-vir/common';
import {
    AllDevices,
    GamepadInputDevices,
    gamepadMapToInputDevices,
} from '../device/all-input-devices';
import {AllGamepadDeadZoneSettings} from '../device/gamepad/dead-zone-settings';
import {createAxeName, createButtonName} from '../device/gamepad/gamepad-input-names';
import {readCurrentGamepads} from '../device/gamepad/read-gamepads';
import {
    KeyboardDevice,
    MouseDevice,
    keyboardBaseDevice,
    mouseBaseDevice,
} from '../device/input-device';
import {inputDeviceKey} from '../device/input-device-key';
import {InputDeviceTypeEnum} from '../device/input-device-type';
import {KeyboardInputValue} from '../device/input-value';
import {
    AnyDeviceHandlerEvent,
    AnyDeviceHandlerEventConstructor,
    allEvents,
} from './event-util/all-events';
import {AnyDeviceHandlerListener, DeviceHandlerListener} from './event-util/event-listener';
import {DeviceHandlerEventTypeEnum} from './event-util/event-types';

export type InputDeviceHandlerOptions = Partial<{
    /**
     * Set to true to automatically start the loop from starting which will continuously read inputs
     * and emit events. If you already have a render loop running, do not enable this (as then
     * you'll have multiple render loops running). Instead, call readAllDevices directly from your
     * render loop.
     */
    startLoopImmediately: boolean;
    /**
     * By default listening to mouse movement is turned on, which results in many changes detected
     * all the time. If you're polling the status of inputs, that's fine. If you're listening to
     * events, that might be too much. Consider setting this to true in that case.
     */
    disableMouseMovement: boolean;
    gamepadDeadZoneSettings: AllGamepadDeadZoneSettings;
    globalDeadZone: number;
}>;

export class InputDeviceHandler {
    private currentKeyboardInputs: Writeable<KeyboardDevice['currentInputs']> = {};
    private currentMouseInputs: Writeable<MouseDevice['currentInputs']> = {};
    private gamepadDeadZoneSettings: AllGamepadDeadZoneSettings = {};

    /**
     * Make sure this is set after the other member variables.
     *
     * This is not-null asserted because updateInputDevices, which sets it, is called in the
     * constructor.
     */
    private lastReadInputDevices!: AllDevices;
    private loopIsRunning = false;
    private globalDeadZone = 0;
    // prevents multiple polling loops from running
    private currentLoopIndex = -1;
    private lastEventDetails: Partial<
        Record<
            DeviceHandlerEventTypeEnum,
            {
                constructor: AnyDeviceHandlerEventConstructor;
                constructorInputs: Parameters<
                    AnyDeviceHandlerEventConstructor['constructIfDataIsNew']
                >;
            }
        >
    > = {};

    constructor(options: InputDeviceHandlerOptions = {}) {
        if (options.gamepadDeadZoneSettings) {
            this.updateGamepadDeadZoneSettings(options.gamepadDeadZoneSettings);
        }
        if (options.globalDeadZone) {
            this.globalDeadZone = options.globalDeadZone;
        }
        this.attachWindowListeners(options);
        this.readAllDevices();

        if (options.startLoopImmediately) {
            this.startPollingLoop();
        }
    }

    private listeners = typedObjectFromEntries(
        getEnumTypedValues(DeviceHandlerEventTypeEnum).map((eventType) => [
            eventType,
            new Set<AnyDeviceHandlerListener>(),
        ]),
    );

    private dispatchEvent(event: AnyDeviceHandlerEvent) {
        this.listeners[event.type].forEach((listener) => listener(event));
    }

    /** Returns a callback that removes the listener. */
    public listen<EventType extends DeviceHandlerEventTypeEnum>(
        eventType: EventType,
        listener: DeviceHandlerListener<EventType>,
    ): () => void {
        this.listeners[eventType].add(listener as AnyFunction);
        return () => {
            this.listeners[eventType].delete(listener as AnyFunction);
        };
    }

    private attachWindowListeners(
        options: Pick<InputDeviceHandlerOptions, 'disableMouseMovement'>,
    ) {
        window.addEventListener('keydown', (event) => {
            const eventKey = createButtonName(event.key);
            // ignore keydown repeated events
            if (this.currentKeyboardInputs.hasOwnProperty(eventKey)) {
                return;
            }

            const newKeyboardInput: KeyboardInputValue = {
                deviceType: InputDeviceTypeEnum.Keyboard,
                details: {
                    keyboardEvent: event,
                },
                deviceKey: inputDeviceKey.keyboard,
                deviceName: keyboardBaseDevice.deviceName,
                inputName: eventKey,
                inputValue: 1,
            };

            this.currentKeyboardInputs[eventKey] = newKeyboardInput;
        });
        window.addEventListener('keyup', (event) => {
            delete this.currentKeyboardInputs[createButtonName(event.key)];
        });

        window.addEventListener('mousedown', (event) => {
            const eventButton = createButtonName(event.button);
            if (this.currentMouseInputs.hasOwnProperty(eventButton)) {
                return;
            }

            this.currentMouseInputs[eventButton] = {
                deviceType: InputDeviceTypeEnum.Mouse,
                details: {
                    mouseEvent: event,
                },
                deviceName: mouseBaseDevice.deviceName,
                deviceKey: inputDeviceKey.mouse,
                inputName: eventButton,
                inputValue: 1,
            };
        });
        window.addEventListener('mouseup', (event) => {
            delete this.currentMouseInputs[createButtonName(event.button)];
        });
        if (!options.disableMouseMovement) {
            window.addEventListener('mousemove', (event) => {
                const xAxeName = createAxeName('x');
                const yAxeName = createAxeName('y');

                this.currentMouseInputs[xAxeName] = {
                    deviceType: InputDeviceTypeEnum.Mouse,
                    details: {
                        mouseEvent: event,
                    },
                    deviceName: mouseBaseDevice.deviceName,
                    deviceKey: inputDeviceKey.mouse,
                    inputName: xAxeName,
                    inputValue: event.clientX,
                };
                this.currentMouseInputs[yAxeName] = {
                    deviceType: InputDeviceTypeEnum.Mouse,
                    details: {
                        mouseEvent: event,
                    },
                    deviceName: mouseBaseDevice.deviceName,
                    deviceKey: inputDeviceKey.mouse,
                    inputName: yAxeName,
                    inputValue: event.clientY,
                };
            });
        }
    }

    private runPollingLoop(loopIndex: number, timestamp: number) {
        if (this.loopIsRunning && this.currentLoopIndex === loopIndex) {
            this.readAllDevices(this.gamepadDeadZoneSettings, timestamp);
            requestAnimationFrame((timestamp) => {
                this.runPollingLoop(loopIndex, timestamp);
            });
        }
    }

    private fireEvents(timestamp: number, lastValues: AllDevices, newValues: AllDevices) {
        allEvents.forEach((currentEventConstructor) => {
            const maybeEventInstance = currentEventConstructor.constructIfDataIsNew(
                timestamp,
                lastValues,
                newValues,
            );
            if (maybeEventInstance) {
                this.lastEventDetails[maybeEventInstance.type] = {
                    constructor: currentEventConstructor,
                    constructorInputs: [
                        timestamp,
                        lastValues,
                        newValues,
                    ],
                };
                this.dispatchEvent(maybeEventInstance);
            }
        });
    }

    /**
     * Reads all inputs devices and their current inputs according to the given deadZone settings
     * and returns current input values.
     *
     * Does not update any internal state or fire any event listeners that have been attached to the
     * input handler. Thus, this is not public.
     */
    private getCurrentDeviceValues(
        deadZoneSettings: AllGamepadDeadZoneSettings,
        globalDeadZone: number,
    ): AllDevices {
        const gamepadMap = readCurrentGamepads({
            deadZoneSettings,
            globalDeadZone,
        });
        const gamepadInputDevices: GamepadInputDevices = gamepadMapToInputDevices(gamepadMap);

        const allDevices: AllDevices = {
            [inputDeviceKey.keyboard]: {
                ...keyboardBaseDevice,
                currentInputs: {
                    ...this.currentKeyboardInputs,
                },
            },
            [inputDeviceKey.mouse]: {
                ...mouseBaseDevice,
                currentInputs: {
                    ...this.currentMouseInputs,
                },
            },
            ...gamepadInputDevices,
        };

        return allDevices;
    }

    public startPollingLoop() {
        if (this.loopIsRunning) {
            return;
        }
        this.loopIsRunning = true;
        this.currentLoopIndex++;

        requestAnimationFrame((timestamp) => {
            this.runPollingLoop(this.currentLoopIndex, timestamp);
        });
    }

    public pausePollingLoop() {
        if (!this.loopIsRunning) {
            return;
        }
        this.loopIsRunning = false;
    }

    /**
     * This does not trigger a new poll of devices. Thus, the value retrieved here might be out of
     * date. For example, if you previously paused polling, the returned value here would be from
     * right before polling was paused.
     */
    public getLastPollResults(): AllDevices {
        return this.lastReadInputDevices;
    }

    /**
     * Updates the internal state of all current devices and triggers all relevant listeners.
     *
     * Use this if method if you're hooking up polling to your own system. For example, if you
     * already have a render loop, call this method to update all inputs and read their values.
     *
     * If you just want to read the last values but already have InputDeviceHandler running its
     * loop, instead call getLastPollResults.
     */
    public readAllDevices(
        deadZoneSettings = this.gamepadDeadZoneSettings,
        timestamp = performance.now(),
        /** DeadZone for all inputs. */
        globalDeadZone = this.globalDeadZone,
    ): AllDevices {
        const newValues = this.getCurrentDeviceValues(deadZoneSettings, globalDeadZone);
        const oldValues = this.lastReadInputDevices;
        this.lastReadInputDevices = newValues;
        this.fireEvents(timestamp, oldValues, newValues);

        return newValues;
    }

    public updateGamepadDeadZoneSettings(newValue: AllGamepadDeadZoneSettings) {
        this.gamepadDeadZoneSettings = newValue;
    }
}
