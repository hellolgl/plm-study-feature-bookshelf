/* eslint-disable no-unused-vars */
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "antd-mobile-rn";
import store from "../../store";
import NavigationService from "../../navigator/NavigationService";
import { Platform } from "react-native";

const urlAliasMap = {
    "/chinese_blue/grade_term_lesson": "chinese_toChooseText",
    "/student_blue/intelligence_sen_knowledge": "chinese_toChooseTextSentence",
    "/chinese_blue/available_read_category": "chinese_toReading",
    "/student_blue/unit_info": "chinese_toWisdomTree",
    "/chinese_blue/ab_stu_sen_statistics": "chinese_toSpeSentenceStatics",
    "/chinese_blue/read_category_statistics":
        "chinese_toChineseDailySpeReadingStatics",
    "/chinese_blue/composition_category": "chinese_toChineseDailyWrite",
    "/student_blue/query_textbook_lessons": "chinese_toChineseSchoolHome",

    // "/student_blue/get_element_unit": "math_knowledgeGraph",
    "/student_blue/sync_study_unit": "math_mathTongbuHomePage",
    "/student_blue/basic_statistical_data": "math_learningEfficiency",
    "/student_blue/get_expand_type": "math_cleverCalculation",
    "/student_blue/get_exercise_type": "math_expandApplication",
    "/student_blue/get_thinking_type": "math_thinkingTraining",
    // 数学 图
    // "/student_blue/get_graph_number_type": "",

    // my study
    "/student_blue/query_en_textbook_lesson": "english_toSelectUnitEn1",
    // mix match
    "/english_blue/query_course": "english_toSelectUnitEn0",
    // 字母的同步练习
    "/student_blue/query_en_exercise_or_knowledge": "english_toEnglishAbcsTree",
    // 字母连线题
    "/student_blue/line_exercise": "english_toEnglishAbcsMix",
    // 英语智能句
    "/student_blue/learn_today/statistics": "english_Sentences_LearnToday",
    // 英语智能句
    "/student_blue/learn_friends/statistics":
        "english_Sentences_LearnWithFriends",
    // 数学同步
    "/student_blue/get_lesson_code": "math_mathTongbuHomePage",
    //数学智能学习计划
    "/student_blue/mind_plan/home": "math_aiGiveExercise",
    //知识图谱
    "/student_blue/get_unit_element": "math_knowledgeGraph",
    //语文单元习作
    "/student_blue/unit_comp_proposition_stem": "chinese_toLookUnitArticle",
    //语文习作提升
    "/student_blue/composition_category": "chinese_toChineseDailyWrite",
    //编程
    "/student_blue/program/index": "math_program",
    //abc
    "/student_blue/mystudy/unit_knowledge": "english_toAbcs",
    //英语 test me
    "/student_blue/test_me/info": "english_toSelectUnitEn2",
    "/student_blue/card/get_all_data": "common_story",

    // 模块得派币
    // 数学同步
    "/student_blue/save_study_exercise_answer": "math_mathTongbuHomePage",
    // AI推题
    "/student_blue/mind_plan/save_sync_element_record": "math_aiGiveExercise",
    "/student_blue/mind_plan/save_unit_improve": "math_aiGiveExercise",
    // 知识图谱
    "/student_blue/save_element_answer": "math_knowledgeGraph",
    // 思维训练
    "/student_blue/get_thinking_save": "math_thinkingTraining",
    // 巧算
    "/student_blue/save_expand_record": "math_cleverCalculation",
    // 编程
    "/student_blue/program/ability/stem/save": "math_program",
    "/student_blue/program/stem/status": "math_program",
    // 数学智能计划
    "/student_blue/mind_plan/save_kms_stem": "math_AIPractice",
    // 单元检测
    "/student_blue/set_testing_save": "math_abilityDiagnosis",
    // ket英语阅读
    "/student_blue/card/save_article_part": "english_ket",
    // 单元检测-能力法
    "/student_blue/ability/save_answer": "math_abilityDiagnosis",
};

//生产环境域名配置
let productInstance = axios.create({
    baseURL: "xxx.xx.xx",
    timeout: 60000,
});
//开发坏境域名配

let developInstance = axios.create({
    // baseURL: "http://192.168.1.47:8000/api",
    // baseURL: "http://192.168.0.3:8000/api", //标哥
    //baseURL: 'http://192.168.0.153:8000/api',
    // baseURL: "http://www.pailaimi.com/api",
    // baseURL: "http://192.168.101.118:8000/api", //绉老师
    // baseURL: "http://192.168.101.104:7000/api", //邹老师5g
    // baseURL: 'http://192.168.0.168:8000/api',
    baseURL: "https://test.pailaimi.com/api",
    // baseURL: 'http://192.168.0.15:8000/api',
    // baseURL: "http://192.168.0.148:8000/api", //绉老师
    // baseURL: "http://192.168.0.163:8000/api", //Henry
    timeout: 60000,
});
const getToken = async (config) => {
    try {
        let urlobj_android = {
            "/parents_blue/student": "1",
            "/parents_blue/check_account": "1",
            "/parents_blue/student_delete": "1",
            "/parents_blue/student_login": "1",
        };
        let urlobj_ios = {
            "http://www.pailaimi.com/api/apple_blue/student": "1",
        };
        let urlobj = urlobj_android;

        if (Platform.OS === "ios") urlobj = urlobj_ios;

        const jsonValue = urlobj[config.url]
            ? await AsyncStorage.getItem(
                Platform.OS === "ios" ? "ios-token" : "teltoken"
            )
            : await AsyncStorage.getItem("token");

        // console.log('config', config.url)
        // console.log("Jsonvalue", jsonValue)
        return jsonValue != null ? jsonValue : null;
    } catch (e) {
        //console.log('getToken', e)
        // error reading value
    }
};

const addExtParams = (config) => {
    // 年级
    let textbook = "";
    const userInfo = store.getState().getIn(["userInfo", "currentUserInfo"]);
    const grade = userInfo.toJS()["isGrade"]
        ? userInfo.toJS()["checkGrade"]
        : "00";
    const term = userInfo.toJS()["isGrade"] ? userInfo.toJS()["checkTeam"] : "00";
    const Service = userInfo.toJS()["isGrade"] ? 1 : 0; //1小学阶段 0幼小衔接
    let alias = "";
    const keys = Object.keys(urlAliasMap);
    const url = config.url;
    for (const key of keys) {
        if (url.startsWith(key)) {
            alias = urlAliasMap[key];
            break;
        }
    }
    // urlAliasMap[config.url]
    if (alias !== "") {
        if (alias.includes("chinese")) {
            textbook = "10";
        } else if (alias.includes("english")) {
            textbook = "20";
        } else {
            // textbook = '11'  //数学暂时写死北师版
            textbook = store.getState().getIn(["bagMath", "textBookCode"]);
        }
    }
    const extParams = {
        grade,
        term,
        textbook,
        Service,
    };
    if (alias !== "") {
        extParams["alias"] = alias;
    }
    config["headers"] = Object.assign(config["headers"], extParams);
    return config;
};

// 开发环境设置post请求头
developInstance.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
// 生产环境设置post请求头
productInstance.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";

// 当前正在请求的数量
let requestCount = 0;

// 请求前拦截
developInstance.interceptors.request.use(
    (config) => {
        return getToken(config).then((token) => {
            config.headers.token = token;
            developInstance.defaults.headers.common["token"] = token;
            productInstance.defaults.headers.common["token"] = token;
            if (!token) {
                // 游客模式写死token
                config.headers.youke = "1";
                const touristToken =
                    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTU1ODcxNDMsIm5hbWUiOiJcdTZlMzhcdTViYTIiLCJjbGFzc19jb2RlIjoxOCwic2V4IjoiMCIsImlkIjo3NTAsImFjY291bnRfaWQiOjkwNSwiZ3JhZGVfY29kZSI6IiIsInRlcm1fY29kZSI6IiIsInJvbGUiOiJzdHVkZW50In0.fa5ibyHQ2TddoWD-t264RtFo-vbhEUZolw8H3-ShwgE";
                config.headers.token = touristToken;
                developInstance.defaults.headers.common["token"] = touristToken;
                productInstance.defaults.headers.common["token"] = touristToken;
            } else {
                config.headers.youke = "";
            }
            // 增加平台信息
            developInstance.defaults.headers.common["platform"] = Platform.OS;
            productInstance.defaults.headers.common["platform"] = Platform.OS;
            // console.log("head-token::::::::", config.headers.token);
            // console.log("headers-youke::::::::", config.headers.youke);
            config = addExtParams(config);
            // console.log("config:::::::::::::", config, config.headers.alias);
            return config;
        });
        // 增加判断商品是否过期信息
    },
    (err) => {
        //console.log("err", err)
        return Promise.reject(err);
    }
);

// 返回后拦截
developInstance.interceptors.response.use(
    (res) => {
        // console.log("axios res", res);
        if (res.config.url === "/auth_blue/login") {
            developInstance.defaults.headers.common["token"] = res.data.data.token;
            productInstance.defaults.headers.common["token"] = res.data.data.token;
        }
        // 拦截商品过期的请求
        if (res.data.err_code === 1010) {
            Toast.info("商品使用已到期，即将跳转到登录页。", 5);
            setTimeout(() => {
                NavigationService.navigate("StudentRoleHomePageAndroid", {});
            }, 5000);
            throw "data is null";
        }
        if (res.data.err_code === 3) {
            Toast.info("登录已过期，请重新登录", 3);
            setTimeout(() => {
                NavigationService.navigate("StudentRoleHomePageAndroid", {});
            }, 3000);
        }
        if (res.err_code == 1 || res.data.err_code == 1) {
            return Promise.reject(res);
        }
        return res;
        // }
    },
    (err) => {
        // if (err.message === 'Network Error') {
        // message.warning(err)
        // }
        // if (err.code === 'ECONNABORTED') {
        //     message.warning('请求超时，请重试')
        // }
        //console.log("err", err)

        return Promise.reject(err);
    }
);

export default developInstance;
