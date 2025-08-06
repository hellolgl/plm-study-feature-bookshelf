import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  pxToDp,
  size_tool,
  padding_tool,
  borderRadius_tool,
} from "../../../util/tools";
import { appFont, appStyle } from "../../../theme";
// import AudioComponent from './AudioComponent'
import url from "../../../util/url";
import Audio from "../../../util/audio/audio";
import Ise from "../../../util/ise/index";
import { Toast } from "antd-mobile-rn";
import Microphone from "../../../component/microphone/index";
import fonts from "../../../theme/fonts";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import { connect } from "react-redux";
// const titletext = ['一', '二', '三', '四']
class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPasued: true,
      score: props.value.score,
      index: -1,
      isRecording: false,
      scoreTxt: props.value.score ? props.value.score : "长按录音并评分",
    };
    this.audio = React.createRef();
  }
  componentDidMount() {
    const { index } = this.props;
    this.setState({
      index,
    });
  }
  audioPausedPrivate = () => {
    this.setState({
      isPasued: true,
    });
  };
  playAudio = () => {
    const { isPasued } = this.state;
    console.log("will play audio..: ", isPasued, this.audio);
    if (isPasued) {
      this.audio.current.replay();
    }
    this.setState({
      isPasued: !isPasued,
    });
  };
  uploadAudio = (file) => {
    const { value } = this.props;
    console.log("file", file);
    const filePath = file.uri;
    const word = value.xun_fei
      ? "\uFEFF" +
        `<customizer: interphonic>\n${value.xun_fei}\n${value.origin_tone}`
      : `\uFEFF${value.words[0]}`;

    console.log("debug word: ", word);
    const ise = new Ise();
    ise
      .sendFile(filePath, word)
      // {"phone_score": "100.000000", "tone_score": "100.000000", "total_score": "100.000000"}
      // phone_score：声韵分
      // tone_score：调型分
      // total_score：总分 【（phone_score + tone_score）/2】
      .then((score) => {
        if (score.dp_message !== "0") {
          return Toast.info(
            `发音要饱满，语速要缓慢哦！\n 加油！再读一次试试呢!`,
            3
          );
        } else {
          // return Toast.success(`分数：${Number(score.total_score).toFixed(0)}`, 2)
        }
      });
  };
  svecord = (score) => {
    const { value } = this.props;
    console.log("保存");
    axios
      .post(api.savePinyinSpeakScore, {
        p_id: value.p_id,
        pv_id: value.pv_id,
        alphabet_tone: value.alphabet_tone,
        score,
      })
      .then((res) => {
        console.log("返回来", res.data);
        if (res.data.err_code === 0) {
          if (res.data.data.tag) {
            this.props.showStar();
          }
        }
      });
  };
  render() {
    const { index, isPasued, isRecording, score, scoreTxt } = this.state;
    const { value } = this.props;
    // let score = 95
    // console.log('value123123132', value)
    return (
      <View
        style={[
          size_tool(396, 696),
          padding_tool(40),
          appStyle.flexCenter,
          { marginRight: pxToDp(20) },
        ]}
      >
        <View
          style={[
            {
              position: "relative",
              borderColor: "#DADCE0",
              borderWidth: pxToDp(4),
              borderRadius: pxToDp(200),
              padding: pxToDp(4),
            },
            size_tool(316),
            appStyle.flexTopLine,
            appStyle.flexCenter,
          ]}
        >
          {/* {value.audio ? <TouchableOpacity
                        onPress={this.playAudio}
                        style={[{
                            position: 'absolute',
                            top: pxToDp(-0),
                            right: pxToDp(0),
                            zIndex: 999
                        }]}>
                        <Image source={require('../../../images/chineseHomepage/pingyin/new/audioPlay1.png')}
                            style={[size_tool(80),]}
                        />
                    </TouchableOpacity> : null} */}
          {/* <Audio uri={`${url.baseURL}${value.audio}`} paused={isPasued} pausedEvent={this.audioPausedPrivate} ref={this.audio} /> */}
          {value.audio ? (
            <View
              style={[
                {
                  position: "absolute",
                  top: pxToDp(-0),
                  right: pxToDp(0),
                  zIndex: 999,
                },
                size_tool(80),
                appStyle.flexCenter,
              ]}
            >
              <Audio
                audioUri={`${url.baseURL}${value.audio}`}
                pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/audioPlay1.png")}
                pausedBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
                playBtnImg={require("../../../images/chineseHomepage/pingyin/new/audioPlay1.png")}
                playBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
              />
            </View>
          ) : null}
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexCenter,
              {
                position: "relative",
                height: "100%",
                flex: 1,
                backgroundColor: "#475266",
                borderRadius: pxToDp(200),
                overflow: "hidden",
              },
            ]}
          >
            {value?.alphabet_tone && value.alphabet_tone !== "None" ? (
              <Text
                style={[
                  {
                    fontSize:
                      value.alphabet_tone.length < 8 ? pxToDp(72) : pxToDp(72),
                    color: "#ffffff",
                    ...appFont.fonts_pinyin,
                    // lineHeight: pxToDp(100),
                    width: "100%",
                    textAlign: "center",
                    // fontFamily: Platform.OS === 'ios' ? 'AaBanruokaishu (Non-Commercial Use)' : '1574320058',
                  },
                  Platform.OS === "ios" && { lineHeight: pxToDp(90) },
                ]}
              >
                {value.alphabet_tone}
              </Text>
            ) : (
              <Text
                style={[
                  {
                    fontSize: pxToDp(72),
                    color: "#ffffff",
                  },
                  fonts.fontFamily_jcyt_700,
                ]}
              >
                ∅
              </Text>
            )}
            <View
              style={[
                size_tool(300, 300 * (score / 100)),
                {
                  position: "absolute",
                  let: 0,
                  bottom: 0,
                  backgroundColor: score >= 90 ? "#00B295" : "#E95D76",
                  zIndex: -1,
                },
              ]}
            ></View>
          </View>
        </View>

        <View
          style={[{ height: pxToDp(168), width: "100%" }, appStyle.flexCenter]}
        >
          {isRecording ? null : (
            <Text
              style={[
                {
                  fontSize: pxToDp(scoreTxt.length > 3 ? 28 : 40),
                  color:
                    scoreTxt.length > 3
                      ? "#475266"
                      : score > 89
                      ? "#00B295"
                      : "#E95D76",
                  opacity: 0.5,
                },
                fonts.fontFamily_jcyt_700,
              ]}
            >
              {scoreTxt}
            </Text>
          )}
        </View>

        <View style={[{ width: pxToDp(396), flex: 1, alignItems: "center" }]}>
          {value.alphabet_tone !== "None" ? (
            <Microphone
              microphoneImg={require("../../../images/chineseHomepage/pingyin/new/btn1.png")}
              microphoneImgStyle={{ width: pxToDp(140), height: pxToDp(140) }}
              activeMicrophoneImg={require("../../../images/chineseHomepage/pingyin/new/btn2.png")}
              activeMicrophoneImgStyle={{
                width: pxToDp(140),
                height: pxToDp(140),
              }}
              iseInfo={{ ...value, index }}
              onStartRecordEvent={() => {
                const { token, resetToLogin } = this.props;
                if (!token && resetToLogin) {
                  resetToLogin();
                  return;
                }
                this.setState({
                  isRecording: true,
                });
              }}
              onFinishRecordEvent={(score) => {
                this.svecord(score);
                this.setState({
                  isRecording: false,
                  score: parseInt(score).toFixed(0),
                  scoreTxt: parseInt(score).toFixed(0) + "",
                });
              }}
              waveStyle={{
                width: pxToDp(300),
                height: pxToDp(140),
              }}
              soundWavePosition={{
                top: pxToDp(-140),
                left: pxToDp(-78),
              }}
              backgroundColor={"#E6DBCF"}
            />
          ) : (
            <View style={[{ flex: 1 }, appStyle.flexCenter]}>
              <Image
                style={[size_tool(140)]}
                source={require("../../../images/chineseHomepage/pingyin/new/noAudio.png")}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(Bar);
