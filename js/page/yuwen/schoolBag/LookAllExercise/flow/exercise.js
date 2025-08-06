import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Platform,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../../../../util/tools";
import CircleCard from "../../../../../component/CircleCard";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import ViewControl from "react-native-image-pan-zoom";
import AnswerStatisticsModal from "../../../../../component/AnswerStatisticsModal";
import Sound from "react-native-sound";
import { Toast, Modal } from "antd-mobile-rn";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import { appStyle } from "../../../../../theme";
import Header from "../../../../../component/Header";
import Audio from "../../../../../util/audio";
import url from "../../../../../util/url";

import ReadingHelpModal from "../../../../../component/chinese/ReadingHelpModal";

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
let audio = undefined;
// let url.baseURL = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
class DoWrongExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.audioHelp = undefined;
    this.audioHelp1 = undefined;
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      topaicNum: 0,
      //题目列表，后期可能改动
      fromServeCharacterList: [],
      isEnd: false,
      topaicIndex: 0,
      topicMap: new Map(),
      status: false,
      gifUrl: "",
      indentifyContext: "",
      visible: false,
      diagnose_notes: "", // 诊断标记
      canvasData: "",
      isKeyExercise: 1,
      lookDetailNum: 0,
      answer_start_time: "",
      answer_end_time: "",
      checkedIndex: -1,
      //题目统计结果
      blank: 0,
      correct: 0,
      wrong: 0,
      answerStatisticsModalVisible: false,
      isEnd: false,
      knowledgepoint_explanation: "", //知识讲解
      isImageHelp: false,
      optionList: [],
      exerciseInfo: {},
      explanation_audio: "",
      playStatus: false,
      isStartAudio1: false,
      paused: true,
      pausedPrivate: true,
      playStatus1: false,
    };

    this.isHelpClick = false; //诊断标记点击关闭还是帮助
  }

  goBack = () => {
    this.audioPaused();
    this.audioPausedPrivate();
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    // console.log(userInfoJs, 'userInfoJs')
    axios
      .get(
        `${api.getChineseExerciseDetail}/${this.props.navigation.state.params.data.exercise_id}`
      )
      .then((res) => {
        let list = res.data.data;
        console.log("userInfoJs", list);
        this.setState({
          exerciseInfo: list,
        });
      });
  }

  checkAnswer = (index) => {
    this.setState({
      checkedIndex: index,
    });
  };

  renderWriteTopaic = () => {
    const { exerciseInfo, isStartAudio1, pausedPrivate } = this.state;
    const data = exerciseInfo;
    let baseUrl =
      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
      data.private_stem_picture;
    let arr = [];
    arr = data.exercise_content ? data.exercise_content.split("#") : [];
    // console.log("baseUrl", baseUrl)
    if (!data.exercise_id) {
      return <Text style={{ fontSize: pxToDp(32) }}>数据加载中...</Text>;
    } else {
      return (
        // 不同题型组装题目
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {data.private_stem_audio ? (
              isStartAudio1 ? (
                <TouchableOpacity
                  style={{ marginTop: pxToDp(2) }}
                  onPress={() => {
                    this.audioPausedPrivate();
                  }}
                >
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../../../images/playing_icon.png")}
                  ></Image>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginTop: pxToDp(2) }}
                  onPress={() => {
                    this.audioPlayPrivate();
                  }}
                >
                  <Image
                    style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                    source={require("../../../../../images/play_icon.png")}
                  ></Image>
                </TouchableOpacity>
              )
            ) : null}

            {data.private_stem_audio ? (
              <Audio
                uri={`${url.baseURL}${data.private_stem_audio}`}
                paused={pausedPrivate}
                pausedEvent={this.audioPausedPrivate}
                ref={this.audio1}
              />
            ) : null}
            <RichShowView
              divStyle={"font-size: x-large"}
              pStyle={"font-size: x-large"}
              spanStyle={"font-size: x-large"}
              width={pxToDp(1700)}
              value={
                data.private_exercise_stem ? data.private_exercise_stem : ""
              }
              showWeb={true}
            ></RichShowView>
          </View>

          {data.private_stem_picture ? (
            <Image
              style={{
                width: pxToDp(400),
                height: pxToDp(300),
                marginLeft: pxToDp(40),
                resizeMode: "contain",
              }}
              source={{ uri: baseUrl }}
            ></Image>
          ) : (
            <Text></Text>
          )}
          <View style={{ width: "100%" }}>
            {arr.map((item, index) => {
              if (data.content_picture === "1") {
                return (
                  <TouchableOpacity
                    onPress={() => this.checkAnswer(index)}
                    key={index}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: 20,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={
                          this.state.checkedIndex === index
                            ? styles.checkedOption
                            : styles.checkOptions
                        }
                      >
                        <Text
                          style={{
                            color:
                              this.state.checkedIndex === index
                                ? "#FFFFFF"
                                : "#666666",
                          }}
                        >
                          {zimu[index]}
                        </Text>
                      </View>

                      <Image
                        style={{
                          width: pxToDp(400),
                          height: pxToDp(100),
                          marginLeft: pxToDp(40),
                          resizeMode: "contain",
                        }}
                        source={{
                          uri:
                            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                            item,
                        }}
                      ></Image>
                    </View>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    onPress={() => this.checkAnswer(index)}
                    key={index}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        // flexWrap: "wrap",
                        marginBottom: pxToDp(40),
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <View
                        style={
                          this.state.checkedIndex === index
                            ? styles.checkedOption
                            : styles.checkOptions
                        }
                      >
                        <Text
                          style={{
                            color:
                              this.state.checkedIndex === index
                                ? "#FFFFFF"
                                : "#666666",
                            fontSize: pxToDp(35),
                          }}
                        >
                          {zimu[index]}
                        </Text>
                      </View>
                      <Text style={{ fontSize: pxToDp(35), flex: 1 }}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      );
    }
  };

  //获取canvas手写数据

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  nextTopaic = () => {
    this.audioPaused();
    this.audioPausedPrivate();
    let index = this.state.checkedIndex;
    const { exerciseInfo } = this.state;
    let optionList = exerciseInfo.exercise_content.split("#");
    let str = ""; // 讲解
    if (index === -1) {
      return;
    }

    if (optionList[index] === exerciseInfo.answer_content) {
      // 正确，当前题目为推送的要素题时不论对错都保存
      // str = "恭喜你答对啦！";
      Toast.info("恭喜你，答对了！", 1);

      this.setState({
        checkedIndex: -1,
        diagnose_notes: "",
      });
    } else {
      let arr = [...exerciseInfo.exercise_content.split("#")];
      for (let i in arr) {
        if (optionList[index] === arr[i]) {
          str = exerciseInfo.diagnose_notes.split("#")[i];
          console.log("诊断标记", str);
        }
      }
      this.setState({
        visible: true,
        diagnose_notes: str,
        checkedIndex: -1,
        knowledgepoint_explanation:
          exerciseInfo && exerciseInfo.knowledgepoint_explanation != ""
            ? exerciseInfo.knowledgepoint_explanation
            : " ",
        explanation_audio:
          exerciseInfo && exerciseInfo.explanation_audio
            ? exerciseInfo.explanation_audio
            : "",
      });
    }
  };

  helpMe = (isHelp) => {
    // 点击查看帮助
    let { exerciseInfo } = this.state;
    this.audioPaused();
    this.audioPausedPrivate();
    this.setState({
      knowledgepoint_explanation:
        exerciseInfo && exerciseInfo.knowledgepoint_explanation != ""
          ? exerciseInfo.knowledgepoint_explanation
          : " ",
      visible: true,
      explanation_audio:
        exerciseInfo && exerciseInfo.explanation_audio
          ? exerciseInfo.explanation_audio
          : "",
      diagnose_notes: "",
    });
  };
  onCloseHelp = () => {
    this.setState({
      status: false,
    });
    this.audioPausedHelp();
  };

  renderButton = () => {
    const { isEnd } = this.state;

    return (
      <TouchableOpacity
        style={styles.topaicBtn}
        ref="topaicBox"
        onPress={this.nextTopaic}
      >
        <View
          style={{
            width: pxToDp(192),
            height: pxToDp(64),
            borderRadius: pxToDp(48),
            backgroundColor: "#A86A33",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: pxToDp(32) }}>完成</Text>
        </View>
      </TouchableOpacity>
    );
  };

  audioPaused = () => {
    this.setState({
      paused: true,
      playStatus: false,
    });
  };

  audioPlay = () => {
    this.audioPausedPrivate();
    this.setState({
      paused: false,
      playStatus: true,
    });
  };
  audioPausedPrivate = () => {
    this.setState({
      pausedPrivate: true,
      isStartAudio1: false,
    });
  };

  audioPlayPrivate = () => {
    this.audioPaused();
    this.setState({
      pausedPrivate: false,
      isStartAudio1: true,
    });
  };

  render() {
    const { exerciseInfo, explanation_audio } = this.state;
    // console.log(fromServeCharacterList, 'topaicNum')

    return (
      <View style={styles.mainWrap}>
        <Header
          goBack={() => {
            this.goBack();
          }}
          text={this.props.navigation.state.params.data.learning_point}
        ></Header>
        <View style={styles.container}>
          <View style={styles.topaic} ref="topaicBox">
            <View style={styles.topaicText}>
              <View style={{ flex: 1 }}>
                <ScrollView>
                  {exerciseInfo && exerciseInfo.public_exercise_stem ? (
                    <RichShowView
                      divStyle={"font-size: x-large"}
                      pStyle={"font-size: x-large"}
                      spanStyle={"font-size: x-large"}
                      width={pxToDp(1700)}
                      value={exerciseInfo.public_exercise_stem}
                    ></RichShowView>
                  ) : null}
                  {exerciseInfo.public_stem_audio ? (
                    this.state.playStatus1 ? (
                      <TouchableOpacity
                        style={{ marginTop: pxToDp(2) }}
                        onPress={() => {
                          this.audioPaused();
                        }}
                      >
                        <Image
                          style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                          source={require("../../../../../images/playing_icon.png")}
                        ></Image>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{ marginTop: pxToDp(2) }}
                        onPress={() => {
                          this.audioPlay();
                        }}
                      >
                        <Image
                          style={[size_tool(52), { marginLeft: pxToDp(24) }]}
                          source={require("../../../../../images/play_icon.png")}
                        ></Image>
                      </TouchableOpacity>
                    )
                  ) : null}
                  {exerciseInfo.public_stem_audio ? (
                    <Audio
                      uri={`${url.baseURL}${data.public_stem_audio}`}
                      paused={paused}
                      pausedEvent={this.audioPaused}
                      ref={this.audio}
                    />
                  ) : null}
                  {exerciseInfo && exerciseInfo.public_stem_picture ? (
                    <Image
                      style={{
                        width: pxToDp(400),
                        height: pxToDp(300),
                        marginLeft: pxToDp(20),
                        resizeMode: "contain",
                      }}
                      source={{
                        uri: url.baseURL + exerciseInfo.public_stem_picture,
                      }}
                    ></Image>
                  ) : null}
                  {this.renderWriteTopaic()}
                </ScrollView>
              </View>

              <TouchableOpacity onPress={this.helpMe}>
                <Image
                  source={require("../../../../../images/help.png")}
                  style={[appStyle.helpBtn]}
                ></Image>
              </TouchableOpacity>
            </View>
            {this.renderButton()}
          </View>
        </View>

        <ReadingHelpModal
          status={this.state.visible}
          goback={this.onClose.bind(this, 1)}
          audio={explanation_audio}
          knowledgepoint_explanation={this.state.knowledgepoint_explanation}
          diagnose_notes={this.state.diagnose_notes}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor:
      "linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)",
    height: "100%",
    width: "100%",
    padding: pxToDp(32),
    paddingTop: Platform.OS === "ios" ? pxToDp(64) : pxToDp(32),
    // paddingBottom: 24,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  topaic: {
    backgroundColor: "#fff",
    flex: 1,
    // height: pxToDp(890),
    borderRadius: pxToDp(30),
    paddingBottom: pxToDp(40),
  },
  topaicBtn: {
    backgroundColor: "#fff",
    paddingRight: pxToDp(40),
    alignItems: "flex-end",
  },
  topaicText: {
    // width: 900,
    // height: pxToDp(800),
    flex: 1,
    padding: pxToDp(24),
    flexDirection: "row",
    // justifyContent: 'space-between'
  },

  topaicWrite: {
    position: "absolute",
  },
  buttonGroup: {
    flexDirection: "row",
    // flex: 1
  },
  checkOptions: {
    width: pxToDp(52),
    height: pxToDp(52),
    borderRadius: pxToDp(26),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: pxToDp(2),
    borderColor: "#AAAAAA",
    marginRight: pxToDp(24),
  },
  checkedOption: {
    width: pxToDp(52),
    height: pxToDp(52),
    backgroundColor: "#FA603B",
    borderRadius: pxToDp(26),
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(24),
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

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
