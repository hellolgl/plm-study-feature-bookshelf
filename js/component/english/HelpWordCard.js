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
/* 英语帮助字母卡组件
 * 水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */
export default class HelpCard extends Component {

    constructor(props) {
        super(props)
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
    }

    componentWillUnmount(){
        console.log('componentWillUnmount playAudioTimer',this.playAudioTimer)
        this.playAudioTimer && clearTimeout(this.playAudioTimer)
    }

    // 播放读音
    playAudio = () => {
        //console.log("播放语音地址",this.props.audioPath);
        if (!this.props.audioPath) {
            return
        }
        // if(this.audio){
        //     this.closeAudio()
        //     return
        // }
        this.audio = new Sound(this.props.audioPath, null, (error) => {
            if (error) {
                //console.log("播放失败");
            }
        });
        this.playAudioTimer = setTimeout(() => {
            //console.log("播放语音");
            this.audio.play();
            this.setState(() => ({
                playStatus: true
            }))
        }, 500)
    };

    //关闭语音播放
    closeAudio = () => {
        this.playAudioTimer && clearTimeout(this.playAudioTimer)
        if (this.audio) {
            //console.log("关闭语音");
            this.audio.stop();
            this.audio = undefined;
            this.setState(() => ({
                playStatus: false
            }))
        }
    }

    renderLine = () => {
        if (this.props.showLine) {
            return (
                <Animated.View
                    style={[
                        {
                            opacity: this.state.lineFadeInOpacityValue,
                        },
                        this.props.lineStyle
                    ]}
                >
                    <DashSecondLine
                        backgroundColor="rgba(255, 255, 255, .6)"
                        len={this.props.lineNum || 8}
                        width={this.props.lineLen || 150}
                    ></DashSecondLine>
                </Animated.View>
            )
        }
        return <View></View>

    }

    renderCard = () => {
        return (
            <Animated.View
                style={[
                    styles.contentWrap,
                    borderRadius_tool(18),
                    appFont.f28,
                    {
                        width: pxToDp(this.props.wordWidth || 80),
                        height: pxToDp(this.props.wordHeight || 80),
                        transform: [
                            { rotate: '-' + (this.props.wordRotate || 45) + 'deg' },
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
                    <View
                        style={[
                            appStyle.flexTopLine,
                            appStyle.flexCenter,
                            margin_tool(20, 0, 0, 0),
                        ]}
                    >
                        <Text style={[{ color: "#333" }, appFont.f30]}>
                            {this.props.word}
                        </Text>
                        <View
                            style={[
                                {
                                    backgroundColor:
                                        "linear-gradient(275deg, rgba(54, 187, 254, 1) 0%, rgba(93, 199, 254, 1) 100%)",
                                },
                                padding_tool(12),
                                borderRadius_tool(8),
                            ]}
                        >
                            <Image
                                style={[{ width: pxToDp(27), height: pxToDp(24) }]}
                                source={require("../../images/voice.png")}
                            ></Image>
                        </View>
                    </View>
                    <View style={[appStyle.flexAliCenter]}>
                        <Text style={[{ color: "#333" }, appFont.f30]}>
                            {this.props.word_phoneticspelling}
                        </Text>
                        <Image
                            style={[{ width: pxToDp(400), height: pxToDp(200), resizeMode: 'contain' }]}
                            source={{ uri: this.props.imgUrl }}
                        >

                        </Image>
                    </View>

                </TouchableOpacity>
            </Animated.View>
        )
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
                            opacity: this.state.fadeInOpacityValue,
                            transform: [
                                { rotate: (this.props.wordRotate || 45) + 'deg' },
                                { translateY: this.state.translateValue.x },
                                { translateX: this.state.translateValue.y },
                            ],
                        }
                    ]}
                >
                    {this.renderLine()}
                    {/* {this.renderCard()} */}
                    <Animated.View
                        style={[
                            styles.contentWrap,
                            borderRadius_tool(18),
                            appFont.f28,
                            {
                                width: pxToDp(this.props.wordWidth || 80),
                                height: pxToDp(this.props.wordHeight || 80),
                                transform: [
                                    { rotate: '-' + (this.props.wordRotate || 45) + 'deg' },
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
                            <View
                                style={[
                                    appStyle.flexTopLine,
                                    appStyle.flexCenter,
                                    margin_tool(20, 0, 0, 0),
                                ]}
                            >
                                <Text style={[{ color: "#333" }, appFont.f30]}>
                                    {this.props.word}
                                </Text>
                                <View
                                    style={[
                                        {
                                            backgroundColor:
                                                "linear-gradient(275deg, rgba(54, 187, 254, 1) 0%, rgba(93, 199, 254, 1) 100%)",
                                        },
                                        padding_tool(12),
                                        borderRadius_tool(8),
                                    ]}
                                >
                                    <Image
                                        style={[{ width: pxToDp(27), height: pxToDp(24) }]}
                                        source={require("../../images/voice.png")}
                                    ></Image>
                                </View>
                            </View>
                            <View style={[appStyle.flexAliCenter]}>
                                <Text style={[{ color: "#333" }, appFont.f30]}>
                                    {this.props.word_phoneticspelling}
                                </Text>
                                <Image
                                    style={[{ width: pxToDp(400), height: pxToDp(200), resizeMode: 'contain' }]}
                                    source={{ uri: this.props.imgUrl }}
                                >

                                </Image>
                            </View>

                        </TouchableOpacity>
                    </Animated.View>

                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contentWrap: {
        backgroundColor: "#fff",
        zIndex: 1,
        minWidth: pxToDp(220),
        minHeight: pxToDp(110),
    },
});
