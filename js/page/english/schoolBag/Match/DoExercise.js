import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Platform,
    DeviceEventEmitter
} from "react-native";
import { Modal } from "antd-mobile-rn";
import {
    margin_tool,
    size_tool,
    pxToDp,
    padding_tool,
    border_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import ConnectionOptions from "./components/ConnectionOptions";
import RichShowView from "../../../../component/math/RichShowViewHtml";
import url from "../../../../util/url";
import Sound from "react-native-sound";
import NavigationUtil from "../../../../navigator/NavigationUtil";
// import AnswerStatisticsModal from "../../../../component/AnswerStatisticsModal";
import PlayAudio from "./components/playAudio";
import fonts from "../../../../theme/fonts";
import AnswerStatisticsModal from "../../../../component/pinyinStatisticsModal";
import PlayAudioFun from "../../../../util/audio/playAudio";
import * as userAction from "../../../../action/userInfo";
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";

let baseUrl = url.baseURL;

class MixDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            exerciseArr: [],
            currentTopic: {},
            topicIndex: 0,
            tag: "正在获取题目...",
            helpVisible: false,
            exerciseStatistics: {
                0: 0,
                2: 0,
            },
            answerStatisticsModalVisible: false,
            isFail: false, //控制next按钮显示
        };
        this.checkGrade = props.userInfo.toJS().checkGrade;
        this.checkTeam = props.userInfo.toJS().checkTeam;
        this.textBookCode = props.textBookCode;
        this.id = props.userInfo.toJS().id;
        this.unit = this.props.navigation.state.params.data.origin.substring(8, 10);
        this.origin = this.props.navigation.state.params.data.origin;
        this.exercise_set_id = "";
        this.audioHelp = undefined;
        this.clickHelp = false;
        this.noNumber = 0;
        this.yesNumber = 0;
        this.clickHelpNum = 0;
        this.answer_start_time = this.getTime();
        this.ConnectionOptionsRef = undefined;
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";
        this.clickImageHelp = false;
        this.eventListener = undefined
    }
    componentDidMount() {
        this.getExercise();
    }
    goBack() {
        NavigationUtil.goBack(this.props);
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
    playHeplAudio = () => {
        const { currentTopic, isStartAudioHelp } = this.state;
        if (this.audioHelp) {
            // isStartAudioHelp
            //   ? this.audioHelp.pause()
            //   : this.audioHelp.play((success) => {
            //       if (success) {
            //         this.audioHelp.release();
            //       }
            //     });
            // this.setState({
            //   isStartAudioHelp: !isStartAudioHelp,
            // });
            // return;
            this.audioHelp.stop();
            this.audioHelp = undefined;
        }
        // let public_stem_audio =
        //   baseUrl +
        //   "chinese/03/00/exercise/audio/f0360c89e1bf4feca57b0ee67891df7b.mp3";
        this.audioHelp = new Sound(
            baseUrl + currentTopic.explanation_audio,
            null,
            (error) => {
                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp.play((success) => {
                        if (success) {
                            this.audioHelp.release();
                        }
                    });
                    // this.setState(() => ({
                    //   isStartAudioHelp: true,
                    // }));
                }
            }
        );
    };
    getExercise = () => {
        const { topicIndex } = this.state;
        let obj = {
            textbook: this.textBookCode,
            grade_code: this.checkGrade,
            term_code: this.checkTeam,
            unit_code: this.unit,
            student_code: this.id,
            origin: this.origin,
        };
        axios.get(api.lineExerciseEn, { params: obj }).then((res) => {
            // console.log("111111111111111", res);
            let exerciseArr = JSON.parse(JSON.stringify(res.data.data.exercise));
            exerciseArr.forEach((i) => {
                i._status = i.status;
                i.status = "";
            });
            this.exercise_set_id = res.data.data.exercise_set_id;
            this.setState({
                exerciseArr,
                currentTopic: exerciseArr[topicIndex] ? exerciseArr[topicIndex] : {},
                tag: exerciseArr.length > 0 ? "" : "当前单元没有题目",
            });
        });
    };
    nextTopic = () => {
        console.log("下一题");
        const { topicIndex, exerciseArr } = this.state;
        this.clickHelp = false;
        this.clickHelpNum = 0;
        this.setState({
            topicIndex: topicIndex + 1,
            currentTopic: exerciseArr[topicIndex + 1],
        });
    };
    helpMe = () => {
        this.clickHelp = true;
        this.clickHelpNum++;
        this.clickImageHelp = true;
        this.setState({
            helpVisible: true,
        });
    };
    onCloseHelp = () => {
        if (this.audioHelp) {
            this.audioHelp.stop();
            this.audioHelp = undefined;
        }
        this.setState(
            {
                helpVisible: false,
                isFail: false,
            },
            () => {
                this.clickImageHelp ? "" : this.ConnectionOptionsRef.tryAgian();
            }
        );
    };
    showStatistic = () => {
        let exerciseStatistics = { 0: this.yesNumber, 2: this.noNumber };
        console.log("谈统计框", exerciseStatistics);
        this.setState({
            answerStatisticsModalVisible: true,
            exerciseStatistics: exerciseStatistics,
        });
    };
    saveTopic = (wrongCanvasList, isFinish) => {
        const { currentTopic, topicIndex, exerciseArr, topaicIndex } = this.state;
        let _exerciseArr = JSON.parse(JSON.stringify(exerciseArr));
        console.log("第一次保存", currentTopic, topicIndex);
        let obj = {
            grade_code: this.checkGrade,
            term_code: this.checkTeam,
            textbook: this.textBookCode,
            unit_code: this.unit,
            student_code: this.id,
            origin: this.origin,
            knowledge_point: currentTopic.knowledge_point_code,
            exercise_id: currentTopic.l_e_id,
            exercise_point_loc: "",
            exercise_result: "",
            exercise_set_id: this.exercise_set_id,
            identification_results: "",
            is_modification: 1, //不是要素题
            answer_start_time: this.answer_start_time, // 答题开始时间
            answer_end_time: this.getTime(), // 答题结束时间
            is_correction: "", // 是否批改
            correction_remarks: "", //批改备注信息
            correction: this.clickHelp ? "1" : wrongCanvasList.length > 0 ? "1" : 0, //批改对错，0 正确 1错误
            is_help: this.clickHelp ? "0" : "1",
            record: "", //  批改记录
            tooltip_access_frequency: this.clickHelpNum, //点击帮助的次数
            tooltip_access_time: "", //点击帮助停留时间
            is_element_exercise: 1, // 是否是推送的要素题
            is_finish: topicIndex + 1 === exerciseArr.length ? 0 : 1, //整套题是否做完,0  做完，，1没做完
            knowledge_type: currentTopic.knowledge_typel,
            alias:
                this.origin === "032001000000"
                    ? "english_toAbcs"
                    : "english_toSelectUnitEn0",
        };
        // console.log("---------------", obj);
        let audioindex = Math.floor(Math.random() * 3);
        const audiolist = [
            this.successAudiopath,
            this.successAudiopath2,
            this.successAudiopath3,
        ];
        obj.correction === 0
            ? PlayAudioFun.playSuccessSound(audiolist[audioindex])
            : "";
        axios.post(api.saveLineexercise, obj).then((res) => {
            // console.log('==================',res)
            this.answer_start_time = this.getTime();
            if (!wrongCanvasList.length) {
                if (isFinish) {
                    // 最后一道
                    getRewardCoinLastTopic().then(res => {
                        if (res.isReward) {
                            // 展示奖励弹框,在动画完后在弹统计框
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.showStatistic()
                                    this.eventListener && this.eventListener.remove()
                                }
                            );
                        } else {
                            this.showStatistic()
                        }
                    })
                } else {
                    this.props.getRewardCoin()
                }
            }
        });

        if (wrongCanvasList.length > 0) {
            // 错
            _exerciseArr[topicIndex].status = "2";
            this.noNumber++;
        } else {
            // 对
            _exerciseArr[topicIndex].status = "0";
            if (this.clickHelp) {
                _exerciseArr[topicIndex].status = "2"; //点了帮助就算错
                this.noNumber++;
            } else {
                this.yesNumber++;
            }
        }
        this.setState({
            exerciseArr: _exerciseArr,
        });
    };
    showHelp = () => {
        console.log("做错弹帮助");
        this.clickImageHelp = false;
        this.setState({
            helpVisible: true,
            isFail: true,
        });
    };
    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
        this.setState({
            answerStatisticsModalVisible: false,
        });
    };
    render() {
        const {
            currentTopic,
            tag,
            exerciseArr,
            isStartAudioHelp,
            helpVisible,
            answerStatisticsModalVisible,
            exerciseStatistics,
            topicIndex,
        } = this.state;
        console.log("连线题...: ", exerciseArr.length);
        return (
            <ImageBackground
                source={require("../../../../images/english/sentence/sentenceBg.png")}
                style={[styles.container]}
            >
                <View style={[styles.header, appStyle.flexCenter]}>
                    <View
                        style={[
                            size_tool(729, 125),
                            borderRadius_tool(0, 0, 40, 40),
                            appStyle.flexCenter,
                            { backgroundColor: "#F1F5F8" },
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: pxToDp(50),
                                    color: "#39334C",
                                    lineHeight: pxToDp(60),
                                },
                                fonts.fontFamily_jcyt_700,
                            ]}
                        >
                            Mix&Match
                        </Text>
                    </View>
                    {/* <Image
            source={require("../../../../images/m_title.png")}
            style={[size_tool(376, 104)]}
          ></Image> */}
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[{ position: "absolute", top: pxToDp(60), left: 0 }]}
                    >
                        <Image
                            source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                        ></Image>
                    </TouchableOpacity>
                    <View style={[styles.circleCard, appStyle.flexTopLine]}>
                        {exerciseArr.map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        size_tool(72),
                                        appStyle.flexCenter,
                                        borderRadius_tool(100),
                                        {
                                            borderWidth: pxToDp(6),
                                            borderColor:
                                                index === topicIndex ? "#864FE3" : "transparent",
                                            backgroundColor:
                                                item.status === "0"
                                                    ? "#16C792"
                                                    : item.status === "2"
                                                        ? "#F2645B"
                                                        : "transparent",
                                            marginRight: pxToDp(
                                                index === exerciseArr.length - 1 ? 0 : 24
                                            ),
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                fontSize: pxToDp(36),
                                                color: item.status ? "#fff" : "#475266",
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
                </View>
                {exerciseArr.length > 0 ? (
                    <View style={[styles.contentWrap]}>
                        {currentTopic.stem_image ? (
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(1000)}
                                value={
                                    currentTopic.stem +
                                    `<img src="${baseUrl + currentTopic.stem_image
                                    }" style="width:350px,height:300px"></img>`
                                }
                            ></RichShowView>
                        ) : (
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(1000)}
                                value={currentTopic.stem}
                            ></RichShowView>
                        )}
                        <ConnectionOptions
                            onRef={(ref) => {
                                this.ConnectionOptionsRef = ref;
                            }}
                            currentTopic={currentTopic}
                            exerciseLen={exerciseArr.length}
                            nextTopic={this.nextTopic}
                            saveTopic={this.saveTopic}
                            showStatistic={this.showStatistic}
                            resetToLogin={() => {
                                NavigationUtil.resetToLogin(this.props);
                            }}
                            showHelp={this.showHelp}
                        ></ConnectionOptions>

                        <TouchableOpacity style={[styles.helpIcon]} onPress={this.helpMe}>
                            <Image
                                source={require("../../../../images/MathKnowledgeGraph/help_btn_1.png")}
                                style={[size_tool(80)]}
                            ></Image>
                        </TouchableOpacity>
                        {/* 帮助 */}
                        <Modal
                            visible={helpVisible}
                            // visible={false}
                            transparent={true}
                            style={[
                                { width: pxToDp(1000), backgroundColor: "regba(0,0,0,0)" },
                            ]}
                        >
                            <ImageBackground
                                source={require("../../../../images/english/mix/helpBg.png")}
                                style={[
                                    size_tool(968, 754),
                                    padding_tool(60, 80, 100, 80),
                                    { position: "relative" },
                                ]}
                            >
                                <ScrollView style={{ height: pxToDp(600) }}>
                                    {currentTopic.explanation_audio ? (
                                        <TouchableOpacity onPress={this.playHeplAudio}>
                                            {isStartAudioHelp ? (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../images/stop_icon.png")}
                                                ></Image>
                                            ) : (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../images/playAudio_icon.png")}
                                                ></Image>
                                            )}
                                        </TouchableOpacity>
                                    ) : null}
                                    <RichShowView
                                        value={
                                            currentTopic.knowledgepoint_explanation
                                                ? currentTopic.knowledgepoint_explanation
                                                : ""
                                        }
                                        color={"#fff"}
                                    ></RichShowView>
                                    <View style={[{ paddingTop: pxToDp(40) }]}>
                                        {currentTopic?.choice_content.map((item, index) => {
                                            return (
                                                <View
                                                    style={[
                                                        appStyle.flexTopLine,
                                                        appStyle.flexCenter,
                                                        { marginBottom: pxToDp(40) },
                                                    ]}
                                                    key={index}
                                                >
                                                    <View
                                                        style={[
                                                            { paddingRight: pxToDp(40), width: "50%" },
                                                            appStyle.flexAliEnd,
                                                        ]}
                                                    >
                                                        {/* 左边 */}
                                                        {currentTopic.combination_one === "text" ? (
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontSize: pxToDp(40),
                                                                        color: "#fff",
                                                                        lineHeight: pxToDp(50),
                                                                        flex: 1,
                                                                    },
                                                                    appFont.fontFamily_jcyt_700,
                                                                ]}
                                                            >
                                                                {item.left}
                                                            </Text>
                                                        ) : null}
                                                        {currentTopic.combination_one === "image" ? (
                                                            <Image
                                                                style={[size_tool(200)]}
                                                                source={{
                                                                    uri: baseUrl + item.left,
                                                                }}
                                                                resizeMode={"contain"}
                                                            />
                                                        ) : null}
                                                        {currentTopic.combination_one === "audio" ? (
                                                            <PlayAudio uri={item.left} />
                                                        ) : null}
                                                    </View>
                                                    <View style={[{ width: "50%" }]}>
                                                        {/* 右边 */}
                                                        {item.right.map((rightitem, rightindex) => {
                                                            return (
                                                                <View key={rightindex}>
                                                                    {currentTopic.combination_two === "text" ? (
                                                                        <Text
                                                                            style={[
                                                                                {
                                                                                    fontSize: pxToDp(40),
                                                                                    color: "#fff",
                                                                                    lineHeight: pxToDp(50),
                                                                                },
                                                                                appFont.fontFamily_jcyt_700,
                                                                            ]}
                                                                        >
                                                                            {" "}
                                                                            {rightitem}
                                                                        </Text>
                                                                    ) : null}
                                                                    {currentTopic.combination_two === "image" ? (
                                                                        <Image
                                                                            style={[size_tool(200)]}
                                                                            source={{
                                                                                uri: baseUrl + rightitem,
                                                                            }}
                                                                            resizeMode={"contain"}
                                                                        />
                                                                    ) : null}
                                                                    {currentTopic.combination_two === "audio" ? (
                                                                        <PlayAudio uri={rightitem} />
                                                                    ) : null}
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </ScrollView>
                                {/* <View style={[appStyle.flexLine, { marginTop: pxToDp(16),position:'absolute' }]}> */}
                                <TouchableOpacity
                                    style={[styles.footBtn, appStyle.flexCenter, size_tool(70)]}
                                    onPress={this.onCloseHelp}
                                >
                                    {/* <Text style={{ fontSize: pxToDp(32), color: '#037AFF' }} >关闭</Text> */}
                                    <Image
                                        source={require("../../../../images/english/mix/helpClose.png")}
                                        style={[size_tool(99)]}
                                    />
                                </TouchableOpacity>
                                {/* </View> */}
                            </ImageBackground>
                        </Modal>
                        {/* 统计 */}
                        {/* <AnswerStatisticsModal
              dialogVisible={answerStatisticsModalVisible}
              exerciseStatistics={exerciseStatistics}
              closeDialog={this.closeAnswerStatisticsModal}
            ></AnswerStatisticsModal> */}
                    </View>
                ) : (
                    <View style={[styles.contentWrap]}>
                        <Text style={{ fontSize: pxToDp(28) }}>{tag}</Text>
                    </View>
                )}
                <AnswerStatisticsModal
                    dialogVisible={answerStatisticsModalVisible}
                    yesNumber={exerciseStatistics["0"]}
                    noNumber={exerciseStatistics["2"]}
                    waitNumber={0}
                    closeDialog={this.closeAnswerStatisticsModal}
                    finishTxt={{
                        main: "完成",
                    }}
                ></AnswerStatisticsModal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Platform.OS === "ios" ? pxToDp(100) : pxToDp(60),
        paddingTop: 0,
        // paddingTop: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingBottom: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingLeft: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        // paddingRight: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        width: "100%",
    },
    helpIcon: {
        position: "absolute",
        right: pxToDp(40),
        top: pxToDp(40),
        zIndex: 1000,
    },
    header: {
        height: pxToDp(125),
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(40),
        position: "relative",
    },
    circleCard: {
        position: "absolute",
        right: pxToDp(-24),
    },
    contentWrap: {
        backgroundColor: "#fff",
        flex: 1,
        // height: pxToDp(1000),
        borderRadius: pxToDp(32),
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        paddingBottom: pxToDp(20),
    },
    footBtn: {
        // backgroundColor: 'red',
        flex: 1,
        position: "absolute",
        top: pxToDp(20),
        right: pxToDp(20),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    };
};
const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(MixDoExercise);
