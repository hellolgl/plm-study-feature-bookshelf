import React, { useState, useCallback, useEffect } from "react";

import {
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { appFont, appStyle } from "../../theme";
import { pxToDp } from "../../util/tools";
import _ from "lodash";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import Tts from "react-native-tts";

function AiTalk(props) {
    const { messages, canSend, sessionId, stemInfo } = useSelector(
        (state) => state.toJS().aiTalk
    );
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: "aiTalk/getData" });
    }, []);

    const onSend = useCallback(() => {
        console.log("发送的消息：：：：：", text);
        if (!text) return;
        dispatch({
            type: "aiTalk/setMessages",
            data: {
                message: {
                    content: text,
                    role: "user",
                },
            },
        });
        dispatch({
            type: "aiTalk/setMessages",
            data: {
                message: {
                    content: "...",
                    role: "bot",
                },
            },
        });
        dispatch({
            type: "aiTalk/setCanSend",
            data: false,
        });
        const data = _.cloneDeep(stemInfo);
        data["session_id"] = sessionId;
        data["content"] = text;
        axios.get(api.aiChatAnswer, { params: data }).then((res) => {
            const d = res.data;
            const { data } = d;
            dispatch({ type: "aiTalk/deleteWaitingStatus" });
            dispatch({
                type: "aiTalk/setMessages",
                data: {
                    message: {
                        content: data.content,
                        role: "bot",
                    },
                },
            });
        });
        setText(null);
    }, [text]);

    const selectAnswer = (value) => {
        // console.log("选择::::::", value);
        setText(value);
    };

    const renderMessage = (props) => {
        return (
            <Message
                {...props}
                defaultBubble={false}
                selectAnswer={selectAnswer}
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
                        value={text}
                        style={[styles.input]}
                        placeholder="请输入你的内容"
                        placeholderTextColor={"#E4E4F0"}
                    ></TextInput>
                    <TouchableOpacity onPress={onSend}>
                        <Image
                            resizeMode="stretch"
                            style={[{ width: pxToDp(114), height: pxToDp(114) }]}
                            source={
                                text && canSend
                                    ? require("../../images/aiGiveExercise/send_btn_1.png")
                                    : require("../../images/aiGiveExercise/send_btn_1_gray.png")
                            }
                        ></Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    console.log("message: ", messages);
    return (
        <GiftedChat
            messages={messages}
            renderMessage={renderMessage}
            onSend={(messages) => onSend(messages)}
            renderInputToolbar={renderInputToolbar}
            user={{
                _id: 2,
            }}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginRight: pxToDp(20),
        width: pxToDp(1602),
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
});

export default AiTalk;
