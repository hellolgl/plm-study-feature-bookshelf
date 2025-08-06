import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { pxToDp, size_tool } from "../../../../util/tools";
import Chinese from "./chinese";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import English from "./english";
const Statistics = (props) => {
    const [subject, setsubject] = useState("chinese");
    const back = () => {
        NavigationUtil.goBack(props);
    };
    const changeSubject = (value) => {
        setsubject(value);
    };
    return (
        <View style={[styles.contain]}>
            <View style={[styles.headerWrap]}>
                <TouchableOpacity onPress={back}>
                    <Image
                        source={require("../../../../images/chineseHomepage/pingyin/new/back.png")}
                        style={[size_tool(120, 80)]}
                    />
                </TouchableOpacity>
            </View>
            <View style={[styles.mainWrap]}>
                {subject === "english" ? (
                    <English changeSubject={changeSubject} />
                ) : (
                    <Chinese changeSubject={changeSubject} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    headerWrap: {
        height: pxToDp(160),
        backgroundColor: "#fff",
        justifyContent: "center",
        paddingLeft: pxToDp(40),
    },
    mainWrap: {
        flex: 1,
    },
});

export default Statistics;
