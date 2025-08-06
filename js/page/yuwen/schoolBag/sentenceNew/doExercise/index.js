import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter,
  Dimensions,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
  borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Header from "../../../../../component/Header";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Modal, Toast } from "antd-mobile-rn";

import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Audio from "../../../../../util/audio";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
import Sentence from "./sentence";
import SpeSentence from "./sentence/speSentence";
import _ from "lodash";
import {getRewardCoinLastTopic} from '../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data;
    this.state = {
      list: [],
      statuslist: [],
      listindex: 0,
      start_time: null,
      se_ids: [],
      type: data.type,
      inspect_name: data.inspect_name,
      name: data.name,
    };
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    this.grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    this.info = userInfoJs;
    this.saveNum = 0;
    this.eventListener = undefined
  }
  componentDidMount() {
    this.getlist();
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentWillUnmount() {
    const { type, has_record } = this.props.navigation.state.params.data;

    if (has_record) {
      DeviceEventEmitter.emit("sentenceRecordList"); //返回页面刷新
      return;
    }

    if (type === "diary") {
      DeviceEventEmitter.emit("backSentenceHome"); //返回页面刷新
    } else if (type === "flow") {
      DeviceEventEmitter.emit("sentenceFlowList"); //返回页面刷新
    } else if (type === "speStudy" || type === "speLevel" || type === "Ai") {
      DeviceEventEmitter.emit("sentenceSpeList"); //返回页面刷新
    }
  }

  getlist = () => {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = this.props.navigation.state.params.data;
    const { type } = data;
    // console.log('参数', data)
    // info.checkGrade  checkTeam
    let url = "",
      senobj = {},
      grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    switch (type) {
      case "flow":
        url = api.chineseNewSentenceGetExercise;
        senobj = {
          grade_code: userInfoJs.checkGrade,
          term_code: userInfoJs.checkTeam,
          unit_code: _.toString(data.unit_code),
        };
        data.unit_code.length > 1 ? (senobj.unit_tag = data.unit_tag) : "";
        break;

      case "diary":
        url = api.chineseGetDailySentenceExercise;
        senobj = {
          grade_code: userInfoJs.checkGrade,
          term_code: userInfoJs.checkTeam,
        };
        break;

      case "speStudy":
        url = api.getChinesSenTopic;

        senobj = {
          grade_term,
          iid: data.iid,
          name: data.name,
          pName: data.inspect_name,
        };
        break;
      case "speLevel":
        url = api.chineseSpeSentenceLevelGetExercise;

        senobj = {
          grade_code: userInfoJs.checkGrade,
          term_code: userInfoJs.checkTeam,
          inspect: data.inspect_name,
        };
        break;
      case "Ai":
        url = api.getChinesSenTopic;

        senobj = {
          grade_term,
          name: data.name,
          pName: data.inspect_name,
        };
        // console.log('senobj', senobj)

        break;
      default:
        break;
    }
    Toast.loading("加载中...", 0);
    axios.get(url, { params: senobj }).then((res) => {
      Toast.hide();

      const data = type === "speLevel" ? res.data.data.data : res.data.data;
      console.log("习题数量===========", senobj, data, type);

      if (data.length > 0) {
        let statuslist = [];
        data.map((item) => {
          console.log("状态", item.status);
          statuslist.push("");
        });
        let se_ids = type === "speLevel" ? res.data.data.se_ids : [];
        this.setState({
          list: data,
          statuslist,
          start_time: new Date().getTime(),
          se_ids,
        });
        // }
        // if (data.length === 0) {
        //     this.setState({
        //         tip: "当前没有题目",
        //     });
      }
    });
  };

  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
    this.goBack();
  };

  saveExercise = (parmas, isKeyExercise) => {
    const { list, listindex, statuslist, se_ids } = this.state;
    // console.log('参数', parmas, isKeyExercise)

    if (isKeyExercise) {
      // 要素题，下一题
      this.nextOne();
    } else {
      // 非要素题，要存
      const { userInfo } = this.props;
      const userInfoJs = userInfo.toJS();
      let currentTopic = list[listindex];
      const data = this.props.navigation.state.params.data;
      const { type } = data;

      let obj = {
        sentence_times_id: currentTopic.sentence_times_id,
        se_id: currentTopic.se_id,
        // correct: ranking,
        // answer_times,
        student_id: this.info.id,
        knowledge_id: currentTopic.knowledge_id,
        grade_term: this.grade_term,
        pName: currentTopic.inspect,
        exercise_time: currentTopic.exercise_time,
        is_push: currentTopic.is_push,
        name: currentTopic.tag1,
        tag1_id: currentTopic.iid,
        ...parmas,
        alias: "chinese_toChooseTextSentence",
      };

      let url = "",
        senobj = {};
      switch (type) {
        case "flow":
          url = api.saveChinesSenTopic;
          senobj = {
            ...obj,
            modular: "2", // 专项提升
          };
          data.unit_code.length > 1 ? (senobj.unit_tag = data.unit_tag) : "";

          break;

        case "diary":
          url = api.saveChinesSenTopic;
          senobj = {
            ...obj,
            modular: data.modular, // π计划
            sub_modular: data.sub_modular, //每日一练
          };
          break;

        case "speStudy":
          url = api.saveChinesSenTopic;
          senobj = {
            ...obj,
            modular: data.modular, // π计划
            sub_modular: data.sub_modular, //每日一练
          };
          break;
        case "speLevel":
          url = api.saveChinesSenTopic;

          senobj = {
            ...obj,
            se_ids,
            exercise_level: currentTopic.exercise_level,
            modular: data.modular, // π计划
            sub_modular: data.sub_modular, //每日一练
          };

          break;
        case "Ai":
          url = api.saveChinesSenTopic;
          senobj = {
            ...obj,
            modular: data.modular, // π计划
            sub_modular: data.sub_modular, //每日一练
          };
          // console.log('senobj', senobj)

          break;
        default:
          break;
      }

      let listnow = JSON.parse(JSON.stringify(statuslist));
      listnow[listindex] = parmas.correct === "0" ? "right" : "wrong";
      this.setState({
        statuslist: listnow,
      });
      // console.log('listnow', listnow)

      axios
        .post(url, senobj)
        .then((res) => {
          // console.log('保存成功', res.data)
          if (res.data.err_code === 0) {
            if(parmas.correct === "0"){
              // 答对
              if(listindex + 1 === list.length){
                getRewardCoinLastTopic().then(res => {
                  if(res.isReward){
                    // 展示奖励弹框,在动画完后在弹统计框
                    this.eventListener = DeviceEventEmitter.addListener(
                      "rewardCoinClose",
                      () => {
                        this.nextOne()
                        this.eventListener && this.eventListener.remove()
                      }
                    );
                  }else{
                    this.nextOne()
                  }
                })
              }else{
                this.props.getRewardCoin()
                this.nextOne()
              }
            }
          }
        })
        .catch((err) => {
          console.log("错误", err, err.code);
          if (err.code === "ECONNABORTED") {
            Toast.info("请求超时，请重试...", 1);
          }
        });
    }
  };
  nextOne = () => {
    const { list, statuslist, listindex, start_time } = this.state;
    if (listindex + 1 === list.length) {
      // 最后一题

      let endTime = new Date().getTime();
      let spend_time = parseInt((endTime - start_time) / 1000);
      let obj = {
        sentence_times_id: list[listindex].sentence_times_id,
        spend_time,
      };
      console.log("保存套题", obj);
      axios
        .put(api.saveChinesSenTopicAll, obj)
        .then((res) => {
          // console.log("套题保存成功");

          let correct = 0,
            wrong = 0,
            blank = 0;
          statuslist.forEach((item) => {
            item === "right" ? correct++ : wrong++;
          });
          this.setState({
            answerStatisticsModalVisible: true,
            correct,
            wrong,
          });
        })
        .catch((err) => {
          // 请求超时
          // if (err.code === 'ECONNABORTED') {
          Toast.info("请求超时，正在重试...", 1);
          let num = this.saveNum;
          this.saveNum = ++num;

          if (this.saveNum < 3) {
            this.nextOne();
          }
          // }
        });
    } else {
      let indexnow = listindex + 1;
      this.setState({
        listindex: indexnow,
      });
    }
  };
  render() {
    const { list, statuslist, listindex, type, name } = this.state;
    // console.log("套题保存成功", type, name);
    return (
      <ImageBackground
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        style={[
          { flex: 1 },
          padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 20, 20),
        ]}
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={this.goBack}
          style={[
            {
              position: "absolute",
              top: pxToDp(48),
              left: pxToDp(20),
              zIndex: 99999,
            },
          ]}
        >
          <Image
            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
            style={[size_tool(120, 80)]}
          />
        </TouchableOpacity>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexCenter,
            { height: pxToDp(140) },
          ]}
        >
          {statuslist.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  size_tool(72),
                  appStyle.flexCenter,
                  borderRadius_tool(100),
                  {
                    borderWidth: pxToDp(6),
                    borderColor:
                      index === listindex ? "#FF964A" : "transparent",
                    backgroundColor:
                      item === "right"
                        ? "#16C792"
                        : item === "wrong"
                        ? "#F2645B"
                        : "transparent",
                    marginRight: pxToDp(
                      index === statuslist.length - 1 ? 0 : 24
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: pxToDp(36), color: item ? "#fff" : "#475266" },
                    fonts.fontFamily_jcyt_700,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={[{ flex: 1 }, padding_tool(0, 80, 20, 80)]}>
          {list.length > 0 ? (
            type === "Ai" && (name === "句型训练" || name === "文化积累") ? (
              <SpeSentence
                exercise={list[listindex]}
                saveExercise={this.saveExercise}
                name={name}
                resetToLogin={() => {
                  NavigationUtil.resetToLogin(this.props);
                }}
              />
            ) : (
              <Sentence
                exercise={list[listindex]}
                saveExercise={this.saveExercise}
                type={type}
                resetToLogin={() => {
                  NavigationUtil.resetToLogin(this.props);
                }}
              />
            )
          ) : (
            <View style={[appStyle.flexCenter, { flex: 1 }]}>
              <View>
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    { fontSize: pxToDp(60), color: "#475266" },
                  ]}
                >
                  本年级不涉及此知识点！
                </Text>
              </View>
            </View>
          )}
        </View>
        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
          finishTxt={"完成"}
        ></AnswerStatisticsModal>
        {this.state.visibleGood ? (
          <View
            style={[
              appStyle.flexCenter,
              {
                width: "100%",
                height: Dimensions.get("window").height,
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                left: 0,
                top: 0,
              },
            ]}
          >
            <Image
              style={[size_tool(660)]}
              source={require("../../../../../images/chineseHomepage/pingyin/new/good.png")}
            />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
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

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
