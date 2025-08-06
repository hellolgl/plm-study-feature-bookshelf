import * as constants from '../../../action/english/bag/types';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  fromServeCharacterList: [], //作业题目列表
  currentTopaicData : {}, //当前作业题目
  topaicNum:0,
	topaicIndex:0,
	textBookCode:'20' //写死人教版
});

export default (state = defaultState, action) => {

	switch(action.type) {
		case constants.GET_TOPAIC:
			return state.merge({
        fromServeCharacterList: action.topaci,
        currentTopaicData:action.currentTopaicData,
        topaicNum:action.topaicNum,
        topaicIndex:action.topaicIndex
			});
		case constants.CHANGE_CURRENT_TOPAIC:
			return state.merge({
				currentTopaicData:action.currentTopaicData
			})
		case constants.CHANGE_TOPAIC_INDEX:
			console.log('CHANGE_TOPAIC_INDEX',action.topaicIndex)
			return state.merge({
				topaicIndex:action.topaicIndex
			})
		case constants.SET_ENG_TEXT_BOOK:
				console.log('SET_ENG_TEXT_BOOK',action.textBookCode)
				return state.merge({
					textBookCode:action.textBookCode
				})
		default:
			return state;
	}
}