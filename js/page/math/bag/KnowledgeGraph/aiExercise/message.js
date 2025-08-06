import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  Image,
} from "react-native";
import _, { size } from "lodash";
import { useSelector, useDispatch } from "react-redux";

import { pxToDp, size_tool } from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import MyToast from "../../../../../component/square/msg";
import BackBtn from "../../../../../component/math/BackBtn";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import { GiftedChat, utils, Bubble, Day } from "react-native-gifted-chat";
import url from "../../../../../util/url";
import MyBubble from "./bubble";
const Message = (props) => {
  const { currentMessage, defaultBubble } = props;
  const { user } = currentMessage;
  const isleft = user._id === 1;
  useEffect(() => {
    console.log("currentMessage", currentMessage);
    console.log("defaultBubble", defaultBubble);
  }, []);

  const renderMessage = (props) => {
    console.log("renderMessage", props);
    return (
      <MyBubble
        {...props}
        // defaultBubble={false}
      />
    );
  };

  return (
    <View
      style={[appStyle.flexTopLine, !isleft && { justifyContent: "flex-end" }]}
    >
      {isleft ? (
        <Image
          source={require("../../../../../images/square/gpt_avatar.png")}
          style={[size_tool(140)]}
        />
      ) : null}
      <View style={[isleft && { paddingTop: pxToDp(46) }]}>
        {renderMessage(props)}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default Message;
