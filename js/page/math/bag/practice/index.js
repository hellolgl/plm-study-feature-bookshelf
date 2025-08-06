import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  pxToDpHeight,
  borderRadius_tool,
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import * as actionCreators from "../../../../action/purchase/index";
import BackBtn from "../../../../component/math/BackBtn";
import _ from "lodash";
import Rule from "../aiGiveExercise/component/rule";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

class PracticeHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.state = {
        unit_list: [],
        unit_index: -1,
        origin: "",
        lesson_list: [],
        isAllRight: false,
        exercise_set_id: {},
        isGood: true,
        know: "",
        knowItem: {},
        improve_rate: 0,
        knowledge_name: "",
        knowledge_code: "",
        showRule:false
    };
    this.scroll = null;
  }
  componentDidMount() {
    this.getUnit();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "practiceHomePage",
      (event) => {
        this.getLesson();
      }
    );
  }

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.props.getTaskData()
  }

  getUnit = async () => {
    const { userInfo, textCode } = this.props;
    const { unit_index } = this.state;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.textbook = textCode;
    axios.get(api.getMathSyncDiagnosisUnit, { params: data }).then((res) => {
      let data = res.data.data.unit_data;
      // console.log("单元", res.data);
      let unit_list = [];
      let origin = "";
      let _unit_index = -1;
      if (data.length > 0) {
        unit_list = data;
        _unit_index = 0;
        if (unit_index > -1) {
          _unit_index = unit_index;
        }
        origin = unit_list[_unit_index].origin;
        _unit_index = _unit_index;
      }
      this.setState(
        {
          unit_list,
          origin,
          unit_index: _unit_index,
        },
        () => {
          this.getLesson();
        }
      );
    });
  };

  getLesson = () => {
    const { origin } = this.state;
    axios.get(api.getPracticeElementDetails, { params: { origin } }).then((res) => {
        this.setState({
          lesson_list: res.data.data,
        });
      });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  toDoExercise = () => {
    const { origin } = this.state;
    MathNavigationUtil.toMathPracticeDoExercise({
      ...this.props,
      data:{origin}
    });
  };
  clickUnit = (item, index) => {
    this.scroll && this.scroll.scrollTo({ x: 0, y: 0, animated: false });
    this.setState(
      {
        unit_index: index,
        origin: item.origin,
      },
      () => {
        this.getLesson();
      }
    );
  };
  lookexercise = (id) => {
    this.setState({
      knowledge_name: "",
      knowledge_code: "",
    });

    NavigationUtil.toMathAIGiveExerciseLookExercise({
      ...this.props,
      data: {
        exercise_set_id: id,
      },
    });
  };
  render() {
    const {
      unit_list,
      unit_index,
      lesson_list,
      showRule,
      isAllRight,
      isGood,
      know,
      improve_rate,
      origin,
      knowledge_name,
      knowledge_code
    } = this.state;
    const { authority } = this.props;
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
      >
        <BackBtn goBack={this.goBack}></BackBtn>
        <Text style={[styles.header]}>智能学习计划</Text>
        <TouchableOpacity
          style={[styles.rule_btn, appStyle.flexTopLine, appStyle.flexCenter]}
          onPress={() => this.setState({ showRule: !this.state.showRule })}
        >
          <Image
            style={{ width: pxToDp(40), height: pxToDp(40) }}
            resizeMode="contain"
            source={require("../../../../images/aiGiveExercise/rule.png")}
          ></Image>
          <Text
            style={[
              {
                fontSize: pxToDp(32),
                color: "#006868",
                marginLeft: pxToDp(20),
              },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            规则
          </Text>
        </TouchableOpacity>
        <View style={[appStyle.flexTopLine, styles.content]}>
          {unit_list.length === 0 ? (
            <View
              style={{
                position: "absolute",
                left: "50%",
                top: "40%",
              }}
            >
              <ActivityIndicator size={"large"} color={"#999999"} />
            </View>
          ) : (
            <>
              <ScrollView
                style={[styles.left]}
                contentContainerStyle={{ paddingBottom: pxToDp(100) }}
              >
                {unit_list.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.clickUnit(item, index);
                      }}
                    >
                      <View
                        style={[
                          styles.unit_item_img,
                          {
                            backgroundColor:
                              unit_index === index ? "#B8D9DB" : "transparent",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.unit_item_img_nei,
                            appStyle.flexCenter,
                            {
                              backgroundColor:
                                unit_index === index ? "#fff" : "transparent",
                            },
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                            style={[
                              styles.ui_name,
                              unit_index === index
                                ? appFont.fontFamily_jcyt_700
                                : null,
                            ]}
                          >
                            {item.ui_name.trim().split(" ")[0]}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={[{ flex: 1 }, padding_tool(0, 40, 40, 0)]}>
                <View style={[styles.right, padding_tool(40)]}>
                  <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                    <Text
                      style={[
                        appFont.fontFamily_jcyt_700,
                        { color: "#475266", fontSize: pxToDp(40) },
                      ]}
                    >
                      {unit_list[unit_index].ui_name}
                    </Text>
                  </View>
                  <ScrollView
                    ref={(scrollRef) => (this.scroll = scrollRef)}
                    horizontal={true}
                    style={[{ flex: 1, position: "relative" }]}
                    contentContainerStyle={styles.right_contentContainerStyle}
                  >
                    <View
                      style={[
                        { position: "absolute", left: pxToDp(200), zIndex: 0 },
                        appStyle.flexTopLine,
                      ]}
                    >
                        {lesson_list.map((item, index) => {
                            return index < lesson_list.length - 1 ? (
                            <Image
                                key={index}
                                source={
                                index % 2 === 0
                                    ? require("../../../../images/aiGiveExercise/line_down.png")
                                    : require("../../../../images/aiGiveExercise/line_top.png")
                                }
                                style={[size_tool(406, 120), {}]}
                            />
                            ) : null;
                        })}
                    </View>
                    {lesson_list.map((item, index) => {
                      let bg = require("../../../../images/aiGiveExercise/bg3.png"),
                        color = "#fff";
                        let score = item.score;
                        if(score >= 80){
                            bg = require("../../../../images/aiGiveExercise/bg4.png");
                        }else if( score < 80 && score >= 60){
                            bg = require("../../../../images/aiGiveExercise/bg2.png");
                        }else if(score === 0){
                            bg = require("../../../../images/aiGiveExercise/bg3.png")
                        }else{
                            bg = require("../../../../images/aiGiveExercise/bg1.png");
                        }
                      return (
                        <View
                          key={index}
                          style={[
                            appStyle.flexCenter,
                            { width: pxToDp(400) },
                            index % 2 === 0
                              ? { paddingBottom: pxToDp(120) }
                              : { paddingTop: pxToDp(140) },
                          ]}
                        >
                          {index % 2 === 0 ? (
                            <Text style={[styles.titleTxt]}>
                              {item.knowledge_name}
                            </Text>
                          ) : null}
                          <View
                            style={[{ zIndex: 999 }]}
                          >
                            <ImageBackground
                              source={bg}
                              style={[size_tool(280), appStyle.flexCenter, ,]}
                            >
                              <Text
                                style={[
                                  { color: color, fontSize: pxToDp(56) },
                                  appFont.fontFamily_jcyt_700,
                                ]}
                              >{item.score}</Text>
                            </ImageBackground>
                          </View>

                          {index % 2 === 1 ? (
                            <Text style={[styles.titleTxt]}>
                              {item.knowledge_name}
                            </Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </ScrollView>
                  <View
                    style={[
                      appStyle.flexTopLine,
                      appStyle.flexJusBetween,
                      {
                        height: pxToDp(160),
                        borderRadius: pxToDp(200),
                        backgroundColor:'rgba(255,172,74,0.1)',
                        padding: pxToDp(20),
                      },
                    ]}
                  >
                    <View style={[appStyle.flexLine]}>
                        <Image source={require("../../../../images/aiGiveExercise/icon1.png")} style={[size_tool(120), { marginRight: pxToDp(20) }]}/>
                        <View>
                            <Text style={[{ color: "#EF8F00", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>
                                加油完成所有等级题目吧！
                            </Text>
                            <Text style={[{ color: "#EF8F00", fontSize: pxToDp(28) },appFont.fontFamily_jcyt_500]}>
                                数学是思维的锻炼场，每一次突破，都是对未来无限可能的探索。
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.toDoExercise}>
                        <View
                            style={[
                                size_tool(360, 100),
                                borderRadius_tool(120),
                                {
                                    backgroundColor:"#FF862F",
                                    paddingBottom: pxToDp(8),
                                },
                            ]}
                        >
                            <View
                                style={[
                                {
                                    flex: 1,
                                    backgroundColor: '#FFAC4A',
                                },
                                    borderRadius_tool(120),
                                    appStyle.flexCenter,
                                ]}
                            >
                                <Text
                                style={[
                                    { fontSize: pxToDp(40), color: "#fff" },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                                >
                                    开始单元综合测
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
        <Rule
            img={require('../../../../images/aiGiveExercise/rule_item_bg_1.png')}
            ruleConfig={
                ['知识点得分 < 60分','60分 ≤ 知识点得分 < 80分','知识点得分 ≥ 80分']
            }
            show={showRule}
            close={() => {
                this.setState({ showRule: false });
            }}
        />
        <CoinView></CoinView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(60),
  },
  rule_btn: {
    position: "absolute",
    top: Platform.OS === "android" ? pxToDpHeight(0) : pxToDpHeight(40),
    right: pxToDp(0),
    zIndex: 0,
    width: pxToDp(194),
    height: pxToDp(120),
  },
  header: {
    textAlign: "center",
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#246666",
    marginBottom: pxToDp(40),
  },
  content: {
    flex: 1,
  },
  unit_item_img: {
    width: pxToDp(220),
    height: pxToDp(118),
    paddingBottom: pxToDp(6),
    borderRadius: pxToDp(40),
    marginBottom: pxToDp(24),
  },
  unit_item_img_nei: {
    width: pxToDp(220),
    height: pxToDp(112),
    borderRadius: pxToDp(40),
  },
  left: {
    paddingLeft: pxToDp(40),
    width: pxToDp(300),
    flexGrow: 0,
    paddingTop: pxToDp(40),
  },
  right: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
  },
  ui_name: {
    fontSize: pxToDp(36),
    ...appFont.fontFamily_jcyt_500,
    color: "#246666",
  },
  lesson_item_img: {
    width: pxToDp(440),
    height: pxToDp(798),
    marginRight: pxToDp(40),
    marginBottom: pxToDp(40),
    ...appStyle.flexAliCenter,
    paddingTop: pxToDp(60),
    paddingLeft: pxToDp(32),
    paddingRight: pxToDp(32),
  },
  right_contentContainerStyle: {
    ...appStyle.flexLine,
  },

  titleTxt: {
    ...appFont.fontFamily_jcyt_500,
    fontSize: pxToDp(32),
    color: "#475266",
    textAlign: "center",
    opacity: 0.8,
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(PracticeHomePage);
