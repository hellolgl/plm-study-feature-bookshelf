import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, ScrollView, TouchableWithoutFeedback, Dimensions } from "react-native";
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

const WordsWordStudy = ({ navigation }) => {
    const dispatch = useDispatch()
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, grade, term } = currentUserInfo
    const { origin, wb_id } = navigation.state.params.data
    const [list, setList] = useState([])
    const [details, setDetails] = useState({})
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
    const getData = () => {
        const data = {
            origin,
            wb_id
        }
        axios.get(api.courseWordDetail, { params: data }).then(res => {
            const data = res.data.data
            console.log('oooooooo', data)
            data.knowledge_point_arr = data.knowledge_point.split('')
            setDetails(data)
        })
    }
    return (
        <ImageBackground resizeMode="stretch" source={require("../../../../images/chineseHomepage/flow/flowBg.png")} style={[styles.container]}>
            <View style={[appStyle.flexCenter, styles.header]}>
                <BackBtn left={pxToDp(20)} top={OS === 'ios' ? pxToDp(40) : pxToDp(20)} goBack={() => {
                    NavigationUtil.goBack({ navigation });
                }}></BackBtn>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingLeft: pxToDp(140), paddingRight: pxToDp(88) }}>
                    <View style={[styles.content1]}>
                        {details.classify_tag ? <View style={[styles.tag]}>
                            <Text style={[{ color: "#6279DC", fontSize: pxToDp(28) }, appFont.fontFamily_syst]}>{classify_tag_map[details.classify_tag]}</Text>
                        </View> : null}
                        <View style={[appStyle.flexTopLine]}>
                            <View style={[appStyle.flexTopLine]}>
                                {details.knowledge_point_arr && details.knowledge_point_arr.map((i, x) => {
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
            </View>
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
    playingWrap: {
        width: pxToDp(30),
        height: pxToDp(30),
        borderRadius: pxToDp(6),
        backgroundColor: "#4C94FF",
        marginLeft: pxToDp(20)
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
});
export default WordsWordStudy;
