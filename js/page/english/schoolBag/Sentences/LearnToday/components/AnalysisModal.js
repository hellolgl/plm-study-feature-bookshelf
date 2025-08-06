/**圆形卡片组件 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native'
import { size_tool, pxToDp, borderRadius_tool, } from "../../../../../../util/tools";
import { appStyle, appFont } from '../../../../../../theme';
import { haveNbsp } from '../../tools'
import RichShowViewHtml from '../../../../../../component/math/RichShowViewHtml'
import Audio from "../../../../../../util/audio/audio"

import url from "../../../../../../util/url";

const ranking_map = {
  "0": "Well done!",
  "1": "It's ok!",
  "2": "Try again!",
};

const ranking_icon_map = {
  '0':require('../../../../../../images/EN_Sentences/icon_3.png'),
  '1':require('../../../../../../images/EN_Sentences/icon_1.png'),
  '2':require('../../../../../../images/EN_Sentences/icon_2.png'),
}
let baseUrl = url.baseURL;

export default class AnalysisModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderLine = () => {
    return <View style={[{ borderBottomWidth: pxToDp(6), borderBottomColor: "#475266", marginRight: pxToDp(10),marginLeft:pxToDp(10), height: pxToDp(70),minWidth:pxToDp(110)}]}></View>
  }

  renderMyanswer = (data) => {
    if (data.type === 1) {
      return <View style={[appStyle.flexLine,appStyle.flexLineWrap]}>
        {data.sentence_stem.map((item, index) => {
          let txt = item.content
          if(item.word_type === 'p') item.slectValue?txt = item.slectValue:txt=''
          if(!txt){
            return this.renderLine()
          }
          return <Text style={[{ fontSize: pxToDp(54),color:"#445268"},item.isCenter ? { color: 'red' } : null, item.slectValue ? { color: '#FF964A' } : null,appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{lineHeight:pxToDp(64)}:null]} key={index}>
            {haveNbsp(txt)}{txt}
          </Text>
        })}
      </View>
    }
    return <View style={[appStyle.flexLine,appStyle.flexLineWrap]}>
      {data.sentence_stem.map((item, index) => {
        let txt = item.slectValue
        if(!txt){
          return this.renderLine()
        }
        return <Text style={[{ fontSize: pxToDp(54) },item.isCenter ? { color: 'red' } : null, item.slectValue ? { color: '#FF964A' } : null,appFont.fontFamily_jcyt_500,Platform.OS === 'ios'?{lineHeight:pxToDp(64)}:null]} key={index}>
          {haveNbsp(txt)}{txt}
        </Text>
      })}
    </View>
  }
  renderTemplate = (data) => {
    let _currentTopic = JSON.parse(JSON.stringify(data))
    let isRender = false
    _currentTopic.template_word.forEach((i, index) => {
      if(i.desc){
        _currentTopic.sentence_stem[i.position].desc = i.desc
        isRender = true
      }
    })
    if(!isRender) return null
    let htm = []
    _currentTopic.sentence_stem.forEach((item, index) => {
      let h = <View key={index}>
        <View style={[appStyle.flexJusCenter, appStyle.flexCenter]}>
          {item.desc?<View style={[appStyle.flexAliCenter,{marginLeft:pxToDp(10)}]}>
            <View style={[{borderBottomWidth:pxToDp(6),borderBottomColor:'#EC5D57'},Platform.OS === 'ios'?{paddingBottom:pxToDp(4),marginBottom:pxToDp(8)}:null]}>
              <Text style={[{ fontSize: pxToDp(42) ,color:"#47556A"},appFont.fontFamily_jcyt_500,Platform.OS === 'ios'?{lineHeight:pxToDp(52)}:null]}>{item.content}</Text>
            </View>
            <Text style={[{ fontSize: pxToDp(26),color:"#EC5D57" },appFont.fontFamily_jcyt_500]}>{item.desc}</Text>
          </View>:
          <Text style={[{ fontSize: pxToDp(42),color:"#47556A"},appFont.fontFamily_jcyt_500,Platform.OS === 'ios'?{lineHeight:pxToDp(52)}:null]}>{index >0?haveNbsp(item.content):''}{item.content}</Text>}
        </View>
      </View>
      htm.push(h)
    })
    return <View style={[appStyle.flexTopLine, appStyle.flexLineWrap]}>
      {htm}
    </View>
  }

  renderBestAnswer = () => {
    const { data } = this.props
    const { type,explanation } = data
    let htm = ''
    if(type === 2 && explanation){
      htm = <RichShowViewHtml value={explanation} size={40} color={'#47556A'} p_style={{lineHeight:pxToDp(70)}}></RichShowViewHtml>
    }else{
      if(data.best_answer.length){
        htm = data.best_answer.map((item, index) => {
          return <View style={[appStyle.flexLine]}>
              <Text style={[styles.commonTxt]} key={index}>
                {item}
              </Text>
            </View>
        })
      }
    }
    if(!htm) return null
    return <View style={{ marginTop: pxToDp(38),marginLeft:pxToDp(86) }}>
      <Text style={[{ color: "#47556A", fontSize: pxToDp(50) },appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>最优答案:</Text>
      {htm}
    </View>
  }

  render() {
    const { visible, data } = this.props
    if (Object.keys(data).length === 0) return null
    let inspect_template = data.inspect_template
    const {status,type,explanation,diagnose,explanation_audio,azure_explanation_audio} = data
    return (
      <Modal
        visible={visible}
        transparent={true}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={[styles.container]}>
          <View style={[styles.contentWrap]}>
            <View style={[styles.content]}>
              <View style={[appStyle.flexAliCenter]}>
                <View style={[appStyle.flexLine,Platform.OS === 'ios'?{marginBottom:pxToDp(40)}:null]}>
                  <Image style={[{width:pxToDp(80),height:pxToDp(80),marginRight:pxToDp(18)}]} source={ranking_icon_map[status]}></Image>
                  <Text style={[{color:"#445268",fontSize:pxToDp(66),lineHeight:pxToDp(80)},appFont.fontFamily_jcyt_700]}>
                    {ranking_map[status]}
                  </Text>
                </View>
              </View>
              <ScrollView  contentContainerStyle={{paddingBottom:pxToDp(40)}}>
                <View style={[{marginLeft:pxToDp(85),paddingRight:pxToDp(25)}]}>
                  {this.renderMyanswer(data)}
                  {diagnose? <Text style={[styles.commonTxt,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(20)}:null]}>{diagnose}</Text>:null}
                </View>
                <View style={[styles.explanationWrap,Platform.OS === 'ios'?{marginTop:pxToDp(40)}:null]}>
                  <Text style={[{ color: '#47556A', fontSize: pxToDp(50)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>解析：</Text>
                  { this.renderTemplate(data)}

                  {/* 录入的解析和音频 */}
                  {explanation && type !== 2?<View style={Platform.OS === 'ios'?{marginTop:pxToDp(10)}:null}>
                    <RichShowViewHtml value={explanation} size={40} color={'#47556A'} p_style={{lineHeight:pxToDp(70)}}></RichShowViewHtml>
                  </View>:null}
                  {explanation_audio? <View style={[{marginTop:pxToDp(20)}]}>
                    <Audio
                        audioUri={`${baseUrl}${explanation_audio}`}
                        pausedBtnImg={require("../../../../../../images/EN_Sentences/pause_btn_2.png")}
                        pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                        playBtnImg={require("../../../../../../images/EN_Sentences/play_btn_2.png")}
                        playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                        rate={0.75}
                    />
                  </View>: null}


                  {azure_explanation_audio? <View style={[{marginTop:pxToDp(20)}]}>
                    <Audio
                      audioUri={`${baseUrl}${azure_explanation_audio}`}
                      pausedBtnImg={require("../../../../../../images/EN_Sentences/pause_btn_2.png")}
                      pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                      playBtnImg={require("../../../../../../images/EN_Sentences/play_btn_2.png")}
                      playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                      rate={0.75}
                    />
                  </View>: null}


                  {/* 讲解模版部分 */}
                  {inspect_template.inspect_explain?<View style={Platform.OS === 'ios'?{marginTop:pxToDp(10),marginBottom:pxToDp(10)}:null}>
                  <RichShowViewHtml value={inspect_template.inspect_explain} size={40} color={'#47556A'} p_style={{lineHeight:pxToDp(70)}}></RichShowViewHtml>
                  </View>: null}
                  {inspect_template.inspect_audio? <View style={[{marginTop:pxToDp(20)}]}>
                    <Audio
                        audioUri={`${baseUrl}${inspect_template.inspect_audio}`}
                        pausedBtnImg={require("../../../../../../images/EN_Sentences/pause_btn_2.png")}
                        pausedBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                        playBtnImg={require("../../../../../../images/EN_Sentences/play_btn_2.png")}
                        playBtnStyle={{ width: pxToDp(360), height: pxToDp(140) }}
                        rate={0.75}
                    />
                  </View>: null}
                </View>
                {this.renderBestAnswer()}
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity onPress={this.props.onClose} style={[size_tool(432, 128), borderRadius_tool(140),
            {paddingBottom: pxToDp(8), backgroundColor: '#FF731C', marginTop:pxToDp(-64)}]}>
              <View style={[{ flex: 1, borderRadius: pxToDp(140), backgroundColor: '#FF964A', }, appStyle.flexCenter]}>
                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#fff' },Platform.OS === 'ios'?{lineHeight:pxToDp(58)}:null]}>{this.props.txt?this.props.txt:'Next'}</Text>
              </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(76, 76, 89, .6)",
    ...appStyle.flexCenter,
  },
  contentWrap: {
    width: Platform.OS === 'ios'?'80%':'70%',
    height: '80%',
    ...appStyle.flexAliCenter,
  },
  content: {
    width: '100%',
    height: '100%',
    backgroundColor:"#fff",
    borderRadius: pxToDp(60),
    paddingTop:Platform.OS === 'android'?pxToDp(40):pxToDp(60),
    paddingBottom:pxToDp(100)
  },
  commonTxt:{
    color:"#47556A",
    fontSize:pxToDp(42),
    ...appFont.fontFamily_jcyt_500,
    ...Platform.OS === 'ios'?{lineHeight:pxToDp(60)}:{}
  },
  explanationWrap:{
    backgroundColor:"#F7F8FC",
    borderRadius:pxToDp(40),
    marginLeft:pxToDp(25),
    marginRight:pxToDp(25),
    paddingTop:pxToDp(38),
    paddingBottom:pxToDp(38),
    paddingLeft:pxToDp(65),
    paddingRight:pxToDp(65)
  }
})
