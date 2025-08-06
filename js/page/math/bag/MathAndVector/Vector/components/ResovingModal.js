import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import {
  pxToDp,
} from "../../../../../../util/tools";
import { Modal } from "antd-mobile-rn";
import { appStyle } from "../../../../../../theme";
export default class HelpModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {visible,resolve,isDoEcerxise} = this.props
    return (
      <Modal
          animationType="fade"
          title="解析"
          transparent
          maskClosable={false}
          visible={visible}
          style={{ width: pxToDp(800)}}
          closable={false}
        >   
          <Text style={{fontSize:pxToDp(32),marginBottom:pxToDp(24)}}>{resolve}</Text>
          {isDoEcerxise? <View style={[appStyle.flexLine,appStyle.flexJusBetween]}>
            <TouchableOpacity style={[{width:'50%'},appStyle.flexCenter]} onPress={ this.props.onContinue}>
              <Text style={[{fontSize:pxToDp(28)}]}>继续作答</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[{width:'50%'},appStyle.flexCenter]} onPress={ this.props.onNextTopic}>
              <Text style={[{fontSize:pxToDp(28)}]}>下一题</Text>
            </TouchableOpacity>
          </View>:<View style={[appStyle.flexCenter]}>
              <TouchableOpacity onPress={ this.props.onClose}>
                <Text style={[{fontSize:pxToDp(28)}]}>关闭</Text>
              </TouchableOpacity>
            </View>}
         
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
});
