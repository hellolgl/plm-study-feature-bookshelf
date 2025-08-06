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

import * as actionCreators from "../../../action/square/index";

class CheckWords extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPhone: !getIsTablet(),
      typeList: [
        {
          name: "知识点故事",
          img: require("../../../images/square/knowIcon.png"),
          isChecked: false,
          type: "know",
          checkedImg: require("../../../images/square/knowIconChecked.png"),
        },
        {
          name: "派百科知识",
          img: require("../../../images/square/scienceIcon.png"),
          isChecked: false,
          type: "science",
          checkedImg: require("../../../images/square/scienceIconChecked.png"),
        },
      ],
      checkType: {},
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  checkTypeNow = (item, index) => {
    let listnow = this.state.typeList.map((item, n) => {
      return {
        ...item,
        isChecked: index === n,
      };
    });
    this.setState({
      checkType: item,
      typeList: listnow,
    });
  };
  next = () => {
    const { checkType } = this.state;
    if (checkType.type === "know") {
      this.props.setStoryCreateType(checkType.type);
      NavigationUtil.toSquareCheckWords(this.props);
    }
    if (checkType.type === "science") {
      this.props.setStoryCreateType(checkType.type);
      NavigationUtil.toSquareCheckQuestion(this.props);
    }
  };
  renderCard = ({ item, index }) => {
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    const isChecked = item.isChecked;

    return (
      <TouchableOpacity
        style={[styles.itemWrap]}
        onPress={this.checkTypeNow.bind(this, item, index)}
      >
        {isChecked ? (
          <Image
            source={item.checkedImg}
            style={[
              styles.checkedImg,
              item.type === "know" && { left: pxToDp(5) },
            ]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={item.img}
            style={[item.type === "know" ? styles.knowImg : styles.scienceImg]}
            resizeMode="contain"
          />
        )}
        <View
          style={[isChecked ? styles.itemBtnWrapChecked : styles.itemBtnWrap]}
        >
          <View style={[isChecked ? styles.itemBtnchecked : styles.itemBtn]}>
            <Text style={[styles.btnTxt, isChecked && { color: "#fff" }]}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { isPhone, typeList, checkType } = this.state;
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
            <Text style={[styles.titleTxt]}>选择需要创作的故事类型吧！</Text>
          </View>
          <View style={[styles.backBtn]} />
        </View>
        <SafeAreaView style={[{ flex: 1 }, styles.safeWrap]}>
          <View style={[{ flex: 1, justifyContent: "center" }]}>
            <View
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                },
              ]}
            >
              {typeList.map((item, index) => this.renderCard({ item, index }))}
            </View>
          </View>

          <View style={[styles.bottomWrap]}>
            <View style={[styles.bottomMain]}>
              <View style={[styles.checkedWord]}>
                {checkType.name ? (
                  <View style={[styles.checkedTypeWrap]}>
                    <View style={[styles.checkedTypeinner]}>
                      <Text style={[styles.checkedTypeTxt]}>
                        {checkType.name}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={this.next}
                style={[
                  styles.nextBtn,
                  checkType.name && {
                    borderColor: "#FFC12F",
                    backgroundColor: "#FF9000",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nextTxt,
                    checkType.name && {
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
  safeWrap: {
    flex: 1,
  },
  itemWrap: {
    width: pxToDp(561),
    height: pxToDp(611),
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: pxToDp(17),
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
  checkedWord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: pxToDp(270),
  },
  knowImg: {
    width: pxToDp(411),
    height: pxToDp(356),
  },

  scienceImg: {
    width: pxToDp(382),
    height: pxToDp(426),
  },
  checkedImg: {
    width: pxToDp(561),
    height: pxToDp(611),
    position: "absolute",
    bottom: pxToDp(0),
  },
  itemBtnWrap: {
    width: pxToDp(532),
    height: pxToDp(162),
    borderRadius: pxToDp(57),
    backgroundColor: "#228F86",
    ...padding_tool(3, 3, 10, 3),
  },
  itemBtnWrapChecked: {
    width: pxToDp(532),
    height: pxToDp(162),
    borderRadius: pxToDp(57),
    backgroundColor: "#FFC12F",
    ...padding_tool(4, 4, 15, 4),
  },
  itemBtn: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDp(57),
    justifyContent: "center",
    alignItems: "center",
  },
  itemBtnchecked: {
    flex: 1,
    borderRadius: pxToDp(55),
    backgroundColor: "#228F86",
    borderWidth: pxToDp(3),
    borderColor: "#9DDEDC",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(50),
    color: "#283139",
  },
  checkedTypeWrap: {
    width: pxToDp(480),
    height: pxToDp(90),
    borderRadius: pxToDp(30),
    paddingBottom: pxToDp(5),
    backgroundColor: "#FFC12F",
  },
  checkedTypeinner: {
    flex: 1,
    borderRadius: pxToDp(30),
    backgroundColor: "#FFF4C6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedTypeTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(42),
    color: "#1F1F26",
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
  safeWrap: {
    flex: 1,
    paddingLeft: pxToDpWidthLs(10),
    paddingRight: pxToDpWidthLs(10),
  },
  itemWrap: {
    width: pxToDpWidthLs(392),
    height: pxToDpWidthLs(427),
    justifyContent: "flex-end",
    position: "relative",
    alignItems: "center",
    paddingBottom: pxToDpWidthLs(14),
  },
  checkedImg: {
    width: pxToDpWidthLs(392),
    height: pxToDpWidthLs(427),
    position: "absolute",
    bottom: pxToDpWidthLs(0),
  },
  knowImg: {
    width: pxToDpWidthLs(287),
    height: pxToDpWidthLs(250),
  },
  scienceImg: {
    width: pxToDpWidthLs(287),
    height: pxToDpWidthLs(301),
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
  checkedWord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: pxToDpWidthLs(155),
  },

  btnWrap: {
    width: pxToDpWidthLs(240),
    height: pxToDpWidthLs(65),
    position: "relative",
  },
  btnBg: {
    width: pxToDpWidthLs(240),
    height: pxToDpWidthLs(65),
    position: "absolute",
    bottom: pxToDp(-10),
    left: pxToDp(0),
    backgroundColor: "#228F86",
    borderRadius: pxToDpWidthLs(24),
    borderColor: "#FFC12F",
    borderWidth: pxToDpWidthLs(2),
  },
  btnMain: {
    flex: 1,
    backgroundColor: "#228F86",
    borderRadius: pxToDpWidthLs(24),
    borderColor: "#B5E0D6",
    borderWidth: pxToDpWidthLs(2),
    justifyContent: "center",
    alignItems: "center",
  },
  // btnTxt: {
  //   ...appFont.fontFamily_jcyt_700,
  //   fontSize: pxToDp(50),
  //   color: "#fff",
  // },
  checkedTypeWrap: {
    width: pxToDpWidthLs(299),
    height: pxToDpWidthLs(60),
    borderRadius: pxToDp(30),
    paddingBottom: pxToDp(5),
    backgroundColor: "#FFC12F",
  },
  checkedTypeinner: {
    flex: 1,
    borderRadius: pxToDp(30),
    backgroundColor: "#FFF4C6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkedTypeTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(42),
    color: "#1F1F26",
  },

  itemBtnWrap: {
    width: pxToDpWidthLs(367),
    height: pxToDpWidthLs(108),
    borderRadius: pxToDpWidthLs(36),
    backgroundColor: "#228F86",
    padding: pxToDpWidthLs(3),
    paddingBottom: pxToDpWidthLs(7),
  },
  itemBtnWrapChecked: {
    width: pxToDpWidthLs(367),
    height: pxToDpWidthLs(108),
    borderRadius: pxToDpWidthLs(40),
    backgroundColor: "#FFC12F",
    padding: pxToDpWidthLs(5),
    paddingBottom: pxToDpWidthLs(11),
  },
  itemBtn: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDpWidthLs(36),
    justifyContent: "center",
    alignItems: "center",
  },
  itemBtnchecked: {
    flex: 1,
    borderRadius: pxToDpWidthLs(36),
    backgroundColor: "#228F86",
    borderWidth: pxToDpWidthLs(3),
    borderColor: "#9DDEDC",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDpWidthLs(38),
    color: "#283139",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    storyCreateType: state.getIn(["square", "storyCreateType"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setStoryCreateType(data) {
      dispatch(actionCreators.setStoryCreateType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(CheckWords);
