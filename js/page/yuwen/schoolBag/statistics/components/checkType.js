import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { appStyle } from "../../../../../theme";
import {
  pxToDp,
  padding_tool,
  borderRadius_tool,
} from "../../../../../util/tools";
const CheckType = (props) => {
  const { checkType } = props;
  const [type, settype] = useState("1");
  const typeList = [
    {
      text: "今天",
      value: "1",
    },
    {
      text: "本周",
      value: "2",
    },
    {
      text: "本月",
      value: "3",
    },
    {
      text: "本学期",
      value: "4",
    },
  ];
  const checkTypeNow = (item) => {
    checkType(item);
    settype(item.value);
  };
  return (
    <View
      style={[
        appStyle.flexTopLine,
        { backgroundColor: "#fff", borderRadius: pxToDp(200) },
      ]}
    >
      {typeList.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={[
              appStyle.flexCenter,
              padding_tool(20, 40, 20, 40),
              borderRadius_tool(200),
              {
                backgroundColor: type === item.value ? "#4C4C59" : "#fff",
                marginLeft: pxToDp(index === 0 ? 0 : 10),
              },
            ]}
            onPress={checkTypeNow.bind(this, item)}
          >
            <Text
              style={[
                {
                  fontSize: pxToDp(32),
                  color: type !== item.value ? "#4C4C59" : "#fff",
                },
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const style = StyleSheet.create({});

export default CheckType;
