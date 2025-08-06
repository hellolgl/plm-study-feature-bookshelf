import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  DeviceEventEmitter,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";
// import Audio from "../../../../../util/audio"
import url from "../../../../../util/url";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import VideoPlayer from "../../../../math/bag/EasyCalculation/VideoPlayer";
import Audio from "../../../../../util/audio/audio";
import Btn from "../../../../../component/chinese/btn";

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isStartAudioT: false,
      audio: "",
      isPasued: true,
      thinking_tips: "",
      video: "",
      videoIsVisible: false,
      has_record: false,
      has_exercise: false,
    };
    this.audio = React.createRef();
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
    this.stopAudio();
  };

  componentWillUnmount() {
    DeviceEventEmitter.emit("compostition");
    this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "compositionWrite",
      () => this.getlist()
    );
    this.getlist();
  }

  getlist() {
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {};
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.te_id = this.props.navigation.state.params.data.te_id;
    axios.get(api.getChineseCompositionWrite, { params: data }).then((res) => {
      if (res.data.err_code === 0) {
        console.log("数据", res.data.data);
        this.setState({
          thinking_tips: res.data.data.content,
          audio: res.data.data.audio,
          video: res.data.data.video,
          has_record: res.data.data.has_record,
          has_exercise: res.data.data.has_exercise,
        });
      }
    });
  }
  stopAudio = () => {
    this.audio?.sound && this.audio?.pausedEvent();
  };
  hideVideoShow = () => this.setState({ videoIsVisible: false });
  lookVideo = () => this.setState({ videoIsVisible: true });
  toRecord = () => {
    const { has_record, has_exercise } = this.state;
    if (!has_exercise) {
      return;
    }
    if (has_record) {
      NavigationUtil.toChineseCompositionWriteRecord({
        ...this.props,
        data: {
          has_record,
          te_id: this.props.navigation.state.params.data.te_id,
        },
      });
    } else {
      NavigationUtil.toChineseCompositionWriteDoExercise({
        ...this.props,
        data: {
          has_record,
          te_id: this.props.navigation.state.params.data.te_id,
        },
      });
    }
  };
  render() {
    const { has_exercise, thinking_tips, audio, video } = this.state;
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        resizeMode="cover"
      >
        <View
          style={[
            appStyle.flexLine,
            appStyle.flexJusBetween,
            padding_tool(0, 64, 0, 64),
            { width: "100%", height: pxToDp(128) },
          ]}
        >
          <TouchableOpacity onPress={this.goBack}>
            <Image
              source={require("../../../../../images/chineseHomepage/pingyin/new/back.png")}
              style={[size_tool(120, 80)]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_jcyt_700,
              { fontSize: pxToDp(40), color: "#475266" },
            ]}
          >
            写作技法
          </Text>

          <View
            onPress={() => this.setState({ lookMsg: true })}
            style={[size_tool(120, 80)]}
          ></View>
        </View>
        <View
          style={[
            {
              width: "100%",
              flex: 1,
              marginTop: pxToDp(-6),
              alignItems: "center",
              paddingBottom: pxToDp(60),
            },
          ]}
        >
          <View
            style={[
              {
                width: pxToDp(1930),
                flex: 1,
                backgroundColor: "#fff",
              },
              borderRadius_tool(60),
              padding_tool(40),
            ]}
          >
            <ScrollView>
              {audio || video ? (
                <View
                  style={[appStyle.flexTopLine, padding_tool(40, 0, 10, 0)]}
                >
                  {audio ? (
                    <Audio
                      audioUri={`${url.baseURL}${audio}`}
                      pausedBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioPlay.png")}
                      pausedBtnStyle={{
                        width: pxToDp(268),
                        height: pxToDp(228),
                      }}
                      playBtnImg={require("../../../../../images/chineseHomepage/composition/explainAudioStop.png")}
                      playBtnStyle={{ width: pxToDp(268), height: pxToDp(228) }}
                      onRef={(ref) => (this.audio = ref)}
                    />
                  ) : null}
                  {video ? (
                    <TouchableOpacity
                      onPress={this.lookVideo}
                      style={[size_tool(268, 228)]}
                    >
                      <Image
                        style={[size_tool(268, 228)]}
                        source={require("../../../../../images/chineseHomepage/composition/explainVideolay.png")}
                      ></Image>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              <RichShowView
                width={pxToDp(1800)}
                value={thinking_tips}
              ></RichShowView>
            </ScrollView>
            {has_exercise? (
              <View style={[appStyle.flexAliEnd]}>
                <Btn
                  styleObj={{
                    bgColor: has_exercise ? "#FF964A" : "#fff",
                    bottomColor: has_exercise ? "#F07C39" : "#E7E7F2",
                    fontColor: has_exercise ? "#fff" : "#ccc",
                    borderRadius: pxToDp(200),
                    height: pxToDp(120),
                    fontSize: pxToDp(40),
                    width: pxToDp(280),
                  }}
                  clickBtn={this.toRecord}
                  txt={"开始答题"}
                />
              </View>
            ) : null}
          </View>
          <Modal
            supportedOrientations={["portrait", "landscape"]}
            visible={this.state.videoIsVisible}
          >
            <VideoPlayer hideVideoShow={this.hideVideoShow} fileUrl={video} />
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
  },
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setUser(data) {
      dispatch(actionCreators.setUserInfoNow(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
