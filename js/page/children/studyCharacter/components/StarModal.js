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
} from "../../../../util/tools";
import { appFont, appStyle } from "../../../../theme";
export default class StarModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {visible,star_num} = this.props
    return (
      <Modal
          animationType="fade"
          transparent
          visible={visible}
          supportedOrientations={['portrait', 'landscape']}
        >
            <View style={[styles.container]}>
              <Image style={[{width:pxToDp(744),height:pxToDp(424)}]} source={require('../../../../images/childrenStudyCharacter/star_bg.png')}></Image>
              <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                {star_num + 1 === 3?<Image style={[{width:pxToDp(40),height:pxToDp(40)}]} source={require('../../../../images/childrenStudyCharacter/close_icon_1.png')}></Image>:
                <Image style={[{width:pxToDp(40),height:pxToDp(40)}]} source={require('../../../../images/childrenStudyCharacter/right_icon_1.png')}></Image>}
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
      width:pxToDp(400),
      height:pxToDp(140),
      borderRadius:pxToDp(100),
      backgroundColor:"#fff",
      ...appStyle.flexCenter,
      marginTop:pxToDp(240)
    }
});
