import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import api from '../../../../../util/http/api'
import axios from '../../../../../util/http/axios'
import Audio from "../../../../../util/audio/audio"

export default class WordModal extends Component {
  constructor(props) {
    super(props);
    this.audioRef = null
    this.state = {
      detail_map:{}
    }
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  onShow = () => {
    const {word} = this.props
    const {detail_map} = this.state
    let _d = JSON.parse(JSON.stringify(detail_map))
    // console.log('pppppp',_d[word] )
    if(_d[word]){
      if(_d[word].speech) this.audioRef && this.audioRef.onPlay()
      return
    } 
    axios.post(api.getProgramEnglishDetails,{q:word}).then(res => {
      _d[word] = res.data.data
      this.setState({
        detail_map:_d
      },()=>{
        if(res.data.data.speech) this.audioRef && this.audioRef.onPlay()
      })
    })
  }

  render() {
    const {visible,word} = this.props
    const {detail_map} = this.state
    const detail = detail_map[word]
    let phonetic = ''
    let speech = ''
    let translation = ''
    if(detail){
      phonetic = detail.phonetic
      speech = detail.speech
      translation = detail.translation
    }
    return (
      <Modal
          animationType="fade"
          transparent
          visible={visible}
          onShow={this.onShow}
          supportedOrientations={['portrait', 'landscape']}
        >   
            <View style={[styles.container]}>
                <View style={[styles.content]}>
                    <View style={[styles.content_inner]}>
                      {!detail?<ActivityIndicator size="large" color="#4F99FF" />:Object.keys(detail).length?<>
                      {speech?                      <View style={[styles.play_btn]}>
                        <Audio
                            audioUri={speech}
                            pausedBtnImg={require("../../../../../images/mathProgramming/xm_play_audio.png")}
                            pausedBtnStyle={{ width: pxToDp(280), height: pxToDp(228) }}
                            playBtnImg={require("../../../../../images/mathProgramming/xm_play_audio.png")}
                            playBtnStyle={{ width: pxToDp(280), height: pxToDp(228) }}
                            onRef={(ref) => { this.audioRef = ref }}
                        />
                      </View>:null}
                        <View style={[styles.wrap]}>
                          {phonetic?<Text style={[{color:"#2D2D40",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_500,Platform.OS === 'ios'?{marginBottom:pxToDp(40)}:null]}>/{phonetic}/</Text>:null}
                          <Text style={[{color:"#2D2D40",fontSize:pxToDp(80)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{marginBottom:pxToDp(40),lineHeight:pxToDp(90)}:null]}>{word}</Text>
                          {translation?<Text style={[{color:"#2D2D40",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>{translation}</Text>:null}
                        </View>
                      </>:<Text style={[{fontSize:pxToDp(36),textAlign:'center'},appFont.fontFamily_jcyt_700]}>暂无数据</Text>}
                    </View>
                </View>
                <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                    <View style={[styles.btn_inner]}>
                    <Text style={[{color:"#2D2D40",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>x</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.80)",
        ...appStyle.flexCenter
    },
    btn:{
      width:pxToDp(270),
      height:pxToDp(128),
      borderRadius:pxToDp(140),
      backgroundColor:"#FFB649",
      marginTop:pxToDp(-64),
      paddingBottom:pxToDp(8)
    },
    btn_inner:{
      flex:1,
      backgroundColor:"#FFDB5D",
      borderRadius:pxToDp(140),
      ...appStyle.flexCenter
    },
    content:{
        width:pxToDp(1100),
        backgroundColor:"#DAE2F2",
        borderRadius:pxToDp(80),
        paddingBottom:pxToDp(8)
    },
    content_inner:{
        borderRadius:pxToDp(80),
        backgroundColor:"#fff",
        paddingTop:pxToDp(100),
        paddingBottom:pxToDp(100),
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40)
    },
    wrap:{
        backgroundColor:"rgba(45, 45, 64, 0.05)",
        borderRadius:pxToDp(40),
        paddingTop:pxToDp(80),
        paddingLeft:pxToDp(60),
        paddingRight:pxToDp(60),
        paddingBottom:pxToDp(40)
    },
    play_btn:{
        position:'absolute',
        top:pxToDp(60),
        right:pxToDp(100),
        zIndex:1
    }
});
