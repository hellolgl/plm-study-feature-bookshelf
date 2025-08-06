import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { pxToDp } from '../../../util/tools'
import {appStyle} from '../../../theme'
import Franction from './Franction'



export default class FractionStem extends Component {
constructor(props) {
    super(props);
    // console.log('this.props.valuethis.props.valuethis.props.valuethis.props.value',this.props.value)
}
renderString = (item,indexJ)=>{
  let _itemArr = item.split('')
  let htm = _itemArr.map((i,index)=>{
    return <Text key={index} style={[{fontSize:pxToDp(32)},item === '=' || item === '+' || item === '-' || item === '×' || item === '÷' || item === '○'?{marginLeft:pxToDp(4),marginRight:pxToDp(4)}:null,item === '○'?{fontSize:pxToDp(52)}:null]}>{i}</Text>
  })
  return <>{htm}</>
}
  render() {
    const {value} = this.props
    if(value && value.length >0 && value[0][0] && !Array.isArray(value[0][0]) && !value[0][0].replace(/\s*/g,"")) return null
    return (
      <View style={[{width:'100%'}]}>
        {value && value.length>0?value.map((item,index)=>{
          return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={index}>
            {item.map((j,indexJ)=>{
              if(Array.isArray(j)){
                return <Franction value={j} key={indexJ}></Franction>
              }else{
                return this.renderString(j)
              }
            })}
          </View>
        }):null}
      </View>
    );
  }

}

const styles = StyleSheet.create({
});