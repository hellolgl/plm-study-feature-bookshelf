import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  Platform,
  ActivityIndicator,
  DeviceEventEmitter,
  ScrollView,
} from "react-native";
import { pxToDp, size_tool } from "../tools";
import { appFont, appStyle } from "../../theme";
import { connect } from "react-redux";
import * as actionCreators from "../../action/userInfo/index";
import axios from "../http/axios";
import api from "../http/api";
import QRcodePay from "./QRcodePay";
import _ from "lodash";
import * as IAP from "react-native-iap";
import { Toast } from "antd-mobile-rn";

const product_des_map = {
  1: {
    bg: require("./img/item_month_bg.png"),
    title: "会员月卡",
    price_color: "#4EA776",
    border_color: "#7DDDC4",
    price_color_rate: "#8CE3C2",
  },
  12: {
    bg: require("./img/item_year_bg.png"),
    title: "会员年卡",
    price_color: "#B67B51",
    border_color: "#FFB649",
    price_color_rate: "#FFCD8E",
  },
};

const grade_code_map = {
  "01": "一",
  "02": "二",
  "03": "三",
  "04": "四",
  "05": "五",
  "06": "六",
};

class PurchaseModal extends Component {
  constructor(props) {
    super(props);
    this.purchaseUpdatedListener = null;
    this.purchaseErrorSubscription = null;
    this.handleBuyEventThrottled = _.throttle(this.buyEvent, 1 * 1000, {
      trailing: false,
    });
    this.buyInfo = {};
    this.state = {
      list: [],
      current_index: -1,
      loading: true,
      talk_txt: "",
      panda_bg: "",
      show: false,
    };
  }

  updateData = () => {
    const userInfo = this.props.userInfo.toJS();
    const { checkGrade, checkTeam, isGrade } = userInfo;
    let params = {
      grade_code: checkGrade,
      term_code: checkTeam,
    };
    axios.post(api.getHomepageConfig, params).then((res) => {
      let lock = res.data.data.lock;
      let module = res.data.data.module;
      this.props.setPurchaseModule(module);
      if (isGrade) {
        // 小学
        this.props.setLockPrimarySchool(lock);
      } else {
        //  幼小
        this.props.setLockYoung(lock);
      }
      this.props.setSelestModuleAuthority();
      this.onClose();
    });
  };

  onShow = () => {
    const userInfo = this.props.userInfo.toJS();
    const { isGrade } = userInfo;
    axios
      .get(api.getGoodsList)
      .then((res) => {
        let list = res.data.data;
        if (list.length > 0) {
          let current_index = 0;
          let item = list[current_index];
          if (isGrade) {
            this.setTalkTxt(item);
            this.setState({
              panda_bg: require("./img/panda_1.png"),
            });
          } else {
            this.setState({
              talk_txt: "解锁幼小衔接所有模块。",
              panda_bg: require("./img/panda_2.png"),
            });
          }
          this.setState({
            list,
            current_index,
          });
        } else {
          this.setState({
            list: [],
            current_index: -1,
          });
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });

    if (Platform.OS === "ios") this.iapConnectionInit();
  };

  onClose = () => {
    if (Platform.OS === "ios") {
      this.closeConnection();
      this.setState({
        showLoading: false,
      });
    }
    this.props.onClose();
  };

  setTalkTxt = (value) => {
    const { grade } = value;
    let grade_list = _.sortBy(_.uniq(grade));
    let grade_txt = "所有年级";
    if (grade_list.length !== 6) {
      grade_txt =
        grade_list
          .map((i, x) => {
            if (x === grade_list.length - 1) return grade_code_map[i];
            return grade_code_map[i] + "、";
          })
          .join("") + "年级";
    }
    this.setState({
      talk_txt: `解锁${grade_txt}对应模块`,
    });
  };

  selectProduct = (i, x) => {
    this.setState(
      {
        current_index: x,
      },
      () => {
        const userInfo = this.props.userInfo.toJS();
        const { isGrade } = userInfo;
        if (isGrade) this.setTalkTxt(i);
      }
    );
  };

  toPay = () => {
    if (Platform.OS === "android") {
      this.setState({
        show: true,
      });
    } else {
      this.setState({
        showLoading: true,
      });
      this.requestSubscription();
    }
  };

  closeQrcodePay = () => {
    this.updateData();
    this.setState({
      show: false,
    });
  };

  //ios支付
  iapConnectionInit = () => {
    console.log("init listener...");
    // 初始化 IAP 相关步骤
    IAP.initConnection()
      .catch(() => {
        console.log("err connected to store...");
      })
      .then(() => {
        console.log("connected to store...");
        this.purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
          Toast.info("购买异常，请稍后重试！");
          this.setState({
            showLoading: false,
          });
        });
        this.purchaseUpdatedListener = IAP.purchaseUpdatedListener(
          async (purchase) => {
            try {
              await IAP.finishTransaction({ purchase });
              const { transactionId, transactionReceipt } = purchase;
              this.buyInfo = {
                transactionId,
                transactionReceipt,
              };
              this.handleBuyEventThrottled();
            } catch (error) {
              console.log(`发生异常: ${error.message}`);
            }
          }
        );
      });
  };

  closeConnection = () => {
    console.log("close listener...");
    if (this.purchaseUpdatedListener) {
      this.purchaseUpdatedListener.remove();
      this.purchaseUpdatedListener = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  };

  buyEvent = () => {
    const { transactionId, transactionReceipt } = this.buyInfo;
    const { list, current_index } = this.state;
    const now_product = list[current_index];
    const { iap_id } = now_product;
    const data = {
      receipt_data: transactionReceipt,
      iap_id,
      transaction_id: transactionId,
    };
    console.log("buyEvent: ___________________", data);
    // 向后端发送苹果支付成功订单信息
    axios
      .post("/apple_payment_blue/apple_pay_launch", data, { timeout: 20000 })
      .then((res) => {
        this.setState(
          {
            showLoading: false,
          },
          () => {
            const { index } = this.props;
            setTimeout(() => {
              // DeviceEventEmitter.emit("refreshHomePage",index); //首页刷新
              // Toast.info("您已成功完成购买!")
              this.updateData();
            }, 500);
          }
        );
      })
      .catch((err) => {
        console.log("ERROR: ", JSON.stringify(err));
        this.setState(
          {
            showLoading: false,
          },
          () => {
            Toast.info("购买失败，请求超时");
          }
        );
      });
  };

  requestSubscription = async () => {
    const { list, current_index } = this.state;
    const now_product = list[current_index];
    const { iap_id } = now_product;
    try {
      const items = Platform.select({
        ios: [iap_id],
        android: [""],
      });
      // console.log("items: ", items)
      await IAP.getProducts({ skus: items });
      console.log("PRODUCT ID: ", iap_id);
      await IAP.requestSubscription({ sku: iap_id });
    } catch (err) {
      console.log("ERROR requestSubscription");
      this.setState({
        showLoading: false,
      });
    }
  };

  render() {
    const { visible } = this.props;
    const {
      list,
      current_index,
      loading,
      talk_txt,
      panda_bg,
      show,
      showLoading,
    } = this.state;
    let now_product = {};
    if (current_index > -1) now_product = list[current_index];
    return (
      <View>
        <Modal
          animationType="fade"
          transparent
          maskClosable={false}
          visible={visible}
          onShow={this.onShow}
        >
          <View style={[styles.wrap]}>
            {showLoading ? (
              <View style={[{ position: "absolute", zIndex: 999 }]}>
                <ActivityIndicator size="large" color="#4F99FF" />
              </View>
            ) : null}
            <View style={styles.content}>
              <View
                style={[
                  {
                    paddingLeft: pxToDp(40),
                    paddingRight: pxToDp(40),
                    paddingTop: pxToDp(160),
                    paddingBottom: pxToDp(40),
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.closebtn]}
                  onPress={this.onClose}
                >
                  <Image
                    resizeMode="contain"
                    style={[{ width: pxToDp(80), height: pxToDp(80) }]}
                    source={require("./img/close_btn.png")}
                  ></Image>
                </TouchableOpacity>
                {loading ? (
                  <ActivityIndicator size="large" color="#4F99FF" />
                ) : (
                  <>
                    <View style={[styles.panda_wrap]}>
                      <Image
                        style={[{ width: pxToDp(200), height: pxToDp(200) }]}
                        source={panda_bg}
                      ></Image>
                      <View style={[appStyle.flexLine]}>
                        <View style={[styles.triangle_left]}></View>
                        <View style={[styles.talk_wrap]}>
                          <Text
                            style={[
                              appFont.fontFamily_jcyt_500,
                              { color: "#fff", fontSize: pxToDp(36) },
                            ]}
                          >
                            {talk_txt}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[appStyle.flexLine]}>
                      <ScrollView horizontal={true}>
                        {list.map((i, x) => {
                          const des = product_des_map[i.num];
                          return (
                            <TouchableOpacity
                              style={[
                                x === list.length - 1
                                  ? null
                                  : { marginRight: pxToDp(40) },
                                styles.item,
                                x === current_index
                                  ? { borderColor: des.border_color }
                                  : null,
                              ]}
                              key={x}
                              onPress={() => {
                                this.selectProduct(i, x);
                              }}
                            >
                              <ImageBackground
                                style={[styles.item_bg]}
                                source={des.bg}
                              >
                                <Text
                                  style={[
                                    appFont.fontFamily_jcyt_700,
                                    { color: "#475266", fontSize: pxToDp(60) },
                                    Platform.OS === "android"
                                      ? { marginTop: pxToDp(-20) }
                                      : { marginBottom: pxToDp(40) },
                                  ]}
                                >
                                  {des.title}
                                </Text>
                                <Text
                                  style={[
                                    appFont.fontFamily_jcyt_500,
                                    { color: "#475266", fontSize: pxToDp(32) },
                                  ]}
                                >
                                  {i.introduction}
                                </Text>
                                <View
                                  style={[
                                    appStyle.flexEnd,
                                    appStyle.flexLine,
                                    { marginTop: pxToDp(20) },
                                  ]}
                                >
                                  {i.rate ? (
                                    <Text
                                      style={[
                                        {
                                          color: des.price_color,
                                          fontSize: pxToDp(28),
                                          marginRight: pxToDp(16),
                                          textDecorationLine: "line-through",
                                        },
                                        appFont.fontFamily_jcyt_500,
                                      ]}
                                    >
                                      {i.app_price}元
                                    </Text>
                                  ) : null}
                                  <View
                                    style={[
                                      appStyle.flexLine,
                                      styles.price_wrap,
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        {
                                          color: des.price_color_rate,
                                          fontSize: pxToDp(48),
                                          marginRight: pxToDp(10),
                                        },
                                        appFont.fontFamily_jcyt_700,
                                      ]}
                                    >
                                      {i.rate ? i.iap_price : i.app_price}
                                    </Text>
                                    <Text
                                      style={[
                                        {
                                          color: des.price_color_rate,
                                          fontSize: pxToDp(28),
                                        },
                                        appFont.fontFamily_jcyt_700,
                                      ]}
                                    >
                                      元
                                    </Text>
                                  </View>
                                </View>
                              </ImageBackground>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </>
                )}
              </View>
              {loading || current_index === -1 ? null : (
                <View style={[styles.footer]}>
                  <View style={[appStyle.flexLine]}>
                    <View
                      style={[appStyle.flexAliEnd, { marginRight: pxToDp(40) }]}
                    >
                      <View style={[appStyle.flexTopLine]}>
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_500,
                            {
                              color: "rgba(0, 0, 0, 0.50)",
                              fontSize: pxToDp(28),
                            },
                          ]}
                        >
                          合计：
                        </Text>
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_700,
                            {
                              color: "#FF4949",
                              fontSize: pxToDp(48),
                              marginRight: pxToDp(10),
                            },
                            Platform.OS === "android"
                              ? { marginTop: pxToDp(-20) }
                              : { marginTop: pxToDp(-15) },
                          ]}
                        >
                          {now_product.rate
                            ? now_product.iap_price
                            : now_product.app_price}
                        </Text>
                        <Text
                          style={[
                            appFont.fontFamily_jcyt_500,
                            {
                              color: "rgba(255, 73, 73, 0.70)",
                              fontSize: pxToDp(28),
                            },
                          ]}
                        >
                          元
                        </Text>
                      </View>
                      {now_product.rate ? (
                        <Text
                          style={[
                            {
                              color: "#CCCCCC",
                              fontSize: pxToDp(28),
                              textDecorationLine: "line-through",
                            },
                            appFont.fontFamily_jcyt_500,
                            Platform.OS === "android"
                              ? { marginTop: pxToDp(-20) }
                              : null,
                          ]}
                        >
                          {now_product.app_price}元
                        </Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      style={[styles.payBtn]}
                      onPress={this.toPay}
                    >
                      <View style={[styles.payBtnInner]}>
                        <Text
                          style={[
                            { color: "#475266", fontSize: pxToDp(40) },
                            appFont.fontFamily_jcyt_700,
                          ]}
                        >
                          立即支付
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
          {show ? (
            <QRcodePay
              close={this.closeQrcodePay}
              product={now_product}
            ></QRcodePay>
          ) : null}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
    ...appStyle.flexCenter,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    position: "relative",
    width: pxToDp(1400),
  },
  item: {
    borderWidth: pxToDp(8),
    borderColor: "transparent",
    padding: pxToDp(10),
    borderRadius: pxToDp(60),
  },
  item_bg: {
    width: pxToDp(600),
    height: pxToDp(356),
    padding: pxToDp(40),
  },
  closebtn: {
    position: "absolute",
    top: pxToDp(20),
    right: pxToDp(20),
    zIndex: 1,
  },
  price_wrap: {
    height: pxToDp(78),
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    borderRadius: pxToDp(18),
    backgroundColor: "#475266",
  },
  panda_wrap: {
    position: "absolute",
    top: pxToDp(-40),
    left: pxToDp(130),
    ...appStyle.flexLine,
  },
  triangle_left: {
    width: 0,
    height: 0,
    borderLeftWidth: pxToDp(8),
    borderLeftColor: "transparent",
    borderRightWidth: pxToDp(8),
    borderRightColor: "#3C465F",
    borderBottomWidth: pxToDp(8),
    borderBottomColor: "transparent",
    borderTopWidth: pxToDp(8),
    borderTopColor: "transparent",
  },
  talk_wrap: {
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
    height: pxToDp(76),
    color: "#3C465F",
    borderRadius: pxToDp(20),
    backgroundColor: "#3C465F",
    marginLeft: pxToDp(-2),
    ...appStyle.flexCenter,
  },
  footer: {
    borderTopColor: "#F6F6F7",
    borderTopWidth: pxToDp(4),
    padding: pxToDp(20),
    ...appStyle.flexAliEnd,
  },
  payBtn: {
    width: pxToDp(260),
    height: pxToDp(108),
    backgroundColor: "#FFB649",
    borderRadius: pxToDp(40),
    paddingBottom: pxToDp(8),
  },
  payBtnInner: {
    ...appStyle.flexCenter,
    height: "100%",
    width: "100%",
    backgroundColor: "#FFDB5D",
    borderRadius: pxToDp(40),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {
    setLockPrimarySchool(data) {
      dispatch(actionCreators.setLockPrimarySchool(data));
    },
    setLockYoung(data) {
      dispatch(actionCreators.setLockYoung(data));
    },
    setSelestModuleAuthority(data) {
      dispatch(actionCreators.setSelestModuleAuthority(data));
    },
    setPurchaseModule(data) {
      dispatch(actionCreators.setPurchaseModule(data));
    },
  };
};
export default connect(mapStateToProps, mapDispathToProps)(PurchaseModal);
