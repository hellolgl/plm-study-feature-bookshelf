import React,{useEffect, useRef} from 'react';
import {TouchableOpacity,StyleSheet,Image,Modal,View,Text, Platform,Animated,Dimensions} from 'react-native';
import { pxToDp,pxToDpHeight } from '../util/tools';
import { appFont, appStyle, mathFont } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import Lottie from 'lottie-react-native';

function Congrats({finish}) {
    const {visibleCongrats,totalStar,inModule} = useSelector(
        (state) => state.toJS().children
    )
    const dispatch = useDispatch();
    const OS = Platform.OS
    const fadeAnim = useRef(new Animated.Value(0)).current;
    // console.log('inModule::::::',inModule,visibleCongrats)
    const close = ()=>{
        finish && finish()
        dispatch({
            type: "children/setVisibleCongrats",
            data:false,
        });
    }
    const onAnimationFinish = () => {
        // console.log('动画播放完毕::::::::')
        if(inModule){
            setTimeout(()=>{
                close()
            },2000)
        }else{
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start(({finished})=>{
                if(finished){
                    setTimeout(()=>{
                        close()
                    },2000)
                }
            });
        }
    }
    if(!visibleCongrats) return null
    return (
        <View style={[styles.container]}>
            <Lottie 
                source={inModule?require("../page/children/starModule.json"):require("../page/children/starHomePage.json")}
                loop={false}
                autoPlay
                onAnimationFinish={onAnimationFinish}
                style={[
                    {
                        height: Dimensions.get("window").height - 100,
                        width: Dimensions.get("window").width,
                    },
                    OS === 'ios' && inModule?{width:pxToDp(1000)}:null
                ]}  
            />
            <Animated.View style={[{position:'absolute',top:OS === 'android'?pxToDpHeight(510):pxToDpHeight(530),left:OS === 'android'?pxToDp(1060):pxToDp(1110),height:pxToDp(108),opacity:fadeAnim},appStyle.flexLine]}>
                <Image
                    resizeMode='stretch'
                    style={[
                    {
                        width: pxToDp(112),
                        height: pxToDp(108),
                        marginRight: pxToDp(10),
                        // backgroundColor:"red"
                    },
                    ]}
                    source={require("../images/childrenStudyCharacter/star_2.png")}
                ></Image>
                <Text style={[styles.txt1]}>x</Text>
                <Text style={[styles.txt1]}>{totalStar}</Text>
            </Animated.View>
            {inModule?null:<TouchableOpacity style={[{position:"absolute",top:pxToDp(129),right:pxToDp(198)}]} onPress={close}>
                <Image style={[{width:pxToDp(102),height:pxToDp(102)}]} source={require('../images/children/close_btn_1.png')}></Image>
            </TouchableOpacity>}
        </View>
  );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"rgba(0, 0, 0, .7)",
        ...appStyle.flexCenter,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        position:"absolute",
        top:0,
        left:0,
        zIndex:999
    },
    txt1:{
        color:'#FF915D',
        fontSize:pxToDp(75),
        ...appFont.fontFamily_jcyt_700
    }
})
export default Congrats;
