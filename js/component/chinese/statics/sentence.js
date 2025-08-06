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
import { appStyle, appFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin, borderRadius_tool } from "../../../util/tools";
import axios from '../../../util/http/axios'
import api from '../../../util/http/api'
import Bar from "../../bar";
import NavigationUtil from "../../../navigator/NavigationUtil";
import UserInfo from "../../userInfo";
import { connect } from 'react-redux';
import CircleStatistcs from '../../circleStatistcs'
import MyManyBarChart from '../../myChart/myManyBarChart'
import MyLineChart from '../../myChart/myLineChart'
import SentenceDetail from './sentenceDetail'
import { Modal } from "antd-mobile-rn";


class ChineseStatisticsItem extends PureComponent {
    constructor(props) {
        super(props);
        console.log('propsnow', props)
        this.state = {
            unitList: [],
            list: [
            ],
            paiList: [

            ],
            // type: '1',
            lineValue: [],
            rightValue: [],
            namelist: [],
            totallist: [],
            englishType: this.props.data.englishType,
            checkSpeType: '1',
            rate_correct: this.props.data.rate_correct,
            rate_speed: this.props.data.rate_speed,
            linename: [],
            arangelist: [],
            areaType: 'class',
            stage_ranking: 0,
            maxMsg: '',
            minMsg: '',
            isShow: false,
            name: this.props.data.name,
            type: this.props.data.type,
            rodarvalue: [

            ],
            rodarname: [

            ],
            visible: false
        };
    }
    componentDidMount() {
        console.log('参数', this.props.data)
        this.getlineChart('class')
        this.getList()

    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state }
        let data = props.data
        if (tempState.name !== data.name || tempState.type !== data.type || tempState.checkSpeType !== data.category) {
            tempState.name = data.name
            tempState.type = data.type
            tempState.rate_correct = data.rate_correct
            tempState.rate_speed = data.rate_speed
            tempState.englishType = data.englishType
            tempState.isShow = false
            tempState.checkSpeType = data.category
        }

        return tempState
    }
    componentDidUpdate(prevProps, prevState) {

        if (prevState.name !== this.state.name || prevState.type !== this.state.type || prevState.checkSpeType !== this.state.checkSpeType) {
            this.getlineChart('class')
            this.getList()
        }
    }
    // getData = async () => {
    //     await this.getlineChart('class')
    //     await this.getList(prevState.englishType === 'read' ? '1' : '')
    //     this.setState({
    //         isShow: true
    //     })
    // }


    getList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')
        let infoData = this.props.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.getChineseSentenceAllStatics}`, { params: { grade_term, exercise_time: infoData.type } }).then(

            // axios.get(`${api.getChineseCompositionAllStatics}`, { params: { grade_code: userInfoJs.checkGrade, exercise_time: infoData.type } }).then(
            res => {
                if (res && res.data.err_code === 0) {
                    // console.log("智能句参数", rname, rvalue)
                    let barlist = res.data.data.data?.data
                    let rightlist = []
                    let totallist = []
                    let namelist = ['']
                    let allnamelist = []
                    barlist?.forEach((item, index) => {
                        let rightobj = {
                            x: index + 1,
                            y: item.right_rate
                        }
                        rightlist.push(rightobj)
                        totallist.push({
                            x: index + 1,
                            y: 100
                        })
                        namelist.push(item.name + '')
                        allnamelist.push(item.name + '')
                    })
                    this.setState({
                        rightValue: rightlist,

                        totallist,
                        namelist,
                        isShow: true,
                        maxMsg: res.data.data.ability_msg.msg_strong,
                        minMsg: res.data.data.ability_msg.msg_weak,
                        allnamelist
                    })
                }

            }
        )
    }

    getlineChart(type) {
        // 
        const { userInfo, } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')
        let infoData = this.props.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        this.setState({
            areaType: type
        })
        axios.get(`${api.getChineseCompositionPaiStatics}`, {
            params: {
                grade_code: userInfoJs.checkGrade,
                exercise_time: infoData.type,
                category: 'composition'
            }
        }).then(
            res => {
                console.log('派分', res.data.data.data)

                let list = res.data.data.data
                if (list?.length > 0) {
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
                        stage_ranking: res.data.data.transcend_position,
                    })
                }

            }
        )
    }

    render() {
        const { lineValue, arangelist, linename, rodarvalue, allnamelist } = this.state;
        // rate_correct 成功率  rate_speed  答题速度
        return (
            <View style={[padding_tool(0), { flex: 1 }]}>

                <View style={[styles.left]}>
                    <View style={styles.bottomWrap}>
                        <View style={[
                            { marginBottom: pxToDp(10), height: pxToDp(502), width: '100%' }
                        ]}>
                            <View style={[appStyle.flexTopLine, appStyle.flexJusBetween]}>
                                <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59', marginBottom: pxToDp(10) }]}>正确率</Text>

                                <TouchableOpacity
                                    onPress={() => this.setState({ visible: true })}
                                    style={[size_tool(152, 60), borderRadius_tool(30), appStyle.flexCenter, { backgroundColor: '#fff' }]}>
                                    <Text style={[{ fontSize: pxToDp(28), color: '#4C4C59' }]}>查看详情</Text>
                                </TouchableOpacity>
                            </View>

                            <MyManyBarChart totallist={[]}
                                rightValue={this.state.rightValue}
                                namelist={this.state.namelist}
                                enabledLegend={true}
                                height={pxToDp(430)}
                                width={pxToDp(1864)}
                                rightColor={'#7076FF'}
                            />

                        </View>
                        <View style={[appStyle.flexTopLine, { backgroundColor: '#EDEDF5', padding: pxToDp(20), borderRadius: pxToDp(20), minHeight: pxToDp(108) }]}>
                            <View style={{ flexDirection: 'row', marginRight: pxToDp(24), alignItems: 'center', width: pxToDp(800) }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={require("../../../images/chineseStrong.png")}
                                        style={[size_tool(40), { zIndex: 99, marginRight: pxToDp(12) }]} />
                                </View>

                                <Text
                                    style={styles.bottomTextRight}
                                >{this.state.maxMsg}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: pxToDp(800) }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={require("../../../images/chineseWeak.png")}
                                        style={[size_tool(40), { zIndex: 99, marginRight: pxToDp(12) }]} />
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
                            <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59', marginBottom: pxToDp(10) }]}>π分相对排名</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', marginBottom: pxToDp(40), }}> */}

                        <MyLineChart value={lineValue} arangelist={arangelist} linename={linename}
                            height={pxToDp(400)}
                            width={pxToDp(1864)}
                            myColor={'#906FFF'}
                            perColor={'#C3C3D9'}
                            perlintType={'solid'}
                        />

                        {/* </View> */}

                        <View style={[{ backgroundColor: '#EDEDF5', padding: pxToDp(20), borderRadius: pxToDp(20), height: pxToDp(80), alignItems: 'center' }]}>
                            <View style={{ flexDirection: 'row', marginBottom: pxToDp(24) }}>
                                {
                                    this.state.stage_ranking > 50 ?
                                        <Image source={require("../../../images/chineseStrong.png")}
                                            style={[size_tool(40), { zIndex: 99, marginRight: pxToDp(12) }]} /> :
                                        <Image source={require("../../../images/chineseWeak.png")}
                                            style={[size_tool(40), { zIndex: 99, marginRight: pxToDp(12) }]} />

                                }
                                <Text
                                    style={styles.bottomTextRight}
                                >{this.state.stage_ranking > 50 ?
                                    `超越了${this.state.stage_ranking}%的同学，请继续加油哦！`
                                    : '请继续加油哦!'}</Text>
                            </View>

                        </View>
                    </View>
                </View>
                <Modal
                    transparent
                    visible={this.state.visible}
                    presentationStyle={"fullScreen"}
                    style={[{ width: pxToDp(1680) }]}
                >
                    {/* <View style={[appStyle.flexCenter, { backgroundColor: 'pink', flex: 1, height: '100%', width: '100%' }]}> */}
                    <View
                        style={[size_tool(1630, 800), { position: 'relative' }]}>
                        <TouchableOpacity onPress={() => { this.setState({ visible: false }) }} style={[{ position: 'absolute', top: pxToDp(0), right: pxToDp(0), zIndex: 999 }]}>
                            <Image style={[size_tool(60), borderRadius_tool(30), { backgroundColor: '#EDEDF5' }]} source={require('../../../images/chineseHomepage/staticsClose.png')} />
                        </TouchableOpacity>
                        < SentenceDetail data={{ ...this.props.data, namelist: allnamelist }} />
                    </View>
                    {/* </View> */}

                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: pxToDp(838),
        backgroundColor: "#EEF3F5",
    },
    left: {
        width: '100%',
        flex: 1,
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        marginBottom: pxToDp(40),
    },
    bottomWrap: {
        width: '100%',
        height: pxToDp(728),
        borderRadius: pxToDp(32),
        marginBottom: pxToDp(40),
        borderWidth: pxToDp(4), borderColor: '#E9E9F2',
        padding: pxToDp(40),
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
        fontSize: pxToDp(24),
        color: '#4C4C59',
        flex: 1,
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin()
    },
    circleWrap: {
        backgroundColor: 'transparent',
        borderWidth: pxToDp(4),
        borderColor: '#E4E4F0',
        justifyContent: 'center',
        alignItems: 'center',
        width: pxToDp(88),
        height: pxToDp(88),
        borderRadius: pxToDp(44),
        marginRight: pxToDp(20)
    },
    circleText1: {
        fontSize: pxToDp(48),
        color: '#4C4C59',
    },
    circleText2: {
        fontSize: pxToDp(28),
        color: '#9595A6'
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
