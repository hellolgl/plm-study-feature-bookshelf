
import * as actionCreators from "../../../../action/math/bag/index";
import topaicTypes from '../../../../res/data/MathTopaicType'
const TIP_MAP = {
    '文字填空题-多个空数字':'多个答案中间用一个逗号隔开。',   //文字填空题-多个空数字
    '图片填空题-多个空数字':'按从上到下，从左到右的顺序依次填写答案，多个答案中间用一个逗号隔开。',    //图片填空题-多个空数字
    '等式计算题':'需要写出计算过程，不能直接写答案，不要忘记等号哟。',     //等式计算题
    '文字填空题-填运算符号':'多个答案中间用一个逗号隔开。',     //文字填空题-填运算符号
    '文字填空题-填数字':'多个答案中间用一个逗号隔开。',     //文字填空题-填数字
    '文字填空题-分数的拆分':'多个答案中间用一个逗号隔开。'
}

export function changeTopicData(item,expand_name){
    item.tip = TIP_MAP[item.exercise_type_name]?TIP_MAP[item.exercise_type_name]:null
    item.name = item.exercise_type_name
    item.btnArr = actionCreators.getCheckBtnArr(item)
    if(item.topic_type === '1'){
        // 分数
        item.exercise_stem?item.exercise_stem= JSON.parse(item.exercise_stem):null
        item.exercise_meaning?item.exercise_meaning = JSON.parse(item.exercise_meaning):null
        item.exercise_thinking?item.exercise_thinking =JSON.parse(item.exercise_thinking):null
        item.exercise_method?item.exercise_method =JSON.parse(item.exercise_method):null
        item.right_answer?item.right_answer =JSON.parse(item.right_answer):null
        item.exercise_explanation?item.exercise_explanation =JSON.parse(item.exercise_explanation):null
        item.choice_content?item.choice_content =actionCreators.fractionChangeChioce(item.choice_content):null
    }else{
        item._stem =  item.exercise_stem.replace(/<\/?p[^>]*>/gi,'')
    }
    // 诊断用
    item.data_type = item.topic_type === '0'?'ZS':'FS'
    item.answer_content = item.right_answer
    // 统一加题干提示
    if(item.name === topaicTypes.Equation_Calculation) item.stem_tips = '（需要写计算过程）'
    if(item.name === topaicTypes.Oral_Arithmetic) item.stem_tips = '（直接写结果）'
    let name = expand_name?expand_name:item.expand_name
    if(item.exercise_type_name === topaicTypes.Text_One_Num_Fill_Blank && topaicTypes.EasyCalculation_Type_Needtips_Arr.indexOf(name) > -1 ) item.stem_tips = '（直接写结果）'
    return item
}