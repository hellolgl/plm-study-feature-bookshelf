import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ImageBackground,
    ScrollView,
    Platform,
    FlatList,
} from "react-native";
import { appFont, appStyle } from "../../../../theme";
import {
    pxToDp,
    isSymbol
} from "../../../../util/tools";
import { Toast } from "antd-mobile-rn";
import url from "../../../../util/url";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import ScoringTools from './scoringTools'
import Microphone, { RecordingStatus } from "../../../../util/storyRecord";
import { useSelector, useDispatch } from "react-redux";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import PlayIcon from '../../../../component/PlayIcon'
import EventRegister from '../../../../util/eventListener';
import _ from 'lodash'
import { getRewardCoin } from '../../../../action/userInfo'


// const recordScoreInfo = {"accuracy_score": 0, "children": [{"content": "sherlock", "score": 100}, {"content": "holmes", "score": 0}, {"content": "the", "score": 0}, {"content": "famous", "score": 0}, {"content": "detective", "score": 90}, {"content": "and", "score": 0}, {"content": "his", "score": 0}, {"content": "trusty", "score": 0}, {"content": "sidekick", "score": 0}, {"content": "dr.", "score": 0}, {"content": "watson", "score": 0}, {"content": "were", "score": 0}, {"content": "sitting", "score": 0}, {"content": "in", "score": 0}, {"content": "their", "score": 0}, {"content": "cozy", "score": 0}, {"content": "living", "score": 0}, {"content": "room", "score": 0}, {"content": "when", "score": 0}, {"content": "they", "score": 0}, {"content": "received", "score": 0}, {"content": "a", "score": 0}, {"content": "call", "score": 0}, {"content": "from", "score": 0}, {"content": "mrs.", "score": 0}, {"content": "turner", "score": 0}, {"content": "she", "score": 0}, {"content": "was", "score": 0}, {"content": "in", "score": 0}, {"content": "tears", "score": 0}, {"content": "as", "score": 0}, {"content": "her", "score": 0}, {"content": "beloved", "score": 0}, {"content": "pet", "score": 0}, {"content": "cat", "score": 0}, {"content": "fluffy", "score": 0}, {"content": "had", "score": 0}, {"content": "gone", "score": 0}, {"content": "missing", "score": 0}, {"content": "she", "score": 0}, {"content": "had", "score": 0}, {"content": "searched", "score": 0}, {"content": "everywhere", "score": 0}, {"content": "and", "score": 0}, {"content": "had", "score": 0}, {"content": "even", "score": 0}, {"content": "put", "score": 0}, {"content": "up", "score": 0}, {"content": "posters", "score": 0}, {"content": "but", "score": 0}, {"content": "fluffy", "score": 0}, {"content": "was", "score": 0}, {"content": "nowhere", "score": 0}, {"content": "to", "score": 0}, {"content": "be", "score": 0}, {"content": "found", "score": 0}], "fluency_score": 0, "integrity_score": 0, "standard_score": 0, "total_score": 0, "word_count": 56}
const scoreArr = ['accuracy_score', 'fluency_score', 'integrity_score', 'standard_score']
const scoreLabelMap = {
    accuracy_score: '准确度',
    fluency_score: '流畅度',
    integrity_score: '完整度',
    standard_score: '标准度',
}

const ReadingExercise = forwardRef(({ data }, ref) => {
    const [times_id, setTimes_id] = useState(0)
    const [articles, setArticles] = useState([])
    const [nowIndex, setNowIndex] = useState(0)
    const [nowArticle, setNowArticle] = useState([])
    const [showTran, setShowTran] = useState(false)
    const [microphoneMap, setMicrophoneMap] = useState({})
    const [recordScoreInfoMap, setRecordScoreInfoMap] = useState({})
    const dispatch = useDispatch();
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    let showScoreView = false
    const recordScoreInfo = recordScoreInfoMap[nowIndex]
    if (recordScoreInfo && Object.keys(recordScoreInfo).length) showScoreView = true

    useImperativeHandle(ref, () => ({
        share: () => {

            const d = {
                id: articles[nowIndex].id,
                times_id,
                article_id: articles[nowIndex].article_id,
                title_id: data.title_id,
                title: data.name,
            }
            return d
        }
    }));

    useEffect(() => {
        getdetail()
        return () => {
            dispatch({
                type: "audio/setRecordingStatus",
                data: RecordingStatus.hang,
            });
            dispatch({
                type: "audio/setPlayingAudio",
                data: '',
            });
            EventRegister.emitEvent('pauseAudioEvent');
        }
    }, [])

    const getdetail = () => {
        let sendata = {
            title_id: data.title_id,
        };
        if (data.isHistory) {
            // 从浏览记录里进
            sendata.article_id = data.article_id
            sendata.times_id = data.times_id
        }
        axios.get(api.getStoryArticle, { params: sendata }).then((res) => {
            // console.log("s数据", res.data.data);
            if (res.data.err_code === 0) {
                let article = {}
                const articles = res.data.data.articles
                if (articles.length > 0) {
                    let nowIndex = 0
                    // 定位到没有读过的段落
                    if (data.isHistory) {
                        for (let i = 0; i < articles.length; i++) {
                            const item = articles[i]
                            if (!Object.keys(item.part_data).length) {
                                nowIndex = i
                                break
                            }
                        }
                    }
                    // console.log('nowIndex::::::::::',nowIndex)
                    article = articles[nowIndex]
                    let articlelist = splitContent(article);
                    let map = {}
                    let recordScoreInfoMap = {}
                    // console.log('::::::::::::',articles)
                    articles.forEach((i, x) => {
                        if (data.isHistory) {
                            if (Object.keys(i.part_data).length) {
                                recordScoreInfoMap[x] = i.part_data
                            }
                        }
                        map[x] = new Microphone({
                            contentType: 'chapter',
                            content: i.content,
                        })
                    })
                    console.log('recordScoreInfoMap::::::', Object.keys(recordScoreInfoMap))
                    setMicrophoneMap(map)
                    setTimes_id(res.data.data.times_id)
                    setArticles(res.data.data.articles)
                    setNowArticle(articlelist)
                    if (data.isHistory) {
                        setNowIndex(nowIndex)
                        setRecordScoreInfoMap(recordScoreInfoMap)
                    }
                }
            } else {
                Toast.fail("请求失败");
            }
        });
    };
    const saveRecordData = (info, map) => {
        let status = Object.keys(map).length === articles.length ? 1 : 0
        // info.integrity_score = 80 //测试获得派币
        let params = {
            title_id: data.title_id,
            article_id: articles[nowIndex].article_id,
            id: articles[nowIndex].id,
            times_id,
            status,
            part_data: JSON.stringify(info)
        }
        if (data.isHistory) {
            params.article_id = data.article_id
        }
        console.log('saveRecordData::::::::::', params, info)
        axios.post(api.saveStoryPart, params).then(
            res => {
                // if (info.integrity_score === 80) {
                // 完整度80才会得派币
                dispatch(getRewardCoin())
                // }
            }
        ).catch((e) => {
            console.log(e)
        })
    }
    const splitContent = (article) => {
        let content = article?.content;
        return content.split(" ").map((item) => ({
            txt: item,
            color: "#283139",
        }));
    };

    const renderScoreWord = () => {
        const list = recordScoreInfo.children
        return list.map((i, x) => {
            const { content, score } = i
            let color = '#283139'
            if (score < 60) {
                color = '#FF6680';
            } else if (score > 85) {
                color = '#38BA73';
            }
            return <View style={[appStyle.flexLine]} key={x}>
                {isSymbol(content) ? null : <Text style={[styles.scoreWord, { color, opacity: 0 }]}>i</Text>}
                <Text style={[styles.scoreWord, { color }]}>
                    {content}
                </Text>
            </View>
        })
    }
    const renderStory = () => {
        let tran = articles[nowIndex]?.translation?.zh;
        const uri = url.baseURL + articles[nowIndex].audio
        let returnDom = (
            <View>
                <PlayAudioBtn audioUri={uri}>
                    <View
                        style={[
                            styles.articleWrap,
                            appStyle.flexLine
                        ]}
                    >
                        <PlayIcon
                            style={[styles.playIcon2Lottie]}
                            playing={uri === playingAudio}
                            source={{
                                uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/audio1.json",
                            }}
                        >
                            <Image
                                style={[styles.playIcon2]}
                                resizeMode="stretch"
                                source={require('../../../../images/square/play_icon_2.png')}
                            />
                        </PlayIcon>
                        <View style={{ marginLeft: pxToDp(30), width: '93%' }}>
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexLineWrap,
                                ]}
                            >
                                {showScoreView ? renderScoreWord() : nowArticle.map((item, index) => {
                                    return (
                                        <Text
                                            key={index}
                                            style={[
                                                styles.word,
                                                {
                                                    color: item.color,
                                                },
                                            ]}
                                        >
                                            {item.txt}
                                        </Text>
                                    );
                                })}
                            </View>
                            {showTran ? (
                                <Text style={[{ color: "#8D8D8F" }, styles.transTxt]}>
                                    {tran}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </PlayAudioBtn>
                <TouchableOpacity
                    style={[styles.transBtn]}
                    onPress={() => {
                        setShowTran((preValue) => {
                            return !preValue
                        })
                    }}
                >
                    <Text
                        style={[
                            styles.transBtnTxt,
                            {
                                fontWeight: "bold",
                                color: "#4C94FF",
                            },
                        ]}
                    >
                        {showTran ? "关闭翻译" : "查看翻译"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
        return returnDom;
    };

    const changeSentenceData = (arr) => {
        let finalArr = [];
        arr.forEach((i) => {
            if (isSymbol(i.slice(-1))) {
                // 单词末位有标点符号
                const w = i.slice(0, i.length - 1);
                finalArr.push({ content: w });
                finalArr.push({ content: i.slice(-1) });
            } else {
                finalArr.push({ content: i });
            }
        });
        return finalArr;
    };

    const getScoreInfo = (info) => {
        // console.log("AAAAA: ", articles[nowIndex])
        const article = articles[nowIndex]
        const { content } = article
        const c = changeSentenceData(content.split(/\s+/));
        const wordInfo = info.children;
        // console.log("WORD INFO: ", wordInfo)
        for (let i = 0; i < c.length; i++) {
            if (wordInfo.length === 0) {
                break;
            }
            const w = c[i];
            while (_.isNaN(wordInfo[0].score)) {
                wordInfo.shift();
            }
            const m = wordInfo[0];
            const word = w.content.toLowerCase();
            const compareWord = m.content;
            if (word[0] === compareWord[0] && word[-1] === compareWord[-1]) {
                w.score = m.score;
                wordInfo.shift();
            }
        }
        console.log("CCCCC: ", c)
        info['children'] = c
        let map = _.cloneDeep(recordScoreInfoMap)
        map[nowIndex] = info
        setRecordScoreInfoMap(map)
        saveRecordData(info, map)
    }
    const setStatus = (index) => {
        let showScoreView = false
        const recordScoreInfo = recordScoreInfoMap[index]
        if (recordScoreInfo && Object.keys(recordScoreInfo).length) showScoreView = true
        if (showScoreView) {
            // 有分
            dispatch({
                type: "audio/setRecordingStatus",
                data: RecordingStatus.finish,
            });
        } else {
            // 没有分
            dispatch({
                type: "audio/setRecordingStatus",
                data: RecordingStatus.hang,
            });
        }
    }
    if (!articles.length) return null
    return (
        <>
            <View style={[{ flex: 1 }]}>
                <View style={[styles.header, appStyle.flexCenter]}>
                    <Text
                        style={[
                            { color: "#283139", fontWeight: "bold" },
                            styles.name
                        ]}
                    >
                        {data.name}
                    </Text>
                    <View style={[styles.articleNum, appStyle.flexCenter]}>
                        <Text style={[styles.articleNumTxt]}>{`${nowIndex + 1}/${articles.length
                            }`}</Text>
                    </View>
                </View>
                <View
                    style={[
                        { flex: 1 },
                        styles.contentWrap,
                        appStyle.flexTopLine,
                    ]}
                >
                    <View style={[appStyle.flexCenter]}>
                        {nowIndex === 0 ? null : (
                            <TouchableOpacity
                                onPress={() => {
                                    EventRegister.emitEvent('pauseAudioEvent');
                                    setNowIndex(nowIndex - 1)
                                    setNowArticle(splitContent(articles[nowIndex - 1]))
                                    setStatus(nowIndex - 1)
                                    setShowTran(false)
                                }}
                            >
                                <Image
                                    source={require("../../../../images/square/lastStory.png")}
                                    style={[styles.btnImg]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <ImageBackground
                        source={require("../../../../images/square/storyExercise.png")}
                        style={[
                            { flex: 1 },
                            styles.contentInner,
                        ]}
                        resizeMode="stretch"
                    >
                        <ScrollView style={[styles.contentScr]}>
                            {renderStory()}
                            {showScoreView ? <View style={[appStyle.flexAliCenter]}>
                                <View style={[styles.scoreWrap, appStyle.flexLine, appStyle.flexJusCenter, { backgroundColor: '#FFFBE8' }]}>
                                    {scoreArr.map((i, x) => {
                                        return <View style={[appStyle.flexLine, styles.scoreItem]} key={x}>
                                            <Text style={[{ color: '#283139', fontWeight: "bold" }, styles.scoreTxt]}>{recordScoreInfo[i]}%</Text>
                                            <Text style={[{ color: '#8D8D8F' }, styles.labelTxt]}>{scoreLabelMap[i]}</Text>
                                            {x === 3 ? null : <View style={[styles.line, { backgroundColor: "#FF9C48" }]}></View>}
                                        </View>
                                    })}
                                </View>
                            </View> : null}
                        </ScrollView>
                    </ImageBackground>
                    <View style={[appStyle.flexCenter]}>
                        {nowIndex === articles.length - 1 ? null : (
                            <TouchableOpacity
                                onPress={() => {
                                    EventRegister.emitEvent('pauseAudioEvent');
                                    setNowIndex(nowIndex + 1)
                                    setNowArticle(splitContent(articles[nowIndex + 1]))
                                    setStatus(nowIndex + 1)
                                    setShowTran(false)
                                }}
                            >
                                <Image
                                    source={require("../../../../images/square/nextStory.png")}
                                    style={[styles.btnImg]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={[styles.recordWrap, appStyle.flexCenter,
                {
                    position: "absolute",
                    width: "100%",
                }
                ]}>
                    <ScoringTools microphone={microphoneMap[nowIndex]} getScoreInfo={getScoreInfo} scoreInfo={recordScoreInfoMap[nowIndex]}></ScoringTools>
                </View>
                <View style={[styles.tipsWrap, appStyle.flexCenter]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_700]}>要读完整段才能获得派币哟!</Text>
                </View>
            </View>
        </>
    );
});

const styles = StyleSheet.create({
    header: {
        height: pxToDp(100)
    },
    name: {
        fontSize: pxToDp(50),
    },
    contentWrap: {
        paddingRight: pxToDp(31),
        paddingBottom: pxToDp(13),
        paddingLeft: pxToDp(31)
    },
    articleNum: {
        position: "absolute",
        bottom: pxToDp(10),
        right: pxToDp(172),
        width: pxToDp(107),
        height: pxToDp(57),
        borderRadius: pxToDp(29),
        backgroundColor: "rgba(40,49,57,0.3)",
    },
    articleNumTxt: {
        fontSize: pxToDp(33),
        color: "#fff",
        ...appFont.fontFamily_jcyt_500,
    },
    btnImg: {
        width: pxToDp(93),
        height: pxToDp(173)
    },
    contentInner: {
        marginLeft: pxToDp(20),
        marginRight: pxToDp(20),
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(200),
    },
    contentScr: {
        paddingRight: pxToDp(90),
        paddingLeft: pxToDp(90),
    },
    articleWrap: {
        borderRadius: pxToDp(40),
        borderColor: "#FF8F32",
        borderWidth: pxToDp(3),
        backgroundColor: "#FFFBE8",
        paddingTop: pxToDp(41),
        paddingRight: pxToDp(56),
        paddingBottom: pxToDp(31),
        paddingLeft: pxToDp(39)
    },
    word: {
        marginRight: pxToDp(10),
        fontSize: pxToDp(38),
        fontWeight: "bold",
        lineHeight: pxToDp(50),
    },
    scoreWord: {
        fontSize: pxToDp(38),
        fontWeight: "bold",
        lineHeight: pxToDp(50),
    },
    transTxt: {
        fontSize: pxToDp(33),
        marginTop: pxToDp(24),
        lineHeight: pxToDp(50)
    },
    transBtnTxt: {
        fontSize: pxToDp(38),
        marginLeft: pxToDp(127),
        marginBottom: pxToDp(36)
    },
    transBtn: {
        marginTop: pxToDp(24)
    },
    recordWrap: {
        bottom: pxToDp(80)
    },
    imgMicrophone: {
        width: pxToDp(112),
        height: pxToDp(117),
    },
    tip1: {
        fontSize: pxToDp(30),
        position: 'absolute',
        left: pxToDp(36 + 112)
    },
    scoreWrap: {
        width: pxToDp(1100),
        height: pxToDp(80),
        borderRadius: pxToDp(37),
    },
    scoreItem: {
        marginRight: pxToDp(30)
    },
    scoreTxt: {
        fontSize: pxToDp(42),
        marginRight: pxToDp(13)
    },
    labelTxt: {
        fontSize: pxToDp(33)
    },
    line: {
        width: pxToDp(8),
        height: pxToDp(32),
        borderRadius: pxToDp(4),
        marginLeft: pxToDp(30)
    },
    playIcon2: {
        width: pxToDp(58),
        height: pxToDp(54)
    },
    playIcon2Lottie: {
        width: pxToDp(58),
        height: pxToDp(54),
    },
    tipsWrap: {
        height: pxToDp(56),
        backgroundColor: "rgba(40,49,57,0.5)",
        borderRadius: pxToDp(122),
        position: "absolute",
        bottom: pxToDp(40),
        right: pxToDp(180),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20)
    },
})

export default ReadingExercise
