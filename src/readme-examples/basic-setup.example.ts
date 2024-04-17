import {CurrentInputsChangedEvent, InputDeviceHandler, NewDevicesAddedEvent} from '..';

const deviceHandler = new InputDeviceHandler({startLoopImmediately: true});

// listen to new devices connecting (such as gamepads)
deviceHandler.listen(NewDevicesAddedEvent, (event) => {
    console.info('new devices added:', event.detail.inputs);
});

// listen to a change in inputs
deviceHandler.listen(CurrentInputsChangedEvent, (event) => {
    console.info('inputs changed:', event.detail.inputs);
});
