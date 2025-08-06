import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    ImageBackground,
    DeviceEventEmitter,
    Modal
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp } from "../../../../../util/tools";
import { appStyle,appFont } from "../../../../../theme";
import * as _ from 'lodash'
import * as actionCreators from "../../../../../action/purchase/index";

const DAY_IMG_MAP = {
    0:require('../../../../../images/EN_Sentences/day_bg_1.png'),
    1:require('../../../../../images/EN_Sentences/day_bg_2.png'),
    2:require('../../../../../images/EN_Sentences/day_bg_3.png'),
    3:require('../../../../../images/EN_Sentences/day_bg_4.png'),
    4:require('../../../../../images/EN_Sentences/day_bg_5.png'),
    5:require('../../../../../images/EN_Sentences/day_bg_6.png'),
    6:require('../../../../../images/EN_Sentences/day_bg_7.png'),
    7:require('../../../../../images/EN_Sentences/day_bg_8.png'),
    8:require('../../../../../images/EN_Sentences/day_bg_9.png'),
    9:require('../../../../../images/EN_Sentences/day_bg_10.png'),
}

const DAY_ACTIVE_IMG_MAP = {
    0:require('../../../../../images/EN_Sentences/day_bg_1_active.png'),
    1:require('../../../../../images/EN_Sentences/day_bg_2_active.png'),
    2:require('../../../../../images/EN_Sentences/day_bg_3_active.png'),
    3:require('../../../../../images/EN_Sentences/day_bg_4_active.png'),
    4:require('../../../../../images/EN_Sentences/day_bg_5_active.png'),
    5:require('../../../../../images/EN_Sentences/day_bg_6_active.png'),
    6:require('../../../../../images/EN_Sentences/day_bg_7_active.png'),
    7:require('../../../../../images/EN_Sentences/day_bg_8_active.png'),
    8:require('../../../../../images/EN_Sentences/day_bg_9_active.png'),
    9:require('../../../../../images/EN_Sentences/day_bg_10_active.png'),
}

class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            page:1,
            swiperPages:[],
            allList:[],
            maxPage:1,
            visible:false
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getData()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener('refreshPage', (event) => {
            this.getData()
        })
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }

    getData() {
        const { page } = this.state
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        const data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        axios.get(api.getEngSentencesDairy, { params: data }).then((res) => {
            let data = res.data.data
            let list = _.cloneDeep(data).slice((page-1)*10,page*10)
            let maxPage = Math.ceil(data.length/10)
            this.setState({
                list,
                allList: data,
                maxPage
            })
        });
    }

    toDoTopic = (i,x)=>{
        const {page} = this.state
        let authority = this.props.authority
        if(!authority && ((page === 1 && x > 4) || page > 1)){
            this.props.setVisible(true)
            return
        }
        if(i.has_record){
            NavigationUtil.toEnSentencesLearnTodayRecordList({...this.props,data:{unit_code:i.unit_code,days:i.days}});
            return
        }
        NavigationUtil.toEnSentencesLearnTodayDoExercise({...this.props,data:{days:i.days,unit_code:i.unit_code}});
    }
    toPre = () => {
        const { page, allList } = this.state
        if (page === 1) return
        this.setState((state, props) => {
            return {
                page: state.page - 1
            };
        }, () => {
            let _page = page - 1
            let list = allList.slice((_page - 1) * 10, _page * 10)
            this.setState({
                list
            })
        });
    }
    toNext = () => {
        const { page, allList, maxPage } = this.state
        if (page === maxPage) return
        this.setState((state, props) => {
            return {
                page: state.page + 1
            };
        }, () => {
            let _page = page + 1
            let list = allList.slice((_page - 1) * 10, _page * 10)
            this.setState({
                list
            })
        });
    }
    renderMedal = (i,x)=>{
        const {correct_rate} = i
        if(correct_rate < 60){
            return null
        }
        if(correct_rate >= 60 && correct_rate<75){
            return  <Image style={[styles.medalImg,x === 1 || x === 2 || x === 6?{left:pxToDp(140)}:null]}  source={require("../../../../../images/EN_Sentences/medal_tong.png")} resizeMode='contain'></Image>
        }
        if(correct_rate >= 75 && correct_rate<85){
            return  <Image style={[styles.medalImg,x === 1 || x === 2 || x === 6?{left:pxToDp(140)}:null]}  source={require("../../../../../images/EN_Sentences/medal_yin.png")} resizeMode='contain'></Image>
        }
        return  <Image style={[styles.medalImg,x === 1 || x === 2 || x === 6?{left:pxToDp(140)}:null]}  source={require("../../../../../images/EN_Sentences/medal_jin.png")} resizeMode='contain'></Image>
    }

    renderFreeIcon = (i,x) => {
        const {page} = this.state
        let authority = this.props.authority
        if(page === 1 && x < 5 && !authority){
            const IMG_STYLE_MAP = {
                0:{right:pxToDp(33)},
                1:{right:pxToDp(174),top:pxToDp(20)},
                2:{left:pxToDp(27)},
                3:{right:pxToDp(20)},
                4:{right:pxToDp(-68),top:pxToDp(40)}
            }
            return <Image style={[{width:x === 4?pxToDp(80):pxToDp(66),height:x === 4?pxToDp(66):pxToDp(80),position:"absolute",top:pxToDp(-60)},IMG_STYLE_MAP[x]]} source={x === 4?require('../../../../../images/EN_Sentences/icon_7.png'):require('../../../../../images/EN_Sentences/icon_6.png')}></Image>
        }
    }

    prevBtn = () => {
        return <TouchableOpacity onPress={this.toPre}>
            <Image source={require("../../../../../images/EN_Sentences/pre_btn.png")} style={{ width: pxToDp(49), height: pxToDp(75)}}></Image>
        </TouchableOpacity>
    }

    nextBtn = () => {
        return <TouchableOpacity onPress={this.toNext}>
             <Image source={require("../../../../../images/EN_Sentences/next_btn.png")} style={{ width: pxToDp(49), height: pxToDp(75)}}></Image>
        </TouchableOpacity>
    }

    render() {
        const {list,page,maxPage,visible} = this.state
        return (
            <ImageBackground style={[styles.container]} source={Platform.OS === 'android'?require("../../../../../images/EN_Sentences/bg_1_a.png"):require("../../../../../images/EN_Sentences/bg_1_i.png")}>
                <View style={[styles.header,Platform.OS === 'ios'?{paddingTop:pxToDp(60)}:null]}>
                    <TouchableOpacity style={[styles.back_btn,Platform.OS === 'ios'?{top:pxToDp(40)}:null]} onPress={this.goBack}>
                        <Image resizeMode='stretch' style={[{width:pxToDp(120),height:pxToDp(80)}]} source={require('../../../../../images/childrenStudyCharacter/back_btn_1.png')}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rule_btn,Platform.OS === 'ios'?{top:pxToDp(40)}:null]} onPress={()=>{
                        this.setState({
                            visible:true
                        })
                    }}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(38)},appFont.fontFamily_jcyt_700]}>规则</Text>
                    </TouchableOpacity>
                    <View style={[appStyle.flexLine]}>
                        <Text style={[{color:"#445368",fontSize:pxToDp(58)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{lineHeight:pxToDp(68)}:null]}>Learn Today</Text>
                        <View style={[styles.unit_wrap,{marginLeft:pxToDp(34)}]}>
                            <Text style={[{color:"#fff",fontSize:pxToDp(58)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{lineHeight:pxToDp(68)}:null]}>Unit {page}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.content]}>
                    {/* 781根据设计图算的区域高度 */}
                    <View style={[{height:pxToDp(781),width:'100%'},appStyle.flexJusCenter]}>
                        <View style={[appStyle.flexLine,page > 1?appStyle.flexJusBetween:appStyle.flexLineReverse,{marginTop:pxToDp(400)}]}>
                            {page > 1?this.prevBtn():null}
                            {page !== maxPage?this.nextBtn():null}
                        </View>
                        {list.map((i,x) => {
                            let IMG_MAP = DAY_IMG_MAP
                            if(i.has_record) IMG_MAP = DAY_ACTIVE_IMG_MAP
                            return <TouchableOpacity key={x} style={[{position:"absolute"},styles[`dayBg${x + 1}`]]} onPress={()=>{
                                this.toDoTopic(i,x)
                            }}>
                                <ImageBackground resizeMode='stretch' style={[{flex:1}]} source={IMG_MAP[x]}>
                                    {this.renderMedal(i,x)}
                                    {this.renderFreeIcon(i,x)}
                                    <View style={[{position:"absolute",left:pxToDp(43),bottom:pxToDp(6)},x === 2?{bottom:pxToDp(96),left:pxToDp(114),alignItems: 'flex-end'}:null,x === 3?{bottom:pxToDp(96),left:pxToDp(32)}:null]}>
                                        <Text style={[{color:"#445368",fontSize:pxToDp(37)},appFont.fontFamily_jcyt_700,Platform.OS === 'android'?{marginBottom:pxToDp(-20)}:{lineHeight:pxToDp(47)}]}>Day{x + 1}</Text>
                                        <Text style={[{color:"#ACB2BC",fontSize:pxToDp(20)},appFont.fontFamily_jcyt_500]}>Unit {page}</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        })}
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent
                    visible={visible}
                    supportedOrientations={['portrait', 'landscape']}
                    >
                    <View style={[styles.m_container]}>
                        <View style={[styles.m_content]}>
                            <Text style={[{color:"#445368",fontSize:pxToDp(50),textAlign:'center',marginBottom:pxToDp(40)},appFont.fontFamily_jcyt_700]}>规则说明</Text>
                            <Text style={[styles.m_txt]}>当答题正确率大于等于85%时，获得金徽章。</Text>
                            <Text style={[styles.m_txt]}>当答题正确率为75%（含）- 85%之间时，获得银徽章。</Text>
                            <Text style={[styles.m_txt]}>当答题正确率为60%（含）- 75%之间时，获得铜徽章。</Text>
                            <Text style={[styles.m_txt]}>当答题正确率小于60%时，没有徽章。</Text>
                            <View style={[appStyle.flexCenter,{marginTop:pxToDp(40)}]}>
                                <TouchableOpacity style={[styles.m_btn]} onPress={()=>{
                                    this.setState({
                                        visible:false
                                    })
                                }}>
                                    <View style={[styles.m_btn_inner]}>
                                        <Text style={[{color:"#fff",fontSize:pxToDp(50)},appFont.fontFamily_jcyt_700]}>好的</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        position:'relative',
        ...appStyle.flexCenter,
        ...appStyle.flexLine,
    },
    back_btn:{
        position:"absolute",
        left:pxToDp(40)
    },
    rule_btn:{
        width:pxToDp(120),
        height:pxToDp(80),
        borderRadius:pxToDp(60),
        backgroundColor:"#FF8F32",
        position:"absolute",
        right:pxToDp(40),
        ...appStyle.flexCenter
    },
    unit_wrap:{
        width:pxToDp(220),
        height:pxToDp(85),
        borderRadius:pxToDp(30),
        backgroundColor:'#FF8F32',
        ...appStyle.flexCenter
    },
    content:{
        flex:1,
        paddingLeft:pxToDp(30),
        paddingRight:pxToDp(30),
        ...appStyle.flexCenter,
    },
    dayBg1:{
        width:pxToDp(246),
        height:pxToDp(165),
        left:pxToDp(55),
        top:pxToDp(347)
    },
    dayBg2:{
        width:pxToDp(246),
        height:pxToDp(245),
        left:pxToDp(319),
        top:pxToDp(264)
    },
    dayBg3:{
        width:pxToDp(253),
        height:pxToDp(253),
        left:pxToDp(409),
        top:pxToDp(0)
    },
    dayBg4:{
        width:pxToDp(254),
        height:pxToDp(252),
        left:pxToDp(675),
        top:pxToDp(0)
    },
    dayBg5:{
        width:pxToDp(232),
        height:pxToDp(252),
        left:pxToDp(700),
        top:pxToDp(264)
    },
    dayBg6:{
        width:pxToDp(254),
        height:pxToDp(251),
        left:pxToDp(757),
        top:pxToDp(529)
    },
    dayBg7:{
        width:pxToDp(253),
        height:pxToDp(253),
        left:pxToDp(1022),
        top:pxToDp(529)
    },
    dayBg8:{
        width:pxToDp(255),
        height:pxToDp(254),
        left:pxToDp(1096),
        top:pxToDp(264)
    },
    dayBg9:{
        width:pxToDp(254),
        height:pxToDp(172),
        left:pxToDp(1364),
        top:pxToDp(264)
    },
    dayBg10:{
        width:pxToDp(254),
        height:pxToDp(172),
        left:pxToDp(1632),
        top:pxToDp(264)
    },
    medalImg:{
        width:pxToDp(75),
        height:pxToDp(85),
        position:"absolute",
        left:pxToDp(40),
        top:pxToDp(7)
    },
    m_container:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter
    },
    m_content:{
        padding:pxToDp(40),
        borderRadius:pxToDp(80),
        backgroundColor:"#fff"
    },
    m_btn:{
        width:pxToDp(220),
        height:pxToDp(140),
        paddingBottom:pxToDp(10),
        backgroundColor:"#FF741D",
        borderRadius:pxToDp(80),
    },
    m_btn_inner:{
        flex:1,
        borderRadius:pxToDp(80),
        backgroundColor:"#FF8F32",
        ...appStyle.flexCenter
    },
    m_txt:{
        fontSize: Platform.OS === 'android'?pxToDp(32):pxToDp(42),
        color: '#4C4C59',
        ...appFont.fontFamily_jcyt_500
    },
    freeIcon:{
        width:pxToDp(70),
        height:pxToDp(70),
        borderRadius:pxToDp(35),
        backgroundColor:"#2ECDA9",
        ...appStyle.flexCenter
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        authority:state.getIn(["userInfo", "selestModuleAuthority"]),
        selestModule:state.getIn(["userInfo", "selestModule"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(actionCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(HomePage);
