import { fromJS } from "immutable";

const defaultState = fromJS({
    statusData:{
        canUse:true,
        msg:''
    },
    showTips:false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "tts/setStatusData":
      return state.merge({
        statusData:action.data,
      });
    case "tts/setShowTips":
      return state.merge({
        showTips:action.data,
      });
    default:
      return state;
  }
};
