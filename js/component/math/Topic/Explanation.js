import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { pxToDp, pxToDpHeight } from "../../../util/tools";
import TextView from "../../../component/math/FractionalRendering/TextView_new";
import url from "../../../util/url";
import AutoImage from "../Topic/AutoImage";
import RichShowViewHtml from "../RichShowViewHtml";
import topaicTypes from "../../../res/data/MathTopaicType";
import Franction from "../FractionalRendering/Franction_new";
import { appFont, appStyle, mathFont } from "../../../theme";
import { connect } from "react-redux";
import RichShowView from "../RichShowView_new";

class Explanation extends PureComponent {
    constructor(props) {
        super(props);
        this.imgUrl = url.baseURL;
        this.state = {};
    }

    renderAnswer = () => {
        const { data, my_style } = this.props;
        const exercise_type_name_arr = [
            "巧算24点",
            "文字填空题-填运算符号",
            "文字填空题-分数的拆分",
            "文字填空题-填数字",
        ]; //不显示正确答案（因为正确答案不唯一）
        if (
            data._correct !== 0 ||
            exercise_type_name_arr.indexOf(data._diagnosis_name) > -1
        )
            return null; //做对不显示正确答案
        let language_data = this.props.language_data.toJS();
        const { show_main, show_translate, main_language_map, other_language_map } =
            language_data;
        let page_base_data = {
            correct_answer_z: main_language_map.correct_answer,
            correct_answer_c: other_language_map.correct_answer,
        };
        const { correct_answer_z, correct_answer_c } = page_base_data;
        const { answer_content, exercise_data_type, _is_translate } = data;
        const {
            explanation_correct_answer_txt,
            explanation_correct_answer_borderBottom_trans,
            explanation_correct_answer_trans_txt,
        } = my_style;
        let htm_z = null;
        let htm_c = null;
        if (exercise_data_type === "FS") {
            htm_z = answer_content.map((i, x) => {
                return (
                    <View style={[appStyle.flexLine, { marginRight: pxToDp(40) }]}>
                        {i.map((ii, xx) => {
                            if (Array.isArray(ii)) {
                                return (
                                    <View
                                        style={[appStyle.flexLine, { marginRight: pxToDp(20) }]}
                                    >
                                        <Franction
                                            key={xx}
                                            value={ii}
                                            txt_style={[explanation_correct_answer_txt]}
                                            fraction_border_style={{
                                                borderBottomColor: explanation_correct_answer_txt.color,
                                            }}
                                        ></Franction>
                                    </View>
                                );
                            } else {
                                return (
                                    <View
                                        style={[appStyle.flexLine, { marginRight: pxToDp(20) }]}
                                    >
                                        <Text key={xx} style={[explanation_correct_answer_txt]}>
                                            {ii}
                                        </Text>
                                    </View>
                                );
                            }
                        })}
                    </View>
                );
            });
            if (_is_translate) {
                htm_c = answer_content.map((i, x) => {
                    return (
                        <View style={[appStyle.flexLine, { marginRight: pxToDp(40) }]}>
                            {i.map((ii, xx) => {
                                if (Array.isArray(ii)) {
                                    return (
                                        <View
                                            style={[appStyle.flexLine, { marginRight: pxToDp(20) }]}
                                        >
                                            <Franction
                                                key={xx}
                                                value={ii}
                                                txt_style={[explanation_correct_answer_trans_txt]}
                                                fraction_border_style={[
                                                    {
                                                        borderBottomColor:
                                                            explanation_correct_answer_trans_txt.color,
                                                    },
                                                    explanation_correct_answer_borderBottom_trans,
                                                ]}
                                            ></Franction>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View
                                            style={[appStyle.flexLine, { marginRight: pxToDp(20) }]}
                                        >
                                            <Text
                                                key={xx}
                                                style={[explanation_correct_answer_trans_txt]}
                                            >
                                                {ii}
                                            </Text>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    );
                });
            }
        } else {
            htm_z = answer_content.split(";").map((i, x) => {
                return (
                    <Text
                        key={x}
                        style={[
                            explanation_correct_answer_txt,
                            { marginRight: pxToDp(40) },
                        ]}
                    >
                        {i}
                    </Text>
                );
            });
            if (_is_translate) {
                htm_c = answer_content.split(";").map((i, x) => {
                    return (
                        <Text
                            key={x}
                            style={[
                                explanation_correct_answer_trans_txt,
                                { marginRight: pxToDp(40) },
                            ]}
                        >
                            {i}
                        </Text>
                    );
                });
            }
        }
        return _is_translate ? (
            <View
                style={[
                    Platform.OS === "ios"
                        ? { marginTop: pxToDp(10), marginBottom: pxToDp(20) }
                        : null,
                ]}
            >
                {show_main ? (
                    <View style={[appStyle.flexLine]}>
                        <Text style={[explanation_correct_answer_txt]}>
                            {correct_answer_z}：
                        </Text>
                        {htm_z}
                    </View>
                ) : null}
                {show_translate ? (
                    <View style={[appStyle.flexLine]}>
                        <Text style={[explanation_correct_answer_trans_txt]}>
                            {correct_answer_c}：
                        </Text>
                        {htm_c}
                    </View>
                ) : null}
            </View>
        ) : (
            <View style={[appStyle.flexLine]}>
                <Text style={[explanation_correct_answer_txt]}>正确答案：</Text>
                {htm_z}
            </View>
        );
    };

    renderSpellExplains = () => {
        {
            /* needSpellExplains 巧算分数类型题目解析需要拼起来的 */
        }
        const { data, my_style } = this.props;
        const {
            exercise_method,
            exercise_meaning,
            needSpellExplains,
            knowledgepoint_explanation_image,
        } = data;
        const { explanation_content_txt } = my_style;
        if (needSpellExplains === "qs") {
            return (
                <>
                    <TextView
                        txt_style={[explanation_content_txt]}
                        value={exercise_method}
                    ></TextView>
                    <TextView
                        txt_style={[explanation_content_txt]}
                        value={exercise_meaning}
                    ></TextView>
                    <AutoImage url={knowledgepoint_explanation_image}></AutoImage>
                </>
            );
        }
        return null;
    };

    render() {
        let language_data = this.props.language_data.toJS();
        const { show_main, show_translate, main_language_map, other_language_map } =
            language_data;
        console.log("language_data", language_data)
        const { data, my_style, max_image_width } = this.props;
        const {
            displayed_type_name,
            knowledgepoint_explanation,
            _exercise_stem,
            answer_content,
            _my_answer,
            knowledgepoint_explanation_image,
            public_exercise_image,
            exercise_data_type,
            _correct,
            _show_keyBoard,
            _show_options,
            knowledgepoint_explanation_c,
            knowledgepoint_explanation_image_c,
            _is_translate,
            needSpellExplains,
        } = data;
        const {
            explanation_correct_answer_txt,
            explanation_correct_answer_txt_gou,
            explanation_correct_answer_trans_txt,
            explanation_correct_answer_trans_txt_gou,
            explanation_txt,
            explanation_trans_txt,
            explanation_content_txt,
            explanation_content_trans_txt,
            explanation_content_txt_rich,
            explanation_content_trans_txt_rich,
        } = my_style;
        let _answer_content = answer_content;
        if (exercise_data_type === "FS" && answer_content) {
            _answer_content = answer_content[0][0];
        }
        if (displayed_type_name === topaicTypes.Compare_Size) {
            _answer_content = _answer_content
                .replaceAll("=", "＝")
                .replaceAll(">", "＞")
                .replaceAll("<", "＜");
        }
        let page_base_data = {
            correct_answer_z: main_language_map.correct_answer,
            correct_answer_c: other_language_map.correct_answer,
            jiexi_z: main_language_map.jiexi,
            jiexi_c: other_language_map.jiexi,
        };
        const { correct_answer_z, correct_answer_c, jiexi_z, jiexi_c } =
            page_base_data;
        return (
            <>
                {_correct === 0 ? (
                    <View
                        style={[
                            Platform.OS === "ios"
                                ? { marginTop: pxToDp(10), marginBottom: pxToDp(20) }
                                : null,
                        ]}
                    >
                        {_show_keyBoard ? (
                            this.renderAnswer()
                        ) : (
                            <>
                                {_is_translate ? (
                                    <>
                                        {show_main ? (
                                            <View
                                                style={[
                                                    appStyle.flexLine,
                                                    {
                                                        marginBottom:
                                                            Platform.OS === "android" ? pxToDp(-20) : 0,
                                                    },
                                                ]}
                                            >
                                                <Text style={[explanation_correct_answer_txt]}>
                                                    {correct_answer_z}：
                                                </Text>
                                                <Text
                                                    style={[
                                                        _answer_content === "√"
                                                            ? explanation_correct_answer_txt_gou
                                                            : explanation_correct_answer_txt,
                                                    ]}
                                                >
                                                    {_answer_content}
                                                </Text>
                                            </View>
                                        ) : null}
                                        {show_translate ? (
                                            <View style={[appStyle.flexLine]}>
                                                <Text style={[explanation_correct_answer_trans_txt]}>
                                                    {correct_answer_c}：
                                                </Text>
                                                <Text
                                                    style={[
                                                        _answer_content === "√"
                                                            ? explanation_correct_answer_trans_txt_gou
                                                            : explanation_correct_answer_trans_txt,
                                                    ]}
                                                >
                                                    {_answer_content}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </>
                                ) : (
                                    <View style={[appStyle.flexLine]}>
                                        <Text style={[explanation_correct_answer_txt]}>
                                            正确答案：
                                        </Text>
                                        <Text
                                            style={[
                                                _answer_content === "√"
                                                    ? explanation_correct_answer_txt_gou
                                                    : explanation_correct_answer_txt,
                                            ]}
                                        >
                                            {_answer_content}
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                ) : null}
                {_is_translate ? (
                    <>
                        {show_main ? (
                            <Text
                                style={[
                                    explanation_txt,
                                    { marginBottom: Platform.OS === "android" ? pxToDp(-20) : 0 },
                                ]}
                            >
                                {jiexi_z}：
                            </Text>
                        ) : null}
                        {show_translate ? (
                            <Text style={[explanation_trans_txt]}>{jiexi_c}：</Text>
                        ) : null}
                    </>
                ) : (
                    <Text style={[explanation_txt]}>解析：</Text>
                )}
                {exercise_data_type === "FS" ? (
                    <>
                        {_is_translate ? (
                            <>
                                {show_main ? (
                                    <>
                                        <TextView
                                            txt_style={[explanation_content_txt]}
                                            value={knowledgepoint_explanation}
                                        ></TextView>
                                        <AutoImage
                                            url={knowledgepoint_explanation_image}
                                        ></AutoImage>
                                    </>
                                ) : null}
                                {show_translate ? (
                                    <>
                                        <TextView
                                            txt_style={[explanation_content_trans_txt]}
                                            fraction_border_style={{
                                                borderBottomColor: explanation_content_trans_txt.color,
                                                borderBottomWidth: pxToDp(3),
                                            }}
                                            value={knowledgepoint_explanation_c}
                                        ></TextView>
                                        <AutoImage
                                            url={knowledgepoint_explanation_image_c}
                                        ></AutoImage>
                                    </>
                                ) : null}
                            </>
                        ) : (
                            <>
                                {needSpellExplains ? (
                                    this.renderSpellExplains()
                                ) : (
                                    <>
                                        <TextView
                                            txt_style={[explanation_content_txt]}
                                            value={knowledgepoint_explanation}
                                        ></TextView>
                                        <AutoImage
                                            url={knowledgepoint_explanation_image}
                                        ></AutoImage>
                                    </>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {_is_translate ? (
                            <>
                                {show_main ? (
                                    <RichShowViewHtml
                                        value={knowledgepoint_explanation}
                                        fontFamily={explanation_content_txt.fontFamily}
                                        size={explanation_content_txt_rich.size}
                                        color={explanation_content_txt.color}
                                        p_style={{ lineHeight: pxToDp(70) }}
                                    ></RichShowViewHtml>
                                ) : null}
                                {show_translate ? (
                                    <RichShowViewHtml
                                        value={knowledgepoint_explanation_c}
                                        size={explanation_content_trans_txt_rich.size}
                                        color={explanation_content_trans_txt.color}
                                        p_style={{ lineHeight: pxToDp(60) }}
                                    ></RichShowViewHtml>
                                ) : null}
                                {/* {show_main?<RichShowView size={explanation_content_txt_rich.size} value={knowledgepoint_explanation} family={'700'} color={explanation_content_txt.color}></RichShowView>:null}
            {show_translate?<View style={{marginTop:pxToDp(20)}}>
              <RichShowView size={explanation_content_trans_txt_rich.size} value={knowledgepoint_explanation_c} color={explanation_content_trans_txt.color} ></RichShowView>
            </View>:null} */}
                            </>
                        ) : (
                            <RichShowViewHtml
                                max_image_width={max_image_width}
                                value={knowledgepoint_explanation}
                                fontFamily={explanation_content_txt.fontFamily}
                                size={explanation_content_txt_rich.size}
                                color={explanation_content_txt.color}
                                p_style={{ lineHeight: pxToDp(70) }}
                            ></RichShowViewHtml>
                        )}
                    </>
                )}
            </>
        );
    }
}
const styles = StyleSheet.create({});
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(Explanation);
