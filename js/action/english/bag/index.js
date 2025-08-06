import * as constants from './types';
import { fromJS } from 'immutable';
import axios from '../../../util/http/axios';
import api from '../../../util/http/api'

export const changePage = (topaic, currentTopaicData, topaicNum, topaicIndex) => ({
  type: constants.GET_TOPAIC,
  topaci: fromJS(topaic),
  currentTopaicData: fromJS(currentTopaicData),
  topaicNum: topaicNum,
  topaicIndex: topaicIndex,
});


export const getTopaic = (data) => {
  return (dispatch) => {
    axios.post(api.SynchronizeDiagnosisEn, data).then(
      res => {
        let list = res.data.data
        let index = 0
        for (let i in list) {
          list[i].colorFlag = 0 //控制答题卡答题状态显示
          if (list[i].exercise_done === '1') {
            index = i
            break
          }
        }
        //console.log('getEngBagTopaic',list)
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

export const setEngTextBook = (textBookCode) => {
  //console.log(textBookCode,'setEngTextBook')
  return (
    {
      type: constants.SET_ENG_TEXT_BOOK,
      // textBookCode: textBookCode
      textBookCode: '20'   //写死人教版
    })
}
