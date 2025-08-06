import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
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
import DropdownSelect from "../../../component/Select";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import { connect } from "react-redux";
import api from "../../../util/http/api";
import RichShowView from "../../../component/chinese/RichShowView";
import Sound from "react-native-sound";
import url from "../../../util/url";
import SentenceHelpModal from "../../../component/chinese/SentenceHelpModal";
import MsgModal from "../../../component/chinese/sentence/msgModal";
import HelpModal from "../../../component/chinese/sentence/helpModal";
import PlayAudio from "../../../util/audio/playAudio";

const ranking_map = {
  0: "太棒了，答对了哦！",
  1: "良好，还有更好的组合,继续努力！",
  2: "答错了，继续努力！",
};
const ranking_color_map = {
  0: "#7FD23F",
  1: "#FCAC14",
  2: "#FC6161",
};
class doWrongExerciseSmart extends PureComponent {
  constructor(props) {
    super(props);
    // this.info = this.props.userInfo.toJS();
    // this.se_id = props.navigation.state.params.data.se_id;
    this.myScrollView = undefined;
    this.heightArr = [];
    this.audioHelp = undefined;
    this.audioHelp1 = undefined;

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
    };
  }
  componentDidMount() {
    this.initExercise(this.props.exercise);
    console.log("题目", this.props.exercise.best_answer);
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (props.exercise.se_id !== tempState.exercise.se_id) {
      tempState.exercise = props.exercise;
      tempState.topicStart_time = new Date().getTime();
      tempState.isKeyExercise = false;
      return tempState;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.exercise.se_id !== this.state.exercise.se_id) {
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
      exercise,
      sentenceStem,
      isKeyExercise,
      topicStart_time,
      answer_content,
      correct,
    } = this.state;
    let sentnce = "",
      blankIndex = -1;
    sentenceStem.forEach((item, index) => {
      if (item.word_type === "p") {
        item.value
          ? (sentnce += item.value)
          : (blankIndex = blankIndex === -1 ? index : blankIndex);
      }
    });
    let ranking = 0,
      diagnose = "";
    if (exercise.diag_sentence[sentnce] || blankIndex === -1) {
      // 0 正确 1 良好  2 错误
      if (exercise.diag_sentence[sentnce]) {
        ranking = exercise.diag_sentence[sentnce].ranking;
        diagnose = exercise.diag_sentence[sentnce].diagnose;
      } else {
        ranking = 2;
        diagnose = "回答错误！";
      }
      let answer_contentnow = sentenceStem
        .map((item) => (item.word_type === "p" ? item.value : item.contnet))
        .join("");

      console.log("选完了,", ranking, diagnose);
      // if (ranking === '0') {
      // 答对
      PlayAudio.playSuccessSound(
        ranking === "2" ? url.failAudiopath : url.successAudiopath2
      );

      let endTime = new Date().getTime();
      let answer_times = parseInt((endTime - topicStart_time) / 1000);
      let correctnow = ranking === "2" ? 0 : ranking === "0" ? 2 : 1;
      this.setState({
        answer_times,
        correct: correctnow,
        diagnose,
        helpVisible: true,
        answer_content: isKeyExercise ? answer_content : answer_contentnow,
        finalCorrect: isKeyExercise ? correct : correctnow,
      });

      // }
    } else {
      console.log("没选完", blankIndex, sentenceStem);
      this.clickSentence(sentenceStem[blankIndex], blankIndex);
      this.setState({ lookMsg: true });
    }
  };
  closeHelp = () => {
    const {
      correct,
      finalCorrect,
      answer_times,
      exercise,
      isKeyExercise,
      sentenceStem,
      answer_content,
    } = this.state;
    let isKeyExercisenow = isKeyExercise;

    if (isKeyExercisenow || correct === 2) {
      this.props.nextExercise({
        se_id: exercise.se_id,
        correct: finalCorrect,
        answer_times,
        exercise_type: exercise.exercise_type,
        exercise_id: exercise.exercise_id,
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
  goBack = () => {
    this.closeHelpAudio();
    this.closeHelpAudio1();
    NavigationUtil.goBack(this.props);
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
  initExercise = (e) => {
    let checkWordList = [],
      sentenceStem = [];
    let exercise = this.state.type === "Ai" ? this.aiChangeexercise(e) : e;
    sentenceStem = exercise.sentence_stem.map((item) => ({ ...item }));
    checkWordList = exercise.change_word.map((item) => {
      let index = item.position;
      sentenceStem[index].choiceList = item.word;
      sentenceStem[index].value = "";
      return { ...item };
    });
    console.log("组装后的数据", checkWordList);
    let choiceList = this.shuffle(checkWordList[0].word);
    this.setState({
      checkWordList: checkWordList,
      choiceIndex: 0,
      sentenceStem,
      sentenceIndex: checkWordList[0].position,
      choiceList,
      exercise,
    });
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
    let index = sentenceIndex,
      choicelistnow = choiceList,
      choiceIndexnow = choiceIndex;
    if (choiceIndex + 1 < checkWordList.length) {
      choiceIndexnow += 1;

      index = checkWordList[choiceIndexnow].position;
      choicelistnow = this.shuffle(checkWordList[choiceIndexnow].word);
    }
    console.log("选项", checkWordList, choicelistnow);
    this.setState({
      sentenceStem: listnow,
      sentenceIndex: index,
      choiceList: choicelistnow,
      choiceIndex: choiceIndexnow,
    });
  };
  clickSentence = (item, position) => {
    const { checkWordList } = this.state;

    let index = 0;
    checkWordList.forEach((item, i) => {
      if (position === item.position) {
        index = i;
      }
    });
    console.log("----------------", item, checkWordList[index], index);
    let choiceList = this.shuffle(checkWordList[index].word);
    this.setState({
      sentenceIndex: position,
      choiceList,
      choiceIndex: index,
    });
  };
  renderSentence = () => {
    const { sentenceStem, sentenceIndex } = this.state;

    return sentenceStem.map((item, index) => {
      return item.word_type === "p" ? (
        <TouchableOpacity
          style={[
            sentenceIndex === index
              ? padding_tool(0, 0, 4, 0)
              : padding_tool(3),
            margin_tool(0, 20, 10, 20),
            {
              backgroundColor:
                sentenceIndex === index || item.value ? "#FFAC2F" : "#E7E7F1",
              borderRadius: pxToDp(40),
              minWidth: pxToDp(200),
            },
          ]}
          onPress={this.clickSentence.bind(this, item, index)}
          key={index}
        >
          <View
            style={[
              padding_tool(0, 40, 0, 40),
              {
                // borderBottomColor: sentenceIndex === index ? '#FF964A' : '#475266',
                // borderBottomWidth: pxToDp(4),
                minHeight: pxToDp(90),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  sentenceIndex === index || item.value ? "#FFCC4A" : "#F5F5FA",
                borderRadius: pxToDp(40),
              },
            ]}
          >
            {item.value ? (
              <Text
                style={[
                  styles.sentenceTxt,
                  {
                    color: "#475266",
                  },
                ]}
              >
                {item.value}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      ) : (
        <Text
          style={[styles.sentenceTxt, { marginBottom: pxToDp(10) }]}
          key={index}
        >
          {item.content}
        </Text>
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
              backgroundColor: value === item ? "#E8D3BC" : "#E7E7F2",
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
                backgroundColor: value === item ? "#E8D3BC" : "#F5F5FA",
              },
            ]}
          >
            <Text
              style={[
                {
                  fontSize: pxToDp(48),
                  lineHeight: pxToDp(70),
                  color: item === value ? "#E8D3BC" : "#475266",
                },
                appFont.fontFamily_syst_bold,
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
  renderTitle = () => {
    const { exercise } = this.state;
    let title =
      exercise.common_stem.indexOf("非顺序造句") === -1
        ? exercise.common_stem
        : "";
    let stem = exercise.stem ? exercise.stem : "";
    title.length > 0
      ? stem.length > 0
        ? (title = title + "：" + stem)
        : ""
      : (title = stem);
    return <Text style={[styles.titleTxt]}>{title}</Text>;
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

    return (
      <View style={[styles.mainWrap]}>
        {this.renderTitle()}
        <ScrollView style={[{ width: "100%" }]}>
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
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexLineWrap,
              { paddingBottom: pxToDp(100) },
            ]}
          >
            {this.renderChoice()}
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
            isKeyExercise={this.props.isWrong ? true : isKeyExercise}
            sentenceStem={sentenceStem}
            onClose={this.closeHelp}
            btnTxt={correct === 2 || isKeyExercise ? "下一题" : "再来一次"}
            // noFamily={true}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    padding: pxToDp(60),
  },
  sentenceTxt: {
    fontSize: pxToDp(48),
    color: "#475266",
    ...appFont.fontFamily_syst_bold,
    lineHeight: pxToDp(60),
    // ...appFont.fontFamily_jcyt_700,
    // lineHeight: Platform.OS === 'ios' ? pxToDp(80) : pxToDp(80),
    // paddingBottom: pxToDp(0)
  },
  titleTxt: {
    // ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#475266",
    opacity: 0.5,
    lineHeight: pxToDp(60),
    ...appFont.fontFamily_syst_bold,
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
)(doWrongExerciseSmart);
