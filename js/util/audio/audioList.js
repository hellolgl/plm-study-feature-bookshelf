import React from "react";
import { TouchableOpacity, View, AppState, StyleSheet } from "react-native";
import Sound from "react-native-sound";
// import { EventRegister } from "react-native-event-listeners";
import _ from "lodash";
import EventRegister from "./eventListener";
import * as actionCreators from "../../action/audio";
import { connect } from "react-redux";
import Lottie from "lottie-react-native";
import { pxToDp } from "../../util/tools";
let lootieurlArray = [
  "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/waiting.json",
  "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/speaking.json",
];
class AudioBtn extends React.Component {
  constructor(props) {
    super(props);
    let audiostatus = this.props.audio_data.toJS();
    this.state = {
      paused: true,
      audiostatus: _.cloneDeep(audiostatus),
      eventId: "",
      urlIndex: 0,
    };
    this.eventListener = undefined;
    this.sound = undefined;
    this.animation = null;
  }

  componentDidMount() {
    this.props.onRef ? this.props.onRef(this) : null;
  }

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
    const { urlIndex } = this.state;
    let audiostatus = {};
    audiostatus[audioUri[urlIndex]] = !paused;
    this.props.setAudioStatus(audiostatus);
  };
  pausedEvent = () => {
    this.setState({
      paused: true,
    });
    // this.setPlayingStatus(this.props.audioUri, true);
  };
  pausedAudio = () => {
    try {
      this.sound?.pause();
    } catch (err) {
      console.log("pause audio error: ", err);
    }
  };
  successEvent = () => {
    const { urlIndex } = this.state;
    if (urlIndex < this.props.audioUri.length - 1) {
      this.setState(
        {
          //   audiostatus: {},
          //   paused: true,
          urlIndex: urlIndex + 1,
        },
        () => {
          urlIndex === this.props.audioUri.length - 1
            ? ""
            : this.playCurrentAudio(urlIndex + 1);
        }
      );
    } else {
      this.setState({
        audiostatus: {},
        paused: true,
        urlIndex: urlIndex + 1,
      });
      this.setPlayingStatus(this.props.audioUri, true);
      this.handleRelease();
      this.props.setAudioStatus({});
    }
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
  onPlay(urlIndex) {
    console.log("onPlay", urlIndex);
    try {
      this.handleRelease();
    } catch (err) {
      console.log("!!!!! catch handleRelease err: ", err);
    }
    let urlIndexNow = urlIndex < this.props.audioUri.length ? urlIndex : 0;
    let url = this.props.audioUri[urlIndexNow];
    this.setState({
      urlIndex: urlIndexNow,
    });
    console.log("音频", this.props.audioUri, url);
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
    if (eventId === "") {
      let eventIdnow = EventRegister.addEventListener("pauseAudioEvent", () => {
        this.pausedEvent();
      });
      this.setState({
        eventId: eventIdnow,
      });
    }
    // console.log("eventId", eventId);
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
      //   let url = audioUri;
      //   if (url.endsWith("#")) {
      //     url = url.slice(0, url.length - 1);
      //   }
      this.onPlay(this.state.urlIndex);
    }
  };
  render() {
    // console.log("audioUri: ", audioUri)
    const { paused, audiostatus, urlIndex } = this.state;
    const { pausedBtn, playBtn, wrapStyle, audioUri, children } = this.props;

    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={[wrapStyle]}
          onPress={() => {
            if (paused) {
              // this.setState(
              //   {
              //     urlIndex: 0,
              //   },
              //   () => {
              this.playCurrentAudio();
              // }
              // );
            } else {
              let audioStatusNow = _.cloneDeep(audiostatus);
              audioStatusNow[audioUri[urlIndex]] = false;
              console.log("audioStatusNow", audioStatusNow);
              this.props.setAudioStatus(audioStatusNow);
              this.pausedEvent();
            }
          }}
        >
          <View style={[styles.lottieStyle]}>
            <Lottie
              source={{
                uri: lootieurlArray[0],
              }}
              autoPlay={true}
              // loop={true}
              style={[
                styles.lottieStyle,
                styles.lottiePosition,
                {
                  opacity: paused ? 1 : 0,
                },
              ]}
              ref={(ref) => {
                this.animation = ref;
              }}
            />
            <Lottie
              source={{
                uri: lootieurlArray[1],
              }}
              autoPlay={true}
              // loop={true}
              style={[
                styles.lottieStyle,
                styles.lottiePosition,
                {
                  opacity: paused ? 0 : 1,
                },
              ]}
              ref={(ref) => {
                this.animation = ref;
              }}
            />
          </View>

          {paused ? playBtn : pausedBtn}
          {children}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  lottieStyle: {
    width: pxToDp(Platform.OS === "ios" ? 684 : 684),
    height: pxToDp(Platform.OS === "ios" ? 834 : 834),
  },
  lottiePosition: {
    position: "absolute",
    top: pxToDp(0),
    left: pxToDp(0),
  },
});
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
