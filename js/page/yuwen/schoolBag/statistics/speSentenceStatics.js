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
import CircleStatistcs from '../../../../component/circleStatistcs'
import MyLineChart from '../../../../component/myChart/myLineChart'
import OtherUserInfo from "../../../../component/otherUserinfo";
import Header from "../../../../component/Header";
import { combineReducers, compose } from "redux";
import { Toast, Modal } from "antd-mobile-rn";
import { T } from "lodash/fp";
import SpesentenceStaticsItem from '../../../../component/chinese/spesentenceStaticsItem'

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
            weak: ''
        };
    }
    componentDidMount() {
        this.getList()
        this.getlineChart('class')
    }
    getList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam

        axios.get(`${api.getChineseSentenceAllStatics}`, { params: { grade_term, exercise_time: infoData.type } }).then(
            res => {
                if (res && res.data.err_code === 0) {
                    this.setState({
                        list: res.data.data.data.data,
                        rate_correct: res.data.data.data.right_rate,
                        rate_speed: res.data.data.data.rate_speed,
                        strong: res.data.data.ability_msg.msg_strong,
                        weak: res.data.data.ability_msg.msg_weak,
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
                inspect: '智能句',
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
    lookDetail(item) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')


        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam

        console.log("参数", infoData)
        axios.get(`${api.getChineseSentenceAllStatics}`, { params: { grade_term, exercise_time: infoData.type, inspect: item.name } }).then(
            res => {
                if (res && res.data.err_code === 0) {
                    this.setState({
                        detailList: res.data.data.tag1_data,
                        detail: {
                            ...res.data.data,
                            name: item.name
                        },
                        detailVisible: true
                    })
                }

            }
        )
    }
    render() {
        const { lineValue } = this.state;
        return (
            <View style={[padding_tool(48, 48, 48, 48), { flex: 1, },]}>
                {/* <Header
                    text={this.props.navigation.state.params.data.exercise_element}
                    goBack={() => {
                        this.goBack();
                    }}
                ></Header> */}
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, { marginBottom: pxToDp(40) }]}>
                    <TouchableOpacity onPress={this.goBack.bind(this)}>
                        <Image
                            source={require('../../../../images/statisticsGoBack.png')}
                            style={[size_tool(80)]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.setState({ visible: true })}
                        style={[appStyle.flexLine, appStyle.flexJusBetween,
                        size_tool(226, 80),
                        borderRadius_tool(16),
                        padding_tool(16, 20, 16, 20),
                        {
                            backgroundColor: '#fff',
                        }]}>
                        <Image
                            source={require('../../../../images/chineseHomepage/sentenceStaticsBtn2.png')}
                            style={[size_tool(48)]}
                        />
                        <Text style={[{ fontSize: pxToDp(32), color: '#0179FF' }, appFont.fontFamily_syst]}>π分排名</Text>
                    </TouchableOpacity>

                </View>
                <View style={[{ flex: 1, justifyContent: 'center', }]}>
                    <View style={{}}>
                        <View style={[styles.topItem,]}>
                            <View style={[styles.topitemLeft, appStyle.flexLine]}>
                                <Text style={[{ color: '#333333', fontSize: pxToDp(32), marginRight: pxToDp(20) }, appFont.fontFamily_syst]}>成功率:</Text>
                                <Text style={[{ color: '#84D816', fontSize: pxToDp(40) }, appFont.fontFamily_syst]}>{this.state.rate_correct}%</Text>
                            </View>
                            <View style={
                                [padding_tool(25, 32, 25, 32),
                                styles.topItemRight]}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={require("../../../../images/chineseStrong.png")}
                                        style={[size_tool(48), { zIndex: 99, marginRight: pxToDp(12) }]} />
                                    <Text style={styles.bottomTextLeft}>强势</Text>
                                </View>

                                <Text
                                    style={styles.bottomTextRight}
                                >{this.state.strong}</Text>
                            </View>
                        </View>
                        <View style={[styles.topItem,]}>
                            <View style={[styles.topitemLeft, appStyle.flexLine]}>
                                <Text style={[{ color: '#333333', fontSize: pxToDp(32), marginRight: pxToDp(20) }, appFont.fontFamily_syst]}>平均答题速率:</Text>
                                <Text style={[{ color: '#84D816', fontSize: pxToDp(40) }, appFont.fontFamily_syst]}>{this.state.rate_speed}</Text>
                            </View>
                            <View style={[styles.topItemRight, padding_tool(25, 32, 25, 32),]}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={require("../../../../images/chineseWeak.png")}
                                        style={[size_tool(48), { zIndex: 99, marginRight: pxToDp(12) }]} />
                                    <Text style={styles.bottomTextLeft}>弱势</Text>
                                </View>

                                <Text
                                    style={styles.bottomTextRight}
                                >{this.state.weak}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[{ height: pxToDp(578), }]}>
                        <ScrollView horizontal={true} style={{ width: "100%", }}>

                            {
                                this.state.list.map((item, index) => {

                                    return <SpesentenceStaticsItem
                                        key={index}
                                        title={item.name}
                                        right={item.right_total}
                                        wrong={item.total - item.right_total}
                                        total={item.total}
                                        lookDetail={this.lookDetail.bind(this, item)}
                                    />
                                })
                            }


                        </ScrollView>
                    </View>

                </View>

                <Modal
                    transparent={true}
                    visible={this.state.visible}
                    footer={[{ text: "关闭", onPress: () => this.setState({ visible: false }) }]}
                    style={{ width: pxToDp(1120) }}
                >
                    <View
                        style={styles.bottomWrap}>
                        <View style={[appStyle.flexLine, { marginBottom: pxToDp(32) }]}>
                            <Image
                                source={require('../../../../images/chineseHomepage/sentenceStaticsBtn2.png')}
                                style={[size_tool(48)]}
                            />
                            <Text style={{ fontSize: pxToDp(32), color: '#21A6F4', marginLeft: pxToDp(20) }}>{'π分排名'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingRight: pxToDp(20) }}>
                            {/* <View style={{ marginRight: pxToDp(40), justifyContent: 'center', paddingLeft: pxToDp(40) }}>
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
                            < View style={[size_tool(846, 524), { backgroundColor: '#fff', borderRadius: pxToDp(24), paddingLeft: pxToDp(20) }]}>
                                <MyLineChart value={lineValue} arangelist={this.state.arangelist} linename={this.state.linename} width={pxToDp(1000)} height={pxToDp(450)} />

                                <View style={{ flexDirection: 'row', paddingLeft: pxToDp(44), marginTop: pxToDp(24) }}>
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
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.detailVisible}
                    footer={[{ text: "关闭", onPress: () => this.setState({ detailVisible: false }) }]}
                    style={{ width: pxToDp(1120) }}
                >
                    <View
                        style={styles.bottomWrap}>
                        <View
                            style={[appStyle.flexLine, appStyle.flexJusBetween,
                            size_tool(226, 80),
                            padding_tool(16, 20, 16, 20),
                            {
                                marginBottom: pxToDp(32)
                            }]}>
                            <Image
                                source={require('../../../../images/chineseHomepage/sentenceStaticsBtn1.png')}
                                style={[size_tool(48)]}
                            />
                            <Text style={[{ fontSize: pxToDp(32), color: '#21A6F4' }]}>{this.state.detail.name}</Text>
                        </View>

                        <View style={[appStyle.flexLine]}>
                            <View style={[
                                size_tool(300, 524),
                                padding_tool(32),

                                {
                                    backgroundColor: '#EEF6FF',
                                    borderRadius: pxToDp(24),
                                    marginRight: pxToDp(32)
                                }]}>
                                <Text style={[{ color: '#666666', fontSize: pxToDp(32), marginBottom: pxToDp(20) }]}>总体数据</Text>
                                <View style={[appStyle.flexAliCenter,]}>
                                    <CircleStatistcs
                                        total={this.state.detail.total}
                                        right={Number(this.state.detail.right_rate)}
                                        size={pxToDp(280)}
                                        width={pxToDp(38)}
                                        totalText={'全部'} />
                                    <Text style={{ fontSize: pxToDp(32), color: '#84D816', marginTop: pxToDp(16) }}>{this.state.detail.right_rate}%</Text>
                                    <Text style={{ fontSize: pxToDp(32), color: '#21A6F4', marginBottom: pxToDp(16) }}>正确率</Text>
                                    <Text style={{ fontSize: pxToDp(32), color: '#84D816' }}>{this.state.detail.rate_speed}</Text>
                                    <Text style={{ fontSize: pxToDp(32), color: '#21A6F4' }}>答题速率</Text>
                                </View>
                            </View>
                            <ScrollView horizontal={true} >
                                {this.state.detailList.map((item, index) => {
                                    return <SpesentenceStaticsItem
                                        key={index}
                                        title={item.name}
                                        right={item.right_total}
                                        wrong={item.total - item.right_total}
                                        backgroundColor={'#EEF6FF'}
                                        width={300}
                                        lineWidth={228}
                                        height={524}
                                    />
                                })}
                            </ScrollView>

                        </View>
                    </View>
                </Modal>
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
        height: pxToDp(590),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40),
    },

    topItem: {
        width: '100%',
        height: pxToDp(120),
        borderRadius: pxToDp(32),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(32)
    },
    topitemLeft: {
        fontSize: pxToDp(40),
        color: "#666",
        width: pxToDp(502),
        height: pxToDp(120),
        backgroundColor: '#fff',
        borderRadius: pxToDp(24),
        marginRight: pxToDp(40),
        lineHeight: pxToDp(120),
        paddingLeft: pxToDp(32)
    },
    topItemRight: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: pxToDp(24),
        height: pxToDp(120),
        alignItems: 'center'
    },
    bottomWrap: {

        backgroundColor: "#fff",
    },
    bottomItemText: {
        width: pxToDp(96),
        height: pxToDp(40),
        backgroundColor: '#F2F2F2',
        color: '#666666',
        fontSize: pxToDp(24),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(20),
        textAlign: 'center',
        marginBottom: pxToDp(40),
        lineHeight: pxToDp(36)
    },
    bottomItemTextChecked: {
        width: pxToDp(96),
        height: pxToDp(40),
        backgroundColor: '#0179FF',
        color: '#fff',
        fontSize: pxToDp(24),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(20),
        textAlign: 'center',
        lineHeight: pxToDp(36),
        marginBottom: pxToDp(40),
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
        // width: pxToDp(724)
        flex: 1,
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
