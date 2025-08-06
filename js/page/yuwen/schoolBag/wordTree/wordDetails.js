import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform, ScrollView, Image, DeviceEventEmitter } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _, { words } from 'lodash'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import url from "../../../../util/url";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import EventRegister from "../../../../util/eventListener";

const WordTreeWordDetails = ({ navigation }) => {
    const dispatch = useDispatch()
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, id } = currentUserInfo;
    const { textbook } = useSelector((state) => state.toJS().yuwenInfo);
    const OS = Platform.OS
    const baseURL = url.baseURL;
    const exercise_element_map = {
        "1": "拼音",
        "2": "笔顺",
        "3": "结构",
        "4": "释义",
        '5': '听力'
    }
    const correction_map = {
        "0": require("../../../../images/englishHomepage/ic_excellent.png"),
        "1": require("../../../../images/englishHomepage/ic_error.png")
    }
    const classify_tag_map = {
        I: '重点',
        D: '难点',
        B: '认读',
        T: '拓展',
    };
    const { unit_code, origin, knowledge_point, knowledge_point_code, character } = navigation.state.params.data
    const [details, setDetails] = useState(null)
    useEffect(() => {
        getData()
        const eventListener = DeviceEventEmitter.addListener('refreshDetailsAndHomePage', () => {
            getData()
        });
        return (() => {
            EventRegister.emitEvent("pauseAudioEvent");
            eventListener.remove();
        })
    }, [])
    const getData = () => {
        let params = {
            grade_code: checkGrade,
            term_code: checkTeam,
            textbook,
            student_code: id,
            unit_code,
            origin,
            knowledge_point,
            knowledge_point_code,
        }
        axios.get(api.wordDetail, { params }).then((res) => {
            let data = res.data.data
            data.knowledge_point_arr = data.knowledge_point.split('')
            setDetails(data)
            console.log('word::::::', data)
        });
    }
    const handleTest = () => {
        let params = {
            grade_code: checkGrade,
            term_code: checkTeam,
            textbook,
            student_code: id,
            unit_code,
            origin,
            knowledge_point: character,
        }
        axios.get(api.oneKnowledgeDetail, { params }).then(res => {
            const word = res.data.data.word
            let obj = {
                character,
                unit_code,
                origin,
                knowledge_point_code: details.wb_id, //词的code
                data: {
                    character: [],
                    word,
                },
                type: 'word',
            }
            NavigationUtil.toWordTreeDoExercise({
                navigation,
                data: obj,
            });
        })
    }
    if (!details) {
        return null
    }
    return (
        <ImageBackground resizeMode="stretch" source={OS === 'android' ? require('../../../../images/chineseWordTree/bg_3.png') : require('../../../../images/chineseWordTree/bg_3_ios.png')} style={[styles.container]}>
            <BackBtn goBack={() => {
                NavigationUtil.goBack({ navigation });
            }}></BackBtn>
            <View style={[styles.tagWrap, appStyle.flexLine]}>
                {details.word.map((i, x) => {
                    let tag = <View style={[styles.tagGray]}></View>
                    if (correction_map[i.correction]) {
                        tag = <Image
                            source={correction_map[i.correction]}
                            style={[{ width: pxToDp(40), height: pxToDp(40) }]}
                        />
                    }
                    return <View style={[appStyle.flexLine, { marginRight: pxToDp(40) }]} key={x}>
                        {tag}
                        <View style={[OS === 'android' ? [{ height: pxToDp(40) }, appStyle.flexCenter] : null, { marginLeft: pxToDp(10) }]}>
                            <Text style={[{ color: "#2D3040", fontSize: pxToDp(24) }, appFont.fontFamily_syst_bold]}>{exercise_element_map[i.exercise_element]}</Text>
                        </View>
                    </View>
                })}
            </View>
            <ScrollView style={[{ flex: 1 }, OS === 'ios' ? { marginTop: pxToDp(40) } : null]}>
                <View style={[styles.content1]}>
                    {details.classify_tag ? <View style={[styles.tag]}>
                        <Text style={[{ color: "#6279DC", fontSize: pxToDp(28) }, appFont.fontFamily_syst]}>{classify_tag_map[details.classify_tag]}</Text>
                    </View> : null}
                    <View style={[appStyle.flexTopLine]}>
                        <View style={[appStyle.flexTopLine]}>
                            {details.knowledge_point_arr.map((i, x) => {
                                return <View style={[styles.ziItem, appStyle.flexCenter]} key={x}>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(124) }, appFont.fontFamily_syst_bold]}>{i}</Text>
                                </View>
                            })}
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[appStyle.flexLine, { marginBottom: OS === 'android' ? pxToDp(30) : pxToDp(60) }]}>
                                <PlayAudioBtn audioUri={details.pinyin_1 ? baseURL + details.pinyin_1 : ''}>
                                    <View style={[appStyle.flexLine]}>
                                        <View style={[{ height: pxToDp(60) }]}>
                                            <Text style={[{ color: "#475266", fontSize: pxToDp(48), lineHeight: pxToDp(60) }, appFont.fontFamily_syst_bold]}>{details.pinyin_2}</Text>
                                        </View>
                                        {baseURL + details.pinyin_1 === playingAudio ? <View style={[styles.playingWrap]}></View> : details.pinyin_1 ?
                                            <Image
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
                            </View>
                            <View style={[appStyle.flexTopLine]}>
                                <Text style={[styles.label]}>释义：</Text>
                                <Text style={[styles.des]}>{details.meaning}</Text>
                            </View>
                            {details.word_idiom ? <View style={[appStyle.flexTopLine, OS === 'android' ? { marginTop: pxToDp(-40) } : { marginTop: pxToDp(20) }]}>
                                <Text style={[styles.label]}>造句：</Text>
                                <Text style={[styles.des]}>{details.word_idiom}</Text>
                            </View> : null}
                        </View>
                    </View>
                </View>
                <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                    {details.word_synonym ? <View style={[styles.ciItem]}>
                        <View style={[OS === 'android' ? [{ height: pxToDp(60) }, appStyle.flexJusCenter] : null]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{details.word_synonym}</Text>
                        </View>
                        <View style={[OS === 'android' ? [{ height: pxToDp(42) }, appStyle.flexJusCenter] : null, { marginTop: pxToDp(12) }]}>
                            <Text style={[{ color: "rgba(71, 82, 102, 0.50)", fontSize: pxToDp(32) }, appFont.fontFamily_syst_bold]}>近义词</Text>
                        </View>
                    </View> : null}
                    {details.word_antonym ? <View style={[styles.ciItem, { marginLeft: pxToDp(40) }]}>
                        <View style={[OS === 'android' ? [{ height: pxToDp(60) }, appStyle.flexJusCenter] : null]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{details.word_antonym}</Text>
                        </View>
                        <View style={[OS === 'android' ? [{ height: pxToDp(42) }, appStyle.flexJusCenter] : null, { marginTop: pxToDp(12) }]}>
                            <Text style={[{ color: "rgba(71, 82, 102, 0.50)", fontSize: pxToDp(32) }, appFont.fontFamily_syst_bold]}>反义词</Text>
                        </View>
                    </View> : null}
                    {details.word_confusing ? <View style={[styles.ciItem, { marginLeft: pxToDp(40) }]}>
                        <View style={[OS === 'android' ? [{ height: pxToDp(60) }, appStyle.flexJusCenter] : null]}>
                            <Text style={[{ color: "#475266", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{details.word_confusing}</Text>
                        </View>
                        <View style={[OS === 'android' ? [{ height: pxToDp(42) }, appStyle.flexJusCenter] : null, { marginTop: pxToDp(12) }]}>
                            <Text style={[{ color: "rgba(71, 82, 102, 0.50)", fontSize: pxToDp(32) }, appFont.fontFamily_syst_bold]}>易混淆词语</Text>
                        </View>
                    </View> : null}
                </View>
            </ScrollView>
            {details.status === '1' ? <TouchableOpacity style={[styles.testBtn]} onPress={handleTest}>
                <View style={[styles.testBtnInner, appStyle.flexCenter]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>测一测</Text>
                </View>
            </TouchableOpacity> : null}
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: pxToDp(110)
    },
    content1: {
        width: '100%',
        paddingTop: pxToDp(24),
        paddingBottom: pxToDp(24),
        paddingLeft: pxToDp(34),
        paddingRight: pxToDp(34),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        marginBottom: pxToDp(36)
    },
    tag: {
        height: pxToDp(48),
        width: pxToDp(96),
        borderRadius: pxToDp(200),
        backgroundColor: 'rgba(98, 121, 220, 0.3)',
        marginBottom: pxToDp(40),
        ...appStyle.flexCenter,
    },
    ziItem: {
        width: pxToDp(180),
        height: pxToDp(180),
        borderRadius: pxToDp(18),
        borderWidth: pxToDp(2),
        borderColor: "#D3D3D3",
        overflow: 'hidden',
        marginRight: pxToDp(40)
    },
    label: {
        color: "#475266",
        fontSize: pxToDp(44),
        ...appFont.fontFamily_syst
    },
    des: {
        color: "#475266",
        fontSize: pxToDp(44),
        ...appFont.fontFamily_syst_bold,
        flex: 1
    },
    testBtn: {
        position: "absolute",
        right: pxToDp(40),
        bottom: pxToDp(40),
        width: pxToDp(240),
        height: pxToDp(240),
        borderRadius: pxToDp(120),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8)
    },
    testBtnInner: {
        flex: 1,
        borderRadius: pxToDp(120),
        backgroundColor: "#FF964A"
    },
    ciItem: {
        ...appStyle.flexCenter,
        height: pxToDp(180),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(20),
        marginBottom: pxToDp(40)
    },
    playingWrap: {
        width: pxToDp(30),
        height: pxToDp(30),
        borderRadius: pxToDp(6),
        backgroundColor: "#4C94FF",
        marginLeft: pxToDp(20)
    },
    tagGray: {
        width: pxToDp(36),
        height: pxToDp(36),
        borderRadius: pxToDp(18),
        backgroundColor: "#D9D9D9"
    },
    tagWrap: {
        position: "absolute",
        top: Platform.OS === 'android' ? pxToDp(40) : pxToDp(80),
        right: pxToDp(70)
    }
});
export default WordTreeWordDetails;
