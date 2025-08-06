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
// import Audio from "../../util/audio/sounds"
import Audio from "../../util/audio/audio"


import LinearGradient from "react-native-linear-gradient";
/*水平方向的虚线
 * len 虚线个数
 * width 总长度
 * backgroundColor 背景颜色
 * */

const log = console.log.bind(console)

export default class HelpCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            paused: true
        }
        this.audio = React.createRef()
    }

    componentDidMount() {
        // if (this.props.autoPlayAudio) {
        //     setTimeout(() => {
        //         this.audio.current.replay()
        //         const { paused } = this.state
        //         this.setState({
        //             paused: false,
        //         })
        //     }, 1000)
        // }
    }

    componentWillUnmount() {
        this.audioPaused()
    }

    // 播放读音
    playAudio = () => {
        const { audioPath } = this.props
        console.log('audio', this.audio.current)
        this.audio.current.onPlay(audioPath)
        // this.audio.current.
        const { paused } = this.state
        this.setState({
            paused: false,
        })
    };

    audioPaused = () => {
        this.setState({
            paused: true
        })
    }

    render() {
        const { audioPath } = this.props
        console.log("audioPath: ", audioPath)
        const { paused } = this.state
        return (
            <TouchableOpacity
                style={[appStyle.flexAliCenter,]}
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
                    <Text style={[{ color: "#FFFFFF", fontSize: pxToDp(60), lineHeight: pxToDp(70) }, appFont.fontFamily_jcyt_700]}>
                        {this.props.word ? this.props.word : ''}
                    </Text>
                </View>

                <View style={[appStyle.flexAliCenter]}>
                    <Image
                        style={[{ width: pxToDp(336), height: pxToDp(336), resizeMode: 'contain', borderRadius: pxToDp(18), marginBottom: pxToDp(40) }]}
                        source={{ uri: this.props.imgUrl }}
                    >
                    </Image>
                    <View style={[appStyle.flexTopLine, appStyle.flexCenter,]}>


                        {this.props.word_phoneticspelling ?

                            <Text style={[{ color: "#FFFFFF", fontSize: pxToDp(36), marginRight: pxToDp(20) }, appFont.bold]}>
                                {this.props.word_phoneticspelling}
                            </Text>

                            : null}
                        {audioPath.length > 0 ? <Audio
                            audioUri={`${audioPath}`}
                            pausedBtnImg={require("../../images/englishHomepage/en_voice.png")}
                            pausedBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                            playBtnImg={require("../../images/englishHomepage/en_voice.png")}
                            playBtnStyle={{ width: pxToDp(60), height: pxToDp(60) }}
                            ref={this.audio}
                        /> : null}
                    </View>
                </View>

                {/* <Audio uri={audioPath} paused={paused} pausedEvent={this.audioPaused} ref={this.audio}/> */}
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
