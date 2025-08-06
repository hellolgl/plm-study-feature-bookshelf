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

export async function  JudgeApplicationAnswer(currentTopaicData, data){
  // 转换标准分布===分数重写：最好的方式提取代数计算过程
  let list = Object.keys(currentTopaicData._alphabet_value)
  console.log('changeCurrentTopaic list',list)
  list.forEach((item)=>{
    currentTopaicData.answer_explanation=currentTopaicData.answer_explanation.replaceAll(item+'',currentTopaicData._alphabet_value[item])
  })
  let standardAlgebra = currentTopaicData.answer_explanation
  let user_str = data.replace(/\s/g,"")     // 新增
  console.log('=======standardAlgebra=============', standardAlgebra)
  console.log('=======user_str=============', user_str)
  let std_algebra_mat = standardAlgebra.split('\n')
  console.log('std_algebra_mat', std_algebra_mat)
  // 获取算式
  let equation_mat = []
  for (let ii=1;ii<std_algebra_mat.length-1;ii++){
      // 标准化
      std_algebra_mat[ii] = fileterAnswer(std_algebra_mat[ii])          
      if(ii<std_algebra_mat.length-2){
        // 处理过程等号
        let part_str = ''
        for(let jj=0;jj<std_algebra_mat[ii].length;jj++){
            // console.log(std_algebra_mat[ii][jj], std_algebra_mat[ii].charCodeAt(jj))
            if(std_algebra_mat[ii].charCodeAt(jj) <= 255 && ['='].indexOf(std_algebra_mat[ii][jj])<0){
                part_str += std_algebra_mat[ii][jj]
            }
        }
        equation_mat.push(part_str)
          // equation_mat.push(std_algebra_mat[ii])
      }
      else{
          // 处理带单位的
          let part_str = ''
          for(let jj=0;jj<std_algebra_mat[ii].length;jj++){
              // console.log(std_algebra_mat[ii][jj], std_algebra_mat[ii].charCodeAt(jj))
              if(std_algebra_mat[ii].charCodeAt(jj) <= 255 && ['=', '(', ')', '）', '（'].indexOf(std_algebra_mat[ii][jj])<0){
                  part_str += std_algebra_mat[ii][jj]
              }
          }
          equation_mat.push(part_str)
      }
  }
  console.log('equation_mat', equation_mat)
  // 提取标准答案数字
  let std_num_mat = []
  for (let ii=0;ii<equation_mat.length;ii++){
      let part_num_mat=equation_mat[ii].match(/\d+(\.\d+)?/g);  //提取数字
      std_num_mat.push(part_num_mat)
  }
  console.log('标准答案数字数据std_num_mat', std_num_mat)

  user_str = fileterAnswer(user_str)          // 标准化
  user_str = user_str.replace(/\s/g,"")       // 新增
  // console.log('user_str', user_str)
  let user_mat = user_str.split('=')
  console.log('user_mat', user_mat)

  // 提取用户答案数字
  let user_num_mat = []
  for (let ii=0;ii<user_mat.length;ii++){
      let part_num_mat=user_mat[ii].match(/\d+(\.\d+)?/g);  //提取数字
      user_num_mat.push(part_num_mat)
  }
  console.log('提取数字user_num_mat', user_num_mat)
  // 第一次判定： 提取计算过程答案：匹配自身答案、计算分步的相差数字个数：计算一步、两步
  let user_flag = true
  for (let ii=0;ii<user_mat.length-1;ii++){
      if(eval(user_mat[ii]) != eval(user_mat[ii+1])){
          user_flag = false
          break
      }
  }
  // 第二次判断
  if (user_flag == true){
      // 自身计算步骤相等
      console.log('=====判定1.过程相等=====')
      // 看每步的计算过程量变化过程
      for(let ii=0;ii<user_num_mat.length-1;ii++){
          // 相邻两步的数字差异个数
          let current_mat = user_num_mat[ii]
          let next_mat = user_num_mat[ii+1]
          // console.log('current_mat', current_mat)
          // console.log('user_num_mat', user_num_mat)
          if(current_mat.length>next_mat.length && (current_mat.length-next_mat.length)<2){
              // 相差一步
              let diff_num = 0
              for(let jj=0;jj<current_mat.length;jj++){
                  if(next_mat.indexOf(current_mat[jj])<0){
                      // 未找到，差异+1
                      diff_num += 1
                  }
              }
              // console.log('diff_num', diff_num)
              if (diff_num>2){
                  user_flag = false
                  break
              }
          }
      }
      // console.log('user_flag', user_flag, user_num_mat[user_num_mat.length-1].length)
      if(user_num_mat[user_num_mat.length-1].length!=1){
          // 最后一步不为单数字
          console.log('=====未得到最终结果=======')
          user_flag = false
      }
  }
  else{
    console.log('=====判定1.过程不等=====')
    return false
  }
  // console.log('二次判定结果：过程差异', user_flag)
  // 第三次判定：与标准计算结果比较
  if(user_flag == true){
    console.log('=====判定2.过程差异符合要求=====')
      if (eval(equation_mat[equation_mat.length-1]) == eval(user_mat[user_mat.length-1])){
          // console.log('====用户答案与标准计算结果相同=====')
          user_flag = true
      }
  }
  else{
    console.log('=====判定2.过程差异不符合要求=====')
    return false
  }
  // 第四次判定：第一步列式所用数字相同
  if(user_flag==true){
      // 判定用户的书写数据对比标准数据
      console.log('==========判定3.与题目标准答案相同========')
      let num_idx = []
      // 此处判定还为考虑一些默认量，如Π，
      for(let ii=0;ii<user_num_mat[0].length;ii++){
          let find_idx = std_num_mat[0].indexOf(user_num_mat[0][ii])      // 考虑去重，标准用两次？自身定义就有存在差异，代数指代不同数据
          if(find_idx>=0 &&num_idx.indexOf(find_idx)<0){
              // 未使用索引
              num_idx.push(find_idx)
          }
          // console.log('找到的索引', num_idx)
      }
      if(num_idx.length == std_num_mat[0].length){
          // 已知条件用完----多余
          user_flag=true
      }
      else{
        user_flag = false
      }
  }
  else{
    console.log('==========判定3.与题目标准答案不同========')
    return false
  }

  if(user_flag==true){
    console.log('===========判定4.最终答题情况已知条件用完======')
    return user_flag
  }
  else{
    console.log('===========判定4.最终答题情况已知条件未用完======')
    return false
  }
  
}