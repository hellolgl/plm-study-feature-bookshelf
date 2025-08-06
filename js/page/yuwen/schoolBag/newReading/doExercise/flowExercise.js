import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform,
    DeviceEventEmitter,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Good from "../../../../../component/chinese/reading/good";
import Exercise from "./components/exercise";
import { getRewardCoinLastTopic } from "../../../../../util/coinTools";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

class DoReadingExersize extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        this.article_category = props.navigation.state.params.data.article_category;
        this.article_type = props.navigation.state.params.data.article_type;
        this.audio = React.createRef();
        this.articleAudio = React.createRef();
        this.eventListener = undefined;
        console.log("参数", props.navigation.state.params.data);
        this.topicAnswer = "";
        this.state = {
            article: {},
            topicList: [],
            topicListIndex: 0,
            currentTopic: {},
            correct: "",
            answerIndex: -1,
            isShuffle: true,
            answerNumber: {
                0: 0,
                2: 0,
            },
            diagnose_notes: "",
            visible: false,
            push_stem: "",
            isEle: false,
            exercise_type: "s", //默认阅读题
            answerStatisticsModalVisible: false,
            explanation: "",
            helpVisible: false,
            r_times_id: "",
            start_time: new Date().getTime(),
            end_time: "",
            topicStart_time: new Date().getTime(),
            isClickHelp: false,
            helpImg: "",
            isStartAudio: false,
            isStartAudioT: false,
            isStartArticleAudio: false,
            goodVisible: false,
        };
    }
    componentDidMount() {
        axios
            .get(api.studentReadStemGet, {
                params: {
                    a_id: this.props.navigation.state.params.data.a_id,
                    grade_code: this.info.checkGrade,
                    term_code: this.info.checkTeam,
                    article_category:
                        this.props.navigation.state.params.data.article_category,
                    article_type: this.props.navigation.state.params.data.article_type,
                },
            })
            .then((res) => {
                const data = res.data.data;
                // console.log("123123123", data);
                this.setState({
                    article: data.article,
                    topicList: data.read_stem,
                    currentTopic: data.read_stem[0],
                    push_stem: data.push_stem,
                    r_times_id: data.r_times_id,
                });
            });
    }
    componentWillUnmount() {
        try {
            this.articleAudio?.sound && this.articleAudio?.pausedEvent();
            this.audio?.sound && this.audio?.pausedEvent();
        } catch (err) { }
        const { has_record } = this.props.navigation.state.params.data;
        if (has_record) {
            DeviceEventEmitter.emit("readingRecordList"); //返回页面刷新
        } else {
            DeviceEventEmitter.emit("flowReadingBack"); //返回页面刷新
        }
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    saveExercise = (obj, isFinish) => {
        axios.post(api.recordSingleRead, obj).then((res) => {
            if (obj.correct === "0" && !isFinish) {
                this.props.getRewardCoin();
            }
        });
    };
    nextTopic = (exercise) => {
        const {
            topicList,
            topicListIndex,
            answerNumber,
            isEle,
            article,
            r_times_id,
            start_time,
            currentTopic,
            isClickHelp,
            topicStart_time,
        } = this.state;
        const { topicAnswer, correct } = exercise;
        let _topicList = JSON.parse(JSON.stringify(topicList));
        let isLast = topicListIndex + 1 === topicList.length;
        // 题目对错数量
        let _correct = isClickHelp ? "2" : correct;
        if (!isEle) {
            for (let i in answerNumber) {
                if (i === _correct) {
                    answerNumber[i] = answerNumber[i] + 1;
                }
            }
        }
        //console.log("当前题是否是要素题", isEle, isClickHelp);
        let endTime = new Date().getTime();
        let answer_times = parseInt((endTime - start_time) / 1000);
        // 保存单题结果
        let obj = {
            student_id: this.info.id,
            a_id: article.a_id,
            grade_term: this.info.checkGrade + this.info.checkTeam,
            r_id: currentTopic.r_id,
            correct: isClickHelp ? "2" : correct,
            answer_times: answer_times > 60 ? 60 : answer_times,
            ability: currentTopic.ability,
            r_times_id: r_times_id,
            answer: topicAnswer,
            module: "1",
            alias: "chinese_toReading",
        };

        if (
            (answer_times < currentTopic.exercise_time ||
                answer_times === currentTopic.exercise_time) &&
            obj.correct === "0"
        ) {
            obj.score = 3;
        }
        if (answer_times > currentTopic.exercise_time && obj.correct === "0") {
            obj.score = 2;
        }
        if (obj.correct === "2") {
            obj.score = 1;
        }
        obj.exercise_from = "12";
        !isEle
            ? this.saveExercise(obj, isLast && (obj.correct !== "2" || isEle))
            : null;
        this.setState({
            start_time: new Date().getTime(),
        });
        if (isLast && (obj.correct !== "2" || isEle)) {
            let endTime = new Date().getTime();
            let spend_time = parseInt((endTime - topicStart_time) / 1000);
            let obj = {
                student_id: this.info.id,
                spend_time,
                error_num: answerNumber["2"],
                r_times_id: r_times_id,
            };
            axios.put(api.studentReadStem, obj).then((res) => {
                console.log("一套题保存成功");
                if (correct === "0") {
                    getRewardCoinLastTopic().then((res) => {
                        if (res.isReward) {
                            // 展示奖励弹框,在动画完后在弹统计框
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.setState({
                                        answerStatisticsModalVisible: true,
                                    });
                                    this.eventListener && this.eventListener.remove();
                                }
                            );
                        } else {
                            this.setState({
                                answerStatisticsModalVisible: true,
                            });
                        }
                    });
                } else {
                    this.setState({
                        answerStatisticsModalVisible: true,
                    });
                }
            });
        }
        if (correct === "0") {
            // 做对了
            //console.log("对对对对对对对对对对");
            // !isEle ? (_topicList[topicListIndex].status = "0") : null;
            isClickHelp
                ? (_topicList[topicListIndex].status = "2")
                : !isEle
                    ? (_topicList[topicListIndex].status = "0")
                    : null;
            if (!isEle) {
                // Toast.success("恭喜你答对了 !!!", 1);
                this.setState(
                    {
                        goodVisible: this.props.moduleCoin < 30 ? false : true,
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                goodVisible: false,
                            });
                        }, 1000);
                    }
                );
            }
            this.setState({
                currentTopic: topicList[isLast ? topicListIndex : topicListIndex + 1],
                isShuffle: true,
                exercise_type: "s",
                isEle: false, //下一题不是要素题
                topicListIndex: isLast ? topicListIndex : topicListIndex + 1,
            });
        } else {
            // 做错了
            //console.log("错错错错错错错错错错", isEle, _topicList[topicListIndex]);
            !isEle ? (_topicList[topicListIndex].status = "2") : null;
            let indexnow = isEle ? topicListIndex + 1 : topicListIndex;
            this.setState({
                helpVisible: true,
                isShuffle: true,
                isClickHelp: false,
                isEle: !isEle,
                currentTopic: topicList[isLast ? topicListIndex : indexnow],
                topicListIndex: isLast ? topicListIndex : indexnow,
            });
        }
        this.setState({
            answerIndex: -1,
            topicList: _topicList,
            answerNumber,
            isClickHelp: false,
        });
    };

    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
        this.setState({
            answerStatisticsModalVisible: false,
        });
    };

    renderTopaicCard = (topaicNum) => {
        let cardList = new Array();
        const { topicListIndex, topicList } = this.state;
        for (let i = 0; i < topicList.length; i++) {
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
                                topicList[i].status === "0"
                                    ? "#7FD23F"
                                    : topicList[i].status === "2"
                                        ? "#FC6161"
                                        : "transparent",
                            marginRight: pxToDp(20),
                        },
                        i === topicListIndex
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
                                color: i < topicListIndex ? "#fff" : "#445268",
                            },
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
            article,
            topicList,
            diagnose_notes,
            answerStatisticsModalVisible,
            answerNumber,
            exercise_type,
            currentTopic,
            goodVisible,
            isEle,
        } = this.state;
        let content = article.content ? article.content : "";
        // if (content.includes("<rp>(</rp>") || content.includes("……") || content.includes("text-align:center")) {
        // content = content.replaceAll("<rt>", "<rt>&nbsp;")
        // content = content.replaceAll("</rt>", "&nbsp;<rt>")
        // }
        // console.log("article.content: ", content)
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
                            left: pxToDp(40),
                            zIndex: 999,
                        },
                    ]}
                    onPress={this.goBack}
                >
                    <Image
                        style={[size_tool(120, 80)]}
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                    />
                </TouchableOpacity>

                <View style={styles.topaicCard}>{this.renderTopaicCard()}</View>
                <View style={[{ flex: 1 }]}>
                    {article.a_id ? (
                        <Exercise
                            {...this.props}
                            article={{ ...article, ...currentTopic, exercise_type: "s" }}
                            nextNow={this.nextTopic}
                            isKeyExercise={isEle}
                            resetToLogin={() => {
                                NavigationUtil.resetToLogin(this.props);
                            }}
                        />
                    ) : null}
                </View>
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={answerNumber["0"]}
                    noNumber={answerNumber["2"]}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                ></AnswerStatisticsModal>
                {goodVisible ? <Good /> : null}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    left: {
        width: pxToDp(1100),
        height: "100%",
        backgroundColor: "#fff",
        ...borderRadius_tool(32, 32, 0, 0),
        marginRight: pxToDp(40),
    },
    right: {
        backgroundColor: "#fff",
        position: "relative",
        height: "100%",
        ...borderRadius_tool(32, 32, 0, 0),
        flex: 1,
        ...padding_tool(40, 40, 0, 40),
    },
    aiticleTitle: {
        textAlign: "center",
        fontSize: pxToDp(40),
    },
    option: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(26),
        borderWidth: pxToDp(2),
        borderColor: "#AAAAAA",
        color: "#AAAAAA",
        marginRight: pxToDp(24),
    },
    isActive: {
        backgroundColor: "#FC6161",
        color: "#fff",
        borderColor: "#FC6161",
        borderRadius: pxToDp(26),
    },
    nextBtn: {
        ...size_tool(336, 100),
        borderRadius: pxToDp(50),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
    },
    nextText: {
        color: "#fff",
        fontSize: pxToDp(28),
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(-50),
        right: pxToDp(0),
        zIndex: 999,
    },
    topaicCard: {
        width: "100%",
        height: pxToDp(160),
        // borderRadius: pxToDp(32),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
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
});
const mapStateToProps = (state) => {
    // 取数据
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        moduleCoin: state.getIn(["userInfo", "moduleCoin"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};
export default connect(mapStateToProps, mapDispathToProps)(DoReadingExersize);
