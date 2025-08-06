import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { pxToDp, size_tool } from "../util/tools";
import { appStyle ,appFont} from "../theme";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { text, haveAvatar, txtStyle } = this.props;
    return (
      <View style={[styles.header, appStyle.flexCenter]}>
        <Text style={[styles.txt, txtStyle ? txtStyle : null,appFont.fontFamily_syst]}>{text}</Text>
        <TouchableOpacity
          style={[styles.backBtn]}
          onPress={() => {
            this.props.goBack();
          }}
        >
          <Image
            source={require("../images/statisticsGoBack.png")}
            style={[size_tool(64)]}
          ></Image>
        </TouchableOpacity>
        {haveAvatar ? (
          <Image
            source={require("../images/head_img.png")}
            style={[
              appStyle.headerImg,
              styles.headerAvatar,
              { borderRadius: 17 },
            ]}
          ></Image>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: pxToDp(104),
    backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(40),
    position: "relative",
  },
  txt: {
    color: "#333",
    fontSize: pxToDp(42),
  },
  backBtn: {
    position: "absolute",
    top: pxToDp(20),
    left: pxToDp(32),
  },
  headerAvatar: {
    position: "absolute",
    right: pxToDp(32),
  },
});
