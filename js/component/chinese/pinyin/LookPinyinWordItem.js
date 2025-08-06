import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
    pxToDp,
    size_tool,
    pxToDpHeight,
    borderRadius_tool
} from "../../../util/tools";
import { appStyle } from "../../../theme";
import url from "../../../util/url";
import Audio from "../../../util/audio/audio"
import fonts from "../../../theme/fonts";

class Bar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isPasued: true,
        };
        this.audio = React.createRef()
    }
    componentDidMount() {

    }
    toDetail = () => {
        // const { value, props } = this.props
        // NavigationUtil.toChinesePinyinLookWordDetail({ ...props, data: { ...value } })
        this.props.clickBack()
    }
    audioPausedPrivate = () => {
        this.setState({
            isPasued: true,
        })
    }
    playAudio = () => {
        const { isPasued } = this.state
        console.log("will play audio..: ", isPasued, this.audio)
        if (isPasued) {
            this.audio.current.replay()
        }
        this.setState({
            isPasued: !isPasued,
        })
    }
    render() {
        const { value } = this.props;
        const { isPasued } = this.state
        return (

            <View onPress={this.toDetail} style={[appStyle.flexCenter, size_tool(396, 620), { marginRight: pxToDp(20), borderWidth: pxToDp(4), borderColor: '#F6F6F7', borderRadius: pxToDp(60) }]}>
                {/* <View style={[size_tool(316), appStyle.flexCenter, {
                    borderColor: value.status === '0' ? "#ccc" : '#fff',
                    borderWidth: pxToDp(4),
                    borderRadius: pxToDp(200),
                    position: 'relative',
                    marginBottom: pxToDp(40)
                }]}> */}
                {/* {value.audio ? <TouchableOpacity
                        onPress={this.playAudio}
                        style={[{
                            position: 'absolute',
                            top: pxToDp(-0),
                            right: pxToDp(0),
                            zIndex: 999,
                            borderRadius: pxToDp(50),
                            backgroundColor: '#fff',
                            borderWidth: pxToDp(4),
                            borderColor: value.status === '0' ? "#ccc" : '#41DA7E',
                        }, size_tool(80), appStyle.flexCenter]}>
                        <Image source={require('../../../images/chineseHomepage/pingyin/new/wordAudio.png')}
                            style={[size_tool(40),]}
                        />
                    </TouchableOpacity> : null} */}

                {/* {value.audio ? <Audio uri={`${url.baseURL}${value.audio}`} paused={isPasued} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
                        : null} */}



                {/* {
                        value.status === '0' ?
                            null :
                            <Image resizeMode='contain' source={require('../../../images/chineseHomepage/pingyin/new/wordBg1.png')}
                                style={[size_tool(316), { position: "absolute", top: 0, left: 0, zIndex: -1 }]}
                            />
                    } */}
                {/* </View> */}
                {
                    value.audio ?
                        <View
                            style={[{
                                position: 'absolute',
                                top: pxToDp(30),
                                right: pxToDp(30),
                                zIndex: 999,
                                borderRadius: pxToDp(50),
                                // backgroundColor: '#fff',
                                // borderWidth: pxToDp(4),
                                // borderColor: value.status === '0' ? "#ccc" : '#41DA7E',
                            }, size_tool(80), appStyle.flexCenter]}
                        >

                            <Audio
                                audioUri={`${url.baseURL}${value.audio}`}
                                pausedBtnImg={require("../../../images/chineseHomepage/pingyin/new/audioPlay1.png")}
                                pausedBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
                                playBtnImg={require("../../../images/chineseHomepage/pingyin/new/audioPlay1.png")}
                                playBtnStyle={{ width: pxToDp(120), height: pxToDp(120) }}
                            />
                        </View>
                        : null
                }
                <TouchableOpacity onPress={this.toDetail} style={[size_tool(300), borderRadius_tool(200), { backgroundColor: value.status === '0' ? '#5A6ABF' : '#00927A', marginBottom: pxToDp(60) }]}>
                    {/* <Image source={require('../../../images/chineseHomepage/pingyin/new/wordToDetail.png')}
                        style={[size_tool(140)]}
                        resizeMode='contain'
                    /> */}
                    <View style={[size_tool(300, 290), borderRadius_tool(200), appStyle.flexCenter, { backgroundColor: value.status === '0' ? '#6C7DDC' : '#00B295' }]}>
                        <Text style={[fonts.fonts_pinyin, { fontSize: pxToDp(50), color: '#fff', lineHeight: pxToDp(60), marginBottom: pxToDp(0) }]}>{value.pinyin_2}</Text>
                        <Text style={[fonts.fonts_pinyin, { fontSize: pxToDp(96), color: "#fff", lineHeight: pxToDp(112) }]}>
                            {value.knowledge_point}
                        </Text>
                    </View>

                </TouchableOpacity>
                {
                    this.props.show_translate ?
                        <Text style={[{ fontSize: pxToDp(50), color: "#475266", lineHeight: pxToDp(60) }, fonts.fonts_pinyin]}>
                            {value.english_knowledge_point}
                        </Text>
                        : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        height: pxToDp(46),
        backgroundColor: "#EEF3F5",
        borderRadius: pxToDp(32),
    },
    inner: {
        position: "absolute",
        left: 0,
        top: 0,
        height: pxToDp(46),
        borderRadius: pxToDp(32),
    },
});

export default Bar;
