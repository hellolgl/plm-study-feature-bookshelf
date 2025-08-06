import  React,{useEffect, useState} from 'react';
import { View,Image,TouchableOpacity,StyleSheet,Text,Modal, Platform} from 'react-native';
import { pxToDp,getIsTablet,pxToDpWidthLs } from '../util/tools';
import { appFont, appStyle } from "../theme";

function ShareModal({visible,onCancel,shareEvent}) {
    const isPhone = !getIsTablet()
    let styles = stylesTablet;
    if (isPhone) styles = stylesHandset;
    const OS = Platform.OS
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
        >
            <View style={[styles.container]}>
                <View style={[styles.modalContent]}>
                    {OS === 'ios'?<>
                         <Text style={{fontSize: pxToDp(40)}}>
                            发布成功！赶快分享你的作品吧！
                        </Text>
                        <View style={[styles.shareItem]}>
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                }}
                                onPress={()=>{
                                    shareEvent("friends");
                                }}
                            >
                                <Image
                                style={[styles.shareItemImg]}
                                source={require("../images/share/wechat.png")}
                                ></Image>
                                <Text>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                alignItems: "center",
                                }}
                                onPress={()=>{
                                    shareEvent("circle");
                                }}
                            >
                                <Image
                                style={[styles.shareItemImg]}
                                source={require("../images/share/circle.png")}
                                ></Image>
                                <Text>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </>:<>
                        {/* 目前只会在安卓端的创作页出现此显示 */}
                        <Text style={[{fontSize: pxToDp(40)},appFont.fontFamily_jcyt_700]}>
                                发布成功！
                        </Text>
                    </>}
                    <View style={[styles.shareItemBar]}></View>
                    {OS === 'ios'? <TouchableOpacity
                        style={[styles.shareCancelBtn]}
                        onPress={onCancel}>
                        <Text
                            style={{
                                color: "#283139",
                                fontSize: pxToDp(48),
                            }}
                        >
                            取消
                        </Text>
                    </TouchableOpacity>
                    :
                    // 目前只会在安卓端的创作页出现这个按钮
                    <TouchableOpacity
                        style={[styles.shareCancelBtn]}
                        onPress={onCancel}>
                        <Text
                            style={{
                                color: "#283139",
                                fontSize: pxToDp(48),
                            }}
                        >
                            确定
                        </Text>
                    </TouchableOpacity>}
                   
                </View>
            </View>
      </Modal>
    );
}
const stylesHandset = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        ...appStyle.flexCenter,
    },
    modalContent: {
        backgroundColor: "#EFE9E6",
        width: pxToDp(1300),
        borderRadius: pxToDp(30),
        alignItems: "center",
        paddingTop:pxToDp(60),
        paddingBottom:pxToDp(60)
    },
    shareItem: {
        flexDirection: "row",
        marginTop: pxToDp(100),
        width: pxToDp(400),
        justifyContent: "space-between",
        marginBottom: pxToDp(30),
    },
    shareItemImg: {
        width: pxToDp(100),
        height: pxToDp(100),
        zIndex: 1,
        marginBottom: pxToDp(20),
    },
    shareItemBar: {
        backgroundColor: "#D7D2CE",
        height: pxToDp(3),
        width: pxToDp(800),
        marginTop: pxToDp(30),
        marginBottom: pxToDp(30),
    },
    shareCancelBtn: {
        backgroundColor: "#fff",
        width: pxToDp(650),
        height: pxToDp(120),
        borderRadius: pxToDp(100),
        alignItems: "center",
        justifyContent: "center",
        marginTop:pxToDp(30)
    },
  });
  
  const stylesTablet = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      ...appStyle.flexCenter,
    },
    modalContent: {
      backgroundColor: "#EFE9E6",
      width: pxToDp(1300),
      borderRadius: pxToDp(30),
      alignItems: "center",
      paddingBottom:pxToDp(60),
      paddingTop:pxToDp(60)
    },
    shareItem: {
      flexDirection: "row",
      marginTop: pxToDp(100),
      width: pxToDp(400),
      justifyContent: "space-between",
      marginBottom: pxToDp(30),
    },
    shareItemImg: {
      width: pxToDp(100),
      height: pxToDp(100),
      zIndex: 1,
      marginBottom: pxToDp(20),
    },
    shareItemBar: {
      backgroundColor: "#D7D2CE",
      height: pxToDp(3),
      width: pxToDp(800),
      marginTop: pxToDp(30),
      marginBottom: pxToDp(30),
    },
    shareCancelBtn: {
      backgroundColor: "#fff",
      width: pxToDp(650),
      height: pxToDp(120),
      borderRadius: pxToDp(100),
      alignItems: "center",
      justifyContent: "center",
      marginTop:pxToDp(30)
    },
});
export default ShareModal;
