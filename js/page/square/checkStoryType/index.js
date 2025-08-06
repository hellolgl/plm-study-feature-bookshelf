import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  FlatList,
  Platform,
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
          name: "童话",
          img: require("../../../images/square/tonghua.png"),
          isChecked: false,
        },
        {
          name: "经典",
          img: require("../../../images/square/jingdian.png"),
          isChecked: false,
        },
        {
          name: "轻松",
          img: require("../../../images/square/qingsong.png"),
          isChecked: false,
        },
        {
          name: "科幻",
          img: require("../../../images/square/kehuan.png"),
          isChecked: false,
        },
      ],
      checkType: "",
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
      checkType: item.name,
      typeList: listnow,
    });
  };
  next = () => {
    const { checkType } = this.state;
    if (checkType) {
      this.props.setCheckStoryType(checkType);
      NavigationUtil.toSquareCreateTalk(this.props);
    }
  };
  renderCard = ({ item, index }) => {
    const { isPhone } = this.state;
    const styles = isPhone ? phoneStyle : padStyle;
    const isChecked = item.isChecked;

    return (
      <TouchableOpacity
        style={[
          styles.itemWrap,
          !isChecked && {
            borderColor: "transparent",
            backgroundColor: "transparent",
          },
          index % 4 === 3 && { marginRight: pxToDp(0) },
        ]}
        onPress={this.checkTypeNow.bind(this, item, index)}
      >
        <View style={[styles.itemMain]}>
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <View style={[styles.circle]} />
            <View style={[styles.circle]} />
          </View>

          <View style={[{ flex: 1, alignItems: "center" }]}>
            <View style={[styles.itemImgWrap]}>
              <Image source={item.img} style={[styles.itemImg]} />
              <View
                style={[
                  styles.itemImgBgWrap,
                  !isChecked && {
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                  },
                ]}
              >
                <View style={[styles.itemImgBg]}></View>
              </View>
            </View>
            <View style={[styles.itemBtnWrap]}>
              <View style={[styles.btnWrap]}>
                {isChecked ? <View style={[styles.btnBg]} /> : null}
                <View
                  style={[
                    styles.btnMain,
                    !isChecked && {
                      backgroundColor: "#B5E0D6",
                      borderColor: "#228F86",
                      borderWidth: pxToDp(4),
                      borderBottomWidth: pxToDp(9),
                    },
                  ]}
                >
                  <Text
                    style={[styles.btnTxt, !isChecked && { color: "#1F1F26" }]}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
            <View style={[styles.circle]} />
            <View style={[styles.circle]} />
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
            <Text style={[styles.titleTxt]}>
              选择一种故事类型来进行创作吧！
            </Text>
          </View>
          <View style={[styles.backBtn]} />
        </View>
        <SafeAreaView style={[{ flex: 1 }, styles.safeWrap]}>
          <View style={[{ flex: 1, justifyContent: "center" }]}>
            <View style={[appStyle.flexAliCenter]}>
              <FlatList
                data={typeList}
                renderItem={this.renderCard}
                numColumns={4}
                horizontal={false}
              />
            </View>
          </View>

          <View style={[styles.bottomWrap]}>
            <View style={[styles.bottomMain]}>
              <View style={[styles.checkedWord]}>
                {checkType ? (
                  <View style={[styles.checkedTypeWrap]}>
                    <View style={[styles.checkedTypeinner]}>
                      <Text style={[styles.checkedTypeTxt]}>
                        {checkType}故事
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={this.next}
                style={[
                  styles.nextBtn,
                  checkType && {
                    borderColor: "#FFC12F",
                    backgroundColor: "#FF9000",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nextTxt,
                    checkType && {
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
    width: pxToDp(485),
    height: pxToDp(683),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDp(47),
    padding: pxToDp(17),
    marginRight: pxToDp(20),
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
  itemImg: {
    width: pxToDp(388),
    height: pxToDp(388),
    position: "absolute",
    top: pxToDp(0),
    left: pxToDp(0),
    zIndex: 9,
  },
  itemImgWrap: {
    width: pxToDp(388),
    height: pxToDp(388),
    position: "relative",
    marginBottom: pxToDp(45),
  },
  itemImgBgWrap: {
    flex: 1,
    backgroundColor: "#228F86",
    borderRadius: pxToDp(60),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    padding: pxToDp(30),
  },
  itemImgBg: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDp(58),
    borderWidth: pxToDp(5),
    borderColor: "#fff",
  },
  itemBtnWrap: {
    alignItems: "center",
  },
  btnWrap: {
    width: pxToDp(345),
    height: pxToDp(95),
    position: "relative",
  },
  btnBg: {
    width: pxToDp(345),
    height: pxToDp(95),
    position: "absolute",
    bottom: pxToDp(-10),
    left: pxToDp(0),
    backgroundColor: "#228F86",
    borderRadius: pxToDp(40),
    borderColor: "#FFC12F",
    borderWidth: pxToDp(5),
  },
  btnMain: {
    flex: 1,
    backgroundColor: "#228F86",
    borderRadius: pxToDp(40),
    borderColor: "#B5E0D6",
    borderWidth: pxToDp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(50),
    color: "#fff",
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
    width: pxToDpWidthLs(319),
    height: pxToDpWidthLs(452),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    backgroundColor: "#4A4A4E",
    borderRadius: pxToDp(47),
    padding: pxToDp(10),
    marginRight: pxToDp(20),
  },
  itemMain: {
    flex: 1,
    borderRadius: pxToDp(42),
    backgroundColor: "#EFE9E6",
    borderWidth: pxToDp(1),
    borderColor: "#228F86",
    padding: pxToDpWidthLs(15),
  },
  circle: {
    width: pxToDp(10),
    height: pxToDp(10),
    borderRadius: pxToDp(10),
    backgroundColor: "#1F1F26",
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
  itemImg: {
    width: pxToDpWidthLs(272),
    height: pxToDpWidthLs(272),
    position: "absolute",
    top: pxToDp(0),
    left: pxToDp(0),
    zIndex: 9,
  },
  itemImgWrap: {
    width: pxToDpWidthLs(272),
    height: pxToDpWidthLs(272),
    position: "relative",
    marginBottom: pxToDpWidthLs(25),
  },
  itemImgBgWrap: {
    flex: 1,
    backgroundColor: "#228F86",
    borderRadius: pxToDp(60),
    borderWidth: pxToDp(5),
    borderColor: "#FFC12F",
    padding: pxToDp(30),
  },
  itemImgBg: {
    flex: 1,
    backgroundColor: "#B5E0D6",
    borderRadius: pxToDp(58),
    borderWidth: pxToDp(5),
    borderColor: "#fff",
  },
  itemBtnWrap: {
    alignItems: "center",
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
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(50),
    color: "#fff",
  },
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
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    token: state.getIn(["userInfo", "token"]),
    safeInsets: state.getIn(["userInfo", "safeInsets"]),
    checkWordList: state.getIn(["square", "checkWordList"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    setCheckStoryType(data) {
      dispatch(actionCreators.setCheckStoryType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(CheckWords);
