import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
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
} from "../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../theme";
import { connect } from "react-redux";
// import RichShowView from '../../math/RichShowViewHtml'
// import RichShowView from '../sentence/richView'
import RichShowView from "../newRichShowView";

import Audio from "../../../util/audio/audio";
import url from "../../../util/url";
import AudioBtn from "../audio";
const statusIcon = {
  0: require("../../../images/chineseHomepage/sentence/status0.png"),
  1: require("../../../images/chineseHomepage/sentence/status1.png"),
  2: require("../../../images/chineseHomepage/sentence/status2.png"),
};
const txtObj = {
  0: "答对了！",
  1: "一般，还有更好的组合,继续努力！",
  2: "答错了！",
};
class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }
  renderTemplate = () => {
    const { exercise, sentenceStem, noFamily } = this.props;
    let _currentTopic = JSON.parse(JSON.stringify(exercise));
    let setntence = JSON.parse(JSON.stringify(sentenceStem));
    _currentTopic?.template_word?.forEach((i, index) => {
      setntence[i.position].desc = i.desc;
    });
    let htm = setntence.map((item, index) => {
      return item.desc ? (
        <View key={index}>
          <View style={[appStyle.flexJusCenter, appStyle.flexCenter, {}]}>
            <View
              style={[
                appStyle.flexTopLine,
                {
                  borderBottomWidth: item.desc ? pxToDp(4) : 0,
                  borderBottomColor: "#FF604A",
                  marginLeft: pxToDp(4),
                  marginRight: pxToDp(4),
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: pxToDp(36),
                    // paddingBottom: pxToDp(8),
                    color: "#475266",
                    lineHeight: pxToDp(40),
                  },
                  appFont.fontFamily_syst,
                ]}
              >
                {item.content}
              </Text>
            </View>
            <View>
              {item.desc ? (
                <Text
                  style={[
                    {
                      fontSize: pxToDp(26),
                      color: "#FF604A",
                      lineHeight: pxToDp(40),
                    },
                    appFont.fontFamily_syst,
                  ]}
                >
                  {item.desc}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        item.content?.split("").map((m, i) => (
          <Text
            style={[
              {
                color: item.word_type === "p" ? "#FF964A" : "#475266",
                fontSize: pxToDp(40),
                lineHeight: pxToDp(50),
              },
              noFamily ? "" : appFont.fontFamily_syst,
            ]}
            key={i}
          >
            {m}
          </Text>
        ))
      );
    });
    console.log("renderTemplate", _currentTopic);

    return (
      <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>{htm}</View>
    );
  };
  render() {
    const {
      correct,
      isKeyExercise,
      diagnose,
      sentenceStem,
      exercise,
      btnTxt,
      noTemp,
      noFamily,
      diagnose_audio,
    } = this.props;
    let explain = "";
    if (exercise?.standard_explain) {
      explain = exercise?.standard_explain?.replaceAll(
        '<p><span style="font-weight: bold;"></span></p>',
        ""
      );
      explain = explain.replaceAll("<o:p></o:p>", "");
      if (
        explain.includes("<rp>(</rp>") ||
        explain.includes("……") ||
        explain.includes("text-align:center")
      ) {
        explain = explain.replaceAll("<rt>", "<rt>&nbsp;");
        explain = explain.replaceAll("</rt>", "&nbsp;<rt>");
      }
    }
    const isPhone = !getIsTablet();
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={[styles.container]}>
          {diagnose_audio ? (
            <View
              style={[
                {
                  position: "absolute",
                  zIndex: 999,
                  left: pxToDp(0),
                  // backgroundColor: "pink",
                  alignItems: "center",
                  paddingBottom: pxToDp(40),
                },
              ]}
            >
              <AudioBtn
                // stem_explain_audio={''}
                diagnose_notes_audio={diagnose_audio}
              />
            </View>
          ) : null}
          <View
            style={[
              styles.contentWrap,
              diagnose_audio ? { marginLeft: pxToDp(400) } : {},
              isPhone && { height: pxToDpWidthLs(610) },
            ]}
          >
            <View
              style={[
                styles.content,
                isPhone && { height: pxToDpWidthLs(580) },
              ]}
            >
              <View style={[appStyle.flexTopLine]}>
                <Image source={statusIcon[correct]} style={[size_tool(66)]} />
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    {
                      fontSize: pxToDp(64),
                      color: "#475266",
                      lineHeight: pxToDp(80),
                    },
                  ]}
                >
                  {txtObj[correct]}
                </Text>
              </View>
              <ScrollView style={[{ width: "100%" }]}>
                <Text style={[styles.titleTxt]}>我的答案：</Text>
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexLineWrap,
                    { width: "100%", marginBottom: pxToDp(10) },
                  ]}
                >
                  {sentenceStem.map((item) => {
                    // console.log('1111111111', item.value, item.value?.indexOf('#去掉#'))
                    if (item.value && item.value?.indexOf("#去掉#") !== -1) {
                      // console.log('1111111111', item)
                      return null;
                    }
                    let list =
                      item.word_type === "p"
                        ? item.value?.split("")
                        : item.content?.split("");
                    return list.map((m, i) => (
                      <Text
                        style={[
                          {
                            color:
                              item.word_type === "p" ? "#FF964A" : "#475266",
                            fontSize: pxToDp(40),
                            lineHeight: pxToDp(50),
                          },
                          noFamily ? "" : appFont.fontFamily_syst,
                        ]}
                        key={i}
                      >
                        {m}
                      </Text>
                    ));
                  })}
                </View>
                {diagnose ? (
                  <View>
                    {/* {diagnose_audio ? (
                      <View
                        style={[
                          appStyle.flexTopLine,
                          appStyle.flexAliCenter,
                          { marginRight: pxToDp(10) },
                        ]}
                      >
                        <Audio
                          audioUri={`${url.baseURL}${diagnose_audio}`}
                          pausedBtnImg={require("../../../images/english/abcs/titlePanda.png")}
                          pausedBtnStyle={{
                            width: pxToDp(169),
                            height: pxToDp(152),
                          }}
                          playBtnImg={require("../../../images/english/abcs/titlePanda.png")}
                          playBtnStyle={{
                            width: pxToDp(169),
                            height: pxToDp(152),
                          }}
                          rate={0.75}
                          onRef={(ref) => {
                            this.audioRef1 = ref;
                          }}
                        >
                          <Text
                            style={[
                              noFamily ? "" : appFont.fontFamily_syst_bold,
                              {
                                fontSize: pxToDp(48),
                                color: "#FF964A",
                                lineHeight: pxToDp(60),
                                marginBottom: pxToDp(20),
                              },
                            ]}
                          >
                            {diagnose}
                          </Text>
                        </Audio>
                      </View>
                    ) : ( */}
                    <Text
                      style={[
                        noFamily ? "" : appFont.fontFamily_syst_bold,
                        {
                          fontSize: pxToDp(48),
                          color: "#FF964A",
                          lineHeight: pxToDp(60),
                          marginBottom: pxToDp(20),
                        },
                      ]}
                    >
                      {diagnose}
                    </Text>
                    {/* )} */}
                  </View>
                ) : null}
                {!noTemp ? (
                  <View
                    style={[
                      {
                        width: "100%",
                        backgroundColor: "#F5F6FA",
                        padding: pxToDp(40),
                        borderRadius: pxToDp(40),
                        marginBottom: pxToDp(40),
                      },
                    ]}
                  >
                    <Text style={[styles.titleTxt]}>例句分析：</Text>
                    {this.renderTemplate()}
                  </View>
                ) : null}
                {correct === "0" || isKeyExercise ? (
                  <View style={[{ marginBottom: pxToDp(40) }]}>
                    <Text style={[styles.titleTxt]}>最佳答案：</Text>

                    {exercise?.best_answer?.map((item, index) =>
                      index < 3 ? (
                        <View
                          style={[appStyle.flexTopLine, { width: "100%" }]}
                          key={index}
                        >
                          <Image
                            source={statusIcon["0"]}
                            style={[size_tool(50), { marginRight: pxToDp(10) }]}
                          />
                          <Text
                            style={[
                              styles.txtContent,
                              noFamily ? "" : appFont.fontFamily_syst,
                            ]}
                            key={index}
                          >
                            {item.replaceAll("#去掉#", "")}
                          </Text>
                        </View>
                      ) : null
                    )}
                  </View>
                ) : null}

                {exercise?.standard_explain || exercise?.explanation ? (
                  <View>
                    <Text style={[styles.titleTxt]}>知识点讲解：</Text>
                    {exercise?.explanation_audio ? (
                      <View>
                        <Audio
                          audioUri={`${url.baseURL}${exercise?.explanation_audio}`}
                          pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                          pausedBtnStyle={{
                            width: pxToDp(70),
                            height: pxToDp(70),
                          }}
                          playBtnImg={require("../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                          playBtnStyle={{
                            width: pxToDp(70),
                            height: pxToDp(70),
                          }}
                          rate={0.75}
                          onRef={(ref) => {
                            this.audioRef = ref;
                          }}
                        />
                      </View>
                    ) : null}
                    <RichShowView
                      width={pxToDp(1200)}
                      size={6}
                      value={`<div id="yuanti">${exercise?.explanation}</div>`}
                    ></RichShowView>
                    {exercise?.standard_audio ? (
                      <View>
                        <Audio
                          audioUri={`${url.baseURL}${exercise?.standard_audio}`}
                          pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                          pausedBtnStyle={{
                            width: pxToDp(70),
                            height: pxToDp(70),
                          }}
                          playBtnImg={require("../../../images/chineseHomepage/pingyin/new/play_btn_1.png")}
                          playBtnStyle={{
                            width: pxToDp(70),
                            height: pxToDp(70),
                          }}
                          rate={0.75}
                          onRef={(ref) => {
                            this.audioRef = ref;
                          }}
                        />
                      </View>
                    ) : null}
                    {exercise?.standard_explain ? (
                      <RichShowView
                        width={pxToDp(1200)}
                        size={6}
                        value={`<div id="yuanti">${exercise?.standard_explain}</div>`}
                      ></RichShowView>
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.audioRef?.sound && this.audioRef?.pausedEvent();
                this.props.onClose();
              }}
              style={[
                size_tool(432, 128),
                borderRadius_tool(140),
                {
                  paddingBottom: pxToDp(8),
                  backgroundColor: "#F07C39",
                  position: "absolute",
                  bottom: pxToDp(0),
                },
              ]}
            >
              <View
                style={[
                  {
                    flex: 1,
                    borderRadius: pxToDp(140),
                    backgroundColor: "#FF964A",
                  },
                  appStyle.flexCenter,
                ]}
              >
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    { fontSize: pxToDp(48), color: "#fff" },
                  ]}
                >
                  {btnTxt ? btnTxt : "再来一次"}
                </Text>
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
    position: "relative",
    flexDirection: "row",
  },
  content: {
    width: pxToDp(1360),
    height: pxToDp(960),
    borderRadius: pxToDp(60),
    backgroundColor: "#fff",
    ...appStyle.flexAliCenter,
    ...padding_tool(60, 60, 80, 60),
  },
  contentWrap: {
    width: pxToDp(1360),
    height: pxToDp(1000),
    position: "relative",
    ...appStyle.flexAliCenter,
  },
  titleTxt: {
    ...appFont.fontFamily_syst_bold,
    color: "#475266",
    fontSize: pxToDp(40),
    marginBottom: Platform.OS === "ios" ? pxToDp(20) : pxToDp(0),
  },
  txtContent: {
    color: "#475266",
    fontSize: pxToDp(40),
    lineHeight: pxToDp(50),
    flex: 1,
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
