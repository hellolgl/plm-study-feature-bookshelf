import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { pxToDp, size_tool } from "../util/tools";
import { appStyle ,appFont} from "../theme";


// haveAllRadius 是否全有圆角
// color 文字的颜色
// style 按钮的样式

export default class Freebtn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {color,haveAllRadius,style,txt} = this.props
    return (
      <View style={[styles.btn,haveAllRadius?{borderBottomLeftRadius:pxToDp(40)}:null,style?style:null]}>
          <Text style={[styles.txt,color?{color}:null]}>{txt?txt:'免费'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn:{
    width:pxToDp(96),
    height:pxToDp(68),
    borderRadius:pxToDp(40),
    borderBottomLeftRadius:0,
    backgroundColor:"#00B295",
    ...appStyle.flexCenter
  },
  txt:{
    fontSize:pxToDp(28),
    color:"#fff",
    ...appFont.fontFamily_jcyt_700
  }
});
