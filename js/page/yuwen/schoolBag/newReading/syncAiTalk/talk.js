import React, { useState, useCallback, useEffect, useRef } from "react";

import {
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Text,
    AppState,
    DeviceEventEmitter
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useSelector, useDispatch } from "react-redux";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../../../../util/tools";
import Tts from "react-native-tts";
import _ from "lodash";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import { Avatar, Day, utils, Bubble } from "react-native-gifted-chat";
const { isSameUser, isSameDay } = utils;
import Lottie from "lottie-react-native";
import MarkdownView from "../../../../../component/markdownView";
import { setShowTips } from '../../../../../action/tts'
import TtsPlayAudio from '../../../../../component/TtsPlayAudio'


function MyBubble(props) {
    const {
        currentMessage,
        myBubbleTxtViewStyle,
        myBubbleUserViewStyle,
        gptAvatar,
    } = props;
    const { text, user } = currentMessage;
    const renderLottie = text === "...";
    const { playText } = useSelector(
        (state) => state.toJS().aiTalk,
    );
    const isPhone = !getIsTablet();
    // let styles = stylesTablet
    // if(isPhone) styles = stylesHandset
    const isUser = user._id === 2;


    const renderTtsBtn = () => {
        if (isUser || renderLottie) return null;
        let img = require("../../../../../images/aiGiveExercise/play_btn_1.png");
        if (playText === text)
            img = require("../../../../../images/aiGiveExercise/pause_btn_1.png");
        return (
            <Image
                style={[
                    { width: pxToDp(89), height: pxToDp(85), marginRight: pxToDp(20) },
                ]}
                source={img}
            ></Image>
        );
    };
    return (
        <TtsPlayAudio disablePlay={isUser || renderLottie} text={text}>
            <View
                style={[
                    styles.bubbleWrap,
                    isUser
                        ? { ...appStyle.flexTopLine, ...appStyle.flexAliCenter }
                        : appStyle.flexLine,
                    { backgroundColor: isUser ? "#00B295" : "#fff" },
                    myBubbleUserViewStyle && isUser ? myBubbleUserViewStyle : null,
                    isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                ]}
            >
                {renderTtsBtn()}
                {renderLottie ? (
                    <Lottie
                        source={require("../../../../../component/AiTalk/lottie/loading.json")}
                        autoPlay
                        style={[
                            { width: pxToDp(80), height: pxToDp(70), marginTop: pxToDp(-5) },
                        ]}
                    />
                ) : isUser ? (
                    <Text
                        style={[
                            {
                                color: isUser ? "#fff" : "#4C4C59",
                                fontSize: pxToDp(37),
                                maxWidth: isPhone ? pxToDpWidthLs(800) : pxToDp(1200),
                            },
                            myBubbleTxtViewStyle ? myBubbleTxtViewStyle : null,
                            appFont.fontFamily_jcyt_500,
                        ]}
                    >
                        {text}
                    </Text>
                ) : (
                    <View
                        style={[
                            { maxWidth: isPhone ? pxToDpWidthLs(800) : pxToDp(1200) },
                            myBubbleTxtViewStyle ? myBubbleTxtViewStyle : null,
                        ]}
                    >
                        <MarkdownView
                            textStyle={[
                                isPhone
                                    ? { fontSize: pxToDpWidthLs(28) }
                                    : { fontSize: pxToDp(37), lineHeight: pxToDp(42) },
                                { color: "#4C4C59" },
                            ]}
                            value={text}
                        ></MarkdownView>
                    </View>
                )}
            </View>
        </TtsPlayAudio>

    );
}

function Message(props) {
    const {
        currentMessage,
        renderDay,
        nextMessage,
        renderAvatar,
        defaultBubble,
        myBubbleTxtViewStyle,
        myBubbleUserViewStyle,
        gptAvatar,
    } = props;
    const { text, user } = currentMessage;
    const { avatar } = useSelector((state) => state.toJS().userInfo);
    const role = user._id === 1 ? "gpt" : "user";
    const isPhone = !getIsTablet();
    // let styles = stylesTablet
    // let styles = stylesTablet
    // if(isPhone) styles = stylesHandset
    const getInnerComponentProps = () => {
        return {
            ...props,
            isSameUser,
            isSameDay,
            //   position:'right'
        };
    };
    const renderMyAvatar = (role) => {
        const roleAvatarMap = {
            user: avatar,
            gpt: gptAvatar
                ? gptAvatar
                : require("../../../../../images/square/gpt_avatar.png"),
        };
        return (
            <Image
                resizeMode="stretch"
                style={[
                    isPhone
                        ? { width: pxToDpWidthLs(90), height: pxToDpWidthLs(90) }
                        : { width: pxToDp(102), height: pxToDp(98) },
                ]}
                source={roleAvatarMap[role]}
            ></Image>
        );
    };

    const renderMyBubble = () => {
        const bubbleProps = getInnerComponentProps();
        if (!defaultBubble) {
            return (
                <MyBubble
                    {...bubbleProps}
                    myBubbleTxtViewStyle={myBubbleTxtViewStyle}
                    myBubbleUserViewStyle={myBubbleUserViewStyle}
                ></MyBubble>
            );
        }
        return <Bubble {...bubbleProps} />;
    };
    const marginBottom = isSameUser(currentMessage, nextMessage)
        ? pxToDp(30)
        : pxToDp(30);
    return (
        <View>
            <View
                style={[
                    user._id === 2 ? appStyle.flexEnd : null,
                    appStyle.flexTopLine,
                    { marginBottom },
                    role === "user" ? { marginRight: pxToDpWidthLs(50) } : null,
                ]}
            >
                {role === "gpt" ? (
                    <View style={{ marginRight: pxToDp(20), marginLeft: pxToDp(30) }}>
                        {renderMyAvatar(role)}
                    </View>
                ) : null}
                {renderMyBubble()}
            </View>
        </View>
    );
}

function SyncTalk({
    inputToolbarStyle,
    myBubbleTxtViewStyle,
    myBubbleUserViewStyle,
    gptAvatar,
    exercise_id,
}) {
    const { homeSelectItem, messages, canSend, chatLoading, sessionId } =
        useSelector((state) => state.toJS().square);
    const { squareType } = useSelector((state) => state.toJS().userInfo);
    const [text, setText] = useState("");
    const [send, setSend] = useState();
    const dispatch = useDispatch();
    const isPhone = !getIsTablet();
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);
        const fetchData = async () => {
            if (!messages.length) {
                // dispatch({
                //   type: "square/setMessages",
                //   data: {
                //     message: {
                //       content: homeSelectItem.title,
                //       role: "user",
                //     },
                //   },
                // });
                // dispatch({
                //     type: "square/setMessages",
                //     data: {
                //         message: {
                //             content: "...",
                //             role: "bot",
                //         },
                //     },
                // });
                dispatch({
                    type: "square/setCanSend",
                    data: false,
                });
                const data = { exercise_id };
                if (chatLoading === false) {
                    const history_res = await axios.post(api.getSyncAIBotHistory, data);
                    const record_data = history_res.data.data;
                    if (record_data.length) {
                        record_data.forEach((item, index) => {
                            dispatch({
                                type: "square/setMessages",
                                data: {
                                    message: item,
                                },
                            });
                        });
                        dispatch({
                            type: "square/setMessages",
                            data: {
                                message: {
                                    content: "...",
                                    role: "bot",
                                },
                            },
                        });
                    } else {
                        dispatch({
                            type: "square/setMessages",
                            data: {
                                message: {
                                    content: "...",
                                    role: "bot",
                                },
                            },
                        });
                    }
                    // dispatch({
                    //     type: "square/setLoading",
                    //     data: true,
                    // });
                    try {
                        const res = await axios.post(api.getSyncReadingAIHelp, data);
                        const { content, session_id } = res.data.data;
                        dispatch({ type: "square/deleteWaitingStatus" });
                        dispatch({
                            type: "square/setMessages",
                            data: {
                                message: {
                                    content,
                                    role: "bot",
                                },
                            },
                        });
                        dispatch({
                            type: "square/setCanSend",
                            data: true,
                        });
                        dispatch({
                            type: "square/setSessionId",
                            data: session_id,
                        });
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    } finally {
                        dispatch({
                            type: "square/setLoading",
                            data: false,
                        });
                    }
                }
            }
        };
        fetchData();
        return () => {
            Tts.stop();
            AppState.removeEventListener("change", handleAppStateChange);
            dispatch({
                type: "square/setLoading",
                data: false,
            });
            dispatch({
                type: "square/initMessages",
            });
            dispatch({
                type: "square/setCanSend",
                data: false,
            });
        };
    }, []);

    const handleAppStateChange = (nextAppState) => {
        if (appState === "active" && nextAppState.match(/inactive|background/)) {
            Tts.stop();
            dispatch({
                type: "audio/setPlayingAudio",
                data: "",
            });
        }
    };

    const onSend = async () => {
        // console.log("发送的消息：：：：：", text);
        if (!text || !canSend) return;
        setSend(true);
        dispatch({
            type: "square/setMessages",
            data: {
                message: {
                    content: text,
                    role: "user",
                },
            },
        });
        dispatch({
            type: "square/setMessages",
            data: {
                message: {
                    content: "...",
                    role: "bot",
                },
            },
        });
        dispatch({
            type: "square/setCanSend",
            data: false,
        });
        if (chatLoading === false) {
            const data = {
                content: text,
                session_id: sessionId,
                exercise_id,
            };
            try {
                const res = await axios.post(api.getSyncReadingAIHelp, data);
                const { content } = res.data.data;
                dispatch({ type: "square/deleteWaitingStatus" });
                console.log("content: ", content);
                if (!content) {
                    dispatch({
                        type: "square/setMessages",
                        data: {
                            message: {
                                content: "本次AI对话次数达到上限,对话结束～",
                                role: "bot",
                            },
                        },
                    });
                    dispatch({
                        type: "square/setCanSend",
                        data: false,
                    });
                } else {
                    dispatch({
                        type: "square/setMessages",
                        data: {
                            message: {
                                content: content,
                                role: "bot",
                            },
                        },
                    });
                    dispatch({
                        type: "square/setCanSend",
                        data: true,
                    });
                }
                setText("");
                setSend(false);
                dispatch({
                    type: "square/setLoading",
                    data: false,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                dispatch({
                    type: "square/setLoading",
                    data: false,
                });
            }
        }
    };

    const renderMessage = (props) => {
        return (
            <Message
                {...props}
                myBubbleTxtViewStyle={myBubbleTxtViewStyle}
                myBubbleUserViewStyle={myBubbleUserViewStyle}
                gptAvatar={gptAvatar}
                defaultBubble={false}
            ></Message>
        );
    };

    const onInputChange = (value) => {
        setText(value);
    };

    const renderInputToolbar = (props) => {
        return (
            <View style={[appStyle.flexCenter]}>
                <View style={[appStyle.flexLine]}>
                    <TextInput
                        editable={canSend}
                        onChangeText={onInputChange}
                        value={send ? "" : text}
                        style={[
                            styles.input,
                            isPhone
                                ? { width: pxToDpWidthLs(1000), fontSize: pxToDpWidthLs(28) }
                                : null,
                            inputToolbarStyle ? inputToolbarStyle : null,
                        ]}
                        placeholder="请输入你的内容"
                        placeholderTextColor={"#E4E4F0"}
                    ></TextInput>
                    <TouchableOpacity onPress={onSend}>
                        <Image
                            resizeMode="stretch"
                            style={[{ width: pxToDp(114), height: pxToDp(114) }]}
                            source={
                                text && canSend
                                    ? require("../../../../../images/square/send_btn_1.png")
                                    : require("../../../../../images/aiGiveExercise/send_btn_1_gray.png")
                            }
                        ></Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <>
            <GiftedChat
                messages={messages}
                renderMessage={renderMessage}
                onSend={(messages) => onSend(messages)}
                renderInputToolbar={renderInputToolbar}
                user={{
                    _id: 2,
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        marginRight: pxToDp(20),
        width: pxToDp(1400),
        height: pxToDp(102),
        borderRadius: pxToDp(50),
        backgroundColor: "#FAFAFF",
        paddingLeft: pxToDp(50),
        fontSize: pxToDp(42),
        ...appFont.fontFamily_jcyt_700,
        color: "#4C4C59",
        borderWidth: pxToDp(2),
        borderColor: "#D8D8E3",
        ...appStyle.flexJusCenter,
    },
    bubbleWrap: {
        paddingBottom: pxToDp(20),
        paddingTop: pxToDp(20),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(70),
        minHeight: pxToDp(120),
        minWidth: pxToDp(200),
    },
});

export default SyncTalk;
