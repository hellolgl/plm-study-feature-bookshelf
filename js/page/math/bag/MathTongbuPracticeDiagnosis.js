import {
  parseOneConnectionAnswer, validMultTopaic, parseAnswerFromMuchFillBlank,
  diagnosisOneGroupConnection, parseLeftRightTwoConnectAnswer
  , diagnosisLeftRightTwoConnectAnswer, exchangeThanSizeAnswer,
  diagnosisEstimateOralArithetic, diagnosisEquationCalculation,
  diagnosisVerticalCalculation, diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer,
  diagnosisEstimateApplication, diagnosisUpDownThreeConnect1Answer, diagnosisImgTextNumFillBlank,
  mathCompleteByPad, getStrImg, getStrImgSrcStr
} from '../../../util/commonUtils'
import topaicTypes from '../../../res/data/MathTopaicType'
import { BasicProcessingFunc, MathProcessingFunc, MathBaseCaculateFunc } from '../../../util/diagnosis/pyramidhwr'


let diagnosisUtil = new MathProcessingFunc()
let mathUtil = new MathBaseCaculateFunc()
export function diagnosisByFront(currentTopaicData, data) {
  //console.log('Application_Questions::::::::',diagnosisUtil.MathMultiRowProcess(data))
  //console.log('Application_Questions1111111::::::::',assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value))
  //console.log('Application_Questions2222222::::::::',mathUtil.splitstr(assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value)))
  //console.log('Application_Questions00000::::::::',currentTopaicData)

  // console.log('Application_Questions3333333::::::::',diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info)
  // this.errorInfo = diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info
  // return diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).result 
  return diagnosisUtil.MathMultiRowProcess(data)[1].join('')
}

//一个列式情况下诊断
export async function  judgeByFront(currentTopaicData, data) {
  let answer = currentTopaicData.answer_content
  console.log('judgeByFront data',data.split('\n')) 
  let promise = new Promise((resolve,reject)=>{
   let dataArr = data.split('\n')
   resolve(dataArr)

  }).then((dataArr)=>{
    return new Promise((resolve)=>{
      let result = true
      let tempResult = true
      console.log('judgeByFront answer',answer)
      let tempValue = ''
      let finalValue = ''
      for(let i =0;i<dataArr.length;i++){
        console.log('judgeByFront item',dataArr[i])
        console.log('judgeByFront item.indexOf()',dataArr[i].indexOf('='))
        if(-1 != dataArr[i].indexOf('=') ){
          let temp = dataArr[i].split('=')
          console.log('judgeByFront temp',temp)
          temp[1] = filterFinalBrackets(temp[1])
          finalValue = eval(temp[1])
          //包含等号
          if(temp[0] != ''){
            console.log('judgeByFront eval(temp[0]) ',eval(temp[0]))
            console.log('judgeByFront eval(temp[1]) ',eval(temp[1]))
              if(eval(temp[0]) != eval(temp[1])){
                tempResult = false
                break
              }
          }else{
            console.log('finalValue1',finalValue)
            console.log('tempValue1',tempValue)
            tempValue === finalValue ? tempResult = true:tempResult = false
            if(!tempResult)break
          }
        }else{
          tempValue = eval(dataArr[i])
          console.log('tempValue0',tempValue)
        }
      }
      console.log('finalValue',finalValue)
      console.log('eval(finalValue)',eval(finalValue))
      console.log('eval(answer)',eval(answer))
      if(eval(finalValue) != eval(answer)){
        result = false
      }

      console.log('resolve result',result&&tempResult)
      resolve(result&&tempResult)

    })
    
  })
  let rl = await promise
  console.log('rl',rl)
 
  return rl
}


//组装数学表达式
export function assembleMath(equation_exercise, variable_value, id) {
  let ee = (equation_exercise + '').split('');
  // console.log('ee::::::',ee)
  let vv = (variable_value + '').split(';');
  // console.log('vv::::::',vv)
  const vvMap = new Map();
  vv.forEach((val) => {
    let temp = val.replace(/[^0-9]/ig, "");
    val.split('');
    vvMap.set(val[0], temp);
  })
  ee = ee.map((val) => {
    if (vvMap.get(val)) {
      val = vvMap.get(val)
    }
    return val;
  })
  return ee.join('');
}


//解析多个空填空题答题数据
function parseMuchFillBlank(data) {
  if (!data) return
  let resultArr = []
  data.forEach((item) => {
    item.forEach((value) => {
      resultArr.push(value)
    })
  })

  return resultArr
}

function judgmentFilter(value) {
  if (value === 'x' || value === 'X') {
    return 0
  }
  return 1
}

export function fileterAnswer(value){
  console.log('fileterAnswer',value)
  let reg=/[\u4e00-\u9fa5]/g; 
  let temp = value.replace(reg,'')
  console.log('fileterAnswer temp',temp)
  let result = temp.replaceAll(':','').replaceAll('：','').replaceAll('÷', "/").replaceAll('＋','+')
  .replaceAll('－','-').replaceAll('x', "*").replaceAll('✖️', "*").replaceAll('X', "*").replaceAll('×', "*")
  .replaceAll('＝','=').replaceAll('\uff08','(').replaceAll('\uff09',')')
  console.log('fileterAnswer result',result)
  return result
} 

//过滤掉计算表达式中，最后的空括号
function filterFinalBrackets(value){
    let length = value.length
    if(value.indexOf('(') === length -2 && value.indexOf(')') === length -1){
      let result = value.substring(0,length -1).substring(0,length-2)
      console.log('filterFinalBrackets',result)
      return result
    }
    return value
}