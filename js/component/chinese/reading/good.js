import React, { PureComponent } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { appStyle } from "../../../theme";
import { pxToDp, size_tool } from "../../../util/tools";
import Lottie from "lottie-react-native";

class CharacterHelpModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={[
          appStyle.flexCenter,
          {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 999,
          },
        ]}
      >
        {/* <Image style={[size_tool(660)]} source={require('../../../images/chineseHomepage/pingyin/new/good.png')} /> */}
        <Lottie
          source={require("../../../res/json/good.json")}
          style={{ width: pxToDp(600), height: pxToDp(600) }}
          autoPlay
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
export default CharacterHelpModal;
