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
import fonts from "../../../theme/fonts";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class SelectLanguageModal extends PureComponent {
  constructor(props) {
    super(props);
    console.log("是不是幼小", props, props.isKid);
    this.state = {
      list: [
        {
          icon: require("../../../images/chineseHomepage/pingyin/itmBg.png"),
          type: props.isKid ? "allWriteExplainKid" : "allWriteExplain",
        },
        {
          icon: require("../../../images/chineseHomepage/pingyin/lYes.png"),
          type: "listenExplain",
        },
        {
          icon: require("../../../images/chineseHomepage/pingyin/sYes.png"),
          type: "sayExplain",
        },
        {
          icon: require("../../../images/chineseHomepage/pingyin/xyes.png"),
          type: "studyExplain",
        },
        {
          icon: require("../../../images/chineseHomepage/pingyin/wYes.png"),
          type: "writeExplain",
        },
      ],
    };
  }

  componentDidMount() {}

  close = () => {
    this.props.close();
  };

  render() {
    const { show } = this.props;
    if (!show) return null;
    let language_data = this.props.language_data.toJS();
    const {
      type,
      main_language_map,
      other_language_map,
      show_main,
      show_translate,
    } = language_data;
    const { list } = this.state;
    return (
      <View style={[styles.container]}>
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={[styles.click_region]}></View>
        </TouchableWithoutFeedback>
        <ImageBackground
          style={[styles.content]}
          source={require("../../../images/chineseHomepage/pingyin/new/bg1.png")}
        >
          {list.map((item, index) => {
            return (
              <View
                style={[
                  appStyle.flexTopLine,
                  appStyle.flexAliCenter,
                  { flex: 1 },
                ]}
                key={index}
              >
                <Image
                  style={[size_tool(66, 78), { marginRight: pxToDp(20) }]}
                  source={item.icon}
                  resizeMode="contain"
                ></Image>
                <View style={[{ flex: 1 }]}>
                  {show_main ? (
                    <Text style={[{}, styles.mainFont]}>
                      {main_language_map[item.type]}
                    </Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[{ opacity: 0.5 }, styles.tranFont]}>
                      {other_language_map[item.type]}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </ImageBackground>
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
    ...appStyle.flexAliEnd,
  },
  click_region: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(71, 82, 102, 0.5)",
  },
  content: {
    position: "absolute",
    top: pxToDp(0),
    right: pxToDp(20),
    width: pxToDp(860),
    height: pxToDp(802),
    // ...appStyle.flexAliCenter,
    padding: pxToDp(60),
    justifyContent: "space-between",
  },

  mainFont: {
    fontSize: pxToDp(36),
    color: "#475266",
    ...fonts.fontFamily_jcyt_700,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(42),
  },
  tranFont: {
    fontSize: pxToDp(28),
    color: "#475266",
    ...fonts.fontFamily_jcyt_500,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(33),
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
