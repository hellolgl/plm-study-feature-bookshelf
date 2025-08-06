import React, { PureComponent } from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    ImageBackground
} from "react-native"
import _, { size } from "lodash"

import { pxToDp, size_tool } from "../../../../../util/tools"
import { appFont, appStyle, mathFont } from "../../../../../theme"
import { connect } from "react-redux";
import * as actionCreators from "../../../../../action/yuwen/language";
import fonts from "../../../../../theme/fonts"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SelectLanguageModal extends PureComponent {
    constructor(props) {
        super(props)
    }

    close = () => {
        this.props.close()
    }
    render() {
        const { show, ruleConfig, img } = this.props
        if (!show) return null
        return <View style={[styles.container]}>
            <TouchableWithoutFeedback onPress={this.close}>
                <View style={[styles.click_region]}></View>
            </TouchableWithoutFeedback>
            <View style={[styles.content]}>
                <View style={[styles.rule_skill_con]}>
                    <Image style={styles.rule_skill} source={require('../../../../../images/MathUnitDiagnosis/rule_skill.png')} />
                    <Text style={[{ fontSize: pxToDp(24), color: '#4C4C59', }, appFont.fontFamily_jcyt_500]}>规则</Text>
                </View>
                <Image style={styles.rule_img} source={require('../../../../../images/MathUnitDiagnosis/rule.png')} />
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        position: 'absolute',
        // top: pxToDp(Platform.OS === 'ios' ? 140 : 120),
        left: 0,
        ...appStyle.flexAliCenter,
        zIndex: 3,
        elevation: 3
    },
    click_region: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(71, 82, 102, 0.5)',
    },
    content: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? pxToDp(186 * 2) : pxToDp(139 * 2),
        width: pxToDp(640),
        // backgroundColor: '#E7E7F2',
        borderRadius: pxToDp(60),
        // ...appStyle.flexAliCenter,
        // paddingBottom: pxToDp(8),
        right: Platform.OS === 'ios' ? pxToDp(-26) : pxToDp(-60)
    },
    inner: {
        width: '100%',
        padding: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(60),
    },
    item: {
        paddingBottom: pxToDp(6)
    },
    item_inner: {
        paddingLeft: pxToDp(20),
        ...appStyle.flexLine
    },
    triangle_up: {
        width: 0,
        height: 0,
        borderLeftWidth: pxToDp(16),
        borderLeftColor: 'transparent',
        borderRightWidth: pxToDp(16),
        borderRightColor: 'transparent',
        borderBottomWidth: pxToDp(20),
        borderBottomColor: '#fff',
        position: 'absolute',
        top: pxToDp(-20),
        right: pxToDp(50)
    },
    rule_img: {
        width: pxToDp(183 * 2),
        height: pxToDp(162 * 2),
        top: pxToDp(24)
    },
    rule_skill_con: {
        width: pxToDp(120),
        height: pxToDp(26 * 2),
        backgroundColor: '#F0F0FA',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: pxToDp(200),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        elevation: 20,
        top: pxToDp(-44),
        right: pxToDp(274)

    },
    rule_skill: {
        width: pxToDp(28),
        height: pxToDp(28),
        marginRight: pxToDp(4),
        top: pxToDp(-2)
    },


})
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(SelectLanguageModal);
