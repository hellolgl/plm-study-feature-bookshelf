import React, { Component } from 'react'
import { StyleSheet, processColor } from 'react-native'
import {
    pxToDp,
} from "../util/tools";
import {
    BarChart,
} from 'react-native-charts-wrapper';


export default class testDemo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            legend: {
                enabled: true,
                textSize: 14,
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                orientation: 'HORIZONTAL',
                verticalAlignment: 'BOTTOM',
                textColor: processColor('#000000'),
            },
            data: {
                dataSets: [{
                    values: [{ x: 1, y: props.right ? props.right : 0 },
                    ],
                    label: props.rightText ? props.rightText : 'right',
                    config: {
                        color: props.rightBg ? processColor(props.rightBg) : processColor('#0179FF'), //柱子默认显示颜色
                        highlightEnabled: false, //柱子是否可点击
                        valueTextSize: pxToDp(26), //柱子上的文字大小
                        valueTextColor: processColor('#AAAAAA'), //柱子上的文字颜色
                        visible: true, //是否显示柱子
                        valueFormatter: 'largeValue'
                    }
                }, {
                    values: [{ x: 2, y: props.wrong ? props.wrong : 0 },
                    ],
                    label: props.wrongText ? props.wrongText : 'wrong',
                    config: {
                        color: props.wrongBg ? processColor(props.wrongBg) : processColor('#B2D6FE'), //柱子默认显示颜色
                        highlightEnabled: false, //柱子是否可点击
                        valueTextSize: pxToDp(26), //柱子上的文字大小
                        valueTextColor: processColor('#AAAAAA'), //柱子上的文字颜色
                        visible: true, //是否显示柱子
                        valueFormatter: 'largeValue'
                    }
                }],
                config: {
                    barWidth: 0.2, //柱子宽度，不设置则按照宽度及柱子个数平分
                }
            },
            xAxis: {
                valueFormatter: ['', '', ''],
                granularityEnabled: true,
                granularity: 1, //x轴点绘制的粒度
                // axisMinimum: 0, //从第axisMinimum个柱子开始绘制
                position: "BOTTOM",
                yOffset: 0,
                textSize: pxToDp(2),
                textColor: processColor('#000000'),
            },
            yAxis: {
                left: {
                    drawLabels: true, //是否绘制左y轴数值
                    drawAxisLine: true,
                    drawGridLines: true,
                    axisMinimum: 0,
                    zeroLine: {
                        enabled: false,
                        lineWidth: 2
                    },
                    granularity: 1, //左y轴步进值
                    textColor: processColor('#000000'),
                },
                right: {
                    enabled: false, //是否绘制右y轴数值
                    granularity: 1 //右y轴步进值
                },
            },
        }
    }


    render() {
        return (
            <BarChart
                style={{ height: this.props.height ? pxToDp(this.props.height) : pxToDp(400), width: pxToDp(this.props.width) }}
                data={this.state.data}
                xAxis={this.state.xAxis}
                yAxis={this.state.yAxis}
                animation={{ durationX: 1000 }}
                legend={this.state.legend}
                // onSelect={this.handleSelect.bind(this)}
                chartDescription={{
                    text: '',
                    textColor: processColor('#999'),
                    textSize: 20,
                    fontFamily: '微软雅黑'
                }}
                marker={{
                    enabled: false,
                    markerColor: processColor('red'),
                    textColor: processColor('green'),
                    textSize: 14
                }}
                drawValueAboveBar={true}
                //  /是否绘制柱子y值/
                drawBarShadow={false}
                //  /是否绘制每根柱子剩余部分/
                drawGridBackground={false}/*是否绘制柱子背景*/
                gridBackgroundColor={processColor('white')}/*柱子背景色*/
                drawHighlightArrow={true}
                scaleEnabled={false}
                highlightPerTapEnabled={false}

            />
        )
    }
}


const styles = StyleSheet.create(
    {
        mainWrap: {
            backgroundColor: 'linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)',
            height: '100%',
            width: '100%',
            padding: 24,
            backgroundColor: '#FFFFFFFF',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-between",
            height: 55,
            width: '100%',
            marginBottom: 24,
            paddingLeft: 33,
            backgroundColor: '#FFFFFFFF',
            borderRadius: 15,
        },
        headerTitle: {
            fontSize: 22,
            color: '#3F403F',

        },

    }
)


