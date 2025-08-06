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
} from "react-native";
import { Toast, Modal } from "antd-mobile-rn";
import { appStyle, appFont } from "../../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
} from "../../../../../../util/tools";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import url from "../../../../../../util/url";
import { getStrImg, getStrImgSrcStr } from "../../../../../../util/commonUtils";
import ReadingHelpModal from "../../../../../../component/chinese/reading/ReadingHelpModal";
import Audio from "../../../../../../util/audio/audio";
import RichShowView from "../../../../../../component/chinese/newRichShowView";
import PlayAudio from "../../../../../../util/audio/playAudio";
import { connect } from "react-redux";

class DoWrongExerciseRead extends PureComponent {
    constructor(props) {
        super(props);
        this.audioRef = null;
        this.audio = React.createRef();
        this.articleAudio = React.createRef();
        this.ExerciseRef = React.createRef();
        this.state = {
            article: props.article,
            correct: "",
            answerIndex: -1,
            isShuffle: true,
            diagnose_notes: "",
            visible: false,
            explanation: "",
            helpVisible: false,
            helpImg: "",
            isStartAudio: false,
            topicAnswer: "",
            diagnose_notes_audio: "",
            lookHelp: false,
        };
        // this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.selectArr = [];
        // this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";
    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (JSON.stringify(props.article) !== JSON.stringify(tempState.article)) {
            tempState.article = props.article;
            // tempState.renderOptionList = true;
            tempState.isKeyExercise = props.isKeyExercise;
            return tempState;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.article.r_id !== this.state.article.r_id ||
            prevState.isKeyExercise !== this.state.isKeyExercise
        ) {
            this.renderOptionList = true;
            this.setState({
                renderOptionList: false,
            });
        }
    }
    componentWillUnmount() {
        try {
            this.articleAudio?.sound && this.articleAudio?.pausedEvent();
            this.audio?.sound && this.audio?.pausedEvent();
        } catch (err) {
            console.log("err--------", err);
        }
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    //打乱数组
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    shuffle = (arr) => {
        let _arr = arr.slice();
        for (let i = 0; i < _arr.length; i++) {
            let j = this.getRandomInt(0, i);
            let t = _arr[i];
            _arr[i] = _arr[j];
            _arr[j] = t;
        }
        return _arr;
    };
    checkAnswer = (item, index) => {
        const { article } = this.state;
        console.log("题干", article);
        let correct = "";
        let diagnose_notes = article.diagnose_notes.split("#")[item.index];
        item.content === article.answer_content ? (correct = "0") : (correct = "2");
        let diagnose_notes_audio = "";
        if (article.diagnose_notes_audio) {
            diagnose_notes_audio =
                item.content === article.answer_content
                    ? ""
                    : article.diagnose_notes_audio[item.index];
        }

        this.setState({
            correct,
            answerIndex: index,
            isShuffle: false,
            diagnose_notes,
            topicAnswer: item.content,
            diagnose_notes_audio,
        });
    };
    closeAudio = () => {
        try {
            this.articleAudio?.sound && this.articleAudio?.pausedEvent();
            this.audio?.sound && this.audio?.sound && this.audio?.pausedEvent();
            this.audioRef && this.audioRef.pausedEvent();
        } catch (err) {
            console.log("err", err);
        }
    };
    nextTopic = async () => {
        const {
            correct,
            answerIndex,
            article,
            isKeyExercise,
            topicAnswer,
            lookHelp,
            diagnose_notes_audio,
        } = this.state;
        this.closeAudio();
        if (answerIndex < 0) {
            Toast.info("请选择答案", 1, undefined, false);
            return;
        }
        this.closeAudio();
        // let audioindex = Math.floor(Math.random() * 3);
        // const audiolist = [this.successAudiopath, this.successAudiopath3];

        const { token } = this.props;
        if (!token && this.props.resetToLogin) {
            this.props.resetToLogin();
            return;
        }

        if (correct === "0" && !lookHelp) {
            // 做对了
            PlayAudio.playSuccessSound(url.successAudiopath2);
            this.props.nextNow({ ...article, correct, topicAnswer }, isKeyExercise);
            this.setState({
                isShuffle: true,
                lookHelp: false,
            });

            this.ExerciseRef &&
                this.ExerciseRef.scrollTo({ x: 0, y: 0, animated: false });
        } else {
            // 做错了
            if (!(diagnose_notes_audio && article.stem_explain_audio)) {
                PlayAudio.playSuccessSound(url.failAudiopath);
            }
            this.helpMe(false);
        }
        this.setState({
            answerIndex: -1,
        });
    };
    aiHelp = () => {
        const { article, diagnose_notes, lookHelp } = this.state;
        const { token } = this.props;
        if (!token && this.props.resetToLogin) {
            this.props.resetToLogin();
            return;
        }
        this.setState({
            lookHelp: true,
            isShuffle: false,
        });
        NavigationUtil.toChineseReadingAiHelp({
            ...this.props,
            data: {
                r_id: article.r_id,
            },
        });
    };
    helpMe = (_isConst) => {
        const { article, diagnose_notes, lookHelp } = this.state;
        let helpImg = "";
        let explanation = article.explanation;
        if (getStrImg(article.explanation)) {
            helpImg = getStrImgSrcStr(article.explanation);
            explanation = article.explanation.replaceAll(
                getStrImg(article.explanation),
                ""
            );
        }
        this.setState({
            helpVisible: true,
            isShuffle: _isConst ? false : true,
            explanation,
            helpImg,
            diagnose_notes: _isConst
                ? ""
                : lookHelp
                    ? "再仔细想想呢"
                    : diagnose_notes,
            lookHelp: _isConst ? true : lookHelp,
        });
        // }, 1000)
    };

    onCloseHelp = () => {
        const { isShuffle, lookHelp } = this.state;
        if (isShuffle) {
            const { correct, article, isKeyExercise, topicAnswer } = this.state;
            this.props.nextNow(
                { ...article, correct: lookHelp ? "2" : correct, topicAnswer },
                isKeyExercise
            );
            this.setState({
                visible: false,
                isShuffle: true,
                lookHelp: false,
            });
        }
        this.setState({
            helpVisible: false,
            isShuffle: isShuffle, //不是做错了点的帮助，关闭后选项不打乱
        });
    };

    renderWriteTopaic() {
        const { article, answerIndex, isShuffle } = this.state;
        const { exercise_type, choice_content, exercise_content } = article;
        if (Object.keys(article).length === 0) return;
        // 打乱选项
        article.shuffleArr = this.selectArr;
        if (isShuffle) {
            let shuffleArr = [];
            let src = exercise_type === "s" ? choice_content : exercise_content;
            src &&
                src?.split("#").forEach((item, index) => {
                    shuffleArr.push({ index: index, content: item });
                });
            article.shuffleArr = this.shuffle(shuffleArr);
            this.selectArr = article.shuffleArr;
        }
        return (
            <ScrollView
                ref={(ref) => (this.ExerciseRef = ref)}
                style={[{ flex: 1, width: "100%" }]}
            >
                {article.exercise_type === "s" ? (
                    <View style={{}}>
                        {article.stem_audio ? (
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                <Audio
                                    audioUri={`${url.baseURL}${article.stem_audio}`}
                                    pausedBtnImg={require("../../../../../../images/audio/audioPlay.png")}
                                    pausedBtnStyle={{
                                        width: pxToDp(198),
                                        height: pxToDp(95),
                                    }}
                                    playBtnImg={require("../../../../../../images/audio/audioPause.png")}
                                    playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
                                    rate={0.75}
                                    onRef={(ref) => {
                                        this.audioRef = ref;
                                    }}
                                >
                                    {article?.stem ? (
                                        <RichShowView
                                            width={pxToDp(660)}
                                            value={`<div id="yuanti">${article?.stem}</div>`}
                                            size={5}
                                        ></RichShowView>
                                    ) : null}
                                </Audio>
                            </View>
                        ) : article?.stem ? (
                            // <TouchableOpacity
                            //   onPress={() => {
                            //     if (article.stem_audio) this.audioRef.onPlay();
                            //   }}
                            // >
                            <RichShowView
                                width={pxToDp(660)}
                                value={`<div id="yuanti">${article?.stem}</div>`}
                                size={5}
                            ></RichShowView>
                        ) : // </TouchableOpacity>
                            null}
                    </View>
                ) : (
                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, {}]}>
                        {article.private_exercise_stem ? (
                            <RichShowView
                                width={pxToDp(1700)}
                                value={`${article.private_exercise_stem}`}
                                size={5}
                            ></RichShowView>
                        ) : null}
                        {article.private_exercise_audio ? (
                            <Audio
                                onRef={(ref) => (this.articleAudio = ref)}
                                audioUri={`${url.baseURL}${article.private_exercise_audio}`}
                                pausedBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                pausedBtnStyle={{ width: pxToDp(160), height: pxToDp(80) }}
                                playBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                playBtnStyle={{ width: pxToDp(160), height: pxToDp(80) }}
                            />
                        ) : null}
                    </View>
                )}
                {article.stem_image ? (
                    <Image
                        style={[size_tool(400), { marginLeft: pxToDp(46) }]}
                        source={{ uri: url.baseURL + article.stem_image }}
                        resizeMode={"contain"}
                    ></Image>
                ) : null}
                <View
                    style={{
                        alignItems: "center",
                        paddingTop: pxToDp(30),
                    }}
                >
                    {article.shuffleArr?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.checkAnswer(item, index)}
                                style={[
                                    {
                                        width: pxToDp(exercise_type === "s" ? 640 : 1000),
                                        minHeight: pxToDp(110),
                                        paddingBottom: pxToDp(8),
                                        backgroundColor:
                                            answerIndex === index ? "#F07C39" : "#E7E7F2",
                                        marginBottom: pxToDp(30),
                                    },
                                    borderRadius_tool(30),
                                ]}
                            >
                                <View
                                    style={[
                                        appStyle.flexCenter,
                                        {
                                            flex: 1,
                                            backgroundColor:
                                                answerIndex === index ? "#FF964A" : "#F5F5FA",
                                        },
                                        borderRadius_tool(30),
                                        padding_tool(20),
                                    ]}
                                >
                                    {article.content_picture === "1" ||
                                        article.choice_type === "1" ? (
                                        <Image
                                            style={{
                                                width: pxToDp(250),
                                                height: pxToDp(250),
                                                marginLeft: pxToDp(0),
                                            }}
                                            source={{
                                                uri: url.baseURL + item.content,
                                            }}
                                            resizeMode={"contain"}
                                        ></Image>
                                    ) : (
                                        <Text
                                            style={[
                                                {
                                                    fontSize: pxToDp(37),
                                                    color: answerIndex === index ? "#fff" : "#445268",
                                                    minWidth: pxToDp(200),
                                                    textAlign: "center",
                                                },
                                                Platform.OS === "ios" ? { lineHeight: pxToDp(52) } : {},
                                                padding_tool(0, 10, 0, 10),
                                                appFont.fontFamily_syst,
                                            ]}
                                        >
                                            {item.content}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        );
    }
    render() {
        const { article, diagnose_notes, diagnose_notes_audio, lookHelp } =
            this.state;
        let content = article.content ? article.content : "";
        const { hideHelp } = this.props;
        const {
            explanation_audio,
            explanation,
            knowledgepoint_explanation,
            exercise_type,
            stem_explain_audio,
        } = article;
        let explanationNow =
            exercise_type === "s" ? explanation : knowledgepoint_explanation;
        let stem_explain_audio_now = stem_explain_audio ? stem_explain_audio : "";
        return (
            <View
                style={[
                    appStyle.flexTopLine,
                    appStyle.flexJusBetween,
                    { flex: 1 },
                    padding_tool(0, 40, 0, 40),
                ]}
            >
                {article.exercise_type === "s" ? (
                    <View
                        style={[
                            styles.left,
                            article.exercise_type === "s"
                                ? padding_tool(48)
                                : padding_tool(0),
                        ]}
                    >
                        <View style={[styles.articleTitle]}>
                            {article.audio ? (
                                <View
                                    style={{
                                        position: "absolute",
                                        zIndex: 10000,
                                    }}
                                >
                                    <Audio
                                        onRef={(ref) => (this.articleAudio = ref)}
                                        audioUri={`${url.baseURL}${article.audio}`}
                                        pausedBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                        pausedBtnStyle={{
                                            width: pxToDp(160),
                                            height: pxToDp(80),
                                        }}
                                        playBtnImg={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                        playBtnStyle={{ width: pxToDp(160), height: pxToDp(80) }}
                                    />
                                </View>
                            ) : null}
                            <View style={[{ flex: 1 }]}>
                                <Text
                                    style={[
                                        {
                                            fontSize: pxToDp(40),
                                            textAlign: "center",
                                            lineHeight: pxToDp(68),
                                        },
                                        appFont.fontFamily_syst_bold,
                                    ]}
                                >
                                    {article.name}
                                </Text>
                                <Text
                                    style={[
                                        {
                                            lineHeight: pxToDp(42),
                                            fontSize: pxToDp(32),
                                            textAlign: "right",
                                            paddingRight: pxToDp(20),
                                        },
                                        appFont.fontFamily_syst,
                                    ]}
                                >
                                    作者：{article.author}
                                </Text>
                            </View>
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            <RichShowView
                                width={pxToDp(980)}
                                value={`<div id="yuanti">${content}</div>`}
                                size={5}
                            ></RichShowView>
                            {article.image ? (
                                <View
                                    style={[
                                        appStyle.flexTopLine,
                                        appStyle.flexCenter,
                                        { paddingTop: pxToDp(20) },
                                    ]}
                                >
                                    <Image
                                        style={[
                                            size_tool(
                                                this.article_category === "漫画" ? 800 : 400,
                                                this.article_category === "漫画" ? 600 : 300
                                            ),
                                        ]}
                                        source={{ uri: url.baseURL + article.image }}
                                        resizeMode={"contain"}
                                    ></Image>
                                </View>
                            ) : null}
                        </ScrollView>
                    </View>
                ) : null}
                <View style={[styles.right]}>
                    {this.renderWriteTopaic()}
                    <View style={[appStyle.flexCenter, padding_tool(20, 0, 40, 0)]}>
                        <TouchableOpacity
                            style={styles.nextBtn}
                            ref="topaicBox"
                            // onLayout={(event) => this.topaicContainerOnLayout(event)}
                            onPress={this.nextTopic}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    borderRadius: pxToDp(100),
                                    backgroundColor: "#FF964A",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={[
                                        { color: "#ffffff", fontSize: pxToDp(50) },
                                        appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    提交
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {hideHelp ? null : ( */}
                <TouchableOpacity
                    style={[styles.helpBtn]}
                    onPress={() => {
                        this.aiHelp();
                    }}
                >
                    <Image
                        style={[size_tool(200, 150)]}
                        source={require("../../../../../../images/chineseHomepage/reading/saraHelp.png")}
                        resizeMode="contain"
                    ></Image>
                </TouchableOpacity>
                {/* )} */}
                <ReadingHelpModal
                    status={this.state.helpVisible}
                    goback={this.onCloseHelp}
                    audio={explanation_audio}
                    knowledgepoint_explanation={
                        explanationNow ? explanationNow : ""
                        // article.explanation ? article.explanation : ""
                    }
                    diagnose_notes={diagnose_notes}
                    diagnose_notes_audio={diagnose_notes_audio}
                    stem_explain_audio={stem_explain_audio_now}
                    btnTxt={lookHelp ? "关闭" : ""}
                />
            </View>
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
        top: pxToDp(-100),
        right: pxToDp(0),
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
    return {
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispathToProps)(DoWrongExerciseRead);
