import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import { connect } from "react-redux";

class BadgeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        list:[]
    }
  }
  

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  getName = (i) => {
    const {source} = this.props
    let name = i.name.substring(0,4)
    if(source === '2' && i.name.length > 4){
      // 拓展
      name = name + '...'
    }
    return name
  }

  render() {
    const {visible,total,list,source} = this.props
    return (
      <Modal
          animationType="fade"
          transparent
          visible={visible}
        >   
            <View style={[styles.container]}>
                <View style={[styles.content,source === '2'?{height:'85%'}:null]}>
                    <View style={[appStyle.flexLine,appStyle.flexJusBetween,{paddingRight:pxToDp(40)}]}>
                        <Text style={[{color:"#363D4C",fontSize:pxToDp(52)},appFont.fontFamily_jcyt_700]}>我的成就：</Text>
                        <View style={[appStyle.flexLine]}>
                            <Image style={[{width:pxToDp(60),height:pxToDp(60),marginRight:pxToDp(20)}]} source={require('../../../../../images/childrenStudyCharacter/star_2.png')}></Image>
                            <Text style={[{color:"#FF8755",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]}>x{total}</Text>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={[appStyle.flexLine,appStyle.flexLineWrap]}>
                        {list.map((i,x) => {
                            return <View key={x} style={[appStyle.flexAliCenter,{marginBottom:pxToDp(40),marginRight:pxToDp(40)}]}>
                                <Image style={[{width:pxToDp(200),height:pxToDp(233)}]} source={i.mold?i.badge_img:require('../../../../../images/childrenStudyCharacter/badge_0.png')}></Image>
                                <Text style={[{color:"#363D4C",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_500]}>{this.getName(i)}</Text>
                            </View>
                        })}
                    </ScrollView>
                </View>
                <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                    <Image style={[{width:pxToDp(280),height:pxToDp(120)}]} source={require('../../../../../images/childrenStudyCharacter/close_btn_1.png')}></Image>
                </TouchableOpacity>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter
    },
    btn:{
        borderRadius:pxToDp(100),
        backgroundColor:"#fff",
        ...appStyle.flexCenter,
        marginTop:pxToDp(-60)
    },
    content:{
        padding:pxToDp(40),
        backgroundColor:"#fff",
        borderRadius:pxToDp(40),
        width:pxToDp(1240),
        paddingRight:0,
        paddingBottom:pxToDp(80)
    }
});

const mapStateToProps = (state) => {
    return {
      source: state.getIn(["bagMathProgram", "source"]),
    };
  };
  
  const mapDispathToProps = (dispatch) => {
    return {};
  };
  
export default connect(mapStateToProps, mapDispathToProps)(BadgeModal)
