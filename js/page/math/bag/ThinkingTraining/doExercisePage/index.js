import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    DeviceEventEmitter
} from "react-native"
import { Toast, Modal } from "antd-mobile-rn"
import RenderHtml from "react-native-render-html"
import TextView from "../TextView"
import AnswerStatisticsModal from "../../../../../component/math/Topic/AnswerStatisticsModal"
import { appFont, appStyle } from "../../../../../theme"
import { pxToDp } from "../../../../../util/tools"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import { connect } from 'react-redux'
import ScribblingPadModal from "../../../../../util/draft/ScribblingPadModal"
import HelpModal from "../../../../../component/math/Topic/HelpModal";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import * as actionCreatorsUserInfo from "../../../../../action/userInfo";
import {getRewardCoinLastTopic} from '../../../../../util/coinTools'
import PlayAudio from "../../../../../util/audio/playAudio";
import url from "../../../../../util/url";

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

import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil";
import _ from "lodash";
import BackBtn from "../../../../../component/math/BackBtn"

const log = console.log.bind(console)

class DoExercisePage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            // 获取题目类型 id
            tid: -1,
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
            draftVisible: false,
        }
        this.tsidDict = {}
        this.allAnswer = {
            // key: level, value: "-1" 未作答, "0"不正确, "1" 正确; nums: 作答次数
            1: { value: "-1", nums: 0 },
            2: { value: "-1", nums: 0 },
            3: { value: "-1", nums: 0 },
        }
    }

    componentDidMount() {
        const { tid, title } = this.props.navigation.state.params.data
        const { level, current } = this.state
        log(`${api.getExeciseTaskMainPage}?t_t_id=${tid}&level=${level}`)
        axios.get(`${api.getExeciseTaskMainPage}?t_t_id=${tid}&level=${level}`, {}).then(
            res => {
                let data = res.data.data
                log("response data: ", data)
                const thinkingData = data["thinking_data"]
                const currentData = thinkingData[0]
                this.tsidDict[level] = currentData["t_s_id"]
                // log("~~~~ ", currentData["explanation"], ["", "[[]]"].includes(currentData["explanation"]))
                this.setState({
                    tid: tid,
                    title: title,
                    thid: data["t_h_id"],
                    thinkingData: thinkingData,
                    currentData: currentData,
                    explain: ["", "[[]]"].includes(currentData["explanation"]) ? [currentData["understand"], currentData["understand_img"], currentData["method"], currentData["method_img"], currentData["correct_answer"]] : currentData["explanation"],
                    thinking: currentData["thinking"],
                    ss: Math.floor(Date.now() / 10 ** 3)
                })
            }
        )
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state['level'] !== nextState['level']) {
            const { tid, title } = this.props.navigation.state.params.data
            const { level } = nextState
            log(`${api.getExeciseTaskMainPage}?t_t_id=${tid}&level=${level}`)
            axios.get(`${api.getExeciseTaskMainPage}?t_t_id=${tid}&level=${level}`, {}).then(
                res => {
                    if (level === 1) {
                        this.allAnswer = {
                            1: { value: "-1", nums: 0 },
                            2: { value: "-1", nums: 0 },
                            3: { value: "-1", nums: 0 },
                        }
                    }

                    let data = res.data.data
                    const thinkingData = data["thinking_data"]
                    const currentData = thinkingData[0]
                    this.tsidDict[level] = currentData["t_s_id"]
                    this.setState({
                        tid: tid,
                        title: title,
                        thinkingData: thinkingData,
                        // thinkingData: thinkingData,
                        currentData: currentData,
                        explain: ["", "[[]]"].includes(currentData["explanation"]) ? [currentData["understand"], currentData["understand_img"], currentData["method"], currentData["method_img"], currentData["correct_answer"]] : currentData["explanation"],
                        errPageVisible: false,
                        thinking: currentData["thinking"],
                        ss: Math.floor(Date.now() / 10 ** 3)
                    })
                }
            )
        }
    }

    goBack = () => {
        this.setState({
            answerStatisticsVisible: false,
        })
        const { tid } = this.state
        let b0 = [11, 19, 20, 21, 22, 23, 24, 25]
        let b1 = [13, 14, 15, 16, 33]
        let b2 = [18, 26, 27, 28, 29, 30, 31, 32]
        if (b0.includes(tid)) {
            MathNavigationUtil.toMathThinkingTrainingExercisePage({ ...this.props, data: "结构训练" })
        } else if (b1.includes(tid)) {
            MathNavigationUtil.toMathThinkingQtyRelationshipPage({ ...this.props, data: "数量关系训练" })
        } else if (b2.includes(tid)) {
            MathNavigationUtil.toMathThinkingMindTrainingPage({ ...this.props, data: "思路训练" })
        }
    }

    getNextData = () => {
        const { current, thinkingData, currentData, level } = this.state
        let next = current + 1
        let n
        if (next >= thinkingData.length) {
            n = currentData
        } else {
            n = thinkingData[next]
        }
        this.setState({
            current: next,
            currentData: { ...n },
            level: level + 1,
        })
    }

    jumpPage = (correction) => {
        const { level, answerStatisticsVisible } = this.state
        if (correction === "1") {
            // Toast.success("恭喜你答对了！", 1, () => {
                if (Object.values(this.allAnswer).filter(d => d['value'] !== "-1").length === 3) {
                    this.setState({
                        errPageVisible: false,
                        answerStatisticsVisible: true,
                    })
                } else {
                    this.setState({
                        errPageVisible: false
                    })
                    this.getNextData()
                }
            // })
        } else if (correction === "-1") {
            // Toast.fail("没有填写答案。", 1, () => {
                this.allAnswer[level]['value'] = "0"
                this.allAnswer[level]['nums'] = this.allAnswer[level]['nums'] + 1
                this.setState({
                    errPageVisible: true
                })
            // })
        } else {
            // Toast.fail("抱歉，你答错了哦。", 1, () => {
                this.setState({
                    errPageVisible: true
                })
            // })
        }
    }

    submitAnswer = () => {
        const {token} = this.props
        if(!token){
            NavigationUtil.resetToLogin(this.props);
            return
        }
        const { thid, level, ss } = this.state
        const tsid = this.tsidDict[level]
        // 未作答将诊断结果置为错误，同时更新 allAnswer中的值，用来渲染答题状态圆圈的颜色.
        let correction = this.allAnswer[level]['value'] === "-1" ? "0" : this.allAnswer[level]['value']
        if(correction === '1'){
            PlayAudio.playSuccessSound(url.successAudiopath2)
        }else{
            PlayAudio.playSuccessSound(url.failAudiopath)
        }
        this.allAnswer[level]['value'] = correction
        this.allAnswer[level]['nums'] = this.allAnswer[level]['nums'] + 1
        // 提交
        let es = Math.floor(Date.now() / 10 ** 3)
        // get user info
        const { userInfo } = this.props
        const userInfoJs = userInfo.toJS()
        const params = {
            t_h_id: thid,
            t_s_id: tsid,
            correction,
            spend_time: es - ss,
            // 思维训练没有教材版本，固定 11
            textbook: "11",
            grade_code: userInfoJs["checkGrade"],
            term_code: userInfoJs["checkTeam"],
        }
        // console.log("~~~~~ params: ", params)
        // ("答题时间: ", es - ss)
        const u = "/student_blue/get_thinking_save"
        const { nums } = this.allAnswer[level]
        if (nums === 1) {
            // 只有第一次保存
            axios.post(u, params).then((res) => {
                if(correction === "1"){
                    if(Object.values(this.allAnswer).filter(d => d['value'] !== "-1").length === 3){
                        // 最后一题
                        getRewardCoinLastTopic().then(res => {
                            if(res.isReward){
                                // 展示奖励弹框,在动画完后在弹统计框
                                this.eventListener = DeviceEventEmitter.addListener(
                                    "rewardCoinClose",
                                        () => {
                                            this.jumpPage(correction)
                                            this.eventListener && this.eventListener.remove()
                                        }
                                    );
                                }else{
                                    this.jumpPage(correction)
                                }
                          })
                    }else{
                        this.props.getRewardCoin()
                        this.jumpPage(correction)
                    }
                }else{
                    this.jumpPage(correction)
                }
            })
        }else{
            this.jumpPage(correction)
        }
    }

    helpBtnEvent = () => {
        const { thinking } = this.state
        this.setState({
            helpStatus: true,
        })
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
        data["tid"] = tid
        const { level } = this.state
        let displayName = ""
        let stemText = this.parseStem(stem)
        // log("stemText: ", stemText)
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
        /*
        *  if stem is object
        * 2 => 400
        * */
        // log("stemText: ", stemText)
        let mh = 440
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
                mh = 340
            } else if (_v === 4) {
                mh = 310
            }
        } else {
            let _v = stemText.split("<br/>").length
            if (_v === 2) {
                mh = 420
            } else if (_v === 3) {
                mh = 400
            } else if (_v === 4) {
                mh = 370
            }
        }
        return (
            <View>
                <View
                    style={[
                        {
                            height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.85 - pxToDp(10) : Dimensions.get('window').height * 0.8 - pxToDp(10),
                            // borderColor: "green",
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
                        // maxHeight: pxToDp(mh + 200),
                        backgroundColor: 'whi',
                        marginTop:pxToDp(30)
                        // borderColor: "yellow",
                        // borderWidth: 1,
                    },]}>
                        {content}
                    </ScrollView>
                </View>
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

    getCircleColor = (t) => {
        let color = styles.greyColor
        if (t === "-1") {
            color = styles.greyColor
        } else if (t === "0") {
            color = styles.redColor
        } else if (t === "1") {
            color = styles.greenColor
        }
        return color
    }

    toggleDraftShow = () => {
        const { draftVisible } = this.state
        const newVisible = !draftVisible
        this.setState({
            draftVisible: newVisible,
        })
    }

    renderBtn = (level, errPageVisible) => {
        let t
        if (level === 3 && errPageVisible === true) {
            t = (
                <View
                    style={{
                        flexDirection: "row"
                    }}
                >
                    <TouchableOpacity onPress={this.reanswerEvnet} style={{ marginRight: pxToDp(30) }}>
                        {errPageVisible ?
                            <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                                source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                                <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>继续作答</Text>
                            </ImageBackground>
                            // <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/re_submit_btn.png')} resizeMode="contain"></Image>
                            :
                            null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ answerStatisticsVisible: true })}>
                        <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                            source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                            <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>答题完成</Text>
                        </ImageBackground>
                        {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/finish_btn.png')} resizeMode="contain"></Image> */}
                    </TouchableOpacity>
                </View>
            )
        } else {
            if (errPageVisible) {
                t = (
                    <View
                        style={{
                            flexDirection: "row"
                        }}
                    >
                        <TouchableOpacity onPress={this.reanswerEvnet} style={{ marginRight: pxToDp(30) }}>
                            {errPageVisible ?
                                <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                                    source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                                    <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>继续作答</Text>
                                </ImageBackground>
                                // <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/re_submit_btn.png')} resizeMode="contain"></Image>
                                :
                                null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.getNextData}>
                            <ImageBackground style={[{ width: pxToDp(206), height: pxToDp(80), }, appStyle.flexCenter]}
                                source={require('../../../../../images/thinkingTraining/btn_bg_3.png')} resizeMode="contain">
                                <Text style={[{ fontSize: pxToDp(36), color: '#fff', fontWeight: 'bold' }]}>下一题</Text>
                            </ImageBackground>
                            {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/next_btn.png')} resizeMode="contain"></Image> */}
                        </TouchableOpacity>
                    </View>
                )
            } else {
                t = (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity onPress={this.helpBtnEvent}>
                            <Image
                                source={require("../../../../../images/MathKnowledgeGraph/help_btn_1.png")}
                                style={[{ width: pxToDp(120), height: pxToDp(80), }]}
                                resizeMode="contain"
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.draftBtn]}
                            onPress={() => this.toggleDraftShow()}
                        >
                            <View
                                style={{
                                    borderWidth: pxToDp(4),
                                    borderColor: "#F08A71",
                                    backgroundColor: "#fff",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: pxToDp(140),
                                    height: pxToDp(65),
                                    borderRadius: pxToDp(30),
                                }}
                            >
                                <Text style={{ fontSize: pxToDp(28), color: "#F08A71" }}>打草稿</Text>
                            </View>
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
        // log("html: ", html)
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

    parseThinking = (html) => {
        let content = html
        const contentStyle = {
            flexWrap: "wrap",
        }
        if (content.startsWith("[[")) {
            const textStyle = {
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

    initConfig = () => {
        this.setState({
            current: 0,
            level: 1,
            answerStatisticsVisible: false,
        })
    }

    continueEvent = () => {
        this.initConfig()
    }

    render() {
        let { title, currentData, errPageVisible, explain, level, answerStatisticsVisible, helpStatus, thinking, draftVisible } = this.state
        let showContent = this.renderQuestionData(currentData)
        if (errPageVisible) {
            showContent = <ExplainPage explain={explain} />
        }
        const thinkingView = this.parseThinking(thinking)
        return (
            <ImageBackground
                style={styles.mainWrap}
                source={require('../../../../../images/thinkingTraining/exercise_bg.png')}
            >
                <ScribblingPadModal visible={draftVisible} toggleEvent={this.toggleDraftShow} />
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(30) }]}></View> : <></>}
                <View style={[styles.questionOption, styles.questionOptionPosition]}>
                    <View style={[styles.circle, styles.circlePosition1, this.getCircleColor(this.allAnswer[1]["value"])]}>
                        <Text style={[styles.circleText]}>1</Text>
                    </View>
                    <View style={[styles.circle, , styles.circlePosition2, this.getCircleColor(this.allAnswer[2]["value"])]}>
                        <Text style={[styles.circleText]}>2</Text>
                    </View>
                    <View style={[styles.circle, , styles.circlePosition3, this.getCircleColor(this.allAnswer[3]["value"])]}>
                        <Text style={[styles.circleText]}>3</Text>
                    </View>
                </View>
                <View style={[appStyle.flexCenter]}>
                    <AnswerStatisticsModal
                        dialogVisible={answerStatisticsVisible}
                        yesNumber={Object.values(this.allAnswer).filter(d => d["value"] === "1" && d["nums"] === 1).length}
                        wrongNum={Object.values(this.allAnswer).filter(d => d["nums"] !== 1 || d["value"] !== "1").length}
                        closeDialog={() => { this.goBack() }}
                        continue={this.continueEvent}
                        showContinue={true}
                        content={"恭喜完成训练。"}
                    ></AnswerStatisticsModal>


                    {typeof (thinkingView) === "object" ?
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
                            {thinkingView}
                        </Modal>
                        :
                        <HelpModal data={{ problem_solving: thinkingView }} visible={helpStatus} close={this.handleCloseHlepDialogThrottled}></HelpModal>

                        // <RenderHtml source={{ html: `${thinkingView}` }} tagsStyles={{ p: { fontSize: 20 }, span: { fontSize: 20 } }} />
                    }
                    <BackBtn goBack={this.goBack} style={{left:pxToDp(20),top:-10}}></BackBtn>
                    <Text style={[{ fontSize: pxToDp(60), color: '#47304C', lineHeight: pxToDp(60) }, appFont.fontFamily_jcyt_700]}>{title}</Text>
                    <View style={[styles.content]}>

                        {showContent}
                    </View>
                    {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(30) }]}></View> : <></>}
                    <View style={[styles.toolBtnPosition]}>
                        {this.renderBtn(level, errPageVisible)}
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
    content: {
        // borderColor: "red",
        // borderWidth: 1,
        top: pxToDp(50),
        // height: pxToDp(900),
        // height: Dimensions.get('window').height * 0.8,
        // height: pxToDp(300),
        width: Dimensions.get('window').width * 0.95,
        backgroundColor: "white",
        borderRadius: pxToDp(32),
    },
    stemContent: {
        maxWidth: pxToDp(1800),
        top: pxToDp(90),
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
        top: pxToDp(130),
        right: pxToDp(40),
        paddingTop: pxToDp(20),
        // backgroundColor: 'red'
    },
    draftBtn: {
        // position: "absolute",
        // right: pxToDp(400),
        width: pxToDp(140),
        height: pxToDp(64),
        marginLeft: pxToDp(30),
        marginRight: pxToDp(30),
    },
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(['userInfo', 'currentUserInfo']),
        token: state.getIn(["userInfo", "token"]),
    }
}

const mapDispathToProps = (dispatch) => {
    return {
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    }
}

export default connect(mapStateToProps, mapDispathToProps)(DoExercisePage)

