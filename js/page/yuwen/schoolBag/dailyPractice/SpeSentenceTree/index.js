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
import SpeSentenceTreeModal from '../../../../../component/chinese/SpeSentenceTreeModal'
import { appStyle, appFont } from "../../../../../theme";

class SpeSentenceTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            explain: '',
            title: '',
            audio: '',
            isStartAudio: false
        };
        this.audioHelp = undefined;
        this.treeModal = React.createRef();
        this.infoData = this.props.navigation.state.params.data
        this.name = this.props.navigation.state.params.data.inspect_name
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
    goExplain = (value) => {
        NavigationUtil.toSpeSentenceExplain({ ...this.props, data: { ...value, inspect_name: this.name } })
    }
    render() {
        const { audio, isStartAudio } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#F6EDE4' }}>
                <View style={{
                    height: pxToDp(124),
                }}>
                    {/* 头部 */}
                    <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg2.png')} style={[
                        {
                            height: pxToDp(124),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingLeft: pxToDp(40),
                            paddingRight: pxToDp(40)
                        },
                    ]}>
                        <TouchableOpacity
                            onPress={() => this.goBack()}
                            style={{ width: pxToDp(340) }}
                        >
                            <Image source={require("../../../../../images/chineseDailySpeReadingBtn2.png")}
                                style={[size_tool(64),]} />
                        </TouchableOpacity>
                        <Text style={{ color: "#fff", fontSize: pxToDp(60), fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'jiangxizhuokai' : 'Jiangxizhuokai', }} >{this.name}</Text>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(32), width: pxToDp(340) }, appFont.fontFamily_syst]}>横向滚动查看更多模块</Text>

                    </ImageBackground>
                </View>
                <ImageBackground source={require('../../../../../images/chineseDailySpeReadingBg1.png')}
                    style={[appStyle.flexCenter, {
                        flex: 1
                    }]} resizeMode={'stretch'}>
                    <View style={[{
                        width: pxToDp(2050),
                        height: pxToDp(1000),
                        paddingTop: pxToDp(82), paddingLeft: pxToDp(80), paddingRight: pxToDp(80)
                    }]}>
                        <SpeSentenceTreeModal infoData={this.infoData} goExplain={this.goExplain}></SpeSentenceTreeModal>
                    </View>
                </ImageBackground>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
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


export default connect(mapStateToProps, mapDispathToProps)(SpeSentenceTree)
