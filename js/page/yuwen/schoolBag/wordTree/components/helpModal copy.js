import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Modal, View, Text } from 'react-native';
import { pxToDp } from '../../../../../../util/tools';
import { appFont, appStyle } from "../../../../../../theme";
import { useSelector } from "react-redux";
import PlayAudioBtn from '../../../../../../component/PlayAudioBtn'
import url from "../../../../../../util/url";
import RichShowView from "../../../../../../component/chinese/newRichShowView";

let baseUrl = url.baseURL;

function HelpModal({ visible, close, data }) {
    const { playingAudio } = useSelector(
        (state) => state.toJS().audioStatus,
    );
    const { explanation_audio, knowledgepoint_explanation } = data
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View style={[styles.container]}>
                <View style={[styles.content]}>
                    {explanation_audio ? <PlayAudioBtn audioUri={baseUrl + explanation_audio}>
                        <Image
                            style={{
                                width: pxToDp(360),
                                height: pxToDp(140),
                                resizeMode: "contain",
                            }}
                            resizeMode="contain"
                            source={baseUrl + explanation_audio === playingAudio ? require("../../../../../../images/chineseHomepage/composition/audioPlay.png") : require("../../../../../../images/chineseHomepage/composition/audiostop.png")}
                        />
                    </PlayAudioBtn> : null}
                    {knowledgepoint_explanation ? <RichShowView
                        width={pxToDp(850)}
                        value={knowledgepoint_explanation}
                        size={6}
                    ></RichShowView> : null}
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
export default HelpModal;
