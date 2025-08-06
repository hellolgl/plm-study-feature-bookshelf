import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    DeviceEventEmitter,
    Modal,
    AppState,
} from "react-native";
import { appFont, appStyle, mathTopicStyle, mathFont } from "../../../../theme";
import { pxToDp, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import TopicNums from "../../../../component/math/Topic/TopicNums";
import * as _ from "lodash";
import { changeTopicData, initTopicData } from "../../tools";
import Stem from "../../../../component/math/Topic/Stem";
import Keyboard from "../../../../component/math/Keyboard/Keyboard";
import topaicTypes from "../../../../res/data/MathTopaicType";
import TopicStemTk from "../../../../component/math/Topic/TopicStemTk";
import { diagnosis } from "../../MathDiagnosis";
import Explanation from "../../../../component/math/Topic/Explanation";
import FranctionInputView from "../../../../component/math/FractionalRendering/FranctionInputView";
import CalculationStem from "../../../../component/math/Topic/CalculationStem";
import { Toast } from "antd-mobile-rn";
import OptionView from "../../../../component/math/Topic/OptionView";
import ApplicationStem from "../../../../component/math/Topic/ApplicationStem";
import ApplicationFillBlank from "../../../../component/math/Topic/ApplicationFillBlank";
import StatisticsModal from "../../../../component/math/StatisticsModal";
import ApplicationExplanation from "../../../../component/math/Topic/ApplicationExplanation";
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal";
import HelpModal from "../../../../component/math/Topic/HelpModal";
import * as actionCreators from "../../../../action/aiTalk/index";
import CorrectPrompt from "../../../../component/math/Topic/CorrectPrompt";
import Lottie from "lottie-react-native";
import AiTalkModal from "../../../../component/AiTalk/Modal";
import BackBtn from "../../../../component/math/BackBtn";
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let style = mathTopicStyle["2"];

class DoExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.TopicNumsRef = null;
        this.Keyboard = null;
        this.TopicStemTk = null;
        this.FranctionInputView = null;
        this.CalculationStem = null;
        this.ApplicationStem = null;
        this.exercise_set_id = "";
        this.total = 0;
        this.preOrNextThrottle = _.debounce(this.preOrNext, 300);
        this.submitThrottle = _.debounce(this.submit, 300);
        this.nextThrottle = _.debounce(this.next, 300);
        this.wrong_ids = [];
        this.lottieRef = React.createRef();
        this.state = {
            topic_num_list: [],
            topicIndex: 0,
            m_e_s_id: "",
            currentTopic: "",
            explanation_height: 0,
            isWrong: false,
            clickFraction: false,
            tk_space_key: "",
            statisticsVisible: false,
            draftVisible: false,
            helpVisible: false,
            keyboard_y: 0,
            keyboard_height: 0,
            // showCorrectPrompt: false,
            status: "0",
            isAll: this.props.navigation.state.params.data.isAll,
            aiVisible: false,
            showRobotEye: false,
            showAI: false,
            appState: AppState.currentState,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        const { isAll } = this.state;
        console.log("单元", isAll);
        isAll ? this.getAllData() : this.getData();
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
        // console.log('App state changed:', nextAppState);
        if (Platform.OS === "ios") {
            if (nextAppState === "background" || nextAppState === "inactive") {
                this.setState({
                    showRobotEye: false,
                    showAI: false,
                });
            }
            if (nextAppState === "active") {
                this.setState(
                    {
                        showAI: true,
                    },
                    () => {
                        this.lottieRef.current && this.lottieRef.current.play();
                    }
                );
            }
        }
        this.setState({ appState: nextAppState });
    };

    getAllData = () => {
        const { origin } = this.props.navigation.state.params.data;
        const { topicIndex } = this.state;
        const { textCode } = this.props;
        let obj = {
            origin,
            textbook: textCode,
        };
        axios
            .get(api.getMathAiGiveExerciseUnitExerciseList, { params: obj })
            .then((res) => {
                console.log("单元参数====", obj, res.data.data);
                let data = res.data.data.exercise;
                this.total = data.length;
                this.exercise_set_id = res.data.data.exercise_set_id;
                let m_e_s_id = "";
                let _topicIndex = topicIndex;
                let status = res.data.data.status;
                let list = [];
                if (data.length > 0) {
                    list = data.map((item) => {
                        return {
                            ...item,
                            displayed_type_name: item.displayed_type,
                            m_e_s_id: item.exercise_id,
                            exercise_type_name: item.exercise_type,
                        };
                    });
                    if (status === "1") {
                        // 继续作答
                        list.forEach((i) => {
                            if (i.correct === 0) this.wrong_ids.push(i.m_e_s_id);
                        });
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].correct === -1) {
                                _topicIndex = i;
                                break;
                            }
                        }
                    }
                    m_e_s_id = list[_topicIndex].m_e_s_id;
                }
                this.setState(
                    {
                        topic_num_list: list,
                        m_e_s_id,
                        topicIndex: _topicIndex,
                        status,
                    },
                    () => {
                        if (status === "1") {
                            let item = list[_topicIndex];
                            this.TopicNumsRef.clickItem(item, _topicIndex);
                            return;
                        }
                        if (m_e_s_id) this.getTopic();
                    }
                );
            });
    };
    getData = () => {
        const {
            knowledge_code,
            origin,
            right_rate,
            exercise_set_id,
            element_status,
        } = this.props.navigation.state.params.data;
        const { topicIndex } = this.state;
        const { textCode } = this.props;
        let obj = {
            knowledge_code,
            origin,
            category_type:
                right_rate.length === 0 ? "0" : Number(right_rate) < 90 ? "2" : "1",
            textbook: textCode,
            right_rate,
            exercise_set_id,
            element_status,
        };

        axios
            .get(api.getMathAiGiveExerciseKnowExerciseList, { params: obj })
            .then((res) => {
                // console.log("参数====", obj, res.data.data);
                let data = res.data.data.exercise;
                this.total = data.length;
                this.exercise_set_id = res.data.data.exercise_set_id;
                let m_e_s_id = "";
                let _topicIndex = topicIndex;
                let status = res.data.data.status;
                let list = [];
                if (data.length > 0) {
                    list = data.map((item) => {
                        return {
                            ...item,
                            displayed_type_name: item.displayed_type,
                            m_e_s_id: item.exercise_id,
                            exercise_type_name: item.exercise_type,
                            knowledge_name: res.data.data.knowledge_name,
                        };
                    });
                    if (status === "1") {
                        // 继续作答
                        list.forEach((i) => {
                            if (i.correct === 0) this.wrong_ids.push(i.m_e_s_id);
                        });
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].correct === -1) {
                                _topicIndex = i;
                                break;
                            }
                        }
                    }
                    m_e_s_id = list[_topicIndex].m_e_s_id;
                }
                this.setState(
                    {
                        topic_num_list: list,
                        m_e_s_id,
                        topicIndex: _topicIndex,
                        status,
                    },
                    () => {
                        if (status === "1") {
                            let item = list[_topicIndex];
                            this.TopicNumsRef.clickItem(item, _topicIndex);
                            return;
                        }
                        if (m_e_s_id) this.getTopic();
                    }
                );
            });
    };

    setShowAI = () => {
        const { currentTopic, showAI } = this.state;
        const { public_exercise_stem, public_exercise_image, exercise_data_type } =
            currentTopic;
        const imgRegex = /<img src=['"](.*?)['"][^>]*>/g;
        let newShowAI = true;
        if (
            public_exercise_image ||
            imgRegex.exec(public_exercise_stem) !== null ||
            exercise_data_type === "FS"
        ) {
            // 题干有图片，分数题不展示ai解题
            newShowAI = false;
        }
        if (!showAI) {
            this.setState({
                showRobotEye: false,
            });
        }
        this.setState({
            showAI: newShowAI,
        });
    };

    getTopic = () => {
        const { status, isAll } = this.state;
        const { m_e_s_id, topicIndex } = this.state;
        let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list));
        let data = {
            exercise_id: m_e_s_id,
            module_type: this.state.topic_num_list[topicIndex].module_type,
            exercise_set_id: this.exercise_set_id,
        };
        // if (status === '1' && topic_num_list[topicIndex].correct !== -1) data.exercise_set_id = this.exercise_set_id
        if (topic_num_list[topicIndex].topic) {
            if (topic_num_list[topicIndex].correct === -1) {
                // 表示当前题目没有提交就进行了跳转，要重置题目数据
                topic_num_list[topicIndex].topic = initTopicData(
                    topic_num_list[topicIndex].topic
                );
            }
            this.setState(
                {
                    currentTopic: topic_num_list[topicIndex].topic,
                    isWrong: false,
                    topic_num_list,
                },
                () => {
                    this.setShowAI();
                }
            );
            return;
        }
        // console.log("参数", status, this.exercise_set_id, data);
        let url = "";
        if (isAll) {
            url = api.getMathAiGiveExerciseUnitExercise;
        } else {
            url = api.getMathAiGiveExerciseKnowExercise;
        }
        axios.get(url, { params: data }).then((res) => {
            let currentTopic = {
                ...res.data.data,
                // exercise_type_name: res.data.data.exercise_type,
                module_type: this.state.topic_num_list[topicIndex].module_type,
            };
            currentTopic = changeTopicData(currentTopic);
            currentTopic.m_e_s_id = m_e_s_id;
            currentTopic._correct = topic_num_list[topicIndex].correct;
            topic_num_list[topicIndex].topic = currentTopic;
            this.setState(
                {
                    currentTopic,
                    topic_num_list,
                    isWrong: false,
                },
                () => {
                    this.setShowAI();
                }
            );
        });
    };

    clickItem = (item, index) => {
        this.setState(
            {
                topicIndex: index,
                m_e_s_id: item.m_e_s_id,
                currentTopic: "",
            },
            () => {
                this.getTopic();
            }
        );
    };

    preOrNext = (type) => {
        const { topic_num_list } = this.state;
        let index =
            type === "pre" ? this.state.topicIndex - 1 : this.state.topicIndex + 1;
        let item = topic_num_list[index];
        this.TopicNumsRef.clickItem(item, index);
    };

    clickSpace = (key, clickFraction) => {
        const { currentTopic } = this.state;
        this.setState(
            {
                tk_space_key: key,
                clickFraction,
            },
            () => {
                if (this.FranctionInputView)
                    this.FranctionInputView.setInitdata(
                        currentTopic.my_answer_tk_map[key]
                    );
            }
        );
    };

    changeMyAnswerMap = (value) => {
        const { topicIndex } = this.state;
        let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list));
        topic_num_list[topicIndex].topic.my_answer_tk_map = value;
        this.setState({
            topic_num_list,
            currentTopic: topic_num_list[topicIndex].topic,
        });
    };

    renderStem = () => {
        const { currentTopic, topic_num_list, topicIndex } = this.state;
        const { displayed_type_name } = currentTopic;
        let correct = topic_num_list[topicIndex].correct;
        if (displayed_type_name === topaicTypes.Fill_Blank) {
            return (
                <TopicStemTk
                    my_style={style}
                    correct={correct}
                    data={currentTopic}
                    onRef={(ref) => {
                        this.TopicStemTk = ref;
                    }}
                    changeMyAnswerMap={this.changeMyAnswerMap}
                    clickSpace={this.clickSpace}
                ></TopicStemTk>
            );
        }
        if (displayed_type_name === topaicTypes.Calculation_Problem) {
            return (
                <CalculationStem
                    my_style={style}
                    onRef={(ref) => {
                        this.CalculationStem = ref;
                    }}
                    correct={correct}
                    data={currentTopic}
                    changeMyAnswerMap={this.changeMyAnswerMap}
                    clickSpace={this.clickSpace}
                ></CalculationStem>
            );
        }
        if (displayed_type_name === topaicTypes.Application_Questions) {
            return (
                <ApplicationStem
                    my_style={style}
                    onRef={(ref) => {
                        this.ApplicationStem = ref;
                    }}
                    correct={correct}
                    data={currentTopic}
                    changeMyAnswerMap={this.changeMyAnswerMap}
                    clickSpace={this.clickSpace}
                ></ApplicationStem>
            );
        }
        return <Stem my_style={style} data={currentTopic}></Stem>;
    };

    checkOption = (value) => {
        const { topicIndex } = this.state;
        let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list));
        topic_num_list[topicIndex].topic._my_answer = value;
        this.setState({
            topic_num_list,
        });
    };

    renderOptions = () => {
        const { currentTopic } = this.state;
        return (
            <OptionView
                data={currentTopic}
                checkOption={this.checkOption}
            ></OptionView>
        );
    };

    changeValues = (value) => {
        const { clickFraction, currentTopic, tk_space_key } = this.state;
        if (tk_space_key === -1) {
            Toast.info("请选择空格", 2);
            return;
        }
        if (value === "分数") {
            this.setState(
                {
                    clickFraction: !clickFraction,
                },
                () => {
                    if (currentTopic.my_answer_tk_map[tk_space_key].isFraction) {
                        if (this.FranctionInputView)
                            this.FranctionInputView.setInitdata(
                                currentTopic.my_answer_tk_map[tk_space_key]
                            ); //当有key值时点击分数回显答案
                    }
                }
            );
            return;
        }
        if (clickFraction) {
            this.FranctionInputView.changeValues(value);
            return;
        }
        if (currentTopic.displayed_type_name === topaicTypes.Calculation_Problem) {
            // 计算题
            this.CalculationStem.changeValues(value);
        }
        if (
            currentTopic.displayed_type_name === topaicTypes.Application_Questions
        ) {
            // 应用题
            this.ApplicationStem.changeValues(value);
        }
        if (currentTopic.displayed_type_name === topaicTypes.Fill_Blank) {
            // 填空题
            this.TopicStemTk.changeValues(value);
        }
    };

    submit = () => {
        const { token } = this.props;
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return;
        }
        const { topic_num_list, topicIndex } = this.state;
        let topic = topic_num_list[topicIndex].topic;
        let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list));
        const { result, wrong_arr } = diagnosis(topic);
        if (result) {
            PlayAudio.playSuccessSound(url.successAudiopath2)
            _topic_num_list[topicIndex].correct = 1;
            _topic_num_list[topicIndex].topic._correct = 1;
            this.setState(
                {
                    topic_num_list: _topic_num_list,
                    // showCorrectPrompt: true,
                },
                () => {
                    // setTimeout(() => {
                    //   this.setState(
                    //     {
                    //       showCorrectPrompt: false,
                    //     },
                    //     () => {
                    //       this.next();
                    //     }
                    //   );
                    // }, 500);
                }
            );
        } else {
            PlayAudio.playSuccessSound(url.failAudiopath)
            _topic_num_list[topicIndex].correct = 0;
            _topic_num_list[topicIndex].topic._correct = 0;
            this.wrong_ids.push(topic.m_e_s_id);
            if (wrong_arr) {
                this.setState({
                    currentTopic: "",
                });
                // 填空题答案回显
                let my_answer_tk_map = topic.my_answer_tk_map;
                wrong_arr.forEach((i, x) => {
                    my_answer_tk_map[i].isWrong = true;
                });
                _topic_num_list[topicIndex].topic.my_answer_tk_map = my_answer_tk_map;
            }
            this.setState({
                topic_num_list: _topic_num_list,
                currentTopic: _topic_num_list[topicIndex].topic, //设置题目是为了错误回显
                isWrong: true,
            });
        }
        let answer = topic._my_answer ? topic._my_answer : "";
        if (topic._show_keyBoard) {
            // 表示用了键盘的那一类题
            answer = JSON.stringify(topic.my_answer_tk_map);
        }
        const { origin } = this.props.navigation.state.params.data;

        let data = {
            exercise_set_id: this.exercise_set_id,
            exercise_id: topic.m_e_s_id,
            answer_content: answer,
            correct: result ? 1 : 0,
            module_type: topic.module_type,
            exercise_ability: topic.exercise_ability,
            origin,
        };
        // console.log("诊断结果_____________________________________", data);

        this.saveData(data);
    };

    saveData = (data) => {
        let service = api.saveMathAiGiveExerciseKnowExercise
        if (this.state.isAll) service = api.saveMathAiGiveExerciseUnitExercise
        axios.post(service, data).then((res) => {
            console.log("保存————————————————————————", res.data, data);
            if (data.correct === 1) {
                // 做对
                if (this.getTopicIndex() === -1) {
                    // 最后一题
                    getRewardCoinLastTopic().then(res => {
                        if (res.isReward) {
                            // 展示奖励弹框,在动画完后在弹统计框
                            this.eventListener = DeviceEventEmitter.addListener(
                                "rewardCoinClose",
                                () => {
                                    this.next()
                                    this.eventListener && this.eventListener.remove()
                                }
                            );
                        } else {
                            this.next()
                        }
                    })
                } else {
                    this.props.getRewardCoin()
                    this.next()
                }
            }
        });
    };

    next = () => {
        const { topic_num_list } = this.state;
        let next_topicIndex = this.getTopicIndex();
        this.setState(
            {
                isWrong: false,
            },
            () => {
                if (next_topicIndex === -1) {
                    // 所有题做完
                    this.wrong_ids = [...new Set(this.wrong_ids)];
                    // console.log('所有题做完，弹统计', this.wrong_ids)
                    this.setState({
                        statisticsVisible: true,
                    });
                } else {
                    let item = topic_num_list[next_topicIndex];
                    this.TopicNumsRef.clickItem(item, next_topicIndex);
                }
            }
        );
    };

    getTopicIndex = () => {
        const { topicIndex, topic_num_list } = this.state;
        let index = -1;
        for (let i = 0; i < topic_num_list.length; i++) {
            if (topic_num_list[i].correct === -1 && i > topicIndex) {
                index = i;
                return i;
            }
            index = -1;
        }
        if (index === -1) {
            // 当前题号往后没有未做完的题，所以要在往前找
            for (let i = 0; i < topic_num_list.length; i++) {
                if (topic_num_list[i].correct === -1 && i < topicIndex) {
                    index = i;
                    return i;
                }
                index = -1;
            }
        }
        return index;
    };

    onLayoutHeader = (e) => {
        let { height } = e.nativeEvent.layout;
        let explanation_height = windowHeight - height;
        if (Platform.OS === "android") {
            explanation_height = explanation_height - pxToDp(90);
        } else {
            explanation_height = explanation_height - pxToDpHeight(100);
        }
        this.setState({
            explanation_height,
        });
    };

    confirm = (value) => {
        const { topic_num_list, topicIndex, tk_space_key } = this.state;
        let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list));
        if (value[2]) {
            // 带分数
            if (
                value[0].init_char_mat.length !== 0 ||
                value[1].init_char_mat.length !== 0 ||
                value[2].init_char_mat.length !== 0
            ) {
                _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] =
                    value;
                _topic_num_list[topicIndex].topic.my_answer_tk_map[
                    tk_space_key
                ].isFraction = true;
            } else {
                _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = {
                    init_char_mat: [],
                    cursor_idx: -1,
                };
            }
        } else {
            // 分数
            if (
                value[0].init_char_mat.length !== 0 ||
                value[1].init_char_mat.length !== 0
            ) {
                _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] =
                    value;
                _topic_num_list[topicIndex].topic.my_answer_tk_map[
                    tk_space_key
                ].isFraction = true;
            } else {
                _topic_num_list[topicIndex].topic.my_answer_tk_map[tk_space_key] = {
                    init_char_mat: [],
                    cursor_idx: -1,
                };
            }
        }
        this.setState(
            {
                topic_num_list: _topic_num_list,
                currentTopic: _topic_num_list[topicIndex].topic,
                clickFraction: false,
            },
            () => {
                if (
                    _topic_num_list[topicIndex].topic.displayed_type_name ===
                    topaicTypes.Fill_Blank
                )
                    this.TopicStemTk.setInitdata(
                        _topic_num_list[topicIndex].topic.my_answer_tk_map
                    ); //分数答案时，点击分数在分数输入组件的数据回显
                if (
                    _topic_num_list[topicIndex].topic.displayed_type_name ===
                    topaicTypes.Calculation_Problem
                )
                    this.CalculationStem.setInitdata(
                        _topic_num_list[topicIndex].topic.my_answer_tk_map
                    ); //分数答案时，点击分数在分数输入组件的数据回显
                if (
                    _topic_num_list[topicIndex].topic.displayed_type_name ===
                    topaicTypes.Application_Questions
                )
                    this.ApplicationStem.setInitdata(
                        _topic_num_list[topicIndex].topic.my_answer_tk_map
                    ); //分数答案时，点击分数在分数输入组件的数据回显
            }
        );
    };

    renderExplaination = () => {
        const { topic_num_list, currentTopic, topicIndex } = this.state;
        const { displayed_type_name } = currentTopic;
        if (displayed_type_name === topaicTypes.Application_Questions) {
            return (
                <ApplicationExplanation
                    my_style={style}
                    data={currentTopic}
                    correct={topic_num_list[topicIndex].correct}
                ></ApplicationExplanation>
            );
        }
        return (
            <Explanation
                data={currentTopic}
                my_style={style}
                correct={topic_num_list[topicIndex].correct}
            ></Explanation>
        );
    };

    showdraft = () => {
        this.setState({
            draftVisible: true,
        });
    };

    onLayoutKeyBoard = (e) => {
        let { y, height } = e.nativeEvent.layout;
        this.setState(() => ({
            keyboard_y: y,
            keyboard_height: height - pxToDp(40), //40 container的padingbottom
        }));
    };

    render() {
        const {
            topic_num_list,
            currentTopic,
            topicIndex,
            isWrong,
            clickFraction,
            statisticsVisible,
            draftVisible,
            helpVisible,
            keyboard_y,
            keyboard_height,
            explanation_height,
            // showCorrectPrompt,
            aiVisible,
            showRobotEye,
            showAI,
        } = this.state;
        const { displayed_type_name, _show_keyBoard, _show_options, _correct } =
            currentTopic;
        const { lesson_name } = this.props.navigation.state.params.data;
        console.log("当前题目", currentTopic);
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <BackBtn goBack={this.goBack}></BackBtn>
                <TouchableOpacity style={[styles.caogao_btn]} onPress={this.showdraft}>
                    <Image
                        style={{ width: pxToDp(40), height: pxToDp(40) }}
                        resizeMode="stretch"
                        source={require("../../../../images/MathSyncDiagnosis/cg_icon.png")}
                    ></Image>
                    <Text
                        style={[
                            { color: "#246666", fontSize: pxToDp(32), marginLeft: pxToDp(4) },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        草稿
                    </Text>
                </TouchableOpacity>
                {showAI ? (
                    <TouchableOpacity
                        style={[
                            { position: "absolute", right: pxToDp(200), top: 0, zIndex: 1 },
                        ]}
                        onPress={() => {
                            if (!this.props.token) {
                                NavigationUtil.resetToLogin(this.props);
                                return;
                            }
                            const stem = currentTopic["public_exercise_stem"].replaceAll(
                                "#k#",
                                "_"
                            );
                            console.log("click here...: ", currentTopic);
                            this.props.chat({
                                knowledge_name: currentTopic["knowledge_name"],
                                exercise_stem: stem,
                            });
                            this.setState({
                                aiVisible: true,
                            });
                        }}
                    >
                        <Lottie
                            ref={this.lottieRef}
                            source={require("./lottie/robot1.json")}
                            onAnimationFinish={() => {
                                this.setState({
                                    showRobotEye: true,
                                });
                            }}
                            autoPlay
                            loop={false}
                            style={[
                                Platform.OS === "android"
                                    ? { width: pxToDp(280), height: pxToDp(280) }
                                    : { width: pxToDp(380), height: pxToDp(310) },
                            ]}
                        />
                        {showRobotEye ? (
                            <View
                                style={[
                                    { position: "absolute" },
                                    Platform.OS === "android"
                                        ? { top: pxToDp(155), left: pxToDp(65) }
                                        : { top: pxToDp(176), left: pxToDp(78) },
                                ]}
                            >
                                <Lottie
                                    source={require("./lottie/robot2.json")}
                                    autoPlay
                                    style={[
                                        Platform.OS === "android"
                                            ? { width: pxToDp(70), height: pxToDp(70) }
                                            : { width: pxToDp(80), height: pxToDp(80) },
                                    ]}
                                />
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ) : null}

                <Text style={[styles.header]} onLayout={(e) => this.onLayoutHeader(e)}>
                    {lesson_name}
                </Text>
                <View
                    style={[
                        appStyle.flexAliCenter,
                        {
                            marginBottom: pxToDp(28),
                            paddingLeft: pxToDp(60),
                            paddingRight: pxToDp(60),
                        },
                    ]}
                >
                    <TopicNums
                        onRef={(ref) => {
                            this.TopicNumsRef = ref;
                        }}
                        list={topic_num_list}
                        clickItem={this.clickItem}
                    ></TopicNums>
                </View>
                <View style={[styles.content]}>
                    {topic_num_list === 0 ? (
                        <View
                            style={{
                                position: "absolute",
                                left: "53%",
                                top: "40%",
                            }}
                        >
                            <ActivityIndicator size={"large"} color={"#999999"} />
                        </View>
                    ) : (
                        <>
                            <View
                                style={[
                                    styles.content_inner,
                                    {
                                        paddingBottom:
                                            _show_keyBoard &&
                                                topic_num_list[topicIndex].correct === -1
                                                ? keyboard_height
                                                : pxToDp(36),
                                    },
                                    appStyle.flexJusBetween,
                                ]}
                            >
                                {isWrong &&
                                    displayed_type_name ===
                                    topaicTypes.Application_Questions ? null : (
                                    <TouchableOpacity
                                        style={[styles.help_btn]}
                                        onPress={() => {
                                            this.setState({ helpVisible: true });
                                        }}
                                    >
                                        <Image
                                            source={require("../../../../images/MathSyncDiagnosis/help_btn_1.png")}
                                            resizeMode="contain"
                                            style={{ width: pxToDp(100), height: pxToDp(100) }}
                                        ></Image>
                                    </TouchableOpacity>
                                )}
                                {currentTopic ? (
                                    <>
                                        <View style={[styles.type]}>
                                            <Text style={[styles.type_txt]}>
                                                {displayed_type_name}
                                            </Text>
                                        </View>
                                        <ScrollView
                                            contentContainerStyle={{
                                                paddingBottom: pxToDp(230),
                                                paddingRight: pxToDp(60),
                                            }}
                                        >
                                            <View style={[{ paddingRight: pxToDp(50) }]}>
                                                {this.renderStem()}
                                            </View>
                                            {_show_options ? this.renderOptions() : null}
                                            {_correct !== -1 ? this.renderExplaination() : null}
                                        </ScrollView>
                                        {isWrong || _correct !== -1 ? (
                                            <TouchableOpacity
                                                style={[
                                                    styles.submit_btn,
                                                    { backgroundColor: "#2278E9" },
                                                ]}
                                                onPress={this.nextThrottle}
                                            >
                                                <View
                                                    style={[
                                                        styles.submit_btn_inner,
                                                        { backgroundColor: "#2697FF" },
                                                    ]}
                                                >
                                                    <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>
                                                        下一题
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : _show_keyBoard ? null : (
                                            <TouchableOpacity
                                                style={[styles.submit_btn]}
                                                onPress={this.submitThrottle}
                                            >
                                                <View style={[styles.submit_btn_inner]}>
                                                    <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>
                                                        提交
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                ) : null}
                            </View>
                        </>
                    )}
                    {topicIndex === 0 ? null : (
                        <TouchableOpacity
                            style={[styles.pre_btn]}
                            onPress={() => {
                                this.preOrNextThrottle("pre");
                            }}
                        >
                            <View style={[styles.pre_btn_inner]}>
                                <Image
                                    style={[{ width: pxToDp(16), height: pxToDp(80) }]}
                                    resizeMode="stretch"
                                    source={require("../../../../images/MathKnowledgeGraph/pre_icon_1.png")}
                                ></Image>
                            </View>
                        </TouchableOpacity>
                    )}
                    {topicIndex === topic_num_list.length - 1 ? null : (
                        <TouchableOpacity
                            style={[styles.next_btn]}
                            onPress={() => {
                                this.preOrNextThrottle("next");
                            }}
                        >
                            <View style={[styles.next_btn_inner]}>
                                <Image
                                    style={[{ width: pxToDp(16), height: pxToDp(80) }]}
                                    resizeMode="stretch"
                                    source={require("../../../../images/MathKnowledgeGraph/next_icon_1.png")}
                                ></Image>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                {_show_keyBoard && topic_num_list[topicIndex].correct === -1 ? (
                    <View
                        style={[styles.keyboard_wrap]}
                        onLayout={(event) => this.onLayoutKeyBoard(event)}
                    >
                        <Keyboard
                            currentTopic={currentTopic}
                            changeValues={this.changeValues}
                            onRef={(ref) => {
                                this.Keyboard = ref;
                            }}
                            submit={this.submitThrottle}
                        ></Keyboard>
                    </View>
                ) : null}
                {isWrong &&
                    displayed_type_name === topaicTypes.Application_Questions ? (
                    <View
                        style={[
                            styles.explanation_wrap,
                            {
                                height: explanation_height,
                                paddingLeft: pxToDp(0),
                                paddingRight: pxToDp(0),
                            },
                        ]}
                    >
                        <ApplicationFillBlank
                            my_style={style}
                            data={currentTopic}
                            toNext={this.nextThrottle}
                        ></ApplicationFillBlank>
                    </View>
                ) : null}
                {clickFraction ? (
                    <FranctionInputView
                        onRef={(ref) => {
                            this.FranctionInputView = ref;
                        }}
                        confirm={this.confirm}
                        top={keyboard_y}
                        close={() => {
                            this.setState({ clickFraction: false });
                        }}
                    ></FranctionInputView>
                ) : null}
                <StatisticsModal
                    visible={statisticsVisible}
                    close={() => {
                        this.setState(
                            {
                                statisticsVisible: false,
                            },
                            () => {
                                this.goBack();
                            }
                        );
                    }}
                    total={this.total}
                    wrong={this.wrong_ids.length}
                ></StatisticsModal>
                <ScribblingPadModal
                    visible={draftVisible}
                    toggleEvent={() => {
                        this.setState({ draftVisible: false });
                    }}
                />
                <HelpModal
                    visible={helpVisible}
                    data={currentTopic}
                    close={() => {
                        this.setState({ helpVisible: false });
                    }}
                ></HelpModal>
                {/* {showCorrectPrompt ? <CorrectPrompt></CorrectPrompt> : null} */}
                <AiTalkModal
                    visible={aiVisible}
                    close={() => {
                        this.setState({
                            aiVisible: false,
                        });
                    }}
                ></AiTalkModal>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(60),
        paddingBottom: pxToDp(40),
    },
    header: {
        textAlign: "center",
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        color: "#246666",
        marginBottom: pxToDp(40),
    },
    content: {
        flex: 1,
        paddingLeft: pxToDp(80),
        paddingRight: pxToDp(80),
        ...appStyle.flexJusCenter,
    },
    content_inner: {
        flex: 1,
        paddingLeft: pxToDp(60),
        paddingTop: pxToDp(60),
        backgroundColor: "#fff",
        borderRadius: pxToDp(40),
    },
    caogao_btn: {
        position: "absolute",
        top: Platform.OS === "android" ? pxToDpHeight(20) : pxToDpHeight(40),
        right: pxToDp(20),
        zIndex: 1,
        backgroundColor: "rgba(36, 102, 102, 0.10)",
        width: pxToDp(140),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter,
        ...appStyle.flexLine,
    },
    type: {
        position: "absolute",
        top: 0,
        left: pxToDp(114),
        paddingLeft: pxToDp(54),
        paddingRight: pxToDp(54),
        backgroundColor: "#FFB74B",
        borderBottomLeftRadius: pxToDp(20),
        borderBottomRightRadius: pxToDp(20),
        height: pxToDp(48),
        ...appStyle.flexCenter,
    },
    type_txt: {
        color: "#B26B00",
        fontSize: pxToDp(24),
        ...appFont.fontFamily_jcyt_500,
    },
    keyboard_wrap: {
        position: "absolute",
        bottom: 0,
        zIndex: 1,
    },
    explanation_wrap: {
        position: "absolute",
        bottom: 0,
        width: windowWidth,
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        paddingTop: pxToDp(98),
        ...appStyle.flexJusBetween,
        paddingBottom: pxToDp(40),
    },
    explanation_btn_wrap: {
        width: windowWidth,
        ...appStyle.flexLine,
        ...appStyle.flexJusCenter,
    },
    pre_btn: {
        position: "absolute",
        left: 0,
        width: pxToDp(70),
        height: pxToDp(720),
    },
    pre_btn_inner: {
        width: pxToDp(40),
        height: "100%",
        backgroundColor: "#fff",
        borderTopRightRadius: pxToDp(40),
        borderBottomRightRadius: pxToDp(40),
        ...appStyle.flexCenter,
    },
    next_btn: {
        position: "absolute",
        right: 0,
        width: pxToDp(70),
        height: pxToDp(720),
        ...appStyle.flexAliEnd,
    },
    next_btn_inner: {
        width: pxToDp(40),
        height: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(40),
        borderBottomLeftRadius: pxToDp(40),
        ...appStyle.flexCenter,
    },
    help_btn: {
        position: "absolute",
        right: pxToDp(-26),
        top: pxToDp(-26),
    },
    submit_btn: {
        position: "absolute",
        width: pxToDp(200),
        height: pxToDp(200),
        borderRadius: pxToDp(100),
        backgroundColor: "#00836D",
        right: pxToDp(40),
        bottom: pxToDp(40),
    },
    submit_btn_inner: {
        width: pxToDp(200),
        height: pxToDp(192),
        backgroundColor: "#00B295",
        borderRadius: pxToDp(100),
        ...appStyle.flexCenter,
    },
    mContainer: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        paddingTop: pxToDp(40),
        paddingLeft: pxToDp(50),
        paddingRight: pxToDp(50),
    },
    mContent: {
        flex: 1,
        paddingLeft: pxToDp(38),
        paddingRight: pxToDp(25),
        paddingTop: Platform.OS === "android" ? pxToDp(100) : pxToDp(80),
        paddingBottom: pxToDp(40),
    },
    mTipsWrap: {
        height: pxToDp(120),
        width: pxToDp(631),
        backgroundColor: "#E3F2FF",
        ...appStyle.flexCenter,
        borderRadius: pxToDp(60),
        borderTopLeftRadius: 0,
        shadowColor: "#000000",
        shadowOffset: {
            width: pxToDp(0),
            height: pxToDp(4),
        },
        shadowOpacity: 0.15,
        elevation: 3,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        textCode: state.getIn(["bagMath", "textBookCode"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        chat(data) {
            dispatch(actionCreators.chat(data));
        },
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
