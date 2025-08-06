import * as constants from "../../action/userInfo/type";
//import * as constants from '../../../action/yuwen/desk/types';

import { fromJS } from "immutable";
import { SET_USER_AVATAR } from "../../action/userInfo/type";

// id: '', //学生id
// name: '',//学生姓名
// userName: '',   //  登录用户名
// id_number: '',   // 学生学号
// // subject: '01',
// grade_name: '',   //年级信息
// class_info: '', //班级id
// team: '',     //学期
// unit: '1',
// student_code: '',  //学生id
const defaultState = fromJS({
  currentUserInfo: {},
  lock_primary_school: false, //小学某年级服务是否购买
  lock_young: false, //幼小服务是否购买
  purchaseModule: [], //购买的模块
  selestModule: {}, //当前选择的模块
  selestModuleAuthority: false, //当前选择模块权限
  planIndex: 0, //当前选择计划下标
  token: "",
  safeInsets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: "personal_customized/pandaHead.png",
  coin: 0,
  squareType: "kid",
  showPlanModal: false,
  myPlans: [],
  myTheme: {
    image: "",
  },
  showRewardCoin:false,
  moduleCoin:0,
  rewardCoin:0, //打赏获得
  visibleSignIn:false,
  showSignInCoin:false,
  sigInData:{}
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SET_USER:
      return state.merge({
        currentUserInfo: action.currentUserInfo,
      });
    case constants.GET_USER:
      return state.merge({
        currentUserInfo: action.currentUserInfo,
      });
    case constants.SET_LOCK_PRIMARY_SCHOOL:
      return state.merge({
        lock_primary_school: action.lock_primary_school,
      });
    case constants.SET_LOCK_YOUNG:
      return state.merge({
        lock_young: action.lock_young,
      });
    case constants.SET_PURCHASEMODULE:
      return state.merge({
        purchaseModule: action.data,
      });
    case constants.SET_SELECTMODULE:
      return state.merge({
        selestModule: action.data,
      });
    case constants.SET_SELECTMODULEAUTHORITY:
      return state.merge({
        selestModuleAuthority: action.data,
      });
    case "userInfo/setPlanIndex":
      return state.merge({
        planIndex: action.data,
      });
    case "userInfo/setToken":
      return state.merge({
        token: action.data,
      });
    case "userInfo/setSafeInsets":
      return state.merge({
        safeInsets: action.data,
      });
    case "userInfo/setCoin":
      return state.merge({
        coin: action.data,
      });
    case "userInfo/setSquareType":
      return state.merge({
        squareType: action.data,
      });
    case "userInfo/setshowPlanModal":
      return state.merge({
        showPlanModal: action.data,
      });
    case "userInfo/setavatar":
      return state.merge({
        avatar: action.data,
      });
    case "userInfo/setmyTheme":
      return state.merge({
        myTheme: action.data,
      });
    case "userInfo/setModuleCoin":
      return state.merge({
        moduleCoin: action.data,
      });
    case "userInfo/setShowRewardCoin":
      return state.merge({
        showRewardCoin: action.data,
      });
    case "userInfo/setRewardCoin":
      return state.merge({
        rewardCoin: action.data,
      });
    case "userInfo/setVisibleSignIn":
      return state.merge({
        visibleSignIn: action.data,
      });
    case "userInfo/setShowSignInCoin":
      return state.merge({
        showSignInCoin: action.data,
      });
    case "userInfo/setSigInData":
      return state.merge({
        sigInData: action.data,
      });
    default:
      return state;
  }
};
