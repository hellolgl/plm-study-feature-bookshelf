import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, ScrollView } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _ from 'lodash'
import FreeTag from "../../../../component/FreeTag";
import { setVisible } from '../../../../action/purchase/index'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import CoinView from '../../../../component/coinView'

const WordsIndex = ({ navigation }) => {
    const dispatch = useDispatch()
    const { currentUserInfo, selestModuleAuthority } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, grade, term } = currentUserInfo
    const [unitList, setUnitList] = useState([])
    const [unitIndex, setUnitIndex] = useState(0)
    const OS = Platform.OS
    const unitMap = {
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十'
    }
    useEffect(() => {
        getUnit()
    }, [])
    const getUnit = () => {
        const data = {
            grade_code: checkGrade,
            term_code: checkTeam,
        }
        axios.get(api.getChineseUnitList, { params: data }).then(res => {
            const data = res.data.data
            let unit_list = []
            for (let i in data) {
                unit_list.push({
                    unitName: '第' + unitMap[i] + '单元',
                    data: data[i].filter(i => {
                        return i.has_exercise || i.has_spell
                    })
                })
            }
            setUnitList(unit_list)
        })
    }
    const selectUnit = (index) => {
        setUnitIndex(index)
    }
    const click = (item, type) => {
        if (!selestModuleAuthority && unitIndex !== 0) {
            dispatch(setVisible(true))
            return
        }
        const { origin, learning_name } = item
        switch (type) {
            case 'study':
                NavigationUtil.toWordsStudy({
                    navigation,
                    data: { origin, learning_name }
                });
                break;
            case 'test':
                NavigationUtil.toWordAccumulation({
                    navigation,
                    data: { origin, learning_name },
                });
                break;
            case 'writing':
                const title = grade + term + '-' + unitList[unitIndex].unitName
                NavigationUtil.toWordsWriting({
                    navigation,
                    data: { origin, learning_name, title },
                });
                break;
        }
    }
    const lessonList = unitList.length ? unitList[unitIndex].data : []
    return (
        <ImageBackground resizeMode="stretch" source={require("../../../../images/chineseHomepage/flow/flowBg.png")} style={[styles.container]}>
            <View style={[appStyle.flexCenter, styles.header]}>
                <BackBtn left={pxToDp(20)} top={OS === 'ios' ? pxToDp(40) : pxToDp(20)} goBack={() => {
                    NavigationUtil.goBack({ navigation });
                }}></BackBtn>
                <Text style={[{ color: '#475266', fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}>字词积累</Text>
            </View>
            <View style={[appStyle.flexTopLine, styles.content]}>
                <View style={[styles.left]}>
                    <ScrollView style={{ flex: 1 }}>
                        <Text style={[{ color: "rgba(71, 82, 102, 0.50)", fontSize: pxToDp(24), marginLeft: pxToDp(20) }, appFont.fontFamily_jcyt_500, OS === 'ios' ? { marginBottom: pxToDp(12) } : null]}>{grade}{term}</Text>
                        {unitList.map((i, x) => {
                            return <TouchableOpacity style={[styles.unitItem, unitIndex === x ? { backgroundColor: "#EDEDF4" } : null]} key={x} onPress={() => {
                                selectUnit(x)
                            }}>
                                <View style={[styles.unitItemInner, unitIndex === x ? { backgroundColor: "#fff", borderRadius: pxToDp(40) } : null]}>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(40) }, unitIndex === x ? appFont.fontFamily_jcyt_700 : appFont.fontFamily_jcyt_500]}>{i.unitName}</Text>
                                </View>
                            </TouchableOpacity>
                        })}
                    </ScrollView>
                </View>
                <View style={[styles.right]}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[appStyle.flexTopLine, appStyle.flexLineWrap, appStyle.flexJusBetween, { paddingTop: pxToDp(28), paddingLeft: pxToDp(14) }]}>
                        {lessonList.map((i, x) => {
                            return <View style={[styles.lessonItem]} key={x}>
                                {unitIndex === 0 && !selestModuleAuthority ? <View style={[{ position: "absolute", top: pxToDp(-26), left: pxToDp(-12), zIndex: 1 }]}>
                                    <FreeTag haveAllRadius style={{ borderBottomRightRadius: 0 }}></FreeTag>
                                </View> : null}
                                <View style={[styles.lessonItemInner, appStyle.flexAliCenter, appStyle.flexJusBetween]}>
                                    <View style={[{ paddingLeft: pxToDp(46), paddingRight: pxToDp(46) }, OS === 'android' ? { marginTop: pxToDp(-40) } : null]}>
                                        <Text style={[{ color: "#475266", fontSize: i.learning_name.length > 20 ? pxToDp(40) : pxToDp(48) }, appFont.fontFamily_syst_bold]}>{i.learning_name}</Text>
                                    </View>
                                    <View style={[appStyle.flexLine, { width: '100%', paddingLeft: pxToDp(32), paddingRight: pxToDp(32) }]}>
                                        <TouchableOpacity style={[styles.btn]} onPress={() => {
                                            click(i, 'study')
                                        }}>
                                            <Image style={[styles.icon]} source={require("../../../../images/chineseHomepage/words/icon_1.png")} />
                                            <Text style={[styles.btnTxt]}>学一学</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.btn]} onPress={() => {
                                            click(i, 'test')
                                        }}>
                                            <Image style={[styles.icon]} source={require("../../../../images/chineseHomepage/words/icon_2.png")} />
                                            <Text style={[styles.btnTxt]}>课文诊断</Text>
                                        </TouchableOpacity>
                                        {i.has_spell ? <TouchableOpacity style={[styles.btn]} onPress={() => {
                                            click(i, 'writing')
                                        }}>
                                            <Image style={[styles.icon]} source={require("../../../../images/chineseHomepage/words/icon_3.png")} />
                                            <Text style={[styles.btnTxt]}>听写</Text>
                                        </TouchableOpacity> : null}
                                    </View>
                                </View>
                            </View>
                        })}
                    </ScrollView>
                </View>
            </View>
            <CoinView></CoinView>
            <TouchableOpacity style={[styles.testBtn]} onPress={() => {
                NavigationUtil.toWordTreeIndex({ navigation })
            }}>
                <View style={[styles.testBtnInner, appStyle.flexCenter]}>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>字词单元测</Text>
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
        width: pxToDp(320),
        marginRight: pxToDp(16)
    },
    unitItem: {
        width: pxToDp(320),
        height: pxToDp(120),
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(40),
    },
    unitItemInner: {
        flex: 1,
        ...appStyle.flexCenter
    },
    right: {
        flex: 1,
    },
    lessonItem: {
        width: pxToDp(720),
        height: pxToDp(440),
        paddingBottom: pxToDp(8),
        backgroundColor: "#EDEDF4",
        borderRadius: pxToDp(100),
        marginBottom: pxToDp(20)
    },
    lessonItemInner: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(100),
        paddingTop: pxToDp(50),
        paddingBottom: pxToDp(40),
    },
    btn: {
        width: pxToDp(208),
        height: pxToDp(200),
        backgroundColor: 'rgba(255, 235, 183, .7)',
        borderRadius: pxToDp(60),
        ...appStyle.flexCenter,
        marginRight: pxToDp(16)
    },
    icon: {
        width: pxToDp(80),
        height: pxToDp(80)
    },
    btnTxt: {
        color: '#FFAF1B',
        fontSize: pxToDp(40),
        ...appFont.fontFamily_jcyt_700
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
    }
});
export default WordsIndex;
