import React, { Component, } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, Text, ImageBackground, Platform } from 'react-native';
import {
    size_tool,
    pxToDp,
    padding_tool,
    margin_tool,
    borderRadius_tool
} from "../../util/tools";
import { appFont, appStyle, } from "../../theme";
import HelpCard from './HelpCardNew1'
import Audio from "../../util/audio/audio"
import url from "../../util/url";

import HelpSentenceModal from './HelpSentenceModal'
/**
 * kygType 1:单词 2:句子
 */
export default class HelpModal extends Component {

    constructor(props) {
        super(props)
        this.url = url.baseURL
    }

    componentDidMount() {
    }

    nextTopaicHelp = () => {
        this.props.closeModal()
    }

    renderAduioBtn = (src) => {
        return <Audio
            audioUri={`${this.url}${src}`}
            pausedBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
            pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
            playBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
            playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
        />
    }

    renderCard = () => {
        if (!this.props.knowledgeBody) return
        switch (+Object.getOwnPropertyNames(this.props.knowledgeBody).length) {
            case 1:
                return this.renderchild();
            default:
                return this.render2child();
        }
    }
    renderchild = () => {
        const info = this.props.knowledgeBody[0]
        return <View style={[{ flex: 1, width: '100%', position: 'relative', paddingBottom: pxToDp(80) }, appStyle.flexCenter]}>
            <View style={[{ position: 'absolute', top: pxToDp(80), left: pxToDp(240) }]}>
                {this.renderAduioBtn(info.audio)}
            </View>
            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(100), color: '#fff', marginBottom: pxToDp(50), lineHeight: pxToDp(Platform.OS === 'ios' ? 120 : 110) }]}>{info.word}</Text>
            <Image style={{
                width: pxToDp(400),
                height: pxToDp(300),
                resizeMode: "contain",
                marginBottom: pxToDp(50)
            }}
                resizeMode="contain"
                source={{ uri: this.url + info.picture }} />
            <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(54), color: '#fff', lineHeight: pxToDp(Platform.OS === 'ios' ? 70 : 60) }]} >{info.word_phoneticspelling}</Text>
        </View>
    }

    renderItem = (info, imageStyle, titleStyle, txtStyle, wrapStyle) => {
        return <View style={[appStyle.flexCenter, borderRadius_tool(30), wrapStyle]} >
            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(66), color: '#fff', marginBottom: pxToDp(20), lineHeight: pxToDp(Platform.OS === 'ios' ? 80 : 70) }, titleStyle,]}>{info.word}</Text>
            <View style={[{
                ...imageStyle,
                backgroundColor: '#2B2A2A',
                borderRadius: pxToDp(30),
                marginBottom: pxToDp(20),

            }]}>
                <Image style={{
                    resizeMode: "contain",
                    borderRadius: pxToDp(30),
                    ...imageStyle,
                }}
                    resizeMode="contain"
                    source={{ uri: this.url + info.picture }} />
            </View>

            <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(46), color: '#fff', lineHeight: pxToDp(Platform.OS === 'ios' ? 60 : 50), marginBottom: pxToDp(20) }, txtStyle]} >{info.word_phoneticspelling}</Text>
            {this.renderAduioBtn(info.audio)}
        </View>
    }
    render2child = () => {
        // if (this.props.kygType === '1') {
        //单词短语
        const list = this.props.knowledgeBody
        return (
            <View style={[styles.wordWrap, appStyle.flexJusBetween]}>
                {this.renderItem(list[0], { ...size_tool(482, 362) }, { fontSize: pxToDp(75), lineHeight: pxToDp(Platform.OS === 'ios' ? 90 : 80) }, { fontSize: pxToDp(54), lineHeight: pxToDp(Platform.OS === 'ios' ? 70 : 60) })}

                <View style={[{
                    flex: 1,
                    marginLeft: pxToDp(32), paddingLeft: pxToDp(50), position: 'relative'
                }, appStyle.flexTopLine, appStyle.flexAliCenter]} >
                    <View style={[styles.sanjiao]}></View>
                    <View style={[{ flex: 1, backgroundColor: '#313131', height: '100%' }, appStyle.flexCenter, borderRadius_tool(60), appStyle.flexTopLine, appStyle.flexJusCenter, padding_tool(0, 50, 0, 50)]} >
                        {list[1] ? this.renderItem(list[1], { ...size_tool(354, 265) }, {}, {}, { backgroundColor: '#444', ...size_tool(540, 720) }) : null}
                        {list[2] ? this.renderItem(list[2], { ...size_tool(354, 265) }, {}, {}, { backgroundColor: '#444', ...size_tool(540, 720), marginLeft: pxToDp(42) }) : null}

                    </View>
                </View>
            </View >
        )

        // }
    }
    renderSentence = () => {
        const info = this.props.knowledgeBody[0] ? this.props.knowledgeBody[0] : {}
        return <View style={[{ flex: 1, width: '100%' }, padding_tool(10, 70, 70, 90)]}>
            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(66), color: '#fff' }]}>解析:</Text>
            {
                info.gpc ? <View style={[appStyle.flexJusCenter, { height: pxToDp(230), backgroundColor: '#313131', marginBottom: pxToDp(20) }, borderRadius_tool(40), padding_tool(40)]} >
                    <Text style={[styles.normalTxt]}>{info.gpc}</Text>
                </View> : null
            }
            <View style={[appStyle.flexTopLine]}>
                <View style={[{ flex: 1 }]}>
                    <Text style={[styles.normalTxt]} >{info.word}</Text>
                    <View style={[padding_tool(20, 0, 20, 0)]}>
                        {this.renderAduioBtn(info.audio)}
                    </View>
                    <Text style={[styles.normalTxt]} >{info.meaning}</Text>
                </View>
                {info.picture ? <Image style={{
                    width: pxToDp(400),
                    height: pxToDp(300),
                    resizeMode: "contain",
                    marginBottom: pxToDp(50)
                }}
                    resizeMode="contain"
                    source={{ uri: this.url + info.picture }} /> : null}
            </View>
        </View>
    }
    render() {

        const { knowledgeBody } = this.props
        var len = this.props.len;
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        let length = this.props.knowledgeBody ? +Object.getOwnPropertyNames(this.props.knowledgeBody).length : 0
        if (length === 0) {
            return null
        }
        let isSen = this.props.kygType !== '1' ? true : false
        console.log("render help modal...", isSen, this.props.knowledgeBody)
        return (
            <View>
                <Modal animationType="fade" visible={this.props.visible}>

                    <ImageBackground
                        source={require('../../images/english/abcs/doBg.png')}
                        style={[
                            {
                                flex: 1,
                                width: pxToDp(2048),
                                height: pxToDp(600),
                                backgroundColor: '#F5D6A6',
                                alignItems: 'center'
                            },
                            appStyle.flexCenter
                        ]}
                    >
                        <View
                            style={[styles.modalHeader, appStyle.flexJusCenter,]}
                        >
                            <TouchableOpacity
                                style={[styles.nextText,]}
                                onPress={this.nextTopaicHelp}
                            >
                                <Image
                                    source={require('../../images/chineseHomepage/pingyin/new/back.png')}
                                    style={[size_tool(120, 80),
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                            <ImageBackground
                                style={[padding_tool(40, 40, 0, 40), styles.wordmainWrap]}
                                source={require('../../images/english/abcs/helpBg.png')}
                                resizeMode='cover'
                            >
                                <View style={[styles.wordmainInBg]}>
                                    {!isSen ? this.renderCard() :
                                        this.renderSentence()
                                    }
                                </View>
                            </ImageBackground>

                        </View>

                    </ImageBackground>

                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    modalHeader: {
        height: pxToDp(123),
        width: '100%',
        paddingLeft: pxToDp(70),
        paddingTop: pxToDp(40),
        marginBottom: pxToDp(20)
    },
    nextText: {
        width: pxToDp(80),
        height: pxToDp(80)
    },
    contentWrap: {
        // position: "absolute",
        backgroundColor: "#fff",
        zIndex: 1,
        minWidth: pxToDp(220),
        minHeight: pxToDp(100),
    },
    wordWrap: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
        ...padding_tool(0, 40, 100, 80)
    },
    wordItemWrap: {
        backgroundColor: '#474747',
        height: pxToDp(620),
        width: pxToDp(420),
        borderRadius: pxToDp(32),
        paddingTop: pxToDp(20),
        position: 'relative'
    },
    wordheader: {
        position: 'absolute',
        left: pxToDp(130),
        top: pxToDp(-30)
    },
    wordmainWrap: {
        alignItems: 'center',
        width: pxToDp(1992),
        height: pxToDp(904),

    },
    wordmainInBg: {
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    wordFooter: {
        height: pxToDp(100),
        width: '100%'
    },
    wordFooterbg1: {
        height: pxToDp(16),
        backgroundColor: '#FDC798'
    },
    wordFooterbg2: {
        height: pxToDp(24),
        backgroundColor: '#A86A33'
    },
    wordFooterbg3: {
        flex: 1,
        backgroundColor: '#6F2F09'
    },
    normalTxt: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(54),
        color: '#fff',
        lineHeight: pxToDp(Platform.OS === 'ios' ? 70 : 60)
    },
    sanjiao: {
        width: 0,
        height: 0,
        borderWidth: pxToDp(50),
        borderLeftColor: 'transparent',
        borderRightColor: '#313131',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        position: 'absolute',
        left: pxToDp(-50),
        zIndex: 999
    }
});
