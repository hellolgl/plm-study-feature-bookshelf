import React, { Component } from 'react';
import { Text, View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import DashSecondLine from '../dashLine'
import Sound from 'react-native-sound';
import ViewControl from 'react-native-image-pan-zoom'
import { Toast, Radio } from 'antd-mobile-rn'

import LinearGradient from "react-native-linear-gradient";
/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */
export default class HelpCard extends Component {

    constructor(props) {
        super(props)
        // console.log(props,'helpcard')
        this.state = {
            translateValue: new Animated.ValueXY({ x: 110, y: 110 }), //矢量位移初始值
            fadeInOpacityValue: new Animated.Value(0), //显隐初始值
            rotateValue: new Animated.Value(0), //旋转初始值
            lineTranslateValue: new Animated.ValueXY({ x: 0, y: 0 }), //矢量位移初始值
            lineFadeInOpacityValue: new Animated.Value(0), //显隐初始值
            lineRotateValue: new Animated.Value(0), //旋转初始值
        }
        this.audio = undefined
        // this.playAudioTimer = null
    }

    componentDidMount() {
        Animated.sequence([
            Animated.timing(this.state.fadeInOpacityValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(
                this.state.translateValue,
                {
                    toValue: { x: this.props.translateX || 0, y: this.props.translateY || 0 },
                    duration: 3000, //动画持续时间
                    delay: 0,
                    useNativeDriver: true
                }
            ),
            Animated.timing(this.state.lineFadeInOpacityValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
        ]).start();
        if (this.props.autoPlayAudio) {
            this.playAudio()
        }
    }

    componentWillUnmount() {
        this.closeAudio()
    }

    // 播放读音
    playAudio = () => {
        //console.log("播放语音地址",this.props.audioPath);
        if (!this.props.audioPath) {
            return
        }
        this.audio = new Sound(this.props.audioPath, null, (error) => {
            if (error) {
                //console.log("播放失败");
            } else {
                Toast.loading('加载音频', 1, () => {
                    this.audio.play((success) => {
                        console.log('audio', success)
                        if (success) {
                            this.audio.release()
                        } else {
                            Toast.fail('播放失败', 1)
                        }
                    });
                    // this.setState(() => ({
                    //     playStatus: true
                    // }))
                })
            }
        });
        // this.playAudioTimer = setTimeout(() => {
        //     console.log("播放语音");
        //     this.audio.play((success) => {
        //         console.log('audio', success)
        //         setTimeout(() => {
        //             this.audio.release()

        //         }, 5 * 1000)
        //     });
        // }, 1000)
    };

    //关闭语音播放
    closeAudio = () => {
        this.playAudioTimer && clearTimeout(this.playAudioTimer)
        if (this.audio) {
            //console.log("关闭语音");
            this.audio.stop();
        }
    }

    renderLine = () => {
        if (this.props.showLine) {
            return (
                <Animated.View
                    style={[
                        appStyle.flexAliCenter,
                        {
                            opacity: this.state.lineFadeInOpacityValue,
                            transform: [
                                { rotate: 90 + 'deg' },

                            ],
                        },
                        this.props.lineStyle
                    ]}
                >
                    <DashSecondLine
                        backgroundColor="rgba(255, 255, 255, .6)"
                        len={this.props.lineNum || 8}
                        width={this.props.lineLen || 200}
                    ></DashSecondLine>
                </Animated.View>
            )
        }
        return <View></View>

    }

    render() {
        return (
            <View>
                <Animated.View
                    style={[
                        appStyle.flexCenter,
                        appStyle.flex1,
                        appStyle.flexTopLine,
                        {
                            marginLeft: this.props.marginLeft || 0,
                            opacity: this.state.fadeInOpacityValue,
                            transform: [
                                { rotate: (this.props.wordRotate || 0) + 'deg' },
                                { translateY: this.state.translateValue.x },
                                { translateX: this.state.translateValue.y },
                            ],
                        }
                    ]}
                >
                    {this.renderLine()}

                    <Animated.View
                        style={[
                            styles.contentWrap,
                            {
                                transform: [
                                    { rotate: '-' + (this.props.wordRotate || 0) + 'deg' },
                                ],
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[appStyle.flexAliCenter, {}]}
                            onPress={() => {
                                this.playAudio(); //播放录音
                            }}
                        >

                            <LinearGradient
                                colors={['#38B3FFFF', '#60CBFDFF', '#8DE1FFFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={[borderRadius_tool(18), {
                                    width: pxToDp(this.props.wordWidth || 80),
                                    height: pxToDp(this.props.wordHeight || 80)
                                },]}
                            >
                                {this.props.word ? <View
                                    style={[
                                        appStyle.flexTopLine,
                                        appStyle.flexCenter,
                                        margin_tool(20, 0, 0, 0),
                                    ]}
                                >
                                    <Text style={[{ color: "#FFFFFF" ,fontSize:pxToDp(60)}, appFont.bold]}>
                                        {this.props.word}
                                    </Text>
                                    <View
                                        style={[
                                            // {
                                            // backgroundColor:
                                            //     "linear-gradient(275deg, rgba(54, 187, 254, 1) 0%, rgba(93, 199, 254, 1) 100%)",
                                            // },
                                            padding_tool(12),
                                            borderRadius_tool(8),
                                        ]}
                                    >
                                        {/* <Image
                                            style={[{ width: pxToDp(70), height: pxToDp(70) }]}
                                            source={require("../../images/en_voice.png")}
                                        ></Image> */}
                                    </View>
                                </View> : null}

                                <View style={[appStyle.flexAliCenter]}>

                                    <Image
                                        style={[{ width: this.props.imgWidth || pxToDp(364), height: this.props.imgHeight || pxToDp(270), resizeMode: 'contain', borderRadius: pxToDp(18), margin: pxToDp(48) }]}
                                        source={{ uri: this.props.imgUrl }}
                                    >
                                    </Image>
                                    {this.props.word_phoneticspelling ?
                                        <View style={[appStyle.flexTopLine, appStyle.flexCenter,]}>
                                            <Text style={[{ color: "#FFFFFF" ,fontSize:pxToDp(50)}, appFont.bold]}>
                                                {this.props.word_phoneticspelling}
                                            </Text>
                                            <Image
                                                style={[{ width: pxToDp(60), height: pxToDp(60), resizeMode: 'center' }]}
                                                source={require("../../images/en_voice.png")}
                                            ></Image>
                                        </View>
                                        : null}
                                </View>

                            </LinearGradient>
                        </TouchableOpacity>

                    </Animated.View>

                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contentWrap: {
        // backgroundColor: "#fff",
        zIndex: 1,
        minWidth: pxToDp(220),
        minHeight: pxToDp(110),
    },
});
