import * as constants from '../../../action/math/bag/types';
import { fromJS } from 'immutable';
import { constant } from 'lodash';


const defaultState = fromJS({
  topaicDataList: [],
  currentTopaicData : {},
  topaicNum:0,
  yinDaoArr:[],
  textBookCode:'11',   //初使默认北师版
  alphabetValue:{},
  variableValue:{},
  needTree:{},
});

export default (state = defaultState, action) => {

	switch(action.type) {
		case constants.GET_TOPAIC:
			return state.merge({
				topaicDataList: action.topaci,
				currentTopaicData:action.currentTopaicData,
				topaicNum:action.topaicNum,
				yinDaoArr:action.yinDaoArr,
				alphabetValue:action.alphabetValue,
				variableValue:action.variableValue,
				needTree:action.needTree
			});
		case constants.CHANGE_CURRENT_TOPAIC:
			return state.merge({
				currentTopaicData:action.currentTopaicData,
				topaicNum: action.topaicNum,
				yinDaoArr:action.yinDaoArr
			})
		case constants.CHANGE_TOPAIC_LIST_COLOR_FLAG:
			return state.merge({
				topaicDataList: action.topaci,
			})
		case constants.CHANGE_TOPAIC_LIST_INDEX:
			return state.merge({
				topaicNum: action.topaicNum,
			})
		case constants.INIT_REDUX:
			return state.merge({
				topaicDataList: action.topaci,
				currentTopaicData:action.currentTopaicData,
				topaicNum:action.topaicNum
			})
		case constants.SET_MATH_TEXT_BOOK:
			console.log('SET_MATH_TEXT_BOOK',action.textBookCode)
			return state.merge({
					textBookCode:action.textBookCode
			})
		case constants.CHANGE_ALPHABET_VALUE:
			return state.merge({
				alphabetValue:action.alphabetValue,
				variableValue:action.variableValue,
				needTree:action.needTree
			})
		case constants.CHANGE_YINDAO_CURRENT_TOPAIC:
			return state.merge({
					currentTopaicData:action.currentTopaicData,

			})	
		default:
			return state;
	}
}