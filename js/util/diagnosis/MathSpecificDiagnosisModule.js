/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
function deepClone(obj, newObj) {
    // 深度复制
    var newObj = newObj || {};
    for (let key in obj) {
        if (typeof obj[key] == 'object') {
            newObj[key] = (obj[key].constructor === Array) ? [] : {}
            deepClone(obj[key], newObj[key]);
        }
        else {
            newObj[key] = obj[key]
        }
    }
    return newObj;
}

function StandardSubstituteStr(str) {
    //转换标准可计算字符串
    str = str.replace(/\s*/g, ""); //去除空格
    str = str.replace(/\[/g, "(");
    str = str.replace(/\{/g, "(");
    str = str.replace(/\]/g, ")");
    str = str.replace(/\}/g, ")");
    str = str.replace(/x/g, "*");
    str = str.replace(/×/g, "*");
    str = str.replace(/\÷/g, "/");
    //str=str.replace(/\(/g,"[");
    //console.log(str);
    //console.log(math.eval(str));
    return str;
}

function TwoMatUnite(mat_a, mat_b) {
    // 两个数组的交集，可重复,mat_a在mat_b中相同元素
    let unite_idx_a = []
    let unite_idx_b = []
    let unite_mat = []
    for (let ii = 0; ii < mat_a.length; ii++) {
        for (let jj = 0; jj < mat_b.length; jj++) {
            if (mat_a[ii] == mat_b[jj] && unite_idx_b.indexOf(jj)) {
                unite_idx_a.push(ii)
                unite_idx_b.push(jj)
                unite_mat.push(mat_b[jj])
            }

        }
    }
    // console.log('两数组相同元素', mat_a, mat_b, unite_mat, unite_idx_a, unite_idx_b)
    return unite_mat
}

function BaseCalculateDiagnose1(private_exercise_stem, answer_content, user_answer_mat) {
    // 基础学习模块---等式计算题：返回正确或错误
    // 	let private_exercise_stem = "12÷3×2"    // 题干代数式
    //  let answer_content= "8"     // 标准答案
    //  let user_answer_mat = [[['12'],['÷'], ['3'], ['×'],['2']],[['='],['4'],['×'],['2']],[['='],['8']]]    // 用户答题数据
    // 组合用户数据
    // user_answer_mat
    let user_combine_str_mat = []       // 组合字符串
    let equal_idx_mat = []          // 等号索引
    for (let ii = 0; ii < user_answer_mat.length; ii++) {
        // 同时提取'='所在位置
        let part_str = ''
        let part_equal_idx = []
        for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
            if (user_answer_mat[ii][jj][0] == '=') {
                part_equal_idx.push(jj)
            }
            else {
                part_str += user_answer_mat[ii][jj][0]
            }
        }
        user_combine_str_mat.push(part_str)
        equal_idx_mat.push(part_equal_idx)
    }
    console.log('计算等式', user_combine_str_mat)
    console.log('等号索引', equal_idx_mat)
    // 提取代数式中的计算符号
    // console.log(private_exercise_stem.match(/^[\d+(\.\d+)?]/g))
    // console.log(private_exercise_stem.match(/\d+/g))
    // console.log(private_exercise_stem.replace(/^\d+(\.\d+)?/g))

    let symbols_mat = []    // 统计计算符号
    for (let ii = 0; ii < private_exercise_stem.length; ii++) {
        if (['+', '-', '÷', '×'].indexOf(private_exercise_stem[ii]) >= 0) {
            symbols_mat.push(private_exercise_stem[ii])
        }
    }
    console.log('计算符号', symbols_mat)

    // 整数诊断每一步结果：调用标准替换函数
    let user_step_standard_mat = []
    let user_step_answer_mat = []
    for (let ii = 0; ii < user_combine_str_mat.length; ii++) {
        // console.log(mathdiagnosis.StandardSubstituteStr(user_combine_str_mat[ii]))
        user_step_standard_mat.push(StandardSubstituteStr(user_combine_str_mat[ii]))
        // 计算每步结果
        user_step_answer_mat.push(eval(user_step_standard_mat[ii]))
    }
    console.log('每步标准替换', user_step_standard_mat)
    console.log('每步结果', user_step_answer_mat)
    // 检查每步结果是否相等
    let judge_flag = true
    for (let ii = 0; ii < user_step_answer_mat.length - 1; ii++) {
        if (user_step_answer_mat[ii] != user_step_answer_mat[ii + 1]) {
            judge_flag = false
            return judge_flag
        }
    }
    console.log('自身计算过程诊断', judge_flag)
    // 自身每步计算是否合理
    for (let ii = 0; ii < user_step_standard_mat.length - 1; ii++) {
        // 
        let current_mat = user_step_standard_mat[ii].match(/\d+(\.\d+)?/g)
        let next_mat = user_step_standard_mat[ii + 1].match(/\d+(\.\d+)?/g)
        console.log('当前数字', current_mat)
        console.log('下组数据', next_mat)
        // 提取两个数组相同字符个数
        let unite_mat = TwoMatUnite(current_mat, next_mat)
        if (unite_mat.length < (current_mat.length - 2)) {
            judge_flag = false
            return judge_flag
        }
        // 步骤是否递减
        if (current_mat.length < next_mat.length) {
            judge_flag = false
            return judge_flag
        }
    }

    // 与标准答案比较
    if (user_step_answer_mat[0] == eval(answer_content)) {
        console.log('与标准答案相同', answer_content, eval(answer_content), user_step_answer_mat[0])
        judge_flag = true
    }
    else {
        console.log('与标准答案不同', answer_content, eval(answer_content), user_step_answer_mat[0])
        judge_flag = false
        return judge_flag
    }
    // 判断计算步骤是否比标准少
    if (symbols_mat.length <= user_combine_str_mat.length) {
        console.log('计算步骤合适')
        judge_flag = true
    }
    else {
        console.log('计算步骤不合适')
        judge_flag = false
        return judge_flag
    }
    // 判定数字是否合适用到
    let standard_num_mat0 = private_exercise_stem.match(/\d+(\.\d+)?/g)
    console.log('标准数字集', standard_num_mat0)
    let answer_mat_idx00 = user_step_standard_mat[0].match(/\d+(\.\d+)?/g)
    console.log('答题第一组', answer_mat_idx00)
    let unite_mat0 = TwoMatUnite(standard_num_mat0, answer_mat_idx00)
    if (answer_mat_idx00.length == standard_num_mat0.length) {
        // 相同数组长度
        if (unite_mat0.length < (answer_mat_idx00.length - 2) || equal_idx_mat[0].length > 1) {
            judge_flag = false
            return judge_flag
        }
        // 后面步骤等号情况
        for (let ii = 1; ii < equal_idx_mat.length; ii++) {
            if (equal_idx_mat[ii].length != 1) {
                judge_flag = false
                return judge_flag
            }
        }
    }
    else {
        for (let ii = 0; ii < equal_idx_mat.length; ii++) {
            if (equal_idx_mat[ii].length != 1) {
                judge_flag = false
                return judge_flag
            }
        }


    }
    return true
}

function BaseApplicationDiagnose1(private_exercise_stem, answer_content, user_answer_mat) {
    // 基础学习应用题：相对基础学习等式计算题新增最后一步的单位判定
}

function IntAICalculateDiagnose(alphabet_value, answer_content, equation_detail, user_answer_mat) {
    // 整数类：智能计算题
    // alphabet_value: {A: 285, B: 2, C: 9, D: 18, E: 303}：代数值字典
    // answer_content= "303"     // 标准答案
    // equation_detail:  ['A+B×C', 'A+D', 'E']	// 计算过程
    // user_answer_mat0  = [[['285'],['+'], ['2'], ['×'],['9']],[['='],['285'],['+'],['18']],[['='],['303']]]    // 用户答题数据
    let algebra_str = equation_detail[0]
    for (let key in alphabet_value) {
        algebra_str = algebra_str.replace(key, alphabet_value[key])
    }
    console.log('替换key-value', algebra_str, typeof (algebra_str))
    // algebra_str = String(algebra_str)
    // console.log('替换key-value', algebra_str, typeof(algebra_str))
    return BaseCalculateDiagnose1(algebra_str, answer_content, user_answer_mat)
}

function IntAIApplicationDiagnose(alphabet_value, variable_value, equation_exercise, answer_content, user_answer_mat) {
    // function IntAIApplicationDiagnose(){
    // 整数类：智能应用题
    // let variable_value = [
    // 	{"key": "A","value": ["照片的总量", "张"]},
    // 	{"key": "B","value": ["风景照片的数量", "张"]},
    // 	{"key": "C","value": ["人物照片的组数","组"]},
    // 	{"key": "D","value": ["人物照片的数量","张"]},
    // 	{"key": "E","value": ["每组人物照片的数量","张"]}
    // 	];
    // let alphabet_value = {'A': 722, 'B': 673, 'C': 7, 'D': 49, 'E': 7};
    // let equation_exercise = "(A-B)÷C";
    // let answer_content = "E";		// 修改代数表示， answer_content = "7"
    // let user_answer_mat  = [[['('],['722'],['-'], ['673'],[')'], ['÷'],['7']],[['='],['49'],['÷'],['7']],[['='],['7'],['('],['张'],[')']]]    // 用户答题数据
    // 处理单位、更新单位数组
    let user_end_mat = user_answer_mat[user_answer_mat.length - 1]
    console.log(user_end_mat)
    // 统计单位
    let unit_mat = []
    let answer_unit = ''
    for (let ii = 0; ii < variable_value.length; ii++) {
        let part_unit = variable_value[ii]["value"][1]
        if (unit_mat.indexOf(part_unit) < 0) {
            unit_mat.push(part_unit)
        }
        if (variable_value[ii]["key"] == answer_content) {
            answer_unit = variable_value[ii]["value"][1]
        }
    }
    console.log('单位统计', unit_mat, '标准答案单位', answer_unit)
    let unit_flag = true
    // 判断是否有单位
    let unit_idx = []
    for (let ii = 0; ii < user_end_mat.length; ii++) {
        if (unit_mat.indexOf(user_end_mat[ii][0]) >= 0) {
            unit_idx.push(ii)
        }
    }
    console.log('IntAI存在单位索引', unit_idx)
    let new_user_end_mat = []
    if (unit_idx.length < 1 || unit_idx.length > 1) {
        unit_flag = false	// 单位错误
        for (let ii = 0; ii < user_end_mat.length; ii++) {
            if (unit_idx.indexOf(ii) < 0) {
                new_user_end_mat.push(user_end_mat[ii])
            }
        }
    }
    else {
        // 一个单位情况判定，括号与单位正确性
        if (unit_idx[0] > 0 && unit_idx[0] < user_end_mat.length - 1) {
            if (user_end_mat[unit_idx[0]][0] != answer_unit) {
                unit_flag = false	// 单位不对
                for (let ii = 0; ii < user_end_mat.length; ii++) {
                    if (unit_idx.indexOf(ii) < 0) {
                        new_user_end_mat.push(user_end_mat[ii])
                    }
                }
            }
            else {
                // 单位正确，格式正确
                if (user_end_mat[unit_idx[0] - 1][0] == '(' && user_end_mat[unit_idx[0] + 1][0] == ')') {
                    unit_flag = true	// 单位和格式
                    // console.log('到这儿', user_end_mat[unit_idx[0]-1][0], user_end_mat[unit_idx[0]-1][0]=='(')
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if ([unit_idx[0] - 1, unit_idx[0], unit_idx[0] + 1].indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
                else {
                    unit_flag = false	// 单位不对
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if (unit_idx.indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
            }
        }
        else {
            unit_flag = false	// 单位或格式错误
            for (let ii = 0; ii < user_end_mat.length; ii++) {
                if (unit_idx.indexOf(ii) < 0) {
                    new_user_end_mat.push(user_end_mat[ii])
                }
            }
        }
    }
    console.log('最后一组修改', new_user_end_mat, '单位标签',)
    user_answer_mat[user_answer_mat.length - 1] = new_user_end_mat
    console.log('去除单位矩阵', user_answer_mat)
    let algebra_str = equation_exercise
    for (let key in alphabet_value) {
        algebra_str = algebra_str.replace(key, alphabet_value[key])
    }
    console.log('替换key-value', algebra_str, typeof (algebra_str))
    let calculate_flag = BaseCalculateDiagnose1(algebra_str, alphabet_value[answer_content], user_answer_mat); 		// 应用题---计算标志
    console.log('计算诊断结果', calculate_flag)
    return [unit_flag, calculate_flag]
}

function ApplicationUnitDiagnosis(variable_value, answer_content, user_answer_mat) {
    // 单位诊断
    // function IntAIApplicationDiagnose(alphabet_value, variable_value, equation_exercise, answer_content, user_answer_mat){
    // function IntAIApplicationDiagnose(){
    // 整数类：智能应用题
    // let variable_value = [
    // 	{"key": "A","value": ["照片的总量", "张"]},
    // 	{"key": "B","value": ["风景照片的数量", "张"]},
    // 	{"key": "C","value": ["人物照片的组数","组"]},
    // 	{"key": "D","value": ["人物照片的数量","张"]},
    // 	{"key": "E","value": ["每组人物照片的数量","张"]}
    // 	];
    // let alphabet_value = {'A': 722, 'B': 673, 'C': 7, 'D': 49, 'E': 7};
    // let equation_exercise = "(A-B)÷C";
    // let answer_content = "E";		// 修改代数表示， answer_content = "7"
    // let user_answer_mat  = [[['('],['722'],['-'], ['673'],[')'], ['÷'],['7']],[['='],['49'],['÷'],['7']],[['='],['7'],['('],['张'],[')']]]    // 用户答题数据
    // 处理单位、更新单位数组
    // 存在过程单位判定

    // 最后一组
    let user_end_mat = user_answer_mat[user_answer_mat.length - 1]
    console.log('最后一组数据', user_end_mat)
    // 统计单位
    let unit_mat = []
    let answer_unit = ''
    for (let ii = 0; ii < variable_value.length; ii++) {
        let part_unit = variable_value[ii]["value"][1]
        if (unit_mat.indexOf(part_unit) < 0) {
            unit_mat.push(part_unit)
        }
        if (variable_value[ii]["key"] == answer_content) {
            answer_unit = variable_value[ii]["value"][1]
        }
    }
    console.log('单位统计', unit_mat, '标准答案单位', answer_unit)
    let unit_flag = true
    // 判断是否有单位
    let unit_idx = []
    for (let ii = 0; ii < user_end_mat.length; ii++) {
        if (unit_mat.indexOf(user_end_mat[ii][0]) >= 0) {
            unit_idx.push(ii)
        }
    }
    console.log('存在单位索引', unit_idx)
    // 存在过程单位判定
    for (let ii = 0; ii < user_answer_mat.length - 1; ii++) {
        for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
            if (unit_mat.indexOf(user_answer_mat[ii][jj][0]) >= 0) {
                // 过程单位
                return [false, '过程单位出现']
            }
        }
    }
    // 最后一行的单位判定
    let new_user_end_mat = []
    if (unit_idx.length < 1 || unit_idx.length > 1) {
        unit_flag = false	// 单位错误
        for (let ii = 0; ii < user_end_mat.length; ii++) {
            if (unit_idx.indexOf(ii) < 0) {
                new_user_end_mat.push(user_end_mat[ii])
            }
        }
    }
    else {
        // 一个单位情况判定，括号与单位正确性
        if (unit_idx[0] > 0 && unit_idx[0] < user_end_mat.length - 1) {
            if (user_end_mat[unit_idx[0]][0] != answer_unit) {
                unit_flag = false	// 单位不对
                for (let ii = 0; ii < user_end_mat.length; ii++) {
                    if (unit_idx.indexOf(ii) < 0) {
                        new_user_end_mat.push(user_end_mat[ii])
                    }
                }
            }
            else {
                // 单位正确，格式正确
                if (user_end_mat[unit_idx[0] - 1][0] == '(' && user_end_mat[unit_idx[0] + 1][0] == ')') {
                    unit_flag = true	// 单位和格式
                    // console.log('到这儿', user_end_mat[unit_idx[0]-1][0], user_end_mat[unit_idx[0]-1][0]=='(')
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if ([unit_idx[0] - 1, unit_idx[0], unit_idx[0] + 1].indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
                else {
                    unit_flag = false	// 单位不对
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if (unit_idx.indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
            }
        }
        else {
            unit_flag = false	// 单位或格式错误
            for (let ii = 0; ii < user_end_mat.length; ii++) {
                if (unit_idx.indexOf(ii) < 0) {
                    new_user_end_mat.push(user_end_mat[ii])
                }
            }
        }
    }
    console.log('最后一组修改', new_user_end_mat, '单位标签',)
    user_answer_mat[user_answer_mat.length - 1] = new_user_end_mat
    console.log('去除单位矩阵', user_answer_mat)
    return [unit_flag, user_answer_mat]
}

function NonAIApplicationUnitDiagnosis(alternative_options, user_answer_mat0) {
    // 非智能题单位诊断:完整
    // let alternative_options = "张#块";		// 修改代数表示， answer_content = "7"
    // let user_answer_mat  = [[['('],['722'],['-'], ['673'],[')'], ['÷'],['7']],[['='],['49'],['÷'],['7']],[['='],['7'],['('],['张'],[')']]]    // 用户答题数据
    // 处理单位、更新单位数组
    // 存在过程单位判定
    // let user_answer_mat = colo
    let user_answer_mat = deepClone(user_answer_mat0, [])
    // 最后一组
    let user_end_mat = user_answer_mat[user_answer_mat.length - 1]
    console.log('最后一组数据', user_end_mat)
    // 统计单位
    let unit_mat = alternative_options.split('#')
    let answer_unit = unit_mat[0]
    console.log('单位统计', unit_mat, '标准答案单位', answer_unit)
    let unit_flag = true
    // 判断是否有单位
    let unit_idx = []
    for (let ii = 0; ii < user_end_mat.length; ii++) {
        if (unit_mat.indexOf(user_end_mat[ii][0]) >= 0) {
            unit_idx.push(ii)
        }
    }
    console.log('NonAIAppl存在单位索引', unit_idx)
    // 存在过程单位判定
    for (let ii = 0; ii < user_answer_mat.length - 1; ii++) {
        for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
            if (unit_mat.indexOf(user_answer_mat[ii][jj][0]) >= 0) {
                // 过程单位
                return [false, '过程单位出现']
            }
        }
    }
    // 最后一行的单位判定
    let new_user_end_mat = []
    if (unit_idx.length < 1 || unit_idx.length > 1) {
        unit_flag = false	// 单位错误
        for (let ii = 0; ii < user_end_mat.length; ii++) {
            if (unit_idx.indexOf(ii) < 0) {
                new_user_end_mat.push(user_end_mat[ii])
            }
        }
    }
    else {
        // 一个单位情况判定，括号与单位正确性
        if (unit_idx[0] > 0 && unit_idx[0] < user_end_mat.length - 1) {
            if (user_end_mat[unit_idx[0]][0] != answer_unit) {
                unit_flag = false	// 单位不对
                for (let ii = 0; ii < user_end_mat.length; ii++) {
                    if (unit_idx.indexOf(ii) < 0) {
                        new_user_end_mat.push(user_end_mat[ii])
                    }
                }
            }
            else {
                // 单位正确，格式正确
                if (user_end_mat[unit_idx[0] - 1][0] == '(' && user_end_mat[unit_idx[0] + 1][0] == ')') {
                    unit_flag = true	// 单位和格式
                    // console.log('到这儿', user_end_mat[unit_idx[0]-1][0], user_end_mat[unit_idx[0]-1][0]=='(')
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if ([unit_idx[0] - 1, unit_idx[0], unit_idx[0] + 1].indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
                else {
                    unit_flag = false	// 单位不对
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if (unit_idx.indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
            }
        }
        else {
            unit_flag = false	// 单位或格式错误
            for (let ii = 0; ii < user_end_mat.length; ii++) {
                if (unit_idx.indexOf(ii) < 0) {
                    new_user_end_mat.push(user_end_mat[ii])
                }
            }
        }
    }
    console.log('最后一组修改', new_user_end_mat, '单位标签',)
    user_answer_mat[user_answer_mat.length - 1] = new_user_end_mat
    console.log('去除单位矩阵', user_answer_mat)
    return [unit_flag, user_answer_mat]
}

class DecimalCalculatorFunc {
    // 小数计算器
    GetStrComputeSign = (calc_str) => {
        // 获取字符计算符号
        // console.log('dd')
        let sign_idx = calc_str.search(/[+\-*/÷]/i)
        return [calc_str.substring(0, sign_idx), calc_str[sign_idx], calc_str.substring(sign_idx + 1, calc_str.length)]
    }

    ShiftNum = (num_str) => {
        // 移位
        let decimal_idx = num_str.search(/[.]/i)
        if (decimal_idx < 0) {
            return 0
        }
        else {
            return num_str.length - decimal_idx - 1
        }
    }

    InsertDecimalStr = (init_str, insert_idx, insert_str) => {
        // 指定位置插入字符串，在第inser_idx处插入，原字符串从insert_idx后移
        if (insert_idx < 1) {
            // 直接在最前插入
            return insert_str + init_str
        }
        else if (insert_idx > (init_str.length - 1)) {
            // 直接在最后插入
            return init_str + insert_str
        }
        else {
            let start_str = init_str.substring(0, insert_idx)
            let end_str = init_str.substring(insert_idx, init_str.length)
            // console.log('start_str', start_str, 'end_str', end_str)
            return start_str + insert_str + end_str
        }
    }

    DecimalCalculatorMat = (num_str1, num_str2, sign_str) => {
        let shift_num1 = this.ShiftNum(num_str1)
        let shift_num2 = this.ShiftNum(num_str2)
        // console.log('移位数', shift_num1, shift_num2)
        let max_shift_num = Math.max(shift_num1, shift_num2)
        let new_end
        if (['+'].indexOf(sign_str) > -1) {
            let new_num1 = Math.round(eval(num_str1) * Math.pow(10, max_shift_num))
            let new_num2 = Math.round(eval(num_str2) * Math.pow(10, max_shift_num))
            // console.log('扩大数', new_num1, new_num2)
            new_end = Math.round(new_num1 + new_num2)
            // console.log('和', new_end)
            let end_str = new_end.toString()
            let shift_idx = end_str.length - max_shift_num
            let answer_str = this.InsertDecimalStr(end_str, shift_idx, '.')
            answer_str = this.DeleteZerosDecimal(answer_str)
            // console.log('和------最后结果', answer_str)
            return answer_str
        }
        else if (['-'].indexOf(sign_str) > -1) {
            // 移位出现问题========
            let new_num1 = Math.round(eval(num_str1) * Math.pow(10, max_shift_num))
            let new_num2 = Math.round(eval(num_str2) * Math.pow(10, max_shift_num))
            // console.log('扩大数', new_num1, new_num2)
            new_end = Math.round(new_num1 - new_num2)   // 必为整数，即使在小数移位的过程中出现精度问题
            // console.log('差', new_end)
            let end_str = new_end.toString()
            // 未考虑负数情况
            if (end_str.length <= max_shift_num) {
                // 小于待移位长度
                let add_idx = max_shift_num - end_str.length + 1
                for (let idx = 0; idx < add_idx; idx++) {
                    // console.log('end_str----', end_str)
                    end_str = '0' + end_str
                }
            }
            // console.log('end_str', end_str)
            let shift_idx = end_str.length - max_shift_num
            let answer_str = this.InsertDecimalStr(end_str, shift_idx, '.')
            // console.log('差------最后结果', answer_str)
            return answer_str
        }
        else if (['*', 'x', 'X', '×', '×'].indexOf(sign_str) > -1) {
            let new_num1 = Math.round(eval(num_str1) * Math.pow(10, shift_num1))
            let new_num2 = Math.round(eval(num_str2) * Math.pow(10, shift_num2))
            // console.log('扩大数', new_num1, new_num2)
            new_end = new_num1 * new_num2
            // console.log('积', new_end)
            let end_str = new_end.toString()
            // 未考虑负数情况
            if (end_str.length <= (shift_num1 + shift_num2)) {
                // 小于待移位长度
                let add_idx = (shift_num1 + shift_num2) - end_str.length + 1
                for (let idx = 0; idx < add_idx; idx++) {
                    // console.log('end_str----', end_str)
                    end_str = '0' + end_str
                }
            }
            // console.log('end_str', end_str)
            let shift_idx = end_str.length - (shift_num1 + shift_num2)
            let answer_str = this.InsertDecimalStr(end_str, shift_idx, '.')
            answer_str = this.DeleteZerosDecimal(answer_str)
            // console.log('积------最后结果', answer_str)
            return answer_str
        }
        else if (['\\', '÷'].indexOf(sign_str) > -1) {
            let max_shift_num = 0
            shift_num1 > shift_num2 ? max_shift_num = shift_num1 : max_shift_num = shift_num2
            let new_num1 = Math.round(eval(num_str1) * Math.pow(10, max_shift_num))
            let new_num2 = Math.round(eval(num_str2) * Math.pow(10, max_shift_num))
            let answer_str = this.StandardDivCalculator(new_num1, new_num2)
            // console.log('积------最后结果', answer_str)
            return answer_str
        }
        else {
            console.log('未找到计算符')
            return false
        }
    }

    StandardDivCalculator = (int_num1, int_num2) => {
        // 标准除法计算, 利用每次求余数整数求解
        let num1 = int_num1
        let num1_str = num1.toString()
        let num2 = int_num2
        let init_len = num1.toString().length
        // console.log('长度', init_len)
        let answer_str = ''
        let beichu_num2 = ''
        let mod_num2 = ''  // 余
        let flag2 = 0
        while (flag2 < 100) {
            if (flag2 < init_len) {
                if (beichu_num2 == '0') {
                    beichu_num2 = num1_str[flag2]
                }
                else {
                    beichu_num2 = beichu_num2 + num1_str[flag2]
                }
                let div_num = Math.floor(eval(beichu_num2) / num2)
                answer_str += div_num
                // console.log('原始----', beichu_num2, num2,div_num, eval(beichu_num2)%num2, flag2)
                // answer_mat.push(Math.floor(eval(beichu_num)/num2))
                beichu_num2 = (eval(beichu_num2) % num2).toString() // 余数--被除数
            }
            else {
                //  后加0
                beichu_num2 = beichu_num2 + '0'
                let div_num = Math.floor(eval(beichu_num2) / num2)
                answer_str += div_num
                // console.log('加0----', beichu_num2, // 被除数
                //                     num2,// 除数
                //                     div_num, // 商
                //                     eval(beichu_num2)%num2, // 余
                //                     flag2)
                beichu_num2 = (eval(beichu_num2) % num2).toString() // 余数--被除数
            }
            // console.log('beichu_num2', answer_str, flag2, beichu_num2)
            if (answer_str.length >= init_len && beichu_num2 == '0') {
                // 与被除数具有相同的结果长度或大于,且，余数为0
                break
            }
            flag2 += 1
        }
        // console.log(answer_str)
        // 添加小数点
        let new_answer_str = answer_str.slice(0, init_len) + '.' + answer_str.slice(init_len)
        // console.log('新字符', new_answer_str)
        // 去除前端0位
        let flag_num = 0
        while (flag_num < 100 && new_answer_str.length > 1) {
            if (new_answer_str[0] != '0') {
                // 头不为0 跳出
                break
            }
            else if (new_answer_str[0] == '0' && new_answer_str[1] == '.') {
                break
            }
            else {
                new_answer_str = new_answer_str.slice(1)
            }
            // console.log('answer_str', new_answer_str)
            flag_num += 1
        }
        // console.log('end_answer_str', new_answer_str)
        if (new_answer_str[new_answer_str.length - 1] == '.') {
            new_answer_str = new_answer_str.slice(0, new_answer_str.length - 1)
        }
        // console.log('end_answer_str', new_answer_str)
        return new_answer_str
    }

    DecimalCalculatorStr = (test_str) => {
        let calculator_mat = this.GetStrComputeSign(test_str)
        // console.log('分离字符串', calculator_mat)
        let num_str1 = calculator_mat[0]
        let sign_str = calculator_mat[1]
        let num_str2 = calculator_mat[2]
        return this.DecimalCalculatorMat(num_str1, num_str2, sign_str)
    }

    DeleteZerosDecimal = (init_str) => {
        // 删除末尾0和小数点
        let find_decimal_idx = init_str.search(/[.]/i)
        if (find_decimal_idx < 0) {
            return init_str
        }
        else {
            for (let idx = init_str.length - 1; idx >= find_decimal_idx; idx--) {
                if (init_str[idx] == '0' || init_str[idx] == '.') {
                    // 删除末尾字符
                    init_str = init_str.substr(0, idx)
                }
                else {
                    return init_str
                }
            }
            return init_str
        }
    }
}

let decimal_calculator = new DecimalCalculatorFunc()
class MathBaseCaculateFunc {
    isOperator = (value) => {
        let operatorString = "+-*/()";
        return operatorString.indexOf(value) > -1
    }

    getPrioraty = (value) => {
        switch (value) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            default:
                return 0;
        }
    }

    splitstr = (str) => {
        // 字符串分离
        let strnum = str.match(/\d+(\.\d+)?/g);  //提取数字
        let strsymbol = str.replace(/\d+(\.\d+)?/g, ' '); //替换数字 
        let strmat = [];
        let numint = 0;
        for (let ii = 0; ii < strsymbol.length; ii++) {
            //console.log(strsymbol[ii])
            if (strsymbol[ii] == ' ') {
                strmat[ii] = strnum[numint];
                numint += 1;
            }
            else {
                strmat[ii] = strsymbol[ii];
            }
        }
        return strmat;
    }

    prioraty = (o1, o2) => {
        return this.getPrioraty(o1) <= this.getPrioraty(o2);
    }

    instr2suffixmat = (exp0) => {
        let inputStack = [];
        let outputStack = [];
        let outputQueue = [];
        let exp = this.standardstr(exp0);
        inputStack = this.splitstr(exp);
        while (inputStack.length > 0) {
            let cur = inputStack.shift();
            if (this.isOperator(cur)) {
                if (cur == '(') {
                    outputStack.push(cur);
                } else if (cur == ')') {
                    let po = outputStack.pop();
                    while (po != '(' && outputStack.length > 0) {
                        outputQueue.push(po);
                        po = outputStack.pop();
                    }
                    if (po != '(') {
                        throw "error: unmatched ()";
                    }
                } else {
                    while (this.prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0) {
                        outputQueue.push(outputStack.pop());
                    }
                    outputStack.push(cur);
                }
            } else {
                outputQueue.push(new Number(cur));
            }
        }
        //console.log('step two');
        if (outputStack.length > 0) {
            if (outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '(') {
                throw "error: unmatched ()";
            }
            while (outputStack.length > 0) {
                outputQueue.push(outputStack.pop());
            }
        }
        //console.log('step three');
        //console.log(outputQueue)
        return outputQueue;
        //return outputStack;
    }

    caculateSuffixstr = (suffixstr) => {
        //计算后缀表达式的值
        let str = this.copyArr(suffixstr); //深度拷贝
        let symbols = '+-*/';
        let matchstr = ' ';
        let num1, num2, sumstr, sumnum;
        let strsize = str.length;
        while (strsize > 1) {
            for (let ii = 0; ii < strsize; ii++) {
                matchstr = str[ii];
                //str.indexOf("3") != -1；str.search("3") != -1
                if (symbols.indexOf(matchstr) != -1) {
                    num1 = str[ii - 2];
                    num2 = str[ii - 1];
                    switch (matchstr) {
                        case '+':
                            sumnum = this.formatNum(num1 + num2, 5);
                            break;
                        case '-':
                            sumnum = this.formatNum(num1 - num2, 5);
                            break;
                        case '*':
                            sumnum = this.formatNum(num1 * num2, 5);
                            break;
                        case '/':
                            sumnum = this.formatNum(num1 / num2, 5);
                            break;
                    }
                    //sumnum=math.eval(sumstr);
                    str.splice(ii - 2, 3, sumnum);
                    strsize = str.length;
                    //console.log(str);
                    break;
                }
            }
            strsize = str.length;
            //console.log(strsize)
            //console.log(str.indexOf("3") != -1 );
        }//while
        return str;
    }

    standardstr = (str) => {
        //转换标准可计算字符串
        if (typeof (str) != 'string') {
            // 非字符串返回
            return str
        }
        // console.log('str', str)
        str = str.replace(/\s*/g, ""); //去除空格
        str = str.replace(/\[/g, "(");
        str = str.replace(/\{/g, "(");
        str = str.replace(/\]/g, ")");
        str = str.replace(/\}/g, ")");
        str = str.replace(/x/g, "*");
        str = str.replace(/×/g, "*");
        str = str.replace(/X/g, "*");
        str = str.replace(/\÷/g, "/");
        str = str.replace(/\﹣/g, "-");

        //str=str.replace(/\(/g,"[");
        //console.log(str);
        //console.log(math.eval(str));
        return str;
    }

    standardsymbol = (strmat0) => {
        strmat0 = strmat0.replace(/\*/g, "x");
        strmat0 = strmat0.replace(/\//g, "÷");
        return strmat0;
    }

    caculateSuffixOne = (suffixstr) => {
        //计算后缀表达式的值
        let str = this.copyArr(suffixstr); //深度拷贝
        let symbols = '+-*/';
        let matchstr = ' ';
        let num1, num2, sumstr, sumnum;
        let strsize = str.length;
        for (let ii = 0; ii < strsize; ii++) {
            matchstr = str[ii];
            //str.indexOf("3") != -1；str.search("3") != -1
            if (symbols.indexOf(matchstr) != -1) {
                num1 = str[ii - 2];
                num2 = str[ii - 1];
                //sumstr=num1+matchstr+num2;
                //console.log(typeof sumstr)
                //console.log(sumstr)
                //sumnum=math.eval(sumstr);
                switch (matchstr) {
                    case '+':
                        sumnum = this.formatNum(num1 + num2, 5);
                        break;
                    case '-':
                        sumnum = this.formatNum(num1 - num2, 5);
                        break;
                    case '*':
                        sumnum = this.formatNum(num1 * num2, 5);
                        break;
                    case '/':
                        sumnum = this.formatNum(num1 / num2, 5);
                        break;
                }
                str.splice(ii - 2, 3, sumnum);
                strsize = str.length;
                //console.log(str);
                break;
            }
        }
        strsize = str.length;
        //console.log(strsize)
        //console.log(str.indexOf("3") != -1 );
        return str;
    }

    extractSuffixOne = (suffixstr) => {
        //提取一步后缀表达式矩阵
        let str = this.copyArr(suffixstr); //深度拷贝
        let symbols = '+-*/';
        let matchstr = ' ';
        let num1, num2, sumstr, sumnum, symbolestr;
        let strsize = str.length;
        for (let ii = 0; ii < strsize; ii++) {
            matchstr = str[ii];
            //str.indexOf("3") != -1；str.search("3") != -1
            if (symbols.indexOf(matchstr) != -1) {
                num1 = str[ii - 2];
                num2 = str[ii - 1];
                symbolestr = str[ii - 0];
                break;
            }
        }
        //strsize=str.length;
        let stronestepmat = new Array(3);
        stronestepmat[0] = num1;
        stronestepmat[1] = num2;
        stronestepmat[2] = symbolestr;
        return stronestepmat;
    }

    suffix2infix = (strmat) => {
        //后缀表达式转中缀表达式，对应中括号等，一般书写格式
        let symbols = '+-*/';
        let symbols2 = '*/';
        let matsize = strmat.length;
        let strmat0 = this.copyArr(strmat); //深拷贝
        let objstr = new Array(matsize);
        for (let ii = 0; ii < matsize; ii++) {
            objstr[ii] = new Array(5);
            objstr[ii]['mathstr0'] = strmat0[ii];
            objstr[ii]['combtag'] = 0;
            objstr[ii]['resymbol'] = '';
            objstr[ii]['bracket'] = 0;
            if (symbols2.indexOf(strmat0[ii]) != -1) {
                //+-号标记为0，*/号标记为1
                objstr[ii]['symbollevel'] = 1;
            }
            else {
                objstr[ii]['symbollevel'] = 0;
            }
        }

        while (matsize > 1) {
            for (let ii = 0; ii < strmat0.length; ii++) {
                let part0 = strmat0[ii];
                if (symbols.indexOf(part0) != -1) {
                    let combstr = '';
                    if ((objstr[ii - 1]['combtag'] === 0) && (objstr[ii - 2]['combtag'] === 0)) {
                        //前面两项都没有操作标记，直接组合字符串
                        combstr = strmat0[ii - 2] + part0 + strmat0[ii - 1];
                        strmat0.splice(ii - 2, 3, combstr);
                        objstr.splice(ii - 1, 2)
                        objstr[ii - 2]['mathstr0'] = combstr;
                        objstr[ii - 2]['combtag'] = 1;
                        objstr[ii - 2]['resymbol'] = part0;
                        objstr[ii - 2]['bracket'] = 0;
                        if (symbols2.indexOf(part0) != -1) {
                            // if (symbols2.indexOf(strmat0[ii])!=-1){
                            // 修改 2020-11-04
                            //+-号标记为0，*/号标记为1
                            objstr[ii - 2]['symbollevel'] = 1;
                        }
                        else {
                            objstr[ii - 2]['symbollevel'] = 0;
                        }
                    }
                    else {
                        // 如果出现组合标记,比较两种符号的优先级是否添加括号，再判断添加括号的情况
                        if (symbols2.indexOf(part0) != -1) {
                            // 出现乘除号，考虑前后可能添加括号的情况
                            //console.log(objstr[1]['bracket']);
                            //console.log(objstr[2]['bracket']);
                            //console.log(objstr[2]['bracket'])
                            if ((objstr[ii - 2]['combtag'] === 1) && (objstr[ii - 1]['combtag'] === 1)) {
                                //同时出现组合情况---分别判定各自存在括号的情况
                                let str001 = '', str002 = '';
                                let num001 = 0, num002 = 0;
                                if (objstr[ii - 2]['symbollevel'] == 0) {
                                    // 新增2020-11-04
                                    if (objstr[ii - 2]['bracket'] === 0) {
                                        str001 = '(' + objstr[ii - 2]['mathstr0'] + ')';
                                        num001 = 1;
                                    }
                                    else if (objstr[ii - 2]['bracket'] === 1) {
                                        str001 = '[' + objstr[ii - 2]['mathstr0'] + ']';
                                        num001 = 2;
                                    }
                                    else {
                                        str001 = '{' + objstr[ii - 2]['mathstr0'] + '}';
                                        num001 = 3;
                                    }
                                }
                                else {
                                    // 新增2020-11-04
                                    str001 = objstr[ii - 2]['mathstr0']
                                }


                                if (objstr[ii - 1]['bracket'] === 0) {
                                    str002 = '(' + objstr[ii - 1]['mathstr0'] + ')';
                                    num002 = 1;
                                }
                                else if (objstr[ii - 1]['bracket'] === 1) {
                                    str002 = '[' + objstr[ii - 1]['mathstr0'] + ']';
                                    num002 = 2;
                                }
                                else {
                                    str002 = '{' + objstr[ii - 1]['mathstr0'] + '}';
                                    num002 = 3;
                                }
                                combstr = str001 + part0 + str002;
                                strmat0.splice(ii - 2, 3, combstr);
                                objstr.splice(ii - 1, 2)
                                objstr[ii - 2]['mathstr0'] = combstr;
                                objstr[ii - 2]['combtag'] = 1;
                                objstr[ii - 2]['resymbol'] = part0;
                                objstr[ii - 2]['symbollevel'] = 1;
                                objstr[ii - 2]['bracket'] = Math.max(num001, num002); //保留大值				    							     				
                            }
                            else if ((objstr[ii - 2]['combtag'] === 0) && (objstr[ii - 1]['combtag'] === 1)) {
                                //第二个字符串是组合情况
                                //var objstr0=objstr[ii-1].mathstr0;
                                let bracketnum = objstr[ii - 1]['bracket'];
                                if (objstr[ii - 1]['bracket'] >= 2) {
                                    //出现中括号添加大括号
                                    combstr = strmat0[ii - 2] + part0 + '{' + strmat0[ii - 1] + '}';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                                else if (objstr[ii - 1]['bracket'] === 1) {
                                    combstr = strmat0[ii - 2] + part0 + '[' + strmat0[ii - 1] + ']';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                                else {
                                    combstr = strmat0[ii - 2] + part0 + '(' + strmat0[ii - 1] + ')';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                            }
                            else if ((objstr[ii - 2]['combtag'] === 1) && (objstr[ii - 1]['combtag'] === 0)) {
                                //第一个字符串是组合情况
                                let bracketnum = objstr[ii - 1]['bracket'];
                                if (objstr[ii - 2]['symbollevel'] == 0) {
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    if (objstr[ii - 2]['bracket'] >= 2) {
                                        //出现中括号添加大括号
                                        combstr = '{' + strmat0[ii - 2] + '}' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                    }
                                    else if (objstr[ii - 2]['bracket'] === 1) {
                                        combstr = '[' + strmat0[ii - 2] + ']' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                    }
                                    else {
                                        combstr = '(' + strmat0[ii - 2] + ')' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                        //console.log(objstr[2]['bracket'])
                                    }
                                }
                                else {
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    combstr = strmat0[ii - 2] + part0 + strmat0[ii - 1];
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum;
                                }
                            }
                        }
                        else if (symbols.indexOf(part0) != -1) {
                            // 出现乘除号，考虑前后可能添加括号的情况
                            //console.log(objstr[1]['bracket']);
                            //console.log(objstr[2]['bracket']);
                            //console.log(objstr[2]['bracket'])
                            if ((objstr[ii - 2]['combtag'] === 1) && (objstr[ii - 1]['combtag'] === 1)) {
                                //同时出现组合情况---分别判定各自存在括号的情况
                                let str001 = '', str002 = '';
                                let num001 = 0, num002 = 0;
                                if (objstr[ii - 2]['symbollevel'] == 0) {
                                    // 新增2020-11-04
                                    if (objstr[ii - 2]['bracket'] === 0) {
                                        str001 = objstr[ii - 2]['mathstr0'];
                                        num001 = 0;
                                    }
                                    else if (objstr[ii - 2]['bracket'] === 1) {
                                        str001 = objstr[ii - 2]['mathstr0'];
                                        num001 = 1;
                                    }
                                    else {
                                        str001 = objstr[ii - 2]['mathstr0'];
                                        num001 = 2;
                                    }
                                }
                                else {
                                    // 新增2020-11-04
                                    str001 = objstr[ii - 2]['mathstr0']
                                }

                                if (objstr[ii - 1]['symbollevel'] == 1) {
                                    str002 = objstr[ii - 1]['mathstr0'];
                                    num002 = objstr[ii - 1]['bracket'];
                                }
                                else if (objstr[ii - 1]['bracket'] === 0) {
                                    str002 = '(' + objstr[ii - 1]['mathstr0'] + ')';
                                    num002 = 1;
                                }
                                else if (objstr[ii - 1]['bracket'] === 1) {
                                    str002 = '[' + objstr[ii - 1]['mathstr0'] + ']';
                                    num002 = 2;
                                }
                                else {
                                    str002 = '{' + objstr[ii - 1]['mathstr0'] + '}';
                                    num002 = 3;
                                }
                                combstr = str001 + part0 + str002;
                                strmat0.splice(ii - 2, 3, combstr);
                                objstr.splice(ii - 1, 2)
                                objstr[ii - 2]['mathstr0'] = combstr;
                                objstr[ii - 2]['combtag'] = 1;
                                objstr[ii - 2]['resymbol'] = part0;
                                objstr[ii - 2]['symbollevel'] = 1;
                                objstr[ii - 2]['bracket'] = Math.max(num001, num002); //保留大值				    							     				
                            }
                            else if ((objstr[ii - 2]['combtag'] === 0) && (objstr[ii - 1]['combtag'] === 1)) {
                                //第二个字符串是组合情况
                                //var objstr0=objstr[ii-1].mathstr0;
                                let bracketnum = objstr[ii - 1]['bracket'];
                                if (objstr[ii - 1]['symbollevel'] == 1) {
                                    //出现中括号添加大括号 新增计算符号等级更高
                                    combstr = strmat0[ii - 2] + part0 + strmat0[ii - 1];
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum;
                                }
                                else if (objstr[ii - 1]['bracket'] >= 2) {
                                    //出现中括号添加大括号
                                    combstr = strmat0[ii - 2] + part0 + '{' + strmat0[ii - 1] + '}';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                                else if (objstr[ii - 1]['bracket'] === 1) {
                                    combstr = strmat0[ii - 2] + part0 + '[' + strmat0[ii - 1] + ']';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                                else {
                                    combstr = strmat0[ii - 2] + part0 + '(' + strmat0[ii - 1] + ')';
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum + 1;
                                }
                            }
                            else if ((objstr[ii - 2]['combtag'] === 1) && (objstr[ii - 1]['combtag'] === 0)) {
                                //第一个字符串是组合情况
                                let bracketnum = objstr[ii - 1]['bracket'];
                                if (objstr[ii - 2]['symbollevel'] == 0) {
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    if (objstr[ii - 2]['bracket'] >= 2) {
                                        //出现中括号添加大括号
                                        combstr = '{' + strmat0[ii - 2] + '}' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                    }
                                    else if (objstr[ii - 2]['bracket'] === 1) {
                                        combstr = '[' + strmat0[ii - 2] + ']' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                    }
                                    else {
                                        combstr = '(' + strmat0[ii - 2] + ')' + part0 + strmat0[ii - 1];
                                        strmat0.splice(ii - 2, 3, combstr);
                                        objstr.splice(ii - 1, 2)
                                        objstr[ii - 2]['mathstr0'] = combstr;
                                        objstr[ii - 2]['combtag'] = 1;
                                        objstr[ii - 2]['resymbol'] = part0;
                                        objstr[ii - 2]['symbollevel'] = 1;
                                        objstr[ii - 2]['bracket'] = bracketnum + 1;
                                        //console.log(objstr[2]['bracket'])
                                    }
                                }
                                else {
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    combstr = strmat0[ii - 2] + part0 + strmat0[ii - 1];
                                    strmat0.splice(ii - 2, 3, combstr);
                                    objstr.splice(ii - 1, 2)
                                    objstr[ii - 2]['mathstr0'] = combstr;
                                    objstr[ii - 2]['combtag'] = 1;
                                    objstr[ii - 2]['resymbol'] = part0;
                                    objstr[ii - 2]['symbollevel'] = 1;
                                    objstr[ii - 2]['bracket'] = bracketnum;
                                }
                            }
                        }
                        else {
                            // 如果是加减号直接组合字符串，部分其他情况
                            let num1 = objstr[ii - 2]['bracket'];
                            let num2 = objstr[ii - 1]['bracket'];
                            combstr = strmat0[ii - 2] + part0 + strmat0[ii - 1];
                            strmat0.splice(ii - 2, 3, combstr);
                            objstr.splice(ii - 1, 2)
                            objstr[ii - 2]['mathstr0'] = combstr;
                            objstr[ii - 2]['combtag'] = 1;
                            objstr[ii - 2]['resymbol'] = part0;
                            objstr[ii - 2]['symbollevel'] = 0;
                            objstr[ii - 2]['bracket'] = Math.max(num1, num2); //保留大值
                        }
                    }
                    //console.log(strmat0)
                    break;
                    //console.log('s')
                }
            }
            matsize = strmat0.length;
        }
        //console.log(matsize)
        let infixstr = strmat0[0];
        //console.log(infixstr)
        infixstr = infixstr.replace(/\*/g, "x");
        infixstr = infixstr.replace(/\//g, "÷");
        return infixstr;
    }
    copyArr = (father) => {
        let res = []
        for (let i = 0; i < father.length; i++) {
            res.push(father[i])
        }
        return res
    }
    formatNum = (f, digit) => {
        let m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    }

    CaculateStepStr = (str) => {
        //var str1=copyArr(str);
        let stepstr = [], infixstr = [], ii = 0;
        let suffixstr = this.instr2suffixmat(str); // 中缀转后缀
        console.log('suffixstr后缀表达式', suffixstr)
        let stepstr0 = this.suffix2infix(suffixstr)
        stepstr[ii] = '  ' + stepstr0;
        console.log(stepstr[0])
        while (suffixstr.length > 2) {
            ii += 1;
            suffixstr = this.caculateSuffixOne(suffixstr);
            // console.log(suffixstr)
            if (suffixstr.length > 1) {
                infixstr = this.suffix2infix(suffixstr);
            }
            else {
                infixstr = suffixstr
            }
            stepstr[ii] = '=' + infixstr;
            //console.log(stepstr[ii])
            //分步计算
        }
        return stepstr;
    }

    integerGCDfunc = (num1, num2) => {
        //求两个整数的最大公约:扩展到小数
        let max_idx;
        for (let ii = 0; ii < 100; ii++) {
            // console.log('gcd:ii',num1*Math.pow(10,ii), num2*Math.pow(10,ii)%1)
            if ((num1 * Math.pow(10, ii) % 1 == 0) && (num2 * Math.pow(10, ii) % 1 == 0)) {
                // 同时为整，记录扩大次数
                max_idx = ii
                break;
            }
        }
        // console.log('公约数次幂', max_idx)
        let gcdnum1 = num1 * Math.pow(10, max_idx);
        let gcdnum2 = num2 * Math.pow(10, max_idx);
        let gcdnum3 = 0;
        //判断整数
        if ((Math.floor(gcdnum1) === gcdnum1) && (Math.floor(gcdnum2) === gcdnum2)) {
            while (1) {
                gcdnum3 = gcdnum1 % gcdnum2;
                gcdnum1 = gcdnum2;
                gcdnum2 = gcdnum3;
                if (gcdnum3 == 0) {
                    gcdnum3 = gcdnum1;
                    break;
                }
            }
        }
        else {
            gcdnum3 = 1;
        }
        return gcdnum3 / Math.pow(10, max_idx);
    }

    integerLCMfunc = (num1, num2) => {
        //求两个整数的最小公倍数
        let lcmnum1 = num1;
        let lcmnum2 = num2;
        //先求最大公约数再求最小公倍数
        let lcmnum3 = this.integerGCDfunc(lcmnum1, lcmnum2);
        let lcmnum4 = parseInt(lcmnum1 * lcmnum2 / lcmnum3);
        return lcmnum4;

    }
    integerFactorsfunc = (num1) => {
        //寻找因数
        let factornum1 = num1;
        let factormat = new Array(1);
        factormat[0] = 1;
        if (Math.floor(factornum1) === factornum1) {
            for (let ii = 2; ii <= factornum1; ii++) {
                if (factornum1 % ii == 0) {
                    factormat.push(ii);
                }
            }
        }
        return factormat;
    }

    integerPrimeFactorsfunc = (num1) => {
        //寻找质因数
        let factornum1 = num1;
        let factormat = new Array;
        //factormat[0]=1;
        if (Math.floor(factornum1) === factornum1) {
            for (let ii = 2; ii <= factornum1; ii++) {
                if (factornum1 % ii == 0) {
                    factornum1 = factornum1 / ii;
                    factormat.push(ii);
                    ii = 2;
                }
            }
        }
        return factormat;
    }

    findPrimenumfunc = (num1) => {
        //寻找num1以内的质数
        let maxnum1 = num1;
        let primenummat = [];
        if (maxnum1 > 1) {
            for (var jj = 2; jj <= maxnum1; jj++) {
                var partnummat = this.integerPrimeFactorsfunc(jj);
                //console.log(partnummat)
                //console.log(partnummat.length)
                if (partnummat.length == 1) {
                    primenummat.push(jj);
                }
            }
        }
        else {
            primenummat = 1;
        }
        return primenummat;
    }

    FractionCaculate = (num0_mat1, num0_mat2, caculate_mode) => {
        // 根据加减乘除选用不同的计算模块, 根据需求转换结果样式，默认保存为最简分数样式，不用带分数
        // 后续还需考虑分数情况
        // console.log('计算-----', caculate_mode)
        // 数据类型转换
        // if()
        let num_mat1 = this.OtherTypeTurnOtherType(num0_mat1)['fraction']
        let num_mat2 = this.OtherTypeTurnOtherType(num0_mat2)['fraction']
        // console.log('num_mat1/num_mat2转换', num_mat1, num_mat2)
        let answer_mat
        if (caculate_mode == 0 || caculate_mode == '+') {
            // console.log('计算2',num_mat1,num_mat2, caculate_mode)
            answer_mat = this.FractionAdd(num_mat1, num_mat2)
        }
        else if (caculate_mode == 1 || caculate_mode == '-') {
            answer_mat = this.FractionSubtract(num_mat1, num_mat2)

        }
        else if (caculate_mode == 2 || caculate_mode == 'x' || caculate_mode == '*' || caculate_mode == 'X' || caculate_mode == '×') {
            // console.log('乘法计算',num_mat1,num_mat2)

            answer_mat = this.FractionMultiply(num_mat1, num_mat2)

        }
        else if (caculate_mode == 3 || caculate_mode == '/' || caculate_mode == '÷') {
            answer_mat = this.FractionDivide(num_mat1, num_mat2)

        }
        else {
            console.log('计算模式有错误')
            answer_mat = []
        }
        return answer_mat
    }

    MixedTurnFraction = (num_mat) => {
        // 带分数转分数
        let mixed_fraction_int = eval(this.standardstr(num_mat[0]))
        let mixed_fraction_denominator = eval(this.standardstr(num_mat[1]))
        let mixed_fraction_numerator = eval(this.standardstr(num_mat[2]))
        let fraction_denominator = mixed_fraction_int * mixed_fraction_numerator + mixed_fraction_denominator
        let fraction_numerator = mixed_fraction_numerator
        return [fraction_denominator.toString(), fraction_numerator.toString()]
    }

    FractionAdd = (num_mat1, num_mat2) => {
        // 如果两个都是非分数则直接计算
        let answer_mat
        // console.log('num_mat1', num_mat1)
        if (num_mat1.length > 1 || num_mat2.length > 1) {
            // 分数计算规则
            // 带分数转换
            // console.log('num_mat2', num_mat1)
            let caculate_num1, caculate_num2;
            if (num_mat1.length == 1) {
                // console.log('num_mat3', num_mat1)
                // 整数、小数、百分数转换
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if (num_mat1.length == 3) {
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else {
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            // console.log('加法caculate_num1',caculate_num1)
            if (num_mat2.length == 1) {
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if (num_mat2.length == 3) {
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else {
                // console.log('num_mat2', num_mat2)
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            // console.log('加法caculate_num2',caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0]) * eval(caculate_num2[1]) + eval(caculate_num1[1]) * eval(caculate_num2[0]), 10)
            let add_denominator = this.formatNum(eval(caculate_num1[1]) * eval(caculate_num2[1]), 10)
            let max_gcd = this.integerGCDfunc(add_numerator, add_denominator)
            let numerator_num, denominator_num
            if (max_gcd < 0) {
                numerator_num = parseInt(-add_numerator / max_gcd)
                denominator_num = parseInt(-add_denominator / max_gcd)
            }
            else {
                numerator_num = parseInt(add_numerator / max_gcd)
                denominator_num = parseInt(add_denominator / max_gcd)
            }
            answer_mat = [numerator_num.toString(), denominator_num.toString()]
        }
        else {
            // 纯小数计算规则
            // 需添加纯小数计算2021-10-28
            // let answer_num = this.formatNum(eval(num_mat1[0])+eval(num_mat2[0]),10)
            let answer_num = decimal_calculator.DecimalCalculatorStr(num_mat1[0] + '+' + num_mat2[0])
            answer_mat = [answer_num.toString()]
            // console.log('加法结果', answer_num, answer_mat)
        }
        return answer_mat;
    }

    FractionSubtract = (num_mat1, num_mat2) => {
        // 如果两个都是非分数则直接计算
        // console.log('减法', num_mat1,num_mat2)
        let answer_mat
        if (num_mat1.length > 1 || num_mat2.length > 1) {
            // 分数计算规则
            let caculate_num1, caculate_num2;
            if (num_mat1.length == 1) {
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if (num_mat1.length == 3) {
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else {
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1) {
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if (num_mat2.length == 3) {
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else {
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0]) * eval(caculate_num2[1]) - eval(caculate_num1[1]) * eval(caculate_num2[0]), 10)
            let add_denominator = this.formatNum(eval(caculate_num1[1]) * eval(caculate_num2[1]), 10)
            let max_gcd = this.integerGCDfunc(add_numerator, add_denominator)
            let numerator_num, denominator_num
            if (max_gcd < 0) {
                numerator_num = parseInt(-add_numerator / max_gcd)
                denominator_num = parseInt(-add_denominator / max_gcd)
            }
            else {
                numerator_num = parseInt(add_numerator / max_gcd)
                denominator_num = parseInt(add_denominator / max_gcd)
            }
            // console.log('add_numerator',add_numerator,add_denominator,max_gcd,numerator_num,denominator_num)
            answer_mat = [numerator_num.toString(), denominator_num.toString()]
        }
        else {
            // 需添加纯小数计算2021-10-28
            // let answer_num = this.formatNum(eval(num_mat1[0])-eval(num_mat2[0]),10)
            // console.log('纯小数计算===========', num_mat1[0], num_mat2[0])
            let answer_num = decimal_calculator.DecimalCalculatorStr(num_mat1[0] + '-' + num_mat2[0])
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    FractionMultiply = (num_mat1, num_mat2) => {
        // 如果两个都是非分数则直接计算
        // console.log('乘法模块', num_mat1.length,num_mat2.length)
        let answer_mat
        if (num_mat1.length >= 1 || num_mat2.length >= 1) {
            // 分数计算规则
            // console.log('乘法模块2', num_mat1.length,num_mat2.length)
            let caculate_num1, caculate_num2;
            if (num_mat1.length == 1) {
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if (num_mat1.length == 3) {
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else {

                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1) {
                caculate_num2 = this.NumberTurnFraction(num_mat2)
                // console.log('分数', caculate_num2)
            }
            else if (num_mat2.length == 3) {
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else {

                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            // console.log('乘法', caculate_num1, caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0]) * eval(caculate_num2[0]), 10)
            let add_denominator = this.formatNum(eval(caculate_num1[1]) * eval(caculate_num2[1]), 10)
            let max_gcd = this.integerGCDfunc(add_numerator, add_denominator)
            let numerator_num, denominator_num
            if (max_gcd < 0) {
                numerator_num = parseInt(-add_numerator / max_gcd)
                denominator_num = parseInt(-add_denominator / max_gcd)
            }
            else {
                numerator_num = parseInt(add_numerator / max_gcd)
                denominator_num = parseInt(add_denominator / max_gcd)
            }
            answer_mat = [numerator_num.toString(), denominator_num.toString()]
        }
        else {
            // 需添加纯小数计算2021-10-28
            let answer_num = this.formatNum(eval(num_mat1[0]) * eval(num_mat2[0]), 10)
            answer_mat = [answer_num.toString()]
        }
        // console.log('乘法answer_mat', answer_mat)
        return answer_mat;
    }

    FractionDivide = (num_mat1, num_mat2) => {
        // 如果两个都是非分数则直接计算
        // console.log('==========', num_mat1,num_mat2)
        let answer_mat
        if (num_mat1.length >= 1 || num_mat2.length >= 1) {
            // 分数计算规则
            let caculate_num1, caculate_num2;
            if (num_mat1.length == 1) {
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if (num_mat1.length == 3) {
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else {
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1) {
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if (num_mat2.length == 3) {
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else {
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            // console.log('--------',caculate_num1,caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0]) * eval(caculate_num2[1]), 10)
            let add_denominator = this.formatNum(eval(caculate_num1[1]) * eval(caculate_num2[0]), 10)
            // console.log('--------',add_numerator,add_denominator)
            let max_gcd = this.integerGCDfunc(add_numerator, add_denominator)
            let numerator_num, denominator_num
            if (max_gcd < 0) {
                numerator_num = parseInt(-add_numerator / max_gcd)
                denominator_num = parseInt(-add_denominator / max_gcd)
            }
            else {
                numerator_num = parseInt(add_numerator / max_gcd)
                denominator_num = parseInt(add_denominator / max_gcd)
            }
            answer_mat = [numerator_num.toString(), denominator_num.toString()]
        }
        else {
            // 需添加纯小数计算
            let answer_num = this.formatNum(eval(num_mat1[0]) / eval(num_mat2[0]), 10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    NumberTurnFraction = (num_mat) => {
        // 将数字转换为最简分数，如果是整数，分母为1
        let num_num;
        // 转换标准数字计算
        if (typeof (num_mat) == 'object') {
            // console.log("num_mat[0]", num_mat[0])
            // 处理百分数情况
            if (num_mat[0].indexOf('%') >= 0) {
                let percentage_str = num_mat[0].split('%')[0]
                // console.log('百分数字符串', percentage_str)
                // 后期修正eval类出发 num_str1, num_str2, sign_str
                num_num = eval(percentage_str) / 100 // 有可能导致除法精度 
                // 修正
                let decimal_num1 = decimal_calculator.DecimalCalculatorMat(percentage_str, '100', '÷')
                // let decimal_num2 = decimal_calculator.DecimalCalculatorMat(percentage_str, '0.01', 'x')
                // console.log('小数除法修正', decimal_num1)    
                // console.log('小数乘法修正',decimal_num2)  
                num_num = eval(decimal_num1)

            }
            else {

                num_num = eval(num_mat[0])
            }
        }
        else {
            num_num = eval(num_mat)
        }
        // 分子分母转换
        let numerator_num, denominator_num;
        if (num_num % 1 == 0) {
            numerator_num = parseInt(num_num)
            denominator_num = 1
        }
        else {
            let ii_mi = 0
            for (let ii = 1; ii < 100; ii++) {
                let num_num_1 = num_num * Math.pow(10, ii);
                if (num_num_1 % 1 == 0) {
                    ii_mi = ii;
                    break
                }
            }
            // console.log('次方', ii_mi)
            let numerator_num0 = num_num * Math.pow(10, ii_mi)
            let denominator_num0 = Math.pow(10, ii_mi)
            // 找最大公约数
            let max_gcd = this.integerGCDfunc(numerator_num0, denominator_num0)
            if (max_gcd < 0) {
                numerator_num = parseInt(-numerator_num0 / max_gcd)
                denominator_num = parseInt(-denominator_num0 / max_gcd)
            }
            else {
                numerator_num = parseInt(numerator_num0 / max_gcd)
                denominator_num = parseInt(denominator_num0 / max_gcd)
            }
        }
        // console.log('numerator_num',numerator_num, 'denominator_num',denominator_num)
        return [numerator_num.toString(), denominator_num.toString()]
    }

    OtherTurnFraction = (num_mat) => {
        // 其他类型转换分数
        let num_num;
        // 转换标准数字计算
        if (typeof (num_mat) == 'object') {
            // console.log("num_mat[0]", num_mat[0])
            // 处理百分数情况
            if (num_mat[0].indexOf('%') >= 0) {
                let percentage_str = num_mat[0].split('%')[0]
                // console.log('百分数字符串', percentage_str)
                // 后期修正eval类出发
                num_num = eval(percentage_str) / 100
            }
            else {
                num_num = eval(num_mat[0])
            }
        }
        else {
            num_num = eval(num_mat)
        }
        // 分子分母转换
        let numerator_num, denominator_num;
        if (num_num % 1 == 0) {
            numerator_num = parseInt(num_num)
            denominator_num = 1
        }
        else {
            let ii_mi = 0
            for (let ii = 1; ii < 100; ii++) {
                let num_num_1 = num_num * Math.pow(10, ii);
                if (num_num_1 % 1 == 0) {
                    ii_mi = ii;
                    break
                }
            }
            // console.log('次方', ii_mi)
            let numerator_num0 = num_num * Math.pow(10, ii_mi)
            let denominator_num0 = Math.pow(10, ii_mi)
            // 找最大公约数
            let max_gcd = this.integerGCDfunc(numerator_num0, denominator_num0)
            if (max_gcd < 0) {
                numerator_num = parseInt(-numerator_num0 / max_gcd)
                denominator_num = parseInt(-denominator_num0 / max_gcd)
            }
            else {
                numerator_num = parseInt(numerator_num0 / max_gcd)
                denominator_num = parseInt(denominator_num0 / max_gcd)
            }
        }
        // console.log('numerator_num',numerator_num, 'denominator_num',denominator_num)
        return [numerator_num.toString(), denominator_num.toString()]
    }


    RecognizeMatTurnStandardMat = (rec_mat) => {
        // model_mat 包含初始数字编码，和统一表达式字母，后续插入：真实值、数值类型、真实字母代码
        let model_mat = [[1, 'A'], [2, 'B'], [3, 'C'], [4, 'D'], [5, 'E'], [6, 'F'], [7, 'G'], [8, 'H'], [9, 'I'], [10, 'J'], [11, 'K'], [12, 'L'], [13, 'M'], [14, 'N'], [15, 'O']]
        // console.log(model_mat)
        let replace_mat = []
        let idx_a = -1
        for (let ii = 0; ii < rec_mat.length; ii++) {
            // 主要判断数据为数字字符串
            if (rec_mat[ii].length == 3) {
                idx_a += 1
                model_mat[idx_a].push(rec_mat[ii])
                replace_mat.push([model_mat[idx_a][0].toString()])
            }
            else {
                if (['+', '-', 'x', '/', '*', 'X', '×', '÷', '(', ')', '[', ']', '{', '}'].indexOf(rec_mat[ii][0]) < 0) {
                    // 如果不是计算符号
                    idx_a += 1
                    model_mat[idx_a].push(rec_mat[ii])
                    replace_mat.push([model_mat[idx_a][0].toString()])
                }
                else {
                    replace_mat.push(rec_mat[ii])
                }
            }
        }
        // console.log('变量替换',model_mat)
        // console.log('原始', rec_mat)
        // console.log('替换', replace_mat)
        let replace_str = ''
        for (let ii = 0; ii < replace_mat.length; ii++) {
            replace_str += replace_mat[ii][0]
        }
        let infix_str_mat = []
        infix_str_mat.push(replace_str)
        // console.log('数组组合字符串', replace_str)
        let suffix_mat = this.instr2suffixmat(replace_str)
        // console.log('字符串转后缀表达式', suffix_mat, typeof(suffix_mat[0]))
        // console.log(suffix_mat.length, suffix_mat[0]+0)
        while (suffix_mat.length >= 3) {
            for (let ii = 0; ii < suffix_mat.length; ii++) {
                // console.log(['+','-','x','/','*','X','÷'].indexOf(suffix_mat[ii])>=0)
                if (['+', '-', 'x', '/', '*', 'X', '×', '÷'].indexOf(suffix_mat[ii]) >= 0) {
                    let num_1 = model_mat[suffix_mat[ii - 2] + 0 - 1][2]
                    let num_2 = model_mat[suffix_mat[ii - 1] + 0 - 1][2]
                    let caculate_mode = suffix_mat[ii]
                    // console.log('计算过程', num_1, num_2, caculate_mode)
                    idx_a += 1
                    // 替换计算方案
                    let caculate_mat = this.FractionCaculate(num_1, num_2, caculate_mode)
                    model_mat[idx_a].push(caculate_mat)

                    suffix_mat.splice(ii - 2, 3, Number(model_mat[idx_a][0]))
                    // console.log('后缀表达式', suffix_mat)
                    let infix_str;
                    if (suffix_mat.length == 1) {
                        infix_str = suffix_mat[0].toString()
                    }
                    else {
                        infix_str = this.suffix2infix(suffix_mat)
                    }
                    // console.log('中缀表达式', infix_str)
                    infix_str_mat.push(infix_str)
                    break
                }
            }
        }
        // console.log('代数式计算', model_mat)
        // console.log('中缀表达式', infix_str_mat)
        // 提取每步中缀字符串，转换表达式、代数式、根据每个字母的要求存储对应的数字类型
        let infix_letter_mat = [];
        let infix_value_mat = [];
        let infix_fraction_mat = [];
        for (let ii = 0; ii < infix_str_mat.length; ii++) {
            let part_infix_str = infix_str_mat[ii]
            // 提取数字=>替代字母和标准算式
            let str_num_mat = part_infix_str.match(/\d+(\.\d+)?/g);  //提取数字
            let str_symbol_mat = part_infix_str.replace(/\d+(\.\d+)?/g, '_'); //替换数字 
            // console.log('提取数字矩阵', str_num_mat,str_symbol_mat)
            let idx_num = -1
            let new_value_str = ''
            let new_letter_str = ''
            let part_infix_fraction_mat = []
            for (let jj = 0; jj < str_symbol_mat.length; jj++) {
                if (str_symbol_mat[jj] == '_') {
                    idx_num += 1
                    let a_mat_idx = parseInt(str_num_mat[idx_num]) - 1
                    let a_mat_value = model_mat[a_mat_idx][2]
                    part_infix_fraction_mat.push(a_mat_value)
                    // 此处添加转换格式：目前默认样式，长度为1直接引用、长度为3转为？/?格式
                    new_letter_str += model_mat[a_mat_idx][1]
                    if (a_mat_value.length == 1) {
                        new_value_str += a_mat_value[0]
                    }
                    else if (a_mat_value.length == 3) {
                        // 分数时需考虑添加括号，以示区别
                        // new_value_str += '('+a_mat_value[0]+')'+'/'+'('+a_mat_value[2]+')'
                        // 可视情况而定，如果内部存在符号"添加括号
                        if (a_mat_value[0].indexOf('+') != -1 || a_mat_value[0].indexOf('-') != -1 || a_mat_value[0].indexOf('x') != -1 || a_mat_value[0].indexOf('×') != -1 ||
                            a_mat_value[0].indexOf('X') != -1 || a_mat_value[0].indexOf('*') != -1 || a_mat_value[0].indexOf('/') != -1 || a_mat_value[0].indexOf('÷') != -1) {
                            // 找到任意一种符号，添加括号
                            new_value_str += '(' + a_mat_value[0] + ')' + '/'
                        }
                        else {
                            new_value_str += a_mat_value[0] + '/'
                        }
                        if (a_mat_value[2].indexOf('+') != -1 || a_mat_value[2].indexOf('-') != -1 || a_mat_value[2].indexOf('x') != -1 || a_mat_value[0].indexOf('×') != -1 ||
                            a_mat_value[2].indexOf('X') != -1 || a_mat_value[2].indexOf('*') != -1 || a_mat_value[2].indexOf('/') != -1 || a_mat_value[2].indexOf('÷') != -1) {
                            // 找到任意一种符号，添加括号
                            new_value_str += '(' + a_mat_value[2] + ')'
                        }
                        else {
                            new_value_str += a_mat_value[2]
                        }
                    }
                }
                else {
                    new_value_str += str_symbol_mat[jj]
                    new_letter_str += str_symbol_mat[jj]
                    part_infix_fraction_mat.push([str_symbol_mat[jj]])
                }

            }
            // console.log ('value转换', new_value_str)
            // console.log ('letter转换', new_letter_str)
            infix_letter_mat.push(new_letter_str)
            infix_value_mat.push(new_value_str)
            infix_fraction_mat.push(part_infix_fraction_mat)
        }
        // console.log ('value转换', infix_value_mat)
        // console.log ('letter转换', infix_letter_mat)
        // console.log ('标准单组矩阵', infix_fraction_mat)
        // let turn_fraction_mat = this.FractionTurnMat(infix_fraction_mat)
        // return [infix_value_mat, infix_letter_mat,infix_fraction_mat, turn_fraction_mat[0], turn_fraction_mat[1]]
        return infix_fraction_mat
    }

    FractionTurnMat = (infix_fraction_mat) => {
        // 转换为多行和单行的显示等式格式
        // console.log('infix_fraction_mat',infix_fraction_mat)
        let one_fraction_mat = []
        let multiple_fraction_mat = []
        for (let ii = 0; ii < infix_fraction_mat.length; ii++) {
            let part_multiple_mat = []
            // console.log('infix_fraction_mat[ii]',infix_fraction_mat[ii])
            for (let jj = 0; jj < infix_fraction_mat[ii].length; jj++) {
                // console.log('infix_fraction_mat[ii][jj]', infix_fraction_mat[ii][jj])
                if (ii != 0 && jj == 0) {
                    one_fraction_mat.push(['='])
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['='])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else if (ii == 0 && jj == 0) {
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['  '])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else {
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                // console.log('one_fraction_mat', one_fraction_mat)
            }
            multiple_fraction_mat.push(part_multiple_mat)
        }
        return [one_fraction_mat, multiple_fraction_mat]
    }

    FractionTurnOtherType = (fraction_mat) => {
        // 分数转换为其他类型数据：0：整数、1：小数、2：分数、3：百分数、4：带分数
        let all_type = []
        all_type.integer = NaN
        all_type.decimal = NaN
        all_type.fraction = NaN
        all_type.percentage = NaN
        all_type.mixed_fraction = NaN
        // console.log('测试整数', fraction_mat)

        if (fraction_mat[1] == "1") {
            // console.log('测试整数')
            all_type.integer = [fraction_mat[0]]
        }
        // 小数计算：有限小数和循环小数
        // 找最大公约数
        let max_gcd = this.integerGCDfunc(eval(fraction_mat[0]), eval(fraction_mat[1]))
        // console.log('最大公约数', max_gcd, 0.0001==0.00010)
        // console.log('formatNum', this.formatNum(1/4,10)==this.formatNum(1/4,11))
        // console.log('比较', this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10), 
        //             this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),9))
        // if(this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10)==
        //     this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),9)){
        if (this.DivideCalculator(eval(fraction_mat[0]), eval(fraction_mat[1]))[0] == 0) {
            // 是否可除尽
            if (fraction_mat[1] == "1") {
                // 整数化小数可考虑保留一位小数
                all_type.decimal = [fraction_mat[0] + '.0']
                all_type.percentage = [fraction_mat[0] + '.00%']
            }
            else {
                all_type.decimal = [(this.formatNum(eval(fraction_mat[0]) / eval(fraction_mat[1]), 10)).toString()]
                // 对百分数考虑保留有效位数？
                all_type.percentage = [Math.round(this.formatNum(eval(fraction_mat[0]) / eval(fraction_mat[1]), 10) * 10000) / 100 + '%']
            }

        }
        all_type.fraction = fraction_mat
        // 转换带分数
        let mixed_fraction_int = parseInt(eval(fraction_mat[0]) / eval(fraction_mat[1]))
        let mixed_fraction_denominator = eval(fraction_mat[0]) % eval(fraction_mat[1])
        // console.log('带分数', mixed_fraction_int, mixed_fraction_denominator)
        if (mixed_fraction_int != 0 && mixed_fraction_denominator != 0) {
            // 整数部分和分子部分都不为0时：考虑带分数组成合理情况
            all_type.mixed_fraction = [mixed_fraction_int.toString(), mixed_fraction_denominator.toString(), fraction_mat[1]]
        }
        return all_type
    }

    DivideCalculator = (num1, num2) => {
        // 除法计算
        let answer_num = 0
        if (num1 % num2 != 0) {
            // console.log('结果为小数')
            let while_num = 0
            let limited_flag = 1
            while (while_num < 10) {
                while_num += 1
                if ((Math.pow(10, while_num) * num1) % num2 == 0) {
                    limited_flag = 0
                    break
                }
            }
            // console.log('整数除法', Math.round((Math.pow(10,while_num)*num1)/num2)/Math.pow(10,while_num))      // 以字符串形式处理最终解
            return [limited_flag, Math.round((Math.pow(10, while_num) * num1) / num2) / Math.pow(10, while_num)]
        }
        else {
            return [0, num1 / num2]
        }
    }

    OtherTypeTurnOtherType = (num_mat) => {
        // 转成数组结构
        if (typeof (num_mat) == 'string') {
            // 字符串
            num_mat = [num_mat]
        }
        let caculate_num1
        if (num_mat.length == 1) {
            // console.log('num_mat3', num_mat)
            // 整数、小数、百分数转换
            caculate_num1 = this.NumberTurnFraction(num_mat)
        }
        else if (num_mat.length == 3) {
            // 带分数转换
            caculate_num1 = this.MixedTurnFraction(num_mat)
            // 化最简
            caculate_num1 = this.SimplestFraction(eval(caculate_num1[0]), eval(caculate_num1[1]))
        }
        else {
            // caculate_num1 = [this.standardstr(num_mat[0]), this.standardstr(num_mat[1])]
            // 分数化简
            caculate_num1 = this.SimplestFraction(eval(this.standardstr(num_mat[0])), eval(this.standardstr(num_mat[1])))
        }
        // console.log('caculate_num1', caculate_num1)
        let all_type_mat = this.FractionTurnOtherType(caculate_num1)
        // console.log('all_type_mat', all_type_mat)
        return all_type_mat
    }

    JudgeTwoNumMat = (num_mat1, num_mat2) => {
        // 判断两个数字类型数组的分数情况
        let all_type_mat1 = this.OtherTypeTurnOtherType(num_mat1)
        let all_type_mat2 = this.OtherTypeTurnOtherType(num_mat2)
        // console.log('all_type_mat1', all_type_mat1)
        // console.log('all_type_mat2', all_type_mat2)
        if (all_type_mat1.fraction[0] == all_type_mat2.fraction[0] && all_type_mat1.fraction[1] == all_type_mat2.fraction[1]) {
            // console.log('分数结果相等--', num_mat1, num_mat2)
            return true
        }
        else {
            // 结果不等
            return false
        }
    }

    SimplestFraction = (add_numerator, add_denominator) => {
        let max_gcd = this.integerGCDfunc(add_numerator, add_denominator)
        let numerator_num, denominator_num
        if (max_gcd < 0) {
            numerator_num = parseInt(-add_numerator / max_gcd)
            denominator_num = parseInt(-add_denominator / max_gcd)
        }
        else {
            numerator_num = parseInt(add_numerator / max_gcd)
            denominator_num = parseInt(add_denominator / max_gcd)
        }
        // console.log(numerator_num,)
        let answer_mat = [numerator_num.toString(), denominator_num.toString()]
        return answer_mat
    }

    JudgeTwoFractionEqual = (old_fraction_mat1, old_fraction_mat2) => {
        // 判断两个分数值是否相等:分子分母分别相等、分子分母整数倍的变化、一种考虑直接的除法结果相等
        // console.log('fraction_mat1', fraction_mat1)
        // console.log('fraction_mat2', fraction_mat2)
        // 统一转换分数
        let fraction_mat1 = this.OtherTypeTurnOtherType(old_fraction_mat1).fraction
        let fraction_mat2 = this.OtherTypeTurnOtherType(old_fraction_mat2).fraction
        // console.log('old_fraction_mat1', fraction_mat1)
        // console.log('old_fraction_mat2', fraction_mat2)
        if (eval(fraction_mat1[0]) == eval(fraction_mat2[0]) && eval(fraction_mat1[1]) == eval(fraction_mat2[1])) {
            // 分子分母分别相等
            return [1, '分子分母全等']
        }
        else if (eval(fraction_mat1[0]) % eval(fraction_mat2[0]) == 0 && eval(fraction_mat1[1]) % eval(fraction_mat2[1]) == 0 &&
            Math.round(eval(fraction_mat1[0]) / eval(fraction_mat2[0])) == Math.round(eval(fraction_mat1[1]) / eval(fraction_mat2[1]))) {
            // 分子分母整数倍变化
            return [2, '分子分母整数倍通分']
        }
        else if (eval(fraction_mat2[0]) % eval(fraction_mat1[0]) == 0 && eval(fraction_mat2[1]) % eval(fraction_mat1[1]) == 0 &&
            Math.round(eval(fraction_mat2[0]) / eval(fraction_mat1[0])) == Math.round(eval(fraction_mat2[1]) / eval(fraction_mat1[1]))) {
            // 分子分母整数倍变化
            return [2, '分子分母整数倍通分']
        }
        else {
            // 直接计算分子分母的乘法结果
            if (eval(fraction_mat1[0]) * eval(fraction_mat2[1]) == eval(fraction_mat1[1]) * eval(fraction_mat2[0])) {
                // a/b=c/d：a*d = c*b
                return [3, '分数值相等']
            }
            else {
                // 不等
                return [0, '分数值不相等']
            }
        }
    }

    AppMatTurnStandardMat = (init_mat) => {
        // let init_mat =[['3','4'],'+5.5X0.2-',['1', '4', '5'],'x(3.5-1.3)-0.5']
        // 单组转换
        let turn_standard_mat = []      // 转换标准计算矩阵
        if (typeof (init_mat) == 'string') {
            // return [[init_mat]]
            init_mat = [init_mat]
        }
        // let init_mat = init_mat0[0]
        for (let ii = 0; ii < init_mat.length; ii++) {
            // 
            if (typeof (init_mat[ii]) == 'object') {
                turn_standard_mat.push(init_mat[ii])
            }
            else if (typeof (init_mat[ii]) == 'string') {
                // turn_standard_mat.push(init_mat[ii])
                let part_str = ''               // 组合字段
                for (let jj = 0; jj < init_mat[ii].length; jj++) {
                    if ((['+', '-', "﹣", 'X', 'x', '*', '×', '÷', '(', ')', '（', '）', '[', ']']).indexOf(init_mat[ii][jj]) >= 0) {
                        // 遇到计算符号后单独存储
                        // console.log('init_mat[ii][jj]', init_mat[ii][jj], init_mat[ii][jj]=="﹣",part_str)
                        if (part_str.length < 1) {
                            // 没有数字字符串
                            if (init_mat[ii][jj] == '（') {
                                turn_standard_mat.push(['('])
                            }
                            else if (init_mat[ii][jj] == '）') {
                                turn_standard_mat.push([')'])
                            }
                            else if (init_mat[ii][jj] == "﹣") {
                                // console.log('减号替换')
                                turn_standard_mat.push(['-'])
                            }
                            else {
                                turn_standard_mat.push([init_mat[ii][jj]])
                            }
                        }
                        else {
                            turn_standard_mat.push([part_str])
                            // turn_standard_mat.push([init_mat[ii][jj]])
                            if (init_mat[ii][jj] == '（') {
                                turn_standard_mat.push(['('])
                            }
                            else if (init_mat[ii][jj] == '）') {
                                turn_standard_mat.push([')'])
                            }
                            else if (init_mat[ii][jj] == "﹣") {
                                // console.log('减号替换')
                                turn_standard_mat.push(['-'])
                            }
                            else {
                                turn_standard_mat.push([init_mat[ii][jj]])
                            }
                            part_str = ''
                        }
                    }
                    else {
                        // console.log('数字组part_str----', part_str)
                        part_str += init_mat[ii][jj]
                    }
                    // console.log('part_str----', part_str)
                }
                if (part_str.length >= 1) {
                    turn_standard_mat.push([part_str])
                    part_str = ''
                }
            }
            else if (typeof (init_mat[ii]) === 'number') {
                turn_standard_mat.push(init_mat[ii].toString())
            }
        }
        // console.log('转换标准数组', JSON.stringify(turn_standard_mat))
        return turn_standard_mat
    }

    GetMaxAlgebra = (algebra_expression) => {
        let algebra_max = 'A'
        for (let ii = 0; ii < algebra_expression.length; ii++) {
            if (algebra_expression[ii] >= 'A' && algebra_expression[ii] <= 'w') {
                if (algebra_expression[ii] > algebra_max) {
                    algebra_max = algebra_expression[ii]
                }
            }
        }
        // console.log('最大代数', algebra_max)
        return algebra_max
    }

    MathchBracket = (algebra_expression) => {
        // 匹配括弧
        return algebra_expression.match('[(][A-w+\-x÷]+[A-w][)]')
    }

    MatchMulDiv = (standard_str) => {
        // 匹配乘除法
        // console.log(standard_str)
        // return standard_str.match('[x÷]')
        return standard_str.match('[A-wx÷]+[A-w]')
    }

    MatchAddSub = (standard_str) => {
        // 匹配乘除法
        // return standard_str.match('[+\-]')
        return standard_str.match('[A-w][+\-]+[A-w]')
    }

    AlgebraSingleStepProcess = (standard_str, algebra_max) => {
        // 无括号代数式单步处理
        // console.log('this.MatchMulDiv(standard_str)', this.MatchMulDiv(standard_str))
        if (this.MatchMulDiv(standard_str) != null) {
            let symbole_idx = this.MatchMulDiv(standard_str).index
            let triadic_left_str = standard_str.substr(symbole_idx, 3)   // 索引、长度
            algebra_max = String.fromCharCode((algebra_max.charCodeAt() === 90 ? 96 : algebra_max.charCodeAt()) + 1) //从Z到a跳过
            let new_standard_str = standard_str.replace(triadic_left_str, algebra_max)
            // console.log('standard_str', standard_str, triadic_left_str)
            // console.log('单步处理结果', [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max])
            return [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str + '=' + algebra_max]
        }
        else if (this.MatchAddSub(standard_str) != null) {
            let symbole_idx = this.MatchAddSub(standard_str).index
            let triadic_left_str = standard_str.substr(symbole_idx, 3)   // 索引、长度
            algebra_max = String.fromCharCode((algebra_max.charCodeAt() === 90 ? 96 : algebra_max.charCodeAt()) + 1) //从Z到a跳过
            let new_standard_str = standard_str.replace(triadic_left_str, algebra_max)
            // console.log('standard_str', standard_str, triadic_left_str)
            // console.log('单步处理结果', [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max])
            return [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str + '=' + algebra_max]
        }
        else {
            return false
        }
    }

    AlgebraEquationProcedure = (algebra_expression) => {
        // let algebra_expression = 'A+BxC-(D+E-Fx(G÷H))+(J-I)'
        let algebra_max = this.GetMaxAlgebra(algebra_expression)
        // console.log(algebra_expression.match('[(][A-Z+\-x÷]+[A-Z][)]')==null)
        // console.log('初始算式algebra_expression', algebra_expression)
        let triadic_mat = []
        let algebra_expression_mat = []
        algebra_expression_mat.push(algebra_expression)
        let flag_num = 0
        while (this.MathchBracket(algebra_expression) != null && flag_num < 10) {
            flag_num += 1
            // 存在括弧计算
            let bracket_str = this.MathchBracket(algebra_expression)[0]
            // console.log('bracket_str', bracket_str, algebra_expression)
            let standard_str = bracket_str.substr(1, bracket_str.length - 2)
            // console.log('加减符号查找', mathstrcaculate.MatchAddSub(standard_str))
            // console.log('乘除符号查找', mathstrcaculate.MatchMulDiv(standard_str))
            let single_process_mat = this.AlgebraSingleStepProcess(standard_str, algebra_max)
            if (single_process_mat) {
                if (bracket_str.length == 5) {
                    // 完整替换
                    algebra_expression = algebra_expression.replace(bracket_str, single_process_mat[3])
                    algebra_max = single_process_mat[3]
                }
                else {
                    // 局部替换
                    algebra_expression = algebra_expression.replace(single_process_mat[2], single_process_mat[3])
                    algebra_max = single_process_mat[3]
                }
                triadic_mat.push(single_process_mat[4])
                // console.log('括弧计算algebra_expression', algebra_expression)
                algebra_expression_mat.push(algebra_expression)
            }
            else {
                break
            }
            // break
        }
        // console.log('三元等式矩阵', triadic_mat)
        flag_num = 0
        while (algebra_expression.length >= 3 && flag_num < 20) {
            flag_num += 1
            let single_process_mat = this.AlgebraSingleStepProcess(algebra_expression, algebra_max)
            if (single_process_mat) {
                algebra_expression = algebra_expression.replace(single_process_mat[2], single_process_mat[3])
                algebra_max = single_process_mat[3]
                triadic_mat.push(single_process_mat[4])
                // console.log('一般计算algebra_expression', algebra_expression)
                algebra_expression_mat.push(algebra_expression)
            }
            else { break }
        }
        // console.log('三元等式矩阵', triadic_mat)
        // console.log('每步算式计算', algebra_expression_mat, triadic_mat)
        return [algebra_expression_mat, triadic_mat]
    }

    NumEquationTurnAlgebra = (standard_mat) => {
        // 标准数字算式数组转换代数式
        let standard_num = 64
        let algebra_dict = {}
        let algebra_str = ''
        let algebra_expression_str = ''
        for (let ii = 0; ii < standard_mat.length; ii++) {
            if (standard_mat[ii].length > 1) {
                // console.log('分数')
                standard_num += 1
                algebra_str = String.fromCharCode(standard_num)
                algebra_dict[algebra_str] = standard_mat[ii]
                algebra_expression_str += algebra_str
            }
            else {
                if ((['+', '-', 'X', 'x', '*', '×', '÷', '(', ')', '[', ']', '{', '}']).indexOf(standard_mat[ii][0]) >= 0) {
                    // 符号
                    if ((['X', 'x', '*', '×']).indexOf(standard_mat[ii][0]) >= 0) {
                        algebra_expression_str += 'x'
                    }
                    else if ((['(', '[', '{']).indexOf(standard_mat[ii][0]) >= 0) {
                        algebra_expression_str += '('
                    }
                    else if (([')', ']', '}']).indexOf(standard_mat[ii][0]) >= 0) {
                        algebra_expression_str += ')'
                    }
                    else {
                        algebra_expression_str += standard_mat[ii][0]
                    }

                }
                else {
                    // 数字
                    standard_num += 1
                    algebra_str = String.fromCharCode(standard_num)
                    algebra_dict[algebra_str] = standard_mat[ii]
                    algebra_expression_str += algebra_str
                }
            }
        }
        // console.log('算式转换', algebra_expression_str)
        // console.log('代数Key-value', algebra_dict)
        return [algebra_expression_str, algebra_dict]
    }

    AlgebraEquationTurnNum = (algebra_expression_str, algebra_dict) => {
        // 代数式转化数值数组
        let part_standard_mat = []
        // 代数式中，小括号转中括号、大括号的转换过程
        for (let jj = 0; jj < algebra_expression_str.length; jj++) {
            if (algebra_expression_str[jj] >= 'A' && algebra_expression_str[jj] <= 'w') {
                part_standard_mat.push(algebra_dict[algebra_expression_str[jj]])
            }
            else {
                part_standard_mat.push([algebra_expression_str[jj]])
            }
        }
        // console.log('单步转换', JSON.stringify(part_standard_mat))
        return part_standard_mat
    }

    StandardCalculateAnswer = (init_mat) => {
        // let init_mat =[['3','4'],'+5.5X0.4+',['1', '4', '5'],'x[3.5-1.3]-0.5']
        // console.log('init_mat', init_mat)
        let standard_mat = this.AppMatTurnStandardMat(init_mat)
        // console.log('标准答题算式0000----', JSON.stringify(standard_mat))
        if (standard_mat.length == 1) {
            let end_all_type_mat = this.OtherTypeTurnOtherType(standard_mat[0])
            // console.log('单组--------', end_all_type_mat, end_all_type_mat.fraction)
            return end_all_type_mat.fraction
        }
        let [algebra_expression, algebra_dict] = this.NumEquationTurnAlgebra(standard_mat)
        let [algebra_expression_mat, triadic_mat] = this.AlgebraEquationProcedure(algebra_expression)
        // console.log('NumEquationTurnAlgebra--------', algebra_expression, algebra_dict)
        // console.log('algebra_expression_mat--------', algebra_expression_mat, triadic_mat)
        let end_algebra = algebra_expression_mat[algebra_expression_mat.length - 1]
        // console.log('end_algebra',end_algebra)
        if (end_algebra >= 'A' && end_algebra <= 'w' && end_algebra.length == 1) {
            // console.log('可计算结果')
            algebra_dict = this.CaculateAllAlgebra(triadic_mat, algebra_dict)
            // console.log('三元代数计算Key-value', JSON.stringify(algebra_dict))
            // 转换每步计算矩阵
            // let all_standard_mat = this.ALLAlgebraEquationTurnNum(algebra_expression_mat, algebra_dict)
            // 返回最终计算结果
            let end_all_type_mat = this.OtherTypeTurnOtherType(algebra_dict[end_algebra])
            return end_all_type_mat.fraction
        }
        else {
            // console.log('算式计算有误:不能得到单一数据', algebra_expression_mat[algebra_expression_mat.length-1])
            return false
        }
    }

    ALLAlgebraEquationTurnNum = (algebra_expression_mat, algebra_dict) => {
        // 转换每步计算
        let all_standard_mat = []
        for (let ii = 0; ii < algebra_expression_mat.length; ii++) {
            let part_standard_mat = this.AlgebraEquationTurnNum(algebra_expression_mat[ii], algebra_dict)
            all_standard_mat.push(part_standard_mat)
        }
        return all_standard_mat
    }

    CaculateAllAlgebra = (triadic_mat, algebra_dict) => {
        // console.log('三元代数计算Key-value', triadic_mat, algebra_dict)
        for (let ii = 0; ii < triadic_mat.length; ii++) {
            let step_triadic = triadic_mat[ii]
            // 调用单步计算
            let num_1 = algebra_dict[step_triadic[0]]
            let num_2 = algebra_dict[step_triadic[2]]
            let caculate_mode = step_triadic[1]
            // console.log('三元代数计算------',num_1,num_2)
            let caculate_mat = this.FractionCaculate(num_1, num_2, caculate_mode)
            algebra_dict[step_triadic[4]] = caculate_mat
            // console.log('---------',algebra_dict)
        }
        // console.log('三元代数计算Key-value', JSON.stringify(algebra_dict))
        return algebra_dict
    }

    StaticCalSymbol = (init_mat) => {
        // 统计计算符号
        let standard_mat
        if (typeof (init_mat) == 'string') {
            standard_mat = this.AppMatTurnStandardMat([init_mat])
        }
        else {
            standard_mat = this.AppMatTurnStandardMat(init_mat)
        }
        // console.log('标准答题算式', JSON.stringify(standard_mat))
        let symbole_mat = []
        for (let ii = 0; ii < standard_mat.length; ii++) {
            if ((['+', '-', 'x', 'X', '÷', '×']).indexOf(standard_mat[ii][0]) >= 0) {
                symbole_mat.push(standard_mat[ii][0])
            }
        }
        // console.log('符号统计', symbole_mat)
        return symbole_mat
    }

    PureNumJudge = (test_str) => {
        // 只考虑存整数判定：
        let decimal_reg = /^[\d|\.]*$/; //带小数
        let intger_reg = /^[\d]*$/; //整数
        return intger_reg.test(test_str)

    }

    NonIntelligentComputingDiagnosis = (standard_stem, standard_answer, user_answer) => {
        // let standard_stem = [['2','8'],'+',['4','8']]    // 计算题题干
        // let standard_answer = [['2','4']] // 标准答案 // // let standard_answer = ['0.2']    
        // let user_answer = [[['='],['2+4','8']],[['='],['2x3','2x4']],[['='],['0.5']]]        //用户答题数据
        // 标准答案分数
        let standard_answer_fraction;
        // if(standard_answer[0].length>=2){
        if (typeof (standard_answer[0]) == 'object') {
            // 本身是分数
            if (standard_answer[0].length >= 2) {
                // 分数处理
                // console.log('分数处理')
                standard_answer_fraction = this.StandardCalculateAnswer(standard_answer)
            }
            else {
                standard_answer_fraction = this.StandardCalculateAnswer(standard_answer[0])
            }
        }
        else {
            standard_answer_fraction = this.StandardCalculateAnswer(standard_answer)
        }
        console.log('标准答案分数standard_answer_fraction', standard_answer_fraction)
        // console.log('用户数据', user_answer)
        // 新增括号判定2021-12-17
        let bracket_judge = this.JudgeALLBracket(user_answer, 0)
        console.log(bracket_judge)
        if (bracket_judge[0] == false) {
            return bracket_judge
        }
        // 用户作答去等号
        let equal_idx_mat = []
        let user_process_equal = []       // 去数组等号
        for (let ii = 0; ii < user_answer.length; ii++) {
            let part_idx = []
            let part_process = []
            for (let jj = 0; jj < user_answer[ii].length; jj++) {
                if (user_answer[ii][jj][0] == '=') {
                    part_idx.push(jj)
                }
                else {
                    part_process.push(user_answer[ii][jj])
                }
            }
            equal_idx_mat.push(part_idx)
            user_process_equal.push(part_process)
        }
        console.log('第一次等号处理', equal_idx_mat, user_process_equal)
        // 用户数据单步计算结果：判定等号情况
        let user_process_answer = []
        for (let ii = 0; ii < user_process_equal.length; ii++) {
            let part_answer = []
            if (equal_idx_mat[ii].length >= 2) {
                user_process_answer.push(['equal>1', false]) //等号过多直接判错
                return [false, '单行计算，使用多个等号']
            }
            else if (equal_idx_mat[ii].length == 1) {
                if (equal_idx_mat[ii][0] == 0) {
                    // 等号正确使用
                    part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                    user_process_answer.push(['equal=1', part_answer])
                }
                else {
                    // 等号错误使用中间位置，直接判错
                    user_process_answer.push(['equal=-1', part_answer])
                    return [false, '单行计算，中间有等号']
                }
            }
            else {
                // 无等号计算
                part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                user_process_answer.push(['equal=0', part_answer])
            }
            // user_process_answer.push(part_answer)
        }

        // console.log('单步计算结果', user_process_answer, user_process_answer[user_process_answer.length-1][0])
        // console.log('user_process_equal',user_process_equal[user_process_equal.length-1])
        let end_answer_standard = this.StandardCalculateAnswer(user_process_equal[user_process_equal.length - 1])
        // console.log('end_answer_standard', end_answer_standard)
        let end_answer_judge = this.JudgeTwoFractionEqual(end_answer_standard, standard_answer_fraction)
        // console.log('end_answer_judge', end_answer_judge)
        if (end_answer_judge[0] != 1) {
            return [false, '结果错误']
        }
        if (user_process_answer[user_process_answer.length - 1][0] == 'equal=0') {
            return [false, '最后一步未写等号']
        }
        let symboel_mat = this.StaticCalSymbol(standard_stem)
        // console.log('symboel_mat', symboel_mat)
        // console.log('user_process_answer.length', user_process_answer)
        // 对比用户相邻两步的计算结果
        let user_answer_judge = true
        if (symboel_mat.length == 1 && user_process_answer.length == 1) {
            // 一步计算结果
            if (user_process_answer[0][1]) {
                // 存在数据直接判对？需要对比等号情况
                user_answer_judge = true
            }
            else {
                user_answer_judge = false
                return [false, '一步计算结果错误']
            }
        }
        // else if(user_process_answer.length<symboel_mat.length){
        else if (symboel_mat.length >= 2 && user_process_answer.length < 2) {
            // 修改至少书写一步算式过程
            user_answer_judge = false
            return [false, '计算过程偏少']
        }
        else {
            // 包含两步以上，对比前后
            for (let ii = 0; ii < user_process_answer.length - 1; ii++) {
                if (user_process_answer[ii][1] && user_process_answer[ii + 1][1]) {
                    // 存在计算值
                    let step_answer_judge = this.JudgeTwoFractionEqual(user_process_answer[ii][1], user_process_answer[ii + 1][1])
                    // console.log('相邻两步计算结果', step_answer_judge)
                    if (step_answer_judge[0] >= 1 && user_process_answer[ii + 1][0] == 'equal=1') {
                        user_answer_judge = true
                    }
                    else {
                        user_answer_judge = false
                        return [false, '相邻两步结果错误']
                    }
                }
                else {
                    user_answer_judge = false
                    return [false, '相邻两步结果错误']
                }
            }
        }
        // console.log('相邻两步对比结果', user_answer_judge)
        // 与标准答案对比
        if (user_process_equal[user_process_equal.length - 1].length == 1) {
            let end_answer_mat = user_process_equal[user_process_equal.length - 1][0]
            console.log('最终结果为单一数', end_answer_mat)
            if (end_answer_mat.length >= 2) {
                // 答案为分数模式：可先判定是否为最简分数
                // 是否还需要再添加对分子分母判断：单一数字还是算式['2x3','5x7']
                if (this.PureNumJudge(end_answer_mat[end_answer_mat.length - 2]) &&
                    this.PureNumJudge(end_answer_mat[end_answer_mat.length - 1])) {
                    // 分子分母纯整数判定
                    let gcd_num = this.integerGCDfunc(end_answer_mat[end_answer_mat.length - 2], end_answer_mat[end_answer_mat.length - 1])
                    // console.log('最大公约数', gcd_num)
                    if (gcd_num == 1) {
                        // 答案化简：对比分数结果--如需在对比数字类型，在后面添加
                        let step_answer_judge = this.JudgeTwoFractionEqual(end_answer_mat, standard_answer_fraction)
                        console.log('最简分数--标准答案对比', step_answer_judge)
                        if (step_answer_judge[0] == 1) {
                            user_answer_judge = true
                        }
                        else {
                            user_answer_judge = false
                            return [false, '与标准答案结果不同']
                        }
                    }
                    else {
                        // 答案未化简
                        let step_answer_judge = this.JudgeTwoFractionEqual(end_answer_mat, standard_answer_fraction)
                        console.log('非最简分数--标准答案对比', step_answer_judge)
                        // 都判错？
                        if (step_answer_judge[0] == 1) {
                            user_answer_judge = true
                        }
                        else {
                            user_answer_judge = false
                            return [false, '与标准答案结果不同']
                        }
                    }
                }
                else {
                    // 非纯数字
                    console.log('分子分母未计算完成')
                    user_answer_judge = false
                    return [false, '分子/分母计算未完成']
                }
            }
            else {
                // 其他数据类型转换为分数对比
                let end_answer_standard = this.StandardCalculateAnswer(end_answer_mat)
                console.log('答案非分数转分数', end_answer_standard)
                let step_answer_judge = this.JudgeTwoFractionEqual(end_answer_standard, standard_answer_fraction)
                console.log('其他数据类型转换--标准答案对比', step_answer_judge)
                // 都判错？
                if (step_answer_judge[0] >= 1) {
                    user_answer_judge = true
                }
                else {
                    console.log('分数对比结果不相等')
                    user_answer_judge = false
                    return [false, '对比结果不相等']
                }
            }
        }
        else {
            // 没有计算到最终结果
            console.log('没有得到最终结果')
            user_answer_judge = false
            return [false, '没有得到最终结果']
        }
        // 添加等式的括弧层级、配对情况

        return [true, '计算正确']
    }

    CalculateProcessDiagnosis = (user_answer0) => {
        // 只诊断计算过程
        // 用户作答去等号
        let user_answer = this.CalculateGrouping(user_answer0)
        console.log('-----user_answer', user_answer)
        let equal_idx_mat = []
        let user_process_equal = []       // 去数组等号
        for (let ii = 0; ii < user_answer.length; ii++) {
            let part_idx = []
            let part_process = []
            for (let jj = 0; jj < user_answer[ii].length; jj++) {
                if (user_answer[ii][jj][0] == '=') {
                    part_idx.push(jj)
                }
                else {
                    part_process.push(user_answer[ii][jj])
                }
            }
            equal_idx_mat.push(part_idx)
            user_process_equal.push(part_process)
        }
        console.log('第一次等号处理', equal_idx_mat, user_process_equal)
        // 用户数据单步计算结果：判定等号情况
        let user_process_answer = []
        for (let ii = 0; ii < user_process_equal.length; ii++) {
            let part_answer = []
            if (equal_idx_mat[ii].length >= 2) {
                user_process_answer.push(['equal>1', false]) //等号过多直接判错
            }
            else if (equal_idx_mat[ii].length == 1) {
                if (equal_idx_mat[ii][0] == 0) {
                    // 等号正确使用
                    part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                    user_process_answer.push(['equal=1', part_answer])
                }
                else {
                    // 等号错误使用中间位置，直接判错
                    user_process_answer.push(['equal=-1', part_answer])
                }
            }
            else {
                // 无等号计算
                console.log('无等号计算', user_process_equal[ii])
                part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                user_process_answer.push(['equal=0', part_answer])
            }
            // user_process_answer.push(part_answer)
            // console.log('单步计算结果user_process_answer', user_process_answer)
        }
        // console.log('单步计算结果', user_process_answer)
        let symboel_mat = this.StaticCalSymbol(user_answer[0])
        // console.log('symboel_mat.length', symboel_mat.length)
        // console.log('user_process_answer.length', user_process_answer.length)
        // 对比用户相邻两步的计算结果
        let user_answer_judge = true
        if (symboel_mat.length == 1 && user_process_answer.length == 1) {
            // 一步计算结果
            if (user_process_answer[0][1]) {
                // 存在数据直接判对？需要对比等号情况
                user_answer_judge = true
            }
            else {
                user_answer_judge = false
                return [false, -1]
            }
        }
        // else if(user_process_answer.length<symboel_mat.length){
        else if (symboel_mat.length >= 2 && user_process_answer.length <= 2) { // 修改：20211210
            console.log('步骤少')
            user_answer_judge = false
            return [false, -1]
        }
        else {
            // 包含两步以上，对比前后
            for (let ii = 0; ii < user_process_answer.length - 1; ii++) {
                if (user_process_answer[ii][1] && user_process_answer[ii + 1][1]) {
                    // 存在计算值
                    let step_answer_judge = this.JudgeTwoFractionEqual(user_process_answer[ii][1], user_process_answer[ii + 1][1])
                    // console.log('相邻两步计算结果', step_answer_judge)
                    if (step_answer_judge[0] >= 1 && user_process_answer[ii + 1][0] == 'equal=1') {
                        user_answer_judge = true
                    }
                    else {
                        user_answer_judge = false
                        return [false, -1]
                    }
                }
                else {
                    user_answer_judge = false
                    return [false, -1]
                }
            }
        }
        // console.log('相邻两步对比结果', user_answer_judge, user_process_answer[0][1])
        return [true, user_process_answer[0][1]]
    }

    CalculateProcessDiagnosis2 = (user_answer0) => {
        // 去除两步及以上的诊断需求
        // 只诊断计算过程
        // 用户作答去等号
        let user_answer = this.CalculateGrouping(user_answer0)
        console.log('-----user_answer', user_answer)
        let equal_idx_mat = []
        let user_process_equal = []       // 去数组等号
        for (let ii = 0; ii < user_answer.length; ii++) {
            let part_idx = []
            let part_process = []
            for (let jj = 0; jj < user_answer[ii].length; jj++) {
                if (user_answer[ii][jj][0] == '=') {
                    part_idx.push(jj)
                }
                else {
                    part_process.push(user_answer[ii][jj])
                }
            }
            equal_idx_mat.push(part_idx)
            user_process_equal.push(part_process)
        }
        console.log('第一次等号处理', equal_idx_mat, user_process_equal)
        // 用户数据单步计算结果：判定等号情况
        let user_process_answer = []
        for (let ii = 0; ii < user_process_equal.length; ii++) {
            let part_answer = []
            if (equal_idx_mat[ii].length >= 2) {
                user_process_answer.push(['equal>1', false]) //等号过多直接判错
            }
            else if (equal_idx_mat[ii].length == 1) {
                if (equal_idx_mat[ii][0] == 0) {
                    // 等号正确使用
                    part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                    user_process_answer.push(['equal=1', part_answer])
                }
                else {
                    // 等号错误使用中间位置，直接判错
                    user_process_answer.push(['equal=-1', part_answer])
                }
            }
            else {
                // 无等号计算
                console.log('无等号计算', user_process_equal[ii])
                part_answer = this.StandardCalculateAnswer(user_process_equal[ii])
                user_process_answer.push(['equal=0', part_answer])
            }
            // user_process_answer.push(part_answer)
            // console.log('单步计算结果user_process_answer', user_process_answer)
        }
        // console.log('单步计算结果', user_process_answer)
        let symboel_mat = this.StaticCalSymbol(user_answer[0])
        // console.log('symboel_mat.length', symboel_mat.length)
        // console.log('user_process_answer.length', user_process_answer.length)
        // 对比用户相邻两步的计算结果
        let user_answer_judge = true
        if (symboel_mat.length == 1 && user_process_answer.length == 1) {
            // 一步计算结果
            if (user_process_answer[0][1]) {
                // 存在数据直接判对？需要对比等号情况
                user_answer_judge = true
            }
            else {
                user_answer_judge = false
                return [false, -1]
            }
        }
        // else if(user_process_answer.length<symboel_mat.length){
        // 不判定过程步数问题
        // else if(symboel_mat.length>=2 && user_process_answer.length<=2){ // 修改：20211210
        //         console.log('步骤少')
        //     user_answer_judge = false
        //     return [false, -1]
        // }
        else {
            // 包含两步以上，对比前后
            for (let ii = 0; ii < user_process_answer.length - 1; ii++) {
                if (user_process_answer[ii][1] && user_process_answer[ii + 1][1]) {
                    // 存在计算值
                    let step_answer_judge = this.JudgeTwoFractionEqual(user_process_answer[ii][1], user_process_answer[ii + 1][1])
                    // console.log('相邻两步计算结果', step_answer_judge)
                    if (step_answer_judge[0] >= 1 && user_process_answer[ii + 1][0] == 'equal=1') {
                        user_answer_judge = true
                    }
                    else {
                        user_answer_judge = false
                        return [false, -1]
                    }
                }
                else {
                    user_answer_judge = false
                    return [false, -1]
                }
            }
        }
        // console.log('相邻两步对比结果', user_answer_judge, user_process_answer[0][1])
        return [true, user_process_answer[0][1]]
    }

    CalculateGrouping = (user_answer) => {
        // 就算过程分组,一排写了多个等号的计算并标记
        let new_user_mat = []
        let part_user_mat = []
        for (let ii = 0; ii < user_answer.length; ii++) {
            for (let jj = 0; jj < user_answer[ii].length; jj++) {
                if (user_answer[ii][jj][0] == '=' && part_user_mat.length > 0) {
                    new_user_mat.push(part_user_mat)
                    part_user_mat = []
                    part_user_mat.push(user_answer[ii][jj])
                }
                else {
                    part_user_mat.push(user_answer[ii][jj])
                }
                if (jj == user_answer[ii].length - 1) {
                    new_user_mat.push(part_user_mat)
                    part_user_mat = []
                }
            }
        }
        // console.log('计算过程分组', new_user_mat)
        return new_user_mat
    }

    CalculateGroups = (user_answer_mat) => {
        // 多组数据计算:user_answer_mat:用户答题数据
        let user_group_mat1 = this.UserMatGrouping(user_answer_mat)     // 分组数据
        let user_group_answer_mat = []
        for (let ii = 0; ii < user_group_mat1.length; ii++) {
            let user_group_mat = this.CalculateGrouping(user_group_mat1[ii])    // 计算过程分离       
            // 单组计算过程诊断
            let part_answer_mat = this.CalculateProcessDiagnosis(user_group_mat)
            user_group_answer_mat.push(part_answer_mat)
        }
        console.log('多组计算过程结果', JSON.stringify(user_group_answer_mat))
        return user_group_answer_mat
    }

    GetMatNum = (init_mat) => {
        // 获取数组中的数字类型
        let num_mat = []        // 数字组
        let symbol_mat = []    // 符号组
        // 考虑标准答题数组
        let user_group_mat = this.CalculateGrouping(init_mat)    // 计算过程分离
        let part_num_mat = []
        let part_symbol_mat = []
        for (let ii = 0; ii < user_group_mat.length; ii++) {
            for (let jj = 0; jj < user_group_mat[ii].length; jj++) {
                // console.log('判定过程', user_group_mat[ii][jj])
                if (user_group_mat[ii][jj].length > 1) {
                    // 分子分母存在计算符号，未计算完整
                    if (this.SymbolJudgement(user_group_mat[ii][jj][user_group_mat[ii][jj].length - 2]) ||
                        this.SymbolJudgement(user_group_mat[ii][jj][user_group_mat[ii][jj].length - 1])) {
                        // 存在符号
                        part_symbol_mat.push(user_group_mat[ii][jj])
                    }
                    else {
                        part_num_mat.push(user_group_mat[ii][jj])
                    }
                }
                else if (this.SymbolJudgement(user_group_mat[ii][jj][0])) {
                    part_symbol_mat.push(user_group_mat[ii][jj])
                }
                else if (this.NumJudgement(user_group_mat[ii][jj][0])) {
                    part_num_mat.push(user_group_mat[ii][jj])
                }

            }
            // console.log('part_num_mat', part_num_mat, part_symbol_mat)
            num_mat.push(part_num_mat)
            symbol_mat.push(part_symbol_mat)
            part_num_mat = []
            part_symbol_mat = []
        }
        // console.log('分类', JSON.stringify(num_mat), JSON.stringify(symbol_mat))
        let sieve_heavy_mat = []
        for (let r_idx = 0; r_idx < num_mat.length; r_idx++) {
            let part_heavy_mat = [] // 单行
            for (let c_idx = 0; c_idx < num_mat[r_idx].length; c_idx++) {
                let push_flag = 0
                for (let s_idx = 0; s_idx < part_heavy_mat.length; s_idx++) {
                    // console.log('比较', num_mat[r_idx][c_idx], part_heavy_mat[s_idx])
                    if (this.JudgeTwoNumMat(num_mat[r_idx][c_idx], part_heavy_mat[s_idx])) {
                        push_flag = 1
                        break
                    }
                }
                if (push_flag === 0) {
                    // 无重复数据---添加
                    part_heavy_mat.push(num_mat[r_idx][c_idx])
                }
            }
            sieve_heavy_mat.push(part_heavy_mat)
        }
        // console.log('筛重num_mat', JSON.stringify(num_mat))
        // console.log('筛重sieve_heavy_mat', JSON.stringify(sieve_heavy_mat))
        // return [num_mat, symbol_mat]
        return [sieve_heavy_mat, symbol_mat]
    }

    UserMatGrouping = (user_mat) => {
        // 用户答题分组
        let user_group_mat = []
        let part_group_mat = []
        for (let ii = 0; ii < user_mat.length; ii++) {
            // console.log('=======', user_mat[ii][0][0]!='=')
            if (ii == 0 || user_mat[ii][0][0] == '=') {
                part_group_mat.push(user_mat[ii])
            }
            else if (user_mat[ii][0][0] != '=' && part_group_mat.length < 1) {
                part_group_mat.push(user_mat[ii])
            }
            else if (user_mat[ii][0][0] != '=' && part_group_mat.length >= 1) {
                user_group_mat.push(part_group_mat)
                part_group_mat = []
                part_group_mat.push(user_mat[ii])
            }
            if (ii == user_mat.length - 1) {
                user_group_mat.push(part_group_mat)
            }
            // console.log('---------', part_group_mat)
        }
        // console.log('用户答题数据分组', JSON.stringify(user_group_mat), user_group_mat.length)
        return user_group_mat
    }

    PopUnitsProcess = (user_answer_mat) => {
        // 单位净化处理：得到纯计算过程：
        // 单位换算的计算过程暂时未作考虑
        let new_user_answer_mat = []
        for (let ii = 0; ii < user_answer_mat.length; ii++) {
            // 
            let part_user_answer_mat = []
            for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
                // 单块判定
                if (user_answer_mat[ii][jj].length >= 2) {
                    // 分数类
                    part_user_answer_mat.push(user_answer_mat[ii][jj])
                }
                else {
                    // 非分数类：单位、数字、符号的判定
                    if (this.NumSymbolJudgement(user_answer_mat[ii][jj][0])) {
                        part_user_answer_mat.push(user_answer_mat[ii][jj])
                    }
                    else {
                        // 出现单位时，需要对前后相邻为1的括号判定
                        // console.log('前后判定', part_user_answer_mat, jj)
                        if (jj > 0 && part_user_answer_mat[jj - 1][0] == '(') {
                            // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                            // console.log('弹出')
                            part_user_answer_mat.pop()
                            if (jj < user_answer_mat[ii].length - 1 && user_answer_mat[ii][jj + 1][0] == ')') {
                                // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                                // console.log('到了吗1')
                                jj += 1
                            }
                        }
                        else if (jj < user_answer_mat[ii].length - 1 && user_answer_mat[ii][jj + 1][0] == ')') {
                            // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                            // console.log('到了吗2')
                            jj += 1
                        }
                        else {
                            part_user_answer_mat.push(user_answer_mat[ii][jj])
                        }
                    }
                }
                // console.log('part_user_answer_mat', part_user_answer_mat)
            }
            new_user_answer_mat.push(part_user_answer_mat)
        }
        return new_user_answer_mat
    }

    UserMatGrouping = (user_mat) => {
        // 用户答题分组
        let user_group_mat = []
        let part_group_mat = []
        for (let ii = 0; ii < user_mat.length; ii++) {
            // console.log('=======', user_mat[ii][0][0]!='=')
            if (ii == 0 || user_mat[ii][0][0] == '=') {
                part_group_mat.push(user_mat[ii])
            }
            else if (user_mat[ii][0][0] != '=' && part_group_mat.length < 1) {
                part_group_mat.push(user_mat[ii])
            }
            else if (user_mat[ii][0][0] != '=' && part_group_mat.length >= 1) {
                user_group_mat.push(part_group_mat)
                part_group_mat = []
                part_group_mat.push(user_mat[ii])
            }
            if (ii == user_mat.length - 1) {
                user_group_mat.push(part_group_mat)
            }
            // console.log('---------', part_group_mat)
        }
        // console.log('用户答题数据分组', JSON.stringify(user_group_mat), user_group_mat.length)
        return user_group_mat
    }

    NumSymbolJudgement = (init_str) => {
        // 数字、符号判定
        // console.log('init_str', init_str)
        for (let ii = 0; ii < init_str.length; ii++) {
            // 
            if ((['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', 'X', '*', '÷', '(', '（', '）', ')', '[', ']', '.', '%']).indexOf(init_str[ii]) < 0) {
                // 出现非正常计算符号
                return false
            }
        }
        return true
    }

    NumJudgement = (init_str) => {
        // 数字判定
        // console.log('init_str', init_str)
        for (let ii = 0; ii < init_str.length; ii++) {
            // 
            if ((['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '%']).indexOf(init_str[ii]) < 0) {
                // 出现非正常计算符号
                return false
            }
        }
        return true
    }

    SymbolJudgement = (init_str) => {
        // 符号判定
        // console.log('init_str', init_str)
        for (let ii = 0; ii < init_str.length; ii++) {
            // 
            // console.log('符号判定', (['+','-','x','X','*','÷','(','（','）',')','[',']']).indexOf(init_str[ii]), init_str[ii])
            if ((['+', '-', 'x', 'X', '*', "×", '÷', '(', '（', '）', ')', '[', ']']).indexOf(init_str[ii]) >= 0) {
                // 出现非正常计算符号
                return true
            }
        }
        return false
    }

    NonAIAplUnitDiagnosis = (unit_mat, user_answer_mat0) => {
        // 非智能题单位诊断:完整
        // let alternative_options = "张#块";		// 修改代数表示， answer_content = "7"
        // let user_answer_mat  = [[['('],['722'],['-'], ['673'],[')'], ['÷'],['7']],[['='],['49'],['÷'],['7']],[['='],['7'],['('],['张'],[')']]]    // 用户答题数据
        // 处理单位、更新单位数组
        // 存在过程单位判定
        // let user_answer_mat = colo
        let user_answer_mat = deepClone(user_answer_mat0, [])
        // 最后一组
        let user_end_mat = user_answer_mat[user_answer_mat.length - 1]
        console.log('最后一组数据', user_end_mat)
        // 统计单位
        // let unit_mat = alternative_options.split('#')
        let answer_unit = unit_mat[0]
        console.log('单位统计', unit_mat, '标准答案单位', answer_unit)
        let unit_flag = true
        // 判断是否有单位
        let unit_idx = []
        for (let ii = 0; ii < user_end_mat.length; ii++) {
            if (unit_mat.indexOf(user_end_mat[ii][0]) >= 0) {
                unit_idx.push(ii)
            }
        }
        // 添加本身无单位，单写了单位
        // let chn_test = /[^/u4e00-/u9fa5]/;
        // let eng_test = /[^A-wa-z]/
        // eng_test.test(temp)
        if (answer_unit.length < 1) {
            for (let ii = 0; ii < user_end_mat.length; ii++) {
                // if (['倍'].indexOf(user_end_mat[ii][0])>=0){
                //     return [false, '正确结果无单位']
                // }
                for (let jj = 0; jj < user_end_mat[ii][0].length; jj++) {
                    // console.log('--------',user_end_mat[ii][0].charCodeAt(jj))
                    if (user_end_mat[ii][0].charCodeAt(jj) > 255) {
                        return [false, '正确结果无单位']
                    }
                }

            }
        }
        console.log('NonAIApl存在单位索引', unit_idx, answer_unit.length, unit_idx.length)
        if (answer_unit.length < 1) {
            // 不存在单位
            if (unit_idx.length < 1) {
                // 答题无单位
                return [true, user_answer_mat]
            }
        }
        else if (answer_unit.length >= 1 && unit_idx.length < 1) {
            // 
            return [false, user_answer_mat]
        }
        // 存在过程单位判定
        for (let ii = 0; ii < user_answer_mat.length - 1; ii++) {
            for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
                if (unit_mat.indexOf(user_answer_mat[ii][jj][0]) >= 0) {
                    // 过程单位
                    return [false, '过程单位出现']
                }
            }
        }
        // 最后一行的单位判定
        let new_user_end_mat = []
        if (unit_idx.length < 1 || unit_idx.length > 1) {
            unit_flag = false	// 单位错误
            for (let ii = 0; ii < user_end_mat.length; ii++) {
                if (unit_idx.indexOf(ii) < 0) {
                    new_user_end_mat.push(user_end_mat[ii])
                }
            }
        }
        else {
            // 一个单位情况判定，括号与单位正确性
            if (unit_idx[0] > 0 && unit_idx[0] < user_end_mat.length - 1) {
                if (user_end_mat[unit_idx[0]][0] != answer_unit) {
                    unit_flag = false	// 单位不对
                    for (let ii = 0; ii < user_end_mat.length; ii++) {
                        if (unit_idx.indexOf(ii) < 0) {
                            new_user_end_mat.push(user_end_mat[ii])
                        }
                    }
                }
                else {
                    // 单位正确，格式正确
                    if (user_end_mat[unit_idx[0] - 1][0] == '(' && user_end_mat[unit_idx[0] + 1][0] == ')') {
                        unit_flag = true	// 单位和格式
                        // console.log('到这儿', user_end_mat[unit_idx[0]-1][0], user_end_mat[unit_idx[0]-1][0]=='(')
                        for (let ii = 0; ii < user_end_mat.length; ii++) {
                            if ([unit_idx[0] - 1, unit_idx[0], unit_idx[0] + 1].indexOf(ii) < 0) {
                                new_user_end_mat.push(user_end_mat[ii])
                            }
                        }
                    }
                    else {
                        unit_flag = false	// 单位不对
                        for (let ii = 0; ii < user_end_mat.length; ii++) {
                            if (unit_idx.indexOf(ii) < 0) {
                                new_user_end_mat.push(user_end_mat[ii])
                            }
                        }
                    }
                }
            }
            else {
                unit_flag = false	// 单位或格式错误
                for (let ii = 0; ii < user_end_mat.length; ii++) {
                    if (unit_idx.indexOf(ii) < 0) {
                        new_user_end_mat.push(user_end_mat[ii])
                    }
                }
            }
        }
        console.log('最后一组修改', new_user_end_mat, '单位标签',)
        user_answer_mat[user_answer_mat.length - 1] = new_user_end_mat
        console.log('去除单位矩阵', user_answer_mat)
        return [unit_flag, user_answer_mat]
    }

    JudgeTwoNumIdxMat = (num_mat1, num_mat2) => {
        // 判定两个数组之间存在相同的数字转换结果
        let num1_in_num2 = []    // num_mat2中各元素再num_mat1中的idx
        let num2_in_num1 = []    // num_mat1中各元素再num_mat2中的idx
        if (num_mat1.length <= num_mat2.length) {
            // 少的去找多的索引
            for (let ii = 0; ii < num_mat1.length; ii++) {
                for (let jj = 0; jj < num_mat2.length; jj++) {
                    // 
                    // console.log('数据对比', this.JudgeTwoNumMat(num_mat1[ii],num_mat2[jj]))
                    if (this.JudgeTwoNumMat(num_mat1[ii], num_mat2[jj])) {
                        if (num2_in_num1.indexOf(jj) < 0) {
                            num1_in_num2.push(ii)
                            num2_in_num1.push(jj)
                            break
                        }
                        else {   // 新增2021-12-10
                            num1_in_num2.push(ii)
                            num2_in_num1.push(jj)
                            break
                        }
                    }
                }
            }
        }
        else {
            // 少的去找多的索引
            // console.log('------', num_mat2, num_mat1)
            for (let ii = 0; ii < num_mat2.length; ii++) {
                for (let jj = 0; jj < num_mat1.length; jj++) {
                    // 
                    if (this.JudgeTwoNumMat(num_mat2[ii], num_mat1[jj])) {
                        // 考虑数据重复使用方式
                        if (num1_in_num2.indexOf(jj) < 0) {
                            num1_in_num2.push(jj)
                            num2_in_num1.push(ii)
                            break
                        }
                        else {   // 新增2021-12-10
                            num1_in_num2.push(ii)
                            num2_in_num1.push(jj)
                            break
                        }
                    }
                }
            }
        }
        console.log('相同数字索引查找', num1_in_num2, num2_in_num1, num_mat1, num_mat2)
        return [num1_in_num2, num2_in_num1]
    }

    NonAIAplDiagnose = (equation_exercise, answer_unit_str, answer_mat, answer_content = false) => {
        // 混合应用题诊断：非智能题，传输数据：用户答题数据、综合算式、备选单位
        // 用户答题数据 
        // let answer_mat = [[['1','2'],['+'], ['1','3']],[['='],['3+2','6'],['='],['5','6'],['('],['个'],[')']],[['5','6'],['x'],['4', '5']],[['='],['2','3'],['('],['张'],[')']]]
        // let equation_exercise = ['(',['1','2'],'+', ['1','3'],')x',['4','5']];   // 死题代数式
        // let answer_unit_str = '张#块#个'     // 备选项
        // 标准题目数据处理
        let answer_unit_mat = answer_unit_str.split('#')
        // console.log('数组单位', answer_unit_mat)
        // let math_base = new mathdiagnosis.MathBaseCaculateFunc()
        console.log('answer_content', answer_content)
        let standard_equation_mat
        if (typeof (equation_exercise) == 'string') {
            standard_equation_mat = this.AppMatTurnStandardMat(equation_exercise)
        }
        else {
            if (equation_exercise.length == 1 && typeof (equation_exercise[0]) == 'object') {
                // [['3','3']]
                // console.log('两层')
                standard_equation_mat = this.AppMatTurnStandardMat(equation_exercise[0])
            }
            else {
                // console.log('一层')
                standard_equation_mat = this.AppMatTurnStandardMat(equation_exercise)
            }
        }
        console.log('标准数组', JSON.stringify(standard_equation_mat))
        let [standard_num_mat, standard_symbol_mat] = this.GetMatNum([standard_equation_mat])
        console.log('获取数字组', standard_num_mat, standard_symbol_mat)
        let static_symbol_mat = this.StaticCalSymbol(standard_equation_mat)
        console.log('计算符号统计', static_symbol_mat)
        let standard_answer = false
        if (answer_content == false) {
            // 调用算式计算
            if (typeof (equation_exercise) == 'string') {
                standard_answer = this.StandardCalculateAnswer(equation_exercise)
            }
            else {
                // 代数式格式
                // console.log('equation_exercise', equation_exercise)
                if (equation_exercise.length == 1 && typeof (equation_exercise[0]) == 'object') {
                    // [['3','3']]
                    // console.log('两层')
                    standard_answer = this.StandardCalculateAnswer(equation_exercise[0])
                }
                else {
                    // console.log('一层')
                    standard_answer = this.StandardCalculateAnswer(equation_exercise)
                }

            }
            // this.StandardCalculateAnswer(equation_exercise)
        }
        else {
            // 用给出的结果组合答案
            if (typeof (answer_content) == 'string') {
                standard_answer = this.StandardCalculateAnswer(answer_content)
            }
            else {
                // 包的两层还是一层
                if (typeof (answer_content[0]) == 'object') {
                    // [[['2','3']]] // 减一层
                    if (typeof (answer_content[0][0]) == 'object') {
                        standard_answer = this.StandardCalculateAnswer(answer_content[0])
                    }
                    else {
                        standard_answer = this.StandardCalculateAnswer(answer_content)
                    }
                }
                else {
                    // ['2','3'] // 添加一层
                    console.log('一层数组', answer_content)
                    standard_answer = this.StandardCalculateAnswer([answer_content])
                }
            }
        }
        console.log('标准答案', standard_answer)
        if (standard_answer == false) {
            return [false, '答案有误']
        }
        // 用户数据处理：先分组、单组再分步、清除单位、判定每步计算过程、判定使用已知条件、最后一步判定单位
        let user_group_mat1 = this.UserMatGrouping(answer_mat)     // 分组数据
        // console.log('user_group_mat1', JSON.stringify(user_group_mat1))
        let user_num_mat = []
        let user_answer_num_mat = []
        let left_num_mat = []		// 等号左侧数字
        let right_num_mat = []		// 等号右侧数字
        let fomulation_num = 0      // 列式长度
        for (let ii = 0; ii < user_group_mat1.length; ii++) {
            if (ii == user_group_mat1.length - 1) {
                // 最后一组单位判定
                console.log('最后一组诊断', JSON.stringify(user_group_mat1[ii]))
                // 看单位
                let [unit_flag, user_answer_mat] = this.NonAIAplUnitDiagnosis(answer_unit_mat, user_group_mat1[ii])
                // console.log('单位判定', unit_flag, JSON.stringify(user_answer_mat))
                if (unit_flag != true) {
                    return [false, '单位或其括弧不正确']
                }
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_answer_mat, 1)
                console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // 分步
                let user_group_mat = this.CalculateGrouping(user_answer_mat)    // 计算过程分离   
                console.log('分步数组-----', user_group_mat)
                if (user_group_mat[user_group_mat.length - 1].length >= 3) {
                    // 包含等号情况
                    return [false, '未计算得到最终结果']
                }
                let first_symbol_mat = this.StaticCalSymbol(user_group_mat[0])
                console.log('计算符号统计', user_group_mat[0][0][0], first_symbol_mat)
                if (first_symbol_mat.length < 1 || user_group_mat[0][0][0] == '=') {
                    // 无列式
                    return [false, '未列式或列式错误']
                }
                if (user_group_mat[user_group_mat.length - 1][0] != '=') {
                    // 包含等号情况
                    return [false, '最后一步未写等号']
                }
                // 单组计算过程诊断
                let part_answer_mat = []
                if (user_group_mat1.length == 1) {
                    // 一个算式时调用综合诊断
                    part_answer_mat = this.CalculateProcessDiagnosis(user_group_mat)
                    if (part_answer_mat[0] != true) {
                        return [false, '计算过程有误或步骤偏少']
                    }
                }
                else {
                    part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                    if (part_answer_mat[0] != true) {
                        return [false, '计算过程有误']
                    }
                }
                // let part_answer_mat = this.CalculateProcessDiagnosis(user_group_mat)
                // console.log('单组计算判定----', part_answer_mat)
                if (part_answer_mat[0] != true) {
                    return [false, '计算过程有误']
                }
                // 判定与题目结果
                let answer_judge = this.JudgeTwoNumMat(standard_answer, part_answer_mat[1])
                console.log('与结果判定', answer_judge)
                if (answer_judge == false) {
                    return [false, '与标准答案不符']
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                console.log('获取数字和计算符号----', part_num_mat, part_symbol_mat)
                if (part_symbol_mat[0].length < 1) {
                    return [false, '未列式，直接写出结果2']
                }
                else {
                    fomulation_num += part_symbol_mat[0].length     // 统计列式长度
                }
                if (fomulation_num < static_symbol_mat - 2) {
                    return [false, '过程偏少']
                }
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                // console.log('匹配索引情况', standard_num_mat.flat(),part_num_mat[0], num1_in_num2, num2_in_num1)
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    // console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                user_num_mat.push(part_num_mat[0])		// 采用数字组
                left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                // console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算----')
                    return [false, '分子或分母存在计算']
                }

            }
            else {
                // 非最后一步只判定计算过程
                // console.log('前组诊断1',JSON.stringify(user_group_mat1[ii]))
                // 单位处理
                let non_unit_mat = this.PopUnitsProcess(user_group_mat1[ii])
                // console.log('去除单位1', non_unit_mat)
                // 分步
                let user_group_mat = this.CalculateGrouping(non_unit_mat)    // 计算过程分离
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_group_mat, 1)
                // console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // console.log('分步数组1', user_group_mat)
                if (user_group_mat[user_group_mat.length - 1].length >= 3) {
                    // 包含等号情况
                    return [false, '未计算得到最终结果']
                }
                // 单组计算过程诊断
                let part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                console.log('单组计算判定1', part_answer_mat)
                if (part_answer_mat[0] != true) {
                    return [false, '计算过程有误']
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                // console.log('获取数字和计算符号1', part_num_mat, part_symbol_mat)
                if (part_symbol_mat[0].length < 1) {
                    return [false, '未列式，直接写出结果1']
                }
                else {
                    fomulation_num += part_symbol_mat[0].length     // 统计列式长度
                }
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                console.log('匹配索引情况', standard_num_mat[0], part_num_mat[0], num1_in_num2, num2_in_num1)
                // if (num2_in_num1.length==part_num_mat[0].length){
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {   // 修正相差个数
                    //        if (num2_in_num1.length==part_num_mat[0].length){
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    // console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                if (user_num_mat.indexOf(part_num_mat[0]) < 0) {
                    user_num_mat.push(part_num_mat[0])		// 采用数字组
                }
                if (left_num_mat.indexOf(part_num_mat[0]) < 0) {
                    left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                }
                if (right_num_mat.indexOf(part_num_mat[part_num_mat.length - 1]) < 0) {
                    right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                }
                // console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算')
                    return [false, '分子或分母存在计算']
                }
            }
        }
        // console.log('左侧数据', left_num_mat.flat())
        // console.log('右侧数据', right_num_mat)
        // console.log('出现数据', standard_num_mat.flat())
        // let num_mat1 = [['0.2'],['2.7'],['4.4'],['2.5'], ['9.9']]
        // let num_mat2 = [['2','10'],['3','10'],['5','2'],['4','4','10']]
        // math_base.JudgeTwoNumIdxMat(num_mat1, num_mat2)
        let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), left_num_mat.flat())
        let end_num_mat = right_num_mat.flat()
        // if (num2_in_num1.length==left_num_mat.flat().length){
        if (Math.abs(num2_in_num1.length - left_num_mat.flat().length) <= 2) {
            // 
            console.log('左侧数据可找到出处')
            for (let ii = 0; ii < end_num_mat.length; ii++) {
                if (end_num_mat[ii].length > 1) {
                    // 分数结果，判定是否为最简分数
                    let gcd_num = this.integerGCDfunc(parseInt(end_num_mat[ii][end_num_mat[ii].length - 2]), parseInt(end_num_mat[ii][end_num_mat[ii].length - 1]))
                    if (gcd_num > 1) {
                        return [true, '分数未化简']
                    }
                }
            }
            return [true, '计算正确']
        }
        else {
            return [false, '给定数字或结果未完整使用']
        }
    }

    SingleAIAplDiagnose = (alphabet_value, variable_value, equation_exercise, answer_mat) => {
        // alphabet_value, variable_value, equation_exercise, answer_content, user_answer_mat
        // 智能应用题单步引导诊断：三元代数式equation_exercise：AxB=C；alphabet_value：{'A':['2','3'],'B':['3','4'],'C':['1','7']};变量属性：{'A':['大楼高度','米']}
        // let variable_value = [
        // 	{"key": "A","value": ["照片的总量", "张"]},
        // 	{"key": "B","value": ["风景照片的数量", "张"]},
        // 	{"key": "C","value": ["人物照片的组数","组"]},
        // 	{"key": "D","value": ["人物照片的数量","张"]},
        // 	{"key": "E","value": ["每组人物照片的数量","张"]}
        // 	];
        // 组装数据
        let answer_content
        let equal_flag = 0
        let equation_exercise_mat = []
        for (let ii = 0; ii < equation_exercise.length; ii++) {
            if (equation_exercise[ii] >= 'A' && equation_exercise[ii] <= 'Z') {
                // 替换字母数据
                if (equal_flag == 0) {
                    // 左边
                    equation_exercise_mat.push(alphabet_value[equation_exercise[ii]])   // 组装标准数据
                }
                else {
                    answer_content = equation_exercise[ii]  // 计算答案字母
                }
            }
            else if (equation_exercise[ii] == '=') {
                equal_flag = 1
            }
            else if (equal_flag == 0) {
                equation_exercise_mat.push(equation_exercise[ii])
            }
        }
        // 标准题目数据处理
        // let answer_unit_mat = this.FindAlgebraProperty(variable_value, answer_content)[1]
        let answer_unit_mat = this.FindAllUnits(variable_value, answer_content)
        // console.log('数组单位', answer_unit_mat)
        // let math_base = new mathdiagnosis.MathBaseCaculateFunc()
        let standard_equation_mat = this.AppMatTurnStandardMat(equation_exercise_mat)
        // console.log('标准数组', JSON.stringify(standard_equation_mat))
        let [standard_num_mat, standard_symbol_mat] = this.GetMatNum([standard_equation_mat])
        // console.log('获取数字组', standard_num_mat, standard_symbol_mat)
        let static_symbol_mat = this.StaticCalSymbol(standard_equation_mat)
        // console.log('计算符号统计', static_symbol_mat)
        let standard_answer = this.StandardCalculateAnswer(equation_exercise_mat)
        // console.log('标准答案',standard_answer)
        // 用户数据处理：先分组、单组再分步、清除单位、判定每步计算过程、判定使用已知条件、最后一步判定单位
        let user_group_mat1 = this.UserMatGrouping(answer_mat)     // 分组数据
        // console.log('user_group_mat1', JSON.stringify(user_group_mat1))
        let all_symbol_mat = this.EaquationSymbolProcess(user_group_mat1)
        // console.log('列式计算符号统计', all_symbol_mat)
        if (all_symbol_mat.length < static_symbol_mat.length) {
            return [false, '列式不正确']
        }
        let user_num_mat = []
        let user_answer_num_mat = []
        let left_num_mat = []		// 等号左侧数字
        let right_num_mat = []		// 等号右侧数字
        for (let ii = 0; ii < user_group_mat1.length; ii++) {
            if (ii == user_group_mat1.length - 1) {
                // 最后一组单位判定
                console.log('最后一组诊断', JSON.stringify(user_group_mat1[ii]))
                // 看单位
                let [unit_flag, user_answer_mat] = this.NonAIAplUnitDiagnosis(answer_unit_mat, user_group_mat1[ii])
                // console.log('单位判定', unit_flag, JSON.stringify(user_answer_mat))
                if (unit_flag != true) {
                    return [false, '单位或其括弧不正确']
                }
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_answer_mat, 1)
                console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // 分步
                let user_group_mat = this.CalculateGrouping(user_answer_mat)    // 计算过程分离   
                // console.log('分步数组-----', user_group_mat)    
                // 单组计算过程诊断
                let part_answer_mat = []
                if (user_group_mat1.length == 1) {
                    // 一个算式时调用综合诊断
                    part_answer_mat = this.CalculateProcessDiagnosis(user_group_mat)
                    if (part_answer_mat[0] != true) {
                        return [false, '计算过程有误或步骤偏少']
                    }
                }
                else {
                    part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                    if (part_answer_mat[0] != true) {
                        return [false, '计算过程有误']
                    }
                }
                // let part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                // console.log('单组计算判定----', part_answer_mat, standard_answer)
                if (part_answer_mat[0] != true) {
                    return [false, '计算过程有误']
                }
                // 判定与题目结果
                let answer_judge = this.JudgeTwoNumMat(standard_answer, part_answer_mat[1])
                if (answer_judge == false) {
                    return [false, '结果不正确']
                }
                // console.log('与结果判定', answer_judge)
                // 判定最后一步的计算情况
                let [end_flag, end_str] = this.FinalStepProcess(user_group_mat[user_group_mat.length - 1])
                // console.log('最后一步统计情况', end_flag, end_str)
                if (end_flag == false) {
                    return [end_flag, end_str]
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                // console.log('获取数字和计算符号----', part_num_mat, part_symbol_mat)
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                console.log('匹配索引情况', standard_num_mat.flat(), part_num_mat[0], num1_in_num2, num2_in_num1)
                // if (num2_in_num1.length==part_num_mat[0].length){
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {   // 修正相差个数
                    //       if (num2_in_num1.length==part_num_mat[0].length){
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                user_num_mat.push(part_num_mat[0])		// 采用数字组
                left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算----')
                    return [false, '分子或分母存在计算']
                }

            }
            else {
                // 非最后一步只判定计算过程
                // console.log('前组诊断1',JSON.stringify(user_group_mat1[ii]))
                // 单位处理
                let non_unit_mat = this.PopUnitsProcess(user_group_mat1[ii])
                // console.log('去除单位1', non_unit_mat)
                // 分步
                let user_group_mat = this.CalculateGrouping(non_unit_mat)    // 计算过程分离 
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_group_mat, 1)
                console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // console.log('分步数组1', user_group_mat)    
                // 单组计算过程诊断
                let part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                console.log('单组计算判定1', part_answer_mat)
                if (part_answer_mat[0] != true) {
                    return [false, '计算过程有误']
                }
                // 判定最后一步的计算情况
                let [end_flag, end_str] = this.FinalStepProcess(user_group_mat[user_group_mat.length - 1])
                // console.log('最后一步统计情况', end_flag, end_str)
                if (end_flag == false) {
                    return [end_flag, end_str]
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                // console.log('获取数字和计算符号1', part_num_mat, part_symbol_mat)
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                console.log('匹配索引情况', standard_num_mat[0], part_num_mat[0], num1_in_num2, num2_in_num1)
                // if (num2_in_num1.length==part_num_mat[0].length){
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {   // 修正相差个数
                    //       if (num2_in_num1.length==part_num_mat[0].length){
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    // console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                user_num_mat.push(part_num_mat[0])		// 采用数字组
                left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                // console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算')
                    return [false, '分子或分母存在计算']
                }
            }
        }
        // console.log('左侧数据', left_num_mat.flat())
        // console.log('右侧数据', right_num_mat)
        // console.log('出现数据', standard_num_mat.flat())
        // let num_mat1 = [['0.2'],['2.7'],['4.4'],['2.5'], ['9.9']]
        // let num_mat2 = [['2','10'],['3','10'],['5','2'],['4','4','10']]
        // math_base.JudgeTwoNumIdxMat(num_mat1, num_mat2)
        let end_num_mat = right_num_mat.flat()
        let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), left_num_mat.flat())
        if (Math.abs(num2_in_num1.length - left_num_mat.flat().length) <= 1) {
            // if (num2_in_num1.length==left_num_mat.flat().length){
            // 
            console.log('左侧数据可找到出处')
            for (let ii = 0; ii < end_num_mat.length; ii++) {
                if (end_num_mat[ii].length > 1) {
                    // 分数结果，判定是否为最简分数
                    let gcd_num = this.integerGCDfunc(parseInt(end_num_mat[ii][end_num_mat[ii].length - 2]), parseInt(end_num_mat[ii][end_num_mat[ii].length - 1]))
                    if (gcd_num > 1) {
                        return [true, '分数未化简']
                    }
                }
            }
            return [true, '计算正确']
        }
        else {
            return [false, '给定数字或结果未完整使用']
        }
    }

    MultiAIAplDiagnose = (alphabet_value, variable_value, equation_exercise, answer_content, answer_mat) => {
        // 综合算式诊断
        // alphabet_value, variable_value, equation_exercise, answer_content, user_answer_mat
        // 智能应用题单步引导诊断：综合代数式equation_exercise：(A+B)xC；
        // alphabet_value：{'A':['2','3'],'B':['3','4'],'C':['1','7']};
        // let variable_value = [
        // 	{"key": "A","value": ["照片的总量", "张"]},
        // 	{"key": "B","value": ["风景照片的数量", "张"]},
        // 	{"key": "C","value": ["人物照片的组数","组"]},
        // 	{"key": "D","value": ["人物照片的数量","张"]},
        // 	{"key": "E","value": ["每组人物照片的数量","张"]}
        // 	];
        // let answer_content = "E";		// 修改代数表示， answer_content = "7"
        // 组装数据
        let equation_exercise_mat = []
        for (let ii = 0; ii < equation_exercise.length; ii++) {
            if (equation_exercise[ii] >= 'A' && equation_exercise[ii] <= 'Z') {
                // 替换字母数据
                equation_exercise_mat.push(alphabet_value[equation_exercise[ii]])   // 组装标准数据
            }
            else {
                equation_exercise_mat.push(equation_exercise[ii])
            }
        }
        // 标准题目数据处理
        // let answer_unit_mat = this.FindAlgebraProperty(variable_value, answer_content)[1]
        let answer_unit_mat = this.FindAllUnits(variable_value, answer_content)
        // console.log('数组单位', answer_unit_mat)
        // let math_base = new mathdiagnosis.MathBaseCaculateFunc()
        let standard_equation_mat = this.AppMatTurnStandardMat(equation_exercise_mat)
        // console.log('标准数组', JSON.stringify(standard_equation_mat))
        let [standard_num_mat, standard_symbol_mat] = this.GetMatNum([standard_equation_mat])
        // console.log('获取数字组', standard_num_mat, standard_symbol_mat)
        let static_symbol_mat = this.StaticCalSymbol(standard_equation_mat)
        // console.log('计算符号统计', static_symbol_mat)
        let standard_answer = this.StandardCalculateAnswer(equation_exercise_mat)
        console.log('标准答案', standard_answer)
        // 用户数据处理：先分组、单组再分步、清除单位、判定每步计算过程、判定使用已知条件、最后一步判定单位
        let user_group_mat1 = this.UserMatGrouping(answer_mat)     // 分组数据
        console.log('user_group_mat1', JSON.stringify(user_group_mat1))
        // 分析列式情况
        let all_symbol_mat = this.EaquationSymbolProcess(user_group_mat1)
        console.log('列式计算符号统计', all_symbol_mat)
        if (all_symbol_mat.length < static_symbol_mat.length - 1) {
            return [false, '列式不正确']
        }
        let user_num_mat = []
        let user_answer_num_mat = []
        let left_num_mat = []		// 等号左侧数字
        let right_num_mat = []		// 等号右侧数字
        for (let ii = 0; ii < user_group_mat1.length; ii++) {
            if (ii == user_group_mat1.length - 1) {
                // 最后一组单位判定
                console.log('最后一组诊断', JSON.stringify(user_group_mat1[ii]))
                // 看单位
                let [unit_flag, user_answer_mat] = this.NonAIAplUnitDiagnosis(answer_unit_mat, user_group_mat1[ii])
                // console.log('单位判定', unit_flag, JSON.stringify(user_answer_mat))
                if (unit_flag != true) {
                    return [false, '单位或其括弧不正确']
                }
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_answer_mat, 1)
                console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // 分步
                let user_group_mat = this.CalculateGrouping(user_answer_mat)    // 计算过程分离   
                console.log('分步数组-----', user_group_mat)
                if (user_group_mat[user_group_mat.length - 1].length >= 3) {
                    // 包含等号情况
                    return [false, '未计算得到最终结果']
                }
                // 单组计算过程诊断
                let part_answer_mat = []
                if (user_group_mat1.length == 1) {
                    // 一个算式时调用综合诊断
                    part_answer_mat = this.CalculateProcessDiagnosis(user_group_mat)
                }
                else {
                    part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                }
                // console.log('单组计算判定----', part_answer_mat)
                if (part_answer_mat[0] != true) {
                    return [false, '请检查计算过程！']
                }
                // 判定与题目结果
                let answer_judge = this.JudgeTwoNumMat(standard_answer, part_answer_mat[1])
                if (answer_judge == false) {
                    return [false, '结果不正确']
                }
                // console.log('与结果判定', answer_judge)
                // 判定最后一步的计算情况
                let [end_flag, end_str] = this.FinalStepProcess(user_group_mat[user_group_mat.length - 1])
                // console.log('最后一步统计情况', end_flag, end_str)
                if (end_flag == false) {
                    return [end_flag, end_str]
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                // console.log('获取数字和计算符号----', part_num_mat, part_symbol_mat)
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                // console.log('匹配索引情况', standard_num_mat.flat(),part_num_mat[0], num1_in_num2, num2_in_num1)
                // if (num2_in_num1.length==part_num_mat[0].length){
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {   // 修正相差个数
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                user_num_mat.push(part_num_mat[0])		// 采用数字组
                left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算----')
                    return [false, '分子或分母存在计算']
                }

            }
            else {
                // 非最后一步只判定计算过程
                // console.log('前组诊断1',JSON.stringify(user_group_mat1[ii]))
                // 单位处理
                let non_unit_mat = this.PopUnitsProcess(user_group_mat1[ii])
                // console.log('去除单位1', non_unit_mat)
                // 分步
                let user_group_mat = this.CalculateGrouping(non_unit_mat)    // 计算过程分离 
                // 新增括号判定2021-12-17
                let bracket_judge = this.JudgeALLBracket(user_group_mat, 1)
                console.log(bracket_judge)
                if (bracket_judge[0] == false) {
                    return bracket_judge
                }
                // console.log('分步数组1', user_group_mat) 
                if (user_group_mat[user_group_mat.length - 1].length >= 3) {
                    // 包含等号情况
                    return [false, '未计算得到最终结果']
                }
                // 单组计算过程诊断
                let part_answer_mat = this.CalculateProcessDiagnosis2(user_group_mat)
                console.log('单组计算判定1', part_answer_mat)
                if (part_answer_mat[0] != true) {
                    return [false, '计算过程不等']
                }
                // 判定最后一步的计算情况
                let [end_flag, end_str] = this.FinalStepProcess(user_group_mat[user_group_mat.length - 1])
                // console.log('最后一步统计情况', end_flag, end_str)
                if (end_flag == false) {
                    return [end_flag, end_str]
                }
                let [part_num_mat, part_symbol_mat] = this.GetMatNum(user_group_mat)
                // console.log('获取数字和计算符号1', part_num_mat, part_symbol_mat)
                let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), part_num_mat[0])
                console.log('匹配索引情况', standard_num_mat[0], part_num_mat[0], num1_in_num2, num2_in_num1)
                // if (num2_in_num1.length==part_num_mat[0].length){
                if (Math.abs(num2_in_num1.length - part_num_mat[0].length) <= 4) {   // 修正相差个数
                    // if (num2_in_num1.length==part_num_mat[0].length){
                    standard_num_mat.push(part_num_mat[part_num_mat.length - 1])
                    // console.log('更新前组', standard_num_mat.flat())
                }
                else {
                    return [false, '使用的数字未出现']
                }
                user_num_mat.push(part_num_mat[0])		// 采用数字组
                left_num_mat.push(part_num_mat[0])		// 等号左侧数字
                right_num_mat.push(part_num_mat[part_num_mat.length - 1])		// 等号右侧数字
                // console.log('user_num_mat', user_num_mat.flat())
                user_answer_num_mat.push(part_num_mat[part_num_mat.length - 1])
                if (part_num_mat[part_num_mat.length - 1].length < 1) {
                    // console.log('分子或分母存在计算')
                    return [false, '分子或分母存在计算']
                }
            }
        }
        // console.log('左侧数据', left_num_mat.flat())
        console.log('右侧数据', right_num_mat.flat())
        // console.log('出现数据', standard_num_mat.flat())
        // let num_mat1 = [['0.2'],['2.7'],['4.4'],['2.5'], ['9.9']]
        // let num_mat2 = [['2','10'],['3','10'],['5','2'],['4','4','10']]
        // math_base.JudgeTwoNumIdxMat(num_mat1, num_mat2)
        let [num1_in_num2, num2_in_num1] = this.JudgeTwoNumIdxMat(standard_num_mat.flat(), left_num_mat.flat())
        let end_num_mat = right_num_mat.flat()
        if (Math.abs(num2_in_num1.length - left_num_mat.flat().length) <= 1) {
            // if (num2_in_num1.length==left_num_mat.flat().length){
            // 
            console.log('左侧数据可找到出处')
            for (let ii = 0; ii < end_num_mat.length; ii++) {
                if (end_num_mat[ii].length > 1) {
                    // 分数结果，判定是否为最简分数
                    let gcd_num = this.integerGCDfunc(parseInt(end_num_mat[ii][end_num_mat[ii].length - 2]), parseInt(end_num_mat[ii][end_num_mat[ii].length - 1]))
                    if (gcd_num > 1) {
                        return [true, '分数未化简']
                    }
                }
            }
            return [true, '计算正确']
        }
        else {
            return [false, '给定数字或结果未完整使用']
        }
    }

    EaquationSymbolProcess = (user_group_mat1) => {
        // 用户列式情况
        let symbol_mat = []
        for (let ii = 0; ii < user_group_mat1.length; ii++) {
            // 单组
            for (let jj = 0; jj < user_group_mat1[ii][0].length; jj++) {
                // 单组第一行
                if (user_group_mat1[ii][0][jj].length == 1) {
                    if ((['+', '-', '×', 'x', 'X', '*', '÷']).indexOf(user_group_mat1[ii][0][jj][0]) >= 0) {
                        symbol_mat.push(user_group_mat1[ii][0][jj][0])
                    }
                    if (user_group_mat1[ii][0][jj][0] == '=') {
                        break
                    }
                }
            }
        }
        return symbol_mat
    }

    FinalStepProcess = (user_final_mat) => {
        // 最后一步的计算情况
        // 外层计算符号
        if (user_final_mat.length > 2) {
            return [false, '未得到最后结果']
        }
        for (let ii = 0; ii < user_final_mat.length; ii++) {
            if (user_final_mat[ii].length == 1) {
                if ((['+', '-', '÷', '×', '-', '+', 'x', 'X', '*', '÷', '(', '（', '）', ')', '[', ']']).indexOf(user_final_mat[ii][0]) >= 0) {
                    return [false, '未得到最后结果']
                }
            }
        }
        // 分子
        for (let kk = 0; kk < user_final_mat.length; kk++) {
            for (let ii = 0; ii < user_final_mat[kk].length; ii++) {
                for (let jj = 0; jj < user_final_mat[kk][ii].length; jj++) {
                    if ((['+', '-', '÷', '×', '-', '+', 'x', 'X', '*', '÷', '(', '（', '）', ')', '[', ']']).indexOf(user_final_mat[kk][ii][jj]) >= 0) {
                        return [false, '未得到最后结果']
                    }
                }
            }
        }

        return [true, '计算完成']
    }

    FindAlgebraProperty = (variable_value, find_algebra) => {
        // find_algebra:A
        // variable_value:"key": "A","value": ["照片的总量", "张"]},
        for (let ii = 0; ii < variable_value.length; ii++) {
            if (variable_value[ii]['key'] == find_algebra) {
                return variable_value[ii]['value']
            }
        }
        return false
    }

    FindAllUnits = (variable_value, find_algebra) => {
        let units_mat = []
        // 找标准
        for (let ii = 0; ii < variable_value.length; ii++) {
            if (variable_value[ii]['key'] == find_algebra) {
                units_mat.push(variable_value[ii]['value'][1])
            }
        }
        // 找全部单位
        for (let ii = 0; ii < variable_value.length; ii++) {
            if (units_mat.indexOf(variable_value[ii]['value'][1]) < 0) {
                units_mat.push(variable_value[ii]['value'][1])
            }
        }
        return units_mat
    }

    JudgeSingleBracket = (bracket_str, start_formual_flag) => {
        // 单组字符串判定:start_formual_flag:开头标签
        // 括号判定
        // let bracket_str = '{[2+(3-4)]x(7-8)}x{(5+6)}'
        // 小：1，-1；中：2，-2；大：3，-3
        // console.log('bracket_str', bracket_str)
        let bracket_idx = []
        let bracket_flag = []
        let bracket_dict = { 'small_bracket': [[], []], 'medium_bracket': [[], []], 'large_bracket': [[], []], }
        let bracket_level = { 'small_bracket': 1, 'medium_bracket': 2, 'large_bracket': 3, }
        let bracket_chn = { 'small_bracket': '小括号', 'medium_bracket': '中括号', 'large_bracket': '大括号', }
        let bracket_mat = bracket_str.split('')
        let bracket_id = -1
        bracket_mat.forEach((part_str, part_idx) => {
            if (part_str == '(') {
                bracket_idx.push(part_idx)
                bracket_flag.push(1)
                bracket_dict['small_bracket'][0].push(++bracket_id)
                bracket_dict['small_bracket'][1].push(1)
            }
            else if (part_str == ')') {
                bracket_idx.push(part_idx)
                bracket_flag.push(-1)
                bracket_dict['small_bracket'][0].push(++bracket_id)
                bracket_dict['small_bracket'][1].push(-1)
            }
            else if (part_str == '[') {
                bracket_idx.push(part_idx)
                bracket_flag.push(2)
                bracket_dict['medium_bracket'][0].push(++bracket_id)
                bracket_dict['medium_bracket'][1].push(2)
            }
            else if (part_str == ']') {
                bracket_idx.push(part_idx)
                bracket_flag.push(-2)
                bracket_dict['medium_bracket'][0].push(++bracket_id)
                bracket_dict['medium_bracket'][1].push(-2)
            }
            else if (part_str == '{') {
                bracket_idx.push(part_idx)
                bracket_flag.push(3)
                bracket_dict['large_bracket'][0].push(++bracket_id)
                bracket_dict['large_bracket'][1].push(3)
            }
            else if (part_str == '}') {
                bracket_idx.push(part_idx)
                bracket_flag.push(-3)
                bracket_dict['large_bracket'][0].push(++bracket_id)
                bracket_dict['large_bracket'][1].push(-3)
            }
        })
        // console.log('括号索引', bracket_idx)
        // console.log('括号标记', bracket_flag)
        // 判定整体括号组使用情况
        let bracket_judge = 1
        if (bracket_idx.length % 2 != 0) {
            // 括号奇数、括号有缺失
            bracket_judge = 0
            return [false, '括号缺失']
        }
        // console.log('括号个数bracket_judge',bracket_idx.length, bracket_judge)
        let flag_sum = 0
        bracket_flag.forEach((part_flag) => {
            flag_sum += part_flag
        })
        if (flag_sum != 0) {
            bracket_judge = 0
            return [false, '括号不匹配']
        }
        // console.log('括弧对flag_sum', flag_sum)
        // console.log('括号分级统计', bracket_dict)
        // 常规判定：括号对---考虑同级包含的情况
        let bracket_match = {}
        // 修改常规判定方法：放宽条件
        let bracket_match_idx = { 'small_bracket': [], 'medium_bracket': [], 'large_bracket': [], }
        for (let part_key in bracket_dict) {
            // console.log('part_key', part_key)
            // let part_match=[]
            let part_idx = []
            for (let ii = 0; ii < bracket_dict[part_key][1].length; ii++) {
                if (bracket_dict[part_key][1][ii] > 0) {
                    // part_match.push(bracket_dict[part_key][1][ii])
                    part_idx.push(bracket_dict[part_key][0][ii])
                }
                else {
                    // 存在配对
                    bracket_match_idx[part_key].push([part_idx.pop(), bracket_dict[part_key][0][ii]])

                }
                // console.log('part_idx', part_idx)
            }
            // console.log('bracket_match_idx', bracket_match_idx[part_key])
            if (bracket_match_idx[part_key].length != bracket_dict[part_key][0].length / 2) {
                bracket_match[part_key] = 0
                bracket_judge = 0
                return [false, '错误使用括号1']
            }
            else {
                bracket_match[part_key] = 1
            }
        }
        // console.log('括号配对情况1', bracket_match)
        // 常规判定：括号包含层级当前配对情况中能不能包含当前级的情况以及判定包含高级或低级的情况
        for (let part_key_1 in bracket_match_idx) {
            for (let part_key_2 in bracket_match_idx) {
                // 分别比对配对情况：区间包含偶数
                for (let idx_1 = 0; idx_1 < bracket_match_idx[part_key_1].length; idx_1++) {
                    let part_match_1 = bracket_match_idx[part_key_1][idx_1]
                    // console.log('part_match_1', part_match_1)
                    for (let idx_2 = 0; idx_2 < bracket_match_idx[part_key_2].length; idx_2++) {
                        let part_match_2 = bracket_match_idx[part_key_2][idx_2]
                        // 判定
                        let judge_num = 0
                        if (part_match_1[0] > part_match_2[0] && part_match_1[0] < part_match_2[1]) {
                            judge_num += 1
                        }
                        if (part_match_1[1] > part_match_2[0] && part_match_1[1] < part_match_2[1]) {
                            judge_num += 1
                        }
                        // console.log('part_match_1, part_match_2, judge_num', part_match_1, part_match_2, judge_num)
                        if (judge_num % 2 != 0) {
                            // 未有效配对
                            bracket_match[part_key_1] = 0
                            bracket_judge = 0
                            return [false, '错误使用括号2']
                        }
                    }
                }

            }
        }
        // console.log('括号配对情况2', bracket_match)
        let bracket_contain = []
        let bracket_low_contain = []
        let bracket_same_contain = []   // 同级
        let bracket_high_contain = []   // 高级被低一级包含
        for (let part_key_1 in bracket_match_idx) {
            for (let part_key_2 in bracket_match_idx) {
                // 分别比对配对情况：区间包含偶数
                if (bracket_level[part_key_1] < bracket_level[part_key_2]) {
                    // 低一级在 高一级的情况
                    // 判断：高一级中的每一个都括号位置至少都存在一个第一级的括号
                    for (let idx_2 = 0; idx_2 < bracket_match_idx[part_key_2].length; idx_2++) {
                        let part_match_2 = bracket_match_idx[part_key_2][idx_2]
                        // console.log('part_match_2', part_match_2)
                        let single_fract_flag = 0
                        for (let idx_1 = 0; idx_1 < bracket_match_idx[part_key_1].length; idx_1++) {
                            let part_match_1 = bracket_match_idx[part_key_1][idx_1]
                            // 判定
                            let judge_num = 0
                            if (part_match_1[0] > part_match_2[0] && part_match_1[0] < part_match_2[1]) {
                                judge_num += 1
                            }
                            if (part_match_1[1] > part_match_2[0] && part_match_1[1] < part_match_2[1]) {
                                judge_num += 1
                            }
                            // console.log('part_match_1, part_match_2, judge_num', part_match_1, part_match_2, judge_num)
                            if (judge_num % 2 == 0 && judge_num / 2 > 0) {
                                // 有效包含
                                single_fract_flag += 1
                            }
                        }
                        if (single_fract_flag <= 0) {
                            // 高级存在低级
                            bracket_low_contain.push(bracket_level[part_key_2] + '_' + idx_2)
                        }
                    }
                }
                else if (bracket_level[part_key_1] > bracket_level[part_key_2]) {
                    // 高一级在 低一级的情况
                    for (let idx_1 = 0; idx_1 < bracket_match_idx[part_key_1].length; idx_1++) {
                        let part_match_1 = bracket_match_idx[part_key_1][idx_1]
                        // console.log('part_match_1', part_match_1)
                        for (let idx_2 = 0; idx_2 < bracket_match_idx[part_key_2].length; idx_2++) {
                            let part_match_2 = bracket_match_idx[part_key_2][idx_2]
                            // 判定
                            let judge_num = 0
                            if (part_match_1[0] > part_match_2[0] && part_match_1[0] < part_match_2[1]) {
                                judge_num += 1
                            }
                            if (part_match_1[1] > part_match_2[0] && part_match_1[1] < part_match_2[1]) {
                                judge_num += 1
                            }
                            // console.log('高一级在 低一级的情况：part_key_1, part_match_1, judge_num', part_key_1, part_match_1, judge_num)
                            // console.log('高一级在 低一级的情况：part_key_2, part_match_2, judge_num', part_key_2, part_match_2, judge_num)
                            if (judge_num > 0) {
                                // 未有效配对
                                bracket_match[part_key_1] = 0
                                bracket_judge = 0
                                bracket_contain.push(bracket_chn[part_key_2] + '中包含' + bracket_chn[part_key_1])
                                bracket_high_contain.push(bracket_level[part_key_1] + '' + bracket_level[part_key_2])
                                // return [false, '错误使用括号1']
                            }
                        }
                    }
                }
                else {
                    // 同级情况包含
                    for (let idx_1 = 0; idx_1 < bracket_match_idx[part_key_1].length; idx_1++) {
                        let part_match_1 = bracket_match_idx[part_key_1][idx_1]
                        // console.log('part_match_1', part_match_1)
                        for (let idx_2 = 0; idx_2 < bracket_match_idx[part_key_2].length; idx_2++) {
                            let part_match_2 = bracket_match_idx[part_key_2][idx_2]
                            // 判定
                            let judge_num = 0
                            if (part_match_1[0] > part_match_2[0] && part_match_1[0] < part_match_2[1]) {
                                judge_num += 1
                            }
                            if (part_match_1[1] > part_match_2[0] && part_match_1[1] < part_match_2[1]) {
                                judge_num += 1
                            }
                            // console.log('高一级在 低一级的情况：part_key_1, part_match_1, judge_num', part_key_1, part_match_1, judge_num)
                            // console.log('高一级在 低一级的情况：part_key_2, part_match_2, judge_num', part_key_2, part_match_2, judge_num)
                            if (judge_num > 0) {
                                // 未有效配对
                                bracket_match[part_key_1] = 0
                                bracket_judge = 0
                                bracket_contain.push(bracket_chn[part_key_2] + '中包含' + bracket_chn[part_key_1])
                                bracket_same_contain.push(bracket_level[part_key_2] + '' + bracket_level[part_key_1])
                                // return [false, '错误使用括号1']
                            }
                        }
                    }
                }
            }
        }
        // console.log('括号配对情况3', bracket_str, bracket_match)
        // console.log('括号包含情况：\n', bracket_str, bracket_contain)
        // console.log('高级中包含低级：\n', bracket_str, bracket_low_contain)
        // console.log('同级包含：\n', bracket_str, bracket_same_contain)
        // console.log('高级被低级包含：\n', bracket_str, bracket_high_contain)
        if (start_formual_flag == 0) {
            // 列式项判定
            if (bracket_low_contain.length < 1 && bracket_high_contain.length < 1) {
                // 同级的情况--都正确下在判定
                if (bracket_same_contain.indexOf('11') >= 0 || bracket_same_contain.indexOf('22') >= 0) {
                    return [false, '错误使用括号2']
                }
            }
            else {
                return [false, '错误使用括号2']
            }
        }
        else {
            // 计算过程只判定包含关系
            if (bracket_high_contain.length < 1) {
                // 同级的情况：包含关系正确
                if (bracket_same_contain.indexOf('11') >= 0 || bracket_same_contain.indexOf('22') >= 0) {
                    // 小括号和中括号同级包含
                    return [false, '错误使用括号2']
                }
            }
            else {
                return [false, '错误使用括号2']
            }

        }
        // 列式判定：括弧层级从小括号开始
        // console.log(bracket_str.match('[(][0-9+\-x÷]+[0-9][)]'))
        // 判定多重括弧使用的情况，多使用
        let replace_end_str = bracket_str.replace(/[(][0-9+\-x÷]+[0-9][)]/g, '1').
            replace(/[\[][0-9+\-x÷]+[0-9][\]]/g, '1').
            replace(/[{][0-9+\-x÷]+[0-9][}]/g, '1')
        // console.log('最后替换字符串', replace_end_str, 
        //                             replace_end_str.indexOf('('), 
        //                             replace_end_str.indexOf(')'), 
        //                             replace_end_str.indexOf('['), 
        //                             replace_end_str.indexOf(']'), 
        //                             replace_end_str.indexOf('{'), 
        //                             replace_end_str.indexOf('}'))
        if (replace_end_str.indexOf('(') >= 0 || replace_end_str.indexOf(')') >= 0 ||
            replace_end_str.indexOf('[') >= 0 || replace_end_str.indexOf(']') >= 0 ||
            replace_end_str.indexOf('{') >= 0 || replace_end_str.indexOf('}') >= 0) {
            //计算到最后还有括弧
            return [false, '错误使用括号3']

        }
        return [true, '括号使用正确']
    }

    StandardBracketTransform = (user_part_mat) => {
        // 标准用户数据转换算式
        // let user_part_mat = [['='],['('],['2'],['+'],['3','4'],[')'],['-'],['2'],['x'],['3.3']]
        let new_bracket_str = ''
        user_part_mat.forEach((part_value) => {
            if ((['+']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += '+'
            }
            else if ((['-']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += '-'
            }
            else if ((['x', 'X', '×', '*']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += 'x'
            }
            else if ((['÷']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += '÷'
            }
            else if ((['(', ')']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += part_value
            }
            else if ((['[', ']']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += part_value
            }
            else if ((['{', '}']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += part_value
            }
            else if ((['=']).indexOf(part_value[0]) >= 0) {
                new_bracket_str += part_value
            }
            else {
                new_bracket_str += '1'
            }
        })
        // console.log('答题数据单组替换', new_bracket_str)
        return new_bracket_str
    }

    JudgeALLBracket = (user_mat, apl_flag) => {
        // user_mat, apl_flag :用户计算数据、应用题标签1
        if (apl_flag == 0) {
            // 计算题
            // console.log('计算题括号使用判定------', user_mat)
            for (let idx = 0; idx < user_mat.length; idx++) {
                let new_bracket_str = this.StandardBracketTransform(user_mat[idx])
                // console.log('new_bracket_str', 'new_bracket_str')
                let single_judge = this.JudgeSingleBracket(new_bracket_str, 1)       // 0:列式判定；1：其他
                if (single_judge[0] == false) {
                    return single_judge
                }
            }
        }
        else if (apl_flag == 1) {
            // 应用题
            for (let idx = 0; idx < user_mat.length; idx++) {
                if (idx == 0) {
                    let new_bracket_str = this.StandardBracketTransform(user_mat[idx])
                    let single_judge = this.JudgeSingleBracket(new_bracket_str, 0)       // 0:列式判定；1：其他
                    if (single_judge[0] == false) {
                        return single_judge
                    }
                }
                else {
                    let new_bracket_str = this.StandardBracketTransform(user_mat[idx])
                    let single_judge = this.JudgeSingleBracket(new_bracket_str, 1)       // 0:列式判定；1：其他
                    if (single_judge[0] == false) {
                        return single_judge
                    }
                }
            }
        }
        return [true, '括号使用正确']
    }
}
let math_base_process = new MathBaseCaculateFunc()

function NonAICalculateDiagnose(standard_stem, standard_answer, user_answer, answer_content = false) {
    // let standard_stem = [['2','8'],'+',['4','8']]    // 计算题题干
    // let standard_answer = [['2','4']] // 标准答案 // // let standard_answer = ['0.2']    
    // let user_answer = [[['='],['2+4','8']],[['='],['2x3','2x4']],[['='],['0.5']]]        //用户答题数据
    console.log('_______________________________standard_stem', JSON.stringify(standard_stem),)
    console.log('_______________________________standard_answer', JSON.stringify(standard_answer))
    console.log('_______________________________user_answer', JSON.stringify(user_answer))
    return math_base_process.NonIntelligentComputingDiagnosis(standard_stem, standard_answer, user_answer, answer_content)
}

function PopUnitsProcess(user_answer_mat) {
    // 单位净化处理：得到纯计算过程：
    // 单位换算的计算过程暂时未作考虑
    let new_user_answer_mat = []
    for (let ii = 0; ii < user_answer_mat.length; ii++) {
        // 
        let part_user_answer_mat = []
        for (let jj = 0; jj < user_answer_mat[ii].length; jj++) {
            // 单块判定
            if (user_answer_mat[ii][jj].length >= 2) {
                // 分数类
                part_user_answer_mat.push(user_answer_mat[ii][jj])
            }
            else {
                // 非分数类：单位、数字、符号的判定
                if (NumSymbolJudgement(user_answer_mat[ii][jj][0])) {
                    part_user_answer_mat.push(user_answer_mat[ii][jj])
                }
                else {
                    // 出现单位时，需要对前后相邻为1的括号判定
                    // console.log('前后判定', part_user_answer_mat, jj)
                    if (jj > 0 && part_user_answer_mat[jj - 1][0] == '(') {
                        // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                        // console.log('弹出')
                        part_user_answer_mat.pop()
                        if (jj < user_answer_mat[ii].length - 1 && user_answer_mat[ii][jj + 1][0] == ')') {
                            // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                            // console.log('到了吗1')
                            jj += 1
                        }
                    }
                    else if (jj < user_answer_mat[ii].length - 1 && user_answer_mat[ii][jj + 1][0] == ')') {
                        // if (jj>0 && (['(']).indexOf(part_user_answer_mat[jj-1][0])>=0){
                        // console.log('到了吗2')
                        jj += 1
                    }
                    else {
                        part_user_answer_mat.push(user_answer_mat[ii][jj])
                    }
                }
            }
            // console.log('part_user_answer_mat', part_user_answer_mat)
        }
        new_user_answer_mat.push(part_user_answer_mat)
    }
    return new_user_answer_mat
}

function UserMatGrouping(user_mat) {
    // 用户答题分组
    let user_group_mat = []
    let part_group_mat = []
    for (let ii = 0; ii < user_mat.length; ii++) {
        // console.log('=======', user_mat[ii][0][0]!='=')
        if (ii == 0 || user_mat[ii][0][0] == '=') {
            part_group_mat.push(user_mat[ii])
        }
        else if (user_mat[ii][0][0] != '=' && part_group_mat.length < 1) {
            part_group_mat.push(user_mat[ii])
        }
        else if (user_mat[ii][0][0] != '=' && part_group_mat.length >= 1) {
            user_group_mat.push(part_group_mat)
            part_group_mat = []
            part_group_mat.push(user_mat[ii])
        }
        if (ii == user_mat.length - 1) {
            user_group_mat.push(part_group_mat)
        }
        // console.log('---------', part_group_mat)
    }
    // console.log('用户答题数据分组', JSON.stringify(user_group_mat), user_group_mat.length)
    return user_group_mat
}

function NumSymbolJudgement(init_str) {
    // 数字、符号判定
    // console.log('init_str', init_str)
    for (let ii = 0; ii < init_str.length; ii++) {
        // 
        if ((['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '÷', '×', '-', '+', 'x', 'X', '*', '÷', '(', '（', '）', ')', '[', ']', '.', '%']).indexOf(init_str[ii]) < 0) {
            // 出现非正常计算符号
            return false
        }
    }
    return true
}


function NonAIApplicationDiagnose(alternative_options, user_answer_mat) {
    // 非智能题应用题诊断
    // 单位诊断、分步/综合列式分解、单步诊断、综合计算诊断；分步计算的过程中引入计算中的可知条件进行诊断
    // 先进行综合代数式的诊断反馈，再考虑分解出是单步还是多步列式
    // 综合算式1，非智能题单位诊断：
    let [unit_flag, user_answer_mat2] = NonAIApplicationUnitDiagnosis(alternative_options, user_answer_mat)
    if (typeof (user_answer_mat2) == 'object') {
        let [calculate_flag, calculate_str] = math_base_process.NonIntelligentComputingDiagnosis(standard_stem, standard_answer, user_answer_mat2)
        return [unit_flag, calculate_flag]      //unit_flag:单位诊断标识, calculate_flag：计算诊断标识
    }
    return [true, true]

}

function AICalculateDiagnose(equation_detail, alphabet_value0, answer_content, user_answer) {
    // 智能计算题调用
    // let alphabet_value = {'A': ['3','8'], 'B': ['2','3'], 'C': ['1','4'], 'D': ['1', '6'], 'E': ['13', '24']}  // 代数值字典
    // let answer_content = ['13', '24']     // 标准答案
    // let equation_detail = ['A+B×C', 'A+D', 'E']	// 计算过程
    // let user_answer  = [
    //                         [['3','8'],['+'], ['2','3'], ['×'],['1','4']],
    //                         [['='],['3','8'],['+'],['1', '6']],
    //                         [['='],['9+4', '24']],
    //                         [['='],['13', '24']]
    //                     ]    // 用户答题数据
    // 组装题干
    let alphabet_value = AlgebraValueTransform(alphabet_value0)
    console.log('alphabet_value', alphabet_value)
    let standard_stem = []
    for (let ii = 0; ii < equation_detail[0].length; ii++) {
        if (equation_detail[0][ii] >= 'A' && equation_detail[0][ii] <= 'w') {
            standard_stem.push(alphabet_value[equation_detail[0][ii]])
        }
        else {
            standard_stem.push(equation_detail[0][ii])
        }
    }
    console.log('题干组装', standard_stem)
    let standard_answer = [answer_content]
    if (answer_content >= 'A' && answer_content <= 'w') {
        standard_answer = [alphabet_value[answer_content]]
    }
    return math_base_process.NonIntelligentComputingDiagnosis(standard_stem, standard_answer, user_answer)
}

function SingleAIAplDiagnose(alphabet_value, variable_value, equation_exercise, answer_mat) {
    // 应用题单步引导诊断
    // 智能应用题单步引导诊断：三元代数式equation_exercise：AxB=C；alphabet_value：{'A':['2','3'],'B':['3','4'],'C':['1','7']};变量属性：{'A':['大楼高度','米']}
    // let variable_value = [
    // 	{"key": "A","value": ["照片的总量", "张"]},
    // 	{"key": "B","value": ["风景照片的数量", "张"]},
    // 	{"key": "C","value": ["人物照片的组数","组"]},
    // 	{"key": "D","value": ["人物照片的数量","张"]},
    // 	{"key": "E","value": ["每组人物照片的数量","张"]}
    // 	];
    let new_alphabet_value = AlgebraValueTransform(alphabet_value)
    let new_variable_value = VariableValueTransform(variable_value)
    return math_base_process.SingleAIAplDiagnose(new_alphabet_value, new_variable_value, equation_exercise, answer_mat)
}

function AlgebraValueTransform(alphabet_value) {
    // alphabet_value
    let new_alphabet_value = {}
    for (let algebra_key in alphabet_value) {
        if (typeof (alphabet_value[algebra_key]) == 'object') {
            // 数组
            let part_value_str = []
            for (let ii = 0; ii < alphabet_value[algebra_key][1].length; ii++) {
                part_value_str.push(alphabet_value[algebra_key][1][ii].toString())
            }
            new_alphabet_value[algebra_key] = part_value_str
        }
        else {
            new_alphabet_value[algebra_key] = [alphabet_value[algebra_key].toString()]
        }
    }
    return new_alphabet_value
}

function VariableValueTransform(variable_value) {
    // alphabet_value
    let new_variable_value = []
    variable_value.forEach((part_value) => {
        console.log('----', part_value, part_value['value'])
        if ((['倍']).indexOf(part_value['value'][1]) >= 0) {
            // 去除部分不诊断单位
            part_value['value'][1] = ''
            new_variable_value.push(part_value)
        }
        else {
            new_variable_value.push(part_value)
        }
    })
    return new_variable_value
}

function MultiAIAplDiagnose(alphabet_value, variable_value, equation_exercise, answer_content, answer_mat) {
    console.log('|||||||||||||||', alphabet_value, variable_value, equation_exercise, answer_content, answer_mat)
    // 应用题诊断
    // 综合算式诊断
    // alphabet_value, variable_value, equation_exercise, answer_content, user_answer_mat
    // 智能应用题单步引导诊断：综合代数式equation_exercise：(A+B)xC；
    // alphabet_value：{'A':['2','3'],'B':['3','4'],'C':['1','7']};
    // let variable_value = [
    // 	{"key": "A","value": ["照片的总量", "张"]},
    // 	{"key": "B","value": ["风景照片的数量", "张"]},
    // 	{"key": "C","value": ["人物照片的组数","组"]},
    // 	{"key": "D","value": ["人物照片的数量","张"]},
    // 	{"key": "E","value": ["每组人物照片的数量","张"]}
    // 	];
    // let answer_content = "E";		// 修改代数表示， answer_content = "7"
    let new_alphabet_value = AlgebraValueTransform(alphabet_value)
    // console.log('转换', alphabet_value, new_alphabet_value)
    let new_variable_value = VariableValueTransform(variable_value)
    return math_base_process.MultiAIAplDiagnose(new_alphabet_value, new_variable_value, equation_exercise, answer_content, answer_mat)
}

function NonAIAplDiagnose(equation_exercise, answer_unit_str, answer_mat, answer_content = false) {
    return math_base_process.NonAIAplDiagnose(equation_exercise, answer_unit_str, answer_mat, answer_content)
}

function TriadicRelationTransform(tri_mat) {
    // 三元关系转换
    // 重组三元代数式顺序
    // let tri_mat = ['A+B=C','D+E=B','C+F=G','L+M=A','H-I=F','JxK=D']
    // 
    let left_mat = []
    let right_mat = []
    tri_mat.forEach((part_str) => {
        if (left_mat.indexOf(part_str[0]) < 0) {
            left_mat.push(part_str[0])
        }
        if (left_mat.indexOf(part_str[2]) < 0) {
            left_mat.push(part_str[2])
        }
        if (right_mat.indexOf(part_str[4]) < 0) {
            right_mat.push(part_str[4])
        }
    })
    // console.log('left_mat', left_mat)
    // console.log('right_mat', right_mat)
    // 判定左侧数据是否为代数式计算符号的倍数关系---默认相同----标准
    let end_algebra = ''
    for (let part_idx in right_mat) {
        // console.log(right_mat[part_idx])
        if (left_mat.indexOf(right_mat[part_idx]) < 0) {
            // 未使用
            end_algebra = right_mat[part_idx]
        }
    }
    // console.log('未使用字母', end_algebra)
    let tree_mat = []
    tree_mat.push([end_algebra])
    let unknow_flag = 0
    let layer = 0
    while (layer < 10) {
        let part_layer = []
        let all_flag = 0
        for (let ii = 0; ii < tree_mat[layer].length; ii++) {
            // part_layer.push(tree_mat[layer][0])
            let part_flag = 0
            if (tree_mat[layer][ii] >= 'A') {
                for (let part_idx = 0; part_idx < tri_mat.length; part_idx++) {
                    // 遍历所有三元关系---使用过后可以删除
                    // console.log(tri_mat[part_idx][4],tree_mat[layer][ii])
                    if (tri_mat[part_idx][4] == tree_mat[layer][ii]) {
                        // 找到父组：添加子成分
                        part_layer.push(tri_mat[part_idx][0])
                        part_layer.push(tri_mat[part_idx][2])
                        part_flag = 1
                        all_flag = 1
                    }
                }
            }
            if (part_flag == 0) {
                // 无子组：加空字符串
                part_layer.push('')
                part_layer.push('')
            }
        }
        if (all_flag == 0) {
            break
        }
        tree_mat.push(part_layer)
        layer += 1
    }
    // console.log(tree_mat)
    // 反向组装
    let new_tri_mat = []
    for (let idx = tree_mat.length - 1; idx >= 1; idx--) {
        // console.log('----', tree_mat[idx])
        for (let idx_1 = 0; idx_1 < tree_mat[idx].length; idx_1 = idx_1 + 2) {
            // console.log(tree_mat[idx][idx_1],tree_mat[idx][idx_1+1])
            tri_mat.forEach((part_str) => {
                // console.log(part_str[0], tree_mat[idx][idx_1],part_str[2],tree_mat[idx][idx_1+1])
                if (part_str[0] == tree_mat[idx][idx_1] && part_str[2] == tree_mat[idx][idx_1 + 1]) {
                    new_tri_mat.push(part_str)
                }
            })
        }
    }
    // console.log('新组合', new_tri_mat)
    return new_tri_mat
}

function StandardCalculateAnswer(init_mat) {
    // 标准结果计算
    return math_base_process.StandardCalculateAnswer(init_mat)
}

const mathdiagnosis = {
    // 创建函数库
    // StandardSubstituteStr,	// 标准字符串转换
    // TwoMatUnite,			// 矩阵交集
    BaseCalculateDiagnose1,	// 整数类：非智能计算题
    IntAICalculateDiagnose, // 整数类：智能计算题
    IntAIApplicationDiagnose, //整数类： 智能应用题
    // ApplicationUnitDiagnosis, // 单位诊断
    // NonAIApplicationUnitDiagnosis,       // 死题应用题诊断
    // NonAIApplicationDiagnose,             // 非智能题应用题诊断
    // PopUnitsProcess,             // 单位判定
    // UserMatGrouping,            // 用户数据等号分组
    // MathBaseCaculateFunc,       // 计算类
    NonAICalculateDiagnose,     // 混合类：非智能计算题
    AICalculateDiagnose,        // 混和类:智能计算题
    NonAIAplDiagnose,             // 非智能题应用题诊断
    SingleAIAplDiagnose,        // 应用题单步引导诊断
    MultiAIAplDiagnose,         // 应用题诊断
    TriadicRelationTransform,   // 三元关系转换
    StandardCalculateAnswer,    // 标准结果计算
}

export default mathdiagnosis;