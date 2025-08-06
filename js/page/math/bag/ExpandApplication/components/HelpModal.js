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

export default class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {currentTopaicData,visible} = this.props   //type:0整数 1分数
    let value = ''
    let type = '0'
    let problem_solving_img = ''
    if(currentTopaicData.answer_type === '5'){
      // 拓展应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      // if(currentTopaicData.topic_type === '0'){
        // 死题
        value = currentTopaicData.problem_solving
      // }else{
      //   value = currentTopaicData.exercise_thinking
      // }
    }
    if(currentTopaicData.answer_type === '6'){
      // 同步诊断
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      value = currentTopaicData.problem_solving
      problem_solving_img = currentTopaicData.problem_solving_image
    }
    if(currentTopaicData.answer_type === '4'){
      // 同步应用
      type = currentTopaicData.exercise_data_type === 'FS'?'1':'0'
      value = currentTopaicData.problem_solving
      problem_solving_img = currentTopaicData.problem_solving_image
    }
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
                  </RichShowView>:<>
                    <TextView value={value}></TextView>
                    {problem_solving_img?<AutoImage url={problem_solving_img}></AutoImage>:null}
                  </>
                  }
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
});
