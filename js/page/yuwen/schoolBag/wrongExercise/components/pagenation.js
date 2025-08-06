import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";

const Pagenation = ({ totalPage, changePage, loading, page }) => {
  const pageChange = (pagenow) => {
    if (loading) return;
    changePage(pagenow);
  };
  const [isfirst, setisfirst] = useState(true);
  const [isLast, setisLast] = useState(true);
  useEffect(() => {
    if (totalPage !== 0) {
      setisfirst(page === 1);
      setisLast(page === totalPage);
    } else {
      setisfirst(true);
      setisLast(true);
    }
  }, [totalPage, page]);
  return (
    <View style={[styles.contain]}>
      {isfirst ? (
        <View style={[size_tool(68)]} />
      ) : (
        <TouchableOpacity onPress={() => pageChange(1)}>
          <Image
            source={require("../../../../../images/chineseHomepage/wrong/first.png")}
            style={[size_tool(68)]}
          />
        </TouchableOpacity>
      )}
      {isfirst ? (
        <View style={[size_tool(68)]} />
      ) : (
        <TouchableOpacity onPress={() => pageChange(page - 1)}>
          <Image
            source={require("../../../../../images/chineseHomepage/wrong/last.png")}
            style={[size_tool(68)]}
          />
        </TouchableOpacity>
      )}
      <View style={[styles.pageWrap]}>
        <View style={[styles.pageInner]}>
          <Text style={[styles.pageTxt]}>
            {page}/{totalPage === 0 ? 1 : totalPage}
          </Text>
        </View>
      </View>
      {isLast ? (
        <View style={[size_tool(68)]} />
      ) : (
        <TouchableOpacity onPress={() => pageChange(page + 1)}>
          <Image
            source={require("../../../../../images/chineseHomepage/wrong/next.png")}
            style={[size_tool(68)]}
          />
        </TouchableOpacity>
      )}
      {isLast ? (
        <View style={[size_tool(68)]} />
      ) : (
        <TouchableOpacity onPress={() => pageChange(totalPage)}>
          <Image
            source={require("../../../../../images/chineseHomepage/wrong/finally.png")}
            style={[size_tool(68)]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    width: pxToDp(438),
    height: pxToDp(92),
    borderRadius: pxToDp(46),
    backgroundColor: "rgba(71,82,102,0.25)",
    position: "absolute",
    right: pxToDp(58),
    bottom: pxToDp(22),
    flexDirection: "row",
    alignItems: "center",
  },
  pageWrap: {
    flex: 1,
    height: pxToDp(80),
    borderRadius: pxToDp(40),
    borderWidth: pxToDp(4),
    borderColor: "#FFB649",
    backgroundColor: "#fff",
    padding: pxToDp(10),
  },
  pageInner: {
    flex: 1,
    borderRadius: pxToDp(30),
    backgroundColor: "#FFDB5D",
    justifyContent: "center",
    alignItems: "center",
  },
  pageTxt: {
    ...appFont.fontFamily_jcyt_500,
    color: "#475266",
    fontSize: pxToDp(32),
  },
});
export default Pagenation;
