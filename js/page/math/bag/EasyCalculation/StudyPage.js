import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
  ActivityIndicator,
  DeviceEventEmitter,
  Modal,
} from "react-native";
import { appFont, appStyle, mathTopicStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  pxToDpHeight,
} from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import CircleStatistcs from "../../../../component/circleStatistcs";
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { changeTopicData } from "../../tools";
import VideoPlayer from "./VideoPlayer";
import Explanation from "../../../../component/math/Topic/Explanation";
import TopicStemTk from "../../../../component/math/Topic/TopicStemTk";
import CalculationStem from "../../../../component/math/Topic/CalculationStem";
import Stem from "../../../../component/math/Topic/Stem";
import topaicTypes from "../../../../res/data/MathTopaicType";
import SelectContinueModal from "../../../../component/math/SelectContinueModal";
import BackBtn from "../../../../component/math/BackBtn";

let style = mathTopicStyle["2"];

class StudyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.name = this.props.navigation.state.params.data.expand_name;
    this.code = this.props.navigation.state.params.data.expand_code;
    this.seleceLevel = this.props.navigation.state.params.data.seleceLevel;
    this.state = {
      currentTopic: "",
      videoIsVisible: false,
      visible: false,
    };
  }
  componentDidMount() {
    this.getData();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "refreshPage",
      (event) => {
        this.getData();
      }
    );
  }

  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }

  getData = () => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      code: this.code,
    };
    if (this.seleceLevel) obj.expand_level = this.seleceLevel;
    axios.get(api.getExpandStudy, { params: obj }).then((res) => {
      let data = res.data.data;
      data = changeTopicData(data, "easyCalculation");
      // console.log('*********',data)
      this.setState({
        currentTopic: data,
      });
    });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  hideVideoShow = () => {
    this.setState({ videoIsVisible: false });
  };

  doVideoAction = () => {
    this.setState({ videoIsVisible: true });
  };

  renderStem = () => {
    const { currentTopic, visible } = this.state;
    const { displayed_type_name } = currentTopic;
    let correct = 0;
    let style = mathTopicStyle["2"];
    if (displayed_type_name === topaicTypes.Fill_Blank) {
      return (
        <TopicStemTk
          my_style={style}
          onlySee={true}
          correct={correct}
          data={currentTopic}
        ></TopicStemTk>
      );
    }
    if (displayed_type_name === topaicTypes.Calculation_Problem) {
      return (
        <CalculationStem
          my_style={style}
          onlySee={true}
          correct={correct}
          data={currentTopic}
        ></CalculationStem>
      );
    }
    if (displayed_type_name === topaicTypes.Application_Questions) {
      return (
        <ApplicationStem
          my_style={style}
          onlySee={true}
          correct={correct}
          data={currentTopic}
        ></ApplicationStem>
      );
    }
    return <Stem my_style={style} data={currentTopic}></Stem>;
  };

  doTopic = () => {
    const { expand_level, max_level, now_level } =
      this.props.navigation.state.params.data;
    if (now_level === max_level && expand_level === max_level) {
      this.setState({
        visible: true,
      });
      return;
    }
    MathNavigationUtil.toEasyCalculationDoExercise({
      ...this.props,
      data: this.props.navigation.state.params.data,
    });
  };

  render() {
    const { currentTopic, videoIsVisible, visible } = this.state;
    const { exercise_video } = currentTopic;
    return (
      <ImageBackground
        style={[styles.container]}
        source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
      >
        <BackBtn goBack={this.goBack}></BackBtn>
        <Text style={[styles.header]}>{"学习—" + (this.name || "巧算")}</Text>
        {exercise_video ? (
          <TouchableOpacity
            style={[appStyle.flexAliCenter, styles.video_btn]}
            onPress={this.doVideoAction}
          >
            <Image
              style={[{ width: pxToDp(128), height: pxToDp(128) }]}
              source={require("../../../../images/MathEasyCalculation/xiongmao_bg.png")}
            ></Image>
            <View
              style={[styles.video_btn_wrap]}
              onPress={() => {
                this.startStudy(i);
              }}
            >
              <View
                style={[
                  styles.video_btn_wrap_inner,
                  appStyle.flexCenter,
                  appStyle.flexLine,
                ]}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    {
                      width: pxToDp(40),
                      height: pxToDp(40),
                      marginRight: pxToDp(16),
                    },
                  ]}
                  source={require("../../../../images/MathEasyCalculation/play_icon.png")}
                ></Image>
                <Text
                  style={[
                    { color: "#fff", fontSize: pxToDp(32) },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  视频讲解
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.practice_btn_wrap]}
          onPress={this.doTopic}
        >
          <View
            style={[
              styles.practice_btn_wrap_inner,
              appStyle.flexCenter,
              appStyle.flexLine,
            ]}
          >
            <Text
              style={[
                { color: "#fff", fontSize: pxToDp(40) },
                appFont.fontFamily_jcyt_700,
              ]}
            >
              练习
            </Text>
          </View>
        </TouchableOpacity>
        <ScrollView
          style={[styles.content]}
          contentContainerStyle={[styles.scrollContent]}
        >
          {this.renderStem()}
          {currentTopic ? (
            <Explanation data={currentTopic} my_style={style}></Explanation>
          ) : null}
        </ScrollView>
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          visible={videoIsVisible}
        >
          <VideoPlayer
            hideVideoShow={this.hideVideoShow}
            fileUrl={exercise_video}
          />
        </Modal>
        <SelectContinueModal
          data={this.props.navigation.state.params.data}
          visible={visible}
          close={() => {
            this.setState({ visible: false });
          }}
          goOn={() => {
            MathNavigationUtil.toEasyCalculationDoExercise({
              ...this.props,
              data: this.props.navigation.state.params.data,
            });
          }}
        ></SelectContinueModal>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(60),
    paddingLeft: pxToDp(184),
    paddingRight: pxToDp(184),
  },
  header: {
    textAlign: "center",
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#246666",
    marginBottom: pxToDp(40),
  },
  video_btn_wrap: {
    width: pxToDp(268),
    height: pxToDp(100),
    backgroundColor: "#F07C39",
    borderRadius: pxToDp(50),
    paddingBottom: pxToDp(5),
  },
  video_btn_wrap_inner: {
    width: pxToDp(268),
    height: "100%",
    backgroundColor: "#FF964A",
    borderRadius: pxToDp(50),
  },
  video_btn: {
    position: "absolute",
    zIndex: 1,
    right: pxToDp(264),
    top: pxToDp(52),
  },
  content: {
    borderTopLeftRadius: pxToDp(40),
    borderTopRightRadius: pxToDp(40),
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: pxToDp(160),
    paddingLeft: pxToDp(80),
    paddingRight: pxToDp(380),
    paddingTop: pxToDp(60),
  },
  practice_btn_wrap: {
    width: pxToDp(240),
    height: pxToDp(240),
    backgroundColor: "#00987F",
    borderRadius: pxToDp(120),
    paddingBottom: pxToDp(10),
    position: "absolute",
    bottom: pxToDp(60),
    right: pxToDp(60),
    zIndex: 1,
  },
  practice_btn_wrap_inner: {
    width: pxToDp(240),
    height: "100%",
    backgroundColor: "#00B295",
    borderRadius: pxToDp(120),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(StudyPage);
