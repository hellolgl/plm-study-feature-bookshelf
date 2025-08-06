import React, {PureComponent} from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from "react-native"
import {pxToDp} from "../../../../../util/tools"
import _ from 'lodash'

const log = console.log.bind(console)

class WordSelect extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imgWidth: 0,
            imgHeight: 0,
            hasImg: true,
            imgUrl: "",
            option: [],
            answer: [],
            typeName: "",
            exerciseTypeName: "",
            selectAnswer: "",
            rawData: {},
            currentQuestion: "",
            selectAnswerDict: {},
            selectVisible: false,
        }
    }

    sendAnswer = (i) => {
        const {receiveAnswer, level} = this.props
        receiveAnswer(level, i)
    }

    judgeAnswer = (receiveAnswer) => {
        const {selectAnswerDict, answer, option} = this.state
        // log("option: ", option)
        let isSingleAnswer = false
        let singleAnswerIndex = -1
        let singleAnswer = ""
        for (let optionKey in option) {
            if (option[optionKey].length === 1) {
                isSingleAnswer = true
                singleAnswerIndex = parseInt(optionKey) - 1
                singleAnswer = option[optionKey][0]["option"]
            }
        }
        const newInfo = {
            [receiveAnswer["title"]]: receiveAnswer["option"]["option"]
        }
        const newAnswer = {...selectAnswerDict, ...newInfo}
        const answerValues = Object.values(newAnswer)
        // this.splice(index, 0, item);
        if (isSingleAnswer) {
            answerValues.splice(singleAnswerIndex, 0, singleAnswer)
        }
        let r = "0"
        for (let i=0; i < answer.length; i++) {
            let a = answer[i]
            // log('标准答案: ', a)
            // log("学生答案: ", answerValues)
            if (_.isEqual(a, answerValues)) {
                r = "1"
            }
        }
        this.sendAnswer(r)
    }

    renameKeys = (obj, newKeys) => {
        const keyValues = Object.keys(obj).map(key => {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    }

    updateData = (rawData) => {
        const {tta, tto, stem, displayed_type_name, exercise_type_name, right_count} = rawData
        this.parseHTML(stem)
        const answerDict = {}
        tto.map(t => {
            answerDict[t["t_o_id"]] = t["option"]
        })
        /*
        * currentQuestion: "",
            selectAnswerDict: {},
            selectVisible: false,
        * */
        this.setState({
            option: _.groupBy(tto, (item) => item["index"]),
            answer: tta.map(d => {
                let ids = d["t_o_id"]
                return ids.map(id => answerDict[id])
            }),
            typeName: displayed_type_name,
            exerciseTypeName: exercise_type_name,
            rawData: rawData,
            hasImg: stem.includes("<img"),
            currentQuestion: "",
            selectAnswerDict: {},
            selectVisible: false,
        })
    }

    componentDidMount() {
        let {rawData} = this.props
        this.updateData(rawData)
    }

    componentWillUpdate(nextProps) {
        if (_.isEqual(this.props.rawData["tto"], nextProps.rawData["tto"]) === false) {
            let {rawData} = nextProps
            this.updateData(rawData)
        }
    }

    clickOption = (title, option) => {
        const {currentQuestion, selectAnswerDict} = this.state
        if (title === currentQuestion) {
            selectAnswerDict[title] = option['option']
            this.judgeAnswer({title, option})
            this.setState({
                selectAnswerDict: {...selectAnswerDict},
                selectVisible: false,
            })
        }
    }

    optionTemplate = (title, options) => {
        const {currentQuestion, selectAnswerDict, selectVisible} = this.state
        const maxLength = Math.max(...options.map(option => option["option"].length))
        const contentColor = "#c5d8ff"
        const focusContentColor = "#7da6ff"
        const unselectContentColor = "#d9d9d9"

        const questionContentColor = "#fde4b2"
        const questionFocusContentColor = "#ffc23c"
        const questionUnselectsContentColor = "#d9d9d9"

        let selectBg = focusContentColor
        if (title === "问题") {
            selectBg = questionFocusContentColor
        }

        let showSelect = "请选择"
        if (selectAnswerDict[title] !== undefined) {
            showSelect = selectAnswerDict[title]
        }
        if (options.length === 1) {
            showSelect = options[0]["option"]
            selectBg = "black"
        }
        //pxToDp(550)
        const maxWidth = pxToDp(550)
        let contentWidth = maxLength * 20 + 30 > maxWidth ? maxWidth: maxLength * 20 + 30

        return (
            <View style={[styles.box, styles.boxPosition]}>
                <View style={[styles.title]}>
                    <Text style={[styles.selectTitle]}>{title}</Text>
                </View>
                {options.map(option => {
                    let bg = unselectContentColor
                    if (options.length === 1) {
                        bg = "white"
                    } else if (title === currentQuestion && selectVisible) {
                        if (title === "问题") {
                            bg = questionContentColor
                        } else {
                            bg = contentColor
                        }
                    } else if (option["option"] === selectAnswerDict[title]) {
                        if (title === "问题") {
                            bg = questionFocusContentColor
                        } else {
                            bg = focusContentColor
                        }
                    }
                    return (
                        <View>
                            <TouchableOpacity onPress={() => this.clickOption(title, option)}
                                              style={[styles.button2, {
                                                  minHeight: 50,
                                                  paddingRight: 10,
                                                  paddingLeft: 10,
                                                  width: contentWidth,
                                                  borderColor: bg,
                                              }]}>
                                <Text style={[styles.selectOption]}>{option["option"]}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
                {showSelect === "请选择"?
                    <TouchableOpacity
                        onPress={() => this.setState({"currentQuestion": title, selectVisible: true,},)}
                        style={[styles.selectAnswerPosition, {alignItems: "center"}, {width: contentWidth, }]}
                    >
                        <Text style={[styles.selectAnswer, {color: selectBg,}]}>{showSelect}</Text>
                        <View style={{height: 2, backgroundColor: selectBg, marginTop: -4, width: contentWidth}} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => this.setState({"currentQuestion": title, selectVisible: true,})}
                        style={[styles.selectAnswerPosition, {alignItems: "center", width: contentWidth, }]}
                    >
                        <Text style={[styles.selectAnswer, {color: selectBg, textDecorationLine: "underline"}]}>{showSelect}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    renderOption = () => {
        const {option, selectAnswer} = this.state
        if (option.length === 0) {
            return
        }
        let keys = Object.keys(option)
        const maxKey = Math.max(...keys).toString()
        let r = []
        for (let k in option) {
            let values = option[k]
            let title = `条件${k}`
            if (k === maxKey) {
               title = "问题"
            }
            const options = values.map(d => {
                return {
                    option: d["option"],
                    id: d["t_o_id"]
                }
            })
            r.push(this.optionTemplate(title, options))
        }
        return r
    }

    parseHTML = (html) => {
        if (html.includes("<img src=")) {
            let imgStart = html.indexOf("<img src")
            let p = html.slice(imgStart, html.length)
            // parse html
            let ep = p.indexOf("</p")
            let imgDiv = p.slice(p, ep)
            let s = imgDiv.indexOf("src=")
            let t = imgDiv.slice(s + 5, imgDiv.length - 1)
            let e = t.indexOf('"')
            let uri = t.slice(0, e)
            // get img size
            Image.getSize(uri, (imgWidth, imgHeight) => {
                this.setState({
                    imgWidth,
                    imgHeight,
                    imgUri: uri,
                })
            })
        }
    }

    render() {
        return (
            <View style={[styles.content]}>
                <View style={[styles.flexRowLayout, styles.optionPosition]}>
                    {this.renderOption()}
                </View>
                <View style={[styles.questionTextPosition]}>
                    <Text style={[styles.questionText]}>题目:</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        height: pxToDp(800),
        // borderWidth: 1,
        // borderColor: "red",
        left: pxToDp(50),
        // width: 1150,
        // flex: 1,
    },
    questionText: {
        fontSize: pxToDp(36),
    },
    questionTextPosition: {
        // borderColor: "green",
        // borderWidth: 1,
        position: "absolute",
        top: pxToDp(550),
    },
    selectAnswer: {
        fontSize: pxToDp(34),
        // textDecorationLine: "underline",
    },
    selectAnswerPosition: {
        position: "absolute",
        top: pxToDp(555),
        // top: pxToDp(280),
        // borderWidth: 1,
        // borderColor: "red",
        // Bottom: pxToDp(100),
    },
    optionPosition: {
        // top: pxToDp(60),
        // marginTop: pxToDp(10),
        marginLeft: pxToDp(90),
    },

    imgPosition: {
        top: pxToDp(60),
    },
    selectTitle: {
        fontSize: pxToDp(40),
        marginBottom: 10,
    },
    selectOption: {
        fontSize: pxToDp(34),
        // color: ""
    },
    selectOptionText: {
        fontSize: pxToDp(34),
        color: "#333333",
    },
    optionItem: {
    },
    flexRowLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    box: {
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "black",
    },
    title: {
        alignItems: "center"
    },
    boxPosition: {
        marginLeft: pxToDp(18),
    },
    button2: {
        maxWidth: pxToDp(550),
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        // backgroundColor: "grey",
        borderWidth: 3,
    },
})

export default WordSelect
