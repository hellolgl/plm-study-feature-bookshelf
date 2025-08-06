import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
  TextInput,
} from "react-native";
import { appStyle } from "../../../theme";
import { pxToDp } from "../../../util/tools";

class Cursor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opcityValue: new Animated.Value(0)
    };
  }
  componentDidMount(){
    this.loopOpcity()
  }
  loopOpcity = () => {
    const animationArr = Animated.sequence([
      Animated.timing(this.state.opcityValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opcityValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(animationArr).start()
  };
  render() {
    const {color} = this.props
    return (
      <Animated.View style={[styles.wrap,{opacity: this.state.opcityValue},color?{backgroundColor:color}:null]}></Animated.View>
    );
  }
}

const styles = StyleSheet.create({
    wrap:{
        width:pxToDp(4),
        height:pxToDp(40),
        backgroundColor:"#FFAE66",
        marginLeft:pxToDp(6),
    }
});
export default Cursor;
