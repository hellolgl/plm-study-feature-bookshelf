import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
  ScrollView,
  DeviceEventEmitter,
} from "react-native";
import {
  borderRadius_tool,
  padding_tool,
  pxToDp,
  size_tool,
  getGradeInfo,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import NavigationUtil from "../../../../../navigator/NavigationUtil";

import { connect } from "react-redux";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import FreeTag from "../../../../../component/FreeTag";
import * as actionCreators from "../../../../../action/purchase/index";
import _ from "lodash";
class homePage extends PureComponent {
  constructor(props) {
    super(props);
    this.info = this.props.userInfo.toJS();
    this.state = {
      list: [],
      unitlist: [
        {
          title: "上半学期",
          list: ["第一单元", "第二单元", "第三单元", "第四单元", "期中复习"],
        },
        {
          title: "下半学期",
          list: ["第五单元", "第六单元", "第七单元", "第八单元", "期末复习"],
        },
      ],
      bigIndex: 0,
      littleIndex: 0,
      has_record: false,
    };
    this.audio = null;
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "sentenceFlowList",
      () => this.checkUnit(this.state.bigIndex, this.state.littleIndex)
    );
    this.getlist(["01"]);
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("backSentenceHome"); //刷新首页
    this.eventListenerRefreshPage.remove();
  }
  checkUnit = (bigIndex, littleIndex) => {
    // console.log('---------------', bigIndex, littleIndex)
    let unit_code = [];
    if (littleIndex < 4) {
      unit_code.push("0" + String(bigIndex * 4 + littleIndex + 1));
    } else {
      bigIndex === 0
        ? (unit_code = ["01", "02", "03", "04"])
        : (unit_code = ["01", "02", "03", "04", "05", "06", "07", "08"]);
    }

    this.getlist(unit_code);
    this.scrollRef && this.scrollRef?.scrollTo({ x: 0, y: 0, animated: false });
    this.setState({
      bigIndex,
      littleIndex,
    });
  };
  getlist = (value) => {
    // let unit_code = JSON.stringify(value);
    let unit_code = _.toString(value);

    let grade_code = this.info.checkGrade;
    let term_code = this.info.checkTeam;
    // chineseNewSentenceGetKnow
    let obj = {
      unit_code,
      grade_code,
      term_code,
    };
    value.length > 1 ? (obj.unit_tag = value.length === 4 ? 1 : 2) : "";
    // console.log("obj=========", value);

    axios
      .get(api.chineseNewSentenceGetKnow, {
        params: obj,
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          const data = res.data.data.data ? res.data.data.data : [];
          if (data.length > 0) {
            let knowlist = [];
            // console.log("=============", data);

            data.map((item) => {
              item.data.map((littleItem) => {
                knowlist = knowlist.concat(
                  littleItem.map((e) => ({ ...e, iid: item.id }))
                );
              });
            });
            // console.log("单元", res.data.data);

            this.setState({
              list: knowlist,
              has_record: res.data.data.has_exercise,
            });
          } else {
            this.setState({
              list: [],
              has_record: false,
            });
          }
        }
      });
  };

  goback = () => {
    NavigationUtil.goBack(this.props);
  };
  noauthority = () => {
    this.props.setVisible(true);
  };

  todoExercise = (authority) => {
    const { has_record, littleIndex, bigIndex } = this.state;
    if (!authority) {
      this.noauthority();
      return;
    }
    let unit_code = [];
    if (littleIndex < 4) {
      unit_code.push("0" + String(bigIndex * 4 + littleIndex + 1));
    } else {
      bigIndex === 0
        ? (unit_code = ["01", "02", "03", "04"])
        : (unit_code = ["01", "02", "03", "04", "05", "06", "07", "08"]);
    }
    let data = {
      unit_code,
      type: "flow",
      unit_tag: unit_code.length === 4 ? 1 : 2,
      has_record,
    };
    if (has_record) {
      NavigationUtil.toNewSentenceExerciseRercord({
        ...this.props,
        data,
      });
    } else {
      NavigationUtil.toNewSentenceDoExercise({
        ...this.props,
        data,
      });
    }
  };
  toStudy = (item, authority) => {
    if (!authority) {
      this.noauthority();
      return;
    }
    NavigationUtil.toNewSentenceStudyExercise({ ...this.props, data: item });
  };
  toSpe = (item) => {
    NavigationUtil.toNewSentenceSpeList({
      ...this.props,
      data: { ...item, inspect_name: item.inspect, fromflow: true },
    });
  };
  renderList = (showFree, authority) => {
    const { list } = this.state;

    const renderDom = list.map((item, index) => {
      return (
        <View key={index} style={[styles.right_item_wrap]}>
          <View style={[styles.indexWrap]}>
            <Text style={[styles.indexTxt]}>{index + 1}</Text>
          </View>
          <TouchableOpacity
            onPress={this.toStudy.bind(this, item, authority)}
            style={[styles.knowWrap]}
          >
            <View style={[styles.knowInner]}>
              <View style={[appStyle.flexTopLine]}>
                <Text style={[styles.right_item_know]}>
                  {item.knowledge_point}
                </Text>
                {showFree ? <FreeTag haveAllRadius={true} style={{}} /> : null}
              </View>
              <View
                style={[
                  appStyle.flexTopLine,
                  appStyle.flexJusBetween,
                  appStyle.flexAliCenter,
                ]}
              >
                <Text style={[styles.right_item_class]}>
                  课文名：{item.learning_name}
                </Text>
                <View style={[styles.studyWrap]}>
                  <Image
                    source={require("../../../../../images/chineseHomepage/sentence/robot.png")}
                    style={[size_tool(50, 44)]}
                  />
                  <Text style={[styles.studyTxt]}>例句学习</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toSpe.bind(this, item)}>
            <ImageBackground
              source={require("../../../../../images/chineseHomepage/sentence/toStudy.png")}
              style={[
                size_tool(330, 140),
                appStyle.flexCenter,
                padding_tool(0, 60, 0, 0),
              ]}
            >
              <Text style={[styles.right_item_inspect_text]}>
                {item.inspect}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    });

    return renderDom;
  };
  render() {
    const { unitlist, bigIndex, littleIndex, list, has_record } = this.state;
    // log("cn checkGrade: ", checkGrade)
    // log("cn checkTerCode: ", this.state.visible)
    const authority = this.props.authority

    return (
      <View style={[styles.container]}>
        <ImageBackground
          source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
          style={[
            { flex: 1 },
            padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 0, 20),
          ]}
          resizeMode="cover"
        >
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <TouchableOpacity
              style={[size_tool(120, 80)]}
              onPress={this.goback}
            >
              <Image
                style={[size_tool(120, 80)]}
                source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              />
            </TouchableOpacity>
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                { fontSize: pxToDp(48), color: "#475266" },
              ]}
            >
              校内同步
            </Text>
            <View
              style={[
                size_tool(120, 80),
                borderRadius_tool(200),
                appStyle.flexCenter,
              ]}
            ></View>
          </View>
          <View
            style={[
              { flex: 1 },
              padding_tool(0, 90, 0, 90),
              appStyle.flexTopLine,
            ]}
          >
            <View
              style={[
                {
                  paddingBottom: pxToDp(40),
                  paddingTop: Platform.OS === "ios" ? pxToDp(20) : 0,
                },
              ]}
            >
              <ScrollView>
                {unitlist.map((item, index) => {
                  return (
                    <View key={index}>
                      <Text style={[styles.left_title]}>{item.title}</Text>
                      {item.list.map((i, n) => {
                        return (
                          <TouchableOpacity
                            onPress={this.checkUnit.bind(this, index, n)}
                            key={n}
                            style={[
                              bigIndex === index && littleIndex === n
                                ? styles.left_item_wrap
                                : styles.left_item_wrap_n,
                            ]}
                          >
                            <View
                              style={[
                                bigIndex === index && littleIndex === n
                                  ? styles.left_item_inner
                                  : styles.left_item_inner_n,
                              ]}
                            >
                              <Text
                                style={[
                                  bigIndex === index && littleIndex === n
                                    ? styles.left_item_text_check
                                    : styles.left_item_text,
                                ]}
                              >
                                {i}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: "#fff",
                  marginLeft: pxToDp(40),
                  padding: pxToDp(20),
                },
                borderRadius_tool(60, 60, 0, 0),
              ]}
            >
              {list.length > 0 ? (
                <ScrollView ref={(scrollRef) => (this.scrollRef = scrollRef)}>
                  {this.renderList(
                    bigIndex === 0 && littleIndex === 0 && !authority,
                    (bigIndex === 0 && littleIndex === 0) || authority
                  )}
                </ScrollView>
              ) : (
                <View
                  style={[appStyle.flexCenter, { flex: 1, height: "100%" }]}
                >
                  <Image
                    source={require("../../../../../images/chineseHomepage/sentence/msgPanda.png")}
                    style={[size_tool(200)]}
                  />
                  <View
                    style={[
                      padding_tool(40),
                      { backgroundColor: "#fff" },
                      borderRadius_tool(40),
                    ]}
                  >
                    <Text
                      style={[
                        appFont.fontFamily_syst_bold,
                        { fontSize: pxToDp(48), color: "#475266" },
                      ]}
                    >
                      本单元暂无句型知识点！
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {list.length > 0 ? (
            <TouchableOpacity
              onPress={this.todoExercise.bind(
                this,
                (bigIndex === 0 && littleIndex === 0) || authority
              )}
              style={[
                size_tool(240),
                borderRadius_tool(240),
                {
                  paddingBottom: pxToDp(8),
                  backgroundColor: has_record ? "#17A97D" : "#F07C39",
                  position: "absolute",
                  bottom: pxToDp(32),
                  right: pxToDp(32),
                },
              ]}
            >
              <View
                style={[
                  {
                    flex: 1,
                    backgroundColor: has_record ? "#26C595" : "#FF964A",
                  },
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
                  {littleIndex < 4
                    ? "单元测"
                    : bigIndex === 0
                    ? "期中复习"
                    : "期末复习"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // padding: pxToDp(40),
    // backgroundColor: 'pink'
  },
  left_title: {
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(24),
    color: "#475266",
    marginBottom: pxToDp(20),
    opacity: 0.5,
  },
  left_item_wrap_n: {
    ...size_tool(320, 120),
    borderRadius: pxToDp(40),
    backgroundColor: "transparent",
    paddingBottom: pxToDp(8),
  },
  left_item_inner_n: {
    flex: 1,
    borderRadius: pxToDp(40),
    backgroundColor: "transparent",
    ...appStyle.flexCenter,
  },
  left_item_wrap: {
    ...size_tool(320, 120),
    borderRadius: pxToDp(40),
    backgroundColor: "#EDEDF4",
    paddingBottom: pxToDp(8),
  },
  left_item_inner: {
    flex: 1,
    borderRadius: pxToDp(40),
    backgroundColor: "#fff",
    ...appStyle.flexCenter,
  },
  left_item_text: {
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(40),
    color: "#475266",
  },
  left_item_text_check: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(40),
    color: "#475266",
  },
  right_item_wrap: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    paddingLeft: pxToDp(30),
    marginBottom: pxToDp(45),
  },
  right_item_know: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(48),
    color: "#475266",
    // marginBottom: Platform.OS == "ios" ? pxToDp(20) : 0,
    marginRight: pxToDp(20),
    lineHeight: pxToDp(60),
    flex: 1,
  },
  right_item_inspect_text: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(36),
    color: "#475266",
    lineHeight: pxToDp(50),
  },
  right_item_class: {
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(32),
    color: "#7E8694",
    opacity: 0.7,
  },
  knowWrap: {
    flex: 1,
    borderRadius: pxToDp(40),
    paddingBottom: pxToDp(12),
    backgroundColor: "#EDEDF4",
  },
  knowInner: {
    position: "relative",
    borderRadius: pxToDp(40),
    backgroundColor: "#F7FBFC",
    minHeight: pxToDp(210),
    ...padding_tool(60, 18, 20, 78),
  },
  studyTxt: {
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(33),
    color: "#7E8694",
    lineHeight: pxToDp(43),
    marginLeft: pxToDp(10),
  },
  studyWrap: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: pxToDp(100),
    ...size_tool(232, 54),
    alignItems: "center",
    justifyContent: "center",
  },
  indexWrap: {
    ...padding_tool(10, 20, 0, 20),
    borderRadius: pxToDp(100),
    backgroundColor: "#FFC634",
    position: "absolute",
    height: pxToDp(55),
    left: pxToDp(0),
    zIndex: 99,
  },
  indexTxt: {
    ...appFont.fontFamily_jcyt_700,
    color: "#fff",
    fontSize: pxToDp(28),
    lineHeight: pxToDp(38),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {
    setUser(data) {
      dispatch(actionCreators.setUserInfoNow(data));
    },
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    setModules(data) {
      dispatch(actionCreators.setModules(data));
    },
  };
};
export default connect(mapStateToProps, mapDispathToProps)(homePage);
