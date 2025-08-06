import { fromJS } from 'immutable';

const defaultState = fromJS({
    topic_data: {},
    source:'1'
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_MATH_BAG_PROGRAM_TOPIC_DATA':
            return state.merge({
                topic_data: action.topic_data
            });
        case 'SET_MATH_BAG_PROGRAM_SOURCE':
            return state.merge({
                source: action.source
            });
        default:
            return state;
    }
}