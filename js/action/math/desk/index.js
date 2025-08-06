import * as constants from './types';
import { fromJS } from 'immutable';
import axios from '../../../util/http/axios';
import api from '../../../util/http/api'

export const changePage = (topaic, currentTopaicData, topaicNum) => ({
  type: constants.GET_TOPAIC,
  topaci: fromJS(topaic),
  currentTopaicData: fromJS(currentTopaicData),
  topaicNum
});

export const getTopaic = (params) => {
  return (dispatch) => {
    //console.log('redux getTopaic ',params)
    axios.post(api.queryHomeWorkList, params).then(
      res => {
        let list = res.data.data
        let index = 0
        for (let i = 0; i < list.length; i++) {
          if (list[i].exercise_done == 0) {
            index++
            if (list[i].correction == 0) {
              list[i].colorFlag = 1
            } else {
              list[i].colorFlag = 2
            }
          }
        }
        dispatch(changePage(list, list[index], index));
      }
    ).catch((e) => {
      //console.log(e)
    })
  }
};

export const changeCurrentTopaic = (currentTopaicData, topaicIndex) => {
  //console.log(currentTopaicData,'changeCurrentTopaic')
  return (
    {
      type: constants.CHANGE_CURRENT_TOPAIC,
      currentTopaicData: fromJS(currentTopaicData),
      topaicNum: topaicIndex,
    })
}

export const changeTopaiclistColorFlag = (topaiclist) => {
  //console.log(topaiclist,'changeTopaiclistColorFlag')
  return {
    type: constants.CHANGE_TOPAIC_LIST_COLOR_FLAG,
    topaci: fromJS(topaiclist),
  }
}

export const changeTopaicIndex = (topaicIndex) => {
  //console.log('changeTopaicIndex',topaicIndex)
  return {
    type: constants.CHANGE_TOPAIC_LIST_INDEX,
    topaicNum: topaicIndex,
  }

}

export const initRedux = () => {
  return {
    type: constants.INIT_REDUX,
    topaci: fromJS([]),
    currentTopaicData: fromJS({}),
    topaicNum: 0
  }
}
