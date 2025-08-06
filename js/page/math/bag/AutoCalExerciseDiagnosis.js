import {
  parseOneConnectionAnswer, validMultTopaic, parseAnswerFromMuchFillBlank,
  diagnosisOneGroupConnection, parseLeftRightTwoConnectAnswer
  , diagnosisLeftRightTwoConnectAnswer, exchangeThanSizeAnswer,
  diagnosisEstimateOralArithetic, diagnosisEquationCalculation,
  diagnosisVerticalCalculation, diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer,
  diagnosisEstimateApplication, diagnosisUpDownThreeConnect1Answer, diagnosisImgTextNumFillBlank,
  mathCompleteByPad, getStrImg, getStrImgSrcStr, diagnosisImgChufaVir, diagnosisImgChufaVirYushu,diagnosisImgChufaVirYushuNew,
  parseAnswerFromMuchFillBlankSchoolBag,parseAnswerFromMuchFillBlankNums
} from '../../../util/commonUtils'
import topaicTypes from '../../../res/data/MathTopaicType'
import { BasicProcessingFunc, MathProcessingFunc, MathBaseCaculateFunc } from '../../../util/diagnosis/pyramidhwr'


let diagnosisUtil = new MathProcessingFunc()
let mathUtil = new MathBaseCaculateFunc()
export function diagnosisByFront(currentTopaicData, data, resultData) {
  
  switch (currentTopaicData.name) {
    case topaicTypes.Multipl_Choice_ABC:
      //选择题(A/B/C/D)
      return diagnosisUtil.MultiChoiceABCD(data)[10][0]
    case topaicTypes.Multipl_Choice_123:
      //123选择题
      return diagnosisUtil.MathAllStrokesProcess(data)[1]
    case topaicTypes.Than_Size:
      //比大小题
      return diagnosisUtil.MathAllStrokesProcess(data)[1]
    case topaicTypes.Text_One_Num_Fill_Blank:
      //文字填空题-1个空数字
      return (+diagnosisUtil.MathNumCompletion(data)[1][0][0])
    case topaicTypes.Text_Much_Num_Fill_Blank:
      let arrText_Much_Num_Fill_Blank = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      let arrTextResult = arrText_Much_Num_Fill_Blank.flat().join(' ')
      //文字填空题-多个空数字
      return arrTextResult
    case topaicTypes.Img_One_Num_Fill_Blank:
      //图片填空题-1个空数字
      return (+diagnosisUtil.MathNumCompletion(data)[1][0][0])
    case topaicTypes.Img_Much_Num_Fill_Blank:
      //图片填空题-多个空数字
      let arrImg_Much_Num_Fill_Blank = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      let arrImgResult = arrImg_Much_Num_Fill_Blank.flat().join(' ')
      return arrImgResult
    case topaicTypes.Img_Text_Num_Fill_Blank:
      //图片填空题-数字汉字混合
      let arrImg_Much_Num_Fill_Blank1 = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      let arrImgResult1 = arrImg_Much_Num_Fill_Blank1.flat().join(' ')
      return arrImgResult1
    case topaicTypes.Img_Check:
      //图片勾选题 暂时无法诊断，直接判对
      return ''
    case topaicTypes.Judegment:
      console.log('Judegment',diagnosisUtil.MathJudgementCompletion(data)) 
      //判断题
      let result = diagnosisUtil.MathJudgementCompletion(data)[0].join(',')
      return result
    case topaicTypes.Correct:
      //改错题   暂时无法诊断，直接判对
      return ''
    case topaicTypes.One_Group_Connect:
      //一组连线题
      return ''
    case topaicTypes.Up_Down_Two_Much_Connect:
      //图片勾选题 暂时无法诊断，直接判对
      return ''
    case topaicTypes.Left_Right_Two_Connect:
      //console.log('Left_Right_Two_Connect') 
      return ''
    case topaicTypes.Left_Right_Three_Connect:
      //左右三组一对多连线题 暂时无法诊断
      return ''
    case topaicTypes.Up_Down_Two_Connect:
      //"上下两组选择连线题" 需要平板作答
      return ''
    case topaicTypes.Oral_Arithmetic:
      //console.log('Oral_Arithmetic') 
      //口算题
      return diagnosisUtil.MathAllStrokesProcess(data)[1]
    case topaicTypes.Estimate_Oral_Arithetic:
      //console.log('Estimate_Oral_Arithetic') 
      //估算口算题
      return diagnosisUtil.MathAllStrokesProcess(data)[1]
    case topaicTypes.Equation_Calculation:
      //console.log('Equation_Calculation') 
      //等式计算
      return diagnosisUtil.MathMultiRowProcess(data)[0]
    case topaicTypes.Application_Questions:
      //应用题
      return diagnosisUtil.MathMultiRowProcess(data)[0]
    case topaicTypes.Vertical_Calculation_Jiafa:
    case topaicTypes.Vertical_Calculation_Jianfa:
    case topaicTypes.Vertical_Calculation_Chengfa:
    case topaicTypes.Img_Chengfa:
      //竖式计算
      return diagnosisUtil.MathVerticalIntAdd(data)[1]
    case topaicTypes.Coversion_Unit_Application:
      //换算单位应用题 暂时无法诊断，默认判对
      return ''
    case topaicTypes.Img_Much_Num_FIll_Blank_Much_Row_Carry:
      //图片填空题-多个空数字-多行-进位
      let arrImg_Much_Num_FIll_Blank_Much_Row_Carry = parseMuchFillBlank(diagnosisUtil.MathNumCompletion(data)[1])
      let arrImgMuchNumFIllBlankMuchRowCarryResult = arrImg_Much_Num_FIll_Blank_Much_Row_Carry.flat().join(' ')

      return arrImgMuchNumFIllBlankMuchRowCarryResult
    case topaicTypes.Estimate_Application:
      //估算应用题
      return diagnosisUtil.MathMultiRowProcess(data)[0]
    case topaicTypes.Up_Down_Three_Connect1:
      return ''
    case topaicTypes.Img_Chufa_Vir:
    case topaicTypes.Vertical_Calculation_Chufa: 
      let tempData1 = diagnosisUtil.MathVerticalIntDiv(data)
      return tempData1[tempData1.length - 1][0][0].join(',')
    case topaicTypes.Img_Chufa_Vir_Yushu:
    case topaicTypes.Vertical_Calculation_Chufa_Yushu:
      let tempData = diagnosisUtil.MathVerticalIntDiv(data)
      return tempData[tempData.length - 1][0][0] +'......'+tempData[tempData.length - 1][tempData[tempData.length - 1].length - 1][tempData[tempData.length - 1][tempData[tempData.length - 1].length - 1].length - 1]
    default:
      //目前没有识别的题目类型，默认正确
      return ''
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
  if (value === 'x' || value === 'X' || value === '×'|| value ==='✖️') {
    return 'x'
  }
  return '√'
}

//诊断
export function judgeByFront(currentTopaicData, data,resultData,canvasData) {
  console.log('judgeByFront',data)
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

      //选择题(A/B/C/D) 
      resultData.correction = currentTopaicData.answer_content == data ? '0' : '1'

      return {
        value:currentTopaicData.answer_content == data
      }
    case topaicTypes.Multipl_Choice_123:
      //console.log('Multipl_Choice_123')
      //123选择题
      resultData.correction = currentTopaicData.answer_content == data ? '0' : '1'

      return {
        value:currentTopaicData.answer_content == data
      }
    case topaicTypes.Than_Size:
      //console.log('Than_Size')   
      resultData.correction = exchangeThanSizeAnswer(filterData(data)) === exchangeThanSizeAnswer(currentTopaicData.answer_content) ? '0' : '1'

      //比大小题
      return {
        value:exchangeThanSizeAnswer(filterData(data)) == exchangeThanSizeAnswer(currentTopaicData.answer_content)
      }
    case topaicTypes.Text_One_Num_Fill_Blank:
      //文字填空题-1个空数字
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      resultData.correction = filterData(data) == (+currentTopaicData.answer_content) ? '0' : '1'

      return {
        value:filterData(data) == (+currentTopaicData.answer_content)
      }
    case topaicTypes.Text_Much_Num_Fill_Blank:
      //文字填空题-多个空数字
      let Text_Much_Num_Fill_Blank_Result =  parseAnswerFromMuchFillBlankNums(currentTopaicData.answer_content,data)
      let answerArrTextResult = parseAnswerFromMuchFillBlankSchoolBag(currentTopaicData.answer_content)
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      console.log('answerArrTextResult',answerArrTextResult)
      console.log('Text_Much_Num_Fill_Blank_Result',Text_Much_Num_Fill_Blank_Result)
      console.log('answerArrTextResult.includes(data)',answerArrTextResult.includes(filterData(data)))
      resultData.correction =  answerArrTextResult.includes(filterData(data))&&Text_Much_Num_Fill_Blank_Result ? '0' : '1'

      return {
        value:answerArrTextResult.includes(filterData(data))&&Text_Much_Num_Fill_Blank_Result
      }
    case topaicTypes.Img_One_Num_Fill_Blank:
      //图片填空题-1个空数字
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      console.log('图片填空题-1个空数字',)
      resultData.correction = filterData(data) == (+currentTopaicData.answer_content) ? '0' : '1'

      return {
        value:filterData(data) == (+currentTopaicData.answer_content)
      }
    case topaicTypes.Img_Much_Num_Fill_Blank:
      //图片填空题-多个空数字
      let Img_Much_Num_Fill_Blank_Result =  parseAnswerFromMuchFillBlankNums(currentTopaicData.answer_content,data)
      let answerArrImgResult = parseAnswerFromMuchFillBlankSchoolBag(currentTopaicData.answer_content)
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      resultData.correction = answerArrImgResult.includes(filterData(data))&&Img_Much_Num_Fill_Blank_Result ? '0' : '1'

      return {
        value: answerArrImgResult.includes(filterData(data))&&Img_Much_Num_Fill_Blank_Result
      }
    case topaicTypes.Img_Text_Num_Fill_Blank:
      //图片填空题-数字汉字混合
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Img_Check:
      //图片勾选题 暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Judegment:
      //console.log('Judegment') 
      resultData.correction = judgmentFilter(currentTopaicData.answer_content) === judgmentFilter(filterData(data))? '0' : '1'

      //判断题
      return {
        value:judgmentFilter(currentTopaicData.answer_content) == judgmentFilter(filterData(data)) 
      }
    case topaicTypes.Correct:
      //改错题   暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.One_Group_Connect:
      //console.log('One_Group_Connect') 
      //一组连线题
      let arrOneGroopuConnectAnswer = parseOneConnectionAnswer(currentTopaicData.answer_content)
      resultData.y_sort_idx = diagnosisUtil.LineConnectionMode12(filterData(data), currentTopaicData.pixels)[1]
      resultData.min_idx_angle = diagnosisUtil.LineConnectionMode12(filterData(data), currentTopaicData.pixels)[2]
      resultData.img_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 2
      resultData.correction = diagnosisOneGroupConnection(arrOneGroopuConnectAnswer, diagnosisUtil.LineConnectionMode12(filterData(data), currentTopaicData.pixels)[0]) ? '0' : '1'

      return {
        value:diagnosisOneGroupConnection(arrOneGroopuConnectAnswer, diagnosisUtil.LineConnectionMode12(filterData(data), currentTopaicData.pixels)[0])
      }


    case topaicTypes.Up_Down_Two_Much_Connect:
      //图片勾选题 暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Left_Right_Two_Connect:
      parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content)
      resultData.correction = diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(filterData(data))) ? '0' : '1'

      return {
        value:diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(filterData(data)))
      }
    case topaicTypes.Left_Right_Three_Connect:
      //左右三组一对多连线题 暂时无法诊断
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Up_Down_Two_Connect:
      //"上下两组选择连线题" 需要平板作答
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Oral_Arithmetic:
      //口算题
      resultData.correction=currentTopaicData.answer_content == filterData(data) ? '0' : '1'

      return {
        value:currentTopaicData.answer_content == filterData(data)
      }
    case topaicTypes.Estimate_Oral_Arithetic:
      //估算口算题
      resultData.correction=diagnosisEstimateOralArithetic(filterData(data), currentTopaicData.answer_content) ? '0' : '1'

      return {
        value:diagnosisEstimateOralArithetic(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Equation_Calculation:
      resultData.correction = '2'
      return {
        value:true
      }
    case topaicTypes.Application_Questions:
      resultData.correction = '2'

      return {
        value:true
      }
    case topaicTypes.Vertical_Calculation_Jiafa:
    case topaicTypes.Vertical_Calculation_Jianfa:
    case topaicTypes.Vertical_Calculation_Chengfa:
    case topaicTypes.Img_Chengfa:
      //竖式计算
      resultData.correction = diagnosisVerticalCalculation(filterData(data), currentTopaicData.answer_content) ? '0' : '1'

      return {
        value:diagnosisVerticalCalculation(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Coversion_Unit_Application:
      resultData.exercise_type = 4
      resultData.correction= '2'

      //换算单位应用题 暂时无法诊断，默认判对
      return {
        value:true
      }
    case topaicTypes.Img_Much_Num_FIll_Blank_Much_Row_Carry:
      //图片填空题-多个空数字-多行-进位
      resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      resultData.correction = diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(filterData(data), currentTopaicData.answer_content) ? '0' : '1'

      return {
        value:diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Estimate_Application:
      resultData.correction= '2'
      //估算应用题
      return {
          value:true
      }
    case topaicTypes.Up_Down_Three_Connect1:
      resultData.correction = diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(filterData(data)), currentTopaicData.answer_content) ? '0' : '1'
      return {
        value:diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(filterData(data)), currentTopaicData.answer_content)
      }
    case topaicTypes.Img_Chufa_Vir_Yushu:
    case topaicTypes.Img_Chufa_Vir:
    case topaicTypes.Vertical_Calculation_Chufa:
    case topaicTypes.Vertical_Calculation_Chufa_Yushu:
      resultData.correction = diagnosisImgChufaVirYushuNew(filterData(data), currentTopaicData.answer_content) ? '0' : '1'
      return {
        value: diagnosisImgChufaVirYushuNew(filterData(data), currentTopaicData.answer_content)
      }
    default:
      //目前没有识别的题目类型，默认正确
      //console.log('目前没有识别的题目类型，默认正确')
      resultData.correction = '2'

      return {
        value: true,
      }
  }
}

function filterData(data){
  return data.replaceAll('，',',').replaceAll(',','').replace(/[\r\n]/g,"").replace(/\ +/g,"")
}