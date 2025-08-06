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
import * as actionBagSyncDiagnosis from "../../../../action/math/bagSyncDiagnosis";
import chinese from "../../../../util/languageConfig/chinese";
import english from "../../../../util/languageConfig/english";
import BackBtn from '../../../../component/math/BackBtn'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
let style = mathTopicStyle["2"];

class DoWrongExercise extends PureComponent {
    constructor(props) {
        super(props);
        // console.log('==========',this.props.navigation.state.params.data)
        this.optionRef = null;
        this.Keyboard = null;
        this.TopicStemTk = null;
        this.FranctionInputView = null;
        this.CalculationStem = null;
        this.ApplicationStem = null;
        this.submitThrottle = _.debounce(this.submit, 300);
        this.m_e_s_id = this.props.navigation.state.params.data.m_e_s_id;
        this.s_w_id = this.props.navigation.state.params.data.s_w_id;
        this.ex_id = this.props.navigation.state.params.data.ex_id;
        this.e_w_id = this.props.navigation.state.params.data.e_w_id;
        this.e_s_id = this.props.navigation.state.params.data.e_s_id;
        this.exercise_id = this.props.navigation.state.params.data.exercise_id;
        this.module_type = this.props.navigation.state.params.data.module_type;
        this.title = this.props.navigation.state.params.data.title;
        this.key = this.props.navigation.state.params.data.key;
        this.state = {
            currentTopic: "",
            clickFraction: false,
            tk_space_key: "",
            draftVisible: false,
            helpVisible: false,
            keyboard_y: 0,
            keyboard_height: 0,
            showCorrectPrompt: false,
            originTopic: {},
            showApplicationFillBlank: false
        };
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        let service = undefined
        let params = {}
        let key = this.key
        if (key === 'math_mathTongbuHomePage') {
            // 同步
            params = {
                m_e_s_id: this.m_e_s_id
            }
            service = api.getMathSyncDiagnosisErrDetails
        }
        if (key === 'math_AIPractice') {
            if (this.module_type === 'sync') {
                params = {
                    m_e_s_id: this.exercise_id
                }
                service = api.getMathSyncDiagnosisErrDetails
            } else {
                params = {
                    ex_id: this.exercise_id
                }
                service = api.getMathElementErrDetails
            }
        }
        if (key === 'math_knowledgeGraph') {
            params = {
                ex_id: this.ex_id
            }
            service = api.getMathElementErrDetails
        }
        axios.get(service, { params }).then(res => {
            let currentTopic = changeTopicData(_.cloneDeep(res.data.data));
            let originTopic = res.data.data
            if (key === 'math_knowledgeGraph' || (key === 'math_AIPractice' && this.module_type === 'element')) {
                currentTopic = changeTopicData(_.cloneDeep(res.data.data.zh), 'KnowledgeGraph')
                originTopic = res.data.data.zh
            }
            currentTopic._correct = -1 // correct 0 错 1对 -1没做
            currentTopic.m_e_s_id = Date.now() //再练一次填空题重置写不一样的id，但保存不使用
            this.setState({
                currentTopic,
                originTopic
            })
        })
    };

    tryAgain = () => {
        const { originTopic } = this.state
        this.setState({
            currentTopic: ''
        })
        this.optionRef?.initOption();
        let module = undefined
        if (this.key === 'math_knowledgeGraph' || (this.key === 'math_AIPractice' && this.module_type === 'element')) {
            module = 'KnowledgeGraph'
        }
        let topic = changeTopicData(_.cloneDeep(originTopic), module)
        topic._correct = -1
        topic.m_e_s_id = Date.now() //再练一次填空题重置写不一样的id，但保存不使用
        this.setState({
            currentTopic: topic
        })
    }

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
            topic._correct = 1;
            this.setState({
                currentTopic: topic,
                showCorrectPrompt: true,
            },
                () => {
                    setTimeout(() => {
                        this.setState({
                            showCorrectPrompt: false,
                        });
                    }, 1000);
                })
            this.saveData();
        } else {
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
        }
    };

    saveData = () => {
        let service = undefined
        let data = {}
        let key = this.key
        if (key === 'math_mathTongbuHomePage') {
            data = {
                s_w_id: this.s_w_id
            };
            service = api.saveMathSyncDiagnosisErr
        }
        if (key === 'math_AIPractice') {
            data = {
                e_s_id: this.e_s_id
            };
            service = api.saveMathAIPracticeErr
        }
        if (key === 'math_knowledgeGraph') {
            data = {
                e_w_id: this.e_w_id
            }
            service = api.saveMathElementErr
        }
        console.log('保存参数::::::::::::', data)
        axios.post(service, data).then((res) => {
            console.log("保存————————————————————————", res.data);
            if (res.data.err_code === 0) {
                DeviceEventEmitter.emit("refreshWrongPage");
            }
        });
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
            showCorrectPrompt,
            showApplicationFillBlank
        } = this.state;
        const { displayed_type_name, _show_keyBoard, _show_options, _correct } = currentTopic;
        console.log("当前题目", currentTopic);
        return (
            <ImageBackground
                style={[styles.container]}
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
            >
                <BackBtn goBack={this.goBack}></BackBtn>
                <View style={[appStyle.flexCenter, { height: Platform.OS === 'android' ? pxToDp(130) : pxToDp(160) }]}>
                    <Text style={[{ color: "#246666", fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_700]}>{this.title}</Text>
                </View>
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
                            {_correct === 0 && displayed_type_name === topaicTypes.Application_Questions ? null : <TouchableOpacity
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
                                    <View style={[{ paddingRight: pxToDp(50), marginTop: pxToDp(20) }]}>
                                        {this.renderStem()}
                                    </View>
                                    {_show_options ? this.renderOptions() : null}
                                    {_correct !== -1 ? this.renderExplaination() : null}
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
                                    onPress={this.tryAgain}
                                >
                                    <View style={[styles.submit_btn_inner]}>
                                        <Text style={[mathFont.txt_32_700, mathFont.txt_fff]}>
                                            再练一次
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
                            doWrong={true}
                            tryAgain={() => {
                                this.setState({
                                    showApplicationFillBlank: false
                                })
                            }}
                            toNext={() => {
                                this.setState({
                                    showApplicationFillBlank: false
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
                {showCorrectPrompt ? <CorrectPrompt></CorrectPrompt> : null}
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
    };
};

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise);
