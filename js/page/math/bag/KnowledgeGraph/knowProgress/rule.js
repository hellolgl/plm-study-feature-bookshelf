import React, { PureComponent } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";
import _, { size } from "lodash";

import { pxToDp, size_tool } from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";
import * as actionCreators from "../../../../../action/yuwen/language";
import fonts from "../../../../../theme/fonts";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class SelectLanguageModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {}

  close = () => {
    this.props.close();
  };

  render() {
    const { show } = this.props;
    if (!show) return null;

    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.content]}>
          <View style={[styles.inner]}>
            <Text
              style={[
                {
                  fontSize: pxToDp(44),
                  color: "#4C4C59",
                  lineHeight: pxToDp(44),
                },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              学习规则
            </Text>
            <Image
              source={require("../../../../../images/aiGiveExercise/title.png")}
              style={[size_tool(560, 100), { marginBottom: pxToDp(20) }]}
            />
            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
              <Image
                source={require("../../../../../images/MathKnowledgeGraph/star2.png")}
                style={[size_tool(60)]}
              />
              <Text
                style={[
                  {
                    fontSize: pxToDp(32),
                    color: "#4C4C59",
                    width: pxToDp(520),
                    lineHeight: pxToDp(50),
                  },
                  appFont.fontFamily_jcyt_500,
                ]}
              >
                练习题全部答对即可获得。
              </Text>
            </View>
            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
              <Image
                source={require("../../../../../images/MathKnowledgeGraph/star1.png")}
                style={[size_tool(60)]}
              />
              <Text
                style={[
                  {
                    fontSize: pxToDp(32),
                    color: "#4C4C59",
                    width: pxToDp(520),
                    lineHeight: pxToDp(50),
                  },
                  appFont.fontFamily_jcyt_500,
                ]}
              >
                练习题未做完，或者有任意一道错误。
              </Text>
            </View>
          </View>
          <View style={styles.triangle_up}></View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight - pxToDp(Platform.OS === "ios" ? 140 : 120),
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 140 : 120),
    left: 0,
    ...appStyle.flexAliCenter,
  },
  click_region: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(71, 82, 102, 0.5)",
  },
  content: {
    position: "absolute",
    top: pxToDp(24),
    width: pxToDp(640),
    backgroundColor: "#E7E7F2",
    borderRadius: pxToDp(60),
    ...appStyle.flexAliCenter,
    paddingBottom: pxToDp(8),
    right: pxToDp(22),
  },
  inner: {
    width: "100%",
    padding: pxToDp(40),
    backgroundColor: "#fff",
    borderRadius: pxToDp(60),
  },
  item: {
    paddingBottom: pxToDp(6),
  },
  item_inner: {
    paddingLeft: pxToDp(20),
    ...appStyle.flexLine,
  },
  triangle_up: {
    width: 0,
    height: 0,
    borderLeftWidth: pxToDp(16),
    borderLeftColor: "transparent",
    borderRightWidth: pxToDp(16),
    borderRightColor: "transparent",
    borderBottomWidth: pxToDp(20),
    borderBottomColor: "#fff",
    position: "absolute",
    top: pxToDp(-20),
    right: pxToDp(50),
  },
});
const mapStateToProps = (state) => {
  return {
    language_data: state.getIn(["languageChinese", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setLanguageData(data) {
      dispatch(actionCreators.setLanguageData(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectLanguageModal);
