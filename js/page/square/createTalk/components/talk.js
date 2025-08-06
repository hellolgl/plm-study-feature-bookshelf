import React, { useState, useCallback, useEffect, useRef } from "react";

import {
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Text,
    Modal,
    Platform,
} from "react-native";
import { GiftedChat, utils, Bubble, Day } from "react-native-gifted-chat";
import { useSelector, useDispatch } from "react-redux";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../../../util/tools";
import _ from "lodash";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
const { isSameUser, isSameDay } = utils;
import Lottie from "lottie-react-native";
import url from "../../../../util/url";
import * as WeChat from "react-native-wechat-lib";
import PlayAudioBtn from "../../../../component/PlayAudioBtn";
import PlayIcon from "../../../../component/PlayIcon";
import EventRegister from "../../../../util/eventListener";
import { getPaiCoin } from "../../../../util/axiosMethod";
import MarkdownView from "../../../../component/markdownView";
import ShareModal from "../../../../component/ShareModal";
import MyToast from "../../../../component/myToast";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { getAllCoin } from '../../../../action/userInfo'

function MyBubble(props) {
    const { currentMessage } = props;
    const { text, user } = currentMessage;
    const renderLottie = text === "...";
    const showImages = text === "SHOW IMAGES";
    const showAudio = text === "SHOW AUDIO";
    const {
        img,
        storyImgDict,
        storyType,
        title,
        contentAudio,
        questionMap,
        checkQuestionTag,
        expandImgs,
    } = useSelector((state) => state.toJS().square);
    const { playingAudio } = useSelector((state) => state.toJS().audioStatus);
    const { squareType } = useSelector((state) => state.toJS().userInfo);
    const dispatch = useDispatch();
    const isPhone = !getIsTablet();
    const finalImgs = useRef([]);
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;
    const isUser = user._id === 2;
    let content;
    if (showAudio) {
        const uri = contentAudio;
        content = (
            <View
                style={[
                    styles.bubbleWrap,
                    isUser
                        ? { ...appStyle.flexTopLine, ...appStyle.flexAliCenter }
                        : appStyle.flexLine,
                    { backgroundColor: isUser ? "#86CCBC" : "#313137" },
                    isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                ]}
            >
                <PlayAudioBtn audioUri={uri}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <PlayIcon
                            style={[{ width: pxToDp(60), height: pxToDp(60) }]}
                            playing={uri === playingAudio}
                            source={{
                                uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-audio-playing.json",
                            }}
                        >
                            <Image
                                style={[{ width: pxToDp(60), height: pxToDp(60) }]}
                                resizeMode="stretch"
                                source={require("../../../../images/custom/audio_btn_1.png")}
                            />
                        </PlayIcon>
                        <Text
                            style={[
                                {
                                    color: isUser ? "#1F1F26" : "#fff",
                                    fontSize: pxToDp(37),
                                    maxWidth: isPhone ? pxToDpWidthLs(1088) : pxToDp(1580),
                                    marginLeft: pxToDp(30),
                                },
                            ]}
                        >
                            {title}
                        </Text>
                    </View>
                </PlayAudioBtn>
            </View>
        );
    } else if (showImages) {
        let imgs = [];
        if (!finalImgs.current.length) {
            // 没有选择封面
            if (storyImgDict[storyType]) {
                imgs = storyImgDict[storyType];
            } else if (squareType === "parent") {
                // console.log('checkQuestionTag::::::',checkQuestionTag)
                imgs = storyImgDict[checkQuestionTag];
            } else {
                const q = questionMap[storyType];
                imgs = storyImgDict[q];
            }
            if (!imgs) imgs = [];
            imgs = _.sampleSize(imgs.concat(expandImgs), 4);
            imgs.forEach((i, x) => {
                if (!i.includes("paixiaoxue")) {
                    imgs[x] = "paixiaoxue/square/" + i;
                }
            });
            finalImgs.current = imgs;
        } else {
            // 选过封面，设置为上次的封面图片组
            imgs = finalImgs.current;
        }
        console.log("imgs:::::::::", imgs);
        content = (
            <View>
                <View style={[appStyle.flexLine]}>
                    {imgs.map((i, x) => {
                        return (
                            <TouchableOpacity
                                key={x}
                                onPress={() => {
                                    dispatch({
                                        type: "square/setImg",
                                        data: i,
                                    });
                                    dispatch({
                                        type: "square/setCanSend",
                                        data: true,
                                    });
                                }}
                            >
                                <View
                                    style={[
                                        styles.bgWrap,
                                        i === img ? styles.bgWrapActive : null,
                                    ]}
                                >
                                    <Image
                                        source={{ uri: url.baseURL + i }}
                                        style={[
                                            {
                                                flex: 1,
                                                backgroundColor: "transparent",
                                                borderRadius: pxToDp(40),
                                            },
                                        ]}
                                    ></Image>
                                    {i === img ? (
                                        <Image
                                            style={[styles.selectIcon]}
                                            source={require("../../../../images/square/select_icon.png")}
                                        ></Image>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {img ? null : (
                    <View
                        style={[
                            appStyle.flexCenter,
                            Platform.OS === "ios" ? { marginTop: pxToDp(20) } : null,
                        ]}
                    >
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(42) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            选一张图片作为故事的封面吧！
                        </Text>
                    </View>
                )}
            </View>
        );
    } else if (renderLottie) {
        content = (
            <Lottie
                source={{
                    uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/square-story-loading.json",
                }}
                autoPlay
                loop={true}
                style={[
                    {
                        width: pxToDp(100),
                        height: pxToDp(100),
                    },
                ]}
            />
        );
    } else {
        content = (
            <View
                style={[
                    styles.bubbleWrap,
                    isUser
                        ? { ...appStyle.flexTopLine, ...appStyle.flexAliCenter }
                        : appStyle.flexLine,
                    { backgroundColor: isUser ? "#86CCBC" : "#313137" },
                    isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 },
                ]}
            >
                {squareType === "parent" ? (
                    <View
                        style={[{ maxWidth: isPhone ? pxToDpWidthLs(1088) : pxToDp(1580) }]}
                    >
                        <MarkdownView
                            value={text}
                            textStyle={{
                                fontSize: pxToDp(37),
                                lineHeight: pxToDp(42),
                                color: "#fff",
                            }}
                        ></MarkdownView>
                    </View>
                ) : (
                    <Text
                        style={[
                            {
                                color: isUser ? "#1F1F26" : "#fff",
                                fontSize: pxToDp(37),
                                maxWidth: isPhone ? pxToDpWidthLs(1088) : pxToDp(1580),
                            },
                        ]}
                    >
                        {text}
                    </Text>
                )}
            </View>
        );
    }
    return <View>{content}</View>;
}

function Message(props) {
    const {
        currentMessage,
        renderDay,
        nextMessage,
        renderAvatar,
        defaultBubble,
    } = props;
    const { text, user } = currentMessage;
    const { avatar } = useSelector((state) => state.toJS().userInfo);
    const role = user._id === 1 ? "gpt" : "user";
    const isPhone = !getIsTablet();
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;
    const getInnerComponentProps = () => {
        return {
            ...props,
            isSameUser,
            isSameDay,
            //   position:'right'
        };
    };
    // console.log('+++++',isSameUser,isSameDay)
    const renderMyDay = () => {
        // console.log('iiiiiiiii',props)
        if (currentMessage.createdAt) {
            const dayProps = getInnerComponentProps();
            if (renderDay) {
                return renderDay(dayProps);
            }
            return <Day {...dayProps} />;
        }
        return null;
    };
    const renderMyAvatar = (role) => {
        const roleAvatarMap = {
            user: avatar,
            gpt: require("../../../../images/square/gpt_avatar.png"),
        };
        return (
            <Image
                resizeMode="stretch"
                style={[
                    isPhone
                        ? { width: pxToDpWidthLs(111), height: pxToDpWidthLs(108) }
                        : { width: pxToDp(102), height: pxToDp(98) },
                ]}
                source={roleAvatarMap[role]}
            ></Image>
        );
    };

    const renderMyBubble = () => {
        const bubbleProps = getInnerComponentProps();
        if (!defaultBubble) {
            return <MyBubble {...bubbleProps}></MyBubble>;
        }
        return <Bubble {...bubbleProps} />;
    };
    const marginBottom = isSameUser(currentMessage, nextMessage)
        ? pxToDp(30)
        : pxToDp(30);
    return (
        <View>
            {/* { renderMyDay()}   //显示当前年月日 */}
            <View
                style={[
                    user._id === 2 ? appStyle.flexEnd : null,
                    appStyle.flexTopLine,
                    { marginBottom },
                ]}
            >
                {role === "gpt" ? (
                    <View style={{ marginRight: pxToDp(20), marginLeft: pxToDp(30) }}>
                        {renderMyAvatar(role)}
                    </View>
                ) : null}
                {renderMyBubble()}
                {role === "user" ? (
                    <View style={{ marginLeft: pxToDp(20), marginRight: pxToDp(30) }}>
                        {renderMyAvatar(role)}
                    </View>
                ) : null}
            </View>
        </View>
    );
}

function AiTalk({ navigation }) {
    let TOOL_COMMAND = {
        translateToEnglish: "请帮我把故事翻译成英文。",
        createStoryImg: "请帮我创作故事的封面图。",
        createStoryAudio: "请帮我生成故事音频。",
    };

    if (squareType === "parent") {
        // 家长故事
        TOOL_COMMAND = {
            createStoryImg: "请帮我创作故事的封面图。",
            createStoryAudio: "请帮我生成故事音频。",
        };
    }

    const [shareModalVisible, setShareModalVisible] = useState(false);
    const {
        canSend,
        messages,
        bottomHeight,
        img,
        englishStory,
        storyType,
        checkWordList,
        contentAudio,
        storyBGMDict,
        checkedQuestion,
        questionMap,
        checkQuestionTag,
    } = useSelector((state) => state.toJS().square);
    const { storyId, title } = useSelector((state) => state.toJS().square);
    const { currentUserInfo, squareType } = useSelector(
        (state) => state.toJS().userInfo
    );
    const userName = currentUserInfo["name"];
    const dispatch = useDispatch();
    const isPhone = !getIsTablet();
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;
    const [showToast, setshowToast] = useState(false);

    useEffect(() => {
        dispatch({ type: "square/getChat" });
        console.log("checkedQuestion: ", checkedQuestion, checkQuestionTag);
        if (squareType === "parent") {
            // 家长
            const params = {
                category: checkQuestionTag,
                title: checkedQuestion,
            };
            axios
                .post(api.createStoryParent, params)
                .then((res) => {
                    const { content, id } = res.data.data;
                    const title = `《${checkedQuestion}》`;
                    console.log("content: ", content);
                    console.log("id: ", id);
                    dispatch({
                        type: "square/setStory",
                        data: content,
                    });
                    dispatch({
                        type: "square/setTitle",
                        data: title,
                    });
                    dispatch({
                        type: "square/setStoryId",
                        data: id,
                    });
                    dispatch({ type: "square/deleteWaitingStatus" });
                    dispatch({
                        type: "square/setMessages",
                        data: {
                            message: {
                                content: `${title}\n\n\n${content}`,
                                role: "bot",
                            },
                        },
                    });
                    dispatch({
                        type: "square/setCanSend",
                        data: true,
                    });
                })
                .catch((error) => showErr());
        } else {
            // 学生
            if (_.isEmpty(checkedQuestion)) {
                const params = {
                    category_type: storyType,
                };
                axios
                    .get(api.getSquareStoryChat, { params })
                    .then((res) => {
                        const { title, content, id } = res.data.data;
                        dispatch({
                            type: "square/setStory",
                            data: content,
                        });
                        dispatch({
                            type: "square/setTitle",
                            data: title,
                        });
                        dispatch({
                            type: "square/setStoryId",
                            data: id,
                        });
                        dispatch({ type: "square/deleteWaitingStatus" });
                        dispatch({
                            type: "square/setMessages",
                            data: {
                                message: {
                                    content: `${title}\n\n\n${content}`,
                                    role: "bot",
                                },
                            },
                        });
                        dispatch({
                            type: "square/setCanSend",
                            data: true,
                        });
                    })
                    .catch((error) => showErr());
            } else {
                const params = {
                    title: checkedQuestion,
                };
                axios
                    .post(api.postSquareScienceQuestion, params)
                    .then((res) => {
                        const { content, id, sentences, words } = res.data.data;
                        console.log("words: ", words);
                        const title = `《${checkedQuestion}》`;
                        console.log("content: ", content);
                        console.log("id: ", id);
                        console.log("sentences: ", sentences);
                        console.log("words: ", words);
                        if (content) {
                            dispatch({
                                type: "square/setStory",
                                data: content,
                            });
                            dispatch({
                                type: "square/setCheckWordList",
                                data: words,
                            });
                            dispatch({
                                type: "square/setTitle",
                                data: title,
                            });
                            dispatch({
                                type: "square/setStoryId",
                                data: id,
                            });
                            dispatch({ type: "square/deleteWaitingStatus" });
                            dispatch({
                                type: "square/setMessages",
                                data: {
                                    message: {
                                        content: `${title}\n\n\n${content}`,
                                        role: "bot",
                                    },
                                },
                            });
                            dispatch({
                                type: "square/setCanSend",
                                data: true,
                            });
                        } else {
                            dispatch({ type: "square/deleteWaitingStatus" });
                            dispatch({
                                type: "square/setMessages",
                                data: {
                                    message: {
                                        content: '网络出错，请退出重试。',
                                        role: "bot",
                                    },
                                },
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("err", error);
                        showErr();
                    });
            }
        }
        return () => {
            dispatch({ type: "square/initChatData" });
            dispatch({ type: "square/deleteCheckedQuestion" });
            EventRegister.emitEvent("pauseAudioEvent");
            dispatch(getAllCoin())
        };
    }, []);
    const showErr = () => {
        setshowToast(true);
        setTimeout(() => {
            setshowToast(false);
        }, 1000);
    };
    const onSend = async (value) => {
        dispatch({
            type: "square/setCanSend",
            data: false,
        });
        dispatch({
            type: "square/setMessages",
            data: {
                message: {
                    content: value,
                    role: "user",
                },
            },
        });
        if (value === TOOL_COMMAND.translateToEnglish) {
            dispatch({
                type: "square/setMessages",
                data: {
                    message: {
                        content: "...",
                        role: "bot",
                    },
                },
            });
            const isEncyclopedia = !_.isEmpty(questionMap[storyType]); // 是否是百科故事
            let params, res;
            if (isEncyclopedia) {
                params = {
                    id: storyId,
                };
                res = await axios.post(api.postSquareScienceQuestion, params);
            } else {
                params = {
                    category_type: storyType,
                    id: storyId,
                };
                res = await axios.get(api.getSquareStoryChat, { params });
            }

            const englishStory = res.data.data.english_content;
            dispatch({ type: "square/deleteWaitingStatus" });
            dispatch({
                type: "square/setMessages",
                data: {
                    message: {
                        content: englishStory,
                        role: "bot",
                    },
                },
            });
            dispatch({
                type: "square/setEnglishStory",
                data: englishStory,
            });
            dispatch({
                type: "square/setCanSend",
                data: true,
            });
        } else if (value === TOOL_COMMAND.createStoryImg) {
            dispatch({
                type: "square/setMessages",
                data: {
                    message: {
                        content: `...`,
                        role: "bot",
                    },
                },
            });
            setTimeout(() => {
                dispatch({ type: "square/deleteWaitingStatus" });
                dispatch({
                    type: "square/setMessages",
                    data: {
                        message: {
                            content: `SHOW IMAGES`,
                            role: "bot",
                        },
                    },
                });
            }, 4000);
        } else if (value === TOOL_COMMAND.createStoryAudio) {
            dispatch({
                type: "square/setMessages",
                data: {
                    message: {
                        content: `...`,
                        role: "bot",
                    },
                },
            });
            // 百科故事
            const isEncyclopedia = !_.isEmpty(questionMap[storyType]); // 是否是百科故事
            let bgm = storyBGMDict[storyType];
            if (isEncyclopedia) {
                bgm = storyBGMDict[questionMap[storyType]];
            }
            if (squareType === "parent") {
                bgm = storyBGMDict["家长"];
            }
            const data = {
                background_audio: bgm,
                id: storyId,
            };
            console.log("audioPath============", data);
            let res = await axios.post(api.getSquareStoryAudio, data);
            console.log("audioPathres::::::::::", res.data.data);
            const audioPath = url.baseURL + res.data.data.audio;
            dispatch({
                type: "square/setContentAudio",
                data: audioPath,
            });
            dispatch({
                type: "square/setMessages",
                data: {
                    message: {
                        content: `SHOW AUDIO`,
                        role: "bot",
                    },
                },
            });
            dispatch({ type: "square/deleteWaitingStatus" });
            dispatch({
                type: "square/setCanSend",
                data: true,
            });
        }
    };

    const renderMessage = (props) => {
        const { nextMessage } = props;
        return (
            <View
                style={[
                    Object.keys(nextMessage).length
                        ? null
                        : { marginBottom: bottomHeight },
                ]}
            >
                <Message {...props} defaultBubble={false}></Message>
            </View>
        );
    };

    const onLayoutDropBottomWrap = (e) => {
        let { height } = e.nativeEvent.layout;
        dispatch({
            type: "square/setBottomHeight",
            data: height,
        });
    };

    const renderInputToolbar = (props) => {
        if (!canSend) return null;
        const COLOR_MAP = {
            0: "#31CBAF",
            1: "#FACE8D",
            2: "#7640FF",
        };

        let stepChoice = [
            TOOL_COMMAND.translateToEnglish,
            TOOL_COMMAND.createStoryImg,
            TOOL_COMMAND.createStoryAudio,
        ];

        if (squareType === "parent") {
            stepChoice = [TOOL_COMMAND.createStoryImg, TOOL_COMMAND.createStoryAudio];
        }

        let publishChoice = ["发布作品"];
        let d = "下一步你想？";

        if (englishStory !== "") {
            stepChoice = _.remove(
                stepChoice,
                (n) => n !== TOOL_COMMAND.translateToEnglish
            );
        }

        if (contentAudio !== "") {
            stepChoice = _.remove(
                stepChoice,
                (n) => n !== TOOL_COMMAND.createStoryAudio
            );
        }

        if (img) {
            stepChoice = _.remove(
                stepChoice,
                (n) => n !== TOOL_COMMAND.createStoryImg
            );
        }

        // 功能列表中只剩一个选项时，修改描述信息
        if (stepChoice.length === 1) {
            let command = stepChoice[0];
            if (command === TOOL_COMMAND.translateToEnglish) {
                d = "要为故事生成英文版吗？";
            } else if (command === TOOL_COMMAND.createStoryImg) {
                d = "来为故事创建封面吧！";
            } else if (command === TOOL_COMMAND.createStoryAudio) {
                d = "要为故事生成音频吗？";
            }
        } else if (stepChoice.length === 0) {
            d = "你太棒啦！";
        }

        // 如果生成过封面图，则可以选择直接发布作品
        if (img) {
            stepChoice = _.concat(stepChoice, publishChoice);
        }

        return (
            <View
                style={[
                    appStyle.flexCenter,
                    {
                        position: "absolute",
                        bottom: isPhone
                            ? pxToDpWidthLs(34)
                            : Platform.OS === "android"
                                ? 0
                                : pxToDp(30),
                        width: "100%",
                    },
                    styles.bottomWrap,
                ]}
                onLayout={(e) => onLayoutDropBottomWrap(e)}
            >
                <>
                    <View
                        style={[
                            {
                                backgroundColor: "#1F1F26",
                                padding: isPhone ? pxToDpWidthLs(20) : pxToDp(10),
                                borderRadius: isPhone ? pxToDpWidthLs(24) : pxToDp(30),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    color: "#fff",
                                    fontSize: isPhone ? pxToDpWidthLs(33) : pxToDp(42),
                                },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            {d}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.bottomChoiceWrap,
                            appStyle.flexLine,
                            appStyle.flexJusCenter,
                        ]}
                    >
                        {stepChoice.map((i, x) => {
                            let c;
                            if (i === "发布作品") {
                                c = (
                                    <TouchableOpacity
                                        style={[styles.confirmBtn, appStyle.flexCenter]}
                                        onPress={() => {
                                            EventRegister.emitEvent("pauseAudioEvent");
                                            setShareModalVisible(true);
                                            const data = {
                                                id: storyId,
                                                image_cover: img,
                                            };
                                            // 保存发布结果
                                            axios.post(api.postSquareStoryChat, data).then(res => {
                                                dispatch(getAllCoin())
                                            });
                                            // axios.get(api.costPaiCreateTalk, {
                                            //   params: { card_id: storyId },
                                            // });
                                            // getPaiCoin({ source: "publish", card_id: storyId });
                                        }}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    color: "#fff",
                                                    fontSize: isPhone ? pxToDpWidthLs(33) : pxToDp(42),
                                                },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            发布作品
                                        </Text>
                                    </TouchableOpacity>
                                );
                            } else {
                                c = (
                                    <TouchableOpacity
                                        style={[
                                            styles.choice,
                                            appStyle.flexCenter,
                                            { borderColor: COLOR_MAP[x] },
                                            x === stepChoice.length - 1 ? { marginRight: 0 } : null,
                                        ]}
                                        key={x}
                                        onPress={() => {
                                            onSend(i);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    color: "#fff",
                                                    fontSize: isPhone ? pxToDpWidthLs(33) : pxToDp(42),
                                                },
                                            ]}
                                        >
                                            {i}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                            return c;
                        })}
                    </View>
                </>
            </View>
        );
    };

    const shareEvent = async (targetType) => {
        const defaultAvatar =
            "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/paixiaoxue/avatar/default.png";
        const tag = "一起来用AI #创作 故事吧";
        let queryInfo = `id=${storyId}&check_word_list=${checkWordList}`;
        console.log("queryInfo: ", queryInfo);
        console.log(
            "URL: ",
            `https://test.pailaimi.com?readUser=${userName}&createUser=${userName}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
                tag
            )}&${queryInfo}`
        );
        await WeChat.registerApp("wxedf6fb113c40f47e", "https://pailaimi.com/");
        getPaiCoin({ source: "share", card_id: storyId });
        await WeChat.shareWebpage({
            title: title,
            description: "一起来用AI创作故事吧",
            thumbImageUrl: url.baseURL + img,
            webpageUrl: `https://test.pailaimi.com?readUser=${userName}&createUser=${userName}&createUserImg=${defaultAvatar}&tag=${encodeURIComponent(
                tag
            )}&${queryInfo}`, // knowledge_code a_id title_id
            scene: targetType === "friends" ? 0 : 1, // 0 微信好友；1 朋友圈
        });
    };

    return (
        <>
            <ShareModal
                visible={shareModalVisible}
                shareEvent={shareEvent}
                navigation={navigation}
                onCancel={() => {
                    setShareModalVisible(false);
                    NavigationUtil.toSquareHistory({ navigation, data: { type: 'myCreate' } });
                    dispatch({ type: "square/initChatData" });
                    dispatch({ type: "square/deleteCheckedQuestion" });
                }}
            ></ShareModal>
            <GiftedChat
                messages={messages}
                renderMessage={renderMessage}
                onSend={(messages) => onSend(messages)}
                renderInputToolbar={renderInputToolbar}
                user={{
                    _id: 2,
                }}
            />
            {showToast ? <MyToast text={"生成失败！请退出重新生成！"} /> : null}
        </>
    );
}
const stylesHandset = StyleSheet.create({
    bubbleWrap: {
        paddingTop: pxToDpWidthLs(20),
        paddingBottom: pxToDpWidthLs(20),
        paddingLeft: pxToDpWidthLs(30),
        paddingRight: pxToDpWidthLs(30),
        borderRadius: pxToDpWidthLs(40),
        minHeight: pxToDpWidthLs(80),
        minWidth: pxToDpWidthLs(200),
        borderWidth: pxToDpWidthLs(2),
        borderColor: "#86CCBC",
    },
    bottomWrap: {
        paddingLeft: pxToDpWidthLs(27),
        paddingRight: pxToDpWidthLs(27),
    },
    bottomChoiceWrap: {
        backgroundColor: "#3E3E46",
        height: pxToDpWidthLs(78),
        width: "100%",
        borderRadius: pxToDpWidthLs(25),
    },
    choice: {
        height: pxToDpWidthLs(70),
        paddingLeft: pxToDpWidthLs(25),
        paddingRight: pxToDpWidthLs(25),
        borderWidth: pxToDpWidthLs(2),
        marginRight: pxToDpWidthLs(23),
        borderRadius: pxToDpWidthLs(24),
    },

    bgWrap: {
        width: pxToDpWidthLs(252),
        height: pxToDpWidthLs(252),
        borderRadius: pxToDpWidthLs(40),
        padding: pxToDpWidthLs(10),
        backgroundColor: "#4A4A4E",
        marginRight: pxToDpWidthLs(30),
    },
    bgWrapActive: {
        borderWidth: pxToDpWidthLs(5),
        borderColor: "#FFC12F",
    },
    selectIcon: {
        width: pxToDpWidthLs(50),
        height: pxToDpWidthLs(50),
        position: "absolute",
        bottom: pxToDpWidthLs(-2),
        right: pxToDpWidthLs(-2),
    },
    confirmBtn: {
        width: pxToDpWidthLs(425),
        height: pxToDpWidthLs(83),
        borderRadius: pxToDpWidthLs(30),
        backgroundColor: "#FF9000",
        borderWidth: pxToDpWidthLs(5),
        borderColor: "#FFC12F",
    },
});

const stylesTablet = StyleSheet.create({
    bubbleWrap: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(40),
        minHeight: pxToDp(120),
        minWidth: pxToDp(200),
        borderWidth: pxToDp(2),
        borderColor: "#86CCBC",
    },
    bottomWrap: {
        paddingLeft: pxToDp(27),
        paddingRight: pxToDp(27),
    },
    bottomChoiceWrap: {
        backgroundColor: "#3E3E46",
        height: pxToDp(115),
        width: "100%",
        borderRadius: pxToDp(40),
    },
    choice: {
        height: pxToDp(90),
        paddingLeft: pxToDp(25),
        paddingRight: pxToDp(25),
        borderWidth: pxToDp(2),
        marginRight: pxToDp(30),
        borderRadius: pxToDp(30),
    },
    bgWrap: {
        width: pxToDp(420),
        height: pxToDp(420),
        borderRadius: pxToDp(40),
        padding: pxToDp(10),
        backgroundColor: "#4A4A4E",
        marginRight: pxToDp(30),
    },
    bgWrapActive: {
        borderWidth: pxToDp(5),
        borderColor: "#FFC12F",
    },
    selectIcon: {
        width: pxToDp(79),
        height: pxToDp(81),
        position: "absolute",
        bottom: pxToDp(-2),
        right: pxToDp(-2),
    },
    confirmBtn: {
        width: pxToDp(425),
        height: pxToDp(83),
        borderRadius: pxToDp(30),
        backgroundColor: "#FF9000",
        borderWidth: pxToDp(5),
        borderColor: "#FFC12F",
    },
});

export default AiTalk;
