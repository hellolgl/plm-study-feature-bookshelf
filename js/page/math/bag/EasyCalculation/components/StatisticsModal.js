import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, Platform, TouchableOpacity, ImageBackground, DeviceEventEmitter
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import MyPie from '../../../../../component/myChart/my'

const BADGE_IMG_MAP = {
    1: require('../../../../../images/MathEasyCalculation/badge_1.png'),
    2: require('../../../../../images/MathEasyCalculation/badge_2.png'),
    3: require('../../../../../images/MathEasyCalculation/badge_3.png'),
    4: require('../../../../../images/MathEasyCalculation/badge_4.png'),
    5: require('../../../../../images/MathEasyCalculation/badge_5.png'),
    6: require('../../../../../images/MathEasyCalculation/badge_6.png'),
    7: require('../../../../../images/MathEasyCalculation/badge_7.png'),
    8: require('../../../../../images/MathEasyCalculation/badge_8.png'),
    9: require('../../../../../images/MathEasyCalculation/badge_9.png'),
    10: require('../../../../../images/MathEasyCalculation/badge_10.png'),
    11: require('../../../../../images/MathEasyCalculation/badge_11.png'),
    12: require('../../../../../images/MathEasyCalculation/badge_12.png'),
}

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  getBtnTxt = (rate_correct) =>{
    const {exercise_level} = this.props
    if(exercise_level === 1 && rate_correct === 0) return '再次挑战'  // 1等级的题不能再下降了
    if(rate_correct === 0) return '再巩固一下'
    if(rate_correct === 100) return '开始挑战'
    return '再次挑战'
  }

  renderTxt = (rate_correct) => {
    const {exercise_level} = this.props
    if(rate_correct === 0 && exercise_level === 1) return <View style={[Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>
        <Text style={[{color:"#FFB800",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>保持在{exercise_level}等级 -</Text>
    </View>

    if(rate_correct === 0) return <View style={[appStyle.flexLine,Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>
        <Text style={[{color:"#FF6680",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>下降到{exercise_level - 1}等级</Text>
        <View style={[styles.triangle_down]}></View>
    </View>

    if(rate_correct === 100) return <View style={[appStyle.flexLine,Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>
        <Text style={[{color:"#31D860",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>升级到{exercise_level + 1}等级</Text>
        <View style={[styles.triangle_up]}></View>
    </View>

    return <View style={[Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>
        <Text style={[{color:"#FFB800",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>保持到{exercise_level}等级 -</Text>
    </View>
  }

  clickBtn = (rate_correct) => {
    switch (rate_correct) {
        case 0:
            this.props.continue()
            break;
        case 100:
            this.props.continue()
            break;
        default:
            this.props.tryAgain()
      }
  }

  render() {
    const {visible,total,wrong,content,exercise_level,isMax} = this.props
    let correct = total - wrong
    let rate_correct = Math.round((correct/total) *100)
    return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
        >
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                {isMax?<>
                    <View style={[{height:pxToDp(400),marginTop:pxToDp(60)},appStyle.flexCenter]}>
                        <Image resizeMode='stretch' style={[styles.light_bg]} source={require('../../../../../images/MathEasyCalculation/light_bg.png')}></Image>
                        <Image resizeMode='stretch' style={[styles.badge_img]} source={BADGE_IMG_MAP[exercise_level]}></Image>
                    </View>
                    <Text style={[{color:'#5A5A68',fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700,Platform.OS === 'ios'?{marginBottom:pxToDp(20)}:null]}>已达到最高等级</Text>
                    <TouchableOpacity style={[styles.btn_wrap,{backgroundColor:"#E08129"}]} onPress={()=>{this.props.close()}}>
                        <View style={[styles.btn_wrap_inner,appStyle.flexCenter,{backgroundColor:"#F99233"}]}>
                            <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>退出</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.clickBtn(rate_correct)
                    }}>
                        <Text style={[{color:"#00B295",fontSize:pxToDp(40),width:pxToDp(400),textAlign:"center"},appFont.fontFamily_jcyt_700]}>再次挑战</Text>
                    </TouchableOpacity>
                </>:<>
                    <Text style={[styles.txt_1]}>{content?content:exercise_level + '等级完成'}</Text>
                    <View style={[appStyle.flexLine,appStyle.flexCenter,{marginTop:pxToDp(40),marginBottom:pxToDp(40),backgroundColor:"#F5F5FA",width:"100%",padding:pxToDp(40),borderRadius:pxToDp(40)}]}>
                        <View style={[appStyle.flexAliCenter,{marginRight:pxToDp(150)}]}>
                            <View style={[styles.pei_wrap]}>
                                <MyPie length={pxToDp(18)} width={72} percent={rate_correct / 100} color={'#31D860'}/>
                            </View>
                            <Text style={[styles.txt_1,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(8)}:null,appFont.fontFamily_jcyt_500]}>{correct}题</Text>
                            <Text style={[styles.txt_2,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>正确</Text>
                        </View>
                        <View style={[appStyle.flexAliCenter]}>
                            <View style={[styles.pei_wrap]}>
                                <MyPie length={pxToDp(18)} width={72} percent={(100 - rate_correct) / 100} color={'#FF6680'}/>
                            </View>
                            <Text style={[styles.txt_1,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(8)}:null,appFont.fontFamily_jcyt_500]}>{wrong}题</Text>
                            <Text style={[styles.txt_2,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>错误</Text>
                        </View>
                    </View>
                    {this.renderTxt(rate_correct)}
                    <TouchableOpacity style={[styles.btn_wrap]} onPress={()=>{
                        this.clickBtn(rate_correct)
                    }}>
                        <View style={[styles.btn_wrap_inner,appStyle.flexCenter]}>
                            <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>{this.getBtnTxt(rate_correct)}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.props.close()
                        DeviceEventEmitter.emit("backSmartMathPage"); //返回页面刷新
                    }}>
                        <Text style={[{color:"#F99233",fontSize:pxToDp(40),width:pxToDp(400),textAlign:"center"},appFont.fontFamily_jcyt_700]}>退出</Text>
                    </TouchableOpacity>
                </>}

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
        width:pxToDp(600),
        borderRadius:pxToDp(40),
        backgroundColor:"#fff",
        ...appStyle.flexAliCenter,
        padding:pxToDp(40)
    },
    txt_1:{
        color:"#4C4C59",
        fontSize:pxToDpHeight(48),
        ...appFont.fontFamily_jcyt_700
    },
    txt_2:{
        color:"#9595A6",
        fontSize:pxToDp(22),
        ...appFont.fontFamily_jcyt_500
    },
    pei_wrap:{
        width:pxToDp(88),
        height:pxToDp(88),
        borderWidth: pxToDp(4),
        borderColor: '#E4E4F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:pxToDp(44)
    },
    btn_wrap:{
        width:pxToDp(400),
        height:pxToDp(100),
        backgroundColor:'#00836D',
        borderRadius:pxToDp(200),
        paddingBottom:pxToDp(5),
        marginBottom:pxToDp(20)
    },
    btn_wrap_inner:{
        width:pxToDp(400),
        height:'100%',
        backgroundColor:"#00B295",
        borderRadius:pxToDp(200),
    },
    triangle_down:{
        width: 0,
        height: 0,
        borderWidth:pxToDp(12),
        borderTopColor:'#FF6680',
        borderBottomColor:'transparent',
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        marginLeft:pxToDp(20),
        marginTop:pxToDp(10)
    },
    triangle_up:{
        width: 0,
        height: 0,
        borderWidth:pxToDp(12),
        borderTopColor:'#31D860',
        borderBottomColor:'transparent',
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        marginLeft:pxToDp(20),
        marginTop:pxToDp(10)
    },
    badge_img:{
        width:pxToDp(240),
        height:pxToDp(280),
    },
    light_bg:{
        width:pxToDp(480),
        height:pxToDp(480),
        position:'absolute',
        top:pxToDp(-60),
      },
});

export default StatisticsModal;
