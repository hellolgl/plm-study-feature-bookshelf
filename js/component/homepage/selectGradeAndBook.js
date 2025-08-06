import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image } from 'react-native';
import { pxToDp } from '../../util/tools';
import { appStyle, appFont } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserInfoNow } from '../../action/userInfo'
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import { setMathTextBook } from '../../action/math/bag'

const getMap = (arr) => {
    const map = arr.reduce((c, i) => {
        c[i.value] = i.label
        return c
    }, {})
    return map
}

const gradeOptions = [
    {
        value: "01",
        label: "一年级",
    },
    {
        value: "02",
        label: "二年级",
    },
    {
        value: "03",
        label: "三年级",
    },
    {
        value: "04",
        label: "四年级",
    },
    {
        value: "05",
        label: "五年级",
    },
    {
        value: "06",
        label: "六年级",
    },
];

const gradeMap = getMap(gradeOptions)

const termOptions = [
    {
        value: "00",
        label: "上学期",
    },
    {
        value: "01",
        label: "下学期",
    },
];

const termMap = getMap(termOptions)

function Item({ item, active, click, style }) {
    return <TouchableOpacity
        onPress={() => {
            click(item.value)
        }}
        style={[
            styles.item,
            {
                backgroundColor: active ? "#363A4E" : "#EEEEEE",
            },
            style
        ]}
    >
        <View
            style={[
                styles.itemInner,
                active ? { backgroundColor: "#454A65" } : null,
            ]}
        >
            {active ? <Image style={[styles.gouImg]} source={require("../../images/new-android-purchase/check.png")}></Image> : null}
            <Text
                style={[
                    styles.txt,
                    active ? { color: "#fff" } : null,
                ]}
            >
                {item.label}
            </Text>
        </View>
    </TouchableOpacity>
}

function SelectGradeAndBook({ visible, type, back }) {
    const dispatch = useDispatch()
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const { textBookCode } = useSelector(
        (state) => state.toJS().bagMath
    );
    const info_checkGrade = currentUserInfo.checkGrade
    const info_checkTerm = currentUserInfo.checkTeam
    // const info_textBook = currentUserInfo.textBook
    const { name } = currentUserInfo
    const [checkGrade, setCheckGrade] = useState(info_checkGrade)
    const [checkTerm, setCheckTerm] = useState(info_checkTerm)
    const [bookList, setBookList] = useState([])
    const [checkBook, setCheckBook] = useState(textBookCode)
    const bookMap = useRef({})
    useEffect(() => {
        axios.get(api.mathGetTextbook).then(res => {
            const data = res.data.data
            setBookList(data)
            bookMap.current = data.reduce((c, i) => {
                c[String(i.textbook)] = i.name
                return c
            }, {})
        })
    }, [])
    useEffect(() => {
        setCheckBook(textBookCode)
    }, [textBookCode])
    useEffect(() => {
        setCheckGrade(info_checkGrade)
    }, [info_checkGrade])
    useEffect(() => {
        setCheckTerm(info_checkTerm)
    }, [info_checkTerm])
    const confirm = () => {
        let info = _.cloneDeep(currentUserInfo)
        if (type === 'grade') {
            info.checkGrade = checkGrade
            info.grade = gradeMap[checkGrade]
            info.checkTeam = checkTerm
            info.term = termMap[checkTerm]
            AsyncStorage.setItem(`${name}_term`, checkTerm)
            AsyncStorage.setItem(`${name}_grade`, checkGrade)
        }
        if (type === 'book') {
            info.textBook = checkBook;
            info.textbookname = bookMap.current[checkBook];
            AsyncStorage.setItem(`${name}_textbook`, checkBook);
        }
        dispatch(setUserInfoNow(info))
        dispatch(setMathTextBook(checkBook))
        AsyncStorage.setItem("userInfo", JSON.stringify(info));
        back()
    }
    const renderContent = () => {
        if (type === 'grade') {
            return <View>
                <Text style={styles.titleTxt}>年级</Text>
                <View style={[appStyle.flexTopLine, styles.warp]}>
                    {gradeOptions.map((item, index) => {
                        const active = checkGrade === item.value
                        return <Item key={index} active={active} item={item} click={setCheckGrade}></Item>
                    })}
                </View>
                <Text style={styles.titleTxt}>学期</Text>
                <View style={[appStyle.flexTopLine, styles.warp, { width: pxToDp(440) }]}>
                    {termOptions.map((item, index) => {
                        const active = checkTerm === item.value
                        return <Item key={index} active={active} item={item} click={setCheckTerm}></Item>
                    })}
                </View>
            </View>
        } else if (type === 'book') {
            return <View>
                <View style={[appStyle.flexAliEnd, appStyle.flexTopLine]}>
                    <Text style={[styles.titleTxt]}>教材</Text>
                    <Text style={[styles.titleTxt, { fontSize: pxToDp(28), marginLeft: 0 }]}>（数学）</Text>
                </View>
                <View style={[appStyle.flexTopLine, styles.warp, appStyle.flexLineWrap, { width: pxToDp(890) }]}>
                    {bookList.map((item, index) => {
                        const active = checkBook === String(item.textbook)
                        return <Item style={{ marginBottom: pxToDp(24) }} key={index} active={active} item={{ value: String(item.textbook), label: item.name }} click={setCheckBook}></Item>
                    })}
                </View>
                <View style={[appStyle.flexAliEnd]}>
                    <Text style={[{ color: "#878793", fontSize: pxToDp(20), marginTop: pxToDp(10) }, appFont.fontFamily_jcyt_500,]}>
                        教材版本仅针对数学科目
                    </Text>
                </View>
            </View>
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent
            maskClosable={false}
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
        >
            <View style={[{ flex: 1, backgroundColor: "rgba(0,0,0,.5)" }, appStyle.flexCenter]}>
                <View style={[styles.content, type === 'grade' ? { width: pxToDp(1360) } : { width: 'auto' }]}>
                    {renderContent()}
                    <View style={[appStyle.flexLine, appStyle.flexJusCenter, { marginTop: pxToDp(52) }]}>
                        <TouchableOpacity style={[styles.btn, { marginRight: pxToDp(108) }]} onPress={() => {
                            back()
                        }}>
                            <View style={[styles.btnInner]}>
                                <Text style={[styles.btnTxt]}>返回</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn]} onPress={confirm}>
                            <View style={[styles.btnInner]}>
                                <Text style={[styles.btnTxt]}>确认</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    content: {
        // minWidth: pxToDp(920),
        backgroundColor: "#F3EEE8",
        borderRadius: pxToDp(80),
        paddingTop: pxToDp(54),
        paddingBottom: pxToDp(54),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40)
    },
    btn: {
        width: pxToDp(296),
        paddingBottom: pxToDp(4),
        backgroundColor: "#FFB547",
        borderRadius: pxToDp(24),
    },
    btnInner: {
        height: pxToDp(88),
        borderRadius: pxToDp(24),
        backgroundColor: "#FFDB5D",
        ...appStyle.flexCenter,
    },
    btnTxt: {
        fontSize: pxToDp(36),
        color: "#454A65",
        ...appFont.fontFamily_jcyt_700
    },
    titleTxt: {
        fontSize: pxToDp(36),
        color: "#454A65",
        ...appFont.fontFamily_jcyt_700,
        marginLeft: pxToDp(20)
    },
    item: {
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(20),
        ...appStyle.flexCenter,
        backgroundColor: "#E8E8F2",
        marginRight: pxToDp(20),
    },
    itemInner: {
        minWidth: pxToDp(188),
        paddingLeft: pxToDp(16),
        paddingRight: pxToDp(16),
        height: pxToDp(72),
        borderRadius: pxToDp(20),
        ...appStyle.flexCenter,
        backgroundColor: "#fff",
        ...appStyle.flexLine,
    },
    txt: {
        fontSize: pxToDp(28),
        color: "#454A65",
        ...appFont.fontFamily_jcyt_700,
    },
    warp: {
        backgroundColor: "#ECE6E0",
        padding: pxToDp(20),
        borderRadius: pxToDp(24),
    },
    gouImg: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginRight: pxToDp(24),
    },
});
export default SelectGradeAndBook;
