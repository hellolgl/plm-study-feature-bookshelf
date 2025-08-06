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
    DeviceEventEmitter
} from "react-native";
import AiTalk from "./index";
import { pxToDp } from "../../util/tools";
import { appFont, appStyle } from "../../theme";
import MarkdownView from "../../component/markdownView";
import TtsTips from '../../component/ttsTips'

import { useSelector, useDispatch } from "react-redux";

function AiTalkModal(props) {
    const { visible, close } = props;
    const translateY = useRef(new Animated.Value(700)).current;
    const [tipsShow, setTipsShow] = useState(false)
    const onShow = () => {
        Animated.timing(translateY, {
            toValue: 0,
            easing: Easing.bounce,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        const eventListener = DeviceEventEmitter.addListener('showTtsTips', () => {
            setTipsShow(true)
        });
        return () => {
            eventListener.remove();
        };
    });
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onShow={onShow}
            supportedOrientations={["portrait", "landscape"]}
        >
            <View style={[styles.mContainer]}>
                <Animated.View
                    style={[
                        {
                            flex: 1,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <ImageBackground
                        resizeMode="stretch"
                        style={[styles.mContent]}
                        source={
                            Platform.OS === "android"
                                ? require("../../images/aiGiveExercise/talk_bg.png")
                                : require("../../images/aiGiveExercise/talk_bg_ios.png")
                        }
                    >
                        <TouchableOpacity
                            style={[{ position: "absolute", right: 0, zIndex: 1 }]}
                            onPress={close}
                        >
                            <Image
                                style={[{ width: pxToDp(153), height: pxToDp(113) }]}
                                source={require("../../images/aiGiveExercise/close_icon_1.png")}
                            ></Image>
                        </TouchableOpacity>
                        {/* <MarkdownView></MarkdownView> */}
                        {/* <View style={[appStyle.flexTopLine,appStyle.flexAliEnd]}>
                        <Image style={[{width:pxToDp(222),height:pxToDp(254)}]} source={require('../../images/aiGiveExercise/item_bg_1.png')}></Image>
                        <View>
                            <Image style={[{width:pxToDp(141),height:pxToDp(72),marginBottom:pxToDp(14),marginLeft:pxToDp(-20)}]} source={require('../../images/aiGiveExercise/item_bg_2.png')}></Image>
                            <View style={[styles.mTipsWrap]}>
                                <Text style={[{color:"#4C4C59",fontSize:pxToDp(42)},appFont.fontFamily_jcyt_700]}>请跟着我一起解答这道题目。</Text>
                            </View>
                        </View>
                    </View> */}
                        <View
                            style={{
                                flex: 1,
                                marginTop: pxToDp(54),
                                paddingBottom:
                                    Platform.OS === "android" ? pxToDp(20) : pxToDp(30),
                            }}
                        >
                            <AiTalk></AiTalk>
                        </View>
                        {/* <View style={[{width:'100%',position:"absolute",left:pxToDp(50),bottom:pxToDp(200)},appStyle.flexAliCenter]}>
                        <ImageBackground style={[{width:pxToDp(1241),height:pxToDp(320)}]} source={require('../../images/aiGiveExercise/finish_bg.png')}>
                            <TouchableOpacity style={{position:"absolute",left:pxToDp(710),bottom:pxToDp(50)}}>
                                <Image resizeMode='stretch' style={[{width:pxToDp(459),height:pxToDp(100)}]} source={require('../../images/aiGiveExercise/btn_bg_1.png')}></Image>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View> */}
                    </ImageBackground>
                </Animated.View>
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
        backgroundColor: "rgba(76, 76, 89, .6)",
        paddingTop: Platform.OS === "android" ? pxToDp(40) : pxToDp(100),
        paddingLeft: pxToDp(50),
        paddingRight: pxToDp(50),
    },
    mContent: {
        flex: 1,
        paddingLeft: pxToDp(38),
        paddingRight: pxToDp(25),
        paddingTop: Platform.OS === "android" ? pxToDp(100) : pxToDp(80),
        paddingBottom: pxToDp(40),
    },
    mTipsWrap: {
        height: pxToDp(120),
        width: pxToDp(631),
        backgroundColor: "#E3F2FF",
        ...appStyle.flexCenter,
        borderRadius: pxToDp(60),
        borderTopLeftRadius: 0,
        shadowColor: "#000000",
        shadowOffset: {
            width: pxToDp(0),
            height: pxToDp(4),
        },
        shadowOpacity: 0.15,
        elevation: 3,
    },
});
export default AiTalkModal;
