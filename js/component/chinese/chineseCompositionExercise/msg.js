import React, { Component } from "react";
import {
    View, StyleSheet, Image, Modal, Text, TouchableOpacity,
} from "react-native";
import {
    borderRadius_tool,
    padding_tool,
    pxToDp, pxToDpHeight, size_tool,
} from "../../../util/tools";
import { appFont, appStyle, mathFont } from "../../../theme";
import { connect } from "react-redux";

class StatisticsModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { visible, title, msg, btnText } = this.props

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
            >
                <View style={[styles.container]}>
                    <View style={[styles.content]}>
                        <Text style={[{ fontSize: pxToDp(48), color: '#475266', marginBottom: pxToDp(40), textAlign: 'left' }, appFont.fontFamily_jcyt_700,]}>请完成文章下所有的题目，才能查看答题记录哦！</Text>
                        <View style={[appStyle.flexTopLine, appStyle.flexAliCenter]}>
                            <TouchableOpacity style={{ marginRight: pxToDp(60) }} onPress={() => { this.props.cancel() }}>
                                <View style={[size_tool(216, 128), borderRadius_tool(200), { backgroundColor: '#F07C39', paddingBottom: pxToDp(6) }]}>
                                    <View style={[appStyle.flexCenter, { flex: 1, backgroundColor: '#FF964A', borderRadius: pxToDp(200) }]}>
                                        <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(46), color: '#fff', }]}>继续答题</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{}} onPress={() => { this.props.todo() }}>
                                <Text style={[appFont.fontFamily_jcyt_700, { fontSize: pxToDp(46), color: '#FF964A', }]}>完成</Text>

                            </TouchableOpacity>
                        </View>


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
        width: pxToDp(714),
        borderRadius: pxToDp(60),
        backgroundColor: "#fff",
        ...appStyle.flexAliCenter,
        ...padding_tool(40, 60, 40, 60)
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
