import {DeviceHandlerEventTypeEnum, InputDeviceHandler} from '..';

const deviceHandler = new InputDeviceHandler({startLoopImmediately: true});

// listen to new devices connecting (such as gamepads)
deviceHandler.listen(DeviceHandlerEventTypeEnum.NewDevicesAdded, (event) => {
    console.info('new devices added:', event.detail.inputs);
});

// listen to a change in inputs
deviceHandler.listen(DeviceHandlerEventTypeEnum.CurrentInputsChanged, (event) => {
    console.info('inputs changed:', event.detail.inputs);
});
