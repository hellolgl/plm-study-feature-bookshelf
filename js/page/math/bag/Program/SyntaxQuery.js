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
    Modal
} from "react-native"
import { pxToDp } from "../../../../util/tools"
import { appFont, appStyle } from "../../../../theme"
import MathNavigationUtil from "../../../../navigator/NavigationMathUtil"
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import { Toast } from "antd-mobile-rn";
import RichShowViewHtml from '../../../../component/math/RichShowViewHtml'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { qtcreatorDark } from 'react-syntax-highlighter/styles/hljs'
import RunningResultsModal from './components/RunningResultsModal'
import BackBtn from "../../../../component/math/BackBtn"
import VideoPlayer from "../EasyCalculation/VideoPlayer";

class SyntaxQuery extends PureComponent {
    constructor() {
        super()
        this.state = {
            list: [],
            loading: true,
            list_index: -1,
            points: {},
            points_index: -1,
            detail: {},
            visible: false,
            run_code: {},
            videoVisible: false
        }
    }

    goBack = () => {
        MathNavigationUtil.goBack(this.props);
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        axios.get(api.getProgramRouter).then(res => {
            if (res.data.data.length) {
                this.setState({
                    list_index: 0,
                    list: res.data.data
                }, () => {
                    this.getPoint()
                })
            } else {
                this.setState({
                    list_index: -1,
                    list: []
                })
            }
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    getPoint = () => {
        const { list_index, list, points } = this.state
        const { id } = list[list_index]
        if (points[list_index]) return
        axios.get(api.getProgramPointIndex, { params: { id } }).then(res => {
            let _p = JSON.parse(JSON.stringify(points))
            if (res.data.data.length) {
                _p[list_index] = res.data.data
                this.setState({
                    points: _p,
                    points_index: 0
                }, () => {
                    this.getPointDetail()
                })
            } else {
                _p[list_index] = []
                this.setState({
                    points_index: -1,
                    points: _p
                })
            }
        })
    }

    getPointDetail = () => {
        const { points_index, points, list_index } = this.state
        let _p = JSON.parse(JSON.stringify(points))
        if (_p[list_index][points_index].detail) return
        const { id } = points[list_index][points_index]
        axios.get(api.getProgramPointDetail, { params: { id } }).then(res => {
            _p[list_index][points_index].detail = res.data.data
            this.setState({
                points: _p
            })
        })
    }

    selectRouter = (i, x) => {
        this.setState({
            list_index: x,
            points_index: 0
        }, () => {
            this.getPoint()
        })
    }

    selectPoint = (i, x) => {
        this.setState({
            points_index: x
        }, () => {
            this.getPointDetail()
        })
    }

    runCode = () => {
        const { points, list_index, points_index, run_code } = this.state
        let _r = JSON.parse(JSON.stringify(run_code))
        if (_r[`${list_index}${points_index}`]) {
            this.setState({
                visible: true
            })
            return
        }
        let code = points[list_index][points_index].detail.example
        axios.post(api.runProgramCode, { code }).then(res => {
            let data = res.data.data
            // console.log(';;;;;',data.substring(0,data.length - 1))
            _r[`${list_index}${points_index}`] = data.substring(0, data.length - 1)
            this.setState({
                run_code: _r,
                visible: true
            })
        })
    }

    render() {
        const { loading, list, list_index, points, points_index, visible, run_code, videoVisible } = this.state
        let detail = {}
        let result = ''
        if (points[list_index] && points_index > -1) detail = points[list_index][points_index].detail
        if (list_index > -1 && points_index > -1) result = run_code[`${list_index}${points_index}`]
        return (
            <ImageBackground style={[styles.container]} source={require('../../../../images/mathProgramming/bg_1.png')}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack}></BackBtn>
                    <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(40), color: "#fff" }, Platform.OS === 'ios' ? { marginTop: pxToDp(40) } : null]}>Python语法查询</Text>
                </View>
                <View style={[styles.content, loading ? appStyle.flexCenter : null]}>
                    {loading ? <ActivityIndicator size="large" color="#4F99FF" /> : list.length ? <>
                        <ScrollView style={[styles.left]}>
                            {list.map((i, x) => {
                                return <TouchableOpacity style={[styles.item, list_index === x ? { backgroundColor: "#FFB649" } : null]} key={x} onPress={() => {
                                    this.selectRouter(i, x)
                                }}>
                                    <View style={[styles.item_inner, list_index === x ? { backgroundColor: '#FFDB5D' } : null]}>
                                        <Text style={[{ color: '#fff', fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500, list_index === x ? { color: "#1F1F26", ...appFont.fontFamily_jcyt_700 } : null]}>{i.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </ScrollView>
                        <View style={[styles.right]}>
                            <ScrollView style={[styles.right_content]} contentContainerStyle={{ padding: pxToDp(40) }}>
                                <View style={[appStyle.flexLine, appStyle.flexLineWrap, { marginBottom: pxToDp(40) }]}>
                                    {points[list_index] ? points[list_index].map((i, x) => {
                                        return <TouchableOpacity style={[styles.point_item, points_index === x ? { backgroundColor: "#FFDB5D" } : null]} key={x} onPress={() => {
                                            this.selectPoint(i, x)
                                        }}>
                                            <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700, points_index === x ? { color: '#2D2D40' } : null]}>{i.syntax}</Text>
                                        </TouchableOpacity>
                                    }) : null}
                                </View>
                                {detail && Object.keys(detail).length ? <View>
                                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { marginBottom: pxToDp(20) }]}>
                                        {/* <View style={[{width:pxToDp(760),height:pxToDp(360),backgroundColor:"red"}]}></View>  //动画 */}
                                        {detail.video ? <TouchableOpacity style={[styles.videoBtn]} onPress={() => {
                                            this.setState({
                                                videoVisible: true
                                            })
                                        }}>
                                            <View style={[styles.videoBtn_inner]}>
                                                <Image style={[{ width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20) }]} resizeMode='contain' source={require('../../../../images/mathProgramming/play_icon.png')}></Image>
                                                <Text style={[{ color: "#fff", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>讲解视频</Text>
                                            </View>
                                        </TouchableOpacity> : null}
                                    </View>
                                    <RichShowViewHtml value={detail.analysis} size={36} color={'#fff'} haveStyle={true} p_style={{ lineHeight: pxToDp(60) }} span_style={{ lineHeight: pxToDp(60) }}></RichShowViewHtml>
                                    <View style={[{ backgroundColor: "#000000", padding: pxToDp(20), borderRadius: pxToDp(40), marginTop: pxToDp(20), marginBottom: pxToDp(20) }, appStyle.flexTopLine, appStyle.flexAliEnd]}>
                                        <SyntaxHighlighter fontSize={Platform.OS === 'android' ? pxToDp(26) : pxToDp(36)} language="python" highlighter={'hljs'} style={qtcreatorDark}>
                                            {detail.example}
                                        </SyntaxHighlighter>
                                        <TouchableOpacity style={[styles.runBtn]} onPress={this.runCode}>
                                            <View style={[styles.runBtn_inner]}>
                                                <Text style={[{ color: "#2D2D40", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>运行</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <RichShowViewHtml value={detail.note} size={36} color={'#fff'} haveStyle={true} p_style={{ lineHeight: pxToDp(60) }} span_style={{ lineHeight: pxToDp(60) }}></RichShowViewHtml>
                                </View> : null}
                            </ScrollView>
                        </View>
                    </> : <Text style={[{ color: "#fff", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_500]}>暂无数据</Text>}
                </View>
                <RunningResultsModal visible={visible} data={result} close={() => {
                    this.setState({
                        visible: false
                    })
                }}></RunningResultsModal>
                <Modal supportedOrientations={["portrait", "landscape"]} visible={videoVisible}>
                    <VideoPlayer
                        hideVideoShow={() => {
                            this.setState({
                                videoVisible: false
                            })
                        }}
                        fileUrl={detail ? detail.video : ''}
                    />
                </Modal>
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
    content: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        ...appStyle.flexTopLine
    },
    left: {
        flexGrow: 0,
        marginRight: pxToDp(40)
    },
    right: {
        flex: 1,
        paddingBottom: pxToDp(40)
        // backgroundColor:"red"
    },
    right_content: {
        backgroundColor: "#2D2D40",
        borderRadius: pxToDp(40),
        flex: 1
    },
    item: {
        height: pxToDp(88),
        marginBottom: pxToDp(20),
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(4),
        backgroundColor: "transparent"
    },
    item_inner: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        borderRadius: pxToDp(40),
        backgroundColor: "transparent",
        ...appStyle.flexJusCenter
    },
    point_item: {
        height: pxToDp(88),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        borderRadius: pxToDp(40),
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginRight: pxToDp(20),
        ...appStyle.flexCenter,
        marginBottom: pxToDp(20)
    },
    videoBtn: {
        width: pxToDp(300),
        height: pxToDp(120),
        borderRadius: pxToDp(140),
        backgroundColor: "#4E54D8",
        paddingBottom: pxToDp(8)
    },
    videoBtn_inner: {
        flex: 1,
        backgroundColor: "#7076FF",
        ...appStyle.flexLine,
        ...appStyle.flexCenter,
        borderRadius: pxToDp(140),
    },
    runBtn: {
        width: pxToDp(160),
        height: pxToDp(80),
        borderRadius: pxToDp(140),
        paddingBottom: pxToDp(8),
        backgroundColor: "#FFB649"
    },
    runBtn_inner: {
        flex: 1,
        backgroundColor: '#FFDB5D',
        borderRadius: pxToDp(140),
        ...appStyle.flexCenter
    },
    // m_container:{
    //     flex:1,
    //     backgroundColor:"rgba(76, 76, 89, .6)",
    //     ...appStyle.flexCenter
    // },
    // m_content:{
    //     minWidth:pxToDp(852),
    //     backgroundColor:'#DAE2F2',
    //     borderRadius:pxToDp(80),
    //     paddingBottom:pxToDp(8)
    // },
    // m_content_inner:{
    //     backgroundColor:"#fff",
    //     borderRadius:pxToDp(80),
    //     padding:pxToDp(40),
    //     ...appStyle.flexAliCenter,
    //     paddingBottom:pxToDp(100)
    // },
    // m_close_btn:{
    //     width:pxToDp(270),
    //     height:pxToDp(128),
    //     borderRadius:pxToDp(140),
    //     backgroundColor:"#FFB649",
    //     paddingBottom:pxToDp(8),
    //     marginTop:pxToDp(-64)
    // },
    // m_close_btn_inner:{
    //     flex:1,
    //     backgroundColor:"#FFDB5D",
    //     borderRadius:pxToDp(140),
    //     ...appStyle.flexCenter,
    // },
    // m_result_wrap:{
    //     padding:Platform.OS === 'android'?pxToDp(20):pxToDp(40),
    //     backgroundColor:"#F5F6FA",
    //     borderRadius:pxToDp(40),
    // }
})

export default SyntaxQuery
