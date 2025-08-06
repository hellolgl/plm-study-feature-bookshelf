import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import ChineseMindMapping from "../../../../../component/chinese/ChineseMindMapping";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import Sound from "react-native-sound";
import url from "../../../../../util/url";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Btn from "../../../../../component/chinese/btn";
import Audio from "../../../../../util/audio/audio";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thinking_tips: "",
      isStartAudioT: false,
      audio: "",
      exercise: {},
      title: this.props.navigation.state.params.data.text,
    };
    this.audio = React.createRef();
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    this.closeAudio();
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getlist();
  }

  getlist() {
    console.log("m_id===", this.props.navigation.state.params.data);
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    axios
      .get(api.getChineseCompositionStructureExplanation, {
        params: {
          ...this.props.navigation.state.params.data,
          c_id: userInfoJs.c_id,
          grade_code: userInfoJs.checkGrade,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log("返回值", res.data.data);
          this.setState({
            thinking_tips: res.data.data.thinking_tips,
            audio: res.data.data.audio,
            exercise: res.data.data.exercise,
          });
        }
      });
  }
  //关闭语音播放
  closeAudio = () => {
    this.audio?.sound && this.audio?.pausedEvent();
  };

  todoExercise = () => {
    this.closeAudio();
    NavigationUtil.toCompositionMindMapDoexercise({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        thinking_tips: this.state.thinking_tips,
        updata: () => {
          this.getlist();
        },
      },
    });
  };
  extractChineseCharactersAndPunctuation = (html) => {
    // 使用正则表达式匹配所有汉字和汉语标点符号，同时排除英文字符
    const chineseCharsAndPunctuation = html.match(
      /(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g
    );

    if (chineseCharsAndPunctuation) {
      const chineseText = chineseCharsAndPunctuation.join("");
      return (
        chineseText
          // .replaceAll("（）", "")
          .replaceAll("&nbsp;", "")
          .replaceAll(">", "")
      );
    } else {
      // 如果没有匹配到字符，返回空字符串或者其他适当的值
      return "";
    }
  };
  todoexerciseone = (item) => {
    this.closeAudio();
    NavigationUtil.toCompositionMindMapDoexercise({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        thinking_tips: this.state.thinking_tips,
        isOne: true,
        exercise_type: item.exercise_type,
        exercise_id: item.exercise_id,
        exercise_times_id: this.state.exercise.exercise_times_id,
        updata: () => {
          console.log("重新请求");
          this.getlist();
        },
      },
    });
  };
  renderbig = () => {
    const { thinking_tips, isStartAudioT, audio } = this.state;

    return (
      <View
        style={[
          { width: "100%", flex: 1, alignItems: "center" },
          padding_tool(0, 60, 40, 60),
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: pxToDp(40),
              width: "100%",
            },
            padding_tool(40),
          ]}
        >
          <ScrollView>
            {audio ? (
              <View style={[{ zIndex: 9 }]}>
                <Audio
                  audioUri={`${url.baseURL}${audio}`}
                  pausedBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioPlay.png")}
                  pausedBtnStyle={{ width: pxToDp(268), height: pxToDp(228) }}
                  playBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioStop.png")}
                  playBtnStyle={{ width: pxToDp(268), height: pxToDp(228) }}
                  onRef={(ref) => (this.audio = ref)}
                />
              </View>
            ) : null}
            <RichShowView
              width={pxToDp(1800)}
              value={thinking_tips}
              size={2}
            ></RichShowView>
          </ScrollView>
          <View style={[appStyle.flexAliEnd]}>
            {/* <TouchableOpacity
                        onPress={this.todoExercise}
                        style={[
                            size_tool(174, 64),
                            { backgroundColor: '#773813', borderRadius: pxToDp(16) },
                            appStyle.flexCenter]}>
                        <Text style={[{ fontSize: pxToDp(32), color: "#fff" }, appFont.fontFamily_syst]}>开始答题</Text></TouchableOpacity> */}
            <Btn
              styleObj={{
                bgColor: "#FF964A",
                bottomColor: "#F07C39",
                fontColor: "#fff",
                borderRadius: pxToDp(200),
                height: pxToDp(120),
                fontSize: pxToDp(40),
                width: pxToDp(280),
              }}
              clickBtn={this.todoExercise}
              txt={"开始答题"}
            />
          </View>
        </View>
      </View>
    );
  };
  rendetlittle = () => {
    const { thinking_tips, isStartAudioT, audio, exercise } = this.state;

    return (
      <View
        style={[
          { flex: 1, width: "100%" },
          padding_tool(0, 40, 60, 40),
          appStyle.flexTopLine,
          appStyle.flexJusBetween,
        ]}
      >
        <View style={[{ height: "100%" }]}>
          <View
            style={[
              {
                width: pxToDp(800),
                flex: 1,
              },
              borderRadius_tool(0, 0, 32, 32),
            ]}
          >
            <ScrollView>
              {audio ? (
                // <View style={[{ position: 'absolute', top: pxToDp(-20), right: pxToDp(120) }]} >
                <View style={[{ zIndex: 9 }]}>
                  <Audio
                    audioUri={`${url.baseURL}${audio}`}
                    pausedBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioPlay.png")}
                    pausedBtnStyle={{ width: pxToDp(268), height: pxToDp(228) }}
                    playBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioStop.png")}
                    playBtnStyle={{ width: pxToDp(268), height: pxToDp(228) }}
                    onRef={(ref) => (this.audio = ref)}
                  />
                </View>
              ) : null}
              <RichShowView
                width={pxToDp(780)}
                value={thinking_tips}
                size={2}
              ></RichShowView>
            </ScrollView>
          </View>
        </View>
        <View
          style={[
            appStyle.flexAliEnd,
            { height: "100%", flex: 1, paddingLeft: pxToDp(40) },
          ]}
        >
          <ScrollView style={{ marginBottom: pxToDp(40), width: "100%" }}>
            {exercise.exercise.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={this.todoexerciseone.bind(this, item)}
                  key={index}
                  style={[
                    padding_tool(40),
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    appStyle.flexJusBetween,
                    {
                      backgroundColor: "#fff",
                      borderRadius: pxToDp(24),
                      marginBottom: pxToDp(40),
                      width: "100%",
                      minHeight: pxToDp(108),
                    },
                  ]}
                >
                  {/* <RichShowView
                                width={pxToDp(868)}
                                value={
                                    item.private_exercise_stem ? item.private_exercise_stem : item.stem ? item.stem : item.common_stem
                                }
                                size={5}
                            /> */}
                  <Text style={[styles.stemFont]}>
                    {item.private_exercise_stem
                      ? this.extractChineseCharactersAndPunctuation(
                          item.private_exercise_stem
                        )
                      : item.stem
                      ? item.stem
                      : item.common_stem}
                  </Text>

                  <FontAwesome
                    name={"chevron-right"}
                    size={20}
                    style={{ color: "#A3A8B3" }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Btn
            styleObj={{
              bgColor: "#FF964A",
              bottomColor: "#F07C39",
              fontColor: "#fff",
              borderRadius: pxToDp(200),
              height: pxToDp(120),
              fontSize: pxToDp(40),
              width: pxToDp(280),
            }}
            clickBtn={this.goBack}
            txt={"完成"}
          />
          {/* <TouchableOpacity
                    onPress={this.goBack}
                    style={[
                        size_tool(174, 64),
                        { backgroundColor: '#773813', borderRadius: pxToDp(16) },
                        appStyle.flexCenter]}>
                    <Text style={[{ fontSize: pxToDp(32), color: "#fff" }, appFont.fontFamily_syst]}>完成</Text></TouchableOpacity> */}
        </View>
      </View>
    );
  };
  render() {
    const { exercise, title } = this.state;
    // console.log("数据", thinking_tips)
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        resizeMode="cover"
      >
        <View
          style={[
            appStyle.flexLine,
            appStyle.flexJusBetween,
            padding_tool(0, 64, 0, 64),
            { width: "100%", height: pxToDp(128) },
          ]}
        >
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              { fontSize: pxToDp(40), color: "#475266" },
            ]}
          >
            {title}
          </Text>

          <View
            onPress={() => this.setState({ lookMsg: true })}
            style={[size_tool(120, 80)]}
          ></View>
        </View>
        {exercise.exercise_times_id ? this.rendetlittle() : this.renderbig()}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0,
  },
  text: {
    fontSize: pxToDp(40),
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Muyao-Softbrush" : "Muyao-Softbrush-2",
    marginBottom: pxToDp(20),
  },
  text1: {
    fontSize: pxToDp(40),
    color: "#FFB211",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(16),
    marginRight: pxToDp(24),
  },
  text2: {
    fontSize: pxToDp(28),
    color: "#fff",
  },
  stemFont: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...appFont.fontFamily_syst,
    lineHeight: pxToDp(50),
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
