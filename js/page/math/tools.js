
import topaicTypes from '../../res/data/MathTopaicType'
import { replaceData } from '../../util/tools'

export function changeTopicData(data, modular) {
  // 字段以同步诊断的字段为基础
  if (modular === 'desk') {
    // 课桌的数据处理
    data.displayed_type_name = data.displayed_type
    data.public_exercise_stem = data.exercise_stem
    data.public_exercise_image = data.exercise_stem_image
    data.exercise_type_name = data.exercise_type
    data.m_e_s_id = data.exercise_id   //需要键盘输入的题目需要m_e_s_id字段重新渲染
  }
  if (modular === 'KnowledgeGraph') {
    // 知识图谱题目数据处理
    data.displayed_type_name = data.displayed_type
    data.public_exercise_stem = data.exercise_stem
    data.exercise_type_name = data.exercise_type
    data.m_e_s_id = data.ex_id
  }
  if(modular === 'easyCalculation'){
    // 巧算题目数据处理
    if(data.topic_type === '0'){
      //  整数
      data.exercise_data_type = 'ZS'
    }else{
      //  分数
      data.exercise_data_type = 'FS'
    }
    data.public_exercise_stem = data.exercise_stem
    data.public_exercise_image = data.exercise_stem_img
    data.answer_content = data.right_answer
    data.knowledgepoint_explanation_image = data.exercise_explanation_img
    if(data.exercise_data_type === 'FS') {
      data.needSpellExplains = 'qs'  //巧算的分数解析需要拼起来
    }else{
      data.knowledgepoint_explanation = data.exercise_explanation
    }
    data.problem_solving = data.exercise_thinking
    const {exercise_type_name} = data
    if(exercise_type_name === topaicTypes.Text_Much_Operation_Symbol || exercise_type_name === topaicTypes.Clever_Calculation_24){
      // 文字填空题-填运算符号
      data.showKeyBoardSymbol = true
    }
    data.m_e_s_id = data.e_c_id
  }
  if (data.displayed_type_name === topaicTypes.Fill_Blank) {
    // 填空题数据处理
    const { public_exercise_stem } = data
    let my_answer_tk_map = {}
    let stem_tk = []
    data.my_answer_tk_map = my_answer_tk_map
    data.stem_tk = stem_tk
    if (data.exercise_data_type === 'FS') {
      data.stem_tk = isJSON(public_exercise_stem) ? JSON.parse(public_exercise_stem) : []   //没有校对翻译的题目可能格式不是Json
      data.stem_tk.forEach((i, x) => {
        i.forEach((ii, xx) => {
          if (!Array.isArray(ii) && ii.replace(/\s*/g, "").toLowerCase() === 'k') {
            data.stem_tk[x][xx] = ii.replace(/\s*/g, "").toLowerCase()
            let key = `${x}${xx}`
            if (!data._answer_tk_key) data._answer_tk_key = key
            my_answer_tk_map[key] = {
              init_char_mat: [],
              cursor_idx: -1
            }
          }
          if (Array.isArray(ii)) {
            ii.forEach((iii, xxx) => {
              if (iii === 'k') {
                let key = `${x}${xx}${xxx}`
                my_answer_tk_map[key] = {
                  init_char_mat: [],
                  cursor_idx: -1
                }
              }
            })
          }
        })
      })
    } else {
      public_exercise_stem.split('\n').forEach((i, x) => {
        stem_tk.push(i)
        stem_tk[x] = i.split('#')
        stem_tk[x].forEach((ii, xx) => {
          if (ii.replace(/\s*/g, "").toLowerCase() === 'k') {
            stem_tk[x][xx] = ii.replace(/\s*/g, "").toLowerCase()
            let key = `${x}${xx}`
            if (!data._answer_tk_key) data._answer_tk_key = key
            my_answer_tk_map[key] = {
              init_char_mat: [],
              cursor_idx: -1
            }
          }
        })
      })
    }
    if (data.answer) {
      // 已经做过保存了的题
      data.my_answer_tk_map = JSON.parse(data.answer)
    }
  }
  if (data.displayed_type_name === topaicTypes.Fill_Blank || data.displayed_type_name === topaicTypes.Calculation_Problem || data.displayed_type_name === topaicTypes.Application_Questions) {

    data._show_keyBoard = true
    if (data.displayed_type_name === topaicTypes.Calculation_Problem || data.displayed_type_name === topaicTypes.Application_Questions) {
      // 计算题,应用题不论分数整数题型都要加这个
      if (data.answer) {
        // 已经做过保存了的题
        data.my_answer_tk_map = JSON.parse(data.answer)
      } else {
        data.my_answer_tk_map = {
          0: {
            init_char_mat: [],
            cursor_idx: -1
          }
        }
      }
    }
  }
  if (data.displayed_type_name === topaicTypes.Multipl_Choice || data.displayed_type_name === topaicTypes.Compare_Size || data.displayed_type_name === topaicTypes.Judegment) {
    data._show_options = true
  }
  if (data.exercise_data_type === 'FS') {
    data.answer_content ? data.answer_content = JSON.parse(data.answer_content) : null
    if (!isJSON(data.knowledgepoint_explanation)) {
      //没有校对翻译的题目可能格式不是Json
      data.knowledgepoint_explanation = ''
    } else {
      data.knowledgepoint_explanation = JSON.parse(data.knowledgepoint_explanation)
    }
    if (!isJSON(data.problem_solving)) {
      data.problem_solving = ''
    } else {
      data.problem_solving = JSON.parse(data.problem_solving)
    }
    if (!isJSON(data.public_exercise_stem)) {
      data._exercise_stem = ''
    } else {
      data._exercise_stem = JSON.parse(data.public_exercise_stem)
    }
    // 巧算确定方法
    if(!isJSON(data.exercise_method)){
      data.exercise_method = ''
    }else{
      data.exercise_method = JSON.parse(data.exercise_method)
    }
    // 巧算理解题意
    if(!isJSON(data.exercise_meaning)){
      data.exercise_meaning = ''
    }else{
      data.exercise_meaning = JSON.parse(data.exercise_meaning)
    }
    data.choice_content ? data.choice_content = fractionChangeChioce(data.choice_content) : null
  } else {
    data._exercise_stem = data.public_exercise_stem
    if (data.displayed_type_name === topaicTypes.Calculation_Problem) {
      // 计算题老题题干需要去掉富文本标签
      data._exercise_stem = replaceData(data.public_exercise_stem)
    }
  }
  data._diagnosis_name = data.exercise_type_name
  if (data.answer) data._my_answer = data.answer
  return data
}

export function initTopicData(data) {
  if (data.my_answer_tk_map) {
    // 填空题
    for (let i in data.my_answer_tk_map) {
      data.my_answer_tk_map[i] = {}
      data.my_answer_tk_map[i].init_char_mat = []
      data.my_answer_tk_map[i].cursor_idx = -1
    }
  }
  data._my_answer && delete data._my_answer   //选择题选了答案但是没有提交会有这个数据

  return data
}

// 分数选项方法
export const fractionChangeChioce = (choice_content) => {
  let _choice_content = choice_content.split('#')
  _choice_content.forEach((i, index) => {
    _choice_content[index] = JSON.parse(i)
  })
  return _choice_content
}

// 判断是否为Json
export const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!')
}

// 有翻译题目数据处理
export const selectTopicData = (v, language_data) => {
  const { type } = language_data
  let data = JSON.parse(JSON.stringify(v))
  data.zh = changeTopicData(data.zh, 'KnowledgeGraph')
  if (data.language) {
    // 有翻译
    data.language.exercise_type = v.zh.exercise_type
    data.language.displayed_type = v.zh.displayed_type
    data.language.exercise_data_type = v.zh.exercise_data_type
    data.language.answer_content = v.zh.answer_content
    data.language = changeTopicData(data.language, 'KnowledgeGraph')
    data.language.displayed_type = v.language.displayed_type  //恢复翻译
  } else {
    data.language = {}
  }
  // console.log('____________', data)
  let { zh, language, answer } = data
  let topic_data = {}
  if (type === 1 || type === 3) {
    // 中英  中
    topic_data = zh
    topic_data.displayed_type_name_z = zh.displayed_type
    topic_data.displayed_type_name_c = language.displayed_type
    topic_data._exercise_stem_c = language._exercise_stem
    topic_data.choice_content_c = language.choice_content
    topic_data.knowledgepoint_explanation_c = language.knowledgepoint_explanation
    topic_data.problem_solving_c = language.problem_solving
    topic_data.stem_tk_c = language.stem_tk
    topic_data.public_exercise_image_c = language.public_exercise_image
    topic_data.problem_solving_image_c = language.problem_solving_image
    topic_data.knowledgepoint_explanation_image_c = language.knowledgepoint_explanation_image
  }
  if (type === 2 || type === 4) {
    // 英中  英
    topic_data = language
    topic_data.displayed_type_name_z = language.displayed_type
    topic_data.displayed_type_name_c = zh.displayed_type
    topic_data._exercise_stem_c = zh._exercise_stem
    topic_data.choice_content_c = zh.choice_content
    topic_data.knowledgepoint_explanation_c = zh.knowledgepoint_explanation
    topic_data.problem_solving_c = zh.problem_solving
    topic_data.stem_tk_c = zh.stem_tk
    topic_data.public_exercise_image_c = zh.public_exercise_image
    topic_data.problem_solving_image_c = zh.problem_solving_image
    topic_data.knowledgepoint_explanation_image_c = zh.knowledgepoint_explanation_image
  }
  topic_data._is_translate = true
  if ((topic_data.displayed_type_name === topaicTypes.Calculation_Problem || topic_data.displayed_type_name === topaicTypes.Fill_Blank) && answer) {
    // 已经作答保存了的用了键盘的题
    topic_data.my_answer_tk_map = JSON.parse(answer)
  }
  if (answer) topic_data._my_answer = answer
  return topic_data
}