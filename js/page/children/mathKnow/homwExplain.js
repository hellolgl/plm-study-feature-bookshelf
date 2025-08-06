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
    DeviceEventEmitter
} from "react-native";
import { appFont, appStyle, mathFont } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import NavigationUtil from "../../../navigator/NavigationMathUtil";
import { connect } from "react-redux";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import RichShowViewHtml from '../../../component/math/RichShowViewHtml'
import BackBtn from "../../../component/math/BackBtn";

class KnowledgeGraphPage extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined
        this.state = {
            knowledge_details: {},
            page_data: {},
            language_data: {},
            status: this.props.navigation.state.params.data.status,
            has_exercise: ''
        };
    }

    static getDerivedStateFromProps(props, state) {
        let tempState = { ...state };
        let language_data = props.language_data.toJS()
        const { main_language_map, other_language_map, type } = language_data
        if (type !== tempState.language_data.type) {
            console.log('切换语言', language_data)
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
            }
            tempState.page_data = { ...page_base_data }
            tempState.language_data = JSON.parse(JSON.stringify(language_data))
            return tempState
        }
        return null
    }

    componentDidMount() {
        this.getData()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshStatus",
            () => {
                this.getData()
            }
        );
    }

    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }

    getData = () => {
        const { knowledge_code, knowledge_name, language_knowledge_name } = this.props.navigation.state.params.data
        const { language_data } = this.state
        const { show_type } = language_data
        const { page_data } = this.state
        let params = {
            language: language_data.trans_language,
            knowledge_code
        }
        axios.get(api.getMathKGElementExplain, { params }).then((res) => {
            console.log('ExplainPage res', res.data.data)
            let data = res.data.data
            let page_variable_data = {}
            if (show_type === '1') {
                // 中文为主
                page_variable_data = {
                    knowledge_explain_z: data.knowledge_explain,
                    knowledge_explain_c: data.language_knowledge_explain,
                    element_name_z: knowledge_name,
                    element_name_c: language_knowledge_name,
                }
            }
            if (show_type === '2') {
                // 英文为主
                page_variable_data = {
                    knowledge_explain_z: data.language_knowledge_explain,
                    knowledge_explain_c: data.knowledge_explain,
                    element_name_z: language_knowledge_name,
                    element_name_c: knowledge_name
                }
            }
            this.setState(() => ({
                knowledge_details: data,
                status: data.status,
                page_data: {
                    ...page_data,
                    ...page_variable_data
                },
                has_exercise: res.data.data.has_exercise
            }));
        });
    }

    goBack = () => {
        NavigationUtil.goBack(this.props);
    };


    toPractice = () => {
        const { status } = this.state
        let data = this.props.navigation.state.params.data
        data.status = status
        NavigationUtil.toKnowledgeGraphExplainDoExercise({ ...this.props, data: { ...data } })
    }

    toProgram = () => {
        const { status } = this.state
        let data = this.props.navigation.state.params.data
        data.status = status
        NavigationUtil.toMathProgramExercise({ ...this.props, data: { ...data } })
    }
    render() {
        const { page_data, language_data, knowledge_details, has_exercise } = this.state
        const { back_z, back_c, shijianxian_z, shijianxian_c, zsdjiangjie_z, zsdjiangjie_c, practice_z, practice_c, knowledge_explain_z, knowledge_explain_c, element_name_z, element_name_c, program_z, program_c } = page_data
        const { show_main, show_translate } = language_data
        const { knowledge_code, knowledge_name } = this.props.navigation.state.params.data
        return (
            <ImageBackground source={require("../../../images/MathSyncDiagnosis/bg_1.png")} style={styles.container}>
                <View style={[styles.header]}>
                    <BackBtn goBack={this.goBack} style={{left:0}}></BackBtn>
                    <View style={[appStyle.flexAliCenter]}>
                        {show_main ? <Text style={[mathFont.txt_32_700, mathFont.txt_4C4C59, { marginBottom: Platform.OS === 'ios' ? pxToDp(6) : pxToDp(-10) }]}>{element_name_z}</Text> : null}
                        {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_A5A5AC,{lineHeight:pxToDp(34)}]}>{element_name_c}</Text> : null}
                    </View>
                </View>
                <View style={[styles.content]}>
                    <ScrollView contentContainerStyle={{ paddingLeft: pxToDp(264), paddingRight: pxToDp(264), paddingBottom: pxToDp(100) }}>
                        <View style={{ marginBottom: pxToDp(40) }}>
                            {show_main ? <Text style={[mathFont.txt_48_700, mathFont.txt_4C4C59, { marginBottom: Platform.OS === 'android' ? pxToDp(-20) : pxToDp(10) }]}>{zsdjiangjie_z}：</Text> : null}
                            {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_A5A5AC]}>{zsdjiangjie_c}：</Text> : null}
                        </View>
                        {knowledge_details.knowledge_explain ? <>
                            {show_main ? <RichShowViewHtml value={knowledge_explain_z} fontFamily={'JiangChengYuanTi-700W'} p_style={{ lineHeight: pxToDp(70) }} size={36} color={'#4C4C59'}></RichShowViewHtml> : null}
                            {show_translate ? <View style={{ marginTop: pxToDp(80) }}>
                                <RichShowViewHtml value={knowledge_explain_c} p_style={{ lineHeight: pxToDp(60) }} size={28} color={'rgba(76, 76, 89, 0.50)",'}></RichShowViewHtml>
                            </View> : null}
                        </> : null}
                    </ScrollView>
                </View>
                {has_exercise === '1' ? <TouchableOpacity style={[styles.practice_btn, { bottom: pxToDp(260) }]} onPress={this.toProgram}>
                    <ImageBackground style={[{ width: pxToDp(200), height: pxToDp(200) }, appStyle.flexCenter]} resizeMode='stretch' source={require('../../../images/MathKnowledgeGraph/btn_bg_2.png')}>
                        {show_main ? <Text style={[mathFont.txt_32_700, mathFont.txt_fff, { marginBottom: Platform.OS === 'android' ? pxToDp(-10) : pxToDp(10) }]}>{program_z}</Text> : null}
                        {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>{program_c}</Text> : null}
                    </ImageBackground>
                </TouchableOpacity> : null}
                <TouchableOpacity style={[styles.practice_btn,]} onPress={this.toPractice}>
                    <ImageBackground style={[{ width: pxToDp(200), height: pxToDp(200) }, appStyle.flexCenter]} resizeMode='stretch' source={require('../../../images/MathKnowledgeGraph/btn_bg_1.png')}>
                        {show_main ? <Text style={[mathFont.txt_32_700, mathFont.txt_fff, { marginBottom: Platform.OS === 'android' ? pxToDp(-10) : pxToDp(10) }]}>{practice_z}</Text> : null}
                        {show_translate ? <Text style={[mathFont.txt_24_500, mathFont.txt_fff]}>{practice_c}</Text> : null}
                    </ImageBackground>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40)
    },
    header: {
        height: pxToDp(120),
        ...appStyle.flexLine,
        ...appStyle.flexJusCenter
    },
    time_btn: {
        position: 'absolute',
        right: pxToDp(0),
        ...appStyle.flexLine
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: pxToDp(40),
        borderTopRightRadius: pxToDp(40),
        paddingTop: pxToDp(40),
    },
    practice_btn: {
        position: 'absolute',
        right: pxToDp(80),
        bottom: pxToDp(38)
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

export default connect(mapStateToProps, mapDispathToProps)(KnowledgeGraphPage);
