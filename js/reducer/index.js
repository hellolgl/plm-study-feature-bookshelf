import { combineReducers } from "redux-immutable";
import deskMath from "./math/desk";
import deskYuwen from "./yuwen/desk";
import deskEnglish from "./english/desk";
import userInfo from "./userInfo";
import bagEnglish from "./english/bag";
import bagMath from "./math/bag";
import languageMath from "./math/language";
import languageChinese from "./yuwen/language";
import bagMathProgram from "./math/bagProgram";
import purchase from "./purchase";
import aiTalk from "./aiTalk";
import bagSyncDiagnosis from "./bagSyncDiagnosis";
import audioStatus from "./audio";
import children from "./children";
import Compositon from "./yuwen/composition";
import square from "./square";
import deviceInfo from "./deviceInfo";
import knowAiTalk from "./knowAiTalk";
import dailyTask from "./dailyTask";
import tts from './tts'
import yuwenInfo from './yuwen/info'
/**
 * 用于合并reducer
 * 返回对象是immutable对象
 */
const index = combineReducers({
    deskMath: deskMath,
    deskYuwen: deskYuwen,
    deskEnglish: deskEnglish,
    userInfo: userInfo,
    bagEnglish: bagEnglish,
    bagMath: bagMath,
    languageMath: languageMath,
    languageChinese: languageChinese,
    bagMathProgram: bagMathProgram,
    purchase,
    aiTalk,
    bagSyncDiagnosis,
    audioStatus,
    children,
    Compositon,
    square,
    deviceInfo,
    knowAiTalk,
    dailyTask,
    tts,
    yuwenInfo
});

export default index;
