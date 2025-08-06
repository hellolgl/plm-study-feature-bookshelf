import React, {Component} from "react"
import {PanResponder, Text, View} from "react-native"
import Svg, {Polygon} from "react-native-svg"
import AntDesign from "react-native-vector-icons/AntDesign"
import {pxToDp} from "../../../../../util/tools";
import {BaseProcessClass, GriddingClass} from "./GraphAndNumAlgorithm";
import {DrawSvgClass} from "./GraphAndNumSVG";

class InputRange extends Component {
    constructor(props) {
        super(props)
        this.w = pxToDp(400)
        this.h = pxToDp(50)
        this.per_pixels = 40
        this.gridding_cls = new GriddingClass(this.w, this.h, 30, this.h - 30, this.per_pixels)
        this.svg_cls = new DrawSvgClass(this.w, this.h)
        this.bpc_cls = new BaseProcessClass(this.per_pixels)

        this.slider_height = 40   // 滑块条高度
        this.slider_width = pxToDp(450)   // 滑块条宽度---总长
        this.smile_height = 50    // 笑脸高度
        this.smile_width = 50     // 笑脸宽度
        this.slider_left_num = 3   // 左侧滑块占比数
        this.slider_right_num = 7 // 右侧滑块占比数
        this.slider_per_pixels = (this.slider_width - this.smile_width) / (this.slider_left_num + this.slider_right_num)  // 减去一个smile宽度
        this.fixed_box_x = this.slider_per_pixels * this.slider_left_num // 滑动框的固定位置，作为拖动的初始位置---中心右滑或结束位置---中心左化
        this.line_start_x2 = -1
        this.line_start_y2 = -1
        this.line_end_x2 = -1
        this.line_end_x2 = -1
        this.smile_box_x = this.fixed_box_x
        this.smile_box_y = -1
        this.slider_start_x = -1
        this.slider_start_y = -1
        this.slider_end_x = -1
        this.slider_end_y = -1
        this.max_x = this.slider_width + this.smile_width / 2
        this.min_x = 0
        this.effective_x = -1 // 有效：x
        this.effective_flag = 0
        this.left_radius_flag = 0
        this.right_radius_flag = 0
        this.width_polygon = []
        this.state = {
            slider_start_x: 100,
            slider_start_y: -1,
            slider_end_x: 100,
            slider_end_y: -1,
            smile_box_x: this.smile_box_x,
            smile_box_y: -1,
            smile_color: 'green',
            leftTxt: '0',
            rightTxt: '0',
            slider_width: 0,
            graph_svg: [],       // 图形绘制
            draw_graph_svg: [],        //绘图
        }
    }

    componentWillMount() {
        this._panResponderDrawLine2 = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                console.log('手指开始接触====111111111', evt.nativeEvent)
                let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
                let tempFirstY = evt.nativeEvent.locationY
                this.line_start_x2 = Math.round(tempfirstX * 100) / 100
                this.line_start_y2 = Math.round(tempFirstY * 100) / 100
                if (this.line_start_y2 > 0 && this.line_start_y2 < 50 &&
                    this.line_start_x2 <= this.smile_box_x + 70 && this.line_start_x2 >= this.smile_box_x - 20) {
                    // 有效区域
                    this.effective_x = this.line_start_x2
                    this.effective_flag = 1
                    this.setState({
                        smile_color: 'red'
                    })
                }
                console.log('初始点 ', this.line_start_x2, this.line_start_y2)
            },

            onPanResponderMove: (evt, gestureState) => {
                let pointX = evt.nativeEvent.locationX
                let pointY = evt.nativeEvent.locationY
                this.line_end_x2 = Math.round(pointX * 100) / 100 // 应修正移动值
                this.line_end_y2 = Math.round(pointY * 100) / 100
                console.log('右左二组移动', this.line_start_x2, this.line_start_y2, this.line_end_x2, this.line_end_y2)
                if (this.line_end_x2 >= (this.fixed_box_x + this.smile_width / 2) && this.line_end_x2 <= this.max_x - this.smile_width &&
                    this.line_end_y2 >= 0 && this.line_end_y2 <= this.smile_height && this.effective_flag == 1) {
                    // 中点右侧
                    this.smile_box_x = this.line_end_x2 <= this.max_x ? this.line_end_x2 - this.smile_width / 2 : this.max_x
                    this.slider_start_x = this.fixed_box_x //添加左侧
                    this.slider_end_x = this.line_end_x2 <= this.max_x ? this.line_end_x2 - this.smile_width / 2 : this.max_x
                    this.effective_x = this.line_end_x2
                    this.left_radius_flag = 0
                    this.right_radius_flag = 1
                    // 设置
                    console.log('右：this.smile_box_x, this.slider_start_x, this.slider_end_x', this.smile_box_x, this.slider_start_x, this.slider_end_x,
                        this.slider_end_x - this.slider_start_x, this.slider_per_pixels, (this.slider_end_x - this.slider_start_x) / this.slider_per_pixels)
                    let right_txt = Math.round((this.slider_end_x - this.slider_start_x) / this.slider_per_pixels * 10) / 10
                    right_txt = Math.round((this.slider_end_x - this.slider_start_x) / this.slider_per_pixels * 1) / 1  // 整数格
                    // right_txt = parseInt((this.slider_end_x - this.slider_start_x) / this.slider_per_pixels * 1) / 1  // 整数格
                    let move_x = right_txt * this.per_pixels
                    let move_data = [move_x, 0]
                    // let [all_graph_svg_mat, draw_text_svg] = this.AllGraphMoveRefresh(this.graph_data_mat, move_data)
                    this.width_polygon = [[this.slider_start_x, 0], [this.slider_end_x + this.smile_width / 2, 0], [this.slider_end_x + this.smile_width / 2, this.slider_height], [this.slider_start_x, this.slider_height]]
                    this.setState({
                        smile_box_x: this.slider_start_x + right_txt * this.slider_per_pixels,
                        leftTxt: 0,
                        rightTxt: right_txt,
                        // graph_svg: all_graph_svg_mat,    // 图形渲染
                        // draw_graph_svg: [draw_text_svg]
                    })
                }
                else if (this.line_end_x2 < (this.fixed_box_x + 25) && this.line_end_x2 >= this.min_x &&
                    this.line_end_y2 >= 0 && this.line_end_y2 <= 50 && this.effective_flag == 1) {
                    this.slider_start_x = ((this.line_end_x2 - this.smile_width / 2) >= this.min_x ? this.line_end_x2 : this.min_x + this.smile_width / 2) //添加左侧
                    this.smile_box_x = this.slider_start_x
                    this.slider_end_x = this.fixed_box_x + this.smile_width
                    this.effective_x = this.line_end_x2
                    this.left_radius_flag = 1
                    this.right_radius_flag = 0
                    // 设置
                    console.log('左：this.smile_box_x, this.slider_start_x, this.slider_end_x', this.smile_box_x, this.slider_start_x, this.slider_end_x,
                        this.slider_end_x - this.slider_start_x, this.slider_per_pixels, Math.round((this.slider_end_x - this.slider_start_x) / this.slider_per_pixels * 1) / 1)
                    let left_txt = Math.round((this.slider_end_x - this.slider_start_x - this.smile_width) / this.slider_per_pixels * 10 - 10) / 10
                    left_txt = Math.round((this.slider_end_x - this.slider_start_x - this.smile_width / 2) / this.slider_per_pixels * 1) / 1 //整数格
                    // left_txt = parseInt((this.slider_end_x - this.slider_start_x) / this.slider_per_pixels * 1) / 1 - 1 //整数格
                    let move_x = -left_txt * this.per_pixels
                    let move_data = [move_x, 0]
                    // let [all_graph_svg_mat, draw_text_svg] = this.AllGraphMoveRefresh(this.graph_data_mat, move_data)
                    this.width_polygon = [
                        [this.slider_start_x, 0],
                        [this.slider_end_x, 0],
                        [this.slider_end_x, this.slider_height],
                        [this.slider_start_x, this.slider_height]
                    ]
                    this.setState({
                        slider_start_x: this.slider_start_x,
                        slider_end_x: this.slider_end_x,
                        smile_box_x: this.slider_end_x - this.slider_per_pixels * left_txt - this.smile_width,
                        // slider_width: this.slider_width,
                        leftTxt: left_txt,
                        rightTxt: 0,
                        // graph_svg: all_graph_svg_mat,    // 图形渲染
                        // draw_graph_svg: [draw_text_svg]
                    })
                }
                else {
                    this.effective_flag = -1
                    this.setState({
                        smile_color: 'orange'
                    })
                }
                console.log('this.effective_x', this.effective_x)
                console.log('过程求解', this.slider_start_x, this.slider_end_x)
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                console.log('渲染点击点', this.line_start_x2, this.line_start_y2)
                this.effective_flag = -1
                this.setState({
                    smile_color: 'orange'
                })
            },

            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },

            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
    }

    AllGraphMoveRefresh = (all_graph_data, move_data) => {
        // 绘制文本
        let graph_data_mat = this.bpc_cls.MoveAllGraphData(all_graph_data, move_data)
        let all_graph_svg_mat = this.svg_cls.DrawAllGraph(graph_data_mat)
        let draw_text_svg = []
        let graph_text_mat = this.bpc_cls.getAllGraphLocText(graph_data_mat)
        for (let idx = 0; idx < graph_text_mat.length; idx++) {
            for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
                console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
                draw_text_svg.push(this.svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'black')) // 文本
            }
        }
        return [all_graph_svg_mat, draw_text_svg]
    }

    render() {
        return (
           <View>
               <View style={{ width: this.slider_width, height: this.smile_height, backgroundColor: 'transparent', top: 5 }}>
                   <Svg style={{ width: this.slider_width, height: this.slider_height, backgroundColor: 'white', top: (this.smile_height - this.slider_height) / 2, left: 0, borderRadius: pxToDp(this.smile_height / 2) }}>
                       <Polygon
                           points={this.width_polygon.join(' ')}  //多边形的每个角的x和y坐标
                           fill="gray"     //填充颜色
                           stroke="transparent"   //外边框颜色
                           strokeWidth="0"   //外边框宽度
                       />
                   </Svg>
                   {/*<View style={{ backgroundColor: 'transparent', height: this.smile_height, width: this.smile_width, position: 'absolute', left: this.state.smile_box_x }}>*/}
                   {/*    <AntDesign name={'smileo'} size={50} style={{ color: this.state.smile_color }} />*/}
                   {/*</View>*/}
               </View>
               <View style={{ width: this.w, height: this.h, top: 10, left: 25, backgroundColor: 'transparent', position: 'absolute' }}
                     {...this._panResponderDrawLine2.panHandlers}>
               </View>
               <Text style={{ fontSize: 20, color: 'purple', position: 'absolute', top: 55 }}>左移:</Text>
               <Text style={{ fontSize: 20, color: 'red', position: 'absolute', top: 55, left: 100 }}>{this.state.leftTxt}</Text>
               <Text style={{ fontSize: 20, color: 'purple', position: 'absolute', top: 75 }}>右移:</Text>
               <Text style={{ fontSize: 20, color: 'red', position: 'absolute', top: 75, left: 100 }}>{this.state.rightTxt}</Text>
           </View>
        )
    }
}

export default InputRange
