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
    Dimensions
} from "react-native"
import { pxToDp } from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import * as actionCreators from "../../../../action/math/bagProgram/index";
import Stem from './components/Stem'
import TextView from '../../../../component/math/FractionalRendering/TextView_new'
import BackBtn from "../../../../component/math/BackBtn"


class Resolving extends PureComponent {
    constructor() {
        super()
        this.state = {
            step_index: 0
        }
    }

    goBack = () => {
        MathNavigationUtil.goBack(this.props);
    }

    componentDidMount() {
        const { topic_data } = this.props
        let topic = topic_data.toJS()
        const { stars } = topic
        let len = stars.reduce((c, i) => {
            i ? c++ : null
            return c
        }, 0)
        if (len > 0) {
            this.setState({
                step_index: 1
            })
        }
        console.log('当前题目_______', topic)
        axios.get(api.getProgramOriginTopicCode, { params: { s_id: topic.id } }).then(res => {
            this.props.setTopicData({ ...topic, ...res.data.data })
        })
    }

    render() {
        const { topic_data } = this.props
        const { step_index } = this.state
        const { analysis, code_analysis, data_type } = topic_data.toJS()
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack}></BackBtn>
                </View>
                <View style={[styles.content]}>
                    {step_index === 0 ? <View style={[styles.content_1]}>
                        <View style={[{ marginTop: pxToDp(-120) }]}>
                            <Stem data={topic_data.toJS()}></Stem>
                        </View>
                        <TouchableOpacity style={[styles.btn_1]} onPress={() => {
                            this.setState({
                                step_index: 1
                            })
                        }}>
                            <View style={[styles.btn_1_inner]}>
                                <Text style={[{ color: "#2D2D40", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>问题分析</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : <View style={{ flex: 1 }}>
                        <View style={[{ paddingLeft: pxToDp(340), paddingRight: pxToDp(340) }]}>
                            <Stem data={topic_data.toJS()}></Stem>
                        </View>
                        <ScrollView style={{ marginTop: pxToDp(40), paddingLeft: pxToDp(136) }} contentContainerStyle={{ paddingRight: pxToDp(340), paddingBottom: pxToDp(100) }}>
                            <View style={[appStyle.flexTopLine]}>
                                <Image style={[{ width: pxToDp(204), height: pxToDp(160) }]} source={require('../../../../images/mathProgramming/xm_talk.png')}></Image>
                                <View style={[styles.wrap]}>
                                    <Text style={[{ color: "#2D2D40", fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700, Platform.OS === 'ios' ? { marginBottom: pxToDp(20) } : null]}>数学解析：</Text>
                                    {data_type === 1 ? <TextView value={analysis} txt_style={[{ color: "#2D2D40", ...appFont.fontFamily_jcyt_500, fontSize: pxToDp(48) }]} fraction_border_style={[{ borderBottomColor: '#2D2D40' }]}></TextView>
                                        : <RichShowViewHtml value={analysis} size={48} color={'#2D2D40'} p_style={Platform.OS === 'android' ? { lineHeight: pxToDp(70) } : {}}></RichShowViewHtml>}
                                </View>
                            </View>
                            {code_analysis ? <View style={[appStyle.flexTopLine, { marginTop: pxToDp(40) }]}>
                                <Image style={[{ width: pxToDp(204), height: pxToDp(160) }]} source={require('../../../../images/mathProgramming/xm_talk.png')}></Image>
                                <View style={[styles.wrap]}>
                                    <Text style={[{ color: "#2D2D40", fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_700, Platform.OS === 'ios' ? { marginBottom: pxToDp(20) } : null]}>编程解析：</Text>
                                    <Text style={[{ color: "#2D2D40", fontSize: pxToDp(48) }, appFont.fontFamily_jcyt_500]}>{code_analysis}</Text>
                                </View>
                            </View> : null}
                        </ScrollView>
                        <TouchableOpacity style={[styles.btn_2]} onPress={() => {
                            if (!topic_data.toJS().code) {
                                Toast.info('该题目暂无编程数据', 1.5)
                                return
                            }
                            MathNavigationUtil.toMathProgramStudy({ ...this.props })
                        }}>
                            <View style={[styles.btn_2_inner]}>
                                <Text style={[{ color: "#2D2D40", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>编程</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}

                </View>
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
        height: pxToDp(120),
    },
    badge_btn: {
        position: "absolute",
        right: pxToDp(20),
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    content: {
        flex: 1,
    },
    btn_1: {
        width: pxToDp(280),
        height: pxToDp(128),
        borderRadius: pxToDp(40),
        backgroundColor: "#FFB649",
        paddingBottom: pxToDp(8),
        marginTop: pxToDp(80)
    },
    btn_1_inner: {
        flex: 1,
        borderRadius: pxToDp(40),
        backgroundColor: "#FFDB5D",
        ...appStyle.flexCenter
    },
    content_1: {
        flex: 1,
        ...appStyle.flexCenter,
        paddingLeft: pxToDp(120),
        paddingRight: pxToDp(120)
    },
    wrap: {
        padding: pxToDp(40),
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        flex: 1,
    },
    btn_2: {
        width: pxToDp(200),
        height: pxToDp(200),
        borderRadius: pxToDp(100),
        backgroundColor: "#FFB649",
        paddingBottom: pxToDp(8),
        position: "absolute",
        right: pxToDp(80),
        bottom: pxToDp(80)
    },
    btn_2_inner: {
        flex: 1,
        backgroundColor: "#FFDB5D",
        borderRadius: pxToDp(100),
        ...appStyle.flexCenter
    }
})

const mapStateToProps = (state) => {
    return {
        topic_data: state.getIn(["bagMathProgram", "topic_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setTopicData(data) {
            dispatch(actionCreators.setTopicData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(Resolving)
