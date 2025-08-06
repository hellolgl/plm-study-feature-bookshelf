import type from 'type-detect';

class EventRegister {
    static _Listeners = {
        callbackDict: {},
        count: 0,
    };

    static addEventListener(eventName, callback, params = {}) {
        if (type(eventName) === 'string' && type(callback) === 'function') {
            const eventId = `${eventName}_${EventRegister._Listeners.count}`;
            EventRegister._Listeners.count++;
            if (
                Object.keys(EventRegister._Listeners.callbackDict).includes(eventName)
            ) {
                const callbackDict = EventRegister._Listeners.callbackDict[eventName];
                EventRegister._Listeners.callbackDict[eventName] = Object.assign(
                    callbackDict,
                    {
                        [eventId]: callback,
                    },
                );
            } else {
                EventRegister._Listeners.callbackDict[eventName] = {
                    [eventId]: callback,
                };
            }
            return eventId;
        }
    }

    static removeEventListener(eventId) {
        const eventName = eventId.split('_')[0];
        try {
            // console.log('REMOVE: ', eventId);
            const callbackList = EventRegister._Listeners.callbackDict[eventName];
            delete callbackList[eventId];
            console.log(
                'REMOVE: ',
                Object.keys(EventRegister._Listeners.callbackDict[eventName]),
            );
        } catch (e) {
            // console.log('delete event id not exist.');
        }
    }

    static emitEvent(eventName, eventId = '', ignoreThis = false) {
        Object.keys(EventRegister._Listeners.callbackDict).forEach(_en => {
            if (_en === eventName) {
                const callbackDict = EventRegister._Listeners.callbackDict[_en];
                for (const eId in callbackDict) {
                    try {
                        const callback = callbackDict[eId];
                        if (ignoreThis) {
                            if (eId !== eventId) {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    } catch (e) {
                        console.log('callback error: ', e);
                    }
                }
            }
        });
    }
}

export default EventRegister;
