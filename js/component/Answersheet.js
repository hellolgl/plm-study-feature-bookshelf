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

// status 0对 1错   
const bg_Map = {
  '0': '#7FD23F',
  '1': '#FC6161'
}
class Answersheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { number, status } = this.props;
    return <View style={[styles.card, status ? { backgroundColor: bg_Map[status] } : null, appStyle.flexCenter]}>
      <Text style={[{ color: '#fff' }]}>{number + 1}</Text>
    </View>
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  card: {
    width: pxToDp(56),
    height: pxToDp(56),
    lineHeight: pxToDp(56),
    backgroundColor: "#CBBD8F",
    borderRadius: pxToDp(12),
    textAlign: "center",
    marginRight: pxToDp(32),
    marginBottom: pxToDp(32),
    color: "#fff",
  },
});
export default Answersheet;
