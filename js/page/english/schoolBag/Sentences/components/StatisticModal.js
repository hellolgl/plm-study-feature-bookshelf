import React, { PureComponent } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Modal,
  Platform,
  TouchableOpacity
} from "react-native";
import { pxToDp } from "../../../../../util/tools";
import { appFont,appStyle } from "../../../../../theme";
import PlayAudio from '../../../../../util/audio/playAudio'

class StatisticModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        arr:[
            {
                label:'优秀',
                icon:require('../../../../../images/EN_Sentences/icon_3.png')
            },
            {
                label:'良好',
                icon:require('../../../../../images/EN_Sentences/icon_1.png')
            },
            {
                label:'错误',
                icon:require('../../../../../images/EN_Sentences/icon_2.png')
            }
        ]
    };
  }

  onShow = () => {
    const {isUp} = this.props
    if(isUp) PlayAudio.playSuccessSound('https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/finish.wav')
  }

  render() {
    const {visible,excellentNum,goodNum,wrongNum,isUp} = this.props
    const {arr} = this.state
    const MAP = {
        0:excellentNum,
        1:goodNum,
        2:wrongNum
    }
    return <Modal
        animationType="fade"
        transparent
        visible={visible}
        onShow={this.onShow}
        supportedOrientations={['portrait', 'landscape']}
    >
        <View style={[styles.container]}>
            <View style={[styles.content]}>
                <View style={[styles.contentInner]}>
                    <Text style={[{color:"#4C4C59",fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700,Platform.OS === 'android'?{marginBottom:pxToDp(20)}:{marginBottom:pxToDp(40)}]}>{isUp?'完成挑战':'完成'}</Text>
                    <View style={[styles.wrap]}>
                        <View style={[{width:'80%'},appStyle.flexLine,appStyle.flexJusBetween]}>
                            {arr.map((i,x) => {
                                if(!MAP[x] && MAP[x] !== 0) return null
                                return <View style={[appStyle.flexAliCenter]} key={x}>
                                    <Image style={[{width:pxToDp(80),height:pxToDp(80)}]} source={i.icon}></Image>
                                    <Text style={[{color:"#4C4C59",fontSize:pxToDp(80)},appFont.fontFamily_jcyt_700,Platform.OS === 'android'?{marginTop:pxToDp(-30),marginBottom:pxToDp(-30)}:{marginTop:pxToDp(20),marginBottom:pxToDp(20)}]}>{MAP[x]}</Text>
                                    <Text style={[{color:'#4C4C59',fontSize:pxToDp(32)},appFont.fontFamily_jcyt_500]}>{i.label}</Text>
                                </View>
                            })}
                        </View>
                    </View>
                </View>
            </View>
            {isUp?<View style={[appStyle.flexLine,appStyle.flexJusBetween]}>
                <TouchableOpacity style={[styles.btn,{marginRight:pxToDp(40)}]} onPress={()=>{
                    PlayAudio.playSuccessSound('https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/audio/start.wav')
                    this.props.continue()
                }}>
                    <View style={[styles.btnInner,appStyle.flexLine]}>
                        <Image style={[{width:pxToDp(54),height:pxToDp(54),marginRight:pxToDp(26)}]} source={require('../../../../../images/EN_Sentences/icon_8.png')}></Image>
                        <Text style={[{color:'#fff',fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>进阶挑战</Text>
                    </View>
                </TouchableOpacity>
            </View>:<TouchableOpacity style={[styles.btn]} onPress={this.props.close}>
                <View style={[styles.btnInner]}>
                    <Text style={[{color:'#fff',fontSize:pxToDp(48)},appFont.fontFamily_jcyt_700]}>退出</Text>
                </View>
            </TouchableOpacity>}
        </View>
    </Modal>
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"rgba(0, 0, 0, 0.6)",
        ...appStyle.flexCenter
    },
    content:{
        width:pxToDp(720),
        borderRadius:pxToDp(80),
        backgroundColor:"#DAE2F2",
        paddingBottom:pxToDp(8),
        borderRadius:pxToDp(130)
    },
    contentInner:{
        borderRadius:pxToDp(130),
        backgroundColor:"#fff",
        ...appStyle.flexAliCenter,
        padding:pxToDp(40),
        paddingBottom:pxToDp(100)
    },
    wrap:{
        width:"100%",
        backgroundColor:"#F5F6FA",
        borderRadius:pxToDp(40),
        // ...appStyle.flexLine,
        // ...appStyle.flexJusBetween,
        ...appStyle.flexAliCenter,
        padding:pxToDp(60)
    },
    btn:{
        width:pxToDp(384),
        height:pxToDp(128),
        backgroundColor:"#F07C39",
        borderRadius:pxToDp(140),
        paddingBottom:pxToDp(8),
        marginTop:pxToDp(-64)
    },
    btnInner:{
        flex:1,
        backgroundColor:'#FF964A',
        ...appStyle.flexCenter,
        borderRadius:pxToDp(140)
    }
});
export default StatisticModal;
