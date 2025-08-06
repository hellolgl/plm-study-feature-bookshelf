import { fromJS } from "immutable";

const defaultState = fromJS({
    toKnowledge: false
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case "bagSyncDiagnosis/setToKnowledge":
            return state.merge({
                toKnowledge: action.data,
            });
        default:
            return state;
    }
};
