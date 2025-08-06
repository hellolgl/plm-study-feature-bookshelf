import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { appStyle } from "../../theme";
import { size_tool, pxToDp, padding_tool } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import RichShowView from "../../component/chinese/RichShowView";
import CorrectionCheck from "../../component/CorrectionCheck";
import url from "../../util/url";
import ViewControl from "react-native-image-pan-zoom";
let baseURL = url.baseURL;
const optionsMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
};
class Homework extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderOptions = (item) => {
    if (!item.choice_content_type || item.choice_content_type === "text") {
      // 文字选择
      if (item.exercise_content) {
        let options = item.exercise_content.split("#");
        let choice = options.map((child, childIndex) => {
          return (
            <View style={[styles.optionItem]} key={childIndex}>
              <Text style={[{ fontSize: pxToDp(32), lineHeight: 36 }]}>
                {optionsMap[childIndex]}、{child}
              </Text>
            </View>
          );
        });
        return <View>{choice}</View>;
      }
    }
    if (item.choice_content_type === "image") {
      // 图片选择
      if (item.exercise_content) {
        let options = item.exercise_content.split("#");
        let choice = options.map((child, childIndex) => {
          return (
            <View className={styles.optionItem} key={childIndex}>
              <Text style={[{ fontSize: pxToDp(32) }]}>
                {optionsMap[childIndex]}、
              </Text>
              <Image
                style={{
                  width: 120,
                  height: 120,
                  marginLeft: pxToDp(40),
                }}
                source={{
                  uri: baseURL + child,
                }}
                resizeMode="contain"
              ></Image>
            </View>
          );
        });

        return <View style={[appStyle.flexTopLine]}>{choice}</View>;
      }
    }
    return null;
  };
  renderCorrect = (item) => {
    if (!item.answer_content) return null;
    let answer_content_arr = item.answer_content.split("#");
    let reg = /\w+\.(jpg|png)/
    if (reg.test(answer_content_arr[0])) {
        return (
          <View
            style={[
              appStyle.flexTopLine,
              { marginBottom: pxToDp(20), marginTop: pxToDp(20) },
            ]}
          >
            <Text style={[styles.label]}>正确答案：</Text>
            <Image
              resizeMode={"contain"}
              style={{ width: pxToDp(200), height: pxToDp(300) }}
              source={{ uri: baseURL + answer_content_arr[0] }}
            ></Image>
          </View>
        );
    }
    for (let i = 0; i < answer_content_arr.length; i++) {
      if (answer_content_arr[i] === "null") {
        return null;
      }
    }
    return (
      <View
        style={[
          appStyle.flexTopLine,
          { marginBottom: pxToDp(20), marginTop: pxToDp(20) },
        ]}
      >
        <Text style={[styles.label]}>正确答案：</Text>
        <Text style={[styles.labelText]}>{answer_content_arr.join("、")}</Text>
      </View>
    );
  };
  renderAnswer = (item) => {
    if (item.audio_path) {
      // 语音题
      return null;
    }
    if (item.exercise_result) {
      let reg = /\w+\.(jpg|png)/
      if (reg.test(item.exercise_result)) {
          return (
            <Image
              resizeMode={"contain"}
              style={{ width: pxToDp(200), height: pxToDp(300) }}
              source={{ uri: baseURL + item.exercise_result }}
            ></Image>
          );
      }
      return <Text style={[styles.labelText]}>{item.exercise_result}</Text>;
    }
    if (item.image_path) {
      return (
        <Image
          resizeMode={"contain"}
          style={{ width: pxToDp(300), height: pxToDp(300) }}
          source={{ uri: baseURL + item.image_path }}
        ></Image>
      );
    }
    return null;
  };
  render() {
    const { list } = this.props;
    console.log("-----", list);
    return (
      <>
        {list.map((item, index) => {
          return (
            <View
              style={[
                styles.wrap,
                appStyle.flexTopLine,
                appStyle.flexJusBetween,
                { marginBottom: pxToDp(40) },
              ]}
              key={index}
            >
              <View style={[styles.left]}>
                {item.public_exercise_stem ? (
                  <RichShowView
                    divStyle={"font-size: x-large"}
                    pStyle={"font-size: x-large"}
                    spanStyle={"font-size: x-large"}
                    width={pxToDp(1400)}
                    value={item.public_exercise_stem}
                  ></RichShowView>
                ) : null}
                <RichShowView
                  divStyle={"font-size: x-large"}
                  pStyle={"font-size: x-large"}
                  spanStyle={"font-size: x-large"}
                  width={pxToDp(1400)}
                  value={
                    item.private_stem_picture
                      ? item.private_exercise_stem +
                        `<img src="${
                          baseURL + item.private_stem_picture
                        }" style="width:auto,height:auto,margin-top:8px"></img>`
                      : item.private_exercise_stem
                  }
                ></RichShowView>
                {this.renderOptions(item)}
                {this.renderCorrect(item)}
                {!item.audio_path ? (
                  <View
                    style={[appStyle.flexTopLine, { marginBottom: pxToDp(20) }]}
                  >
                    <Text style={[styles.label]}>答案：</Text>
                    {this.renderAnswer(item)}
                  </View>
                ) : null}
                {item.correction_remarks ? (
                  <View style={[appStyle.flexLine]}>
                    <Text style={{ fontSize: pxToDp(32), color: "#FC6161"  }}>
                      评语：{item.correction_remarks}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={[styles.right]}>
                <CorrectionCheck details={item}></CorrectionCheck>
              </View>
            </View>
          );
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: pxToDp(40),
  },
  label: {
    fontSize: pxToDp(28),
    color: "#2884ff",
  },
  labelText: {
    fontSize: pxToDp(28),
  },
});
export default Homework;
