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
import RenderHtml from "react-native-render-html";
import Sound from "react-native-sound";
import url from "../../util/url";
import Audio from "../../util/audio/audio";
import RichShowView from "../../component/chinese/newRichShowView";

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
        let path = url.baseURL + this.props.detailsObj.audio[index];
        console.log("播放语音地址", path);
        if (!path) {
            return;
        }
        if (this.audio) {
            this.audio.stop(() => {
                this.audio?.play();
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
                this.audio?.play((success) => {
                    if (success) {
                        this.audio?.release();
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
            let rederIndex0 = (item, index) => {
                if (index === 0) {
                    return (
                        <View style={[appStyle.flexTopLine]}>
                            <Text style={styles.contentText}>{item[0]}</Text>
                            <Text style={styles.contentText}>{item[1]}</Text>
                        </View>
                    );
                } else {
                    return <Text style={[styles.contentText]}>{item}</Text>;
                }
            };
            //1为多音字，0为非多音字
            if (detailsObj.pinyin_tag) {
                return (
                    <View style={[styles.contentWrap]}>
                        <View
                            style={[
                                appStyle.flexTopLine,
                                appStyle.flexLineWrap,
                                appStyle.flexJusBetween,
                            ]}
                        >
                            {detailsObj.pinyin.map((item, index) => {
                                let source =
                                    index === 0
                                        ? require("../../images/dyz1.png")
                                        : require("../../images/dyz2.png");
                                return (
                                    <Audio
                                        audioUri={`${url.baseURL}${this.props.detailsObj.audio[index]}`}
                                        pausedBtnImg={require("../../images/voice.png")}
                                        pausedBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                                        playBtnImg={require("../../images/voice.png")}
                                        playBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                                        wrapStyle={{ flexDirection: "row", alignItems: "center" }}
                                    >
                                        {rederIndex0(item, index)}
                                    </Audio>
                                );
                            })}
                        </View>
                    </View>
                );
            } else {
                return (
                    <View style={[styles.contentWrap]}>
                        <Audio
                            audioUri={`${url.baseURL}${this.props.detailsObj.audio[0]}`}
                            pausedBtnImg={require("../../images/chineseHomepage/pingyin/new/wordAudio.png")}
                            pausedBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                            playBtnImg={require("../../images/chineseHomepage/pingyin/new/wordAudio.png")}
                            playBtnStyle={{ width: pxToDp(40), height: pxToDp(40) }}
                            wrapStyle={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <Text style={[styles.contentText]}>{detailsObj.pinyin}</Text>
                        </Audio>
                    </View>
                );
            }
        }
    };

    nextTopaicHelp = () => {
        this.closeAudio();
        this.props.nextTopaicHelp();
    };
    render() {
        let characterHelpStatus = this.props.characterHelpStatus;
        let detailsObj = this.props.detailsObj;
        console.log('kkkkk', detailsObj)
        return (
            <Modal
                animationType="fade"
                title="字帮助"
                transparent
                presentationStyle={"fullScreen"}
                visible={characterHelpStatus}
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
                            <Text style={[styles.titleTxt]}>字义</Text>
                            <View style={[styles.mainWrap, { marginBottom: pxToDp(56) }]}>
                                <Text style={[styles.titleTxt]}>{detailsObj.meaning}</Text>
                            </View>
                            <View style={[appStyle.flexTopLine, styles.itemWrap]}>
                                <View
                                    style={[
                                        appStyle.flexLine,
                                        {
                                            flex: 1,
                                        },
                                    ]}
                                >
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
                                        <View
                                            style={[appStyle.flexTopLine, padding_tool(20, 0, 20, 0)]}
                                        >
                                            <View
                                                style={[appStyle.flexTopLine, appStyle.flexAliCenter]}
                                            >
                                                <Text style={[styles.titleText]}>部首:</Text>
                                                <Text style={[styles.titleMain]}>
                                                    {detailsObj?.radical}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    appStyle.flexTopLine,
                                                    appStyle.flexAliCenter,
                                                    { marginLeft: pxToDp(40) },
                                                ]}
                                            >
                                                <Text style={[styles.titleText]}>结构:</Text>
                                                <Text style={[styles.titleMain]}>
                                                    {detailsObj?.structure}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[appStyle.flexTopLine]}>
                                            <Text style={[styles.titleText]}>词组:</Text>
                                            <RichShowView
                                                width={pxToDp(950)}
                                                value={detailsObj.html ? detailsObj.html : ""}
                                                size={6}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <Image
                                    style={[
                                        size_tool(280),
                                        {
                                            backgroundColor: "#fff",
                                            borderRadius: pxToDp(20),
                                            borderWidth: pxToDp(2),
                                            borderColor: "#D3D3D3",
                                        },
                                    ]}
                                    source={{
                                        uri: detailsObj.order_1,
                                    }}
                                />
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
        backgroundColor: "#373635",
        paddingTop: Platform.OS === "ios" ? pxToDp(60) : 0,
    },
    nextText: {
        right: 0,
    },
    contentWrap: {
        marginRight: pxToDp(20),
    },
    contentText: {
        fontSize: pxToDp(48),
        color: "#475266",
        marginLeft: pxToDp(10),
        ...appFont.fontFamily_syst_bold,
        lineHeight: pxToDp(60),
    },
    titleText: {
        color: "#475266",
        fontSize: pxToDp(44),
        ...appFont.fontFamily_syst,
        lineHeight: pxToDp(54),
        marginRight: pxToDp(10),
    },
    itemWrap: {
        backgroundColor: "rgba(255,255,255,0.5)",
        minHeight: pxToDp(380),
        borderRadius: pxToDp(24),
        alignItems: "center",
        ...padding_tool(0, 40, 0, 40),
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
    },
});
export default CharacterHelpModal;
