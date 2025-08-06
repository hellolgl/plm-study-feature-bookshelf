import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { appFont, appStyle } from "../theme";
import { pxToDp, padding_tool, size_tool } from "../util/tools";

import { useSelector, useDispatch } from "react-redux";
import url from "../util/url";
import Lottie from "lottie-react-native";

const Loading = ({ showLoading, text }) => {
  return (
    <View
      style={[
        styles.click_region,
        showLoading && { zIndex: 10 },
        appStyle.flexCenter,
        { opacity: showLoading ? 1 : 0 },
      ]}
    >
      <Lottie
        // source={{
        //   uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-story-loading.json",
        // }}
        source={require("../res/json/wordIseLoading.json")}
        autoPlay
        style={[
          { width: pxToDp(200), height: pxToDp(200), marginTop: pxToDp(-5) },
        ]}
      />
      {text ? (
        <Text style={[{ fontSize: pxToDp(40), color: "#CA9056" }]}>{text}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  click_region: {
    flex: 1,
    // backgroundColor: "rgba(71, 82, 102, 0.5)",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
    top: pxToDp(0),
    left: pxToDp(0),
  },
});
export default Loading;
