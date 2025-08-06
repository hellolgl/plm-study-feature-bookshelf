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
  Modal,
  BackHandler,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  pxToDpHeight,
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import CircleStatistcs from "../../../../component/circleStatistcs";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { Toast } from "antd-mobile-rn";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import BackBtn from "../../../../component/math/BackBtn";
import HomeNavigationUtil from "../../../../navigator/NavigationUtil";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

const BADGE_IMG_MAP = {
  0: require("../../../../images/MathEasyCalculation/badge_0.png"),
  1: require("../../../../images/MathEasyCalculation/badge_1.png"),
  2: require("../../../../images/MathEasyCalculation/badge_2.png"),
  3: require("../../../../images/MathEasyCalculation/badge_3.png"),
  4: require("../../../../images/MathEasyCalculation/badge_4.png"),
  5: require("../../../../images/MathEasyCalculation/badge_5.png"),
  6: require("../../../../images/MathEasyCalculation/badge_6.png"),
  7: require("../../../../images/MathEasyCalculation/badge_7.png"),
  8: require("../../../../images/MathEasyCalculation/badge_8.png"),
  9: require("../../../../images/MathEasyCalculation/badge_9.png"),
  10: require("../../../../images/MathEasyCalculation/badge_10.png"),
  11: require("../../../../images/MathEasyCalculation/badge_11.png"),
  12: require("../../../../images/MathEasyCalculation/badge_12.png"),
};

class EasyCalculationHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.state = {
      list: [],
      wrong_count: 0,
      visible: false,
      levelList: [],
      levelIndex: -1,
      item: {},
    };
  }
  componentDidMount() {
    this.getData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getData();
      }
    );
  }

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.backBtnListener && this.backBtnListener.remove();
    this.props.getTaskData()
  }

  getData = () => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
    };
    axios.get(api.getExpandType, { params: obj }).then((res) => {
      // console.log('LLLLLLL',res.data.data)
      this.setState({
        list: res.data.data.expand_data,
        wrong_count: res.data.data.wrong_count,
      });
    });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  startStudy = (item, x) => {
    const authority = this.props.authority;
    if (x > 0 && !authority) {
      this.props.setVisible(true);
      return;
    }
    MathNavigationUtil.toEasyCalculationStudyPage({
      ...this.props,
      data: { ...item },
    });
  };

  selectLevel = (i, x) => {
    const authority = this.props.authority;
    if (x > 0 && !authority) {
      this.props.setVisible(true);
      return;
    }
    let levelList = [];
    for (let j = 0; j < i.max_level; j++) {
      levelList.push({
        badgeImg: BADGE_IMG_MAP[j + 1],
      });
    }
    this.setState({
      visible: true,
      levelIndex: -1,
      levelList,
      item: i,
    });
  };

  render() {
    const { list, wrong_count, visible, levelList, levelIndex, item } =
      this.state;
    const authority = this.props.authority;
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
      >
        <BackBtn goBack={this.goBack}></BackBtn>
        <Text style={[styles.header]}>巧算</Text>
        <View style={[styles.content]}>
          {list.length === 0 ? (
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
              <ScrollView contentContainerStyle={[styles.scrollView]}>
                {list.map((i, x) => {
                  return (
                    <View style={[styles.item]} key={x}>
                      {x === 0 && !authority ? (
                        <View
                          style={[
                            {
                              position: "absolute",
                              zIndex: 1,
                              top: pxToDp(-20),
                              right: pxToDp(-20),
                            },
                          ]}
                        >
                          <FreeTag></FreeTag>
                        </View>
                      ) : null}
                      <Text
                        style={[
                          {
                            color: "#4C4C59",
                            fontSize: pxToDp(42),
                            marginBottom: pxToDp(20),
                          },
                          appFont.fontFamily_jcyt_700,
                        ]}
                      >
                        {i.expand_name}
                      </Text>
                      <TouchableOpacity
                        style={[appStyle.flexAliCenter]}
                        onPress={() => {
                          this.selectLevel(i, x);
                        }}
                      >
                        {i.now_level === i.max_level &&
                        i.expand_level === i.max_level ? (
                          <Image
                            resizeMode="stretch"
                            style={[styles.light_bg]}
                            source={require("../../../../images/MathEasyCalculation/light_bg.png")}
                          ></Image>
                        ) : null}
                        <Image
                          resizeMode="stretch"
                          style={[
                            styles.badge_img,
                            Platform.OS === "ios"
                              ? { marginBottom: pxToDp(20) }
                              : null,
                          ]}
                          source={
                            i.now_level === 0
                              ? BADGE_IMG_MAP[i.expand_level]
                              : BADGE_IMG_MAP[i.now_level]
                          }
                        ></Image>
                        {i.now_level === 0 ? (
                          <Text
                            style={[
                              { color: "#E49443", fontSize: pxToDp(40) },
                              appFont.fontFamily_jcyt_700,
                            ]}
                          >
                            等级{i.expand_level}/{i.max_level}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              { color: "#E49443", fontSize: pxToDp(40) },
                              appFont.fontFamily_jcyt_700,
                            ]}
                          >
                            等级{i.now_level}/{i.max_level}
                          </Text>
                        )}
                        <View
                          style={[
                            styles.triangle,
                            Platform.OS === "ios"
                              ? { marginTop: pxToDp(20) }
                              : null,
                          ]}
                        ></View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btn_wrap]}
                        onPress={() => {
                          this.startStudy(i, x);
                        }}
                      >
                        <View
                          style={[styles.btn_wrap_inner, appStyle.flexCenter]}
                        >
                          <Text
                            style={[
                              { color: "#fff", fontSize: pxToDp(40) },
                              appFont.fontFamily_jcyt_700,
                            ]}
                          >
                            学习
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={[appStyle.flexLine, { marginTop: pxToDp(30) }]}
                      >
                        <View
                          style={[
                            { marginRight: pxToDp(68) },
                            appStyle.flexCenter,
                          ]}
                        >
                          <Text style={[styles.txt_1]}>
                            {i.answer_count
                              ? i.right_count + "/" + i.answer_count
                              : "0/0"}
                          </Text>
                          <Text
                            style={[
                              styles.txt_2,
                              Platform.OS === "android"
                                ? { marginTop: pxToDp(-20) }
                                : null,
                            ]}
                          >
                            答题数
                          </Text>
                        </View>
                        <View style={[appStyle.flexCenter]}>
                          <Text style={[styles.txt_1]}>
                            {i.answer_count
                              ? Math.round(
                                  (Number(i.right_count) /
                                    Number(i.answer_count)) *
                                    100
                                )
                              : 0}
                            %
                          </Text>
                          <Text
                            style={[
                              styles.txt_2,
                              Platform.OS === "android"
                                ? { marginTop: pxToDp(-20) }
                                : null,
                            ]}
                          >
                            正确率
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
        </View>
        <Modal
          animationType="fade"
          transparent
          visible={visible}
          supportedOrientations={["portrait", "landscape"]}
        >
          <View style={[styles.m_container]}>
            <View style={[styles.m_content]}>
              <TouchableOpacity
                style={[
                  {
                    position: "absolute",
                    top: pxToDp(40),
                    right: pxToDp(40),
                    zIndex: 1,
                  },
                ]}
                onPress={() => {
                  this.setState({
                    visible: false,
                    levelIndex: -1,
                  });
                }}
              >
                <Image
                  style={[{ width: pxToDp(80), height: pxToDp(80) }]}
                  source={require("../../../../images/EN_Sentences/close_btn_1.png")}
                ></Image>
              </TouchableOpacity>
              <Text
                style={[
                  {
                    color: "#4C4C59",
                    fontSize: pxToDp(48),
                    textAlign: "center",
                  },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                选择等级
              </Text>
              <ScrollView
                contentContainerStyle={{
                  ...appStyle.flexLine,
                  ...appStyle.flexLineWrap,
                  ...appStyle.flexJusBetween,
                  paddingRight: pxToDp(80),
                  paddingLeft: pxToDp(80),
                }}
              >
                {levelList.map((i, x) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.m_item,
                        levelIndex === x ? { borderColor: "#00B295" } : null,
                      ]}
                      key={x}
                      onPress={() => {
                        this.setState(
                          {
                            levelIndex: x,
                            visible: false,
                          },
                          () => {
                            MathNavigationUtil.toEasyCalculationStudyPage({
                              ...this.props,
                              data: { ...item, seleceLevel: x + 1 },
                            });
                          }
                        );
                      }}
                    >
                      <Image
                        style={[{ width: pxToDp(240), height: pxToDp(280) }]}
                        resizeMode="stretch"
                        source={i.badgeImg}
                      ></Image>
                      <Text
                        style={[
                          { color: "#4C4C59", fontSize: pxToDp(40) },
                          appFont.fontFamily_jcyt_700,
                        ]}
                      >
                        等级{x + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
    paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(60),
  },
  header: {
    textAlign: "center",
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#246666",
    marginBottom: pxToDp(40),
  },
  scrollView: {
    paddingBottom: pxToDp(160),
    ...appStyle.flexTopLine,
    ...appStyle.flexLineWrap,
    paddingLeft: pxToDp(264),
    paddingRight: pxToDp(224),
    paddingTop: pxToDp(20),
  },
  item: {
    width: pxToDp(480),
    borderRadius: pxToDp(40),
    backgroundColor: "#fff",
    marginRight: pxToDp(40),
    marginBottom: pxToDp(40),
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(40),
    ...appStyle.flexAliCenter,
  },
  light_bg: {
    width: pxToDp(480),
    height: pxToDp(480),
    position: "absolute",
    top: pxToDp(-60),
  },
  badge_img: {
    width: pxToDp(240),
    height: pxToDp(280),
  },
  btn_wrap: {
    width: pxToDp(400),
    height: pxToDp(100),
    backgroundColor: "#00836D",
    borderRadius: pxToDp(50),
    paddingBottom: pxToDp(5),
    marginTop: pxToDp(20),
  },
  btn_wrap_inner: {
    width: pxToDp(400),
    height: "100%",
    backgroundColor: "#00B295",
    borderRadius: pxToDp(50),
  },
  txt_1: {
    color: "#6B6B77",
    fontSize: pxToDp(36),
    ...appFont.fontFamily_jcyt_700,
  },
  txt_2: {
    color: "#A8A8AF",
    fontSize: pxToDp(24),
    ...appFont.fontFamily_jcyt_500,
  },
  triangle: {
    width: 0,
    height: 0,
    borderWidth: pxToDp(10),
    borderTopColor: "#E49443",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  m_container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    ...appStyle.flexCenter,
  },
  m_content: {
    width: pxToDp(1100),
    height: "85%",
    padding: pxToDp(40),
    paddingLeft: pxToDp(0),
    paddingRight: pxToDp(0),
    borderRadius: pxToDp(80),
    backgroundColor: "#fff",
  },
  m_item: {
    ...appStyle.flexAliCenter,
    marginBottom: pxToDp(20),
    padding: pxToDp(20),
    borderWidth: pxToDp(8),
    borderRadius: pxToDp(40),
    borderColor: "transparent",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    selestModule: state.getIn(["userInfo", "selestModule"]),
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
)(EasyCalculationHomePage);
