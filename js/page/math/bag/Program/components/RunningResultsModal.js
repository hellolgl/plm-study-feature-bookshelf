import React, { Component } from "react";
import {
    View, StyleSheet, Modal, Text, Platform, TouchableOpacity, Image
} from "react-native"
import {
  pxToDp, pxToDpHeight,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";

class RunningResultsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,data} = this.props
    let codeRunErr = false
    if (data && data.includes("运行错误")) {
        codeRunErr = true
    }
    const color = codeRunErr? "#e7153f": "#2D2D40"
    const marioImg = codeRunErr? require('../../../../../images/mathProgramming/run_error.png') :require('../../../../../images/mathProgramming/run_success.png')
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={[styles.container]}>
                <View style={[styles.content]}>
                    <View style={[styles.content_inner]}>
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <View
                                style={{
                                    marginBottom: pxToDp(10),
                                }}
                            >
                                <Image style={[{width:pxToDp(80),height:pxToDp(80)}]} source={marioImg}></Image>
                            </View>
                            <Text style={[{color:"#2D2D40",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>运行结果</Text>
                        </View>
                        <View style={[styles.result_wrap,Platform.OS === 'ios'?{marginTop:pxToDp(40)}:{marginTop:pxToDp(20)}]}>
                            <Text style={[{color: color,fontSize:pxToDp(38)},appFont.fontFamily_jcyt_700]}>{data?data:'无运行结果'}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={[styles.close_btn]} onPress={this.props.close}>
                    <View style={[styles.close_btn_inner]}>
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
        backgroundColor:"rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content:{
        minWidth:pxToDp(852),
        backgroundColor:'#DAE2F2',
        borderRadius:pxToDp(80),
        paddingBottom:pxToDp(8)
    },
    content_inner:{
        backgroundColor:"#fff",
        borderRadius:pxToDp(80),
        padding:pxToDp(40),
        ...appStyle.flexAliCenter,
        paddingBottom:pxToDp(100)
    },
    close_btn:{
        width:pxToDp(270),
        height:pxToDp(128),
        borderRadius:pxToDp(140),
        backgroundColor:"#FFB649",
        paddingBottom:pxToDp(8),
        marginTop:pxToDp(-64)
    },
    close_btn_inner:{
        flex:1,
        backgroundColor:"#FFDB5D",
        borderRadius:pxToDp(140),
        ...appStyle.flexCenter,
    },
    result_wrap:{
        padding:Platform.OS === 'android'?pxToDp(20):pxToDp(40),
        backgroundColor:"#F5F6FA",
        borderRadius:pxToDp(40),
    }
});



  export default RunningResultsModal
