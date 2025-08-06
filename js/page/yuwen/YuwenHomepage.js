import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import NavigationUtil from "../../navigator/NavigationUtil";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    ChangeRichToTxt,
} from "../../util/tools";
import { appFont, appStyle } from "../../theme";
import Header from "../../component/Header";
import OtherUserInfo from "../../component/otherUserinfo";
import NewRichShowView from "../../component/chinese/newRichShowView";
import { Toast } from "antd-mobile-rn";
import ChangeDeskSubject from '../../component/homepage/changeDeskSubject'
import MathNavigationUtil from "../../navigator/NavigationMathUtil";

class YuwenHomePage extends PureComponent {
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
            checkIndex: 0,
            leftNavList: [
                {
                    text: "我的练习",
                    isActive: true,
                },
                {
                    text: "历史记录",
                    isActive: false,
                },
                {
                    text: "错题集",
                    isActive: false,
                },
            ],
            historyList: [],
            historyIndex: 0,
            wrongType: [
                {
                    title: "今日错题",
                    value: "1",
                },
                {
                    title: "本周错题",
                    value: "2",
                },
                {
                    title: "本月错题",
                    value: "3",
                },
                {
                    title: "本学期错题",
                    value: "4",
                },
            ],
            wrongExerciseList: [],
            checkWrongType: "",
            wrongPage: 1,
            wrongTotalPage: 1,
            titleList: ["我的作业", "查看历史", "我的错题"],
            show: false
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (exercise) => {
        NavigationUtil.toYuwenOrMathOrEng(
            {
                ...this.props,
                exercise_origin: exercise,
                data: {
                    updata: () => {
                        this.updataData();
                    },
                },
            },
            "YuwenCanvas"
        );
    };

    getData = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "01";
        axios.post(api.getChineseTodayExerciseList, data).then((res) => {
            let list = res.data.data;
            //console.log("list", list);
            this.setState(() => ({
                fromServeCharacterList: [...list],
                topaicNum: list.length,
                checkIndex: 0,
            }));
        });
    };

    updataData = () => {
        //console.log('MathHomepage updata')
        this.getData();
    };

    componentDidMount() {
        this.getData();
    }
    checkThis = (index) => {
        let leftNavList = [];
        leftNavList = leftNavList.concat(this.state.leftNavList);
        leftNavList.forEach((i) => {
            i.isActive = false;
        });
        leftNavList[index].isActive = true;

        if (index === 0) {
            this.getData();
        }
        if (index === 2) {
            this.getHomeWorkWrong("1", 1);
        }
        if (index === 1) {
            this.getHomeWork();
        }
        this.setState({
            historyIndex: 0,
            checkWrongType: "1",
            checkIndex: index,
            fromServeCharacterList: [],
        });
    };
    getHomeWork = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        axios
            .get(api.getChineseMyDescHistory, {
                params: {
                    grade_code: userInfoJs.checkGrade,
                    term_code: userInfoJs.checkTeam,
                },
            })
            .then((res) => {
                let list = res.data.data;
                this.setState(() => ({
                    historyList: [...list],
                    checkIndex: 1,
                    fromServeCharacterList: list[0] ? list[0].data : [],
                    historyIndex: 0,
                }));
            });
    };
    getHomeWorkWrong = (type, page) => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        if (page < 1) {
            Toast.info("已经在第一页啦！", 1);
            return;
        }
        if (page > this.state.wrongTotalPage) {
            Toast.info("已经在最后一页啦！", 1);
            return;
        }
        axios
            .get(api.getChineseMyDescHistoryWrong, {
                params: {
                    grade_code: userInfoJs.checkGrade,
                    term_code: userInfoJs.checkTeam,
                    exercise_time: type, //(今日，本周，本月，本学期)
                    page,
                },
            })
            .then((res) => {
                console.log("返回来", res.data.data.data.length);
                this.setState(() => ({
                    checkIndex: 2,
                    page,
                    wrongExerciseList: res.data.data.data,
                    wrongTotalPage:
                        Math.ceil(res.data.data?.page_info.total / 10) > 0
                            ? Math.ceil(res.data.data?.page_info.total / 10)
                            : 1,
                    checkWrongType: type,
                }));
            });
    };

    lookHistory = (index) => {
        console.log(index);
        this.setState({
            historyIndex: index,
            fromServeCharacterList: this.state.historyList[index].data,
        });
    };
    lookAllHistory = (item) => {
        NavigationUtil.toChineseDidExercise({
            ...this.props,
            data: {
                ...item,
                type: "desc",
            },
        });
    };

    lookExercise = (item) => {
        NavigationUtil.toDoWrongExercise({
            ...this.props,
            data: { ...item },
        });
    };
    renderContent = () => {
        const { checkIndex, fromServeCharacterList } = this.state;
        console.log(fromServeCharacterList);
        let html = <Text style={[{ fontSize: pxToDp(28) }]}>加载中...</Text>;
        if (checkIndex === 0) {
            html = fromServeCharacterList.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            {
                                backgroundColor: "#D8E2F4",
                                height: pxToDp(371),
                                width: pxToDp(1600),
                                marginBottom: pxToDp(40),
                            },
                            borderRadius_tool(60),
                            padding_tool(0, 0, 10, 0),
                        ]}
                        onPress={() => this.toDoHomework(item)}
                    >
                        <View
                            style={[
                                { flex: 1, backgroundColor: "#fff", padding: pxToDp(60) },
                                borderRadius_tool(60),
                                appStyle.flexTopLine,
                                appStyle.flexAliCenter,
                            ]}
                        >
                            <View style={[{ flex: 1 }]}>
                                <Text
                                    style={{
                                        color: "#445268",
                                        fontSize: pxToDp(60),
                                        marginRight: pxToDp(12),
                                        ...appFont.fontFamily_syst_bold,
                                        lineHeight: pxToDp(70),
                                    }}
                                >
                                    {item.learning_point} {item.homework_name}
                                </Text>
                                <Text
                                    style={{
                                        color: "#A2A8B4",
                                        fontSize: pxToDp(28),
                                        ...appFont.fontFamily_jcyt_500,
                                        marginBottom: pxToDp(30),
                                    }}
                                >
                                    发送人：{item.name}
                                </Text>
                                <View
                                    style={[
                                        {
                                            width: pxToDp(256),
                                            height: pxToDp(82),
                                            borderRadius: pxToDp(80),
                                            backgroundColor: "#FFE7B3",
                                            ...appStyle.flexLine,
                                            paddingLeft: pxToDp(20),
                                            ...appStyle.flexCenter,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            item.exist_amount === item.total
                                                ? styles.numberFinish
                                                : styles.number,
                                            { marginRight: pxToDp(10) },
                                        ]}
                                    >
                                        练习
                                    </Text>
                                    <Text
                                        style={[
                                            item.exist_amount === item.total
                                                ? styles.numberFinish
                                                : styles.number,
                                        ]}
                                    >
                                        {item.exist_amount + "/" + item.total}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    size_tool(280, 120),
                                    borderRadius_tool(40),
                                    { backgroundColor: "#FF731C", paddingBottom: pxToDp(8) },
                                ]}
                            >
                                <View
                                    style={[
                                        { flex: 1, backgroundColor: "#FF964A" },
                                        appStyle.flexCenter,
                                        borderRadius_tool(40),
                                    ]}
                                >
                                    <Text
                                        style={[
                                            { fontSize: pxToDp(32), color: "#fff" },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        去完成
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
        if (fromServeCharacterList && fromServeCharacterList.length === 0) {
            return this.renderNoData("等待老师发送练习中...");
        }
        return (
            <ScrollView>
                <View style={[appStyle.flexAliCenter, { paddingTop: pxToDp(80) }]}>
                    {html}
                </View>
            </ScrollView>
        );
    };

    renderHistory = () => {
        const { historyList, fromServeCharacterList, historyIndex } = this.state;
        // console.log("renderHistory", historyList);
        if (fromServeCharacterList && fromServeCharacterList.length === 0) {
            return this.renderNoData("等待完成作业。。。");
        }
        return (
            <View
                style={[
                    { flex: 1, height: "100%" },
                    appStyle.flexTopLine,
                    padding_tool(62, 42, 0, 52),
                ]}
            >
                <View style={[{ marginRight: pxToDp(34) }]}>
                    <ScrollView>
                        {historyList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        size_tool(320, 120),
                                        borderRadius_tool(30),
                                        {
                                            backgroundColor:
                                                index === historyIndex ? "#EDEDF5" : "transparent",
                                            paddingBottom: pxToDp(10),
                                            marginBottom: pxToDp(50),
                                        },
                                    ]}
                                    onPress={this.lookHistory.bind(this, index)}
                                >
                                    <View
                                        style={[
                                            {
                                                flex: 1,
                                                backgroundColor:
                                                    index === historyIndex ? "#fff" : "transparent",
                                                borderRadius: pxToDp(30),
                                            },
                                            appStyle.flexCenter,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { fontSize: pxToDp(42), color: "#445268" },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            {item.create_time.slice(0, 10)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View
                    style={[
                        { flex: 1, width: "100%", backgroundColor: "#fff" },
                        padding_tool(25),
                        borderRadius_tool(40, 40, 0, 0),
                    ]}
                >
                    <ScrollView>
                        {fromServeCharacterList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        {
                                            height: pxToDp(360),
                                            width: "100%",
                                            backgroundColor: index % 2 === 0 ? "#fff" : "#F4F5F8",
                                        },
                                        appStyle.flexTopLine,
                                        appStyle.flexJusBetween,
                                        appStyle.flexAliCenter,
                                        padding_tool(40),
                                        borderRadius_tool(30),
                                    ]}
                                    onPress={this.lookAllHistory.bind(this, item)}
                                >
                                    <View
                                        style={[
                                            {
                                                height: "100%",
                                                padding: pxToDp(8),
                                                borderRadius: pxToDp(8),
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: pxToDp(66),
                                                    lineHeight: pxToDp(76),
                                                    color: "#445268",
                                                },
                                                appFont.fontFamily_syst_bold,
                                            ]}
                                        >
                                            {item.lesson_name} {item.homework_name}
                                        </Text>
                                        <Text
                                            style={[
                                                appFont.fontFamily_jcyt_500,
                                                {
                                                    color: "#A2A8B4",
                                                    fontSize: pxToDp(30),
                                                    marginBottom: pxToDp(50),
                                                },
                                            ]}
                                        >
                                            {item.create_time?.split(" ")[0]}
                                        </Text>
                                        <View
                                            style={[
                                                appStyle.flexTopLine,
                                                size_tool(570, 80),
                                                { backgroundColor: "#FFE7B3" },
                                                padding_tool(15, 30, 15, 30),
                                                borderRadius_tool(40),
                                                appStyle.flexAliCenter,
                                                appStyle.flexJusBetween,
                                            ]}
                                        >
                                            <View style={[styles.historyTextMain]}>
                                                <Text
                                                    style={[styles.historyTxt1, { color: "#FF8F32" }]}
                                                >
                                                    练习 {item.total}/{item.total}
                                                </Text>
                                            </View>
                                            <View style={[styles.historyTextMain]}>
                                                <Image
                                                    source={require("../../images/english/homework/rightFirst.png")}
                                                    style={[size_tool(118, 50)]}
                                                />
                                                <Text
                                                    style={[
                                                        styles.historyTxt1,
                                                        { color: "#00C892", marginLeft: pxToDp(8) },
                                                    ]}
                                                >
                                                    : {item.right_total}
                                                </Text>
                                            </View>
                                            <View style={[styles.historyTextMain]}>
                                                <Image
                                                    source={require("../../images/english/homework/wrong.png")}
                                                    style={[size_tool(50)]}
                                                />
                                                <Text
                                                    style={[styles.historyTxt1, { color: "#FF7664" }]}
                                                >
                                                    {" "}
                                                    : {item.wrong_total}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View
                                        style={[
                                            size_tool(189, 80),
                                            borderRadius_tool(40),
                                            appStyle.flexCenter,
                                            { marginRight: pxToDp(150) },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { fontSize: pxToDp(34), color: "#4B95F7" },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            查看详情
                                        </Text>
                                    </View>
                                    <Image
                                        source={require("../../images/desk/icon_4.png")}
                                        style={[size_tool(152)]}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    };

    renderWrong = () => {
        const {
            wrongType,
            wrongExerciseList,
            page,
            wrongTotalPage,
            checkWrongType,
        } = this.state;
        return (
            <View
                style={[
                    { flex: 1, height: "100%" },
                    appStyle.flexTopLine,
                    padding_tool(60, 60, 40, 60),
                ]}
            >
                <View style={[appStyle.flexJusBetween, padding_tool(60, 0, 60, 0), {}]}>
                    {wrongType.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    size_tool(382, 120),
                                    borderRadius_tool(30),
                                    {
                                        height: Platform.OS === "ios" ? pxToDp(200) : pxToDp(120),
                                        backgroundColor:
                                            checkWrongType === item.value ? "#D8E2F4" : "transparent",
                                        paddingBottom: pxToDp(10),
                                    },
                                ]}
                                onPress={this.getHomeWorkWrong.bind(this, item.value, 1)}
                            >
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            backgroundColor:
                                                checkWrongType === item.value ? "#fff" : "transparent",
                                        },
                                        borderRadius_tool(30),
                                        appStyle.flexCenter,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                fontSize: pxToDp(50),
                                                color: "#445268",
                                                lineHeight:
                                                    Platform.OS === "ios" ? pxToDp(60) : pxToDp(50),
                                            },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {wrongExerciseList && wrongExerciseList.length > 0 ? (
                    <View style={[{ flex: 1 }, padding_tool(0, 45, 0, 45)]}>
                        <View
                            style={[
                                { flex: 1, backgroundColor: "#fff", borderRadius: pxToDp(60) },
                                padding_tool(20, 36, 20, 36),
                            ]}
                        >
                            <ScrollView>
                                {wrongExerciseList.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                {
                                                    minHeight: pxToDp(138),
                                                    width: pxToDp(1400),
                                                    backgroundColor:
                                                        index % 2 === 0 ? "transparent" : "#F4F5F8",
                                                },
                                                appStyle.flexTopLine,
                                                appStyle.flexJusBetween,
                                                appStyle.flexAliCenter,
                                                padding_tool(40),
                                                borderRadius_tool(12),
                                            ]}
                                        >
                                            <View style={[{ flex: 1, marginRight: pxToDp(40) }]}>
                                                <Text
                                                    style={[
                                                        {
                                                            fontSize: pxToDp(30),
                                                            color: "#A2A8B4",
                                                            marginBottom: pxToDp(20),
                                                        },
                                                    ]}
                                                >
                                                    {item.operate_time?.split(" ")[0]}
                                                </Text>
                                                <Text></Text>
                                                {/* <RichShowView
                      size={70}
                      value={item.private_exercise_stem} width={pxToDp(1100)}></RichShowView> */}
                                                {/* <RichShowView
                        value={
                          item.private_exercise_stem
                            ? `<div id="jiangchengyuanti">${item.private_exercise_stem}</div>`
                            : ""
                        }
                        size={Platform.OS === "ios" ? 50 : 40}
                      ></RichShowView> */}
                                                <Text style={[styles.itemTxt]}>
                                                    {ChangeRichToTxt(item.private_exercise_stem)}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[
                                                    size_tool(280, 120),
                                                    borderRadius_tool(40),
                                                    {
                                                        backgroundColor: "#FF731C",
                                                        paddingBottom: pxToDp(10),
                                                    },
                                                ]}
                                                onPress={this.lookExercise.bind(this, item)}
                                            >
                                                <View
                                                    style={[
                                                        appStyle.flexCenter,
                                                        { flex: 1, backgroundColor: "#FF964A" },
                                                        borderRadius_tool(40),
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            { fontSize: pxToDp(34), color: "#fff" },
                                                            appFont.fontFamily_jcyt_700,
                                                        ]}
                                                    >
                                                        练习
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexCenter,
                                    { paddingTop: pxToDp(20) },
                                ]}
                            >
                                <View
                                    style={[
                                        size_tool(256, 80),
                                        appStyle.flexCenter,
                                        { backgroundColor: "#D8E2F4", borderRadius: pxToDp(60) },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            { fontSize: pxToDp(32), color: "#445268" },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        页码: {page}/{wrongTotalPage}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={this.getHomeWorkWrong.bind(
                                this,
                                checkWrongType,
                                page - 1
                            )}
                            style={[
                                {
                                    position: "absolute",
                                    top: "50%",
                                    marginTop: pxToDp(-45),
                                },
                            ]}
                        >
                            <Image
                                source={require("../../images/chineseHomepage/desc/nextPage.png")}
                                style={[Platform.OS === "ios" ? size_tool(120) : size_tool(90)]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.getHomeWorkWrong.bind(
                                this,
                                checkWrongType,
                                page + 1
                            )}
                            style={[
                                {
                                    position: "absolute",
                                    top: "50%",
                                    right: 0,
                                    marginTop: pxToDp(-45),
                                },
                            ]}
                        >
                            <Image
                                source={require("../../images/chineseHomepage/desc/nextPage.png")}
                                style={[
                                    Platform.OS === "ios" ? size_tool(120) : size_tool(90),
                                    { transform: [{ rotateZ: "180deg" }] },
                                ]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    this.renderNoData("没有错题。。。")
                )}
            </View>
        );
    };
    renderNoData = (text) => {
        return (
            <View style={[appStyle.flexCenter, { flex: 1 }]}>
                <Image
                    source={require("../../images/english/panda.png")}
                    style={{ width: pxToDp(412), height: pxToDp(230) }}
                    resizeMode="stretch"
                ></Image>
                <ImageBackground
                    source={require("../../images/desk/content_bg_2.png")}
                    style={[
                        { width: pxToDp(800), height: pxToDp(220) },
                        appStyle.flexCenter,
                    ]}
                    resizeMode="stretch"
                >
                    <Text
                        style={[
                            { color: "#475266", fontSize: pxToDp(52) },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        暂无数据
                    </Text>
                    {text ? (
                        <Text
                            style={[
                                { color: "#C6C9CF", fontSize: pxToDp(28) },
                                appFont.fontFamily_jcyt_500,
                                Platform.OS === "ios" ? { marginTop: pxToDp(20) } : null,
                            ]}
                        >
                            {text}
                        </Text>
                    ) : null}
                </ImageBackground>
            </View>
        );
    };
    render() {
        const { checkIndex, leftNavList, show } = this.state;
        return (
            <ImageBackground
                source={require(`../../images/chineseHomepage/flow/flowBg.png`)}
                style={[styles.container]}
            >
                <View style={[styles.header]}>
                    <View style={[styles.inner]}>
                        <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
                            <Image
                                resizeMode="stretch"
                                style={{ width: pxToDp(120), height: pxToDp(120) }}
                                source={require("../../images/desk/back_btn_1.png")}
                            ></Image>
                        </TouchableOpacity>
                        <View style={[appStyle.flexLine]}>
                            {leftNavList.map((i, x) => {
                                return (
                                    <TouchableOpacity
                                        key={x}
                                        onPress={() => {
                                            this.checkThis(x);
                                        }}
                                    >
                                        <ImageBackground
                                            source={
                                                checkIndex === x
                                                    ? require("../../images/desk/btn_bg_1.png")
                                                    : null
                                            }
                                            style={[
                                                { width: pxToDp(280), height: pxToDp(100) },
                                                appStyle.flexCenter,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.txt_1,
                                                    { color: checkIndex === x ? "#E36000" : "#475266" },
                                                ]}
                                            >
                                                {i.text}
                                            </Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <TouchableOpacity
                            onPress={() => this.setState({ show: true })}
                            style={[styles.changeBtnWrap]}
                        >
                            <Text style={[styles.changeBtnTxt]}>语文作业</Text>
                            <Image
                                source={require("../../images/chineseHomepage/wrong/changeIcon.png")}
                                style={[size_tool(20)]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[{ flex: 1 }]}>
                    {checkIndex === 0 ? this.renderContent() : null}
                    {checkIndex === 1 ? this.renderHistory() : null}
                    {checkIndex === 2 ? this.renderWrong() : null}
                </View>
                <ChangeDeskSubject
                    show={show}
                    paddingTop={Platform.OS === 'android' ? null : 36}
                    close={() =>
                        this.setState({
                            show: false,
                        })
                    }
                    typeName={'语文作业'}
                    check={(key) => {
                        this.setState({
                            show: false
                        })
                        if (key === 'math') {
                            MathNavigationUtil.toMathDeskHomepage(this.props)
                        } else {
                            NavigationUtil.toEnglishDeskHomepage(this.props)
                        }
                    }}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: pxToDp(178),
        // paddingTop: Platform.OS === 'ios' ? pxToDp(236) : pxToDp(70)
    },
    header: {
        height: Platform.OS === 'android' ? pxToDp(132) : pxToDp(150),
        backgroundColor: "#DAE2F2",
    },
    inner: {
        height: Platform.OS === 'android' ? pxToDp(120) : pxToDp(140),
        backgroundColor: "#fff",
        position: "relative",
        ...appStyle.flexJusCenter,
        ...appStyle.flexAliCenter,
    },
    backBtn: {
        position: "absolute",
        left: 0,
    },
    txt_1: {
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
    },
    number: {
        color: "#FF8F32",
        fontSize: pxToDp(30),
    },
    numberFinish: {
        color: "#fff",
        fontSize: pxToDp(32),
    },
    historyTextMain: {
        ...appStyle.flexTopLine,
        ...appStyle.flexAliCenter,
    },
    historyTxt1: {
        fontSize: pxToDp(34),
        ...appFont.fontFamily_jcyt_500,
    },
    itemTxt: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(40),
        color: "#445368",
        lineHeight: pxToDp(50),
    },
    changeBtnWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFB649",
        width: pxToDp(240),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        justifyContent: "center",
        position: 'absolute',
        right: pxToDp(30),
        top: Platform.OS === 'android' ? pxToDp(20) : pxToDp(36),
    },
    changeBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#fff",
        marginRight: pxToDp(10),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(YuwenHomePage);
