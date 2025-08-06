import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from "react-native";
import {
  pxToDp,
} from "../../../../../util/tools";
import RichShowView from '../../../../../component/math/RichShowView'
import { Modal } from "antd-mobile-rn";
import TextView from '../../../../../component/math/FractionalRendering/TextView'
import AutoImage from '../../../../../component/math/Topic/AutoImage'

export default class Stem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {currentTopaicData} = this.props   //type:0整数 1分数
    let type = '0'
    let stem = ''
    let stem_img = ''
    if(currentTopaicData.answer_type === '5'){
      // 拓展应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      stem = currentTopaicData.private_exercise_stem
      stem_img = currentTopaicData.exercise_stem_img
      if(currentTopaicData.topic_type === '0'){
        stem = currentTopaicData.exercise_stem
      }
    }
    if(currentTopaicData.answer_type === '6'){
      // 同步诊断
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      stem = currentTopaicData.public_exercise_stem
      stem_img = currentTopaicData.public_exercise_image
    }
    if(currentTopaicData.answer_type === '4'){
      // 同步应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      if(currentTopaicData.topic_type === '0'){
        // 死题
        stem = currentTopaicData.public_exercise_stem
      }else{
        stem = currentTopaicData.private_exercise_stem
      }
    }
    return (
        <>
        {type === '0'?<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={this.props.width?this.props.width:pxToDp(1850)} value = {stem}>
          </RichShowView>:<>
            <TextView value = {stem}></TextView>
            {stem_img?<AutoImage url={stem_img}></AutoImage>:null}
            </>}
        </>
    );
  }
}

const styles = StyleSheet.create({
});
