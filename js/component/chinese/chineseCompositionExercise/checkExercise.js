import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  fontFamilyRestoreMargin,
  padding_tool,
  pxToDp,
  size_tool,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import AnswerStatisticsModal from "../../../component/AnswerStatisticsModal";
import Sound from "react-native-sound";
import { Toast, Modal } from "antd-mobile-rn";
import RichShowView from "../../../component/chinese/newRichShowView";
import { appStyle, appFont } from "../../../theme";
import Audio from "../../../util/audio/audio";
import url from "../../../util/url";
import fonts from "../../../theme/fonts";
import ReadingHelpModal from "../reading/ReadingHelpModal";
import PlayAudio from "../../../util/audio/playAudio";

let audio = undefined;
// let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
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
      isKeyExercise: false,
      lookDetailNum: 0,
      answer_start_time: new Date().getTime(),
      answer_end_time: "",
      checkedIndex: -1,
      //题目统计结果
      blank: 0,
      wrong: 0,
      answerStatisticsModalVisible: false,
      knowledgepoint_explanation: "", //知识讲解
      isImageHelp: false,
      optionList: [],
      exerciseInfo: props.exercise,
      explanation_audio: "",
      isStartAudio: false,
      playStatus: false,
      isStartAudio1: false,
      answer_content: "",
      correct: 0, //答案
      answer_times: 0,
      renderOptionList: true,
      isWrong: props.isWrong,
    };

    this.isHelpClick = false; //诊断标记点击关闭还是帮助
  }

  static navigationOptions = {
    // title:'答题'
  };
  renderOptionList = true;

  goBack = () => {
    this.closeAudio();
    NavigationUtil.goBack(this.props);
  };

  closeAnswerStatisticsModal = () => {
    // console.log('MathCanvas closeDialog')
    this.setState({ answerStatisticsModalVisible: false });
    NavigationUtil.goBack(this.props);
  };

  //关闭语音播放
  closeAudio = () => {
    if (audio) {
      //console.log("关闭语音");
      audio.stop();
      audio = undefined;
      this.setState(() => ({
        playStatus: false,
      }));
    }
  };

  componentDidMount() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    // console.log(userInfoJs, 'userInfoJs')
    console.log("参数", this.props);
    this.setState({
      exerciseInfo: this.props.exercise,
    });
  }

  topaicContainerOnLayout = (e) => {
    let { width, height } = e.nativeEvent.layout;
    this.setState(() => ({
      canvasWidth: width,
      canvasHeight: height,
    }));
  };

  //获取看拼音写汉字题型的拼音
  getPyDataFromServe = () => {
    const stateList = [...this.state.fromServeCharacterList];
    const selectMap = new Map();
    for (let i = 0; i < stateList.length; i++) {
      selectMap.set(i, { ...stateList[i] });
    }
    return selectMap;
  };

  checkAnswer = (index) => {
    this.setState({
      checkedIndex: index,
    });
  };

  renderWriteTopaic = () => {
    const map = this.getPyDataFromServe();
    const {
      exerciseInfo,
      optionList,
      playStatus,
      isStartAudio1,
      renderOptionList,
    } = this.state;
    const data = exerciseInfo;
    let baseUrl = url.baseURL + data.private_stem_picture;
    let arr = [];
    console.log(
      "状态",
      this.renderOptionList,
      data.exercise_content,
      this.props.exercise.exercise_content
    );
    if (data.exercise_content) {
      if (this.renderOptionList) {
        arr = data.exercise_content ? data.exercise_content.split("#") : [];
        let randomNumber = function () {
          // randomNumber(a,b) 返回的值大于 0 ，则 b 在 a 的前边；
          // randomNumber(a,b) 返回的值等于 0 ，则a 、b 位置保持不变；
          // randomNumber(a,b) 返回的值小于 0 ，则 a 在 b 的前边。
          return 0.5 - Math.random();
        };
        arr.sort(randomNumber);
        this.setState({
          optionList: [...arr],
          // renderOptionList: false,
        });
        this.renderOptionList = false;
      } else {
        arr = [...optionList];
      }
    }
    // console.log("baseUrl", baseUrl)
    if (!data.exercise_id) {
      return <Text style={{ fontSize: pxToDp(32) }}>数据加载中...</Text>;
    } else {
      return (
        // 不同题型组装题目
        <View style={[{ flex: 1 }, padding_tool(0, 40, 40, 40)]}>
          <RichShowView
            width={
              this.props.width
                ? this.props.width
                : data.public_exercise_stem
                ? pxToDp(920)
                : pxToDp(1700)
            }
            value={data.private_exercise_stem ? data.private_exercise_stem : ""}
            size={6}
          ></RichShowView>
          {data.private_stem_audio ? (
            <Audio
              audioUri={`${url.baseURL}${data.private_stem_audio}`}
              pausedBtnImg={require("../../../images/chineseHomepage/composition/audioPlay.png")}
              pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
              playBtnImg={require("../../../images/chineseHomepage/composition/audiostop.png")}
              playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
            />
          ) : null}
          {data.private_stem_picture ? (
            <Image
              style={{
                width: pxToDp(600),
                height: pxToDp(450),
                marginLeft: pxToDp(40),
                resizeMode: "contain",
              }}
              source={{ uri: baseUrl }}
            ></Image>
          ) : null}

          <View
            style={{
              paddingTop: pxToDp(20),
              width: "100%",
              paddingRight: pxToDp(200),
            }}
          >
            {arr.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => this.checkAnswer(index)}
                  key={index}
                  style={[
                    {
                      // minWidth: pxToDp(500),
                      minHeight: pxToDp(140),
                      backgroundColor:
                        this.state.checkedIndex === index
                          ? "#F07C39"
                          : "#E7E7F2",
                      marginBottom: pxToDp(40),
                      paddingBottom: pxToDp(4),
                      borderRadius: pxToDp(40),
                    },
                  ]}
                >
                  <View
                    style={[
                      appStyle.flexCenter,
                      {
                        felx: 1,
                        minHeight: pxToDp(136),
                        backgroundColor:
                          this.state.checkedIndex === index
                            ? "#FF964A"
                            : "#F5F5FA",
                        borderRadius: pxToDp(40),
                        padding: pxToDp(20),
                      },
                    ]}
                  >
                    {data?.content_picture === "1" ? (
                      <Image
                        style={{
                          width: pxToDp(400),
                          height: pxToDp(200),
                          resizeMode: "contain",
                          borderRadius: pxToDp(40),
                        }}
                        source={{
                          uri:
                            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
                            item,
                        }}
                      />
                    ) : (
                      <Text
                        style={[
                          {
                            fontSize: pxToDp(40),
                            lineHeight: pxToDp(50),
                            color:
                              this.state.checkedIndex === index
                                ? "#fff"
                                : "#475266",
                          },
                          appFont.fontFamily_syst,
                        ]}
                      >
                        {item}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );
    }
  };

  //获取canvas手写数据

  onClose = () => {
    const {
      exerciseInfo,
      correct,
      answer_times,
      answer_content,
      isKeyExercise,
      isWrong,
    } = this.state;
    let isKeyExercisenow = isKeyExercise;
    if (isKeyExercise || correct === 2) {
      this.props.nextExercise({
        ...exerciseInfo,
        answer_times,
        correct,
        answer_content,
      });
      isKeyExercisenow = false;
    } else {
      isKeyExercisenow = true;
    }
    this.renderOptionList = true;
    this.setState({
      visible: false,
      isKeyExercise: isWrong ? false : isKeyExercisenow,
      answer_start_time: new Date().getTime(),
    });
  };
  nextTopaic = () => {
    // this.refs.canvas._nextTopaic();

    const { token } = this.props;
    if (!token && this.props.resetToLogin) {
      this.props.resetToLogin();
      return;
    }

    this.closeAudio();
    let index = this.state.checkedIndex;
    const {
      exerciseInfo,
      optionList,
      answer_start_time,
      correct,
      answer_times,
      answer_content,
      isKeyExercise,
    } = this.state;
    let str = ""; // 讲解
    let correctnow = 0; //错误0 良好1  正确2
    let answer_contentnow = optionList[index];
    if (index === -1) {
      return;
    }
    let endTime = new Date().getTime();
    let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);

    if (optionList[index] === exerciseInfo.answer_content) {
      // 正确，当前题目为推送的要素题时不论对错都保存
      // str = "恭喜你答对啦！";
      // this.props.nextExercise()
      correctnow = 2;
      // Toast.info('恭喜你，答对了！', 1)
      isKeyExercise ? "" : PlayAudio.playSuccessSound(url.successAudiopath2);
      this.props.nextExercise({
        ...exerciseInfo,
        correct: isKeyExercise ? correct : correctnow,
        answer_times: isKeyExercise ? answer_times : answer_timesnow,
        answer_content: isKeyExercise ? answer_content : answer_contentnow,
      });
      this.setState({
        renderOptionList: true,
        checkedIndex: -1,
      });
    } else {
      PlayAudio.playSuccessSound(url.failAudiopath);
      let arr = [...exerciseInfo.exercise_content.split("#")];
      for (let i in arr) {
        if (optionList[index] === arr[i]) {
          str = exerciseInfo.diagnose_notes.split("#")[i];
        }
      }
      correctnow = 0;
      this.setState({
        visible: true,
        diagnose_notes: str,
        renderOptionList: true,
        checkedIndex: -1,
        correct: isKeyExercise ? correct : correctnow,
        answer_times: isKeyExercise ? answer_times : answer_timesnow,
        answer_content: isKeyExercise ? answer_content : answer_contentnow,
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

    this.renderOptionList = true;
  };
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (
      JSON.stringify(props.exercise) !== JSON.stringify(tempState.exerciseInfo)
    ) {
      tempState.exerciseInfo = props.exercise;
      tempState.renderOptionList = true;
      return tempState;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.exerciseInfo.exercise_id !== this.state.exerciseInfo.exercise_id
    ) {
      this.renderOptionList = true;
      this.setState({
        renderOptionList: false,
      });
    }
  }
  helpMe = (isHelp) => {
    // 点击查看帮助
    let { exerciseInfo } = this.state;
    this.closeAudio();
    this.setState({
      knowledgepoint_explanation:
        exerciseInfo && exerciseInfo.knowledgepoint_explanation != ""
          ? exerciseInfo.knowledgepoint_explanation
          : " ",
      status: true,
      explanation_audio:
        exerciseInfo && exerciseInfo.explanation_audio
          ? exerciseInfo.explanation_audio
          : "",
    });
  };
  onCloseHelp = () => {
    this.setState({
      status: false,
    });
  };

  renderButton = () => {
    return (
      <TouchableOpacity
        style={styles.topaicBtn}
        ref="topaicBox"
        onLayout={(event) => this.topaicContainerOnLayout(event)}
        onPress={this.nextTopaic}
      >
        <View
          style={{
            flex: 1,
            borderRadius: pxToDp(200),
            backgroundColor: "#FFCC4A",
            ...appStyle.flexCenter,
          }}
        >
          <Text
            style={[
              { color: "#323E5C", fontSize: pxToDp(40) },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            提交
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { exerciseInfo, explanation_audio, isKeyExercise } = this.state;
    // console.log(fromServeCharacterList, 'topaicNum')

    return (
      <View style={styles.mainWrap}>
        <View style={[styles.container, appStyle.flexTopLine]}>
          {exerciseInfo.public_exercise_stem ? (
            <View
              style={[
                {
                  marginBottom: pxToDp(20),
                  paddingLeft: pxToDp(40),
                  width: pxToDp(900),
                  marginRight: pxToDp(40),
                },
              ]}
            >
              <ScrollView>
                <RichShowView
                  width={pxToDp(800)}
                  value={
                    exerciseInfo.public_exercise_stem
                      ? exerciseInfo.public_exercise_stem
                      : ""
                  }
                  size={2}
                ></RichShowView>
              </ScrollView>
            </View>
          ) : null}
          <View style={styles.topaic}>
            <View style={styles.topaicText}>
              <View style={{ flex: 1 }}>
                <ScrollView style={[{ width: "100%", height: "100%" }]}>
                  {this.renderWriteTopaic()}
                </ScrollView>
              </View>
            </View>
          </View>
          {this.renderButton()}
        </View>

        <ReadingHelpModal
          status={this.state.visible}
          goback={this.onClose.bind(this, 1)}
          audio={explanation_audio}
          knowledgepoint_explanation={this.state.knowledgepoint_explanation}
          diagnose_notes={this.state.diagnose_notes}
          btnTxt={isKeyExercise ? "关闭" : "再来一次"}
        />

        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    width: "100%",
    flex: 1,
    borderRadius: pxToDp(80),
    // paddingBottom: 24,
  },
  container: {
    flex: 1,
    // paddingTop: pxToDp(40),
    paddingRight: pxToDp(20),
  },
  topaic: {
    flex: 1,
    paddingRight: pxToDp(6),
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    padding: pxToDp(40),
    // justifyContent: 'space-between'
  },
  topaicBtn: {
    ...size_tool(200),
    borderRadius: pxToDp(200),
    backgroundColor: "#FFAC2F",
    position: "absolute",
    bottom: pxToDp(40),
    right: pxToDp(40),
    paddingBottom: pxToDp(8),
  },
  topaicText: {
    // width: 900,
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
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
