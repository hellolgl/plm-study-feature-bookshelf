import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import {
  pxToDp,
} from "../../util/tools";
import LinearGradient from "react-native-linear-gradient";

class Bar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(0),
      list: this.props.list
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
      <View style={[this.props.style, { width: pxToDp(600), height: pxToDp(36) }]}>
        {this.props.list ? this.props.list.map((item, index) => {
          return (
            <View
              style={[
                {
                  marginBottom: index === this.props.list.length - 1 ? 0 : pxToDp(10),
                },
              ]}
            >

              <View style={[styles.outer]}>
                <Animated.View
                  style={[
                    styles.inner,
                    {
                      width: width.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', item.value],
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={item.bgColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: pxToDp(48), borderRadius: pxToDp(32) }}
                  ></LinearGradient>
                </Animated.View>
              </View>
            </View>
          );
        }) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    height: pxToDp(48),
    backgroundColor: "#EEF3F5",
    borderRadius: pxToDp(32),
  },
  inner: {
    position: "absolute",
    left: 0,
    top: 0,
    height: pxToDp(48),
    borderRadius: pxToDp(32),
  },
});

export default Bar;
