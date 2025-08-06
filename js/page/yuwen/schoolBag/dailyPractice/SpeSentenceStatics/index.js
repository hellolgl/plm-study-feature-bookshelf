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
import Header from '../../../../../component/Header'
import { combineReducers, compose } from "redux";
import { Modal } from "antd-mobile-rn";
import MyManyBarChart from '../../../../../component/myChart/myManyBarChart'
import { PieChart } from "react-native-charts-wrapper";

class SpeSentenceStatics extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [
            ],
            rate_correct: ' ',
            rate_speed: '',
            longlist: [],
            rightvisible: false,
            rightValue: [],
            namelist: [],
            totallist: [],
            littleName: '',
            speItem: {}
        };
    }
    componentDidMount() {
        this.getList()

    }
    getList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.getChinesSenstatistics}?grade_term=${grade_term}`, { params: {} }).then(
            res => {
                let list = res.data.data.son_category
                let listnow = []
                let speObj = {}
                // listnow = [...list]
                list.map((item) => {
                    item.inspect_name === '智能造句' ? speObj = { ...item } : listnow.push({ ...item })
                })

                this.setState({
                    list: listnow,
                    longlist: list,
                    rate_speed: res.data.data.rate_speed,
                    rate_correct: res.data.data.rate_correct,
                    speItem: speObj
                })
            }
        )
    }
    getListDetail(iid, name) {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let infoData = this.props.navigation.state.params.data
        let grade_term = userInfoJs.checkGrade + userInfoJs.checkTeam
        axios.get(`${api.getChinesSenstatistics}?grade_term=${grade_term}&iid=${iid}`, { params: {} }).then(
            res => {
                let list = res.data.data.son_category
                let listnow = []
                // listnow = [...list]
                let rightValue = [],
                    namelist = [''],
                    totallist = []

                for (let i = 0; i < list.length; i++) {
                    let tagname = ''
                    if (name === '句式变换') {
                        // 单独处理名字，不然名字太长会互相遮住
                        let oldname = list[i].inspect_name
                        tagname = oldname[0] + oldname[3] + oldname[4] + oldname[5]
                        oldname === '“把”“被”字句转换' ? tagname = '把被转换' : ''
                        oldname === '直接叙述变转述' ? tagname = '直变转述' : ''

                    } else {
                        tagname = list[i].inspect_name
                    }
                    namelist.push(tagname)
                    let rightobj = {
                        x: i + 1,
                        y: list[i].rate_correct
                    }
                    rightValue.push(rightobj)
                    totallist.push({
                        x: i + 1,
                        y: list[i].total > 0 ? 100 : 0
                    })
                }
                if (list.length < 8) {
                    for (let i = list.length; i < 8; i++) {
                        namelist.push('')
                        let rightobj = {
                            x: i + 1,
                            y: 0
                        }
                        rightValue.push(rightobj)
                        totallist.push({
                            x: i + 1,
                            y: 0
                        })
                    }
                }
                // console.log('_______________', namelist,totallist,rightValue)

                this.setState({
                    totallist,
                    rightValue,
                    namelist,
                    rightvisible: true,
                    littleName: name
                })
            }
        )
    }
    handlenOnCloseRight() {
        this.setState({
            rightvisible: false
        })
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    goSpe(item, type) {
        type === '1' ?
            NavigationUtil.toSpeSentenceTree({ ...this.props, data: { ...item } })
            : NavigationUtil.toSpeSentenceExplain({ ...this.props, data: { ...item, type: 'spe' } })
    }
    lookDetail(item) {
        this.getListDetail(item.iid, item.inspect_name)
        // this.setState({
        //     rightvisible: true
        // })
    }
    toDaily() {
        NavigationUtil.toSpeSentenceDailyExercise({
            ...this.props,
            data: {
                updata: () => {
                    this.getList()
                }
            }
        })
    }
    toDailyRecord() {
        NavigationUtil.toSpeSentenceExerciseRecord({ ...this.props, data: { sub_modular: '1', modular: '1' } })
    }
    renderFour() {
        let { list } = this.state
        return (
            <ScrollView horizontal={true} style={{ flexDirection: 'row', flex: 1, height: pxToDp(700) }}>
                {
                    list.map((item, index) => {
                        return <View style={[styles.bottomItemWrap, { marginRight: index === list.length - 1 ? 0 : pxToDp(40) }]} key={index}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.bottomItemTopLeft}>{item.inspect_name}</Text>
                                <TouchableOpacity onPress={() => this.lookDetail(item)}><Text style={[{ fontSize: pxToDp(28), color: '#0179FF' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>查看详情</Text></TouchableOpacity>
                            </View>
                            <View style={styles.bottomItemCenterWrap}>
                                <CircleStatistcs total={item.total} right={Number(item.rate_correct)} size={220} width={30} totalText={'全部'} />
                                <View style={[styles.bottomItemCenterBottom, appStyle.flexTopLine]}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={styles.bottomItemCenterBottomTop}>{item.rate_correct}%</Text>
                                        <Text style={styles.bottomItemCenterBottomBottom}>正确率</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.bottomItemCenterBottomTop]}>{item.rate_speed ? item.rate_speed : '  '}</Text>
                                        <Text style={styles.bottomItemCenterBottomBottom}>答题速率</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.bottomWrap]}>
                                <TouchableOpacity style={[styles.bottomBtn, appStyle.flexCenter, { marginRight: pxToDp(32) }]} onPress={() => {
                                    this.goSpe(item, '1')
                                }}>
                                    <Image source={require('../../../../../images/chineseSpeSentenceStaticsBtn3.png')} style={{ width: pxToDp(150), height: pxToDp(160) }} />

                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.bottomBtn, appStyle.flexCenter]} onPress={() => {
                                    this.goSpe(item, '2')
                                }}>
                                    <Image source={require('../../../../../images/chineseSpeSentenceStaticsBtn4.png')} style={{ width: pxToDp(150), height: pxToDp(160) }} />

                                </TouchableOpacity>
                            </View>
                        </View>

                    })
                }
            </ScrollView >
        )
    }
    render() {
        const { rate_correct, rate_speed, littleName, speItem } = this.state;
        const footerButtons = [
            { text: "关闭", onPress: this.Rewrite },
            // { text: "帮助", onPress: this.helpMe },
        ];
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
                                width: pxToDp(300),
                                height: pxToDp(104),
                                borderRadius: pxToDp(32),
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                            },
                        ]}
                    >
                        <Image
                            source={require("../../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{
                            color: "#333",
                            fontSize: pxToDp(42),
                        }]}>句子提升</Text>
                    </View>

                    <View style={{ width: pxToDp(300) }}>
                        <Text style={[styles.headerCheckType, appFont.fontFamily_syst]}>横向滚动查看更多句型</Text>
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
                    <View style={[appStyle.flexCenter, { width: "100%", }]}>
                        <View style={[styles.left]}>
                            {
                                speItem.inspect_name ?
                                    <View style={[styles.bottomItemWrap, { marginRight: pxToDp(40), position: 'relative' }]}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[styles.bottomItemTopLeft]}>{speItem.inspect_name}</Text>
                                            <TouchableOpacity onPress={() => this.lookDetail(speItem)}><Text style={[{ fontSize: pxToDp(28), color: '#0179FF' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>查看详情</Text></TouchableOpacity>
                                        </View>
                                        <View style={styles.bottomItemCenterWrap}>
                                            <CircleStatistcs
                                                total={speItem.total}
                                                right={Number(speItem.rate_correct)}
                                                size={220}
                                                width={30}
                                                totalText={'全部'}
                                            />
                                            <View style={[styles.bottomItemCenterBottom, appStyle.flexTopLine]}>
                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={[styles.bottomItemCenterBottomTop]}>{speItem.rate_correct}%</Text>
                                                    <Text style={[styles.bottomItemCenterBottomBottom]}>正确率</Text>
                                                </View>
                                                <View style={{ alignItems: 'center' }}>
                                                    <Text style={[styles.bottomItemCenterBottomTop]}>{speItem.rate_speed ? speItem.rate_speed : '  '}</Text>
                                                    <Text style={[styles.bottomItemCenterBottomBottom]}>答题速率</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.bottomWrap]}>
                                            <TouchableOpacity style={[styles.bottomBtn, appStyle.flexCenter, { marginRight: pxToDp(32) }]} onPress={() => {
                                                this.goSpe(speItem, '1')
                                            }}>
                                                {/* <Text style={{ fontSize: pxToDp(28), color: '#0179FF' }}>专项学习</Text> */}
                                                <Image source={require('../../../../../images/chineseSpeSentenceStaticsBtn1.png')} style={{ width: pxToDp(150), height: pxToDp(160) }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.bottomBtn, appStyle.flexCenter, { position: 'relative' }]}
                                                onPress={() => {
                                                    // this.goSpe(item, '2')
                                                }}>
                                                {/* <Text style={{ fontSize: pxToDp(28), color: '#0179FF' }}>综合提升</Text> */}
                                                <Image source={require('../../../../../images/chineseSpeSentenceStaticsBtn2.png')} style={{ width: pxToDp(150), height: pxToDp(160) }} />
                                                <Image
                                                    style={{ width: pxToDp(150), height: pxToDp(160), position: 'absolute', bottom: pxToDp(0), right: pxToDp(0), zIndex: 999, borderRadius: pxToDp(16) }}
                                                    source={require('../../../../../images/chineseHomepage/chineseSentnceNo.png')}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    : null}
                            {
                                this.renderFour()
                            }
                        </View>
                    </View>

                </View>
                <Modal
                    animationType="fade"
                    transparent
                    onClose={() => this.handlenOnCloseRight()}
                    maskClosable={false}
                    visible={this.state.rightvisible}
                    // closable   //有无左上角的关闭
                    footer={footerButtons}
                    style={{ width: pxToDp(1300) }}
                >
                    <View style={{ flexDirection: 'row', marginBottom: pxToDp(24) }}>
                        <Image source={require('../../../../../images/chineseSentenceStaticsIcon.png')} style={{ width: pxToDp(48), height: pxToDp(48) }} />
                        <Text style={{ fontSize: pxToDp(32), color: '#666' }}>{littleName}</Text>
                    </View>
                    <View style={{ backgroundColor: '#F9F9F9', width: pxToDp(1260), height: pxToDp(532), padding: pxToDp(50) }}>
                        <MyManyBarChart width={pxToDp(1200)} height={pxToDp(400)} totallist={this.state.totallist}
                            rightValue={this.state.rightValue}
                            namelist={this.state.namelist}
                            textFount={pxToDp(30)}
                        />
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
    header: {
        height: pxToDp(104),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        // position: "relative",
        // justifyContent: 'space-between'
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '100%',
        alignItems: 'center',
        paddingRight: pxToDp(20),
        paddingLeft: pxToDp(20)
    },
    left: {
        width: '100%',
        height: pxToDp(692),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
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
        padding: pxToDp(14),
    },
    bottomItemWrap: {
        width: pxToDp(456),
        height: pxToDp(692),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        padding: pxToDp(32),
    },
    bottomItemTopLeft: {
        fontSize: pxToDp(32),
        color: "#333333",
        marginBottom: pxToDp(40),
        ...appFont.fontFamily_syst,
        ...fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(40) })
    },
    bottomItemCenterWrap: {
        alignItems: 'center',
        marginBottom: pxToDp(40)
    },
    bottomItemCenterBottom: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: pxToDp(50),
        paddingRight: pxToDp(40),
        paddingTop: pxToDp(40),
        // marginBottom: pxToDp(40)
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
    bottomBtn: {
        width: pxToDp(150),
        height: pxToDp(160),
        borderRadius: pxToDp(32),
        marginBottom: pxToDp(32),
    },
    bottomWrap: {
        width: '100%',
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
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


export default connect(mapStateToProps, mapDispathToProps)(SpeSentenceStatics)
