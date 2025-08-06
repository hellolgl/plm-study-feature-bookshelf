import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  ScrollView,
  DeviceEventEmitter,
} from "react-native";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
} from "../../util/tools";
import CircleCard from "../../component/CircleCard";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import NavigationUtil from "../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import ViewControl from 'react-native-zoom-view'
import { Toast } from "antd-mobile-rn";
import { appFont, appStyle } from "../../theme";
import NewRichShowView from "../../component/chinese/newRichShowView";
import Header from "../../component/Header";
import _ from "lodash";
import Audio from "../../util/audio";
import url from "../../util/url";
import ReadingHelpModal from "../../component/chinese/ReadingHelpModal";
import CheckExercise from "./schoolBag/flow/doExercise/checkExercise";
import MsgModal from "../../component/chinese/sentence/msgModal";
import Good from "../../component/chinese/reading/good";
import AnswerStatisticsModal from "../../component/chinese/sentence/staticsModal";

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let isUpload = true;
// let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
class ChineseBagExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      topaicNum: 0,
      //题目列表，后期可能改动
      exercise: [],
      isEnd: false,
      nowindex: 0,
      status: false,
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
      knowledgepoint_explanation: "", //知识讲解
      isImageHelp: false,
      optionList: [],
      isLookHelp: false,
      explanation_audio: "",
      isStartAudio: false,
      isStartAudio1: false,
      playStatus: false,
      playStatus1: false,
      paused: true,
      pausedPrivate: true,
      pausedHelp: true,
      // renderOptionList: true
    };
    this.isHelpClick = false; //诊断标记点击关闭还是帮助
    this.handlenNxtTopaicThrottled = _.throttle(this.nextExercise, 1 * 1000);
    // this.handlenOnCloseThrottled = _.throttle(this.onClose, 3 * 1000);

    // this.handlePlayAudioThrottled = _.throttle(this.playAudio, 3 * 1000);
  }

  static navigationOptions = {
    // title:'答题'
  };
  renderOptionList = true;

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  getTime = () => {
    let date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    return (
      year +
      "-" +
      month +
      "-" +
      day +
      "" +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      seconds
    );
  };

  closeAnswerStatisticsModal = () => {
    // console.log('MathCanvas closeDialog')
    this.setState({ answerStatisticsModalVisible: false });
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    let exercise = this.props.navigation.state.params.exercise_origin;
    const { exercise_set_id, exercise_origin, origin, choose_exercise } =
      this.props.navigation.state.params.exercise_origin;
    // console.log("exercise_id", exercise);
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {
      subject: "01",
      team: "00",
      // unit: '1',
      // student_code: '15',
      exercise_origin,
      exercise_set_id,
      origin,
      choose_exercise,
    };

    data.grade_name = userInfoJs.grade_code;
    data.class_info = userInfoJs.class_code;
    data.team = userInfoJs.term_code;
    data.student_code = userInfoJs.id + "";
    axios.post(api.chineseHomeWork, data).then((res) => {
      let list = res.data.data;
      console.log("ti", list);
      let time = this.getTime();
      for (let i in list) {
        list[i].colorFlag = 0;
      }
      // list[0].colorFlag = 1
      //console.log("题目", list);
      this.setState(() => ({
        exercise: [...list],
        topaicNum: list.length,
        exercise_set_id: exercise_set_id,
        answer_start_time: time,
      }));
    });
    // this.props.getTopaciData(data);
    //原生发来蓝牙数据
  }

  renderTopaicCard = () => {
    let cardList = new Array();
    const { nowindex, exercise } = this.state;
    for (let i = 0; i < exercise.length; i++) {
      //             "0": "#7FD23F",     //绿色
      //   "1": "#FCAC14",     //橘色
      //   "2": "#FC6161",     //红色
      //   '3': '#DDDDDD'
      cardList.push(
        <View
          style={[
            size_tool(80),
            borderRadius_tool(80),
            appStyle.flexCenter,
            {
              backgroundColor:
                exercise[i].status === 2
                  ? "#7FD23F"
                  : exercise[i].status === 0
                  ? "#FC6161"
                  : "transparent",
              marginRight: pxToDp(20),
            },
            i === nowindex
              ? {
                  borderWidth: pxToDp(5),
                  borderColor: "#FF9032",
                }
              : "",
          ]}
        >
          <Text
            style={[
              {
                fontSize: pxToDp(50),
                color: i < nowindex ? "#fff" : "#445268",
              },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            {i + 1}
          </Text>
        </View>
      );
    }
    return cardList;
  };

  nextExercise = (exerobj, isKeyExercise) => {
    const { exercise, nowindex } = this.state;
    const { userInfo } = this.props;
    const { id, checkGrade, checkTeam } = userInfo.toJS();
    const { exercise_origin, origin, exercise_set_id } =
      this.props.navigation.state.params.exercise_origin;
    if (!isKeyExercise) {
      const {
        exercise_id,
        answer_content,
        answer_start_time,
        answer_end_time,
      } = exerobj;
      let data = {
        // ...exerobj,
        grade_code: checkGrade,
        term_code: checkTeam,
        exercise_origin,
        is_finish: nowindex + 1 === exercise.length ? 0 : 1,
        textbook: "10",
        student_code: id,
        origin,
        correction: exerobj.correct === 2 ? "0" : "1",
        is_element_exercise: isKeyExercise ? 0 : 1,
        exercise_id,
        exercise_set_id,
        exercise_result: answer_content,
        is_correction: "0",
        answer_start_time, // 答题开始时间
        answer_end_time, // 答题结束时间
        subject: "01",
      };
      console.log("exerobj", data);

      axios.post(api.finshOneHomeWork, data).then((res) => {
        if (res.data?.err_code === 0) {
          if (exerobj.correct === 2) {
            this.setState(
              {
                goodVisible: true,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    goodVisible: false,
                  });
                }, 1000);
              }
            );
          }
          this.toNext(isKeyExercise, exerobj);
        }
      });
    } else {
      this.toNext(isKeyExercise, exerobj);
    }
  };
  toNext = (isKeyExercise, exerobj) => {
    const { exercise, nowindex } = this.state;
    let yesOrNo = exerobj.correct === 2;
    // console.log("下一题", yesOrNo, isKeyExercise);
    if (nowindex + 1 === exercise.length && (isKeyExercise || yesOrNo)) {
      this.doneExercise();
      return;
    } else {
      let list = [...exercise],
        index = nowindex;
      isKeyExercise ? "" : (list[nowindex].status = exerobj.correct);
      isKeyExercise || yesOrNo ? (index += 1) : "";
      this.setState({
        exerciseDetail: exercise[index],
        nowindex: index,
        exercise: list,
      });
    }
  };
  doneExercise = () => {
    const { exercise_set_id } = this.state;
    const data = {};
    data.exercise_set_id = exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    data.subject = "01";
    axios
      .post(api.yuwenResult, data)
      .then((res) => {
        console.log("getAnswerResult", data, res.data);
        this.setState(() => ({
          wrong: res.data.data.wrong,
          blank: res.data.data.blank,
          correct: res.data.data.correct,
          answerStatisticsModalVisible: true,
          isEnd: true,
        }));
      })
      .catch((e) => {
        // console.log(e)
      });
  };
  renderExercise = () => {
    const { exercise, nowindex } = this.state;
    return (
      <CheckExercise
        exercise={exercise[nowindex]}
        nextExercise={this.handlenNxtTopaicThrottled}
        hideHelp={true}
      />
    );
  };
  render() {
    const {
      exercise,
      goodVisible,
      answerStatisticsModalVisible,
      correct,
      wrong,
    } = this.state;
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../images/chineseHomepage/flow/flowBg.png")}
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
          {/* header */}
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={[
              { flex: 1 },
              padding_tool(40, 0, 0, 40),
              appStyle.flexCenter,
            ]}
          >
            <ScrollView horizontal={true}>{this.renderTopaicCard()}</ScrollView>
          </View>
          <View style={[size_tool(120, 80)]}></View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {exercise.length > 0 && this.renderExercise()}
        </View>

        {goodVisible ? <Good /> : null}
        <AnswerStatisticsModal
          dialogVisible={answerStatisticsModalVisible}
          yesNumber={correct}
          noNumber={wrong}
          waitNumber={0}
          closeDialog={this.closeAnswerStatisticsModal}
          finishTxt={"完成"}
          // isNoNum={true}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
  },

  btn: {
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(16),
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseBagExercise);
