import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  SafeAreaView,
} from "react-native";
import _, { size } from "lodash";

import { pxToDp, size_tool } from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import MyToast from "../../../../../component/square/msg";
import BackBtn from "../../../../../component/math/BackBtn";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import Talk from "./talk";
// import Talk from "../../../../../component/AiTalk/Modal";
const MathAiExercise = ({ navigation }) => {
  const knowledge_name = navigation.state.params.data.name;
  useEffect(() => {
    console.log("-----", navigation.state.params.data);
  }, []);
  const goBack = () => {
    NavigationUtil.goBack({ navigation });
  };
  return (
    <ImageBackground
      style={styles.contain}
      source={require("../../../../../images/square/bg_1.png")}
    >
      {/* <View style={[styles.headerWrap]}>
        <BackBtn goBack={goBack} style={{ zIndex: 2 }}></BackBtn>
        <Text style={[styles.headerTxt]}>{knowledge_name}</Text>
      </View> */}
      <View style={[{ height: "100%", backgroundColor: "rgba(255,0,0,0.3)" }]}>
        {/* <Talk navigation={navigation} /> */}
        <View
          style={{
            flex: 1,
            marginTop: pxToDp(54),
            paddingBottom: Platform.OS === "android" ? pxToDp(200) : pxToDp(30),
          }}
        >
          <Talk navigation={navigation}></Talk>
        </View>
      </View>
      {/* <View
        style={[
          {
            width: "100%",
            height: pxToDp(48),
            // backgroundColor: "pink",
          },
        ]}
      ></View> */}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  contain: {
    flex: 1,
    padding: pxToDp(48),
  },
  headerWrap: {
    height: pxToDp(Platform.OS === "ios" ? 180 : 120),
    backgroundColor: "#4352A7",
    borderBottomColor: "#22294D",
    borderBottomWidth: pxToDp(8),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(44),
    lineHeight: pxToDp(44),
    color: "#fff",
  },
});
export default MathAiExercise;
