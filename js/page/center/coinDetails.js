import React, { useState } from "react";
import { View, StyleSheet, Image,TouchableOpacity,Text,Platform ,FlatList,SafeAreaView} from "react-native";
import { getIsTablet,pxToDpWidthLs, pxToDp } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import { useSelector, useDispatch } from "react-redux";
import BackBtn from '../../component/math/BackBtn'
import {setVisible,setPayCoinVisible} from "../../action/purchase";
import Contact from '../../component/center/contact'
import {setVisibleSignIn} from '../../action/userInfo'

const list = [
    {
        label:'派币的用途',
        des:'派币目前可以用来解锁学习模块、创作AI故事、兑换礼物、打赏他人故事，更多用途敬请期待。',
        data:[
            {
                label:'兑换礼物',
                btn:'立即兑换'
            },
            {
                label:'解锁模块',
                btn:'去解锁'
            }
        ]
    },
    {
        label:'如何赚取派币',
        des:'完成每日任务、答对题目、首次分享故事、他人打赏自己的故事均可获得派币。',
        data:[
            {
                label:'每日打卡',
                btn:'去完成'
            },
            {
                label:'每日任务',
                btn:'去完成'
            },
            {
                label:'正确答题',
                btn:'去完成'
            },
            {
                label:'首次分享故事',
                btn:'去分享'
            },
        ]
    },
]

function CoinDetails ({navigation}){
    const dispatch = useDispatch()
    const { token,currentUserInfo,coin,rewardCoin } = useSelector(
        (state) => state.toJS().userInfo
    );
    const OS = Platform.OS
    const isPhone = !getIsTablet()
    const [visibleConcat,setVisibleConcat] = useState(false)
    const [tips,setTips] = useState('')
    const [size,setSize] = useState(0)
    const clickItem = (x,xx) => {
        if(x === 0){
            switch(xx) {
                case 0:
                    setTips('微信扫一扫，进入派知识小程序商城兑换礼物哟。')
                    setSize(pxToDp(32))
                    setVisibleConcat(true)
                    break;
                case 1:
                    NavigationUtil.toHomePage({navigation})
                    break;
            } 
        }
        if(x === 1){
            switch(xx) {
                case 0:
                    dispatch(setVisibleSignIn(true))
                    break;
                case 1:
                    NavigationUtil.toDailyTaskIndex({navigation})
                    break;
                case 2:
                    NavigationUtil.toHomePage({navigation})
                    break;
                case 3:
                    setTips('微信扫一扫，进入派知识小程序创作中心进行故事分享哟。')
                    setSize(pxToDp(28))
                    setVisibleConcat(true)
                    break;
            }
        }
    }
    const renderItem = ({item,index}) => {
        return <View>
            <Text style={[{color:"#283139",fontSize:pxToDp(44)},appFont.fontFamily_jcyt_700,OS === 'ios'?{marginBottom:pxToDp(22)}:null]}>{item.label}</Text>
            <Text style={[{color:"#6D7075",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_500,OS === 'ios'?{marginBottom:pxToDp(22)}:null]}>{item.des}</Text>
            <View>
                {item.data.map((i,x) => {
                    return <TouchableOpacity style={[styles.item,appStyle.flexLine,appStyle.flexJusBetween]} key={x} onPress={()=>{
                        clickItem(index,x)
                    }}>
                        <Text style={[{color:"#283139",fontSize:pxToDp(36)},appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                        {i.btn?<View style={[styles.btn,appStyle.flexCenter]}>
                            <Text style={[{color:"#fff",fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>{i.btn}</Text>
                        </View>:null}
                    </TouchableOpacity>
                })}
            </View>
        </View>
    }
    return (
        <SafeAreaView style={[styles.container]}>
            <BackBtn left={isPhone?pxToDpWidthLs(50):pxToDp(20)} goBack={()=>{
                NavigationUtil.goBack({navigation});
            }}></BackBtn>
            <View style={[{height:pxToDp(156)},appStyle.flexCenter]}>
                <Text style={[{color:'#283139',fontSize:pxToDp(40)},appFont.fontFamily_jcyt_700]}>我的派币</Text>
            </View>
            <View style={[styles.topRightWrap]}>
                <TouchableOpacity style={[styles.wrap,{marginRight:pxToDp(26)}]} onPress={()=>{
                    dispatch(setPayCoinVisible(true))
                }}>
                    <Image style={[styles.coinIcon]} resizeMode='contain' source={require("../../images/animateCoin.png")}></Image>
                    <Text style={[styles.txt]}>x{coin}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wrap]} onPress={()=>{
                    NavigationUtil.toExpensiveCalendar({navigation})
                }}>
                    <Image style={[styles.coinIcon]} resizeMode='contain' source={require("../../images/animateCoin.png")}></Image>
                    <Text style={[styles.txt]}>派币记录</Text>
                </TouchableOpacity>
            </View>
            <View style={[{paddingLeft:pxToDp(66),paddingRight:pxToDp(66),flex:1}]}>
                <FlatList
                    data={list}
                    renderItem={renderItem}
                />
            </View>
            <Contact type={2} tips={tips} size={size} visible={visibleConcat} close={()=>{
                setVisibleConcat(false)
            }}></Contact>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#EFE9E5",
    },
    item:{
        width:'100%',
        height:pxToDp(188),
        borderRadius:pxToDp(36),
        backgroundColor:'#DCD6D2',
        marginBottom:pxToDp(36),
        paddingLeft:pxToDp(74),
        paddingRight:pxToDp(58)
    },
    topRightWrap:{
        ...appStyle.flexLine,
        position:"absolute",
        top:pxToDp(40),
        right:pxToDp(66)
    },
    txt:{
        color:"#fff",
        fontSize:pxToDp(28),
        ...appFont.fontFamily_jcyt_500
    },
    wrap:{
        width:pxToDp(228),
        height:pxToDp(80),
        borderRadius:pxToDp(66),
        backgroundColor:"#283139",
        ...appStyle.flexLine,
        ...appStyle.flexCenter
    },
    coinIcon:{
        width:pxToDp(48),
        height:pxToDp(58),
        marginRight:pxToDp(16)
    },
    btn:{
        width:pxToDp(316),
        height:pxToDp(108),
        borderRadius:pxToDp(80),
        backgroundColor:"#FF9032"
    }
});
export default CoinDetails;
