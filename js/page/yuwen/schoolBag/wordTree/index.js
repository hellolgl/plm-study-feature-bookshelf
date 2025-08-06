import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform } from "react-native";
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

const WordTreeIndex = ({ navigation }) => {
    const dispatch = useDispatch()
    const { currentUserInfo, selestModuleAuthority } = useSelector((state) => state.toJS().userInfo);
    const { textbook } = useSelector((state) => state.toJS().yuwenInfo);
    const { checkGrade, checkTeam } = currentUserInfo;
    const [units, setUnits] = useState([])
    const OS = Platform.OS
    const unit_config = {
        '01': {
            label: '第一单元',
            top: pxToDp(310),
            left: pxToDp(0),
            key: 1
        },
        '02': {
            label: '第二单元',
            top: pxToDp(-20),
            left: pxToDp(170),
            key: 2
        },
        '03': {
            label: '第三单元',
            top: pxToDp(140),
            left: pxToDp(630),
            key: 3
        },
        '04': {
            label: '第四单元',
            top: pxToDp(640),
            left: pxToDp(400),
            key: 4
        },
        '05': {
            label: '第五单元',
            top: pxToDp(540),
            left: pxToDp(930),
            key: 5
        },
        '06': {
            label: '第六单元',
            top: pxToDp(30),
            left: pxToDp(1150),
            key: 6
        },
        '07': {
            label: '第七单元',
            top: pxToDp(590),
            left: pxToDp(1400),
            key: 7
        },
        '08': {
            label: '第八单元',
            top: pxToDp(180),
            left: pxToDp(1600),
            key: 8
        }
    }
    useEffect(() => {
        getUnit()
    }, [])
    const getUnit = () => {
        let obj = {
            grade_code: checkGrade,
            term_code: checkTeam,
            textbook,
        };
        axios.get(api.wisdomTreeUnit, { params: obj }).then((res) => {
            const data = res.data.data
            let arr = []
            data.forEach((i, x) => {
                arr.push({ ...unit_config[i], unit_code: i })
            })
            let unit_list = _.sortBy(arr, (i) => {
                return i.key
            })
            setUnits(unit_list)
        });
    }
    const selectUnit = (i) => {
        if (!selestModuleAuthority && i.key !== 1) {
            dispatch(setVisible(true))
            return
        }
        NavigationUtil.toWordTreeUnitWord({
            navigation,
            data: { unit_code: i.unit_code, unit_name: i.label },
        });
    }
    return (
        <ImageBackground resizeMode="stretch" source={OS === 'android' ? require('../../../../images/chineseWordTree/bg_1.png') : require('../../../../images/chineseWordTree/bg_1_ios.png')} style={[styles.container]}>
            <View style={[appStyle.flexCenter, styles.header]}>
                <BackBtn top={0} goBack={() => {
                    NavigationUtil.goBack({ navigation });
                }}></BackBtn>
                <Text style={[{ color: '#475266', fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}>字学树</Text>
            </View>
            <View style={[styles.btnWrap, appStyle.flexLine]}>
                <TouchableOpacity style={[styles.btn]} onPress={() => {
                    if (selestModuleAuthority) {
                        NavigationUtil.toChineseDailyBagExercise({ navigation })
                    } else {
                        dispatch(setVisible(true))
                    }
                }}>
                    <View style={[styles.btnInner, appStyle.flexLine, appStyle.flexJusBetween]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>每日一练</Text>
                        <View style={[appStyle.flexLine]}>
                            <View style={[styles.btnInnerWrap, appStyle.flexCenter]}>
                                <Text style={[{ color: "#FF964A", fontSize: pxToDp(20) }, appFont.fontFamily_jcyt_500]}>AI推题</Text>
                            </View>
                            <Image style={[{ width: pxToDp(28), height: pxToDp(28) }]} source={require("../../../../images/chineseHomepage/sentence/go.png")} />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.recordBtn, appStyle.flexCenter]} onPress={() => NavigationUtil.toChineseDidExercise({
                    navigation,
                    data: {
                        type: 'daily'
                    },
                })}>
                    <Text style={[{ color: "#FF964A", fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>记录</Text>
                </TouchableOpacity>
            </View>
            <View style={[appStyle.flexCenter, { flex: 1 }]}>
                <View style={[styles.content, appStyle.flexCenter,]}>
                    <Image style={{ width: pxToDp(1664), height: pxToDp(669) }} source={require('../../../../images/chineseWordTree/line.png')}></Image>
                    {units.map((i, x) => {
                        const { top, left, label, key } = i
                        return <TouchableOpacity style={[styles.item, { top, left }]} key={x} onPress={() => {
                            selectUnit(i)
                        }}>
                            <ImageBackground style={[appStyle.flexAliCenter, { width: pxToDp(272), height: pxToDp(300), paddingTop: pxToDp(20), position: "relative" }]} source={require('../../../../images/chineseWordTree/item_1.png')}>
                                {key === 1 && !selestModuleAuthority ? <View style={[{ position: "absolute", top: pxToDp(80), right: pxToDp(-36), zIndex: 1 }]}>
                                    <FreeTag style={{}}></FreeTag>
                                </View> : null}
                                <ImageBackground style={[styles.unitWrap, appStyle.flexCenter]} source={require('../../../../images/chineseWordTree/item_2.png')}>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(40), marginTop: pxToDp(-16) }, appFont.fontFamily_jcyt_700]}>{label}</Text>
                                </ImageBackground>
                            </ImageBackground>
                        </TouchableOpacity>

                    })}
                </View>
            </View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? pxToDp(30) : pxToDp(60)
    },
    header: {
        height: pxToDp(80)
    },
    item: {
        position: 'absolute',
    },
    unitWrap: {
        width: pxToDp(240),
        height: pxToDp(120)
    },
    btnWrap: {
        position: "absolute",
        top: Platform.OS === "android" ? pxToDp(36) : pxToDp(46),
        right: pxToDp(42)
    },
    btn: {
        width: pxToDp(422),
        height: pxToDp(108),
        borderRadius: pxToDp(40),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
        marginRight: pxToDp(20)
    },
    btnInner: {
        flex: 1,
        backgroundColor: "#FF964A",
        borderRadius: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(26)
    },
    btnInnerWrap: {
        width: pxToDp(114),
        height: pxToDp(44),
        borderRadius: pxToDp(100),
        backgroundColor: "#fff",
    },
    recordBtn: {
        width: pxToDp(104),
        height: pxToDp(104),
        borderRadius: pxToDp(52),
        backgroundColor: '#fff'
    },
    content: {
        width: pxToDp(1900),
        height: pxToDp(960),
    }
});
export default WordTreeIndex;
