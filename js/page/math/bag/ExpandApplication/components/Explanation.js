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

export default class Explanation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {currentTopaicData} = this.props   //type:0整数 1分数
    let type = '0'
    let value = ''
    if(currentTopaicData.answer_type === '5'){
      // 拓展应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      value = currentTopaicData.knowledgepoint_explanation
    }
    if(currentTopaicData.answer_type === '6'){
      // 同步诊断
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      value = currentTopaicData.knowledgepoint_explanation
    }
    if(currentTopaicData.answer_type === '4'){
      // 同步应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      value = currentTopaicData.knowledgepoint_explanation
    }
    return (
        <>
        {type === '0'?<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={this.props.width?this.props.width:pxToDp(1850)} value = {value}>
                  </RichShowView>:<>
                  {/* 同步诊断应用题分数、同步应用应用题分数 */}
                    {currentTopaicData.knowledgepoint_explanation?<TextView value={currentTopaicData.knowledgepoint_explanation}></TextView>:null}
                    {currentTopaicData.knowledgepoint_explanation_image?<AutoImage url={currentTopaicData.knowledgepoint_explanation_image}></AutoImage>:null}
                    {/* 拓展应用分数 */}
                    {/* exercise_explanation取的understand的值   理解题意 */}
                    {currentTopaicData.exercise_explanation? <TextView value={currentTopaicData.exercise_explanation}></TextView>:null} 
                    {currentTopaicData.understand_img?<AutoImage url={currentTopaicData.understand_img}></AutoImage>:null}
                    {/* 确定方法 */}
                    {currentTopaicData.method? <TextView value={currentTopaicData.method}></TextView>:null}
                    {currentTopaicData.method_img?<AutoImage url={currentTopaicData.method_img}></AutoImage>:null}
                    {currentTopaicData.correct_answer? <TextView value={currentTopaicData.correct_answer}></TextView>:null}
                  </>}
        </>
    );
  }
}

const styles = StyleSheet.create({
});
