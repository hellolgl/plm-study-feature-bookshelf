import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { pxToDp, isChinese } from '../../../util/tools'
import {appFont, appStyle} from '../../../theme'



export default class FractionStem extends Component {
constructor(props) {
    super(props);
}
renderString = (item,indexJ)=>{
  const {txt_style} = this.props
  let _itemArr = item.split('')
  let htm = _itemArr.map((i,index)=>{
    return <Text key={index} style={[txt_style]}>{i}</Text>
  })
  if(!isChinese(item)){
    htm = item.split(' ').map((i,index)=>{
      return <Text key={index} style={[txt_style]}> {i}</Text>
    })
  }
  return <>{htm}</>
}

renderFranction = (item,indexJ) => {
  const {txt_style,fraction_border_style} = this.props
 
  if(item.length === 2){
    return <View key={indexJ}>
        <View style={[styles.top,fraction_border_style]}>
            <Text style={[styles.txt_center,txt_style]}>{item[0]}</Text>
        </View>
        <Text style={[styles.bottom,styles.txt_center,txt_style]}>{item[1]}</Text>
    </View>
  }
  if(item.length === 3){
      return <View style={[appStyle.flexLine]} key={indexJ}>
      <Text style={[{fontSize:pxToDp(40)},txt_style]}>{item[0]}</Text>
      <View>
          <View style={[styles.top,fraction_border_style]}>
              <Text style={[styles.txt_center,txt_style]}>{item[1]}</Text>
          </View>
          <Text style={[styles.bottom,styles.txt_center,txt_style]}>{item[2]}</Text>
      </View>
  </View>
  }
}
  render() {
    const {value,fraction_border_style} = this.props
    if(!value) return null
    return (
      <View>
        {value && value.length>0?value.map((item,index)=>{
          return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={index}>
            {item.map((j,indexJ)=>{
              if(Array.isArray(j)){
                return this.renderFranction(j)
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
  top:{
    borderBottomWidth:pxToDp(4),
    paddingLeft:pxToDp(4),
    paddingRight:pxToDp(4),
    borderBottomColor:'#4c4c59',
  },
  txt_center:{
      textAlign:'center',
  }
});