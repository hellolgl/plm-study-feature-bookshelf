import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  DeviceEventEmitter,
  BackHandler,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  borderRadius_tool,
  getGradeInfo,
} from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import SleceLanguage from "../../../../component/chinese/selectLanguage";
import fonts from "../../../../theme/fonts";
import BackBtn from "../../../../component/chinese/pinyin/backBtn";
import HomeModal from "../../../../component/chinese/pinyin/homeModal";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import CoinView from '../../../../component/coinView'
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";

class LookAllExerciseHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: "1",
      zimuList: [],
      zimuObj: {},
      show_language_modal: false,
      language_data: {},
      btnText: {},
      zimuList2: [],
      lookWhy: false,
      kidType: props.navigation.state.params.data?.isChildren ? "1" : "2",
    };
  }
  componentDidMount() {
    let language_data = this.props.language_data.toJS();
    // console.log('语言信息', language_data)
    this.getList();
  }

  componentWillUnmount() {
    this.backBtnListener && this.backBtnListener.remove();
    this.props.getTaskData()
  }

  getList = async () => {
    const { type } = this.state;
    // const kidType = await AsyncStorage.getItem("childrenType");
    // console.log("幼小", kidType);
    axios.get(api.chinesePinyinGetAllKnow).then((res) => {
      console.log("回调", res.data.data);
      if (res.data.err_code === 0) {
        let list = [],
          list1 = [];
        let zimuObj = res.data.data;
        if (type === "2") {
          zimuObj["2"].forEach((item) => {
            item.knowledge_point.length > 1
              ? list1.push(item)
              : list.push(item);
          });
        } else {
          list = [...zimuObj[type]];
        }
        this.setState({
          zimuList: list,
          zimuList2: list1,
          zimuObj,
          // kidType,
        });
      }
    });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  checkThis = (item, authority) => {
    if (authority) {
      NavigationUtil.toChinesePinyinCheckType({
        ...this.props,
        data: {
          ...item,
          updata: () => this.getList(),
        },
      });
    } else {
      // 购买
      this.props.setVisible(true);
    }
  };
  // toLookRecord = (item) => {
  //   if (item.status === "0") {
  //     return;
  //   }
  //   NavigationUtil.toChinesePinyinExerciseRecord({
  //     ...this.props,
  //     data: { ...item },
  //   });
  // };
  checkType = (item) => {};
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let language_data = props.language_data.toJS();
    const { main_language_map, other_language_map, type, show_type } =
      language_data;
    // console.log('切换语言: ', language_data)
    if (type !== tempState.language_data.type) {
      // 切换语言
      tempState.language_data = language_data;
      let btnText = {
        back_zh: main_language_map.back,
        back_ch: other_language_map.back,
        title_zh: main_language_map.pinyin,
        title_ch: other_language_map.pinyin,
        explain_zh: main_language_map.explain,
        explain_ch: other_language_map.explain,
        shengmu_zh: main_language_map.shengmu,
        danyun_zh: main_language_map.danyun,
        fuyun_zh: main_language_map.fuyun,
        zhengti_zh: main_language_map.zhengti,
        shengmu_ch: other_language_map.shengmu,
        danyun_ch: other_language_map.danyun,
        fuyun_ch: other_language_map.fuyun,
        zhengti_ch: other_language_map.zhengti,
        say_zh: main_language_map.say,
        say_ch: other_language_map.say,
        ok_zh: main_language_map.ok,
        ok_ch: other_language_map.ok,
        yunmu_zh: main_language_map.yunmu,
        yunmu_ch: other_language_map.yunmu,
        guize_zh: main_language_map.guize,
        guize_ch: other_language_map.guize,
      };
      tempState.btnText = btnText;
      return tempState;
    }
    return null;
  }
  lookLast = (isnext) => {
    const { zimuObj, type } = this.state;
    let list = [],
      list1 = [];
    let nowtype = type - 0;
    if (isnext) {
      nowtype === 3 ? (nowtype = 1) : ++nowtype;
    } else {
      nowtype === 1 ? (nowtype = 3) : --nowtype;
    }

    nowtype += "";
    console.log("nowtype", nowtype);
    if (nowtype === "2") {
      zimuObj["2"].forEach((item) => {
        item.knowledge_point.length > 1 ? list1.push(item) : list.push(item);
      });
    } else {
      list = [...zimuObj[nowtype]];
    }
    this.setState({
      type: nowtype,
      zimuList: list,
      zimuList2: list1,
    });
  };
  renderItem = (item, index, authority, show_main, show_translate) => {
    const { kidType, type } = this.state;
    let showbg =
      kidType === "1"
        ? item.listen_status === "1" &&
          item.speak_status === "1" &&
          item.xue_status === "1" &&
          item.write_status === "1"
        : item.status === "1";
    let iconSize = size_tool(66, 78);
    return (
      <TouchableOpacity
        onPress={this.checkThis.bind(
          this,
          item,
          (type === "1" && index < 4) || authority
        )}
        key={index}
        style={[{ marginRight: pxToDp(40), marginBottom: pxToDp(40) }]}
      >
        <ImageBackground
          style={[
            size_tool(412, 460),
            appStyle.flexAliCenter,
            padding_tool(20, 40, 20, 40),
            { position: "relative" },
          ]}
          source={require("../../../../images/chineseHomepage/pingyin/new/homeItemBg.png")}
        >
          {type === "1" && index < 4 && !authority ? (
            <FreeTag
              txt={`${show_main ? "免费" : ""}${show_translate ? " Free" : ""}`}
              style={{
                position: "absolute",
                top: pxToDp(-10),
                right: pxToDp(-10),
                zIndex: 99,
                width: "auto",
                ...padding_tool(0, 10, 0, 10),
              }}
            />
          ) : null}
          <ImageBackground
            style={[
              size_tool(322, 312),
              appStyle.flexCenter,
              { marginBottom: pxToDp(10) },
            ]}
            source={
              // item.status === "1"
              showbg
                ? require("../../../../images/chineseHomepage/pingyin/itmBg.png")
                : require("../../../../images/chineseHomepage/pingyin/noItmBg.png")
            }
          >
            <Text style={[styles.mainTxt, showbg && { color: "#fff" }]}>
              {item.knowledge_point}
            </Text>
          </ImageBackground>
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexJusBetween,
              { width: pxToDp(322) },
            ]}
          >
            {/* {console.log('数据数据', item)}· */}
            <Image
              style={[iconSize]}
              source={
                item.listen_status !== "1"
                  ? require("../../../../images/chineseHomepage/pingyin/lNo.png")
                  : require("../../../../images/chineseHomepage/pingyin/lYes.png")
              }
            />
            <Image
              style={[iconSize, {}]}
              source={
                item.speak_status !== "1"
                  ? require("../../../../images/chineseHomepage/pingyin/sNo.png")
                  : require("../../../../images/chineseHomepage/pingyin/sYes.png")
              }
            />
            <Image
              style={[iconSize, {}]}
              source={
                item.xue_status !== "1"
                  ? require("../../../../images/chineseHomepage/pingyin/xNo.png")
                  : require("../../../../images/chineseHomepage/pingyin/xyes.png")
              }
            />
            <Image
              style={[iconSize, {}]}
              source={
                item.write_status !== "1"
                  ? require("../../../../images/chineseHomepage/pingyin/wNo.png")
                  : require("../../../../images/chineseHomepage/pingyin/wYes.png")
              }
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  render() {
    const {
      type,
      zimuList,
      show_language_modal,
      btnText,
      language_data,
      zimuObj,
      zimuList2,
      lookWhy,
      kidType,
    } = this.state;
    const { show_main, show_translate, label } = language_data;
    const authority = this.props.authority;
    return (
      <ImageBackground
        source={
          Platform.OS === "ios"
            ? require("../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png")
            : require("../../../../images/chineseHomepage/pingyin/new/wrapBg.png")
        }
        style={[
          {
            flex: 1,
            position: "relative",
            paddingTop: pxToDp(Platform.OS === "ios" ? 40 : 0),
          },
        ]}
      >
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            padding_tool(20),
            {},
          ]}
        >
          <View style={[{ width: pxToDp(440) }]}>
            <BackBtn
              show_main={show_main}
              show_translate={show_translate}
              back_ch={btnText.back_ch}
              back_zh={btnText.back_zh}
              onPress={this.goBack}
            />
          </View>

          <View style={[appStyle.flexCenter]}>
            {/* {show_main ? <Text style={[{}, styles.mainFont]}>{btnText.title_zh}</Text> : null}
                        {show_translate ? <Text style={[{ opacity: 0.5, }, styles.tranFont]}>{btnText.title_ch}</Text> : null} */}
            {show_main ? (
              <Text style={[styles.mainFont]}>
                {" "}
                {type === "1"
                  ? btnText.shengmu_zh
                  : type === "2"
                  ? btnText.yunmu_zh
                  : btnText.zhengti_zh}
              </Text>
            ) : null}
            {show_translate ? (
              <Text style={[styles.tranFont]}>
                {" "}
                {type === "1"
                  ? btnText.shengmu_ch
                  : type === "2"
                  ? btnText.yunmu_ch
                  : btnText.zhengti_ch}
              </Text>
            ) : null}
          </View>
          <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
            <TouchableOpacity
              onPress={() =>
                this.setState({ show_language_modal: !show_language_modal })
              }
              style={[
                appStyle.flexCenter,
                appStyle.flexTopLine,
                size_tool(220, 80),
                borderRadius_tool(80),
                { backgroundColor: "#fff", paddingLeft: pxToDp(20) },
              ]}
            >
              <Text
                style={[
                  styles.mainFont,
                  { fontSize: pxToDp(32), lineHeight: pxToDp(32) },
                ]}
              >
                {label}
              </Text>
              <Image
                source={
                  show_language_modal
                    ? require("../../../../images/chineseHomepage/pingyin/new/up.png")
                    : require(`../../../../images/chineseHomepage/pingyin/new/down.png`)
                }
                style={[size_tool(40)]}
              />
            </TouchableOpacity>
            <View
              style={[
                size_tool(1, 40),
                {
                  borderRightWidth: pxToDp(4),
                  borderRightColor: "#DAD0C0",
                  marginLeft: pxToDp(40),
                  marginRight: pxToDp(40),
                },
              ]}
            ></View>
            <TouchableOpacity
              onPress={() => this.setState({ lookWhy: !lookWhy })}
              style={[
                appStyle.flexTopLine,
                appStyle.flexAliCenter,
                appStyle.flexJusCenter,
              ]}
            >
              <Image
                style={[size_tool(80)]}
                source={require("../../../../images/chineseHomepage/pingyin/rule.png")}
              />
              <View style={[appStyle.flexCenter]}>
                <Text
                  style={[
                    styles.mainFont,
                    { marginLeft: pxToDp(20), fontSize: pxToDp(32) },
                  ]}
                >
                  {btnText.guize_zh}
                </Text>
                {show_translate ? (
                  <Text
                    style={[
                      styles.tranFont,
                      { marginLeft: pxToDp(20), fontSize: pxToDp(32) },
                    ]}
                  >
                    {btnText.guize_ch}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            { flex: 1, paddingBottom: pxToDp(40) },
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
          ]}
        >
          <TouchableOpacity
            onPress={this.lookLast.bind(this, false)}
            style={[{ marginRight: pxToDp(36) }]}
          >
            <Image
              style={[size_tool(100)]}
              source={require("../../../../images/chineseHomepage/pingyin/new/last.png")}
            />
          </TouchableOpacity>
          <View style={[{ flex: 1, height: "100%" }]}>
            <ScrollView style={[padding_tool(40, 0, 40, 0)]}>
              {type === "2" ? (
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    { marginBottom: pxToDp(40) },
                  ]}
                >
                  {show_main ? (
                    <Text style={[styles.mainFont]}>
                      {" "}
                      {type === "1"
                        ? btnText.shengmu_zh
                        : type === "2"
                        ? btnText.danyun_zh
                        : btnText.zhengti_zh}
                    </Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[styles.tranFont]}>
                      {" "}
                      {type === "1"
                        ? btnText.shengmu_ch
                        : type === "2"
                        ? btnText.danyun_ch
                        : btnText.zhengti_ch}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <View
                style={[
                  appStyle.flexTopLine,
                  appStyle.flexLineWrap,
                  { paddingTop: pxToDp(10) },
                ]}
              >
                {zimuList.map((item, index) => {
                  return this.renderItem(
                    item,
                    index,
                    authority,
                    show_main,
                    show_translate
                  );
                })}
              </View>
              {type === "2" ? (
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                    { marginBottom: pxToDp(40) },
                  ]}
                >
                  {show_main ? (
                    <Text style={[styles.mainFont]}> {btnText.fuyun_zh}</Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[styles.tranFont]}> {btnText.fuyun_ch}</Text>
                  ) : null}
                </View>
              ) : null}
              {type === "2" ? (
                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                  {zimuList2.map((item, index) => {
                    return this.renderItem(
                      item,
                      index,
                      authority,
                      show_main,
                      show_translate
                    );
                  })}
                </View>
              ) : null}
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={this.lookLast.bind(this, true)}
            style={[{}]}
          >
            <Image
              style={[size_tool(100)]}
              source={require("../../../../images/chineseHomepage/pingyin/new/next.png")}
            />
          </TouchableOpacity>
        </View>
        {lookWhy ? (
          <HomeModal
            show={lookWhy}
            close={() => {
              this.setState({ lookWhy: false });
            }}
            isKid={kidType === "1"}
          />
        ) : null}
        <SleceLanguage
          show={show_language_modal}
          close={() => {
            this.setState({ show_language_modal: false });
          }}
        />
        <CoinView></CoinView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainFont: {
    fontSize: pxToDp(36),
    color: "#475266",
    ...fonts.fontFamily_jcyt_700,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(42),
  },
  tranFont: {
    fontSize: pxToDp(28),
    color: "#475266",
    ...fonts.fonts_pinyin,
    marginRight: pxToDp(4),
    lineHeight: pxToDp(33),
  },
  closeBtn: {
    position: "absolute",
    bottom: pxToDp(-70),
    left: "50%",
    marginLeft: pxToDp(-87),
    ...size_tool(200),
  },
  mainTxt: {
    ...appFont.fonts_pinyin,
    // fontFamily: Platform.OS === 'ios' ? 'AaBanruokaishu (Non-Commercial Use)' : '1574320058',
    fontSize: pxToDp(80),
    color: "#475266",
    lineHeight: pxToDp(90),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    language_data: state.getIn(["languageChinese", "language_data"]),
    authority: state.getIn(["userInfo", "selestModuleAuthority"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    getTaskData(data) {
      dispatch(actionCreatorsDailyTask.getTaskData(data));
    }
  };
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
