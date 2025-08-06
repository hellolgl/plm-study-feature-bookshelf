import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Animated,
    DeviceEventEmitter,
    Platform,
    FlatList,
    Dimensions,
    useWindowDimensions
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import url from "../../../../util/url";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import FreeTag from "../../../../component/FreeTag";
import * as actionCreators from "../../../../action/purchase/index";
import * as purchaseCreators from "../../../../action/purchase";
import { appFont, appStyle } from "../../../../theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as actionCreatorsDailyTask from "../../../../action/dailyTask";
import _ from 'lodash'
import { Toast } from "antd-mobile-rn";
// import { BoxShadow } from 'react-native-shadow';
import { size_tool, pxToDp, padding_tool, getIsTablet, } from "../../../../util/tools";
import CoinView from '../../../../component/coinView'
import Swiper from 'react-native-swiper';
import Rule from "./components/rule";
import StackedLine from "./components/StackedLine";

// import WaveProgress from './WaveProgress';
// import ProgressCircle from './ProgressCircle';
import SwiperFlatList from './SwiperFlatList'
import { T } from "lodash/fp";
import index from "../../../../reducer";
import { LeftHalfCircle, RightHalfCircle } from './components/HalfCircle';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HomeBgConfig = {
    0: {
        bgAndroid: require("../../../../images/MathUnitDiagnosis/content_unit_bg.png"),
        bgIos: require("../../../../images/MathUnitDiagnosis/content_unit_bg_ios.png"),
    },
    1: {
        bgAndroid: require("../../../../images/MathUnitDiagnosis/skill_unit_bg.png"),
        bgIos: require("../../../../images/MathUnitDiagnosis/skill_unit_bg_ios.png"),
    },
    2: {
        bgAndroid: require("../../../../images/MathUnitDiagnosis/mask_group.png"),
        bgIos: require("../../../../images/MathUnitDiagnosis/mask_group_ios.png"),
    },
}
const isTablet = getIsTablet();

const btn_arr = [
    {
        bg: '#F9793B',
        label: '开始答题'
    },
    {
        bg: '#F9793B',
        label: '重新答题'
    },
    {
        bg: '#F9B43B',
        label: '继续答题'
    }
]



const bar_arr = ['#FF6680', '#FFAA5C', '#00CC88']

const skill_arr = [
    {
        bg: '#4C4C59',
        barColor: '#FF6680',
        label: '认识',
        total_score: 0,
        proportion: [0, 0]
    },
    {
        bg: '#E9E9F2',
        barColor: '#FFAA5C',
        label: '分析',
        total_score: 0,
        proportion: [0, 0]

    },
    {
        bg: '#E9E9F2',
        barColor: '#FF6680',
        label: '运用',
        total_score: 0,
        proportion: [0, 0]
    },
    {
        bg: '#E9E9F2',
        barColor: '#00CC88',
        label: '思考',
        total_score: 0,
        proportion: [0, 0]
    }
]

const RADIUS = pxToDp(88);
// UnitDiagnosis
class HomePage extends PureComponent {
    constructor(props) {
        super(props);
        this.userInfo = props.userInfo.toJS();
        this.state = {
            unitList: [],
            list: [],
            unitIndex: 0,
            unit_id: 0,
            summaryList: [],
            summaryIndex: -1,
            skillType: 0,   //0能力法 1 内容法
            swiperFlatListIndex: 0,
            skill_list: skill_arr,
            skill_list_index: 0,
            studyUnitList: [],
            studyUnitIndex: 0,
            abilityData: null,
            showRule: false,
            showStackedLine: false,
            TONGJI: {},
            abilityZImage: null,
            imageBase64: {
                width: 0,
                height: 0
            }
        }
    }



    changeSkillDate = (num) => {
        if (num === 0) {
            this.getStudyUnit();

        } else {
            this.getUnitList('')
        }
    }

    getStudyUnit = () => {
        const { studyUnitIndex } = this.state;
        const info = this.props.userInfo.toJS();
        let obj = {
            textbook: this.props.textCode,
            grade_code: info.checkGrade,
            term_code: info.checkTeam,
        }
        axios.get(api.getStudyUnit, { params: obj }).then((res) => {
            let data = res.data.data.unit_data;
            const finalList = data.map((item, index) => ({
                ...item,
                num: this.numberToChinese(index + 1)
            }))
            this.setState({
                studyUnitList: finalList
            }, () => {
                if (data.length > 0) {
                    this.getAbilityIndex(data[studyUnitIndex].origin)
                    this.abilityScore(data[studyUnitIndex].origin)
                }
            })
        });
    }

    componentDidMount() {
        // console.log("TongbuMathSchoolHome didmount");
        const { skillType } = this.state;
        this.changeSkillDate(skillType);
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (event) => {


                if (event === 'skill') {
                    this.getStudyUnit();

                } else {
                    this.getUnitList('refreshPage')
                }


                // DeviceEventEmitter.emit('changeUnit');
                // console.log("refreshPage")

            }
        );

    }
    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    getAbilityIndex = (origin) => {
        const { skill_list } = this.state;
        axios.get(api.getAbilityIndex, { params: { origin } }).then((res) => {
            let data = res.data.data;

            // ability_info下标与skill_list对应，合并数据
            const abilityInfo = data?.ability_info;
            const updatedSkillList = skill_list.map((item, idx) => ({
                ...item,
                ...(abilityInfo[idx] || {})
            }));
            console.log('updatedSkillList', updatedSkillList)
            this.abilityZ(data.z);
            this.setState({
                abilityData: data,
                skill_list: updatedSkillList
            });
        });
    }


    // 动态生成中文大写数字的函数
    numberToChinese = (num) => {
        const chineseNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        const units = ["", "十", "百", "千", "万", "十", "百", "千", "亿"];
        let result = "";
        let index = 0;

        while (num > 0) {
            const digit = num % 10;
            if (digit !== 0) {
                result = chineseNumbers[digit] + units[index] + result;
            }
            num = Math.floor(num / 10);
            index++;
        }

        // 处理特殊情况：10-19
        if (result.startsWith("一十")) {
            result = result.replace("一十", "十");
        }

        return result || "零";
    }

    getUnitList = (type) => {
        const { unitIndex } = this.state
        const info = this.props.userInfo.toJS();
        let obj = {
            textbook: this.props.textCode,
            grade_code: info.checkGrade,
            term_code: info.checkTeam,
        }
        axios.get(api.getUnitDiagnosis, { params: obj }).then((res) => {
            let data = res.data.data
            const reviewItems = [];
            const list = data.filter(item => {
                if (item.name.includes("期中复习") || item.name.includes("期末复习")) {
                    reviewItems.push(item);
                    return false;
                }
                return true;
            });

            const finalList = list.map((item, index) => ({
                ...item,
                num: this.numberToChinese(index + 1)
            }))

            this.setState({
                unitList: finalList,
                summaryList: reviewItems,
                unit_id: type !== 'refreshPage' ? finalList[0].u_t_id : this.state.unit_id,
            }, () => {
                if (data.length > 0) this.getList(type !== 'refreshPage' ? finalList[0].u_t_id : this.state.unit_id)
            })
        });
    }
    clickStudentUnit = (item, index) => {
        const { abilityData } = this.state;
        this.setState({
            studyUnitIndex: index,
        }, () => {
            this.abilityScore(item.origin)
            this.abilityZ(abilityData.z);
            this.getAbilityIndex(item.origin)
        })
    }

    clickUnit = (item, index) => {
        DeviceEventEmitter.emit('changeUnit');
        this.setState({
            unitIndex: index,
            unit_id: item.u_t_id,
        }, () => {
            this.getList(item.u_t_id)
        })
    }

    //统计
    abilityScore = (origin) => {

        axios.get(api.abilityScore, { params: { origin } }).then((res) => {
            let data = res.data.data

            const keys = Object.values(data.ability).map(obj =>
                Object.keys(obj)
                    .map(Number)
            );
            keys.unshift(Object.keys(data.total));
            const values = Object.values(data.ability).map(obj =>
                Object.values(obj)
                    .map(Number)
            );
            values.unshift(Object.values(data.total))
            // console.log('统计----', keys, values)
            this.setState({
                TONGJI: { keys, values }
            })
        });
    }


    //正态分布
    abilityZ = (z) => {
        const { abilityData } = this.state;
        axios.get(api.abilityZ, { params: { z } }).then((res) => {
            let data = res.data.data
            Image.getSize(data, (width, height) => {
                const maxWidth = pxToDp(1600);
                const scaleFactor = maxWidth / width;
                let obj = { width: maxWidth, height: height * scaleFactor, }
                this.setState({
                    imageBase64: obj,
                    abilityZImage: data
                })

            });
            // console.log('统计----', data)
            // this.setState({
            //     abilityZImage: data
            // })
        });
    }





    getList = (id) => {
        axios.get(api.getUnitDiagnosisSet, { params: { u_t_id: id } }).then((res) => {
            let data = res.data.data;
            this.setState({
                list: data
            })
        });
    }
    clickItem = (childIndex, item) => {
        const { unitList, unitIndex } = this.state
        console.log('点击', item, childIndex)

        if (!this.props.authority && unitIndex !== 0) {
            this.props.setVisible(true);
            return;
        }
        let obj = {
            u_q_id: item.u_q_id,
            unitName: item.name
        }
        if (childIndex === 0) {
            // console.log('开始检测或者做过题重新开始')
            obj.status = 0  //0重新开始 1继续作答
        }
        if (childIndex === 2) {
            console.log('做过题,继续做')
            obj.status = 1
        }
        NavigationUtil.toMtahUnitDiagnosisDoExercise({
            ...this.props,
            data: { ...obj },
        });
    }

    onPressSkill = (num) => {
        this.setState({
            skillType: num
        }, () => {
            DeviceEventEmitter.emit('changeUnit');
            this.changeSkillDate(num);
        })
    }

    setIndex = (index) => {
        this.setState({
            swiperFlatListIndex: index
        })
    }
    last_btn = () => {
        this.setIndex(this.state.swiperFlatListIndex - 1)
        this.swiperFlatListRef && this.swiperFlatListRef.goTo(this.state.swiperFlatListIndex - 1)
    }
    next_btn = () => {
        this.setIndex(this.state.swiperFlatListIndex + 1)
        this.swiperFlatListRef && this.swiperFlatListRef.goTo(this.state.swiperFlatListIndex + 1)
    }

    skill_grade = (grade = 1) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Image
                    key={i}
                    style={styles.grade_img}
                    source={
                        i <= grade
                            ? require('../../../../images/MathUnitDiagnosis/xing_active.png')
                            : require('../../../../images/MathUnitDiagnosis/xing.png')
                    }
                />
            );
        }
        return <View style={styles.xing_con}>{stars}</View>;
    }

    renderBarColor = (total_score) => {
        if (total_score < 60) {
            return bar_arr[0];
        } else if (total_score >= 60 && total_score <= 80) {
            return bar_arr[1];
        } else if (total_score > 80) {
            return bar_arr[2];
        }
        return bar_arr[0];
    }

    onClickItem = () => {
        const { studyUnitList, studyUnitIndex, abilityData } = this.state;
        let obj = {
            max_level: abilityData?.level,
            u_q_id: studyUnitList[studyUnitIndex].origin,
            // u_q_id: 127,
            unitName: studyUnitList[studyUnitIndex].ui_name,
            status: 0 //0重新开始 1继续作答
        }
        NavigationUtil.toSkillMtahUnitDiagnosisDoExercise({
            ...this.props,
            data: { ...obj },
        });
    }

    toRecord = () => {
        NavigationUtil.toDoExerciseRecord({
            ...this.props,
            data: {},
        });

    }

    render() {
        const radius = 100;
        const circumference = 2 * Math.PI * radius;
        const { abilityData, showRule, showStackedLine, skillType, list, studyUnitIndex, studyUnitList, unitList, unitIndex, skill_list_index, unit_id, skill_list, summaryList, swiperFlatListIndex } = this.state;
        const bg = skillType === 0 ? HomeBgConfig[1] : HomeBgConfig[0]
        const { authority } = this.props
        const { avatar, name, grade, term, textbookname, checkGrade, checkTeam, organ_name, username } =
            this.userInfo;
        const { width } = Dimensions.get('window');
        const size = Math.min(width * 0.3, 100); // 动态适配
        const progress = abilityData;
        console.log('skill_lis---------t', skill_list)
        // const swiperFlatListIndex = this.swiperFlatListRef && this.swiperFlatListRef.currentIndex();

        // const progress_score = item.answer_count ? Math.round((item.right_count / item.answer_count) * 100) : 0;
        return (
            <ImageBackground
                style={[
                    { flex: 1, paddingTop: Platform.OS === "ios" ? 0 : 0 },
                ]}
                source={Platform.OS === "ios" ? bg.bgIos : bg.bgAndroid}
            >
                <ImageBackground style={[styles.mask_group, Platform.OS === "ios" && {
                    width: pxToDp(1740),
                    height: '100%',
                }]}
                    source={Platform.OS === "ios" ? HomeBgConfig[2].bgIos : HomeBgConfig[2].bgAndroid} >

                    {
                        skillType === 0 ? <ImageBackground resizeMode='contain' style={[styles.skill_item_bg]} source={Platform.OS === 'ios' ? require("../../../../images/MathUnitDiagnosis/skill_list_item_ios.png") : require("../../../../images/MathUnitDiagnosis/skill_list_item.png")}>

                            <View style={styles.skill_content}>
                                <TouchableOpacity onPress={() => this.setState({ showRule: !this.state.showRule })} style={[styles.rule_skill_con]}>
                                    <Image style={styles.rule_skill} source={require('../../../../images/MathUnitDiagnosis/rule_skill.png')} />
                                    <Text style={[{ fontSize: pxToDp(24), color: '#4C4C59', }, appFont.fontFamily_jcyt_500]}>规则</Text>
                                </TouchableOpacity>



                                <Text style={[{ fontSize: pxToDp(24), color: 'gray', textAlign: 'center', marginTop: Platform.OS === 'ios' ? pxToDp(20 * 2) : pxToDp(26), marginBottom: Platform.OS === 'ios' ? pxToDp(40 * 2) : pxToDp(16) }, appFont.fontFamily_jcyt_500]}>*点击柱状图查看知识及方法占比</Text>

                                <View style={[{ ...appStyle.flexTopLine, ...appStyle.flexAliCenter }, Platform.OS === 'ios' && { justifyContent: 'space-around', marginLeft: pxToDp(20), marginRight: pxToDp(20) }]}>

                                    <View style={styles.skill_left}>

                                        {
                                            skill_list.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.line_press_con,
                                                            skill_list_index === index && styles.border_active,
                                                        ]}
                                                        key={item.label}
                                                        onPress={() => this.setState({ skill_list_index: index })}
                                                        activeOpacity={0.8}
                                                    >
                                                        {
                                                            skill_list_index === index && <View style={styles.skill_tip}>
                                                                <View style={styles.triangle_up}></View>
                                                                <Text style={[{
                                                                    fontSize: pxToDp(24),
                                                                    color: 'white'
                                                                }, appFont.fontFamily_jcyt_500,]}>{`程序${item.proportion[0]}% 概念${item.proportion[1]}%`}</Text>
                                                            </View>
                                                        }
                                                        <View
                                                            style={[
                                                                styles.line_press,
                                                                { backgroundColor: skill_list_index === index ? '#4C4C59' : '#E9E9F2' },
                                                            ]}
                                                        >

                                                            <View style={[styles.line_bar, { height: `${item.total_score}%`, backgroundColor: `${this.renderBarColor(item.total_score)}` }]}>

                                                                {
                                                                    item?.total_score > 10 ? <Text style={[
                                                                        { color: "#fff", textAlign: 'center', fontSize: pxToDp(20) },
                                                                        appFont.fontFamily_jcyt_500,
                                                                    ]}>{item?.total_score}%</Text> : item?.total_score > 0 && <Text style={[
                                                                        { textAlign: 'center', color: "#4C4C59", fontSize: pxToDp(20), marginBottom: pxToDp(100) },
                                                                        appFont.fontFamily_jcyt_500,

                                                                    ]}>{item?.total_score}%</Text>
                                                                }



                                                            </View>
                                                        </View>
                                                        <Text style={[styles.line_text, appFont.fontFamily_jcyt_500]}>{item.label}</Text>
                                                    </TouchableOpacity>
                                                );
                                            })
                                        }


                                    </View>

                                    <View style={styles.skill_right}>
                                        <View style={[styles.statistic_wrap]}>
                                            <View style={[appStyle.flexAliCenter]}>
                                                <Text
                                                    style={[
                                                        { color: "#fff", fontSize: pxToDp(44) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {abilityData ? abilityData['answer_total']['answer_rate'] : 0}%
                                                </Text>
                                                <Text
                                                    style={[
                                                        { color: "#fff", fontSize: pxToDp(22) },
                                                        appFont.fontFamily_jcyt_500,
                                                        Platform.OS === "ios" ? { marginTop: pxToDp(36) } : null,
                                                    ]}
                                                >
                                                    当前准确率
                                                </Text>
                                            </View>
                                            <View style={[styles.bar, { height: `${abilityData ? abilityData['answer_total']['answer_rate'] : 0}%` }]}></View>
                                        </View>
                                        <View style={styles.score_flex}>
                                            <Text style={[styles.score, { color: '#4C4C59', }]}>{abilityData ? abilityData?.answer_total?.answer_count : 0}</Text>
                                            <Text style={[styles.score_name, { color: '#4C4C59', }]}>已做题目</Text>
                                        </View>

                                    </View>
                                </View>



                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <TouchableOpacity pointerEvents="auto" onPress={() => { this.onClickItem() }}>
                                    <ImageBackground resizeMode="contain" style={styles.content_start} source={require('../../../../images/MathUnitDiagnosis/content_start.png')}>
                                        <Text style={[{ fontSize: pxToDp(32), color: '#0A7360' }, appFont.fontFamily_jcyt_700]}>开始答题</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => { this.toRecord() }} pointerEvents="auto" style={{
                                    marginLeft: pxToDp(40),
                                    position: 'absolute',
                                    right: pxToDp(-180)
                                }}>
                                    <ImageBackground resizeMode="contain" style={styles.content_record} source={require('../../../../images/MathUnitDiagnosis/skill_record.png')}>
                                        <Text style={[{ fontSize: pxToDp(32), color: 'white' }, appFont.fontFamily_jcyt_700]}>记录</Text>
                                    </ImageBackground>
                                </TouchableOpacity> */}
                            </View>


                        </ImageBackground> : <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                        }}>
                            <TouchableOpacity
                                disabled={swiperFlatListIndex === 0}
                                onPress={this.last_btn}
                                style={[{ marginLeft: pxToDp(100) }, swiperFlatListIndex === 0 && { opacity: 0.3 }]}>
                                <View style={[styles.halfCircle, styles.rightHalf, Platform.OS === 'ios' && {
                                    borderWidth: 1, borderColor: 'white'
                                }]} >
                                    <Image
                                        style={[size_tool(150), styles.last_btn]}
                                        source={require("../../../../images/chineseHomepage/pingyin/new/last.png")}
                                    />
                                </View>
                                {/* <LeftHalfCircle size={size} color="#FF5722" /> */}
                            </TouchableOpacity>

                            <SwiperFlatList onClickItem={(num, item) => { this.clickItem(num, item) }} setIndex={(index) => { this.setIndex(index) }} index={swiperFlatListIndex} onRef={(ref) => {
                                this.swiperFlatListRef = ref;
                            }} questions={list} />

                            <TouchableOpacity
                                style={swiperFlatListIndex === list.length - 1 && { opacity: 0.3 }}
                                disabled={swiperFlatListIndex === list.length - 1}
                                onPress={this.next_btn}>
                                <View style={[styles.halfCircle, styles.leftHtHalf, Platform.OS === 'ios' && {
                                    borderWidth: 1, borderColor: 'white'
                                }]} >
                                    <Image
                                        style={[size_tool(150), styles.next_btn]}
                                        source={require("../../../../images/chineseHomepage/pingyin/new/last.png")}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }


                </ImageBackground>

                <View
                    style={[

                        appStyle.flexTopLine,
                        appStyle.flexJusBetween,
                        appStyle.flexAliCenter,
                        { with: '100%', height: pxToDp(120), zIndex: 2, elevation: 2 },
                        padding_tool(0, 40, 0, 40),
                    ]}
                >
                    <View style={[{ width: pxToDp(360) }]}>
                        <TouchableOpacity onPress={this.goBack} style={[]}>
                            <Image
                                source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                                style={[size_tool(120, 80)]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.unitContent]}>
                        {
                            skillType === 0 ? <ScrollView horizontal={true} contentContainerStyle={[styles.unitWrap]}>
                                {studyUnitList.map((item, index) => {
                                    return <TouchableOpacity hitSlop={{ top: pxToDp(10), bottom: pxToDp(10), left: pxToDp(10), right: pxToDp(10) }} style={[styles.unitBtn, studyUnitIndex === index ? styles.unitActive : null]} onPress={() => { this.clickStudentUnit(item, index) }}>
                                        <Text style={[{ fontSize: pxToDp(28), color: '#FFF' }, appFont.fontFamily_jcyt_700]}>{studyUnitIndex === index ? item.ui_name : item.num}</Text>
                                    </TouchableOpacity>
                                })}
                            </ScrollView> : <ScrollView horizontal={true} contentContainerStyle={[styles.unitWrap]}>
                                {unitList.map((item, index) => {
                                    return <TouchableOpacity hitSlop={{ top: pxToDp(10), bottom: pxToDp(10), left: pxToDp(10), right: pxToDp(10) }} style={[styles.unitBtn, unit_id === item.u_t_id ? styles.unitActive : null]} onPress={() => { this.clickUnit(item, index) }}>
                                        <Text style={[{ fontSize: pxToDp(28), color: '#FFF' }, appFont.fontFamily_jcyt_700]}>{unit_id === item.u_t_id ? item.name : item.num}</Text>
                                    </TouchableOpacity>
                                })}
                            </ScrollView>
                        }

                    </View>
                    <View style={[styles.headRight, appStyle.flexLine]}>
                        {
                            skillType === 1 && summaryList.map((item, index) => {
                                return <TouchableOpacity onPress={() => { this.clickUnit(item, unitIndex) }} key={item.u_t_id} style={[styles.titleItem, { marginRight: pxToDp(40) }, unit_id == item.u_t_id && styles.activeTitleItem,]}>
                                    <Text style={[styles.titleTxt]}>{item.name.toString().substring(0, 2)}</Text>
                                </TouchableOpacity>

                            })
                        }

                    </View>
                </View>

                <View style={styles.left_content}>
                    {
                        skillType === 0 ? <View>

                            <TouchableOpacity onPress={() => { this.onPressSkill(0) }}>
                                <ImageBackground resizeMode="contain" style={styles.active_bg} source={require("../../../../images/MathUnitDiagnosis/skill_active.png")}>
                                    <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>能力诊断</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.onPressSkill(1) }} style={[styles.left_tab, { marginTop: pxToDp(80), paddingLeft: pxToDp(92) }]}>
                                <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>综合测试</Text>
                            </TouchableOpacity>
                            <View style={styles.skill_info_bg}>
                                <View style={styles.skill_info}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: pxToDp(12) }}>
                                        <Image style={styles.user_img} source={{ uri: url.baseURL + avatar }} />
                                        <View>
                                            <Text numberOfLines={1} style={[{ fontSize: pxToDp(28), color: '#283139', top: pxToDp(4) }, appFont.fontFamily_jcyt_700]}>{username}</Text>
                                            <Text
                                                style={[
                                                    { fontSize: pxToDp(24), color: "#283139", top: Platform.OS === 'ios' ? 0 : pxToDp(-4) },
                                                    appFont.fontFamily_jcyt_700,
                                                    Platform.OS === 'ios' && { marginTop: pxToDp(20) }]}
                                            >
                                                {grade}{term.toString().substring(0, 1)}<Text style={[{ fontSize: pxToDp(16), color: 'gray' }, appFont.fontFamily_jcyt_500,]}>({textbookname})</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.skill_grade}>
                                        <Text style={[{ fontSize: pxToDp(16), color: 'gray' }, appFont.fontFamily_jcyt_500,]}>当前能力等级</Text>
                                        {this.skill_grade(abilityData && abilityData?.level)}
                                    </View>


                                </View>
                                <TouchableOpacity onPress={() => {
                                    Toast.loading('加载中,请稍后...')
                                    setTimeout(() => {
                                        Toast.hide()
                                        this.setState({ showStackedLine: !this.state.showStackedLine })
                                    }, 100)

                                }} style={styles.skill_all_btn}>
                                    <ImageBackground resizeMode="cover" style={styles.skill_all} source={require('../../../../images/MathUnitDiagnosis/skill_all.png')}>
                                        <Image style={styles.skil_pie} source={require('../../../../images/MathUnitDiagnosis/skil_pie.png')} />
                                        <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>统计</Text>
                                        <View style={styles.red_cicle} />
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>


                        </View> : <View>

                            <TouchableOpacity style={{ paddingLeft: pxToDp(92) }} onPress={() => { this.onPressSkill(0) }}>
                                <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>能力诊断</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.onPressSkill(1) }} style={[styles.left_tab, { marginTop: pxToDp(80) }]}>
                                <ImageBackground resizeMode="contain" style={[styles.active_bg,]} source={require("../../../../images/MathUnitDiagnosis/content_active.png")}>
                                    <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>综合测试</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    }

                </View>

                <Rule
                    show={showRule}
                    close={() => {
                        this.setState({ showRule: false });
                    }}
                />

                <StackedLine show={showStackedLine}
                    imageBase64={this.state.imageBase64}
                    data={this.state.TONGJI}
                    image={this.state.abilityZImage}
                    close={() => {
                        this.setState({ showStackedLine: false });
                    }} />




            </ImageBackground >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    unitWrap: {
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        // height: pxToDp(106),
        // paddingBottom: pxToDp(6),
        // borderRadius: pxToDp(40),
    },
    unitInnder: {
        borderRadius: pxToDp(40),
        flex: 1,
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
    },
    unitName: {
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
        color: "#2D3040",
        lineHeight: pxToDp(40),
        width: "100%",
    },
    unitNum: {
        fontSize: pxToDp(24),
        color: "#2D3040",
        ...appFont.fontFamily_jcyt_500,
        opacity: 0.5,
        lineHeight: pxToDp(30),
    },
    txt1: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(32),
        color: "#2D3040",
    },
    txt2: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(36),
        color: "#2D3040",
        marginLeft: pxToDp(20),
        marginRight: pxToDp(10),
    },
    txt3: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(24),
        color: "#96979F",
    },
    titleItem: {
        flexDirection: "row",
        alignItems: "center",
        width: pxToDp(108),
        height: pxToDp(108),
        borderRadius: pxToDp(108),
        backgroundColor: '#4C4C59',
        justifyContent: "center",
    },
    activeTitleItem: {
        backgroundColor: '#FF935E'
    },
    titleImage: {
        width: pxToDp(108),
        height: pxToDp(108),
        borderRadius: pxToDp(108),
        backgroundColor: '#4C4C59',
        // borderRadius: pxToDp(54),
    },
    titleTxt: {
        color: "white",
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_700,
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(-20),
        right: pxToDp(8),
        zIndex: 99,
    },
    selectNav: {
        width: '100%',
        height: pxToDp(90),
        backgroundColor: "#DCC7F6",
        borderRadius: pxToDp(40),
        marginBottom: pxToDp(6)
    },
    navBtn: {
        width: pxToDp(196),
        height: pxToDp(68),
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter
    },
    navBtntxt: {
        color: '#2D3040',
        fontSize: pxToDp(30),
        ...appFont.fontFamily_jcyt_500
    },
    zimuItem: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(20),
    },
    mask_group: {
        position: "absolute",
        top: 0,
        left: pxToDp(154 * 2),
        width: pxToDp(1740),
        height: '100%',
        // ...Platform.select({
        //     android: {

        //         height: pxToDp(1098),
        //         // marginTop: pxToDp(100)
        //     },
        //     ios: {
        //         // height: pxToDp(540 * 2),
        //         // marginTop: pxToDp(120)
        //     },

        // }),
        // width: pxToDp(870 * 2),
        // height: pxToDp(549 * 2),
        // marginLeft: pxToDp(154 * 2),
        elevation: 1,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: pxToDp(150),
        paddingLeft: pxToDp(58)
        // marginTop: pxToDp(80)
    },
    unitContent: {
        width: pxToDp(600 * 2),
        height: pxToDp(67 * 2),
        borderBottomLeftRadius: pxToDp(80),
        borderBottomRightRadius: pxToDp(80),
        backgroundColor: "#4C4C59",
        overflow: "hidden",
    },
    unitBtn: {
        // textAlign: 'center'
        // height: pxToDp(80),
        // paddingLeft: pxToDp(37),
        // paddingRight: pxToDp(37),
        // ...appStyle.flexCenter,
        // backgroundColor: '#D4D4D4',
        // borderWidth: pxToDp(4),
        // borderColor: "#fff",
        // borderRadius: pxToDp(12),
        // marginRight: pxToDp(32)
    },
    unitActive: {
        // width: pxToDp(170 * 2),
        height: pxToDp(80),
        backgroundColor: "#FF935E",
        borderRadius: pxToDp(160),
        ...appStyle.flexCenter,
        paddingHorizontal: pxToDp(40)
    },
    left_content: {
        marginTop: Platform.OS === 'ios' ? pxToDp(200) : pxToDp(116)

    },
    left_tab_content: {
        // ...appStyle.flexCenter,
        width: pxToDp(317 * 2),
        height: pxToDp(160),
        // backgroundColor: "#0A7360",
        borderRadius: pxToDp(160),
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        marginLeft: pxToDp(40)
    },
    left_tab: {
        // paddingLeft: pxToDp(46 * 2),
        // // ...appStyle.flexCenter,
        // width: pxToDp(317 * 2),
        // height: pxToDp(160),

    },
    active_bg: {
        marginLeft: pxToDp(40),
        justifyContent: 'center',
        paddingLeft: pxToDp(52),
        width: pxToDp(317 * 2),
        height: pxToDp(160),
        // zIndex: 1,
        // elevation: 1
    },
    swiperCon: {
        zIndex: 3,
        elevation: 3,
        // flex: 1,
        position: 'absolute',
        // left: pxToDp(432 * 2),
        // top: pxToDp(118 * 2)
    },
    wrapper: {
        // ...Platform.select({
        //     android: {
        //         width: pxToDp(800),
        //         height: pxToDp(359 * 2),
        //     },
        //     ios: {
        //         width: pxToDp(480 * 2),
        //         height: pxToDp(460 * 2),
        //     }
        // })
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    skill_content: {

        backgroundColor: 'white',
        borderRadius: pxToDp(60 * 2),
        // marginTop: Platform.OS === "ios"?pxToDp(16):,
        // marginHorizontal: pxToDp(16),
        ...Platform.select({
            android: {
                width: pxToDp(640 * 2),
                height: pxToDp(342 * 2),
                marginTop: pxToDp(16)
            },
            ios: {
                width: pxToDp(580 * 2),
                height: pxToDp(392 * 2),
                marginTop: pxToDp(20)
            }
        })
    },
    line_text: {
        // position: 'absolute',
        // bottom: 0,
        fontSize: pxToDp(24),
        color: '#4C4C59',
        // textAlign: 'center',
        // marginTop: pxToDp(126),
        // marginBottom: pxToDp(16)
    },
    border_active: {
        borderWidth: pxToDp(4),
        borderColor: "#FF935E",

    },
    line_press_con: {
        height: pxToDp(196 * 2),
        padding: pxToDp(4),
        borderRadius: pxToDp(158 * 2),
        // width: pxToDp(48 + 2),
        // height: pxToDp(188 * 2 + 2),
        // borderWidth: pxToDp(10),
        // borderColor: "#109A81",
        marginBottom: pxToDp(40),
    },
    line_press: {
        width: pxToDp(48),
        height: pxToDp(188 * 2),
        backgroundColor: "#0A7360",
        borderRadius: pxToDp(158 * 2),
        // marginTop: pxToDp(40),
        marginBottom: pxToDp(20),
        ...appStyle.flexCenter,
        position: "relative",
        overflow: "hidden",
        // padding: pxToDp(4),
        // borderWidth: pxToDp(8),
        // borderColor: "#109A81",
    },
    skill_tip: {
        width: pxToDp(125 * 2),
        height: pxToDp(27 * 2),
        backgroundColor: '#4c4c59',
        borderRadius: pxToDp(200),
        position: 'absolute',
        top: pxToDp(-80),
        left: pxToDp(-96),
        zIndex: 10,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    line_bar: {
        width: "100%",
        backgroundColor: "#FFAE64",
        position: "absolute",
        bottom: 0,
        zIndex: -1,
        elevation: -1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    skill_left: {
        width: pxToDp(360 * 2),
        height: pxToDp(272 * 2),
        backgroundColor: '#F7F7FC',
        borderRadius: pxToDp(80),
        marginLeft: Platform.OS === 'ios' ? 0 : pxToDp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    skill_right: {
        marginLeft: pxToDp(120)
    },
    rule_skill_con: {
        width: pxToDp(120),
        height: pxToDp(26 * 2),
        backgroundColor: '#F0F0FA',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: pxToDp(200),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        elevation: 1,
        top: pxToDp(24),
        right: pxToDp(34 * 2)

    },
    rule_skill: {
        width: pxToDp(28),
        height: pxToDp(28),
        marginRight: pxToDp(4),
        top: pxToDp(-2)
    },
    skill_item_bg: {
        alignItems: 'center',
        width: pxToDp(658 * 2),


        ...Platform.select({
            android: {
                height: pxToDp(430 * 2),
                marginLeft: pxToDp(120),
                // marginTop: pxToDp(100)
            },
            ios: {
                // height: pxToDp(520 * 2),
                height: pxToDp(500 * 2),
                marginLeft: pxToDp(150),
                // marginTop: pxToDp(120)
            }
        })
    },
    content_item_bg: {
        alignItems: 'center',
        ...Platform.select({
            android: {
                width: pxToDp(800),
                height: '100%',
                marginTop: pxToDp(100)
            },
            ios: {
                width: pxToDp(480 * 2),
                height: '100%',
                marginTop: pxToDp(120)
            }
        })
    },
    unitTitle: {
        color: 'white',
        fontSize: pxToDp(32),
        ...appFont.fontFamily_jcyt_500,
        textAlign: 'center',
        marginTop: pxToDp(32)
    },
    cicleConPare: {
        width: pxToDp(158 * 2),
        height: pxToDp(158 * 2),
        borderRadius: pxToDp(158 * 2),
        backgroundColor: '#4C4C59',
        borderWidth: pxToDp(8),
        borderColor: '#8B8BA2',
        marginTop: pxToDp(24),
    },
    cicleCon: {
        width: '100%',
        height: '100%',

        ...appStyle.flexCenter,
    },
    rate_con: {
        flexDirection: 'row'
    },
    score_flex: {
        ...appStyle.flexCenter,
        // marginLeft: pxToDp(34)
    },
    score: {
        fontWeight: 'bold',
        // ...appFont.fontFamily_jcyt_700,
        color: 'white',
        fontSize: pxToDp(48),
    },
    score_name: {
        ...appFont.fontFamily_jcyt_500,
        color: 'white',
        fontSize: pxToDp(24),
    },
    content_start: {
        ...appStyle.flexCenter,
        width: pxToDp(146 * 2),
        height: pxToDp(56 * 2),
        marginTop: Platform.OS === 'ios' ? pxToDp(44) : pxToDp(24)
    },
    content_record: {
        ...appStyle.flexCenter,
        width: pxToDp(72 * 2),
        height: pxToDp(80),
        marginTop: pxToDp(24),

    },
    content: {
        marginTop: pxToDp(130),

    },
    halfCircle: {
        width: RADIUS * 2,
        height: RADIUS,
        backgroundColor: '#FFAE64',
        ...appStyle.flexCenter,
    },
    rightHalf: {
        transform: [{ rotate: '90deg' }],
        borderTopLeftRadius: RADIUS,
        borderTopRightRadius: RADIUS,
    },
    leftHtHalf: {
        transform: [{ rotate: '270deg' }],
        borderTopLeftRadius: RADIUS,
        borderTopRightRadius: RADIUS,
    },
    next_btn: {
        transform: [{ rotate: '270deg' }],
        marginTop: pxToDp(20)
    },
    last_btn: {
        transform: [{ rotate: '270deg' }],
        marginTop: pxToDp(20),
    },
    skill_info: {
        width: pxToDp(320),
        height: pxToDp(126 * 2),
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: pxToDp(40),
        // marginTop: pxToDp(200),
        // marginLeft: pxToDp(40)
    },
    user_img: {
        width: pxToDp(90),
        height: pxToDp(90),
        borderRadius: pxToDp(90),
        borderColor: 'gray',
        borderWidth: pxToDp(4),
        marginLeft: pxToDp(20),
        marginRight: pxToDp(6)
    },
    skill_all_btn: {
        width: pxToDp(320),
        height: pxToDp(128),
        marginTop: pxToDp(20)
    },
    skill_all: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    red_cicle: {
        width: pxToDp(20),
        height: pxToDp(20),
        borderRadius: pxToDp(20),
        backgroundColor: 'red',
        position: 'absolute',
        right: 0,
        top: 0
    },
    skil_pie: {
        width: pxToDp(48),
        height: pxToDp(48),
        marginLeft: pxToDp(38 * 2),
        marginRight: pxToDp(20)
    },
    skill_info_bg: {
        marginLeft: pxToDp(40),
        justifyContent: 'center',
        ...Platform.select({
            android: {
                marginTop: pxToDp(120)
            },
            ios: {
                marginTop: pxToDp(120)
            }
        })
    },
    xing_con: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pxToDp(10)
    },
    grade_img: {
        width: pxToDp(44),
        height: pxToDp(44),
        marginRight: pxToDp(10)
    },
    skill_grade: {
        marginLeft: pxToDp(34),
        marginTop: pxToDp(24)
    }, statistic_wrap: {
        width: pxToDp(158 * 2),
        height: pxToDp(158 * 2),
        backgroundColor: "#0A7360",
        borderRadius: pxToDp(158 * 2),
        marginTop: pxToDp(20),
        marginBottom: pxToDp(24),
        ...appStyle.flexCenter,
        position: "relative",
        overflow: "hidden",
        borderWidth: pxToDp(10),
        borderColor: "#109A81",
    },
    bar: {
        width: "100%",
        backgroundColor: "#FFAE64",
        position: "absolute",
        bottom: 0,
        zIndex: -1,
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: 'transparent',
        borderRightWidth: pxToDp(16),
        borderRightColor: 'transparent',
        borderTopWidth: pxToDp(20),
        borderTopColor: '#4c4c59',
        position: 'absolute',
        bottom: pxToDp(-10),
        // right: '50%'
    },
    // unitWrap: {
    //     ...appStyle.flexCenter
    // },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
        authority: state.getIn(["userInfo", "selestModuleAuthority"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
    };
};


export default connect(mapStateToProps, mapDispathToProps)(HomePage);
