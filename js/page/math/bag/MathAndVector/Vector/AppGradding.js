/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, PanResponder, ART, ImageBackground } from 'react-native'
// import Util from './common/util'
import Svg, { Line, Path, Rect, Polygon, Text as SText, Circle, Ellipse, Polyline } from "react-native-svg";
import { MathGraphClass } from "./MathGraphModule.js"
import TestVector from "./testVector"

var _ = require('lodash')
let newgraphcls = new MathGraphClass()
let coordinate_height = 510
let coordinate_width = 710
// let gradding_pixels_num = 50 // 格子像素点对应数量
let gradding_strokeWidth = 2
let min_pixels_num = 20  // 最小像素点数
let max_pixels_num = 80  // 最大像素点数
let stroke_opacity = 0.3 // 线条透明度
let fill_opacity = 0.5  // 填充透明度
let gradding_display_mode = 'downleft'  // 展示模式----左上：upleft,中心：centre,左下：downleft，完整一象限；
// 定义平行四边形的参数：---底、高、起始点、角度---两边横向分离数
let parallelogram_base_num = 3  //  底边
let parallelogram_height_num = 2 // 高
let [parallelogram_start_x, parallelogram_start_y] = [3, 2] // 起始位置
let parallelogram_cut_num = 2  // 顶边x-底边x
// 建立图形坐标数据组----直接给出图形坐标点位、通过属性定义生成坐标点；统一渲染
let all_graph_coordinate_mat = []
all_graph_coordinate_mat.push([[10, 2], [12, 4]])
all_graph_coordinate_mat.push([[8, 5.5], [4, 5.5]])
all_graph_coordinate_mat.push([[9, 8], [7, 6]])
all_graph_coordinate_mat.push([[2, 7], [6, 7]])

all_graph_coordinate_mat.push([[3, 3], [3, 5]])
all_graph_coordinate_mat.push([[3, 3], [5, 3]])
all_graph_coordinate_mat.push([[5, 3], [5, 5]])
all_graph_coordinate_mat.push([[3, 5], [5, 5]])
// all_graph_coordinate_mat.push([[3, 5], [5, 4], [8, 5], [9, 8], [6, 7]])

const log = console.log.bind(console)

class SvgDrawTest extends Component {
    constructor(props) {
        super(props);
        this.allPoint = ''
        this.state = {
            // drawPath: 'M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25'
            drawPath: '',
            line_start_x: -10,
            line_start_y: -10,
            line_end_x: -100,
            line_end_y: -100,
            split_mat_svg: [],        //分离数组组合svg
            gradding_svg: [],    // 网格显示
            graph_svg: [],       // 图形绘制
            touch_svg_mat: [],
            all_svg_mat: [],
            drag_svg: [],             // 拖拽图形
            grid_choice_svg: [],      // 网格选择
            adsorb_svg: [],           // 吸附展示
            closed_graph_svg: [],     // 封闭图像
            draw_graph_svg: [],        //绘图
        }
        this.gradding_pixels_num = 50  //初始格子一格像素点数
        this.graph_choice_idx = -1    // 图选择
        this.line_choice_idx = -1     // 线选择
        this.point_choice_idx = -1   // 点选择
        this.gradding_mode = ''     // 网格展示模式
        this.gradding_size = 1      // 展示比例
        this.gradding_point_mat = []  // 网格点生成
        this.gradding_svg_mat = []
        this.init_x = 0   // 坐标建立初始点
        this.init_y = 0   // 坐标建立初始点
        this.gradding_row_mat = []
        this.gradding_col_mat = []
        this.graph_svg_mat = []   // 图形绘制
        this.touch_svg_mat = []   // 触摸响应绘制
        this.drag_svg_mat = []
        this.graph_data_mat = []        // 组件屏幕坐标
        this.graph_coordinate_mat = []  // 坐标系下坐标
        this.temporary_svg_mat = []   // 临时图形
        this.temporary_data_mat = []   // 临时图形坐标
        this.all_graph_svg_mat = []    // 全图像渲染
        this.func_mode = 'combine_line'
        // graph_move:图形移动、line_move:线条移动、point_move:点移动、
        // grid_choice:格子选择、combine_line:组合线条、combine_graph:组合图像、all_move:线和封闭图形的移动
        // draw_graph:画线、multi_line：连续线、"auxiliary_high":辅助做高、"auxiliary_high2":辅助做高2---外延辅助线
        // cut_graph:图形切割
        this.choice_grid_mat = [] // 网格选择
        this.grid_x_idx = -1    // 网格选择索引
        this.grid_y_idx = -1
        this.adsorb_svg = []  // 吸附
        this.closed_graph_svg = []  // 封闭图像
        // 绘图数据
        this.draw_graph_data = []     // 线条数据
        this.draw_graph_svg = []      // 绘图数据
        this.part_squential_mat = []  // 单组连续点数组
    }
    componentWillMount() {
        // 初始化渲染
        this.GraddingGenerator()
        // this.ParallelogramDraw()    //图形绘制
        // 全图像绘制
        this.AllCoordinateGraphDraw(all_graph_coordinate_mat)

        this._panResponderDrawLine = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
                // gestureState.{x,y} 现在会被设置为0
                console.log('手指开始接触====111111111', evt.nativeEvent)
                // let tempfirstX = evt.nativeEvent.pageX     // 页面坐标
                // let tempFirstY = evt.nativeEvent.pageY
                let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
                let tempFirstY = evt.nativeEvent.locationY
                this.line_start_x = Math.round(tempfirstX * 100) / 100
                this.line_start_y = Math.round(tempFirstY * 100) / 100
                this.fixed_x = Math.round(tempfirstX * 100) / 100
                this.fixed_y = Math.round(tempFirstY * 100) / 100
                // 判定所选区域
                if (this.func_mode === 'graph_move') {
                    this.graph_choice_idx = this.JudgePointInAreaIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
                }
                this.temporary_svg_mat = []
                // 选择线
                if (this.func_mode === 'line_move') {
                    [this.graph_choice_idx, this.line_choice_idx] = this.JudgePointInLine([this.line_start_x, this.line_start_y], this.graph_data_mat)
                }

                if (this.func_mode === 'point_move') {
                    [this.graph_choice_idx, this.point_choice_idx] = this.JudgePointInPoint([this.line_start_x, this.line_start_y], this.graph_data_mat)
                }

                if (this.func_mode === 'grid_choice') {
                    [this.grid_x_idx, this.grid_y_idx] = this.JudgeGridChoice([this.line_start_x, this.line_start_y])
                    // console.log('网格选择索引', this.grid_x_idx, this.grid_y_idx)
                    // console.log('this.choice_grid_mat', JSON.stringify(this.choice_grid_mat))
                    if (this.grid_x_idx >= 0 && this.grid_y_idx >= 0) {
                        // 网格筛重
                        let heavy_idx = this.DataScreeningHeavy([this.grid_x_idx, this.grid_y_idx], this.choice_grid_mat)
                        console.log('heavy_idx--------', heavy_idx)
                        if (heavy_idx < 0) {
                            this.choice_grid_mat.push([this.grid_x_idx, this.grid_y_idx])
                        }
                        else {
                            this.choice_grid_mat.splice(heavy_idx, 1)
                        }
                    }
                    // console.log('this.choice_grid_mat', JSON.stringify(this.choice_grid_mat))
                }
                if (this.func_mode === 'all_move') {
                    // 数组内所有图形移动
                    let choice_data = this.JudgeTouchGraphIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
                    console.log('---------choice_data', choice_data)
                    this.graph_choice_idx = choice_data[0]
                }
                if (this.func_mode === 'combine_line') {
                    // 数组内所有图形移动---组合线段
                    let choice_data = this.JudgeTouchGraphIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
                    console.log('---------choice_data', choice_data)
                    this.graph_choice_idx = choice_data[0]
                }
                if (this.func_mode === 'draw_graph') {
                    // 初始点吸附网格
                    let absorb_x = this.gradding_col_mat[Math.round((this.line_start_x - this.init_x) / this.gradding_pixels_num)][0]
                    let absorb_y = this.gradding_row_mat[Math.round((this.init_y - this.line_start_y) / this.gradding_pixels_num)][1]
                    // console.log('-------画图吸附网格点', JSON.stringify([this.line_start_x, absorb_x]))
                    // console.log('-------画图吸附网格点', JSON.stringify([this.line_start_y, absorb_y]))
                    this.line_start_x = absorb_x
                    this.line_start_y = absorb_y
                }
                if (this.func_mode === 'multi_line') {
                    // 初始点吸附网格
                    let absorb_x = this.gradding_col_mat[Math.round((this.line_start_x - this.init_x) / this.gradding_pixels_num)][0]
                    let absorb_y = this.gradding_row_mat[Math.round((this.init_y - this.line_start_y) / this.gradding_pixels_num)][1]
                    // console.log('-------画图吸附网格点', JSON.stringify([this.line_start_x, absorb_x]))
                    // console.log('-------画图吸附网格点', JSON.stringify([this.line_start_y, absorb_y]))
                    this.line_start_x = absorb_x
                    this.line_start_y = absorb_y
                    this.part_squential_mat.push([this.line_start_x, this.line_start_y])
                }
                if (this.func_mode === 'auxiliary_high') {
                    // 图形做高线
                    [this.graph_choice_idx, this.point_choice_idx] = this.JudgePointInPoint([this.line_start_x, this.line_start_y], this.graph_data_mat)
                    if (this.graph_choice_idx >= 0) {
                        // 有效选择图形端点
                        this.line_start_x = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][0]
                        this.line_start_y = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][1]
                    }

                    console.log('图形端点', this.graph_choice_idx, this.point_choice_idx, this.line_start_x, this.line_start_y)
                }
                if (this.func_mode === 'auxiliary_high2') {
                    // 图形做高线----添加外延虚线
                    [this.graph_choice_idx, this.point_choice_idx] = this.JudgePointInPoint([this.line_start_x, this.line_start_y], this.graph_data_mat)
                    if (this.graph_choice_idx >= 0) {
                        // 有效选择图形端点
                        this.line_start_x = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][0]
                        this.line_start_y = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][1]
                    }
                    console.log('图形端点', this.graph_choice_idx, this.point_choice_idx, this.line_start_x, this.line_start_y)
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                // console.log('移动响应==========================================')
                // 最近一次的移动距离为gestureState.move{X,Y}
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
                let pointX = evt.nativeEvent.locationX
                let pointY = evt.nativeEvent.locationY
                this.line_end_x = Math.round(pointX * 100) / 100
                this.line_end_y = Math.round(pointY * 100) / 100
                if (this.func_mode === 'graph_move' && this.graph_choice_idx >= 0) {
                    console.log('-----图形选择索引', this.graph_choice_idx)
                    // 移动量
                    let move_dx = this.line_end_x - this.line_start_x
                    let move_dy = this.line_end_y - this.line_start_y
                    // 绘制临时图形
                    this.DrawTemporarySvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
                    this.setState({
                        drag_svg: this.temporary_svg_mat, // 临时图形
                        graph_svg: [],   // 修改多组图形存在时的数据
                    })
                }
                else if (this.func_mode === 'line_move' && this.graph_choice_idx >= 0 && this.line_choice_idx >= 0) {
                    console.log('选择移动线条')
                    // 移动量
                    let move_dx = this.line_end_x - this.line_start_x
                    let move_dy = this.line_end_y - this.line_start_y
                    // 绘制临时图形
                    this.DrawTemporaryParallelogramLineSvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
                    this.setState({
                        drag_svg: this.temporary_svg_mat, // 临时图形
                        graph_svg: [],   // 修改多组图形存在时的数据
                    })
                }
                else if (this.func_mode === 'point_move' && this.graph_choice_idx >= 0 && this.point_choice_idx >= 0) {
                    console.log('选择移动点', this.graph_choice_idx, this.point_choice_idx)
                    // 移动量
                    let move_dx = this.line_end_x - this.line_start_x
                    let move_dy = this.line_end_y - this.line_start_y
                    // 绘制临时图形
                    this.DrawTemporaryParallelogramPointSvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
                    this.setState({
                        drag_svg: this.temporary_svg_mat, // 临时图形
                        graph_svg: [],   // 修改多组图形存在时的数据
                    })
                }
                else if (this.func_mode === 'grid_choice' && this.choice_grid_mat.length > -1) {
                    // 网格渲染---可以设计多次点击消除
                    let grid_choice_svg_mat = this.ChoiceGridRender()
                    this.setState({
                        grid_choice_svg: grid_choice_svg_mat,
                    })
                }
                else if (this.func_mode === 'all_move' && this.graph_choice_idx >= 0) {
                    // 移动量
                    let move_dx = this.line_end_x - this.line_start_x
                    let move_dy = this.line_end_y - this.line_start_y
                    // 绘制临时图形
                    this.DrawTemporarySvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
                    // this.graph_data_mat[this.graph_choice_idx]
                    this.graph_svg_mat[this.graph_choice_idx] = this.temporary_svg_mat
                    // this.graph_svg_mat = this.RefreshAllGraphSvg(this.graph_data_mat, this.graph_choice_idx)
                    this.setState({
                        // drag_svg: this.temporary_svg_mat, // 临时图形
                        graph_svg: this.graph_svg_mat,   // 修改多组图形存在时的数据
                    })
                }
                else if (this.func_mode === 'combine_line' && this.graph_choice_idx >= 0) {
                    // 移动量
                    let move_dx = this.line_end_x - this.line_start_x
                    let move_dy = this.line_end_y - this.line_start_y
                    // 绘制临时图形
                    this.DrawTemporarySvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
                    // this.graph_data_mat[this.graph_choice_idx]
                    this.graph_svg_mat[this.graph_choice_idx] = this.temporary_svg_mat
                    // this.graph_svg_mat = this.RefreshAllGraphSvg(this.graph_data_mat, this.graph_choice_idx)
                    // 建立自动吸附计算----控制距离内绘制圆圈，更新坐标显示，释放后自动判定是否为吸附计算
                    let contrast_mat = this.EndpointAdsorptionCalculate(this.graph_data_mat, this.graph_choice_idx, this.temporary_data_mat)
                    // console.log('吸附比较', contrast_mat)
                    this.adsorb_svg = []
                    if (contrast_mat[0] >= 0) {
                        // 存在吸附接近点
                        let absorb_point = this.graph_data_mat[contrast_mat[0]][contrast_mat[2]]
                        this.adsorb_svg.push(
                            (<Circle
                                cx={absorb_point[0] + gradding_strokeWidth / 2}   //x轴的开始位置
                                cy={absorb_point[1] + gradding_strokeWidth / 2}  //y轴的开始位置
                                // stroke="red"  //填充颜色
                                // strokeWidth={gradding_strokeWidth}  //填充宽度
                                // strokeOpacity={stroke_opacity}
                                r="5"    //半径
                                stroke="lime"　　//外边框 颜色　　
                                strokeWidth="2"  //外边框 宽度
                                fill="transparent"   //填充颜色
                            />)
                        )
                        // 更新 移动线条数据----this.temporary_data_mat
                        let absorb_x = absorb_point[0] - this.temporary_data_mat[contrast_mat[1]][0]    //
                        let absorb_y = absorb_point[1] - this.temporary_data_mat[contrast_mat[1]][1]    // 平移端点
                        this.temporary_data_mat[contrast_mat[1]][0] += absorb_x
                        this.temporary_data_mat[contrast_mat[1]][1] += absorb_y
                        this.temporary_data_mat[(contrast_mat[1] + 1) % 2][0] += absorb_x
                        this.temporary_data_mat[(contrast_mat[1] + 1) % 2][1] += absorb_y
                        // 重新绘制
                        this.temporary_svg_mat = []
                        this.temporary_svg_mat.push(<Line
                            x1={this.temporary_data_mat[0][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                            y1={this.temporary_data_mat[0][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                            x2={this.temporary_data_mat[1][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                            y2={this.temporary_data_mat[1][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                            stroke="red"  //填充颜色
                            strokeWidth={3}  //填充宽度
                            // strokeWidth={gradding_strokeWidth}  //填充宽度
                            // strokeOpacity={stroke_opacity}
                        />)
                        this.graph_svg_mat[this.graph_choice_idx] = this.temporary_svg_mat
                    }
                    this.setState({
                        // drag_svg: this.temporary_svg_mat, // 临时图形
                        graph_svg: this.graph_svg_mat,   // 修改多组图形存在时的数据
                        adsorb_svg: this.adsorb_svg // 吸附展示更新
                    })
                }
                else if (this.func_mode === 'draw_graph') {
                    // 绘制图形---分为：网格绘制和任意绘制、建立可删除线段、组合图形、
                    // this.draw_graph_data.push([[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]])
                    // console.log()
                    // 绘制图像
                    let draw_single_svg = this.DrawGraphSvg([[[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]]) // 临时线
                    // 端点锁定
                    let end_absorb_x = this.gradding_col_mat[Math.round((this.line_end_x - this.init_x) / this.gradding_pixels_num)][0]
                    let end_absorb_y = this.gradding_row_mat[Math.round((this.init_y - this.line_end_y) / this.gradding_pixels_num)][1] // 最近端点
                    let end_absorb_svg = []
                    if (this.TwoPointDistance([this.line_end_x, this.line_end_y], [end_absorb_x, end_absorb_y]) < 15) {
                        end_absorb_svg.push(
                            (<Circle
                                cx={end_absorb_x + gradding_strokeWidth / 2}   //x轴的开始位置
                                cy={end_absorb_y + gradding_strokeWidth / 2}  //y轴的开始位置
                                // stroke="red"  //填充颜色
                                strokeWidth={gradding_strokeWidth}  //填充宽度
                                strokeOpacity={stroke_opacity}
                                r="3"    //半径
                                // stroke="black"　　//外边框 颜色　　
                                // strokeWidth="0"  //外边框 宽度
                                fill="red"   //填充颜色
                            />)
                        )
                        draw_single_svg = this.DrawGraphSvg([[[this.line_start_x, this.line_start_y], [end_absorb_x, end_absorb_y]]]) // 临时线
                    }
                    this.setState({
                        draw_graph_svg: [this.draw_graph_svg, draw_single_svg, end_absorb_svg],  // 考虑添加控制平行线
                    })
                }
                else if (this.func_mode === 'multi_line') {
                    // 连续拐点线---可消除---数据存储
                    let end_absorb_x = this.gradding_col_mat[Math.round((this.line_end_x - this.init_x) / this.gradding_pixels_num)][0]
                    let end_absorb_y = this.gradding_row_mat[Math.round((this.init_y - this.line_end_y) / this.gradding_pixels_num)][1] // 最近端点
                    let end_absorb_svg = []
                    console.log('this.part_squential_mat1', JSON.stringify(this.part_squential_mat))
                    if (this.TwoPointDistance([this.line_end_x, this.line_end_y], [end_absorb_x, end_absorb_y]) < 15) {  // 到端点
                        // 判定是否添加还是删除
                        if (this.part_squential_mat.length > 1 &&
                            end_absorb_x === this.part_squential_mat[this.part_squential_mat.length - 2][0] &&
                            end_absorb_y === this.part_squential_mat[this.part_squential_mat.length - 2][1]) {
                            // 删除最近点
                            this.part_squential_mat.pop()
                        }
                        else if (end_absorb_x !== this.part_squential_mat[this.part_squential_mat.length - 1][0] ||
                            end_absorb_y !== this.part_squential_mat[this.part_squential_mat.length - 1][1]) {

                            this.part_squential_mat.push([end_absorb_x, end_absorb_y])
                        }
                    }
                    console.log('this.part_squential_mat2', JSON.stringify(this.part_squential_mat))
                    let part_line_svg = this.DrawSequentialPoints(this.part_squential_mat)
                    let temp_line_svg = this.DrawTemporaryLine(this.part_squential_mat[this.part_squential_mat.length - 1], [this.line_end_x, this.line_end_y])
                    this.setState({
                        draw_graph_svg: [part_line_svg, temp_line_svg]
                    })
                }
                else if (this.func_mode === 'auxiliary_high' && this.graph_choice_idx >= 0) {
                    let part_line_svg = this.DrawSequentialPoints([[this.line_start_x, this.line_start_y]])
                    let temp_line_svg = this.DrawTemporaryLineDash([this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y], [10, 5])
                    // console.log('绘制线', JSON.stringify([[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]))
                    // console.log('底', JSON.stringify([this.graph_data_mat[0][0], this.graph_data_mat[0][1]]))
                    // let [intersect_mat, ployline_mat] = this.CalculateHighLine(
                    //   [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]],
                    //   [this.graph_data_mat[0][0], this.graph_data_mat[0][1]], 15) // 交点和垂线符号
                    let cut_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]
                    let [intersect_mat, ployline_mat] = this.AllCalculateHighLine(cut_line_mat, this.graph_data_mat[this.graph_choice_idx], this.point_choice_idx, 15)
                    let intersect_svg_mat = []
                    if (intersect_mat.length === 3) {
                        // 绘制交点
                        intersect_svg_mat.push((<Circle
                            cx={intersect_mat[1]}   //中心点x
                            cy={intersect_mat[2]}   //中心点y
                            r="4"    //半径
                            stroke="black"　　//外边框 颜色　　
                            strokeWidth="1.5"  //外边框 宽度
                            fill="red"   //填充颜色
                        />))
                        temp_line_svg = this.DrawTemporaryLineDash([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]], [10, 5])
                    }
                    let high_svg_mat = []
                    if (ployline_mat.length === 3) {
                        high_svg_mat.push(
                            <Polyline
                                points={ployline_mat.join(' ')}  //多段线的各个点
                                fill="none"   //填充颜色 无
                                stroke="red" //边框色
                                strokeWidth="3" //边框宽度
                                // strokeDasharray={[10,10]}
                            />
                        )
                    }
                    this.setState({
                        draw_graph_svg: [part_line_svg, temp_line_svg, intersect_svg_mat, high_svg_mat]
                    })
                }
                else if (this.func_mode === 'auxiliary_high2' && this.graph_choice_idx >= 0) {
                    let part_line_svg = this.DrawSequentialPoints([[this.line_start_x, this.line_start_y]])
                    let temp_line_svg = this.DrawTemporaryLineDash([this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y], [10, 5])
                    // console.log('绘制线', JSON.stringify([[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]))
                    // console.log('底', JSON.stringify([this.graph_data_mat[0][0], this.graph_data_mat[0][1]]))
                    // let [intersect_mat, ployline_mat] = this.CalculateHighLine(
                    //   [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]],
                    //   [this.graph_data_mat[0][0], this.graph_data_mat[0][1]], 15) // 交点和垂线符号
                    let cut_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]
                    let [intersect_mat, ployline_mat, line_idx] = this.AllCalculateHighLine2(cut_line_mat, this.graph_data_mat[this.graph_choice_idx], this.point_choice_idx, 15)
                    let intersect_svg_mat = []
                    if (intersect_mat.length === 3 && intersect_mat[0] === 0) {
                        // 绘制交点
                        intersect_svg_mat.push((<Circle
                            cx={intersect_mat[1]}   //中心点x
                            cy={intersect_mat[2]}   //中心点y
                            r="4"    //半径
                            stroke="black"　　//外边框 颜色　　
                            strokeWidth="1.5"  //外边框 宽度
                            fill="red"   //填充颜色
                        />))
                        temp_line_svg = this.DrawTemporaryLineDash([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]], [10, 5])
                    }
                    else if (intersect_mat.length === 3 && intersect_mat[0] === 100) {
                        // 绘制交点----辅助延长线
                        if (this.TwoPointDistance([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]]) <=
                            this.TwoPointDistance([this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y])) {
                            // 交点距离与实际触点距离比较，小于绘制交点
                            // 添加方向----
                            let touch_vector = [
                                this.line_end_x - this.line_start_x,
                                this.line_end_y - this.line_start_y,
                            ] // 触摸向量
                            let intersect_vector = [
                                intersect_mat[1] - this.line_start_x,
                                intersect_mat[2] - this.line_start_y,
                            ]   // 交点方向
                            if ((touch_vector[0] * intersect_vector[0] + touch_vector[1] * intersect_vector[1]) > 0) {
                                // 同方向
                                intersect_svg_mat.push((<Circle
                                    cx={intersect_mat[1]}   //中心点x
                                    cy={intersect_mat[2]}   //中心点y
                                    r="4"    //半径
                                    stroke="black"　　//外边框 颜色　　
                                    strokeWidth="1.5"  //外边框 宽度
                                    fill="red"   //填充颜色
                                />))
                                // 绘制延长线
                                // 处理计算交点外的延长线段:向量、长度、
                                let part_start_point = [
                                    this.graph_data_mat[this.graph_choice_idx][(line_idx + 1) % (this.graph_data_mat[this.graph_choice_idx].length)][0],
                                    this.graph_data_mat[this.graph_choice_idx][(line_idx + 1) % (this.graph_data_mat[this.graph_choice_idx].length)][1]
                                ]
                                let part_intersection_point = [intersect_mat[1], intersect_mat[2]]
                                let part_distance = this.TwoPointDistance(part_start_point, part_intersection_point)  // 长度
                                let part_vector_x = (part_intersection_point[0] - part_start_point[0]) / part_distance    // 单位向量
                                let part_vector_y = (part_intersection_point[1] - part_start_point[1]) / part_distance
                                let add_length = 20
                                let part_end_point = [
                                    part_intersection_point[0] + add_length * part_vector_x,
                                    part_intersection_point[1] + add_length * part_vector_y,
                                ]
                                intersect_svg_mat.push((<Line
                                    x1={part_start_point[0]}   // x轴的开始位置
                                    y1={part_start_point[1]}   // y轴的开始位置
                                    x2={part_end_point[0]}   // x轴的结束位置
                                    y2={part_end_point[1]}   // y轴的结束位置
                                    stroke="black"  //填充颜色
                                    strokeWidth={3}  //填充宽度
                                    strokeDasharray={[10, 5]}
                                />))
                                temp_line_svg = this.DrawTemporaryLineDash([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]], [10, 5])
                            }
                        }

                    }
                    // 设置区分内交点、外交点
                    let high_svg_mat = []
                    if (intersect_mat.length === 3 && intersect_mat[0] === 0 && ployline_mat.length === 3) {
                        // 内交点----重复设计
                        high_svg_mat.push(
                            <Polyline
                                points={ployline_mat.join(' ')}  //多段线的各个点
                                fill="none"   //填充颜色 无
                                stroke="red" //边框色
                                strokeWidth="3" //边框宽度
                                // strokeDasharray={[10,10]}
                            />
                        )
                    }
                    else if (intersect_mat.length === 3 && intersect_mat[0] === 100 && ployline_mat.length === 3) {
                        // 外交点---长度、方向
                        if (this.TwoPointDistance([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]]) <=
                            this.TwoPointDistance([this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y])) {
                            // 交点长度小于实际触摸长度
                            // 添加方向----
                            let touch_vector = [
                                this.line_end_x - this.line_start_x,
                                this.line_end_y - this.line_start_y,
                            ] // 触摸向量
                            let intersect_vector = [
                                intersect_mat[1] - this.line_start_x,
                                intersect_mat[2] - this.line_start_y,
                            ]   // 交点方向
                            if ((touch_vector[0] * intersect_vector[0] + touch_vector[1] * intersect_vector[1]) > 0) {
                                // 同方向
                                high_svg_mat.push(
                                    <Polyline
                                        points={ployline_mat.join(' ')}  //多段线的各个点
                                        fill="none"   //填充颜色 无
                                        stroke="red" //边框色
                                        strokeWidth="3" //边框宽度
                                        // strokeDasharray={[10,10]}
                                    />
                                )
                            }
                        }
                    }
                    this.setState({
                        draw_graph_svg: [part_line_svg, temp_line_svg, intersect_svg_mat, high_svg_mat]
                    })
                }

            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                console.log('渲染点击点', this.line_start_x, this.line_start_y)
                // 计算点击交叉点
                // this.graph_svg_mat = []
                // this.ParallelogramDraw()    //图形绘制
                if (this.graph_choice_idx >= 0 && this.func_mode !== 'auxiliary_high' && this.func_mode !== 'auxiliary_high2') {
                    this.graph_data_mat[this.graph_choice_idx] = this.temporary_data_mat
                }
                // 更新全局图像
                console.log('------this.graph_choice_idx', JSON.stringify(this.graph_choice_idx))
                this.all_graph_svg_mat = this.RefreshAllGraphSvg(this.graph_data_mat, this.graph_choice_idx)
                this.graph_svg_mat = _.cloneDeep(this.all_graph_svg_mat)
                console.log('-=========this.all_graph_svg_mat', this.all_graph_svg_mat)
                // this.AllCoordinateGraphDraw(all_graph_coordinate_mat)
                this.closed_graph_svg = []
                if (this.func_mode === 'combine_line') {
                    // 计算线条数组组合情况---更新组合情况
                    let combine_idx_mat = this.JudgeCombineLine(this.graph_data_mat)
                    if (combine_idx_mat.length > 0) {
                        // 存在组合线条、分类型判定----封闭图像
                        for (let idx = 0; idx < combine_idx_mat.length; idx++) {
                            if (combine_idx_mat[idx].length > 2) {
                                // 最少为3组线---封闭图形----头尾关系---正负方向
                                let closed_graph_mat = this.JudgeClosedGraph(this.graph_data_mat, combine_idx_mat[idx])
                                let move_closed_graph_mat = this.DataMove(closed_graph_mat, [gradding_strokeWidth / 2, gradding_strokeWidth / 2])
                                // 绘制封闭图像
                                console.log('=========move_closed_graph_mat', JSON.stringify(move_closed_graph_mat))
                                if (closed_graph_mat.length > 0) {
                                    this.closed_graph_svg.push(
                                        (<Polygon
                                            points={move_closed_graph_mat.join(' ')}  //多边形的每个角的x和y坐标
                                            fill="red"     //填充颜色
                                            fillOpacity={0.1}
                                            stroke="red"   //外边框颜色
                                            strokeWidth="3"   //外边框宽度
                                        />)
                                    )
                                }
                            }
                        }
                    }
                }
                if (this.func_mode === 'draw_graph') {
                    if (this.TwoPointDistance([this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]) > 50) {
                        // 绘制线段大于某个长度---绘制
                        let end_absorb_x = this.gradding_col_mat[Math.round((this.line_end_x - this.init_x) / this.gradding_pixels_num)][0]
                        let end_absorb_y = this.gradding_row_mat[Math.round((this.init_y - this.line_end_y) / this.gradding_pixels_num)][1] // 最近端点
                        if (this.TwoPointDistance([this.line_end_x, this.line_end_y], [end_absorb_x, end_absorb_y]) < 15) {
                            this.draw_graph_data.push([[this.line_start_x, this.line_start_y], [end_absorb_x, end_absorb_y]])
                        }
                        else {
                            this.draw_graph_data.push([[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]])

                        }
                    }
                    // 绘制图像
                    this.draw_graph_svg = this.DrawGraphSvg(this.draw_graph_data)
                    this.setState({
                        draw_graph_svg: this.draw_graph_svg,
                    })
                }
                else if (this.func_mode === 'auxiliary_high') {
                    this.AllCoordinateGraphDraw(all_graph_coordinate_mat)
                    this.graph_choice_idx = -1    // 图选择
                    this.line_choice_idx = -1     // 线选择
                    this.point_choice_idx = -1   // 点选择
                    this.setState({
                        drag_svg: [], // 临时图形
                        // graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
                        // graph_svg: this.graph_svg_mat,
                        // adsorb_svg: [],         // 吸附展示更新
                        // closed_graph_svg: this.closed_graph_svg,   // 封闭图像
                    })
                }
                else {
                    this.graph_choice_idx = -1    // 图选择
                    this.line_choice_idx = -1     // 线选择
                    this.point_choice_idx = -1   // 点选择
                    this.setState({
                        drag_svg: [], // 临时图形
                        graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
                        // graph_svg: this.graph_svg_mat,
                        adsorb_svg: [],         // 吸附展示更新
                        closed_graph_svg: this.closed_graph_svg,   // 封闭图像
                    })
                }
                // 测试图像坐标转换
                console.log('------测试图像坐标转换')
                // let coordinate_mat = this.ComponentTransformCoordinate(this.graph_data_mat[0])
                // let component_mat = this.CoordinateTransformComponent(coordinate_mat)
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

    componentDidMount() {
        console.log('后渲染')
    }

    DataScreeningHeavy = (judge_mat, old_data) => {
        // 数据筛重---judge_mat--判定二元数组，old_data:筛选数组
        // let heavy_idx = -1
        for (let idx = 0; idx < old_data.length; idx++) {
            if (judge_mat[0] === old_data[idx][0] && judge_mat[1] === old_data[idx][1]) {
                return idx
            }
        }
        return -1
    }

    DataMove = (old_data, move_data) => {
        let new_data = []
        for (let idx = 0; idx < old_data.length; idx++) {
            // console.log('线条', JSON.stringify(old_data[idx]))
            // let start_point = old_data[idx][0]
            new_data.push([
                [old_data[idx][0][0] + move_data[0], old_data[idx][0][1] + move_data[1]],
                [old_data[idx][1][0] + move_data[0], old_data[idx][1][1] + move_data[1]]])
        }
        return new_data
    }

    DrawTemporarySvg = (move_mat, temporary_graph_mat) => {
        // 临时图形绘制
        let new_graph_mat = []      // 更新选择图形坐标矩阵
        for (let idx = 0; idx < temporary_graph_mat.length; idx++) {
            new_graph_mat.push([temporary_graph_mat[idx][0] + move_mat[0], temporary_graph_mat[idx][1] + move_mat[1]])
        }
        this.temporary_data_mat = _.cloneDeep(new_graph_mat)    // 临时图形数据
        this.temporary_svg_mat = []
        if (new_graph_mat.length >= 3) {
            this.temporary_svg_mat.push(
                (<Polygon
                    points={new_graph_mat.join(' ')}  //多边形的每个角的x和y坐标
                    fill="lime"     //填充颜色
                    fillOpacity={0.1}
                    stroke="red"   //外边框颜色
                    strokeWidth="3"   //外边框宽度
                />)
            )
        }
        else if (new_graph_mat.length === 2) {
            // console.log('---------两点', JSON.stringify(new_graph_mat))
            this.temporary_svg_mat.push(
                (<Line
                    x1={new_graph_mat[0][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                    y1={new_graph_mat[0][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                    x2={new_graph_mat[1][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                    y2={new_graph_mat[1][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                    stroke="red"  //填充颜色
                    strokeWidth={3}  //填充宽度
                    // strokeWidth={gradding_strokeWidth}  //填充宽度
                    // strokeOpacity={stroke_opacity}
                />)
            )
        }
        else if (new_graph_mat.length === 1) {
            this.temporary_svg_mat.push(
                (<Circle
                    cx={new_graph_mat[0][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                    cy={new_graph_mat[0][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                    // stroke="red"  //填充颜色
                    strokeWidth={gradding_strokeWidth}  //填充宽度
                    strokeOpacity={stroke_opacity}
                    r="3"    //半径
                    // stroke="black"　　//外边框 颜色　　
                    // strokeWidth="0"  //外边框 宽度
                    fill="red"   //填充颜色
                />)
            )
        }

    }

    DrawTemporaryParallelogramLineSvg = (move_mat, temporary_graph_mat) => {
        // 临时图形绘制---平行四边形边
        let new_graph_mat = []      // 更新选择图形坐标矩阵
        // 固定边端点和移动点的之间的半径
        let fixed_point = temporary_graph_mat[(this.line_choice_idx + 2) % 4]
        let move_point = temporary_graph_mat[(this.line_choice_idx + 1) % 4]
        let vector_a = [move_point[0] - fixed_point[0], move_point[1] - fixed_point[1]]
        let vector_b = [move_point[0] + move_mat[0] - fixed_point[0], move_point[1] + move_mat[1] - fixed_point[1]]
        let rotate_angle = newgraphcls.VectorialAngleDirector(vector_a, vector_b)
        let new_move_point = this.PointRotate(fixed_point, move_point, rotate_angle)
        let new_move_mat = [new_move_point[0] - move_point[0], new_move_point[1] - move_point[1]]
        for (let idx = 0; idx < temporary_graph_mat.length; idx++) {
            if ((this.line_choice_idx + 2) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([temporary_graph_mat[idx][0], temporary_graph_mat[idx][1]])
            }
            else if ((this.line_choice_idx + 3) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([temporary_graph_mat[idx][0], temporary_graph_mat[idx][1]])
            }
            else {
                // 非对角边--移动
                // new_graph_mat.push([temporary_graph_mat[idx][0] + move_mat[0], temporary_graph_mat[idx][1] + move_mat[1]])
                // 添加--固定边长---
                new_graph_mat.push([temporary_graph_mat[idx][0] + new_move_mat[0], temporary_graph_mat[idx][1] + new_move_mat[1]])

            }
        }
        this.temporary_data_mat = _.cloneDeep(new_graph_mat)    // 临时图形数据
        this.temporary_svg_mat = []
        this.temporary_svg_mat.push(
            (<Polygon
                points={new_graph_mat.join(' ')}  //多边形的每个角的x和y坐标
                fill="lime"     //填充颜色
                fillOpacity={0.1}
                stroke="black"   //外边框颜色
                strokeWidth="3"   //外边框宽度
            />)
        )
        // 添加选择线
        console.log('添加--------选择线')
        this.temporary_svg_mat.push(
            (<Line
                x1={new_graph_mat[this.line_choice_idx][0]}   //x轴的开始位置
                y1={new_graph_mat[this.line_choice_idx][1]}   //y轴的开始位置
                x2={new_graph_mat[(this.line_choice_idx + 1) % 4][0]}  //x轴的结束位置
                y2={new_graph_mat[(this.line_choice_idx + 1) % 4][1]}   //y轴的结束位置
                stroke="red"  //填充颜色
                strokeWidth="3"  //填充宽度
            />)
        )
    }

    DrawTemporaryParallelogramPointSvg = (move_mat, temporary_graph_mat) => {
        // 临时图形绘制---平行四边形边
        let new_graph_mat = []      // 更新选择图形坐标矩阵
        // 固定边端点和移动点的之间的半径
        console.log('---------temporary_graph_mat', JSON.stringify(temporary_graph_mat), (this.point_choice_idx + 2) % 4)
        console.log('---------temporary_graph_mat', temporary_graph_mat[(this.point_choice_idx + 2) % 4])
        let fixed_point = temporary_graph_mat[(this.point_choice_idx + 2) % 4]
        let move_point = temporary_graph_mat[(this.point_choice_idx + 1) % 4]
        let vector_a = [move_point[0] - fixed_point[0], move_point[1] - fixed_point[1]]
        let vector_b = [move_point[0] + move_mat[0] - fixed_point[0], move_point[1] + move_mat[1] - fixed_point[1]]
        let rotate_angle = newgraphcls.VectorialAngleDirector(vector_a, vector_b)
        let new_move_point = this.PointRotate(fixed_point, move_point, rotate_angle)
        let new_move_mat = [new_move_point[0] - move_point[0], new_move_point[1] - move_point[1]]
        for (let idx = 0; idx < temporary_graph_mat.length; idx++) {
            if ((this.point_choice_idx + 2) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([temporary_graph_mat[idx][0], temporary_graph_mat[idx][1]])
            }
            else if ((this.point_choice_idx + 3) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([temporary_graph_mat[idx][0], temporary_graph_mat[idx][1]])
            }
            else {
                // 非对角边--移动
                new_graph_mat.push([temporary_graph_mat[idx][0] + move_mat[0], temporary_graph_mat[idx][1] + move_mat[1]])
                // 添加--固定边长---
                // new_graph_mat.push([temporary_graph_mat[idx][0] + new_move_mat[0], temporary_graph_mat[idx][1] + new_move_mat[1]])

            }
        }
        this.temporary_data_mat = _.cloneDeep(new_graph_mat)    // 临时图形数据
        this.temporary_svg_mat = []
        this.temporary_svg_mat.push(
            (<Polygon
                points={new_graph_mat.join(' ')}  //多边形的每个角的x和y坐标
                fill="lime"     //填充颜色
                fillOpacity={0.1}
                stroke="black"   //外边框颜色
                strokeWidth="3"   //外边框宽度
            />)
        )
        // 添加选择线
        console.log('添加--------选择线')
        this.temporary_svg_mat.push(
            (<Circle
                cx={new_graph_mat[this.point_choice_idx][0]}   //中心点x
                cy={new_graph_mat[this.point_choice_idx][1]}  //中心点y
                r="4"    //半径
                stroke="black"　　//外边框 颜色　　
                strokeWidth="0"  //外边框 宽度
                fill="red"   //填充颜色
            />)
        )
    }

    PointRotate = (fixed_point, rotate_point, rotate_angle) => {
        // 坐标点绕点旋转、顺时针、逆时针:顺时针添加负号
        // 固定点、旋转点、旋转角度
        // 顺时针
        let rotate_radian = rotate_angle / 180 * Math.PI
        let new_x0 = (rotate_point[0] - fixed_point[0]) * Math.cos(-rotate_radian) - (rotate_point[1] - fixed_point[1]) * Math.sin(-rotate_radian) + fixed_point[0]
        let new_y0 = (rotate_point[0] - fixed_point[0]) * Math.sin(-rotate_radian) + (rotate_point[1] - fixed_point[1]) * Math.cos(-rotate_radian) + fixed_point[1]
        return [new_x0, new_y0]
    }

    TouchPointRefresh = () => {
        // 触控点更新
        this.graph_svg_mat.push(
            (<Circle
                cx={this.line_start_x + gradding_strokeWidth / 2}   //中心点x
                cy={this.line_start_y + gradding_strokeWidth / 2}   //中心点y
                r="5"    //半径
                stroke="black"　　//外边框 颜色　　
                strokeWidth="1"  //外边框 宽度
                fill="red"   //填充颜色
            />)
        )
        console.log('绘图更新', this.graph_svg_mat.length, this.graph_svg_mat)
        // 计算网格点
        let gradding_loc_x = this.gradding_col_mat[Math.round((this.line_start_x - this.init_x) / this.gradding_pixels_num)][0]  // 应转换为坐标系下的坐标点，去读取对应数据
        let gradding_loc_y = this.gradding_row_mat[Math.round((this.init_y - this.line_start_y) / this.gradding_pixels_num)][1]
        console.log('---------', gradding_loc_x, gradding_loc_y)
        this.graph_svg_mat.push(
            (<Circle
                cx={gradding_loc_x + gradding_strokeWidth / 2}   //中心点x
                cy={gradding_loc_y + gradding_strokeWidth / 2}   //中心点y
                r="5"    //半径
                stroke="black"　　//外边框 颜色　　
                strokeWidth="0"  //外边框 宽度
                fill="black"   //填充颜色
            />)
        )
        // let graph_svg_mat = this.graph_svg_mat
        this.setState({
            // gradding_svg: this.gradding_svg_mat
            graph_svg: this.graph_svg_mat,
            // all_svg_mat: [this.gradding_svg_mat, this.graph_svg_mat]
        })
    }
    GraddingGenerator = () => {
        // 网格生成器
        console.log('网格生成器')
        this.StandardGradding()    //网格绘制
    }

    StandardGradding = () => {
        // 标准坐标系生成
        console.log('标准坐标系生成----修改样式、比例大小')
        let centre_gradding_width_num = 0
        let centre_gradding_height_num = 0
        // 计算长宽格子数量
        if (gradding_display_mode === 'upleft') {
            this.init_x = 0   // 坐标建立初始点
            this.init_y = 0   // 坐标建立初始点
            let gradding_width_num = parseInt(coordinate_width / this.gradding_pixels_num) + 1
            let gradding_height_num = parseInt(coordinate_height / this.gradding_pixels_num) + 1
            // 分别计算中心点位置：中心、左上角
            // -----计算左上角
            let gradding_row_locxy = [] // 行分解
            let gradding_col_locxy = [] // 列分解
            for (let idx = 0; idx < gradding_height_num; idx++) {
                gradding_row_locxy.push([0, this.gradding_pixels_num * idx])
            }
            for (let idx = 0; idx < gradding_width_num; idx++) {
                gradding_col_locxy.push([this.gradding_pixels_num * idx, 0])
            }
            this.gradding_row_mat = gradding_row_locxy
            this.gradding_col_mat = gradding_col_locxy
            // 绘制端点线网格
            this.gradding_svg_mat = []
            for (let idx = 0; idx < gradding_height_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_row_locxy[idx][0]}   //x轴的开始位置
                        y1={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                        x2={coordinate_width}  //x轴的结束位置
                        y2={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
            for (let idx = 0; idx < gradding_width_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                        y1={gradding_col_locxy[idx][1]}  //y轴的开始位置
                        x2={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}  //x轴的结束位置
                        y2={coordinate_height}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
        }
        else if (gradding_display_mode === 'centre') {
            // 网格展示---中心展示
            let init_x = coordinate_width / 2   // 中心点x
            let init_y = coordinate_height / 2  // 中心点y
            this.init_x = init_x  // 坐标建立初始点
            this.init_y = init_y   // 坐标建立初始点
            let gradding_width_num = parseInt(coordinate_width / 2 / this.gradding_pixels_num) * 2 + 1
            let gradding_height_num = parseInt(coordinate_height / 2 / this.gradding_pixels_num) * 2 + 1
            centre_gradding_width_num = parseInt(coordinate_width / 2 / this.gradding_pixels_num) + 1
            centre_gradding_height_num = parseInt(coordinate_height / 2 / this.gradding_pixels_num) + 1
            // 分别计算中心点位置：中心、左上角
            // -----计算左上角
            let gradding_row_locxy = [] // 行分解
            let gradding_col_locxy = [] // 行分解
            for (let idx = 0; idx < gradding_height_num; idx++) {
                gradding_row_locxy.push([0, this.gradding_pixels_num * (idx - parseInt(coordinate_height / 2 / this.gradding_pixels_num)) + init_y])
            }
            for (let idx = 0; idx < gradding_width_num; idx++) {
                gradding_col_locxy.push([this.gradding_pixels_num * (idx - parseInt(coordinate_width / 2 / this.gradding_pixels_num)) + init_x, 0])
            }
            // console.log('--------gradding_row_locxy', gradding_row_locxy.length)
            // console.log('--------gradding_col_locxy', gradding_col_locxy.length)
            this.gradding_row_mat = gradding_row_locxy
            this.gradding_col_mat = gradding_col_locxy
            // 绘制端点线网格
            this.gradding_svg_mat = []
            for (let idx = 0; idx < gradding_height_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_row_locxy[idx][0]}   //x轴的开始位置
                        y1={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                        x2={coordinate_width}  //x轴的结束位置
                        y2={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
            for (let idx = 0; idx < gradding_width_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                        y1={gradding_col_locxy[idx][1]}  //y轴的开始位置
                        x2={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}  //x轴的结束位置
                        y2={coordinate_height}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
        }
        else if (gradding_display_mode === 'downleft') {
            //  网格展示---左下原点---第一象限
            let init_x = 0    // 中心点x
            let init_y = coordinate_height  // 中心点y
            this.init_x = init_x  // 坐标建立初始点
            this.init_y = init_y   // 坐标建立初始点
            this.gradding_width_num = parseInt(coordinate_width / this.gradding_pixels_num) + 1  //  行列数分解
            this.gradding_height_num = parseInt(coordinate_height / this.gradding_pixels_num) + 1
            // 分别计算中心点位置：中心、左上角
            // -----计算左上角
            let gradding_row_locxy = [] // 行分解
            let gradding_col_locxy = [] // 行分解
            for (let idx = 0; idx < this.gradding_height_num; idx++) {
                gradding_row_locxy.push([0, init_y - this.gradding_pixels_num * (idx)])
            }
            for (let idx = 0; idx < this.gradding_width_num; idx++) {
                gradding_col_locxy.push([this.gradding_pixels_num * (idx) + init_x, 0])
            }
            // 行列分割点坐标
            this.gradding_row_mat = _.cloneDeep(gradding_row_locxy)
            this.gradding_col_mat = _.cloneDeep(gradding_col_locxy)
            // 绘制端点线网格
            this.gradding_svg_mat = []
            for (let idx = 0; idx < this.gradding_height_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_row_locxy[idx][0]}   //x轴的开始位置
                        y1={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                        x2={coordinate_width}  //x轴的结束位置
                        y2={gradding_row_locxy[idx][1] + gradding_strokeWidth / 2}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
            for (let idx = 0; idx < this.gradding_width_num; idx++) {
                this.gradding_svg_mat.push(
                    (<Line
                        x1={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                        y1={gradding_col_locxy[idx][1]}  //y轴的开始位置
                        x2={gradding_col_locxy[idx][0] + gradding_strokeWidth / 2}  //x轴的结束位置
                        y2={coordinate_height}   //y轴的结束位置
                        stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                    />)
                )
            }
        }
        this.gradding_svg_mat.push(
            (<Circle
                cx={this.init_x + gradding_strokeWidth / 2}   //中心点x
                cy={this.init_y + gradding_strokeWidth / 2}   //中心点y
                r="5"    //半径
                stroke="black"　　//外边框 颜色　　
                strokeWidth="0"  //外边框 宽度
                fill="red"   //填充颜色
            />)
        )
        // 任意图形在坐标系中绘制----平行四边形属性，建立各点坐标--转换坐标绘制
        this.setState({
            gradding_svg: this.gradding_svg_mat,
            // all_svg_mat: [this.gradding_svg_mat, this.graph_svg_mat]
        })
    }
    ChoiceGridRender = () => {
        // 选择网格渲染
        let grid_choice_svg_mat = []
        console.log('this.choice_grid_mat', this.choice_grid_mat)
        for (let idx = 0; idx < this.choice_grid_mat.length; idx++) {
            let x_idx = this.choice_grid_mat[idx][0]
            let y_idx = this.choice_grid_mat[idx][1]
            let point_a = [this.gradding_col_mat[x_idx][0] + gradding_strokeWidth / 2, this.gradding_row_mat[y_idx][1] + gradding_strokeWidth / 2]
            let point_b = [this.gradding_col_mat[x_idx + 1][0] + gradding_strokeWidth / 2, this.gradding_row_mat[y_idx][1] + gradding_strokeWidth / 2]
            let point_c = [this.gradding_col_mat[x_idx + 1][0] + gradding_strokeWidth / 2, this.gradding_row_mat[y_idx + 1][1] + gradding_strokeWidth / 2]
            let point_d = [this.gradding_col_mat[x_idx][0] + gradding_strokeWidth / 2, this.gradding_row_mat[y_idx + 1][1] + gradding_strokeWidth / 2]
            let polygon_mat = [point_a, point_b, point_c, point_d]
            grid_choice_svg_mat.push(
                (<Polygon
                    points={polygon_mat.join(' ')}  //多边形的每个角的x和y坐标
                    fill="red"     //填充颜色
                    stroke="black"   //外边框颜色
                    strokeWidth="2"   //外边框宽度
                />)
            )
        }
        return grid_choice_svg_mat
    }

    ParallelogramDraw = () => {
        // 平行四边形绘制---计算坐标点
        let coordinate_parallelogram_mat = []
        if (gradding_display_mode === 'downleft') {
            // 左下中心点一象限数据转换绘制
            this.gradding_width_num
            this.gradding_height_num
            // 平行四边形数据点
            coordinate_parallelogram_mat.push([parallelogram_start_x, parallelogram_start_y])
            coordinate_parallelogram_mat.push([parallelogram_start_x + parallelogram_base_num, parallelogram_start_y])
            coordinate_parallelogram_mat.push([parallelogram_start_x + parallelogram_base_num + parallelogram_cut_num, parallelogram_start_y + parallelogram_height_num])
            coordinate_parallelogram_mat.push([parallelogram_start_x + parallelogram_cut_num, parallelogram_start_y + parallelogram_height_num])
        }
        console.log('----平行四边形图形绘制', JSON.stringify(coordinate_parallelogram_mat))
        this.CoordinateGraphDraw(coordinate_parallelogram_mat)
    }

    CoordinateGraphDraw = (coordinate_mat) => {
        // 图形绘制---任意图形坐标----标准坐标系下
        // 转换坐标绘制
        let graph_svg_mat = []    // 图形绘制组
        let part_svg_mat = []
        for (let idx = 0; idx < coordinate_mat.length; idx++) {
            graph_svg_mat.push([
                this.gradding_col_mat[coordinate_mat[idx][0]][0] + gradding_strokeWidth / 2,
                this.gradding_row_mat[coordinate_mat[idx][1]][1] + gradding_strokeWidth / 2
            ])
        }
        // console.log('---------graph_svg_mat', graph_svg_mat)
        this.graph_data_mat.push(graph_svg_mat)   // 组件坐标
        this.graph_coordinate_mat.push(coordinate_mat)  // 坐标系坐标
        console.log('图形坐标组', this.graph_data_mat, this.graph_coordinate_mat)
        this.graph_svg_mat = []
        this.graph_svg_mat.push(
            (<Polygon
                points={graph_svg_mat.join(' ')}  //多边形的每个角的x和y坐标
                fill="lime"     //填充颜色
                fillOpacity={0.0}
                stroke="black"   //外边框颜色
                strokeWidth="3"   //外边框宽度
            />)
        )
        this.setState({
            graph_svg: this.graph_svg_mat,
            // all_svg_mat: [this.gradding_svg_mat, this.graph_svg_mat]
        })
    }

    AllCoordinateGraphDraw = (all_coordinate_mat) => {
        // 所有图形坐标系绘制 this.graph_data_mat
        this.graph_svg_mat = []
        this.graph_data_mat = []
        for (let idx = 0; idx < all_coordinate_mat.length; idx++) {
            this.SingleCoordinateGraphDraw(all_coordinate_mat[idx])
        }
        this.setState({
            graph_svg: this.graph_svg_mat,
            // all_svg_mat: [this.gradding_svg_mat, this.graph_svg_mat]
        })

    }

    SingleCoordinateGraphDraw = (single_coordinate_mat) => {
        // 单幅图像坐标系绘制
        let single_component_mat = this.CoordinateTransformComponent(single_coordinate_mat) // 坐标系转换组件图
        this.graph_data_mat.push(single_component_mat)
        if (single_component_mat.length >= 3) {
            // 封闭图形
            this.graph_svg_mat.push(
                (<Polygon
                    points={single_component_mat.join(' ')}  //多边形的每个角的x和y坐标
                    fill="lime"     //填充颜色
                    fillOpacity={0.0}
                    stroke="black"   //外边框颜色
                    strokeWidth="3"   //外边框宽度
                />)
            )
        }
        else if (single_component_mat.length === 2) {
            // 绘制线
            // console.log('---------两点', JSON.stringify(single_component_mat))
            this.graph_svg_mat.push(
                (<Line
                    x1={single_component_mat[0][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                    y1={single_component_mat[0][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                    x2={single_component_mat[1][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                    y2={single_component_mat[1][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                    stroke="black"  //填充颜色
                    strokeWidth={3}  //填充宽度
                    // strokeWidth={gradding_strokeWidth}  //填充宽度
                    // strokeOpacity={stroke_opacity}
                />)
            )
        }
        else if (single_component_mat.length === 1) {
            this.graph_svg_mat.push(
                (<Circle
                    cx={single_component_mat[0][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                    cy={single_component_mat[0][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                    // stroke="red"  //填充颜色
                    strokeWidth={gradding_strokeWidth}  //填充宽度
                    strokeOpacity={stroke_opacity}
                    r="3"    //半径
                    // stroke="black"　　//外边框 颜色　　
                    // strokeWidth="0"  //外边框 宽度
                    fill="black"   //填充颜色
                />)
            )
        }
    }

    SvgGraphDraw = () => {
        // 自由图形绘制---svg坐标系下

    }

    GridPoint = () => {
        // 格点展示
        if (gradding_display_mode === 'downleft') {
            //  网格展示---左下原点---第一象限
            let init_x = 0    // 中心点x
            let init_y = coordinate_height  // 中心点y
            this.init_x = init_x  // 坐标建立初始点
            this.init_y = init_y   // 坐标建立初始点
            this.gradding_width_num = parseInt(coordinate_width / this.gradding_pixels_num) + 1  //  行列数分解
            this.gradding_height_num = parseInt(coordinate_height / this.gradding_pixels_num) + 1
            // 分别计算中心点位置：中心、左上角
            // -----计算左上角
            let gradding_row_locxy = [] // 行分解
            let gradding_col_locxy = [] // 行分解
            for (let idx = 0; idx < this.gradding_height_num; idx++) {
                gradding_row_locxy.push([0, init_y - this.gradding_pixels_num * (idx)])
            }
            for (let idx = 0; idx < this.gradding_width_num; idx++) {
                gradding_col_locxy.push([this.gradding_pixels_num * (idx) + init_x, 0])
            }
            // 行列分割点坐标
            this.gradding_row_mat = _.cloneDeep(gradding_row_locxy)
            this.gradding_col_mat = _.cloneDeep(gradding_col_locxy)
            // 绘制端点线网格
            this.gradding_svg_mat = []
            for (let row_idx = 0; row_idx < this.gradding_height_num; row_idx++) {
                for (let col_idx = 0; col_idx < this.gradding_width_num; col_idx++) {
                    this.gradding_svg_mat.push(
                        (<Circle
                            cx={gradding_col_locxy[col_idx][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                            cy={gradding_row_locxy[row_idx][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                            // stroke="red"  //填充颜色
                            strokeWidth={gradding_strokeWidth}  //填充宽度
                            strokeOpacity={stroke_opacity}
                            r="2"    //半径
                            // stroke="black"　　//外边框 颜色　　
                            // strokeWidth="0"  //外边框 宽度
                            fill="red"   //填充颜色
                        />)
                    )
                }
            }
        }
        this.gradding_svg_mat.push(
            (<Circle
                cx={this.init_x + gradding_strokeWidth / 2}   //中心点x
                cy={this.init_y + gradding_strokeWidth / 2}   //中心点y
                r="5"    //半径
                stroke="black"　　//外边框 颜色　　
                strokeWidth="0"  //外边框 宽度
                fill="red"   //填充颜色
            />)
        )
        // 任意图形在坐标系中绘制----平行四边形属性，建立各点坐标--转换坐标绘制
        this.setState({
            gradding_svg: this.gradding_svg_mat,
            // all_svg_mat: [this.gradding_svg_mat, this.graph_svg_mat]
        })
    }

    GraddingZoomOut = () => {
        // 缩小
        this.gradding_pixels_num -= 10
        this.gradding_pixels_num = this.gradding_pixels_num < min_pixels_num ? min_pixels_num : this.gradding_pixels_num
        this.StandardGradding()
        this.ParallelogramDraw()    //图形绘制

    }

    GraddingZoomIn = () => {
        // 放大
        this.gradding_pixels_num += 10
        this.gradding_pixels_num = this.gradding_pixels_num > max_pixels_num ? max_pixels_num : this.gradding_pixels_num
        this.StandardGradding()
        this.ParallelogramDraw()    //图形绘制

    }

    JudgePointInAreaIdx = (touch_point, all_graph_mat) => {
        // 判定点在区域内索引
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            // 判定所有图形
            let [[up_mat, down_mat, left_mat, right_mat], judge_flag] = this.JudgePointInArea(touch_point, all_graph_mat[idx])

            // console.log('------touch_point\n', JSON.stringify(touch_point), JSON.stringify(all_graph_mat[idx]))
            // console.log('------up_mat, down_mat, left_mat, right_mat, judge_flag\n', JSON.stringify([up_mat, down_mat, left_mat, right_mat]), judge_flag)
            if (judge_flag === 1) {
                return idx    // 返回选择索引
            }
        }
        return -1
    }

    JudgeTouchGraphIdx = (touch_point, all_graph_mat) => {
        // 判定图形选择索引
        console.log('all_graph_mat', all_graph_mat)
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            // 判定所有图形
            // console.log('图形选择-------', all_graph_mat[idx])
            if (all_graph_mat[idx].length > 2) {  // 封闭图形
                let [[up_mat, down_mat, left_mat, right_mat], judge_flag] = this.JudgePointInArea(touch_point, all_graph_mat[idx])
                // console.log('------touch_point\n', JSON.stringify(touch_point), JSON.stringify(all_graph_mat[idx]))
                // console.log('------up_mat, down_mat, left_mat, right_mat, judge_flag\n', JSON.stringify([up_mat, down_mat, left_mat, right_mat]), judge_flag)
                if (judge_flag === 1) {
                    return [idx]    // 返回选择索引
                }
            }
            else if (all_graph_mat[idx].length === 2) {
                // 判定线
                let distance = this.JudgePointInLineLoc(touch_point, [all_graph_mat[idx][0], all_graph_mat[idx][1]])
                if (distance < 10) {
                    return [idx]
                }
            }
        }
        return -1
    }

    JudgePointInArea = (point_mat, area_mat) => {
        // 判定点在区域中
        let up_mat = []     // 上组坐标点
        let down_mat = []   // 下组坐标点
        let left_mat = []   // 左组坐标点
        let right_mat = []  // 右组坐标点
        let judge_flag = 1  // 有效区域判定
        for (let idx = 0; idx < area_mat.length; idx++) {
            // 区域点判定---x方向、y方向
            let start_point = []
            let end_point = []
            if (idx === area_mat.length - 1) {
                // 最后一组
                start_point = area_mat[idx]
                end_point = area_mat[0]

            } else {
                //
                start_point = area_mat[idx]
                end_point = area_mat[idx + 1]
            }
            // 上下组判定
            // 左右组判定
            // 重新计算，---线条交点，横向，纵向
            let up_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [[point_mat[0], -100], point_mat])  // 上方交点
            let down_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [point_mat, [point_mat[0], 5000]])  // 下方交点
            let left_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [[-100, point_mat[1]], point_mat])  // 左方交点
            let right_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [point_mat, [5000, point_mat[1]]])  // 右方交点
            // console.log('-----------up_judge',up_judge)
            // console.log('-----------down_judge',down_judge)
            // console.log('-----------left_judge',left_judge)
            // console.log('-----------right_judge',right_judge)
            if (up_judge.length === 3) {
                // 线上内交点
                up_mat.push([start_point, end_point])
            }
            if (down_judge.length === 3) {
                // 线上内交点
                down_mat.push([start_point, end_point])
            }
            if (left_judge.length === 3) {
                // 线上内交点
                left_mat.push([start_point, end_point])
            }
            if (right_judge.length === 3) {
                // 线上内交点
                right_mat.push([start_point, end_point])
            }

        }
        // 区域有效判定
        // console.log('==========', up_mat, down_mat, left_mat, right_mat)
        if (up_mat.length % 2 == 0 || down_mat.length % 2 == 0 || left_mat.length % 2 == 0 || right_mat.length % 2 == 0) {
            judge_flag = 0
        }
        return [[up_mat, down_mat, left_mat, right_mat], judge_flag]
    }

    JudgePointExist = (init_data, [start_point, end_point]) => {
        // 判定存在初始数组中
        if (init_data.length < 1) { // 初始数组为空
            return true
        }
        else {
            for (let idx = 0; idx < init_data.length; idx++) {
                // 存在的一组数据
                let [init_a_point, init_b_point] = init_data[idx]
                // 两点中存在一组点数据相同不添加
                if ((init_a_point[0] === start_point[0] && init_a_point[1] === start_point[1]) ||
                    (init_b_point[0] === end_point[0] && init_b_point[1] === end_point[1]) ||
                    (init_a_point[0] === end_point[0] && init_a_point[1] === end_point[1]) ||
                    (init_b_point[0] === start_point[0] && init_b_point[1] === start_point[1])) {
                    return false
                }
            }
        }
        return true
    }

    RefreshAllGraphSvg = (all_graph_mat, choice_idx) => {
        // 渲染所有图形
        let all_svg_mat = []
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            if (all_graph_mat[idx].length >= 3) {
                all_svg_mat.push(
                    (<Polygon
                        points={all_graph_mat[idx].join(' ')}  //多边形的每个角的x和y坐标
                        fill={idx === choice_idx ? "transparent" : "transparent"}     //填充颜色
                        fillOpacity={0.1}
                        stroke={idx === choice_idx ? "black" : "black"}   //外边框颜色
                        strokeWidth="3"   //外边框宽度
                    />)
                )
            }
            else if (all_graph_mat[idx].length === 2) {
                // console.log('---------两点', JSON.stringify(all_graph_mat[idx]))
                all_svg_mat.push(
                    (<Line
                        x1={all_graph_mat[idx][0][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                        y1={all_graph_mat[idx][0][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                        x2={all_graph_mat[idx][1][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                        y2={all_graph_mat[idx][1][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                        stroke={idx === choice_idx ? "black" : "black"}   //填充颜色
                        strokeWidth={3}  //填充宽度
                        // strokeWidth={gradding_strokeWidth}  //填充宽度
                        // strokeOpacity={stroke_opacity}
                    />)
                )
            }
            else if (all_graph_mat[idx].length === 1) {
                all_svg_mat.push(
                    (<Circle
                        cx={all_graph_mat[idx][0][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                        cy={all_graph_mat[idx][0][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                        // stroke="red"  //填充颜色
                        strokeWidth={gradding_strokeWidth}  //填充宽度
                        strokeOpacity={stroke_opacity}
                        r="3"    //半径
                        // stroke="black"　　//外边框 颜色　　
                        // strokeWidth="0"  //外边框 宽度
                        fill={idx === choice_idx ? "black" : "black"}    //填充颜色
                    />)
                )
            }
        }
        return all_svg_mat
    }
    JudgePointInLine = (point_mat, area_mat) => {
        // 判定点在选择线条
        let all_graph_min_distance = []
        let all_graph_min_idx = []
        for (let idx = 0; idx < area_mat.length; idx++) {
            // 单组图像
            let part_graph_distance = []
            for (let p_idx = 0; p_idx < area_mat[idx].length; p_idx++) {
                let distance = this.JudgePointInLineLoc(point_mat, [area_mat[idx][p_idx], area_mat[idx][(p_idx + 1) % area_mat[idx].length]])
                part_graph_distance.push(distance)
            }
            console.log('--------part_graph_distance', part_graph_distance)
            let [center_sort, index_sort] = this.ArraySortMat(part_graph_distance)
            console.log('-------排序及索引', center_sort, index_sort)
            all_graph_min_distance.push(center_sort[0])
            all_graph_min_idx.push(index_sort[0])
        }
        // 全部图像最小距离排序
        let [all_center_sort, all_index_sort] = this.ArraySortMat(all_graph_min_distance)
        console.log('========全局图像最小排序', all_center_sort, all_index_sort)
        if (all_center_sort[0] < 10) {
            // 取最小阈值
            return [all_index_sort[0], all_graph_min_idx[all_index_sort[0]]]  // 第几幅图中的第几条线
        }
        else {
            return [-1, -1]
        }
    }
    JudgePointInLineLoc = (point_mat, line_mat) => {
        // 判定点到直线的距离和线内交点
        // console.log('---------计算点', point_mat, line_mat)
        let symmetry_point = newgraphcls.PointSymmetry(point_mat, line_mat)  // 对称点
        // console.log('对称点', point_mat, symmetry_point)
        let intersection_mat = [(point_mat[0] + symmetry_point[0]) / 2, (point_mat[1] + symmetry_point[1]) / 2]
        // console.log('----交点', intersection_mat)
        // 线内交点判定
        let in_out_judge = newgraphcls.JudgeLineIntersectionLoc([point_mat, symmetry_point], line_mat)  // 上方交点
        // console.log('线内--线外---交点判定', in_out_judge)
        let distance = Math.sqrt(
            (point_mat[0] - intersection_mat[0]) * (point_mat[0] - intersection_mat[0]) +
            (point_mat[1] - intersection_mat[1]) * (point_mat[1] - intersection_mat[1]))
        // console.log('============点到直线距离-----', distance)
        if (in_out_judge.length === 3) {
            // 有效线内交点
            return distance
        }
        else {
            return 1000
        }
    }

    JudgePointInPoint = (point_mat, area_mat) => {
        // 判定触摸点与图像端点选择情况
        let all_graph_min_distance = []
        let all_graph_min_idx = []
        for (let idx = 0; idx < area_mat.length; idx++) {
            // 单组图像
            let part_graph_distance = []
            for (let p_idx = 0; p_idx < area_mat[idx].length; p_idx++) {
                let distance = Math.round(Math.sqrt((point_mat[0] - area_mat[idx][p_idx][0]) * (point_mat[0] - area_mat[idx][p_idx][0]) +
                    (point_mat[1] - area_mat[idx][p_idx][1]) * (point_mat[1] - area_mat[idx][p_idx][1])) * 10) / 10
                part_graph_distance.push(distance)
            }
            console.log('点对点--------part_graph_distance', part_graph_distance)
            let [center_sort, index_sort] = this.ArraySortMat(part_graph_distance)
            console.log('点对点-------排序及索引', center_sort, index_sort)
            all_graph_min_distance.push(center_sort[0])
            all_graph_min_idx.push(index_sort[0])
        }
        // 全部图像最小距离排序
        let [all_center_sort, all_index_sort] = this.ArraySortMat(all_graph_min_distance)
        console.log('点对点========全局图像最小排序', all_center_sort, all_index_sort)
        if (all_center_sort[0] < 10) {
            // 取最小阈值
            return [all_index_sort[0], all_graph_min_idx[all_index_sort[0]]]  // 第几幅图中的第几条线
        }
        else {
            return [-1, -1]
        }

    }

    /**
     *
     * @param {*} point_mat
     */
    JudgeGridChoice = (point_mat) => {
        // 格子选择判定---触摸点
        // 横向----纵向---依次判定
        let row_choice_idx = -1
        let col_choice_idx = -1
        // 横向
        for (let idx = 0; idx < this.gradding_col_mat.length; idx++) {
            if (idx < this.gradding_col_mat.length - 1) {
                // console.log('========', point_mat, this.gradding_col_mat[idx])
                if (point_mat[0] < this.gradding_col_mat[idx + 1][0] && point_mat[0] >= this.gradding_col_mat[idx][0]) {
                    col_choice_idx = idx
                }
            }
            else {
                if (point_mat[0] >= this.gradding_col_mat[idx - 1][0]) {
                    col_choice_idx = idx - 1
                }
            }
        }
        // 纵向
        for (let idx = 0; idx < this.gradding_row_mat.length; idx++) {
            if (idx < this.gradding_row_mat.length - 1) {
                console.log('==========', point_mat[1], this.gradding_row_mat[idx])
                if (point_mat[1] > (this.gradding_row_mat[idx + 1][1]) && point_mat[1] <= (this.gradding_row_mat[idx][1])) {
                    row_choice_idx = idx
                }
            }
            else {
                if (point_mat[1] <= (this.gradding_row_mat[idx - 1][1])) {
                    row_choice_idx = idx - 1
                }
            }
        }
        return [col_choice_idx, row_choice_idx]
    }

    ArraySortMat = (combine_center) => {
        // 排序及索引
        // let combine_center = [1,3,2,7,3,3]
        let combine_center2 = _.cloneDeep(combine_center)
        let center_sort = combine_center2.sort(function (x, y) { return x - y; })
        // console.log(['中心坐标x排序', center_sort])
        let index_sort = []
        for (let sort_ii = 0; sort_ii < center_sort.length; sort_ii++) {
            //	console.log([combine_center, center_sort[sort_ii]])
            for (let sort_jj = 0; sort_jj < combine_center.length; sort_jj++) {
                // console.log(typeof(sort_jj), combine_center[sort_jj])
                if (index_sort.indexOf(sort_jj) >= 0) {
                    continue
                }
                else {
                    if (center_sort[sort_ii] == combine_center[sort_jj]) {
                        index_sort.push(sort_jj)
                    }
                }
            }
        }
        // console.log('索引', index_sort, typeof(index_sort[0]))
        // 返回小大排序及对应索引，相同坐标情况下，根据初始书写顺序计算序号索引
        return [center_sort, index_sort]
    }

    CoordinateTransformComponent = (coordinate_mat) => {
        // 坐标系图像与组件屏幕坐标转换---单幅图像坐标转换
        let component_mat = []
        for (let idx = 0; idx < coordinate_mat.length; idx++) {
            // 单点换算
            let component_x = this.init_x + coordinate_mat[idx][0] * this.gradding_pixels_num + gradding_strokeWidth / 2 * 0  // 圆心坐标+坐标系坐标*单位像素长度
            let component_y = this.init_y - coordinate_mat[idx][1] * this.gradding_pixels_num + gradding_strokeWidth / 2 * 0   // 圆心坐标+坐标系坐标*单位像素长度---左下圆心---四象限分布
            component_mat.push([component_x, component_y])
        }
        // console.log('坐标转换----coordinate_mat----component_mat', JSON.stringify(coordinate_mat), JSON.stringify(component_mat))
        return component_mat

    }

    ComponentTransformCoordinate = (component_mat) => {
        // 组件坐标转换坐标系坐标---控制精度：0---0.1---0.01---0.001
        // 单幅图像坐标转换
        let coordinate_mat = []
        for (let idx = 0; idx < component_mat.length; idx++) {
            // 单点换算
            let coordinate_x = Math.round((component_mat[idx][0] - this.init_x) / this.gradding_pixels_num * 10) / 10   // 精度0.1
            let coordinate_y = Math.round((this.init_y - component_mat[idx][1]) / this.gradding_pixels_num * 10) / 10
            coordinate_mat.push([coordinate_x, coordinate_y])
        }
        // console.log('坐标转换----component_mat----coordinate_mat', JSON.stringify(component_mat), JSON.stringify(coordinate_mat))
        return coordinate_mat
    }

    AllCoordinateTransformComponent = (all_coordinate_mat) => {
        // 全组转换
        let all_component_mat = []
        for (let idx = 0; idx < all_coordinate_mat.length; idx++) {
            let part_component_mat = this.CoordinateTransformComponent(all_coordinate_mat[idx])
            all_component_mat.push(part_component_mat)
        }
        return all_component_mat;
    }

    AllComponentTransformCoordinate = (all_component_mat) => {
        // 全组转换
        let all_coordinate_mat = []
        for (let idx = 0; idx < all_component_mat.length; idx++) {
            let part_coordinate_mat = this.CoordinateTransformComponent(all_component_mat[idx])
            all_coordinate_mat.push(part_coordinate_mat)
        }
        return all_coordinate_mat;
    }

    EndpointAdsorptionCalculate = (all_line_data, choice_idx, temporary_data) => {
        // 端点吸附计算
        let choice_data = temporary_data // 移动线段
        let distance_threshold = 5
        for (let idx = 0; idx < all_line_data.length; idx++) {
            // 遍历所有线条端点
            if (idx !== choice_idx) {
                let contrast_data = all_line_data[idx] // 对比数据
                // 比较四个点
                if (this.TwoPointDistance(choice_data[0], contrast_data[0]) < distance_threshold) {
                    return [idx, 0, 0]
                }
                else if (this.TwoPointDistance(choice_data[0], contrast_data[1]) < distance_threshold) {
                    return [idx, 0, 1]
                }
                else if (this.TwoPointDistance(choice_data[1], contrast_data[0]) < distance_threshold) {
                    return [idx, 1, 0]
                }
                else if (this.TwoPointDistance(choice_data[1], contrast_data[1]) < distance_threshold) {
                    return [idx, 1, 1]
                }
            }
        }
        return [-1, -1, -1]
    }

    TwoPointDistance = (point_a, poit_b) => {
        // 两点距离
        let distance = Math.sqrt((point_a[0] - poit_b[0]) * (point_a[0] - poit_b[0]) + (point_a[1] - poit_b[1]) * (point_a[1] - poit_b[1]))
        return distance
    }

    JudgeCombineLine = (all_line_data) => {
        // 遍历所有直线组合情况
        let distance_threshold = 5
        let combine_line_idx = []
        for (let idx1 = 0; idx1 < all_line_data.length - 1; idx1++) {
            for (let idx2 = idx1 + 1; idx2 < all_line_data.length; idx2++) {
                //
                // console.log('遍历比较-------idx1, idx2', idx1, idx2)
                if (this.TwoPointDistance(all_line_data[idx1][0], all_line_data[idx2][0]) < distance_threshold ||
                    this.TwoPointDistance(all_line_data[idx1][0], all_line_data[idx2][1]) < distance_threshold ||
                    this.TwoPointDistance(all_line_data[idx1][1], all_line_data[idx2][0]) < distance_threshold ||
                    this.TwoPointDistance(all_line_data[idx1][1], all_line_data[idx2][1]) < distance_threshold) {
                    // 两条直线有端点接近
                    // console.log('存在接近组',)
                    if (combine_line_idx.length < 1) {
                        combine_line_idx.push([idx1, idx2])
                    }
                    else {
                        // 遍历已存在的组合---判定是否新增
                        let new_flag = 1
                        for (let idx = 0; idx < combine_line_idx.length; idx++) {
                            if (combine_line_idx[idx].indexOf(idx1) >= 0) {
                                new_flag = 0
                                if (combine_line_idx[idx].indexOf(idx2) < 0) {
                                    // 不存在---添加
                                    combine_line_idx[idx].push(idx2)
                                    break
                                }
                            }
                            if (combine_line_idx[idx].indexOf(idx2) >= 0) {
                                new_flag = 0
                                if (combine_line_idx[idx].indexOf(idx1) < 0) {
                                    // 不存在---添加
                                    combine_line_idx[idx].push(idx1)
                                    break
                                }
                            }
                        }
                        if (new_flag === 1) {
                            combine_line_idx.push([idx1, idx2])
                        }
                    }
                }
            }
        }
        console.log('组合组', combine_line_idx)
        return combine_line_idx
    }
    JudgeClosedGraph = (all_graph_mat, combine_idx) => {
        // 判定封闭图形all_graph_mat:所有线条数据，combine_idx:组合索引
        let closed_graph = []
        let closed_idx = []
        let distance_threshold = 5
        for (let num_idx = 0; num_idx < combine_idx.length; num_idx++) {
            if (closed_graph.length < 1) {
                closed_graph.push(all_graph_mat[combine_idx[0]])  // 第一次默认添加
                closed_idx.push(combine_idx[0])
            }
            else {
                for (let idx = 0; idx < combine_idx.length; idx++) {
                    if (closed_idx.indexOf(combine_idx[idx]) < 0) {
                        // 未使用索引---
                        let contrast_mat = all_graph_mat[combine_idx[idx]]
                        let end_point = closed_graph[closed_graph.length - 1][1]  // 最后一条线的最后一个点数据
                        console.log('封闭图形判定', JSON.stringify(contrast_mat), JSON.stringify(end_point))
                        if (this.TwoPointDistance(end_point, contrast_mat[0]) < distance_threshold) {
                            closed_graph.push([contrast_mat[0], contrast_mat[1]])
                            closed_idx.push(combine_idx[idx])
                            break
                        }
                        else if (this.TwoPointDistance(end_point, contrast_mat[1]) < distance_threshold) {
                            closed_graph.push([contrast_mat[1], contrast_mat[0]])
                            closed_idx.push(combine_idx[idx])
                            break
                        }
                    }
                }
            }
        }
        console.log('封闭组合数据', JSON.stringify(closed_graph), JSON.stringify(closed_idx))
        if (closed_idx.length === combine_idx.length) {
            // 组合长度相同
            if (this.TwoPointDistance(closed_graph[0][0], closed_graph[closed_graph.length - 1][1]) < distance_threshold) {
                // 第一条线的第一个点与最后一条线的最后一个点相同
                return closed_graph
            }
            return []
        }
        return []
    }
    DrawGraphSvg = (all_line_data) => {
        // 绘制图像
        let all_line_svg = []
        for (let idx = 0; idx < all_line_data.length; idx++) {
            // 绘制线条
            all_line_svg.push(
                (<Line
                    x1={all_line_data[idx][0][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                    y1={all_line_data[idx][0][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                    x2={all_line_data[idx][1][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                    y2={all_line_data[idx][1][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                    stroke={this.TwoPointDistance(all_line_data[idx][0], all_line_data[idx][1]) > 50 ? "lime" : "red"}  //填充颜色
                    strokeWidth={3}  //填充宽度
                    // strokeWidth={gradding_strokeWidth}  //填充宽度
                    // strokeOpacity={stroke_opacity}
                />)
            )
            all_line_svg.push(<Circle
                cx={all_line_data[idx][0][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                cy={all_line_data[idx][0][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                // stroke="red"  //填充颜色
                strokeWidth={gradding_strokeWidth}  //填充宽度
                strokeOpacity={stroke_opacity}
                r="3"    //半径
                // stroke="black"　　//外边框 颜色　　
                // strokeWidth="0"  //外边框 宽度
                fill="red"   //填充颜色
            />)
            all_line_svg.push(<Circle
                cx={all_line_data[idx][1][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                cy={all_line_data[idx][1][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                // stroke="red"  //填充颜色
                strokeWidth={gradding_strokeWidth}  //填充宽度
                strokeOpacity={stroke_opacity}
                r="3"    //半径
                // stroke="black"　　//外边框 颜色　　
                // strokeWidth="0"  //外边框 宽度
                fill="red"   //填充颜色
            />)
        }
        return all_line_svg
    }

    AllSequentialPoints = (all_points_mat) => {
        // 所有序列点组
        let all_svg_mat = []
        for (let idx = 0; idx < all_points_mat.lengthl; idx++) {
            // 所有绘制
            let part_svg_mat = this.DrawSequentialPoints(all_points_mat[idx])
            all_svg_mat.push(part_svg_mat)
        }
        return all_svg_mat
    }

    DrawSequentialPoints = (single_points_mat) => {
        // 单组连续点图形绘制
        let single_svg_mat = []
        if (single_points_mat.length > 0) {
            for (let idx = 1; idx < single_points_mat.length; idx++) {
                single_svg_mat.push(
                    (<Line
                        x1={single_points_mat[idx - 1][0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                        y1={single_points_mat[idx - 1][1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                        x2={single_points_mat[idx][0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                        y2={single_points_mat[idx][1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                        // stroke={this.TwoPointDistance(all_line_data[idx][0], all_line_data[idx][1]) > 50 ? "lime" : "red"}  //填充颜色
                        stroke="lime"  //填充颜色
                        strokeWidth={3}  //填充宽度
                    />)
                )
            }
            for (let idx = 0; idx < single_points_mat.length; idx++) {
                single_svg_mat.push(
                    <Circle
                        cx={single_points_mat[idx][0] + gradding_strokeWidth / 2}   //x轴的开始位置
                        cy={single_points_mat[idx][1] + gradding_strokeWidth / 2}  //y轴的开始位置
                        // stroke="red"  //填充颜色
                        // strokeWidth={gradding_strokeWidth}  //填充宽度
                        // strokeOpacity={stroke_opacity}
                        r="5"    //半径
                        fill="red"   //填充颜色
                    />)
            }
        }
        return single_svg_mat
    }

    DrawTemporaryLine = (point_a, point_b) => {
        // 单线临时绘制
        let temporary_svg_mat = []
        temporary_svg_mat.push(
            (<Line
                x1={point_a[0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                y1={point_a[1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                x2={point_b[0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                y2={point_b[1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                stroke="red"  //填充颜色
                strokeWidth={3}  //填充宽度
                // strokeWidth={gradding_strokeWidth}  //填充宽度
                // strokeOpacity={stroke_opacity}
            />)
        )

        return temporary_svg_mat
    }
    DrawTemporaryLineDash = (point_a, point_b, dash_mat) => {
        // 单线临时绘制---虚线
        let temporary_svg_mat = []
        temporary_svg_mat.push(
            (<Line
                x1={point_a[0] + gradding_strokeWidth / 2 * 1}   // x轴的开始位置
                y1={point_a[1] + gradding_strokeWidth / 2 * 1}   // y轴的开始位置
                x2={point_b[0] + gradding_strokeWidth / 2 * 1}   // x轴的结束位置
                y2={point_b[1] + gradding_strokeWidth / 2 * 1}   // y轴的结束位置
                stroke="red"  //填充颜色
                strokeWidth={3}  //填充宽度
                // strokeWidth={gradding_strokeWidth}  //填充宽度
                // strokeOpacity={stroke_opacity}
                strokeDasharray={dash_mat}
            />)
        )

        return temporary_svg_mat
    }

    TwoLineVertical = (line_a, line_b, vertical_length) => {
        //  两条直线的相交直角求解
        // let intersect_mat = newgraphcls.JudgeLineIntersectionLoc(line_a, line_b)
        let intersect_mat = [1, line_a[1][0], line_a[1][1]]
        // console.log('相交情况', intersect_mat)
        let new_abc = newgraphcls.Line_ABC(line_a[0], line_a[1])
        let old_abc = newgraphcls.Line_ABC(line_b[0], line_b[1])
        // console.log('两条直线的线参数', new_abc, old_abc)
        if (intersect_mat.length == 3) {
            // 有交点
            // 判定直角情况
            // console.log('两条直线的线参数', new_abc, old_abc)
            let new_mod = Math.sqrt(new_abc[0] * new_abc[0] + new_abc[1] * new_abc[1])
            let old_mod = Math.sqrt(old_abc[0] * old_abc[0] + old_abc[1] * old_abc[1])
            let new_old_dot = (-new_abc[0]) * (-old_abc[0]) + new_abc[1] * old_abc[1]     // 添加负号只是保证向量的方向
            let intersec_cos = new_old_dot / (new_mod * old_mod)
            // console.log('相交夹角情况', new_mod, old_mod, new_old_dot, intersec_cos)
            if (Math.abs(intersec_cos) < 0.03) {
                // 近似垂直---画垂线符号
                // console.log('画垂线')
                // 在较长方向获得点---比较两点距离
                let [vertical_x1, vertical_y1] = newgraphcls.CalculateLongVerticalPoint(line_a, intersect_mat, vertical_length)
                let [vertical_x2, vertical_y2] = newgraphcls.CalculateLongVerticalPoint(line_b, intersect_mat, vertical_length)
                console.log('垂线标识交起点', vertical_x1, vertical_y1, vertical_x2, vertical_y2)
                // 绘制垂线标识符号
                // 求解拐点---正方形终点
                let center_x = (vertical_x1 + vertical_x2) / 2
                let center_y = (vertical_y1 + vertical_y2) / 2
                let inflect_x = center_x + (center_x - intersect_mat[1])
                let inflect_y = center_y + (center_y - intersect_mat[2])
                let vertical_mat = [[vertical_x1, vertical_y1], [inflect_x, inflect_y], [vertical_x2, vertical_y2]]
                return vertical_mat
            }
        }
        return []
    }

    CalculateHighLine = (cut_line_mat, graph_line_mat, vertical_length) => {
        // 求解画线与单条线的垂直情况
        // for (let idx = 0; idx < draw_line_mat.length; idx++) {
        let intersect_mat = newgraphcls.JudgeLineIntersectionLoc(cut_line_mat, graph_line_mat)
        console.log('相交情况', intersect_mat)
        let new_abc = newgraphcls.Line_ABC(cut_line_mat[0], cut_line_mat[1])
        let old_abc = newgraphcls.Line_ABC(graph_line_mat[0], graph_line_mat[1])
        // console.log('两条直线的线参数', new_abc, old_abc)
        if (intersect_mat.length == 3) {
            // 有交点---返回
            // point_svg.push(<Circle
            //   cx={intersect_mat[1]}   //中心点x
            //   cy={intersect_mat[2]}   //中心点y
            //   r="4"    //半径
            //   stroke="black"　　//外边框 颜色　　
            //   strokeWidth="1.5"  //外边框 宽度
            //   fill="red"   //填充颜色
            // />)
            // this.setState({
            //   point_mat_svg: point_svg,
            // })
            // 计算交点和每个顶点的位置----不用
            // for (let p_idx = 0; p_idx < all_point_mat.length; p_idx++) {
            //   // 遍历两点间距
            //   let div_x = all_point_mat[p_idx][0] - intersect_mat[1]
            //   let div_y = all_point_mat[p_idx][1] - intersect_mat[2]
            //   let dis_p = Math.sqrt(div_x * div_x + div_y * div_y)
            //   if (dis_p < 10) {
            //     intersect_num += 1
            //     // console.log('找到近点====p_idx', p_idx)
            //     if (intersect_num <= 100) {
            //       // 跟新起始点或绘制点
            //       this.setState({
            //         line_start_x: all_point_mat[p_idx][0],
            //         line_start_y: all_point_mat[p_idx][1],
            //       })
            //     }
            //     else {
            //       this.setState({
            //         line_end_x: all_point_mat[p_idx][0],
            //         line_end_y: all_point_mat[p_idx][1],
            //       })
            //     }
            //     cut_line_mat = [[this.state.line_start_x, this.state.line_start_y], [this.state.line_end_x, this.state.line_end_y]]
            //   }
            // }
            // 判定直角情况
            // console.log('两条直线的线参数', new_abc, old_abc)
            let new_mod = Math.sqrt(new_abc[0] * new_abc[0] + new_abc[1] * new_abc[1])
            let old_mod = Math.sqrt(old_abc[0] * old_abc[0] + old_abc[1] * old_abc[1])
            let new_old_dot = (-new_abc[0]) * (-old_abc[0]) + new_abc[1] * old_abc[1]     // 添加负号只是保证向量的方向
            let intersec_cos = new_old_dot / (new_mod * old_mod)
            // console.log('相交夹角情况', new_mod, old_mod, new_old_dot, intersec_cos)
            if (Math.abs(intersec_cos) < 0.03) {
                // 近似垂直---画垂线符号
                // console.log('画垂线')
                // 在较长方向获得点---比较两点距离
                let new_distance_1 = newgraphcls.TwoPointDistance(cut_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let new_distance_2 = newgraphcls.TwoPointDistance(cut_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                let vertical_x1 = 0
                let vertical_y1 = 0
                if (new_distance_1 >= new_distance_2) {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------前---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[0], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------后---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[1], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                let old_distance_1 = newgraphcls.TwoPointDistance(graph_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let old_distance_2 = newgraphcls.TwoPointDistance(graph_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                // console.log('距离-----', new_distance_1, new_distance_2, old_distance_1, old_distance_2)
                let vertical_x2 = 0
                let vertical_y2 = 0
                if (old_distance_1 >= old_distance_2) {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[0], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[1], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                // console.log('垂线标识交起点', vertical_x1,vertical_y1,vertical_x2,vertical_y2)
                // 绘制垂线标识符号
                // 求解拐点---正方形终点
                let center_x = (vertical_x1 + vertical_x2) / 2
                let center_y = (vertical_y1 + vertical_y2) / 2
                let inflect_x = center_x + (center_x - intersect_mat[1])
                let inflect_y = center_y + (center_y - intersect_mat[2])
                // let ployline_str = vertical_x1 + ',' + vertical_y1 + ' ' + inflect_x + ',' + inflect_y + ' ' + vertical_x2 + ',' + vertical_y2
                let ployline_mat = [[vertical_x1, vertical_y1], [inflect_x, inflect_y], [vertical_x2, vertical_y2]]
                return [intersect_mat, ployline_mat]

                // vertical_svg.push(
                //   <Polyline
                //     points={ployline_str}  //多段线的各个点
                //     fill="none"   //填充颜色 无
                //     stroke="red" //边框色
                //     strokeWidth="3" //边框宽度
                //   />
                // )
            }
            return [intersect_mat, []]
        }
        // }
        return [[], []]
    }

    AllCalculateHighLine = (cut_line_mat, graph_all_line_mat, choice_point_idx, vertical_length) => {
        // 单幅图像，任意端点选择绘制高
        for (let idx = 0; idx < graph_all_line_mat.length; idx++) {

            if (idx !== choice_point_idx && (idx + 1) % graph_all_line_mat.length != choice_point_idx) {
                console.log('-------合适点',)
                let [intersect_mat, ployline_mat] = this.CalculateHighLine(cut_line_mat, [graph_all_line_mat[idx], graph_all_line_mat[(idx + 1) % graph_all_line_mat.length]], vertical_length)
                if (intersect_mat.length === 3) {
                    return [intersect_mat, ployline_mat]
                }
            }
        }
        return [[], []]
    }

    CalculateHighLine2 = (cut_line_mat, graph_line_mat, vertical_length) => {
        // 求解画线与单条线的垂直情况----包含延长线垂直情况
        // for (let idx = 0; idx < draw_line_mat.length; idx++) {
        let intersect_mat = newgraphcls.JudgeLineIntersectionLoc2(cut_line_mat, graph_line_mat)
        console.log('相交情况2---包含延长线', intersect_mat)
        let new_abc = newgraphcls.Line_ABC(cut_line_mat[0], cut_line_mat[1])
        let old_abc = newgraphcls.Line_ABC(graph_line_mat[0], graph_line_mat[1])
        // console.log('两条直线的线参数', new_abc, old_abc)
        if (intersect_mat.length == 3 && intersect_mat[0] === 0) {
            // 有交点---返回
            // 判定直角情况
            // console.log('两条直线的线参数', new_abc, old_abc)
            let new_mod = Math.sqrt(new_abc[0] * new_abc[0] + new_abc[1] * new_abc[1])
            let old_mod = Math.sqrt(old_abc[0] * old_abc[0] + old_abc[1] * old_abc[1])
            let new_old_dot = (-new_abc[0]) * (-old_abc[0]) + new_abc[1] * old_abc[1]     // 添加负号只是保证向量的方向
            let intersec_cos = new_old_dot / (new_mod * old_mod)
            // console.log('相交夹角情况', new_mod, old_mod, new_old_dot, intersec_cos)
            if (Math.abs(intersec_cos) < 0.03) {
                // 近似垂直---画垂线符号
                // console.log('画垂线')
                // 在较长方向获得点---比较两点距离
                let new_distance_1 = newgraphcls.TwoPointDistance(cut_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let new_distance_2 = newgraphcls.TwoPointDistance(cut_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                let vertical_x1 = 0
                let vertical_y1 = 0
                if (new_distance_1 >= new_distance_2) {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------前---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[0], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------后---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[1], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                let old_distance_1 = newgraphcls.TwoPointDistance(graph_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let old_distance_2 = newgraphcls.TwoPointDistance(graph_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                // console.log('距离-----', new_distance_1, new_distance_2, old_distance_1, old_distance_2)
                let vertical_x2 = 0
                let vertical_y2 = 0
                if (old_distance_1 >= old_distance_2) {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[0], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[1], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                // console.log('垂线标识交起点', vertical_x1,vertical_y1,vertical_x2,vertical_y2)
                // 绘制垂线标识符号
                // 求解拐点---正方形终点
                let center_x = (vertical_x1 + vertical_x2) / 2
                let center_y = (vertical_y1 + vertical_y2) / 2
                let inflect_x = center_x + (center_x - intersect_mat[1])
                let inflect_y = center_y + (center_y - intersect_mat[2])
                // let ployline_str = vertical_x1 + ',' + vertical_y1 + ' ' + inflect_x + ',' + inflect_y + ' ' + vertical_x2 + ',' + vertical_y2
                let ployline_mat = [[vertical_x1, vertical_y1], [inflect_x, inflect_y], [vertical_x2, vertical_y2]]
                return [intersect_mat, ployline_mat]

                // vertical_svg.push(
                //   <Polyline
                //     points={ployline_str}  //多段线的各个点
                //     fill="none"   //填充颜色 无
                //     stroke="red" //边框色
                //     strokeWidth="3" //边框宽度
                //   />
                // )
            }
            return [intersect_mat, []]
        }
        else if (intersect_mat.length == 3 && intersect_mat[0] === 100) {
            // 有交点---返回---线外交点
            // 判定直角情况
            // console.log('两条直线的线参数', new_abc, old_abc)
            let new_mod = Math.sqrt(new_abc[0] * new_abc[0] + new_abc[1] * new_abc[1])
            let old_mod = Math.sqrt(old_abc[0] * old_abc[0] + old_abc[1] * old_abc[1])
            let new_old_dot = (-new_abc[0]) * (-old_abc[0]) + new_abc[1] * old_abc[1]     // 添加负号只是保证向量的方向
            let intersec_cos = new_old_dot / (new_mod * old_mod)
            // console.log('相交夹角情况', new_mod, old_mod, new_old_dot, intersec_cos)
            if (Math.abs(intersec_cos) < 0.03) {
                // 近似垂直---画垂线符号
                // console.log('画垂线')
                // 在较长方向获得点---比较两点距离
                let new_distance_1 = newgraphcls.TwoPointDistance(cut_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let new_distance_2 = newgraphcls.TwoPointDistance(cut_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                let vertical_x1 = 0
                let vertical_y1 = 0
                if (new_distance_1 >= new_distance_2) {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------前---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[0], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    // console.log('--------------后---------')
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], cut_line_mat[1], vertical_length)
                    vertical_x1 = part_vertical_mat[0]
                    vertical_y1 = part_vertical_mat[1]
                }
                let old_distance_1 = newgraphcls.TwoPointDistance(graph_line_mat[0], [intersect_mat[1], intersect_mat[2]])
                let old_distance_2 = newgraphcls.TwoPointDistance(graph_line_mat[1], [intersect_mat[1], intersect_mat[2]])
                // console.log('距离-----', new_distance_1, new_distance_2, old_distance_1, old_distance_2)
                let vertical_x2 = 0
                let vertical_y2 = 0
                if (old_distance_1 >= old_distance_2) {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[0], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                else {
                    // 在起点到交点位置找便宜点
                    let part_vertical_mat = newgraphcls.GetLengthLoc([intersect_mat[1], intersect_mat[2]], graph_line_mat[1], vertical_length)
                    vertical_x2 = part_vertical_mat[0]
                    vertical_y2 = part_vertical_mat[1]
                }
                // console.log('垂线标识交起点', vertical_x1,vertical_y1,vertical_x2,vertical_y2)
                // 绘制垂线标识符号
                // 求解拐点---正方形终点
                let center_x = (vertical_x1 + vertical_x2) / 2
                let center_y = (vertical_y1 + vertical_y2) / 2
                let inflect_x = center_x + (center_x - intersect_mat[1])
                let inflect_y = center_y + (center_y - intersect_mat[2])
                // let ployline_str = vertical_x1 + ',' + vertical_y1 + ' ' + inflect_x + ',' + inflect_y + ' ' + vertical_x2 + ',' + vertical_y2
                let ployline_mat = [[vertical_x1, vertical_y1], [inflect_x, inflect_y], [vertical_x2, vertical_y2]]
                return [intersect_mat, ployline_mat]   // 辅助延长线标志
            }
            return [intersect_mat, []]   // 辅助延长线标志
        }
        // }
        return [[], []]
    }

    AllCalculateHighLine2 = (cut_line_mat, graph_all_line_mat, choice_point_idx, vertical_length) => {
        // 单幅图像，任意端点选择绘制高----添加虚线求解
        // 新增---添加所有有效交点---建立筛选决策：直角优先、内交点优先
        let all_line_intersect_mat = []
        for (let idx = 0; idx < graph_all_line_mat.length; idx++) {
            if (idx !== choice_point_idx && (idx + 1) % graph_all_line_mat.length != choice_point_idx) {
                // console.log('-------合适点')
                let [intersect_mat, ployline_mat] = this.CalculateHighLine2(cut_line_mat, [graph_all_line_mat[idx], graph_all_line_mat[(idx + 1) % graph_all_line_mat.length]], vertical_length)
                // intersect_mat[0]===0 内交点、 intersect_mat[0]===100 外交点
                console.log('---交点情况-', JSON.stringify([intersect_mat, ployline_mat]), idx)
                if (intersect_mat.length === 3 && ployline_mat.length > 0) {
                    // 有交点且为直角情况直接返回
                    console.log('交点有直角', intersect_mat, ployline_mat, idx)
                    return [intersect_mat, ployline_mat, idx]   // 新增---交线索引
                }
                else if (intersect_mat.length === 3 && intersect_mat[0] === 0) {
                    // 保存查看内交点
                    console.log('内交点', intersect_mat, ployline_mat, idx)
                    // return [intersect_mat, ployline_mat, idx]   // 新增---交线索引
                    all_line_intersect_mat.push([intersect_mat, ployline_mat, idx])
                }
            }
        }
        console.log('所有交点情况二次判定', JSON.stringify(all_line_intersect_mat))
        for (let idx=0;idx<all_line_intersect_mat.length;idx++){
            if (all_line_intersect_mat[idx][0].length === 3 && all_line_intersect_mat[idx][0][0] === 0){
                return all_line_intersect_mat[idx]
            }
        }
        return [[], [], []]
    }

    render() {
        // console.log('-------绘制渲染gradding_svg', this.state.gradding_svg.length)
        // console.log('-------绘制渲染', this.state.graph_svg.length)
        // let test_point_mat = [5, 5]  // 交点测试
        // let test_line_mat = [[0, 0], [4, 7]]
        // this.JudgePointInLineLoc(test_point_mat, test_line_mat)
        return (
            <View style={{ flexDirection: 'column' }}>
                {/*<TestVector />*/}
                <View style={{ height: 50, flexDirection: 'row', marginLeft: 100 }}>
                    <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
                                      onPress={() => this.GraddingGenerator()} >
                        <Text style={{ fontSize: 30 }}>网格</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
                                      onPress={() => this.GridPoint()} >
                        <Text style={{ fontSize: 30 }}>网点</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
                                      onPress={() => this.GraddingZoomIn()} >
                        <Text style={{ fontSize: 30 }}>放大</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
                                      onPress={() => this.GraddingZoomOut()} >
                        <Text style={{ fontSize: 30 }}>缩小</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 50, marginTop: 10 }}>
                    <View style={{ width: coordinate_width + gradding_strokeWidth, height: coordinate_height + gradding_strokeWidth, backgroundColor: 'wheat' }}
                          {...this._panResponderDrawLine.panHandlers}
                    >
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.gradding_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.graph_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.drag_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.grid_choice_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.adsorb_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.closed_graph_svg
                            }
                        </Svg>
                        <Svg style={{
                            width: coordinate_width + gradding_strokeWidth,
                            height: coordinate_height + gradding_strokeWidth,
                            backgroundColor: 'transparent',
                            top: 0,
                            left: 0,
                            position: 'absolute'
                        }} >
                            {
                                this.state.draw_graph_svg
                            }
                        </Svg>
                    </View>
                </View>
            </View>

        );
    }
}

export default SvgDrawTest;
const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        width: 100,
        height: 60,
        borderRadius: 10
    },
    btn1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        width: 180,
        height: 50,
        borderRadius: 10,
        marginTop: 5
    },
    touch: {
        backgroundColor: 'lime',
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 10
    },
})
