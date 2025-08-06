import React, {PureComponent} from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native"
import _ from "lodash"

import {pxToDp} from "../../../../../util/tools"
import {appStyle} from "../../../../../theme"
import TextView from "../TextView"

const log = console.log.bind(console)

class ABCSelectTitle extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            stem: "",
            imgWidth: 0,
            imgHeight: 0,
            hasImg: true,
            imgUrl: "",
            option: [],
            answer: "",
            typeName: "",
            exerciseTypeName: "",
            selectAnswer: "",
            rawData: {},
        }
    }

    getSelectOption = (i) => {
        return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"][parseInt(i)]
    }

    sendAnswer = (i) => {
        const {receiveAnswer, level} = this.props
        receiveAnswer(level, i)
    }

    judgeAnswer = (receiveAnswer) => {
        const {answer} = this.state
        let r = "0"
        // log(answer)
        if (answer.startsWith("[[")) {
            const a = _.flattenDeep(JSON.parse(answer)).join(",")
            if (receiveAnswer === a) {
                r = "1"
            }
        } else {
            if (receiveAnswer === answer) {
                r = "1"
            }
        }
        this.sendAnswer(r)
    }

    componentDidMount() {
        let {rawData} = this.props
        const {tta, tto, stem, displayed_type_name, exercise_type_name} = rawData
        this.parseHTML(stem, rawData["sub_img"])
        this.setState({
            option: tto.map(d => d["option"]),
            answer: tta[0]["answer"],
            typeName: displayed_type_name,
            exerciseTypeName: exercise_type_name,
            rawData: rawData,
            hasImg: stem.includes("<img") || rawData["sub_img"] !== "",
        })
    }

    componentWillUpdate(nextProps) {
        if (this.props.rawData["stem"] !== nextProps.rawData["stem"]) {
            let {rawData} = nextProps
            const {tta, tto, stem, displayed_type_name, exercise_type_name} = rawData
            this.parseHTML(stem, rawData["sub_img"])
            this.setState({
                option: tto.map(d => d["option"]),
                answer: tta[0]["answer"],
                typeName: displayed_type_name,
                exerciseTypeName: exercise_type_name,
                rawData: rawData,
                selectAnswer: "",
                hasImg: stem.includes("<img") || rawData["sub_img"] !== "",
            })
        }
    }

    selectAnswer = (i) => {
        this.judgeAnswer(i)
        this.setState({
            selectAnswer: i
        })
    }

    renderFraction = (value, fontColor)=>{
        if(value.length === 1){
            return <Text style={[styles.middle, {fontSize:pxToDp(36), color: fontColor}]}>{value[0]}</Text>
        }
        if(value.length === 2){
            return <View style={[ {
                paddingLeft: 4, paddingRight: 4}]}>
                <Text style={[styles.top,{position: "absolute", fontSize:pxToDp(32),textAlign:'center', color: fontColor, borderColor: fontColor}]}>{value[0]}</Text>
                <Text style={[styles.bottom, {fontSize:pxToDp(32),textAlign:'center', color: fontColor}]}>{value[1]}</Text>
            </View>
        }
        if(value.length === 3){
            return <View style={[appStyle.flexLine]}>
                <Text style={[{fontSize:pxToDp(36)}]}>{value[0]}</Text>
                <View>
                    <Text style={[styles.top, {fontSize:pxToDp(36),textAlign:'center', color: fontColor, borderColor: fontColor}]}>{value[1]}</Text>
                    <Text style={[styles.bottom, {fontSize:pxToDp(36),textAlign:'center', color: fontColor}]}>{value[2]}</Text>
                </View>
            </View>
        }
    }

    renderOption = (size) => {
        const {option, hasImg, selectAnswer} = this.state
        let maxWidth = pxToDp(2000)
        if (size === "small") {
            maxWidth = pxToDp(900)
        }
        return (
            <View style={[{"maxWidth": maxWidth}, styles.optionPosition]}>
                {option.map((d, index) => {
                    if (d.startsWith("[[")) {
                        let fontColor = "black"
                        if (selectAnswer === this.getSelectOption(index)) {
                            fontColor = "#669FFD"
                        }
                        const fontStyle = {
                            color: fontColor,
                            borderColor: fontColor,
                        }
                        let contentStyle
                        if (hasImg) {
                            contentStyle = {
                                maxWidth: pxToDp(850),
                                flexWrap: "wrap",
                            }
                        }
                        return (
                            <TouchableOpacity
                                style={[{marginBottom: 10, }]}
                                key={d} onPress={() => this.selectAnswer(this.getSelectOption(index))}>
                                <View
                                    style={[
                                        {
                                            flexDirection: "row",
                                            alignItems: "center",
                                            // borderWidth: 1,
                                            // borderColor: "green",
                                        }
                                    ]}
                                >
                                    <Text style={[styles.selectOption]}>{this.getSelectOption(index)}. </Text>
                                    <TextView textStyle={fontStyle} value={JSON.parse(d)} contentStyle={contentStyle}/>
                                </View>
                            </TouchableOpacity>
                        )
                    } else {
                        return (
                            <TouchableOpacity
                                style={[{marginBottom: 10}]}
                                key={d} onPress={() => this.selectAnswer(this.getSelectOption(index))}>
                                <Text>
                                    <Text style={[styles.selectOption]}>{this.getSelectOption(index)}. </Text>
                                    {selectAnswer === this.getSelectOption(index)?
                                        <Text style={[styles.selectOptionText, {color: "#669FFD"}]}>{d}</Text>
                                        :
                                        <Text style={[styles.selectOptionText]}>{d}</Text>
                                    }
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                })}
            </View>
        )
    }

    parseHTML = (html, subImg) => {
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
        } else if (subImg !== "") {
            const imgUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${subImg}`
            Image.getSize(imgUri, (imgWidth, imgHeight) => {
                this.setState({
                    imgWidth,
                    imgHeight,
                    imgUri: imgUri,
                })
            })
        }
    }

    render() {
        let {hasImg, imgUri, imgWidth, imgHeight } = this.state
        // log("hasImg: ", hasImg)
        if (hasImg) {
            return (
                <ScrollView
                    style={{ maxHeight: 450, backgroundColor: 'whi', width: "100%",
                        // borderWidth: 1,
                        // borderColor: "red",
                    }}
                >
                    <View style={[styles.content]}>
                        <View style={[styles.imgContent, styles.imgPosition]}>
                            <Image style={[{ width:pxToDp(imgWidth) * 1.5, height:pxToDp(imgHeight) * 1.5}]} source={{uri: imgUri}} resizeMode="contain"></Image>
                        </View>
                        <View style={[styles.floatOptionPosition]}>
                            {this.renderOption("small")}
                        </View>
                    </View>
                </ScrollView>
            )
        } else {
            return (
                <ScrollView
                    style={{ maxHeight: 420, backgroundColor: 'whi', width: "100%",
                        // borderWidth: 1,
                        // borderColor: "green",
                    }}
                >
                    <View style={[styles.content]}>
                        {this.renderOption("big")}
                    </View>
                </ScrollView>
            )
        }
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        left: pxToDp(70),
        // width: 1150,
        // height: pxToDp(650),
        marginTop: pxToDp(30),
        maxWidth: pxToDp(1730),
        // borderWidth: 1,
        // borderColor: "red",
    },
    imgContent: {
        // borderColor: "red",
        // borderWidth: 1,
        width: pxToDp(920),
    },
    questionText: {
        fontSize: pxToDp(36),
    },
    optionPosition: {
        // marginTop: pxToDp(100),
    },
    imgPosition: {
        marginTop: pxToDp(20),
    },
    selectOption: {
        fontSize: pxToDp(40),
    },
    selectOptionText: {
        fontSize: pxToDp(36),
        // color: "#669FFD",
        color: "#333333",
    },
    floatOptionPosition: {
        // borderWidth: 1,
        // borderColor: "green",
        maxWidth: pxToDp(800),
        // marginLeft: 30,
        // position: "absolute",
        // left: 30,
        // minHeight: 1000,
        // top: -20,
    },
    top:{
        borderBottomWidth:1,
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
        top: -8,
        left: 1,
    },
    bottom:{
        top:18,
    },
    middle:{
        borderBottomWidth:1,
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
    },
})

export default ABCSelectTitle
