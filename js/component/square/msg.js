import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { appFont, appStyle } from "../../theme";
import { pxToDp, padding_tool } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import { connect } from "react-redux";
import * as actionCreators from "../../action/userInfo/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "antd-mobile-rn";

class Msg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      agreen: false,
      showTip: false,
    };
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.showMsg) {
      AsyncStorage.getItem("agreenCreate").then((value) => {
        if (value) {
          this.setState({
            agreen: JSON.parse(value),
          });
        }
      });
    }
  }

  gotoProtocol = () => {
    const { navigation } = this.props;
    if (Platform.OS === "android") {
      NavigationUtil.toProtocolPage({ navigation, data: { img: "create" } });
    } else {
      NavigationUtil.toProtocolPage({
        navigation,
        data: {
          img: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/create.png",
        },
      });
    }
  };

  render() {
    const { showMsg, onClose, onOk, titleDom, mainDOm, squareType } =
      this.props;
    const { agreen, showTip } = this.state;
    // console.log("titleDom", titleDom);
    return showMsg ? (
      <View style={[styles.mainWrap]}>
        <View style={[styles.containWrap]}>
          <View style={[styles.contain]}>
            <View style={[styles.titleWrap]}>
              {titleDom ? (
                titleDom
              ) : (
                <Text style={[styles.title]}>温馨提示</Text>
              )}
            </View>
            {mainDOm ? (
              mainDOm
            ) : (
              <>
                <View style={[styles.containTxtWrap]}>
                  <Text
                    style={[
                      styles.containTxt,
                      squareType === "parent"
                        ? null
                        : Platform.OS === "ios"
                        ? { marginBottom: pxToDp(15) }
                        : { marginBottom: pxToDp(-30) },
                    ]}
                  >
                    即将开始“AI”创作
                  </Text>
                  {squareType === "parent" ? null : (
                    <Text style={[styles.containTxt]}>
                      请在监护人的陪伴下进行哦
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    appStyle.flexLine,
                    squareType === "parent"
                      ? { marginBottom: pxToDp(20) }
                      : null,
                  ]}
                  onPress={async () => {
                    AsyncStorage.setItem(
                      "agreenCreate",
                      JSON.stringify(!agreen),
                      (error, result) => {
                        if (!error) {
                          this.setState({
                            agreen: !agreen,
                          });
                        }
                      }
                    );
                  }}
                >
                  <Image
                    style={[{ width: pxToDp(60), height: pxToDp(60) }]}
                    resizeMode="stretch"
                    source={
                      agreen
                        ? require("../../images/square/check_icon_2.png")
                        : require("../../images/square/check_icon_1.png")
                    }
                  ></Image>
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(28),
                        color: "#283139",
                        marginLeft: pxToDp(20),
                        marginRight: pxToDp(10),
                      },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    勾选即表示同意
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.gotoProtocol();
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontSize: pxToDp(28),
                          color: "#4B87FF",
                          textDecorationLine: "underline",
                        },
                        appFont.fontFamily_jcyt_500,
                      ]}
                    >
                      《派知识创作协议》
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </>
            )}
            {mainDOm ? (
              <TouchableOpacity
                onPress={() => {
                  onOk();
                }}
                style={[styles.okBtnWrap]}
              >
                <Text style={[styles.okBtnTxt]}>好的</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.okBtnWrap,
                  appStyle.flexLine,
                  { width: pxToDp(376) },
                ]}
                onPress={() => {
                  if (agreen) {
                    onOk();
                  } else {
                    Toast.info("请同意《派知识创作协议》", 2);
                  }
                }}
              >
                <Text
                  style={[
                    styles.okBtnTxt,
                    { marginRight: pxToDp(20), fontSize: pxToDp(36) },
                  ]}
                >
                  立即开始
                </Text>
                <View
                  style={[
                    appStyle.flexLine,
                    styles.coinNumWrap,
                    appStyle.flexCenter,
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: "#FF4848",
                        fontSize: pxToDp(24),
                        marginRight: pxToDp(12),
                      },
                      appFont.fontFamily_jcyt_700,
                    ]}
                  >
                    -80
                  </Text>
                  <Image
                    source={require("../../images/square/paiCoin.png")}
                    style={[{ width: pxToDp(36), height: pxToDp(36) }]}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          {onClose ? (
            <TouchableOpacity onPress={onClose} style={[styles.closeBtnWrap]}>
              <Image
                style={[styles.closeBtn]}
                source={require("../../images/chineseHomepage/sentence/status2.png")}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  containWrap: {
    width: pxToDp(1180),
    height: pxToDp(590),
    justifyContent: "flex-end",
    alignItems: "center",
  },
  contain: {
    width: pxToDp(1100),
    height: pxToDp(560),
    backgroundColor: "#fff",
    borderRadius: pxToDp(70),
    ...padding_tool(28, 32, 28, 32),
    alignItems: "center",
  },
  titleWrap: {
    width: pxToDp(1010),
    minHeight: pxToDp(120),
    backgroundColor: "#E9E5E3",
    borderRadius: pxToDp(40),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(59),
    color: "#283139",
  },
  containTxtWrap: {
    ...padding_tool(30, 0, 85, 0),
    flex: 1,
  },
  containTxt: {
    ...appFont.fontFamily_jcyt_500,
    fontSize: pxToDp(50),
    color: "#283139",
    textAlign: "center",
  },
  okBtnWrap: {
    width: pxToDp(405),
    height: pxToDp(115),
    borderRadius: pxToDp(40),
    backgroundColor: "#FF9B48",
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    alignItems: "center",
    justifyContent: "center",
  },
  okBtnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(59),
    color: "#fff",
  },
  closeBtn: {
    width: pxToDp(100),
    height: pxToDp(100),
  },
  closeBtnWrap: {
    position: "absolute",
    top: pxToDp(0),
    right: pxToDp(0),
  },
  coinNumWrap: {
    width: pxToDp(122),
    height: pxToDp(56),
    backgroundColor: "rgba(255, 238, 196, 0.50)",
    borderRadius: pxToDp(100),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    squareType: state.getIn(["userInfo", "squareType"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setPlanIndex(data) {
      dispatch(actionCreators.setPlanIndex(data));
    },
    setSelestModuleAuthority(data) {
      dispatch(actionCreators.setSelestModuleAuthority(data));
    },
    setSelectModule(data) {
      dispatch(actionCreators.setSelectModule(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(Msg);
