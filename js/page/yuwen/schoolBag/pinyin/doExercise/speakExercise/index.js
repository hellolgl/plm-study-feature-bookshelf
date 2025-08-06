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
import {
    fontFamilyRestoreMargin,
    pxToDp,
    size_tool,
    pxToDpHeight
} from "../../../../../../util/tools";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import { Toast } from "antd-mobile-rn";
// import RichShowView from "../../../../../../component/richShowViewNew";
import { appStyle, appFont } from "../../../../../../theme";
import ReadingHelpModal from "../../../../../../component/chinese/pinyinHelpModal";
import Audio from "../../../../../../util/audio/audio";
import url from "../../../../../../util/url";
import RichShowView from "../../../../../../component/chinese/newRichShowView";

import fonts from "../../../../../../theme/fonts";
import Microphone from "../../../../../../component/microphone/index";
import ImmediatelyPlay from "../../../../../../util/audio/playAudio";
const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
let audio = undefined;
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
            //题目统计结果
            blank: 0,
            wrong: 0,
            answerStatisticsModalVisible: false,
            isEnd: false,
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            exerciseInfo: props.exercise,
            explanation_audio: "",
            playStatus: false,
            correct: 0, //答案
            answer_times: 0,
            renderOptionList: true,
            pausedPrivate: true,
            uploaAudioSrc: "",
            pausedfail: true,
            totalScore: 0,
            renderAudio: false,
            isRecording: false,
            scoreTxt: "长按录音并评分",
            score: 0,
        };

        this.isHelpClick = false; //诊断标记点击关闭还是帮助
        this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";
        this.scrollRef = undefined;
        this.audio1 = React.createRef();
        this.audio = React.createRef();
    }

    static navigationOptions = {
        // title:'答题'
    };
    renderOptionList = true;

    goBack = () => {
        this.audioPausedPrivate();
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        // console.log(userInfoJs, 'userInfoJs')
        this.setState({
            exerciseInfo: this.props.exercise,
        });
    }

    topaicContainerOnLayout = (e) => {
        let { width, height } = e.nativeEvent.layout;
        this.setState(() => ({
            canvasWidth: width,
            canvasHeight: height,
        }));
    };

    audioPausedPrivate = () => {
        this.setState({
            pausedPrivate: true,
        });
    };
    playAudio = () => {
        this.audio1.current.replay();
        this.setState({
            pausedPrivate: !this.state.pausedPrivate,
        });
    };

    renderWriteTopaic = () => {
        const {
            exerciseInfo,
            optionList,
            pausedPrivate,
            scoreTxt,
            isRecording,
            totalScore,
        } = this.state;
        const data = exerciseInfo;
        let baseUrl =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
            data?.private_stem_picture;
        console.log("状态data", data);

        // console.log("baseUrl", baseUrl)
        return (
            // 不同题型组装题目
            <View style={[{ felx: 1, width: "100%" }]}>
                <ScrollView ref={(view) => (this.scrollRef = view)}>
                    <View style={[appStyle.flexTopLine]}>
                        <View style={[{ marginRight: pxToDp(40) }]}>
                            {/* {data?.private_stem_audio ? (
                                <TouchableOpacity onPress={this.playAudio}>
                                    {!pausedPrivate ? (
                                        <Image
                                            style={[size_tool(200, 120),]}
                                            source={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                        ></Image>
                                    ) : (
                                        <Image
                                            style={[size_tool(200, 120),]}
                                            source={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            ) : null} */}
                            <Audio
                                audioUri={`${url.baseURL}${data.private_stem_audio}`}
                                pausedBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                playBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                            />
                        </View>
                        <View>
                            <RichShowView
                                value={
                                    data?.private_exercise_stem
                                        ? `<div id="yuanti">${data?.private_exercise_stem}</div>`
                                        : ""
                                }
                                size={2}
                                width={pxToDp(1500)}
                            // otherStyle={'text-align:center'}
                            // fontFamily={"jiangchengyuanti"}
                            ></RichShowView>
                            {this.props.show_translate ? <Text style={[{ fontSize: pxToDpHeight(50) }, appFont.fontFamily_syst]}>{data.translate_stem.en.replace(/<[^>]+>/g, '')}</Text> : null}
                        </View>
                        {/* {
                            data.private_stem_audio ?
                                <Audio uri={`${url.baseURL}${data.private_stem_audio}`} paused={pausedPrivate} pausedEvent={this.audioPausedPrivate} ref={this.audio1} />
                                : null
                        } */}
                    </View>

                    {data?.private_stem_picture ? (
                        <Image
                            style={{
                                width: pxToDp(400),
                                height: pxToDp(300),
                                resizeMode: "contain",
                                marginLeft: pxToDp(200),
                            }}
                            source={{ uri: baseUrl }}
                        ></Image>
                    ) : (
                        <Text></Text>
                    )}
                </ScrollView>

                <View
                    style={[
                        appStyle.flexCenter,
                        {
                            paddingTop: pxToDp(40),
                            position: "absolute",
                            width: pxToDp(400),
                            left: "50%",
                            marginLeft: pxToDp(-200),
                            bottom: pxToDp(0),
                        },
                    ]}
                >
                    {/* <AudioComponent uploadMP3={this.uploadMP3} isRender={renderAudio} /> */}
                    {console.log("题目信息", data)}
                    <View
                        style={[
                            { height: pxToDp(168), width: "100%" },
                            appStyle.flexCenter,
                        ]}
                    >
                        {isRecording ? null : (
                            <Text
                                style={[
                                    {
                                        fontSize: pxToDp(scoreTxt.length > 3 ? 28 : 80),
                                        color:
                                            scoreTxt.length > 3
                                                ? "#475266"
                                                : totalScore > 59
                                                    ? "#00D3A1"
                                                    : "#FF6A4D",
                                        opacity: 0.5,
                                    },
                                    fonts.fontFamily_jcyt_700,
                                ]}
                            >
                                {scoreTxt}
                            </Text>
                        )}
                    </View>

                    <Microphone
                        microphoneImg={require("../../../../../../images/chineseHomepage/pingyin/new/btn3.png")}
                        microphoneImgStyle={{ width: pxToDp(280), height: pxToDp(140) }}
                        activeMicrophoneImg={require("../../../../../../images/chineseHomepage/pingyin/new/btn3.png")}
                        activeMicrophoneImgStyle={{
                            width: pxToDp(280),
                            height: pxToDp(140),
                        }}
                        iseInfo={{
                            origin_tone: data.pinyin,
                            xun_fei: data.relation_character,
                            // words: [data.relation_character],
                            index: 0,
                        }}
                        onStartRecordEvent={() => {
                            this.setState({
                                isRecording: true,
                            });
                        }}
                        onFinishRecordEvent={(score) => {
                            // Toast.info(parseInt(score).toFixed(0))
                            // this.svecord(score)
                            this.setState({
                                isRecording: false,
                                totalScore: parseInt(score).toFixed(0),
                                scoreTxt: parseInt(score).toFixed(0) + "",
                            });
                        }}
                        waveStyle={{
                            width: pxToDp(600),
                            height: pxToDp(280),
                        }}
                        soundWavePosition={{
                            top: pxToDp(-280),
                            left: pxToDp(-160),
                        }}
                        backgroundColor={"#E6DBCF"}
                    />
                </View>
            </View>
        );
    };

    //获取canvas手写数据

    onClose = () => {
        const {
            exerciseInfo,
            correct,
            answer_times,
            answer_content,
            isKeyExercise,
        } = this.state;
        let isKeyExercisenow = isKeyExercise;
        if (this.props.isWrong) {
            this.props.saveExercise({
                ...exerciseInfo,
                answer_times,
                correct,
                answer_content,
                exercise_id: exerciseInfo.pb_id,
            });
            isKeyExercisenow = false;
            this.scrollRef.scrollTo({ y: 0 });
        } else {
            if (isKeyExercise || correct === 2) {
                this.props.saveExercise({
                    ...exerciseInfo,
                    answer_times,
                    correct,
                    answer_content,
                    exercise_id: exerciseInfo.pb_id,
                });
                isKeyExercisenow = false;
                this.scrollRef.scrollTo({ y: 0 });
            } else {
                isKeyExercisenow = true;
            }
        }
        this.renderOptionList = true;
        this.setState({
            visible: false,
            isKeyExercise: isKeyExercisenow,
            answer_start_time: new Date().getTime(),
        });
    };
    nextTopaic = () => {
        // this.refs.canvas._nextTopaic();
        this.audioPausedPrivate();
        const {
            totalScore,
            exerciseInfo,
            optionList,
            answer_start_time,
            correct,
            answer_times,
            answer_content,
            isKeyExercise,
        } = this.state;
        let str = ""; // 讲解
        let correctnow = 0; //错误0 良好1  正确2

        let endTime = new Date().getTime();
        let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);

        if (totalScore > 59) {
            correctnow = 1;
            console.log("分数123", totalScore);
            this.props.saveExercise({
                ...exerciseInfo,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                exercise_id: exerciseInfo.pb_id,
                totalScore,
            });
            this.setState({
                renderOptionList: true,
                totalScore: 0,
                scoreTxt: "长按录音并评分",
            });
            this.scrollRef.scrollTo({ y: 0 });
        } else {
            correctnow = 0;
            // this.audio.current.replay()
            ImmediatelyPlay.playSuccessSound(this.failAudiopath);
            this.setState({
                visible: true,
                renderOptionList: true,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                knowledgepoint_explanation:
                    exerciseInfo && exerciseInfo?.knowledgepoint_explanation != ""
                        ? exerciseInfo?.knowledgepoint_explanation
                        : " ",
                explanation_audio:
                    exerciseInfo && exerciseInfo?.explanation_audio
                        ? exerciseInfo?.explanation_audio
                        : "",
                pausedfail: false,
                totalScore: 0,
                scoreTxt: "长按录音并评分",
            });
        }

        this.renderOptionList = true;
    };
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (
            JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)
        ) {
            if (props.exercise.exercise_type_private === "1") {
                tempState.renderAudio = true;
            } else {
                tempState.renderAudio = false;
            }
            tempState.exerciseInfo = props.exercise;
            tempState.renderOptionList = true;
            tempState.isKeyExercise = false;
            // console.log("题目2222222", props.exercise, tempState.exerciseInfo);

            return tempState;
        } else {
            tempState.renderAudio = false;
            return tempState;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.exerciseInfo?.pb_id !== this.state.exerciseInfo?.pb_id) {
            this.renderOptionList = true;
            this.setState({
                renderOptionList: false,
            });
        }
    }
    helpMe = (isHelp) => {
        // 点击查看帮助
        let { exerciseInfo } = this.state;
        this.setState({
            knowledgepoint_explanation:
                exerciseInfo && exerciseInfo?.knowledgepoint_explanation != ""
                    ? exerciseInfo?.knowledgepoint_explanation
                    : " ",
            status: true,
            explanation_audio:
                exerciseInfo && exerciseInfo?.explanation_audio
                    ? exerciseInfo?.explanation_audio
                    : "",
        });
    };
    onCloseHelp = () => {
        this.setState({
            status: false,
        });
    };
    audioPausedSuccess = () => this.setState({ pausedfail: true });
    renderButton = () => {
        return (
            <TouchableOpacity
                style={styles.topaicBtn}
                ref="topaicBox"
                onLayout={(event) => this.topaicContainerOnLayout(event)}
                onPress={this.nextTopaic}
            >
                <ImageBackground
                    style={[size_tool(200), appStyle.flexCenter]}
                    source={require("../../../../../../images/chineseHomepage/pingyin//new/testMeBg.png")}
                >
                    <Text
                        style={[
                            { color: "#ffffff", fontSize: pxToDp(36) },
                            fonts.fontFamily_jcyt_700,
                        ]}
                    >
                        OK
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    };
    // 关闭帮助播放

    render() {
        const { explanation_audio, pausedfail } = this.state;
        // console.log(fromServeCharacterList, 'topaicNum')

        return (
            <View style={styles.mainWrap}>
                <View style={[styles.container, appStyle.flexTopLine]}>
                    {/* <View
                        style={styles.topaic}
                        ref="topaicBox"
                        onLayout={(event) => this.topaicContainerOnLayout(event)}
                    >
                        <View style={styles.topaicText}>
                            <View style={{ flex: 1, paddingRight: pxToDp(0) }}>


                            </View>

                        </View>
                    </View> */}
                    {this.renderWriteTopaic()}
                </View>
                {this.renderButton()}

                <ReadingHelpModal
                    status={this.state.visible}
                    goback={this.onClose.bind(this, 1)}
                    audio={explanation_audio}
                    knowledgepoint_explanation={this.state.knowledgepoint_explanation}
                    diagnose_notes={this.state.diagnose_notes}
                />
                {/* <Audio isLocal={true} uri={`${this.successAudiopath}`} paused={pausedSuccess} pausedEvent={this.audioPausedSuccess} ref={this.audio1} /> */}
                {/* <Audio isLocal={true} uri={`${this.failAudiopath}`} paused={pausedfail} pausedEvent={this.audioPausedSuccess} ref={this.audio} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        width: "100%",
        flex: 1,
        borderRadius: pxToDp(60),
        padding: pxToDp(40),
        position: "relative",
        // paddingBottom: 24,
    },
    container: {
        flex: 1,
        width: "100%",
    },
    topaic: {
        flex: 1,
        justifyContent: "space-between",
    },
    topaicBtn: {
        alignItems: "flex-end",
        position: "absolute",
        right: pxToDp(20),
        bottom: pxToDp(20),
    },
    topaicText: {
        // width: 900,
        padding: pxToDp(24),
        flexDirection: "row",
        // justifyContent: 'space-between'
    },
    buttonGroup: {
        flexDirection: "row",
        // flex: 1
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

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
