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
import { size_tool, pxToDp, padding_tool, border_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../../util/tools";
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import UserInfo from "../../../../component/userInfo";
import { connect } from 'react-redux';
import MyRadarChart from '../../../../component/myRadarChart'

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
            // type: this.props.navigation.state.params.data.englishType,
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
            namelist: this.props.navigation.state.params.data.namelist,
            checkedname: this.props.navigation.state.params.data.namelist[0]
        };
    }
    componentDidMount() {
        this.getList(this.state.namelist[0])
        // this.getlineChart('class')
    }
    getList(inspect_name) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        // let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam

        console.log("参数", infoData)
        axios.get(`${api.getChineseCompositionAllStatics}`, { params: { grade_code: userInfoJs.checkGrade, inspect_name, exercise_time: infoData.type } }).then(
            res => {
                if (res && res.data.err_code === 0) {
                    console.log('数据', res.data)
                    let list = []
                    res.data.data?.tag_data.forEach(item => {
                        list.push(this.changeNumberlist(item))
                    });
                    this.setState({
                        list
                        // rate_correct: res.data.data.data.right_rate,
                        // rate_speed: res.data.data.data.rate_speed,
                        // strong: res.data.data.ability_msg.msg_strong,
                        // weak: res.data.data.ability_msg.msg_weak,
                    })
                }

            }
        )
    }
    changeNumberlist = (data) => {
        let itemnow = { ...data }
        let rname = [], rvalue = []
        data.data.forEach((item) => {
            rname.push(item.name)
            rvalue.push(item.right_rate + '')
        })
        console.log('雷达图', rname, rvalue)
        return {
            ...itemnow,
            rname,
            rvalue
        }
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
        const { namelist, checkedname, list } = this.state;
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1 }]}>
                {/* <Header
                    text={this.props.navigation.state.params.data.exercise_element}
                    goBack={() => {
                        this.goBack();
                    }}
                ></Header> */}
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, { marginBottom: pxToDp(40) }]}>
                    <TouchableOpacity onPress={this.goBack.bind(this)}>
                        <Image
                            source={require('../../../../images/chineseHomepage/sentenceStaticsGoback.png')}
                            style={[size_tool(80)]}
                        />
                    </TouchableOpacity>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusCenter, padding_tool(0, 60, 0, 60),]}>
                        {/* <ScrollView horizontal={true} style={[appStyle.flexTopLine, { maxWidth: pxToDp(1000) }]}> */}
                        <View style={[appStyle.flexTopLine, appStyle.flexCenter,]}>
                            {
                                namelist.map((item, index) => {
                                    return <TouchableOpacity
                                        onPress={this.checkname.bind(this, item)}
                                        key={index}
                                        style={[{ backgroundColor: checkedname === item ? 'rgba(1, 121, 255, 0.2)' : '#fff', marginRight: pxToDp(20) }, appStyle.flexCenter, size_tool(186, 80), borderRadius_tool(16)]} >
                                        <Text style={[{ fontSize: pxToDp(28), color: checkedname === item ? '#0179FF' : '#AAAAAA' }, appFont.fontFamily_syst]}>{item}</Text>
                                    </TouchableOpacity>
                                })
                            }

                        </View>
                        {/* </ScrollView> */}
                    </View>
                    <Text style={[size_tool(80)]}></Text>
                </View>

                <View style={[appStyle.flexJusCenter, { flex: 1, }]}>
                    <View style={[{ height: pxToDp(882) }]}>
                        <ScrollView horizontal={true} >
                            {
                                list.map((item, index) => {
                                    return <View style={[size_tool(732, 882), { backgroundColor: '#fff', borderRadius: pxToDp(38), position: 'relative', padding: pxToDp(32), marginRight: pxToDp(40) }]} key={index}>
                                        <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { marginBottom: pxToDp(24) }]}>
                                            <Text style={[{ fontSize: pxToDp(34), color: '#333333', fontWeight: 'bold', paddingLeft: pxToDp(40) }]}>{item.name}</Text>
                                            <Text style={[{ fontSize: pxToDp(32), color: '#0076FF', paddingRight: pxToDp(40) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>正确率：{item.right_rate}%</Text>
                                        </View>
                                        <View style={[size_tool(668, 722), appStyle.flexCenter, { backgroundColor: '#EEF6FF', borderRadius: pxToDp(24) }]}>

                                            {
                                                true ? <MyRadarChart valueList={item.rvalue} namelist={item.rname} /> : null
                                            }
                                        </View>

                                    </View>
                                })
                            }

                        </ScrollView>
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
