import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import {
  borderRadius_tool,
  margin_tool,
  padding_tool,
  pxToDp,
  size_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
// import RichShowView from "../../../../../component/chinese/RichShowView";
import Sound from "react-native-sound";
import url from "../../../../../util/url";

import Header from "../../../../../component/Header";
import { combineReducers, compose } from "redux";
import { appStyle, appFont } from "../../../../../theme";
// import RichShowView from "../../../../../component/chinese/sentence/richView";
import RichShowView from "../../../../../component/chinese/newRichShowView";

import Audio from "../../../../../util/audio/audio";
const titleType = [
  {
    name: "现代文",
    backgroundColor: "#9876E5",
  },
  {
    name: "古诗词",
    backgroundColor: "#E7B452",
  },
  {
    name: "其他",
    backgroundColor: "#61C9E7",
  },
];
class SpeReadingExplain extends PureComponent {
  constructor(props) {
    super(props);
    let infoData = this.props.navigation.state.params.data;
    this.state = {
      explain: "",
      title: infoData.name,
      audio: "",
      isStartAudio: false,
      type: infoData.type,
      has_exercise: false,
      article_type: "",
      has_article: false,
    };
    this.audio = React.createRef();
  }

  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "readExplain",
      () => this.getList()
    );
    this.getList();
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("backReadingHome"); //返回页面刷新
    this.eventListenerRefreshPage.remove();
  }
  getList(category) {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();

    let infoData = this.props.navigation.state.params.data;
    let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    let name = infoData.name;
    console.log(infoData, "userInfoJs");

    axios
      .get(`${api.chinesDailySpeReadingExplain}`, {
        params: {
          grade_term,
          name,
          article_type: infoData.category,
        },
      })
      .then((res) => {
        if (res.data.err_code === 0) {
          console.log("get123", res.data.data);
          this.setState({
            explain: res.data.data.intro,
            audio: res.data.data.audio,
            has_exercise: res.data.data.has_records,
            article_type: infoData.category,
            has_article: res.data.data.has_article_exercise,
          });
        }
      });
  }
  goBack = () => {
    this.audio?.sound && this.audio?.pausedEvent();
    NavigationUtil.goBack(this.props);
  };

  todoExercise = () => {
    const { has_exercise, article_type, title } = this.state;
    let data = {
      has_record: has_exercise,
      article_type,
      name: title,
      type: "spe",
    };
    if (has_exercise) {
      NavigationUtil.toNewReadingRecord({
        ...this.props,
        data,
      });
    } else {
      NavigationUtil.toNewReadingSpeExercise({
        ...this.props,
        data,
      });
    }
  };

  render() {
    const { audio, title, type, has_exercise, has_article } = this.state;
    let explain = this.state.explain;
    explain = explain.replaceAll(
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
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../../../../images/chineseHomepage/reading/homeBg.png")}
          style={[
            { flex: 1 },
            padding_tool(Platform.OS === "ios" ? 60 : 20, 20, 0, 20),
          ]}
          resizeMode="cover"
        >
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <TouchableOpacity
              style={[size_tool(120, 80)]}
              onPress={this.goBack}
            >
              <Image
                style={[size_tool(120, 80)]}
                source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              />
            </TouchableOpacity>
            <Text
              style={[
                appFont.fontFamily_jcyt_700,
                { fontSize: pxToDp(58), color: "#475266" },
              ]}
            >
              能力提升宝典
            </Text>
            <View
              style={[
                size_tool(120, 80),
                {},
                borderRadius_tool(200),
                appStyle.flexCenter,
              ]}
            ></View>
          </View>

          <View
            style={[
              { flex: 1, backgroundColor: "#fff", position: "relative" },
              appStyle.flexCenter,
              margin_tool(0, 100, 75, 100),
              borderRadius_tool(80),
              padding_tool(80),
            ]}
          >
            {/* 头部 */}

            <View
              style={{
                width: "100%",
                // backgroundColor: 'pink',
                flex: 1,
              }}
            >
              <ScrollView
                style={[
                  {
                    // height: pxToDp(530),
                    flex: 1,
                  },
                ]}
              >
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    { marginBottom: pxToDp(20) },
                  ]}
                >
                  <Text
                    style={[
                      appFont.fontFamily_syst_bold,
                      {
                        fontSize: pxToDp(48),
                        color: "#445268",
                        marginRight: pxToDp(20),
                      },
                    ]}
                  >
                    {title}类文章
                  </Text>
                  <View
                    style={[
                      size_tool(125, 45),
                      borderRadius_tool(20),
                      appStyle.flexCenter,
                      { backgroundColor: titleType[type].backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        appFont.fontFamily_syst_bold,
                        {
                          fontSize: pxToDp(32),
                          color: "#fff",
                        },
                      ]}
                    >
                      {titleType[type].name}
                    </Text>
                  </View>
                </View>
                <View
                  style={[appStyle.flexTopLine, { paddingBottom: pxToDp(200) }]}
                >
                  {audio ? (
                    <Audio
                      onRef={(ref) => (this.audio = ref)}
                      audioUri={`${url.baseURL}${audio}`}
                      pausedBtnImg={require("../../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                      pausedBtnStyle={{
                        width: pxToDp(200),
                        height: pxToDp(120),
                      }}
                      playBtnImg={require("../../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                      playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                    />
                  ) : null}

                  {/* <RichShowView
                                    width={pxToDp(1480)}
                                    value={
                                        this.state.explain
                                    }
                                ></RichShowView> */}
                  <View style={[{ flex: 1 }]}>
                    <RichShowView
                      width={pxToDp(1600)}
                      size={2}
                      value={`${explain}`}
                    ></RichShowView>
                  </View>
                </View>
              </ScrollView>
            </View>

            {has_article ? (
              <TouchableOpacity
                onPress={this.todoExercise}
                style={[
                  size_tool(240),
                  borderRadius_tool(240),
                  {
                    paddingBottom: pxToDp(8),
                    backgroundColor: has_exercise ? "#17A97D" : "#F07C39",
                    position: "absolute",
                    bottom: pxToDp(32),
                    right: pxToDp(32),
                  },
                ]}
              >
                <View
                  style={[
                    {
                      flex: 1,
                      backgroundColor: has_exercise ? "#26C595" : "#FF964A",
                    },
                    borderRadius_tool(240),
                    appStyle.flexCenter,
                  ]}
                >
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_700,
                      { fontSize: pxToDp(48), color: "#fff" },
                    ]}
                  >
                    {"测一测"}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  size_tool(240),
                  borderRadius_tool(240),
                  {
                    paddingBottom: pxToDp(8),
                    backgroundColor: "#CFDAE9",
                    position: "absolute",
                    bottom: pxToDp(32),
                    right: pxToDp(32),
                  },
                ]}
              >
                <View
                  style={[
                    { flex: 1, backgroundColor: "#E5E9EF" },
                    borderRadius_tool(240),
                    appStyle.flexCenter,
                  ]}
                >
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_700,
                      { fontSize: pxToDp(48), color: "#fff" },
                    ]}
                  >
                    {"测一测"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  header: {
    height: pxToDp(110),
    backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(48),
    position: "relative",
    justifyContent: "space-between",
  },
  left: {
    width: "100%",
    height: pxToDp(590),
    // backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: pxToDp(40),
  },

  topItem: {
    width: pxToDp(954),
    height: pxToDp(124),
    marginRight: pxToDp(40),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: pxToDp(32),
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(SpeReadingExplain);
