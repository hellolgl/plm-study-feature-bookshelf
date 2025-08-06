/**圆形卡片组件 */
import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { pxToDp } from '../../util/tools'
export default class CircleCard extends Component {


  render() {
    const {isActive} = this.props
    return (
      <View
        style={[!isActive?{
          width: pxToDp(64),
          marginRight: 6,
          marginBottom: 20,
          height:pxToDp(64),
          backgroundColor:'#DDDDDD',
          borderRadius: pxToDp(32),
          justifyContent:'center'
        }:{
          width: pxToDp(80),
          marginRight: 6,
          marginBottom: 20,
          height:pxToDp(80),
          backgroundColor:'rgba(255, 152, 152, 1)',
          borderRadius: pxToDp(40),
          justifyContent:'center'
        }]}
      >
        <Text style={[styles.oldCheck,isActive?{color:'rgba(255, 255, 255, 1)',fontSize:pxToDp(36)}:null]}>{this.props.text}</Text>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  checked: {
    textAlign: 'center',
    color: '#fff',
    marginRight: 10,
    width: 32,
    height: 40,
    lineHeight: 40,
    // backgroundColor: '#FF9D03',
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 10,
    fontFamily: 'DIN-Bold'
  },
  oldCheck: {
    textAlign: 'center',
    lineHeight: pxToDp(64),
    fontSize:pxToDp(32),
    color:'rgba(170, 170, 170, 1)'
  }
})