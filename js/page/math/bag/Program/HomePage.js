import React, { PureComponent } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  Modal,
  BackHandler,
} from "react-native";
import { pxToDp } from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import NavigationUtil from "../../../../navigator/NavigationUtil";

import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/math/bagProgram/index";
import * as actionCreatorsPurchase from "../../../../action/purchase/index";
import BackBtn from "../../../../component/math/BackBtn";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

const ITEM_BG_MAP = {
  0: require("../../../../images/mathProgramming/item_bg_2.png"),
  1: require("../../../../images/mathProgramming/item_bg_3.png"),
  2: require("../../../../images/mathProgramming/item_bg_4.png"),
};

export const BADGE_MAP = {
  0: require("../../../../images/mathProgramming/badge_1_s.png"),
  1: require("../../../../images/mathProgramming/badge_2_s.png"),
  2: require("../../../../images/mathProgramming/badge_3_s.png"),
  3: require("../../../../images/mathProgramming/badge_4_s.png"),
  4: require("../../../../images/mathProgramming/badge_5_s.png"),
}; //最多重叠5张

class HomePageProgram extends PureComponent {
  constructor() {
    super();
    this.eventListenerRefreshPage = undefined;
    this.state = {
      list: [
        {
          name: "思维训练",
        },
        {
          name: "同步编程",
        },
        {
          name: "拓展编程",
        },
      ],
      currentIndex: 0,
      visible: false,
      name: "",
      concatVisible: true,
    };
  }

  goBack = () => {
    MathNavigationUtil.goBack(this.props);
  };

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    this.backBtnListener && this.backBtnListener.remove();
    this.props.getTaskData()
  }

  componentDidMount() {
    this.getData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshHomePage",
      (event) => {
        this.getData();
      }
    );
  }

  getData = () => {
    const { userInfo, textCode } = this.props;
    const { checkGrade, checkTeam } = userInfo.toJS();
    let _l = JSON.parse(JSON.stringify(this.state.list));
    let params = {
      textbook: textCode,
      grade_code: checkGrade,
      term_code: checkTeam,
    };
    axios.get(api.getProgramHomePageBadge, { params }).then((res) => {
      const data = res.data.data;
      const MAP = {
        ability: 0,
        sync: 1,
        expand: 2,
      };
      for (let i in data) {
        _l[MAP[i]].badge = data[i];
        _l[MAP[i]].badge_show = _l[MAP[i]].badge;
        if (_l[MAP[i]].badge.length > 5)
          _l[MAP[i]].badge_show = _l[MAP[i]].badge.slice(0, 5); //只显示5个
      }
      // console.log('llllll',_l)
      this.setState({
        list: _l,
      });
    });
  };
  selectModule = (i, x, authority) => {
    if (!authority && x !== 0) {
      this.props.setVisible(true);
      return;
    }
    this.setState(
      {
        currentIndex: x,
      },
      () => {
        switch (x) {
          case 0:
            // 编程思维训练
            MathNavigationUtil.toMathProgramThinking({ ...this.props });
            break;
          case 1:
            // 同步编程
            this.props.setSource("1");
            MathNavigationUtil.toMathProgramSyncOrExpand({ ...this.props });
            break;
          case 2:
            // 拓展编程
            this.props.setSource("2");
            MathNavigationUtil.toMathProgramSyncOrExpand({ ...this.props });
            break;
          default:
            Toast.info("敬请期待", 1);
        }
      }
    );
  };
  render() {
    const { list, currentIndex, visible, name, concatVisible } = this.state;
    const { authority } = this.props;
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../../images/mathProgramming/bg_1.png")}
      >
        <View style={[styles.header]}>
          <BackBtn goBack={this.goBack}></BackBtn>
          <TouchableOpacity
            style={[
              styles.help_btn,
              Platform.OS === "ios" ? { top: pxToDp(40) } : null,
              { right: pxToDp(380) },
            ]}
            onPress={() => {
              this.setState({
                concatVisible: true,
              });
            }}
          >
            <Image
              style={[
                {
                  width: pxToDp(35),
                  height: pxToDp(38),
                  marginRight: pxToDp(20),
                },
              ]}
              source={require("../../../../images/mathProgramming/gift_icon.png")}
            ></Image>
            <Text
              style={[
                { color: "#FFDB5D", fontSize: pxToDp(28) },
                appFont.fontFamily_jcyt_500,
              ]}
            >
              领取礼包
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.help_btn,
              Platform.OS === "ios" ? { top: pxToDp(40) } : null,
            ]}
            onPress={() => {
              MathNavigationUtil.toMathProgramSyntaxQuery({ ...this.props });
            }}
          >
            <Image
              style={[
                {
                  width: pxToDp(40),
                  height: pxToDp(40),
                  marginRight: pxToDp(20),
                },
              ]}
              source={require("../../../../images/mathProgramming/book_icon.png")}
            ></Image>
            <Text
              style={[
                { color: "#FFDB5D", fontSize: pxToDp(28) },
                appFont.fontFamily_jcyt_500,
              ]}
            >
              Python语法查询
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_500,
              { fontSize: pxToDp(40), color: "#fff" },
              Platform.OS === "ios" ? { marginTop: pxToDp(40) } : null,
            ]}
          >
            编程
          </Text>
        </View>
        <View style={[styles.content]}>
          {list.map((i, x) => {
            let item_authority = authority;
            if (x === 0) item_authority = true;
            return (
              <TouchableOpacity
                key={x}
                onPress={() => {
                  this.selectModule(i, x, item_authority);
                }}
              >
                <ImageBackground
                  resizeMode="stretch"
                  source={
                    currentIndex === x
                      ? require("../../../../images/mathProgramming/item_bg_1_active.png")
                      : require("../../../../images/mathProgramming/item_bg_1.png")
                  }
                  style={[
                    styles.item,
                    x === list.length - 1 ? { marginRight: 0 } : null,
                  ]}
                  key={x}
                >
                  <View style={[styles.item_inner]}>
                    <View style={[appStyle.flexAliCenter]}>
                      {i.badge && i.badge.length ? (
                        <View style={[appStyle.flexLine]}>
                          {i.badge_show.map((ii, xx) => {
                            return (
                              <Image
                                key={xx}
                                style={[
                                  { width: pxToDp(120), height: pxToDp(140) },
                                  xx > 0 ? { marginLeft: pxToDp(-60) } : null,
                                ]}
                                source={BADGE_MAP[xx]}
                              ></Image>
                            );
                          })}
                        </View>
                      ) : (
                        <Image
                          style={[{ width: pxToDp(120), height: pxToDp(140) }]}
                          source={require("../../../../images/mathProgramming/badge_nodata.png")}
                        ></Image>
                      )}
                      <Text
                        style={[
                          { color: "#fff", fontSize: pxToDp(28) },
                          appFont.fontFamily_jcyt_700,
                          Platform.OS === "ios"
                            ? { marginTop: pxToDp(20) }
                            : null,
                        ]}
                      >
                        已获得{i.badge && i.badge.length ? i.badge.length : 0}
                        个徽章
                      </Text>
                    </View>
                    <Image
                      style={[{ width: pxToDp(560), height: pxToDp(520) }]}
                      source={ITEM_BG_MAP[x]}
                    ></Image>
                    <View
                      style={[
                        styles.btn,
                        !item_authority ? { backgroundColor: "#A9B8CF" } : null,
                      ]}
                    >
                      <View
                        style={[
                          styles.btn_inner,
                          !item_authority
                            ? { backgroundColor: "#DEE4ED" }
                            : null,
                        ]}
                      >
                        <Text
                          style={[
                            { color: "#2D2D40", fontSize: pxToDp(48) },
                            appFont.fontFamily_jcyt_700,
                            !item_authority
                              ? { color: "rgba(45, 45, 64, 0.50)" }
                              : null,
                          ]}
                        >
                          {i.name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          animationType="fade"
          transparent
          visible={visible}
        >
          <View style={[styles.m_container]}>
            <View style={[styles.m_content]}>
              <View style={[styles.m_content_inner]}>
                <Text
                  style={[
                    { color: "#2D2D40", fontSize: pxToDp(48) },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  暂时无法进入
                </Text>
                <View style={[styles.m_wrap]}>
                  <Text
                    style={[
                      { color: "#2D2D40", fontSize: pxToDp(48) },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    需要{name}获得一个徽章哦
                  </Text>
                </View>
              </View>
            </View>
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
                    { color: "#2D2D40", fontSize: pxToDp(48) },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  x
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          animationType="fade"
          transparent
          visible={concatVisible}
        >
          <View style={[styles.m_container]}>
            <View style={[styles.m_content_concat]}>
              <View style={[styles.m_content_inner_concat]}>
                <Image
                  resizeMode="contain"
                  style={{ width: pxToDp(1000), height: pxToDp(700) }}
                  source={require("../../../../images/mathProgram/code.jpg")}
                ></Image>
                <Text
                  style={[
                    { fontSize: pxToDp(36) },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  添加客服微信，领取免费视频包！
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: pxToDp(-10),
                  top: pxToDp(-20),
                }}
                onPress={() => {
                  this.setState({
                    concatVisible: false,
                  });
                }}
              >
                <Image
                  style={[{ width: pxToDp(80), height: pxToDp(80) }]}
                  source={require("../../../../images/children/close_btn_1.png")}
                ></Image>
              </TouchableOpacity>
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
    ...appStyle.flexCenter,
    height: pxToDp(120),
  },
  back_btn: {
    position: "absolute",
    left: pxToDp(20),
    top: pxToDp(20),
    ...appStyle.flexLine,
  },
  help_btn: {
    position: "absolute",
    right: pxToDp(20),
    // width:pxToDp(358),
    height: pxToDp(80),
    paddingLeft: pxToDp(32),
    paddingRight: pxToDp(32),
    backgroundColor: "#474766",
    ...appStyle.flexLine,
    ...appStyle.flexCenter,
    borderRadius: pxToDp(40),
  },
  content: {
    flex: 1,
    ...appStyle.flexLine,
    ...appStyle.flexCenter,
    paddingBottom: Platform.OS === "ios" ? pxToDp(80) : pxToDp(40),
    // backgroundColor:"red"
  },
  item: {
    width: pxToDp(600),
    height: "100%",
    marginRight: pxToDp(40),
    paddingTop: Platform.OS === "android" ? pxToDp(60) : pxToDp(140),
    paddingBottom: Platform.OS === "android" ? pxToDp(60) : pxToDp(140),
  },
  item_inner: {
    ...appStyle.flexAliCenter,
    flex: 1,
    ...appStyle.flexJusBetween,
  },
  btn: {
    width: pxToDp(312),
    height: pxToDp(128),
    borderRadius: pxToDp(200),
    backgroundColor: "#FFB649",
    paddingBottom: pxToDp(8),
  },
  btn_inner: {
    flex: 1,
    backgroundColor: "#FFDB5D",
    borderRadius: pxToDp(200),
    ...appStyle.flexCenter,
  },
  m_container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.80)",
    ...appStyle.flexCenter,
  },
  m_content: {
    // width:pxToDp(784),
    height: pxToDp(356),
    borderRadius: pxToDp(80),
    backgroundColor: "#DAE2F2",
    paddingBottom: pxToDp(8),
  },
  m_content_inner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    ...appStyle.flexAliCenter,
    padding: pxToDp(40),
    paddingBottom: pxToDp(100),
  },
  m_wrap: {
    padding: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
    backgroundColor: "#F5F6FA",
    borderRadius: pxToDp(40),
    marginTop: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
  },
  m_btn: {
    width: pxToDp(270),
    height: pxToDp(128),
    borderRadius: pxToDp(140),
    backgroundColor: "#FFB649",
    paddingBottom: pxToDp(8),
    marginTop: pxToDp(-64),
  },
  m_btn_inner: {
    flex: 1,
    backgroundColor: "#FFDB5D",
    borderRadius: pxToDp(140),
    ...appStyle.flexCenter,
  },
  m_content_concat: {
    // width:pxToDp(784),
    // height:pxToDp(356),
    borderRadius: pxToDp(80),
    backgroundColor: "#DAE2F2",
    paddingBottom: pxToDp(8),
    ...appStyle.flexCenter,
  },
  m_content_inner_concat: {
    width: pxToDp(1000),
    paddingBottom: pxToDp(40),
    backgroundColor: "#fff",
    borderRadius: pxToDp(80),
    ...appStyle.flexCenter,
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    selestModule: state.getIn(["userInfo", "selestModule"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setSource(data) {
      dispatch(actionCreators.setSource(data));
    },
    setVisible(data) {
      dispatch(actionCreatorsPurchase.setVisible(data));
    },
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePageProgram);
