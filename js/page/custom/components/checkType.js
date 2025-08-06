import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationUtil";

import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getPaiCoin } from "../../../util/axiosMethod";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import MyToast from "../../../component/myToast";
import { getMyPlan } from "../../../util/axiosMethod";
import { getAllCoin } from "../../../action/userInfo";

const CheckType = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUserInfo, myPlans } = useSelector(
    (state) => state.toJS().userInfo
  );
  const { class_code } = currentUserInfo;
  const [opacity, setopacity] = useState(0);
  const [typeList, settypeList] = useState([
    {
      name: "优才计划",
      checked: false,
      type: "normal",
      icon: require("../../../images/custom/icon4.png"),
      checkedicon: require("../../../images/custom/icon1.png"),
      coin: 0,
    },
    {
      name: "数学精英计划",
      checked: false,
      type: "math",
      icon: require("../../../images/custom/icon3.png"),
      checkedicon: require("../../../images/custom/icon2.png"),
      coin: 0,
    },
    {
      name: "语文精英计划",
      checked: false,
      type: "chinese",
      icon: require("../../../images/custom/icon6.png"),
      checkedicon: require("../../../images/custom/icon5.png"),
      coin: 0,
    },
  ]);
  const [typeCoin, settypeCoin] = useState(0);
  const [checkedType, setcheckedType] = useState([]);
  const [showToast, setshowToast] = useState(false);
  useEffect(() => {
    getIsShow();
    getPlans();
  }, []);
  const getPlans = async () => {
    const returnData = await getMyPlan(currentUserInfo, {}, true);
    const { plans, math, normal, chinese } = returnData;
    if (plans.length > 0) {
      let list = typeList.map((item) => {
        let coin = 0;
        // if (item.type === "math" && !math) coin = 6;
        // if (item.type === "normal" && !normal) coin = 6;
        // if (item.type === "chinese" && !chinese) coin = 6;
        if (!returnData[item.type]) coin = 90;
        return {
          ...item,
          checked:
            plans.findIndex((i) => i === item.type) !== -1 ? true : false,
          coin,
        };
      });
      // console.log("myPlans", plans, list);
      settypeList(list);
    }
  };
  const getIsShow = async () => {
    const data = await getPaiCoin({ source: "system" });
    // console.log("获得", data);
    if (data.status === "success") {
      dispatch(getAllCoin());
      setopacity(1);
    }
  };

  const toPlan = async () => {
    if (checkedType.length === 0) {
      setshowToast(true);
      setTimeout(() => {
        setshowToast(false);
      }, 1000);
      return;
    }
    // 扣币
    let coinRes = await axios.post(api.planSplitCoin, {
      plans_name: checkedType,
    });
    // console.log("扣币", coinRes.data);
    let returnData = coinRes.data.data;
    if (coinRes.data.err_code === 200 || coinRes.data.err_code === 0) {
      // console.log("扣币000", returnData.tag);
      if (returnData.tag) {
        // 扣费成功
        let hasNormal = checkedType.find((item) => item === "normal");
        // console.log("扣币000", hasNormal);
        dispatch({
          type: "userInfo/setmyPlans",
          data: checkedType,
        });
        NavigationUtil.toAiPlanWelcome({
          navigation,
          data: {
            hasNormal,
          },
        });
        // hasNormal ? toNormal() : NavigationUtil.toAIPlanHome({ navigation });
      } else {
        // 余额不足
        // console.log("余额不足");
        dispatch({
          type: "SET_PAYCOIN_VISIBLE",
          data: true,
        });
      }
    }
    // normal 普通计划  math 数学精英计划
    // await axios.post(api.saveCheckPlan, {
    //   plans: checkedType,
    // });
    // console.log("计划", saveRes);
  };
  const toNormal = async () => {
    let res = await axios.get(api.getCustomIsFinish, {
      params: { class_info: class_code },
    });
    if (res.data.err_code === 0) {
      let finishObj = res.data.data;
      let startIndex = 0;
      if (finishObj.english_done === "1") {
        // NavigationUtil.toHomePage(this.props);
        NavigationUtil.toAIPlanHome({ navigation });
        return;
      } else if (finishObj.math_done === "1") {
        startIndex = 2;
      } else if (finishObj.chinese_done === "1") {
        startIndex = 1;
      }
      // console.log("finishObj", finishObj);

      NavigationUtil.toAIPlanExercisePage({
        navigation,
        data: { finishObj, startIndex },
      });
    }
  };
  const clickType = (index) => {
    let listnow = typeList.map((item, i) => {
      return {
        ...item,
        checked: index === i ? !item.checked : item.checked,
      };
    });
    settypeList(listnow);
  };
  useEffect(() => {
    let coin = 0,
      checkedlist = [];
    typeList.forEach((item) => {
      item.checked && (coin += item.coin);
      item.checked && checkedlist.push(item.type);
    });
    settypeCoin(coin);
    setcheckedType(checkedlist);
  }, [typeList]);
  return (
    <View style={[styles.mainWrap]}>
      <ScrollView>
        <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
          <View style={[styles.coinWrap, { opacity: 0 }]} />
          <View>
            <Image
              source={require("../../../images/custom/youGood.png")}
              style={[size_tool(548, 312)]}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.coinWrap, { opacity }]}>
            <Image
              source={require("../../../images/square/paiCoin2.png")}
              style={[size_tool(56)]}
            />
            <Text style={[styles.addCoinTxt]}>+200</Text>
          </View>
        </View>

        <View
          style={[
            appStyle.flexTopLine,
            {
              flex: 1,
              flexWrap: "wrap",
              justifyContent: "space-between",
              paddingLeft: pxToDp(100),
              paddingRight: pxToDp(100),
            },
          ]}
        >
          {typeList.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => clickType(index)}
                key={index}
                style={[
                  styles.typeWrap,
                  index === 0 && { marginRight: pxToDp(40) },
                  item.checked && {
                    borderColor: "#FFDB5D",
                    backgroundColor: "#FFF0C6",
                    borderWidth: pxToDp(4),
                  },
                ]}
              >
                <View
                  style={[
                    styles.typeIconWrap,
                    item.checked && {
                      borderColor: "#FFB649",
                      backgroundColor: "#FFDB5D",
                    },
                  ]}
                >
                  <Image
                    source={item.checked ? item.checkedicon : item.icon}
                    style={[size_tool(60)]}
                    resizeMode="contain"
                  />
                </View>
                <View style={[{ flex: 1 }]}>
                  <Text style={[styles.typeTxt]}>{item.name}</Text>
                </View>
                <View
                  style={[
                    styles.typeCheckWrap,
                    item.checked && {
                      borderColor: "#008C75",
                      backgroundColor: "#00B295",
                    },
                  ]}
                >
                  <FontAwesome
                    name={"check"}
                    size={pxToDp(26)}
                    style={{ color: "#fff" }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={[appStyle.flexAliCenter]}>
        <TouchableOpacity style={[styles.btnWrap]} onPress={toPlan}>
          <View style={[styles.btnInner]}>
            <Text style={[styles.btntxt]}>开始我的计划</Text>
            {typeCoin > 0 ? (
              <View style={[styles.btnIconWrap]}>
                <Text style={[styles.btnCoinTxt]}>-{typeCoin}</Text>

                <Image
                  source={require("../../../images/square/paiCoin2.png")}
                  style={[size_tool(36)]}
                />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
      {showToast ? <MyToast text={"请选择计划再开始体验!"} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    flex: 1,
    // backgroundColor: "pink",
  },
  coinWrap: {
    width: pxToDp(188),
    height: pxToDp(72),
    borderRadius: pxToDp(104),
    backgroundColor: "#F3EEE8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addCoinTxt: {
    fontSize: pxToDp(32),
    color: "#FF7848",
    ...appFont.fontFamily_jcyt_700,
    lineHeight: pxToDp(32),
    marginLeft: pxToDp(10),
  },

  typeIconWrap: {
    width: pxToDp(120),
    height: pxToDp(120),
    borderRadius: pxToDp(100),
    borderWidth: pxToDp(4),
    borderColor: "#D5D5D5",
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  typeWrap: {
    width: pxToDp(560),
    height: pxToDp(160),
    borderRadius: pxToDp(40),
    borderWidth: pxToDp(2),
    borderColor: "#D5D5D5",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: pxToDp(34),
    paddingRight: pxToDp(34),
    marginBottom: pxToDp(20),
  },
  typeTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(40),
    color: "#2D3040",
    marginLeft: pxToDp(10),
  },
  typeCheckWrap: {
    width: pxToDp(46),
    height: pxToDp(46),
    borderRadius: pxToDp(30),
    borderWidth: pxToDp(4),
    borderColor: "#B9B9B9",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrap: {
    width: pxToDp(422),
    height: pxToDp(136),
    borderRadius: pxToDp(40),
    backgroundColor: "#FFB649",
    paddingBottom: pxToDp(8),
  },
  btnInner: {
    flex: 1,
    borderRadius: pxToDp(40),
    backgroundColor: "#FFDB5D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: pxToDp(20),
  },
  btntxt: {
    fontSize: pxToDp(40),
    lineHeight: pxToDp(40),
    color: "#2D3040",
    ...appFont.fontFamily_jcyt_700,
  },
  btnIconWrap: {
    backgroundColor: "rgba(255,238,196,0.7)",
    width: pxToDp(122),
    height: pxToDp(56),
    borderRadius: pxToDp(30),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingLeft: pxToDp(8),
    paddingRight: pxToDp(8),
  },
  btnCoinTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(24),
    color: "#FF4848",
  },
});

export default CheckType;
