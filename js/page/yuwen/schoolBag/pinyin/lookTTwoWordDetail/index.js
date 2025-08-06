import React, { PureComponent, } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform
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
                ciyi_zh: main_language_map.ciyi,
                ciyi_ch: other_language_map.ciyi,
                jinyi_zh: main_language_map.jinyi,
                jinyi_ch: other_language_map.jinyi,
                fanyi_zh: main_language_map.fanyi,
                fanyi_ch: other_language_map.fanyi,
                juzi_zh: main_language_map.juzi,
                juzi_ch: other_language_map.juzi,
            },
            language_data,
        };
        this.audio = React.createRef()
    }
    componentDidMount() {
        let info = this.props.userInfo.toJS();
        console.log('商品信息', this.props.navigation.state.params.data)
        axios.get(api.chinesePinyinGetKnowTwoWordDetail, {
            params: {
                knowledge: this.props.navigation.state.params.data.know.knowledge_point,
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
    audioPausedPrivate = () => {
        console.log('暂停音频', this.state.isPasued)
        this.setState({ isPasued: true })
    }
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
                <ScrollView>

                    <View style={[{ flex: 1, width: '100%' },
                    padding_tool(0, 120, 0, 120)
                    ]}>
                        <View style={[appStyle.flexTopLine, appStyle.flexCenter, padding_tool(60), borderRadius_tool(40), { marginBottom: pxToDp(60), height: pxToDp(360), backgroundColor: 'rgba(255,255,255,0.5)' }]}>
                            <View style={[appStyle.flexTopLine, appStyle.flexCenter]}>
                                <View>
                                    <Text style={{ fontSize: pxToDp(200), fontFamily: 'FZKai-Z03S', marginRight: pxToDp(60), color: '#475266' }}>{this.props.navigation.state.params.data.know.knowledge_point}</Text>
                                    {show_translate ? <Text style={[styles.tranFont, { textAlign: 'center', fontSize: pxToDp(50), lineHeight: pxToDp(80), }]}>{this.props.navigation.state.params.data.know.english_knowledge_point}</Text>
                                        : null}
                                </View>

                                <View style={[{}]}>
                                    <View style={[appStyle.flexTopLine, appStyle.flexAliCenter, { marginBottom: pxToDp(40) }]}>
                                        <Text style={[styles.dataTxt, fonts.fonts_pinyin,]}>{detailObj.pinyin_2}</Text>

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
                                            {show_main ? <Text style={[styles.mainFont]} > {btnText.jiegou_zh}:</Text> : null}
                                            {show_translate ? <Text style={[styles.tranFont]}> {btnText.jiegou_ch}:</Text> : null}
                                        </View>
                                        <Text style={[styles.dataTxt]}>{detailObj.structure}</Text>

                                    </View>

                                </View>
                            </View>


                            {/* <Image
                            style={[size_tool(240), { backgroundColor: 'pink' }]}
                            source={{
                                uri: baseURL + detailObj.pailaimi_order_1,
                            }}
                        ></Image> */}

                        </View>
                        <View style={[appStyle.flexTopLine, styles.itemWrap]}>
                            <View style={[styles.titleWrap]}>
                                {show_main ? <Text style={[styles.mainFont]} > {btnText.ciyi_zh}:</Text> : null}
                                {show_translate ? <Text style={[styles.tranFont]}> {btnText.ciyi_ch}:</Text> : null}
                            </View>
                            <Text style={[styles.dataTxt]}>{detailObj.meaning}</Text>

                        </View>
                        <View style={[appStyle.flexTopLine, styles.itemWrap]}>
                            {/* <View style={[styles.titleWrap]} >
                                {show_main ? <Text style={[styles.mainFont]} > {btnText.juzi_zh}:</Text> : null}
                                {show_translate ? <Text style={[styles.tranFont]}> {btnText.juzi_ch}:</Text> : null}
                            </View> */}
                            {/* <View>
                                {show_main ? <Text style={[styles.dataTxt]}>{detailObj.word_idiom ? detailObj.word_idiom : detailObj.xunfei_sentence}</Text> : null}
                                {show_translate ? <Text style={[styles.tranFont]}>{detailObj.english_word_idiom}</Text> : null}
                            </View> */}


                        </View>
                        {/* <View style={[{}, styles.itemWrap, borderRadius_tool(24), appStyle.flexTopLine, appStyle.flexAliCenter]}>
                            <View style={[styles.titleWrap]}>
                                {show_main ? <Text style={[styles.mainFont]} > {btnText.jinyi_zh}:</Text> : null}
                                {show_translate ? <Text style={[styles.tranFont]}> {btnText.jinyi_ch}:</Text> : null}
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, , { flex: 1 }]}>
                                {
                                    detailObj?.word_synonym?.map((item, index) => {
                                        return <View
                                            key={index}
                                            style={[
                                                {
                                                    marginRight: pxToDp(24),
                                                    marginBottom: pxToDp(40),
                                                    paddingRight: pxToDp(24)
                                                }]}
                                        >
                                            <View style={[padding_tool(0, 0, 10, 0), { backgroundColor: '#EDEDF4', borderRadius: pxToDp(20) }]}
                                            >
                                                <View style={[appStyle.flexCenter, padding_tool(20, 40, 20, 40), { backgroundColor: '#fff', borderRadius: pxToDp(20) }]}>
                                                    {show_main ? <Text style={[styles.mainFont, { textAlign: 'center' }]}>{item.pinyin_2}</Text> : null}
                                                    {show_main ? <Text style={[styles.dataTxt, { textAlign: 'center' }]} > {item.knowledge_point}</Text> : null}
                                                    {show_translate ? <Text style={[styles.tranFont, { textAlign: 'center' }]}> {item.english_knowledge_point}</Text> : null}

                                                </View>
                                            </View>
                                        </View>
                                    })
                                }
                            </View>

                        </View>
                        <View style={[{}, borderRadius_tool(24), appStyle.flexTopLine, appStyle.flexAliCenter]}>
                            <View style={[styles.titleWrap]}>
                                {show_main ? <Text style={[styles.mainFont]} > {btnText.fanyi_zh}:</Text> : null}
                                {show_translate ? <Text style={[styles.tranFont]}> {btnText.fanyi_ch}:</Text> : null}
                            </View>
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap, , { flex: 1 }]}>
                                {
                                    detailObj?.word_antonym?.map((item, index) => {
                                        return <View
                                            key={index}
                                            style={[
                                                {
                                                    marginRight: pxToDp(24),
                                                    marginBottom: pxToDp(40),
                                                    paddingRight: pxToDp(24)
                                                }]}
                                        >
                                            <View style={[padding_tool(0, 0, 10, 0), { backgroundColor: '#EDEDF4', borderRadius: pxToDp(20) }]}
                                            >
                                                <View style={[appStyle.flexCenter, padding_tool(20, 40, 20, 40), { backgroundColor: '#fff', borderRadius: pxToDp(20) }]}>
                                                    {show_main ? <Text style={[styles.mainFont, { textAlign: 'center' }]}>{item.pinyin_2}</Text> : null}
                                                    {show_main ? <Text style={[styles.dataTxt, { textAlign: 'center' }]} > {item.knowledge_point}</Text> : null}
                                                    {show_translate ? <Text style={[styles.tranFont, { textAlign: 'center' }]}> {item.english_knowledge_point}</Text> : null}

                                                </View>
                                            </View>
                                        </View>
                                    })
                                }
                            </View>

                        </View> */}
                    </View>
                </ScrollView>


            </ImageBackground >
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: pxToDp(32),
        color: '#333333'
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
        textAlign: 'right',

    },
    dataTxt: {
        fontSize: pxToDp(40),
        color: '#475266',
        fontFamily: 'FZKai-Z03S',
        marginRight: pxToDp(4),
        lineHeight: pxToDp(50),
        flex: 1
    },
    itemWrap: {
        marginBottom: pxToDp(20)
    },
    titleWrap: {
        marginRight: pxToDp(20)
    }
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
