import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image
} from "react-native";
import {
  pxToDp,
} from "../../util/tools";
import RichShowView from './RichShowView'
import { Modal } from "antd-mobile-rn";
import TextView from './FractionalRendering/TextView'
import AutoImage from './Topic/AutoImage'
import { cos } from "react-native-reanimated";
export default class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {visible,currentTopaicData} = this.props
    let type = currentTopaicData.exercise_data_type
    let img = currentTopaicData.problem_solving_image
    let problem_solving = currentTopaicData.problem_solving
    return (
      <Modal
          animationType="fade"
          title="解题思路"
          transparent
          maskClosable={false}
          visible={visible}
          style={{ width: pxToDp(1500)}}
          closable={false}
          footer={[{ text: "关闭", onPress: this.onCloseHelp }]}
        >   
          {type=== 'FS'?<>
            <TextView value={problem_solving}></TextView>
            {img?<AutoImage url={img}></AutoImage>:null}
          </>:<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1400)} value = {problem_solving?problem_solving:''}>
            </RichShowView>
            }
            
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
});
