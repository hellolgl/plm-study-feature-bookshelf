import { fromJS } from "immutable";

const defaultState = fromJS({
    textbook: 10
});

export default (state = defaultState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
