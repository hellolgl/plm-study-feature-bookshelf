import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { appFont, appStyle } from "../../theme";
import { pxToDp, padding_tool, size_tool } from "../../util/tools";
import { setVisibleSignIn,setShowSignInCoin} from "../../action/userInfo";

import { useSelector, useDispatch } from "react-redux";
const SignIn = () => {
  const dispatch = useDispatch()
  const { visibleSignIn,showSignInCoin,sigInData } = useSelector((state) => state.toJS().userInfo);
  const tip = sigInData.tip?sigInData.tip:{
    en_tip: "",
    zh_tip: "",
  }
  // console.log('visibleSignIn:::::::::::::',visibleSignIn)
  // console.log('showSignInCoin:::::::::::::',showSignInCoin)
  // console.log('sigInData:::::::::::::',sigInData)
  return visibleSignIn ? (
    <View style={[styles.contain]}>
      <View style={[styles.containWrap]}>
        <View style={[styles.titleWrap]}>
          <Text style={[styles.titleTxt]}>每日打卡</Text>
        </View>
        <View>
          <Text style={[styles.mainTxt]}>{tip.zh_tip}</Text>
          <Text style={[styles.mainTxt2]}>{tip.en_tip}</Text>
        </View>
        <TouchableOpacity style={[styles.closeBtnWrap]} onPress={()=>{
          dispatch(setVisibleSignIn(false))
          dispatch(setShowSignInCoin(false))
        }}>
          <Text style={[styles.closeBtnTxt]}>确认</Text>
          {showSignInCoin ? (
            <View style={[styles.addCoinWrap]}>
              <Image
                style={[size_tool(36)]}
                source={require("./../../images/square/paiCoin2.png")}
              />
              <Text style={[styles.addCoinTxt]}>+20</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  contain: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  containWrap: {
    width: pxToDp(942),
    minHeight: pxToDp(410),
    backgroundColor: "#fff",
    borderRadius: pxToDp(70),
    ...padding_tool(24, 30, 24, 30),
    alignItems: "center",
  },
  titleWrap: {
    height: pxToDp(100),
    width: "100%",
    backgroundColor: "#E9E5E3",
    borderRadius: pxToDp(36),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: pxToDp(30),
  },
  titleTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(48),
    lineHeight: pxToDp(48),
    color: "#283139",
  },
  mainTxt: {
    color: "#283139",
    fontSize: pxToDp(40),
    lineHeight: pxToDp(60),
    ...appFont.fontFamily_jcyt_500,
  },
  mainTxt2: {
    color: "#283139",
    fontSize: pxToDp(30),
    lineHeight: pxToDp(40),
    ...appFont.fontFamily_jcyt_500,
    marginBottom: pxToDp(18),
  },
  closeBtnWrap: {
    width: pxToDp(376),
    height: pxToDp(84),
    borderRadius: pxToDp(28),
    borderWidth: pxToDp(4),
    borderColor: "#FFC12F",
    backgroundColor: "#FF9B48",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  closeBtnTxt: {
    fontSize: pxToDp(36),
    color: "#fff",
    lineHeight: pxToDp(40),
    ...appFont.fontFamily_jcyt_700,
  },
  addCoinWrap: {
    width: pxToDp(122),
    height: pxToDp(55),
    backgroundColor: "rgba(255,238,196,0.5)",
    borderRadius: pxToDp(28),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: pxToDp(16),
  },
  addCoinTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(24),
    color: "#21C128",
    lineHeight: pxToDp(24),
    marginLeft: pxToDp(10),
  },
});
export default SignIn;
