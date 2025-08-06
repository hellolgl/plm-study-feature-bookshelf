import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    Animated,
    Easing,
    SafeAreaView,
    DeviceEventEmitter
} from "react-native";
import AiTalk from "./index";
import { pxToDp, size_tool } from "../../../../../../util/tools";
import { appFont, appStyle } from "../../../../../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import TtsTips from "../../../../../../component/ttsTips";

function AiTalkModal(props) {
    const { visible, close, g_h_id, knowledge_name } = props;
    const { knowStatus } = useSelector(
        (state) => state.toJS().knowAiTalk
    );
    const [tipsShow, setTipsShow] = useState(false)
    const translateY = useRef(new Animated.Value(700)).current;
    const dispatch = useDispatch();
    const onShow = () => {
        Animated.timing(translateY, {
            toValue: 0,
            easing: Easing.bounce,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        dispatch({ type: "knowAiTalk/setsubject", data: "math" });
        const eventListener = DeviceEventEmitter.addListener('showTtsTips', () => {
            setTipsShow(true)
        });
        return () => {
            eventListener.remove();
        };
    }, []);
    const closeMe = () => {
        close();
        dispatch({ type: "knowAiTalk/setHistoryList", data: [] });
    };
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onShow={onShow}
            supportedOrientations={["portrait", "landscape"]}
        >
            <View style={[styles.mContainer]}>
                <SafeAreaView style={[styles.safeView]}>
                    <Animated.View
                        style={[
                            styles.animatedView,
                            appStyle.flexLine,
                            {
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                closeMe();
                            }}
                            style={[styles.closeBtn]}
                        >
                            <FontAwesome
                                name={"close"}
                                size={pxToDp(56)}
                                style={{ color: "#fff" }}
                            />
                        </TouchableOpacity>
                        <ImageBackground
                            style={[
                                size_tool(422, 742),
                                appStyle.flexCenter,
                                {
                                    paddingBottom: pxToDp(90),
                                    position: "absolute",
                                    left: pxToDp(-20),
                                    paddingRight: pxToDp(60),
                                },
                            ]}
                            source={require("../../../../../../images/MathKnowledgeGraph/aiTalkItemBg.png")}
                        >
                            <ImageBackground
                                source={
                                    knowStatus === 2
                                        ? require("../../../../../../images/MathKnowledgeGraph/itemBg1.png")
                                        : knowStatus === 1
                                            ? require("../../../../../../images/MathKnowledgeGraph/itemBg3.png")
                                            : require("../../../../../../images/MathKnowledgeGraph/noData.png")
                                }
                                style={[size_tool(305), appStyle.flexCenter, ,]}
                            >
                                <Text
                                    style={[
                                        appFont.fontFamily_jcyt_700,
                                        {
                                            width: pxToDp(196),
                                            color: knowStatus === 0 ? "#7F7F7F" : "#22294D",
                                            fontSize: pxToDp(28),
                                            lineHeight: pxToDp(28),
                                        },
                                    ]}
                                >
                                    {knowledge_name}
                                </Text>
                            </ImageBackground>
                        </ImageBackground>
                        <View style={[styles.rightWrap]}>
                            <ImageBackground
                                resizeMode="stretch"
                                style={[styles.mContent]}
                                source={
                                    Platform.OS === "android"
                                        ? require("../../../../../../images/square/bg_1.png")
                                        : require("../../../../../../images/square/bg_1.png")
                                }
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        marginTop: pxToDp(54),
                                    }}
                                >
                                    <AiTalk g_h_id={g_h_id}></AiTalk>
                                </View>
                            </ImageBackground>
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </View>
            <TtsTips visible={tipsShow} close={() => {
                setTipsShow(false)
            }}></TtsTips>
        </Modal>
    );
}

const styles = StyleSheet.create({
    mContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, .7)",
        // padding: pxToDp(50),
    },
    mContent: {
        flex: 1,
        paddingLeft: pxToDp(38),
        paddingRight: pxToDp(25),
        // paddingTop: Platform.OS === "android" ? pxToDp(100) : pxToDp(80),
        borderTopLeftRadius: pxToDp(60),
        borderTopRightRadius: pxToDp(60),
        overflow: "hidden",
    },
    rightWrap: {
        flex: 1,
        padding: pxToDp(2),
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(60),
        borderTopRightRadius: pxToDp(60),
    },
    closeBtn: {
        width: pxToDp(96),
        height: pxToDp(96),
        borderRadius: pxToDp(48),
        backgroundColor: "#F55858",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: pxToDp(20),
        right: pxToDp(0),
        zIndex: 9,
    },
    safeView: {
        paddingLeft: pxToDp(34),
        paddingRight: pxToDp(34),
        flex: 1,
    },
    animatedView: {
        flex: 1,
        paddingLeft: pxToDp(316),
        paddingTop: pxToDp(50),
    },
});
export default AiTalkModal;
