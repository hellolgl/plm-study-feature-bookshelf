import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import TextView from "../TextView"

const log = console.log.bind(console)

export default class FractionText extends Component {
    constructor(props) {
        super(props);
        this.fontColor = "#669FFD"
    }

    FractionView = () => {
        // 分数展示
        const tid = this.props.tid
        let bg = "white"
        let exThinkingTids = [18, 26, 27, 28, 29, 30, 31, 32]
        // 思路训练中，不需要选项背景色
        if (exThinkingTids.includes(tid)) {
            bg = "transparent"
        }

        // 包含分数类型
        let fraction_latex = []
        let len_num = 0
        let all_length = 0
        const {fraction_mat} = this.props
        if (fraction_mat === "__") {
            return (
                <View>
                    <Text style={[
                        {
                            color: this.props.textColor,
                            // color: "red",
                            textAlignVertical: 'center',
                            fontWeight: 'bold',
                            fontSize: this.props.fontSize,
                            backgroundColor: bg,
                        }]}>__</Text>
                </View>
            )
        } else if (fraction_mat.startsWith("[[") === false) {
            if (this.props.fraction_mat === undefined) {
                return null
            }
            for (let part_idx = 0; part_idx < this.props.fraction_mat.length; part_idx++) {
                if (typeof this.props.fraction_mat[part_idx] === 'string') {
                    fraction_latex.push(<Text style={[
                        {
                            fontSize: this.props.fontSize,
                            color: this.fontColor,
                        }]}>{this.props.fraction_mat[part_idx]}</Text>)
                    len_num += this.props.fraction_mat[part_idx].length
                    for (let p_idx = 0; p_idx < this.props.fraction_mat[part_idx].length; p_idx++) {
                        if (this.props.fraction_mat[part_idx].charCodeAt(p_idx) < 255) {
                            // 中文字符
                            all_length += this.props.fontSize * 0.57
                        } else {
                            // 英文字符
                            all_length += this.props.fontSize
                        }
                    }
                }
            }
            (this.props._getWidth === undefined) ? null : this.props._getWidth(all_length);
            return (<View
                alignItems='center'
                style={[styles.itemContent, {backgroundColor: bg}]} >
                {fraction_latex}
            </View>)
        } else {
            const textStyle = {
                color: this.fontColor,
                borderColor: this.fontColor,
            }
            return (
                <TextView textStyle={textStyle} value={JSON.parse(fraction_mat)}/>
            )
        }
    }

    render() {
        //  分数类展示组件
        return this.FractionView()
    }
}

const styles = StyleSheet.create({
    itemContent: {
        // alignSelf:'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 40,
        justifyContent: "center",
        borderRadius: 6,
        // left: -20,
    },
    layoutcol2: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 1,
        marginLeft: 1,
    },
    button3: {
        textAlign: 'center',
        justifyContent: "center",
        textAlignVertical: 'center',
        position: 'absolute',
        alignSelf: 'flex-start'
    },
    fractiontext: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
    },
});