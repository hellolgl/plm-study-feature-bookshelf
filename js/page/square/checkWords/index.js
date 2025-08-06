import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  DeviceEventEmitter,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  BackHandler
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
import { pinyin } from "pinyin-pro";
import Msg from "../../../component/square/msg";
import * as actionCreators from "../../../action/square/index";
class CheckWords extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined;
    this.state = {
      isPhone: !getIsTablet(),
      wordList: [],
      checkedWordMap: new Map(),
      showMsg: false,
      lookMeaningWord: {},
      showType: "",
    };
  }
  componentWillUnmount() {
    this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
  }
  componentDidMount() {
    this.getlist();
    this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
      "initCreateCheckData",
      (event) => {
        this.setState({
          checkedWordMap: new Map(),
        });
        this.getlist();
      }
    );
  }
  getlist = () => {
    // getSquareWords
    this.setState({
      wordList: [],
    });
    axios.get(api.getSquareWords, { params: {} }).then((res) => {
      // console.log("res", res.data);
      if (res.data.err_code === 0) {
        let listnow = [...res.data.data.two_data, ...res.data.data.four_data];
        let checkedMap = this.state.checkedWordMap;
        let wordlist = listnow.map((item) => {
          let knowledge = item.knowledge_point.replaceAll("\n", "");
          let pinyinList =
            item.pinyin_2?.length > 0
              ? item.pinyin_2.split(" ").filter((i) => i !== "")
              : pinyin(item.knowledge_point, { type: "array" });
          let word = knowledge.split("");
          let checked = checkedMap.get(knowledge) ? true : false;
          // console.log("拼音", item, pinyinlist);
          return {
            ...item,
            pinyinList,
            word,
            knowledge_point: knowledge,
            checked,
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
    let checkedMap = this.state.checkedWordMap;
    if (!item.checked && checkedMap.size === 10) {
      this.setState({
        showType: "",
        showMsg: true,
      });
      return;
    }
    let listnow = this.state.wordList.map((i, n) => {
      let checked = n === index ? !i.checked : i.checked;
      checked
        ? checkedMap.set(i.knowledge_point, i)
        : checkedMap.delete(i.knowledge_point);
      return {
        ...i,
        checked,
      };
    });
    this.setState({
      wordList: listnow,
      // checkedMap: checkedMap,
    });
  };
  removeWord = (key) => {
    // console.log("删除", key);
    let checkedMap = this.state.checkedWordMap;
    checkedMap.delete(key);
    let listnow = this.state.wordList.map((i, n) => {
      let checked = i.knowledge_point === key ? false : i.checked;
      return {
        ...i,
        checked,
      };
    });
    this.setState({
      wordList: listnow,
      // checkedMap: checkedMap,
    });
  };

  renderCheckedWord = () => {
    const { checkedWordMap } = this.state;
    let returnDom = [];
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    for (let [key, value] of checkedWordMap) {
      returnDom.push(
        <TouchableOpacity
          style={[styles.checkedWordWrap]}
          onPress={this.removeWord.bind(this, key)}
        >
          <Image
            source={require("../../../images/chineseHomepage/sentence/status2.png")}
            style={[styles.closeBtnWrap]}
          />
          <View style={[styles.checkedWordMain]}>
            <Text style={[styles.checkedWordTxt]}>{value.knowledge_point}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return returnDom;
  };
  renderWordItem = (item) => {
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    return item.word?.map((i, index) => {
      return (
        <View key={index} style={[styles.pinyinWrap]}>
          <Text
            style={[
              item.word.length > 2 ? styles.wordPinyin_four : styles.wordPinyin,
            ]}
          >
            {item.pinyinList[index]}
          </Text>
          <Text
            style={[
              item.word.length > 2 ? styles.wordTxt_four : styles.wordTxt,
            ]}
          >
            {i}
          </Text>
        </View>
      );
    });
  };
  renderCard = ({ item, index }) => {
    // console.log("数据", item);
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    return (
      <TouchableOpacity
        style={[
          styles.itemWrap,
          !item.checked && {
            borderColor: "transparent",
            backgroundColor: "transparent",
          },
          index % 4 === 3 && { marginRight: pxToDp(0) },
        ]}
        onPress={this.checkWord.bind(this, item, index)}
      >
        <View style={[styles.itemMain]}>
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <View style={[styles.circle]} />
            <View style={[styles.circle]} />
          </View>
          <View
            style={[
              styles.wordWrap,
              // !item.checked && {
              //   backgroundColor: "#B5E0D6",
              // },
            ]}
          >
            <View style={[styles.wordMain]}>{this.renderWordItem(item)}</View>
          </View>
          <View style={[{ flex: 1, paddingBottom: pxToDp(20) }]}>
            <Text
              numberOfLines={isPhone ? 4 : 5}
              ellipsizeMode={"tail"}
              style={[styles.wordMeaning]}
            >
              {item.meaning}
            </Text>
            {item.meaning.length > (isPhone ? 34 : 50) ? (
              <TouchableOpacity onPress={this.lookMore.bind(this, item)}>
                <Text style={[styles.wordMore]}>查看更多</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <View style={[styles.circle]} />
            <View style={[styles.circle]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  okMsg = () => {
    this.setState({
      showMsg: false,
    });
  };
  renderMsgTitle = () => {
    const { lookMeaningWord, showType } = this.state;
    if (showType === "word") {
      return this.renderWordItem(lookMeaningWord);
    } else {
      return "";
    }
  };
  lookMore = (item) => {
    this.setState({
      showMsg: true,
      showType: "word",
      lookMeaningWord: item,
    });
  };
  next = () => {
    let checkedMap = this.state.checkedWordMap;
    if (checkedMap.size < 6) {
      this.setState({
        showType: "",
        showMsg: true,
      });
      return;
    }
    let word = [];
    checkedMap.forEach((item) => word.push(item.knowledge_point));
    // console.log("选中词语", word);
    axios
      .post(api.saveSquareCheckedWords, {
        words: word,
      })
      .then((res) => {
        // console.log("保存词组", res.data);
        if (res.data.err_code === 0) {
          this.props.setCheckWordList(word);
          NavigationUtil.toSquareCheckStoryType(this.props);
        }
      });
  };
  render() {
    const { wordList, checkedWordMap, showMsg, showType, lookMeaningWord } =
      this.state;
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
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
            <Text style={[styles.titleTxt]}>选择喜欢的词语来进行创作吧！</Text>
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
            style={[{ flex: 1, paddingLeft: pxToDp(24), alignItems: "center" }]}
          >
            {wordList.length === 0 ? (
              <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                {/* <Lottie
                  source={{
                    uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-story-loading.json",
                  }}
                  autoPlay
                  loop={true}
                  style={[
                    {
                      width: pxToDp(100),
                      height: pxToDp(100),
                    },
                  ]}
                /> */}
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : (
              <FlatList
                data={wordList}
                renderItem={this.renderCard}
                numColumns={4}
                horizontal={false}
              />
            )}
          </View>
          <View style={[styles.bottomWrap]}>
            <View style={[styles.bottomMain]}>
              <View style={[styles.checkedWord]}>
                {this.renderCheckedWord()}
              </View>
              <TouchableOpacity
                onPress={this.next}
                style={[
                  styles.nextBtn,
                  checkedWordMap.size > 5 && {
                    borderColor: "#FFC12F",
                    backgroundColor: "#FF9000",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nextTxt,
                    checkedWordMap.size > 5 && {
                      color: "#fff",
                    },
                  ]}
                >
                  下一步
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <Msg
          showMsg={showMsg}
          onOk={this.okMsg}
          titleDom={
            showType === "word" ? (
              <View style={[appStyle.flexTopLine]}>
                {this.renderWordItem(lookMeaningWord)}
              </View>
            ) : (
              ""
            )
          }
          mainDOm={
            showType === "word" ? (
              <View style={[{ flex: 1 }, padding_tool(10, 0, 10, 0)]}>
                <ScrollView>
                  <Text style={[styles.meaningMsg]}>
                    {lookMeaningWord.meaning}
                  </Text>
                </ScrollView>
              </View>
            ) : (
              <View
                style={[
                  appStyle.flexTopLine,
                  { flex: 1, alignItems: "center" },
                ]}
              >
                <Text style={[styles.msgNormal]}>词语最少需要选择</Text>
                <Text style={[styles.msgSpe]}>6</Text>
                <Text style={[styles.msgNormal]}>个，最多选择</Text>
                <Text style={[styles.msgSpe]}>10</Text>
                <Text style={[styles.msgNormal]}>个</Text>
              </View>
            )
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
    width: pxToDp(225),
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
    backgroundColor: "#EFE9E6",
    borderWidth: pxToDp(1),
    borderColor: "#228F86",
    ...padding_tool(15, 25, 15, 25),
  },
  circle: {
    width: pxToDp(10),
    height: pxToDp(10),
    borderRadius: pxToDp(10),
    backgroundColor: "#1F1F26",
  },
  wordWrap: {
    width: "100%",
    height: pxToDp(305),
    ...padding_tool(5, 5, 8, 5),
    backgroundColor: "#228F86",
    borderRadius: pxToDp(40),
    marginBottom: pxToDp(12),
  },
  wordMain: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDp(36),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wordMeaning: {
    fontSize: pxToDp(30),
    color: "#1F1F26",
  },
  wordPinyin: {
    fontSize: pxToDp(46),
    color: "#1F1F26",
    lineHeight: pxToDp(56),
  },
  wordTxt: {
    fontSize: pxToDp(100),
    color: "#1F1F26",
    lineHeight: pxToDp(110),
  },
  pinyinWrap: {
    alignItems: "center",
  },
  wordPinyin_four: {
    fontSize: pxToDp(32),
    color: "#1F1F26",
    lineHeight: pxToDp(42),
  },
  wordTxt_four: {
    fontSize: pxToDp(80),
    color: "#1F1F26",
    lineHeight: pxToDp(90),
  },
  wordMore: {
    color: "#5073FF",
    fontSize: pxToDp(30),
  },
  checkedWordWrap: {
    width: pxToDp(170),
    height: pxToDp(84),
    borderRadius: pxToDp(30),
    backgroundColor: "#FFC12F",
    marginLeft: pxToDp(6),
    position: "relative",
    paddingBottom: pxToDp(4),
  },
  checkedWordMain: {
    flex: 1,
    borderRadius: pxToDp(30),
    backgroundColor: "#FFF4C6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedWordTxt: {
    fontSize: pxToDp(38),
    color: "#1F1F26",
  },
  checkedWord: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: pxToDp(8),
  },
  closeBtnWrap: {
    width: pxToDp(33),
    height: pxToDp(33),
    position: "absolute",
    top: pxToDp(-6),
    right: pxToDp(-6),
    zIndex: 9,
  },
  msgNormal: {
    fontSize: pxToDp(50),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
  },
  msgSpe: {
    fontSize: pxToDp(67),
    color: "#F25E5E",
    ...appFont.fontFamily_jcyt_700,
  },
  meaningMsg: {
    fontSize: pxToDp(38),
    color: "#283139",
  },
  safeWrap: { flex: 1 },
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
    width: pxToDpWidthLs(155),
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
    borderRadius: pxToDp(42),
    backgroundColor: "#EFE9E6",
    borderWidth: pxToDp(1),
    borderColor: "#228F86",
    ...padding_tool(15, 25, 15, 25),
  },
  circle: {
    width: pxToDp(10),
    height: pxToDp(10),
    borderRadius: pxToDp(10),
    backgroundColor: "#1F1F26",
  },
  wordWrap: {
    width: "100%",
    height: pxToDpWidthLs(201),
    ...padding_tool(5, 5, 8, 5),
    backgroundColor: "#228F86",
    borderRadius: pxToDpWidthLs(30),
    marginBottom: pxToDpWidthLs(6),
  },
  wordMain: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDp(36),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wordMeaning: {
    fontSize: pxToDpWidthLs(25),
    color: "#1F1F26",
  },
  wordPinyin: {
    fontSize: pxToDpWidthLs(30),
    color: "#1F1F26",
    lineHeight: pxToDpWidthLs(40),
  },
  wordTxt: {
    fontSize: pxToDpWidthLs(67),
    color: "#1F1F26",
    lineHeight: pxToDpWidthLs(77),
  },
  pinyinWrap: {
    alignItems: "center",
  },
  wordPinyin_four: {
    fontSize: pxToDpWidthLs(22),
    color: "#1F1F26",
    lineHeight: pxToDpWidthLs(32),
  },
  wordTxt_four: {
    fontSize: pxToDpWidthLs(52),
    color: "#1F1F26",
    lineHeight: pxToDpWidthLs(65),
  },
  wordMore: {
    color: "#5073FF",
    fontSize: pxToDpWidthLs(25),
  },
  checkedWordWrap: {
    width: pxToDpWidthLs(110),
    height: pxToDpWidthLs(54),
    borderRadius: pxToDpWidthLs(20),
    backgroundColor: "#FFC12F",
    marginLeft: pxToDp(6),
    position: "relative",
    paddingBottom: pxToDpWidthLs(3),
  },
  checkedWordMain: {
    flex: 1,
    borderRadius: pxToDpWidthLs(20),
    backgroundColor: "#FFF4C6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedWordTxt: {
    fontSize: pxToDpWidthLs(24),
    color: "#1F1F26",
  },
  checkedWord: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: pxToDp(8),
  },
  closeBtnWrap: {
    width: pxToDp(33),
    height: pxToDp(33),
    position: "absolute",
    top: pxToDp(-6),
    right: pxToDp(-6),
    zIndex: 9,
  },
  msgNormal: {
    fontSize: pxToDp(50),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
  },
  msgSpe: {
    fontSize: pxToDp(67),
    color: "#F25E5E",
    ...appFont.fontFamily_jcyt_700,
  },
  meaningMsg: {
    fontSize: pxToDpWidthLs(36),
    color: "#283139",
  },
  safeWrap: {
    flex: 1,
    paddingLeft: pxToDpWidthLs(10),
    paddingRight: pxToDpWidthLs(10),
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setCheckWordList(data) {
      dispatch(actionCreators.setCheckWordList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(CheckWords);
