import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform,
    ScrollView,
    DeviceEventEmitter,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
    pxToDp,
    padding_tool,
    size_tool,
    borderRadius_tool,
    fitHeight,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";

import CheckExercise from "./checkExercise";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import Good from "../../../../../component/chinese/reading/good";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import * as userAction from "../../../../../action/userInfo";
import { getRewardCoinLastTopic } from '../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            thinking_tips: "",
            isStartAudioT: false,
            audio: "",
            exercise: [],
            nowindex: 0,
            exercise_times_id: "",
            lookMsg: false,
            goodVisible: false,
            answerStatisticsModalVisible: false,
            wrong: 0,
            correct: 0,
            hasRecord: props.navigation.state.params.data.hasRecord,
        };
    }

    static navigationOptions = {};

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getlist();
    }

    getlist() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { checkGrade, class_code, checkTeam, id } = userInfoJs;
        const { origin, exercise_set_id, stu_origin } =
            this.props.navigation.state.params.data;
        let sendData = {
            subject: "01",
            origin: origin,
            exercise_set_id: exercise_set_id,
            grade_code: checkGrade,
            class_info: class_code,
            team: checkTeam,
            student_code: id,
            stu_origin,
        };
        // console.log("参数123", sendData);
        axios.post(api.getChineseBagExercise, sendData).then((res) => {
            if (res.data?.err_code === 0) {
                console.log("数据", res.data.data);
                this.setState({
                    exercise: res.data.data,
                    exercise_set_id: res.data.data[0]?.exercise_set_id,
                });
            }
        });
    }
    nextExercise = (exerobj, isKeyExercise) => {
        const { exercise, nowindex, exercise_times_id } = this.state;
        const { userInfo } = this.props;
        const { id, checkGrade, checkTeam } = userInfo.toJS();
        let { stu_origin, unit_code, origin } =
            this.props.navigation.state.params.data;
        console.log("exerobj", exerobj, isKeyExercise);
        if (!isKeyExercise) {
            axios
                .post(api.saveChineseBagExercise, {
                    ...exerobj,
                    exercise_times_id,
                    grade_code: checkGrade,
                    term_code: checkTeam,
                    stu_origin,
                    is_finish: nowindex + 1 === exercise.length ? 0 : 1,
                    textbook: "10",
                    unit_code,
                    student_code: id,
                    origin,
                    correction: exerobj.correct === 2 ? "0" : "1",
                    is_element_exercise: isKeyExercise ? 0 : 1,
                    alias: "chinese_toChineseSchoolHome",
                })
                .then((res) => {
                    if (res.data?.err_code === 0) {
                        if (exerobj.correct === 2) {
                            if (nowindex + 1 === exercise.length && (isKeyExercise || exerobj.correct === 2)) {
                                // 最后一题
                                getRewardCoinLastTopic().then(res => {
                                    if (res.isReward) {
                                        // 展示奖励弹框,在动画完后在弹统计框
                                        this.eventListener = DeviceEventEmitter.addListener(
                                            "rewardCoinClose",
                                            () => {
                                                this.toNext(isKeyExercise, exerobj);
                                                this.eventListener && this.eventListener.remove()
                                            }
                                        );
                                    } else {
                                        this.toNext(isKeyExercise, exerobj);
                                    }
                                })
                            } else {
                                this.props.getRewardCoin()
                                this.toNext(isKeyExercise, exerobj);
                            }
                            this.setState(
                                {
                                    goodVisible: this.props.moduleCoin < 30 ? false : true, //没满30个币，弹得币动画，满了弹答对弹框
                                },
                                () => {
                                    setTimeout(() => {
                                        this.setState({
                                            goodVisible: false,
                                        });
                                    }, 1000);
                                }
                            );
                        } else {
                            this.toNext(isKeyExercise, exerobj);
                        }
                    }
                });
        } else {
            this.toNext(isKeyExercise, exerobj);
        }
    };
    toNext = (isKeyExercise, exerobj) => {
        const { exercise, nowindex } = this.state;
        let yesOrNo = exerobj.correct === 2;
        // console.log("下一题", yesOrNo, isKeyExercise);
        if (nowindex + 1 === exercise.length && (isKeyExercise || yesOrNo)) {
            this.doneExercise();
            return;
        } else {
            let list = [...exercise],
                index = nowindex;
            isKeyExercise ? "" : (list[nowindex].status = exerobj.correct);
            isKeyExercise || yesOrNo ? (index += 1) : "";
            this.setState({
                exerciseDetail: exercise[index],
                nowindex: index,
                exercise: list,
            });
        }
    };
    renderExercise = () => {
        const { exercise, nowindex } = this.state;
        return (
            <CheckExercise
                navigation={this.props.navigation}
                resetToLogin={() => {
                    NavigationUtil.resetToLogin(this.props);
                }}
                exercise={exercise[nowindex]}
                nextExercise={this.nextExercise}
            />
        );
    };
    doneExercise = () => {
        const { exercise_set_id } = this.state;
        const data = {};
        data.exercise_set_id = exercise_set_id;
        data.student_code = this.props.userInfo.toJS().id;
        data.subject = "01";
        axios
            .post(api.yuwenBagResult, data)
            .then((res) => {
                console.log("getAnswerResult", data, res.data);
                this.setState(() => ({
                    wrong: res.data.data.wrong,
                    blank: res.data.data.blank,
                    correct: res.data.data.correct,
                    answerStatisticsModalVisible: true,
                    isEnd: true,
                }));
            })
            .catch((e) => {
                // console.log(e)
            });
    };
    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        const { hasRecord } = this.state;
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
        hasRecord
            ? DeviceEventEmitter.emit("backFlowRecord")
            : DeviceEventEmitter.emit("backFlowhome"); //返回页面刷新
    };

    renderTopaicCard = () => {
        let cardList = new Array();
        const { nowindex, exercise } = this.state;
        for (let i = 0; i < exercise.length; i++) {
            //             "0": "#7FD23F",     //绿色
            //   "1": "#FCAC14",     //橘色
            //   "2": "#FC6161",     //红色
            //   '3': '#DDDDDD'
            cardList.push(
                <View
                    style={[
                        size_tool(80),
                        borderRadius_tool(80),
                        appStyle.flexCenter,
                        {
                            backgroundColor:
                                exercise[i].status === 2
                                    ? "#7FD23F"
                                    : exercise[i].status === 0
                                        ? "#FC6161"
                                        : "transparent",
                            marginRight: pxToDp(20),
                        },
                        i === nowindex
                            ? {
                                borderWidth: pxToDp(5),
                                borderColor: "#FF9032",
                            }
                            : "",
                    ]}
                >
                    <Text
                        style={[
                            {
                                fontSize: pxToDp(50),
                                color: i < nowindex ? "#fff" : "#445268",
                            },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        {i + 1}
                    </Text>
                </View>
            );
        }
        return cardList;
    };
    render() {
        const {
            exercise,
            thinking_tips,
            lookMsg,
            goodVisible,
            answerStatisticsModalVisible,
            correct,
            wrong,
        } = this.state;
        return (
            <ImageBackground
                style={styles.wrap}
                source={require("../../../../../images/chineseHomepage/flow/flowBg.png")}
                resizeMode="cover"
            >
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexJusBetween,
                        padding_tool(0, 64, 0, 64),
                        { width: "100%", height: pxToDp(128) },
                    ]}
                >
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View
                        style={[
                            { flex: 1 },
                            padding_tool(40, 0, 0, 40),
                            appStyle.flexCenter,
                        ]}
                    >
                        <ScrollView horizontal={true}>{this.renderTopaicCard()}</ScrollView>
                    </View>
                    <View style={[size_tool(120, 80)]}></View>
                </View>
                <View
                    style={{
                        flex: 1,
                        width: "100%",
                    }}
                >
                    {exercise.length > 0 && this.renderExercise()}
                </View>
                <MsgModal
                    btnText="好的"
                    todo={() => this.setState({ lookMsg: false })}
                    visible={lookMsg}
                    title="思路提示"
                    msg={thinking_tips}
                    isHtml={true}
                />
                {goodVisible ? <Good /> : null}
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={correct}
                    noNumber={wrong}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                // isNoNum={true}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
    },

    btn: {
        backgroundColor: "#A86A33",
        borderRadius: pxToDp(16),
        marginRight: pxToDp(24),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        moduleCoin: state.getIn(["userInfo", "moduleCoin"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
