import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, ScrollView, Modal, Dimensions } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _ from 'lodash'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import url from "../../../../util/url";
import Lottie from 'lottie-react-native';
import Audio from "../../../../util/audio";
import AudioView from "../../../../util/audio/audio";
import RichShowView from "../../../../component/chinese/newRichShowView";
import { Toast } from "antd-mobile-rn";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WordsWriting = ({ navigation }) => {
    const dispatch = useDispatch()
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, grade, term } = currentUserInfo
    const { origin, title, learning_name } = navigation.state.params.data
    const [data, setData] = useState({})
    const [paused, setPaused] = useState(true)
    const [visible, setVisible] = useState(false)
    const [audioUrl, setAudioUrl] = useState('')
    const [showFinish, setShowFinish] = useState(false)
    const [initAudio, setInitAudio] = useState(false)
    const OS = Platform.OS
    const baseURL = url.baseURL;
    const isPhone = !getIsTablet()
    let lottieArr = [
        "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/waiting.json",
        "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/speaking.json",
    ];
    useEffect(() => {
        getData()
    }, [])
    const getData = () => {
        const data = {
            origin,
        };
        axios.get(api.getChineseListenExecise, { params: data }).then((res) => {
            const data = res.data.data
            setData(data)
        });
    }
    const audioPlay = () => {
        setPaused(false)
    };
    const audioPaused = () => {
        setPaused(true)
    };
    const start = () => {
        audioPlay();
    };

    const stop = () => {
        audioPaused();
    };

    const pause = () => {
        audioPaused();
    };
    return (
        <ImageBackground resizeMode="stretch" source={OS === 'android' ? require("../../../../images/chineseHomepage/words/bg_1.png") : require("../../../../images/chineseHomepage/words/bg_1_ios.png")} style={[styles.container, appStyle.flexAliCenter]}>
            <BackBtn left={pxToDp(20)} top={OS === 'ios' ? pxToDp(40) : pxToDp(20)} goBack={() => {
                NavigationUtil.goBack({ navigation });
            }}></BackBtn>
            <ImageBackground style={[{ width: pxToDp(1640), height: OS === 'android' ? pxToDp(1060) : pxToDp(1408), position: "absolute", bottom: pxToDp(-40) }, isPhone ? { height: pxToDpWidthLs(680), width: pxToDpWidthLs(1162) } : null]} resizeMode='stretch' source={OS === 'android' ? require("../../../../images/chineseHomepage/words/bg_2.png") : require("../../../../images/chineseHomepage/words/bg_2_ios.png")}>
                <View style={[{ height: pxToDp(124) }, appStyle.flexCenter, isPhone ? { height: pxToDp(90) } : null]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{title}</Text>
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.flexAliCenter, { paddingBottom: pxToDp(100) }]}>
                    <View style={[{ height: pxToDp(70), marginTop: OS === 'android' ? pxToDp(80) : pxToDp(230) }, appStyle.flexJusCenter, isPhone ? { marginTop: pxToDp(30) } : null]}>
                        <Text style={[{ color: "#475266", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{learning_name}</Text>
                    </View>
                    <TouchableOpacity style={[styles.warp]} onPress={() => {
                        if (paused) {
                            setAudioUrl(data.private_stem_audio)
                            start()
                        } else {
                            pause()
                        }
                    }}>
                        <View style={[{ position: 'absolute', left: pxToDp(30), top: pxToDp(-100), opacity: paused ? 1 : 0 }]}>
                            <Lottie source={{ uri: lottieArr[0] }} autoPlay style={[{ width: pxToDp(386), height: pxToDp(570) }]}></Lottie>
                        </View>
                        <View style={[{ position: 'absolute', left: pxToDp(30), top: pxToDp(-100), opacity: paused ? 0 : 1 }]}>
                            <Lottie source={{ uri: lottieArr[1] }} autoPlay style={[{ width: pxToDp(386), height: pxToDp(570) }]}></Lottie>
                        </View>
                        <View style={[{ position: 'absolute', right: pxToDp(26), bottom: pxToDp(78) }]}>
                            <View style={[styles.wrap, appStyle.flexLine, { transform: [{ rotate: '3deg' }] }]}>
                                {paused ? <>
                                    <Image style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(12) }]} source={require('../../../../images/chineseHomepage/words/icon_4.png')}></Image>
                                    <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>开始听写</Text>
                                </> : <Lottie source={require('./playAudioFFF2CB.json')} autoPlay style={[{ width: pxToDp(110), height: pxToDp(80) }]} />}
                            </View>
                            <View style={[styles.triangle, { transform: [{ rotate: '3deg' }] }]}></View>
                        </View>
                    </TouchableOpacity>
                    <View style={[appStyle.flexLine, { marginTop: pxToDp(48) }]}>
                        {showFinish ? <TouchableOpacity style={[styles.btn]} onPress={() => {
                            const params = {
                                origin: data.origin,
                                exercise_id: data.exercise_id,
                            };
                            axios.post(api.saveChineseListenExecise, params).then((res) => {
                                if (res.data.err_code === 0) {
                                    Toast.info("完成听写", 1);
                                    setShowFinish(false)
                                    setInitAudio(true)
                                    setTimeout(() => {
                                        setInitAudio(false)
                                    }, 500)
                                }
                            });
                        }}>
                            <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>完成听写</Text>
                        </TouchableOpacity> : null}
                        <TouchableOpacity
                            onPress={() => {
                                setVisible(true)
                            }}
                        >
                            <Image
                                source={require("../../../../images/MathSyncDiagnosis/help_btn_1.png")}
                                resizeMode="contain"
                                style={{ width: pxToDp(100), height: pxToDp(100) }}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
            {initAudio ? null : <Audio
                uri={baseURL + audioUrl}
                paused={paused}
                pausedEvent={pause}
                soonEnd={() => {
                    console.log('即将完成:::::::::')
                    setShowFinish(true)
                }}
            />}
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                supportedOrientations={["portrait", "landscape"]}
            >
                <View style={[styles.mContainer]}>
                    <View style={[styles.modalContent]}>
                        <AudioView
                            audioUri={`${baseURL}${data.explanation_audio}`}
                            pausedBtnImg={require("../../../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                            pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                            playBtnImg={require("../../../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                            playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                        />
                        <ScrollView style={{ flex: 1 }}>
                            <RichShowView
                                value={data.knowledgepoint_explanation}
                                width={pxToDp(1100)}
                                size={2}
                            ></RichShowView>
                        </ScrollView>
                    </View>
                    <TouchableOpacity style={[styles.mBtn]} onPress={() => {
                        setVisible(false)
                    }}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}>再练一次</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    warp: {
        width: pxToDp(650),
        height: pxToDp(440),
        backgroundColor: "#F6F6F6",
        borderRadius: pxToDp(100),
        marginTop: pxToDp(78)
    },
    btn: {
        width: pxToDp(364),
        height: pxToDp(124),
        backgroundColor: "#FFAF1B",
        borderRadius: pxToDp(60),
        ...appStyle.flexCenter,
        marginRight: pxToDp(46)
    },
    mContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter,
    },
    modalContent: {
        backgroundColor: "#fff",
        width: pxToDp(1300),
        height: pxToDp(860),
        borderRadius: pxToDp(30),
        paddingTop: pxToDp(60),
        paddingBottom: pxToDp(60),
        paddingLeft: pxToDp(92),
        paddingRight: pxToDp(92)
    },
    mBtn: {
        width: pxToDp(432),
        height: pxToDp(128),
        borderRadius: pxToDp(160),
        backgroundColor: '#FF964A',
        ...appStyle.flexCenter,
        marginTop: pxToDp(-80)
    },
    wrap: {
        width: pxToDp(272),
        height: pxToDp(120),
        backgroundColor: "#4C94FF",
        borderRadius: pxToDp(46),
        ...appStyle.flexCenter
    },
    triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(14),
        borderLeftColor: "transparent",
        borderRightWidth: pxToDp(14),
        borderRightColor: "transparent",
        borderBottomWidth: pxToDp(14),
        borderBottomColor: "transparent",
        borderTopWidth: pxToDp(12),
        borderTopColor: "#4C94FF",
        marginLeft: pxToDp(50),
        marginTop: pxToDp(-6)
    },
});
export default WordsWriting;
