import { pxToDp } from "../util/tools";
import { Platform } from "react-native";

export default {
  f20: { fontSize: pxToDp(20) },
  f22: { fontSize: pxToDp(22) },
  f28: { fontSize: pxToDp(28) },
  f30: { fontSize: pxToDp(30) },
  f32: { fontSize: pxToDp(32) },
  f42: { fontSize: pxToDp(42) },
  f44: { fontSize: pxToDp(44) },
  f48: { fontSize: pxToDp(48) },
  f34: { fontSize: pxToDp(34) },
  f36: { fontSize: pxToDp(36) },
  f38: { fontSize: pxToDp(38) },
  f50: { fontSize: pxToDp(50) },
  f60: { fontSize: pxToDp(60) },
  f63: { fontSize: pxToDp(63) },
  f80: { fontSize: pxToDp(80) },
  bold: { fontWeight: "500" },
  boldest: { fontWeight: "900" },
  fontFamily_syst: {
    // 思源宋体
    // fontFamily: "SourceHanSerifCN-Regular",
    fontFamily: "SourceHanSerifSC-Regular",
  },
  fontFamily_syst_bold: {
    // 思源宋体 加粗
    // fontFamily: "SourceHanSerifSCVF_Bold",
    fontFamily: "SourceHanSerifSC-Bold",
  },
  fontFamily_jcyt_500: {
    fontFamily: "JiangCheng-Pai-Medium",
    // fontFamily: 'JiangChengYuanTi-500W'
  },
  fontFamily_jcyt_700: {
    // fontFamily: 'JiangChengYuanTi-700W',
    fontFamily: "JiangCheng-Pai-Bold",
  },
  fonts_pinyin: {
    // fontFamily: Platform.OS === 'ios' ? 'AaBanruokaishu (Non-Commercial Use)' : '1574320058',
    fontFamily: "JiangCheng-Pai-Medium",
  },
};
