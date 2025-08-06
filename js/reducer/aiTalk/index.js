import { fromJS } from "immutable";

const defaultState = fromJS({
    messages: [],
    canSend: true,
    stemInfo: {},
    sessionId: 0,
    playText: ''
});

const getRoleId = (role) => (role === "bot" ? 1 : 2);

export default (state = defaultState, action) => {
    let messageData = [];
    let newMessages = [];
    switch (action.type) {
        case "aiTalk/getData":
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
                },
            ];
            return state.merge({
                messages: messageData,
                canSend: false
            });
        case "aiTalk/setMessages":
            const { message } = action.data;
            const { role, content } = message;
            messageData = {
                _id: Math.random().toString(36).substring(7),
                text: content,
                createdAt: new Date(),
                user: {
                    // _id: action.data === "..." ? 1 : 2,
                    _id: getRoleId(role),
                },
            };
            let msgs = JSON.parse(JSON.stringify(state.toJS().messages));
            msgs.unshift(messageData);
            return state.merge({
                messages: msgs,
                canSend: true
            });
        case "aiTalk/setCanSend":
            return state.merge({
                canSend: action.data,
            });
        case "aiTalk/deleteWaitingStatus":
            const messages = state.toJS().messages.filter((m) => m["text"] !== "...");
            return state.merge({
                messages,
            });
        case "aiTalk/saveStemInfo":
            const { sessionId, stemInfo } = action.data;
            console.log("update session id: ", sessionId);
            return state.merge({
                sessionId,
                stemInfo,
            });
        case "aiTalk/setPlayText":
            return state.merge({
                playText: action.data,
            });
        default:
            return state;
    }
};
