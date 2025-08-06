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
import { Toast, Modal } from "antd-mobile-rn";
// import RichShowView from "../../../../../../component/richShowViewNew";
import RichShowView from "../../../../../../component/chinese/newRichShowView";

import { appStyle, appFont } from "../../../../../../theme";
import ReadingHelpModal from "../../../../../../component/chinese/pinyinHelpModal";
import Audio from "../../../../../../util/audio/audio";
import url from "../../../../../../util/url";
import AudioComponent from "../../../../../../component/chinese/pinyin/AudioComponent";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { size } from "lodash";
import Ise from "../../../../../../util/ise/index";
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
            scoreTxt: "",
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

    closeAnswerStatisticsModal = () => {
        // console.log('MathCanvas closeDialog')
        this.setState({ answerStatisticsModalVisible: false });
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
        const { exerciseInfo, optionList, pausedPrivate, scoreTxt, isRecording } =
            this.state;
        const data = exerciseInfo;
        let baseUrl =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
            data?.private_stem_picture;
        let arr = [];
        // console.log('状态data', data)
        if (data?.exercise_content) {
            if (this.renderOptionList) {
                arr = data?.exercise_content ? data?.exercise_content.split("#") : [];
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
        return (
            // 不同题型组装题目
            <View>
                <View style={[appStyle.flexTopLine]}>
                    <View style={[{ marginRight: pxToDp(40) }]}>
                        {data.private_stem_audio ? (
                            <Audio
                                audioUri={`${url.baseURL}${data.private_stem_audio}`}
                                pausedBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                playBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                            />
                        ) : null}
                    </View>
                    <View>
                        <RichShowView
                            value={
                                data?.private_exercise_stem
                                    ? `${data?.private_exercise_stem}`
                                    : ""
                            }
                            size={2}
                            width={pxToDp(1500)}
                        // fontFamily={"jiangchengyuanti"}
                        // otherStyle={'text-align:center'}
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
                <View
                    style={[
                        { paddingTop: pxToDp(40) },
                        appStyle.flexTopLine,
                        appStyle.flexLineWrap,
                        appStyle.flexJusBetween,
                    ]}
                >
                    {arr.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.checkAnswer(index)}
                                key={index}
                                style={[
                                    {
                                        width: "49%",
                                        minHeight: pxToDp(140),
                                        backgroundColor:
                                            this.state.checkedIndex === index ? "#447BE5" : "#E7E7F2",
                                        marginBottom: pxToDp(40),
                                        paddingBottom: pxToDp(4),
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
                                                    ? "#4C94FF"
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
                                                    color:
                                                        this.state.checkedIndex === index
                                                            ? "#fff"
                                                            : "#475266",
                                                },
                                                fonts.fontFamily_syst_bold,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                        // }
                    })}
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
        const { token, resetToLogin } = this.props
        if (!token && resetToLogin) {
            resetToLogin()
            return
        }
        // this.refs.canvas._nextTopaic();
        this.audioPausedPrivate();
        let index = this.state.checkedIndex;
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
        let answer_contentnow = optionList[index];
        if (exerciseInfo.exercise_type_private === "2" && index === -1) {
            return;
        }
        let endTime = new Date().getTime();
        let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);

        if (optionList[index] === exerciseInfo?.answer_content) {
            // 正确，当前题目为推送的要素题时不论对错都保存
            // str = "恭喜你答对啦！";
            correctnow = 1;
            // if (exerciseInfo.exercise_type_private !== '1' && optionList[index] === exerciseInfo?.answer_content) {
            //     Toast.info('恭喜你，答对了！', 1)

            // }
            // console.log("分数123", totalScore)
            this.props.saveExercise({
                ...exerciseInfo,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                answer_content: isKeyExercise ? answer_content : answer_contentnow,
                exercise_id: exerciseInfo.pb_id,
                totalScore,
            });
            this.setState({
                renderOptionList: true,
                checkedIndex: -1,
                totalScore: 0,
            });
            this.scrollRef.scrollTo({ y: 0 });
        } else {
            let arr = [...exerciseInfo?.exercise_content.split("#")];
            for (let i in arr) {
                if (optionList[index] === arr[i]) {
                    str = exerciseInfo?.diagnose_notes.split("#")[i];
                }
            }
            correctnow = 0;
            // this.audio.current.replay()
            ImmediatelyPlay.playSuccessSound(this.failAudiopath);

            this.setState({
                visible: true,
                diagnose_notes: str,
                renderOptionList: true,
                checkedIndex: -1,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                answer_content: isKeyExercise ? answer_content : answer_contentnow,
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
            // console.log('题目2222222', props.exercise, tempState.exerciseInfo)

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
                    <View
                        style={styles.topaic}
                        ref="topaicBox"
                        onLayout={(event) => this.topaicContainerOnLayout(event)}
                    >
                        <View style={styles.topaicText}>
                            <View style={{ flex: 1, paddingRight: pxToDp(0) }}>
                                <ScrollView ref={(view) => (this.scrollRef = view)}>
                                    {this.renderWriteTopaic()}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
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
        // paddingBottom: 24,
    },
    container: {
        flex: 1,
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

    topaicWrite: {
        position: "absolute",
    },
    buttonGroup: {
        flexDirection: "row",
        // flex: 1
    },
    checkOptions: {
        width: pxToDp(52),
        height: pxToDp(52),
        borderRadius: pxToDp(26),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: pxToDp(2),
        borderColor: "#AAAAAA",
        marginRight: pxToDp(24),
    },
    checkedOption: {
        width: pxToDp(52),
        height: pxToDp(52),
        backgroundColor: "#FA603B",
        borderRadius: pxToDp(26),
        alignItems: "center",
        justifyContent: "center",
        marginRight: pxToDp(24),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
