import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, ScrollView, TouchableWithoutFeedback, Dimensions, DeviceEventEmitter } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _ from 'lodash'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import url from "../../../../util/url";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WordsStudy = ({ navigation }) => {
    const dispatch = useDispatch()
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, grade, term } = currentUserInfo
    const { origin, learning_name } = navigation.state.params.data
    const [list, setList] = useState([])
    const [knowledgeIndex, setKnowledgeIndex] = useState([0, 0])
    const [details, setDetails] = useState({})
    const [btn_message, setBtn_message] = useState({ x: 0, y: 0 })
    const [show, setShow] = useState(false)
    const OS = Platform.OS
    const baseURL = url.baseURL;
    const classify_tag_map = {
        I: '重点',
        D: '难点',
        B: '认读',
        T: '拓展',
    };
    useEffect(() => {
        getData()
    }, [])
    useEffect(() => {
        const eventListener = DeviceEventEmitter.addListener('refreshPage', (data) => {
            getData()
        });
        return (() => {
            eventListener.remove()
        })
    }, [])
    useEffect(() => {
        if (list.length) {
            getDetails()
        }
    }, [knowledgeIndex, list])
    const getData = () => {
        const data = {
            origin
        }
        axios.get(api.courseCharacter, { params: data }).then(res => {
            const data = res.data.data.data
            let arr = []
            for (let i in data) {
                arr.push({
                    classifyTag: classify_tag_map[i],
                    data: data[i]
                })
            }
            console.log('******', arr, data)
            setList(arr)
        })
    }
    const clickKnowledge = (x, ii, xx) => {
        setKnowledgeIndex([x, xx])
    }
    const getDetails = () => {
        const index_1 = knowledgeIndex[0]
        const index_2 = knowledgeIndex[1]
        const item = list[index_1].data[index_2]
        const { origin, wb_id, knowledge_point } = item
        const params = {
            origin,
            wb_id,
            knowledge_point
        }
        // console.log('ppppp', params, index_1, index_2, list)
        axios.get(api.courseCharacterDetail, { params }).then(res => {
            const data = res.data.data
            // console.log('======', data)
            data.word.forEach((i, x) => {
                if (i.knowledge_point.length > 1) {
                    const knowledge_point_arr = i.knowledge_point.split('')
                    data.word[x].knowledge_point_arr = knowledge_point_arr
                }
            })
            setDetails({ ...data, knowledge_point, origin })
        })
    }
    const { knowledge_point, pinyin_1, pinyin_2, structure, image_path_1, meaning, word } = details
    return (
        <ImageBackground resizeMode="stretch" source={require("../../../../images/chineseHomepage/flow/flowBg.png")} style={[styles.container]}>
            <View style={[appStyle.flexCenter, styles.header]}>
                <BackBtn left={pxToDp(20)} top={OS === 'ios' ? pxToDp(40) : pxToDp(20)} goBack={() => {
                    NavigationUtil.goBack({ navigation });
                }}></BackBtn>
                <Text style={[{ color: '#475266', fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}>字词积累</Text>
            </View>
            <TouchableOpacity style={[styles.btn, { top: OS === 'android' ? pxToDp(30) : pxToDp(60), right: pxToDp(46) }]} onLayout={(e) => {
                const { x, y } = e.nativeEvent.layout
                setBtn_message({ x, y })
            }} onPress={() => {
                setShow(true)
            }}>
                <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_2.png')}></Image>
                <Text style={[styles.btnTxt]}>规则</Text>
            </TouchableOpacity>
            <View style={[appStyle.flexTopLine, styles.content]}>
                <View style={[styles.left]}>
                    <ScrollView style={{ flex: 1 }}>
                        {list.map((i, x) => {
                            return <View style={[styles.item]} key={x}>
                                <View style={[styles.typeWrap, appStyle.flexCenter]}>
                                    <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{i.classifyTag}</Text>
                                </View>
                                {i.data && i.data.map((ii, xx) => {
                                    const { knowledge_point, correction } = ii  //correction 0错误 1正确
                                    return <TouchableOpacity style={[styles.knowledgeItem, knowledgeIndex.join().replaceAll(',', '') === `${x}${xx}` ? { borderColor: '#FF9E4E', backgroundColor: '#FFF1CD' } : null]} key={xx} onPress={() => {
                                        clickKnowledge(x, ii, xx)
                                    }}>
                                        <View style={[styles.knowledgeItemInner1, { backgroundColor: correction === '0' ? '#FF7575' : correction === '1' ? '#4ED5A8' : '#EDEDF4' }]}>
                                            <View style={[styles.knowledgeItemInner2, { backgroundColor: correction === '0' ? '#FF9797' : correction === '1' ? '#87EDCB' : '#fff' }]}>
                                                <Text style={[{ color: "#475266", fontSize: pxToDp(64) }, appFont.fontFamily_syst_bold]}>{knowledge_point}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        })}
                    </ScrollView>
                </View>
                <View style={[styles.right]}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.flexTopLine, appStyle.flexLineWrap, appStyle.flexJusBetween, { paddingTop: pxToDp(28), paddingLeft: pxToDp(14) }]}>
                        <View style={[styles.wrap1, appStyle.flexLine, appStyle.flexJusBetween, { height: pxToDp(380) }]}>
                            <View style={[appStyle.flexLine]}>
                                <View style={[{ width: pxToDp(240), height: pxToDp(240) }, appStyle.flexCenter]}>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(200) }, OS === 'ios' ? { marginTop: pxToDp(-30) } : null, appFont.fontFamily_syst_bold]}>{knowledge_point}</Text>
                                </View>
                                <View style={[{ height: pxToDp(172), marginLeft: pxToDp(40) }, appStyle.flexJusBetween]}>
                                    <PlayAudioBtn audioUri={pinyin_1 ? baseURL + pinyin_1 : ''}>
                                        <View style={[appStyle.flexLine]}>
                                            <View style={[{ height: pxToDp(62) }, appStyle.flexJusCenter]}>
                                                <Text style={[{ color: "#475266", fontSize: pxToDp(48), lineHeight: pxToDp(58) }, appFont.fontFamily_syst_bold]}>{pinyin_2 && pinyin_2.replaceAll('；', '  ')}</Text>
                                            </View>
                                            {baseURL + pinyin_1 === playingAudio ? <View style={[styles.playingWrap]}></View> : pinyin_1 ? <Image
                                                style={{
                                                    width: pxToDp(40),
                                                    height: pxToDp(40),
                                                    marginLeft: pxToDp(20),
                                                    resizeMode: "contain",
                                                }}
                                                resizeMode="contain"
                                                source={require("../../../../images/chineseHomepage/pingyin/new/wordAudio.png")}
                                            /> : null}
                                        </View>
                                    </PlayAudioBtn>
                                    <View style={[appStyle.flexLine, OS === 'android' ? { height: pxToDp(48) } : null]}>
                                        <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst]}>结构：</Text>
                                        <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold]}>{structure}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.orderWrap]}>
                                <Image style={[{ width: pxToDp(280), height: pxToDp(280), backgroundColor: "#fff" },]} source={{ uri: baseURL + image_path_1, }}
                                ></Image>
                            </View>
                        </View>
                        <View style={[{ height: pxToDp(50), marginBottom: pxToDp(12), marginTop: pxToDp(26) }, appStyle.flexJusCenter]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(44), lineHeight: pxToDp(56) }, appFont.fontFamily_syst_bold]}>释义</Text>
                        </View>
                        <View style={[styles.wrap1, OS === 'ios' ? { paddingTop: pxToDp(36), paddingBottom: pxToDp(36) } : null]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold]}>{meaning}</Text>
                        </View>
                        <View style={[{ height: pxToDp(50), marginBottom: pxToDp(12), marginTop: pxToDp(26) }, appStyle.flexJusCenter]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(44), lineHeight: pxToDp(56) }, appFont.fontFamily_syst_bold]}>词组</Text>
                        </View>
                        <View style={[styles.wrap1, appStyle.flexLine, appStyle.flexLineWrap]}>
                            {word && word.map((i, x) => {
                                if (i.knowledge_point_arr) {
                                    return <TouchableOpacity style={[styles.wordItem]} key={x} onPress={() => {
                                        NavigationUtil.toWordsWordStudy({
                                            navigation,
                                            data: { origin: details.origin, wb_id: i.knowledge_point_code },
                                        });
                                    }}>
                                        <View style={[styles.wordItemInner, appStyle.flexLine]}>
                                            {
                                                i.knowledge_point_arr.map((ii, xx) => {
                                                    return <Text style={[{ color: ii === knowledge_point ? "#FF964A" : "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold]} key={xx}>{ii}</Text>
                                                })
                                            }
                                        </View>
                                    </TouchableOpacity>
                                }
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
            {show ? <View style={[styles.modal]}>
                <TouchableWithoutFeedback onPress={() => {
                    setShow(false)
                }}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <View style={[styles.btn, { top: btn_message.y, left: btn_message.x }]}>
                    <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_2.png')}></Image>
                    <Text style={[styles.btnTxt]}>规则</Text>
                </View>
                <View style={[styles.modalContent, { right: pxToDp(46), width: pxToDp(366) }]}>
                    <View style={styles.triangle_up}></View>
                    <View style={[styles.modalContentInner, appStyle.flexAliCenter]}>
                        <View style={[styles.modalTip, { marginBottom: pxToDp(40) }]}>
                            <Text style={[styles.modalTipTxt]}>未掌握</Text>
                        </View>
                        <View style={[styles.modalTip, { backgroundColor: "#87EDCB" }]}>
                            <Text style={[styles.modalTipTxt]}>已掌握</Text>
                        </View>
                    </View>
                </View>
            </View> : null}
            <TouchableOpacity style={[styles.testBtn]} onPress={() => {
                NavigationUtil.toWordAccumulation({
                    navigation,
                    data: { origin, learning_name },
                });
            }}>
                <View style={[styles.testBtnInner, appStyle.flexCenter]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>课文诊断</Text>
                </View>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: Platform.OS === 'ios' ? pxToDp(160) : pxToDp(120),
    },
    content: {
        paddingLeft: pxToDp(86),
        paddingRight: pxToDp(150),
        flex: 1
    },
    left: {
        width: pxToDp(256),
        marginRight: pxToDp(34)
    },
    item: {
        marginBottom: pxToDp(24)
    },
    typeWrap: {
        height: pxToDp(60),
        borderRadius: pxToDp(48),
        width: pxToDp(156),
        backgroundColor: "#FFB137",
        marginBottom: pxToDp(24)
    },
    right: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(60),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: pxToDp(32)
    },
    wrap1: {
        width: '100%',
        backgroundColor: "#F7F8FC",
        borderRadius: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(188)
    },
    testBtn: {
        width: pxToDp(240),
        height: pxToDp(240),
        borderRadius: pxToDp(120),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
        position: "absolute",
        right: pxToDp(40),
        bottom: pxToDp(100)
    },
    testBtnInner: {
        flex: 1,
        backgroundColor: '#FF964A',
        borderRadius: pxToDp(120),
    },
    knowledgeItem: {
        width: pxToDp(256),
        height: pxToDp(176),
        borderWidth: pxToDp(6),
        borderColor: 'transparent',
        borderRadius: pxToDp(44),
        padding: pxToDp(8),
    },
    knowledgeItemInner1: {
        flex: 1,
        backgroundColor: "#FF7575",
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8)
    },
    knowledgeItemInner2: {
        flex: 1,
        ...appStyle.flexCenter,
        backgroundColor: "#FF9797",
        borderRadius: pxToDp(40)
    },
    playingWrap: {
        width: pxToDp(30),
        height: pxToDp(30),
        borderRadius: pxToDp(6),
        backgroundColor: "#4C94FF",
        marginLeft: pxToDp(20)
    },
    orderWrap: {
        width: pxToDp(280),
        height: pxToDp(280),
        borderRadius: pxToDp(18),
        borderWidth: pxToDp(2),
        borderColor: '#D3D3D3',
        overflow: "hidden"
    },
    wordItem: {
        backgroundColor: "#E8EBF0",
        paddingBottom: pxToDp(8),
        marginRight: pxToDp(40),
        borderRadius: pxToDp(20),
        height: pxToDp(140),
        marginBottom: pxToDp(40)
    },
    wordItemInner: {
        height: '100%',
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(20)
    },
    btn: {
        width: pxToDp(156),
        height: pxToDp(80),
        borderRadius: pxToDp(100),
        backgroundColor: "#FAFAFA",
        position: "absolute",
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    btnIcon: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginRight: pxToDp(12)
    },
    btnTxt: {
        color: "#FF964A",
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700
    },
    modal: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    },
    modalContent: {
        width: pxToDp(480),
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8),
        backgroundColor: '#DAE2F2',
        position: 'absolute',
        right: pxToDp(230),
        top: Platform.OS === 'android' ? pxToDp(140) : pxToDp(170)
    },
    modalContentInner: {
        flex: 1,
        padding: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40)
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: "transparent",
        borderRightWidth: pxToDp(16),
        borderRightColor: "transparent",
        borderBottomWidth: pxToDp(20),
        borderBottomColor: "#fff",
        position: "absolute",
        top: pxToDp(-18),
        right: pxToDp(40)
    },
    click_region: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(71, 82, 102, 0.5)",
    },
    modalTip: {
        width: pxToDp(270),
        height: pxToDp(60),
        backgroundColor: "#FF9797",
        borderRadius: pxToDp(10),
        ...appStyle.flexCenter
    },
    modalTipTxt: {
        color: "#475266",
        fontSize: pxToDp(28),
        ...appFont.fontFamily_jcyt_700
    },
});
export default WordsStudy;
