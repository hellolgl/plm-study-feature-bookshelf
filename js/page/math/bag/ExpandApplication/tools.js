
import * as actionCreators from "../../../../action/math/bag/index";
import topaicTypes from '../../../../res/data/MathTopaicType'

export function changeTopicData(value){
  if(!value || value.length ===0) return {}
  value.exercise_thinking = value.problem_solving
  value.exercise_data_type === 'FS'?value.isFraction = true:value.isFraction = false
  if(value.topic_type === '1'){
    // 活题
    let keyArr = Object.keys(value.alphabet_value)
    value.answer_content_beforeChange = value.answer_content
    value = actionCreators.fileterAutoItem(keyArr,value,value.alphabet_value)
    value._answer_content = value.answer_content
    if(value.equation_type === '1') value.solve.indexOf ('框图')>-1 || value.solve === '综合法'?value.isYinDao = true:null  //value.equation_type 等式必须是标准等式
    
  }else{
    value.name = value.type_name
    if(value.choice_txt){
      let unitArr = value.choice_txt.split('#').map((item)=>{
        return {value:item,key:item}
      })
      value.unitArr = actionCreators.shuffle(unitArr)
    }
    value = actionCreators.fileterItem(value)
    value.answer_content = value.answer_explanation
    value._answer_content = value.answer_explanation
    !value.knowledgepoint_explanation && value.understand ?value.exercise_explanation = value.understand:value.exercise_explanation = value.knowledgepoint_explanation
  }
  value.answer_type = '5'   //表示是拓展应用
  console.log('-------------------------------',value)
  return value
}