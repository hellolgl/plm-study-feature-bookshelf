import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    DeviceEventEmitter,
    Dimensions,
    ScrollView,
} from "react-native";
import { appStyle, appFont } from "../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import MixExercise from './mix/DoExercise'
import CheckExercise from "./components/checkExercise";
import AnswerStatisticsModal from "../../../../component/chinese/sentence/staticsModal";
import SpeakExercise from "./components/speakExercise";
import pinyin from "../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";
import Reading from "./components/reading";
import ImmediatelyPlay from "../../../../util/audio/playAudio";
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";

class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        let language_data = props.language_data.toJS();
        const { main_language_map, other_language_map, type, show_type } =
            language_data;
        this.state = {
            list: [],
            listindex: 0,
            exercise_set_id: "",
            answerStatisticsModalVisible: false,
            correct: 0,
            wrong: 0,
            blank: 0,
            pausedSuccess: true,
            pausedfail: true,
            audioIndex: "",
            statuslist: [],
            language_data,
            finishTxt: {
                main: "完成",
                // other: other_language_map.finish,
                // pinyin: pinyin.finish,
            },
            visibleGood: false,
            answer_start_time: this.getTime(),
            dataObj: this.props.navigation.state.params.data,
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

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.answerStatisticsModalVisible !==
            this.state.answerStatisticsModalVisible
        ) {
            if (this.state.answerStatisticsModalVisible === true) {
                ImmediatelyPlay.playAnswerFinish();
            }
        }
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("backRecordList")
    }

    getList = () => {
        const { dataObj } = this.state;
        let {
            mode,
            exercise_origin,
            codeList,
            kpg_type,
            isTestMe,
            origin,
            ladder,
        } = dataObj;
        if (!isTestMe) {
            const data = {
                origin: exercise_origin,
                knowledge_point_code: kpg_type === 4 ? [] : codeList,
                modular: mode, //1 my study 2 test me 3 泡泡
                sub_modular: kpg_type, // 1 单词 2短语  3句子 4文章
                article_knowledge_point_code: kpg_type === 4 ? codeList : [],
            };
            // console.log("传的参数", data);
            // kpg_type ===4
            //   ? (data.article_knowledge_point_code = codeList)
            //   : "";
            let url = api.getEnglishKnowExerciseList;
            // mode === 2
            //   ? api.SynchronizeDiagnosisEn
            //   : api.getEnglishKnowExerciseList;
            axios.post(url, data).then((res) => {
                console.log("回调", res.data.data);
                if (res.data.err_code === 0) {
                    let statuslist = [];
                    res.data.data.forEach(() => {
                        statuslist.push("");
                    });
                    this.setState({
                        list: res.data.data,
                        exercise_set_id: res.data.data[0]?.exercise_set_id,
                        statuslist,
                    });
                }
            })
        } else {
            axios
                .get(api.getEnglishTestMeExercise, {
                    params: {
                        origin: origin,
                        ladder: ladder,
                    },
                })
                .then((res) => {
                    let list = res.data.data;
                    if (res.data.err_code === 0) {
                        let statuslist = [];
                        list.forEach(() => {
                            statuslist.push("");
                        });
                        this.setState({
                            list,
                            exercise_set_id: list[0]?.exercise_set_id,
                            statuslist,
                        });
                    }
                });
        }
    };
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
    saveExercise = async (value) => {
        let index = this.state.listindex;

        let { correct, wrong, dataObj } = this.state;
        const { userInfo, textBookCode, selestModule } = this.props;
        const userInfoJs = userInfo.toJS();
        let {
            exercise_origin,
            unit_code,
            ladder,
            isTestMe,
            mode,
            kpg_type,
            stu_origin,
        } = dataObj;
        let obj = {
            grade_code: userInfoJs.checkGrade,
            term_code: userInfoJs.checkTeam,
            textbook: textBookCode,
            student_code: userInfoJs.id,
            unit_code: unit_code,
            origin: exercise_origin,
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
            modular: mode, //1 my study 2 test me 3 泡泡
            sub_modular: kpg_type, // 1 单词短语  2 句子文章
            stu_origin,
            alias: isTestMe ? "english_toSelectUnitEn2" : "english_toSelectUnitEn1",
            knowledgepoint_type: value.knowledgepoint_type,
        };
        if (selestModule.toJS().alias === 'english_toSelectUnitEn1') {
            // words模块在全部单元选择单元答题需要从origin里取年级学期
            obj.grade_code = exercise_origin.substring(4, 6)
            obj.term_code = exercise_origin.substring(6, 8)
        }
        let sendUrl = isTestMe ? api.saveTestmeExercise : api.saveMystudyExercise;
        // console.log('题目保存参数：：：：：：：：：：：', obj)
        axios.post(sendUrl, obj).then((res) => {
            // console.log('题目保存结果:::::::', res.data)
            if (res.data.err_code === 0) {
                ++index;
                value.correct === 1 ? ++correct : ++wrong;
                // console.log(
                //   "回调456",
                //   index,
                //   this.state.list.length,
                //   index < this.state.list.length
                // );
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
                    // pausedSuccess: flag,
                    // pausedfail: audioFlag,
                    correct,
                    wrong,
                    audioIndex: arr[audioindex] + "",
                    statuslist: listnow,
                    visibleGood: this.props.moduleCoin < 30 ? false : !flag,
                });
                if (index < this.state.list.length) {
                    // this.props.getRewardCoin()
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
                    this.saveAll();
                    if (!flag) {
                        // console.log("！flag");
                        getRewardCoinLastTopic().then(res => {
                            if (res.isReward) {
                                // 展示奖励弹框,在动画完后在弹统计框
                                this.eventListener = DeviceEventEmitter.addListener(
                                    "rewardCoinClose",
                                    () => {
                                        setTimeout(() => {
                                            this.setState(
                                                {
                                                    visibleGood: false,
                                                },
                                                () => {
                                                    this.setState(
                                                        {
                                                            // statuslist: listnow,
                                                            // correct, wrong,
                                                            answerStatisticsModalVisible: true,
                                                            // pausedSuccess: value.correct === 1 ? false : true
                                                        },
                                                        () => {
                                                            // console.log('变了的数据', this.state.answerStatisticsModalVisible)
                                                        }
                                                    );
                                                }
                                            );
                                        }, 500);
                                        this.eventListener && this.eventListener.remove()
                                    }
                                );
                            } else {
                                setTimeout(() => {
                                    this.setState(
                                        {
                                            visibleGood: false,
                                        },
                                        () => {
                                            this.setState(
                                                {
                                                    // statuslist: listnow,
                                                    // correct, wrong,
                                                    answerStatisticsModalVisible: true,
                                                    // pausedSuccess: value.correct === 1 ? false : true
                                                },
                                                () => {
                                                    // console.log('变了的数据', this.state.answerStatisticsModalVisible)
                                                }
                                            );
                                        }
                                    );
                                }, 500);
                            }
                        })
                    } else {
                        // console.log("flag=====");
                        this.setState(
                            {
                                answerStatisticsModalVisible: true,
                            }
                            // () =>
                            //   console.log(
                            //     "this.state.answerStatisticsModalVisible",
                            //     this.state.answerStatisticsModalVisible
                            //   )
                        );
                    }
                }
                // 异步问题没解决，要封装一个promise
            }
        });
    };
    saveAll = () => {
        const { exercise_set_id, dataObj } = this.state;
        let { stu_origin } = dataObj;
        const data = {};
        data.exercise_set_id = exercise_set_id;
        data.student_code = this.props.userInfo.toJS().id;
        data.stu_origin = stu_origin;
        let sendUrl = dataObj.isTestMe
            ? api.saveTestmeAllExercise
            : api.saveMystudyExerciseAll;
        axios
            .put(sendUrl, data)
            .then((res) => { })
            .catch((e) => {
                //console.log(e)
            });
    };
    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
        const { isTestMe, has_record } = this.state.dataObj;
        if (isTestMe && !has_record) {
            DeviceEventEmitter.emit("renderTestMeHome"); //返回页面刷新
        } else {
            DeviceEventEmitter.emit("backRecordList"); //返回页面刷新
        }
    };
    audioPausedSuccess = () =>
        this.setState({ pausedSuccess: true, pausedfail: true });
    helpMe = () => {
        console.log("this.exerciseRef", this.exerciseRef);
        this.exerciseRef?.helpMe(true);
    };
    resetToLogin = () => {
        NavigationUtil.resetToLogin(this.props);
    };
    render() {
        const { list, listindex, statuslist } = this.state;

        return (
            <ImageBackground
                source={require("../../../../images/english/sentence/sentenceBg.png")}
                resizeMode="cover"
                style={[
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
                        source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
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
                                                appFont.fontFamily_jcyt_700,
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
                            source={require("../../../../images/MathKnowledgeGraph/help_btn_1.png")}
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
                                    (list[listindex]?.exercise_type_public === "MCQ" ||
                                        list[listindex]?.exercise_type_private === "MCQ") ? (
                                    <View style={[appStyle.flexLine, { flex: 1 }]}>
                                        {list[listindex]?.exercise_type_public === "Dialogue" ? (
                                            <Reading
                                                exercise={{
                                                    ...list[listindex],
                                                }}
                                            />
                                        ) : null}
                                        <CheckExercise
                                            resetToLogin={this.resetToLogin}
                                            exercise={{
                                                ...list[listindex],
                                            }}
                                            saveExercise={this.saveExercise}
                                            onRef={(view) => {
                                                // console.log("ref", view);
                                                if (view) this.exerciseRef = view;
                                            }}
                                        />
                                    </View>
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
                                            // console.log("ref", view);
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
                                    source={require("../../../../images/chineseHomepage/chineseNoExercise.png")}
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
                    // dialogVisible={true}
                    yesNumber={this.state.correct}
                    noNumber={this.state.wrong}
                    waitNumber={this.state.blank}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                // language_data={this.state.language_data}
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
                            source={require("../../../../images/chineseHomepage/pingyin/new/good.png")}
                        />
                    </View>
                ) : null}
            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        language_data: state.getIn(["languageChinese", "language_data"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
        moduleCoin: state.getIn(["userInfo", "moduleCoin"]),
        selestModule: state.getIn(["userInfo", "selestModule"])
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
