import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform,
} from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import {
    pxToDp,
} from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import * as _ from "lodash";
import RichShowViewHtml from "../../../../../component/math/RichShowViewHtml";
import Lottie from "lottie-react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Tts from "react-native-tts";
import { setShowTips } from '../../../../../action/tts'
const Explain = ({
    closeMe,
    visible,
    knowledge_explain,
    navigation,
    knowledge,
    btn,
    isRich
}) => {
    // const { knowledge_code } = knowledge;
    const dispatch = useDispatch()
    const { statusData } = useSelector(
        (state) => state.toJS().tts
    );
    const [playing, setplaying] = useState(false);

    useEffect(() => {
        return () => stopTts();
    }, []);
    const stopTts = () => {
        Tts.stop();
        setplaying(false);
    };
    useEffect(() => {
        if (!visible) {
            stopTts();
        }
    }, [visible]);
    const togglePlaying = () => {
        if (!statusData.canUse) {
            dispatch(setShowTips(true))
            return
        }
        const ttsContent = stripAndInsert(knowledge_explain);
        if (!playing && ttsContent !== "") {
            Tts.speak(ttsContent);
        } else {
            Tts.stop();
        }
        setplaying((e) => !e);
    };
    const stripAndInsert = (html) => {
        console.log("html: ", html);
        if (_.isEmpty(html)) {
            return "";
        }
        let result = html.replace(/\+/g, "加");
        result = result.replace(/-/g, "减");
        result = result.replace(/\*/g, "乘");
        result = result.replace(/×/g, "乘");
        result = result.replace(/x/g, "乘");
        result = result.replace(/\//g, "除");
        result = result.replace(/÷/g, "除");
        result = result.replace(/=/g, "等于");
        result = result.replace(/<img[^>]+>/g, "如图所示。");
        result = result.replace(/<[^>]+>/g, "");
        result = result.replaceAll("&nbsp;", "");
        return result;
    };

    return visible ? (
        <View style={[styles.container, visible && { zIndex: 99 }]}>
            <View style={[styles.mainWrap]}>
                <TouchableOpacity
                    onPress={() => {
                        // this.togglePlaying();
                        togglePlaying();
                    }}
                    style={{
                        width: pxToDp(250),
                        height: pxToDp(250),
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: pxToDp(20),
                        // position: "absolute",
                        // zIndex: 2,
                        // left: pxToDp(30),
                    }}
                >
                    <Lottie
                        source={
                            playing
                                ? require("../lottieJson/audioPlay.json")
                                : require("../lottieJson/audioHang.json")
                        }
                        autoPlay
                        loop={true}
                        style={[{ width: pxToDp(250), height: pxToDp(250) }]}
                    />
                </TouchableOpacity>
                <ScrollView style={[{ flex: 1 }]}>
                    <View>
                        <Text style={[styles.title]}>知识点讲解:</Text>
                        {isRich ? <RichShowViewHtml
                            value={knowledge_explain}
                            fontFamily={"JiangChengYuanTi-700W"}
                            p_style={{ lineHeight: pxToDp(70) }}
                            size={36}
                            color={"#4C4C59"}
                        ></RichShowViewHtml> : <Text style={[{ color: "#4c4c59", fontSize: pxToDp(36) }, appStyle.fontFamily_jcyt_700]}>{knowledge_explain}</Text>}
                    </View>
                </ScrollView>
                <View style={[styles.allBtnWrap]}>{btn}</View>
            </View>
            <TouchableOpacity
                onPress={() => {
                    stopTts();
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
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: -1,
        paddingTop: pxToDp(160),
        paddingRight: pxToDp(60),
        paddingLeft: pxToDp(60),
    },
    mainWrap: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(60),
        borderTopRightRadius: pxToDp(60),
        padding: pxToDp(60),
        // paddingBottom: pxToDp(0),
        flexDirection: "row",
        paddingTop: pxToDp(20),
    },
    title: {
        color: "#4C4C59",
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(48),
    },
    closeBtn: {
        width: pxToDp(96),
        height: pxToDp(96),
        borderRadius: pxToDp(48),
        backgroundColor: "#F55858",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: pxToDp(120),
        right: pxToDp(40),
        zIndex: 9,
    },
    allBtnWrap: {
        justifyContent: "flex-end",
    },
});
export default Explain;
