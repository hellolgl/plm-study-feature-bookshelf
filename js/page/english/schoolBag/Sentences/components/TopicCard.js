import React, { PureComponent } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text
} from "react-native";
import { size_tool, pxToDp } from "../../../../../util/tools";
import { appFont,appStyle } from "../../../../../theme";
const status_map = {
  "0": require("../../../../../images/en_status0.png"), //绿色
  "1": require("../../../../../images/en_status1.png"), //橘色
  "2": require("../../../../../images/en_status2.png"), //红色
};
class TopicCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <View style={[styles.circle]}>
      <View style={[styles.circleInner]}>
        <Text style={[{color:"#445268",fontSize:pxToDp(50)},appFont.fontFamily_jcyt_700]}>{this.props.index + 1}</Text>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  circle: {
    width: pxToDp(100),
    height: pxToDp(100),
    borderRadius: pxToDp(50),
    padding:pxToDp(3),
    borderWidth:pxToDp(5),
    borderColor:"#FF9032",
    marginRight:pxToDp(50)
  },
  circleInner:{
    ...appStyle.flexCenter,
    flex:1,
    backgroundColor:"#00CB8E",
    borderRadius:pxToDp(40)
  }
});
export default TopicCard;
