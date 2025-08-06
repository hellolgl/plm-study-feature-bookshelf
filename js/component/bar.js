import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { pxToDp } from "../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { appStyle } from "../theme";

class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(0),
      list: this.props.list,
    };
  }
  componentDidMount() {
    Animated.timing(this.state.width, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  render() {
    const { list, width } = this.state;
    return (
      <View
        style={[
          appStyle.flexJusBetween,
          { height: this.props.height ? this.props.height : pxToDp(480) },
        ]}
      >
        {this.props.list
          ? this.props.list.map((item, index) => {
              console.log("数据", item.value.split(""));
              return (
                <View
                  style={[
                    {
                      marginBottom:
                        index === this.props.list.length - 1 ? 0 : pxToDp(10),
                    },
                    appStyle.flexTopLine,
                    appStyle.flexAliCenter,
                  ]}
                >
                  <View
                    style={[
                      { width: pxToDp(120), marginRight: pxToDp(20) },
                      appStyle.flexAliEnd,
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color: "#333",
                          fontSize: pxToDp(24),
                          marginBottom: pxToDp(12),
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                  <View style={[styles.outer]}>
                    {item.value.split("")[0] === "0" ? null : (
                      <Animated.View
                        style={[
                          styles.inner,
                          {
                            width: width.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", item.value],
                            }),
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={item.bgColor}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            height: pxToDp(24),
                            borderRadius: pxToDp(32),
                          }}
                        ></LinearGradient>
                      </Animated.View>
                    )}
                  </View>
                  <View style={[{ width: pxToDp(80), marginLeft: pxToDp(20) }]}>
                    <Text
                      style={[
                        {
                          color: "#333",
                          fontSize: pxToDp(24),
                          marginBottom: pxToDp(12),
                        },
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                </View>
              );
            })
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    height: pxToDp(24),
    backgroundColor: "#fff",
    flex: 1,
    borderRadius: pxToDp(32),
    position: "relative",
  },
  inner: {
    position: "absolute",
    left: 0,
    top: 0,
    height: pxToDp(46),
    borderRadius: pxToDp(32),
  },
});

export default Bar;
