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
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import AnswerStatisticsModal from "../../AnswerStatisticsModal";
import { appStyle, appFont } from "../../../theme";
// import ReadingHelpModal from '.././ReadingHelpModal'
import fonts from "../../../theme/fonts";
import RichShowView from "../newRichShowView";
import Audio from "../../../util/audio/audio";
import url from "../../../util/url";
import ReadingHelpModal from "../reading/ReadingHelpModal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import PlayAudio from "../../../util/audio/playAudio";

class DoWrongExercise extends PureComponent {
  constructor(props) {
    super(props);
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
      correct: 0,
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
      answerObj: {},
      answer_content: [],
      answer_times: 0,
      isWrong: props.isWrong,
      // renderOptionList: true
    };

    this.isHelpClick = false; //诊断标记点击关闭还是帮助
  }

  static navigationOptions = {
    // title:'答题'
  };
  renderOptionList = true;

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  closeAnswerStatisticsModal = () => {
    // console.log('MathCanvas closeDialog')
    this.setState({ answerStatisticsModalVisible: false });
    NavigationUtil.goBack(this.props);
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

  checkAnswer = (item) => {
    const { answerObj } = this.state;
    let answerObjnow = { ...answerObj };
    answerObjnow[item] = !answerObj[item];
    this.setState({
      answerObj: answerObjnow,
    });
  };

  renderWriteTopaic = () => {
    const { exerciseInfo, optionList, playStatus, isStartAudio1, answerObj } =
      this.state;
    const data = exerciseInfo;
    let baseUrl = url.baseURL + +data.private_stem_picture;
    let arr = [];
    if (this.renderOptionList && data.exercise_content) {
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
      });
      this.renderOptionList = false;
    } else {
      arr = [...optionList];
    }

    if (!data.exercise_id) {
      return (
        <Text style={[{ fontSize: pxToDp(32) }, appFont.fontFamily_syst]}>
          数据加载中...
        </Text>
      );
    } else {
      return (
        // 不同题型组装题目
        <View>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: 'pink'
            }}
          >
            <View
              style={[
                size_tool(88, 48),
                borderRadius_tool(80),
                { backgroundColor: "#16C792", marginTop: pxToDp(20) },
                appStyle.flexCenter,
              ]}
            >
              <Text style={[{ fontSize: pxToDp(24), color: "#fff" }]}>
                多选
              </Text>
            </View>

            <RichShowView
              width={
                this.props.width
                  ? this.props.width
                  : data.public_exercise_stem
                  ? pxToDp(1000)
                  : pxToDp(1700)
              }
              value={
                data.private_exercise_stem ? data.private_exercise_stem : ""
              }
              size={6}
            ></RichShowView>
          </View>
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
            // <ViewControl
            //     cropWidth={400}
            //     cropHeight={300}
            //     imageWidth={400}
            //     imageHeight={300}
            // >
            <Image
              style={{
                width: pxToDp(600),
                height: pxToDp(450),
                marginLeft: pxToDp(20),
                resizeMode: "contain",
              }}
              source={{ uri: baseUrl }}
            ></Image>
          ) : // </ViewControl>
          null}
          <View
            style={[
              appStyle.flexLine,
              appStyle.flexJusBetween,
              appStyle.flexLineWrap,
              { flex: 1 },
            ]}
          >
            {arr.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => this.checkAnswer(item)}
                  key={index}
                  style={[
                    {
                      minWidth: pxToDp(800),
                      minHeight: pxToDp(140),
                      backgroundColor: answerObj[item] ? "#F07C39" : "#E7E7F2",
                      marginBottom: pxToDp(40),
                      paddingBottom: pxToDp(4),
                      borderRadius: pxToDp(40),
                    },
                  ]}
                >
                  <View
                    style={[
                      appStyle.flexCenter,
                      appStyle.flexTopLine,
                      {
                        felx: 1,
                        minHeight: pxToDp(136),
                        backgroundColor: answerObj[item]
                          ? "#FF964A"
                          : "#F5F5FA",
                        borderRadius: pxToDp(40),
                        padding: pxToDp(20),
                      },
                    ]}
                  >
                    <View
                      style={[
                        size_tool(40),
                        borderRadius_tool(40),
                        appStyle.flexCenter,
                        {
                          borderWidth: pxToDp(4),
                          borderColor: answerObj[item] ? "#FF964A" : "#DDDDE1",
                        },
                        answerObj[item] ? { backgroundColor: "#fff" } : {},
                      ]}
                    >
                      {answerObj[item] ? (
                        <FontAwesome
                          name={"check"}
                          size={16}
                          style={{ color: "#FF964A" }}
                        />
                      ) : null}
                    </View>
                    <View style={[appStyle.flexCenter, { flex: 1 }]}>
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
                              color: answerObj[item] ? "#fff" : "#475266",
                            },
                            appFont.fontFamily_syst,
                          ]}
                        >
                          {item}
                        </Text>
                      )}
                    </View>
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
    this.setState(
      {
        visible: false,
        isKeyExercise: isWrong ? false : isKeyExercisenow,
        answerObj: {},
        answer_start_time: new Date().getTime(),
      },
      () => {}
    );
  };
  nextTopaic = () => {
    // this.refs.canvas._nextTopaic();

    const { token } = this.props;
    if (!token && this.props.resetToLogin) {
      this.props.resetToLogin();
      return;
    }

    const {
      exerciseInfo,
      answerObj,
      answer_start_time,
      correct,
      answer_times,
      answer_content,
      isKeyExercise,
    } = this.state;
    let str = ""; // 讲解
    let correctnow = 0; //错误0 良好1  正确2
    let answer_contentnow = [];
    let answerobjNow = {};
    exerciseInfo.answer_content.split("#").forEach((item) => {
      answerobjNow[item] = "1";
    });
    console.log("答案", answerObj, answerobjNow);
    let isRight = true,
      answerlength = 0;
    for (let i in answerObj) {
      answerObj[i] ? answerlength++ : "";
      if (answerObj[i] && !answerobjNow[i]) {
        isRight = false;
      }
      if (answerObj[i]) {
        answer_contentnow.push(i);
      }
    }
    if (Object.keys(answerobjNow).length !== answerlength) {
      isRight = false;
    }
    let endTime = new Date().getTime();
    let answer_timesnow = parseInt((endTime - answer_start_time) / 1000);
    if (isRight) {
      // 正确，当前题目为推送的要素题时不论对错都保存
      // str = "恭喜你答对啦！";
      isKeyExercise ? "" : PlayAudio.playSuccessSound(url.successAudiopath2);
      correctnow = 2;
      // Toast.info('恭喜你，答对了！', 1)
      this.props.nextExercise({
        ...exerciseInfo,
        correct: isKeyExercise ? correct : correctnow,
        answer_times: answer_timesnow,
        answer_content: answer_contentnow,
      });
      this.setState({
        renderOptionList: true,
        checkedIndex: -1,
        answerObj: {},
      });
    } else {
      PlayAudio.playSuccessSound(url.failAudiopath);
      str = "这是多选题目哦！你是否漏选或错选了内容，再想一想！";
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

  helpMe = (isHelp) => {
    // 点击查看帮助
    let { exerciseInfo } = this.state;
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
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (
      JSON.stringify(props.enxercise) !== JSON.stringify(tempState.exerciseInfo)
    ) {
      tempState.exerciseInfo = props.exercise;
      tempState.renderOptionList = true;
    }

    return tempState;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.exerciseInfo.exercise_id !== this.state.exerciseInfo.exercise_id
    ) {
      this.renderOptionList = true;
      this.setState({
        renderOptionList: false,
        answerObj: {},
      });
    }
  }
  renderButton = () => {
    return (
      <TouchableOpacity
        style={styles.topaicBtn}
        ref="topaicBox"
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
    const footerButtons = [
      { text: "关闭", onPress: () => this.onClose(1) },
      { text: "帮助", onPress: this.helpMe },
    ];
    return (
      <View style={styles.mainWrap}>
        <View style={[styles.container, appStyle.flexTopLine]}>
          {exerciseInfo.public_exercise_stem ? (
            <View style={[padding_tool(0, 40, 40, 40)]}>
              <ScrollView>
                <RichShowView
                  width={pxToDp(800)}
                  value={
                    exerciseInfo.public_exercise_stem
                      ? exerciseInfo.public_exercise_stem
                      : ""
                  }
                  size={6}
                ></RichShowView>
              </ScrollView>
            </View>
          ) : null}
          <View style={styles.topaic} ref="topaicBox">
            <View style={styles.topaicText}>
              <View style={{ flex: 1 }}>
                <ScrollView>{this.renderWriteTopaic()}</ScrollView>
              </View>
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
    height: "100%",
    width: "100%",

    // paddingBottom: 24,
  },
  container: {
    flex: 1,
    // flexDirection: "row",
  },
  topaic: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(30),
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
    flex: 1,
    padding: pxToDp(20),
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
