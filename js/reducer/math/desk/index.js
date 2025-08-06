import * as constants from '../../../action/math/desk/types';
import { fromJS } from 'immutable';
import { constant } from 'lodash';

const defaultState = fromJS({
  topaicDataList: [],
  currentTopaicData : {},
  topaicNum:0
});

export default (state = defaultState, action) => {

	switch(action.type) {
		case constants.GET_TOPAIC:
			return state.merge({
				topaicDataList: action.topaci,
				currentTopaicData:action.currentTopaicData,
				topaicNum:action.topaicNum
			});
		case constants.CHANGE_CURRENT_TOPAIC:
			return state.merge({
				currentTopaicData:action.currentTopaicData,
				topaicNum: action.topaicNum,
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
		default:
			return state;
	}
}