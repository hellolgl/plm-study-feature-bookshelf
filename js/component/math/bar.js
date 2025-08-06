import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import {
  pxToDp,
} from "../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { appStyle } from "../../theme";

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
      <View style={[appStyle.flexJusBetween, { height: pxToDp(480) }]}>
        {this.props.list ? this.props.list.map((item, index) => {
          return (
            <View
              style={[
                {
                  marginBottom: index === this.props.list.length - 1 ? 0 : pxToDp(24),
                  width: pxToDp(492),
                  // height: pxToDp(184),
                  backgroundColor: item.backgroundColor || 'rgba(120, 215, 254, 0.15)',
                  borderRadius: pxToDp(24),
                  height: item.viewHeight ? item.viewHeight : pxToDp(184),
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: pxToDp(24), marginEnd: pxToDp(24), marginBottom: pxToDp(12), }}>
                <Text
                  style={[
                    {
                      color: item.textColor || "rgba(15, 158, 245, 1)",
                      fontSize: item.percentFontsize ? item.percentFontsize : pxToDp(60),
                      width: pxToDp(152),
                      // height: pxToDp(90)
                    },
                  ]}
                >
                  {item.value || '0%'}
                </Text>
                <Text
                  style={[
                    {
                      color: "#333",
                      fontSize: item.textFontsize ? item.textFontsize : pxToDp(28),
                      // marginBottom: pxToDp(12),
                    },
                  ]}
                >
                  {item.text}
                </Text>
              </View>

              <View style={[styles.outer, { marginLeft: pxToDp(24), marginEnd: pxToDp(24), height: item.barHeight ? item.barHeight : pxToDp(46) }]}>
                <Animated.View
                  style={[
                    styles.inner,
                    {
                      width: width.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', item.value],
                      }),
                      height: item.barHeight ? item.barHeight : pxToDp(46)
                    },
                  ]}
                >
                  <LinearGradient
                    colors={item.bgColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: item.barHeight ? item.barHeight : pxToDp(46), borderRadius: pxToDp(32) }}
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
    height: pxToDp(46),
    backgroundColor: "#ffffff",
    borderRadius: pxToDp(32),
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
