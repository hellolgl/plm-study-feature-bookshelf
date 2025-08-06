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

import CheckMoreExercise from "../../../../../component/chinese/chineseCompositionExercise/checkMoreExercise";
import CheckExercise from "../../../../../component/chinese/chineseCompositionExercise/checkExercise";
import ClickExercise from "../../../../../component/chinese/chineseCompositionExercise/clickExercise";
import MsgModal from "../../../../../component/chinese/sentence/msgModal";
import Good from "../../../../../component/chinese/reading/good";

import {getRewardCoinLastTopic} from '../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
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
      rotateValue: new Animated.Value(0),
      lookMsg: false,
      goodVisible: false,
      isOne: this.props.navigation.state.params.data.isOne,
      has_gold: false,
      showGold: false,
      right: 0,
    };
    this.audio = undefined;
    this.eventListener = undefined
  }

  static navigationOptions = {};

  goBack = () => {
    DeviceEventEmitter.emit("compositionRecord");
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    let obj = this.props.navigation.state.params.data;
    console.log("m_id", this.props.navigation.state.params.data);

    if (obj.isOne) {
      this.getlistone();
    } else {
      this.getlist();
    }
  }
  getlistone = () => {
    //
    let obj = this.props.navigation.state.params.data;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();

    this.setState({
      exercise: [obj],
      // exercise_times_id: obj.exercise_times_id
    });
  };

  getlist() {
    let obj = this.props.navigation.state.params.data;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log("userInfoJs", obj);
    axios
      .get(api.getChineseCompositionWriteExercise, {
        params: {
          te_id: obj.te_id,
          // te_id: 16,
          grade_code: userInfoJs.checkGrade,
          c_id: userInfoJs.c_id,
          // c_id: 10
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log("题目", res.data.data);
          this.setState({
            // thinking_tips: this.props.navigation.state.params.data.thinking_tips,
            // audio: res.data.data.audio,
            exercise: res.data.data.exercises,
            exercise_times_id: res.data.data.exercise_times_id,
            has_gold: res.data.data.has_gold,
            // has_gold: false
          });
        }
      });
  }
  nextExercise = (exerobj) => {
    const { exercise, nowindex, exercise_times_id } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = this.props.navigation.state.params.data;

    if (obj.isOne) {
      this.cannext(exerobj);
      return;
    }
    axios
      .post(api.saveChineseCompositionWriteExercise, {
        ...exerobj,
        exercise_times_id,
        c_id: userInfoJs.c_id,
        grade_code: userInfoJs.checkGrade,
        te_id: obj.te_id,
        sign_out: nowindex + 1 === exercise.length ? "0" : "1",
        alias: "chinese_toChineseDailyWrite",
      })
      .then((res) => {
        console.log("c_id-----------", res.data);
        if (res.data?.err_code === 0) {
          if(exerobj.correct === 2){
            if (nowindex + 1 === exercise.length && !obj.isOne){
              getRewardCoinLastTopic().then(res => {
                if(res.isReward){
                  // 展示奖励弹框,在动画完后在弹统计框
                  this.eventListener = DeviceEventEmitter.addListener(
                    "rewardCoinClose",
                    () => {
                      this.cannext(exerobj)
                      this.eventListener && this.eventListener.remove()
                    }
                  );
                }else{
                  this.cannext(exerobj)
                }
              })
            }else{
              this.cannext(exerobj)
            }
          }else{
            this.getRewardCoin()
              this.cannext(exerobj)
          }
        }
      });
  };
  cannext = (exerobj) => {
    let obj = this.props.navigation.state.params.data;

    const { exercise, nowindex, has_gold, right } = this.state;
    let rightnow = right;
    if (exerobj.correct === 2) {
      ++rightnow;
    }
    if (nowindex + 1 === exercise.length && !obj.isOne) {
      // this.props.doneExercise()
      let total = exercise.length;
      let rightnumber = (rightnow / total) * 100;
      // console.log('正确率', total, rightnow, rightnumber)
      if (has_gold || rightnumber < 85) {
        // 已经获取到徽章
        this.goBack();
      } else {
        this.setState({
          lookMsg: true,
        });
      }

      return;
    } else {
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

      let list = [...exercise];
      list[nowindex].status = exerobj.correct;
      this.setState({
        exerciseDetail: obj.isOne ? exercise[nowindex] : exercise[nowindex + 1],
        nowindex: obj.isOne ? nowindex : nowindex + 1,
        exercise: list,
        right: rightnow,
      });
    }
  };
  renderExercise = () => {
    const { exercise, nowindex, isOne } = this.state;
    if (exercise.length > 0) {
      if (exercise[nowindex].exercise_type_private === "单选") {
        return (
          <CheckExercise
            exercise={exercise[nowindex]}
            nextExercise={this.nextExercise}
            isWrong={isOne}
            resetToLogin={() => {
              NavigationUtil.resetToLogin(this.props);
            }}
          />
        );
      }
      if (exercise[nowindex].exercise_type_private === "多选") {
        return (
          <CheckMoreExercise
            exercise={exercise[nowindex]}
            nextExercise={this.nextExercise}
            isWrong={isOne}
            resetToLogin={() => {
              NavigationUtil.resetToLogin(this.props);
            }}
          />
        );
      }
    }
  };

  renderTopaicCard = () => {
    let cardList = new Array();
    const { nowindex, exercise, isOne } = this.state;
    if (isOne) return;
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
            ]}
          >
            {i + 1}
          </Text>
        </View>
      );
    }
    return cardList;
  };
  render() {
    const { has_gold, thinking_tips, lookMsg, goodVisible } = this.state;
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
              appStyle.flexCenter,
              appStyle.flexTopLine,
              padding_tool(0, 60, 0, 60),
            ]}
          >
            <View style={[appStyle.flexCenter]}>
              <ScrollView horizontal={true} style={[{ width: "100%" }]}>
                <View
                  style={[
                    appStyle.flexTopLine,
                    { width: "100%" },
                    appStyle.flexAliCenter,
                  ]}
                >
                  {this.renderTopaicCard()}
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={[size_tool(208, 80), appStyle.flexCenter]}></View>
        </View>
        <View
          style={[
            {
              flex: 1,
              width: "100%",
            },
            padding_tool(0, 60, 40, 60),
          ]}
        >
          <View
            style={[
              {
                // height: fitHeight(0.78, 0.78),
                flex: 1,
              },
            ]}
          >
            {this.renderExercise()}
          </View>
        </View>
        <MsgModal
          btnText="X"
          todo={() => {
            this.setState({ lookMsg: false });
            this.goBack();
          }}
          visible={lookMsg}
          title=""
          msg={""}
          isGold={true}
        />
        {goodVisible ? <Good /> : null}
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
  return {
    getRewardCoin() {
      dispatch(actionCreatorsUserInfo.getRewardCoin());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
