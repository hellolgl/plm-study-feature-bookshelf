import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import url from "../../../util/url";

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
    const { height } = this.props;
    const {isOpen} = this.state
    return (
      <TouchableOpacity
        style={[
          styles.btn,
          appStyle.flexCenter,
        ]}
        onPress={this.click}
      >
        <Text style={{ fontSize: pxToDp(30), color: "#FCCB35" }}>{isOpen?'收起':'展开'}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#FFF2D5",
    position: "absolute",
    right: 0,
    borderTopEndRadius: pxToDp(32),
    borderBottomStartRadius: pxToDp(32),
    padding:pxToDp(8)
  },
});
export default StretchBtn;
