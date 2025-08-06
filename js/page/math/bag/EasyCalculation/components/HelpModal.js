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

export default class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {currentTopaicData,visible} = this.props   //type:0整数 1分数
    let type = currentTopaicData.topic_type
    let value = currentTopaicData.exercise_thinking
    return (
        <Modal
            animationType="fade"
            title="解题思路"
            transparent
            maskClosable={false}
            visible={visible}
            style={{ width: pxToDp(1920), }}
            closable={false}
            footer={[{ text: "关闭", onPress: this.onCloseHelp }]}
            supportedOrientations={['portrait', 'landscape']}
        >
            {type === '0'?<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1800)} value = {value}>
                  </RichShowView>:<TextView value={value}></TextView>}
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
});
