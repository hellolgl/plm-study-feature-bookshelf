import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Text,
  Platform,
} from "react-native";
import { appFont, appStyle } from "../../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
} from "../../../../../../util/tools";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { ScrollView } from "react-native-gesture-handler";
import VideoPlayer from "../../../../../../component/chinese/VideoPlayer";
import RichShowView from "../../../../../../component/richShowViewNew";
// import RichShowView from '../../../../../../component/chinese/newRichShowView'

import Audio from "../../../../../../util/audio";
import url from "../../../../../../util/url";
import fonts from "../../../../../../theme/fonts";
// import VideoPlayer from "../../../../../math/bag/EasyCalculation/VideoPlayer";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    let language_data = props.language_data.toJS();
    this.state = {
      list: [{}, {}, {}, {}],
      isloading: false,
      visible: false,
      explanation: {},
      isPasued: true,
      videoIsVisible: false,
      language_data,
      tag: false,
    };
  }
  componentDidMount() {
    // console.log("参数", this.props.data);
    axios
      .get(api.chinesePinyinGetKnowDetail, {
        params: { p_id: this.props.data.p_id },
      })
      .then((res) => {
        // console.log("回调", res.data.data);
        if (res.data.err_code === 0) {
          this.setState({
            isloading: true,
            explanation: res.data.data,
          });
        }
      });
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  audioPaused = () => this.setState({ isPasued: true });
  palyAudio = () => this.setState({ isPasued: !this.state.isPasued });
  hideVideoShow = () => {
    this.setState({ videoIsVisible: false }, () => {
      if (this.state.tag) {
        this.props.showStar();
      }
    });
  };
  lookVideo = () => {
    this.setState({ videoIsVisible: true, isPasued: true });
    const {token} = this.props
    if(!token){
      return
    }
    axios
      .post(api.savePinyinListenAndWRiteStatus, {
        listen_status: "1",
        p_id: this.props.data.p_id,
      })
      .then((res) => {
        console.log("返回来", res.data);
        if (res.data.err_code === 0) {
          this.setState({
            tag: res.data.data.tag,
          });
        }
      });
  };
  parseRichText = (richText = "") => {
    // console.log('123123123123123123', richText)
    const tagPattern = /<([^>]+)>/g;
    const tags = String(richText).split(tagPattern);
    // console.log('123123123123123123', tags)

    return tags.map((tag, index) => {
      if (tag.startsWith("span")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {tag.replace(/<\/?b>/g, "")}
          </Text>
        );
      } else if (tag.startsWith("<i>")) {
        return (
          <Text key={index} style={{ fontStyle: "italic" }}>
            {tag.replace(/<\/?i>/g, "")}
          </Text>
        );
      } else {
        return <Text key={index}>{tag}</Text>;
      }
    });
  };
  render() {
    const { explanation, isPasued, language_data } = this.state;
    const { show_translate } = language_data;
    // const videosrc = 'pinyin_new/video/93a5959b73dd4ea0821cd544274f785a.mp4'
    const videosrc = explanation.explanation_video;
    console.log("图片", explanation);
    let richText = show_translate
      ? explanation?.knowledge_point_explanation +
        explanation?.translate_explanation?.en
      : explanation?.knowledge_point_explanation;
    const parsed = this.parseRichText(richText);
    return (
      <View style={[padding_tool(), { flex: 1 }]}>
        <View
          style={[
            { flex: 1, position: "relative" },
            appStyle.flexJusCenter,
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
          ]}
        >
          <View
            style={[
              {
                width: "100%",
                borderRadius: pxToDp(16),
                flex: 1,
                paddingBottom: pxToDp(6),
                marginBottom: pxToDp(20),
              },
            ]}
          >
            <View
              style={[
                appStyle.flexCenter,
                { flex: 1, padding: pxToDp(40), borderRadius: pxToDp(16) },
              ]}
            >
              {videosrc ? (
                <View
                  style={[size_tool(480, 540), { marginBottom: pxToDp(20) }]}
                >
                  <View
                    style={[
                      size_tool(480),
                      appStyle.flexCenter,
                      {
                        position: "relative",
                        borderColor: "#4C94FF",
                        borderWidth: pxToDp(8),
                        borderRadius: pxToDp(600),
                        zIndex: 999,
                        marginBottom: pxToDp(60),
                      },
                    ]}
                  >
                    <Image
                      style={[
                        size_tool(440),
                        { backgroundColor: "#000", borderRadius: pxToDp(400) },
                      ]}
                      source={{ uri: url.baseURL + explanation.picture }}
                    />
                    <View
                      style={[
                        size_tool(240, 120),
                        borderRadius_tool(40, 40, 0, 40),
                        appStyle.flexCenter,
                        {
                          backgroundColor: "#FFC85D",
                          position: "absolute",
                          top: pxToDp(40),
                          left: pxToDp(-120),
                          transform: [
                            {
                              rotateZ: "8deg",
                            },
                          ],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            fontSize: pxToDp(80),
                            color: "#475266",
                            ...appFont.fonts_pinyin,
                            lineHeight: pxToDp(90),
                            // fontFamily: Platform.OS === 'ios' ? 'AaBanruokaishu (Non-Commercial Use)' : '1574320058',
                          },
                        ]}
                      >
                        {this.props.data.knowledge_point}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={this.lookVideo}
                    style={[
                      {
                        position: "absolute",
                        left: pxToDp(180),
                        bottom: pxToDp(-0),
                        zIndex: 999,
                      },
                    ]}
                  >
                    <Image
                      style={[size_tool(120)]}
                      source={require("../../../../../../images/chineseHomepage/pingyin/new/playVideo.png")}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              {explanation?.explanation_audio ? (
                <View style={[{ height: pxToDp(80) }]}>
                  <TouchableOpacity onPress={this.palyAudio}>
                    <Image
                      style={[size_tool(60)]}
                      source={require("../../../../../../images/chineseHomepage/pingyin/studyHaveVoice.png")}
                    />
                  </TouchableOpacity>
                  <Audio
                    uri={`${url.baseURL}${explanation?.explanation_audio}`}
                    paused={isPasued}
                    pausedEvent={this.audioPaused}
                  />
                </View>
              ) : null}

              <RichShowView
                fontIndex={0}
                width={pxToDp(1540)}
                size={2}
                value={`<div id="yuanti" >${
                  show_translate
                    ? explanation?.knowledge_point_explanation +
                      explanation?.translate_explanation?.en
                    : explanation?.knowledge_point_explanation
                }</div>`}
              ></RichShowView>
            </View>
          </View>

          {videosrc ? (
            <Modal
                supportedOrientations={['portrait', 'landscape']}
                visible={this.state.videoIsVisible}>
              <VideoPlayer
                hideVideoShow={this.hideVideoShow}
                // fileUrl={explanation?.explanation_video}
                fileUrl={videosrc}
                // paused={true}
              />
            </Modal>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    language_data: state.getIn(["languageChinese", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
