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
} from "react-native";
import {
  borderRadius_tool,
  padding_tool,
  pxToDp,
  pxToDpHeight,
  size_tool,
} from "../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../theme";
import { connect } from "react-redux";
import RichShowView from "../newRichShowView";

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, title, msg, btnText, isHtml, isGold, showPanda } =
      this.props;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={[styles.container]}>
          <View
            style={[
              styles.contentWrap,
              isGold ? { minWidth: pxToDp(480) } : "",
            ]}
          >
            {isGold ? (
              <View
                style={[
                  styles.content,
                  isGold ? { minWidth: pxToDp(480) } : "",
                ]}
              >
                <ImageBackground
                  source={require("../../../images/chineseHomepage/composition/goldBg.png")}
                  style={[
                    size_tool(480),
                    appStyle.flexAliCenter,
                    appStyle.flexJusBetween,
                  ]}
                >
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_700,
                      { fontSize: pxToDp(52), color: "#363D4C" },
                    ]}
                  >
                    恭喜
                  </Text>
                  <Image
                    source={require("../../../images/chineseHomepage/sentence/icon7.png")}
                    style={[size_tool(240, 280)]}
                  />
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_500,
                      { fontSize: pxToDp(40), color: "#363D4C" },
                    ]}
                  >
                    获得习作徽章X1
                  </Text>
                </ImageBackground>
              </View>
            ) : (
              <View
                style={[
                  styles.content,
                  showPanda ? { paddingTop: pxToDp(130) } : {},
                ]}
              >
                {title ? (
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(48),
                        color: "#475266",
                        marginBottom: pxToDp(40),
                      },
                      appFont.fontFamily_jcyt_700,
                    ]}
                  >
                    {title}
                  </Text>
                ) : null}
                {showPanda ? (
                  <Image
                    style={[
                      size_tool(200),
                      {
                        position: "absolute",
                        top: pxToDp(-70),
                        zIndex: 999,
                      },
                    ]}
                    resizeMode="contain"
                    source={require("../../../images/chineseHomepage/sentence/msgPanda.png")}
                  />
                ) : null}

                {isHtml ? (
                  <View
                    style={[
                      size_tool(968, 462),
                      borderRadius_tool(40),
                      padding_tool(40),
                      { backgroundColor: "#F5F6FA" },
                    ]}
                  >
                    <ScrollView>
                      <RichShowView
                        width={pxToDp(888)}
                        value={msg}
                        size={5}
                      ></RichShowView>
                    </ScrollView>
                  </View>
                ) : (
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(32),
                        color: "#4C4C59",
                        lineHeight: pxToDp(60),
                        textAlign: "left",
                      },
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    {msg}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={[styles.btn]}
              onPress={() => {
                this.props.todo();
              }}
            >
              <View
                style={[
                  size_tool(216, 128),
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
                    {btnText}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter,
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
    ...appStyle.flexAliCenter,
    ...padding_tool(40, 60, 40, 60),
    position: "relative",
  },
  btn: {
    position: "absolute",
    bottom: pxToDp(-20),
    ...size_tool(216, 128),
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
