import React, { Component } from "react";
import { StyleSheet, View, processColor, ActivityIndicator, Text, Platform } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import { margin_tool, pxToDp } from "../../../../../util/tools";
import { Flex } from "antd-mobile-rn";
import { appFont } from "../../../../../theme";

const val = {
    0: '综合能力趋势图',
    1: '认识能力趋势图',
    2: '分析能力趋势图',
    3: '运用能力趋势图',
    4: '思考能力趋势图',

}
export default class App extends Component {


    render() {
        return (
            <View style={[styles.chartContainer]}>
                {/* {
                    this.props.isLoading && <ActivityIndicator size={"large"} color={"#999999"} />
                } */}
                <View style={styles.eCharts}>
                    <ECharts
                        option={this.props.option}
                        backgroundColor="white"
                    />
                </View>

                <View style={styles.common_btn}>
                    <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{val[this.props.index]}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    eCharts: {
        width: Platform.OS === 'ios' ? pxToDp(440 * 2) : pxToDp(390 * 2),
        height: Platform.OS === 'ios' ? pxToDp(294 * 2) : pxToDp(244 * 2)
    },
    common_btn: {
        width: pxToDp(320),
        height: pxToDp(36 * 2),
        backgroundColor: '#F5F5FA',
        borderRadius: pxToDp(200),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(100),

    }
});