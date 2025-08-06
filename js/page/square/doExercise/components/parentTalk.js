import React from 'react';
import {
  View,
  StyleSheet,
} from "react-native";
import {
  pxToDp,getIsTablet,pxToDpWidthLs
} from "../../../../util/tools";
import Talk from './talk'

function ParentTalk(props) {
    const isPhone = !getIsTablet();
    return (
        <View style={[styles.container,isPhone?{paddingBottom:pxToDpWidthLs(10)}:null]}>
            <Talk 
                inputToolbarStyle={{width:isPhone?pxToDpWidthLs(1250):pxToDp(1800)}} 
                myBubbleTxtViewStyle={{maxWidth: isPhone ? pxToDpWidthLs(1000) : pxToDp(1500)}}
                myBubbleUserViewStyle={{backgroundColor:'#80CEC8'}}
                gptAvatar={require('../../../../images/square/gpt_avatar_3.png')}
            ></Talk>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingBottom:pxToDp(60),
        paddingTop:pxToDp(30)
    }
})

export default ParentTalk
