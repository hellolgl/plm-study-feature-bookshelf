import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import api from '../../../../../util/http/api'
import axios from '../../../../../util/http/axios'
import RichShowViewHtml from '../../../../../component/math/RichShowViewHtml'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { qtcreatorDark } from 'react-syntax-highlighter/styles/hljs'

export default class KnowledgeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail_map:{}
    }
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  onShow = () => {
    const {knowledge} = this.props
    const {detail_map} = this.state
    let _d = JSON.parse(JSON.stringify(detail_map))
    if(_d[knowledge]) return
    axios.post(api.getProgramKnowledgeDetails,{point:knowledge}).then(res => {
        _d[knowledge] = res.data.data
        this.setState({
            detail_map:_d
        })
    })
  }

  render() {
    const {visible,knowledge} = this.props
    const {detail_map} = this.state
    const detail = detail_map[knowledge]?detail_map[knowledge]:{}
    const {analysis,example,note} = detail
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
                    <View style={[styles.content_inner,!Object.keys(detail).length?appStyle.flexCenter:null]}>
                      {!Object.keys(detail).length?<ActivityIndicator size="large" color="#4F99FF" />:<>
                        <Text style={[{color:"#2D2D40",fontSize:pxToDp(48),textAlign:"center"},appFont.fontFamily_jcyt_700]}>{knowledge}</Text>
                        <ScrollView style={[styles.wrap]} contentContainerStyle={{
                            paddingTop:pxToDp(80),
                            paddingLeft:pxToDp(60),
                            paddingRight:pxToDp(60),
                            paddingBottom:pxToDp(100),
                        }}>
                            <RichShowViewHtml value={analysis} size={36} color={'#242433'} haveStyle={true} p_style={{lineHeight:pxToDp(60)}} span_style={{lineHeight:pxToDp(60)}}></RichShowViewHtml>
                            <View style={[{padding:pxToDp(20),borderRadius:pxToDp(40),backgroundColor:"#000",marginBottom:pxToDp(20)},Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
                                <SyntaxHighlighter fontSize={Platform.OS === 'android'?pxToDp(26):pxToDp(36)} language="python" highlighter={'hljs'} style={qtcreatorDark}>
                                    {example}
                                </SyntaxHighlighter>
                            </View>
                            <RichShowViewHtml value={note} size={36} color={'#242433'} haveStyle={true} p_style={{lineHeight:pxToDp(60)}} span_style={{lineHeight:pxToDp(60)}}></RichShowViewHtml>
                        </ScrollView>
                      </>}
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
        width:'90%',
        backgroundColor:"#DAE2F2",
        borderRadius:pxToDp(80),
        paddingBottom:pxToDp(8),
        height:"80%"
    },
    content_inner:{
        borderRadius:pxToDp(80),
        backgroundColor:"#fff",
        paddingTop:Platform.OS === 'ios'?pxToDp(40):pxToDp(20),
        paddingBottom:pxToDp(100),
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        flex:1
    },
    wrap:{
        backgroundColor:"rgba(45, 45, 64, 0.05)",
        borderRadius:pxToDp(40),
        marginTop:Platform.OS === 'ios'?pxToDp(40):pxToDp(20)
    },
    play_btn:{
        position:'absolute',
        top:pxToDp(60),
        right:pxToDp(100),
        zIndex:1
    }
});
