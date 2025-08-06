/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {PureComponent, Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    PanResponder,
} from 'react-native';

import {
  Shape,
  Surface,
  Path,
  LinearGradient,
  Group,
//   Text,
} from '@react-native-community/art';

import Svg,{
  Circle,
  Ellipse,
  G,
  // LinearGradient,
  RadialGradient,
  Line,
  // Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Text,
  Stop,
  TSpan
} from 'react-native-svg';
//获取屏幕的宽高
const {width, height} = Dimensions.get('window');
let tspan_mat = []
for(let ii=0;ii<4;ii++){
    let row_mat = []
    for(let jj=0;jj<4;jj++){
        // 
        row_mat.push('0')
    }
    tspan_mat.push(row_mat)
}
// 通过函数定义
tspan_mat[0][0] = {'dx':"0 -10 -10", 'dy':"-10 10 10"}
tspan_mat[0][1] = {'dx':"4 -14 -2 -18", 'dy':"-10 10  0 10"}
tspan_mat[0][2] = {'dx':"10 -18 -2 -2 -25", 'dy':"-10 10  0 0 10"}
tspan_mat[0][3] = {'dx':"13 -22 -2 -2 -4 -36", 'dy':"-10 10  0 0 0 10"}
tspan_mat[1][0] = {'dx':"0 0 -18 -2 -14", 'dy':"-10 0 10  0 10"}
tspan_mat[1][1] = {'dx':"0 0 -18 -2 -18", 'dy':"-10 0 10  0 10"}
tspan_mat[1][2] = {'dx':"6 0 -23 -2 -4 -25", 'dy':"-10 0 10  0 0 10"}
tspan_mat[1][3] = {'dx':"9 0 -26 -2 -2 -6 -32", 'dy':"-10 0 10 0 0 0 10"}
tspan_mat[2][0] = {'dx':"0 0 0 -25 -2 -2 -20", 'dy':"-10 0 0 10 0 0 10"}
tspan_mat[2][1] = {'dx':"0 0 0 -25 -2 -2 -23", 'dy':"-10 0 0 10 0 0 10"}
tspan_mat[2][2] = {'dx':"0 0 0 -25 -2 -2 -27", 'dy':"-10 0 0 10 0 0 10"}
tspan_mat[2][3] = {'dx':"6 0 0 -30 -2 -2 -4 -34", 'dy':"-10 0 0 10 0 0 0 10"}
tspan_mat[3][0] = {'dx':"0 0 0 0 -32 -2 -2 -4 -23", 'dy':"-10 0 0 0 10 0 0 0 10"}
tspan_mat[3][1] = {'dx':"0 0 0 0 -32 -2 -2 -4 -27", 'dy':"-10 0 0 0 10 0 0 0 10"}
tspan_mat[3][2] = {'dx':"0 0 0 0 -32 -2 -2 -4 -31", 'dy':"-10 0 0 0 10 0 0 0 10"}
tspan_mat[3][3] = {'dx':"0 0 0 0 -33 -2 -3 -3 -34", 'dy':"-10 0 0 0 10 0 0 0 10"}
// //console.log('tspan_mat', tspan_mat)

export default class MathFrameView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //用于更新界面
            lastX: 0,

        };

        //每次移动的临时数组
        this.MousePostion = {
            firstX:0, //起点 X 坐标
            firstY:0,// 起点 Y 坐标
            x: 0,   //经过路径的x坐标
            y: 0    //经过路径的y坐标
        }
        //path 全部路径数组
        this.MousePostions = []
    }

    // 防止多次无效render
    shouldComponentUpdate(nextProps) {
        let num1 = this.props.math_frame_svg0[3]
        let num2 = nextProps.math_frame_svg0[3]
        const isRender = num1 !== num2
        return isRender
    }

    getgroupbinaryloc = (parent_mat, children_width_mat, children_height_mat, symbol_width_mat, symbol_height_mat, gap_mat, global_mat, group_color)=>{
        // 二叉树数据坐标计算
        // 单组框图结构建立：三元关系：子结构可推广到多元A+BxC÷D=E 
        let unit_binary_mat = []
        unit_binary_mat.parent=[]                   // 父
        unit_binary_mat.parent.width = parent_mat[0];         // 父框图宽度-----需要根据字符串长度设计确定
        unit_binary_mat.parent.height = parent_mat[1];         // 父框图高度-----
        unit_binary_mat.children=[]                 // 子
        unit_binary_mat.children.width=children_width_mat    // 子框图宽度数组-----需根据字符在长度整体设计确定
        unit_binary_mat.children.height=children_height_mat
        unit_binary_mat.symbol=[]                   // 符号
        unit_binary_mat.symbol.width=symbol_width_mat           // 符号宽度
        unit_binary_mat.symbol.height=symbol_height_mat          // 符号高度
        unit_binary_mat.color= group_color                // 整体颜色
        unit_binary_mat.gap_x = gap_mat[0]                  // 组件间隔横向x
        unit_binary_mat.gap_y = gap_mat[1]                  // 组件间隔纵向y
        unit_binary_mat.global_x = global_mat[0]                  // 组件间隔横向x
        unit_binary_mat.global_y = global_mat[1]                   // 组件间隔纵向y
        // 计算整体组件高度和宽度
        ////console.log('取最大子组件高度', Math.max.apply(null,unit_binary_mat.children.height))
        let max_children_height = Math.max.apply(null,unit_binary_mat.children.height)
        unit_binary_mat.group_height = Math.max.apply(null,unit_binary_mat.children.height) + unit_binary_mat.gap_y + unit_binary_mat.parent.height   //组高度
        unit_binary_mat.group_width = eval(unit_binary_mat.children.width.join("+")) +      // 后期用求和公式
                                      eval(unit_binary_mat.symbol.width.join("+"))+
                                      unit_binary_mat.gap_x*(unit_binary_mat.children.width.length+unit_binary_mat.symbol.width.length-1)
        // 计算每个组件按父子结构、子父结构计算中点坐标：上、中、下、右、左存储，以及组件起始位置：左上角。用于绘图和连线。
        unit_binary_mat.parentTochildren=[]       // 上父下子结构数据
        unit_binary_mat.parentTochildren.parent_loc = []    // 上父下子结构数据:父组件坐标
        unit_binary_mat.parentTochildren.parent_loc.box_center_loc = [unit_binary_mat.group_width/2, unit_binary_mat.parent.height/2+1]   // center_x, center_y
        unit_binary_mat.parentTochildren.parent_loc.up_center_loc = [unit_binary_mat.group_width/2, 1]   // up_center_x, up_center_y
        unit_binary_mat.parentTochildren.parent_loc.down_center_loc = [unit_binary_mat.group_width/2, unit_binary_mat.parent.height]   // down_center_x, down_center_y
        unit_binary_mat.parentTochildren.parent_loc.box_start_loc = [unit_binary_mat.group_width/2-unit_binary_mat.parent.width/2+1, 1]   // 起始坐标
        // 依次循环计算子框坐标
        unit_binary_mat.parentTochildren.children_loc = []                  // 上父下子结构数据:子组件坐标
        unit_binary_mat.parentTochildren.children_loc.box_center_loc = []   // center_x, center_y
        unit_binary_mat.parentTochildren.children_loc.up_center_loc = []    // up_center_x, up_center_y
        unit_binary_mat.parentTochildren.children_loc.down_center_loc = []   // down_center_x, down_center_y
        unit_binary_mat.parentTochildren.children_loc.box_start_loc = []    // 起始坐标
        unit_binary_mat.parentTochildren.symbol_loc = []                    // 上父下子结构数据:子组件坐标
        unit_binary_mat.parentTochildren.symbol_loc.box_center_loc = []     // center_x, center_y
        unit_binary_mat.parentTochildren.symbol_loc.up_center_loc = []      // up_center_x, up_center_y
        unit_binary_mat.parentTochildren.symbol_loc.down_center_loc = []    // down_center_x, down_center_y
        unit_binary_mat.parentTochildren.symbol_loc.box_start_loc = []      // 起始坐标
        for (let ii=0;ii<unit_binary_mat.children.width.length;ii++){
          //依次计算每组
          let [part_box_center_loc_x, part_box_center_loc_y] = [0, 0]
          let [part_up_center_loc_x, part_up_center_loc_y] = [0, 0]
          let [part_down_center_loc_x, part_down_center_loc_y]= [0, 0]
          let [part_box_start_loc_x, part_box_start_loc_y]= [0, 0]
          let [symbol_part_box_center_loc_x, symbol_part_box_center_loc_y] = [0, 0]
          let [symbol_part_up_center_loc_x, symbol_part_up_center_loc_y] = [0, 0]
          let [symbol_part_down_center_loc_x, symbol_part_down_center_loc_y]= [0, 0]
          let [symbol_part_box_start_loc_x, symbol_part_box_start_loc_y]= [0, 0]
          if(ii==0){
            part_box_center_loc_x = unit_binary_mat.children.width[ii]/2                                  // 第一组：自身半宽
            part_box_center_loc_y = unit_binary_mat.group_height - max_children_height/2                  // 全局高度-最大子组件高度/2
            part_up_center_loc_x = part_box_center_loc_x                                                  // 同一x
            part_up_center_loc_y = part_box_center_loc_y-unit_binary_mat.children.height[ii]/2            // 中心高度-自半高
            part_down_center_loc_x =  part_box_center_loc_x                                               // 同一x
            part_down_center_loc_y =  part_box_center_loc_y + unit_binary_mat.children.height[ii]/2       // 中心高度+自半高
            part_box_start_loc_x = part_box_center_loc_x - unit_binary_mat.children.width[ii]/2           // 中心x减自半宽
            part_box_start_loc_y = part_up_center_loc_y                                                   // 同中上高
            unit_binary_mat.parentTochildren.children_loc.box_center_loc.push([part_box_center_loc_x, part_box_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.up_center_loc.push([part_up_center_loc_x, part_up_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.down_center_loc.push([part_down_center_loc_x, part_down_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.box_start_loc.push([part_box_start_loc_x, part_box_start_loc_y])
          }
          else{
            part_box_center_loc_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[ii-1][0]+unit_binary_mat.children.width[ii-1]/2+   // 上组件最右端值
                                    unit_binary_mat.children.width[ii]/2 + unit_binary_mat.gap_x*2 + unit_binary_mat.symbol.width[ii-1]             // 自身半宽度、符号宽度和两个间隔
            part_box_center_loc_y = unit_binary_mat.group_height - max_children_height/2
            part_up_center_loc_x = part_box_center_loc_x
            part_up_center_loc_y = part_box_center_loc_y-unit_binary_mat.children.height[ii]/2
            part_down_center_loc_x =  part_box_center_loc_x
            part_down_center_loc_y =  part_box_center_loc_y + unit_binary_mat.children.height[ii]/2
            part_box_start_loc_x = part_box_center_loc_x - unit_binary_mat.children.width[ii]/2
            part_box_start_loc_y = part_up_center_loc_y
            unit_binary_mat.parentTochildren.children_loc.box_center_loc.push([part_box_center_loc_x, part_box_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.up_center_loc.push([part_up_center_loc_x, part_up_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.down_center_loc.push([part_down_center_loc_x, part_down_center_loc_y])
            unit_binary_mat.parentTochildren.children_loc.box_start_loc.push([part_box_start_loc_x, part_box_start_loc_y])
            // 
            symbol_part_box_center_loc_x =  unit_binary_mat.parentTochildren.children_loc.box_center_loc[ii-1][0]+unit_binary_mat.children.width[ii-1]/2+   // 上组件最右端值
                                            unit_binary_mat.gap_x + unit_binary_mat.symbol.width[ii-1]/2
            symbol_part_box_center_loc_y = unit_binary_mat.group_height - max_children_height/2
            symbol_part_up_center_loc_x = symbol_part_box_center_loc_x
            symbol_part_up_center_loc_y = symbol_part_box_center_loc_y-unit_binary_mat.symbol.height[ii-1]/2
            symbol_part_down_center_loc_x =  symbol_part_box_center_loc_x
            symbol_part_down_center_loc_y =  symbol_part_box_center_loc_y + unit_binary_mat.symbol.height[ii-1]/2
            symbol_part_box_start_loc_x = symbol_part_box_center_loc_x - unit_binary_mat.symbol.width[ii-1]/2
            symbol_part_box_start_loc_y = symbol_part_up_center_loc_y
            unit_binary_mat.parentTochildren.symbol_loc.box_center_loc.push([symbol_part_box_center_loc_x, symbol_part_box_center_loc_y])
            unit_binary_mat.parentTochildren.symbol_loc.up_center_loc.push([symbol_part_up_center_loc_x, symbol_part_up_center_loc_y])
            unit_binary_mat.parentTochildren.symbol_loc.down_center_loc.push([symbol_part_down_center_loc_x, symbol_part_down_center_loc_y])
            unit_binary_mat.parentTochildren.symbol_loc.box_start_loc.push([symbol_part_box_start_loc_x, symbol_part_box_start_loc_y])
          }
        }
        return unit_binary_mat
    }

    getgroupbinarySVG = (unit_binary_mat, fill_color)=>{
        // 组合展示-----父子模式
        // 画父组件-----
        let binary_mat = []
        let parent_binary = <Rect x={unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x} 
                                  y={unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y} 
                                  width={unit_binary_mat.parent.width} 
                                  height={unit_binary_mat.parent.height} 
                                  rx={10} 
                                  ry={10} 
                                  stroke={unit_binary_mat.color} 
                                  fill={fill_color}
                                  strokeWidth="2"/>
        binary_mat.push(parent_binary)
        // 画子组件
        for(let ii=0;ii<unit_binary_mat.parentTochildren.children_loc.box_start_loc.length;ii++){
          let children_binary = <Rect x={unit_binary_mat.parentTochildren.children_loc.box_start_loc[ii][0]+unit_binary_mat.global_x} 
                                      y={unit_binary_mat.parentTochildren.children_loc.box_start_loc[ii][1]+unit_binary_mat.global_y} 
                                      width={unit_binary_mat.children.width[ii]} 
                                      height={unit_binary_mat.children.height[ii]} 
                                      rx={10} 
                                      ry={10} 
                                      stroke={unit_binary_mat.color} 
                                      fill={fill_color} 
                                      strokeWidth="2"/>
          binary_mat.push(children_binary)
          let line_binary = <Line x1={unit_binary_mat.parentTochildren.parent_loc.down_center_loc[0]+unit_binary_mat.global_x} 
                                  y1={unit_binary_mat.parentTochildren.parent_loc.down_center_loc[1]+unit_binary_mat.global_y} 
                                  x2={unit_binary_mat.parentTochildren.children_loc.up_center_loc[ii][0]+unit_binary_mat.global_x} 
                                  y2={unit_binary_mat.parentTochildren.children_loc.up_center_loc[ii][1]+unit_binary_mat.global_y} 
                                  stroke={unit_binary_mat.color} 
                                  strokeWidth='2'
                                  ></Line>
          binary_mat.push(line_binary)
        }
        // 画计算符号
        for(let ii=0;ii<unit_binary_mat.parentTochildren.symbol_loc.box_start_loc.length;ii++){
          let symbol_binary = <Rect x={unit_binary_mat.parentTochildren.symbol_loc.box_start_loc[ii][0]+unit_binary_mat.global_x} 
                                    y={unit_binary_mat.parentTochildren.symbol_loc.box_start_loc[ii][1]+unit_binary_mat.global_y} 
                                    width={unit_binary_mat.symbol.width[ii]} 
                                    height={unit_binary_mat.symbol.height[ii]} 
                                    rx={10} 
                                    ry={10} 
                                    stroke={unit_binary_mat.color} 
                                    fill={fill_color} 
                                    strokeWidth="2"/>
          binary_mat.push(symbol_binary)
        }
        return binary_mat
    }

    setgroupbinarySVG=(unit_binary_mat, [parent_text, children_text, symbol_text], group_color) =>{
        // 设置 文字SVG
        let binary_text=[]
        // 父组件填写文字
        let parent_svg = <Text  x={unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+20} 
                                y={unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+20} 
                                fill={group_color} 
                                backgroundColor='black' 
                                width={unit_binary_mat.parent.width} 
                                height={unit_binary_mat.parent.height} 
                                fontSize = '14'>{parent_text}</Text>
        binary_text.push(parent_svg)
        // 子组件填写文字
        for(let ii=0;ii<children_text.length;ii++){
            let children_svg = <Text  x={unit_binary_mat.parentTochildren.children_loc.box_start_loc[ii][0]+unit_binary_mat.global_x+20} 
                                    y={unit_binary_mat.parentTochildren.children_loc.box_start_loc[ii][1]+unit_binary_mat.global_y+20} 
                                    fill={group_color}
                                    backgroundColor='black' 
                                    width={unit_binary_mat.parent.width} 
                                    height={unit_binary_mat.parent.height} 
                                    fontSize = '14'>{children_text[ii]}</Text>
            binary_text.push(children_svg)
        }
        // 符号位置填写文字
        for(let ii=0;ii<symbol_text.length;ii++){
            let children_svg = <Text  x={unit_binary_mat.parentTochildren.symbol_loc.box_start_loc[ii][0]+unit_binary_mat.global_x+10} 
                                    y={unit_binary_mat.parentTochildren.symbol_loc.box_start_loc[ii][1]+unit_binary_mat.global_y+20} 
                                    fill={group_color}
                                    // fill='lime'
                                    backgroundColor='black' 
                                    width={unit_binary_mat.parent.width} 
                                    height={unit_binary_mat.parent.height} 
                                    fontSize = '20'>{symbol_text[ii]}</Text>
            binary_text.push(children_svg)
        }
        return binary_text
    } 

    textgroupbinarySVG = (unit_binary_mat, [parent_text, children_text, symbol_text], group_color, algebra_value)=>{
        // 组件放置文本
        // 设置 文字SVG
        let binary_text=[]
        let font_size = 14
        // 父组件填写文字
        let parent_svg = [] 
        let [[parent_frame_min_x,parent_frame_max_x,parent_frame_min_y,parent_frame_max_y], parent_row_txt_loc_c, parent_row_txt_loc_lt, parent_row_txt_loc_rb] = 
            this.CalculateCharLoc(parent_text, algebra_value)
        ////console.log('======父组件字符分解', parent_row_txt_loc_c, parent_row_txt_loc_lt, parent_row_txt_loc_rb)
        let char_center_x = (parent_frame_min_x+parent_frame_max_x)/2
        let char_center_y = (parent_frame_min_y+parent_frame_max_y)/2
        //console.log('char_center_x/char_center_y',  char_center_x, char_center_y)
        let text_num=-1
        let single_char_svg
        let y_move = font_size*0.25
        for(let ii=0;ii<parent_row_txt_loc_c.length;ii++){
            for(let jj=0;jj<parent_row_txt_loc_c[ii].length;jj++){
                text_num += 1
                // 判定字符串里面是否为字母
                
                if(parent_text[text_num]>='A' && parent_text[text_num]<='Z'){
                    let algebra_data = algebra_value[parent_text[text_num]]
                    //console.log('-------字母------', algebra_data)
                    if(typeof(algebra_data)==typeof([0])){
                        if(algebra_data.length==1){
                            // 单数组
                            //console.log('-----单数组展示-------')
                            // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_lt[ii][jj][0]+font_size
                            // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]
                            let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                            let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                            single_char_svg =<Text  x={char_frame_center_x} 
                                                y={char_frame_center_y} 
                                                fill={group_color} 
                                                // fill='black' 
                                                backgroundColor='black' 
                                                fontSize = '14'>{algebra_data}</Text>
                        }
                        else if(algebra_data.length==2){
                            // 分数展示:分子分母
                            //console.log('分子分母展示-----------', ii, jj, parent_row_txt_loc_rb)
                            let numerator_len =  (algebra_data[0]).toString().length
                            let denominator_len = (algebra_data[1]).toString().length
                            // 组合字符串
                            let combine_fraction_str = (algebra_data[0]).toString()
                            for (let cm=0;cm<Math.max.apply(null,[numerator_len,denominator_len]);cm++){
                                combine_fraction_str += "—"
                            }
                            combine_fraction_str +=  (algebra_data[1]).toString()
                            let [tspan_dx, tspan_dy] = this.CombineFractionTspan(algebra_data[0], algebra_data[1])
                            // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_lt[ii][jj][0]+font_size
                            // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]-0.8*font_size
                            let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                            let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                            single_char_svg =<Text  x={char_frame_center_x} 
                                                    y={char_frame_center_y} 
                                                    fill={group_color} 
                                                    // fill='white' 
                                                    backgroundColor='black' 
                                                    fontSize = '14'>
                                                    {/* <TSpan  dx={tspan_mat[numerator_len-1][denominator_len-1]['dx']} 
                                                            dy={tspan_mat[numerator_len-1][denominator_len-1]['dy']} 
                                                            >{combine_fraction_str}</TSpan>    */}
                                                    <TSpan  dx={tspan_dx} 
                                                            dy={tspan_dy} 
                                                            >{combine_fraction_str}</TSpan>   
                                                </Text>
                        }
                        else if(algebra_data.length==3){
                            // 带分数展示：整数部分和分数部分分别展示
                            //console.log('整数部分展示-----------')
                            let int_len = (algebra_data[0]).toString().length
                            // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_lt[ii][jj][0]+font_size
                            // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]-0.8*font_size
                            let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                            let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                            // single_char_svg =<Text  x={char_frame_center_x} 
                            //                         y={char_frame_center_y} 
                            let int_single_char_svg =<Text  x={char_frame_center_x} 
                                                            y={char_frame_center_y} 
                                                            fill={group_color} 
                                                            // fill='white' 
                                                            backgroundColor='black' 
                                                            fontSize = '14'>{algebra_data[0]}</Text>
                            parent_svg.push(int_single_char_svg)
                            //console.log('分子分母展示-----------')
                            let numerator_len =  (algebra_data[1]).toString().length
                            let denominator_len = (algebra_data[2]).toString().length
                            // 组合字符串
                            let combine_fraction_str = (algebra_data[1]).toString()
                            for (let cm=0;cm<Math.max.apply(null,[numerator_len,denominator_len]);cm++){
                                combine_fraction_str += "—"
                            }
                            combine_fraction_str +=  (algebra_data[2]).toString()
                            // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_lt[ii][jj][0]+font_size+int_len*(5/9)*font_size
                            // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]-0.8*font_size
                            char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]+int_len*(5/9)*font_size
                            char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                            single_char_svg =<Text  x={char_frame_center_x} 
                                                    y={char_frame_center_y} 
                                                    fill={group_color} 
                                                    // fill='white' 
                                                    backgroundColor='black' 
                                                    fontSize = '14'>
                                                    <TSpan  dx={tspan_mat[numerator_len-1][denominator_len-1]['dx']} 
                                                            dy={tspan_mat[numerator_len-1][denominator_len-1]['dy']} 
                                                            >{combine_fraction_str}</TSpan>   
                                                </Text>
                        }
                        
                    }
                    else{
                        // 字符串或数字：直接展示
                        // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_rb[ii][jj][0]+font_size
                        // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]
                        let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                            -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                        let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                            -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                            
                        char_frame_center_x = Math.round(char_frame_center_x*10)/10
                        char_frame_center_y = Math.round(char_frame_center_y*10)/10
                        single_char_svg =<Text  x={char_frame_center_x} 
                                                y={char_frame_center_y} 
                                                fill={group_color} 
                                                // fill='white' 
                                                backgroundColor='black' 
                                                // width={unit_binary_mat.parent.width} 
                                                // height={unit_binary_mat.parent.height} 
                                                fontSize = '14'>{algebra_data}</Text>
                    }

                }
                else{
                    // 找中心位置
                    //console.log('找中心位置----', )
                    // let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[0]+unit_binary_mat.global_x+parent_row_txt_loc_rb[ii][jj][0]
                    // let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_start_loc[1]+unit_binary_mat.global_y+parent_row_txt_loc_rb[ii][jj][1]
                    let char_frame_center_x = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                    let char_frame_center_y = unit_binary_mat.parentTochildren.parent_loc.box_center_loc[1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                    char_frame_center_x = Math.round(char_frame_center_x*10)/10
                    char_frame_center_y = Math.round(char_frame_center_y*10)/10
                    // parent_row_txt_loc_c, parent_row_txt_loc_lt/parent_row_txt_loc_rb
                    //console.log('char_frame_center_x/char_frame_center_y',  char_frame_center_x, char_frame_center_y)
                    single_char_svg =<Text  x={char_frame_center_x} 
                                            y={char_frame_center_y} 
                                            fill={group_color} 
                                            // fill='lime' 
                                            backgroundColor='black' 
                                            // width={unit_binary_mat.parent.width} 
                                            // height={unit_binary_mat.parent.height} 
                                            fontSize = '14'>{parent_text[text_num]}</Text>
                }
                parent_svg.push(single_char_svg)
            }
        }
        binary_text.push(parent_svg)

        // 子组件填写文字
        //console.log('children_text', children_text)
        for(let kk=0;kk<children_text.length;kk++){
            let children_svg =[] 
            let [[parent_frame_min_x,parent_frame_max_x,parent_frame_min_y,parent_frame_max_y], parent_row_txt_loc_c, parent_row_txt_loc_lt, parent_row_txt_loc_rb] = 
                this.CalculateCharLoc(children_text[kk], algebra_value)
            //console.log('======子组件字符分解', parent_row_txt_loc_c, parent_row_txt_loc_lt, parent_row_txt_loc_rb)
            let text_num=-1
            let single_char_svg
            let char_center_x = (parent_frame_min_x+parent_frame_max_x)/2
            let char_center_y = (parent_frame_min_y+parent_frame_max_y)/2
            for(let ii=0;ii<parent_row_txt_loc_c.length;ii++){
                for(let jj=0;jj<parent_row_txt_loc_c[ii].length;jj++){
                    text_num += 1
                    // 判定字符串里面是否为字母
                    if(children_text[kk][text_num]>='A' && children_text[kk][text_num]<='Z'){
                        let algebra_data = algebra_value[children_text[kk][text_num]]
                        //console.log('-------字母------', algebra_data)
                        if(typeof(algebra_data)==typeof([0])){
                            if(algebra_data.length==1){
                                // 单数组
                                //console.log('-----单数组展示-------')
                                let char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                                let char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                
                                char_frame_center_x = Math.round(char_frame_center_x*10)/10
                                char_frame_center_y = Math.round(char_frame_center_y*10)/10
                                single_char_svg =<Text  x={char_frame_center_x} 
                                                    y={char_frame_center_y} 
                                                    fill={group_color} 
                                                    // fill='black' 
                                                    backgroundColor='black' 
                                                    fontSize = '14'>{algebra_data}</Text>
                            }
                            else if(algebra_data.length==2){
                                // 分数展示:分子分母
                                //console.log('分子分母展示-----------', ii, jj, parent_row_txt_loc_rb)
                                let numerator_len =  (algebra_data[0]).toString().length
                                let denominator_len = (algebra_data[1]).toString().length
                                // 组合字符串
                                let combine_fraction_str = (algebra_data[0]).toString()
                                for (let cm=0;cm<Math.max.apply(null,[numerator_len,denominator_len]);cm++){
                                    combine_fraction_str += "—"
                                }
                                combine_fraction_str +=  (algebra_data[1]).toString()
                                //console.log('combine_fraction_str', combine_fraction_str)
                                let [tspan_dx, tspan_dy] = this.CombineFractionTspan(algebra_data[0], algebra_data[1])
                                let char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                                let char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                                single_char_svg =<Text  x={char_frame_center_x} 
                                                        y={char_frame_center_y} 
                                                        fill={group_color} 
                                                        // fill='black' 
                                                        backgroundColor='black' 
                                                        fontSize = '14'>
                                                        {/* <TSpan  dx={tspan_mat[numerator_len-1][denominator_len-1]['dx']} 
                                                                dy={tspan_mat[numerator_len-1][denominator_len-1]['dy']} 
                                                                >{combine_fraction_str}</TSpan>    */}
                                                        <TSpan  dx={tspan_dx} 
                                                                dy={tspan_dy} 
                                                                >{combine_fraction_str}</TSpan>   
                                                    </Text>
                            }
                            else if(algebra_data.length==3){
                                // 带分数展示：整数部分和分数部分分别展示
                                //console.log('整数部分展示-----------')
                                let int_len = (algebra_data[0]).toString().length
                                let char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                                let char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                                
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                                let int_single_char_svg =<Text  x={char_frame_center_x} 
                                                                y={char_frame_center_y} 
                                                                fill={group_color} 
                                                                // fill='white' 
                                                                backgroundColor='black' 
                                                                fontSize = '14'>{algebra_data[0]}</Text>
                                children_svg.push(int_single_char_svg)
                                //console.log('分子分母展示-----------')
                                let numerator_len =  (algebra_data[1]).toString().length
                                let denominator_len = (algebra_data[2]).toString().length
                                // 组合字符串
                                let combine_fraction_str = (algebra_data[1]).toString()
                                for (let cm=0;cm<Math.max.apply(null,[numerator_len,denominator_len]);cm++){
                                    combine_fraction_str += "—"
                                }
                                combine_fraction_str +=  (algebra_data[2]).toString()
                                char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                        -char_center_x + parent_row_txt_loc_lt[ii][jj][0]+int_len*(5/9)*font_size
                                char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                        -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                                        
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                                single_char_svg =<Text  x={char_frame_center_x} 
                                                        y={char_frame_center_y} 
                                                        fill={group_color} 
                                                        // fill='white' 
                                                        backgroundColor='black' 
                                                        fontSize = '14'>
                                                        <TSpan  dx={tspan_mat[numerator_len-1][denominator_len-1]['dx']} 
                                                                dy={tspan_mat[numerator_len-1][denominator_len-1]['dy']} 
                                                                >{combine_fraction_str}</TSpan>   
                                                    </Text>
                            }
                            
                        }
                        else{
                            // 字符串或数字：直接展示
                            let char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                            let char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                                
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                            single_char_svg =<Text  x={char_frame_center_x} 
                                                    y={char_frame_center_y} 
                                                    fill={group_color} 
                                                    // fill='white' 
                                                    backgroundColor='black' 
                                                    // width={unit_binary_mat.parent.width} 
                                                    // height={unit_binary_mat.parent.height} 
                                                    fontSize = '14'>{algebra_data}</Text>
                        }
    
                    }
                    else{
                        //console.log('---------------', kk, unit_binary_mat.parentTochildren.children_loc.box_start_loc)
                        let char_frame_center_x = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][0]+unit_binary_mat.global_x+
                                                -char_center_x + parent_row_txt_loc_lt[ii][jj][0]
                        let char_frame_center_y = unit_binary_mat.parentTochildren.children_loc.box_center_loc[kk][1]+unit_binary_mat.global_y+
                                                    -char_center_y + parent_row_txt_loc_c[ii][jj][1] + y_move
                                                    
                            char_frame_center_x = Math.round(char_frame_center_x*10)/10
                            char_frame_center_y = Math.round(char_frame_center_y*10)/10
                        single_char_svg =<Text  x={char_frame_center_x} 
                                                y={char_frame_center_y} 
                                                fill={group_color} 
                                                // fill='lime' 
                                                backgroundColor='black' 
                                                // width={unit_binary_mat.parent.width} 
                                                // height={unit_binary_mat.parent.height} 
                                                fontSize = '14'>{children_text[kk][text_num]}</Text>
                    }
                    children_svg.push(single_char_svg)
                }
            }
            binary_text.push(children_svg)
        }
        // 符号位置填写文字
        for(let ii=0;ii<symbol_text.length;ii++){
            let char_frame_center_x = unit_binary_mat.parentTochildren.symbol_loc.box_center_loc[ii][0]+unit_binary_mat.global_x-0.8*font_size*5/9
            let char_frame_center_y = unit_binary_mat.parentTochildren.symbol_loc.box_center_loc[ii][1]+unit_binary_mat.global_y+0.6*font_size*5/9
            char_frame_center_x = Math.round(char_frame_center_x*10)/10
            char_frame_center_y = Math.round(char_frame_center_y*10)/10
            let children_svg = <Text  x={char_frame_center_x} 
                                    y={char_frame_center_y} 
                                    fill={group_color}
                                    // fill='lime'
                                    backgroundColor='black' 
                                    width={unit_binary_mat.parent.width} 
                                    height={unit_binary_mat.parent.height} 
                                    fontSize = '20'>{symbol_text[ii]}</Text>
            binary_text.push(children_svg)
        }
        return binary_text
    }


    deepClone=(obj)=> {
        if (obj === null) return obj; 
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof RegExp) return new RegExp(obj);
        if (typeof obj !== "object") return obj;
        let cloneObj = new obj.constructor();
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 实现一个递归拷贝
            cloneObj[key] = this.deepClone(obj[key]);
          }
        }
        return cloneObj;
    }
    
    
    CalculateCharLoc=(init_str, algebra_value)=>{
        let font_size = 14      // 框图中字体显示大小
        let fraction_font_size = 14      // 框图中字体显示大小
        let max_width = 7*font_size     // 最大展示个数
        let max_frame_width = max_width + 2*font_size
        let init_loc_center_x=0
        let init_loc_center_y=0
        let center_xy_mat = []
        let left_top_xy_mat = []
        let right_bottom_xy_mat =[]
        let left_top_x, left_top_y, right_bottom_x, right_bottom_y
        let row_gap=0.2*font_size
        // let  
        for(let ii=0;ii<init_str.length;ii++){
            // 分别计算每个字符坐标位置
            // //console.log(init_str[ii])
            let [center_x, center_y] = [0, 0]
            if(init_str[ii]>='A' && init_str[ii]<='Z'){
                // 如果是大写字母单独处理计算所指代数据的
                let algebra_data = algebra_value[init_str[ii]]
                // //console.log('代数', init_str[ii], algebra_data)
                if(typeof(algebra_data)==typeof([0])){
                    // //console.log('分数组')
                    if(algebra_data.length==1){
                        // 单组处理
                        let part_length = Math.round((algebra_data[0]).toString().length*font_size*(5/9)*100)/100
                        if(right_bottom_xy_mat.length<1){
                            left_top_x = 0
                        }
                        else{
                            left_top_x = right_bottom_xy_mat[ii-1][0]
                        }                        left_top_y = 0
                        right_bottom_x = left_top_x + part_length
                        right_bottom_y = font_size*1
                        center_x = (left_top_x + right_bottom_x)/2
                        center_y = (left_top_y + right_bottom_y)/2
                        left_top_xy_mat.push([left_top_x, left_top_y])
                        right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                        center_xy_mat.push([center_x, center_y]) 
                    }
                    else if(algebra_data.length==2){
                        // 定义分子分母部分--提取最宽最高的空间，采用Tspan显示
                        let numerator_length = Math.round((algebra_data[0]).toString().length*fraction_font_size*(5/9)*100)/100
                        let denominator_length = Math.round((algebra_data[1]).toString().length*fraction_font_size*(5/9)*100)/100
                        if(right_bottom_xy_mat.length<1){
                            left_top_x = 0
                        }
                        else{
                            left_top_x = right_bottom_xy_mat[ii-1][0]
                        }                        left_top_y = -fraction_font_size*0.8
                        right_bottom_x = left_top_x + Math.max.apply(null,[numerator_length, denominator_length])
                        right_bottom_y = fraction_font_size*(0.8+1)
                        center_x = (left_top_x + right_bottom_x)/2
                        center_y = (left_top_y + right_bottom_y)/2
                        left_top_xy_mat.push([left_top_x, left_top_y])
                        right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                        center_xy_mat.push([center_x, center_y]) 
                    }
                    else if(algebra_data.length==3){
                        // 定义分子分母部分--提取最宽最高的空间，采用Tspan显示
                        let int_length = Math.round((algebra_data[0]).toString().length*font_size*(5/9)*100)/100
                        let numerator_length = Math.round((algebra_data[1]).toString().length*fraction_font_size*(5/9)*100)/100
                        let denominator_length = Math.round((algebra_data[2]).toString().length*fraction_font_size*(5/9)*100)/100
                        if(right_bottom_xy_mat.length<1){
                            left_top_x = 0
                        }
                        else{
                            left_top_x = right_bottom_xy_mat[ii-1][0]
                        }                        left_top_y = -fraction_font_size*0.8
                        right_bottom_x = left_top_x + Math.max.apply(null,[numerator_length, denominator_length])+int_length
                        right_bottom_y = fraction_font_size*(0.8+1)
                        center_x = (left_top_x + right_bottom_x)/2
                        center_y = (left_top_y + right_bottom_y)/2
                        left_top_xy_mat.push([left_top_x, left_top_y])
                        right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                        center_xy_mat.push([center_x, center_y]) 
                        
                    }
                    else{
                        // 取第一组或无效处理
                        let part_length = Math.round((algebra_data[0]).toString().length*font_size*(5/9)*100)/100
                        if(right_bottom_xy_mat.length<1){
                            left_top_x = 0
                        }
                        else{
                            left_top_x = right_bottom_xy_mat[ii-1][0]
                        }                        left_top_y = 0
                        right_bottom_x = left_top_x + part_length
                        right_bottom_y = font_size*1
                        center_x = (left_top_x + right_bottom_x)/2
                        center_y = (left_top_y + right_bottom_y)/2
                        left_top_xy_mat.push([left_top_x, left_top_y])
                        right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                        center_xy_mat.push([center_x, center_y]) 
                    }
                }
                else{
                    // 直接字符串或num
                    // //console.log('单组长度')
                    let part_length = Math.round((algebra_data).toString().length*font_size*(5/9)*100)/100
                    //console.log('直接字符串或num:right_bottom_xy_mat', right_bottom_xy_mat)
                    if(right_bottom_xy_mat.length<1){
                        left_top_x = 0
                    }
                    else{
                        left_top_x = right_bottom_xy_mat[ii-1][0]
                    }                    left_top_y = 0
                    right_bottom_x = left_top_x + part_length
                    right_bottom_y = font_size*1
                    center_x = (left_top_x + right_bottom_x)/2
                    center_y = (left_top_y + right_bottom_y)/2
                    left_top_xy_mat.push([left_top_x, left_top_y])
                    right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                    center_xy_mat.push([center_x, center_y]) 
                }
            }
            else{
                if (ii==0){
                    // 第一个数据
                    left_top_x = 0
                    left_top_y = 0
                    right_bottom_x = font_size*1
                    right_bottom_y = font_size*1
                    center_x = (left_top_x + right_bottom_x)/2
                    center_y = (left_top_y + right_bottom_y)/2
                    left_top_xy_mat.push([left_top_x, left_top_y])
                    right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                    center_xy_mat.push([center_x, center_y])
                }
                else{
                    if(right_bottom_xy_mat.length<1){
                        left_top_x = 0
                    }
                    else{
                        left_top_x = right_bottom_xy_mat[ii-1][0]
                    }
                    left_top_y = 0
                    right_bottom_x = left_top_x + font_size*1
                    right_bottom_y = font_size*1
                    center_x = (left_top_x + right_bottom_x)/2
                    center_y = (left_top_y + right_bottom_y)/2
                    left_top_xy_mat.push([left_top_x, left_top_y])
                    right_bottom_xy_mat.push([right_bottom_x, right_bottom_y])
                    center_xy_mat.push([center_x, center_y]) 
                }     
            }
        }
        // //console.log('中心坐标值', center_xy_mat)
        // //console.log('左上坐标值', left_top_xy_mat)
        // //console.log('右下坐标值', right_bottom_xy_mat)
        let row_txt_loc_c = []
        let row_txt_loc_lt = []
        let row_txt_loc_rb = []
        let part_init_mat_c = []
        let part_init_mat_lt = []
        let part_init_mat_rb = []
        let init_width = 0
        let init_height = 0
        for(let ii=0;ii<center_xy_mat.length;ii++){
            // 建立行分组：已宽度作为转换条件，标点结尾过程的处理，统计累计宽度，高度行处理
            if((right_bottom_xy_mat[ii][0]-init_width)<=max_width){// 后期优化排布
                // //console.log('=======ii=====',ii)
                part_init_mat_c.push(center_xy_mat[ii])
                part_init_mat_lt.push(left_top_xy_mat[ii])
                part_init_mat_rb.push(right_bottom_xy_mat[ii])
            }
            else{
                if((['，',',','。','.']).indexOf(init_str[ii])>=0){
                    // 如果是标点符号
                    part_init_mat_c.push(center_xy_mat[ii])
                    part_init_mat_lt.push(left_top_xy_mat[ii])
                    part_init_mat_rb.push(right_bottom_xy_mat[ii])
                    if(row_txt_loc_c.length<1){
                        // 直接插入
                        row_txt_loc_c.push(part_init_mat_c)
                        row_txt_loc_lt.push(part_init_mat_lt)
                        row_txt_loc_rb.push(part_init_mat_rb)
                        // 获取高度
                        for(let kk=0;kk<part_init_mat_rb.length;kk++){
                            if (part_init_mat_rb[kk][1]>init_height){
                                init_height = part_init_mat_rb[kk][1]
                            }
                        }
                    }
                    else{
                        // 更新计算高度+间隔，
                        // 计算当前y差值
                        let row_y_height = 0
                        let min_height =0
                        let max_height = 0
                        for(let kk=0;kk<part_init_mat_rb.length;kk++){
                            if ((part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1])>row_y_height){
                                row_y_height = part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1]
                            }
                            if (part_init_mat_lt[kk][1]<min_height){
                                min_height = part_init_mat_lt[kk][1]
                            }
                            if (part_init_mat_rb[kk][1]>max_height){
                                max_height = part_init_mat_rb[kk][1]
                            }
                        }
                        // 更新坐标
                        let part_init_mat_c0=this.deepClone(part_init_mat_c)
                        let part_init_mat_lt0=this.deepClone(part_init_mat_lt)
                        let part_init_mat_rb0=this.deepClone(part_init_mat_rb)
                        for(let kk=0;kk<part_init_mat_rb.length;kk++){
                            part_init_mat_c0[kk][0] = part_init_mat_c0[kk][0] - init_width
                            part_init_mat_c0[kk][1] = part_init_mat_c0[kk][1] + (init_height - min_height)+row_gap
                            part_init_mat_lt0[kk][0] = part_init_mat_lt0[kk][0] - init_width
                            part_init_mat_lt0[kk][1] = part_init_mat_lt0[kk][1] + (init_height - min_height)+row_gap
                            part_init_mat_rb0[kk][0] = part_init_mat_rb0[kk][0] - init_width
                            part_init_mat_rb0[kk][1] = part_init_mat_rb0[kk][1] + (init_height - min_height)+row_gap
                        }
                        // 插入跟新后的坐标
                        row_txt_loc_c.push(part_init_mat_c0)
                        row_txt_loc_lt.push(part_init_mat_lt0)
                        row_txt_loc_rb.push(part_init_mat_rb0)
                        init_height = init_height+row_gap+row_y_height
                    }
                    part_init_mat_c = []
                    part_init_mat_lt = []
                    part_init_mat_rb = []
                    init_width = right_bottom_xy_mat[ii][0]   //更新
                }
                else{
                    if(row_txt_loc_c.length<1){
                        // 直接插入
                        row_txt_loc_c.push(part_init_mat_c)
                        row_txt_loc_lt.push(part_init_mat_lt)
                        row_txt_loc_rb.push(part_init_mat_rb)
                        // 获取高度
                        for(let kk=0;kk<part_init_mat_rb.length;kk++){
                            if (part_init_mat_rb[kk][1]>init_height){
                                init_height = part_init_mat_rb[kk][1]
                            }
                        }
                    }
                    else{
                        // 更新计算高度+间隔，
                        // 计算当前y差值
                        let row_y_height = 0
                        let min_height =0
                        let max_height = 0
                        for(let kk=0;kk<part_init_mat_rb.length;kk++){
                            if ((part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1])>row_y_height){
                                row_y_height = part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1]
                            }
                            if (part_init_mat_lt[kk][1]<min_height){
                                min_height = part_init_mat_lt[kk][1]
                            }
                            if (part_init_mat_rb[kk][1]>max_height){
                                max_height = part_init_mat_rb[kk][1]
                            }
                        }
                        // 更新坐标
                        let part_init_mat_c0=this.deepClone(part_init_mat_c)
                        let part_init_mat_lt0=this.deepClone(part_init_mat_lt)
                        let part_init_mat_rb0=this.deepClone(part_init_mat_rb)
                        for(let kk=0;kk<part_init_mat_rb0.length;kk++){
                            part_init_mat_c0[kk][0] = part_init_mat_c0[kk][0] - init_width
                            part_init_mat_c0[kk][1] = part_init_mat_c0[kk][1] + (init_height - min_height)+row_gap
                            part_init_mat_lt0[kk][0] = part_init_mat_lt0[kk][0] - init_width
                            part_init_mat_lt0[kk][1] = part_init_mat_lt0[kk][1] + (init_height - min_height)+row_gap
                            part_init_mat_rb0[kk][0] = part_init_mat_rb0[kk][0] - init_width
                            part_init_mat_rb0[kk][1] = part_init_mat_rb0[kk][1] + (init_height - min_height)+row_gap
                        }
                        // 插入跟新后的坐标
                        row_txt_loc_c.push(part_init_mat_c0)
                        row_txt_loc_lt.push(part_init_mat_lt0)
                        row_txt_loc_rb.push(part_init_mat_rb0)
                        init_height = init_height+row_gap+row_y_height
                    }
                    init_width = right_bottom_xy_mat[ii-1][0]   //更新
                    // //console.log('right_bottom_xy_mat', right_bottom_xy_mat)
                    // //console.log('定义init_width', init_width)
                    part_init_mat_c = []
                    part_init_mat_lt = []
                    part_init_mat_rb = []
                    part_init_mat_c.push(center_xy_mat[ii])
                    part_init_mat_lt.push(left_top_xy_mat[ii])
                    part_init_mat_rb.push(right_bottom_xy_mat[ii])
                }
            }
            if(ii==(center_xy_mat.length-1)&&part_init_mat_rb.length>0){
                // 如果出现最后一组数据有值
                // //console.log('init_width', init_width, part_init_mat_rb)
                if(row_txt_loc_c.length<1){
                    // 直接插入
                    row_txt_loc_c.push(part_init_mat_c)
                    row_txt_loc_lt.push(part_init_mat_lt)
                    row_txt_loc_rb.push(part_init_mat_rb)
                    // 获取高度
                    for(let kk=0;kk<part_init_mat_rb.length;kk++){
                        if (part_init_mat_rb[kk][1]>init_height){
                            init_height = part_init_mat_rb[kk][1]
                        }
                    }
                }
                else{
                    // 更新计算高度+间隔，
                    // 计算当前y差值
                    let row_y_height = 0
                    let min_height =0
                    let max_height = 0
                    for(let kk=0;kk<part_init_mat_rb.length;kk++){
                        if ((part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1])>row_y_height){
                            row_y_height = part_init_mat_rb[kk][1]-part_init_mat_lt[kk][1]
                        }
                        if (part_init_mat_lt[kk][1]<min_height){
                            min_height = part_init_mat_lt[kk][1]
                        }
                        if (part_init_mat_rb[kk][1]>max_height){
                            max_height = part_init_mat_rb[kk][1]
                        }
                    }
                    // 更新坐标
                    let part_init_mat_c0=this.deepClone(part_init_mat_c)
                    let part_init_mat_lt0=this.deepClone(part_init_mat_lt)
                    let part_init_mat_rb0=this.deepClone(part_init_mat_rb)
                    for(let kk=0;kk<part_init_mat_rb.length;kk++){
                        part_init_mat_c0[kk][0] = part_init_mat_c0[kk][0] - init_width
                        part_init_mat_c0[kk][1] = part_init_mat_c0[kk][1] + (init_height - min_height)+row_gap
                        part_init_mat_lt0[kk][0] = part_init_mat_lt0[kk][0] - init_width
                        part_init_mat_lt0[kk][1] = part_init_mat_lt0[kk][1] + (init_height - min_height)+row_gap
                        part_init_mat_rb0[kk][0] = part_init_mat_rb0[kk][0] - init_width
                        part_init_mat_rb0[kk][1] = part_init_mat_rb0[kk][1] + (init_height - min_height)+row_gap
                        // //console.log('重新赋值', kk)
                    }
                    // 插入跟新后的坐标
                    row_txt_loc_c.push(part_init_mat_c0)
                    row_txt_loc_lt.push(part_init_mat_lt0)
                    row_txt_loc_rb.push(part_init_mat_rb0)
                    init_height = init_height+row_gap+row_y_height
                }
                break
            }
        }
        // 建立全局的宽度、高度、中心点
        // //console.log('分组中心', row_txt_loc_c)
        // //console.log('分组左上', row_txt_loc_lt)
        // //console.log('分组右下', row_txt_loc_rb)
        // 获取全局高度和宽度
        let [frame_min_y,frame_max_y,frame_min_x,frame_max_x] = [0,0,0,0]
        for(let ii=0;ii<row_txt_loc_lt[0].length;ii++){
            if(row_txt_loc_lt[0][ii][1]<frame_min_y){
                frame_min_y = row_txt_loc_lt[0][ii][1]
            }
        }
        for(let ii=0;ii<row_txt_loc_rb[row_txt_loc_rb.length-1].length;ii++){
            // //console.log(row_txt_loc_rb[row_txt_loc_rb.length-1])
            if(row_txt_loc_rb[row_txt_loc_rb.length-1][ii][1]>frame_max_y){
                frame_max_y = row_txt_loc_rb[row_txt_loc_rb.length-1][ii][1]
            }
        }
        for(let ii=0;ii<row_txt_loc_rb.length;ii++){
            for(let jj=0;jj<row_txt_loc_rb[ii].length;jj++){
                // //console.log('----', ii, jj, row_txt_loc_rb[ii][jj])
                if(row_txt_loc_rb[ii][jj][0]>frame_max_x){
                    frame_max_x = row_txt_loc_rb[ii][jj][0]
                }
            }
        }
        //console.log('区间', [frame_min_x,frame_max_x,frame_min_y,frame_max_y])
        return [[frame_min_x,frame_max_x,frame_min_y,frame_max_y], row_txt_loc_c, row_txt_loc_lt, row_txt_loc_rb]
    }

    CombineFractionTspan = (num_numrator, num_denominator)=>{
        let init_numerator_len = (num_numrator).toString().length             // 分子长度
        let init_denominator_len =(num_denominator).toString().length         // 分母长度
        let init_borderline_len = Math.max.apply(null, [init_numerator_len, init_denominator_len])      // 分数线长度
        //console.log('初始长度计算', init_numerator_len,init_denominator_len,init_borderline_len)
        let init_char_size = 14
        let border_line_size = 10
        // 计算分数线长度
        let numerator_overall_len = Math.round(init_numerator_len * 8.2*10)/10
        let denominator_overall_len = Math.round(init_denominator_len * 8.2*10)/10
        let borderline_overall_len = 0
        for(let ii=0;ii<init_borderline_len;ii++){
            if (ii==0){
                borderline_overall_len = border_line_size
            }
            else{
                borderline_overall_len += (border_line_size*(1-0.3))
            }
        }
        borderline_overall_len = Math.round(borderline_overall_len*10)/10
        //console.log('分数线长度', borderline_overall_len)
        // 计算起始位
        let numerator_start = Math.round((borderline_overall_len/2 - numerator_overall_len/2)*10)/10+1
        let denominator_start = Math.round((-borderline_overall_len/2 - denominator_overall_len/2)*10)/10
        let border_start = Math.round((-borderline_overall_len/2 - numerator_overall_len/2)*10)/10-1
        //console.log('各部分起始位', numerator_start, denominator_start, border_start)
        // 组装位置的点
        let [numerator_dx_mat, numerator_dy_mat] = [[],[]]
        for(let ii=0;ii<init_numerator_len;ii++){
            if (ii==0){
                numerator_dx_mat.push(numerator_start)
                numerator_dy_mat.push(-10)
            }
            else{
                numerator_dx_mat.push(0)
                numerator_dy_mat.push(0)
            }
        }
        let [denominator_dx_mat, denominator_dy_mat] = [[],[]]
        for(let ii=0;ii<init_denominator_len;ii++){
            if (ii==0){
                denominator_dx_mat.push(denominator_start)
                denominator_dy_mat.push(10)
            }
            // else{
            //     denominator_dx_mat.push(0)
            //     denominator_dy_mat.push(0)
            // }
        }
        let [border_dx_mat, border_dy_mat] = [[],[]]
        for(let ii=0;ii<init_borderline_len;ii++){
            if (ii==0){
                border_dx_mat.push(border_start)
                border_dy_mat.push(10)
            }
            else{
                border_dx_mat.push(-3)
                border_dy_mat.push(0)
            }
        }
        // 组装字符串
        let tspan_dx = numerator_dx_mat.join(' ') + ' '+ border_dx_mat.join(' ') + ' ' + denominator_dx_mat.join(' ')
        let tspan_dy = numerator_dy_mat.join(' ') + ' '+ border_dy_mat.join(' ') + ' ' + denominator_dy_mat.join(' ')
        //console.log('函数组装', tspan_dx, tspan_dy)
        return [tspan_dx, tspan_dy]
    }

    render() {

        // 单组框图结构建立：三元关系：子结构可推广到多元A+BxC÷D=E 
        // 三元/多元代数式逻辑关系处理
        // let algebra_mat = ['AxB=E','CxD=F','J+H+I=D','E+F+K=G']         // 默认标准代数式保存'J+K=B', 
        // 传输值:定义步骤

        let triadic_relation = this.props.math_frame_svg0[0]             //      三元/多元等式关系
        let variable_value = this.props.math_frame_svg0[1]        //      字母文字+数字/?+单位所组合
        let algebra_value = this.props.math_frame_svg0[2]             //      字母取值
        let calculate_step = this.props.math_frame_svg0[3]             //      字母取值
        //console.log('传输值', triadic_relation, variable_value, algebra_value,calculate_step)
        let algebra_mat = triadic_relation         // 默认标准代数式保存'J+K=B', ,'AxB=E'
        let algebra_num = algebra_value

        let all_global_x = 650;
        let all_global_y = 120;
        let algebra_process = []    // 代数式处理结果
        algebra_process.equal_left = []     // 存数组还是存单字符
        algebra_process.equal_right = []
        algebra_process.equal_left_mat = []     // 存数组还是存单字符
        algebra_process.equal_right_mat = []
        algebra_process.equal_symbol_mat = {}   // 按字典符号组存储 
        algebra_process.equal_right_dict = {}   // 按字典符号组存储 
        algebra_process.children_parent_node = {}   // 所右子节点对应父节点
        for (let ii=0;ii<algebra_mat.length;ii++){
            let equal_idx = algebra_mat[ii].indexOf('=')
            let part_equal_left_mat = []
            let part_equal_right_mat = []
            let part_equal_symbol_mat = []
            //console.log('等号索引', equal_idx)
            for(let kk=equal_idx;kk<algebra_mat[ii].length;kk++){
                // 等式右侧代数
                if(algebra_mat[ii][kk]>='A' && algebra_mat[ii][kk]<='Z'){
                    algebra_process.equal_right.push(algebra_mat[ii][kk])
                    part_equal_right_mat.push(algebra_mat[ii][kk])

                }
            }
            for(let jj=0; jj<equal_idx;jj++){
                // 等式左侧代数
                if(algebra_mat[ii][jj]>='A' && algebra_mat[ii][jj]<='Z'){
                    algebra_process.equal_left.push(algebra_mat[ii][jj])
                    part_equal_left_mat.push(algebra_mat[ii][jj])
                    // 添加对应子对父
                    algebra_process.children_parent_node[algebra_mat[ii][jj]] = part_equal_right_mat[0]
                }
                else{
                    part_equal_symbol_mat.push(algebra_mat[ii][jj])         // 符号存储
                }
            }
            
            algebra_process.equal_left_mat.push(part_equal_left_mat)
            algebra_process.equal_right_mat.push(part_equal_right_mat)
            algebra_process.equal_symbol_mat[part_equal_right_mat[0]] = part_equal_symbol_mat
            algebra_process.equal_right_dict[part_equal_right_mat[0]] = part_equal_left_mat
        }
        //console.log('等式左右侧数组', algebra_process)
        // 找顶层父节点
        let unknow_parent_node_num = 0
        for (let ii=0;ii<algebra_process.equal_right.length;ii++){
            // //console.log('========', algebra_process.equal_left.indexOf(algebra_process.equal_right[ii]))
            if (algebra_process.equal_left.indexOf(algebra_process.equal_right[ii])<0){
                unknow_parent_node_num += 1
                algebra_process.top_parent_node = algebra_process.equal_right[ii]
                // //console.log('========')
            }
        }
        if (unknow_parent_node_num!=1){
            //console.log('未知数过多')
        }
        //console.log('等式顶层父节点', algebra_process)
        // 找最底层子节点
        algebra_process.bottom_children_node = []
        for (let ii=0;ii<algebra_process.equal_left.length;ii++){
            // //console.log('========', algebra_process.equal_left.indexOf(algebra_process.equal_right[ii]))
            if (algebra_process.equal_right.indexOf(algebra_process.equal_left[ii])<0){
                algebra_process.bottom_children_node.push(algebra_process.equal_left[ii])
                // //console.log('========')
            }
        }
        //console.log('等式底层子节点', algebra_process)
        // 组装字符串
        let algebra_text_mat = []
        let used_algebra = []
        let using_algebra = []
        let to_use_algebra = []
        for(let ii=0;ii<triadic_relation.length;ii++){
            let equal_flag = 0
            if (ii<calculate_step){
                // 已使用
                for(let jj=0;jj<triadic_relation[ii].length;jj++){
                    if (triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z'){
                        // 组合字符串
                        algebra_text_mat[triadic_relation[ii][jj]] = variable_value[triadic_relation[ii][jj]][0]+triadic_relation[ii][jj]+variable_value[triadic_relation[ii][jj]][1]
                    }
                    if(triadic_relation[ii][jj]=='='){
                        equal_flag = 1
                    }
                    if(triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z' && equal_flag==1){
                        used_algebra.push(triadic_relation[ii][jj])
                    }
                }
            }
            else if(ii==calculate_step){
                // 正使用
                for(let jj=0;jj<triadic_relation[ii].length;jj++){
                    if (triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z' && 
                        (algebra_process.bottom_children_node.indexOf(triadic_relation[ii][jj])>=0||equal_flag == 0 )){ // 字母已知
                        // 组合字符串
                        algebra_text_mat[triadic_relation[ii][jj]] = variable_value[triadic_relation[ii][jj]][0]+triadic_relation[ii][jj]+variable_value[triadic_relation[ii][jj]][1]
                    }
                    else if(triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z'){
                        algebra_text_mat[triadic_relation[ii][jj]] = variable_value[triadic_relation[ii][jj]][0]+'?'+variable_value[triadic_relation[ii][jj]][1]
                    }
                    if(triadic_relation[ii][jj]=='='){
                        equal_flag = 1
                    }
                    if(triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z' && equal_flag==1){
                        using_algebra.push(triadic_relation[ii][jj])
                    }
                }
            }
            else{
                // 未使用
                for(let jj=0;jj<triadic_relation[ii].length;jj++){
                    if (triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z' && 
                        (algebra_process.bottom_children_node.indexOf(triadic_relation[ii][jj])>=0||
                        used_algebra.indexOf(triadic_relation[ii][jj])>=0)){ // 字母已知
                        // 组合字符串
                        algebra_text_mat[triadic_relation[ii][jj]] = variable_value[triadic_relation[ii][jj]][0]+triadic_relation[ii][jj]+variable_value[triadic_relation[ii][jj]][1]
                    }
                    else if(triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z'){
                        algebra_text_mat[triadic_relation[ii][jj]] = variable_value[triadic_relation[ii][jj]][0]+'?'+variable_value[triadic_relation[ii][jj]][1]
                    }
                    if(triadic_relation[ii][jj]=='='){
                        equal_flag = 1
                    }
                    if(triadic_relation[ii][jj]>='A'&&triadic_relation[ii][jj]<='Z' && equal_flag==1){
                        to_use_algebra.push(triadic_relation[ii][jj])
                    }
                }
            }
        }
        console.log('组装情况', algebra_text_mat,'\n已使用',used_algebra, '\n正使用',using_algebra, '\n将使用',to_use_algebra)
        // 层级存储，根据层级数目的多少去实际计算拓展间隔,元组间隔按照层级数组取存储、考虑单层的间隔、只影响到当前层级、设置反馈机制
        algebra_process.level_mat = []
        algebra_process.level_mat.push([algebra_process.top_parent_node])
        let level_flag = 0
        while (level_flag>=0){
            // for(let ii=0; ii<algebra_process.top_parent_node.length;ii++){
                // 
                //console.log('level_flag', level_flag)
                let level_children_mat = []
                for(let jj=0; jj<algebra_process.level_mat[level_flag].length;jj++){
                    // 查找前代数在某个等式的右边，提取对应右边代数式数组
                    let parent_equal_idx = algebra_process.equal_right.indexOf(algebra_process.level_mat[level_flag][jj])         // 找到当前代数存在的等式行，去插入左侧代数
                    if (parent_equal_idx>=0){
                        for(let kk=0;kk<algebra_process.equal_left_mat[parent_equal_idx].length;kk++){
                            level_children_mat.push(algebra_process.equal_left_mat[parent_equal_idx][kk])
                        }
                    }
                }
                if(level_children_mat.length>1){
                    algebra_process.level_mat.push(level_children_mat)
                    level_flag += 1
                }
                else{
                    level_flag = -1
                }
            // }
        }
        console.log('等式层级设置', algebra_process)
        // 建立逻辑处理图
        // 预设各代数的处理得到的宽度
        algebra_process.algebra_frame_size = {}              // 各框大小，根据实际更新
        // 函数计算框图大小
        for(let part_algebra_key in algebra_text_mat){
            //console.log('待分析字母框大小', part_algebra_key)
            algebra_process.algebra_frame_size[part_algebra_key]={}
            algebra_process.algebra_frame_size[part_algebra_key]['width'] = 0
            algebra_process.algebra_frame_size[part_algebra_key]['height'] = 0
            let [[algebra_frame_min_x,algebra_frame_max_x,algebra_frame_min_y,algebra_frame_max_y], 
                  algebra_row_txt_loc_c, algebra_row_txt_loc_lt, algebra_row_txt_loc_rb] = this.CalculateCharLoc(algebra_text_mat[part_algebra_key], algebra_num)
            //console.log('求解框大小', algebra_frame_min_x,algebra_frame_max_x,algebra_frame_min_y,algebra_frame_max_y)
            algebra_process.algebra_frame_size[part_algebra_key]['width'] = algebra_frame_max_x-algebra_frame_min_x+14
            algebra_process.algebra_frame_size[part_algebra_key]['height'] = algebra_frame_max_y-algebra_frame_min_y+14
        }
        //console.log('更新框图大小------------', algebra_process.algebra_frame_size)
        algebra_process.parent_gap =[]
        algebra_process.parent_color = []
        // 父组信息初始化：父组间隔
        for (let parent_ii=0;parent_ii<algebra_process.equal_right.length;parent_ii++){
            algebra_process.parent_gap[algebra_process.equal_right[parent_ii]] = {'gap_x':20, 'gap_y':30}      // 父组初始间隔
            algebra_process.parent_color[algebra_process.equal_right[parent_ii]] = 'white'      // 父组颜色
        }
        algebra_process.algebra_global_loc = []
        algebra_process.algebra_global_loc[algebra_process.top_parent_node] = {'global_x':all_global_x, 'global_y':all_global_y}      // 父组左上点全局坐标
        algebra_process.min_frame_gap = 10      // 最小组件间隔
        // algebra_process.algebra_global_loc['E'] = {'global_x':180, 'global_y':40}      // 父组全局
        // algebra_process.algebra_global_loc['F'] = {'global_x':180, 'global_y':40}      // 父组全局
        console.log('代数框大小处理', algebra_process)
        // 依次迭代计算逻辑
        let [global_symbol_width, global_symbol_height] = [30, 30]
        let svg_flag = 0
        let all_algebra_svg = []
        let draw_svg_data = {}      // 绘制SVG数据
        let draw_text_data = {}      // 绘制文字数据
        let svg_count_num = 0
        while (svg_flag>=0 && svg_count_num<100){
            let break_flag = 0
            all_algebra_svg = []
            for (let ii=0; ii<algebra_process.level_mat.length-1;ii++){
                if(ii==0){  // 顶层
                    // 依次根据单父得到对子的组件框图
                    let parent_mat=[]                   // [100,50]
                    let children_width_mat = []         // [60,90,80]
                    let children_height_mat =[]         // [50,40,30]
                    let symbol_width_mat=[]             // [30,30]
                    let symbol_height_mat=[]            // [30,30]
                    let gap_mat = []                    // [20, 30]
                    let global_mat = []                 // [10, 300] 全局坐标
                    let group_color = ''                // 父组件颜色
                    let parent_text = ''                //'我们有有22222'
                    let children_text = []              //['都有一个', '水电费', '需要交']
                    let symbol_text = []                // ['+','-']
                    console.log('框图结构设计')
                    let part_parent_algebra = algebra_process.level_mat[ii][0]      // 父代数
                    // 父代数的参数
                    parent_mat.push(algebra_process.algebra_frame_size[part_parent_algebra]['width'])
                    parent_mat.push(algebra_process.algebra_frame_size[part_parent_algebra]['height'])
                    gap_mat.push(algebra_process.parent_gap[part_parent_algebra]['gap_x'])
                    gap_mat.push(algebra_process.parent_gap[part_parent_algebra]['gap_y'])
                    group_color = algebra_process.parent_color[part_parent_algebra]
                    global_mat.push(algebra_process.algebra_global_loc[part_parent_algebra]['global_x'])
                    global_mat.push(algebra_process.algebra_global_loc[part_parent_algebra]['global_y'])
                    parent_text = algebra_text_mat[part_parent_algebra]
                    symbol_text = algebra_process.equal_symbol_mat[part_parent_algebra]
                    let part_parent_idx = algebra_process.equal_right.indexOf(part_parent_algebra)
                    let part_children_mat = algebra_process.equal_left_mat[part_parent_idx]
                    for (let kk=0;kk<part_children_mat.length;kk++){
                        // 对子组件赋值
                        children_width_mat.push(algebra_process.algebra_frame_size[part_children_mat[kk]]['width'])                   // [60,90,80]
                        children_height_mat.push(algebra_process.algebra_frame_size[part_children_mat[kk]]['height'])                  // [50,40,30]
                        if (kk>=1){
                            // 添加计算符号
                            symbol_width_mat.push(global_symbol_width)
                            symbol_height_mat.push(global_symbol_height)
                        }
                        children_text.push(algebra_text_mat[part_children_mat[kk]])
                    }
                    //console.log('组装数据')
                    let algebra_binary_mat = this.getgroupbinaryloc(parent_mat, children_width_mat, children_height_mat, symbol_width_mat, symbol_height_mat, gap_mat, global_mat,  group_color)
                    algebra_binary_mat.global_x = algebra_process.algebra_global_loc[part_parent_algebra]['global_x'] - algebra_binary_mat.parentTochildren.parent_loc.box_start_loc[0]
                    algebra_binary_mat.global_y = algebra_process.algebra_global_loc[part_parent_algebra]['global_y'] - algebra_binary_mat.parentTochildren.parent_loc.box_start_loc[1]
                    draw_svg_data[part_parent_algebra] = algebra_binary_mat     // 框图数据
                    draw_text_data[part_parent_algebra] = [parent_text, children_text, symbol_text]     // 文本数据
                    // 计算得到子组件的全局坐标
                    for(let ll=0; ll<algebra_binary_mat.parentTochildren.children_loc.box_start_loc.length;ll++){
                        // 为每个子组件赋值全局坐标
                        algebra_process.algebra_global_loc[algebra_process.equal_right_dict[part_parent_algebra][ll]] = {'global_x':algebra_binary_mat.parentTochildren.children_loc.box_start_loc[ll][0]+
                                                                                                                                    algebra_binary_mat.global_x, 
                                                                                                                         'global_y':algebra_binary_mat.parentTochildren.children_loc.box_start_loc[ll][1]+
                                                                                                                                    algebra_binary_mat.global_y}
                    }
                    //console.log('全局赋值', algebra_process)
                    // svg_flag = -1
                    // break
                    svg_count_num += 1
                }
                else{
                    // 非顶层设计
                    for(let mm=0;mm<algebra_process.level_mat[ii].length;mm++){
                        // 
                        // 依次根据单父得到对子的组件框图
                        let parent_mat=[]                   // [100,50]
                        let children_width_mat = []         // [60,90,80]
                        let children_height_mat =[]         // [50,40,30]
                        let symbol_width_mat=[]             // [30,30]
                        let symbol_height_mat=[]            // [30,30]
                        let gap_mat = []                    // [20, 30]
                        let global_mat = []                 // [10, 300] 全局坐标
                        let group_color = ''                // 父组件颜色
                        let parent_text = ''                //'我们有有22222'
                        let children_text = []              //['都有一个', '水电费', '需要交']
                        let symbol_text = []                // ['+','-']
                        // let unit_binary_mat = this.getgroupbinaryloc(parent_mat, children_width_mat, children_height_mat, symbol_width_mat, symbol_height_mat, gap_mat, global_mat,  group_color)
                        // let unit_svg_mat = this.getgroupbinarySVG(unit_binary_mat)
                        // //console.log('框图结构设计', unit_binary_mat)
                        let part_parent_algebra = algebra_process.level_mat[ii][mm]      // 父代数
                        if (algebra_process.bottom_children_node.indexOf(part_parent_algebra)<0){   // 不属于父参数
                            // 父代数的参数
                            parent_mat.push(algebra_process.algebra_frame_size[part_parent_algebra]['width'])
                            parent_mat.push(algebra_process.algebra_frame_size[part_parent_algebra]['height'])
                            //console.log('algebra_process.parent_gap', algebra_process.parent_gap, part_parent_algebra, algebra_process.parent_gap[part_parent_algebra])
                            gap_mat.push(algebra_process.parent_gap[part_parent_algebra]['gap_x'])
                            gap_mat.push(algebra_process.parent_gap[part_parent_algebra]['gap_y'])
                            group_color = algebra_process.parent_color[part_parent_algebra]
                            global_mat.push(algebra_process.algebra_global_loc[part_parent_algebra]['global_x'])
                            global_mat.push(algebra_process.algebra_global_loc[part_parent_algebra]['global_y'])
                            parent_text = algebra_text_mat[part_parent_algebra]
                            symbol_text = algebra_process.equal_symbol_mat[part_parent_algebra]
                            let part_parent_idx = algebra_process.equal_right.indexOf(part_parent_algebra)
                            let part_children_mat = algebra_process.equal_left_mat[part_parent_idx]
                            for (let kk=0;kk<part_children_mat.length;kk++){
                                // 对子组件赋值
                                children_width_mat.push(algebra_process.algebra_frame_size[part_children_mat[kk]]['width'])                   // [60,90,80]
                                children_height_mat.push(algebra_process.algebra_frame_size[part_children_mat[kk]]['height'])                  // [50,40,30]
                                if (kk>=1){
                                    // 添加计算符号
                                    symbol_width_mat.push(global_symbol_width)
                                    symbol_height_mat.push(global_symbol_height)
                                }
                                children_text.push(algebra_text_mat[part_children_mat[kk]])
                            }
                            //console.log('组装数据')
                            let algebra_binary_mat = this.getgroupbinaryloc(parent_mat, children_width_mat, children_height_mat, symbol_width_mat, symbol_height_mat, gap_mat, global_mat,  group_color)
                            // 更新计算全局坐标点---
                            algebra_binary_mat.global_x = algebra_process.algebra_global_loc[part_parent_algebra]['global_x'] - algebra_binary_mat.parentTochildren.parent_loc.box_start_loc[0]
                            algebra_binary_mat.global_y = algebra_process.algebra_global_loc[part_parent_algebra]['global_y'] - algebra_binary_mat.parentTochildren.parent_loc.box_start_loc[1]                       
                            draw_svg_data[part_parent_algebra] = algebra_binary_mat
                            draw_text_data[part_parent_algebra] = [parent_text, children_text, symbol_text]
                            // 计算得到子组件的全局坐标
                            for(let ll=0; ll<algebra_binary_mat.parentTochildren.children_loc.box_start_loc.length;ll++){
                                // 为每个子组件赋值全局坐标
                                algebra_process.algebra_global_loc[algebra_process.equal_right_dict[part_parent_algebra][ll]] = {'global_x':algebra_binary_mat.parentTochildren.children_loc.box_start_loc[ll][0]+
                                                                                                                                            algebra_binary_mat.global_x, 
                                                                                                                                'global_y':algebra_binary_mat.parentTochildren.children_loc.box_start_loc[ll][1]+
                                                                                                                                            algebra_binary_mat.global_y}
                            }
                            //console.log('全局赋值', algebra_process)
                            // svg_flag = -1
                        }
                        
                    }
                    // 算完一层 计算所有的子节点的框图间隔是否合理
                    for(let nn=0;nn<algebra_process.level_mat[ii+1].length-1;nn++){
                        //console.log('计算下层的框图间隔是否合理', algebra_process.level_mat[ii+1][nn], 
                                                                // algebra_process.algebra_global_loc[algebra_process.level_mat[ii+1][nn]]['global_x']+
                                                                // algebra_process.algebra_frame_size[algebra_process.level_mat[ii+1][nn]]['width'])
                        //console.log('计算下层的框图间隔是否合理', algebra_process.level_mat[ii+1][nn+1], algebra_process.algebra_global_loc[algebra_process.level_mat[ii+1][nn+1]])
                        let left_frame_right_loc_x =algebra_process.algebra_global_loc[algebra_process.level_mat[ii+1][nn]]['global_x']+
                                                    algebra_process.algebra_frame_size[algebra_process.level_mat[ii+1][nn]]['width']
                        let right_frame_left_loc_x =algebra_process.algebra_global_loc[algebra_process.level_mat[ii+1][nn+1]]['global_x']
                        if ((right_frame_left_loc_x-left_frame_right_loc_x)<algebra_process.min_frame_gap){
                            //console.log('组件间隔不够', right_frame_left_loc_x-left_frame_right_loc_x)
                            let left_child = algebra_process.level_mat[ii+1][nn]
                            let right_child = algebra_process.level_mat[ii+1][nn+1]
                            let left_parent,right_parent
                            // 查找到同一父组件，修改组件间隔
                            let layer_num = 0
                            while(1){
                                left_parent = algebra_process.children_parent_node[left_child]
                                right_parent = algebra_process.children_parent_node[right_child]
                                //console.log('父组节点', left_parent, right_parent)
                                layer_num += 1
                                if (left_parent == right_parent){
                                    // 修正父节点的数据
                                    let need_gap = (algebra_process.min_frame_gap-(right_frame_left_loc_x-left_frame_right_loc_x))/Math.pow(2, layer_num)
                                    algebra_process.parent_gap[left_parent]['gap_x'] = algebra_process.parent_gap[left_parent]['gap_x'] + need_gap
                                    break
                                }
                                else{
                                    left_child = left_parent
                                    right_child = right_parent
                                }
                            }
                            break_flag = 1
                            break
                        }
                    }
                }
            }
            svg_count_num += 1
            if (break_flag == 0){
                break
            }
        }
        // 根据先后顺序绘制图形
        // let algebra_svg_mat = this.getgroupbinarySVG(algebra_binary_mat)
        // //console.log('数组赋值', parent_mat, children_width_mat, children_height_mat, symbol_width_mat, symbol_height_mat, gap_mat, global_mat,  group_color, symbol_text)
        // all_algebra_svg.push(algebra_svg_mat)
        // //console.log('框图结构设计', algebra_binary_mat)
        // // let binary_text= this.setgroupbinarySVG(algebra_binary_mat, [parent_text, children_text, symbol_text], group_color)
        // let binary_text= this.textgroupbinarySVG(algebra_binary_mat, [parent_text, children_text, symbol_text], group_color, algebra_num)
        // all_algebra_svg.push(binary_text)
        console.log('绘制svg图像用', draw_svg_data)
        // 将使用
        for(let ii=0;ii<to_use_algebra.length;ii++){
            // for(let algebra_key in draw_svg_data){
                // 绘制框
            let algebra_key=to_use_algebra[ii]
            let frame_fill_color = 'white'
            let line_color = 'black'
            draw_svg_data[algebra_key].color = line_color
            let algebra_svg_mat = this.getgroupbinarySVG(draw_svg_data[algebra_key],frame_fill_color)
            all_algebra_svg.push(algebra_svg_mat)
            // 绘制文字
            let text_color = 'black'
            let binary_text= this.textgroupbinarySVG(draw_svg_data[algebra_key], draw_text_data[algebra_key], text_color, algebra_num)
            all_algebra_svg.push(binary_text)
        }
        // 已使用
        for(let ii=0;ii<used_algebra.length;ii++){
            // for(let algebra_key in draw_svg_data){
                // 绘制框
            let algebra_key=used_algebra[ii]
            let frame_fill_color = 'white'
            let line_color = 'green'
            draw_svg_data[algebra_key].color = line_color
            let algebra_svg_mat = this.getgroupbinarySVG(draw_svg_data[algebra_key],frame_fill_color)
            all_algebra_svg.push(algebra_svg_mat)
            // 绘制文字
            let text_color = 'green'
            let binary_text= this.textgroupbinarySVG(draw_svg_data[algebra_key], draw_text_data[algebra_key], text_color, algebra_num)
            all_algebra_svg.push(binary_text)
        }
        // 正在使用
        for(let ii=0;ii<using_algebra.length;ii++){
            // for(let algebra_key in draw_svg_data){
                // 绘制框
            let algebra_key=using_algebra[ii]
            let frame_fill_color = 'white'
            let line_color = 'red'
            draw_svg_data[algebra_key].color = line_color
            let algebra_svg_mat = this.getgroupbinarySVG(draw_svg_data[algebra_key],frame_fill_color)
            all_algebra_svg.push(algebra_svg_mat)
            // 绘制文字
            let text_color = 'red'
            let binary_text= this.textgroupbinarySVG(draw_svg_data[algebra_key], draw_text_data[algebra_key], text_color, algebra_num)
            all_algebra_svg.push(binary_text)
        }
        // 根据代数所对应的字符长度计算所需方框大小、对应字符串的分解结构、
        // 字符串组处理：计算每个字符的区间范围、分别定义；字体大小、汉字数字大小比9：5、数组归零计算
        // 设置组件间隔大小，统计三元组框大小、左右间隔、
        // 取框图绘制大小：
        let [svg_min_x,svg_max_x,svg_min_y,svg_max_y] = [10000, -10000, 100000, -10000]
        // algebra_frame_size global_x: 121.22, global_y: 82.2/A: {width: 107.33, height: 28}
        for(let algebra_key in algebra_process.algebra_global_loc){
            if(algebra_process.algebra_global_loc[algebra_key]['global_x']<svg_min_x){
                svg_min_x = algebra_process.algebra_global_loc[algebra_key]['global_x']
            }
            if(algebra_process.algebra_global_loc[algebra_key]['global_y']<svg_min_y){
                svg_min_y = algebra_process.algebra_global_loc[algebra_key]['global_y']
            }
            // 最大xy
            if((algebra_process.algebra_global_loc[algebra_key]['global_x']+algebra_process.algebra_frame_size[algebra_key]['width'])>svg_max_x){
                svg_max_x = algebra_process.algebra_global_loc[algebra_key]['global_x']+algebra_process.algebra_frame_size[algebra_key]['width']
            }
            if((algebra_process.algebra_global_loc[algebra_key]['global_y']+algebra_process.algebra_frame_size[algebra_key]['height'])>svg_max_y){
                svg_max_y = algebra_process.algebra_global_loc[algebra_key]['global_y']+algebra_process.algebra_frame_size[algebra_key]['height']
            }
        }
        //console.log('框大小', [svg_min_x,svg_max_x,svg_min_y,svg_max_y])
        let svg_left = all_global_x - svg_min_x
        let svg_top = all_global_y - svg_min_y
        let svg_height = Math.round((svg_max_y))+10
        let svg_height_down = Math.round((svg_max_y-svg_min_y))+10
        let svg_width_up = Math.round(svg_max_x)+10
        let svg_width_down = Math.round((svg_max_x - svg_min_x))+10
        console.log('框图归零', svg_height, svg_width_up,svg_width_down, svg_left, svg_top)
        let math_frame_svg = <Svg height={svg_height} width={svg_width_up} left = {-svg_min_x+5} top={-svg_min_y+5} style={styles.svg_bc5}>
                          {all_algebra_svg}        
                        </Svg>
        // 设计svg大小
        return (
          <View style={styles.container} onLayout={()=>{this.props.onLayoutMathFrameView?this.props.onLayoutMathFrameView(svg_width_down):null}}>
            <View height={svg_height_down} width={svg_width_down} left = {0} top={0}>
              {math_frame_svg}
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
});

