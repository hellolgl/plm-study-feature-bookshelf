import React, { Component } from "react";
import {
  View,StyleSheet,Modal,Text,Platform,TouchableOpacity
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,correct,wrong} = this.props
    return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
        >   
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                <View style={[styles.content_1]}>
                    <View style={[styles.content_1_inner]}>
                        <Text style={[{color:"#2D2D40",fontSize:pxToDp(48),marginBottom:Platform.OS === 'ios'?pxToDp(40):pxToDp(20)},appFont.fontFamily_jcyt_700,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>完成</Text>
                        <View style={[styles.wrap]}>
                            <View style={[styles.wrap_item]}>
                                <View style={[styles.circle,{backgroundColor:"#00C288"}]}>
                                    <Text style={[styles.txt_num]}>{correct}</Text>
                                </View>
                                <Text style={[styles.txt_label]}>正确</Text>
                            </View>
                            <View style={[styles.wrap_item]}>
                                <View style={[styles.circle,{backgroundColor:"#F2645B"}]}>
                                    <Text style={[styles.txt_num]}>{wrong}</Text>
                                </View>
                                <Text style={[styles.txt_label]}>错误</Text>
                            </View>
                        </View>
                    </View> 
                </View>
                <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                    <View style={[styles.btn_inner]}>
                        <Text style={[{color:"#2D2D40",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>退出</Text>
                    </View>
                </TouchableOpacity>
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
        ...appStyle.flexAliCenter,
    },
    content_1:{
        width:pxToDp(600),
        height:pxToDp(526),
        borderRadius:pxToDp(80),
        backgroundColor:"#DAE2F2",
        paddingBottom:pxToDp(8)
    },
    content_1_inner:{
        flex:1,
        backgroundColor:'#fff',
        borderRadius:pxToDp(80),
        ...appStyle.flexAliCenter,
        padding:pxToDp(40)
    },
    btn:{
        width:pxToDp(384),
        height:pxToDp(128),
        borderRadius:pxToDp(140),
        backgroundColor:"#FFB649",
        paddingBottom:pxToDp(8),
        marginTop:pxToDp(-64)
    },
    btn_inner:{
        flex:1,
        backgroundColor:"#FFDB5D",
        borderRadius:pxToDp(140),
        ...appStyle.flexCenter
    },
    wrap:{
        width:"100%",
        borderRadius:pxToDp(40),
        backgroundColor:"#F5F6FA",
        ...appStyle.flexLine,
        ...appStyle.flexJusBetween,
        paddingTop:pxToDp(60),
        paddingBottom:pxToDp(60),
        paddingLeft:pxToDp(80),
        paddingRight:pxToDp(80)
    },
    wrap_item:{
        ...appStyle.flexAliCenter
    },
    circle:{
        width:pxToDp(120),
        height:pxToDp(120),
        borderRadius:pxToDp(60),
        ...appStyle.flexCenter,
        marginBottom:Platform.OS === 'ios'?pxToDp(20):0
    },
    txt_num:{
        color:"#fff",
        fontSize:pxToDp(64),
        ...appFont.fontFamily_jcyt_700
    },
    txt_label:{
        color:"#2D2D40",
        fontSize:pxToDp(32),
        ...appFont.fontFamily_jcyt_500
    }
});


  
  export default StatisticsModal
