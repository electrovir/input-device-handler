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
    bypassLoopStart: boolean;
    gamepadDeadZoneSettings: GamepadDeadZoneSettings;
}>;

export class InputDeviceHandler extends TypedEventTarget<AllEventTypes> {
    private lastReadInputDevices: AllInputDevices = this.readAllInputDevices();
    private currentKeyboardInputs: KeyboardInputDevice['currentInputs'] = {};
    private currentMouseInputs: MouseInputDevice['currentInputs'] = {};
    private gamepadDeadZoneSettings: GamepadDeadZoneSettings = {};

    constructor(options: InputDeviceHandlerOptions) {
        super();
        if (!options.bypassLoopStart) {
            this.startPollingLoop();
        }
        this.attachWindowListeners();
    }

    private attachWindowListeners() {
        window.addEventListener('keydown', (event) => {
            this.currentKeyboardInputs[event.key] = {
                deviceType: InputDeviceType.Keyboard,
                details: {
                    keyboardEvent: event,
                },
                deviceName: keyboardDeviceIdSymbol,
                deviceIndex: -1,
                inputName: event.key,
                value: 1,
            };
        });
        window.addEventListener('keyup', (event) => {
            delete this.currentKeyboardInputs[event.key];
        });
        window.addEventListener('mousedown', (event) => {
            this.currentMouseInputs[event.button] = {
                deviceType: InputDeviceType.Mouse,
                details: {
                    mouseEvent: event,
                },
                deviceName: mouseDeviceIdSymbol,
                deviceIndex: -1,
                inputName: event.button,
                value: 1,
            };
        });
        window.addEventListener('mouseup', (event) => {
            delete this.currentMouseInputs[event.button];
        });
    }

    private startPollingLoop() {
        requestAnimationFrame((timestamp) => {
            this.runPollingLoop(timestamp);
        });
    }

    private runPollingLoop(timestamp: number) {
        this.readInputDevices(timestamp);
        requestAnimationFrame((timestamp) => {
            this.runPollingLoop(timestamp);
        });
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

        return {
            [keyboardDeviceIdSymbol]: {
                ...keyboardBaseDevice,
                currentInputs: this.currentKeyboardInputs,
            },
            [mouseDeviceIdSymbol]: {
                ...mouseBaseDevice,
                currentInputs: this.currentMouseInputs,
            },
            ...gamepadInputDevices,
        };
    }

    /**
     * Use this if method if you're hooking up polling to your own system. For example, if you
     * already have a render loop, call this method to update all inputs.
     */
    public readInputDevices(timestamp = Date.now()): AllInputDevices {
        const newValues = this.readAllInputDevices();
        this.fireEvents(timestamp, newValues);
        this.lastReadInputDevices = newValues;

        return newValues;
    }

    public updateGamepadDeadZoneSettings(newValue: GamepadDeadZoneSettings) {
        this.gamepadDeadZoneSettings = newValue;
    }
}
