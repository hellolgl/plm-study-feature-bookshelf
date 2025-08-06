import axios from "../../util/http/axios";
import api from "../../util/http/api";
import {getDeviceName} from 'react-native-device-info'

export const setHasNotch = () => {
    return (dispatch, getState) => {
        getDeviceName().then((deviceName) => {
            const devicesWithNotch = [
                'iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max',
                'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
                'iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
                'iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
                'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
                'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
            ];
            let data = devicesWithNotch.includes(deviceName)?true:false
            dispatch({
                type: 'deviceInfo/setHasNotch',
                data
            })
        });
    };
}