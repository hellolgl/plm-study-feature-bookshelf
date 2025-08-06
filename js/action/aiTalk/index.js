import _ from "lodash";
import axios from "../../util/http/axios";
import api from "../../util/http/api";

export const getData = (data) => {
    return {
        type: "aiTalk/getData",
        data,
    };
};
export const setMessages = (data) => {
    return {
        type: "aiTalk/setMessages",
        data,
    };
};
export const setCanSend = (data) => {
    return {
        type: "aiTalk/setCanSend",
        data,
    };
};
export const chat = (data) => {
    console.log("rrrrr: ", data);
    const rawStemInfo = _.cloneDeep(data);
    return (dispatch) => {
        axios.get(api.aiChatAnswer, { params: data }).then((res) => {
            const { content, session_id } = res.data.data;
            dispatch({
                type: "aiTalk/saveStemInfo",
                data: {
                    sessionId: session_id,
                    stemInfo: rawStemInfo,
                },
            });
            dispatch({ type: "aiTalk/deleteWaitingStatus" });
            dispatch({
                type: "aiTalk/setMessages",
                data: {
                    message: {
                        content: content,
                        role: "bot",
                    },
                },
            });
        });
    };
};
export const setPlayText = (data) => {
    return {
        type: "aiTalk/setPlayText",
        data,
    };
};
