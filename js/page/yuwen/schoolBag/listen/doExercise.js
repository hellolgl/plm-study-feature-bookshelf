import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import Audio from "../../../../util/audio";
import url from "../../../../util/url";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import ReadingHelpModal from "../../../../component/chinese/ReadingHelpModal";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";

const log = console.log.bind(console);

class CharacterHelpModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isStartAudio: false,
            exerciseDetail: {},
            helpVisible: false,
            isEnd: false,
            paused: true,
        };
        this.audioHelp = undefined;
    }

    componentDidMount() {
        const data = {
            origin: this.props.navigation.state.params.data.origin,
        };
        axios.get(api.getChineseListenExecise, { params: data }).then((res) => {
            if (res && res.data.err_code === 0) {
                this.setState({
                    exerciseDetail: res.data.data,
                });
            }
        });
    }

    audioPaused = () => {
        this.setState({
            paused: true,
        });
    };

    audioPlay = () => {
        this.setState({
            paused: false,
        });
    };

    goback = () => {
        this.audioPaused();
        NavigationUtil.goBack(this.props); // this.props.goback();
    };

    playHeplAudio = () => {
        log("playHeplAudio before play");
        this.audioPlay();
    };

    start = () => {
        log("start...");
        this.audioPlay();
    };

    stop = () => {
        log("stop");
        this.audioPaused();
    };

    pause = () => {
        log("pause...");
        this.audioPaused();
    };

    overExercise = () => {
        this.audioPaused();

        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }

        let data = {
            origin: this.props.navigation.state.params.data.origin,
            exercise_id: this.state.exerciseDetail.exercise_id,
        };
        axios.post(api.saveChineseListenExecise, data).then((res) => {
            if (res && res.data.err_code === 0) {
                this.setState({
                    helpVisible: true,
                    isEnd: true,
                });
            } else {
                Toast.info("保存失败，请重新保存", 1);
            }
        });
    };

    onCloseHelp = () => {
        this.setState({
            helpVisible: false,
        });
        if (this.state.isEnd) {
            this.goback();
        }
    };
    lookHelp = () => {
        this.setState({
            helpVisible: true,
        });
        this.pause();
    };
    render() {
        let { paused, exerciseDetail } = this.state;
        let audioUri = `${url.baseURL}${exerciseDetail.private_stem_audio}`;
        return (
            <ImageBackground
                style={{
                    flex: 1,
                    alignItems: "center",
                    paddingTop: Platform.OS === "ios" ? pxToDp(50) : 0,
                }}
                source={require("../../../../images/chineseHomepage/listenExerciseBg.png")}
            >
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexJusBetween,
                        padding_tool(32, 64, 42, 64),
                        { width: "100%" },
                    ]}
                >
                    <TouchableOpacity
                        onPress={this.goback}
                        style={[size_tool(181, 92), { marginRight: pxToDp(170) }]}
                    >
                        <Image
                            style={[size_tool(80)]}
                            source={require("../../../../images/chineseHomepage/listenExercieBack.png")}
                        />
                    </TouchableOpacity>
                    <Image
                        style={[size_tool(452, 92)]}
                        source={require("../../../../images/chineseHomepage/listenExerciseTitle.png")}
                    />
                    <TouchableOpacity
                        onPress={this.lookHelp}
                        style={{ marginRight: pxToDp(170) }}
                    >
                        <Image
                            style={[size_tool(181, 92)]}
                            source={require("../../../../images/chineseHomepage/chineseListenHelp.png")}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[appStyle.flexCenter, { flex: 1 }]}>
                    <ImageBackground
                        style={[
                            {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                            },
                            size_tool(1000, 800),
                            padding_tool(0, 95, 82, 95),
                        ]}
                        source={require("../../../../images/chineseHomepage/listenExericseItemBg.png")}
                    >
                        <TouchableOpacity
                            style={[
                                size_tool(266, 120),
                                appStyle.flexCenter,
                                { position: "relative" },
                            ]}
                            onPress={this.start}
                        >
                            <Image
                                style={[size_tool(120)]}
                                source={require("../../../../images/chineseHomepage/listenExerciseStop.png")}
                            />
                            <View
                                style={[
                                    size_tool(120),
                                    {
                                        position: "absolute",
                                        top: 0,
                                        backgroundColor: "#666",
                                        opacity: paused ? 0 : 0.5,
                                        borderRadius: pxToDp(60),
                                    },
                                ]}
                            ></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ position: "relative" }}
                            onPress={this.pause}
                        >
                            <Image
                                style={[size_tool(120)]}
                                source={require("../../../../images/chineseHomepage/listenExercisePlay.png")}
                            />
                            <View
                                style={[
                                    size_tool(120),
                                    {
                                        position: "absolute",
                                        top: 0,
                                        backgroundColor: "#666",
                                        opacity: paused ? 0.5 : 0,
                                        borderRadius: pxToDp(60),
                                    },
                                ]}
                            ></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.overExercise}>
                            <Image
                                style={[size_tool(266, 92)]}
                                source={require("../../../../images/chineseHomepage/listenExerciseDone.png")}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                <ReadingHelpModal
                    status={this.state.helpVisible}
                    goback={this.onCloseHelp}
                    audio={this.state.exerciseDetail.explanation_audio}
                    knowledgepoint_explanation={
                        this.state.exerciseDetail.knowledgepoint_explanation
                    }
                />
                <Audio
                    uri={audioUri}
                    paused={paused}
                    pausedEvent={this.pause}
                    ref={this.audio}
                />
            </ImageBackground>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(CharacterHelpModal);
