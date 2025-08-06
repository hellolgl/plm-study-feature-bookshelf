import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import VerticalAdd from '../VerticalAdd'
import VerticalReduce from '../VerticalReduce'
import VerticalMultiplication from '../VerticalMultiplication'
import VerticalDivision from '../VerticalDivision'
import topaicTypes from '../../../res/data/MathTopaicType'
import RichShowView from '../RichShowView'
import TextView from '../FractionalRendering/TextView'
import { SpecialExplainFunc } from "../../../util/VerticalCalculation";
import {EquationClassify} from '../../../util/decimal_vertical.min'
import VerticalXS from '../../../component/math/VerticalXS'

let specialClass = new SpecialExplainFunc()

class Explanation3 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderVertical = ()=>{
    const { currentTopaicData } = this.props
    
    let arr = []
    if(currentTopaicData.triadic_relation && Array.isArray(currentTopaicData.triadic_relation)){
      currentTopaicData.triadic_relation.forEach((i,index)=>{
        if(index > 0 && i.length === 5){
          let str = i.substring(0,3)
          let type = i[1]
          let dataArr = str.split(type)
          let num1 = typeof currentTopaicData.alphabet_value[dataArr[0]] === 'string'?currentTopaicData.alphabet_value[dataArr[0]]:currentTopaicData.alphabet_value[dataArr[0]].toFixed(0)
          let num2 = typeof currentTopaicData.alphabet_value[dataArr[1]] === 'string'?currentTopaicData.alphabet_value[dataArr[1]]:currentTopaicData.alphabet_value[dataArr[1]].toFixed(0)
          let numData = {num1,num2}
          arr.push({type,numData})
        }
      })
    }
    let htm = arr.map((i,index)=>{
      switch (i.type) {
      case '+':
        return <View style={{marginRight:pxToDp(40)}}>
          {arr.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
        <VerticalAdd numData={i.numData}></VerticalAdd>
          </View>
      case '-':
        return <View style={{marginRight:pxToDp(40)}}>
           {arr.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
          <VerticalReduce numData={i.numData}></VerticalReduce>
          </View>
      case "×":
        return <View style={{marginRight:pxToDp(40)}}>
           {arr.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
          <VerticalMultiplication numData={i.numData}></VerticalMultiplication>
          </View>
        case "÷":
          return <View style={{marginRight:pxToDp(40)}}>
            {arr.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
            <VerticalDivision numData={i.numData}></VerticalDivision>
            </View>
      }
    })
    let arr1 = []
    let htm_ = null
    if(currentTopaicData.name === topaicTypes.Than_Size){
    // console.log('currentTopaicDatacurrentTopaicDatacurrentTopaicData',currentTopaicData)

      currentTopaicData.triadic_relation_.forEach((i,index)=>{
        if(index > 0 && i.length === 5){
          let str = i.substring(0,3)
          let type = i[1]
          let dataArr = str.split(type)
          let numData = {num1:currentTopaicData.alphabet_value_[dataArr[0]].toFixed(0),num2:currentTopaicData.alphabet_value_[dataArr[1]].toFixed(0)}
          arr1.push({type,numData})
        }
      })
      htm_ = arr1.map((i,index)=>{
        switch (i.type) {
        case '+':
          return <View style={{marginRight:pxToDp(40)}}>
            {arr1.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
            <VerticalAdd numData={i.numData}></VerticalAdd>
            </View>
        case '-':
          return <View style={{marginRight:pxToDp(40)}}>
            {arr1.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
            <VerticalReduce numData={i.numData}></VerticalReduce>
            </View>
        case "×":
          return <View style={{marginRight:pxToDp(40)}}>
            {arr1.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
            <VerticalMultiplication numData={i.numData}></VerticalMultiplication>
            </View>
          case "÷":
            return <View style={{marginRight:pxToDp(40)}}>
              {arr1.length<=1?null:<Text style={{fontSize: pxToDp(38)}}>第{index+1}步：{i.numData.num1}{i.type}{i.numData.num2}</Text>}
              <VerticalDivision numData={i.numData}></VerticalDivision>
              </View>
        }
      })
    }
    return <View>
      {currentTopaicData.name === topaicTypes.Than_Size?<Text style={{fontSize: pxToDp(38)}}>左边式子</Text>:null}
      <View style={[appStyle.flexTopLine,appStyle.flexLineWrap]}>
        {htm}
      </View>
      {currentTopaicData.name === topaicTypes.Than_Size?<Text style={{fontSize: pxToDp(38)}}>右边式子</Text>:null}
      {htm_?<View style={[appStyle.flexTopLine,appStyle.flexLineWrap]}>
        {htm_}
      </View>:null}
    </View>
  }
  renderContent = ()=>{
    const {currentTopaicData} = this.props
    let alphabet_value = currentTopaicData.alphabet_value
    if(currentTopaicData.explanation.includes('竖式')){
      let keyArr = Object.keys(alphabet_value)
      let show = true
      if(currentTopaicData.exercise_data_type === "XS" || currentTopaicData.exercise_data_type === "FS" || currentTopaicData.data_type === "FS" || currentTopaicData.data_type === "XS" || Array.isArray(alphabet_value[keyArr[0]])) show = false
      return  show?this.renderVertical():null
    }
    if(currentTopaicData.explanation.includes('整百数乘一位数的口算') || currentTopaicData.explanation.includes('两位数乘一位数的口算') 
    || currentTopaicData.explanation.includes('几千几百数除以一位数的口算') || currentTopaicData.explanation.includes('两位数除以一位数的口算') 
    || currentTopaicData.explanation.includes('整千数除以一位数的口算')){
      
      if(!currentTopaicData.equation_name) currentTopaicData.equation_name = currentTopaicData.triadic_relation[0]
      let equation_name_arr = currentTopaicData.equation_name.split('')
      equation_name_arr.forEach((i,index)=>{
      alphabet_value[i]?equation_name_arr[index] =  alphabet_value[i].toFixed(0):null
    })
    // console.log('222222222222222222222222222222',specialClass.EquationClassify(equation_name_arr))
    return <Text style={{fontSize:pxToDp(36)}}>{specialClass.EquationClassify(equation_name_arr)?specialClass.EquationClassify(equation_name_arr):null}</Text>
    }
    return null
  }

  renderontent = (currentTopaicData)=>{
    // 拓展计算题
    if(currentTopaicData.is_s === 's'){
      // 死题标识
      return <>
      <View style={[appStyle.flexLine]}>
        <Text style={{fontSize:pxToDp(36)}}>题干：</Text>
        <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1850)} value = {currentTopaicData.public_exercise_stem}>
      </RichShowView>
      </View>
        <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1850)} value = {currentTopaicData.answer_explanation}>
      </RichShowView>
      </> 
    }
    return<View>
      <View  style={[appStyle.flexAliStart]}>
        {currentTopaicData.answer_explanation}
      </View>
      {currentTopaicData.public_exercise_image?<View>
          {standard_mat[0]['question_graph']}
      </View>:null}
    </View>
  }
    renderXs = ()=>{
      const {currentTopaicData} = this.props
      let arr = []
      if(currentTopaicData.triadic_relation && Array.isArray(currentTopaicData.triadic_relation)){
        currentTopaicData.triadic_relation.forEach((i,index)=>{
          if(index > 0 && i.length === 5){
            let str = i.substring(0,3)
            let dataArr = str.split('')
            dataArr[0] =currentTopaicData.alphabet_value[dataArr[0]][1][0]
            dataArr[2] =currentTopaicData.alphabet_value[dataArr[2]][1][0]
            arr.push(dataArr.join(''))
          }
        })
      }
      console.log('************',arr)
      let htm = arr.map((item,index)=>{
        let str = item.replaceAll('×','*')
          let b = new EquationClassify(str)
          let data = b.main()
          return  <View style={{marginRight:pxToDp(48),marginBottom:pxToDp(10)}}>
            <Text style={{fontSize: pxToDp(38),marginBottom:pxToDp(16)}}>第{index+1}步：{item}</Text>
            <VerticalXS data={data} equation={str}></VerticalXS>
          </View>
      })
      return <View style={[appStyle.flexTopLine,appStyle.flexLineWrap]}>
        {htm}
      </View>


      // let b = new EquationClassify('3.98+0.18')
      // // let b = new EquationClassify('12.15-1.99')
      // // let b = new EquationClassify('2.3*1.7')
      // // let b = new EquationClassify('8.2÷0.8')
      // // let b = new EquationClassify(arr[1])
      // let data = b.main()
      // return <VerticalXS data={data}></VerticalXS>
    }

  render() {
    const {currentTopaicData} = this.props
    if(Object.keys(currentTopaicData).length === 0) return null
    return (
      <>
          <View style={[appStyle.flexLine]}>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<View style={[appStyle.flexLine]}>
              <Text style={{fontSize:pxToDp(36)}}>题干：</Text>
              {currentTopaicData.name === topaicTypes.Than_Size?<View style={[appStyle.flexLine]}>
                <Text> <TextView value = {currentTopaicData.exercise_stem}></TextView></Text>
                <Text style={[{fontSize:pxToDp(36)}]}> 〇 </Text>
                <Text><TextView value = {currentTopaicData.exercise_stem_}></TextView></Text>
              </View>: <TextView value = {currentTopaicData.exercise_stem}></TextView>}
            </View>: currentTopaicData.name === topaicTypes.Than_Size? <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1700)} value = {currentTopaicData.exercise_stem_change?'题干:'+currentTopaicData.exercise_stem_change:''}>
            </RichShowView>:<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={pxToDp(1700)} value = {currentTopaicData.exercise_stem?'题干:'+currentTopaicData.exercise_stem:''}>
            </RichShowView>}
          </View>
          <View style={[appStyle.flexLine]}>
            <Text style={{fontSize:pxToDp(36)}}>答案：</Text>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<TextView value = {[[currentTopaicData.answer_content]]}></TextView>:<Text style={{fontSize:pxToDp(36)}}>{currentTopaicData.answer_content}</Text>}           
          </View>
          {currentTopaicData.exercise_data_type === 'XS' || currentTopaicData.data_type === 'XS'?this.renderXs():null}
          {currentTopaicData.name === topaicTypes.Extended_Calculation_Problem?this.renderontent(currentTopaicData):currentTopaicData.explanation?this.renderContent():null}
      </>
    );
  }
}

const styles = StyleSheet.create({
});
export default Explanation3;
