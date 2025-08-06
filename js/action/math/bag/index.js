import * as constants from './types';
import { fromJS } from 'immutable';
import axios from '../../../util/http/axios';
import { UppercaseTurnLowercaseDict } from '../../../util/commonUtils'
import topaicTypes from '../../../res/data/MathTopaicType'
import MathTipType from '../../../res/data/MathTipType'
import { ExtendClassifyCls } from '../../../util/MathExtendClass'

export const changePage = (topaic, currentTopaicData, topaicNum, yinDaoArr, alphabetValue, variableValue, needTree) => ({
    type: constants.GET_TOPAIC,
    topaci: fromJS(topaic),
    currentTopaicData: fromJS(currentTopaicData),
    topaicNum,
    yinDaoArr: fromJS(yinDaoArr),//当前题目引导数量
    alphabetValue: fromJS(alphabetValue),
    variableValue: fromJS(variableValue),
    needTree: fromJS(needTree)
});

// res.data.data.exercise:基础学习、同步学习错题集的基础学习,res.data.data.data:同步学习
export const getTopaic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let list = res.data.data.exercise ? res.data.data.exercise : res.data.data.data
                let exercise_set_id = res.data.data.exercise_set_id
                let exercise_category = res.data.data.exercise_category
                // console.log("99999999999999999999999999999999999999999999999999",list)
                // return
                let index = 0
                for (let i = 0; i < list.length; i++) {
                    list[i].exercise_set_id = exercise_set_id
                    list[i].exercise_category = exercise_category
                    if (list[i].exercise_done == 0) {
                        index++
                        if (list[i].correction == 0) {
                            list[i].colorFlag = 1
                        } else {
                            list[i].colorFlag = 2
                        }
                    }
                    list[i] = normalTopicChange(list[i])
                }
                let yinDaoArr = []

                if (list[index] && list[index].equation_distribution && list[index].equation_distribution != '') {
                    yinDaoArr = list[index].equation_distribution.split(',')
                }
                console.log('redux getTopaic ', data)
                dispatch(changePage(list, list[index], index, yinDaoArr, {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

// 需要调整题干图片字段的处理
export const steamImageChange = (data) => {
    if (data.public_exercise_stem) {
        data.public_exercise_image = data.public_exercise_image
    }
    if (data.private_exercise_stem) {
        data.private_exercise_image = data.public_exercise_image
    }
    if (data.exercise_stem) {
        data.exercise_stem_image = data.public_exercise_image
    }
    data.public_exercise_image = ''
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

export const changeCurrentTopaic = (currentTopaicData, topaicIndex, yinDaoArr) => {
    console.log(currentTopaicData, 'changeCurrentTopaic')
    return (
        {
            type: constants.CHANGE_CURRENT_TOPAIC,
            currentTopaicData: fromJS(currentTopaicData),
            topaicNum: topaicIndex,
            yinDaoArr: fromJS(yinDaoArr)
        })
}

export const changeTopaiclistColorFlag = (topaiclist) => {
    //console.log(topaiclist,'changeTopaiclistColorFlag')
    return {
        type: constants.CHANGE_TOPAIC_LIST_COLOR_FLAG,
        topaci: fromJS(topaiclist),
    }
}

export const changeTopaicIndex = (topaicIndex) => {
    //console.log('changeTopaicIndex',topaicIndex)
    return {
        type: constants.CHANGE_TOPAIC_LIST_INDEX,
        topaicNum: topaicIndex,
    }

}

export const initRedux = () => {
    return {
        type: constants.INIT_REDUX,
        topaci: fromJS([]),
        currentTopaicData: fromJS({}),
        topaicNum: 0
    }
}

export const setMathTextBook = (textBookCode) => {
    console.log('setMathTextBook::', textBookCode)
    return (
        {
            type: constants.SET_MATH_TEXT_BOOK,
            textBookCode: textBookCode
        })
}

//同步应用题 拓展应用题学习 拓展应用题练习 π计划同步应用 π计划拓展应用
export const getTopaicMathAuto = (api, data, isApplicaPai, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let list = []
                let exercise_set_id = ''
                let exercise_category = ''
                let category = ''
                if (isApplicaPai) {
                    // list = res.data.data.practical_exercise.data
                    // exercise_set_id = res.data.data.practical_exercise.exercise_set_id
                    // category = res.data.data.category //π计划用来判断推的是否是错题
                    let expand_exercise = res.data.data.expand_exercise
                    let practical_exercise = res.data.data.practical_exercise ? res.data.data.practical_exercise : {}   //只有拓展应用题方向的时候没有应用题
                    let expandList = []
                    let practicalList = []
                    expand_exercise.forEach((i, index) => {
                        i.data.forEach((j, indexJ) => {
                            i.data[indexJ].exercise_set_id = i.exercise_set_id
                            expandList.push(j)
                        })
                    })
                    if (practical_exercise.data) {
                        practical_exercise.data.forEach((i, index) => {
                            practical_exercise.data[index].exercise_set_id = practical_exercise.exercise_set_id
                            practicalList.push(i)
                        })
                    }
                    list = practicalList.concat(expandList)
                } else {
                    list = res.data.data.data
                    exercise_set_id = res.data.data.exercise_set_id
                    exercise_category = res.data.data.exercise_category
                    category = res.data.data.category
                    list.forEach((i, index) => {
                        list[index].exercise_set_id = exercise_set_id
                        list[index].exercise_category = exercise_category
                        list[index].category = category    //π计划用来判断推的是否是错题
                    })
                }
                // console.log('____________________________________',list)
                // return
                let index = 0
                for (let i = 0; i < list.length; i++) {
                    if (list[i].exercise_done == 0) {
                        index++
                        if (list[i].correction == 0) {
                            list[i].colorFlag = 1
                        } else {
                            list[i].colorFlag = 2
                        }
                    }
                    list[i].name = list[i].name ? list[i].name : list[i].exercise_type
                    list[i].tip = MathTipType[list[i].name] ? MathTipType[list[i].name] : ''
                    !list[i].category ? list[i].answer_content_beforeChange = list[i].answer_content : list[i].answer_content_beforeChange = list[i].right_answer  //π计划的错题才有category
                    if (list[i].choice_txt && list[i].choice_txt !== '""') {
                        let unitArr = list[i].choice_txt.split('#').map((item) => {
                            return { value: item, key: item }
                        })
                        list[i].unitArr = shuffle(unitArr)
                    }
                    if (list[i].alphabet_value) {
                        if (list[i].category) keyArr = list[i].alphabet_value = list[i].alphabet_value[0]
                        let keyArr = Object.keys(list[i].alphabet_value)
                        list[i] = fileterAutoItem(keyArr, list[i], list[i].alphabet_value)
                    } else {
                        // 拿到死题的数据处理
                        list[i] = fileterItem(list[i])
                    }
                }
                let yinDaoArr = []
                if (list[index] && list[index].equation_distribution && list[index].equation_distribution.length > 0) {
                    yinDaoArr = [...list[index].equation_distribution]
                }
                let firstAlphabetValue = {}
                let firstVariableValue = {}
                let firstNeedTree = {}
                if (list.length > 0) {
                    firstAlphabetValue = list[0].alphabet_value
                    firstVariableValue = list[0].variable_value
                    firstNeedTree = list[0].need_tree
                }
                console.log('redux getTopaic ', list)
                dispatch(changePage(list, list[index], index, yinDaoArr, firstAlphabetValue, firstVariableValue, firstNeedTree));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

// 数组去重
const unique = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i].value === arr[j].value) {
                arr.splice(j, 1)
                j--
            }
        }
    }
    return arr
}

// 随机从数组中取几个值
function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

// 死题数据处理
export const fileterItem = (data) => {
    if (data.exercise_data_type === 'FS') {
        if (data.equation_exercise) {
            data.equation_exercise = changeStr(data.equation_exercise)
            data.equation_exercise = JSON.parse(data.equation_exercise)
        }
        data.public_exercise_stem ? data.public_exercise_stem = JSON.parse(data.public_exercise_stem) : null
        data.private_exercise_stem ? data.private_exercise_stem = JSON.parse(data.private_exercise_stem) : null
        data.exercise_stem ? data.exercise_stem = JSON.parse(data.exercise_stem) : null
        data.answer_content = JSON.parse(data.answer_content)
        data.knowledgepoint_explanation ? data.knowledgepoint_explanation = JSON.parse(data.knowledgepoint_explanation) : null
        data.problem_solving ? data.problem_solving = JSON.parse(data.problem_solving) : null

        // 拓展应用题死题
        data.answer_explanation ? data.answer_explanation = JSON.parse(data.answer_explanation) : null
        data.equation_list ? data.equation_list = JSON.parse(data.equation_list) : null
        data.exercise_explanation ? data.exercise_explanation = JSON.parse(data.exercise_explanation) : null
        data.exercise_thinking ? data.exercise_thinking = JSON.parse(data.exercise_thinking) : null
        data.method ? data.method = JSON.parse(data.method) : null
        data.understand ? data.understand = JSON.parse(data.understand) : null
        data.correct_answer ? data.correct_answer = JSON.parse(data.correct_answer) : null

    }
    return data
}


//过滤智能题未知数
export const fileterAutoItem = (list, data, alphabetValue) => {
    // 分数逻辑
    if (data.exercise_data_type === 'FS' || data.data_type === 'FS') {
        data.private_exercise_stem ? data.private_exercise_stem = fractionVariableTrans(data.private_exercise_stem.split('\n'), list, alphabetValue) : null
        data.answer_explanation ? data.answer_explanation = fractionVariableTrans(data.answer_explanation.split('\n'), list, alphabetValue) : null
        data.method ? data.method = fractionVariableTrans(data.method.split('\n'), list, alphabetValue) : null
        data.problem_solving ? data.problem_solving = fractionVariableTrans(data.problem_solving.split('\n'), list, alphabetValue) : null
        data.understand ? data.understand = fractionVariableTrans(data.understand.split('\n'), list, alphabetValue) : null
        data.exercise_thinking ? data.exercise_thinking = fractionVariableTrans(data.exercise_thinking.split('\n'), list, alphabetValue) : null
        if (data.category) {
            // π计划推的错题
            data.exercise_stem ? data.exercise_stem = JSON.parse(data.exercise_stem) : null
            data.answer_content ? data.answer_content = JSON.parse(data.answer_content) : null
        } else {
            list.forEach((item) => {
                if (data.answer_content[0] === item) {
                    data.answer_content = data.alphabet_value[item][1]
                }
            })
        }
    } else {
        // 分数外逻辑
        list.forEach((item) => {
            // alphabetValue[item][1]存在表示是整数外的类型
            data.method ? data.method = data.method.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
            data.answer_explanation ? data.answer_explanation = data.answer_explanation.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
            data.understand ? data.understand = data.understand.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
            data.private_exercise_stem = data.private_exercise_stem ? data.private_exercise_stem.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
            data.problem_solving ? data.problem_solving = data.problem_solving.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
            if (data.answer_content) {
                if (data.answer_content[0] === item && Array.isArray(alphabetValue[item])) {
                    data.answer_content = data.alphabet_value[item][1][0]
                } else {
                    data.answer_content = data.answer_content.replaceAll(item + '', alphabetValue[item])
                }
            }
            data.exercise_thinking ? data.exercise_thinking = data.exercise_thinking.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : null
        })
    }
    data.variable_value ? data.unitArr = getUnitArr(data.variable_value) : null
    return data
}

// 分数应用题变量替换
export const fractionChangeVariable = (value, keyList, alphabetValue) => {
    value.forEach((i, index) => {
        keyList.forEach((j, indexj) => {
            if (i === j) {
                value[index] = alphabetValue[i][1]
            }
        })
    })
    return value
}

// 分数应用题变量替换第一步
export const fractionVariableTrans = (value, keyList, alphabetValue) => {
    value.forEach((i, index) => {
        value[index] = fractionChangeVariable(i.split('#'), keyList, alphabetValue)
    })
    return value
}

export const changeAlphabetValue = (alphabetValue, variableValue, needTree) => {
    console.log('change AlphabetValue', alphabetValue)
    return (
        {
            type: constants.CHANGE_ALPHABET_VALUE,
            alphabetValue: fromJS(alphabetValue),
            variableValue: fromJS(variableValue),
            needTree: fromJS(needTree),

        })
}

//同步计算题
export const getAutoCalTopaic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                // console.log('*******************',JSON.parse(JSON.stringify( res.data.data.data)))
                // return
                let list = filterAutoCalTopaic(res.data.data)
                let index = 0
                console.log('redux getTopaic ', list)
                dispatch(changePage(list, list[index], index, [], {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};


//数学书包B计划计算方向拿题
export const getPaiCalTopaic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let list = filterAutoCalTopaic(res.data.data.cal_exercise)
                let index = 0
                console.log('redux getTopaic ', list)
                dispatch(changePage(list, list[index], index, [], {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

//π计划同步计算拿题
export const getSpecialImproveCalTopaic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let list = res.data.data.data
                // console.log('2222222222222222222',list)
                // return
                if (res.data.data.category) {
                    // console.log('错题数据处理')
                    list.forEach((i, index) => {
                        list[index] = wrongAiTopicChange(list[index])
                        list[index].category = res.data.data.category
                    })
                } else {
                    list = filterAutoCalTopaicSpecialImprove(res.data.data)
                }
                let index = 0
                console.log('redux getTopaic ', list)
                dispatch(changePage(list, list[index], index, [], {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

function filterAutoCalTopaic(value) {
    let finalData = {}
    let finalDataList = []
    value.data.forEach((item) => {
        item.name ? null : item.name = item.exercise_type
        item.tip = MathTipType[item.name] ? MathTipType[item.name] : ''
        item.btnArr = getCheckBtnArr(item)

        finalData = { ...item }
        item.alphabet_value.forEach((element, index) => {
            let tempFinalData = { ...finalData }
            tempFinalData.alphabet_value = element
            tempFinalData.exercise_set_id = value.exercise_set_id
            fileterAutoCalItem(Object.keys(element), tempFinalData, element)
            if (item.name === topaicTypes.Than_Size) {
                let _alphabet_value_ = item.alphabet_value_[index] ? item.alphabet_value_[index] : item[0]
                tempFinalData.alphabet_value_ = _alphabet_value_
                fileterAutoCalItemThanSize(Object.keys(_alphabet_value_), tempFinalData, _alphabet_value_)
            }
            // console.log('finalData',tempFinalData)
            finalDataList.push({ ...tempFinalData })
        })

    })
    return finalDataList
}

function filterAutoCalTopaicSpecialImprove(value) {
    let finalData = {}
    let finalDataList = []
    value.data.forEach((item) => {
        item.name ? null : item.name = item.exercise_type
        item.tip = MathTipType[item.name] ? MathTipType[item.name] : ''
        item.btnArr = getCheckBtnArr(item)
        finalData = { ...item }
        item.alphabet_value.forEach((element, index) => {
            let tempFinalData = { ...finalData }
            tempFinalData.alphabet_value = element
            tempFinalData.exercise_set_id = value.exercise_set_id
            tempFinalData.category = value.category
            fileterAutoCalItem(Object.keys(element), tempFinalData, element)
            if (item.name === topaicTypes.Than_Size) {
                let _alphabet_value_ = item.alphabet_value_[index] ? item.alphabet_value_[index] : item[0]
                tempFinalData.alphabet_value_ = _alphabet_value_
                fileterAutoCalItemThanSize(Object.keys(_alphabet_value_), tempFinalData, _alphabet_value_)
            } else {
                // let arr = tempFinalData.choice_item?tempFinalData.choice_item[0]:[]
                // tempFinalData._choice_content = tempFinalData.answer_content.concat(arr).sort(sortNumber)
            }
            // console.log('finalData',tempFinalData)

            finalDataList.push({ ...tempFinalData })
        })

    })
    return finalDataList
}

//过滤智能题未知数
function fileterAutoCalItem(list, data, alphabetValue) {
    // console.log('fileterAutoCalItem',data)
    // console.log('fileterAutoCalItem alphabetValue',alphabetValue)
    // console.log('fileterAutoCalItem list',list)
    if (data.exercise_data_type === 'FS') {
        // 分数逻辑
        let exercise_stem = data.exercise_stem ? data.exercise_stem.split('') : []
        exercise_stem.forEach((i, index) => {
            list.forEach((j, indexj) => {
                if (i === j) {
                    if (!data.answer_content.includes(j)) {
                        exercise_stem[index] = alphabetValue[i][1]
                    } else {
                        exercise_stem[index] = ' (  ) '
                    }
                }
            })
        })
        list.forEach((item) => {
            data.compare = data.compare && data.compare.length > 0 ? data.compare = alphabetValue[item][1] : ''
            data.understand = data.understand ? data.understand.replaceAll(item + '', alphabetValue[item][1]) : ''
            data.problem_solving = data.problem_solving ? data.problem_solving.replaceAll(item + '', alphabetValue[item][1]) : ''
            if (data.answer_content[0] === item) {
                data.answer_content = data.alphabet_value[item][1]
            }
        })
        data.exercise_stem = [exercise_stem]
    } else {
        // 分数外的类型
        list.forEach((item) => {
            if (!data.answer_content.includes(item)) {
                data.exercise_stem = data.exercise_stem ? data.exercise_stem.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : ''
            } else {
                data.exercise_stem = data.exercise_stem ? data.exercise_stem.replaceAll(item + '', ' (  ) ') : ''
            }
            data.compare = data.compare && data.compare.length > 0 ? data.compare[0].replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : ''
            data.understand = data.understand ? data.understand.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : ''
            data.problem_solving = data.problem_solving ? data.problem_solving.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item]) : ''
            if (data.name != '比较大小填空题' || data.exercise_type != '比较大小填空题') {
                data.answer_content = data.answer_content ? data.answer_content.map((element) => {
                    return element.replaceAll(item + '', Array.isArray(alphabetValue[item]) ? alphabetValue[item][1] : alphabetValue[item])
                }) : ''
            }

        })
    }
    data.lower_case_dict = UppercaseTurnLowercaseDict(alphabetValue, data.triadic_relation)
    Object.keys(data.lower_case_dict).forEach((item) => {
        data.understand = data.understand ? data.understand.replaceAll(item + '', data.lower_case_dict[item]) : ''
    })
    return data
}

//过滤智能题未知数(比较大小填空题)
function fileterAutoCalItemThanSize(list, data, alphabetValue) {
    if (data.exercise_data_type === 'FS' || data.data_type === 'FS') {
        let exercise_stem_ = data.exercise_stem_ ? data.exercise_stem_.split('') : []
        exercise_stem_.forEach((i, index) => {
            list.forEach((j, indexj) => {
                if (i === j) {
                    if (!data.answer_content.includes(j)) {
                        exercise_stem_[index] = alphabetValue[i][1]
                    } else {
                        exercise_stem_[index] = ' (  ) '
                    }
                }
            })
        })
        data.compare_ = data.compare_ && data.compare_.length > 0 ? data.compare_ = alphabetValue[data.compare_[0]][1] : null
        data.exercise_stem_ = [exercise_stem_]
        let num1 = data.compare[0] / data.compare[1]
        let num2 = data.compare_[0] / data.compare_[1]
        // console.log('33333333333333333333333333',num1,num2)
        if (num1 - num2 > 0) {
            data.answer_content = '＞'
        } else if (data.compare - data.compare_ == 0) {
            data.answer_content = '＝'
        } else {
            data.answer_content = '＜'
        }
    } else {
        list.forEach((item) => {
            data.exercise_stem_ = data.exercise_stem_ ? data.exercise_stem_.replaceAll(item + '', alphabetValue[item]) : ''
            data.compare_ = data.compare_ && data.compare_.length > 0 ? data.compare_[0].replaceAll(item + '', alphabetValue[item]) : ''
        })
        data.exercise_stem_change = data.exercise_stem + ' 〇 ' + data.exercise_stem_
        if (data.compare - data.compare_ > 0) {
            data.answer_content = '＞'
        } else if (data.compare - data.compare_ == 0) {
            data.answer_content = '＝'
        } else {
            data.answer_content = '＜'
        }
    }
    return data
}

export const changeYindaoCurrentTopaic = (currentTopaicData) => {
    return (
        {
            type: constants.CHANGE_YINDAO_CURRENT_TOPAIC,
            currentTopaicData: fromJS(currentTopaicData),
        })
}

export const getSpecailImproveTopaic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let list = res.data.data.data
                let exercise_set_id = res.data.data.exercise_set_id
                let category = res.data.data.category   //有代表是错题
                let index = 0
                for (let i = 0; i < list.length; i++) {
                    res.data.data.exercise_set_id ? list[i].exercise_set_id = exercise_set_id : null
                    list[i].category = category
                    if (list[i].exercise_done == 0) {
                        index++
                        if (list[i].correction == 0) {
                            list[i].colorFlag = 1
                        } else {
                            list[i].colorFlag = 2
                        }
                    }
                    list[i] = normalTopicChange(list[i])
                }
                let yinDaoArr = []
                if (list[index].equation_distribution && list[index].equation_distribution != '') {
                    // yinDaoArr = list[index].equation_distribution.split(',')
                    yinDaoArr = list[index].equation_distribution
                }
                console.log('redux getTopaic ', data)
                dispatch(changePage(list, list[index], index, yinDaoArr, {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

export const getSpecailImproveTopaicBase = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let data = res.data.data.data
                let category = res.data.data.category
                let exercise_set_id = res.data.data.exercise_set_id
                let list = []
                let exercise_set_id_key = Object.keys(data)
                let index = 0
                if (category) {
                    list = res.data.data.data
                    list.forEach((i, index) => {
                        i.exercise_set_id = exercise_set_id
                        i.category = category
                        if (i.exercise_done == 0) {
                            index++
                            if (i.correction == 0) {
                                i.colorFlag = 1
                            } else {
                                i.colorFlag = 2
                            }
                        }
                        i = normalTopicChange(i)
                        if (index === list.length - 1) {
                            // 给每套题的最后一题打标记
                            i.isSaveExercise = true
                        }
                    })
                } else {
                    for (let i = 0; i < exercise_set_id_key.length; i++) {
                        list = list.concat(data[exercise_set_id_key[i]])
                        data[exercise_set_id_key[i]].forEach((j, index) => {
                            j.exercise_set_id = exercise_set_id_key[i]
                            if (j.exercise_done == 0) {
                                index++
                                if (j.correction == 0) {
                                    j.colorFlag = 1
                                } else {
                                    j.colorFlag = 2
                                }
                            }
                            j = normalTopicChange(j)
                            if (index === data[exercise_set_id_key[i]].length - 1) {
                                // 给每套题的最后一题打标记
                                j.isSaveExercise = true
                            }
                        })
                    }
                }
                let yinDaoArr = []
                if (list[index].equation_distribution && list[index].equation_distribution != '') {
                    // yinDaoArr = list[index].equation_distribution.split(',')
                    yinDaoArr = list[index].equation_distribution
                }
                // console.log('redux getTopaic ',data)
                dispatch(changePage(list, list[index], index, yinDaoArr, {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

export const getSpecilBaseTopaic = (api, data) => {
    return (dispatch) => {
        axios.get(api, { params: data }).then(
            res => {

                let list = res.data.data.data
                let exercise_set_id = res.data.data.exercise_set_id
                let index = 0
                for (let i = 0; i < list.length; i++) {
                    list[i].exercise_set_id = exercise_set_id
                    if (list[i].exercise_done == 0) {
                        index++
                        if (list[i].correction == 0) {
                            list[i].colorFlag = 1
                        } else {
                            list[i].colorFlag = 2
                        }
                    }
                }
                let yinDaoArr = []
                console.log('redux getTopaic ', data)
                dispatch(changePage(list, list[index], index, yinDaoArr, {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

//数学书专项智能题获取
export const getSpecialMathAuto = (api, data) => {
    return (dispatch) => {
        axios.get(api, { params: data }).then(
            res => {
                let list = res.data.data.data
                let index = 0
                let finalDataList = []
                for (let i = 0; i < list.length; i++) {
                    list[i].exercise_set_id = res.data.data.exercise_set_id
                    if (list[i].exercise_type === "等式计算题") {
                        let finalData = {}
                        let item = list[i]
                        finalData = { ...item }
                        item.alphabet_value.forEach((element) => {
                            let tempFinalData = { ...finalData }
                            tempFinalData.alphabet_value = element
                            // tempFinalData.exercise_set_id = value.exercise_set_id
                            fileterAutoCalItem(Object.keys(element), tempFinalData, element)
                            if (item.name === topaicTypes.Than_Size) {
                                let _alphabet_value_ = item.alphabet_value_[index] ? item.alphabet_value_[index] : item[0]
                                tempFinalData.alphabet_value_ = _alphabet_value_
                                fileterAutoCalItemThanSize(Object.keys(_alphabet_value_), tempFinalData, _alphabet_value_)
                            } else {
                                // tempFinalData._choice_content = tempFinalData.answer_content.concat(tempFinalData.choice_item[0]).sort(sortNumber)
                            }
                            console.log('finalData', tempFinalData)
                            finalDataList.push({ ...tempFinalData })
                        })
                    } else {
                        let keyArr = Object.keys(list[i].alphabet_value)
                        list[i] = fileterAutoItem(keyArr, list[i], list[i].alphabet_value)
                        if (list[i].exercise_done == 0) {
                            index++
                            if (list[i].correction == 0) {
                                list[i].colorFlag = 1
                            } else {
                                list[i].colorFlag = 2
                            }
                        }
                        finalDataList.push({ ...list[i] })
                    }

                }
                let yinDaoArr = []
                let firstAlphabetValue = {}
                let firstVariableValue = {}
                let firstNeedTree = {}
                console.log('redux getTopaic ', data)
                dispatch(changePage(finalDataList, finalDataList[index], index, yinDaoArr, firstAlphabetValue, firstVariableValue, firstNeedTree));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
};

// π计划日记拿题（A计划，B计划）
export const getPaiTopic = (api, data, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let data = res.data.data
                let list = []
                let obj = {}
                let typeMap = {
                    '1': 'element_exercise',
                    '2': 'sync_study',
                    '3': 'collection_exercise',
                }
                obj['1'] = data.element_exercise ? data.element_exercise : {}
                obj['2'] = data.sync_study
                obj['3'] = data.collection_exercise
                for (let i in obj) {
                    if (i === '1' && obj[i]) {
                        let element_list = obj[i]
                        for (let j in element_list) {
                            list = list.concat(element_list[j])
                            element_list[j].forEach((item, index) => {
                                item.exercise_set_id = j
                                item.type_key = typeMap[i]
                                if (index === element_list[j].length - 1) item.isSaveExercise = true
                            })
                        }
                    } else {
                        obj[i].data.forEach((j, index) => {
                            j.exercise_set_id = obj[i].exercise_set_id
                            j.type_key = typeMap[i]
                            if (i === '3') {
                                if (j.alphabet_value) {
                                    // 代表是活题
                                    j.variable_value ? j.unitArr = getUnitArr(JSON.parse(j.variable_value)) : null
                                    j.alphabet_value = JSON.parse(j.alphabet_value)
                                    j.variable_value ? j.variable_value = JSON.parse(j.variable_value) : null
                                    let keyArr = Object.keys(j.alphabet_value)
                                    j = fileterAutoItem(keyArr, j, j.alphabet_value)
                                }
                            }
                        })
                        if (i === '2') {
                            let sync_list = obj[i].data
                            sync_list[sync_list.length - 1].addIsfinish = true
                        }
                        list = list.concat(obj[i].data)
                    }
                }
                console.log('11111111111111111111111111111', list)
                // return
                // let exercise_category = res.data.data.exercise_category
                let index = 0
                for (let i = 0; i < list.length; i++) {
                    if (list[i].exercise_done == 0) {
                        index++
                        if (list[i].correction == 0) {
                            list[i].colorFlag = 1
                        } else {
                            list[i].colorFlag = 2
                        }
                    }
                    list[i] = normalTopicChange(list[i])
                    if (list[i].type_key === 'element_exercise' && list[i].name === topaicTypes.Than_Size) list[i].exercise_stem_change = list[i].exercise_stem //π计划基础学习题比较大小填空题需要
                }
                let yinDaoArr = []
                // if (list[index].equation_distribution&&list[index].equation_distribution != '') {
                //   yinDaoArr = list[index].equation_distribution.split(',')
                // }
                // console.log('redux getTopaic ',data)
                dispatch(changePage(list, list[index], index, yinDaoArr, {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
}

export const getExpandCal = (api, data, num, cancelToken) => {
    return (dispatch) => {
        axios.get(api, { params: data, cancelToken }).then(
            res => {
                let data = res.data.data.data
                console.log('^^^^^^^^^^^^^^^^^^^^^^^^', data)
                // return
                let exercise_set_id = res.data.data.exercise_set_id
                let exercise_id = res.data.data.data.exercise_id
                let index = 0
                let obj = { answer_location: '学习', primary_classify: '巧算', secondary_classify: '配对求和', diffculty_level: '2', user_data: [] }
                obj.primary_classify = data.first_name
                obj.secondary_classify = data.second_name
                obj.diffculty_level = data.exercise_level
                let ext_cls = new ExtendClassifyCls()
                let list = []
                if (num === 1) {
                    // 表示学习拿死题
                    let topicValue = ext_cls.MainExtendFunc(obj)
                    list.push({
                        exercise_set_id,
                        exercise_id,
                        public_exercise_stem: data.public_exercise_stem,
                        public_exercise_image: '',
                        user_data: topicValue[2],
                        answer_explanation: data.knowledgepoint_explanation,
                        answer_content: data.answer_content,
                        name: '拓展计算题',
                        exercise_data_type: 'ZS',
                        answer_origin: '3',
                        displayed_type: data.first_name,
                        is_s: 's'   //打死题标识
                    })
                }
                if (num === 3) {
                    for (let i = 0; i < num; i++) {
                        let flag = false
                        let len = list.length
                        let topicValue = ext_cls.MainExtendFunc(obj)
                        console.log('++++++++++++++++++++++++++++++++++++', topicValue)
                        // return
                        if (len === 0) {
                            list.push({
                                exercise_set_id,
                                exercise_id,
                                public_exercise_stem: topicValue[0].question_stem,
                                public_exercise_image_cal: topicValue[0].question_graph.length === 0 ? '' : topicValue[0].question_graph,
                                user_data: topicValue[2],
                                answer_explanation: topicValue[1].standard_analytical,
                                answer_content: topicValue[0].standard_answer,
                                name: '拓展计算题',
                                exercise_data_type: 'ZS',
                                answer_origin: '3',
                                displayed_type: data.first_name
                            })
                        } else {
                            for (let j = 0; j < len; j++) {
                                if (JSON.stringify(list[j].user_data) === JSON.stringify(topicValue[2])) {
                                    console.log('生成了相同的题目')
                                    flag = true
                                    i--
                                    break
                                }
                            }
                            if (!flag) {
                                list.push({
                                    exercise_set_id,
                                    exercise_id,
                                    public_exercise_stem: topicValue[0].question_stem,
                                    public_exercise_image_cal: topicValue[0].question_graph.length === 0 ? '' : topicValue[0].question_graph,
                                    user_data: topicValue[2],
                                    answer_explanation: topicValue[1].standard_analytical,
                                    answer_content: topicValue[0].standard_answer,
                                    name: '拓展计算题',
                                    exercise_data_type: 'ZS',
                                    answer_origin: '3',
                                    displayed_type: data.first_name
                                })
                            }
                        }
                    }
                }
                console.log('++++++++++++++++++++++++++', list, list[index], index)
                dispatch(changePage(list, list[index], index, [], {}));
            }
        ).catch((e) => {
            console.log(e)
        })
    }
}

// 每一道题处理选择按钮数据
export const getCheckBtnArr = (currenTopic) => {
    const data = currenTopic
    const ZM_MAP = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
    }
    const FH_MAP = {
        0: '＞',
        1: '＜',
        2: '＝',
    }
    const PD_MAP = {
        0: '√',
        1: 'x'
    }
    switch (data.name) {
        case topaicTypes.Multipl_Choice_ABC:
            //选择题(A/B/C/D)
            if (!data.choice_content) return []
            let arrABC = Array.from({ length: data.choice_content.split('#').length }, (x, i) => {
                return { value: ZM_MAP[i], key: data.choice_content.split('#')[i] }
            })
            return arrABC
        case topaicTypes.Multipl_Choice_123:
            //123选择题
            if (!data.choice_content) return []
            let arr123 = Array.from({ length: data.choice_content.split('#').length }, (x, i) => {
                return { value: i + 1, key: data.choice_content.split('#')[i] }
            })
            return arr123
        case topaicTypes.Than_Size:
            // 比较大小填空题
            let arrFH = Array.from({ length: 3 }, (x, i) => {
                return { value: FH_MAP[i], key: FH_MAP[i] }
            })
            return arrFH
        case topaicTypes.Judegment:
            let arrPD = Array.from({ length: 2 }, (x, i) => {
                return { value: PD_MAP[i], key: PD_MAP[i] }
            })
            return arrPD
        default:
            return []
    }
}

// 文字填空题-多个空数字，图片填空题-多个空数字，文字填空题-1个空数字，图片填空题-1个空数字写死选项abcd
export const getabcdBtnArr = (type) => {
    let btnArr = []
    if (type === topaicTypes.Text_Much_Num_Fill_Blank || type === topaicTypes.Img_Much_Num_Fill_Blank || type === topaicTypes.Text_One_Num_Fill_Blank || type === topaicTypes.Img_One_Num_Fill_Blank) {
        btnArr = [{ value: 'a', key: 'a' }, { value: 'b', key: 'b' }, { value: 'c', key: 'c' }, { value: 'd', key: 'd' }]
    }
    return btnArr
}

// 应用题拿单位
export const getUnitArr = (variable_value) => {
    let unitArr = []
    variable_value.forEach((i, index) => {
        i.value[1] = i.value[1].trim()
        if (i.value[1]) unitArr.push({ value: i.value[1], key: i.value[1] })
    })
    unitArr = unique(unitArr)
    if (unique(unitArr).length > 4) {
        unitArr = getRandomArrayElements(unitArr, 4)
        let haveUnit = false
        for (let i = 0; i < unitArr.length; i++) {
            if (i.value === variable_value[variable_value.length - 1].value[1]) {
                haveUnit = true
                break
            }
        }
        if (!haveUnit) {
            // 没有正确单位,随机把正确单位加到单位数组中
            let index = Math.floor(Math.random() * 4)
            unitArr[index] = { value: variable_value[variable_value.length - 1].value[1], key: variable_value[variable_value.length - 1].value[1] }
        }
    }
    return unitArr
}

// 打乱数组
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }
    return _arr;
};

// 获取框图数据
export const getBlockdiagram = (currentTopaicData, yinDaoNum) => {
    if (!currentTopaicData.alphabet_value || currentTopaicData.equation_type === '2') return ''
    let obj = {}
    let alphabet_value = {}
    currentTopaicData.variable_value.forEach((i, index) => {
        obj[i.key] = i.value
    })
    if (currentTopaicData.exercise_data_type === 'FS') {
        for (let i in currentTopaicData.alphabet_value) {
            alphabet_value[i] = currentTopaicData.alphabet_value[i][1]
        }
    } else {
        for (let i in currentTopaicData.alphabet_value) {
            if (Array.isArray(currentTopaicData.alphabet_value[i])) {
                alphabet_value[i] = currentTopaicData.alphabet_value[i][1]
            } else {
                alphabet_value[i] = currentTopaicData.alphabet_value[i]
            }
        }
    }
    if (currentTopaicData.solve.indexOf('框图') > -1 || currentTopaicData.solve === '综合法') {
        return [currentTopaicData.equation_distribution, obj, alphabet_value, yinDaoNum]
    }
}

// 替换题干字符
export const changeStr = (str) => {
    let v = str.replaceAll('＋', '+').replaceAll('－', '-').replaceAll('×', '×').replaceAll('X', '×').replaceAll('÷', '÷').replaceAll('÷', '÷').replaceAll('（', '(').replaceAll('）', ')').replace(/\s/g, "")
    return v
}

// 获取题目保存信息
export const getBasicRecordData = (answer_origin, currentTopaicDataJs, userInfoJs, isLookHelp, diagnosisByFrontVal, currentAnswerNum, textCode, unit_code, lesson_code, knowledge_code, isExpandStudy, practical_category) => {
    let type = 'savenonPracticalExercise'
    if (answer_origin === '7' || answer_origin === '7wrong') type = 'recordSelfExercise'
    if (answer_origin === '3') {
        // 拓展计算题
        return {
            correction: '0',//1:错,0:对 default='1'
            exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID	int	必传
            exercise_phase: 'l',  //l练习 s学习
            student_code: userInfoJs.id,	//学生ID	int	必传
            exercise_id: currentTopaicDataJs.exercise_id,//题目ID	str	必传
            spend_time: 10,	//答题花费时间	int	必传
            answer_origin: currentTopaicDataJs.answer_origin,
            displayed_type: currentTopaicDataJs.name,//展示题型
            record_times: currentAnswerNum + 1 + '',
            suggested_time: currentTopaicDataJs.suggested_time,
            answer_content: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.answer_content) : currentTopaicDataJs.answer_content,
            equation_detail: JSON.stringify(currentTopaicDataJs.user_data),
            data_type: currentTopaicDataJs.exercise_data_type,
            grade_code: userInfoJs.checkGrade,//年级
            term_code: userInfoJs.checkTeam,//学期
            unit_code: unit_code,//单元
            textbook: textCode,//教材版本
        }
    }
    if (answer_origin === 'paiAB') {
        // A、B计划死题部分
        let data = {
            student_code: userInfoJs.id,//学生编号
            exercise_point_loc: '',//题点位
            exercise_result: JSON.stringify(diagnosisByFrontVal),//做题结果
            exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID
            identification_results: '',//识别结果
            answer_start_time: '',//答题开始时间
            answer_end_time: '',//答题结束时间
            right_answer: currentTopaicDataJs.answer_content_beforeChange,//智能应用题需要存答案的字母
            displayed_type: currentTopaicDataJs.displayed_type,//展示题型
            exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem) : currentTopaicDataJs.exercise_stem,//题干
            exercise_stem_: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem_) : currentTopaicDataJs.exercise_stem_,//题干
            triadic_relation: currentTopaicDataJs.equation_exercise,//三元关系
            triadic_relation_: currentTopaicDataJs.triadic_relation_,//三元关系
            alphabet_value: currentTopaicDataJs.alphabet_value,//每个字母的值
            alphabet_value_: currentTopaicDataJs.alphabet_value_,//每个字母的值
            correction: '0',//1:错,0:对 default='1'
            is_help: isLookHelp,//是否点击帮助,0:是,1：否 default='1'
            tooltip_access_frequency: 0,//点击帮助次数
            tooltip_access_time: 0,//点击帮助停留时间
            grade_code: userInfoJs.checkGrade,//年级
            term_code: userInfoJs.checkTeam,//学期
            unit_code: unit_code,//单元
            lesson_code: lesson_code,//单元
            textbook: textCode,//教材版本
            understand: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.understand) : currentTopaicDataJs.understand,
            is_element_exercise: currentAnswerNum + 1 + '', //0：做的第二遍1：做的第一遍,
            private_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.private_exercise_stem) : currentTopaicDataJs.private_exercise_stem,//题干
            public_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.public_exercise_stem) : currentTopaicDataJs.public_exercise_stem,//题干
            exercise_id: currentTopaicDataJs.m_e_s_id,//题目
            record_times: currentAnswerNum + 1 + '',
            answer_content: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.answer_content) : currentTopaicDataJs.answer_content,
            answer_origin: '6',
            knowledge_code: currentTopaicDataJs.knowledge_code,
            data_type: currentTopaicDataJs.exercise_data_type
        }
        let _data = {}
        // console.log('***********************************',currentTopaicDataJs)
        if (currentTopaicDataJs.type_key === 'collection_exercise') {
            // 错题参数
            if (currentTopaicDataJs.answer_origin === '6') {
                // 同步错题
                _data.exercise_id = currentTopaicDataJs.m_e_s_id ? currentTopaicDataJs.m_e_s_id : currentTopaicDataJs.exercise_id
            }
            if (currentTopaicDataJs.answer_origin === '7') {
                // 基础错题
                _data.exercise_id = currentTopaicDataJs.ex_id
                _data.knowledge_code = data.knowledge_code
            }
            if (currentTopaicDataJs.answer_origin === '4' || currentTopaicDataJs.answer_origin === '2') {
                // 同步应用错题
                _data.exercise_id = currentTopaicDataJs.exercise_id
            }
            _data.correction = data.correction
            _data.student_code = data.student_code
            _data.grade_code = data.grade_code
            _data.term_code = data.term_code
            _data.unit_code = data.unit_code
            _data.textbook = data.textbook
            _data.answer_origin = currentTopaicDataJs.answer_origin
            _data.exercise_set_id = currentTopaicDataJs.exercise_set_id
            _data.lesson_code = data.lesson_code
            _data.record_times = data.record_times

        }
        if (currentTopaicDataJs.type_key === 'element_exercise') {
            // 基础学习题保存
            _data = data
            _data.answer_origin = '7'
            _data.exercise_id = currentTopaicDataJs.ex_id
            _data.student_id = data.student_code
            _data.spend_time = currentTopaicDataJs.suggested_time
            _data.lesson_code = data.lesson_code
            _data.exercise_set_id = currentTopaicDataJs.exercise_set_id
            _data.record_times = data.record_times
            _data.knowledge_code = data.knowledge_code
            _data.exercise_category = 'element'
        }
        if (currentTopaicDataJs.type_key === 'sync_study') {
            // 同步学习题保存
            _data = data
        }
        return _data
    }
    if (answer_origin === 'improve7') {
        // π计划基础学习
        let improvedata = {
            exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID	int	必传
            student_id: userInfoJs.id,	//学生ID	int	必传
            exercise_id: currentTopaicDataJs.exercise_id,//题目ID	str	必传
            spend_time: 10,	//答题花费时间	int	必传
            is_suggested: isLookHelp,	//是否查看点击帮助 1是 0否
            exercise_category: 'element',
            grade_code: userInfoJs.checkGrade,//年级
            term_code: userInfoJs.checkTeam,//学期
            unit_code: unit_code,//单元
            textbook: textCode,//教材版本
            correction: '1',//1是对，0是错
            record_times: currentAnswerNum + 1 + '',
            knowledge_code: currentTopaicDataJs.knowledge_code,
            answer_origin: '7'
        }
        // let _improvedata = {}
        if (currentTopaicDataJs.category) {
            //   // 表示推的是错题
            //   _improvedata.exercise_id  = currentTopaicDataJs.exercise_id
            //   _improvedata.correction  = improvedata.correction
            //   _improvedata.student_code  = improvedata.student_id
            //   _improvedata.grade_code  = improvedata.grade_code
            //   _improvedata.term_code  = improvedata.term_code
            //   _improvedata.unit_code  = improvedata.unit_code
            //   _improvedata.textbook  = improvedata.textbook
            //   _improvedata.answer_origin  = '7'
            //   _improvedata.knowledge_code = improvedata.knowledge_code
            //   _improvedata.exercise_set_id = improvedata.exercise_set_id
            improvedata.is_type = null    //这种题保存的时候需要
        }
        // else{
        //   _improvedata = {...improvedata}
        // }
        return improvedata
    }
    if (answer_origin === 'improve6' || answer_origin === 'improve2' || answer_origin === 'improve4' || answer_origin === 'improve5') {
        // π计划同步学习
        let exercise_phase = ''
        let _practical_category = ''
        if (answer_origin === 'improve5') {
            // 表示pai计划里面拓展应用题的练习
            exercise_phase = 'l'
            _practical_category = practical_category
        }
        if (answer_origin === 'improve5' && isExpandStudy) {
            // 表示pai计划里面拓展应用题的学习
            exercise_phase = 's'
        }
        let improvedata = {
            student_code: userInfoJs.id,//学生编号
            exercise_point_loc: '',//题点位
            exercise_result: JSON.stringify(diagnosisByFrontVal),//做题结果
            exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID
            identification_results: '',//识别结果
            answer_start_time: '',//答题开始时间
            answer_end_time: '',//答题结束时间
            right_answer: currentTopaicDataJs.answer_content_beforeChange,//智能应用题需要存答案的字母
            displayed_type: currentTopaicDataJs.displayed_type,//展示题型
            exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem) : currentTopaicDataJs.exercise_stem,//题干
            exercise_stem_: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem_) : currentTopaicDataJs.exercise_stem_,//题干
            triadic_relation: currentTopaicDataJs.triadic_relation,//三元关系
            triadic_relation_: currentTopaicDataJs.triadic_relation_,//三元关系
            alphabet_value: currentTopaicDataJs.alphabet_value,//每个字母的值
            alphabet_value_: currentTopaicDataJs.alphabet_value_,//每个字母的值
            correction: '0',//1:错,0:对 default='1'
            is_help: isLookHelp,//是否点击帮助,0:是,1：否 default='1'
            tooltip_access_frequency: 0,//点击帮助次数
            tooltip_access_time: 0,//点击帮助停留时间
            grade_code: userInfoJs.checkGrade,//年级
            term_code: userInfoJs.checkTeam,//学期
            unit_code: unit_code,//单元
            lesson_code: lesson_code,//单元
            textbook: textCode,//教材版本
            understand: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.understand) : currentTopaicDataJs.understand,
            is_element_exercise: currentAnswerNum + 1 + '', //0：做的第二遍1：做的第一遍,
            private_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.private_exercise_stem) : currentTopaicDataJs.private_exercise_stem,//题干
            public_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.public_exercise_stem) : currentTopaicDataJs.public_exercise_stem,//题干
            exercise_id: currentTopaicDataJs.exercise_id ? currentTopaicDataJs.exercise_id : currentTopaicDataJs.sy_id,//题目
            record_times: currentAnswerNum + 1 + '',
            answer_content: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.answer_content) : currentTopaicDataJs.answer_content,//正确答案
            knowledge_code: currentTopaicDataJs.knowledge_code,
            answer_origin: answer_origin.substring(7),
            equation_detail: JSON.stringify(currentTopaicDataJs.equation_detail),
            exercise_phase,
            practical_category: _practical_category
        }
        let _improvedata = {}
        if (currentTopaicDataJs.category) {
            // 表示推的是错题
            _improvedata.exercise_id = improvedata.exercise_id
            _improvedata.correction = improvedata.correction
            _improvedata.student_code = improvedata.student_code
            _improvedata.grade_code = improvedata.grade_code
            _improvedata.term_code = improvedata.term_code
            _improvedata.unit_code = improvedata.unit_code
            _improvedata.textbook = improvedata.textbook
            _improvedata.answer_origin = improvedata.answer_origin
            _improvedata.knowledge_code = improvedata.knowledge_code
            _improvedata.exercise_set_id = improvedata.exercise_set_id
        } else {
            _improvedata = { ...improvedata }
        }
        return _improvedata
    }
    switch (type) {
        case 'savenonPracticalExercise':
            // 同步学习题、同步应用、同步计算、拓展应用、B计划计算方向、B计划应用方向
            // console.log('***************************',currentTopaicDataJs,answer_origin)
            let _answer_origin = answer_origin
            if (answer_origin === '4' || answer_origin === '5') {
                // 同步应用、拓展应用
                if (currentTopaicDataJs.alphabet_value) {
                    // 活题 private_exercise_stem 字段有值
                    currentTopaicDataJs.exercise_stem = currentTopaicDataJs.private_exercise_stem
                } else {
                    // 死题 public_exercise_stem 有值
                    currentTopaicDataJs.exercise_stem = currentTopaicDataJs.public_exercise_stem
                }
            }
            if (answer_origin === 'app' || answer_origin === 'appExp') {
                currentTopaicDataJs.exercise_stem = currentTopaicDataJs.private_exercise_stem
            }
            if (answer_origin === '2') {
                currentTopaicDataJs.exercise_id = currentTopaicDataJs.sy_id
            }
            if (answer_origin === 'cal') {
                // B计划同步计算
                currentTopaicDataJs.exercise_id = currentTopaicDataJs.sy_id
                _answer_origin = '2'
            }
            if (answer_origin === '6') {
                currentTopaicDataJs.exercise_stem = currentTopaicDataJs.public_exercise_stem
            }
            if (answer_origin === 'app') _answer_origin = '4'
            if (answer_origin === 'appExp') _answer_origin = '5'
            return {
                student_code: userInfoJs.id,//学生编号
                exercise_point_loc: '',//题点位
                exercise_result: JSON.stringify(diagnosisByFrontVal),//做题结果
                exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID
                identification_results: '',//识别结果
                answer_start_time: '',//答题开始时间
                answer_end_time: '',//答题结束时间
                right_answer: currentTopaicDataJs.answer_content_beforeChange,//智能应用题需要存答案的字母
                displayed_type: currentTopaicDataJs.displayed_type,//展示题型
                exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem) : currentTopaicDataJs.exercise_stem,//题干
                exercise_stem_: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.exercise_stem_) : currentTopaicDataJs.exercise_stem_,//题干
                triadic_relation: currentTopaicDataJs.triadic_relation,//三元关系
                triadic_relation_: currentTopaicDataJs.triadic_relation_,//三元关系
                alphabet_value: currentTopaicDataJs.alphabet_value,//每个字母的值
                alphabet_value_: currentTopaicDataJs.alphabet_value_,//每个字母的值
                correction: '0', //1是错，0是对
                is_help: isLookHelp,//是否点击帮助,0:是,1：否 default='1'
                tooltip_access_frequency: 0,//点击帮助次数
                tooltip_access_time: 0,//点击帮助停留时间
                grade_code: userInfoJs.checkGrade,//年级
                term_code: userInfoJs.checkTeam,//学期
                unit_code: unit_code,//单元
                lesson_code: lesson_code,//单元
                textbook: textCode,//教材版本
                understand: currentTopaicDataJs.understand,
                is_element_exercise: currentAnswerNum + 1 + '', //0：做的第二遍1：做的第一遍,
                private_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.private_exercise_stem) : currentTopaicDataJs.private_exercise_stem,//题干,
                public_exercise_stem: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.public_exercise_stem) : currentTopaicDataJs.public_exercise_stem,//题干
                exercise_id: currentTopaicDataJs.exercise_id,//题目
                record_times: currentAnswerNum + 1 + '',
                answer_content: currentTopaicDataJs.exercise_data_type === 'FS' ? JSON.stringify(currentTopaicDataJs.answer_content) : currentTopaicDataJs.answer_content,
                answer_origin: _answer_origin,
                suggested_time: currentTopaicDataJs.suggested_time,
                spend_time: 10,	//答题花费时间	int	必传
                exercise_category: currentTopaicDataJs.exercise_category,
                is_suggested: isLookHelp,	//是否查看点击帮助 1是 0否
                data_type: currentTopaicDataJs.exercise_data_type,
                equation_type: currentTopaicDataJs.equation_type,
                equation_detail: JSON.stringify(currentTopaicDataJs.equation_detail),
                exercise_phase: 'l',  //l练习 s学习
            }
        case 'recordSelfExercise':
            // 基础学习 、同步学习错题的基础学习
            let _knowledge_code = knowledge_code
            _answer_origin = answer_origin
            if (answer_origin === '7wrong') {
                _knowledge_code = currentTopaicDataJs.knowledge_code
                _answer_origin = '7'
            }
            return {
                exercise_set_id: currentTopaicDataJs.exercise_set_id,//套题ID	int	必传
                student_id: userInfoJs.id,	//学生ID	int	必传
                exercise_id: currentTopaicDataJs.exercise_id,//题目ID	str	必传
                spend_time: 10,	//答题花费时间	int	必传
                is_suggested: isLookHelp,	//是否查看点击帮助 1是 0否
                exercise_category: currentTopaicDataJs.exercise_category, //习题模式：区分死题还是要素考察题 str 必传
                grade_code: userInfoJs.checkGrade,//年级
                term_code: userInfoJs.checkTeam,//学期
                unit_code: unit_code,//单元
                textbook: textCode,//教材版本
                correction: '1',//1:对,0:错 default='1'
                record_times: currentAnswerNum + 1 + '',
                answer_origin: _answer_origin,
                knowledge_code: _knowledge_code,
                data_type: currentTopaicDataJs.exercise_data_type,
                suggested_time: currentTopaicDataJs.suggested_time,
            }
        default:
            return {}
    }
}

// 题目是否引导
export const getIsYindao = (data) => {
    if (data.equation_type === '2') return false //代数式为非标准的不引导
    if (data.solve) {
        if (data.solve.indexOf('框图') > -1 || data.solve.indexOf('综合法') > -1) return true
    }
    return false
}

// 死题题目操作
export const normalTopicChange = (data) => {
    data.name = data.name ? data.name : data.exercise_type
    data.btnArr = getCheckBtnArr(data)
    if (data.btnArr.length === 0) {
        data.btnArr = getabcdBtnArr(data.name)
    }
    if (data.choice_txt) {
        let unitArr = data.choice_txt.split('#').map((item) => {
            return { value: item, key: item }
        })
        data.unitArr = shuffle(unitArr)
    }
    data.tip = MathTipType[data.name] ? MathTipType[data.name] : ''
    if (data.name === topaicTypes.Equation_Calculation) {
        let stem = data.public_exercise_stem ? data.public_exercise_stem : data.private_exercise_stem ? data.private_exercise_stem : data.exercise_stem
        data._stem = stem.replace(/<\/?p[^>]*>/gi, '')
        data._stem = changeStr(data._stem)
    }
    if (data.equation_exercise) data.equation_exercise = changeStr(data.equation_exercise)
    data.name === topaicTypes.Than_Size ? data.exercise_stem_change = data.exercise_stem : null
    if (data.exercise_data_type === 'FS' || data.data_type === 'FS') {
        // 分数处理
        if (data.equation_exercise) {
            data.equation_exercise = changeStr(data.equation_exercise)
            data.equation_exercise = JSON.parse(data.equation_exercise)
        }
        data.public_exercise_stem ? data.public_exercise_stem = JSON.parse(data.public_exercise_stem) : null
        data.private_exercise_stem ? data.private_exercise_stem = JSON.parse(data.private_exercise_stem) : null
        data.exercise_stem ? data.exercise_stem = JSON.parse(data.exercise_stem) : null
        data.answer_content ? data.answer_content = JSON.parse(data.answer_content) : null
        data.choice_content_type === 'img' ? null : data.choice_content ? data.choice_content = fractionChangeChioce(data.choice_content) : null
        data.knowledgepoint_explanation ? data.knowledgepoint_explanation = JSON.parse(data.knowledgepoint_explanation) : null
        data.problem_solving ? data.problem_solving = JSON.parse(data.problem_solving) : null
    }
    if (data.exercise_category) {
        // 表示是基础学习题
        // 基础学习出现题干图片在题干上的情况，需要做一些字段替换处理，基础学习是public_exercise_image存的题干图片，同步学习错题集的基础学习暂时不知道是哪个字段有图片
        data = steamImageChange(data)
    }
    return data
}

// π计划智能题错题处理
export const wrongAiTopicChange = (data) => {
    data.alphabet_value = data.alphabet_value[0]
    data.name = data.name ? data.name : data.exercise_type
    data.tip = MathTipType[data.name] ? MathTipType[data.name] : ''
    data.btnArr = getCheckBtnArr(data)
    if (data.data_type === 'FS' || data.exercise_data_type === 'FS') {
        data.exercise_stem ? data.exercise_stem = JSON.parse(data.exercise_stem) : null
        data.exercise_stem_ ? data.exercise_stem_ = JSON.parse(data.exercise_stem_) : null
        data.answer_content ? data.answer_content = JSON.parse(data.answer_content[0]) : null
    }
    if (data.name === topaicTypes.Than_Size) {
        data.exercise_stem_change = data.exercise_stem + ' 〇 ' + data.exercise_stem_
    }
    return data
}
