import {Writeable} from 'augment-vir';
import {TypedEventTarget} from 'typed-event-target';
import {AllInputDevices, gamepadMapToInputDevices} from '../device/all-input-devices';
import {keyboardDeviceIdSymbol, mouseDeviceIdSymbol} from '../device/device-id';
import {GamepadDeadZoneSettings} from '../device/gamepad/dead-zone-settings';
import {readCurrentGamepads} from '../device/gamepad/read-gamepads';
import {
    GamepadInputDevice,
    keyboardBaseDevice,
    KeyboardInputDevice,
    mouseBaseDevice,
    MouseInputDevice,
} from '../device/input-device';
import {InputDeviceType} from '../device/input-device-type';
import {allEvents, AllEventTypes} from './event-util/all-events';

export type InputDeviceHandlerOptions = Partial<{
    /**
     * Set to true to prevent the loop from starting which will continuously read inputs. If this is
     * set to true, you can trigger your own reads by calling .readInputDevices().
     */
    skipLoopStart: boolean;
    gamepadDeadZoneSettings: GamepadDeadZoneSettings;
}>;

export class InputDeviceHandler extends TypedEventTarget<AllEventTypes> {
    private currentKeyboardInputs: Writeable<KeyboardInputDevice['currentInputs']> = {};
    private currentMouseInputs: Writeable<MouseInputDevice['currentInputs']> = {};
    private gamepadDeadZoneSettings: GamepadDeadZoneSettings = {};

    // make sure this is set after the other member variables
    private lastReadInputDevices: AllInputDevices | undefined;
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
        this.attachWindowListeners();
    }

    private attachWindowListeners() {
        window.addEventListener('keydown', (event) => {
            const eventKey = event.key;
            // ignore keydown repeated events
            if (this.currentKeyboardInputs.hasOwnProperty(eventKey)) {
                return;
            }

            this.currentKeyboardInputs[eventKey] = {
                deviceType: InputDeviceType.Keyboard,
                details: {
                    keyboardEvent: event,
                },
                deviceName: keyboardDeviceIdSymbol,
                deviceIndex: -1,
                inputName: eventKey,
                value: 1,
            };
        });
        window.addEventListener('keyup', (event) => {
            delete this.currentKeyboardInputs[event.key];
        });
        window.addEventListener('mousedown', (event) => {
            const eventButton = event.button;
            if (this.currentMouseInputs.hasOwnProperty(eventButton)) {
                return;
            }

            this.currentMouseInputs[eventButton] = {
                deviceType: InputDeviceType.Mouse,
                details: {
                    mouseEvent: event,
                },
                deviceName: mouseDeviceIdSymbol,
                deviceIndex: -1,
                inputName: eventButton,
                value: 1,
            };
        });
        window.addEventListener('mouseup', (event) => {
            delete this.currentMouseInputs[event.button];
        });
    }

    private runPollingLoop(loopIndex: number, timestamp: number) {
        if (this.loopIsRunning && this.currentLoopIndex === loopIndex) {
            this.updateInputDevices(timestamp);
            requestAnimationFrame((timestamp) => {
                this.runPollingLoop(loopIndex, timestamp);
            });
        }
    }

    private fireEvents(timestamp: number, newValues: AllInputDevices) {
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

    private readAllInputDevices(): AllInputDevices {
        const gamepadMap = readCurrentGamepads(this.gamepadDeadZoneSettings);
        const gamepadInputDevices: Record<number, GamepadInputDevice> =
            gamepadMapToInputDevices(gamepadMap);

        const allDevices: AllInputDevices = {
            [keyboardDeviceIdSymbol]: {
                ...keyboardBaseDevice,
                currentInputs: {
                    ...this.currentKeyboardInputs,
                },
            },
            [mouseDeviceIdSymbol]: {
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
    public updateInputDevices(timestamp = Date.now()): AllInputDevices {
        const newValues = this.readAllInputDevices();
        this.fireEvents(timestamp, newValues);
        this.lastReadInputDevices = newValues;

        return newValues;
    }

    public updateGamepadDeadZoneSettings(newValue: GamepadDeadZoneSettings) {
        this.gamepadDeadZoneSettings = newValue;
    }
}
