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
import { pxToDp, size_tool } from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import AiTalk from "../../../../math/bag/KnowledgeGraph/chart/talk/index";
import Lottie from "lottie-react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import { chineseFirst } from "../../../../../action/knowAiTalk";
import TtsTips from "../../../../../component/ttsTips";
import axiosOld from "axios";
let lootieurlArray = [
    "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/waiting.json",
    "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/speaking.json",
];
let source = null;

function AiTalkModal(props) {
    const { visible, close, inspect_name, tag } = props;
    const { showTtsToast } = useSelector(
        (state) => state.toJS().knowAiTalk
    );
    const { playText } = useSelector(
        (state) => state.toJS().aiTalk,
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
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
        getFirst();
    };

    useEffect(() => {
        dispatch({ type: "knowAiTalk/setsubject", data: "chinese" });
        const eventListener = DeviceEventEmitter.addListener('showTtsTips', () => {
            setTipsShow(true)
        });
        return () => {
            eventListener.remove();
        };
    }, []);

    const getFirst = async () => {
        let grade_term = currentUserInfo.checkGrade + currentUserInfo.checkTeam;
        let params = {
            name: "句型训练",
            tag: tag,
            pName: "智能造句",
            grade_term,
            inspect: inspect_name,
        };
        const res = await axios.get(api.getChineseSentenceAiExerciseRecord, {
            params,
        });

        let data = res.data.data;
        let msglist = [];
        data.forEach((item, index) => {
            msglist.unshift({
                _id: Math.random().toString(36).substring(7),
                text: `${item.pre_explanation ? item.pre_explanation + "\n\n" : ""}${item.question
                    }`,
                createdAt: new Date(),
                user: {
                    _id: 1,
                },
                exercise: item,
                noClick: true,
            });
            if (item.choice_content) {
                msglist.unshift({
                    _id: Math.random().toString(36).substring(7),
                    text: item.choice_content,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                    },
                    exercise: item,
                });
            }
        });
        msglist.unshift({
            _id: Math.random().toString(36).substring(7),
            text: "...",
            createdAt: new Date(),
            user: {
                _id: 1,
            },
            exercise: {},
        });
        // console.log("历史记录", msglist);
        dispatch({ type: "knowAiTalk/setHistoryList", data: msglist });

        source = axiosOld.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
        const cancelToken = source.token;
        dispatch(chineseFirst(params, cancelToken));
    };
    const closeMe = () => {
        source && source.cancel("组件卸载,取消请求");
        // console.log("cccccccc", source);
        dispatch({ type: "knowAiTalk/setHistoryList", data: [] });
        close();
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
                        <View style={[styles.lottieWrap]}>
                            <Lottie
                                source={{
                                    uri: lootieurlArray[0],
                                }}
                                autoPlay={true}
                                // loop={true}
                                style={[
                                    styles.lottieStyle,
                                    {
                                        opacity: playText ? 0 : 1,
                                    },
                                ]}
                            // ref={(ref) => {
                            //   this.animation = ref;
                            // }}
                            />
                            <Lottie
                                source={{
                                    uri: lootieurlArray[1],
                                }}
                                autoPlay={true}
                                // loop={true}
                                style={[
                                    styles.lottieStyle,
                                    {
                                        opacity: playText ? 1 : 0,
                                    },
                                ]}
                            // ref={(ref) => {
                            //   this.animation = ref;
                            // }}
                            />
                        </View>
                        <View style={[styles.rightWrap]}>
                            <ImageBackground
                                resizeMode="stretch"
                                style={[styles.mContent]}
                                source={
                                    Platform.OS === "android"
                                        ? require("../../../../../images/square/bg_1.png")
                                        : require("../../../../../images/square/bg_1.png")
                                }
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        marginTop: pxToDp(54),
                                    }}
                                >
                                    <AiTalk g_h_id={0}></AiTalk>
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
        marginLeft: pxToDp(160),
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
    lottieStyle: {
        width: pxToDp(Platform.OS === "ios" ? 684 : 684),
        height: pxToDp(Platform.OS === "ios" ? 834 : 834),
        position: "absolute",
        top: pxToDp(0),
        left: pxToDp(0),
    },

    lottieWrap: {
        width: pxToDp(Platform.OS === "ios" ? 684 : 684),
        height: pxToDp(Platform.OS === "ios" ? 834 : 834),
        position: "absolute",
        // top: pxToDp(-60),
        left: pxToDp(-100),
        zIndex: 9,
    },
});
export default AiTalkModal;
