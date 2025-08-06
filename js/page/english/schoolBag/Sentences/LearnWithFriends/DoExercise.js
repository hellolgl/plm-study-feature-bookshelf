import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    DeviceEventEmitter,
    Platform,
    ActivityIndicator,
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp } from "../../../../../util/tools";
import { getDebounceTime } from "../../../../../util/commonUtils";
import { appStyle, appFont } from "../../../../../theme";
import * as _ from "lodash";
import AnalysisModal from "../LearnToday/components/AnalysisModal";
import { changeCurrentTopic, haveNbsp } from "../tools";
import url from "../../../../../util/url";
import Audio from "../../../../../util/audio/audio";
import PlayAudio from "../../../../../util/audio/playAudio";
import StatisticModal from "../components/StatisticModal";
import { getRewardCoinLastTopic } from '../../../../../util/coinTools'

let debounceTime = getDebounceTime();
let baseUrl = url.baseURL;

const STATUS_COLOR_MAP = {
    0: "#00CB8E",
    1: "#FFB648",
    2: "#EC5D57",
};

class DoExercise extends PureComponent {
    constructor(props) {
        super(props);
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        this.grade_code = userInfoJs.checkGrade;
        this.term_code = userInfoJs.checkTeam;
        this.cartoon = this.props.navigation.state.params.data.cartoon;
        this.submitThrottle = _.debounce(this.submit, debounceTime);
        this.start_time = undefined;
        this.do_num = 0;
        this.ranking_0_num = 0; //好
        this.ranking_1_num = 0; //良好
        this.ranking_2_num = 0; //错误
        this.spend_time_arr = [];
        this.rankingAudioMap = {
            0: url.fantastic,
            1: url.tryAgain,
            2: url.tryAgain
        };
        this.eventListener = undefined
        this.state = {
            allTopicList: [],
            topicList: [],
            currentTopic: {},
            topicIndex: 0,
            ranking: "2",
            analysisVisible: false,
            selectIndex: 0,
            statisticVisible: false,
            answerNumber: {
                0: 0,
                1: 0,
                2: 0,
            },
            lf_diagnosis_id: "",
            currentLevel: 1,
            circleList: [],
            loading: true,
            btnTxt: "Next",
            options: [],
            isUp: true,
            optionIndexMap: {},
        };
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    componentDidMount() {
        this.getData();
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage", "modular2"); //返回页面刷新
        DeviceEventEmitter.emit("refreshRecordPage"); //返回答题记录刷新
    }
    getData() {
        this.setState({
            loading: true,
        });
        const { currentLevel, topicIndex } = this.state;
        const data = {};
        data.grade_code = this.grade_code;
        data.term_code = this.term_code;
        data.cartoon = this.cartoon;
        axios
            .get(api.getEngCartoonExercise, { params: data })
            .then((res) => {
                let _data = _.cloneDeep(res.data.data);
                for (let i in _data) {
                    _data[i].forEach((j, index) => {
                        _data[i][index] = changeCurrentTopic(_data[i][index]);
                        j.aLevel = i;
                        j.aIndex = index + 1;
                    });
                }
                // console.log('+++++',_data[currentLevel],_data)
                this.setState(
                    () => ({
                        allTopicList: _data,
                        topicList: _data[currentLevel],
                        currentTopic:
                            _data[currentLevel].length > 0
                                ? _data[currentLevel][topicIndex]
                                : {},
                        lf_diagnosis_id:
                            _data[currentLevel].length > 0
                                ? _data[currentLevel][topicIndex].lf_diagnosis_id
                                : "",
                    }),
                    () => {
                        this.start_time = new Date().getTime();
                        this.setOptions();
                    }
                );
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    }

    setOptions = (selectIndex) => {
        const { currentTopic } = this.state;
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

    getSaveData = (currentTopic) => {
        return {
            lf_diagnosis_id: currentTopic.lf_diagnosis_id,
            se_id: currentTopic.se_id,
            exercise_time: currentTopic.exercise_time,
            grade_code: this.grade_code,
            term_code: this.term_code,
            inspect: currentTopic.inspect,
        };
    };
    submit = () => {
        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const { currentTopic, topicIndex, topicList, circleList } = this.state;
        console.log("提交", currentTopic);
        let data = this.getSaveData(currentTopic);
        let diag_key = "";
        currentTopic.sentence_stem.forEach((i) => {
            if (i.slectValue) diag_key += i.slectValue;
        });
        if (!diag_key) return;
        let ranking = currentTopic.diag_sentence[diag_key]
            ? currentTopic.diag_sentence[diag_key].ranking
            : "2"; //不存在key值算错
        this.playRankingAudio(ranking);
        let diagnose = currentTopic.diag_sentence[diag_key]
            ? currentTopic.diag_sentence[diag_key].diagnose
            : "";
        let endTime = new Date().getTime();
        let spend_time = parseInt((endTime - this.start_time) / 1000);
        data.correct = ranking;
        data.answer_time = spend_time;
        let _topicList = JSON.parse(JSON.stringify(topicList));
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
        _currentTopic.diagnose = diagnose;
        _currentTopic.status = ranking;
        this.do_num = this.do_num + 1;
        if (this.do_num === 1) {
            // 第一次保存，统计答题对错数据
            _topicList[topicIndex].status = ranking;
            this.spend_time_arr.push(spend_time);
            data.alias = "english_Sentences";
            // this.saveData(data);
            axios.post(api.saveEngCartoonExercise, data).then((res) => {
                console.log("单题保存", res, data);
                let btnTxt = "Next";
                if (ranking === "2" && this.do_num === 1) btnTxt = "Try again";
                if (ranking !== '2') {
                    getRewardCoinLastTopic().then(res => {
                        if (res.isReward) {
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.setState({
                                        analysisVisible: true
                                    })
                                    this.eventListener && this.eventListener.remove()
                                }
                            );
                        } else {
                            this.setState({
                                analysisVisible: true
                            })
                        }
                    })
                } else {
                    this.setState({
                        analysisVisible: true
                    })
                }
                this.setState({
                    topicList: _topicList,
                    ranking,
                    currentTopic: _currentTopic,
                    btnTxt,
                });
            });
            switch (ranking) {
                case "0":
                    this.ranking_0_num++;
                    break;
                case "1":
                    this.ranking_1_num++;
                    break;
                case "2":
                    this.ranking_2_num++;
                    break;
            }
            let _circleList = JSON.parse(JSON.stringify(circleList));
            _circleList.push(ranking);
            this.setState({
                circleList: _circleList,
            });
        } else {
            let btnTxt = "Next";
            if (ranking === "2" && this.do_num === 1) btnTxt = "Try again";
            this.setState({
                topicList: _topicList,
                ranking,
                analysisVisible: true,
                currentTopic: _currentTopic,
                btnTxt,
            });
        }
    };
    onCloseAnalysis = () => {
        const { ranking } = this.state;
        this.setState(
            {
                analysisVisible: false,
            },
            () => {
                this.nextTopic(ranking, this.do_num);
            }
        );
        this.setState({
            btnTxt: "Next",
        });
    };
    nextTopic = (correct, do_num) => {
        const { currentTopic } = this.state;
        if (correct === "0") {
            this.toNextTopic();
        } else {
            if (do_num === 2) {
                // 做错后第2次答错
                this.toNextTopic();
                return;
            }
            let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
            _currentTopic.sentence_stem.forEach((item) => {
                if (item.contentSelect)
                    item.contentSelect = _.shuffle(item.contentSelect);
                item.isActive = false;
                if (item.slectValue) item.slectValue = "";
            });
            this.setState(
                {
                    currentTopic: _currentTopic,
                    selectIndex: 0,
                    optionIndexMap: {},
                },
                () => {
                    this.setOptions();
                }
            );
        }
    };
    getNextLevel = () => {
        const { allTopicList, currentLevel } = this.state;
        let _currentLevel = currentLevel;
        for (let i = currentLevel + 1; i < 4; i++) {
            if (allTopicList[i].length > 0) {
                // 取下一个等级有题的，有可能某个等级没有题
                _currentLevel = i;
                break;
            }
        }
        return _currentLevel;
    };

    showStatistic = () => {
        const { allTopicList, currentLevel } = this.state;
        // 一个等级的题做完了
        let _currentLevel = this.getNextLevel();
        for (let i = currentLevel + 1; i < 4; i++) {
            if (allTopicList[i].length > 0) {
                // 取下一个等级有题的，有可能某个等级没有题
                _currentLevel = i;
                break;
            }
        }
        let isUp = true;
        if (_currentLevel === currentLevel) {
            // 所有等级题目做完
            isUp = false;
            this.saveThisExercise();
        }
        let answerNumber = {
            0: this.ranking_0_num,
            1: this.ranking_1_num,
            2: this.ranking_2_num,
        };
        this.setState(
            {
                analysisVisible: false,
                answerNumber,
            },
            () => {
                this.setState({
                    statisticVisible: true,
                    isUp,
                });
            }
        );
    };

    toNextLevelTopic = () => {
        const { allTopicList } = this.state;
        let _currentLevel = this.getNextLevel();
        this.setState(
            {
                topicList: allTopicList[_currentLevel],
                topicIndex: 0,
                currentTopic: allTopicList[_currentLevel][0],
                lf_diagnosis_id: allTopicList[_currentLevel][0].lf_diagnosis_id,
                currentLevel: _currentLevel,
                selectIndex: 0,
                statisticVisible: false,
                answerNumber: {
                    0: 0,
                    1: 0,
                    2: 0,
                },
                optionIndexMap: {},
            },
            () => {
                this.start_time = new Date().getTime();
                this.do_num = 0;
                this.ranking_0_num = 0; //好
                this.ranking_1_num = 0; //良好
                this.ranking_2_num = 0; //错误
                this.setOptions();
            }
        );
    };
    toNextTopic = () => {
        const { topicIndex, topicList } = this.state;
        if (topicIndex + 1 === topicList.length) {
            this.showStatistic();
        } else {
            this.setState(
                {
                    topicIndex: topicIndex + 1,
                    currentTopic: topicList[topicIndex + 1],
                    selectIndex: 0,
                    optionIndexMap: {},
                },
                () => {
                    this.start_time = new Date().getTime();
                    this.do_num = 0;
                    this.setOptions();
                }
            );
        }
    };
    saveThisExercise = () => {
        const { lf_diagnosis_id, circleList } = this.state;
        let data = {};
        data.lf_diagnosis_id = lf_diagnosis_id;
        data.exercises_amount = circleList.length;
        let spend_time = this.spend_time_arr.reduce((c, i) => {
            return c + i;
        }, 0);
        data.spend_time = spend_time;
        axios.put(api.saveEngCartoonAllExercise, data).then((res) => {
            console.log("套题保存", res);
        });
    };

    clickSelect = (item, index) => {
        this.setState(
            {
                selectIndex: index,
            },
            () => {
                this.setOptions(index);
            }
        );
    };

    selectChoice = (item, index) => {
        const { currentTopic, selectIndex, optionIndexMap } = this.state;
        if (selectIndex === -1) return;
        let _currentTopic = JSON.parse(JSON.stringify(currentTopic));
        _currentTopic.sentence_stem[selectIndex].slectValue = item.content;
        if (_currentTopic.type === 2) {
            if (_currentTopic.sentence_stem.length - 1 >= selectIndex + 1) {
                this.setState({
                    selectIndex: selectIndex + 1,
                });
            } else if (_currentTopic.sentence_stem.length - 1 === selectIndex) {
                this.setState({
                    selectIndex,
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
        // PlayAudio.playSuccessSound('https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/excercise/audio/tryAgain.m4a');
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
                                    style={[
                                        styles.choiceItem,
                                        { minWidth: pxToDp(160) },
                                        optionIndexMap[`${selectIndex}`] ===
                                        `${selectIndex}${x}` && { backgroundColor: "#E8D3BC" },
                                    ]}
                                    key={x}
                                    onPress={() => {
                                        this.selectChoice(i, x);
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.choiceItemInner,
                                            optionIndexMap[`${selectIndex}`] ===
                                            `${selectIndex}${x}` && { backgroundColor: "#E8D3BC" },
                                        ]}
                                    >
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
                                            ? { borderBottomColor: "#FF964A" }
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
                                    <View
                                        style={[
                                            styles.choiceItemInner,
                                            i.content && { backgroundColor: "#F5F5FA" },
                                        ]}
                                    >
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
        let {
            topicList,
            currentTopic,
            analysisVisible,
            statisticVisible,
            answerNumber,
            loading,
            topicIndex,
            btnTxt,
            isUp,
        } = this.state;
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
                    <View style={[styles.circleCard, appStyle.flexTopLine]}>
                        {topicList.map((i, x) => {
                            const { status } = i;
                            return (
                                <View
                                    style={[
                                        styles.circle,
                                        x === topicList.length - 1 ? { marginRight: 0 } : null,
                                        x === topicIndex ? { borderColor: "#FF9032" } : null,
                                    ]}
                                    key={x}
                                >
                                    <View
                                        style={[
                                            styles.circleInner,
                                            STATUS_COLOR_MAP[status]
                                                ? {
                                                    backgroundColor: STATUS_COLOR_MAP[status],
                                                    borderRadius: pxToDp(40),
                                                }
                                                : null,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                { color: "#445268", fontSize: pxToDp(50) },
                                                appFont.fontFamily_jcyt_700,
                                                status ? { color: "#fff" } : null,
                                            ]}
                                        >
                                            {x + 1}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
                {topicList.length > 0 ? (
                    <View style={[styles.content, appStyle.flexCenter]}>
                        <ScrollView
                            style={[styles.contentInner]}
                            contentContainerStyle={{
                                paddingTop: pxToDp(55),
                                paddingLeft: pxToDp(95),
                                paddingRight: pxToDp(300),
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
                                    Next
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : loading ? (
                    <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                        <ActivityIndicator size="large" color="#4F99FF" />
                    </View>
                ) : (
                    <View style={[{ flex: 1 }, appStyle.flexCenter]}>
                        <Text
                            style={[{ fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}
                        >
                            暂无数据
                        </Text>
                    </View>
                )}
                <AnalysisModal
                    visible={analysisVisible}
                    onClose={this.onCloseAnalysis}
                    data={currentTopic}
                    txt={btnTxt}
                ></AnalysisModal>
                <StatisticModal
                    visible={statisticVisible}
                    isUp={isUp}
                    excellentNum={answerNumber["0"]}
                    goodNum={answerNumber["1"]}
                    wrongNum={answerNumber["2"]}
                    close={() => {
                        this.setState(
                            {
                                statisticVisible: false,
                                answerNumber: {
                                    0: 0,
                                    1: 0,
                                    2: 0,
                                },
                            },
                            () => {
                                this.goBack();
                            }
                        );
                    }}
                    continue={this.toNextLevelTopic}
                ></StatisticModal>
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
    circle: {
        width: pxToDp(100),
        height: pxToDp(100),
        borderRadius: pxToDp(50),
        padding: pxToDp(3),
        borderWidth: pxToDp(5),
        borderColor: "transparent",
        marginRight: pxToDp(40),
    },
    circleInner: {
        ...appStyle.flexCenter,
        flex: 1,
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
        marginBottom: pxToDp(20),
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
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
