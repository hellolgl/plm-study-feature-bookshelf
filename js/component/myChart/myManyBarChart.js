import React, { Component } from 'react'
import { StyleSheet, processColor, View, Text, Image } from 'react-native'
import {
    pxToDp, size_tool,
} from "../../util/tools";
import {
    BarChart,
} from 'react-native-charts-wrapper';
import { appStyle } from '../../theme';


export default class testDemo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            legend: {
                enabled: props.enabledLegend ? false : true,
                textSize: 18,
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                orientation: 'HORIZONTAL',
                verticalAlignment: 'BOTTOM',
                horizontalAlignment: "RIGHT",
                verticalAlignment: 'TOP',
                textColor: processColor('#000000'),
            },
            xAxis: {


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
            rightValue: props.rightValue,
            totallist: props.totallist,
            namelist: props.namelist
        }
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state }
        tempState.totallist = props.totallist
        tempState.rightValue = props.rightValue
        tempState.namelist = props.namelist
        console.log('tempState柱状图', props)
        return tempState
    }

    render() {
        return (this.state.rightValue.length > 0 ?
            <BarChart
                style={{ height: this.props.height ? this.props.height : pxToDp(300), width: this.props.width ? this.props.width : pxToDp(672) }}
                data={
                    {
                        dataSets: [
                            {
                                values: this.state.totallist,
                                label: '错误',
                                config: {
                                    color: processColor('#FF9898'), //柱子默认显示颜色
                                    highlightEnabled: false, //柱子是否可点击
                                    valueTextSize: this.props.textFount ? this.props.textFount : pxToDp(26), //柱子上的文字大小
                                    valueTextColor: processColor('#AAAAAA'), //柱子上的文字颜色
                                    visible: true, //是否显示柱子
                                    valueFormatter: 'percent',
                                    // drawBarShadow: true
                                    drawValues: false
                                }
                            },
                            {
                                values: this.state.rightValue,
                                label: '正确',
                                config: {
                                    color: processColor(this.props.rightColor ? this.props.rightColor : '#77D102'), //柱子默认显示颜色
                                    highlightEnabled: false, //柱子是否可点击
                                    valueTextSize: this.props.textFount ? this.props.textFount : pxToDp(26), //柱子上的文字大小
                                    valueTextColor: processColor('#AAAAAA'), //柱子上的文字颜色
                                    visible: true, //是否显示柱子
                                    valueFormatter: 'percent',
                                    drawValues: false
                                }
                            },

                        ],
                        config: {
                            barWidth: 0.2, //柱子宽度，不设置则按照宽度及柱子个数平分
                        }
                    }
                }
                xAxis={{
                    valueFormatter: this.state.namelist,
                    granularityEnabled: true,
                    granularity: 1, //x轴点绘制的粒度
                    // axisMinimum: 0, //从第axisMinimum个柱子开始绘制
                    position: "BOTTOM",
                    yOffset: 0,
                    textSize: this.props.textFount ? this.props.textFount : pxToDp(26),
                    textColor: processColor('#000000'),
                    drawGridLines: this.props.enabledLegend ? false : true,
                }}
                yAxis={this.state.yAxis}
                // animation={{ durationX: 1000 }}
                legend={this.state.legend}
                // onSelect={this.handleSelect.bind(this)}
                chartDescription={{
                    text: '',
                    textColor: processColor('#999'),
                    textSize: pxToDp(50),
                    fontFamily: '微软雅黑'
                }}
                marker={{
                    enabled: false,
                    markerColor: processColor('red'),
                    textColor: processColor('green'),
                    textSize: 14
                }}
                drawValueAboveBar={false}
                //  /是否绘制柱子y值/
                drawBarShadow={false}
                //  /是否绘制每根柱子剩余部分/
                drawGridBackground={false}/*是否绘制柱子背景*/
                gridBackgroundColor={processColor('white')}/*柱子背景色*/
                drawHighlightArrow={true}
                scaleEnabled={false}
                highlightPerTapEnabled={false}
                visibleRange={{ x: { min: 0, max: 8 } }}
            />
            :
            <View style={[appStyle.flexCenter, { flex: 1, borderRadius: pxToDp(20), backgroundColor: '#EDEDF5', marginBottom: pxToDp(40) }]}>
                <Image source={require("../../images/chineseWeak.png")}
                    style={[size_tool(40), { zIndex: 99, marginBottom: pxToDp(12), }]} />
                <Text style={[{ fontSize: pxToDp(24), color: '#9595A6' }]}>
                    没有数据哦
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create(
    {

    }
)


