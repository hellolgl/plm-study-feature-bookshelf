import React, { Component } from "react";
import {
  View,StyleSheet,Image,Modal,Text,Platform,TouchableOpacity,ImageBackground
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";

const CORRECT_BG_COLOR_MAP = {
    0:'#F2645B',
    1:'#16C792'
}

class TopicCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {index_list,topicIndex} = this.props
    return <View style={[appStyle.flexLine,Platform.OS === 'ios'?{marginTop:pxToDp(30)}:null]}>
            {
                index_list.map((i,x) => {
                    return <TouchableOpacity style={[styles.card_item,x === index_list.length - 1?{marginRight:0}:null,topicIndex === x?styles.active_card_item:null,{backgroundColor:CORRECT_BG_COLOR_MAP[i.correct]?CORRECT_BG_COLOR_MAP[i.correct]:'#2D2D40'}]} key={x} onPress={()=>{
                        this.props.selectIndex(i,x)
                    }}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>{x + 1}</Text>
                    </TouchableOpacity>
                })
            }
    </View>
  }
}

const styles = StyleSheet.create({
    card_item:{
        width:pxToDp(80),
        height:pxToDp(80),
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter,
        marginRight:pxToDp(20),
        borderWidth:pxToDp(4),
        borderColor:'transparent'
    },
    active_card_item:{
        borderColor:'#FFDB5D'
    },
});


  
  export default TopicCard
