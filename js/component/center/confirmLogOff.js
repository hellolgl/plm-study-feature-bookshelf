import React,{useState,useEffect,useRef} from 'react';
import {View, StyleSheet,Modal,TouchableOpacity,Text,Image,TextInput,Platform} from 'react-native';
import {pxToDp} from '../../util/tools';
import { appStyle, appFont } from "../../theme";
import _ from 'lodash'
import axios from "../../util/http/axios";
import api from "../../util/http/api";


function ConfirmLogOff({visible,close,logout}){
    const OS = Platform.OS
    const [txt,setTxt] = useState('')
    const confirm = () => {
        if(txt === '确认注销'){
            axios.post(api.closeAnAccount, {}).then(res => {
                if(res.data.err_code === 0){
                    logout()
                }
            }).finally(()=>{
                close()
            })
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent
            maskClosable={false}
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
            >
                <View style={[{ flex: 1, backgroundColor: "rgba(0,0,0,.5)" },appStyle.flexCenter]}>
                    <View style={[styles.content]}>
                        <TouchableOpacity style={[styles.closeBtn]} onPress={close}>
                            <Image style={[{width:pxToDp(100),height:pxToDp(100)}]} source={require("../../images/chineseHomepage/sentence/status2.png")}/>
                        </TouchableOpacity>
                        <Text style={[{fontSize: pxToDp(44),color: "#FF4E4E"},appFont.fontFamily_jcyt_700,OS === 'ios'?{marginBottom:pxToDp(22)}:null]}>
                            注销账号以后无法找回，请谨慎操作！
                        </Text>
                        <TextInput placeholder={'请输入确认注销'} value={txt} style={[styles.input]} onChangeText={setTxt}></TextInput>
                        <View style={[appStyle.flexAliCenter]}>
                            <TouchableOpacity style={[styles.btn]} onPress={confirm}>
                                <View style={[styles.btnInner]}>
                                    <Text style={[styles.btnTxt]}>确认</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: "#EFE9E5",
        borderRadius: pxToDp(100),
        position:'relative',
        paddingBottom:pxToDp(80),
        width:pxToDp(960),
        paddingTop:pxToDp(80),
        paddingLeft:pxToDp(54),
        paddingRight:pxToDp(54)
    },
    closeBtn:{
        position:'absolute',
        right:pxToDp(-20),
        top:pxToDp(-20)
    },
    input:{
        width:'100%',
        height:pxToDp(160),
        borderRadius:pxToDp(36),
        backgroundColor:"#DCD6D2",
        fontSize:pxToDp(44),
        color:"#828385",
        ...appFont.fontFamily_jcyt_700,
        paddingLeft:pxToDp(60)
    },
    btn: {
        width: pxToDp(320),
        paddingBottom: pxToDp(8),
        backgroundColor: "#F07C39",
        borderRadius: pxToDp(40),
        marginTop:pxToDp(70)
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
export default ConfirmLogOff;
