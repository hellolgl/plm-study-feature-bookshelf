import React, { Component, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    DeviceEventEmitter
} from "react-native";
import { pxToDp } from "../tools";
import { appFont, appStyle } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import axios from "../http/axios";
import api from "../http/api";
import _ from "lodash";
import { Toast } from "antd-mobile-rn";
import { setSelestModuleAuthority } from "../../action/userInfo";
import NavigationService from "../../navigator/NavigationService";
import { getAllCoin } from "../../action/userInfo";

function PurchaseByCoinModal({ visible, onClose }) {
    const dispatch = useDispatch();
    const { selestModule, token } = useSelector((state) => state.toJS().userInfo);
    const toRecharge = () => {
        if (!token) {
            onClose();
            NavigationService.navigate("StudentRoleHomePageAndroid", {});
            return;
        }
        dispatch({
            type: "SET_PAYCOIN_VISIBLE",
            data: true,
        });
    };
    const toPay = () => {
        if (!token) {
            onClose();
            NavigationService.navigate("StudentRoleHomePageAndroid", {});
            return;
        }
        const alias = selestModule.alias;
        axios
            .post(api.purchaseCoin, { module_alias: alias })
            .then(async (res) => {
                const err_code = res.data.err_code;
                const err_msg = res.data.err_msg;
                const tag = res.data.data?.tag;
                let msg = tag ? "购买成功" : err_msg;
                if (!tag) {
                    // 余额不足
                    dispatch({
                        type: "SET_PAYCOIN_VISIBLE",
                        data: true,
                    });
                } else {
                    dispatch(setSelestModuleAuthority());
                    dispatch(getAllCoin());
                    onClose();
                    DeviceEventEmitter.emit('refreshHomePageConfig') //刷新首页信息
                    DeviceEventEmitter.emit('refreshDailyTask') //刷新每日任务数据
                }
                Toast.info(msg, 1);
            })
            .catch((e) => {
                console.log(e);
                Toast.info("购买失败", 1);
                onClose();
            });
    };
    if (!visible) return null;
    return (
        <View
            style={[
                {
                    position: "absolute",
                    top: pxToDp(0),
                    left: pxToDp(0),
                    width: "100%",
                    height: "100%",
                },
            ]}
        >
            <View style={[styles.wrap]}>
                <View style={styles.content}>
                    <View
                        style={[
                            {
                                paddingLeft: pxToDp(40),
                                paddingRight: pxToDp(60),
                                paddingTop: pxToDp(34),
                                paddingBottom: pxToDp(80),
                            },
                        ]}
                    >
                        <TouchableOpacity style={[styles.closeBtn]} onPress={onClose}>
                            <Image
                                resizeMode="stretch"
                                style={[{ width: pxToDp(100), height: pxToDp(100) }]}
                                source={require("../../images/chineseHomepage/sentence/status2.png")}
                            ></Image>
                        </TouchableOpacity>
                        <View style={[appStyle.flexAliEnd]}>
                            <TouchableOpacity onPress={toRecharge}>
                                <Image
                                    style={[{ width: pxToDp(200), height: pxToDp(84) }]}
                                    source={require("./img/pay_btn_1.png")}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                appStyle.flexLine,
                                appStyle.flexAliEnd,
                                appStyle.flexJusCenter,
                                { marginTop: pxToDp(40) },
                            ]}
                        >
                            <Text style={[styles.txt1]}>确认花费</Text>
                            <Text
                                style={[
                                    {
                                        color: "#FF4848",
                                        fontSize: pxToDp(58),
                                        marginLeft: pxToDp(6),
                                        marginRight: pxToDp(6),
                                    },
                                    Platform.OS === "android" ? { top: pxToDp(10) } : null,
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                30
                            </Text>
                            <Text style={[styles.txt1]}>个派币解锁模块一天吗？</Text>
                        </View>
                        <View style={[appStyle.flexAliCenter, { marginTop: pxToDp(70) }]}>
                            <TouchableOpacity
                                style={[styles.okBtnWrap, appStyle.flexLine]}
                                onPress={toPay}
                            >
                                <Text style={[styles.okBtnTxt, { marginRight: pxToDp(32) }]}>
                                    立即解锁
                                </Text>
                                <View
                                    style={[
                                        appStyle.flexLine,
                                        styles.coinNumWrap,
                                        appStyle.flexCenter,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                color: "#FF4848",
                                                fontSize: pxToDp(32),
                                                marginRight: pxToDp(12),
                                            },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        -30
                                    </Text>
                                    <Image
                                        source={require("../../images/square/paiCoin.png")}
                                        style={[{ width: pxToDp(36), height: pxToDp(36) }]}
                                        resizeMode="contain"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)",
        ...appStyle.flexCenter,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: pxToDp(70),
        position: "relative",
        width: pxToDp(940),
    },
    closeBtn: {
        position: "absolute",
        top: pxToDp(-30),
        right: pxToDp(-30),
        zIndex: 1,
    },
    payBtn: {
        width: pxToDp(260),
        height: pxToDp(108),
        backgroundColor: "#FFB649",
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8),
    },
    payBtnInner: {
        ...appStyle.flexCenter,
        height: "100%",
        width: "100%",
        backgroundColor: "#FFDB5D",
        borderRadius: pxToDp(40),
    },
    txt1: {
        color: "#283139",
        fontSize: pxToDp(40),
        ...appFont.fontFamily_jcyt_500,
    },
    okBtnWrap: {
        width: pxToDp(400),
        height: pxToDp(108),
        borderRadius: pxToDp(40),
        backgroundColor: "#FF9B48",
        borderWidth: pxToDp(5),
        borderColor: "#FFC12F",
        alignItems: "center",
        justifyContent: "center",
    },
    okBtnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(36),
        color: "#fff",
    },
    coinNumWrap: {
        width: pxToDp(122),
        height: pxToDp(56),
        backgroundColor: "rgba(255, 238, 196, 0.50)",
        borderRadius: pxToDp(100),
    },
});

export default PurchaseByCoinModal;
