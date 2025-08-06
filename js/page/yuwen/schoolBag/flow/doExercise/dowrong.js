import React, { PureComponent } from "react";
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
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
  fitHeight,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";

import CheckExercise from "./checkExercise";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import Good from "../../../../../component/chinese/reading/good";
import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thinking_tips: "",
      isStartAudioT: false,
      audio: "",
      exercise: [],
      nowindex: 0,
      exercise_times_id: "",
      lookMsg: false,
      goodVisible: false,
      answerStatisticsModalVisible: false,
      wrong: 0,
      correct: 0,
    };
  }

  static navigationOptions = {};

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getlist();
  }

  getlist() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const { checkGrade, class_code, checkTeam, id } = userInfoJs;
    const { exercise_id } = this.props.navigation.state.params.data;

    axios.get(`${api.getChineseExerciseDetail}/${exercise_id}`).then((res) => {
      // let list = res.data.data;
      // console.log("参数123", list);

      this.setState({
        exercise: res.data.data,
      });
    });
  }
  nextExercise = (exerobj) => {
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
  };

  renderExercise = () => {
    const { exercise } = this.state;
    return (
      <CheckExercise
        navigation={this.props.navigation}
        exercise={exercise}
        nextExercise={this.nextExercise}
        isWrong={true}
      />
    );
  };
  doneExercise = () => {
    const { exercise_set_id } = this.state;
    const data = {};
    data.exercise_set_id = exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    data.subject = "01";
    axios
      .post(api.yuwenBagResult, data)
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
  closeAnswerStatisticsModal = () => {
    // console.log('MathCanvas closeDialog')
    this.setState({ answerStatisticsModalVisible: false });
    this.goBack();
    DeviceEventEmitter.emit("backFlowhome"); //返回页面刷新
  };

  render() {
    const {
      exercise,
      thinking_tips,
      lookMsg,
      goodVisible,
      answerStatisticsModalVisible,
      correct,
      wrong,
    } = this.state;
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../images/chineseHomepage/flow/flowBg.png")}
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
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
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
          ></View>
          <View style={[size_tool(120, 80)]}></View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {exercise.exercise_id && this.renderExercise()}
        </View>
        <MsgModal
          btnText="好的"
          todo={() => this.setState({ lookMsg: false })}
          visible={lookMsg}
          title="思路提示"
          msg={thinking_tips}
          isHtml={true}
        />
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
