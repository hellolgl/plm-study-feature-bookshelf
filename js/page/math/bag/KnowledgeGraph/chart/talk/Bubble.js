import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import { pxToDp, size_tool } from "../../../../../../util/tools";
import { appFont, appStyle } from "../../../../../../theme";
import { useSelector, useDispatch } from "react-redux";
import Lottie from "lottie-react-native";
import PlayIcon from "../../../../../../component/PlayIcon";
import TtsPlayAudio from '../../../../../../component/TtsPlayAudio'

const CHIOCE_MAP = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
};

function Bubble(props) {
    const {
        currentMessage,
        isSameUser,
        isSameDay,
        previousMessage,
        selectAnswer,
        onSend,
    } = props;
    const { text, user, exercise, noClick } = currentMessage;
    const { option, answer_list, id, stem_id: mathId } = exercise;

    const { subject, stem_id } = useSelector(
        (state) => state.toJS().knowAiTalk
    );
    const { playText } = useSelector(
        (state) => state.toJS().aiTalk,
    );
    const [choiceIndex, setChoiceIndex] = useState(-1);
    const [canSubmit, setcanSubmit] = useState(
        subject === "chinese" ? stem_id === id : mathId === stem_id
    );

    useEffect(() => {
        // console.log("currentMessage", currentMessage);
        setcanSubmit(subject === "chinese" ? stem_id === id : mathId === stem_id);
    }, [stem_id]);

    const isValidJson = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (error) {
            return false;
        }
    };
    const isUser = user._id === 2;
    const isTopic = user._id !== 2;
    // const isTopic = false;
    const showLoading = text === "...";
    //   if(isValidJson(text)){
    //     console.log('fffff',text)
    //     console.log('gggg',JSON.parse(text))
    //   }

    // console.log('fffff',props)
    // console.log('isSameUser:::::',isSameUser(currentMessage, previousMessage))
    // console.log('isSameDay:::::',isSameDay(currentMessage, previousMessage))
    const select = (i, x) => {
        if (canSubmit && !noClick) {
            setChoiceIndex(x);
            selectAnswer(i);
        }
    };

    const onSure = () => {
        if (choiceIndex !== -1 && canSubmit && !noClick) {
            onSend(exercise);
            setcanSubmit(false);
        }
        // choiceIndex !== -1 && onSend();
        // choiceIndex !== -1 && setcanSubmit(false)
    };
    const renderSystemContent = () => {
        return showLoading ? (
            <View style={[styles.bubbleTopicWrap]}>
                <View style={[styles.loadingWrap]}>
                    <Lottie
                        source={{
                            uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-story-loading.json",
                        }}
                        // source={require("../../../../../../res/json/fire.json")}
                        autoPlay
                        loop={true}
                        style={[
                            {
                                width: pxToDp(100),
                                height: pxToDp(100),
                            },
                        ]}
                    />
                    <Text
                        style={[
                            { color: "#fff", fontSize: pxToDp(37), lineHeight: pxToDp(40) },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        生成中，请耐心等待哦～
                    </Text>
                </View>
            </View>
        ) : (
            <View style={[styles.bubbleTopicWrap]}>
                {subject === "chinese" ? renderChineseSentence() : renderMathKnow()}
                {canSubmit && !noClick ? (
                    <View style={[styles.submitWrap]}>
                        <View style={[styles.btnWrap]}>
                            <TouchableOpacity onPress={onSure} style={[styles.btnbg]}>
                                <View style={[styles.btnInner]}>
                                    <Text
                                        style={[
                                            appFont.fontFamily_jcyt_700,
                                            {
                                                fontSize: pxToDp(30),
                                                color: "#fff",
                                                lineHeight: pxToDp(30),
                                            },
                                        ]}
                                    >
                                        提交
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    };
    const renderMathKnow = () => {
        return (
            <>
                <View style={[styles.stemWrap]}>
                    <TtsPlayAudio emit={true} text={text}>
                        <View style={[appStyle.flexLine]}>
                            {renderLoading()}
                            <Text
                                style={[
                                    { color: "#fff", fontSize: pxToDp(37), width: "93%" },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {text.replaceAll("*", "×")}
                            </Text>
                        </View>
                    </TtsPlayAudio>

                </View>
                <View
                    style={[
                        styles.ChoiceWrap,
                        appStyle.flexLine,
                        appStyle.flexLineWrap,
                        appStyle.flexJusBetween,
                    ]}
                >
                    {option &&
                        option.map((i, x) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.item,
                                        choiceIndex === x ? { borderColor: "#FFA656" } : null,
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        select(i, x);
                                    }}
                                >
                                    <View style={[styles.itemInner]}>
                                        <View style={[styles.itemInnerInner]}>
                                            <View style={[styles.itemChoice]}>
                                                <Text
                                                    style={[
                                                        { color: "#475266", fontSize: pxToDp(37) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {CHIOCE_MAP[x]}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    { color: "#475266", fontSize: pxToDp(33) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {i}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </>
        );
    };
    const renderChineseSentence = () => {
        return (
            <>
                <View style={[styles.stemWrap]}>
                    <TtsPlayAudio emit={true} text={text}>
                        <View style={[appStyle.flexLine]}>
                            {renderLoading()}
                            <Text
                                style={[
                                    { color: "#fff", fontSize: pxToDp(37), width: "93%" },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {text.replaceAll("*", "×")}
                            </Text>
                        </View>
                    </TtsPlayAudio>

                </View>
                <View
                    style={[
                        styles.ChoiceWrap,
                        appStyle.flexLine,
                        appStyle.flexLineWrap,
                        appStyle.flexJusBetween,
                    ]}
                >
                    {answer_list &&
                        answer_list.map((i, x) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.item,
                                        choiceIndex === x ? { borderColor: "#FFA656" } : null,
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        select(i, x);
                                    }}
                                >
                                    <View style={[styles.itemInner]}>
                                        <View style={[styles.itemInnerInner]}>
                                            <View style={[styles.itemChoice]}>
                                                <Text
                                                    style={[
                                                        { color: "#475266", fontSize: pxToDp(37) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {CHIOCE_MAP[x]}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    { color: "#475266", fontSize: pxToDp(33), flex: 1 },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {i}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </>
        );
    };
    const renderLoading = () => {
        if (isUser || showLoading) return null;
        // let img = require("../../../../../../images/aiGiveExercise/play_btn_1.png");
        // if (playing)
        //   img = require("../../../../../../images/aiGiveExercise/pause_btn_1.png");
        return text === playText ? (
            <Lottie
                source={{
                    uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-audio-playing.json",
                }}
                style={styles.audioBtn}
            />
        ) : (
            <Image
                style={styles.audioBtn}
                resizeMode="stretch"
                source={require("../../../../../../images/custom/audio_btn_1.png")}
            />
        );
    };

    return !isTopic ? (
        <TtsPlayAudio disablePlay={isUser || showLoading} text={text} emit={true}>
            <TouchableOpacity
                style={[
                    styles.bubbleWrap,
                    isUser
                        ? { ...appStyle.flexTopLine, ...appStyle.flexAliCenter }
                        : appStyle.flexLine,
                    { backgroundColor: isUser ? "#61D1BF" : "#10131F" },
                    isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                ]}
            >
                {renderLoading()}
                {showLoading ? (
                    <Lottie
                        source={require("../../../../../../component/AiTalk/lottie/loading.json")}
                        autoPlay
                        style={[
                            { width: pxToDp(80), height: pxToDp(70), marginTop: pxToDp(-5) },
                        ]}
                    />
                ) : (
                    <Text
                        style={[
                            {
                                color: isUser ? "#22294D" : "#FFF",
                                fontSize: pxToDp(37),
                                maxWidth: Platform.OS === "android" ? pxToDp(1580) : pxToDp(1610),
                            },
                            appFont.fontFamily_jcyt_500,
                        ]}
                    >
                        {text}
                    </Text>
                )}
            </TouchableOpacity>
        </TtsPlayAudio>

    ) : (
        renderSystemContent()
    );
}
const styles = StyleSheet.create({
    bubbleWrap: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(70),
        minHeight: pxToDp(120),
        minWidth: pxToDp(200),
        // shadowColor: "#000000",
        // shadowOffset: {
        //   width: pxToDp(0),
        //   height: pxToDp(4),
        // },
        // shadowOpacity: 0.15,
        // elevation: 3,
        borderWidth: pxToDp(2),
        borderColor: "#00B295",
    },
    bubbleTopicWrap: {
        flex: 1,
        marginBottom: pxToDp(20),
    },
    stemWrap: {
        backgroundColor: "#10131F",
        paddingTop: pxToDp(30),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderTopRightRadius: pxToDp(70),
        paddingBottom: pxToDp(90),
        borderWidth: pxToDp(2),
        borderColor: "#61D1BF",
    },
    item: {
        // width: pxToDp(680),
        width: "49%",
        borderWidth: pxToDp(5),
        // borderColor:'#FFA656',
        borderColor: "transparent",
        borderRadius: pxToDp(30),
        marginBottom: pxToDp(30),
        padding: pxToDp(5),
    },
    itemInner: {
        backgroundColor: "#E4E4F0",
        borderRadius: pxToDp(30),
        minHeight: pxToDp(124),
        paddingBottom: pxToDp(5),
    },
    itemInnerInner: {
        flex: 1,
        backgroundColor: "#F5F5FA",
        borderRadius: pxToDp(30),
        paddingLeft: pxToDp(24),
        ...appStyle.flexLine,
        // backgroundColor:"red"
    },
    itemChoice: {
        width: pxToDp(60),
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        backgroundColor: "#fff",
        ...appStyle.flexCenter,
        marginRight: pxToDp(32),
    },
    ChoiceWrap: {
        backgroundColor: "#363C53",
        borderRadius: pxToDp(60),
        // borderBottomRightRadius: 0,
        padding: pxToDp(46),
        marginTop: pxToDp(-60),
        paddingBottom: pxToDp(70),
    },
    submitWrap: {
        width: "100%",
        height: pxToDp(80),
        alignItems: "flex-end",
    },
    btnWrap: {
        ...size_tool(150, 160),
        backgroundColor: "#363C53",
        borderBottomLeftRadius: pxToDp(75),
        borderBottomRightRadius: pxToDp(75),
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        top: pxToDp(-70),
        paddingBottom: pxToDp(20),
    },
    btnbg: {
        ...size_tool(108),
        borderRadius: pxToDp(54),
        backgroundColor: "#00A884",
        paddingBottom: pxToDp(5),
    },
    btnInner: {
        flex: 1,
        borderRadius: pxToDp(54),
        backgroundColor: "#00C288",
        justifyContent: "center",
        alignItems: "center",
    },
    audioBtn: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginRight: pxToDp(10),
    },
    loadingWrap: {
        borderRadius: pxToDp(70),
        borderTopLeftRadius: pxToDp(0),
        height: pxToDp(140),
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        padding: pxToDp(0),
        backgroundColor: "#10131F",
        borderWidth: pxToDp(2),
        borderColor: "#61D1BF",
        paddingLeft: pxToDp(60),
    },
});
export default Bubble;
