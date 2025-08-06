import React, { Component } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import {
  pxToDp,
} from "../util/tools";
import { appStyle } from "../theme";
import { ActivityIndicator } from "antd-mobile-rn";
export default class LoadingModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={[{flex:1,backgroundColor:"#fff",borderRadius:pxToDp(32)},appStyle.flexCenter,this.props.height?{height:this.props.height}:null]}>
            <ActivityIndicator animating = {this.props.animating} text="数据加载中..."  size="large"  color={this.props.color?this.props.color:'#0179FF'}  />
        </View>
        
    );
  }
}

const styles = StyleSheet.create({
});
