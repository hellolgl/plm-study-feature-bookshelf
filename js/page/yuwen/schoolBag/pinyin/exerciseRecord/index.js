import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    DeviceEventEmitter,
    Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    padding_tool,
    pxToDp,
    size_tool,
    pxToDpHeight,
    borderRadius_tool,
} from "../../../../../util/tools";
// import RichShowView from "../../../../../component/richShowViewNew";
import RichShowView from "../../../../../component/chinese/newRichShowView";

import { appFont, appStyle } from "../../../../../theme";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";


const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseDidExercise extends PureComponent {
    constructor(props) {
        super(props);
        let language_data = props.language_data.toJS();
        const { main_language_map, other_language_map, type, show_type } =
            language_data;
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            topicMap: new Map(),
            status: 0,
            gifUrl: "",
            classList: {},
            nowIndex: -1,
            unitList: [],
            time: "",
            language_data,
            nowindex: 1,
            testTxt: {
                main: main_language_map.test,
                other: other_language_map.test,
                pinyin: pinyin.test,
            },
            recordTxt: {
                main: main_language_map.exerciseRocord,
                other: other_language_map.exerciseRocord,
                pinyin: pinyin.exerciseRocord,
            },
            hasStatus: false,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (item) => {
        NavigationUtil.toChinesePinyinDoWrongExercise({
            ...this.props,
            data: { ...item },
        });
    };

    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit("backCheckType"); //返回页面刷新
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backRecordList",
            () => this.getlist()
        );
        if (
            this.props.navigation.state.params.data.status ||
            this.props.navigation.state.params.data.type === "diary"
        ) {
            this.getlist();
        } else {
            NavigationUtil.toChinesePinyinDoExercise({
                ...this.props,
                data: this.props.navigation.state.params.data,
            });
            return;
        }
    }

    todoexercise = () => {
        NavigationUtil.toChinesePinyinDoExercise({
            ...this.props,
            data: this.props.navigation.state.params.data,
        });
    };
    getlist() {
        const data = {};
        if (this.props.navigation.state.params.data.type === "diary") {
            data.exercise_origin =
                this.props.navigation.state.params.data.exercise_origin;
            data.exercise_set_id =
                this.props.navigation.state.params.data.exercise_set_id;
        } else {
            data.p_id = this.props.navigation.state.params.data.p_id;
        }
        console.log("参数", data);
        axios
            .get(api.chinesePinyinGetExerciserecord, { params: data })
            .then((res) => {
                if (res.data.err_code === 0) {
                    console.log("res.data list", res.data);
                    //
                    this.setState(() => ({
                        unitList: res.data.data.length > 0 ? res.data.data : [],
                        time: res.data.data.length > 0 ? res.data.data[0].create_time : "",
                    }));
                }
            });
    }

    renderNormalExercise = () => {
        const { language_data, unitList } = this.state;

        const { show_main, show_translate, main_language } = language_data;
        return unitList.map((item, index) => {
            // let stem =
            //     item.exercise_type_private === "3"
            //         ? `${item.stem}${show_translate ? item.translate_stem.en : ""}`
            //         : `${item.private_exercise_stem}${show_translate ? item.translate_stem.en : ""
            //         }`;
            // stem = stem.replaceAll("<rt>", "<rt>&nbsp;");
            // stem = stem.replaceAll("</rt>", "&nbsp;<rt>");
            const stem = item.exercise_type_private === "3" ? item.stem : item.private_exercise_stem
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.toDoHomework(item)}
                    style={[
                        {
                            width: "100%",
                            // minHeight: pxToDp(267),
                            // backgroundColor: "#fff",
                            marginBottom: pxToDp(32),
                            // flexDirection: 'row',
                            borderRadius: 8,
                            justifyContent: "space-between",
                            // alignItems: 'center',
                            paddingLeft: pxToDp(40),
                            paddingRight: pxToDp(40),
                            // paddingTop: 12,
                            paddingBottom: pxToDp(50),
                        },
                        appStyle.flexJusBetween,
                        // appStyle.flexLine,
                    ]}
                >
                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                        <View
                            style={[
                                size_tool(80),
                                appStyle.flexCenter,
                                {
                                    backgroundColor: item.correct === "1" ? "#16C792" : "#F2645B",
                                    borderRadius: pxToDp(40),
                                    marginRight: pxToDp(20),
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    { fontSize: pxToDp(36), color: "#fff" },
                                    fonts.fontFamily_jcyt_700,
                                ]}
                            >
                                {index + 1}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <RichShowView
                                width={pxToDp(1420)}
                                value={`<div id="yuanti">${stem}</div>`}
                                size={2}
                            ></RichShowView>
                            {show_translate ? <Text style={[{ fontSize: pxToDpHeight(50) }, appFont.fontFamily_syst]}>{item.translate_stem.en.replace(/<[^>]+>/g, '')}</Text> : null}
                        </View>
                        <View style={[size_tool(100)]}>
                            <Image
                                style={[size_tool(100)]}
                                source={require("../../../../../images/chineseHomepage/pingyin/new/next.png")}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    render() {
        const { language_data, testTxt, hasStatus, recordTxt, unitList } =
            this.state;

        const { show_main, show_translate, main_language } = language_data;
        return (
            <ImageBackground
                source={
                    Platform.OS === "ios"
                        ? require("../../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png")
                        : require("../../../../../images/chineseHomepage/pingyin/new/wrapBg.png")
                }
                style={[
                    ,
                    {
                        flex: 1,
                        position: "relative",
                        paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={this.goBack}
                    style={[
                        {
                            position: "absolute",
                            top: pxToDp(48),
                            left: pxToDp(48),
                            zIndex: 99999,
                        },
                    ]}
                >
                    <Image
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                        style={[size_tool(120, 80)]}
                    />
                </TouchableOpacity>
                <View style={[{ flex: 1 }, padding_tool(80, 200, 80, 200)]}>
                    <View
                        style={[
                            {
                                flex: 1,
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(80),
                                padding: pxToDp(60),
                            },
                            appStyle.flexAliCenter,
                        ]}
                    >
                        <View style={{ width: "100%", flex: 1 }}>

                            <ScrollView style={{ paddingBottom: pxToDp(80), flex: 1 }}>
                                <View style={[appStyle.flexAliCenter, { width: "100%" }]}>
                                    {show_main && main_language === "zh" ? (
                                        <Text style={[styles.pinyinFont]}>{recordTxt.pinyin}</Text>
                                    ) : null}
                                    {show_main ? (
                                        <Text style={[styles.mainFont, { color: "#4C4C59" }]}>
                                            {recordTxt.main}
                                        </Text>
                                    ) : null}
                                    {show_translate ? (
                                        <Text
                                            style={[
                                                styles.tranFont,
                                                { opacity: 0.5, color: "#4C4C59" },
                                            ]}
                                        >
                                            {recordTxt.other}
                                        </Text>
                                    ) : null}
                                    {unitList.length > 0 ? this.renderNormalExercise() : null}
                                    <Text
                                        style={{
                                            fontSize: pxToDp(32),
                                            color: "#999999",
                                            marginBottom: pxToDp(32),
                                        }}
                                    >
                                        {this.state.time}
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                        {this.props.navigation.state.params.data.type === "diary" ? null : (
                            <TouchableOpacity
                                onPress={this.todoexercise}
                                style={[
                                    {
                                        position: "absolute",
                                        right: pxToDp(40),
                                        bottom: pxToDp(40),
                                        zIndex: 999,
                                    },
                                ]}
                            >
                                <ImageBackground
                                    style={[size_tool(240), appStyle.flexCenter]}
                                    source={
                                        hasStatus
                                            ? require("../../../../../images/chineseHomepage/pingyin//new/pinyintestMeBg1.png")
                                            : require("../../../../../images/chineseHomepage/pingyin//new/testMeBg.png")
                                    }
                                >
                                    {show_main && main_language === "zh" ? (
                                        <Text style={[styles.pinyinFont, { color: "#fff" }]}>
                                            {testTxt.pinyin}
                                        </Text>
                                    ) : null}
                                    {show_main ? (
                                        <Text style={[styles.mainFont, { color: "#fff" }]}>
                                            {testTxt.main}
                                        </Text>
                                    ) : null}
                                    {show_translate ? (
                                        <Text
                                            style={[styles.tranFont, { opacity: 0.5, color: "#fff" }]}
                                        >
                                            {testTxt.other}
                                        </Text>
                                    ) : null}
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        height: 570,
    },
    con: {
        flexDirection: "row",
        paddingLeft: pxToDp(48),
        paddingRight: pxToDp(48),
        height: "100%",
    },
    mainFont: {
        fontSize: pxToDp(56),
        color: "#475266",
        ...fonts.fontFamily_jcyt_500,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(70),
    },
    tranFont: {
        fontSize: pxToDp(40),
        color: "#475266",
        ...fonts.fonts_pinyin,
        marginRight: pxToDp(4),
        marginBottom: pxToDp(10),
    },
    pinyinFont: {
        fontSize: pxToDp(40),
        color: "#475266",
        ...fonts.fonts_pinyin,
        marginRight: pxToDp(4),
        // lineHeight: pxToDp(56)
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
