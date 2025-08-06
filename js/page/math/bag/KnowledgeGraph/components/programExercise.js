import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    DeviceEventEmitter,
    TextInput
} from "react-native";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import RichShowViewHtml from '../../../../../component/richShowViewNew'
import Keyboard from "./keyBoard";
import FinishModal from './FinishModal'
import InputModal from "./InputModal";
import MsgModal from "./msgModal";
import WordModal from "./wordModal";
const colorobj = {
    num: '#CFD6E5',
    jia: '#2FDCA8',
    one: '#FF935E',
    other: '#5A5A68',
}
class KnowledgeGraphPage extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined
        this.state = {
            checkIndex: 0,
            exercise: props.exercise,
            exercise_steps: props.exercise.exercise_steps,
            is_guide: props.exercise.is_guide === '1', //是否引导
            finishVisible: false,
            isfinish: false,
            isWrong: false,
            wrongIndex: 0,
            inputVisible: false,
            inputList: [],
            exercise_result: props.exercise.exercise_result,
            msgVisible: false,
            showtitle: false,
            msgTxt: '',
            pinyin: props.exercise.pinyin,
            msgTxtPinyin: '',
            wordVisible: false,
            wordDetail: {},
            wordType: ''
        };
    }
    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        if (JSON.stringify(props.exercise.exercise_id) !== JSON.stringify(tempState.exercise.exercise_id)) {
            tempState.exercise = props.exercise
            tempState.exercise_steps = props.exercise.exercise_steps
            tempState.is_guide = props.exercise.is_guide === '1'
            tempState.inputList = []
            tempState.isfinish = false
            return tempState
        }
        return null
    }
    checkIndexNow = (index) => {
        if (this.state.is_guide) return
        this.setState({
            checkIndex: index,
            isWrong: false
        })
    }
    changeValues = (value, type) => {
        const { checkIndex, exercise_steps } = this.state
        let list = JSON.parse(JSON.stringify(exercise_steps))
        list[checkIndex].inputValue.push({
            value, type
        })
        // console.log('啊啊啊啊啊啊', list)
        this.setState({
            exercise_steps: list,
            wrongIndex: 0,
            isWrong: false,
        })
    }
    guidChangeValues = (value, type, bigindex) => {
        const { checkIndex, exercise_steps } = this.state
        let list = JSON.parse(JSON.stringify(exercise_steps))
        list[checkIndex].inputValue.push({
            value, type
        })

        this.setState({
            exercise_steps: list,
            checkIndex: bigindex,
            isfinish: bigindex === -1,
            isWrong: false
        })
    }
    clickBtn = (i, index) => {
        const { is_guide, exercise_steps } = this.state
        if (is_guide) return
        let list = JSON.parse(JSON.stringify(exercise_steps))
        list[index].inputValue.splice(i, 1)
        this.setState({
            exercise_steps: list
        })
    }
    finish = () => {
        const { is_guide, isfinish, exercise_steps, exercise, } = this.state
        let msgTxtnow = ''
        if (is_guide && isfinish) {
            //  变量型题目  要先输入变量
            if (exercise.exercise_type === '2') {
                this.setinput()
            } else {
                this.setState({
                    finishVisible: true,
                    exercise_result: exercise.exercise_result,
                    pinyin: exercise.pinyin,
                })
            }

        } else {
            let isWrong = false, wrongIndex = 0
            for (let i = 0; i < exercise_steps.length; i++) {
                let item = exercise_steps[i]
                // 按钮数量不对，直接错
                if (item.name_json.length !== item.inputValue.length) {
                    isWrong = true
                    wrongIndex = i
                    msgTxtnow = item.name_json.join('')
                    break
                }
                let index = item.name_json.filter((i, n) => i !== item.inputValue[n].value)
                if (index.length > 0) {
                    // 有错误的
                    isWrong = true
                    wrongIndex = i
                    msgTxtnow = item.name_json.join('')
                    break
                }
                // console.log('错误的index', index)
            }
            if (exercise.exercise_type === '2' && !isWrong) {
                this.setinput()
            } else {
                this.setState({
                    isWrong,
                    exercise_result: exercise.exercise_result,
                    wrongIndex,
                    finishVisible: !isWrong,
                    msgVisible: isWrong,
                    msgTxt: msgTxtnow,
                    showtitle: true,
                    pinyin: exercise.pinyin,
                    msgTxtPinyin: ''
                })
            }

        }

    }
    setinput = () => {
        const { exercise_steps, } = this.state
        let list = []
        exercise_steps.forEach((item) => {
            if (item.is_variable === '1') {
                list.push({
                    text: item.guide_tip,
                    text_pinyin: item.guide_tip_pinyin,
                    min: Number(item.min_val),
                    max: Number(item.max_val),

                })
            }
        })
        this.setState({
            inputList: list,
            inputVisible: true
        })
    }
    sureInput = (numList) => {
        // 输入完毕，关闭弹窗，运行代码
        const { exercise_steps } = this.state
        this.setState({
            inputVisible: false
        })
        let codelist = []
        let index = 0
        let jieguo = ''
        exercise_steps.forEach((item) => {
            let str = ''
            if (item.is_variable === '1') {
                str = item.name_json.join('')
                let i = str.indexOf('=')
                str = str.substring(0, i + 1)
                str += numList[index]
                ++index
                str = 'let ' + str
            } else {
                str = item.name_json.join('')
                let isConsole = str.indexOf('Print')
                if (isConsole !== -1) {
                    str = str.replace('Print', 'jieguo=')
                    // str += ')'
                    // jieguo = str.substring(6, str.length - 1)
                } else {
                    str = 'let ' + str
                }
            }
            codelist.push(
                str
            )

        })
        let codester = codelist.join(';')
        let a = eval(codester)
        // console.log('代码', codester, a)

        this.setState({
            exercise_result: a + '',
            finishVisible: true,
            pinyin: ''
        })
    }
    changeStatus = () => {
        if (!this.state.is_guide) {
            // 下一题
            this.props.next()
        }
        this.setState({
            finishVisible: false,
            is_guide: false,
            isWrong: false,
            wrongIndex: 0,
            exercise_result: '',
            pinyin: '',
            exercise_steps: this.props.exercise.exercise_steps,
            checkIndex: 0,
        })
    }
    loogMsg = (index) => {
        this.setState({
            msgVisible: true,
            msgTxt: this.state.exercise_steps[index].explain,
            showtitle: false,
            msgTxtPinyin: this.state.exercise_steps[index].explain_pinyin,
        })
    }
    lookWord = (item, type) => {
        this.setState({
            wordDetail: item,
            wordType: type,
            wordVisible: true
        })
    }
    render() {
        const { checkIndex, exercise, exercise_steps, is_guide, finishVisible, isWrong, wrongIndex, inputVisible, inputList, exercise_result, msgVisible, showtitle, msgTxt, pinyin, msgTxtPinyin, wordDetail, wordType, wordVisible } = this.state
        const { exercise_stem, word, keyboard } = exercise
        // console.log('编程题', exercise)
        let s = exercise_stem.replaceAll("<rt>", "<rt>&nbsp;")
        s = s.replaceAll("</rt>", "&nbsp;</rt>")
        // s = s.replaceAll("<ruby>", "<ruby>&nbsp;")
        return (
            <View style={[styles.container, padding_tool(0, 40, 0, 40)]}>
                <View style={[appStyle.flexTopLine, { flex: 1, backgroundColor: '#fff', borderRadius: pxToDp(40), padding: pxToDp(60) }]}>
                    <View style={[{ width: pxToDp(570), paddingBottom: pxToDp(200) }]}>
                        <ScrollView style={[{ flex: 1 }]}>
                            <RichShowViewHtml value={s} size={2} width={pxToDp(500)} />
                            <View style={[{ paddingTop: pxToDp(40) }]}>
                                {
                                    word.map((item, index) => {
                                        return item.chinese ? <View style={[appStyle.flexTopLine, { marginBottom: pxToDp(20) }]} key={index}>
                                            <TouchableOpacity onPress={this.lookWord.bind(this, item, 'ch')} style={[styles.wordWrap, borderRadius_tool(40, 10, 10, 40), { marginRight: pxToDp(6) }]}><Text style={[styles.wordTxt]}>{item.chinese}</Text></TouchableOpacity>
                                            <TouchableOpacity onPress={this.lookWord.bind(this, item, 'en')} style={[styles.wordWrap, borderRadius_tool(10, 40, 40, 10)]}><Text style={[styles.wordTxt]}>{item.english}</Text></TouchableOpacity>
                                        </View> : null
                                    })
                                }
                            </View>
                        </ScrollView>

                    </View>
                    <View style={[appStyle.flexTopLine]}>
                        <View style={[{ marginRight: pxToDp(40) }]}>

                            {
                                exercise_steps.map((item, index) => {
                                    let borderColor = '#EDEDEE'
                                    let icon = require('../../../../../images/mathProgram/statusIcon3.png')
                                    if (checkIndex === index) {
                                        borderColor = '#00B295'
                                    }
                                    if (isWrong && wrongIndex === index) {
                                        borderColor = '#FF6565'
                                        icon = require('../../../../../images/mathProgram/statusIcon4.png')
                                    }
                                    if (isWrong && wrongIndex > index) {
                                        icon = require('../../../../../images/mathProgram/statusIcon2.png')
                                    }
                                    return <View style={[size_tool(1140, 120), borderRadius_tool(30), {
                                        borderWidth: pxToDp(4),
                                        borderColor: borderColor,
                                        borderStyle: checkIndex === index || (isWrong && wrongIndex === index) ? 'solid' : 'dashed',
                                        marginBottom: pxToDp(20),
                                        padding: pxToDp(20), position: 'relative'
                                    }]}>
                                        <TouchableOpacity style={[{ flex: 1, justifyContent: 'center' }]} onPress={this.checkIndexNow.bind(this, index)}>
                                            <Text style={[{ fontSize: pxToDp(48), color: '#C9C9CD', lineHeight: pxToDp(50) }, appFont.fontFamily_jcyt_700]}>{item.inputValue.length === 0 ? item.nameStr : ''}</Text>
                                        </TouchableOpacity>
                                        <View style={[{ height: pxToDp(120), position: 'absolute', top: pxToDp(-4), left: pxToDp(0), alignItems: 'center', paddingLeft: pxToDp(20) }, appStyle.flexTopLine,]}>
                                            {
                                                item.inputValue.map((i, j) => {

                                                    return <TouchableOpacity onPress={this.clickBtn.bind(this, j, index)} key={j} style={[styles.item, appStyle.flexCenter, padding_tool(0, 32, 0, 32), { backgroundColor: colorobj[i.type], position: 'relative' }]}>
                                                        <Text style={[{ fontSize: pxToDp(44), color: i.type === 'other' ? '#fff' : '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{i.value}</Text>
                                                        {is_guide ? null : <View style={[size_tool(40), appStyle.flexCenter, { position: 'absolute', backgroundColor: colorobj[i.type], top: pxToDp(-10), right: pxToDp(-10) }, borderRadius_tool(20)]}>
                                                            <Image source={require('../../../../../images/mathProgram/cha.png')} style={[size_tool(16)]} />
                                                        </View>}
                                                    </TouchableOpacity>
                                                })
                                            }
                                        </View>
                                        <TouchableOpacity onPress={this.loogMsg.bind(this, index)} style={[{ position: 'absolute', right: pxToDp(30), top: pxToDp(40) }, size_tool(60)]}>
                                            <Image source={icon} style={[size_tool(40)]} />
                                        </TouchableOpacity>
                                    </View>
                                })
                            }
                        </View>

                        <TouchableOpacity onPress={this.finish}>
                            <View style={[size_tool(100), { backgroundColor: '#00836D', borderRadius: pxToDp(50), paddingBottom: pxToDp(4), marginBottom: pxToDp(20) }]}>
                                <View style={[{ flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(50) }, appStyle.flexCenter]}>
                                    <Image source={require('../../../../../images/mathProgram/run.png')} style={[size_tool(60)]}></Image>

                                </View>
                            </View>
                            <Text style={[{ fontSize: pxToDp(20), color: '#00B295', marginBottom: pxToDp(6), lineHeight: pxToDp(26) }, appFont.fontFamily_jcyt_500]}>yùn xíng</Text>
                            <Text style={[{ fontSize: pxToDp(36), color: '#00B295', lineHeight: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>运行 </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[{ position: 'absolute', bottom: pxToDp(0), zIndex: 999 }]}>
                    <Keyboard is_guide={is_guide} keyboard={keyboard} exercise={exercise} changeValues={this.changeValues} onRef={(ref) => { this.Keyboard = ref }} guidChangeValues={this.guidChangeValues}></Keyboard>
                </View>
                <FinishModal visible={finishVisible} close={() => {
                    this.setState({
                        finishVisible: false
                    })
                    this.props.goBack()
                }} is_guide={is_guide} exercise_type={exercise.exercise_type} todo={this.changeStatus} result={exercise_result} pinyin={pinyin} />
                <InputModal
                    visible={inputVisible} close={this.sureInput}
                    inputList={inputList}
                />
                <MsgModal visible={msgVisible} close={() => this.setState({
                    msgVisible: false
                })}
                    txt={msgTxt} txtPinyin={msgTxtPinyin} showTitle={showtitle} />
                {wordVisible ? <WordModal visible={wordVisible} close={() => this.setState({
                    wordVisible: false
                })}
                    word={wordDetail} wordType={wordType}
                /> : null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        height: pxToDp(120),
        ...appStyle.flexLine,
        ...appStyle.flexJusCenter
    },
    back_btn: {
        ...appStyle.flexLine,
        position: "absolute",
        left: pxToDp(0)
    },
    wordWrap: {
        ...appStyle.flexCenter,
        padding: pxToDp(20),
        backgroundColor: '#EFEFF0',
    },
    wordTxt: {
        fontSize: pxToDp(40),
        color: '#4C4C59',
        lineHeight: pxToDp(46),
        ...appFont.fontFamily_jcyt_700
    },
    item: {
        height: pxToDp(90),
        borderRadius: pxToDp(20),
        marginRight: pxToDp(10)
    },
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(KnowledgeGraphPage);
