import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Platform
} from "react-native";
import { Modal } from "antd-mobile-rn";
import {
    margin_tool,
    size_tool,
    pxToDp,
    padding_tool,
    border_tool,
    borderRadius_tool,
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import ConnectionOptions from "../Match/components/ConnectionOptions";
import RichShowView from "../../../../component/math/RichShowViewHtml";
import url from "../../../../util/url";
import Sound from "react-native-sound";
import NavigationUtil from "../../../../navigator/NavigationUtil";
// import AnswerStatisticsModal from "../../../../component/AnswerStatisticsModal";
import PlayAudio from "../Match/components/playAudio";
import fonts from "../../../../theme/fonts";
import PlayAudioFun from "../../../../util/audio/playAudio";

let baseUrl = url.baseURL;

class MixDoWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentTopic: {},
            tag: "正在获取题目...",
            helpVisible: false,
            answerStatisticsModalVisible: false,
            isFail: false, //控制next按钮显示
        };
        this.audioHelp = undefined;
        this.ConnectionOptionsRef = undefined;
        this.successAudiopath = url.baseURL + "pinyin_new/pc/audio/good.mp3";
        this.successAudiopath2 = url.baseURL + "pinyin_new/pc/audio/good2.mp3";
        this.successAudiopath3 = url.baseURL + "pinyin_new/pc/audio/good3.mp3";
        this.clickImageHelp = false;
        this.audiolist = [
            this.successAudiopath,
            this.successAudiopath2,
            this.successAudiopath3,
        ];
    }
    componentDidMount() {
        this.setState({
            currentTopic: this.props.navigation.state.params.data
        })
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    playHeplAudio = () => {
        const { currentTopic, isStartAudioHelp } = this.state;
        if (this.audioHelp) {
            // isStartAudioHelp
            //   ? this.audioHelp.pause()
            //   : this.audioHelp.play((success) => {
            //       if (success) {
            //         this.audioHelp.release();
            //       }
            //     });
            // this.setState({
            //   isStartAudioHelp: !isStartAudioHelp,
            // });
            // return;
            this.audioHelp.stop();
            this.audioHelp = undefined;
        }
        this.audioHelp = new Sound(
            baseUrl + currentTopic.explanation_audio,
            null,
            (error) => {
                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp.play((success) => {
                        if (success) {
                            this.audioHelp.release();
                        }
                    });
                }
            }
        );
    };
    helpMe = () => {
        this.clickImageHelp = true;
        this.setState({
            helpVisible: true,
        });
    };
    onCloseHelp = () => {
        if (this.audioHelp) {
            this.audioHelp.stop();
            this.audioHelp = undefined;
        }
        this.setState(
            {
                helpVisible: false,
                isFail: false,
            },
            () => {
                this.clickImageHelp ? "" : this.ConnectionOptionsRef.tryAgian();
            }
        );
    };
    showHelp = () => {
        this.clickImageHelp = false;
        this.setState({
            helpVisible: true,
            isFail: true,
        });
    };
    render() {
        const {
            currentTopic,
            tag,
            isStartAudioHelp,
            helpVisible,
        } = this.state;
        return (
            <ImageBackground
                source={require("../../../../images/english/sentence/sentenceBg.png")}
                style={[styles.container]}
            >
                <View style={[styles.header, appStyle.flexCenter]}>
                    <View
                        style={[
                            size_tool(729, 125),
                            borderRadius_tool(0, 0, 40, 40),
                            appStyle.flexCenter,
                            { backgroundColor: "#F1F5F8" },
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: pxToDp(50),
                                    color: "#39334C",
                                    lineHeight: pxToDp(60),
                                },
                                fonts.fontFamily_jcyt_700,
                            ]}
                        >
                            Mix&Match
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[{ position: "absolute", top: pxToDp(60), left: 0 }]}
                    >
                        <Image
                            source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                            style={[size_tool(120, 80)]}
                        ></Image>
                    </TouchableOpacity>
                </View>
                {Object.keys(currentTopic).length > 0 ? (
                    <View style={[styles.contentWrap]}>
                        {currentTopic.stem_image ? (
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(1000)}
                                value={
                                    currentTopic.stem +
                                    `<img src="${baseUrl + currentTopic.stem_image
                                    }" style="width:350px,height:300px"></img>`
                                }
                            ></RichShowView>
                        ) : (
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(1000)}
                                value={currentTopic.stem}
                            ></RichShowView>
                        )}
                        <ConnectionOptions
                            onRef={(ref) => {
                                this.ConnectionOptionsRef = ref;
                            }}
                            currentTopic={currentTopic}
                            exerciseLen={1}
                            initTopic={() => {
                                const audioindex = Math.floor(Math.random() * 3);
                                PlayAudioFun.playSuccessSound(this.audiolist[audioindex])
                                this.ConnectionOptionsRef.tryAgian()
                            }}
                            doWrong={true}
                            resetToLogin={() => {
                                NavigationUtil.resetToLogin(this.props);
                            }}
                            showHelp={this.showHelp}
                        ></ConnectionOptions>
                        <TouchableOpacity style={[styles.helpIcon]} onPress={this.helpMe}>
                            <Image
                                source={require("../../../../images/MathKnowledgeGraph/help_btn_1.png")}
                                style={[size_tool(80)]}
                            ></Image>
                        </TouchableOpacity>
                        {/* 帮助 */}
                        <Modal
                            visible={helpVisible}
                            // visible={false}
                            transparent={true}
                            style={[
                                { width: pxToDp(1000), backgroundColor: "regba(0,0,0,0)" },
                            ]}
                        >
                            <ImageBackground
                                source={require("../../../../images/english/mix/helpBg.png")}
                                style={[
                                    size_tool(968, 754),
                                    padding_tool(60, 80, 100, 80),
                                    { position: "relative" },
                                ]}
                            >
                                <ScrollView style={{ height: pxToDp(600) }}>
                                    {currentTopic.explanation_audio ? (
                                        <TouchableOpacity onPress={this.playHeplAudio}>
                                            {isStartAudioHelp ? (
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
                                        value={
                                            currentTopic.knowledgepoint_explanation
                                                ? currentTopic.knowledgepoint_explanation
                                                : ""
                                        }
                                        color={"#fff"}
                                    ></RichShowView>
                                    <View style={[{ paddingTop: pxToDp(40) }]}>
                                        {currentTopic?.choice_content.map((item, index) => {
                                            return (
                                                <View
                                                    style={[
                                                        appStyle.flexTopLine,
                                                        appStyle.flexCenter,
                                                        { marginBottom: pxToDp(40) },
                                                    ]}
                                                    key={index}
                                                >
                                                    <View
                                                        style={[
                                                            { paddingRight: pxToDp(40), width: "50%" },
                                                            appStyle.flexAliEnd,
                                                        ]}
                                                    >
                                                        {/* 左边 */}
                                                        {currentTopic.combination_one === "text" ? (
                                                            <Text
                                                                style={[
                                                                    {
                                                                        fontSize: pxToDp(40),
                                                                        color: "#fff",
                                                                        lineHeight: pxToDp(50),
                                                                        flex: 1,
                                                                    },
                                                                    appFont.fontFamily_jcyt_700,
                                                                ]}
                                                            >
                                                                {item.left}
                                                            </Text>
                                                        ) : null}
                                                        {currentTopic.combination_one === "image" ? (
                                                            <Image
                                                                style={[size_tool(200)]}
                                                                source={{
                                                                    uri: baseUrl + item.left,
                                                                }}
                                                                resizeMode={"contain"}
                                                            />
                                                        ) : null}
                                                        {currentTopic.combination_one === "audio" ? (
                                                            <PlayAudio uri={item.left} />
                                                        ) : null}
                                                    </View>
                                                    <View style={[{ width: "50%" }]}>
                                                        {/* 右边 */}
                                                        {item.right.map((rightitem, rightindex) => {
                                                            return (
                                                                <View key={rightindex}>
                                                                    {currentTopic.combination_two === "text" ? (
                                                                        <Text
                                                                            style={[
                                                                                {
                                                                                    fontSize: pxToDp(40),
                                                                                    color: "#fff",
                                                                                    lineHeight: pxToDp(50),
                                                                                },
                                                                                appFont.fontFamily_jcyt_700,
                                                                            ]}
                                                                        >
                                                                            {" "}
                                                                            {rightitem}
                                                                        </Text>
                                                                    ) : null}
                                                                    {currentTopic.combination_two === "image" ? (
                                                                        <Image
                                                                            style={[size_tool(200)]}
                                                                            source={{
                                                                                uri: baseUrl + rightitem,
                                                                            }}
                                                                            resizeMode={"contain"}
                                                                        />
                                                                    ) : null}
                                                                    {currentTopic.combination_two === "audio" ? (
                                                                        <PlayAudio uri={rightitem} />
                                                                    ) : null}
                                                                </View>
                                                            );
                                                        })}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </ScrollView>
                                {/* <View style={[appStyle.flexLine, { marginTop: pxToDp(16),position:'absolute' }]}> */}
                                <TouchableOpacity
                                    style={[styles.footBtn, appStyle.flexCenter, size_tool(70)]}
                                    onPress={this.onCloseHelp}
                                >
                                    {/* <Text style={{ fontSize: pxToDp(32), color: '#037AFF' }} >关闭</Text> */}
                                    <Image
                                        source={require("../../../../images/english/mix/helpClose.png")}
                                        style={[size_tool(99)]}
                                    />
                                </TouchableOpacity>
                                {/* </View> */}
                            </ImageBackground>
                        </Modal>
                    </View>
                ) : (
                    <View style={[styles.contentWrap]}>
                        <Text style={{ fontSize: pxToDp(28) }}>{tag}</Text>
                    </View>
                )}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Platform.OS === "ios" ? pxToDp(100) : pxToDp(60),
        paddingTop: 0,
        // paddingTop: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingBottom: Platform.OS === "ios"? pxToDp(100): pxToDp(40),
        // paddingLeft: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        // paddingRight: Platform.OS === "ios"? pxToDp(60): pxToDp(30),
        width: "100%",
    },
    helpIcon: {
        position: "absolute",
        right: pxToDp(40),
        top: pxToDp(40),
        zIndex: 1000,
    },
    header: {
        height: pxToDp(125),
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(40),
        position: "relative",
    },
    circleCard: {
        position: "absolute",
        right: pxToDp(-24),
    },
    contentWrap: {
        backgroundColor: "#fff",
        flex: 1,
        // height: pxToDp(1000),
        borderRadius: pxToDp(32),
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        paddingBottom: pxToDp(20),
    },
    footBtn: {
        // backgroundColor: 'red',
        flex: 1,
        position: "absolute",
        top: pxToDp(20),
        right: pxToDp(20),
    },
});

export default MixDoWrongExercise
