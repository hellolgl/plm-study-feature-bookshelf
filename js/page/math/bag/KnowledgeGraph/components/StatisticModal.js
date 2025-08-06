import * as React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Modal,
  Text,
  Platform,
} from "react-native";
import { pxToDp, pxToDpHeight } from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import MyPie from "../../../../../component/myChart/my";
import { useSelector, useDispatch } from "react-redux";

function StatisticModal({
  visible,
  total,
  wrong,
  close,
  upLevel,
  levelType,
  noUpTopic,
  confirm,
  isPlan,
}) {
  const { language_data } = useSelector((state) => state.toJS().languageMath);
  const { show_main, show_translate, main_language_map, other_language_map } =
    language_data;
  const page_base_data = {
    allcompleted_z: main_language_map.allcompleted,
    allcompleted_c: other_language_map.allcompleted,
    correct_z: main_language_map.correct,
    correct_c: other_language_map.correct,
    error_z: main_language_map.error,
    error_c: other_language_map.error,
    exit_z: main_language_map.exit,
    exit_c: other_language_map.exit,
    tryAgain_z: main_language_map.tryAgain,
    tryAgain_c: other_language_map.tryAgain,
    haode_z: main_language_map.haode,
    haode_c: other_language_map.haode,
  };
  const correct = total - wrong;
  const rate_correct = isPlan
    ? correct > 1
      ? 95
      : 20
    : Math.round((correct / total) * 100);
  const showCorrect = Math.round((correct / total) * 100);
  const OS = Platform.OS;
  const tip_z = React.useRef("");
  const tip_c = React.useRef("");
  const btntxt_z = React.useRef(main_language_map.haode);
  const btntxt_c = React.useRef(other_language_map.haode);
  const onShow = () => {
    if (rate_correct <= 60 || rate_correct >= 90) {
      // 升级或者降级
      upLevel();
    }
  };
  if (rate_correct <= 60 || rate_correct >= 90) {
    // 升级降级
    btntxt_z.current = main_language_map.haode;
    btntxt_c.current = other_language_map.haode;
    if (noUpTopic) {
      if (levelType === "1") {
        // 升级没有题,提示语太棒了
        tip_z.current = main_language_map.tip1;
        tip_c.current = other_language_map.tip1;
      } else {
        // 降级没有题，没有提示语
        tip_z.current = "";
        tip_c.current = "";
      }
    } else {
      if (levelType === "1") {
        // 升级，提示语 你太棒啦，去进行AI提升挑战吧！
        tip_z.current = main_language_map.tip3;
        tip_c.current = other_language_map.tip3;
      } else {
        // 降级，提示语 正确率不佳哦，去巩固一下吧！
        tip_z.current = main_language_map.tip2;
        tip_c.current = other_language_map.tip2;
      }
    }
  } else {
    // 留在本级
    btntxt_z.current = main_language_map.tryAgain;
    btntxt_c.current = other_language_map.tryAgain;
    tip_z.current = main_language_map.tip1;
    tip_c.current = other_language_map.tip1;
  }

  const ok = () => {
    let isTryAgain = false;
    if (rate_correct > 60 && rate_correct < 90) {
      isTryAgain = true;
    }
    confirm(isTryAgain);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onShow={onShow}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <View
            style={[
              appStyle.flexAliCenter,
              { marginBottom: OS === "android" ? pxToDp(10) : pxToDp(20) },
            ]}
          >
            {show_main ? (
              <Text
                style={[
                  mathFont.txt_66_700,
                  mathFont.txt_4C4C59,
                  { marginBottom: OS === "android" ? pxToDp(-40) : pxToDp(6) },
                  OS === "ios" ? { lineHeight: pxToDp(80) } : null,
                ]}
              >
                {page_base_data.allcompleted_z}
              </Text>
            ) : null}
            {show_translate ? (
              <Text
                style={[
                  mathFont.txt_32_500,
                  mathFont.txt_4C4C59_50,
                  OS === "android" ? { marginBottom: pxToDp(-20) } : null,
                ]}
              >
                {page_base_data.allcompleted_c}
              </Text>
            ) : null}
          </View>
          {tip_z.current ? (
            <View style={[appStyle.flexAliCenter]}>
              {show_main ? (
                <Text
                  style={[
                    mathFont.txt_42_700,
                    mathFont.txt_4C4C59,
                    {
                      marginBottom: OS === "android" ? pxToDp(-30) : pxToDp(6),
                    },
                    tip_z.current.length > 30
                      ? { fontSize: pxToDp(36), lineHeight: pxToDp(42) }
                      : null,
                  ]}
                >
                  {tip_z.current}
                </Text>
              ) : null}
              {show_translate ? (
                <Text style={[mathFont.txt_28_500, mathFont.txt_4C4C59_50]}>
                  {tip_c.current}
                </Text>
              ) : null}
            </View>
          ) : null}
          <View style={[styles.pieContent]}>
            <View style={[appStyle.flexAliCenter]}>
              <View style={[styles.peiWrap, { marginBottom: pxToDp(20) }]}>
                <Text
                  style={[
                    mathFont.txt_48_700,
                    mathFont.txt_4C4C59,
                    { position: "absolute", zIndex: 1 },
                  ]}
                >
                  {correct}
                </Text>
                <MyPie
                  length={pxToDp(22)}
                  width={90}
                  percent={showCorrect / 100}
                  color={"#31D860"}
                />
              </View>
              {show_main ? (
                <Text
                  style={[
                    mathFont.txt_42_500,
                    mathFont.txt_4C4C59,
                    {
                      marginBottom: OS === "android" ? pxToDp(-10) : pxToDp(6),
                      lineHeight: pxToDp(52),
                    },
                  ]}
                >
                  {page_base_data.correct_z}
                </Text>
              ) : null}
              {show_translate ? (
                <Text style={[mathFont.txt_24_500, mathFont.txt_4C4C59_50]}>
                  {page_base_data.correct_c}
                </Text>
              ) : null}
            </View>
            <View style={[appStyle.flexAliCenter]}>
              <View style={[styles.peiWrap, { marginBottom: pxToDp(20) }]}>
                <Text
                  style={[
                    mathFont.txt_48_700,
                    mathFont.txt_4C4C59,
                    { position: "absolute", zIndex: 1 },
                  ]}
                >
                  {wrong}
                </Text>
                <MyPie
                  length={pxToDp(22)}
                  width={90}
                  percent={(100 - showCorrect) / 100}
                  color={"#FF6680"}
                />
              </View>
              {show_main ? (
                <Text
                  style={[
                    mathFont.txt_42_500,
                    mathFont.txt_4C4C59,
                    {
                      marginBottom: OS === "android" ? pxToDp(-10) : pxToDp(6),
                      lineHeight: pxToDp(52),
                    },
                  ]}
                >
                  {page_base_data.error_z}
                </Text>
              ) : null}
              {show_translate ? (
                <Text style={[mathFont.txt_24_500, mathFont.txt_4C4C59_50]}>
                  {page_base_data.error_c}
                </Text>
              ) : null}
            </View>
          </View>
          {noUpTopic ? (
            <View>
              <TouchableOpacity style={[styles.btn]} onPress={close}>
                <View style={[styles.btnInner]}>
                  {show_main ? (
                    <Text
                      style={[
                        mathFont.txt_42_700,
                        mathFont.txt_fff,
                        OS === "android" && show_translate
                          ? { marginBottom: pxToDp(-20) }
                          : null,
                      ]}
                    >
                      {page_base_data.haode_z}
                    </Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                      {page_base_data.haode_c}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                appStyle.flexLine,
                appStyle.flexJusBetween,
                {
                  width: "100%",
                  paddingLeft: pxToDp(116),
                  paddingRight: pxToDp(116),
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "transparent" }]}
                onPress={close}
              >
                <View style={[styles.btnInner]}>
                  {show_main ? (
                    <Text
                      style={[
                        mathFont.txt_42_700,
                        mathFont.txt_fff,
                        OS === "android" && show_translate
                          ? { marginBottom: pxToDp(-20) }
                          : null,
                      ]}
                    >
                      {page_base_data.exit_z}
                    </Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                      {page_base_data.exit_c}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn]} onPress={ok}>
                <View style={[styles.btnInner]}>
                  {show_main ? (
                    <Text
                      style={[
                        mathFont.txt_42_700,
                        mathFont.txt_fff,
                        OS === "ios" ? { lineHeight: pxToDp(52) } : null,
                        OS === "android" && show_translate
                          ? { marginBottom: pxToDp(-20) }
                          : null,
                      ]}
                    >
                      {btntxt_z.current}
                    </Text>
                  ) : null}
                  {show_translate ? (
                    <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                      {btntxt_c.current}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter,
  },
  content: {
    width: pxToDp(1000),
    borderRadius: pxToDp(40),
    backgroundColor: "#fff",
    ...appStyle.flexAliCenter,
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(26),
  },
  pieContent: {
    height: pxToDp(300),
    backgroundColor: "#F5F5F9",
    borderRadius: pxToDp(60),
    width: pxToDp(860),
    marginTop: pxToDp(40),
    marginBottom: pxToDp(40),
    ...appStyle.flexLine,
    ...appStyle.flexJusBetween,
    paddingLeft: pxToDp(233),
    paddingRight: pxToDp(233),
  },
  peiWrap: {
    width: pxToDp(100),
    height: pxToDp(100),
    borderWidth: pxToDp(4),
    borderColor: "#E4E4F0",
    borderRadius: pxToDp(50),
    ...appStyle.flexCenter,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#EC8035",
    paddingBottom: pxToDp(10),
    paddingTop: pxToDp(2),
    paddingLeft: pxToDp(2),
    paddingRight: pxToDp(2),
    borderRadius: pxToDp(40),
  },
  btnInner: {
    width: pxToDp(339),
    ...appStyle.flexCenter,
    backgroundColor: "#FF9B26",
    borderRadius: pxToDp(40),
    minHeight: pxToDp(103),
  },
});
export default StatisticModal;
