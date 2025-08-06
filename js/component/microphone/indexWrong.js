import React from "react"
import { Image, PanResponder, View, Animated, } from "react-native"
import * as _ from "lodash"
import { EventRegister } from 'react-native-event-listeners'

import Record from "../../util/record/indexWrong"
import { size_tool, pxToDp, borderRadius_tool, } from "../../util/tools";
import { appStyle, } from "../../theme";

class Microphone extends React.Component {
    constructor(props) {
        super(props)
        this.panResponder = null
        this.scaleValue = new Animated.Value(1)
        this.opacity = new Animated.Value(1)
        this.scaleValue1 = new Animated.Value(1)
        this.state = {
            recording: false,
        }
        this._createResponder()
        // this.recordRef = React.createRef()
    }

    startRecordEvent = () => {
        // console.log("startRecordEvent")
        // this.recordRef.current.start()
        this.props.onStartRecordEvent()
        // EventRegister.emit('recordEvent', '')
        this.start()
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
                Animated.timing(this.scaleValue1, {
                    toValue: 0.8,
                    duration: 500,
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
            // Animated.delay(100),

            // Animated.parallel([
            //     Animated.timing(this.scaleValue2, {
            //         toValue: 1.3,
            //         duration: 400,
            //         useNativeDriver: true,
            //     }),
            //     Animated.timing(
            //         this.opacity2,
            //         {
            //             toValue: 0,
            //             duration: 400,
            //             useNativeDriver: true,
            //         }
            //     ),

            // ]),
            // Animated.parallel([
            //     Animated.timing(this.scaleValue, {
            //         toValue: 1,
            //         duration: 800,
            //         useNativeDriver: true,
            //     }),

            //     Animated.timing(
            //         this.opacity,
            //         {
            //             toValue: 1,
            //             duration: 800,
            //             useNativeDriver: true,
            //         }
            //     ),

            // ]),


        ]);
        Animated.loop(animationArr, {
            // iterations: -1, // -1 means infinite loop
        }).start();

    }
    stop = () => {
        this.scaleValue.setValue(1)
        this.opacity.setValue(1)
        this.scaleValue1.setValue(1)
        // Animated.stop()

    }
    endRecordEvent = async () => {
        console.log('分数123')
        // Toast.info('评分中', 3)
        this.stop()
        const score = await this.recordRef.current.stop()

        console.log('分数: ', score)
        this.props.onFinishRecordEvent(score)
        // this.props.onFinishRecordEvent(100)
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
                    this.endRecordEvent()
                })
            },
        })
    }

    render() {
        const { iseInfo, microphoneImg, microphoneImgStyle, activeMicrophoneImg, activeMicrophoneImgStyle, waveStyle, soundWavePosition } = this.props
        console.log("iseInfo: ", iseInfo)
        const { recording } = this.state
        // const recordIndex = _.cloneDeep(iseInfo["index"])
        return (
            <View style={[{ position: 'relative' }]}>
                <Animated.View style={[size_tool(200), appStyle.flexCenter, {
                    borderRadius: pxToDp(200),
                    borderColor: '#447BE5',
                    borderWidth: pxToDp(4),
                    position: 'absolute',
                    left: 0, top: 0, zIndex: 0,

                },
                {
                    transform: [
                        {
                            // rotateZ: this.rotateValue.interpolate({
                            //     inputRange: [0, 1],
                            //     outputRange: this.state.isOpacity ? ["-20deg", "20deg"] : ["0deg", "30deg"],
                            // }),
                            scale: this.scaleValue,
                        },
                    ],
                    opacity: this.opacity
                }
                ]}>

                </Animated.View>

                <Animated.View style={[size_tool(200), appStyle.flexCenter, {
                },
                {
                    transform: [
                        {
                            // rotateZ: this.rotateValue.interpolate({
                            //     inputRange: [0, 1],
                            //     outputRange: this.state.isOpacity ? ["-20deg", "20deg"] : ["0deg", "30deg"],
                            // }),
                            scale: this.scaleValue1,
                        },
                    ],

                }
                ]}>
                    <View
                        // key={recordIndex}
                        {...this.panResponder.panHandlers}
                    >
                        {/* {
                        recording ?
                            <Image style={activeMicrophoneImgStyle} source={activeMicrophoneImg} resizeMode='contain'></Image>
                            :
                            <Image style={microphoneImgStyle} source={microphoneImg} resizeMode='contain'></Image>
                    } */}
                        <View style={[size_tool(200), { paddingBottom: pxToDp(10), backgroundColor: '#447BE5' }, borderRadius_tool(200),]}>
                            <View style={[{ flex: 1, backgroundColor: '#4C94FF' }, appStyle.flexCenter, borderRadius_tool(200)]}>
                                <Image source={require('../../images/english/abcs/icon.png')}

                                    style={[size_tool(80)]} />
                            </View>
                        </View>
                    </View>
                </Animated.View>


                {/* <Record
                    recordIndex={recordIndex}
                    iseInfo={iseInfo}
                    ref={this.recordRef}
                    waveStyle={waveStyle}
                    soundWavePosition={soundWavePosition}
                /> */}
            </View >
        )
    }
}

export default Microphone
