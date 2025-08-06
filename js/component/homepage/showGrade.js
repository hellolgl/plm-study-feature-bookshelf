import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { appFont, appStyle } from "../../theme";
import { pxToDp, padding_tool, size_tool } from "../../util/tools";

import { useSelector, useDispatch } from "react-redux";

const AvatarAndName = ({ onClick, headBg }) => {
  const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
  const { grade, term, textBook, textbookname } = currentUserInfo;
  return (
    <TouchableOpacity
      // onLayout={(e) => {
      //   this.onLayout(e, 0);
      // }}
      onPress={() => {
        onClick();
      }}
    >
      <View style={[styles.selectGradeWrap]}>
        <Text style={[styles.selectGradeTxt]}>
          {grade && term ? grade + term : "切换年级"}
        </Text>
        <View style={[styles.line, styles.gradeLine]}></View>
        <Text style={[styles.bookTxt]}>
          {textBook ? textbookname : "北师版"}
        </Text>
        <Text style={[styles.mathTxt]}>(数学)</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectGradeWrap: {
    borderRadius: pxToDp(30),
    borderWidth: pxToDp(4),
    borderColor: "#fff",
    height: pxToDp(80),
    backgroundColor: "#454A65",
    ...appStyle.flexTopLine,
    ...appStyle.flexCenter,
    ...padding_tool(8, 25, 0, 25),
  },
  selectGradeTxt: {
    color: "#fff",
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
    ...appFont.fontFamily_jcyt_700,
  },
  gradeLine: {
    backgroundColor: "#fff",
    marginLeft: pxToDp(10),
    marginRight: pxToDp(10),
    opacity: 0.4,
    height: pxToDp(27),
  },

  bookTxt: {
    color: "#fff",
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
    ...appFont.fontFamily_jcyt_700,
  },
  mathTxt: {
    color: "#fff",
    fontSize: pxToDp(20),
    lineHeight: pxToDp(40),
    ...appFont.fontFamily_jcyt_700,
  },
  line: {
    width: pxToDp(4),
    height: pxToDp(40),
    backgroundColor: "#BAB8B7",
    marginLeft: pxToDp(40),
    marginRight: pxToDp(40),
  },
});
export default AvatarAndName;
