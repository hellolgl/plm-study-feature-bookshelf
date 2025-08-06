import { fromJS } from "immutable";

const defaultState = fromJS({
    getAllTaskCoin:false,
    task_data:[],
    system_task:{},
    loading:false
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case "dailyTask/setGetAllTaskCoin":
            return state.merge({
                getAllTaskCoin:action.data,
            });
        case "dailyTask/setTaskData":
            return state.merge({
                task_data:action.data,
            });
        case "dailyTask/setSystemTask":
            return state.merge({
                system_task:action.data,
            });
        case "dailyTask/setLoading":
            return state.merge({
                loading:action.data,
            });
        default:
        return state;
    }
};
