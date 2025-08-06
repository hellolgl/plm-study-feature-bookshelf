import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import url from "../../../../../util/url";

class StretchBtn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        isOpen:false
    };
  }
  click = () => {
    const {isOpen} = this.state
    this.setState({
        isOpen:!isOpen
    },()=>{
        this.props.clickOpen();
    })
  };
  render() {
    const {isOpen} = this.state
    return (
      <TouchableOpacity
        style={[
          styles.btn,
          appStyle.flexCenter,
        ]}
        onPress={this.click}
      >
        <Text style={[{ fontSize: pxToDp(32), color: "#FCCB35" },this.props.style?this.props.style:null]}>{isOpen?'收起':'展开'}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#FFF2D5",
    paddingLeft:pxToDp(32),
    paddingRight:pxToDp(32),
    borderRadius:pxToDp(40),
    paddingLeft:pxToDp(16),
    paddingRight:pxToDp(16),
    height: pxToDp(56),
  },
});
export default StretchBtn;
