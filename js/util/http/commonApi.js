import http from './httpUtils';
import api from './api'
// promise的封装操作
function to(promise){
    return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}

const httpApi={	
	// login请求
	async login(params) {
		const url = '/userManage/login';
		const [err, res] = await to(http.get(url, params));
		if (err) {
            //请求失败
			return Object.assign(err, {
				status: "406",
				description: err.errMsg
			}, true);
		}
        //请求成功
		return res;
	},
    //logout 请求
    async logout(params) {
		const url = '/userManage/logout';
		const [err, res] = await to(http.get(url, params));
		if (err) {
			return Object.assign(err, {
				status: "406",
				description: err.errMsg
			}, true);
		}
		return res;
	},
    //语文手写题目获取
    async yuwenWriteTopaci(params){
      const url = api.yuwenTopic;
      const [err,res] = await to(http.get(url,params));
      if (err) {
        return Object.assign(err, {
          status: "406",
          description: err.errMsg
        }, true);
      }
      return res;
    }
}
export default httpApi;
