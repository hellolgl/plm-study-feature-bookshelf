import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Platform, DeviceEventEmitter } from 'react-native';
import { pxToDp } from '../../util/tools';
import { appFont, appStyle } from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import Lottie from 'lottie-react-native';
import TtsPlayAudio from '../../component/TtsPlayAudio'

const CHIOCE_MAP = {
    0: 'A',
    1: 'B',
    2: "C",
    3: "D"
}

function Bubble(props) {
    const { currentMessage, isSameUser, isSameDay, previousMessage, selectAnswer } = props
    const { text, user } = currentMessage
    const { playText } = useSelector(
        (state) => state.toJS().aiTalk,
    );
    const [choiceIndex, setChoiceIndex] = useState(-1)

    const isValidJson = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (error) {
            return false;
        }
    }
    const isUser = user._id === 2
    //   const isTopic = user._id !== 2
    const isTopic = false
    const showLoading = text === '...'
    //   if(isValidJson(text)){
    //     console.log('fffff',text)
    //     console.log('gggg',JSON.parse(text))
    //   }

    // console.log('fffff',props)
    // console.log('isSameUser:::::',isSameUser(currentMessage, previousMessage))
    // console.log('isSameDay:::::',isSameDay(currentMessage, previousMessage))
    const select = (i, x) => {
        setChoiceIndex(x)
        selectAnswer(CHIOCE_MAP[x])
    }

    const renderSystemContent = () => {
        return <View style={[styles.bubbleTopicWrap]}>
            <View style={[styles.stemWrap]}>
                <TouchableOpacity style={[appStyle.flexLine]}>
                    <Image style={{ width: pxToDp(89), height: pxToDp(85), marginRight: pxToDp(26) }} source={require('../../images/aiGiveExercise/play_btn_2.png')}></Image>
                    <Text style={[{ color: "#fff", fontSize: pxToDp(37), width: '93%' }, appFont.fontFamily_jcyt_500]}>在计算25+14X3+6时，先算（   ），再算（   ），最后算（   ）。</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.ChoiceWrap, appStyle.flexLine, appStyle.flexLineWrap, appStyle.flexJusBetween]}>
                {['选项1', '选项2', '选项3', '选项4'].map((i, x) => {
                    return <TouchableOpacity style={[styles.item, choiceIndex === x ? { borderColor: '#FFA656' } : null]} key={x} onPress={() => {
                        select(i, x)
                    }}>
                        <View style={[styles.itemInner]}>
                            <View style={[styles.itemInnerInner]}>
                                <View style={[styles.itemChoice]}>
                                    <Text style={[{ color: '#475266', fontSize: pxToDp(37) }, appFont.fontFamily_jcyt_700]}>{CHIOCE_MAP[x]}</Text>
                                </View>
                                <Text style={[{ color: "#475266", fontSize: pxToDp(33) }, appFont.fontFamily_jcyt_500]}>{i}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                })}
            </View>
            {/* <Text style={[{fontSize: 20,textAlign:isUser?'right':'left'}]}>{text}</Text> */}
            {/* {isValidJson(text) && Array.isArray(JSON.parse(text))?JSON.parse(text).map((i,x) => {
                return <TouchableOpacity key={x} onPress={()=>{
                    selectAnswer(i)
                }}>
                <Text style={[{fontSize:20}]}>{i}</Text>
            </TouchableOpacity>
            }):null} */}
        </View>
    }

    const renderLoading = () => {
        if (isUser || showLoading) return null
        let img = require('../../images/aiGiveExercise/play_btn_1.png')
        if (text === playText) img = require('../../images/aiGiveExercise/pause_btn_1.png')
        return <Image style={[{ width: pxToDp(89), height: pxToDp(85), marginRight: pxToDp(20) }]} source={img}></Image>
    }

    return (
        <>
            {!isTopic ?
                <TtsPlayAudio disablePlay={isUser || showLoading} text={text} emit={true}>
                    <View style={[styles.bubbleWrap, isUser ? { ...appStyle.flexTopLine, ...appStyle.flexAliCenter } : appStyle.flexLine, { backgroundColor: isUser ? '#00B295' : '#E3F2FF' }, isUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }]}>
                        {renderLoading()}
                        {showLoading ? <Lottie source={require('./lottie/loading.json')} autoPlay style={[{ width: pxToDp(80), height: pxToDp(70), marginTop: pxToDp(-5) }]} />
                            : <Text style={[{ color: isUser ? "#fff" : '#4C4C59', fontSize: pxToDp(37), maxWidth: Platform.OS === 'android' ? pxToDp(1580) : pxToDp(1610) }, appFont.fontFamily_jcyt_500]}>{text}</Text>}
                    </View>
                </TtsPlayAudio>
                : renderSystemContent()}
        </>
    );
}
const styles = StyleSheet.create({
    bubbleWrap: {
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(70),
        minHeight: pxToDp(120),
        minWidth: pxToDp(200),
        shadowColor: '#000000',
        shadowOffset: {
            width: pxToDp(0),
            height: pxToDp(4),
        },
        shadowOpacity: 0.15,
        elevation: 3,
    },
    bubbleTopicWrap: {
        flex: 1
    },
    stemWrap: {
        backgroundColor: "#659CFF",
        paddingTop: pxToDp(30),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderTopRightRadius: pxToDp(70),
        paddingBottom: pxToDp(90)
    },
    item: {
        width: pxToDp(821),
        borderWidth: pxToDp(5),
        // borderColor:'#FFA656',
        borderColor: "transparent",
        borderRadius: pxToDp(30),
        marginBottom: pxToDp(30),
        padding: pxToDp(5)
    },
    itemInner: {
        backgroundColor: '#E4E4F0',
        borderRadius: pxToDp(30),
        minHeight: pxToDp(124),
        paddingBottom: pxToDp(5)
    },
    itemInnerInner: {
        flex: 1,
        backgroundColor: '#F5F5FA',
        borderRadius: pxToDp(30),
        paddingLeft: pxToDp(24),
        ...appStyle.flexLine
        // backgroundColor:"red"
    },
    itemChoice: {
        width: pxToDp(60),
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        backgroundColor: "#fff",
        ...appStyle.flexCenter,
        marginRight: pxToDp(32)
    },
    ChoiceWrap: {
        backgroundColor: "#E3F2FF",
        borderRadius: pxToDp(60),
        borderBottomRightRadius: 0,
        padding: pxToDp(46),
        marginTop: pxToDp(-60)
    },
})
export default Bubble;
