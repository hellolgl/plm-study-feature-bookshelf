import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
    ImageBackground,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import RichShowView from "../../../../component/math/RichShowViewHtml";

import { appStyle, appFont } from "../../../../theme";
import fonts from "../../../../theme/fonts";
class ChineseDidExercise extends PureComponent {
    constructor(props) {
        super(props);
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
            page: 1,
            total_page: 0,
            isTestMe: this.props.navigation.state.params.data.isTestMe,
        };
        this.scroll = null;
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (item) => {
        NavigationUtil.toEnglishTextMeWrong({
            ...this.props,
            data: { exercise_id: item.exercise_id },
        });
    };

    checkUnit = (checkIndex) => {
        this.setState({
            nowIndex: ++checkIndex,
        });
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit("renderTestMeHome"); //返回页面刷新
        this.eventListenerRefreshPage.remove();
    }
    componentDidMount() {
        const { isTestMe, has_record } = this.props.navigation.state.params.data;
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backRecordList",
            () => isTestMe && this.getDailyList(1)
        );

        if (!isTestMe) {
            this.getWordsList(1);
            return;
        }
        if (isTestMe && !has_record) {
            this.todoExercise();
        } else {
            this.getDailyList(1);
        }
    }
    todoExercise = () => {
        NavigationUtil.toSynchronizeDiagnosisEn({
            ...this.props,
            data: {
                ...this.props.navigation.state.params.data,
            },
        });
    };
    getWordsList = (page) => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { mode, kpg_type, origin } = this.props.navigation.state.params.data;
        const data = { modular: mode, sub_modular: kpg_type, origin, page };

        // data.modular = this.props.navigation.state.params.data.mode;
        // data.sub_modular = this.props.navigation.state.params.data.kpg_type;
        // data.origin = this.props.navigation.state.params.data.origin;
        // data.page = page;
        // console.log("答题记录", data);
        axios.get(api.getMyStudyRecord, { params: data }).then((res) => {
            let list = res.data.data;

            let time = list.length > 0 ? list[0].create_time : "";
            this.setState(() => ({
                unitList: list,
                time,
                page,
                total_page: res.data.total_page,
            }));
        });
    };
    getDailyList(page) {
        const { origin, ladder } = this.props.navigation.state.params.data;
        const data = {
            page,
            origin,
            ladder,
        };
        axios.get(api.getTestMeExerciseRecord, { params: data }).then((res) => {
            let list = res.data.data;
            let time = list.length > 0 ? list[0].create_time : "";

            this.setState(() => ({
                unitList: list,
                time,
                page,
                total_page: res.data.total_page,
            }));
            this.scroll && this.scroll.scrollTo({ x: 0, y: 0, animated: false });
        });
    }

    renderNormalExercise = () => {
        const { page, unitList } = this.state;
        return unitList.map((item, index) => {
            // console.log("item.private_exercise_stem: ", item.private_exercise_stem)
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.toDoHomework(item)}
                    style={[
                        {
                            width: "100%",
                            backgroundColor: "#fff",
                            marginBottom: pxToDp(32),
                            borderRadius: pxToDp(40),
                        },
                        appStyle.flexJusBetween,
                        padding_tool(20, 40, 20, 40),
                    ]}
                >
                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                        <View
                            style={[
                                size_tool(80),
                                appStyle.flexCenter,
                                {
                                    backgroundColor:
                                        item.correction === "0" ? "#16C792" : "#F2645B",
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
                                {(page - 1) * 10 + index + 1}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <RichShowView
                                width={pxToDp(1420)}
                                value={`<div id="yuanti">${item.private_exercise_stem}</div>`}
                                size={36}
                            ></RichShowView>
                        </View>
                        <View style={[size_tool(100)]}>
                            <Image
                                style={[size_tool(100)]}
                                source={require("../../../../images/chineseHomepage/pingyin/new/next.png")}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };
    renderPage = () => {
        const { page, total_page } = this.state;
        let renturnobj = [];
        for (let i = 1; i <= total_page; i++) {
            renturnobj.push(
                <TouchableOpacity
                    onPress={this.checkpage.bind(this, i)}
                    style={[
                        size_tool(80),
                        appStyle.flexCenter,
                        {
                            borderColor: page === i ? "#864FE3" : "transparent",
                            borderRadius: pxToDp(100),
                            marginRight: pxToDp(pxToDp(32)),
                            borderWidth: pxToDp(8),
                            marginBottom: pxToDp(40),
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: pxToDp(40),
                            color: "#39334C",
                            ...appFont.fontFamily_jcyt_700,
                            lineHeight: pxToDp(40),
                        }}
                    >
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }
        return renturnobj;
    };
    checkpage = (page) => {
        const { isTestMe } = this.state;
        if (isTestMe) {
            this.getDailyList(page);
        } else {
            this.getWordsList(page);
        }
    };
    render() {
        const { isTestMe } = this.props.navigation.state.params.data;
        return (
            <ImageBackground
                source={require("../../../../images/english/sentence/sentenceBg.png")}
                resizeMode="cover"
                style={[
                    ,
                    { flex: 1, position: "relative", paddingTop: 0 },
                    appStyle.flexCenter,
                    // padding_tool(70, 200, 0, 200),
                ]}
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexJusBetween,
                        { width: "100%" },
                        padding_tool(40, 20, 40, 20),
                    ]}
                >
                    <TouchableOpacity onPress={this.goBack} style={[{}]}>
                        <Image
                            source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                        />
                    </TouchableOpacity>
                    <Text style={[fonts.fontFamily_jcyt_700, { fontSize: pxToDp(50) }]}>
                        Record
                    </Text>
                    <View></View>
                </View>

                <View
                    style={[
                        { width: "100%", flex: 1 },
                        borderRadius_tool(40, 40, 0, 0),
                        padding_tool(0, 0, 40, 320),
                        appStyle.flexTopLine,
                    ]}
                >
                    <ScrollView
                        ref={(scrollRef) => (this.scroll = scrollRef)}
                        style={{
                            // height: Dimensions.get("window").height * 0.65,
                            width: "100%",
                        }}
                    >
                        {this.renderNormalExercise()}
                        <Text
                            style={{
                                fontSize: pxToDp(32),
                                color: "#2D3040",
                                textAlign: "center",
                                marginRight: pxToDp(20),
                                marginBottom: pxToDp(80),
                                opacity: 0.5,
                            }}
                        >
                            Record: {this.state.time}
                        </Text>
                    </ScrollView>
                    <View
                        style={[
                            {
                                alignItems: "center",
                                width: pxToDp(320),
                                // paddingBottom: isTestMe ? pxToDp(210) : 0,
                            },
                        ]}
                    >
                        <ScrollView>{this.renderPage()}</ScrollView>
                    </View>
                    {isTestMe ? (
                        <TouchableOpacity
                            onPress={this.todoExercise}
                            style={[
                                size_tool(200),
                                {
                                    position: "absolute",
                                    bottom: pxToDp(80),
                                    right: pxToDp(80),
                                    paddingBottom: pxToDp(6),
                                    backgroundColor: "#10A17B",
                                    borderRadius: pxToDp(200),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    appStyle.flexCenter,
                                    {
                                        flex: 1,
                                        backgroundColor: "#1DD2A3",
                                        borderRadius: pxToDp(200),
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        { fontSize: pxToDp(40), color: "#fff" },
                                    ]}
                                >
                                    Restart
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
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
    header: {
        height: pxToDp(104),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        // marginBottom: pxToDp(40),
        paddingLeft: pxToDp(20),
    },
    titleItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: pxToDp(36),
        width: pxToDp(218),
        height: pxToDp(72),
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    headRight: {},
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
