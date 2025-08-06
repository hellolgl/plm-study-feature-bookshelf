import * as constants from './types';
import { fromJS } from 'immutable';
import axios from '../../../util/http/axios';
import api from '../../../util/http/api'

export const changePage = (topaic, currentTopaicData, topaicNum, topaicIndex) => ({
  type: constants.GET_TOPAIC,
  topaci: fromJS(topaic),
  currentTopaicData: fromJS(currentTopaicData),
  topaicNum: topaicNum,
  topaicIndex: topaicIndex
});

export const getTopaic = (data) => {
  return (dispatch) => {
    axios.post(api.chineseHomeWork, data).then(
      res => {
        let list = res.data.data
        let index = 0
        // for (let i in list) {
        //   if (list[i].exercise_done === '1') {  
        //     index = i
        //     break
        //   }
        // }
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
        //console.log('getTopaic',list)
        dispatch(changePage(list, list[index], list.length, index));
      }
    ).catch((e) => {
      //console.log(e)
    })
  }
};

export const changeCurrentTopaic = (currentTopaicData) => {
  //console.log(currentTopaicData,'changeCurrentTopaic')
  return (
    {
      type: constants.CHANGE_CURRENT_TOPAIC,
      currentTopaicData: fromJS(currentTopaicData)
    })
}

export const changeTopaicIndex = (topaicIndex) => {
  //console.log(topaicIndex,'changeTopaicIndex')
  return (
    {
      type: constants.CHANGE_TOPAIC_INDEX,
      topaicIndex: topaicIndex
    })
}

export const initRedux = () => {
  return {
    type: constants.INIT_REDUX,
    topaci: fromJS([]),
    currentTopaicData: fromJS({}),
    topaicNum: 0
  }
}

export const changeTopaiclistColorFlag = (topaiclist) => {
  //console.log(topaiclist,'changeTopaiclistColorFlag')
  return {
    type: constants.CHANGE_TOPAIC_LIST_COLOR_FLAG,
    topaci: fromJS(topaiclist),
  }
}
