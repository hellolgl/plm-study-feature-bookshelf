import React, { useState, useCallback, useEffect } from "react";

import {
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Text,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { appFont, appStyle } from "../../../../../../theme";
import { pxToDp } from "../../../../../../util/tools";
import Tts from "react-native-tts";
import _ from "lodash";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import axiosOld from "axios";

let source = null;

function AiTalk(props) {
    const { messages, canSend, stem_id, subject, stemInfo } = useSelector(
        (state) => state.toJS().knowAiTalk
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);

    const [text, setText] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        // dispatch({ type: "knowAiTalk/getData" });
        console.log("数据记录", messages);
        return () => {
            source && source.cancel("组件卸载,取消请求");
        };
    }, []);

    const onSend = useCallback(
        (exercise) => {
            console.log("发送的消息：：：：：", text);
            if (!text || !canSend) return;
            // if (!text) return;
            dispatch({
                type: "knowAiTalk/setMessages",
                data: {
                    message: {
                        content: text,
                        role: "user",
                        exercise: {},
                    },
                },
            });
            dispatch({
                type: "knowAiTalk/setMessages",
                data: {
                    message: {
                        content: "...",
                        role: "bot",
                        exercise: {},
                    },
                },
            });
            dispatch({
                type: "knowAiTalk/setCanSend",
                data: false,
            });
            // const data = _.cloneDeep(stemInfo);
            let data = {};
            let sendUrl = "";
            if (subject === "chinese") {
                const { answer, inspect, tag, id } = exercise;
                console.log("-----------", stemInfo, text, answer);
                let grade_term = currentUserInfo.checkGrade + currentUserInfo.checkTeam;
                data = {
                    id,
                    choice_content: text,
                    correct: text === answer ? 1 : 0,
                    inspect,
                    tag: tag,
                    name: "句型训练",
                    pName: "智能造句",
                    grade_term,
                };
                sendUrl = api.getChineseSentenceAiExercise;
            } else {
                data["stem_id"] = exercise.stem_id;
                data["answer"] = text;
                data["g_h_id"] = props.g_h_id;
                sendUrl = api.getMathGraphKnowAiTalk;
            }

            // data["correct"] = text;
            console.log("数据", stem_id, data);
            source = axiosOld.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
            const cancelToken = source.token;
            axios
                .post(sendUrl, data, { cancelToken })
                .then((res) => {
                    const d = res.data;
                    console.log("数据-----", d);
                    const { data } = d;
                    if (subject === "chinese") {
                        setChineseMsg(data);
                    } else {
                        setMathMsg(data);
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
            setText(null);
        },
        [text]
    );
    const setMathMsg = (data) => {
        const { question, stem_id, answer, status } = data;
        const rawStemInfo = _.cloneDeep(data);
        dispatch({ type: "knowAiTalk/setknowStatus", data: status });
        dispatch({
            type: "knowAiTalk/saveStemInfo",
            data: {
                stem_id: stem_id,
                stemInfo: rawStemInfo,
            },
        });
        dispatch({ type: "knowAiTalk/deleteWaitingStatus" });
        dispatch({
            type: "knowAiTalk/setMessages",
            data: {
                message: {
                    content: `${answer}\n\n${question}`,
                    role: "bot",
                    exercise: data,
                },
            },
        });
    };
    const setChineseMsg = (data) => {
        const { question, id, pre_explanation, status } = data;
        const rawStemInfo = _.cloneDeep(data);
        dispatch({ type: "knowAiTalk/setknowStatus", data: status });
        dispatch({
            type: "knowAiTalk/saveStemInfo",
            data: {
                stem_id: id,
                stemInfo: rawStemInfo,
            },
        });
        dispatch({ type: "knowAiTalk/deleteWaitingStatus" });
        dispatch({
            type: "knowAiTalk/setMessages",
            data: {
                message: {
                    content: `${pre_explanation}\n\n${question}`,
                    role: "bot",
                    exercise: data,
                },
            },
        });
    };
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
                onSend={onSend}
            ></Message>
        );
    };

    const onInputChange = (value) => {
        setText(value);
    };

    const renderInputToolbar = (props) => {
        return (
            <View style={[appStyle.flexCenter]}>
                {/* <View style={[appStyle.flexLine]}>

          <View style={[styles.input]}>
            <TouchableOpacity>
              <Text>1123</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onSend}>
            <Image
              resizeMode="stretch"
              style={[{ width: pxToDp(114), height: pxToDp(114) }]}
              source={
                text
                  ? require("../../../../../../images/aiGiveExercise/send_btn_1.png")
                  : require("../../../../../../images/aiGiveExercise/send_btn_1_gray.png")
              }
            ></Image>
          </TouchableOpacity>
        </View> */}
            </View>
        );
    };
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
