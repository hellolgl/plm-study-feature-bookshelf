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
import ChineseMindMapping from "../../../../../../component/chinese/ChineseMindMapping";
import RichShowView from "../../../../../../component/chinese/newRichShowView";
import Sound from "react-native-sound";
import url from "../../../../../../util/url";
import CheckMoreExercise from "../../../../../../component/chinese/chineseCompositionExercise/checkMoreExercise";
import CheckExercise from "../../../../../../component/chinese/chineseCompositionExercise/checkExercise";
import Good from "../../../../../../component/chinese/reading/good";
import {getRewardCoinLastTopic} from '../../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../../action/userInfo";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      article: "",
      article_title: "",
      author: "",
      exercise: [],
      nowindex: 0,
      exercise_times_id: "",
      ar_map_id: 0,
      name: this.props.navigation.state.params.data.name,
      goodVisible: false,
    };
    this.audio = undefined;
    this.eventListener = undefined
  }

  static navigationOptions = {};

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    //
    let obj = this.props.navigation.state.params.data;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    console.log("传参数", obj);
    axios
      .get(api.getChineseCompositionArticleTitleDetail, {
        params: {
          article_id: obj.article_id,
          c_id: userInfoJs.c_id,
          grade_code: userInfoJs.checkGrade,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          // console.log('回调', res.data.data.ar_map_id)
          this.setState({
            article: res.data.data.article_content,
            article_title: res.data.data.name,
            author: res.data.data.author,
            exercise: res.data.data.exercises,
            exercise_times_id: res.data.data.exercise_times_id,
            ar_map_id: res.data.data.ar_map_id,
          });
        }
      });
  };

  nextExercise = (exerobj) => {
    const { exercise, nowindex, exercise_times_id, ar_map_id } = this.state;
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = this.props.navigation.state.params.data;
    console.log("c_id", obj.c_id);

    axios
      .post(api.saveChineseCompositionArticleTitleDetail, {
        ...exerobj,
        exercise_times_id,
        c_id: userInfoJs.c_id,
        grade_code: userInfoJs.checkGrade,
        sign_out: nowindex + 1 === exercise.length ? "0" : "1",
        // exercise_type: exerobj.exercise_type_public
        alias: "chinese_toChineseDailyWrite",
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          if (nowindex + 1 === exercise.length) {
            // this.props.doneExercise()
            // this.goBack()
            if(exerobj.correct === 2){
              getRewardCoinLastTopic().then(res => {
                if(res.isReward){
                  this.eventListener = DeviceEventEmitter.addListener(
                    "rewardCoinClose",
                    () => {
                      NavigationUtil.toCompositionWriteMindMap({
                        ...this.props,
                        data: {
                          isModel: true,
                          ...obj,
                          ar_map_id,
                          homeKey: this.props.navigation.state.key,
                        },
                      });
                      this.eventListener && this.eventListener.remove()
                    }
                  );
                }else{
                  NavigationUtil.toCompositionWriteMindMap({
                    ...this.props,
                    data: {
                      isModel: true,
                      ...obj,
                      ar_map_id,
                      homeKey: this.props.navigation.state.key,
                    },
                  });
                }
              })
            }else{
              NavigationUtil.toCompositionWriteMindMap({
                ...this.props,
                data: {
                  isModel: true,
                  ...obj,
                  ar_map_id,
                  homeKey: this.props.navigation.state.key,
                },
              });
            }
            return;
          } else {
            if (exerobj.correct === 2) {
              this.props.getRewardCoin()
              this.setState(
                {
                  goodVisible:this.props.moduleCoin < 30?false:true,
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
            this.setState({
              exerciseDetail: exercise[nowindex + 1],
              nowindex: nowindex + 1,
            });
          }
        }
      });
  };
  renderExercise = () => {
    const { exercise, nowindex } = this.state;
    if (exercise.length > 0) {
      if (exercise[nowindex].exercise_type_private === "单选") {
        return (
          <CheckExercise
            resetToLogin={() => {
              NavigationUtil.resetToLogin(this.props);
            }}
            exercise={exercise[nowindex]}
            nextExercise={this.nextExercise}
            width={pxToDp(1000)}
          />
        );
      }
      if (exercise[nowindex].exercise_type_private === "多选") {
        return (
          <CheckMoreExercise
            resetToLogin={() => {
              NavigationUtil.resetToLogin(this.props);
            }}
            exercise={exercise[nowindex]}
            nextExercise={this.nextExercise}
            width={pxToDp(1000)}
          />
        );
      }
    }
  };

  render() {
    const {
      article,
      article_title,
      author,
      name,
      exercise,
      nowindex,
      goodVisible,
    } = this.state;
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
          <TouchableOpacity style={[size_tool(208, 80)]} onPress={this.goBack}>
            <Image
              style={[size_tool(120, 80)]}
              source={require("../../../../../../images/chineseHomepage/pingyin/new/back.png")}
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              { fontSize: pxToDp(40), color: "#475266" },
            ]}
          >
            {name}
          </Text>
          <View style={[size_tool(208, 80)]}></View>
        </View>
        <View
          style={[
            { flex: 1, width: "100%" },
            padding_tool(0, 40, 0, 40),
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
          ]}
        >
          <View
            style={[
              {
                height: "100%",
                marginRight: pxToDp(40),
                paddingLeft: pxToDp(40),
                width: pxToDp(800),
              },
            ]}
          >
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                {
                  fontSize: pxToDp(48),
                  color: "#475266",
                  textAlign: "center",
                  marginBottom: pxToDp(20),
                },
              ]}
            >
              {article_title}
            </Text>
            <View
              style={[
                {
                  width: "100%",
                  flex: 1,
                },
                borderRadius_tool(0, 0, 32, 32),
                padding_tool(0, 40, 40, 0),
              ]}
            >
              <Text
                style={[
                  appFont.fontFamily_jcyt_500,
                  {
                    fontSize: pxToDp(32),
                    color: "#475266",
                    textAlign: "center",
                  },
                ]}
              >
                作者：{author}
              </Text>
              <ScrollView>
                <RichShowView
                  width={pxToDp(700)}
                  value={article}
                ></RichShowView>
              </ScrollView>
            </View>
          </View>

          <View
            style={[
              {
                flex: 1,
                borderRadius: pxToDp(24),
                backgroundColor: "#fff",
                paddingTop: pxToDp(40),
                position: "relative",
              },
            ]}
          >
            {/* <ScrollView style={{ flex: 1, }}>


                        </ScrollView> */}
            <View
              style={[
                { width: "100%", height: pxToDp(40) },
                appStyle.flexTopLine,
                appStyle.flexCenter,
              ]}
            >
              {exercise.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      size_tool(20),
                      borderRadius_tool(20),
                      {
                        borderWidth: pxToDp(4),
                        borderColor: nowindex === index ? "#475266" : "#A3A8B3",
                        backgroundColor:
                          nowindex === index ? "#475266" : "#fff",
                        marginRight: pxToDp(20),
                      },
                    ]}
                  ></View>
                );
              })}
            </View>
            {this.renderExercise()}
          </View>
        </View>
        {goodVisible ? <Good /> : null}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingBottom: pxToDp(60),
    paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
  },
  text: {
    fontSize: pxToDp(40),
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Muyao-Softbrush" : "Muyao-Softbrush-2",
    marginBottom: pxToDp(20),
  },
  text1: {
    fontSize: pxToDp(40),
    color: "#FFB211",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(16),
    marginRight: pxToDp(24),
  },
  text2: {
    fontSize: pxToDp(28),
    color: "#fff",
  },
  statisticsWrap: {
    width: pxToDp(1080),
    // height: pxToDp(890),
    height: fitHeight(0.78, 0.78),
    position: "absolute",
    top: pxToDp(170),
    left: pxToDp(-980),
  },
  statisticsMain: {
    width: pxToDp(1000),
    // height: pxToDp(890),
    height: fitHeight(0.78, 0.78),
    borderTopRightRadius: pxToDp(32),
    borderBottomRightRadius: pxToDp(32),
    backgroundColor: "#fff",
    borderWidth: pxToDp(8),
    borderColor: "#F9AD63",
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(20),
    paddingBottom: pxToDp(20),
    paddingTop: pxToDp(40),
  },
  open: {
    position: "absolute",
    right: pxToDp(0),
    top: pxToDp(200),
    width: pxToDp(80),
    height: pxToDp(56),
    borderTopRightRadius: pxToDp(49),
    borderBottomRightRadius: pxToDp(49),
    paddingRight: pxToDp(8),
    paddingBottom: pxToDp(4),
    zIndex: 9999,
  },
  close: {
    position: "absolute",
    right: pxToDp(0),
    top: pxToDp(280),
    width: pxToDp(80),
    height: pxToDp(56),
    borderTopRightRadius: pxToDp(49),
    borderBottomRightRadius: pxToDp(49),
    paddingRight: pxToDp(8),
    paddingBottom: pxToDp(4),
    zIndex: 9999,
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    moduleCoin:state.getIn(["userInfo", "moduleCoin"]),
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
