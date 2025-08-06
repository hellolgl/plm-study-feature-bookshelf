import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Platform,
  DeviceEventEmitter
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  getIsTablet,
} from "../../../../util/tools";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import url from "../../../../util/url";
import RenderTag from "../../../../component/square/tag";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      isPhone: !getIsTablet(),
    };
  }
  componentDidMount() {
    this.getdetail();
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }
  getdetail = () => {
    const { data } = this.props;
    let sendata = {
      title_id: data.title_id,
    };
    axios.get(api.getStoryDesc, { params: sendata }).then((res) => {
      console.log("简介", res.data.data);
      // this.flag = false;
      if (res.data.err_code === 0) {
        this.setState({
          detail: res.data.data,
        });
      } else {
        Toast.fail("请求失败");
      }
    });
  };
  render() {
    const { data, next } = this.props;
    const { detail, isPhone } = this.state;
    // console.log("参数.", detail.desc);
    return (
      <View
        style={[
          { flex: 1, alignItems: "center" },
          appStyle.flexTopLine,
          isPhone ? padding_tool(30, 30, 30, 50) : padding_tool(88, 91, 78, 91),
        ]}
      >
        <View style={[]}>
          <ImageBackground
            style={[isPhone ? styles.phoneimgWrap : styles.imgWrap]}
            source={require("../../../../images/square/ssquareTitleBg.png")}
          >
            <Image
              source={{ uri: url.baseURL + data.imgUrl }}
              style={[
                isPhone ? size_tool(560) : size_tool(650),
                borderRadius_tool(90),
              ]}
              resizeMode="contain"
            />
          </ImageBackground>
        </View>
        <View style={[{ flex: 1, marginLeft: pxToDp(80) }]}>
          <View
            style={[{ flex: 1 }, appStyle.flexCenter, appStyle.flexTopLine]}
          >
            <ScrollView style={[{ width: "100%" }]}>
              <Text style={[styles.title]}>{data.name}</Text>
              <View style={[{ marginBottom: pxToDp(65) }]}>
                <RenderTag
                  type={data.module}
                  fontStyle={{ fontSize: pxToDp(38) }}
                  navigation={this.props.navigation}
                />
              </View>
              <Text style={[styles.desc, { marginBottom: pxToDp(60) }]}>
                {detail?.desc?.zh}
              </Text>
              <Text style={[styles.desc]}>{detail?.desc?.en}</Text>
            </ScrollView>
          </View>

          <View style={[{ alignItems: "flex-end" }]}>
            <TouchableOpacity
              onPress={() => next && next()}
              style={[
                {
                  width: pxToDp(540),
                  height: pxToDp(120),
                  borderRadius: pxToDp(60),
                  paddingBottom: pxToDp(10),
                  backgroundColor: "#FF9C48",
                },
              ]}
            >
              <View
                style={[
                  {
                    flex: 1,
                    backgroundColor: "#FFC13E",
                    borderRadius: pxToDp(55),
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    {
                      fontSize: pxToDp(42),
                      color: "#fff",
                    },
                    Platform.OS === "ios" && {
                      lineHeight: pxToDp(52),
                    },
                  ]}
                >
                  开始阅读
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: pxToDp(50),
    color: "#283139",
    marginBottom: pxToDp(27),
    fontWeight: "bold",
  },
  desc: {
    fontSize: pxToDp(38),
    color: "#283139",
  },
  imgWrap: {
    ...size_tool(766),
    transform: [
      {
        rotateZ: "-7deg",
      },
    ],
    marginBottom: pxToDp(48),
    ...appStyle.flexCenter,
  },
  phoneimgWrap: {
    ...size_tool(648),
    transform: [
      {
        rotateZ: "-3deg",
      },
    ],
    marginBottom: pxToDp(28),
    ...appStyle.flexCenter,
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
