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
import topaicTypes from "../../../../res/data/MathTopaicType";
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import AutoImage from '../../../../component/math/Topic/AutoImage'
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil";
import { changeTopicData } from "../../tools";
import _ from 'lodash'

const modules = [
    {
        label: '数学同步',
        key: 'math_mathTongbuHomePage'
    },
    {
        label: '智能学习计划',
        key: 'math_AIPractice'
    },
    {
        label: '知识图谱',
        key: 'math_knowledgeGraph'
    },
    {
        label: '思维训练',
        key: 'math_thinkingTraining'
    },
    {
        label: '巧算',
        key: 'math_cleverCalculation'
    }
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
        key: 'all'
    }
]

function WrongExercise(props) {
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
    const [thinkType, setThinkType] = useState([])
    const [typeIndex, setTypeIndex] = useState(0)
    const [page, setPage] = useState(1)
    const [pageTotal, setPageTotal] = useState(0)
    const os = Platform.OS
    const page_size = useRef(10)
    const key = modules[moduleIndex].key

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('refreshWrongPage', (data) => {
            // 处理接收到的数据
            getList()
        });
        return () => {
            listener.remove(); // 组件卸载时移除监听
        };
    }, [timeIndex, page, moduleIndex, typeIndex, thinkType])

    useEffect(() => {
        if (page === 1) {
            getList()
            if (moduleIndex === 3) {
                getType()
            }
        }
    }, [moduleIndex, timeIndex, page]);

    useEffect(() => {
        if (page > 1) {
            getList()
        }
    }, [page]);

    const getType = () => {
        axios.get(api.getThinkingType, { params: { query_type: times[timeIndex].key } }).then(res => {
            setThinkType(res.data.data)
            if (res.data.data.length) {
                getList(typeIndex, res.data.data)
            }
        })
    }
    const getList = (_typeIndex, _thinkType) => {
        setLoading(true)
        let params = {
            query_type: times[timeIndex].key,
            page,
            page_size: page_size.current
        }
        let service = undefined
        if (key === 'math_mathTongbuHomePage') {
            // 同步
            params = {
                ...params,
                textbook: textBookCode,
                grade_code: checkGrade,
                term_code: checkTeam,
            }
            service = api.getMathSyncDiagnosisErr
        }
        if (key === 'math_AIPractice') {
            params = {
                ...params,
                textbook: textBookCode,
                grade_code: checkGrade,
                term_code: checkTeam,
            }
            service = api.getMathAIPracticeErr
        }
        if (key === 'math_knowledgeGraph') {
            params = {
                ...params,
                textbook: textBookCode,
                grade_code: checkGrade,
                term_code: checkTeam,
            }
            service = api.getMathElementErr
        }

        const types = _thinkType ? _thinkType : thinkType
        const index = _typeIndex || _typeIndex === 0 ? _typeIndex : typeIndex
        // console.log('+++++++++++',types,index)
        if (key === 'math_thinkingTraining' && types[index]) {
            params = {
                ...params,
                t_t_id: types[index].t_t_id
            }
            service = api.getThinkingErr
        }
        if (key === 'math_cleverCalculation') {
            params = {
                ...params,
                textbook: textBookCode,
                grade_code: checkGrade,
                term_code: checkTeam,
            }
            service = api.getMathExpandErr
        }
        console.log('params::::::::::', key, service, params)
        if (service) {
            axios.get(service, { params }).then(res => {
                const total = res.data.data.total
                let data = res.data.data.data
                console.log('list:::::::::', res.data.data)
                data.forEach((i, x) => {
                    if (key === 'math_knowledgeGraph' || key === 'math_AIPractice' || key === 'math_cleverCalculation') {
                        i.public_exercise_stem = i.exercise_stem
                        if (key === 'math_cleverCalculation') {
                            i.displayed_type = i.display_type_name
                            i.displayed_type_name = i.display_type_name
                            i.exercise_data_type = i.topic_type
                            i.public_exercise_image = i.exercise_stem_img
                        }
                    }
                    if (key === 'math_thinkingTraining') {
                        i.public_exercise_stem = i.stem
                        i.public_exercise_image = i.stem_img ? i.stem_img : i.sub_img //sub_img:题干图片 stem_img:图片点选题图片
                        i.exercise_data_type = i.data_type
                    }
                })
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
            }).catch(err => {
                console.log('hhhhh', err)
            })
        } else {
            setLoading(false)
            setList([])
        }
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
    const selectType = (x) => {
        setTypeIndex(x)
        if (page > 1) {
            setPage(1)
        } else {
            getList(x)
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
        const title = modules[moduleIndex].label + '错题'
        let data = {
            key,
            title
        }
        const arr_1 = ['math_mathTongbuHomePage', 'math_knowledgeGraph', 'math_AIPractice']
        if (arr_1.includes(key)) {
            if (key === 'math_mathTongbuHomePage') {
                data.s_w_id = i.s_w_id
                data.m_e_s_id = i.m_e_s_id
            }
            if (key === 'math_knowledgeGraph') {
                data.e_w_id = i.e_w_id
                data.ex_id = i.ex_id
            }
            if (key === 'math_AIPractice') {
                data.e_s_id = i.e_s_id
                data.exercise_id = i.exercise_id
                data.module_type = i.module_type
            }
            NavigationUtil.toMathSyncDiagnosisDoWrong({
                ...props,
                data: { ...data },
            });
        } else {
            if (key === 'math_thinkingTraining') {
                MathNavigationUtil.toMathReDoExercisePage({ ...props, data: { tsid: i.t_s_id, twid: i.t_w_id } })
            }
            if (key === 'math_cleverCalculation') {
                const _i = _.cloneDeep(i)
                if (_i.topic_type === 'ZS') _i.topic_type = '0'
                let currentTopic = changeTopicData(_i, 'easyCalculation')
                currentTopic._correct = -1
                MathNavigationUtil.toEasyCalculationDoWrongExercise({ ...props, data: { currentTopic: { ...currentTopic } } })
            }
        }
    }
    const getDes = (i) => {
        if (key === 'math_mathTongbuHomePage') {
            return `${i.unit_name}  课时  ${i.lesson_name}`
        }
        if (key === 'math_AIPractice') {
            if (i.module_type === 'sync') {
                return `${i.unit_name} ${i.knowledge_name ? '知识点 ' + i.knowledge_name : ''}`
            } else {
                return `${i.unit_name} 知识点 ${i.knowledge_name}`
            }
        }
        if (key === 'math_knowledgeGraph') {
            return `${i.unit_name} ${i.knowledge_name}`
        }
        if (key === 'math_cleverCalculation') {
            return `${i.expand_name}`
        }
        if (key === 'math_thinkingTraining') {
            return `${i.displayed_type}  【${i.thinking_type}】`
        }
        return null
    }
    const renderStem = (topic) => {
        const { displayed_type, exercise_data_type, public_exercise_stem, public_exercise_image } = topic
        if (exercise_data_type === 'FS') {
            let stem = []
            if (public_exercise_stem) {
                stem = JSON.parse(public_exercise_stem)
            }
            return <View>
                <View style={[displayed_type === topaicTypes.Calculation_Problem ? appStyle.flexLine : null, { marginBottom: pxToDp(12) }]}>
                    {stem.map((i, x) => {
                        return <View style={[appStyle.flexLine, appStyle.flexLineWrap]} key={x}>
                            {i.map((ii, xx) => {
                                if (Array.isArray(ii)) {
                                    if (ii.length === 2) {
                                        return <View style={[appStyle.flexAliCenter]} key={xx}>
                                            <Text style={[styles.stemTxt]}>{ii[0]}</Text>
                                            <View style={[styles.fractionLine]}></View>
                                            <Text style={[styles.stemTxt]}>{ii[1]}</Text>
                                        </View>
                                    } else if (ii.length === 3) {
                                        return <View style={[appStyle.flexLine]} key={xx}>
                                            <Text>{ii[0]}</Text>
                                            <View style={[appStyle.flexAliCenter]}>
                                                <Text style={[styles.stemTxt]}>{ii[1]}</Text>
                                                <View style={[styles.fractionLine]}></View>
                                                <Text style={[styles.stemTxt]}>{ii[2]}</Text>
                                            </View>
                                        </View>
                                    }
                                } else if (ii.toLowerCase() === 'k') {
                                    return <View style={[styles.spaceLine, { transform: [{ translateY: pxToDp(20) }] }]} key={xx}></View>
                                } else {
                                    return <Text key={xx} style={[styles.stemTxt]}>{ii}</Text>
                                }
                            })}
                        </View>
                    })}
                    {displayed_type === topaicTypes.Calculation_Problem ? <View style={[styles.spaceLine, { transform: [{ translateY: pxToDp(20) }], marginLeft: pxToDp(8) }]}></View> : null}
                </View>
                <AutoImage url={public_exercise_image}></AutoImage>
            </View>
        } else {
            let stem = public_exercise_stem.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
            if (displayed_type === topaicTypes.Fill_Blank && key !== 'math_thinkingTraining') {
                // 填空
                const stem_arr_1 = public_exercise_stem.split('\n')
                const stem_arr = []
                stem_arr_1.forEach((i) => {
                    stem_arr.push([i.split('#')])
                })
                return <View style={{ marginBottom: pxToDp(12) }}>
                    {stem_arr.map((i) => {
                        return i.map((ii, xx) => {
                            return <View style={[appStyle.flexLine, appStyle.flexLineWrap]} key={xx}>
                                {ii.map((iii, xxx) => {
                                    if (iii.toLowerCase() === 'k') {
                                        return <View style={[styles.spaceLine, { transform: [{ translateY: pxToDp(20) }] }]} key={xxx}></View>
                                    } else {
                                        return iii.split('').map((iiii, xxxx) => {
                                            return <Text style={[styles.stemTxt]} key={xxxx}>{iiii}</Text>
                                        })
                                    }
                                })}
                            </View>
                        })
                    })}
                    <AutoImage url={public_exercise_image}></AutoImage>
                </View>
            } else if (displayed_type === topaicTypes.Calculation_Problem && key !== 'math_thinkingTraining') {
                // 计算
                return <View style={[appStyle.flexTopLine, appStyle.flexAliEnd]}>
                    <Text style={[styles.stemTxt, { marginRight: pxToDp(8) }]}>{stem}</Text>
                    <View style={[styles.spaceLine]}></View>
                </View>
            } else {
                return <View>
                    <RichShowViewHtml fontFamily={'JiangCheng-Pai-Bold'} size={40} value={public_exercise_stem} color={styles.stemTxt.color} p_style={{ lineHeight: pxToDp(50) }}></RichShowViewHtml>
                    <AutoImage url={public_exercise_image}></AutoImage>
                </View>

            }
        }
    }
    return (
        <ImageBackground style={[styles.container]} source={os === 'ios' ? require('../../../../images/mathWrongExercise/bg_1_i.png') : require('../../../../images/mathWrongExercise/bg_1_a.png')}>
            <TouchableOpacity style={[styles.backBtn]} onPress={() => {
                NavigationUtil.goBack(props);
            }}>
                <Image style={[{ width: pxToDp(120), height: pxToDp(80) }]} source={require("../../../../images/chineseHomepage/pingyin/new/back.png")} />
            </TouchableOpacity>
            <View style={[appStyle.flexAliCenter]}>
                <Text style={[styles.title]}>数学错题集</Text>
            </View>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={[styles.content, appStyle.flexTopLine]}>
                    <View style={[styles.left]}>
                        <ScrollView flex={1}>
                            {modules.map((i, x) => {
                                const active = moduleIndex === x
                                return <TouchableOpacity style={[styles.leftItem, active ? { backgroundColor: '#649EFF' } : null]} key={i.key} onPress={() => {
                                    selectModule(i, x)
                                }}>
                                    <View style={[styles.leftItemInner, appStyle.flexCenter, active ? { backgroundColor: '#BAD1FF' } : null]}>
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
                                    return <TouchableOpacity style={[styles.timeItem, active ? { backgroundColor: '#649EFF' } : null]} key={i.key} onPress={() => {
                                        selectTime(i, x)
                                    }}>
                                        <View style={[styles.timeItemInner, appStyle.flexCenter, active ? { backgroundColor: '#BAD1FF' } : null]}>
                                            <Text style={[{ color: '#475266', fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </View>
                        {key === 'math_thinkingTraining' && thinkType.length ? <View style={[styles.timesWrap, { width: pxToDp(1000) }]}>
                            <View style={[styles.timesWrapInner, appStyle.flexLine, appStyle.flexAliCenter]}>
                                {thinkType.map((i, x) => {
                                    const active = typeIndex === x
                                    return <TouchableOpacity style={[styles.typeItem, active ? { backgroundColor: '#649EFF' } : null]} key={i.t_t_id} onPress={() => {
                                        selectType(x)
                                    }}>
                                        <View style={[styles.timeItemInner, appStyle.flexCenter, active ? { backgroundColor: '#BAD1FF' } : null, { paddingLeft: pxToDp(20), paddingRight: pxToDp(20) }]}>
                                            <Text style={[{ color: '#475266', fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>{i.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </View>
                        </View> : null}
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
                                                <View style={[appStyle.flexLine, { marginBottom: pxToDp(26) }]}>
                                                    <View style={[styles.desWrap, appStyle.flexCenter]}>
                                                        <Text style={[{ color: "#148FFF", fontSize: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{getDes(i)}</Text>
                                                    </View>
                                                    <Text style={[{ color: "rgba(71,82,102,0.5)", fontSize: pxToDp(30) }, appFont.fontFamily_jcyt_500]}>{i.create_time.substring(0, 16)}</Text>
                                                </View>
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
                            <Image style={[styles.pageIcon]} source={require('../../../../images/mathWrongExercise/icon_left_2.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            pre()
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/mathWrongExercise/icon_left_1.png')}></Image>
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
                            <Image style={[styles.pageIcon]} source={require('../../../../images/mathWrongExercise/icon_right_2.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            next(pageTotal)
                        }}>
                            <Image style={[styles.pageIcon]} source={require('../../../../images/mathWrongExercise/icon_right_1.png')}></Image>
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
        borderColor: "#649EFF",
        borderWidth: pxToDp(4),
        backgroundColor: '#fff'
    },
    pageInner: {
        minWidth: pxToDp(118),
        height: '100%',
        backgroundColor: "#BAD1FF",
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
        backgroundColor: '#C7F7F4',
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
export default WrongExercise;
