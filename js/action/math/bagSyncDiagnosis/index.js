import { fromJS } from 'immutable';

export const setToKnowledge = (data) => {
    return (
        {
            type: 'bagSyncDiagnosis/setToKnowledge',
            data
        })
}

