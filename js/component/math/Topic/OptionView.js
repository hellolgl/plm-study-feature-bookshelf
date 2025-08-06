import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
} from "react-native";
import { appFont, appStyle, mathFont } from "../../../theme";
import {
    size_tool,
    pxToDp,
    padding_tool,
    pxToDpHeight,
} from "../../../util/tools";
import url from "../../../util/url";
import topaicTypes from "../../../res/data/MathTopaicType";
import LinearGradient from "react-native-linear-gradient";
import TextView from "../FractionalRendering/TextView_new";
import { connect } from "react-redux";

const OPTION_ABC_MAP = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
};

const OPTION_123_MAP = {
    0: "1",
    1: "2",
    2: "3",
    3: "4",
};

const SIZE_ARR = ["＞", "＝", "＜"];

const JUDEGMENT_ARR = [
    {
        value: "√",
        img: require("../../../images/MathSyncDiagnosis/dui.png"),
        img_red: require("../../../images/MathSyncDiagnosis/dui_red.png"),
        img_green: require("../../../images/MathSyncDiagnosis/dui_green.png"),
    },
    {
        value: "×",
        img: require("../../../images/MathSyncDiagnosis/cuo.png"),
        img_red: require("../../../images/MathSyncDiagnosis/cuo_red.png"),
        img_green: require("../../../images/MathSyncDiagnosis/cuo_green.png"),
    },
];

class OptionView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: -1,
        };
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }
    initOption = () => {
        console.log("重置选项");
        this.setState({
            currentIndex: -1,
        });
    };
    componentDidUpdate(prevProps, prevState) {
        const { data } = this.props;
        const { m_e_s_id, id } = data;
        if (m_e_s_id !== prevProps.data.m_e_s_id || id !== prevProps.data.id) {
            this.setState({
                currentIndex: -1,
            });
        }
    }

    getMapType = (type) => {
        switch (type) {
            case topaicTypes.Multipl_Choice_123:
                return OPTION_123_MAP;
            case topaicTypes.Multipl_Choice_ABC:
                return OPTION_ABC_MAP;
            case topaicTypes.Multipl_Choice:
                return OPTION_ABC_MAP;
            default:
                return {};
        }
    };

    checkOption = (i, x, answer) => {
        const { data } = this.props;
        const { _correct } = data;
        if (_correct !== -1 || !this.props.checkOption) return; //表示题目已经保存，不能再进行选择
        this.setState(
            {
                currentIndex: x,
            },
            () => {
                this.props.checkOption(answer);
            }
        );
    };

    renderOptionsTxt = (i, x) => {
        let language_data = this.props.language_data.toJS();
        const { show_main, show_translate } = language_data;
        const { data } = this.props;
        const {
            exercise_data_type,
            _diagnosis_name,
            choice_content_c,
            _is_translate,
        } = data;
        let _map = this.getMapType(_diagnosis_name);
        let choice_content_c_arr = [];
        if (_is_translate) {
            choice_content_c_arr = choice_content_c;
            if (exercise_data_type !== "FS" && choice_content_c) {
                choice_content_c_arr = choice_content_c.split("#");
            }
        }
        if (exercise_data_type === "FS") {
            return (
                <View style={[appStyle.flexLine]}>
                    <View style={[styles.zimu]}>
                        <Text style={[mathFont.txt_40_700, mathFont.txt_475266]}>
                            {_map[x]}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {_is_translate ? (
                            <>
                                {show_main ? (
                                    <TextView
                                        value={i}
                                        txt_style={[
                                            { fontSize: pxToDp(32) },
                                            appFont.fontFamily_jcyt_700,
                                            mathFont.txt_475266,
                                        ]}
                                        fraction_border_style={{ borderBottomColor: "#475266" }}
                                    ></TextView>
                                ) : null}
                                {show_translate ? (
                                    <TextView
                                        value={choice_content_c_arr[x]}
                                        txt_style={[mathFont.txt_24_500, mathFont.txt_475266_50]}
                                        fraction_border_style={{
                                            borderBottomWidth: pxToDp(2),
                                            borderBottomColor: "rgba(71, 82, 102, 0.50)",
                                        }}
                                    ></TextView>
                                ) : null}
                            </>
                        ) : (
                            <TextView
                                value={i}
                                txt_style={[
                                    { fontSize: pxToDp(32) },
                                    appFont.fontFamily_jcyt_500,
                                    mathFont.txt_475266,
                                ]}
                                fraction_border_style={{ borderBottomColor: "#475266" }}
                            ></TextView>
                        )}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[appStyle.flexLine]}>
                    <View style={[styles.zimu]}>
                        <Text style={[mathFont.txt_40_700, mathFont.txt_475266]}>
                            {_map[x]}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        {_is_translate ? (
                            <>
                                {show_main ? (
                                    <Text
                                        style={[
                                            mathFont.txt_32_700,
                                            mathFont.txt_475266,
                                            {
                                                marginBottom:
                                                    Platform.OS === "android" ? pxToDp(-10) : 0,
                                            },
                                        ]}
                                    >
                                        {i}
                                    </Text>
                                ) : null}
                                {show_translate ? (
                                    <Text style={[mathFont.txt_24_500, mathFont.txt_475266_50]}>
                                        {choice_content_c_arr[x]}
                                    </Text>
                                ) : null}
                            </>
                        ) : (
                            <Text
                                style={[
                                    mathFont.txt_32_500,
                                    mathFont.txt_475266,
                                    { marginRight: pxToDp(60) },
                                ]}
                            >
                                {i}
                            </Text>
                        )}
                    </View>
                </View>
            );
        }
    };

    renderOption = () => {
        const { data } = this.props;
        const {
            _diagnosis_name,
            choice_content,
            exercise_data_type,
            _correct,
            _my_answer,
            displayed_type_name,
        } = data;
        const { currentIndex } = this.state;
        let _map = this.getMapType(_diagnosis_name);
        let _choice_content = choice_content;
        if (exercise_data_type !== "FS") {
            _choice_content = choice_content.split("#");
        }
        switch (displayed_type_name) {
            case topaicTypes.Multipl_Choice:
                return _choice_content.map((i, x) => {
                    if (_my_answer === _map[x] && _correct === 0) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    { borderColor: "#FF6680", borderWidth: pxToDp(6) },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexAliStart]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(255, 229, 234, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        {this.renderOptionsTxt(i, x)}
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }
                    if (_my_answer === _map[x] && _correct === 1) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    { borderColor: "#31D860", borderWidth: pxToDp(4) },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexAliStart]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(218, 242, 225, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        {this.renderOptionsTxt(i, x)}
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }
                    return (
                        <TouchableOpacity
                            key={x}
                            style={[
                                styles.option,
                                currentIndex === x ? styles.option_active : null,
                            ]}
                            onPress={() => {
                                this.checkOption(i, x, _map[x]);
                            }}
                        >
                            <View style={[styles.option_inner_1]}>
                                <View style={[styles.option_inner_2]}>
                                    {this.renderOptionsTxt(i, x)}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                });
            case topaicTypes.Compare_Size:
                return SIZE_ARR.map((i, x) => {
                    if (_my_answer === i && _correct === 0) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    {
                                        borderColor: "#FF6680",
                                        borderWidth: pxToDp(6),
                                        width: pxToDp(540),
                                    },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexCenter]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(255, 229, 234, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={[mathFont.txt_32_700, { color: "#FF6680" }]}>
                                            {i}
                                        </Text>
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }

                    if (_my_answer === i && _correct === 1) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    ,
                                    {
                                        borderColor: "#31D860",
                                        borderWidth: pxToDp(6),
                                        width: pxToDp(540),
                                    },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexCenter]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(218, 242, 225, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={[mathFont.txt_32_700, { color: "#31D860" }]}>
                                            {i}
                                        </Text>
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }
                    return (
                        <TouchableOpacity
                            key={x}
                            style={[
                                styles.option,
                                currentIndex === x ? styles.option_active : null,
                                { width: pxToDp(540) },
                            ]}
                            onPress={() => {
                                this.checkOption(i, x, i);
                            }}
                        >
                            <View style={[styles.option_inner_1]}>
                                <View style={[styles.option_inner_2, appStyle.flexCenter]}>
                                    <Text style={[mathFont.txt_32_700, mathFont.txt_475266]}>
                                        {i}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                });
            case topaicTypes.Judegment:
                return JUDEGMENT_ARR.map((i, x) => {
                    if (_my_answer === i.value && _correct === 0) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    { borderColor: "#FF6680", borderWidth: pxToDp(6) },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexCenter]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(255, 229, 234, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Image
                                            resizeMode="stretch"
                                            source={i.img_red}
                                            style={[styles.judegment_img]}
                                        ></Image>
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }
                    if (_my_answer === i.value && _correct === 1) {
                        return (
                            <View
                                style={[
                                    styles.option,
                                    { borderColor: "#31D860", borderWidth: pxToDp(6) },
                                ]}
                            >
                                <View style={[styles.option_inner_1]}>
                                    <LinearGradient
                                        key={x}
                                        style={[styles.option_inner_2, appStyle.flexCenter]}
                                        colors={[
                                            "rgba(245, 245, 250, 1)",
                                            "rgba(218, 242, 225, 1)",
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Image
                                            resizeMode="stretch"
                                            source={i.img_green}
                                            style={[styles.judegment_img]}
                                        ></Image>
                                        {_correct === 0 ? (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/cuo_icon.png")}
                                            ></Image>
                                        ) : (
                                            <Image
                                                resizeMode="stretch"
                                                style={[styles.correct_img]}
                                                source={require("../../../images/MathSyncDiagnosis/dui_icon.png")}
                                            ></Image>
                                        )}
                                    </LinearGradient>
                                </View>
                            </View>
                        );
                    }
                    return (
                        <TouchableOpacity
                            key={x}
                            style={[
                                styles.option,
                                currentIndex === x ? styles.option_active : null,
                            ]}
                            onPress={() => {
                                this.checkOption(i, x, i.value);
                            }}
                        >
                            <View style={[styles.option_inner_1]}>
                                <View style={[styles.option_inner_2, appStyle.flexCenter]}>
                                    <Image
                                        resizeMode="stretch"
                                        source={i.img}
                                        style={[styles.judegment_img]}
                                    ></Image>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                });
        }
    };

    renderNoAnswer = () => {
        let language_data = this.props.language_data.toJS();
        const { show_main, show_translate, main_language_map, other_language_map } =
            language_data;
        const { data, onlySee } = this.props;
        const { _is_translate } = data;
        if (onlySee) return null;
        if (data._correct !== -1 && !data._my_answer) {
            if (_is_translate) {
                let page_base_data = {
                    noselectanswer_z: main_language_map.noselectanswer,
                    noselectanswer_c: other_language_map.noselectanswer,
                };
                return (
                    <>
                        {show_main ? (
                            <Text
                                style={[
                                    { fontSize: pxToDp(40), color: "#FF6680" },
                                    appFont.fontFamily_jcyt_700,
                                ]}
                            >
                                {page_base_data.noselectanswer_z}
                            </Text>
                        ) : null}
                        {show_translate ? (
                            <Text
                                style={[
                                    { fontSize: pxToDp(32), color: "rgba(255, 102, 128, .5)" },
                                    appFont.fontFamily_jcyt_500,
                                ]}
                            >
                                {page_base_data.noselectanswer_c}
                            </Text>
                        ) : null}
                    </>
                );
            } else {
                return (
                    <Text
                        style={[
                            { fontSize: pxToDpHeight(48), color: "#FF6680" },
                            appFont.fontFamily_jcyt_500,
                        ]}
                    >
                        你没有选择答案
                    </Text>
                );
            }
        }
        return null;
    };

    render() {
        const { onlySee } = this.props;
        return (
            <>
                <View
                    style={[
                        appStyle.flexLine,
                        appStyle.flexJusBetween,
                        appStyle.flexLineWrap,
                    ]}
                >
                    {this.renderOption()}
                </View>
                {onlySee ? null : this.renderNoAnswer()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    option: {
        width: pxToDp(864),
        borderRadius: pxToDp(52),
        backgroundColor: "#fff",
        marginBottom: pxToDp(36),
        padding: pxToDp(6),
    },
    option_active: {
        borderWidth: pxToDp(6),
        borderColor: "#FFAE66",
    },
    option_inner_1: {
        backgroundColor: "#E7E7F2",
        borderRadius: pxToDp(40),
        minHeight: pxToDp(120),
        paddingBottom: pxToDp(5),
        width: "100%",
    },
    option_inner_2: {
        width: "100%",
        flex: 1,
        ...appStyle.flexAliStart,
        ...appStyle.flexJusCenter,
        backgroundColor: "#F5F5FA",
        borderRadius: pxToDp(40),
        padding: pxToDp(20),
    },
    option_txt: {
        color: "#246666",
        fontSize: pxToDp(32),
    },
    correct_img: {
        width: pxToDp(40),
        height: pxToDp(40),
        position: "absolute",
        right: pxToDp(30),
    },
    judegment_img: {
        width: pxToDp(90),
        height: pxToDp(90),
    },
    zimu: {
        width: pxToDp(80),
        height: pxToDp(80),
        backgroundColor: "#fff",
        ...appStyle.flexCenter,
        borderRadius: pxToDp(40),
        marginRight: pxToDp(20),
    },
});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(OptionView);
