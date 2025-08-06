import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity, Text, TouchableWithoutFeedback, Platform, Dimensions } from "react-native";
import { pxToDp, touristInfo, getIsTablet, pxToDpWidthLs } from "../../../../util/tools";
import { appStyle, appFont } from "../../../../theme";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import url from "../../../../util/url";
import EventRegister from "../../../../util/eventListener";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const list_1 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
const list_2 = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]


function AbcsStudy({ navigation }) {
    const { playingAudio, recordingStatus } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const OS = Platform.OS
    const baseURL = url.baseURL
    const isPhone = !getIsTablet()
    const [show, setShow] = useState(false)
    const [currentItem, setCurrentItem] = useState('A')
    const [list, setList] = useState([])
    const [dataMap, setDataMap] = useState({})
    useEffect(() => {
        getData()
    }, [currentItem])
    const getData = () => {
        let d = _.cloneDeep(dataMap)
        if (d[currentItem]) {
            setList(d[currentItem])
        } else {
            const params = {
                knowledge: currentItem,
                knowledge_type: 1
            }
            axios.get(api.SynchronizeDiagnosisEnKnowPoint, { params })
                .then(res => {
                    console.log("@@@ res: ", res.data)
                    d[currentItem] = res.data.data
                    setDataMap(d)
                    setList(res.data.data)
                })
        }

    }
    const clickItem = (i) => {
        setCurrentItem(i)
        setShow(false)
    }
    if (!list.length) {
        return null
    }
    const pre = () => {
        EventRegister.emitEvent("pauseAudioEvent");
        // console.log('currentItem:::::', currentItem)
        // console.log('next_item:::::', list_1[list_1.indexOf(currentItem) - 1])
        if (list_1.includes(currentItem)) {
            const next_item = list_1[list_1.indexOf(currentItem) - 1]
            setCurrentItem(next_item)
        } else {
            const next_item = list_2[list_2.indexOf(currentItem) - 1]
            if (currentItem === 'a') {
                setCurrentItem('Z')
            } else {
                setCurrentItem(next_item)
            }
        }
    }
    const next = () => {
        EventRegister.emitEvent("pauseAudioEvent");
        // console.log('currentItem:::::', currentItem)
        // console.log('next_item:::::', list_1[list_1.indexOf(currentItem) + 1])
        if (list_1.includes(currentItem)) {
            const next_item = list_1[list_1.indexOf(currentItem) + 1]
            if (currentItem === 'Z') {
                setCurrentItem('a')
            } else {
                setCurrentItem(next_item)
            }
        } else {
            const next_item = list_2[list_2.indexOf(currentItem) + 1]
            setCurrentItem(next_item)
        }
    }
    const renderAduioBtn = (src) => {
        return (
            <PlayAudioBtn audioUri={baseURL + src}>
                <Image
                    style={{
                        width: pxToDp(200),
                        height: pxToDp(120),
                        resizeMode: "contain",
                    }}
                    resizeMode="contain"
                    source={baseURL + src === playingAudio ? require("../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png") : require("../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                />
            </PlayAudioBtn>
        );
    }
    const renderItem = (item) => {
        return (
            <View style={[styles.item]}>
                <Text style={[{ color: "#fff", fontSize: pxToDp(66), lineHeight: pxToDp(76), marginBottom: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{item.word}</Text>
                <View style={[{ borderRadius: pxToDp(60), backgroundColor: '#313131', overflow: 'hidden' }]}>
                    <Image
                        style={{
                            width: pxToDp(354),
                            height: pxToDp(265),
                            resizeMode: "contain",
                        }}
                        resizeMode="contain"
                        source={{ uri: baseURL + item.picture }}
                    />
                </View>
                <Text style={[{ color: "#fff", fontSize: pxToDp(45), lineHeight: pxToDp(55), marginTop: pxToDp(30), marginBottom: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{item.word_phoneticspelling}</Text>
                {renderAduioBtn(item.audio)}
            </View>
        )
    }
    const data_1 = list[0]
    const data_2 = list[1]
    const data_3 = list[2]
    return (
        <ImageBackground
            source={require("../../../../images/english/sentence/sentenceBg.png")}
            style={[styles.container, OS === 'ios' && !isPhone ? appStyle.flexCenter : null]}
        >
            <TouchableOpacity onPress={() => {
                NavigationUtil.goBack({ navigation });
            }}
                style={[styles.backBtn]}
            >
                <Image
                    style={[{ width: pxToDp(120), height: pxToDp(80) }]}
                    source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.listBtn]} onPress={() => {
                setShow(true)
                EventRegister.emitEvent("pauseAudioEvent");
            }}>
                <Image resizeMode="contain" style={[{ width: pxToDp(60), height: pxToDp(60), marginRight: pxToDp(20) }]} source={require("../../../../images/english/abcs/icon_1.png")}></Image>
                <Text style={[{ color: "#2D3040", fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>查看列表</Text>
            </TouchableOpacity>
            <View style={[styles.pageBtnWrap, appStyle.flexLine, appStyle.flexJusBetween, { transform: [{ translateY: pxToDp(-80) }] }, isPhone ? { paddingLeft: pxToDpWidthLs(110), paddingRight: pxToDpWidthLs(110) } : null]}>
                <TouchableOpacity onPress={pre}>
                    {currentItem === 'A' ? null : <Image style={[styles.pageBtn]} source={require("../../../../images/english/abcs/pre_btn.png")}></Image>}
                </TouchableOpacity>
                <TouchableOpacity onPress={next}>
                    {currentItem === 'z' ? null : <Image style={[styles.pageBtn]} source={require("../../../../images/english/abcs/next_btn.png")}></Image>}
                </TouchableOpacity>
            </View>
            <ImageBackground
                style={[styles.content, isPhone ? { marginTop: pxToDpWidthLs(100), width: pxToDpWidthLs(1350), height: pxToDpWidthLs(580) } : null]}
                source={require("../../../../images/english/abcs/helpBg.png")}
                resizeMode="stretch"
            >
                <View style={[styles.contentInner, appStyle.flexTopLine]}>
                    <View style={[styles.inner1, appStyle.flexCenter, isPhone ? { transform: [{ scale: 0.8 }, { translateY: pxToDpWidthLs(-70) }] } : null]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(75), lineHeight: pxToDp(85), marginBottom: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{data_1.word}</Text>
                        <View style={[{ borderRadius: pxToDp(60), backgroundColor: '#313131', overflow: 'hidden' }]}>
                            <Image
                                style={{
                                    width: pxToDp(482),
                                    height: pxToDp(362),
                                    resizeMode: "contain",
                                }}
                                resizeMode="contain"
                                source={{ uri: baseURL + data_1.picture }}
                            />
                        </View>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(54), lineHeight: pxToDp(64), marginTop: pxToDp(30), marginBottom: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{data_1.word_phoneticspelling}</Text>
                        {renderAduioBtn(data_1.audio)}
                    </View>
                    <View style={[styles.inner2, appStyle.flexLine, isPhone ? { transform: [{ scale: 0.85 }, { translateY: pxToDpWidthLs(-70) }, { translateX: pxToDpWidthLs(-160) }] } : null]}>
                        <View style={[styles.sanjiao]}></View>
                        <View style={[styles.inner2_2, appStyle.flexLine]}>
                            {renderItem(data_2)}
                            {renderItem(data_3)}
                        </View>
                    </View>
                </View>
            </ImageBackground>
            {show ? <View style={[styles.listWrap]}>
                <TouchableWithoutFeedback onPress={() => {
                    setShow(false)
                }}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <View style={[styles.listContent]}>
                    <TouchableOpacity
                        style={[styles.closeBtn]}
                        onPress={() => {
                            setShow(false)
                        }}
                    >
                        <Image
                            source={require("../../../../images/english/mix/helpClose.png")}
                            style={[{ width: pxToDp(80), height: pxToDp(80) }]}
                        />
                    </TouchableOpacity>
                    <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                        {list_1.map((i, x) => {
                            return <TouchableOpacity style={[styles.listItem, currentItem === i ? { borderColor: "#864FE3" } : null]} key={x} onPress={() => {
                                clickItem(i)
                            }}>
                                <Text style={[styles.listTxt, OS === 'ios' ? { lineHeight: pxToDp(50) } : null]}>{i}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                    <View style={[appStyle.flexLine, appStyle.flexLineWrap, { marginTop: pxToDp(40) }]}>
                        {list_2.map((i, x) => {
                            return <TouchableOpacity style={[styles.listItem, currentItem === i ? { borderColor: "#864FE3" } : null]} key={x} onPress={() => {
                                clickItem(i)
                            }}>
                                <Text style={[styles.listTxt, OS === 'ios' ? { lineHeight: pxToDp(50) } : null]}>{i}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                </View>
            </View> : null}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...appStyle.flexAliCenter
    },
    backBtn: {
        position: "absolute",
        zIndex: 99,
        left: pxToDp(50),
        top: pxToDp(30),
        zIndex: 1
    },
    content: {
        width: pxToDp(1992),
        height: pxToDp(903),
        marginTop: pxToDp(140)
    },
    listBtn: {
        position: "absolute",
        zIndex: 1,
        right: pxToDp(50),
        top: pxToDp(30),
        ...appStyle.flexLine,
    },
    listWrap: {
        position: "absolute",
        zIndex: 1,
        left: 0,
        top: 0,
        width: windowWidth,
        height: windowHeight,
        ...appStyle.flexAliCenter,
    },
    click_region: {
        flex: 1,
        width: '100%',
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    listContent: {
        width: pxToDp(1712),
        // height: pxToDp(322),
        backgroundColor: '#fff',
        borderBottomLeftRadius: pxToDp(40),
        borderBottomRightRadius: pxToDp(40),
        position: 'absolute',
        top: 0,
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(30),
        paddingBottom: pxToDp(40)
    },
    listItem: {
        width: pxToDp(80),
        height: pxToDp(80),
        lineHeight: pxToDp(80),
        borderWidth: pxToDp(8),
        borderColor: "transparent",
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter,
        marginRight: pxToDp(12)
    },
    listTxt: {
        fontSize: pxToDp(40),
        color: "#39334C",
        ...appFont.fontFamily_jcyt_700
    },
    closeBtn: {
        position: "absolute",
        right: pxToDp(-20),
        bottom: pxToDp(-20)
    },
    contentInner: {
        paddingLeft: pxToDp(120),
        paddingRight: pxToDp(180),
        paddingTop: pxToDp(40),
        ...appStyle.flexJusBetween
    },
    inner1: {
        flexShrink: 0,
    },
    inner2: {
        flexShrink: 0,
    },
    inner2_2: {
        height: pxToDp(779),
        backgroundColor: '#313131',
        borderRadius: pxToDp(60),
        paddingLeft: pxToDp(54)
    },
    item: {
        width: pxToDp(540),
        height: pxToDp(720),
        backgroundColor: '#444444',
        borderRadius: pxToDp(30),
        ...appStyle.flexCenter,
        marginRight: pxToDp(42)
    },
    sanjiao: {
        width: 0,
        height: 0,
        borderWidth: pxToDp(50),
        borderLeftColor: "transparent",
        borderRightColor: "#313131",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        marginRight: pxToDp(-5)
    },
    pageBtnWrap: {
        position: "absolute",
        width: "100%",
        zIndex: 1,
        top: windowHeight / 2,
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30)
    },
    pageBtn: {
        width: pxToDp(100),
        height: pxToDp(160),
    }
});
export default AbcsStudy;

