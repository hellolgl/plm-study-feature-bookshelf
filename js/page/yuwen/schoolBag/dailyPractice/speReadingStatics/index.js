import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from 'react-redux';
import CircleStatistcs from '../../../../../component/circleStatistcs'

import Header from "../../../../../component/Header";
import { combineReducers, compose } from "redux";

class SpeReadingStatics extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [
            ],
            lineValue: [

            ],
            type: ' ',
            checkSpeType: '1',
            rate_correct: ' ',
            rate_speed: '',

            typeList: [
                {
                    text: '现代文',
                    value: '现代文'
                },
                {
                    text: '古诗文',
                    value: '古诗文'
                },
                {
                    text: '其他',
                    value: '其他'
                },
            ],
            checkType: '现代文',
            longlist: [],
        };
    }
    componentDidMount() {
        this.getList(this.state.checkType)

    }
    getList(category) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        this.setState({
            checkType: category
        })
        axios.get(`${api.chinesDailySpeReadingStatics}?grade_term=${grade_term}&category=${category}`, { params: {} }).then(
            res => {
                let list = res.data.data.son_category
                let listnow = []
                // if (category === '现代文') {
                //     // 现代文有8个，特殊处理
                //     for (let i in list) {
                //         if (i < 4) {
                //             listnow.push(list[i])
                //         }
                //     }

                // } else {
                // }
                listnow = [...list]

                this.setState({
                    list: listnow,
                    longlist: list,
                    rate_speed: res.data.data.rate_speed,
                    rate_correct: res.data.data.rate_correct
                })
            }
        )
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkType(typeItem) {
        this.getList(typeItem.value)
        // this.getRodarValue(typeItem.value)
        this.setState({
            checkType: typeItem.value
        })
    }

    startDoExercise(item) {
        NavigationUtil.toChineseDailySpeReadingExplain({ ...this.props, data: { ...item } })
    }
    renderFour() {
        let { list } = this.state
        return (
            <ScrollView horizontal={true} style={{ flexDirection: 'row', flex: 1, height: pxToDp(700) }}>
                {
                    list.map((item, index) => {
                        return <View style={[styles.bottomItemWrap, { marginRight: index === list.length - 1 ? 0 : pxToDp(40) }]} key={index}>
                            <View style={styles.bottomItemTop}>
                                <Text style={styles.bottomItemTopLeft}>{item.name}</Text>
                                <TouchableOpacity
                                    onPress={() => this.startDoExercise(item)}
                                >
                                    <Image source={require("../../../../../images/chineseDailyStart.png")}
                                        style={{ width: pxToDp(144), height: pxToDp(48) }} />
                                </TouchableOpacity>

                            </View>
                            <View style={styles.bottomItemCenterWrap}>
                                <CircleStatistcs total={item.total} right={Number(item.rate_correct)} size={170} width={26} totalText={'全部'} />
                                <View style={styles.bottomItemCenterBottom}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.bottomItemCenterBottomTop}>{item.rate_correct}%</Text>
                                        <Text style={styles.bottomItemCenterBottomBottom}>正确率</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.bottomItemCenterBottomTop}>{item.rate_speed ? item.rate_speed : '  '}</Text>
                                        <Text style={styles.bottomItemCenterBottomBottom}>答题速率</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', marginBottom: pxToDp(8) }}>
                                    <View style={styles.bottomItemBottomLeft}>
                                        <Image source={require("../../../../../images/chineseStrong.png")}
                                            style={[size_tool(48), styles.bottomItemBottomImg]} />
                                        <Text style={styles.bottomItemBottomTextLeft}>强势</Text>
                                    </View>
                                    <Text style={styles.bottomItemBottomTextRight}>{item.msg_strong}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={styles.bottomItemBottomLeft}>
                                        <Image source={require("../../../../../images/chineseWeak.png")}
                                            style={[size_tool(48), styles.bottomItemBottomImg]} />
                                        <Text style={styles.bottomItemBottomTextLeft}>弱势</Text>
                                    </View>
                                    <Text style={styles.bottomItemBottomTextRight}>{item.msg_weak}</Text>
                                </View>
                            </View>
                        </View>

                    })
                }
            </ScrollView >
        )
    }
    renderTwo() {
        let { list } = this.state
        return (
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                {
                    list.map((item, index) => {
                        return <View style={[styles.bottomItemWrap, { marginRight: index === list.length - 1 ? 0 : pxToDp(40), width: pxToDp(954) }]} key={index}>
                            <View style={[styles.bottomItemTop, { marginBottom: pxToDp(63) }]}>
                                <Text style={[styles.bottomItemTopLeft, { fontSize: pxToDp(40) }]}>{item.name}</Text>
                                <TouchableOpacity
                                    onPress={() => this.startDoExercise(item)}
                                >
                                    {/* <Text style={[styles.bottomItemTopRight, { fontSize: pxToDp(32) }]}>开始提升</Text> chineseDailyStart*/}
                                    <Image source={require("../../../../../images/chineseDailyStart.png")}
                                        style={{ width: pxToDp(144), height: pxToDp(48) }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>

                                <View style={[styles.bottomItemCenterWrap, { width: pxToDp(360), marginRight: pxToDp(40) }]}>
                                    <CircleStatistcs total={item.total} right={Number(item.rate_correct)} size={300} width={40} totalText={'全部'} />
                                    <View style={styles.bottomItemCenterBottom}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={[styles.bottomItemCenterBottomTop, { fontSize: pxToDp(36) }]}>{item.rate_correct}%</Text>
                                            <Text style={[styles.bottomItemCenterBottomBottom, { fontSize: pxToDp(28) }]}>正确率</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={[styles.bottomItemCenterBottomTop, { fontSize: pxToDp(36) }]}>{item.rate_speed ? item.rate_speed : '  '}</Text>
                                            <Text style={[styles.bottomItemCenterBottomBottom, { fontSize: pxToDp(28) }]}>答题速率</Text>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', marginBottom: pxToDp(8) }}>
                                        <View style={styles.bottomItemBottomLeft}>
                                            <Image source={require("../../../../../images/chineseStrong.png")}
                                                style={[size_tool(48), styles.bottomItemBottomImg]} />
                                            <Text style={styles.bottomItemBottomTextLeft}>强势</Text>
                                        </View>
                                        <Text style={[styles.bottomItemBottomTextRight, { width: pxToDp(323) }]}>{item.msg_strong}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={styles.bottomItemBottomLeft}>
                                            <Image source={require("../../../../../images/chineseWeak.png")}
                                                style={[size_tool(48), styles.bottomItemBottomImg]} />
                                            <Text style={styles.bottomItemBottomTextLeft}>弱势</Text>
                                        </View>
                                        <Text style={[styles.bottomItemBottomTextRight, { width: pxToDp(323) }]}>{item.msg_weak}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    })
                }
            </View >
        )
    }
    checkSpeReadingType() {
        let { checkSpeType, longlist } = this.state
        if (checkSpeType === '1') {
            let listnow = []
            for (let i in longlist) {
                if (i > 3) {
                    listnow.push(longlist[i])
                }
            }
            this.setState({
                list: listnow,
                checkSpeType: '0'
            })
        } else {
            let listnow = []
            for (let i in longlist) {
                if (i < 4) {
                    listnow.push(longlist[i])
                }
            }
            this.setState({
                list: listnow,
                checkSpeType: '1'
            })
        }
    }
    toDaily() {
        NavigationUtil.toChineseSpeReadingExerciseDaily({
            ...this.props,
            data: {
                updata: () => {
                    this.getList(this.state.checkType)
                }
            }
        })
    }
    toDailyRecord() {
        NavigationUtil.toChineseReadingExerciseRecord({
            ...this.props,
            data: {
                module: '3',

            }
        })
    }
    render() {
        const { typeList, checkType, rate_correct, rate_speed } = this.state;
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
                <View style={[styles.header,]}>
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[
                            {
                                // position: "absolute",
                                // top: pxToDp(0),
                                // left: pxToDp(0),
                                width: pxToDp(128),
                                height: pxToDp(104),
                                borderRadius: pxToDp(32),
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center'
                            },
                        ]}
                    >
                        <Image
                            source={require("../../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        {typeList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={checkType === item.value ? styles.checked : styles.unChecked}
                                    onPress={() => this.checkType(item)}
                                >
                                    <Text style={[checkType === item.value ? styles.checkedText : styles.unCheckedText, appFont.fontFamily_syst]}>{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <View style={{ width: pxToDp(300) }}>
                        {
                            checkType === '现代文'
                                ?
                                <Text style={[styles.headerCheckType, appFont.fontFamily_syst]}>横向滚动查看更多题材</Text>
                                : null
                        }
                    </View>
                </View>
                <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <View style={{ marginBottom: pxToDp(40), flexDirection: 'row' }}>

                        <TouchableOpacity onPress={() => this.toDaily()}>
                            <Image source={require('../../../../../images/chinesePaiSentenceDaily1.png')} style={{ width: pxToDp(456), height: pxToDp(124), marginRight: pxToDp(40) }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.toDailyRecord()}>
                            <Image source={require('../../../../../images/chinesePaiSentenceDaily2.png')} style={{ width: pxToDp(456), height: pxToDp(124), marginRight: pxToDp(40) }} />
                        </TouchableOpacity>
                        <View style={[styles.topItem, { backgroundColor: '#629BFF' }]}>
                            <Text style={{ fontSize: pxToDp(40), color: '#fff', marginLeft: pxToDp(14), opacity: 0.49 }}>成功率</Text>
                            <Text style={[{ fontSize: pxToDp(48), color: "#fff", marginRight: pxToDp(18) }, appFont.fontFamily_syst]}>{rate_correct}%</Text>
                        </View>
                        <View style={[styles.topItem, { backgroundColor: '#FFA262', marginRight: 0 }]}>
                            <Text style={{ fontSize: pxToDp(40), color: '#fff', opacity: 0.49 }}>平均答题速率</Text>
                            <Text style={[{ fontSize: pxToDp(44), color: "#fff", width: pxToDp(100), marginRight: pxToDp(18) }, appFont.fontFamily_syst]}>{rate_speed}</Text>
                        </View>
                    </View>
                    <View style={{ width: "100%" }}>
                        <View style={[styles.left]}>
                            {
                                this.state.list.length > 3 ? this.renderFour() : this.renderTwo()
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    header: {
        height: pxToDp(104),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        // position: "relative",
        // justifyContent: 'space-between'
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '100%',
        alignItems: 'flex-end'
    },
    headerCheckType: {
        // width: pxToDp(163),
        height: pxToDp(52),
        color: "#AAAAAA",
        // backgroundColor: "#0179FF",
        textAlign: 'center',
        lineHeight: pxToDp(52),
        // borderRadius: pxToDp(32),
        fontSize: pxToDp(28)
    },
    checked: {
        // padding: pxToDp(48),
        backgroundColor: ' rgba(1, 121, 255, 0.2)',
        borderRadius: pxToDp(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pxToDp(40),
        height: pxToDp(104),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
    },
    unChecked: {
        // padding: pxToDp(48),
        backgroundColor: '#fff',
        borderRadius: pxToDp(32),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pxToDp(40),
        height: pxToDp(104),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
    },
    checkedText: {
        color: '#0179FF',
        fontSize: pxToDp(28),
    },
    unCheckedText: {
        color: '#AAAAAA',
        fontSize: pxToDp(28),
    },
    left: {
        width: '100%',
        height: pxToDp(590),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40),
    },

    topItem: {
        width: pxToDp(456),
        height: pxToDp(124),
        marginRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pxToDp(32)
    },
    bottomItemWrap: {
        width: pxToDp(456),
        height: pxToDp(692),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        padding: pxToDp(32)
    },
    bottomItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: pxToDp(36)
    },
    bottomItemTopLeft: {
        fontSize: pxToDp(32),
        color: "#333333",
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(46) })
    },
    bottomItemTopRight: {
        fontSize: pxToDp(24),
        color: '#0179FF'
    },
    bottomItemCenterWrap: {
        alignItems: 'center',
        marginBottom: pxToDp(40)
    },
    bottomItemCenterBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: pxToDp(50),
        paddingRight: pxToDp(40),
        paddingTop: pxToDp(40),
    },
    bottomItemCenterBottomTop: {
        fontSize: pxToDp(32),
        color: "#77D102",
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin()
    },
    bottomItemCenterBottomBottom: {
        fontSize: pxToDp(26),
        color: '#AAAAAA',
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin()
    },
    bottomItemBottomLeft: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: pxToDp(8)
    },
    bottomItemBottomImg: {
        zIndex: 99,
        marginRight: pxToDp(12),
        marginRight: pxToDp(8)
    },
    bottomItemBottomTextLeft: {
        fontSize: pxToDp(24),
        color: "#333333",
        ...appFont.fontFamily_syst
    },
    bottomItemBottomTextRight: {
        fontSize: pxToDp(24),
        color: '#0179FF',
        width: pxToDp(276),
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin()
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"])

    }
}

const mapDispathToProps = (dispatch) => {
    return {

    }
}


export default connect(mapStateToProps, mapDispathToProps)(SpeReadingStatics)
