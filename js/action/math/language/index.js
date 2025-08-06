import { fromJS } from 'immutable';

export const setLanguageData = (data) => {
    return (
        {
            type: 'SET_MATH_LANGUAGE',
            language_data: fromJS(data)
        })
}
