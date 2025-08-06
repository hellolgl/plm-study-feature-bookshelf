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
    DeviceEventEmitter
} from "react-native";
import { appStyle, appFont } from "../../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import url from "../../../../util/url";
import ViewControl from "react-native-image-pan-zoom";
import RichShowView from "../../../../component/chinese/newRichShowView";
import BackBtn from "../../../../component/math/BackBtn";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import HelpModal from './components/helpModal'
import DiagnosisModal from './components/diagnosisModal'
import AnswerStatisticsModal from "../../../../component/chinese/sentence/staticsModal";
import EventRegister from "../../../../util/eventListener";
import _ from 'lodash'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import PlayAudio from "../../../../util/audio/playAudio";
import { getDebounceTime } from "../../../../util/commonUtils";
let debounceTime = getDebounceTime();
let baseUrl = url.baseURL;

class WordTreeDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        // console.log('=============', this.props.navigation.state.params.data);
        this.checkGrade = this.props.userInfo.toJS().checkGrade;
        this.checkTeam = this.props.userInfo.toJS().checkTeam;
        this.id = this.props.userInfo.toJS().id;
        this.unit_code = this.props.navigation.state.params.data.unit_code;
        this.origin = this.props.navigation.state.params.data.origin;
        this.character = this.props.navigation.state.params.data.character;
        this.knowledge_point_code = this.props.navigation.state.params.data.knowledge_point_code;
        this.isElement = false;
        this.yesNumber = 0;
        this.noNumber = 0;
        this.optionsList = [];
        this.clickHelpNum = 0;
        this.answer_start_time = this.getTime();
        this.submitThrottle = _.debounce(this.nextTopic, debounceTime);
        this.state = {
            exerciseList: [],
            exercise_set_id: "",
            tagText: "题目获取中...",
            currentTopic: {},
            answerIndex: -1,
            helpVisible: false,
            isClickHelp: false,
            diagnose_notes: "",
            correct: "",
            topaicIndex: 0,
            knowledgepoint_explanation: "",
            visible: false,
            answerStatisticsModalVisible: false,
        };
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
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
        this.setState({
            answerStatisticsModalVisible: false,
        });
    };
    componentDidMount() {
        const status = this.props.navigation.state.params.data.data.status //是否首次做题 0 是 1否
        if (status === '0') {
            // 只有字判断是否首次做题
            this.getFirstExercise()
        } else {
            this.getExercise();
        }
    }
    componentWillUnmount() {
        const { type, origin, character, page, wordList, wordListKey } = this.props.navigation.state.params.data
        DeviceEventEmitter.emit("refreshDetailsAndHomePage", { type, origin, character, page, wordList, wordListKey });
        EventRegister.emitEvent("pauseAudioEvent");
    }
    getFirstExercise() {
        const { topaicIndex } = this.state;
        let obj = {
            knowledge_point_code: this.knowledge_point_code,
            knowledge_point: this.character,
            origin: this.origin
        }
        axios.get(api.firstStartExercise, { params: obj }).then(res => {
            let len = Object.keys(res.data.data.exercise).length;
            // console.log('pppp', res.data.data)
            if (len === 0) {
                // 无数据
                this.setState({
                    tagText: "暂无题目",
                });
                return;
            }
            let exerciseList = JSON.parse(JSON.stringify(res.data.data.exercise));
            exerciseList[topaicIndex].optionsList = this.getOptions(
                exerciseList[topaicIndex]
            );

            this.setState({
                exerciseList,
                exercise_set_id: res.data.data.exercise_set_id,
                tagText: "",
                currentTopic: exerciseList[topaicIndex],
            });
        }).catch(err => {
            console.log('dddddd', err)
        })
    }
    getExercise() {
        const { topaicIndex } = this.state;
        let type = this.props.navigation.state.params.data.type
        const character = this.props.navigation.state.params.data.data.character
        const word = this.props.navigation.state.params.data.data.word
        let obj = {}
        type === 'word' ?
            obj = {
                grade_code: this.checkGrade,
                term_code: this.checkTeam,
                textbook: this.props.textbook,
                student_code: this.id,
                unit_code: this.unit_code,
                origin: this.origin,
                character: JSON.stringify(character),
                word: JSON.stringify(word),
                knowledge_type: '2',
                knowledge_point_code: this.knowledge_point_code
            }
            :
            obj = {
                grade_code: this.checkGrade,
                term_code: this.checkTeam,
                textbook: this.props.textbook,
                student_code: this.id,
                unit_code: this.unit_code,
                origin: this.origin,
                character: JSON.stringify(character),
                word: JSON.stringify(word),
                knowledge_point_code: this.knowledge_point_code
            };
        let exercise_element_obj = {}
        // console.log('+++++++', character, word)
        character.forEach((i, x) => {
            if (!exercise_element_obj[i.knowledge_point_code]) {
                exercise_element_obj[i.knowledge_point_code] = []
            }
            if (i.correction === '1') {
                exercise_element_obj[i.knowledge_point_code].push(i.exercise_element)
            }
        })

        word.forEach((i, x) => {
            i.forEach((ii, xx) => {
                if (!exercise_element_obj[ii.knowledge_point_code]) {
                    exercise_element_obj[ii.knowledge_point_code] = []
                }
                if (ii.correction === '1') {
                    exercise_element_obj[ii.knowledge_point_code].push(ii.exercise_element)
                }
            })

        })
        obj.exercise_element = exercise_element_obj
        console.log('obj::::::::::::::', obj)
        axios.get(api.startExercise, { params: obj }).then((res) => {
            let len = res.data.data.data.length;
            // console.log('fffffffff', res.data.data.data)
            if (len === 0) {
                // 无数据
                this.setState({
                    tagText: "暂无题目",
                });
                return;
            }
            let exerciseList = JSON.parse(JSON.stringify(res.data.data.data));
            exerciseList[topaicIndex].optionsList = this.getOptions(
                exerciseList[topaicIndex]
            );
            this.setState({
                exerciseList,
                exercise_set_id: res.data.data.exercise_set_id,
                tagText: "",
                currentTopic: exerciseList[topaicIndex],
            });
        })
    }
    getOptions = (currentTopic) => {
        let arrShuffle = [];
        // 需要打乱选项
        let arr = currentTopic.exercise_content
            ? currentTopic.exercise_content.split("#")
            : [];
        arr.forEach((item, index) => {
            arrShuffle.push({ index: index, content: item });
        });
        arrShuffle.sort(this.randomNumber);
        this.optionsList = arrShuffle;
        return arrShuffle;
    };
    randomNumber() {
        return 0.5 - Math.random();
    }
    getElementExcercise = () => {
        const { currentTopic, exercise_set_id } = this.state;
        let obj = {
            related_ability_primary: currentTopic.related_ability_primary,
            related_ability_all: currentTopic.related_ability_all,
            origin: currentTopic.origin,
            knowledge_point: currentTopic.knowledge_point,
            exercise_id: currentTopic.exercise_id,
            exercise_set_id: exercise_set_id,
        };
        axios.post(api.getChineseKeyExercise, obj).then((res) => {
            let _currentTopic = JSON.parse(JSON.stringify(res.data.data));
            _currentTopic.optionsList = this.getOptions(_currentTopic);
            console.log("获取要素题", _currentTopic);
            this.setState(
                {
                    currentTopic: _currentTopic,
                    answerIndex: -1,
                    visible: false,
                },
                () => {
                    this.isElement = true;
                }
            );
        });
    };
    checkAnswer = (item, index) => {
        const { currentTopic } = this.state;
        let diagnose_notes = currentTopic.diagnose_notes.split("#")[item.index];
        let correct = "";
        item.content === currentTopic.answer_content
            ? (correct = "0")
            : (correct = "1");
        this.setState({
            answerIndex: index,
            diagnose_notes,
            correct,
        });
    };
    helpMe = () => {
        EventRegister.emitEvent("pauseAudioEvent");
        this.clickHelpNum++;
        this.setState({
            helpVisible: true,
            isClickHelp: true,
        });
    };
    onCloseHelp = () => {
        EventRegister.emitEvent("pauseAudioEvent");
        this.setState({
            helpVisible: false,
        });
    };
    onClose = () => {
        const { correct } = this.state;
        if (this.isElement) {
            // 要素题做错了
            console.log("要素题错了直接下一题");
            this.toNext();
        } else {
            // 原题做错
            this.saveResult(correct);
        }
    };
    nextTopic = () => {
        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const {
            exerciseList,
            answerIndex,
            correct,
            isClickHelp,
            topaicIndex,
        } = this.state;
        EventRegister.emitEvent("pauseAudioEvent");
        if (answerIndex < 0) return;
        let _exerciseList = JSON.parse(JSON.stringify(exerciseList));
        if (!this.isElement) {
            // 原题才做处理
            _exerciseList[topaicIndex]._correction = correct;
            if (isClickHelp) _exerciseList[topaicIndex]._correction = "1"; //点了帮助就算错
            isClickHelp
                ? this.noNumber++
                : correct === "0"
                    ? this.yesNumber++
                    : this.noNumber++;
        }
        console.log("当前题是否是要素题", this.isElement);
        if (correct === "0") {
            // 做对了
            PlayAudio.playSuccessSound(url.successAudiopath2);
            this.saveResult(correct);

        }
        if (correct === "1") {
            // 做错了
            PlayAudio.playSuccessSound(url.failAudiopath);
            this.setState({
                visible: true,
            });
        }
        this.setState({
            exerciseList: _exerciseList, //更新答案卡
        });
    };
    toNext = () => {
        const { topaicIndex, exerciseList } = this.state;
        console.log("跳下一道原题");
        if (topaicIndex + 1 === exerciseList.length) {
            // console.log("最后一题", this.yesNumber, this.noNumber);
            this.setState({
                visible: false
            })
            setTimeout(() => {
                this.setState({
                    answerStatisticsModalVisible: true,
                })
            }, 600)
        } else {
            exerciseList[topaicIndex + 1].optionsList = this.getOptions(
                exerciseList[topaicIndex + 1]
            );
            this.setState(
                {
                    topaicIndex: topaicIndex + 1,
                    currentTopic: exerciseList[topaicIndex + 1],
                    answerIndex: -1,
                    isClickHelp: false,
                    visible: false,
                },
                () => {
                    this.isElement = false;
                    this.clickHelpNum = 0;
                    this.answer_start_time = this.getTime();
                }
            );
        }
    };
    saveResult = (correct) => {
        const {
            exerciseList,
            topaicIndex,
            currentTopic,
            isClickHelp,
            exercise_set_id,
            answerIndex,
        } = this.state;
        if (!this.isElement) {
            console.log("原题不论对错都保存");
            let obj = {
                grade_code: this.checkGrade,
                term_code: this.checkTeam,
                textbook: this.props.textbook + '',
                unit_code: this.unit_code,
                student_code: this.id,
                origin: currentTopic.origin,
                knowledge_point: currentTopic.knowledge_point,
                exercise_id: currentTopic.exercise_id,
                exercise_point_loc: "",
                exercise_result: currentTopic.optionsList[answerIndex].content,
                exercise_set_id: exercise_set_id,
                identification_results: "",
                is_modification: 1, //不是要素题
                answer_start_time: this.answer_start_time, // 答题开始时间
                answer_end_time: this.getTime(), // 答题结束时间
                is_correction: "", // 是否批改
                correction_remarks: "", //批改备注信息
                correction: isClickHelp ? "1" : correct, //批改对错，0 正确 1错误
                record: "", //  批改记录
                is_help: isClickHelp ? 0 : 1, //是都点击帮助0是，1是否
                tooltip_access_frequency: this.clickHelpNum, //点击帮助的次数
                tooltip_access_time: "", //点击帮助停留时间
                is_element_exercise: 1, // 是否做错推送的要素题
                is_finish: topaicIndex + 1 == exerciseList.length ? 0 : 1, //整套题是否做完,0  做完，，1没做完
                answer_origin: '4',
                alias: "chinese_toChooseText",
            };
            console.log('保存参数：：：：：：：：：：：：：：：：：', obj)
            axios.post(api.saveChineseBagExercise, obj).then((res) => {
                console.log("保存结果", res);
                this.props.getRewardCoin()
                if (correct === "0") {
                    if (topaicIndex + 1 === exerciseList.length) {
                        getRewardCoinLastTopic().then(res => {
                            if (res.isReward) {
                                // 展示奖励弹框,在动画完后在弹统计框
                                this.eventListener = DeviceEventEmitter.addListener(
                                    "rewardCoinClose",
                                    () => {
                                        this.toNext()
                                        this.eventListener && this.eventListener.remove()
                                    }
                                );
                            } else {
                                this.toNext()
                            }
                        })
                    } else {
                        this.toNext()
                    }
                } else {
                    console.log("原题做错获取要素题");
                    this.getElementExcercise();
                }
            });

        } else {
            console.log("要素题对了不保存");
            this.toNext();
        }
    };
    renderTopic = () => {
        const { answerIndex, tagText, currentTopic } = this.state;
        // console.log("```````````````````", currentTopic);
        return (
            <View style={[styles.topicWrap]}>
                {tagText ? (
                    <Text style={[{ fontSize: pxToDp(28) }]}>{tagText}</Text>
                ) : (
                    // 有题
                    <>
                        <ScrollView style={[{ flex: 1 }]}>
                            <View
                                style={[appStyle.flexTopLine, { marginBottom: pxToDp(32) }]}
                            >
                                {currentTopic.private_stem_audio ? (
                                    <PlayAudioBtn audioUri={baseUrl + currentTopic.private_stem_audio}>
                                        <Image
                                            style={{
                                                width: pxToDp(360),
                                                height: pxToDp(140),
                                                resizeMode: "contain",
                                            }}
                                            resizeMode="contain"
                                            source={baseUrl + currentTopic.private_stem_audio === this.props.playingAudio ? require("../../../../images/chineseHomepage/composition/audioPlay.png") : require("../../../../images/chineseHomepage/composition/audiostop.png")}
                                        />
                                    </PlayAudioBtn>
                                ) : null}
                                <RichShowView
                                    width={pxToDp(1300)}
                                    value={
                                        currentTopic.private_exercise_stem
                                            ? currentTopic.private_exercise_stem
                                            : ""
                                    }
                                    size={6}
                                ></RichShowView>
                            </View>
                            {currentTopic.private_stem_picture ? (
                                <ViewControl
                                    cropWidth={350}
                                    cropHeight={300}
                                    imageWidth={350}
                                    imageHeight={300}
                                >
                                    <Image
                                        style={{
                                            width: 350,
                                            height: 300,
                                        }}
                                        source={{
                                            uri: baseUrl + currentTopic.private_stem_picture,
                                        }}
                                        resizeMode={"contain"}
                                    ></Image>
                                </ViewControl>
                            ) : null}
                            <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                                {currentTopic.optionsList.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={[styles.option, answerIndex === index ? { backgroundColor: '#FFAE2F' } : null, index % 2 === 0 ? { marginRight: pxToDp(40) } : null, currentTopic.content_picture === "0" || !currentTopic.content_picture ? null : { height: pxToDp(260) }]}
                                            onPress={() => {
                                                this.checkAnswer(item, index);
                                            }}
                                            key={index}
                                        >
                                            <View style={[styles.optionInner, appStyle.flexCenter, answerIndex === index ? { backgroundColor: "#FFD983" } : null]}>
                                                {currentTopic.content_picture === "0" ||
                                                    !currentTopic.content_picture ? (
                                                    <Text style={[{ fontSize: pxToDp(40) }, appFont.fontFamily_syst_bold]}>
                                                        {item.content}
                                                    </Text>
                                                ) : (
                                                    <Image
                                                        style={[size_tool(200)]}
                                                        source={{
                                                            uri: baseUrl + item.content,
                                                        }}
                                                        resizeMode={"contain"}
                                                    ></Image>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </>
                )}
            </View>
        );
    };
    render() {
        const {
            topaicIndex,
            helpVisible,
            exerciseList,
            currentTopic,
            visible,
            diagnose_notes,
            answerStatisticsModalVisible,
            tagText
        } = this.state;
        return (
            <ImageBackground style={[styles.container]} source={require("../../../../images/chineseHomepage/flow/flowBg.png")}>
                <BackBtn top={Platform.OS === 'ios' ? pxToDp(70) : null} goBack={() => {
                    NavigationUtil.goBack(this.props);
                }}></BackBtn>
                <View style={[styles.header, appStyle.flexCenter, appStyle.flexLine]}>
                    {[exerciseList.map((i, x) => {
                        return <View style={[styles.cardItem, topaicIndex === x ? styles.cardItemActive : null, i._correction ? { backgroundColor: i._correction === '0' ? "#16C792" : "#F2645B" } : null,]} key={x}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(36) }, appFont.fontFamily_syst_bold]}>{this.character}</Text>
                        </View>
                    })]}
                </View>
                <View style={[{ flex: 1, paddingLeft: pxToDp(80), paddingRight: pxToDp(80), paddingBottom: pxToDp(80) }]}>
                    {this.renderTopic()}
                    {tagText ? null : <>
                        <TouchableOpacity
                            style={[styles.nextBtn]}
                            onPress={this.submitThrottle}
                        >
                            <View style={[styles.nextBtnInner, appStyle.flexCenter]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>下一题</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.helpIcon]}
                            onPress={this.helpMe}
                        >
                            <Image
                                source={require("../../../../images/MathSyncDiagnosis/help_btn_1.png")}
                                resizeMode="contain"
                                style={{ width: pxToDp(100), height: pxToDp(100) }}
                            ></Image>
                        </TouchableOpacity>
                    </>}
                </View>
                <HelpModal visible={helpVisible} close={this.onCloseHelp} data={currentTopic}></HelpModal>
                <DiagnosisModal visible={visible} close={this.onClose} diagnosis={diagnose_notes}></DiagnosisModal>
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={this.yesNumber}
                    noNumber={this.noNumber}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={"完成"}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : pxToDp(50)
    },
    header: {
        height: pxToDp(120)
    },
    nextBtn: {
        width: pxToDp(200),
        height: pxToDp(200),
        backgroundColor: "#F07C39",
        borderRadius: pxToDp(100),
        paddingBottom: pxToDp(8),
        position: "absolute",
        right: pxToDp(120),
        bottom: pxToDp(120),
    },
    nextBtnInner: {
        flex: 1,
        backgroundColor: "#FF964A",
        borderRadius: pxToDp(100),
    },
    btnText: {
        fontSize: pxToDp(32),
        color: "#fff",
    },
    helpIcon: {
        position: "absolute",
        top: pxToDp(0),
        right: pxToDp(50),
    },
    option: {
        width: pxToDp(864),
        height: pxToDp(140),
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(40),
        backgroundColor: "#E7E7F2",
        marginBottom: pxToDp(40)
    },
    optionInner: {
        flex: 1,
        backgroundColor: "#F5F5FA",
        borderRadius: pxToDp(40),
        paddingLeft: pxToDp(16),
        paddingRight: pxToDp(16)
    },
    cardItem: {
        width: pxToDp(72),
        height: pxToDp(72),
        borderRadius: pxToDp(34),
        borderWidth: pxToDp(6),
        borderColor: 'transparent',
        ...appStyle.flexCenter,
        marginRight: pxToDp(24)
    },
    cardItemActive: {
        borderRadius: pxToDp(34),
        borderColor: '#FF964A',
    },
    topicWrap: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(80),
        padding: pxToDp(60),
        marginTop: pxToDp(20)
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        playingAudio: state.getIn(["audioStatus", "playingAudio"]),
        textbook: state.getIn(["yuwenInfo", "textbook"]),
        token: state.getIn(["userInfo", "token"]),
    };
};
const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};
export default connect(mapStateToProps, mapDispathToProps)(WordTreeDoExercise);
