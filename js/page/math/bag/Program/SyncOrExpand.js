import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    ScrollView,
    ActivityIndicator,
    DeviceEventEmitter
} from "react-native"
import { pxToDp } from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from "antd-mobile-rn";
import CongratulationsModal from './components/CongratulationsModal'
import BadgeModal from './components/BadgeModal'
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/math/bagProgram/index";
import * as actionCreatorsPurchase from "../../../../action/purchase/index";
import AsyncStorage from "@react-native-async-storage/async-storage"
import Stem from './components/Stem'
import BackBtn from "../../../../component/math/BackBtn"

const img_map = {
    0: require('../../../../images/mathProgramming/badge_1_b.png'),
    1: require('../../../../images/mathProgramming/badge_2_b.png'),
    2: require('../../../../images/mathProgramming/badge_3_b.png'),
    3: require('../../../../images/mathProgramming/badge_4_b.png'),
    4: require('../../../../images/mathProgramming/badge_5_b.png'),
    5: require('../../../../images/mathProgramming/badge_6_b.png'),
    6: require('../../../../images/mathProgramming/badge_7.png'),
    7: require('../../../../images/mathProgramming/badge_8.png'),
    8: require('../../../../images/mathProgramming/badge_9.png'),
    9: require('../../../../images/mathProgramming/badge_10.png'),
    10: require('../../../../images/mathProgramming/badge_11.png'),
    11: require('../../../../images/mathProgramming/badge_12.png'),
    12: require('../../../../images/mathProgramming/badge_13.png'),
    13: require('../../../../images/mathProgramming/badge_14.png'),
    14: require('../../../../images/mathProgramming/badge_15.png'),
    15: require('../../../../images/mathProgramming/badge_16.png'),
    16: require('../../../../images/mathProgramming/badge_17.png'),
    17: require('../../../../images/mathProgramming/badge_18.png'),
    18: require('../../../../images/mathProgramming/badge_19.png'),
    19: require('../../../../images/mathProgramming/badge_20.png'),
    20: require('../../../../images/mathProgramming/badge_21.png'),
    21: require('../../../../images/mathProgramming/badge_22.png'),
    22: require('../../../../images/mathProgramming/badge_23.png'),
    23: require('../../../../images/mathProgramming/badge_24.png'),
}


class SyncOrExpand extends PureComponent {
    constructor(props) {
        super()
        this.eventListenerRefreshPage = null
        this.scrollRef = null
        this.state = {
            unit_list: [],
            unit_index: -1,
            badge_visible: false,
            loading_unit: true,
            loading: false,
            topic_map: {},
            total_stars: 0,
            congratulations_visible: false,
            scrollY: 0
        }
    }

    goBack = () => {
        MathNavigationUtil.goBack(this.props);
    }

    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
        AsyncStorage.removeItem('math_program_unit_index')
    }

    componentDidMount() {
        this.getOrigin()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPage",
            (event) => {
                AsyncStorage.getItem('math_program_unit_index', (err, value) => {
                    const { topic_map } = this.state
                    let _t = JSON.parse(JSON.stringify(topic_map))
                    _t[value] = ''
                    this.setState({
                        topic_map: _t
                    }, () => {
                        this.getOrigin()
                    })

                })
            }
        );
    }



    getOrigin = () => {
        const { userInfo, textCode, source } = this.props;
        const userInfoJs = userInfo.toJS();
        let data = {};
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.source = source //1同步 2拓展

        userInfoJs.checkGrade === '01' && source === '1' ?
            axios.get(api.getGradeOneKNow, { params: data }).then(res => {
                let mold = JSON.parse(JSON.stringify(res.data.data))
                console.log('单元', mold)
                let map_index = -1
                let total_stars = 0
                let _l = JSON.parse(JSON.stringify(res.data.data))

                _l.forEach((i, x) => {
                    map_index++
                    if (img_map[map_index]) {
                        i.badge_img = img_map[map_index]
                    } else {
                        i.badge_img = img_map[0]
                        map_index = 0
                    }
                    total_stars = 0
                    i.name = i.unit_name
                })
                let list = JSON.parse(JSON.stringify(_l))
                _l.forEach((data, index) => {
                    list[index] = data.knowledge_list.map((item) => {
                        return {
                            stem: item.knowledge_name,
                            knowledge_code: item.knowledge_code
                        }
                    })
                })

                this.setState({
                    unit_list: _l,
                    total_stars,
                    topic_map: list,
                    loading: false
                }, () => {
                    AsyncStorage.getItem('math_program_unit_index', (err, value) => {
                        let unit_index = 0
                        if (value) {
                            unit_index = parseInt(value)
                        }
                        this.selectUnit({}, unit_index)
                    })
                })

            }).finally(() => {
                this.setState({
                    loading_unit: false
                }, () => {
                    setTimeout(() => {
                        // console.log('******',this.scrollRef,this.state.scrollY)
                        this.scrollRef ? this.scrollRef.scrollTo({ y: this.state.scrollY }) : null
                    }, Platform.OS === 'ios' ? 500 : 1500)
                })
            })
            :
            delete data.textbook
        axios.get(api.getProgramOrigin, { params: data }).then(res => {
            let mold = res.data.data.mold
            // mold = {
            //     name: "第三单元 加与减",
            //     origin: "021103000300"
            // }
            if (mold) {
                // 有恭喜的弹窗
                this.setState({
                    congratulations_visible: true
                })
            }
            if (res.data.data.data.length) {
                let map_index = -1
                let total_stars = 0
                let _l = JSON.parse(JSON.stringify(res.data.data.data))
                _l.forEach((i, x) => {
                    map_index++
                    if (img_map[map_index]) {
                        i.badge_img = img_map[map_index]
                    } else {
                        i.badge_img = img_map[0]
                        map_index = 0
                    }
                    total_stars += i.stars
                })

                this.setState({
                    unit_list: _l,
                    total_stars
                }, () => {
                    AsyncStorage.getItem('math_program_unit_index', (err, value) => {
                        let unit_index = 0
                        if (value) {
                            unit_index = parseInt(value)
                        }
                        this.selectUnit({}, unit_index)
                    })
                })
            } else {
                this.setState({
                    unit_index: -1
                })
            }
        }).finally(() => {
            this.setState({
                loading_unit: false
            }, () => {
                setTimeout(() => {
                    // console.log('******',this.scrollRef,this.state.scrollY)
                    this.scrollRef ? this.scrollRef.scrollTo({ y: this.state.scrollY }) : null
                }, Platform.OS === 'ios' ? 500 : 1500)
            })
        })
    }

    getTopic = () => {
        const { unit_index, unit_list, topic_map } = this.state
        const { origin } = unit_list[unit_index]
        const { userInfo, textCode, source } = this.props;
        const userInfoJs = userInfo.toJS();
        let _t = JSON.parse(JSON.stringify(topic_map))
        if (_t[unit_index]) return
        this.setState({
            loading: true
        })
        if (userInfoJs.checkGrade === '01' && source === '1') {
            return
        } else {
            axios.get(api.getProgramOriginTopic, { params: { origin } }).then(res => {
                let data = res.data.data.data
                data.forEach((i, x) => {
                    if (i.data_type === 1) {
                        // 分数类型题目
                        i.stem ? i.stem = JSON.parse(i.stem) : null
                        i.analysis ? i.analysis = JSON.parse(i.analysis) : null
                    }
                })
                _t[unit_index] = data

                this.setState({
                    topic_map: _t
                })
            }).finally(() => {
                this.setState({
                    loading: false
                })
            })
        }
    }

    selectUnit = async (i, x) => {
        AsyncStorage.setItem('math_program_unit_index', x + '')
        this.setState({
            unit_index: x
        }, () => {
            this.getTopic()
        })
    }

    selectTopic = (i, x) => {
        const { userInfo, source } = this.props;
        const userInfoJs = userInfo.toJS();
        const { unit_index, unit_list, } = this.state
        const { origin } = unit_list[unit_index]
        if (userInfoJs.checkGrade === '01' && source === '1') {
            let obj = {
                knowledge_code: i.knowledge_code,
                knowledge_name: i.stem,
                origin,
                noExercise: true
            }
            console.log('数据', i, x)
            MathNavigationUtil.toKnowledgeGraphExplainPage({ ...this.props, data: { ...obj } })

            return
        }
        this.props.setTopicData(i)
        MathNavigationUtil.toMathProgramResolving({ ...this.props })
    }

    onScrollListener = ({ nativeEvent }) => {
        const contentOffset = nativeEvent.contentOffset
        const { y } = contentOffset
        this.setState({
            scrollY: y
        })
    }

    render() {
        const { unit_list, unit_index, badge_visible, loading, loading_unit, topic_map, total_stars, congratulations_visible, scrollY } = this.state
        const { source } = this.props
        let list = topic_map[unit_index] ? topic_map[unit_index] : []
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack}></BackBtn>
                    <TouchableOpacity style={[styles.badge_btn, Platform.OS === 'ios' ? { top: pxToDp(40) } : null]} onPress={() => {
                        this.setState({
                            badge_visible: true
                        })
                    }}>
                        <Image style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20) }]} source={require('../../../../images/mathProgramming/star_icon_1_active.png')}></Image>
                        <Text style={[{ color: "#FF8C59", fontSize: pxToDp(28) }, appFont.fontFamily_jcyt_500]}>x {total_stars}</Text>
                    </TouchableOpacity>
                    <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(40), color: "#fff" }]}>{source === '1' ? '同步' : '拓展'}编程</Text>
                </View>
                <View style={[styles.content, loading_unit ? appStyle.flexCenter : null]}>
                    {loading_unit ? <ActivityIndicator size="large" color="#4F99FF" /> : <>
                        <View>
                            <ScrollView contentContainerStyle={{ paddingRight: pxToDp(80) }}>
                                {unit_list.map((i, x) => {
                                    return <TouchableOpacity style={[styles.unit_item, unit_index === x ? { backgroundColor: "#FFB649" } : null]} key={x} onPress={() => {
                                        this.setState({
                                            scrollY: 0
                                        }, () => {
                                            setTimeout(() => {
                                                // console.log('******',this.scrollRef,this.state.scrollY)
                                                this.scrollRef ? this.scrollRef.scrollTo({ y: 0 }) : null
                                            }, 500)
                                        })
                                        this.selectUnit(i, x)
                                    }}>
                                        <View style={[styles.unit_item_inner, unit_index === x ? { backgroundColor: "#FFDB5D", borderRadius: pxToDp(40) } : null]}>
                                            <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500, unit_index === x ? { color: "#1F1F26", ...appFont.fontFamily_jcyt_700 } : null]}>{source === '1' ? i.name.substring(0, 4) : i.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                })}
                            </ScrollView>
                        </View>
                        {loading ? <View style={[{ flex: 1 }, appStyle.flexCenter, { marginTop: pxToDp(-120) }]}>
                            <ActivityIndicator size="large" color="#4F99FF" /></View> : <ScrollView contentContainerStyle={{ paddingRight: pxToDp(110) }} onScrollEndDrag={this.onScrollListener} ref={view => this.scrollRef = view}>
                            {list.map((i, x) => {
                                return <TouchableOpacity style={[styles.item]} key={x} onPress={() => {
                                    this.selectTopic(i, x)
                                }}>
                                    <View style={[styles.item_inner, appStyle.flexLine]}>
                                        {i.level && <View style={[styles.level_wrap]}>
                                            <Text style={[{ color: "#1F1F26", fontSize: pxToDp(24) }, appFont.fontFamily_jcyt_500]}>难度{i.level}</Text>
                                        </View>}
                                        <View style={[{ flex: 1, marginRight: pxToDp(40) }]}>
                                            <View style={[appStyle.flexLine, { marginBottom: pxToDp(20) }]}>
                                                {i.stars?.map((ii, xx) => {
                                                    return <Image key={xx} style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20) }]} source={ii ? require('../../../../images/mathProgramming/star_icon_1_active.png') : require('../../../../images/mathProgramming/star_icon_1.png')}></Image>
                                                })}
                                            </View>
                                            <Stem data={i}></Stem>
                                        </View>
                                        <Image style={[{ width: pxToDp(40), height: pxToDp(40) }]} source={require('../../../../images/mathProgramming/right_icon.png')}></Image>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </ScrollView>}
                    </>}
                </View>
                {congratulations_visible ? <CongratulationsModal visible={congratulations_visible} data={unit_list[unit_index]} close={() => {
                    this.setState({
                        congratulations_visible: false
                    })
                }}></CongratulationsModal> : null}
                <BadgeModal list={unit_list} visible={badge_visible} total={total_stars} close={() => {
                    this.setState({
                        badge_visible: false
                    })
                }}></BadgeModal>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        ...appStyle.flexCenter,
        height: Platform.OS === 'android' ? pxToDp(120) : pxToDp(140),
    },
    badge_btn: {
        position: "absolute",
        right: pxToDp(20),
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    content: {
        flex: 1,
        ...appStyle.flexTopLine,
        paddingLeft: pxToDp(110)
    },
    unit_item: {
        height: pxToDp(108),
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(40),
        marginBottom: pxToDp(8)
    },
    unit_item_inner: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter
    },
    item: {
        backgroundColor: "#242433",
        paddingBottom: pxToDp(4),
        marginBottom: pxToDp(20),
        borderRadius: pxToDp(40)
    },
    item_inner: {
        flex: 1,
        backgroundColor: '#2D2D40',
        padding: pxToDp(40),
        borderRadius: pxToDp(40)
    },
    level_wrap: {
        position: "absolute",
        top: 0,
        right: pxToDp(120),
        width: pxToDp(140),
        height: pxToDp(48),
        borderBottomLeftRadius: pxToDp(20),
        borderBottomRightRadius: pxToDp(20),
        ...appStyle.flexCenter,
        backgroundColor: "#64648B"
    }
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
        source: state.getIn(["bagMathProgram", "source"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setTopicData(data) {
            dispatch(actionCreators.setTopicData(data));
        },
        setVisible(data) {
            dispatch(actionCreatorsPurchase.setVisible(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SyncOrExpand)
