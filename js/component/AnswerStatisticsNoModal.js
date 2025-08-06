import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../util/tools";
import { appStyle, appFont } from "../theme";
import { Toast, Modal } from "antd-mobile-rn";
export default class AnswerStatisticsModal extends Component {
  constructor(props) {
    super(props);
    console.log("AnswerStatisticsModal props", props);
    this.showTwo = this.props.exerciseStatistics
      ? Object.keys(this.props.exerciseStatistics).length === 2
        ? true
        : false
      : false;
  }

  static defaultProps = {
    dialogVisible: false,
    yesNumber: 0,
    noNumber: 0,
    waitNumber: 0,
  };

  render() {
    console.log("AnswerStatisticsModal props", this.props.dialogVisible);
    return this.props.dialogVisible ? (
      <View style={[styles.mainWrap, appStyle.flexCenter]}>
        {/* <Modal
          animationType="slide"
          visible={this.props.dialogVisible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transparent" },
            appStyle.flexCenter,
          ]}
        > */}
        <View
          style={[
            {
              backgroundColor: "#fff",
              width: this.showTwo ? pxToDp(500) : pxToDp(700),
            },
            borderRadius_tool(18),
            padding_tool(110, 40, 24, 40),
          ]}
        >
          <View style={[appStyle.flexCenter]}>
            <Text style={[{ color: "#666666" }, appFont.f32]}>习题已完成</Text>
          </View>
          {this.props.exerciseStatistics ? (
            <View
              style={[
                appStyle.flexTopLine,
                appStyle.flexJusBetween,
                margin_tool(28, 0, 38, 0),
              ]}
            >
              <View style={[appStyle.flexTopLine]}>
                <Text style={[appFont.f38]}>
                  {this.showTwo ? "正确" : "优秀"}:
                </Text>
                <Text style={[{ color: "#7FD23F" }, appFont.f38]}>
                  {this.props.exerciseStatistics["0"]}题
                </Text>
              </View>
              {this.showTwo ? null : (
                <View style={[appStyle.flexTopLine]}>
                  <Text style={[appFont.f38]}>良好:</Text>
                  <Text style={[{ color: "#FCAC14" }, appFont.f38]}>
                    {this.props.exerciseStatistics["1"]}题
                  </Text>
                </View>
              )}
              <View style={[appStyle.flexTopLine]}>
                <Text style={[appFont.f38]}>错误:</Text>
                <Text style={[{ color: "#FC6161" }, appFont.f38]}>
                  {this.props.exerciseStatistics["2"]}题
                </Text>
              </View>
            </View>
          ) : (
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
                  {this.props.yesNumber}题
                </Text>
              </View>
              <View style={[appStyle.flexTopLine]}>
                <Text style={[appFont.f38]}>错误:</Text>
                <Text style={[{ color: "#E86036" }, appFont.f38]}>
                  {this.props.noNumber}题
                </Text>
              </View>
              <View style={[appStyle.flexTopLine]}>
                <Text style={[appFont.f38]}>待批阅:</Text>
                <Text style={[{ color: "#E86036" }, appFont.f38]}>
                  {this.props.waitNumber}题
                </Text>
              </View>
            </View>
          )}

          <View style={[appStyle.flexCenter]}>
            <TouchableOpacity
              onPress={this.props.closeDialog}
              style={[
                size_tool(192, 64),
                {
                  backgroundColor: this.props.backBtnBg
                    ? this.props.backBtnBg
                    : "#38B3FF",
                },
                borderRadius_tool(32),
                appStyle.flexCenter,
              ]}
            >
              <Text style={[{ color: "#fff" }, appFont.f32]}>返回界面</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                position: "absolute",
                top: pxToDp(-60),
                right: 0,
                left: 0,
                flexDirection: "row",
                justifyContent: "center",
              },
            ]}
          >
            <Image
              source={require("../images/end_statistics.png")}
              style={[size_tool(136)]}
            ></Image>
          </View>
        </View>
        {/* </Modal> */}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor: "rgba(0,0,0,0.3)",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    padding: 24,
    paddingBottom: 24,
    position: "absolute",
    top: 0,
    left: 0,
  },
});
