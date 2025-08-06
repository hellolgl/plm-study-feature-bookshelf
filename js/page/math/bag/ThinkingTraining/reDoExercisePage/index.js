import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StyleSheet, ScrollView,
    Dimensions,
    DeviceEventEmitter
} from "react-native"
import { Toast, Modal } from "antd-mobile-rn"
import RenderHtml from "react-native-render-html"

import TextView from "../TextView"

import { pxToDp } from "../../../../../util/tools"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import { connect } from 'react-redux'
import { appFont, appStyle } from "../../../../../theme"

import RedirectModal from "../RedirectModal"
// 图片点选
import SelectTitle from "../selectTitle"
// ABC 单选
import ABCSelectTitle from "../ABCSelectTitle"
// ABC 多选
import MultSelectTitle from "../ABCSelectTitle/multSelect"
// 句子点选
import WordSelect from "../wordSelect"
// 数量关系题型
import QtyRelationsSelect from "../qtyRelationsSelect"
// 讲解页面
import ExplainPage from "../explainPage"

import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import _ from "lodash"

const log = console.log.bind(console)

class ReDoExercisePage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            // 获取题目类型 id
            tid: -1,
            twid: -1,
            title: "",
            // 套题 id
            thid: -1,
            thinkingData: [],
            current: 0,
            level: 1,
            currentData: {},
            errPageVisible: false,
            answerStatisticsVisible: false,
            helpStatus: false,
            thinking: "",
            // 开始答题时间
            ss: -1,
            answerStatisticsModalVisible: false,
        }
        this.tsidDict = {}
        this.allAnswer = {
            // key: level, value: "-1" 未作答, "0"不正确, "1" 正确; nums: 作答次数
            1: { value: "-1", nums: 0 },
            2: { value: "-1", nums: 0 },
            3: { value: "-1", nums: 0 },
        }
    }

    closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsModalVisible: false }, () => {
            MathNavigationUtil.toMathThinkingTrainingErrTaskPage({ ...this.props })
        })
    }

    getTask = (tsid, twid) => {
        const uri = `${api.getMathThinkingErrTask}?t_s_id=${tsid}`
        // t_s_id 错题题目 id
        axios.get(uri, {}).then(
            res => {
                let data = res.data.data
                this.setState({
                    tid: data["t_s_id"],
                    title: data['type_name'],
                    twid: twid,
                    thinkingData: [data],
                    currentData: data,
                    explain: ["", "[[]]"].includes(data["explanation"]) ? [data["understand"], data["understand_img"], data["method"], data["method_img"], data["correct_answer"]] : data["explanation"],
                    thinking: data["thinking"],
                    ss: Math.floor(Date.now() / 10 ** 3)
                })
            }
        )
    }

    componentDidMount() {
        const { tsid, twid } = this.props.navigation.state.params.data
        this.getTask(tsid, twid)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState["tid"] !== this.state["tid"]) {
            const { tsid, twid } = nextProps.navigation.state.params.data
            this.getTask(tsid, twid)
        }
    }

    goBack = () => {
        NavigationUtil.goBack(this.props)
    }

    jumpPage = (correction) => {
        const { level, answerStatisticsVisible } = this.state
        if (correction === "1") {
            this.setState({
                answerStatisticsModalVisible: true,
            })
        } else if (correction === "-1") {
            Toast.fail("没有填写答案。", 1, () => {
                this.allAnswer[level]['value'] = "0"
                this.allAnswer[level]['nums'] = this.allAnswer[level]['nums'] + 1
                this.setState({
                    errPageVisible: true
                })
            })
        } else {
            Toast.fail("抱歉，你答错了哦。", 1, () => {
                this.setState({
                    errPageVisible: true
                })
            })
        }
    }

    submitAnswer = () => {
        // DeviceEventEmitter.emit("refreshWrongPage");
        const { twid, level } = this.state
        const correction = this.allAnswer[level]['value']
        const u = "/student_blue/get_thinking_wrong_again"
        if (correction === "1") {
            axios.get(`${u}?t_w_id=${twid}`, {}).then((res) => {
                if(res.data.err_code === 0){
                    DeviceEventEmitter.emit("refreshWrongPage");
                }
            })
        }
        // 进行页面跳转
        this.jumpPage(correction)
    }

    handleCloseHlepDialogThrottled = () => {
        this.setState({
            helpStatus: false,
        })
    }

    renderQuestionData = (data) => {
        if (Object.keys(data).length === 0) {
            return
        }
        const { exercise_type_name, displayed_type_name, stem } = data
        let et = exercise_type_name
        let content
        const { tid } = this.state
        // 用来判断图片点选选项是否增加背景色
        data["tid"] = 18
        const { level } = this.state
        let displayName = ""
        let stemText = this.parseStem(stem)
        if (et === "ABC多项选择题") {
            displayName = "(多选)"
            content = <MultSelectTitle rawData={data} level={level} receiveAnswer={this.receiveAnswer} />
        } else if (et === "ABC选择题") {
            displayName = "(单选)"
            content = <ABCSelectTitle rawData={data} level={level} receiveAnswer={this.receiveAnswer} />
        } else if (et === "图片点选题") {
            content = <SelectTitle rawData={data} level={level} receiveAnswer={this.receiveAnswer} />
        } else if (et === "句子点选题") {
            content = <WordSelect rawData={data} level={level} receiveAnswer={this.receiveAnswer} />
        } else if (et === "数量关系题") {
            content = <QtyRelationsSelect rawData={data} level={level} receiveAnswer={this.receiveAnswer} />
        }
        let mh = 450
        if (typeof (stemText) === "object") {
            let _v = stemText["props"]["value"].length
            if (_v === 1) {
                const wordsLength = _.flattenDeep(stemText["props"]["value"]).join().length
                if (wordsLength > 53) {
                    mh = 370
                } else {
                    mh = 400
                }
            } else if (_v === 2) {
                mh = 370
            } else if (_v === 3) {
                mh = 330
            } else if (_v === 4) {
                mh = 300
            }
        } else {
            let _v = stemText.split("<br/>").length
            if (_v === 2) {
                mh = 430
            } else if (_v === 3) {
                mh = 410
            } else if (_v === 4) {
                mh = 380
            }
        }
        return (
            <View
                style={[
                    {
                        // height: Dimensions.get('window').height * 0.8 - pxToDp(10),
                        height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.85 - pxToDp(10) : Dimensions.get('window').height * 0.8 - pxToDp(10),
                        // borderColor: "red",
                        // borderWidth: 1,
                    }
                ]}
            >
                <View>
                    <View style={[styles.questionKindTextPosition]}>
                        <Text style={[styles.questionKindText]}>{`${displayed_type_name}${displayName}`}</Text>
                    </View>

                    <View style={[styles.stemContent]}>
                        {typeof (stemText) === "object" ?
                            stemText
                            :
                            <RenderHtml source={{ html: `${stemText}` }} tagsStyles={{ p: { fontSize: pxToDp(36), color: "black" }, span: { fontSize: pxToDp(36), color: "black" } }} />
                        }
                    </View>
                </View>
                <ScrollView style={[{
                    backgroundColor: 'whi',
                    // borderColor: "yellow",
                    // borderWidth: 1,
                    // maxHeight: mh,
                },]}>
                    {content}
                </ScrollView>
            </View>
        )
    }

    receiveAnswer = (index, answer) => {
        this.allAnswer[index]['value'] = answer
    }

    reanswerEvnet = () => {
        this.setState({
            errPageVisible: false
        })
    }

    renderBtn = (level, errPageVisible) => {
        let t
        if (errPageVisible) {
            t = null
        } else {
            t = (
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <TouchableOpacity onPress={this.helpBtnEvent} style={{ marginRight: pxToDp(30) }}>
                        {/* <Image
                            source={require("../../../../../images/thinkingTraining/math_help.png")}
                            style={[{ width: pxToDp(120), height: pxToDp(80), }]}
                            resizeMode="contain"
                        ></Image> */}
                        <Image
                            source={require("../../../../../images/MathKnowledgeGraph/help_btn_1.png")}
                            style={[{ width: pxToDp(120), height: pxToDp(80), }]}
                            resizeMode="contain"
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.submitAnswer}>
                        <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                            source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                            <Text style={[{ fontSize: pxToDp(36), color: '#fff', }, appFont.fontFamily_jcyt_700]}>提交</Text>
                        </ImageBackground>
                        {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/submit_btn.png')} resizeMode="contain"></Image> */}
                    </TouchableOpacity>
                </View>
            )
        }
        return t
    }

    parseHTML = (html) => {
        let titleStart = html.indexOf("<p>")
        let titleEnd = html.indexOf("</p>")
        let content = html.slice(titleStart + 3, titleEnd)
        content = content.split("<br/>").map(d => d.replaceAll("&nbsp; ", " "))
        return content
    }

    parseStem = (html) => {
        let content = html
        const contentStyle = {
            flexWrap: "wrap",
        }
        if (content.startsWith("[[")) {
            return <TextView value={JSON.parse(content)} contentStyle={contentStyle} />
        } else {
            if (content.startsWith("<p") === false) {
                content = `<p>${content}</p>`
            }
            if (html.includes("<img src=")) {
                let imgStart = html.indexOf("<img src")
                let p = html.slice(imgStart, html.length)
                let imgEnd = p.indexOf("/>")
                // parse html
                content = html.slice(0, imgStart) + p.slice(imgEnd + 2, html.length)
            }
            if (content.endsWith("<p></p>")) {
                content = content.slice(0, content.length - 7)
            }
            if (content.endsWith("<p><br/></p>")) {
                content = content.slice(0, content.length - 12)
            }
            return content
        }
    }

    initConfig = () => {
        this.setState({
            current: 0,
            level: 1,
            answerStatisticsVisible: false,
        })
    }

    helpBtnEvent = () => {
        const { thinking } = this.state
        this.setState({
            helpStatus: true,
        })
    }
    parseThinking = (html) => {
        // log("html: ", html)
        let content = html
        const contentStyle = {
            flexWrap: "wrap",
        }
        if (content.startsWith("[[")) {
            const textStyle = {
                // color: this.fontColor,
                // borderColor: this.fontColor,
                fontSize: 20,
            }
            return <TextView textStyle={textStyle} value={JSON.parse(content)} contentStyle={contentStyle} />
        } else {
            if (content.startsWith("<p") === false) {
                content = `<p>${content}</p>`
            }
            if (html.includes("<img src=")) {
                let imgStart = html.indexOf("<img src")
                let p = html.slice(imgStart, html.length)
                let imgEnd = p.indexOf("/>")
                // parse html
                content = html.slice(0, imgStart) + p.slice(imgEnd + 2, html.length)
            }
            if (content.endsWith("<p></p>")) {
                content = content.slice(0, content.length - 7)
            }
            if (content.endsWith("<p><br/></p>")) {
                content = content.slice(0, content.length - 12)
            }
            return content
        }
    }


    render() {
        let { title, currentData, errPageVisible, explain, level, helpStatus, thinking, answerStatisticsModalVisible } = this.state
        let showContent = this.renderQuestionData(currentData)
        if (errPageVisible) {
            showContent = <ExplainPage explain={explain} />
        }
        const thinkingView = this.parseThinking(thinking)
        return (
            <ImageBackground
                style={[styles.mainWrap, { backgroundColor: "#fffdf1" }]}
                source={require('../../../../../images/thinkingTraining/exercise_bg.png')}
            >
                <View style={[appStyle.flexCenter]}>
                    <RedirectModal
                        dialogVisible={answerStatisticsModalVisible}
                        btnText={"关闭"}
                        content={"恭喜你答对了"}
                        closeDialog={()=>{
                            this.setState({
                                answerStatisticsModalVisible:false
                            })
                        }}
                    ></RedirectModal>
                    <Modal
                        animationType="fade"
                        title={<Text style={[{ "fontSize": 23 }]}>解题思路</Text>}
                        transparent
                        onClose={this.handleCloseHlepDialogThrottled}
                        maskClosable={false}
                        visible={helpStatus}
                        style={{ width: 700 }}
                        closable={false}
                        footer={[{ text: "关闭", onPress: this.handleCloseHlepDialogThrottled }]}
                    >
                        {typeof (thinkingView) === "object" ?
                            thinkingView
                            :
                            <RenderHtml source={{ html: `${thinkingView}` }} tagsStyles={{ p: { fontSize: 20 }, span: { fontSize: 20 } }} />
                        }
                    </Modal>
                    <TouchableOpacity style={[styles.headerBack]} onPress={this.goBack}>
                        {/* <Image style={[{ width: pxToDp(120), height: pxToDp(80), }]} source={require('../../../../../images/MathSyncDiagnosis/back_btn_1.png')} resizeMode="contain"></Image> */}
                        <Image style={[{ width: pxToDp(120), height: pxToDp(80), }]} source={require('../../../../../images/MathSyncDiagnosis/back_btn_1.png')} resizeMode="contain"></Image>

                    </TouchableOpacity>
                    <Text style={[{ fontSize: pxToDp(48), color: '#47304C', lineHeight: pxToDp(60) }, appFont.fontFamily_jcyt_700]}>{title}</Text>
                    {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(20) }]}></View> : <></>}
                    <View style={[styles.content]}>
                        {showContent}
                    </View>
                    <View style={[styles.toolBtnPosition]}>
                        {this.renderBtn(level, errPageVisible)}
                    </View>
                    <View style={[styles.toolBtnPosition]}>
                        <TouchableOpacity onPress={this.reanswerEvnet}>
                            {errPageVisible ?
                                // <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/re_submit_btn.png')} resizeMode="contain"></Image>
                                <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                                    source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                                    <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>继续作答</Text>
                                </ImageBackground>
                                :
                                null
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    reanswerBtnPosition: {
        position: "absolute",
        top: 85,
        right: 200,
    },
    questionKindTextPosition: {
        left: 45,
        top: 20,
    },
    questionKindText: {
        color: "#999999",
        fontSize: pxToDp(36),
    },
    circle: {
        height: pxToDp(49),
        width: pxToDp(49),
        borderRadius: pxToDp(49),
        alignItems: "center",
        justifyContent: "center",
    },
    circlePosition1: {
        marginLeft: 5,
        marginRight: 5,
    },
    circlePosition2: {
        marginLeft: 5,
        marginRight: 5,
    },
    circlePosition3: {
        marginLeft: 5,
        marginRight: 5,
    },
    circleText: {
        color: "white",
    },
    greenColor: {
        backgroundColor: "#90CE52",
    },
    greyColor: {
        backgroundColor: "#AAAAAA",
    },
    redColor: {
        backgroundColor: "#f57d7d",
    },
    questionOption: {
        flexDirection: 'row',
    },
    questionOptionPosition: {
        position: 'absolute',
        top: pxToDp(80),
        right: pxToDp(65),
    },
    mainWrap: {
        flex: 1,
        zIndex: -10,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
    headerBack: {
        position: 'absolute',
        left: pxToDp(1),
        top: pxToDp(1),
    },
    content: {
        marginTop: pxToDp(30),
        // height: Dimensions.get('window').height * 0.8,
        height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.85 - pxToDp(10) : Dimensions.get('window').height * 0.8 - pxToDp(10),
        width: Dimensions.get('window').width * 0.95,
        // height: pxToDp(300),
        backgroundColor: "white",
        borderRadius: pxToDp(32),
    },
    stemContent: {
        maxWidth: pxToDp(1800),
        top: pxToDp(50),
        marginLeft: pxToDp(71),
        marginBottom: pxToDp(60),
        // borderWidth: 2,
        // borderColor: "yellow",
    },
    questionContent: {
        // marginTop: pxToDp(20),
    },
    toolBtnPosition: {
        position: "absolute",
        top: pxToDp(120),
        right: pxToDp(40),
    },
    mathBtnPosition: {
        position: "absolute",
        right: 240,
        top: -6,
        // left: 80,
    }
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(['userInfo', 'currentUserInfo']),
    }
}

const mapDispathToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispathToProps)(ReDoExercisePage)

