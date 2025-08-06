import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import { appStyle, appFont } from "../../../theme";
import { pxToDp, pxToDpHeight } from "../../../util/tools";
import url from '../../../util/url'

class AnswerTxtView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderIcon = () => {
        const { value, correct } = this.props
        if (correct === -1) return null
        return value.isWrong ? <Image resizeMode='stretch' style={[styles.correct_img]} source={require('../../../images/MathSyncDiagnosis/cuo_icon.png')}></Image> :
            <Image resizeMode='stretch' style={[styles.correct_img]} source={require('../../../images/MathSyncDiagnosis/dui_icon.png')}></Image>
    }

    renderContent = () => {
        const { value, correct } = this.props
        if (value.isFraction) {
            let _value = JSON.parse(JSON.stringify(value))
            delete _value.isFraction
            delete _value.isWrong
            let correct_color = ''
            if (correct !== -1) {
                value.isWrong ? correct_color = '#FF6680' : correct_color = '#31D860'
            }
            // 需要回显分数
            if (Object.keys(_value).length === 2) {
                // 分数
                return <View style={[appStyle.flexLine]}>
                    <View>
                        <Text style={[styles.txt_1, { textAlign: "center", color: correct_color ? correct_color : "#4C4C59" }]}>{_value[0].init_char_mat.join(',').replaceAll(',', '')}</Text>
                        <View style={[styles.line_f, { borderBottomColor: correct_color ? correct_color : "#4C4C59" }]}></View>
                        <Text style={[styles.txt_1, { textAlign: 'center', color: correct_color ? correct_color : "#4C4C59" }]}>{_value[1].init_char_mat.join(',').replaceAll(',', '')}</Text>
                    </View>
                    {this.renderIcon()}
                </View>

            }
            if (Object.keys(_value).length === 3) {
                // 分数
                return <View style={[appStyle.flexLine]}>
                    <View style={[appStyle.flexLine]}>
                        <Text style={[styles.txt_1, { textAlign: "center", marginRight: pxToDp(4), color: correct_color ? correct_color : "#4C4C59" }]}>{_value[0].init_char_mat.join(',').replaceAll(',', '')}</Text>
                        <View>
                            <Text style={[styles.txt_1, { textAlign: "center", color: correct_color ? correct_color : "#4C4C59" }]}>{_value[1].init_char_mat.join(',').replaceAll(',', '')}</Text>
                            <View style={[styles.line_f, { borderBottomColor: correct_color ? correct_color : "#4C4C59" }]}></View>
                            <Text style={[styles.txt_1, { textAlign: 'center', color: correct_color ? correct_color : "#4C4C59" }]}>{_value[2].init_char_mat.join(',').replaceAll(',', '')}</Text>
                        </View>
                    </View>
                    {this.renderIcon()}
                </View>
            }
        }
        // 需要回显非分数
        return <View style={[appStyle.flexLine]}>
            <View style={[appStyle.flexLine]}>
                {value.init_char_mat.length === 0 ? <Text style={[{ fontSize: pxToDp(40) }, appFont.fontFamily_jcyt_500]}>{' '}</Text> : value.init_char_mat.map((iii, xxx) => {
                    let correct_color = ''
                    if (correct !== -1) {
                        value.isWrong ? correct_color = '#FF6680' : correct_color = '#31D860'
                    }
                    return <Text style={[{ fontSize: pxToDp(40), color: correct_color ? correct_color : "#4C4C59" }, appFont.fontFamily_jcyt_500]} key={xxx}>{iii}</Text>
                })}
            </View>
            {this.renderIcon()}
        </View>
    }

    render() {
        return <>
            {this.renderContent()}
        </>
    }
}

const styles = StyleSheet.create({
    txt_1: {
        fontSize: pxToDp(40),
        ...appFont.fontFamily_jcyt_500,
        color: "#4C4C59"
    },
    line_f: {
        borderBottomColor: '#4C4C59',
        borderBottomWidth: pxToDp(4),
        marginBottom: pxToDp(4),
        marginTop: pxToDp(4)
    },
    correct_img: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginLeft: pxToDp(20)
    }
});
export default AnswerTxtView;
