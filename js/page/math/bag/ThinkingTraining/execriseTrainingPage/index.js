import React, { PureComponent } from "react"
import {
    View,
    Text,
    Modal,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    DeviceEventEmitter,
    Platform,
} from "react-native"
import _ from 'lodash'
import { appFont, appStyle } from "../../../../../theme"
import { pxToDp } from "../../../../../util/tools"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import FreeTag from '../../../../../component/FreeTag'
import { connect } from "react-redux";
import * as actionCreators from "../../../../../action/purchase/index";
import BackBtn from "../../../../../component/math/BackBtn"

const log = console.log.bind(console)

class HelpModal extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    _onCloseHelpModal = () => {
        const { onCloseEvent } = this.props
        onCloseEvent()
    }

    render() {
        const { show } = this.props
        return (
            <View style={modalStyles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={show}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <View style={modalStyles.modalLayer}>
                        <View style={modalStyles.contentStyle}>
                            <View style={modalStyles.modalHeader}>
                                <Text style={modalStyles.modalHeaderText}>模块简介</Text>
                            </View>
                            <View style={modalStyles.modalContainer}>
                                <Text style={modalStyles.modalContentText}>&#12288;&#12288;同学们，请按顺序作答哦。</Text>
                                <Text style={modalStyles.modalContentText}>&#12288;&#12288;某个模块的能量值达到100%时，该模块获得一个奖牌。</Text>
                                <View style={modalStyles.modalButtonStyle}>
                                    <TouchableOpacity onPress={this._onCloseHelpModal}>
                                        <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                                            source={require('../../../../../images/thinkingTraining/btn_bg_1.png')} resizeMode="contain">
                                            <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>我已了解</Text>
                                        </ImageBackground>
                                        {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80) }]} source={require('../../../../../images/i_know_btn.png')} resizeMode="contain"></Image> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const modalStyles = StyleSheet.create({
    container: {
        // flex: 1
        // alignItems: "center",
        // justifyContent: "center",
    },
    contentStyle: {
        borderRadius: 20,
        overflow: "hidden",
        width: pxToDp(800),
        // height: "100%",
        textAlign: "center",
        justifyContent: "center",
    },
    contentTextStyle: {
        textAlign: 'center',
        fontSize: pxToDp(36),
    },
    modalContentText: {
        fontSize: pxToDp(33),
        color: "#C0352C",
    },
    modalLayer: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: "center",
    },
    modalHeader: {
        height: pxToDp(96),
        backgroundColor: '#F2A887',
        justifyContent: 'center'
    },
    modalHeaderText: {
        fontSize: pxToDp(36),
        color: "white",
        justifyContent: 'center',
        textAlign: "center",
    },
    modalContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 200,
        lineHeight: 20,
        // width: 200,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    modalTitleStyle: {
        textAlign: 'center',
        fontSize: 26
    },
    modalButtonStyle: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 10,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: "center",
    }
})
class ExecisePage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            helpModalVisible: false,
            explain: [],
            rawData: [],
        }
    }

    componentDidMount() {
        // 增加事件监听，用来更新 blood
        DeviceEventEmitter.addListener('refreshBlood', this.refreshBlood);
        // http://www.pailaimi.com/api/student_blue/get_thinking_type?parent_id=10
        axios.get(`${api.getExecisePage}?parent_id=10`, {}).then(
            res => {
                let data = res.data.data
                let init = false
                let bs = Array.from(new Set(data.map(d => d["blood"])))
                if (bs.length === 1 && bs[0] === 0) {
                    init = true
                }
                this.setState({
                    rawData: data,
                    explain: this.parseHTML(data[0]['explain']),
                    init,
                })
            }
        )
    }

    componentWillUpdate(nextProps) {
        this.refreshBlood()
    }

    refreshBlood = () => {
        axios.get(`${api.getExecisePage}?parent_id=10`, {}).then(
            res => {
                const { rawData } = this.state
                let data = res.data.data
                if (_.isEqual(data, rawData) === false) {
                    this.setState({
                        rawData: data,
                    })
                }
            }
        )
        
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeListener('refreshBlood', this.refreshBlood);
    }

    parseHTML = (html) => {
        let pList = html.split("</p>")
        pList = pList.filter(d => d !== "")
        pList = pList.map(d => `${d}</p>`)
        let contentList = []
        for (let i = 0; i < pList.length; i++) {
            let item = pList[i]
            if (item === "") {
                continue
            } else {
                item = `${item}</p>`
            }
            let titleStart = item.indexOf("<p>")
            let titleEnd = item.indexOf("</p>")
            let content = item.slice(titleStart + 3, titleEnd)
            content = content.replaceAll("&nbsp;", " ")
            contentList.push(content)
        }
        return contentList
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
    }

    hideHelpModal = () => {
        this.setState({
            helpModalVisible: false,
        })
    }

    showHelpModal = () => {
        this.setState({
            helpModalVisible: true,
        })
    }

    goQuestionKindPage = (block, tid, explain, name, x) => {
        const {authority} = this.props
        if (x > 0 && !authority) {
            this.props.setVisible(true)
            return
        }
        if (block) {
            return
        } else {
            MathNavigationUtil.toMathQuestionKindPage({ ...this.props, data: { tid, explain, name } })
        }
    }

    renderItem = (data,x) => {
        if (data === undefined) {
            return
        }
        const { init } = this.state
        let { explain, index, name, blood, status, t_t_id } = data
        // 任务未完成，不能进行跳转
        let block = true
        let bgImg, jumpImg, lightImg, titleColor
        if (status === 1) {
            titleColor = "#442D4F"
            bgImg = require('../../../../../images/thinkingTraining/finish_bg.png')
            jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
            lightImg = require('../../../../../images/thinkingTraining/green_lighting.png')
            block = false
        }
        else if (status === 2) {
            titleColor = "#442D4F"
            bgImg = require('../../../../../images/thinkingTraining/finish_bg.png')
            jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
            lightImg = require('../../../../../images/thinkingTraining/yellow_lighting.png')
            block = false
        }
        else if (status === 0) {
            titleColor = "grey"
            bgImg = require('../../../../../images/thinkingTraining/unfinish_bg.png')
            jumpImg = require('../../../../../images/thinkingTraining/unjump_button.png')
            lightImg = require('../../../../../images/thinkingTraining/red_ligjhting.png')
            block = true
        }
        // 对于第一次进来的用户特殊处理
        if (init && name === "识题") {
            titleColor = "#6C6C6C"
            bgImg = require('../../../../../images/thinkingTraining/finish_bg.png')
            jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
            block = false
        }
        let progress = blood * (100 / 18.0)

        const getPosition = (k) => {
            const o = {
                1: {
                    bg: styles.bg_1_position,
                    circle: styles.circle_1_position,
                },
                2: {
                    circle: styles.circle_2_position,
                    bg: styles.bg_2_position,
                },
                3: {
                    bg: styles.bg_3_position,
                    circle: styles.circle_3_position,
                },
                4: {
                    bg: styles.bg_4_position,
                    circle: styles.circle_4_position,
                },
                5: {
                    bg: styles.bg_5_position,
                    circle: styles.circle_5_position,
                },
                6: {
                    bg: styles.bg_6_position,
                    circle: styles.circle_6_position,
                },
                7: {
                    bg: styles.bg_7_position,
                    circle: styles.circle_7_position,
                },
                8: {
                    bg: styles.bg_8_position,
                    circle: styles.circle_8_position,
                },
            }
            return o[k]
        }

        const positionOption = getPosition(index)
        const {authority} = this.props
        return (
            <View>
                <TouchableOpacity onPress={() =>{
                    this.goQuestionKindPage(block, t_t_id, explain, name, x)
                }} style={[{ width: pxToDp(300), height: pxToDp(188)}, positionOption.bg]}>
                    {x === 0 && !authority?<View style={[{position:"absolute",zIndex:1,top:pxToDp(-10),right:pxToDp(30)}]}>
                        <FreeTag></FreeTag>
                    </View>:null}
                    <Text style={[styles.title, styles.title_position, { color: titleColor }]}>{name}</Text>
                    <Image style={[{ width: pxToDp(254), height: pxToDp(188) }]} source={bgImg} resizeMode="contain"></Image>
                    {/* <Image style={[{ width: pxToDp(48), height: pxToDp(48) }, styles.jump_button_position]} source={jumpImg} resizeMode="contain"></Image> */}
                    {this.renderProgressBar(styles.finish_start_bar_position, progress)}
                </TouchableOpacity>
                <Image style={[{ width: pxToDp(129), height: pxToDp(127) }, positionOption.circle]} source={lightImg} resizeMode="contain"></Image>
            </View>
        )
    }

    renderProgressBar = (position, progress) => {
        const { top, left } = position
        // let progress = 100
        // 进度
        if (progress > 100) {
            progress = 100
        }
        if (progress < 0) {
            progress = 0
        }
        let w = `${progress}%`
        // star 位置
        let sw = progress + 5
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: "column", //column direction
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: 8,
                borderRadius: 5,
                position: 'relative'
                // backgroundColor: 'red'
            },
            contentPosition: {
                position: "absolute",
                left: left,
                top: top,
            },
            progressBar: {
                height: 20,
                flexDirection: "row",
                width: pxToDp(180),
                backgroundColor: '#fff',
                borderColor: 'white',
                borderWidth: pxToDp(4),
                borderRadius: pxToDp(30),
                borderColor: progress > 0 ? '#F9D3AE' : '#B9B9B9'
            },
            fillAllProgressBar: {
                backgroundColor: "#80D6A9",
                width: w,
                borderRadius: pxToDp(30),
            },
            fillProgressBar: {
                backgroundColor: "#80D6A9",
                width: w,
                borderRadius: pxToDp(30),
                // borderRadius: 30,
            },
            star: {
                flex: 1,
                zIndex: 10,
            },
            starPosition: {
                position: "absolute",
                left: pxToDp(-35),
            },
        });
        let fillStyle
        if (w === "100%") {
            fillStyle = styles.fillAllProgressBar
        } else {
            fillStyle = styles.fillProgressBar
        }
        // let left1 = progress === 100 ? 1.8 * progress - 20 : 1.8 * progress

        return <View style={[styles.container, styles.contentPosition]}>
            {progress === 100 ? <Image style={[styles.star, styles.starPosition, { width: pxToDp(50), height: pxToDp(50), position: 'absolute', left: pxToDp(170) },]} source={require('../../../../../images/thinkingTraining/star_btn.png')} resizeMode="contain"></Image> : null}
            <View style={styles.progressBar}>
                <Animated.View style={[fillStyle]} />
            </View>
        </View>
    }

    render() {
        const { rawData } = this.state
        return (
            <ImageBackground
                resizeMode="contain"
                style={[styles.mainWrap, { backgroundColor: "#fffdf1" }]}
                // , {marginTop: pxToDp(180)}
                source={require('../../../../../images/thinkingTraining/exercise_map.png')}
            >
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(10) }]}></View> : <></>}
                <HelpModal onCloseEvent={this.hideHelpModal} show={this.state.helpModalVisible} explain={this.state.explain} />

                <View style={[appStyle.flexCenter]}>
                    <BackBtn goBack={this.goBack} style={{left:pxToDp(20),top:pxToDp(10)}}></BackBtn>
                    <Text style={[{ fontSize: pxToDp(48), color: '#47304C', top: pxToDp(10), lineHeight: pxToDp(60) }, appFont.fontFamily_jcyt_700]}>结构训练
                    </Text>
                    <TouchableOpacity style={[styles.help]} onPress={this.showHelpModal}>
                        <Image style={[{ width: pxToDp(64), height: pxToDp(64), top: pxToDp(5) }]} source={require('../../../../../images/thinkingTraining/help.png')} resizeMode="contain"></Image>
                    </TouchableOpacity>
                </View>
                {/* 适配ios布局 */}
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(170) }]}></View> : <></>}
                <View style={[styles.content_item]}>
                    {rawData.map((data,x) => this.renderItem(data,x))}
                </View>
            </ImageBackground>
        )
    }
}

// title  top + 17，left + 20
// start_bar top + 70 left + 17
// jump_button top + 45 left + 150

const styles = StyleSheet.create({
    content_item: {
        flex: 1,
    },
    red_circle: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fa8181',
        borderColor: '#fa8181',
        borderStyle: 'solid',
        borderRadius: 50,
        paddingBottom: 2,
    },
    green_circle: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#90CE52',
        borderColor: '#90CE52',
        borderStyle: 'solid',
        borderRadius: 50,
        paddingBottom: 2,
    },
    yellow_circle: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#FBDE3E',
        borderColor: '#FBDE3E',
        borderStyle: 'solid',
        borderRadius: 50,
        paddingBottom: 2,
    },
    circle_1_position: {
        position: "absolute",
        top: pxToDp(330),
        left: pxToDp(-10),
    },
    circle_2_position: {
        position: "absolute",
        top: pxToDp(600),
        left: pxToDp(80),
    },
    circle_3_position: {
        position: "absolute",
        top: pxToDp(600),
        left: pxToDp(410),
    },
    circle_4_position: {
        position: "absolute",
        top: pxToDp(200),
        left: pxToDp(600),
    },
    circle_5_position: {
        position: "absolute",
        top: pxToDp(230),
        left: pxToDp(940),
    },
    circle_6_position: {
        position: "absolute",
        top: pxToDp(600),
        left: pxToDp(1150),
    },
    circle_7_position: {
        position: "absolute",
        top: pxToDp(500),
        left: pxToDp(1450),
    },
    circle_8_position: {
        position: "absolute",
        top: pxToDp(320),
        left: pxToDp(1650),
    },
    content: {
        flex: 1,
        top: 117,
    },
    help: {
        top: 1,
        flex: 1,
        position: "absolute",
        left: pxToDp(1100),
    },
    title: {
        position: "absolute",
        fontSize: pxToDp(42),
        zIndex: 1,
        ...appFont.fontFamily_jcyt_700,
    },
    undo_title: {
        position: "absolute",
        color: "#666666",
        fontSize: pxToDp(36),
        zIndex: 1,
    },
    bg_1_position: {
        position: "absolute",
        top: pxToDp(120),
        left: pxToDp(-20),
    },
    title_position: {
        position: "absolute",
        top: 16,
        left: 20,
    },
    finish_start_bar_position: {
        position: "absolute",
        top: pxToDp(126),
        left: pxToDp(14),
    },
    jump_button_position: {
        zIndex: 2,
        position: "absolute",
        top: pxToDp(70),
        left: pxToDp(230),
    },
    bg_2_position: {
        position: "absolute",
        top: pxToDp(400),
        left: pxToDp(150),
    },
    bg_3_position: {
        position: "absolute",
        top: pxToDp(730),
        left: pxToDp(370),
    },
    bg_4_position: {
        position: "absolute",
        top: pxToDp(340),
        left: pxToDp(600),
    },
    bg_5_position: {
        position: "absolute",
        top: pxToDp(30),
        left: pxToDp(900),
    },
    bg_6_position: {
        position: "absolute",
        top: pxToDp(400),
        left: pxToDp(1100),
    },
    bg_7_position: {
        position: "absolute",
        top: pxToDp(640),
        left: pxToDp(1450),
    },
    bg_8_position: {
        position: "absolute",
        top: pxToDp(120),
        left: pxToDp(1600),
    },
    mainWrap: {
        flex: 1,
        zIndex: -10,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        authority:state.getIn(["userInfo", "selestModuleAuthority"]),
        selestModule:state.getIn(["userInfo", "selestModule"]),
    };
};

const mapDispathToProps = (dispatch) => {
// 存数据
return {
        setVisible(data) {
            dispatch(actionCreators.setVisible(data));
        },
        setModules(data) {
            dispatch(actionCreators.setModules(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(ExecisePage);
