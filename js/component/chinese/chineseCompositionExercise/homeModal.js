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

import { pxToDp, size_tool } from "../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../theme";
import { connect } from "react-redux";
import * as actionCreators from "../../../action/yuwen/language";
import chinese from "../../../util/languageConfig/chinese/chinese";
import english from "../../../util/languageConfig/chinese/english";
import fonts from "../../../theme/fonts";

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
    const { show, myCheck } = this.props;
    if (!show) return null;
    const { name, theme, struct } = myCheck;
    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <View style={[styles.content]}>
          <View style={[styles.inner]}>
            <Text style={[styles.titleTxt]}>题目：</Text>
            <Text style={[styles.contentTxt]}>{name ? name : ""}</Text>
            <Text style={[styles.titleTxt]}>中心思想：</Text>
            <Text style={[styles.contentTxt]}>{theme ? theme : ""}</Text>
            <Text style={[styles.titleTxt]}>结构：</Text>
            <Text style={[styles.contentTxt]}>{struct ? struct : ""}</Text>
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
    height: windowHeight - pxToDp(Platform.OS === "ios" ? 160 : 120),
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 160 : 120),
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
    width: pxToDp(652),
    backgroundColor: "#E7E7F2",
    borderRadius: pxToDp(60),
    ...appStyle.flexAliCenter,
    paddingBottom: pxToDp(8),
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
  },
  titleTxt: {
    ...appFont.fontFamily_syst,
    fontSize: pxToDp(32),
    color: "#8D99AE",
    lineHeight: pxToDp(40),
    marginBottom: pxToDp(20),
  },
  contentTxt: {
    // ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#475266",
    lineHeight: pxToDp(50),
    marginBottom: pxToDp(20),
    ...appFont.fontFamily_syst_bold,
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
