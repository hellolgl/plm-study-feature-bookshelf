import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground,
  DeviceEventEmitter,
  Dimensions,
  Modal,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp } from "../../../../util/tools";
import CircleChart from "./components/CircleChart";
import TIME_MAP from "./TIME_MAP";
import { appFont, appStyle } from "../../../../theme";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weekDay: "",
      month: "",
      day: "",
      modular1: {},
      modular2: {},
      visible: false,
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.props.getTaskData()
  }

  componentDidMount() {
    this.getData();
    this.getNowTime();
    this.getDatamodularTwo();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (type) => {
        switch (type) {
          case "modular1":
            this.getData();
            break;
          case "modular2":
            this.getDatamodularTwo();
            break;
        }
      }
    );
  }

  getData() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    axios.get(api.getSentencesStatistics, { params: data }).then((res) => {
      this.setState({
        modular1: res.data.data,
      });
    });
  }

  getDatamodularTwo() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    axios.get(api.getEngCartoonStatistics, { params: data }).then((res) => {
      this.setState({
        modular2: res.data.data,
      });
    });
  }

  getNowTime = () => {
    let myDate = new Date();
    let date = myDate.format("yyyy-MM-dd");
    let weekDay = TIME_MAP.DAY_OF_WEEK_MAP[myDate.getDay()];
    let month = TIME_MAP.MONTH_MAP[date.slice(5, 7)];
    let day = TIME_MAP.DAY_MAP[date.slice(8, 11)];
    this.setState({
      weekDay,
      month,
      day,
    });
  };

  renderBarContent = (modular) => {
    return (
      <View style={[appStyle.flexAliCenter]}>
        <CircleChart
          backgroundColor={"#EDEDF5"}
          tintColor={modular.correct_rate < 75 ? "#FF7D78" : "#60E093"}
          percentTxtStyle={{
            color: "#445368",
            fontSize: pxToDp(29),
            ...appFont.fontFamily_jcyt_700,
          }}
          size={142}
          width={pxToDp(34)}
          total={modular.correct_rate + "%"}
          right={modular.correct_rate}
        ></CircleChart>
        <View
          style={[
            appStyle.flexLine,
            Platform.OS === "android" ? { marginTop: pxToDp(-20) } : null,
          ]}
        >
          <View style={[appStyle.flexAliCenter, { marginRight: pxToDp(67) }]}>
            <Text style={[styles.txt_num]}>{modular.sum_num}</Text>
            <Text style={[styles.txt_grey]}>Total</Text>
          </View>
          <View style={[appStyle.flexAliCenter]}>
            <Text style={[styles.txt_num]}>{modular.sum_correct_num}</Text>
            <Text style={[styles.txt_grey]}>Correct</Text>
          </View>
        </View>
      </View>
    );
  };

  renderBadge = () => {
    const { modular1 } = this.state;
    const { correct_rate } = modular1;
    if (correct_rate < 60) {
      return null;
    }
    if (correct_rate >= 60 && correct_rate < 75) {
      return (
        <>
          <Image
            style={[styles.badge_img]}
            source={require("../../../../images/EN_Sentences/badge_tong.png")}
          ></Image>
          <Text style={[styles.badge_txt]}>Bronze</Text>
        </>
      );
    } else if (correct_rate >= 75 && correct_rate < 85) {
      return (
        <>
          <Image
            style={[styles.badge_img]}
            source={require("../../../../images/EN_Sentences/badge_yin.png")}
          ></Image>
          <Text style={[styles.badge_txt]}>Silver</Text>
        </>
      );
    } else {
      return (
        <>
          <Image
            style={[styles.badge_img]}
            source={require("../../../../images/EN_Sentences/badge_jin.png")}
          ></Image>
          <Text style={[styles.badge_txt]}>Gold</Text>
        </>
      );
    }
  };

  start = (key) => {
    switch (key) {
      case "english_Sentences_LearnToday":
        // Learn Today
        NavigationUtil.toEnSentencesLearnTodayHomePage({ ...this.props });
        break;
      case "english_Sentences_LearnWithFriends":
        // Learn With Friends
        NavigationUtil.toEnSentencesLearnWidthFriendsHomePage({
          ...this.props,
        });
        break;
    }
  };
  render() {
    const { weekDay, month, day, modular1, modular2, visible } = this.state;
    return (
      <ImageBackground
        style={[styles.container]}
        source={
          Platform.OS === "android"
            ? require("../../../../images/EN_Sentences/bg_1_a.png")
            : require("../../../../images/EN_Sentences/bg_1_i.png")
        }
      >
        <View
          style={[
            styles.header,
            Platform.OS === "ios" ? { paddingTop: pxToDp(60) } : null,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back_btn,
              Platform.OS === "ios" ? { top: pxToDp(40) } : null,
            ]}
            onPress={this.goBack}
          >
            <Image
              resizeMode="stretch"
              style={[{ width: pxToDp(120), height: pxToDp(80) }]}
              source={require("../../../../images/childrenStudyCharacter/back_btn_1.png")}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rule_btn,
              Platform.OS === "ios" ? { top: pxToDp(40) } : null,
            ]}
            onPress={() => {
              this.setState({
                visible: true,
              });
            }}
          >
            <Text
              style={[
                { color: "#fff", fontSize: pxToDp(38) },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              规则
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              { color: "#445368", fontSize: pxToDp(58) },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            Grammar
          </Text>
        </View>
        <View style={[styles.content]}>
          <Image
            style={[{ width: pxToDp(794), height: pxToDp(871) }]}
            source={require("../../../../images/EN_Sentences/bg_2.png")}
          ></Image>
          <View style={[styles.right]}>
            <TouchableOpacity
              style={[styles.item1]}
              onPress={() => {
                this.start("english_Sentences_LearnToday");
              }}
            >
              <View style={[styles.item1Left]}>
                <View>
                  <Text style={[styles.txt1]}>Learn Today</Text>
                  <View
                    style={[
                      appStyle.flexLine,
                      Platform.OS === "android"
                        ? { marginTop: pxToDp(-20) }
                        : { marginTop: pxToDp(20) },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color: "#ACB2BC",
                          fontSize: pxToDp(34),
                          marginRight: pxToDp(10),
                        },
                        appFont.fontFamily_jcyt_500,
                      ]}
                    >
                      {weekDay} {month} {day}
                    </Text>
                    <Text
                      style={[
                        { color: "#ACB2BC", fontSize: pxToDp(34) },
                        appFont.fontFamily_jcyt_700,
                        Platform.OS === "ios"
                          ? { lineHeight: pxToDp(48) }
                          : null,
                      ]}
                    >
                      {modular1.complete_days}{" "}
                      {modular1.complete_days > 1 ? "Days" : "Day"}
                    </Text>
                  </View>
                </View>
                <View>
                  {Object.keys(modular1).length > 0
                    ? this.renderBarContent(modular1)
                    : null}
                </View>
              </View>
              <View style={[appStyle.flexAliCenter]}>{this.renderBadge()}</View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.item]}
              onPress={() => {
                this.start("english_Sentences_LearnWithFriends");
              }}
            >
              <View style={[styles.item_inner]}>
                <View style={[styles.item_inner_left]}>
                  <Text style={[styles.txt1]}>Learn with Friends</Text>
                </View>
                <View>
                  {Object.keys(modular2).length > 0
                    ? this.renderBarContent(modular2)
                    : null}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          animationType="fade"
          transparent
          visible={visible}
        >
          <View style={[styles.m_container]}>
            <View style={[styles.m_content]}>
              <Text
                style={[
                  {
                    color: "#445368",
                    fontSize: pxToDp(50),
                    textAlign: "center",
                    marginBottom: pxToDp(40),
                  },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                规则说明
              </Text>
              <Text style={[styles.m_txt]}>
                本模块中每一道题目的答题情况都会影响相关统计。
              </Text>
              <Text
                style={[
                  {
                    fontSize:
                      Platform.OS === "android" ? pxToDp(32) : pxToDp(42),
                    color: "#4C4C59",
                  },
                  appFont.fontFamily_jcyt_700,
                  Platform.OS === "ios" ? { marginTop: pxToDp(20) } : null,
                ]}
              >
                Learn Today模块:
              </Text>
              <Text style={[styles.m_txt]}>
                当答题正确率大于等于85%时，获得金徽章。
              </Text>
              <Text style={[styles.m_txt]}>
                当答题正确率为75%（含）- 85%之间时，获得银徽章。
              </Text>
              <Text style={[styles.m_txt]}>
                当答题正确率为60%（含）- 75%之间时，获得铜徽章。
              </Text>
              <Text style={[styles.m_txt]}>
                当答题正确率小于60%时，没有徽章。
              </Text>
              <Text
                style={[
                  {
                    fontSize:
                      Platform.OS === "android" ? pxToDp(32) : pxToDp(42),
                    color: "#4C4C59",
                  },
                  appFont.fontFamily_jcyt_700,
                  Platform.OS === "ios" ? { marginTop: pxToDp(20) } : null,
                ]}
              >
                Learn Today和Learn with Friends模块:
              </Text>
              <Text style={[styles.m_txt]}>
                当正确率大于等于75%时，统计为绿色。
              </Text>
              <Text style={[styles.m_txt]}>
                当正确率小于75%时，统计为红色（需要继续加油哦）。
              </Text>
              <View style={[appStyle.flexCenter, { marginTop: pxToDp(40) }]}>
                <TouchableOpacity
                  style={[styles.m_btn]}
                  onPress={() => {
                    this.setState({
                      visible: false,
                    });
                  }}
                >
                  <View style={[styles.m_btn_inner]}>
                    <Text
                      style={[
                        { color: "#fff", fontSize: pxToDp(50) },
                        appFont.fontFamily_jcyt_700,
                      ]}
                    >
                      好的
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <CoinView></CoinView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "relative",
    ...appStyle.flexCenter,
    ...appStyle.flexLine,
  },
  back_btn: {
    position: "absolute",
    left: pxToDp(40),
  },
  rule_btn: {
    width: pxToDp(120),
    height: pxToDp(80),
    borderRadius: pxToDp(60),
    backgroundColor: "#FF8F32",
    position: "absolute",
    right: pxToDp(40),
    ...appStyle.flexCenter,
  },
  content: {
    flex: 1,
    ...appStyle.flexCenter,
    ...appStyle.flexLine,
    paddingLeft: pxToDp(84),
    paddingRight: pxToDp(97),
  },
  right: {
    flex: 1,
    marginLeft: pxToDp(26),
  },
  item1: {
    height: pxToDp(273),
    backgroundColor: "#B66FFF",
    borderRadius: pxToDp(80),
    marginBottom: pxToDp(92),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
  },
  item1Left: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    ...appStyle.flexLine,
    paddingLeft: pxToDp(60),
    paddingRight: pxToDp(60),
    ...appStyle.flexJusBetween,
  },
  item: {
    height: pxToDp(273),
    backgroundColor: "#E8E6ED",
    paddingBottom: pxToDp(10),
    borderRadius: pxToDp(80),
  },
  item_inner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
    paddingRight: pxToDp(60),
  },
  item_inner_left: {
    paddingLeft: pxToDp(60),
    // backgroundColor:'pink'
  },
  txt1: {
    color: "#445368",
    fontSize: pxToDp(63),
    ...appFont.fontFamily_jcyt_700,
    ...(Platform.OS === "android"
      ? { marginTop: pxToDp(-40) }
      : { lineHeight: pxToDp(73) }),
  },
  txt2: {
    color: "#445368",
    fontSize: pxToDp(33),
    ...appFont.fontFamily_jcyt_700,
  },
  txt3: {
    color: "#ACB2BC",
    fontSize: pxToDp(29),
    ...appFont.fontFamily_jcyt_500,
  },
  modular1: {
    position: "relative",
    width: pxToDp(580),
    height: pxToDp(925),
    marginTop: pxToDp(28),
  },
  modular2: {
    width: pxToDp(580),
    height: pxToDp(950),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  badge_img: {
    width: pxToDp(104),
    height: pxToDp(104),
  },
  badge_txt: {
    fontSize: pxToDp(40),
    color: "#fff",
    ...appFont.fontFamily_jcyt_700,
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
  },
  txt_num: {
    fontSize: pxToDp(33),
    color: "#445368",
    ...appFont.fontFamily_jcyt_700,
    ...(Platform.OS === "android" ? { marginBottom: pxToDp(-20) } : {}),
  },
  txt_grey: {
    fontSize: pxToDp(29),
    color: "#ACB2BC",
    ...appFont.fontFamily_jcyt_500,
  },
  m_container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    ...appStyle.flexCenter,
  },
  m_content: {
    padding: pxToDp(40),
    borderRadius: pxToDp(80),
    backgroundColor: "#fff",
  },
  m_btn: {
    width: pxToDp(220),
    height: pxToDp(140),
    paddingBottom: pxToDp(10),
    backgroundColor: "#FF741D",
    borderRadius: pxToDp(80),
  },
  m_btn_inner: {
    flex: 1,
    borderRadius: pxToDp(80),
    backgroundColor: "#FF8F32",
    ...appStyle.flexCenter,
  },
  m_txt: {
    fontSize: Platform.OS === "android" ? pxToDp(32) : pxToDp(42),
    color: "#4C4C59",
    ...appFont.fontFamily_jcyt_500,
  },
  badgeWrap: {
    width: pxToDp(273),
    height: pxToDp(273),
    backgroundColor: "#B66FFF",
    position: "absolute",
    right: 0,
    zIndex: -1,
    borderRadius: pxToDp(80),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
