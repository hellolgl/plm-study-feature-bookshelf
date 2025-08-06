import React, { PureComponent } from "react";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
    pxToDp,
    size_tool,
    padding_tool
} from "../../../util/tools";
import { appStyle } from "../../../theme";

import fonts from "../../../theme/fonts";

class Bar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { show_main, show_translate, back_zh, back_ch, onPress } = this.props
        return (
            <TouchableOpacity onPress={onPress} style={[appStyle.flexTopLine, appStyle.flexAliCenter, size_tool(120, 80),]}>
                <Image style={[size_tool(120, 80)]} source={require('../../../images/chineseHomepage/pingyin/new/back.png')} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    mainFont: {
        fontSize: pxToDp(36),
        color: '#475266',
        ...fonts.fontFamily_jcyt_700,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(42)
    },
    tranFont: {
        fontSize: pxToDp(28),
        color: '#475266',
        ...fonts.fontFamily_jcyt_500,
        marginRight: pxToDp(4),
        lineHeight: pxToDp(33)
    },
});

export default Bar;
