import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView,
    Platform,
    SafeAreaView,
    DeviceEventEmitter,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import {
    pxToDp,
    padding_tool,
    size_tool,
    pxToDpHeight,
    getIsTablet,
} from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import * as _ from "lodash";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import BackBtn from "../../../../../component/math/BackBtn";
import Explain from "./explain";
import Rule from "./rule";
import * as language from "../../../../../util/languageConfig/chinese";
import Tts from "react-native-tts";

const gradeMap = {
    "01": "一年级",
    "02": "二年级",
    "03": "三年级",
    "04": "四年级",
    "05": "五年级",
    "06": "六年级",
};
const MathChart = ({ navigation }) => {
    const { textBookCode } = useSelector((state) => state.toJS().bagMath);
    const { knowledge_code } = navigation.state.params.data;
    const [list, setlist] = useState([]);
    const [knowledge, setknowledge] = useState({});
    const [visible, setvisible] = useState(false);
    const [knowledge_explain, setknowledge_explain] = useState("");
    const [total, settotal] = useState(0);
    const [showRule, setshowRule] = useState(false);
    const [badge_arr, setbadge_arr] = useState([]);
    const isTablet = getIsTablet();
    useEffect(() => {
        // console.log("Echarts", navigation);
        const eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshProgress",
            (data) => {
                getData();
            }
        );
        getData();
        return () => {
            eventListenerRefreshPage.remove();
        };
    }, []);
    const stopRead = () => {
        Tts.stop();
    };
    const goBack = () => {
        NavigationUtil.goBack({ navigation });
    };
    const getData = async () => {
        let params = {
            knowledge_code,
            // language: trans_language,
            textbook: textBookCode,
        };
        const res = await axios.get(api.getMathKGElementTimeLine, { params });
        console.log("数据", res.data.data);
        console.log("语言", language);
        let data = res.data.data;
        let listnow = [];
        let starnum = 0;
        data.forEach((item) => {
            listnow.push(
                ...item.children.map((i) => {
                    i.status === 1 && starnum++;
                    return {
                        ...i,
                        grade_code: item.grade_code,
                    };
                })
            );
        });
        // console.log("最终数据", listnow);
        setlist(listnow);
        settotal(starnum);
    };
    const showExplain = async (item) => {
        // let params = {
        //   knowledge_code,
        // };
        // const res = await axios.get(api.getMathKGElementExplain, { params });
        // console.log("讲解", res.data);
        const { knowledge_code } = item;
        let params = {
            knowledge_code,
        };
        const res = await axios.get(api.getMathKGElementExplain, { params });
        setknowledge_explain(res.data.data.knowledge_explain);
        setknowledge(item);
        setvisible(true);
    };
    const toDoExercise = () => {
        stopRead();
        setvisible(false);
        const { swiperIndex, current_unit } = navigation.state.params.data
        NavigationUtil.toKnowledgeGraphExplainDoExercise({
            navigation,
            data: {
                ...knowledge,
                swiperIndex,
                current_unit,
            },
        });
    };

    const toMore = () => {
        setvisible(false);
        stopRead();
        NavigationUtil.toMathKnowCharts({
            navigation,
            data: {
                knowledge_name: knowledge.knowledge_name
                // ...navigation.state.params.data,
                // ...knowledge,
            },
        });
    };

    const renderLine = () => {
        let renderdom = list.map((item, index) => {
            return index < list.length - 1 ? (
                <Image
                    key={index}
                    source={
                        index % 2 === 0
                            ? require("../../../../../images/aiGiveExercise/line_down.png")
                            : require("../../../../../images/aiGiveExercise/line_top.png")
                    }
                    style={[size_tool(456, 120), {}]}
                />
            ) : null;
        });
        return renderdom;
    };
    const renderItem = () => {
        let renderDom = list.map((item, index) => {
            let bg = require("../../../../../images/MathKnowledgeGraph/noData.png"),
                color = "#22294D",
                star = null;
            switch (item.status) {
                case 1:
                    star = require("../../../../../images/MathKnowledgeGraph/star2.png");
                    // starNum++;
                    break;
                case 0:
                    star = require("../../../../../images/MathKnowledgeGraph/star1.png");
                    break;
                default:
                    color = "#7F7F7F";
                    break;
            }
            if (item.status !== -1) {
                let num = Number(item.rate);
                switch (true) {
                    case num >= 90:
                        bg = require("../../../../../images/MathKnowledgeGraph/itemBg1.png");
                        break;
                    case num < 90 && num >= 60:
                        bg = require("../../../../../images/MathKnowledgeGraph/itemBg2.png");
                        break;
                    default:
                        bg = require("../../../../../images/MathKnowledgeGraph/itemBg3.png");
                        break;
                }
            }
            // let grade = item.grade_code.slice(0, 2);
            let grade = item.grade_code;
            return (
                <View
                    key={index}
                    style={[
                        appStyle.flexCenter,
                        { width: pxToDp(440) },
                        index % 2 === 0
                            ? { paddingBottom: pxToDp(120) }
                            : { paddingTop: pxToDp(140) },
                    ]}
                >
                    {index % 2 === 0 ? (
                        <Text style={[styles.titleTxt]}>{item.knowledge_name}</Text>
                    ) : null}
                    <TouchableOpacity
                        style={[{ zIndex: 9, marginBottom: pxToDp(8) }]}
                        // onPress={this.toDoExercise.bind(this, item)}
                        onPress={showExplain.bind(this, item)}
                    >
                        <ImageBackground
                            source={bg}
                            style={[size_tool(305), appStyle.flexCenter, ,]}
                        >
                            {star ? <Image source={star} style={[styles.itemStar]} /> : null}
                            <Text
                                style={[
                                    {
                                        color: color,
                                        fontSize: pxToDp(56),
                                        lineHeight: pxToDp(56),
                                        marginBottom: pxToDp(10),
                                    },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >{`${item.rate}${item.status === -1 ? "" : "%"}`}</Text>
                            <Text
                                style={[
                                    {
                                        color: color,
                                        fontSize: pxToDp(28),
                                        lineHeight: pxToDp(28),
                                    },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {item.status === -1 ? "未作答" : "综合正确率"}
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    {index % 2 === 1 ? (
                        <Text style={[styles.titleTxt]}>{item.knowledge_name}</Text>
                    ) : null}
                    <View style={[styles.gradeWrap]}>
                        <Text style={[styles.gradeTxt]}>{language.default[grade]}</Text>
                    </View>
                </View>
            );
        });
        return renderDom;
    };
    return (
        <ImageBackground
            style={[styles.container]}
            source={
                Platform.OS === "ios" && isTablet
                    ? require("../../../../../images/MathKnowledgeGraph/iosBg.png")
                    : require("../../../../../images/MathKnowledgeGraph/androidBg.png")
            }
            resizeMode="contain"
        >
            <View style={[styles.headerWrap]}>
                <BackBtn goBack={goBack} style={[styles.backbtn]}></BackBtn>
                <Text style={[styles.headerTxt]}>时间线</Text>
                <TouchableOpacity
                    onPress={() => setshowRule(true)}
                    style={[styles.ruleWrap]}
                >
                    <Image
                        style={[size_tool(60)]}
                        source={require("../../../../../images/MathKnowledgeGraph/badge_icon_1.png")}
                    />
                    <Text style={[styles.ruleTxt]}>x{total}</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.mainWrap]}>
                <SafeAreaView style={[{ flex: 1 }]}>
                    <ScrollView
                        horizontal={true}
                        style={[{ flex: 1, position: "relative" }]}
                        contentContainerStyle={styles.right_contentContainerStyle}
                    >
                        <View
                            style={[
                                { position: "absolute", left: pxToDp(200), zIndex: 0 },
                                appStyle.flexTopLine,
                            ]}
                        >
                            {renderLine()}
                        </View>
                        {renderItem()}
                    </ScrollView>
                </SafeAreaView>
            </View>
            <Explain
                navigation={navigation}
                knowledge={knowledge}
                visible={visible}
                knowledge_explain={knowledge_explain}
                closeMe={() => setvisible(false)}
                isRich={true}
                btn={
                    <>
                        <TouchableOpacity onPress={toMore} style={[styles.btnWrap]}>
                            <View style={[styles.btnInner]}>
                                <Image
                                    style={[styles.btnIcon]}
                                    source={require("../../../../../images/MathKnowledgeGraph/btnIcon3.png")}
                                />
                                <Text style={[styles.btnTxt]}>拓展</Text>
                            </View>
                        </TouchableOpacity>
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
            <Rule
                show={showRule}
                close={() => {
                    setshowRule(false);
                }}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#313758",
    },
    mainWrap: {
        flex: 1,
        paddingLeft: pxToDp(36),
        // padding: pxToDp(60),
    },
    headerWrap: {
        height: pxToDp(Platform.OS === "ios" ? 160 : 120),
        backgroundColor: "#4352A7",
        borderBottomColor: "#22294D",
        borderBottomWidth: pxToDp(8),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: pxToDp(60),
    },
    headerTxt: {
        fontSize: pxToDp(40),
        color: "#FFFFFF",
        ...appFont.fontFamily_jcyt_700,
        lineHeight: pxToDp(40),
    },
    right_contentContainerStyle: {
        ...appStyle.flexLine,
    },
    titleTxt: {
        fontSize: pxToDp(32),
        color: "#fff",
        ...appFont.fontFamily_jcyt_700,
        marginBottom: pxToDp(20),
    },
    itemStar: {
        ...size_tool(72),
        position: "absolute",
        top: pxToDp(20),
        right: pxToDp(20),
        transform: [
            {
                rotateZ: "15deg",
            },
        ],
    },
    gradeWrap: {
        width: pxToDp(270),
        height: pxToDp(72),
        borderRadius: pxToDp(52),
        backgroundColor: "#FFC85D",
        borderColor: "#FFAC4A",
        borderWidth: pxToDp(4),
        justifyContent: "center",
        alignItems: "center",
    },
    gradeTxt: {
        fontSize: pxToDp(32),
        color: "#22294D",
        lineHeight: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
    },
    ruleWrap: {
        position: "absolute",
        right: pxToDp(40),
        flexDirection: "row",
        alignItems: "center",
    },
    ruleTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        lineHeight: pxToDp(40),
        color: "#fff",
        marginLeft: pxToDp(10),
    },
    btnWrap: {
        width: pxToDp(280),
        height: pxToDp(128),
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(42),
        backgroundColor: "#00A884",
        marginBottom: pxToDp(36),
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
});
export default MathChart;
