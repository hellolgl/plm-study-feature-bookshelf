import topaicTypes from '../../res/data/MathTopaicType'
import mathdiagnosis from '../../util/diagnosis/MathSpecificDiagnosisModule'

export function diagnosis(data){
    const {_diagnosis_name,answer_content,exercise_data_type} = data
    data._diagnosis_type = _diagnosis_name //分数的拆分，巧算24点，巧填运算符号
    if(topaicTypes.diagnosis_type_1_arr.indexOf(_diagnosis_name) > -1) data._diagnosis_type = '1'
    if(topaicTypes.diagnosis_type_2_arr.indexOf(_diagnosis_name) > -1) data._diagnosis_type = '2'
    let my_answer = ''
    let topic_answer = ''
    let key = ''
    let key_arr = []
    let final_wrong_arr = []
    switch(data._diagnosis_type) {
        case '1':
            key = data.my_answer_tk_map?Object.keys(data.my_answer_tk_map):''
            if(_diagnosis_name === topaicTypes.Text_One_Num_Fill_Blank || _diagnosis_name === topaicTypes.Img_One_Num_Fill_Blank || _diagnosis_name === topaicTypes.Calculation_Problem ||  _diagnosis_name === topaicTypes.Application_Questions){
                // 文字填空题-1个空数字,图片填空题-1个空数字，计算题,应用题
                if(exercise_data_type === 'FS'){
                    if(data.my_answer_tk_map[key[0]].isFraction){
                        my_answer = []
                        let answer_tk = data.my_answer_tk_map[key[0]]
                        for(let i in answer_tk){
                            if(answer_tk[i].init_char_mat){
                                my_answer.push(answer_tk[i].init_char_mat.join(''))
                            }
                        }
                        my_answer = my_answer.toString()
                    }else{
                        my_answer = data.my_answer_tk_map[key[0]].init_char_mat.join('')
                    }
                    if(!my_answer) my_answer = 'no'  //没填答案算错
                    for(let i = 0 ; i<answer_content[0].length; i++){
                        // 分数类的答案可能是多个，根据学术录入的答案去比对
                        let item = answer_content[0][i]
                        if(Array.isArray(item)){
                            item = item.toString()
                        }else{
                            // 正确答案是分数或者非分数的情况，非分数要处理一下
                            item = item.replaceAll(';','') //一个空多个答案的用;隔开
                        }
                        if(item === my_answer){
                            topic_answer = my_answer
                            break
                        }
                    }
                }else{
                    topic_answer = answer_content
                    my_answer = data.my_answer_tk_map[key[0]].init_char_mat.join('')
                }
            }
            if(_diagnosis_name === topaicTypes.Multipl_Choice_ABC || _diagnosis_name === topaicTypes.Multipl_Choice_123 || _diagnosis_name === topaicTypes.Than_Size || _diagnosis_name === topaicTypes.Judegment || _diagnosis_name === topaicTypes.Multipl_Choice){
                // ABC选择题 123选择题  选择题（数学智能学习计划生成的选择题，诊断提题型就是选择题） 比较大小填空题 判断题 
                my_answer = data._my_answer
                topic_answer = answer_content
                if(exercise_data_type === "FS"){
                    topic_answer = answer_content[0][0]
                }
                if(_diagnosis_name === topaicTypes.Than_Size){
                    topic_answer = topic_answer.replaceAll('=','＝').replaceAll('>','＞').replaceAll('<','＜')
                }
                if(_diagnosis_name === topaicTypes.Judegment){
                    topic_answer = topic_answer.replaceAll('✓','√')
                }
            }
            console.log('诊断_________________',my_answer,topic_answer,my_answer===topic_answer)
            return {
                result:my_answer === topic_answer,
                wrong_arr:key?[key[0]]:''
            }
        case '2':
            if(_diagnosis_name === topaicTypes.Text_Much_Num_Fill_Blank || _diagnosis_name === topaicTypes.Img_Much_Num_Fill_Blank){
                // 文字填空题-多个空数字,图片填空题-多个空数字
                if(exercise_data_type === 'FS'){
                    let my_answer_arr_1 = []    //用来找错误位置
                    let my_answer_arr_2 = []    //用来直接比对正确答案
                    for(let i in data.my_answer_tk_map){
                        let item = data.my_answer_tk_map[i]
                        if(item.isFraction){
                            let f = []
                            for(let ii in item){
                                item[ii].init_char_mat?f = f.concat([item[ii].init_char_mat.join('')]):null
                            }
                            my_answer_arr_1.push({
                                key:i,
                                value:f
                            })
                        }else{
                            my_answer_arr_1.push({
                                key:i,
                                value:item.init_char_mat.join('')
                            })
                        }
                    }
                    my_answer_arr_1.sort(compare('key'))  //按从小到大排列，不然诊断会有问题，我的答案顺序会乱掉
                    my_answer_arr_1.forEach(i => {
                        my_answer_arr_2.push(i.value)
                    })
                    let answer_content_arr_1 = []  //用来找错误位置
                    let answer_content_arr_2 = []  //用来直接对比正确答案
                    answer_content.forEach((i,x)=>{
                        let arr = []
                        i.forEach((ii,xx)=>{
                            if(!Array.isArray(ii)){
                                ii.split(',').forEach((iii,xxx)=>{
                                    iii && arr.push(iii)
                                })
                            }else{
                                arr.push(ii)
                            }
                        })
                        answer_content_arr_1.push(arr)
                        answer_content_arr_2.push(JSON.stringify(arr))
                    })
                    // console.log('__________________',answer_content_arr_2,my_answer_arr_2)
                    if(answer_content_arr_2.indexOf(JSON.stringify(my_answer_arr_2)) > -1){
                        return {
                            result:true
                        }
                    }
                    let wrong_map = {}
                    answer_content_arr_1.forEach((i,x)=>{
                        let arr = []
                        i.forEach((ii,xx)=>{
                            if(JSON.stringify(ii)!== JSON.stringify(my_answer_arr_1[xx].value)){
                                arr.push(my_answer_arr_1[xx].key)
                            }
                        })
                        wrong_map[x] = arr
                    })  
                    let final_wrong_index = findShortArr(wrong_map)
                    final_wrong_arr = wrong_map[final_wrong_index]
                    return {
                        result:false,
                        wrong_arr:final_wrong_arr    //填空题正确错误答案回显
                    }
                }else{
                    let answer_arr = answer_content.split(';')
                    let my_answer_arr = []
                    let my_answer_arr_2 =[]
                    for(let i in data.my_answer_tk_map){
                        let item = data.my_answer_tk_map[i]
                        my_answer_arr_2.push({
                            key:i,
                            value:item.init_char_mat.join('')
                        })
                    }
                    my_answer_arr_2.sort(compare('key'))  //按从小到大排列，不然诊断会有问题，我的答案顺序会乱掉
                    my_answer_arr_2.forEach(i => {
                        my_answer_arr.push(i.value)
                    })
                    if(answer_arr.indexOf(my_answer_arr.join(',')) > -1){
                        return {
                            result:true
                        }
                    }
                    let wrong_map = {}
                    answer_arr.forEach((i,x)=>{
                        wrong_map[x] = []
                        i.split(',').forEach((ii,xx)=>{
                            if(ii !== my_answer_arr_2[xx].value){
                                wrong_map[x].push(my_answer_arr_2[xx].key)
                            }
                        })
                    })
                    let final_wrong_index = findShortArr(wrong_map)
                    final_wrong_arr = wrong_map[final_wrong_index]
                    return {
                        result:false,
                        wrong_arr:final_wrong_arr    //填空题正确错误答案回显
                    }
                }
            }
        case topaicTypes.Text_Much_Fraction_Split:
            // 分数的拆分
            for(let i in data.my_answer_tk_map){
                let value = []
                if(data.my_answer_tk_map[i].isFraction){
                    for(let j in data.my_answer_tk_map[i]){
                        if(data.my_answer_tk_map[i][j].init_char_mat){
                            value.push(data.my_answer_tk_map[i][j].init_char_mat.join(''))
                        }
                    }
                }else{
                    // 分数的拆分填入数据只能是分数，这里表示填了非分数，直接赋值false
                    value = 'false'
                }
                key_arr.push({
                    key:i.substring(1),
                    value
                })
                final_wrong_arr.push(i)  //答案不唯一的题目只要错，所有空都算错
            }
            let equation_arr = JSON.parse(JSON.stringify(data.stem_tk[1])) 
            key_arr.forEach((i,x)=>{
                equation_arr[i.key] = i.value
            })
            let final_equation_arr = equation_arr.splice(2)
            topic_answer = JSON.stringify(data.answer_content[0][0])
            try {
                my_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(final_equation_arr)) 
            } catch(err) {
                console.log("算式错误");
                my_answer = 0
            }
            // console.log('*****分数的拆分',key_arr,equation_arr,final_equation_arr)
            // console.log('___________',my_answer,topic_answer)
            return {
                result:my_answer === topic_answer,
                wrong_arr:final_wrong_arr    //填空题正确错误答案回显
            }
        case topaicTypes.Clever_Calculation_24:
            // 巧算24点
            const sortArrNumber = (arr)=>{
                if(arr.length === 0) return []
                return arr.sort((a,b)=>{
                    return a-b;
                })
            }
            key = data.my_answer_tk_map?Object.keys(data.my_answer_tk_map):''
            let my_equation_nums = []
            let my_equation = []
            for(let i in data.my_answer_tk_map){
                my_equation = data.my_answer_tk_map[i].init_char_mat.join('')
                my_equation_nums = my_equation.match(/\d+(\.\d+)?/g)?my_equation.match(/\d+(\.\d+)?/g):[]
            }
            let answer_content_arr = data.answer_content.split(',')
            let answer_content_arr_sort = sortArrNumber(answer_content_arr)
            let my_equation_nums_sort = sortArrNumber(my_equation_nums)
            try {
                my_answer = eval(my_equation.replaceAll('÷','/').replaceAll('×','*'))
            } catch(err) {
                console.log("算式错误");
                my_answer = 0
            }
            // console.log('***********巧算24点',my_equation,my_answer,answer_content_arr_sort,my_equation_nums_sort)
            // console.log('2222',my_answer === 24 && JSON.stringify(answer_content_arr_sort) === JSON.stringify(my_equation_nums_sort))
            return {
                result:my_answer === 24 && JSON.stringify(answer_content_arr_sort) === JSON.stringify(my_equation_nums_sort), //列式答案要等于24并且式子里的数字要是题目提供的数字
                wrong_arr:key?[key[0]]:'',
            }
        case topaicTypes.Text_Much_Operation_Symbol:
            // 巧填运算符号
            for(let i in data.my_answer_tk_map){
                key_arr.push({
                    key:i.substring(1),
                    value:data.my_answer_tk_map[i].init_char_mat.join('')
                })
                final_wrong_arr.push(i)  //答案不唯一的题目只要错，所有空都算错
            }
            if(data.exercise_data_type === 'FS'){
                let my_equation_arr = JSON.parse(JSON.stringify(data._exercise_stem[0]))
                if(my_equation_arr[0].split('：')[1]){
                    // 成立：8( )2( )题干是这种情况的要转化一下
                    my_equation_arr[0] = my_equation_arr[0].split('：')[1]
                }
                let is_wrong = false
                key_arr.forEach((i,x)=>{
                    my_equation_arr[i.key] = i.value
                    if(!i.value){
                        is_wrong = true
                    }
                })
                if(is_wrong){
                    // 有空格没有录入值,直接返回错误
                    my_answer = '1',
                    topic_answer = '0'
                    return {
                        result:my_answer == topic_answer,
                        wrong_arr:final_wrong_arr
                    }
                }else{
                    let my_equation_arr_filter = my_equation_arr.filter((i,x)=>{
                        return i.indexOf('成立：')  === -1
                    })
                    let d_index = my_equation_arr_filter.indexOf('=')
                    let my_equation_left = my_equation_arr_filter.slice(0,d_index)
                    let len = my_equation_left.length
                    if(my_equation_left[len - 1].indexOf('=') > -1){
                        my_equation_left[len - 1] = my_equation_left[len - 1].split('=')[0]
                    }
                    if(d_index === -1){
                        // 数组最后一个是分数或者字符串  
                        let len = my_equation_arr_filter.length
                        if( my_equation_arr_filter[len - 2].indexOf('=') !== -1){
                            // 1÷（2×3+4）+5=5｜1｜10
                            let v = my_equation_arr_filter[len - 1].map(Number)
                            if(v.length === 2){
                                topic_answer = v[0]/v[1]
                            }
                            if(v.length === 3){
                                topic_answer = (v[2] * v[0] + v[1] ) / v[2]
                            }
                        }else{
                            topic_answer = my_equation_arr_filter[len - 1].split('=')[1]
                        }
                    }else{
                        //数组最后一个是分数
                        let v = my_equation_arr_filter.slice(d_index+1)[0].map(Number)
                        if(v.length === 2){
                            topic_answer = v[0]/v[1]
                        }
                        if(v.length === 3){
                            topic_answer = (v[2] * v[0] + v[1] ) / v[2]
                        }
                    }
                    let arr = equationChange(my_equation_left)
                    let arr_1 = ''
                    let arr_2 = ''
                    try {
                        arr_1 = mathdiagnosis.StandardCalculateAnswer(arr)[0]
                        arr_2 = mathdiagnosis.StandardCalculateAnswer(arr)[1]
                        my_answer = arr_1/arr_2
                    } catch(err) {
                        console.log("算式错误",arr_1,arr_2);
                        my_answer = false
                    }
                    // console.log('22222',mathdiagnosis.StandardCalculateAnswer(arr),arr,my_answer,topic_answer)
                    // console.log('*****巧填运算符号',my_equation_arr,my_equation_left)
                    return {
                        result:my_answer == topic_answer,
                        wrong_arr:final_wrong_arr
                    }
                }
            }else{
                let my_equation_arr = data.answer_content.split('#')
                key_arr.forEach((i,x)=>{
                    my_equation_arr[i.key] = i.value
                })
                let my_equation_str = my_equation_arr.join('')
                let equation_left = my_equation_str.split('=')[0]
                let equation_right = my_equation_str.split('=')[1]
                // console.log('iii',equation_right)
                try {
                    my_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(equation_left)) 
                } catch(err) {
                    console.log("算式错误");
                    my_answer = 'my_answer_error'
                }
                try {
                    topic_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(equation_right)) 
                } catch(err) {
                    console.log("算式错误");
                    topic_answer = 'topic_answer_error'
                }
                console.log('*****巧填运算符号',my_answer,topic_answer)
                return {
                    result:my_answer == topic_answer,
                    wrong_arr:final_wrong_arr
                }
            }
        case topaicTypes.Text_Much_Fill_In_Numbers:
            // 文字填空题-填数字
            for(let i in data.my_answer_tk_map){
                let value = []
                if(data.my_answer_tk_map[i].isFraction){
                    for(let j in data.my_answer_tk_map[i]){
                        if(data.my_answer_tk_map[i][j].init_char_mat){
                            value.push(data.my_answer_tk_map[i][j].init_char_mat.join(''))
                        }
                    }
                }else{
                    value = data.my_answer_tk_map[i].init_char_mat.join('')
                }
                key_arr.push({
                    key:i.substring(1),
                    value
                })
                final_wrong_arr.push(i)  //答案不唯一的题目只要错，所有空都算错
            }
            if(data.exercise_data_type === 'FS'){
                // 目前没有等号左右两边是非分数的题目，这类题暂时没有诊断
                let equation = JSON.parse(JSON.stringify(data.stem_tk[1])) 
                key_arr.forEach((i,x)=>{
                    equation[i.key] = i.value
                })
                let d_index = equation.indexOf('=')
                let equation_left = equation.slice(0,d_index)
                let arr_left = equationChange(equation_left)
                let equation_right = equation.slice(d_index + 1)
                let arr_right = equationChange(equation_right)
                try {
                    my_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(arr_left)) 
                } catch(err) {
                    console.log("算式错误");
                    my_answer = 0
                }
                try {
                    topic_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(arr_right)) 
                } catch(err) {
                    console.log("算式错误");
                    topic_answer = 1
                }
                my_answer === 'false'?my_answer = '1':null
                topic_answer === 'false'?topic_answer = '2':null
                // console.log('*******算式填数',my_answer,topic_answer)
                return {
                    result:my_answer === topic_answer,
                    wrong_arr:final_wrong_arr
                }
            }else{
                let equation = JSON.parse(JSON.stringify(data.stem_tk[1])) 
                key_arr.forEach((i,x)=>{
                    equation[i.key] = i.value
                })
                let equation_str_left = equation.join('').split('=')[0].replaceAll('÷','/').replaceAll('×','*')
                let equation_str_right = equation.join('').split('=')[1].replaceAll('÷','/').replaceAll('×','*')
                try {
                    my_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(equation_str_left)) 
                } catch(err) {
                    console.log("算式错误");
                    my_answer = 0
                }
                try {
                    topic_answer = JSON.stringify(mathdiagnosis.StandardCalculateAnswer(equation_str_right)) 
                } catch(err) {
                    console.log("算式错误");
                    topic_answer = 1
                }
                my_answer === 'false'?my_answer = '1':null
                topic_answer === 'false'?topic_answer = '2':null
                console.log('*******算式填数',my_answer,topic_answer)
                return {
                    result:my_answer === topic_answer,
                    wrong_arr:final_wrong_arr
                }
            }
        default:
            return {
                result:true
            }
   }
}

export function findShortArr(obj){
    let len_arr =[]
    for(let i in obj){
        len_arr.push(obj[i].length)
    }
    let min = Math.min.apply(null,len_arr)
    return len_arr.indexOf(min)
}

export function compare(property){
    return function(a,b){
        let value1 = a[property]
        let value2 = b[property]
        return value1 - value2
    }
}

export function equationChange(equation){
    let arr = []
    let str_arr = []  //装字符
    equation.forEach((i,x)=>{
        if(Array.isArray(i)){
            if(str_arr.length>0){
                arr.push(str_arr.join(''))
                str_arr = []
            }
            arr.push(i)
        }else{
            str_arr.push(i)
        }
        if(x === equation.length - 1 && str_arr.length > 0){
            arr.push(str_arr.join(''))
                str_arr = []
        }
    })
    return arr
}