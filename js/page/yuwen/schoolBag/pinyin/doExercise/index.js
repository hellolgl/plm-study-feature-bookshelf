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
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    fontFamilyRestoreMargin,
    borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import MixExercise from "./mix/DoExercise";
import CheckExercise from "./checkExercise";
import AnswerStatisticsModal from "../../../../../component/pinyinStatisticsModal";
import fonts from "../../../../../theme/fonts";
import SpeakExercise from "./speakExercise";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        let language_data = props.language_data.toJS();
        const { main_language_map, other_language_map, type, show_type } =
            language_data;
        this.state = {
            list: [],
            listindex: 0,
            exercise_times_id: "",
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
                main: main_language_map.finish,
                other: other_language_map.finish,
                pinyin: pinyin.finish,
            },
            visibleGood: false,
        };
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";

        this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";
    }
    componentDidMount() {
        this.getList();
    }
    getList = () => {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const { show_translate } = this.state.language_data;
        axios
            .get(api.chinesePinyinGetKnowExercise, {
                params: {
                    p_id: this.props.navigation.state.params.data.p_id,
                    grade_term: userInfoJs.checkGrade + userInfoJs.checkTeam,
                    support_languages: show_translate ? 1 : 0,
                },
            })
            .then((res) => {
                // console.log("回调", res.data.data)
                if (res.data.err_code === 0) {
                    let statuslist = [];
                    res.data.data.exercises.forEach(() => {
                        statuslist.push("");
                    });
                    this.setState({
                        list: res.data.data.exercises,
                        exercise_times_id: res.data.data.exercise_times_id,
                        statuslist,
                    });
                }
            });
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    componentWillUnmount() {
        const { status } = this.props.navigation.state.params.data;
        if (status) {
            DeviceEventEmitter.emit("backRecordList"); //返回页面刷新
        } else {
            DeviceEventEmitter.emit("backCheckType"); //返回页面刷新
        }
    }

    checkThis = (item) => {
        NavigationUtil.toChinesePinyinLookWordDetail({
            ...this.props,
            data: {
                ...item,
                updata: () => {
                    this.getList();
                },
            },
        });
    };

    saveExercise = async (value) => {
        let index = this.state.listindex;

        console.log("保存数据123", index);
        let { correct, wrong } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        axios
            .post(api.chinesePinyinSaveKnowExercise, {
                ...value,
                exercise_times_id: this.state.exercise_times_id,
                sign_out: index === this.state.list.length - 1 ? "0" : "1",
                grade_term: userInfoJs.checkGrade + userInfoJs.checkTeam,
            })
            .then((res) => {
                if (res.data.err_code === 0) {
                    ++index;
                    value.correct === 1 ? ++correct : ++wrong;
                    // console.log("回调456", index, this.state.list.length, index < this.state.list.length)
                    let arr = ["1", "2", "3"];
                    let listnow = [...this.state.statuslist];
                    listnow[index - 1] = value.correct === 1 ? "right" : "wrong";
                    let flag = true,
                        audioFlag = true;
                    if (value.correct === 1) {
                        flag = false;
                    }
                    let audioindex = Math.floor(Math.random() * 3);
                    let url = "";
                    switch (arr[audioindex] + "") {
                        case "1":
                            url = this.successAudiopath;
                            break;
                        case "2":
                            url = this.successAudiopath2;
                            break;
                        case "3":
                            url = this.successAudiopath3;
                            break;
                        default:
                            "";
                            break;
                    }
                    // !flag ? url = this.failAudiopath : ''
                    !flag ? PlayAudio.playSuccessSound(url) : "";
                    this.setState({
                        // pausedSuccess: flag,
                        // pausedfail: audioFlag,
                        correct,
                        wrong,
                        audioIndex: arr[audioindex] + "",
                        statuslist: listnow,
                        visibleGood: !flag,
                    });
                    if (index < this.state.list.length) {
                        this.setState({
                            listindex: flag ? index : index - 1,
                        });
                        if (!flag) {
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
                        console.log("这儿呢这儿呢人");
                        if (!flag) {
                            console.log("！flag");
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
                        } else {
                            console.log("flag=====");

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
                    }
                    // 异步问题没解决，要封装一个promise
                }
            });
    };
    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
    };
    resetToLogin = () => {
        NavigationUtil.resetToLogin(this.props);
    }
    audioPausedSuccess = () =>
        this.setState({ pausedSuccess: true, pausedfail: true });

    render() {
        const {
            list,
            listindex,
            pausedSuccess,
            pausedfail,
            audioIndex,
            statuslist,
            language_data,
        } = this.state;
        console.log("题干信息", list[listindex]);
        const { show_translate } = language_data;

        return (
            <ImageBackground
                source={
                    Platform.OS === "ios"
                        ? require("../../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png")
                        : require("../../../../../images/chineseHomepage/pingyin/new/wrapBg.png")
                }
                style={[
                    ,
                    {
                        flex: 1,
                        position: "relative",
                        paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={this.goBack}
                    style={[
                        {
                            position: "absolute",
                            top: pxToDp(48),
                            left: pxToDp(48),
                            zIndex: 99999,
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
                                    size_tool(72),
                                    appStyle.flexCenter,
                                    borderRadius_tool(100),
                                    {
                                        borderWidth: pxToDp(6),
                                        borderColor:
                                            index === listindex ? "#FF964A" : "transparent",
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
                                        { fontSize: pxToDp(36), color: item ? "#fff" : "#475266" },
                                        fonts.fontFamily_jcyt_700,
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <View
                    style={[
                        { flex: 1 },
                        appStyle.flexTopLine,
                        appStyle.flexCenter,
                        padding_tool(0, 80, 80, 80),
                    ]}
                >
                    <View
                        style={[
                            appStyle.flexCenter,
                            { flex: 1, backgroundColor: "#fff", borderRadius: pxToDp(80) },
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
                                    list[listindex]?.exercise_type_private === "3" ? (
                                    <MixExercise
                                        exercise={{
                                            ...list[listindex],
                                            knowledgepoint_explanation: show_translate
                                                ? list[listindex].knowledgepoint_explanation +
                                                list[listindex]?.translate_explanation?.en
                                                : list[listindex].knowledgepoint_explanation,
                                        }}
                                        saveExercise={this.saveExercise}
                                        show_translate={show_translate}
                                    />
                                ) : null}

                                {list.length > 0 &&
                                    list[listindex]?.exercise_type_private === "2" ? (
                                    <CheckExercise
                                        resetToLogin={this.resetToLogin}
                                        exercise={{
                                            ...list[listindex],
                                            knowledgepoint_explanation: show_translate
                                                ? list[listindex].knowledgepoint_explanation +
                                                list[listindex]?.translate_explanation?.en
                                                : list[listindex].knowledgepoint_explanation,
                                        }}
                                        saveExercise={this.saveExercise}
                                        show_translate={show_translate}
                                    />
                                ) : null}
                                {list.length > 0 &&
                                    list[listindex]?.exercise_type_private === "1" ? (
                                    <SpeakExercise
                                        exercise={{
                                            ...list[listindex],
                                            knowledgepoint_explanation: show_translate
                                                ? list[listindex].knowledgepoint_explanation +
                                                list[listindex]?.translate_explanation?.en
                                                : list[listindex].knowledgepoint_explanation,
                                        }}
                                        saveExercise={this.saveExercise}
                                        show_translate={show_translate}
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
                    finishTxt={this.state.finishTxt}
                    language_data={this.state.language_data}
                ></AnswerStatisticsModal>
                {/* {
                    pausedSuccess ? null :
                        <Audio isLocal={true} uri={`${audioIndex === '3' ? this.successAudiopath3 : audioIndex === '2' ? this.successAudiopath2 : this.successAudiopath}`} paused={pausedSuccess} pausedEvent={this.audioPausedSuccess} ref={this.audio1} />

                }
                <Audio isLocal={true} uri={`${this.failAudiopath}`} paused={pausedfail} pausedEvent={this.audioPausedSuccess} ref={this.audio1} /> */}
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
                            },
                        ]}
                    >
                        <Image
                            style={[size_tool(660)]}
                            source={require("../../../../../images/chineseHomepage/pingyin/new/good.png")}
                        />
                    </View>
                ) : null}
                {/* <Modal
                    visible={this.state.visibleGood}
                    transparent
                    style={[{ width: pxToDp(800), backgroundColor: 'transparent' }, appStyle.flexCenter]}
                >

                </Modal> */}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink",
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
