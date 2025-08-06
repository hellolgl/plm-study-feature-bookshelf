import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { padding_tool, pxToDp, size_tool } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import { appStyle, appFont } from "../../../../../theme";
import Audio from "../../../../../util/audio/audio";
import url from "../../../../../util/url";
import ReadingHelpModal from "../../../../../component/chinese/reading/ReadingHelpModal";
import PlayAudio from "../../../../../util/audio/playAudio";

let audio = undefined;
// let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
class DoWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.audioHelp = undefined;
        this.audioHelp1 = undefined;
        this.state = {
            canvasWidth: 0,
            canvasHeight: 0,
            topaicNum: 0,
            //题目列表，后期可能改动
            fromServeCharacterList: [],
            isEnd: false,
            topaicIndex: 0,
            topicMap: new Map(),
            status: false,
            gifUrl: "",
            indentifyContext: "",
            visible: false,
            diagnose_notes: "", // 诊断标记
            canvasData: "",
            isKeyExercise: false,
            lookDetailNum: 0,
            answer_start_time: new Date().getTime(),
            answer_end_time: "",
            checkedIndex: -1,
            //题目统计结果
            blank: 0,
            wrong: 0,
            answerStatisticsModalVisible: false,
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            exerciseInfo: props.exercise,
            explanation_audio: "",
            isStartAudio: false,
            playStatus: false,
            isStartAudio1: false,
            answer_content: "",
            correct: 0, //答案
            answer_times: 0,
            renderOptionList: true,
            isWrong: props.isWrong,
            lookHelp: false,
            btnTxt: "关闭",
            diagnose_notes_audio: "",
            stem_explain_audio: "",
        };

        this.isHelpClick = false; //诊断标记点击关闭还是帮助
    }

    static navigationOptions = {
        // title:'答题'
    };
    renderOptionList = true;

    goBack = () => {
        this.closeAudio();
        NavigationUtil.goBack(this.props);
    };

    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        this.setState({ answerStatisticsModalVisible: false });
        NavigationUtil.goBack(this.props);
    };

    //关闭语音播放
    closeAudio = () => {
        if (audio) {
            //console.log("关闭语音");
            audio.stop();
            audio = undefined;
            this.setState(() => ({
                playStatus: false,
            }));
        }
    };

    componentDidMount() {
        // console.log(userInfoJs, 'userInfoJs')
        console.log("参数", this.props);
        this.setState({
            exerciseInfo: this.props.exercise,
        });
        console.log(this.props.selestModule.toJS())
    }

    checkAnswer = (index) => {
        this.setState({
            checkedIndex: index,
        });
    };

    renderWriteTopaic = () => {
        const { exerciseInfo, optionList } = this.state;
        const data = exerciseInfo;
        let baseUrl = url.baseURL + data.private_stem_picture;
        let arr = [];
        // console.log(
        //   "状态",
        //   this.renderOptionList,
        //   data.exercise_content,
        //   this.props.exercise.exercise_content
        // );
        if (data.exercise_content) {
            if (this.renderOptionList) {
                arr = data.exercise_content ? data.exercise_content.split("#") : [];
                let randomNumber = function () {
                    // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
                    // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
                    // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
                    return 0.5 - Math.random();
                };
                arr.sort(randomNumber);
                this.setState({
                    optionList: [...arr],
                    // renderOptionList: false,
                });
                this.renderOptionList = false;
            } else {
                arr = [...optionList];
            }
        }
        // console.log("baseUrl", baseUrl)

        if (!data.exercise_id) {
            return <Text style={{ fontSize: pxToDp(32) }}>数据加载中...</Text>;
        } else {
            let richWidth = data?.public_exercise_stem ? pxToDp(600) : pxToDp(1700);
            data.private_stem_picture ? (richWidth = richWidth - pxToDp(340)) : "";
            return (
                // 不同题型组装题目
                <View style={[{ flex: 1 }, padding_tool(0, 40, 120, 40)]}>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                        <View style={[{ width: richWidth }]}>
                            {data.exercise_stem_audio ? (
                                <Audio
                                    audioUri={`${url.baseURL}${data.exercise_stem_audio}`}
                                    pausedBtnImg={require("../../../../../images/audio/audioPlay.png")}
                                    pausedBtnStyle={{
                                        width: pxToDp(198),
                                        height: pxToDp(95),
                                    }}
                                    playBtnImg={require("../../../../../images/audio/audioPause.png")}
                                    playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
                                    rate={0.75}
                                    onRef={(ref) => {
                                        this.audioRef = ref;
                                    }}
                                >
                                    <RichShowView
                                        width={richWidth}
                                        value={
                                            data.private_exercise_stem
                                                ? data.private_exercise_stem
                                                : ""
                                        }
                                        size={6}
                                    ></RichShowView>
                                </Audio>
                            ) : (
                                <RichShowView
                                    width={richWidth}
                                    value={
                                        data.private_exercise_stem ? data.private_exercise_stem : ""
                                    }
                                    size={6}
                                ></RichShowView>
                            )}
                            {data.private_stem_audio ? (
                                <Audio
                                    audioUri={`${url.baseURL}${data.private_stem_audio}`}
                                    pausedBtnImg={require("../../../../../images/chineseHomepage/composition/audioPlay.png")}
                                    pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                    playBtnImg={require("../../../../../images/chineseHomepage/composition/audiostop.png")}
                                    playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                />
                            ) : null}
                        </View>
                        {data.private_stem_picture ? (
                            <Image
                                style={{
                                    width: pxToDp(374),
                                    height: pxToDp(280),
                                    resizeMode: "contain",
                                }}
                                source={{ uri: baseUrl }}
                            ></Image>
                        ) : null}
                    </View>

                    <View
                        style={{
                            paddingTop: pxToDp(20),
                            width: "100%",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {arr.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.checkAnswer(index)}
                                    key={index}
                                    style={[
                                        {
                                            minWidth: pxToDp(600),
                                            minHeight: pxToDp(140),
                                            backgroundColor:
                                                this.state.checkedIndex === index
                                                    ? "#FFAE2F"
                                                    : "#E7E7F2",
                                            marginBottom: pxToDp(40),
                                            paddingBottom: pxToDp(10),
                                            borderRadius: pxToDp(40),
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            appStyle.flexCenter,
                                            {
                                                felx: 1,
                                                minHeight: pxToDp(136),
                                                backgroundColor:
                                                    this.state.checkedIndex === index
                                                        ? "#FFD983"
                                                        : "#F5F5FA",
                                                borderRadius: pxToDp(40),
                                                padding: pxToDp(20),
                                            },
                                        ]}
                                    >
                                        {data?.content_picture === "1" ? (
                                            <Image
                                                style={{
                                                    width: pxToDp(400),
                                                    height: pxToDp(200),
                                                    resizeMode: "contain",
                                                    borderRadius: pxToDp(40),
                                                }}
                                                source={{
                                                    uri:
                                                        "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                                                        item,
                                                }}
                                            />
                                        ) : (
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: pxToDp(40),
                                                        lineHeight: pxToDp(50),
                                                        color: "#475266",
                                                    },
                                                    appFont.fontFamily_syst,
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }
    };

    //获取canvas手写数据

    onClose = () => {
        const {
            lookHelp,
            exerciseInfo,
            answer_content,
            answer_times,
            isKeyExercise,
            answer_start_time,
        } = this.state;
        if (!lookHelp) {
            let endTime = new Date().getTime();
            this.props.nextExercise(
                {
                    ...exerciseInfo,
                    correct: 0,
                    answer_times: answer_times,
                    answer_content: answer_content,
                    answer_start_time, // 答题开始时间
                    answer_end_time: endTime, // 答题结束时间
                },
                isKeyExercise
            );
            this.setState({
                isKeyExercise: !isKeyExercise,
                answer_start_time: new Date().getTime(),
            });
        }
        this.setState({
            visible: false,
            btnTxt: "关闭",
            diagnose_notes: "",
            diagnose_notes_audio: "",
        });
    };
    nextTopaic = () => {
        const { token } = this.props;
        if (!token && this.props.resetToLogin) {
            this.props.resetToLogin();
            return;
        }
        // this.refs.canvas._nextTopaic();
        this.closeAudio();
        let index = this.state.checkedIndex;
        const {
            exerciseInfo,
            optionList,
            answer_start_time,
            isKeyExercise,
            lookHelp,
        } = this.state;
        let str = ""; // 讲解
        let correctnow = 0; //错误0 良好1  正确2
        let answer_contentnow = optionList[index];
        if (index === -1) {
            return;
        }
        let endTime = new Date().getTime();
        let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);
        let yesOrNo = optionList[index] === exerciseInfo.answer_content;

        if (yesOrNo && !lookHelp) {
            // 正确，当前题目为推送的要素题时不论对错都保存
            isKeyExercise ? "" : PlayAudio.playSuccessSound(url.successAudiopath2);
            correctnow = 2;
            this.props.nextExercise(
                {
                    ...exerciseInfo,
                    correct: correctnow,
                    answer_times: answer_timesnow,
                    answer_content: answer_contentnow,
                    answer_start_time, // 答题开始时间
                    answer_end_time: endTime, // 答题结束时间
                },
                isKeyExercise
            );
            this.setState({
                renderOptionList: true,
                checkedIndex: -1,
                lookHelp: false,
                answer_start_time: new Date().getTime(),
            });
        } else {
            let arr = [...exerciseInfo.exercise_content.split("#")];
            let diagnose_notes_audio = "";
            for (let i in arr) {
                if (optionList[index] === arr[i]) {
                    str = yesOrNo
                        ? "请继续努力！"
                        : exerciseInfo.diagnose_notes.split("#")[i];
                    diagnose_notes_audio = yesOrNo
                        ? ""
                        : exerciseInfo.diagnose_notes_audio &&
                        exerciseInfo.diagnose_notes_audio[i];
                }
            }
            diagnose_notes_audio ? "" : PlayAudio.playSuccessSound(url.failAudiopath);

            correctnow = 0;
            this.setState({
                visible: true,
                diagnose_notes: str,
                knowledgepoint_explanation:
                    exerciseInfo && exerciseInfo.knowledgepoint_explanation != ""
                        ? exerciseInfo.knowledgepoint_explanation
                        : "",
                explanation_audio:
                    exerciseInfo && exerciseInfo.explanation_audio
                        ? exerciseInfo.explanation_audio
                        : "",
                btnTxt: isKeyExercise ? "关闭" : "再来一次",
                renderOptionList: true,
                checkedIndex: -1,
                lookHelp: false,
                answer_times: answer_timesnow,
                answer_content: answer_contentnow,
                diagnose_notes_audio,
                stem_explain_audio:
                    exerciseInfo && exerciseInfo.audio != "" ? exerciseInfo.audio : "",
            });
        }

        this.renderOptionList = true;
    };
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (
            JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)
        ) {
            tempState.exerciseInfo = props.exercise;
            tempState.renderOptionList = true;
            tempState.isKeyExercise = false;
            return tempState;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.exerciseInfo.exercise_id !== this.state.exerciseInfo.exercise_id
        ) {
            this.renderOptionList = true;
            this.setState({
                renderOptionList: false,
            });
        }
    }
    helpMe = (isHelp) => {
        // 点击查看帮助
        let { exerciseInfo } = this.state;
        this.closeAudio();
        this.setState({
            knowledgepoint_explanation:
                exerciseInfo && exerciseInfo.knowledgepoint_explanation != ""
                    ? exerciseInfo.knowledgepoint_explanation
                    : "",
            visible: true,
            explanation_audio:
                exerciseInfo && exerciseInfo.explanation_audio
                    ? exerciseInfo.explanation_audio
                    : "",
            lookHelp: isHelp,
            btnTxt: "关闭",
            stem_explain_audio:
                exerciseInfo && exerciseInfo.audio != "" ? exerciseInfo.audio : "",
        });
    };
    onCloseHelp = () => {
        this.setState({
            status: false,
        });
    };

    renderButton = () => {
        const { isWrong } = this.state;
        return (
            <TouchableOpacity style={styles.topaicBtn} onPress={this.nextTopaic}>
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
                        {isWrong ? "提交" : "下一题"}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    aiHelp = () => {
        const { exerciseInfo, diagnose_notes, lookHelp } = this.state;
        const { token } = this.props;
        if (!token && this.props.resetToLogin) {
            this.props.resetToLogin();
            return;
        }
        this.setState({
            lookHelp: true,
            isShuffle: false,
        });
        NavigationUtil.toChineseSyncReadingAiHelp({
            navigation: this.props.navigation,
            data: {
                exercise_id: exerciseInfo.exercise_id,
            },
        });
    };

    render() {
        const {
            exerciseInfo,
            explanation_audio,
            btnTxt,
            diagnose_notes_audio,
            stem_explain_audio,
        } = this.state;
        return (
            // <SafeAreaView style={[{ flex: 1, backgroundColor: "pink" }]}>
            <View style={styles.mainWrap}>
                <View style={[styles.container, appStyle.flexTopLine]}>
                    {exerciseInfo.public_exercise_stem ? (
                        <View
                            style={[
                                {
                                    width: pxToDp(1200),
                                    marginRight: pxToDp(40),
                                    backgroundColor: "#fff",
                                    borderRadius: pxToDp(40),
                                    height: "100%",
                                },
                                padding_tool(50, 0, 40, 40),
                            ]}
                        >
                            <ScrollView>
                                {exerciseInfo.public_stem_audio ? (
                                    <Audio
                                        audioUri={`${url.baseURL}${exerciseInfo.public_stem_audio}`}
                                        pausedBtnImg={require("../../../../../images/chineseHomepage/composition/audioPlay.png")}
                                        pausedBtnStyle={{
                                            width: pxToDp(360),
                                            height: pxToDp(140),
                                        }}
                                        playBtnImg={require("../../../../../images/chineseHomepage/composition/audiostop.png")}
                                        playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                    />
                                ) : null}
                                {exerciseInfo.stem_audio ? (
                                    <Audio
                                        audioUri={`${url.baseURL}${exerciseInfo.stem_audio}`}
                                        pausedBtnImg={require("../../../../../images/audio/audioPlay.png")}
                                        pausedBtnStyle={{
                                            width: pxToDp(198),
                                            height: pxToDp(95),
                                        }}
                                        playBtnImg={require("../../../../../images/audio/audioPause.png")}
                                        playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
                                        // rate={0.75}
                                        onRef={(ref) => {
                                            this.audioRef = ref;
                                        }}
                                    >
                                        <RichShowView
                                            width={pxToDp(1100)}
                                            value={
                                                exerciseInfo.public_exercise_stem
                                                    ? exerciseInfo.public_exercise_stem
                                                    : ""
                                            }
                                            size={6}
                                        />
                                    </Audio>
                                ) : (
                                    <RichShowView
                                        width={pxToDp(1100)}
                                        value={
                                            exerciseInfo.public_exercise_stem
                                                ? exerciseInfo.public_exercise_stem
                                                : ""
                                        }
                                        size={6}
                                    />
                                )}

                                {exerciseInfo.public_stem_picture ? (
                                    <View style={[appStyle.flexAliCenter]}>
                                        <Image
                                            style={{
                                                width: pxToDp(374),
                                                height: pxToDp(280),
                                                resizeMode: "contain",
                                            }}
                                            source={{
                                                uri: `${url.baseURL}${exerciseInfo.public_stem_picture}`,
                                            }}
                                        />
                                    </View>
                                ) : null}
                            </ScrollView>
                        </View>
                    ) : null}
                    <View style={styles.topaic}>
                        <ScrollView style={[{ width: "100%", height: "100%" }]}>
                            {this.renderWriteTopaic()}
                        </ScrollView>
                    </View>
                    {this.renderButton()}
                </View>
                <ReadingHelpModal
                    status={this.state.visible}
                    goback={this.onClose.bind(this, 1)}
                    audio={explanation_audio}
                    knowledgepoint_explanation={this.state.knowledgepoint_explanation}
                    diagnose_notes={this.state.diagnose_notes}
                    btnTxt={btnTxt}
                    diagnose_notes_audio={diagnose_notes_audio}
                    stem_explain_audio={stem_explain_audio}
                />
                {this.props.selestModule.toJS().alias === "chinese_toDoExercise" || this.props.selestModule.toJS().alias === 'chinese_toWisdomTree' || this.props.selestModule.toJS().alias === 'chinese_toChooseText' ? null :
                    <TouchableOpacity
                        style={[styles.helpBtn]}
                        onPress={() => {
                            this.aiHelp();
                        }}
                    >
                        <Image
                            style={[size_tool(200, 150)]}
                            source={require("../../../../../images/chineseHomepage/reading/saraHelp.png")}
                            resizeMode="contain"
                        ></Image>
                    </TouchableOpacity>
                }

                <AnswerStatisticsModal
                    dialogVisible={this.state.answerStatisticsModalVisible}
                    yesNumber={this.state.correct}
                    noNumber={this.state.wrong}
                    waitNumber={this.state.blank}
                    closeDialog={this.closeAnswerStatisticsModal}
                ></AnswerStatisticsModal>
            </View>
            // </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        width: "100%",
        flex: 1,
        // paddingBottom: 24,
        ...padding_tool(50, 40, 40, 40),
    },
    container: {
        flex: 1,
    },
    topaic: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        padding: pxToDp(40),
    },
    topaicBtn: {
        ...size_tool(200),
        borderRadius: pxToDp(200),
        backgroundColor: "#EF7B38",
        position: "absolute",
        bottom: pxToDp(40),
        right: pxToDp(40),
        paddingBottom: pxToDp(8),
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(-0),
        right: pxToDp(20),
        zIndex: 99,
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        selestModule: state.getIn(["userInfo", "selestModule"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
