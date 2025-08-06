import React, { useState, useEffect } from "react";

import {
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { pxToDp, size_tool } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import Pinyin from "./components/pinyin";
import Words from "./components/words";
import Sentence from "./components/sentence";
import Reading from "./components/reading";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
const QuickDoExercise = (props) => {
  const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
  const { checkGrade, checkTeam } = currentUserInfo;
  const [stepIndex, setstepIndex] = useState(checkGrade === "01" ? 0 : 1);
  const [answer_id, setanswer_id] = useState(0);
  const [p_id, setp_id] = useState(0);

  const typelist = ["pinyin_status", "word_status", "ab_status", "read_status"];
  const goBack = () => {
    NavigationUtil.goBack(props);
  };

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await axios.get(api.getQuickPinyin, {
      params: { grade_code: checkGrade, term_code: checkTeam },
    });
    // console.log("------", res);

    if (res.data.err_code === 0) {
      setanswer_id(res.data.data.answer_id);
      res.data.data.p_id ? setp_id(res.data.data.p_id) : setstepIndex(1);
    }
  };
  const next = () => {
    changeStatus(() => setstepIndex((e) => e + 1));
  };
  const finish = () => {
    changeStatus(goBack);
  };
  const changeStatus = async (postNext) => {
    let data = {
      answer_id,
    };
    data[typelist[stepIndex]] = "1";
    await axios.post(api.getQuickPinyin, data);
    // console.log("下一步", res.data);
    postNext();
  };
  const resetToLogin = () => {
    NavigationUtil.resetToLogin(props);
  };
  const domList = [
    <Pinyin
      p_id={p_id}
      next={next}
      finish={finish}
      resetToLogin={resetToLogin}
    />,
    <Words next={next} finish={finish} resetToLogin={resetToLogin} />,
    <Sentence next={next} finish={finish} />,
    <Reading {...props} finish={finish} />,
  ];

  return (
    <ImageBackground
      source={require("../../../../images/chineseHomepage/sentence/sentenceBg.png")}
      style={[{ flex: 1 }]}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={[
          size_tool(120, 80),
          {
            position: "absolute",
            top: pxToDp(Platform.OS === "ios" ? 100 : 40),
            zIndex: 999,
            left: pxToDp(40),
          },
        ]}
        onPress={goBack}
      >
        <Image
          style={[size_tool(120, 80)]}
          source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
        />
      </TouchableOpacity>
      <View style={[{ flex: 1 }]}>{domList[stepIndex]}</View>
    </ImageBackground>
  );
};

export default QuickDoExercise;
