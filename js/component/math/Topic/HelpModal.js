import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Text,
  Platform,
  ScrollView
} from "react-native";
import {
  pxToDp,
} from "../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../theme";
import TextView from '../FractionalRendering/TextView_new'
import AutoImage from '../Topic/AutoImage'
import RichShowViewHtml from '../RichShowViewHtml'
import { connect } from "react-redux";

class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {visible,data} = this.props
    const {problem_solving,exercise_data_type,problem_solving_image,problem_solving_c,_is_translate,problem_solving_image_c} = data
    let language_data = this.props.language_data.toJS();
    const {show_main,show_translate,main_language_map,other_language_map} = language_data
    let page_base_data = {
      jietisl_z:main_language_map.jietisl,
      jietisl_c:other_language_map.jietisl,
      ok_z:main_language_map.ok,
      ok_c:other_language_map.ok
    }
    const {jietisl_z,jietisl_c,ok_z,ok_c} = page_base_data
    return (
      <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >       
            <View style={[styles.container]}>
                <View style={[styles.content]}>
                  <View style={[appStyle.flexAliCenter,{marginBottom:pxToDp(40)}]}>
                    {_is_translate?<>
                      {show_main?<Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{jietisl_z}</Text>:null}
                      {show_translate?<Text style={[mathFont.txt_32_500,mathFont.txt_4C4C59_50]}>{jietisl_c}</Text>:null}
                    </>:<Text style={[mathFont.txt_48_500,mathFont.txt_4C4C59]}>解题思路</Text>}
                  </View>
                  <ScrollView style={{maxHeight:pxToDp(460)}}>
                    {exercise_data_type=== 'FS'?<> 
                      {_is_translate?<>
                        {show_main?<>
                          <TextView value={problem_solving} txt_style={[mathFont.txt_40_700,mathFont.txt_4C4C59]}></TextView>
                          <AutoImage url={problem_solving_image}></AutoImage>
                        </>:null}
                        {show_translate?<View style={[Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
                          <TextView value={problem_solving_c} txt_style={[mathFont.txt_28_500,mathFont.txt_4C4C59_50]} fraction_border_style={[{borderBottomColor:'rgba(76, 76, 89, 0.50)',borderBottomWidth:pxToDp(3)}]}></TextView>
                          <AutoImage url={problem_solving_image_c}></AutoImage>
                        </View>:null}
                      </>:<>
                        <TextView value={problem_solving} txt_style={[mathFont.txt_40_500,mathFont.txt_4C4C59]}></TextView>
                        <AutoImage url={problem_solving_image}></AutoImage>
                      </>}
                    </>:<>
                      {_is_translate?<>
                        {show_main?<RichShowViewHtml fontFamily={'JiangChengYuanTi-700W'} value={problem_solving} color={'#4C4C59'} p_style={{lineHeight:pxToDp(76)}}></RichShowViewHtml>:null}
                        {show_translate?<View style={[Platform.OS === 'ios'?{marginTop:pxToDp(20)}:null]}>
                          <RichShowViewHtml value={problem_solving_c} size={28} color={'rgba(76, 76, 89, 0.50)'} p_style={{lineHeight:pxToDp(60)}}></RichShowViewHtml>
                        </View>:null}
                      </>
                      :<RichShowViewHtml value={problem_solving} color={'#4C4C59'} p_style={{lineHeight:pxToDp(76)}}></RichShowViewHtml>}
                    </>}
                  </ScrollView>
                  <View style={[appStyle.flexAliCenter]}>
                    <TouchableOpacity style={[styles.close_btn]} onPress={()=>{this.props.close()}}>
                      <View style={[styles.close_btn_inner]}>
                        {_is_translate?<>
                          {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_fff,{marginBottom:Platform.OS === 'android'?pxToDp(-15):0}]}>{ok_z}</Text>:null}
                          {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_fff]}>{ok_c}</Text>:null}
                        </>:<Text style={[mathFont.txt_32_700,mathFont.txt_fff,{marginBottom:Platform.OS === 'android'?pxToDp(-15):0}]}>{ok_z}</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
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
        width:pxToDp(1200),
        borderRadius:pxToDp(40),
        backgroundColor:"#fff",
        padding:pxToDp(40),
    },
    close_btn:{
      width:pxToDp(400),
      height:pxToDp(110),
      backgroundColor:"#00836D",
      paddingBottom:pxToDp(6),
      borderRadius:pxToDp(40),
      marginTop:pxToDp(40)
    },
    close_btn_inner:{
      width:'100%',
      flex:1,
      backgroundColor:"#00B295",
      borderRadius:pxToDp(40),
      ...appStyle.flexCenter
    }
});

const mapStateToProps = (state) => {
  return {
      language_data: state.getIn(["languageMath", "language_data"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(HelpModal);





