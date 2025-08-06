import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";
import Avatar from "../../../../../component/homepage/avatar";
import { useSelector } from "react-redux";

const UserInfo = () => {
    const { currentUserInfo, coin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { name, username } = currentUserInfo;
    return (
        <View style={[appStyle.flexTopLine]}>
            <Avatar width={160} style={{ marginRight: pxToDp(20) }} />
            <View>
                <Text style={[styles.nameTxt]}>{name}</Text>
                <Text style={[{ color: "rgba(40, 49, 57, .3)", fontSize: pxToDp(16), lineHeight: pxToDp(22), marginBottom: pxToDp(20) }, appFont.fontFamily_jcyt_500]}>{username}</Text>
                <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                    <View style={[styles.coinWrap]}>
                        <Image
                            source={require("../../../../../images/square/paiCoin2.png")}
                            style={[size_tool(40)]}
                        />
                        <Text style={[styles.coinTxt]}>{coin}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    nameTxt: {
        color: "#4C4C59",
        fontSize: pxToDp(48),
    },
    coinWrap: {
        ...appStyle.flexTopLine,
        ...appStyle.flexAliCenter,
        ...padding_tool(10),
        ...size_tool(180, 60),
        backgroundColor: "#4C4C59",
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20),
    },
    coinTxt: {
        textAlign: "center",
        fontSize: pxToDp(28),
        color: "#FFEC8A",
        flex: 1,
    },
});

export default UserInfo;
