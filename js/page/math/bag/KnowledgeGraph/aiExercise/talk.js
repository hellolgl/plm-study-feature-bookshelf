import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  TouchableOpacity,
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
import Message from "./message";
const MathAiExercise = ({ navigation }) => {
  const { avatar } = useSelector((state) => state.toJS().userInfo);
  useEffect(() => {
    // console.log("-----talk", navigation.state.params.data);
  }, []);
  const [messages, setmessages] = useState([
    // {
    //   text: "1.发的消息啦～～～～",
    //   _id: 0,
    //   user: {
    //     _id: 2,
    //     name: "abc",
    //   },
    // },
    // {
    //   text: "2.消息啦～～～～",
    //   _id: 1,
    //   user: {
    //     _id: 1,
    //     name: "123",
    //   },
    // },
  ]);
  const renderMessage = (props) => {
    console.log("renderMessage", props);
    return (
      <Message
        {...props}
        // defaultBubble={false}
      />
    );
  };
  const onSend = (message) => {
    console.log("onSend", message);
  };
  const renderInputToolbar = () => {
    console.log("renderInputToolbar");

    return (
      <View style={[appStyle.flexTopLine, styles.footerWrap]}>
        {/* <View style={[styles.checkWrap]}>
          <Text style={[{ color: "#fff" }]}>renderInputToolbar</Text>
        </View> */}
        {/* {renderSend()} */}
      </View>
    );
  };
  const renderSend = () => {
    return (
      <TouchableOpacity
        style={[
          size_tool(200, 128),
          {
            backgroundColor: "#7D7D7D",
            borderRadius: pxToDp(64),
            paddingBottom: pxToDp(8),
          },
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              backgroundColor: "#9D9D9D",
              borderRadius: pxToDp(64),
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={[{ color: "#fff" }]}>提交</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <GiftedChat
      messages={messages}
      renderMessage={renderMessage}
      onSend={(messages) => onSend(messages)}
      renderInputToolbar={renderInputToolbar}
      user={{
        _id: 2,
      }}
    />
  );
};
const styles = StyleSheet.create({
  checkWrap: {
    flex: 1,
    backgroundColor: "#363C53",
    borderRadius: pxToDp(50),
    minHeight: pxToDp(128),
  },
  footerWrap: {
    // height: pxToDp(28),
    // minHeight: pxToDp(208),
    // position: "relative",
    // bottom: pxToDp(0),
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0,255,0,0.3)",
    height: pxToDp(162), // 设置固定高度
    // paddingHorizontal: 10,
    // position: "relative",
  },
});
export default MathAiExercise;
