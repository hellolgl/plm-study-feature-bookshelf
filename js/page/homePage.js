import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    ImageBackground,
    FlatList,
    DeviceEventEmitter,
    AppState,
    ScrollView,
} from "react-native";
import { appFont, appStyle } from "../theme";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../util/tools";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../component/homepage/avatar";
import NavigationUtil from "../navigator/NavigationUtil";
import MathNavigationUtil from "../navigator/NavigationMathUtil";
import {
    getAllCoin,
    setSelectModule,
    setSelestModuleAuthority,
    getModuleCoin,
    setUserInfoNow,
    setSquareType,
    getVisibleSignIn,
} from "../action/userInfo";
import SelectGradeAndBook from "../component/homepage/selectGradeAndBook";
import axios from "../util/http/axios";
import api from "../util/http/api";
import _ from "lodash";
import { setVisible, setPayCoinVisible } from "../action/purchase";
import Msg from "../component/square/msg";
import { getPaiCoin } from "../util/axiosMethod";
import SelectWrongSubject from "../component/homepage/selectWrongSubject";
import AdvertisingPage from './advertisingPage'
import SelectDeskSubject from '../component/homepage/selectDeskSubject'
import url from "../util/url";

// 数学未开放模块路由
// case "派学日记":
//   MathNavigationUtil.toMathStudyDiary(this.props);
//   break;
// case "学习效能":
//   MathNavigationUtil.toMathSpecailImproveSchoolHome(this.props);
//   break;
// case "拓展应用":
//   MathNavigationUtil.toMathExpandApplicationHomePage(this.props);
//   break;
// case "图":
//   MathNavigationUtil.toMathVector(this.props);
//   break
// case "作业":
//   MathNavigationUtil.toMathDeskHomepage(this.props);
//   break;
// case "复习巩固":
//   MathNavigationUtil.toMtahAbilityDiagnosisHomePage(this.props);
//   break;
// case "能力诊断":
//   MathNavigationUtil.toMtahUnitDiagnosisHomePage(this.props);
//   break;

// 英语未开放模块路由
// case "Abilities":
//   NavigationUtil.toEnglishStatisticsHome(this.props);
//   break;
// case 'My Class':
//   NavigationUtil.toEnglishDeskHomepage(this.props);

const left_nav = [
    {
        label: "我的派币",
        icon: require("../images/homepage/icon_13.png"),
    },
    {
        label: "学习路径",
        icon: require("../images/homepage/icon_29.png"),
    },
    {
        label: "错题集",
        icon: require("../images/homepage/icon_11.png"),
    },
    {
        label: "统计",
        icon: require("../images/homepage/icon_12.png"),
    },
    {
        label: "我的作业",
        icon: require("../images/homepage/icon_27.png"),
    },
];

const region_nav = [
    {
        label: "学习区",
        icon: require("../images/homepage/icon_16.png"),
        iconActive: require("../images/homepage/icon_16_active.png"),
    },
    {
        label: "共创区",
        icon: require("../images/homepage/icon_15.png"),
        iconActive: require("../images/homepage/icon_15_active.png"),
    },
];

const typeList = [
    {
        label: "幼小衔接",
        icon: require("../images/homepage/icon_17.png"),
        iconActive: require("../images/homepage/icon_17_active.png"),
    },
    {
        label: "语文",
        icon: require("../images/homepage/icon_18.png"),
        iconActive: require("../images/homepage/icon_18_active.png"),
    },
    {
        label: "数学",
        icon: require("../images/homepage/icon_19.png"),
        iconActive: require("../images/homepage/icon_19_active.png"),
    },
    {
        label: "英语",
        icon: require("../images/homepage/icon_20.png"),
        iconActive: require("../images/homepage/icon_20_active.png"),
    },
    {
        label: "编程",
        icon: require("../images/homepage/icon_21.png"),
        iconActive: require("../images/homepage/icon_21_active.png"),
    },
];

const createTypeList = [
    {
        label: "学生资料书架",
        icon: require("../images/homepage/icon_22.png"),
    },
    {
        label: "家长资料书架",
        icon: require("../images/homepage/icon_23.png"),
    },
];

const youngList = [
    {
        label: "拼音",
        tab: "双语",
        des: "中英双语学拼音，听、说、读、写智能诊断",
        alias: "chinese_toPinyinHome",
        bg: require("../images/homepage/item_bg_4.png"),
    },
    {
        label: "数学图谱",
        tab: "双语",
        des: "知识图谱的经典例题学习",
        alias: "math_knowledgeGraph",
        bg: require("../images/homepage/item_bg_5.png"),
    },
    {
        label: "ABCs",
        des: "从听、说、读、写四个方面掌握英文26个字母",
        alias: "english_toAbcs",
        bg: require("../images/homepage/item_bg_6.png"),
    },
    {
        label: "识字森林",
        tab: "双语",
        des: "通过字、词、句的方式学习生字",
        alias: "chinese_toStudyCharacter",
        bg: require("../images/homepage/item_bg_7.png"),
    },
];

const studentList = [
    {
        title: "知识点故事",
        type: "common_story",
        bg: require("../images/homepage/item_bg_9.png"),
    },
    {
        title: "百科故事",
        type: "common_story_v2",
        bg: require("../images/homepage/item_bg_10.png"),
    },
];

const parentList = [
    [
        {
            title: "高效学习",
            bg: require("../images/homepage/item_bg_12.png"),
            fontSize: pxToDp(48),
        },
        {
            title: "教育与学习",
            bg: require("../images/homepage/item_bg_13.png"),
            fontSize: pxToDp(48),
        },
        {
            title: "心理健康与情感发展",
            bg: require("../images/homepage/item_bg_14.png"),
            fontSize: pxToDp(32),
        },
        {
            title: "身体健康与生活习惯",
            bg: require("../images/homepage/item_bg_15.png"),
            fontSize: pxToDp(32),
        },
    ],
    [
        {
            title: "家庭关系与教育",
            bg: require("../images/homepage/item_bg_16.png"),
            fontSize: pxToDp(42),
        },
        {
            title: "社交与兴趣爱好",
            bg: require("../images/homepage/item_bg_17.png"),
            fontSize: pxToDp(32),
        },
        {
            title: "教育选择与未来规划",
            bg: require("../images/homepage/item_bg_18.png"),
            fontSize: pxToDp(32),
        },
    ],
];

const numMap = {
    0: "I",
    1: "II",
    2: "III",
    3: "IV",
    4: "V",
    5: "VI",
    6: "VII",
    7: "VIII",
    8: "IX",
    9: "X",
};

const typeConfig = {
    0: {
        color: "#FF9B0F",
        bgAndroid: require("../images/homepage/bg_1.png"),
        bgIos: require("../images/homepage/bg_1_ios.png"),
        bgPhone: require("../images/homepage/bg_1_phone.png"),
    },
    1: {
        color: "#FFB508",
        bg: require("../images/homepage/item_yuwen.png"),
        bgAndroid: require("../images/homepage/bg_2.png"),
        bgIos: require("../images/homepage/bg_2_ios.png"),
        bgPhone: require("../images/homepage/bg_2_phone.png"),
    },
    2: {
        color: "#649EFF",
        bg: require("../images/homepage/item_shuxue.png"),
        bgAndroid: require("../images/homepage/bg_3.png"),
        bgIos: require("../images/homepage/bg_3_ios.png"),
        bgPhone: require("../images/homepage/bg_3_phone.png"),
    },
    3: {
        color: "#914DFF",
        bg: require("../images/homepage/item_yingyu.png"),
        bgAndroid: require("../images/homepage/bg_4.png"),
        bgIos: require("../images/homepage/bg_4_ios.png"),
        bgPhone: require("../images/homepage/bg_4_phone.png"),
    },
    4: {
        color: "#01E3C1",
        bg: require("../images/homepage/item_biancheng.png"),
        bgAndroid: require("../images/homepage/bg_5.png"),
        bgIos: require("../images/homepage/bg_5_ios.png"),
        bgPhone: require("../images/homepage/bg_5_phone.png"),
    },
};

function HomePage(props) {
    const dispatch = useDispatch();
    const { token, currentUserInfo, coin, squareType, avatar } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { getAllTaskCoin } = useSelector((state) => state.toJS().dailyTask);
    console.log('currentUserInfo:', currentUserInfo)
    // console.log('getAllTaskCoin:',getAllTaskCoin)
    const { name, grade, term, textbookname, checkGrade, checkTeam, organ_name, username } =
        currentUserInfo;
    const OS = Platform.OS;
    const isPhone = !getIsTablet();
    const [regionIndex, setRegionIndex] = useState(0);
    const [typeIndex, setTypeIndex] = useState(1);
    const [createTypeIndex, setCreateTypeIndex] = useState(0);
    const [visibleGrade, setVisibleGrade] = useState(false);
    const [visibleType, setVisibleType] = useState("grade");
    const [examine, setExamine] = useState(false);
    const [subjectMap, setSubjectMap] = useState({});
    const [subjectList, setSubjectList] = useState([]);
    const [msgType, setMsgType] = useState("add"); //add 创建故事  look 首次获得派币奖励
    const [showMsg, setShowMsg] = useState(false);
    const [visibleWrong, setVisibleWrong] = useState(false);
    const [visibleDesk, setVisibleDesk] = useState(false);
    const config = typeConfig[typeIndex];
    useEffect(() => {
        const eventListener = DeviceEventEmitter.addListener(
            "refreshHomePageConfig",
            () => {
                getConfig();
            }
        );
        AppState.addEventListener("change", handleAppStateChange);
        return () => {
            eventListener.remove();
            AppState.removeEventListener("change", handleAppStateChange);
        };
    }, []);
    const handleAppStateChange = (nextAppState) => {
        // console.log('appState::::::::::',appState)
        // console.log('nextAppState::::::::::',nextAppState)
        if (nextAppState === "active") {
            dispatch(getVisibleSignIn());
        }
    };
    useEffect(() => {
        if (token) {
            dispatch(getAllCoin());
            getFirstReward();
            dispatch(getVisibleSignIn());
        }
    }, [token]);
    useEffect(() => {
        getConfig();
    }, [checkGrade, checkTeam]);
    useEffect(() => {
        const subject = typeList[typeIndex].label;
        let list = subjectMap[subject] ? subjectMap[subject] : [];
        list.forEach((i) => {
            const module = i.module;
            module.forEach((m, mi) => {
                m._index = mi;
            });
            let list_4 = [];
            let split_num = 4;
            if (isPhone) split_num = 3;
            for (let ii = 0; ii < module.length; ii += split_num) {
                list_4.push(module.slice(ii, ii + split_num));
            }
            i.splitModule = list_4;
        });
        setSubjectList(list);
    }, [typeIndex, subjectMap]);
    const getFirstReward = async () => {
        const data = await getPaiCoin({ source: "system" });
        if (data.status === "success") {
            setMsgType("look");
            setShowMsg(true);
            dispatch(getAllCoin());
        }
    };
    const getConfig = () => {
        const params = {
            grade_code: checkGrade,
            term_code: checkTeam,
        };
        axios.post(api.getHomepageConfig, params).then((res) => {
            const data = res.data.data.data;
            const subjectMap = data.reduce((c, i) => {
                c[i.name] = i.children;
                return c;
            }, {});
            setSubjectMap(subjectMap);
            setExamine(res.data.data.examine);
        });
    };
    const selectLeftNav = (index) => {
        if (!token) {
            NavigationUtil.resetToLogin(props);
            return;
        }
        switch (index) {
            case 0:
                NavigationUtil.toCenterCoinDetails(props);
                break;
            case 1:
                // NavigationUtil.toSquareHistory({
                //     navigation: props.navigation,
                //     data: { type: "history" },
                // });
                NavigationUtil.toStudyRoute(props);
                break;
            case 2:
                setVisibleWrong(true);
                break;
            case 3:
                NavigationUtil.toChineseStatisticsHome(props); //暂时只有语文统计
                break;
            case 4:
                setVisibleDesk(true)
                break;
        }
    };
    const selectType = (index) => {
        setTypeIndex(index);
    };
    const selectGradeOrBook = (type) => {
        // 幼小不开放切换年级
        if ((typeIndex !== 0 && type === "grade") || type === "book") {
            setVisibleType(type);
            setVisibleGrade(true);
        }
    };
    const selectYoungItem = (item) => {
        const { alias } = item;
        dispatch(setSelectModule({ alias }));
        dispatch(setSelestModuleAuthority());
        dispatch(getModuleCoin());
        switch (alias) {
            case "chinese_toPinyinHome":
                NavigationUtil.toChinesePinyinHome({
                    ...props,
                    data: {
                        isChildren: true,
                    },
                });
                break;
            case "chinese_toStudyCharacter":
                NavigationUtil.toChildrenStudyCharacterHomePage(props);
                break;
            case "english_toAbcs":
                NavigationUtil.toEnglishAbcsHome(props);
                break;
            case "math_knowledgeGraph":
                NavigationUtil.toMyChildrenMathKnowHome({
                    ...props,
                    data: {
                        isChildren: true,
                    },
                });
                break;
            default:
                break;
        }
    };
    const selectModule = (item) => {
        const { alias, lock } = item;
        dispatch(setSelectModule({ alias }));
        dispatch(setSelestModuleAuthority());
        const needPay = ["math_AIPractice", "chinese_toDoExercise", "english_AIPractice"]; //没有开放体验的,在首页就需要支付
        if (needPay.includes(alias) && lock) {
            dispatch(setVisible(true));
            return;
        }
        dispatch(getModuleCoin());
        switch (alias) {
            case "chinese_toLookAllExercise":
                // 习题审核
                NavigationUtil.toChineseLookAllExerciseHome({
                    ...props,
                    data: { ...examine },
                });
                break;
            case "chinese_toPinyinHome":
                // 语文拼音
                NavigationUtil.toChinesePinyinHome(props);
                break;
            case "chinese_toChineseSchoolHome":
                // 语文同步诊断
                NavigationUtil.toChineseSchoolHome(props);
                break;
            case "chinese_toChooseText":
                // 语文字词积累
                NavigationUtil.toWordsHomepage({
                    ...props,
                    data: { pageType: 4 },
                });
                break;
            // case "chinese_toWisdomTree":
            //     // 语文智学树
            //     NavigationUtil.toWordTreeIndex(props)
            //     break;
            case "chinese_toChooseTextSentence":
                // 语文智能句
                NavigationUtil.toNewSentence(props);
                break;
            case "chinese_composition":
                // 语文作文批改
                NavigationUtil.toChineseUploadArticle(props);
                break;
            case "chinese_toReading":
                // 语文阅读理解
                NavigationUtil.toReading({ ...props });
                break;
            case "chinese_toChineseDailySpeReadingStatics":
                // 语文阅读提升
                NavigationUtil.toChineseDailySpeReadingStatics(props);
                break;
            case "chinese_toLookUnitArticle":
                // 语文单元习作
                NavigationUtil.toChineseUnitComposition(props);
                break;
            case "chinese_toChineseDailyWrite":
                // 语文习作提升
                NavigationUtil.toChineseCompositionCheckType(props);
                break;
            case "math_aiGiveExercise":
                // 数学智能学习计划
                MathNavigationUtil.toMathAIGiveExerciseHome(props);
                break;
            case "math_knowledgeGraph":
                // 数学知识图谱
                MathNavigationUtil.toKnowledgeGraphExplainHomepage(props);
                break;
            case "math_mathTongbuHomePage":
                // 数学同步学习
                MathNavigationUtil.toSyncDiagnosisHomepage(props);
                break;
            case "math_cleverCalculation":
                // 数学巧算
                MathNavigationUtil.toMathEasyCalculationHomePage(props);
                break;
            case "math_thinkingTraining":
                // 数学思维训练
                MathNavigationUtil.toMathThinkingTrainingPage(props);
                break;
            case "english_Sentences":
                // 英语智能句
                NavigationUtil.toEnSentencesHomePage(props);
                break;
            case "english_toSelectUnitEn1":
                // 英语同步（my study）
                NavigationUtil.toSelectUnitEn({ ...props, data: { pageType: 1 } });
                break;
            case "english_toSelectUnitEn0":
                // 英语连线题
                NavigationUtil.toMixSelectUnit({
                    ...props,
                    data: {
                        index: 0,
                    },
                });
                break;
            case "english_toAbcs":
                // 英语字母单元(abcs)
                NavigationUtil.toEnglishAbcsHome(props);
                break;
            case "english_toSelectUnitEn2":
                // 英语test me
                NavigationUtil.toEnglishTestMeHome({
                    ...props,
                    data: { pageType: 2 },
                });
                break;
            case "chinese_toMyDesk":
                // 语文作业
                NavigationUtil.toYuwenHomepage(props);
                break;
            case "math_toMyDesk":
                // 数学作业
                MathNavigationUtil.toMathDeskHomepage(props);
                break;
            case "english_toMyDesk":
                // 英语作业
                NavigationUtil.toEnglishDeskHomepage(props);
                break;
            case "chinese_toChineseDiaryHome":
                // 学习日记
                NavigationUtil.toChineseDiaryHome(props);
                break;
            case "chinese_toFlowTextbookList":
                // 语文同步错题
                NavigationUtil.toFlowTextbookList(props);
                break;
            case "chinese_toChooseWrongExercise":
                // 语文专项错题
                NavigationUtil.toChooseWrongExercise(props);
                break;
            case "chinese_toChineseStatisticsHome":
                // 语文统计
                NavigationUtil.toChineseStatisticsHome(props);
                break;
            case "english_toEnglishStatisticsHome":
                // 英语统计
                NavigationUtil.toEnglishStatisticsHome(props);
                break;
            case "math_program":
                // 编程
                MathNavigationUtil.toMathProgramHomePage(props);
                break;
            case "math_AIPractice":
                NavigationUtil.toMathPracticeHomePage(props);
                break;
            case "math_WrongExercise":
                NavigationUtil.toMathWrongExercise(props);
                break;
            case "math_abilityDiagnosis":
                MathNavigationUtil.toMtahUnitDiagnosisHomePage(props);
                break;
            case "chinese_toDoExercise":
                NavigationUtil.toChineseQuickDoExercise(props);
                break;
            case "chinese_toStudyCharacter":
                NavigationUtil.toChildrenStudyCharacterHomePage(props);
                break;
            case "english_ket":
                NavigationUtil.toSquareHomeList({
                    ...props, data: {
                        bg: require("../images/homepage/item_bg_11.png"),
                        title: 'KET英语阅读',
                        type: 'paistory'
                    }
                })
                break;
            case "english_AIPractice":
                NavigationUtil.toEnglishAiGiveExercise(props);
                break;
        }
    };
    const selectCreateItem = (item) => {
        NavigationUtil.toSquareHomeList({ ...props, data: item });
    };
    const onOk = () => {
        setShowMsg(false);
        if (msgType === "add") {
            if (coin < 80) {
                // 余额不足
                dispatch(setPayCoinVisible(true));
                return;
            }
            squareType === "kid"
                ? NavigationUtil.toSquareCheckCreateType(props)
                : NavigationUtil.toSquareCheckQuestion(props);
        }
    };
    const toCenter = () => {
        if (!token) {
            NavigationUtil.resetToLogin(props);
            return;
        }
        NavigationUtil.toCenterHomePage(props);
    };
    const renderModuleName = (name) => {
        let fontSize = pxToDp(36);
        if (typeIndex === 3) {
            // 英语调字大小
            const len = name.length;
            if (len > 5) fontSize = pxToDp(30);
            if (len > 7) fontSize = pxToDp(24);
        }
        return (
            <View
                style={[
                    { width: pxToDp(160), height: pxToDp(80) },
                    appStyle.flexCenter,
                    {
                        transform: [
                            { translateX: pxToDp(-83) },
                            { translateY: pxToDp(20) },
                        ],
                    },
                ]}
            >
                <Text
                    style={[{ color: "#283139", fontSize }, appFont.fontFamily_jcyt_700]}
                >
                    {name}
                </Text>
            </View>
        );
    };
    const renderSubjectItem = ({ item, index }) => {
        const { name, splitModule } = item;
        return (
            <View>
                <Text
                    style={[
                        { color: "#283139", fontSize: pxToDp(36), marginLeft: pxToDp(20) },
                        appFont.fontFamily_jcyt_700,
                        OS === "ios" ? { marginBottom: pxToDp(50) } : null,
                        isPhone ? { marginBottom: pxToDpWidthLs(20) } : null,
                    ]}
                >
                    {name}
                </Text>
                {splitModule.map((i, x) => {
                    return (
                        <View
                            key={x}
                            style={[{ marginBottom: OS === "ios" ? pxToDp(40) : pxToDp(20) }]}
                        >
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexAliEnd,
                                    { position: "relative", zIndex: 1 },
                                ]}
                            >
                                {i.map((ii, xx) => {
                                    const { upper_right, name, detail, _index, alias } = ii; //upper_right 为aiPlan 表示是快速答题（智能学习计划）
                                    let lock = ii.lock
                                    if (alias === 'english_ket') {
                                        lock = false
                                    }
                                    let isPlan = upper_right === "aiPlan";
                                    return (
                                        <View style={[appStyle.flexAliCenter]} key={xx}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    selectModule(ii);
                                                }}
                                            >
                                                {isPlan ? (
                                                    <ImageBackground
                                                        resizeMode="stretch"
                                                        style={[
                                                            { width: pxToDp(440), height: pxToDp(182) },
                                                            isPhone
                                                                ? {
                                                                    width: pxToDpWidthLs(420),
                                                                    height: pxToDpWidthLs(170),
                                                                }
                                                                : null,
                                                        ]}
                                                        source={require("../images/homepage/item_plan.png")}
                                                    >
                                                        <Text
                                                            style={[
                                                                { color: "#283139", fontSize: pxToDp(32) },
                                                                appFont.fontFamily_jcyt_700,
                                                                {
                                                                    transform: [
                                                                        {
                                                                            translateX: isPhone
                                                                                ? pxToDpWidthLs(180)
                                                                                : pxToDp(180),
                                                                        },
                                                                        {
                                                                            translateY: isPhone
                                                                                ? pxToDpWidthLs(30)
                                                                                : pxToDp(30),
                                                                        },
                                                                    ],
                                                                },
                                                            ]}
                                                        >
                                                            {name}
                                                        </Text>
                                                        <View
                                                            style={[
                                                                {
                                                                    width: isPhone
                                                                        ? pxToDpWidthLs(200)
                                                                        : pxToDp(200),
                                                                },
                                                                {
                                                                    transform: [
                                                                        {
                                                                            translateX: isPhone
                                                                                ? pxToDpWidthLs(180)
                                                                                : pxToDp(180),
                                                                        },
                                                                        {
                                                                            translateY:
                                                                                OS === "ios" ? pxToDp(50) : pxToDp(20),
                                                                        },
                                                                    ],
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#6C6C76",
                                                                        fontSize: isPhone
                                                                            ? pxToDpWidthLs(18)
                                                                            : pxToDp(20),
                                                                    },
                                                                    appFont.fontFamily_jcyt_500,
                                                                ]}
                                                            >
                                                                {detail}
                                                            </Text>
                                                        </View>
                                                    </ImageBackground>
                                                ) : (
                                                    <ImageBackground
                                                        resizeMode="stretch"
                                                        style={[
                                                            { width: pxToDp(380), height: pxToDp(262) },
                                                            appStyle.flexAliCenter,
                                                        ]}
                                                        source={config.bg}
                                                    >
                                                        {renderModuleName(name)}
                                                        {lock ? (
                                                            <View
                                                                style={[
                                                                    styles.tagWrap,
                                                                    appStyle.flexCenter,
                                                                    { left: pxToDp(180), top: pxToDp(20) },
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        { color: "#fff", fontSize: pxToDp(24) },
                                                                        appFont.fontFamily_jcyt_700,
                                                                    ]}
                                                                >
                                                                    去体验
                                                                </Text>
                                                            </View>
                                                        ) : null}
                                                        {lock ? (
                                                            <Image
                                                                style={[
                                                                    { width: pxToDp(20), height: pxToDp(20) },
                                                                    {
                                                                        transform: [
                                                                            { translateX: pxToDp(-8) },
                                                                            { translateY: pxToDp(44) },
                                                                        ],
                                                                    },
                                                                ]}
                                                                source={require("../images/homepage/icon_lock.png")}
                                                            ></Image>
                                                        ) : (
                                                            <Image
                                                                style={[
                                                                    { width: pxToDp(22), height: pxToDp(16) },
                                                                    {
                                                                        transform: [
                                                                            { translateX: pxToDp(-8) },
                                                                            { translateY: pxToDp(44) },
                                                                        ],
                                                                    },
                                                                ]}
                                                                source={require("../images/homepage/icon_gou.png")}
                                                            ></Image>
                                                        )}
                                                        <View
                                                            style={[
                                                                { width: pxToDp(156) },
                                                                {
                                                                    transform: [
                                                                        { translateX: pxToDp(86) },
                                                                        {
                                                                            translateY:
                                                                                OS === "ios" ? pxToDp(60) : pxToDp(50),
                                                                        },
                                                                    ],
                                                                },
                                                                isPhone
                                                                    ? {
                                                                        transform: [
                                                                            { translateX: pxToDpWidthLs(66) },
                                                                            { translateY: pxToDpWidthLs(50) },
                                                                        ],
                                                                    }
                                                                    : null,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={[
                                                                    {
                                                                        color: "#6C6C76",
                                                                        fontSize:
                                                                            detail && detail.length > 28
                                                                                ? pxToDp(18)
                                                                                : pxToDp(20),
                                                                    },
                                                                    appFont.fontFamily_jcyt_500,
                                                                    isPhone
                                                                        ? { fontSize: pxToDpWidthLs(14) }
                                                                        : null,
                                                                ]}
                                                            >
                                                                {detail}
                                                            </Text>
                                                        </View>
                                                    </ImageBackground>
                                                )}
                                            </TouchableOpacity>
                                            <Text
                                                style={[
                                                    {
                                                        color: "#B99B7B",
                                                        fontSize: pxToDp(24),
                                                        fontWeight: "bold",
                                                    },
                                                ]}
                                            >
                                                {numMap[_index]}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                            <Image
                                style={[
                                    styles.bg2,
                                    { marginLeft: pxToDp(-46), marginTop: pxToDp(-76) },
                                    isPhone
                                        ? { ...styles.bg2Phone, marginTop: pxToDpWidthLs(-52) }
                                        : null,
                                ]}
                                source={require("../images/homepage/item_bg_2.png")}
                            ></Image>
                        </View>
                    );
                })}
            </View>
        );
    };
    const renderParentItem = ({ item, index }) => {
        return (
            <View style={[{ marginBottom: pxToDp(20) }]}>
                <View
                    style={[
                        appStyle.flexLine,
                        { marginLeft: pxToDp(26), position: "relative", zIndex: 1 },
                    ]}
                >
                    {item.map((i, x) => {
                        return (
                            <TouchableOpacity
                                style={[{ marginRight: pxToDp(42) }]}
                                key={x}
                                onPress={() => {
                                    selectCreateItem({ ...i, type: "common_story_v3" });
                                }}
                            >
                                <ImageBackground
                                    style={[
                                        { width: pxToDp(352), height: pxToDp(456) },
                                        appStyle.flexCenter,
                                    ]}
                                    source={i.bg}
                                >
                                    <View
                                        style={[
                                            {
                                                width: pxToDp(316),
                                                height: pxToDp(140),
                                                marginTop: pxToDp(86),
                                            },
                                            appStyle.flexCenter,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { color: "#283139", fontSize: i.fontSize },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            {i.title}
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <Image
                    style={[
                        styles.bg2,
                        { marginLeft: pxToDp(-40), marginTop: pxToDp(-42) },
                    ]}
                    source={require("../images/homepage/item_bg_2.png")}
                ></Image>
            </View>
        );
    };
    const renderTypeItem = ({ item, index }) => {
        const { label, icon, iconActive } = item;
        const active = typeIndex === index;
        return (
            <TouchableOpacity
                style={[
                    styles.typeItem,
                    isPhone ? { width: pxToDpWidthLs(190) } : null,
                    index === 0
                        ? { width: isPhone ? pxToDpWidthLs(260) : pxToDp(362) }
                        : null,
                    appStyle.flexLine,
                    appStyle.flexJusCenter,
                    active
                        ? { backgroundColor: config.color, borderColor: "#fff" }
                        : null,
                ]}
                onPress={() => {
                    selectType(index);
                    let info = _.cloneDeep(currentUserInfo);
                    info.isGrade = index !== 0;
                    dispatch(setUserInfoNow(info));
                }}
            >
                <View style={[styles.typeItemIconWrap, appStyle.flexCenter]}>
                    <Image
                        style={[{ width: pxToDp(48), height: pxToDp(48) }]}
                        source={active ? iconActive : icon}
                    ></Image>
                </View>
                <Text
                    style={[
                        { color: active ? "#fff" : "#283139", fontSize: pxToDp(40) },
                        appFont.fontFamily_jcyt_700,
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };
    const renderCreateTypeItem = ({ item, index }) => {
        const { label, icon } = item;
        const active = createTypeIndex === index;
        return (
            <TouchableOpacity
                style={[
                    styles.typeItem,
                    { borderWidth: 0, width: pxToDp(442) },
                    appStyle.flexLine,
                    appStyle.flexJusCenter,
                    active ? { backgroundColor: "#283139" } : null,
                    isPhone
                        ? { marginRight: pxToDpWidthLs(30), width: pxToDpWidthLs(356) }
                        : null,
                ]}
                onPress={() => {
                    setCreateTypeIndex(index);
                    dispatch(setSquareType(index === 0 ? "kid" : "parent"));
                }}
            >
                <View style={[styles.typeItemIconWrap, appStyle.flexCenter]}>
                    <Image
                        style={[{ width: pxToDp(48), height: pxToDp(48) }]}
                        source={icon}
                    ></Image>
                </View>
                <Text
                    style={[
                        { color: active ? "#fff" : "#283139", fontSize: pxToDp(40) },
                        appFont.fontFamily_jcyt_700,
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };
    const renderStudyContent = () => {
        if (typeIndex === 0) {
            // 幼小衔接
            return (
                <View
                    style={[
                        {
                            marginLeft: pxToDp(48),
                            marginTop: OS === "ios" ? pxToDp(100) : pxToDp(-10),
                        },
                        isPhone ? { marginTop: pxToDpWidthLs(-50) } : null,
                    ]}
                >
                    <View
                        style={[appStyle.flexLine, { position: "relative", zIndex: 1 }]}
                    >
                        {youngList.map((i, x) => {
                            const { bg, des, label, tab } = i;
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.youngItem,
                                        isPhone ? { marginRight: pxToDpWidthLs(24) } : null,
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        selectYoungItem(i);
                                    }}
                                >
                                    <View
                                        style={[
                                            appStyle.flexAliCenter,
                                            OS === "ios" ? { marginBottom: pxToDp(40) } : null,
                                            isPhone ? { marginBottom: 0 } : null,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.desWrap,
                                                appStyle.flexCenter,
                                                isPhone ? { width: pxToDpWidthLs(218) } : null,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    { color: "#4C4A4A", fontSize: pxToDp(28) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {des}
                                            </Text>
                                        </View>
                                        <View style={[styles.triangle]}></View>
                                    </View>
                                    <ImageBackground
                                        resizeMode="stretch"
                                        style={[
                                            { width: pxToDp(340), height: pxToDp(458) },
                                            appStyle.flexAliCenter,
                                            isPhone
                                                ? {
                                                    width: pxToDpWidthLs(236),
                                                    height: pxToDpWidthLs(312),
                                                }
                                                : null,
                                        ]}
                                        source={bg}
                                    >
                                        <Text
                                            style={[
                                                { color: "#283139", fontSize: pxToDp(48) },
                                                appFont.fontFamily_jcyt_700,
                                                {
                                                    transform: [
                                                        { translateX: pxToDp(10) },
                                                        { translateY: pxToDp(246) },
                                                    ],
                                                },
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                        {tab ? (
                                            <View
                                                style={[
                                                    styles.tabWrap,
                                                    appStyle.flexCenter,
                                                    { transform: [{ rotate: "-15deg" }] },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        { color: "#fff", fontSize: pxToDp(44) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {tab}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </ImageBackground>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Image
                        resizeMode="stretch"
                        style={[
                            styles.bg2,
                            { marginTop: pxToDp(-30), marginLeft: pxToDp(-90) },
                            isPhone ? styles.bg2Phone : null,
                            isPhone
                                ? {
                                    marginLeft: pxToDpWidthLs(-50),
                                    marginTop: pxToDpWidthLs(-20),
                                }
                                : null,
                        ]}
                        source={require("../images/homepage/item_bg_2.png")}
                    ></Image>
                </View>
            );
        } else if ([1, 2, 3].includes(typeIndex)) {
            return (
                <View
                    style={[
                        {
                            marginTop: OS === "ios" ? pxToDp(0) : pxToDp(-70),
                            marginLeft: pxToDp(10),
                            flex: 1,
                            paddingBottom: pxToDp(16),
                        },
                        isPhone
                            ? { marginTop: pxToDpWidthLs(-40), marginLeft: pxToDpWidthLs(20) }
                            : null,
                    ]}
                >
                    <FlatList
                        data={subjectList}
                        renderItem={renderSubjectItem}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            );
        } else if (typeIndex === 4) {
            let details = null;
            if (subjectList.length) {
                details = subjectList[0].module[0];
            }
            if (!details) return null;
            const { lock, name, detail, alias } = details;
            return (
                <View
                    style={[
                        {
                            marginLeft: pxToDp(40),
                            marginTop: OS === "ios" ? pxToDp(150) : pxToDp(-20),
                        },
                        isPhone ? { marginTop: pxToDpWidthLs(-50) } : null,
                    ]}
                >
                    <TouchableOpacity
                        style={[{ position: "relative", zIndex: 1 }]}
                        onPress={() => {
                            selectModule({ alias });
                        }}
                    >
                        <ImageBackground
                            style={[{ width: pxToDp(1092), height: pxToDp(498) }]}
                            source={require("../images/homepage/item_biancheng.png")}
                        >
                            <Text
                                style={[
                                    { color: "#fff", fontSize: pxToDp(48) },
                                    appFont.fontFamily_jcyt_700,
                                    {
                                        transform: [
                                            { translateX: pxToDp(114) },
                                            { translateY: pxToDp(256) },
                                        ],
                                    },
                                ]}
                            >
                                {name}
                            </Text>
                            <View
                                style={[
                                    { width: pxToDp(618) },
                                    {
                                        transform: [
                                            { translateX: pxToDp(420) },
                                            { translateY: pxToDp(170) },
                                        ],
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        { color: "#fff", fontSize: pxToDp(44) },
                                        appFont.fontFamily_jcyt_500,
                                    ]}
                                >
                                    {detail}
                                </Text>
                            </View>
                            {lock ? (
                                <View
                                    style={[
                                        styles.tagWrap,
                                        appStyle.flexCenter,
                                        { right: pxToDp(-70), top: pxToDp(180) },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            { color: "#fff", fontSize: pxToDp(24) },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        去体验
                                    </Text>
                                </View>
                            ) : null}
                        </ImageBackground>
                    </TouchableOpacity>
                    <Image
                        style={[
                            styles.bg2,
                            { marginLeft: pxToDp(-80), marginTop: pxToDp(-36) },
                            isPhone ? styles.bg2Phone : null,
                            isPhone ? { marginLeft: pxToDpWidthLs(-50) } : null,
                        ]}
                        source={require("../images/homepage/item_bg_2.png")}
                    ></Image>
                </View>
            );
        }
    };
    const renderRegion = () => {
        if (regionIndex === 0) {
            return (
                <ImageBackground
                    resizeMode="stretch"
                    style={[
                        styles.rightContent,
                        OS === "ios" ? { height: pxToDp(1200) } : null,
                        isPhone
                            ? { width: pxToDpWidthLs(1100), height: pxToDpWidthLs(620) }
                            : null,
                    ]}
                    source={
                        isPhone
                            ? config.bgPhone
                            : OS === "ios"
                                ? config.bgIos
                                : config.bgAndroid
                    }
                >
                    <View
                        style={{ position: "relative", zIndex: 1, marginLeft: pxToDp(30) }}
                    >
                        <FlatList
                            data={typeList}
                            renderItem={renderTypeItem}
                            keyExtractor={(item, index) => item.label}
                            extraData={typeIndex}
                            horizontal={true}
                        />
                    </View>
                    <Image
                        resizeMode="stretch"
                        style={[
                            styles.bg1,
                            isPhone
                                ? { width: pxToDpWidthLs(1170), marginLeft: pxToDpWidthLs(-30) }
                                : null,
                        ]}
                        source={require("../images/homepage/item_bg_1.png")}
                    ></Image>
                    {renderStudyContent()}
                </ImageBackground>
            );
        } else if (regionIndex === 1) {
            let content = null;
            if (createTypeIndex === 0) {
                content = (
                    <View
                        style={[
                            { marginTop: OS === "ios" ? pxToDp(90) : pxToDp(-30) },
                            isPhone ? { marginTop: pxToDpWidthLs(-40) } : null,
                        ]}
                    >
                        <View
                            style={[
                                appStyle.flexLine,
                                { position: "relative", zIndex: 1, marginLeft: pxToDp(50) },
                            ]}
                        >
                            {studentList.map((i, x) => {
                                return (
                                    <TouchableOpacity
                                        style={[{ marginRight: pxToDp(50) }]}
                                        key={x}
                                        onPress={() => {
                                            selectCreateItem(i);
                                        }}
                                    >
                                        <ImageBackground
                                            style={[
                                                { width: pxToDp(400), height: pxToDp(516) },
                                                appStyle.flexAliCenter,
                                            ]}
                                            source={i.bg}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: pxToDp(358),
                                                        height: pxToDp(158),
                                                        marginTop: pxToDp(64),
                                                    },
                                                    appStyle.flexCenter,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        { color: "#283139", fontSize: pxToDp(48) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {i.title}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Image
                            style={[
                                styles.bg2,
                                { marginLeft: pxToDp(-40), marginTop: pxToDp(-46) },
                                isPhone ? styles.bg2Phone : null,
                                isPhone ? { marginLeft: pxToDpWidthLs(-20) } : null,
                            ]}
                            source={require("../images/homepage/item_bg_2.png")}
                        ></Image>
                    </View>
                );
            }
            if (createTypeIndex === 1) {
                content = (
                    <View
                        style={[
                            {
                                marginTop: OS === "ios" ? 0 : pxToDp(-50),
                                flex: 1,
                                paddingBottom: pxToDp(20),
                            },
                        ]}
                    >
                        <FlatList
                            data={parentList}
                            renderItem={renderParentItem}
                            keyExtractor={(item, index) => item.label}
                        />
                    </View>
                );
            }
            return (
                <ImageBackground
                    resizeMode="stretch"
                    style={[
                        styles.rightContent,
                        OS === "ios" ? { height: pxToDp(1200) } : null,
                        isPhone
                            ? { width: pxToDpWidthLs(1100), height: pxToDpWidthLs(620) }
                            : null,
                    ]}
                    source={
                        OS === "ios"
                            ? require("../images/homepage/bg_6_ios.png")
                            : require("../images/homepage/bg_6.png")
                    }
                >
                    <View
                        style={{ position: "relative", zIndex: 1, marginLeft: pxToDp(30) }}
                    >
                        <FlatList
                            data={createTypeList}
                            renderItem={renderCreateTypeItem}
                            keyExtractor={(item, index) => item.label}
                            extraData={createTypeIndex}
                            horizontal={true}
                        />
                    </View>
                    <Image
                        resizeMode="stretch"
                        style={[
                            {
                                width: pxToDp(1714),
                                height: pxToDp(210),
                                marginLeft: pxToDp(-54),
                                marginTop: pxToDp(-90),
                            },
                            isPhone
                                ? { width: pxToDpWidthLs(1220), marginLeft: pxToDpWidthLs(-80) }
                                : null,
                        ]}
                        source={
                            isPhone
                                ? require("../images/homepage/item_bg_8_phone.png")
                                : require("../images/homepage/item_bg_8.png")
                        }
                    ></Image>
                    {content}
                    <TouchableOpacity
                        style={[
                            { position: "absolute", right: pxToDp(36), bottom: pxToDp(36) },
                        ]}
                        onPress={() => {
                            if (!token) {
                                NavigationUtil.resetToLogin(props);
                                return;
                            }
                            setMsgType("add");
                            setShowMsg(true);
                        }}
                    >
                        <Image
                            style={[{ width: pxToDp(160), height: pxToDp(160) }]}
                            source={require("../images/homepage/create_btn.png")}
                        ></Image>
                    </TouchableOpacity>
                </ImageBackground>
            );
        }
    };
    return (
        organ_name === '摆点宣传组' ? <AdvertisingPage navigation={props.navigation}></AdvertisingPage> :
            <View
                style={[styles.container, appStyle.flexTopLine, appStyle.flexJusCenter]}
            >
                <View
                    style={[
                        styles.left,
                        appStyle.flexJusBetween,
                        isPhone ? { width: pxToDpWidthLs(430) } : null,
                    ]}
                >
                    <View
                        style={[
                            styles.infoWrap,
                            appStyle.flexCenter,
                            isPhone ? { paddingLeft: pxToDpWidthLs(80) } : null,
                        ]}
                    >
                        <TouchableOpacity onPress={toCenter}>
                            <View style={[{ width: pxToDp(120), height: pxToDp(120), borderRadius: pxToDp(60), overflow: 'hidden', borderWidth: pxToDp(3) }, appStyle.flexCenter]}>
                                <Image
                                    // resizeMode="contain"
                                    style={[
                                        {
                                            width: pxToDp(120),
                                            height: pxToDp(120),
                                            borderRadius: pxToDp(60)
                                        },
                                    ]}
                                    source={{ uri: url.baseURL + avatar }}
                                />
                            </View>

                        </TouchableOpacity>
                        <Text
                            style={[
                                { color: "#283139", fontSize: pxToDp(36) },
                                appFont.fontFamily_jcyt_700,
                                OS === "ios"
                                    ? { lineHeight: pxToDp(46), marginTop: pxToDp(30) }
                                    : { marginTop: pxToDp(12) },
                            ]}
                        >
                            {name}
                        </Text>
                        <Text style={[{ color: "rgba(40, 49, 57, .3)", fontSize: pxToDp(16), lineHeight: pxToDp(22) }, appFont.fontFamily_jcyt_500]}>{username}</Text>
                        {typeIndex === 0 ? null : <TouchableOpacity
                            style={[
                                styles.gradeWrap,
                                appStyle.flexLine,
                                appStyle.flexJusCenter,
                                OS === "ios"
                                    ? { marginTop: pxToDp(40) }
                                    : { marginTop: pxToDp(10) },
                            ]}
                            onPress={() => {
                                selectGradeOrBook("grade");
                            }}
                        >
                            <Text
                                style={[
                                    { fontSize: pxToDp(32), color: "#fff" },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                {grade}-{term}
                            </Text>
                            <Image
                                resizeMode="contain"
                                style={[
                                    {
                                        width: pxToDp(20),
                                        height: pxToDp(20),
                                        marginLeft: pxToDp(48),
                                    },
                                ]}
                                source={require("../images/homepage/icon_9.png")}
                            ></Image>
                        </TouchableOpacity>}
                        {typeIndex === 0 || typeIndex === 2 ? <TouchableOpacity
                            style={[styles.bookWrap, appStyle.flexLine, appStyle.flexJusCenter]}
                            onPress={() => {
                                selectGradeOrBook("book");
                            }}
                        >
                            <Text
                                style={[
                                    { fontSize: pxToDp(24), color: "#fff" },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {textbookname}
                            </Text>
                            <Image
                                resizeMode="contain"
                                style={[
                                    {
                                        width: pxToDp(20),
                                        height: pxToDp(20),
                                        marginLeft: pxToDp(20),
                                    },
                                ]}
                                source={require("../images/homepage/icon_9.png")}
                            ></Image>
                        </TouchableOpacity> : null}
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        <View
                            style={[
                                { marginTop: pxToDp(0) },
                                appStyle.flexAliCenter,
                                isPhone ? { paddingLeft: pxToDpWidthLs(50) } : null,
                            ]}
                        >
                            {left_nav.map((i, x) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.configItem,
                                            appStyle.flexLine,
                                            appStyle.flexJusBetween,
                                            { height: OS === "ios" ? pxToDp(110) : pxToDp(90) },
                                            isPhone ? { height: pxToDpWidthLs(60) } : null,
                                        ]}
                                        key={x}
                                        onPress={() => {
                                            selectLeftNav(x);
                                        }}
                                    >
                                        <View style={[appStyle.flexLine]}>
                                            <Image
                                                resizeMode="contain"
                                                style={[{ width: pxToDp(48), height: pxToDp(48) }]}
                                                source={i.icon}
                                            ></Image>
                                            <Text
                                                style={[
                                                    { color: "#283139", fontSize: pxToDp(28) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {x === 0
                                                    ? i.label + `x${coin > 9999 ? "999+" : coin}`
                                                    : i.label}
                                            </Text>
                                        </View>
                                        <Image
                                            resizeMode="contain"
                                            style={[{ width: pxToDp(16), height: pxToDp(16) }]}
                                            source={require("../images/homepage/icon_14.png")}
                                        ></Image>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.centerBtn,
                                appStyle.flexLine,
                                appStyle.flexJusBetween,
                                isPhone ? { marginLeft: pxToDpWidthLs(100) } : null,
                            ]}
                            onPress={toCenter}
                        >
                            <View style={[appStyle.flexLine]}>
                                <Avatar style={{ borderRadius: pxToDp(12) }} width={64} />
                                <Text
                                    style={[
                                        {
                                            color: "#283139",
                                            fontSize: pxToDp(28),
                                            marginLeft: pxToDp(28),
                                        },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    个人中心
                                </Text>
                            </View>
                            <Image
                                resizeMode="contain"
                                style={[{ width: pxToDp(22), height: pxToDp(22) }]}
                                source={require("../images/homepage/icon_14.png")}
                            ></Image>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
                <View style={[{ flex: 1 }]}>
                    <TouchableOpacity
                        style={[styles.dailyWrap]}
                        onPress={() => {
                            NavigationUtil.toDailyTaskIndex(props);
                        }}
                    >
                        {!getAllTaskCoin ? (
                            <Image
                                style={[styles.dailyCircle]}
                                source={require("../images/dailyTask/icon_1.png")}
                            ></Image>
                        ) : null}
                        <ImageBackground
                            style={[{ width: pxToDp(253), height: pxToDp(138) }]}
                            source={require("../images/homepage/item_bg_3.png")}
                        >
                            <Text
                                style={[
                                    { color: "#fff", fontSize: pxToDp(28) },
                                    appFont.fontFamily_jcyt_700,
                                    {
                                        transform: [
                                            { translateX: pxToDp(120) },
                                            { translateY: OS === "ios" ? pxToDp(80) : pxToDp(70) },
                                        ],
                                    },
                                ]}
                            >
                                每日任务
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    {examine ? (
                        <TouchableOpacity
                            style={[
                                {
                                    position: "absolute",
                                    left: pxToDp(0),
                                    top: pxToDp(0),
                                    padding: pxToDp(40),
                                    zIndex: 1,
                                },
                            ]}
                            onPress={() => {
                                selectModule({ alias: "chinese_toLookAllExercise" });
                            }}
                        >
                            <Text
                                style={[
                                    { color: "#283139", fontSize: pxToDp(36) },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                习题审核
                            </Text>
                        </TouchableOpacity>
                    ) : null}

                    <View
                        style={[
                            appStyle.flexLine,
                            appStyle.flexJusCenter,
                            { height: OS === "ios" ? pxToDp(172) : pxToDp(144) },
                            isPhone ? { height: pxToDpWidthLs(90) } : null,
                        ]}
                    >
                        {region_nav.map((i, x) => {
                            const active = regionIndex === x;
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.regionItem,
                                        appStyle.flexLine,
                                        appStyle.flexCenter,
                                        x === 0 ? { marginRight: pxToDp(48) } : null,
                                        active ? { backgroundColor: "#283139" } : null,
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        setRegionIndex(x);
                                    }}
                                >
                                    {active ? (
                                        <Image
                                            style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                                            source={i.iconActive}
                                        ></Image>
                                    ) : (
                                        <Image
                                            style={[{ width: pxToDp(48), height: pxToDp(48) }]}
                                            source={i.icon}
                                        ></Image>
                                    )}
                                    <Text
                                        style={[
                                            {
                                                color: active ? "#fff" : "#283139",
                                                fontSize: pxToDp(36),
                                                marginLeft: pxToDp(20),
                                            },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        {i.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {renderRegion()}
                </View>
                <SelectGradeAndBook
                    visible={visibleGrade}
                    type={visibleType}
                    back={() => {
                        setVisibleGrade(false);
                    }}
                ></SelectGradeAndBook>
                <Msg
                    showMsg={showMsg}
                    onClose={() => {
                        setShowMsg(false);
                    }}
                    onOk={onOk}
                    navigation={props.navigation}
                    mainDOm={
                        msgType === "add" ? null : (
                            <View
                                style={[appStyle.flexTopLine, { flex: 1, alignItems: "center" }]}
                            >
                                <Text style={[styles.msgNormal]}>恭喜获得200派币！</Text>
                            </View>
                        )
                    }
                />
                <SelectWrongSubject
                    visible={visibleWrong}
                    navigation={props.navigation}
                    close={() => {
                        setVisibleWrong(false);
                    }}
                ></SelectWrongSubject>
                <SelectDeskSubject
                    visible={visibleDesk}
                    navigation={props.navigation}
                    close={() => {
                        setVisibleDesk(false);
                    }}></SelectDeskSubject>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F4F1",
    },
    left: {
        width: pxToDp(424),
        paddingRight: pxToDp(20),
        height: "100%",
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(20),
    },
    infoWrap: {
        width: "100%",
        height: pxToDp(492),
        backgroundColor: "#D7D1CD",
        borderWidth: pxToDp(4),
        borderColor: "#fff",
        borderTopRightRadius: pxToDp(52),
        borderBottomRightRadius: pxToDp(52),
    },
    gradeWrap: {
        width: pxToDp(362),
        height: pxToDp(108),
        borderRadius: pxToDp(34),
        backgroundColor: "#3A4148",
    },
    bookWrap: {
        minWidth: pxToDp(160),
        paddingLeft: pxToDp(16),
        paddingRight: pxToDp(16),
        height: pxToDp(58),
        backgroundColor: "#5D6165",
        borderRadius: pxToDp(46),
        marginTop: pxToDp(18),
    },
    configItem: {
        width: pxToDp(305),
    },
    centerBtn: {
        width: pxToDp(362),
        height: pxToDp(96),
        borderRadius: pxToDp(24),
        backgroundColor: "#D7D1CD",
        borderWidth: pxToDp(4),
        borderColor: "#F9F8F8",
        marginLeft: pxToDp(18),
        paddingRight: pxToDp(26),
        paddingLeft: pxToDp(26)
    },
    rightContent: {
        width: pxToDp(1588),
        height: pxToDp(936),
        paddingTop: pxToDp(22),
    },
    regionItem: {
        width: pxToDp(248),
        height: pxToDp(76),
        borderRadius: pxToDp(108),
    },
    bg1: {
        width: pxToDp(1714),
        height: pxToDp(210),
        marginLeft: pxToDp(-60),
        marginTop: pxToDp(-90),
    },
    bg2: {
        width: pxToDp(1665),
        height: pxToDp(110),
    },
    bg2Phone: {
        width: pxToDpWidthLs(1130),
        height: pxToDpWidthLs(72),
    },
    typeItem: {
        width: pxToDp(282),
        height: pxToDp(140),
        borderRadius: pxToDp(66),
        backgroundColor: "#D7D1CD",
        marginRight: pxToDp(12),
        borderWidth: pxToDp(4),
        borderColor: "transparent",
    },
    typeItemIconWrap: {
        width: pxToDp(108),
        height: pxToDp(108),
        borderRadius: pxToDp(54),
        backgroundColor: "#fff",
        marginRight: pxToDp(22),
    },
    dailyWrap: {
        marginRight: pxToDp(-20),
        position: "absolute",
        right: pxToDp(82),
        top: pxToDp(15),
        zIndex: 1,
    },
    dailyCircle: {
        width: pxToDp(18),
        height: pxToDp(18),
        position: "absolute",
        left: pxToDp(92),
        top: pxToDp(0),
        zIndex: 1,
    },
    desWrap: {
        width: pxToDp(340),
        height: pxToDp(86),
        borderRadius: pxToDp(28),
        backgroundColor: "#FCF8F5",
        padding: pxToDp(12),
    },
    youngItem: {
        marginRight: pxToDp(48),
    },
    triangle: {
        width: 0,
        height: 0,
        borderWidth: pxToDp(10),
        borderTopColor: "#FCF8F5",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },
    tabWrap: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(55),
        borderWidth: pxToDp(4),
        borderColor: "#6FE7B9",
        backgroundColor: "#AC78FD",
        position: "absolute",
        right: pxToDp(-26),
        top: pxToDp(150),
    },
    tagWrap: {
        width: pxToDp(112),
        height: pxToDp(56),
        borderRadius: pxToDp(32),
        borderBottomLeftRadius: 0,
        backgroundColor: "#00C2A2",
        position: "absolute",
    },
    msgNormal: {
        fontSize: pxToDp(50),
        color: "#283139",
        ...appFont.fontFamily_jcyt_500,
    },
});
export default HomePage;
