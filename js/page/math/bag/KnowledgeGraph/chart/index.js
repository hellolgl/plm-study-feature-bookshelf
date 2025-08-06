import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    getIsTablet,
} from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import Chart from "./chart";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import * as _ from "lodash";
import BackBtn from "../../../../../component/math/BackBtn";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import Explain from "../knowProgress/explain";
import AiTalk from "./talk/Modal";
// import AiTalk from "../../../../../component/AiTalk/Modal";
import { chat } from "../../../../../action/knowAiTalk";
import Lottie from "lottie-react-native";
import axiosOld from "axios";

let source = null;

const MathChart = ({ navigation }) => {
    const { token } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { knowStatus } = useSelector((state) => state.toJS().knowAiTalk);
    const dispatch = useDispatch();
    const isTablet = getIsTablet();
    const [itemData, setitemData] = useState([]);
    const [linksData, setlinksData] = useState([]);
    const [show, setshow] = useState(false);
    const [knowName, setknowName] = useState(
        navigation.state.params.data.knowledge_name
    );
    const [name, setname] = useState("");
    const [btnVisible, setbtnVisible] = useState(false);
    const [ruleVisible, setruleVisible] = useState(false);
    const [visible, setvisible] = useState(false);
    const [knowledge, setknowledge] = useState({});
    const [knowledge_explain, setknowledge_explain] = useState("");
    const [chartVisible, setchartVisible] = useState(false);
    const [g_h_id, setg_h_id] = useState(0);
    const [showLoading, setshowLoading] = useState(false);
    const goBack = () => {
        NavigationUtil.goBack({ navigation });
    };
    useEffect(() => {
        groupData(knowName, true);
    }, []);
    const nextLevel = (item) => {
        // console.log("点击的", item, knowName);
        if (item) {
            setname(item);
            setbtnVisible(true);
            setknowledge({
                knowledge_name: name,
            });
        }
    };
    const lookMore = () => {
        groupData(name, false);
        setbtnVisible(false);
    };

    const groupData = async (name, first) => {
        let sendData = {
            name,
            first,
        };
        setshowLoading(true);
        const res = await axios.post(api.getMathGraphKnow, sendData);
        // console.log("获取知识点", sendData, res.data);
        setshowLoading(false);
        if (res.data.err_code === 0) {
            let data = res.data.data;
            let nowname = data.name;
            let node = data.nodes.map((item) => {
                let returnItem =
                    item.name === nowname
                        ? {
                            ...item,
                            symbolSize: pxToDp(360),
                            // category: 1,
                        }
                        : { ...item };
                return returnItem;
            });
            let dataNow = [],
                linksnow = [];
            if (first) {
                dataNow = [...node];
                linksnow = [...data.relation];
                setknowName(nowname);
            } else {
                let alldata = [...itemData, ...node],
                    allLinks = [...linksData, ...data.relation];
                // dataNow = Array.from(new Set(alldata));
                // linksnow = Array.from(new Set(allLinks));
                dataNow = _.uniqBy(alldata, "name");
                linksnow = allLinks;
            }
            // console.log("数据", dataNow, linksnow);
            // if (!first) {
            //   node = node.filter((item) => item.name !== name);
            // } else {
            //   setknowName(nowname);
            // }
            setlinksData(linksnow);
            setitemData(dataNow);
            setshow(true);
        }
    };

    const lookExplain = async () => {
        let params = {
            name,
        };
        setbtnVisible(false);
        setshowLoading(true);
        const res = await axios.get(api.getMathGraphKnowExplain, { params });
        console.log("讲解", res.data);
        setshowLoading(false);
        if (res.data.err_code === 0) {
            let data = res.data.data;
            let knowledgenow = {
                name,
                g_h_id: data.g_h_id,
            };
            setknowledge_explain(data.content);
            setknowledge(knowledgenow);
            setvisible(true);
        }
    };
    const toDoExercise = async () => {
        if (!token) {
            NavigationUtil.resetToLogin({ navigation });
            return;
        }
        // NavigationUtil.toMathKnowChartsAiExercise({
        //   navigation,
        //   data: knowledge,
        // });
        let params = {
            g_h_id: knowledge.g_h_id,
        };

        const res = await axios
            .get(api.getMathGraphKnowRecord, {
                params,
            })
            .catch((err) => console.log("err", err));
        console.log("记录", res.data);
        let data = res.data.data;
        let msglist = [];
        data.forEach((item, index) => {
            msglist.unshift({
                _id: Math.random().toString(36).substring(7),
                text: `${item.answer}\n\n${item.question}`,
                createdAt: new Date(),
                user: {
                    _id: 1,
                },
                exercise: item,
                noClick: true,
            });
            if (item.student_answer) {
                msglist.unshift({
                    _id: Math.random().toString(36).substring(7),
                    text: item.student_answer,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                    },
                    exercise: item,
                });
            }
        });
        msglist.unshift({
            _id: Math.random().toString(36).substring(7),
            text: "...",
            createdAt: new Date(),
            user: {
                _id: 1,
            },
            exercise: {},
        });
        console.log("历史记录", msglist);
        source = axiosOld.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
        const cancelToken = source.token;
        dispatch(chat({ g_h_id: knowledge.g_h_id }, cancelToken));

        dispatch({ type: "knowAiTalk/setHistoryList", data: msglist });
        dispatch({ type: "knowAiTalk/setknowStatus", data: 0 });
        setg_h_id(knowledge.g_h_id);
        setvisible(false);
        setchartVisible(true);
    };
    const closeTalk = () => {
        // groupData(knowledge.name, false);
        // console.log("关闭", source);
        source && source.cancel("组件卸载,取消请求");
        let listnow = itemData.map((item, index) => {
            return {
                ...item,
                category: item.name === knowledge.name ? knowStatus : item.category,
            };
        });
        // console.log("现在的数据", listnow);
        setitemData(listnow);
        setchartVisible(false);
    };
    return (
        <ImageBackground
            style={[{ flex: 1, backgroundColor: "#313758" }]}
            source={
                Platform.OS === "ios" && isTablet
                    ? require("../../../../../images/MathKnowledgeGraph/iosBg.png")
                    : require("../../../../../images/MathKnowledgeGraph/androidBg.png")
            }
            resizeMode="contain"
        >
            <BackBtn goBack={goBack} style={{ zIndex: 2 }}></BackBtn>
            <TouchableOpacity
                style={[styles.ruleBtn]}
                onPress={() => setruleVisible((e) => !e)}
            >
                <Image
                    style={[size_tool(194, 120)]}
                    source={require("../../../../../images/MathKnowledgeGraph/ruleIcon.png")}
                />
            </TouchableOpacity>
            {show ? (
                <Chart data={itemData} links={linksData} nextLevel={nextLevel} />
            ) : null}
            <View
                style={[styles.allbtnWrap, btnVisible && { zIndex: 9, opacity: 1 }]}
            >
                <TouchableWithoutFeedback onPress={() => setbtnVisible(false)}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <View style={[styles.nameWrap]}>
                    <Text style={[styles.nameTxt]}>{name}</Text>
                </View>
                <View style={[appStyle.flexTopLine]}>
                    <TouchableOpacity style={[styles.btnWrap]} onPress={lookExplain}>
                        <View style={[styles.btnInner]}>
                            <Image
                                style={[styles.btnIcon]}
                                source={require("../../../../../images/MathKnowledgeGraph/btnIcon2.png")}
                            />
                            <Text style={[styles.btnTxt]}>练习</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnWrap]} onPress={lookMore}>
                        <View style={[styles.btnInner]}>
                            <Image
                                style={[styles.btnIcon]}
                                source={require("../../../../../images/MathKnowledgeGraph/btnIcon4.png")}
                            />
                            <Text style={[styles.btnTxt]}>拓展</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={[styles.allbtnWrap, ruleVisible && { zIndex: 9, opacity: 1 }]}
            >
                <TouchableWithoutFeedback onPress={() => setruleVisible(false)}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <Image
                    style={[styles.ruleMain]}
                    source={require("../../../../../images/MathKnowledgeGraph/ruleMain.png")}
                />
            </View>
            <Explain
                navigation={navigation}
                knowledge={knowledge}
                visible={visible}
                knowledge_explain={knowledge_explain}
                closeMe={() => setvisible(false)}
                btn={
                    <>
                        <TouchableOpacity onPress={toDoExercise} style={[styles.btnWrap]}>
                            <View style={[styles.btnInner]}>
                                <Image
                                    style={[styles.btnIcon]}
                                    source={require("../../../../../images/MathKnowledgeGraph/btnIcon2.png")}
                                />
                                <Text style={[styles.btnTxt]}>练习</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                }
            />
            <AiTalk
                visible={chartVisible}
                close={closeTalk}
                g_h_id={g_h_id}
                knowledge_name={knowledge.name}
            />
            <View
                style={[
                    styles.click_region,
                    showLoading && { zIndex: 10 },
                    appStyle.flexCenter,
                    { opacity: showLoading ? 1 : 0 },
                ]}
            >
                <Lottie
                    source={{
                        uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-story-loading.json",
                    }}
                    autoPlay
                    style={[
                        { width: pxToDp(200), height: pxToDp(200), marginTop: pxToDp(-5) },
                    ]}
                />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    allbtnWrap: {
        position: "absolute",
        top: pxToDp(0),
        left: pxToDp(0),
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: -1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        // paddingRight: pxToDp(40),
        paddingBottom: pxToDp(108),
        opacity: 0,
    },
    btnWrap: {
        width: pxToDp(280),
        height: pxToDp(128),
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(42),
        backgroundColor: "#00A884",
        marginRight: pxToDp(40),
    },
    btnInner: {
        flex: 1,
        borderRadius: pxToDp(42),
        backgroundColor: "#00C288",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    btnIcon: {
        width: pxToDp(60),
        height: pxToDp(60),
        marginRight: pxToDp(10),
    },
    btnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        color: "#fff",
        lineHeight: pxToDp(40),
    },
    nameWrap: {
        backgroundColor: "#FFC85D",
        borderWidth: pxToDp(4),
        borderColor: "#FFAC4A",
        padding: pxToDp(36),
        paddingTop: pxToDp(0),
        paddingBottom: pxToDp(0),
        borderRadius: pxToDp(36),
        height: pxToDp(72),
        justifyContent: "center",
        marginBottom: pxToDp(54),
        marginRight: pxToDp(36),
    },
    nameTxt: {
        fontSize: pxToDp(44),
        ...appFont.fontFamily_jcyt_700,
        lineHeight: pxToDp(44),
        color: "#22294D",
    },
    click_region: {
        flex: 1,
        backgroundColor: "rgba(71, 82, 102, 0.5)",
        position: "absolute",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: -1,
    },
    ruleBtn: {
        width: pxToDp(192),
        height: pxToDp(120),
        position: "absolute",
        top: pxToDp(Platform.OS === "ios" ? 60 : 0),
        right: pxToDp(0),
        zIndex: 10,
    },
    ruleMain: {
        width: pxToDp(366),
        height: pxToDp(244),
        position: "absolute",
        right: pxToDp(32),
        top: pxToDp(122),
    },
    loadingWrap: {},
});
export default MathChart;
