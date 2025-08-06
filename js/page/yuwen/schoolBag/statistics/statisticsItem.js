import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform
} from "react-native";
import { appStyle, appFont } from "../../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../../../util/tools";
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import UserInfo from "../../../../component/userInfo";
import { connect } from 'react-redux';
import CircleStatistcs from '../../../../component/circleStatistcs'
import MyManyBarChart from '../../../../component/myChart/myManyBarChart'
import MyLineChart from '../../../../component/myChart/myLineChart'
import OtherUserInfo from "../../../../component/otherUserinfo";
import Header from "../../../../component/Header";
import { combineReducers, compose } from "redux";

class ChineseStatisticsItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unitList: [],
            list: [
            ],
            paiList: [

            ],
            checkType: '1',
            lineValue: [

            ],
            rightValue: [],
            namelist: [],
            totallist: [],
            type: this.props.navigation.state.params.data.englishType,
            checkSpeType: '1',
            rate_correct: this.props.navigation.state.params.data.rate_correct,
            rate_speed: this.props.navigation.state.params.data.rate_speed,
            linename: [],
            arangelist: [],
            areaType: 'class',
            stage_ranking: 0,
            maxMsg: '',
            minMsg: '',
            isShow: false
        };
    }
    componentDidMount() {
        console.log('参数', this.props.navigation.state.params.data)
        this.getList(this.props.navigation.state.params.data.englishType === 'read' ? '1' : '')
        this.getlineChart('class')
    }
    getList(category) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        this.setState({
            checkSpeType: category
        })
        axios.get(`${api.chineseGetStacisticsItem}/${userInfoJs.id}/${grade_term}/${infoData.type}/${infoData.englishType}?category=${infoData.englishType === 'read' ? category : ''}`, { params: {} }).then(
            res => {
                let list = res.data.data.report
                let listmsg = res.data.data.ability_msg
                // console.log('数据', res.data.data)
                if (this.state.type === 'sentence' || this.state.type === 'read') {
                    this.setState({
                        rate_correct: res.data.data.rate_correct,
                        rate_speed: res.data.data.rate_speed
                    })
                }
                let classList = []
                if (list.length > 0) {
                    let rightlist = []
                    let totallist = []
                    let namelist = ['']
                    let minNum = 100, minName = ''
                    let maxNum = -1, maxName = ''
                    let index = 0
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].total !== 0) {
                            let right = Number((list[i].correct_num / list[i].total).toFixed(3)) * 100
                            if (minNum > right) {
                                minNum = right
                                minName = list[i].name
                            }
                            if (maxNum < right) {
                                maxNum = right
                                maxName = list[i].name
                            }
                            let rightobj = {
                                x: index + 1,
                                y: right
                            }
                            rightlist.push(rightobj)
                            totallist.push({
                                x: index + 1,
                                y: 100
                            })
                            namelist.push(list[i].name)
                            ++index
                        }
                    }
                    let maxMsg = '', minMsg = ''
                    // console.log('最小', maxNum, minNum)
                    for (let i in listmsg) {
                        if (listmsg[i].ability === maxName && maxNum >= 90) {
                            maxMsg = listmsg[i].msg_strong
                        }

                        if (listmsg[i].ability === minName && minNum < 75) {
                            minMsg = listmsg[i].msg_weak
                        }

                    }
                    this.setState({
                        rightValue: rightlist,
                        totallist,
                        namelist,
                        maxMsg,
                        minMsg,
                        isShow: rightlist.length > 0 ? true : false
                    })
                } else {
                    this.setState({
                        rightValue: [],
                        totallist: [],
                        namelist: [],
                        maxMsg: '',
                        minMsg: '',
                        isShow: true
                    })
                }
            }
        )
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }

    getlineChart(type) {
        // 
        const { userInfo, } = this.props;

        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        this.setState({
            areaType: type
        })
        axios.get(`${api.getChineseCompositionPaiStatics}`, {
            params: {
                grade_term,
                category: infoData.englishType,
                exercise_time: infoData.type
            }
        }).then(
            res => {
                console.log('数据', res.data.data)

                let list = res.data.data
                if (list.length > 0) {
                    let lineList = []
                    let arangelist = []
                    let linename = ['']
                    for (let i = 0; i < list.length; i++) {
                        lineList.push({
                            x: i + 1,
                            y: Platform.OS === 'ios' ? list[i].current_score / 100 : list[i].current_score   // π学分
                        })
                        arangelist.push({
                            x: i + 1,
                            y: Platform.OS === 'ios' ? list[i].single_avg_score / 100 : list[i].single_avg_score    // π学分
                        })
                        linename.push(list[i].score_date.slice(5).replaceAll('-', '.'))
                    }

                    this.setState({
                        lineValue: lineList,
                        arangelist,
                        linename,
                        stage_ranking: res.data.data.stage_ranking
                    })
                }

            }
        )
    }
    toSentnce() {
        // 智能句统计页面
        NavigationUtil.toChineseSentenceStatics({ ...this.props, data: this.props.navigation.state.params.data })
    }
    render() {
        const { lineValue } = this.state;
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
                <Header
                    text={this.props.navigation.state.params.data.exercise_element}
                    goBack={() => {
                        this.goBack();
                    }}
                ></Header>
                <View style={{ marginBottom: pxToDp(40), flexDirection: 'row' }}>
                    <View style={styles.topItem}>
                        <Text style={[{ fontSize: Platform.OS === 'android' ? pxToDp(72) : pxToDp(62), color: "#77D102", }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', Platform.OS === 'ios' ? { marginTop: pxToDp(-20) } : null)]}>{this.state.rate_correct}%</Text>
                        <Text style={[{ fontSize: pxToDp(32), color: '#333333' }, appFont.fontFamily_syst]}>成功率</Text>

                        <Text style={[{ fontSize: pxToDp(30), color: '#AAAAAA', width: pxToDp(435) }, appFont.fontFamily_syst]}>{this.props.navigation.state.params.data.exercise_element}习题总的首次成功率</Text>
                    </View>
                    <View style={[styles.topItem, appStyle.flexAliCenter, { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={[{ fontSize: Platform.OS === 'android' ? pxToDp(72) : pxToDp(58), color: "#77D102", }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', Platform.OS === 'ios' ? { marginTop: pxToDp(-20) } : null)]}>{this.state.rate_speed}</Text>
                        <Text style={[{ fontSize: pxToDp(32), color: '#333333' }, appFont.fontFamily_syst]}>平均答题速率</Text>
                        <Text style={[{ fontSize: pxToDp(24), color: '#AAAAAA', width: pxToDp(450), height: pxToDp(120), }, appFont.fontFamily_syst]}>90%及以上答题时间低于建议答题时间为优秀；80%-89%为良好；79%及以下为较慢。</Text>
                    </View>
                </View>
                <View style={{ width: "100%", flex: 1 }}>
                    <View style={[styles.left]}>
                        <View style={styles.bottomWrap}>
                            <View>
                                <Text style={[{ fontSize: pxToDp(32), color: '#333333' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{'学术能力报告'}</Text>
                                <Text>{''}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: pxToDp(40), }}>
                                {
                                    this.state.type === 'read' ? <View style={{ marginRight: pxToDp(50), justifyContent: 'center' }}>
                                        <TouchableOpacity
                                            style={[this.state.checkSpeType === '1' ? styles.bottomItemTextCheckedWrap : styles.bottomItemTextWrap]}
                                            onPress={() => {
                                                this.setState({
                                                    isShow: false
                                                })
                                                this.getList('1')
                                            }}>
                                            <Text style={[this.state.checkSpeType === '1' ? styles.bottomItemTextChecked : styles.bottomItemText]}>同步</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[this.state.checkSpeType === '2' ? styles.bottomItemTextCheckedWrap : styles.bottomItemTextWrap]}
                                            onPress={() => {
                                                this.setState({
                                                    isShow: false
                                                })
                                                this.getList('2')
                                            }}>
                                            <Text
                                                style={[this.state.checkSpeType === '2' ? styles.bottomItemTextChecked : styles.bottomItemText]}
                                            >专项</Text>
                                        </TouchableOpacity>
                                    </View> : null
                                }
                                {
                                    this.state.type === 'sentence' ? <View style={{ marginRight: pxToDp(50), justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({
                                                isShow: false
                                            })
                                            this.getList('1')
                                        }}
                                            style={[styles.bottomItemTextCheckedWrap]}
                                        >
                                            <Text style={[styles.bottomItemTextChecked]}>同步</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            this.toSentnce()
                                        }}
                                            style={[styles.bottomItemTextWrap]}
                                        >
                                            <Text
                                                style={[styles.bottomItemText]}
                                            >智能句</Text>
                                        </TouchableOpacity>
                                    </View> : null
                                }
                                {this.state.isShow ? <MyManyBarChart totallist={this.state.totallist}
                                    rightValue={this.state.rightValue}
                                    namelist={this.state.namelist}
                                /> : null}

                            </View>
                            <View >
                                <View style={{ flexDirection: 'row', marginBottom: pxToDp(24) }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={require("../../../../images/chineseStrong.png")}
                                            style={[size_tool(48), { zIndex: 99, marginRight: pxToDp(12) }]} />
                                        <Text style={styles.bottomTextLeft}>强势</Text>
                                    </View>

                                    <Text
                                        style={styles.bottomTextRight}
                                    >{this.state.maxMsg}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={require("../../../../images/chineseWeak.png")}
                                            style={[size_tool(48), { zIndex: 99, marginRight: pxToDp(12) }]} />
                                        <Text style={styles.bottomTextLeft}>弱势</Text>
                                    </View>

                                    <Text
                                        style={styles.bottomTextRight}
                                    >{this.state.minMsg}</Text>
                                </View>
                            </View>

                        </View>
                        <View
                            style={styles.bottomWrap}>
                            <View>
                                <Text style={[{ fontSize: pxToDp(32), color: '#333333' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{'π分相对排名'}</Text>
                                <Text>{''}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: pxToDp(40), }}>
                                {/* <View style={{ marginRight: pxToDp(50), justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.getlineChart('class')
                                    }}>
                                        <Text style={this.state.areaType === 'class' ? styles.bottomItemTextChecked : styles.bottomItemText}>班级</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.getlineChart('school')
                                    }}>
                                        <Text
                                            style={this.state.areaType === 'school' ? styles.bottomItemTextChecked : styles.bottomItemText}
                                        >学校</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.getlineChart('city')
                                    }}>
                                        <Text
                                            style={this.state.areaType === 'city' ? styles.bottomItemTextChecked : styles.bottomItemText}
                                        >城市</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.getlineChart('all')
                                    }}>
                                        <Text
                                            style={this.state.areaType === 'all' ? styles.bottomItemTextChecked : styles.bottomItemText}
                                        >全部</Text>
                                    </TouchableOpacity>
                                </View> */}
                                <MyLineChart value={lineValue} arangelist={this.state.arangelist} linename={this.state.linename}
                                    height={pxToDp(450)}
                                    width={pxToDp(850)}
                                />

                            </View>

                            <View>
                                <View style={{ flexDirection: 'row', paddingLeft: pxToDp(44), marginBottom: pxToDp(24) }}>
                                    <Text style={styles.bottomTextLeft}>本周成绩</Text>
                                    <Text
                                        style={styles.bottomTextRight}
                                    >{this.state.stage_ranking > 50 ?
                                        `你在本周的'${this.props.navigation.state.params.data.exercise_element}'中超越了${this.state.stage_ranking}%的同学，请继续加油哦！`
                                        : '请继续加油哦!'}</Text>
                                </View>

                            </View>
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
        height: pxToDp(110),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        position: "relative",
        justifyContent: 'space-between'
    },
    left: {
        width: '100%',
        height: '100%',
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40),
    },

    topItem: {
        width: pxToDp(954),
        height: pxToDp(124),
        marginRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pxToDp(32)
    },
    bottomWrap: {
        width: pxToDp(954),
        height: '100%',
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        padding: pxToDp(40),
        marginBottom: pxToDp(40),
        justifyContent: 'space-between'
    },
    bottomItemText: {
        // width: pxToDp(96),
        // height: pxToDp(40),
        color: '#666666',
        fontSize: pxToDp(24),
        lineHeight: pxToDp(36),
        ...appFont.fontFamily_syst
    },
    bottomItemTextWrap: {
        width: pxToDp(96),
        height: pxToDp(40),
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(20),
        textAlign: 'center',
        marginBottom: pxToDp(40),

    },
    bottomItemTextCheckedWrap: {
        width: pxToDp(96),
        height: pxToDp(40),
        backgroundColor: '#0179FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(20),
        textAlign: 'center',
        lineHeight: pxToDp(36),
        marginBottom: pxToDp(40),
    },
    bottomItemTextChecked: {
        // width: pxToDp(96),
        // height: pxToDp(40),
        color: '#fff',
        fontSize: pxToDp(24),
        textAlign: 'center',
        lineHeight: pxToDp(36),
        ...appFont.fontFamily_syst,
    },
    bottomTextLeft: {
        marginRight: pxToDp(24),
        fontSize: pxToDp(24),
        color: '#333333',
        fontWeight: 'bold'
    },
    bottomTextRight: {
        fontSize: pxToDp(28),
        color: '#0179FF',
        width: pxToDp(724),
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


export default connect(mapStateToProps, mapDispathToProps)(ChineseStatisticsItem)
