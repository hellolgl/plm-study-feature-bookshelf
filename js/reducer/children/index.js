import { fromJS } from "immutable";

const defaultState = fromJS({
  totalStar: 0,
  starData:{
    abcs:0,
    character:0,
    knowledge:0,
    pinyin:0
  },
  visibleCongrats:false,
  inModule:false //模块内恭喜
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "children/setTotalStar":
        return state.merge({
        totalStar: action.data,
    });
    case 'children/setVisibleCongrats':
        return state.merge({
        visibleCongrats:action.data
    })
    case 'children/setStarData':
        return state.merge({
          starData:action.data
    })
    case 'children/setInModule':
        return state.merge({
          inModule:action.data
    })
    default:
      return state;
  }
};
