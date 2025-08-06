import React,{useState,useEffect,useRef} from 'react';
import {View, StyleSheet,Modal,TouchableOpacity,Text,Image,TextInput,Platform} from 'react-native';
import {pxToDp} from '../../util/tools';
import { appStyle, appFont } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setUserInfoNow,setavatar} from '../../action/userInfo'
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import url from "../../util/url";

//type: 头像:avatar 账号信息（姓名等:account 性别:sex 
const sex_list = [
    {
        label:'男生',
        value:'0',
        color1:'#2996CC',
        color2:'#45B0E5'
    },
    {
        label:'女生',
        value:'1',
        color1:'#E5735C',
        color2:'#FF9580'
    }
]

function SetInfo({visible,type,close,btns}){
    const dispatch = useDispatch()
    const { currentUserInfo } = useSelector(
        (state) => state.toJS().userInfo
    );
    const name_info = currentUserInfo.name
    const sex_info = currentUserInfo.sex
    const OS = Platform.OS
    const [avatarList, setAvatarList] = useState([]);
    const [avatarIndex, setAvatarIndex] = useState(-1);
    const [name,setName] = useState(name_info)
    const [sex,setSex] = useState(sex_info)
    useEffect(()=>{
        if(visible){
            // 更改了内容但是没保存就关闭了，需要在打开的时候重置为当前用户信息
            if(type === 'account'){
                setName(name_info)
            }
            if(type === 'sex'){
                setSex(sex_info)
            }
        }
    },[visible])
    useEffect(()=>{
        if(type === 'avatar'){
            getAvatar()
        }
    },[type])

    const getRandomImg = (min, max, count) => {
        const randomNumbers = new Set();
        while (randomNumbers.size < count) {
          const num = Math.floor(Math.random() * (max - min + 1)) + min;
          randomNumbers.add(num);
        }
        return [...randomNumbers];
    };

    const getAvatar = () => {
        const avatarList = getRandomImg(1, 27, 6);
        setAvatarList(avatarList);
        setAvatarIndex(-1);
    }

    const clickBtn = (i,x) => {
        if(i.key === 'refresh'){
            // 刷新
            getAvatar()
        }else if(i.key === 'confirm'){
            // 确认
            confirm()
        }
    }
    const confirm = () => {
        if(type === 'avatar'){
            if(avatarIndex > -1){
                let key = avatarList[avatarIndex];
                let avatar = `personal_customized/s${key}.png`;
                axios.post(api.editMyNickName, {avatar}).then(res => {
                    dispatch(setavatar(avatar))
                    close()
                })
            }
        }
        if(type === 'account'){
            axios.post(api.editMyNickName, { name }).then(res => {
                if (res.data.err_code === 0) {
                    let info = {...currentUserInfo}
                    info.name = name
                    dispatch(setUserInfoNow(info))
                    AsyncStorage.setItem("userInfo", JSON.stringify(info))
                  }
            }).finally(()=>{
                close()
            })
        }
        if(type === 'sex'){
            axios.post(api.editMyNickName, { sex }).then(res => {
                if (res.data.err_code === 0) {
                    let info = {...currentUserInfo}
                    info.sex = sex
                    dispatch(setUserInfoNow(info))
                    AsyncStorage.setItem("userInfo", JSON.stringify(info))
                  }
            }).finally(()=>{
                close()
            })
        }
    }
    const renderContent = () => {
        let content = null
        if(type === 'avatar'){
            content = <View style={[styles.contentAvatar]}>
                <View style={[appStyle.flexLine,appStyle.flexLineWrap,appStyle.flexJusEvenly]}>
                    {avatarList.map((i,x) => {
                        return <TouchableOpacity style={[styles.avatarItem,(x+1)%3 === 0?{marginRight:0}:null,x === avatarIndex && { borderColor: "#F07C39" }]} key={x} onPress={()=>{
                            setAvatarIndex(x)
                        }}>
                            <Image style={[{width:pxToDp(190),height:pxToDp(190),borderRadius: pxToDp(90)}]} source={{ uri: `${url.baseURL}personal_customized/s${i}.png` }}/>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        }
        if(type === 'account'){
            content = <View style={[styles.contentAccount]}>
                <Text style={[{color:"#283139",fontSize:pxToDp(44),marginLeft:pxToDp(60)},appFont.fontFamily_jcyt_700,OS === 'ios'?{marginBottom:pxToDp(30)}:null ]}>修改昵称</Text>
                <TextInput value={name} style={[styles.input]} onChangeText={setName}></TextInput>
            </View>
        }
        if(type === 'sex'){
            content = <View style={[styles.contentSex,appStyle.flexAliCenter]}>
                <Text style={[{color:"#283139",fontSize:pxToDp(44)},appFont.fontFamily_jcyt_700]}>修改性别</Text>
                <View style={[appStyle.flexLine,{marginTop:pxToDp(48)}]}>
                    {sex_list.map((i,x) => {
                        return <TouchableOpacity style={[styles.sexItem,x === 0?{marginRight:pxToDp(80)}:null,sex === i.value?{borderColor:"#FF964A"}:null]} key={x} onPress={()=>{
                            setSex(i.value)
                        }}>
                            <View style={[styles.sexItemInner,{backgroundColor:i.color1}]}>
                                <View style={[styles.sexItemInnerInner,appStyle.flexCenter,{backgroundColor:i.color2}]}>
                                    <Text style={[{color:"#fff",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                                </View> 
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        }
        return <View style={[styles.content]}>
            <TouchableOpacity style={[styles.closeBtn]} onPress={close}>
                <Image style={[{width:pxToDp(100),height:pxToDp(100)}]} source={require("../../images/chineseHomepage/sentence/status2.png")}/>
            </TouchableOpacity>
            {content}
            <View style={[appStyle.flexLine,appStyle.flexJusCenter,{marginTop:pxToDp(52)}]}>
                {btns?<>
                    {btns.map((i,x) => {
                        return <TouchableOpacity style={[styles.btn,{marginRight:x < btns.length - 1?pxToDp(136):0}]} onPress={()=>{
                            clickBtn(i,x)
                        }} key={x}>
                            <View style={[styles.btnInner]}>
                                <Text style={[styles.btnTxt]}>{i.label}</Text>
                            </View>
                        </TouchableOpacity>
                    })}
                </>:<TouchableOpacity style={[styles.btn]} onPress={confirm}>
                    <View style={[styles.btnInner]}>
                        <Text style={[styles.btnTxt]}>确认</Text>
                    </View>
                </TouchableOpacity>}
            </View>
        </View>

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
                    {renderContent()}
                </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: "#EFE9E5",
        borderRadius: pxToDp(100),
        position:'relative',
        paddingBottom:pxToDp(48),
    },
    contentAvatar:{
        width:pxToDp(1360),
        paddingTop:pxToDp(68),
        paddingLeft:pxToDp(160),
        paddingRight:pxToDp(160)
    },
    avatarItem:{
        marginRight:pxToDp(180),
        marginBottom:pxToDp(72),
        width:pxToDp(220),
        height:pxToDp(220),
        borderRadius:pxToDp(105),
        borderWidth:pxToDp(10),
        borderColor:"transparent",
        ...appStyle.flexCenter
    },
    contentAccount:{
        width:pxToDp(960),
        paddingLeft:pxToDp(58),
        paddingRight:pxToDp(58),
        paddingTop:pxToDp(140)
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
    contentSex:{
        width:pxToDp(960),
        paddingTop:pxToDp(96)
    },
    sexItem:{
        width:pxToDp(272),
        height:pxToDp(152),
        borderRadius:pxToDp(200),
        borderWidth:pxToDp(8),
        borderColor:'transparent',
        ...appStyle.flexCenter
    },
    sexItemInner:{
        width:pxToDp(240),
        height:pxToDp(120),
        borderRadius:pxToDp(200),
        paddingBottom:pxToDp(8),
    },
    sexItemInnerInner:{
        flex:1,
        borderRadius:pxToDp(200),
    },
    closeBtn:{
        position:'absolute',
        right:pxToDp(-20),
        top:pxToDp(-20),
        zIndex:1,
    },
    btn: {
        width: pxToDp(320),
        paddingBottom: pxToDp(8),
        backgroundColor: "#F07C39",
        borderRadius: pxToDp(40),
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
export default SetInfo;
