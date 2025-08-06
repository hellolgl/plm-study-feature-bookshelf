import _ from "lodash";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import ImmediatelyPlay from "../../util/audio/playAudio";
import url from "../../util/url";
export const getStars = (module) => {
    return (dispatch,getState) => {
        axios.get(api.getChildrenStar).then((res) => {
            const data = res.data.data
            let preTotal = getState().toJS().children.totalStar
            let total = 0
            for(let i in data){
                total += data[i]
            }
            dispatch({
                type: "children/setStarData",
                data
            });
            if(!module){
                // 刷新幼小首页数据
                dispatch({
                    type: "children/setTotalStar",
                    data: total
                });
                dispatch({
                    type: "children/setInModule",
                    data: false
                });
            }else{
                dispatch({
                    type: "children/setInModule",
                    data: true
                });
                if(module === 'init') {
                    //之前得过星，进幼小首页,没有 preTotal = total 会进入就弹获得星星动画
                    preTotal = total
                    dispatch({
                        type: "children/setTotalStar",
                        data: total
                    });
                    dispatch({
                        type: "children/setInModule",
                        data: false
                    });
                }
            }
            if(total > preTotal){
                if(!module){
                    ImmediatelyPlay.playSuccessSound(url.successAudiopath2)
                }else{
                    ImmediatelyPlay.playFailGold()
                }
                dispatch({
                    type: "children/setVisibleCongrats",
                    data: true
                });
            }
        })
    };
};

export const setVisibleCongrats = (data) => {
  return {
    type: "children/setVisibleCongrats",
    data,
  };
};

export const setStarData = (data) => {
  return {
    type: "children/setStarData",
    data,
  };
};

export const setInModule = (data) => {
  return {
    type: "children/setInModule",
    data,
  };
};

export const setTotalStar = (data) => {
  return {
    type: "children/setTotalStar",
    data,
  };
};
