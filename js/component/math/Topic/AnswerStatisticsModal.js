import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet, DeviceEventEmitter,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../../util/tools";
import { appStyle, appFont } from "../../../theme";
import { Toast, Modal } from "antd-mobile-rn";
import {connect} from "react-redux";
import * as actionCreators from "../../../action/userInfo";
class AnswerStatisticsModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
      const {dialogVisible,yesNumber,wrongNum,showContinue,recommendProducts} = this.props
    return (
      <View style={styles.mainWrap}>
        <Modal
          animationType="slide"
          visible={dialogVisible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transparent" },
            appStyle.flexCenter,
          ]}
        >
          <View
            style={[
              {
                backgroundColor: "#fff",
                width:pxToDp(550),
              },
              borderRadius_tool(18),
              padding_tool(110, 40, 24, 40),
            ]}
          >
            <View style={[appStyle.flexCenter]}>
              <Text style={[{ color: "#666666" }, appFont.f32]}>
               {this.props.content?this.props.content:'习题已完成'}
              </Text>
            </View>
            {recommendProducts && recommendProducts.length>0?<View style={[appStyle.flexCenter]}>
              <View style={[appStyle.flexLine,appStyle.flexLineWrap,{marginTop:pxToDp(16)}]}>
                {recommendProducts.map((item,index)=>{
                  return <Text style={[styles.recommendItem,index === recommendProducts.length-1?{marginRight:0}:null]} key={index}>
                    {item}
                  </Text>
                })}</View>
                </View>:null}
            <View
                style={[
                  appStyle.flexTopLine,
                  appStyle.flexJusBetween,
                  margin_tool(28, 0, 38, 0),
                ]}
              >
                <View style={[appStyle.flexTopLine]}>
                  <Text style={[appFont.f38]}>正确:</Text>
                  <Text style={[{ color: "#7FD23F" }, appFont.f38]}>
                    {yesNumber}题
                  </Text>
                </View>
                <View style={[appStyle.flexTopLine]}>
                  <Text style={[appFont.f38]}>错误:</Text>
                  <Text style={[{ color: "#E86036" }, appFont.f38]}>
                    {wrongNum}题
                  </Text>
                </View>
                {/* <View style={[appStyle.flexTopLine]}>
                  <Text style={[appFont.f38]}>待批阅:</Text>
                  <Text style={[{ color: "#E86036" }, appFont.f38]}>
                    {this.props.waitNumber}题
                  </Text>
                </View> */}
              </View>

            <View style={[appStyle.flexCenter,appStyle.flexLine]}>
              <TouchableOpacity
                onPress={() => {
                    DeviceEventEmitter.emit("backSmartMathPage");
                    this.props.closeDialog()

                }}
                style={[
                  size_tool(192, 64),
                  { backgroundColor: "#38B3FF" },
                  borderRadius_tool(32),
                  appStyle.flexCenter,
                ]}
              >
                <Text style={[{ color: "#fff" }, appFont.f32]}>返回界面</Text>
              </TouchableOpacity>
              {showContinue?<TouchableOpacity
                onPress={this.props.continue}
                style={[
                  size_tool(192, 64),
                  { backgroundColor: "#38B3FF",marginLeft:pxToDp(16) },
                  borderRadius_tool(32),
                  appStyle.flexCenter,

                ]}
              >
                <Text style={[{ color: "#fff" }, appFont.f32]}>继续挑战</Text>
              </TouchableOpacity>:null}
            </View>
            <Image
              source={require("../../../images/end_statistics.png")}
              style={[
                size_tool(136),
                {
                  position: "absolute",
                  top: pxToDp(-60),
                  left: pxToDp(210),
                },
              ]}
            ></Image>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  recommendItem: {
    paddingTop:pxToDp(8),
    paddingBottom:pxToDp(8),
    paddingLeft:pxToDp(14),
    paddingRight:pxToDp(14),
    backgroundColor:"#EBF6F0",
    borderRadius:pxToDp(12),
    fontSize:pxToDp(32),
    color:"#42AC71",
    marginRight:pxToDp(16),
    marginBottom:pxToDp(16)
  },
});

export default AnswerStatisticsModal
