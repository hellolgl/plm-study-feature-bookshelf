import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import { connect } from "react-redux";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

 class CongratulationsModal extends Component {
  constructor(props) {
    super(props);
  }

  getName = () => {
    const {source,data} = this.props
    if(!data) return ''
    let name = data.name.substring(0,4)
    if(source === '2'){
      // 拓展
      name = data.name
    }
    return name
  }

  render() {
    const {data} = this.props
    return (
      <View style={[styles.container]}>
          <View style={[styles.content]}>
              <Text style={[{color:'#363D4C',fontSize:pxToDp(52)},appFont.fontFamily_jcyt_700]}>恭喜</Text>
              <ImageBackground style={[{width:pxToDp(480),height:pxToDp(480),marginTop:pxToDp(-80)},appStyle.flexCenter]} source={require('../../../../../images/childrenStudyCharacter/light_bg.png')}>
                  <Image style={{width:pxToDp(240),height:pxToDp(280)}} source={data?.badge_img}></Image>
              </ImageBackground>
              <Text style={[{color:"#363D4C",fontSize:pxToDp(40),marginTop:pxToDp(-80)},appFont.fontFamily_jcyt_500]}>解锁了{this.getName()}成就</Text>
          </View>
          <TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
              <Image style={[{width:pxToDp(280),height:pxToDp(120)}]} source={require('../../../../../images/childrenStudyCharacter/close_btn_1.png')}></Image>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        width:windowWidth,
        height:windowHeight,
        backgroundColor:"rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter,
        position:"absolute",
        top:0,
        left:0
    },
    btn:{
      borderRadius:pxToDp(100),
      backgroundColor:"#fff",
      ...appStyle.flexCenter,
      marginTop:pxToDp(-60)
    },
    content:{
        backgroundColor:"#fff",
        borderRadius:pxToDp(40),
        paddingTop:pxToDp(40),
        paddingBottom:pxToDp(100),
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        ...appStyle.flexAliCenter,
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

export default connect(mapStateToProps, mapDispathToProps)(CongratulationsModal)
