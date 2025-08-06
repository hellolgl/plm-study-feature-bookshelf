import React, { PureComponent } from "react"
import Video from 'react-native-video'

const log = console.log.bind(console)

class Audio extends PureComponent {
    constructor(props) {
        super(props)

        this.player = {
            ref: Video,
        }
    }

    onEnd = () => {
        const { pausedEvent } = this.props
        pausedEvent()
        // this.player.ref.seek(0)
    }

    replay = () => {
        console.log("audio component play: ", this.props.uri)
        this.player.ref.seek(0)
    }

    onError = (err) => {
        log("audio component err: ", err.error)
    }

    componentWillUnmount() {
        log("audio compoment will un mount")
    }

    render() {
        const { uri, paused, isLocal } = this.props
        log("## audio component: ", isLocal, uri)
        return (
            <Video
                ref={videoPlayer => {
                    this.player.ref = videoPlayer
                }}
                paused={paused}
                source={isLocal ? uri : {
                    uri: uri,
                }}
                onEnd={this.onEnd}
                onError={this.onError}
                ignoreSilentSwitch={'ignore'}
                onProgress={(data) => {
                    // data.currentTime 是当前播放的时间（秒）
                    // data.playableDuration 是视频的总时长（秒）
                    if (data.playableDuration && data.currentTime / data.playableDuration > 0.95) {
                        const { soonEnd } = this.props
                        soonEnd && soonEnd()
                    }
                }}
            />
        )
    }
}

export default Audio