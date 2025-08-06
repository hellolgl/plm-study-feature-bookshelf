import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import { appStyle } from '../../theme'
import { pxToDp } from '../../util/tools'
export default class TopicCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const {list} = this.props
    // console.log('proplist',list)
    return (
      <View style={[styles.container,appStyle.flexLine]}>
        <View style={[styles.left]}>
          <Text style={[styles.text]}>答</Text>
          <Text style={[styles.text]}>题</Text>
          <Text style={[styles.text]}>卡</Text>
        </View>
        <View style={[styles.right,appStyle.flexJusCenter]}>
          <View style={[appStyle.flexLine,appStyle.flexTopLine,appStyle.flexLineWrap]}>
            {list.length>0?list.map((item,index)=>{
              // 2红色 1绿色 3橙色
              return <Text key={index} style={[styles.item,{color:item.colorFlag === 2 ? '#FC6161' : item.colorFlag === 1 ? "#7FD23F" : item.colorFlag === 3 ? "#FCAC14" : '#AAAAAA'}]}>{index+1}</Text>
            }):null}
          </View>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container:{
    paddingLeft:pxToDp(24),
    paddingRight:pxToDp(24),
    height:'100%'
  },
  right:{
    marginLeft:pxToDp(35),
  },
  text:{
    fontSize:pxToDp(28),
    color:"#AAAAAA"
  },
  item:{
    width:pxToDp(34),
    textAlign:'center',
    marginRight:pxToDp(20),
    fontSize:pxToDp(28),
    marginBottom:pxToDp(8)
  }
})