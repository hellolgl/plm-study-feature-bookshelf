import React, { Component, PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    DeviceEventEmitter, Platform
} from "react-native";
import axios from "../../../../../util/http/axios";
import api from "../../../../../util/http/api";
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { pxToDp, } from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import url from '../../../../../util/url'
import RichShowViewHtml from '../../../../../component/math/RichShowViewHtml'
import Audio from "../../../../../util/audio/audio"
let baseUrl = url.baseURL;

const IMG_MAP = {
    0: require('../../../../../images/EN_Sentences/bg_bunny_high_2.png'),
    1: require('../../../../../images/EN_Sentences/bg_percy_2.png'),
    2: require('../../../../../images/EN_Sentences/bg_frank_2.png'),
    3: require('../../../../../images/EN_Sentences/bg_kathy_2.png'),
    4: require('../../../../../images/EN_Sentences/bg_sara_2.png'),
    5: require('../../../../../images/EN_Sentences/bg_zara_2.png'),
}

class Element extends PureComponent {
    constructor(props) {
        super(props);
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        this.grade_code = userInfoJs.checkGrade;
        this.term_code = userInfoJs.checkTeam;
        this.data = this.props.navigation.state.params.data.data
        this.cartoon = this.data.cartoon
        this.state = {
            has_record: false,
            has_exercise: 0,
        };
    }

    componentDidMount() {
        this.getRecord()
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener('refreshPage', (event) => {
            this.getRecord()
        })
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }
    getRecord = () => {
        const data = {};
        data.grade_code = this.grade_code;
        data.term_code = this.term_code;
        data.cartoon = this.cartoon
        axios.get(api.getEngCartoonRecordStatus, { params: data }).then(res => {
            this.setState({
                has_record: res.data.data.has_record,
                has_exercise: res.data.data.has_exercise,
            })
        })
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };
    startDoExercise = () => {
        const { has_record } = this.state
        if (has_record) {
            NavigationUtil.toEnSentencesLearnTodayRecordList({ ...this.props, data: { cartoon: this.cartoon } });
            return
        }
        NavigationUtil.toEnSentencesLearnWidthFriendsDoExercise({ ...this.props, data: { cartoon: this.cartoon } })
    }

    renderCartoon = () => {
        const { index } = this.data
        const IMGSTYLE_MAP = {
            0: { width: pxToDp(247), height: pxToDp(423), left: pxToDp(-20) },
            1: { width: pxToDp(300), height: pxToDp(369), top: pxToDp(30) },
            2: { width: pxToDp(343), height: pxToDp(287), top: pxToDp(40) },
            3: { width: pxToDp(279), height: pxToDp(497) },
            4: { width: pxToDp(324), height: pxToDp(365), top: Platform.OS === 'ios' ? pxToDp(20) : 0 },
            5: { width: pxToDp(324), height: pxToDp(365), top: Platform.OS === 'ios' ? pxToDp(20) : 0 },
        }
        const CIRCLE_STYLE_MAP = {
            1: { bottom: pxToDp(-150) },
            2: { bottom: pxToDp(-171) }
        }
        const ICON_STYLE_MAP = {
            0: Platform.OS === 'ios' ? { left: pxToDp(10) } : null,
            1: Platform.OS === 'ios' ? { left: pxToDp(30) } : null,
            2: { left: Platform.OS === 'ios' ? pxToDp(50) : pxToDp(40) },
            3: Platform.OS === 'ios' ? { left: pxToDp(30) } : null,
            4: { left: pxToDp(40) },
            5: { left: pxToDp(40) },
        }
        const AI_STYLE_MAP = {
            0: { bottom: pxToDp(-110) },
            1: { bottom: pxToDp(-130) },
            2: { bottom: pxToDp(-150) },
            3: { bottom: pxToDp(-116) },
            4: { bottom: Platform.OS === 'ios' ? pxToDp(-120) : pxToDp(-100) },
            5: { bottom: Platform.OS === 'ios' ? pxToDp(-110) : pxToDp(-80) },
        }
        const goGrammarAI = () => {
            const { token } = this.props
            if (!token) {
                NavigationUtil.resetToLogin(this.props);
                return
            }
            NavigationUtil.toEnglishGrammarAiHelp({
                navigation: this.props.navigation,
                data: {
                    inspect: this.cartoon,
                },
            });
        };
        return <View style={[{ paddingLeft: pxToDp(60), paddingRight: pxToDp(56) }, appStyle.flexLine, appStyle.flexJusBetween]}>
            <TouchableOpacity style={[appStyle.flexAliCenter, { flex: 1, position: 'relative', zIndex: 2 }]} onPress={() => {
                // Ai对话入口
                goGrammarAI()
            }}>
                <Image resizeMode='contain' style={[IMGSTYLE_MAP[index], { zIndex: 2, position: "relative" }]} source={IMG_MAP[index]}></Image>
                {index < 4 ? <View
                    style={[
                        styles.circle,
                        {
                            transform: [{ rotateX: '82deg' }],
                            position: "absolute",
                            bottom: pxToDp(-131),
                            zIndex: 1
                        },
                        CIRCLE_STYLE_MAP[index] ? CIRCLE_STYLE_MAP[index] : null
                    ]}></View> : null}
                <View style={[styles.talkBtn, AI_STYLE_MAP[index]]}>
                    <Text style={[{ color: '#fff', fontSize: pxToDp(33) }, appFont.fontFamily_jcyt_700]}>点我开启AI对话</Text>
                </View>
            </TouchableOpacity>

            <Image style={[{ width: pxToDp(91), height: pxToDp(57), marginTop: pxToDp(60), position: "relative" }, ICON_STYLE_MAP[index] ? ICON_STYLE_MAP[index] : null]} source={require('../../../../../images/EN_Sentences/icon_5.png')}></Image>
        </View>

    }

    render() {
        const { has_record, has_exercise } = this.state
        const { cartoon } = this.data
        return (
            <ImageBackground style={[styles.container]} source={Platform.OS === 'android' ? require("../../../../../images/EN_Sentences/bg_1_a.png") : require("../../../../../images/EN_Sentences/bg_1_i.png")}>
                <TouchableOpacity style={[styles.back_btn, Platform.OS === 'ios' ? { top: pxToDp(40) } : null]} onPress={this.goBack}>
                    <Image resizeMode='stretch' style={[{ width: pxToDp(120), height: pxToDp(80) }]} source={require('../../../../../images/childrenStudyCharacter/back_btn_1.png')}></Image>
                </TouchableOpacity>
                <View style={[{ flex: 1 }, appStyle.flexLine]}>
                    <View style={[{ flex: 1 }]}>
                        {this.renderCartoon()}
                    </View>
                    <ImageBackground resizeMode='stretch' style={[styles.right]} source={Platform.OS === 'android' ? require('../../../../../images/EN_Sentences/bg_3_a.png') : require('../../../../../images/EN_Sentences/bg_3_i.png')}>
                        <Text style={[{ color: "#445368", fontSize: pxToDp(58), marginLeft: pxToDp(20), marginBottom: Platform.OS === 'android' ? pxToDp(40) : pxToDp(80) }, appFont.fontFamily_jcyt_700, Platform.OS === 'ios' ? { lineHeight: pxToDp(70) } : null]}>Your Friend {cartoon}'s Tips</Text>
                        <ScrollView style={[{ width: '100%', marginLeft: Platform.OS === 'android' ? pxToDp(460) : pxToDp(600), flex: 1 }]} contentContainerStyle={{ paddingRight: pxToDp(180), paddingBottom: pxToDp(80) }}>
                            {this.data.details.map((item, index) => {
                                return <View key={index} style={{ marginBottom: pxToDp(80) }}>
                                    <Text style={[{ fontSize: pxToDp(46), color: '#445368', ...appFont.fontFamily_jcyt_700 }, Platform.OS === 'ios' ? { marginBottom: pxToDp(20), lineHeight: pxToDp(56) } : null]}>* {item.name}</Text>
                                    {item.audio ? <View style={[{ marginBottom: pxToDp(20) }]}>
                                        <Audio
                                            audioUri={`${baseUrl}${item.audio}`}
                                            pausedBtnImg={require("../../../../../images/EN_Sentences/pause_btn_2.png")}
                                            pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                            playBtnImg={require("../../../../../images/EN_Sentences/play_btn_2.png")}
                                            playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                                            rate={0.75}
                                        />
                                    </View> : null}
                                    <RichShowViewHtml value={item.explain} size={40} p_style={{ lineHeight: pxToDp(70) }}></RichShowViewHtml>
                                </View>
                            })}
                        </ScrollView>
                    </ImageBackground>
                </View>
                {has_exercise === 1 ? <TouchableOpacity style={[styles.startBtn, has_record ? { backgroundColor: "#00AC7A" } : null]} onPress={this.startDoExercise}>
                    <View style={[styles.startBtnInner, has_record ? { backgroundColor: "#00C892" } : null]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(50) }, appFont.fontFamily_jcyt_700]}>Start</Text>
                    </View>
                </TouchableOpacity> : null}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    back_btn: {
        position: "absolute",
        left: pxToDp(40),
        top: pxToDp(40),
        zIndex: 1
    },
    content: {
        width: pxToDp(450),
        height: pxToDp(500),
        top: pxToDp(200),
    },
    circle: {
        width: pxToDp(262),
        height: pxToDp(262),
        borderRadius: pxToDp(131),
        backgroundColor: "#784ACF"
    },
    right: {
        width: Platform.OS === 'android' ? pxToDp(1529) : pxToDp(1588),
        height: "100%",
        paddingTop: pxToDp(57),
        ...appStyle.flexAliCenter,
    },
    startBtn: {
        width: pxToDp(240),
        height: pxToDp(240),
        borderRadius: pxToDp(120),
        backgroundColor: "#FF731C",
        paddingBottom: pxToDp(7),
        position: "absolute",
        right: pxToDp(36),
        bottom: Platform.OS === 'android' ? pxToDp(44) : pxToDp(142)
    },
    startBtnInner: {
        flex: 1,
        ...appStyle.flexCenter,
        backgroundColor: "#FF9032",
        borderRadius: pxToDp(120),
    },
    talkBtn: {
        width: pxToDp(280),
        height: pxToDp(80),
        borderRadius: pxToDp(50),
        backgroundColor: '#3e3854',
        ...appStyle.flexCenter,
        position: 'absolute',
        zIndex: 2
    }
});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(Element);
