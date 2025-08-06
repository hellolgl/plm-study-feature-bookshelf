import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, Modal, View, Text, Platform, ActivityIndicator, Dimensions, ImageBackground, ScrollView, DeviceEventEmitter } from 'react-native';
import { pxToDp, getIsTablet, pxToDpWidthLs } from '../../util/tools';
import { appFont, appStyle, mathFont } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import BackBtn from '../../component/math/BackBtn'
import NavigationUtil from "../../navigator/NavigationUtil";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import { setSelectModule, setSelestModuleAuthority, getModuleCoin, getAllCoin, setVisibleSignIn } from '../../action/userInfo'
import MathNavigationUtil from "../../navigator/NavigationMathUtil";
import { Toast } from 'antd-mobile-rn';
import { getTaskData, setLoading } from '../../action/dailyTask'
import PublicTips from '../../component/publicTips'
import { setVisible } from "../../action/purchase";

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

function DailyTaskIndex(props) {
    const { token, currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { checkGrade } = currentUserInfo
    const { task_data, system_task, loading } = useSelector(
        (state) => state.toJS().dailyTask
    );
    const dispatch = useDispatch();
    const OS = Platform.OS
    const isPhone = !getIsTablet()
    const [visibleTips, setVisibleTips] = useState(false)
    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getTaskData())
        const eventListener = DeviceEventEmitter.addListener('refreshDailyTask', () => {
            dispatch(getTaskData())
        });
        return () => {
            eventListener.remove();
        };
    }, [])
    const receive = (id, status) => {
        if (status === 0) {
            axios.post(api.getTaskGold, { id }).then(res => {
                if (res.data.err_code === 0) {
                    Toast.info("领取成功", 1);
                    dispatch(getTaskData())
                    dispatch(getAllCoin()) //更新派币信息
                }
            })
        }
    }
    const goFinish = (i) => {
        let alias = i.module
        dispatch(setSelectModule({ alias }))
        dispatch(setSelestModuleAuthority())
        dispatch(getModuleCoin())
        const needToken = [
            "chinese_toFlowTextbookList",
            "chinese_toChooseWrongExercise",
            "chinese_toChineseStatisticsHome",
            "english_toEnglishStatisticsHome",
        ];
        if (!token && needToken.indexOf(alias) !== -1) {
            NavigationUtil.resetToLogin(props);
            this.setState({
                top_right_item_index: -1,
            });
            return;
        }
        const grade_1_notHave = ['chinese_toChineseDailyWrite', 'chinese_toLookUnitArticle']
        if (checkGrade === '01' && grade_1_notHave.includes(alias)) {
            setVisibleTips(true)
            return
        }
        const needPay = ['math_AIPractice', 'chinese_toDoExercise']  //没有开放体验的,没权限就需要直接支付
        if (needPay.includes(alias) && i.lock) {
            dispatch(setVisible(true))
            return;
        }
        switch (alias) {
            case "chinese_toPinyinHome":
                // 语文拼音
                NavigationUtil.toChinesePinyinHome(props);
                break;
            case "chinese_toChineseSchoolHome":
                // 语文同步诊断
                NavigationUtil.toChineseSchoolHome(props);
                break;
            case "chinese_toChooseText":
                // 语文字词积累
                NavigationUtil.toWordsHomepage({
                    ...props,
                    data: { pageType: 4 },
                });
                break;
            case "chinese_toWisdomTree":
                // 语文智学树
                NavigationUtil.toWisdomTree(props);
                break;
            case "chinese_toChooseTextSentence":
                NavigationUtil.toNewSentence(props);
                break;
            case "chinese_composition":
                // 语文作文批改
                NavigationUtil.toChineseUploadArticle(props);
                break;
            case "chinese_toReading":
                // 语文阅读理解
                NavigationUtil.toReading({ ...props });
                break;
            case "chinese_toChineseDailySpeReadingStatics":
                // 语文阅读提升
                NavigationUtil.toChineseDailySpeReadingStatics(props);
                break;
            case "chinese_toLookUnitArticle":
                // 语文单元习作
                NavigationUtil.toChineseUnitComposition(props);
                break;
            case "chinese_toChineseDailyWrite":
                // 语文习作提升
                NavigationUtil.toChineseCompositionCheckType(props);
                break;
            case "math_aiGiveExercise":
                // 数学智能学习计划
                MathNavigationUtil.toMathAIGiveExerciseHome(props);
                break;
            case "math_knowledgeGraph":
                // 数学知识图谱
                MathNavigationUtil.toKnowledgeGraphExplainHomepage(props);
                break;
            case "math_mathTongbuHomePage":
                // 数学同步学习
                MathNavigationUtil.toSyncDiagnosisHomepage(props);
                break;
            case "math_cleverCalculation":
                // 数学巧算
                MathNavigationUtil.toMathEasyCalculationHomePage(props);
                break;
            case "math_thinkingTraining":
                // 数学思维训练
                MathNavigationUtil.toMathThinkingTrainingPage(props);
                break;
            case "english_Sentences":
                // 英语智能句
                NavigationUtil.toEnSentencesHomePage(props);
                break;
            case "english_toSelectUnitEn1":
                // 英语同步（my study）
                NavigationUtil.toSelectUnitEn({ ...props, data: { pageType: 1 } });
                break;
            case "english_toSelectUnitEn0":
                // 英语连线题
                NavigationUtil.toMixSelectUnit({
                    ...props,
                    data: {
                        index: 0,
                    },
                });
                break;
            case "english_toAbcs":
                // 英语字母单元(abcs)
                NavigationUtil.toEnglishAbcsHome(props);
                break;
            case "english_toSelectUnitEn2":
                // 英语test me
                NavigationUtil.toEnglishTestMeHome({
                    ...props,
                    data: { pageType: 2 },
                });
                break;
            case "chinese_toMyDesk":
                // 语文作业
                NavigationUtil.toYuwenHomepage(props);
                break;
            case "math_toMyDesk":
                // 数学作业
                MathNavigationUtil.toMathDeskHomepage(props);
                break;
            case "english_toMyDesk":
                // 英语作业
                NavigationUtil.toEnglishDeskHomepage(props);
                break;
            case "chinese_toChineseDiaryHome":
                // 学习日记
                NavigationUtil.toChineseDiaryHome(props);
                break;
            case "math_program":
                // 编程
                MathNavigationUtil.toMathProgramHomePage(props);
                break;
            case 'math_AIPractice':
                NavigationUtil.toMathPracticeHomePage(props);
                break;
            case "chinese_toDoExercise":
                NavigationUtil.toChineseQuickDoExercise(props);
                break;
        }
    }
    let system_task_progress = '0%'
    let status = -1
    if (Object.keys(system_task).length) {
        const { task_count, task_finish_count } = system_task
        system_task_progress = (task_finish_count / task_count) * 100 + '%'
        status = system_task.status
    }
    return (
        <View style={[styles.container, appStyle.flexAliCenter]}>
            <Image style={[styles.bg2]} source={require('../../images/dailyTask/bg_2.png')}></Image>
            <BackBtn left={isPhone ? pxToDpWidthLs(40) : pxToDp(20)} goBack={() => {
                NavigationUtil.goBack(props);
            }}></BackBtn>
            <ImageBackground resizeMode='stretch' style={[styles.bg1, OS === 'ios' ? { width: pxToDp(1872), height: pxToDp(1400) } : null, isPhone ? { height: pxToDpWidthLs(700) } : null]} source={OS === 'ios' ? require('../../images/dailyTask/bg_1_ios.png') : require('../../images/dailyTask/bg_1.png')}>
                {loading ? <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <ActivityIndicator size="large" color={'#283139'}></ActivityIndicator>
                </View> : <View style={{ flex: 1 }}>
                    {task_data.length ? <View style={[styles.tipsWrap, appStyle.flexCenter]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_700]}>题目必须答对哦</Text>
                    </View> : null}
                    <ScrollView contentContainerStyle={{ ...appStyle.flexAliCenter, paddingBottom: pxToDp(40) }} style={[{ maxHeight: OS === 'ios' ? pxToDp(900) : pxToDp(700) }, isPhone ? { maxHeight: pxToDpWidthLs(380) } : null]}>
                        <TouchableOpacity style={[styles.signInWrap, appStyle.flexLine]} onPress={() => {
                            dispatch(setVisibleSignIn(true))
                        }}>
                            <View style={[appStyle.flexLine, appStyle.flexAliCenter, { flex: 1 }, { transform: [{ translateX: pxToDp(0) }] }]}>
                                <View>
                                    <Text style={[{ color: "#283139", fontSize: pxToDp(36) }, OS === 'ios' ? { marginBottom: pxToDp(12) } : null, appFont.fontFamily_jcyt_700]}>每日打卡</Text>
                                    <View style={[styles.progressWrap, { width: pxToDp(810), height: pxToDp(58), borderWidth: pxToDp(8) }]}>
                                        <View style={[styles.progress, appStyle.flexLine]}>
                                            <View style={[{ width: '100%' }, styles.progressInner, { borderRightWidth: 0 }]}></View>
                                        </View>
                                    </View>
                                </View>
                                <ImageBackground style={[{ width: pxToDp(155), height: pxToDp(161), marginLeft: pxToDp(18) }]} source={require('../../images/dailyTask/item_bg_5.png')}>
                                    <Image resizeMode='stretch' style={[styles.gouIcon, { right: pxToDp(-6), top: pxToDp(-3) }]} source={require('../../images/dailyTask/icon_3.png')}></Image>
                                </ImageBackground>
                            </View>
                            <View>
                                <ImageBackground style={[{ width: pxToDp(391), height: pxToDp(180) }, appStyle.flexCenter]} source={require('../../images/dailyTask/item_bg_6.png')}>
                                    <Text style={[{ color: "#fff", fontSize: pxToDp(56) }, appFont.fontFamily_jcyt_700]}>已完成</Text>
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                        {task_data.length ? task_data.map((i, x) => {
                            const { name, rules, right_count, need_right_count_total, is_finish } = i
                            return <View style={[styles.item, appStyle.flexLine]} key={x}>
                                <View style={[{ flex: 1, height: "100%", paddingTop: pxToDp(178) }, { transform: [{ translateX: pxToDp(-50) }] }, appStyle.flexAliCenter]}>
                                    <View style={[styles.progressWrap, { overflow: 'visible', borderColor: 'transparent', position: 'absolute', zIndex: 2, top: pxToDp(52) }]}>
                                        <View style={[styles.progress, appStyle.flexLine]}>
                                            {rules.map((ii, xx) => {
                                                const { status, gold } = ii
                                                let right_count_ii = ii.right_count
                                                return <View style={[{ width: ii.width, height: '100%', position: "relative" }]} key={xx}>
                                                    <View style={[styles.message, appStyle.flexAliCenter]}>
                                                        {status === 0 ? <Image style={[styles.circleIcon, { right: pxToDp(-8), top: pxToDp(12) }]} source={require('../../images/dailyTask/icon_1.png')}></Image> : null}
                                                        {status === 1 ? <Image resizeMode='stretch' style={[styles.gouIcon, { right: pxToDp(0), top: pxToDp(36) }]} source={require('../../images/dailyTask/icon_3.png')}></Image> : null}
                                                        <View style={[styles.numWrap, appStyle.flexCenter, { marginBottom: status === 0 ? pxToDp(0) : pxToDp(-16) }, status === 0 ? { marginTop: pxToDp(-20) } : null]}>
                                                            <Text style={[{ color: "#FFA109", fontSize: pxToDp(24) }, appFont.fontFamily_jcyt_700]}>{i.right_count > right_count_ii ? right_count_ii : i.right_count}/{right_count_ii}</Text>
                                                        </View>
                                                        <TouchableOpacity style={[{ position: "relative" }]} onPress={() => {
                                                            receive(ii.id, ii.status)
                                                        }}>
                                                            <View style={[styles.goldWrap, appStyle.flexCenter, status === 0 ? { right: pxToDp(-40), bottom: pxToDp(30) } : { right: pxToDp(-30), bottom: pxToDp(40) }]}>
                                                                <Text style={[{ color: "#fff", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_700]}>+{gold}</Text>
                                                            </View>
                                                            <Image style={[{ width: pxToDp(168), height: pxToDp(188) }]} source={status === 0 ? require('../../images/dailyTask/item_bg_1_active.png') : require('../../images/dailyTask/item_bg_1.png')}></Image>
                                                        </TouchableOpacity>
                                                        <Image style={[{ width: pxToDp(44), height: pxToDp(44) }, status === 0 ? { marginTop: pxToDp(4) } : null]} source={require('../../images/dailyTask/icon_2.png')}></Image>
                                                        <Text style={[{ color: "#FFA825", fontSize: pxToDp(28), marginTop: pxToDp(-10) }, appFont.fontFamily_jcyt_700]}>{xx + 1}</Text>
                                                    </View>
                                                </View>
                                            })}
                                        </View>
                                    </View>
                                    <View style={[styles.progressWrap]}>
                                        <View style={[styles.progress, appStyle.flexLine]}>
                                            <View style={[{ width: i.width }, styles.progressInner, i.width === '0%' || is_finish ? { borderRightWidth: 0 } : null]}></View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={[styles.right, is_finish ? { backgroundColor: '#48D6B4' } : null]} onPress={() => {
                                    if (!is_finish) {
                                        goFinish(i)
                                    }
                                }}>
                                    <View style={[styles.rightInner, appStyle.flexCenter, is_finish ? { backgroundColor: '#ABEFDC' } : null]}>
                                        <View style={[styles.title, appStyle.flexCenter, is_finish ? { backgroundColor: 'rgba(255,249,235,0.7)' } : null]}>
                                            <Text style={[{ color: "#283139", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{name}</Text>
                                        </View>
                                        <Text style={[{ color: "rgba(40,49,57,0.8)", fontSize: pxToDp(28), lineHeight: pxToDp(70) }, appFont.fontFamily_jcyt_500]}>答对 {is_finish ? need_right_count_total : right_count}/{need_right_count_total}</Text>
                                        <View style={[styles.finishBtn, appStyle.flexCenter, is_finish ? { backgroundColor: '#FFF9EB' } : null]}>
                                            <Text style={[{ color: is_finish ? '#283139' : "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{is_finish ? '已完成' : "去完成"}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }) : <View style={[{ flex: 1, marginTop: pxToDp(30) }, appStyle.flexCenter]}>
                            <Text style={[{ color: "rgba(40,49,57,0.5)", fontSize: pxToDp(42) }, appFont.fontFamily_jcyt_700]}>暂无每日任务数据</Text>
                        </View>}
                    </ScrollView>
                    {task_data.length ? <View style={[appStyle.flexLine, appStyle.flexCenter, { flex: 1 }]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(44), marginRight: pxToDp(30) }, appFont.fontFamily_jcyt_700]}>当前进度（{system_task.task_finish_count}/{system_task.task_count}）</Text>
                        <View>
                            <View style={[styles.totalProgress, { overflow: 'visible', zIndex: 1, backgroundColor: "transparent", position: "absolute" }]}>
                                <View style={[styles.totalProgressInner, { width: system_task_progress, position: "relative", backgroundColor: "transparent" }]}>
                                    {status === -1 ? <Image style={{ width: pxToDp(128), height: pxToDp(128), position: "absolute", right: pxToDp(-64), top: pxToDp(-40) }} source={require('../../images/dailyTask/item_bg_2.png')}></Image> : null}
                                </View>
                            </View>
                            <View style={[styles.totalProgress]}>
                                <View style={[styles.totalProgressInner, { width: system_task_progress }]}></View>
                            </View>
                        </View>
                        <TouchableOpacity style={[{ marginLeft: pxToDp(-80) }]} onPress={() => {
                            receive(system_task.id, system_task.status)
                        }}>
                            <View style={[styles.goldWrap, appStyle.flexCenter, { backgroundColor: "#FF5D5D" }, status === 0 ? { right: pxToDp(20), bottom: pxToDp(100) } : { right: pxToDp(-10), bottom: pxToDp(120) }]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_700]}>+{system_task.rules[0].gold}</Text>
                            </View>
                            {status === 0 ? <Image style={[{ width: pxToDp(242), height: pxToDp(186) }]} source={require('../../images/dailyTask/item_bg_4.png')}></Image>
                                : <Image style={[{ width: pxToDp(220), height: pxToDp(220) }]} source={require('../../images/dailyTask/item_bg_3.png')}></Image>}
                            {status === 0 ? <Image style={[styles.circleIcon, { right: pxToDp(60), top: pxToDp(-8) }]} source={require('../../images/dailyTask/icon_1.png')}></Image> : null}
                            {status === 1 ? <Image resizeMode='stretch' style={[styles.gouIcon, { right: pxToDp(20), top: pxToDp(8) }]} source={require('../../images/dailyTask/icon_3.png')}></Image> : null}
                        </TouchableOpacity>
                    </View> : null}
                </View>
                }
            </ImageBackground>
            <PublicTips confirm={() => {
                setVisibleTips(false)
            }} cancel={() => {
                setVisibleTips(false)
            }} visible={visibleTips} tips={`当前选择年级暂无此模块，请到首页切换到更高年级哟～`}></PublicTips>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3EEE8"
    },
    bg1: {
        width: pxToDp(1840),
        height: pxToDp(1060),
        marginLeft: pxToDp(60),
        paddingTop: Platform.OS === 'ios' ? pxToDp(160) : pxToDp(90),
    },
    bg2: {
        width: windowWidth,
        height: pxToDp(804),
        position: "absolute",
        bottom: 0
    },
    tipsWrap: {
        width: pxToDp(236),
        height: pxToDp(56),
        backgroundColor: "rgba(40,49,57,0.5)",
        borderRadius: pxToDp(122),
        marginLeft: Platform.OS === 'ios' ? pxToDp(130) : pxToDp(84),
        marginBottom: pxToDp(16)
    },
    item: {
        width: pxToDp(1536),
        height: pxToDp(320),
        backgroundColor: "rgba(254,254,254,0.8)",
        borderRadius: pxToDp(96),
        marginBottom: pxToDp(26)
    },
    signInWrap: {
        width: pxToDp(1536),
        height: pxToDp(180),
        backgroundColor: "#FCFBFA",
        borderRadius: pxToDp(60),
        marginBottom: pxToDp(26),
        paddingLeft: pxToDp(70)
    },
    right: {
        width: pxToDp(372),
        height: "100%",
        backgroundColor: "#FFB649",
        borderRadius: pxToDp(96),
        paddingBottom: pxToDp(8)
    },
    rightInner: {
        flex: 1,
        backgroundColor: "#FFDB5D",
        borderRadius: pxToDp(96),
    },
    title: {
        minWidth: pxToDp(248),
        height: pxToDp(70),
        borderRadius: pxToDp(70),
        backgroundColor: "rgba(255,249,235,0.7)",
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12)
    },
    finishBtn: {
        width: pxToDp(304),
        height: pxToDp(100),
        borderRadius: pxToDp(48),
        backgroundColor: "#FF9924"
    },
    progressWrap: {
        width: pxToDp(956),
        height: pxToDp(108),
        borderRadius: pxToDp(82),
        borderWidth: pxToDp(20),
        borderColor: '#F5F1EC',
        overflow: "hidden",
        // marginLeft:pxToDp(-50)
    },
    progress: {
        width: pxToDp(916),
        flex: 1
    },
    progressInner: {
        height: '100%',
        backgroundColor: '#99D4FF',
        position: 'absolute',
        left: 0,
        borderRightColor: '#F57F51',
        borderRightWidth: pxToDp(6)
    },
    message: {
        width: pxToDp(168),
        position: "absolute",
        top: pxToDp(-40),
        right: pxToDp(-81), //宽度的一半 减去 大约进度条右边border的一半
    },
    numWrap: {
        minWidth: pxToDp(80),
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12),
        height: pxToDp(36),
        borderRadius: pxToDp(34),
        backgroundColor: "#FEE58C"
    },
    circleIcon: {
        width: pxToDp(40),
        height: pxToDp(40),
        position: 'absolute',
        zIndex: 3
    },
    gouIcon: {
        width: pxToDp(36),
        height: pxToDp(36),
        position: 'absolute',
        zIndex: 3
    },
    goldWrap: {
        minWidth: pxToDp(76),
        paddingLeft: pxToDp(8),
        paddingRight: pxToDp(8),
        height: pxToDp(53),
        borderRadius: pxToDp(32),
        borderBottomLeftRadius: 0,
        backgroundColor: "#F57F51",
        position: "absolute",
        zIndex: 3,
    },
    totalProgress: {
        width: pxToDp(890),
        height: pxToDp(44),
        backgroundColor: '#D9D9D9',
        borderRadius: pxToDp(48),
        position: "relative",
        overflow: 'hidden'
    },
    totalProgressInner: {
        position: "absolute",
        left: 0,
        backgroundColor: "#48D6B4",
        height: pxToDp(44),
    }
})
export default DailyTaskIndex;
