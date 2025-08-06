import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, size_tool } from "../../../../util/tools";
import Lottie from "lottie-react-native";

class Good extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bg: {
        paistory: {},
        chinese_toChineseDailySpeReadingStatics: {
          wrapBg: "#FF8F31",
          innerBg: "#FFAB34",
        },
        math_knowledgeGraph: {
          wrapBg: "#00836D",
          innerBg: "#00B295",
        },
        math_cleverCalculation: {
          wrapBg: "#00836D",
          innerBg: "#00B295",
        },
        math_thinkingTraining: {
          wrapBg: "#00836D",
          innerBg: "#00B295",
        },
      },
    };
  }

  render() {
    const { type, toReading } = this.props;
    const { bg } = this.state;
    return (
      <View
        style={[
          appStyle.flexCenter,
          {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 999,
          },
        ]}
      >
        {/* <Image style={[size_tool(660)]} source={require('../../../images/chineseHomepage/pingyin/new/good.png')} /> */}
        <Lottie
          source={require("../../../../res/json/good.json")}
          style={{ width: pxToDp(600), height: pxToDp(600) }}
          autoPlay
        />
        <View style={[appStyle.flexTopLine]}>
          <TouchableOpacity
            onPress={() =>
              this.props.renderExercise && this.props.renderExercise()
            }
            style={[
              styles.btnWrap,
              { marginRight: pxToDp(100), backgroundColor: bg[type].wrapBg },
            ]}
          >
            <View
              style={[styles.btnInner, { backgroundColor: bg[type].innerBg }]}
            >
              <Text style={[styles.btnTxt]}>再练一次</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.goBack && this.props.goBack()}
            style={[styles.btnWrap, { backgroundColor: bg[type].wrapBg }]}
          >
            <View
              style={[styles.btnInner, { backgroundColor: bg[type].innerBg }]}
            >
              <Text style={[styles.btnTxt]}>
                {toReading ? "学习更多古诗" : "退出"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnWrap: {
    ...size_tool(540, 120),

    borderRadius: pxToDp(60),
    backgroundColor: "#FF8F31",
    paddingBottom: pxToDp(10),
  },
  btnInner: {
    flex: 1,
    backgroundColor: "#FFAB34",
    borderRadius: pxToDp(55),
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(42),
    color: "#fff",
  },
});
export default Good;
