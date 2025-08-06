import React, { useEffect, useRef, memo } from 'react';
import { Easing, StyleSheet, Image, Animated, View, DeviceEventEmitter, TouchableOpacity, Dimensions, Text } from 'react-native';
import { pxToDp, pxToDpHeight } from '../util/tools';
import { appFont, appStyle, mathFont } from "../theme";
import { useSelector, useDispatch } from "react-redux";
import Lottie from 'lottie-react-native';
import axios from "../util/http/axios";
import api from "../util/http/api";
import { setShowRewardCoin } from '../action/userInfo'

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RewardCoin = memo(function RewardCoin() {
    const { showRewardCoin } = useSelector(
        (state) => state.toJS().userInfo
    )
    const dispatch = useDispatch();
    let rotateAnim = useRef(new Animated.Value(0)).current;
    let scaleAnim = useRef(new Animated.Value(0)).current;
    // console.log('moduleCoin:::::::::',moduleCoin)
    // console.log('showRewardCoin:::::::',showRewardCoin)
    useEffect(() => {
        if (showRewardCoin) {
            startAnimation()
        }
    }, [showRewardCoin])
    const startAnimation = () => {
        Animated.parallel([
            Animated.spring(rotateAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ]).start((result) => {
            if (result) {
                Animated.parallel([
                    Animated.spring(rotateAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    })
                ]).start((result) => {
                    if (result) {
                        dispatch(setShowRewardCoin(false))
                        DeviceEventEmitter.emit("rewardCoinClose") //触发答题页面最后一道题答对，得币动画完了后弹统计框
                    }
                })
            }
        })
    }

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const scaleSpin = scaleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    if (!showRewardCoin) return null
    return (
        <View style={[styles.container]}>
            <Animated.View style={[{ transform: [{ rotateY: spin }, { scale: scaleSpin }] }]}>
                <Image
                    source={require("../images/animateCoin.png")}
                    style={[
                        {
                            width: pxToDp(160),
                            height: pxToDp(160),
                        },
                    ]}
                    resizeMode="contain"
                />
            </Animated.View>
            {/* <TouchableOpacity style={[{position:"absolute",bottom:pxToDp(160),right:pxToDp(60)}]} onPress={startAnimation}>
                <Text style={[{color:"#fff",fontSize:pxToDp(32)}]}>开始</Text>
            </TouchableOpacity> */}
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, .7)",
        ...appStyle.flexCenter,
        zIndex: 999
    }
})
export default RewardCoin;
