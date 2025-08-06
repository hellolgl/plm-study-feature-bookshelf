import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import { Modal, Toast } from "antd-mobile-rn";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";
import api from "../../../../../util/http/api";
import RichShowView from "../../../../../component/chinese/RichShowView";
import Sound from "react-native-sound";
import url from "../../../../../util/url";
import SentenceHelpModal from '../../../../../component/chinese/SentenceHelpModal'
import Select from "../../../../../component/Select";

class doWrongExerciseSmart extends PureComponent {
    constructor(props) {
        super(props);
        this.info = this.props.userInfo.toJS();
        this.se_id = props.navigation.state.params.data.se_id;
        this.myScrollView = undefined;
        this.heightArr = [];
        this.audioHelp = undefined;
        this.audioHelp1 = undefined;

        this.state = {
            topicList: [],
            visible: false,
            topicIndex: 0,
            currentTopic: {
                best_answer: [],
            },
            diagnose: "",
            ranking: "",
            answerStatisticsModalVisible: false,
            helpVisible: false,
            explanation: "",
            maxHeight: 0,
            autoHeight: 0,
            ischangeHeight: true,
            best_answer_three: undefined,
            helpImg: "",
            helpHeight: 0,
            isStartAudio1: false,
            isStartAudio: false,
            resetSelect: false
        };
    }
    componentDidMount() {
        axios.get(api.getChineseSentenceExerciseDetail, { params: { se_id: this.se_id } }).then((res) => {
            const data = res.data.data;
            let currentTopic = this.changeCurrentTopic(data);
            this.setState({
                topicList: data,
                currentTopic,
            });
        });
    }
    changeCurrentTopic = (arr) => {
        arr.change_word.forEach((i) => {
            for (let j = 0; j < i.word.length; j++) {
                if (i.word[j].length > 15) {
                    i.bigWidth = true;
                    break;
                }
            }
        });
        arr.sentence_stem.forEach((item, i) => {
            item.autowidth = pxToDp(400);
            arr.change_word.forEach((child, j) => {
                if (child.position === i) {
                    item.contentSelect = [];
                    item.slectValue = "请选择";
                    child.word.forEach((select, z) => {
                        item.contentSelect.push({
                            value: select,
                            label: select,
                            position: i,
                        });
                    });
                    item.bigWidth = child.bigWidth;
                    if (child.bigWidth) {
                        item.autowidth = pxToDp(720);
                    }
                }
            });
        });
        arr.sentence_stem.forEach((item, i) => {
            if (arr.center_word) {
                arr.center_word.forEach((child, j) => {
                    if (child.position === i) {
                        item.isCenter = true;
                    }
                });
            }
        });
        return arr;
    };
    nextTopic = () => {
        const { currentTopic } = this.state;
        let diag_sentence_key_arr = [];
        let diag_sentence_key = "";
        currentTopic.sentence_stem.forEach((item) => {
            if (item.slectValue) {
                diag_sentence_key_arr.push(item.slectValue);
            }
        });

        if (currentTopic.best_answer.length > 3) {
            let best_answer_three = [];
            let arr = [];
            for (var i = 0; i < currentTopic.best_answer.length; i++) {
                arr[i] = i;
            }
            arr.sort(function () {
                return 0.5 - Math.random();
            });
            currentTopic.best_answer.forEach((i, index) => {
                for (let j = 0; j < arr.slice(0, 3).length; j++) {
                    if (index === arr.slice(0, 3)[j]) {
                        best_answer_three.push(i);
                        break;
                    }
                }
            });
            this.setState({
                best_answer_three,
            });
        }
        diag_sentence_key = diag_sentence_key_arr.join("");
        if (!currentTopic.diag_sentence[diag_sentence_key]) {
            Toast.info("请选择答案", 1, undefined, false);
            return;
        }
        let ranking = currentTopic.diag_sentence[diag_sentence_key].ranking;
        this.setState({
            diagnose: currentTopic.diag_sentence[diag_sentence_key].diagnose,
            ranking,
            visible: true,
        });
    };
    ranking012 = () => {
        const { currentTopic } = this.state;
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
        _currentTopic.sentence_stem.forEach((item) => {
            if (item.contentSelect) {
                item.contentSelect = this.shuffle(item.contentSelect);
                item.contentSelect.forEach((i) => {
                    i.check = false;
                });
            }
            if (item.slectValue) {
                item.slectValue = "请选择";
            }
        });
        this.setState({
            currentTopic: _currentTopic,
            resetSelect: true
        });
        setTimeout(() => {
            this.setState({
                resetSelect: false
            })
        }, 500);
    };
    //打乱数组
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    shuffle = (arr) => {
        let _arr = arr.slice();
        for (let i = 0; i < _arr.length; i++) {
            let j = this.getRandomInt(0, i);
            let t = _arr[i];
            _arr[i] = _arr[j];
            _arr[j] = t;
        }
        return _arr;
    };
    goBack = () => {
        this.closeHelpAudio()
        this.closeHelpAudio1()
        NavigationUtil.goBack(this.props);
    };
    selectChange = (item, _options) => {
        const { currentTopic } = this.state;
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
        _currentTopic.sentence_stem[item.position].slectValue = item.label
        _currentTopic.sentence_stem[item.position].slectLabel = item.label

        this.myScrollView.scrollTo({ x: 0, y: 0, animated: true });
        this.setState({ currentTopic: _currentTopic });
    };
    onClose = () => {
        this.ranking012();
        this.setState({ visible: false, maxHeight: 0 });
    };
    onCloseHelp = () => {
        this.closeHelpAudio()
        this.closeHelpAudio1()
        this.setState({ helpVisible: false });
    };
    helpMe = () => {
        this.setState({ helpVisible: true });
    };
    closeAnswerStatisticsModal = () => {
        NavigationUtil.goBack(this.props);
    };
    selectShow = (height) => {
        const { currentTopic } = this.state;
        this.heightArr.push(height);
        this.setState({
            maxHeight: Math.max(...this.heightArr),
        });
    };
    _onLayout = (event) => {
        const { ischangeHeight, currentTopic } = this.state;
        let { x, y, width, height } = event.nativeEvent.layout;
        if (ischangeHeight) {
            this.setState({
                autoHeight: height,
                ischangeHeight: false,
            });
        }
    };

    playHeplAudio = () => {
        const { currentTopic, isStartAudio } = this.state;
        this.closeHelpAudio1()
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        if (this.audioHelp) {
            isStartAudio
                ? this.audioHelp.pause()
                : this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                    }
                });
            this.setState({
                isStartAudio: !isStartAudio,
            });
            return;
        }
        this.audioHelp = new Sound(
            url.baseURL + currentTopic.standard_audio,
            null,
            (error) => {
                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp.setNumberOfLoops(-1);
                    this.audioHelp.play((success) => {
                        if (success) {
                            this.audioHelp.release();
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
        const { currentTopic, isStartAudio1 } = this.state;
        // currentTopic.standard_audio = 'chinese/03/00/exercise/audio/0910562130a7482f9b742def14203f55.mp3'
        this.closeHelpAudio()
        if (this.audioHelp1) {
            isStartAudio1
                ? this.audioHelp1.pause()
                : this.audioHelp1.play((success) => {
                    if (success) {
                        this.audioHelp1.release();
                    }
                });
            this.setState({
                isStartAudio1: !isStartAudio1,
            });
            return;
        }
        this.audioHelp1 = new Sound(
            url.baseURL + currentTopic.explanation_audio,
            null,
            (error) => {
                if (error) {
                    console.log("播放失败", error);
                } else {
                    this.audioHelp1.setNumberOfLoops(-1);
                    this.audioHelp1.play((success) => {
                        if (success) {
                            this.audioHelp1.release();
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
    render() {
        const {
            visible,
            currentTopic,
            diagnose,
            ranking,
            helpVisible,
            explanation,
            // optionsLength,
            autoHeight,
            best_answer_three,
            helpImg,
            helpHeight,
            maxHeight,
            isStartAudio1,
            isStartAudio,
            resetSelect
        } = this.state;
        return (
            <View style={[styles.container, padding_tool(40, 48, 48, 48)]}>
                <View style={[styles.header, appStyle.flexCenter]}>
                    <TouchableOpacity
                        style={[styles.headerBack]}
                        onPress={() => this.goBack()}
                    >
                        <Image
                            source={require("../../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <View style={[styles.content1, padding_tool(48)]}>
                    {currentTopic.sentence_stem ? (
                        <>
                            <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                                {currentTopic.common_stem}
                            </Text>
                            {currentTopic.stem ? (
                                <Text style={[{ fontSize: pxToDp(36), color: "#000" }]}>
                                    {currentTopic.stem}
                                </Text>
                            ) : null}
                            <ScrollView
                                ref={(view) => {
                                    if (view) this.myScrollView = view;
                                }}
                            >
                                <View
                                    style={[
                                        appStyle.flexTopLine,
                                        appStyle.flexLineWrap,
                                        {
                                            marginTop: pxToDp(16),
                                            height: maxHeight > 0 ? autoHeight + maxHeight : "auto",
                                        },
                                    ]}
                                    onLayout={this._onLayout}
                                >
                                    {currentTopic.sentence_stem
                                        ? currentTopic.sentence_stem.map((item, index) => {
                                            if (item.contentSelect) {
                                                return (
                                                    <Select key={index}
                                                        options={item.contentSelect}
                                                        selectItem={this.selectChange}
                                                        subject={'chinese'}
                                                        resetSelect={resetSelect}
                                                        activeBg={'orange'}
                                                        fatherColor={'orange'}
                                                        borderStyle={{
                                                            borderColor: 'orange',
                                                            backgroundColor: '#fff',
                                                            borderRadius: pxToDp(40)
                                                        }}
                                                        textColor={'orange'}
                                                        activeTextColor={'#fff'}
                                                    ></Select>
                                                );
                                            } else {
                                                return (
                                                    <Text
                                                        style={[
                                                            {
                                                                fontSize: pxToDp(36),
                                                                color: item.isCenter ? "#FC6161" : "#000",
                                                                lineHeight: pxToDp(76),
                                                            },
                                                        ]}
                                                        key={index}
                                                    >
                                                        {item.content}
                                                    </Text>
                                                );
                                            }
                                        })
                                        : null}
                                </View>
                            </ScrollView>
                        </>
                    ) : (
                        <Text>...</Text>
                    )}
                </View>
                <View style={[styles.content2, padding_tool(48)]}>
                    <ScrollView style={[{ marginRight: pxToDp(200) }]}>
                        {currentTopic ? (
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
                                {currentTopic.sentence_stem
                                    ? currentTopic.sentence_stem.map((item, index) => {
                                        if (item.slectValue) {
                                            return (
                                                <Text
                                                    style={[
                                                        {
                                                            fontSize: pxToDp(36),
                                                            color:
                                                                item.slectValue === "请选择"
                                                                    ? "#000"
                                                                    : "#38B3FF",
                                                        },
                                                    ]}
                                                    key={index}
                                                >
                                                    {item.slectValue === "请选择"
                                                        ? "_____"
                                                        : item.slectValue.indexOf("#去掉") === -1
                                                            ? item.slectValue
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
                                                    ]}
                                                    key={index}
                                                >
                                                    {item.content}
                                                </Text>
                                            );
                                        }
                                    })
                                    : null}
                            </View>
                        ) : null}
                    </ScrollView>

                    <TouchableOpacity style={[styles.nextBtn]} onPress={this.nextTopic}>
                        <Text style={[styles.nextText]}>完成</Text>
                    </TouchableOpacity>
                </View>

                <SentenceHelpModal
                    status={this.state.visible}
                    goback={this.onClose}
                    currentTopic={currentTopic}
                    doNumber={3}
                    best_answer_three={best_answer_three}
                    diagnose={diagnose}
                    ranking={ranking}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#373635",
    },
    header: {
        backgroundColor: "#fff",
        height: pxToDp(110),
        borderRadius: pxToDp(16),
    },
    headerBack: {
        position: "absolute",
        left: pxToDp(32),
    },
    circleCard: {
        position: "absolute",
        right: pxToDp(48),
    },
    content1: {
        // height: pxToDp(680),
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginTop: pxToDp(40),
    },
    content2: {
        height: pxToDp(200),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginTop: pxToDp(48),
    },
    nextBtn: {
        position: "absolute",
        right: pxToDp(48),
        bottom: pxToDp(28),
        width: pxToDp(192),
        height: pxToDp(64),
        backgroundColor: "#A86A33",
        borderRadius: pxToDp(32),
    },
    nextText: {
        fontSize: pxToDp(32),
        color: "#fff",
        textAlign: "center",
        lineHeight: pxToDp(64),
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
export default connect(
    mapStateToProps,
    mapDispathToProps
)(doWrongExerciseSmart);
