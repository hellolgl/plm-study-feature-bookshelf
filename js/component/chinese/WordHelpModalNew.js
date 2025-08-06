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
    fontFamilyRestoreMargin,
} from "../../util/tools";
import DashSecondLine from "../dashLine";
import Sound from "react-native-sound";
import url from "../../util/url";
import Audio from "../../util/audio/audio";

class CharacterHelpModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.audio = undefined;
    }
    onShow = () => {
        // const { opacityList } = this.state;
        // this.playAudioHelp(0);
    };
    //关闭语音播放
    closeAudio = () => {
        if (this.audio) {
            this.audio.stop();
            this.audio = undefined;
        }
    };
    // 播放读音
    playAudioHelp = (index) => {
        let path = url.baseURL + this.props.detailsObj.audio;
        // console.log("播放语音地址", this.props.detailsObj.audio, path);
        if (!path) {
            return;
        }
        if (this.audio) {
            this.audio.stop(() => {
                this.audio.play();
            });
            this.audio = undefined;
            // this.audio.stop(() => {
            //   this.audio.play((success) => {
            //     if (success) {
            //       this.audio.release();
            //     }
            //   });
            // });
            // return;
        }
        this.audio = new Sound(path, null, (error) => {
            if (error) {
                console.log("播放失败");
            } else {
                this.audio.play((success) => {
                    if (success) {
                        this.audio.release();
                    }
                });
            }
        });
    };
    renderPY = (detailsObj) => {
        // const { opacityList } = this.state;
        // detailsObj.pinyin_tag = 1
        // detailsObj.pinyin = [['ch','ao'], "cheng","cheng","cheng"];
        // detailsObj.pinyin_tag = 0
        // console.log("拼音", detailsObj);
        if (detailsObj.pinyin) {
            //1为多音字，0为非多音字
            return (
                <View style={[styles.contentWrap]}>
                    {this.props.detailsObj.audio.length > 0 ? (
                        <Audio
                            audioUri={`${url.baseURL}${this.props.detailsObj.audio}`}
                            pausedBtnImg={require("../../images/chineseHomepage/pingyin/new/wordAudio.png")}
                            pausedBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                            playBtnImg={require("../../images/chineseHomepage/pingyin/new/wordAudio.png")}
                            playBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                            wrapStyle={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Text style={[styles.contentText]}>{detailsObj.pinyin}</Text>
                        </Audio>
                    ) : (
                        <Text style={[styles.contentText]}>{detailsObj.pinyin}</Text>
                    )}
                </View>
            );
        }
    };

    nextTopaicHelp = () => {
        this.closeAudio();
        this.props.nextTopaicHelp();
    };
    render() {
        let wordHelpStatus = this.props.wordHelpStatus;
        let detailsObj = this.props.detailsObj;
        return (
            <Modal
                animationType="fade"
                title="词帮助"
                transparent
                presentationStyle={"fullScreen"}
                visible={wordHelpStatus}
                onShow={this.onShow}
                supportedOrientations={["portrait", "landscape"]}
            >
                <ImageBackground
                    source={require("../../images/chineseHomepage/flow/flowBg.png")}
                    style={[styles.modalContainer]}
                >
                    <View
                        style={[
                            appStyle.ml48,
                            appStyle.mr48,
                            // appStyle.flexTopLine,
                            appStyle.height110,
                            appStyle.flexJusCenter,
                            borderRadius_tool(16),
                            {
                                height: pxToDp(122),
                                width: "100%",
                                paddingLeft: pxToDp(20),
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[styles.nextText]}
                            onPress={this.nextTopaicHelp}
                        >
                            <Image
                                source={require("../../images/chineseHomepage/pingyin/new/back.png")}
                                style={[{ width: pxToDp(120), height: pxToDp(80) }]}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1 }, padding_tool(10, 114, 20, 114)]}>
                        <ScrollView>
                            <Text style={[styles.titleTxt, styles.titleMar]}>答案解析</Text>
                            <View style={[styles.mainWrap]}>
                                <Text style={[styles.titleTxt]}>
                                    {this.props.diagnose_notes}
                                </Text>
                            </View>
                            <View style={[appStyle.flexTopLine, styles.itemWrap]}>
                                <View style={[appStyle.flexLine]}>
                                    {/* 字，部首，结构 */}
                                    <Text
                                        style={[
                                            {
                                                color: "#475266",
                                                fontSize: pxToDp(200),
                                                marginRight: pxToDp(40),
                                                fontFamily:
                                                    Platform.OS === "ios"
                                                        ? "AaBanruokaishu (Non-Commercial Use)"
                                                        : "1574320058",
                                            },
                                        ]}
                                    >
                                        {this.props.detailsObj?.showHelpText}
                                    </Text>
                                </View>
                                <View style={[padding_tool(20, 0, 20, 0), { flex: 1 }]}>
                                    <View
                                        style={[
                                            appStyle.flexJusBetween,
                                            { width: pxToDp(560), paddingTop: pxToDp(20) },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                appStyle.flexTopLine,
                                                appStyle.flexLineWrap,
                                                {
                                                    width: "100%",
                                                },
                                            ]}
                                        >
                                            {Object.keys(detailsObj).length > 0
                                                ? this.renderPY(detailsObj)
                                                : null}
                                        </View>
                                    </View>
                                    <View
                                        style={[appStyle.flexTopLine, padding_tool(20, 0, 20, 0)]}
                                    >
                                        <Text style={[styles.titleText]}>释义:</Text>
                                        <Text style={[styles.titleMain]}>{detailsObj.meaning}</Text>
                                    </View>
                                    {detailsObj.word_idiom ? (
                                        <View style={[appStyle.flexTopLine]}>
                                            <Text style={[styles.titleText]}>造句:</Text>
                                            <Text style={[styles.titleMain]}>
                                                {detailsObj.word_idiom}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                            <View style={[styles.wordMainWrap]}>
                                {detailsObj.word_synonym ? (
                                    <View style={[styles.wordWrap]}>
                                        <Text style={[styles.wordMain]}>
                                            {detailsObj.word_synonym}
                                        </Text>
                                        <Text style={[styles.wordTitle]}>近义词</Text>
                                    </View>
                                ) : null}
                                {detailsObj.word_antonym ? (
                                    <View style={[styles.wordWrap]}>
                                        <Text style={[styles.wordMain]}>
                                            {detailsObj.word_antonym}
                                        </Text>
                                        <Text style={[styles.wordTitle]}>反义词</Text>
                                    </View>
                                ) : null}
                                {detailsObj.word_confusing ? (
                                    <View style={[styles.wordWrap]}>
                                        <Text style={[styles.wordMain]}>
                                            {detailsObj.word_confusing}
                                        </Text>
                                        <Text style={[styles.wordTitle]}>易混淆词语</Text>
                                    </View>
                                ) : null}
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        height: "100%",
        paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0,
    },
    titleTxt: {
        ...appFont.fontFamily_syst_bold,
        color: "#475266",
        fontSize: pxToDp(44),
        lineHeight: pxToDp(54),
    },
    mainWrap: {
        width: "100%",
        minHeight: pxToDp(160),
        borderRadius: pxToDp(20),
        backgroundColor: "#fff",
        justifyContent: "center",
        ...padding_tool(20, 40, 20, 40),
        marginBottom: pxToDp(18),
    },
    titleMar: {
        marginBottom: pxToDp(10),
    },
    titleMain: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(44),
        lineHeight: pxToDp(54),
        color: "#475266",
        marginRight: pxToDp(20),
        flex: 1,
    },
    itemWrap: {
        backgroundColor: "rgba(255,255,255,0.5)",
        minHeight: pxToDp(380),
        borderRadius: pxToDp(24),
        alignItems: "center",
        ...padding_tool(0, 40, 0, 40),
        marginBottom: pxToDp(52),
    },
    titleText: {
        color: "#475266",
        fontSize: pxToDp(44),
        ...appFont.fontFamily_syst,
        lineHeight: pxToDp(54),
        marginRight: pxToDp(10),
    },
    contentText: {
        fontSize: pxToDp(48),
        color: "#475266",
        marginLeft: pxToDp(10),
        ...appFont.fontFamily_syst_bold,
        lineHeight: pxToDp(60),
    },
    wordMainWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    wordWrap: {
        minHeight: pxToDp(180),
        minWidth: pxToDp(200),
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: pxToDp(20),
        marginRight: pxToDp(40),
        ...padding_tool(20, 40, 20, 40),
        marginBottom: pxToDp(40),
        justifyContent: "center",
    },
    wordMain: {
        ...appFont.fontFamily_syst_bold,
        fontSize: pxToDp(44),
        color: "#475266",
        lineHeight: pxToDp(60),
        marginBottom: pxToDp(10),
    },
    wordTitle: {
        ...appFont.fontFamily_syst,
        fontSize: pxToDp(32),
        color: "#475266",
        lineHeight: pxToDp(42),
    },
});
export default CharacterHelpModal;
