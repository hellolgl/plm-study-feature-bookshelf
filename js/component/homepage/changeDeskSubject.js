import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from "react-native";
import { appFont, appStyle } from "../../theme";
import { pxToDp, padding_tool, size_tool } from "../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ChangeDeskSubject = ({ show, close, typeName, check, paddingTop }) => {
    const typelist = [
        {
            txt: "语文作业",
            key: "chinese",
        },
        {
            txt: "数学作业",
            key: "math",
        },
        {
            txt: "英语作业",
            key: "english",
        },
    ];
    return (
        <View
            style={[
                styles.click_region,
                show && { zIndex: 10 },
                { opacity: show ? 1 : 0 },
            ]}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={[styles.click_region]}></View>
            </TouchableWithoutFeedback>
            <View
                style={[
                    appStyle.flexLine,
                    { justifyContent: "space-between" },
                    padding_tool(paddingTop ? paddingTop : 20, 30, 30, 32),
                ]}
            >
                <View style={[{ width: pxToDp(170) }]}></View>
                <View>
                    <TouchableOpacity onPress={close} style={[styles.changeBtnWrap]}>
                        <Text style={[styles.changeBtnTxt]}>{typeName}</Text>
                        <Image
                            source={require("../../images/chineseHomepage/wrong/changeIcon.png")}
                            style={[size_tool(20)]}
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.content]}>
                    <View style={[styles.inner]}>
                        <Text style={[styles.titleTxt]}>错题集切换</Text>
                        <View>
                            {typelist.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => check(item.key)}
                                        style={[
                                            styles.itemWrap,
                                            item.txt === typeName && { backgroundColor: "#FF9D42" },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.itemInner,
                                                item.txt === typeName && {
                                                    backgroundColor: "#FFC85D",
                                                    borderRadius: pxToDp(40),
                                                },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.itemIconWrap,
                                                    item.txt === typeName && { opacity: 1 },
                                                ]}
                                            >
                                                <FontAwesome
                                                    name={"check"}
                                                    size={pxToDp(20)}
                                                    style={{ color: "#FFC85D" }}
                                                />
                                            </View>

                                            <Text style={[styles.itemTxt]}>{item.txt}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.triangle_up}></View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    click_region: {
        flex: 1,
        backgroundColor: "rgba(71, 82, 102, 0.5)",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -1,
        top: pxToDp(0),
        left: pxToDp(0),
    },
    changeBtnWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFB649",
        width: pxToDp(240),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        justifyContent: "center",
    },
    changeBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        color: "#fff",
        marginRight: pxToDp(10),
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: "transparent",
        borderRightWidth: pxToDp(16),
        borderRightColor: "transparent",
        borderBottomWidth: pxToDp(20),
        borderBottomColor: "#fff",
        position: "absolute",
        top: pxToDp(-20),
        right: pxToDp(100),
    },
    content: {
        position: "absolute",
        top: pxToDp(140),
        width: pxToDp(580),
        backgroundColor: "#E7E7F2",
        borderRadius: pxToDp(60),
        ...appStyle.flexAliCenter,
        paddingBottom: pxToDp(8),
        right: pxToDp(22),
    },
    inner: {
        width: "100%",
        padding: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(60),
    },
    itemWrap: {
        width: "100%",
        height: pxToDp(120),

        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8),
    },
    itemInner: {
        flex: 1,

        borderRadius: pxToDp(40),
        flexDirection: "row",
        alignItems: "center",
        padding: pxToDp(20),
    },
    itemTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        lineHeight: pxToDp(40),
        color: "#475266",
    },
    titleTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(44),
        lineHeight: pxToDp(44),
        color: "#4C4C59",
        marginBottom: pxToDp(20),
        textAlign: "center",
    },
    itemIconWrap: {
        width: pxToDp(40),
        height: pxToDp(40),
        backgroundColor: "#475266",
        ...appStyle.flexCenter,
        borderRadius: pxToDp(20),
        marginRight: pxToDp(20),
        opacity: 0,
    },
});
export default ChangeDeskSubject;
