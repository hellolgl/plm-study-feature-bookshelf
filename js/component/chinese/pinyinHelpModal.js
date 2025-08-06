import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  // Modal,
  ScrollView,
  Platform,
} from "react-native";
import { appStyle, appFont } from "../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  fontFamilyRestoreMargin,
} from "../../util/tools";
import Sound from "react-native-sound";
import RichShowView from "../chinese/newRichShowView";
import url from "../../util/url";
// import { Modal as ModalCenter } from "antd-mobile-rn";
import { Modal } from "antd-mobile-rn";
import Audio from "../../util/audio/audio";
let baseUrl = url.baseURL;

class CharacterHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
    };
    this.audioHelp = undefined;
  }

  nextTopaicHelp = () => {
    this.audioPaused();
    this.props.goback();
  };
  playHeplAudio = () => {
    const { paused } = this.state;

    this.setState({
      paused: !paused,
    });
  };

  audioPaused = () => {
    this.setState({
      paused: true,
    });
  };
  render() {
    let { paused } = this.state;
    let { diagnose_notes } = this.props;
    // console.log('讲解', this.props)
    return (
      <Modal
        transparent={true}
        visible={this.props.status}
        style={[
          {
            width: pxToDp(2048),
            height: "100%",
            backgroundColor: "regba(0,0,0,0)",
          },
          appStyle.flexCenter,
        ]}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View
          style={[
            { width: pxToDp(1280), height: pxToDp(860), position: "relative" },
            appStyle.flexCenter,
          ]}
        >
          <View
            style={[
              {
                height: pxToDp(740),
                width: pxToDp(1280),
                backgroundColor: "#DAE2F2",
                borderRadius: pxToDp(80),
                position: "relative",
              },
            ]}
          >
            <View
              style={[
                size_tool(1280, 736),
                appStyle.flexCenter,
                padding_tool(20, 100, 60, 100),
                { backgroundColor: "#fff", borderRadius: pxToDp(80) },
              ]}
            >
              {diagnose_notes?.length > 0 ? (
                <View
                  style={[
                    {
                      backgroundColor: "#fff",
                      height: pxToDp(200),
                      marginBottom: pxToDp(20),
                    },
                    appStyle.flexJusCenter,
                    borderRadius_tool(40),
                    padding_tool(10, 20, 10, 20),
                  ]}
                >
                  <ScrollView>
                    <Text
                      style={[
                        {
                          fontSize: pxToDp(32),
                          color: "red",
                          marginBottom: pxToDp(10),
                        },
                        appFont.fontFamily_syst,
                        fontFamilyRestoreMargin({ marginBottom: pxToDp(20) }),
                      ]}
                    >
                      答案解析：
                    </Text>
                    <Text
                      style={[
                        { fontSize: pxToDp(32) },
                        appFont.fontFamily_syst,
                      ]}
                    >
                      {diagnose_notes}
                    </Text>
                  </ScrollView>
                </View>
              ) : null}
              <View
                style={[
                  { backgroundColor: "#fff", flex: 1 },
                  borderRadius_tool(40),
                  padding_tool(40),
                ]}
              >
                {/* <View style={[, { width: pxToDp(1750), height: pxToDp(732), backgroundColor: '#fff', padding: pxToDp(32), borderRadius: pxToDp(32) }]}> */}
                <ScrollView style={{ height: pxToDp(668) }}>
                  {this.props.audio ? (
                    // <Audio uri={baseUrl + this.props.audio} paused={paused} pausedEvent={this.audioPaused} />
                    <Audio
                      audioUri={`${baseUrl}${this.props.audio}`}
                      pausedBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                      pausedBtnStyle={{
                        width: pxToDp(200),
                        height: pxToDp(120),
                      }}
                      playBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                      playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                    />
                  ) : null}

                  <RichShowView
                    value={
                      this.props.knowledgepoint_explanation
                        ? `${this.props.knowledgepoint_explanation}`
                        : ""
                    }
                    size={4}
                    width={pxToDp(960)}
                    // otherStyle={'text-align:center'}
                  ></RichShowView>
                </ScrollView>
                {/* </View> */}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.footBtn, appStyle.flexCenter, size_tool(280, 120)]}
            onPress={this.nextTopaicHelp}
          >
            <Image
              source={require("../../images/chineseHomepage/pingyin/new/closeHelp.png/")}
              style={[size_tool(280, 120)]}
            />
          </TouchableOpacity>
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
  contentWrap: {
    marginRight: pxToDp(20),
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
  footBtn: {
    // backgroundColor: 'red',
    flex: 1,
    position: "absolute",
    bottom: pxToDp(-0),
    left: "50%",
    marginLeft: pxToDp(-140),
  },
});
export default CharacterHelpModal;
