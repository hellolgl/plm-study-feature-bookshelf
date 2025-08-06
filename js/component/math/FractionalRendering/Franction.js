import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { pxToDp } from '../../../util/tools'
import {appStyle} from '../../../theme'



export default class Franction extends Component {
constructor(props) {
    super(props);
    // console.log('_______________________________',this.props.value)
}
renderContent = ()=>{
    let {value} = this.props
    if(value.length === 1){
        return <Text style={[{fontSize:pxToDp(32)}]}>{value[0]}</Text>
    }
    if(value.length === 2){
        return <View>
            <View style={[styles.top]}>
                <Text style={[{fontSize:pxToDp(32),textAlign:'center'}]}>{value[0]}</Text>
            </View>
            <Text style={[styles.bottom,{fontSize:pxToDp(32),textAlign:'center'}]}>{value[1]}</Text>
        </View>
    }
    if(value.length === 3){
        return <View style={[appStyle.flexLine]}>
        <Text style={[{fontSize:pxToDp(32)}]}>{value[0]}</Text>
        <View>
            <View style={[styles.top]}>
                <Text style={[{fontSize:pxToDp(32),textAlign:'center'}]}>{value[1]}</Text>
            </View>
            <Text style={[styles.bottom,{fontSize:pxToDp(32),textAlign:'center'}]}>{value[2]}</Text>
        </View>
    </View>
    }
}
  render() {
    return (
      <View style={[appStyle.flexTopLine]}>
        {this.renderContent()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
    top:{
        borderBottomWidth:1,
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4)
    }
});