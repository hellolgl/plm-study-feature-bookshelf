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
    Platform,
} from "react-native";
import { appStyle, appFont } from "../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    margin_tool,
    fontFamilyRestoreMargin
} from "../../util/tools";
import DashSecondLine from "../dashLine";
import Sound from "react-native-sound";
import RichShowView from "./RichShowView";
import url from "../../util/url";
const ranking_map = {
    "0": "太棒了，答对了哦！",
    "1": "一般，还有更好的组合,继续努力！",
    "2": "答错了，继续努力！",
};
const ranking_color_map = {
    "0": "#7FD23F",
    "1": "#FCAC14",
    "2": "#FC6161",
};
class CharacterHelpModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isStartAudio: false,
            isStartAudio1: false,
            ranking: '',
        };
        this.audioHelp = undefined;
        this.audioHelp1 = undefined
    }


    nextTopaicHelp = () => {
        this.closeHelpAudio();
        this.closeHelpAudio1()
        this.props.goback();
    };
    playHeplAudio = () => {
        const { isStartAudio } = this.state
        const { currentTopic } = this.props
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        // this.closeHelpAudio1()
        // console.log("isStartAudio", isStartAudio, currentTopic.explanation_audio,)
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
            url.baseURL + currentTopic.explanation_audio,
            null,
            (error) => {
                // console.log("isStartAudio123", isStartAudio)

                if (error) {
                    console.log("播放失败", error);
                } else {
                    // this.audioHelp.setNumberOfLoops(-1);
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
    playHeplAudio1 = () => {
        const { isStartAudio1 } = this.state;
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        // this.closeHelpAudio1()
        // console.log("isStartAudio", isStartAudio, this.props.audio,)
        const { currentTopic } = this.props

        if (this.audioHelp1) {
            isStartAudio1
                ? this.audioHelp1.pause()
                : this.audioHelp1.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                        this.closeHelpAudio1()
                    }
                });
            this.setState({
                isStartAudio1: !isStartAudio1,
            });
            return;
        }
        this.audioHelp1 = new Sound(
            url.baseURL + currentTopic.standard_audio,
            null,
            (error) => {
                // console.log("isStartAudio123", isStartAudio)

                if (error) {
                    console.log("播放失败", error);
                } else {
                    // this.audioHelp.setNumberOfLoops(-1);
                    this.audioHelp1.play((success) => {
                        if (success) {
                            this.audioHelp1.release();
                            this.closeHelpAudio1()
                        }
                    });
                    this.setState(() => ({
                        isStartAudio1: true,
                    }));
                }
            }
        );
    };
    // 关闭帮助播放
    closeHelpAudio1 = () => {
        if (this.audioHelp1) {
            this.audioHelp1.stop();
            this.audioHelp1 = undefined;
            this.setState(() => ({
                isStartAudio1: false,
            }));
        }
    };
    renderTemplate = () => {
        const { currentTopic } = this.props
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic))
        _currentTopic.template_word.forEach((i, index) => {
            _currentTopic.sentence_stem[i.position].desc = i.desc
        })
        // console.log('renderTemplate', _currentTopic)
        let htm = []
        _currentTopic.sentence_stem.forEach((item, index) => {
            let h = <View>
                <View style={[appStyle.flexJusCenter, appStyle.flexCenter, {

                }]}>
                    {console.log('模板', item)}
                    <View style={[{
                        borderBottomWidth: item.desc ? pxToDp(4) : 0,
                        borderBottomColor: 'red',
                        marginLeft: pxToDp(4),
                        marginRight: pxToDp(4)
                    }]}>
                        <Text style={[{ fontSize: pxToDp(36), paddingBottom: pxToDp(8), }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', '', { lineHeight: pxToDp(40) })]}>{item.content}</Text>
                    </View>
                    <View>
                        {item.desc ? <Text style={[{ fontSize: pxToDp(26), color: "red" }, appFont.fontFamily_syst]}>{item.desc}</Text> : null}
                    </View>
                </View>

            </View>
            htm.push(h)
        })
        return <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
            {htm}
        </View>
    }
    render() {
        let { isStartAudio, isStartAudio1, } = this.state
        const { currentTopic, doNumber, best_answer_three, diagnose, isSpe, ranking } = this.props
        return (
            <Modal
                animationType="fade"
                // // title="知识讲解"
                // presentationStyle="fullScreen"
                // transparent
                // maskClosable={false}
                visible={this.props.status}
            // footer={[{ text: "关闭", onPress: this.handlenOnCloseHelpThrottled }]}
            // style={{ width: pxToDp(2000) }}
            >
                <ImageBackground
                    style={{ width: '100%', height: '100%', alignItems: 'center' }}
                    source={require('../../images/chineseHomepage/flowBigBg.png')}
                >
                    {/* <View
                    style={[{ width: '100%', height: '100%', alignItems: 'center', backgroundColor: "#F5D6A6" },]}
                > */}
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { paddingLeft: pxToDp(64), width: '100%', paddingTop: pxToDp(32), marginBottom: -2, paddingRight: pxToDp(64) }]}>
                        <TouchableOpacity onPress={this.nextTopaicHelp} style={{}}>
                            <Image
                                style={[size_tool(80)]}
                                source={require('../../images/chineseHomepage/wrongTypeGoback.png')} /></TouchableOpacity>
                        <View style={[size_tool(400, 100), appStyle.flexCenter, borderRadius_tool(40, 40, 0, 0),
                        {
                            backgroundColor: '#A86A33',

                        }]}>
                            <Text style={[{
                                fontSize: pxToDp(60), color: '#fff',
                                fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2'
                            }]}>知识点讲解</Text>
                        </View>
                        <Text style={[size_tool(80)]}></Text>
                    </View>
                    <View style={[{ backgroundColor: '#A86A33', flex: 1 }, size_tool(1800, 860), borderRadius_tool(40, 40, 0, 0), padding_tool(40, 40, 0, 40)]}>
                        <View style={[{ backgroundColor: '#1F1F1F', flex: 1 }, borderRadius_tool(40, 40, 0, 0), padding_tool(40)]}>
                            <View style={[{ flex: 1 }, appStyle.flexTopLine,]}>
                                {/* {ishelp ? */}
                                <View style={[{ width: pxToDp(800), backgroundColor: '#fff', borderRadius: pxToDp(40), marginRight: pxToDp(40), padding: pxToDp(40) }]}>
                                    <ScrollView
                                    // style={[{ maxHeight: 250 }]}
                                    // onLayout={this._onLayoutModal}
                                    >

                                        <Text
                                            style={[{
                                                textAlign: "center",
                                                color: ranking_color_map[ranking],
                                                marginBottom: pxToDp(20),
                                                fontSize: pxToDp(36),
                                            }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}
                                        >
                                            {ranking_map[ranking]}
                                        </Text>


                                        <View style={[{ marginBottom: pxToDp(20) }]}>
                                            <Text style={[{ fontSize: pxToDp(36), color: '#38B3FF' }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>你的答案：</Text>
                                            {isSpe ?
                                                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                                                    {/* 文化积累，句型运用 */}

                                                    {currentTopic?.sentence_stem ? currentTopic.sentence_stem.map((item, index) => {
                                                        return <Text style={[item.isCenter ? { color: 'red' } : null, { fontSize: pxToDp(36) }, item.slectLabel ? { color: '#8E2904' } : null, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{item.slectLabel ? item.slectLabel : null}</Text>
                                                    }) : null}
                                                </View> :
                                                <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                                                    {currentTopic?.sentence_stem
                                                        ? currentTopic?.sentence_stem.map((item, index) => {

                                                            if (item.slectLabel) {
                                                                return (
                                                                    <Text
                                                                        style={[
                                                                            {
                                                                                fontSize: pxToDp(36),
                                                                                color:
                                                                                    item.slectLabel === "请选择"
                                                                                        ? "#000"
                                                                                        : "#38B3FF",
                                                                            },
                                                                            appFont.fontFamily_syst, fontFamilyRestoreMargin()
                                                                        ]}
                                                                        key={index}
                                                                    >
                                                                        {item.slectLabel === "请选择"
                                                                            ? "_____"
                                                                            : item.slectLabel.indexOf("#去掉") === -1
                                                                                ? item.slectLabel
                                                                                : null}
                                                                    </Text>

                                                                );
                                                            } else {
                                                                return (
                                                                    <Text
                                                                        style={[
                                                                            {
                                                                                fontSize: pxToDp(36),
                                                                                color: item.isCenter ? "#FC6161" : "#000",
                                                                            },
                                                                            appFont.fontFamily_syst, fontFamilyRestoreMargin()
                                                                        ]}
                                                                        key={index}
                                                                    >
                                                                        {item.content}
                                                                    </Text>
                                                                );
                                                            }
                                                        })
                                                        : null}
                                                </View>}
                                        </View>
                                        <View
                                            style={{
                                                display: doNumber === 3 || ranking === "0" ? "flex" : "none",
                                                // marginTop: pxToDp(20),
                                                paddingRight: pxToDp(20)
                                            }}
                                        >
                                            <Text style={[{ color: "#7FD23F", fontSize: pxToDp(36) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>
                                                最佳答案:
                                            </Text>
                                            {best_answer_three?.length > 0
                                                ? best_answer_three.map((item, index) => {
                                                    return (
                                                        <View style={[{ paddingRight: pxToDp(20) }, appStyle.flexTopLine]} key={index}>
                                                            <Image source={require('../../images/chineseGou.png')} style={{ width: pxToDp(36), height: pxToDp(36), marginTop: pxToDp(16) }} />
                                                            <Text
                                                                style={[{
                                                                    color: "#000",
                                                                    fontSize: pxToDp(36),
                                                                }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}
                                                                key={index}
                                                            >
                                                                {item.replaceAll('#去掉#', '')}
                                                            </Text>
                                                        </View>
                                                    );
                                                })
                                                : currentTopic?.best_answer.map((item, index) => {
                                                    return (
                                                        <View style={[{ paddingRight: pxToDp(20) }, appStyle.flexTopLine]} key={index}>
                                                            <Image source={require('../../images/chineseGou.png')} style={{ width: pxToDp(36), height: pxToDp(36), marginTop: pxToDp(16) }} />
                                                            <Text
                                                                style={[{
                                                                    color: "#000",
                                                                    fontSize: pxToDp(36),
                                                                }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}
                                                                key={index}
                                                            >
                                                                {item.replaceAll('#去掉#', '')}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                        {isSpe !== '2' ? <Text style={[{ color: '#FD942D', fontSize: pxToDp(36), marginTop: pxToDp(20) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>【解析】</Text> : null}

                                        {diagnose ? (
                                            <Text style={[{ fontSize: pxToDp(36), marginBottom: pxToDp(20) }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>{diagnose}</Text>
                                        ) : null}
                                        <View style={[{ paddingTop: pxToDp(20) }]}>
                                            {currentTopic?.sentence_stem && isSpe !== '2' ? <Text style={[{ color: '#FD942D', fontSize: pxToDp(36), }, appFont.fontFamily_syst, fontFamilyRestoreMargin()]}>【例句分析】</Text> : null}

                                            {currentTopic?.sentence_stem && isSpe !== '2' ? this.renderTemplate() : null}
                                        </View>
                                    </ScrollView>
                                </View>

                                <View style={[{ flex: 1, backgroundColor: '#fff' }, borderRadius_tool(40), padding_tool(40)]}>
                                    <ScrollView style={{ height: pxToDp(668), }}>
                                        {currentTopic?.explanation_audio ? (
                                            <TouchableOpacity onPress={this.playHeplAudio}>
                                                {isStartAudio ? (
                                                    <Image
                                                        style={[size_tool(60)]}
                                                        source={require("../../images/stop_icon.png")}
                                                    ></Image>
                                                ) : (
                                                    <Image
                                                        style={[size_tool(60)]}
                                                        source={require("../../images/playAudio_icon.png")}
                                                    ></Image>
                                                )}
                                            </TouchableOpacity>
                                        ) : null}
                                        {currentTopic?.standard_audio ? (
                                            <TouchableOpacity onPress={this.playHeplAudio1}>
                                                {isStartAudio1 ? (
                                                    <Image
                                                        style={[size_tool(60)]}
                                                        source={require("../../images/stop_icon.png")}
                                                    ></Image>
                                                ) : (
                                                    <Image
                                                        style={[size_tool(60)]}
                                                        source={require("../../images/playAudio_icon.png")}
                                                    ></Image>
                                                )}
                                            </TouchableOpacity>
                                        ) : null}
                                        <RichShowView
                                            width={pxToDp(720)}
                                            value={currentTopic?.explanation}
                                        ></RichShowView>
                                        <RichShowView
                                            width={pxToDp(720)}
                                            value={currentTopic.standard_explain}
                                        ></RichShowView>
                                    </ScrollView>
                                </View>
                            </View>

                        </View>

                    </View>
                    <View style={[{ height: pxToDp(100), backgroundColor: '#FDC798', paddingTop: pxToDp(20), width: '100%' }]}>
                        <View style={[{ flex: 1, backgroundColor: '#A86A33', paddingTop: pxToDp(20), width: '100%' }]}>
                            < View style={[{ flex: 1, backgroundColor: '#6F2F09', paddingTop: pxToDp(20), width: '100%' }]}>

                            </View>
                        </View>
                    </View>
                    {/* <View
                style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: pxToDp(92) }}
            > */}
                    {/* <View style={[, { width: pxToDp(1750), height: pxToDp(732), backgroundColor: '#fff', padding: pxToDp(32), borderRadius: pxToDp(32) }]}>
                        
                    </View> */}
                    {/* </View> */}
                    {/* </View> */}
                </ImageBackground>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#373635",
    },
    nextText: {
        right: 0,
    },
    contentWrap: {
        marginRight: pxToDp(20)
    },
    contentText: {
        fontSize: pxToDp(36),
        color: "#fff"
    },
    titleText: {
        color: '#AAAAAA',
        fontSize: pxToDp(32),
        marginBottom: pxToDp(20)
    },
    itemWrap: {
        backgroundColor: '#474747',
        height: pxToDp(360),
        borderRadius: pxToDp(24),
        padding: pxToDp(20),
    },
});
export default CharacterHelpModal;
