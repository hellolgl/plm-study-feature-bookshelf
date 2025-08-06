import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  Image,
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
import PlayIcon from "../../../../../component/PlayIcon";

const MyBubble = (props) => {
  const { currentMessage, defaultBubble } = props;
  const { user, text } = currentMessage;
  const isleft = user._id === 1;
  const styles = isleft ? leftstyles : rightstyles;
  const [playing, setplaying] = useState(false);
  useEffect(() => {
    console.log("currentMessage", currentMessage);
    console.log("defaultBubble", defaultBubble);
  }, []);
  const playAudio = () => {
    setplaying((e) => !e);
  };
  return (
    <View
      style={[
        appStyle.flexTopLine,
        commonStyle.contentWrap,
        styles.contentWrap,
      ]}
    >
      <TouchableOpacity onPress={playAudio} style={[appStyle.flexTopLine]}>
        <PlayIcon
          style={commonStyle.audioBtn}
          playing={playing}
          source={{
            uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-audio-playing.json",
          }}
        >
          <Image
            style={commonStyle.audioBtn}
            resizeMode="stretch"
            source={require("../../../../../images/custom/audio_btn_1.png")}
          />
        </PlayIcon>
        <Text style={[commonStyle.contentTxt, styles.contentTxt]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const commonStyle = StyleSheet.create({
  contentWrap: {
    padding: pxToDp(24),
    borderRadius: pxToDp(56),
    minHeight: pxToDp(112),
    borderWidth: pxToDp(2),
    borderColor: "#61D1BF",
    alignItems: "center",
  },
  contentTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(36),
    lineHeight: pxToDp(40),
  },
  audioBtn: {
    width: pxToDp(40),
    height: pxToDp(40),
    marginRight: pxToDp(10),
  },
});
const leftstyles = StyleSheet.create({
  contentWrap: {
    borderTopLeftRadius: pxToDp(0),
    backgroundColor: "#10131F",
  },
  contentTxt: {
    color: "#fff",
  },
});
const rightstyles = StyleSheet.create({
  contentWrap: {
    borderTopRightRadius: pxToDp(0),
    backgroundColor: "#61D1BF",
  },
  contentTxt: {
    color: "#22294D",
  },
});
export default MyBubble;
