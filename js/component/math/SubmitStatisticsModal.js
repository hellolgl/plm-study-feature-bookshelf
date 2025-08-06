import React, { Component } from "react";
import {
  View,StyleSheet,Image,Modal,Text,Platform,TouchableOpacity,ImageBackground
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../util/tools";
import { appFont, appStyle } from "../../theme";

const COLOR_MAP = {
    0:'#8F0D23',
    1:'#028053'
}

const BG_MAP = {
    0:'#DD5F74',
    1:'#2ED197'
}

export default class SubmitStatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,list} = this.props
    let no_answer_nums = list.filter(i=>{
        return i.correct === -1
    }).length
    return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          supportedOrientations={['portrait', 'landscape']}
        >
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                <View style={[styles.inner]}>
                    <Text style={[styles.txt_1]}>还有{no_answer_nums}道题未做，提交后无法继续答题，确认提交？</Text>
                    <View style={[appStyle.flexLine,{marginTop:pxToDp(60)},appStyle.flexLineWrap]}>
                        {list.map((i,x)=>{
                            return <TouchableOpacity style={[styles.item,{backgroundColor:BG_MAP[i.correct]?BG_MAP[i.correct]:'#EDEDEE'}]} key={x}>
                                <Text style={[{color:COLOR_MAP[i.correct]?COLOR_MAP[i.correct]:"#4C4C59",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_500]}>{x+1}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                    <View style={[appStyle.flexLine,{marginTop:pxToDp(60)}]}>
                        <TouchableOpacity style={{marginRight:pxToDp(40)}} onPress={()=>{this.props.close()}}>
                            <ImageBackground resizeMode='stretch' source={require('../../images/MathSyncDiagnosis/btn_bg_5.png')} style={[{width:pxToDp(400),height:pxToDp(112)},appStyle.flexCenter]}>
                                <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>取消</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.props.confirm()}}>
                            <ImageBackground resizeMode='stretch' source={require('../../images/MathSyncDiagnosis/btn_bg_3.png')} style={[{width:pxToDp(400),height:pxToDp(112)},appStyle.flexCenter]}>
                                <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>确认</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content:{
        width:pxToDp(920),
        paddingBottom:pxToDp(10),
        backgroundColor:'#DAE2F2',
        borderRadius:pxToDp(40),
    },
    inner:{
        width:pxToDp(920),
        borderRadius:pxToDp(40),
        backgroundColor:"#fff",
        ...appStyle.flexAliCenter,
        padding:pxToDp(40)
    },
    txt_1:{
        color:"#4C4C59",
        fontSize:pxToDpHeight(48),
        ...appFont.fontFamily_jcyt_500
    },
    item:{
        width:pxToDp(80),
        height:pxToDp(80),
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter,
        marginRight:pxToDp(40),
        marginBottom:pxToDp(40)
    }
});
