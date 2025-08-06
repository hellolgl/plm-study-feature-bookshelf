import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import _ from 'lodash'
import KeyboardFrame from './KeyboardFrame'
import FractionText from './FractionText'
import {pxToDp} from "../../../../../util/tools";

const log = console.log.bind(console)

var calculator_str = ''
var choice_idx = -1
var init_str_mat = []
var init_str_mat3 = []
var init_str_mat0 = []
var choice_backgroundcolor = []
var choice_font_color = []
var choice_all_length = 0

const focusFontColor = "red"
const fontColor = "blue"

export default class ClickSelectFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text_str_mat: init_str_mat3,
            choice_color_mat: choice_font_color,
            keyboard_str: '',    // 键盘字符串
            // img_local: './line_segment.png',
            img_local: "",
            new_choice_idx: -1,    // 更新数据
            test_width: 0,
        }
        this.data_mat001 = init_str_mat
        this.back_id = -1
        this.choice_idx = -1
        this.answer = {}
    }

    FreshFontcolor = (choice_idx) => {
        //  更新字体
        for (let idx = 0; idx < choice_font_color.length; idx++) {
            if (choice_idx === idx) {
                choice_font_color[idx] = focusFontColor
            }
            else {
                choice_font_color[idx] = fontColor
            }
        }
    }

    InitTextChoice = () => {
        // 简化
        init_str_mat[this.choice_idx] = '__'
        this.FreshFontcolor(this.choice_idx)
        this.setState({
            choice_color_mat: choice_font_color,
            text_str_mat: init_str_mat,
        })
    }

    TextIdxAll = () => {
        //  更新选中颜色
        this.InitTextChoice()
    }

    TextMat = (idx) => {
        //  数据选择
        this.setState({
            new_choice_idx: 1,
        })
        this.back_id = idx
        this.choice_idx = idx
        this.TextIdxAll()
        const r = this.judgeAnswer()
        this.sendAnswer(r)
    }

    ClickChoicemat = (text_str_mat) => {
        // 数阵模式2
        let frame_loc_mat = this.props.combine_data.choice_loc
        // 这里排序，解决选项位置乱跳问题
        frame_loc_mat.sort()
        let mode_2_width = 50
        let mode_2_height = 40
        let complete_mode_2 = []
        let font_Size = 22
        for (let idx = 0; idx < frame_loc_mat.length; idx++) {
            // log("debug idx: ", idx, frame_loc_mat[idx])
            // 需要填空组
            let process_text = []
            if (typeof text_str_mat[idx] === 'string') {
                process_text = [frame_loc_mat[idx]]
            }
            else {
                // 包含分数类型
                process_text = frame_loc_mat[idx]
            }
            let FractionfontSize = 20
            let fontSize = 25
            let showWords = text_str_mat[idx]
            let fraction_latex = (<FractionText
                textColor={this.state.choice_color_mat[idx]}
                textbackgroundColor={'transparent'}
                FractionfontSize={FractionfontSize}
                fontSize={fontSize}
                fraction_mat={showWords}
                tid={this.props.combine_data["tid"]}
            />)
            let p = this.props.combine_data.align_direction[idx]
            if (text_str_mat[idx] === "__") {
                p = "middle"
            }
            let left_loc = 0 // 各类布局展示
            choice_all_length = this.getFractionMatLength(text_str_mat[idx], fontSize, FractionfontSize)
            if (p === 'middle') {
                left_loc = -50    // 居中展示
            } else if (p === 'right') {
                left_loc = -choice_all_length + fontSize            // 居右展示
            } else if (p === 'left') {
                left_loc = -fontSize * 0.8         // 居左展示
            }
            complete_mode_2.push(
                <TouchableOpacity onPress={() => this.TextMat(idx)}
                                  style={[styles.button3, {
                                      top: frame_loc_mat[idx][1] - 30,
                                      left: frame_loc_mat[idx][0] + left_loc,
                                      height: 100,
                                      fontSize: font_Size,
                                      width: 100,
                                  }]}>
                    <View flexDirection='row' justifyContent='center' alignItems='center' style={{backgroundColor: showWords==="__"? "transparent": "white"}}>
                        {fraction_latex}
                    </View>
                </TouchableOpacity>
            )
        }
        let num_mat_svg = [(<View
            style={[
                // styles.layoutcol2,
                {
                width: this.props.combine_data.img_size[0],
                height: this.props.combine_data.img_size[1],
                // backgroundColor: "red",
                top: -this.props.combine_data.img_size[1] - mode_2_height / 2,
            }]}>
            {complete_mode_2}
        </View>)]
        return num_mat_svg
    }

    componentWillUnmount() {
        calculator_str = ''
        choice_idx = -1
        init_str_mat = []
        init_str_mat3 = []
        init_str_mat0 = []
        choice_backgroundcolor = []
        choice_font_color = []
        choice_all_length = 0
    }

    componentDidMount() {
        init_str_mat[choice_idx] = this.state.keyboard_str
        this.setState({ text_str_mat: init_str_mat },)
    }

    componentWillMount() {
        // 预处理
        for (let idx = 0; idx < this.props.combine_data.choice_loc.length; idx++) {
            init_str_mat.push('__')
            init_str_mat3.push('__')
            init_str_mat0.push('__')
            choice_font_color.push(fontColor)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.combine_data["img_uri"]["uri"] !== nextProps.combine_data["img_uri"]["uri"]) {
            const {choice_data} = nextProps.combine_data
            const initData = choice_data.map(d => "__")
            this.setState({ text_str_mat: initData },
            )
            init_str_mat = initData
            init_str_mat3 = initData
            init_str_mat0 = initData
            for (let idx = 0; idx < nextProps.combine_data.choice_loc.length; idx++) {
                choice_font_color.push(fontColor)
            }
        }
    }

    getFractionMatLength = (fraction_mat, fontSize, FractionfontSize) => {
        let all_length = 0
        let fm = fraction_mat
        if (fm === undefined) {
            return 0
        }
        for (let part_idx = 0; part_idx < fm.length; part_idx++) {
            // console.log('fraction_mat[part_idx]', fraction_mat[part_idx], fontSize,FractionfontSize )
            if (typeof fraction_mat[part_idx] === 'string') {
                for (let p_idx = 0; p_idx < fraction_mat[part_idx].length; p_idx++) {
                    // console.log('-=========----------', fraction_mat[part_idx])
                    if (fraction_mat[part_idx].charCodeAt(p_idx) < 255) {
                        // 中文字符
                        all_length += fontSize * 0.57
                    } else {
                        // 英文字符
                        all_length += fontSize
                    }
                }
            }
            else if (fraction_mat[part_idx].length === 2) {
                // 分数展示View+Text组
                let fraction_num = (fraction_mat[part_idx][0].length > fraction_mat[part_idx][1].length ?
                    fraction_mat[part_idx][0].length : fraction_mat[part_idx][1].length)
                // console.log('fraction_num', fraction_num)
                all_length += fraction_num * FractionfontSize * 0.62
            }
        }
        return all_length
    }

    _keyboard(keyboard_str0) {
        const {choice_loc} = this.props.combine_data
        calculator_str = keyboard_str0
        init_str_mat[this.choice_idx] = keyboard_str0
        if (keyboard_str0 == '') {
            init_str_mat[this.choice_idx] = init_str_mat0[this.choice_idx]
        }
        // color_flag
        this.setState({
            keyboard_str: keyboard_str0,
            text_str_mat: init_str_mat,
            new_choice_idx: -1,
        });

        if (this.choice_idx !== -1) {
            const loc = choice_loc[this.choice_idx]
            const [x, y, _] = loc
            const answer = [x, y, keyboard_str0]
            // update answer
            this.answer[this.choice_idx] = answer
            // send answer
            const r = this.judgeAnswer()
            this.sendAnswer(r)
        }
    }

    sendAnswer = (d) => {
        const {receiveAnswer, level} = this.props
        receiveAnswer(level, d)
    }

    judgeAnswer = () => {
        const usedStrList = this.state.text_str_mat
        const correctAnswer = this.props.combine_data['choice_loc']
        let a = Object.values(this.answer)
        a = a.filter(item => usedStrList.includes(item[2]))
        correctAnswer.sort()
        a.sort()
        let r = "0"
        if (_.isEqual(correctAnswer, a)) {
            r = "1"
        }
        return r
    }

    imageItem = () => {
        const width = this.props.combine_data.img_size[0]
        const height = this.props.combine_data.img_size[1]
        return (
            <View
                style={[{ width: width + pxToDp(80), height: height + pxToDp(20)},{
                    // borderWidth: 1,
                    // borderColor: "green",
                    // flexDirection: 'row',
                    // marginBottom: pxToDp(5),
                }]}
            >
                 <Image
                    style={[{ width: width, height: height},
                        {
                            // marginBottom: pxToDp(5),
                            // borderWidth: 1,
                            // borderColor: "green",
                            // flexDirection: 'row',
                        }
                    ]}
                    source={this.props.combine_data.img_require !== '' ? this.props.combine_data.img_require : this.props.combine_data.img_uri}
                    resizeMode="contain"
                />
                {this.ClickChoicemat(this.state.text_str_mat)}
            </View>
        )
    }

    render() {
        // 获取到文字列表
        //  计算圆环模式下的各组件坐标
        return(
            <View style={[styles.optionPosition]}>
                <View backgroundColor={'transparent'} style={[styles.option]}>
                    <KeyboardFrame _keyboard={this._keyboard.bind(this)}
                                   keyboard_mode={2}
                                   calculator_init={calculator_str}
                                   choice_data={this.props.combine_data.choice_data}
                                   new_choice_idx={this.state.new_choice_idx}
                                   used_choice_mat={this.state.text_str_mat}     // 选中使用的数据
                                   width={this.props.combine_data.choice_frame_width}  // 宽度设置
                                   selectItems={this.state.text_str_mat.filter(d => d !== "__")}
                    />
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={["showImg"]}
                    renderItem={() => this.imageItem()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    debugMode: {
        borderWidth: 2,
        borderColor: "red",
    },
    option: {
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: Dimensions.get("window").width * 0.9,
        alignItems: "center",
    },
    optionPosition: {
        zIndex: 10,
        top: 20,
    },
    layoutcol2: {
        // flexDirection: 'row',
        // backgroundColor: 'transparent',
        // marginTop: 1,
        // marginLeft: 1,
    },
    button3: {
        // borderWidth: 1,
        // borderColor: "yellow",
        textAlign: 'center',
        justifyContent: "center",
        textAlignVertical: 'center',
        position: 'absolute',
        alignSelf: 'flex-start',
    },
    fractiontext: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        fontSize: 20,
        height: 22,
    },
});
