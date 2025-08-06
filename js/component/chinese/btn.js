import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { pxToDp, padding_tool } from "../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { appStyle, appFont } from "../../theme";

class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { styleObj, txt, clickBtn, otherStyle, noFamily, fontStyle } =
      this.props;
    const {
      paddingHeight,
      borderRadius,
      width,
      height,
      bgColor,
      bottomColor,
      fontSize,
      fontColor,
    } = styleObj;

    return (
      <TouchableOpacity
        onPress={clickBtn ? clickBtn : () => {}}
        style={[
          {
            minWidth: width ? width : "100%",
            minHeight: height ? height : pxToDp(120),
            paddingBottom: paddingHeight ? paddingHeight : pxToDp(8),
            borderRadius: borderRadius ? borderRadius : pxToDp(200),
            backgroundColor: bottomColor ? bottomColor : "transparent",
          },
          otherStyle,
        ]}
      >
        <View
          style={[
            padding_tool(20),
            {
              flex: 1,
              backgroundColor: bgColor ? bgColor : "transparent",
              borderRadius: borderRadius ? borderRadius : pxToDp(200),
            },
            appStyle.flexCenter,
          ]}
        >
          <Text
            style={[
              noFamily ? "" : appFont.fontFamily_jcyt_700,
              {
                fontSize: fontSize ? fontSize : pxToDp(46),
                color: fontColor ? fontColor : "#fff",
              },
              fontStyle && fontStyle,
            ]}
          >
            {txt}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});

export default Bar;
