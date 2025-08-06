import React, { useState } from "react";
import { View, StyleSheet, Image, Modal, TouchableOpacity, Text, TouchableWithoutFeedback } from "react-native";
import { pxToDp } from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import NavigationUtil from "../../navigator/NavigationUtil";

const list = [
    {
        label: "语文错题集",
        icon: require('../../images/homepage/icon_24.png')
    },
    {
        label: '数学错题集',
        icon: require('../../images/homepage/icon_25.png')
    },
    {
        label: '英语错题集',
        icon: require('../../images/homepage/icon_28.png')
    }
]

function SelectWrongSubject({ visible, close, navigation }) {
    const [selectIndex, setSelectIndex] = useState(0)
    const confirm = () => {
        switch (selectIndex) {
            case 0:
                NavigationUtil.toChooseWrongExercise({ navigation });
                break;
            case 1:
                NavigationUtil.toMathWrongExercise({ navigation });
                break;
            case 2:
                NavigationUtil.toEnglishWrongExercise({ navigation });
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
                                <View style={[styles.innerInner, appStyle.flexLine, appStyle.flexCenter]}>
                                    <Image style={[{ width: pxToDp(60), height: pxToDp(60), marginRight: pxToDp(20) }]} source={i.icon}></Image>
                                    <Text style={[{ color: "#283139", fontSize: pxToDp(36) }, appFont.fontFamily_jcyt_700]}>{i.label}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
                <TouchableOpacity style={[styles.btn, { transform: [{ translateY: pxToDp(160) }] }]} onPress={confirm}>
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
        width: pxToDp(400),
        height: pxToDp(156),
        borderWidth: pxToDp(8),
        borderRadius: pxToDp(50),
        borderColor: "transparent",
        padding: pxToDp(10),
        marginRight: pxToDp(100)
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
export default SelectWrongSubject;
