/**圆形卡片组件 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { size_tool, pxToDp, padding_tool } from "../util/tools";

export default class CircleStatistcs extends Component {


    render() {
        // colorFlag,0表示灰色背景，没有做的题目，1是橙色背景，表示做对了的题目，2是红色背景，表示做错了的题目
        // console.log("颜色", this.props.colorFlag)
        return (
            <View
                style={{

                }}
            >
                <AnimatedCircularProgress
                    lineCap='round'
                    rotation={0}
                    size={this.props.size ? pxToDp(this.props.size) : pxToDp(240)}
                    width={this.props.width ? pxToDp(this.props.width) : pxToDp(38)}
                    fill={this.props.right}
                    tintColor={this.props.tintColor ? this.props.tintColor : "#0179FF"}
                    onAnimationComplete={() => console.log('onAnimationComplete')}
                    backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : "#B2D6FE"}
                >
                    {
                        (fill) => (
                            this.props.type === 'percent' ?
                                <View>
                                    <Text
                                        style={{
                                            fontSize: pxToDp(28),
                                            color: this.props.tintColor,
                                        }}
                                    >{this.props.right + '%'}</Text>
                                </View>
                                : <View style={[{ backgroundColor: '#FFFFFFFF', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={[{ color: '#0179FF', fontSize: pxToDp(40)}]}>
                                        {this.props.total}
                                    </Text>
                                    <Text style={{ fontSize: pxToDp(32), color: '#AAAAAA',fontWeight:'bold' }}>{this.props.totalText ? this.props.totalText : ''}</Text>
                                </View>

                        )
                    }
                </AnimatedCircularProgress>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    circle: {
        textAlign: 'center',
        color: '#fff',
        marginRight: 10,
        width: 32,
        height: 40,
        lineHeight: 40,
        // backgroundColor: '#EEEDED',
        borderRadius: 8,
        marginBottom: 8,
        marginRight: 10,
        fontFamily: 'DIN-Bold',

    },
    checked: {
        textAlign: 'center',
        color: '#fff',
        marginRight: 10,
        width: 32,
        height: 40,
        lineHeight: 40,
        // backgroundColor: '#FF9D03',
        borderRadius: 8,
        marginBottom: 8,
        marginRight: 10,
        fontFamily: 'DIN-Bold'

    },
    oldCheck: {
        textAlign: 'center',
        color: '#fff',
        marginRight: 10,
        width: 32,
        height: 40,
        lineHeight: 40,
        marginRight: 10,
        // backgroundColor: '#FF9D03',
        borderRadius: 8,
        marginBottom: 8,
        fontFamily: 'DIN-Bold'
    }
})