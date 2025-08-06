import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool } from "../../../../../util/tools";

import Words from "./words";
import Sentence from "./sentence";
import Reading from "./reading";
const SpeExercise = ({ navigation }) => {
    const typeList = [
        {
            isActive: true,
            text: "今日错题",
        },
        {
            isActive: false,
            text: "本周错题",
        },
        {
            isActive: false,
            text: "本月错题",
        },
        {
            isActive: false,
            text: "本学期错题",
        },
    ];
    const knowType = [
        {
            isActive: true,
            text: "字词积累",
        },
        {
            isActive: false,
            text: "中文句法",
        },
        {
            isActive: false,
            text: "阅读理解",
        },
    ];
    const [typeIndex, settypeIndex] = useState(0);
    const [timeIndex, settimeIndex] = useState(1);
    const changeType = (type) => {
        settypeIndex(type);
    };
    return (
        <View style={[styles.contain]}>
            <View style={[padding_tool(136, 48, 0, 58)]}>
                {knowType.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={changeType.bind(this, index)}
                            key={index}
                            style={[
                                styles.typeWrap,
                                typeIndex === index && { backgroundColor: "#FFB649" },
                            ]}
                        >
                            <View
                                style={[
                                    styles.typeInner,
                                    typeIndex === index && {
                                        backgroundColor: "#FFDB5D",
                                        borderRadius: pxToDp(36),
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.typeTxt,
                                        typeIndex === index && appFont.fontFamily_jcyt_700,
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <View style={[{ flex: 1 }]}>
                <View style={[styles.timeWrap]}>
                    <View style={[styles.timeInner]}>
                        {typeList.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => settimeIndex(index + 1)}
                                    key={index}
                                    style={[
                                        styles.timeItemWrap,
                                        timeIndex === index + 1 && { backgroundColor: "#FFB649" },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.timeItemInner,
                                            timeIndex === index + 1 && {
                                                backgroundColor: "#FFDB5D",
                                                borderRadius: pxToDp(40),
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.timeItemTxt]}>{item.text}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={[{ flex: 1 }]}>
                    {typeIndex === 0 ? (
                        <Words typeIndex={timeIndex} navigation={navigation} />
                    ) : null}
                    {typeIndex === 1 ? (
                        <Sentence typeIndex={timeIndex} navigation={navigation} />
                    ) : null}
                    {typeIndex === 2 ? (
                        <Reading typeIndex={timeIndex} navigation={navigation} />
                    ) : null}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: "row",
    },
    typeWrap: {
        width: pxToDp(320),
        height: pxToDp(120),
        borderRadius: pxToDp(36),
        paddingBottom: pxToDp(9),
    },
    typeInner: {
        flex: 1,
        borderRadius: pxToDp(36),
        ...appStyle.flexCenter,
    },
    typeTxt: {
        ...appFont.fontFamily_jcyt_500,
        fontSize: pxToDp(40),
        color: "#475266",
        lineHeight: pxToDp(40),
    },
    timeWrap: {
        width: pxToDp(1220),
        height: pxToDp(108),
        borderRadius: pxToDp(80),
        backgroundColor: "#DAE2F2",
        paddingBottom: pxToDp(8),
        marginBottom: pxToDp(16),
    },
    timeInner: {
        flex: 1,
        borderRadius: pxToDp(54),
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
    },
    timeItemWrap: {
        width: pxToDp(280),
        height: pxToDp(80),
        paddingBottom: pxToDp(4),
        borderRadius: pxToDp(40),
    },
    timeItemInner: {
        flex: 1,
        borderRadius: pxToDp(40),

        ...appStyle.flexCenter,
    },
    timeItemTxt: {
        ...appFont.fontFamily_jcyt_700,
        fontSize: pxToDp(32),
        lineHeight: pxToDp(32),
        color: "#475266",
    },
});
export default SpeExercise;
