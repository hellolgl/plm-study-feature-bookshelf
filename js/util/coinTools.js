import store from "../store";
import axios from "../util/http/axios";
import api from "../util/http/api";
import { setModuleCoin, setShowRewardCoin, MAP, getAllCoin } from '../action/userInfo'

export const getRewardCoinLastTopic = () => {
    return new Promise((r, j) => {
        const _store = store.getState();
        const selestModule = _store.getIn(["userInfo", "selestModule"]).toJS();
        const { alias } = selestModule;
        const module_alias = MAP[alias] ? MAP[alias] : alias
        const preCoin = _store.getIn(["userInfo", "moduleCoin"])
        axios.get(api.getModuleTodayCoin, { params: { alias: module_alias } }).then(res => {
            console.log('答题后模块当天获取派币总数:::::::::::', res.data.data, preCoin, module_alias)
            const coin = res.data.data.coin ? res.data.data.coin : 0
            if (coin > preCoin) {
                store.dispatch(setShowRewardCoin(true))
            }
            // store.dispatch(setShowRewardCoin(false)) //暂时关闭
            store.dispatch(setModuleCoin(coin))
            store.dispatch(getAllCoin()) //更新派币
            r({ coin, isReward: coin > preCoin })
            // r({coin,isReward:false}) //暂时关闭
        })
    })
}