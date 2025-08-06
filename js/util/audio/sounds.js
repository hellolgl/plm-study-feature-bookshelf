import React from 'react'
import { View, Image, Text, TouchableOpacity, Platform, Alert} from 'react-native';

import Sound from 'react-native-sound';

const log = console.log.bind(console)

export default class PlayerScreen extends React.Component{

    static navigationOptions = props => ({
        title:props.navigation.state.params.title,
    })

    constructor(){
        super();
        this.state = {
            playState:'paused', //playing, paused
        }
    }

    componentDidMount(){
        const {uri, } = this.props
        this.sound = new Sound(uri, null, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                // Alert.alert('Notice', 'audio file error. (Error code : 1)');
                this.setState({playState:'paused'});
            }else{
                this.setState({playState:'playing', });
            }
        });
    }

    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    play = async () => {
        this.sound.play(this.playComplete);
        this.setState({playState:'playing'});
    }

    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                setTimeout(() => {
                    this.play()
                }, 500)
            }
            this.setState({playState:'paused', });
            this.sound.setCurrentTime(0);
        }
    }

    replay = () => {
        // this.sound.setCurrentTime(0);
        this.sound.play(this.playComplete);
    }

    pause = () => {
        if(this.sound){
            this.sound.pause();
        }

        this.setState({playState:'paused'});
    }

    render(){
        return (
            <View>
            </View>
        )
    }
}