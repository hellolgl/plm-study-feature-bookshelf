import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Image, ScrollView, View, Text, Platform, Animated, Dimensions, ImageBackground, SafeAreaView } from 'react-native';
import { pxToDp, touristInfo, getIsTablet, pxToDpWidthLs } from '../util/tools';
import { appFont, appStyle, mathFont } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import axios from "../util/http/axios";
import api from "../util/http/api";
import _ from 'lodash'
import Avatar from "../component/homepage/avatar";
import SelectGradeAndBook from "../component/homepage/selectGradeAndBook";
import NavigationUtil from "../navigator/NavigationUtil";
import MathNavigationUtil from "../navigator/NavigationMathUtil";
import { setToken, setUserInfoNow, setavatar, setCoin, setRewardCoin } from "../action/userInfo/index";
import { setMathTextBook } from "../action/math/bag";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSelectModule, setSelestModuleAuthority, getModuleCoin } from "../action/userInfo";

function Tag({ top, left, label }) {
    return <View style={[styles.tagWrap, appStyle.flexCenter, { top, left }]}>
        <Text style={[{ color: "#FFFFFF", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{label}</Text>
    </View>
}

function AdvertisingPage(props) {
    const dispatch = useDispatch();
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { checkGrade, checkTeam, name, grade, term, } = currentUserInfo;
    const [visibleGrade, setVisibleGrade] = useState(false);
    const [list, setList] = useState([])
    const module_keys = [
        // 语文智能学习计划
        {
            key: 'chinese_toDoExercise',
            weight: 1,
            img: require('../images/advertisingPage/item1.png'),
            width: pxToDp(510),
            height: pxToDp(206)
        },
        // 数学智能学习计划
        {
            key: 'math_AIPractice',
            weight: 2,
            img: require('../images/advertisingPage/item2.png'),
            width: pxToDp(510),
            height: pxToDp(206)
        },
        // 语文习作提升
        {
            key: 'chinese_toChineseDailyWrite',
            weight: 4,
            img: require('../images/advertisingPage/item4.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
        // 语文智能句
        {
            key: 'chinese_toChooseTextSentence',
            weight: 5,
            img: require('../images/advertisingPage/item4.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
        // 语文阅读理解
        {
            key: 'chinese_toReading',
            weight: 6,
            img: require('../images/advertisingPage/item4.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
        // 数学思维训练
        {
            key: 'math_thinkingTraining',
            weight: 7,
            img: require('../images/advertisingPage/item5.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
        // 数学巧算
        {
            key: 'math_cleverCalculation',
            weight: 8,
            img: require('../images/advertisingPage/item5.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
        // 英语words
        {
            key: 'english_toSelectUnitEn1',
            weight: 9,
            img: require('../images/advertisingPage/item6.png'),
            width: pxToDp(528),
            height: pxToDp(328)
        },
    ]
    const subject_map = {
        '01': '语文',
        '02': '数学',
        '03': '英语'
    }
    const OS = Platform.OS
    const isPhone = !getIsTablet()
    useEffect(() => {
        getConfig();
    }, [checkGrade, checkTeam]);
    const getConfig = () => {
        const params = {
            grade_code: checkGrade,
            term_code: checkTeam,
        };
        console.log('ddddddddd', params)
        let arr = []
        axios.post(api.getHomepageConfig, params).then((res) => {
            const data = res.data.data.data;
            data.forEach(i => {
                i.children.forEach(ii => {
                    ii.module.forEach(iii => {
                        module_keys.forEach(j => {
                            if (iii.alias === j.key) {
                                arr.push({ ...iii, weight: j.weight, img: j.img, width: j.width, height: j.height })
                            }
                        })
                    })
                })
            })
            arr.push({
                name: 'KET 英语阅读',
                img: require('../images/advertisingPage/item3.png'),
                detail: '通过KET阅读提高英语水平和口语水平。',
                subject: 'AI智能',
                width: pxToDp(248),
                height: pxToDp(320),
                title: "KET英语阅读",
                type: "paistory",
                weight: 3
            })
            let order_arr = _.orderBy(arr, 'weight', 'asc')
            // console.log(':::::::', order_arr, _.chunk(order_arr, 3))
            setList(_.chunk(order_arr, 3))
        });
    };
    const selectModule = (item) => {
        const { alias } = item;
        dispatch(setSelectModule({ alias }));
        dispatch(setSelestModuleAuthority());
        dispatch(getModuleCoin());
        switch (alias) {
            case "chinese_toDoExercise":
                // 语文智能学习计划
                NavigationUtil.toChineseQuickDoExercise(props);
                break;
            case "chinese_toChineseDailyWrite":
                // 语文习作提升
                NavigationUtil.toChineseCompositionCheckType(props);
                break;
            case "chinese_toChooseTextSentence":
                // 语文智能句
                NavigationUtil.toNewSentence(props);
                break;
            case "chinese_toReading":
                // 语文阅读理解
                NavigationUtil.toReading({ ...props });
                break;
            case "math_thinkingTraining":
                // 数学思维训练
                MathNavigationUtil.toMathThinkingTrainingPage(props);
                break;
            case "math_cleverCalculation":
                // 数学巧算
                MathNavigationUtil.toMathEasyCalculationHomePage(props);
                break;
            case "english_toSelectUnitEn1":
                // 英语同步（my study）
                NavigationUtil.toSelectUnitEn({ ...props, data: { pageType: 1 } });
                break;
            case "math_AIPractice":
                NavigationUtil.toMathPracticeHomePage(props);
                break;
        }
    };
    const logout = () => {
        const info = touristInfo;
        info["isStudent"] = currentUserInfo.isStudent ? currentUserInfo.isStudent : false;
        AsyncStorage.setItem("token", "");
        AsyncStorage.setItem("userInfo", JSON.stringify(info));
        dispatch(setToken(''))
        dispatch(setUserInfoNow(info))
        dispatch(setMathTextBook(info.textBook))
        dispatch(setavatar('personal_customized/pandaHead.png'))
        dispatch(setCoin(0))
        dispatch(setRewardCoin(0))
        NavigationUtil.resetToLogin({ ...props });
    }
    return (
        <View style={[styles.container]}>
            <View style={[styles.header, appStyle.flexLine, appStyle.flexJusBetween, isPhone ? { height: pxToDp(160) } : null]}>
                <View style={[styles.left, appStyle.flexLine]}>
                    <Avatar width={120} />
                    <Text style={[{ color: "#283139", fontSize: pxToDp(36), lineHeight: pxToDp(46), marginLeft: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{name}</Text>
                    <TouchableOpacity
                        style={[
                            styles.gradeWrap,
                            appStyle.flexLine,
                            appStyle.flexJusCenter,
                        ]}
                        onPress={() => {
                            setVisibleGrade(true)
                        }}
                    >
                        <Text
                            style={[
                                { fontSize: pxToDp(32), color: "#fff" },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            {grade}-{term}
                        </Text>
                        <Image
                            resizeMode="contain"
                            style={[
                                {
                                    width: pxToDp(20),
                                    height: pxToDp(20),
                                    marginLeft: pxToDp(48),
                                },
                            ]}
                            source={require("../images/homepage/icon_9.png")}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.right, appStyle.flexLine, appStyle.flexCenter]} onPress={logout}>
                    <Text style={[{ color: "#283139", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_700]}>退出账号</Text>
                    <Image style={[{ width: pxToDp(48), height: pxToDp(48), marginLeft: pxToDp(20) }]} source={require('../images/advertisingPage/icon1.png')}></Image>
                </TouchableOpacity>
            </View>
            <View style={[appStyle.flexAliCenter]}>
                <ImageBackground resizeMode='stretch' style={[styles.contentBg, isPhone ? { height: pxToDp(740), width: pxToDp(1760), paddingTop: pxToDp(0) } : null]} source={require('../images/advertisingPage/bg1.png')}>
                    <ScrollView style={{ flex: 1 }}>
                        {list.map((i, x) => {
                            return <View style={[{ marginBottom: OS === 'ios' ? pxToDp(166) : pxToDp(78) }, isPhone ? { marginBottom: pxToDp(-20), transform: [{ scale: 0.88 }], } : null]} key={x}>
                                <View style={[appStyle.flexTopLine, appStyle.flexAliEnd, { marginBottom: pxToDp(-28), position: 'relative', zIndex: 1 }, x === 0 ? { paddingLeft: isPhone ? pxToDp(0) : pxToDp(34), paddingRight: isPhone ? pxToDp(0) : pxToDp(74) } : { paddingLeft: isPhone ? pxToDp(0) : pxToDp(96), paddingRight: isPhone ? pxToDp(0) : pxToDp(96) }]}>
                                    {i.map((ii, xx) => {
                                        const { name, detail, subject, title, type } = ii
                                        if (x === 0 && xx === 2) {
                                            return <TouchableOpacity style={[appStyle.flexTopLine, appStyle.flexAliEnd, { marginBottom: pxToDp(-10), position: 'relative' }]} key={xx} onPress={() => {
                                                dispatch(setSelectModule({ alias: "english_ket" }));
                                                dispatch(getModuleCoin());
                                                NavigationUtil.toSquareHomeList({ ...props, data: { title, type } });
                                            }}>
                                                <Tag top={pxToDp(15)} left={pxToDp(230)} label={subject}></Tag>
                                                <ImageBackground style={[{ width: ii.width, height: ii.height }, appStyle.flexAliCenter]} source={ii.img}>
                                                    <Text style={[{ color: "#283139", fontSize: pxToDp(32), marginTop: pxToDp(50) }, appFont.fontFamily_jcyt_700]}>{name}</Text>
                                                </ImageBackground>
                                                <View style={[styles.ketDes]}>
                                                    <Text style={[styles.des, { marginLeft: pxToDp(210), width: pxToDp(180), marginTop: pxToDp(30) }]}>{detail}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                        if (x === 0 && [0, 1].includes(xx)) {
                                            return <TouchableOpacity style={[{ position: "relative", marginRight: pxToDp(140) }]} key={xx} onPress={() => {
                                                selectModule(ii)
                                            }}>
                                                <Tag top={pxToDp(-10)} left={pxToDp(480)} label={subject_map[subject]}></Tag>
                                                <ImageBackground style={{ width: ii.width, height: ii.height }} source={ii.img}>
                                                    <View style={{ width: pxToDp(270), marginLeft: pxToDp(220), marginTop: pxToDp(30) }}>
                                                        <Text style={[{ color: "#283139", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700, OS === 'ios' ? { marginTop: pxToDp(20) } : null]}>{name}</Text>
                                                        <Text style={[{ marginTop: OS === 'ios' ? pxToDp(16) : pxToDp(-20) }, styles.des]}>{detail}</Text>
                                                    </View>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        }
                                        return <TouchableOpacity style={[{ position: "relative", marginRight: xx === i.length - 1 ? 0 : pxToDp(36) }]} key={xx} onPress={() => {
                                            selectModule(ii)
                                        }}>
                                            <Tag top={pxToDp(20)} left={pxToDp(238)} label={subject_map[subject]}></Tag>
                                            <ImageBackground style={{ width: ii.width, height: ii.height }} source={ii.img}>
                                                <View style={[{ width: pxToDp(213), height: pxToDp(106), marginTop: pxToDp(32), marginLeft: pxToDp(32) }, appStyle.flexCenter]}>
                                                    <Text style={[{ color: "#283139", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{name}</Text>
                                                </View>
                                                <Text style={[styles.des, { width: pxToDp(230), marginLeft: pxToDp(276), marginTop: pxToDp(50) }]}>{detail}</Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    })}
                                </View>
                                <ImageBackground style={[{ width: pxToDp(1944), height: pxToDp(90), marginLeft: pxToDp(-30) }, appStyle.flexTopLine, isPhone ? { marginLeft: pxToDp(-80) } : null]} source={require('../images/advertisingPage/item7.png')}></ImageBackground>
                            </View>
                        })}
                    </ScrollView>

                </ImageBackground>
            </View>
            <SelectGradeAndBook
                visible={visibleGrade}
                type={'grade'}
                back={() => {
                    setVisibleGrade(false);
                }}
            ></SelectGradeAndBook>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F4F1'
    },
    header: {
        height: Platform.OS === 'ios' ? pxToDp(204) : pxToDp(166),
        paddingRight: pxToDp(84)
    },
    left: {
        height: pxToDp(140),
        borderRadius: pxToDp(52),
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: pxToDp(4),
        borderColor: '#fff',
        backgroundColor: '#D7D1CD',
        paddingLeft: pxToDp(70),
        paddingRight: pxToDp(22)
    },
    gradeWrap: {
        width: pxToDp(362),
        height: pxToDp(108),
        borderRadius: pxToDp(34),
        backgroundColor: "#3A4148",
        marginLeft: pxToDp(42)
    },
    right: {
        width: pxToDp(270),
        height: pxToDp(96),
        backgroundColor: "#D7D1CD",
        borderWidth: pxToDp(4),
        borderColor: "#F9F8F8",
        borderRadius: pxToDp(24)
    },
    contentBg: {
        width: pxToDp(1880),
        height: Platform.OS === 'ios' ? pxToDp(1160) : pxToDp(900),
        paddingTop: Platform.OS === 'ios' ? pxToDp(134) : pxToDp(32),
    },
    ketDes: {
        width: pxToDp(408),
        height: pxToDp(180),
        borderRadius: pxToDp(32),
        borderColor: "#D7D1CD",
        borderWidth: pxToDp(2),
        backgroundColor: "#fff",
        marginLeft: pxToDp(-200),
        position: 'relative',
        zIndex: -1,
        marginBottom: pxToDp(10)
    },
    des: {
        color: "rgba(45, 48, 64, 0.70)",
        fontSize: pxToDp(24),
        ...appFont.fontFamily_jcyt_500
    },
    tagWrap: {
        width: pxToDp(150),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        borderBottomLeftRadius: 0,
        backgroundColor: "#3A4148",
        position: 'absolute',
        zIndex: 1
    }
})
export default AdvertisingPage;
