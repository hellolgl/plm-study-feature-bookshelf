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
    AppState
} from "react-native";
import { appFont, appStyle, mathTopicStyle, mathFont } from "../../../../theme";
import { pxToDp, pxToDpHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import * as _ from "lodash";
import { changeTopicData } from "../../tools";
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
import ApplicationExplanation from "../../../../component/math/Topic/ApplicationExplanation";
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal";
import HelpModal from "../../../../component/math/Topic/HelpModal";
import CorrectPrompt from "../../../../component/math/Topic/CorrectPrompt";
import * as actionCreators from "../../../../action/math/language/index";
import * as actionCreatorsUserInfo from "../../../../action/userInfo";
import BackBtn from '../../../../component/math/BackBtn'
import PlayAudio from "../../../../util/audio/playAudio";
import url from "../../../../util/url";
import Lottie from 'lottie-react-native';
import AiTalkModal from "../../../../component/AiTalk/Modal";
import * as actionAiTalk from "../../../../action/aiTalk/index";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let style = mathTopicStyle["2"];

class PracticeDoExercise extends PureComponent {
    constructor(props) {
        super(props);
        this.optionRef = null;
        this.Keyboard = null;
        this.TopicStemTk = null;
        this.FranctionInputView = null;
        this.CalculationStem = null;
        this.ApplicationStem = null;
        this.submitThrottle = _.debounce(this.submit, 300);
        this.origin = this.props.navigation.state.params.data.origin;
        this.module_type = ''
        this.knowledge_code = ''
        this.exercise_id = ''
        this.messageData = {}
        this.wrongNum = 0
        this.lottieRef = React.createRef();
        this.state = {
            currentTopic: "",
            clickFraction: false,
            tk_space_key: "",
            draftVisible: false,
            helpVisible: false,
            keyboard_y: 0,
            keyboard_height: 0,
            // showCorrectPrompt: false,
            showApplicationFillBlank: false,
            element_name: '',
            visible: false,
            total_score: 0,
            topicScore: '',
            ability: '',
            ability_score: 0,
            showRobotEye: false,
            showAI: false,
            aiVisible: false,
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getData();
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit("practiceHomePage");
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

    getData = () => {
        const userInfo = this.props.userInfo.toJS();
        const params = {
            origin: this.origin,
            grade_code: userInfo.checkGrade,
            term_code: userInfo.checkTeam,
            textbook: this.props.textCode
        }
        axios.get(api.getPracticeElementExercise, { params }).then(res => {
            this.messageData = { ...res.data.data }
            this.setState({
                element_name: res.data.data.element_name,
                total_score: res.data.data.total_score,
                ability: res.data.data.ability,
                ability_score: res.data.data.ability_score,
            })
            this.getTopic()
        })
    };

    getTopic = () => {
        const { module_type, exercise_id } = this.messageData
        let service = undefined
        let params = {}
        if (module_type === 'sync') {
            params = {
                m_e_s_id: exercise_id
            }
            service = api.getMathSyncDiagnosisErrDetails
        } else {
            params = {
                ex_id: exercise_id
            }
            service = api.getMathElementErrDetails
        }
        axios.get(service, { params }).then(res => {
            let currentTopic = changeTopicData(_.cloneDeep(res.data.data));
            if (module_type === 'element') {
                currentTopic = changeTopicData(_.cloneDeep(res.data.data.zh), 'KnowledgeGraph')
            }
            currentTopic._correct = -1 // correct 0 错 1对 -1没做
            currentTopic.m_e_s_id = Date.now() //再练一次填空题重置写不一样的id，但保存不使用
            this.setState({
                currentTopic
            }, () => {
                this.setShowAI()
            })
        })
    }

    setShowAI = () => {
        const { showAI, currentTopic } = this.state;
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
        let currentTopic = _.cloneDeep(this.state.currentTopic)
        currentTopic.my_answer_tk_map = value;
        this.setState({
            currentTopic
        });
    };

    renderStem = () => {
        const { currentTopic } = this.state;
        const { displayed_type_name } = currentTopic;
        let correct = currentTopic._correct;
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
        let currentTopic = _.cloneDeep(this.state.currentTopic)
        currentTopic._my_answer = value;
        this.setState({
            currentTopic,
        });
    };

    renderOptions = () => {
        const { currentTopic } = this.state;
        return (
            <OptionView
                data={currentTopic}
                checkOption={this.checkOption}
                onRef={(ref) => {
                    this.optionRef = ref;
                }}
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
            this.setState({
                clickFraction: !clickFraction,
            }, () => {
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
        if (currentTopic.displayed_type_name === topaicTypes.Application_Questions) {
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
        this.setState({
            topicScore: ''
        })
        let topic = _.cloneDeep(this.state.currentTopic)
        let answer = topic._my_answer ? topic._my_answer : "";
        if (topic._show_keyBoard) {
            // 表示用了键盘的那一类题
            answer = JSON.stringify(topic.my_answer_tk_map);
        }
        topic._show_keyBoard = false
        const { result, wrong_arr } = diagnosis(topic);
        console.log("诊断结果_____________________________________", result);
        if (result) {
            PlayAudio.playSuccessSound(url.successAudiopath2)
            topic._correct = 1;
            this.setState({
                currentTopic: topic,
                // showCorrectPrompt: true,
            },
                () => {
                    // setTimeout(() => {
                    //     this.setState({
                    //         showCorrectPrompt: false,
                    //     });

                    // }, 1000);
                })
            this.wrongNum = 0
        } else {
            PlayAudio.playSuccessSound(url.failAudiopath)
            topic._correct = 0;
            if (wrong_arr) {
                this.setState({
                    currentTopic: "",
                });
                // 填空题答案回显
                let my_answer_tk_map = topic.my_answer_tk_map;
                wrong_arr.forEach((i, x) => {
                    my_answer_tk_map[i].isWrong = true;
                });
                topic.my_answer_tk_map = my_answer_tk_map;
            }
            this.setState({
                currentTopic: topic, //设置题目是为了错误回显
            });
            if (topic.displayed_type_name === topaicTypes.Application_Questions) {
                this.setState({
                    showApplicationFillBlank: true
                })
            }
            this.wrongNum += 1
        }
        this.saveData(result);
    };

    next = () => {
        this.setState({
            currentTopic: '',
        })
        this.getData()
    }

    saveData = (result) => {
        const userInfo = this.props.userInfo.toJS();
        const data = {
            origin: this.origin,
            grade_code: userInfo.checkGrade,
            term_code: userInfo.checkTeam,
            textbook: this.props.textCode,
            knowledge_code: this.messageData.knowledge_code,
            level: this.messageData.level,
            correct: result ? 1 : 0,
            exercise_id: this.messageData.exercise_id
        }
        // console.log('保存参数::::::::::::',data)
        axios.post(api.savePracticeElementExercise, data).then((res) => {
            console.log("保存————————————————————————", res.data.data);
            let increment = res.data.data.increment
            if (parseInt(increment) > 0) increment = '+' + increment
            const { ability, ability_score } = res.data.data
            this.setState({
                topicScore: increment,
                total_score: res.data.data.total_score,
                ability: ability,
                ability_score: ability_score,
            })
            this.props.getRewardCoin()
            if (result) {
                this.next()
            }
        })
    };

    confirm = (value) => {
        const { tk_space_key, currentTopic } = this.state;
        let topic = _.cloneDeep(currentTopic)
        if (value[2]) {
            // 带分数
            if (
                value[0].init_char_mat.length !== 0 ||
                value[1].init_char_mat.length !== 0 ||
                value[2].init_char_mat.length !== 0
            ) {
                topic.my_answer_tk_map[tk_space_key] = value;
                topic.my_answer_tk_map[tk_space_key].isFraction = true;
            } else {
                topic.my_answer_tk_map[tk_space_key] = {
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
                topic.my_answer_tk_map[tk_space_key] = value;
                topic.my_answer_tk_map[tk_space_key].isFraction = true;
            } else {
                topic.my_answer_tk_map[tk_space_key] = {
                    init_char_mat: [],
                    cursor_idx: -1,
                };
            }
        }
        this.setState({
            currentTopic: topic,
            clickFraction: false,
        }, () => {
            if (topic.displayed_type_name === topaicTypes.Fill_Blank) {
                this.TopicStemTk.setInitdata(
                    topic.my_answer_tk_map
                ); //分数答案时，点击分数在分数输入组件的数据回显
            }
            if (topic.displayed_type_name === topaicTypes.Calculation_Problem) {
                this.CalculationStem.setInitdata(
                    topic.my_answer_tk_map
                ); //分数答案时，点击分数在分数输入组件的数据回显
            }
            if (topic.displayed_type_name === topaicTypes.Application_Questions) {
                this.ApplicationStem.setInitdata(
                    topic.my_answer_tk_map
                ); //分数答案时，点击分数在分数输入组件的数据回显
            }
        }
        );
    };

    renderExplaination = () => {
        const { currentTopic } = this.state;
        const { displayed_type_name, _correct } = currentTopic;
        if (displayed_type_name === topaicTypes.Application_Questions) {
            return (
                <ApplicationExplanation
                    my_style={style}
                    data={currentTopic}
                    correct={_correct}
                ></ApplicationExplanation>
            );
        }
        return (
            <Explanation
                data={currentTopic}
                my_style={style}
                correct={_correct}
            ></Explanation>
        );
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
            currentTopic,
            clickFraction,
            draftVisible,
            helpVisible,
            keyboard_y,
            keyboard_height,
            // showCorrectPrompt,
            showApplicationFillBlank,
            element_name,
            visible,
            total_score,
            topicScore,
            ability,
            ability_score,
            showAI,
            showRobotEye,
            aiVisible,
        } = this.state;
        const { displayed_type_name, _show_keyBoard, _show_options, _correct, problem_solving } = currentTopic;
        console.log("当前题目", currentTopic);
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <BackBtn goBack={this.goBack}></BackBtn>
                <View style={[appStyle.flexCenter, { height: Platform.OS === 'android' ? pxToDp(130) : pxToDp(160) }]}>
                    <Text style={[{ color: "#246666", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{element_name}</Text>
                </View>
                <TouchableOpacity style={[styles.scoreWrap, appStyle.flexLine]}>
                    <Text style={[{ color: '#4C4C59', fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>共计得分：{total_score}分</Text>
                    {topicScore ? <View style={[{ marginLeft: pxToDp(16) }, appStyle.flexLine]}>
                        <View style={[styles.triangle]}></View>
                        <View style={[styles.numWrap, appStyle.flexCenter]}>
                            <Text style={[{ fontSize: pxToDp(28), color: parseInt(topicScore) > 0 ? '#00B295' : '#FF6262' }, appFont.fontFamily_jcyt_700]}>{topicScore}</Text>
                        </View>
                    </View> : null}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.caogao_btn]} onPress={() => {
                    this.setState({
                        draftVisible: true
                    })
                }}>
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
                            { position: "absolute", right: pxToDp(100), top: pxToDp(20), zIndex: 1 },
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
                            // console.log("click here...: ", currentTopic);
                            this.props.chat({
                                knowledge_name: element_name,
                                exercise_stem: stem,
                            });
                            this.setState({
                                aiVisible: true,
                            });
                        }}
                    >
                        <Lottie
                            ref={this.lottieRef}
                            source={require("../aiGiveExercise/lottie/robot1.json")}
                            onAnimationFinish={() => {
                                this.setState({
                                    showRobotEye: true,
                                });
                            }}
                            autoPlay
                            loop={false}
                            style={[
                                Platform.OS === "android"
                                    ? { width: pxToDp(220), height: pxToDp(220) }
                                    : { width: pxToDp(320), height: pxToDp(240) },
                            ]}
                        />
                        {showRobotEye ? (
                            <View
                                style={[
                                    { position: "absolute" },
                                    Platform.OS === "android"
                                        ? { top: pxToDp(126), left: pxToDp(55) }
                                        : { top: pxToDp(134), left: pxToDp(58) },
                                ]}
                            >
                                <Lottie
                                    source={require("../aiGiveExercise/lottie/robot2.json")}
                                    autoPlay
                                    style={[
                                        Platform.OS === "android"
                                            ? { width: pxToDp(52), height: pxToDp(52) }
                                            : { width: pxToDp(56), height: pxToDp(56) },
                                    ]}
                                />
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ) : null}
                <View style={[styles.content]}>
                    {!currentTopic ? <View
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "40%",
                        }}
                    >
                        <ActivityIndicator size={"large"} color={"#999999"} />
                    </View> : <>
                        <View
                            style={[
                                styles.content_inner,
                                {
                                    paddingBottom: _show_keyBoard ? keyboard_height : pxToDp(36),
                                },
                                appStyle.flexJusBetween,
                            ]}
                        >
                            {_correct === 0 && displayed_type_name === topaicTypes.Application_Questions || !problem_solving ? null : <TouchableOpacity
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
                            </TouchableOpacity>}
                            {currentTopic ? <>
                                <View style={[styles.type, appStyle.flexLine]}>
                                    {ability ? <View style={[appStyle.flexLine]}>
                                        <View style={[styles.abilityScoreWrap, appStyle.flexCenter]}>
                                            <Text style={[{ color: "#fff", fontSize: pxToDp(20) }, appFont.fontFamily_jcyt_700]}>{ability_score}分</Text>
                                        </View>
                                        <Text style={[styles.type_txt]}>{ability} -- </Text>
                                    </View> : null}
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
                                    <View style={[{ paddingRight: pxToDp(50), marginTop: pxToDp(20) }]}>
                                        {this.renderStem()}
                                    </View>
                                    {_show_options ? this.renderOptions() : null}
                                    {_correct === 0 ? this.renderExplaination() : null}
                                </ScrollView>
                                {_show_keyBoard ? null : _correct === -1 ? <TouchableOpacity
                                    style={[styles.submit_btn]}
                                    onPress={this.submitThrottle}
                                >
                                    <View style={[styles.submit_btn_inner]}>
                                        <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>
                                            提交
                                        </Text>
                                    </View>
                                </TouchableOpacity> : <TouchableOpacity
                                    style={[styles.submit_btn]}
                                    onPress={() => {
                                        if (this.wrongNum === 5) {
                                            this.setState({
                                                visible: true
                                            })
                                        } else {
                                            this.next()
                                        }
                                    }}
                                >
                                    <View style={[styles.submit_btn_inner]}>
                                        <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>
                                            下一题
                                        </Text>
                                    </View>
                                </TouchableOpacity>}
                            </> : null}
                        </View>
                    </>}
                </View>
                {_show_keyBoard ? <View
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
                </View> : null}
                {showApplicationFillBlank && displayed_type_name === topaicTypes.Application_Questions ? (
                    <View
                        style={[
                            styles.explanation_wrap,
                            {
                                height: windowHeight - pxToDp(170),
                                paddingLeft: pxToDp(0),
                                paddingRight: pxToDp(0),
                            },
                        ]}
                    >
                        <ApplicationFillBlank
                            my_style={style}
                            data={currentTopic}
                            toNext={() => {
                                this.setState({
                                    showApplicationFillBlank: false
                                }, () => {
                                    this.next()
                                })
                            }}
                        ></ApplicationFillBlank>
                    </View>
                ) : null}
                {clickFraction ? <FranctionInputView
                    onRef={(ref) => {
                        this.FranctionInputView = ref;
                    }}
                    confirm={this.confirm}
                    top={keyboard_y}
                    close={() => {
                        this.setState({ clickFraction: false });
                    }}
                ></FranctionInputView> : null}
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visible}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <View style={[styles.mContainer]}>
                        <View style={[styles.mContent]}>
                            <View style={[styles.mContentInner, appStyle.flexAliCenter]}>
                                <Text style={[{ color: "#4C4C59", fontSize: pxToDp(48), marginBottom: Platform.OS === 'ios' ? pxToDp(56) : pxToDp(30) }, appFont.fontFamily_jcyt_700]}>温馨提示</Text>
                                <Text style={[{ color: "#4C4C59", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500]}>作答质量不佳哦，要继续答题吗？</Text>
                                <View style={[appStyle.flexLine, { marginTop: pxToDp(56) }]}>
                                    <TouchableOpacity style={[styles.mBtn, { marginRight: pxToDp(52) }]} onPress={() => {
                                        this.setState({
                                            visible: false
                                        }, () => {
                                            this.goBack()
                                        })
                                    }}>
                                        <View style={[styles.mBtnInner]}>
                                            <Text style={[{ color: "#fff", fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>关闭</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.mBtn]} onPress={() => {
                                        this.setState({
                                            visible: false
                                        }, () => {
                                            this.wrongNum = 0
                                            this.next()
                                        })
                                    }}>
                                        <View style={[styles.mBtnInner]}>
                                            <Text style={[{ color: "#fff", fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>继续作答</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        paddingBottom: pxToDp(40),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
    },
    content: {
        flex: 1,
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
    scoreWrap: {
        position: "absolute",
        top: Platform.OS === "android" ? pxToDp(20) : pxToDp(40),
        right: pxToDp(180),
        height: pxToDp(76),
        backgroundColor: "#FFD146",
        borderRadius: pxToDp(100),
        borderWidth: pxToDp(4),
        borderColor: '#FFA800',
        paddingLeft: pxToDp(32),
        paddingRight: pxToDp(32)
    },
    numWrap: {
        minWidth: pxToDp(80),
        height: pxToDp(60),
        paddingLeft: pxToDp(12),
        paddingRight: pxToDp(12),
        borderRadius: pxToDp(54),
        backgroundColor: "#fff"
    },
    triangle: {
        width: 0,
        height: 0,
        borderWidth: pxToDp(10),
        borderTopColor: 'transparent',
        borderLeftColor: "transparent",
        borderBottomColor: 'transparent',
        borderRightColor: "#fff",
        marginRight: pxToDp(-3)
    },
    type: {
        position: "absolute",
        top: 0,
        left: pxToDp(114),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
        backgroundColor: "#FFD146",
        borderBottomLeftRadius: pxToDp(20),
        borderBottomRightRadius: pxToDp(20),
        height: pxToDp(56),
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
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    mContent: {
        width: pxToDp(1011),
        borderRadius: pxToDp(40),
        backgroundColor: "#DAE2F2",
        ...appStyle.flexAliCenter,
        paddingBottom: pxToDp(8)
    },
    mContentInner: {
        width: "100%",
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(30)
    },
    mBtn: {
        width: pxToDp(400),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        paddingBottom: pxToDp(6),
        backgroundColor: "#00836D"
    },
    mBtnInner: {
        width: "100%",
        flex: 1,
        backgroundColor: '#00B295',
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter
    },
    abilityScoreWrap: {
        minWidth: pxToDp(54),
        paddingLeft: pxToDp(6),
        paddingRight: pxToDp(6),
        backgroundColor: "#FFAA21",
        borderRadius: pxToDp(46),
        marginRight: pxToDp(12)
    }
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
            dispatch(actionAiTalk.chat(data));
        },
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        },
        getRewardCoin() {
            dispatch(actionCreatorsUserInfo.getRewardCoin());
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(PracticeDoExercise);
