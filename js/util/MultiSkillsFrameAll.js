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
    ScrollView,
    Text as RN_Text
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
import { pxToDp } from './tools';

const r_width = 1000
const r_height = 2000
let combine_dict = {'1':'Ⅰ、 ','2':'Ⅱ、 ','3':'Ⅲ、 ','4':'Ⅳ、 ','5':'Ⅴ、 ','6':'Ⅵ、 ','7':'Ⅶ、 ','8':'Ⅷ、 ','9':'Ⅸ、 ','10':'Ⅹ、 ','11':'Ⅺ、 ','12':'Ⅻ、 '}

export default class MultiSkillMode extends PureComponent {
    constructor(props) {
        super(props);
    }

    multiskillmode1 = (num1, num2, text_mat)=>{
        // 设计svg大小
        // 第一层 展示：3 4 5 x 11
        // 第二层展示： 3 7 9 5 
        // 第三层展示： 3 7 9 5
        let layer_1st = []
        let layer_2nd = []
        let num1_str = num1.toString()
        // console.log('num1_str', num1_str)
        for (let ii=0;ii<num1_str.length; ii++){
            // console.log('第二层数据', ii)
            if (ii==0){
                layer_2nd.push(num1_str[ii])
                layer_2nd.push((eval(num1_str[ii]+'+'+num1_str[ii+1])).toString())
            }
            else if (ii==num1_str.length-1){
                layer_2nd.push(num1_str[ii])
            }
            else{
                layer_2nd.push((eval(num1_str[ii]+'+'+num1_str[ii+1])).toString())
            }
            layer_1st.push(num1_str[ii])
        }
        layer_1st.push('x')
        layer_1st.push(num2.toString())
        let end_num =eval(num1)*eval(num2)
        let end_str = end_num.toString()
        let layer_3rd = []
        if (end_str.length==layer_2nd.length){
            // 长度相同
            layer_3rd=end_str.split('')
        }
        else if(end_str.length>layer_2nd.length){
            // 长度不同
            for(let ii=0 ;ii<end_str.length;ii++){
                // console.log(ii)
                if(ii==0){
                    layer_3rd.push(end_str[ii]+end_str[ii+1])
                    // ii += 1
                    ii = 1
                }
                else{
                    layer_3rd.push(end_str[ii])
                }
            }

        }
        console.log('框图第一层数据', layer_1st)
        console.log('框图第二层数据', layer_2nd)
        console.log('框图第三层数据', layer_3rd)
        // 设置 标准间隔
        let font_size = 20  // 字体大小
        let gap_x = 60      // 横向间隔
        let gap_y = 60      // 纵向间隔
        let gap_y_min = 5   // 连线间隙
        let max_height = 0
        let max_width = 0
        let loc_1st = []    // 第一层坐标
        for(let ii=0;ii<layer_1st.length;ii++){
            let loc_x = gap_x*ii + gap_x
            if (ii==layer_1st.length-1){
                loc_x = gap_x*ii + gap_x*0.5
            }
            let loc_y = font_size
            loc_1st.push([loc_x, loc_y])
            if (max_height<loc_y){
                max_height = loc_y
            }
            if (max_width<loc_x){
                max_width = loc_x
            }
        }
        let loc_2nd = []    // 第二层坐标
        let loc_3rd = []    // 第三层坐标
        for(let ii=0;ii<layer_2nd.length;ii++){
            let loc_x = gap_x*ii + gap_x/2
            let loc_y = font_size + gap_y
            loc_2nd.push([loc_x, loc_y])
            loc_3rd.push([loc_x, loc_y+gap_y])
            if (max_height<loc_y+gap_y){
                max_height = loc_y+gap_y
            }
            if (max_width<loc_x){
                max_width = loc_x
            }
        }
        console.log('框图第一层坐标', loc_1st)
        console.log('框图第二层坐标', loc_2nd)
        console.log('框图第三层坐标', loc_3rd)
        let text_svg = []
        // 放置数字---第一层
        
        for (let ii=0;ii<loc_1st.length;ii++){
            text_svg.push(<Text x={loc_1st[ii][0]} 
                                y={loc_1st[ii][1]} 
                                // fill={group_color}
                                fill='black'
                                backgroundColor='transparent' 
                                // width='120 '
                                // height='120'
                                fontSize = {font_size}
                            >{layer_1st[ii]}</Text>)
        }  
        // 放置数字---第二层
        for (let ii=0;ii<loc_2nd.length;ii++){
            text_svg.push(<Text x={loc_2nd[ii][0]} 
                                y={loc_2nd[ii][1]} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                            >{layer_2nd[ii]}</Text>)
        }
        // 放置数字---第三层
        for (let ii=0;ii<loc_3rd.length;ii++){
            text_svg.push(<Text x={loc_3rd[ii][0]} 
                                y={loc_3rd[ii][1]} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                            >{layer_3rd[ii]}</Text>)
        }
        // 画框
        for (let ii=1;ii<loc_2nd.length-1;ii++){
            text_svg.push(<Rect x={loc_2nd[ii][0]+layer_2nd[ii].length*font_size*0.6-(font_size*1.5/2+layer_2nd[ii].length*font_size*0.6/2)} 
                                y={loc_2nd[ii][1]-font_size*1.1} 
                                width={font_size*1.5} 
                                height={font_size+gap_y_min*2} 
                                fill="transparent" 
                                strokeWidth="1.8" 
                                stroke="red"/>)
            // 画+号
            text_svg.push(<Text x={loc_2nd[ii][0]+layer_2nd[ii].length*font_size*0.6-(font_size*1.5/2+layer_2nd[ii].length*font_size*0.6/2)+font_size*0.4}  
                                y={loc_2nd[ii][1]-font_size*1.5} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                            >{"+"}</Text>)
        }
        // 画线
        for(let ii=0;ii<loc_1st.length-2;ii++){
            // 左斜线
            text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.2}   //x轴的开始位置
                                y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                                x2={loc_2nd[ii][0]+layer_2nd[ii].length*font_size*0.6-(layer_2nd[ii].length*font_size*0.6/2)}   //x轴的结束位置
                                y2={loc_2nd[ii][1]-font_size*1.1}   //y轴的结束位置
                                stroke="red"  //填充颜色
                                strokeWidth="1.8"  //填充宽度
                            />)
                            // 右斜线
            text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.4}   //x轴的开始位置
                                y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                                x2={loc_2nd[ii+1][0]+layer_2nd[ii+1].length*font_size*0.6-(layer_2nd[ii+1].length*font_size*0.6/2)}   //x轴的结束位置
                                y2={loc_2nd[ii+1][1]-font_size*1.1}   //y轴的结束位置
                                stroke="red"  //填充颜色
                                strokeWidth="1.8"  //填充宽度
                            />)
        }
        // let explain_text_svg =  <Svg height= {max_height+5} width={max_width+font_size*1.3} backgroundColor={'red'}>
        //                             <Text   x={20}
        //                                     y={20}
        //                                     height= {max_height+5} 
        //                                     width={max_width+font_size*1.3}
        //                                     top = {20} 
        //                                     fill='black' 
        //                                     fontSize = {font_size*1} 
        //                                     backgroundColor={'red'}>{text_mat[0]}</Text>
        //                         </Svg>
        let explain_str_mat = []
        explain_str_mat.push(num1_str+'x'+'11')         // J×E
        explain_str_mat.push(num1_str)                  // 
        let num_str_mat = num1_str.split('')            
        explain_str_mat.push(num_str_mat.join('、'))    // A、B、C、D
        explain_str_mat.push(num_str_mat[0]+'、'+num_str_mat[num_str_mat.length-1])     //A、D
        let combine_mat = []
        for(let ii=0;ii<num_str_mat.length-1;ii++){
            combine_mat.push(num_str_mat[ii]+'+'+num_str_mat[ii+1])
        }
        explain_str_mat.push(combine_mat.join('、'))            // A+B、B+C、C+D
        explain_str_mat.push((num1*num2).toString())
        console.log('explain_str_mat------', explain_str_mat)
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                {'题目：'+num1_str+'x'+num2+'='+explain_str_mat[explain_str_mat.length-1]}
                            </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let math_frame_svg = <Svg   height= {max_height+5} width={max_width+font_size*1.3} style={styles.svg_bc5}>
                                     {text_svg}     
                            </Svg>
        // this.props._setName(r_width,r_height);
        return  (
                <View style={styles.container}>
                    {/* {[explain_text_svg,math_frame_svg]} */}
                    {/* {explain_text_svg} */}
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {math_frame_svg}
                </View>
                );
    }

    multiskillmode2=(num1, num2, text_mat)=>{
        // 设计svg大小
        // 第一层 展示：3 4   x  3 6
        // 第二层展示： 4
        // 第三层展示： 12 24
        let layer_1st = []
        let layer_2nd = []
        let layer_3rd = []
        let num1_str = num1.toString()
        let num2_str = num2.toString()
        // console.log('num1_str', num1_str)
        // 第一层
        layer_1st.push(num1_str.split(''))
        layer_1st.push('x')
        layer_1st.push(num2_str.split(''))
        // console.log('layer_1st' , layer_1st)
        layer_1st = layer_1st.flat()    // 平铺数据
        console.log('layer_1st' , layer_1st)
        layer_2nd.push((eval(num1_str[0]+'+'+1)).toString())
        layer_2nd.push('+1')
        console.log('layer_2nd' , layer_2nd)
        layer_3rd.push((eval(num1_str[0]+'+'+1)*eval(num2_str[0])).toString())
        if (eval(num1_str[1])*eval(num2_str[1])<10){
            layer_3rd.push('0'+(eval(num1_str[1])*eval(num2_str[1])).toString())
        }
        else{
            layer_3rd.push((eval(num1_str[1])*eval(num2_str[1])).toString())
        }
        console.log('layer_3rd' , layer_3rd)
        // 设置 标准间隔
        let font_size = 20  // 字体大小
        let gap_x = 60      // 横向间隔
        let gap_y = 60      // 纵向间隔
        let gap_y_min = 5   // 连线间隙
        let max_height = 0
        let max_width = 0
        let loc_1st = []    // 第一层坐标
        let loc_2nd = []    // 第二层坐标
        let loc_3rd = []    // 第三层坐标
        loc_1st.push([gap_x,font_size])
        loc_1st.push([gap_x+font_size,font_size])
        loc_1st.push([gap_x+font_size+gap_x,font_size])
        loc_1st.push([gap_x+font_size+gap_x+gap_x,font_size])
        loc_1st.push([gap_x+font_size+gap_x+gap_x+font_size,font_size])
        if (max_width<gap_x+font_size+gap_x+gap_x+font_size){
            max_width = gap_x+font_size+gap_x+gap_x+font_size
        }
        console.log('一层坐标', JSON.stringify(loc_1st))
        loc_2nd.push([gap_x,font_size+gap_y*1.2])     // 数字
        loc_2nd.push([gap_x-2*font_size*0.6,font_size+gap_y*1.2/2])     // +1
        console.log('二层坐标', JSON.stringify(loc_2nd))
        loc_3rd.push([gap_x+font_size, font_size+gap_y*2])
        loc_3rd.push([gap_x+font_size+gap_x+gap_x, font_size+gap_y*2])
        max_height = font_size+gap_y*2
        console.log('三层坐标', JSON.stringify(loc_3rd))
        let text_svg = []
        // 放置数字---第一层
        for (let ii=0;ii<loc_1st.length;ii++){
                text_svg.push(<Text x={loc_1st[ii][0]} 
                                    y={loc_1st[ii][1]} 
                                    // fill={group_color}
                                    fill='black'
                                    backgroundColor='transparent' 
                                    // width='120 '
                                    // height='120'
                                    fontSize = {font_size}
                                >{layer_1st[ii]}</Text>)
        }
        // 放置数字---第一层
        for (let ii=0;ii<loc_2nd.length;ii++){
            text_svg.push(<Text x={loc_2nd[ii][0]} 
                                y={loc_2nd[ii][1]} 
                                // fill={group_color}
                                fill='black'
                                backgroundColor='transparent' 
                                // width='120 '
                                // height='120'
                                fontSize = {font_size}
                            >{layer_2nd[ii]}</Text>)
        }
        // 放置数字---第三层
        for (let ii=0;ii<loc_3rd.length;ii++){
            text_svg.push(<Text x={loc_3rd[ii][0]} 
                                y={loc_3rd[ii][1]} 
                                // fill={group_color}
                                fill='black'
                                backgroundColor='transparent' 
                                // width='120 '
                                // height='120'
                                fontSize = {font_size}
                            >{layer_3rd[ii]}</Text>)
        }
        // 画线
        for (let ii=0;ii<loc_1st.length;ii++){
            if(ii==0){
                text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.3}   //x轴的开始位置
                                    y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                                    x2={loc_2nd[ii][0]+font_size*0.3}   //x轴的结束位置
                                    y2={loc_2nd[ii][1]-font_size*1.1}   //y轴的结束位置
                                    stroke="red"  //填充颜色
                                    strokeWidth="1.8"  //填充宽度
                                />)
            }
            else if(ii==1){
                text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.3}   //x轴的开始位置
                                    y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                                    x2={loc_3rd[1][0]}   //x轴的结束位置
                                    y2={loc_3rd[1][1]-font_size*1.1}   //y轴的结束位置
                                    stroke="red"  //填充颜色
                                    strokeWidth="1.8"  //填充宽度
                                />)
            }
            else if(ii==3){
                text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.3}   //x轴的开始位置
                    y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                    x2={loc_3rd[0][0]+layer_3rd[0].length*font_size*0.5}   //x轴的结束位置
                    y2={loc_3rd[0][1]-font_size*1.1}   //y轴的结束位置
                    stroke="red"  //填充颜色
                    strokeWidth="1.8"  //填充宽度
                />)
            }
            else if(ii==4){
                text_svg.push(<Line x1={loc_1st[ii][0]+font_size*0.3}   //x轴的开始位置
                    y1={loc_1st[ii][1]+gap_y_min}   //y轴的开始位置
                    x2={loc_3rd[1][0]+layer_3rd[1].length*font_size*0.4}   //x轴的结束位置
                    y2={loc_3rd[1][1]-font_size*1.1}   //y轴的结束位置
                    stroke="red"  //填充颜色
                    strokeWidth="1.8"  //填充宽度
                />)
            }
        }
        // 下线
        text_svg.push(<Line x1={loc_2nd[0][0]+font_size*0.3}   //x轴的开始位置
                            y1={loc_2nd[0][1]+gap_y_min}   //y轴的开始位置
                            x2={loc_3rd[0][0]+font_size*0.3}   //x轴的结束位置
                            y2={loc_3rd[0][1]-font_size*1.1}   //y轴的结束位置
                            stroke="red"  //填充颜色
                            strokeWidth="1.8"  //填充宽度
                        />)
        // 画×号
        text_svg.push(<Text x={loc_3rd[0][0]+layer_3rd[0].length*font_size*0.4/2} 
                            y={loc_3rd[0][1]-font_size*1.4} 
                            // fill={group_color}
                            fill='red'
                            backgroundColor='transparent' 
                            // width='120 '
                            // height='120'
                            fontSize = {font_size*0.8}
                        >{'X'}</Text>)
        text_svg.push(<Text x={loc_3rd[1][0]+layer_3rd[1].length*font_size*0.2/2} 
                            y={loc_3rd[1][1]-font_size*1.4} 
                            // fill={group_color}
                            fill='red'
                            backgroundColor='transparent' 
                            // width='120 '
                            // height='120'
                            fontSize = {font_size*0.8}
                        >{'X'}</Text>)
        // 画箭头
        text_svg.push(<Line x1={loc_2nd[0][0]+font_size*0.15}   //x轴的开始位置
            y1={loc_2nd[0][1]-font_size*1.5}   //y轴的开始位置
            x2={loc_2nd[0][0]+font_size*0.3}   //x轴的结束位置
            y2={loc_2nd[0][1]-font_size*1.1}   //y轴的结束位置
            stroke="red"  //填充颜色
            strokeWidth="1.8"  //填充宽度
        />)
        text_svg.push(<Line x1={loc_2nd[0][0]+font_size*0.45}   //x轴的开始位置
            y1={loc_2nd[0][1]-font_size*1.5}   //y轴的开始位置
            x2={loc_2nd[0][0]+font_size*0.3}   //x轴的结束位置
            y2={loc_2nd[0][1]-font_size*1.1}   //y轴的结束位置
            stroke="red"  //填充颜色
            strokeWidth="1.8"  //填充宽度
        />)
        let explain_str_mat = []
        let num1_str_mat = num1_str.split('')
        let num2_str_mat = num2_str.split('')
        explain_str_mat.push(num1_str+'、'+num2_str)         // A、B
        explain_str_mat.push(num1_str_mat[num1_str_mat.length-1]+'、'+num2_str[num2_str_mat.length-1]) // E、G
        explain_str_mat.push('('+num1_str_mat[0]+'+1)x'+num2_str_mat[0])    // （D+1）×F
        explain_str_mat.push((eval('('+num1_str_mat[0]+'+1)*'+num2_str_mat[0])).toString())    // （D+1）×F
        explain_str_mat.push(num1_str_mat[1]+'x'+num2_str_mat[1])    // E×G
        explain_str_mat.push((eval(num1_str_mat[1]+'*'+num2_str_mat[1])).toString())    // K
        explain_str_mat.push((num1*num2).toString())
        explain_str_mat.push((num1*num2).toString())
        explain_str_mat.push(num1_str+'x'+num2_str)
        console.log('explain_str_mat------', explain_str_mat)
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text0 =  <RN_Text style={styles.text_style}>
                            {'题目：'+num1_str+'x'+num2+'='+explain_str_mat[explain_str_mat.length-2]}
                        </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let math_frame_svg = <Svg   height= {max_height+5} width={max_width+font_size} style={styles.svg_bc5}>
                                     {text_svg}     
                        </Svg>
        return (
            <View style={styles.container}>
                {explain_text0}
                {explain_text1}
                {explain_text2}
                {math_frame_svg}
            </View>
        );
    }
    addskillmode1=(center_num, bias_mat, text_mat)=>{
        console.log('center_num', center_num, 'bias_mat', JSON.stringify(bias_mat))
        let text_svg = []           // 装text
        let font_size = 20  // 字体大小
        let gap_y = 30      // 纵向间隔
        let start_x = 30
        let start_y = 30
        let max_height = 0
        let max_width = 0
        let layer_1st = ''
        for(let ii=0;ii<bias_mat.length;ii++){
            if(ii==0){
                layer_1st += '   '
                layer_1st += (center_num+bias_mat[ii]).toString()
            }
            else{
                layer_1st += '+'
                layer_1st += (center_num+bias_mat[ii]).toString()
            }
            
        }
        console.log('第一层', layer_1st)
        text_svg.push(<Text x={start_x} 
                            y={start_y} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_1st}</Text>)
        if(max_width<layer_1st.length*font_size*0.6){
            max_width = layer_1st.length*font_size*0.6
        }
        if(max_height<start_y+font_size){
            max_height = start_y+font_size
        }
        let layer_2nd = ''
        for(let ii=0;ii<bias_mat.length;ii++){
            if(ii==0){
                layer_2nd += '='
                if(bias_mat[ii]>0){
                    layer_2nd += '('+center_num+'+'+bias_mat[ii]+')'
                }
                else if(bias_mat[ii]<0){
                   layer_2nd += '('+center_num+'-'+Math.abs(bias_mat[ii])+')'
                }
                else{
                    layer_2nd += center_num
                }
            }
            else{
                layer_2nd += '+'
                if(bias_mat[ii]>0){
                    layer_2nd += '('+center_num+'+'+bias_mat[ii]+')'
                }
                else if(bias_mat[ii]<0){
                   layer_2nd += '('+center_num+'-'+Math.abs(bias_mat[ii])+')'
                }
                else{
                    layer_2nd += center_num
                }
            } 
        }
        console.log('第二层', layer_2nd)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_2nd}</Text>)
        if(max_width<layer_2nd.length*font_size*0.52){
            max_width = layer_2nd.length*font_size*0.52
        }
        if(max_height<start_y+gap_y+font_size){
            max_height = start_y+gap_y+font_size
        }
        // 第三层
        let layer_3rd = ''
        layer_3rd += '='+center_num+'x'+bias_mat.length+'+'
        for (let ii=0;ii<bias_mat.length;ii++){
            if (ii==0){
                // 开头
                layer_3rd += '('+ bias_mat[ii]
            }
            else{
                if(bias_mat[ii]>0){
                    layer_3rd += '+'+ bias_mat[ii]
                }
                else if(bias_mat[ii]<0){
                    layer_3rd += '-'+ Math.abs(bias_mat[ii])
                }
            }
        }
        layer_3rd += ')'
        console.log('第三层', layer_3rd)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*2} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_3rd}</Text>)
        if(max_width<layer_3rd.length*font_size*0.52){
            max_width = layer_3rd.length*font_size*0.52
        }
        if(max_height<start_y+gap_y*2+font_size){
            max_height = start_y+gap_y*2+font_size
        }
        // 第四层
        let layer_4th = ''
        layer_4th += '='+eval(center_num+'*'+bias_mat.length)+'+'
        let positive_str = ''
        let negative_str = ''
        let positive_num = 0
        let negative_num = 0
        for (let ii=0;ii<bias_mat.length;ii++){
            if(bias_mat[ii]>0){
                if (positive_str == ''){
                    positive_str += bias_mat[ii]
                }
                else{
                    positive_str += '+'+ bias_mat[ii]
                }
                positive_num += 1
            }
            else if(bias_mat[ii]<0){
                if (negative_str == ''){
                    negative_str += Math.abs(bias_mat[ii])
                }
                else{
                    negative_str += '+'+ Math.abs(bias_mat[ii])
                }
                negative_num += 1
            }
        }
        // 一组不添加括弧
        if(positive_num<=1){
            layer_4th += positive_str
        }
        else{
            layer_4th += '(' + positive_str + ')'
        }
        if(negative_num<=1){
            layer_4th += '-'+negative_str
        }
        else{
            layer_4th += '-(' + negative_str + ')'
        }
        // layer_4th += '(' + positive_str+')-('+negative_str+')'
        console.log('第四层', layer_4th)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*3} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_4th}</Text>)
        if(max_width<layer_4th.length*font_size*0.52){
            max_width = layer_4th.length*font_size*0.52
        }
        if(max_height<start_y+gap_y*3+font_size){
            max_height = start_y+gap_y*3+font_size
        }
        // 第五层
        let layer_5th = '='+eval(center_num+'*'+bias_mat.length)+'+'+eval(positive_str)+'-'+eval(negative_str)
        console.log('第五层', layer_5th)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*4} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_5th}</Text>)
        if(max_width<layer_5th.length*font_size*0.52){
            max_width = layer_5th.length*font_size*0.52
        }
        if(max_height<start_y+gap_y*4+font_size){
            max_height = start_y+gap_y*4+font_size
        }
        // 第六层
        let layer_6th = '='+eval(center_num+'*'+bias_mat.length+'+'+eval(positive_str)+'-'+eval(negative_str))
        console.log('第六层', layer_6th)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*5} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_6th}</Text>)
        if(max_width<layer_6th.length*font_size*0.52){
            max_width = layer_6th.length*font_size*0.52
        }
        if(max_height<start_y+gap_y*5+font_size){
            max_height = start_y+gap_y*5+font_size
        }
        // alert('字符串结果：'+layer_6th+'\n原始加法计算:'+eval(layer_1st))
        // console.log('原始加法计算', eval(layer_1st))
        let math_frame_svg = <Svg  height= {max_height+5} 
                                   width={max_width+font_size} 
                                   style={styles.svg_bc5}>
                                {text_svg}     
                             </Svg>     // 封装SVG
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                    {'计算：'+layer_1st}
                                </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                    {text_mat[0]}
                                </RN_Text>
        let explain_str_mat = []
        explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))         // A、B
        explain_str_mat.push(center_num)
        explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))         // A、B
        explain_str_mat.push(center_num)
        explain_str_mat.push(layer_2nd.replace('=','').replace(/\)\+\(/g, ") + ("))
        explain_str_mat.push(layer_3rd.replace('=',''))
        console.log('explain_str_mat------', explain_str_mat)
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let explain_text3 =  <RN_Text style={styles.text_style}>
                                {'    详细计算过程如下：'}
                            </RN_Text>
        return (<View style={styles.container}>
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {explain_text3}
                    {math_frame_svg}
                </View>)
    }

    judgeSameMat = (num_mat)=>{
        // 判定全等数
        for (let ii=0;ii<num_mat.length-1;ii++){
            if(num_mat[ii]!=num_mat[ii+1]){
                return -1
            }
        }
        return 1
    }

    addskillmode2=(num_mat, base_mat,bias_mat2,text_mat)=>{
        let text_svg = []           // 装text
        let font_size = 20  // 字体大小
        let gap_y = 30      // 纵向间隔
        let start_x = 30
        let start_y = 30
        let max_height = 0
        let max_width = 0
        let layer_1st = ''
        for(let ii=0;ii<num_mat.length;ii++){
            if(ii==0){
                layer_1st += '   '
                layer_1st += (num_mat[ii]).toString()
            }
            else{
                layer_1st += '+'
                layer_1st += (num_mat[ii]).toString()
            }  
        }
        console.log('第一层', layer_1st)
        text_svg.push(<Text x={start_x} 
                            y={start_y} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_1st}</Text>)
        if(max_width<layer_1st.length*font_size*0.6){
            max_width = layer_1st.length*font_size*0.6
        }
        if(max_height<start_y+font_size){
            max_height = start_y+font_size
        }
        // 第二层
        let layer_2nd = '='
        let bias_str = ''
        // for(let ii=0;ii<num_mat.length;ii++){
        //     if(ii==0){
        //         layer_2nd += '('+num_mat[ii]+'+'+bias_mat2[ii]+')'
        //         bias_str += bias_mat2[ii]
        //     }
        //     else{
        //         layer_2nd += '+('+num_mat[ii]+'+'+bias_mat2[ii]+')'
        //         bias_str += '+' + bias_mat2[ii]
        //     }  
        // }
        // layer_2nd += '-('+bias_str+')'
        if (this.judgeSameMat(bias_mat2)==1){
            // 全等
            for(let ii=0;ii<num_mat.length;ii++){
                if(ii==0){
                    layer_2nd += '('+base_mat[ii]+'-'+bias_mat2[ii]+')'
                }
                else{
                    layer_2nd += '+('+base_mat[ii]+'-'+bias_mat2[ii]+')'
                }
            }
            bias_str = bias_mat2.length+'x'+bias_mat2[0]
        }
        else{
            for(let ii=0;ii<num_mat.length;ii++){
                if(ii==0){
                    layer_2nd += '('+base_mat[ii]+'-'+bias_mat2[ii]+')'
                }
                else{
                    layer_2nd += '+('+base_mat[ii]+'-'+bias_mat2[ii]+')'
                }
            }
            bias_str = bias_mat2.join('+')
        }
        console.log('第2层', layer_2nd)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_2nd}</Text>)
        if(max_width<layer_2nd.length*font_size*0.53){
            max_width = layer_2nd.length*font_size*0.53
        }
        if(max_height<start_y+gap_y+font_size){
            max_height = start_y+gap_y+font_size
        }
        // 第三层
        let layer_3rd = ''
        // for(let ii=0;ii<num_mat.length;ii++){
        //     if(ii==0){
        //         layer_3rd += eval(num_mat[ii]+'+'+bias_mat2[ii])
        //     }
        //     else{
        //         layer_3rd += '+'+eval(num_mat[ii]+'+'+bias_mat2[ii])
        //     }  
        // }
        if (this.judgeSameMat(bias_mat2)==1){
            layer_3rd = base_mat.join('+')
        }
        else{
            layer_3rd = base_mat.join('+')
        }
        // console.log('layer_3rd',layer_3rd)
        let layer_4th_num = eval(layer_3rd)
        // layer_3rd = '='+layer_3rd+'-'+eval(bias_mat2.join('+'))

        
        if (this.judgeSameMat(bias_mat2)==1){
            layer_3rd = '='+layer_3rd+'-'+bias_str
        }
        else{
            layer_3rd = '='+layer_3rd+'-('+bias_str+')'
        }
        console.log('第3层', layer_3rd)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*2} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_3rd}</Text>)
        if(max_width<layer_3rd.length*font_size*0.6){
            max_width = layer_3rd.length*font_size*0.6
        }
        if(max_height<start_y+gap_y*2+font_size){
            max_height = start_y+gap_y*2+font_size
        }
        // 第四层
        let layer_4th = '='+layer_4th_num+'-'+eval(bias_mat2.join('+'))
        console.log('第4层', layer_4th)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*3} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_4th}</Text>)
        if(max_width<layer_4th.length*font_size*0.6){
            max_width = layer_4th.length*font_size*0.6
        }
        if(max_height<start_y+gap_y*3+font_size){
            max_height = start_y+gap_y*3+font_size
        }
        // 第四层
        let layer_5th = '='+eval(layer_4th_num+'-'+eval(bias_mat2.join('+')))
        console.log('第5层', layer_5th)
        text_svg.push(<Text x={start_x} 
                            y={start_y+gap_y*4} 
                            fill='black'
                            backgroundColor='transparent' 
                            fontSize = {font_size}
                            >{layer_5th}</Text>)
        if(max_width<layer_5th.length*font_size*0.6){
            max_width = layer_5th.length*font_size*0.6
        }
        if(max_height<start_y+gap_y*4+font_size){
            max_height = start_y+gap_y*4+font_size
        }
        // alert('字符串结果：'+layer_5th+'\n原始加法计算:'+eval(layer_1st))
        console.log('原始加法计算', eval(layer_1st))
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                {'计算：'+layer_1st}
                            </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_str_mat = []
        if (this.judgeSameMat(bias_mat2)==1){
            // 全相同
            console.log('---------')
            explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))         // A、B
            explain_str_mat.push(base_mat.join('、'))         // A、B
            explain_str_mat.push(bias_mat2[0])         // A、B
            explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))
            explain_str_mat.push(layer_2nd.replace('=','').replace(/\+/g, "、"))
            explain_str_mat.push(layer_1st.replace(/\ /g, "").replace(/\+/g, " + "))         // A、B
            explain_str_mat.push(layer_2nd.replace('=','').replace(/\+/g, " + "))
            explain_str_mat.push(layer_3rd.replace('=','').replace(/\+/g, " + "))
            explain_str_mat.push(base_mat.join(' + '))
            explain_str_mat.push(bias_str)
        }
        else{
            console.log('---------')
            explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))         // A、B
            explain_str_mat.push(base_mat.join('、'))         // A、B
            explain_str_mat.push(bias_mat2.join('、'))         // A、B
            explain_str_mat.push(layer_1st.replace(/\+/g, "、").replace(/\ /g, ""))
            explain_str_mat.push(layer_2nd.replace('=','').replace(/\+/g, "、"))
            explain_str_mat.push(layer_1st.replace(/\ /g, "").replace(/\+/g, " + "))         // A、B
            explain_str_mat.push(layer_2nd.replace('=','').replace(/\+/g, " + "))
            explain_str_mat.push(layer_3rd.replace('=','').replace(/\+/g, " + "))
            explain_str_mat.push(base_mat.join(' + '))
            explain_str_mat.push(bias_str)
        }
        console.log('explain_str_mat------000', explain_str_mat)
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let explain_text3 =  <RN_Text style={styles.text_style}>
                                {'    详细计算过程如下：'}
                            </RN_Text>
        return (<View style={styles.container}>
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {explain_text3}
                    {math_frame_svg}
                </View>)
    }

    addskillmode3=(num_mat, diff_value,text_mat)=>{
        // 配对求和
        let all_str = []
        let layer_1st = num_mat.join('+')
        console.log('第1层数据', layer_1st)
        let layer_2nd = '('+num_mat[0]+'+'+num_mat[num_mat.length-1]+')'+'x'+num_mat.length+'÷2'
        console.log('第2层数据', layer_2nd)
        let layer_3rd = eval('('+num_mat[0]+'+'+num_mat[num_mat.length-1]+')')+'x'+num_mat.length+'÷2'
        console.log('第3层数据', layer_3rd)
        let layer_4th = (eval(layer_1st)).toString()
        console.log('第4层数据', layer_4th)
        all_str.push(layer_1st)
        all_str.push(layer_2nd)
        all_str.push(layer_3rd)
        all_str.push(layer_4th)
        let text_svg = []           // 装text
        let font_size = 20  // 字体大小
        let gap_y = 30      // 纵向间隔
        let start_x = 30
        let start_y = 30
        let max_height = 0
        let max_width = 0
        for(let ii=0;ii<all_str.length;ii++){
            // 
            if(ii==0){
                text_svg.push(<Text x={start_x} 
                                    y={start_y+gap_y*0} 
                                    fill='black'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{'   '+all_str[ii]}</Text>)
            }
            else{
                text_svg.push(<Text x={start_x} 
                    y={start_y+gap_y*ii} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{'='+all_str[ii]}</Text>)
            }
            if(max_width<(all_str[ii].length+2)*font_size*0.6){
                max_width = (all_str[ii].length+2)*font_size*0.6
            }
            if(max_height<start_y+gap_y*ii+font_size){
                max_height = start_y+gap_y*ii+font_size
            }
        }
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                {'计算：'+layer_1st}
                            </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_str_mat = []     
        explain_str_mat.push(num_mat.join('、'))               
        explain_str_mat.push(num_mat[1]-num_mat[0])               
        let combine_mat=[]
        for(let ii=0;ii<num_mat.length/2;ii++){
            combine_mat.push('('+num_mat[ii]+'+'+num_mat[num_mat.length-ii-1]+')')
        } 
        explain_str_mat.push(combine_mat.join('、'))  
        explain_str_mat.push(num_mat.length)               
        explain_str_mat.push(num_mat.length/2)               
        explain_str_mat.push("("+num_mat[0]+'+'+num_mat[num_mat.length-1]+")x"+num_mat.length+'÷'+2)               
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let explain_text3 =  <RN_Text style={styles.text_style}>
                                {'    详细计算过程如下：'}
                            </RN_Text>
        return (<View style={styles.container}>
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {explain_text3}
                    {math_frame_svg}
                </View>)
    }
    
    addskillmode4=(num_mat3, r_num_mat3, minuend_value, pei_num, text_mat)=>{
        // 减配对求和
        let all_str = []
        let layer_1st = minuend_value.toString()
        num_mat3.forEach((part_value,part_idx)=>{
            layer_1st += '-'+part_value+'-'+r_num_mat3[part_idx]
        })
        all_str.push(layer_1st)
        console.log('第1层数据', layer_1st)
        let layer_2nd = minuend_value.toString()
        let layer_2nd_mat_text = []
        num_mat3.forEach((part_value,part_idx)=>{
            layer_2nd += '-('+part_value+'+'+r_num_mat3[part_idx]+')'
            layer_2nd_mat_text.push('('+part_value+'+'+r_num_mat3[part_idx]+')')
        })
        all_str.push(layer_2nd)
        console.log('第2层数据', layer_2nd)
        let layer_3rd = minuend_value.toString()
        layer_3rd += '-'+pei_num+'x'+num_mat3.length
        all_str.push(layer_3rd)
        console.log('第3层数据', layer_3rd)
        let layer_4th = eval(layer_1st).toString()
        all_str.push(layer_4th)
        console.log('第4层数据', layer_4th)
        let text_svg = []           // 装text
        let font_size = 20  // 字体大小
        let gap_y = 30      // 纵向间隔
        let start_x = 30
        let start_y = 30
        let max_height = 0
        let max_width = 0
        for(let ii=0;ii<all_str.length;ii++){
            // 
            if(ii==0){
                text_svg.push(<Text x={start_x} 
                                    y={start_y+gap_y*0} 
                                    fill='black'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{'   '+all_str[ii]}</Text>)
            }
            else{
                text_svg.push(<Text x={start_x} 
                    y={start_y+gap_y*ii} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{'='+all_str[ii]}</Text>)
            }
            if(max_width<(all_str[ii].length+1)*font_size*0.51){
                max_width = (all_str[ii].length+1)*font_size*0.51
            }
            if(max_height<start_y+gap_y*ii+font_size){
                max_height = start_y+gap_y*ii+font_size
            }
        }
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                {'计算：'+layer_1st}
                            </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_str_mat = []  
        explain_str_mat.push(layer_2nd_mat_text.join('、'))
        explain_str_mat.push(layer_2nd_mat_text.length)
        explain_str_mat.push(layer_2nd_mat_text.length)
        explain_str_mat.push(eval(layer_2nd_mat_text[0]))
        explain_str_mat.push(layer_2nd_mat_text.length*eval(layer_2nd_mat_text[0]))        
        explain_str_mat.push(minuend_value +'-'+layer_2nd_mat_text.length*eval(layer_2nd_mat_text[0]))        
        explain_str_mat.push(eval(minuend_value)-layer_2nd_mat_text.length*eval(layer_2nd_mat_text[0]))        
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let explain_text3 =  <RN_Text style={styles.text_style}>
                                {'    详细计算过程如下：'}
                            </RN_Text>
        return (<View style={styles.container}>
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {explain_text3}
                    {math_frame_svg}
                </View>)
    }

    addskillmode5=(num_mat, idx_mat, shuffle_mat, text_mat)=>{
        // 配对求和
        let all_str = []
        let layer_1st = shuffle_mat.join('+')
        console.log('第1层数据', layer_1st)
        // 封装第2层数据
        let layer_2nd_mat = []
        let used_idx_mat = []
        shuffle_mat.forEach((part_value,part_idx)=>{
            if(used_idx_mat.indexOf(idx_mat[part_idx])<0){
                // 未使用
                if(idx_mat[part_idx]%2==0){
                    // 首
                    layer_2nd_mat.push('('+num_mat[idx_mat[part_idx]]+'+'+num_mat[idx_mat[part_idx]+1]+')')
                    used_idx_mat.push(idx_mat[part_idx])
                    used_idx_mat.push(idx_mat[part_idx]+1)
                }
                else{
                    layer_2nd_mat.push('('+num_mat[idx_mat[part_idx]]+'+'+num_mat[idx_mat[part_idx]-1]+')')
                    used_idx_mat.push(idx_mat[part_idx])
                    used_idx_mat.push(idx_mat[part_idx]-1)
                }
            }
        })
        console.log('layer_2nd_mat', layer_2nd_mat, used_idx_mat)
        let layer_2nd = layer_2nd_mat.join('+')
        console.log('第2层数据', layer_2nd)
        let layer_3rd_mat = []
        layer_2nd_mat.forEach((part_value)=>{
            // console.log(eval(part_value))
            layer_3rd_mat.push((eval(part_value)).toString())
        })
        let layer_3rd = layer_3rd_mat.join('+')
        console.log('第3层数据', layer_3rd)
        let layer_4th = (eval(layer_3rd)).toString()
        console.log('第4层数据', layer_4th)
        all_str.push(layer_1st)
        all_str.push(layer_2nd)
        all_str.push(layer_3rd)
        all_str.push(layer_4th)
        let text_svg = []           // 装text
        let font_size = 20  // 字体大小
        let gap_y = 30      // 纵向间隔
        let start_x = 30
        let start_y = 30
        let max_height = 0
        let max_width = 0
        for(let ii=0;ii<all_str.length;ii++){
            // 
            if(ii==0){
                text_svg.push(<Text x={start_x} 
                                    y={start_y+gap_y*0} 
                                    fill='black'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{'   '+all_str[ii]}</Text>)
            }
            else{
                text_svg.push(<Text x={start_x} 
                    y={start_y+gap_y*ii} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{'='+all_str[ii]}</Text>)
            }
            if(max_width<(all_str[ii].length+2)*font_size*0.6){
                max_width = (all_str[ii].length+2)*font_size*0.6
            }
            if(max_height<start_y+gap_y*ii+font_size){
                max_height = start_y+gap_y*ii+font_size
            }
        }
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        let explain_text0 =  <RN_Text style={styles.text_style}>
                                {'计算：'+layer_1st}
                            </RN_Text>
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_str_mat = []     
        //  配对讲解
        let match_str_mat = [] 
        let match_str_mat2 = [] 
        for(let ii=0;ii<used_idx_mat.length;ii=ii+2){
            // "A、C的尾数F、J相加等于10"
            let part_str =  num_mat[used_idx_mat[ii]]+'、'+num_mat[used_idx_mat[ii+1]]+'的尾数'+
                            num_mat[used_idx_mat[ii]]%10+'、'+num_mat[used_idx_mat[ii+1]]%10+"相加等于10"
            match_str_mat.push(part_str)
            let part_str2 =  num_mat[used_idx_mat[ii]]+'、'+num_mat[used_idx_mat[ii+1]]+'相加'
            match_str_mat2.push(part_str2)
        }
        explain_str_mat.push(match_str_mat.join('；')+'。')
        explain_str_mat.push(match_str_mat2.join('，')+'，')
        let combine_explain_str = ''
        let str_idx=-1
        text_mat[1].forEach((part_str)=>{
            if(part_str==''){
                str_idx += 1
                combine_explain_str += explain_str_mat[str_idx]
            }
            else{
                combine_explain_str += part_str
            }
        })
        let explain_text2 =  <RN_Text style={styles.text_style}>
                            {combine_explain_str}
                        </RN_Text>
        let explain_text3 =  <RN_Text style={styles.text_style}>
                                {'    详细计算过程如下：'}
                            </RN_Text>
        return (<View style={styles.container}>
                    {explain_text0}
                    {explain_text1}
                    {explain_text2}
                    {explain_text3}
                    {math_frame_svg}
                </View>)
    }

    graphmode1=(loc_mat,loc_algbra)=>{
        // 图形处理
        let font_size = 20
        let text_svg = []
        let x_amplify = 5
        let y_amplify = 4
        let x_start = 10
        let y_start = 40
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['start_y']*y_amplify].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start,y_start+loc_mat[ii]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start,y_start+loc_mat[ii]['start_y']*y_amplify].join(',')].join(' ')
                console.log('points_str-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
            }
        }
        // 写字母
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3} 
                                y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>)
            if (max_height<loc_mat[ii]['end_y']*y_amplify+y_start+font_size){
                max_height=loc_mat[ii]['end_y']*y_amplify+y_start+font_size
            }
            if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3){
                max_width=loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3
            }
        }


        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        return (<View style={styles.container}>
                    {math_frame_svg}
                </View>)
    }

    graphmode2=(loc_mat,loc_algbra)=>{
        // 图形处理
        let font_size = 20
        let x_amplify = 5
        let y_amplify = 3
        let x_start = 10
        let y_start = 10
        let [max_height, max_width, text_svg] = this.StandardDrawLine([x_start, y_start], [x_amplify, y_amplify], font_size,loc_mat,loc_algbra)
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        return (<View style={styles.line_container}>
                    {math_frame_svg}
                </View>)
    }

    graphmode3=(loc_mat,loc_algbra,text_mat)=>{
        // 图形处理
        let font_size = 20
        let x_amplify = 5
        let y_amplify = 3
        let x_start = 10
        let y_start = 10
        let all_svg_mat=[]
        // 每组前封装text文字 
        let combine_mat = []
        for(let ii=1;ii<loc_mat.length;ii++){
            let combien_num = loc_mat.length-ii
            combine_mat.push(combien_num)
            if (ii==1){
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                    <Text x={x_start} 
                        y={font_size} 
                        fill='black'
                        backgroundColor='transparent' 
                        fontSize = {font_size}
                        >{combine_dict[(ii).toString()]+'基础线段条数:共'+combien_num+'组'}
                    </Text>
                </Svg>)
            }
            else if(ii==loc_mat.length-1){
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                    <Text x={x_start} 
                        y={font_size} 
                        fill='black'
                        backgroundColor='transparent' 
                        fontSize = {font_size}
                        >{combine_dict[(ii).toString()]+'所有基础线段组合:共'+combien_num+'组'}
                    </Text>
                </Svg>)
            }
            else{
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                                    <Text x={x_start} 
                                        y={font_size} 
                                        fill='black'
                                        backgroundColor='transparent' 
                                        fontSize = {font_size}
                                        >{combine_dict[(ii).toString()]+'相邻'+ii+'条基础线段组合:共'+combien_num+'组'}
                                    </Text>
                                </Svg>)
            }
            let part_combine_svg = this.CombineSingleGraph([x_start, y_start], [x_amplify, y_amplify], font_size,loc_mat,loc_algbra,ii)
            all_svg_mat.push(part_combine_svg)
        }
        // 计算总数
        let combine_str = combine_mat.join('+')
        let all_num = eval(combine_str)
        all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
            <Text x={x_start} 
            y={font_size} 
            fill='black'
            backgroundColor='transparent' 
            fontSize = {font_size}
            >{'线段组合总计为：'+combine_str+'='+all_num+'组'}
            </Text>
            
        </Svg>)
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                        {text_mat[0]}
                                    </RN_Text>
        let explain_text2 =  <RN_Text style={styles.text_style}>
                                {text_mat[1]}
                            </RN_Text>
        return (<ScrollView style={styles.graph}>
                    {explain_text1}
                    {explain_text2}
                    {all_svg_mat}                    
                </ScrollView>)
    }

    graphmode4=(loc_mat,loc_algbra)=>{
        // 图形处理
        let font_size = 20
        let x_amplify = 4
        let y_amplify = 30
        let x_start = 10
        let y_start = 10
        let [max_height, max_width, text_svg] = this.StandardDrawTriangle([x_start, y_start], [x_amplify, y_amplify], font_size,loc_mat,loc_algbra)
        let math_frame_svg = <Svg  height= {max_height+5} 
                                    width={max_width+font_size} 
                                    style={styles.svg_bc5}>
                                {text_svg}     
                            </Svg>     // 封装SVG
        return (<View style={styles.triangle2}>
                    {math_frame_svg}
                </View>)
    }

    graphmode5=(loc_mat,loc_algbra,text_mat)=>{
        // 图形处理
        let font_size = 20
        let x_amplify = 4
        let y_amplify = 30
        let x_start = 10
        let y_start = 10
        let all_svg_mat=[]
        // 每组前封装text文字
        let combine_mat = []
        for(let ii=1;ii<loc_mat.length;ii++){
            let combien_num = loc_mat.length-ii
            combine_mat.push(combien_num)
            if(ii==1){
                all_svg_mat.push( <Svg width={600} height={font_size*1.5}>
                                        <Text x={x_start} 
                                        y={font_size} 
                                        fill='black'
                                        backgroundColor='transparent' 
                                        fontSize = {font_size}
                                        >{combine_dict[(ii).toString()]+'基础小三角形的个数:共'+combien_num+'个'}
                                        </Text>
                                    </Svg>)
            }
            else if(ii==loc_mat.leng-1){
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                                    <Text x={x_start} 
                                    y={font_size} 
                                    fill='black'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{combine_dict[(ii).toString()]+'全部小三角形组合:共'+combien_num+'个'}
                                    </Text>
                                </Svg>)
            }
            else{
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                                    <Text x={x_start} 
                                    y={font_size} 
                                    fill='black'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{combine_dict[(ii).toString()]+'由'+ii+'个小三角形组合的个数:共'+combien_num+'个'}
                                    </Text>
                                 </Svg>)
            }
            
            let part_combine_svg = this.CombineTriangleGraph([x_start, y_start], [x_amplify, y_amplify], font_size,loc_mat,loc_algbra,ii)
            all_svg_mat.push(part_combine_svg)
        }
        // 计算总数
        let combine_str = combine_mat.join('+')
        let all_num = eval(combine_str)
        all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
            <Text x={x_start} 
            y={font_size} 
            fill='black'
            backgroundColor='transparent' 
            fontSize = {font_size}
            >{'图中三角形的个数合计为：'+combine_str+'='+all_num+'(个)'}
            </Text>
        </Svg>)
        console.log('text_mat--------',text_mat)
        let explain_text1 =  <RN_Text style={styles.text_style}>
                                {text_mat[0]}
                            </RN_Text>
        let explain_text2 =  <RN_Text style={styles.text_style}>
                                {text_mat[1]}
                            </RN_Text>
        return (<ScrollView style={styles.graph}>
                    {explain_text1}
                    {explain_text2}
                    {all_svg_mat}                    
                </ScrollView>)
    }

    graphmode6=(loc_angle_mat, loc_angle_algbra)=>{
        // 角组合处理，
        let font_size = 20
        let x_amplify = 10
        let y_amplify = 6
        // 处理起始
        let [min_x, max_x, min_y, max_y] = [1000, -1000 , 1000, -1000]
        loc_angle_mat.forEach((part_loc)=>{
            // 坐标数据处理
            if(part_loc['start_x']*x_amplify<min_x){
                min_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_x']*x_amplify>max_x){
                max_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_y']*y_amplify<min_y){
                min_y = part_loc['start_y']*y_amplify
            }
            if(part_loc['start_y']*y_amplify>max_y){
                max_y = part_loc['start_y']*y_amplify
            } 
            //
            if(part_loc['end_x']*x_amplify<min_x){
                min_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_x']*x_amplify>max_x){
                max_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_y']*y_amplify<min_y){
                min_y = part_loc['end_y']*y_amplify
            }
            if(part_loc['end_y']*y_amplify>max_y){
                max_y = part_loc['end_y']*y_amplify
            }
        })
        let x_start = min_x+font_size*1.2
        let y_start = max_y+font_size
        console.log('min_x, max_x, min_y, max_y', min_x, max_x, min_y, max_y)
        let [max_height, max_width, text_svg] = this.StandardDrawAngle([x_start, y_start], [x_amplify, y_amplify], font_size,loc_angle_mat,loc_angle_algbra)
        console.log('max_height', max_height,'max_width', max_width)
        let math_frame_svg = <Svg   width={max_width+font_size*2}
                                    height= {max_height+font_size*1} 
                                    style={styles.svg_angle5}>
                                {text_svg}     
                            </Svg>     // 封装SVG 
        return (<View width={max_width+font_size*2} height={max_height+font_size*1} style={styles.angle1}>
                    {math_frame_svg}
                </View>)
    }

    graphmode7=(loc_angle_mat, loc_angle_algbra,text_mat)=>{
        // 角组合处理，
        let font_size = 20
        let x_amplify = 5
        let y_amplify = 5
        // 处理起始
        let [min_x, max_x, min_y, max_y] = [1000, -1000 , 1000, -1000]
        loc_angle_mat.forEach((part_loc)=>{
            // 坐标数据处理
            if(part_loc['start_x']*x_amplify<min_x){
                min_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_x']*x_amplify>max_x){
                max_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_y']*y_amplify<min_y){
                min_y = part_loc['start_y']*y_amplify
            }
            if(part_loc['start_y']*y_amplify>max_y){
                max_y = part_loc['start_y']*y_amplify
            } 
            //
            if(part_loc['end_x']*x_amplify<min_x){
                min_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_x']*x_amplify>max_x){
                max_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_y']*y_amplify<min_y){
                min_y = part_loc['end_y']*y_amplify
            }
            if(part_loc['end_y']*y_amplify>max_y){
                max_y = part_loc['end_y']*y_amplify
            }
        })
        let x_start = min_x+font_size*1.2
        let y_start = max_y+font_size
        let all_svg_mat=[]
        // 每组前封装text文字
        let combine_mat = []
        for(let ii=1;ii<loc_angle_mat.length;ii++){
            let combien_num = loc_angle_mat.length-ii
            combine_mat.push(combien_num)
            if (ii==1){
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                    <Text x={x_start} 
                    y={font_size} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{combine_dict[(ii).toString()]+'基本角个数:共'+combien_num+'个'}
                    </Text>
                </Svg>)
            }
            else if(ii==loc_angle_mat.length-1){
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                    <Text x={x_start} 
                    y={font_size} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{combine_dict[(ii).toString()]+'所有基本角组合:共'+combien_num+'个'}
                    </Text>
                </Svg>)
            }
            else{
                all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
                    <Text x={x_start} 
                    y={font_size} 
                    fill='black'
                    backgroundColor='transparent' 
                    fontSize = {font_size}
                    >{combine_dict[(ii).toString()]+'相邻'+ii+'个基本角组合:共'+combien_num+'个'}
                    </Text>
                </Svg>)
            }
            let part_combine_svg = this.CombineAngleGraph([x_start, y_start], [x_amplify, y_amplify], font_size,loc_angle_mat,loc_angle_algbra,ii)
            all_svg_mat.push(part_combine_svg)
        }
        // 计算总数
        let combine_str = combine_mat.join('+')
        let all_num = eval(combine_str)
        all_svg_mat.push(<Svg width={600} height={font_size*1.5}>
            <Text x={x_start} 
            y={font_size} 
            fill='black'
            backgroundColor='transparent' 
            fontSize = {font_size}
            >{'线段组合总计为：'+combine_str+'='+all_num+'组'}
            </Text>
        </Svg>)
        let explain_text1 =  <RN_Text style={styles.text_style}>
                {text_mat[0]}
            </RN_Text>
        let explain_text2 =  <RN_Text style={styles.text_style}>
        {text_mat[1]}
        </RN_Text>

        return (<ScrollView style={styles.graph}>
                    {explain_text1}
                    {explain_text2}
                    {all_svg_mat}                    
                </ScrollView>)
    }

    CombineSingleGraph=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra,combine_line_num)=>{
        let math_frame_svg =[]
        let idx_dict = {'1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨','10':'⑩'}
        let idx_add = 0
        // 组合字母数画线
        // let  combine_line_num= 2
        for (let ii=0;ii<loc_mat.length-combine_line_num;ii++){
            // 提取数据
            let new_loc_mat = loc_mat.slice(ii, ii+combine_line_num+1)
            let new_loc_letter = loc_algbra.slice(ii, ii+combine_line_num+1)
            // console.log('new_loc_mat', new_loc_mat, loc_mat)
            // console.log('new_loc_letter', new_loc_letter, loc_algbra)
            let [max_height, max_width, text_svg] = this.StandardDrawLine2(start_mat, amplify_mat, font_size,new_loc_mat,new_loc_letter)
            let add_svg = []
            // 写序号
            idx_add += 1
            add_svg.push(text_svg)
            add_svg.push(<Text  x={max_width/2} 
                                y={max_height+font_size*0.5} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {16}
                                >{idx_dict[idx_add.toString()]}</Text>) 
            math_frame_svg.push(<Svg    height= {max_height+font_size} 
                                        width={max_width+font_size*1.5} 
                                        style={styles.svg_bc5}>
                                        {add_svg}     
                                </Svg>)     // 封装SVG
        }
        // return (<ScrollView  horizontal={true} style={styles.line_graph}>
        //             {math_frame_svg}                    
        //         </ScrollView>)
        // 自动换行
        return  <View style={styles.line_graph}>
                    {math_frame_svg} 
                </View>
        
    }

    CombineTriangleGraph=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra,combine_line_num)=>{
        let math_frame_svg =[]
        // 组合字母数画线
        // let  combine_line_num= 2
        let idx_dict = {'1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨','10':'⑩'}
        let idx_add = 0
        for (let ii=0;ii<loc_mat.length-combine_line_num;ii++){
            // 提取数据
            let new_loc_mat = loc_mat.slice(ii, ii+combine_line_num+1)
            let new_loc_letter = loc_algbra.slice(ii, ii+combine_line_num+1)
            console.log('new_loc_mat', new_loc_mat, loc_mat)
            console.log('new_loc_letter', new_loc_letter, loc_algbra)
            let add_svg = []
            let [max_height, max_width, text_svg, idx_loc_x, idx_loc_y] = this.StandardDrawTriangle2(start_mat, amplify_mat, font_size,new_loc_mat,new_loc_letter)
            // 写序号
            idx_add += 1
            add_svg.push(text_svg)
            add_svg.push(<Text x={idx_loc_x-font_size*0.1} 
                                y={idx_loc_y+font_size*0.1} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {16}
                                >{idx_dict[idx_add.toString()]}</Text>) 
            math_frame_svg.push(<Svg    height= {max_height+5} 
                                        width={max_width+font_size} 
                                        style={styles.triangle_bc6}>
                                        {add_svg}     
                                </Svg>)     // 封装SVG
        }
        // return math_frame_svg
        return  <View style={styles.angle_graph2}>
                    {math_frame_svg} 
                </View>
        return (<ScrollView horizontal={true} style={styles.triangle_graph}>
                    {math_frame_svg}                    
                </ScrollView>)
    }

    CombineAngleGraph=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra,combine_line_num)=>{
        let math_frame_svg =[]
        // 组合字母数画线
        // let  combine_line_num= 2
        let idx_dict = {'1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨','10':'⑩'}
        let idx_add = 0
        let row_height = 0
        for (let ii=0;ii<loc_mat.length-combine_line_num;ii++){
            // 提取数据
            let new_loc_mat = loc_mat.slice(ii, ii+combine_line_num+1)
            let new_loc_letter = loc_algbra.slice(ii, ii+combine_line_num+1)
            console.log('new_loc_mat', new_loc_mat, loc_mat)
            console.log('new_loc_letter', new_loc_letter, loc_algbra)
            let add_svg = []
            let [max_height, max_width, text_svg, idx_loc_x, idx_loc_y] = this.StandardDrawAngle2(start_mat, amplify_mat, font_size,new_loc_mat,new_loc_letter)
            // 写序号
            idx_add += 1
            add_svg.push(text_svg)
            add_svg.push(<Text x={max_width/2} 
                                y={max_height} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {16}
                                >{idx_dict[idx_add.toString()]}</Text>) 
            math_frame_svg.push(<Svg    height= {max_height+5} 
                                        width={max_width+font_size} 
                                        style={styles.angle_bc6}>
                                        {add_svg}     
                                </Svg>)     // 封装SVG
            if(row_height<max_height+font_size){
                row_height = max_height+font_size
            }
        }

        // return math_frame_svg
        return  <View style={styles.angle_graph2}>
                    {math_frame_svg} 
                </View>
        return (<ScrollView horizontal={true} width={350} height={row_height} contentContainerStyle={styles.scroll_graph} style={styles.angle_graph}>
                    {math_frame_svg}                    
                </ScrollView>)
    }

    StandardDrawLine=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['start_y']*y_amplify].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start,y_start+loc_mat[ii]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start,y_start+loc_mat[ii]['start_y']*y_amplify].join(',')].join(' ')
                // console.log('StandardDrawLine-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
            }
        }
        // 写字母
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3} 
                                y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>)
            if (max_height<loc_mat[ii]['end_y']*y_amplify+y_start+font_size){
                max_height=loc_mat[ii]['end_y']*y_amplify+y_start+font_size
            }
            if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3){
                max_width=loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3
            }
        }
        return [max_height,max_width, text_svg]
    }
    StandardDrawLine2=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[ii-1]['start_y']*y_amplify].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[ii-1]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[ii]['end_y']*y_amplify].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[ii]['start_y']*y_amplify].join(',')].join(' ')
                // console.log('StandardDrawLine-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="1" //边框宽度
                        />)
            }
        }
        // 画粗线
        let points_str = [[loc_mat[0]['start_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[0]['start_y']*y_amplify].join(','),
                          [loc_mat[0]['end_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[0]['end_y']*y_amplify].join(','),
                          [loc_mat[loc_mat.length-1]['end_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[loc_mat.length-1]['end_y']*y_amplify].join(','),
                          [loc_mat[loc_mat.length-1]['start_x']*x_amplify+x_start-loc_mat[0]['start_x']*x_amplify,y_start+loc_mat[loc_mat.length-1]['start_y']*y_amplify].join(',')].join(' ')
                // console.log('StandardDrawLine-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="red" //边框色
                                    strokeWidth="2.5" //边框宽度
                        />)
        // 写字母---写两头
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            if(ii==0 ||ii==loc_mat.length-1){
               text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3-loc_mat[0]['start_x']*x_amplify} 
                                y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size} 
                                fill='black'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>) 
            }
            
            if (max_height<loc_mat[ii]['end_y']*y_amplify+y_start+font_size){
                max_height=loc_mat[ii]['end_y']*y_amplify+y_start+font_size
            }
            if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3-loc_mat[0]['start_x']*x_amplify){
                max_width=loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3-loc_mat[0]['start_x']*x_amplify
            }
        }
        return [max_height,max_width, text_svg]
    }
    StandardDrawTriangle=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['start_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['end_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start,y_start+loc_mat[ii]['end_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start,y_start+loc_mat[ii]['start_y']*y_amplify+font_size*0.5].join(',')].join(' ')
                // console.log('StandardDrawLine-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
            }
        }
        // 写字母
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3} 
                                y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.5} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>)
            if (max_height<loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.5){
                max_height=loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.5
            }
            if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3){
                max_width=loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3
            }
        }
        // 画O点
        text_svg.push(<Text x={loc_mat[0]['start_x']*x_amplify+x_start-font_size*0.3} 
                                y={loc_mat[0]['start_y']*y_amplify+y_start+font_size*0.3} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{'O'}</Text>)

        return [max_height,max_width, text_svg]
    }
    StandardDrawTriangle2=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        // 起始点位
        let part_max_x = Math.max.apply(null,[loc_mat[0]['start_x'],loc_mat[0]['end_x'],loc_mat[loc_mat.length-1]['end_x']])
        let part_min_x = Math.min.apply(null,[loc_mat[0]['start_x'],loc_mat[0]['end_x'],loc_mat[loc_mat.length-1]['end_x']])
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[ii-1]['start_y']*y_amplify+font_size*0.3].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[ii-1]['end_y']*y_amplify+font_size*0.3].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[ii]['end_y']*y_amplify+font_size*0.3].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[ii]['start_y']*y_amplify+font_size*0.3].join(',')].join(' ')
                // console.log('StandardDrawTriangle-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
            }
        }
        // 画粗线
        let points_str = [[loc_mat[0]['start_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[0]['start_y']*y_amplify+font_size*0.3].join(','),
                          [loc_mat[0]['end_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[0]['end_y']*y_amplify+font_size*0.3].join(','),
                          [loc_mat[loc_mat.length-1]['end_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[loc_mat.length-1]['end_y']*y_amplify+font_size*0.3].join(','),
                          [loc_mat[loc_mat.length-1]['start_x']*x_amplify+x_start-part_min_x*x_amplify,y_start+loc_mat[loc_mat.length-1]['start_y']*y_amplify+font_size*0.3].join(',')].join(' ')
                // console.log('StandardDrawTriangle-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="red" //边框色
                                    strokeWidth="2.5" //边框宽度
                        />)
        // 写字母---写两头
        let idx_loc_x = 0
        let idx_loc_y = 0
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            if(ii==0 ||ii==loc_mat.length-1){
                let part_loc_x = loc_mat[ii]['end_x']*x_amplify+x_start-font_size*0.3-part_min_x*x_amplify
                let part_loc_y = loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.2
                idx_loc_x += part_loc_x
                idx_loc_y += part_loc_y
                text_svg.push(<Text x={part_loc_x} 
                                y={part_loc_y} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>) 
            }
            
            if (max_height<loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.3){
                max_height=loc_mat[ii]['end_y']*y_amplify+y_start+font_size+font_size*0.3
            }
            // max
            
            // console.log('--------',[loc_mat[0]['start_x'],loc_mat[0]['end_x'],loc_mat[loc_mat.length-1]['end_x']], part_max_x,part_min_x)
            if (max_width<(part_max_x-part_min_x)*x_amplify){
                max_width = (part_max_x-part_min_x)*x_amplify
            }
        }
        // 画O点
        text_svg.push(<Text x={loc_mat[0]['start_x']*x_amplify+x_start-part_min_x*x_amplify-font_size*0.3} 
                                y={loc_mat[0]['start_y']*y_amplify+y_start+font_size*0.2} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{'O'}</Text>)
        
        return [max_height,max_width, text_svg, idx_loc_x/2, idx_loc_y/2]
    }

    StandardDrawAngle=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['start_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['end_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start,y_start+loc_mat[ii]['start_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start,y_start+loc_mat[ii]['end_y']*y_amplify+font_size*0.5].join(',')].join(' ')
                                 
                // console.log('StandardDrawLine-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
            }
        }
        // 写字母
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3} 
                                y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size-font_size*0.1} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{loc_algbra[ii]}</Text>)
            if (max_height<(-loc_mat[ii]['end_y']+loc_mat[ii]['start_y']*2)*y_amplify+y_start+font_size-font_size*0.1){
                max_height=(-loc_mat[ii]['end_y']+loc_mat[ii]['start_y']*2)*y_amplify+y_start+font_size-font_size*0.1
            }
            if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3){
                max_width=loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3
            }
        }
        // 画O点
        text_svg.push(<Text x={loc_mat[0]['start_x']*x_amplify+x_start-font_size*0.8} 
                                y={loc_mat[0]['start_y']*y_amplify+y_start+font_size*0.8} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{'O'}</Text>)

        return [max_height,max_width, text_svg]
    }
    StandardDrawAngle2=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        // 角组合处理，
        // let font_size = 20
        // 处理起始
        let [min_x, max_x, min_y, max_y] = [1000, -1000 , 1000, -1000]
        console.log('loc_mat--------',loc_mat)
        loc_mat.forEach((part_loc)=>{
            // 坐标数据处理
            if(part_loc['start_x']*x_amplify<min_x){
                min_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_x']*x_amplify>max_x){
                max_x = part_loc['start_x']*x_amplify
            }
            if(part_loc['start_y']*y_amplify<min_y){
                min_y = part_loc['start_y']*y_amplify
            }
            if(part_loc['start_y']*y_amplify>max_y){
                max_y = part_loc['start_y']*y_amplify
            } 
            //
            if(part_loc['end_x']*x_amplify<min_x){
                min_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_x']*x_amplify>max_x){
                max_x = part_loc['end_x']*x_amplify
            }
            if(part_loc['end_y']*y_amplify<min_y){
                min_y = part_loc['end_y']*y_amplify
            }
            if(part_loc['end_y']*y_amplify>max_y){
                max_y = part_loc['end_y']*y_amplify
            }
        })
        let x_start = -min_x+font_size*1.2
        let y_start = -min_y+font_size
        console.log('min_x, max_x, min_y, max_y', min_x, max_x, min_y, max_y, x_start, y_start)
        let [max_height, max_width, text_svg] = this.PartDrawAngle([x_start, y_start], [x_amplify, y_amplify], font_size, loc_mat,loc_algbra)
        console.log('max_height', max_height,'max_width', max_width)
        return [max_height,max_width, text_svg, 0/2, 0/2]
    }

    PartDrawAngle=(start_mat, amplify_mat, font_size, loc_mat,loc_algbra)=>{
        // 图形处理
        // let font_size = 20
        let text_svg = []
        let x_amplify = amplify_mat[0]
        let y_amplify = amplify_mat[1]
        let x_start = start_mat[0]
        let y_start = start_mat[1]
        let max_height = 0
        let max_width = 0
        for (let ii=1;ii<loc_mat.length;ii++){
            // 画线
            if(ii==0){
                console.log('跳过')
                continue
            }
            else{
                let points_str = [[loc_mat[ii-1]['start_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['start_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii-1]['end_x']*x_amplify+x_start,y_start+loc_mat[ii-1]['end_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['start_x']*x_amplify+x_start,y_start+loc_mat[ii]['start_y']*y_amplify+font_size*0.5].join(','),
                                 [loc_mat[ii]['end_x']*x_amplify+x_start,y_start+loc_mat[ii]['end_y']*y_amplify+font_size*0.5].join(',')].join(' ')
                                 
                console.log('StandardDrawAngle-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="black" //边框色
                                    strokeWidth="1.5" //边框宽度
                        />)
            }
        }
        // 画粗线
        let points_str = [[loc_mat[0]['start_x']*x_amplify+x_start,y_start+loc_mat[0]['start_y']*y_amplify+font_size*0.5].join(','),
                          [loc_mat[0]['end_x']*x_amplify+x_start,y_start+loc_mat[0]['end_y']*y_amplify+font_size*0.5].join(','),
                          [loc_mat[loc_mat.length-1]['start_x']*x_amplify+x_start,y_start+loc_mat[loc_mat.length-1]['start_y']*y_amplify+font_size*0.5].join(','),
                          [loc_mat[loc_mat.length-1]['end_x']*x_amplify+x_start,y_start+loc_mat[loc_mat.length-1]['end_y']*y_amplify+font_size*0.5].join(',')].join(' ')
                                 
                console.log('StandardDrawAngle-----', points_str)
                text_svg.push(<Polyline
                                    points={points_str}  //多段线的各个点
                                    fill="none"   //填充颜色 无
                                    stroke="red" //边框色
                                    strokeWidth="2" //边框宽度
                        />)
        // 写字母
        for (let ii=0;ii<loc_mat.length;ii++){
            // 
            if (ii==0 || ii==loc_mat.length-1){
                text_svg.push(<Text x={loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3} 
                                    y={loc_mat[ii]['end_y']*y_amplify+y_start+font_size-font_size*0.1} 
                                    fill='red'
                                    backgroundColor='transparent' 
                                    fontSize = {font_size}
                                    >{loc_algbra[ii]}</Text>)
                if (max_height<(y_start+loc_mat[ii]['start_y']*y_amplify+font_size-font_size*0.1)){
                    max_height=y_start+loc_mat[ii]['start_y']*y_amplify+font_size-font_size*0.1
                }
                if (max_height<(y_start+loc_mat[ii]['end_y']*y_amplify+font_size-font_size*0.1)){
                    max_height=y_start+loc_mat[ii]['end_y']*y_amplify+font_size-font_size*0.1
                }
                if (max_width<loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3){
                    max_width=loc_mat[ii]['end_x']*x_amplify+x_start+font_size*0.3
                }
            }
        }
        // 画O点
        text_svg.push(<Text x={loc_mat[0]['start_x']*x_amplify+x_start-font_size*0.8} 
                                y={loc_mat[0]['start_y']*y_amplify+y_start+font_size*0.8} 
                                fill='red'
                                backgroundColor='transparent' 
                                fontSize = {font_size}
                                >{'O'}</Text>)

        return [max_height+font_size,max_width, text_svg]
    }

    render() {
        // console.log('this.props.math_frame_svg0', this.props.math_frame_svg0)
        if (this.props.math_frame_svg0[0]==0){
            let num1 = this.props.math_frame_svg0[1][0]
            let num2 = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.multiskillmode1(num1, num2, text_mat)
        }
        else if (this.props.math_frame_svg0[0]==1){
            let num1 = this.props.math_frame_svg0[1][0]
            let num2 = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.multiskillmode2(num1, num2, text_mat)
        }
        else if (this.props.math_frame_svg0[0]==2){
            let center_num = this.props.math_frame_svg0[1][0]
            let bias_mat = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.addskillmode1(center_num, bias_mat, text_mat)
        }
        else if (this.props.math_frame_svg0[0]==3){
            let num_mat = this.props.math_frame_svg0[1][0]
            let bias_mat3 = this.props.math_frame_svg0[1][1]
            let bias_mat2 = this.props.math_frame_svg0[1][2]
            let text_mat = this.props.math_frame_svg0[2]
            return this.addskillmode2(num_mat, bias_mat3,bias_mat2,text_mat)
        }
        else if (this.props.math_frame_svg0[0]==4){
            let num_mat = this.props.math_frame_svg0[1][0]
            let diff_value = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.addskillmode3(num_mat, diff_value, text_mat)
        }
        else if (this.props.math_frame_svg0[0]==5){
            let num_mat3 = this.props.math_frame_svg0[1][0]
            let r_num_mat3 = this.props.math_frame_svg0[1][1]
            let minuend_value = this.props.math_frame_svg0[1][2]
            let pei_num = this.props.math_frame_svg0[1][3]
            let text_mat = this.props.math_frame_svg0[2]
            return this.addskillmode4(num_mat3, r_num_mat3, minuend_value, pei_num,text_mat)
        }
        else if (this.props.math_frame_svg0[0]=='graph-1'){
            let loc_mat = this.props.math_frame_svg0[1][0]
            let loc_algbra = this.props.math_frame_svg0[1][1]
            return this.graphmode2(loc_mat,loc_algbra)
        }
        else if (this.props.math_frame_svg0[0]=='graph-2'){
            let loc_mat = this.props.math_frame_svg0[1][0]
            let loc_algbra = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.graphmode3(loc_mat, loc_algbra, text_mat)
        }
        else if (this.props.math_frame_svg0[0]=='triangle-1'){
            let loc_mat = this.props.math_frame_svg0[1][0]
            let loc_algbra = this.props.math_frame_svg0[1][1]
            return this.graphmode4(loc_mat,loc_algbra)
        }
        else if (this.props.math_frame_svg0[0]=='triangle-2'){
            let loc_mat = this.props.math_frame_svg0[1][0]
            let loc_algbra = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.graphmode5(loc_mat,loc_algbra,text_mat)
        }
        else if (this.props.math_frame_svg0[0]=='angle-1'){
            let loc_angle_mat = this.props.math_frame_svg0[1][0]
            let loc_angle_algbra = this.props.math_frame_svg0[1][1]
            return this.graphmode6(loc_angle_mat, loc_angle_algbra)
        }
        else if (this.props.math_frame_svg0[0]=='angle-2'){
            let loc_angle_mat = this.props.math_frame_svg0[1][0]
            let loc_angle_algbra = this.props.math_frame_svg0[1][1]
            let text_mat = this.props.math_frame_svg0[2]
            return this.graphmode7(loc_angle_mat, loc_angle_algbra, text_mat)
        }
        else if (this.props.math_frame_svg0[0]=='end_complementary'){
            // 尾数互补
            let base_num_mat = this.props.math_frame_svg0[1][0]
            let shuffle_idx_mat = this.props.math_frame_svg0[1][1]
            let shuffle_num_mat = this.props.math_frame_svg0[1][2]
            let text_mat = this.props.math_frame_svg0[2]
            // console.log('text_mat', text_mat)
            return this.addskillmode5(base_num_mat, shuffle_idx_mat, shuffle_num_mat, text_mat)
        }
        else{
            return []
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'transparent',
        flexDirection:'column',
        // alignItems:'center',
    },
    svg_bc5:{
        backgroundColor:'white',       //
    },
    triangle_bc6:{
        // flexDirection:"column", // | "row" | "row-reverse" | "column-reverse";
        backgroundColor:'white',
    },
    graph: {
        width: 570,
        // height: 600,
        flex: 1,
        backgroundColor:'transparent',
        // position:'relative',
        marginHorizontal: 20,
    },
    triangle_graph:{
        // width: 350,
        // height: 150,
        backgroundColor:'white',
        marginHorizontal: 20,
    },
    line_graph:{
        width: 550,
        flexDirection:"row", // "column"| "row" | "row-reverse" | "column-reverse";
        backgroundColor:'white',
        marginHorizontal: 20,
        flexWrap: "wrap" 
        
    },
    angle_graph2:{
        width: 550,
        flexDirection:"row", // "column"| "row" | "row-reverse" | "column-reverse";
        backgroundColor:'white',
        marginHorizontal: 20,
        flexWrap: "wrap" ,
    },
    triangle:{
        backgroundColor:'transparent',
        flexDirection:'row',
    },
    triangle2: {
        // width: 400,
        // height: 400,
        flex: 1,
        backgroundColor:'transparent',
        marginHorizontal: 20,
    },
    angle1: {
        backgroundColor:'transparent',
    },
    svg_angle5:{
        backgroundColor:'white',
    },
    angle_bc6:{
        backgroundColor:'white',
    },
    angle_graph:{
        backgroundColor:'white',
        marginHorizontal: 20,
    },
    scroll_graph:{
        alignItems: 'flex-end',
    },
    text_style:{
        fontSize:22,
        // width:700,
        // fontWeight:'600'
    },
    line_container:{
        backgroundColor:'transparent',
    }
});

