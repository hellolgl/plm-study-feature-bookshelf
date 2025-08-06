import * as React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { pxToDp, pxToDpHeight } from '../../util/tools';



function BackBtn({ style, goBack, img, top, left }) {
    return (
        <TouchableOpacity style={[styles.back_btn, style ? style : null, { top: top || top === 0 ? top : Platform.OS === 'android' ? pxToDpHeight(20) : pxToDpHeight(40), left: left ? left : pxToDp(40) }]} onPress={goBack}>
            <Image style={{ width: pxToDp(120), height: pxToDp(80) }} resizeMode='contain' source={img ? img : require('../../images/MathSyncDiagnosis/back_btn_1.png')}></Image>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    back_btn: {
        position: 'absolute',
        zIndex: 1
    },
})
export default BackBtn;
