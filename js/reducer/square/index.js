import _ from "lodash";
import { fromJS } from "immutable";

const getRoleId = (role) => (role === "bot" ? 1 : 2);

const oss_url = ''


const getQuestionMap = () => {
    const rawQuestionMap = {
        "动物和植物": ["狮子是怎样捕猎的？", "为什么树叶会变色？",
            "海龟是如何找到回家的路的？",
            "为什么某些植物会在夜间闭合叶子？",
            "大象的鼻子有什么特殊功能？",
            "仙人掌是如何在沙漠中生存的？",
            "鲨鱼有多少种类？",
            "为什么鸟类会迁徙？",
            "蜘蛛是怎样织网的？",
            "蝴蝶的翅膀为什么那么鲜艳？",
            "为什么熊会冬眠？",
            "什么是食肉植物，它们如何捕食？",
            "海马是怎样繁殖的？",
            "树木是怎样通过年轮知道它们的年龄的？",
            "为什么孔雀会开屏？",
            "蚂蚁是如何找到食物的？",
            "青蛙是如何变成成年的？",
            "为什么竹子生长得那么快？",
            "蜜蜂是如何酿蜜的？",
            "鳄鱼是怎样捕食的？"
        ],
        "宇宙和天文": [
            "太阳是如何产生光和热的？",
            "月球为什么会有月相变化？",
            "为什么行星会绕着太阳转？",
            "什么是黑洞？",
            "为什么天空是蓝色的？",
            "宇宙有多大？",
            "流星和陨石有什么区别？",
            "火星上有水吗？",
            "人类是如何登上月球的？",
            "星星为什么会闪烁？",
            "什么是银河系？",
            "天文学家如何发现新的行星？",
            "为什么有的星星会爆炸？",
            "什么是太空站？",
            "什么是宇宙大爆炸理论？",
            "土星的环是由什么组成的？",
            "为什么彗星有尾巴？",
            "月球上有生物吗？",
            "宇航员在太空中如何生活？",
            "为什么金星被称为“晨星”和“昏星”？"
        ],
        "地球科学": [
            "火山是如何形成的？",
            "地震是怎样发生的？",
            "什么是岩石循环？",
            "为什么会有四季变化？",
            "什么是地壳？",
            "为什么会有海啸？",
            "什么是大陆漂移理论？",
            "地球的中心是什么？",
            "为什么会有极光？",
            "龙卷风是如何形成的？",
            "什么是地质年代？",
            "为什么冰川会移动？",
            "火山喷发时会发生什么？",
            "为什么海洋是蓝色的？",
            "什么是矿物？",
            "大气层有什么作用？",
            "为什么会有不同类型的土壤？",
            "什么是温室效应？",
            "岩石是如何形成的？",
            "什么是气候变化？"
        ],
        "健康知识": [
            "如何保持健康的饮食？",
            "为什么要多喝水？",
            "为什么需要每天运动？",
            "如何预防感冒？",
            "为什么睡眠对健康很重要？",
            "什么是平衡膳食？",
            "牙齿健康如何维护？",
            "为什么要经常洗手？",
            "如何正确刷牙？",
            "为什么要避免吃太多糖？",
            "如何应对过敏？",
            "为什么要经常进行体检？",
            "如何保持良好的姿势？",
            "什么是视力保护？",
            "如何预防近视？",
            "为什么要注意卫生？",
            "如何应对压力和情绪？",
            "什么是健康的作息时间？",
            "为什么要避免吸烟和饮酒？",
            "如何进行心理健康管理？"
        ],
    }
    return Object.fromEntries(
        Object.keys(rawQuestionMap).flatMap(key =>
            rawQuestionMap[key].map(value => [value, key])
        )
    );
}

const defaultState = fromJS({
    questionMap: getQuestionMap(),
    messages: [],
    canSend: false,
    bottomHeight: 0,
    img: "",
    story: "",
    englishStory: "",
    title: "",
    storyId: "",
    storyImgDict: {
        "童话": [
            "paixiaoxue/square/童话1.png",
            "paixiaoxue/square/童话2.png",
            "paixiaoxue/square/童话3.png",
            "paixiaoxue/square/童话4.png",
        ],
        "科幻": [
            "paixiaoxue/square/科幻1.png",
            "paixiaoxue/square/科幻2.png",
            "paixiaoxue/square/科幻3.png",
            "paixiaoxue/square/科幻4.png",
        ],
        "经典": [
            "paixiaoxue/square/经典1.png",
            "paixiaoxue/square/经典2.png",
            "paixiaoxue/square/经典3.png",
            "paixiaoxue/square/经典4.png",
        ],
        "轻松": [
            "paixiaoxue/square/轻松1.png",
            "paixiaoxue/square/轻松2.png",
            "paixiaoxue/square/轻松3.png",
            "paixiaoxue/square/轻松4.png",
        ],
        "动物和植物": [
            "paixiaoxue/square/动物和植物1.png",
            "paixiaoxue/square/动物和植物2.png",
            "paixiaoxue/square/动物和植物3.png",
            "paixiaoxue/square/动物和植物4.png",
        ],
        "宇宙和天文": [
            "paixiaoxue/square/宇宙和天文1.png",
            "paixiaoxue/square/宇宙和天文2.png",
            "paixiaoxue/square/宇宙和天文3.png",
            "paixiaoxue/square/宇宙和天文4.png",
        ],
        "地球科学": [
            "paixiaoxue/square/地球科学1.png",
            "paixiaoxue/square/地球科学2.png",
            "paixiaoxue/square/地球科学3.png",
            "paixiaoxue/square/地球科学4.png",
        ],
        "健康知识": [
            "paixiaoxue/square/健康知识1.png",
            "paixiaoxue/square/健康知识2.png",
            "paixiaoxue/square/健康知识3.png",
            "paixiaoxue/square/健康知识4.png",
        ],

        "高效学习": [
            "paixiaoxue/square/高效学习1.png",
            "paixiaoxue/square/高效学习2.png",
            "paixiaoxue/square/高效学习3.png",
            "paixiaoxue/square/高效学习4.png",
        ],
        "教育与学习": [
            "paixiaoxue/square/教育与学习1.png",
            "paixiaoxue/square/教育与学习2.png",
            "paixiaoxue/square/教育与学习3.png",
            "paixiaoxue/square/教育与学习4.png",
        ],
        "心理健康与情感发展": [
            "paixiaoxue/square/心理健康与情感发展1.png",
            "paixiaoxue/square/心理健康与情感发展2.png",
            "paixiaoxue/square/心理健康与情感发展3.png",
            "paixiaoxue/square/心理健康与情感发展4.png",
        ],
        "身体健康与生活习惯": [
            "paixiaoxue/square/身体健康与生活习惯1.png",
            "paixiaoxue/square/身体健康与生活习惯2.png",
            "paixiaoxue/square/身体健康与生活习惯3.png",
            "paixiaoxue/square/身体健康与生活习惯4.png",
        ],
        "家庭关系与教育": [
            "paixiaoxue/square/家庭关系与教育1.png",
            "paixiaoxue/square/家庭关系与教育2.png",
            "paixiaoxue/square/家庭关系与教育3.png",
            "paixiaoxue/square/家庭关系与教育4.png",
        ],
        "社交与兴趣爱好": [
            "paixiaoxue/square/社交与兴趣爱好1.png",
            "paixiaoxue/square/社交与兴趣爱好2.png",
            "paixiaoxue/square/社交与兴趣爱好3.png",
            "paixiaoxue/square/社交与兴趣爱好4.png",
        ],
        "教育选择与未来规划": [
            "paixiaoxue/square/教育选择与未来规划1.png",
            "paixiaoxue/square/教育选择与未来规划2.png",
            "paixiaoxue/square/教育选择与未来规划3.png",
            "paixiaoxue/square/教育选择与未来规划4.png",
        ],
    },
    storyBGMDict: {
        "童话": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/tonghua.wav",
        "科幻": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/kehuan.wav",
        "经典": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/output.wav",
        "轻松": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/qingsong.wav",
        "动物和植物": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/dongwuhezhiwu.wav",
        "宇宙和天文": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/kehuan.wav",
        "地球科学": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/diqiukexue.wav",
        "健康知识": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/jiankangzhishi.wav",

        "家长": "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/kehuan.wav",
    },
    expandImgs: [
        "补充1.png",
        "补充2.png",
        "补充3.png",
        "补充4.png",
        "补充5.png",
        "补充6.png",
        "补充7.png",
        "补充8.png",
        "补充9.png",
        "补充10.png",
        "补充11.png",
        "补充12.png",
        "补充13.png",
        "补充14.png",
        "补充15.png",
        "补充16.png",
        "补充17.png",
        "补充18.png",
        "补充19.png",
        "补充20.png",
        "补充21.png",
        "补充22.png",
        "补充23.png",
        "补充24.png",
        "补充25.png",
        "补充26.png",
        "补充27.png",
        "补充28.png",
        "补充29.png",
        "补充30.png",
        "补充31.png",
        "补充32.png",
        "补充33.png",
        "补充34.png",
        "补充35.png",
        "补充36.png",
        "补充37.png",
        "补充38.png",
        "补充39.png",
        "补充40.png",
        "补充41.png",
        "补充42.png",
        "补充43.png",
        "补充44.png",
        "补充45.png",
        "补充46.png",
        "补充47.png",
        "补充48.png",
        "补充49.png",
        "补充50.png",
        "补充51.png",
        "补充52.png",
        "补充53.png",
        "补充54.png",
        "补充55.png",
        "补充56.png",
        "补充57.png",
        "补充58.png",
        "补充59.png",
        "补充60.png",
        "补充61.png",
        "补充62.png",
        "补充63.png",
        "补充64.png",
        "补充65.png",
        "补充66.png",
        "补充67.png",
        "补充68.png",
        "补充69.png",
        "补充70.png",
        "补充71.png",
        "补充72.png",
        "补充73.png",
        "补充74.png",
        "补充75.png",
        "补充76.png",
        "补充77.png",
        "补充78.png",
        "补充79.png",
        "补充80.png",
        "补充81.png",
        "补充82.png",
        "补充83.png",
        "补充84.png",
        "补充85.png",
        "补充86.png",
        "补充87.png",
        "补充88.png",
        "补充89.png",
        "补充90.png",
        "补充91.png",
        "补充92.png",
        "补充93.png",
        "补充94.png",
        "补充95.png",
        "补充96.png",
        "补充97.png",
        "补充98.png",
        "补充99.png",
        "补充100.png",
        "补充101.png",
        "补充102.png",
        "补充103.png",
        "补充104.png",
        "补充105.png",
        "补充106.png",
        "补充107.png",
        "补充108.png",
        "补充109.png",
        "补充110.png",
        "补充111.png",
        "补充112.png",
        "补充113.png",
        "补充114.png",
        "补充115.png",
        "补充116.png",
        "补充117.png",
        "补充118.png",
        "补充119.png",
        "补充120.png",
        "补充121.png",
        "补充122.png",
        "补充123.png",
        "补充124.png",
        "补充125.png",
        "补充126.png",
        "补充127.png",
        "补充128.png",
        "补充129.png",
        "补充130.png",
        "补充131.png",
        "补充132.png",
        "补充133.png",
        "补充134.png",
        "补充135.png",
        "补充136.png",
        "补充137.png",
        "补充138.png",
        "补充139.png",
        "补充140.png",
        "补充141.png",
        "补充142.png",
        "补充143.png",
        "补充144.png",
        "补充145.png",
        "补充146.png",
        "补充147.png",
        "补充148.png",
        "补充149.png",
        "补充150.png",
        "补充151.png",
        "补充152.png",
        "补充153.png",
        "补充154.png",
        "补充155.png",
        "补充156.png",
        "补充157.png",
        "补充158.png",
        "补充159.png",
        "补充160.png",
        "补充161.png",
        "补充162.png",
        "补充163.png",
        "补充164.png",
        "补充165.png",
        "补充166.png",
        "补充167.png",
        "补充168.png",
        "补充169.png",
        "补充170.png",
        "补充171.png",
        "补充172.png",
        "补充173.png",
        "补充174.png",
        "补充175.png",
        "补充176.png",
        "补充177.png",
        "补充178.png",
        "补充179.png",
        "补充180.png",
        "补充181.png",
        "补充182.png",
        "补充183.png",
        "补充184.png",
        "补充185.png",
        "补充186.png",
        "补充187.png",
        "补充188.png",
        "补充189.png",
        "补充190.png",
        "补充191.png",
        "补充192.png",
        "补充193.png",
        "补充194.png",
        "补充195.png",
        "补充196.png",
        "补充197.png",
        "补充198.png",
        "补充199.png",
        "补充200.png"
    ],
    checkWordList: [],
    storyType: "",
    homeSelectItem: {},
    contentAudio: "",
    storyCreateType: "",
    checkedQuestion: "",
    // contentAudio: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/square-audio/mixkit-summer-fun-13.mp3",
    chatLoading: false,
    sessionId: 0,
    checkQuestionTag: ""
});

export default (state = defaultState, action) => {
    let messageData = [];
    switch (action.type) {
        case "square/getChat":
            let testdata = _.cloneDeep(state.toJS().messages);
            testdata.unshift({
                _id: 1,
                text: "...",
                createdAt: new Date(),
                user: {
                    _id: 1,
                },
            });
            return state.merge({
                messages: testdata,
            });
        case "square/setMessages":
            const { message } = action.data;
            const { role, content } = message;
            messageData = {
                _id: Math.random().toString(36).substring(7),
                text: content,
                createdAt: new Date(),
                user: {
                    // _id: action.data === "..." ? 1 : 2,
                    _id: getRoleId(role),
                },
            };
            let msgs = JSON.parse(JSON.stringify(state.toJS().messages));
            msgs.unshift(messageData);
            return state.merge({
                messages: msgs,
            });
        case "square/initMessages":
            return state.merge({
                messages: [],
            });
        case "square/setCanSend":
            return state.merge({
                canSend: action.data,
            });
        case "square/setBottomHeight":
            return state.merge({
                bottomHeight: action.data,
            });
        case "square/deleteWaitingStatus":
            const messages = state.toJS().messages.filter((m) => m["text"] !== "...");
            return state.merge({
                messages,
            });
        case "square/setImg":
            return state.merge({
                img: action.data,
            });
        case "square/setStory":
            return state.merge({
                story: action.data,
            });
        case "square/setEnglishStory":
            return state.merge({
                englishStory: action.data,
            });
        case "square/setTitle":
            return state.merge({
                title: action.data,
            });
        case "square/setStoryId":
            return state.merge({
                storyId: action.data,
            });
        case "square/setCheckWordList":
            return state.merge({
                checkWordList: action.data,
            });
        case "square/setCheckStoryType":
            return state.merge({
                storyType: action.data,
            });
        case "square/setHomeSelectItem":
            return state.merge({
                homeSelectItem: action.data,
            });
        case "square/initChatData":
            return state.merge({
                messages: [],
                canSend: false,
                bottomHeight: 0,
                img: "",
                story: "",
                englishStory: "",
                title: "",
                storyId: "",
                contentAudio: "",
                checkQuestionTag: ''
            });
        case "square/setContentAudio":
            return state.merge({
                contentAudio: action.data,
            });
        case "square/setStoryCreateType":
            return state.merge({
                storyCreateType: action.data,
            });
        case "square/setCheckedQuestion":
            return state.merge({
                checkedQuestion: action.data,
            });
        case "square/deleteCheckedQuestion":
            return state.merge({
                checkedQuestion: "",
            });
        case "square/setLoading":
            return state.merge({
                chatLoading: action.data,
            });
        case "square/setSessionId":
            return state.merge({
                sessionId: action.data,
            });
        case "square/setCheckQuestionTag":
            return state.merge({
                checkQuestionTag: action.data,
            });
        default:
            return state;
    }
};
