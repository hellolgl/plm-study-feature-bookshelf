import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Modal,
  DeviceEventEmitter,
} from "react-native";
import { appStyle } from "../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
} from "../../../../../util/tools";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { ScrollView } from "react-native-gesture-handler";
import SleceLanguage from "../../../../../component/chinese/selectLanguage";
import fonts from "../../../../../theme/fonts";
import BackBtn from "../../../../../component/chinese/pinyin/backBtn";
import VideoPlayer from "../../../../math/bag/EasyCalculation/VideoPlayer";
import Listen from "./component/listen";
import pinyin from "../../../../../util/languageConfig/chinese/pinyin";
import Speak from "./component/speak";
import Study from "./component/study";
import Write from "./component/write";
import * as childrenCreators from "../../../../../action/children";
import userInfo from "../../../../../reducer/userInfo";
import Congrats from "../../../../../component/Congrats";
import * as userAction from "../../../../../action/userInfo/index";
import {getRewardCoinLastTopic} from '../../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    let language_data = props.language_data.toJS();
    const { main_language_map, other_language_map, type, show_type } = language_data;
    this.eventListener = undefined
    this.state = {
      type: "1",
      zimuList: [],
      zimuObj: {},
      show_language_modal: false,
      btnText: {},
      zimuList2: [],
      lookWhy: false,
      videoIsVisible: false,
      titleList: [
        {
          main: main_language_map.listen,
          other: other_language_map.listen,
          pinyin: pinyin.listen,
        },
        {
          main: main_language_map.speak,
          other: other_language_map.speak,
          pinyin: pinyin.speak,
        },
        {
          main: main_language_map.study,
          other: other_language_map.study,
          pinyin: pinyin.study,
        },
        {
          main: main_language_map.write,
          other: other_language_map.write,
          pinyin: pinyin.write,
        },
      ],
      language_data,
      nowindex: 0,
      testTxt: {
        main: main_language_map.test,
        other: other_language_map.test,
        pinyin: pinyin.test,
      },
      recordTxt: {
        main: main_language_map.record,
        other: other_language_map.record,
        pinyin: pinyin.record,
      },
      hasStatus: false,
    };
  }
  componentDidMount() {
    this.getExerciseStatus();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "backCheckType",
      () => this.getExerciseStatus()
    );
  }

  getExerciseStatus = () => {
    axios
      .get(api.getPinyinExerciseStatus, {
        params: {
          p_id: this.props.navigation.state.params.data.p_id,
        },
      })
      .then((res) => {
        console.log("回调", res.data.data);
        if (res.data.err_code === 0) {
          this.setState({
            hasStatus: res.data.data.tag,
          });
        }
      });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  toLookRecord = (item) => {
    const { hasStatus } = this.state;
    let data = {
      p_id: this.props.navigation.state.params.data.p_id,
      status: hasStatus,
    };
    if (hasStatus) {
      const { token } = this.props;
      if (!token) {
        NavigationUtil.resetToLogin(this.props);
        return;
      }
      NavigationUtil.toChinesePinyinExerciseRecord({
        ...this.props,
        data,
      });
    } else {
      NavigationUtil.toChinesePinyinDoExercise({
        ...this.props,
        data,
      });
    }
  };

  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let language_data = props.language_data.toJS();
    const { main_language_map, other_language_map, type, show_type } =
      language_data;
    // console.log('切换语言: ', language_data)
    if (type !== tempState.language_data.type) {
      // 切换语言
      tempState.language_data = language_data;
      let btnText = {};
      tempState.btnText = btnText;
      return tempState;
    }
    return null;
  }
  lookLast = (isnext) => {
    // this.setState({
    //     videoIsVisible: true
    // })
    // NavigationUtil.toChinesePinyinLookAllWord({ ...this.props, data: this.props.navigation.state.params.data })
    const { nowindex } = this.state;
    let nowtype = nowindex - 0;
    if (isnext) {
      nowtype === 3 ? (nowtype = 0) : ++nowtype;
    } else {
      nowtype === 0 ? (nowtype = 3) : --nowtype;
    }
    console.log("nowtype", nowtype);

    this.setState({
      nowindex: nowtype,
    });
  };
  showStar = () => {
    console.log("星星");
    const userInfo = this.props.userInfo.toJS();
    const { isGrade } = userInfo;
    if (!isGrade){
      // 幼小
      getRewardCoinLastTopic().then(res => {
        if(res.isReward){
          // 展示奖励弹框,在动画完后在弹统计框
          this.eventListener = DeviceEventEmitter.addListener(
            "rewardCoinClose",
            () => {
              this.props.getStars("pinyin");
              this.eventListener && this.eventListener.remove()
            }
          );
        }else{
          this.props.getStars("pinyin");
        }
      })
    }else{
      this.props.getRewardCoin()
    }
  };
  resetToLogin = () => {
    NavigationUtil.resetToLogin(this.props);
  };
  render() {
    const {
      type,
      btnText,
      language_data,
      zimuObj,
      testTxt,
      titleList,
      nowindex,
      hasStatus,
      recordTxt,
    } = this.state;
    const { show_main, show_translate, main_language } = language_data;
    // console.log(zimuObj)
    return (
      <ImageBackground
        source={
          Platform.OS === "ios"
            ? require("../../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png")
            : require("../../../../../images/chineseHomepage/pingyin/new/wrapBg.png")
        }
        style={[
          { flex: 1, paddingTop: pxToDp(Platform.OS === "ios" ? 40 : 0) },
        ]}
      >
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            padding_tool(20),
            {
              position: "absolute",
              top: pxToDp(Platform.OS === "ios" ? 40 : 0),
              zIndex: 999,
            },
          ]}
        >
          <BackBtn
            show_main={show_main}
            show_translate={show_translate}
            back_ch={btnText.back_ch}
            back_zh={btnText.back_zh}
            onPress={this.goBack}
          />
        </View>
        <View
          style={[
            { height: pxToDp(240) },
            appStyle.flexCenter,
            appStyle.flexTopLine,
          ]}
        >
          {titleList.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ nowindex: index });
                }}
                style={[
                  size_tool(200, 160),
                  borderRadius_tool(40),
                  {
                    zIndex: 10,
                    backgroundColor:
                      index === nowindex ? "#FF9D42" : "transparent",
                  },
                ]}
              >
                <View
                  style={[
                    size_tool(200, 150),
                    borderRadius_tool(40),
                    appStyle.flexCenter,
                    {
                      backgroundColor:
                        index === nowindex ? "#FFC85D" : "transparent",
                    },
                  ]}
                >
                  {show_main && main_language === "zh" ? (
                    <Text style={[styles.pinyinTitleFont]}>{item.pinyin}</Text>
                  ) : null}
                  {show_main ? (
                    <Text style={[styles.titleFont]}>{item.main}</Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[{ opacity: 0.5 }, styles.tranTitleFont]}>
                      {item.other}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[
            { flex: 1 },
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            padding_tool(0, 0, 60, 0),
          ]}
        >
          <TouchableOpacity
            onPress={this.lookLast.bind(this, false)}
            style={[{ marginRight: pxToDp(36) }]}
          >
            <Image
              style={[size_tool(100)]}
              source={require("../../../../../images/chineseHomepage/pingyin/new/last.png")}
            />
          </TouchableOpacity>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: nowindex === 3 ? "#3E2D21" : "#EDEDF4",
                borderRadius: pxToDp(80),
                paddingBottom: pxToDp(8),
              },
            ]}
          >
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: nowindex === 3 ? "#1F1F1F" : "#fff",
                  borderRadius: pxToDp(80),
                  width: "100%",
                },
                appStyle.flexAliCenter,
              ]}
            >
              {nowindex === 0 ? (
                <ScrollView style={[{ width: "100%", height: "100%" }]}>
                  <Listen
                    showStar={this.showStar}
                    data={this.props.navigation.state.params.data}
                  />
                </ScrollView>
              ) : null}
              {nowindex === 1 ? (
                <View>
                  <Speak
                    resetToLogin={this.resetToLogin}
                    showStar={this.showStar}
                    data={this.props.navigation.state.params.data}
                  />
                </View>
              ) : null}
              {nowindex === 2 ? (
                <View>
                  <Study
                    {...this.props}
                    data={this.props.navigation.state.params.data}
                    showStar={this.showStar}
                  />
                </View>
              ) : null}
              {nowindex === 3 ? (
                <View>
                  <Write
                    {...this.props}
                    data={this.props.navigation.state.params.data}
                    showStar={this.showStar}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={this.lookLast.bind(this, true)}
            style={[{}]}
          >
            <Image
              style={[size_tool(100)]}
              source={require("../../../../../images/chineseHomepage/pingyin/new/next.png")}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={this.toLookRecord}
          style={[
            size_tool(240),
            {
              position: "absolute",
              right: pxToDp(40),
              bottom: pxToDp(40),
              zIndex: 999,
              backgroundColor: hasStatus ? "#00927A" : "#F07C39",
              borderRadius: pxToDp(200),
              paddingBottom: pxToDp(6),
            },
          ]}
        >
          <View
            style={[
              appStyle.flexCenter,
              {
                backgroundColor: hasStatus ? "#00B295" : "#FF964A",
                borderRadius: pxToDp(200),
                flex: 1,
              },
            ]}
            // source={hasStatus ? require('../../../../../images/chineseHomepage/pingyin//new/pinyintestMeBg1.png') : require('../../../../../images/chineseHomepage/pingyin//new/testMeBg.png')}
          >
            {show_main && main_language === "zh" ? (
              <Text style={[styles.pinyinFont, { color: "#fff" }]}>
                {hasStatus ? recordTxt.pinyin : testTxt.pinyin}
              </Text>
            ) : null}
            {show_main ? (
              <Text style={[styles.mainFont, { color: "#fff" }]}>
                {hasStatus ? recordTxt.main : testTxt.main}
              </Text>
            ) : null}
            {show_translate ? (
              <Text
                style={[
                  styles.tranFont,
                  { opacity: 0.5, color: "#fff", fontSize: pxToDp(36) },
                ]}
              >
                {hasStatus ? recordTxt.other : testTxt.other}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        {/* <Modal visible={this.state.videoIsVisible}>
                    <VideoPlayer hideVideoShow={this.hideVideoShow} fileUrl={require('../../../../../images/chineseHomepage/pingyin/new/1.mp4')}
                    />
                </Modal> */}
        <Congrats></Congrats>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleFont: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...fonts.fontFamily_jcyt_700,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(40),
  },
  tranTitleFont: {
    fontSize: pxToDp(35),
    color: "#2f3744",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(46),
  },
  pinyinTitleFont: {
    fontSize: pxToDp(35),
    color: "#475266",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(40),
  },
  mainFont: {
    fontSize: pxToDp(56),
    color: "#475266",
    ...fonts.fontFamily_jcyt_700,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(70),
  },
  tranFont: {
    fontSize: pxToDp(40),
    color: "#2f3744",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    // lineHeight: pxToDp(33)
  },
  pinyinFont: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    // lineHeight: pxToDp(30)
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
  return {
    getStars(data) {
      dispatch(childrenCreators.getStars(data));
    },
    getRewardCoin() {
      dispatch(actionCreatorsUserInfo.getRewardCoin());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
