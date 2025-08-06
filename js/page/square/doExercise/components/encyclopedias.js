import React,{useEffect, useRef,useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    ImageBackground,
    Platform,
    Animated,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { pxToDp,getIsTablet, pxToDpWidthLs, pxToDpHeight } from "../../../../util/tools";
import { appFont,appStyle } from "../../../../theme";
import { useSelector,useDispatch } from "react-redux";
import _ from 'lodash'
import Microphone from "../../../../component/microphone/index";
import url from "../../../../util/url";
import Audio from "../../../../util/audio/audio";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api"; 
import {pinyin} from "pinyin-pro";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { fromJS } from "immutable";
import Talk from './talk'
import {setSelestModuleAuthority} from '../../../../action/userInfo'

const nav = ['学词语','学句型','AI对话']
// const nav = ['学词语','学句型']
const nav_config_map = {
    0:{
        color:'#FEAE5B',
        bg1:require('../../../../images/square/bg_4.png'),
    },
    1:{
        color:'#91B3FF',
        bg1:require('../../../../images/square/bg_3.png')
    },
    2:{
        color:'#42E2C6',
        bg1:require('../../../../images/square/bg_6.png')
    }
}

function Encyclopedias({seeKnowledgePoint,navigation}) {
    const isPhone = !getIsTablet()
    const dispatch = useDispatch();
    const { hasNotch } = useSelector(
        (state) => state.toJS().deviceInfo,
    );
    const {checkWordList} = useSelector(
        (state) => state.toJS().square
    )
    const {homeSelectItem,messages} = useSelector(
        (state) => state.toJS().square
    )
    const {id} = homeSelectItem
    const [navIndex,setNavIndex] = useState(0)
    const [pageIndex,setPageIndex] = useState(1)
    const [currentIndex,setCurrentIndex] = useState(0)
    const [isRecording_1,setIsRecording_1] = useState(false)
    const [wordInfoList, setWordInfoList] = useState([])
    const [contentHeight,setContentHeight] = useState(0)
    const [sentenceInfoList, setSentenceInfoList] = useState([])
    const [innerWidth,setInnerWidth] = useState(0)
    const [textNum,setTextNum] = useState(0)
    let scoreAnim_1 = useRef(new Animated.Value(0)).current;
    let styles = stylesTablet
    if(isPhone) styles = stylesHandset
    const OS = Platform.OS

    const saveCharacter = (score) => {
        const _w = _.cloneDeep(wordInfoList)
        const word = _w[currentIndex].word
        const params = {
            score,
            id,
            word
        }
        _w.forEach((i,x) => {
            if(i.word === word){
                _w[x].wordScore = score
                _w[x].initWordScore = -1
            }
        })
        setWordInfoList(_w)
        axios.post(api.saveSquareScienceWord, params).then(res => {
        }).catch((e) => {
            console.log(e)
        })
        // console.log('保存===========',params,score,_w)
    }

    const showPercent = (score) => {
        Animated.timing(scoreAnim_1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start(({finish})=>{
            saveCharacter(score)
        })
    };

    useEffect(() => {
        console.log("checkWordList: ", checkWordList)
        Promise.all(checkWordList.map(word => axios.get(api.getStoryWordDetail, { params:{knowledge_point:word,id} })))
            .then((res) => {
                const l = []
                for (let i = 0; i < res.length; i++) {
                    const data = res[i].data.data
                    const d = {
                        word: data['knowledge_point'],
                        meaning: data['meaning'],
                        audio: data['pinyin_1'],
                        // pinyin: pinyin(data['knowledge_point']),
                        pinyin: data['pinyin_2'],
                        initWordScore:data.score?data.score:0
                    }
                    l.push(d)
                }
                console.log("ll: ", l)
                setWordInfoList(l)
            })
        axios.get(api.getSquareScienceStorySentences,{ params: {id} })
            .then((res) => {
                const rawContent = res.data.data
                const sentences = rawContent.replaceAll("\n\n", "\n").split("\n");
                const cleanedSentences = sentences.map(sentence => {
                    return sentence.replace(/^\d+\.\s*/, '');
                });

                let parenthesesList = []
                let contents = []

                cleanedSentences.map(content => {
                    let sentence = ""
                    let sentenceType = ""
                    for (let index = 0; index < content.length; index++) {
                        const w = content[index];
                        if (w === "（") {
                            parenthesesList.push(w)
                        } else if (w === "）") {
                            parenthesesList.pop()
                        } else if (parenthesesList.length !== 0) {
                            sentenceType += w
                        } else if (parenthesesList.length === 0) {
                            sentence += w
                        }
                    }
                    contents.push([sentenceType, sentence])
                })
                setSentenceInfoList(contents)
            })
        return () => {
            setWordInfoList([])
            setSentenceInfoList([])
            dispatch({type: "square/initChatData"}); //清空对话数据
            dispatch({
                type: "audio/setPlayingAudio",
                data:'' ,
            });
        };
    }, [])

    useEffect(() => {
        setCurrentIndex(pageIndex - 1)
    }, [pageIndex])

    const onLayout = (e) => {
        let { height } = e.nativeEvent.layout;
        setContentHeight(height)
    }

    const onLayoutContent = (e) => {
        let { width } = e.nativeEvent.layout;
        let w = 0
        if(isPhone){
            w = width - pxToDpWidthLs(79) * 2 - pxToDpWidthLs(20)*2
            if(!hasNotch){
                w = width - pxToDpWidthLs(79) * 2 - pxToDp(60) * 2 - pxToDpWidthLs(40)
            }
        }else{
            w = width - pxToDp(120) * 2 - pxToDp(60)*2 - pxToDp(60)
        }

        setInnerWidth(w)
    }

    const onLayoutDesWrap = (e) => {
        let { width,height } = e.nativeEvent.layout;
        let textNum = 0
        let rowTextNum = 0
        let lineNum = 0
        if(isPhone){
            textNum = Math.floor(width/pxToDpWidthLs(29))
        }else{
            rowTextNum = Math.floor(width/pxToDp(40))
            lineNum = Math.floor(height/pxToDp(40))
            textNum =  rowTextNum * lineNum
        }
        setTextNum(textNum - 4)
    }

    const renderMicrophone = (iseInfo) => {
        if (navIndex === 0) {
          return (
            <View style={[styles.microphoneWrap]}>
              <Microphone
                microphoneImg={require("../../../../images/childrenStudyCharacter/read_btn_1.png")}
                microphoneImgStyle={{ width: pxToDp(480), height: pxToDp(112) }}
                activeMicrophoneImg={require("../../../../images/childrenStudyCharacter/read_btn_1.png")}
                activeMicrophoneImgStyle={{
                  width: pxToDp(480),
                  height: pxToDp(112),
                }}
                iseInfo={iseInfo}
                animation={true}
                onStartRecordEvent={() => {
                    const _w = _.cloneDeep(wordInfoList)
                    const word = _w[currentIndex].word
                    _w.forEach((i,x) => {
                        if(i.word === word){
                            _w[x].wordScore = 0
                            _w[x].initWordScore = -1
                        }
                    })
                    setWordInfoList(_w)
                    scoreAnim_1.setValue(0)
                    setIsRecording_1(true)
                }}
                onFinishRecordEvent={(score) => {
                  if (navIndex === 0) {
                    setIsRecording_1(false)
                    showPercent(parseInt(score).toFixed(0))
                  }
                }}
                waveStyle={{
                  width: pxToDp(300),
                  height: pxToDp(60),
                }}
                soundWavePosition={{
                  top: pxToDp(-70),
                  left: pxToDp(150),
                }}
                lineColor={"#58DABB"}
              />
            </View>
          );
        }
        return null;
    };

    const toStudySentence = () => {
        const i = {
          alias: "chinese_toChooseTextSentence",
        };
        dispatch({
          type: "SET_SELECTMODULE",
          data: fromJS(i),
        });
        dispatch(setSelestModuleAuthority())
        NavigationUtil.toNewSentence({ navigation });
      };

    const getPinyin = (word) => {
        let p = pinyin(word, {toneType: 'num', type: 'string'})
        console.log("raw ppp: ", p)
        const specialPinyin0 = ['lü0', 'lü1', 'lü2', 'lü3', 'lü4', 'nü0', 'nü1', 'nü2', 'nü3', 'nü4']
        const specialPinyin0Replace = ['lv0', 'lv1', 'lv2', 'lv3', 'lv4', 'nv0', 'nv1', 'nv2', 'nv3', 'nv4']

        if (specialPinyin0.includes(p)) {
            const i = specialPinyin0.indexOf(p)
            p = specialPinyin0Replace[i]
        } else if (p.includes('ü')) {
            p = p.replaceAll('ü', 'v')
        }
        return p
    }

    const renderGoStudyBtn = () => {
        if (navIndex === 1) {
            return (
                <TouchableOpacity onPress={toStudySentence} style={[styles.gotoStudyBtn]}>
                    <Text style={[styles.gotoStudyBtnText, appFont.fontFamily_jcyt_700]}>去学习更多</Text>
                    <Image
                        style={[styles.gotoStudyBtnLogo]}
                        source={require("../../../../images/square/gotoStudyBtn.png")}
                    ></Image>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const config = nav_config_map[navIndex]
    let pinyinArr = []
    let wordArr = []
    if(wordInfoList[currentIndex] && navIndex === 0){
        pinyinArr = wordInfoList[currentIndex].pinyin.split(' ')
        wordArr = wordInfoList[currentIndex].word.split('')
    }
    let currentWordInfo = wordInfoList[currentIndex]? wordInfoList[currentIndex]: {}
    currentWordInfo.meaning?currentWordInfo.meaning = currentWordInfo.meaning.replaceAll('\r','').replaceAll('\n',''):null
    // currentWordInfo.meaning = '太阳内部，氢原子在高温高压下融合成氦，释放出巨大的能量，就像诗人的灵感一样，源源不断。（修辞：比喻）太阳内部，氢原子在高温高压下融合成氦，释放出巨大的能量，就像诗人的灵感一样，源源不断。（修辞：比喻）太阳内部，氢原子在高温高压下融合成氦，释放出巨大的能量，就像诗人的灵感一样，源源不断。（修辞：比喻）'
    const currentSentenceInfo = sentenceInfoList[currentIndex]? sentenceInfoList[currentIndex]: []
    const total = navIndex === 0?wordInfoList.length:sentenceInfoList.length
    // console.log('fffffffffffffff',currentWordInfo,currentIndex)
    return (
        <View style={[styles.container,hasNotch?{paddingBottom:0}:null]}>
            {
                wordInfoList.length === 0?
                    <View
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "40%",
                        }}
                    >
                        <ActivityIndicator size={"large"} color={"#999999"} />
                    </View>
                    :
                    <View style={[styles.content,appStyle.flexCenter]} onLayout={(e) => onLayoutContent(e)} >
                        <View style={[styles.navWrap,appStyle.flexLine,appStyle.flexJusBetween,innerWidth?{width:innerWidth}:null]}>
                            <View style={[appStyle.flexTopLine,appStyle.flexAliEnd]}>
                                {nav.map((i,x) => {
                                    return <TouchableOpacity style={[appStyle.flexAliCenter]} key={x} onPress={()=>{
                                        setNavIndex(x)
                                        setPageIndex(1)
                                        setCurrentIndex(0)
                                    }}>
                                        <View style={[styles.navItem,{backgroundColor:nav_config_map[x].color},appStyle.flexCenter,x === navIndex?{height:pxToDp(90)}:null]} >
                                            <Text style={[{fontSize:pxToDp(40),color:"#364A4C"},x === navIndex?{color:'#fff'}:null,appFont.fontFamily_jcyt_700]}>{i}</Text>
                                        </View>
                                        <View style={[styles.triangle,{borderTopColor:x === navIndex?nav_config_map[x].color:'transparent'}]}></View>
                                    </TouchableOpacity>
                                })}
                            </View>
                            <View style={[styles.pageNumWrap,appStyle.flexCenter]}>
                                {navIndex === 2?<Text style={[{fontSize:isPhone?pxToDpWidthLs(26): pxToDp(37),color:"#fff"}]}>{Math.floor(messages.length)/2 > 5?5:Math.floor(messages.length)/2}/{5}</Text>:
                                <Text style={[{fontSize:isPhone?pxToDpWidthLs(26): pxToDp(37),color:"#fff"}]}>{pageIndex}/{total}</Text>}
                            </View>
                        </View>
                        {navIndex === 2?null:<View
                            style={[
                                styles.page_btn_wrap,
                                !hasNotch?{ paddingLeft:pxToDp(60),paddingRight:pxToDp(60)}:null,
                                pageIndex === 1 ? appStyle.flexEnd : null,
                            ]}>
                            {pageIndex === 1 ? null : (
                                <TouchableOpacity
                                    style={[styles.page_btn]}
                                    onPress={() => {
                                        setPageIndex(pageIndex - 1);
                                    }}
                                >
                                    <Image
                                        style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                                        source={require("../../../../images/childrenStudyCharacter/left_icon_1.png")}
                                    ></Image>
                                </TouchableOpacity>
                            )}
                            {pageIndex === total ? null : (
                                <TouchableOpacity
                                    style={[styles.page_btn]}
                                    onPress={() => {
                                        setPageIndex(pageIndex + 1);
                                    }}
                                >
                                    <Image
                                        style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                                        source={require("../../../../images/childrenStudyCharacter/right_icon_1.png")}
                                    ></Image>
                                </TouchableOpacity>
                            )}
                        </View>}
                        <View onLayout={(e) => onLayout(e)} style={[styles.contentInner,appStyle.flexCenter,{backgroundColor:config.color},innerWidth?{width:innerWidth}:null]}>
                            <Image style={[styles.contentBg,{height:contentHeight - pxToDp(4)}]} source={config.bg1}></Image>
                            {
                                navIndex === 0?
                                    <>
                                        <ImageBackground
                                            style={[styles.tong_bg]}
                                            resizeMode="stretch"
                                            source={
                                                isRecording_1
                                                    ? ""
                                                    : require("../../../../images/childrenStudyCharacter/tong_bg_1.png")
                                            }
                                        >
                                            <Image style={[styles.qipao_bg]} resizeMode="stretch"
                                                source={
                                                    isRecording_1
                                                        ? ""
                                                        : require("../../../../images/childrenStudyCharacter/qipao_bg_2.png")
                                                }
                                            ></Image>
                                            <Image style={[styles.boxShadowBg]}
                                                resizeMode='stretch'
                                                source={
                                                    isRecording_1
                                                        ? ""
                                                        : require("../../../../images/square/shadow_1.png")
                                                }
                                            ></Image>
                                            <View style={[appStyle.flexLine,{ position: "relative", zIndex: 2, flex: 1}]}>
                                                <View style={[appStyle.flexLine]}>
                                                    {wordArr.map((i, x) => {
                                                        return (
                                                            <View key={x} style={[appStyle.flexAliCenter]}>
                                                                <Text style={[{ color: "#363D4C", fontSize: pxToDp(60)},OS === 'android'?{marginBottom:pxToDp(-30)}:null]}>
                                                                    {pinyinArr[x]}
                                                                </Text>
                                                                <Text style={[
                                                                    { fontSize: isPhone?pxToDpWidthLs(110): pxToDp(240), color: "#363D4C"},
                                                                    wordArr.length === 3?isPhone?{fontSize:pxToDpWidthLs(70)}: { fontSize: pxToDp(180)}
                                                                        : null,
                                                                    wordArr.length === 4 || wordArr.length === 5?isPhone?{fontSize:pxToDpWidthLs(60)}: { fontSize: pxToDp(140)}
                                                                        : null,
                                                                ]}>
                                                                    {i}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                            {parseInt(currentWordInfo.initWordScore) > -1 ? (
                                                <View
                                                    style={[
                                                        styles.percent_bg,
                                                        { height: parseInt(currentWordInfo.initWordScore)  + "%" },
                                                        parseInt(currentWordInfo.initWordScore) < 85
                                                            ? { backgroundColor: "#FF809E" }
                                                            : null,
                                                    ]}
                                                ></View>
                                            ) : isRecording_1 ? null : (
                                                <Animated.View
                                                    style={[
                                                        styles.percent_bg,
                                                        {
                                                            height: scoreAnim_1.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: ["0%", currentWordInfo.wordScore + "%"],
                                                            }),
                                                        },
                                                        parseInt(currentWordInfo.wordScore) < 85 ? { backgroundColor: "#FF809E" } : null,
                                                    ]}
                                                ></Animated.View>
                                            )}
                                            {isRecording_1 ? null : <View style={[styles.play_btn]}>
                                                <Audio
                                                    audioUri={`${url.baseURL}${currentWordInfo.audio}`}
                                                    pausedBtnImg={require("../../../../images/childrenStudyCharacter/pause_btn_2.png")}
                                                    pausedBtnStyle={[styles.pausedBtnStyle]}
                                                    playBtnImg={require("../../../../images/childrenStudyCharacter/play_btn_2.png")}
                                                    playBtnStyle={[styles.pausedBtnStyle]}
                                                />
                                            </View>}
                                        </ImageBackground>
                                        <TouchableOpacity style={[styles.desWrap,appStyle.flexTopLine,appStyle.flexJusCenter,currentWordInfo.meaning.length > textNum?{...appStyle.flexAliEnd}:null,!isPhone?{height:pxToDpHeight(160)}:null]} onLayout={(e) => onLayoutDesWrap(e)} onPress={()=>{
                                            if(currentWordInfo.meaning.length > textNum){
                                                // 查看更多
                                                let _c = _.cloneDeep(currentWordInfo)
                                                _c.pinyinList = _c.pinyin?.length > 0 ? _c.pinyin.split(" ").filter((i) => i !== ""): pinyin(_c.word, { type: "array" });
                                                _c.word = _c.word.replaceAll("\n", "");
                                                _c.words = _c.word.split("");
                                                seeKnowledgePoint(_c)
                                            }
                                        }}>
                                            {currentWordInfo.meaning.length > textNum? <>
                                                <Text numberOfLines={isPhone?1:4} style={[{fontSize:isPhone?pxToDpWidthLs(29): pxToDp(40),color: "#363D4D"}]}>{currentWordInfo.meaning.substring(0,textNum)}...</Text>
                                                <View>
                                                    <Text style={[{ color: "#5073FF",fontSize:isPhone?pxToDpWidthLs(26):pxToDp(36),marginLeft:pxToDp(16)}]}>查看更多</Text>
                                                </View>
                                            </>: <Text numberOfLines={isPhone?1:4} style={[{fontSize:isPhone?pxToDpWidthLs(29): pxToDp(40),color: "#363D4D"}]}>{currentWordInfo.meaning}</Text>}
                                        </TouchableOpacity>
                                    </>
                                    :navIndex === 1?
                                    <View style={[styles.sentenceContent]}>
                                        <View>
                                            <Text style={[styles.sentenceSubTitle,{fontWeight:'bold'}]}>{currentSentenceInfo[0]}</Text>
                                        </View>
                                        <View style={[styles.sentenceArea]}>
                                            <View style={[styles.sentenceAreaInner,appStyle.flexJusCenter]}>
                                                <Text style={{
                                                        color: "#364A4C",
                                                        fontSize:isPhone?pxToDpWidthLs(33): pxToDp(41.67),
                                                    }}
                                                >{currentSentenceInfo[1]}</Text>
                                            </View>
                                        </View>
                                    </View>:<View  style={[{width:'100%',height:contentHeight,paddingBottom:isPhone?pxToDpWidthLs(0):pxToDp(80),paddingTop:isPhone?pxToDpWidthLs(50):pxToDp(30)}]}>
                                        <Talk></Talk>
                                    </View>
                            }
                        </View>
                        {navIndex === 0?renderMicrophone({
                              xun_fei: wordInfoList[currentIndex].word,
                              // origin_tone: pinyin(wordInfoList[currentIndex].word, { toneType: 'num', type: 'array' }).join("/"),
                              origin_tone: wordInfoList[currentIndex].word.split("").map(w => getPinyin(w)).join("/"),
                              words: [wordInfoList[currentIndex].word],
                        }):null}
                        {
                            renderGoStudyBtn()
                        }
                    </View>
            }
        </View>
  );
}

const stylesHandset = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop:pxToDpWidthLs(6),
        paddingBottom:pxToDpWidthLs(20)
    },
    content:{
        flex:1,
    },
    navWrap:{
        width: pxToDpWidthLs(1184),
        paddingLeft:pxToDpWidthLs(80),
        paddingRight:pxToDpWidthLs(80),
        marginBottom:pxToDpWidthLs(-30),
        position:'relative',
        zIndex:1
    },
    contentInner:{
        flex: 1,
        overflow: "hidden",
        borderRadius: pxToDpWidthLs(80),
        width: pxToDpWidthLs(1300),
        padding:pxToDpWidthLs(2),
        paddingBottom:pxToDpWidthLs(68),
    },
    contentBg: {
        width: "100%",
        height: "100%",
        position: "absolute",
        bottom : pxToDpWidthLs(2),
        borderRadius: pxToDpWidthLs(80),
    },
    page_btn_wrap: {
        position: "absolute",
        width:"100%",
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
    },
    page_btn: {
        width: pxToDpWidthLs(79),
        height: pxToDpWidthLs(129),
        backgroundColor: "#fff",
        borderRadius: pxToDpWidthLs(200),
        ...appStyle.flexCenter,
    },
    microphoneWrap:{
        marginTop:pxToDpWidthLs(-60)
    },
    gotoStudyBtn:{
        marginTop:pxToDpWidthLs(-39),
        height: pxToDpWidthLs(78),
        width: pxToDpWidthLs(349),
        backgroundColor: "#FF9000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: pxToDpWidthLs(37),
        borderWidth: pxToDpWidthLs(4),
        borderColor: "#FFC12F",
        flexDirection: "row",
    },
    gotoStudyBtnText:{
        fontSize: pxToDpWidthLs(29),
        color: "#fff",
    },
    gotoStudyBtnLogo: {
        width: pxToDpWidthLs(34),
        height: pxToDpWidthLs(34),
        marginLeft: pxToDpWidthLs(12)
    },
    tong_bg: {
        width: pxToDpWidthLs(300),
        height: pxToDpWidthLs(240),
        paddingTop: pxToDpWidthLs(5),
        paddingLeft: pxToDpWidthLs(6),
        paddingRight: pxToDpWidthLs(6),
        paddingBottom:pxToDpWidthLs(16),
        ...appStyle.flexAliCenter,
    },
    qipao_bg: {
        width: pxToDpWidthLs(300),
        height: pxToDpWidthLs(240),
        position: "absolute",
        ...appStyle.flexCenter,
        zIndex: 1,
    },
    boxShadowBg: {
        width: pxToDpWidthLs(320),
        height: pxToDpWidthLs(50),
        position: "absolute",
        zIndex: -1,
        bottom: pxToDpWidthLs(-20),
    },
    percent_bg: {
        width: "100%",
        height: "100%",
        backgroundColor: "#58DABB",
        position: "absolute",
        bottom: pxToDpWidthLs(16),
        borderTopLeftRadius: pxToDpWidthLs(16),
        borderTopRightRadius: pxToDpWidthLs(16),
        borderBottomLeftRadius: pxToDpWidthLs(16),
        borderBottomRightRadius: pxToDpWidthLs(16),
        left: pxToDpWidthLs(6),
    },
    play_btn: {
        position: "absolute",
        top: pxToDpWidthLs(-16),
        right: pxToDpWidthLs(-30),
        zIndex: 5,
    },
    pausedBtnStyle:{
        width: pxToDpWidthLs(70),
        height: pxToDpWidthLs(70)
    },
    desWrap:{
        width:'80%',
        marginTop: pxToDpWidthLs(30),
    },
    navItem:{
        width: pxToDpWidthLs(168),
        height: pxToDpWidthLs(56),
        borderTopLeftRadius: pxToDpWidthLs(31),
        borderTopRightRadius: pxToDpWidthLs(31),
    },
    pageNumWrap:{
        width: pxToDpWidthLs(60),
        height: pxToDpWidthLs(40),
        borderRadius: pxToDpWidthLs(18),
        backgroundColor:"rgba(40, 49, 57, .4)",
        marginTop:pxToDpWidthLs(-16)
    },
    triangle:{
        width: 0,
        height: 0,
        borderWidth: pxToDpWidthLs(15),
        borderBottomColor:'transparent',
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        zIndex:1,
        marginTop: pxToDpWidthLs(-2)
    },
    sentenceContent: {
        position: "absolute",
        top: pxToDpWidthLs(40),
    },
    sentenceSubTitle: {
        marginLeft: pxToDpWidthLs(30),
        marginBottom: pxToDpWidthLs(10),
        color: "#364A4C",
        fontSize: pxToDpWidthLs(37),
    },
    sentenceArea: {
        width: pxToDpWidthLs(1100),
        borderRadius: pxToDpWidthLs(43),
        backgroundColor:"#ECEEEF",
        paddingBottom:pxToDpWidthLs(12),
    },
    sentenceAreaInner:{
        flex:1,
        minHeight: pxToDpWidthLs(120),
        backgroundColor:"#fff",
        borderRadius: pxToDpWidthLs(43),
        padding:pxToDpWidthLs(16)
    }
})

const stylesTablet = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop:pxToDp(40),
        paddingBottom:pxToDp(40)
    },
    content:{
        flex:1,
    },
    navWrap:{
        width: pxToDp(1536),
        paddingLeft:pxToDp(80),
        paddingRight:pxToDp(80),
        marginBottom:pxToDp(-30),
        position:'relative',
        zIndex:1
    },
    contentInner:{
        flex: 1,
        overflow: "hidden",
        borderRadius: pxToDp(80),
        // width: pxToDp(1536),
        padding:pxToDp(2)
    },
    contentBg: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top : pxToDp(2),
        borderRadius: pxToDp(80),
    },
    page_btn_wrap: {
        position: "absolute",
        width:"100%",
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
    },
    page_btn: {
        width: pxToDp(120),
        height: pxToDp(200),
        backgroundColor: "#fff",
        borderRadius: pxToDp(200),
        ...appStyle.flexCenter,
    },
    microphoneWrap:{
        marginTop:pxToDp(-60)
    },
    gotoStudyBtn:{
        marginTop:pxToDp(-60),
        height: pxToDp(108),
        width: pxToDp(484),
        backgroundColor: "#FF9000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: pxToDp(52),
        borderWidth: pxToDp(4),
        borderColor: "#FFC12F",
        flexDirection: "row",
    },
    gotoStudyBtnText:{
        fontSize: pxToDp(41.67),
        color: "#fff",
    },
    gotoStudyBtnLogo: {
        width: pxToDp(46),
        height: pxToDp(46),
        marginLeft: pxToDp(5)
    },
    tong_bg: {
        width: pxToDp(600),
        height: pxToDp(440),
        paddingTop: pxToDp(10),
        paddingLeft: pxToDp(10),
        paddingRight: pxToDp(10),
        paddingBottom: pxToDp(30),
        ...appStyle.flexAliCenter,
    },
    qipao_bg: {
        width: pxToDp(600),
        height: pxToDp(440),
        position: "absolute",
        ...appStyle.flexCenter,
        zIndex: 1,
    },
    boxShadowBg: {
        width: pxToDp(672),
        height: pxToDp(90),
        position: "absolute",
        zIndex: -1,
        bottom: pxToDp(-28),
    },
    percent_bg: {
        width: "100%",
        height: "100%",
        backgroundColor: "#58DABB",
        position: "absolute",
        bottom: pxToDp(30),
        borderTopLeftRadius: pxToDp(20),
        borderTopRightRadius: pxToDp(20),
        borderBottomLeftRadius: pxToDp(40),
        borderBottomRightRadius: pxToDp(40),
        left: pxToDp(10),
    },
    play_btn: {
        position: "absolute",
        top: pxToDp(-40),
        right: pxToDp(-40),
        zIndex: 5,
    },
    pausedBtnStyle:{
        width: pxToDp(120),
        height: pxToDp(120)
    },
    desWrap:{
        width:'80%',
        marginTop:pxToDp(30),
    },
    navItem:{
        width:pxToDp(240),
        height:pxToDp(80),
        borderTopLeftRadius:pxToDp(31),
        borderTopRightRadius:pxToDp(31),
    },
    pageNumWrap:{
        width:pxToDp(91),
        height:pxToDp(49),
        borderRadius:pxToDp(25),
        backgroundColor:"rgba(40, 49, 57, .4)",
    },
    triangle:{
        width: 0,
        height: 0,
        borderWidth:pxToDp(15),
        borderBottomColor:'transparent',
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        zIndex:1,
        marginTop:pxToDp(-2)
    },
    sentenceContent: {
        position: "absolute",
        top: pxToDp(100),
    },
    sentenceSubTitle: {
        marginLeft: pxToDp(30),
        marginBottom: pxToDp(30),
        color: "#364A4C",
        fontSize: pxToDp(45.83),
    },
    sentenceArea: {
        width: pxToDp(1440),
        borderRadius: pxToDp(43),
        backgroundColor:"#ECEEEF",
        paddingBottom:pxToDp(16),
    },
    sentenceAreaInner:{
        flex:1,
        minHeight: pxToDp(160),
        backgroundColor:"#fff",
        borderRadius: pxToDp(43),
        padding:pxToDp(20)
    }
})

export default Encyclopedias;
