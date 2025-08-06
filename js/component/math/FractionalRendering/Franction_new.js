import React, { Component } from "react";
import { Text, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { pxToDp, pxToDpHeight } from '../../../util/tools'
import {appFont, appStyle} from '../../../theme'



export default class Franction extends Component {
constructor(props) {
    super(props);
}
renderContent = ()=>{
    let {value,txt_style,fraction_border_style,no_font_family} = this.props
    if(value.length === 2){
        return <View>
            <View style={[styles.top,fraction_border_style]}>
                <Text style={[styles.txt,txt_style,no_font_family?null:appFont.fontFamily_jcyt_500]}>{value[0]}</Text>
            </View>
            <Text style={[styles.bottom,styles.txt,txt_style,no_font_family?null:appFont.fontFamily_jcyt_500]}>{value[1]}</Text>
        </View>
    }
    if(value.length === 3){
        return <View style={[appStyle.flexLine]}>
        <Text style={[{fontSize:pxToDp(40)},txt_style,no_font_family?null:appFont.fontFamily_jcyt_500]}>{value[0]}</Text>
        <View>
            <View style={[styles.top,fraction_border_style]}>
                <Text style={[styles.txt,txt_style,no_font_family?null:appFont.fontFamily_jcyt_500]}>{value[1]}</Text>
            </View>
            <Text style={[styles.bottom,styles.txt,txt_style,no_font_family?null:appFont.fontFamily_jcyt_500]}>{value[2]}</Text>
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
        borderBottomWidth:pxToDp(4),
        paddingLeft:pxToDp(4),
        paddingRight:pxToDp(4),
        borderBottomColor:'#4C4C59',
    },
    txt:{
        fontSize:pxToDp(40),
        textAlign:'center',
        color:"#4C4C59"
    }
});