import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { appFont, appStyle } from "../theme";
import { pxToDp, padding_tool, size_tool } from "../util/tools";
import { useSelector, useDispatch } from "react-redux";

const CoinView = ({ right, bottom }) => {
    const { moduleCoin } = useSelector((state) => state.toJS().userInfo);
    return (
        <View style={[styles.mainWrap, right ? { right } : null, bottom ? { bottom } : null]}>
            <Text style={[styles.nameTxt]}>今日已获得派币:</Text>
            <Image
                source={require("../images/square/paiCoin.png")}
                style={[
                    size_tool(28),
                    { marginRight: pxToDp(4), marginLeft: pxToDp(4) },
                ]}
                resizeMode="contain"
            />

            <Text style={[styles.nameTxt]}>x{moduleCoin}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        position: "absolute",
        right: pxToDp(20),
        bottom: pxToDp(20),
        height: pxToDp(68),
        width: pxToDp(320),
        borderRadius: pxToDp(38),
        backgroundColor: "rgba(0,0,0,0.4)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    nameTxt: {
        color: "#fff",
        fontSize: pxToDp(28),
        ...appFont.fontFamily_jcyt_500,
    },
});
export default CoinView;
