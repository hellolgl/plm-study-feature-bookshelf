import React, { useState } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, ScrollView, Platform, SafeAreaView } from "react-native";
import { pxToDp, touristInfo, getIsTablet, pxToDpWidthLs } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import { useSelector, useDispatch } from "react-redux";
import BackBtn from '../../component/math/BackBtn'
import Avatar from '../../component/homepage/avatar'
import SetInfo from '../../component/center/setInfo'
import { setVisible, setPayCoinVisible } from "../../action/purchase";
import SelectWrongSubject from '../../component/homepage/selectWrongSubject'
import Contact from '../../component/center/contact'
import { setToken, setUserInfoNow, setavatar, setCoin, setRewardCoin } from "../../action/userInfo/index";
import { setMathTextBook } from "../../action/math/bag";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmLogOff from '../../component/center/confirmLogOff'
import MathNavigationUtil from "../../navigator/NavigationMathUtil";
const nav_list_1 = [
    {
        label: '错题集',
        bgColor: '#E7C2C3',
        des: '收集语文字、词、语文同步、智能句、阅读理解的错题。\n\n收集数学同步、AI推题、知识图谱、思维训练和巧算的错题。',
        icon: require('../../images/center/icon_2.png')
    },
    {
        label: '统计',
        bgColor: '#A4DAC2',
        des: '图形化展示学术能力报告。',
        icon: require('../../images/center/icon_3.png')
    },
    {
        label: '我的派币',
        bgColor: '#FFCD7C',
        des: '查看派币的用途及如何赚取派币',
        icon: require("../../images/animateCoin.png")
    }
]

const nav_list_2 = [
    {
        label: '已发布故事',
        bgColor: '#87D4D8',
        des: '查看已经发布的共创故事',
        icon: require('../../images/center/icon_4.png')
    },
    {
        label: '共创浏览记录',
        bgColor: '#93BDF7',
        des: '查看共创区的浏览记录',
        icon: require('../../images/center/icon_5.png')
    },
]

const nav_list_3 = ['联系客服', '隐私政策', '退出登录',
    // '注销账号'
]
function CenterHomePage({ navigation }) {
    const dispatch = useDispatch()
    const { token, currentUserInfo, coin, rewardCoin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { name, username } = currentUserInfo
    const OS = Platform.OS
    const isPhone = !getIsTablet()
    const [setInfoType, setSetInfoType] = useState('')
    const [setInfoBtns, setSetInfoBtns] = useState(null)
    const [visibleInfo, setVisibleInfo] = useState(false)
    const [visibleWrong, setVisibleWrong] = useState(false)
    const [visibleConcat, setVisibleConcat] = useState(false)
    const [visibleLogOff, setVisibleLogOff] = useState(false)
    const handleSetInfo = (type) => {
        if (!token) {
            NavigationUtil.resetToLogin({ navigation });
            return;
        }
        if (type === 'avatar') {
            setSetInfoBtns([{ label: '刷新', key: 'refresh' }, { label: '确定', key: 'confirm' }])
        } else {
            setSetInfoBtns(null)
        }
        setSetInfoType(type)
        setVisibleInfo(true)
    }
    const clickNav1 = (index) => {
        if (!token) {
            NavigationUtil.resetToLogin({ navigation });
            return;
        }
        switch (index) {
            case 0:
                setVisibleWrong(true)
                break;
            case 1:
                NavigationUtil.toChineseStatisticsHome({ navigation });
                break;
            case 2:
                NavigationUtil.toCenterCoinDetails({ navigation })
                break
        }
    }
    const clickNav2 = (index) => {
        if (!token) {
            NavigationUtil.resetToLogin({ navigation });
            return;
        }
        switch (index) {
            case 0:
                NavigationUtil.toSquareHistory({ navigation, data: { type: 'myCreate', isBack: true } });
                break;
            case 1:
                NavigationUtil.toSquareHistory({ navigation, data: { type: 'history', isBack: true } });
                break;
        }

    }
    const clickNav3 = (index) => {
        if (!token) {
            NavigationUtil.resetToLogin({ navigation });
            return;
        }
        switch (index) {
            case 0:
                setVisibleConcat(true)
                break;
            case 1:
                OS === "ios" ? NavigationUtil.toProtocolPage({ navigation, data: { img: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/official-website/static/img/create.png" } })
                    : NavigationUtil.toProtocolPage({ navigation, data: { img: "yinsi" } });
                break;
            case 2:
                logout()
                break
            case 3:
                setVisibleLogOff(true)
                break
        }
    }
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
        NavigationUtil.resetToLogin({ navigation });
    }
    return (
        <SafeAreaView style={[styles.container]}>
            <BackBtn left={isPhone ? pxToDpWidthLs(40) : pxToDp(20)} goBack={() => {
                NavigationUtil.goBack({ navigation });
            }}></BackBtn>
            <View style={[{ height: pxToDp(120) }, appStyle.flexCenter]}>
                <Text style={[{ color: "#283139", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>个人中心</Text>
            </View>


            {username === 'cary1039' ? <View style={[appStyle.flexLine, appStyle.flexJusBetween, { position: 'absolute', left: pxToDp(180), top: pxToDp(50), width: pxToDp(540) }]}>
                <TouchableOpacity onPress={() => {
                    NavigationUtil.toYuwenHomepage({ navigation })
                }}>
                    <Text style={{ fontSize: pxToDp(36) }}>语文课桌</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    MathNavigationUtil.toMathDeskHomepage({ navigation })
                }}>
                    <Text style={{ fontSize: pxToDp(36) }}>数学课桌</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    NavigationUtil.toEnglishDeskHomepage({ navigation })
                }}>
                    <Text style={{ fontSize: pxToDp(36) }}>英语课桌</Text>
                </TouchableOpacity>
            </View> : null}


            <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.contentContainerStyle]}>
                <View style={[styles.content1, appStyle.flexJusCenter]}>
                    <View style={[appStyle.flexTopLine]}>
                        <TouchableOpacity onPress={() => {
                            handleSetInfo('avatar')
                        }}>
                            <Avatar width={176} />
                        </TouchableOpacity>
                        <View style={[{ marginLeft: pxToDp(36) }]}>
                            <View style={[appStyle.flexLine]}>
                                <TouchableOpacity style={[styles.nameWrap, appStyle.flexLine]} onPress={() => {
                                    handleSetInfo('account')
                                }}>
                                    <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{name}</Text>
                                    <Image style={[{ width: pxToDp(48), height: pxToDp(48), marginLeft: pxToDp(24) }]} source={require('../../images/center/icon_1.png')}></Image>
                                </TouchableOpacity>
                                <TouchableOpacity style={[{ marginLeft: pxToDp(54) }]} onPress={() => {
                                    if (!token) {
                                        NavigationUtil.resetToLogin({ navigation });
                                        return;
                                    }
                                    dispatch(setPayCoinVisible(true))
                                }}>
                                    <Image style={[{ width: pxToDp(122), height: pxToDp(126) }]} source={require('../../images/center/item_1.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={[appStyle.flexLine, { marginTop: pxToDp(20) }]}>
                                <View style={[styles.numWrap]}>
                                    <Image resizeMode="contain" source={require("../../images/square/paiCoin.png")} style={[{ width: pxToDp(48), height: pxToDp(48) }]} />
                                    <Text style={[styles.num]}>x {coin}</Text>
                                </View>
                                <View style={[styles.numWrap, { marginLeft: pxToDp(16) }]}>
                                    <Image resizeMode="contain" source={require("../../images/square/fire.png")} style={[{ width: pxToDp(32), height: pxToDp(42) }]} />
                                    <Text style={[styles.num]}>x {rewardCoin}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.editBtn, appStyle.flexCenter]} onPress={() => {
                        if (!token) {
                            NavigationUtil.resetToLogin({ navigation });
                            return;
                        }
                        NavigationUtil.toCenterInfo({ navigation })
                    }}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(30) }, appFont.fontFamily_jcyt_700]}>编辑资料</Text>
                    </TouchableOpacity>
                </View>
                <View style={[appStyle.flexTopLine]}>
                    <View style={[appStyle.flexTopLine, { width: '75%' }]}>
                        {nav_list_1.map((i, x) => {
                            const { bgColor, label, icon, des } = i
                            return <TouchableOpacity style={[styles.navItem, { backgroundColor: bgColor, flex: 1 }]} key={x} onPress={() => {
                                clickNav1(x)
                            }}>
                                <Text style={[{ color: '#283139', fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700, OS === 'ios' ? { marginBottom: pxToDp(40) } : null]}>{label}</Text>
                                <Text style={[{ color: "#615D62", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_500]}>{des}</Text>
                                <Image style={[{ width: pxToDp(80), height: pxToDp(80), position: 'absolute', right: pxToDp(26), bottom: pxToDp(26) }]} source={icon}></Image>
                            </TouchableOpacity>
                        })}
                    </View>
                    <View style={{ flex: 1 }}>
                        {nav_list_2.map((i, x) => {
                            const { bgColor, label, icon, des } = i
                            return <TouchableOpacity style={[styles.navRightItem, { backgroundColor: bgColor }]} key={x} onPress={() => {
                                clickNav2(x)
                            }}>
                                <Text style={[{ color: '#283139', fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700, OS === 'ios' ? { marginBottom: pxToDp(30) } : null]}>{label}</Text>
                                <Text style={[{ color: "#615D62", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_500]}>{des}</Text>
                                <Image style={[{ width: pxToDp(44), height: pxToDp(44), position: 'absolute', right: pxToDp(18), bottom: pxToDp(18) }]} source={icon}></Image>
                            </TouchableOpacity>
                        })}
                    </View>
                </View>
                <View style={[{ marginTop: pxToDp(12) }]}>
                    {nav_list_3.map((i, x) => {
                        return <TouchableOpacity style={[styles.navBottomItem, appStyle.flexLine, appStyle.flexJusBetween]} key={x} onPress={() => {
                            clickNav3(x)
                        }}>
                            <Text style={[{ color: '#283139', fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{i}</Text>
                            <Image resizeMode='contain' style={[{ width: pxToDp(20), height: pxToDp(20) }]} source={require('../../images/center/icon_6.png')}></Image>
                        </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
            <SetInfo type={setInfoType} visible={visibleInfo} btns={setInfoBtns} close={() => {
                setVisibleInfo(false)
            }}></SetInfo>
            <SelectWrongSubject visible={visibleWrong} navigation={navigation} close={() => {
                setVisibleWrong(false)
            }}></SelectWrongSubject>
            <Contact type={1} visible={visibleConcat} tips={'微信扫一扫，添加客服。'} close={() => {
                setVisibleConcat(false)
            }}></Contact>
            <ConfirmLogOff visible={visibleLogOff} logout={logout} close={() => {
                setVisibleLogOff(false)
            }}></ConfirmLogOff>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFE9E5"
    },
    contentContainerStyle: {
        padding: pxToDp(68),
        paddingTop: 0
    },
    content1: {
        height: pxToDp(320),
        width: '100%',
        borderRadius: pxToDp(36),
        backgroundColor: "#D7D1CD",
        paddingLeft: pxToDp(40),
        position: 'relative',
        marginBottom: pxToDp(22)
    },
    nameWrap: {
        height: pxToDp(108),
        paddingLeft: pxToDp(56),
        paddingRight: pxToDp(24),
        borderRadius: pxToDp(34),
        backgroundColor: "#919192"
    },
    numWrap: {
        height: pxToDp(64),
        borderRadius: pxToDp(46),
        backgroundColor: "#EBE8E6",
        paddingLeft: pxToDp(22),
        paddingRight: pxToDp(22),
        ...appStyle.flexLine
    },
    num: {
        color: '#283139',
        fontSize: pxToDp(28),
        marginLeft: pxToDp(16),
        ...appFont.fontFamily_jcyt_500
    },
    editBtn: {
        width: pxToDp(240),
        height: pxToDp(80),
        borderRadius: pxToDp(66),
        backgroundColor: "#283139",
        position: 'absolute',
        right: pxToDp(62),
        bottom: pxToDp(28)
    },
    navItem: {
        width: pxToDp(484),
        height: pxToDp(496),
        borderRadius: pxToDp(40),
        marginRight: pxToDp(22),
        paddingTop: pxToDp(76),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40)
    },
    navRightItem: {
        height: pxToDp(240),
        borderRadius: pxToDp(40),
        paddingTop: pxToDp(48),
        paddingLeft: pxToDp(26),
        paddingRight: pxToDp(26),
        marginBottom: pxToDp(14)
    },
    navBottomItem: {
        width: '100%',
        height: pxToDp(188),
        borderRadius: pxToDp(36),
        backgroundColor: "#E1DBD7",
        marginBottom: pxToDp(22),
        paddingLeft: pxToDp(108),
        paddingRight: pxToDp(58)
    }
});
export default CenterHomePage;
