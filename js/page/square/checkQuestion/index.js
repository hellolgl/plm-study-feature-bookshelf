import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import {
  pxToDp,
  padding_tool,
  borderRadius_tool,
  pxToDpWidthLs,
  getIsTablet,
} from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import Msg from "../../../component/square/msg";
import * as actionCreators from "../../../action/square/index";

class SquareCheckQuestion extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.state = {
      isPhone: !getIsTablet(),
      wordList: [],
      showMsg: false,
      lookMeaningWord: {},
      showType: "",
      storyCreateType: props.storyCreateType,
      checkQuestion: "",
      allTagBg: {
        动物和植物: {
          bg: "#FFD780",
          color: "#DD4401",
        },
        宇宙和天文: {
          bg: "#80C2FF",
          color: "#244597",
        },
        健康知识: {
          bg: "#98D087",
          color: "#066115",
        },
        高效学习: {
          bg: "#FFD780",
          color: "#DD4401",
        },
        社交与兴趣爱好: {
          bg: "#FBA160",
          color: "#9C3312",
        },
        教育与学习: {
          bg: "#80C2FF",
          color: "#244597",
        },
        心理健康与情感发展: {
          bg: "#98D087",
          color: "#066115",
        },
        身体健康与生活习惯: {
          bg: "#A39AE4",
          color: "#131166",
        },
        家庭关系与教育: {
          bg: "#8AF2EC",
          color: "#0A6B6B",
        },
        教育选择与未来规划: {
          bg: "#FF73BE",
          color: "#931752",
        },
      },
      checkQuestionTag: "",
    };
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    // getSquareWords
    this.setState({
      wordList: [],
    });
    const { squareType } = this.props;
    let url =
      squareType === "kid"
        ? api.getSquareScienceQuestion
        : api.getSquareParentQuestion;
    axios.get(url, { params: {} }).then((res) => {
      if (res.data.err_code === 0) {
        let listnow = [...res.data.data];
        let wordlist = listnow.map((item) => {
          return {
            ...item,
            name: item.title,
            checked: item === this.state.checkQuestion,
          };
        });
        // console.log("处理后的数据", wordlist);

        this.setState({
          wordList: wordlist,
        });
      }
    });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  checkWord = (item, index) => {
    let listnow = this.state.wordList.map((i, n) => {
      let checked = n === index;

      return {
        ...i,
        checked,
      };
    });
    this.setState({
      wordList: listnow,
      checkQuestion: item.name,
      checkQuestionTag: item.tag,
    });
  };
  removeWord = () => {
    // console.log("删除", key);

    let listnow = this.state.wordList.map((i, n) => {
      let checked = false;
      return {
        ...i,
        checked,
      };
    });
    this.setState({
      wordList: listnow,
      checkQuestion: "",
    });
  };

  okMsg = () => {
    this.setState({
      showMsg: false,
    });
  };

  next = () => {
    // console.log("选中词语", word);
    const { checkQuestion, checkQuestionTag } = this.state;
    if (checkQuestion) {
      this.props.setCheckedQuestion(checkQuestion);
      this.props.setCheckedStoryType(checkQuestion);
      if (this.props.squareType === "parent") {
        // 家长
        this.props.setCheckQuestionTag(checkQuestionTag);
      }
      NavigationUtil.toSquareCreateTalk(this.props);
      this.removeWord();
    } else {
      this.setState({
        showMsg: true,
      });
    }
  };
  renderScienceCard = ({ item, index }) => {
    const { isPhone, allTagBg } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    return (
      <TouchableOpacity
        style={[styles.scienceWrap]}
        onPress={this.checkWord.bind(this, item, index)}
        key={index}
      >
        <View
          style={[
            styles.tagBtn,
            // item.tag === "动物和植物" && { backgroundColor: "#FFD780" },
            // item.tag === "宇宙和天文" && { backgroundColor: "#80C2FF" },
            // item.tag === "健康知识" && { backgroundColor: "#98D087" },
            allTagBg[item.tag] && { backgroundColor: allTagBg[item.tag].bg },
          ]}
        >
          <Text
            style={[
              styles.tagTxt,
              // item.tag === "动物和植物" && { color: "#DD4401" },
              // item.tag === "宇宙和天文" && { color: "#244597" },
              // item.tag === "健康知识" && { color: "#066115" },
              allTagBg[item.tag] && {
                color: allTagBg[item.tag].color,
              },
            ]}
          >
            {item.tag}
          </Text>
        </View>
        <View
          style={[
            styles.scienceItemWrap,
            !item.checked && {
              borderColor: "transparent",
              backgroundColor: "transparent",
            },
          ]}
        >
          <View
            style={[
              styles.itemMain,
              item.checked && {
                backgroundColor: "#B5E0D6",
                borderColor: "#228F86",
              },
            ]}
          >
            <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
              <View style={[styles.circle]} />
              <View style={[styles.circle]} />
            </View>
            <View style={[{ flex: 1 }, appStyle.flexCenter]}>
              <Text style={[styles.wordTxt]}>{item.name}</Text>
            </View>

            <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
              <View style={[styles.circle]} />
              <View style={[styles.circle]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { wordList, showMsg, checkQuestion, isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    const { squareType } = this.props;
    return (
      <ImageBackground
        source={require("../../../images/square/wordsBg.png")}
        style={[{ flex: 1 }]}
      >
        <View style={[styles.headerWrap]}>
          <TouchableOpacity style={[styles.backBtn]} onPress={this.goBack}>
            <Image
              style={[
                {
                  width: pxToDp(120),
                  height: pxToDp(80),
                },
              ]}
              source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
            />
          </TouchableOpacity>
          <View style={[styles.titleWrap]}>
            <Text style={[styles.titleTxt]}>
              {squareType === "kid"
                ? "选择一个感兴趣的知识点吧！"
                : "选择一个感兴趣的论述卡片吧！"}
            </Text>
          </View>
          <TouchableOpacity style={[styles.refreshBtn]} onPress={this.getlist}>
            <Image
              style={[
                {
                  width: pxToDp(40),
                  height: pxToDp(45),
                },
              ]}
              source={require("../../../images/square/refresh.png")}
            />
            <Text style={[styles.refreshBtnTxt]}>刷新一组</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={[{ flex: 1 }, styles.safeWrap]}>
          <View
            style={[{ flex: 1, paddingLeft: pxToDp(0) }, appStyle.flexCenter]}
          >
            {wordList.length === 0 ? (
              <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <View
                style={[
                  {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                  },
                ]}
              >
                {/* <FlatList
                  data={wordList}
                  renderItem={this.renderScienceCard}
                  numColumns={3}
                  horizontal={false}
                /> */}
                {wordList.map((item, index) => {
                  return this.renderScienceCard({ item, index });
                })}
              </View>
            )}
          </View>
          <View style={[styles.bottomWrap]}>
            <View style={[styles.bottomMain]}>
              <View style={[styles.checkedWord]}>
                {checkQuestion ? (
                  <TouchableOpacity
                    onPress={this.removeWord}
                    style={[appStyle.flexTopLine]}
                  >
                    <Image
                      source={
                        squareType === "kid"
                          ? require("../../../images/square/checkQuestion.png")
                          : require("../../../images/square/parentCheckQuestion.png")
                      }
                      style={[styles.checkImg]}
                    />
                    <View style={[styles.checkQuestionWrap]}>
                      <Text style={[styles.checkQuestionTxt]}>
                        {checkQuestion}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={this.next}
                style={[
                  styles.nextBtn,
                  checkQuestion && {
                    borderColor: "#FFC12F",
                    backgroundColor: "#FF9000",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nextTxt,
                    checkQuestion && {
                      color: "#fff",
                    },
                  ]}
                >
                  开始创作
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Msg
          showMsg={showMsg}
          onOk={this.okMsg}
          // titleDom={

          // }
          mainDOm={
            <View
              style={[appStyle.flexTopLine, { flex: 1, alignItems: "center" }]}
            >
              <Text style={[styles.msgNormal]}>请选择知识点！</Text>
            </View>
          }
        />
      </ImageBackground>
    );
  }
}

const padStyle = StyleSheet.create({
  headerWrap: {
    height: pxToDp(Platform.OS === "ios" ? 175 : 115),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pxToDp(18),
  },
  backBtn: {
    marginLeft: pxToDp(45),
    width: pxToDp(230),
  },
  refreshBtn: {
    width: pxToDp(230),
    height: pxToDp(85),
    borderRadius: pxToDp(40),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#FFF7D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(45),
  },
  refreshBtnTxt: {
    fontSize: pxToDp(34),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    marginLeft: pxToDp(15),
  },
  titleWrap: {
    height: "100%",
    backgroundColor: "#36363C",
    ...borderRadius_tool(0, 0, 30, 30),
    borderWidth: pxToDp(2),
    borderColor: "#fff",
    width: pxToDp(852),
    borderTopWidth: pxToDp(0),
    alignItems: "center",
    justifyContent: "center",
  },
  titleTxt: {
    fontSize: pxToDp(50),
    color: "#EFE9E6",
    ...appFont.fontFamily_jcyt_700,
  },
  bottomWrap: {
    height: pxToDp(160),
    backgroundColor: "#1F1F26",
    // backgroundColor: "pink",
    ...padding_tool(6, 27, 0, 27),
  },
  bottomMain: {
    width: "100%",
    height: pxToDp(115),
    borderRadius: pxToDp(40),
    backgroundColor: "#36363D",
    flexDirection: "row",
  },
  nextBtn: {
    width: pxToDp(270),
    height: pxToDp(120),
    borderRadius: pxToDp(40),
    backgroundColor: "#787878",
    borderColor: "#C8C6C6",
    borderWidth: pxToDp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  nextTxt: {
    fontSize: pxToDp(46),
    color: "#D9D9D9",
    ...appFont.fontFamily_jcyt_700,
  },
  itemWrap: {
    width: pxToDp(485),
    height: pxToDp(683),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDp(47),
    padding: pxToDp(17),
    marginRight: pxToDp(20),
    marginBottom: pxToDp(25),
  },
  itemMain: {
    flex: 1,
    borderRadius: pxToDp(42),
    backgroundColor: "#F5F3F2",
    borderWidth: pxToDp(5),
    borderColor: "#DAD4D1",
    ...padding_tool(15, 25, 15, 25),
  },
  circle: {
    width: pxToDp(10),
    height: pxToDp(10),
    borderRadius: pxToDp(10),
    backgroundColor: "#1F1F26",
  },
  wordTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(50),
    color: "#283139",
    lineHeight: pxToDp(60),
    width: "100%",
  },

  checkedWord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: pxToDp(270),
  },

  msgNormal: {
    fontSize: pxToDp(50),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
  },

  safeWrap: { flex: 1 },
  scienceWrap: {
    width: pxToDp(671),
    height: pxToDp(315),
    marginBottom: pxToDp(120),
    justifyContent: "flex-end",
    position: "relative",
  },
  scienceItemWrap: {
    width: pxToDp(671),
    height: pxToDp(215),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDp(60),
    padding: pxToDp(10),
  },
  checkImg: {
    width: pxToDp(95),
    height: pxToDp(89),
    marginRight: pxToDp(21),
  },
  checkQuestionWrap: {
    backgroundColor: "#313138",
    borderRadius: pxToDp(30),
    borderColor: "#FFC12F",
    borderWidth: pxToDp(3),
    ...padding_tool(20, 27, 20, 27),
  },
  checkQuestionTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(42),
    lineHeight: pxToDp(Platform.OS === "ios" ? 52 : 48),
    color: "#fff",
  },
  tagBtn: {
    minWidth: pxToDp(304),
    height: pxToDp(92),
    backgroundColor: "#A39AE4",
    borderRadius: pxToDp(20),
    borderWidth: pxToDp(2),
    borderColor: "#fff",
    position: "absolute",
    right: pxToDp(40),
    top: pxToDp(40),
    transform: [
      {
        rotateZ: "-3deg",
      },
    ],
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: pxToDp(8),
    paddingRight: pxToDp(8),
  },
  tagTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(42),
    lineHeight: pxToDp(Platform.OS === "ios" ? 52 : 42),
    color: "#131166",
  },
});
const phoneStyle = StyleSheet.create({
  headerWrap: {
    height: pxToDpWidthLs(96),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: pxToDp(18),
  },
  backBtn: {
    marginLeft: pxToDp(45),
    width: pxToDpWidthLs(179),
  },
  refreshBtn: {
    width: pxToDpWidthLs(179),
    height: pxToDpWidthLs(67),
    borderRadius: pxToDpWidthLs(30),
    borderWidth: pxToDpWidthLs(5),
    borderColor: "#FFC12F",
    backgroundColor: "#FFF7D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(45),
  },
  refreshBtnTxt: {
    fontSize: pxToDpWidthLs(25),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    marginLeft: pxToDp(15),
  },
  titleWrap: {
    height: "100%",
    backgroundColor: "#36363C",
    // ...borderRadius_tool(0, 0, 30, 30),
    borderBottomLeftRadius: pxToDpWidthLs(30),
    borderBottomRightRadius: pxToDpWidthLs(30),
    borderWidth: pxToDpWidthLs(2),
    borderColor: "#fff",
    width: pxToDpWidthLs(656),
    borderTopWidth: pxToDp(0),
    alignItems: "center",
    justifyContent: "center",
  },
  titleTxt: {
    fontSize: pxToDpWidthLs(42),
    color: "#EFE9E6",
    ...appFont.fontFamily_jcyt_700,
  },
  bottomWrap: {
    height: pxToDp(160),
    backgroundColor: "#1F1F26",
    // backgroundColor: "pink",
    ...padding_tool(6, 27, 0, 27),
  },
  bottomMain: {
    width: "100%",
    height: pxToDpWidthLs(78),
    borderRadius: pxToDpWidthLs(25),
    backgroundColor: "#36363D",
    flexDirection: "row",
  },
  nextBtn: {
    width: pxToDpWidthLs(175),
    height: pxToDpWidthLs(83),
    borderRadius: pxToDpWidthLs(30),
    backgroundColor: "#787878",
    borderColor: "#C8C6C6",
    borderWidth: pxToDpWidthLs(5),
    justifyContent: "center",
    alignItems: "center",
  },
  nextTxt: {
    fontSize: pxToDpWidthLs(34),
    color: "#D9D9D9",
    ...appFont.fontFamily_jcyt_700,
  },
  itemWrap: {
    width: pxToDpWidthLs(319),
    height: pxToDpWidthLs(452),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDp(47),
    padding: pxToDp(17),
    marginRight: pxToDp(20),
    marginBottom: pxToDp(25),
  },
  itemMain: {
    flex: 1,
    borderRadius: pxToDpWidthLs(30),
    backgroundColor: "#F5F3F2",
    borderWidth: pxToDpWidthLs(4),
    borderColor: "#DAD4D1",
    padding: pxToDpWidthLs(12),
  },
  circle: {
    width: pxToDp(10),
    height: pxToDp(10),
    borderRadius: pxToDp(10),
    backgroundColor: "#1F1F26",
  },

  wordTxt: {
    fontSize: pxToDpWidthLs(34),
    color: "#283139",
    // lineHeight: pxToDpWidthLs(34),
    ...appFont.fontFamily_jcyt_700,
    width: pxToDpWidthLs(390),
    flexWrap: "wrap",
  },

  checkedWord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: pxToDpWidthLs(175),
  },

  msgNormal: {
    fontSize: pxToDp(50),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
  },

  safeWrap: {
    flex: 1,
    paddingLeft: pxToDpWidthLs(10),
    paddingRight: pxToDpWidthLs(10),
  },
  scienceWrap: {
    width: pxToDpWidthLs(434),
    height: pxToDpWidthLs(180),
    marginBottom: pxToDpWidthLs(9),
    justifyContent: "flex-end",
    position: "relative",
  },
  tagBtn: {
    minWidth: pxToDpWidthLs(213),
    height: pxToDpWidthLs(65),
    backgroundColor: "#A39AE4",
    borderRadius: pxToDpWidthLs(18),
    borderWidth: pxToDpWidthLs(2),
    borderColor: "#fff",
    position: "absolute",
    right: pxToDpWidthLs(5),
    top: pxToDpWidthLs(0),
    transform: [
      {
        rotateZ: "-3deg",
      },
    ],
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: pxToDpWidthLs(4),
    paddingRight: pxToDpWidthLs(4),
  },
  tagTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDpWidthLs(30),
    lineHeight: pxToDpWidthLs(Platform.OS === "ios" ? 40 : 30),
    color: "#131166",
  },
  scienceItemWrap: {
    width: pxToDpWidthLs(453),
    height: pxToDpWidthLs(147),
    borderWidth: pxToDpWidthLs(3),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDpWidthLs(40),
    padding: pxToDpWidthLs(8),
  },

  checkImg: {
    width: pxToDpWidthLs(63),
    height: pxToDpWidthLs(59),
    marginRight: pxToDpWidthLs(21),
  },
  checkQuestionWrap: {
    backgroundColor: "#313138",
    borderRadius: pxToDpWidthLs(20),
    borderColor: "#FFC12F",
    borderWidth: pxToDpWidthLs(2),
    // ...padding_tool(20, 27, 20, 27),
    padding: pxToDpWidthLs(40),
    paddingTop: pxToDpWidthLs(8),
    paddingBottom: pxToDpWidthLs(8),
  },
  checkQuestionTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDpWidthLs(34),
    lineHeight: pxToDpWidthLs(Platform.OS === "ios" ? 44 : 34),
    color: "#fff",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    storyCreateType: state.getIn(["square", "storyCreateType"]),
    squareType: state.getIn(["userInfo", "squareType"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setCheckedQuestion(data) {
      dispatch(actionCreators.setCheckedQuestion(data));
    },
    setCheckedStoryType(data) {
      dispatch(actionCreators.setCheckStoryType(data));
    },
    setCheckQuestionTag(data) {
      dispatch(actionCreators.setCheckQuestionTag(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(SquareCheckQuestion);
