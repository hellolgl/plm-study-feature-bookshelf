import Tts from "react-native-tts";

export const setTtsStatus = (data) => {
    return (dispatch) => {
    async function init() {
        Tts.setDefaultLanguage("zh-CN");
    }
    Tts.getInitStatus().then(
        (initStatus) => {
            if (initStatus === "success" || (Platform.OS === "ios" && initStatus)) {
                console.log("Text-to-Speech is available.");
                dispatch({ type: "tts/setStatusData", data:{canUse:true,msg:''}});
                init();
            } else {
                dispatch({ type: "tts/setStatusData", data:{canUse:false,msg:'该设备不支持Tts(文字转语音功能)'}});
                console.log("该设备不支持Text to Speech");
            }
        },
        () => {
            dispatch({ type: "tts/setStatusData", data:{canUse:false,msg:`播放失败！请检查本设备是否带有文字转语音输出的tts引擎，若没有，还需您手动去下载并安装tts引擎。\n查看步骤：设置→通用设置→语言和输入法→文字转语音输出→首选引擎。`}});
            console.log("该设备没有Tts引擎，请自主下载。");
        }
    );
  };
};

export const setShowTips = (data) => {
    return {
        type: 'tts/setShowTips',
        data
    };
}

