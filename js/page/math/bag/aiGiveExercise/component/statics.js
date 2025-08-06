import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, Platform, TouchableOpacity, ImageBackground
} from "react-native";
import {
    borderRadius_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";
import MyRadarChart from '../../../../../component/myRadarChart'

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { visible, rodarName, rodarvalue, translate } = this.props

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(36), color: '#4C4C59' }]}>当前单元能力分布</Text>
                        {rodarName.length > 0 ? <MyRadarChart valueList={rodarvalue} namelist={rodarName} size={[500, 500]} />
                            :
                            <View style={[size_tool(592), borderRadius_tool(40), { backgroundColor: '#F5F5FA' }, appStyle.flexCenter]} >
                                <ImageBackground source={require('../../../../../images/aiGiveExercise/noStatics.png')} style={[size_tool(400), appStyle.flexCenter]} >
                                    <Image source={require('../../../../../images/chineseWeak.png')} style={[size_tool(40), { marginBottom: pxToDp(12), }]} />
                                    <Text style={[{ fontSize: pxToDp(24), color: '#9595A6' }]}>
                                        没有数据哦
                                    </Text>
                                </ImageBackground>
                            </View>
                        }


                        <TouchableOpacity style={{ marginTop: pxToDp(60) }} onPress={() => { this.props.close() }}>
                            <View style={[size_tool(400, 100), borderRadius_tool(40), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(40) }]}>
                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#fff' }]}>好的</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(76, 76, 89, .6)",
        ...appStyle.flexCenter
    },
    content: {
        width: pxToDp(860),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40)
    },
    txt_1: {
        color: "#4C4C59",
        fontSize: pxToDpHeight(48),
        ...appFont.fontFamily_jcyt_500
    },
    txt_2: {
        color: "#9595A6",
        fontSize: pxToDp(22),
        ...appFont.fontFamily_jcyt_500
    },
    pei_wrap: {
        width: pxToDp(88),
        height: pxToDp(88),
        borderWidth: pxToDp(4),
        borderColor: '#E4E4F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pxToDp(44)
    }
});

const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageMath", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(StatisticsModal);
