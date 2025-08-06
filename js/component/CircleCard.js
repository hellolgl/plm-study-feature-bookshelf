/**圆形卡片组件 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { fontFamilyRestoreMargin, pxToDp } from '../util/tools'
import { appStyle, appFont } from "../theme";
export default class CircleCard extends Component {


  render() {
    // colorFlag,0表示灰色背景，没有做的题目，1是橙色背景，表示做对了的题目，2是红色背景，表示做错了的题目
    // console.log("颜色", this.props.colorFlag)
    return (
      <View
        style={[
          this.props.classNameWrap ? styles[this.props.classNameWrap] : {
            width: pxToDp(64),
            marginRight: pxToDp(20),
            marginBottom: pxToDp(40),
            height: pxToDp(80),
            borderRadius: pxToDp(16)
          },
          { backgroundColor: this.props.colorFlag === 2 ? '#FC6161' : this.props.colorFlag === 1 ? "#7FD23F" : this.props.colorFlag === 3 ? "#FCAC14" : '#DDDDDD', },
          appStyle.flexLine,
          appStyle.flexCenter
        ]}
      >
        {/* <ImageBackground  #FC6161
          source={this.props.className ? require('../images/bg_origin.png') : require('../images/greyBg.png')}> */}
        <Text style={[this.props.className ? styles[this.props.className] : styles.circle, appFont.fontFamily_syst, fontFamilyRestoreMargin('',),]}>{this.props.text}</Text>
        {/* </ImageBackground> */}

      </View >
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    color: '#fff',
    fontFamily: 'DIN-Bold',
    fontSize: pxToDp(32),
  },
  checked: {
    textAlign: 'center',
    color: '#fff',
    marginRight: pxToDp(20),
    width: pxToDp(64),
    height: pxToDp(80),
    // lineHeight: pxToDp(80),
    // backgroundColor: '#EEEDED',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(16),
    fontFamily: 'DIN-Bold'

  },
  oldCheck: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'DIN-Bold'
  },
  ziciClass: {
    fontSize: pxToDp(35),
    textAlign: 'center',
    color: '#fff',
    width: pxToDp(90),
    // height: pxToDp(100),
    // lineHeight: pxToDp(100),
    borderRadius: pxToDp(16),
    fontFamily: 'DIN-Bold'
  },
  ziciClassWrap: {
    marginRight: pxToDp(12),
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(12),
    height: pxToDp(90)
  },
  myCircle: {
    width: pxToDp(64),
    marginRight: pxToDp(12),
    // marginBottom: 20,
    height: pxToDp(80),
    borderRadius: pxToDp(16)
  },
})