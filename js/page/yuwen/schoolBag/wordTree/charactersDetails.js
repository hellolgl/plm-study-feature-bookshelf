import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, ScrollView, DeviceEventEmitter } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _ from 'lodash'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import url from "../../../../util/url";
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import EventRegister from "../../../../util/eventListener";

const WordTreeCharactersDetails = ({ navigation }) => {
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
    const { unit_code, origin, knowledge_point, knowledge_point_code, wordList, wordListKey } = navigation.state.params.data
    const [details, setDetails] = useState(null)
    useEffect(() => {
        getData()
        const eventListener = DeviceEventEmitter.addListener('refreshDetailsAndHomePage', () => {
            getData()
        });
        return (() => {
            eventListener.remove()
            EventRegister.emitEvent("pauseAudioEvent");
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
        axios.get(api.oneCharacterDetail, { params }).then((res) => {
            let data = res.data.data
            data.word.forEach((i, x) => {
                if (i.knowledge_point.length > 1) {
                    const knowledge_point_arr = i.knowledge_point.split('')
                    data.word[x].knowledge_point_arr = knowledge_point_arr
                }
            })
            // console.log('zi::::::::', data)
            setDetails(data)
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
            knowledge_point,
            knowledge_point_code
        }
        // console.log("ffffff", params)
        axios.get(api.oneKnowledgeDetail, { params }).then(res => {
            const data = {
                ...res.data.data,
                status: details.character.length ? '1' : '0'
            }
            // console.log('===========', res.data.data)
            let obj = {
                character: knowledge_point,
                unit_code,
                origin,
                data,
                type: '',
                knowledge_point_code,
                wordList,
                wordListKey
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
    // const classify_tag = details.character.length ? details.character[0].classify_tag : ''
    return (
        <ImageBackground resizeMode="stretch" source={OS === 'android' ? require('../../../../images/chineseWordTree/bg_3.png') : require('../../../../images/chineseWordTree/bg_3_ios.png')} style={[styles.container]}>
            <BackBtn goBack={() => {
                NavigationUtil.goBack({ navigation });
            }}></BackBtn>
            <View style={[styles.tagWrap, appStyle.flexLine]}>
                {details.character.map((i, x) => {
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
                <View style={[styles.content1, appStyle.flexLine, appStyle.flexJusBetween]}>
                    <View>
                        {details.classify_tag ? <View style={[styles.tag]}>
                            <Text style={[{ color: "#6279DC", fontSize: pxToDp(28) }, appFont.fontFamily_syst]}>{classify_tag_map[details.classify_tag]}</Text>
                        </View> : null}
                        <View style={[appStyle.flexLine]}>
                            <View style={[OS === 'android' ? [{ width: pxToDp(240), height: pxToDp(240) }, appStyle.flexCenter] : null]}>
                                <Text style={[{ color: '#475266', fontSize: pxToDp(200) }, appFont.fontFamily_syst]}>{knowledge_point}</Text>
                            </View>
                            <View style={[appStyle.flexJusBetween, { marginLeft: pxToDp(60) }]}>
                                <View style={[OS === 'ios' ? { marginBottom: pxToDp(60) } : null]}>
                                    <PlayAudioBtn audioUri={details.pinyin_1 ? baseURL + details.pinyin_1 : ''}>
                                        <View style={[appStyle.flexLine]}>
                                            <Text style={[{ color: "#475266", fontSize: pxToDp(48) }, appFont.fontFamily_syst_bold]}>{details.pinyin_2.replaceAll('；', '  ')}</Text>
                                            {baseURL + details.pinyin_1 === playingAudio ? <View style={[styles.playingWrap]}></View> : details.pinyin_1 ? <Image
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
                                <View style={[appStyle.flexLine]}>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst]}>结构：</Text>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold]}>{details.structure}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.orderWrap]}>
                        <Image
                            style={[
                                { width: pxToDp(280), height: pxToDp(280), backgroundColor: "#fff" },
                            ]}
                            source={
                                {
                                    uri: baseURL + details.image_path_1,
                                }
                            }
                        ></Image>
                    </View>
                </View>
                <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold, OS === 'ios' ? { marginTop: pxToDp(20), marginBottom: pxToDp(20) } : null]}>释义</Text>
                <View style={[styles.meaningWrap]}>
                    <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold]}>{details.meaning}</Text>
                </View>
                <Text style={[{ color: "#475266", fontSize: pxToDp(44) }, appFont.fontFamily_syst_bold, OS === 'ios' ? { marginTop: pxToDp(20), marginBottom: pxToDp(20) } : null]}>词组</Text>
                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                    {details.word.map((i, x) => {
                        if (i.knowledge_point_arr) {
                            return <TouchableOpacity style={[styles.wordItem]} key={x} onPress={() => {
                                NavigationUtil.toWordTreeWordDetails({
                                    navigation,
                                    data: { character: knowledge_point, knowledge_point: i.knowledge_point, knowledge_point_code: i.knowledge_point_code, unit_code, origin },
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
            <TouchableOpacity style={[styles.testBtn]} onPress={handleTest}>
                <View style={[styles.testBtnInner, appStyle.flexCenter]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>测一测</Text>
                </View>
            </TouchableOpacity>
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
        height: pxToDp(380),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40)
    },
    orderWrap: {
        width: pxToDp(280),
        height: pxToDp(280),
        borderRadius: pxToDp(18),
        borderWidth: pxToDp(2),
        borderColor: '#D3D3D3',
        overflow: "hidden"
    },
    tag: {
        height: pxToDp(48),
        width: pxToDp(96),
        borderRadius: pxToDp(200),
        backgroundColor: 'rgba(98, 121, 220, 0.3)',
        ...appStyle.flexCenter
    },
    meaningWrap: {
        width: "100%",
        padding: Platform.OS === 'android' ? pxToDp(12) : pxToDp(36),
        borderRadius: pxToDp(20),
        backgroundColor: "#fff"
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
export default WordTreeCharactersDetails;
