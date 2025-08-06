import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, TouchableOpacity,
} from "react-native";
import {
    borderRadius_tool,
    padding_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";
import Audio from "../../../../../util/audio";
import url from "../../../../../util/url";

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPasued: true
        }
        this.audio = React.createRef()
    }
    playAudio = () => {
        const { wordType, word } = this.props
        if ((wordType === 'en' && word.audio) || (wordType === 'ch' && word.pinyin_1)) {
            this.setState({ isPasued: !this.state.isPasued }, () => {
            })
            this.audio.current.replay()
        }

    }
    audioPaused = () => this.setState({ isPasued: true })
    componentDidMount() {
        this.playAudio()
    }
    // componentDidUpdate(prevProps) {
    //     // console.log(prevProps, this.props)
    //     if (this.props.visible
    //         && (JSON.stringify(prevProps.word) !== JSON.stringify(this.props.word)
    //             || prevProps.wordType !== this.props.wordType)
    //     ) {
    //         this.playAudio()
    //     }
    // }
    render() {
        const { wordType, word } = this.props
        const { isPasued } = this.state
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>

                        <View style={[appStyle.flexAliCenter]}>
                            {word.pinyin_1 && wordType === 'ch' ? <View style={[{ height: pxToDp(228), marginBottom: pxToDp(40) }]}>
                                <TouchableOpacity
                                    onPress={this.playAudio}
                                >
                                    <Image source={require('../.././../../../images/mathProgram/audio.png')} style={[size_tool(240, 228),]} />
                                </TouchableOpacity>
                                <Audio uri={`${url.baseURL}${word.pinyin_1}`} paused={isPasued} pausedEvent={this.audioPaused} ref={this.audio} />
                            </View> : null}
                            {word.audio && wordType === 'en' ? <View style={[{ height: pxToDp(228), marginBottom: pxToDp(40) }]}>
                                <TouchableOpacity
                                    onPress={this.playAudio}
                                >
                                    <Image source={require('../.././../../../images/mathProgram/audio.png')} style={[size_tool(240, 228),]} />
                                </TouchableOpacity>
                                <Audio uri={`${url.baseURL}${word.audio}`} paused={isPasued} pausedEvent={this.audioPaused} ref={this.audio} />
                            </View> : null}
                            {wordType === 'ch' ? <View style={[appStyle.flexCenter]}>
                                {/* 中文 */}
                                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(36), color: '#5A5A68', lineHeight: pxToDp(40) }]}>{word.pinyin_2}</Text>
                                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(100), color: '#5A5A68', lineHeight: pxToDp(110), marginBottom: pxToDp(40) }]}>{word.chinese}</Text>

                            </View> :

                                <View style={[appStyle.flexCenter]}>
                                    {/*英语  */}
                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(80), color: '#475266', lineHeight: pxToDp(90), marginBottom: pxToDp(40) }]}>{word.english}</Text>

                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(60), color: '#475266', lineHeight: pxToDp(70) }]}>{word.chinese}</Text>

                                </View>}

                        </View>
                        <TouchableOpacity style={{ position: 'absolute', top: pxToDp(-20), right: pxToDp(-20) }} onPress={() => { this.props.close() }}>
                            <Image source={require('../.././../../../images/mathProgram/close.png')} style={[size_tool(80)]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content: {
        width: pxToDp(800),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40)
    },

});

const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(StatisticsModal);
