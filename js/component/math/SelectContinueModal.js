import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
  pxToDpHeight,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import { Toast, Modal } from "antd-mobile-rn";

const BADGE_IMG_MAP = {
  0: require('../../images/MathEasyCalculation/badge_0.png'),
  1: require('../../images/MathEasyCalculation/badge_1.png'),
  2: require('../../images/MathEasyCalculation/badge_2.png'),
  3: require('../../images/MathEasyCalculation/badge_3.png'),
  4: require('../../images/MathEasyCalculation/badge_4.png'),
  5: require('../../images/MathEasyCalculation/badge_5.png'),
  6: require('../../images/MathEasyCalculation/badge_6.png'),
  7: require('../../images/MathEasyCalculation/badge_7.png'),
  8: require('../../images/MathEasyCalculation/badge_8.png'),
  9: require('../../images/MathEasyCalculation/badge_9.png'),
  10: require('../../images/MathEasyCalculation/badge_10.png'),
  11: require('../../images/MathEasyCalculation/badge_11.png'),
  12: require('../../images/MathEasyCalculation/badge_12.png'),
}

export default class SelectContinueModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {visible,data} = this.props
    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent
        style={[
          { width: "100%", height: "100%", backgroundColor: "transparent" },
          appStyle.flexCenter,
        ]}
      >
        <View
          style={[styles.content]}
        >
          <View style={[appStyle.flexCenter]}>
            <Image resizeMode='stretch' style={[styles.light_bg]} source={require('../../images/MathEasyCalculation/light_bg.png')}></Image>
            {data && data.now_level?<Image resizeMode='stretch' style={[styles.badge_img,Platform.OS === 'ios'?{marginBottom:pxToDpHeight(50)}:pxToDpHeight(20)]} source={BADGE_IMG_MAP[data.now_level]}></Image>:null} 
            <Text style={[{color:"#5A5A68",fontSize:pxToDp(40),marginBottom:pxToDp(20)},appFont.fontFamily_jcyt_700]}>
              已完成过最高等级的练习
            </Text>
            <TouchableOpacity style={[styles.btn_wrap]} onPress={this.props.close}>
                <View style={[styles.btn_wrap_inner,appStyle.flexCenter]}>
                    <Text style={[{color:"#fff",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>好的</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn_wrap,{backgroundColor:"transparent"},appStyle.flexCenter]} onPress={()=> {
              this.props.goOn()
              this.props.close()
            }}>
              <Text style={[{color:"#00B295",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>继续练习</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
    baseBtn:{
      height: pxToDp(56),
      paddingLeft:pxToDp(32),
      paddingRight:pxToDp(32),
      borderRadius: pxToDp(16),
      backgroundColor:'#33A1FDFF',
    },
    btnText:{
      fontSize: pxToDp(28),
      color:'#fff'
    },
    content:{
      width: pxToDp(560),
      borderRadius:pxToDp(40),
      backgroundColor:"#fff",
      paddingTop:pxToDpHeight(140),
      ...appStyle.alignCenter,
      position:"relative"
    },
    btn_wrap:{
      width:pxToDp(400),
      height:pxToDp(100),
      backgroundColor:'#00836D',
      borderRadius:pxToDp(50),
      paddingBottom:pxToDp(8),
      marginBottom:pxToDpHeight(20)
    },
    btn_wrap_inner:{
      width:pxToDp(400),
      height:'100%',
      backgroundColor:"#00B295",
      borderRadius:pxToDp(50),
    },
    badge_img:{
      width:pxToDp(240),
      height:pxToDp(280),
    },
    light_bg:{
      width:pxToDp(480),
      height:pxToDp(480),
      position:'absolute',
      top:pxToDp(-80),
    },
});
