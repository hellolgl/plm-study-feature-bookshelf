import React, { Component } from "react";
import {
    StyleSheet,
    processColor,
    Platform,
    View,
    Text,
    Image,
} from "react-native";

import { pxToDp, size_tool } from "../util/tools";
import { BarChart, RadarChart } from "react-native-charts-wrapper";
import { appStyle } from "../theme";

import DataGraphicalDisplayFrame from "./chinese/DataGraphicalDisplayFrame";

export default class testDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                dataSets: [
                    {
                        values: [],
                        label: "",
                        config: {
                            color: processColor("#6FB3FE"), //线颜色
                            drawValues: false, //是否显示数值
                            valueTextSize: 12, //数值数字的字体大小
                            valueTextColor: processColor("#6FB3FE"), // 数值颜色
                            visible: true, //是否可见
                            valueFormatter: "percent", //显示数字格式
                        },
                    },
                    {
                        values: [0, 9],
                        label: "",
                        config: {
                            visible: false, //是否可见
                        },
                    },
                ],
                // labels: ['数字', 'w', 'e', 'r', '2', '6']
            },

            yAxis: {
                inverted: true,
                spaceTop: 5,
                spaceBottom: 0,
                drawLabels: false, //是否绘制标签
                zeroLine: {
                    enabled: true,
                    lineWidth: 1,
                    lineColor: "red",
                },
                // granularity: 0,//左y轴步进值
            },

            legend: {
                enabled: false,
            },
            values: this.props.valueList,
            nameList: this.props.namelist,
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.valueList) !== JSON.stringify(state.values)) {
            let tempState = { ...state };

            tempState.values = props.valueList;
            tempState.nameList = props.namelist;
            // tempState.wrongValue = props.wrongValue
            // console.log('1111111111111111111111111',props.valueList,props.namelist)
            return tempState;
        }
        return state;
    }

    render() {
        // console.log(this.state.nameList)
        // console.log(this.state.values)
        return this.state.values.length > 0 ? (
            <DataGraphicalDisplayFrame
                math_frame_svg={[
                    "radar_mode2",
                    this.state.values,
                    this.state.nameList,
                    this.props.r ? this.props.r : pxToDp(230),
                    this.props.size ? this.props.size : [592, 568],
                ]}
                border_color={this.props.border_color}
                label_color={this.props.label_color}
                rate_color={this.props.rate_color}
            ></DataGraphicalDisplayFrame>
        ) : (
            <View
                style={[
                    appStyle.flexCenter,
                    {
                        flex: 1,
                        borderRadius: pxToDp(20),
                        backgroundColor: "#EDEDF5",
                        marginBottom: pxToDp(40),
                    },
                ]}
            >
                <Image
                    source={require("../images/chineseWeak.png")}
                    style={[size_tool(40), { zIndex: 99, marginBottom: pxToDp(12) }]}
                />
                <Text style={[{ fontSize: pxToDp(24), color: "#9595A6" }]}>
                    没有数据哦
                </Text>
            </View>
        );
        // <RadarChart
        //     style={{ height: this.props.height || pxToDp(590), width: this.props.width || pxToDp(550), backgroundColor: this.props.backgroundColor }}
        //     data={{
        //         dataSets: [
        //             {
        //                 values: this.state.values,
        //                 label: '',
        //                 config: {
        //                     color: processColor('#6FB3FE'), //线颜色
        //                     drawValues: true,    //是否显示数值
        //                     valueTextSize: pxToDp(24),  //数值数字的字体大小
        //                     valueTextColor: processColor('#6FB3FE'),  // 数值颜色
        //                     visible: true, //是否可见
        //                     valueFormatter: 'percent',//显示数字格式
        //                     drawFilled: true,
        //                     fillColor: processColor('#6FB3FE'),
        //                 },

        //             },
        //             {
        //                 values: [
        //                     0, 90
        //                 ],
        //                 label: '',
        //                 config: {
        //                     visible: false, //是否可见
        //                 }
        //             },
        //         ],
        //     }}
        //     xAxis={{
        //         valueFormatter: this.state.nameList,
        //         textSize: pxToDp(26),
        //     }}
        //     yAxis={this.state.yAxis}
        //     rotationEnabled={false}
        //     chartDescription={
        //         {
        //             text: '',
        //         }
        //     }
        //     legend={this.state.legend}
        //     scaleEnabled={false}
        //     touchEnabled={false}
        // // granularity={0}
        // // webAlpha={100}
        // />
    }
}

const styles = StyleSheet.create({
    chart: {
        // width: pxToDp(),
        height: pxToDp(600),
    },
});
