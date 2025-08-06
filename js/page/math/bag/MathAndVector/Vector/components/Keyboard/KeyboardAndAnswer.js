import { countBy } from "lodash";
import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Text,
  Platform
} from "react-native";
import { fitHeight, pxToDp, padding_tool } from "../../../../../../../util/tools";
import CustomKeyboard from "./CustomKeyboard";
import topaicTypes from '../../../../../../../res/data/MathTopaicType'
import Cursor  from "../../../../../../../component/math/Keyboard/Cursor";
import { appStyle } from "../../../../../../../theme";


class KeyboardAndAnswer extends PureComponent {
  constructor(props) {
    super(props);
    this.unitBtnArr = this.props.unitBtnArr
    this.CustomKeyboard = null
    this.non_choice_idx = -200
    this.state = {
        init_char_mat:this.haveEqualSign(props.topicType)?[['=']]:[[]],    //等式计算题默认一开始有个等号,
        cursor_idx:[0, this.haveEqualSign(props.topicType)?0:-1, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx], // 行列展示
        fadeInOpacity: new Animated.Value(0),
        showTip:true
    };
  }
componentDidMount(){
    this.props.onRef(this)
    this.loopOpcity()
}
loopOpcity = () => {
    const {fadeInOpacity} = this.state
    const animationArr = Animated.sequence([
        Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        }),
        Animated.timing(fadeInOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        }),
    ]);
    Animated.loop(animationArr).start()
};
haveEqualSign = (type)=>{
    let arr = [topaicTypes.Equation_Calculation]
    return arr.indexOf(type) > -1
}
changeValues = (text)=>{
    if(text === '删除'){
        this.DeleteElement()
        return 
    }
    if(text === '分数'){
        this.InsertFraction()
        return
    }
    if(text === '换行'){
        this.NextLine()
        return
    }
    const {init_char_mat} = this.state
    if (init_char_mat[0].length <= 12) {
        console.log("will insert num: ", init_char_mat, init_char_mat.length)
        this.InsertNum(text)
    }
    this.setState({
    },()=>{
    })
}

NextLine = () => {
    let init_char_mat = JSON.parse(JSON.stringify(this.state.init_char_mat))
    let cursor_idx = JSON.parse(JSON.stringify(this.state.cursor_idx))
    // 添加下一行
    // init_char_mat.splice(cursor_idx[0] + 1, 0, ['='])
    if(this.haveEqualSign(this.props.topicType)){
        init_char_mat.splice(cursor_idx[0] + 1, 0, ['='])
        cursor_idx = [cursor_idx[0] + 1, 0, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx]
    }else{
        init_char_mat.splice(cursor_idx[0] + 1, 0, [])
        cursor_idx = [cursor_idx[0] + 1, -1, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx]
    }
    this.setState({
        init_char_mat,
        cursor_idx
    },()=>{
        this.getFinallyData(JSON.parse(JSON.stringify(init_char_mat)))
    })
}

InsertFraction = () => {
    let init_char_mat = JSON.parse(JSON.stringify(this.state.init_char_mat))
    let cursor_idx = JSON.parse(JSON.stringify(this.state.cursor_idx))
    // console.log('添加分数', cursor_idx, JSON.stringify(init_char_mat))
    if (cursor_idx[2] === this.non_choice_idx && cursor_idx[3] === this.non_choice_idx && cursor_idx[4] === this.non_choice_idx) {
        init_char_mat[cursor_idx[0]].splice(cursor_idx[1] + 1, 0, [[], []])
        cursor_idx[1] += 1
    }
    this.setState({
        init_char_mat,
        cursor_idx
    },()=>{
        this.getFinallyData(JSON.parse(JSON.stringify(init_char_mat)))
    })
}

DeleteElement = () => {
    let init_char_mat = JSON.parse(JSON.stringify(this.state.init_char_mat))
    let cursor_idx = JSON.parse(JSON.stringify(this.state.cursor_idx))
    if (cursor_idx[2] === this.non_choice_idx && cursor_idx[3] === this.non_choice_idx && cursor_idx[4] === this.non_choice_idx) {
        if (cursor_idx[1] >= 0) {
            // 删除元素
            init_char_mat[cursor_idx[0]].splice(cursor_idx[1], 1)
            cursor_idx[1] -= 1
        }
    }
    else if (cursor_idx[2] >= -1) {
        if (cursor_idx[2] >= 0) {
            init_char_mat[cursor_idx[0]][cursor_idx[1]][0].splice(cursor_idx[2], 1)
            cursor_idx[2] -= 1
        }
    }
    else if (cursor_idx[3] >= -1) {
        if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 2) {
            // 分数
            if (cursor_idx[3] >= 0) {
                // console.log('-------分子删除', init_char_mat[cursor_idx[0]][cursor_idx[1]][0])
                init_char_mat[cursor_idx[0]][cursor_idx[1]][0].splice(cursor_idx[3], 1)
                cursor_idx[3] -= 1
            }
        }
        else if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 3) {
            // 带分数
        }
    }
    else if (cursor_idx[4] >= -1) {
        if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 2) {
            // 分数
            if (cursor_idx[4] >= 0) {
                // console.log('-------分子删除', init_char_mat[cursor_idx[0]][cursor_idx[1]][0])
                init_char_mat[cursor_idx[0]][cursor_idx[1]][1].splice(cursor_idx[4], 1)
                cursor_idx[4] -= 1
            }
        }
        else if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 3) {
            // 带分数
        }
    }
    // console.log('删除后', JSON.stringify(init_char_mat))
    if (init_char_mat.length > 1 && init_char_mat[cursor_idx[0]].length < 1) {
        // 为空删除
        init_char_mat.splice(cursor_idx[0], 1)
        if (cursor_idx[0] > 0) {
            cursor_idx = [cursor_idx[0] - 1, init_char_mat[cursor_idx[0] - 1].length - 1, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx]
        }
        else {
            cursor_idx = [0, -1, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx]

        }
    }
    this.setState({
        init_char_mat,
        cursor_idx
    },()=>{
        this.getFinallyData(JSON.parse(JSON.stringify(init_char_mat)))
    })
}

  InsertNum = (num) => {
    let init_char_mat = JSON.parse(JSON.stringify(this.state.init_char_mat))
    let cursor_idx = JSON.parse(JSON.stringify(this.state.cursor_idx))
    // console.log('添加数字',cursor_idx, JSON.stringify(init_char_mat))
    if (cursor_idx[2] === this.non_choice_idx && cursor_idx[3] === this.non_choice_idx && cursor_idx[4] === this.non_choice_idx) {
        init_char_mat[cursor_idx[0]].splice(cursor_idx[1] + 1, 0, num)
        cursor_idx[1] += 1
    }
    else if (cursor_idx[2] >= -1) {
        init_char_mat[cursor_idx[0]][cursor_idx[1]][0].splice(cursor_idx[2] + 1, 0, num)
        cursor_idx[2] += 1
    }
    else if (cursor_idx[3] >= -1) {
        if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 2) {
            // 分数
            // console.log('-------分子添加', init_char_mat[cursor_idx[0]][cursor_idx[1]][0])
            init_char_mat[cursor_idx[0]][cursor_idx[1]][0].splice(cursor_idx[3] + 1, 0, num)
            cursor_idx[3] += 1
        }
        else if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 3) {
            // 带分数
        }
    }
    else if (cursor_idx[4] >= -1) {
        if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 2) {
            // 分数
            // console.log('-------分子添加', init_char_mat[cursor_idx[0]][cursor_idx[1]][0])
            init_char_mat[cursor_idx[0]][cursor_idx[1]][1].splice(cursor_idx[4] + 1, 0, num)
            cursor_idx[4] += 1
        }
        else if (init_char_mat[cursor_idx[0]][cursor_idx[1]].length === 3) {
            // 带分数
        }
    }
    // console.log('添加数字后', JSON.stringify(init_char_mat))
    this.setState({
      init_char_mat,
      cursor_idx
    },()=>{
        this.getFinallyData(JSON.parse(JSON.stringify(init_char_mat)))
    })
}
isMark = (mark)=>{
  let arr = ['+','—','×','÷','(',')','[',']','=','，']
  return arr.indexOf(mark) > -1
}
getFinallyData = (arr)=>{
    // console.log('**************数据',arr)
    let transformaData = []
    let finallyData = []
    let pre_arr = []
    arr.forEach((i,ii)=>{
        i.forEach((c,ci)=>{
            if(this.isMark(c)){
                if(c === '—')c = c.replace('—','-')
                if(pre_arr.length >= 2 && Array.isArray(pre_arr[pre_arr.length-1])){
                    // 输入带分数
                    let len = pre_arr.length
                    let franction_d = [pre_arr.slice(0,len-1).join('').replaceAll('—','-'),pre_arr[len-1][0].join(''),pre_arr[len-1][1].join('').replaceAll('—','-')]
                    transformaData.push(franction_d)
                    transformaData.push([c])
                }else{
                    if(Array.isArray(pre_arr[0])){
                        // 输入分数
                        let franction = [pre_arr[0][0].join('').replaceAll('—','-'),pre_arr[0][1].join('').replaceAll('—','-')]
                        transformaData.push(franction)
                        transformaData.push([c])
                    }else{
                        if(pre_arr.length === 0) {
                            transformaData.push([c])
                        }else{
                            transformaData.push([pre_arr.join('')])
                            transformaData.push([c])
                        }
                    }
                }
                pre_arr = []
            }else{
                pre_arr.push(c)
            }
        })
        if(pre_arr.length > 0){
            if(pre_arr.length >= 2 && Array.isArray(pre_arr[pre_arr.length-1])){
                // 输入带分数
                let len = pre_arr.length
                let franction_d = [pre_arr.slice(0,len-1).join('').replaceAll('—','-'),pre_arr[len-1][0].join(''),pre_arr[len-1][1].join('').replaceAll('—','-')]
                transformaData.push(franction_d)
            }else{
                if(Array.isArray(pre_arr[0])){
                    // 代表输入分数
                    let franction = [pre_arr[0][0].join('').replaceAll('—','-'),pre_arr[0][1].join('').replaceAll('—','-')]
                    transformaData.push(franction)
                }else{
                    transformaData.push([pre_arr.join('')])
                }
            }
            pre_arr = []
        }
        finallyData.push(transformaData)
        transformaData = []
    })
    console.log('::::::finallyData',finallyData,JSON.stringify(finallyData))
    this.props.getAnswer(finallyData)
}
  getTrueOrFalse = (value)=>{
    if(this.unitBtnArr && this.unitBtnArr.length>0){
      for(let i = 0;i<this.unitBtnArr.length;i++){
        if(this.unitBtnArr[i].value === value){
          return true
        }
      }
    }
    return false
  }
  clearData = (nextTopic)=>{
    const {topicType} = this.props
    let valuesList = [[]]
    let cursor_index = -1
    if(!nextTopic && this.haveEqualSign(topicType)){
        valuesList = [['=']]
        cursor_index = 0
    } 
    if(nextTopic && (this.haveEqualSign(nextTopic.displayed_type) || this.haveEqualSign(nextTopic.displayed_type_name))){
        valuesList = [['=']]
        cursor_index = 0
    } 
    this.setState({
        init_char_mat:valuesList,
        cursor_idx:[0, cursor_index, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx],
    },()=>{
        this.getFinallyData(valuesList)
    })
  }
  TouchIdx = (idx) => {
    // console.log('触摸touch_idx', idx)
    // cursor_idx = idx
    // this.CharView(init_char_mat)
    this.setState({
        cursor_idx:idx
    })
}

TouchMatIdx = ([row_idx, col_idx]) => {
    // console.log('触摸touch_idx', row_idx, col_idx)
    this.setState({
        cursor_idx: [row_idx, col_idx, this.non_choice_idx, this.non_choice_idx, this.non_choice_idx]
    })
}

TouchMatFractionIdx = ([row_idx, col_idx, int_idx, numerator_idx, denominator_idx]) => {
    // console.log('分数触摸touch_idx', row_idx, col_idx, int_idx, numerator_idx, denominator_idx) // 整数部分、分子部分、分母部分
    this.setState({
        cursor_idx: [row_idx, col_idx, int_idx, numerator_idx, denominator_idx]
    })
}
  CharView = () => {
    const {cursor_idx,fadeInOpacity} = this.state
    let char_mat = this.state.init_char_mat
    // 字符串展示
    let char_view_mat = []
    let char_height = 30
    let font_size = pxToDp(36)
    let marginLeft = 2
    let loc_mat = []
    let sepecial_color = 'transparent'
    // let sepecial_color = 'red'
    // console.log('========cursor_idx', cursor_idx)
    for (let row_idx = 0; row_idx < char_mat.length; row_idx++) {
        let row_view_mat = []
        let part_row_view_mat = []  // 单组---组合---符号与数字分离
        // 开头添加
        row_view_mat.push(
            (<TouchableOpacity style={[{ height: char_height, width:pxToDp(20),marginLeft: marginLeft, backgroundColor: sepecial_color},appStyle.flexLine]}
                onPress={() => this.TouchMatIdx([row_idx, -1])}
            >
            </TouchableOpacity>)
        )
        if (cursor_idx[0] === row_idx && cursor_idx[1] < 0) {
            row_view_mat.push(
                <Cursor></Cursor>
            )
        }
        for (let idx = 0; idx < char_mat[row_idx].length; idx++) {
            if ((['+', '-', '×', '÷','—']).indexOf(char_mat[row_idx][idx]) >= 0) {
                // 符号类
                // console.log('--------符号类', char_mat[row_idx][idx])
                if (part_row_view_mat.length > 0) {
                    row_view_mat.push(
                        <View style={[appStyle.flexLine]}>
                            {part_row_view_mat}
                        </View>)
                    part_row_view_mat = []
                }
                // 添加符号展示----
                if (idx === cursor_idx[1] && row_idx === cursor_idx[0]) {
                    // 一种 Touch响应
                    row_view_mat.push(
                        (<TouchableOpacity style={[{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent'},appStyle.flexLine]}
                            onPress={() => this.TouchMatIdx([row_idx, idx])}
                        >
                            <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center' }}>
                                {char_mat[row_idx][idx]}
                            </Text>
                        </TouchableOpacity>)
                    )
                    row_view_mat.push(
                        <Cursor></Cursor>
                    )
                }
                else {
                    // 一种 Touch响应
                    row_view_mat.push(
                        (<TouchableOpacity style={[{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent'},appStyle.flexLine]}
                            onPress={() => this.TouchMatIdx([row_idx, idx])}
                        >
                            <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center', marginTop: 0 }}>
                                {char_mat[row_idx][idx]}
                            </Text>
                        </TouchableOpacity>)
                    )
                }
            }
            else {
                if (typeof char_mat[row_idx][idx] === 'object') {
                    // console.log('分数展示', char_mat[row_idx][idx])
                    if (char_mat[row_idx][idx].length === 2) {
                        // 分数
                        // console.log('分数')
                        let numerator_view_mat = []     // 分子
                        if (char_mat[row_idx][idx][0].length < 1) {
                            // 为空添加
                            // console.log('分子空111')
                            numerator_view_mat.push(
                                (<TouchableOpacity style={{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', }}
                                    onPress={() => this.TouchMatFractionIdx([row_idx, idx, this.non_choice_idx, -1, this.non_choice_idx])}
                                >
                                    <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center',minWidth:pxToDp(50) }}></Text>
                                </TouchableOpacity>)
                            )
                        }
                        if (cursor_idx[0] === row_idx && cursor_idx[1] === idx && cursor_idx[3] === -1) {
                            numerator_view_mat.push(
                                <Cursor></Cursor>
                            )
                        }
                        for (let numerator_idx = 0; numerator_idx < char_mat[row_idx][idx][0].length; numerator_idx++) {
                            numerator_view_mat.push(
                                (<TouchableOpacity style={{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', }}
                                    onPress={() => this.TouchMatFractionIdx([row_idx, idx, this.non_choice_idx, numerator_idx, this.non_choice_idx])}
                                >
                                    <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center',}}>
                                        {char_mat[row_idx][idx][0][numerator_idx]}
                                    </Text>
                                </TouchableOpacity>)
                            )
                            if (cursor_idx[0] === row_idx && cursor_idx[1] === idx && cursor_idx[3] === numerator_idx) {
                                numerator_view_mat.push(
                                    <Cursor></Cursor> 
                                )
                            }

                        }
                        let denominator_view_mat = []   // 分母
                        if (char_mat[row_idx][idx][1].length < 1) {
                            // 为空添加
                            // console.log('分母空111')
                            denominator_view_mat.push(
                                (<TouchableOpacity style={{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', }}
                                    onPress={() => this.TouchMatFractionIdx([row_idx, idx, this.non_choice_idx, this.non_choice_idx, -1])}
                                >
                                    <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center' ,minWidth:pxToDp(50)}}></Text>
                                </TouchableOpacity>)
                            )
                        }
                        if (cursor_idx[0] === row_idx && cursor_idx[1] === idx && cursor_idx[4] === -1) {
                            // console.log('分母空112')
                            denominator_view_mat.push(
                                <Cursor></Cursor>
                            )
                        }
                        for (let denominator_idx = 0; denominator_idx < char_mat[row_idx][idx][1].length; denominator_idx++) {
                            denominator_view_mat.push(
                                (<TouchableOpacity style={{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', }}
                                    onPress={() => this.TouchMatFractionIdx([row_idx, idx, this.non_choice_idx, this.non_choice_idx, denominator_idx])}
                                >
                                    <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center' }}>
                                        {char_mat[row_idx][idx][1][denominator_idx]}
                                    </Text>
                                </TouchableOpacity>)
                            )
                            if (cursor_idx[0] === row_idx && cursor_idx[1] === idx && cursor_idx[4] === denominator_idx) {
                                denominator_view_mat.push(
                                    <Cursor></Cursor> 
                                )
                            }
                        }
                        let max_length = char_mat[row_idx][idx][0].length > char_mat[row_idx][idx][1].length ? char_mat[row_idx][idx][0].length : char_mat[row_idx][idx][1].length
                        max_length = max_length > 1 ? max_length : 1
                        part_row_view_mat.push(
                            <View style={{ backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', flexDirection: 'column', marginLeft: marginLeft }}>
                                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', marginTop: -5, }}>
                                    {numerator_view_mat}
                                </View>
                                <View style={{ height: pxToDp(3), width: max_length * font_size * 0.7 * 1.2,minWidth:pxToDp(60), backgroundColor: 'black'}}>
                                </View>
                                <View style={[{backgroundColor: 'transparent' },appStyle.flexLine]}>
                                    {denominator_view_mat}
                                </View>
                            </View>)
                    }
                    else if (char_mat[row_idx][idx].length === 3) {
                        // 带分数
                        // console.log('带分数')
                    }
                    if (cursor_idx[0] === row_idx &&
                        cursor_idx[1] === idx &&
                        cursor_idx[2] === this.non_choice_idx &&
                        cursor_idx[3] === this.non_choice_idx &&
                        cursor_idx[4] === this.non_choice_idx) {
                        part_row_view_mat.push(
                            <Cursor></Cursor>
                        )
                    }
                    // 分数后添加---
                    part_row_view_mat.push(
                        (<TouchableOpacity style={[{ height: char_height, width:pxToDp(15),marginLeft: marginLeft, backgroundColor: sepecial_color},appStyle.flexLine]}
                            onPress={() => this.TouchMatIdx([row_idx, idx])}
                        >
                        </TouchableOpacity>)
                    )
                }
                else {
                    if (idx === cursor_idx[1] && row_idx === cursor_idx[0]) {
                        // 一种 Touch响应
                        part_row_view_mat.push(
                            (<TouchableOpacity style={[{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent'},appStyle.flexLine]}
                                onPress={() => this.TouchMatIdx([row_idx, idx])}
                            >
                                <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center' }}>
                                    {char_mat[row_idx][idx]}
                                </Text>
                            </TouchableOpacity>)
                        )
                        part_row_view_mat.push(
                            <Cursor></Cursor>
                        )
                    }
                    else {
                        // 一种 Touch响应
                        part_row_view_mat.push(
                            (<TouchableOpacity style={[{ height: char_height, marginLeft: marginLeft, backgroundColor: 'transparent'},appStyle.flexLine]}
                                onPress={() => this.TouchMatIdx([row_idx, idx])}
                            >
                                <Text style={{ fontSize: font_size, alignContent: 'center', alignItems: 'center', textAlignVertical: 'center', marginTop: 0 }}>
                                    {char_mat[row_idx][idx]}
                                </Text>
                            </TouchableOpacity>)
                        )
                    }
                }
            }

        }
        if (part_row_view_mat.length > 0) {
            row_view_mat.push(<View style={[appStyle.flexLine]}>
                {part_row_view_mat}
            </View>)
        }
        // 添加每行末尾
        row_view_mat.push(
            <TouchableOpacity style={{ height: char_height, marginLeft: marginLeft, flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => this.TouchMatIdx([row_idx, char_mat[row_idx].length - 1])}
            >
            </TouchableOpacity>
        )
        char_view_mat.push(<View style={[{marginTop: pxToDp(10), width: pxToDp(860), flexWrap: 'wrap' },appStyle.flexLine]}>
            {row_view_mat}
        </View>)
    }
    return char_view_mat
}
  render() {
    const {init_char_mat} = this.state
    const {tip} = this.props
    return (
      <View style={[styles.container]}>
        <View style={[styles.content1]}>
          {init_char_mat[0].length>0?this.CharView():<Text style={[styles.tipText]}>{tip?tip:'请作答'}</Text>}
        </View>
         <CustomKeyboard  changeValues={this.changeValues} onRef={(ref)=>{this.CustomKeyboard = ref}} unitBtnArr={this.props.unitBtnArr} checkBtnArr={this.props.checkBtnArr}></CustomKeyboard>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    content1:{
        backgroundColor:'#fff',
        borderRadius:pxToDp(16),
        paddingRight:pxToDp(20),
        marginBottom:pxToDp(26),
        height:Platform.OS==='android'?pxToDp(67):pxToDp(100)
    },
    tipText:{
        fontSize:pxToDp(36),
        color:'#999',
        paddingLeft:pxToDp(20),
        paddingTop:pxToDp(10)
      }
});
export default KeyboardAndAnswer;
