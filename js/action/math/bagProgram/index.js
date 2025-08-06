import { fromJS } from 'immutable';

export const setTopicData = (data) => {
    return (
        {
            type: 'SET_MATH_BAG_PROGRAM_TOPIC_DATA',
            topic_data: fromJS(data)
        })
}

export const setSource = (data) => {
    return (
        {
            type: 'SET_MATH_BAG_PROGRAM_SOURCE',
            source: data
        })
}
