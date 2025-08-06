import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { Modal, Toast } from "antd-mobile-rn";
import { appStyle, appFont } from "../../../theme";
import {
  borderRadius_tool,
  margin_tool,
  padding_tool,
  pxToDp,
  size_tool,
} from "../../../util/tools";
import HeaderCircleCard from "../../../component/HeaderCircleCard";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import AnswerStatisticsModal from "../../../component/AnswerStatisticsModal";
import { connect } from "react-redux";
import api from "../../../util/http/api";
import RichShowView from "../../../component/chinese/RichShowView";
import url from "../../../util/url";
import Sound from "react-native-sound";
import SentenceHelpModal from "../../../component/chinese/SentenceHelpModal";
import MsgModal from "../../../component/chinese/sentence/msgModal";
import HelpModal from "../../../component/chinese/sentence/helpModal";
import PlayAudio from "../../../util/audio/playAudio";

const ranking_map = {
  0: "太棒了，答对了哦！",
  1: "一般，还有更好的组合,继续努力！",
  2: "答错了，继续努力！",
};
const ranking_color_map = {
  0: "#7FD23F",
  1: "#FCAC14",
  2: "red",
};
class SpeSentenceExerciseTwo extends PureComponent {
  constructor(props) {
    super(props);
    this.info = this.props.userInfo.toJS();
    this.grade_term = " this.info.checkGrade + this.info.checkTeam";
    this.name = " props.navigation.state.params.data.inspect";
    this.inspect_name = "props.navigation.state.params.data.inspect_name";
    this.myScrollView = undefined;
    this.heightArr = [];
    this.audioHelp = undefined;
    this.state = {
      exercise: {},
      checkWordList: [],
      sentenceStem: [],
      choiceIndex: 0,
      sentenceIndex: 0,
      choiceList: [],
      lookMsg: false,
      isKeyExercise: false,
      topicStart_time: new Date().getTime(),
      answer_times: "",
      correct: "0",
      helpVisible: false,
      diagnose: "",
      answer_content: [],
      finalCorrect: 0,
    };
  }

  componentDidMount() {
    // const { userInfo } = this.props;
    // const userInfoJs = userInfo.toJS();
    // let currentTopic = this.changeCurrentTopic(this.props.exercise)
    // console.log('数据', currentTopic)
    // this.setState({
    //   topicList: [this.props.exercise],
    //   currentTopic,
    //   tip: "",
    //   exercise: this.props.exercise
    // }, () => {
    //   let item = currentTopic.sentence_stem[0]
    //   this.clickSelect(item, 0)
    // })
    this.initExercise(this.props.exercise);
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (props.exercise.exercise_id !== tempState.exercise.exercise_id) {
      tempState.exercise = props.exercise;
      tempState.topicStart_time = new Date().getTime();
      tempState.isKeyExercise = false;
      return tempState;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.exercise.exercise_id !== this.state.exercise.exercise_id) {
      // let currentTopic = this.changeCurrentTopic(this.props.exercise)
      // console.log('数据', currentTopic)
      // this.setState({
      //   topicList: [this.props.exercise],
      //   currentTopic,
      //   tip: "",
      // }, () => {
      //   let item = currentTopic.sentence_stem[0]
      //   this.clickSelect(item, 0)
      // })
      this.initExercise(this.state.exercise);
    }
  }
  lookRightOrWrong = () => {
    const { token } = this.props;
    if (!token && this.props.resetToLogin) {
      this.props.resetToLogin();
      return;
    }

    const {
      correct,
      sentenceStem,
      isKeyExercise,
      topicStart_time,
      answer_content,
    } = this.state;
    let sentnce = "",
      blankIndex = -1,
      isRight = true;
    sentenceStem.forEach((item, index) => {
      if (item.old !== item.value) {
        isRight = false;
      }
      item.value
        ? (sentnce += item.value)
        : (blankIndex = blankIndex === -1 ? index : blankIndex);
    });
    let ranking = 0,
      diagnose = "";
    if (blankIndex === -1) {
      // 2 正确 1 良好  0 错误
      ranking = isRight ? 2 : 0;
      diagnose = isRight ? "" : "";
      // console.log('选完了,', ranking, diagnose)
      // if (ranking === '0') {
      // 答对
      let endTime = new Date().getTime();
      let answer_times = parseInt((endTime - topicStart_time) / 1000);
      let answer_contentnow = sentenceStem.map((item) => item.value).join("");

      PlayAudio.playSuccessSound(
        isRight ? url.successAudiopath2 : url.failAudiopath
      );

      this.setState({
        answer_times,
        correct: ranking,
        diagnose,
        helpVisible: true,
        answer_content: isKeyExercise ? answer_content : answer_contentnow,
        finalCorrect: isKeyExercise ? correct : ranking,
      });

      // }
    } else {
      // console.log('没选完')
      this.clickSentence(sentenceStem[blankIndex], blankIndex);
      this.setState({ lookMsg: true });
    }
  };
  closeHelp = () => {
    const {
      correct,
      answer_times,
      exercise,
      isKeyExercise,
      finalCorrect,
      answer_content,
    } = this.state;
    let isKeyExercisenow = isKeyExercise;
    if (isKeyExercise || correct === 2) {
      console.log("数据", correct);

      this.props.nextExercise({
        exercise_id: exercise.exercise_id,
        correct: finalCorrect,
        answer_times,
        exercise_type: exercise.exercise_type,
        ability: exercise.ability,
        element_id: exercise.element_id,
        answer_content,
      });
      isKeyExercisenow = false;
    } else {
      isKeyExercisenow = true;
    }
    this.setState({
      isKeyExercise: isKeyExercisenow,
      helpVisible: false,
    });
    this.initExercise(exercise);
  };
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
      let j = this.getRandomInt(0, i);
      let t = _arr[i];
      _arr[i] = _arr[j];
      _arr[j] = t;
    }
    // 去重
    let list = new Set(_arr);
    return [...list];
  };
  initExercise = (exercise) => {
    let choiceList = [],
      sentenceStem = [];
    let best_answer = "";
    sentenceStem = exercise.exercise_content.map((item) => {
      best_answer += item;
      return { old: item, value: "", word_type: "p" };
    });
    choiceList = this.shuffle(exercise.exercise_content.map((item) => item));
    this.setState(
      {
        sentenceStem,
        sentenceIndex: 0,
        choiceList: choiceList,
        exercise: {
          ...exercise,
          best_answer: [best_answer],
          standard_explain: exercise.explanation,
        },
      },
      () => {
        console.log("毁掉", this.state.exercise);
      }
    );
  };

  checkThis = (value) => {
    const {
      sentenceStem,
      sentenceIndex,
      choiceIndex,
      checkWordList,
      choiceList,
    } = this.state;
    let listnow = JSON.parse(JSON.stringify(sentenceStem));

    listnow[sentenceIndex].value = value;
    let index = sentenceIndex;
    if (sentenceIndex + 1 < listnow.length) {
      // console.log('选项', listnow, sentenceIndex)
      index += 1;

      // index = checkWordList[choiceIndexnow].position
      // choicelistnow = checkWordList[choiceIndexnow].word
    }
    this.setState({
      sentenceStem: listnow,
      sentenceIndex: index,
    });
  };
  clickSentence = (item, position) => {
    const { checkWordList } = this.state;

    let index = position;

    // console.log(item, checkWordList[index], index)
    this.setState({
      sentenceIndex: position,
    });
  };
  renderSentence = () => {
    const { sentenceStem, sentenceIndex } = this.state;

    return sentenceStem.map((item, index) => {
      return (
        <TouchableOpacity
          onPress={this.clickSentence.bind(this, item, index)}
          key={index}
        >
          <View
            style={[
              padding_tool(10, 40, 0, 40),
              margin_tool(0, 10, 0, 10),
              {
                borderBottomColor:
                  sentenceIndex === index ? "#FF964A" : "#475266",
                borderBottomWidth: pxToDp(4),
                minHeight: pxToDp(90),
                alignItems: "flex-end",
              },
            ]}
          >
            {item.value ? (
              <Text
                style={[
                  styles.sentenceTxt,
                  {
                    color: sentenceIndex === index ? "#FF964A" : "#475266",
                    // backgroundColor: 'pink'
                  },
                ]}
              >
                {item.value}
              </Text>
            ) : (
              <Image
                style={[size_tool(52)]}
                source={
                  sentenceIndex === index
                    ? require("../../../images/chineseHomepage/sentence/penOrange.png")
                    : require("../../../images/chineseHomepage/sentence/pen.png")
                }
              />
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };
  renderChoice = () => {
    const { choiceList, sentenceIndex, sentenceStem } = this.state;
    let choice = choiceList.map((item, index) => {
      let i = sentenceIndex;
      let value = sentenceStem[i].value;
      return (
        <TouchableOpacity
          onPress={this.checkThis.bind(this, item)}
          key={index}
          style={[
            borderRadius_tool(40),
            {
              paddingBottom: pxToDp(8),
              backgroundColor: value === item ? "#F07C39" : "#E7E7F2",
              marginRight: pxToDp(20),
              marginBottom: pxToDp(20),
            },
          ]}
        >
          <View
            style={[
              padding_tool(30, 60, 30, 60),
              borderRadius_tool(40),
              appStyle.flexCenter,
              {
                backgroundColor: value === item ? "#FF964A" : "#F5F5FA",
              },
            ]}
          >
            <Text
              style={[
                {
                  fontSize: pxToDp(48),
                  lineHeight: pxToDp(60),
                  color: item === value ? "#fff" : "#475266",
                },
                appFont.fontFamily_syst,
              ]}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return choice;
  };

  render() {
    const {
      exercise,
      lookMsg,
      correct,
      isKeyExercise,
      helpVisible,
      diagnose,
      sentenceStem,
    } = this.state;
    console.log("exercise", exercise, sentenceStem);

    return (
      <View style={[styles.mainWrap]}>
        <ScrollView>
          <View style={[{ paddingBottom: pxToDp(200) }]}>
            <Text style={[styles.titleTxt]}>
              {exercise.stem ? "" + exercise.stem : ""}
            </Text>

            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexLineWrap,
                appStyle.flexAliEnd,
                { marginBottom: pxToDp(80) },
              ]}
            >
              {this.renderSentence()}
            </View>
            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
              {this.renderChoice()}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={this.lookRightOrWrong}
          style={[
            size_tool(240),
            borderRadius_tool(240),
            {
              paddingBottom: pxToDp(8),
              backgroundColor: "#FFAC2F",
              position: "absolute",
              bottom: pxToDp(32),
              right: pxToDp(32),
            },
          ]}
        >
          <View
            style={[
              { flex: 1, backgroundColor: "#FFCC4A" },
              borderRadius_tool(240),
              appStyle.flexCenter,
            ]}
          >
            <Text
              style={[
                { fontSize: pxToDp(48), color: "#323E5C" },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              {this.props.isWrong ? "提交" : "下一题"}
            </Text>
          </View>
        </TouchableOpacity>

        <MsgModal
          btnText="好的"
          todo={() => this.setState({ lookMsg: false })}
          visible={lookMsg}
          title="提示"
          msg="题目没有做完，请选完再进入下一题！"
        />
        {helpVisible ? (
          <HelpModal
            diagnose={diagnose}
            exercise={exercise}
            correct={correct === 2 ? 0 : correct === 0 ? 2 : 1}
            isKeyExercise={true}
            sentenceStem={sentenceStem}
            onClose={this.closeHelp}
            btnTxt={correct === 2 || isKeyExercise ? "下一题" : "再来一次"}
            noTemp={true}
            // noFamily={true}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    ...padding_tool(40),
    // paddingBottom: 24,
  },
  sentenceTxt: {
    fontSize: pxToDp(48),
    color: "#475266",
    ...appFont.fontFamily_syst_bold,
    lineHeight: pxToDp(60),
    // lineHeight: Platform.OS === 'ios' ? pxToDp(80) : pxToDp(80),
  },
  titleTxt: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(40),
    color: "#475266",
    opacity: 0.5,
    lineHeight: pxToDp(60),
  },
});
const mapStateToProps = (state) => {
  // 取数据
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {};
};
export default connect(
  mapStateToProps,
  mapDispathToProps
)(SpeSentenceExerciseTwo);
