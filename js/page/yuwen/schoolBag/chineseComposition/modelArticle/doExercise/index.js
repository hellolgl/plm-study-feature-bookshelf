import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter
} from "react-native";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  fitHeight,
  fontFamilyRestoreMargin,
  borderRadius_tool,
} from "../../../../../../util/tools";
import { appStyle, appFont } from "../../../../../../theme";
import SentenceExercise from "../../../../../../component/chinese/chineseCompositionExercise/sentenceExercise";
import CheckMoreExercise from "../../../../../../component/chinese/chineseCompositionExercise/checkMoreExercise";
import CheckExercise from "../../../../../../component/chinese/chineseCompositionExercise/checkExercise";
import ClickExercise from "../../../../../../component/chinese/chineseCompositionExercise/clickExercise";
import MsgModal from "../../../../../../component/chinese/sentence/msgModal";
import {getRewardCoinLastTopic} from '../../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../../action/userInfo";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isStartAudioT: false,
      audio: "",
      exercise: [],
      nowindex: 0,
      exercise_times_id: "",
      rotateValue: new Animated.Value(0),
      isOpen: true,
      article: "",
      article_title: "",
      author: "",
      lookMsg: false,
    };
    this.audio = undefined;
    this.eventListener = undefined
  }

  static navigationOptions = {};

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    let obj = this.props.navigation.state.params.data;
    obj.isOne ? this.getOne() : this.getlist();
  }
  getOne() {
    let obj = this.props.navigation.state.params.data;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let sendobj = {
      m_id: obj.m_id,
      st_id: obj.st_id,
      grade_code: userInfoJs.checkGrade,
      inspect_id: userInfoJs.c_id,
      article_id: obj.article_id,
      exercise_type: obj.exercise_type,
      exercise_id: obj.exercise_id,
    };
    axios
      .get(api.getChineseCompositionArticleOneExercise, {
        params: sendobj,
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log(res.data.data);
          this.setState({
            exercise: [res.data.data.exercise],
            exercise_times_id: res.data.data.exercise_times_id,
            article: res.data.data.article.article_content,
            article_title: res.data.data.article.name,
            author: res.data.data.article.author,
          });
        }
      });
  }
  getlist() {
    let obj = this.props.navigation.state.params.data;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    axios
      .get(api.getChineseCompositionArticleMindMapExercise, {
        params: {
          m_id: obj.m_id,
          st_id: obj.st_id,
          grade_code: userInfoJs.checkGrade,
          inspect_id: userInfoJs.c_id,
          article_id: obj.article_id,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log("数据数据", res.data.data.exercise[0]);
          this.setState({
            exercise: res.data.data.exercise,
            exercise_times_id: res.data.data.exercise_times_id,
            article: res.data.data.article.article_content,
            article_title: res.data.data.article.name,
            author: res.data.data.article.author,
          });
        }
      });
  }
  nextExercise = (exerobj) => {
    const { exercise, nowindex, exercise_times_id } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = this.props.navigation.state.params.data;
    if (obj.isOne) return;
    axios
      .post(api.saveChineseCompositionArticleMindMapExercise, {
        ...exerobj,
        exercise_times_id,
        c_id: userInfoJs.c_id,
        grade_code: userInfoJs.checkGrade,
        m_id: obj.m_id,
        st_id: obj.st_id,
        sign_out: nowindex + 1 === exercise.length ? "0" : "1",
        article_id: obj.article_id,
        alias: "chinese_toChineseDailyWrite",
      })
      .then((res) => {
        console.log("c_id111111", res.data);
        if (res.data?.err_code === 0) {
          if (nowindex + 1 === exercise.length) {
            if(exerobj.correct === 2){
              getRewardCoinLastTopic().then(res => {
                if(res.isReward){
                  // 展示奖励弹框,在动画完后在弹统计框
                  this.eventListener = DeviceEventEmitter.addListener(
                    "rewardCoinClose",
                    () => {
                      this.goBack();
                      this.eventListener && this.eventListener.remove()
                    }
                  );
                }else{
                  this.goBack();
                }
              })
            }else{
              this.goBack();
            }
            return;
          } else {
            if(exerobj.correct === 2){
              this.props.getRewardCoin()
            }
            let list = [...exercise];
            list[nowindex].status = exerobj.correct;
            this.setState({
              exerciseDetail: exercise[nowindex + 1],
              nowindex: nowindex + 1,
              exercise: list,
            });
          }
        }
      });
  };
  renderExercise = () => {
    const { exercise, nowindex } = this.state;
    console.log("123123");
    if (exercise.length > 0) {
      switch (exercise[nowindex].exercise_type) {
        case "ab":
          return (
            <SentenceExercise
              exercise={exercise[nowindex]}
              nextExercise={this.nextExercise}
              resetToLogin={() => {
                NavigationUtil.resetToLogin(this.props);
              }}
            />
          );
        case "basic":
          if (exercise[nowindex].exercise_type_private === "单选") {
            return (
              <CheckExercise
                exercise={exercise[nowindex]}
                nextExercise={this.nextExercise}
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
                resetToLogin={() => {
                  NavigationUtil.resetToLogin(this.props);
                }}
              />
            );
          }
          break;
        case "selection":
          return (
            <ClickExercise
              exercise={exercise[nowindex]}
              nextExercise={this.nextExercise}
              resetToLogin={() => {
                NavigationUtil.resetToLogin(this.props);
              }}
            />
          );
        default:
          break;
      }
    }
  };
  openStatistic(isOpennow) {
    const { rotateValue } = this.state;
    if (!isOpennow) {
      Animated.timing(rotateValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      this.setState({
        isOpen: true,
      });
      return;
    }
    Animated.timing(rotateValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    this.setState({
      isOpen: false,
    });
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
    const { article, article_title, author, isOpen, lookMsg } = this.state;
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
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
              source={require("../../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={[{ flex: 1 }, appStyle.flexCenter, appStyle.flexTopLine]}
          >
            {/* <ScrollView  > */}
            {this.renderTopaicCard()}
            {/* </ScrollView> */}
          </View>
          <TouchableOpacity
            onPress={() => this.setState({ lookMsg: true })}
            style={[
              size_tool(208, 80),
              borderRadius_tool(200),
              { backgroundColor: "#fff" },
              appStyle.flexCenter,
            ]}
          >
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                { fontSize: pxToDp(32), color: "#475266" },
              ]}
            >
              文章
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            padding: pxToDp(40),
            width: "100%",
          }}
        >
          <View
            style={[
              {
                height: fitHeight(0.78, 0.78),
                // height: pxToDp(800)
              },
            ]}
          >
            <View
              style={[
                {
                  backgroundColor: "#fff",
                  borderRadius: pxToDp(24),
                  padding: pxToDp(20),
                  flex: 1,
                  width: "100%",
                  height: "100%",
                },
              ]}
            >
              {this.renderExercise()}
            </View>
          </View>
          {/* {this.renderbig()} */}
          {/* <View style={[{ height: pxToDp(200), backgroundColor: '#fff', borderRadius: pxToDp(24), borderWidth: pxToDp(8), borderColor: '#F9AD63', padding: pxToDp(20), marginBottom: pxToDp(40) }]}>
                        <ScrollView >

                        </ScrollView>
                    </View> */}
        </View>

        <MsgModal
          btnText="好的"
          todo={() => this.setState({ lookMsg: false })}
          visible={lookMsg}
          title={article_title}
          msg={article}
          isHtml={true}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? pxToDp(50) : 0,
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
