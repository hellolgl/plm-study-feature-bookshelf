import React, { Component } from 'react';
import { Image, View, StyleSheet, Animated, TouchableOpacity, ImageBackground, Text } from 'react-native';
import { appStyle } from '../../../../theme';
import { padding_tool, pxToDp, size_tool } from '../../../../util/tools';

import CircleStatistcs from '../../../../component/circleStatistcs'

export default class DashSecondLine extends Component {
    constructor() {
        super()
        this.state = {
            rotateValue: new Animated.Value(0),
            isOpen: true,
            rotateValue2: new Animated.Value(0),
        }
    }
    openStatistic(isOpennow) {
        const { rotateValue, rotateValue2 } = this.state;
        // console.log("isopen", isOpennow)
        if (!isOpennow) {
            Animated.timing(rotateValue, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
            Animated.timing(rotateValue2, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
            this.setState({
                isOpen: true,
            });
            return;
        }
        Animated.timing(rotateValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
        Animated.timing(rotateValue2, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
        this.setState({
            isOpen: false,
        });
    }
    render() {
        const { staticsobj } = this.props
        return (
            <>
                <Animated.View
                    style={[size_tool(182, 70),
                    appStyle.flexTopLine,
                    {
                        position: 'absolute',
                        top: pxToDp(-60),
                        right: pxToDp(-140),
                        zIndex: 999,
                        transform: [
                            {
                                translateX: this.state.rotateValue2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, pxToDp(-410)],
                                }),
                            },
                        ],
                    },]} >
                    <TouchableOpacity style={[size_tool(182, 70),]} onPress={this.openStatistic.bind(this, this.state.isOpen)}>
                        <Image source={require('../../../../images/englishHomepage/testMe/testMeStaticsBtn.png')} style={[size_tool(182, 70)]} />
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View
                    style={[size_tool(412, 786),
                    appStyle.flexTopLine,
                    {
                        position: 'absolute',
                        top: pxToDp(-110),
                        right: pxToDp(-550),
                        zIndex: 999,
                        transform: [
                            {
                                translateX: this.state.rotateValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-6, pxToDp(-420)],
                                }),
                            },
                        ],
                    },]} >
                    <ImageBackground
                        source={require('../../../../images/englishHomepage/testMe/testMeStaticsBg.png')}
                        style={[size_tool(412, 786), padding_tool(40)]}
                    >
                        <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, { marginBottom: pxToDp(22) }]}>
                            <CircleStatistcs
                                total={staticsobj.total}
                                right={Number(staticsobj.total > 0 ? (staticsobj.correct / staticsobj.total) * 100 : 0).toFixed(0)}
                                width={24}
                                tintColor={'#77D102'}
                                backgroundColor={'#EBFCD5'}
                                textColor={'#77D102'}
                                textColor1={'#AAAAAA'}
                                size={180}
                                type={'percent'}
                            />
                            <View style={[appStyle.flexAliCenter, { marginLeft: pxToDp(40) }]}>
                                <Text style={[{ fontSize: pxToDp(40), color: '#333' }]}>{staticsobj.correct}</Text>
                                <Text style={[{ fontSize: pxToDp(20), color: '#aaa' }]}>Correct</Text>
                                <Text style={[{ fontSize: pxToDp(40), color: '#333' }]}>{staticsobj.total}</Text>
                                <Text style={[{ fontSize: pxToDp(20), color: '#aaa' }]}>Total</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={[size_tool(122, 40), styles.titleBtn]}>Words</Text>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.word.right}</Text>
                                <Text style={[styles.number2]}>Word</Text>
                                <View style={[size_tool(80, 40), appStyle.flexCenter, {marginLeft: "auto"}]}>
                                    <Image source={require('../../../../images/englishHomepage/testMe/testMeStaticsRight.png')} style={[size_tool(40),]} />
                                </View>
                            </View>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.word.wrong}</Text>
                                <Text style={[styles.number2]}>Word</Text>
                                <Text style={[styles.number2, {marginLeft: "auto"}]}>Try again</Text>
                            </View>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.phrases.right}</Text>
                                <Text style={[styles.number2]}>Phrases</Text>
                                <View style={[size_tool(80, 40), appStyle.flexCenter, {marginLeft: "auto"}]}>
                                    <Image source={require('../../../../images/englishHomepage/testMe/testMeStaticsRight.png')} style={[size_tool(40),]} />
                                </View>
                            </View>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.phrases.wrong}</Text>
                                <Text style={[styles.number2]}>Phrases</Text>
                                <Text style={[styles.number2, {marginLeft: "auto"}]}>Try again</Text>
                            </View>
                            <Text style={[size_tool(147, 40), styles.titleBtn]}>Sentences</Text>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.sentence.right}</Text>
                                <Text style={[styles.number2]}>Sentences</Text>
                                <View style={[size_tool(80, 40), appStyle.flexCenter, {marginLeft: "auto"}]}>
                                    <Image source={require('../../../../images/englishHomepage/testMe/testMeStaticsRight.png')} style={[size_tool(40),]} />
                                </View>
                            </View>
                            <View style={[styles.numberWrap]}>
                                <Text style={[styles.number]}>{staticsobj.sentence.wrong}</Text>
                                <Text style={[styles.number2]}>Sentences</Text>
                                <Text style={[styles.number2, {marginLeft: "auto"}]}>Try again</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </>
        );
    }
}
const styles = StyleSheet.create({
    titleBtn: {
        backgroundColor: '#FFAB32',
        borderRadius: pxToDp(28),
        textAlign: 'center',
        lineHeight: pxToDp(40),
        fontSize: pxToDp(24),
        color: "#fff",
        marginBottom: pxToDp(20),
        fontWeight: 'bold'
    },
    numberWrap: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: pxToDp(10)
    },
    number: {
        fontSize: pxToDp(32),
        color: '#333',
        width: pxToDp(60)
    },
    number2: {
        fontSize: pxToDp(26),
        color: '#aaa'
    }
});
