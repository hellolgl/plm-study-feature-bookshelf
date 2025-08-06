import React, { Component } from "react";
import {
  View,StyleSheet,Image,Modal,Text,Platform,TouchableOpacity,ImageBackground
} from "react-native";
import {
  pxToDp, pxToDpHeight,
} from "../../util/tools";
import { appFont, appStyle, mathFont } from "../../theme";
import MyPie from '../../component/myChart/my'
import { connect } from "react-redux";

class StatisticsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,total,wrong,translate,showContinue,content} = this.props
    let language_data = this.props.language_data.toJS();
    const {show_main,show_translate,main_language_map,other_language_map} = language_data
    let correct = total - wrong
    let rate_correct = Math.round((correct/total) *100)
    let page_base_data = {
        allcompleted_z:main_language_map.allcompleted,
        allcompleted_c:other_language_map.allcompleted,
        correct_z:main_language_map.correct,
        correct_c:other_language_map.correct,
        error_z:main_language_map.error,
        error_c:other_language_map.error,
        exit_z:main_language_map.exit,
        exit_c:other_language_map.exit,
    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                {translate?<>
                    {show_main?<Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{page_base_data.allcompleted_z}</Text>:null}
                    {show_translate?<Text style={[mathFont.txt_32_500,mathFont.txt_4C4C59_50]}>{page_base_data.allcompleted_c}</Text>:null}
                </>:<Text style={[styles.txt_1]}>{content?content:'全部完成'}</Text>}
                <View style={[appStyle.flexLine,{marginTop:pxToDp(60),marginBottom:pxToDp(60)}]}>
                    {translate?<>
                        <View style={[appStyle.flexAliCenter,{marginRight:pxToDp(150)}]}>
                            <View style={[styles.pei_wrap,{marginBottom:Platform.OS === 'android'?pxToDp(10):pxToDp(28)}]}>
                                <Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{position:"absolute",zIndex:1}]}>{correct}</Text>
                                <MyPie length={pxToDp(18)} width={72} percent={rate_correct / 100} color={'#31D860'}/>
                            </View>
                            {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_4C4C59,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{page_base_data.correct_z}</Text>:null}
                            {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_4C4C59_50]}>{page_base_data.correct_c}</Text>:null}
                        </View>
                        <View style={[appStyle.flexAliCenter]}>
                            <View style={[styles.pei_wrap,{marginBottom:Platform.OS === 'android'?pxToDp(10):pxToDp(28)}]}>
                            <Text style={[mathFont.txt_48_700,mathFont.txt_4C4C59,{position:"absolute",zIndex:1}]}>{wrong}</Text>
                                <MyPie length={pxToDp(18)} width={72} percent={(100 - rate_correct) / 100} color={'#FF6680'}/>
                            </View>
                            {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_4C4C59,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{page_base_data.error_z}</Text>:null}
                            {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_4C4C59_50]}>{page_base_data.error_c}</Text>:null}
                        </View>
                    </>:<>
                        <View style={[appStyle.flexAliCenter,{marginRight:pxToDp(150)}]}>
                            <View style={[styles.pei_wrap]}>
                                <MyPie length={pxToDp(18)} width={72} percent={rate_correct / 100} color={'#31D860'}/>
                            </View>
                            <Text style={[styles.txt_1,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(8)}:null]}>{correct}题</Text>
                            <Text style={[styles.txt_2,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>正确</Text>
                        </View>
                        <View style={[appStyle.flexAliCenter]}>
                            <View style={[styles.pei_wrap]}>
                                <MyPie length={pxToDp(18)} width={72} percent={(100 - rate_correct) / 100} color={'#FF6680'}/>
                            </View>
                            <Text style={[styles.txt_1,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(8)}:null]}>{wrong}题</Text>
                            <Text style={[styles.txt_2,Platform.OS === 'android'?{marginTop:pxToDp(-20)}:null]}>错误</Text>
                        </View>
                    </>}
                </View>
                {showContinue ?<TouchableOpacity style={[styles.btn_wrap]} onPress={this.props.continue}>
                    <View style={[styles.btn_wrap_inner,appStyle.flexCenter]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>继续挑战</Text>
                    </View>
                </TouchableOpacity>:null}
                <TouchableOpacity onPress={()=>{this.props.close()}}>
                    <ImageBackground resizeMode='stretch' source={require('../../images/MathSyncDiagnosis/btn_bg_5.png')} style={[{width:pxToDp(400),height:pxToDp(112)},appStyle.flexCenter]}>
                        {translate?<>
                            {show_main?<Text style={[mathFont.txt_32_700,mathFont.txt_fff,{marginBottom:Platform.OS === 'android'?pxToDp(-20):pxToDp(10)}]}>{page_base_data.exit_z}</Text>:null}
                            {show_translate?<Text style={[mathFont.txt_24_500,mathFont.txt_fff]}>{page_base_data.exit_c}</Text>:null}
                        </>:<Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>退出</Text>}
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
        width:pxToDp(600),
        borderRadius:pxToDp(40),
        backgroundColor:"#fff",
        ...appStyle.flexAliCenter,
        paddingTop:pxToDp(40),
        paddingBottom:pxToDp(40)
    },
    txt_1:{
        color:"#4C4C59",
        fontSize:pxToDpHeight(48),
        ...appFont.fontFamily_jcyt_500
    },
    txt_2:{
        color:"#9595A6",
        fontSize:pxToDp(22),
        ...appFont.fontFamily_jcyt_500
    },
    pei_wrap:{
        width:pxToDp(88),
        height:pxToDp(88),
        borderWidth: pxToDp(4),
        borderColor: '#E4E4F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:pxToDp(44)
    },
    btn_wrap:{
        width:pxToDp(400),
        height:pxToDp(112),
        backgroundColor:'#00836D',
        borderRadius:pxToDp(40),
        paddingBottom:pxToDp(5),
        marginBottom:pxToDp(32)
    },
    btn_wrap_inner:{
        width:pxToDp(400),
        height:'100%',
        backgroundColor:"#00B295",
        borderRadius:pxToDp(40),
    },
});

const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
  };

  const mapDispathToProps = (dispatch) => {
    return {};
  };

  export default connect(mapStateToProps, mapDispathToProps)(StatisticsModal);
