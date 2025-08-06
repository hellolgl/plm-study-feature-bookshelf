import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import { appFont, appStyle } from "../../../../../theme";
import AutoImage from '../../../../../component/math/Topic/AutoImage'
import TextView from '../../../../../component/math/FractionalRendering/TextView_new'
import RichShowViewHtml from '../../../../../component/math/RichShowViewHtml'


class Stem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data,size,color} = this.props
    const {stem,data_type,stem_img} = data
    return (
      <>
        {data_type === 1?<>
            <TextView value={stem} txt_style={[{color:color?color:"#fff",...appFont.fontFamily_jcyt_500,fontSize:size?pxToDp(size):pxToDp(48)}]} fraction_border_style={[{ borderBottomColor: color?color:'#fff' }]}></TextView>
            {stem_img?<AutoImage url={stem_img}></AutoImage>:null}
        </>:<RichShowViewHtml value={stem} size={size?size:48} color={'#fff'} p_style={Platform.OS === 'android'?{lineHeight:pxToDp(70)}:{}}></RichShowViewHtml>}
      </>
    );
  }
}

const styles = StyleSheet.create({

})


export default Stem
