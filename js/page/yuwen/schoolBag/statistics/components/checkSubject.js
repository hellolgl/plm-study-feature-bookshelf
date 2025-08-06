import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { appStyle } from "../../../../../theme";
import { pxToDp } from "../../../../../util/tools";

const CheckSubject = (props) => {
  const { defaultSubject, changeSubject } = props;
  const subjectList = [
    {
      title: "语文统计",
      icon: require("../../../../../images/chineseHomepage/statistics/icon_4.png"),
      value: "chinese",
    },
    {
      title: "英语统计",
      icon: require("../../../../../images/chineseHomepage/statistics/icon_6.png"),
      value: "english",
    },
  ];
  const [subject, setsubject] = useState(defaultSubject);
  const clickThis = (item) => {
    setsubject(item.value);
    changeSubject(item.value);
  };
  return (
    <View style={[appStyle.flexTopLine]}>
      {subjectList.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.itemWrap,
              subject === item.value && {
                backgroundColor: "#4C4C59",
                borderRadius: pxToDp(50),
              },
            ]}
            onPress={clickThis.bind(this, item)}
          >
            <View style={[styles.iconWrap]}>
              <Image source={item.icon} style={[styles.icon]} />
            </View>
            <Text
              style={[
                styles.itemTxt,
                subject === item.value && { color: "#fff" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrap: {
    width: pxToDp(288),
    height: pxToDp(100),
    borderRadius: pxToDp(50),
    ...appStyle.flexLine,
    backgroundColor: "#E9E9F2",
    ...appStyle.flexCenter,
    marginRight: pxToDp(48),
  },
  itemTxt: {
    fontSize: pxToDp(40),
    color: "#4C4C59",
  },
  icon: {
    width: pxToDp(40),
    height: pxToDp(40),
  },
  iconWrap: {
    ...appStyle.flexCenter,
    width: pxToDp(84),
    height: pxToDp(84),
    borderRadius: pxToDp(42),
    backgroundColor: "#fff",
    marginRight: pxToDp(10),
  },
});

export default CheckSubject;
