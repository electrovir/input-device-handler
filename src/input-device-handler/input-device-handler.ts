import {Writeable} from '@augment-vir/common';
import {TypedEventTarget} from 'typed-event-target';
import {
    AllDevices,
    GamepadInputDevices,
    gamepadMapToInputDevices,
} from '../device/all-input-devices';
import {GamepadDeadZoneSettings} from '../device/gamepad/dead-zone-settings';
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
import {AllEventTypes, allEvents} from './event-util/all-events';

export type InputDeviceHandlerOptions = Partial<{
    /**
     * Set to true to prevent the loop from starting which will continuously read inputs. If this is
     * set to true, you can trigger your own reads by calling .readInputDevices().
     */
    skipLoopStart: boolean;
    /**
     * By default listening to mouse movement is turned off because it would result in many changes
     * detected all the time. Set this to true to listen to mouse inputs as well.
     */
    listenToMouseMovement: boolean;
    gamepadDeadZoneSettings: GamepadDeadZoneSettings;
}>;

export class InputDeviceHandler extends TypedEventTarget<AllEventTypes> {
    private currentKeyboardInputs: Writeable<KeyboardDevice['currentInputs']> = {};
    private currentMouseInputs: Writeable<MouseDevice['currentInputs']> = {};
    private gamepadDeadZoneSettings: GamepadDeadZoneSettings = {};

    // make sure this is set after the other member variables
    private lastReadInputDevices: AllDevices | undefined;
    private loopIsRunning = false;
    // prevents multiple polling loops from running
    private currentLoopIndex = -1;

    constructor(options: InputDeviceHandlerOptions = {}) {
        super();
        if (!options.skipLoopStart) {
            this.startPollingLoop();
        }
        if (options.gamepadDeadZoneSettings) {
            this.updateGamepadDeadZoneSettings(options.gamepadDeadZoneSettings);
        }
        this.attachWindowListeners(options);
    }

    private attachWindowListeners(options: InputDeviceHandlerOptions) {
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
        if (options.listenToMouseMovement) {
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
            this.updateInputDevices(timestamp);
            requestAnimationFrame((timestamp) => {
                this.runPollingLoop(loopIndex, timestamp);
            });
        }
    }

    private fireEvents(timestamp: number, newValues: AllDevices) {
        allEvents.forEach((currentEventConstructor) => {
            const maybeEventInstance = currentEventConstructor.constructIfDataDataCheckPasses(
                timestamp,
                this.lastReadInputDevices,
                newValues,
            );
            if (maybeEventInstance) {
                this.dispatchEvent(maybeEventInstance);
            }
        });
    }

    private readAllInputDevices(): AllDevices {
        const gamepadMap = readCurrentGamepads(this.gamepadDeadZoneSettings);
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

    public addEventListenerAndFireRightAway(
        ...inputs: Parameters<InputDeviceHandler['addEventListener']>
    ) {
        this.addEventListener(...inputs);
    }

    public startPollingLoop() {
        this.loopIsRunning = true;
        this.currentLoopIndex++;

        requestAnimationFrame((timestamp) => {
            this.runPollingLoop(this.currentLoopIndex, timestamp);
        });
    }

    public pausePollingLoop() {
        this.loopIsRunning = false;
    }

    /**
     * This does not trigger a new poll of devices. Thus, the value retrieved here might be out of
     * date. For example, if you previously paused polling, the returned value here would be from
     * right before polling was paused.
     */
    public getLastPollResults() {
        return this.lastReadInputDevices;
    }

    /**
     * Use this if method if you're hooking up polling to your own system. For example, if you
     * already have a render loop, call this method to update all inputs.
     */
    public updateInputDevices(timestamp = Date.now()): AllDevices {
        const newValues = this.readAllInputDevices();
        this.fireEvents(timestamp, newValues);
        this.lastReadInputDevices = newValues;

        return newValues;
    }

    public updateGamepadDeadZoneSettings(newValue: GamepadDeadZoneSettings) {
        this.gamepadDeadZoneSettings = newValue;
    }
}
