import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform,
} from "react-native";
import { Toast, Modal } from "antd-mobile-rn";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";
import ViewControl from "react-native-image-pan-zoom";
import url from "../../../../../util/url";
import RichShowView from "../../../../../component/chinese/newRichShowView";
import ReadingHelpModal from '../../../../../component/chinese/ReadingHelpModal'

const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

class DoWrongExerciseRead extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        this.audio = undefined;
        //console.log(
        // this.article_category = props.navigation.state.params.data.article_category;
        this.r_id = props.navigation.state.params.data.r_id;
        this.state = {
            article: {},
            correct: "",
            answerIndex: -1,
            isShuffle: true,
            diagnose_notes: "",
            visible: false,
            explanation: "",
            helpVisible: false,
            helpImg: "",
            isStartAudio: false,
        };
    }
    componentDidMount() {
        axios.get(api.readExerciseDetail + `/${this.r_id}`).then((res) => {
            const data = res.data.data;
            //console.log("题", data);
            this.setState({
                article: data,
            });
        });
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkAnswer = (item, index) => {
        const { article } = this.state;
        let correct = "";
        let diagnose_notes = article.diagnose_notes.split("#")[item.index];
        item.content === article.answer_content ? (correct = "0") : (correct = "2");
        this.setState({
            correct,
            answerIndex: index,
            isShuffle: false,
            diagnose_notes,
        });
    };
    nextTopic = () => {
        const { correct, answerIndex, article } = this.state;
        if (answerIndex < 0) {
            Toast.info("请选择答案", 1, undefined, false);
            return;
        }
        if (correct === "0") {
            // 做对了
            //console.log("对对对对对对对对对对");
            Toast.success("恭喜你答对了 !!!", 1);
            this.setState({
                isShuffle: true,
            });
        } else {
            // 做错了
            // this.setState({
            //   helpVisible: true,
            // });
            this.helpMe(false)
        }
        this.setState({
            answerIndex: -1,
        });
    };
    onClose = (isclose) => {
        if (!isclose) return
        this.setState({
            visible: false,
            isShuffle: true,
        });
    };
    helpMe = (_isConst) => {
        const { article, diagnose_notes } = this.state;
        this.setState({
            helpVisible: true,
            diagnose_notes: _isConst ? '' : diagnose_notes
        });
        // }, 1000)

    };
    onCloseHelp = () => {
        const { isShuffle } = this.state;
        if (isShuffle) {
            this.setState({
                visible: false,
            });
            this.onClose(true)
        }
        this.setState({
            helpVisible: false,
        });

    };
    renderWriteTopaic() {
        const { answerIndex, article } = this.state;
        // 打乱选项
        if (article.choice_content
            // && isShuffle
        ) {
            let shuffleArr = [];
            article.choice_content.split("#").forEach((item, index) => {
                shuffleArr.push({ index: index, content: item });
            });
            article.shuffleArr
                = shuffleArr;

        }
        //console.log("当前的题", article);
        return (
            <View style={{ paddingTop: pxToDp(20), flex: 1, }}>
                <ScrollView
                    style={{
                        // paddingLeft: pxToDp(48),
                        // paddingRight: pxToDp(100),
                        // height: pxToDp(220),
                        flex: 1
                    }}
                >
                    <View
                        style={{

                        }}
                    >
                        {article.stem ? (
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(580)}
                                value={article.stem}
                            ></RichShowView>
                        ) : null}
                    </View>
                    {article.stem_image ? (
                        <Image
                            style={[size_tool(300, 250), { marginLeft: pxToDp(40) }]}
                            source={{ uri: url.baseURL + article.stem_image }}
                            resizeMode={"contain"}
                        ></Image>
                    ) : null}
                    {article.shuffleArr
                        ? article.shuffleArr.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        appStyle.flexLine,
                                        { marginBottom: pxToDp(48), paddingRight: pxToDp(70) },
                                    ]}
                                    onPress={() => {
                                        this.checkAnswer(item, index);
                                    }}
                                    key={index}
                                >
                                    <View
                                        style={[
                                            styles.option,
                                            appStyle.flexCenter,
                                            answerIndex === index ? styles.isActive : null,
                                        ]}
                                    >

                                        <Text
                                            style={[
                                                {
                                                    color: answerIndex === index ? '#fff' : '#aaa',
                                                    fontSize: pxToDp(35),

                                                }
                                            ]}
                                        >
                                            {zimu[index]}
                                        </Text>
                                    </View>
                                    {article.choice_type === "0" ? (
                                        <Text style={[{ fontSize: pxToDp(35) }]}>
                                            {item.content}
                                        </Text>
                                    ) : (
                                        <Image
                                            style={[size_tool(200)]}
                                            source={{
                                                uri: url.baseURL + item.content,
                                            }}
                                            resizeMode={"contain"}
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            );
                        })
                        : null}
                </ScrollView>
            </View>
        );
    }
    render() {
        const {
            article,
            diagnose_notes,
        } = this.state;
        return (
            <View style={[padding_tool(40), styles.container]}>
                <View style={[styles.header, appStyle.flexCenter, padding_tool(0, 20, 0, 20), { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[
                            { width: pxToDp(400) },
                        ]}
                    >
                        <Image
                            source={require("../../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={[{ color: "#333", fontSize: pxToDp(42) }]}>
                        {article.name}
                    </Text>

                    <Text style={{ color: '#aaa', fontSize: pxToDp(32), width: pxToDp(460) }}>可上下拉动查看题干与选项内容</Text>
                </View>
                <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, { flex: 1 }]}>
                    <View style={[styles.left, padding_tool(48)]}>
                        <Text style={[styles.aiticleTitle]}>{article.name}</Text>
                        <Text
                            style={[
                                {
                                    textAlign: "center",
                                    lineHeight: pxToDp(48),
                                    fontSize: pxToDp(28),
                                },
                            ]}
                        >
                            作者:{article.author}
                        </Text>

                        <ScrollView style={{ flex: 1 }}>
                            <RichShowView
                                divStyle={"font-size: x-large"}
                                pStyle={"font-size: x-large"}
                                spanStyle={"font-size: x-large"}
                                width={pxToDp(1000)}
                                value={article.content}
                            ></RichShowView>
                            {article.image ? (
                                <View style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                                    <ViewControl
                                        cropWidth={350}
                                        cropHeight={300}
                                        imageWidth={350}
                                        imageHeight={300}
                                    >
                                        <Image
                                            style={[{ width: 350, height: 300 }]}
                                            source={{ uri: url.baseURL + article.image }}
                                            resizeMode={"contain"}
                                        ></Image>
                                    </ViewControl>
                                </View>
                            ) : null}
                        </ScrollView>
                    </View>
                    <View style={[styles.right]}>
                        {this.renderWriteTopaic()}
                        <View style={[appStyle.flexAliEnd]}>
                            <TouchableOpacity style={[styles.nextBtn]} onPress={this.nextTopic}>
                                <Text style={[styles.nextText]}>完成</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.helpBtn]}
                            onPress={() => {
                                this.helpMe(true);
                            }}
                        >
                            <Image
                                style={[size_tool(56)]}
                                source={require("../../../../../images/help_icon.png")}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <ReadingHelpModal
                    status={this.state.helpVisible}
                    goback={this.onCloseHelp}
                    audio={article.explanation_audio}
                    knowledgepoint_explanation={article.explanation ? article.explanation : ""}
                    diagnose_notes={diagnose_notes}
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#373635",
        paddingTop: Platform.OS === 'ios' ? pxToDp(100) : pxToDp(40),
    },
    header: {
        height: pxToDp(110),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(40),
        position: "relative",
    },
    left: {
        width: "60%",
        height: '100%',
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
    },
    right: {
        width: "38%",
        borderRadius: pxToDp(32),
        backgroundColor: "#fff",
        position: "relative",
        height: '100%',
        padding: pxToDp(40)
    },
    aiticleTitle: {
        textAlign: "center",
        fontSize: pxToDp(40),
    },
    option: {
        width: pxToDp(52),
        height: pxToDp(52),
        borderRadius: pxToDp(26),
        borderWidth: pxToDp(2),
        borderColor: "#AAAAAA",
        color: "#AAAAAA",
        lineHeight: pxToDp(52),
        textAlign: "center",
        marginRight: pxToDp(24),
        fontSize: pxToDp(32),
    },
    isActive: {
        backgroundColor: "#FC6161",
        color: "#fff",
        borderColor: "#FC6161",
    },
    nextBtn: {
        width: pxToDp(192),
        height: pxToDp(64),
        backgroundColor: "#A86A33",
        borderRadius: pxToDp(48),
        // position: "absolute",
        // right: pxToDp(48),
        // bottom: pxToDp(48),
    },
    nextText: {
        textAlign: "center",
        lineHeight: pxToDp(64),
        color: "#fff",
        fontSize: pxToDp(28),
    },
    helpBtn: {
        position: "absolute",
        top: pxToDp(30),
        right: pxToDp(36),
    },
});
const mapStateToProps = (state) => {
    // 取数据
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    // 存数据
    return {};
};
export default connect(mapStateToProps, mapDispathToProps)(DoWrongExerciseRead);
