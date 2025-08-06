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
} from "react-native";
import { appFont, appStyle, mathTopicStyle, mathFont } from "../../../../theme";
import { borderRadius_tool, pxToDp, pxToDpHeight, size_tool } from "../../../../util/tools";
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
import CorrectPrompt from "../../../../component/math/Topic/CorrectPrompt";
import * as actionCreators from "../../../../action/math/language/index";
import MyPie from "../../../../component/myChart/my";
import * as actionBagSyncDiagnosis from "../../../../action/math/bagSyncDiagnosis";
import chinese from "../../../../util/languageConfig/chinese";
import english from "../../../../util/languageConfig/english";
import BackBtn from '../../../../component/math/BackBtn'
import { getRewardCoinLastTopic } from '../../../../util/coinTools'
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";
import index from "../../../../reducer";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let style = mathTopicStyle["2"];

const skill_arr = [
    {
        label: '认识能力',
        total_score: 0,
    },
    {
        label: '分析能力',
        total_score: 0,

    },
    {
        label: '运用能力',
        total_score: 0,
    },
    {
        label: '思考能力',
        total_score: 0,
    }
]

class SkillDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.TopicNumsRef = null;
        this.Keyboard = null;
        this.TopicStemTk = null;
        this.FranctionInputView = null;
        this.CalculationStem = null;
        this.ApplicationStem = null;
        this.u_h_id = "";
        this.total = 0;
        this.preOrNextThrottle = _.debounce(this.preOrNext, 300);
        this.submitThrottle = _.debounce(this.submit, 300);
        this.nextThrottle = _.debounce(this.next, 300);
        this.u_q_id = this.props.navigation.state.params.data.u_q_id
        this.unitName = this.props.navigation.state.params.data.unitName
        this.max_level = this.props.navigation.state.params.data.max_level
        this.eventListener = undefined
        this.wrong_ids = [];
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
            currentOption: '',
            abilityInfo: skill_arr,
            showRule: false,
            topic_num_index: 0
            // showCorrectPrompt: false,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getData();
        this.abilityInfo();
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("refreshPage", 'skill'); //返回页面刷新
    }

    abilityInfo = () => {
        const { status } = this.props.navigation.state.params.data;
        const { topicIndex, topic_num_list, abilityInfo } = this.state;
        let data = {
            origin: this.u_q_id,
            // status: status
        };
        axios.get(api.abilityInfo, { params: data })
            .then((res) => {
                let data = res.data.data;
                skill_arr.forEach((item, index) => {
                    item.total_score = data[index];
                });
                this.setState({
                    abilityInfo: skill_arr
                })
            })
    }

    formData = (val) => {
        let arr = JSON.parse(val.replace(/'/g, '"'))[0];
        let str = arr.map(item => {
            if (Array.isArray(item)) {
                return item.join('/');
            }
            return item;
        }).join('');
        return str
    }
    getData = () => {
        const { status } = this.props.navigation.state.params.data;
        const { topicIndex, topic_num_list, currentOption } = this.state;
        let data = {
            origin: this.u_q_id,
            max_level: 5
            // status: status
        };
        axios.get(api.getAbilityStem, { params: data })
            .then((res) => {


                let currentTopic = res.data.data;

                currentTopic.public_exercise_stem = currentTopic.stem;
                currentTopic.choice_content_type = "text";
                currentTopic.displayed_type_name = currentTopic.display_type;
                currentTopic.exercise_data_type = currentTopic.data_type;


                if (currentTopic.data_type === 'FS') {
                    currentTopic.choice_content = currentTopic.options;;
                } else {
                    currentTopic.choice_content = currentTopic.options.join('#');
                }

                currentTopic.answer_content = currentTopic.answer;
                currentTopic.exercise_type_name = "ABC选择题";

                currentTopic.knowledgepoint_explanation = currentTopic.explain
                currentTopic = changeTopicData(currentTopic);
                currentTopic._correct = -1;
                currentTopic.correct = -1;
                currentTopic.answer = '';
                currentTopic._my_answer = '';
                // console.log('answer', currentTopic)
                let arr = [];

                arr.push(currentTopic);
                this.setState({
                    topic_num_list: [...topic_num_list, ...arr],
                    currentTopic: currentTopic,
                    isWrong: false,
                })
                // console.log('getAbilityStem', newOptions)


            })
    };

    getTopic = () => {
        // const { status } = this.props.navigation.state.params.data;
        // const { m_e_s_id, topicIndex } = this.state;
        let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list));
        let data = {
            m_e_s_id,
        };
        // if (status === 1 && topic_num_list[topicIndex].correct !== -1) {
        //     data.u_h_id = this.u_h_id;
        // }
        if (topic_num_list[topicIndex].topic) {
            if (topic_num_list[topicIndex].correct === -1) {
                // 表示当前题目没有提交就进行了跳转，要重置题目数据
                topic_num_list[topicIndex].topic = initTopicData(
                    topic_num_list[topicIndex].topic
                );
            }
            this.setState({
                currentTopic: topic_num_list[topicIndex].topic,
                isWrong: false,
                topic_num_list,
            });
            return;
        }
        axios.get(api.getUnitDiagnosisTopicDetail, { params: data }).then((res) => {
            let currentTopic = res.data.data;
            currentTopic = changeTopicData(currentTopic);
            currentTopic.m_e_s_id = m_e_s_id;
            currentTopic._correct = topic_num_list[topicIndex].correct;
            topic_num_list[topicIndex].topic = currentTopic;
            this.setState({
                currentTopic,
                topic_num_list,
                isWrong: false,
            });
        })
    };

    clickItem = (item, index) => {
        console.log('clickItem', item, index)
        this.setState(
            {
                topicIndex: index,
                currentTopic: this.state.topic_num_list[index],
                // currentOption: this.state.topic_num_list[index].chooseItem
                // currentTopic: "",
            },
            () => {
                // this.getTopic();
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
        console.log('displayed_type_name', displayed_type_name)
        let correct = topic_num_list[topicIndex]?.correct;
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

        // if (displayed_type_name == topaicTypes.Multipl_Choice) {
        //     return (
        //         <FractionText />
        //         // <Text style={[{ fontSize: pxToDp(40), color: '#4C4C59' }, appFont.fontFamily_jcyt_500]}>{topic_num_list[topicIndex]?.stem}</Text>

        //     );
        // }
        return <Stem my_style={style} data={currentTopic}></Stem>;
    };

    checkOption = (value) => {
        const { topicIndex, } = this.state;
        let topic_num_list = JSON.parse(JSON.stringify(this.state.topic_num_list));
        topic_num_list[topicIndex]._my_answer = value;
        this.setState({
            topic_num_list,
        });
    };

    chooseOption = (item) => {

        if (this.state.currentTopic?.correct !== -1) {
            return;
        }
        this.setState({
            currentOption: item.sort
        })
    }
    renderOptions = () => {
        const { currentTopic, currentOption } = this.state;
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
        const { token } = this.props
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return
        }
        const { topic_num_list, topicIndex, currentOption, currentTopic } = this.state;
        let topic = topic_num_list[topicIndex];
        let _topic_num_list = JSON.parse(JSON.stringify(topic_num_list));
        const { result, wrong_arr } = diagnosis(topic);
        // const result = currentOption === currentTopic.answer;
        console.log('submit---result----', result, topic)
        if (result) {
            PlayAudio.playSuccessSound(url.successAudiopath2)
            _topic_num_list[topicIndex].correct = 1;
            // topic_num_list[topicIndex].chooseItem = currentOption;
            _topic_num_list[topicIndex]._correct = 1;
            this.setState(
                {
                    topic_num_list: _topic_num_list,
                    isWrong: false,
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
            // topic_num_list[topicIndex].chooseItem = currentOption;
            _topic_num_list[topicIndex]._correct = 0;
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
                isWrong: true,
            }, () => {
                this.ScrollViewRef && this.ScrollViewRef.scrollToEnd()
                this.TopicNumsRef.clickItem(topic, topicIndex);
            });
        }
        // let answer = topic._my_answer ? topic._my_answer : "";
        // if (topic._show_keyBoard) {
        //     // 表示用了键盘的那一类题
        //     answer = JSON.stringify(topic.my_answer_tk_map);
        // }
        let answer = topic._my_answer ? topic._my_answer : "";
        let data = {
            origin: this.u_q_id,
            answer,
            level: currentTopic.level,
            correct: result ? 1 : 0,
            exercise_id: currentTopic.id
        };
        this.saveData(data);
        this.abilityInfo();
        // console.log("诊断结果_____________________________________", result);
    };

    saveData = (data) => {
        const { topic_num_list, topicIndex, currentOption, currentTopic } = this.state;
        // let topic = topic_num_list[topicIndex].topic;

        axios.post(api.save_answer, data).then((res) => {
            console.log("保存————————————————————————", res.data, data);
            if (data.correct === 1) {
                this.props.getRewardCoin()
                this.next()
                // getRewardCoinLastTopic().then(res => {
                //     if (res.isReward) {
                //         // 展示奖励弹框,在动画完后在弹统计框
                //         this.eventListener = DeviceEventEmitter.addListener(
                //             "rewardCoinClose",
                //             () => {
                //                 this.next()
                //                 this.eventListener && this.eventListener.remove()
                //             }
                //         );
                //     } else {
                //         this.next()
                //     }
                // })
            }
        });


        // axios.post(api.save_answer, data).then((res) => {

        //     console.log("诊断结果_______________tdst______________________qian", data, data.correct === 1)
        //     if (data.correct === 1) {
        //         this.props.getRewardCoin()
        //         console.log("诊断结果_______________tdst______________________hou", data, data.correct === 1)

        //     }
        // });
    };

    next = () => {
        const { topic_num_list, currentTopic, topicIndex } = this.state;
        let next_topicIndex = this.getTopicIndex();
        let index = topicIndex;
        index++;
        this.setState(
            {
                isWrong: false,
                topicIndex: index,
                currentOption: ''
            },
            () => {
                this.getData()
                // let item = topic_num_list[next_topicIndex];
                this.TopicNumsRef.nextIndex(index);
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
                currentTopic: _topic_num_list[topicIndex],
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

        // if (displayed_type_name === topaicTypes.Multipl_Choice) {
        //     return (
        //         <View style={{
        //             marginTop: pxToDp(12)
        //         }}>
        //             <Text style={[{ fontSize: pxToDp(36), color: '#16C792' }, appFont.fontFamily_jcyt_700]}>正确答案：{currentTopic.answer}</Text>
        //             <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>解析：</Text>
        //             <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59' }, appFont.fontFamily_jcyt_700]}>{currentTopic.explain}</Text>
        //         </View>
        //     );
        // }
        console.log('Explanation---', currentTopic)
        return (
            <Explanation
                data={currentTopic}
                my_style={style}

                correct={currentTopic.correct}
            ></Explanation>
        );
    };

    showdraft = () => {
        this.setState({
            draftVisible: true,
        });
    };

    skill_grade = (grade = 1) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= grade) {
                stars.push(
                    <Image
                        key={i}
                        style={styles.grade_img}
                        source={require('../../../../images/MathUnitDiagnosis/xing_active.png')}
                    />
                );
            }
        }
        return <View style={styles.xing_con}>{stars}</View>;
    }

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
            abilityInfo,
            showRule
            // showCorrectPrompt,
        } = this.state;
        const { displayed_type_name, _show_keyBoard, _show_options, _correct } =
            currentTopic;
        console.log("当前题目", currentTopic);
        const right_rate = 50;
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
                <Text style={[styles.header]} onLayout={(e) => this.onLayoutHeader(e)}>
                    {this.unitName}
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
                    {topic_num_list?.length === 0 ? (
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
                                {/* {isWrong &&
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
                                )} */}
                                {currentTopic ? (
                                    <>
                                        <View style={[styles.type]}>
                                            {this.skill_grade(currentTopic.level)}
                                            <Text style={[styles.type_txt]}>
                                                {currentTopic.knowledge_name}—{
                                                    currentTopic.knowledge_type === 0 ? '概念' : '程序'
                                                }
                                            </Text>
                                        </View>
                                        <ScrollView
                                            ref={(ref) => {
                                                this.ScrollViewRef = ref;
                                            }}
                                            contentContainerStyle={{
                                                paddingBottom: pxToDp(230),
                                                paddingRight: pxToDp(60),
                                            }}
                                        >
                                            <View style={[{ paddingRight: pxToDp(50), marginTop: pxToDp(20) }]}>
                                                {this.renderStem()}
                                            </View>
                                            {_show_options ? this.renderOptions() : null}
                                            {topic_num_list[topicIndex]?._correct !== -1 ? this.renderExplaination() : null}
                                            {/* {this.renderOptions()} */}
                                            {/* {+currentTopic?.correct !== -1 ? this.renderExplaination() : null} */}
                                        </ScrollView>
                                        {/* {isWrong || _correct !== -1 ? (
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
                                        )} */}
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
                {/* {_show_keyBoard && topic_num_list[topicIndex].correct === -1 ? (
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
                ) : null} */}
                {/* 双屏模式下不走作答应用题挖空题目的逻辑 */}
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
                        // confirm={this.confirm}
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
                                DeviceEventEmitter.emit("aiPlanDidExercise"); //返回页面刷新
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

                <View style={styles.bottom_btn}>
                    <View style={{
                        ...appStyle.flexTopLine,
                        ...appStyle.flexAliCenter
                    }}>
                        <View style={style.mask} ></View>
                        <View style={styles.left_bottom}>
                            {
                                abilityInfo.map((item, index) => {
                                    return <View style={{
                                        ...appStyle.flexTopLine,
                                        paddingRight: pxToDp(27 * 2)
                                    }}>
                                        <View style={[styles.circleWrap]}>
                                            <MyPie
                                                length={pxToDp(18)}
                                                width={72}
                                                percent={item.total_score / 100}
                                                color={
                                                    item.total_score > 80
                                                        ? "#00CC88"
                                                        : item.total_score > 60
                                                            ? "#FFAA5C"
                                                            : "#FF6680"
                                                }
                                            />

                                        </View>
                                        <View>
                                            <Text style={{
                                                fontSize: pxToDp(28 * 2),
                                                color: '#4C4C59',
                                                textAlign: 'center'
                                            }}>{item.total_score}%</Text>
                                            <Text style={{
                                                fontSize: pxToDp(28),
                                                color: '#9595A6'
                                            }}>{item.label}</Text>
                                        </View>
                                    </View>



                                })
                            }

                        </View>
                        <View style={styles.middle_bottom}>
                            {/* <TouchableOpacity onPress={() => this.setState({ showRule: !this.state.showRule })} style={[styles.rule_skill_con]}>
                                <Image style={{
                                    width: pxToDp(32),
                                    height: pxToDp(16 * 2),
                                    marginRight: pxToDp(8)
                                }} source={require('../../../../images/MathUnitDiagnosis/skill_exercise.png')} />
                                <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59', }, appFont.fontFamily_jcyt_500]}>统计</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={this.allDoExercise}>
                                <View
                                    style={[
                                        size_tool(78 * 2, 80),
                                        borderRadius_tool(200),
                                        {
                                            backgroundColor: "#E7E7F2",
                                            paddingBottom: pxToDp(8),
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                flex: 1,
                                                backgroundColor: "#F5F5FA"
                                            },
                                            borderRadius_tool(200),
                                            appStyle.flexCenter,
                                            appStyle.flexTopLine
                                        ]}
                                    >
                                        <Image style={{
                                            width: pxToDp(32),
                                            height: pxToDp(16 * 2),
                                            marginRight: pxToDp(8)
                                        }} source={require('../../../../images/MathUnitDiagnosis/skill_exercise.png')} />

                                        <Text
                                            style={[
                                                { fontSize: pxToDp(32), color: "#4C4C59" },
                                                appFont.fontFamily_jcyt_500,
                                            ]}
                                        >
                                            统计
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.allDoExercise}>
                                <View
                                    style={[
                                        size_tool(78 * 2, 80),
                                        borderRadius_tool(200),
                                        {
                                            backgroundColor: "#E7E7F2",
                                            paddingBottom: pxToDp(8),
                                            marginLeft: pxToDp(40)
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                flex: 1,
                                                backgroundColor: "#F5F5FA"
                                            },
                                            borderRadius_tool(200),
                                            appStyle.flexCenter,
                                            appStyle.flexTopLine
                                        ]}
                                    >
                                        <Image style={styles.rule_skill} source={require('../../../../images/MathUnitDiagnosis/rule_skill.png')} />
                                        <Text
                                            style={[
                                                { fontSize: pxToDp(32), color: "#4C4C59" },
                                                appFont.fontFamily_jcyt_500,
                                            ]}
                                        >
                                            规则
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => this.setState({ showRule: !this.state.showRule })} style={[styles.rule_skill_con, {
                                marginLeft: pxToDp(40)
                            }]}>
                                <Image style={styles.rule_skill} source={require('../../../../images/MathUnitDiagnosis/rule_skill.png')} />
                                <Text style={[{ fontSize: pxToDp(32), color: '#4C4C59', }, appFont.fontFamily_jcyt_500]}>规则</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    {
                        <View style={styles.right_bottom}>
                            {isWrong ? (
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
                            ) : this.state.currentTopic?._correct !== -1 ? null : (
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
                        </View>
                    }

                </View>


                {/* {showCorrectPrompt ? <CorrectPrompt></CorrectPrompt> : null} */}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? pxToDpHeight(10) : pxToDpHeight(40),
        paddingBottom: pxToDp(40),
    },
    header: {
        ...appFont.fontFamily_jcyt_700,
        textAlign: "center",
        fontSize: pxToDp(40),
        color: "#246666",
        marginBottom: pxToDp(10),
        height: pxToDp(100),
        lineHeight: pxToDp(100)
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
        backgroundColor: "#4C4C59",
        borderBottomLeftRadius: pxToDp(20),
        borderBottomRightRadius: pxToDp(20),
        height: pxToDp(26 * 2),
        // ...appStyle.flexCenter,
        alignItems: 'center',
        flexDirection: 'row'
    },
    type_txt: {
        color: "white",
        fontSize: pxToDp(24),
        ...appFont.fontFamily_jcyt_500,
        marginLeft: pxToDp(10)
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
        bottom: pxToDp(-40),
    },
    submit_btn_inner: {
        width: pxToDp(200),
        height: pxToDp(192),
        backgroundColor: "#00B295",
        borderRadius: pxToDp(100),
        ...appStyle.flexCenter,
    },
    arrow_btn_con: {
        width: '48%',
        height: pxToDp(116 * 2),
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20),
        marginTop: pxToDp(40),
        padding: pxToDp(4)
    },
    sort_con: {
        width: pxToDp(80),
        height: pxToDp(80),
        borderRadius: pxToDp(80),
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pxToDp(20)
    },
    arrow_btn: {
        width: '98%',
        height: pxToDp(200),
        borderRadius: pxToDp(40),
        backgroundColor: '#E7E7F2',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: pxToDp(8),
        marginTop: pxToDp(8),
        paddingLeft: pxToDp(20),
        // shadow 在上面
        shadowColor: '#E7E7F2',
        shadowOffset: { width: 0, height: pxToDp(-4) },
        shadowOpacity: 0.08,
        shadowRadius: pxToDp(8),
        elevation: pxToDp(6),
        zIndex: pxToDp(6),
        flexDirection: 'row'
        // marginRight: pxToDp(30)
    },
    border_active: {
        borderWidth: pxToDp(4),
        borderColor: "#FF935E",
    },
    bottom_btn: {
        width: '100%',
        height: pxToDp(240),
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        // shadowColor: '#E7E7F2',
        // shadowOffset: { width: 0, height: pxToDp(-4) },
        // shadowOpacity: 0.08,
        // shadowRadius: pxToDp(8),
        elevation: 10,
        zIndex: 10,
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        // alignContent: 'space-between',
        justifyContent: 'center',
        paddingHorizontal: pxToDp(80)
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: pxToDp(10),
        shadowColor: '#E7E7F2',
        shadowOffset: { width: 0, height: pxToDp(4) },
        shadowRadius: pxToDp(8),
        elevation: 5,
        zIndex: 5
    },
    left_bottom: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circleWrap: {
        backgroundColor: "transparent",
        borderWidth: pxToDp(4),
        borderColor: "#8B8BA2",
        justifyContent: "center",
        alignItems: "center",
        width: pxToDp(84),
        height: pxToDp(84),
        borderRadius: pxToDp(44),
        marginBottom: pxToDp(14),
        marginTop: pxToDp(20),
        marginRight: pxToDp(20)
    },
    rule_skill_con: {
        width: pxToDp(78 * 2),
        height: pxToDp(40 * 2),
        backgroundColor: '#F0F0FA',
        flexDirection: 'row',
        alignItems: 'center',
        // position: 'absolute',
        borderRadius: pxToDp(200),
        justifyContent: 'center',
        alignItems: 'center',
        // zIndex: 20,
        // elevation: 20,
        // top: pxToDp(24),
        // right: pxToDp(34 * 2)

    },
    rule_skill: {
        width: pxToDp(12 * 2),
        height: pxToDp(16 * 2),
        marginRight: pxToDp(8),
        // top: pxToDp(-2)
    },
    middle_bottom: {
        flexDirection: 'row'
    },
    xing_con: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: pxToDp(10)
    },
    grade_img: {
        width: pxToDp(44),
        height: pxToDp(44),
        marginRight: pxToDp(10)
    },
    right_bottom: {

    }
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        textCode: state.getIn(["bagMath", "textBookCode"])
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        },
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SkillDoExercise);
