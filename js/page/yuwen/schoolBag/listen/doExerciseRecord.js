import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Modal,
    Animated,
    ScrollView,
} from "react-native";
import { appStyle } from "../../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool
} from "../../../../util/tools";
import Sound from "react-native-sound";
import url from "../../../../util/url";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import RichShowView from "../../../../component/chinese/RichShowView";

class CharacterHelpModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isStartAudio: false,
            exerciseDetail: {},
            helpVisible: false,

        };
        this.audioHelp = undefined;

    }

    componentDidMount() {
        const data = {
            origin: this.props.navigation.state.params.data.origin,
        };
        axios.get(api.getChineseListenExeciseRecord, { params: data }).then((res) => {
            if (res && res.data.err_code === 0) {
                this.setState({
                    exerciseDetail: res.data.data,

                }, () => {
                    this.setState({
                        helpVisible: true
                    })
                })
            }
        });
    }

    goback = () => {
        this.closeHelpAudio()
        NavigationUtil.goBack(this.props);  // this.props.goback();
    };

    componentWillUnmount() {
        this.closeHelpAudio()
    }
    playHeplAudio = () => {
        const { isStartAudio } = this.state;
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        // this.closeHelpAudio1()
        // console.log("isStartAudio", isStartAudio, this.state.exerciseDetail.explanation_audio,)
        if (this.audioHelp) {
            isStartAudio
                ? this.audioHelp.pause()
                : this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                        this.closeHelpAudio()
                    }
                });
            this.setState({
                isStartAudio: !isStartAudio,
            });
            return;
        }
        this.audioHelp = new Sound(
            url.baseURL + this.state.exerciseDetail.explanation_audio,
            null,
            (error) => {
                console.log("isStartAudio123", isStartAudio)

                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp.play((success) => {
                        if (success) {
                            this.audioHelp.release();
                            this.closeHelpAudio()
                        }
                    });
                    this.setState(() => ({
                        isStartAudio: true,
                    }));
                }
            }
        );
    };
    // 关闭帮助播放
    closeHelpAudio = () => {
        if (this.audioHelp) {
            this.audioHelp.stop();
            this.audioHelp = undefined;
            this.setState(() => ({
                isStartAudio: false,
            }));
        }
    };
    render() {
        let { isStartAudio, exerciseDetail } = this.state

        return (
            <View>
                <ImageBackground
                    style={{ width: '100%', height: '100%', alignItems: 'center' }}
                    source={require('../../../../images/chineseHomepage/flowBigBg.png')}
                >
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { paddingLeft: pxToDp(64), width: '100%', paddingTop: pxToDp(32), marginBottom: -2, paddingRight: pxToDp(64) }]}>

                        {/* <View style={{ marginBottom: pxToDp(84), paddingLeft: pxToDp(64), width: '100%', paddingTop: pxToDp(32) }}> */}
                        <TouchableOpacity onPress={this.goback} style={{}}>
                            <Image
                                style={[size_tool(80)]}
                                source={require('../../../../images/chineseHomepage/wrongTypeGoback.png')} /></TouchableOpacity>
                        <View style={[size_tool(400, 100), appStyle.flexCenter, borderRadius_tool(40, 40, 0, 0),
                        {
                            backgroundColor: '#A86A33',

                        }]}>
                            <Text style={[{ fontSize: pxToDp(60), color: '#fff', fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2' }]}>知识点讲解</Text>
                        </View>
                        <Text style={[size_tool(80)]}></Text>
                    </View>
                    {/* <View
                style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: pxToDp(92) }}
            > */}
                    <View style={[{ backgroundColor: '#A86A33', flex: 1 }, size_tool(1800, 860), borderRadius_tool(40, 40, 0, 0), padding_tool(40, 40, 0, 40)]}>
                        <View style={[{ backgroundColor: '#1F1F1F', flex: 1 }, borderRadius_tool(40, 40, 0, 0), padding_tool(40)]}>
                            <View style={[{ backgroundColor: '#fff', flex: 1 }, borderRadius_tool(40), padding_tool(40)]}>

                                {/* <View style={[, { width: pxToDp(1750), height: pxToDp(732), backgroundColor: '#fff', padding: pxToDp(32), borderRadius: pxToDp(32) }]}> */}
                                <ScrollView style={{ height: pxToDp(668), }}>
                                    {exerciseDetail.explanation_audio ? (
                                        <TouchableOpacity onPress={this.playHeplAudio}>
                                            {isStartAudio ? (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../images/stop_icon.png")}
                                                ></Image>
                                            ) : (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../images/playAudio_icon.png")}
                                                ></Image>
                                            )}
                                        </TouchableOpacity>
                                    ) : null}
                                    <RichShowView
                                        divStyle={"font-size: x-large"}
                                        pStyle={"font-size: x-large"}
                                        spanStyle={"font-size: x-large"}
                                        width={pxToDp(1648)}
                                        value={exerciseDetail.knowledgepoint_explanation}
                                    ></RichShowView>
                                </ScrollView>
                                {/* </View> */}
                            </View>

                        </View>

                    </View>
                    <View style={[{ height: pxToDp(100), backgroundColor: '#FDC798', paddingTop: pxToDp(20), width: '100%' }]}>
                        <View style={[{ flex: 1, backgroundColor: '#A86A33', paddingTop: pxToDp(20), width: '100%' }]}>
                            < View style={[{ flex: 1, backgroundColor: '#6F2F09', paddingTop: pxToDp(20), width: '100%' }]}>

                            </View>
                        </View>
                    </View>
                    {/* </View> */}
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
export default CharacterHelpModal;
