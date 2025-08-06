import * as _ from "lodash";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { pxToDp } from "../tools";
import { appFont, appStyle } from "../../theme";
import QRCode from "react-native-qrcode-svg";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import { connect } from "react-redux";
import "text-encoding";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class QRcodePay extends React.Component {
  constructor() {
    super();
    this.state = {
      code_url: "",
      loading: true,
    };
  }

  componentDidMount() {
    const userInfo = this.props.userInfo.toJS();
    const { product } = this.props;
    const { selectAliasModules, selectedServiceType, id } = product;
    if (userInfo.isGrade) {
      // 小学
      const data = {
        alias: selectAliasModules,
        payment_type: selectedServiceType,
      };
      axios
        .post(api.purchaseAIPlanModules, data)
        .then((res) => {
          this.setState({
            code_url: res.data.data,
          });
        })
        .finally(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      // 幼小
      axios
        .post(api.getQRcode, { id })
        .then((res) => {
          this.setState({
            code_url: res.data.data,
          });
        })
        .finally(() => {
          this.setState({
            lodaing: false,
          });
        })
        .catch((err) => {
          console.log("++++++", err);
        });
    }
  }

  confirmPay = () => {
    this.props.close();
  };

  render() {
    const { product } = this.props;
    const { app_price, name, num, iap_price, rate } = product;
    const { code_url, loading } = this.state;
    return (
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View style={[appStyle.flexLine, appStyle.flexJusBetween]}>
            <Text
              style={[
                { color: "#4C4C59", fontSize: pxToDp(40) },
                appFont.fontFamily_jcyt_500,
              ]}
            >
              确认支付
            </Text>
            <TouchableOpacity
              style={[styles.closeBtn, { transform: [{ rotate: "45deg" }] }]}
              onPress={this.confirmPay}
            >
              <Text style={[{ color: "#4C4C59", fontSize: pxToDp(40) }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              { marginTop: pxToDp(10) },
              appStyle.flexLine,
              appStyle.flexJusBetween,
            ]}
          >
            <View>
              <View style={[appStyle.flexLine]}>
                <Text
                  style={[
                    { color: "#FF4949", fontSize: pxToDp(60) },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  {rate ? iap_price : app_price}
                </Text>
                <Text
                  style={[
                    {
                      color: "rgba(255, 73, 73, 0.70)",
                      fontSize: pxToDp(28),
                      marginLeft: pxToDp(10),
                    },
                    appStyle.fontFamily_jcyt_500,
                  ]}
                >
                  元
                </Text>
              </View>
              <Text style={[styles.txt_1]}>商品</Text>
              <Text style={[styles.txt_2]}>{name}</Text>
              <Text style={[styles.txt_1]}>时长</Text>
              <Text style={[styles.txt_2]}>{num}个月</Text>
            </View>
            <View style={[styles.code_wrap]}>
              <Text
                style={[
                  { color: "#fff", fontSize: pxToDp(28) },
                  appFont.fontFamily_jcyt_500,
                ]}
              >
                微信扫码支付
              </Text>
              <View style={[styles.code_wrap_inner]}>
                {code_url ? (
                  <QRCode size={pxToDp(311)} value={code_url} />
                ) : loading ? (
                  <ActivityIndicator size="large" color="#28CD60" />
                ) : (
                  <Text
                    style={[
                      { color: "#FF4949", fontSize: pxToDp(28) },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    数据出错
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View style={[appStyle.flexAliCenter, { marginTop: pxToDp(20) }]}>
            <TouchableOpacity
              style={[styles.finishBtn]}
              onPress={this.confirmPay}
            >
              <Text
                style={[
                  { color: "#fff", fontSize: pxToDp(40) },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                已完成支付
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    width: windowWidth,
    height: windowHeight,
    zIndex: 999,
    ...appStyle.flexCenter,
  },
  content: {
    padding: pxToDp(40),
    backgroundColor: "#fff",
    borderRadius: pxToDp(40),
    width: pxToDp(900),
    paddingLeft: pxToDp(80),
    paddingRight: pxToDp(80),
  },
  closeBtn: {
    width: pxToDp(80),
    height: pxToDp(80),
    backgroundColor: "rgba(74, 74, 87, 0.05)",
    borderRadius: pxToDp(40),
    ...appStyle.flexCenter,
  },
  txt_1: {
    color: "rgba(76, 76, 89, 0.60)",
    fontSize: pxToDp(24),
    ...appFont.fontFamily_jcyt_500,
  },
  txt_2: {
    color: "#4C4C59",
    fontSize: pxToDp(32),
    ...appFont.fontFamily_jcyt_500,
  },
  code_wrap: {
    width: pxToDp(400),
    height: pxToDp(460),
    backgroundColor: "#28CD60",
    borderRadius: pxToDp(40),
    ...appStyle.flexAliCenter,
    padding: pxToDp(20),
  },
  code_wrap_inner: {
    backgroundColor: "#fff",
    width: "100%",
    flex: 1,
    borderRadius: pxToDp(24),
    padding: pxToDp(24),
    ...appStyle.flexCenter,
  },
  finishBtn: {
    width: pxToDp(400),
    height: pxToDp(96),
    backgroundColor: "#28CD60",
    borderRadius: pxToDp(200),
    ...appStyle.flexCenter,
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  // 存数据
  return {};
};
export default connect(mapStateToProps, mapDispathToProps)(QRcodePay);
