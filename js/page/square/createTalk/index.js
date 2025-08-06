import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../../util/tools";
import Talk from "./components/talk";
import NavigationUtil from "../../../navigator/NavigationUtil";

function CreateTalk(props) {
  const isPhone = !getIsTablet();
  const goBack = () => {
    NavigationUtil.goBack(props);
  };
  return (
    <ImageBackground
      source={require("../../../images/square/bg_1.png")}
      style={[
        { flex: 1, paddingTop: pxToDp(20) },
        isPhone
          ? {
              paddingLeft: pxToDpWidthLs(102),
              paddingRight: pxToDpWidthLs(102),
            }
          : Platform.OS === "ios"
          ? { paddingTop: pxToDp(50) }
          : null,
      ]}
    >
      <TouchableOpacity
        style={[
          {
            marginLeft: pxToDp(45),
            width: pxToDp(230),
            marginBottom: pxToDp(20),
          },
        ]}
        onPress={goBack}
      >
        <Image
          style={[
            {
              width: pxToDp(120),
              height: pxToDp(80),
            },
          ]}
          source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
        />
      </TouchableOpacity>
      <Talk
        navigation={props.navigation}
        // toSquareHistory={() => {
        //   NavigationUtil.toSquareHistory(props);
        // }}
      ></Talk>
    </ImageBackground>
  );
}
export default CreateTalk;
