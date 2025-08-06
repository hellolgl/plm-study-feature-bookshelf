/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import MultiSkillMode from './MultiSkillsFrameAll';


// 数学拓展题型JS类库

class TextParsingCls{
    // 标准文本解析类：同样按照两级分类，对应不同的难度，讲解
    constructor(){      //name,sex,age
        this.name = 'wang'
        this.sex = 'sex'
        this.age = 12
    }

    testfunc = ()=>{
        return '测试文本'
    }

    MultiSpecialElevenText = ()=>{
        let text_mat = []
        text_mat.push(['解析：\n①  一个数乘以11，巧算的方法是，将数字拆解开，首尾的数字不变写在两端，' +
                        '相邻的两个数字相加从左至右依次写在中间（中间的数字“满十”时需要向前一位进一），得出的新数字既是结果。'])

        text_mat.push(['②  ','','，可以先将','','拆解成','','，将','','分别写在两端，再将','','从左至右依次写在中间，其中满十的需要向前一位进一，得到新的数字','','，如下图所示：'])
        return text_mat
    }

    SameHeadEndTenText=()=>{
        let text_mat = []
        text_mat.push(['解析：\n①  两个两位数相乘，若十位数相同，个位数之和等于10，则可以使用巧算。'+
                            '将第一个数的十位加1与第二个数的十位相乘，得出的结果放在前面；'+
                            '再将两数的个位数相乘，结果放在后面，构成一个新的数字，这就是这两个两位数的积。'])

        text_mat.push(['②  观察发现，','','的十位数相同，并且他们的个位数','','之和为10，可以使用巧算的方法进行计算。将',
                        '','的结果','','放在前面；将','','的结果','','放在后面，组成一个新的数字','','，这个数字','','就是','','的结果。'])
        return text_mat
    }

    CountLineText=()=>{
        let text_mat=[]
        text_mat.push(['解析：\n①  数线段时，可以将线段按照端点所在的位置先将最长的线段分割成n条基础线段，'+
                        '基础线段的条数=端点个数-1；然后将相邻基础线段两两组合，其个数应为基础线段条数-1；'+
                        '再将相邻基础线段三三组合，其条数应为两两组合线段条数-1；'+
                        '以此类推，直到最后将所有基础线段组合在一起，条数为1条，将所有组合方式的线段加起来即可，'+
                        '可列式为(n-1)+(n-2)+(n-3)······+2+1=(n-1+1)×(n-1)÷2。'])
        text_mat.push(["②  完成求解过程:" ])
        
        return text_mat
    }
    CountAngleText=()=>{
        let text_mat=[]
        text_mat.push(['解析：\n①  数角时，根据每两根顶点重合的射线可以组成一个角，射线有n根，'+
                        '以相邻的两个射线组合组成一个基础角，基础角个数=射线个数-1；'+
                        '将相邻的基础角两两组合，其个数为基础角个数-1；将相邻的基础角三三组合，其个数为两两组合角个数-1；'+
                        '以此类推，最后将所有基础角组合在一起，其个数为1，将所有组合方式的角个数加起来即可，可列式为'+
                        '可列式为(n-1)+(n-2)+(n-3)······+2+1=(n-1+1)×(n-1)÷2。'])
        text_mat.push(["②  完成求解过程:" ])
        
        return text_mat
    }

    CountTriangleText=()=>{
        let text_mat=[]
        text_mat.push(['解析：\n①  数三角形个数时，可以先数一个小三角形为单位的三角形'+
                        '再数由两个三角形组成的三角形，依次数由三个小三角形、四个小三角形......，最后相加。'+
                        '同时也可参照数线段的方法，三角形的底边上有几条线段时，则对应有几个三角形，利用数线段的方法计算即可，可列式为'+
                        '可列式为(n-1)+(n-2)+(n-3)······+2+1=(n-1+1)×(n-1)÷2。'])
        text_mat.push(["②  完成求解过程:" ])
        return text_mat
    }

    CloseTensText=()=>{
        // 接近整十数
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式，原式中的数都与某个整十数比较接近，先将原式中的数用这个整十数加或减某个数的式子进行替换，'+
                        '得出新的式子后，利用加法交换律整理新式，将整十数放在一起计算，其他数放在一起计算。'])
        text_mat.push(['②观察发现，原式中的','','均离整十数','','很近，将','','分别用含有','','的式子进行替换，可得新的式子','','，将新式利用加法交换律进行整理可得','','，先计算整十数，再加或减剩余的数，得出结果。'])
        return text_mat
    }

    CloseHundredsText=()=>{
        // 接近整百数
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式，原式中的数都与某个整百数比较接近，先将原式中的数用这个整百数加或减某个数的式子进行替换，'+
                        '得出新的式子后，利用加法交换律整理新式，将整百数放在一起计算，其他数放在一起计算。'])
        text_mat.push(['②观察发现，原式中的','','均离整百数','','很近，将','','分别用含有','','的式子进行替换，可得新的式子','','，将新式利用加法交换律进行整理可得','','，先计算整百数，再加或减剩余的数，得出结果。'])
        return text_mat
    }

    NineSnakeText1=()=>{
        // 接近整百数
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式，找到原式中的每个数与哪个整十数离得很近（原式中每个数对应的整十数不必相同），用将原数用整十数减几的形式替换，'+
                        '利用加法交换律将替换后的式子进行整理，先将整十数相加，再减去其他的数得出结果。'])
        text_mat.push(['②观察发现，','','分别与','','很接近，相差均为','','，故将','','分别用','','替换，原式由','','换为','','，整理后可得，','','，先计算','','，再减去','','即可。'])
        return text_mat
    }
    NineSnakeText2=()=>{
        // 接近整百数
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式，找到原式中的每个数与哪个整十数离得很近（原式中每个数对应的整十数不必相同），用将原数用整十数减几的形式替换，'+
                        '利用加法交换律将替换后的式子进行整理，先将整十数相加，再减去其他的数得出结果。'])
        text_mat.push(['②观察发现，','','分别与','','很接近，相差为','','，可将','','分别用','','替换，原式由','','换为','','，整理后可得，','','，先计算','','，再减去','','即可。'])
        return text_mat
    }
    MatchingSumText=()=>{
        // 配对求和--- 前后加
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式中，相邻两数的差值相同，并且首尾依次相加的和相同，可以将相加和相同的两个数分为一组，'+
                        '一共可以分得（原式中数的个数÷2）组，用和乘以组数得到结果。'])
        text_mat.push(['②  观察原式发现，','','相邻两数差值都为','','，并且将首尾依次相加，','','的和都相等，原式中一共','','个数，两两分组可以分得','','组，用和乘以组数即可，可列式为','','。'])
        return text_mat
    }
    MatchingSumText2=()=>{
        // 配对求和---相邻组合
        let text_mat = []
        text_mat.push(['解析：\n①  观察原式，在减数中可以发现，两两之和为整十数，且和相等，'+
                                '根据减法结合律（一个数连续减去两个数，可以先将这两个减数相加，再用被减数减去减数），'+
                                '可以先将和为整十数的减数，两两求和，因为和相同，可以用组数乘以和，再用被减数减去积，得出最终结果。'])
        text_mat.push(['②通过观察发现','','的和为整十数且相等，所以，先利用减法结合律将减数两两分组，数出有','','组和，用组数','','乘以和','','得出所有减数的和','','，再用被减数','','，计算出最终的结果','','。'])
        return text_mat
    }
    MantissaComplementaryText=()=>{
        // 尾数互补
        let text_mat = []
        text_mat.push(['解析：\n①  从尾数去看，找到尾数互补的两个数，将两个尾数互补的数进行相加求和，将所有的和相加求出结果。'])
        text_mat.push(['②观察发现，','','故先将','',',再将他们的结果相加。'])
        return text_mat
    }
}

class BaseProcessCls extends TextParsingCls{
    // 基础函数处理类

    testfunc2 = ()=>{
        return this.testfunc()+',不知道'
    }

    RandNumMat =(min_num, max_num, mat_num, digit_num)=>{
        // 随机数组
        let rand_min = min_num      // 最小值
        let rand_max = max_num      // 最大值
        // digit_num = 1       // 位数 -1：十分位；0：个；1：十；2：百
        // 闭区间
        let new_rand_min = Math.ceil(rand_min/Math.pow(10,digit_num))
        let new_rand_max = Math.floor(rand_max/Math.pow(10,digit_num))
        // console.log('处理', new_rand_max-new_rand_min)
        let data_num = mat_num      // 数组大小
        let data_mat = []
        while (data_mat.length<data_num){
            let rand_num = (Math.floor(Math.random() * (new_rand_max-new_rand_min+1))+new_rand_min)*Math.pow(10, digit_num)
            // console.log('------', rand_num*Math.pow(10, digit_num))
            if (digit_num<0){
                rand_num = Math.round(rand_num*Math.pow(10, Math.abs(digit_num)))/Math.pow(10, Math.abs(digit_num))
            }
            if (data_mat.length<(new_rand_max-new_rand_min)*0.7){
                // 数据长度未满足的情况下
                if(data_mat.indexOf(rand_num)<0){
                    data_mat.push(rand_num)
                }
            }
            else{
                // 满足不重复的数据后直接添加
                data_mat.push(rand_num)
            }
            // flag += 1
        }
        // console.log('区间随机数', JSON.stringify(data_mat))
        return data_mat
    }

    AmendBiasData = (bias_mat)=>{
        // 第一组数据的修正，不能小于0
        if (bias_mat[0]<=0){
            // 替换位置
            let int_idx = -1
            for (let ii=0;ii<bias_mat.length;ii++){
                if (bias_mat[ii]>0){
                    int_idx = ii
                    break
                }
            }
            if(int_idx>0){
                let bias1 = bias_mat[0]
                let bias2 = bias_mat[int_idx]
                bias_mat[0]=bias2
                bias_mat[int_idx]=bias1
            }
            console.log('修正数据', JSON.stringify(bias_mat))
        }
        return bias_mat
    }

    ArithmeticProgression=(min_num, diff_value, data_num)=>{
        // 等差数列
        console.log('等差数列初始条件', min_num, diff_value, data_num)
        let arith_mat = []
        for(let ii=0;ii<data_num;ii++){
            arith_mat.push(min_num+ii*diff_value)
        }
        console.log('等差数列arith_mat', arith_mat)
        return arith_mat
    }
    
    ReverseArithmeticProgression=(num_mat3, match_num)=>{
        // match_num:配对数————————————得到对应配对数的差数组
        let r_arith_mat = []
        num_mat3.forEach((part_value) => {
            r_arith_mat.push(match_num-part_value)
        });
        return r_arith_mat
    }

    LineLocCalculat=(line_height,line_width_mat)=>{
        console.log('线段坐标计算', line_height, line_width_mat)
        let algebra_max = 'A'
        let loc_mat = []
        let loc_algbra = []
        let end_x = 0
        loc_mat.push({'start_x':end_x,'start_y':0, 'end_x':end_x, 'end_y':line_height})
        loc_algbra.push(algebra_max)
        line_width_mat.forEach((part_width)=>{
            end_x += part_width
            loc_mat.push({'start_x':end_x,'start_y':0, 'end_x':end_x, 'end_y':line_height})
            algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
            loc_algbra.push(algebra_max)
        })
        return [loc_mat, loc_algbra]
    }

    TriangleLocCalculat=(line_height,line_width_mat)=>{
        console.log('三角形坐标计算', line_height, line_width_mat)
        let algebra_max = 'A'
        let loc_mat = []
        let loc_algbra = []
        // 设置O点坐标：x
        let all_width = eval(line_width_mat.join('+'))
        let O_loc_x = this.RandNumMat(all_width*0.3,all_width*0.7,1,0)[0]
        let end_x = 0
        loc_mat.push({'start_x':O_loc_x,'start_y':0, 'end_x':end_x, 'end_y':line_height})
        loc_algbra.push(algebra_max)
        line_width_mat.forEach((part_width)=>{
            end_x += part_width
            loc_mat.push({'start_x':O_loc_x,'start_y':0, 'end_x':end_x, 'end_y':line_height})
            algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
            loc_algbra.push(algebra_max)
        })
        return [loc_mat, loc_algbra]
    }

    AngleLocCalculat=(radius_length,angele_mat)=>{
        // 角度计算
        let [O_loc_x,O_loc_y]=[0,0]
        // 对称计算起始角度
        let sum_angle=0
        angele_mat.forEach((part_value)=>{
            sum_angle += part_value
        })
        let rotate_angle = sum_angle/2       // 起始角度 
        let init_x= Math.round((radius_length*Math.cos(rotate_angle /180 *Math.PI))*10)/10
        let init_y= Math.round((radius_length*Math.sin(rotate_angle /180 *Math.PI))*10)/10
        let algebra_max = 'A'
        let loc_mat = []
        let loc_algbra = []
        loc_mat.push({'start_x':O_loc_x,'start_y':O_loc_y, 'end_x':init_x, 'end_y':-init_y})
        loc_algbra.push(algebra_max)
        angele_mat.forEach((part_angle)=>{
            let [new_loc_x, new_loc_y] = this.PointRotate2([O_loc_x,O_loc_y], [init_x,init_y],part_angle)
            loc_mat.push({'start_x':O_loc_x,'start_y':O_loc_y, 'end_x':Math.round(new_loc_x*10)/10, 'end_y':-Math.round(new_loc_y*10)/10})
            algebra_max = String.fromCharCode(algebra_max.charCodeAt()+1)
            loc_algbra.push(algebra_max)
            init_x = new_loc_x
            init_y = new_loc_y
        })
        console.log('角坐标', loc_mat, loc_algbra)
        return [loc_mat, loc_algbra]
    }

    PointRotate2=(fixed_point, rotate_point, rotate_angle)=>{
        // 坐标点绕点旋转、顺时针、逆时针:顺时针添加负号
        // 固定点、旋转点、旋转角度
        // 顺时针
        let rotate_radian = rotate_angle /180 *Math.PI
        let new_x0 = (rotate_point[0]-fixed_point[0])*Math.cos(-rotate_radian) - (rotate_point[1]-fixed_point[1])*Math.sin(-rotate_radian) + fixed_point[0]
        let new_y0 = (rotate_point[0]-fixed_point[0])*Math.sin(-rotate_radian) + (rotate_point[1]-fixed_point[1])*Math.cos(-rotate_radian) + fixed_point[1]
        return [new_x0, new_y0]
    }

    NotRepeatRandNumMat =(min_num, max_num, mat_num, digit_num)=>{
        // 随机不重复数组
        let rand_min = min_num      // 最小值
        let rand_max = max_num      // 最大值
        // digit_num = 1       // 位数 -1：十分位；0：个；1：十；2：百
        // 闭区间
        let new_rand_min = Math.ceil(rand_min/Math.pow(10,digit_num))
        let new_rand_max = Math.floor(rand_max/Math.pow(10,digit_num))
        console.log('处理', new_rand_max-new_rand_min)
        let data_num = mat_num      // 数组大小
        let data_mat = []
        // 生成数据方式2：不同之后，再添加
        // let flag=0 //data_num
        while (data_mat.length<data_num){
            let rand_num = (Math.floor(Math.random() * (new_rand_max-new_rand_min+1))+new_rand_min)*Math.pow(10, digit_num)
            // console.log('------', rand_num*Math.pow(10, digit_num))
            if (digit_num<0){
                rand_num = Math.round(rand_num*Math.pow(10, Math.abs(digit_num)))/Math.pow(10, Math.abs(digit_num))
            }
            if (data_mat.length<(new_rand_max-new_rand_min)){
                // 数据长度未满足的情况下
                if(data_mat.indexOf(rand_num)<0){
                    data_mat.push(rand_num)
                }
            }
            else{
                // 满足不重复的数据后直接添加
                data_mat.push(rand_num)
            }
            // flag += 1
        }
        console.log('区间不重复随机数-------', JSON.stringify(data_mat))
        return data_mat
    }

    NotRepeatRandMatchNumMat =(min_num, max_num, mat_num, match_num)=>{
        // 随机不重复数组
        let rand_min = min_num      // 最小值
        let rand_max = max_num      // 最大值
        // 闭区间
        let new_rand_min = Math.ceil(rand_min/Math.pow(10,0))
        let new_rand_max = Math.floor(rand_max/Math.pow(10,0))
        // console.log('处理', new_rand_max-new_rand_min)
        let data_num = mat_num      // 数组大小
        let data_mat = []
        // 生成数据方式2：不同之后，再添加
        // let flag=0 //data_num
        while (data_mat.length<data_num){
            let rand_num = (Math.floor(Math.random() * (new_rand_max-new_rand_min+1))+new_rand_min)*Math.pow(10, 0)
            // console.log('------', rand_num*Math.pow(10, digit_num))
            // console.log('rand_num------',rand_num)
            if (data_mat.length<Math.ceil((new_rand_max-new_rand_min+1)/2)){
                // 数据长度未满足的情况下
                if(data_mat.indexOf(rand_num)<0){
                    let match_flag = 0
                    data_mat.forEach((part_num)=>{
                        if (part_num+rand_num==match_num){
                            match_flag = 1
                            // break
                        }
                    })
                    if (match_flag==0){
                        data_mat.push(rand_num)
                    }
                }
            }
            else{
                // 满足不重复的数据后直接添加
                // console.log('超出不重复范围')
                data_mat.push(rand_num)
            }
            // flag += 1
        }
        // console.log('区间不重复凑数随机数-------', JSON.stringify(data_mat))
        return data_mat
    }

    ShuffleArray=(arr_value_mat)=>{
        // 取索引数组---打乱数组---得到索引和新的数组
        let arr_idx_mat = this.ArithmeticProgression(0,1,arr_value_mat.length)
        console.log('索引等差', arr_idx_mat)
        let length = arr_idx_mat.length
        let randomIndex=-1
        let temp=[]
        let array_idx_mat = []
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr_idx_mat[randomIndex];
            arr_idx_mat[randomIndex] = arr_idx_mat[length];
            arr_idx_mat[length] = temp
        }
        let new_array_value = []
        arr_idx_mat.forEach((part_idx)=>{
            new_array_value.push(arr_value_mat[part_idx])
        })
        return [arr_idx_mat,new_array_value];
    }

}

export class ExtendClassifyCls extends BaseProcessCls{
    // 分类处理调用函数
    //初始状态
    constructor(props) {
        super(props)
        this.state = {
        r_width:'',
        r_height:'',
        }
    }


    _setName=(r_width,r_height,frame_view)=>{
        this.setState({
            r_width: r_width,
            r_height:r_height,
            frame_view:frame_view,
        });
        console.log('---------', r_width,r_height);
        console.log('frame_view---------', frame_view);
    }

    testfunc3 =()=>{
        return this.testfunc2()
    }

    BaseDictReturn=()=>{
        let stem_dict = {}
        stem_dict['question_stem'] = 'null'
        stem_dict['standard_answer'] = 'null'
        stem_dict['question_graph'] = []
        let explain_dict = {}
        explain_dict['standard_analytical'] = []
        // let data_save_dict = {}     // 数据保存
        // data_save_dict['props_mat'] = []
        let user_data = []    // 数据保存
        return [stem_dict, explain_dict, user_data]
    }

    MainExtendFunc=(extend_requirement_dict)=>{
        // 新增答题和错题的两类选择
        // 'answer_location':'学习'//'错题集'
        // extend_requirement_dict:['primary_classify':'巧算', "secondary_classify":'双11', "diffculty_level":'1']
        // 两级分类：一级分类、二级分类、等级难度/primary_classify, secondary_classify, diffculty_level
        // 分两次返回数据 or 一次返回数据 
        if(extend_requirement_dict['answer_location'] == '学习'){
            // 初始学习阶段生成题目
            if (extend_requirement_dict['primary_classify'] == '巧算'){
                // 调用巧算类
                return this.SmartCalculateClassify(extend_requirement_dict)
            }
            else if(extend_requirement_dict['primary_classify'] == '巧数图形'){
                // 巧数图形
                return this.SmartGraphClassify(extend_requirement_dict)
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location'] == '错题集'){
            // 在错题集中根据已有数据生成
            if (extend_requirement_dict['primary_classify'] == '巧算'){
                // 调用巧算类
                return this.SmartCalculateClassify(extend_requirement_dict)
            }
            else if(extend_requirement_dict['primary_classify'] == '巧数图形'){
                // 巧数图形
                return this.SmartGraphClassify(extend_requirement_dict)
            }
            else{
                return this.BaseDictReturn()
            }
        }
        
    }

    SmartCalculateClassify=(extend_requirement_dict)=>{
        if(extend_requirement_dict['secondary_classify'] == '一个数乘11'){
            // 调用乘法巧算：乘数为11
            return this.MultiSpecialEleven(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify'] == '乘法中的尾数互补'){
            // 调用乘法巧算：十位数相等、个位数相加为10、
            return this.SameHeadEndTen(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify']=='找到基准数'){
            // 多个数相加、接近某个整十数
            return this.CloseTens(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify']=='加法中的凑整问题'){
            // 中间999相加
            return this.NineSnake(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify']=='加法中的配对求和'){
            // 加法中的配对求和
            return this.MatchingSumAdd(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify']=='减法中的配对求和'){
            // 减法中的配对求和
            return this.MatchingSumSub(extend_requirement_dict)
        }
        else if(extend_requirement_dict['secondary_classify']=='加法中的尾数互补'){
            // 尾数互补
            return this.MantissaComplementary(extend_requirement_dict)
        }
        else{
            return this.BaseDictReturn()
        }
    }

    SmartGraphClassify=(extend_requirement_dict)=>{
        if(extend_requirement_dict['secondary_classify'] == '数线段'){
            // 调用乘法巧算：乘数为11
            return this.CountLineSegment(extend_requirement_dict)

        }
        else if(extend_requirement_dict['secondary_classify'] == '数角'){
            // 调用乘法巧算：乘数为11
            return this.CountAngle(extend_requirement_dict)

        }
        else if(extend_requirement_dict['secondary_classify'] == '数三角形'){
            return this.CountTriangle(extend_requirement_dict)
        }
        else{
            return this.BaseDictReturn()
        }
    }

    // 返回数据生成组及对应数据讲解组
    // 具体题目设计组————————特殊11
    MultiSpecialEleven=(extend_requirement_dict)=>{
        // 乘法特殊11---一个数乘11
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                let unit_num =3 // 几位数
                let num1 =  546
                let while_flag = 0 
                while(while_flag<10){
                    let rand_num =  Math.floor(Math.random() * Math.pow(10, unit_num-1)*9)+Math.pow(10, unit_num-1)  
                    if (rand_num%10>0){
                        num1 = rand_num
                        break
                    }
                    while_flag += 1
                }
                let num2 = 11
                let props_mat0 = [0,[num1, num2],this.MultiSpecialElevenText()]       // 某个数 x 11
                console.log('props_mat0-----------', [num1, num2])
                // 组装题目和诊断结果
                let stem_dict = {}
                stem_dict['question_stem'] = num1.toString()+'x'+num2.toString()+'='
                stem_dict['standard_answer'] = (num1*num2).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                // console.log('<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>',<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                let user_data = [0,[num1, num2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                let unit_num =4 // 几位数
                let num1 =  5274
                let while_flag = 0 
                while(while_flag<10){
                    let rand_num =  Math.floor(Math.random() * Math.pow(10, unit_num-1)*9)+Math.pow(10, unit_num-1)  
                    if (rand_num%10>0){
                        num1 = rand_num
                        break
                    }
                    while_flag += 1
                }
                let num2 = 11
                let props_mat0 = [0,[num1, num2],this.MultiSpecialElevenText()]       // 某个数 x 11
                console.log('props_mat0-----------', [num1, num2])
                // 组装题目和诊断结果
                let stem_dict = {}
                stem_dict['question_stem'] = num1.toString()+'x'+num2.toString()+'='
                stem_dict['standard_answer'] = (num1*num2).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                // console.log('<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>',<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                let user_data = [0,[num1, num2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]     
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                let num1 = extend_requirement_dict['user_data'][1][0]
                let num2 = extend_requirement_dict['user_data'][1][1]
                let props_mat0 = [0,[num1, num2],this.MultiSpecialElevenText()]       // 某个数 x 11
                console.log('props_mat0-----------', [num1, num2])
                // 组装题目和诊断结果
                let stem_dict = {}
                stem_dict['question_stem'] = num1.toString()+'x'+num2.toString()+'='
                stem_dict['standard_answer'] = (num1*num2).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                // console.log('<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>',<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                let user_data = [0,[num1, num2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                let num1 = extend_requirement_dict['user_data'][1][0]
                let num2 = extend_requirement_dict['user_data'][1][1]
                let props_mat0 = [0,[num1, num2],this.MultiSpecialElevenText()]       // 某个数 x 11
                console.log('props_mat0-----------', [num1, num2])
                // 组装题目和诊断结果
                let stem_dict = {}
                stem_dict['question_stem'] = num1.toString()+'x'+num2.toString()+'='
                stem_dict['standard_answer'] = (num1*num2).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                // console.log('<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>',<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat0}></MultiSkillMode>)
                let user_data = [0,[num1, num2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]     
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }
    // 头同尾和十
    SameHeadEndTen=(extend_requirement_dict)=>{
        // 乘法中的尾数互补
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let same_num = Math.floor(Math.random() * 8)+2 // 2至9之间的整数
                let ge_num = Math.floor(Math.random() * 9)+1 // 2至9之间的整数
                let num3 = same_num*10 + ge_num
                let num4 = same_num*10 + (10-ge_num)
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 
                let same_num = Math.floor(Math.random() * 8)+2 // 2至9之间的整数
                let ge_num = Math.floor(Math.random() * 7)+2 // 2至8之间的整数
                console.log('ge_num', ge_num)
                let num3 = same_num*10 + ge_num
                let num4 = same_num*10 + (10-ge_num)
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 
                let same_num = Math.floor(Math.random() * 8)+2 // 2至9之间的整数
                let ge_idx = Math.round(Math.random() * 1) // 0或1
                let ge_mat = [1, 9]
                let ge_num = ge_mat[ge_idx] // 1或9之间的整数
                let num3 = same_num*10 + ge_num
                let num4 = same_num*10 + (10-ge_num)
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let num3 = extend_requirement_dict['user_data'][1][0]
                let num4 = extend_requirement_dict['user_data'][1][1]
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 
                let num3 = extend_requirement_dict['user_data'][1][0]
                let num4 = extend_requirement_dict['user_data'][1][1]
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 
                let num3 = extend_requirement_dict['user_data'][1][0]
                let num4 = extend_requirement_dict['user_data'][1][1]
                let props_mat1 = [1,[num3, num4],this.SameHeadEndTenText()]       // 十位数相同、个位数相加为10
                let stem_dict = {}
                stem_dict['question_stem'] = num3.toString()+'x'+num4.toString()+'='
                stem_dict['standard_answer'] = (num3*num4).toString()
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat1}></MultiSkillMode>)
                let user_data = [1,[num3, num4]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            this.BaseDictReturn()
        }
    }
    // 数线段
    CountLineSegment=(extend_requirement_dict)=>{
        // 巧数线段
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let line_height = 3
                let line_num = this.RandNumMat(3,9,1,0)[0]                  // 线段数
                let line_width_mat = this.RandNumMat(10,20,line_num,0)      // 线段值
                console.log('初始线段值', eval(line_width_mat.join('+')))
                while (eval(line_width_mat.join('+'))>91){
                    line_width_mat = this.RandNumMat(7,15,line_num,0) 
                    console.log('新线段值', eval(line_width_mat.join('+')))
                }
                let [loc_mat, loc_algbra] = this.LineLocCalculat(line_height,line_width_mat)      // 计算坐标
                console.log('坐标处理', loc_mat, loc_algbra)
                let props_mat6=['graph-1',[loc_mat, loc_algbra]]            //巧数线段
                let props_mat7=['graph-2',[loc_mat, loc_algbra], this.CountLineText()]
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中有几条线段'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat6}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat7}></MultiSkillMode>)
                let user_data = [line_width_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let line_height = 3
                let line_width_mat = extend_requirement_dict['user_data'][0]     // 线段值
                let line_num = line_width_mat.length               // 线段数
                let [loc_mat, loc_algbra] = this.LineLocCalculat(line_height,line_width_mat)      // 计算坐标
                console.log('坐标处理', loc_mat, loc_algbra)
                let props_mat6=['graph-1',[loc_mat, loc_algbra]]            //巧数线段
                let props_mat7=['graph-2',[loc_mat, loc_algbra], this.CountLineText()]
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中有几条线段'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat6}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat7}></MultiSkillMode>)
                let user_data = [line_width_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }
    // 数角
    CountAngle=(extend_requirement_dict)=>{
        // 巧数角
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let line_num = this.RandNumMat(3,7,1,0)[0]                  // 角数
                let radius_length = 20
                let angele_mat = this.RandNumMat(10,20,line_num,0)      // 角度值
                let [loc_angle_mat, loc_angle_algbra] = this.AngleLocCalculat(radius_length,angele_mat)      // 角组合计算坐标
                let props_mat10=['angle-1',[loc_angle_mat, loc_angle_algbra]]   // 巧数三角形
                let props_mat11=['angle-2',[loc_angle_mat, loc_angle_algbra], this.CountAngleText()]   // 巧数三角形
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中共有几个角'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat10}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat11}></MultiSkillMode>)
                let user_data = [angele_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let radius_length = 20
                let angele_mat = extend_requirement_dict['user_data'][0]     // 角度值
                let line_num = angele_mat.length                // 角数
                let [loc_angle_mat, loc_angle_algbra] = this.AngleLocCalculat(radius_length,angele_mat)      // 角组合计算坐标
                let props_mat10=['angle-1',[loc_angle_mat, loc_angle_algbra]]   // 巧数三角形
                let props_mat11=['angle-2',[loc_angle_mat, loc_angle_algbra], this.CountAngleText()]   // 巧数三角形
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中共有几个角'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat10}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat11}></MultiSkillMode>)
                let user_data = [angele_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }
    // 数三角形
    CountTriangle=(extend_requirement_dict)=>{
        // 巧数三角形
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let line_height = 3
                let line_num = this.RandNumMat(3,6,1,0)[0]                  // 线段数
                let line_width_mat = this.RandNumMat(10,20,line_num,0)      // 线段值
                console.log('初始线段值', eval(line_width_mat.join('+')))
                while (eval(line_width_mat.join('+'))>91){
                    line_width_mat = this.RandNumMat(7,15,line_num,0) 
                    console.log('新线段值', eval(line_width_mat.join('+')))
                }
                let [loc_triangle_mat, loc_triangle_algbra] = this.TriangleLocCalculat(line_height,line_width_mat)      // 计算坐标
                let props_mat8=['triangle-1',[loc_triangle_mat, loc_triangle_algbra]]   // 巧数三角形
                let props_mat9=['triangle-2',[loc_triangle_mat, loc_triangle_algbra], this.CountTriangleText()]   // 巧数三角形
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中共有几个三角形'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat8}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat9}></MultiSkillMode>)
                let user_data = [line_width_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 
                let line_height = 3
                let line_width_mat = extend_requirement_dict['user_data'][0]       // 线段值
                let line_num = line_width_mat.length                 // 线段数
                let [loc_triangle_mat, loc_triangle_algbra] = this.TriangleLocCalculat(line_height,line_width_mat)      // 计算坐标
                let props_mat8=['triangle-1',[loc_triangle_mat, loc_triangle_algbra]]   // 巧数三角形
                let props_mat9=['triangle-2',[loc_triangle_mat, loc_triangle_algbra], this.CountTriangleText()]   // 巧数三角形
                let stem_dict = {}
                stem_dict['question_stem'] = '数出下图中共有几个三角形'
                stem_dict['standard_answer'] = ((line_num+1)*line_num/2).toString()
                stem_dict['question_graph'] = (<MultiSkillMode math_frame_svg0={props_mat8}></MultiSkillMode>)
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat9}></MultiSkillMode>)
                let user_data = [line_width_mat]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }

    CloseTens=(extend_requirement_dict)=>{
        // 找到基准数
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 随机数组---循环产生多题数据
                let rand_min = -3
                let rand_max = 3
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num =Math.floor(Math.random() * 3)+6 // 2至9之间的整数        // 数组大小
                let bias_mat = this.RandNumMat(rand_min, rand_max, data_num, digit_num)
                bias_mat = this.AmendBiasData(bias_mat)     // 数据修正
                // 随机整十数
                let center_num = this.RandNumMat(10, 10, 2, 1)[0]
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseTensText()]
                console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 随机数组---循环产生多题数据
                let rand_min = -4
                let rand_max = 4
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num =Math.floor(Math.random() * 5)+5 // 2至9之间的整数        // 数组大小
                let bias_mat = this.RandNumMat(rand_min, rand_max, data_num, digit_num)
                bias_mat = this.AmendBiasData(bias_mat)     // 数据修正
                // 随机整十数
                let center_num = this.RandNumMat(40, 90, 2, 1)[0]
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseTensText()]
                console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 随机数组---循环产生多题数据
                let rand_min = -9
                let rand_max = 9
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num =Math.floor(Math.random() * 5)+5 // 2至9之间的整数        // 数组大小
                let bias_mat = this.RandNumMat(rand_min, rand_max, data_num, digit_num)
                bias_mat = this.AmendBiasData(bias_mat)     // 数据修正
                // 随机整十数
                let center_num = this.RandNumMat(400, 900, 2, 2)[0]
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseHundredsText()]
                console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 随机数组---循环产生多题数据
                let bias_mat = extend_requirement_dict['user_data'][1][1] 
                // 随机整十数
                let center_num = extend_requirement_dict['user_data'][1][0] 
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseTensText()]
                // console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 随机数组---循环产生多题数据
                let bias_mat = extend_requirement_dict['user_data'][1][1] 
                // 随机整十数
                let center_num = extend_requirement_dict['user_data'][1][0] 
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseTensText()]
                // console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 随机数组---循环产生多题数据
                let bias_mat = extend_requirement_dict['user_data'][1][1] 
                // 随机整十数
                let center_num = extend_requirement_dict['user_data'][1][0] 
                // console.log('center_num', center_num, 'bias_mat', bias_mat)
                let props_mat2=[2,[center_num, bias_mat],this.CloseHundredsText()]
                console.log('props_mat2', props_mat2)
                let stem_dict = {}
                let stem_str = ''
                for(let ii=0;ii<bias_mat.length;ii++){
                    if(ii==0){
                        stem_str += ''
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                    else{
                        stem_str += '+'
                        stem_str += (center_num+bias_mat[ii]).toString()
                    }
                }
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat2}></MultiSkillMode>)
                let user_data = [2,[center_num, bias_mat]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }

    NineSnake=(extend_requirement_dict)=>{
        // 加法中的凑整问题
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 加法巧算999---循环产生多题数据
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num2 =Math.floor(Math.random() * 2)+4 // 2至9之间的整数        // 数组大小
                let same_bias_num = this.RandNumMat(1,3,1,digit_num)    // 随机
                let bias_mat2 = []
                for (let ii=0;ii<data_num2;ii++){
                    // this.RandNumMat(1,1,data_num2,digit_num)    // 尾
                    bias_mat2.push(same_bias_num)
                }
                let bias_mat3 = this.RandNumMat(1,1,data_num2,digit_num)    // 首
                console.log('bias_mat2', bias_mat2)
                console.log('bias_mat3', bias_mat3)
                // 生成数据
                let num_mat = []
                let base_mat =[]
                for(let ii=0;ii<bias_mat2.length;ii++){
                    if(ii<0){
                        num_mat.push(10-bias_mat2[ii])
                    }
                    else{
                        num_mat.push((bias_mat3[ii])*Math.pow(10,ii+1)-bias_mat2[ii])
                        base_mat.push((bias_mat3[ii])*Math.pow(10,ii+1))
                    }
                }
                console.log('计算数据num_mat', num_mat)
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 加法巧算999---循环产生多题数据
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num2 =Math.floor(Math.random() * 2)+4 // 2至9之间的整数        // 数组大小
                let same_bias_num = this.RandNumMat(1,5,1,digit_num)[0]    // 随机
                console.log('same_bias_num', same_bias_num)
                let bias_mat2 = []
                for (let ii=0;ii<data_num2;ii++){
                    // this.RandNumMat(1,1,data_num2,digit_num)    // 尾
                    bias_mat2.push(same_bias_num)
                }
                let head_num = Math.floor(Math.random() * 9)+1      // 1~9
                let bias_mat3 = []    // 首
                for (let ii=0;ii<data_num2;ii++){
                    // this.RandNumMat(1,1,data_num2,digit_num)    // 尾
                    bias_mat3.push(head_num)
                }
                console.log('bias_mat2', bias_mat2)
                console.log('bias_mat3', bias_mat3)
                // 生成数据
                let num_mat = []
                let base_mat =[]
                for(let ii=0;ii<bias_mat2.length;ii++){
                    if(ii<0){
                        num_mat.push(10-bias_mat2[ii])
                    }
                    else{
                        num_mat.push((bias_mat3[ii])*Math.pow(10,ii+1)-bias_mat2[ii])
                        base_mat.push((bias_mat3[ii])*Math.pow(10,ii+1))
                    }
                }
                console.log('计算数据num_mat', num_mat)
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 加法巧算999---循环产生多题数据
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num2 =Math.floor(Math.random() * 2)+4 // 2至9之间的整数        // 数组大小
                let same_bias_num = this.RandNumMat(1,3,1,digit_num)    // 随机
                let bias_mat2 = []
                for (let ii=0;ii<data_num2;ii++){
                    // this.RandNumMat(1,1,data_num2,digit_num)    // 尾
                    bias_mat2.push(same_bias_num)
                }
                let bias_mat3 = this.RandNumMat(1,9,data_num2,digit_num)    // 首
                console.log('bias_mat2', bias_mat2)
                console.log('bias_mat3', bias_mat3)
                // 生成数据
                let num_mat = []
                let base_mat =[]
                for(let ii=0;ii<bias_mat2.length;ii++){
                    if(ii<0){
                        num_mat.push(10-bias_mat2[ii])
                    }
                    else{
                        num_mat.push((bias_mat3[ii])*Math.pow(10,ii+1)-bias_mat2[ii])
                        base_mat.push((bias_mat3[ii])*Math.pow(10,ii+1))
                    }
                }
                console.log('计算数据num_mat', num_mat)
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='4' || extend_requirement_dict['diffculty_level']==4){
                // 加法巧算999---循环产生多题数据
                let digit_num = 0       // 位数 -1：十分位；0：个；1：十；2：百
                let data_num2 =Math.floor(Math.random() * 2)+4 // 2至9之间的整数        // 数组大小
                let bias_mat2 = this.RandNumMat(1,5,data_num2,digit_num)    // 尾
                let bias_mat3 = this.RandNumMat(1,9,data_num2,digit_num)    // 首
                console.log('bias_mat2', bias_mat2)
                console.log('bias_mat3', bias_mat3)
                // 生成数据
                let num_mat = []
                let base_mat =[]
                for(let ii=0;ii<bias_mat2.length;ii++){
                    if(ii<0){
                        num_mat.push(10-bias_mat2[ii])
                    }
                    else{
                        num_mat.push((bias_mat3[ii])*Math.pow(10,ii+1)-bias_mat2[ii])
                        base_mat.push((bias_mat3[ii])*Math.pow(10,ii+1))
                    }
                }
                console.log('计算数据num_mat', num_mat)
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText2()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 加法巧算999---循环产生多题数据
                let num_mat = extend_requirement_dict['user_data'][1][0] 
                let base_mat = extend_requirement_dict['user_data'][1][1] 
                let bias_mat2 = extend_requirement_dict['user_data'][1][2] 
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 加法巧算999---循环产生多题数据
                let num_mat = extend_requirement_dict['user_data'][1][0] 
                let base_mat = extend_requirement_dict['user_data'][1][1] 
                let bias_mat2 = extend_requirement_dict['user_data'][1][2] 
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 加法巧算999---循环产生多题数据
                let num_mat = extend_requirement_dict['user_data'][1][0] 
                let base_mat = extend_requirement_dict['user_data'][1][1] 
                let bias_mat2 = extend_requirement_dict['user_data'][1][2] 
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText1()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='4' || extend_requirement_dict['diffculty_level']==4){
                // 加法巧算999---循环产生多题数据
                let num_mat = extend_requirement_dict['user_data'][1][0] 
                let base_mat = extend_requirement_dict['user_data'][1][1] 
                let bias_mat2 = extend_requirement_dict['user_data'][1][2] 
                let props_mat3=[3,[num_mat, base_mat, bias_mat2], this.NineSnakeText2()]
                let stem_dict = {}
                let stem_str = num_mat.join('+')
                // console.log('stem_str', stem_str, ''+eval(stem_str))
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat3}></MultiSkillMode>)
                let user_data = [3,[num_mat, base_mat, bias_mat2]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }

    MatchingSum=(extend_requirement_dict)=>{
        // 配对求和
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 加法中的配对求和---循环产生多组数据---等差数列
               let min_num = this.RandNumMat(40,90,1,0)[0]     // 初始数
               let diff_value = this.RandNumMat(1,3,1,0)[0]    // 差值
               let data_num4 = this.RandNumMat(3,5,1,0)[0]*2   // 数量
               let num_mat2 = this.ArithmeticProgression(min_num, diff_value, data_num4)
               let props_mat4=[4,[num_mat2, diff_value],this.MatchingSumText()]
               let stem_dict = {}
               let stem_str = num_mat2.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat4}></MultiSkillMode>)
               let user_data = [4,[num_mat2, diff_value]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='12' || extend_requirement_dict['diffculty_level']==12){
               // 减法中的配对求和---大数减小数等差数列
               let pei_num = this.RandNumMat(2,4,1,0)[0]*50
               let min_num_value = 11
               let max_num_value = 29
               let pei_init_num = this.RandNumMat(min_num_value,max_num_value,1,0)[0]      // 起始数
               let data_num5 = this.RandNumMat(4,7,1,0)[0]   // 数量
               let diff_value2 = this.RandNumMat(1,3,1,0)[0]    // 差值
               let num_mat3 = this.ArithmeticProgression(pei_init_num, diff_value2, data_num5)
               let r_num_mat3 = this.ReverseArithmeticProgression(num_mat3, pei_num)
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = this.RandNumMat(2,4,1,0)[0]*1000        // 被减数
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else{
               return this.BaseDictReturn()
           }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 配对求和---循环产生多组数据---等差数列
               let diff_value = extend_requirement_dict['user_data'][1][1]   // 差值
               let num_mat2 = extend_requirement_dict['user_data'][1][0]
               let props_mat4=[4,[num_mat2, diff_value],this.MatchingSumText()]
               let stem_dict = {}
               let stem_str = num_mat2.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat4}></MultiSkillMode>)
               let user_data = [4,[num_mat2, diff_value]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='12' || extend_requirement_dict['diffculty_level']==12){
               // 配对求和---大数减小数等差数列
               let pei_num = extend_requirement_dict['user_data'][1][3]
               let num_mat3 = extend_requirement_dict['user_data'][1][0]
               let r_num_mat3 = extend_requirement_dict['user_data'][1][1]
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = extend_requirement_dict['user_data'][1][2]        // 被减数
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else{
               return this.BaseDictReturn()
           }
        }
        else{
            return this.BaseDictReturn()
        }
        
    }

    MatchingSumAdd=(extend_requirement_dict)=>{
        // 配对求和
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 加法中的配对求和---循环产生多组数据---等差数列
               let min_num = this.RandNumMat(40,90,1,0)[0]     // 初始数
               let diff_value = this.RandNumMat(1,3,1,0)[0]    // 差值
               let data_num4 = this.RandNumMat(3,5,1,0)[0]*2   // 数量
               let num_mat2 = this.ArithmeticProgression(min_num, diff_value, data_num4)
               let props_mat4=[4,[num_mat2, diff_value],this.MatchingSumText()]
               let stem_dict = {}
               let stem_str = num_mat2.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat4}></MultiSkillMode>)
               let user_data = [4,[num_mat2, diff_value]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='12' || extend_requirement_dict['diffculty_level']==12){
               // 减法中的配对求和---大数减小数等差数列
               let pei_num = this.RandNumMat(2,4,1,0)[0]*50
               let min_num_value = 11
               let max_num_value = 29
               let pei_init_num = this.RandNumMat(min_num_value,max_num_value,1,0)[0]      // 起始数
               let data_num5 = this.RandNumMat(4,7,1,0)[0]   // 数量
               let diff_value2 = this.RandNumMat(1,3,1,0)[0]    // 差值
               let num_mat3 = this.ArithmeticProgression(pei_init_num, diff_value2, data_num5)
               let r_num_mat3 = this.ReverseArithmeticProgression(num_mat3, pei_num)
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = this.RandNumMat(2,4,1,0)[0]*1000        // 被减数
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else{
               return this.BaseDictReturn()
           }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 配对求和---循环产生多组数据---等差数列
               let diff_value = extend_requirement_dict['user_data'][1][1]   // 差值
               let num_mat2 = extend_requirement_dict['user_data'][1][0]
               let props_mat4=[4,[num_mat2, diff_value],this.MatchingSumText()]
               let stem_dict = {}
               let stem_str = num_mat2.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat4}></MultiSkillMode>)
               let user_data = [4,[num_mat2, diff_value]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='12' || extend_requirement_dict['diffculty_level']==12){
               // 配对求和---大数减小数等差数列
               let pei_num = extend_requirement_dict['user_data'][1][3]
               let num_mat3 = extend_requirement_dict['user_data'][1][0]
               let r_num_mat3 = extend_requirement_dict['user_data'][1][1]
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = extend_requirement_dict['user_data'][1][2]        // 被减数
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else{
               return this.BaseDictReturn()
           }
        }
        else{
            return this.BaseDictReturn()
        }
        
    }

    MatchingSumSub=(extend_requirement_dict)=>{
        // 配对求和
        if(extend_requirement_dict['answer_location']=='学习'){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
               // 减法中的配对求和---大数减小数等差数列
               let pei_num = this.RandNumMat(2,2,1,0)[0]*10
               let min_num_value = 5
               let max_num_value = 9
               let pei_init_num = this.RandNumMat(min_num_value,max_num_value,1,0)[0]      // 起始数
               let data_num5 = this.RandNumMat(2,4,1,0)[0]   // 数量
               let diff_value2 = this.RandNumMat(1,3,1,0)[0]    // 差值
               let num_mat3 = this.ArithmeticProgression(pei_init_num, diff_value2, data_num5)
               let r_num_mat3 = this.ReverseArithmeticProgression(num_mat3, pei_num)
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = this.RandNumMat(8,10,1,0)[0]*10        // 被减数
               while(minuend_value<=pei_num*data_num5 ){
                    // 重新计算，结果不大于0
                    console.log('计算结果',minuend_value,pei_num*data_num5)
                    // minuend_value = this.RandNumMat(8,10,1,0)[0]*10
                    minuend_value += 10
               }
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 减法中的配对求和---大数减小数等差数列
                let pei_num = this.RandNumMat(2,4,1,0)[0]*50
                let min_num_value = 11
                let max_num_value = 29
                let pei_init_num = this.RandNumMat(min_num_value,max_num_value,1,0)[0]      // 起始数
                let data_num5 = this.RandNumMat(4,7,1,0)[0]   // 数量
                let diff_value2 = this.RandNumMat(1,3,1,0)[0]    // 差值
                let num_mat3 = this.ArithmeticProgression(pei_init_num, diff_value2, data_num5)
                let r_num_mat3 = this.ReverseArithmeticProgression(num_mat3, pei_num)
                console.log('随机等差数据', num_mat3)
                console.log('随机等差数据--反', r_num_mat3, pei_num)
                let minuend_value = this.RandNumMat(2,4,1,0)[0]*1000        // 被减数
                let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
                let stem_dict = {}
                let stem_mat = []
                stem_mat.push(minuend_value)
                num_mat3.forEach((part_value,part_idx)=>{
                    stem_mat.push(part_value)
                    stem_mat.push(r_num_mat3[part_idx])
                })
                let stem_str = stem_mat.join(' - ')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
                let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
           else{
               return this.BaseDictReturn()
           }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
               // 配对求和---大数减小数等差数列
               let pei_num = extend_requirement_dict['user_data'][1][3]
               let num_mat3 = extend_requirement_dict['user_data'][1][0]
               let r_num_mat3 = extend_requirement_dict['user_data'][1][1]
               console.log('随机等差数据', num_mat3)
               console.log('随机等差数据--反', r_num_mat3, pei_num)
               let minuend_value = extend_requirement_dict['user_data'][1][2]        // 被减数
               let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
               let stem_dict = {}
               let stem_mat = []
               stem_mat.push(minuend_value)
               num_mat3.forEach((part_value,part_idx)=>{
                   stem_mat.push(part_value)
                   stem_mat.push(r_num_mat3[part_idx])
               })
               let stem_str = stem_mat.join(' - ')
               // console.log('stem_str------', stem_str)
               // let stem_str = num_mat3.join('+')
               stem_dict['question_stem'] = '计算：'+stem_str
               stem_dict['standard_answer'] = '' + eval(stem_str)
               stem_dict['question_graph'] = []
               let explain_dict = {}
               explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
               let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
               return[stem_dict, explain_dict, user_data]
           }
           else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 配对求和---大数减小数等差数列
                let pei_num = extend_requirement_dict['user_data'][1][3]
                let num_mat3 = extend_requirement_dict['user_data'][1][0]
                let r_num_mat3 = extend_requirement_dict['user_data'][1][1]
                console.log('随机等差数据', num_mat3)
                console.log('随机等差数据--反', r_num_mat3, pei_num)
                let minuend_value = extend_requirement_dict['user_data'][1][2]        // 被减数
                let props_mat5=[5,[num_mat3, r_num_mat3, minuend_value, pei_num], this.MatchingSumText2()]
                let stem_dict = {}
                let stem_mat = []
                stem_mat.push(minuend_value)
                num_mat3.forEach((part_value,part_idx)=>{
                    stem_mat.push(part_value)
                    stem_mat.push(r_num_mat3[part_idx])
                })
                let stem_str = stem_mat.join(' - ')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat5}></MultiSkillMode>)
                let user_data = [5,[num_mat3, r_num_mat3, minuend_value, pei_num]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
           else{
               return this.BaseDictReturn()
           }
        }
        else{
            return this.BaseDictReturn()
        }
        
    }

    MantissaComplementary=(extend_requirement_dict)=>{
        // 加法中的尾数互补
        if(extend_requirement_dict['answer_location']=='学习'){
            console.log('学习题展示-----')
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 配对-----凑数100
                // 产生随机不重复数字
                let norepeat_mat_num = 3
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_hundred_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let match_num_mat = []
                if(match_level=='one_hundred_1'){
                    let while_flag = 0
                    while(while_flag<norepeat_mat_num){
                        let init_num = this.RandNumMat(11,39,1,0)[0]
                        if(init_num%10 != 0){
                            // 非整十数
                            if(match_num_mat.indexOf(init_num)<0){
                                if(match_num_mat.length<10){
                                    // 添加尾数不等
                                    let one_flag = 1
                                    match_num_mat.forEach((part_value)=>{
                                        if(part_value%10 == init_num%10){
                                            one_flag = 0
                                        }
                                    })
                                    if (one_flag ==1){
                                        match_num_mat.push(init_num)
                                        // match_num_mat.push(100-init_num)    // 区间整100
                                        match_num_mat.push(100-init_num)       // 凑100
                                        while_flag += 1
                                    } 
                                }
                                else{
                                    // 直接添加
                                    match_num_mat.push(init_num)
                                    match_num_mat.push(100-init_num) 
                                }
                            }
                        } 
                    }
                }
                // console.log('match_num_mat', match_num_mat)
                let shuffle_mat = this.ShuffleArray(match_num_mat)
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let props_mat12=['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                let norepeat_min_num = 1
                let norepeat_max_num = 9
                let norepeat_mat_num = 3
                let norepeat_digit_num = 0
                let hundreds_digit_mat= this.NotRepeatRandMatchNumMat(1, 8, norepeat_mat_num, 9)
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_hundred_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let match_num_mat = []
                if(match_level=='one_hundred_1'){
                    let while_flag = 0
                    while(while_flag<norepeat_mat_num){
                        let init_num = this.RandNumMat(11,39,1,0)[0]
                        if(init_num%10 != 0){
                            // 非整十数
                            if(match_num_mat.indexOf(init_num)<0){
                                if(match_num_mat.length<10){
                                    // 添加尾数不等
                                    let one_flag = 1
                                    match_num_mat.forEach((part_value)=>{
                                        if(part_value%10 == init_num%10){
                                            one_flag = 0
                                        }
                                    })
                                    if (one_flag ==1){
                                        match_num_mat.push(init_num)
                                        // match_num_mat.push(100-init_num)    // 区间整十数
                                        match_num_mat.push(this.RandNumMat(50,90,1,1)[0]-init_num)
                                        while_flag += 1
                                    } 
                                }
                                else{
                                    // 直接添加
                                    match_num_mat.push(init_num)
                                    match_num_mat.push(this.RandNumMat(50,90,1,1)[0]-init_num) 
                                }
                            }
                        } 
                    }
                }
                // console.log('match_num_mat', match_num_mat)
                let shuffle_mat = this.ShuffleArray(match_num_mat)
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let props_mat12=['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                let norepeat_mat_num = 3
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_thousand_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let match_num_mat = []
                if(match_level=='one_thousand_1'){
                    let while_flag = 0
                    while(while_flag<norepeat_mat_num){
                        let init_num = this.RandNumMat(110,390,1,0)[0]  // 
                        if(init_num%10 != 0 && init_num%100>10){    // 非整十数、中间十位数不为0
                            // 非整十数
                            if(match_num_mat.indexOf(init_num)<0){
                                // 添加尾数不等
                                if(match_num_mat.length<10){
                                    let one_flag = 1
                                    match_num_mat.forEach((part_value)=>{
                                        if(part_value%10 == init_num%10){
                                            one_flag = 0
                                        }
                                    })
                                    if (one_flag ==1){
                                        match_num_mat.push(init_num)
                                        match_num_mat.push(this.RandNumMat(500,900,1,2)[0]-init_num)
                                        while_flag += 1
                                    }
                                }
                                else{
                                    // 直接添加
                                    match_num_mat.push(init_num)
                                    match_num_mat.push(this.RandNumMat(500,900,1,2)[0]-init_num)
                                }
                            }
                        } 
                    }
                }
                // console.log('match_num_mat', match_num_mat)
                let shuffle_mat = this.ShuffleArray(match_num_mat)
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let props_mat12=['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='4' || extend_requirement_dict['diffculty_level']==4){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                let norepeat_mat_num = this.RandNumMat(3,5,1,0)[0]
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_thousand_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let match_num_mat = []
                if(match_level=='one_thousand_1'){
                    let while_flag = 0
                    while(while_flag<norepeat_mat_num){
                        let init_num = 0
                        let rand_digit = this.RandNumMat(1,2,1,0)[0]
                        // console.log('rand_digit', rand_digit)
                        if (rand_digit==1){
                            init_num = this.RandNumMat(11,39,1,0)[0]  // 两位数
                        }
                        else if (rand_digit==2){
                            init_num = this.RandNumMat(110,390,1,0)[0]  // 三位数
                        }
                        
                        if(init_num%10 != 0 && init_num%100>10){    // 非整十数、中间十位数不为0
                            // 非整十数
                            if(match_num_mat.indexOf(init_num)<0){
                                // 添加尾数不等
                                if(match_num_mat.length<10){
                                    let one_flag = 1
                                    match_num_mat.forEach((part_value)=>{
                                        if(part_value%10 == init_num%10){
                                            one_flag = 0
                                        }
                                    })
                                    if (one_flag ==1){
                                        match_num_mat.push(init_num)
                                        let rand_digit2 = this.RandNumMat(1,2,1,0)[0]
                                        if (rand_digit2==1){  // 两位数 整十数
                                            if(rand_digit==1){
                                                // 两位+两位
                                                match_num_mat.push(this.RandNumMat(50,90,1,1)[0]-init_num)
                                            }
                                            else if(rand_digit==2){
                                                // 三位+两位
                                                match_num_mat.push(100-init_num%100)
                                            }
                                        }
                                        else if (rand_digit2==2){  // 三位数 整百数
                                            if(rand_digit==1){
                                                // 两位+三位
                                                match_num_mat.push(this.RandNumMat(200,900,1,2)[0]-init_num)
                                            }
                                            else if(rand_digit==2){
                                                // 三位+三位
                                                match_num_mat.push(this.RandNumMat(500,900,1,2)[0]-init_num)
                                            }
                                        }
                                        while_flag += 1
                                    }
                                }
                                else{
                                    // 直接添加
                                    match_num_mat.push(init_num)
                                    match_num_mat.push(this.RandNumMat(500,900,1,2)[0]-init_num)
                                }
                            }
                        } 
                    }
                }
                // console.log('match_num_mat', match_num_mat)
                let shuffle_mat = this.ShuffleArray(match_num_mat)
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let props_mat12=['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[match_num_mat,shuffle_mat[0],shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else if(extend_requirement_dict['answer_location']=='错题集' && extend_requirement_dict['user_data'].length>0){
            console.log('错题集-----')
            if(extend_requirement_dict['diffculty_level']=='1' || extend_requirement_dict['diffculty_level']==1){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_hundred_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let user_match_num_mat = extend_requirement_dict['user_data'][1][0]
                let user_shuffle_mat = [extend_requirement_dict['user_data'][1][1],extend_requirement_dict['user_data'][1][2]]
                let props_mat12=['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = user_shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='2' || extend_requirement_dict['diffculty_level']==2){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_hundred_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                // console.log('ShuffleArray', JSON.stringify(shuffle_mat))
                let user_match_num_mat = extend_requirement_dict['user_data'][1][0]
                let user_shuffle_mat = [extend_requirement_dict['user_data'][1][1],extend_requirement_dict['user_data'][1][2]]
                let props_mat12=['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = user_shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='3' || extend_requirement_dict['diffculty_level']==3){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_thousand_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let user_match_num_mat = extend_requirement_dict['user_data'][1][0]
                let user_shuffle_mat = [extend_requirement_dict['user_data'][1][1],extend_requirement_dict['user_data'][1][2]]
                let props_mat12=['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = user_shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else if(extend_requirement_dict['diffculty_level']=='4' || extend_requirement_dict['diffculty_level']==4){
                // 配对、凑整、凑十、凑百、凑千求和
                // 产生随机不重复数字
                let norepeat_mat_num = this.RandNumMat(3,5,1,0)[0]
                // 根据情况设计：整十数：30~90、整百：100，200~900；整千：1000，2000~9000；
                // 两位数加两位数得到：整十数和100
                // 两位数+三位数、三位数+三位数：得到整百；
                // 三位数数加三位数得：1000
                // 三位数+四位数、四位数+四位数：得到整千
                let match_level = 'one_thousand_1'     // 'one_hundred' 'one_thousand' 'tens' 'hundreds' 'thousands'
                let user_match_num_mat = extend_requirement_dict['user_data'][1][0]
                let user_shuffle_mat = [extend_requirement_dict['user_data'][1][1],extend_requirement_dict['user_data'][1][2]]
                let props_mat12=['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]],this.MantissaComplementaryText()]
                let stem_dict = {}
                let stem_str = user_shuffle_mat[1].join('+')
                // console.log('stem_str------', stem_str)
                // let stem_str = num_mat3.join('+')
                stem_dict['question_stem'] = '计算：'+stem_str
                stem_dict['standard_answer'] = '' + eval(stem_str)
                stem_dict['question_graph'] = []
                let explain_dict = {}
                explain_dict['standard_analytical'] = (<MultiSkillMode math_frame_svg0={props_mat12}></MultiSkillMode>)
                let user_data = ['end_complementary',[user_match_num_mat,user_shuffle_mat[0],user_shuffle_mat[1]]]  // 数据存储用
                return[stem_dict, explain_dict, user_data]
            }
            else{
                return this.BaseDictReturn()
            }
        }
        else{
            return this.BaseDictReturn()
        }
    }

}