import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { pxToDp, size_tool, padding_tool } from "../../util/tools";
import { appFont, appStyle } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import Lottie from "lottie-react-native";
import MyToast from "../../component/myToast";
import * as userAction from "../../action/userInfo";
import { connect } from "react-redux";
import { getAllCoin } from "../../action/userInfo";
import {setPayCoinVisible} from '../../action/purchase'
function GoodAndCoin({
  user_like_nums,
  current_user_like,
  onlyLike,
  card_id,
  tips_count,
  isRight,
  creator_id,
}) {
  const [goodNum, setgoodNum] = useState(user_like_nums);
  const [coinNum, setcoinNum] = useState(tips_count);
  const [isGood, setisGood] = useState(current_user_like);

  const [showLottie, setshowLottie] = useState(false);
  const [lottieType, setlottieType] = useState("");
  const { homeSelectItem } = useSelector((state) => state.toJS().square);
  const { id } = homeSelectItem;
  const { currentUserInfo, token } = useSelector(
    (state) => state.toJS().userInfo
  );

  const { id: myId } = currentUserInfo;
  const [showToast, setshowToast] = useState(false);
  const [toastMsg, settoastMsg] = useState("");
  const [showMsg, setshowMsg] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setgoodNum(user_like_nums);
    setisGood(current_user_like);
    setcoinNum(tips_count);
  }, [user_like_nums, current_user_like, tips_count]);

  const goodNow = async () => {
    let data = {
      card_id: card_id || id,
    };
    setshowMsg(false);
    if (!isGood) {
      showLottieNow("heart");
    }

    try {
      const res = await axios.post(api.saveLike, data);
      // console.log("res.data", res.data);

      if (res.data.err_code === 0) {
        const like = res.data.data.like;
        setisGood(like);
        setgoodNum((num) => (like ? ++num : --num));
      }
    } catch (error) {
      console.error("Error saving like:", error);
    }
  };
  const showToastNow = (msg) => {
    setshowToast(true);
    settoastMsg(msg);
    setTimeout(() => {
      setshowToast(false);
      settoastMsg("");
    }, 1000);
  };
  const showLottieNow = (type) => {
    setlottieType(type);
    setshowLottie(true);
    setTimeout(() => {
      setshowLottie(false);
      setlottieType("");
    }, 1000);
  };
  const surePayCoin = () => {
    if (creator_id === myId) {
      // 自己账号不能大赏
      showToastNow("自己不能给自己打赏哦!");
      return;
    }
    setshowMsg(true);
    setshowLottie(true);
  };
  const closeModal = () => {
    setshowLottie(false);
  };
  const payCoinNow = async () => {
    //
    let data = {
      card_id: id,
    };

    let res = await axios.post(api.saveMyCoin, data);
    if (res.data.err_code === 0) {
      let resData = res.data.data;
      if (resData.code === 200) {
        //成功
        dispatch(getAllCoin());
        setshowMsg(false);
        showLottieNow("fire");
        setcoinNum(resData.tips_count);
      }
      if (resData.code === 422) {
        //余额不足
        dispatch(setPayCoinVisible(true))
        setshowLottie(false);
      }
      if (resData.code === 423) {
        //余额不足
        showToastNow("打赏超过次数!");
        setshowLottie(false);
      }
    }
  };
  return token ? (
    onlyLike ? (
      <TouchableOpacity onPress={goodNow}>
        <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
          <Image
            style={[size_tool(27, 22)]}
            resizeMode="contain"
            source={
              isGood
                ? require("../../images/square/heart.png")
                : require("../../images/square/hearNot.png")
            }
          />
          <Text style={[styles.goodTxt2]}>{goodNum ? goodNum : "赞"}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={[styles.mainWrap, isRight && { right: pxToDp(0) }]}>
        <View style={[styles.mainWrap2]}>
          <View style={[styles.mainWrap3]}>
            <TouchableOpacity
              onPress={surePayCoin}
              style={[
                styles.BtnWrap,
                coinNum && { backgroundColor: "rgba(34, 143, 134, 0.2)" },
              ]}
            >
              {/* {showFireLottie ? (
                <Lottie
                  source={require("../../res/json/fire.json")}
                  autoPlay
                  style={[styles.fireLottie]}
                />
              ) : null} */}
              <Image
                source={
                  coinNum
                    ? require("../../images/square/fire.png")
                    : require("../../images/square/fireNo.png")
                }
                style={[styles.fireImg]}
                resizeMode="contain"
              />
              <Text style={[styles.goodTxt, coinNum && { color: "#727475" }]}>
                {coinNum ? (coinNum > 999 ? "999+" : coinNum) : "赏"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goodNow}
              style={[
                styles.BtnWrap,
                goodNum && { backgroundColor: "rgba(34, 143, 134, 0.2)" },
              ]}
            >
              {/* {showHeartLottie ? (
                <Lottie
                  source={require("../../res/json/heart.json")}
                  autoPlay
                  style={[styles.heartLottie]}
                />
              ) : null} */}
              <Image
                source={
                  isGood
                    ? require("../../images/square/heart.png")
                    : require("../../images/square/heartNo.png")
                }
                style={[styles.heartImg]}
                resizeMode="contain"
              />
              <Text style={[styles.goodTxt, goodNum && { color: "#727475" }]}>
                {goodNum ? goodNum : "赞"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showToast ? <MyToast text={toastMsg} /> : null}
        <Modal
          visible={showLottie}
          animationType="fade"
          transparent
          supportedOrientations={["portrait", "landscape"]}
          style={[
            {
              backgroundColor: "rgba(0,0,0,0)",
              // width: pxToDp(1500),
              // height: pxToDp(500),
            },
          ]}
        >
          {showMsg ? (
            <View style={[styles.modalWrap]}>
              <View style={[styles.modalMain]}>
                <TouchableOpacity
                  style={[styles.closeBtnWrap]}
                  onPress={closeModal}
                >
                  <Image
                    style={[styles.closeBtn]}
                    source={require("../../images/chineseHomepage/sentence/status2.png")}
                  />
                </TouchableOpacity>

                <View style={[styles.modalmainWrap]}>
                  <Image
                    style={[styles.mainImg]}
                    source={require("../../images/square/coinBig.png")}
                  />
                  <Text style={[styles.speTxt]}>-100</Text>
                </View>
                <TouchableOpacity style={[styles.btnWrap]} onPress={payCoinNow}>
                  <Text style={[styles.btnTxt]}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={[styles.modalWrap]}>
              {lottieType === "heart" ? (
                <Lottie
                  source={require("../../res/json/heart.json")}
                  autoPlay
                  style={[
                    {
                      width: pxToDp(500),
                      height: pxToDp(600),
                      marginBottom: pxToDp(190),
                    },
                  ]}
                />
              ) : (
                <Lottie
                  source={require("../../res/json/fire.json")}
                  autoPlay
                  style={[
                    {
                      width: pxToDp(500),
                      height: pxToDp(600),
                      // marginBottom: pxToDp(100),
                    },
                  ]}
                />
              )}
            </View>
          )}
        </Modal>
      </View>
    )
  ) : null;
}
const styles = StyleSheet.create({
  mainWrap: {
    position: "absolute",
    width: pxToDp(150),
    backgroundColor: "rgba(4,4,5,0.1)",
    zIndex: 9,
    top: pxToDp(0),
    padding: pxToDp(9),
    height: pxToDp(276),
    borderRadius: pxToDp(76),
  },
  BtnWrap: {
    backgroundColor: "rgba(0,0,0,0.2)",
    width: pxToDp(102),
    height: pxToDp(102),
    borderRadius: pxToDp(51),
    justifyContent: "center",
    alignItems: "center",
  },
  // goodTxt: {
  //   color: "#AFABA7",
  //   fontSize: pxToDp(21),
  //   marginLeft: pxToDp(10),
  // },
  mainWrap2: {
    flex: 1,
    borderRadius: pxToDp(66),
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: pxToDp(8),
  },
  mainWrap3: {
    flex: 1,
    borderRadius: pxToDp(60),
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: pxToDp(8),
    justifyContent: "space-between",
  },
  heartImg: {
    width: pxToDp(43),
    height: pxToDp(35),
    marginBottom: pxToDp(6),
  },
  goodTxt: {
    fontSize: pxToDp(22),
    color: "#fff",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(22),
  },
  fireImg: {
    width: pxToDp(39),
    height: pxToDp(50),
    marginBottom: pxToDp(6),
  },
  goodTxt2: {
    color: "#AFABA7",
    fontSize: pxToDp(21),
    ...appFont.fontFamily_jcyt_500,
    marginLeft: pxToDp(10),
    lineHeight: pxToDp(21),
  },
  heartLottie: {
    width: pxToDp(68),
    height: pxToDp(90),
    position: "absolute",
    top: pxToDp(-13),
  },
  fireLottie: {
    width: pxToDp(98),
    height: pxToDp(114),
    position: "absolute",
    top: pxToDp(-12),
  },
  modalWrap: {
    width: "100%",
    height: "100%",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalMain: {
    width: pxToDp(500),
    height: pxToDp(492),
    borderRadius: pxToDp(70),
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "space-between",
    ...padding_tool(86, 75, 46, 75),
  },

  modalmainWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9E5E3",
    borderRadius: pxToDp(48),
    width: "100%",
    height: pxToDp(236),
  },
  mainImg: {
    width: pxToDp(120),
    height: pxToDp(120),
    marginRight: pxToDp(30),
  },
  speTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(72),
    color: "#FF4848",
    lineHeight: pxToDp(80),
  },
  btnWrap: {
    width: pxToDp(376),
    height: pxToDp(84),
    borderRadius: pxToDp(28),
    backgroundColor: "#FF9B48",
    borderWidth: pxToDp(4),
    borderColor: "#FFC12F",
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    ...appFont.fontFamily_jcyt_700,
    fontSize: pxToDp(36),
    color: "#fff",
  },
  closeBtn: {
    width: pxToDp(100),
    height: pxToDp(100),
  },
  closeBtnWrap: {
    position: "absolute",
    top: pxToDp(-20),
    right: pxToDp(-20),
    zIndex: 9,
  },
});

export default GoodAndCoin;
