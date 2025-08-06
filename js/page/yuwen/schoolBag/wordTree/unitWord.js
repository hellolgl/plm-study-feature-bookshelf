import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Platform, Dimensions, TouchableWithoutFeedback, ActivityIndicator, DeviceEventEmitter } from "react-native";
import { appFont, appStyle } from "../../../../theme";
import { pxToDp } from "../../../../util/tools";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../util/http/api";
import axios from "../../../../util/http/axios";
import _ from 'lodash'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import BackBtn from "../../../../component/math/BackBtn";
import Tree from './components/tree'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WordTreeUnitWord = ({ navigation }) => {
    const dispatch = useDispatch()
    const { currentUserInfo } = useSelector((state) => state.toJS().userInfo);
    const { checkGrade, checkTeam, id } = currentUserInfo;
    const { textbook } = useSelector((state) => state.toJS().yuwenInfo);
    const OS = Platform.OS
    const { unit_code, unit_name } = navigation.state.params.data
    const [btn_message_1, setBtn_message_1] = useState({ x: 0, y: 0 })
    const [btn_message_2, setBtn_message_2] = useState({ x: 0, y: 0 })
    const [btnHightLight, setBtnHightLight] = useState('1')
    const [statisticData, setStatisticData] = useState([
        {
            value: 0,
            label: "已诊断生字",
        },
        {
            value: 0,
            label: "已掌握生字",
        },
        {
            value: 0,
            label: "已诊断词语",
        },
        {
            value: 0,
            label: "已掌握词语",
        },
        {
            value: 0,
            label: "已拓展生字",
        },
        {
            value: 0,
            label: "已拓展词语",
        },
    ])
    const [knowledgeList, setKnowledgeList] = useState([])
    const [knowledge, setKnowledge] = useState(null)
    const [show, setShow] = useState(false)
    const [page, setPage] = useState(1)
    const [chatData, setChatData] = useState(null)
    const [wordList, setWordList] = useState([])
    const [wordListKey, setWordListKey] = useState('')
    const [showModal, setShowModal] = useState(false)
    const page_total = useRef(0)
    useEffect(() => {
        getStatistic()
    }, [])
    useEffect(() => {
        getKnowledge()
        const eventListener = DeviceEventEmitter.addListener('refreshDetailsAndHomePage', (data) => {
            const { type, origin, character, wordList, wordListKey } = data
            setChatData(null)
            // console.log('wordList:::::::::', type, origin, character, wordList, wordListKey)
            getStatistic()
            if (type === 'word') {
                getKnowledge(true, { origin, knowledge_point: character })
            } else {
                getKnowledge(false, { origin, knowledge_point: character }, wordList, wordListKey)
            }
        });
        return (() => {
            eventListener.remove()
        })
    }, [page])
    const getStatistic = () => {
        const params = {
            grade_code: checkGrade,
            term_code: checkTeam,
            textbook,
            student_code: id,
            unit_code: unit_code,
        }
        axios.get(api.knowledgeTree, { params }).then(res => {
            let _statisticData = _.cloneDeep(statisticData)
            const data = res.data.data.tree
            data.forEach((i) => {
                const { knowledge_type, r_t_total, r_total, w_t_total, w_total } = i
                if (knowledge_type === '1') {
                    // 字
                    _statisticData[0].value = Number(r_total) + Number(w_total); //已诊断生字
                    _statisticData[1].value = r_total; //已掌握生字
                    _statisticData[4].value = Number(r_t_total) + Number(w_t_total); //已拓展生字
                } else {
                    // 词
                    _statisticData[2].value = Number(r_total) + Number(w_total); //已诊断词语
                    _statisticData[3].value = r_total; //已掌握词语
                    _statisticData[5].value = Number(r_t_total) + Number(w_t_total); //已拓展词语
                }
            })
            setStatisticData(_statisticData)
            setKnowledgeList(res.data.data.knowledge)
        })
    }
    const getKnowledge = (isGetExpand, expandParams, list, key) => {
        const params = {
            grade_code: checkGrade,
            term_code: checkTeam,
            textbook,
            student_code: id,
            unit_code: unit_code,
            page,
        }
        axios.get(api.getWordTreeData, { params }).then(res => {
            const { page_size, total } = res.data.data.page_info
            const knowledge = res.data.data.knowledge
            // console.log('knowledge:::::::::::', knowledge, params)
            let data = []
            let links = []
            knowledge.forEach((i, x) => {
                let obj = {
                    name: i.knowledge_point,
                    symbolSize: pxToDp(220),
                }
                if (i.correction === '0') {
                    obj.itemStyle = {
                        color: '#87EDCB'
                    }
                }
                if (i.correction === '1') {
                    obj.itemStyle = {
                        color: '#FF9797'
                    }
                }
                data.push(obj)
                if (knowledge[x + 1]) {
                    links.push({
                        source: i.knowledge_point,
                        target: knowledge[x + 1].knowledge_point
                    })
                }
            })

            if (isGetExpand) {
                setChatData(null)
                expand({
                    data,
                    links
                }, expandParams)
            } else {
                if (list && list.length) {
                    const size_map = {
                        2: pxToDp(150),
                        3: pxToDp(170),
                        4: pxToDp(200)
                    }
                    const _chatData = {
                        data,
                        links
                    }
                    list.forEach((i, x) => {
                        const dateObj = {
                            name: i.knowledge_point,
                            symbolSize: size_map[i.knowledge_point.length],
                            label: {
                                fontSize: pxToDp(42)
                            }
                        }
                        if (i.correction === '0') {
                            dateObj.itemStyle = {
                                color: '#87EDCB'
                            }
                        }
                        if (i.correction === '1') {
                            dateObj.itemStyle = {
                                color: '#FF9797'
                            }
                        }
                        _chatData.data.push(dateObj)
                        const linkObj = {
                            source: key,
                            target: i.knowledge_point
                        }
                        _chatData.links.push(linkObj)
                        setChatData(_chatData)
                    })

                } else {
                    setChatData({
                        data,
                        links
                    })
                }
            }
            page_total.current = Math.ceil(total / page_size)
        })
    }
    const handleClick = (data) => {
        const { name } = data
        if (name.length === 1) {
            const word = knowledgeList.filter((i) => {
                return i.knowledge_point === name
            })
            setKnowledge(word[0])
            // console.log('11111', { knowledge_point: word[0].knowledge_point, origin: word[0].origin })
            // axios.get(api.getHasExercises, { params: { knowledge_point: word[0].knowledge_point, origin: word[0].origin } }).then(res => {
            //     const tag = res.data.data.tag
            //     console.log('============', tag, res)
            //     setTag(tag)
            // })
            setShowModal(true)
        } else {
            const word = wordList.filter((i) => {
                return i.knowledge_point === name
            })
            NavigationUtil.toWordTreeWordDetails({
                navigation,
                data: { character: knowledge.knowledge_point, knowledge_point: word[0].knowledge_point, knowledge_point_code: word[0].knowledge_point_code, unit_code, origin: word[0].origin },
            });
        }
    }
    const pre = () => {
        setChatData(null)
        setPage(page - 1)
    }
    const next = () => {
        setChatData(null)
        setPage(page + 1)
    }
    const expand = (data, paramsValue) => {
        const _chatData = _.cloneDeep(data ? data : chatData)
        const params = paramsValue ? paramsValue : {
            knowledge_point: knowledge.knowledge_point,
            origin: knowledge.origin
        }
        const size_map = {
            2: pxToDp(150),
            3: pxToDp(170),
            4: pxToDp(200),
            7: pxToDp(260),
            10: pxToDp(260)
        }
        axios.get(api.getConnectWord, { params }).then(res => {
            const data = res.data.data
            // console.log('expand::::::::::', data)
            setWordList(data)
            setWordListKey(params.knowledge_point)
            setChatData(null)
            _chatData.data = _chatData.data.filter((i) => {
                return i.name.length === 1
            })
            _chatData.links = _chatData.links.filter((i) => {
                return i.target.length === 1
            })
            data.forEach((i, x) => {
                const dateObj = {
                    name: i.knowledge_point,
                    symbolSize: size_map[i.knowledge_point.length],
                    label: {
                        fontSize: i.knowledge_point.length > 4 ? pxToDp(36) : pxToDp(42)
                    }
                }
                if (i.correction === '0') {
                    dateObj.itemStyle = {
                        color: '#87EDCB'
                    }
                }
                if (i.correction === '1') {
                    dateObj.itemStyle = {
                        color: '#FF9797'
                    }
                }
                _chatData.data.push(dateObj)
                const linkObj = {
                    source: paramsValue ? paramsValue.knowledge_point : knowledge.knowledge_point,
                    target: i.knowledge_point
                }
                _chatData.links.push(linkObj)
            })
            setChatData(_chatData)
            setShowModal(false)
        })
    }
    return (
        <ImageBackground resizeMode="stretch" source={OS === 'android' ? require('../../../../images/chineseWordTree/bg_2.png') : require('../../../../images/chineseWordTree/bg_2_ios.png')} style={[styles.container]}>
            <View style={[appStyle.flexCenter, styles.header]}>
                <BackBtn top={0} goBack={() => {
                    NavigationUtil.goBack({ navigation });
                }}></BackBtn>
                <Text style={[{ color: '#475266', fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}>{unit_name}</Text>
            </View>
            <TouchableOpacity onLayout={(e) => {
                const { x, y } = e.nativeEvent.layout
                setBtn_message_1({ x, y })
            }} style={[styles.btn, { top: OS === 'android' ? pxToDp(30) : pxToDp(60), right: pxToDp(222) }]} onPress={() => {
                setBtnHightLight('1')
                setShow(true)
            }}>
                <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_1.png')}></Image>
                <Text style={[styles.btnTxt]}>统计</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { top: OS === 'android' ? pxToDp(30) : pxToDp(60), right: pxToDp(46) }]} onLayout={(e) => {
                const { x, y } = e.nativeEvent.layout
                setBtn_message_2({ x, y })
            }} onPress={() => {
                setBtnHightLight('2')
                setShow(true)
            }}>
                <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_2.png')}></Image>
                <Text style={[styles.btnTxt]}>规则</Text>
            </TouchableOpacity>
            {page > 1 && chatData ? <TouchableOpacity style={[{ position: "absolute", left: pxToDp(20), top: "50%", zIndex: 99, transform: [{ translateY: pxToDp(-80) }], }]} onPress={pre}>
                <Image style={[styles.pageBtn]} source={require('../../../../images/chineseWordTree/pre_btn.png')}></Image>
            </TouchableOpacity> : null}
            {page === page_total.current || !chatData ? null : <TouchableOpacity style={[{ position: "absolute", right: pxToDp(20), top: "50%", zIndex: 99, transform: [{ translateY: pxToDp(-80) }] }]} onPress={next}>
                <Image style={[styles.pageBtn]} source={require('../../../../images/chineseWordTree/next_btn.png')}></Image>
            </TouchableOpacity>}
            <View style={[{ flex: 1 }]}>
                {chatData ? <Tree data={chatData} handleClick={handleClick}></Tree> : <View style={[{ flex: 1 }, appStyle.flexCenter]}><ActivityIndicator size="large" color="#D3D3D3" /></View>}
            </View>
            {show ? <View style={[styles.modal]}>
                <TouchableWithoutFeedback onPress={() => {
                    setShow(false)
                }}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                {btnHightLight === '1' ? <View style={[styles.btn, { top: btn_message_1.y, left: btn_message_1.x }]}>
                    <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_1.png')}></Image>
                    <Text style={[styles.btnTxt]}>统计</Text>
                </View> : <View style={[styles.btn, { top: btn_message_2.y, left: btn_message_2.x }]}>
                    <Image style={[styles.btnIcon]} source={require('../../../../images/chineseWordTree/icon_2.png')}></Image>
                    <Text style={[styles.btnTxt]}>规则</Text>
                </View>}
                {btnHightLight === '1' ? <View style={[styles.modalContent]}>
                    <View style={styles.triangle_up}></View>
                    <View style={[styles.modalContentInner]}>
                        {statisticData.map((i, x) => {
                            return <View key={x} style={[OS === 'ios' ? { marginBottom: pxToDp(30) } : { marginBottom: pxToDp(6) }]}>
                                <View style={[appStyle.flexLine]}>
                                    <Image style={[{ width: pxToDp(64), height: pxToDp(64), marginRight: pxToDp(20) }]} source={require('../../../../images/chineseWordTree/icon_3.png')}></Image>
                                    <Text style={[{ color: "#475266", fontSize: pxToDp(36), marginRight: pxToDp(20) }, appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                                    <Text style={[{ color: "#35CBB2", fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700]}> {i.value}</Text>
                                </View>
                                {x === 1 || x === 3 ? <View style={[appStyle.flexCenter]}>
                                    <View style={[styles.modalLine]}></View>
                                </View> : null}
                            </View>
                        })}
                    </View>
                </View> : <View style={[styles.modalContent, { right: pxToDp(46), width: pxToDp(366) }]}>
                    <View style={styles.triangle_up}></View>
                    <View style={[styles.modalContentInner, appStyle.flexAliCenter]}>
                        <View style={[styles.modalTip, { marginBottom: pxToDp(40) }]}>
                            <Text style={[styles.modalTipTxt]}>未掌握</Text>
                        </View>
                        <View style={[styles.modalTip, { backgroundColor: "#87EDCB" }]}>
                            <Text style={[styles.modalTipTxt]}>已掌握</Text>
                        </View>
                    </View>
                </View>}
            </View> : null}
            {showModal ? <View style={[styles.modal]}>
                <TouchableWithoutFeedback onPress={() => {
                    setShowModal(false)
                }}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <View style={[styles.knowledgeWrap, appStyle.flexAliCenter]}>
                    <View style={[styles.circle, appStyle.flexCenter]}>
                        <Text style={[{ color: "#22294D", fontSize: pxToDp(56) }, appFont.fontFamily_jcyt_700]}>{knowledge.knowledge_point}</Text>
                    </View>
                    <View style={[appStyle.flexLine]}>
                        <TouchableOpacity style={[styles.btn2, { marginRight: pxToDp(38) }]} onPress={() => {
                            setShowModal(false)
                            NavigationUtil.toWordTreeCharactersDetails({
                                navigation,
                                data: { ...knowledge, wordList, wordListKey },
                            });
                        }}>
                            <View style={[styles.btn2Inner]}>
                                <Image style={[styles.btn2Img]} source={require('../../../../images/chineseWordTree/icon_4.png')}></Image>
                                <Text style={[styles.btn2Txt]}>去学习</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn2]} onPress={() => {
                            expand()
                        }}>
                            <View style={[styles.btn2Inner]}>
                                <Image style={[styles.btn2Img]} source={require('../../../../images/chineseWordTree/icon_5.png')}></Image>
                                <Text style={[styles.btn2Txt]}>拓展</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View> : null}
        </ImageBackground >
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
    btn: {
        width: pxToDp(156),
        height: pxToDp(80),
        borderRadius: pxToDp(100),
        backgroundColor: "#FAFAFA",
        position: "absolute",
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    btnIcon: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginRight: pxToDp(12)
    },
    btnTxt: {
        color: "#FF964A",
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700
    },
    modal: {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    },
    click_region: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(71, 82, 102, 0.5)",
    },
    modalContent: {
        width: pxToDp(480),
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(8),
        backgroundColor: '#DAE2F2',
        position: 'absolute',
        right: pxToDp(230),
        top: Platform.OS === 'android' ? pxToDp(140) : pxToDp(170)
    },
    modalContentInner: {
        flex: 1,
        padding: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40)
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: "transparent",
        borderRightWidth: pxToDp(16),
        borderRightColor: "transparent",
        borderBottomWidth: pxToDp(20),
        borderBottomColor: "#fff",
        position: "absolute",
        top: pxToDp(-18),
        right: pxToDp(40)
    },
    modalLine: {
        width: pxToDp(280),
        height: pxToDp(2),
        backgroundColor: "#D9D9D9",
        borderRadius: pxToDp(50),
        marginTop: Platform.OS === 'android' ? pxToDp(10) : pxToDp(30),
    },
    modalTip: {
        width: pxToDp(270),
        height: pxToDp(60),
        backgroundColor: "#FF9797",
        borderRadius: pxToDp(10),
        ...appStyle.flexCenter
    },
    modalTipTxt: {
        color: "#475266",
        fontSize: pxToDp(28),
        ...appFont.fontFamily_jcyt_700
    },
    knowledgeWrap: {
        position: "absolute",
        bottom: pxToDp(100),
        right: pxToDp(60)
    },
    circle: {
        width: pxToDp(200),
        height: pxToDp(200),
        borderRadius: pxToDp(100),
        borderWidth: pxToDp(4),
        borderColor: '#fff',
        backgroundColor: "#FFB82E",
        marginBottom: pxToDp(44)
    },
    btn2: {
        width: pxToDp(280),
        height: pxToDp(128),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(106)
    },
    btn2Img: {
        width: pxToDp(60),
        height: pxToDp(60),
        marginRight: pxToDp(12)
    },
    btn2Inner: {
        flex: 1,
        borderRadius: pxToDp(106),
        backgroundColor: "#FF964A",
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    btn2Txt: {
        color: "#fff",
        fontSize: pxToDp(40),
        ...appFont.fontFamily_jcyt_700
    },
    pageBtn: {
        width: pxToDp(80),
        height: pxToDp(160)
    }
});
export default WordTreeUnitWord;
