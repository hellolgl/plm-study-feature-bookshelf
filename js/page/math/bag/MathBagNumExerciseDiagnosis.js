import {
  parseOneConnectionAnswer, validMultTopaic, parseAnswerFromMuchFillBlank,
  diagnosisOneGroupConnection, parseLeftRightTwoConnectAnswer
  , diagnosisLeftRightTwoConnectAnswer, exchangeThanSizeAnswer,
  diagnosisEstimateOralArithetic, diagnosisEquationCalculation,
  diagnosisVerticalCalculation, diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer,
  diagnosisEstimateApplication, diagnosisUpDownThreeConnect1Answer, diagnosisImgTextNumFillBlank,
  mathCompleteByPad, getStrImg, getStrImgSrcStr, diagnosisImgChufaVir, diagnosisImgChufaVirYushu, diagnosisImgChufaVirYushuNew,
  parseAnswerFromMuchFillBlankSchoolBag, parseAnswerFromMuchFillBlankNums
} from '../../../util/commonUtils'
import topaicTypes from '../../../res/data/MathTopaicType'
import { BasicProcessingFunc, MathProcessingFunc, MathBaseCaculateFunc } from '../../../util/diagnosis/pyramidhwr'
import { split } from 'lodash'
import mathdiagnosis from '../../../util/diagnosis/MathSpecificDiagnosisModule'
import { cos } from 'react-native-reanimated'


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
      // console.log('Judegment',diagnosisUtil.MathJudgementCompletion(data)) 
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
      return tempData[tempData.length - 1][0][0] + '......' + tempData[tempData.length - 1][tempData[tempData.length - 1].length - 1][tempData[tempData.length - 1][tempData[tempData.length - 1].length - 1].length - 1]
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
  if (!value) return
  if (value === 'x' || value === 'X' || value === '×' || value === '✖️') {
    return 'x'
  }
  if (value === '√' || value === '√') {
    return '√'
  }
  return 0
}

//诊断
export function judgeByFront(currentTopaicData, data, resultData, canvasData) {
  console.log('judgeByFront', data)
  console.log('judgeByFront currentTopaicData', currentTopaicData)
  resultData.private_stem_picture = ''
  resultData.exercise_type = 1
  resultData.y_sort_idx = ''
  resultData.min_idx_angle = ''
  resultData.img_answer_str = ''
  resultData.combine_region_mat = ''
  resultData.standard_answer_str = ''
  if (!currentTopaicData.exercise_data_type === 'FS' || !currentTopaicData.data_type === 'FS') {
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
  }
  switch (currentTopaicData.name) {
    case topaicTypes.Multipl_Choice_ABC:
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Multipl_Choice_123:
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Than_Size:
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Text_One_Num_Fill_Blank:
      if (canvasData) resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Text_Much_Num_Fill_Blank:
      //文字填空题-多个空数字
      if (canvasData) resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      if (currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS') {
        if (currentTopaicData.expand_name === "数字找规律") {
          // console.log('数字找规律数字找规律数字找规律数字找规律',data[0],currentTopaicData.answer_content[0])
          let answer_content_filter = currentTopaicData.answer_content[0].filter((i) => {
            return i[0] !== ','
          })
          let finally_answer_content = []
          let finally_my_answer = []
          answer_content_filter.forEach((i) => {
            i.forEach((j, ji) => {
              i[ji] = Number(j)
            })
            if (i.length === 3) {
              finally_answer_content.push((i[0] * i[2] + i[1]) / i[2])
            }
            if (i.length === 2) {
              finally_answer_content.push(i[0] / i[1])
            }
          })
          if (data[0].length === 1) {
            // 表示输入答案全是非分数
            finally_my_answer = data[0][0][0].split('，').map((i) => {
              return Number(i)
            })
          } else {
            let data_filter = data[0].filter((i) => {
              return i[0] !== '，'
            })
            data_filter.forEach((i) => {
              i.forEach((j, ji) => {
                i[ji] = Number(j)
              })
              if (i.length === 3) {
                finally_my_answer.push((i[0] * i[2] + i[1]) / i[2])
              }
              if (i.length === 2) {
                finally_my_answer.push(i[0] / i[1])
              }
              if (i.length === 1) {
                i[0].split('，').forEach((j) => {
                  if (j) finally_my_answer.push(Number(j))
                })

              }
            })
            finally_my_answer.forEach((i, index) => {
              if (typeof i !== 'number' && isNaN(i)) {
                finally_my_answer[index] = Number(i.replaceAll('，', ""))
              }
            })
          }
          // console.log('++++++++++++++',finally_my_answer.toString(),finally_answer_content.toString())
          if (finally_my_answer.toString() === finally_answer_content.toString()) {
            resultData.correction = '0'
            return {
              value: true
            }
          }
          resultData.correction = '1'
          return {
            value: false
          }
        } else {
          return multipleSpace(data, currentTopaicData)
        }
      } else {
        return multipleSpace(data, currentTopaicData)
      }
    case topaicTypes.Img_One_Num_Fill_Blank:
      //图片填空题-1个空数字
      if (canvasData) resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Img_Much_Num_Fill_Blank:
      //图片填空题-多个空数字
      if (canvasData) resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3
      return multipleSpace(data, currentTopaicData)
    case topaicTypes.Img_Text_Num_Fill_Blank:
      //图片填空题-数字汉字混合
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Img_Check:
      //图片勾选题 暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Judegment:
      if (currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS') {
        currentTopaicData.answer_content = [[currentTopaicData.answer_content[0][0].replaceAll('×', 'x')]]
      } else {
        currentTopaicData.answer_content = currentTopaicData.answer_content.replaceAll('×', 'x')
      }
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Correct:
      //改错题   暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value: true
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
        value: diagnosisOneGroupConnection(arrOneGroopuConnectAnswer, diagnosisUtil.LineConnectionMode12(filterData(data), currentTopaicData.pixels)[0])
      }


    case topaicTypes.Up_Down_Two_Much_Connect:
      //图片勾选题 暂时无法诊断，直接判对
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Left_Right_Two_Connect:
      parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content)
      resultData.correction = diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(filterData(data))) ? '0' : '1'

      return {
        value: diagnosisLeftRightTwoConnectAnswer(parseLeftRightTwoConnectAnswer(currentTopaicData.answer_content), diagnosisUtil.LineConnectionMode8(filterData(data)))
      }
    case topaicTypes.Left_Right_Three_Connect:
      //左右三组一对多连线题 暂时无法诊断
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Up_Down_Two_Connect:
      //"上下两组选择连线题" 需要平板作答
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Oral_Arithmetic:
      return oneSpace(data, currentTopaicData)
    case topaicTypes.Estimate_Oral_Arithetic:
      //估算口算题
      resultData.correction = diagnosisEstimateOralArithetic(filterData(data), currentTopaicData.answer_content) ? '0' : '1'

      return {
        value: diagnosisEstimateOralArithetic(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Equation_Calculation:
      resultData.correction = '2'
      return {
        value: true
      }
    case topaicTypes.Application_Questions:
      resultData.correction = '2'

      return {
        value: true
      }
    case topaicTypes.Vertical_Calculation_Jiafa:
    case topaicTypes.Vertical_Calculation_Jianfa:
    case topaicTypes.Vertical_Calculation_Chengfa:
    case topaicTypes.Img_Chengfa:
      //竖式计算
      resultData.correction = diagnosisVerticalCalculation(filterData(data), currentTopaicData.answer_content) ? '0' : '1'

      return {
        value: diagnosisVerticalCalculation(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Coversion_Unit_Application:
      resultData.exercise_type = 4
      resultData.correction = '2'

      //换算单位应用题 暂时无法诊断，默认判对
      return {
        value: true
      }
    case topaicTypes.Img_Much_Num_FIll_Blank_Much_Row_Carry:
      //图片填空题-多个空数字-多行-进位
      if (canvasData) resultData.combine_region_mat = diagnosisUtil.MathNumCompletion(canvasData)[2]
      resultData.standard_answer_str = currentTopaicData.pixels
      resultData.exercise_type = 3

      let _answer_content = currentTopaicData.answer_content.replaceAll(',', '')
      resultData.correction = data === _answer_content ? '0' : '1'
      // resultData.correction = diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(filterData(data), currentTopaicData.answer_content) ? '0' : '1'
      return {
        //   // value:diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(filterData(data), currentTopaicData.answer_content)
        value: data === _answer_content
      }
    case topaicTypes.Estimate_Application:
      resultData.correction = '2'
      //估算应用题
      return {
        value: true
      }
    case topaicTypes.Up_Down_Three_Connect1:
      resultData.correction = diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(filterData(data)), currentTopaicData.answer_content) ? '0' : '1'
      return {
        value: diagnosisUpDownThreeConnect1Answer(diagnosisUtil.LineConnectionMode10(filterData(data)), currentTopaicData.answer_content)
      }
    case topaicTypes.Img_Chufa_Vir_Yushu:
    case topaicTypes.Img_Chufa_Vir:
    case topaicTypes.Vertical_Calculation_Chufa:
    case topaicTypes.Vertical_Calculation_Chufa_Yushu:
      resultData.correction = diagnosisImgChufaVirYushuNew(filterData(data), currentTopaicData.answer_content) ? '0' : '1'
      return {
        value: diagnosisImgChufaVirYushuNew(filterData(data), currentTopaicData.answer_content)
      }
    case topaicTypes.Application_Questions_NoDiagnosticProcess:
      // 应用题-不诊断过程
      console.log('应用题-不诊断过程应用题-不诊断过程应用题-不诊断过程应用题-不诊断过程', data, currentTopaicData.answer_content, currentTopaicData)
      if (true) {
        let finalValueStr = ''
        let finalValue = ''
        let myAnswer = '' //最终写的答案
        let len = data.length
        let unit = ''
        if (currentTopaicData.choice_txt) {
          let choice_txt = currentTopaicData.choice_txt.split('#')
          unit = '(' + choice_txt[0] + ')'
        }
        if (currentTopaicData.alphabet_value) {
          for (let i in currentTopaicData.variable_value) {
            if (currentTopaicData.variable_value[i].key === currentTopaicData.answer_content_beforeChange) {
              unit = '(' + currentTopaicData.variable_value[i].value[1] + ')'
            }
          }
        }
        let answer_content = currentTopaicData.answer_content + unit
        let _data = JSON.parse(JSON.stringify(data))
        // _data[0].forEach((i)=>{
        //   finalValueStr += i[0]
        // })
        // finalValue = eval(finalValueStr.replaceAll('×',"*").replaceAll('÷',"/")) + unit   //列式结果
        let str = ''
        _data[len - 1].forEach((i) => {
          let item = i[0]
          if (i.length > 1) item = i.join(',')   //分数类
          str += item
        })
        let strLen = str.split('=').length
        myAnswer = str.split('=')[strLen - 1]
        // console.log('22222222222222222222222222222',str,myAnswer,answer_content)
        // console.log(finalValue === answer_content && myAnswer === answer_content)
        // console.log( myAnswer === answer_content)

        // resultData.correction =finalValue === answer_content && myAnswer === answer_content? '0':'1'     列式也诊断
        resultData.correction = myAnswer === answer_content ? '0' : '1'
        return {
          // value: finalValue === answer_content && myAnswer === answer_content?true:false 列式也诊断
          value: myAnswer === answer_content ? true : false
          // value: myAnswer === false
        }
      }
    case topaicTypes.Extended_Calculation_Problem:
      // 拓展计算题
      console.log('拓展计算题拓展计算题拓展计算题', data, currentTopaicData.answer_content, currentTopaicData)
      let myAnswer = ''
      let len = data.length
      let _data = JSON.parse(JSON.stringify(data))
      let str = ''
      _data[len - 1].forEach((i) => {
        str += i[0]
      })
      let strLen = str.split('=').length
      myAnswer = str.split('=')[strLen - 1]
      resultData.correction = myAnswer === currentTopaicData.answer_content ? '0' : '1'
      return {
        value: myAnswer === currentTopaicData.answer_content
      }
    case topaicTypes.Clever_Calculation_24:
      // 巧算24点
      console.log('巧算24点巧算24点巧算24点巧算24点', data, data.join(''), currentTopaicData.answer_content, currentTopaicData)
      let arr = data.join('').replaceAll(',', '').split('=')
      let myAnswer_arr = arr[0].replace(/\s/g, "").replaceAll('+', ',').replaceAll('-', ',').replaceAll('×', ',').replaceAll('÷', ',').replaceAll('(', ',').replaceAll(')', ',').replaceAll('[', ',').replaceAll(']', ',').split(',').filter((i) => { return i })
      console.log('&&&&&&&&&&&&&&&', myAnswer_arr, currentTopaicData.answer_content.split(','))
      if (getArrDifference(currentTopaicData.answer_content.split(','), myAnswer_arr) > 0 || myAnswer_arr.length !== 4) {
        // 没有使用题目给的数字
        return {
          value: false
        }
      } else {
        myAnswer_arr = arr[0].replaceAll('×', '*').replaceAll('÷', '/').replace(/\s/g, "")
        if (arr[1] && arr[1] === '24' && eval(myAnswer_arr) === 24) {
          return {
            value: true
          }
        }
        if (!arr[1] && eval(myAnswer_arr) === 24) {
          return {
            value: true
          }
        }
        return {
          value: false
        }
      }
    case topaicTypes.Text_Much_Operation_Symbol:
      // 文字填空题-填运算符号
      console.log('文字填空题-填运算符号文字填空题-填运算符号', data, currentTopaicData.answer_content, currentTopaicData)
      if (currentTopaicData.topic_type === '0') {
        // 整数
        let index = currentTopaicData.answer_content.indexOf('=')
        let formula = currentTopaicData.answer_content.substring(0, index).replaceAll('X', '×').replace(/\s/g, "")
        let formula_arr = formula.split('')
        let formulaResult = currentTopaicData.answer_content.substring(index + 1)
        let symbol_arr = []
        formula_arr.forEach((i, index) => {
          if (i === '+' || i === '-' || i === '×' || i === '÷') {
            symbol_arr.push({
              key: index,
              value: ''
            })
          }
        })
        let data_filter_arr = data[0].filter((i) => { return i[0] !== '，' })
        console.log('222222222222222222222', data_filter_arr, symbol_arr)

        if (data_filter_arr.length !== symbol_arr.length) {
          // 运算符数量不对
          return {
            value: false
          }
        } else {
          symbol_arr.forEach((item, index) => {
            item.value = data_filter_arr[index][0]
            if (formula_arr[item.key]) formula_arr[item.key] = item.value
          })
          // console.log('222222222222222222222', symbol_arr, formula, formulaResult, data[0], data_filter_arr, formula_arr.join(''))
          let myFormulaResult = formula_arr.join('').replaceAll('×', '*').replaceAll('÷', '/')

          if (formulaResult == eval(myFormulaResult)) {
            // console.log('3333333333333333333333', eval(myFormulaResult), formulaResult, data[0].join('').trim().length, symbol_arr.length + symbol_arr.length - 1)
            // console.log('5555555555555555', data[0].join('').replaceAll('，', ',').replace(/^,+/, "").replace(/,+$/, "")) //去掉首尾逗号
            if (data[0][0][0] === '，') {
              // 第一位是逗号算错
              return {
                value: false,
              }
            }
            if (trimStringByDH(data[0].join('')).length !== symbol_arr.length + symbol_arr.length - 1) {
              // 没有空格或者空格不够
              return {
                value: false,
                reason: '答案没用一个逗号隔开'
              }
            }
            return {
              value: true
            }
          }
        }
      } else {
        // 分数
        let stem = currentTopaicData.exercise_stem[1]
        let index = stem.indexOf('=')
        let formula_arr = ''
        let formulaResult = ''
        if (index === -1) {
          // 答案是一个整数的情况 2.2, 1〇（2〇3〇4）〇5 = ['5','1','10']
          if (Array.isArray(stem[stem.length - 1])) {
            formulaResult = [stem[stem.length - 1]]
            if (stem.slice(0, stem.length - 1).length === 1) {
              // 1〇（2〇3〇4）〇5 = 这种情况
              let str = stem.slice(0, stem.length - 1)[0]
              formula_arr = [str.substring(0, str.length - 1)]
            } else {
              // '）=' 这种情况
              let arr = stem.slice(0, stem.length - 1)
              arr[arr.length - 1] = arr[arr.length - 1].substring(0, arr[arr.length - 1].length - 1)
              formula_arr = arr
            }
          } else {
            formulaResult = stem[stem.length - 1].substring(1)
            formula_arr = stem.slice(0, stem.length - 1)
          }
        } else {
          formula_arr = stem.slice(0, index)
          formulaResult = stem.slice(index + 1)
        }
        // console.log('&&&&&&&&&&&&&',formula_arr,formulaResult)
        let data_filter_arr = data[0].filter((i) => { return i[0] !== '，' })
        let data_filter_arr_index = 0
        formula_arr.forEach((item, index) => {
          if (!Array.isArray(item)) {
            let arr = []
            item.split('').forEach((child) => {
              if (child === '〇') {
                child = data_filter_arr[data_filter_arr_index]
                data_filter_arr_index++
              }
              arr.push(child)
            })
            formula_arr[index] = arr.join('')
          }
        })
        if (data_filter_arr.length !== data_filter_arr_index) {
          // 运算符数量不对
          return {
            value: false
          }
        }
        let myResult = mathdiagnosis.StandardCalculateAnswer(formula_arr)[0] / mathdiagnosis.StandardCalculateAnswer(formula_arr)[1]
        let formulaResult_value = formulaResult    //整数就是这个值
        if (Array.isArray(formulaResult)) {
          // 答案是分数
          if (formulaResult[0].length === 3) {
            // 带分数
            formulaResult_value = (formulaResult[0][0] * formulaResult[0][2] + Number(formulaResult[0][1])) / formulaResult[0][2]
          } else {
            formulaResult_value = formulaResult[0][0] / formulaResult[0][1]
          }
        }
        // console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvv',formula_arr,mathdiagnosis.StandardCalculateAnswer(formula_arr),myResult,formulaResult,formulaResult_value,myResult==formulaResult_value)
        if (myResult == formulaResult_value) {
          if (data[0][0][0] === '，') {
            // 第一位是逗号算错
            return {
              value: false,
            }
          }
          if (trimStringByDH(data[0].join('')).length !== data_filter_arr.length + data_filter_arr.length - 1) {
            // 没有一个逗号隔开
            return {
              value: false,
              reason: '答案没用一个逗号隔开'
            }
          }
          return {
            value: true
          }
        }
        return {
          value: false
        }
      }
    case topaicTypes.Text_Much_Fraction_Split:
      // 文字填空题-分数的拆分
      console.log('文字填空题-分数的拆分文字填空题-分数的拆分', data, currentTopaicData.answer_content, currentTopaicData.exercise_stem[0])
      let stem = currentTopaicData.exercise_stem[0]
      let index = currentTopaicData.exercise_stem[0].indexOf('=')
      let right = JSON.parse(JSON.stringify(stem)).splice(index + 1)
      let answer_num = 0
      right.forEach((i, x) => {
        if (Array.isArray(i)) {
          i.forEach((j, jx) => {
            if (j.replace(/\s/g, "") === '()') {
              answer_num += 1
              i[jx] = data[0][x][0]
            }
          })
        }
      })
      let right_result = mathdiagnosis.StandardCalculateAnswer(right)
      let my_answer = ''
      let answer_content = true
      if (right_result.toString() === currentTopaicData.answer_content.toString()) {
        let filter_data = data[0].filter(i => {
          return i[0] !== '，'
        })
        if (filter_data.length === answer_num) {
          my_answer = true
        } else {
          my_answer = false
        }
      }
      return {
        value: my_answer === answer_content
      }
    case topaicTypes.Text_Much_Fill_In_Numbers:
      // 文字填空题-填数字
      let data_index = 0
      if (currentTopaicData.topic_type === '0') {
        // console.log('文字填空题-填数字文字填空题-填数字文字填空题-填数字',data,data[0][0][0].split('，'),currentTopaicData.answer_content,currentTopaicData.answer_content.split(''),currentTopaicData)
        // 整数
        if (data[0].length > 1) {
          // 代表输入了非,号的符号
          return {
            value: false,
          }
        }
        let data_arr = data[0][0][0].split('，')
        let answer_content_arr = currentTopaicData.answer_content.split('')
        if (currentTopaicData.exercise_stem.indexOf('从1-9') !== -1) {
          for (let i = 0; i < data_arr.length; i++) {
            if (data_arr[i] > 9 || data_arr[i] < 1) {
              return {
                value: false,
                reason: '输入的数字不在1-9之间'
              }
            }
          }
        }
        answer_content_arr.forEach((item, index) => {
          if (item === '□') {
            answer_content_arr[index] = data_arr[data_index]
            data_index++
          }
        })
        let left = answer_content_arr.join('').split('=')[0].replaceAll('×', '*').replaceAll('÷', '/')
        let right = answer_content_arr.join('').split('=')[1].replaceAll('×', '*').replaceAll('÷', '/')
        // console.log('222222222222222222222',answer_content_arr.join(''),eval(left).toFixed(2) ,eval(right).toFixed(2),eval(left).toFixed(2) === eval(right).toFixed(2))
        // '7.05*4.8+4.8*4.7-45.4' 这种情况会有精度缺失，所以需要.toFixed(2)
        if (eval(left).toFixed(2) === eval(right).toFixed(2)) {
          if (data_arr.length === data_index || (data[0][0][0][data[0][0][0].length - 1] === '，' && data_arr.length === data_index + 1)) {
            // 填的数据够或者数据够的情况下最后一个字符跟了个逗号时算对
            return {
              value: true
            }
          }
        }
        return {
          value: false
        }
      } else {
        // 分数
        console.log('文字填空题-填数字文字填空题-填数字文字填空题-填数字', data, currentTopaicData.answer_content, currentTopaicData)
        let data_arr = data[0].filter((item) => { return item[0] !== '，' })
        let answer_content = JSON.parse(JSON.stringify(currentTopaicData)).answer_content[0]
        answer_content.forEach((item, index) => {
          if (!Array.isArray(item) && item.indexOf('□') > -1) {
            let arr = item.split('')
            arr.forEach((child, indexChild) => {
              if (child === '□') {
                arr[indexChild] = data_arr[data_index]
                data_index++
              }
            })
            answer_content.splice(index, 1, [arr])
          }
        })
        let answer_content_final = []
        answer_content.forEach((item, index) => {
          if (Array.isArray(item[0])) {
            item[0].forEach((child) => {
              answer_content_final.push(child)
            })
          } else {
            answer_content_final.push(item)
          }
        })
        let left = answer_content_final.slice(0, answer_content_final.indexOf('='))
        let left_result = mathdiagnosis.StandardCalculateAnswer(left)
        let right = answer_content_final.slice(answer_content_final.indexOf('=') + 1)
        let right_result = mathdiagnosis.StandardCalculateAnswer(right)
        // console.log('33333333333',data[0],data_arr,left,right)
        if (left_result[0] === right_result[0] && left_result[1] === right_result[1]) {
          if (data_arr.length !== data_index || data[0][0][0] === '，') {
            // 答案写多了
            return {
              value: false
            }
          }
        } else {
          return {
            value: false
          }
        }
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

// 拿arr1中不存在在arr2中的值
function getArrDifference(arr1, arr2) {
  const difference = arr1.filter(v => {
    return arr2.indexOf(v) === -1
  })
  return difference.length
}

function filterData(data) {
  return data.replaceAll('，', ',').replaceAll(',', '').replace(/[\r\n]/g, "").replace(/\ +/g, "")
}


function fillintheblanksFilterData(data) {
  return data.replaceAll('，', ',').replace(/\s/g, "")
}

// 去掉首尾字符
function trimStringByDH(string) {
  return string.replaceAll('，', ',').replace(/^,+/, "").replace(/,+$/, "")
}

function haveName(name) {
  // 填空题-1个空数字，口算题
  let arr = [topaicTypes.Text_One_Num_Fill_Blank, topaicTypes.Oral_Arithmetic]
  return arr.indexOf(name) > -1
}

// 单个填空的诊断
function oneSpace(data, topic) {
  let currentTopaicData = JSON.parse(JSON.stringify(topic))
  console.log('信息', data, currentTopaicData)
  // 还要增加一种答案是唯一的，录入的时候有多个答案的诊断方式
  if (data[0].length > 1) {
    // 限制[[A],[,]]的答案
    return {
      value: false
    }
  }
  let my_answer = ''
  let answer_content = ''
  if (currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS') {
    console.log('分数数据', data, currentTopaicData.answer_content)
    if (haveName(currentTopaicData.name)) {
      if (currentTopaicData.answer_content[0].length > 1) {
        let answer_arr = currentTopaicData.answer_content[0].join(';').split(';')
        console.log('多个答案', answer_arr, data.toString())
        if (answer_arr.indexOf(data.toString()) > -1) {
          my_answer = true
          answer_content = true
        } else {
          my_answer = false
          answer_content = true
        }
      } else {
        my_answer = data.toString()
        answer_content = currentTopaicData.answer_content.toString()
      }
    } else {
      // 分数类的判断题，比较大小
      my_answer = fillintheblanksFilterData(data[0][0][0])
      answer_content = fillintheblanksFilterData(currentTopaicData.answer_content[0][0])
      if (currentTopaicData.name === topaicTypes.Than_Size) {
        answer_content = answer_content.replaceAll('=', '＝').replaceAll('>', '＞').replaceAll('<', '＜')
      }
    }
  } else {
    answer_content = fillintheblanksFilterData(currentTopaicData.answer_content)
    if (currentTopaicData.name === topaicTypes.Than_Size) {
      answer_content = answer_content.replaceAll('=', '＝').replaceAll('>', '＞').replaceAll('<', '＜')
    }
    my_answer = fillintheblanksFilterData(data[0][0][0])
  }
  console.log('*********', my_answer, answer_content, my_answer === answer_content)
  return {
    value: my_answer === answer_content
    // value:false
  }
}


// 
// 多个空的诊断
function multipleSpace(data, topic) {
  let currentTopaicData = JSON.parse(JSON.stringify(topic))
  // currentTopaicData.answer_content = ["2,0.25,",['1','4'],",6,",['1','2','3']]
  // currentTopaicData.answer_content = ["2,0.25"]
  // currentTopaicData.answer_content = [[['1','2','3'],',',['1','4']]]
  // currentTopaicData.answer_content = [[['1','2','3'],',6']]
  console.log('信息', data, currentTopaicData.answer_content)
  let my_answer = ''
  let answer_content = ''
  if (currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS') {
    let arr = []
    let answer_arr = []   //用来存有几组答案
    currentTopaicData.answer_content[0].forEach(i => {
      if (i === ';') {
        answer_arr.push(arr)
        arr = []
      } else {
        arr.push(i)
      }
    })
    if (arr.length > 0) {
      answer_arr.push(arr)
      arr = []
    }
    let isAnother = false
    for (let i = 0; i < currentTopaicData.answer_content[0].length; i++) {
      let item = currentTopaicData.answer_content[0][i]
      if (!Array.isArray(item) && item !== ',') {
        isAnother = true
        break
      }
    }
    let my_answer_before = data.toString()
    if (isAnother) {
      // 答案全不全是分数的情况
      let finally_data = []
      let str = ''
      data[0].forEach((i, x) => {
        if (i.length > 1) {
          if (str) {
            finally_data.push(str)
            str = ''
          }
          finally_data.push(i)
        } else {
          str += i[0]
        }
      })
      if (str) finally_data.push(str)
      my_answer_before = finally_data.toString()
    }
    let len = my_answer_before.length
    if (my_answer_before[len - 1] === '，') {
      let index = len - 2
      if (my_answer_before[len - 2] !== ',') {
        // 以非分数结尾的，在最后多输入了一个逗号时这样截取
        index = len - 1
      }
      my_answer_before = my_answer_before.slice(0, index)
    }
    my_answer = fillintheblanksFilterData(my_answer_before)
    if (answer_arr.length > 1) {
      // 有多组正确答案
      for (let i = 0; i < answer_arr.length; i++) {
        if (my_answer === fillintheblanksFilterData(answer_arr[i].toString())) {
          my_answer = true
          answer_content = true
          break
        }
      }
    } else {
      answer_content = fillintheblanksFilterData(currentTopaicData.answer_content.toString())
    }
  } else {
    let my_answer_before = data[0].reduce((c, i) => {
      c += i[0]
      return c
    }, '')
    let len = my_answer_before.length
    if (my_answer_before[len - 1] === '，') {
      my_answer_before = my_answer_before.slice(0, len - 1)
    }
    my_answer = fillintheblanksFilterData(my_answer_before)
    if (currentTopaicData.answer_content.split(';').length > 1) {
      for (let i = 0; i < currentTopaicData.answer_content.split(';').length; i++) {
        let item = currentTopaicData.answer_content.split(';')[i]
        if (my_answer === fillintheblanksFilterData(item)) {
          my_answer = true
          answer_content = true
          break
        }
      }
    } else {
      answer_content = fillintheblanksFilterData(currentTopaicData.answer_content)
    }
  }
  console.log('*********', my_answer, answer_content, my_answer === answer_content)
  return {
    value: my_answer === answer_content
    // value:false
  }
}

