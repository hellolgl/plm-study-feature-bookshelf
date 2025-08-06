import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    DeviceEventEmitter,
} from "react-native";
import {
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import _ from "lodash";
import { appStyle, appFont } from "../../../../../theme";

import ReadingHelpModal from "../../../../../component/chinese/reading/ReadingHelpModal";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Exercise from "./components/exercise";
import * as userAction from "../../../../../action/userInfo";
import { getRewardCoinLastTopic } from "../../../../../util/coinTools";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

let isUpload = true;
// let url = url.baseURL;
class ChineseSpeReadingExerciseDaily extends PureComponent {
    constructor(props) {
        super(props);
        this.audio = React.createRef();
        this.articleAudio = React.createRef();
        this.eventListener = undefined;
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            topaicIndex: 0,
            topicMap: new Map(),
            status: false,
            gifUrl: "",
            visible: false,
            diagnose_notes: "", // 诊断标记
            canvasData: "",
            isKeyExercise: 1,
            lookDetailNum: 0,
            answer_end_time: "",
            checkedIndex: -1,
            //题目统计结果
            blank: 0,
            correct: 0,
            wrong: 0,
            answerStatisticsModalVisible: false,
            isEnd: false,
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            isLookHelp: false,
            explanation_audio: "",
            playStatus: false,
            playStatus1: false,
            articleList: {}, //文章列表
            start_time: new Date().getTime(),
            isOld: true,
            exercise_ids: [],
            sync_ids: [],
            // renderOptionList: true
        };
        this.isHelpClick = false; //诊断标记点击关闭还是帮助
        this.handlenNxtTopaicThrottled = _.throttle(this.nextTopaic, 1 * 1000);
        // this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);
    }

    static navigationOptions = {
        // title:'答题'
    };
    renderOptionList = true;

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    getTime = () => {
        let date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        return (
            year +
            "-" +
            month +
            "-" +
            day +
            "" +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            seconds
        );
    };

    //获取整套题作答结果
    getAnswerResult = () => {
        const { start_time, topaicIndex, fromServeCharacterList } = this.state;
        let endTime = new Date().getTime();
        let spend_time = parseInt((endTime - start_time) / 1000);
        let obj = {
            // student_id: this.info.id,
            spend_time,
            r_times_id: fromServeCharacterList[topaicIndex].r_times_id,
        };
        axios.put(api.studentReadStem, obj).then((res) => {
            // console.log("一套题保存成功");

            this.setState({
                isEnd: true,
                answerStatisticsModalVisible: true,
            });
        });
    };
    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        this.setState({ answerStatisticsModalVisible: false });
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        axios
            .get(
                `${api.getChineseReadingDailyExercise}?grade_code=${userInfoJs.checkGrade}&term_code=${userInfoJs.checkTeam}`,
                { params: {} }
            )
            .then((res) => {
                // let list = [...res.data.data.sentence, ...res.data.data.article];
                // console.log("res", res);
                if (res && res.data.err_code === 0) {
                    let list = res.data.data;
                    this.setState(() => ({
                        fromServeCharacterList: [...list],
                        topaicNum: list.length,
                        exercise_ids: list[0]?.exercise_ids,
                        sync_ids: list[0]?.sync_ids,
                    }));
                }
            });
    }
    componentWillUnmount() {
        const { has_record } = this.props.navigation.state.params.data;
        if (has_record) {
            DeviceEventEmitter.emit("readingRecordList"); //返回页面刷新
        } else {
            DeviceEventEmitter.emit("backReadingHome"); //返回页面刷新
        }
    }

    renderTopaicCard = (topaicNum) => {
        let cardList = new Array();
        const { topaicIndex, fromServeCharacterList } = this.state;
        for (let i = 0; i < fromServeCharacterList.length; i++) {
            //             "0": "#7FD23F",     //绿色
            //   "1": "#FCAC14",     //橘色
            //   "2": "#FC6161",     //红色
            //   '3': '#DDDDDD'
            if (i <= topaicIndex) {
                cardList.push(
                    <View
                        style={[
                            size_tool(80),
                            borderRadius_tool(80),
                            appStyle.flexCenter,
                            {
                                backgroundColor:
                                    fromServeCharacterList[i].colorFlag === 0
                                        ? "#7FD23F"
                                        : fromServeCharacterList[i].colorFlag === 2
                                            ? "#FC6161"
                                            : "transparent",
                                marginRight: pxToDp(20),
                            },
                            i === topaicIndex
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
                                    color: i < topaicIndex ? "#fff" : "#445268",
                                },
                            ]}
                        >
                            {i + 1}
                        </Text>
                    </View>
                );
            }
        }
        return cardList;
    };

    saveExerciseDetail = (yesOrNo, answer) => {
        // 保存做题结果
        const {
            fromServeCharacterList,
            topaicIndex,
            start_time,
            isOld,
            exercise_ids,
            sync_ids,
        } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let endTime = new Date().getTime();
        let answer_times = parseInt((endTime - start_time) / 1000);
        // console.log("jieguo", this.state)
        let score = 0;
        if (
            (answer_times < fromServeCharacterList[topaicIndex].exercise_time ||
                answer_times === fromServeCharacterList[topaicIndex].exercise_time) &&
            yesOrNo === 0
        ) {
            score = 3;
        }
        if (
            answer_times > fromServeCharacterList[topaicIndex].exercise_time &&
            yesOrNo === 0
        ) {
            score = 2;
        }
        if (yesOrNo === 2) {
            score = 1;
        }
        if (isUpload) {
            isUpload = false;
            let obj = {
                grade_term: userInfoJs.checkGrade + userInfoJs.checkTeam,
                knowledge: fromServeCharacterList[topaicIndex].knowledge,
                exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
                correct: yesOrNo + "", //批改对错，0 正确 2错误
                // push_tag: fromServeCharacterList[topaicIndex].push_tag,   //是否需要推送题目
                knowledge_type: fromServeCharacterList[topaicIndex].knowledge_type,
                exercise_level: fromServeCharacterList[topaicIndex].exercise_level,
                exercise_element: fromServeCharacterList[topaicIndex].exercise_element,
                push_num: fromServeCharacterList[topaicIndex].push_num,
                record_id: fromServeCharacterList[topaicIndex].record_id,
                a_id: fromServeCharacterList[topaicIndex].a_id,
                exercise_type: fromServeCharacterList[topaicIndex].exercise_type,
                answer_origin: fromServeCharacterList[topaicIndex].answer_origin,
                r_id: fromServeCharacterList[topaicIndex].r_id,
                r_times_id: fromServeCharacterList[topaicIndex].r_times_id,
                answer_times: score,
                ability: fromServeCharacterList[topaicIndex].ability,
                module: "3",
                exercise_ids,
                sync_ids,
                alias: "chinese_toReading",
            };
            if (obj.answer_origin === "3" && isOld) {
                axios
                    .post(api.recordSingleRead, obj)
                    .then((res) => {
                        isUpload = true;
                        if (res.data.err_code === 0) {
                            this.setState({
                                isLookHelp: false,
                            });
                            if (yesOrNo === 2) {
                                // 有下一等级题目
                                console.log("send", obj);

                                let isOldonw = isOld;
                                let listnow = [...fromServeCharacterList];
                                let topaicNumnow = this.state.topaicNum + 1;
                                let exercise_idsnow = exercise_ids,
                                    sync_idsnow = sync_ids;
                                if (res.data.data.exercise_id) {
                                    let insertObj = res.data.data;
                                    // insertObj.colorFlag = 0
                                    listnow.splice(topaicIndex + 1, 0, insertObj);
                                    isOldonw = true;
                                    exercise_idsnow = insertObj.exercise_ids;
                                    sync_idsnow = insertObj.sync_ids;
                                } else {
                                    let insertObj = { ...fromServeCharacterList[topaicIndex] };
                                    insertObj.colorFlag = 3;
                                    // insertObj.colorFlag = 0
                                    listnow.splice(topaicIndex + 1, 0, insertObj);
                                    isOldonw = false;
                                }
                                this.setState(
                                    {
                                        fromServeCharacterList: listnow,
                                        topaicNum: topaicNumnow,
                                        exercise_ids: exercise_idsnow,
                                        sync_ids: sync_idsnow,
                                    },
                                    () => {
                                        this.renderOptionList = true; //1

                                        this.setState({
                                            topaicIndex: topaicIndex + 1,
                                            status: false,
                                            checkedIndex: -1,
                                            optionList: [],
                                            isOld: isOldonw,
                                        });
                                    }
                                );
                            } else {
                                // 没有要素题
                                this.renderOptionList = true; //1
                                if (
                                    topaicIndex + 1 ==
                                    this.state.fromServeCharacterList.length
                                ) {
                                    if (yesOrNo === 0) {
                                        getRewardCoinLastTopic().then((res) => {
                                            if (res.isReward) {
                                                // 展示奖励弹框,在动画完后在弹统计框
                                                this.eventListener = DeviceEventEmitter.addListener(
                                                    "rewardCoinClose",
                                                    () => {
                                                        this.getAnswerResult();
                                                        this.eventListener && this.eventListener.remove();
                                                    }
                                                );
                                            } else {
                                                this.getAnswerResult();
                                            }
                                        });
                                    } else {
                                        this.getAnswerResult();
                                    }
                                } else {
                                    if (yesOrNo === 0) {
                                        this.props.getRewardCoin();
                                    }
                                    this.setState({
                                        topaicIndex:
                                            topaicIndex + 1 ==
                                                this.state.fromServeCharacterList.length
                                                ? 0
                                                : topaicIndex + 1,
                                        status: false,
                                        checkedIndex: -1,
                                        optionList: [],
                                        isOld: true,
                                        // isLookHelp: false
                                    });
                                }
                                //console.log("saveExercise");
                            }
                        }
                    })
                    .catch((res) => {
                        isUpload = true;
                    });
            } else {
                isUpload = true;
                this.renderOptionList = true; //1
                if (topaicIndex + 1 == this.state.fromServeCharacterList.length) {
                    if (yesOrNo === 0) {
                        getRewardCoinLastTopic().then((res) => {
                            if (res.isReward) {
                                // 展示奖励弹框,在动画完后在弹统计框
                                this.eventListener = DeviceEventEmitter.addListener(
                                    "rewardCoinClose",
                                    () => {
                                        this.getAnswerResult();
                                        this.eventListener && this.eventListener.remove();
                                    }
                                );
                            } else {
                                this.getAnswerResult();
                            }
                        });
                    } else {
                        this.getAnswerResult();
                    }
                } else {
                    if (yesOrNo === 0) {
                        this.props.getRewardCoin();
                    }
                    this.setState({
                        topaicIndex:
                            topaicIndex + 1 == this.state.fromServeCharacterList.length
                                ? 0
                                : topaicIndex + 1,
                        status: false,
                        checkedIndex: -1,
                        optionList: [],
                        isOld: true,
                        // isLookHelp: false
                    });
                }
            }
        }
    };

    nextTopaic = (exercise) => {
        // this.refs.canvas._nextTopaic();
        let { isLookHelp } = this.state;
        let index = this.state.checkedIndex;
        const { fromServeCharacterList, topaicIndex, optionList } = this.state;

        const { correct } = exercise;
        if (correct === "0") {
            // 正确，当前题目为推送的要素题时不论对错都保存

            this.saveExerciseDetail(0, optionList[index]);
            if (this.state.isKeyExercise === 1) {
                fromServeCharacterList[topaicIndex].colorFlag = 0;
            }
        } else {
            if (this.state.isKeyExercise === 1) {
                fromServeCharacterList[topaicIndex].colorFlag = 2;
            }
            this.saveExerciseDetail(2, optionList[topaicIndex]);
        }
    };

    render() {
        const {
            topaicNum,
            status,
            fromServeCharacterList,
            topaicIndex,
            explanation_audio,
            answerStatisticsModalVisible,
            diagnose_notes,
        } = this.state;
        // console.log(fromServeCharacterList, 'topaicNum')

        return (
            <ImageBackground
                source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
                style={[
                    { flex: 1 },
                    padding_tool(Platform.OS === "ios" ? 60 : 0, 20, 0, 20),
                ]}
                resizeMode="cover"
            >
                <TouchableOpacity
                    style={[
                        size_tool(120, 80),
                        {
                            position: "absolute",
                            top: pxToDp(Platform.OS === "ios" ? 100 : 40),
                            zIndex: 999,
                            left: pxToDp(40),
                        },
                    ]}
                    onPress={this.goBack}
                >
                    <Image
                        style={[size_tool(120, 80)]}
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                    />
                </TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.topaicCard}>
                        {this.renderTopaicCard(topaicNum)}
                    </View>
                    <View style={styles.topaic} ref="topaicBox">
                        {fromServeCharacterList[topaicIndex] &&
                            fromServeCharacterList[topaicIndex].exercise_id ? (
                            <Exercise
                                {...this.props}
                                article={{
                                    ...fromServeCharacterList[topaicIndex],
                                    exercise_type:
                                        fromServeCharacterList[topaicIndex].answer_origin === "3"
                                            ? "s"
                                            : "",
                                }}
                                nextNow={this.nextTopaic}
                                isKeyExercise={false}
                                hideHelp={true}
                                resetToLogin={() => {
                                    NavigationUtil.resetToLogin(this.props);
                                }}
                            />
                        ) : null}
                    </View>
                </View>

                {/* <AnswerStatisticsModalNoNum
                    closeDialog={this.closeAnswerStatisticsModal}
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    msg={'恭喜你完成今日的“每日一练”！'}
                ></AnswerStatisticsModalNoNum> */}

                <ReadingHelpModal
                    status={this.state.visible}
                    goback={this.handlenOnCloseThrottled}
                    audio={explanation_audio}
                    knowledgepoint_explanation={this.state.knowledgepoint_explanation}
                    diagnose_notes={diagnose_notes}
                />
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={0}
                    noNumber={0}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                    isNoNum={true}
                    msg={"恭喜你完成今日的“每日一练”！"}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: "space-between",
    },

    topaicCard: {
        width: "100%",
        height: pxToDp(160),
        // borderRadius: pxToDp(32),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    topaic: {
        ...appStyle.flexTopLine,
        flex: 1,
    },

    articleWrap: {
        flex: 1,
        width: "100%",
        ...appStyle.flexTopLine,
        ...padding_tool(0, 40, 0, 40),
    },
    topaicBtn: {
        ...size_tool(336, 100),
        borderRadius: pxToDp(50),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
    },
    topaicBtnWrap: {
        width: "100%",
        alignItems: "center",
        height: pxToDp(140),
        paddingTop: pxToDp(20),
    },
    articleTitle: {
        width: "100%",
        borderRadius: pxToDp(40),
        backgroundColor: "#F3F4F9",
        ...appStyle.flexTopLine,
        minHeight: pxToDp(140),
        alignItems: "center",
        ...padding_tool(10, 20, 10, 20),
        marginBottom: pxToDp(20),
    },
    topaicText: {
        flex: 1,
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispathToProps
)(ChineseSpeReadingExerciseDaily);
