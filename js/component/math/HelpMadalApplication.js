import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from "react-native";
import {
  pxToDp,
} from "../../util/tools";
import RichShowView from './RichShowView'
import { Modal } from "antd-mobile-rn";
import LineCavans from './LineCavans'
import TextView from './FractionalRendering/TextView'

export default class HelpMadalApplication extends Component {
  constructor(props) {
    super(props);
  }

  onCloseHelp = ()=>{
      this.props.onCloseHelp()
  }

  render() {
    const {currentTopaicDataJs,visible} = this.props
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
        >
            <View style={{ paddingVertical: 20,height:currentTopaicDataJs.line_diagram && currentTopaicDataJs.line_diagram !== '""'?pxToDp(710):'auto'}}>
                {currentTopaicDataJs.exercise_data_type === 'FS' || currentTopaicDataJs.data_type === 'FS'?<TextView value = {currentTopaicDataJs.problem_solving?currentTopaicDataJs.problem_solving:''}>
                </TextView>:<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1800)} value = {currentTopaicDataJs.problem_solving?currentTopaicDataJs.problem_solving:''}>
                  </RichShowView>
                }
                <ScrollView style={{ flex: 1}}>
                    {
                      currentTopaicDataJs.line_diagram && currentTopaicDataJs.line_diagram !== '""' ?<LineCavans
                    groupData={currentTopaicDataJs.line_diagram}
                    alphabet_value={currentTopaicDataJs.alphabet_value}
                    variable_value={currentTopaicDataJs.variable_value}
                    equationExercise = {currentTopaicDataJs.equation_exercise}
                    ></LineCavans>:null
                    }
                </ScrollView>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
});
