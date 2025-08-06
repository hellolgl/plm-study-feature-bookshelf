import React, {PureComponent} from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native"
import {pxToDp} from "../../../../../util/tools"
import _ from 'lodash'

const log = console.log.bind(console)

class QtyRelationsSelect extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imgWidth: 0,
            imgHeight: 0,
            hasImg: true,
            imgUrl: "",
            content: [],
            option: [],
            answer: [],
            question: [],
            typeName: "",
            exerciseTypeName: "",
            rawData: {},
            questionPosition: {},
            currentClick: ""
        }
        this.specialWord = "     "
        this.contentColor = "#c5d8ff"
        this.focusContentColor = "#7da6ff"
        this.unselectContentColor = "#d9d9d9"
    }

    sendAnswer = (i) => {
        const {receiveAnswer, level} = this.props
        receiveAnswer(level, i)
    }

    judgeAnswer = () => {
        const {answer, question, questionPosition} = this.state
        // log('answer: ', answer)
        // log('question: ', question)
        // log('questionPosition: ', questionPosition)
        // 利用 questionPosition 记录了用户点选的数据
        // 需要利用 questionPosition 的 key, `${line}_${index}` 去定位到具体位置的数据
        // 然后更新到 question 的二维数组中，进而与正确答案进行比对
        for (let questionPositionKey in questionPosition) {
            let v = questionPosition[questionPositionKey]
            let [i0, i1] = questionPositionKey.split("_")
            question[i0][i1] = v
        }
        let r = "0"
        if (_.isEqual(question, answer)) {
            r = "1"
        }
        this.sendAnswer(r)
    }

    updateData = (rawData) => {
        const {tta, tto, stem, displayed_type_name, exercise_type_name, right_count} = rawData
        this.parseHTML(stem)
        const answerDict = {}
        tto.map(t => {
            answerDict[t["t_o_id"]] = t["option"]
        })
        const questionPosition = {}
        this.setState({
            option: tto.filter(d => d["is_jam"] === "0"),
            answer: tta.map(d => {
                let ids = d["t_o_id"]
                return ids.map(id => answerDict[id])
            }),
            question: tta.map((d, i0) => {
                let ids = d["t_o_id"]
                let removeIds = d["t_b_id"] === null? []: d["t_b_id"]
                return ids.map((id, i1) => {
                    if (removeIds.includes(id)) {
                        questionPosition[`${i0}_${i1}`] = this.specialWord
                        return this.specialWord
                    } else {
                        return answerDict[id]
                    }
                })
            }),
            typeName: displayed_type_name,
            exerciseTypeName: exercise_type_name,
            rawData: rawData,
            hasImg: stem.includes("<img"),
            questionPosition,
            currentClick: ""
        })
    }

    componentDidMount() {
        let {rawData} = this.props
        this.updateData(rawData)
    }

    componentWillUpdate(nextProps) {
        if (this.props.rawData["stem"] !== nextProps.rawData["stem"]) {
            let {rawData} = nextProps
            this.updateData(rawData)
        }
    }

    clickOption = (option) => {
        const {currentClick, questionPosition} = this.state
        if (currentClick === "") {
            return
        }
        questionPosition[currentClick] = option["option"]
        this.judgeAnswer()
        this.setState({
            questionPosition: {...questionPosition}
        })
    }

    clickAnswer = (answer, key) => {
        const {questionPosition} = this.state
        this.setState({
            currentClick: key,
            questionPosition: {...questionPosition}
        })
    }

    optionTemplate = (option) => {
        const {questionPosition} = this.state
        const qvalues = Object.values(questionPosition)
        let bg = this.unselectContentColor
        const o = option["option"]
        let contentWidth = o.length * 20 + 40
        if (qvalues.includes(o)) {
            bg = this.focusContentColor
        }
        return (
            <TouchableOpacity onPress={() => this.clickOption(option)}
                              style={[styles.button2, {
                                  // width: contentWidth,
                                  borderColor: bg,
                              }]}>
                <Text style={[styles.selectOption]}>{o}</Text>
            </TouchableOpacity>
        )
    }

    renderOption = (option) => {
        let r = []
        option = option.map(item => {
            return {
                "option": item["option"],
                "t_o_id": item["t_o_id"],
            }
        })
        r = option.map(item => this.optionTemplate(item))
        return r
    }

    listItem = (item, index, i0, currentClick, questionPosition) => {
        const _q = item
        const i1 = index
        let tk = `${i0}_${i1}`
        let bg = this.unselectContentColor
        if (tk === currentClick) {
            bg = this.focusContentColor
        }
        let t = questionPosition[`${i0}_${i1}`]
        if (t === this.specialWord) {
            let contentWidth = _q.length * 20 + 40
            return <TouchableOpacity onPress={() => this.clickAnswer(_q, tk)}
                                     style={[styles.button3, {
                                         width: contentWidth,
                                         borderColor: bg,
                                     }]}>
                <Text style={[styles.selectOption]}>{_q}</Text>
            </TouchableOpacity>
        } else if (t === undefined) {
            return <View
                style={[styles.box3, {
                }]}>
                <Text style={[styles.questionText]}>{_q}</Text>
            </View>
        } else {
            return <TouchableOpacity onPress={() => this.clickAnswer(_q, tk)}
                                     style={[styles.button3, {
                                         // width: contentWidth,
                                         borderColor: bg,
                                     }]}>
                <Text style={[styles.selectOption]}>{t}</Text>
            </TouchableOpacity>
        }
    }

    renderQuestion = (question, questionPosition, currentClick) => {
        let r = []
        for (let i=0; i < question.length; i++) {
            let i0 = i
            let q = question[i]
            r.push(
                <FlatList
                    horizontal
                    data={q}
                    renderItem={({ item, index }) => this.listItem(item, index, i0, currentClick, questionPosition)}
                    showsHorizontalScrollIndicator={false}
                />
            )
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
        let {option, question, questionPosition, currentClick} = this.state
        let {hasImg, imgUri, imgWidth, imgHeight } = this.state
        return (
            <View
                style={{ backgroundColor: 'whi', width: "100%"/*justifyContent: 'center',alignItems: 'center',*/ ,
                    // borderWidth: 1,
                    // borderColor: "red",
            }}
            >
                {
                    option.length === 0?
                        null
                        :
                        <View style={[styles.content]}>
                            {hasImg?
                                <Image style={[{ width:imgWidth,height:imgHeight}]} source={{uri: imgUri}} resizeMode="contain"></Image>
                                :
                                null
                            }
                            <View style={[styles.options, styles.flexRowLayout, styles.optionPosition, ]}>
                                {this.renderOption(option)}
                            </View>
                            <View style={[{"borderWidth": 1, "borderColor": "#92d2f2", marginTop: pxToDp(10), marginRight: pxToDp(20)}]}></View>
                            <View style={[styles.questions, styles.questionPosition, ]}>
                                {this.renderQuestion(question, questionPosition, currentClick)}
                            </View>
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        marginLeft: pxToDp(70),
        marginRight: pxToDp(50),
        // marginTop: pxToDp(30),
    },
    selectAnswer: {
        fontSize: pxToDp(30),
        // textDecorationLine: "underline",
    },
    selectAnswerPosition: {
        position: "absolute",
        top: pxToDp(484),
        // borderWidth: 1,
        // borderColor: "red",
    },
    options: {
        // maxWidth: pxToDp(1800),
        // width: pxToDp(1700),
        // borderColor: "red",
        // borderWidth: 1,
    },
    optionPosition: {
        marginTop: pxToDp(30),
        marginLeft: pxToDp(30),
    },
    questions: {
        // borderWidth: 1,
        // borderColor: "red",
        // maxWidth: pxToDp(1800),
        // maxWidth: 100,
        // borderWidth: 1,
        // borderColor: "red",
    },
    questionPosition: {
        marginTop: pxToDp(20),
        marginLeft: pxToDp(10),
    },
    questionText: {
        fontSize: pxToDp(36),
        marginLeft: pxToDp(10),
        marginRight: pxToDp(10),
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
        fontSize: pxToDp(36),
        // color: "#669FFD",
        color: "#333333",
    },
    optionItem: {
    },
    flexRowLayout: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    title: {
        alignItems: "center"
    },
    button2: {
        // maxWidth: pxToDp(550),
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 7,
        // backgroundColor: "grey",
        borderWidth: 3,
        minHeight: 60,
        marginRight: 20,
    },
    box3: {
        // borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        // backgroundColor: "grey",
        // borderWidth: 3,
        minHeight: 60,
        // marginLeft: pxToDp(-),
        // marginRight: pxToDp(-8),
        flexWrap: 'wrap',
        marginLeft: pxToDp(12),
    },
    button3: {
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        // backgroundColor: "grey",
        borderWidth: 3,
        minHeight: 60,
        marginLeft: pxToDp(10),
        marginRight: pxToDp(10),
    },
})

export default QtyRelationsSelect
