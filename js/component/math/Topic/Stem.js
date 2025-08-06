import React, { PureComponent } from "react";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import { pxToDp } from "../../../util/tools";
import TextView from '../FractionalRendering/TextView_new'
import topaicTypes from '../../../res/data/MathTopaicType'
import AutoImage from './AutoImage'
import { appStyle, mathFont } from "../../../theme";
import RichShowViewHtml from '../RichShowViewHtml'


class Stem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderSteam = () => {
        const { data, translate, my_style } = this.props
        console.log('Stem-----------', data)
        let { _exercise_stem, exercise_data_type, _exercise_stem_c } = data
        const { stem_txt, stem_txt_trans } = my_style
        if (exercise_data_type === "FS") {
            return <>
                {translate ? <>
                    <TextView value={_exercise_stem_c} txt_style={[stem_txt_trans]} fraction_border_style={[{ borderBottomColor: stem_txt_trans.color }]}></TextView>
                    <AutoImage url={data.public_exercise_image_c}></AutoImage>
                </> : <>
                    <TextView value={_exercise_stem} txt_style={[stem_txt]} fraction_border_style={{ borderBottomColor: stem_txt.color }}></TextView>
                    <AutoImage url={data.public_exercise_image}></AutoImage>
                </>}
            </>
        } else {
            return translate ? <RichShowViewHtml value={_exercise_stem_c} size={28} color={stem_txt_trans.color} p_style={{ lineHeight: pxToDp(60) }}></RichShowViewHtml>
                : <RichShowViewHtml fontFamily={stem_txt.fontFamily} value={_exercise_stem} color={stem_txt.color} p_style={{ lineHeight: pxToDp(76) }}></RichShowViewHtml>
        }
    }
    render() {

        return (
            <>
                {this.renderSteam()}
            </>
        );
    }
}

const styles = StyleSheet.create({
});
export default Stem;
