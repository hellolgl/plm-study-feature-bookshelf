import { fromJS } from "immutable";

const defaultState = fromJS({
  hasNotch:false
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "deviceInfo/setHasNotch":
      return state.merge({
        hasNotch:action.data,
      });
    default:
      return state;
  }
};
