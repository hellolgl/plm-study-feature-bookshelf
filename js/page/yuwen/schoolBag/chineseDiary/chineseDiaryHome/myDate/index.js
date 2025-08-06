import React, { PureComponent, Component } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Modal } from "react-native";
import { appStyle } from "../../../../../../theme";
import { size_tool, pxToDp, borderRadius_tool, padding_tool } from "../../../../../../util/tools";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
const titlelist = ['日', '一', '二', '三', '四', '五', '六',]


class MyDate extends Component {
    constructor(props) {
        super(props);
        // console.log(props.userInfo.toJS());
        this.state = {
            year: '',
            month: '',
            week: 0,
            listLenth: 0,
            monthlist: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
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
        const { listLenth, } = this.state;
        let returnobj = []
        for (let i = 1; i <= listLenth; i++) {
            returnobj.push(
                <TouchableOpacity style={[styles.dateItem]} onPress={this.checkDate.bind(this, i)}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#B75416' }]}>{i}</Text>
                </TouchableOpacity>
            )
        }
        return returnobj
    }
    checkDate = (index) => {
        console.log(`选择日期:${this.state.year}-${this.state.month + 1}-${index}`)
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
                    {
                        borderWidth: 1,
                        borderColor: "red",
                        backgroundColor: "yellow",
                    }
                ]}
                source={require('../../../../../../images/chineseHomepage/chineseDateBg.png')}
            >
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, padding_tool(0, 40, 0, 40), { marginBottom: pxToDp(140), width: '100%' }]}>
                    <TouchableOpacity onPress={this.prevMonth} style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                        <Text style={[styles.changeBtn]}>{'<'}</Text>
                        <Text style={[styles.titleTxt]}>上个月</Text>
                    </TouchableOpacity>
                    <TouchableOpacity><Text style={[styles.titleTxt]}>{year}-{monthlist[month]}</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.nextMonth} style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                        <Text style={[styles.titleTxt]}>下个月</Text>
                        <Text style={[styles.changeBtn]}>{'>'}</Text>
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

export default MyDate
