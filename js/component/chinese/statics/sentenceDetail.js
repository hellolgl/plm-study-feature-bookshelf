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
import { appStyle, appFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool, border_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../util/tools";
import axios from '../../../util/http/axios'
import api from '../../../util/http/api'
import Bar from "../../bar";
import NavigationUtil from "../../../navigator/NavigationUtil";
import UserInfo from "../../userInfo";
import { connect } from 'react-redux';
import MyRadarChart from '../../myRadarChart'
import MyManyBarChart from '../../myChart/myManyBarChart'

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
            // type: this.props.data.englishType,
            checkSpeType: '1',
            rate_correct: 0,
            rate_speed: '',
            linename: [],
            arangelist: [],
            areaType: 'class',
            stage_ranking: 0,
            maxMsg: '',
            minMsg: '',
            isShow: false,
            visible: false,
            detailVisible: false,
            detailList: [],
            detail: {},
            strong: '',
            weak: '',
            rodarvalue: [],
            rodarName: [],
            checkedname: '',
            chartNamelist: []
        };
    }
    componentDidMount() {
        this.getList(this.state.namelist[0])
        // this.getlineChart('class')
    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state }
        let data = props.data
        if (JSON.stringify(data.namelist) !== JSON.stringify(tempState.namelist)
        ) {
            tempState.namelist = data.namelist
            tempState.checkedname = data.namelist[0]
        }

        return tempState
    }
    componentDidUpdate(prevProps, prevState) {

        if (JSON.stringify(prevState.namelist) !== JSON.stringify(this.state.namelist)) {
            this.getList(prevState.namelist[0])

        }
    }
    getList(inspect_name) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        this.setState({
            isShow: false
        })
        axios.get(`${api.getChineseSentenceAllStatics}`, { params: { grade_term, exercise_time: infoData.type, inspect: inspect_name } }).then(

            res => {
                if (res && res.data.err_code === 0) {
                    let list = [], name = ['']
                    res.data.data?.tag1_data.forEach((item, index) => {
                        list.push({
                            x: index + 1,
                            y: item.right_rate
                        })
                        name.push(item.name)
                    });
                    console.log('智能句详情', list, name)

                    this.setState({
                        list,
                        checkedname: inspect_name,
                        chartNamelist: name,
                        isShow: true,
                        rate_correct: res.data.data.right_rate,
                        rate_speed: res.data.data.rate_speed,
                        // strong: res.data.data.ability_msg.msg_strong,
                        // weak: res.data.data.ability_msg.msg_weak,
                    })
                }

            }
        )
    }

    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkname = (name) => {
        this.getList(name)
        this.setState({
            checkedname: name
        })
    }


    render() {
        const { namelist, checkedname, list, chartNamelist, isShow, rate_correct, rate_speed } = this.state;
        return (
            <View style={[padding_tool(40), { flex: 1, paddingTop: pxToDp(80) }]}>
                <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, { width: "100%", marginBottom: pxToDp(40), height: pxToDp(80) }]}>
                    <ScrollView horizontal={true}>
                        {
                            namelist.map((item, index) => {
                                return item ? <TouchableOpacity
                                    onPress={this.checkname.bind(this, item)}
                                    key={index}
                                    style={[{ backgroundColor: checkedname === item ? '#4C4C59' : '#fff', marginRight: pxToDp(20) }, appStyle.flexCenter, size_tool(186, 80), borderRadius_tool(40)]} >
                                    <Text style={[{ fontSize: pxToDp(28), color: checkedname === item ? '#fff' : '#4C4C59' }, appFont.fontFamily_syst]}>{item}</Text>
                                </TouchableOpacity> : null
                            })
                        }
                    </ScrollView>


                </View>
                <View style={[appStyle.flexJusBetween, { height: pxToDp(512), borderWidth: pxToDp(4), borderColor: '#E9E9F2', borderRadius: pxToDp(40), padding: pxToDp(40) }]}>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                        <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }]}>{checkedname}正确率:</Text>
                        <View style={[appStyle.flexTopLine, appStyle.flexCenter, { borderWidth: pxToDp(4), borderColor: '#E9E9F2', borderRadius: pxToDp(30) }, size_tool(466, 60)]}>
                            <Text style={[{ fontSize: pxToDp(24), color: '#9595A6', marginRight: pxToDp(20) }]}>正确率</Text>
                            <Text style={[{ fontSize: pxToDp(28), color: '#00CC88', marginRight: pxToDp(40) }]}>{rate_correct}%</Text>
                            <Text style={[{ fontSize: pxToDp(24), color: '#9595A6', marginRight: pxToDp(20) }]}>答题速率</Text>
                            <Text style={[{ fontSize: pxToDp(28), color: '#00CC88', }]}>{rate_speed}</Text>

                        </View>
                    </View>
                    <View style={[{ flex: 1 }]}>
                        {isShow ? <MyManyBarChart totallist={[]}
                            rightValue={list}
                            namelist={chartNamelist}
                            enabledLegend={true}
                            height={pxToDp(360)}
                            width={pxToDp(1400)}
                            rightColor={'#7076FF'}
                        /> : null}
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        height: pxToDp(110),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        position: "relative",
        justifyContent: 'space-between'
    },

    titlebtn: {
        backgroundColor: '#0179FF',
        marginRight: pxToDp(24)
    },
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
