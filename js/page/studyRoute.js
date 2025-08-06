import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    FlatList,
    ImageBackground,
    Image,
    Modal,
    TextInput
} from "react-native";
import { pxToDp, getIsTablet, pxToDpWidthLs } from "../util/tools";
import { appFont, appStyle } from "../theme";
import NavigationUtil from "../navigator/NavigationUtil";
import { useSelector, useDispatch } from "react-redux";
import api from "../util/http/api";
import axios from "../util/http/axios";
import _ from 'lodash'
import { Toast } from "antd-mobile-rn";

const StudyRoute = (props) => {
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { checkGrade, checkTeam } = currentUserInfo;
    const OS = Platform.OS;
    const isPhone = !getIsTablet();
    const subjectList = [
        {
            label: "语文",
            icon: require("../images/homepage/icon_18.png"),
            iconActive: require("../images/studyRoute/icon_1.png"),
            bgActive: "#FFB508",
            itemBg: require("../images/homepage/item_yuwen.png"),
            subject: '01'
        },
        {
            label: "数学",
            icon: require("../images/homepage/icon_19.png"),
            iconActive: require("../images/studyRoute/icon_2.png"),
            bgActive: '#649EFF',
            itemBg: require("../images/homepage/item_shuxue.png"),
            subject: '02'
        },
        {
            label: "英语",
            icon: require("../images/homepage/icon_20.png"),
            iconActive: require("../images/studyRoute/icon_3.png"),
            bgActive: "#914DFF",
            itemBg: require("../images/homepage/item_yingyu.png"),
            subject: '03'
        },
    ];
    const numMap = {
        0: "I",
        1: "II",
        2: "III",
        3: "IV",
        4: "V",
        5: "VI",
        6: "VII",
        7: "VIII",
        8: "IX",
        9: "X",
    };
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [subjectModule, setSubjectModule] = useState(null)
    const [recommendModule, setRecommendModule] = useState(null)
    const [list, setList] = useState([])
    const [route, setRoute] = useState('')
    const [visible, setVisible] = useState(false)
    const [code_number, setCode_number] = useState('')
    useEffect(() => {
        getConfig()
    }, [])
    useEffect(() => {
        if (subjectModule) {
            getData()
        }
    }, [subjectModule])
    const getConfig = () => {
        const params = {
            grade_code: checkGrade,
            term_code: checkTeam,
        };
        axios.post(api.getHomepageConfig, params).then((res) => {
            const data = res.data.data.data;
            const moduleData = data.reduce((c, i) => {
                let arr = []
                i.children.forEach((ii, xx) => {
                    arr = arr.concat(ii.module)
                })
                c[i.name] = arr;
                return c;
            }, {});
            setSubjectModule(moduleData)
        });
    };
    const getData = () => {
        const params = {
            exercise_time: '4',
            grade_code: checkGrade,
            term_code: checkTeam,
            grade_term: checkGrade + checkTeam,
            url_category: 'character'
        };
        axios.get(api.getRecommendModule, { params }).then((res) => {
            const data = res.data.data
            setRecommendModule(data)
            getSubjectData(0, data)
        })
    }
    const clickSubject = (i, x) => {
        setSubjectIndex(x)
        getSubjectData(x, recommendModule)
    }
    const getSubjectData = (index, module) => {
        let l = []
        let show_data = []
        let filter_data = []
        let route_data = []
        switch (index) {
            case 0:
                show_data = module.ch_data
                filter_data = subjectModule['语文']
                break;
            case 1:
                show_data = module.math_data
                filter_data = subjectModule['数学']
                break;
            default:
                show_data = module.en_data
                filter_data = subjectModule['英语']
        }
        let filter_map = {}
        filter_data.forEach((i, x) => {
            if (show_data.includes(i.alias)) {
                l.push(i)
                filter_map[i.alias] = i.name
            }
        })
        route_data = show_data.map((i, x) => {
            return filter_map[i] ? filter_map[i] : i
        })
        // 测试多行的假数据
        // const arr = l.filter(i => {
        //     return i.name !== '智能学习计划'
        // })
        // l = l.concat(arr).concat(arr).concat(arr).concat(arr)
        setList(_.chunk(l, 4))
        setRoute(route_data.join('-'))
        // console.log('show_data::::', show_data, route_data.join('-'))
        // console.log('filter_data:::::', filter_data)
        // console.log('筛选出的书架模块::::::', l)
    }
    const confirm = () => {
        if (!code_number) {
            return
        }
        const params = {
            code_number,
            subject: subjectList[subjectIndex].subject
        }
        axios.post(api.subjectClock, params).then((res) => {
        }).finally(() => {
            setVisible(false)
        })
    }
    const renderModuleName = (name) => {
        let fontSize = pxToDp(36);
        if (subjectIndex === 2) {
            // 英语调字大小
            const len = name.length;
            if (len > 5) fontSize = pxToDp(30);
            if (len > 7) fontSize = pxToDp(24);
        }
        return (
            <View
                style={[
                    { width: pxToDp(160), height: pxToDp(80) },
                    appStyle.flexCenter,
                    {
                        transform: [
                            { translateX: pxToDp(-83) },
                            { translateY: pxToDp(20) },
                        ],
                    },
                ]}
            >
                <Text
                    style={[{ color: "#283139", fontSize }, appFont.fontFamily_jcyt_700]}
                >
                    {name}
                </Text>
            </View>
        );
    };
    const renderItem = ({ item, index }) => {
        return <View key={index} style={[{ marginBottom: OS === 'android' ? pxToDp(20) : pxToDp(46) }, isPhone ? { transform: [{ scale: 0.9 }], marginLeft: pxToDp(-60) } : null]}>
            <View style={[appStyle.flexLine, appStyle.flexAliEnd, { marginLeft: pxToDp(56) }]}>
                {item.map((ii, xx) => {
                    const { upper_right, name, detail, alias } = ii; //upper_right 为aiPlan 表示是快速答题（智能学习计划）
                    let lock = ii.lock
                    if (alias === 'english_ket') {
                        lock = false
                    }
                    let isPlan = upper_right === "aiPlan";
                    return (
                        <View style={[appStyle.flexAliCenter]} key={xx}>
                            <View>
                                {isPlan ? (
                                    <ImageBackground
                                        resizeMode="stretch"
                                        style={[
                                            { width: pxToDp(440), height: pxToDp(182) },
                                            isPhone
                                                ? {
                                                    width: pxToDpWidthLs(420),
                                                    height: pxToDpWidthLs(170),
                                                }
                                                : null,
                                        ]}
                                        source={require("../images/homepage/item_plan.png")}
                                    >
                                        <Text
                                            style={[
                                                { color: "#283139", fontSize: pxToDp(32) },
                                                appFont.fontFamily_jcyt_700,
                                                {
                                                    transform: [
                                                        {
                                                            translateX: isPhone
                                                                ? pxToDpWidthLs(180)
                                                                : pxToDp(180),
                                                        },
                                                        {
                                                            translateY: isPhone
                                                                ? pxToDpWidthLs(30)
                                                                : pxToDp(30),
                                                        },
                                                    ],
                                                },
                                            ]}
                                        >
                                            {name}
                                        </Text>
                                        <View
                                            style={[
                                                {
                                                    width: isPhone
                                                        ? pxToDpWidthLs(200)
                                                        : pxToDp(200),
                                                },
                                                {
                                                    transform: [
                                                        {
                                                            translateX: isPhone
                                                                ? pxToDpWidthLs(180)
                                                                : pxToDp(180),
                                                        },
                                                        {
                                                            translateY:
                                                                OS === "ios" ? pxToDp(50) : pxToDp(20),
                                                        },
                                                    ],
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#6C6C76",
                                                        fontSize: isPhone
                                                            ? pxToDpWidthLs(18)
                                                            : pxToDp(20),
                                                    },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {detail}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                ) : (
                                    <ImageBackground
                                        resizeMode="stretch"
                                        style={[
                                            { width: pxToDp(380), height: pxToDp(262) },
                                            appStyle.flexAliCenter,
                                        ]}
                                        source={subjectList[subjectIndex].itemBg}
                                    >
                                        {renderModuleName(name)}
                                        {lock ? (
                                            <Image
                                                style={[
                                                    { width: pxToDp(20), height: pxToDp(20) },
                                                    {
                                                        transform: [
                                                            { translateX: pxToDp(-8) },
                                                            { translateY: pxToDp(44) },
                                                        ],
                                                    },
                                                ]}
                                                source={require("../images/homepage/icon_lock.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                style={[
                                                    { width: pxToDp(22), height: pxToDp(16) },
                                                    {
                                                        transform: [
                                                            { translateX: pxToDp(-8) },
                                                            { translateY: pxToDp(44) },
                                                        ],
                                                    },
                                                ]}
                                                source={require("../images/homepage/icon_gou.png")}
                                            ></Image>
                                        )}
                                        <View
                                            style={[
                                                { width: pxToDp(156) },
                                                {
                                                    transform: [
                                                        { translateX: pxToDp(86) },
                                                        {
                                                            translateY:
                                                                OS === "ios" ? pxToDp(60) : pxToDp(50),
                                                        },
                                                    ],
                                                },
                                                isPhone
                                                    ? {
                                                        transform: [
                                                            { translateX: pxToDpWidthLs(66) },
                                                            { translateY: pxToDpWidthLs(50) },
                                                        ],
                                                    }
                                                    : null,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        color: "#6C6C76",
                                                        fontSize:
                                                            detail && detail.length > 28
                                                                ? pxToDp(18)
                                                                : pxToDp(20),
                                                    },
                                                    appFont.fontFamily_jcyt_500,
                                                    isPhone
                                                        ? { fontSize: pxToDpWidthLs(14) }
                                                        : null,
                                                ]}
                                            >
                                                {detail}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                )}
                            </View>
                            <Text
                                style={[
                                    {
                                        color: "#B99B7B",
                                        fontSize: pxToDp(24),
                                        fontWeight: "bold",
                                    },
                                ]}
                            >
                                {numMap[xx]}
                            </Text>
                        </View>
                    );
                })}
            </View>
            <Image
                style={[
                    styles.bg2,
                    { marginTop: pxToDp(-76), position: 'relative', zIndex: -1 },
                    isPhone
                        ? { ...styles.bg2Phone, marginTop: pxToDpWidthLs(-52) }
                        : null,
                ]}
                source={require("../images/homepage/item_bg_2.png")}
            ></Image>
        </View>
    };
    return (
        <View style={[styles.container, appStyle.flexCenter]}>
            <TouchableOpacity
                onPress={() => {
                    NavigationUtil.goBack(props);
                }}
                style={[
                    {
                        position: "absolute",
                        top: OS === 'ios' ? pxToDp(36) : pxToDp(10),
                        left: pxToDp(20),
                        zIndex: 1,
                    },
                ]}
            >
                <Image
                    source={require("../images/chineseHomepage/pingyin/new/back.png")}
                    style={[{ width: pxToDp(120), height: pxToDp(80) }]}
                />
            </TouchableOpacity>
            <Image source={require('../images/studyRoute/item_bg_1.png')} style={{ width: '100%', height: pxToDp(630), position: 'absolute', left: 0, top: 0, zIndex: -1 }} />
            <View style={[appStyle.flexAliCenter]}>
                <View style={[styles.content1, { height: OS === 'android' ? pxToDp(720) : pxToDp(1000) }, list.length === 1 ? { paddingTop: OS === 'android' ? pxToDp(160) : pxToDp(300) } : { paddingTop: OS === 'android' ? pxToDp(36) : pxToDp(116) },
                isPhone ? { height: pxToDp(560) } : null, isPhone && list.length === 1 ? { paddingTop: pxToDp(100) } : null, isPhone && list.length !== 1 ? { paddingTop: pxToDp(40) } : null
                ]}>
                    <FlatList
                        data={list}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                        contentContainerStyle={[appStyle.flexJusCenter]}
                    />
                </View>
                <View style={[styles.content2]}>
                    {route ? <>
                        <Text style={[{ color: "#283139", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700,]}>学习路径</Text>
                        <Text style={[{ color: "#636260", fontSize: pxToDp(34), marginTop: OS === 'ios' ? pxToDp(20) : pxToDp(-12) }, appFont.fontFamily_jcyt_500]}>
                            {route}
                        </Text>
                    </> : null}
                </View>
                {list.length ? <View style={[styles.content3, { marginTop: OS === 'android' ? pxToDp(16) : pxToDp(52) }]}>
                    <View style={[styles.inner, appStyle.flexLine, appStyle.flexJusEvenly]}>
                        {subjectList.map((i, x) => {
                            const { icon, iconActive, label, bgActive } = i
                            return <TouchableOpacity style={[styles.subjectItem, appStyle.flexLine, appStyle.flexCenter, subjectIndex === x ? { backgroundColor: bgActive } : null]} key={x} onPress={() => {
                                clickSubject(i, x)
                            }}>
                                <Image style={{ width: pxToDp(44), height: pxToDp(44) }} source={subjectIndex === x ? iconActive : icon}></Image>
                                <Text style={[{ color: subjectIndex === x ? "#fff" : "#283139", fontSize: pxToDp(40), marginLeft: pxToDp(22) }, appFont.fontFamily_jcyt_700]}>{label}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                </View> : null}
            </View>
            <TouchableOpacity style={[{ position: "absolute", bottom: pxToDp(36), right: pxToDp(92) }]} onPress={(() => {
                setVisible(true)
            })}>
                <Image style={{ width: pxToDp(136), height: pxToDp(126) }} source={require('../images/studyRoute/item_bg_2.png')}></Image>
            </TouchableOpacity>
            <Modal
                visible={visible}
                transparent
                supportedOrientations={["portrait", "landscape"]}
            >
                <View style={[{ backgroundColor: 'rgba(0, 0, 0, .3)', flex: 1 }, appStyle.flexCenter]}>
                    <View style={[styles.modalContent, appStyle.flexAliCenter]}>
                        <TouchableOpacity style={[{ position: "absolute", right: pxToDp(-20), top: pxToDp(-20) }]} onPress={() => {
                            setVisible(false)
                            setCode_number('')
                        }}>
                            <Image style={{ width: pxToDp(100), height: pxToDp(100) }} source={require("../images/chineseHomepage/sentence/status2.png")}></Image>
                        </TouchableOpacity>
                        <TextInput style={[styles.input]} placeholderTextColor={'#AFADAC'} placeholder="输入打卡码" onChangeText={(value) => {
                            setCode_number(value)
                        }} />
                        {code_number ? null : <Text style={[{ width: '100%', paddingLeft: pxToDp(80), paddingTop: pxToDp(6), color: "red" }, appFont.fontFamily_jcyt_500]}>* 打卡码不能为空</Text>}
                        <TouchableOpacity style={[styles.confirmBtn]} onPress={confirm}>
                            <View style={[styles.confirmBtnInner, appStyle.flexCenter]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700]}>确定</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F4F1',
        paddingTop: pxToDp(40),
    },
    content1: {
        width: pxToDp(1680),
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: pxToDp(80),
        borderWidth: pxToDp(4),
        borderColor: "#F68E49",
    },
    content2: {
        width: pxToDp(1570),
        marginTop: pxToDp(16)
    },
    content3: {
        width: pxToDp(760),
        height: pxToDp(120),
        borderRadius: pxToDp(200),
        backgroundColor: 'rgba(40,49,57,0.15)',
        paddingBottom: pxToDp(8),
    },
    inner: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(200)
    },
    subjectItem: {
        width: pxToDp(222),
        height: pxToDp(96),
        backgroundColor: "#E6E1DD",
        borderRadius: pxToDp(66)
    },
    bg2: {
        width: pxToDp(1665),
        height: pxToDp(110),
    },
    bg2Phone: {
        width: pxToDpWidthLs(1400),
        height: pxToDpWidthLs(72),
    },
    tagWrap: {
        width: pxToDp(112),
        height: pxToDp(56),
        borderRadius: pxToDp(32),
        borderBottomLeftRadius: 0,
        backgroundColor: "#00C2A2",
        position: "absolute",
    },
    modalContent: {
        width: pxToDp(960),
        height: pxToDp(480),
        backgroundColor: '#EFE9E5',
        borderRadius: pxToDp(100),
        paddingTop: pxToDp(90)
    },
    input: {
        width: pxToDp(844),
        height: pxToDp(160),
        backgroundColor: "rgba(215,209,205,0.8)",
        borderRadius: pxToDp(36),
        paddingLeft: pxToDp(60),
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(44),
        color: '#283139'
    },
    confirmBtn: {
        width: pxToDp(360),
        height: pxToDp(128),
        backgroundColor: "#F07C39",
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8),
        marginTop: pxToDp(36)
    },
    confirmBtnInner: {
        flex: 1,
        backgroundColor: "#FF964A",
        borderRadius: pxToDp(40),
    }
});
export default StudyRoute
