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
import { appStyle, appFont } from "../../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../util/tools";
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import NavigationUtil from "../../../../navigator/NavigationUtil";
import OtherUserInfo from "../../../../component/otherUserinfo";
import { connect } from 'react-redux';
import CircleStatistcs from '../../../../component/circleStatistcs'
import MyRadarChart from '../../../../component/myRadarChart'
import { Toast } from "antd-mobile-rn";

class ChineseStatisticsHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unitList: [],
            list: [
                {
                    text: "Listening",
                    value: '0%',
                    bgColor: ["#6384F0", "#8BA0F8"],
                },
                {
                    text: "Speaking",
                    value: '0%',
                    bgColor: ["#FDAE00", "#FAC845"],
                },
                {
                    text: "Reading",
                    value: '0%',
                    bgColor: ["#FA7528", "#FC8A4B"],
                },
                {
                    text: "Writing",
                    value: '0%',
                    bgColor: ["#3AB4FF", "#78D7FE"],
                },
            ],
            typeList: [
                {
                    text: '今日报告',
                    value: '1'
                },
                {
                    text: '本周报告',
                    value: '2'
                },
                {
                    text: '本月报告',
                    value: '3'
                },
                {
                    text: '本学期报告',
                    value: '4'
                },
            ],
            paiList: [
                {
                    name: '识字',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'character'
                },
                {
                    name: '词汇积累',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'word'
                },
                {
                    name: '句型运用',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'sentence'
                },
                {
                    name: '阅读',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'read'
                },
                {
                    name: '口语交际',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'oral'
                },
                {
                    name: '习作',
                    total: 0,
                    rate_correct: 0,
                    r_total: 0,
                    score: 0,
                    rate_speed: '',
                    type: 'writing'
                }
            ],
            checkType: '1',
            rodarName: [],
            rodarvalue: []
        };
    }
    componentDidMount() {
        this.getList(this.state.checkType)
        this.getRodarValue(this.state.checkType)
    }
    getList(type) {
        const { userInfo, textBookCode } = this.props;
        const { checkType } = this.state
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.chineseGetStacisticsHome}/${userInfoJs.id}/${grade_term}/${type}`, { params: {} }).then(
            res => {

                let list = res.data.data

                let listnow = []
                let classList = [...this.state.paiList]
                if (list.length > 0) {
                    listnow = [...list]
                } else {
                    for (let i in classList) {
                        if (classList[i].name) {
                            listnow.push({
                                name: classList[i].name,
                                total: 0,
                                rate_correct: 0,
                                r_total: 0,
                                score: 0,
                                rate_speed: '',
                                type: classList[i].type
                            })
                        }

                    }
                }
                this.setState(() => ({
                    paiList: listnow,
                    // list: classList
                })
                )
            }
        )
    }
    getRodarValue(type) {
        // chineseGetStacisticsRodar
        const { userInfo, textBookCode } = this.props;
        const { checkType } = this.state
        const userInfoJs = userInfo.toJS();
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.chineseGetStacisticsRodar}/${userInfoJs.id}/${grade_term}/${type}`, { params: {} }).then(
            res => {
                let list = res.data.data
                if (list.length > 0) {
                    let listnow = []
                    let namelist = []
                    for (let i = 0; i < list.length; i++) {
                        listnow.push(list[i].rate_correct + '')
                        namelist.push(list[i].name)
                    }

                    this.setState({
                        rodarName: namelist,
                        rodarvalue: listnow
                    })
                }
            }
        )
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkType(typeItem) {
        this.getList(typeItem.value)
        this.getRodarValue(typeItem.value)
        this.setState({
            checkType: typeItem.value
        })
    }

    lookMore(item) {
        console.log('item', item)
        if (item.total === 0) {
            Toast.fail('没有答题，不能查看详情！', 1)
            return
        }
        if (item.type === 'writing') {
            NavigationUtil.toChineseCompositionStaticsHome({ ...this.props, data: { ...item, type: this.state.checkType, exercise_element: item.name, englishType: item.type, } })

        } else {
            NavigationUtil.toChineseStatisticsItem({ ...this.props, data: { ...item, type: this.state.checkType, exercise_element: item.name, englishType: item.type, } })

        }

    }
    render() {
        const { list, typeList, checkType, paiList } = this.state;
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
                <View style={[styles.header, appStyle.flexCenter]}>
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
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[
                            {
                                position: "absolute",
                                top: pxToDp(0),
                                left: pxToDp(0),
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
                            source={require("../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <View style={[appStyle.flexTopLine, { flex: 1, alignItems: 'center' }]}>
                    <View style={[styles.left,]}>
                        <View >
                            <OtherUserInfo avatarSize={164} isRow={true}></OtherUserInfo>

                        </View>
                        <View style={[{ backgroundColor: "#fff", borderRadius: pxToDp(32), height: pxToDp(590) }, appStyle.flexCenter]}>
                            {
                                this.state.rodarvalue.length > 0 ? <MyRadarChart valueList={this.state.rodarvalue} namelist={this.state.rodarName} /> : null
                            }


                        </View>
                    </View>
                    <View style={[styles.right]}>
                        {paiList.map((item, index) => {
                            return (
                                <View key={index} style={{ ...styles.rightItem, marginBottom: index < 2 ? pxToDp(40) : pxToDp(0) }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <Text style={[{ color: '#333333', fontSize: pxToDp(32) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{item.name}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.lookMore(item)}
                                        >
                                            <Text style={[{ fontSize: pxToDp(28), color: '#0179FF', }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>查看详情</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flex: 1, }}>
                                        <View style={{ marginBottom: pxToDp(32), marginTop: pxToDp(32), }}>
                                            <CircleStatistcs
                                                total={item.total}
                                                right={Number(item.rate_correct)}
                                                size={170}
                                                width={26}
                                                totalText={'全部'} />

                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                                            <View style={styles.bottomItem}>
                                                <Text style={styles.bottomItemTop}>{item.score}%</Text>
                                                <Text style={styles.bottomItemBottom}>π学分</Text>
                                            </View>
                                            <View style={styles.bottomItem}>
                                                <Text style={styles.bottomItemTop}>{item.rate_correct + "%"}</Text>
                                                <Text style={styles.bottomItemBottom}>成功率</Text>
                                            </View>
                                            <View style={styles.bottomItem}>
                                                <Text style={styles.bottomItemTop}>{item.rate_speed ? item.rate_speed : '  '}</Text>
                                                <Text style={styles.bottomItemBottom}>答题速率</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
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
        position: "relative",
        justifyContent: 'space-between'
    },
    left: {
        width: pxToDp(572),
        // height: pxToDp(850),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        marginRight: pxToDp(48),
        justifyContent: 'space-between',
        height: pxToDp(850),
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    goDetailsBtn: {
        width: pxToDp(192),
        height: pxToDp(64),
        backgroundColor: "#fff",
        textAlign: "center",
        lineHeight: pxToDp(64),
        borderRadius: pxToDp(32),
        position: "absolute",
        fontSize: pxToDp(32),
        left: pxToDp(28),
        bottom: pxToDp(28),
    },
    rightText: {
        fontSize: pxToDp(38),
        color: '#FFFFFF',
        fontWeight: 'bold',

    },
    rightItem: {
        width: pxToDp(409),
        height: pxToDp(405),
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        borderRadius: pxToDp(32),
        padding: pxToDp(32)
    },
    rightItemOpacity: {
        backgroundColor: '#FFFFFF',
        borderRadius: pxToDp(30),
        width: pxToDp(143),
        alignItems: 'center',
        marginEnd: pxToDp(48)
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
    bottomItem: {
        alignItems: "center"
    },
    bottomItemTop: {
        color: '#77D102',
        fontSize: pxToDp(28),
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin()
        // marginBottom: pxToDp(8)
    },
    bottomItemBottom: {
        color: '#AAAAAA',
        fontSize: pxToDp(28),
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


export default connect(mapStateToProps, mapDispathToProps)(ChineseStatisticsHome)
