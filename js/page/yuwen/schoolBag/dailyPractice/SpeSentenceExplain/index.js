import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Platform
} from "react-native";
import { size_tool, pxToDp, padding_tool } from "../../../../../util/tools";
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from 'react-redux';
import RichShowView from "../../../../../component/chinese/RichShowView";
import Sound from "react-native-sound";
import url from "../../../../../util/url";


import Header from "../../../../../component/Header";
import { combineReducers, compose } from "redux";
import { appStyle } from "../../../../../theme";

class SpeSentenceExplain extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            explain: '',
            title: '',
            audio: '',
            isStartAudio: false
        };
        this.audioHelp = undefined;
        this.infoData = this.props.navigation.state.params.data
    }

    componentDidMount() {
        this.getList()

    }
    getList() {
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let infoData = this.props.navigation.state.params.data
        let grade_code = userInfoJs.checkGrade
        let iid = infoData.iid
        console.log('infoData', infoData, userInfoJs)

        axios.get(`${api.getinspect_explain}?iid=${iid}&grade_code=${grade_code}`).then(
            res => {
                if (res.data.err_code === 0) {
                    // console.log('get123', res.data.data)
                    this.setState({
                        explain: res.data.data.explain,
                        title: infoData.name,
                        audio: res.data.data.audio
                    })
                }
            }
        )
    }
    goBack() {
        this.audioHelp && this.audioHelp.stop();
        NavigationUtil.goBack(this.props);
    }
    playHeplAudio = () => {
        const { audio, isStartAudio } = this.state;
        if (this.audioHelp) {
            isStartAudio
                ? this.audioHelp.pause()
                : this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                    }
                });
            this.setState({
                isStartAudio: !isStartAudio,
            });
            return;
        }

        this.audioHelp = new Sound(url.baseURL + audio, null, (error) => {
            if (error) {
                console.log("播放失败", error);
            } else {
                this.audioHelp.setNumberOfLoops(-1);
                this.audioHelp.play((success) => {
                    if (success) {
                        this.audioHelp.release();
                    }
                });
                this.setState(() => ({
                    isStartAudio: true,
                }));
            }
        });
    };
    todoExercise() {
        this.audioHelp && this.audioHelp.stop();
        let infoData = this.props.navigation.state.params.data
        if (infoData.inspect_name.indexOf('智能造句') > -1 && (infoData.name.indexOf('关联词运用') > -1 || infoData.name.indexOf('修辞手法') > -1)) {
            NavigationUtil.toSpeSentenceExerciseOne({ ...this.props, data: { ...infoData, inspect_name: infoData.inspect_name } })
            return
        }
        if (infoData.inspect_name.indexOf('智能造句') > -1 && (infoData.name.indexOf('句型训练') > -1 || infoData.name.indexOf('文化积累') > -1)) {
            NavigationUtil.toSpeSentenceExerciseTwo({ ...this.props, data: { ...infoData, inspect_name: infoData.inspect_name } })
            return
        }
        this.infoData.type === 'spe' ?
            NavigationUtil.toSpeSentenceExerciseSpeLevel({ ...this.props, data: { ...this.infoData } })
            :
            NavigationUtil.toSpeSentenceExercise({ ...this.props, data: { ...this.infoData } })
    }
    goRecord() {
        this.audioHelp && this.audioHelp.stop();
        let infoData = this.props.navigation.state.params.data
        if (infoData.inspect_name.indexOf('智能造句') > -1 && (infoData.name.indexOf('关联词运用') > -1 || infoData.name.indexOf('修辞手法') > -1)) {
            NavigationUtil.toSpeSentenceSpeExerciseRecord({ ...this.props, data: { ...infoData, inspect_name: infoData.inspect_name, type: '1' } })
            return
        }
        if (infoData.inspect_name.indexOf('智能造句') > -1 && (infoData.name.indexOf('句型训练') > -1 || infoData.name.indexOf('文化积累') > -1)) {
            NavigationUtil.toSpeSentenceSpeExerciseRecord({ ...this.props, data: { ...infoData, inspect_name: infoData.inspect_name, type: '2' } })
            return
        }
        NavigationUtil.toSpeSentenceExerciseRecord({ ...this.props, data: { sub_modular: this.infoData.type === 'spe' ? '3' : '2', modular: '1', ... this.props.navigation.state.params.data } })
    }
    render() {
        const { audio, isStartAudio } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#F6EDE4' }}>
                <View style={{
                    width: '100%',
                    height: pxToDp(124)
                }}>
                    {/* 头部 */}
                    <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg2.png')} style={[

                        {
                            width: '100%',
                            height: pxToDp(124),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingLeft: pxToDp(40)
                        },
                    ]}>
                        <TouchableOpacity
                            onPress={() => this.goBack()}
                        >
                            <Image source={require("../../../../../images/chineseDailySpeReadingBtn2.png")}
                                style={[size_tool(64),]} />
                        </TouchableOpacity>

                        <Text style={{ color: "#fff", fontSize: pxToDp(60), fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'jiangxizhuokai' : 'Jiangxizhuokai' }} >
                            能力提升宝典：
                            {this.infoData.type === 'spe' ? this.infoData.inspect_name : this.infoData.name}
                        </Text>
                        <Text></Text>
                    </ImageBackground>
                </View>

                <View style={[{ width: '100%', flex: 1, }, appStyle.flexCenter]}>
                    <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg1.png')} style={[

                        {
                            width: '100%',
                            height: pxToDp(975),
                            alignItems: 'center',
                        },
                    ]}>
                        <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg3.png')} resizeMode={'contain'} style={[

                            {
                                width: pxToDp(1744),
                                height: pxToDp(940),
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            },

                        ]}>
                            <View style={{
                                width: pxToDp(1480),
                                // backgroundColor: '#fff',
                                height: pxToDp(530),
                                marginBottom: pxToDp(95),

                            }}>
                                <ScrollView style={{
                                    // height: pxToDp(530),
                                    flex: 1,
                                }}>
                                    {audio ? (
                                        <TouchableOpacity onPress={this.playHeplAudio}>
                                            {isStartAudio ? (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../../images/stop_icon.png")}
                                                ></Image>
                                            ) : (
                                                <Image
                                                    style={{ width: 48, height: 48 }}
                                                    source={require("../../../../../images/playAudio_icon.png")}
                                                ></Image>
                                            )}
                                        </TouchableOpacity>
                                    ) : null}
                                    <RichShowView
                                        width={pxToDp(1480)}
                                        value={
                                            this.state.explain ? this.state.explain : ''
                                        }
                                    ></RichShowView>
                                </ScrollView>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => this.goRecord()}
                                >
                                    <Image source={require("../../../../../images/chineseDailySpeReadingBtn3.png")}
                                        style={{ width: pxToDp(280), height: pxToDp(110), marginRight: pxToDp(62) }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.todoExercise()}

                                >
                                    <Image source={require("../../../../../images/chineseDailySpeReadingBtn1.png")}
                                        style={{ width: pxToDp(280), height: pxToDp(110), }} />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>

                    </ImageBackground>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    header: {
        height: pxToDp(110),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        position: "relative",
        justifyContent: 'space-between'
    },
    left: {
        width: '100%',
        height: pxToDp(590),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40),
    },

    topItem: {
        width: pxToDp(954),
        height: pxToDp(124),
        marginRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pxToDp(32)
    },

});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"])

    }
}

const mapDispathToProps = (dispatch) => {
    return {

    }
}


export default connect(mapStateToProps, mapDispathToProps)(SpeSentenceExplain)
