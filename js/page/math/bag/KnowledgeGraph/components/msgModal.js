import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, TouchableOpacity,
} from "react-native";
import {
    borderRadius_tool,
    padding_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../../../theme";
import { connect } from "react-redux";

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultIndex: 1
        }
        this.indeexInterval = null
    }


    render() {
        const { visible, txt, showTitle, txtPinyin } = this.props
        const { resultIndex } = this.state
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        {showTitle ? <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(28), color: '#5A5A68', lineHeight: pxToDp(32) }]}>zài xiǎng yī xiǎng</Text> : null}
                        {showTitle ? <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(48), color: '#5A5A68', lineHeight: pxToDp(56), marginBottom: pxToDp(40) }]}>再想一想</Text> : null}

                        <View style={[appStyle.flexAliCenter]}>
                            <Image source={require('../.././../../../images/mathProgram/pandaHead.png')} style={[size_tool(200)]} />

                            <View style={[size_tool(680, 140), borderRadius_tool(40), appStyle.flexCenter, { backgroundColor: '#EFEFF6', marginBottom: pxToDp(60) }]}>
                                {/* {console.log('定时器', resultIndex)} */}
                                {
                                    txtPinyin && txtPinyin.length > 0 ?
                                        <Text style={[{ fontSize: pxToDp(28), color: '#4C4C59', lineHeight: pxToDp(34) }, appFont.fontFamily_jcyt_500]}> {
                                            txtPinyin
                                        }
                                        </Text>
                                        : null
                                }
                                <Text style={[{ fontSize: pxToDp(48), color: '#4C4C59', lineHeight: pxToDp(50) }, appFont.fontFamily_jcyt_700]}> {
                                    txt
                                }
                                </Text>
                            </View>

                        </View>
                        <TouchableOpacity style={{ marginBottom: pxToDp(40) }} onPress={() => { this.props.close() }}>
                            <View style={[size_tool(400, 150), borderRadius_tool(200), { backgroundColor: '#00836D', paddingBottom: pxToDp(6) }]}>
                                <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#00B295', borderRadius: pxToDp(200) }]}>
                                    <Text style={[appFont.fontFamily_jcyt_500, { fontSize: pxToDp(28), color: '#fff', lineHeight: pxToDp(30) }]}>què dìng</Text>
                                    <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(40), color: '#fff', lineHeight: pxToDp(40) }]}>确定</Text>
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
        width: pxToDp(980),
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
