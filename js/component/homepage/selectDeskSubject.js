import React, { useState } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, TouchableWithoutFeedback, Platform } from "react-native";
import { pxToDp } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";
import MathNavigationUtil from "../../navigator/NavigationMathUtil";

const list = [
    {
        label: "语文作业",
        icon: require('../../images/homepage/desk_yuwen.png')
    },
    {
        label: '数学作业',
        icon: require('../../images/homepage/desk_math.png')
    },
    {
        label: '英语作业',
        icon: require('../../images/homepage/desk_english.png')
    }
]

function SelectDeskSubject({ visible, close, navigation }) {
    const [selectIndex, setSelectIndex] = useState(0)
    const confirm = () => {
        switch (selectIndex) {
            case 0:
                NavigationUtil.toYuwenHomepage({ navigation })
                break;
            case 1:
                MathNavigationUtil.toMathDeskHomepage({ navigation })
                break;
            case 2:
                NavigationUtil.toEnglishDeskHomepage({ navigation })
                break;
        }
        close()
    }
    return (
        <Modal
            animationType="fade"
            transparent
            maskClosable={false}
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
        >
            <View style={[{ flex: 1, backgroundColor: "rgba(0,0,0,.5)" }, appStyle.flexCenter]}>
                <TouchableWithoutFeedback onPress={close}>
                    <View style={[styles.click_region]}></View>
                </TouchableWithoutFeedback>
                <View style={[appStyle.flexLine, { position: 'absolute' }, { transform: [{ translateY: pxToDp(-50) }] }]}>
                    {list.map((i, x) => {
                        return <TouchableOpacity style={[styles.item, x === 2 ? { marginRight: 0 } : null, selectIndex === x ? { borderColor: "#FF964A" } : null]} key={x} onPress={() => {
                            setSelectIndex(x)
                        }}>
                            <View style={[styles.inner]}>
                                <View style={[styles.innerInner, appStyle.flexCenter]}>
                                    <Image resizeMode='contain' style={[{ width: pxToDp(120), height: pxToDp(120) }]} source={i.icon}></Image>
                                    <Text style={[{ color: "#283139", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700, Platform.OS === 'ios' ? { marginTop: pxToDp(12) } : null]}>{i.label}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
                <TouchableOpacity style={[styles.btn, { transform: [{ translateY: pxToDp(220) }] }]} onPress={confirm}>
                    <View style={[styles.btnInner, appStyle.flexCenter]}>
                        <Text style={[{ color: "#fff", fontSize: pxToDp(44) }, appFont.fontFamily_jcyt_700]}>确定</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    click_region: {
        flex: 1,
        width: '100%',
    },
    item: {
        width: pxToDp(216),
        height: pxToDp(256),
        borderWidth: pxToDp(8),
        borderRadius: pxToDp(50),
        borderColor: "transparent",
        padding: pxToDp(10),
        marginRight: pxToDp(40)
    },
    inner: {
        flex: 1,
        backgroundColor: '#DFE0E1',
        borderRadius: pxToDp(30),
        paddingBottom: pxToDp(8)
    },
    innerInner: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: pxToDp(30),
    },
    btn: {
        width: pxToDp(320),
        height: pxToDp(128),
        borderRadius: pxToDp(40),
        backgroundColor: '#F07C39',
        paddingBottom: pxToDp(8),
        marginTop: pxToDp(78),
        position: 'absolute'
    },
    btnInner: {
        flex: 1,
        backgroundColor: '#FF964A',
        borderRadius: pxToDp(40)
    }
});
export default SelectDeskSubject;
