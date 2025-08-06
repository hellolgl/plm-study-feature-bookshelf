import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from "react-native";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
} from "../../../util/tools";
import { appStyle } from "../../../theme";
// import Svg,{ ForeignObject } from 'react-native-svg';
import CheckExercise from "./checkExercise";
import CheckMoreExercise from "./checkMoreExercise";
import * as userAction from "../../../action/userInfo";
import {getRewardCoinLastTopic} from '../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../action/userInfo";

const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    console.log("props", props.exercise.exercise);
    this.eventListener = undefined
    this.state = {
      exerciselist: props.exercise.exercise,
      exercise_times_id: props.exercise.exercise_times_id,
      exerciseDetail: {},
      nowindex: 0,
    };
  }
  componentDidMount() {
    const { exerciselist, nowindex } = this.state;

    this.setState({
      exerciseDetail: exerciselist[nowindex],
    });
  }

  nextExercise = (exerobj) => {
    const { exerciselist, nowindex, exercise_times_id } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    axios
      .post(api.savechineseCompositionArticleExercise, {
        ...exerobj,
        exercise_times_id,
        c_id: this.props.c_id,
        grade_code: userInfoJs.checkGrade,
        sign_out: nowindex + 1 === exerciselist.length ? "0" : "1",
        alias: "chinese_toChineseDailyWrite",
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          if (nowindex + 1 === exerciselist.length) {
            getRewardCoinLastTopic().then(res => {
              if(res.isReward){
                // 展示奖励弹框,在动画完后在弹统计框
                this.eventListener = DeviceEventEmitter.addListener(
                  "rewardCoinClose",
                  () => {
                     this.props.doneExercise();
                    this.eventListener && this.eventListener.remove()
                  }
                );
              }else{
                 this.props.doneExercise();
              }
            })
            return;
          } else {
            console.log("下一题");
            this.props.getRewardCoin()
            this.setState({
              exerciseDetail: exerciselist[nowindex + 1],
              nowindex: nowindex + 1,
            });
          }
        }
      });
  };
  render() {
    const { exerciseDetail, exerciselist, nowindex } = this.state;
    console.log("题目信息", exerciseDetail.exercise_type_private);
    return (
      <View style={{ flex: 1, padding: pxToDp(40), width: "100%" }}>
        <View
          style={[
            {
              width: "100%",
              flex: 1,
              paddingBottom: pxToDp(40),
              backgroundColor: "#fff",
              borderRadius: pxToDp(24),
              paddingTop: pxToDp(20),
            },
          ]}
        >
          <View style={[appStyle.flexTopLine, appStyle.flexJusCenter]}>
            {exerciselist.map((_, index) => {
              return (
                <View
                  key={index}
                  style={[
                    size_tool(20),
                    borderRadius_tool(20),
                    { marginRight: pxToDp(10) },
                    index === nowindex
                      ? { backgroundColor: "#475266" }
                      : {
                          borderWidth: pxToDp(4),
                          borderColor: "rgba(71,82,102,0.5)",
                        },
                  ]}
                />
              );
            })}
          </View>
          {exerciseDetail.exercise_type_private === "单选" ? (
            <CheckExercise
              exercise={exerciseDetail}
              nextExercise={this.nextExercise}
            />
          ) : null}
          {exerciseDetail.exercise_type_private === "多选" ? (
            <CheckMoreExercise
              exercise={exerciseDetail}
              nextExercise={this.nextExercise}
            />
          ) : null}
          {/* </ScrollView> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
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
