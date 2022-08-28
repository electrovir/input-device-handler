import {InputDeviceHandler, InputDeviceHandlerEventTypeEnum} from '..';

const deviceHandler = new InputDeviceHandler();

// listen to new devices connecting (such as gamepads)
deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices added:', event.detail.data);
});

// listen to a change in inputs
deviceHandler.addEventListener(InputDeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('inputs changed:', event.detail.data);
});
