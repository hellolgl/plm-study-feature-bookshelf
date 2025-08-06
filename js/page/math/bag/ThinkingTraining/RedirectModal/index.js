import React, { Component } from "react";
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {
    margin_tool,
    size_tool,
    pxToDp,
    borderRadius_tool,
    padding_tool,
} from "../../../../../util/tools"
import { appStyle, appFont } from "../../../../../theme"
import { Toast, Modal } from "antd-mobile-rn"
export default class RedirectModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {dialogVisible,yesNumber,wrongNum,showContinue} = this.props
        //   console.log('_______________________________________________',yesNumber,wrongNum)
        return (
            <View style={styles.mainWrap}>
                <Modal
                    animationType="slide"
                    visible={dialogVisible}
                    transparent
                    style={[
                        { width: "100%", height: "100%", backgroundColor: "transparent" },
                        appStyle.flexCenter,
                    ]}
                >
                    <View
                        style={[
                            {
                                backgroundColor: "#fff",
                                width:pxToDp(550),
                            },
                            borderRadius_tool(18),
                            padding_tool(110, 40, 24, 40),
                        ]}
                    >
                        <View style={[appStyle.flexCenter]}>
                            <Text style={[{ color: "#666666" }, appFont.f32]}>
                                {this.props.content?this.props.content:'习题已完成'}
                            </Text>
                        </View>
                        <View
                            style={[
                                appStyle.flexTopLine,
                                appStyle.flexJusBetween,
                                margin_tool(28, 0, 38, 0),
                            ]}
                        >
                        </View>

                        <View style={[appStyle.flexCenter,appStyle.flexLine]}>
                            <TouchableOpacity
                                onPress={this.props.closeDialog}
                                style={[
                                    size_tool(192, 64),
                                    { backgroundColor: "#38B3FF" },
                                    borderRadius_tool(32),
                                    appStyle.flexCenter,
                                ]}
                            >
                                <Text style={[{ color: "#fff" }, appFont.f32]}>{this.props.btnText||'返回界面'}</Text>
                            </TouchableOpacity>
                            {showContinue?<TouchableOpacity
                                onPress={this.props.continue}
                                style={[
                                    size_tool(192, 64),
                                    { backgroundColor: "#38B3FF",marginLeft:pxToDp(16) },
                                    borderRadius_tool(32),
                                    appStyle.flexCenter,

                                ]}
                            >
                                <Text style={[{ color: "#fff" }, appFont.f32]}>继续挑战</Text>
                            </TouchableOpacity>:null}
                        </View>
                        <Image
                            source={require("../../../../../images/end_statistics.png")}
                            style={[
                                size_tool(136),
                                {
                                    position: "absolute",
                                    top: -30,
                                    left: 135,
                                },
                            ]}
                        ></Image>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainWrap: {
    },
});
