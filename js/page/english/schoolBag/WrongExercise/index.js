import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    ScrollView,
    Dimensions,
    SafeAreaView,
    DeviceEventEmitter
} from "react-native";
import AiTalk from "./index";
import { pxToDp } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { appFont, appStyle } from "../../../../theme";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import Lottie from "lottie-react-native";
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import AutoImage from '../../../../component/math/Topic/AutoImage'
// import { changeTopicData } from "../../tools";
import { haveNbsp } from '../Sentences/tools'
import _ from 'lodash'

const modules = [
    {
        label: 'ABCs',
        key: '3'
    },
    {
        label: 'Words',
        key: '1'
    },
    {
        label: 'Test me',
        key: '2'
    },
    {
        label: 'Grammar',
        key: '4'
    },
]

const times = [
    {
        label: '今日错题',
        key: 'today'
    },
    {
        label: '本周错题',
        key: 'week'
    },
    {
        label: '本月错题',
        key: 'month'
    },
    {
        label: '本学期错题',
        key: ''
    }
]

function EnglishWrongExercise(props) {
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { checkGrade, checkTeam } = currentUserInfo
    const { textBookCode } = useSelector(
        (state) => state.toJS().bagMath
    );
    const [moduleIndex, setModuleIndex] = useState(0)
    const [timeIndex, setTimeIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [page, setPage] = useState(1)
    const [pageTotal, setPageTotal] = useState(0)
    const os = Platform.OS
    const page_size = useRef(10)
    const key = modules[moduleIndex].key

    useEffect(() => {
        if (page === 1) {
            getList()
        }
    }, [moduleIndex, timeIndex, page]);

    useEffect(() => {
        if (page > 1) {
            getList()
        }
    }, [page]);

    const getList = (_typeIndex, _thinkType) => {
        setLoading(true)
        let params = {
            modular: modules[moduleIndex].key,
            query_type: times[timeIndex].key,
            page,
            grade_code: checkGrade,
            term_code: checkTeam,
        }
        // console.log('params::::::::::', params)
        axios.get(api.getEnglishWrongRecords, { params }).then(res => {
            // console.log('list:::::::::', res.data.data)
            const total = res.data.total
            let data = res.data.data
            if (total > 0) {
                const pages = Math.ceil(total / page_size.current)
                if (pages === 1 && page > 1) {
                    setPage(1)
                }
                setPageTotal(pages)
            } else {
                setPageTotal(0)
            }
            setList(data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const selectModule = (i, x) => {
        setModuleIndex(x)
        if (page > 1) {
            setPage(1)
        }
    }
    const selectTime = (i, x) => {
        setTimeIndex(x)
        if (page > 1) {
            setPage(1)
        }
    }
    const next = (lastPage) => {
        let v = page + 1
        if (lastPage) {
            v = lastPage
        }
        setPage(v)
    }
    const pre = (firstPage) => {
        let v = page - 1
        if (firstPage) {
            v = firstPage
        }
        setPage(v)
    }
    const clickItem = (i) => {
        if (key === '3') {
            if (i.exercise_type === 'abc_line') {
                NavigationUtil.toMixDoWrongExercise({
                    ...props,
                    data: { ...i },
                });
            } else {
                NavigationUtil.toEnglishAbcsExerciseDoWrong({
                    ...props,
                    data: { exercise_id: i.exercise_id },
                });
            }
        }
        if (key === '1') {
            NavigationUtil.toEnglishTextMeWrong({
                ...props,
                data: { exercise_id: i.exercise_id },
            });
        }
        if (key === '2') {
            NavigationUtil.toEnglishTextMeWrong({
                ...props,
                data: { exercise_id: i.exercise_id },
            });
        }
        if (key === '4') {
            NavigationUtil.toEnSentencesLearnTodayRecordDoExercise({
                ...props,
                data: { se_id: i.se_id },
            });
        }
    }
    const getDes = (i) => {
        if (key === '3') {
            // abcs
            if (i.exercise_type === 'abc_line') {
                return 'Mix&Match'
            } else {
                return 'First Letters'
            }
        }
        if (key === '1')
            return null
    }
    const renderStem = (i) => {
        const { exercise_data_type, private_stem_picture } = i
        let private_exercise_stem = i.private_exercise_stem
        if (key === '3') {
            if (i.exercise_type === 'abc_line') {
                private_exercise_stem = i.stem
            }
        }
        if (key === '4') {
            return <View>
                <Text style={[{ fontSize: pxToDp(36), color: '#ACB2BC' }, appFont.fontFamily_jcyt_500, Platform.OS === 'android' ? { marginBottom: pxToDp(0) } : null]}>{i.common_stem}</Text>
                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                    {i.sentence_stem && i.sentence_stem.length ? i.sentence_stem.map((item, index) => {
                        return (
                            <Text
                                style={[{ fontSize: pxToDp(40), color: "#445368", lineHeight: pxToDp(76), }, appFont.fontFamily_jcyt_700]} key={index}>
                                {index > 0 ? haveNbsp(item.content) : ''}{item.content}
                            </Text>
                        );
                    }) : null}
                </View>
            </View>
        }
        return <View>
            <RichShowViewHtml size={40} value={`<div id="yuanti">${private_exercise_stem}</div>`} color={styles.stemTxt.color} p_style={{ lineHeight: pxToDp(50) }}></RichShowViewHtml>
            <AutoImage url={private_stem_picture}></AutoImage>
        </View>
    }
    return (
        <ImageBackground style={[styles.container]} source={os === 'ios' ? require('../../../../images/englishWrongExercise/bg_1_i.png') : require('../../../../images/englishWrongExercise/bg_1.png')}>
            <TouchableOpacity style={[styles.backBtn]} onPress={() => {
                NavigationUtil.goBack(props);
            }}>
                <Image style={[{ width: pxToDp(120), height: pxToDp(80) }]} source={require("../../../../images/chineseHomepage/pingyin/new/back.png")} />
            </TouchableOpacity>
            <View style={[appStyle.flexAliCenter]}>
                <Text style={[styles.title]}>英语错题集</Text>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.content, appStyle.flexTopLine]}>
                    <View style={[styles.left]}>
                        <ScrollView flex={1}>
                            {modules.map((i, x) => {
                                const active = moduleIndex === x
                                return <TouchableOpacity style={[styles.leftItem, active ? { backgroundColor: '#851FFF' } : null]} key={i.key} onPress={() => {
                                    selectModule(i, x)
                                }}>
                                    <View style={[styles.leftItemInner, appStyle.flexCenter, active ? { backgroundColor: '#D8B3FF' } : null]}>
                                        <Text style={[{ color: '#475266', fontSize: pxToDp(40), ...appFont.fontFamily_jcyt_500 }, active ? appFont.fontFamily_jcyt_700 : null]}>{i.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                    </View>
                    <View style={[styles.right, { flex: 1 }]}>
                        <View style={[styles.timesWrap]}>
                            <View style={[styles.timesWrapInner, appStyle.flexLine]}>
                                {times.map((i, x) => {
                                    const active = timeIndex === x
                                    return <TouchableOpacity style={[styles.timeItem, active ? { backgroundColor: '#851FFF' } : null]} key={i.key} onPress={() => {
                                        selectTime(i, x)
                                    }}>
                                        <View style={[styles.timeItemInner, appStyle.flexCenter, active ? { backgroundColor: '#D8B3FF' } : null]}>
                                            <Text style={[{ color: '#475266', fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </View>
                        <View style={[styles.listWrap, !list.length || loading ? appStyle.flexCenter : null, { flex: 1 }]}>
                            {loading ? <Lottie
                                source={require("../../../../res/json/wordIseLoading.json")}
                                autoPlay
                                style={[
                                    { width: pxToDp(100), height: pxToDp(100) },
                                ]}
                            /> : !list.length ? <Image
                                source={require("../../../../images/square/noData.png")}
                                style={[{ width: pxToDp(592), height: pxToDp(568) }]}
                                resizeMode='contain'
                            /> : <ScrollView flex={1}>
                                {list.map((i, x) => {
                                    return <TouchableOpacity key={x} style={[styles.item]} onPress={() => {
                                        clickItem(i)
                                    }}>
                                        <View style={[styles.itemInner, appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                            <View style={{ marginRight: pxToDp(100), flex: 1 }}>
                                                {getDes(i) ? <View style={[appStyle.flexLine, { marginBottom: pxToDp(26) }]}>
                                                    <View style={[styles.desWrap, appStyle.flexCenter]}>
                                                        <Text style={[{ color: "#8F42EB", fontSize: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{getDes(i)}</Text>
                                                    </View>
                                                </View> : null}
                                                {renderStem(i)}
                                            </View>
                                            <Image source={require("../../../../images/chineseHomepage/flow/flowGo.png")} style={[{ width: pxToDp(22), height: pxToDp(38) }]} />
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </ScrollView>}
                        </View>
                    </View>
                </View>
            </SafeAreaView>

            {!pageTotal ? null : <View style={[styles.pageWrap, appStyle.flexLine]}>
                <View style={[{ width: pxToDp(136), height: pxToDp(92) }, appStyle.flexLine]}>
                    {page > 1 ? <>
                        <TouchableOpacity onPress={() => {
                            pre(1)
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/englishWrongExercise/icon_left_2.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            pre()
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/englishWrongExercise/icon_left_1.png')}></Image>
                        </TouchableOpacity>
                    </> : null}
                </View>
                <View style={[styles.page]}>
                    <View style={[styles.pageInner, appStyle.flexCenter]}>
                        <Text style={[{ color: '#475266', fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_500]}>{page}/{pageTotal}</Text>
                    </View>
                </View>
                <View style={[{ width: pxToDp(136), height: pxToDp(92) }, appStyle.flexLine]}>
                    {page !== pageTotal ? <>
                        <TouchableOpacity onPress={() => {
                            next()
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/englishWrongExercise/icon_right_2.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            next(pageTotal)
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/englishWrongExercise/icon_right_1.png')}></Image>
                        </TouchableOpacity>
                    </> : null}
                </View>
            </View>}
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backBtn: {
        position: "absolute",
        top: pxToDp(46),
        left: pxToDp(36),
        zIndex: 1
    },
    title: {
        color: '#475266',
        fontSize: pxToDp(48),
        ...appFont.fontFamily_jcyt_700,
        paddingTop: Platform.OS === 'ios' ? pxToDp(62) : pxToDp(40),
        paddingBottom: Platform.OS === 'ios' ? pxToDp(46) : pxToDp(20)
    },
    content: {
        flex: 1,
        paddingRight: pxToDp(86)
    },
    left: {
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        paddingTop: pxToDp(50)
    },
    leftItem: {
        width: pxToDp(320),
        height: pxToDp(120),
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(30),
        backgroundColor: 'transparent',
        marginBottom: pxToDp(20)
    },
    leftItemInner: {
        flex: 1,
        borderRadius: pxToDp(30),
        backgroundColor: 'transparent',
    },
    timesWrap: {
        width: pxToDp(1220),
        height: pxToDp(108),
        borderRadius: pxToDp(80),
        paddingBottom: pxToDp(8),
        backgroundColor: "#DAE2F2",
        marginBottom: pxToDp(14)
    },
    timesWrapInner: {
        flex: 1,
        borderRadius: pxToDp(80),
        backgroundColor: '#fff',
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20)
    },
    timeItem: {
        width: pxToDp(280),
        height: pxToDp(80),
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(140),
        backgroundColor: "transparent",
        marginRight: pxToDp(20)
    },
    timeItemInner: {
        flex: 1,
        backgroundColor: "transparent",
        borderRadius: pxToDp(140),
    },
    typeItem: {
        height: pxToDp(80),
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(140),
        backgroundColor: "transparent",
        marginRight: pxToDp(20),
    },
    pageWrap: {
        height: pxToDp(92),
        minWidth: pxToDp(438),
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12),
        backgroundColor: 'rgba(71,82,102,0.25)',
        borderRadius: pxToDp(78),
        position: 'absolute',
        right: pxToDp(50),
        bottom: pxToDp(32)
    },
    pageIcon: {
        width: pxToDp(68),
        height: pxToDp(68)
    },
    page: {
        height: pxToDp(80),
        borderRadius: pxToDp(50),
        padding: pxToDp(8),
        borderColor: "#851FFF",
        borderWidth: pxToDp(4),
        backgroundColor: '#fff'
    },
    pageInner: {
        minWidth: pxToDp(118),
        height: '100%',
        backgroundColor: "#D8B3FF",
        borderRadius: pxToDp(50),
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12)
    },
    item: {
        width: '100%',
        paddingBottom: pxToDp(8),
        backgroundColor: '#DAE2F2',
        marginBottom: pxToDp(14),
        borderRadius: pxToDp(40)
    },
    itemInner: {
        minHeight: pxToDp(200),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
        paddingTop: pxToDp(22),
        paddingBottom: pxToDp(22),
        paddingLeft: pxToDp(52),
        paddingRight: pxToDp(52)
    },
    desWrap: {
        height: pxToDp(48),
        borderRadius: pxToDp(44),
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12),
        backgroundColor: '#EFD5FF',
        marginRight: pxToDp(32)
    },
    stemTxt: {
        color: '#475266',
        fontSize: pxToDp(40),
        lineHeight: pxToDp(50),
        ...appFont.fontFamily_jcyt_700
    },
    spaceLine: {
        width: pxToDp(80),
        height: pxToDp(4),
        backgroundColor: '#475266'
    },
    fractionLine: {
        width: "100%",
        backgroundColor: "#475266",
        height: pxToDp(6)
    }
});
export default EnglishWrongExercise;
