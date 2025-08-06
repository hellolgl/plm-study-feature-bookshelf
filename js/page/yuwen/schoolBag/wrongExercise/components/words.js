import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
const Words = ({ typeIndex, navigation }) => {
  const typeList = [
    {
      isActive: true,
      text: "字",
    },
    {
      isActive: false,
      text: "词",
    },
  ];
  const [timeIndex, settimeIndex] = useState(0);
  const { currentUserInfo, avatar } = useSelector(
    (state) => state.toJS().userInfo
  );
  const { checkGrade, checkTeam } = currentUserInfo;
  const [wordlist, setwordlist] = useState([]);
  const [characterlist, setcharacterlist] = useState([]);
  useEffect(() => {
    getlist();
  }, []);
  useEffect(() => {
    getlist();
  }, [typeIndex]);
  const getlist = async () => {
    const res = await axios.get(
      `${api.getSpeWrongWord}/${checkGrade}/${checkTeam}/${typeIndex}`
    );
    console.log("字词", res.data);
    if (res.data.err_code === 0) {
      setcharacterlist(res.data.data.character);
      setwordlist(res.data.data.word);
    }
  };
  const lookmore = (item) => {
    NavigationUtil.toSpeWrongExerciseList({
      navigation,
      data: {
        knowledge: item,
        index: typeIndex,
      },
    });
  };
  const renderList = () => {
    const list = timeIndex === 0 ? characterlist : wordlist;
    const returnList =
      list.length === 0 ? (
        <View style={[{ flex: 1 }, appStyle.flexCenter]}>
          <Image
            source={require("../../../../../images/square/noData.png")}
            style={[size_tool(592, 568)]}
            resizeMode="contain"
          />
        </View>
      ) : (
        list.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => lookmore(item)}
              key={index}
              style={[styles.itemWrap]}
            >
              <Text style={[styles.itemTxt]}>{item}</Text>
            </TouchableOpacity>
          );
        })
      );
    return returnList;
  };

  return (
    <View style={[styles.contain]}>
      <View style={[styles.timeWrap]}>
        <View style={[styles.timeInner]}>
          {typeList.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => settimeIndex(index)}
                style={[
                  styles.timeItemWrap,
                  timeIndex === index && { backgroundColor: "#FFB649" },
                ]}
              >
                <View
                  style={[
                    styles.timeItemInner,
                    timeIndex === index && {
                      backgroundColor: "#FFDB5D",
                      borderRadius: pxToDp(40),
                    },
                  ]}
                >
                  <Text style={[styles.timeItemTxt]}>{item.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={[styles.mainWrap]}>
        <View style={[styles.mainInner]}>
          <ScrollView>
            <View style={[styles.main]}>{renderList()}</View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    paddingRight: pxToDp(56),
    paddingBottom: pxToDp(44),
  },
  timeWrap: {
    width: pxToDp(428),
    height: pxToDp(84),
    borderRadius: pxToDp(80),
    backgroundColor: "#DAE2F2",
    paddingBottom: pxToDp(8),
    marginBottom: pxToDp(16),
  },
  timeInner: {
    flex: 1,
    borderRadius: pxToDp(54),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
  },
  timeItemWrap: {
    width: pxToDp(160),
    height: pxToDp(60),
    paddingBottom: pxToDp(4),
    borderRadius: pxToDp(40),
  },
  timeItemInner: {
    flex: 1,
    borderRadius: pxToDp(40),

    ...appStyle.flexCenter,
  },
  timeItemTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(32),
    lineHeight: pxToDp(32),
    color: "#475266",
  },
  mainWrap: {
    flex: 1,
    backgroundColor: "#DAE2F2",
    borderRadius: pxToDp(48),
    paddingBottom: pxToDp(8),
  },
  mainInner: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(48),
    padding: pxToDp(40),
    paddingRight: pxToDp(0),
    paddingLeft: pxToDp(30),
  },
  main: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemWrap: {
    minWidth: pxToDp(120),
    height: pxToDp(80),
    borderRadius: pxToDp(24),
    backgroundColor: "#FEEECA",
    justifyContent: "center",
    marginRight: pxToDp(18),
    marginBottom: pxToDp(20),
    paddingLeft: pxToDp(36),
    paddingRight: pxToDp(36),
  },
  itemTxt: {
    fontSize: pxToDp(48),
    lineHeight: pxToDp(60),
    color: "#475266",
    ...appFont.fontFamily_syst_bold,
    textAlign: "center",
  },
});
export default Words;
