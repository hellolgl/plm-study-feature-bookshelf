import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Animated
} from "react-native";
import IDOMParser from 'advanced-html-parser'

import {
    fontFamilyRestoreMargin,
    pxToDp, size_tool, padding_tool, borderRadius_tool
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import { Toast, } from "antd-mobile-rn";
import RichShowView from "../../../../component/math/RichShowViewHtml";

import { appStyle, appFont } from "../../../../theme";
import ReadingHelpModal from '../../../../component/chinese/pinyinHelpModal'
import Audio from "../../../../util/audio/audio"
import url from "../../../../util/url";

import fonts from "../../../../theme/fonts";
// import Microphone from '../../../../component/microphone/indexWrong'
import Microphone from '../../../../component/microphone/index'
import ImmediatelyPlay from "../../../../util/audio/playAudio";
import api from '../../../../util/http/api'
import axios from '../../../../util/http/axios'
import HelpWordModal from '../../../../component/english/HelpWordModalNew'
import stemAudioMap from '../../../../util/stemAudioMap'


class DoWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.audioHelp = undefined;
        this.audioHelp1 = undefined;
        this.audioRef = null
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
            knowledgepoint_explanation: "", //知识讲解
            isImageHelp: false,
            optionList: [],
            exerciseInfo: props.exercise,
            explanation_audio: "",
            playStatus: false,
            correct: 0,  //答案
            answer_times: 0,
            renderOptionList: true,
            pausedPrivate: true,
            uploaAudioSrc: '',
            pausedfail: true,
            totalScore: 0,
            renderAudio: false,
            isRecording: false,
            score: 0,
            knowledgeBody: null,
            scoreTxt: '长按录音并评分',
        };

        this.isHelpClick = false; //诊断标记点击关闭还是帮助
        this.failAudiopath = url.baseURL + 'pinyin_new/pc/audio/fail.mp3';
        this.scrollRef = undefined
        this.audio1 = React.createRef()
        this.audio = React.createRef()

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

        // console.log(userInfoJs, 'userInfoJs')
        this.setState({
            exerciseInfo: this.props.exercise
        })

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
            pausedPrivate: true
        })
    }
    playAudio = () => {
        this.audio1.current.replay()
        this.setState({
            pausedPrivate: !this.state.pausedPrivate
        })
    }

    renderWriteTopaic = () => {
        const { exerciseInfo, scoreTxt, isRecording, totalScore
        } = this.state;
        const data = exerciseInfo;

        let baseUrl =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
            data?.private_stem_picture;
        const iseStem = data["private_exercise_stem"]
        const doc = IDOMParser.parse(`<div>${iseStem}</div>`)
        let iseSentence = doc.documentElement.querySelector("span")?.innerText()
        if (iseSentence === undefined) {
            iseSentence = data["knowledge_point"]
        }
        let stem_audio_key = iseStem.replace(/<[^>]+>/g, "")
        if (stem_audio_key.indexOf('Listen and repeat!') > -1) {
            stem_audio_key = 'Listen and repeat!'
        }
        const stem_audio = stemAudioMap[stem_audio_key]
        console.log('stem_audio_key________', stem_audio_key, stem_audio)

        // console.log("iseSentence: ", iseSentence)
        return (
            // 不同题型组装题目
            <View style={[{ felx: 1, width: '100%' }]}>
                <ScrollView ref={view => this.scrollRef = view}>


                    <View
                        style={[appStyle.flexTopLine]}
                    >
                        <View style={[{ marginRight: pxToDp(40) }]}>
                            {/* {data?.private_stem_audio ? (
                                <TouchableOpacity onPress={this.playAudio}>
                                    {!pausedPrivate ? (
                                        <Image
                                            style={[size_tool(200, 120),]}
                                            source={require("../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                        ></Image>
                                    ) : (
                                        <Image
                                            style={[size_tool(200, 120),]}
                                            source={require("../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            ) : null} */}
                            <Audio
                                audioUri={`${url.baseURL}${data.private_stem_audio}`}
                                pausedBtnImg={require("../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                playBtnImg={require("../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                            />

                        </View>
                        <View style={[{ flex: 1 }]}>
                            <View style={[{ marginBottom: pxToDp(20) }]}>
                                {/* <View style={[{ marginLeft: pxToDp(10), marginTop: pxToDp(15) }]}>
                                    <Audio
                                        audioUri={`${stem_audio}`}
                                        pausedBtnImg={require("../../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                                        pausedBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                                        playBtnImg={require("../../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                                        playBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                                        rate={0.75}
                                        onRef={(ref) => { this.audioRef = ref }}
                                    />
                                </View> */}
                                {stem_audio ? <View style={[{
                                    // height: pxToDp(70),
                                    // marginBottom: pxToDp(-20)
                                }, appStyle.flexTopLine, appStyle.flexAliCenter]}>

                                    <Audio
                                        audioUri={`${stem_audio}`}
                                        pausedBtnImg={require("../../../../images/english/abcs/titlePanda.png")}
                                        pausedBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
                                        playBtnImg={require("../../../../images/english/abcs/titlePanda.png")}
                                        playBtnStyle={{ width: pxToDp(169), height: pxToDp(152) }}
                                        rate={0.75}
                                        onRef={(ref) => { this.audioRef = ref }}
                                    />
                                </View> : null}
                                <TouchableOpacity style={[Platform.OS === 'ios' ? { marginTop: pxToDp(20) } : null]} onPress={() => {
                                    if (stem_audio) this.audioRef.onPlay()
                                }}>
                                    <RichShowView value={data?.private_exercise_stem ?
                                        `<div id="jiangchengyuanti">${data.private_exercise_stem}</div>` : ""}
                                        size={Platform.OS === 'ios' ? 70 : 60}
                                    ></RichShowView>
                                </TouchableOpacity>

                            </View>
                            {
                                data?.private_stem_picture ? (
                                    <Image
                                        style={{
                                            width: pxToDp(400),
                                            height: pxToDp(300),
                                            resizeMode: "contain",
                                            // marginLeft: pxToDp(200)
                                        }}
                                        source={{ uri: baseUrl }}
                                    ></Image>
                                ) : (
                                    <Text></Text>
                                )
                            }
                        </View>
                        {/* <RichShowView value={data?.private_exercise_stem ? `<div id="yuanti">${data?.private_exercise_stem}</div>` : ""} size={36}
                            width={pxToDp(1500)}
                        // otherStyle={'text-align:center'}
                        ></RichShowView> */}
                        {/* {
                            data.private_stem_audio ?
                                <Audio uri={`${url.baseURL}${data.private_stem_audio}`} paused={pausedPrivate} pausedEvent={this.audioPausedPrivate} ref={this.audio1} />
                                : null
                        } */}

                    </View>

                </ScrollView>

                <View style={[appStyle.flexCenter, { paddingTop: pxToDp(40), position: 'absolute', width: pxToDp(400), left: "50%", marginLeft: pxToDp(-200), bottom: pxToDp(0), }]}>
                    {/* <AudioComponent uploadMP3={this.uploadMP3} isRender={renderAudio} /> */}
                    {/*{console.log('题目信息', data)}*/}
                    <View style={[{ height: pxToDp(168), width: '100%', }, appStyle.flexCenter]}>
                        {isRecording ? null :
                            <Text style={[{ fontSize: pxToDp(scoreTxt.length > 3 ? 28 : 80), color: scoreTxt.length > 3 ? '#475266' : totalScore > 59 ? '#00D3A1' : '#FF6A4D', opacity: 0.5 }, fonts.fontFamily_jcyt_700]}>{scoreTxt}</Text>}

                        {/* <Text style={[{ fontSize: pxToDp(80), color: '#00D3A1', opacity: 0.5 }, fonts.fontFamily_jcyt_700]}>{scoreTxt}</Text>} */}
                    </View>

                    <Microphone
                        animation={true}
                        microphoneImg={require("../../../../images/chineseHomepage/pingyin/new/btn3.png")}
                        microphoneImgStyle={{ width: pxToDp(280), height: pxToDp(140) }}
                        activeMicrophoneImg={require("../../../../images/chineseHomepage/pingyin/new/btn3.png")}
                        activeMicrophoneImgStyle={{ width: pxToDp(280), height: pxToDp(140) }}
                        iseInfo={{
                            words: [`${iseSentence}\nenglish_read_sentence`],
                            index: 0,
                        }}
                        onStartRecordEvent={() => {
                            this.setState({
                                isRecording: true,
                            })
                        }}
                        onFinishRecordEvent={(score) => {
                            this.setState({
                                isRecording: false,
                                totalScore: parseInt(score).toFixed(0),
                                scoreTxt: parseInt(score).toFixed(0) + ''
                                // scoreTxt: score,
                            })
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
                        lineColor={'#58DABB'}
                    />
                </View>
            </View >
        );

    };

    //获取canvas手写数据
    onClose = () => {
        const { exerciseInfo, correct, answer_times, answer_content, isKeyExercise, isImageHelp } = this.state;
        let isKeyExercisenow = isKeyExercise
        if (this.props.isWrong) {
            this.props.saveExercise({
                ...exerciseInfo,
                answer_times,
                correct,
                answer_content,
                exercise_id: exerciseInfo.exercise_id
            })
            isKeyExercisenow = false
            this.scrollRef.scrollTo({ y: 0 })
        } else {
            if (!isImageHelp && isKeyExercise || correct === 2) {
                this.props.saveExercise({
                    ...exerciseInfo,
                    answer_times,
                    correct,
                    answer_content,
                    exercise_id: exerciseInfo.exercise_id
                })
                isKeyExercisenow = false
                this.scrollRef.scrollTo({ y: 0 })
            } else {
                if (!isImageHelp) {
                    isKeyExercisenow = true

                }
            }
        }
        this.renderOptionList = true
        this.setState({
            status: false,
            isKeyExercise: isKeyExercisenow,
            answer_start_time: new Date().getTime()
        });
    };
    nextTopaic = () => {
        // this.refs.canvas._nextTopaic();
        this.audioPausedPrivate();
        const {
            totalScore,
            exerciseInfo, optionList, answer_start_time, correct, answer_times, answer_content, isKeyExercise } = this.state;
        let str = ""; // 讲解
        let correctnow = 0   //错误0 良好1  正确2

        let endTime = new Date().getTime();
        let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);
        // let totalScore = 90
        if (totalScore > 69) {

            correctnow = 1
            console.log("分数123", totalScore)
            this.props.saveExercise({
                ...exerciseInfo,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                exercise_id: exerciseInfo.exercise_id,
                totalScore
            })
            this.setState({
                renderOptionList: true,
                totalScore: 0,
                scoreTxt: ''
            });
            this.scrollRef.scrollTo({ y: 0 })
        } else {

            correctnow = 0
            // this.audio.current.replay()
            ImmediatelyPlay.playSuccessSound(this.failAudiopath)
            console.log('题目', exerciseInfo)
            this.helpMe()
            this.setState({
                // visible: true,
                renderOptionList: true,
                correct: isKeyExercise ? correct : correctnow,
                answer_times: isKeyExercise ? answer_times : answer_timesnow,
                pausedfail: false,
                totalScore: 0,
                scoreTxt: '',
                isImageHelp: false
            });
        }

        this.renderOptionList = true;

    };
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state }
        if (JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)) {
            if (props.exercise.exercise_type_private === '1') {
                tempState.renderAudio = true
            } else {
                tempState.renderAudio = false
            }
            tempState.exerciseInfo = props.exercise
            tempState.renderOptionList = true
            tempState.isKeyExercise = false
            console.log('题目2222222', props.exercise, tempState.exerciseInfo)

            return tempState

        } else {
            tempState.renderAudio = false
            return tempState
        }

    }
    componentDidUpdate(prevProps, prevState,) {
        if (prevState.exerciseInfo?.exercise_id !== this.state.exerciseInfo?.exercise_id) {
            this.renderOptionList = true
            this.setState({
                renderOptionList: false
            })
        }

    }
    helpMe = (isHelp) => {
        // 点击查看帮助
        let { exerciseInfo, isImageHelp } = this.state
        if (isHelp) {
            // 从页面点击过来，不用做任何别的操作
            isImageHelp = true
        } else {
            // 从诊断标记点击过来，需要改变参数
            isImageHelp = false
            this.isHelpClick = true
        }
        let data = {}
        data.origin = exerciseInfo.origin
        data.knowledge = exerciseInfo.knowledge_point
        data.knowledge_type = 1
        console.log('data', api.SynchronizeDiagnosisEnKnowPoint, data)
        axios.get(api.SynchronizeDiagnosisEnKnowPoint, { params: data })
            .then(res => {
                //console.log('helpMe SynchronizeDiagnosisEnKnowPoint',res)
                console.log("@@@ res: ", res)
                this.setState(() => ({
                    knowledgepoint_explanation: exerciseInfo && exerciseInfo.knowledgepoint_explanation != ''
                        ? exerciseInfo.knowledgepoint_explanation : ' ',
                    status: true,
                    // lookDetailNum: 1,
                    isImageHelp,
                    knowledgeBody: { ...res.data.data },
                    explanation_audio:
                        exerciseInfo && exerciseInfo?.explanation_audio
                            ? exerciseInfo?.explanation_audio
                            : "",
                }))
            })
    };
    onCloseHelp = () => {
        this.setState({
            status: false,
        });
    };
    audioPausedSuccess = () => this.setState({ pausedfail: true })
    renderButton = () => {
        return <TouchableOpacity
            style={styles.topaicBtn}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
            onPress={this.nextTopaic}
        >

            <View style={[size_tool(200), padding_tool(0, 0, 12, 0), borderRadius_tool(200), { backgroundColor: '#1FA07C' }]}
            >
                <View style={[{ flex: 1 }, appStyle.flexCenter, borderRadius_tool(200), { backgroundColor: '#2ED1A4' }]}>
                    <Text style={[{ color: "#ffffff", fontSize: pxToDp(36) }, fonts.fontFamily_jcyt_700,]}>Next</Text>

                </View>

            </View>

        </TouchableOpacity>
    };
    // 关闭帮助播放

    start = () => {

    }
    render() {
        const { explanation_audio, exerciseInfo, knowledgeBody } = this.state;
        console.log("render here...")
        // console.log(fromServeCharacterList, 'topaicNum')
        const { explanation_type, knowledgepoint_type } = exerciseInfo
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
                {explanation_type === '2' || knowledgepoint_type === '4' ? <ReadingHelpModal
                    status={this.state.status}
                    goback={this.onClose.bind(this, 1)}
                    audio={explanation_audio}
                    knowledgepoint_explanation={this.state.knowledgepoint_explanation}
                    diagnose_notes={this.state.diagnose_notes}
                /> : <HelpWordModal closeModal={this.onClose.bind(this, 1)} visible={this.state.status}
                    currentTopaicData={exerciseInfo} knowledgeBody={knowledgeBody}
                    kygType={exerciseInfo?.knowledgepoint_type}
                    unitName={'Alphabet'}>
                </HelpWordModal>}
                {/* <Audio isLocal={true} uri={`${this.successAudiopath}`} paused={pausedSuccess} pausedEvent={this.audioPausedSuccess} ref={this.audio1} /> */}
                {/* <Audio isLocal={true} uri={`${this.failAudiopath}`} paused={pausedfail} pausedEvent={this.audioPausedSuccess} ref={this.audio} /> */}
                {/* <ReadingHelpModal closeModal={this.onClose.bind(this, 1)} visible={this.state.status}
                    currentTopaicData={exerciseInfo} knowledgeBody={knowledgeBody}
                    kygType={exerciseInfo?.knowledgepoint_type}
                    unitName={'Alphabet'}>
                </ReadingHelpModal> */}

            </View>
        );

    }
}

const styles = StyleSheet.create({
    mainWrap: {
        width: '100%',
        flex: 1,
        borderRadius: pxToDp(60),
        padding: pxToDp(40),
        position: 'relative'
        // paddingBottom: 24,
    },
    container: {
        flex: 1,
        width: '100%'
    },
    topaic: {
        flex: 1,
        justifyContent: 'space-between'
    },
    topaicBtn: {
        alignItems: "flex-end",
        position: 'absolute',
        right: pxToDp(20),
        bottom: pxToDp(20)
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


export default DoWrongExercise;
