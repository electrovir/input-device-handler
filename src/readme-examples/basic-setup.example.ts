import {InputDeviceEventTypeEnum, InputDeviceHandler} from '..';

const deviceHandler = new InputDeviceHandler();

// listen to new devices connecting (such as gamepads)
deviceHandler.addEventListener(InputDeviceEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices added:', event.detail.inputs);
});

// listen to a change in inputs
deviceHandler.addEventListener(InputDeviceEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('inputs changed:', event.detail.inputs);
});
