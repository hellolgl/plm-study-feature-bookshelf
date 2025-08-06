import React, { PureComponent,Component } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import TipsText from './TipsText'
import TextView from '../FractionalRendering/TextView'

class YindaoAnswerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  // 防止多次无效render
  shouldComponentUpdate(nextProps) {
    let num1 = this.props.yinDaoNum
    let num2 = nextProps.yinDaoNum
    const isRender = num1 !== num2
    return isRender
}
  renderYindaoAnswerView = ()=>{
    const {currentTopaicData,yinDaoNum,yinDaoAnswerArr}  = this.props
      if(yinDaoNum<0)return null
      let variable_value_obj = {}
       if(currentTopaicData.variable_value){
        let _variable_value = JSON.parse(JSON.stringify(currentTopaicData.variable_value))
          _variable_value.forEach((item)=>{
          variable_value_obj[item.key] = item.value
        })
      }
      if(currentTopaicData.alphabet_value){
        let keyArr = Object.keys(currentTopaicData.alphabet_value)
        let alphabet_value = currentTopaicData.alphabet_value
        keyArr.forEach((i,index)=>{
          for(let j in variable_value_obj){
            variable_value_obj[j][0]= variable_value_obj[j][0].replaceAll(i+'',Array.isArray(alphabet_value[i])?'#'+alphabet_value[i][1]+'#':alphabet_value[i])
            variable_value_obj[j][2] = variable_value_obj[j][0].split('#')
          }
        })
      }
      let viewArr = []
      for(let i = 0 ;i<yinDaoNum;i++){
        let equation_distribution = currentTopaicData.equation_distribution[i]
        let key = equation_distribution.split('=')[1]
        if(currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'){
          viewArr.push(<View style={[appStyle.flexLine]} key={i}>
            <Text style={[styles.yindaoText]}>{(i+1)+'.'}</Text>
            <TipsText tipsArr = {variable_value_obj[key][2]}></TipsText>
            <Text>:</Text>
            <TextView value={yinDaoAnswerArr[i]}></TextView>
          </View>
          )
        }else{
          viewArr.push(<View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={i}>
            <Text style={[styles.yindaoText]}>{(i+1)+'.'}</Text>
            <TipsText tipsArr = {variable_value_obj[key][2]}></TipsText>
            <Text style={[styles.yindaoText]}>{':'+yinDaoAnswerArr[i]}</Text>
          </View>
          )
        } 
      }
      // console.log('3333333333333333333333333333333333',currentTopaicData.equation_distribution,yinDaoNum)
      let equation_distribution = currentTopaicData.equation_distribution[yinDaoNum]
      let key = equation_distribution.split('=')[1]
      viewArr.push(<View style={[appStyle.flexLine,appStyle.flexLineWrap]}>
        <Text style={[styles.yindaoText]}>{'第'+(yinDaoNum+1)+'步引导,'+'请根据左侧框图(显示不全可上下滑动)讲解作答:'}</Text>
        <TipsText tipsArr = {variable_value_obj[key][2]}></TipsText>
      </View>
      )
      return viewArr
  }
  render() {
    return (
      <>
          {this.renderYindaoAnswerView()}
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
export default YindaoAnswerView;
