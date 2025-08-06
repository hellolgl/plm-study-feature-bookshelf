import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

        }
        this.audio = undefined
        // this.playAudioTimer = null
    }

    componentDidMount() {

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


    render() {
        return (
            <TouchableOpacity
                style={[appStyle.flexAliCenter, { paddingTop: pxToDp(220) }]}
                onPress={() => {
                    this.playAudio(); //播放录音
                }}
            >
                <View
                    style={[
                        appStyle.flexTopLine,
                        appStyle.flexCenter,
                        margin_tool(20, 0, 12, 0),
                    ]}
                >
                    <Text style={[{ color: "#FFFFFF", fontSize: pxToDp(60) }, appFont.bold]}>
                        {this.props.word ? this.props.word : ''}
                    </Text>
                </View>

                <View style={[appStyle.flexAliCenter]}>
                    <Image
                        style={[{ width: pxToDp(336), height: pxToDp(336), resizeMode: 'contain', borderRadius: pxToDp(18), marginBottom: pxToDp(40) }]}
                        source={{ uri: this.props.imgUrl }}
                    >
                    </Image>

                    {this.props.word_phoneticspelling ?
                        <View style={[appStyle.flexTopLine, appStyle.flexCenter,]}>
                            <Text style={[{ color: "#FFFFFF", fontSize: pxToDp(36), marginRight: pxToDp(20) }, appFont.bold]}>
                                {this.props.word_phoneticspelling}
                            </Text>
                            <Image
                                style={[{ width: pxToDp(60), height: pxToDp(60), resizeMode: 'center' }]}
                                source={require("../../images/englishHomepage/en_voice.png")}
                            ></Image>
                        </View>
                        : null}
                </View>
            </TouchableOpacity>

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
