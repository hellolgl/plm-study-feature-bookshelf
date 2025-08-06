import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from "react-native";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import { useSelector } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import url from "../../../../util/url";
import _ from "lodash";
import { pinyin } from "pinyin-pro";
import PlayAudioBtn from "../../../../component/PlayAudioBtn";
import PlayIcon from "../../../../component/PlayIcon";
import EventRegister from "../../../../util/eventListener";
import GoodAndCoin from "../../../../component/square/goodAndCoin";

function ParentCreate({ seeKnowledgePoint, goCreate, goTalk }) {
    const { homeSelectItem } = useSelector((state) => state.toJS().square);
    const { playingAudio } = useSelector((state) => state.toJS().audioStatus);
    const { hasNotch } = useSelector((state) => state.toJS().deviceInfo);
    const { squareType } = useSelector((state) => state.toJS().userInfo);
    const [detail, setDetail] = useState({});
    const [wordMap, setWordMap] = useState({});
    const [knowledge_point, setKnowledge_point] = useState({});
    const [current_user_like, setcurrent_user_like] = useState(false);
    const [user_like_nums, setuser_like_nums] = useState(0);
    const [tips_count, settips_count] = useState(0);
    const [current_user_tips, setcurrent_user_tips] = useState(false);
    const [creator_id, setcreator_id] = useState(0);
    const { id, imgUrl, user_name, module } = homeSelectItem;
    const coverImg = url.baseURL + imgUrl;
    const isPhone = !getIsTablet();
    const OS = Platform.OS;
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;

    const getChangeContent = (words, section) => {
        words.forEach((i) => {
            const regex = new RegExp(i, "gi");
            section = section.replace(regex, `#${i}#`);
        });
        return section;
    };

    useEffect(() => {
        return () => {
            EventRegister.emitEvent("pauseAudioEvent");
        };
    }, [])

    useEffect(() => {
        axios.get(api.getCommonStoryDetail, { params: { id, story_type: module } }).then((res) => {
            let data = _.cloneDeep(res.data.data);
            data.title_content = data.title_content
                .replaceAll("《", "")
                .replaceAll("》", "")
            const { words } = data;
            let { content } = data;
            let contentSection = content.split("\n\n");
            let finalContent = [];
            contentSection.forEach((section, x) => {
                const newSection = getChangeContent(words, section);
                contentSection[x] = newSection;
                let arr = [];
                newSection.split("#").forEach((i) => {
                    arr.push({
                        value: i,
                        hightLight: words.indexOf(i) > -1,
                    });
                });
                let wordArr = [];
                arr.forEach((i, x) => {
                    const { hightLight, value } = i;
                    if (hightLight) {
                        wordArr.push(i);
                    } else {
                        let valueArr = value.split("");
                        valueArr.forEach((ii, xx) => {
                            wordArr.push({
                                value: ii,
                                hightLight,
                            });
                        });
                    }
                });
                finalContent.push(wordArr);
            });
            data.finalContent = finalContent;
            if (data.audio) data.audio = url.baseURL + data.audio;
            setuser_like_nums(res.data.data?.user_like_nums);
            setcurrent_user_like(res.data.data?.current_user_like);
            settips_count(res.data.data?.tips_count);
            setcurrent_user_tips(res.data.data?.current_user_tips);
            setcreator_id(res.data.data?.creator_id);
            setDetail(data);
        });
    }, [id]);

    const selectWord = (word) => {
        setKnowledge_point(knowledge_point);
        let map = _.cloneDeep(wordMap);
        if (map[word]) {
            seeKnowledgePoint(map[word]);
        } else {
            axios
                .get(api.getStoryWordDetail, { params: { knowledge_point: word } })
                .then((res) => {
                    let data = res.data.data;
                    const { knowledge_point } = data;
                    data.pinyinList =
                        data.pinyin_2?.length > 0
                            ? data.pinyin_2.split(" ").filter((i) => i !== "")
                            : pinyin(knowledge_point, { type: "array" });
                    data.knowledge_point = knowledge_point.replaceAll("\n", "");
                    data.word = data.knowledge_point.split("");
                    map[knowledge_point] = data;
                    setWordMap(map);
                    seeKnowledgePoint(map[word]);
                });
        }
    };
    const { english_content, title_content, finalContent, audio } = detail;
    if (!finalContent) return null;
    return (
        <View
            style={[
                { flex: 1 },
                appStyle.flexLine,
                !hasNotch
                    ? { paddingLeft: pxToDpWidthLs(40), paddingRight: pxToDpWidthLs(40) }
                    : null,
            ]}
        >
            <GoodAndCoin
                current_user_like={current_user_like}
                user_like_nums={user_like_nums}
                tips_count={tips_count}
                current_user_tips={current_user_tips}
                isRight={true}
                creator_id={creator_id}
            />

            <View style={[styles.left, { backgroundColor: "transparent" }]}>
                <View style={[appStyle.flexTopLine, appStyle.flexAliEnd]}>
                    <Image
                        resizeMode="stretch"
                        style={[
                            isPhone
                                ? { width: pxToDpWidthLs(100), height: pxToDpWidthLs(97) }
                                : { width: pxToDp(124), height: pxToDp(121) },
                        ]}
                        source={require("../../../../images/square/gpt_avartar_2.png")}
                    ></Image>
                    <View style={[styles.tipsWrap, appStyle.flexJusCenter]}>
                        <Text
                            style={[
                                {
                                    color: "#283139",
                                    fontSize: isPhone ? pxToDpWidthLs(25) : pxToDp(33),
                                },
                                appFont.fontFamily_jcyt_500,
                            ]}
                        >
                            与“派知识”共创
                        </Text>
                    </View>
                </View>
                <View style={[styles.imgWrap]}>
                    <Image style={[styles.img]} source={{ uri: coverImg }}></Image>
                </View>
                <TouchableOpacity
                    style={[styles.btn, appStyle.flexCenter]}
                    onPress={() => {
                        EventRegister.emitEvent("pauseAudioEvent");
                        goTalk()
                    }}
                >
                    <Text
                        style={[
                            {
                                color: "#283139",
                                fontSize: isPhone ? pxToDpWidthLs(33) : pxToDp(42),
                            },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        AI对话
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={[
                    styles.right,
                    { flex: 1, height: "100%" },
                    appStyle.flexJusCenter,
                ]}
            >
                <View
                    style={[
                        appStyle.flexLine,
                        { marginLeft: isPhone ? pxToDpWidthLs(80) : pxToDp(120) },
                    ]}
                >
                    <Text style={[styles.tagTxt]}>快来品鉴一下 {user_name}</Text>
                    <TouchableOpacity onPress={goCreate}>
                        <Text style={[styles.tagTxt, { color: "#228F86" }]}> #创作 </Text>
                    </TouchableOpacity>
                    <Text style={[styles.tagTxt]}>的专家论述吧！</Text>
                </View>
                <View style={[appStyle.flexLine]}>
                    <View style={[styles.triangle]}></View>
                    <View style={[styles.storyWrap, { flex: 1 }]}>
                        <ScrollView
                            contentContainerStyle={{
                                paddingRight: isPhone ? pxToDpWidthLs(30) : pxToDp(60),
                            }}
                        >
                            {audio ? (
                                <View
                                    style={[{ position: "absolute", top: 0, left: 0, zIndex: 1 }]}
                                >
                                    <PlayAudioBtn audioUri={audio}>
                                        <View style={[styles.playBtn]}>
                                            <View style={[styles.playBtnInner, appStyle.flexCenter]}>
                                                <PlayIcon
                                                    style={[styles.playIconLottie]}
                                                    playing={audio === playingAudio}
                                                    source={{
                                                        uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/audio3.json",
                                                    }}
                                                >
                                                    <Image
                                                        style={[styles.playIcon]}
                                                        resizeMode="stretch"
                                                        source={require("../../../../images/square/play_icon_3.png")}
                                                    />
                                                </PlayIcon>
                                            </View>
                                        </View>
                                    </PlayAudioBtn>
                                </View>
                            ) : null}
                            <Text
                                style={[
                                    {
                                        color: "#283139",
                                        fontSize: isPhone ? pxToDpWidthLs(38) : pxToDp(46),
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        marginBottom: isPhone ? pxToDpWidthLs(36) : pxToDp(26),
                                        lineHeight: isPhone ? pxToDpWidthLs(50) : pxToDp(60),
                                        paddingLeft: isPhone ? pxToDpWidthLs(120) : pxToDp(140),
                                        paddingRight: isPhone ? pxToDpWidthLs(110) : pxToDp(120),
                                    },
                                ]}
                            >
                                {title_content}
                            </Text>
                            {finalContent.map((i, x) => {
                                return (
                                    <View
                                        key={x}
                                        style={[
                                            appStyle.flexTopLine,
                                            appStyle.flexLineWrap,
                                            { marginBottom: pxToDp(30) },
                                        ]}
                                    >
                                        {i.map((ii, xx) => {
                                            const { hightLight, value } = ii;
                                            if (hightLight) {
                                                return (
                                                    <TouchableOpacity
                                                        key={xx}
                                                        onPress={() => {
                                                            selectWord(value);
                                                        }}
                                                    >
                                                        <Text
                                                            style={[
                                                                {
                                                                    color: "#FF4E00",
                                                                    fontSize: isPhone
                                                                        ? pxToDpWidthLs(29)
                                                                        : pxToDp(38),
                                                                },
                                                            ]}
                                                        >
                                                            {value}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            } else {
                                                return (
                                                    <Text
                                                        style={[
                                                            {
                                                                color: "#283139",
                                                                fontSize: isPhone
                                                                    ? pxToDpWidthLs(29)
                                                                    : pxToDp(38),
                                                            },
                                                        ]}
                                                        key={xx}
                                                    >
                                                        {value}
                                                    </Text>
                                                );
                                            }
                                        })}
                                    </View>
                                );
                            })}
                            {english_content ? (
                                <Text
                                    style={[
                                        {
                                            color: "#283139",
                                            fontSize: isPhone ? pxToDpWidthLs(29) : pxToDp(38),
                                            marginTop: pxToDp(20),
                                            lineHeight: pxToDp(46),
                                        },
                                    ]}
                                >
                                    {english_content}
                                </Text>
                            ) : null}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    );
}

const stylesHandset = StyleSheet.create({
    left: {
        // width:pxToDpWidthLs(350),
        // backgroundColor:"red"
    },
    tipsWrap: {
        width: pxToDpWidthLs(284),
        height: pxToDpWidthLs(62),
        borderRadius: pxToDpWidthLs(28),
        backgroundColor: "#FFD165",
        borderWidth: pxToDpWidthLs(2),
        borderColor: "#FFFBF8",
        marginLeft: pxToDpWidthLs(-80),
        paddingLeft: pxToDpWidthLs(80),
        zIndex: -1,
    },
    imgWrap: {
        width: pxToDpWidthLs(322),
        height: pxToDpWidthLs(322),
        backgroundColor: "#EDE9E7",
        borderRadius: pxToDpWidthLs(40),
        marginTop: pxToDpWidthLs(15),
        padding: pxToDpWidthLs(11),
        borderWidth: pxToDpWidthLs(5),
        borderColor: "#D4CFCB",
    },
    img: {
        flex: 1,
        borderRadius: pxToDp(40),
    },
    btn: {
        width: pxToDpWidthLs(320),
        height: pxToDpWidthLs(86),
        borderRadius: pxToDpWidthLs(45),
        backgroundColor: "#B5E0D6",
        borderWidth: pxToDpWidthLs(5),
        borderColor: "#228F86",
        marginTop: pxToDpWidthLs(18),
    },
    right: {
        paddingTop: pxToDpWidthLs(30),
        paddingBottom: pxToDpWidthLs(40),
    },
    storyWrap: {
        backgroundColor: "#FFFBF8",
        borderRadius: pxToDpWidthLs(30),
        marginTop: pxToDpWidthLs(10),
        borderWidth: pxToDpWidthLs(5),
        borderColor: "#FFFFFF",
        paddingLeft: pxToDpWidthLs(30),
        paddingBottom: pxToDpWidthLs(30),
        paddingTop: pxToDpWidthLs(20),
    },
    triangle: {
        width: 0,
        height: 0,
        borderWidth: pxToDpWidthLs(26),
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "#FFFBF8",
        marginRight: pxToDp(-6),
        zIndex: 1,
    },
    tagTxt: {
        color: "#283139",
        fontSize: pxToDpWidthLs(34),
        fontWeight: "bold",
    },
    playBtn: {
        width: pxToDpWidthLs(120),
        backgroundColor: "#2D7DED",
        borderRadius: pxToDpWidthLs(42),
        paddingBottom: pxToDpWidthLs(4),
    },
    playBtnInner: {
        height: pxToDpWidthLs(70),
        backgroundColor: "#2996FF",
        borderRadius: pxToDpWidthLs(42),
        paddingBottom: pxToDpWidthLs(4),
    },
    playIcon: {
        width: pxToDpWidthLs(36),
        height: pxToDpWidthLs(31),
        marginBottom: pxToDpWidthLs(-4),
    },
    playIconLottie: {
        width: pxToDpWidthLs(80),
        height: pxToDpWidthLs(40),
    },
});

const stylesTablet = StyleSheet.create({
    left: {
        // width:pxToDp(500),
        paddingLeft: pxToDp(63),
    },
    tipsWrap: {
        width: pxToDp(336),
        height: pxToDp(73),
        borderRadius: pxToDp(28),
        backgroundColor: "#FFD165",
        borderWidth: pxToDp(2),
        borderColor: "#FFFBF8",
        marginLeft: pxToDp(-80),
        paddingLeft: pxToDp(80),
        zIndex: -1,
    },
    imgWrap: {
        width: pxToDp(422),
        height: pxToDp(422),
        backgroundColor: "#EDE9E7",
        borderRadius: pxToDp(40),
        marginTop: pxToDp(40),
        padding: pxToDp(11),
        borderWidth: pxToDp(6),
        borderColor: "#D4CFCB",
    },
    img: {
        flex: 1,
        borderRadius: pxToDp(40),
    },
    btn: {
        width: pxToDp(420),
        height: pxToDp(108),
        borderRadius: pxToDp(45),
        backgroundColor: "#B5E0D6",
        borderWidth: pxToDp(5),
        borderColor: "#228F86",
        marginTop: pxToDp(46),
    },
    right: {
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(45 + 30 + 30),
        paddingBottom: pxToDp(62),
    },
    storyWrap: {
        backgroundColor: "#F2ECE8",
        borderRadius: pxToDp(60),
        marginTop: pxToDp(10),
        borderWidth: pxToDp(5),
        borderColor: "#B5E0D6",
        paddingLeft: pxToDp(60),
        paddingBottom: pxToDp(60),
        paddingTop: pxToDp(30),
    },
    triangle: {
        width: 0,
        height: 0,
        borderWidth: pxToDp(30),
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "#F2ECE8",
        marginRight: pxToDp(-6),
        zIndex: 1,
    },
    tagTxt: {
        color: "#283139",
        fontSize: pxToDp(42),
        fontWeight: "bold",
    },
    playBtn: {
        width: pxToDp(140),
        backgroundColor: "#2D7DED",
        borderRadius: pxToDp(42),
        paddingBottom: pxToDp(4),
    },
    playBtnInner: {
        height: pxToDp(80),
        backgroundColor: "#2996FF",
        borderRadius: pxToDp(42),
        paddingBottom: pxToDp(4),
    },
    playIcon: {
        width: pxToDp(36),
        height: pxToDp(31),
        bottom: pxToDp(-4),
    },
    playIconLottie: {
        width: pxToDp(100),
        height: pxToDp(50),
    },
});
export default ParentCreate;
