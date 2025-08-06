import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import * as actionCreators from "../../../../../action/userInfo/index";
// import MyDate from './myDate'
import { Toast, Modal } from "antd-mobile-rn";


class MyDate extends PureComponent {
    constructor(props) {
        super(props);
        // console.log(props.userInfo.toJS());
        this.state = {
            year: '',
            month: '',
            week: 0,
            listLenth: 0,
            monthlist: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

        };
        this.date = new Date()
    }
    componentDidMount() {
        this.getdate()
    }
    prevMonth = () => {
        this.date.setMonth(this.date.getMonth() - 1);
        this.getdate();
    }
    nextMonth = () => {
        this.date.setMonth(this.date.getMonth() + 1);
        this.getdate();
    }
    getdate = () => {
        let nowYear = this.date.getFullYear();
        let nowMonth = this.date.getMonth();
        let nowDate = this.date.getDate();

        //1.设置年份 & 月份
        // document.getElementById('nian').innerHTML = nowYear;
        let arr = [];
        // document.getElementById('yue').innerHTML = arr[nowMonth];


        //该年月的第一天周几(从0开始)   
        let zhou = new Date(nowYear, nowMonth, 1).getDay();

        //获取该月共有几天    （通过这种方式可以得到每个月份的天数，也不用区分闰年了，很方便）
        let totalDay = new Date(nowYear, nowMonth + 1, 0).getDate();


        let html = '';
        //在当月第一天的前面添加空白<li>
        //注意周次一致性: zhou的日期格式(0-6); html页面格式(日-六)

        //设置的 年月日
        let settingTime = new Date(nowYear, nowMonth, nowDate).toLocaleDateString();
        //现在的 年月日
        let realTime = new Date().toLocaleDateString();
        //现在的 日
        let realDate = new Date().getDate();
        // document.getElementById('date').innerHTML = html;  //2.将<li>日历数据插入到<ul>中
        console.log("month", nowMonth, totalDay)

        this.setState({
            year: nowYear,
            month: nowMonth,
            week: zhou,
            listLenth: totalDay,
        })
    }
    renderBlock = () => {
        const { week, } = this.state;
        let returnobj = []
        for (let i = 0; i < week; i++) {
            returnobj.push(
                <TouchableOpacity style={[styles.dateItem]}>
                    <Text style={[]}></Text>
                </TouchableOpacity>
            )
        }
        return returnobj
    }
    renderDay = () => {
        const { listLenth, year, month } = this.state;
        let returnobj = []
        const { today } = this.props
        let flag = false
        if (today.year === year + '' && today.month === month + 1 + '') {
            flag = true
        }
        for (let i = 1; i <= listLenth; i++) {
            returnobj.push(
                <TouchableOpacity style={[styles.dateItem]} onPress={this.checkDate.bind(this, i)}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#B75416' }]}>
                        {flag && i + '' === today.day ? '今天' : i}
                    </Text>
                </TouchableOpacity>
            )
        }
        return returnobj
    }
    checkDate = (index) => {
        this.props.changeDate(this.state.year, this.state.month + 1, index)
    }
    render() {
        const { year, month, week, monthlist } = this.state;
        return (

            <ImageBackground
                style={[
                    size_tool(612, 965),
                    appStyle.flexAliCenter,
                    {
                        paddingTop: pxToDp(220),
                        // zIndex: 999
                    },
                ]}
                source={require('../../../../../images/chineseHomepage/chineseDateBg.png')}
            >
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, padding_tool(0, 40, 0, 40), { marginBottom: pxToDp(140), width: '100%' }]}>
                    <TouchableOpacity onPress={this.prevMonth} style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                        <Text style={[styles.changeBtn, { marginRight: pxToDp(8) }]}>{'<'}</Text>
                        <Text style={[styles.titleTxt]}>上个月</Text>
                    </TouchableOpacity>
                    <TouchableOpacity><Text style={[styles.titleTxt]}>{year}年-{monthlist[month]}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.nextMonth} style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                        <Text style={[styles.titleTxt]}>下个月</Text>
                        <Text style={[styles.changeBtn, { marginLeft: pxToDp(8) }]}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[{ width: pxToDp(536), }]}>
                    {/* <View style={[appStyle.flexTopLine,]}>
                        {
                            titlelist.map((item, index) => {
                                return <View style={[styles.dateItem]} key={index}>
                                    <Text>{item}</Text>
                                </View>
                            })
                        }

                    </View> */}
                    <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                        {
                            this.renderBlock()
                        }
                        {
                            this.renderDay()
                        }
                    </View>
                </View>

            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    dateItem: {
        width: pxToDp(76),
        height: pxToDp(91),
        // backgroundColor: 'red',
        // marginRight: pxToDp(20),
        // marginBottom: pxToDp(20),
        alignItems: 'center',
        justifyContent: 'center'
    },
    changeBtn: {
        width: pxToDp(34),
        height: pxToDp(34),
        borderRadius: pxToDp(17),
        backgroundColor: '#fff',
        fontSize: pxToDp(32),
        color: '#B75416',
        textAlign: 'center',
        lineHeight: pxToDp(38),
        // fontFamily: 'Muyao-Softbrush-2',
        fontFamily: 'webfont',

    },
    titleTxt: {
        fontSize: pxToDp(26),
        color: '#fff'
    }
});

const weeklist = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// import Svg,{ ForeignObject } from 'react-native-svg';
class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            day: '',
            week: '',
            visible: false,
            list: [],
            medal: '',
            current_time: '',
            total_days: 0,
            today: {},
            score: 0,
            ranking: 0
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    componentDidMount() {
        this.getTime()

    }
    getlist(date) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.current_time = date
        // data.current_time = '2022-5-27'

        // data.subject = "01";
        // data.c_id = this.props.navigation.state.params.data.c_id
        // data.page = page
        axios.get(api.getChineseDiaryHomelist, { params: data }).then((res) => {
            console.log("id", res.data.data)
            let listnow = res.data.data.foot_data;
            this.setState({
                list: listnow,
                medal: res.data.data.medal,
                current_time: date,
                total_days: res.data.data.total_days,
                score: res.data.data.score,
                ranking: res.data.data.ranking
            })

        });
    }
    goMyCreater = () => {
        NavigationUtil.toChineseDiaryCompositionType(this.props)

    }
    getTime = () => {
        let date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        var day = date.getDate().toString();
        var week = date.getDay();
        this.getlist(year + '-' + month + '-' + day)
        this.setState({
            day: year + "年" + month + "月" + day + "日",
            week: weeklist[week],
            today: {
                year,
                month,
                day
            }
        })

    };
    toMyarticle = () => {
        NavigationUtil.toChineseUploadArticle(this.props)

    }
    changeDate = (year, month, day) => {
        this.getlist(year + '-' + month + '-' + day)
        let week = new Date(year, month - 1, day).getDay()
        console.log("星期几", week)
        this.setState({
            day: year + "年" + month + "月" + day + "日",
            week: weeklist[week],
            visible: false
        })
    }
    toLookList = (item) => {
        NavigationUtil.toChineseDiaryAllExerciseRecord({
            ...this.props,
            data: {
                ...item,
                current_time: this.state.current_time
            }
        })
    }
    render() {
        const { day, week, list, medal, total_days, today, score, ranking } = this.state;
        return (
            <ImageBackground
                style={homestyles.wrap}
                source={require('../../../../../images/chineseHomepage/flowBigBg.png')}
            >
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, padding_tool(0, 64, 0, 64), { width: '100%', marginBottom: pxToDp(24) }]}>
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require('../../../../../images/chineseHomepage/wrongTypeGoback.png')}
                            style={[size_tool(80)]}
                        />
                    </TouchableOpacity>
                    <ImageBackground
                        source={require('../../../../../images/chineseHomepage/wrongTypeHeader.png')}
                        style={[size_tool(500, 141), appStyle.flexCenter]}
                    >
                        <Text style={[{ fontSize: pxToDp(36), color: '#fff', paddingTop: pxToDp(20) }, appFont.fontFamily_syst]}>学习日记</Text>
                    </ImageBackground>
                    <Text style={[size_tool(80)]}></Text>
                </View>
                <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                    <ImageBackground
                        source={require('../../../../../images/chineseHomepage/chineseDiaryBigbg.png')}
                        style={[size_tool(1880, 865), appStyle.flexTopLine, padding_tool(40, 80, 40, 80)]}
                    >
                        <View style={[{ marginRight: pxToDp(40) }]}>
                            <Image
                                source={require('../../../../../images/chineseHomepage/chineseDiaryFalseAiStudy.png')}
                                style={[size_tool(820, 484), { marginBottom: pxToDp(26) }]}
                            />
                            <View style={[size_tool(820, 230), { backgroundColor: '#FFFAED', borderRadius: pxToDp(16), position: 'relative' }, appStyle.flexTopLine, appStyle.flexCenter]}>
                                <TouchableOpacity onPress={this.goMyCreater}>
                                    <Image
                                        source={require('../../../../../images/chineseHomepage/chineseDiaryToMyMindmap.png')}
                                        style={[size_tool(350, 150), { marginRight: pxToDp(40) }]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.toMyarticle}>
                                    <Image
                                        source={require('../../../../../images/chineseHomepage/chineseDiaryToUploadMyArticle.png')}
                                        style={[size_tool(350, 150),]}
                                    />
                                </TouchableOpacity>
                                <Image source={require('../../../../../images/chineseHomepage/chineseDiaryToUploadMyArticleTitle.png')}
                                    style={[size_tool(260, 71), { position: 'absolute', top: 0 }]} />
                            </View>
                        </View>

                        <View style={[padding_tool(24), size_tool(860, 730), borderRadius_tool(16), { backgroundColor: '#FFFAED' }]}>
                            <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, appStyle.flexJusBetween, { width: '100%' }]}>
                                <ImageBackground
                                    source={require('../../../../../images/chineseHomepage/chineseDiaryMoreStudent.png')}
                                    style={[size_tool(234, 266), appStyle.flexCenter]}>
                                    <View style={[size_tool(200, 100), appStyle.flexCenter, { marginBottom: pxToDp(24), paddingRight: pxToDp(20) }]}>
                                        <Text style={[{ fontSize: pxToDp(40), color: '#B75416' }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', -30)]} >{score}</Text>
                                        <Text style={[{ fontSize: pxToDp(24), color: '#92ACC4', fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2', }]} >我的π分</Text>
                                    </View>
                                    <View style={[size_tool(200, 100), padding_tool(10), {}]}>
                                        <Text style={[{ fontSize: pxToDp(24), color: '#92ACC4', fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2', }]} >超越了</Text>
                                        <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                            <Text style={[{ fontSize: ranking === 100 ? pxToDp(32) : pxToDp(40), color: '#B75416', marginRight: pxToDp(8) }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', -30)]} >{ranking}%</Text>
                                            <Text style={[{ fontSize: pxToDp(24), color: '#92ACC4', fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2', }]} >的小朋友</Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                                <ImageBackground
                                    source={require('../../../../../images/chineseHomepage/chineseDiaryTodayGold.png')}
                                    style={[size_tool(220, 272), appStyle.flexCenter, { paddingTop: pxToDp(30) }]}>
                                    {/* bronze 铜， silver银， gold金 */}
                                    {medal === 'gold' ? <Image source={require('../../../../../images/EN_Sentences/gold_icon.png')} style={[size_tool(120)]} /> : null}
                                    {medal === 'silver' ? <Image source={require('../../../../../images/EN_Sentences/silver_icon.png')} style={[size_tool(120)]} /> : null}
                                    {medal === 'bronze' ? <Image source={require('../../../../../images/EN_Sentences/copper_icon.png')} style={[size_tool(120)]} /> : null}

                                    {medal === 'gold' ? <Text style={[{ fontSize: pxToDp(32), color: '#FAC104' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>金牌</Text> : null}
                                    {medal === 'silver' ? <Text style={[{ fontSize: pxToDp(32), color: '#A1A4F6' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>银牌</Text> : null}
                                    {medal === 'bronze' ? <Text style={[{ fontSize: pxToDp(32), color: '#D77F64' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>铜牌</Text> : null}


                                </ImageBackground>
                                <View style={[size_tool(312, 266), borderRadius_tool(12),
                                padding_tool(30, 0, 40, 0),
                                appStyle.flexAliCenter, appStyle.flexJusBetween, { backgroundColor: '#FDE7BE' }]}>
                                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                                        <TouchableOpacity onPress={() => this.setState({ visible: true })}>
                                            <Image
                                                source={require('../../../../../images/chineseHomepage/chineseDiaryCheckDay.png')}
                                                style={[size_tool(64)]} />
                                        </TouchableOpacity>
                                        <Text style={[{ fontSize: pxToDp(28), color: '#B75416' }, appFont.fontFamily_syst]}>坚持学习{total_days}天</Text>
                                    </View>
                                    <Text style={[{ fontSize: pxToDp(32), color: '#B75416', fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2', }]}>{day}</Text>
                                    <Text style={[{ fontSize: pxToDp(40), color: '#B75416', fontFamily: Platform.OS === 'ios' ? 'YouSheBiaoTiHei' : 'YouSheBiaoTiHei-2', }]}>{week}</Text>
                                </View>
                            </View>
                            <View style={[{ height: pxToDp(450), paddingTop: pxToDp(28) }]}>
                                <ScrollView>
                                    {
                                        list.map((item, index) => {
                                            return <View
                                                key={index}
                                                style={[size_tool(812, 80),
                                                appStyle.flexTopLine,
                                                appStyle.flexJusBetween,
                                                appStyle.flexAliCenter,
                                                padding_tool(0, 24, 0, 24),
                                                { backgroundColor: '#FDE7BE', borderRadius: pxToDp(12), marginBottom: pxToDp(23) }]}>
                                                <Text style={[homestyles.itemTxt]}>{item.name}</Text>
                                                <Text style={[homestyles.itemTxt, { width: pxToDp(180) }]}>已答题：{item.total}</Text>
                                                <Text style={[homestyles.itemTxt, { width: pxToDp(250) }]}>正确率：{Number(item.right_rate).toFixed(2)}%</Text>
                                                <TouchableOpacity
                                                    onPress={this.toLookList.bind(this, item)}
                                                    style={[appStyle.flexTopLine, appStyle.flexCenter, size_tool(160, 56), { backgroundColor: '#FEFEFE', borderRadius: pxToDp(8) }]}>
                                                    <Text style={[{ fontSize: pxToDp(24), color: '#B75416', marginRight: pxToDp(8) }, appFont.fontFamily_syst]}>答题记录</Text>
                                                    <Text style={[{ fontSize: pxToDp(32), color: '#B75416' }, appFont.fontFamily_syst]}>{'>'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <Modal
                    animationType="fade"
                    transparent
                    // onClose={() => this.setState({ visible: false })}
                    // closable
                    maskClosable={false}
                    visible={this.state.visible}
                    footer={null}
                    style={{ width: pxToDp(700), backgroundColor: 'rgbs(0,0,0,0)' }}
                >
                    <MyDate changeDate={this.changeDate} today={today} />
                </Modal>
            </ImageBackground>
        );
    }
}

const homestyles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center'
    },
    itemTxt: {
        fontSize: pxToDp(28),
        width: pxToDp(120),
        color: '#B75416',
        ...appFont.fontFamily_syst
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
