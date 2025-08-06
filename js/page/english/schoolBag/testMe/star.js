import React, { Component } from "react";
import { Image, StyleSheet, Animated } from "react-native";
import { pxToDp, size_tool } from "../../../../util/tools";

export default class DashSecondLine extends Component {
  constructor() {
    super();
    this.opacity = new Animated.Value(1);
    this.rotateValue = new Animated.Value(0);
    this.state = {
      isOpacity: true,
    };
  }
  changeRotate() {
    // this.changeOpacity()
    const animationArr = Animated.sequence([
      Animated.timing(this.rotateValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(this.rotateValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);
    Animated.loop(animationArr).start();
  }
  changeOpacity() {
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 3000,
    }).start();
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    tempState.isOpacity = props.isOpacity;
    console.log("tempState", tempState);
    return tempState;
  }
  componentDidUpdate() {
    if (this.state.isOpacity) {
      this.changeOpacity();
      this.changeRotate();
    }
  }
  render() {
    return (
      <>
        <Animated.Image
          source={require("../../../../images/englishHomepage/testMe/testMeStar.png")}
          style={[
            size_tool(160, 136),
            {
              transform: [
                {
                  rotateZ: this.rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: this.state.isOpacity
                      ? ["-20deg", "20deg"]
                      : ["0deg", "30deg"],
                  }),
                },
              ],
            },
          ]}
        />
        {/* <Animated.Image
                    source={require('../../../../images/englishHomepage/testMe/testMePop.png')}
                    style={[size_tool(196), {
                        opacity: this.opacity,
                        position: 'absolute',
                        top: 0, left: 0,
                    }]}
                /> */}
      </>
    );
  }
}
const styles = StyleSheet.create({});
