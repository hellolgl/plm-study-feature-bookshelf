import React, { useEffect, useState } from 'react'
import { StyleSheet, processColor, Platform, View, Text, Image } from 'react-native'
import {
    pxToDp, size_tool
} from "../../util/tools";
import {
    LineChart
} from 'react-native-charts-wrapper';
import { appStyle } from '../../theme';

const myLineChart = (props) => {

    const [data, setdata] = useState(props.value)

    const [linename, setlinename] = useState(props.linename)
    const [arangelist, setarangelist] = useState(props.arangelist)
    const yAxis = {
        left: {
            drawLabels: true, //是否绘制左y轴数值
            drawAxisLine: true,
            drawGridLines: true,
            axisMinimum: 0,
            zeroLine: {
                enabled: false,
                lineWidth: 2
            },
            granularity: 1,//左y轴步进值
            textColor: processColor('#000000'),
        },
        right: {
            enabled: false, //是否绘制右y轴数值
            granularity: 1 //右y轴步进值
        },
    }

    const legend = {
        horizontalAlignment: "RIGHT",
        verticalAlignment: 'TOP',
        enabled: true,
        textSize: 14,
        form: 'circle',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
        textColor: processColor('#000000'),
    }

    useEffect(() => {
        let datanow = { ...data }
        setdata(props.value)
        setlinename(props.linename)
        setarangelist(props.arangelist)


    }, [props.value])
    console.log('折线图list', arangelist)
    return (
        arangelist.length > 0 ?
            <LineChart
                style={{ height: props.height ? props.height : pxToDp(360), width: props.width ? props.width : pxToDp(730) }}
                data={{
                    dataSets: [
                        {
                            values: arangelist,
                            label: '平均分',
                            config: {
                                color: processColor(props.perColor ? props.perColor : '#FF9898'), //柱子默认显示颜色
                                highlightEnabled: false, //柱子是否可点击
                                valueTextSize: pxToDp(26), //柱子上的文字大小
                                valueTextColor: processColor('#AAAAAA'), //柱子上的文字颜色
                                visible: true, //是否显示柱子
                                valueFormatter: 'percent',
                                drawCircles: true,
                                circleColor: processColor(props.perColor ? props.perColor : '#FF9898'),
                                circleRadius: pxToDp(8),
                                drawCircleHole: true,
                                dashedLine: {
                                    lineLength: pxToDp(12),
                                    spaceLength: pxToDp(8)
                                },
                                drawValues: false
                                // circleHoleColor: 200,
                            }
                        },
                        {
                            values: data,
                            label: '我的π分',
                            config: {
                                color: processColor(props.myColor ? props.myColor : '#77D102'), //柱子默认显示颜色
                                highlightEnabled: false, //柱子是否可点击
                                valueTextSize: pxToDp(26), //柱子上的文字大小
                                valueTextColor: processColor(props.myColor ? props.myColor : '#AAAAAA'), //柱子上的文字颜色
                                visible: true, //是否显示柱子
                                valueFormatter: 'percent',
                                drawCircles: true,
                                circleColor: processColor(props.myColor ? props.myColor : '#77D102'),
                                circleRadius: pxToDp(8),
                                drawCircleHole: true,

                                fillColor: processColor(props.myColor),
                                drawFilled: true
                                // circleHoleColor: 200,
                            },

                        },

                        {
                            values:
                                [{ x: 0, y: Platform.OS === 'ios' ? 1.1 : 110 },
                                { x: 8, y: Platform.OS === 'ios' ? 1.1 : 110 },
                                ],
                            label: '',
                            config: {
                                color: processColor('#ffffff'), //柱子默认显示颜色
                                highlightEnabled: false, //柱子是否可点击
                                valueTextSize: pxToDp(26), //柱子上的文字大小
                                valueTextColor: processColor('#ffffff'), //柱子上的文字颜色
                                visible: false, //是否显示柱子
                                valueFormatter: 'percent'
                            }
                        }
                    ],
                    config: {
                        barWidth: 0.2, //柱子宽度，不设置则按照宽度及柱子个数平分
                    }
                }}
                xAxis={{
                    valueFormatter: linename,
                    granularityEnabled: true,
                    granularity: 1, //x轴点绘制的粒度
                    // axisMinimum: 0, //从第axisMinimum个柱子开始绘制
                    position: "BOTTOM",
                    yOffset: 0,
                    textSize: pxToDp(20),
                    textColor: processColor('#000000'),
                    drawGridLines: false,
                }}
                yAxis={yAxis}
                animation={{ durationX: 1000 }}
                legend={legend}
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
export default myLineChart

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
        chart: {
            // width: pxToDp(),
            height: pxToDp(400)
        }
    }
)


