import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";

import { connect } from "react-redux";
import {
  borderRadius_tool,
  margin_tool,
  padding_tool,
  pxToDp,
  size_tool,
} from "../../../../../../util/tools";

import { appFont, appStyle } from "../../../../../../theme";

import MsgModal from "../../../../../../component/chinese/sentence/msgModal";
import HelpModal from "../../../../../../component/chinese/sentence/helpModal";
import PlayAudio from "../../../../../../util/audio/playAudio";
import url from "../../../../../../util/url";
import Audio from "../../../../../../util/audio/audio";

class SentenceDoExercise extends PureComponent {
  constructor(props) {
    super(props);

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
      type: props.type,
      diagnose_audio: "",
    };

    this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";

    this.failAudiopath = url.baseURL + "pinyin_new/pc/audio/fail.mp3";
  }
  componentDidMount() {
    this.initExercise(this.props.exercise);
  }

  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (props.exercise.se_id !== tempState.exercise.se_id) {
      tempState.exercise = props.exercise;
      tempState.topicStart_time = new Date().getTime();
      tempState.isKeyExercise = false;
      return tempState;
    }
    return tempState;
  }
  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate', prevState.exercise, this.state.exercise)
    if (prevState.exercise.se_id !== this.state.exercise.se_id) {
      this.initExercise(this.state.exercise);
    }
  }

  lookRightOrWrong = () => {
    const { exercise, sentenceStem, topicStart_time } = this.state;
    const { token } = this.props;
    if (!token && this.props.resetToLogin) {
      this.props.resetToLogin();
      return;
    }
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
      diagnose = "",
      diagnose_audio;
    if (exercise.diag_sentence[sentnce] || blankIndex === -1) {
      // 0 正确 1 良好  2 错误
      if (exercise.diag_sentence[sentnce]) {
        ranking = exercise.diag_sentence[sentnce].ranking;
        diagnose = exercise.diag_sentence[sentnce].diagnose;
        diagnose_audio = exercise.diag_sentence[sentnce].diagnose_audio;
      } else {
        ranking = "2";
        diagnose = "回答错误！";
      }
      ranking === "0"
        ? PlayAudio.playSuccessSound(url.successAudiopath2)
        : diagnose_audio
        ? ""
        : PlayAudio.playSuccessSound(url.failAudiopath);
      // console.log("选完了,", ranking, diagnose);
      // if (ranking === '0') {
      // 答对
      let endTime = new Date().getTime();
      let answer_times = parseInt((endTime - topicStart_time) / 1000);
      this.setState({
        answer_times,
        correct: ranking,
        diagnose: ranking === "0" ? "" : diagnose,
        helpVisible: true,
        diagnose_audio: ranking === "0" ? "" : diagnose_audio,
      });

      // }
    } else {
      console.log("没选完", blankIndex, sentenceStem);
      this.clickSentence(sentenceStem[blankIndex], blankIndex);
      this.setState({ lookMsg: true });
    }
  };
  closeHelp = () => {
    const { correct, answer_times, exercise, isKeyExercise } = this.state;
    this.props.saveExercise(
      {
        correct,
        answer_times,
      },
      isKeyExercise
    );

    this.setState({
      isKeyExercise: correct !== "0" && !isKeyExercise,
      helpVisible: false,
    });
    this.initExercise(exercise);
  };

  aiChangeexercise = (exercise) => {
    // 智能造句重组题目
    let exerciseNow = JSON.parse(JSON.stringify(exercise));
    let choicelist = [];
    exercise._change_word
      ? (choicelist = exercise.change_word[0].word)
      : exercise.change_word.forEach((item) => {
          choicelist.push(...item.word);
        });
    let change_word = exercise.change_word.map((item) => ({
      ...item,
      word: choicelist,
    }));

    exerciseNow.sentence_stem = exercise.sentence_stem.map((item, index) => {
      let list = change_word.filter((n) => n.position === index);
      return {
        ...item,
        word_type: list.length === 0 ? "n" : "p",
      };
    });
    console.log("list", change_word);

    return {
      ...exerciseNow,
      change_word,
      _change_word: exercise.change_word,
    };
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
    // console.log("组装后的数据", checkWordList);
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
    // console.log("选项", checkWordList, choicelistnow);
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
    // console.log("----------------", item, checkWordList[index], index);
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
          onPress={this.clickSentence.bind(this, item, index)}
          key={index}
        >
          <View
            style={[
              padding_tool(10, 40, 0, 40),
              margin_tool(0, 10, 20, 10),
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
                    ? require("../../../../../../images/chineseHomepage/sentence/penOrange.png")
                    : require("../../../../../../images/chineseHomepage/sentence/pen.png")
                }
              />
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.sentenceTxt]} key={index}>
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
              backgroundColor: value === item ? "#F07C39" : "#E7E7F2",
              marginRight: pxToDp(20),
              marginBottom: pxToDp(20),
            },
          ]}
        >
          <View
            style={[
              padding_tool(30, 60, Platform.OS === "ios" ? 30 : 20, 60),
              borderRadius_tool(40),
              appStyle.flexCenter,
              {
                backgroundColor: value === item ? "#FF964A" : "#F5F5FA",
              },
            ]}
          >
            <Text
              style={[
                appFont.fontFamily_syst_bold,
                {
                  fontSize: pxToDp(48),
                  lineHeight: pxToDp(70),
                  color: item === value ? "#fff" : "#475266",
                },
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
    let common_stem_audio = exercise.common_stem_audio;
    return (
      <View>
        {common_stem_audio ? (
          <Audio
            audioUri={`${url.baseURL}${common_stem_audio}`}
            pausedBtnImg={require("../../../../../../images/audio/audioPlay.png")}
            pausedBtnStyle={{
              width: pxToDp(198),
              height: pxToDp(95),
            }}
            playBtnImg={require("../../../../../../images/audio/audioPause.png")}
            playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
            // rate={0.75}
            onRef={(ref) => {
              this.audioRef = ref;
            }}
          >
            <Text style={[styles.titleTxt]}>{title}</Text>
          </Audio>
        ) : (
          <Text style={[styles.titleTxt]}>{title}</Text>
        )}
      </View>
    );
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
      diagnose_audio,
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
          <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
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
              backgroundColor: "#F07C39",
              position: "absolute",
              bottom: pxToDp(32),
              right: pxToDp(32),
            },
          ]}
        >
          <View
            style={[
              { flex: 1, backgroundColor: "#FF964A" },
              borderRadius_tool(240),
              appStyle.flexCenter,
            ]}
          >
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                { fontSize: pxToDp(48), color: "#fff" },
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
            correct={correct}
            isKeyExercise={this.props.isWrong ? true : isKeyExercise}
            sentenceStem={sentenceStem}
            onClose={this.closeHelp}
            btnTxt={
              this.props.isStudy
                ? "再来一次"
                : correct === "0" || isKeyExercise
                ? "下一题"
                : "再来一次"
            }
            diagnose_audio={diagnose_audio}
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
    fontSize: pxToDp(52),
    color: "#475266",
    ...appFont.fontFamily_syst_bold,
    lineHeight: Platform.OS === "ios" ? pxToDp(80) : pxToDp(80),
    // paddingBottom: pxToDp(0)
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
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(SentenceDoExercise);
