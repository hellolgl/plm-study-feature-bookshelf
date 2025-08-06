import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    DeviceEventEmitter,
} from "react-native";
import Video from "react-native-video";
import { pxToDp } from "../util/tools";
import SplashScreen from "react-native-splash-screen";
import { appFont } from "../theme";
import NavigationUtil from "../navigator/NavigationUtil";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSafeInsets } from '../action/userInfo/index'
import { useSelector, useDispatch } from "react-redux";

const log = console.log.bind(console);

const homePage = (props) => {
    const dispatch = useDispatch()
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { organ_name } = currentUserInfo;
    const insets = useSafeAreaInsets();
    useEffect(() => {
        SplashScreen.hide();
        // console.log("安全区", insets);
        dispatch(setSafeInsets(insets))
    }, []);

    const toContinue = async () => {
        try {
            const agreeStatus = await AsyncStorage.getItem("agreeStatus");
            if (agreeStatus) {
                NavigationUtil.toHomePage(props);
            } else {
                //  首次，进入同意页面
                console.log("同意", agreeStatus);
                NavigationUtil.toPrivacy(props);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const videoUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/new_splash.mp4`;

    return (
        <View style={[styles.container]} onPress={toContinue}>
            <Video
                source={{ uri: videoUri }}
                paused={false}
                onLoad={async () => {
                    SplashScreen.hide();
                }}
                onProgress={(currentTime) => {
                    // log("on press current time: ", currentTime)
                }}
                onReadyForDisplay={() => {
                    // log("onReadyForDisplay video...")
                }}
                onLoadStart={() => {
                    // log("on load start video...")
                }}
                onEnd={() => {
                    log("end play video...");
                    toContinue();
                }}
                style={styles.backgroundVideo}
                // full screen
                resizeMode={"contain"}
            // resizeMode={"contain"}
            />
            <TouchableOpacity
                onPress={toContinue}
                style={[
                    {
                        width: "100%",
                        height: "100%",
                        zIndex: 999,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        paddingBottom: pxToDp(Platform.OS === "ios" ? 100 : 60),
                        position: "absolute",
                        top: 0,
                        left: 0,
                    },
                ]}
            >
                <Text
                    style={[
                        { fontSize: pxToDp(40), color: "#514F65" },
                        appFont.fontFamily_jcyt_700,
                    ]}
                >
                    点击继续
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        backgroundColor: "#EEECDE",
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "space-between",
    },
    backgroundVideo: {
        overflow: "hidden",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
});
export default homePage
