import {InputDeviceHandler} from '..';

const deviceHandler = new InputDeviceHandler();

// start the polling loop, events will get fired now
deviceHandler.startPollingLoop();

// pause the polling loop, events will no longer get fired
deviceHandler.pausePollingLoop();
