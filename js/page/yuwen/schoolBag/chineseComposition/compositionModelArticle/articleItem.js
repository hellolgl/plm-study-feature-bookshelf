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
  fontFamilyRestoreMargin,
  margin_tool,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import KnowledgeTreeModal from "../../../../../component/chinese/chineseCompositionExercise/KnowledgeTreeModal";
import RichShowView from "../../../../../component/chinese/RichShowView";
import DropdownSelect from "../../../../../component/Select";
import Btn from "../../../../../component/chinese/btn";
// import Svg,{ ForeignObject } from 'react-native-svg';
const chineseNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
class ChineseSchoolHome extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
      rotateValue: new Animated.Value(0),
      isOpen: true,
      maxHeight: 0,
      autoHeight: 0,
      ischangeHeight: true,
      nowIndex: 0,
      bigIndex: 0,
      choiceList: [],
      changeIndexList: [],
    };
    this.heightArr = [];
  }

  static navigationOptions = {
    // title:'答题'
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
    // this.props.navigation.goBack(this.props.navigation.state.params.data.homeKey)
  };
  componentDidMount() {
    let big = 0,
      little = 0,
      isFinish = false,
      changeIndexList = [];
    this.state.list.forEach((item, index) => {
      if (!isFinish && item.change_word.length > 0) {
        big = index;
        little = item.change_word[0].position;
        isFinish = true;
        changeIndexList.push(index);
      }
    });
    this.clickSentence(big, little);
    this.setState({
      changeIndexList,
    });
  }
  clickSentence = (bigIndex, littleIndex) => {
    const { list } = this.state;
    let choicelist = list[bigIndex]?.sentence_stem[littleIndex]?.contentSelect
      ? list[bigIndex]?.sentence_stem[littleIndex]?.contentSelect
      : [];
    this.setState({
      bigIndex,
      nowIndex: littleIndex,
      choiceList: choicelist,
    });
  };
  checkItem = (item) => {
    const { list, bigIndex, nowIndex } = this.state;
    const listnow = JSON.parse(JSON.stringify(list));
    let littleindex = nowIndex,
      bigindexnow = bigIndex;
    listnow[bigIndex].sentence_stem[nowIndex].value = item.value;
    let nextIndex = -1;
    listnow[bigIndex].change_word.forEach((item, index) => {
      if (item.position === nowIndex) {
        nextIndex = index + 1;
      }
    });
    if (nextIndex < listnow[bigIndex].change_word.length) {
      // 这一段没有完
      littleindex = listnow[bigIndex].change_word[nextIndex].position;
    } else {
      // 这一段已经完了
      let finishSearch = true;
      list.forEach((item, index) => {
        if (finishSearch && bigIndex < index) {
          if (item.change_word.length > 0) {
            bigindexnow = index;
            littleindex = item.change_word[0].position;
            finishSearch = false;
          }
        }
      });
    }
    this.clickSentence(bigindexnow, littleindex);
    this.setState({
      list: listnow,
      // nowCheckValue: item,
      // bigIndex: bigindexnow,
      // nowIndex: littleindex
    });
  };
  renderSentence = (currentTopic, bigIndexnow) => {
    if (!currentTopic?.sentence_stem) return;

    const { nowIndex, bigIndex } = this.state;
    let domList = currentTopic.sentence_stem.map((item, index) => {
      if (item.word_type === "p") {
        // console.log('currentTopic', item)

        return (
          <TouchableOpacity
            key={index}
            onPress={this.clickSentence.bind(this, bigIndexnow, index)}
          >
            <View
              style={[
                padding_tool(10, 40, 0, 40),
                margin_tool(0, 10, 20, 10),
                {
                  borderBottomColor:
                    bigIndexnow === bigIndex && nowIndex === index
                      ? "#FF964A"
                      : "#475266",
                  borderBottomWidth: pxToDp(4),
                  minHeight: pxToDp(90),
                  justifyContent: "flex-end",
                },
                index === 0 ? { marginLeft: pxToDp(90) } : {},
              ]}
            >
              {item.value ? (
                <Text
                  style={[
                    styles.sentenceTxt,
                    {
                      color:
                        bigIndexnow === bigIndex && nowIndex === index
                          ? "#FF964A"
                          : "#475266",
                    },
                  ]}
                >
                  {item.value}
                </Text>
              ) : (
                <Image
                  style={[size_tool(52), { marginBottom: pxToDp(20) }]}
                  source={
                    bigIndexnow === bigIndex && nowIndex === index
                      ? require("../../../../../images/chineseHomepage/sentence/penOrange.png")
                      : require("../../../../../images/chineseHomepage/sentence/pen.png")
                  }
                />
              )}
            </View>
          </TouchableOpacity>
        );
      } else {
        return item.content.split("").map((textitem, textindex) => {
          return (
            <Text
              key={textindex}
              style={[
                styles.sentenceTxt,
                {
                  //   fontSize: pxToDp(40),
                  color: item.isCenter ? "#FC6161" : "#475266",
                  //   lineHeight: pxToDp(76),
                  paddingLeft: index === 0 && textindex === 0 ? pxToDp(80) : 0,
                },
              ]}
            >
              {textitem}
            </Text>
          );
        });
      }
    });
    return domList;
  };
  render() {
    const { list, choiceList } = this.state;
    const { speMsg } = this.props;
    return (
      <View
        style={[
          {
            // height: maxHeight > 0 ? autoHeight + maxHeight : "auto",
            width: "100%",
            flex: 1,
          },
        ]}
        // onLayout={this._onLayout}
      >
        <View style={[{ flex: 1 }, padding_tool(0, 60, 20, 60)]}>
          <ScrollView style={[{ width: "100%" }]}>
            {speMsg.article_type === "4" ? (
              <View style={[appStyle.flexCenter]}>
                <Text style={[styles.speTxt]}>{speMsg.notice}</Text>
              </View>
            ) : null}
            {speMsg.article_type === "4" || speMsg.article_type === "2" ? (
              <View style={[]}>
                <Text style={[styles.speTxt]}>{speMsg.notice_start}</Text>
              </View>
            ) : null}
            {speMsg.article_type === "3" ? (
              <View style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                <Text style={[styles.speTxt, { marginRight: pxToDp(40) }]}>
                  {speMsg.signature_time}
                </Text>
                <Text style={[styles.speTxt, { marginRight: pxToDp(40) }]}>
                  {speMsg.week_day}
                </Text>
                <Text style={[styles.speTxt, { marginRight: pxToDp(40) }]}>
                  {speMsg.weather}
                </Text>
              </View>
            ) : null}
            {list.map((item, index) => {
              return (
                <View
                  style={[
                    appStyle.flexTopLine,
                    appStyle.flexLineWrap,
                    appStyle.flexAliEnd,
                  ]}
                >
                  {this.renderSentence(item, index)}
                </View>
              );
            })}
            {speMsg.article_type === "4" || speMsg.article_type === "2" ? (
              <View style={[appStyle.flexAliEnd]}>
                <Text style={[styles.speTxt]}>{speMsg.signature}</Text>
              </View>
            ) : null}
            {speMsg.article_type === "4" || speMsg.article_type === "2" ? (
              <View style={[appStyle.flexAliEnd]}>
                <Text style={[styles.speTxt]}>{speMsg.signature_time}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>

        <View
          style={[
            { width: "100%", height: pxToDp(208), backgroundColor: "#fff" },
            borderRadius_tool(40, 40, 0, 0),
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            padding_tool(0, 40, 0, 40),
          ]}
        >
          <ScrollView horizontal={true}>
            <View style={[appStyle.flexTopLine]}>
              {choiceList.map((item, index) => {
                let ischeck = false;
                return (
                  <Btn
                    key={index}
                    styleObj={{
                      bgColor: ischeck ? "#FF964A" : "#F5F5FA",
                      bottomColor: ischeck ? "#F07C39" : "#E7E7F2",
                      fontColor: ischeck ? "#fff" : "#475266",
                      borderRadius: pxToDp(40),
                      height: pxToDp(120),
                      fontSize: pxToDp(40),
                      width: pxToDp(280),
                    }}
                    fontStyle={{
                      color: ischeck ? "#fff" : "#475266",
                      fontSize: pxToDp(40),
                      lineHeight: pxToDp(50),
                      ...appFont.fontFamily_syst_bold,
                    }}
                    clickBtn={this.checkItem.bind(this, item)}
                    txt={item.value}
                    otherStyle={{ marginRight: pxToDp(20) }}
                    noFamily={true}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sentenceTxt: {
    fontSize: pxToDp(40),
    color: "#475266",
    ...appFont.fontFamily_syst,
    lineHeight: pxToDp(60),
    // paddingBottom: pxToDp(0)
  },
  speTxt: {
    fontSize: pxToDp(40),
    color: "#475266",
    lineHeight: pxToDp(76),
    ...appFont.fontFamily_syst,
    // paddingLeft: index === 0 && textindex === 0 ? pxToDp(80) : 0
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
