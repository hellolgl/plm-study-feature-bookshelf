import _ from "lodash";
import axios from "../../util/http/axios";
import api from "../../util/http/api";

export const getData = (data) => {
    return {
        type: "knowAiTalk/getData",
        data,
    };
};
export const setMessages = (data) => {
    return {
        type: "knowAiTalk/setMessages",
        data,
    };
};
export const setCanSend = (data) => {
    return {
        type: "knowAiTalk/setCanSend",
        data,
    };
};
export const chat = (data, cancelToken) => {
    console.log("rrrrr: ", data);
    const rawStemInfo = _.cloneDeep(data);
    return (dispatch) => {
        axios
            .post(api.getMathGraphKnowAiTalk, data, { cancelToken })
            .then((res) => {
                const { question, stem_id, status } = res.data.data;
                console.log("第一个请求", res.data);
                dispatch({
                    type: "knowAiTalk/saveStemInfo",
                    data: {
                        stem_id: stem_id,
                        stemInfo: rawStemInfo,
                    },
                });
                dispatch({ type: "knowAiTalk/deleteWaitingStatus" });
                dispatch({ type: "knowAiTalk/setknowStatus", data: status });
                dispatch({
                    type: "knowAiTalk/setMessages",
                    data: {
                        message: {
                            content: question,
                            role: "bot",
                            exercise: res.data.data,
                        },
                    },
                });
            })
            .catch((err) => console.log("err", err));
    };
};
export const setPlayText = (data) => {
    return {
        type: "knowAiTalk/setPlayText",
        data,
    };
};

export const setknowStatus = (data) => {
    return {
        type: "knowAiTalk/setknowStatus",
        data,
    };
};

export const chineseFirst = (data, cancelToken) => {
    console.log("rrrrr: ", data);
    const rawStemInfo = _.cloneDeep(data);
    return (dispatch) => {
        axios
            .post(api.getChineseSentenceAiExerciseFirst, data, { cancelToken })
            .then((res) => {
                const { question, id } = res.data.data;
                console.log("第一个请求", res.data);
                dispatch({
                    type: "knowAiTalk/saveStemInfo",
                    data: {
                        stem_id: id,
                        stemInfo: res.data.data,
                    },
                });
                dispatch({ type: "knowAiTalk/deleteWaitingStatus" });
                dispatch({
                    type: "knowAiTalk/setMessages",
                    data: {
                        message: {
                            content: question,
                            role: "bot",
                            exercise: res.data.data,
                        },
                    },
                });
            })
            .catch((error) => {
                console.log("error", error);
            });
    };
};
