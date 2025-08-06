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
    Dimensions,
    Platform,
} from "react-native"

import { appFont, appStyle } from "../../../../../theme"
import { pxToDp, size_tool } from "../../../../../util/tools"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import _ from "lodash"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
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
                                <Text style={modalStyles.modalContentText}>&#12288;&#12288;同学们，前四个模块可任意点击，当四个能量值都达到100%时，即可解锁第五个模块。</Text>
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

class QtyRelationShipPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            helpModalVisible: false,
            rawData: [],
        }
    }

    componentDidMount() {
        axios.get(`${api.getExecisePage}?parent_id=12`, {}).then(
            res => {
                let data = res.data.data
                this.setState({
                    rawData: data,
                })
            }
        )
    }

    componentWillUpdate(nextProps) {
        this.refreshBlood()
    }

    refreshBlood = () => {
        axios.get(`${api.getExecisePage}?parent_id=12`, {}).then(
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

    goQuestionKindPage = (name, explain, tid, x,authority) => {
        if(x > 0 && !authority){
            this.props.setVisible(true)
            return
        }
        MathNavigationUtil.toMathQuestionKindPage({ ...this.props, data: { tid, explain, name } })
    }

    renderSmallBox = (rawData,x) => {
        const authority = this.props.authority
        let { blood, name, status, explain, t_t_id } = rawData
        let progress = blood * (100 / 18.0)
        let bgImg, jumpImg, titleColor, describtionColor
        // if (status === 1) {
        titleColor = "#442D4F"
        describtionColor = '#FEECE7'
        bgImg = require('../../../../../images/thinkingTraining/finish_bg.png')
        jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
        // }
        // else if (status === 2) {
        //     titleColor = "#6C6C6C"
        //     describtionColor = '#fff'

        //     bgImg = require('../../../../../images/thinkingTraining/unfinish_bg.png')
        //     jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
        // }
        // else if (status === 0) {
        //     titleColor = "#6C6C6C"
        //     describtionColor = '#fff'

        //     bgImg = require('../../../../../images/thinkingTraining/unfinish_bg.png')
        //     jumpImg = require('../../../../../images/thinkingTraining/unjump_button.png')
        // }
        return (
            <TouchableOpacity style={[styles.smallBox]} onPress={() => this.goQuestionKindPage(name, explain, t_t_id,x,authority)}>
                 {x === 0 && !authority?<View style={[{position:"absolute",zIndex:1,top:pxToDp(-10),right:pxToDp(30)}]}>
                    <FreeTag></FreeTag>
                </View>:null}
                <View style={[styles.smallBoxView]}>
                    <Text style={[styles.describtion, styles.describtion_position, appFont.fontFamily_jcyt_500, { color: describtionColor }]}>简单应用题</Text>
                    <Text style={[styles.title, styles.title_position, appFont.fontFamily_jcyt_700, { color: titleColor }]}>{name}</Text>
                    <Image style={[{ width: pxToDp(508), height: pxToDp(376) }]} source={bgImg} resizeMode="cover"></Image>
                    {/* <Image style={[{ width: pxToDp(70), height: pxToDp(70) }, styles.jump_button_position]} source={jumpImg} resizeMode="contain"></Image> */}
                    {this.renderProgressBar(styles.finish_start_bar_position, progress)}
                </View>
            </TouchableOpacity>
        )
    }

    renderProgressBar = (position, progress, width) => {
        const { top, left } = position
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
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                padding: 8,
                borderRadius: 5,
            },
            contentPosition: {
                position: "absolute",
                left: left,
                top: top,
            },
            progressBar: {
                height: 25,
                flexDirection: "row",
                width: width ? width : pxToDp(380),
                backgroundColor: '#fff',
                borderColor: 'white',
                borderWidth: 2,
                borderRadius: pxToDp(60),
                borderColor: progress > 0 ? '#F9D3AE' : '#B9B9B9'
            },
            fillAllProgressBar: {
                backgroundColor: "#96cb69",
                width: w,
                borderRadius: pxToDp(60),
            },
            fillProgressBar: {
                backgroundColor: "#96cb69",
                width: w,
                borderRadius: pxToDp(60),
            },
            star: {
                flex: 1,
                zIndex: 10,
            },
            starPosition: {
                position: "absolute",
                left: pxToDp(-60),
            },
        })
        let fillStyle
        if (w === "100%") {
            fillStyle = styles.fillAllProgressBar
        } else {
            fillStyle = styles.fillProgressBar
        }

        return <View style={[styles.container, styles.contentPosition]}>
            {progress === 100 ? <Image style={[styles.star, styles.starPosition, { width: pxToDp(50), height: pxToDp(50), position: 'absolute', left: width ? width - 20 : pxToDp(360) },]} source={require('../../../../../images/thinkingTraining/star_btn.png')} resizeMode="contain"></Image> : null}
            {/* <Image style={[{ width: pxToDp(70), height: pxToDp(70), }, styles.star, styles.starPosition]} source={require('../../../../../images/thinkingTraining/star_btn.png')} resizeMode="contain"></Image> */}
            <View style={styles.progressBar}>
                <Animated.View style={[fillStyle]} />
            </View>
        </View>
    }

    renderBigBox = (rawData) => {
        let { blood, name, explain, t_t_id, status } = rawData[rawData.length - 1]
        let progress = blood * (100 / 18.0)
        let bgImg, jumpImg, titleColor
        let block = true
        let t = rawData.filter(item => item['status'] === 1)
        if (t === 4) {
            block = false
        }
        if (status === 1) {
            titleColor = "#442D4F"
            bgImg = require('../../../../../images/thinkingTraining/finish_bg_big.png')
            jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
        } else if (status === 2) {
            titleColor = "#442D4F"
            bgImg = require('../../../../../images/thinkingTraining/finish_bg_big.png')
            jumpImg = require('../../../../../images/thinkingTraining/jump_button.png')
        } else if (status === 0) {
            titleColor = "grey"
            bgImg = require('../../../../../images/thinkingTraining/unfinish_bg_big.png')
            jumpImg = require('../../../../../images/thinkingTraining/unjump_button.png')
        }
        return (
            <TouchableOpacity style={[styles.bigBox]} onPress={() => {
                if (status > 0) {
                    this.goQuestionKindPage(name, explain, t_t_id)
                }
            }}>
                <ImageBackground
                    source={bgImg}
                    style={[styles.bigBoxContent, appStyle.flexCenter, { height: Dimensions.get("window").height * 0.7, width: Dimensions.get("window").height * 1.4 / 3 }]}>
                    <Text style={[{
                        fontSize: pxToDp(30),
                        color: "#FEECE7",
                    }, appFont.fontFamily_jcyt_500]}>复合应用题</Text>
                    <Text style={[styles.title, appFont.fontFamily_jcyt_700, { color: titleColor }]}>主体关系</Text>
                    <Text style={[styles.title, appFont.fontFamily_jcyt_700, { color: titleColor }]}>从属关系</Text>
                    {/* <Image style={[{ width: pxToDp(600), height: pxToDp(697) }]} source={bgImg} resizeMode="cover"></Image> */}
                    {/* <Image style={[{ width: pxToDp(70), height: pxToDp(70) }, styles.big_jump_button_position]} source={jumpImg} resizeMode="contain"></Image> */}
                    {this.renderProgressBar(styles.big_finish_start_bar_position, progress, Dimensions.get("window").height * 1.4 / 4)}
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    render() {
        const { rawData } = this.state
        return (
            <ImageBackground
                resizeMode="contain"
                style={[styles.mainWrap, { backgroundColor: "#fffdf1" }]}
                source={require('../../../../../images/thinkingTraining/exercise_bg.png')}
            >
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(10) }]}></View> : <></>}
                <HelpModal onCloseEvent={this.hideHelpModal} show={this.state.helpModalVisible} />
                <View style={[appStyle.flexCenter]}>
                    <BackBtn goBack={this.goBack} style={{left:pxToDp(20),top:pxToDp(10)}}></BackBtn>
                    <Text style={[{ fontSize: pxToDp(60), color: '#47304C', top: pxToDp(10), lineHeight: pxToDp(70) }, appFont.fontFamily_jcyt_700]}>数量关系训练
                    </Text>
                    <TouchableOpacity style={[styles.help]} onPress={this.showHelpModal}>
                        <Image style={[{ width: pxToDp(64), height: pxToDp(64), top: pxToDp(5) }]} source={require('../../../../../images/thinkingTraining/help.png')} resizeMode="contain"></Image>
                    </TouchableOpacity>
                </View>
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(50) }]}></View> : <></>}
                {Object.keys(rawData).length !== 0 ?
                    <View style={[styles.flexRowLayout, styles.content]}>
                        <View style={[styles.box, {
                            position: "relative",
                        }]}>
                            <View
                            >
                                {this.renderSmallBox(rawData[0],0)}

                            </View>
                            <View
                                style={{ position: "absolute", bottom: 0, }}
                            >
                                <View
                                    style={{ bottom: 0 }}
                                >
                                    {this.renderSmallBox(rawData[2],1)}
                                </View>
                            </View>
                        </View>
                        <View style={[styles.box, {
                            position: "relative",
                        }]}>
                            <View
                            >
                                {this.renderSmallBox(rawData[1],2)}

                            </View>
                            <View
                                style={{ position: "absolute", bottom: 0, }}
                            >
                                <View
                                    style={{ bottom: 0 }}
                                >
                                    {this.renderSmallBox(rawData[3],3)}
                                </View>
                            </View>
                        </View>
                        <View style={[styles.box]}>
                            {this.renderBigBox(rawData)}
                        </View>
                    </View>
                    :
                    null
                }
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    help: {
        flex: 1,
        position: "absolute",
        left: pxToDp(1170),
        top: 1,
    },
    mainWrap: {
        flex: 1,
        zIndex: -10,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
    flexRowLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    flexColumnLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    content: {
        paddingTop: pxToDp(60),
        // justifyContent: "center",
    },
    smallBox: {
        width: pxToDp(595),
        // borderWidth: 1,
        // borderColor: "green",
        // marginTop: pxToDp(30),
        // justifyContent: "center",
    },
    smallBoxView: {
        alignItems: "center",
    },
    bigBox: {
        // width: pxToDp(595),
        height: "100%",
        // backgroundColor: "#ffffff",
        borderRadius: 30,
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "yellow",
        // justifyContent: "center",
    },
    box: {
        height: Dimensions.get("window").height * 0.7,
        flex: 1,
        // borderWidth: 1,
        // borderColor: "red",
        // backgroundColor: "#99B8FF",
        alignItems: "center",
        // justifyContent: "center",
    },
    smallBox2Position: {
        top: pxToDp(40),
    },
    smallBoxContent: {
        backgroundColor: "white",
        width: pxToDp(516),
        height: pxToDp(280),
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        // top: pxToDp(30),
    },
    bigBoxContent: {
        backgroundColor: "transparent",
        alignItems: "center",
    },
    smallBoxContentPosition: {
        top: pxToDp(90),
    },
    smallBoxStarBtnPosition: {
        position: "absolute",
        left: pxToDp(515),
        top: pxToDp(24),
    },
    smallBoxStartStudyBtnPosition: {
        position: "absolute",
        left: pxToDp(40),
        top: pxToDp(160),
    },
    bigBoxStartStudyBtnPosition: {
        position: "absolute",
        left: pxToDp(158),
        top: pxToDp(605),
    },
    smallBoxLevelText: {
        color: "#3F73E1",
        fontSize: pxToDp(36),
        textShadowColor: "white",
        // textShadowOffset:{width: 10, height: },
        textShadowRadius: 10,
    },
    smallBoxLevelTextPosition: {
        position: "absolute",
        left: pxToDp(41),
        top: pxToDp(24),
    },
    smallBoxCircleProgressPosition: {
        position: "absolute",
        left: pxToDp(290),
        top: pxToDp(50),
    },
    bigBoxCircleProgressPosition: {
        // position: "absolute",
        // left: pxToDp(108),
        top: pxToDp(60),
    },
    smallBoxQuestionType: {
        color: "#999999",
        fontSize: pxToDp(28),
    },
    smallBoxQuestionTypePosition: {
        position: "absolute",
        top: pxToDp(40),
        left: pxToDp(71),
    },
    bigBoxQuestionTypePosition: {
        position: "absolute",
        top: pxToDp(405),
        left: pxToDp(189),
    },
    smallBoxQuestionKind: {
        color: "#3F73E1",
        fontSize: pxToDp(40),
    },
    smallBoxQuestionKindPosition: {
        position: "absolute",
        top: pxToDp(88),
        left: pxToDp(61),
    },
    bigBoxQuestionKind1Position: {
        position: "absolute",
        top: pxToDp(453),
        left: pxToDp(179),
    },
    bigBoxQuestionKind2Position: {
        position: "absolute",
        top: pxToDp(518),
        left: pxToDp(179),
    },
    circleProgressText: {
        color: "#90CE52",
        fontSize: pxToDp(32),
    },
    jump_button_position: {
        zIndex: 2,
        position: "absolute",
        top: pxToDp(150),
        left: pxToDp(520),
    },
    big_jump_button_position: {
        zIndex: 2,
        position: "absolute",
        top: pxToDp(360),
        left: pxToDp(480),
    },
    title: {
        // position: "absolute",
        fontSize: pxToDp(72),
        zIndex: 1,
        lineHeight: pxToDp(80)
        // fontWeight: 'bold'
    },
    title_position: {
        position: "absolute",
        top: pxToDp(120),
        left: pxToDp(100),
    },
    describtion: {
        position: "absolute",
        fontSize: pxToDp(30),
        zIndex: 1,
        color: "#FEECE7",
    },
    describtion_position: {
        position: "absolute",
        top: pxToDp(60),
        left: pxToDp(120),
    },
    big_title0_position: {
        position: "absolute",
        top: pxToDp(350),
        left: pxToDp(160),
    },
    big_title1_position: {
        position: "absolute",
        top: pxToDp(430),
        left: pxToDp(160),
    },
    big_describtion_position: {
        position: "absolute",
        top: Dimensions.get("window").height * 0.25,
        left: pxToDp(180),
    },
    finish_start_bar_position: {
        position: "absolute",
        top: pxToDp(270),
        left: pxToDp(100),
    },
    big_finish_start_bar_position: {
        position: "absolute",
        top: Dimensions.get("window").height * 0.6,
        left: (Dimensions.get("window").height * 1.4 / 3) * 0.1,
    },
    progressBar: {
        height: 20,
        flexDirection: "row",
        width: 124,
        backgroundColor: '#d0d0d0',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 30
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

export default connect(mapStateToProps, mapDispathToProps)(QtyRelationShipPage)
