import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appStyle } from "../theme";
import { size_tool, pxToDp, padding_tool } from "../util/tools";
const status_map = {
  "0": "#7FD23F",     //绿色
  "1": "#FCAC14",     //橘色
  "2": "#FC6161",     //红色
  '3': '#DDDDDD'
};
class HeaderCircleCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={[
          styles.circle,
          {
            backgroundColor: status_map[this.props.status]
              ? status_map[this.props.status]
              : "#DDDDDD",
          },
        ]}
      ></View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: pxToDp(30),
    height: pxToDp(30),
    borderRadius: pxToDp(15),
    marginRight: pxToDp(24),
  },
});
export default HeaderCircleCard;
