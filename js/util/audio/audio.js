import React from "react";
import { Image, TouchableOpacity, View, AppState } from "react-native";
import Sound from "react-native-sound";
// import { EventRegister } from "react-native-event-listeners";
import _ from "lodash";
import EventRegister from "./eventListener";
import * as actionCreators from "../../action/audio";
import { connect } from "react-redux";

class AudioBtn extends React.Component {
    constructor(props) {
        super(props);
        let audiostatus = this.props.audio_data.toJS();
        this.state = {
            paused: true,
            audiostatus: _.cloneDeep(audiostatus),
            eventId: "",
            appState: AppState.currentState,
        };
        this.eventListener = undefined;
        this.sound = undefined;
    }

    componentDidMount() {
        this.props.onRef ? this.props.onRef(this) : null;
        AppState.addEventListener("change", this.handleAppStateChange);
    }
    handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState === "active" &&
            nextAppState.match(/inactive|background/)
        ) {
            console.log("App has gone to the background!");
            // 在此处执行应用程序切换到后台时的操作
            this.pausedEvent();
        }
        this.setState({ appState: nextAppState });
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.audioUri, prevProps.audioUri)) {
            if (this.sound) {
                this.pausedEvent();
                this.sound = undefined;
            }
        }
        if (this.state.paused) {
            this.pausedAudio();
        }

        if (prevState.eventId !== this.state.eventId) {
            console.log("State updated in componentDidUpdate:", this.state.eventId);
        }
    }

    componentWillUnmount() {
        if (this.eventListener !== undefined) {
            EventRegister.removeEventListener(this.eventListener);
        }
        AppState.removeEventListener("change", this.handleAppStateChange);

        this.setState({
            paused: true,
        });
        try {
            this.sound?.release();
        } catch (err) {
            console.log("componentWillUnmount audio error: ", err);
        }
    }

    setPlayingStatus = (audioUri, paused) => {
        let audiostatus = {};
        // audiostatus[audioUri] = !paused;
        this.props.setAudioStatus(audiostatus);
    };
    pausedEvent = () => {
        this.setState({
            paused: true,
        });
        this.pausedAudio();
        this.setPlayingStatus(this.props.audioUri, true);
    };
    pausedAudio = () => {
        try {
            this.sound?.pause();
        } catch (err) {
            console.log("pause audio error: ", err);
        }
    };
    successEvent = () => {
        this.setState({
            audiostatus: {},
            paused: true,
        });
        this.setPlayingStatus(this.props.audioUri, true);
        this.handleRelease();
        this.props.setAudioStatus({});
    };
    handleRelease = () => {
        let eventId = this.state.eventId;
        try {
            this.sound?.release();
            this.sound = undefined;
            EventRegister.removeEventListener(eventId);
            this.setState({
                eventId: "",
            });
        } catch (err) {
            console.log("release audio err: ", err);
        }
    };
    onPlay() {
        try {
            this.handleRelease();
        } catch (err) {
            console.log("!!!!! catch handleRelease err: ", err);
        }

        let url = this.props.audioUri;
        // 处理音频以 # 结尾时播放异常问题
        if (url.endsWith("#")) {
            url = url.slice(0, url.length - 1);
        }
        this.sound = new Sound(`${url}`, null, (error) => {
            if (error) {
                console.log(error);
            } else {
                this.setState({
                    paused: false,
                });
                try {
                    this.sound.play((success) => {
                        if (success) {
                            this.successEvent();
                        } else {
                            console.log("playback failed due to audio decoding errors");
                        }
                    });
                    this.sound.setSpeed(this.props.rate ? this.props.rate : 1);
                    this.props.onStartEvent && this.props.onStartEvent();
                } catch (err) {
                    console.log("!!!!! catch play err: ", err);
                }
            }
        });
    }
    playCurrentAudio = () => {
        console.log("playCurrentAudio");
        const { eventId, paused } = this.state;
        const { audioUri } = this.props;
        Sound.setCategory("Playback");
        // 创建事件监听
        let eventIdnow = ''
        if (eventId === "") {
            eventIdnow = EventRegister.addEventListener("pauseAudioEvent", () => {
                console.log('=============')
                this.pausedEvent();
            });
            this.setState(
                {
                    eventId: eventIdnow,
                },
                () => {
                    console.log("eventId:::::::", this.state.eventId);
                }
            );
        }
        console.log("eventId", eventIdnow, eventId);
        EventRegister.emitEvent("pauseAudioEvent", eventId, true);
        this.setState({
            paused: false,
        });
        this.setPlayingStatus(audioUri, false);
        if (this.sound && paused) {
            this.sound.play((success) => {
                if (success) {
                    this.successEvent();
                } else {
                    console.log("playback failed due to audio decoding errors");
                }
            });
            this.setState({
                paused: false,
            });
            this.setPlayingStatus(audioUri, false);
        } else {
            let url = audioUri;
            if (url.endsWith("#")) {
                url = url.slice(0, url.length - 1);
            }
            this.onPlay(url);
        }
    };
    render() {
        // console.log("audioUri: ", audioUri)
        const { paused, audiostatus } = this.state;
        const {
            pausedBtnImg,
            playBtnImg,
            pausedBtnStyle,
            playBtnStyle,
            audioUri,
            children,
        } = this.props;
        return (
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <TouchableOpacity
                    style={[this.props.wrapStyle && this.props.wrapStyle]}
                    onPress={() => {
                        if (paused) {
                            this.playCurrentAudio();
                        } else {
                            let audioStatusNow = _.cloneDeep(audiostatus);
                            audioStatusNow[audioUri] = false;
                            this.props.setAudioStatus(audioStatusNow);
                            this.pausedEvent();
                        }
                    }}
                >
                    {paused ? (
                        <Image
                            style={[playBtnStyle]}
                            resizeMode="contain"
                            source={playBtnImg}
                        ></Image>
                    ) : (
                        <Image
                            style={pausedBtnStyle}
                            resizeMode="contain"
                            source={pausedBtnImg}
                        ></Image>
                    )}
                    {children}
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        audio_data: state.getIn(["audioStatus", "audio_data"]),
        // userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {
        setAudioStatus(data) {
            dispatch(actionCreators.setAudioStatus(data));
        },
    };
};
export default connect(mapStateToProps, mapDispathToProps)(AudioBtn);
// export default AudioBtn;
