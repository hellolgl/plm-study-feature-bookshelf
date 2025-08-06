import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    DeviceEventEmitter
} from "react-native";
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
    fontFamilyRestoreMargin,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import AnswerStatisticsModalNoNum from "../../../../../component/AnswerStatisticsModalNoNum";
import { appFont, appStyle } from "../../../../../theme";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import _ from "lodash";
import CheckExercise from "../../flow/doExercise/checkExercise";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";
import { getRewardCoinLastTopic } from '../../../../../util/coinTools'

let isUpload = true;
class ChineseBagExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.audioHelp = undefined;
        this.state = {
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            status: false,
            visible: false,
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
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            isLookHelp: false,
            explanation_audio: "",
            isStartAudio: false,
            playStatus: false,
            playStatus1: false,
            exercise_ids: [],
            answer_start_time: "",
            answer: "",
            loading: true,
            // renderOptionList: true
        };
        this.isHelpClick = false; //诊断标记点击关闭还是帮助
        this.wrong_ids = []
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
        this.setState({
            isEnd: true,
            answerStatisticsModalVisible: true,
        });
    };
    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        this.setState({ answerStatisticsModalVisible: false });
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.setState({
            loading: true
        })
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let senobj = {
            grade_code: userInfoJs.checkGrade,
            term_code: userInfoJs.checkTeam,
        };
        axios
            .get(`${api.chinesDailyBagExercise}`, { params: { ...senobj } })
            .then((res) => {
                let list = [...res.data.data.data];
                let time = this.getTime();
                console.log("长度", list);
                this.setState(() => ({
                    fromServeCharacterList: [...list],
                    topaicNum: list.length,
                    exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
                    exercise_ids: res.data.data.exercise_ids,
                    answer_start_time: time,
                }));
            }).finally(() => {
                this.setState({
                    loading: false
                })
            })
    }
    renderTopaicCard = () => {
        let cardList = new Array();
        const { topaicIndex, fromServeCharacterList } = this.state;
        for (let i = 0; i < fromServeCharacterList.length; i++) {
            //             "0": "#7FD23F",     //绿色
            //   "1": "#FCAC14",     //橘色
            //   "2": "#FC6161",     //红色
            //   '3': '#DDDDDD'
            i <= topaicIndex
                ? cardList.push(
                    <View
                        style={[
                            size_tool(80),
                            borderRadius_tool(80),
                            appStyle.flexCenter,
                            {
                                backgroundColor:
                                    fromServeCharacterList[i].status === 1
                                        ? "#7FD23F"
                                        : fromServeCharacterList[i].status === 0
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
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            {i + 1}
                        </Text>
                    </View>
                )
                : "";
        }
        return cardList;
    };
    //获取看拼音写汉字题型的拼音
    getPyDataFromServe = () => {
        const stateList = [...this.state.fromServeCharacterList];
        const selectMap = new Map();
        for (let i = 0; i < stateList.length; i++) {
            selectMap.set(i, { ...stateList[i] });
        }
        return selectMap;
    };

    checkAnswer = (index) => {
        this.setState({
            checkedIndex: index,
        });
    };

    saveExerciseDetail = (exercise, answer) => {
        // 保存做题结果
        const { topaicIndex, isLookHelp } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const yesOrNo = exercise.correct === 2 ? 1 : 0;
        let fromServeCharacterList = _.cloneDeep(this.state.fromServeCharacterList)
        fromServeCharacterList[topaicIndex].status = exercise.correct === 2 ? 1 : 0
        console.log("jieguo", exercise);
        if (isUpload) {
            isUpload = false;
            axios
                .post(api.saveChineseBagExercise, {
                    grade_code: userInfoJs.checkGrade,
                    term_code: userInfoJs.checkTeam,
                    knowledge_point_code:
                        fromServeCharacterList[topaicIndex].knowledge_point_code,
                    exercise_id: fromServeCharacterList[topaicIndex].exercise_id,
                    correction: yesOrNo, //批改对错，0 错误 1正确
                    push_tag: fromServeCharacterList[topaicIndex].push_tag, //是否需要推送题目
                    knowledgepoint_type:
                        fromServeCharacterList[topaicIndex].knowledgepoint_type,
                    exercise_level: fromServeCharacterList[topaicIndex].exercise_level,
                    exercise_element:
                        fromServeCharacterList[topaicIndex].exercise_element,
                    push_num: fromServeCharacterList[topaicIndex].push_num,
                    exercise_ids: this.state.exercise_ids,
                    answer_origin: "3",
                    exercise_set_id: fromServeCharacterList[topaicIndex].exercise_set_id,
                    exercise_result: answer,
                    is_element_exercise: this.state.isKeyExercise ? 0 : 1,
                    answer_start_time: this.state.answer_start_time,
                    answer_end_time: this.getTime(),
                    is_finish:
                        topaicIndex + 1 == this.state.fromServeCharacterList.length ? 0 : 1,
                    unit_code: fromServeCharacterList[topaicIndex].unit_code,
                    is_seventh_push: fromServeCharacterList[topaicIndex].is_seventh_push,
                    textbook: "10",
                    alias: "chinese_toChooseText",
                })
                .then((res) => {
                    isUpload = true;
                    if (res.data.err_code === 0) {
                        this.setState({
                            isLookHelp: false,
                        });
                        // if (yesOrNo === 1) {
                        this.props.getRewardCoin()
                        if (res.data.data.exercise_id) {
                            // 有下一等级题目
                            // console.log('下一等级题目:::::::', res.data.data)
                            let listnow = [...fromServeCharacterList];
                            console.log(':::::::::', listnow)
                            let insertObj = res.data.data;
                            let topaicNumnow = this.state.topaicNum + 1;
                            insertObj.colorFlag = 0;
                            console.log("插入题目", insertObj);
                            listnow.splice(topaicIndex + 1, 0, insertObj);
                            this.setState(
                                {
                                    fromServeCharacterList: listnow,
                                    topaicNum: topaicNumnow,
                                },
                                () => {
                                    this.renderOptionList = true; //1

                                    this.setState({
                                        topaicIndex: topaicIndex + 1,
                                        status: false,
                                        checkedIndex: -1,
                                        optionList: [],
                                        isKeyExercise: true,
                                        answer_start_time: this.getTime(),
                                    });
                                }
                            );
                        } else {
                            // 没有下一等级题目，跳入下一题
                            this.renderOptionList = true; //1
                            // console.log("saveExercise", this.state.fromServeCharacterList);
                            if (topaicIndex + 1 == this.state.fromServeCharacterList.length) {
                                this.setState({
                                    fromServeCharacterList
                                })
                                getRewardCoinLastTopic().then(res => {
                                    if (res.isReward) {
                                        // 展示奖励弹框,在动画完后在弹统计框
                                        this.eventListener = DeviceEventEmitter.addListener(
                                            "rewardCoinClose",
                                            () => {
                                                this.getAnswerResult()
                                                this.eventListener && this.eventListener.remove()
                                            }
                                        );
                                    } else {
                                        this.getAnswerResult()
                                    }
                                })
                            } else {
                                // console.log('---------', fromServeCharacterList[topaicIndex + 1])
                                this.setState({
                                    topaicIndex:
                                        topaicIndex + 1 ==
                                            this.state.fromServeCharacterList.length
                                            ? 0
                                            : topaicIndex + 1,
                                    status: false,
                                    checkedIndex: -1,
                                    optionList: [],
                                    isKeyExercise: false,
                                    answer_start_time: this.getTime(),
                                    fromServeCharacterList,
                                    // isLookHelp: false
                                })
                            }
                        }
                        // }
                    }
                });
        }
        if (yesOrNo === 0) {
            this.wrong_ids.push(fromServeCharacterList[topaicIndex].exercise_id)
        }
    };

    renderExercise = (data) => {
        return (
            <CheckExercise
                hiddenAI={true}
                hideHelp={true}
                exercise={data}
                nextExercise={this.saveExerciseDetail}
            />
        );
    };

    render() {
        const { fromServeCharacterList, topaicIndex, loading } = this.state;
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
                {loading ? <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <ActivityIndicator size="large" color="#D3D3D3" />
                </View> : fromServeCharacterList.length ? <View
                    style={{
                        flex: 1,
                        width: "100%",
                    }}
                >
                    {fromServeCharacterList[topaicIndex] &&
                        fromServeCharacterList[topaicIndex].exercise_id
                        ? this.renderExercise(fromServeCharacterList[topaicIndex])
                        : null}
                </View> : <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <Text style={[{ color: 'rgba(30, 50, 75, 0.30)', fontSize: pxToDp(46) }]}>暂无数据</Text>
                </View>}
                {/* <AnswerStatisticsModalNoNum
                    closeDialog={this.closeAnswerStatisticsModal}
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    msg={"恭喜完成“每日一练”所有习题!"}
                ></AnswerStatisticsModalNoNum> */}
                <AnswerStatisticsModal
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    yesNumber={fromServeCharacterList.length - _.uniq(this.wrong_ids).length}
                    noNumber={_.uniq(this.wrong_ids).length}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
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
    topaic: {
        // backgroundColor: "#FFFFFFFF",
        // width: "80%",
        // height: pxToDp(890),
        // marginRight: 24,
        borderRadius: pxToDp(32),
        flex: 1,
        height: "100%",
        // marginRight: pxToDp(24)
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseBagExercise);
