import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import TextView from "../TextView"
import {pxToDp} from "../../../../../util/tools";

var calculator_str = ''
var choice_backgroundcolor = ['transparent', 'transparent', 'transparent', 'transparent', 'transparent',
    'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
var choice_touch_color = ['transparent', 'transparent', 'transparent', 'transparent', 'transparent',
    'transparent', 'transparent', 'transparent', 'transparent', 'transparent']

const log = console.log.bind(console)

const contentColor = "#d9d9d9"
const focusContentColor = "#7da6ff"


export default class KeyboardFrame extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coordinates: [], // 线路
            // backgroundColor:"red"
            bgColor: {
                backgroundColor: 'yellow',
                marginTop: 10,
                marginLeft: 10,
            },
            bgColor2: {
                backgroundColor: 'yellow',
                marginTop: 10,
                marginLeft: 10,
            },
            caculator_x: 0,
            caculator_y: 0,
            choice_color_mat: choice_backgroundcolor,
            choice_touch_color: choice_touch_color, // 修改使用后的背景色
        }
    }

    componentDidMount() {
        this.props._keyboard(calculator_str)
    }

    componentDidUpdate(preProps) {
        if (this.props.selectItems !== preProps.selectItems) {
            const {choice_color_mat, } = this.state
            const {choice_data, selectItems} = this.props
            for (let idx = 0; idx < choice_color_mat.length; idx++) {
                if (selectItems.includes(choice_data[idx])) {
                    choice_color_mat[idx] = focusContentColor
                }
                else {
                    choice_color_mat[idx] = contentColor
                }
            }
            this.setState({
                choice_color_mat,
            })
        }
    }

    componentWillMount() {
        this.props._keyboard(calculator_str)
        // this.FreshTouchColor()
        this.setState({
            choice_touch_color: choice_touch_color,
        })
    }

    ChoiceIdx = (idx) => {
        const {choice_data} = this.props
        calculator_str = this.props.choice_data[idx]
        this.props._keyboard(calculator_str, idx)
        this.FreshBackcolor(idx)
    }

    FreshBackcolor = (choice_idx) => {
        //  更新背景色
        const {choice_color_mat} = this.state
        const {selectItems, choice_data} = this.props
        for (let idx = 0; idx < choice_color_mat.length; idx++) {
            if (choice_idx === idx || selectItems.includes(choice_data[idx])) {
                choice_color_mat[idx] = focusContentColor
            }
            else {
                choice_color_mat[idx] = contentColor
            }
        }
        this.setState({
            choice_color_mat,
        })
    }

    KeyBoardMode3 = () => {
        // 按钮组
        let button_mat = []
        let font_Size = pxToDp(36)
        const {choice_data} = this.props
        choice_data.sort((a,b) => a.length - b.length)
        for (let idx = 0; idx < this.props.choice_data.length; idx++) {
            let c = this.state.choice_color_mat[idx]
            // #7da6ff
            // #d9d9d9
            // transparent
            let ft = {}
            let textStyle = {}
            let showWords = this.props.choice_data[idx]
            // 修正字符串展示
            if (c === "#7da6ff") {
                ft = {
                    backgroundColor: c,
                    borderWidth: 3,
                }
                let bg = "white"
                textStyle = {
                    color: bg,
                    borderColor: bg
                }
            } else {
                ft = {
                    borderWidth: 3,
                    borderColor: c,
                }
                let bg = "black"
                textStyle = {
                    color: bg,
                    borderColor: bg
                }
            }
            if (showWords.startsWith("[[")) {
                showWords = <TextView value={JSON.parse(showWords)} textStyle={textStyle}/>
            }
            button_mat.push(
                <TouchableOpacity onPress={() => this.ChoiceIdx(idx)}
                                  style={[styles.button2, {
                                      minHeight: 72,
                                      fontSize: font_Size,
                                      paddingLeft: 10,
                                      paddingRight: 10,
                                  }, ft]}>
                    <Text style={[styles.text, textStyle]}>{showWords}</Text>
                </TouchableOpacity>
            )
        }
        return button_mat
    }

    render() {
        calculator_str = this.props.calculator_init
        let keyboard_mat = []     // 答题键盘选用
        // 键盘选择
        if (this.props.keyboard_mode === 2) {
            // 自定义活键盘
            keyboard_mat = this.KeyBoardMode3()
        }
        return keyboard_mat
    }
}

const styles = StyleSheet.create({
    layoutcol2: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 1,
        marginLeft: 1,
    },
    button1: {
        //
        borderColor: 'transparent',
        borderWidth: 1,
        //  borderRadius:5,
        fontSize: pxToDp(36),
        textAlign: 'center',
        justifyContent: "center",
        position: 'absolute',
        borderRadius: 10,
        width: 60,
        height: 40,
    },
    button3: {
        //
        borderColor: 'transparent',
        borderWidth: 1,
        //  borderRadius:5,
        fontSize: 25,
        // alignSelf:'flex-start',
        textAlign: 'center',
        justifyContent: "center",
        textAlignVertical: 'center',
        position: 'absolute',

    },
    button2: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'transparent',
        justifyContent: "center",
        marginRight: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
    },
    fractiontext: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        borderColor: 'transparent',
        // textAlignVertical: 'top',
        fontSize: 20,
        // textAlign: 'top',
        // justifyContent: "center",
        height:22,
    },
});