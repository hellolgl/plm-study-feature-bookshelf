
import * as actionCreators from "../../../../../action/math/bag/index";
import topaicTypes from '../../../../../res/data/MathTopaicType'

export function changeTopicData(value){
  if(Object.keys(value).length === 1) return {}
  value.isComprehensive = true //和拓展应用题共用错题答题界面，用来判断调保存错题重做接口
  if(value.answer_type === '6'){
    // 同步诊断(死题)
    if(value.exercise_data_type === 'FS'){
      value.isFraction = true 
      value.answer_content?value.answer_content = JSON.parse(value.answer_content):null
      value.equation_exercise?value.equation_exercise = JSON.parse(value.equation_exercise):null
      value.knowledgepoint_explanation?value.knowledgepoint_explanation = JSON.parse(value.knowledgepoint_explanation):null
      value.problem_solving?value.problem_solving = JSON.parse(value.problem_solving):null
      value.public_exercise_stem?value.public_exercise_stem = JSON.parse(value.public_exercise_stem):null
    }
    value._answer_content = value.answer_content
    if(value.choice_txt){
      let unitArr = value.choice_txt.split('#').map((item)=>{
        return {value:item,key:item}
      })
      value.unitArr = actionCreators.shuffle(unitArr)
    }
    value.equation_list = value.equation_exercise   //诊断用
  }
  if(value.answer_type === '4'){
    // 同步应用(活题+死题)
    if(value.exercise_data_type === 'FS') value.isFraction = true 
    if(value.topic_type === '1'){
      // 活题
      value.answer_content_beforeChange = JSON.parse(JSON.stringify(value)).answer_content
      let keyList = Object.keys(value.alphabet_value)
      value = fileterAutoItem(keyList,value,value.alphabet_value)
      value.unitArr = actionCreators.getUnitArr(value.variable_value)
      if(value.equation_type === '1') value.solve.indexOf ('框图')>-1 || value.solve === '综合法'?value.isYinDao = true:null  //value.equation_type 等式必须是标准等式
    } else{
      if(value.choice_txt){
        let unitArr = value.choice_txt.split('#').map((item)=>{
          return {value:item,key:item}
        })
        value.unitArr = actionCreators.shuffle(unitArr)
      }
      if(value.exercise_data_type === 'FS'){
        // 死题分数
        // 暂时没刷到题
      }else{
        value.equation_list = value.equation_exercise   //诊断用
      }
      
    }
  }
  if(value.answer_type === '5'){
    // 拓展应用(活题+死题)
    if(value.exercise_data_type === 'FS') value.isFraction = true 
    if(value.topic_type === '1'){
      // 活题
      value.answer_content_beforeChange = JSON.parse(JSON.stringify(value)).answer_content
      let keyList = Object.keys(value.alphabet_value)
      value = fileterAutoItem(keyList,value,value.alphabet_value)
      value.unitArr = actionCreators.getUnitArr(value.variable_value)
      if(value.equation_type === '1') value.solve.indexOf ('框图')>-1 || value.solve === '综合法'?value.isYinDao = true:null  //value.equation_type 等式必须是标准等式
    } else{
      if(value.exercise_data_type === 'FS'){
        value.answer_explanation?value.answer_explanation = JSON.parse(value.answer_explanation):null
        value.exercise_stem?value.exercise_stem = JSON.parse(value.exercise_stem):null
        value.problem_solving?value.problem_solving = JSON.parse(value.problem_solving):null
        value.understand?value.understand = JSON.parse(value.understand):null
        value.method?value.method = JSON.parse(value.method):null
        value.correct_answer?value.correct_answer = JSON.parse(value.correct_answer):null
        value.equation_list?value.equation_list = JSON.parse(value.equation_list):null
        !value.knowledgepoint_explanation && value.understand ?value.exercise_explanation = value.understand:value.exercise_explanation = value.knowledgepoint_explanation
      }
      if(value.choice_txt){
        let unitArr = value.choice_txt.split('#').map((item)=>{
          return {value:item,key:item}
        })
        value.unitArr = actionCreators.shuffle(unitArr)
      }
      value._answer_content = value.answer_explanation
    }
  }
  return value
}

const fileterAutoItem = (keyList,value,alphabetValue)=>{
  if(value.exercise_data_type === 'FS'){
    value.private_exercise_stem?value.private_exercise_stem = actionCreators.fractionVariableTrans(value.private_exercise_stem.split('\n'),keyList,alphabetValue):null
    value.problem_solving?value.problem_solving = actionCreators.fractionVariableTrans(value.problem_solving.split('\n'),keyList,alphabetValue):null
    value.understand?value.understand = actionCreators.fractionVariableTrans(value.understand.split('\n'),keyList,alphabetValue):null
    value.method ?value.method = actionCreators.fractionVariableTrans(value.method.split('\n'),keyList,alphabetValue):null
    value.answer_explanation? value.answer_explanation= actionCreators.fractionVariableTrans(value.answer_explanation.split('\n'),keyList,alphabetValue):null
  }else{
    keyList.forEach((item,index)=>{
      if(value.answer_content) {
        if(value.answer_content[0] === item && Array.isArray(alphabetValue[item])){
          // 整数外的类型（比如小数，百分数）
          value.answer_content = value.alphabet_value[item][1][0]
        }else{
          value.answer_content=value.answer_content.replaceAll(item+'',alphabetValue[item])
        }
      } 
      value._answer_content = value.answer_content
      value.problem_solving?value.problem_solving=value.problem_solving.replaceAll(item+'',Array.isArray(alphabetValue[item])?alphabetValue[item][1]:alphabetValue[item]):null
      value.private_exercise_stem?value.private_exercise_stem=value.private_exercise_stem.replaceAll(item+'',Array.isArray(alphabetValue[item])?alphabetValue[item][1]:alphabetValue[item]):null
      value.method?value.method = value.method.replaceAll(item+'',Array.isArray(alphabetValue[item])?alphabetValue[item][1]:alphabetValue[item]):null
      value.answer_explanation?value.answer_explanation=value.answer_explanation.replaceAll(item+'',Array.isArray(alphabetValue[item])?alphabetValue[item][1]:alphabetValue[item]):null
    })
  }
  return value
}