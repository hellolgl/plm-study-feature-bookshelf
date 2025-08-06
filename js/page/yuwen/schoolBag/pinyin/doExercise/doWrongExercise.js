import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Dimensions
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
import LookPinyinWordItem from '../../../../../component/chinese/pinyin/LookPinyinWordItem'
import MixExercise from './mix/DoExercise'
import CheckExercise from './checkExercise'
import Audio from "../../../../../util/audio"
import SpeakExercise from './speakExercise'

class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        let language_data = props.language_data.toJS()
        this.state = {
            exercise: [props.navigation.state.params.data],
            pausedSuccess: true,
            listindex: 0,
            language_data,
            visibleGood: false
        };
        this.successAudiopath = require('../../../../../res/data/good.mp3');
        this.successAudiopath2 = require('../../../../../res/data/good2.mp3');
        this.successAudiopath3 = require('../../../../../res/data/good3.mp3');

    }
    componentDidMount() {
        this.getList()

    }
    getList = () => {

    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    }


    saveExercise = (value) => {
        let flag = true, audioFlag = true
        let arr = ['', '2', '3']
        console.log('做完了做完了=======', value.correct)
        if (value.correct === 1) {
            flag = false
        }
        let audioindex = Math.floor(Math.random() * 3)

        this.setState({
            pausedSuccess: flag,
            audioIndex: arr[audioindex] + '',
            visibleGood: !flag,
        })
        if (!flag) {
            setTimeout(() => {
                this.setState({
                    visibleGood: false,
                }, () => {

                })
            }, 500);
        }
    }
    audioPausedSuccess = () => this.setState({ pausedSuccess: true, })

    render() {
        const { exercise, listindex, pausedSuccess, audioIndex, language_data } = this.state
        const { show_translate } = language_data
        { console.log("item.stem", exercise[0]) }

        return (
            <ImageBackground
                source={Platform.OS === 'ios' ? require('../../../../../images/chineseHomepage/pingyin/new/wrapBgIos.png') : require('../../../../../images/chineseHomepage/pingyin/new/wrapBg.png')}
                style={[, { flex: 1, position: 'relative', paddingTop: Platform.OS === 'ios' ? pxToDp(40) : 0 }]}>

                <TouchableOpacity
                    onPress={this.goBack}
                    style={[{ position: 'absolute', top: pxToDp(48), left: pxToDp(48), zIndex: 99999 }]}>
                    <Image
                        source={require('../../../../../images/chineseHomepage/pingyin/new/back.png')}
                        style={[size_tool(120, 80),
                        ]}
                    />

                </TouchableOpacity>

                <View style={[{ flex: 1, },
                appStyle.flexTopLine, appStyle.flexCenter,
                padding_tool(140, 80, 80, 80),
                ]}>
                    <View
                        style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#fff', borderRadius: pxToDp(80), }]}
                    >
                        {
                            exercise.length > 0 ?
                                <View style={[{
                                    flex: 1, width: '100%',
                                }, appStyle.flexCenter,
                                ]}>
                                    {exercise.length > 0 && exercise[listindex]?.exercise_type_private === '3' ?
                                        <MixExercise exercise={{
                                            ...exercise[listindex],
                                            knowledgepoint_explanation: show_translate ? exercise[listindex].knowledgepoint_explanation + exercise[listindex].translate_explanation.en : exercise[listindex].knowledgepoint_explanation
                                        }} show_translate={show_translate} saveExercise={this.saveExercise} isWrong={true} /> :
                                        null}

                                    {exercise.length > 0 && exercise[listindex]?.exercise_type_private === '2' ?
                                        <CheckExercise exercise={{
                                            ...exercise[listindex],
                                            knowledgepoint_explanation: show_translate ? exercise[listindex].knowledgepoint_explanation + exercise[listindex].translate_explanation.en : exercise[listindex].knowledgepoint_explanation,
                                        }} show_translate={show_translate} saveExercise={this.saveExercise} isWrong={true} /> : null}
                                    {exercise.length > 0 && exercise[listindex]?.exercise_type_private === '1' ?
                                        <SpeakExercise exercise={{
                                            ...exercise[listindex],
                                            knowledgepoint_explanation: show_translate ? exercise[listindex].knowledgepoint_explanation + exercise[listindex].translate_explanation.en : exercise[listindex].knowledgepoint_explanation,
                                        }} show_translate={show_translate} saveExercise={this.saveExercise} isWrong={true} /> : null}


                                </View>
                                :
                                <View style={[{ flex: 1, paddingTop: Platform.OS === 'ios' ? pxToDp(200) : 0 }]}>
                                    <ImageBackground
                                        source={require('../../../../../images/chineseHomepage/chineseNoExercise.png')}
                                        style={[size_tool(760, 770), appStyle.flexCenter, padding_tool(0, 30, 300, 0),]}
                                        resizeMode={"contain"}
                                    >
                                        <Text style={[{ fontSize: pxToDp(56), color: '#b75526', fontFamily: Platform.OS === 'ios' ? 'Muyao-Softbrush' : 'Muyao-Softbrush-2', }]}>暂无习题</Text>
                                    </ImageBackground>
                                </View>
                        }

                    </View>

                </View>

                {
                    pausedSuccess ? null :
                        <Audio isLocal={true} uri={`${audioIndex === '3' ? this.successAudiopath3 : audioIndex === '2' ? this.successAudiopath2 : this.successAudiopath}`} paused={pausedSuccess} pausedEvent={this.audioPausedSuccess} ref={this.audio1} />

                }
                {/* <Audio isLocal={true} uri={`${this.failAudiopath}`} paused={pausedfail} pausedEvent={this.audioPausedSuccess} ref={this.audio1} /> */}
                {
                    this.state.visibleGood ?
                        <View style={[
                            appStyle.flexCenter,
                            {
                                width: '100%',
                                height: Dimensions.get('window').height,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                position: 'absolute',
                                left: 0,
                                top: 0
                            }
                        ]}>
                            <Image style={[size_tool(660)]} source={require('../../../../../images/chineseHomepage/pingyin/new/good.png')} />

                        </View>
                        : null
                }
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink"
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