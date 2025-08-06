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
    DeviceEventEmitter,
} from "react-native";
import _ from "lodash";
import Tts from "react-native-tts";
import { connect } from "react-redux";
import { appFont, appStyle, mathFont } from "../../../../theme";
import { pxToDp } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import RichShowViewHtml from "../../../../component/math/RichShowViewHtml";
import Lottie from "lottie-react-native";
import chinese from "../../../../util/languageConfig/chinese";
import english from "../../../../util/languageConfig/english";
import * as actionMathLanguage from "../../../../action/math/language/index";
import * as actionBagSyncDiagnosis from "../../../../action/math/bagSyncDiagnosis";
import BackBtn from "../../../../component/math/BackBtn";
import * as actionTts from '../../../../action/tts'
class KnowledgeGraphPage extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined;
        this.state = {
            knowledge_details: {},
            page_data: {},
            language_data: {},
            status: this.props.navigation.state.params.data.status,
            has_exercise: "",
            playing: false,
            ttsContent: ""
        };
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        let language_data = props.language_data.toJS();
        const { main_language_map, other_language_map, type } = language_data;
        if (type !== tempState.language_data.type) {
            console.log("切换语言", language_data);
            let page_base_data = {
                back_z: main_language_map.back,
                back_c: other_language_map.back,
                shijianxian_z: main_language_map.shijianxian,
                shijianxian_c: other_language_map.shijianxian,
                zsdjiangjie_z: main_language_map.zsdjiangjie,
                zsdjiangjie_c: other_language_map.zsdjiangjie,
                practice_z: main_language_map.practice,
                practice_c: other_language_map.practice,
                program_z: main_language_map.program,
                program_c: other_language_map.program,
                _z: main_language_map.practice,
                expand_z: main_language_map.expand,
                expand_c: other_language_map.expand,
            };
            tempState.page_data = { ...page_base_data };
            tempState.language_data = JSON.parse(JSON.stringify(language_data));
            return tempState;
        }
        return null;
    }

    componentDidMount() {
        this.getData();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshStatus",
            () => {
                this.getData();
            }
        );
    }

    componentWillUnmount() {
        if (this.props.toKnowledge) {
            // toKnowledge是同步诊断进知识图谱的标识
            const language_data = {
                show_main: true,
                show_translate: true,
                main_language_map: chinese,
                other_language_map: english,
                show_type: "1",
                type: 1,
                main_language: "zh",
                other_language: "en",
                label: "中英双语",
                trans_language: "en",
            };
            this.props.setLanguageData(language_data); //从同步进知识图谱退出后强行切换语言到中英双语
            this.props.setToKnowledge(false);
        }

        this.stopTts();
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove();
    }

    togglePlaying = () => {
        const { playing, ttsContent } = this.state;
        if (!this.props.statusData.canUse) {
            this.props.setShowTips(true)
            return
        }
        if (!playing && ttsContent !== "") {
            Tts.speak(ttsContent);
        } else {
            Tts.stop();
        }
        this.setState({
            playing: !playing,
        });
    };

    getData = () => {
        const { knowledge_code, knowledge_name, language_knowledge_name } =
            this.props.navigation.state.params.data;
        const { language_data } = this.state;
        const { show_type } = language_data;
        const { page_data } = this.state;
        let params = {
            language: language_data.trans_language,
            knowledge_code,
        };
        axios.get(api.getMathKGElementExplain, { params }).then((res) => {
            console.log("ExplainPage res", res.data.data);
            let data = res.data.data;
            let page_variable_data = {};
            if (show_type === "1") {
                // 中文为主
                page_variable_data = {
                    knowledge_explain_z: data.knowledge_explain,
                    knowledge_explain_c: data.language_knowledge_explain,
                    element_name_z: knowledge_name,
                    element_name_c: language_knowledge_name,
                };
            }
            if (show_type === "2") {
                // 英文为主
                page_variable_data = {
                    knowledge_explain_z: data.language_knowledge_explain,
                    knowledge_explain_c: data.knowledge_explain,
                    element_name_z: language_knowledge_name,
                    element_name_c: knowledge_name,
                };
            }
            this.setState(() => ({
                knowledge_details: data,
                status: data.status,
                page_data: {
                    ...page_data,
                    ...page_variable_data,
                },
                has_exercise: res.data.data.has_exercise,
            }));
        });
    };

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    seeTime = () => {
        const { knowledge_details } = this.state
        const { swiperIndex, current_unit } = this.props.navigation.state.params.data
        NavigationUtil.toMathKnowProgress({
            ...this.props,
            data: {
                knowledge_code: knowledge_details.knowledge_code,
                swiperIndex,
                current_unit
            },
        });
    };

    stopTts = () => {
        Tts.stop();
        this.setState({
            playing: false,
        });
    };

    toPractice = () => {
        const { status } = this.state;
        let data = this.props.navigation.state.params.data;
        data.status = status;
        this.stopTts();
        NavigationUtil.toKnowledgeGraphExplainDoExercise({
            ...this.props,
            data: { ...data },
        });
    };

    toExpand = () => {
        this.stopTts();
        NavigationUtil.toMathKnowCharts({
            navigation: this.props.navigation,
            data: {
                knowledge_name: this.props.navigation.state.params.data.knowledge_name
            },
        });
    }

    toProgram = () => {
        const { status } = this.state;
        let data = this.props.navigation.state.params.data;
        data.status = status;
        this.stopTts();
        NavigationUtil.toMathProgramExercise({ ...this.props, data: { ...data } });
    };
    stripAndInsert = (html) => {
        console.log("html: ", html);
        if (_.isEmpty(html)) {
            return "";
        }
        let result = html.replace(/\+/g, "加");
        result = result.replace(/-/g, "减");
        result = result.replace(/\*/g, "乘");
        result = result.replace(/×/g, "乘");
        result = result.replace(/x/g, "乘");
        result = result.replace(/\//g, "除");
        result = result.replace(/÷/g, "除");
        result = result.replace(/=/g, "等于");
        result = result.replace(/<img[^>]+>/g, "如图所示。");
        result = result.replace(/<[^>]+>/g, "");
        result = result.replaceAll("&nbsp;", "");
        this.setState({
            ttsContent: result,
        });
    };

    render() {
        const {
            page_data,
            language_data,
            knowledge_details,
            has_exercise,
            playing
        } = this.state;
        const {
            shijianxian_z,
            shijianxian_c,
            zsdjiangjie_z,
            zsdjiangjie_c,
            practice_z,
            practice_c,
            knowledge_explain_z,
            knowledge_explain_c,
            element_name_z,
            element_name_c,
            program_z,
            program_c,
            expand_c,
            expand_z
        } = page_data;
        const { show_main, show_translate } = language_data;
        this.stripAndInsert(_.get(knowledge_details, "knowledge_explain", ""));

        return (
            <ImageBackground
                source={require("../../../../images/MathSyncDiagnosis/bg_1.png")}
                style={styles.container}
            >
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack} style={{ left: 0 }}></BackBtn>
                    <View style={[appStyle.flexAliCenter]}>
                        {show_main ? (
                            <Text
                                style={[
                                    mathFont.txt_32_700,
                                    mathFont.txt_4C4C59,
                                    {
                                        marginBottom:
                                            Platform.OS === "ios" ? pxToDp(6) : pxToDp(-10),
                                    },
                                ]}
                            >
                                {element_name_z}
                            </Text>
                        ) : null}
                        {show_translate ? (
                            <Text
                                style={[
                                    mathFont.txt_24_500,
                                    mathFont.txt_A5A5AC,
                                    { lineHeight: pxToDp(34) },
                                ]}
                            >
                                {element_name_c}
                            </Text>
                        ) : null}
                    </View>
                    {this.props.navigation.state.params.data.noExercise ? null : (
                        <TouchableOpacity style={[styles.time_btn]} onPress={this.seeTime}>
                            <Image
                                style={{ width: pxToDp(40), height: pxToDp(40) }}
                                source={require("../../../../images/MathKnowledgeGraph/his_icon_1.png")}
                            ></Image>
                            {show_main ? (
                                <Text
                                    style={[
                                        mathFont.txt_32_700,
                                        mathFont.txt_4C4C59,
                                        { marginLeft: pxToDp(8), marginRight: pxToDp(8) },
                                    ]}
                                >
                                    {shijianxian_z}
                                </Text>
                            ) : null}
                            {show_translate ? (
                                <Text style={[mathFont.txt_24_500, mathFont.txt_4C4C59]}>
                                    {shijianxian_c}
                                </Text>
                            ) : null}
                        </TouchableOpacity>
                    )}
                </View>
                <View style={[styles.content]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.togglePlaying();
                        }}
                        style={{
                            width: 100,
                            height: 100,
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            zIndex: 2,
                            left: pxToDp(30),
                        }}
                    >
                        <View>
                            <Lottie
                                source={
                                    playing
                                        ? require("./lottieJson/audioPlay.json")
                                        : require("./lottieJson/audioHang.json")
                                }
                                autoPlay
                                loop={true}
                                style={[{ width: pxToDp(250), height: pxToDp(250) }]}
                            />
                        </View>
                    </TouchableOpacity>
                    <ScrollView
                        contentContainerStyle={{
                            paddingLeft: pxToDp(264),
                            paddingRight: pxToDp(264),
                            paddingBottom: pxToDp(180),
                        }}
                    >
                        <View style={{ marginBottom: pxToDp(40) }}>
                            {show_main ? (
                                <Text
                                    style={[
                                        mathFont.txt_48_700,
                                        mathFont.txt_4C4C59,
                                        {
                                            marginBottom:
                                                Platform.OS === "android" ? pxToDp(-20) : pxToDp(10),
                                        },
                                    ]}
                                >
                                    {zsdjiangjie_z}：
                                </Text>
                            ) : null}
                            {show_translate ? (
                                <Text style={[mathFont.txt_24_500, mathFont.txt_A5A5AC]}>
                                    {zsdjiangjie_c}：
                                </Text>
                            ) : null}
                        </View>
                        {knowledge_details.knowledge_explain ? (
                            <>
                                {show_main ? (
                                    <RichShowViewHtml
                                        value={knowledge_explain_z}
                                        fontFamily={"JiangChengYuanTi-700W"}
                                        p_style={{ lineHeight: pxToDp(70) }}
                                        size={36}
                                        color={"#4C4C59"}
                                    ></RichShowViewHtml>
                                ) : null}
                                {show_translate ? (
                                    <View style={{ marginTop: pxToDp(80) }}>
                                        <RichShowViewHtml
                                            value={knowledge_explain_c}
                                            p_style={{ lineHeight: pxToDp(60) }}
                                            size={28}
                                            color={'rgba(76, 76, 89, 0.50)",'}
                                        ></RichShowViewHtml>
                                    </View>
                                ) : null}
                            </>
                        ) : null}
                    </ScrollView>
                </View>
                {has_exercise === "1" ? (
                    <TouchableOpacity
                        style={[styles.practice_btn, { bottom: pxToDp(210) }]}
                        onPress={this.toProgram}
                    >
                        <ImageBackground
                            style={[
                                { width: pxToDp(200), height: pxToDp(200) },
                                appStyle.flexCenter,
                            ]}
                            resizeMode="stretch"
                            source={require("../../../../images/MathKnowledgeGraph/btn_bg_2.png")}
                        >
                            {show_main ? (
                                <Text
                                    style={[
                                        mathFont.txt_32_700,
                                        mathFont.txt_fff,
                                        {
                                            marginBottom:
                                                Platform.OS === "android" ? pxToDp(-10) : pxToDp(10),
                                        },
                                    ]}
                                >
                                    {program_z}
                                </Text>
                            ) : null}
                            {show_translate ? (
                                <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                                    {program_c}
                                </Text>
                            ) : null}
                        </ImageBackground>
                    </TouchableOpacity>
                ) : null}
                {this.props.toKnowledge ? null : (
                    <View style={[styles.btnWrap, appStyle.flexLine]}>
                        <TouchableOpacity style={[styles.btn, { marginRight: pxToDp(40) }]} onPress={this.toExpand}>
                            <View style={[styles.btnInner]}>
                                <Image
                                    style={[styles.btnIcon]}
                                    source={require("../../../../images/MathKnowledgeGraph/btnIcon3.png")}
                                />
                                <View style={[appStyle.flexCenter]}>
                                    {show_main ? (
                                        <Text
                                            style={[
                                                mathFont.txt_32_700,
                                                mathFont.txt_fff,
                                                {
                                                    marginBottom:
                                                        Platform.OS === "android" ? pxToDp(-10) : pxToDp(10),
                                                },
                                            ]}
                                        >
                                            {expand_z}
                                        </Text>
                                    ) : null}
                                    {show_translate ? (
                                        <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                                            {expand_c}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn]} onPress={this.toPractice}>
                            <View style={[styles.btnInner]}>
                                <Image
                                    style={[styles.btnIcon]}
                                    source={require("../../../../images/MathKnowledgeGraph/btnIcon2.png")}
                                />
                                <View style={[appStyle.flexCenter]}>
                                    {show_main ? (
                                        <Text
                                            style={[
                                                mathFont.txt_32_700,
                                                mathFont.txt_fff,
                                                {
                                                    marginBottom:
                                                        Platform.OS === "android" ? pxToDp(-10) : pxToDp(10),
                                                },
                                            ]}
                                        >
                                            {practice_z}
                                        </Text>
                                    ) : null}
                                    {show_translate ? (
                                        <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>
                                            {practice_c}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
    },
    header: {
        height: Platform.OS === "android" ? pxToDp(120) : pxToDp(140),
        ...appStyle.flexLine,
        ...appStyle.flexJusCenter,
    },
    time_btn: {
        position: "absolute",
        right: pxToDp(0),
        ...appStyle.flexLine,
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        paddingTop: pxToDp(40),
    },
    practice_btn: {
        position: "absolute",
        right: pxToDp(80),
        bottom: pxToDp(38),
    },
    btnWrap: {
        position: "absolute",
        bottom: pxToDp(20),
        right: pxToDp(80)
    },
    btn: {
        width: pxToDp(280),
        height: pxToDp(128),
        paddingBottom: pxToDp(8),
        borderRadius: pxToDp(42),
        backgroundColor: "#00A884",
        marginBottom: pxToDp(36),
    },
    btnInner: {
        flex: 1,
        borderRadius: pxToDp(42),
        backgroundColor: "#00C288",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    btnIcon: {
        width: pxToDp(60),
        height: pxToDp(60),
        marginRight: pxToDp(10),
    },
    btnTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(40),
        color: "#fff",
        lineHeight: pxToDp(40),
    },
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
        toKnowledge: state.getIn(["bagSyncDiagnosis", "toKnowledge"]),
        statusData: state.getIn(["tts", "statusData"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionMathLanguage.setLanguageData(data));
        },
        setToKnowledge(data) {
            dispatch(actionBagSyncDiagnosis.setToKnowledge(data));
        },
        setShowTips(data) {
            dispatch(actionTts.setShowTips(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(KnowledgeGraphPage);
