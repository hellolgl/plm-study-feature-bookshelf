import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { padding_tool, pxToDp } from "../util/tools";
import { Modal } from "antd-mobile-rn";

function MyToast({ text, children }) {
  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent
      supportedOrientations={["portrait", "landscape"]}
      style={[
        {
          backgroundColor: "rgba(0,0,0,0)",
          width: pxToDp(1500),
          // height: pxToDp(500),
        },
      ]}
    >
      <View style={[styles.contain]}>
        <View style={[styles.mainWrap]}>
          <Text style={[styles.mainTxt]}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  contain: {
    // position: "absolute",
    width: "100%",
    // height: "100%",
    // backgroundColor: "rgba(0,0,0,0)",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrap: {
    backgroundColor: "#F7EFC1",
    borderRadius: pxToDp(200),
    ...padding_tool(20, 40, 20, 40),
    borderWidth: pxToDp(4),
    borderColor: "#ED6F3E",
  },
  mainTxt: {
    fontSize: pxToDp(40),
    color: "#824235",
    lineHeight: pxToDp(50),
  },
});
export default MyToast;
