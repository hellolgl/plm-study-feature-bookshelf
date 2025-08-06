import React,{useState,useEffect,useRef} from 'react';
import {View, StyleSheet,Modal,TouchableOpacity,Text,Image,TextInput} from 'react-native';
import {pxToDp} from '../../util/tools';
import { appStyle, appFont } from "../../theme";
import _ from 'lodash'
import url from '../../util/url'

const baseURL = url.baseURL
const map = {
    1:{
        code:`${baseURL}QRcode/wx_code.png`,
    },
    2:{
        code:`${baseURL}QRcode/miniPZS.jpg`,
    }
}
// type: 1:微信客服，2:派知识小程序
function Contact({visible,close,type,tips,size}){
    return (
        <Modal
            animationType="fade"
            transparent
            maskClosable={false}
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
            >
                <View style={[{ flex: 1, backgroundColor: "rgba(0,0,0,.5)" },appStyle.flexCenter]}>
                    <View style={[styles.content,appStyle.flexAliCenter]}>
                        <TouchableOpacity style={[styles.closeBtn]} onPress={close}>
                            <Image style={[{width:pxToDp(100),height:pxToDp(100)}]} source={require("../../images/chineseHomepage/sentence/status2.png")}/>
                        </TouchableOpacity>
                        <Image resizeMode="contain" style={[{width:pxToDp(480),height:pxToDp(480)}]} source={{uri:map[type].code}}></Image>
                        {tips?<Text style={[{color:"#283139",fontSize:size?size:pxToDp(40)},appFont.fontFamily_jcyt_700]}>{tips}</Text>:null}
                    </View>
                </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: "#fff",
        borderRadius: pxToDp(100),
        position:'relative',
        paddingBottom:pxToDp(80),
        width:pxToDp(800),
        paddingTop:pxToDp(80),
    },
    closeBtn:{
        position:'absolute',
        right:pxToDp(-20),
        top:pxToDp(-20)
    }
});
export default Contact;
