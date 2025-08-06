
import React from "react"
import { Image, TouchableOpacity, View, Text } from "react-native"
import Sound from 'react-native-sound'
import { EventRegister } from 'react-native-event-listeners'
import _ from "lodash"


class AudioBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            paused: true,
        }
        this.eventListener = undefined
        this.sound = undefined
    }

    componentDidMount() {
        this.eventListener = EventRegister.addEventListener('recordEvent', (data) => {
            this.setState({
                paused: true,
            })
        })
        this.props.onRef?this.props.onRef(this):null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.audioUri, prevProps.audioUri)) {
            if (this.sound) {
                this.pausedEvent()
                this.sound = undefined
            }
        }
    }

    componentWillUnmount() {
        if (this.eventListener !== undefined) {
            EventRegister.removeEventListener(this.eventListener)
        }
        this.setState({
            paused: true,
        })
    }

    pausedEvent = () => {
        try {
            this.sound.pause()
        } catch (err) {
            console.log("pause audio error: ", err)
        } finally {
            this.setState({
                paused: true
            })
        }
    }

    successEvent = () => {
        console.log("play success...")
        this.pausedEvent()
        try {
            this.sound.release()
            this.sound = undefined
        } catch (err) {
            console.log("release audio err: ", err)
        }
    }

    onPlay() {
        const url = this.props.audioUri
        EventRegister.emit('stopRecord', '')
        // 处理音频以 # 结尾时播放异常问题
        if (url.endsWith("#")) {
            url = url.slice(0, url.length - 1)
        }
        const { paused } = this.state
        Sound.setCategory('Playback')
        if (this.sound === undefined) {
            this.sound = new Sound(`${url}`, null, (error) => {
                if (error) {
                    console.log(error)
                } else {
                    this.setState({
                        paused: false
                    })
                    try {
                        this.sound.play((success) => {
                            if (success) {
                                this.successEvent()
                            } else {
                                console.log('playback failed due to audio decoding errors');
                            }
                        })
                        this.sound.setSpeed(this.props.rate? this.props.rate:1)
                        this.props.onStartEvent && this.props.onStartEvent()
                    } catch (err) {
                        console.log("!!!!! catch play err: ", err)
                    }
                }
            })
        } else if ((paused === true) && (this.sound !== undefined)) {
            this.sound.play((success) => {
                console.log('success')
                if (success) {
                    this.successEvent()
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            })
            this.setState({
                paused: false,
            })
        } else {
            console.log('-------', paused, this.sound)
        }
    }

    render() {
        return (
            <></>
        )
    }
}

export default AudioBtn
