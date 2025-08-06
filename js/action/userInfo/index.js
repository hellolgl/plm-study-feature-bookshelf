import * as constants from "./type";
import { fromJS } from "immutable";
import axios from "../../util/http/axios";
import api from "../../util/http/api";

export const setUserInfoNow = (currentUserInfo) => {
    return {
        type: constants.SET_USER,
        currentUserInfo: fromJS(currentUserInfo),
    };
};

export const setLockPrimarySchool = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: constants.SET_LOCK_PRIMARY_SCHOOL,
            lock_primary_school: data,
        });
    };

    // 加异步方法例子
    // return (dispatch, getState) => {
    //     let params = {
    //         grade_code: "03",
    //         term_code: "01"
    //     }
    //     axios.post(api.getHomepageConfig, params).then(res => {
    //         console.log('iiiii',getState().toJS())
    //         dispatch({
    //             type: constants.SET_LOCK_PRIMARY_SCHOOL,
    //             lock_primary_school:true
    //         })
    //     })
    // }
};

export const setLockYoung = (data) => {
    return {
        type: constants.SET_LOCK_YOUNG,
        lock_young: data,
    };
};

export const setPurchaseModule = (data) => {
    return {
        type: constants.SET_PURCHASEMODULE,
        data: fromJS(data),
    };
};

export const setSelectModule = (data) => {
    return {
        type: constants.SET_SELECTMODULE,
        data: fromJS(data),
    };
};

export const setSelestModuleAuthority = (data) => {
    return (dispatch, getState) => {
        if (getState().toJS().userInfo.currentUserInfo.organ_name === '摆点宣传组') {
            dispatch({
                type: constants.SET_SELECTMODULEAUTHORITY,
                data: true,
            });
            return
        }
        axios.get(api.getIsNeedCoin).then((res) => {
            const { tag } = res.data.data; //true非智学室学生   false智学室学生
            if (tag) {
                // 非智学室的学生，检测是否有权限
                const module_alias = getState().toJS().userInfo.selestModule.alias;
                console.log("module_alias:::::::", module_alias);
                axios
                    .get(api.getModuleAuth, { params: { module_alias } })
                    .then((res) => {
                        const { tag } = res.data.data; //true：有权限     false：没有权限
                        console.log("是否有权限：：：：：：", tag, res.data.data);
                        dispatch({
                            type: constants.SET_SELECTMODULEAUTHORITY,
                            data: tag,
                        });

                    })
            } else {
                // 智学室学生  默认全部有权限
                // 游客也没有tag，模块全开，只是不能答题
                dispatch({
                    type: constants.SET_SELECTMODULEAUTHORITY,
                    data: true,
                });
            }
        })
    };
};

export const setPlanIndex = (data) => {
    return {
        type: "userInfo/setPlanIndex",
        data,
    };
};

export const setToken = (data) => {
    return {
        type: "userInfo/setToken",
        data,
    };
};

export const setSafeInsets = (data) => {
    return {
        type: "userInfo/setSafeInsets",
        data: fromJS(data),
    };
};

export const setCoin = (data) => {
    return {
        type: "userInfo/setCoin",
        data,
    };
};

export const setSquareType = (data) => {
    return {
        type: "userInfo/setSquareType",
        data,
    };
};
export const setshowPlanModal = (data) => {
    return {
        type: "userInfo/setshowPlanModal",
        data,
    };
};

export const setavatar = (data) => {
    return {
        type: "userInfo/setavatar",
        data,
    };
};

export const setmyTheme = (data) => {
    return {
        type: "userInfo/setmyTheme",
        data,
    };
};

export const MAP = {
    'chinese_toLookUnitArticle': 'chinese_toChineseDailyWrite',  //单元习作取单元提升key
    'chinese_toStudyCharacter': 'young',  //识字森林key替换成young
}

export const getModuleCoin = () => {
    return (dispatch, getState) => {
        const alias = getState().toJS().userInfo.selestModule.alias
        const module_alias = MAP[alias] ? MAP[alias] : alias
        const params = { alias: module_alias };
        axios.get(api.getModuleTodayCoin, { params }).then(res => {
            const coin = res.data.data.coin ? res.data.data.coin : 0
            console.log('模块得币：：：：：：：：', params, coin)
            dispatch(setModuleCoin(coin))
        })
    }
};

export const getRewardCoin = () => {
    return (dispatch, getState) => {
        const preCoin = getState().toJS().userInfo.moduleCoin
        const alias = getState().toJS().userInfo.selestModule.alias
        const module_alias = MAP[alias] ? MAP[alias] : alias
        const params = { alias: module_alias };
        axios.get(api.getModuleTodayCoin, { params }).then(res => {
            console.log('答题后模块当天获取派币总数:::::::::::', res.data.data, preCoin, module_alias, params)
            const coin = res.data.data.coin ? res.data.data.coin : 0
            if (coin > preCoin) {
                dispatch(setShowRewardCoin(true))
            }
            // dispatch(setShowRewardCoin(false)) //暂时关闭
            dispatch(setModuleCoin(coin))
            dispatch(getAllCoin())  //更新派币
        })
    }
};

export const setModuleCoin = (data) => {
    return {
        type: 'userInfo/setModuleCoin',
        data
    }
}

export const setShowRewardCoin = (data) => {
    return {
        type: 'userInfo/setShowRewardCoin',
        data
    }
}

export const setRewardCoin = (data) => {
    return {
        type: 'userInfo/setRewardCoin',
        data
    }
}

export const getAllCoin = (data) => {
    return (dispatch) => {
        axios.get(api.getMyCoinAndFire).then((res) => {
            const { total_gold, tips_gold_count } = res.data.data;
            console.log(`派币总数：：：：：：：：：：${total_gold}  打赏累计获得：：：：：：：：：：${tips_gold_count}`);
            dispatch({ type: "userInfo/setCoin", data: total_gold });
            dispatch({ type: "userInfo/setRewardCoin", data: tips_gold_count });
        });
    };
};

export const getVisibleSignIn = () => {
    return (dispatch, getState) => {
        const token = getState().toJS().userInfo.token
        if (!token) {
            return
        }
        axios.post(api.everydaySignIn, {}).then((res) => {
            if (res.data.err_code === 200) {
                // 当前没有领过
                dispatch(setVisibleSignIn(true));
                dispatch(setShowSignInCoin(true))
                dispatch(getAllCoin())
            }
            dispatch(setSigInData(res.data.data))
        })
    };
};

export const setVisibleSignIn = (data) => {
    return {
        type: 'userInfo/setVisibleSignIn',
        data
    }
}

export const setShowSignInCoin = (data) => {
    return {
        type: 'userInfo/setShowSignInCoin',
        data
    }
}

export const setSigInData = (data) => {
    return {
        type: 'userInfo/setSigInData',
        data
    }
}


