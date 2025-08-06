import { fromJS } from "immutable";
const defaultState = fromJS({
  // 默认中
  language_data: {
    has_record: "0",
  },
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_RECORD":
      return state.merge({
        has_record: action.has_record,
      });
    default:
      return state;
  }
};
