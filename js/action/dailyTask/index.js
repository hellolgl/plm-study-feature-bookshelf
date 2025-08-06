import axios from "../../util/http/axios";
import api from "../../util/http/api";

export const getTaskData = () => {
    return (dispatch, getState) => {
      axios.get(api.getDayTask).then((res) => {
        let {task_data,system_task} = res.data.data
            let get_all_task_gold = true
            task_data.forEach((i,x) => {
                const r_len = i.rules.length
                i.need_right_count_total = i.rules[r_len - 1].right_count
                let is_finish = true
                i.rules.forEach((ii,xx) => {
                    if(xx > 0){
                        ii.width = ((ii.right_count - i.rules[xx - 1].right_count)/i.need_right_count_total) * 100 + '%'
                    }else{
                      ii.width = (ii.right_count/i.need_right_count_total) * 100 + '%'
                    }
                    if(ii.status === -1){
                        // 只要有未完成的，就是任务没有完成
                        is_finish = false
                    }
                    if(ii.status === 0){
                        // 只要有一个是未领取的，就是没领完所有币，首页显示红点
                        get_all_task_gold = false
                    }
                })
                i.is_finish = is_finish
                i.width = (i.right_count/i.need_right_count_total) * 100 + '%'
            })
            if(system_task[0] && system_task[0].rules.length){
                system_task[0].status = system_task[0].rules[0].status
                system_task[0].id = system_task[0].rules[0].id
                if(system_task[0].status === 0) get_all_task_gold = false //系统奖励是未领取的，就是没领完所有币，首页显示红点
            }
            // console.log('task_data:::::',task_data)
            // console.log('system_task:::::',system_task[0]?system_task[0]:{})
            // console.log('首页展示红点标识',get_all_task_gold)
            dispatch(setTaskData(task_data)) 
            dispatch(setSystemTask(system_task[0]?system_task[0]:{}))
            dispatch(setGetAllTaskCoin(get_all_task_gold))
        }).finally(()=>{
            dispatch(setLoading(false))
        })
    }
  }
  
export const setGetAllTaskCoin = (data) => {
    return {
      type: 'dailyTask/setGetAllTaskCoin',
      data
    }
}

export const setTaskData = (data) => {
    return {
      type: 'dailyTask/setTaskData',
      data
    }
}

export const setSystemTask = (data) => {
    return {
      type: 'dailyTask/setSystemTask',
      data
    }
}

export const setLoading = (data) => {
    return {
      type: 'dailyTask/setLoading',
      data
    }
}