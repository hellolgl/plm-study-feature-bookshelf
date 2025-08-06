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
    ScrollView,
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
import Header from "../../../../../component/Header";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import MixExercise from './mix/DoExercise'
import CheckExercise from "../../bagExercise/components/checkExercise";
import SpeakExercise from "../../bagExercise/components/speakExercise";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
class LookAllExerciseHome extends PureComponent {
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
            visibleGood: false,
        };
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";

        this.failAudiopath = url.baseURL + "english/audio/Tryagain.m4a";

        this.exerciseRef = undefined;
    }
    componentDidMount() {
        this.getList();
    }
    getList = () => {
        const data = {
            exercise_id: this.props.navigation.state.params.data.exercise_id,
        };
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        data.student_code = userInfoJs.id;
        console.log('data', data)
        axios
            .get(api.getEnglishTestMeRecodListDetail, { params: data })
            .then((res) => {
                let list = res.data.data;
                console.log("-------", list);
                // for (let i in list) {
                //     list[i].colorFlag = 0
                // }
                //console.log("题目", list)
                this.setState(() => ({
                    list: [...list],

                    exercise_set_id: list.length > 0 ? list[0].exercise_set_id : "",
                }));
            });
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit("backRecordList"); //返回页面刷新
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
            audioIndex: arr[audioindex] + "",
            statuslist: listnow,
            visibleGood: !flag,
        });
        if (!flag) {
            setTimeout(() => {
                this.setState({
                    visibleGood: false,
                    listindex: index,
                });
            }, 500);
        }
        // 异步问题没解决，要封装一个promise
    };
    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false });
        this.goBack();
    };
    audioPausedSuccess = () =>
        this.setState({ pausedSuccess: true, pausedfail: true });
    helpMe = () => {
        console.log(this.exerciseRef);
        this.exerciseRef?.helpMe();
    };
    render() {
        const { list, listindex } = this.state;

        return (
            <ImageBackground
                source={require("../../../../../images/english/abcs/doBg.png")}
                resizeMode="cover"
                style={[
                    ,
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
                        source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
                        style={[size_tool(120, 80)]}
                    />
                </TouchableOpacity>
                <View
                    style={[
                        {
                            height: pxToDp(140),
                            width: pxToDp(1700),
                            marginBottom: pxToDp(20),
                        },
                        borderRadius_tool(0, 0, 30, 30),
                        appStyle.flexCenter,
                        padding_tool(0, 40, 0, 80),
                    ]}
                ></View>

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
                            source={require("../../../../../images/MathKnowledgeGraph/help_btn_1.png")}
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
                                    list[listindex]?.exercise_type_public === "MCQ" ? (
                                    <CheckExercise
                                        exercise={{
                                            ...list[listindex],
                                        }}
                                        saveExercise={this.saveExercise}
                                        onRef={(view) => {
                                            console.log("ref", view);
                                            if (view) this.exerciseRef = view;
                                        }}
                                        isWrong={true}
                                    />
                                ) : null}

                                {list.length > 0 &&
                                    list[listindex]?.exercise_type_public === "FTB" ? (
                                    <SpeakExercise
                                        exercise={{
                                            ...list[listindex],
                                        }}
                                        saveExercise={this.saveExercise}
                                        onRef={(view) => {
                                            console.log("ref", view);
                                            if (view) this.exerciseRef = view;
                                        }}
                                        isWrong={true}
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
                            source={require("../../../../../images/chineseHomepage/pingyin/new/good.png")}
                        />
                    </View>
                ) : null}
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
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
