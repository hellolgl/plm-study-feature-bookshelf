import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
  margin_tool,
  fitHeight,
} from "../../../../../../util/tools";
import { appFont, appStyle } from "../../../../../../theme";
import ChineseMindMapping from "../../../../../../component/chinese/ChineseMindMapping";
import RichShowView from "../../../../../../component/chinese/newRichShowView";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      article: "",
      article_title: "",
      author: "",
      exercise: [],
      nowindex: 0,
      exercise_times_id: "",
      ar_map_id: 0,
      st_id: 0,
      name: this.props.navigation.state.params.data.name,
      article_data: {},
      operate_time: "",
    };
    this.audio = undefined;
  }

  static navigationOptions = {};

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  componentWillUnmount() {
    DeviceEventEmitter.emit("compostition");
    // DeviceEventEmitter.removeListener("compositionRecord", () => this.getlist());  //移除
    this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "compositionRecord",
      () => this.getlist()
    );
    this.getlist();
  }
  getlist = () => {
    //
    let obj = this.props.navigation.state.params.data;
    // console.log('数据===', obj)
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    axios
      .get(api.sgetChineseCompositionArticleRecord, {
        params: {
          article_id: obj.article_id,
          c_id: userInfoJs.c_id,
          grade_code: userInfoJs.checkGrade,
        },
      })
      .then((res) => {
        if (res.data?.err_code === 0) {
          console.log("回调", res.data.data);
          this.setState({
            exercise: res.data.data.exercises,
            exercise_times_id: res.data.data.exercise_times_id,
            st_id: res.data.data.st_id,
            article_data: res.data.data.article_data,
            operate_time: res.data.data.operate_time,
          });
        }
      });
  };
  toDoexercise = (item) => {
    NavigationUtil.toChineseCompisitionModelDoExercise({
      ...this.props,
      data: {
        ...item,
        ...this.props.navigation.state.params.data,
        isOne: true,
        st_id: this.state.st_id,
      },
    });
  };
  tolookmap = () => {
    NavigationUtil.toCompositionLookMindmap({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
        isOne: true,
        st_id: this.state.st_id,
        isModel: true,
        islookmap: true,
      },
    });
  };
  toArticle = () => {
    NavigationUtil.toChineseCompisitionModelArticle({
      ...this.props,
      data: {
        ...this.props.navigation.state.params.data,
      },
    });
  };

  extractChineseCharactersAndPunctuation = (html) => {
    // 使用正则表达式匹配所有汉字和汉语标点符号，同时排除英文字符
    const chineseCharsAndPunctuation = html.match(
      /(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g
    );

    if (chineseCharsAndPunctuation) {
      const chineseText = chineseCharsAndPunctuation.join("");
      return (
        chineseText
          // .replaceAll("（）", "")
          .replaceAll("&nbsp;", "")
          .replaceAll(">", "")
      );
    } else {
      // 如果没有匹配到字符，返回空字符串或者其他适当的值
      return "";
    }
  };

  render() {
    const { exercise, name, article_data, operate_time } = this.state;
    return (
      <ImageBackground
        style={styles.wrap}
        source={require("../../../../../../images/chineseHomepage/sentence/sentenceBg.png")}
        resizeMode="cover"
      >
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            appStyle.flexAliCenter,
            padding_tool(0, 64, 0, 64),
            {
              width: "100%",
              height: pxToDp(128),
              paddingTop: Platform.OS === "ios" ? pxToDp(40) : 0,
            },
          ]}
        >
          {/* header */}
          <TouchableOpacity style={[size_tool(208, 80)]} onPress={this.goBack}>
            <Image
              resizeMode="contain"
              style={[size_tool(120, 80)]}
              source={require("../../../../../../images/chineseHomepage/pingyin/new/back.png")}
            />
          </TouchableOpacity>
          <Text
            style={[
              appFont.fontFamily_syst_bold,
              {
                fontSize: pxToDp(40),
                color: "#475266",
                lineHeight: pxToDp(50),
              },
            ]}
          >
            {name}
          </Text>
          <View style={[size_tool(208, 80)]}>
            {exercise.length > 0 ? (
              <TouchableOpacity
                onPress={this.toArticle}
                style={[
                  size_tool(208, 80),
                  borderRadius_tool(200),
                  { backgroundColor: "#fff" },
                  appStyle.flexCenter,
                ]}
              >
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    { fontSize: pxToDp(32), color: "#475266" },
                  ]}
                >
                  重新答题
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {exercise.length > 0 ? (
          <View
            style={[
              { flex: 1, width: "100%", position: "relative" },
              padding_tool(40),
            ]}
          >
            <ScrollView>
              <View
                style={[appStyle.flexAliCenter, { paddingBottom: pxToDp(40) }]}
              >
                {exercise.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={this.toDoexercise.bind(this, item)}
                      style={[
                        {
                          width: pxToDp(1528),
                          minHeight: pxToDp(120),
                          borderRadius: pxToDp(40),
                          marginBottom: pxToDp(40),
                          backgroundColor: "#fff",
                        },
                        appStyle.flexTopLine,
                        appStyle.flexAliCenter,
                        appStyle.flexJusBetween,
                        padding_tool(20, 48, 20, 48),
                      ]}
                      key={index}
                    >
                      <View
                        style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                      >
                        <View
                          style={[
                            size_tool(80),
                            borderRadius_tool(80),
                            appStyle.flexCenter,
                            {
                              backgroundColor:
                                item.correct === "2" ? "#16C792" : "#F2645B",
                              marginRight: pxToDp(20),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              appFont.fontFamily_jcyt_700,
                              { fontSize: pxToDp(36), color: "#fff" },
                            ]}
                          >
                            {index + 1}
                          </Text>
                        </View>
                        <View style={[{ flex: 1 }]}>
                          {/* <RichShowView
                                                width={pxToDp(1200)}
                                                value={
                                                    item.private_exercise_stem
                                                }
                                            /> */}
                          <Text style={[styles.stemFont]}>
                            {this.extractChineseCharactersAndPunctuation(
                              item.private_exercise_stem
                            )}
                          </Text>
                        </View>
                        <FontAwesome
                          name={"chevron-right"}
                          size={20}
                          style={{ color: "rgba(71, 82, 102, 0.50)" }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <Text
                  style={[
                    appFont.fontFamily_jcyt_500,
                    { fontSize: pxToDp(32), color: "#475266", opacity: 0.5 },
                  ]}
                >
                  {operate_time}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={this.tolookmap}
              style={[
                size_tool(280, 120),
                borderRadius_tool(200),
                {
                  backgroundColor: "#13A97C",
                  position: "absolute",
                  bottom: pxToDp(80),
                  right: pxToDp(80),
                  paddingBottom: pxToDp(8),
                },
              ]}
            >
              <View
                style={[
                  { flex: 1, backgroundColor: "#16C792" },
                  appStyle.flexCenter,
                  borderRadius_tool(200),
                ]}
              >
                <Text
                  style={[
                    { fontSize: pxToDp(40), color: "#fff" },
                    appFont.fontFamily_jcyt_700,
                  ]}
                >
                  查看导图
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              appStyle.flexCenter,
              { flex: 1, paddingBottom: pxToDp(100), width: "100%" },
            ]}
          >
            {/* <Image source={require('../../../../../../images/chineseHomepage/sentence/msgPanda.png')}
                style={[size_tool(200)]}
            />
            <View style={[padding_tool(40), { backgroundColor: '#fff', }, borderRadius_tool(40)]}>

                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#475266', }]}>需要完成答题才会有记录哦</Text>


            </View> */}
            <Text
              style={[
                {
                  fontSize: pxToDp(48),
                  color: "#475266",
                  marginBottom: pxToDp(10),
                  lineHeight: pxToDp(60),
                },
                appFont.fontFamily_syst_bold,
              ]}
            >
              {article_data?.name}
            </Text>
            <Text
              style={[
                {
                  fontSize: pxToDp(28),
                  color: "#475266",
                  lineHeight: pxToDp(40),
                },
                appFont.fontFamily_syst,
              ]}
            >
              作者：{article_data?.author}
            </Text>
            <ScrollView>
              <RichShowView
                width={pxToDp(1520)}
                value={article_data?.article_content}
              />
            </ScrollView>
            <TouchableOpacity
              onPress={this.toArticle}
              style={[
                size_tool(280, 120),
                borderRadius_tool(200),
                {
                  backgroundColor: "#F07C39",
                  position: "absolute",
                  right: pxToDp(80),
                  bottom: pxToDp(60),
                  paddingBottom: pxToDp(8),
                },
              ]}
            >
              <View
                style={[
                  { flex: 1, backgroundColor: "#FF964A" },
                  borderRadius_tool(200),
                  appStyle.flexCenter,
                ]}
              >
                <Text
                  style={[
                    appFont.fontFamily_jcyt_700,
                    { fontSize: pxToDp(32), color: "#fff" },
                  ]}
                >
                  开始答题
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8CE8D",
  },
  text: {
    fontSize: pxToDp(40),
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Muyao-Softbrush" : "Muyao-Softbrush-2",
    marginBottom: pxToDp(20),
  },
  text1: {
    fontSize: pxToDp(40),
    color: "#FFB211",
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#A86A33",
    borderRadius: pxToDp(16),
    marginRight: pxToDp(24),
  },
  text2: {
    fontSize: pxToDp(28),
    color: "#fff",
  },
  statisticsWrap: {
    width: pxToDp(1080),
    // height: pxToDp(890),
    height: fitHeight(0.78, 0.78),
    position: "absolute",
    top: pxToDp(170),
    left: pxToDp(-980),
  },
  statisticsMain: {
    width: pxToDp(1000),
    // height: pxToDp(890),
    height: fitHeight(0.78, 0.78),
    borderTopRightRadius: pxToDp(32),
    borderBottomRightRadius: pxToDp(32),
    backgroundColor: "#fff",
    borderWidth: pxToDp(8),
    borderColor: "#F9AD63",
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(20),
    paddingBottom: pxToDp(20),
    paddingTop: pxToDp(40),
  },
  open: {
    position: "absolute",
    right: pxToDp(0),
    top: pxToDp(200),
    width: pxToDp(80),
    height: pxToDp(56),
    borderTopRightRadius: pxToDp(49),
    borderBottomRightRadius: pxToDp(49),
    paddingRight: pxToDp(8),
    paddingBottom: pxToDp(4),
    zIndex: 9999,
  },
  close: {
    position: "absolute",
    right: pxToDp(0),
    top: pxToDp(280),
    width: pxToDp(80),
    height: pxToDp(56),
    borderTopRightRadius: pxToDp(49),
    borderBottomRightRadius: pxToDp(49),
    paddingRight: pxToDp(8),
    paddingBottom: pxToDp(4),
    zIndex: 9999,
  },
  stemFont: {
    fontSize: pxToDp(40),
    color: "#475266",
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

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
