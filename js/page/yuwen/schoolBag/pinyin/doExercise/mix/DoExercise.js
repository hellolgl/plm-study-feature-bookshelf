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
} from "react-native";
import { Modal } from "antd-mobile-rn";
import {
    margin_tool,
    size_tool,
    pxToDp,
    padding_tool,
    pxToDpHeight,
    border_tool
} from "../../../../../../util/tools";
import { appStyle, appFont } from "../../../../../../theme";
import { connect } from "react-redux";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import ConnectionOptions from "./components/ConnectionOptions";
// import RichShowView from "../../../../../../component/richShowViewNew";
import RichShowView from "../../../../../../component/chinese/newRichShowView";

import url from "../../../../../../util/url";
import Sound from "react-native-sound";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import AnswerStatisticsModal from "../../../../../../component/AnswerStatisticsModal";
import PlayAudio from "./components/playAudio";
import Audio from "../../../../../../util/audio";

let baseUrl = url.baseURL;

class MixDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            exerciseArr: [props.exercise],
            currentTopic: props.exercise,
            topicIndex: 0,
            tag: "正在获取题目...",
            helpVisible: false,
            exerciseStatistics: {
                0: 0,
                2: 0,
            },
            answerStatisticsModalVisible: false,
            isFail: false, //控制next按钮显示
            wrongCanvasList: [],
            paused: true,
        };
        this.checkGrade = props.userInfo.toJS().checkGrade;
        this.checkTeam = props.userInfo.toJS().checkTeam;
        this.textBookCode = props.textBookCode;
        this.id = props.userInfo.toJS().id;
        this.unit = "";
        this.origin = "";
        this.exercise_set_id = "";
        this.audioHelp = undefined;
        this.clickHelp = false;
        this.noNumber = 0;
        this.yesNumber = 0;
        this.clickHelpNum = 0;
        this.answer_start_time = new Date().getTime();
        this.ConnectionOptionsRef = undefined;
    }
    componentDidMount() { }
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
        const { paused } = this.state;

        this.setState({
            paused: !paused,
        });
    };

    nextTopic = (correct) => {
        const { currentTopic, wrongCanvasList } = this.state;
        console.log("下一题wrongCanvasList", wrongCanvasList);

        this.clickHelp = false;
        this.clickHelpNum = 0;
        let endTime = new Date().getTime();
        let obj = {
            ...currentTopic,
            knowledge_point: currentTopic?.knowledge_point_code,
            exercise_id: currentTopic?.l_p_id,
            is_modification: 1, //不是要素题
            answer_times: parseInt((endTime - this.answer_start_time) / 1000), // 答题开始时间
            // answer_end_time: this.getTime(), // 答题结束时间
            correct: this.clickHelp ? 0 : correct, //批改对错，1正确 0错误
            is_help: this.clickHelp ? "0" : "1",
            tooltip_access_frequency: this.clickHelpNum, //点击帮助的次数
            is_element_exercise: 1, // 是否是推送的要素题
            exercise_type_private: "3",
            // ability: currentTopic.ability,
        };
        this.props.saveExercise(obj);
        this.setState({
            // currentTopic: exerciseArr[topicIndex + 1],
            // wrongCanvasList: []
        });
    };
    helpMe = () => {
        this.clickHelp = true;
        this.clickHelpNum++;
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
                // this.nextTopic()
                this.ConnectionOptionsRef.tryAgian();
            }
        );
    };

    static getDerivedStateFromProps(props, state) {
        // console.log("数据", props?.exercise?.l_p_id, state?.currentTopic?.l_p_id)
        if (state.currentTopic.l_p_id !== props.exercise?.l_p_id) {
            state.currentTopic = props.exercise;
            state.exerciseArr = [props.exercise];
            return state;
        }
    }
    saveTopic = (wrongCanvasList) => {
        const { currentTopic, topicIndex, exerciseArr, topaicIndex } = this.state;
        let _exerciseArr = JSON.parse(JSON.stringify(exerciseArr));
        console.log("第一次保存wrongCanvasList", wrongCanvasList);

        // console.log("---------------", obj);
        // axios.post(api.saveLineexercise, obj).then((res) => {
        //   // console.log('==================',res)
        //   this.answer_start_time = this.getTime();
        // });

        // if (wrongCanvasList.length > 0) {
        //   // 错
        //   _exerciseArr[topicIndex].status = "2";
        //   this.noNumber++;
        // } else {
        //   // 对
        //   _exerciseArr[topicIndex].status = "0";
        //   if (this.clickHelp) {
        //     _exerciseArr[topicIndex].status = "2"; //点了帮助就算错
        //     this.noNumber++;
        //   } else {
        //     this.yesNumber++;
        //   }
        // }
        this.setState({
            exerciseArr: _exerciseArr,
            wrongCanvasList,
        });
    };
    showHelp = () => {
        // console.log("做错弹帮助");
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
    audioPaused = () => {
        this.setState({
            paused: true,
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
            paused,
        } = this.state;
        // console.log("连线题...: ", exerciseArr, currentTopic)
        let stem = currentTopic.stem ? currentTopic.stem : "";
        // stem = stem.replaceAll("<rt>", "<rt>&nbsp;");
        // stem = stem.replaceAll("</rt>", "&nbsp;<rt>");
        // stem = stem.replaceAll("<p><br/></p>", "");
        return (
            <View style={[{ width: "100%", height: "100%", padding: pxToDp(40), paddingTop: pxToDp(20) }]}>
                {exerciseArr.length > 0 ? (
                    <View style={[styles.contentWrap]}>
                        <View>
                            {currentTopic?.stem_image ? (
                                <RichShowView
                                    width={pxToDp(1000)}
                                    value={
                                        stem +
                                        `<img src="${baseUrl + currentTopic?.stem_image
                                        }" style="width:350px,height:300px"></img>`
                                    }
                                    size={2}
                                // fontFamily={"jiangchengyuanti"}
                                ></RichShowView>
                            ) : (
                                <View
                                    style={[
                                        {
                                            minHeight:
                                                Platform.OS === "ios" ? pxToDp(180) : pxToDp(140),
                                        },
                                    ]}
                                >
                                    <RichShowView
                                        width={pxToDp(1400)}
                                        value={`<div id="yuanti">${stem}</div>`}
                                        size={2}
                                    // fontFamily={"jiangchengyuanti"}
                                    ></RichShowView>
                                </View>
                            )}
                            {this.props.show_translate ? <Text style={[{ fontSize: pxToDpHeight(50), marginTop: Platform.OS === 'ios' ? pxToDp(-60) : pxToDp(-70) }, appFont.fontFamily_syst]}>{currentTopic.translate_stem.en.replace(/<[^>]+>/g, '')}</Text> : null}
                        </View>
                        <ConnectionOptions
                            onRef={(ref) => {
                                this.ConnectionOptionsRef = ref;
                            }}
                            currentTopic={currentTopic}
                            exerciseLen={exerciseArr.length}
                            nextTopic={this.nextTopic}
                            saveTopic={this.saveTopic}
                            showStatistic={this.showStatistic}
                            showHelp={this.showHelp}
                            isdid={this.props.isdid}
                            isWrong={this.props.isWrong}
                        ></ConnectionOptions>
                        <TouchableOpacity style={[styles.helpIcon]} onPress={this.helpMe}>
                            <Image
                                source={require("../../../../../../images/chineseHomepage/pingyin/new/help.png")}
                                style={[size_tool(100)]}
                                resizeMode="contain"
                            ></Image>
                        </TouchableOpacity>
                        {/* 帮助 */}
                        <Modal
                            visible={helpVisible}
                            // visible={false}
                            transparent={true}
                            style={[
                                {
                                    width: pxToDp(2048),
                                    height: "100%",
                                    backgroundColor: "regba(0,0,0,0)",
                                },
                                appStyle.flexCenter,
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        width: pxToDp(1280),
                                        height: pxToDp(860),
                                        position: "relative",
                                    },
                                    appStyle.flexCenter,
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            height: pxToDp(740),
                                            width: pxToDp(1280),
                                            backgroundColor: "#DAE2F2",
                                            borderRadius: pxToDp(80),
                                            position: "relative",
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            size_tool(1280, 736),
                                            appStyle.flexCenter,
                                            padding_tool(20, 100, 60, 100),
                                            { backgroundColor: "#fff", borderRadius: pxToDp(80) },
                                        ]}
                                    >
                                        <ScrollView
                                            style={{
                                                height: pxToDp(600),
                                                paddingTop: pxToDp(60),
                                                width: "100%",
                                            }}
                                        >
                                            <View style={[{ paddingBottom: pxToDp(40) }]}>
                                                {currentTopic?.explanation_audio ? (
                                                    <TouchableOpacity onPress={this.playHeplAudio}>
                                                        {paused ? (
                                                            <Image
                                                                style={[size_tool(80)]}
                                                                source={require("../../../../../../images/stop_icon.png")}
                                                            ></Image>
                                                        ) : (
                                                            <Image
                                                                style={[size_tool(80)]}
                                                                source={require("../../../../../../images/playAudio_icon.png")}
                                                            ></Image>
                                                        )}
                                                    </TouchableOpacity>
                                                ) : null}
                                                {currentTopic?.explanation_audio ? (
                                                    <Audio
                                                        uri={baseUrl + currentTopic?.explanation_audio}
                                                        paused={paused}
                                                        pausedEvent={this.audioPaused}
                                                    />
                                                ) : null}
                                                <RichShowView
                                                    width={pxToDp(960)}
                                                    value={
                                                        currentTopic?.knowledgepoint_explanation
                                                            ? `<div id="yuanti">${currentTopic?.knowledgepoint_explanation}`
                                                            : ""
                                                    }
                                                    // fontFamily={"jiangchengyuanti"}
                                                    size={2}
                                                ></RichShowView>
                                                <Text
                                                    style={[{ fontSize: pxToDp(36), color: "#FD942D" }]}
                                                >
                                                    【正确答案】
                                                </Text>
                                                <View
                                                    style={[
                                                        {
                                                            paddingTop: pxToDp(40),
                                                            paddingBottom: pxToDp(40),
                                                            paddingLeft: pxToDp(100),
                                                        },
                                                    ]}
                                                >
                                                    {currentTopic?.choice_content.map((item, index) => {
                                                        return (
                                                            <View
                                                                style={[
                                                                    appStyle.flexTopLine,
                                                                    appStyle.flexAliCenter,
                                                                    { marginBottom: pxToDp(40) },
                                                                ]}
                                                                key={index}
                                                            >
                                                                <View
                                                                    style={[
                                                                        { marginRight: pxToDp(40) },
                                                                        appStyle.flexAliEnd,
                                                                    ]}
                                                                >
                                                                    {/* 左边 */}
                                                                    {currentTopic?.combination_one === "text" ? (
                                                                        <Text
                                                                            style={[
                                                                                {
                                                                                    fontSize: pxToDp(40),
                                                                                    lineHeight: pxToDp(50),
                                                                                },
                                                                                appFont.fontFamily_syst_bold,
                                                                            ]}
                                                                        >
                                                                            {item.left}
                                                                        </Text>
                                                                    ) : null}
                                                                    {currentTopic?.combination_one === "image" ? (
                                                                        <Image
                                                                            style={[size_tool(200)]}
                                                                            source={{
                                                                                uri: baseUrl + item.left,
                                                                            }}
                                                                            resizeMode={"contain"}
                                                                        />
                                                                    ) : null}
                                                                    {currentTopic?.combination_one === "audio" ? (
                                                                        <PlayAudio uri={item.left} />
                                                                    ) : null}
                                                                </View>
                                                                <View style={[{}]}>
                                                                    {/* 右边 */}
                                                                    {item.right.map((rightitem, rightindex) => {
                                                                        return (
                                                                            <View key={rightindex}>
                                                                                {currentTopic?.combination_two ===
                                                                                    "text" ? (
                                                                                    <Text
                                                                                        style={[
                                                                                            {
                                                                                                fontSize: pxToDp(40),
                                                                                                lineHeight: pxToDp(50),
                                                                                            },
                                                                                            appFont.fontFamily_syst_bold,
                                                                                        ]}
                                                                                    >
                                                                                        {" "}
                                                                                        {rightitem}
                                                                                    </Text>
                                                                                ) : null}
                                                                                {currentTopic?.combination_two ===
                                                                                    "image" ? (
                                                                                    <Image
                                                                                        style={[size_tool(200)]}
                                                                                        source={{
                                                                                            uri: baseUrl + rightitem,
                                                                                        }}
                                                                                        resizeMode={"contain"}
                                                                                    />
                                                                                ) : null}
                                                                                {currentTopic?.combination_two ===
                                                                                    "audio" ? (
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
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.footBtn,
                                        appStyle.flexCenter,
                                        size_tool(280, 120),
                                    ]}
                                    onPress={this.onCloseHelp}
                                >
                                    <Image
                                        source={require("../../../../../../images/chineseHomepage/pingyin/new/closeHelp.png")}
                                        style={[size_tool(280, 120)]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                ) : (
                    <View style={[styles.contentWrap]}>
                        <Text style={{ fontSize: pxToDp(28) }}>{tag}</Text>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: Platform.OS === "ios" ? pxToDp(100) : pxToDp(60),
        // paddingTop: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingBottom: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingLeft: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        // paddingRight: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        width: "100%",
    },
    helpIcon: {
        position: "absolute",
        right: pxToDp(40),
        top: pxToDp(0),
        zIndex: 1000,
    },

    contentWrap: {
        // backgroundColor: "pink",
        flex: 1,
        // height: pxToDp(1000),
        // borderRadius: pxToDp(32),
        // paddingTop: pxToDp(40),
        // paddingLeft: pxToDp(40),
        // paddingRight: pxToDp(40),
        // paddingBottom: pxToDp(175),
    },
    footBtn: {
        // backgroundColor: 'red',
        flex: 1,
        position: "absolute",
        bottom: pxToDp(-0),
        left: "50%",
        marginLeft: pxToDp(-140),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    };
};
export default connect(mapStateToProps)(MixDoExercise);
