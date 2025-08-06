import React, { Component } from "react";
import {
  Image,
  // Modal,
  Text,
  View,
  BackAndroid,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../../../../util/tools";
import { appStyle, appFont } from "../../../../../theme";
import { Toast, Modal } from "antd-mobile-rn";
export default class ExplainModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible}  = this.props
    return (
        <Modal
          animationType="slide"
          visible={visible}
          transparent
          style={[
            { width: "100%", height: "100%", backgroundColor: "transaparent" },
            appStyle.flexCenter,
          ]}
        >
            <ImageBackground style={[{width:pxToDp(1296),height:pxToDp(889)},appStyle.flexCenter]} source={require('../../../../../images/MathAbilityDiagnosis/explain_bg.png')}>
                <View style={[styles.content]}>
                    <View style={[styles.txtWrap]}>
                        <Text style={[styles.title]}>说明</Text>
                        <Text style={[styles.txt]}>
                            ①同一单元的单元检测仅记录最近一次的准确率和历史最高准确率。
                        </Text>
                        <Text style={[styles.txt]}>
                            ②累计做满3套完整的不同的单元测试（含期中检测）提供智学推荐；做完1套完整的期末测试，也提供智学推荐。
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.closeBtn,appStyle.flexCenter]} onPress={()=>{this.props.close()}}>
                    <Text style={{color:"#fff",fontSize:pxToDp(40)}}>关闭</Text>
                </TouchableOpacity>
            </ImageBackground>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding:pxToDp(40),
    paddingLeft:pxToDp(120),
    paddingRight:pxToDp(120)
  },
  txtWrap:{
    backgroundColor:'#ECF3FF',
    borderRadius:pxToDp(60),
    padding:pxToDp(40),
    height:pxToDp(547),
    marginTop:pxToDp(60)
  },
  txt:{
    fontSize:pxToDp(40),
    color:'#333'
  },
  title:{
    fontSize:pxToDp(40),
    color:'#333',
    textAlign:'center',
    fontWeight:'bold'
  },
  closeBtn:{
    width:pxToDp(200),
    height:pxToDp(80),
    borderRadius:pxToDp(40),
    backgroundColor:"#F9B43B"
  }
});
