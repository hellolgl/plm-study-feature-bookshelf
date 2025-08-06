import React, { Component } from "react";
import {
  View,StyleSheet,Image,Modal,Text,Platform,TouchableOpacity,ImageBackground
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";

export default class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,data} = this.props
    if(!data) return null
    return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          supportedOrientations={['portrait', 'landscape']}
        >
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                <Text style={[{color:"#475266",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_500]}>{data.des}</Text>
                <TouchableOpacity style={{marginTop:pxToDp(60)}} onPress={()=>{this.props.close()}}>
                    <ImageBackground resizeMode='stretch' source={require('../../../../images/desk/btn_bg_3.png')} style={[{width:pxToDp(280),height:pxToDp(120)},appStyle.flexCenter]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>明白</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content:{
        width:pxToDp(920),
        ...appStyle.flexAliCenter,
        padding:pxToDp(60),
        borderRadius:pxToDp(40),
        backgroundColor:"#fff"
    },
});
