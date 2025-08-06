import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { appStyle, appFont } from "../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  getIsTablet,
  pxToDpWidthLs,
} from "../../../util/tools";
import Sound from "react-native-sound";
// import RichShowView from "./RichShowView";
// import RichShowView from '../newRichShowView'
import url from "../../../util/url";
import { Modal as ModalCenter } from "antd-mobile-rn";
import Audio from "../../../util/audio/audio";
import RichShowView from "../newRichShowView";

import AudioBtn from "../audio";
class CharacterHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPhone: !getIsTablet(),
    };
    this.audioRef = React.createRef();
    this.audioRef1 = React.createRef();
    this.audioRef2 = React.createRef();
  }

  nextTopaicHelp = () => {
    this.audioRef?.current?.pausedEvent();
    this.props.goback();
  };
  render() {
    let { isPhone } = this.state;
    let {
      diagnose_notes,
      btnTxt,
      status,
      knowledgepoint_explanation,
      diagnose_notes_audio,
      stem_explain_audio,
      btn,
    } = this.props;
    let content = knowledgepoint_explanation;
    content = content.replaceAll("<rt>", "<rt>&nbsp;");
    content = content.replaceAll("</rt>", "&nbsp;<rt>");
    // console.log("帮助", diagnose_notes_audio);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={status}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={[styles.container]}>
          {diagnose_notes_audio && stem_explain_audio ? (
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
                stem_explain_audio={stem_explain_audio}
                diagnose_notes_audio={diagnose_notes_audio}
              />
            </View>
          ) : null}
          <View
            style={[
              styles.contentWrap,
              diagnose_notes_audio && stem_explain_audio
                ? { marginLeft: pxToDp(360) }
                : {},
              isPhone && { height: pxToDpWidthLs(610) },
            ]}
          >
            <View
              style={[
                styles.content,
                isPhone && { height: pxToDpWidthLs(580) },
              ]}
            >
              {diagnose_notes?.length > 0 ? (
                <View style={[appStyle.flexTopLine]}>
                  <Image
                    source={require("../../../images/chineseHomepage/sentence/status2.png")}
                    style={[size_tool(66)]}
                  />
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
                    答案不对哦
                  </Text>
                </View>
              ) : null}
              {/* <View style={[, { width: pxToDp(1750), height: pxToDp(732), backgroundColor: '#fff', padding: pxToDp(32), borderRadius: pxToDp(32) }]}> */}
              <ScrollView style={{ height: pxToDp(668) }}>
                {diagnose_notes?.length > 0 ? (
                  <View>
                    {/* diagnose_notes_audio */}

                    <View
                      style={[
                        {
                          width: "100%",
                          backgroundColor: "#F5F6FA",
                          padding: pxToDp(40),
                          borderRadius: pxToDp(40),
                          marginBottom: pxToDp(40),
                          flexDirection: "row",
                        },
                      ]}
                    >
                      <View style={[{ flex: 1 }]}>
                        <Text style={[styles.titleTxt]}>答案解析:</Text>
                        <Text style={[styles.txtContent]}>
                          {diagnose_notes}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
                <Text style={[styles.titleTxt]}>知识点讲解：</Text>
                {this.props.audio ? (
                  <Audio
                    ref={this.audioRef}
                    audioUri={`${url.baseURL}${this.props.audio}`}
                    pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                    pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                    playBtnImg={require("../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                    playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                  />
                ) : null}
                {stem_explain_audio && !diagnose_notes_audio ? (
                  <View
                    style={[
                      appStyle.flexTopLine,
                      appStyle.flexAliCenter,
                      { marginRight: pxToDp(10), paddingTop: pxToDp(20) },
                    ]}
                  >
                    <Audio
                      audioUri={`${url.baseURL}${stem_explain_audio}`}
                      pausedBtnImg={require("../../../images/audio/audioPlay.png")}
                      pausedBtnStyle={{
                        width: pxToDp(198),
                        height: pxToDp(95),
                      }}
                      playBtnImg={require("../../../images/audio/audioPause.png")}
                      playBtnStyle={{ width: pxToDp(198), height: pxToDp(95) }}
                      rate={0.75}
                      onRef={(ref) => {
                        this.audioRef2 = ref;
                      }}
                    >
                      <RichShowView
                        width={pxToDp(1200)}
                        // value={this.props.knowledgepoint_explanation}
                        value={`<div id="yuanti">${content}</div>`}
                        size={2}
                      ></RichShowView>
                    </Audio>
                  </View>
                ) : (
                  <RichShowView
                    width={pxToDp(1200)}
                    // value={this.props.knowledgepoint_explanation}
                    value={`<div id="yuanti">${content}</div>`}
                    size={2}
                  ></RichShowView>
                )}
              </ScrollView>
              {/* </View> */}
            </View>

            {/* </View> */}
            {btn ? (
              btn
            ) : (
              <TouchableOpacity
                onPress={this.nextTopaicHelp}
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
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#373635",
  },
  nextText: {
    right: 0,
  },

  contentText: {
    fontSize: pxToDp(36),
    color: "#fff",
  },
  titleText: {
    color: "#AAAAAA",
    fontSize: pxToDp(32),
    marginBottom: pxToDp(20),
  },
  itemWrap: {
    backgroundColor: "#474747",
    height: pxToDp(360),
    borderRadius: pxToDp(24),
    padding: pxToDp(20),
  },

  container: {
    flex: 1,
    backgroundColor: "rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter,
    position: "relative",
    flexDirection: "row",
  },
  content: {
    width: pxToDp(1360),
    height: pxToDp(940),
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
    ...appFont.fontFamily_syst,
    color: "#475266",
    fontSize: pxToDp(40),
    lineHeight: pxToDp(50),
    flex: 1,
  },
});
export default CharacterHelpModal;
