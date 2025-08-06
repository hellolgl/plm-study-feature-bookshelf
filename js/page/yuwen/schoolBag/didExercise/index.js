import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    ImageBackground,
    DeviceEventEmitter,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    size_tool,
    ChangeRichToTxt,
} from "../../../../util/tools";
import Header from "../../../../component/Header";
import RichShowView from "../../../../component/chinese/RichShowView";
import NewRichShowView from "../../../../component/chinese/newRichShowView";
import { appFont } from "../../../../theme";

import { appStyle } from "../../../../theme";
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
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
            titleTxt: "答题记录",
            type: "",
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goback = () => {
        NavigationUtil.goBack(this.props);
    };

    toDoHomework = (item) => {
        NavigationUtil.toDoWrongExercise({
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
        this.eventListenerRefreshPage.remove();
        DeviceEventEmitter.emit("backFlowhome");
    }
    componentDidMount() {
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "backFlowRecord",
            () => {
                this.getFlowExerciseList();
            }
        );
        let type = this.props.navigation.state.params.data.type;
        // console.log("参数", this.props.navigation.state.params.data);
        this.getlist(type);
        this.setState({
            type,
        });
        // if (type === 'diary') {
        //     this.getDiaryList()
        // } else {
        //     if (type === 'daily') {
        //         this.getDailyList()
        //     } else {
        //         this.getFlowExerciseList()
        //     }
        // }
    }
    getlist = (type) => {
        switch (type) {
            case "diary":
                this.getDiaryList();
                break;
            case "daily":
                this.getDailyList();
                break;
            case "word":
                this.getDiaryWordList();
                break;
            case "desc":
                this.getHistory();
                break;
            default:
                this.getFlowExerciseList();
                break;
        }
    };
    getHistory = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        // data.grade_code = userInfoJs.checkGrade;
        // data.class_info = userInfoJs.class_code;
        // data.term_code = userInfoJs.checkTeam;
        // data.student_code = userInfoJs.id;
        // data.subject = "01";
        data.exercise_set_id =
            this.props.navigation.state.params.data.exercise_set_id;
        // console.log("list1234", this.props.navigation.state.params.data);
        axios
            .get(api.getChineseMyDescHistoryExerciselist, { params: data })
            .then((res) => {
                let list = res.data.data;
                let time = list.length > 0 ? list[0].create_time : "";
                this.setState(() => ({
                    unitList: list,
                    time,
                }));
            });
    };
    getFlowExerciseList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { origin, learning_name } = this.props.navigation.state.params.data;
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = "01";
        data.origin = origin;
        console.log("list1234", this.props.navigation.state.params.data);

        axios.get(api.getChineseBagRecordList, { params: data }).then((res) => {
            let list = res.data.data;
            let time = list.length > 0 ? list[0].create_time : "";
            this.setState(() => ({
                unitList: list,
                time,
                titleTxt: learning_name,
            }));
        });
    }

    getDailyList() {
        console.log("每日一练答题记录");
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;

        axios.get(api.getChineseDailyRecord, { params: data }).then((res) => {
            let list = res.data.data;
            let time = list.length > 0 ? list[0].create_time : "";
            this.setState(() => ({
                unitList: list,
                time,
            }));
        });
    }
    getDiaryList() {
        console.log("学习日记答题记录");
        const data = {};
        data.exercise_set_id =
            this.props.navigation.state.params.data.exercise_set_id;
        axios
            .get(api.getChineseDiaryFlowRecordList, { params: data })
            .then((res) => {
                let list = res.data.data;
                let time = list.length > 0 ? list[0].create_time : "";
                this.setState(() => ({
                    unitList: list,
                    time,
                }));
            });
    }
    getDiaryWordList() {
        console.log("学习日记 字词积累答题记录");
        const data = {};
        data.exercise_set_id =
            this.props.navigation.state.params.data.exercise_set_id;
        data.exercise_origin =
            this.props.navigation.state.params.data.exercise_origin;
        axios
            .get(api.getChineseDiaryWordRecordList, { params: data })
            .then((res) => {
                let list = res.data.data;
                let time = list.length > 0 ? list[0].create_time : "";
                this.setState(() => ({
                    unitList: list,
                    time,
                }));
            });
    }
    renderNormalExercise = () => {
        const { unitList } = this.state;

        return unitList.map((item, index) => {
            // item.correction === "0"  正确
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => this.toDoHomework(item)}
                    style={[styles.itemWrap]}
                >
                    <View
                        style={[
                            styles.itemIndexWrap,
                            {
                                backgroundColor:
                                    item.correction === "0" ? "#00CB8E" : "#EC5D57",
                            },
                        ]}
                    >
                        <Text style={[styles.itemIndexTxt]}>{index + 1}</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginRight: pxToDp(20),
                        }}
                    >
                        <Text style={[styles.itemTxt]}>
                            {ChangeRichToTxt(item.private_exercise_stem)}
                        </Text>
                    </View>
                    <Image
                        source={require("../../../../images/chineseHomepage/flow/flowGo.png")}
                        style={[size_tool(22, 38)]}
                    />
                </TouchableOpacity>
            );
        });
    };
    toDoexercise = () => {
        NavigationUtil.toChineseBagExercise({
            ...this.props,
            data: this.props.navigation.state.params.data,
        });
    };
    render() {
        const { type, unitList } = this.state;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../../images/chineseHomepage/flow/flowBg.png")}
            >
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                    <TouchableOpacity style={[size_tool(120, 80)]} onPress={this.goback}>
                        <Image
                            style={[size_tool(120, 80)]}
                            source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            appFont.fontFamily_syst_bold,
                            {
                                fontSize: pxToDp(48),
                                color: "#475266",
                                lineHeight: pxToDp(58),
                            },
                        ]}
                    >
                        {this.state.titleTxt}
                    </Text>
                    <View style={[size_tool(120, 80)]} />
                </View>

                <View
                    style={[{ width: "100%", flex: 1 }, padding_tool(0, 260, 0, 260)]}
                >
                    {unitList.length ? <ScrollView style={{ paddingBottom: pxToDp(80), flex: 1 }}>
                        {this.renderNormalExercise()}
                    </ScrollView> : <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                        <Image
                            source={require("../../../../images/english/panda.png")}
                            style={{ width: pxToDp(412), height: pxToDp(230) }}
                            resizeMode="stretch"
                        ></Image>
                        <ImageBackground
                            source={require("../../../../images/desk/content_bg_2.png")}
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
                        </ImageBackground>
                    </View>}
                    {type === "flow" ? (
                        <TouchableOpacity
                            style={styles.topaicBtn}
                            onPress={this.toDoexercise}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    borderRadius: pxToDp(200),
                                    backgroundColor: "#FF964A",
                                    ...appStyle.flexCenter,
                                }}
                            >
                                <Text
                                    style={[
                                        { color: "#fff", fontSize: pxToDp(40) },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    测一测
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
    wrap: {
        flex: 1,
        ...padding_tool(20, Platform.OS === "ios" ? 80 : 20, 0, 20),
    },
    itemWrap: {
        width: "100%",
        minHeight: pxToDp(156),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: pxToDp(38),
        padding: pxToDp(40),
    },
    itemTxt: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(40),
        color: "#445368",
        lineHeight: pxToDp(50),
    },
    itemIndexWrap: {
        height: pxToDp(80),
        minWidth: pxToDp(80),
        borderRadius: pxToDp(100),
        alignItems: "center",
        justifyContent: "center",
        marginRight: pxToDp(20),
    },
    itemIndexTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        lineHeight: pxToDp(50),
        color: "#fff",
        marginBottom: pxToDp(Platform.OS === "android" ? -10 : 0),
    },
    topaicBtn: {
        ...size_tool(230),
        borderRadius: pxToDp(200),
        backgroundColor: "#EF7B38",
        position: "absolute",
        bottom: pxToDp(40),
        right: pxToDp(40),
        paddingBottom: pxToDp(8),
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseDidExercise);
