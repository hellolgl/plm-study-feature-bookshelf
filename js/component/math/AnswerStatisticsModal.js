import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import { Toast, Modal } from "antd-mobile-rn";
export default class AnswerStatisticsModal extends Component {
  constructor(props) {
    super(props);
    //console.log("AnswerStatisticsModal props", props);
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
    return (
      <View style={styles.mainWrap}>
        <Modal
          animationType="slide"
          visible={this.props.dialogVisible}
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
                width: this.showTwo ? pxToDp(500) : pxToDp(700),
              },
              borderRadius_tool(18),
              padding_tool(110, 40, 24, 40),
            ]}
          >
            <View style={[appStyle.flexCenter]}>
              <Text style={[{ color: "#666666",marginBottom: pxToDp(24) }, appFont.f32]}>
                {this.props.content||'习题已完成,恭喜你超过了90%的同学'}
              </Text>
            </View>

            <View style={[appStyle.flexCenter]}>
              <TouchableOpacity
                onPress={this.props.closeDialog}
                style={[
                  size_tool(192, 64),
                  { backgroundColor: "#38B3FF" },
                  borderRadius_tool(32),
                  appStyle.flexCenter,
                ]}
              >
                <Text style={[{ color: "#fff" }, appFont.f32]}>{this.props.btnText||'返回界面'}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../images/end_statistics.png")}
              style={[
                size_tool(136),
                {
                  position: "absolute",
                  top: pxToDp(-60),
                  left: this.showTwo ? pxToDp(210) : pxToDp(280),
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
  mainWrap: {
    height: "100%",
    width: "100%",
    padding: 24,
  },
});
