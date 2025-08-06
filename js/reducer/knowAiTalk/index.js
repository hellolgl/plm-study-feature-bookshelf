import { fromJS } from "immutable";

const defaultState = fromJS({
    messages: [],
    canSend: true,
    stemInfo: {},
    stem_id: 0,
    playText: "",
    knowStatus: 0,
    canTts: true,
    showTtsToast: false,
    subject: "math",
});

const getRoleId = (role) => (role === "bot" ? 1 : 2);

export default (state = defaultState, action) => {
    let messageData = [];
    let newMessages = [];
    switch (action.type) {
        case "knowAiTalk/getData":
            messageData = [
                {
                    _id: 1,
                    // text: JSON.stringify(['1','2','3']) + '恩萨里放哪里放哪里发那拉氏',
                    // text: "首先，题目告诉我们苹苹、笑笑和淘淘一起拼一幅9块的拼图。然后，苹苹拼了3块，笑笑拼了2块，淘淘拼了4块。那么，请你告诉我，苹苹、笑笑和淘淘一共拼了多少块拼图？",
                    text: "...",
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                    },
                    exercise: {},
                },
            ];
            return state.merge({
                messages: messageData,
                canSend: false,
            });
        case "knowAiTalk/setMessages":
            const { message } = action.data;
            const { role, content, exercise } = message;
            messageData = {
                _id: Math.random().toString(36).substring(7),
                text: content,
                createdAt: new Date(),
                user: {
                    // _id: action.data === "..." ? 1 : 2,
                    _id: getRoleId(role),
                },
                exercise: exercise ? exercise : {},
            };
            let msgs = JSON.parse(JSON.stringify(state.toJS().messages));
            msgs.unshift(messageData);
            return state.merge({
                messages: msgs,
                canSend: true,
            });
        case "knowAiTalk/setCanSend":
            return state.merge({
                canSend: action.data,
            });
        case "knowAiTalk/deleteWaitingStatus":
            const messages = state.toJS().messages.filter((m) => m["text"] !== "...");
            return state.merge({
                messages,
            });
        case "knowAiTalk/saveStemInfo":
            const { stem_id, stemInfo } = action.data;
            console.log("update session id: ", stem_id);
            return state.merge({
                stem_id,
                stemInfo,
            });
        case "knowAiTalk/setPlayText":
            return state.merge({
                playText: action.data,
            });
        case "knowAiTalk/setknowStatus":
            return state.merge({
                knowStatus: action.data,
            });
        case "knowAiTalk/setHistoryList":
            return state.merge({
                messages: action.data,
            });
        case "knowAiTalk/setsubject":
            return state.merge({
                subject: action.data,
            });
        default:
            return state;
    }
};
