import React from "react"
import { Image, PanResponder, View, Animated } from "react-native"
import * as _ from "lodash"
import { EventRegister } from 'react-native-event-listeners'

import Record from "../../util/record"
import { pxToDp } from "../../util/tools";
import { Toast } from "antd-mobile-rn"
import { appStyle } from "../../theme";
import { connect } from "react-redux";
import Sound from "react-native-sound";

class Microphone extends React.Component {
    constructor(props) {
        super(props)
        this.panResponder = null
        this.scaleValue = new Animated.Value(1)
        this.opacity = new Animated.Value(1)
        this.state = {
            recording: false,
        }
        this._createResponder()
        this.recordRef = React.createRef()
    }

    startRecordEvent = () => {
        const { animation, token } = this.props
        console.log("startRecordEvent")
        if (token) {
            this.recordRef.current.start()
            EventRegister.emit('recordEvent', '')
            if (animation) this.start()
        }
        this.props.onStartRecordEvent()
    }

    start = () => {
        const animationArr = Animated.sequence([
            Animated.parallel([
                Animated.timing(this.scaleValue, {
                    toValue: 0.8,
                    duration: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(
                    this.opacity,
                    {
                        toValue: 1,
                        duration: 1,
                        useNativeDriver: true,
                    }
                ),
            ]),
            Animated.parallel([
                Animated.timing(this.scaleValue, {
                    toValue: 1.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(
                    this.opacity,
                    {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }
                ),
            ]),
        ]);
        Animated.loop(animationArr, {
        }).start();
    }

    stop = () => {
        this.scaleValue.setValue(1)
        this.opacity.setValue(1)
    }

    endRecordEvent = async () => {
        const { token } = this.props
        if (!token) return
        const { animation } = this.props
        Toast.info('评分中', 2)
        const score = await this.recordRef.current.stop()
        if (animation) this.stop()
        console.log('分数', score)
        this.props.onFinishRecordEvent(score["total_score"])
    }

    _createResponder = () => {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.setState({
                    recording: true,
                }, () => {
                    this.startRecordEvent()
                })
            },
            onPanResponderMove: (evt, gestureState) => {

            },
            onPanResponderRelease: (evt, gestureState) => {
                this.setState({
                    recording: false,
                }, () => {
                    Sound.setCategory("Playback");
                    this.endRecordEvent()
                })
            },
        })
    }

    render() {
        const { iseInfo, microphoneImg, microphoneImgStyle, activeMicrophoneImg, activeMicrophoneImgStyle, waveStyle, soundWavePosition, lineColor, animationBorderColor, animation } = this.props
        const { recording } = this.state
        const recordIndex = _.cloneDeep(iseInfo["index"])
        console.log('iseinfo', iseInfo)
        return (
            <View style={[{ position: 'relative' }]}>
                {animation ? <Animated.View style={[appStyle.flexCenter, {
                    width: pxToDp(200),
                    height: pxToDp(200),
                    borderRadius: pxToDp(200),
                    borderColor: animationBorderColor ? animationBorderColor : '#4D96FF',
                    borderWidth: pxToDp(4),
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 0,
                },
                {
                    transform: [
                        {
                            scale: this.scaleValue,
                        },
                    ],
                    opacity: this.opacity
                }, activeMicrophoneImgStyle]}></Animated.View> : null}
                <Animated.View>
                    <View
                        key={recordIndex}
                        {...this.panResponder.panHandlers}
                    >
                        {
                            recording ?
                                <Image style={activeMicrophoneImgStyle} source={activeMicrophoneImg} resizeMode='contain'></Image>
                                :
                                <Image style={microphoneImgStyle} source={microphoneImg} resizeMode='contain'></Image>
                        }
                    </View>
                </Animated.View>
                <Record
                    recordIndex={recordIndex}
                    iseInfo={iseInfo}
                    ref={this.recordRef}
                    waveStyle={waveStyle}
                    soundWavePosition={soundWavePosition}
                    lineColor={lineColor}
                />
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.getIn(["userInfo", "token"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(Microphone);
