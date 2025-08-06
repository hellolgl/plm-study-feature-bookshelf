import React, { PureComponent } from "react"
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native"
import { Toast, Modal } from "antd-mobile-rn"
import RenderHtml from "react-native-render-html"
import _ from 'lodash'
import { connect } from 'react-redux'

import TextView from "../TextView"
import AnswerStatisticsModal from "../../../../../component/math/Topic/AnswerStatisticsModal"
import { appFont, appStyle } from "../../../../../theme"
import { pxToDp, size_tool } from "../../../../../util/tools"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import Stem from '../../ExpandApplication/components/Stem'
import { changeTopicData } from '../Comprehensive/tools'

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

import NavigationUtil from "../../../../../navigator/NavigationUtil"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil";
import BackBtn from "../../../../../component/math/BackBtn"

const log = console.log.bind(console)

class ThinkingTrainingErrTaskPage extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            errTaskNums: 0,
            errTypeIds: [],
            currentErrTaskType: -1,
            currentPageIndex: "1",
            currentItemIndex: 0,
            errTask: [],
            taskInfo: {}
        }
        this.cacheData = {}
        this.pageSize = 10
        this.flatList = {
            ref: null,
        }
    }

    componentDidMount() {
        let uri = api.getMathThinkingErrTaskType
        axios.get(uri, {}).then(
            res => {
                let data = res.data.data
                const types = data.map(item => item["t_t_id"])
                if (types.length !== 0) {
                    this.getTaskInfo(types[0])
                    this.setState({
                        errTypeIds: data.map(item => item["t_t_id"]),
                        currentErrTaskType: types[0],
                    })
                } else {
                    this.setState({
                        errTypeIds: data.map(item => item["t_t_id"]),
                    })
                }
            }
        )
    }

    getTask = (tsid) => {
        // const uri = `${api.getMathThinkingErrTask}?t_s_id=${tsid}`
        const uri = `${api.getMathThinkingErrTask}?t_w_id=${tsid}`
        // t_s_id 错题题目 id
        // log("send req...")
        if (Object.keys(this.cacheData).includes(tsid.toString())) {
            let data = this.cacheData[tsid]
            this.setState({
                taskInfo: data
            })
        } else {
            axios.get(uri, {}).then(
                res => {
                    let data = res.data.data
                    if (data.answer_type === '6' || data.answer_type === '4' || data.answer_type === '5') {
                        data = changeTopicData(data)
                    }
                    this.cacheData[tsid] = data
                    this.setState({
                        taskInfo: data
                    })
                }
            )
        }
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    }

    toggleErrTaskType = async (tid) => {
        const itemIndex = 0
        const currentPageIndex = "1"
        const { ids, count } = await this.syncGetTaskInfo(tid, currentPageIndex)
        // const tsid = ids[itemIndex]["t_s_id"]
        const tsid = ids[itemIndex]["t_w_id"]
        this.getTask(tsid)
        // 选项位置还原
        this.flatList.ref.scrollToOffset({ offset: 0 })
        this.flatList.ref.scrollToIndex({ index: 0 })
        this.setState({
            currentErrTaskType: tid,
            currentPageIndex: currentPageIndex,
            currentItemIndex: itemIndex,
            errTaskNums: count,
            errTask: ids,
        })
    }

    getTaskInfo = (currentErrTaskType, pageIndex = "1") => {
        const { currentItemIndex, currentPageIndex } = this.state
        axios.get(`/student_blue/get_thinking_wrong_list?t_t_id=${currentErrTaskType}&page_index=${pageIndex}&page_size=${this.pageSize}`, {}).then(
            res => {
                let rawData = res.data.data
                const { ids, count } = rawData
                // log("receive ids: ", ids)
                if (currentItemIndex === 0 && currentPageIndex === "1") {
                    const tsid = ids[0]["t_w_id"]
                    this.getTask(tsid)
                }
                this.setState({
                    errTaskNums: count,
                    errTask: ids,
                })
            }
        )
    }

    syncGetTaskInfo = async (currentErrTaskType, pageIndex) => {
        // log("async will send page index is: ", pageIndex)
        return new Promise(resolve => {
            axios.get(`/student_blue/get_thinking_wrong_list?t_t_id=${currentErrTaskType}&page_index=${pageIndex}&page_size=${this.pageSize}`, {}).then(
                res => {
                    resolve(res.data.data)
                }
            )
        })
    }

    circleEvt = async (index) => {
        const { currentErrTaskType, } = this.state
        const newPageIndex = Math.floor(index / this.pageSize) + 1
        const itemIndex = index % this.pageSize
        const { currentPageIndex } = this.state
        if (currentPageIndex !== newPageIndex.toString()) {
            const { ids, count } = await this.syncGetTaskInfo(currentErrTaskType, newPageIndex)
            this.setState({
                currentPageIndex: newPageIndex,
                currentItemIndex: index,
                errTaskNums: count,
                errTask: ids,
            })
            // log("~ currentPageIndex: ", index, itemIndex, ids)
            const tsid = ids[itemIndex]["t_w_id"]
            this.getTask(tsid)
        } else {
            const { errTask, } = this.state
            const tsid = errTask[itemIndex]["t_w_id"]
            this.getTask(tsid)
            this.setState({
                currentItemIndex: index,
            })
        }
    }

    renderPositionCircle = (_, index, currentItemIndex) => {
        let bg = "white"
        let color = "black"
        let circle = styles.circle
        if (currentItemIndex === index) {
            bg = "rgba(255, 152, 152, 1)"
            color = "white"
            circle = styles.bigCircle
        }
        return (
            <TouchableOpacity style={[circle, styles.circlePosition1, { backgroundColor: bg }]}
                onPress={() => this.circleEvt(index)}>
                <Text style={[styles.circleText, { color }]}>{index + 1}</Text>
            </TouchableOpacity>
        )
    }

    renderHeaderBtn = (errTypeIds, currentErrTaskType) => {
        let m = {
            10: {
                select: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(10)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/select_exercise.png')} resizeMode="contain"></Image>
                </TouchableOpacity>,
                unSelect: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(10)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/un_select_exercise.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
            },
            12: {
                select: <TouchableOpacity
                    style={[{ width: pxToDp(253), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(12)}
                >
                    <Image style={[{ width: pxToDp(253), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/select_qty.png')} resizeMode="contain"></Image>
                </TouchableOpacity>,
                unSelect: <TouchableOpacity
                    style={[{ width: pxToDp(253), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(12)}
                >
                    <Image style={[{ width: pxToDp(253), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/un_select_qty.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
            },
            17: {
                select: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(17)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/select_thinkingtraining.png')} resizeMode="contain"></Image>
                </TouchableOpacity>,
                unSelect: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(17)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/un_select_thinkingtraining.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
            },
            34: {
                select: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(34)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/select_comprehensive.png')} resizeMode="contain"></Image>
                </TouchableOpacity>,
                unSelect: <TouchableOpacity
                    style={[{ width: pxToDp(206), height: pxToDp(80), marginRight: pxToDp(40) }]}
                    onPress={() => this.toggleErrTaskType(34)}
                >
                    <Image style={[{ width: pxToDp(206), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/un_select_comprehensive.png')} resizeMode="contain"></Image>
                </TouchableOpacity>
            },
        }
        let r = []
        for (let i = 0; i < errTypeIds.length; i++) {
            let eid = errTypeIds[i]
            if (currentErrTaskType === eid) {
                r.push(m[eid]["select"])
            } else {
                r.push(m[eid]["unSelect"])
            }
        }
        return r
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

    receiveAnswer = (index, answer) => {
        log("")
    }

    renderQuestionData = (data) => {
        if (Object.keys(data).length === 0) {
            return
        }
        if (data.answer_type === '6' || data.answer_type === '4' || data.answer_type === '5') {
            // 综合练习题目内容
            return <View style={{ padding: pxToDp(32) }} width={pxToDp(1500)}>
                <Stem currentTopaicData={data} width={pxToDp(1500)}></Stem>
            </View>
        }

        const { exercise_type_name, displayed_type_name, stem, type_name } = data
        // log("type_name: ", type_name)
        let et = exercise_type_name
        let content
        const { tid } = this.state
        // 用来判断图片点选选项是否增加背景色
        data["tid"] = 18
        const { level } = this.state
        let displayName = ""
        let stemText = this.parseStem(stem)
        // log("stemText: ", stemText, typeof(stemText))
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
        // log("stemText: ", stemText)
        let mh = 400
        if (typeof (stemText) === "object") {
            // log('stemText: ', _.flattenDeep(stemText["props"]["value"]).join())
            let _v = stemText["props"]["value"].length
            if (_v === 1) {
                const wordsLength = _.flattenDeep(stemText["props"]["value"]).join().length
                if (wordsLength > 53) {
                    mh = 330
                } else {
                    mh = 360
                }
            } else if (_v === 2) {
                mh = 330
            } else if (_v === 3) {
                mh = 300
            } else if (_v === 4) {
                mh = 270
            }
        } else {
            let _v = stemText.split("<br/>").length
            // log(_v)
            if (_v === 2) {
                mh = 370
            } else if (_v === 3) {
                mh = 350
            } else if (_v === 4) {
                mh = 330
            }
        }
        return (
            <View
                style={[
                    {
                        // height: Dimensions.get('window').height * 0.7 - pxToDp(10),
                        height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.75 - pxToDp(10) : Dimensions.get('window').height * 0.7 - pxToDp(10),
                        // borderColor: "green",
                        // borderWidth: 1,
                    }
                ]}
            >
                <View>
                    <View style={[styles.questionKindTextPosition]}>
                        <Text style={[styles.questionKindText]}>{`${displayed_type_name}${displayName}  【${type_name}】`}</Text>
                    </View>

                    <View style={[styles.stemContent]}>
                        {typeof (stemText) === "object" ?
                            stemText
                            :
                            <RenderHtml source={{ html: stemText }} tagsStyles={{ p: { fontSize: pxToDp(36), color: "black" }, span: { fontSize: pxToDp(36), color: "black" } }} />
                        }
                    </View>
                </View>
                <ScrollView style={[{
                    backgroundColor: 'whi',
                    // maxHeight: mh,
                    // height: mh,
                    // borderWidth: 1,
                    // borderColor: "green",
                },]}>
                    <View
                        pointerEvents="none"
                        style={[{}]}
                    >
                        {content}
                    </View>
                </ScrollView>
            </View>
        )
    }

    doAgain = ({ t_s_id, t_w_id }) => {
        const { taskInfo } = this.state
        if (taskInfo.answer_type === '6' || taskInfo.answer_type === '4' || taskInfo.answer_type === '5') {
            taskInfo.t_w_id = t_w_id
            MathNavigationUtil.toMathExpandApplicationWrongDoWrongExercise({ ...this.props, data: { currentTopaicData: { ...taskInfo } } })
            return
        }
        MathNavigationUtil.toMathReDoExercisePage({ ...this.props, data: { tsid: t_s_id, twid: t_w_id } })
    }

    render() {
        const { errTaskNums, errTask, currentErrTaskType, errTypeIds, currentItemIndex, taskInfo } = this.state
        const cIndex = currentItemIndex % this.pageSize
        let showContent = this.renderQuestionData(taskInfo)
        return (
            <ImageBackground
                style={[styles.mainWrap, { backgroundColor: "#fffdf1" }]}
                source={require('../../../../../images/thinkingTraining/exercise_bg.png')}
            >
                {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(20) }]}></View> : <></>}
                {
                    Object.keys(taskInfo).length !== 0 ?
                        <View style={[appStyle.flexCenter]}>
                            <BackBtn goBack={this.goBack} style={{left:pxToDp(20),top:pxToDp(-10)}}></BackBtn>
                            <View
                                style={[styles.imgHeaderBtn]}
                            >
                                {this.renderHeaderBtn(errTypeIds, currentErrTaskType)}
                            </View>
                            <View style={[styles.questionOption, styles.questionOptionPosition]}>
                                <FlatList
                                    ref={(flatList) => { this.flatList.ref = flatList }}
                                    horizontal
                                    data={_.fill(Array(errTaskNums), 0)}
                                    renderItem={({ item, index }) => this.renderPositionCircle(item, index, currentItemIndex)}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                            <View style={[styles.toolBtnPosition]}>
                                <TouchableOpacity onPress={() => this.doAgain(errTask[cIndex])}>
                                    <ImageBackground source={require('../../../../../images/thinkingTraining/btn_bg_1.png')}
                                        style={[size_tool(240, 80), appStyle.flexCenter,]}>
                                        <Text style={[{ fontSize: pxToDp(36), color: '#fff', }, appFont.fontFamily_jcyt_700]}>再练一次</Text>
                                    </ImageBackground>
                                    {/* <Image style={[{ width: pxToDp(240), height: pxToDp(80), }]} source={require('../../../../../images/thinkingTraining/do_again.png')} resizeMode="contain"></Image> */}
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.content]}>
                                {showContent}
                            </View>
                        </View>
                        :
                        <View style={[appStyle.flexCenter]}>
                            <View
                                style={[styles.imgHeaderBtn]}
                            >
                                {this.renderHeaderBtn(errTypeIds, currentErrTaskType)}
                            </View>
                            <View style={[styles.questionOption, styles.questionOptionPosition,
                            { height: 65 }
                            ]}>
                                {/*<FlatList*/}
                                {/*    ref={(flatList) => { this.flatList.ref = flatList }}*/}
                                {/*    horizontal*/}
                                {/*    data={_.fill(Array(errTaskNums), 0)}*/}
                                {/*    renderItem={({ item, index }) => this.renderPositionCircle(item, index, currentItemIndex)}*/}
                                {/*    showsHorizontalScrollIndicator={false}*/}
                                {/*/>*/}
                            </View>
                            <View style={[styles.toolBtnPosition]}>
                                {/*<TouchableOpacity>*/}
                                {/*    <Image style={[{ width:pxToDp(240),height:pxToDp(80),}]} source={require('../../../../../images/thinkingTraining/do_again.png')} resizeMode="contain"></Image>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                            <View style={[styles.flagContent]}>
                            </View>
                        </View>
                }
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    mainWrap: {
        flex: 1,
        zIndex: -10,
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
    },
    imgHeaderBtn: {
        flexDirection: 'row',
    },
    questionOption: {
        flexDirection: 'row',
    },
    questionOptionPosition: {
        marginLeft: pxToDp(80),
        marginRight: pxToDp(80),
    },
    circle: {
        height: pxToDp(70),
        width: pxToDp(70),
        borderRadius: pxToDp(70),
        marginTop: pxToDp(20),
        marginBottom: pxToDp(20),
        alignItems: "center",
        justifyContent: "center",
    },
    bigCircle: {
        height: pxToDp(80),
        width: pxToDp(80),
        borderRadius: pxToDp(80),
        marginTop: pxToDp(10),
        marginBottom: pxToDp(10),
        alignItems: "center",
        justifyContent: "center",
    },
    circlePosition1: {
        marginLeft: 10,
        marginRight: 10,
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
        color: "black",
        fontSize: pxToDp(30),
    },
    questionKindTextPosition: {
        left: 45,
        top: 20,
    },
    questionKindText: {
        color: "#999999",
        fontSize: pxToDp(36),
    },
    stemContent: {
        maxWidth: pxToDp(1800),
        top: pxToDp(50),
        marginLeft: pxToDp(71),
        marginBottom: pxToDp(60),
    },
    content: {
        // height: Dimensions.get('window').height * 0.7,
        height: Platform.OS === "ios" ? Dimensions.get('window').height * 0.8 - pxToDp(10) : Dimensions.get('window').height * 0.75 - pxToDp(10),
        // height: pxToDp(300),
        width: Dimensions.get('window').width * 0.95,
        backgroundColor: "white",
        borderRadius: pxToDp(32),
    },
    toolBtnPosition: {
        zIndex: 1,
        position: "absolute",
        top: pxToDp(220),
        right: pxToDp(40),
    },
    flagContent: {
        height: pxToDp(830),
        width: pxToDp(1900),
        backgroundColor: "white",
        borderRadius: pxToDp(32),
        alignItems: "center",
        justifyContent: "center",
    },
    flag: {
        fontSize: pxToDp(36),

    },
})

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(['userInfo']),
    }
}

export default connect(mapStateToProps, {})(ThinkingTrainingErrTaskPage)
