import React from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text } from 'react-native';
import { pxToDp } from '../../../../../util/tools';
import { appFont, appStyle } from "../../../../../theme";
import url from "../../../../../util/url";

let baseUrl = url.baseURL;

function DiagnosisModal({ visible, close, diagnosis }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={[styles.container]}>
                <View style={[styles.content]}>
                    <Text style={[{ fontSize: pxToDp(32) }, appFont.fontFamily_syst,]}>{diagnosis}</Text>
                    <View style={[appStyle.flexCenter]}>
                        <TouchableOpacity style={[styles.btn]} onPress={close}>
                            <View style={[styles.btnInner, appStyle.flexCenter]}>
                                <Text style={[{ color: "#fff", fontSize: pxToDp(32) }, appFont.fontFamily_jcyt_700]}>关闭</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content: {
        width: pxToDp(1200),
        borderRadius: pxToDp(40),
        backgroundColor: "#fff",
        padding: pxToDp(40),
    },
    btn: {
        width: pxToDp(400),
        height: pxToDp(110),
        backgroundColor: "#F07C39",
        paddingBottom: pxToDp(6),
        borderRadius: pxToDp(40),
        marginTop: pxToDp(20)
    },
    btnInner: {
        width: '100%',
        flex: 1,
        backgroundColor: "#FF964A",
        borderRadius: pxToDp(40),
        ...appStyle.flexCenter
    }
})
export default DiagnosisModal;
