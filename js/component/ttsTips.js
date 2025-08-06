import * as React from 'react';
import {View, StyleSheet,Dimensions,TouchableOpacity,Image,Text} from 'react-native';
import Lottie from 'lottie-react-native';
import {pxToDp} from '../util/tools';
import { appFont, appStyle } from '../theme';
import { useSelector,useDispatch } from "react-redux";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function TtsTips({visible, close}){
    if(!visible) return null
    const { statusData } = useSelector(
        (state) => state.toJS().tts
    );
    return (
        <View style={[styles.container,appStyle.flexCenter]}>
            <View style={[styles.content,appStyle.flexCenter]}>
                <TouchableOpacity style={[styles.closeBtn]} onPress={close}>
                    <Image style={[{width:pxToDp(100),height:pxToDp(100)}]} source={require("../images/chineseHomepage/sentence/status2.png")}/>
                </TouchableOpacity>
                <Text style={[{color:"#283139",fontSize:pxToDp(38)},appFont.fontFamily_jcyt_500]}>{statusData.msg}</Text>
                <TouchableOpacity style={[styles.btn]} onPress={close}>
                    <View style={[styles.btnInner]}>
                        <Text style={[styles.btnTxt]}>确认</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width:windowWidth,
        height:windowHeight,
        position:'absolute',
        top:0,
        left:0,
        backgroundColor:"rgba(0,0,0,.5)",
        zIndex:999
    },
    content:{
        width:pxToDp(960),
        backgroundColor:"#EFE9E5",
        borderRadius:pxToDp(100),
        padding:pxToDp(60)
    },
    closeBtn:{
        position:'absolute',
        right:pxToDp(-20),
        top:pxToDp(-20)
    },
    btn: {
        width: pxToDp(320),
        paddingBottom: pxToDp(8),
        backgroundColor: "#F07C39",
        borderRadius: pxToDp(40),
        marginTop:pxToDp(20)
    },
    btnInner: {
        height: pxToDp(120),
        borderRadius: pxToDp(40),
        backgroundColor: "#FF964A",
        ...appStyle.flexCenter,
    },
    btnTxt:{
        color:"#fff",
        fontSize:pxToDp(44),
        ...appFont.fontFamily_jcyt_700
    },
});
export default TtsTips;
