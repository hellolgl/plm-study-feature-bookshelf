import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter,
  Dimensions,
  Modal,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
  borderRadius_tool,
  margin_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Header from "../../../../../component/Header";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";

import AnswerStatisticsModal from "../../../../../component/chinese/sentence/staticsModal";
import Audio from "../../../../../util/audio";
import fonts from "../../../../../theme/fonts";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";
import Sentence from "./sentence";
import ShowVideo from "./sentence/showVideo";
import VideoPlayer from "../../../../../component/chinese/VideoPlayer";
import Lottie from "lottie-react-native";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.navigation.state.params.data;
    this.state = {
      list: [],
      statuslist: [],
      listindex: 0,
      start_time: null,
      se_ids: [],
      type: data.type,
      inspect_name: data.inspect_name,
      name: data.name,
      showVideo: false,
      videoVisible: false,
      videosrc: "",
    };
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    this.grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam;
    this.info = userInfoJs;
    this.saveNum = 0;
  }
  componentDidMount() {
    this.getlist();
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentWillUnmount() {
    DeviceEventEmitter.emit("sentenceRecordList"); //返回页面刷新
  }

  getlist = () => {
    const data = this.props.navigation.state.params.data;
    const { knowledge_id, inspect } = data;
    // console.log('参数', data)
    // info.checkGrade  checkTeam
    let url = api.getKnowSentenceExercise,
      senobj = {
        knowledge_id,
        inspect,
      };
    Toast.loading("加载中...", 0);
    axios.get(url, { params: senobj }).then((res) => {
      Toast.hide();

      const data = res.data.data;
      // console.log("习题数量=========", senobj, data);

      if (data.length > 0) {
        let statuslist = [];
        data.map((item) => {
          statuslist.push("");
        });
        this.setState({
          list: data,
          statuslist,
          start_time: new Date().getTime(),
          videosrc: data[0].explanation_video,
          showVideo: data[0].explanation_video.length > 0,
        });
      }
    });
  };

  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
    this.goBack();
  };

  saveExercise = (parmas, isKeyExercise) => {
    const { listindex, statuslist } = this.state;
    let status = [...statuslist];
    status[listindex] = parmas.correct === "0" ? "right" : "wrong";
    this.setState({
      statuslist: status,
    });
  };
  nextOne = () => {
    const { listindex, list } = this.state;
    let indexnow = listindex + 1;
    this.setState({
      listindex: indexnow,
      videosrc: list[indexnow].explanation_video,
    });
  };
  lastOne = () => {
    const { listindex, list } = this.state;
    let indexnow = listindex - 1;
    this.setState({
      listindex: indexnow,
      videosrc: list[indexnow].explanation_video,
    });
  };
  hideVideoShow = () => {
    this.setState({
      videoVisible: false,
    });
  };

  showVideo = () => {
    this.setState({ showVideo: true });
  }

  render() {
    const {
      list,
      statuslist,
      listindex,
      type,
      showVideo,
      videoVisible,
      videosrc,
    } = this.state;
    // console.log("套题保存成功", type, name);
    const showleft = list.length > 1 && listindex !== 0,
      showright = list.length > 1 && listindex < list.length - 1;
    // let videosrc = list[statuslist]?.explanation_video;
    return (
      <ImageBackground
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        style={[
          { flex: 1 },
          padding_tool(Platform.OS === "ios" ? 60 : 20, 0, 20, 0),
        ]}
        resizeMode="cover"
      >
        {videosrc ? (
          <TouchableOpacity
            style={[
              size_tool(165, 138),
              {
                position: "absolute",
                zIndex: 999,
                right: pxToDp(112),
                top: pxToDp(67),
              },

              //
            ]}
            onPress={() => {
              this.showVideo()
            }}
          >
            <Lottie
              source={require("../../../../../res/json/chineseRobort1.json")}
              autoPlay
              style={[size_tool(210, 176)]}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={this.goBack}
          style={[
            {
              position: "absolute",
              top: pxToDp(48),
              left: pxToDp(20),
              zIndex: 9,
            },
          ]}
        >
          <Image
            source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
            style={[size_tool(120, 80)]}
          />
        </TouchableOpacity>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexCenter,
            { height: pxToDp(140) },
          ]}
        >
          {statuslist.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  size_tool(72),
                  appStyle.flexCenter,
                  borderRadius_tool(100),
                  {
                    borderWidth: pxToDp(6),
                    borderColor:
                      index === listindex ? "#FF964A" : "transparent",
                    backgroundColor:
                      item === "right"
                        ? "#16C792"
                        : item === "wrong"
                        ? "#F2645B"
                        : "transparent",
                    marginRight: pxToDp(
                      index === statuslist.length - 1 ? 0 : 24
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    { fontSize: pxToDp(36), color: item ? "#fff" : "#475266" },
                    fonts.fontFamily_jcyt_700,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            );
          })}
        </View>
        <View
          style={[
            { flex: 1, position: "relative" },
            padding_tool(0, 0, 20, 0),
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            appStyle.flexAliCenter,
          ]}
        >
          <View
            style={[
              borderRadius_tool(0, 40, 40, 0),
              {
                backgroundColor: showleft ? "#fff" : "transparent",
                height: "100%",
                width: pxToDp(57),
              },
            ]}
          ></View>

          {showleft ? (
            <TouchableOpacity
              style={[styles.lastBtnWrap]}
              onPress={this.lastOne}
            >
              <View style={[styles.nextBtnInner]}>
                <Image
                  source={require("../../../../../images/chineseHomepage/sentence/nextIcon.png")}
                  style={[
                    size_tool(24, 38),
                    {
                      transform: [{ rotateZ: "180deg" }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ) : null}
          {showright ? (
            <TouchableOpacity
              style={[styles.nextBtnWrap]}
              onPress={this.nextOne}
            >
              <View style={[styles.nextBtnInner]}>
                <Image
                  source={require("../../../../../images/chineseHomepage/sentence/nextIcon.png")}
                  style={[size_tool(24, 38)]}
                />
              </View>
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              margin_tool(0, 20, 0, 20),
              { flex: 1, position: "relative" },
            ]}
          >
            {list.length > 0 ? (
              <Sentence
                exercise={list[listindex]}
                saveExercise={this.saveExercise}
                type={type}
                isWrong={true}
                isStudy={true}
              />
            ) : (
              <View style={[appStyle.flexCenter, { flex: 1 }]}>
                <View>
                  <Text
                    style={[
                      appFont.fontFamily_jcyt_700,
                      { fontSize: pxToDp(60), color: "#475266" },
                    ]}
                  >
                    本知识点没有题目！
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={[
              borderRadius_tool(40, 0, 0, 40),
              {
                backgroundColor: showright ? "#fff" : "transparent",
                height: "100%",
                width: pxToDp(57),
              },
            ]}
          ></View>
        </View>
        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
          finishTxt={"完成"}
        ></AnswerStatisticsModal>
        {this.state.visibleGood ? (
          <View
            style={[
              appStyle.flexCenter,
              {
                width: "100%",
                height: Dimensions.get("window").height,
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                left: 0,
                top: 0,
              },
            ]}
          >
            <Image
              style={[size_tool(660)]}
              source={require("../../../../../images/chineseHomepage/pingyin/new/good.png")}
            />
          </View>
        ) : null}
        {showVideo ? (
          <ShowVideo
            close={() =>
              this.setState({
                showVideo: false,
              })
            }
            todo={() => {
              this.setState({
                videoVisible: true,
                showVideo: false,
              });
            }}
          />
        ) : null}

        {videosrc ? (
          <Modal
            visible={videoVisible}
            style={[{ backgroundColor: "red", width: "100%", height: "100%" }]}
            supportedOrientations={["portrait", "landscape"]}
          >
            <VideoPlayer
              hideVideoShow={this.hideVideoShow}
              // fileUrl={explanation?.explanation_video}
              fileUrl={videosrc}
              // fileUrl={"pinyin_new/video/074ace820d1b43a2a0635128c82e3f5d.mp4"}
              // paused={true}
            />
          </Modal>
        ) : null}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  nextBtnWrap: {
    ...size_tool(90, 93),
    ...borderRadius_tool(200),
    paddingBottom: pxToDp(4),
    backgroundColor: "#FF8429",
    position: "absolute",
    zIndex: 99,
    right: pxToDp(20),
  },
  nextBtnInner: {
    flex: 1,
    backgroundColor: "#FFB257",
    borderRadius: pxToDp(200),
    ...appStyle.flexCenter,
  },
  lastBtnWrap: {
    ...size_tool(90, 93),
    ...borderRadius_tool(200),
    paddingBottom: pxToDp(4),
    backgroundColor: "#FF8429",
    position: "absolute",
    zIndex: 99,
    left: pxToDp(20),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
