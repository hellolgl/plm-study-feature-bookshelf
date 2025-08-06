import React, { useEffect, useRef } from "react";
import {
    Text,
    View,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    Animated,
    Easing,
    PermissionsAndroid
} from "react-native";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../util/tools";
import { appFont, appStyle } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const checkPermission = async () => {
    if (Platform.OS === 'android') {
        try {

            // const camerarollGranted = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            //     {
            //       title: '当前程序需要获取相机权限',
            //       message: '作文批改需要拍照功能',
            //       buttonNeutral: '稍后再问',
            //       buttonNegative: '取消',
            //       buttonPositive: '打开权限'
            //     }
            // )
            //
            // const externalGranted = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            //     {
            //       title: '当前程序需要获取文件权限',
            //       message: '用来存储录音评分数据；存储批改作文的图片',
            //       buttonNeutral: '稍后再问',
            //       buttonNegative: '取消',
            //       buttonPositive: '打开权限'
            //     }
            // )
            //
            // const audioGranted = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            //     {
            //       title: '当前程序需要获取录音权限',
            //       message: '语音评测需要录音权限',
            //       buttonNeutral: '稍后再问',
            //       buttonNegative: '取消',
            //       buttonPositive: '打开权限'
            //     }
            // )

            const grants = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);

            // if (
            //     camerarollGranted ===
            //     PermissionsAndroid.RESULTS.GRANTED &&
            //     externalGranted ===
            //     PermissionsAndroid.RESULTS.GRANTED &&
            //     audioGranted ===
            //     PermissionsAndroid.RESULTS.GRANTED
            // )
            if (
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.RECORD_AUDIO'] ===
                PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('Permissions granted');
            } else {
                console.log('All required permissions not granted');
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }
};

function Privacy(props) {
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { organ_name } = currentUserInfo;
    const isPhone = !getIsTablet();
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;
    const OS = Platform.OS;
    const agree = async () => {
        // 同意并继续
        await checkPermission()
        try {
            await AsyncStorage.setItem("agreeStatus", "true");
            NavigationUtil.toHomePage(props);
        } catch (err) {
            console.log("err", err);
        }
    };
    const disagree = () => {
        if (OS === "android") {
            BackHandler.exitApp();
        }
    };
    const seeDetails = async () => {
        if (Platform.OS === "android") {
            NavigationUtil.toProtocolPage({ ...props, data: { img: 'yinsi' } });
        } else {
            // NavigationUtil.toProtocolPage({ ...props, data: { img:'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/create.png'} });
        }
    };
    return (
        <View
            style={[{ flex: 1, backgroundColor: "#929292" }, appStyle.flexCenter]}
        >
            <View style={[styles.wrap, { backgroundColor: "#fff" }]}>
                <Text
                    style={[
                        {
                            color: "#273449",
                            fontSize: isPhone ? pxToDp(36) : pxToDp(40),
                            textAlign: "center",
                            marginBottom: pxToDp(20),
                        },
                        appFont.fontFamily_jcyt_700,
                    ]}
                >
                    隐私政策
                </Text>
                <Text style={[styles.txt1, { marginBottom: pxToDp(20) }]}>
                    （1）《隐私政策》中关于个人设备用户信息的收集和使用的说明。
                </Text>
                <Text style={[styles.txt1]}>
                    （2）《隐私政策》中与第三方SDK类服务商数据共享、相关信息收集和使用说明。
                </Text>
                <Text
                    style={[
                        {
                            color: "#273449",
                            fontSize: isPhone ? pxToDpWidthLs(28) : pxToDp(36),
                            marginTop: pxToDp(68),
                        },
                        appFont.fontFamily_jcyt_500,
                    ]}
                >
                    隐私政策说明：
                </Text>
                <View style={[appStyle.flexLine]}>
                    <Text style={[styles.txt2]}>阅读完整的</Text>
                    <TouchableOpacity onPress={seeDetails}>
                        <Text style={[styles.txt2, { color: "#1E78FF" }]}>
                            《隐私政策》
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.txt2]}>了解详情内容</Text>
                </View>
                <View style={[appStyle.flexAliCenter]}>
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            { marginTop: pxToDp(40), marginBottom: pxToDp(20) },
                        ]}
                        onPress={agree}
                    >
                        <Text style={[styles.btnTxt]}>同意并继续</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#EFEFEF" }]}
                        onPress={disagree}
                    >
                        <Text style={[styles.btnTxt, { color: "#A1A1A1" }]}>不同意</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const stylesHandset = StyleSheet.create({
    wrap: {
        width: pxToDpWidthLs(458),
        paddingTop: pxToDpWidthLs(30),
        paddingLeft: pxToDpWidthLs(30),
        paddingRight: pxToDpWidthLs(30),
        paddingBottom: pxToDpWidthLs(20),
        borderRadius: pxToDpWidthLs(48),
    },
    txt1: {
        color: "rgba(39,52,73,0.8)",
        fontSize: pxToDpWidthLs(24),
    },
    txt2: {
        color: "rgba(39,52,73,0.7)",
        fontSize: pxToDpWidthLs(22),
    },
    btn: {
        width: pxToDpWidthLs(377),
        height: pxToDpWidthLs(78),
        borderRadius: pxToDpWidthLs(28),
        backgroundColor: "#458FFF",
        ...appStyle.flexCenter,
    },
    btnTxt: {
        color: "#fff",
        fontSize: pxToDpWidthLs(32),
        ...appFont.fontFamily_jcyt_700,
    },
});
const stylesTablet = StyleSheet.create({
    wrap: {
        width: pxToDp(740),
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(60),
        paddingRight: pxToDp(60),
        paddingBottom: pxToDp(30),
        borderRadius: pxToDp(48),
    },
    txt1: {
        color: "rgba(39,52,73,0.8)",
        fontSize: pxToDp(32),
    },
    txt2: {
        color: "rgba(39,52,73,0.7)",
        fontSize: pxToDp(32),
    },
    btn: {
        width: pxToDp(560),
        height: pxToDp(116),
        borderRadius: pxToDp(28),
        backgroundColor: "#458FFF",
        ...appStyle.flexCenter,
    },
    btnTxt: {
        color: "#fff",
        fontSize: pxToDp(44),
        ...appFont.fontFamily_jcyt_700,
    },
});
export default Privacy;
