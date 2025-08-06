import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { pxToDp } from "../util/tools";

export default class BaseButton extends Component {
  onPress = () => {
    const { onPress } = this.props;
    onPress ? onPress() : "";
  };

  render() {
    const { text, backgroundColor } = this.props;
    const styleButton = this.props.style || styles.button;
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.button,
            styleButton,
            {
              backgroundColor: backgroundColor ? backgroundColor : "#33A1FDFF",
            },
          ]}
          onPress={this.onPress}
        >
          <Text
            style={[
              styles.buttonText,
              styleButton.fontSize
                ? { fontSize: styleButton.fontSize }
                : { fontSize: pxToDp(32) },
            ]}
          >
            {text ? text : "确定"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingTop:pxToDp(8),
    paddingBottom:pxToDp(8),
    paddingLeft:pxToDp(32),
    paddingRight:pxToDp(32),
    borderRadius: pxToDp(40),
    backgroundColor: "#33A1FDFF",
    justifyContent: "center",
    borderColor: "#33A1FDFF",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
  },
});
