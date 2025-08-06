import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import axios from " ../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import Pagenation from "./pagenation";
import Loading from "../../../../../component/loading";
import NavigationUtil from "../../../../../navigator/NavigationUtil";

const Reading = ({ typeIndex, navigation }) => {
  const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
  const { checkGrade, checkTeam } = currentUserInfo;
  const [list, setlist] = useState([]);
  const [page, setpage] = useState(1);
  const [totalPage, settotalPage] = useState(1);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    getlist(1);
  }, []);
  useEffect(() => {
    getlist(1);
  }, [typeIndex]);
  const getlist = async (pagenow) => {
    setloading(true);
    const res = await axios.get(
      `${api.errorReadArticle}/${checkGrade}/${checkTeam}/${typeIndex}?page=${pagenow}`
    );
    console.log("阅读", res.data);
    setloading(false);
    if (res.data.err_code === 0) {
      const { data, total } = res.data;
      setlist(data);
      setpage(pagenow);
      settotalPage(Math.ceil(total / 10));
    }
  };
  const changePage = (pagenow) => {
    getlist(pagenow);
  };
  const lookmore = (item) => {
    NavigationUtil.toSpeWrongExerciseListRead({
      navigation,
      data: {
        knowledge: item,
        index: typeIndex,
      },
    });
  };
  const renderitem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.itemWrap]}
        onPress={() => lookmore(item)}
      >
        <View style={[styles.itemInner]}>
          <View style={[styles.itemMainWrap]}>
            <View style={[styles.titleWrap]}>
              <Text style={[styles.titleTxt]}>
                {item.article_type} /{item.article_category}
              </Text>
            </View>
            <Text style={[styles.itemTxt]}>
              {item.name} ({item.author})
            </Text>
          </View>
          <Image
            source={require("../../../../../images/chineseHomepage/flow/flowGo.png")}
            style={[size_tool(22, 38)]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.contain]}>
      <View style={[styles.mainWrap]}>
        {list.length === 0 ? (
          <View style={[{ flex: 1 }, appStyle.flexCenter]}>
            <Image
              source={require("../../../../../images/square/noData.png")}
              style={[size_tool(592, 568)]}
              resizeMode="contain"
            />
          </View>
        ) : (
          <FlatList data={list} renderItem={renderitem} />
        )}
      </View>
      <Pagenation
        totalPage={totalPage}
        changePage={changePage}
        loading={loading}
        page={page}
      />
      <Loading showLoading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    paddingRight: pxToDp(56),
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
  },

  main: {
    flexWrap: "wrap",
  },
  itemWrap: {
    width: "100%",
    minHeight: pxToDp(200),
    borderRadius: pxToDp(40),
    backgroundColor: "#DAE2F2",
    paddingBottom: pxToDp(8),
    marginBottom: pxToDp(16),
  },
  itemTxt: {
    fontSize: pxToDp(40),
    lineHeight: pxToDp(50),
    color: "#475266",
    ...appFont.fontFamily_syst_bold,
  },
  itemInner: {
    flex: 1,
    borderRadius: pxToDp(40),
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: pxToDp(22),
    paddingRight: pxToDp(50),
  },
  titleWrap: {
    padding: pxToDp(12),
    borderRadius: pxToDp(24),
    backgroundColor: "rgba(255,182,73,0.4)",
    marginBottom: pxToDp(30),
    minWidth: pxToDp(300),
    paddingTop: pxToDp(4),
    paddingBottom: pxToDp(4),
  },
  titleTxt: {
    ...appFont.fontFamily_syst_bold,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    color: "#FF964A",
  },
  itemMainWrap: {
    flex: 1,
    marginLeft: pxToDp(30),
    alignItems: "flex-start",
    marginRight: pxToDp(40),
  },
});
export default Reading;
