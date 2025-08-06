import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    //   Modal,
    Animated,
    ScrollView,
} from "react-native";
import { Modal } from "antd-mobile-rn";
import { appStyle } from "../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    borderRadius_tool,
    margin_tool,
} from "../../util/tools";
import DashSecondLine from "../dashLine";
import Sound from "react-native-sound";
import RichShowView from "../math/RichShowViewHtml";
import url from "../../util/url";
import Audio from "../../util/audio/audio";

class CharacterHelpModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isStartAudio: false,
        };
        this.audioHelp = undefined;
    }

    nextTopaicHelp = () => {
        this.closeHelpAudio();
        this.props.goback();
    };
    playHeplAudio = () => {
        const { isStartAudio } = this.state;
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        // this.closeHelpAudio1()
        // console.log("isStartAudio", isStartAudio, this.props.audio,)
        if (this.audioHelp) {
            isStartAudio
                ? this.audioHelp.pause()
                : this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                        this.closeHelpAudio();
                    }
                });
            this.setState({
                isStartAudio: !isStartAudio,
            });
            return;
        }
        this.audioHelp = new Sound(
            url.baseURL + this.props.audio,
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
                            this.closeHelpAudio();
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
        const { status, goback, audio, knowledgepoint_explanation } = this.props;
        // console.log("props", this.props);
        return (
            <Modal
                visible={status}
                // visible={false}
                transparent={true}
                style={[{ width: pxToDp(1000), backgroundColor: "regba(0,0,0,0)" }]}
                supportedOrientations={["portrait", "landscape"]}
            >
                {/* <View style={[{ flex: 1 }, appStyle.flexCenter]}> */}
                <ImageBackground
                    source={require("../../images/english/mix/helpBg.png")}
                    style={[
                        size_tool(968, 754),
                        padding_tool(60, 80, 100, 80),
                        { position: "relative" },
                    ]}
                >
                    <TouchableOpacity
                        style={[styles.footBtn, appStyle.flexCenter, size_tool(70)]}
                        onPress={goback}
                    >
                        {/* <Text style={{ fontSize: pxToDp(32), color: '#037AFF' }} >关闭</Text> */}
                        <Image
                            source={require("../../images/english/mix/helpClose.png")}
                            style={[size_tool(99)]}
                        />
                    </TouchableOpacity>
                    <View
                        style={[
                            {
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                            },
                        ]}
                    >
                        <ScrollView style={{ height: pxToDp(668) }}>
                            {audio ? (
                                <Audio
                                    audioUri={`${url.baseURL}${audio}`}
                                    pausedBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPausedAudio.png")}
                                    pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                    playBtnImg={require("../../images/chineseHomepage/pingyin/new/pinyinPlayAudio.png")}
                                    playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                    //   rate={0.75}
                                    onRef={(ref) => {
                                        this.audioRef = ref;
                                    }}
                                />
                            ) : null}
                            <View style={[{ width: pxToDp(800) }]}>
                                <RichShowView
                                    //   width={pxToDp(600)}
                                    value={knowledgepoint_explanation}
                                    color={"#fff"}
                                ></RichShowView>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
                {/* </View> */}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    footBtn: {
        // backgroundColor: 'red',
        flex: 1,
        position: "absolute",
        top: pxToDp(20),
        right: pxToDp(20),
    },
});
export default CharacterHelpModal;
