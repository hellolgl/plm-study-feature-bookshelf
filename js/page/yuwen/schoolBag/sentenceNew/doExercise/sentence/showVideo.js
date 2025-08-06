import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import {
  borderRadius_tool,
  padding_tool,
  pxToDp,
  pxToDpHeight,
  size_tool,
  getIsTablet,
  pxToDpWidthLs,
} from "../../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../../theme";
import { connect } from "react-redux";
import Lottie from "lottie-react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isphone: !getIsTablet(),
    };
    this.animation = null;
  }

  render() {
    const { isphone } = this.state;
    return (
      <View style={[styles.container]}>
        <View
          style={[
            size_tool(718, 1010),
            {
              alignItems: "center",
              paddingLeft: pxToDp(40),
              width: pxToDp(718),
              height: "100%",
            },
            Platform.OS === "ios" && {
              paddingTop: pxToDp(100),
            },
          ]}
        >
          <Lottie
            source={require("../../../../../../res/json/aiRobort2.json")}
            style={[
              size_tool(883, 750),
              isphone && {
                width: pxToDpWidthLs(500),
                height: pxToDpWidthLs(400),
              },
            ]}
            onAnimationFinish={() => {
              this.animation.play(80, 150);
            }}
            autoPlay
            loop={false}
            ref={(ref) => {
              this.animation = ref;
            }}
          />
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              this.props.todo();
            }}
          >
            <View
              style={[
                size_tool(383, 128),
                borderRadius_tool(200),
                { backgroundColor: "#F07C39", paddingBottom: pxToDp(6) },
              ]}
            >
              <View
                style={[
                  appStyle.flexCenter,
                  {
                    flex: 1,
                    backgroundColor: "#FF964A",
                    borderRadius: pxToDp(200),
                  },
                ]}
              >
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    { fontSize: pxToDp(46), color: "#fff" },
                  ]}
                >
                  开始学习
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.closeBtn]}
            onPress={this.props.close}
          >
            <Image
              source={require("../../../../../../images/chineseHomepage/sentence/status2.png")}
              style={[size_tool(99)]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: "rgba(76, 76, 89, .8)",
    // ...appStyle.flexCenter,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    alignItems: "center",
  },
  content: {
    minWidth: pxToDp(714),
    borderRadius: pxToDp(60),
    backgroundColor: "#fff",
    ...appStyle.flexAliCenter,
    ...padding_tool(40, 60, 100, 60),
  },
  contentWrap: {
    minWidth: pxToDp(714),
    // ...appStyle.flexAliCenter,
    ...padding_tool(0, 60, 40, 60),
    position: "relative",
  },
  btn: {
    // position: "absolute",
    // bottom: pxToDp(-20),
    // ...size_tool(216, 128),
    paddingTop: pxToDp(60),
  },
  closeBtn: {
    ...size_tool(99),
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 330 : 210),
    right: pxToDp(60),
  },
});

const mapStateToProps = (state) => {
  return {
    language_data: state.getIn(["languageMath", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(StatisticsModal);
