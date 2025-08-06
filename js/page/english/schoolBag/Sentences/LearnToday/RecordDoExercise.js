import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Platform,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";
import { getDebounceTime } from "../../../../../util/commonUtils";
import { appStyle, appFont } from "../../../../../theme";
import * as _ from "lodash";
import AnalysisModal from "./components/AnalysisModal";
import { changeCurrentTopic, haveNbsp } from "../tools";
import url from "../../../../../util/url";
import Audio from "../../../../../util/audio/audio";
import PlayAudio from "../../../../../util/audio/playAudio";

let debounceTime = getDebounceTime();

class RecordDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        this.grade_code = userInfoJs.checkGrade;
        this.term_code = userInfoJs.checkTeam;
        this.se_id = this.props.navigation.state.params.data.se_id;
        this.submitThrottle = _.debounce(this.submit, debounceTime);
        this.rankingAudioMap = {
            0: url.fantastic,
            1: url.tryAgain,
            2: url.tryAgain
        };
        this.state = {
            currentTopic: {},
            resetSelect: false,
            ranking: "2",
            analysisVisible: false,
            helpVisible: false,
            selectIndex: 0,
            preCurrentTopic: {},
            options: [],
            optionIndexMap: {},
        };
    }
    componentDidMount() {
        this.getData();
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    getData() {
        const { type } = this.props.navigation.state.params.data;
        const data = {};
        data.se_id = this.se_id;
        let apiUrl = api.getEnExamineTopic;
        if (type !== "examine") {
            data.grade_code = this.grade_code;
            data.term_code = this.term_code;
            apiUrl = api.getEngTopicDairyRcordDetail;
        }

        axios.get(apiUrl, { params: data }).then((res) => {
            const data = res.data.data;
            let currentTopic = changeCurrentTopic(data);
            this.setState(
                {
                    currentTopic,
                    preCurrentTopic: data,
                },
                () => {
                    this.setOptions();
                }
            );
        });
    }

    setOptions = () => {
        const { selectIndex, currentTopic } = this.state;
        if (currentTopic.type !== 1) return;
        const { sentence_stem } = currentTopic;
        let index = 0;
        for (let i = 0; i < sentence_stem.length; i++) {
            if (sentence_stem[i].word_type === "p") {
                index = i;
                break;
            }
        }
        if (selectIndex && selectIndex > -1) index = selectIndex;
        this.setState({
            options: sentence_stem[index].contentSelect,
            selectIndex: index,
        });
    };

    submit = () => {
        const { currentTopic } = this.state;
        let diag_key = "";
        currentTopic.sentence_stem.forEach((i) => {
            if (i.slectValue && i.slectValue !== "Please select")
                diag_key += i.slectValue;
        });
        // console.log('******************',diag_key,currentTopic.diag_sentence[diag_key])
        if (!diag_key) return;
        let ranking = currentTopic.diag_sentence[diag_key]
            ? currentTopic.diag_sentence[diag_key].ranking
            : "2"; //不存在key值算错
        this.playRankingAudio(ranking);
        let diagnose = currentTopic.diag_sentence[diag_key]
            ? currentTopic.diag_sentence[diag_key].diagnose
            : "";
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
        _currentTopic.diagnose = diagnose;
        _currentTopic.status = ranking;
        this.setState({
            ranking,
            analysisVisible: true,
            currentTopic: _currentTopic,
        });
    };
    onCloseAnalysis = () => {
        const { preCurrentTopic } = this.state;
        this.setState(
            {
                analysisVisible: false,
                selectIndex: 0,
                resetSelect: true,
            },
            () => {
                this.setOptions();
            }
        );
        setTimeout(() => {
            const { type } = this.props.navigation.state.params.data;
            this.setState({
                resetSelect: false,
                currentTopic: changeCurrentTopic(preCurrentTopic, type === "examine"),
                optionIndexMap: {},
            });
        }, 200);
    };
    clickSelect = (item, index) => {
        this.setState(
            {
                selectIndex: index,
            },
            () => {
                this.setOptions();
            }
        );
    };
    selectChoice = (item, index) => {
        const { currentTopic, optionIndexMap, selectIndex } = this.state;
        if (selectIndex === -1) return;
        let _currentTopic = _.cloneDeep(currentTopic);
        _currentTopic.sentence_stem[selectIndex].slectValue = item.content;
        if (_currentTopic.type === 2) {
            if (_currentTopic.sentence_stem.length - 1 >= selectIndex + 1) {
                this.setState({
                    selectIndex: selectIndex + 1,
                });
            } else if (_currentTopic.sentence_stem.length - 1 === selectIndex) {
                this.setState({
                    selectIndex: selectIndex,
                });
            }
        } else {
            let _optionIndexMap = _.cloneDeep(optionIndexMap);
            _optionIndexMap[`${selectIndex}`] = `${selectIndex}${index}`;
            this.setState({
                optionIndexMap: _optionIndexMap,
            });
            const { change_word } = _currentTopic
            for (let i = 0; i < change_word.length; i++) {
                const { position } = change_word[i]
                if (position === selectIndex && change_word[i + 1]) {
                    this.setState({
                        selectIndex: change_word[i + 1].position,
                    }, () => {
                        this.setOptions(change_word[i + 1].position)
                    });
                    break
                }
            }
        }
        this.setState({
            currentTopic: _currentTopic,
        });
    };
    playRankingAudio = (ranking) => {
        PlayAudio.playSuccessSound(this.rankingAudioMap[ranking]);
    };
    renderTopic = () => {
        const { currentTopic, selectIndex, options, optionIndexMap } = this.state;
        if (currentTopic.type === 1) {
            // 下拉类型
            return (
                <View style={{ marginTop: pxToDp(16) }}>
                    <View style={[appStyle.flexLine, appStyle.flexLineWrap]}>
                        {currentTopic.sentence_stem.map((item, index) => {
                            if (item.contentSelect) {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            this.clickSelect(item, index);
                                        }}
                                        style={[
                                            styles.selectfillBlankWrap,
                                            item.slectValue
                                                ? {
                                                    padding: pxToDp(2),
                                                    paddingBottom: pxToDp(6),
                                                    backgroundColor: "#FF731C",
                                                }
                                                : null,
                                            selectIndex === index
                                                ? {
                                                    backgroundColor: "#FF731C",
                                                    padding: 0,
                                                    paddingBottom: pxToDp(6),
                                                }
                                                : null,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.selectfillBlankWrapInner,
                                                selectIndex === index || item.slectValue
                                                    ? { backgroundColor: "#FFC662" }
                                                    : null,
                                            ]}
                                        >
                                            {item.slectValue ? (
                                                <Text
                                                    style={[
                                                        { color: "#475266", fontSize: pxToDp(54) },
                                                        appFont.fontFamily_jcyt_700,
                                                        Platform.OS === "ios"
                                                            ? { lineHeight: pxToDp(64) }
                                                            : null,
                                                    ]}
                                                >
                                                    {item.slectValue}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </TouchableOpacity>
                                );
                            } else {
                                return (
                                    <Text
                                        style={[
                                            {
                                                fontSize: pxToDp(52),
                                                color: item.isCenter ? "#FC6161" : "#475266",
                                            },
                                            appFont.fontFamily_jcyt_700,
                                            Platform.OS === "ios" ? { lineHeight: pxToDp(62) } : null,
                                        ]}
                                        key={index}
                                    >
                                        {index > 0 &&
                                            !currentTopic.sentence_stem[index - 1].contentSelect
                                            ? haveNbsp(item.content)
                                            : null}
                                        {item.content}
                                    </Text>
                                );
                            }
                        })}
                    </View>
                    <View
                        style={[
                            appStyle.flexLine,
                            { marginTop: pxToDp(40) },
                            appStyle.flexLineWrap,
                        ]}
                    >
                        {options.map((i, x) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.choiceItem, { minWidth: pxToDp(160) }, optionIndexMap[`${selectIndex}`] ===
                                        `${selectIndex}${x}` && { backgroundColor: "#E8D3BC" },]}
                                    key={x}
                                    onPress={() => {
                                        this.selectChoice(i, x);
                                    }}
                                >
                                    <View style={[styles.choiceItemInner, optionIndexMap[`${selectIndex}`] ===
                                        `${selectIndex}${x}` && { backgroundColor: "#E8D3BC" },]}>
                                        {optionIndexMap[`${selectIndex}`] ===
                                            `${selectIndex}${x}` ? null : (
                                            <Text
                                                style={[
                                                    { color: "#475266", fontSize: pxToDp(54) },
                                                    appFont.fontFamily_jcyt_700,
                                                    Platform.OS === "ios"
                                                        ? { lineHeight: pxToDp(64) }
                                                        : null,
                                                ]}
                                            >
                                                {i.content}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        } else {
            // 点选类型
            return (
                <View style={{ marginTop: pxToDp(16) }}>
                    <View
                        style={[
                            appStyle.flexLine,
                            appStyle.flexLineWrap,
                            Platform.OS === "ios" ? { marginTop: pxToDp(40) } : null,
                        ]}
                    >
                        {currentTopic.sentence_stem.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.clickSelect(item, index);
                                    }}
                                    style={[
                                        styles.fillBlankWrap,
                                        selectIndex === index
                                            ? { borderBottomColor: "#FF9032" }
                                            : null,
                                    ]}
                                >
                                    {item.slectValue ? (
                                        <Text
                                            style={[
                                                { color: "#FF964A", fontSize: pxToDp(54) },
                                                appFont.fontFamily_jcyt_700,
                                                Platform.OS === "ios"
                                                    ? { lineHeight: pxToDp(64) }
                                                    : null,
                                            ]}
                                        >
                                            {item.slectValue}
                                        </Text>
                                    ) : (
                                        <Image
                                            style={[{ width: pxToDp(52), height: pxToDp(52) }]}
                                            source={
                                                selectIndex === index
                                                    ? require("../../../../../images/chineseHomepage/sentence/penOrange.png")
                                                    : require("../../../../../images/chineseHomepage/sentence/pen.png")
                                            }
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View
                        style={[
                            appStyle.flexLine,
                            { marginTop: pxToDp(40) },
                            appStyle.flexLineWrap,
                        ]}
                    >
                        {currentTopic.sentence_stem_change.map((i, x) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.choiceItem]}
                                    key={x}
                                    onPress={() => {
                                        this.selectChoice(i, x);
                                    }}
                                >
                                    <View style={[styles.choiceItemInner]}>
                                        <Text
                                            style={[
                                                { color: "#475266", fontSize: pxToDp(54) },
                                                appFont.fontFamily_jcyt_700,
                                                Platform.OS === "ios"
                                                    ? { lineHeight: pxToDp(64) }
                                                    : null,
                                            ]}
                                        >
                                            {x > 0 && !currentTopic.sentence_stem[x - 1].contentSelect
                                                ? haveNbsp(i.content)
                                                : null}
                                            {i.content}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            );
        }
    };
    render() {
        const { currentTopic, analysisVisible } = this.state;
        return (
            <ImageBackground
                style={[styles.container]}
                source={
                    Platform.OS === "android"
                        ? require("../../../../../images/EN_Sentences/bg_1_a.png")
                        : require("../../../../../images/EN_Sentences/bg_1_i.png")
                }
            >
                <View style={[styles.header]}>
                    <TouchableOpacity
                        style={[
                            styles.back_btn,
                            Platform.OS === "ios" ? { top: pxToDp(40) } : null,
                        ]}
                        onPress={this.goBack}
                    >
                        <Image
                            resizeMode="stretch"
                            style={[{ width: pxToDp(120), height: pxToDp(80) }]}
                            source={require("../../../../../images/childrenStudyCharacter/back_btn_1.png")}
                        ></Image>
                    </TouchableOpacity>
                </View>
                {Object.keys(currentTopic).length > 0 ? (
                    <View style={[styles.content, appStyle.flexCenter]}>
                        <ScrollView
                            style={[styles.contentInner]}
                            contentContainerStyle={{
                                paddingTop: pxToDp(55),
                                paddingLeft: pxToDp(95),
                                paddingRight: pxToDp(280),
                                paddingBottom: pxToDp(55),
                            }}
                        >
                            {currentTopic.common_stem ? (
                                <Text
                                    style={[
                                        { fontSize: pxToDp(40), color: "#ACB2BC" },
                                        appFont.fontFamily_jcyt_700,
                                        Platform.OS === "ios"
                                            ? { marginBottom: pxToDp(40), lineHeight: pxToDp(54) }
                                            : null,
                                    ]}
                                >
                                    {currentTopic.common_stem}
                                </Text>
                            ) : null}
                            {currentTopic.stem ? (
                                <Text
                                    style={[
                                        { fontSize: pxToDp(54), color: "#475266" },
                                        appFont.fontFamily_jcyt_700,
                                        Platform.OS === "ios"
                                            ? { marginBottom: pxToDp(40), lineHeight: pxToDp(70) }
                                            : null,
                                    ]}
                                >
                                    {currentTopic.stem}
                                </Text>
                            ) : null}
                            {currentTopic.audio ? (
                                <Audio
                                    audioUri={`${url.baseURL}${currentTopic.audio}`}
                                    pausedBtnImg={require("../../../../../images/EN_Sentences/pause_btn_1.png")}
                                    pausedBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                    playBtnImg={require("../../../../../images/EN_Sentences/play_btn_1.png")}
                                    playBtnStyle={{ width: pxToDp(200), height: pxToDp(120) }}
                                    rate={0.75}
                                />
                            ) : null}
                            {this.renderTopic()}
                        </ScrollView>
                    </View>
                ) : null}
                <TouchableOpacity
                    style={[styles.nextBtn]}
                    onPress={this.submitThrottle}
                >
                    <View style={[styles.nextBtnInner]}>
                        <Text
                            style={[
                                { color: "#fff", fontSize: pxToDp(50) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            Confirm
                        </Text>
                    </View>
                </TouchableOpacity>
                <AnalysisModal
                    visible={analysisVisible}
                    onClose={this.onCloseAnalysis}
                    data={currentTopic}
                    txt={"x"}
                ></AnalysisModal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        ...appStyle.flexCenter,
        height: pxToDp(153),
    },
    back_btn: {
        position: "absolute",
        left: pxToDp(40),
    },
    content: {
        flex: 1,
        paddingLeft: pxToDp(95),
        paddingRight: pxToDp(95),
        paddingBottom: pxToDp(40),
    },
    contentInner: {
        flex: 1,
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: pxToDp(80),
    },
    nextBtn: {
        position: "absolute",
        right: pxToDp(123),
        bottom: pxToDp(63),
        width: pxToDp(240),
        height: pxToDp(240),
        paddingBottom: pxToDp(8),
        backgroundColor: "#FF731C",
        borderRadius: pxToDp(120),
    },
    nextBtnInner: {
        flex: 1,
        backgroundColor: "#FF964A",
        borderRadius: pxToDp(120),
        ...appStyle.flexCenter,
    },
    choiceItem: {
        height: pxToDp(113),
        borderRadius: pxToDp(40),
        backgroundColor: "#E7E7F1",
        paddingBottom: pxToDp(5),
        marginRight: pxToDp(24),
        marginBottom: pxToDp(24),
    },
    choiceItemInner: {
        flex: 1,
        backgroundColor: "#F5F5FA",
        ...appStyle.flexCenter,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        borderRadius: pxToDp(40),
    },
    fillBlankWrap: {
        borderBottomWidth: pxToDp(6),
        borderBottomColor: "#475266",
        marginRight: pxToDp(12),
        marginLeft: pxToDp(12),
        height: Platform.OS === "ios" ? pxToDp(80) : pxToDp(70),
        minWidth: pxToDp(110),
        paddingBottom: pxToDp(10),
        marginBottom: pxToDp(40),
        ...appStyle.flexCenter,
    },
    selectfillBlankWrap: {
        minWidth: pxToDp(214),
        height: pxToDp(112),
        padding: pxToDp(2),
        paddingBottom: pxToDp(6),
        backgroundColor: "#E7E7F1",
        borderRadius: pxToDp(40),
        marginRight: pxToDp(12),
        marginTop: pxToDp(20),
        marginLeft: pxToDp(12),
    },
    selectfillBlankWrapInner: {
        flex: 1,
        backgroundColor: "#F5F5FA",
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter,
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
    },
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(RecordDoExercise);
