import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, TouchableOpacity,
} from "react-native";
import {
    borderRadius_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { visible, isGood, know } = this.props

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        <Image source={isGood ? require('../../../../../images/aiGiveExercise/icon1.png') : require('../../../../../images/aiGiveExercise/icon3.png')} style={[size_tool(160), { marginBottom: pxToDp(20) }]} />
                        <Text style={[{ fontSize: pxToDp(28), color: '#475266', marginBottom: pxToDp(40) }, appFont.fontFamily_jcyt_500]}>{isGood ? '你已经非常棒了！' : '需要先巩固基础哦～'}</Text>

                        <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59', lineHeight: pxToDp(60) }, appFont.fontFamily_jcyt_700]}>即将练习：</Text>
                        <Text style={[{ fontSize: pxToDp(36), color: '#4C4C59', lineHeight: pxToDp(60) }, appFont.fontFamily_jcyt_700]}>“{know}”</Text>
                        <TouchableOpacity style={{ marginTop: pxToDp(60) }} onPress={() => { this.props.todo() }}>
                            <View style={[size_tool(400, 100), borderRadius_tool(40), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(40) }]}>
                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#fff' }]}>去练习</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[size_tool(400, 100), appStyle.flexCenter]} onPress={() => { this.props.close() }}>
                            <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(32), color: '#00B295' }]}>不用</Text>

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
        width: pxToDp(732),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(40)
    },

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
