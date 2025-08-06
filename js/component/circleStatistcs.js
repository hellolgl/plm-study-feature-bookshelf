/**圆形卡片组件 */
import React, { Component } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { appFont, appStyle } from "../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
} from "../util/tools";

export default class CircleStatistcs extends Component {
  render() {
    // colorFlag,0表示灰色背景，没有做的题目，1是橙色背景，表示做对了的题目，2是红色背景，表示做错了的题目
    // console.log("颜色", this.props.tintColor ? this.props.right : '')
    return (
      <View style={{}}>
        <AnimatedCircularProgress
          lineCap="round"
          rotation={0}
          size={this.props.size ? pxToDp(this.props.size) : pxToDp(240)}
          width={this.props.width ? pxToDp(this.props.width) : pxToDp(38)}
          fill={this.props.right}
          tintColor={this.props.tintColor ? this.props.tintColor : "#0179FF"}
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor={
            this.props.backgroundColor ? this.props.backgroundColor : "#B2D6FE"
          }
          backgroundWidth={
            this.props.backgroundWidth
              ? pxToDp(this.props.backgroundWidth)
              : this.props.width
              ? pxToDp(this.props.width + 2)
              : pxToDp(38)
          }
        >
          {(fill) =>
            this.props.type === "percent" ? (
              <View style={[appStyle.flexCenter]}>
                {this.props.noTxt ? null : (
                  <Text
                    style={[
                      {
                        fontSize: this.props.percenteSize
                          ? pxToDp(this.props.percenteSize)
                          : pxToDp(28),
                        color: this.props.textColor1
                          ? this.props.textColor1
                          : this.props.tintColor,
                        lineHeight: this.props.percenteSize
                          ? pxToDp(this.props.percenteSize + 10)
                          : pxToDp(38),
                      },
                      this.props.fontFamily_1 ? this.props.fontFamily_1 : null,
                      appFont.fontFamily_jcyt_500,
                    ]}
                  >
                    {this.props.right + "%"}
                  </Text>
                )}
                {this.props.noTxt ? null : (
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(20),
                        lineHeight: pxToDp(30),
                        color: this.props.textColor
                          ? this.props.textColor
                          : "#9595A6",
                      },
                      this.props.fontFamily
                        ? this.props.fontFamily
                        : appFont.fontFamily_jcyt_500,
                      fontFamilyRestoreMargin(),
                    ]}
                  >
                    {this.props.totalText ? this.props.totalText : ""}
                  </Text>
                )}
              </View>
            ) : (
              <View
                style={[
                  {
                    backgroundColor: this.props.textBg
                      ? this.props.textBg
                      : "#FFFFFFFF",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                {this.props.noTxt ? null : (
                  <Text
                    style={[
                      {
                        fontSize: pxToDp(30),
                        color: this.props.textColor
                          ? this.props.textColor
                          : "#AAAAAA",
                      },
                      appFont.fontFamily_jcyt_500,
                      fontFamilyRestoreMargin(),
                    ]}
                  >
                    {this.props.totalText ? this.props.totalText : "Total"}
                  </Text>
                )}
                {this.props.noTxt ? null : (
                  <Text
                    style={[
                      {
                        color: this.props.textColor1
                          ? this.props.textColor1
                          : "#333",
                        fontSize: pxToDp(34),
                      },
                      appFont.fontFamily_jcyt_500,
                      fontFamilyRestoreMargin("", -30),
                    ]}
                  >
                    {this.props.total}
                  </Text>
                )}
              </View>
            )
          }
        </AnimatedCircularProgress>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
