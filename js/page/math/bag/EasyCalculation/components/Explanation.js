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
    let type = currentTopaicData.topic_type
    let value = currentTopaicData.exercise_explanation
    let isFraction = currentTopaicData.isFraction
    return (
        <>
        {type === '0' && !isFraction?<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={this.props.width?this.props.width:pxToDp(1850)} value = {value}>
                  </RichShowView>:<>
                    {currentTopaicData.exercise_method?<TextView value={currentTopaicData.exercise_method}></TextView>:null}
                    {currentTopaicData.exercise_explanation_img?<AutoImage url={currentTopaicData.exercise_explanation_img}></AutoImage>:null}
                    {currentTopaicData.exercise_meaning? <TextView value={currentTopaicData.exercise_meaning}></TextView>:null}
                    {currentTopaicData.exercise_explanation? <TextView value={currentTopaicData.exercise_explanation}></TextView>:null}
                    {currentTopaicData.understand_img?<AutoImage url={currentTopaicData.understand_img}></AutoImage>:null}
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
