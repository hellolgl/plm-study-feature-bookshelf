import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
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

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { visible, title, msg, btnText } = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={[styles.container]}>
          <View style={[styles.content]}>
            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexCenter,
                { marginBottom: pxToDp(20) },
              ]}
            >
              <Image
                source={require("../../../images/chineseHomepage/sentence/msgPanda.png")}
                style={[size_tool(200), { marginRight: pxToDp(20) }]}
              />
              <Text
                style={[
                  { fontSize: pxToDp(48), color: "#475266" },
                  appFont.fontFamily_jcyt_700,
                ]}
              >
                {title}
              </Text>
            </View>
            <View>
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
                本模块中每一道题目的答题情况都会影响学习效能的相关统计。
              </Text>
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
                当答题正确率为85%及以上时，获得徽章！
              </Text>
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
                当正确率为75%-84%之间时，统计为绿色（良好）。
              </Text>
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
                当正确率低于75%时，统计为红色（需要继续加油哦）。
              </Text>
            </View>

            <TouchableOpacity
              style={{ marginTop: pxToDp(60) }}
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
    width: pxToDp(1014),
    borderRadius: pxToDp(60),
    backgroundColor: "#fff",
    ...appStyle.flexAliCenter,
    ...padding_tool(40, 60, 40, 60),
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
