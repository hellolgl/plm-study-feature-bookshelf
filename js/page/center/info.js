import React, { useState } from "react";
import { View, StyleSheet, Image,Modal,TouchableOpacity,Text,ScrollView,Platform ,FlatList,SafeAreaView} from "react-native";
import { getIsTablet,pxToDpWidthLs , pxToDp } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import { useSelector, useDispatch } from "react-redux";
import BackBtn from '../../component/math/BackBtn'
import Avatar from '../../component/homepage/avatar'
import SetInfo from '../../component/center/setInfo'
import {setVisible,setPayCoinVisible} from "../../action/purchase";

const list = [
    {
        label:'修改头像',
        type:'avatar'
    },
    {
        label:'昵称',
        type:'account'
    },
    {
        label:'修改性别',
        type:'sex'
    },
]

function CenterInfo ({navigation}){
    const dispatch = useDispatch()
    const { token,currentUserInfo,coin,rewardCoin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const {name,sex} = currentUserInfo
    const OS = Platform.OS
    const isPhone = !getIsTablet()
    const [setInfoType,setSetInfoType] = useState('')
    const [setInfoBtns,setSetInfoBtns] = useState(null)
    const [visibleInfo,setVisibleInfo] = useState(false)
    const handleSetInfo = ({type}) => {
        if(type === 'avatar'){
            setSetInfoBtns([{label:'刷新',key:'refresh'},{label:'确定',key:'confirm'}])
        }else{
            setSetInfoBtns(null)
        }
        setSetInfoType(type)
        setVisibleInfo(true)
    }
    const renderLeft = (index) => {
        if(index === 0){
            return <Avatar width={120}></Avatar>
        }
        if(index === 1){
            return <Text style={[styles.txt]}>{name}</Text>
        }
        if(index === 2){
            return <Text style={[styles.txt]}>{sex === '1'?'女':"男"}</Text>
        }
    }
    const renderItem = ({item,index}) => {
        return <TouchableOpacity style={[styles.item,appStyle.flexLine,appStyle.flexAliCenter,appStyle.flexJusBetween]} onPress={()=>{
            handleSetInfo(item)
        }}>
            {renderLeft(index)}
            <View style={[appStyle.flexLine]}>
                <View style={[{width:pxToDp(160),marginRight:pxToDp(90)}]}>
                    <Text style={[styles.txt,{textAlign:'left'}]}>{item.label}</Text>
                </View>
                <Image resizeMode='contain' style={[{width:pxToDp(20),height:pxToDp(20)}]} source={require('../../images/center/icon_6.png')}></Image>
            </View>
        </TouchableOpacity>
    }
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"#EFE9E5",}}>
               <BackBtn left={ isPhone?pxToDpWidthLs(50):pxToDp(20)} goBack={()=>{
                    NavigationUtil.goBack({navigation});
                }}></BackBtn>
            <View style={[styles.container]}>
                <FlatList
                    data={list}
                    renderItem={renderItem}
                />
                <SetInfo type={setInfoType} visible={visibleInfo} btns={setInfoBtns} close={()=>{
                    setVisibleInfo(false)
                }}></SetInfo>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#EFE9E5",
        paddingTop:pxToDp(138),
        paddingLeft:pxToDp(124),
        paddingRight:pxToDp(124)
    },
    item:{
        width:'100%',
        height:pxToDp(188),
        borderRadius:pxToDp(36),
        backgroundColor:'#D7D1CD',
        marginBottom:pxToDp(36),
        paddingLeft:pxToDp(98),
        paddingRight:pxToDp(54)
    },
    txt:{
        color:"#283139",
        fontSize:pxToDp(36),
        ...appFont.fontFamily_jcyt_700
    }
});
export default CenterInfo;
