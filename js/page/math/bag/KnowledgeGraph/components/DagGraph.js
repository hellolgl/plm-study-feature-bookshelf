import React from "react";
import {
  Platform,
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { pxToDp } from "../../../../../util/tools";
import { appFont } from "../../../../../theme";

const log = console.log.bind(console);

class DagGraph extends React.Component {
  constructor() {
    super();
    this.isIos = Platform.OS === "ios";
  }

  getChildNodeImgDataUrl = (status) => {
    const { fromChildren } = this.props;
    if (status === -1) {
      return fromChildren
        ? require("../../../../../images/children/finishKnowNo.png")
        : require("../../../../../images/MathKnowledgeGraph/badge_icon_3.png");
    } else if (status === 0) {
      return fromChildren
        ? require("../../../../../images/children/finishKnowNo.png")
        : require("../../../../../images/MathKnowledgeGraph/badge_icon_2.png");
    } else if (status === 1) {
      return fromChildren
        ? require("../../../../../images/children/finishKnow.png")
        : require("../../../../../images/MathKnowledgeGraph/badge_icon_1.png");
    }
  };

  getDes = (showLanguage, chineseDes, englishDes) => {
    const r = [];
    if (showLanguage === "Chinese") {
      r.push(chineseDes);
    } else if (showLanguage === "English") {
      r.push(englishDes);
    } else if (showLanguage === "ChineseAndEnglish") {
      r.push(chineseDes);
      r.push(englishDes);
    } else {
      // English and Chinese
      r.push(englishDes);
      r.push(chineseDes);
    }
    return r;
  };

  wordBreak = (showLanguage, sentence) => {
    const _reduceChinese = (data) => {
      let r = "";
      const m = 999;
      let n = 0;
      for (let i = 0; i < data.length; i++) {
        const s = data[i];
        r += s;
        n += s.length + 1;
        if (n > m) {
          r += "\n";
          n = 0;
        }
      }
      return `${r}`;
    };
    const _reduceEnglish = (data) => {
      let r = "";
      const m = 999;
      const sp = data.split(" ");
      let n = 0;
      for (let i = 0; i < sp.length; i++) {
        const s = sp[i];
        r += `${s} `;
        n += s.length + 1;
        if (n > m) {
          r += "\n";
          n = 0;
        }
      }
      return r;
    };
    if (showLanguage === "Chinese") {
      const s = sentence[0];
      // return `chinese|${_reduceChinese(s)}`
      return `${_reduceChinese(s)}`;
    } else if (showLanguage === "English") {
      const s = sentence[0];
      // return `english|${_reduceEnglish(s)}`
      return `${_reduceEnglish(s)}`;
    } else if (showLanguage === "ChineseAndEnglish") {
      const [chinese, english] = sentence;
      const c = _reduceChinese(chinese);
      const e = _reduceEnglish(english);
      // return `chineseFixedEnglish|${c}&&${e}`
      return `${c}\n${e}`;
    } else {
      // English and Chinese
      const [english, chinese] = sentence;
      const e = _reduceEnglish(english);
      const c = _reduceChinese(chinese);
      // return `englishFixedChinese|${e}&&${c}`
      return `${e}\n${c}`;
    }
  };

  render() {
    const { width, height, data, showLanguage } = this.props;
    const {
      grandpa,
      parent,
      knowledge_name,
      language_knowledge_name,
      children,
    } = data;
    const descList = children.map((d) =>
      this.getDes(
        showLanguage,
        d["knowledge_name"],
        d["language_knowledge_name"]
      )
    );
    const grandpaDesc = this.getDes(
      showLanguage,
      grandpa["knowledge_name"],
      grandpa["language_knowledge_name"]
    );
    const fatherDesc = this.getDes(
      showLanguage,
      parent["knowledge_name"],
      parent["language_knowledge_name"]
    );
    const selfDesc = this.getDes(
      showLanguage,
      knowledge_name,
      language_knowledge_name
    );
    const n = descList.map((d) => this.wordBreak(showLanguage, d));
    return (
      <View style={[{ width, height }]}>
        <View>
          {grandpaDesc.filter((g) => g === undefined).length === 0 ? (
            <View style={[styles.grandpaPosition]}>
              <Image
                source={require("../../../../../images/MathKnowledgeGraph/grandpa.png")}
                style={{
                  width: pxToDp(this.isIos ? 450 : 450 * 0.7),
                  height: pxToDp(this.isIos ? 450 : 450 * 0.7),
                }}
                resizeMode={"contain"}
              ></Image>
              <View style={[styles.descItem]}>
                {grandpaDesc.map((t) => (
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_500,
                      {
                        fontSize: pxToDp(28),
                        lineHeight: pxToDp(30),
                      },
                    ]}
                  >
                    {t}
                  </Text>
                ))}
              </View>
              <Image
                source={require("../../../../../images/MathKnowledgeGraph/line1.png")}
                style={[
                  { width: pxToDp(180), height: pxToDp(500) },
                  styles.line1Position,
                ]}
                resizeMode={"cover"}
              ></Image>
            </View>
          ) : null}
          <View style={[styles.fatherPosition]}>
            <Image
              source={require("../../../../../images/MathKnowledgeGraph/father.png")}
              style={{
                width: pxToDp(this.isIos ? 300 : 300 * 0.7),
                height: pxToDp(this.isIos ? 300 : 300 * 0.7),
              }}
              resizeMode={"contain"}
            ></Image>
            <View style={[styles.descItem, { maxWidth: pxToDp(400) }]}>
              {fatherDesc.map((t) => (
                <Text
                  style={[
                    appFont.fontFamily_jcyt_500,
                    {
                      fontSize: pxToDp(28),
                      lineHeight: pxToDp(30),
                    },
                  ]}
                >
                  {t}
                </Text>
              ))}
            </View>
            <Image
              source={require("../../../../../images/MathKnowledgeGraph/line2.png")}
              style={[
                { width: pxToDp(246), height: pxToDp(164) },
                styles.line2Position,
              ]}
              resizeMode={"cover"}
            ></Image>
          </View>
          <View style={[styles.selfPosition]}>
            <Image
              source={require("../../../../../images/MathKnowledgeGraph/child.png")}
              style={{
                width: pxToDp(this.isIos ? 200 : 200 * 0.7),
                height: pxToDp(this.isIos ? 200 : 200 * 0.7),
              }}
              resizeMode={"contain"}
            ></Image>
            <View style={[styles.descItem]}>
              {selfDesc.map((t) => (
                <Text
                  style={[
                    appFont.fontFamily_jcyt_500,
                    {
                      fontSize: pxToDp(28),
                      lineHeight: pxToDp(30),
                    },
                  ]}
                >
                  {t}
                </Text>
              ))}
            </View>
            <Image
              source={require("../../../../../images/MathKnowledgeGraph/line3.png")}
              style={[
                { width: pxToDp(104), height: pxToDp(20) },
                styles.line3Position,
              ]}
              resizeMode={"cover"}
            ></Image>
          </View>
        </View>
        <ImageBackground
          resizeMode={"stretch"}
          style={[
            {
              width: pxToDp(780),
              height: Dimensions.get("window").height,
              right: pxToDp(20),
              position: "absolute",
              alignItems: "center",
              paddingTop: pxToDp(10),
              paddingBottom: pxToDp(150),
            },
          ]}
          source={require("../../../../../images/MathKnowledgeGraph/mask.png")}
        >
          <FlatList
            data={n}
            renderItem={({ index }) => {
              const child = children[index];
              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: pxToDp(15),
                    marginBottom: pxToDp(15),
                  }}
                  onPress={() => {
                    const { swiperIndex } = this.props;
                    this.props.sendData(swiperIndex, index);
                  }}
                >
                  <Image
                    source={this.getChildNodeImgDataUrl(child["status"])}
                    style={[
                      {
                        width: pxToDp(100),
                        height: pxToDp(100),
                        marginRight: pxToDp(20),
                      },
                    ]}
                    resizeMode={"cover"}
                  ></Image>
                  <ImageBackground
                    key={index}
                    resizeMode={"stretch"}
                    style={{
                      width: pxToDp(265 * 1.8),
                      height: pxToDp(
                        showLanguage === "Chinese" ? 55 * 2.5 : 55 * 3.5
                      ),
                      padding: pxToDp(20),
                      paddingLeft: pxToDp(40),
                      paddingRight: pxToDp(40),
                      justifyContent: "center",
                    }}
                    source={require("../../../../../images/MathKnowledgeGraph/desc.png")}
                  >
                    <Image
                      source={require("../../../../../images/MathKnowledgeGraph/circle.png")}
                      style={[
                        {
                          width: pxToDp(30),
                          height: pxToDp(30),
                          position: "absolute",
                          left: pxToDp(-10),
                        },
                      ]}
                      resizeMode={"cover"}
                    ></Image>
                    <Text
                      style={[
                        appFont.fontFamily_jcyt_500,
                        { lineHeight: pxToDp(28), fontSize: pxToDp(25) },
                      ]}
                    >{`${n[index]}`}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  descItem: {
    maxWidth: pxToDp(280),
    minHeight: pxToDp(100),
    maxHeight: pxToDp(400),
    backgroundColor: "#f5fdff",
    borderRadius: pxToDp(30),
    padding: pxToDp(20),
    alignItems: "center",
    justifyContent: "center",
  },
  grandpaPosition: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 50 : 50),
    left: pxToDp(30),
  },
  line1Position: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 260 : 140),
    left: pxToDp(Platform.OS === "ios" ? 250 : 200),
    zIndex: -1,
  },
  fatherPosition: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 620 : 540),
    left: pxToDp(Platform.OS === "ios" ? 300 : 310),
  },
  line2Position: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? -50 : -70),
    left: pxToDp(Platform.OS === "ios" ? 240 : 170),
    zIndex: -1,
  },
  selfPosition: {
    position: "absolute",
    top: pxToDp(Dimensions.get("window").height / 2),
    left: pxToDp(Platform.OS === "ios" ? 700 : 710),
  },
  line3Position: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 90 : 60),
    left: pxToDp(Platform.OS === "ios" ? 200 : 140),
    zIndex: -1,
  },
});

export default DagGraph;
