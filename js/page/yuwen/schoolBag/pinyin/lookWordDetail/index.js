import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform,
} from "react-native";
import { appStyle } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool } from "../../../../../util/tools";
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import Header from '../../../../../component/Header'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { ScrollView } from "react-native-gesture-handler";
import url from "../../../../../util/url";
import Audio from "../../../../../util/audio"
import BackBtn from '../../../../../component/chinese/pinyin/backBtn'
import fonts from "../../../../../theme/fonts";

let baseURL = url.baseURL;
class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        let language_data = props.language_data.toJS()
        const { main_language_map, other_language_map, type, show_type } = language_data
        this.state = {
            detailObj: {},
            isPasued: true,
            btnText: {
                back_zh: main_language_map.back,
                back_ch: other_language_map.back,
                explain_zh: main_language_map.explain,
                explain_ch: other_language_map.explain,
                bushou_zh: main_language_map.bushou,
                bushou_ch: other_language_map.bushou,
                cizu_zh: main_language_map.cizu,
                cizu_ch: other_language_map.cizu,
                jiegou_zh: main_language_map.jiegou,
                jiegou_ch: other_language_map.jiegou,
            },
            language_data,
        };
        this.audio = React.createRef()
    }
    componentDidMount() {
        let info = this.props.userInfo.toJS();
        console.log('商品信息', this.props.navigation.state.params.data)
        axios.get(api.chinesePinyinGetKnowWordDetail, {
            params: {
                p_id: this.props.navigation.state.params.data.p_id,
                knowledge_point: this.props.navigation.state.params.data.knowledge_point,
                pw_id: this.props.navigation.state.params.data.pw_id
            }
        }).then((res) => {
            console.log("回调", res.data.data)
            if (res.data.err_code === 0) {
                this.setState({
                    detailObj: res.data.data
                })
            }
        })
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    }
    toWord = (item) => NavigationUtil.toChinesePinyinLookTwoWordDetail({ ...this.props, data: { know: item } })
    audioPausedPrivate = () => this.setState({ isPasued: true })
    playAudio = () => {
        const { isPasued } = this.state
        if (isPasued) {
            this.audio.current.replay()
        }
        this.setState({ isPasued: !isPasued })
    }
    render() {
        const { detailObj, btnText, language_data, } = this.state
        const { show_main, show_translate } = language_data
        return (
            <ImageBackground
                source={Platform.OS === 'ios' ? require('../../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png') : require('../../../../../images/chineseHomepage/pingyin/new/wrapBg.png')}
                style={[, { flex: 1, position: 'relative', paddingTop: pxToDp(Platform.OS === 'ios' ? 40 : 0) }]}>
                <View style={[padding_tool(20)]}>
                    <BackBtn show_main={show_main} show_translate={show_translate} back_ch={btnText.back_ch} back_zh={btnText.back_zh} onPress={this.goBack} />
                </View>
                <View style={[{ flex: 1, width: '100%' },
                padding_tool(0, 120, 0, 120)
                ]}>
                    <View style={[appStyle.flexTopLine, appStyle.flexJusBetween, appStyle.flexAliCenter, padding_tool(60), borderRadius_tool(40), { marginBottom: pxToDp(60), height: pxToDp(320), backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                        <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                            <Text style={{ fontSize: pxToDp(200), fontFamily: 'FZKai-Z03S', marginRight: pxToDp(60) }}>{this.props.navigation.state.params.data.knowledge_point}</Text>

                            <View style={[{}]}>
                                <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, { marginBottom: pxToDp(40) }]}>
                                    <Text style={[styles.dataTxt]}>{detailObj.pinyin_2}</Text>

                                    {detailObj.pinyin_1 ?
                                        <TouchableOpacity style={[appStyle.flexCenter, {}]} onPress={() => this.playAudio()
                                        }>
                                            <Image
                                                source={require('../../../../../images/chineseHomepage/pingyin/new/audioPlay.png')}
                                                style={[size_tool(80), {}]}
                                            />
                                        </TouchableOpacity> : null}

                                </View>
                                {detailObj.pinyin_1 ? <Audio uri={`${baseURL}${detailObj.pinyin_1}`} paused={this.state.isPasued} pausedEvent={this.audioPausedPrivate} ref={this.audio} />
                                    : null}
                                <View style={[appStyle.flexTopLine,]}>
                                    <View >
                                        {show_main ? <Text style={[styles.mainFont]} > {btnText.bushou_zh}:</Text> : null}
                                        {show_translate ? <Text style={[styles.tranFont]}> {btnText.bushou_ch}:</Text> : null}
                                    </View>
                                    <Text style={[styles.dataTxt]}>{detailObj.radical}</Text>
                                    <View >
                                        {show_main ? <Text style={[styles.mainFont]} > {btnText.jiegou_zh}:</Text> : null}
                                        {show_translate ? <Text style={[styles.tranFont]}> {btnText.jiegou_ch}:</Text> : null}
                                    </View>
                                    <Text style={[styles.dataTxt]}>{detailObj.structure}</Text>
                                </View>

                            </View>
                        </View>


                        {detailObj.pailaimi_order_1 ? <Image
                            style={[size_tool(240), { backgroundColor: '#fff', borderRadius: pxToDp(20) }]}
                            source={{
                                uri: baseURL + detailObj.pailaimi_order_1,
                            }}
                        ></Image> : null}

                    </View>

                    <View style={[{ padding: pxToDp(40, 40, 0, 40) }, borderRadius_tool(24), appStyle.flexTopLine, appStyle.flexAliCenter]}>
                        <View style={[{ marginRight: pxToDp(20) }]}>
                            {show_main ? <Text style={[styles.mainFont]} > {btnText.cizu_zh}:</Text> : null}
                            {show_translate ? <Text style={[styles.tranFont]}> {btnText.cizu_ch}:</Text> : null}
                        </View>
                        <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, , { flex: 1 }]}>
                            {
                                detailObj?.relation_word?.map((item, index) => {
                                    return <TouchableOpacity
                                        key={index}
                                        onPress={this.toWord.bind(this, item)}
                                        style={[
                                            appStyle.flexCenter,
                                            appStyle.flexTopLine,
                                            {
                                                marginRight: pxToDp(24),
                                                marginBottom: pxToDp(40),
                                                paddingRight: pxToDp(24)
                                            }]}
                                    >
                                        <View style={[padding_tool(0, 0, 10, 0), { backgroundColor: '#EDEDF4', borderRadius: pxToDp(20) }]}
                                        >{console.log('shuju shuju', show_main, item)}
                                            <View style={[appStyle.flexCenter, padding_tool(20, 40, 20, 40), { backgroundColor: '#fff', borderRadius: pxToDp(20) }]}>
                                                {show_main ? <Text style={[styles.mainFont, fonts.fonts_pinyin, { textAlign: 'center', }]}>{item.pinyin_2}</Text> : null}
                                                {show_main ? <Text style={[styles.dataTxt, { textAlign: 'center' }]} > {item.knowledge_point}</Text> : null}
                                                {show_translate ? <Text style={[styles.tranFont, { textAlign: 'center' }]}> {item.english_knowledge_point}</Text> : null}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                })
                            }
                        </View>

                    </View>
                </View>


            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink"
    },
    mainFont: {
        fontSize: pxToDp(36),
        color: '#475266',
        ...fonts.fontFamily_jcyt_500,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(42),
        textAlign: 'right',
    },
    tranFont: {
        fontSize: pxToDp(28),
        color: '#475266',
        ...fonts.fontFamily_jcyt_500,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(33),
        opacity: 0.5,
        textAlign: 'right'
    },
    dataTxt: {
        fontSize: pxToDp(40),
        color: '#475266',
        ...fonts.fonts_pinyin,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(50),
        // fontWeight: "bold",
    },

});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        language_data: state.getIn(['languageChinese', 'language_data'])
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
