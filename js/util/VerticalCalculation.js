export class VerticalCalculationFunc{
    // 竖式计算类，返回数据
    IntAddVerticalCalculator = (num1, num2)=>{
        // 整数竖式加法
        console.log('整数加法')
        // 加法竖式计算：加数1数组、加数2数组、进位数组、和数组
        let add_1 = num1
        let add_2 = num2
        let max_length = Math.max(add_1.length, add_2.length)+2
        // 建立空数组
        let array_add_1 = new Array(max_length)
        let array_add_2 = new Array(max_length)
        let array_sum = new Array(max_length)
        let array_carry = new Array(max_length)
        for(let idx=0;idx<max_length;idx++){
            if((idx+add_1.length)>=max_length){
                array_add_1[idx] = parseInt(add_1[add_1.length+idx-max_length])
            }
            else{
                array_add_1[idx] = null
            }
            if((idx+add_2.length)>=max_length){
                array_add_2[idx] = parseInt(add_2[add_2.length+idx-max_length])
            }
            else{
                array_add_2[idx] = null
            }
            array_sum[idx] = null
            array_carry[idx] = 0
        }
        array_add_2[0] = '+'
        for(let idx=max_length-1;idx>0;idx--){
            // console.log('idx',idx)
            array_sum[idx] = (array_add_1[idx] + array_add_2[idx]+array_carry[idx])%10
            array_carry[idx-1] = parseInt((array_add_1[idx] + array_add_2[idx]+array_carry[idx])/10)
        }
        for(let idx=0;idx<max_length-1;idx++){
            // 修正和
            if(array_sum[idx]==null && array_sum[idx+1]==0){
                array_sum[idx+1] = null
            }
        }
        for(let idx=0;idx<max_length;idx++){
            // 修正进位
            if(array_carry[idx]==0){
                array_carry[idx] = null
            }
        }
        // console.log('修正=======', [array_add_1, array_add_2, array_carry, array_sum])
        // 二次修正
        let amend_idx = 0
        while(amend_idx<array_add_1.length){
            for(let idx=0;idx<array_add_1.length;idx++){
                if(array_add_1[idx]==null && array_add_2[idx]==null && 
                    array_carry[idx]==null && array_sum[idx]==null){
                    // 全为空
                    // console.log('二次修正')
                    array_add_1.splice(idx, 1)
                    array_add_2.splice(idx, 1)
                    array_carry.splice(idx, 1)
                    array_sum.splice(idx, 1)
                    break
                }
            }
            amend_idx += 1
        }
        console.log('二次修正', [array_add_1, array_add_2, array_carry, array_sum])
        return [array_add_1, array_add_2, array_carry, array_sum]
    }
    
    IntSubVerticalCalculator = (num1, num2)=>{
        // 整数竖式减法
        console.log('整数减法')
        // 减法竖式计算：被减数数组、减数数组、借位数组、差数组
        let sub_1 = num1
        let sub_2 = num2
        let max_length = Math.max(sub_1.length, sub_2.length)+1
        // 建立空数组
        let array_sub_1 = new Array(max_length)
        let array_sub_2 = new Array(max_length)
        let array_diff = new Array(max_length)
        let array_borrow = new Array(max_length)
        for(let idx=0;idx<max_length;idx++){
            if((idx+sub_1.length)>=max_length){
                array_sub_1[idx] = parseInt(sub_1[sub_1.length+idx-max_length])
            }
            else{
                array_sub_1[idx] = null
            }
            if((idx+sub_2.length)>=max_length){
                array_sub_2[idx] = parseInt(sub_2[sub_2.length+idx-max_length])
            }
            else{
                array_sub_2[idx] = null
            }
            array_diff[idx] = null
            array_borrow[idx] = 0
        }
        array_sub_2[0] = '-'
        for(let idx=max_length-1;idx>0;idx--){
            // 计算
            if((array_sub_1[idx] - array_sub_2[idx]-array_borrow[idx])>=0){
                array_diff[idx] = array_sub_1[idx] - array_sub_2[idx]-array_borrow[idx]
                array_borrow[idx-1] = 0
            }
            else{
                array_diff[idx] = 10 + array_sub_1[idx] - array_sub_2[idx]-array_borrow[idx]
                array_borrow[idx-1] = 1
            }    
        }
        console.log('求差==========')
        for(let idx=0;idx<max_length-1;idx++){
            // 修正差
            if(array_diff[idx]==null && array_diff[idx+1]==0){
                array_diff[idx+1] = null
            }
        }
        for(let idx=0;idx<max_length;idx++){
            // 修正借位
            if(array_borrow[idx]==0){
                array_borrow[idx] = null
            }
        }
        console.log('修正=======', [array_sub_1, array_sub_2, array_borrow, array_diff])
        return [array_sub_1, array_sub_2, array_borrow, array_diff]
    }

    IntMulVerticalCalculator = (num1, num2)=>{
        // 整数竖式乘法
        console.log('整数乘法')
        // 乘法竖式计算：乘数1数组、乘数2数组、进位数组、单积数组、总积数组
        let mul_1 = num1
        let mul_2 = num2
        let max_length = (parseInt(mul_1)*parseInt(mul_2)).toString().length+1
        let max_mul_length = Math.max(mul_1.length, mul_2.length)
        // console.log('数组最大长度', max_length, max_mul_length)
        // 建立空数组
        let array_mul_1 = new Array(max_length)
        let array_mul_2 = new Array(max_length)
        // let array_diff = new Array(max_length)
        // let array_process = new Array(max_length)
        for(let idx=0;idx<max_length;idx++){
            if((idx+mul_1.length)>=max_length){
                array_mul_1[idx] = parseInt(mul_1[mul_1.length+idx-max_length])
            }
            else{
                array_mul_1[idx] = null
            }
            if((idx+mul_2.length)>=max_length){
                array_mul_2[idx] = parseInt(mul_2[mul_2.length+idx-max_length])
            }
            else{
                array_mul_2[idx] = null
            }
        }
        // array_mul_2[max_length-max_mul_length-1] = '×'
        array_mul_2[0] = '×'
        // console.log('乘数=====')
        // console.log('array_mul_1', array_mul_1)
        // console.log('array_mul_2', array_mul_2)
        let all_mul_process=new Array(mul_2.length) // 中间过程
        let all_mul_carry=new Array(mul_2.length)   // 过程进位
        for(let idx=0;idx<mul_2.length;idx++){
            // 单积过程数组、单积进位数组
            let part_mul_process = new Array(max_length)
            let part_mul_carry = new Array(max_length)
            for(let jj=0;jj<max_length;jj++){
                part_mul_process[jj] = null
                part_mul_carry[jj] = 0
            }
            all_mul_process[idx] = part_mul_process
            all_mul_carry[idx] = part_mul_carry
        }
        // console.log('all_mul_process', all_mul_process)
        // console.log('all_mul_carry', all_mul_carry)
        // 求解计算过程
        let mul_row_idx = 0 // 统计行数
        for(let idx=max_length-1;idx>max_length-mul_2.length-1;idx--){
            let single_mul_num = array_mul_2[idx]
            // console.log('idx', idx, single_mul_num)
            let jj = -1
            for (jj=max_length-1;jj>max_length-mul_1.length-1;jj--){
                let single_mul = array_mul_1[jj]*single_mul_num+all_mul_carry[mul_row_idx][jj-mul_row_idx]
                // console.log('过程计算=====', array_mul_1[jj], '*',single_mul_num, '+', all_mul_carry[mul_row_idx][jj-mul_row_idx], '=',single_mul)
                all_mul_process[mul_row_idx][jj-mul_row_idx] = (single_mul)%10
                all_mul_carry[mul_row_idx][jj-1-mul_row_idx] = parseInt((single_mul)/10)
            }
            // console.log('all_mul_process', all_mul_process)
            // console.log('all_mul_carry', all_mul_carry)
            if(all_mul_carry[mul_row_idx][jj-mul_row_idx]>0){
                all_mul_process[mul_row_idx][jj-mul_row_idx] = all_mul_carry[mul_row_idx][jj-mul_row_idx]
            }
            mul_row_idx += 1
        }
        // 过程结果
        console.log('过程======')
        console.log('all_mul_process', all_mul_process)
        // console.log('all_mul_carry', all_mul_carry)
        // 修正过程中为0的数据
        let amend_flag = 0
        while (amend_flag<mul_2.length){
            for(let idx=0; idx<all_mul_process.length; idx++){
                // 过程求和
                // console.log('amend_flag', amend_flag, this.ArraySum(all_mul_process[idx]))
                if (this.ArraySum(all_mul_process[idx])==0){
                    // console.log('删除=====')
                    all_mul_process.splice(idx, 1)
                }
            }
            amend_flag++
        }
        console.log('删除全0数', all_mul_process)   // 上面乘的过程中直接可以
        let all_process_add = new Array(max_length)
        let all_process_carry = new Array(max_length)
        for(let idx=0;idx<max_length;idx++){
            // 初始化
            all_process_add[idx] = null
            all_process_carry[idx] = 0
        }
        // 修正：看乘数2、末尾为0的情况
        let back_zeros = 0
        for (let idx=0;idx<mul_2.length-1;idx++){
            let back_sum = 0
            for(let jj=idx+1;jj<mul_2.length;jj++){
                back_sum += parseInt(mul_2[jj])
            }
            // console.log('后几位求和', back_sum)
            if(back_sum == 0){
                console.log(mul_2.length - (idx+1))
                back_zeros = mul_2.length - (idx+1)
                break
            }
        }
        // 可以在上述过程中修改
        let amend_array_mul_1 = this.ArrayNull(array_mul_1.length)
        // console.log('amend_array_mul_1', amend_array_mul_1)
        if(back_zeros>0){
            for(let idx=0;idx<array_mul_1.length;idx++){
                if(array_mul_1[idx]>=0 && (idx-back_zeros>=0)){
                    amend_array_mul_1[idx-back_zeros] = array_mul_1[idx]
                    // console.log('amend_array_mul_1', idx-back_zeros, array_mul_1, amend_array_mul_1)
                }
            }
        }
        else{
            for(let idx=0;idx<array_mul_1.length;idx++){
                amend_array_mul_1[idx] = array_mul_1[idx]
            }
        }
        // console.log('amend_array_mul_1', array_mul_1, amend_array_mul_1)
        if(all_mul_process.length == 1){
            // 修改过程数据添加0
            for(let idx=0;idx<all_mul_process.length;idx++){
                //
                let part_flag = 0
                for(let jj=0;jj<all_mul_process[idx].length;jj++){
                    // console.log('part_flag', part_flag, all_mul_process[idx][jj], all_mul_process[idx][jj]==null)
                    if((part_flag == 0) && all_mul_process[idx][jj]>=0){
                        part_flag = 1
                    }
                    else if((part_flag ==1) && (all_mul_process[idx][jj]==null)){
                        // console.log('修改')
                        all_mul_process[idx][jj] = 0
                    }
                }
            }
            all_process_add = all_mul_process[0]
            console.log('===单组数据===', [[amend_array_mul_1, array_mul_2], all_process_add])
            // console.log('all_process_add', all_process_add)
            // console.log('all_process_carry', all_process_carry)
            // console.log('直接计算结果', parseInt(mul_1)*parseInt(mul_2))
            return [[amend_array_mul_1, array_mul_2], all_process_add]
        }
        else{
            // 单步求和依次计算
            for(let idx=max_length-1;idx>0;idx--){
                // console.log('idx',idx)
                let part_sum = all_process_carry[idx]
                for(let jj=0;jj<all_mul_process.length;jj++){
                    part_sum += all_mul_process[jj][idx]
                }
                all_process_add[idx] = (part_sum)%10
                all_process_carry[idx-1] = parseInt((part_sum)/10)
            }
            // 修正前0
            for(let idx=0;idx<all_mul_process.length;idx++){
                for(let jj=0;jj<all_mul_process[idx].length;jj++){
                    if(all_mul_process[idx][jj]==0 || all_mul_process[idx][jj]==null){
                        all_mul_process[idx][jj] = null
                    }
                    else{
                        break
                    }
                }
            }
            // console.log('===最后求和====',JSON.stringify([[amend_array_mul_1, array_mul_2], all_mul_process, all_process_add]))
            console.log('===最后求和====',[[amend_array_mul_1, array_mul_2], all_mul_process, all_process_add])
            // console.log('all_process_add', all_process_add)
            // console.log('all_process_carry', all_process_carry)
            // console.log('直接计算结果', parseInt(mul_1)*parseInt(mul_2))
            
            return [[amend_array_mul_1, array_mul_2], all_mul_process, all_process_add]
        }

    }

    IntDivVerticalCalculator = (num1, num2)=>{
        // 整数竖式除法---包含余数
        let quotients = parseInt(parseInt(num1)/parseInt(num2))
        let remainders = parseInt(num1)%parseInt(num2)
        console.log('整数除法商余', num1,'÷', num2,'=',quotients,'...',remainders)
        let max_length = num1.length    // 整数除法，最大长度以被除数设定
        let standard_dividend = this.ArrayNull(max_length)  // 标准商
        let standard_quotients = this.ArrayNull(max_length)  // 标准商
        let standard_remainders = this.ArrayNull(max_length)  // 标准余数
        // console.log('标准商====', standard_quotients)
        for(let idx=0;idx<max_length;idx++){
            // 标准余数赋值
            if(idx+quotients.toString().length>=max_length){
                standard_quotients[idx] = quotients.toString()[idx-(max_length - quotients.toString().length)]
            }
            if(idx+remainders.toString().length>=max_length){
                standard_remainders[idx] = remainders.toString()[idx-(max_length - remainders.toString().length)]
            }
            standard_dividend[idx] = num1[idx]
        }
        console.log('标准被除数', standard_dividend)
        console.log('标准商', standard_quotients)
        console.log('标准余', standard_remainders)
        // 计算每步商和除数的结果并标准化
        let divisor_quotients = new Array(quotients.toString().length)
        let array_idx = -1
        for(let idx=0;idx<standard_quotients.length;idx++){
            if(standard_quotients[idx]!=null){
                array_idx += 1
                // 存在商分步计算
                let part_product = (parseInt(num2)*parseInt(standard_quotients[idx])).toString()
                // console.log('单步乘积', num2, standard_quotients[idx], part_product)
                // 单步标准格式
                let part_product_standard = this.ArrayNull(max_length)
                for(let jj=idx;jj>idx-part_product.length;jj--){
                    // console.log('jj', jj, idx, part_product.length, jj-(idx-part_product.length))
                    part_product_standard[jj] = part_product[jj-(idx-part_product.length)-1]
                }
                // console.log('单步标准', part_product_standard)
                divisor_quotients[array_idx]= part_product_standard
            }
        }
        // console.log('标准步骤', divisor_quotients)
        // 逆向求差，减数与差求和
        let reverse_sum = new Array(quotients.toString().length)
        reverse_sum[quotients.toString().length-1] = standard_remainders
        for(let idx=quotients.toString().length-1;idx>=1;idx--){
            let part_reverse_array = this.ArrayNull(max_length)
            let part_carry_array = this.ArrayInitValue(max_length,0)
            // console.log('divisor_quotients[idx]', idx, divisor_quotients[idx])
            // console.log('reverse_sum[idx]', idx, reverse_sum[idx])
            for(let jj=max_length-1;jj>=0;jj--){
                let single_value = eval(divisor_quotients[idx][jj]+'+'+reverse_sum[idx][jj])+part_carry_array[jj]
                // console.log('divisor_quotients[idx][jj]', divisor_quotients[idx][jj])
                // console.log('reverse_sum[idx][jj]', reverse_sum[idx][jj])
                // console.log('single_value', single_value)
                if (jj==0){
                    // 最高位不做进位处理
                    // console.log('====')
                    part_reverse_array[jj] = single_value.toString()
                }
                else{
                    // let single_value = (parseInt(divisor_quotients[idx][jj])+parseInt(reverse_sum[idx][jj])+part_carry_array[jj])
                    part_carry_array[jj-1] = parseInt(single_value/10)
                    part_reverse_array[jj] = (single_value%10).toString()
                    // console.log('-----', part_carry_array)
                }
            }
            // console.log('part_reverse_array', part_reverse_array)
            // 修正 开头为0，结尾值删除
            for (let ii=0;ii<part_reverse_array.length;ii++){
                if (part_reverse_array[ii]==0){
                    part_reverse_array[ii]=null
                }
                else{
                    break
                }
            }
            // console.log('part_reverse_array修正开头0', part_reverse_array)
            // console.log('idx', idx)
            for(let ii=(max_length-(quotients.toString().length-idx)+1);ii<max_length;ii++){
                part_reverse_array[ii]=null
            }
            // console.log('part_reverse_array修正结尾', part_reverse_array)
            reverse_sum[idx-1] = part_reverse_array
        }
        // console.log('reverse_sum', reverse_sum)
        // 全局组合：被除数+单积数组+单和/单差数组
        let combine_array = []
        combine_array.push(standard_dividend)
        for(let idx=0;idx<reverse_sum.length;idx++){
            combine_array.push(divisor_quotients[idx])
            combine_array.push(reverse_sum[idx])
        }
        console.log('过程组合', combine_array)
        // 删除中间0过程
        let filter_array_0 = this.DeleteProcessZeros(combine_array)
        console.log('删除过程0', filter_array_0)
        return [filter_array_0, standard_quotients]
    }

    DeleteProcessZeros = (combine_array)=>{
        // 删除中间0过程
        let filter_array = []
        for(let idx=1;idx<combine_array.length;idx = idx+2){
            // console.log(this.ArraySum(combine_array[idx]))
            if(this.ArraySum(combine_array[idx])>0){
                filter_array.push(combine_array[idx-1])
                filter_array.push(combine_array[idx])
            }
        }
        filter_array.push(combine_array[combine_array.length-1])
        return filter_array
    }

    ArrayNull = (array_length)=>{
        let array_null = []
        for(let idx=0;idx<array_length;idx++){
            array_null.push(null)
        }
        return array_null
    }

    ArraySum = (arr)=>{
        // 求和
        let sum = 0;
        arr.forEach(function(val, idx, arr) {
            sum += eval(val);
        }, 0);
        return sum;
    };

    ArrayInitValue = (init_length,inti_value)=>{
        // 初始矩阵化
        let null_array = []
        for (let idx=0;idx<init_length;idx++){
            null_array.push(inti_value)
        }
        return null_array
    }
}

export class SpecialExplainFunc{
    // 竖式计算特殊讲解
    EquationClassify = (equation_mat)=>{
        // 算式分类：乘除法
        // console.log('算式分类：字符串或者数组', equation_mat)
        if (['x','X','*','×'].indexOf(equation_mat[1])>=0){
            // console.log('特殊乘法处理')
            return this.MultiClassify(equation_mat)
        }
        else if (['÷','/'].indexOf(equation_mat[1])>=0){
            // console.log('特殊除法处理')
            return this.DivClassify(equation_mat)
        }
        else{
            return false
        }
    }

    MultiClassify = (equation_mat)=>{
        // 特殊乘法处理
        if (equation_mat[0].length == 2 && equation_mat[2].length == 1){
            // 两位数乘一位数
            if (parseInt(equation_mat[0])%10==0){
                // 整十数乘以一位数
                let head_str = equation_mat[0][0]
                let init_str = this.ExplainStrMat(0)
                // console.log('init_str', init_str)
                let end_str = (parseInt(head_str)*parseInt(equation_mat[2])).toString()
                let equation_str1 = head_str + equation_mat[1] + equation_mat[2] + '=' + end_str
                let equation_str2 = equation_mat[0] + equation_mat[1] + equation_mat[2] + '=' + 
                                    (parseInt(equation_mat[0])*parseInt(equation_mat[2])).toString()
                
                // console.log('equation_str', end_str, equation_str1, equation_str2)
                init_str = init_str.replace('end_str', end_str)
                init_str = init_str.replace('equation_str1', equation_str1)
                init_str = init_str.replace('equation_str2', equation_str2)
                console.log('======整十数乘一位数的口算解析======\n', init_str)
                return init_str
            }
            else{
                // 非整十数两位数乘以一位数
                let head_str = (parseInt(equation_mat[0][0])*10).toString()
                let end_str = equation_mat[0][1]
                let init_str = this.ExplainStrMat(2)
                // console.log('init_str', init_str)
                let equation_str1 = head_str + 'x' + equation_mat[2] + '=' + (parseInt(head_str)*parseInt(equation_mat[2])).toString()
                let equation_str2 = end_str + 'x' + equation_mat[2] + '=' + (parseInt(end_str)*parseInt(equation_mat[2])).toString()
                let equation_str3 = (parseInt(head_str)*parseInt(equation_mat[2])).toString() + '+' + 
                                    (parseInt(end_str)*parseInt(equation_mat[2])).toString() + '=' + 
                                    (parseInt(equation_mat[0])*parseInt(equation_mat[2])).toString()
                let equation_str4 = equation_mat[0] + 'x' + equation_mat[2] + '=' + (parseInt(equation_mat[0])*parseInt(equation_mat[2])).toString()
                init_str = init_str.replace('num_str0', equation_mat[0])
                init_str = init_str.replace('num_str1', head_str)
                init_str = init_str.replace('num_str2', end_str)
                init_str = init_str.replace('equation_str1', equation_str1)
                init_str = init_str.replace('equation_str2', equation_str2)
                init_str = init_str.replace('equation_str3', equation_str3)
                init_str = init_str.replace('equation_str4', equation_str4)
                console.log('======两位数乘一位数的口算======\n', init_str)
                return init_str
            }
        }
        else if(equation_mat[0].length == 3 && equation_mat[2].length == 1){
            // 三位数乘一位数
            if (parseInt(equation_mat[0])%100==0){
                // 整百数乘以一位数
                let head_str = equation_mat[0][0]
                // 讲解字符串
                let init_str = this.ExplainStrMat(1)
                // console.log('init_str', init_str)
                let end_str = (parseInt(head_str)*parseInt(equation_mat[2])).toString()
                let equation_str1 = head_str + equation_mat[1] + equation_mat[2] + '=' + end_str
                let equation_str2 = equation_mat[0] + equation_mat[1] + equation_mat[2] + '=' + 
                                    (parseInt(equation_mat[0])*parseInt(equation_mat[2])).toString()

                // console.log('equation_str', end_str, equation_str1, equation_str2)
                init_str = init_str.replace('end_str', end_str)
                init_str = init_str.replace('equation_str1', equation_str1)
                init_str = init_str.replace('equation_str2', equation_str2)
                console.log('======整百数乘一位数的口算解析======\n', init_str)
                return init_str
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }

    DivClassify = (equation_mat)=>{
        // 特殊除法处理
        if (equation_mat[0].length == 2 && equation_mat[2].length == 1){
            // 两位数除以一位数
            let num0 = parseInt(equation_mat[0])
            let num1 = parseInt(equation_mat[0][0])
            let num2 = parseInt(equation_mat[0][1])
            let num3 = parseInt(equation_mat[2])
            if (num1%num3==0 && num2%num3==0){
                let num_str0 = equation_mat[0]
                let num_str1 = (num1*10).toString()
                let num_str2 = (num2).toString()
                let num_str3 = (num3).toString()
                let equation_str1 = num_str1 + '÷' + num_str3 + '=' + (parseInt(num1/num3)*10).toString()
                let equation_str2 = num_str2 + '÷' + num_str3 + '=' + (parseInt(num2/num3)).toString()
                let equation_str3 = (parseInt(num1/num3)*10).toString() + '+' + (parseInt(num2/num3)).toString() + '=' +  (parseInt(num0/num3)).toString()
                let equation_str4 = num_str0 + '÷' + num_str3 + '=' + (parseInt(num0/num3)).toString()
                let init_str = this.ExplainStrMat(3)
                init_str = init_str.replace('num_str0', num_str0)
                init_str = init_str.replace('num_str1', num_str1)
                init_str = init_str.replace('num_str2', num_str2)
                init_str = init_str.replace('equation_str1', equation_str1)
                init_str = init_str.replace('equation_str2', equation_str2)
                init_str = init_str.replace('equation_str3', equation_str3)
                init_str = init_str.replace('equation_str4', equation_str4)
                console.log('======两位数除以一位数的口算======\n', init_str)
                return init_str
            }
            else if (num0%num3==0){
                // 九九除法表
                let end_str = (num0).toString() + '÷' + (num3).toString() + '=' + (parseInt(num0/num3)).toString()
                let init_str = '直接根据乘法表算出:'+end_str
                console.log('======乘法表计算=====\n', init_str)
                return init_str
            }
            else{
                return false
            }
        }
        else if(parseInt(equation_mat[0])%parseInt(equation_mat[2]) == 0){
            // 整除情况，先判定商末尾0数
            let consult_num = parseInt(parseInt(equation_mat[0])/parseInt(equation_mat[2]))
            let consult_str = (consult_num).toString()
            // console.log('consult_num', consult_num, consult_str)
            let zero_digits = consult_str.length
            for (let idx=consult_str.length-1;idx>=0; idx--){
                // console.log('0位', idx, consult_str[idx])
                if (consult_str[idx] != 0){
                    zero_digits = idx +1 
                    break
                }
            }
            if (zero_digits == consult_str.length){
                // 未发现末尾为 0 
                return false
            }
            else{
                let zero_num = consult_str.length - zero_digits
                // console.log('补充0个数', zero_num)
                // console.log('zero_digits', zero_digits)
                let part_str = ''
                for (let idx=0;idx<(equation_mat[0].length - zero_num);idx++){
                    part_str += equation_mat[0][idx]
                }
                // console.log('part_str', part_str)
                let end_str = (parseInt(part_str)/parseInt(equation_mat[2])).toString()
                if (end_str.length == 1){
                    // console.log('满足乘法表除法')
                    let equation_str1 = part_str + '÷' + equation_mat[2] + '=' + end_str
                    let equation_str2 = equation_mat[0] + '÷' + equation_mat[2] + '=' + consult_str
                    let init_str = this.ExplainStrMat(4)
                    init_str = init_str.replace('zero_num', (zero_num).toString())
                    init_str = init_str.replace('end_str', end_str)
                    init_str = init_str.replace('equation_str1', equation_str1)
                    init_str = init_str.replace('equation_str2', equation_str2)
                    console.log('=======几千几百数除以一位数的口算=======\n', init_str)
                    return init_str
                }
                else{
                    // 添加其他除法方式
                    return false
                }
            }
        }
        else{
            console.log('其余判定')
            return false
        }
    }

    ExplainStrMat = (mode_num) =>{
        // 解析数组
        let parse_mat =['先用乘法口诀表算出equation_str1，再在end_str的后面添加1个0，所以equation_str2。', 
                        '先用乘法口诀表算出equation_str1，再在end_str的后面添加2个0，所以equation_str2。',
                        '先把num_str0分成num_str1和num_str2，再算：\n equation_str1\n equation_str2\n equation_str3\n 所以equation_str4。',
                        '先把num_str0分成num_str1和num_str2，再算：\n equation_str1\n equation_str2\n equation_str3\n 所以equation_str4。',
                        '先用乘法口诀表算出equation_str1，再在end_str的后面添加zero_num个0，所以equation_str2。']

        return parse_mat[mode_num]
    }
}

export class MathBaseCaculateFunc{
	isOperator=(value)=>{
		let operatorString = "+-*/()";
		return operatorString.indexOf(value) > -1
	}

	getPrioraty=(value)=>{
		switch(value){
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

	splitstr=(str)=>{
		// 字符串分离
		let strnum=str.match(/\d+(\.\d+)?/g);  //提取数字
		let strsymbol=str.replace(/\d+(\.\d+)?/g,' '); //替换数字 
		let strmat=[];
		let numint=0;
		for(let ii=0;ii<strsymbol.length;ii++){
			//console.log(strsymbol[ii])
			if (strsymbol[ii]==' '){
				strmat[ii]=strnum[numint];
				numint +=1;
			}
			else{
				strmat[ii]=strsymbol[ii];					
			}
		}
		return strmat;
	}

	prioraty=(o1, o2)=>{
		return this.getPrioraty(o1) <= this.getPrioraty(o2);
	}

	instr2suffixmat=(exp0)=>{	
		let inputStack = [];
		let outputStack = [];
		let outputQueue = [];
		let exp=this.standardstr(exp0);
		inputStack=this.splitstr(exp);
		while(inputStack.length > 0){
			let cur = inputStack.shift();
			if(this.isOperator(cur)){
				if(cur == '('){
					outputStack.push(cur);
				}else if(cur == ')'){
					let po = outputStack.pop();
					while(po != '(' && outputStack.length > 0){
						outputQueue.push(po);
						po = outputStack.pop();
					}
					if(po != '('){
						throw "error: unmatched ()";
					}
				}else{
					while(this.prioraty(cur, outputStack[outputStack.length - 1]) && outputStack.length > 0){
						outputQueue.push(outputStack.pop());
					}
					outputStack.push(cur);
				}
			}else{
				outputQueue.push(new Number(cur));
			}
		}
		//console.log('step two');
		if(outputStack.length > 0){
			if(outputStack[outputStack.length - 1] == ')' || outputStack[outputStack.length - 1] == '('){
				throw "error: unmatched ()";
			}
			while(outputStack.length > 0){
				outputQueue.push(outputStack.pop());
			}
		}
		//console.log('step three');
		//console.log(outputQueue)
		return outputQueue;
		//return outputStack;
	}

	caculateSuffixstr= (suffixstr)=>{
		//计算后缀表达式的值
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum;
		let strsize=str.length;
		while(strsize>1){
			for(let ii=0;ii<strsize;ii++){
				matchstr=str[ii];
				//str.indexOf("3") != -1；str.search("3") != -1
				if (symbols.indexOf(matchstr) != -1){
					num1=str[ii-2];
					num2=str[ii-1];
					switch(matchstr){
						case '+':
							sumnum=this.formatNum(num1+num2, 5);
							break;
						case '-':
							sumnum=this.formatNum(num1-num2, 5);
							break;
						case '*':
							sumnum=this.formatNum(num1*num2, 5);
							break;
						case '/':
							sumnum=this.formatNum(num1/num2, 5);
							break;	
					}
					//sumnum=math.eval(sumstr);
					str.splice(ii-2,3,sumnum);
					strsize=str.length;
					//console.log(str);
					break;
				}			
			}
			strsize=str.length;
			//console.log(strsize)
			//console.log(str.indexOf("3") != -1 );
		}//while
		return str;
	}

	standardstr=(str)=>{
		//转换标准可计算字符串
		str=str.replace(/\s*/g,""); //去除空格
		str=str.replace(/\[/g,"(");
		str=str.replace(/\{/g,"(");
		str=str.replace(/\]/g,")");
		str=str.replace(/\}/g,")");   			
		str=str.replace(/x/g,"*");
		str=str.replace(/X/g,"*");
		str=str.replace(/\÷/g,"/");
		//str=str.replace(/\(/g,"[");
		//console.log(str);
		//console.log(math.eval(str));
		return str;    			
	}

	standardsymbol=(strmat0)=>{
		strmat0=strmat0.replace(/\*/g,"x");
		strmat0=strmat0.replace(/\//g,"÷");
		return strmat0;
	}

	caculateSuffixOne=(suffixstr)=>{
		//计算后缀表达式的值
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum;
		let strsize=str.length;
		for(let ii=0;ii<strsize;ii++){
			matchstr=str[ii];
			//str.indexOf("3") != -1；str.search("3") != -1
			if (symbols.indexOf(matchstr) != -1){
				num1=str[ii-2];
				num2=str[ii-1];
				//sumstr=num1+matchstr+num2;
				//console.log(typeof sumstr)
				//console.log(sumstr)
				//sumnum=math.eval(sumstr);
				switch(matchstr){
					case '+':
						sumnum=this.formatNum(num1+num2, 5);
						break;
					case '-':
						sumnum=this.formatNum(num1-num2, 5);
						break;
					case '*':
						sumnum=this.formatNum(num1*num2, 5);
						break;
					case '/':
						sumnum=this.formatNum(num1/num2, 5);
						break;	
				}
				str.splice(ii-2,3,sumnum);
				strsize=str.length;
				//console.log(str);
				break;
			}			
		}
		strsize=str.length;
		//console.log(strsize)
		//console.log(str.indexOf("3") != -1 );
		return str;
	}

	extractSuffixOne=(suffixstr)=>{
		//提取一步后缀表达式矩阵
		let str = this.copyArr(suffixstr); //深度拷贝
		let symbols='+-*/';
		let matchstr=' ';
		let num1,num2,sumstr,sumnum,symbolestr;
		let strsize=str.length;
		for(let ii=0;ii<strsize;ii++){
			matchstr=str[ii];
			//str.indexOf("3") != -1；str.search("3") != -1
			if (symbols.indexOf(matchstr) != -1){
				num1=str[ii-2];
				num2=str[ii-1];
				symbolestr=str[ii-0];
				break;
			}			
		}
		//strsize=str.length;
		let stronestepmat=new Array(3);
		stronestepmat[0]=num1;
		stronestepmat[1]=num2;
		stronestepmat[2]=symbolestr;
		return stronestepmat;
	}

    suffix2infix=(strmat)=>{
		//后缀表达式转中缀表达式，对应中括号等，一般书写格式
		let symbols='+-*/';
		let symbols2='*/';
		let matsize=strmat.length;
		let strmat0=this.copyArr(strmat); //深拷贝
		let objstr=new Array(matsize);
		for(let ii=0;ii<matsize;ii++){
			objstr[ii]=new Array(5);
			objstr[ii]['mathstr0']=strmat0[ii];
			objstr[ii]['combtag']=0;
			objstr[ii]['resymbol']='';
			objstr[ii]['bracket']=0;
			if (symbols2.indexOf(strmat0[ii])!=-1){
				//+-号标记为0，*/号标记为1
				objstr[ii]['symbollevel']=1;
			}
			else{
				objstr[ii]['symbollevel']=0;
			}
		}
		
		while(matsize>1){    				
			for(let ii=0;ii<strmat0.length;ii++){
				let part0=strmat0[ii];
				if (symbols.indexOf(part0) != -1){
					let combstr='';
					if ((objstr[ii-1]['combtag']===0)&&(objstr[ii-2]['combtag']===0)){
						//前面两项都没有操作标记，直接组合字符串
						combstr=strmat0[ii-2]+part0+strmat0[ii-1];
						strmat0.splice(ii-2,3,combstr);
						objstr.splice(ii-1,2)
						objstr[ii-2]['mathstr0']=combstr;
						objstr[ii-2]['combtag']=1;
						objstr[ii-2]['resymbol']=part0;
						objstr[ii-2]['bracket']=0;
						if (symbols2.indexOf(part0)!=-1){
                        // if (symbols2.indexOf(strmat0[ii])!=-1){
                            // 修改 2020-11-04
                                //+-号标记为0，*/号标记为1
							objstr[ii-2]['symbollevel']=1;
						}
						else{
							objstr[ii-2]['symbollevel']=0;
						}
					}
					else{
						// 如果出现组合标记,比较两种符号的优先级是否添加括号，再判断添加括号的情况
						if (symbols2.indexOf(part0)!=-1){
							// 出现乘除号，考虑前后可能添加括号的情况
							//console.log(objstr[1]['bracket']);
							//console.log(objstr[2]['bracket']);
							//console.log(objstr[2]['bracket'])
							if ((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===1)){
								//同时出现组合情况---分别判定各自存在括号的情况
								let str001='',str002='';
								let num001=0,num002=0;
								if (objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04
                                    if (objstr[ii-2]['bracket']===0){
                                        str001='('+objstr[ii-2]['mathstr0']+')';
                                        num001=1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        str001='['+objstr[ii-2]['mathstr0']+']';
                                        num001=2;
                                    }
                                    else{
                                        str001='{'+objstr[ii-2]['mathstr0']+'}';
                                        num001=3;
                                    }
                                }
                                else{
                                    // 新增2020-11-04
                                    str001=objstr[ii-2]['mathstr0']
                                }		
								
											
								if (objstr[ii-1]['bracket']===0){
									str002='('+objstr[ii-1]['mathstr0']+')';
									num002=1;
								}
								else if(objstr[ii-1]['bracket']===1){
									str002='['+objstr[ii-1]['mathstr0']+']';
									num002=2;
								}
								else{
									str002='{'+objstr[ii-1]['mathstr0']+'}';
									num002=3;
								}
								combstr=str001+part0+str002;
								strmat0.splice(ii-2,3,combstr);
								objstr.splice(ii-1,2)
								objstr[ii-2]['mathstr0']=combstr;
								objstr[ii-2]['combtag']=1;
								objstr[ii-2]['resymbol']=part0;
								objstr[ii-2]['symbollevel']=1;    				      
								objstr[ii-2]['bracket']=Math.max(num001,num002); //保留大值				    							     				
							}
							else if((objstr[ii-2]['combtag']===0)&&(objstr[ii-1]['combtag']===1)){
								//第二个字符串是组合情况
								//var objstr0=objstr[ii-1].mathstr0;
								let bracketnum = objstr[ii-1]['bracket'];
								if (objstr[ii-1]['bracket']>=2){
									//出现中括号添加大括号
									combstr=strmat0[ii-2]+part0+'{'+strmat0[ii-1]+'}';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else if(objstr[ii-1]['bracket']===1){
									combstr=strmat0[ii-2]+part0+'['+strmat0[ii-1]+']';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else{
									combstr=strmat0[ii-2]+part0+'('+strmat0[ii-1]+')';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
									}
							}
							else if((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===0)){
								//第一个字符串是组合情况
                                let bracketnum = objstr[ii-1]['bracket'];
                                if(objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    if (objstr[ii-2]['bracket']>=2){
                                        //出现中括号添加大括号
                                        combstr='{'+strmat0[ii-2]+'}'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        combstr='['+strmat0[ii-2]+']'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else{
                                        combstr='('+strmat0[ii-2]+')'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                        //console.log(objstr[2]['bracket'])
                                    }
								}
                                else{
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    combstr=strmat0[ii-2]+part0+strmat0[ii-1];
                                    strmat0.splice(ii-2,3,combstr);
                                    objstr.splice(ii-1,2)
                                    objstr[ii-2]['mathstr0']=combstr;
                                    objstr[ii-2]['combtag']=1;
                                    objstr[ii-2]['resymbol']=part0;
                                    objstr[ii-2]['symbollevel']=1;
                                    objstr[ii-2]['bracket']=bracketnum;
                                }			
							}
                        }
                        else if (symbols.indexOf(part0)!=-1){
							// 出现乘除号，考虑前后可能添加括号的情况
							//console.log(objstr[1]['bracket']);
							//console.log(objstr[2]['bracket']);
							//console.log(objstr[2]['bracket'])
							if ((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===1)){
								//同时出现组合情况---分别判定各自存在括号的情况
								let str001='',str002='';
								let num001=0,num002=0;
								if (objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04
                                    if (objstr[ii-2]['bracket']===0){
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=0;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=1;
                                    }
                                    else{
                                        str001=objstr[ii-2]['mathstr0'];
                                        num001=2;
                                    }
                                }
                                else{
                                    // 新增2020-11-04
                                    str001=objstr[ii-2]['mathstr0']
                                }		
								
								if (objstr[ii-1]['symbollevel']==1){
                                    str002=objstr[ii-1]['mathstr0'];
									num002=objstr[ii-1]['bracket'];
                                }			
								else if (objstr[ii-1]['bracket']===0){
									str002='('+objstr[ii-1]['mathstr0']+')';
									num002=1;
								}
								else if(objstr[ii-1]['bracket']===1){
									str002='['+objstr[ii-1]['mathstr0']+']';
									num002=2;
								}
								else{
									str002='{'+objstr[ii-1]['mathstr0']+'}';
									num002=3;
								}
								combstr=str001+part0+str002;
								strmat0.splice(ii-2,3,combstr);
								objstr.splice(ii-1,2)
								objstr[ii-2]['mathstr0']=combstr;
								objstr[ii-2]['combtag']=1;
								objstr[ii-2]['resymbol']=part0;
								objstr[ii-2]['symbollevel']=1;    				      
								objstr[ii-2]['bracket']=Math.max(num001,num002); //保留大值				    							     				
							}
							else if((objstr[ii-2]['combtag']===0)&&(objstr[ii-1]['combtag']===1)){
								//第二个字符串是组合情况
								//var objstr0=objstr[ii-1].mathstr0;
                                let bracketnum = objstr[ii-1]['bracket'];
                                if (objstr[ii-1]['symbollevel']==1){
									//出现中括号添加大括号 新增计算符号等级更高
									combstr=strmat0[ii-2]+part0+strmat0[ii-1];
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum;
								}
								else if (objstr[ii-1]['bracket']>=2){
									//出现中括号添加大括号
									combstr=strmat0[ii-2]+part0+'{'+strmat0[ii-1]+'}';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else if(objstr[ii-1]['bracket']===1){
									combstr=strmat0[ii-2]+part0+'['+strmat0[ii-1]+']';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
								}
								else{
									combstr=strmat0[ii-2]+part0+'('+strmat0[ii-1]+')';
									strmat0.splice(ii-2,3,combstr);
									objstr.splice(ii-1,2)
									objstr[ii-2]['mathstr0']=combstr;
									objstr[ii-2]['combtag']=1;
									objstr[ii-2]['resymbol']=part0;
									objstr[ii-2]['symbollevel']=1;
									objstr[ii-2]['bracket']=bracketnum+1;
									}
							}
							else if((objstr[ii-2]['combtag']===1)&&(objstr[ii-1]['combtag']===0)){
								//第一个字符串是组合情况
                                let bracketnum = objstr[ii-1]['bracket'];
                                if(objstr[ii-2]['symbollevel']==0){
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    if (objstr[ii-2]['bracket']>=2){
                                        //出现中括号添加大括号
                                        combstr='{'+strmat0[ii-2]+'}'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else if(objstr[ii-2]['bracket']===1){
                                        combstr='['+strmat0[ii-2]+']'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                    }
                                    else{
                                        combstr='('+strmat0[ii-2]+')'+part0+strmat0[ii-1];
                                        strmat0.splice(ii-2,3,combstr);
                                        objstr.splice(ii-1,2)
                                        objstr[ii-2]['mathstr0']=combstr;
                                        objstr[ii-2]['combtag']=1;
                                        objstr[ii-2]['resymbol']=part0;
                                        objstr[ii-2]['symbollevel']=1;
                                        objstr[ii-2]['bracket']=bracketnum+1;
                                        //console.log(objstr[2]['bracket'])
                                    }
								}
                                else{
                                    // 新增2020-11-04：组合时的同级乘除法不添加，其他需要添加
                                    combstr=strmat0[ii-2]+part0+strmat0[ii-1];
                                    strmat0.splice(ii-2,3,combstr);
                                    objstr.splice(ii-1,2)
                                    objstr[ii-2]['mathstr0']=combstr;
                                    objstr[ii-2]['combtag']=1;
                                    objstr[ii-2]['resymbol']=part0;
                                    objstr[ii-2]['symbollevel']=1;
                                    objstr[ii-2]['bracket']=bracketnum;
                                }			
							}
						}
						else{
							// 如果是加减号直接组合字符串，部分其他情况
							let num1=objstr[ii-2]['bracket'];
							let num2=objstr[ii-1]['bracket'];
							combstr=strmat0[ii-2]+part0+strmat0[ii-1];
							strmat0.splice(ii-2,3,combstr);
							objstr.splice(ii-1,2)
							objstr[ii-2]['mathstr0']=combstr;
							objstr[ii-2]['combtag']=1;
							objstr[ii-2]['resymbol']=part0;
							objstr[ii-2]['symbollevel']=0;    				      
							objstr[ii-2]['bracket']=Math.max(num1,num2); //保留大值
						}
					}
					//console.log(strmat0)
					break;
					//console.log('s')
				}    					
			}
			matsize=strmat0.length;
		}
		//console.log(matsize)
		let infixstr=strmat0[0];
		//console.log(infixstr)
		infixstr=infixstr.replace(/\*/g,"x");
		infixstr=infixstr.replace(/\//g,"÷");
		return infixstr;
	}

	copyArr=(father)=>{
		let res = []
		for (let i = 0; i < father.length; i++) {
			res.push(father[i])
		}
		return res
	} 

	formatNum = (f, digit)=>{
		let m = Math.pow(10, digit);
		return parseInt(f * m, 10) / m;
	}

	CaculateStepStr=(str)=>{
		//var str1=copyArr(str);
		let stepstr=[],infixstr=[],ii=0;
		let suffixstr=this.instr2suffixmat(str); // 中缀转后缀
		console.log('suffixstr后缀表达式', suffixstr)
		let stepstr0=this.suffix2infix(suffixstr)
		stepstr[ii]='  '+stepstr0;
		console.log(stepstr[0])
		while(suffixstr.length>2){
			ii +=1;
			suffixstr=this.caculateSuffixOne(suffixstr);
			// console.log(suffixstr)
			if(suffixstr.length>1){
				infixstr=this.suffix2infix(suffixstr);
			}
			else{
				infixstr=suffixstr
			}
			stepstr[ii]='='+infixstr;
			//console.log(stepstr[ii])
			//分步计算
		}
		return stepstr;
    }
    
    integerGCDfunc=(num1,num2)=>{
        //求两个整数的最大公约:扩展到小数
        let max_idx;
        for(let ii=0;ii<100;ii++){
            // console.log('gcd:ii',num1*Math.pow(10,ii), num2*Math.pow(10,ii)%1)
            if((num1*Math.pow(10,ii)%1==0)&&(num2*Math.pow(10,ii)%1==0)){
                // 同时为整，记录扩大次数
                max_idx = ii
                break;
            }
        }
        // console.log('公约数次幂', max_idx)
        let gcdnum1=num1*Math.pow(10,max_idx);
        let gcdnum2=num2*Math.pow(10,max_idx);
        let gcdnum3=0;
        //判断整数
        if((Math.floor(gcdnum1) === gcdnum1)&&(Math.floor(gcdnum2) === gcdnum2)){
            while(1){
                gcdnum3=gcdnum1%gcdnum2;
                gcdnum1=gcdnum2;
                gcdnum2=gcdnum3;
                if(gcdnum3==0){
                    gcdnum3=gcdnum1;
                    break;
                }
            }
        }
        else{
            gcdnum3=1;
        }
        return gcdnum3/Math.pow(10,max_idx);
    }

    integerLCMfunc=(num1,num2)=>{
        //求两个整数的最小公倍数
        let lcmnum1=num1;
        let lcmnum2=num2;
        //先求最大公约数再求最小公倍数
        let lcmnum3=this.integerGCDfunc(lcmnum1,lcmnum2);
        let lcmnum4=parseInt(lcmnum1*lcmnum2/lcmnum3);
        return lcmnum4;
    }

    integerFactorsfunc=(num1)=>{
        //寻找因数
        let factornum1=num1;
        let factormat=new Array(1);
        factormat[0]=1;
        if(Math.floor(factornum1) === factornum1){
            for(let ii=2;ii<=factornum1;ii++){
                if(factornum1%ii==0){
                    factormat.push(ii);
                }
            }
        }
        return factormat;
    }
    
    integerPrimeFactorsfunc=(num1)=>{
        //寻找质因数
        let factornum1=num1;
        let factormat=new Array;
        //factormat[0]=1;
        if(Math.floor(factornum1) === factornum1){
            for(let ii=2;ii<=factornum1;ii++){
                if(factornum1%ii==0){
                    factornum1=factornum1/ii;
                    factormat.push(ii);
                    ii=2;
                }
            }
        }
        return factormat;
    }

    GetPrimeFactors = (num, prime_mat)=>{
        // 嵌套获取质因数分解
        let isZhishu = true
        for(let ii=2;ii<=parseInt(Math.sqrt(num+1)+1);ii++){
            if(num%ii==0 && ii!=num){
                prime_mat.push(ii)
                isZhishu = false
                num=num/ii;
                prime_mat = this.GetPrimeFactors(num, prime_mat)
                break
            }
        }
        if(isZhishu){
            prime_mat.push(num)
        }
        return prime_mat
    }


    findPrimenumfunc=(num1)=>{
        //寻找num1以内的质数
        let maxnum1=num1;
        let primenummat=[];
        if(maxnum1>1){
            for(var jj=2;jj<=maxnum1;jj++){
                var partnummat=this.integerPrimeFactorsfunc(jj);
                //console.log(partnummat)
                //console.log(partnummat.length)
                if(partnummat.length==1){
                    primenummat.push(jj);
                }
            }
        }
        else{
            primenummat=1;
        }
        return primenummat;
    }

    FractionCaculate=(num_mat1,num_mat2,caculate_mode)=>{
        // 根据加减乘除选用不同的计算模块, 根据需求转换结果样式，默认保存为最简分数样式，不用带分数
        // 后续还需考虑分数情况
        // console.log('计算', caculate_mode)
        let answer_mat
        if (caculate_mode == 0||caculate_mode == '+'){
            // console.log('计算2',num_mat1,num_mat2, caculate_mode)
            answer_mat = this.FractionAdd(num_mat1,num_mat2)
        }
        else if (caculate_mode == 1||caculate_mode == '-'){
            answer_mat = this.FractionSubtract(num_mat1,num_mat2)

        }
        else if (caculate_mode == 2||caculate_mode == 'x'||caculate_mode == '*'||caculate_mode == 'X'){
            // console.log('乘法计算',num_mat1,num_mat2)

            answer_mat = this.FractionMultiply(num_mat1,num_mat2)

        }
        else if (caculate_mode == 3||caculate_mode == '/'||caculate_mode == '÷'){
            answer_mat = this.FractionDivide(num_mat1,num_mat2)

        }
        else {
            console.log('计算模式有错误')
            answer_mat = []
        }
        return answer_mat
    }

    MixedTurnFraction=(num_mat)=>{
        // 带分数转分数
        let mixed_fraction_int = eval(this.standardstr(num_mat[0]))
        let mixed_fraction_denominator = eval(this.standardstr(num_mat[1]))
        let mixed_fraction_numerator = eval(this.standardstr(num_mat[2]))
        let fraction_denominator = mixed_fraction_int*mixed_fraction_numerator+mixed_fraction_denominator
        let fraction_numerator = mixed_fraction_numerator
        return [fraction_denominator.toString(), fraction_numerator.toString()]
    }

    FractionAdd=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        // console.log('num_mat1', num_mat1)
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            // 带分数转换
            // console.log('num_mat2', num_mat1)
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                // console.log('num_mat3', num_mat1)
                // 整数、小数、百分数转换
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if(num_mat1.length == 3){
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            // console.log('加法caculate_num1',caculate_num1)
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if(num_mat2.length == 3){
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else{
                // console.log('num_mat2', num_mat2)
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            // console.log('加法caculate_num2',caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[1])+eval(caculate_num1[1])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[1])*eval(caculate_num2[1]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(), denominator_num.toString()]
        }
        else{
            // 纯小数计算规则
            let answer_num = this.formatNum(eval(num_mat1[0])+eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
            // console.log('加法结果', answer_num, answer_mat)
        }
        return answer_mat;
    }

    FractionSubtract=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if(num_mat1.length == 3){
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if(num_mat2.length == 3){
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else{
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[1])-eval(caculate_num1[1])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[1])*eval(caculate_num2[1]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            // console.log('add_numerator',add_numerator,add_denominator,max_gcd,numerator_num,denominator_num)
            answer_mat=[numerator_num.toString(),denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])-eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    FractionMultiply=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        // console.log('乘法模块', num_mat1.length,num_mat2.length)
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            // console.log('乘法模块2', num_mat1.length,num_mat2.length)
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if(num_mat1.length == 3){
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else{

                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
                console.log('分数', caculate_num2)
            }
            else if(num_mat2.length == 3){
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else{

                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            // console.log('乘法', caculate_num1, caculate_num2)
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[0]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[1])*eval(caculate_num2[1]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(), denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])*eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        // console.log('乘法answer_mat', answer_mat)
        return answer_mat;
    }
    
    FractionDivide=(num_mat1,num_mat2)=>{
        // 如果两个都是非分数则直接计算
        let answer_mat
        if(num_mat1.length>1||num_mat2.length>1){
            // 分数计算规则
            let caculate_num1,caculate_num2;
            if (num_mat1.length == 1){
                caculate_num1 = this.NumberTurnFraction(num_mat1)
            }
            else if(num_mat1.length == 3){
                // 带分数转换
                caculate_num1 = this.MixedTurnFraction(num_mat1)
            }
            else{
                caculate_num1 = [this.standardstr(num_mat1[0]), this.standardstr(num_mat1[1])]
            }
            if (num_mat2.length == 1){
                caculate_num2 = this.NumberTurnFraction(num_mat2)
            }
            else if(num_mat2.length == 3){
                // 带分数转换
                caculate_num2 = this.MixedTurnFraction(num_mat2)
            }
            else{
                caculate_num2 = [this.standardstr(num_mat2[0]), this.standardstr(num_mat2[1])]
            }
            let add_numerator = this.formatNum(eval(caculate_num1[0])*eval(caculate_num2[1]),10)
            let add_denominator = this.formatNum(eval(caculate_num1[1])*eval(caculate_num2[0]),10)
            let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
            let numerator_num,denominator_num
            if(max_gcd<0){
                numerator_num = parseInt(-add_numerator/max_gcd)
                denominator_num = parseInt(-add_denominator/max_gcd)
            }
            else{
                numerator_num = parseInt(add_numerator/max_gcd)
                denominator_num = parseInt(add_denominator/max_gcd)
            }
            answer_mat=[numerator_num.toString(), denominator_num.toString()]
        }
        else{
            let answer_num = this.formatNum(eval(num_mat1[0])/eval(num_mat2[0]),10)
            answer_mat = [answer_num.toString()]
        }
        return answer_mat;
    }

    NumberTurnFraction=(num_mat)=>{
        // 将数字转换为最简分数，如果是整数，分母为1
        let num_num;
        // 转换标准数字计算
        if (typeof(num_mat)=='object'){
            // console.log("num_mat[0]", num_mat[0])
            // 处理百分数情况
            if(num_mat[0].indexOf('%')>=0){
                let percentage_str = num_mat[0].split('%')[0]
                // console.log('百分数字符串', percentage_str)
                // 后期修正eval类出发
                num_num = eval(percentage_str)/100  
            }
            else{
                num_num = eval(num_mat[0])
            }
        }
        else{
            num_num=eval(num_mat)
        }
        // 分子分母转换
        let numerator_num,denominator_num;
        if (num_num%1==0){
            numerator_num = parseInt(num_num)
            denominator_num = 1
        }
        else{
            let ii_mi = 0
            for(let ii =1;ii<100;ii++){
                let num_num_1 = num_num * Math.pow(10,ii);
                if(num_num_1%1==0){
                    ii_mi = ii;
                    break
                }
            }
            // console.log('次方', ii_mi)
            let numerator_num0 = num_num*Math.pow(10, ii_mi)
            let denominator_num0 = Math.pow(10, ii_mi)
            // 找最大公约数
            let max_gcd = this.integerGCDfunc(numerator_num0,denominator_num0)
            if(max_gcd<0){
                numerator_num = parseInt(-numerator_num0/max_gcd)
                denominator_num = parseInt(-denominator_num0/max_gcd)
            }
            else{
                numerator_num = parseInt(numerator_num0/max_gcd)
                denominator_num = parseInt(denominator_num0/max_gcd)
            }
        }
        // console.log('numerator_num',numerator_num, 'denominator_num',denominator_num)
        return [numerator_num.toString(), denominator_num.toString()]
    }

    RecognizeMatTurnStandardMat=(rec_mat)=>{
		// model_mat 包含初始数字编码，和统一表达式字母，后续插入：真实值、数值类型、真实字母代码
		let model_mat =[[1,'A'],[2,'B'],[3,'C'],[4,'D'],[5,'E'],[6,'F'],[7,'G'],[8,'H'],[9,'I'],[10,'J'],[11,'K'],[12,'L'],[13,'M'],[14,'N'],[15,'O']]
		// console.log(model_mat)
		let replace_mat = []
		let idx_a = -1
		for (let ii=0;ii<rec_mat.length;ii++){
			// 主要判断数据为数字字符串
			if (rec_mat[ii].length==3){
				idx_a +=1
				model_mat[idx_a].push(rec_mat[ii])
				replace_mat.push([model_mat[idx_a][0].toString()])
			}
			else{
				if(['+','-','x','/','*','X','÷','(',')','[',']','{','}'].indexOf(rec_mat[ii][0])<0){
					// 如果不是计算符号
					idx_a +=1
					model_mat[idx_a].push(rec_mat[ii])
					replace_mat.push([model_mat[idx_a][0].toString()])
				}
				else{
					replace_mat.push(rec_mat[ii])
				}
			}
		}
		// console.log('变量替换',model_mat)
		// console.log('原始', rec_mat)
		// console.log('替换', replace_mat)
		let replace_str =''
		for (let ii=0;ii<replace_mat.length;ii++){
			replace_str +=replace_mat[ii][0]
		}
		let infix_str_mat = []
		infix_str_mat.push(replace_str)
		// console.log('数组组合字符串', replace_str)
		let suffix_mat = this.instr2suffixmat(replace_str)
		// console.log('字符串转后缀表达式', suffix_mat, typeof(suffix_mat[0]))
		// console.log(suffix_mat.length, suffix_mat[0]+0)
		while(suffix_mat.length>=3){
			for (let ii=0;ii<suffix_mat.length;ii++){
				// console.log(['+','-','x','/','*','X','÷'].indexOf(suffix_mat[ii])>=0)
				if(['+','-','x','/','*','X','÷'].indexOf(suffix_mat[ii])>=0){
					let num_1 = model_mat[suffix_mat[ii-2]+0-1][2]
					let num_2 = model_mat[suffix_mat[ii-1]+0-1][2]
					let caculate_mode = suffix_mat[ii]
					// console.log('计算过程', num_1, num_2, caculate_mode)
					idx_a +=1
					// 替换计算方案
					let caculate_mat = this.FractionCaculate(num_1,num_2,caculate_mode)
					model_mat[idx_a].push(caculate_mat)

					suffix_mat.splice(ii-2,3,Number(model_mat[idx_a][0]))
					// console.log('后缀表达式', suffix_mat)
					let infix_str;
					if (suffix_mat.length==1){
						infix_str = suffix_mat[0].toString()
					}
					else{
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
		let infix_letter_mat=[];
        let infix_value_mat=[];
        let infix_fraction_mat=[];
		for(let ii=0;ii<infix_str_mat.length;ii++){
			let part_infix_str = infix_str_mat[ii]
			// 提取数字=>替代字母和标准算式
			let str_num_mat=part_infix_str.match(/\d+(\.\d+)?/g);  //提取数字
			let str_symbol_mat=part_infix_str.replace(/\d+(\.\d+)?/g,'_'); //替换数字 
			// console.log('提取数字矩阵', str_num_mat,str_symbol_mat)
			let idx_num = -1
			let new_value_str=''
            let new_letter_str=''
            let part_infix_fraction_mat = []
			for(let jj=0;jj<str_symbol_mat.length;jj++){
				if (str_symbol_mat[jj]=='_'){
					idx_num +=1
					let a_mat_idx = parseInt(str_num_mat[idx_num])-1
                    let a_mat_value = model_mat[a_mat_idx][2]
                    part_infix_fraction_mat.push(a_mat_value)
					// 此处添加转换格式：目前默认样式，长度为1直接引用、长度为3转为？/?格式
					new_letter_str += model_mat[a_mat_idx][1]
					if (a_mat_value.length==1){
						new_value_str += a_mat_value[0]
					}
					else if(a_mat_value.length==3){
                        // 分数时需考虑添加括号，以示区别
                        // new_value_str += '('+a_mat_value[0]+')'+'/'+'('+a_mat_value[2]+')'
                        // 可视情况而定，如果内部存在符号"添加括号
                        if  (a_mat_value[0].indexOf('+')!=-1||a_mat_value[0].indexOf('-')!=-1||a_mat_value[0].indexOf('x')!=-1||
                             a_mat_value[0].indexOf('X')!=-1||a_mat_value[0].indexOf('*')!=-1||a_mat_value[0].indexOf('/')!=-1||a_mat_value[0].indexOf('÷')!=-1){
                            // 找到任意一种符号，添加括号
                            new_value_str += '('+a_mat_value[0]+')'+'/'
                        }
                        else{
                            new_value_str += a_mat_value[0]+'/'
                        }
                        if  (a_mat_value[2].indexOf('+')!=-1||a_mat_value[2].indexOf('-')!=-1||a_mat_value[2].indexOf('x')!=-1||
                             a_mat_value[2].indexOf('X')!=-1||a_mat_value[2].indexOf('*')!=-1||a_mat_value[2].indexOf('/')!=-1||a_mat_value[2].indexOf('÷')!=-1){
                            // 找到任意一种符号，添加括号
                            new_value_str += '('+a_mat_value[2]+')'
                        }
                        else{
                            new_value_str += a_mat_value[2]
                        }
					}
				}
				else{
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
    
    FractionTurnMat=(infix_fraction_mat)=>{
        // 转换为多行和单行的显示等式格式
        // console.log('infix_fraction_mat',infix_fraction_mat)
        let one_fraction_mat=[]
        let multiple_fraction_mat=[]
        for (let ii=0;ii<infix_fraction_mat.length;ii++){
            let part_multiple_mat = []
            // console.log('infix_fraction_mat[ii]',infix_fraction_mat[ii])
            for(let jj =0;jj<infix_fraction_mat[ii].length;jj++){
                // console.log('infix_fraction_mat[ii][jj]', infix_fraction_mat[ii][jj])
                if(ii!=0 && jj==0){
                    one_fraction_mat.push(['='])
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['='])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else if(ii==0 && jj==0){
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(['  '])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                else{
                    one_fraction_mat.push(infix_fraction_mat[ii][jj])
                    part_multiple_mat.push(infix_fraction_mat[ii][jj])
                }
                // console.log('one_fraction_mat', one_fraction_mat)
            }
            multiple_fraction_mat.push(part_multiple_mat)
        }
        return [one_fraction_mat, multiple_fraction_mat]
    }

    FractionTurnOtherType=(fraction_mat)=>{
        // 分数转换为其他类型数据：0：整数、1：小数、2：分数、3：百分数、4：带分数
        let all_type =[]
        all_type.integer = NaN
        all_type.decimal = NaN
        all_type.fraction = NaN
        all_type.percentage = NaN
        all_type.mixed_fraction =NaN
        // console.log('测试整数', fraction_mat)

        if (fraction_mat[1]=="1"){
            // console.log('测试整数')
            all_type.integer = [fraction_mat[0]]
        }
        // 小数计算：有限小数和循环小数
        // 找最大公约数
        let max_gcd = this.integerGCDfunc(eval(fraction_mat[0]),eval(fraction_mat[1]))
        // console.log('最大公约数', max_gcd, 0.0001==0.00010)
        // console.log('formatNum', this.formatNum(1/4,10)==this.formatNum(1/4,11))
        // console.log('比较', this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10), 
        //             this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),9))
        // if(this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10)==
        //     this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),9)){
        if(this.DivideCalculator(eval(fraction_mat[0]), eval(fraction_mat[1]))[0]==0){
            // 是否可除尽
            if(fraction_mat[1]=="1"){
                // 整数化小数可考虑保留一位小数
                all_type.decimal=[fraction_mat[0]+'.0']
                all_type.percentage = [fraction_mat[0]+'.00%']
            }
            else{
                all_type.decimal=[(this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10)).toString()]
                // 对百分数考虑保留有效位数？
                all_type.percentage = [Math.round(this.formatNum(eval(fraction_mat[0])/eval(fraction_mat[1]),10)*10000)/100+'%']
            }

        }
        all_type.fraction = fraction_mat
        // 转换带分数
        let mixed_fraction_int = parseInt(eval(fraction_mat[0])/eval(fraction_mat[1]))
        let mixed_fraction_denominator = eval(fraction_mat[0])%eval(fraction_mat[1])
        // console.log('带分数', mixed_fraction_int, mixed_fraction_denominator)
        if(mixed_fraction_int!=0 && mixed_fraction_denominator!=0){
            // 整数部分和分子部分都不为0时：考虑带分数组成合理情况
            all_type.mixed_fraction = [mixed_fraction_int.toString(), mixed_fraction_denominator.toString(), fraction_mat[1]]
        }
        return all_type
    }

    DivideCalculator=(num1,num2)=>{
        // 除法计算
        let answer_num = 0
        if (num1%num2!=0){
            // console.log('结果为小数')
            let while_num = 0
            let limited_flag = 1
            while(while_num<10){
                while_num += 1
                if ((Math.pow(10,while_num)*num1)%num2==0){
                    limited_flag = 0
                    break
                }
            }
            // console.log('整数除法', Math.round((Math.pow(10,while_num)*num1)/num2)/Math.pow(10,while_num))      // 以字符串形式处理最终解
            return[limited_flag, Math.round((Math.pow(10,while_num)*num1)/num2)/Math.pow(10,while_num)]
        }
        else{
            return [0, num1/num2]
        }
    }

    OtherTypeTurnOtherType=(num_mat)=>{
        let caculate_num1
        if (num_mat.length == 1){
            // console.log('num_mat3', num_mat)
            // 整数、小数、百分数转换
            caculate_num1 = this.NumberTurnFraction(num_mat)
        }
        else if(num_mat.length == 3){
            // 带分数转换
            caculate_num1 = this.MixedTurnFraction(num_mat)
            // 化最简
            caculate_num1 = this.SimplestFraction(eval(caculate_num1[0]) ,eval(caculate_num1[1]))
        }
        else{
            // caculate_num1 = [this.standardstr(num_mat[0]), this.standardstr(num_mat[1])]
            caculate_num1 = this.SimplestFraction(eval(this.standardstr(num_mat[0])) ,eval(this.standardstr(num_mat[1])))
        }
        // console.log('caculate_num1', caculate_num1)
        let all_type_mat = this.FractionTurnOtherType(caculate_num1)
        // console.log('all_type_mat', all_type_mat)
        return all_type_mat
    }

    JudgeTwoNumMat = (num_mat1, num_mat2)=>{
        // 判断两个数字类型数组的分数情况
        let all_type_mat1 = this.OtherTypeTurnOtherType(num_mat1)
        let all_type_mat2 = this.OtherTypeTurnOtherType(num_mat2)
        // console.log('all_type_mat1', all_type_mat1)
        // console.log('all_type_mat2', all_type_mat2)
        if (all_type_mat1.fraction[0]==all_type_mat2.fraction[0]&&all_type_mat1.fraction[1]==all_type_mat2.fraction[1]){
            console.log('分数结果相等--', num_mat1, num_mat2)
            return true
        }
        else{
            // 结果不等
            return false
        }
    }

    SimplestFraction =(add_numerator,add_denominator)=>{
        let max_gcd = this.integerGCDfunc(add_numerator,add_denominator)
        let numerator_num,denominator_num
        if(max_gcd<0){
            numerator_num = parseInt(-add_numerator/max_gcd)
            denominator_num = parseInt(-add_denominator/max_gcd)
        }
        else{
            numerator_num = parseInt(add_numerator/max_gcd)
            denominator_num = parseInt(add_denominator/max_gcd)
        }
        // console.log(numerator_num,)
        let answer_mat=[numerator_num.toString(), denominator_num.toString()]
        return answer_mat
    }

    JudgeTwoFractionEqual=(fraction_mat1,fraction_mat2)=>{
        // 判断两个分数值是否相等:分子分母分别相等、分子分母整数倍的变化、一种考虑直接的除法结果相等
        if(eval(fraction_mat1[0])==eval(fraction_mat2[0])&&eval(fraction_mat1[1])==eval(fraction_mat2[1])){
            // 分子分母分别相等
            return [1, '分子分母全等']
        }
        else if(eval(fraction_mat1[0])%eval(fraction_mat2[0])==0&&eval(fraction_mat1[1])%eval(fraction_mat2[1])==0&&
                Math.round(eval(fraction_mat1[0])/eval(fraction_mat2[0]))==Math.round(eval(fraction_mat1[1])/eval(fraction_mat2[1]))){
            // 分子分母整数倍变化
            return [2, '分子分母整数倍通分']
        }
        else if(eval(fraction_mat2[0])%eval(fraction_mat1[0])==0&&eval(fraction_mat2[1])%eval(fraction_mat1[1])==0&&
                Math.round(eval(fraction_mat2[0])/eval(fraction_mat1[0]))==Math.round(eval(fraction_mat2[1])/eval(fraction_mat1[1]))){
            // 分子分母整数倍变化
            return [2, '分子分母整数倍通分']
        }
        else{
            // 直接计算分子分母的乘法结果
            if(eval(fraction_mat1[0])*eval(fraction_mat2[1])==eval(fraction_mat1[1])*eval(fraction_mat2[0])){
                // a/b=c/d：a*d = c*b
                return [3, '分数值相等']
            }
            else{
                // 不等
                return [0, '分数值不相等']
            }
        }
    }

    AppMatTurnStandardMat=(init_mat)=>{
        // let init_mat =[['3','4'],'+5.5X0.2-',['1', '4', '5'],'x(3.5-1.3)-0.5']
        // 单组转换
        let turn_standard_mat = []      // 转换标准计算矩阵
        for (let ii=0; ii<init_mat.length; ii++){
            // 
            if(typeof(init_mat[ii])=='object'){
                turn_standard_mat.push(init_mat[ii])
            }
            else if (typeof(init_mat[ii])=='string'){
                // turn_standard_mat.push(init_mat[ii])
                let part_str = ''               // 组合字段
                for (let jj=0;jj<init_mat[ii].length;jj++){
                    if((['+', '-','X','x','*','÷','(',')','（','）','[',']']).indexOf(init_mat[ii][jj])>=0){
                        // 遇到计算符号后单独存储
                        if(part_str.length<1){
                            // 没有数字字符串
                            if(init_mat[ii][jj]=='（'){
                                turn_standard_mat.push(['('])
                            }
                            else if(init_mat[ii][jj]=='）'){
                                turn_standard_mat.push([')'])
                            }
                            else{
                                turn_standard_mat.push([init_mat[ii][jj]])
                            }
                        }
                        else{
                            turn_standard_mat.push([part_str])
                            turn_standard_mat.push([init_mat[ii][jj]])
                            part_str = ''
                        }
                    }
                    else{
                        part_str += init_mat[ii][jj]
                    }
                }
                if(part_str.length>=1){
                    turn_standard_mat.push([part_str])
                    part_str = ''
                }
            }
        }
        // console.log('转换标准数组', JSON.stringify(turn_standard_mat))
        return turn_standard_mat
    }

    GetMaxAlgebra = (algebra_expression)=>{
        let algebra_max = 'A'
        for (let ii=0;ii<algebra_expression.length;ii++){
            if(algebra_expression[ii]>='A'&&algebra_expression[ii]<='Z'){
                if(algebra_expression[ii]>algebra_max){
                    algebra_max=algebra_expression[ii]
                }
            }
        }
        // console.log('最大代数', algebra_max)
        return algebra_max
    }

    MathchBracket =(algebra_expression)=>{
        // 匹配括弧
        return algebra_expression.match('[(][A-Z+\-x÷]+[A-Z][)]')
    }

    MatchMulDiv=(standard_str)=>{
        // 匹配乘除法
        // console.log(standard_str)
        // return standard_str.match('[x÷]')
        return standard_str.match('[A-Zx÷]+[A-Z]')
    }

    MatchAddSub=(standard_str)=>{
        // 匹配乘除法
        // return standard_str.match('[+\-]')
        return standard_str.match('[A-Z][+\-]+[A-Z]')
    }

    AlgebraSingleStepProcess=(standard_str, algebra_max)=>{
        // 无括号代数式单步处理
        // console.log('this.MatchMulDiv(standard_str)', this.MatchMulDiv(standard_str))
        if (this.MatchMulDiv(standard_str)!=null){
            let symbole_idx = this.MatchMulDiv(standard_str).index
            let triadic_left_str =  standard_str.substr(symbole_idx, 3)   // 索引、长度
            algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
            let new_standard_str = standard_str.replace(triadic_left_str, algebra_max)
            // console.log('standard_str', standard_str, triadic_left_str)
            // console.log('单步处理结果', [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max])
            return [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max]
        }
        else if (this.MatchAddSub(standard_str)!=null){
            let symbole_idx = this.MatchAddSub(standard_str).index
            let triadic_left_str =  standard_str.substr(symbole_idx, 3)   // 索引、长度
            algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
            let new_standard_str = standard_str.replace(triadic_left_str,algebra_max)
            // console.log('standard_str', standard_str, triadic_left_str)
            // console.log('单步处理结果', [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max])
            return [standard_str, new_standard_str, triadic_left_str, algebra_max, triadic_left_str+'='+algebra_max]
        }
        else{
            return false
        }
    }
    
    AlgebraEquationProcedure=(algebra_expression)=>{
        // let algebra_expression = 'A+BxC-(D+E-Fx(G÷H))+(J-I)'
        let algebra_max = this.GetMaxAlgebra(algebra_expression)
        // console.log(algebra_expression.match('[(][A-Z+\-x÷]+[A-Z][)]')==null)
        // console.log('初始算式algebra_expression', algebra_expression)
        let triadic_mat = []
        let algebra_expression_mat = []
        algebra_expression_mat.push(algebra_expression)
        let flag_num = 0 
        while (this.MathchBracket(algebra_expression)!=null && flag_num<10){
            flag_num += 1
            // 存在括弧计算
            let bracket_str = this.MathchBracket(algebra_expression)[0]
            // console.log('bracket_str', bracket_str, algebra_expression)
            let standard_str = bracket_str.substr(1, bracket_str.length-2)
            // console.log('加减符号查找', mathstrcaculate.MatchAddSub(standard_str))
            // console.log('乘除符号查找', mathstrcaculate.MatchMulDiv(standard_str))
            let single_process_mat = this.AlgebraSingleStepProcess(standard_str, algebra_max)
            if (single_process_mat){
                if (bracket_str.length==5){
                    // 完整替换
                    algebra_expression = algebra_expression.replace(bracket_str, single_process_mat[3])
                    algebra_max = single_process_mat[3] 
                }
                else{
                    // 局部替换
                    algebra_expression = algebra_expression.replace(single_process_mat[2], single_process_mat[3])
                    algebra_max = single_process_mat[3] 
                }
                triadic_mat.push(single_process_mat[4])
                // console.log('括弧计算algebra_expression', algebra_expression)
                algebra_expression_mat.push(algebra_expression)
            }
            else{
                break
            }
            // break
        }
        // console.log('三元等式矩阵', triadic_mat)
        flag_num = 0 
        while (algebra_expression.length>=3 && flag_num<10){
            flag_num += 1 
            let single_process_mat = this.AlgebraSingleStepProcess(algebra_expression, algebra_max)
            if(single_process_mat){
                algebra_expression = algebra_expression.replace(single_process_mat[2], single_process_mat[3])
                algebra_max = single_process_mat[3] 
                triadic_mat.push(single_process_mat[4])
                // console.log('一般计算algebra_expression', algebra_expression)
                algebra_expression_mat.push(algebra_expression)
            }
            else{break}
        }
        // console.log('三元等式矩阵', triadic_mat)
        // console.log('每步算式计算', algebra_expression_mat, triadic_mat)
        return [algebra_expression_mat, triadic_mat]
    }

    NumEquationTurnAlgebra=(standard_mat)=>{
        // 标准数字算式数组转换代数式
        let standard_num = 64
        let algebra_dict = {}
        let algebra_str = ''
        let algebra_expression_str = ''
        for (let ii=0;ii<standard_mat.length;ii++){
            if(standard_mat[ii].length>1){
                // console.log('分数')
                standard_num += 1
                algebra_str = String.fromCharCode(standard_num)
                algebra_dict[algebra_str] = standard_mat[ii]
                algebra_expression_str += algebra_str
            }
            else{
                if((['+', '-','X','x','*','÷','(',')','[',']','{','}']).indexOf(standard_mat[ii][0])>=0){
                    // 符号
                    if((['X','x','*']).indexOf(standard_mat[ii][0])>=0){
                        algebra_expression_str += 'x'
                    }
                    else if((['(','[','{']).indexOf(standard_mat[ii][0])>=0){
                        algebra_expression_str += '('
                    }
                    else if(([')',']','}']).indexOf(standard_mat[ii][0])>=0){
                        algebra_expression_str += ')'
                    }
                    else{
                        algebra_expression_str += standard_mat[ii][0]
                    }
                    
                }
                else{
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

    AlgebraEquationTurnNum=(algebra_expression_str,algebra_dict)=>{
        // 代数式转化数值数组
        let part_standard_mat = []
        // 代数式中，小括号转中括号、大括号的转换过程
        for(let jj=0;jj<algebra_expression_str.length;jj++){
            if (algebra_expression_str[jj]>='A'&&algebra_expression_str[jj]<='Z'){
                part_standard_mat.push(algebra_dict[algebra_expression_str[jj]])
            }
            else{
                part_standard_mat.push([algebra_expression_str[jj]])
            }
        }
        console.log('单步转换', JSON.stringify(part_standard_mat))
        return part_standard_mat
    }

    StandardCalculateAnswer=(init_mat)=>{
        // let init_mat =[['3','4'],'+5.5X0.4+',['1', '4', '5'],'x[3.5-1.3]-0.5']
        let standard_mat = this.AppMatTurnStandardMat(init_mat)
        // console.log('标准答题算式', JSON.stringify(standard_mat))
        let [algebra_expression, algebra_dict] = this.NumEquationTurnAlgebra(standard_mat)
        let [algebra_expression_mat, triadic_mat] = this.AlgebraEquationProcedure(algebra_expression)
        let end_algebra = algebra_expression_mat[algebra_expression_mat.length-1]
        if(end_algebra>='A' && end_algebra<='Z'&& end_algebra.length ==1){
            // console.log('可计算结果')
            algebra_dict = this.CaculateAllAlgebra(triadic_mat, algebra_dict)
            // console.log('三元代数计算Key-value', JSON.stringify(algebra_dict))
            // 转换每步计算矩阵
            let all_standard_mat = this.ALLAlgebraEquationTurnNum=(algebra_expression_mat, algebra_dict)
            // 返回最终计算结果
            let end_all_type_mat = this.OtherTypeTurnOtherType(algebra_dict[end_algebra])
            return end_all_type_mat.fraction
        }
        else{
            // console.log('算式计算有误:不能得到单一数据', algebra_expression_mat[algebra_expression_mat.length-1])
            return false
        }
    }

    ALLAlgebraEquationTurnNum=(algebra_expression_mat, algebra_dict)=>{
        // 转换每步计算
        let all_standard_mat = []
        for(let ii=0;ii<algebra_expression_mat.length;ii++){
            let part_standard_mat = this.AlgebraEquationTurnNum(algebra_expression_mat[ii],algebra_dict)
            all_standard_mat.push(part_standard_mat)
        }
        return all_standard_mat
    }

    CaculateAllAlgebra=(triadic_mat, algebra_dict)=>{
        for (let ii=0;ii<triadic_mat.length;ii++){
            let step_triadic = triadic_mat[ii]
            // 调用单步计算
            let num_1 = algebra_dict[step_triadic[0]]
            let num_2 = algebra_dict[step_triadic[2]]
            let caculate_mode = step_triadic[1]
            let caculate_mat = this.FractionCaculate(num_1,num_2,caculate_mode)
            algebra_dict[step_triadic[4]] = caculate_mat
        }
        // console.log('三元代数计算Key-value', JSON.stringify(algebra_dict))
        return algebra_dict
    }

    StaticCalSymbol=(init_mat)=>{
        // 统计计算符号
        let standard_mat = this.AppMatTurnStandardMat(init_mat)
        // console.log('标准答题算式', JSON.stringify(standard_mat))
        let symbole_mat = []
        for (let ii=0;ii<standard_mat.length;ii++){
            if((['+','-','x','X','÷']).indexOf(standard_mat[ii][0])>=0){
                symbole_mat.push(standard_mat[ii][0])
            }
        }
        console.log('符号统计', symbole_mat)
        return symbole_mat
    }

    PureNumJudge=(test_str)=>{
        // 只考虑存整数判定：
        let decimal_reg = /^[\d|\.]*$/; //带小数
        let intger_reg = /^[\d]*$/; //整数
        return intger_reg.test(test_str)
        
    }
}

let fraction_cls = new MathBaseCaculateFunc()
export class FractionExpalinFunc{
    // 单步分数加减乘除讲解：满足分数计算格式
    integerGCDfunc=(num1,num2)=>{
        //求两个整数的最大公约:扩展到小数
        let max_idx;
        for(let ii=0;ii<100;ii++){
            // console.log('gcd:ii',num1*Math.pow(10,ii), num2*Math.pow(10,ii)%1)
            if((num1*Math.pow(10,ii)%1==0)&&(num2*Math.pow(10,ii)%1==0)){
                // 同时为整，记录扩大次数
                max_idx = ii
                break;
            }
        }
        // console.log('公约数次幂', max_idx)
        let gcdnum1=num1*Math.pow(10,max_idx);
        let gcdnum2=num2*Math.pow(10,max_idx);
        let gcdnum3=0;
        //判断整数
        if((Math.floor(gcdnum1) === gcdnum1)&&(Math.floor(gcdnum2) === gcdnum2)){
            while(1){
                gcdnum3=gcdnum1%gcdnum2;
                gcdnum1=gcdnum2;
                gcdnum2=gcdnum3;
                if(gcdnum3==0){
                    gcdnum3=gcdnum1;
                    break;
                }
            }
        }
        else{
            gcdnum3=1;
        }
        return gcdnum3/Math.pow(10,max_idx);
    }

    integerLCMfunc=(num1,num2)=>{
        //求两个整数的最小公倍数
        let lcmnum1=num1;
        let lcmnum2=num2;
        //先求最大公约数再求最小公倍数
        let lcmnum3=this.integerGCDfunc(lcmnum1,lcmnum2);
        let lcmnum4=parseInt(lcmnum1*lcmnum2/lcmnum3);
        return lcmnum4;
    }

    NumTypeJudge=(num_mat)=>{
        // 数字类型判定
        if (num_mat.length==2){
            // 分数判定：2
            let numerator_str = num_mat[0].toString()
            let denominator_str = num_mat[1].toString()
            return [2, [numerator_str, denominator_str]]
        }
        else if(num_mat.length==3){
            // 带分数判定：4
            // 可以拆分整数+分数部分，或者转换为分数部分
            // let numerator_str = eval(num_mat[0]+'*'+num_mat[2]+'+'+num_mat[1]).toString()
            let numerator_str = (num_mat[1]).toString()
            let denominator_str = num_mat[2].toString()
            let integer_str = num_mat[0].toString()

            return [4,[integer_str, numerator_str,denominator_str]]
        }
        else if(num_mat.length==1){
            // 整数：0、小数：1、百分数：3； 判定
            if((num_mat[0]).indexOf('%')>=0){
                // 百分数
                return [3, [num_mat[0].toString()]]
            }
            else if((num_mat[0]).indexOf('.')>=0){
                // 小数
                return [1, [num_mat[0].toString()]]
            }
            else if(eval(num_mat[0])==parseInt(num_mat[0])){
                // 整数
                return [0, [num_mat[0].toString()]]
            }
            else{
                return [-1, false]
            }
        }

    }

    OneStepFractionComputeProcess=(fraction_mat1, compute_sign, fraction_mat2)=>{
        /**
         * 调用实例
         * let fraction_mat1 = ['7','15']
         * let compute_sign = '-'
         * let fraction_mat2 = ['2','5']
         * fraction_cls.OneStepFractionComputeProcess(fraction_mat1, compute_sign, fraction_mat2)
        */
        // 单步分数类计算过程
        console.log('分数计算过程')
        if((['+']).indexOf(compute_sign)>=0){
            // 加法类分解
            console.log('调用分数加法')
            return this.FractionAddMode(fraction_mat1, compute_sign, fraction_mat2)
        }
        else if((['-']).indexOf(compute_sign)>=0){
            // 减法类分解
            console.log('调用分数减法')
            return this.FractionSubMode(fraction_mat1, compute_sign, fraction_mat2)
        }
        else if((['x','X','*']).indexOf(compute_sign)>=0){
            // 
            console.log('调用分数乘法')
            return this.FractionMultiMode(fraction_mat1, compute_sign, fraction_mat2)
        }
        else if((['÷']).indexOf(compute_sign)>=0){
            // 
            console.log('调用分数除法')
            return this.FractionDivMode(fraction_mat1, compute_sign, fraction_mat2)
            
        }
    }

    FractionAddMode=(fraction_mat1, compute_sign, fraction_mat2)=>{
        let compute_process_mat = []        // 
        let compute_explain_mat = []        // 文字解析
        // 判定加法
        compute_explain_mat.push('先判断是否是同分母')
        compute_process_mat.push([fraction_mat1,compute_sign,fraction_mat2])
        if(fraction_mat1.length==2 && fraction_mat2.length==2){
            // 两个分数相加
            if(fraction_mat1[1]==fraction_mat2[1]){
                // 同分母相加
                let [compute_process_mat1, compute_explain_mat1] = this.FractionAddSameDenominator(fraction_mat1, fraction_mat2,compute_process_mat, compute_explain_mat)
                console.log('同分母相加---', compute_process_mat1, compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
            else{
                // 异分母相加---最小公倍数
                compute_explain_mat.pop()
                compute_explain_mat.push('异分母分数相加，先判断分母的最小公倍数是多少')
                let lcm_num = this.integerLCMfunc(eval(fraction_mat1[1]), eval(fraction_mat2[1]))
                // console.log('lcm_num', lcm_num)
                let amplify_num1 = parseInt(lcm_num/eval(fraction_mat1[1]))
                let amplify_num2 = parseInt(lcm_num/eval(fraction_mat2[1]))
                let common_denomiator_mat1 =[]
                let common_denomiator_mat2 =[]
                let common_denomiator_answer_mat1 =[]
                let common_denomiator_answer_mat2 =[]
                if(amplify_num1>1){
                    [common_denomiator_mat1, common_denomiator_answer_mat1] = this.FractionPushAmplify(fraction_mat1, 
                                                                                                        amplify_num1, 
                                                                                                        common_denomiator_mat1, 
                                                                                                        common_denomiator_answer_mat1)
                }
                else{
                    // 原始赋值
                    [common_denomiator_mat1, common_denomiator_answer_mat1] = this.FractionPushInit(fraction_mat1, common_denomiator_mat1, common_denomiator_answer_mat1)
                }
                if(amplify_num2>1){
                    [common_denomiator_mat2, common_denomiator_answer_mat2] = this.FractionPushAmplify(fraction_mat2, 
                                                                                                        amplify_num2, 
                                                                                                        common_denomiator_mat2, 
                                                                                                        common_denomiator_answer_mat2)
                }
                else{
                    // 原始赋值
                    [common_denomiator_mat2, common_denomiator_answer_mat2] = this.FractionPushInit(fraction_mat2, common_denomiator_mat2, common_denomiator_answer_mat2)
                }
                compute_process_mat.push(['=', common_denomiator_mat1,'+',common_denomiator_mat2])
                compute_explain_mat.push('根据最小公倍数，将各分数同乘数字')
                compute_process_mat.push(['=', common_denomiator_answer_mat1,'+',common_denomiator_answer_mat2])
                compute_explain_mat.push('将分数通分成同分母分数')
                // 调用同分母相加
                let [compute_process_mat1, compute_explain_mat1]= this.FractionAddSameDenominator(common_denomiator_answer_mat1, 
                                                                                                    common_denomiator_answer_mat2,
                                                                                                    compute_process_mat, 
                                                                                                    compute_explain_mat)
                console.log('异分母相加-----', compute_process_mat1, compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
        }
        else if(fraction_mat1.length==1 && fraction_mat2.length==2){
            // 非分数转换分数计算
            let num_type_mat = this.NumTypeJudge(fraction_mat1[0])
            console.log('单组数据类型判定', num_type_mat)
            if (num_type_mat[0]==0){
                // 整数减分数
                console.log('整数加分数类')
                // 整数转换同分母计算
                compute_explain_mat.pop()
                compute_explain_mat.push('整数减分数，先判断后一个分数的分母是多少')
                let new_numerator = (eval(fraction_mat1[0]+'*'+fraction_mat2[1])).toString()
                let new_denominator = fraction_mat2[1]
                let new_raction_mat1 = [new_numerator, new_denominator]
                compute_process_mat.push(['=',new_raction_mat1, '+', fraction_mat2])        // 添加注释语句：整数转换同分母计算
                compute_explain_mat.push('将整数通分成同分母的分数')
                let [compute_process_mat1, compute_explain_mat1] = this.FractionAddSameDenominator(new_raction_mat1, fraction_mat2,compute_process_mat, compute_explain_mat)
                console.log('整数加分数---', compute_process_mat1, compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
        }
        return false
        
    }

    FractionSubMode=(fraction_mat1, compute_sign, fraction_mat2)=>{
        let compute_process_mat = []
        let compute_explain_mat = []        // 文字解析
        // 判定减法
        compute_process_mat.push([fraction_mat1,compute_sign,fraction_mat2])
        compute_explain_mat.push('先判断是否是同分母')
        if(fraction_mat1.length==2 && fraction_mat2.length==2){
            // 两个分数相减
            if(fraction_mat1[1]==fraction_mat2[1]){
                // 同分母相减
                let [compute_process_mat1,compute_explain_mat1] = this.FractionSubSameDenominator(fraction_mat1, fraction_mat2,compute_process_mat,compute_explain_mat)
                console.log('同分母相减---', compute_process_mat1, compute_explain_mat1)
                return [compute_process_mat1,compute_explain_mat1]
            }
            else{
                // 异分母相减---最小公倍数
                compute_explain_mat.pop()
                compute_explain_mat.push('异分母相减，先判断分母的最小公倍数是多少')
                let lcm_num = this.integerLCMfunc(eval(fraction_mat1[1]), eval(fraction_mat2[1]))
                // console.log('lcm_num', lcm_num)
                let amplify_num1 = parseInt(lcm_num/eval(fraction_mat1[1]))
                let amplify_num2 = parseInt(lcm_num/eval(fraction_mat2[1]))
                let common_denomiator_mat1 =[]
                let common_denomiator_mat2 =[]
                let common_denomiator_answer_mat1 =[]
                let common_denomiator_answer_mat2 =[]
                if(amplify_num1>1){
                    [common_denomiator_mat1, common_denomiator_answer_mat1] = this.FractionPushAmplify(fraction_mat1, 
                                                                                                        amplify_num1, 
                                                                                                        common_denomiator_mat1, 
                                                                                                        common_denomiator_answer_mat1)
                }
                else{
                    // 原始赋值
                    [common_denomiator_mat1, common_denomiator_answer_mat1] = this.FractionPushInit(fraction_mat1, common_denomiator_mat1, common_denomiator_answer_mat1)
                }
                if(amplify_num2>1){
                    [common_denomiator_mat2, common_denomiator_answer_mat2] = this.FractionPushAmplify(fraction_mat2, 
                                                                                                        amplify_num2, 
                                                                                                        common_denomiator_mat2, 
                                                                                                        common_denomiator_answer_mat2)
                }
                else{
                    // 原始赋值
                    [common_denomiator_mat2, common_denomiator_answer_mat2] = this.FractionPushInit(fraction_mat2, common_denomiator_mat2, common_denomiator_answer_mat2)
                }
                compute_process_mat.push(['=', common_denomiator_mat1,'-',common_denomiator_mat2])
                compute_explain_mat.push('根据最小公倍数，将各分数同乘数字')
                compute_process_mat.push(['=', common_denomiator_answer_mat1,'-',common_denomiator_answer_mat2])
                compute_explain_mat.push('将分数通分成同分母分数')
                // 调用同分母相减[compute_process_mat, compute_explain_mat]
                let [compute_process_mat1, compute_explain_mat1] = this.FractionSubSameDenominator(common_denomiator_answer_mat1, common_denomiator_answer_mat2,compute_process_mat,compute_explain_mat)
                console.log('异分母相减-----', compute_process_mat1,compute_explain_mat1)
                return [compute_process_mat1,compute_explain_mat1]
            }
        }
        else if(fraction_mat1.length==1 && fraction_mat2.length==2){
            // 非分数转换分数计算
            let num_type_mat = this.NumTypeJudge(fraction_mat1[0])
            console.log('单组数据类型判定', num_type_mat)
            if (num_type_mat[0]==0){
                // 整数减分数
                console.log('整数减分数类')
                // 整数转换同分母计算
                compute_explain_mat.pop()
                compute_explain_mat.push('整数减分数，先判断后一个分数的分母是多少')
                let new_numerator = (eval(fraction_mat1[0]+'*'+fraction_mat2[1])).toString()
                let new_denominator = fraction_mat2[1]
                let new_raction_mat1 = [new_numerator, new_denominator]
                compute_process_mat.push(['=',new_raction_mat1, '-', fraction_mat2])        // 添加注释语句：整数转换同分母计算
                compute_explain_mat.push('将整数通分成同分母的分数')
                let [compute_process_mat1, compute_explain_mat1] = this.FractionSubSameDenominator(new_raction_mat1, fraction_mat2,compute_process_mat, compute_explain_mat)
                console.log('整数减分数---', compute_process_mat1, compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
        }
        return false
    }

    FractionMultiMode=(fraction_mat1, compute_sign, fraction_mat2)=>{
        let compute_process_mat = []
        let compute_explain_mat = []
        // 判定乘法
        compute_process_mat.push([fraction_mat1,compute_sign,fraction_mat2])
        if(fraction_mat1.length==2 && fraction_mat2.length==2){
            // 两个分数相乘
            compute_explain_mat.push('两分数相乘')

            let [compute_process_mat1, compute_explain_mat1]= this.FractionMultiStandard(fraction_mat1,fraction_mat2, compute_process_mat, compute_explain_mat)
            console.log('两分数相乘-----', compute_process_mat1, compute_explain_mat1)
            return [compute_process_mat1, compute_explain_mat1]
        }
        else if (fraction_mat1.length==1 && fraction_mat2.length==2){
            // 非分数转换分数计算
            let num_type_mat = this.NumTypeJudge(fraction_mat1[0])
            console.log('单组数据类型判定', num_type_mat)
            if (num_type_mat[0]==0){
                // 整数乘以分数
                // console.log('整数乘分数类')
                compute_explain_mat.push('整数乘分数类')
                let [compute_process_mat1 , compute_explain_mat1] = this.IntegerMultiFraction(  fraction_mat1, 
                                                                                                fraction_mat2, 
                                                                                                compute_process_mat, 
                                                                                                compute_explain_mat)
                console.log('整数乘分数类', compute_process_mat1 , compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
        }
        return false
    }

    FractionDivMode=(fraction_mat1, compute_sign, fraction_mat2)=>{
        let compute_process_mat = []
        let compute_explain_mat = []
        // 判定除法
        compute_process_mat.push([fraction_mat1,compute_sign,fraction_mat2])
        if(fraction_mat1.length==2 && fraction_mat2.length==2){
            // 两个分数相乘
            compute_explain_mat.push('分数除以分数类型计算')
            compute_process_mat.push(['=',fraction_mat1,'x',[fraction_mat2[1],fraction_mat2[0]]])
            compute_explain_mat.push('分数除以一个不为零的数，相当于乘这个数的倒数')
            let new_fraction_mat1 = fraction_mat1
            let new_fraction_mat2 = [fraction_mat2[1],fraction_mat2[0]]
            // 调用两个分数相乘
            let [compute_process_mat1 , compute_explain_mat1]= this.FractionMultiStandard(new_fraction_mat1,new_fraction_mat2, compute_process_mat,compute_explain_mat)
            console.log('两分数相除-----', compute_process_mat1 , compute_explain_mat1)
            return [compute_process_mat1, compute_explain_mat1]
        }
        else if(fraction_mat1.length==1 && fraction_mat2.length==2){
            // 其他类型除以分数
            let num_type_mat = this.NumTypeJudge(fraction_mat1[0])
            console.log('单组数据类型判定', num_type_mat)
            if (num_type_mat[0]==0){
                compute_explain_mat.push('整数除以分数类型计算')
                compute_process_mat.push(['=',fraction_mat1,'x',[fraction_mat2[1],fraction_mat2[0]]])
                compute_explain_mat.push('整数除以一个不为零的分数，相当于乘这个数的倒数')
                let [compute_process_mat1 , compute_explain_mat1] = this.IntegerMultiFraction(  fraction_mat1, 
                                                                                                [fraction_mat2[1],fraction_mat2[0]], 
                                                                                                compute_process_mat, 
                                                                                                compute_explain_mat)
                console.log('整数除以分数', compute_process_mat1 , compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }
        }
        else if(fraction_mat1.length==2 && fraction_mat2.length==1){
            // 分数除以其他类型
            let num_type_mat = this.NumTypeJudge(fraction_mat2[0])
            console.log('单组数据类型判定', num_type_mat)
            if (num_type_mat[0]==0){
                compute_explain_mat.push('分数除以整数类型计算')
                compute_process_mat.push(['=',fraction_mat1,'x',['1',fraction_mat2[0]]])
                compute_explain_mat.push('分数除以一个不为零的整数，相当于乘这个整数的倒数')
                let [compute_process_mat1 , compute_explain_mat1] = this.FractionMultiStandard( fraction_mat1, 
                                                                                                ['1',fraction_mat2[0]], 
                                                                                                compute_process_mat, 
                                                                                                compute_explain_mat)
                console.log('分数除以整数', compute_process_mat1 , compute_explain_mat1)
                return [compute_process_mat1, compute_explain_mat1]
            }

        }
        return false
    }

    FractionAddSameDenominator=(fraction_mat1, fraction_mat2,compute_process_mat, compute_explain_mat)=>{
        // 分数同分母加法
        compute_process_mat.push(['=',[fraction_mat1[0]+'+'+fraction_mat2[0],fraction_mat2[1]]])
        compute_explain_mat.push('是同分母，分母不变，分子相加')
        let fraction_numerator = eval(fraction_mat1[0])+eval(fraction_mat2[0])
        let fraction_denominator = eval(fraction_mat1[1])
        compute_process_mat.push(['=',[fraction_numerator,fraction_denominator]])
        compute_explain_mat.push('得出结果后判断是否是最简分数')
        // 调用最大公约数
        let gcd_num = this.integerGCDfunc(fraction_numerator, fraction_denominator)
        console.log('gcd_num', gcd_num)
        if(gcd_num>1){
            // 存在公约数
            let new_fraction_numerator = fraction_numerator/gcd_num
            let new_fraction_denominator = fraction_denominator/gcd_num
            compute_process_mat.push(['=',[new_fraction_numerator,new_fraction_denominator]])
            compute_explain_mat.push('最终结果化简成最简分数')
        }
        else{
            // 是最简分数
            compute_explain_mat.pop()
            compute_explain_mat.push('得出结果后，判断是最简分数')
        }
        // console.log('compute_process_mat', compute_process_mat)
        return [compute_process_mat, compute_explain_mat]
    }

    FractionSubSameDenominator=(fraction_mat1, fraction_mat2,compute_process_mat,compute_explain_mat)=>{
        // 分数同分母减法
        console.log('同分母减法')
        compute_process_mat.push(['=',[fraction_mat1[0]+'-'+fraction_mat2[0],fraction_mat2[1]]])
        compute_explain_mat.push('是同分母，分母不变，分子相减')
        let fraction_numerator = eval(fraction_mat1[0])-eval(fraction_mat2[0])
        let fraction_denominator = eval(fraction_mat1[1])
        compute_process_mat.push(['=',[fraction_numerator,fraction_denominator]])
        compute_explain_mat.push('得出结果后判断是否是最简分数')
        // 调用最大公约数
        let gcd_num = this.integerGCDfunc(fraction_numerator, fraction_denominator)
        // console.log('gcd_num', gcd_num)
        if(gcd_num>1){
            // 存在公约数
            let new_fraction_numerator = fraction_numerator/gcd_num
            let new_fraction_denominator = fraction_denominator/gcd_num
            compute_process_mat.push(['=',[new_fraction_numerator,new_fraction_denominator]])
            compute_explain_mat.push('最终结果化简成最简分数')
        }
        else{
            // 是最简分数
            compute_explain_mat.pop()
            compute_explain_mat.push('得出结果后，判断是最简分数')
        }
        console.log('compute_process_mat', compute_process_mat,compute_explain_mat)
        return [compute_process_mat,compute_explain_mat]
    }

    FractionMultiStandard=(fraction_mat1,fraction_mat2, compute_process_mat, compute_explain_mat)=>{
        // 标准两分数相乘
        let numerator_str = fraction_mat1[0]+'x'+fraction_mat2[0]
        let denomiator_str = fraction_mat1[1]+'x'+fraction_mat2[1]
        compute_process_mat.push(['=',[ numerator_str, denomiator_str]])    // 分子分母相乘
        compute_explain_mat.push('分数与分数相乘，分子乘分子，分母乘分母')
        let numerator_value = eval(fraction_mat1[0]+'*'+fraction_mat2[0])
        let denomiator_value  = eval(fraction_mat1[1]+'*'+fraction_mat2[1])
        compute_process_mat.push(['=',[ numerator_value, denomiator_value]])    // 相乘结果
        compute_explain_mat.push('判断结果是否为最简分数')
        let gcd_num = this.integerGCDfunc(numerator_value, denomiator_value)
        if(gcd_num>1){
            let new_fraction_numerator = numerator_value/gcd_num
            let new_fraction_denominator = denomiator_value/gcd_num
            compute_process_mat.push(['=',[new_fraction_numerator,new_fraction_denominator]])
            compute_explain_mat.push('最终结果转化为最简分数')
        }
        else{
            compute_explain_mat.pop()
            compute_explain_mat.push('计算结果为最简分数')
        }
        return [compute_process_mat, compute_explain_mat]
    }

    FractionPushAmplify =(fraction_mat1, amplify_num1, common_denomiator_mat1, common_denomiator_answer_mat1)=>{
        // 倍率放大插入
        common_denomiator_mat1.push(fraction_mat1[0]+'x'+amplify_num1)
        common_denomiator_mat1.push(fraction_mat1[1]+'x'+amplify_num1)
        common_denomiator_answer_mat1.push(eval(fraction_mat1[0]+'*'+amplify_num1))
        common_denomiator_answer_mat1.push(eval(fraction_mat1[1]+'*'+amplify_num1))
        return [common_denomiator_mat1, common_denomiator_answer_mat1]
    }

    FractionPushInit =(fraction_mat1, common_denomiator_mat1, common_denomiator_answer_mat1)=>{
        // 1x插入
        common_denomiator_mat1.push(fraction_mat1[0])
        common_denomiator_mat1.push(fraction_mat1[1])
        common_denomiator_answer_mat1.push(eval(fraction_mat1[0]))
        common_denomiator_answer_mat1.push(eval(fraction_mat1[1]))
        return [common_denomiator_mat1, common_denomiator_answer_mat1]
    }

    IntegerMultiFraction = (fraction_mat1, fraction_mat2, compute_process_mat, compute_explain_mat)=>{
        let new_numerator = fraction_mat1[0]+'x'+fraction_mat2[0]
        let new_denominator = fraction_mat2[1]
        console.log('--------', compute_process_mat, compute_explain_mat)
        compute_process_mat.push(['=',[new_numerator, new_denominator]])        // 添加注释语句：整数转换同分母计算
        compute_explain_mat.push('整数与分数相乘，分母不变，分子与整数相乘')
        let fraction_numerator = eval(fraction_mat1[0])*eval(fraction_mat2[0])
        let fraction_denominator = eval(fraction_mat2[1])
        compute_process_mat.push(['=',[fraction_numerator,fraction_denominator]])
        compute_explain_mat.push('判断结果是否为最简分数')
        // 调用最大公约数
        let gcd_num = this.integerGCDfunc(fraction_numerator, fraction_denominator)
        if(gcd_num>1){
        // 存在公约数
            let new_fraction_numerator = fraction_numerator/gcd_num
            let new_fraction_denominator = fraction_denominator/gcd_num
            compute_process_mat.push(['=',[new_fraction_numerator,new_fraction_denominator]])
            compute_explain_mat.push('将最终结果化简成最简分数')
        }
        else{
            // 是最简分数
            compute_explain_mat.pop()
            compute_explain_mat.push('得出结果后，判断是最简分数')
        }
        // console.log('--------', compute_process_mat, compute_explain_mat)
        return [compute_process_mat, compute_explain_mat]
    }

    GetLCDNumMat=(num_mat)=>{
        // 获取最小公倍数组
        // 先判定是否为同分母
        let times_mat = []
        times_mat.push(1)
        let lcd_flag = 1
        for (let ii=0;ii<num_mat.length-1;ii++){
            if(num_mat[ii]==num_mat[ii+1]){
                times_mat.push(1)
            }
            else{
                lcd_flag = 0
                break
            }
        }
        if (lcd_flag==1){
            return[lcd_flag, num_mat[0], times_mat]
        }
        let prime_mat = []
        num_mat.forEach((part_num)=>{
            // console.log('单数字质因数分解', part_num)
            prime_mat.push(fraction_cls.GetPrimeFactors(part_num,[]))
        })
        // console.log('多组质因数分解', prime_mat)
        // 寻找多组公共
        let min_lcd_mat = []
        let init_min_lcd_mat = []
        prime_mat.forEach((part_prime_mat,index)=>{
            // console.log('单组质因数', part_prime_mat, index)
            if(index==0){
                part_prime_mat.forEach((part_prime)=>{
                    min_lcd_mat.push(part_prime)
                })
            }
            else{
                // console.log('part_prime_mat', JSON.stringify(part_prime_mat))
                let flag = 1
                let num=0
                while (flag==1&&num<500){
                    // console.log('1------')
                    flag = 0
                    for(let part_idx=0; part_idx<part_prime_mat.length;part_idx++){
                        // 依次对比每一个数据
                        let part_prime=part_prime_mat[part_idx]
                        for(let init_idx=0;init_idx<init_min_lcd_mat.length;init_idx++){
                            let init_num = init_min_lcd_mat[init_idx]
                            if(part_prime==init_num){
                                part_prime_mat.splice(part_idx, 1)
                                init_min_lcd_mat.splice(init_idx, 1)
                                flag = 1
                                break
                            }
                        }
                        if(flag ==1){
                            break
                        }
                        else if(part_idx==part_prime_mat.length-1){
                            flag = 0
                        }
                    }
                    num += 1
                }
                // 插入剩余数据
                part_prime_mat.forEach((part_prime_num)=>{
                    min_lcd_mat.push(part_prime_num)
                })
            }
            init_min_lcd_mat = fraction_cls.copyArr(min_lcd_mat)
        })
        // console.log('最小公约数矩阵', min_lcd_mat)
        let min_lcd_num = 1
        min_lcd_mat.forEach((part_num)=>{
            min_lcd_num *= part_num
        })
        // console.log('最小公约数', min_lcd_num)
        times_mat = []
        num_mat.forEach((num_value)=>{
            times_mat.push(parseInt(min_lcd_num/num_value+0.5))
        })
        // console.log('倍数', times_mat)
        return [lcd_flag, min_lcd_num, times_mat]
    }

    SimplestFractionMat=(process_mat, explain_mat)=>{
        // 化最简分数
        let fraction_numerator = parseInt(eval(process_mat[process_mat.length-1][0][0])+0.1)           // 多余
        let fraction_denominator = parseInt(eval(process_mat[process_mat.length-1][0][1])+0.1)
        let gcd_num = this.integerGCDfunc(fraction_numerator, fraction_denominator)
        // console.log('gcd_num', gcd_num, fraction_numerator, fraction_denominator)
        if(gcd_num>1){
            // 存在公约数
            let new_fraction_numerator = fraction_numerator/gcd_num
            let new_fraction_denominator = fraction_denominator/gcd_num
            process_mat.push([[new_fraction_numerator,new_fraction_denominator]])
            explain_mat.push('结果化简成最简分数')
            return [process_mat, explain_mat]
        }
        else{
            return [process_mat, explain_mat] 
        }

    }

    SimplestFractionNum=(nume_num_str, denomi_num_str)=>{
        // 分子分母化最简分数
        let fraction_numerator = parseInt(eval(nume_num_str)+0.1)           // 多余
        let fraction_denominator = parseInt(eval(denomi_num_str)+0.1)
        let gcd_num = this.integerGCDfunc(fraction_numerator, fraction_denominator)
        // console.log('gcd_num', gcd_num, fraction_numerator, fraction_denominator)
        if(gcd_num>1){
            // 存在公约数
            fraction_numerator = fraction_numerator/gcd_num
            fraction_denominator = fraction_denominator/gcd_num
        }
        return [fraction_numerator, fraction_denominator] 
    }

    FractionAddSubMat = (cal_mat)=>{
        // 获得最小公倍数
        let new_num_mat = []
        for(let ii=0;ii<cal_mat.length;ii=ii+2){
            new_num_mat.push(parseInt(cal_mat[ii][cal_mat[ii].length-1]))
        }
        // console.log('待求分母最小公倍数数组', new_num_mat)
        let [lcd_flag, min_lcd_num, times_mat] = this.GetLCDNumMat(new_num_mat)
        // console.log('最小公倍数求解', lcd_flag, min_lcd_num, times_mat)
        let explain_mat = []        // 讲解过程
        let process_mat = []        // 计算过程
        if(lcd_flag == 1){
            // 同分母直接计算
            // console.log('-----同分母加减法计算-----')
            let numerator_str1 = ''
            cal_mat.forEach((num_mat)=>{
                numerator_str1 += num_mat[0]
            })
            let denominator_str1 = min_lcd_num.toString()
            // console.log('分子分母', numerator_str1, denominator_str1)
            process_mat.push([[numerator_str1, denominator_str1]])
            explain_mat.push('同分母加减法计算，分母不变，所有分子相加减（顺序、符号不变）')
            let numerator_str2 = (eval(numerator_str1)).toString()
            let denominator_str2 = denominator_str1
            // console.log('分子分母', numerator_str2, denominator_str2)
            process_mat.push([[numerator_str2, denominator_str2]])
            explain_mat.push('从左到右依次计算，判断结果是否为最简分数')
            // 判定分子分母是否存在约分
            this.SimplestFractionMat(process_mat, explain_mat)
        }
        else{
            // 异分母先通分再求解
            // console.log('-----异分母加减法计算，先化同分母-----')
            let common_denominator_mat =[]
            for (let ii=0;ii<cal_mat.length;ii++){
                // 依次计算，只有分数何计算符号
                if(cal_mat[ii].length>1){
                    // 分数
                    let part_numerator = eval(cal_mat[ii][0]*times_mat[Math.round(ii/2)])
                    let part_denominator = min_lcd_num
                    common_denominator_mat.push([part_numerator, part_denominator])
                }
                else{
                    common_denominator_mat.push(cal_mat[ii])
                }
            }
            // console.log('化同分母', common_denominator_mat)
            process_mat.push(common_denominator_mat)
            explain_mat.push('异分母加减法，将分数通分成同分母分数')
            // 同分母计算法则
            let numerator_str1 = ''
            common_denominator_mat.forEach((num_mat)=>{
                numerator_str1 += num_mat[0]
            })
            let denominator_str1 = min_lcd_num.toString()
            // console.log('分子分母', numerator_str1, denominator_str1)
            process_mat.push([[eval(numerator_str1), denominator_str1]])
            explain_mat.push('从左到右依次计算，判断结果是否为最简分数')
            // 判定分子分母是否存在约分
            this.SimplestFractionMat(process_mat, explain_mat)

        }
        // console.log('计算过程', process_mat)
        // console.log('讲解过程', explain_mat)
        return [process_mat, explain_mat]
    }
    FractionMulDivTurnMulMat = (cal_mat)=>{
        // 乘除法转换乘法
        let div_flag = 0        // 前组计算除法符号转换标签
        let new_cla_mat = []
        let procee_flag = 0     // 保留计算过程标签
        for(let ii=0;ii<cal_mat.length;ii++){
            // 符号检查
            // console.log('过程', cal_mat[ii])
            if(ii%2==0 && div_flag==0){
                // 数字组、乘号
                // console.log('数字组、乘号')
                new_cla_mat.push(cal_mat[ii])
            }
            else if(ii%2==0 && div_flag==1){
                // 数字组、除号---转换，考虑分数转换后为整数、整数转换为分数的情况
                // console.log('数字组、除号')
                if(cal_mat[ii].length==1){
                    // 整数转换为分数
                    new_cla_mat.push(['1', cal_mat[ii][0]])
                }
                else if(cal_mat[ii].length==2){
                    if(cal_mat[ii][0]==1 || cal_mat[ii][0]=='1'){
                        // 分数转整数
                        new_cla_mat.push([ cal_mat[ii][1]])
                    }
                    else{
                        new_cla_mat.push([cal_mat[ii][1], cal_mat[ii][0]])
                    }
                }
            }
            else{
                // 计算符号
                if((['x', 'X', '×']).indexOf(cal_mat[ii][0])>=0){
                    div_flag = 0
                    new_cla_mat.push(['x'])
                }
                else if ((['÷']).indexOf(cal_mat[ii][0])>=0){
                    div_flag = 1
                    procee_flag = 1
                    new_cla_mat.push(['x'])
                }
            }
        }
        // console.log('数组全换全乘', new_cla_mat)
        return [procee_flag, new_cla_mat]
    }

    NumeDenomiMultiMat =(new_cla_mat)=>{
        // 分数乘法、分子分母相乘字符串
        // 处理 new_cla_mat转换全乘法计算denominator
        let mul_numerator = ''
        let mul_denominator = ''
        for(let ii=0;ii<new_cla_mat.length;ii++){
            // console.log('ii',ii)
            if(ii%2==0){
                // 数字组处理
                if(new_cla_mat[ii].length==1){
                    mul_numerator += new_cla_mat[ii][0]
                    mul_denominator += '1'
                }
                else if (new_cla_mat[ii].length==2){
                    mul_numerator += new_cla_mat[ii][0]
                    mul_denominator += new_cla_mat[ii][1]
                }
            }
            else{
                // 符号组处理
                mul_numerator += 'x'
                mul_denominator += 'x'
            }
        }
        // console.log('组合分子分母', mul_numerator, mul_denominator)
        // console.log('组合分子', mul_numerator.replace(/1x/g, "").replace(/x1/g, ""))
        // console.log('组合分子', mul_denominator.replace(/1x/g, "").replace(/x1/g, ""))
        let lay_num =0
        while (lay_num<10){
            if(mul_denominator.length>1){
                if(mul_denominator[0]=='1' && mul_denominator[1]=='x'){
                    mul_denominator= mul_denominator.substr(2,mul_denominator.length-2)
                }
            }
            if(mul_denominator.length>1){
                if(mul_denominator[mul_denominator.length-2]=='x' && mul_denominator[mul_denominator.length-1]=='1'){
                    mul_denominator= mul_denominator.substr(0,mul_denominator.length-2)
                }
            }
            lay_num += 1
        }
        
        // 并没有解决：1x1x24x1x1的情况
        return [mul_numerator,  mul_denominator.replace(/x1x/g, "")]
    }

    FractionMultiDivMat = (cal_mat)=>{
        let [procee_flag, new_cla_mat] = this.FractionMulDivTurnMulMat(cal_mat)
        console.log('保留计算标志', new_cla_mat, cal_mat)
        let explain_mat = []        // 讲解过程
        let process_mat = []        // 计算过程
        if (procee_flag ==1){
            process_mat.push(new_cla_mat)
            explain_mat.push('乘除法计算，先将除法转换为乘法')
        }
        let  [nume_str, denomi_str]=this.NumeDenomiMultiMat(new_cla_mat)
        console.log('分子分母相乘字符串', nume_str, denomi_str)
        process_mat.push([[nume_str, denomi_str]])
        explain_mat.push('分子分母相乘约分')
        // 得出最简计算结果
        let nume_num_str =nume_str.replace(/x/g, "*").replace(/X/g, "*").replace(/×/g, "*")     // 替换
        let denomi_num_str =denomi_str.replace(/x/g, "*").replace(/X/g, "*").replace(/×/g, "*")
        // 化简
        let [nume_num, denomi_num] = this.SimplestFractionNum(nume_num_str, denomi_num_str)
        console.log('化最简分数', nume_num, denomi_num)
        process_mat.push([[nume_num, denomi_num]])
        explain_mat.push('得出乘除法计算的最简分数结果')
        // console.log('计算过程', process_mat)
        // console.log('讲解过程', explain_mat)
        return [process_mat, explain_mat]
    }

    FractionStandardProcedure=(standard_mat)=>{
        // 借用标准处理算式---可直接调用
        standard_mat = fraction_cls.AppMatTurnStandardMat(standard_mat)
        // console.log('标准答题算式----', JSON.stringify(standard_mat))
        let [algebra_expression, algebra_dict] = fraction_cls.NumEquationTurnAlgebra(standard_mat)      // 标准代数式及，字母对应Key-Value
        // console.log('字母对应key_value', algebra_dict)
        let [algebra_expression_mat, multi_mat] = this.AlgebraMulitProcedure(algebra_expression)
        let writer_expression_mat = this.BracketTurnWriterMat(algebra_expression_mat)
        // console.log('标准展示处理', writer_expression_mat)
        let process_mat = []        // 数字计算过程
        let explain_mat = []        // 文字解析
        let all_process_mat = []    // 全局计算过程
        let all_explain_mat = []    // 全局文字解析过程
        // 第一步
        let init_step_mat = []
        for(let ii=0;ii<writer_expression_mat[0].length;ii++){
            // 直接字符串赋值
            if('A'<=writer_expression_mat[0][ii] && writer_expression_mat[0][ii]<='Z'){
                // 插入字典值
                init_step_mat.push(algebra_dict[writer_expression_mat[0][ii]])
            }
            else{
                // 插入符号
                init_step_mat.push([writer_expression_mat[0][ii]])
            }
        }
        all_process_mat.push(init_step_mat)
        multi_mat.forEach((part_cal_str_mat,cal_idx)=>{
            [process_mat, explain_mat, algebra_dict] = this.PartCalProcess(part_cal_str_mat, algebra_dict)
            // console.log('更新字母对应key_value', part_cal_str_mat, process_mat, explain_mat, algebra_dict)
            // console.log('更新字母对应key_value', part_cal_str_mat)
            // 组装计算过程+文字解析过程
            let step_cal_str = writer_expression_mat[cal_idx]
            let step_cal_str2 = writer_expression_mat[cal_idx+1]
            let start_idx = step_cal_str.indexOf(part_cal_str_mat[0])
            let end_idx = start_idx+part_cal_str_mat[0].length
            // console.log('单行起始字符串', step_cal_str, part_cal_str_mat[0], start_idx, end_idx)
            for(let ii=0; ii<process_mat.length;ii++){
                // 单步处理
                let part_cal_mat = []
                all_explain_mat.push(explain_mat[ii])
                if(ii==process_mat.length-1){
                    // 处理最和一步:括号的变化
                    for(let jj=0;jj<step_cal_str2.length;jj++){
                        // 直接字符串赋值
                        if('A'<=step_cal_str2[jj] && step_cal_str2[jj]<='Z'){
                            // 插入字典值
                            part_cal_mat.push(algebra_dict[step_cal_str2[jj]])
                        }
                        else{
                            // 插入符号
                            part_cal_mat.push([step_cal_str2[jj]])
                        }
                    }
                }
                else{
                    // 过程插入
                    if(process_mat[ii].length == 1){
                        // 本身长度只有1，考虑去括号情形
                        // all_explain_mat.push(explain_mat[ii])
                        for(let jj=0;jj<step_cal_str2.length;jj++){
                            // 直接字符串赋值
                            // console.log('新字母', step_cal_str2[jj], part_cal_str_mat[1])
                            if (step_cal_str2[jj] == part_cal_str_mat[1]){
                                // 新字母
                                part_cal_mat.push(process_mat[ii][0])
                            }
                            else if('A'<=step_cal_str2[jj] && step_cal_str2[jj]<='Z' && step_cal_str2[jj] != part_cal_mat[1]){
                                // 插入字典值
                                part_cal_mat.push(algebra_dict[step_cal_str2[jj]])
                            }
                            else{
                                // 插入符号
                                part_cal_mat.push([step_cal_str2[jj]])
                            }
                        }
                    }
                    else{
                        for(let jj=0;jj<step_cal_str.length;jj++){
                            // console.log('algebra_dict', algebra_dict,step_cal_str[jj])// console.log('原始插入----',jj, start_idx,  end_idx, step_cal_str[jj], algebra_dict)
                            if(start_idx>jj || jj>=end_idx){
                                // 调用未计算字符串// console.log('原始插入-----', step_cal_str[jj],algebra_dict)
                                if('A'<=step_cal_str[jj] && step_cal_str[jj]<='Z'){
                                    // 插入字典值// console.log('未计算', step_cal_str[jj])
                                    part_cal_mat.push(algebra_dict[step_cal_str[jj]])
                                }
                                else{
                                    // 插入符号
                                    part_cal_mat.push([step_cal_str[jj]])
                                }
                            }
                            else{
                                // 调用计算处理过程---单行多列// console.log('process_mat[ii]', process_mat[ii])
                                let single_part = process_mat[ii][jj-start_idx]     // 一组// console.log('single_part', single_part)
                                if (single_part != null){
                                    part_cal_mat.push(single_part) 
                                }
                            }
                        }
                    }
                    // all_explain_mat.push(explain_mat[ii])  // 多余，外层
                }
                all_process_mat.push(part_cal_mat)
            }
        })
        for (let idx=0;idx<all_process_mat.length;idx++){
            console.log('计算过程', JSON.stringify(all_process_mat[idx]))
        }
        console.log('---------\n讲解过程', all_explain_mat)
        return [algebra_expression_mat, multi_mat]
    }

    PartCalProcess=(part_cal_mat, algebra_dict)=>{
        // 单步计算处理判定返回：标准格式处理
        if(part_cal_mat[0].indexOf('-')>=0 ||part_cal_mat[0].indexOf('+')>=0 ){
            // 调用加减法处理
            let cal_mat = this.SetAlgebraValue(part_cal_mat[0],algebra_dict)
            let [process_mat, explain_mat] = this.FractionAddSubMat(cal_mat)
            // console.log('加减法处理process_mat, explain_mat', process_mat, explain_mat)
            algebra_dict[part_cal_mat[1]]=process_mat[process_mat.length-1][0]
            return [process_mat, explain_mat, algebra_dict]
        }
        else{
            // 调用乘除法处理
            let cal_mat = this.SetAlgebraValue(part_cal_mat[0],algebra_dict)
            let [process_mat, explain_mat] = this.FractionMultiDivMat(cal_mat)
            // console.log('乘除法处理process_mat, explain_mat', process_mat, explain_mat)
            algebra_dict[part_cal_mat[1]]=process_mat[process_mat.length-1][0]
            return [process_mat, explain_mat, algebra_dict]
        }
    }

    SetAlgebraValue=(algebra_str, algebra_dict)=>{
        // 设置代数数值
        let cal_mat = []
        for(let ii=0;ii<algebra_str.length;ii++){
            if(algebra_str[ii]>='A' && algebra_str[ii]<='Z'){
                // 字母赋值
                cal_mat.push(algebra_dict[algebra_str[ii]])
            }
            else{
                // 计算符号
                cal_mat.push([algebra_str[ii]])
            }
        }
        // console.log('组装数据', cal_mat)
        return cal_mat
    }

    AlgebraMulitProcedure=(algebra_expression)=>{
        // 代数计算过程
        let algebra_max = fraction_cls.GetMaxAlgebra(algebra_expression)
        // console.log(algebra_expression.match('[(][A-Z+\-x÷]+[A-Z][)]')==null)
        // console.log('初始算式---转换代数式', algebra_expression)
        // console.log('最大算式字母', algebra_max)
        let multi_mat = []
        let algebra_expression_mat = []
        algebra_expression_mat.push(algebra_expression)
        let flag_num = 0 
        while (this.MatchBracket(algebra_expression)!=null && flag_num<10){
            flag_num += 1
            // 存在括弧计算
            let bracket_str = this.MatchBracket(algebra_expression)[0]
            // console.log('bracket_str', bracket_str, algebra_expression)
            let standard_str = bracket_str.substr(1, bracket_str.length-2)
            // console.log('standard_str', standard_str)
            // console.log('加减符号查找', mathstrcaculate.MatchAddSub(standard_str))
            // console.log('乘除符号查找', mathstrcaculate.MatchMulDiv(standard_str))
            let single_process_mat = this.PeerMultiStepProcess(standard_str, algebra_max)
            // console.log('single_process_mat',single_process_mat)
            if (single_process_mat){
                if(single_process_mat[0].length==1){
                    // 连带括弧替换
                    algebra_expression = algebra_expression.replace('('+single_process_mat[2][0]+')',single_process_mat[2][1])
                    multi_mat.push(single_process_mat[2])
                    algebra_expression_mat.push(algebra_expression)
                    algebra_max = single_process_mat[1]
                }
                else{
                    // 替换局部
                    algebra_expression = algebra_expression.replace(single_process_mat[2][0],single_process_mat[2][1])
                    multi_mat.push(single_process_mat[2])
                    algebra_expression_mat.push(algebra_expression)
                    algebra_max = single_process_mat[1]
                }
            }
            else{
                break
            }
        }
        // console.log('多元等式矩阵', multi_mat)
        flag_num = 0 
        while (algebra_expression.length>=3 && flag_num<10){
            flag_num += 1 
            // console.log('-----', algebra_expression, algebra_max)
            let multi_process_mat = this.PeerMultiStepProcess(algebra_expression, algebra_max)
            if(multi_process_mat){
                multi_mat.push(multi_process_mat[2])
                algebra_expression_mat.push(multi_process_mat[0])
                algebra_max = multi_process_mat[1]
                algebra_expression = multi_process_mat[0]
            }
            else{break}
        }
        // console.log('每步算式计算', algebra_expression_mat, multi_mat)
        return [algebra_expression_mat, multi_mat]
    }

    PeerMultiStepProcess=(algebra_expression, algebra_max)=>{
        // 统计多步处理————只考虑处理一次，记录代数处理关系
        let symbol_level = 0
        let part_expression =''
        for (let ii=0;ii<algebra_expression.length;ii++){
            if(algebra_expression[ii]>='A' && algebra_expression[ii]<='Z'){
                // 字母
                part_expression += algebra_expression[ii]
            }
            else if(this.JudgeSymbolLevel(algebra_expression[ii])>symbol_level){
                // 切换符号
                // part_expression = part_expression[part_expression.length-1]    // 重置
                part_expression = ''
                part_expression += algebra_expression[ii-1]
                part_expression += algebra_expression[ii]
                symbol_level = this.JudgeSymbolLevel(algebra_expression[ii])
            }
            else if(this.JudgeSymbolLevel(algebra_expression[ii])==symbol_level){
                part_expression += algebra_expression[ii]
            }
            else{
                break
            }
        }
        // console.log('提取连续计算一组', part_expression)
        algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
        algebra_expression = algebra_expression.replace(part_expression, algebra_max)
        let multi_equation_mat0 = [part_expression, algebra_max]
        // console.log('替换', algebra_expression, algebra_max, multi_equation_mat0)
        return [algebra_expression, algebra_max, multi_equation_mat0]
    }

    JudgeSymbolLevel=(symbol_str)=>{
        // 判断计算符号优先级
        if((['+','-']).indexOf(symbol_str)>=0){
            return 1
        }
        else if((['x','X','×', '÷']).indexOf(symbol_str)>=0){
            return 2
        }
        else{
            return 0
        }
    }

    MatchBracket =(algebra_expression)=>{
        // 匹配括弧
        return algebra_expression.match('[(][A-Z+\-x÷]+[A-Z][)]')
    }

    BracketTurnWriterStr = (computer_str)=>{
        // 计算机用代数式转换为标准手写代数式，小括号转中括号、转大括号
        // console.log('计算机算式括号转手写括号', computer_str)
        let bracket_flag_mat = []       // '(':1,')':-1
        let bracket_flag_index = []       // '(':1,')':-1
        let bracket_left_index = []     // 左括弧
        let bracket_right_index = []    // 右括弧
        for(let ii=0;ii<computer_str.length;ii++){
            if((['(','（']).indexOf(computer_str[ii])>=0){
                bracket_left_index.push(ii)
                bracket_flag_mat.push(1)
                bracket_flag_index.push(ii)
            }
            else if(([')','）']).indexOf(computer_str[ii])>=0){
                bracket_right_index.push(ii)
                bracket_flag_mat.push(-1)
                bracket_flag_index.push(ii)
            }
        }
        if (bracket_left_index.length == bracket_right_index.length){
            // console.log('括弧对正确', bracket_left_index, bracket_right_index)
            // console.log('括弧标记', bracket_flag_mat,bracket_flag_index)
            // 处理层数标签：1层....N层：判定右括号是否使用过、偶数个处理、求和为0
            if(bracket_left_index.length ==0){
                // 无括号计算
                return computer_str
            }
            let bracket_level = 1   // 初始层数
            let bracket_mat = [] 
            let bracket_used_index = []
            while (bracket_level<10){
                let part_bracket_index = []
                // 删除用过的
                let level_flag = 0
                let max_index = 0
                while (level_flag<10){
                    // console.log('bracket_level', bracket_level, max_index)
                    for(let ii=1; ii<bracket_flag_mat.length;ii++){
                        // console.log('bracket_flag_mat[ii]',bracket_flag_mat[ii-1], bracket_flag_mat[ii],bracket_used_index,bracket_flag_index[ii])
                        if(bracket_flag_mat[ii]==-1 && bracket_flag_mat[ii-1]==1 && 
                            bracket_used_index.indexOf(bracket_flag_index[ii])<0 && 
                            bracket_flag_index[ii-1]>max_index){       // 右括弧处理:未使用
                            let new_index_mat = bracket_flag_mat.splice(ii-1,2)        // slice:不会修改数组本身；splice:修改数组本省
                            let new_index =  bracket_flag_index.splice(ii-1,2)
                            // console.log('采用的mat',new_index_mat, new_index)
                            // console.log('剩下的mat',bracket_flag_mat, bracket_flag_index)
                            if(this.ArraySum(new_index_mat)==0){    // 不用求和，只有相邻两组
                                part_bracket_index.push(new_index)
                                bracket_used_index.push(new_index[0])
                                bracket_used_index.push(new_index[1])
                                max_index = new_index[1]
                                break
                            }
                        }                    
                    }
                    level_flag += 1
                }
                if(part_bracket_index.length>0){
                    bracket_mat.push(part_bracket_index)
                    // console.log('括号等级索引处理',bracket_level,'级', part_bracket_index)
                    // console.log('=======', bracket_flag_mat, bracket_flag_index)
                    bracket_level += 1
                }
                else{
                    break
                }
            }
            // console.log('括号等级索引处理', bracket_mat)
            // 处理真实嵌套括号层数
            let computer_array = computer_str.split('')
            // console.log('computer_array', computer_array)
            for(let level_ii=0; level_ii<bracket_mat.length;level_ii++){
                for (let level_jj=0;level_jj<bracket_mat[level_ii].length;level_jj++){
                    // console.log(bracket_mat[level_ii][level_jj][0], computer_array[bracket_mat[level_ii][level_jj][0]])
                    if(level_ii==0){
                        computer_array[bracket_mat[level_ii][level_jj][0]] = '('
                        computer_array[bracket_mat[level_ii][level_jj][1]] = ')'
                    }
                    else if(level_ii==1){
                        computer_array[bracket_mat[level_ii][level_jj][0]] = '['
                        computer_array[bracket_mat[level_ii][level_jj][1]] = ']'
                    }
                    else if(level_ii>=2){
                        computer_array[bracket_mat[level_ii][level_jj][0]] = '{'
                        computer_array[bracket_mat[level_ii][level_jj][1]] = '}'
                    }
                }
            }
            // console.log('处理字符串',computer_array.join(''))
            return computer_array.join('')
        }
        else{
            console.log('括弧不匹配')
            return false
        }
    }

    BracketTurnWriterMat = (algebra_expression_mat)=>{
        // 计算过程组处理
        // console.log('algebra_expression_mat', algebra_expression_mat)
        let writer_mat = []
        algebra_expression_mat.forEach((computer_str)=>{
            // let computer_str = 'Ax(B+C)-((D-E)÷(F-G)-(H+(I-J)x(N+O))x(K+L)xM)'
            let writer_str = this.BracketTurnWriterStr(computer_str)
            writer_mat.push(writer_str)
        })
        return writer_mat
    }

    ArraySum = (arr)=>{
        // 求和
        let sum = 0;
        arr.forEach(function(val) {
            sum += eval(val);
        }, 0);
        return sum;
    };
}

