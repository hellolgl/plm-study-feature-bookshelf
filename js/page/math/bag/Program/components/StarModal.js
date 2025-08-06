import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
export default class StarModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {visible,stars} = this.props
    let len = stars.filter((i,x) => {
      return i
    }).length
    return (
      <Modal
          animationType="fade"
          transparent
          visible={visible}
          supportedOrientations={['portrait', 'landscape']}
        >   
            <View style={[styles.container]}>
              <Text style={[{color:"#fff",fontSize:pxToDp(48),marginBottom:pxToDp(100)},appFont.fontFamily_jcyt_700]}>恭喜获得星星！</Text>
              <Image style={[{width:pxToDp(744),height:pxToDp(424)}]} source={require('../../../../../images/childrenStudyCharacter/star_bg.png')}></Image>
              <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                <View style={[styles.btn_inner]}>
                  <Text style={[{color:"#2D2D40",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>{len + 1 === stars.length?'完成':'继续'}</Text>
                </View>
              </TouchableOpacity>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.80)",
        ...appStyle.flexCenter
    },
    btn:{
      width:pxToDp(336),
      height:pxToDp(128),
      borderRadius:pxToDp(140),
      backgroundColor:"#FFB649",
      marginTop:pxToDp(100),
      paddingBottom:pxToDp(8)
    },
    btn_inner:{
      flex:1,
      backgroundColor:"#FFDB5D",
      borderRadius:pxToDp(140),
      ...appStyle.flexCenter
    }
});
