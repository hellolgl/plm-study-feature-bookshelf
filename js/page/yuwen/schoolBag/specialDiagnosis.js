import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";
import Bar from "../../../component/bar";
import Header from '../../../component/Header'
import OtherUserInfo from "../../../component/otherUserinfo";

const rightBgList = [
  // {
  //   img: require("../../../images/specialDiagnosis_bg2.png"),
  //   color: "#6384F0",
  //   text: "开始诊断",
  // },
  // {
  //   img: require("../../../images/specialDiagnosis_bg3.png"),
  //   color: "#FA7A30",
  //   text: "开始诊断",
  // },
  // {
  //   img: require("../../../images/specialDiagnosis_bg4.png"),
  //   color: "#3DB6FF",
  //   text: "开始诊断",
  // },
  // {
  //   img: require("../../../images/specialDiagnosis_bg5.png"),
  //   color: "#6AC829",
  //   text: "开始诊断",
  // },

];
class specialDiagnosis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          text: "汉字",
          value: "100%",
          bgColor: ["#6384F0", "#8BA0F8"],
        },
        {
          text: "词汇",
          value: "100%",
          bgColor: ["#FDAE00", "#FAC845"],
        },
        {
          text: "句型",
          value: "10%",
          bgColor: ["#FA7528", "#FC8A4B"],
        },
        {
          text: "阅读理解",
          value: "50%",
          bgColor: ["#3AB4FF", "#78D7FE"],
        },
        {
          text: "写作",
          value: "10%",
          bgColor: ["#5FC21C", "#9BE05D"],
        },
      ],
    };
  }
  toChooseText(pageType) {
    //(先跳课文选择)
    NavigationUtil.toChooseText({
      ...this.props,
      data: {
        pageType,
      },
    });
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  }
  render() {
    const { list } = this.state;
    return (
      <View style={[padding_tool(40, 48, 48, 48), { flex: 1 }]}>
        <Header text={'专项诊断'} goBack={() => {
          this.goBack()
        }}></Header>
        {/* <View style={[padding_tool(40, 48, 48, 48)]}>
        <Header text={'专项诊断'} goBack={()=>{this.goBack()}}></Header> */}
        <View style={[appStyle.flexTopLine]}>
          <View style={[styles.left]}>
            <OtherUserInfo avatarSize={164} isRow={true} hiddenBg={true}></OtherUserInfo>
            <View style={[padding_tool(48), { paddingTop: 0 }]}>
              <Bar list={list}></Bar>
            </View>
          </View>
          <View style={[styles.right, appStyle.flexTopLine]}>

            <View style={[appStyle.flexLineWrap, appStyle.flexTopLine, { justifyContent: 'space-between' }]}>
              {rightBgList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      switch (index) {
                        case 0:
                          // 字词
                          this.toChooseText(4)
                          break
                        // 智能句
                        case 1:
                          // this.toChooseText(0);
                          NavigationUtil.toChooseTextSentence({
                            ...this.props,
                            data: {
                              pageType: 0,
                            },
                          })
                          break;
                        // 阅读理解
                        case 2:
                          NavigationUtil.toReading({
                            ...this.props,
                          });
                          break;
                      }
                    }}
                  >
                    <ImageBackground
                      source={item.img}
                      style={[
                        size_tool(634, 410),
                        { marginBottom: pxToDp(48) },
                      ]}
                      resizeMode={"stretch"}
                    >
                      {/* <Text
                        style={[styles.goDetailsBtn, { color: item.color }]}
                      >
                        {item.text}
                      </Text> */}
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  left: {
    width: pxToDp(600),
    height: pxToDp(870),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
  },
  right: {
    flex: 1,
  },
  goDetailsBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    position: "absolute",
    fontSize: pxToDp(32),
    right: pxToDp(24),
    bottom: pxToDp(24),
  },
  selectBtnText: {
    color: "#38B3FF",
    fontSize: pxToDp(38),
    paddingLeft: pxToDp(33),
  },
});
export default specialDiagnosis;
