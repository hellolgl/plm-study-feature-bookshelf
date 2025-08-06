import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { pxToDp, getIsTablet } from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
import { RecordingStatus } from "../../../../util/storyRecord";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'
import PlayAudioBtn from '../../../../component/PlayAudioBtn'
import PlayIcon from '../../../../component/PlayIcon'

function ScoringTools({ microphone, getScoreInfo, scoreInfo }) {
    const [recordFilePath, setRecordFilePath] = useState('')
    const [showTryTip, setShowTryTip] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const dispatch = useDispatch();
    const { playingAudio, recordingStatus } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const renderScoreArea = () => {
        const totalScore = _.get(scoreInfo, 'total_score', 0);
        if (totalScore > 0) {
            const color = totalScore > 85 ? '#58C88B' : '#FF746C'
            return <View style={[appStyle.flexLine, styles.scoreWrap]}>
                <Text style={[styles.num, { color }]}>{totalScore}</Text>
                <Text style={[styles.fen, { color }]}>分</Text>
            </View>
        }
        return <Text style={[styles.try]}>再试试！</Text>
    }
    const renderContent = () => {
        switch (recordingStatus) {
            case RecordingStatus.hang:
                return <View style={[appStyle.flexLine]}>
                    <TouchableOpacity onPress={() => {
                        // console.log("path: ", microphone.getAudioPath());
                        microphone.startRecord();
                        dispatch({
                            type: "audio/setRecordingStatus",
                            data: RecordingStatus.recording,
                        });
                    }}>
                        <Image resizeMode='stretch' style={[styles.img]} source={require('../../../../images/square/microphone.png')}></Image>
                    </TouchableOpacity>
                    <Text style={[styles.txt1, { color: 'rgba(40, 49, 57, .5)' }]}>{showTryTip ? '再试试！' : '点击开始语音测评'}</Text>
                </View>
            case RecordingStatus.recording:
                return <View style={[appStyle.flexLine, appStyle.flexCenter, { width: pxToDp(460) }]}>
                    <TouchableOpacity onPress={async () => {
                        setShowLoading(true)
                        const scoreInfo = await microphone.endRecord();
                        console.log("scoreInfo: ", scoreInfo)
                        if (!scoreInfo.children || !scoreInfo.children.length) {
                            dispatch({
                                type: "audio/setRecordingStatus",
                                data: RecordingStatus.hang,
                            });
                            setShowTryTip(true)
                        } else {
                            getScoreInfo(scoreInfo)
                            const recordFilePath = microphone.getAudioPath()
                            setRecordFilePath(recordFilePath)
                            dispatch({
                                type: "audio/setRecordingStatus",
                                data: RecordingStatus.finish,
                            });
                            setShowTryTip(false)
                        }
                        setShowLoading(false)
                    }}>
                        <Image resizeMode='stretch' style={[styles.img]} source={require('../../../../images/square/microphone_stop.png')}></Image>
                    </TouchableOpacity>
                    {showLoading ? <View style={[{ position: "absolute", right: pxToDp(36) }]}>
                        <PlayIcon
                            style={[styles.loading]}
                            playing={true}
                            source={{
                                uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/loading1.json",
                            }}
                        >
                        </PlayIcon>
                    </View> : <Text style={[styles.try]}>录音中...</Text>}
                </View>
            case RecordingStatus.finish:
                return <View style={[styles.finishWrap, appStyle.flexLine, appStyle.flexCenter]}>
                    <View style={[styles.playIcon]}>
                        <PlayAudioBtn audioUri={recordFilePath}>
                            <PlayIcon
                                playing={recordFilePath && recordFilePath === playingAudio}
                                style={[styles.recordPlayIconLottie]}
                                source={{
                                    uri: "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/lottie/audio2.json",
                                }}
                            >
                                <Image
                                    resizeMode="stretch"
                                    style={[styles.playIconImg]}
                                    source={require('../../../../images/square/play_icon_1.png')}
                                />
                            </PlayIcon>
                        </PlayAudioBtn>
                    </View>
                    <TouchableOpacity onPress={() => {
                        // console.log("path: ", microphone.getAudioPath());
                        microphone.startRecord();
                        dispatch({
                            type: "audio/setRecordingStatus",
                            data: RecordingStatus.recording,
                        });
                    }}>
                        <Image resizeMode='stretch' style={[styles.img]} source={require('../../../../images/square/microphone.png')}></Image>
                    </TouchableOpacity>
                    {renderScoreArea()}
                </View>
        }
    }
    return (
        <>
            {renderContent(recordingStatus)}
        </>
    );
}
const styles = StyleSheet.create({
    img: {
        width: pxToDp(112),
        height: pxToDp(117),
    },
    txt1: {
        fontSize: pxToDp(33),
        position: 'absolute',
        left: pxToDp(36 + 112),
        fontWeight: "bold"
    },
    finishWrap: {
        width: pxToDp(460),
        height: pxToDp(83),
        borderRadius: pxToDp(40),
        backgroundColor: "#FFFBE8",
        borderWidth: pxToDp(3),
        borderColor: '#FF9C48',
    },
    playIcon: {
        position: "absolute",
        left: pxToDp(60)
    },
    playIconImg: {
        width: pxToDp(36),
        height: pxToDp(39),
    },
    recordPlayIconLottie: {
        width: pxToDp(50),
        height: pxToDp(50),
    },
    scoreWrap: {
        position: "absolute",
        right: pxToDp(16)
    },
    num: {
        fontSize: pxToDp(46),
        fontWeight: "bold"
    },
    fen: {
        fontSize: pxToDp(33),
        fontWeight: 'bold'
    },
    try: {
        color: '#AEADA9',
        fontSize: pxToDp(33),
        fontWeight: 'bold',
        position: "absolute",
        right: pxToDp(16)
    },
    loading: {
        width: pxToDp(100),
        height: pxToDp(70),
    }

})
export default ScoringTools;
