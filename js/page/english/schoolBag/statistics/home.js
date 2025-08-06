import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import UserInfo from "../../../../component/userInfo";
import { connect } from "react-redux";
import { LineChart } from "react-native-charts-wrapper";
import CircleStatistcs from "../../../../component/circleStatistcs";
const StatisticsHome = () => {
  return (
    <View>
      <Text>统计</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  header: {
    height: pxToDp(110),
    // backgroundColor: "#fff",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(48),
    position: "relative",
    justifyContent: "space-between",
  },
  left: {
    width: pxToDp(572),
    height: Dimensions.get("window").height * 0.7,
    backgroundColor: "#fff",
    // backgroundColor: "red",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
    justifyContent: "space-between",
  },
  right: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // backgroundColor: "green",
    height: Dimensions.get("window").height * 0.7,
  },
  goDetailsBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    position: "absolute",
    fontSize: pxToDp(32),
    left: pxToDp(28),
    bottom: pxToDp(28),
  },
  rightText: {
    fontSize: pxToDp(38),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  rightItem: {
    // width: pxToDp(634),
    width: Dimensions.get("window").width * 0.31,
    height: Dimensions.get("window").height * 0.33,
    maxHeight: pxToDp(410),
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(20),
  },
  rightItemOpacity: {
    backgroundColor: "#FFFFFF",
    borderRadius: pxToDp(30),
    width: pxToDp(143),
    alignItems: "center",
    marginEnd: pxToDp(48),
  },
  checked: {
    // padding: pxToDp(48),
    backgroundColor: " rgba(1, 121, 255, 0.2)",
    borderRadius: pxToDp(32),
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(40),
    height: pxToDp(104),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  unChecked: {
    // padding: pxToDp(48),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    alignItems: "center",
    justifyContent: "center",
    marginRight: pxToDp(40),
    height: pxToDp(104),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
  },
  checkedText: {
    color: "#0179FF",
    fontSize: pxToDp(28),
  },
  unCheckedText: {
    color: "#AAAAAA",
    fontSize: pxToDp(28),
  },
});

export default StatisticsHome;
