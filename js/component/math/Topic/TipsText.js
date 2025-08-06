import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";

class TipsText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderTipsText = ()=>{
    const {tipsArr} = this.props
    let htm =  tipsArr.map((i,index)=>{
    if(i.split(',').length === 1){
        return <Text style={[styles.yindaoText]}>{i}</Text>
    }
    if(i.split(',').length === 2){
        return <View>
        <Text style={[styles.yindaoText,styles.text1]}>{i.split(',')[0]}</Text>
        <Text style={[styles.yindaoText]}>{i.split(',')[1]}</Text>
        </View>
    }
    if(i.split(',').length === 3){
        return <View style={[appStyle.flexLine,appStyle.flexCenter]}>
                <Text style={[styles.yindaoText]}>{i.split(',')[0]}</Text>
            <View>
            <Text style={[styles.yindaoText,styles.text1]}>{i.split(',')[1]}</Text>
            <Text style={[styles.yindaoText]}>{i.split(',')[2]}</Text>
            </View>
        </View>
         
    }
    })
    return <View style={[appStyle.flexLine]}>{htm}</View>
  }
  render() {
    return (
      <>
          {this.renderTipsText()}
      </>
    );
  }
}

const styles = StyleSheet.create({
    yindaoText:{
        fontSize:pxToDp(32)
    },
    text1:{
        borderBottomWidth:1
    }
});
export default TipsText;
