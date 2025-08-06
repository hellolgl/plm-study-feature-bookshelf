import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  BackHandler,
  DeviceEventEmitter,
} from "react-native";
import {
  pxToDp,
  padding_tool,
  size_tool,
  borderRadius_tool,
} from "../../../util/tools";
import { appFont, appStyle } from "../../../theme";
import { useDispatch } from "react-redux";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import NavigationUtil from "../../../navigator/NavigationUtil";
import { getAllCoin } from "../../../action/userInfo";

function ExpensiveCalendar(props) {
  const dispatch = useDispatch();
  // const { currentUserInfo, coin } = useSelector(
  //   (state) => state.toJS().userInfo
  // );
  // const { id } = currentUserInfo;
  // publish（发布）；share（分享）；be_tipped（累计收到）；tipping（打赏总计）
  const [typeList, settypeList] = useState([
    {
      title: "答题获得",
      type: "exerciseIncome",
      num: 0,
    },
    {
      title: "打赏获得",
      type: "tipIncome",
      num: 0,
    },
    {
      title: "创作获得",
      type: "creationIncome",
      num: 0,
    },

    {
      title: "充值获得",
      type: "rechargeIncome",
      num: 0,
    },
    {
      title: "消费明细",
      type: "consumptionDetails",
      num: 0,
    },
    {
      title: "模块解锁",
      type: "moduleDetails",
      num: 0,
    },
  ]);
  const [checkedType, setcheckedType] = useState("exerciseIncome");
  const [list, setlist] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [loading, setloding] = useState(false);
  let backBtnListener = null;
  let eventListenerRefreshTypeList = null;
  useEffect(() => {
    getlist(page, checkedType);
    getCoinNum();
    eventListenerRefreshTypeList = DeviceEventEmitter.addListener(
      "refreshTypeList",
      (event) => {
        getCoinNum();
        setcheckedType("rechargeIncome");
        getlist(1, "rechargeIncome");
      }
    );
    return () => {
      backBtnListener && backBtnListener.remove();
      eventListenerRefreshTypeList && eventListenerRefreshTypeList.remove();
      getNowCoin();
    };
  }, []);
  const goBack = () => {
    NavigationUtil.goBack(props);
  };
  const getNowCoin = async () => {
    dispatch(getAllCoin());
  };
  const getCoinNum = async () => {
    const res = await axios.get(api.getMyExpenseCalendarNum);
    // console.log("返回了222", res.data);
    if (res.data.err_code === 0) {
      let returnObj = res.data.data;
      let listnow = typeList.map((item) => {
        let type = item.type;
        return {
          ...item,
          num: returnObj[type],
        };
      });
      settypeList(listnow);
    }
  };
  useEffect(() => {
    getlist(1, checkedType);
    getCoinNum();
  }, [checkedType]);
  const getlist = async (pagenow, type) => {
    let data = {
      page: pagenow,
      source: type,
      page_size: 10,
    };

    // if (loading) {
    //   return;
    // }
    setloding(true);

    const res = await axios.get(api.getMyExpenseCalendar, {
      params: data,
    });
    setloding(false);
    // console.log("返回了", res.data.data);
    if (res.data?.err_code === 0) {
      let data = res.data.data.result_list;
      let listnow = pagenow === 1 ? [...data] : [...list, ...data];
      setlist(listnow);
      setpage(pagenow);
      settotal(res.data.data.total_pages);
    }
  };
  const nextPage = () => {
    if (page < total) {
      getlist(page + 1, checkedType);
    }
  };
  const refreshNow = () => {
    getlist(1, checkedType);
    getCoinNum();
  };
  const lookThisType = (item) => {
    setcheckedType(item.type);
  };
  const renderTypeItem = (item, index) => {
    let isChecked = checkedType !== item.type;
    return (
      <TouchableOpacity
        onPress={lookThisType.bind(this, item)}
        key={index}
        style={[
          styles.typeWrap,
          isChecked && {
            backgroundColor: "transparent",
            marginRight: pxToDp(16),
          },
          // index === 0 && { marginLeft: 0 },
        ]}
      >
        <View
          style={[
            styles.typeInner,
            appStyle.flexCenter,
            isChecked && {
              backgroundColor: "#E1DBD7",
              borderColor: "#E1DBD7",
            },
          ]}
        >
          <Text style={[isChecked ? styles.typeTxtNor : styles.typeTxt]}>
            {item.title}
          </Text>
        </View>
        <View
          style={[
            styles.myCoin,
            isChecked && { backgroundColor: "#F6F3F1", borderColor: "#fff" },
          ]}
        >
          <Image
            style={[styles.coinImg]}
            source={require("../../../images/square/coinBig.png")}
          />
          <Text style={[styles.coinTxt]}>
            x{item.num > 9999 ? "9999+" : item.num}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const getMsg = (item) => {
    let count = item.count,
      user_name = "",
      from = "",
      operate_time = item.operate_time,
      source = item.source,
      title = item.user_name;
    switch (checkedType) {
      case "consumptionDetails":
        from = item.source.slice(0, 2);
        title = item.source === "提现" ? item.user_name : item.title_content;
        user_name = item.source === "提现" ? "" : item.user_name;
        break;
      case "tipIncome":
        from = "来自";
        count = "+" + count;
        break;
      case "moduleDetails":
        title = item.title_content;
        break;
      default:
        count = "+" + count;
        break;
    }
    return { count, user_name, title, operate_time, source, from };
  };
  const renderListItem = ({ item, index }) => {
    const showTitle = checkedType === "consumptionDetails";
    const { count, user_name, title, operate_time, source, from } =
      getMsg(item);
    return (
      <View key={index} style={[styles.itemWrap]}>
        <View style={[appStyle.flexTopLine, styles.itemInner]}>
          <View
            style={[
              appStyle.flexTopLine,
              appStyle.flexAliCenter,
              styles.itemLeftWrap,
            ]}
          >
            {/* 左边 */}
            {from ? <Text style={[styles.itemTxt1]}>{from}</Text> : null}
            <View style={[]}>
              <View
                style={[styles.itemTxtWrap2, showTitle && styles.itemTxtWrap3]}
              >
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={[styles.itemTxt2]}
                >
                  {title}
                </Text>
              </View>
              {user_name ? (
                <Text style={[styles.itemTxt6]}>{user_name}</Text>
              ) : null}
            </View>
          </View>
          <View style={[appStyle.flexTopLine, { flex: 1 }]}>
            {/* 中间 */}
            <Text style={[styles.itemTxt3]}>{operate_time}</Text>
            <Text style={[styles.itemTxt4]}>{source}</Text>
          </View>
          <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
            {/* \右边 */}
            <Image
              style={[styles.coinShadow]}
              resizeMode="contain"
              source={require("../../../images/square/coinShadow.png")}
            />
            <Text style={[styles.itemTxt5]}>{count}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={[{ flex: 1, backgroundColor: "#EDE9E7", position: "relative" }]}
    >
      <TouchableOpacity
        style={[styles.chongzhiWrap]}
        onPress={() => {
          dispatch({
            type: "SET_PAYCOIN_VISIBLE",
            data: true,
          });
        }}
      >
        <View style={[styles.chongzhiInner, appStyle.flexCenter]}>
          <Image
            source={require("../../../images/square/chongzhi.png")}
            style={[size_tool(86, 47)]}
          />
        </View>
      </TouchableOpacity>
      <View style={[styles.headerWrap]}>
        <TouchableOpacity style={[styles.backImgWrap]} onPress={goBack}>
          <Image
            style={[styles.backImg]}
            source={require("../../../images/chineseHomepage/pingyin/new/back.png")}
          />
        </TouchableOpacity>
        <View style={[styles.titleItemWrap]}>
          <ScrollView horizontal={true}>
            <View style={[appStyle.flexTopLine, { paddingTop: pxToDp(50) }]}>
              {typeList.map((item, index) => {
                return renderTypeItem(item, index);
              })}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={[styles.mainWrap, borderRadius_tool(33, 33, 0, 0)]}>
        <View
          style={[
            appStyle.flexTopLine,
            appStyle.flexJusBetween,
            padding_tool(19, 43, 19, 43),
          ]}
        >
          <View
            style={[
              size_tool(18),
              borderRadius_tool(20),
              { backgroundColor: "#283139" },
            ]}
          />
          <View
            style={[
              size_tool(18),
              borderRadius_tool(20),
              { backgroundColor: "#283139" },
            ]}
          />
        </View>
        <View
          style={[
            {
              backgroundColor: "#E1DBD7",
              paddingLeft: pxToDp(274),
              paddingRight: pxToDp(274),
              flex: 1,
            },
          ]}
        >
          <FlatList
            data={list}
            renderItem={renderListItem}
            onEndReached={nextPage}
            refreshing={loading}
            onRefresh={refreshNow}
            onEndReachedThreshold={0.1}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  chongzhiWrap: {
    paddingBottom: pxToDp(7),
    borderRadius: pxToDp(100),
    backgroundColor: "#FF7300",
    position: "absolute",
    top: pxToDp(30),
    zIndex: 99,
    right: pxToDp(85),
    width: pxToDp(200),
    height: pxToDp(200),
  },
  chongzhiInner: {
    flex: 1,
    borderRadius: pxToDp(100),
    backgroundColor: "#FF9202",
    borderColor: "#FFCA00",
    borderWidth: pxToDp(12),
  },
  mainWrap: {
    flex: 1,
    borderWidth: pxToDp(4),
    borderColor: "#fff",
    borderBottomWidth: pxToDp(0),
    backgroundColor: "#E1DBD7",
  },
  backImg: {
    width: pxToDp(120),
    height: pxToDp(80),
  },
  backImgWrap: {
    position: "absolute",
    top: pxToDp(Platform.OS === "ios" ? 90 : 30),
    left: pxToDp(45),
    zIndex: 9,
  },
  headerWrap: {
    height: pxToDp(Platform.OS === "ios" ? 190 : 177),
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: pxToDp(12),
  },
  typeWrap: {
    width: pxToDp(272),
    height: pxToDp(110),
    borderRadius: pxToDp(42),
    padding: pxToDp(12),
    backgroundColor: "#FFBB00",
    marginRight: pxToDp(28),
  },
  typeInner: {
    flex: 1,
    borderRadius: pxToDp(30),
    backgroundColor: "#F9E279",
    borderWidth: pxToDp(2),
    borderColor: "#fff",
  },
  typeTxt: {
    fontSize: pxToDp(42),
    color: "#333333",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(42),
  },
  typeTxtNor: {
    fontSize: pxToDp(38),
    color: "#333333",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(40),
  },
  coinImg: {
    width: pxToDp(32),
    height: pxToDp(32),
    marginRight: pxToDp(4),
  },
  myCoin: {
    flexDirection: "row",
    alignItems: "center",
    height: pxToDp(43),
    minWidth: pxToDp(92),
    borderWidth: pxToDp(3),
    borderColor: "#FFBB00",
    backgroundColor: "#FFFAE1",
    position: "absolute",
    borderRadius: pxToDp(20),
    top: pxToDp(-10),
    right: pxToDp(-10),
    paddingLeft: pxToDp(16),
    paddingRight: pxToDp(16),
  },
  coinTxt: {
    fontSize: pxToDp(21),
    color: "#333333",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(22),
  },
  itemWrap: {
    width: "100%",
    backgroundColor: "#D4CFCB",
    marginBottom: pxToDp(9),
    borderRadius: pxToDp(50),
    paddingBottom: pxToDp(5),
    height: pxToDp(145),
  },
  itemInner: {
    flex: 1,
    backgroundColor: "#EAE4E2",
    borderRadius: pxToDp(50),
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: pxToDp(33),
    paddingRight: pxToDp(28),
  },
  coinShadow: {
    width: pxToDp(87),
    height: pxToDp(108),
  },
  itemTxt1: {
    fontSize: pxToDp(34),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(40),
    marginRight: pxToDp(18),
  },
  itemTxt2: {
    fontSize: pxToDp(38),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(40),
  },
  itemTxt3: {
    fontSize: pxToDp(25),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(40),
    marginRight: pxToDp(96),
  },
  itemTxt4: {
    fontSize: pxToDp(42),
    color: "#283139",
    ...appFont.fontFamily_jcyt_500,
    lineHeight: pxToDp(48),
  },
  itemTxt5: {
    fontSize: pxToDp(38),
    color: "#283139",
    ...appFont.fontFamily_jcyt_700,
    lineHeight: pxToDp(48),
    marginLeft: pxToDp(24),
    width: pxToDp(150),
  },
  itemTxt6: {
    color: "#283139",
    fontSize: pxToDp(25),
    lineHeight: pxToDp(30),
    marginLeft: pxToDp(40),
  },
  itemTxtWrap2: {
    paddingLeft: pxToDp(32),
    paddingRight: pxToDp(32),
    height: pxToDp(100),
    borderRadius: pxToDp(50),
    backgroundColor: "#F6F3F1",
    justifyContent: "center",
    alignItems: "center",
    minWidth: pxToDp(270),
    maxWidth: pxToDp(330),
  },
  itemLeftWrap: {
    width: pxToDp(500),
  },
  itemTxtWrap3: {
    height: pxToDp(80),
    marginBottom: pxToDp(4),
    maxWidth: pxToDp(400),
  },
  titleItemWrap: {
    ...appStyle.flexTopLine,
    justifyContent: "center",
    paddingLeft: pxToDp(200),
    paddingRight: pxToDp(300),
    flex: 1,
  },
});

export default ExpensiveCalendar;
