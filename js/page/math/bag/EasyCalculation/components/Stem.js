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

  onCloseHelp = () => {
    this.props.onCloseHelp()
  }

  render() {
    const { currentTopaicData } = this.props   //type:0整数 1分数
    let type = currentTopaicData.topic_type
    let value = currentTopaicData.exercise_stem
    let isFraction = currentTopaicData.isFraction   //拓展应用题是isFraction
    return (
      <>
        {type === '0' && !isFraction ? <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={this.props.width ? this.props.width : pxToDp(1850)} value={value.replaceAll('#k#', '___')}>
        </RichShowView> : <>
          <TextView value={type === '0' ? value?.replaceAll('#k#', '___') : value}></TextView>
          {currentTopaicData.exercise_stem_img ? <AutoImage url={currentTopaicData.exercise_stem_img}></AutoImage> : null}
        </>}
      </>
    );
  }
}

const styles = StyleSheet.create({
});
