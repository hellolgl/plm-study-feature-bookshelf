import fp from 'lodash/fp'
import _ from 'lodash'
import types from '../res/data/MathTopaicType'
import { BasicProcessingFunc, MathProcessingFunc, MathBaseCaculateFunc } from './diagnosis/pyramidhwr'
import yuwenTypes from '../res/data/YuwenTopaicType'

let diagnosisUtil = new MathProcessingFunc()
let mathUtil = new MathBaseCaculateFunc()

export function exchange(value) {
  let arr = fp.split('【')(value);
  let str = fp.map((item) => {
    if (item.indexOf('.png') != -1 || item.indexOf('.jpg') != -1) {
      item = `<img  src=http://www.pailaimi.com/static/image/${item} />`
    }
    return item
  })(arr)
  let result = str.join('')
  return result;
}

//获取数学需要在图片上进行手写操作的题目，eg：连线题
export function getMathPicTopaicUrl(value) {
  let arr = fp.split('【')(value);
  let result = ''
  let str = fp.map((item) => {
    if (item.indexOf('.png') != -1 || item.indexOf('.jpg') != -1) {
      result = `http://www.pailaimi.com/static/image/${item}`
    }
    return item
  })(arr)
  return result;
}

//获取语文需要在图片上进行手写操作的题目，eg：连线题
export function getYuwenPicTopaicUrl(value) {
  let arr = fp.split('【')(value);
  let result = ''
  let str = fp.map((item) => {
    if (item.indexOf('.png') != -1 || item.indexOf('.jpg') != -1) {
      result = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${item}`
    }
    return item
  })(arr)
  return result;
}


export function validMultTopaic(data, type) {
  console.log('validMultTopaic data',data,type)
  switch (type) {
    case types.Multipl_Choice_123:
      return validMultTopaic123(data)
    case types.Multipl_Choice_ABC:
      return validMultTopaicABC(data)
    // default:
    //   return validMultTopaicABC(data)
  }
}

function validMultTopaicABC(data) {
  let arr = fp.split('#')(data)
  // console.log('validMultTopaicABC arr',arr)
  let a = 65 //A
  const result = fp.map((item) => {
    item = '<p>' + (String.fromCharCode(a++)) + '.' + item + '</p>';
    return item
  })(arr)
  //console.log('validMultTopaicABC',result.join(''))
  return result.join('')
}

function validMultTopaic123(data) {
  let arr = fp.split('#')(data)
  //console.log('validMultTopaic123 arr',arr)
  let a = 1 //A
  const result = fp.map((item) => {
    item = '<p>' + (a++) + '.' + item + '</p>';
    return item
  })(arr)
  //console.log('validMultTopaic123',result.join(''))
  return result.join('')
}

export function validMultTopaicImg(data, type) {
  console.log('validMultTopaic data_____________________',data)
  switch (type) {
    case types.Multipl_Choice_123:
      return validMultTopaic123Img(data)
    case types.Multipl_Choice_ABC:
      return validMultTopaicABCImg(data)
    default:
      return validMultTopaicABCImg(data)
  }
}

function validMultTopaicABCImg(data) {
  let arr = fp.split('#')(data)
  //console.log('validMultTopaicABC arr',arr)
  let a = 65 //A
  const result = fp.map((item) => {
    item = '<p>' + (String.fromCharCode(a++)) + '.'  + '</p>' + '<img src='+"https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/"+item+' style="max-width:100%;">'
    return item
  })(arr)
  //console.log('validMultTopaicABC',result.join(''))
  return result.join('')
}

function validMultTopaic123Img(data) {
  let arr = fp.split('#')(data)
  //console.log('validMultTopaic123 arr',arr)
  let a = 1 //A
  const result = fp.map((item) => {
    item = '<p>' + (a++) + '.' + '</p>'+ '<img src='+"https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/"+item+' style="max-width:100%;">'
    return item
  })(arr)
  //console.log('validMultTopaic123',result.join(''))
  return result.join('')
}

//获取英语图片对应英文单词
export function getEngPicWord(data) {
  let aar = fp.split('/')(data)
  let word = ''
  const result = fp.map((item) => {
    if (item.indexOf('.png') != -1) {
      word = item.replace('.png', '')
    }
    if (item.indexOf('.jpg') != -1) {
      word = item.replace('.jpg', '')
    }
  })(aar)

  return word;

}

//解析多个空填空题答案成数组
export function parseAnswerFromMuchFillBlank(data) {
  return fp.split(',')(data).join('')
}

//解析一组连线题答案
export function parseOneConnectionAnswer(data) {
  let arr = fp.split(';')(data).join(',')
  return fp.split(',')(arr)
}

//判断一组连线题正确结果
export function diagnosisOneGroupConnection(item, value) {
  //console.log('diagnosisOneGroupConnection item',item)
  //console.log('diagnosisOneGroupConnection value',value)
  //判断item和value是否都为数组，如果不是，则返回false
  if (Array.isArray(item) && Array.isArray(value)) {
    //item为答案，答案中可能录入有null
    let itemTemp = fp.map((item) => {
      if (item != 'null') {
        return item
      }
    })(item)
    //console.log('value.flat():::::',value.flat())
    if (itemTemp.length != value.flat().length) {
      return false
    }
    let valueTemp = fp.map((item) => {
      return (+item)
    })(value.flat())
    for (let i = 0; i < itemTemp.flat().length; i++) {
      if (valueTemp[i] != itemTemp.flat()[i]) {
        return false
      }
    }

    return true

  }

  return false

}

export function parseLeftRightTwoConnectAnswer(data) {
  return fp.split(',')(data)
}

//判断一组连线题正确结果
export function diagnosisLeftRightTwoConnectAnswer(item, value) {
  //console.log('diagnosisLeftRightTwoConnectAnswer item',item)
  //console.log('diagnosisLeftRightTwoConnectAnswer value',value)
  if (Array.isArray(item) && Array.isArray(value)) {
    if (item.length != value.length) return false
    for (let i = 0; i < item.length; i++) {
      if (item[i] != value[i]) return false
    }
    return true
  }
  return false
}


//兼容判断题答案录入
export function exchangeThanSizeAnswer(data) {
  // console.log('exchangeThanSizeAnswer',data)
  if (data === '<' || data === '＜'||data==='＜') {
    return '<'
  }
  if (data === '=' || data === '＝' || data ==='＝') {
    return '='
  }
  if (data === '>' || data === '＞'|| data==='＞') {
    return '>'
  }
}

//估算口算题诊断结果判断
export function diagnosisEstimateOralArithetic(data, answer) {

  let arrAnswer = fp.split(';')(answer)
  //console.log('arrAnswer',arrAnswer)
  //console.log('diagnosisEstimateOralArithetic',data)
  if (arrAnswer.indexOf(data) != -1) {
    return true
  }
  return false
}

//等式计算诊断结果判断
export function diagnosisEquationCalculation(data, answer) {
  let tempData = [...data]
  //console.log('tempData',tempData)
  //console.log('answer',answer)
  if (Array.isArray(data) && Array.isArray(answer)) {
    let dataReverse = tempData[1].reverse()
    let answerReverse = answer.reverse();
    //console.log('dataReverse',dataReverse)
    //console.log('answerReverse',answerReverse)
    for (let i = 0; i < dataReverse.flat().length; i++) {
      //console.log('dataReverse.flat()[i]',dataReverse.flat()[i])
      //console.log('answerReverse[i].trim()',answerReverse[i].trim())
      if (dataReverse.flat()[i] != answerReverse[i].trim()) return false
    }
    return true
  }

  return false

}

//竖式计算诊断结果判断
export function diagnosisVerticalCalculation(data, asnwer) {
  let tempData = [...data]
  let dataReverse = tempData.reverse() //会改变原数组，此时tempData与dataReverse内容一致
  //console.log('diagnosisVerticalCalculation dataReverse',dataReverse)
  return dataReverse[0][0] === asnwer
}

//图片填空题-多个空数字-多行-进位
export function diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer(data, answer) {
  let answerArr = fp.split(';')(answer)
  let result =
    // console.log('diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer answerArr',answer.replaceAll(',',''),data.replaceAll())

    fp.map((item) => {
      let temp = item.split(',').join('')
      //console.log('diagnosisImgMuchNumFIllBlankMuchRowCarryAnswer temp',temp)
      if (temp === data) {
        result = true
      }
    })(answerArr)

  return result

}


//应用题
export function diagnosisEstimateApplication(data, answer, answerContent) {

  let answerArr = fp.split(',')(answer)
  //console.log('answerArr:::::::',answerArr)
  //console.log('data::::::::::::::;',data)
  //console.log('answerContent::::::::::::::;',answerContent)
  let result = true
  let info = '正确'
  let columnarArr = []
  let caculateArr = []
  let answerArrItemArr = []
  let columnarItemArr = []
  let tempArr = validSeparateData(data)
  columnarArr = tempArr[0]  //手写数据列式数据
  caculateArr = tempArr[1]  //手写数据计算数据
  //console.log('columnarArr:::::::::',columnarArr)
  //console.log('caculateArr:::::::::',caculateArr)
  fp.map((item) => {
    //提出列式中代加减乘运算的item
    if (fp.split('+')(item).length > 1 || fp.split('-')(item).length > 1 || fp.split('x')(item).length > 1 || fp.split('÷')(item).length > 1) {
      columnarItemArr.push([item])
    }
  })(columnarArr)
  columnarArr = validAddDelItem(columnarArr)
  columnarArr = vaildchengfaArr(columnarArr)
  //console.log('columnarArr1111111111:::::::::',columnarArr)
  //console.log('columnarItemArr1111111111:::::::::',columnarItemArr)
  fp.map((item) => {
    //提出列式中代加减乘运算的item
    if (fp.split('+')(item).length > 1 || fp.split('-')(item).length > 1 || fp.split('x')(item).length > 1 || fp.split('×')(item).length > 1) {
      answerArrItemArr.push([item])
    }
  })(answerArr)
  answerArr = validAddDelItem(answerArr)
  answerArr = vaildchengfaArr(answerArr)
  //console.log('answerArr1111111111:::::::::',answerArr)
  //console.log('answerArrItemArr1111111111:::::::::',answerArrItemArr)

  answerArrItemArr = fp.filter((item) => {
    return item != ','
  })(mathUtil.splitstr(answerArrItemArr[0].join(',')))
  //console.log('answerArrItemArr[0]::::::::',answerArrItemArr)
  answerArrItemArr = vaildchengfaArr(answerArrItemArr) //目前只处理的一个列式的情况，如果多列数，需要循环遍历
  columnarItemArr = fp.filter((item) => {
    return item != ','
  })(mathUtil.splitstr(columnarItemArr[0].join(',')))
  columnarItemArr = vaildchengfaArr(columnarItemArr)
  //console.log('answerArrItemArr2222222222:::::::::',answerArrItemArr)

  columnarArr.map((item) => {
    if (answerArr.indexOf(item) < 0) {
      //console.log('列式错误columnarArr::::::',item)
      //console.log('列式错误answerArr::::::',answerArr)
      result = false
      info = '列式错误'
    } else if (answerArr.indexOf(item) >= 0) {
      let index = answerArr.findIndex((value) => {
        return value == item
      })
      //从answerArr中去掉这个item
      answerArr.splice(index, 1)
    }
  })

  columnarItemArr.map((item) => {
    if (answerArrItemArr.indexOf(item) < 0) {
      //console.log('列式错误columnarItemArr::::::',item)
      //console.log('列式错误columnarItemArr::::::',answerArrItemArr)
      result = false
      info = '列式错误'
    } else if (answerArrItemArr.indexOf(item) >= 0) {
      let index = answerArrItemArr.findIndex((value) => {

        return value == item
      })
      //从answerArrItemArr中去掉这个item
      answerArrItemArr.splice(index, 1)
    }
  })
  fp.map((item) => {
    //console.log('计算过程：：：：：：',item)
    item = item.replace('÷', '/')
    //console.log('计算过程11111：：：：：：',item)
    if (eval(item) != (+answerContent)) {
      result = false
      info = item + ': 计算错误'
    }
  })(caculateArr)

  return { result, info }

}

//递归解析加法等式
function validAddEquation(data, map) {
  let dataArr = fp.split('+')(data)
  if (dataArr.length > 1) {
    fp.map((item, index) => {
      map.set(index, item)
    })(dataArr)
  }
}

//等式计算分离识别后数据中的列式和计算数据
function validSeparateData(data) {
  let columnarArr = []
  let caculateArr = []
  //console.log('validSeparateData ::::::::',data)
  fp.map((item) => {
    if (fp.split('=')(item).length > 1) {
      caculateArr.push(fp.split('=')(item)[1]) //去掉等号的列式
      return
    }
    columnarArr.push(item)
  })(data)
  return [columnarArr, caculateArr]
}

function validAddDelItem(data) {
  data = fp.filter((item) => {
    //过滤掉列式中带加减乘运算的item，方便诊断是否列式错误
    return (fp.split('+')(item).length <= 1)
  })(data)
  data = fp.filter((item) => {
    //过滤掉列式中带加减乘运算的item，方便诊断是否列式错误
    return (fp.split('-')(item).length <= 1)
  })(data)
  data = fp.filter((item) => {
    //过滤掉列式中带加减乘运算的item，方便诊断是否列式错误
    return (fp.split('x')(item).length <= 1)
  })(data)
  data = fp.filter((item) => {
    //过滤掉列式中带加减乘运算的item，方便诊断是否列式错误
    return (fp.split('×')(item).length <= 1)
  })(data)
  data = fp.filter((item) => {
    //过滤掉列式中带加减乘运算的item，方便诊断是否列式错误
    return (fp.split('÷')(item).length <= 1)
  })(data)
  return data
}

function vaildchengfaArr(arr) {
  //console.log('vaildchengfaArr',arr)
  let result = arr.map((item) => {
    if (item === 'X' || item === '×') {
      return 'x'
    }
    return item
  })
  //console.log('vaildchengfaArr result',result)
  return result
}


function vaildChufaArr(arr) {
  //console.log('vaildChufaArr:::::',arr)
  let temp = fp.map((item) => {
    if (item === '÷')
      return '/'
  })(arr)
  //console.log('vaildChufaArr result:::::',temp)
  return fp.map((item) => {
    if (item === '÷')
      return '/'
  })(arr)
}

//生成从minNum到maxNum的随机数
export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

//诊断上下三组一对一连线题1
export function diagnosisUpDownThreeConnect1Answer(data, answer) {
  if (data.length < 2) return false
  let answerArr = fp.split('#')(answer)
  //console.log('diagnosisUpDownThreeConnect1Answer answerArr',answerArr)
  //console.log('diagnosisUpDownThreeConnect1Answer data',data)
  if (data[0][0].join(',') != answerArr[0] || data[0][1].join(',') != answerArr[1]) {
    //数组第一个为上半边连线答案，第二个为下半边连线答案
    return false
  }
  return true
}

//诊断图片填空题——数字文字混合
export function diagnosisImgTextNumFillBlank(data, answerContent) {
  //console.log('diagnosisImgTextNumFillBlank data::::::::',data)
  let result = true
  let info = '正确'
  if (!Array.isArray(data)) {
    result = false
    info = '手写数据不为数组类型'
  }
  let answerContentArr = fp.split(',')(answerContent)
  for (let i = 0; i < data.length; i++) {
    if (data[i] != answerContentArr[i]) {
      result = false
      info = '错误:' + data[i]
      break
    }
  }
  return { result, info }
}
//获取字符串中img标签
export function getStrImg(data) {
  if (!data) return
  var imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
  if (!data.match(imgReg)) {
    return null
  }
  return data.match(imgReg)[0]
}
//获取字符串中img标签内src属性
export function getStrImgSrc(data) {
  if (!data) return
  var imgReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/gi;
  if (!data.match(imgReg)) {
    return null
  }
  return data.match(imgReg)[0]
}

//获取字符串中img标签内src属性的字符串
export function getStrImgSrcStr(data) {
  if (!data) return
  var imgReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/gi;
  let str = data.match(imgReg)
  if (!data.match(imgReg)) {
    return null
  }
  str = str[0].split('src=')[1]
  return str.replace(/\"/g, "")
}

//判断数学当前题型作答形式是否为在平板上作答
export function mathCompleteByPad(data) {
  if (!data) return false
  switch (data.name) {
    default:
      return false
  }
}

//判断语文当前题型作答形式是否为在平板上作答
export function yuwenCompleteByPad(data) {
  let result = false
  if (!data) return false
  switch (data.exercise_type_public) {
    case yuwenTypes.Gou_Xuan:
      result =  true
      break
    case yuwenTypes.YUE_DU:
      if(data.exercise_type_private === yuwenTypes.HUA_XIAN){
        // result =  true
      }
      break
    default:
      result = false
      break
  }
  return result
}

//诊断数学课桌图片-竖式计算题
export function diagnosisImgChufaVir(data, answer) {
  if (!data) return false
  if (data[data.length - 1][0][0] != answer) return false
  return true
}
//诊断数学课桌图片-竖式计算题-余数
export function diagnosisImgChufaVirYushu(data, answer) {
  answer = answer.replace('……', '......')
  let answerArr = answer.split('......')
  if (!data) return false
  if (data[data.length - 1][0][0] != answerArr[0]) return false
  if (answerArr.length > 1) {
    //console.log('MathVerticalIntDiv answerArr1',data[data.length-1][data[data.length-1].length-1][data[data.length-1][data[data.length-1].length-1].length-1])
    //console.log('MathVerticalIntDiv answerArr2',answerArr)
    if (data[data.length - 1][data[data.length - 1].length - 1][data[data.length - 1][data[data.length - 1].length - 1].length - 1] != answerArr[1]) return false
  }

  return true
}

//诊断数学课桌图片-竖式计算题-余数
export function diagnosisImgChufaVirYushuNew(data, answer) {
  console.log('diagnosisImgChufaVirYushuNew',data)
  answer = answer.replace('……', '......')
  data = data.replace('……', '......')
  if (!data) return false
  if (data != answer) return false
 
  return true
}

//解析语文连线题答案
export function parseYuwenOneConnectionAnswer(data) {
  let arr = fp.split('#')(data)[0]
  let arr1 = arr.replaceAll('；',';')
  let arr2 = arr1.replaceAll('，',',')
  let arr3 = fp.split(';')(arr2).join(',')
  return fp.split(',')(arr3)
}


//解析语文连线题答案
export function diagnosisYuwenLeftRightConnectAnswer(answer,data) {
  let dataNew = []
  console.log('answer data',data)
  let length = data.length
  data.map( (item,index)=>{
    dataNew.push(index+1)
    dataNew.push(item+length)
  })
  console.log('answer',answer)
  console.log('answer dataNew',dataNew)
  return answer.join('') === dataNew.join('')
}


//解析多个空填空题答案成数组——数学书包数与代数
export function parseAnswerFromMuchFillBlankSchoolBag(data) {
  let tempData = data.split(';')
  tempData = tempData.map((item)=>{
    return fp.split(',')(item).join('')
  })
  return tempData
}

 // 获取树的深度
 export function getTreeDeep(treeData){
  let arr = [];
  arr.push(treeData);
  let depth = 0;
  while (arr.length > 0) {
      let temp = [];
      for (let i = 0; i < arr.length; i++) {
          temp.push(arr[i]);
      }
      arr = [];
      for (let i = 0; i < temp.length; i++) {
          if (temp[i].children && temp[i].children.length > 0) {
              for (let j = 0; j < temp[i].children.length; j++) {
                  arr.push(temp[i].children[j]);
              }
          }
      }
      if (arr.length >= 0) {
          depth++;
      }
  }
  return depth;
}

//解析多个空填空题答案与作答的数量是否一致
export function parseAnswerFromMuchFillBlankNums(data,answer) {
  let tempData = data.split(';')
  let result  = true
  // console.log('parseAnswerFromMuchFillBlankNums answerLength',answer.split(' '))
  // console.log('parseAnswerFromMuchFillBlankNums tempData',tempData)
  tempData.forEach((item)=>{
    if(item.split(',').length != answer.trim().replace(/\s+/g, " ").split(' ').length){
      result = false
    }
  })
  return result
}

/**
 * 数学去0方法
 */
export function UppercaseTurnLowercaseDict(algebra_dict, relation_mat){
  let lower_case_dict = {}
  for(let key in algebra_dict){
      // 
      // console.log('key', key)
      lower_case_dict[key.toLowerCase()] = algebra_dict[key]
  }
  // console.log('lower_case_dict', lower_case_dict)
  // console.log('algebra_dict', algebra_dict)
  for (let idx=1;idx<relation_mat.length;idx++){
      if(relation_mat[idx][1] == 'x'){
          // 乘法判定
          // console.log('乘法判定')
          let multiplier1_str = (algebra_dict[relation_mat[idx][0]]).toString()
          let multiplier2_str = (algebra_dict[relation_mat[idx][2]]).toString()
          let product_str = (algebra_dict[relation_mat[idx][4]]).toString()
          // console.log('multiplier1_str', multiplier1_str, multiplier2_str, product_str)
          let digits1 = 0
          for (let jj=0;jj<multiplier1_str.length-1;jj++){
              let part_zero = 0
              for(let kk = jj+1;kk<multiplier1_str.length;kk++){
                  part_zero += parseInt(multiplier1_str[kk])
              }
              if (part_zero == 0){
                  // 
                  // console.log('找到全零位数', multiplier1_str.length-1-jj)
                  digits1 = multiplier1_str.length-1-jj
                  break
              }
          }
          let digits2 = 0
          for (let jj=0;jj<multiplier2_str.length-1;jj++){
              let part_zero = 0
              for(let kk = jj+1;kk<multiplier2_str.length;kk++){
                  part_zero += parseInt(multiplier2_str[kk])
              }
              if (part_zero == 0){
                  // 
                  // console.log('找到全零位数', multiplier2_str.length-1-jj)
                  digits2 = multiplier2_str.length-1-jj
                  break
              }
          }
          if((digits1+digits2)>0){
              lower_case_dict[relation_mat[idx][0].toLowerCase()] = 
                      parseInt(multiplier1_str.substring(0,multiplier1_str.length-digits1))
              lower_case_dict[relation_mat[idx][2].toLowerCase()] = 
                      parseInt(multiplier2_str.substring(0,multiplier2_str.length-digits2))
              lower_case_dict[relation_mat[idx][4].toLowerCase()] = parseInt(product_str.substring(0,product_str.length-digits1-digits2))
          }
      }
      else if(relation_mat[idx][1] == '÷'){
          // 除法判定
          // console.log('除法判定')
          let dividend_str = (algebra_dict[relation_mat[idx][0]]).toString()
          let divisor_str = (algebra_dict[relation_mat[idx][2]]).toString()
          let consult_str = (algebra_dict[relation_mat[idx][4]]).toString()
          // console.log('consult_str', consult_str)
          // 被除数
          let dividend_digits = 0
          for (let jj=0;jj<dividend_str.length-1;jj++){
              let part_zero = 0
              for(let kk = jj+1;kk<dividend_str.length;kk++){
                  part_zero += parseInt(dividend_str[kk])
              }
              if (part_zero == 0){
                  // 
                  // console.log('找到全零位数', consult_str.length-1-jj)
                  dividend_digits = dividend_str.length-1-jj
                  break
              }
          }
          // 除数 
          let divisor_digits = 0
          for (let jj=0;jj<divisor_str.length-1;jj++){
              let part_zero = 0
              for(let kk = jj+1;kk<divisor_str.length;kk++){
                  part_zero += parseInt(divisor_str[kk])
              }
              if (part_zero == 0){
                  // 
                  // console.log('找到全零位数', divisor_str.length-1-jj)
                  divisor_digits = divisor_str.length-1-jj
                  break
              }
          }
          // 商
          let consult_digits = 0
          for (let jj=0;jj<consult_str.length-1;jj++){
              let part_zero = 0
              for(let kk = jj+1;kk<consult_str.length;kk++){
                  part_zero += parseInt(consult_str[kk])
              }
              if (part_zero == 0){
                  // 
                  // console.log('找到全零位数', consult_str.length-1-jj)
                  consult_digits = consult_str.length-1-jj
                  break
              }
          }
          console.log('各数0数',dividend_digits,divisor_digits,consult_digits)
          // if(digits>0){

          //     if(parseInt(dividend_str.substring(0,dividend_str.length-1))*Math.pow(10,digits) == parseInt(dividend_str)){
          //         // console.log('符合要求')
          lower_case_dict[relation_mat[idx][0].toLowerCase()] = 
                      parseInt(dividend_str.substring(0,dividend_str.length-(divisor_digits+consult_digits)))
          lower_case_dict[relation_mat[idx][2].toLowerCase()] = 
                      parseInt(divisor_str.substring(0,divisor_str.length-divisor_digits))
          lower_case_dict[relation_mat[idx][4].toLowerCase()] = 
                      parseInt(consult_str.substring(0,consult_str.length-consult_digits))
          //     }
          // }
      }
      // console.log('lower_case_dict', lower_case_dict)
  }
  return lower_case_dict
}

// 数学防抖时间
export function getDebounceTime(){
  return 300
}


