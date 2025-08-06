import { padding_tool, pxToDp } from "../util/tools";
export default {
  flex1: { flex: 1 },
  flexLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  flexTopLine: {
    flexDirection: "row",
    // flex: 1,
  },
  flexLineWrap: { flexWrap: "wrap" },
  flexCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  flexJusCenter: { justifyContent: "center" },
  flexJusBetween: { justifyContent: "space-between" },
  flexJusEvenly: { justifyContent: "space-evenly" },
  flexAliCenter: { alignItems: "center" },
  flexAliStart: { alignItems: "flex-start" },
  flexAliEnd: { alignItems: "flex-end" },
  flexLineReverse: { flexDirection: "row-reverse" },
  flexEnd: { justifyContent: "flex-end" },
  absolute: { position: "absolute" },
  //text
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },

  //margin
  contentMargin: {
    marginBottom: pxToDp(20),
    marginLeft: pxToDp(20),
    marginRight: pxToDp(20),
    backgroundColor: "#fff",
  },

  mt16: { marginTop: pxToDp(16) },
  mt24: { marginTop: pxToDp(24) },
  mt30: { marginTop: pxToDp(30) },
  mt48: { marginTop: pxToDp(48) },
  mt74: { marginTop: pxToDp(74) },
  mt96: { marginTop: pxToDp(96) },

  ml16: { marginLeft: pxToDp(16) },
  ml32: { marginLeft: pxToDp(32) },
  ml64: { marginLeft: pxToDp(64) },
  ml78: { marginLeft: pxToDp(78) },
  ml48: { marginLeft: pxToDp(48) },
  ml_auto: { marginLeft: "auto" },

  mr0: { marginRight: 0 },
  mr80: { marginRight: pxToDp(80) },
  mr48: { marginRight: pxToDp(48) },
  //padding
  contentPadding: {
    ...padding_tool(20),
  },
  pl78: { paddingLeft: pxToDp(78) },
  pb20: { paddingBottom: pxToDp(20) },
  //圆角
  br40: { borderRadius: pxToDp(40) },

  //组合控件
  blank: {
    width: "100%",
    height: 100,
  },
  height110: { height: pxToDp(110) },
  helpBtn: {
    width: pxToDp(56),
    height: pxToDp(56),
  },
  headerImg: {
    width: pxToDp(64),
    height: pxToDp(64),
  },
};
