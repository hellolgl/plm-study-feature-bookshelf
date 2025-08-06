import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import { appStyle } from "../../../../../theme";
import url from "../../../../../util/url";
import Audio from "../../../../../util/audio"

import { pxToDp, size_tool } from "../../../../../util/tools";
let baseUrl = url.baseURL;

class ConnectionOptions extends PureComponent {
    constructor(props) {
        super(props);
        // console.log('==============',this.props.sendobj)
        this.state = {
            paused: true,
        }
        this.audio = React.createRef()

    }
    audioPlay = () => {
        const { paused } = this.state
        if (!paused) {
            this.audio.current.replay()
            return
        }
        this.setState({
            paused: false
        })
    }
    audioPaused = () => {
        this.setState({
            paused: true
        })
    }
    render() {
        const { paused } = this.state;
        return (
            <View style={[]}>
                <TouchableOpacity onPress={this.audioPlay}>
                    <Image
                        style={[size_tool(150, 60)]}
                        source={require("../../../../../images/line_play.png")}
                        resizeMode={"contain"}
                    ></Image>
                </TouchableOpacity>
                <Audio uri={baseUrl + this.props.uri} paused={paused} pausedEvent={this.audioPaused} ref={this.audio} />

            </View>
        );
    }
}

const styles = StyleSheet.create({

});

export default ConnectionOptions;
