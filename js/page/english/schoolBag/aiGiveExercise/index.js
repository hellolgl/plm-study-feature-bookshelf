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
import CheckExercise from "../bagExercise/components/checkExercise";
import AnswerStatisticsModal from "../../../../component/chinese/sentence/staticsModal";
import SpeakExercise from "../bagExercise/components/speakExercise";
import pinyin from "../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";
import Reading from "../bagExercise/components/reading";
import ImmediatelyPlay from "../../../../util/audio/playAudio";
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import Sentence from './components/sentence'
import _ from 'lodash'

class EnglishAiGiveExercise extends PureComponent {
    constructor(props) {
        super(props);
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
            finishTxt: {
                main: "完成",
            },
            visibleGood: false,
            answer_start_time: this.getTime(),
            dataObj: this.props.navigation.state.params.data,

            word_type: '1' //1：words 2：短语；3：句子；4：文章）
        };
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";

        this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";

        this.exerciseRef = undefined;
        this.eventListener = undefined
        this.exercise_set_id = ''
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
        this.props.setSelectModule({ alias: 'english_AIPractice' })
    }

    getList = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { word_type } = this.state
        const data = {
            grade_code: userInfoJs.checkGrade,
            term_code: userInfoJs.checkTeam,
            word_type
        };
        axios.get(api.getEnglishAIExercise, { params: data }).then((res) => {
            // console.log("回调======", res.data);
            if (res.data.err_code === 0) {
                let data = res.data.data.data
                if (word_type === '3') {
                    data = res.data.data
                }
                let statuslist = [];
                data.forEach(() => {
                    statuslist.push("");
                });
                if (word_type !== '3') {
                    this.exercise_set_id = res.data.data.exercise_set_id
                }
                this.setState({
                    list: data,
                    statuslist,
                }, () => {
                    // 1，3，4为words里面的题，4为grammar里面的题
                    this.props.setSelectModule({ alias: word_type === '3' ? 'english_Sentences' : 'english_toSelectUnitEn1' })
                });
            }
        })
        return
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
    handleSentenceNext = (correctValue) => {
        // 2错，其他都为对
        let index = this.state.listindex;
        let listnow = _.cloneDeep(this.state.statuslist);
        let { correct, wrong, list } = this.state;
        if (correctValue === '2') {
            ++wrong
        } else {
            ++correct
        }
        listnow[index] = correctValue === '2' ? "wrong" : "right";
        ++index
        this.setState({
            wrong,
            correct,
            statuslist: listnow,
        })
        if (index < list.length) {
            this.setState(
                {
                    listindex: index,
                },
                () => {
                    this.exerciseRef?.getData()
                }
            );
        } else {
            this.exerciseRef?.saveThisExercise()
            this.setState({
                answerStatisticsModalVisible: true,
            })
        }
    }
    saveExercise = async (value) => {
        let index = this.state.listindex;
        let { correct, wrong, word_type, answer_start_time, list } = this.state;
        const { userInfo, textBookCode } = this.props;
        const userInfoJs = userInfo.toJS();
        let obj = {
            grade_code: userInfoJs.checkGrade,
            term_code: userInfoJs.checkTeam,
            textbook: textBookCode,
            student_code: userInfoJs.id,
            unit_code: value.unit_code,
            origin: value.origin,
            knowledge_point: value.knowledge_point,
            exercise_id: value.exercise_id,
            exercise_result: value.exercise_result,
            exercise_set_id: this.exercise_set_id,
            is_modification: false,
            answer_start_time, // 答题开始时间
            answer_end_time: this.getTime(), // 答题结束时间
            correction: value.correct === 1 ? 0 : 1, //批改对错，0 正确 1错误
            is_finish: index === list.length - 1 ? 0 : 1, //整套题是否做完,0  做完，，1没做完
            kpg_type: parseInt(word_type),
            modular: 1,
            sub_modular: parseInt(word_type),
            // stu_origin,
            alias: "english_toSelectUnitEn1",
            knowledgepoint_type: value.knowledgepoint_type
        };
        // console.log('题目保存参数：：：：：：：：：：：', obj)
        axios.post(api.saveMystudyExercise, obj).then((res) => {
            // console.log('题目保存结果:::::::', res.data)
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
                                                            answerStatisticsModalVisible: true,
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
                                                    answerStatisticsModalVisible: true,
                                                },
                                            );
                                        }
                                    );
                                }, 500);
                            }
                        })
                    } else {
                        this.setState(
                            {
                                answerStatisticsModalVisible: true,
                            }
                        );
                    }
                }
            }
        });
    };
    saveAll = () => {
        const data = {};
        data.exercise_set_id = this.exercise_set_id;
        data.student_code = this.props.userInfo.toJS().id;
        // console.log('保存套题:::::', data)
        axios
            .put(api.saveMystudyExerciseAll, data)
            .then((res) => {
                // console.log('保存套题:::::', res.data)
            })
            .catch((e) => {
                //console.log(e)
            });
    };
    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
    };
    audioPausedSuccess = () =>
        this.setState({ pausedSuccess: true, pausedfail: true });
    helpMe = () => {
        this.exerciseRef?.helpMe(true);
    };
    resetToLogin = () => {
        NavigationUtil.resetToLogin(this.props);
    };
    nextSteps = () => {
        let type = parseInt(this.state.word_type)
        type++
        this.setState({
            word_type: type + '',
            answerStatisticsModalVisible: false,
            correct: 0,
            wrong: 0,
            list: [],
            listindex: 0,
            statuslist: []
        }, () => {
            this.getList()
        })
    }
    renderTopic = () => {
        const { list, listindex, word_type } = this.state
        if (list.length) {
            if (word_type === '3') {
                return <Sentence exercise={_.cloneDeep(list[listindex])} onRef={(view) => {
                    if (view) this.exerciseRef = view;
                }} handleNext={(correct) => {
                    this.handleSentenceNext(correct)
                }}></Sentence>
            } else {
                let content = null
                if (list[listindex]?.exercise_type_public === "MCQ" || list[listindex]?.exercise_type_private === "MCQ") {
                    content = <View style={[appStyle.flexLine, { flex: 1 }]}>
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
                }
                if (list[listindex]?.exercise_type_public === "FTB") {
                    content = <SpeakExercise
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
                }
                return content
            }
        } else {
            return <View
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
                        题目生成中...
                    </Text>
                </ImageBackground>
            </View>
        }
    }
    render() {
        const { list, listindex, statuslist, word_type } = this.state;

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
                    {word_type === '3' ? null : <TouchableOpacity
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
                    </TouchableOpacity>}
                    <View
                        style={[
                            appStyle.flexCenter,
                            { flex: 1, backgroundColor: "#fff", borderRadius: pxToDp(40) },
                        ]}
                    >
                        <View
                            style={[
                                {
                                    flex: 1,
                                    width: "100%",
                                },
                                appStyle.flexCenter,
                            ]}
                        >
                            {this.renderTopic()}
                        </View>
                    </View>
                </View>
                <AnswerStatisticsModal
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    yesNumber={this.state.correct}
                    noNumber={this.state.wrong}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={word_type === '4' ? '完成' : '继续挑战'}
                    showNext={word_type !== '4'}
                    next={this.nextSteps}
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
        setSelectModule(data) {
            dispatch(actionCreatorsUserInfo.setSelectModule(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(EnglishAiGiveExercise);
