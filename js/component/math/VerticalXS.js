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
import { appStyle } from "../../theme";
import { size_tool, pxToDp, padding_tool } from "../../util/tools";
import { VerticalCalculationFunc } from "../../util/VerticalCalculation";
import VerticalAdd from './VerticalAdd'
import VerticalReduce from './VerticalReduce'
import VerticalMultiplication from './VerticalMultiplication'
import VerticalDivision from './VerticalDivision'
let verticalClass = new VerticalCalculationFunc();

class VerticalXS extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        list:[],
        operator:'',
        position_arr_index:undefined,
        numData:''
    };
  }
  static getDerivedStateFromProps(props, state) {
    console.log('++++++++++++++++++++++++++',props.data,props.equation)
    let tempState = { ...state };
    let data =JSON.parse(JSON.stringify(props.data))  
    if(props.data.code !== 200) {
      if(props.data.code === 100){
        // 表示是整数的竖式
        let equation_arr =  props.equation.split(data.operator)
        let numData = {num1:equation_arr[0],num2:equation_arr[1]}
        tempState.operator = data.operator;
        tempState.numData = numData;
        return tempState
      }
      return null
    }
    let arr = [] 
    if(data.operator === "+" || data.operator === "-" ){
      for(let i in data.data){
        data.data[i].unshift('b')
        if(i === 'position_arr'){
          for(let j =0 ;j<data.data[i].length ; j++){
            if(!data.data[i][j] && data.data[i][j] !== null){
              tempState.position_arr_index = j
              break
            }
          }
        }
      }
    }
    if(data.operator === "+"){
      arr.push(data.data.first_arr)
      arr.push(data.data.second_arr)
      arr.push(data.data.position_arr)
      if(data.data.position_arr.indexOf(null) > -1){
         //最后一个进位要消掉
        let index = data.data.position_arr.indexOf(null) + 1 
        data.data.position_arr[index] = '' 
      }else{
        if(data.data.position_arr[1] === '1'){
          // data.data.position_arr[1] = ''
        }
      }
      arr.push(data.data.res)
      arr[1][0] = data.operator
    }
    if(data.operator === "-"){
      arr.push(data.data.position_arr)
      arr.push(data.data.first_arr)
      arr.push(data.data.second_arr)
      arr.push(data.data.res)
      arr[2][0] = data.operator
    }
    if(data.operator === "*"){
      arr.push(data.data.first_arr)
      arr.push(data.data.second_arr)
      arr = arr.concat(data.data.calculation_process)
      arr.push(data.data.res)
      arr.forEach((i)=>{
        i.unshift('b')
      })
      arr[1][0] = '×'
    }
    let divisionObj = {}
    if(data.operator === "/" || data.operator === "÷"){
      data.data.calculation_process.forEach((i)=>{
        arr = arr.concat(i)
      })
      divisionObj.calculation_process = arr
      divisionObj.res_arr = data.data.res_arr
      divisionObj.second_arr = [...data.data.second_arr,'丿']
    }
 
    let width = arr[0]?(arr[0].length) * pxToDp(30):0;
    tempState.list = arr;
    tempState.width = width;
    tempState.operator = data.operator;
    tempState.divisionObj = divisionObj;
    return tempState;
  }
  renderText = (item,indexj,index)=>{
    const {operator} = this.state
    if(item === 'b') return ''
    if(operator === '+') {
      if(index === 2 && item === '0') return '' 
    }
    if(operator === '-'){
      if(index === 0 && (item === '0' || item === '.') ) return '' 
      if(index === 0 && item === '1') return '.'
    }
   
    return item
  }
  renderDivisionLeft = (item,index)=>{
    const {divisionObj} = this.state
    if(item === 'x'){
      return <View style={[ styles.itemX]}>
        <Text style={[{fontSize:pxToDp(38)},styles.itemXText1]}>.</Text>
        <Text style={[{fontSize:pxToDp(24),color:'red'},styles.itemXText2]}>\</Text>
      </View>
    }
    return  <Text style={[{fontSize:pxToDp(38),width: pxToDp(28),textAlign:'center',height:pxToDp(48)},index === divisionObj.second_arr.length-1?{fontSize:pxToDp(48),width:pxToDp(36),height:pxToDp(56)}:{position:'relative',top:pxToDp(8)}]}>{item}</Text>
  }
  renderDivisionRight = (item,indexj,index)=>{
    if(item === 'x'){
      return <View style={[ styles.itemX]}>
        <Text style={[styles.itemXText1,{fontSize:pxToDp(38),top:pxToDp(0)}]}>.</Text>
        <Text style={[styles.itemXText2,{fontSize:pxToDp(24),color:'red',top:(12)}]}>\</Text>
      </View>
    }
    return <Text style={[{fontSize:pxToDp(38),width:pxToDp(28),textAlign:'center',height:pxToDp(48)}]}>{this.renderText(item,indexj,index)}</Text>
  }
  renderContent = ()=>{
    const {operator,list,position_arr_index,divisionObj} = this.state
    // console.log('===============',divisionObj)
    let htm = null
    if(operator === '+'){
      // <Text style={[{fontSize:pxToDp(38),textAlign:'center'},(j !== '.' && j) || j === null?{width:pxToDp(40)}:{width:pxToDp(10)},index === 0?styles.text2J:null]}>{this.renderText(j,indexj,index)}</Text>
      htm = list.map((item,index)=>{
        return <View style={[appStyle.flexLine,index === 1?styles.haveBottomBorder:null,index===2?styles.wrap2:null]}>
            {item.map((j,indexj)=>{
                return <Text style={[{fontSize:pxToDp(38),width: pxToDp(28),textAlign:'center',height:index === 2?"auto":pxToDp(48)},index === 2?styles.text2:null,index === 2 && indexj ===position_arr_index -1 ?{position:'relative',left:pxToDp(0)}:null]}>{this.renderText(j,indexj,index)}</Text>
            })}
        </View>
      })
    }
    if(operator === '-'){
      htm = list.map((item,index)=>{
        return <View style={[appStyle.flexLine,index === 2?styles.haveBottomBorder:null,index===2?styles.wrap2J:null]}>
            {item.map((j,indexj)=>{
                return <Text style={[{fontSize:pxToDp(38),textAlign:'center',width:pxToDp(28),height:pxToDp(48)},index === 0?styles.text2J:null]}>{this.renderText(j,indexj,index)}</Text>
            })}
        </View>
      })
    }
    if(operator === '*'){
      htm = list.map((item,index)=>{
        return <View style={[appStyle.flexLine,index === 1 || index === list.length-2?styles.haveBottomBorder:null]}>
            {item.map((j,indexj)=>{
                return <Text style={[{fontSize:pxToDp(38),textAlign:'center',width:pxToDp(28),height:pxToDp(48)}]}>{this.renderText(j,indexj,index)}</Text>
            })}
        </View>
      })
    }
    if(operator === '/' || operator === '÷'){
      htm = <View style={[appStyle.flexTopLine,appStyle.flexAliStart]}>
        <View style={[appStyle.flexLine,styles.left]}>
            {divisionObj.second_arr.map((item,index)=>{
              return this.renderDivisionLeft(item,index)
            })}
        </View>
        <View>
          <View style={[appStyle.flexLine]}>
            {divisionObj.res_arr.map((item,index)=>{
              return <Text style={[{fontSize:pxToDp(38),width:pxToDp(28),textAlign:'center',height:pxToDp(48)}]}>{item}</Text>
            })}
          </View>
          {divisionObj.calculation_process.map((item,index)=>{
            return <View style={[appStyle.flexLine,index%2 === 0 || index === divisionObj.calculation_process.length - 1?styles.haveTopBorder:null]}>
                  {item.map((j,indexj)=>{
                    return this.renderDivisionRight(j,indexj,index)
                  // return <Text style={[{fontSize:pxToDp(38),width:pxToDp(28),textAlign:'center',height:pxToDp(48)}]}>{this.renderText(j,indexj,index)}</Text>
                })}
            </View>
          })}
        </View>
      </View>

    }
    return htm
  }
  renderContentZs  =()=>{
    const {numData,operator} = this.state;
    switch (operator) {
      case '+':
        return <VerticalAdd numData={numData}></VerticalAdd>
      case '-':
        return <VerticalReduce numData={numData}></VerticalReduce>
      case "×":
        return <VerticalMultiplication numData={numData}></VerticalMultiplication>
        case "÷":
      return <VerticalDivision numData={numData}></VerticalDivision>
    }
  }
  render() {
    const { list ,width,numData} = this.state;
    console.log('===========================',list)
    return (
      <View style={[{width}]}>
        {numData?this.renderContentZs():this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    haveBottomBorder:{
        borderBottomWidth:pxToDp(3),
        paddingBottom:pxToDp(8)
    },
    text2:{
      fontSize:pxToDp(18),
      fontWeight:'bold',
    },
    text2J:{
      fontSize:pxToDp(32),
      fontWeight:'bold',
      marginBottom:pxToDp(-14),
      marginTop:pxToDp(-30)
    },
    wrap2:{
      marginTop:pxToDp(-26),
      marginLeft:pxToDp(12)
    },
    haveTopBorder:{
      borderTopWidth:pxToDp(3)
    },
    left:{
      position:"relative",
      // backgroundColor:"red",
      top:pxToDp(37),
      left:pxToDp(9)
    },
    itemX:{
      width:pxToDp(28),
      height:pxToDp(48),
      position:'relative'
    },
    itemXText1:{
      position:"absolute",
      left:pxToDp(14),
      bottom:pxToDp(-10),
      zIndex:1
    },
    itemXText2:{
      position:"absolute",
      left:pxToDp(13),
      bottom:pxToDp(-10),
      
    }
});
export default VerticalXS;
