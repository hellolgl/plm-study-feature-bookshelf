import * as constants from '../../../action/yuwen/desk/types';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  fromServeCharacterList: [], //作业题目列表
  currentTopaicData : {}, //当前作业题目
  topaicNum:0,
  topaicIndex:0
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
    case constants.CHANGE_TOPAIC_LIST_COLOR_FLAG:
      return state.merge({
        fromServeCharacterList: action.topaci,
      })
		case constants.CHANGE_TOPAIC_INDEX:
			console.log('CHANGE_TOPAIC_INDEX',action.topaicIndex)
			return state.merge({
				topaicIndex:action.topaicIndex
			})
		case constants.INIT_REDUX:
			return state.merge({
				fromServeCharacterList: action.topaci,
				currentTopaicData:action.currentTopaicData,
				topaicNum:action.topaicNum
			})
		default:
			return state;
	}
}