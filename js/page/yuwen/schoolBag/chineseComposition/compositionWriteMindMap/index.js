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
import { pxToDp, padding_tool, size_tool, borderRadius_tool } from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import ChineseMindMapping from '../../../../../component/chinese/ChineseMindMapping'
import MsgModal from "../../../../../component/chinese/chineseCompositionExercise/msg";
import TitleCenter from '../../../../../component/chinese/chineseCompositionExercise/homeModal'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GoldMsgModal from '../../../../../component/chinese/sentence/msgModal'

class ChineseSchoolHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            minmaplist: {},
            st_id: 0,
            isFinish: false,
            msgVisible: false,
            myCheck: {},
            islookmap: this.props.navigation.state.params.data.islookmap,
            isModel: this.props.navigation.state.params.data.isModel,
            showTitle: false,
            show_gold: '',
            lookMsg: false,
        };
    }

    static navigationOptions = {
        // title:'答题'
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
        // this.props.navigation.goBack(this.props.navigation.state.params.data.homeKey)
    };


    componentDidMount() {
        // this.getlist()
        const { islookmap, isModel } = this.state
        console.log('是否查看===', this.props.navigation.state.params.data)
        islookmap ?
            isModel ?
                this.getModelNow(this.props.navigation.state.params.data.st_id) :
                this.getlistNow(this.props.navigation.state.params.data.st_id) :
            isModel ?
                this.getModel()
                :
                this.getlist()
    }
    getModel = () => {
        let obj = this.props.navigation.state.params.data
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        console.log('参数model', {
            article_id: obj.article_id,
            grade_code: userInfoJs.checkGrade,
            inspect_id: userInfoJs.c_id,
            ar_map_id: obj.ar_map_id
        })
        axios.get(api.getChineseCompositionArticleMindMap, {
            params: {
                article_id: obj.article_id,
                grade_code: userInfoJs.checkGrade,
                inspect_id: userInfoJs.c_id,
                ar_map_id: obj.ar_map_id
            }
        }).then((res) => {

            if (res.data?.err_code === 0) {
                let obj = res.data.data.mind_maps
                let isfinish = true
                for (let i in obj) {
                    if (obj[i].children.length === 0 && obj[i].state.length === 0) {
                        isfinish = false
                    }
                }
                console.log('返回数据1111111', isfinish)

                this.setState({
                    minmaplist: res.data.data.mind_maps,
                    st_id: res.data.data.st_id,
                    isFinish: isfinish,
                    show_gold: '2'
                })
            }
        });
    }
    getModelNow = (st_id) => {
        let obj = this.props.navigation.state.params.data
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        console.log('参数', {
            article_id: obj.article_id,
            // grade_code: userInfoJs.checkGrade,
            // inspect_id: userInfoJs.c_id,
            // ar_map_id: obj.ar_map_id,
            st_id
        })
        axios.get(api.getChineseCompositionArticleMindMapNow, {
            params: {
                article_id: obj.article_id,
                // grade_code: userInfoJs.checkGrade,
                // inspect_id: userInfoJs.c_id,
                // ar_map_id: obj.ar_map_id,
                st_id,

            }
        }).then((res) => {
            console.log('返回数据2222', res.data.data)

            if (res.data?.err_code === 0) {
                let obj = res.data.data.mind_maps
                let isfinish = true
                for (let i in obj) {
                    if (obj[i].children.length === 0 && obj[i].state.length === 0) {
                        isfinish = false
                    }
                }

                this.setState({
                    minmaplist: res.data.data.mind_maps,
                    st_id: res.data.data.st_id,
                    isFinish: isfinish,
                    show_gold: res.data.data.show_gold
                }, () => {
                    let show_gold = res.data.data.show_gold
                    if (show_gold === '0') {
                        this.setState({
                            lookMsg: true
                        })
                        return
                    }
                })
            }
        });
    }

    getlist() {
        axios.get(api.svechineseCompositionArticleStructure, { params: { ...this.props.navigation.state.params.data } }).then((res) => {
            if (res.data?.err_code === 0) {

                this.setState({
                    minmaplist: res.data.data.mind_maps,
                    st_id: res.data.data.st_id,
                    isFinish: true,
                    myCheck: res.data.data.struct_data,

                })
            }
        });
    }
    getlistNow(st_id) {

        axios.get(api.svechineseCompositionArticleStructureNew, {
            params: {
                ...this.props.navigation.state.params.data,
                st_id,
            }
        }).then((res) => {
            if (res.data?.err_code === 0) {
                let obj = res.data.data.mind_maps

                let isfinish = true
                for (let i in obj) {
                    if (obj[i].children.length === 0 && obj[i].state.length === 0) {
                        isfinish = false
                    }
                }
                console.log('数======', res.data.data)
                // show_gold 是否展示获得金币 0: 没弹过金币， 1：弹过金币 2 未完成
                // let show_gold = res.data.data.show_gold
                // if (show_gold === '0') {
                //     this.setState({
                //         lookMsg: true
                //     })
                //     return
                // }
                this.setState({
                    minmaplist: res.data.data.mind_maps,
                    isFinish: true,
                    st_id,
                    myCheck: res.data.data.struct_data,
                    show_gold: res.data.data.show_gold
                }, () => {
                    let show_gold = res.data.data.show_gold
                    if (show_gold === '0') {
                        this.setState({
                            lookMsg: true
                        })
                        return
                    }
                })
            }
        });
    }
    checkthis = (choice_algebra) => {
        const { minmaplist, st_id, isModel, islookmap } = this.state
        console.log('数据', choice_algebra, minmaplist[choice_algebra])
        if (minmaplist[choice_algebra]?.children.length > 0) return
        console.log('iiiiiiiiiiii',isModel,islookmap)
        isModel ?
            islookmap ?
                NavigationUtil.toChineseCompisitionModelExerciseList({
                    ...this.props,
                    data: {
                        st_id,
                        m_id: choice_algebra,
                        text: minmaplist[choice_algebra].text,
                        ...this.props.navigation.state.params.data,
                        updata: () => {
                            this.getModelNow(this.state.st_id)
                        }
                    }
                })
                :
                NavigationUtil.toChineseCompisitionModelDoExercise({
                    ...this.props,
                    data: {
                        st_id,
                        m_id: choice_algebra,
                        text: minmaplist[choice_algebra].text,
                        ...this.props.navigation.state.params.data,
                        updata: () => {
                            this.getModelNow(this.state.st_id)
                        }
                    }
                })
            :
            NavigationUtil.toCompositionMindMapExplanation({
                ...this.props, data: {
                    ...this.props.navigation.state.params.data,
                    m_id: choice_algebra,
                    st_id,
                    text: minmaplist[choice_algebra].text,
                    updata: () => {
                        this.getlistNow(this.state.st_id)
                    }
                }
            })
    }
    overCreate = () => {
        const { isFinish, st_id, show_gold } = this.state
        // console.log('啊啊啊啊啊啊', isFinish)
        if (this.props.navigation.state.params.data.isModel) {
            if (show_gold === '2') {
                // 提示
                this.setState({
                    msgVisible: true
                })
                return
            }

        }

        NavigationUtil.toCompositionLookMindmap({
            ...this.props,
            data: {
                st_id,
                ...this.props.navigation.state.params.data,
            }
        })
    }
    finishthis = () => {
        const { islookmap, show_gold } = this.state
        islookmap ? this.goBack() :
            this.overCreate()

    }
    render() {
        const { minmaplist, msgVisible, st_id, islookmap, myCheck, showTitle, lookMsg, isModel } = this.state
        return (
            <ImageBackground
                style={styles.wrap}
                source={require('../../../../../images/chineseHomepage/sentence/sentenceBg.png')}
                resizeMode='cover'
            >
                <View style={[appStyle.flexLine, appStyle.flexJusBetween, padding_tool(0, 64, 0, 64), { width: '100%', height: pxToDp(128), marginBottom: pxToDp(60), }]}>
                    {/* header */}
                    <TouchableOpacity onPress={this.goBack}>
                        <Image
                            source={require('../../../../../images/chineseHomepage/pingyin/new/back.png')}
                            style={[size_tool(120, 80)]}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[appStyle.flexTopLine, appStyle.flexAliCenter]} onPress={() => {
                        !isModel ? this.setState({ showTitle: !showTitle }) : ''
                    }} >
                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(40), color: '#475266', marginRight: pxToDp(10), paddingLeft: pxToDp(40) }]}>思维导图</Text>
                        {isModel ? null : <FontAwesome name={showTitle ? 'chevron-up' : 'chevron-down'} size={20} style={{ color: '#B3BBD4' }} />}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={
                        this.finishthis.bind(this)
                    } style={[appStyle.flexCenter, size_tool(144, 78), { borderRadius: pxToDp(200), backgroundColor: '#fff' }]} >
                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#475266' }]}>完成</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingBottom: pxToDp(100) }}>
                    <ScrollView style={{ marginLeft: pxToDp(20), width: '100%', }}>
                        {/* {isFinish ? <ChineseMindMapping mindmapping={minmaplist} _getData={this.checkthis.bind(this)} /> : null} */}
                        <ChineseMindMapping mindmapping={minmaplist} _getData={this.checkthis.bind(this)} />
                    </ScrollView>
                </View>
                {/* <View style={[{ position: 'absolute', bottom: pxToDp(40), left: pxToDp(900) }]}>
                    <TouchableOpacity  style={[size_tool(173, 66), appStyle.flexCenter, { backgroundColor: '#773813', borderRadius: pxToDp(32) }]}>
                        <Text style={[{ fontSize: pxToDp(32), color: '#fff' }, appFont.fontFamily_syst]}>完成创作</Text>
                    </TouchableOpacity>
                </View> */}
                <MsgModal visible={msgVisible} todo={() => {
                    this.setState({
                        msgVisible: false
                    })
                    NavigationUtil.toCompositionLookMindmap({
                        ...this.props,
                        data: {
                            st_id,
                            ...this.props.navigation.state.params.data,
                        }
                    })
                }} cancel={() => {
                    this.setState({
                        msgVisible: false
                    })
                }} />
                {isModel ? null : <TitleCenter myCheck={myCheck} show={showTitle} close={() => this.setState({ showTitle: false })} />}
                < GoldMsgModal btnText='X'
                    todo={() => {
                        this.setState({
                            lookMsg: false
                        })
                        // if (this.props.navigation.state.params.data.isModel) {
                        //     NavigationUtil.toCompositionLookMindmap({
                        //         ...this.props,
                        //         data: {
                        //             st_id,
                        //             ...this.props.navigation.state.params.data,
                        //         }
                        //     })
                        //     return
                        // }
                        // islookmap ? this.goBack() :
                        //     this.overCreate()
                    }} visible={lookMsg}
                    title=''
                    msg={''}
                    isGold={true}
                />
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
        paddingTop: Platform.OS === 'ios' ? pxToDp(40) : 0
    },
    text: {
        fontSize: pxToDp(40),
        color: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2',
        marginBottom: pxToDp(20)
    },
    text1: {
        fontSize: pxToDp(40),
        color: "#FFB211",
        fontWeight: 'bold'
    },
    btn: {
        backgroundColor: '#A86A33',
        borderRadius: pxToDp(16),
        marginRight: pxToDp(24)
    },
    text2: {
        fontSize: pxToDp(28), color: '#fff'
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChineseSchoolHome);
