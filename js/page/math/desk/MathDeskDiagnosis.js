import {
  parseOneConnectionAnswer, validMultTopaic, parseAnswerFromMuchFillBlank,
  diagnosisOneGroupConnection, parseLeftRightTwoConnectAnswer
  , diagnosisLeftRightTwoConnectAnswer, exchangeThanSizeAnswer,
  diagnosisEstimateOralArithetic, diagnosisEquationCalculation,
  diagnosisVerticalCalculation, diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer,
  diagnosisEstimateApplication, diagnosisUpDownThreeConnect1Answer, diagnosisImgTextNumFillBlank,
  mathCompleteByPad, getStrImg, getStrImgSrcStr, diagnosisImgChufaVir, diagnosisImgChufaVirYushu
} from '../../../util/commonUtils'
import topaicTypes from '../../../res/data/MathTopaicType'
import { BasicProcessingFunc, MathProcessingFunc, MathBaseCaculateFunc } from '../../../util/diagnosis/pyramidhwr'


let diagnosisUtil = new MathProcessingFunc()
let mathUtil = new MathBaseCaculateFunc()
export function diagnosisByFront(currentTopaicData, data, resultData) {
  resultData.private_stem_picture = ''
  resultData.exercise_type = 1
  resultData.y_sort_idx = ''
  resultData.min_idx_angle = ''
  resultData.img_answer_str = ''
  resultData.combine_region_mat = ''
  resultData.standard_answer_str = ''
  if (currentTopaicData.private_exercise_stem) {
    if (getStrImg(currentTopaicData.private_exercise_stem)) {
      resultData.private_stem_picture = getStrImgSrcStr(currentTopaicData.private_exercise_stem)
    }
  }
  if (currentTopaicData.public_exercise_stem) {
    if (getStrImg(currentTopaicData.public_exercise_stem)) {
      resultData.private_stem_picture = getStrImgSrcStr(currentTopaicData.public_exercise_stem)
    }
  }

  switch (currentTopaicData.name) {
    case topaicTypes.Multipl_Choice_ABC:
      //console.log('Multipl_Choice_ABC')
      //选择题(A/B/C/D)
      return {
        value: currentTopaicData.answer_content == diagnosisUtil.MultiChoiceABCD(data)[10],
        correction: currentTopaicData.answer_content == diagnosisUtil.MultiChoiceABCD(data)[10] ? '0' : '1'
      }
    case topaicTypes.Multipl_Choice_123:
      //console.log('Multipl_Choice_123')
      //123选择题
      return {
        value: currentTopaicData.answer_content == diagnosisUtil.MathAllStrokesProcess(data)[1],
        correction: currentTopaicData.answer_content == diagnosisUtil.MathAllStrokesProcess(data)[1] ? '0' : '1'
      }
    case topaicTypes.Than_Size:
      //console.log('Than_Size')   
      //比大小题
      return {
        value: diagnosisUtil.MathAllStrokesProcess(data)[1] === exchangeThanSizeAnswer(currentTopaicData.answer_content),
        correction: diagnosisUtil.MathAllStrokesProcess(data)[1] === exchangeThanSizeAnswer(currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Text_One_Num_Fill_Blank:
      console.log('Text_One_Num_Fill_Blank',(+diagnosisUtil.MathNumCompletion(data)[1][0][0])) 
      //文字填空题-1个空数字
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(data)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return {
        value: (+diagnosisUtil.MathNumCompletion(data)[1][0][0]) === (+currentTopaicData.answer_content),
        correction: (+diagnosisUtil.MathNumCompletion(data)[1][0][0]) === (+currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Text_Much_Num_Fill_Blank:
      console.log('arrText_Much_Num_Fill_Blank',parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1]).flat().join('')) 
      console.log('answerArrTextResult',parseAnswerFromMuchFillBlank(currentTopaicData.answer_content))
      //文字填空题-多个空数字
      let arrText_Much_Num_Fill_Blank = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      let arrTextResult = arrText_Much_Num_Fill_Blank.flat().join('')
      let answerArrTextResult = parseAnswerFromMuchFillBlank(currentTopaicData.answer_content)
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(data)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return {
        value: arrTextResult === answerArrTextResult,
        correction: arrTextResult === answerArrTextResult ? '0' : '1'
      }
    case topaicTypes.Img_One_Num_Fill_Blank:
      console.log('Img_One_Num_Fill_Blank',(+diagnosisUtil.MathNumCompletion(data)[1][0][0]) ) 
      //图片填空题-1个空数字
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(data)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return {
        value: (+diagnosisUtil.MathNumCompletion(data)[1][0][0]) === (+currentTopaicData.answer_content),
        correction: (+diagnosisUtil.MathNumCompletion(data)[1][0][0]) === (+currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Img_Much_Num_Fill_Blank:
      //console.log('Img_Much_Num_Fill_Blank') 
      //图片填空题-多个空数字
      let arrImg_Much_Num_Fill_Blank = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      console.log('arrImg_Much_Num_Fill_Blank::::',arrImg_Much_Num_Fill_Blank)
      let arrImgResult = arrImg_Much_Num_Fill_Blank.flat().join('')
      console.log('arrImgResult::::',arrImgResult)
      let answerArrImgResult = parseAnswerFromMuchFillBlank(currentTopaicData.answer_content)
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(data)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return {
        value: arrImgResult === answerArrImgResult,
        correction: arrImgResult === answerArrImgResult ? '0' : '1'
      }
    case topaicTypes.Img_Text_Num_Fill_Blank:
      //图片填空题-数字汉字混合
      //    let resultBody = diagnosisImgTextNumFillBlank(diagnosisUtil.MixedCharRecognition(data)[1],currentTopaicData.answer_content)
      // //    this.errorInfo = resultBody.info
      //    return resultBody.result
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Img_Check:
      //图片勾选题 暂时无法诊断，直接判对
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Judegment:
      console.log('Judegment',diagnosisUtil.MathJudgementCompletion(data)) 
      //判断题
      let result = diagnosisUtil.MathJudgementCompletion(data)[0].join(',')
      // judgmentFilter(currentTopaicData.answer_content)
      return {
        value: judgmentFilter(currentTopaicData.answer_content) === result,
        correction: judgmentFilter(currentTopaicData.answer_content) === result ? '0' : '1'
      }
    case topaicTypes.Correct:
      //改错题   暂时无法诊断，直接判对
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.One_Group_Connect:
      //console.log('One_Group_Connect') 
      //一组连线题
      let arrOneGroopuConnectAnswer = parseOneConnectionAnswer(currentTopaicData.answer_content)
      resultData.y_sort_idx = diagnosisUtil.LineConnectionMode12(data, currentTopaicData.pixels)[1]
      resultData.min_idx_angle = diagnosisUtil.LineConnectionMode12(data, currentTopaicData.pixels)[2]
      resultData.img_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 2
      return {
        value: diagnosisOneGroupConnection(arrOneGroopuConnectAnswer, diagnosisUtil.LineConnectionMode12(data, currentTopaicData.pixels)[0]),
        correction: diagnosisOneGroupConnection(arrOneGroopuConnectAnswer, diagnosisUtil.LineConnectionMode12(data, currentTopaicData.pixels)[0]) ? '0' : '1'
      }


    case topaicTypes.Up_Down_Two_Much_Connect:
      //图片勾选题 暂时无法诊断，直接判对
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Left_Right_Two_Connect:
      //console.log('Left_Right_Two_Connect') 
      // console.log('diagnosisUtil.LineConnectionMode7(data)::::::',diagnosisUtil.LineConnectionMode8(data))
      parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content)
      return {
        value: diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(data)),
        correction: diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(data)) ? '0' : '1'
      }
    case topaicTypes.Left_Right_Three_Connect:
      //左右三组一对多连线题 暂时无法诊断
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Up_Down_Two_Connect:
      //"上下两组选择连线题" 
      parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content)
      return {
        value: diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(data)),
        correction: diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(data)) ? '0' : '1'
      }
    case topaicTypes.Oral_Arithmetic:
      //console.log('Oral_Arithmetic') 
      //口算题
      return {
        value: currentTopaicData.answer_content === diagnosisUtil.MathAllStrokesProcess(data)[1],
        correction: currentTopaicData.answer_content === diagnosisUtil.MathAllStrokesProcess(data)[1] ? '0' : '1'
      }
    case topaicTypes.Estimate_Oral_Arithetic:
      //console.log('Estimate_Oral_Arithetic') 
      //估算口算题
      return {
        value: diagnosisEstimateOralArithetic(diagnosisUtil.MathAllStrokesProcess(data)[1], currentTopaicData.answer_content),
        correction: diagnosisEstimateOralArithetic(diagnosisUtil.MathAllStrokesProcess(data)[1], currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Equation_Calculation:
      //console.log('Equation_Calculation') 
      //等式计算
      //  return diagnosisEquationCalculation(diagnosisUtil.MathVerticalCalculation(data),mathUtil.CaculateStepStr(this.assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value)))
      //  //console.log('Equation_Calculation::::::::',diagnosisUtil.MathMultiRowProcess(data)[0])
      //  //console.log('Equation_Calculation::::::::',assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value))
      //  //console.log('Equation_Calculation::::::::',mathUtil.splitstr(assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value)))

      //  //console.log('Equation_Calculation::::::::',diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info)
      //    this.errorInfo = diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info
      //    return diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).result
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Application_Questions:
      //应用题
      // console.log('Application_Questions::::::::',diagnosisUtil.MathMultiRowProcess(data)[0])
      // console.log('Application_Questions1111111::::::::',assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value))
      // console.log('Application_Questions2222222::::::::',mathUtil.splitstr(assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value)))

      // console.log('Application_Questions3333333::::::::',diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info)
      // this.errorInfo = diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info
      // resultData.exercise_type = 4
      // return diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).result
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Vertical_Calculation_Jiafa:
    case topaicTypes.Vertical_Calculation_Jianfa:
    case topaicTypes.Vertical_Calculation_Chengfa:
    case topaicTypes.Img_Chengfa:
      //竖式计算
      //console.log('diagnosisUtil.MathVerticalCalculation(data):::::',)
      return {
        value: diagnosisVerticalCalculation(diagnosisUtil.MathVerticalIntAdd(data)[1], currentTopaicData.answer_content),
        correction: diagnosisVerticalCalculation(diagnosisUtil.MathVerticalIntAdd(data)[1], currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Coversion_Unit_Application:
      resultData.exercise_type = 4
      //换算单位应用题 暂时无法诊断，默认判对
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Img_Much_Num_FIll_Blank_Much_Row_Carry:
      //图片填空题-多个空数字-多行-进位
      let arrImg_Much_Num_FIll_Blank_Much_Row_Carry = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      //console.log('arrImg_Much_Num_Fill_Blank::::',arrImg_Much_Num_FIll_Blank_Much_Row_Carry)
      let arrImgMuchNumFIllBlankMuchRowCarryResult = arrImg_Much_Num_FIll_Blank_Much_Row_Carry.flat().join('')
      //console.log('arrImgMuchNumFIllBlankMuchRowCarryResult::::',arrImgMuchNumFIllBlankMuchRowCarryResult)
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(data)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return {
        value: diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(arrImgMuchNumFIllBlankMuchRowCarryResult, currentTopaicData.answer_content),
        correction: diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(arrImgMuchNumFIllBlankMuchRowCarryResult, currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Estimate_Application:
      //估算应用题
      //  //console.log('Estimate_Application::::::::',diagnosisUtil.MathMultiRowProcess(data)[0])
      //  //console.log('Estimate_Application1111111::::::::',assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value))
      //  //console.log('Estimate_Application2222222::::::::',mathUtil.splitstr(assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value)))

      //  //console.log('Estimate_Application3333333::::::::',diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],this.assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info)
      //    this.errorInfo = diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).info
      //    resultData.exercise_type = 4
      //    return diagnosisEstimateApplication(diagnosisUtil.MathMultiRowProcess(data)[0],assembleMath(currentTopaicData.equation_exercise,currentTopaicData.variable_value),currentTopaicData.answer_content).result
      return {
        value: true,
        correction: '2'
      }
    case topaicTypes.Up_Down_Three_Connect1:
      //console.log('Up_Down_Three_Connect1::::::::',diagnosisUtil.LineConnectionMode10(data))

      return {
        value: diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(data), currentTopaicData.answer_content),
        correction: diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(data), currentTopaicData.answer_content) ? '0' : '1'
      }
    case topaicTypes.Img_Chufa_Vir_Yushu:
    case topaicTypes.Img_Chufa_Vir:
    case topaicTypes.Vertical_Calculation_Chufa:
    case topaicTypes.Vertical_Calculation_Chufa_Yushu:
      console.log('MathVerticalIntDiv',diagnosisUtil.MathVerticalIntDiv(data))
      return {
        value: diagnosisImgChufaVirYushu(diagnosisUtil.MathVerticalIntDiv(data), currentTopaicData.answer_content),
        correction: diagnosisImgChufaVirYushu(diagnosisUtil.MathVerticalIntDiv(data), currentTopaicData.answer_content) ? '0' : '1'
      }
    default:
      //目前没有识别的题目类型，默认正确
      //console.log('目前没有识别的题目类型，默认正确')
      return {
        value: true,
        correction: '2'
      }
  }
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
  if(!value)return
  if (value === 'x' || value === 'X' || value === '×') {
    return 'x'
  }
  return '√'
}