import _ from 'lodash'
import { fromJS } from 'immutable';

const defaultState = fromJS({
    visible: false,
    serviceType: "month",
    modules: [],
    mustSelectModules: [],
    payCoinVisible:false
});

const sortModule = (moduleList) => {
    moduleList.sort((a, b) => {
        const checkA = a.module.some(item => item.check === 1)
        const checkB = b.module.some(item => item.check === 1)
        return checkB - checkA
    });
    return moduleList
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_PURCHASE_VISIBLE':
            return state.merge({
                visible: action.data,
                serviceType: "month",        // 打开关闭Modal时，将服务类型重置为年
            });
        case 'SET_PRODUCTS':
            return state.merge({
                modules:action.data,
            });
        case 'SET_SERVICE_TYPE':
            return state.merge({
                serviceType: action.data,
            });
        case 'SET_PAYCOIN_VISIBLE':
            return state.merge({
                payCoinVisible: action.data,
            });
        default:
            return state;
    }
}
