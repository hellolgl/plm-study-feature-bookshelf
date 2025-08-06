import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform,
    DeviceEventEmitter,
    Dimensions,
    ScrollView,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Header from "../../../../../component/Header";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import MixExercise from './mix/DoExercise'
import CheckExercise from "../../bagExercise/components/checkExercise";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import fonts from "../../../../../theme/fonts";
import SpeakExercise from "../../bagExercise/components/speakExercise";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
import * as childrenCreators from "../../../../../action/children";
import Congrats from "../../../../../component/Congrats";
import _ from "lodash";
import { getRewardCoinLastTopic } from '../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        this.is_star = true; //幼小是否得过星星
        this.state = {
            list: [],
            listindex: 0,
            exercise_set_id: "",
            answerStatisticsModalVisible: false,
            correct: 0,
            wrong: 0,
            blank: 0,
            pausedfail: true,
            audioIndex: "",
            statuslist: [],
            visibleGood: false,
            answer_start_time: this.getTime(),
        };
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";

        this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";

        this.exerciseRef = undefined;
        this.eventListener = undefined
    }
    componentDidMount() {
        this.getList();
    }
    getList = () => {
        const { userInfo } = this.props;
        const { isGrade } = userInfo.toJS();
        const data = {
            origin: this.props.navigation.state.params.data.exercise_origin,
            // mode: this.props.navigation.state.params.data.mode === 3 ? 1 : this.props.navigation.state.params.data.mode,
            // kpg_type: this.props.navigation.state.params.data.kpg_type,
            knowledge_point_code: this.props.navigation.state.params.data.codeList,
            modular: this.props.navigation.state.params.data.mode, //1 my study 2 test me 3 泡泡
            sub_modular: this.props.navigation.state.params.data.kpg_type, // 1 单词短语  2 句子文章
        };
        if (!isGrade) data.category_type = "1";
        axios.post(api.getEnglishKnowExerciseList, data).then((res) => {
            console.log("回调", res.data);
            if (res.data.err_code === 0) {
                let statuslist = [];
                let stars = [];
                res.data.data.forEach((i, x) => {
                    if (x === 0) stars = i.stars;
                    statuslist.push("");
                });
                if (!isGrade) {
                    for (let i = 0; i < stars.length; i++) {
                        if (stars[i].is_star === false) {
                            this.is_star = false;
                            break;
                        }
                    }
                }
                console.log("is_star:::::::", this.is_star);
                this.setState({
                    list: res.data.data,
                    exercise_set_id: res.data.data[0]?.exercise_set_id,
                    statuslist,
                });
            }
        });
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit("backRecordList"); //返回页面刷新
    }

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
    saveExercise = async (value) => {
        let index = this.state.listindex;
        let { correct, wrong } = this.state;
        const { userInfo, textBookCode } = this.props;
        const userInfoJs = userInfo.toJS();

        // value.correct = 1

        let obj = {
            grade_code: userInfoJs.checkGrade,
            term_code: userInfoJs.checkTeam,
            textbook: textBookCode,
            student_code: userInfoJs.id,
            unit_code: "00",
            origin: "032001000000",
            knowledge_point: value.knowledge_point,
            exercise_id: value.exercise_id,
            exercise_result: value.exercise_result,
            exercise_set_id: this.state.exercise_set_id,
            is_modification: false,
            answer_start_time: this.state.answer_start_time, // 答题开始时间
            answer_end_time: this.getTime(), // 答题结束时间
            correction: value.correct === 1 ? 0 : 1, //批改对错，0 正确 1错误
            is_finish: index === this.state.list.length - 1 ? 0 : 1, //整套题是否做完,0  做完，，1没做完
            kpg_type: 1, //知识点类型1：单词短语2：句子
            modular: 3, //1 my study 2 test me 3 泡泡
            sub_modular: 1, // 1 单词短语  2 句子文章
            alias: "english_toAbcs",
            knowledgepoint_type: value.knowledgepoint_type,
        };

        axios.post(api.saveMystudyExercise, obj).then((res) => {
            if (res.data.err_code === 0) {
                ++index;
                value.correct === 1 ? ++correct : ++wrong;
                let arr = ["1", "2", "3"];
                let listnow = [...this.state.statuslist];
                listnow[index - 1] = value.correct === 1 ? "right" : "wrong";
                let flag = true,
                    audioFlag = true;
                if (value.correct === 1) {
                    flag = false;
                }
                let audioindex = Math.floor(Math.random() * 3);
                const audiolist = [
                    this.successAudiopath,
                    this.successAudiopath2,
                    this.successAudiopath3,
                ];

                !flag ? PlayAudio.playSuccessSound(audiolist[audioindex]) : "";
                this.setState({
                    correct,
                    wrong,
                    audioIndex: arr[audioindex] + "",
                    statuslist: listnow,
                    visibleGood: this.props.moduleCoin < 30 ? false : !flag,
                });
                if (index < this.state.list.length) {
                    this.setState({
                        listindex: flag ? index : index - 1,
                    });
                    if (!flag) {
                        this.props.getRewardCoin()
                        setTimeout(() => {
                            this.setState(
                                {
                                    visibleGood: false,
                                    listindex: index,
                                },
                                () => { }
                            );
                        }, 500);
                    }
                } else {
                    if (!flag) {
                        getRewardCoinLastTopic().then(res => {
                            if (res.isReward) {
                                // 展示奖励弹框,在动画完后在弹统计框
                                this.eventListener = DeviceEventEmitter.addListener(
                                    "rewardCoinClose",
                                    () => {
                                        this.saveAll(flag);
                                        this.eventListener && this.eventListener.remove()
                                    }
                                );
                            } else {
                                this.saveAll(flag);
                            }
                        })
                    } else {
                        this.saveAll(flag);
                    }
                }
            }
        });
    };
    saveAll = (flag) => {
        const { exercise_set_id, wrong } = this.state;
        const data = {};
        data.exercise_set_id = exercise_set_id;
        data.student_code = this.props.userInfo.toJS().id;
        data.modular = 3;
        data.knowledge_point_code =
            this.props.navigation.state.params.data.codeList;
        // console.log("getAnswerResult", data);
        axios
            .put(api.saveMystudyExerciseAll, data)
            .then((res) => {
                const { isGrade } = this.props.userInfo.toJS();
                if (!flag) {
                    // 最后一题答对
                    setTimeout(() => {
                        this.setState(
                            {
                                visibleGood: false,
                            },
                            () => {
                                if (isGrade) {
                                    this.setState({
                                        answerStatisticsModalVisible: true,
                                    });
                                } else {
                                    console.log(":::::", this.is_star, wrong);
                                    if (this.is_star || wrong !== 0) {
                                        // 已经得过星星直接弹统计,或者没有全对弹统计
                                        this.setState({
                                            answerStatisticsModalVisible: true,
                                        });
                                    } else {
                                        if (!isGrade) {
                                            this.props.getStars("abcs");
                                        }
                                    }
                                }
                            }
                        );
                    }, 500);
                } else {
                    this.setState(
                        {
                            answerStatisticsModalVisible: true,
                        },
                        () =>
                            console.log(
                                "this.state.answerStatisticsModalVisible",
                                this.state.answerStatisticsModalVisible
                            )
                    );
                }
            })
            .catch((e) => {
                //console.log(e)
            });
    };
    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
    };
    helpMe = () => {
        console.log(this.exerciseRef);
        this.exerciseRef?.helpMe(true);
    };
    resetToLogin = () => {
        NavigationUtil.resetToLogin(this.props);
    };
    render() {
        const { list, listindex, statuslist } = this.state;

        return (
            <ImageBackground
                source={require("../../../../../images/english/sentence/sentenceBg.png")}
                resizeMode="cover"
                style={[
                    ,
                    { flex: 1, position: "relative", paddingTop: 0 },
                    appStyle.flexCenter,
                ]}
            >
                <TouchableOpacity
                    onPress={this.goBack}
                    style={[
                        {
                            position: "absolute",
                            top: pxToDp(48),
                            left: pxToDp(40),
                            zIndex: 0,
                        },
                    ]}
                >
                    <Image
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                        style={[size_tool(120, 80)]}
                    />
                </TouchableOpacity>
                <View
                    style={[
                        {
                            height: pxToDp(140),
                            width: pxToDp(1700),
                            backgroundColor: "#F5F1F8",
                            marginBottom: pxToDp(20),
                        },
                        borderRadius_tool(0, 0, 30, 30),
                        appStyle.flexCenter,
                        padding_tool(0, 40, 0, 80),
                    ]}
                >
                    <ScrollView style={[{ flex: 1 }]} horizontal={true}>
                        <View
                            style={[
                                appStyle.flexTopLine,
                                appStyle.flexCenter,
                                { height: pxToDp(140) },
                            ]}
                        >
                            {statuslist.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={[
                                            appStyle.flexCenter,
                                            borderRadius_tool(100),
                                            {
                                                height: pxToDp(72),
                                                minWidth: pxToDp(72),
                                                borderWidth: pxToDp(6),
                                                borderColor:
                                                    index === listindex ? "#864FE3" : "transparent",
                                                backgroundColor:
                                                    item === "right"
                                                        ? "#16C792"
                                                        : item === "wrong"
                                                            ? "#F2645B"
                                                            : "transparent",
                                                marginRight: pxToDp(
                                                    index === statuslist.length - 1 ? 0 : 24
                                                ),
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: pxToDp(36),
                                                    color: item ? "#fff" : "#475266",
                                                },
                                                fonts.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            {index + 1}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                <View
                    style={[
                        { flex: 1, position: "relative" },
                        appStyle.flexTopLine,
                        appStyle.flexCenter,
                        padding_tool(0, 80, 80, 80),
                    ]}
                >
                    <TouchableOpacity
                        onPress={this.helpMe}
                        style={[
                            size_tool(100),
                            {
                                position: "absolute",
                                top: -20,
                                right: pxToDp(60),
                                zIndex: 999,
                            },
                        ]}
                    >
                        <Image
                            style={[size_tool(120, 80)]}
                            resizeMode="contain"
                            source={require("../../../../../images/MathKnowledgeGraph/help_btn_1.png")}
                        />
                    </TouchableOpacity>
                    <View
                        style={[
                            appStyle.flexCenter,
                            { flex: 1, backgroundColor: "#fff", borderRadius: pxToDp(40) },
                        ]}
                    >
                        {list.length > 0 ? (
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        width: "100%",
                                    },
                                    appStyle.flexCenter,
                                ]}
                            >
                                {list.length > 0 &&
                                    list[listindex]?.exercise_type_public === "MCQ" ? (
                                    <CheckExercise
                                        resetToLogin={this.resetToLogin}
                                        exercise={{
                                            ...list[listindex],
                                        }}
                                        saveExercise={this.saveExercise}
                                        onRef={(view) => {
                                            console.log("ref", view);
                                            if (view) this.exerciseRef = view;
                                        }}
                                    />
                                ) : null}

                                {list.length > 0 &&
                                    list[listindex]?.exercise_type_public === "FTB" ? (
                                    <SpeakExercise
                                        resetToLogin={this.resetToLogin}
                                        exercise={{
                                            ...list[listindex],
                                        }}
                                        saveExercise={this.saveExercise}
                                        onRef={(view) => {
                                            console.log("ref", view);
                                            if (view) this.exerciseRef = view;
                                        }}
                                    />
                                ) : null}
                            </View>
                        ) : (
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        paddingTop: Platform.OS === "ios" ? pxToDp(200) : 0,
                                    },
                                ]}
                            >
                                <ImageBackground
                                    source={require("../../../../../images/chineseHomepage/chineseNoExercise.png")}
                                    style={[
                                        size_tool(760, 770),
                                        appStyle.flexCenter,
                                        padding_tool(0, 30, 300, 0),
                                    ]}
                                    resizeMode={"contain"}
                                >
                                    <Text
                                        style={[
                                            {
                                                fontSize: pxToDp(56),
                                                color: "#b75526",
                                                fontFamily:
                                                    Platform.OS === "ios"
                                                        ? "Muyao-Softbrush"
                                                        : "Muyao-Softbrush-2",
                                            },
                                        ]}
                                    >
                                        暂无习题
                                    </Text>
                                </ImageBackground>
                            </View>
                        )}
                    </View>
                </View>
                <AnswerStatisticsModal
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    yesNumber={this.state.correct}
                    noNumber={this.state.wrong}
                    waitNumber={this.state.blank}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                ></AnswerStatisticsModal>
                {this.state.visibleGood ? (
                    <View
                        style={[
                            appStyle.flexCenter,
                            {
                                width: "100%",
                                height: Dimensions.get("window").height,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                zIndex: 999,
                            },
                        ]}
                    >
                        <Image
                            style={[size_tool(660)]}
                            source={require("../../../../../images/chineseHomepage/pingyin/new/good.png")}
                        />
                    </View>
                ) : null}
                <Congrats
                    finish={() => {
                        this.setState({
                            answerStatisticsModalVisible: true,
                        });
                    }}
                ></Congrats>
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
        moduleCoin: state.getIn(["userInfo", "moduleCoin"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        getStars(data) {
            dispatch(childrenCreators.getStars(data));
        },
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
