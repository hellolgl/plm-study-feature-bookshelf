import { fromJS } from "immutable";

export const setRecord = (data) => {
  return {
    type: "SET_RECORD",
    has_record: fromJS(data),
  };
};
