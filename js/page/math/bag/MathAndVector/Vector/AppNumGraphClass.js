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
import _ from 'lodash'
// var _ = require('lodash')
import { GriddingClass, BaseProcessClass } from "./GraphAndNumAlgorithm.js"
import { DrawSvgClass } from "./GraphAndNumSVG"

import AntDesign from 'react-native-vector-icons/AntDesign'; // smileo

let newgraphcls = new MathGraphClass()
let coordinate_height = 600
let coordinate_width = 800
// let gridding_pixels_num = 50 // 格子像素点对应数量
let gridding_strokeWidth = 2
// 建立图形坐标数据组----直接给出图形坐标点位、通过属性定义生成坐标点；统一渲染
let all_graph_coordinate_mat = []
// all_graph_coordinate_mat.push([[10, 2], [12, 4]])
// all_graph_coordinate_mat.push([[8, 5.5], [4, 5.5]])
// all_graph_coordinate_mat.push([[9, 8], [7, 6]])
// all_graph_coordinate_mat.push([[2, 7], [6, 7]])

// all_graph_coordinate_mat.push([[6, 3], [3, 3]])
// all_graph_coordinate_mat.push([[5, 8], [8, 8]])
// all_graph_coordinate_mat.push([[5, 4], [6, 6]])
// all_graph_coordinate_mat.push([[8, 5], [9, 7]])
// 图像切割
// all_graph_coordinate_mat.push([[3, 5], [5, 3], [8, 5], [9, 8], [6, 7]])
// 边吸收
// all_graph_coordinate_mat.push([[3, 5], [6, 5], [6, 8], [4, 8]])
// all_graph_coordinate_mat.push([[7, 5], [9, 5], [10, 8], [7, 8]])
// all_graph_coordinate_mat.push([[7, 1], [9, 1], [10, 4]])
// 切割边吸附
all_graph_coordinate_mat.push([[3, 4], [10, 4], [11, 7], [4, 7]])
// all_graph_coordinate_mat.push([[3, 8], [10, 6], [7, 8], [12, 10], [5, 11]])

// 类调用数据
let per_pixels = 40
let gridding_cls = new GriddingClass(coordinate_width, coordinate_height, 30, coordinate_height - 30, per_pixels)
let svg_cls = new DrawSvgClass(coordinate_width, coordinate_height)
let bpc_cls = new BaseProcessClass(per_pixels)
// svg_cls.DrawGriddingSvg(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [gridding_cls.origin_x, gridding_cls.origin_y])
// // svg_cls.DrawGridPointSvg(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [gridding_cls.origin_x, gridding_cls.origin_y])
// console.log(Number(347.33000000000004))
// let all_graph_img_mat = gridding_cls.AllGraphCoordinateToImg(all_graph_coordinate_mat)
// let all_graph_img_svg = svg_cls.DrawAllGraph(all_graph_img_mat)
// let all_graph_coordinate_mat2 = gridding_cls.AllGraphImgToCoordinate(all_graph_img_mat)
// let all_graph_img_mat2 = gridding_cls.AllGraphCoordinateToImg(all_graph_coordinate_mat2)
// let all_graph_img_svg2 = svg_cls.DrawAllGraph(all_graph_img_mat2)
// let test_point = [321.33, 347.33]
// let init_graph_mat = [[[138, 410], [298, 422], [370, 310], [210, 310]]]
// bpc_cls.JudgePointInArea(test_point, init_graph_mat[0])
// 点在区域内判定----JudgePointInPolygon()
// let pnpoly_mat = [[0, 0], [8, 0], [8, 8], [6, 8], [7, 3], [3, 3], [4, 10], [0, 10]]
// let test_p = [3.5, 9.5]
// bpc_cls.JudgePointInPolygon(pnpoly_mat, test_p)
// 向量夹角
// let vector_a = [-1, 1]
// let vector_b = [1, 0]
// console.log('方向夹角1', bpc_cls.VectorialAngleDirector(vector_a, vector_b))
// console.log('方向夹角2', bpc_cls.VectorialAngleDirector(vector_b, vector_a))
// let line_a_mat = [[0, 0], [-10, -10]]
// let line_b_mat = [[0, 0], [10, 9.9]]
// bpc_cls.JudgeParallelLine(line_b_mat, line_a_mat)
// all_graph_coordinate_mat.push([[2, 4], [10, 4]])
// all_graph_coordinate_mat.push([[10, 7], [4, 7]])
// all_graph_coordinate_mat.push([[10, 10], [3, 3]])
// all_graph_coordinate_mat.push([[10, 2], [4, 9]])
// 角度
// let vector_a0 = [69.65474927999998, 81.26387414999999]
// let vector_b0 = [-9.466129840000008, -11.04381816]
// bpc_cls.VectorialAngleDirector(vector_a0, vector_b0)
// 图形盘底
let judge_graph_data = [[0, 0], [5, 0], [3, 3]]
console.log('图形判定', bpc_cls.JudgeGraphType(judge_graph_data))
console.log('eval(0.25)', Number('0.25'))
console.log('eval(S+0.25)', Number('S0.25'))
console.log('eval(0.25)', Number(0.25), ('0.25').toString())
console.log(('等边三角形').indexOf('三角形'))
class SvgDrawTest extends Component {
  constructor(props) {
    super(props);
    this.allPoint = ''
    // 圆盘旋转
    this.circle_ring_x = 150
    this.circle_ring_y = 150
    this.circle_ring_r = 100

    this.gridding_pixels_num = 50  //初始格子一格像素点数
    this.graph_choice_idx = -1    // 图选择
    this.line_choice_idx = -1     // 线选择
    this.point_choice_idx = -1   // 点选择
    this.gridding_mode = ''     // 网格展示模式
    this.gridding_size = 1      // 展示比例
    this.gridding_point_mat = []  // 网格点生成
    this.gridding_svg_mat = []
    this.init_x = 0   // 坐标建立初始点
    this.init_y = 0   // 坐标建立初始点
    this.gridding_row_mat = []
    this.gridding_col_mat = []
    this.graph_svg_mat = []   // 图形绘制
    this.touch_svg_mat = []   // 触摸响应绘制
    this.drag_svg_mat = []
    this.graph_data_mat = []        // 组件屏幕坐标                            
    this.graph_coordinate_mat = []  // 坐标系下坐标
    this.temporary_svg_mat = []   // 临时图形
    this.temporary_data_mat = []   // 临时图形坐标
    this.all_graph_svg_mat = []    // 全图像渲染
    this.func_mode = 'auxiliary_high2'
    // graph_move:图形移动、line_move:线条移动、point_move:点移动、
    // grid_choice:格子选择、combine_line:组合线条、combine_graph:组合图像、all_move:线和封闭图形的移动
    // draw_graph:画线、multi_line：连续线、"auxiliary_high":辅助做高、"auxiliary_high2":辅助做高2---外延辅助线
    // cut_graph:图形切割、side_absorb:边吸附、cut_absorb:切割边吸附 、find_parallel: 寻找平行线
    // shear_line:剪切线、draw_line_text:绘制直线长度、grid_absorb:吸附网格点;single_grid_absorb:单格点
    // graph_text: 图形文本, line_move2:面积变化线移动

    this.choice_grid_mat = [] // 网格选择
    this.grid_x_idx = -1    // 网格选择索引
    this.grid_y_idx = -1
    this.adsorb_svg = []  // 吸附
    this.closed_graph_svg = []  // 封闭图像
    // 绘图数据
    this.draw_graph_data = []     // 线条数据
    this.draw_graph_svg = []      // 绘图数据
    this.part_squential_mat = []  // 单组连续点数组
    this.init_split_mat = [[]]    // 上一次切割数据
    this.temporary_data = []
    this.shear_idx = -1
    this.shear_mat = []
    this.shear_intersection = []
    this.sing_grid_mat = []
    // 滑动条设置
    this.slider_height = 40   // 滑块条高度
    this.slider_width = 400   // 滑块条宽度---总长
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
    // 圆盘
    this.line_start_x3 = -1
    this.line_start_y3 = -1
    this.line_end_x3 = -1
    this.line_end_x3 = -1
    this.last_angle = 0
    this.clockwise_flag = 0  // 0为顺、1为逆
    // 上下滑块移动设计
    this.up_down_width = 400  // 宽度---刻度条
    this.up_num = 4           // 上组份数
    this.down_num = 3         // 下组份数
    this.sign_width = 40    // 指示宽度
    this.sign_height = 60   // 指示高度
    this.per_width = this.up_down_width / (this.up_num + this.down_num) // 每份数宽度
    this.init_cx = this.per_width * this.up_num   // 初始位置--刻度0位
    this.start_sx = this.per_width * this.up_num  // 起始x
    this.end_sx = this.per_width * this.up_num    // 终点x
    this.sign_cx = this.per_width * this.up_num + this.sign_width * 0.5
    this.view_width = this.up_down_width + this.sign_width

    this.state = {
      // drawPath: 'M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25'
      drawPath: '',
      line_start_x: -10,
      line_start_y: -10,
      line_end_x: -100,
      line_end_y: -100,
      split_mat_svg: [],        //分离数组组合svg
      gridding_svg: [],    // 网格显示
      graph_svg: [],       // 图形绘制
      touch_svg_mat: [],
      all_svg_mat: [],
      drag_svg: [],             // 拖拽图形
      grid_choice_svg: [],      // 网格选择
      adsorb_svg: [],           // 吸附展示
      closed_graph_svg: [],     // 封闭图像
      draw_graph_svg: [],        //绘图
      touch_point_svg: [],         // 触控点
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
      // 圆盘
      cy: this.circle_ring_y - this.circle_ring_r,
      cx: this.circle_ring_x,    // 圆中心坐标
      cr: 12,                 // 圆半径
      cCorlor: 'white',       // 圆颜色
      rotate_text: '顺时针旋转',
      angele_text: '0°',
      rotate_svg_mat: [],     // 旋转环
      sign_cx: this.sign_cx,  // 符号中心
      upTxt: '0',         // 上
      downTxt: '0',       // 下
      move_responder_flag: 'auto'
    }
    this.tick_mark_svg = this.TickMark(this.up_num, this.down_num, this.up_down_width, 50)
  }
  componentWillMount() {
    // 初始化渲染
    // 引用类计算


    svg_cls.DrawGriddingSvg(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [gridding_cls.origin_x, gridding_cls.origin_y])
    // svg_cls.DrawGridPointSvg(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [gridding_cls.origin_x, gridding_cls.origin_y])

    let all_graph_img_mat = gridding_cls.AllGraphCoordinateToImg(all_graph_coordinate_mat)
    let all_graph_img_svg = svg_cls.DrawAllGraph(all_graph_img_mat)

    this.graph_data_mat = _.cloneDeep(all_graph_img_mat)
    this.all_graph_svg_mat = _.cloneDeep(all_graph_img_svg)
    // 绘制文本
    let draw_text_svg = []
    let graph_text_mat = bpc_cls.getAllGraphLocText(this.graph_data_mat)
    for (let idx = 0; idx < graph_text_mat.length; idx++) {
      for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
        console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
        draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'black')) // 文本
      }
    }
    this.setState({
      gridding_svg: svg_cls.gridding_svg_mat,
      graph_svg: all_graph_img_svg,    // 图形渲染
      draw_graph_svg: [draw_text_svg]
    })
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
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.line_start_x = Math.round(tempfirstX * 100) / 100
        this.line_start_y = Math.round(tempFirstY * 100) / 100
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100     // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100
        if (this.func_mode === 'graph_move') {
          // 图形移动----选择图形渲染
          // 触控初始点选择索引
          [this.graph_choice_idx] = bpc_cls.JudgeTouchGraphIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('图形选择索引', this.graph_choice_idx)
          console.log('图形选择索引坐标', JSON.stringify([this.line_start_x, this.line_start_y]), JSON.stringify(this.graph_data_mat))
          let touch_point_svg = [
            svg_cls.DeconstructionDrawPointSvg({ point_mat: [this.line_start_x, this.line_start_y], fill_color: 'red' })]
          this.setState({
            touch_point_svg: touch_point_svg,
          })
        }
        if (this.func_mode === 'auxiliary_high2') {
          // 图形做高线----添加外延虚线
          [this.graph_choice_idx, this.point_choice_idx] = bpc_cls.JudgePointInPoint([this.line_start_x, this.line_start_y], this.graph_data_mat)
          if (this.graph_choice_idx >= 0) {
            // 有效选择图形端点
            this.line_start_x = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][0]
            this.line_start_y = this.graph_data_mat[this.graph_choice_idx][this.point_choice_idx][1]
          }
          console.log('图形端点', this.graph_choice_idx, this.point_choice_idx, this.line_start_x, this.line_start_y)
          let touch_point_svg = [
            svg_cls.DeconstructionDrawPointSvg({ point_mat: [this.line_start_x, this.line_start_y], fill_color: 'red' })]
          this.setState({
            touch_point_svg: touch_point_svg,
          })
        }
        if (this.func_mode === 'cut_absorb') {
          // 判定触摸点在图形内、还是外--------区分分割还是移动
          let choice_data = bpc_cls.JudgeTouchGraphIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('分割图形选择---------1', choice_data, JSON.stringify([this.line_start_x, this.line_start_y]), JSON.stringify(this.graph_data_mat))
          let choice_polygon = bpc_cls.JudgeTouchPolygonIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('分割图形选择---------2', choice_polygon, JSON.stringify([this.line_start_x, this.line_start_y]), JSON.stringify(this.graph_data_mat))
          this.graph_choice_idx = choice_polygon[0]
        }
        if (this.func_mode === 'find_parallel') {
          // 寻找平行线

        }
        if (this.func_mode === 'grid_absorb') {
          //网格点吸附---单次绘制一条直线
          [this.line_start_x, this.line_start_y] = bpc_cls.getGridAdsorptionIdx(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [this.line_start_x, this.line_start_y], 0.5)
        }
        if (this.func_mode === 'single_grid_absorb') {
          //网格点吸附---单次绘制一条直线
          this.sing_grid_mat = []
          let [line_start_x, line_start_y, absorb_flag] = bpc_cls.getGridAdsorptionIdx(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [this.line_start_x, this.line_start_y], 0.5)
          this.line_start_x = _.cloneDeep(line_start_x)
          this.line_start_y = _.cloneDeep(line_start_y)
          this.sing_grid_mat.push([line_start_x, line_start_y])
        }
        if (this.func_mode === 'combine_line') {
          // 组合线条
          let choice_data = bpc_cls.JudgeTouchGraphIdx([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('---------choice_data', choice_data)
          this.graph_choice_idx = choice_data[0]
        }
        if (this.func_mode === 'graph_text') {
          // 图形线条文本移动
          let choice_data = bpc_cls.JudgePointInLine([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('---------choice_data', choice_data)
          this.graph_choice_idx = choice_data[0]
          this.line_choice_idx = choice_data[1]
        }
        if (this.func_mode === 'line_move' || this.func_mode === 'line_move2') {
          // 平行四边形线条移动，保证周长不变
          let choice_data = bpc_cls.JudgePointInLine([this.line_start_x, this.line_start_y], this.graph_data_mat)
          console.log('移动线条周长不变---------choice_data', choice_data)
          this.graph_choice_idx = choice_data[0]
          this.line_choice_idx = choice_data[1]
        }

      },


      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        console.log('越界判定手指移动接触====111111111', evt.nativeEvent)
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        this.line_end_x = Math.round(pointX * 100) / 100
        this.line_end_y = Math.round(pointY * 100) / 100

        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.line_end_x = page_x - this.div_page_x // 页面定义
        this.line_end_y = page_y - this.div_page_y
        // console.log('越界判定this.line_end_x', this.line_end_x, this.line_end_y)
        if ((this.line_end_x < 20 || this.line_end_x > coordinate_width || this.line_end_y < 20 || this.line_end_y > coordinate_height)) {
          console.log('越界判定', this.line_end_x, this.line_end_y)
          this.setState({
            move_responder_flag: 'none'
          })
        }
        else {
          if (this.func_mode === 'graph_move' && this.graph_choice_idx >= 0) {
            // 图形移动
            // 移动量
            let move_dx = this.line_end_x - this.line_start_x
            let move_dy = this.line_end_y - this.line_start_y
            let move_data = bpc_cls.DataMove2D(this.graph_data_mat[this.graph_choice_idx], [move_dx, move_dy])
            console.log('移动前this.graph_data_mat[this.graph_choice_idx]', JSON.stringify(this.graph_data_mat[this.graph_choice_idx]))
            console.log('移动后move_data', JSON.stringify(move_data))
            let move_svg = svg_cls.DeconstructionDrawPolygonSvg({ polygon_mat: move_data, fill_color: 'red', stroke_color: 'black' })
            console.log('移动图形组', JSON.stringify(move_svg))
            this.all_graph_svg_mat[this.graph_choice_idx] = _.cloneDeep(move_svg)
            this.temporary_data = _.cloneDeep(move_data)
            let touch_point_svg = svg_cls.DeconstructionDrawPointSvg({ point_mat: [this.line_end_x, this.line_end_y], fill_color: 'lime' })
            this.setState({
              touch_point_svg: touch_point_svg,
              graph_svg: this.all_graph_svg_mat,    // 图形渲染         
            })
          }
          if (this.func_mode === 'auxiliary_high2' && this.graph_choice_idx >= 0) {
            // 做辅助线
            let cut_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]
            let temp_line_svg = svg_cls.DrawLineSvg(cut_line_mat[0], cut_line_mat[1], 'red', 3, [10, 5])//绘制单线
            let [intersect_mat, ployline_mat, line_idx] = bpc_cls.AllCalculateHighLine2(cut_line_mat, this.graph_data_mat[this.graph_choice_idx], this.point_choice_idx, 15)

            let intersect_svg_mat = []
            if (intersect_mat.length === 3 && intersect_mat[0] === 0) {
              // 绘制交点---实交点
              intersect_svg_mat.push(svg_cls.DrawPointSvg([intersect_mat[1], intersect_mat[2]], 5, 'red'))
              temp_line_svg = svg_cls.DrawLineSvg([this.line_start_x, this.line_start_y], [intersect_mat[1], intersect_mat[2]], 'red', 3, [10, 5])
              if (ployline_mat.length === 3) {
                intersect_svg_mat = []
                // 垂线修正---自动吸附
                let line_data = [
                  this.graph_data_mat[this.graph_choice_idx][(line_idx) % this.graph_data_mat[this.graph_choice_idx].length],
                  this.graph_data_mat[this.graph_choice_idx][(line_idx + 1) % this.graph_data_mat[this.graph_choice_idx].length]
                ]
                // 待做垂线---线段
                let touch_point_data = [this.line_start_x, this.line_start_y] //待做垂线点
                let vertical_intersction_mat = bpc_cls.getPointToLineVerticalPoint(line_data, touch_point_data) // 固定垂点
                let [intersect_mat2, ployline_mat2] = bpc_cls.CalculateHighLine2([[this.line_start_x, this.line_start_y], vertical_intersction_mat], line_data, 15) // 重新计算垂直符号
                temp_line_svg = svg_cls.DrawLineSvg([this.line_start_x, this.line_start_y], vertical_intersction_mat, 'red', 3, [10, 5])
                // 绘制直线符号
                // 绘制交点---实交点
                intersect_svg_mat.push(svg_cls.DrawPointSvg(vertical_intersction_mat, 5, 'red'))
                intersect_svg_mat.push(svg_cls.DrawPolylineSvg(ployline_mat2, 'red'))
              }
            }
            else if (intersect_mat.length === 3 && intersect_mat[0] === 100) {
              // 绘制交点----辅助延长线
              let point_extended_mat = bpc_cls.CalculateNearestPoint([intersect_mat[1], intersect_mat[2]],
                this.graph_data_mat[this.graph_choice_idx][(line_idx) % this.graph_data_mat[this.graph_choice_idx].length],
                this.graph_data_mat[this.graph_choice_idx][(line_idx + 1) % this.graph_data_mat[this.graph_choice_idx].length]) // 相交线两点
              let end_point_mat = bpc_cls.CalculateVirtualVerticalIntersection(cut_line_mat[0], cut_line_mat[1], point_extended_mat, [intersect_mat[1], intersect_mat[2]])
              if (end_point_mat.length > 0) {
                intersect_svg_mat.push(svg_cls.DrawPointSvg([intersect_mat[1], intersect_mat[2]], 5, 'red'))
                intersect_svg_mat.push(svg_cls.DrawLineSvg(point_extended_mat, end_point_mat, "red", 3, [10, 5]))
                temp_line_svg = svg_cls.DrawLineSvg(cut_line_mat[0], [intersect_mat[1], intersect_mat[2]], 'red', 3, [10, 5])
                if (ployline_mat.length === 3) {
                  intersect_svg_mat = []
                  // 垂线修正---自动吸附
                  let line_data = [
                    this.graph_data_mat[this.graph_choice_idx][(line_idx) % this.graph_data_mat[this.graph_choice_idx].length],
                    this.graph_data_mat[this.graph_choice_idx][(line_idx + 1) % this.graph_data_mat[this.graph_choice_idx].length]
                  ]
                  // 待做垂线---线段
                  let touch_point_data = [this.line_start_x, this.line_start_y] //待做垂线点
                  let vertical_intersction_mat = bpc_cls.getPointToLineVerticalPoint(line_data, touch_point_data) // 固定垂点
                  let [intersect_mat2, ployline_mat2] = bpc_cls.CalculateHighLine2([[this.line_start_x, this.line_start_y], vertical_intersction_mat], line_data, 15) // 重新计算垂直符号
                  temp_line_svg = svg_cls.DrawLineSvg([this.line_start_x, this.line_start_y], vertical_intersction_mat, 'red', 3, [10, 5])
                  // 绘制直线符号
                  // 绘制交点---实交点
                  intersect_svg_mat.push(svg_cls.DrawPointSvg(vertical_intersction_mat, 5, 'red'))
                  intersect_svg_mat.push(svg_cls.DrawPolylineSvg(ployline_mat2, 'red'))
                  intersect_svg_mat.push(svg_cls.DrawLineSvg(point_extended_mat, end_point_mat, "red", 3, [10, 5]))
                }
              }
            }
            this.setState({
              draw_graph_svg: [temp_line_svg, intersect_svg_mat]
            })
          }
          if (this.func_mode === 'cut_absorb') {
            // 图形切割吸附
            console.log('图像选择', this.graph_choice_idx)
            if (this.graph_choice_idx < 0) {
              // 切割图形
              // console.log('切割线绘制')
              let cut_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]     // 切割线
              // let [new_loc_mat, splite_loc_mat] = newgraphcls.AllGraphSplitProcess(this.graph_data_mat, cut_line_mat, this.init_split_mat)
              // console.log('----------切割数据cut_line_mat', JSON.stringify(cut_line_mat))
              // console.log('----------切割数据new_loc_mat', JSON.stringify(new_loc_mat),)
              // console.log('----------切割数据splite_loc_mat', JSON.stringify(splite_loc_mat))
              let cut_line_svg = svg_cls.DeconstructionDrawLineSvg({ point_a_mat: cut_line_mat[0], point_b_mat: cut_line_mat[1], stroke_color: 'red' })
              // 切割线渲染计算垂直符号----多个---实交点
              console.log('计算切割', this.graph_data_mat)
              let all_right_angle = bpc_cls.CalculateAllGraphHeight(this.graph_data_mat, cut_line_mat, 15)
              console.log('all_right_angle', all_right_angle)
              // 直角渲染
              let right_angle_svg_mat = svg_cls.DrawAllPolylineGraph(all_right_angle, 'red') // 直角渲染
              this.setState({
                draw_graph_svg: [cut_line_svg, right_angle_svg_mat]
              })
            }
            else {
              // 移动组合
              let move_dx = this.line_end_x - this.line_start_x
              let move_dy = this.line_end_y - this.line_start_y
              // 绘制临时图形
              this.temp_move_data = []
              this.temp_move_data = bpc_cls.DataMove2D(this.graph_data_mat[this.graph_choice_idx], [move_dx, move_dy])
              // this.temporary_svg_mat = svg_cls.DrawAllGraph([tem_move_dat], 0)
              // this.graph_data_mat[this.graph_choice_idx]=this.temporary_data_mat
              this.all_graph_svg_mat[this.graph_choice_idx] = _.cloneDeep(svg_cls.DrawAllGraph([this.temp_move_data], 0))
              console.log('this.all_graph_svg_mat', this.all_graph_svg_mat.length)
              // this.graph_svg_mat = this.RefreshAllGraphSvg(this.graph_data_mat, this.graph_choice_idx)
              // 计算处理连续点的点距离接近范围----判定接近点所对应直线的斜率/夹角情况
              let min_threshold = 20
              let [choice_point_mat, group_point_mat, neighbor_side_mat] = bpc_cls.CalculateSideAbsorb(this.graph_data_mat, this.graph_choice_idx, this.temp_move_data, min_threshold)
              let side_dx = 0 // 重新渲染计算移动量
              let side_dy = 0
              if (group_point_mat.length > 0) {
                if (bpc_cls.TwoPointDistance(group_point_mat[0][0], choice_point_mat[0][0]) <= min_threshold) {
                  side_dx = group_point_mat[0][0][0] - choice_point_mat[0][0][0]
                  side_dy = group_point_mat[0][0][1] - choice_point_mat[0][0][1]
                }
                else {
                  side_dx = group_point_mat[0][0][0] - choice_point_mat[0][1][0]
                  side_dy = group_point_mat[0][0][1] - choice_point_mat[0][1][1]
                }
                // console.log('移动量group_point_mat', JSON.stringify(choice_point_mat[0]), JSON.stringify(group_point_mat[0]))
                // 更新移动组
                this.temp_move_data = bpc_cls.DataMove2D(this.graph_data_mat[this.graph_choice_idx], [move_dx + side_dx, move_dy + side_dy])
                // this.graph_data_mat[this.graph_choice_idx]=this.temporary_data_mat
                this.all_graph_svg_mat[this.graph_choice_idx] = _.cloneDeep(svg_cls.DrawAllGraph([this.temp_move_data], 0))
              }
              console.log('移动量', side_dx, side_dy)
              // 合并线绘制
              let choice_line_svg = []
              let group_line_svg = []
              choice_point_mat = bpc_cls.DataMove2D(choice_point_mat, [move_dx + side_dx, move_dy + side_dy]) //更新移动
              // choice_line_svg = svg_cls.DrawAllGraph(choice_point_mat, -1, 'red')
              group_line_svg = svg_cls.DrawAllGraph(group_point_mat, -1, 'red')
              // 组合图像合并数据
              let single_combine_data = bpc_cls.CombineReorderData(this.graph_data_mat, this.temp_move_data, neighbor_side_mat)
              let combine_data_svg = []
              // console.log('组合数据', JSON.stringify(single_combine_data))
              combine_data_svg.push(
                svg_cls.DrawAllGraph([single_combine_data], -1, 'blue', 'blue')
                // <Polygon
                //   points={single_combine_data.join(' ')}  //多边形的每个角的x和y坐标
                //   fill="none"     //填充颜色
                //   fillOpacity={0.1}
                //   stroke="blue"   //外边框颜色
                //   strokeWidth="3"   //外边框宽度
                // />
              )
              this.setState({
                // drag_svg: this.temporary_svg_mat, // 临时图形
                graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
                draw_graph_svg: [choice_line_svg, group_line_svg, combine_data_svg]
              })

            }
          }
          if (this.func_mode === 'find_parallel') {
            // 寻找平行线
            let draw_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]     // 切割线
            // let [new_loc_mat, splite_loc_mat] = newgraphcls.AllGraphSplitProcess(this.graph_data_mat, cut_line_mat, this.init_split_mat)
            // console.log('----------切割数据cut_line_mat', JSON.stringify(cut_line_mat))
            // console.log('----------切割数据new_loc_mat', JSON.stringify(new_loc_mat),)
            // console.log('----------切割数据splite_loc_mat', JSON.stringify(splite_loc_mat))
            let draw_line_svg = svg_cls.DeconstructionDrawLineSvg({ point_a_mat: draw_line_mat[0], point_b_mat: draw_line_mat[1], stroke_color: 'red' })
            // 切割线渲染计算垂直符号----多个---实交点
            // console.log('计算切割', this.graph_data_mat)
            let parallel_line = bpc_cls.FindParallelLines(this.graph_data_mat, draw_line_mat)
            console.log('平行线---parallel_line', parallel_line)
            // 直角渲染
            let right_angle_svg_mat = []
            if (parallel_line.length > 0) {
              // 找到平行线
              let parallel_line_extend = bpc_cls.CalculateTwoExtendedLine(parallel_line[0], parallel_line[1], 40)
              console.log('延长线', parallel_line_extend)
              right_angle_svg_mat = svg_cls.DeconstructionDrawLineSvg({
                point_a_mat: parallel_line_extend[0],
                point_b_mat: parallel_line_extend[1],
                dash_mat: [10, 5],
                stroke_color: 'red',
                stroke_width: 5
              }) // 直角渲染
            }

            this.setState({
              draw_graph_svg: [draw_line_svg, right_angle_svg_mat]
            })
          }
          if (this.func_mode === 'shear_line') {
            // 剪切线段头
            let shear_line = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]
            let intersect_svg_mat = []
            this.new_shear_line_mat = []
            console.log('剪切线索引', this.shear_idx)
            if (this.shear_idx === -1) {
              // 无选中剪切线头---遍历所有线条组---亦或通过点到直线的距离获取选择直线
              let shear_mat = bpc_cls.ShearLineChoiceIdx(this.graph_data_mat, shear_line)
              // console.log('剪切', shear_mat)
              if (shear_mat[0] >= 0) {
                this.shear_idx = shear_mat[0]
                this.shear_mat = shear_mat[2] // 交线
                this.shear_intersection = shear_mat[3] // 交点
              }
            }
            else {
              // 计算剪切线段---与其他直线组的交点---对固定线段求解
              let all_intersection_mat = bpc_cls.getLineGraphIntersection(this.graph_data_mat, this.shear_idx, this.shear_mat)
              intersect_svg_mat.push(svg_cls.DrawAllPointSvg([all_intersection_mat], -1, 'red', 'red'))
              // 计算剪切线
              // 更新交点
              this.shear_intersection = bpc_cls.getLineAndLineIntersection(this.shear_mat, shear_line)
              if (this.shear_intersection.length > 0) {
                let [idx_mat, point_mat, new_line_mat] = bpc_cls.getShearLine(all_intersection_mat, this.shear_intersection)
                console.log('point_mat', JSON.stringify(all_intersection_mat), JSON.stringify(this.shear_intersection), point_mat)
                intersect_svg_mat.push(svg_cls.DeconstructionDrawLineSvg({
                  point_a_mat: point_mat[0],
                  point_b_mat: point_mat[1],
                  stroke_color: 'red',
                }))
                this.new_shear_line_mat = _.cloneDeep(new_line_mat)
              }

            }
            let cut_line_svg = svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: shear_line[0],
              point_b_mat: shear_line[1],
              stroke_color: 'red'
            })
            let shear_line_svg = svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: this.shear_mat.length > 0 ? this.shear_mat[0] : [-10, -10],
              point_b_mat: this.shear_mat.length > 0 ? this.shear_mat[1] : [-10, -10],
              stroke_color: 'lime'
            })
            // console.log('----------',JSON.stringify(intersect_svg_mat))
            this.setState({
              draw_graph_svg: [shear_line_svg, cut_line_svg, intersect_svg_mat]
            })
          }
          if (this.func_mode === 'draw_line_text') {
            // 绘制直线文本
            let draw_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]
            let draw_line_svg = []
            draw_line_svg.push(svg_cls.DeconstructionDrawLineSvg({ point_a_mat: draw_line_mat[0], point_b_mat: draw_line_mat[1], stroke_color: 'black' }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({ point_mat: draw_line_mat[0], fill_color: 'red' }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({ point_mat: draw_line_mat[1], fill_color: 'red' }))
            // draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({ point_mat: [(this.line_start_x + this.line_end_x) / 2, (this.line_start_y + this.line_end_y) / 2], fill_color: 'red' }))//中心点
            let draw_line_length = gridding_cls.getLineCoordinateLength(draw_line_mat[0], draw_line_mat[1], 1).toString()
            // 计算文本放置点
            draw_line_length = bpc_cls.NumAdditionZeros(draw_line_length, 1)
            console.log('draw_line_length', draw_line_length)
            let text_point = bpc_cls.getLineTextLoc(draw_line_mat[0], draw_line_mat[1], 20, draw_line_length, 'down')
            let draw_text_svg = svg_cls.DrawTextSvg(draw_line_length, text_point, 20, 'black') // 文本
            this.setState({
              draw_graph_svg: [draw_line_svg, draw_text_svg]
            })
          }
          if (this.func_mode === 'grid_absorb') {
            // 网格吸附
            // let absorb_flag = 1
            let [line_end_x, line_end_y, absorb_flag] = bpc_cls.getGridAdsorptionIdx(gridding_cls.img_x_mat, gridding_cls.img_y_mat, [this.line_end_x, this.line_end_y], 0.5)
            let draw_line_mat = [[this.line_start_x, this.line_start_y], [line_end_x, line_end_y]]
            console.log('this.line_end_x, this.line_end_y', JSON.stringify([this.line_end_x, this.line_end_y]), JSON.stringify(draw_line_mat))
            let draw_line_svg = []
            // this.line_end_x, this.line_end_y
            draw_line_svg.push(svg_cls.DeconstructionDrawLineSvg({ point_a_mat: draw_line_mat[0], point_b_mat: draw_line_mat[1], stroke_color: 'black' }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({ point_mat: draw_line_mat[0], fill_color: 'red' }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({ point_mat: draw_line_mat[1], fill_color: 'red' }))
            this.setState({
              draw_graph_svg: [draw_line_svg]
            })
          }
          if (this.func_mode === 'single_grid_absorb') {
            // 连续格点
            let new_grid_mat = bpc_cls.JudgeContinuityPoint(this.sing_grid_mat, gridding_cls.img_x_mat, gridding_cls.img_y_mat, [this.line_end_x, this.line_end_y], 0.1)
            this.sing_grid_mat = _.cloneDeep(new_grid_mat)
            // 连续格点
            let draw_line_svg = []
            // this.line_end_x, this.line_end_y
            draw_line_svg.push(svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: this.sing_grid_mat[this.sing_grid_mat.length - 1],
              point_b_mat: [this.line_end_x, this.line_end_y], stroke_color: 'black'
            }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({
              point_mat: this.sing_grid_mat[this.sing_grid_mat.length - 1],
              fill_color: 'red'
            }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPointSvg({
              point_mat: [this.line_end_x, this.line_end_y],
              fill_color: 'red'
            }))
            draw_line_svg.push(svg_cls.DeconstructionDrawPolylineSvg({
              polyline_mat: this.sing_grid_mat,
            }))
            draw_line_svg.push(svg_cls.DrawAllPointSvg([this.sing_grid_mat], -1, 'red', 'red'))
            this.setState({
              draw_graph_svg: [draw_line_svg]
            })
          }
          if (this.func_mode === 'combine_line' && this.graph_choice_idx >= 0) {
            // 移动量
            let move_dx = this.line_end_x - this.line_start_x
            let move_dy = this.line_end_y - this.line_start_y
            // 绘制临时图形
            this.temporary_data_mat = bpc_cls.DataMove2D(this.graph_data_mat[this.graph_choice_idx], [move_dx, move_dy]) // 临时移动数据
            // this.DrawTemporarySvg([move_dx, move_dy], this.graph_data_mat[this.graph_choice_idx])
            // this.graph_data_mat[this.graph_choice_idx]
            this.all_graph_svg_mat[this.graph_choice_idx] = svg_cls.DeconstructionDrawPolylineSvg({
              polyline_mat: this.temporary_data_mat,
              stroke_color: 'red'
            })
            // this.graph_svg_mat = this.RefreshAllGraphSvg(this.graph_data_mat, this.graph_choice_idx)
            // 建立自动吸附计算----控制距离内绘制圆圈，更新坐标显示，释放后自动判定是否为吸附计算
            let contrast_mat = bpc_cls.EndpointAdsorptionCalculate(this.graph_data_mat, this.graph_choice_idx, this.temporary_data_mat)
            // console.log('吸附比较', contrast_mat)
            this.adsorb_svg = []
            if (contrast_mat[0] >= 0) {
              // 存在吸附接近点
              let absorb_point = this.graph_data_mat[contrast_mat[0]][contrast_mat[2]]
              this.adsorb_svg.push(svg_cls.DeconstructionDrawPointSvg({
                point_mat: absorb_point,
                radius: 10,
                fill_color: 'transparent',
                stroke_color: 'red',
                stroke_width: 2,
              }))
              // 更新 移动线条数据----this.temporary_data_mat
              let absorb_x = absorb_point[0] - this.temporary_data_mat[contrast_mat[1]][0]    // 
              let absorb_y = absorb_point[1] - this.temporary_data_mat[contrast_mat[1]][1]    // 平移端点
              this.temporary_data_mat[contrast_mat[1]][0] += absorb_x
              this.temporary_data_mat[contrast_mat[1]][1] += absorb_y
              this.temporary_data_mat[(contrast_mat[1] + 1) % 2][0] += absorb_x
              this.temporary_data_mat[(contrast_mat[1] + 1) % 2][1] += absorb_y
              // 重新绘制
              this.all_graph_svg_mat[this.graph_choice_idx] = svg_cls.DeconstructionDrawPolylineSvg({
                polyline_mat: this.temporary_data_mat,
                stroke_color: 'red'
              })
            }
            this.setState({
              // drag_svg: this.temporary_svg_mat, // 临时图形
              graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
              draw_graph_svg: this.adsorb_svg // 吸附展示更新
            })
          }
          if (this.func_mode === 'graph_text' && this.graph_choice_idx >= 0 &&
            (this.line_end_x > 20 && this.line_end_x < coordinate_width && this.line_end_y > 20 && this.line_end_y < coordinate_height)) {
            // TwoLineVectorMove = (line_a_mat, line_b_mat, move_data)
            let move_data = [this.line_end_x - this.line_start_x, this.line_end_y - this.line_start_y]
            let graph_length = this.graph_data_mat[this.graph_choice_idx].length
            let line_a_mat = [
              this.graph_data_mat[this.graph_choice_idx][(this.line_choice_idx - 1 + graph_length) % graph_length],
              this.graph_data_mat[this.graph_choice_idx][this.line_choice_idx]]
            let line_b_mat = [
              this.graph_data_mat[this.graph_choice_idx][(this.line_choice_idx + 2 + graph_length) % graph_length],
              this.graph_data_mat[this.graph_choice_idx][(this.line_choice_idx + 1 + graph_length) % graph_length]
            ]
            console.log('相邻线条组', JSON.stringify(line_a_mat), JSON.stringify(line_b_mat), JSON.stringify(move_data))
            let [new_line_a, new_line_b] = bpc_cls.TwoLineVectorMove(line_a_mat, line_b_mat, move_data)
            console.log('new线数组', JSON.stringify(new_line_a), JSON.stringify(new_line_b))
            console.log('越界判定new_line_a', JSON.stringify(new_line_a), this.line_end_x, this.line_end_y)
            // console.log('越界判定', bpc_cls.JudgeGraphInRengion({ graph_mat: new_line_a, min_x: 100, max_x: coordinate_width - 10, min_y: 100, max_y: coordinate_height - 10 }))
            console.log('越界判定new_line_b', JSON.stringify(new_line_b))
            // console.log('越界判定', bpc_cls.JudgeGraphInRengion({ graph_mat: new_line_b, min_x: 10, max_x: coordinate_width - 10, min_y: 10, max_y: coordinate_height - 10 }))
            if (bpc_cls.JudgeGraphInRengion({ graph_mat: new_line_a, min_x: 20, max_x: coordinate_width - 10, min_y: 20, max_y: coordinate_height - 10 }) &&
              bpc_cls.JudgeGraphInRengion({ graph_mat: new_line_b, min_x: 20, max_x: coordinate_width - 10, min_y: 20, max_y: coordinate_height - 10 })) {
              console.log('越界判定内')
              let new_line_svg_mat = []
              new_line_svg_mat.push(svg_cls.DeconstructionDrawLineSvg({
                point_a_mat: new_line_a[0],
                point_b_mat: new_line_a[1],
                stroke_color: 'lime'
              }))
              new_line_svg_mat.push(svg_cls.DeconstructionDrawLineSvg({
                point_a_mat: new_line_b[0],
                point_b_mat: new_line_b[1],
                stroke_color: 'lime'
              }))
              new_line_svg_mat.push(svg_cls.DeconstructionDrawLineSvg({
                point_a_mat: new_line_a[1],
                point_b_mat: new_line_b[1],
                stroke_color: 'red'
              }))
              // 绘制文本
              let temp_graph_mat = _.cloneDeep(this.graph_data_mat[this.graph_choice_idx]) // 临时数据
              temp_graph_mat[this.line_choice_idx] = new_line_a[1]
              temp_graph_mat[(this.line_choice_idx + 1) % temp_graph_mat.length] = new_line_b[1]
              let draw_text_svg = []
              let graph_text_mat = bpc_cls.getAllGraphLocText([temp_graph_mat])
              for (let idx = 0; idx < graph_text_mat.length; idx++) {
                for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
                  console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
                  draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'red')) // 文本
                }
              }
              this.temporary_graph_mat = _.cloneDeep(temp_graph_mat)
              this.setState({
                draw_graph_svg: [new_line_svg_mat, draw_text_svg]
              })
            }

          }

          if (this.func_mode === 'line_move' && this.graph_choice_idx >= 0 && this.line_choice_idx >= 0) {
            //  选边
            let move_data = [this.line_end_x - this.line_start_x, this.line_end_y - this.line_start_y]
            let new_graph_data = bpc_cls.ParallelogramMoveLine(this.graph_data_mat[this.graph_choice_idx], move_data, this.line_choice_idx) // 平行四边形不稳定性验证，周长不变
            let choice_line_svg = svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: new_graph_data[this.line_choice_idx],
              point_b_mat: new_graph_data[(this.line_choice_idx + 1) % new_graph_data.length],
              stroke_color: 'red'
            })
            let new_graph_svg = svg_cls.DeconstructionDrawPolygonSvg({
              polygon_mat: new_graph_data,
              fill_color: 'transparent'
            })
            this.setState({
              draw_graph_svg: [new_graph_svg, choice_line_svg]
            })
          }

          if (this.func_mode === 'line_move2' && this.graph_choice_idx >= 0 && this.line_choice_idx >= 0) {
            // 平行四边形移动，周长变化、面积变化
            let move_data = [this.line_end_x - this.line_start_x, this.line_end_y - this.line_start_y]
            // 方式1：移动组的线条方向和长度边，修改该线条两端坐标
            let fixed_graph_mat = _.cloneDeep(this.graph_data_mat[this.graph_choice_idx])
            let first_point_mat = fixed_graph_mat[this.line_choice_idx]
            let second_point_mat = fixed_graph_mat[(this.line_choice_idx + 1) % fixed_graph_mat.length]
            let new_first = bpc_cls.DataMove2D([first_point_mat], move_data)[0]
            let new_second = bpc_cls.DataMove2D([second_point_mat], move_data)[0]
            fixed_graph_mat[this.line_choice_idx] = new_first
            fixed_graph_mat[(this.line_choice_idx + 1) % fixed_graph_mat.length] = new_second // 更新坐标点
            // 方式2：固定点前后两条直线的方向不变-----移动点，缩放图像---适用于点的选择
            let new_move_mat = bpc_cls.CalculateGraphPointMove(this.graph_data_mat[this.graph_choice_idx], this.line_choice_idx, move_data)
            let choice_line_svg = []
            choice_line_svg = svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: new_move_mat[this.line_choice_idx],
              point_b_mat: new_move_mat[(this.line_choice_idx + 1) % fixed_graph_mat.length],
              stroke_color: 'red'
            })
            choice_line_svg = []
            let choice_point_svg = []
            choice_point_svg = svg_cls.DeconstructionDrawPointSvg({
              point_mat: new_move_mat[this.line_choice_idx],
              fill_color: 'red'
            })
            choice_line_svg.push(svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: new_move_mat[this.line_choice_idx],
              point_b_mat: new_move_mat[(this.line_choice_idx + 1) % fixed_graph_mat.length],
              stroke_color: 'red'
            }))
            choice_line_svg.push(svg_cls.DeconstructionDrawLineSvg({
              point_a_mat: new_move_mat[this.line_choice_idx],
              point_b_mat: new_move_mat[(this.line_choice_idx - 1 + fixed_graph_mat.length) % fixed_graph_mat.length],
              stroke_color: 'red'
            }))
            let new_graph_svg = svg_cls.DeconstructionDrawPolygonSvg({
              polygon_mat: new_move_mat,
              fill_color: 'transparent'
            })
            this.setState({
              // graph_svg:[],
              draw_graph_svg: [new_graph_svg, choice_line_svg, choice_point_svg]
            })
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        console.log('渲染点击点', this.line_start_x, this.line_start_y)

        if (this.func_mode === 'graph_move' && this.graph_choice_idx >= 0) {
          this.graph_data_mat[this.graph_choice_idx] = _.cloneDeep(this.temporary_data)
          this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
          // 释放渲染
          this.setState({
            touch_point_svg: [],
            graph_svg: this.all_graph_svg_mat,    // 图形渲染         
          })
        }
        if (this.func_mode === 'auxiliary_high2' && this.graph_choice_idx >= 0) {

        }
        if (this.func_mode === 'cut_absorb') {
          if (this.graph_choice_idx < 0) {
            // 切割图像
            let cut_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]     // 切割线
            let [new_loc_mat, splite_loc_mat] = newgraphcls.AllGraphSplitProcess(this.graph_data_mat, cut_line_mat, this.graph_data_mat)
            // console.log('----------切割数据cut_line_mat', JSON.stringify(cut_line_mat))
            console.log('----------切割数据new_loc_mat---新坐标点', JSON.stringify(new_loc_mat), new_loc_mat.length)
            // console.log('----------切割数据splite_loc_mat----平移坐标点', JSON.stringify(splite_loc_mat))
            // 绘制图像----数据更新
            this.all_graph_svg_mat = _.cloneDeep(svg_cls.DrawAllGraph(new_loc_mat, -1))
            // 根据情况更新坐标数据----
            this.graph_data_mat = _.cloneDeep(new_loc_mat)
            this.setState({
              // drag_svg: [], // 临时图形
              graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
              // // graph_svg: this.graph_svg_mat,
              // adsorb_svg: [],         // 吸附展示更新
              // closed_graph_svg: this.closed_graph_svg,   // 封闭图像
              draw_graph_svg: [],
            })
          }
          else {
            // 移动组合
            this.graph_data_mat[this.graph_choice_idx] = this.temp_move_data
            this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
            this.setState({
              // drag_svg: [], // 临时图形
              graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
              // // graph_svg: this.graph_svg_mat,
              // adsorb_svg: [],         // 吸附展示更新
              // closed_graph_svg: this.closed_graph_svg,   // 封闭图像
              draw_graph_svg: [],
            })
          }
        }
        if (this.func_mode === 'find_parallel') {
          // 绘制渲染
          let draw_line_mat = [[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]]     // 切割线
          this.graph_data_mat.push(draw_line_mat)
          console.log('绘制直线', draw_line_mat)
          this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
          this.setState({
            // drag_svg: [], // 临时图形
            graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
            // // graph_svg: this.graph_svg_mat,
            // adsorb_svg: [],         // 吸附展示更新
            // closed_graph_svg: this.closed_graph_svg,   // 封闭图像
            draw_graph_svg: [],
          })
        }
        if (this.func_mode === 'shear_line') {
          if (this.shear_idx >= 0 && this.new_shear_line_mat.length > 0) {
            // this.new_shear_line_mat
            this.graph_data_mat.splice(this.shear_idx, 1)
            for (let idx = 0; idx < this.new_shear_line_mat.length; idx++) {
              this.graph_data_mat.push(this.new_shear_line_mat[idx])
            }
          }
          this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
          this.setState({
            graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
            draw_graph_svg: [],
          })
        }
        if (this.func_mode === 'grid_absorb') {
          // 吸附判定
          this.graph_data_mat.push([[this.line_start_x, this.line_start_y], [this.line_end_x, this.line_end_y]])
          this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
          this.all_point_svg_mat = svg_cls.DrawAllPointSvg(this.graph_data_mat, -1, 'lime', 'lime')
          this.setState({
            graph_svg: [this.all_graph_svg_mat, this.all_point_svg_mat],  // 修改多组图形存在时的数据
            draw_graph_svg: [],
          })
        }
        if (this.func_mode === 'combine_line' && this.graph_choice_idx >= 0) {
          // 释放重组数据刷新颜色
          this.graph_data_mat[this.graph_choice_idx] = _.cloneDeep(this.temporary_data_mat)
          this.all_graph_svg_mat = svg_cls.DrawAllGraph(this.graph_data_mat)
          // 组合图形判定
          let combine_idx_mat = bpc_cls.JudgeCombineLine(this.graph_data_mat)
          console.log('组合组数据', JSON.stringify(combine_idx_mat))
          if (combine_idx_mat.length > 0) {
            // 存在组合线条、分类型判定----封闭图像
            this.drag_svg_mat = []
            for (let idx = 0; idx < combine_idx_mat.length; idx++) {
              // 单组判定
              if (combine_idx_mat[idx].length > 2) {
                // 最少为3组线---封闭图形----头尾关系---正负方向
                let closed_graph_mat0 = bpc_cls.JudgeClosedGraph(this.graph_data_mat, combine_idx_mat[idx])
                // 绘制封闭图像
                let closed_graph_mat = bpc_cls.LinkLinePoint(closed_graph_mat0)
                console.log('=========closed_graph_mat', JSON.stringify(closed_graph_mat))
                console.log('平行四边形判定', bpc_cls.MatchingGraphType(closed_graph_mat, '平行四边形'))
                if (closed_graph_mat.length > 0) {
                  this.drag_svg_mat.push(svg_cls.DeconstructionDrawPolygonSvg({
                    polygon_mat: closed_graph_mat,
                    stroke_color: 'red',
                    fill_color: 'lime',
                    fill_opacity: 0.2
                  }))
                }
              }
            }
          }
          this.setState({
            // drag_svg: this.temporary_svg_mat, // 临时图形
            graph_svg: this.all_graph_svg_mat,   // 修改多组图形存在时的数据
            draw_graph_svg: [this.drag_svg_mat] // 吸附展示更新
          })
        }
        if (this.func_mode === 'graph_text' && this.graph_choice_idx >= 0) {
          this.graph_data_mat[this.graph_choice_idx] = _.cloneDeep(this.temporary_graph_mat)
          let graph_text_mat = bpc_cls.getAllGraphLocText(this.graph_data_mat)
          let draw_text_svg = []
          for (let idx = 0; idx < graph_text_mat.length; idx++) {
            for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
              // console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
              draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'black')) // 文本
            }
          }
          let all_graph_img_svg = svg_cls.DrawAllGraph(this.graph_data_mat)
          this.setState({
            graph_svg: [all_graph_img_svg,],
            draw_graph_svg: [draw_text_svg]
          })
        }
        this.graph_choice_idx = -1
        this.shear_idx = -1
        this.shear_mat = []
        this.temporary_graph_mat = []
        this.setState({
          move_responder_flag: 'auto'
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
    this._panResponderDrawLine2 = PanResponder.create({
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
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
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
          let move_x = right_txt * per_pixels
          let move_data = [move_x, 0]
          let [all_graph_svg_mat, draw_text_svg] = this.AllGraphMoveRefresh(this.graph_data_mat, move_data)
          this.width_polygon = [[this.slider_start_x, 0], [this.slider_end_x + this.smile_width / 2, 0], [this.slider_end_x + this.smile_width / 2, this.slider_height], [this.slider_start_x, this.slider_height]]
          this.setState({
            // slider_start_x: this.slider_start_x,
            // slider_end_x: this.slider_start_x + right_txt * this.slider_per_pixels,
            smile_box_x: this.slider_start_x + right_txt * this.slider_per_pixels,
            leftTxt: 0,
            rightTxt: right_txt,
            graph_svg: all_graph_svg_mat,    // 图形渲染
            draw_graph_svg: [draw_text_svg]
          })
        }
        else if (this.line_end_x2 < (this.fixed_box_x + 25) && this.line_end_x2 >= this.min_x &&
          this.line_end_y2 >= 0 && this.line_end_y2 <= 50 && this.effective_flag == 1) {

          // this.smile_box_x = (this.line_end_x2 - this.smile_width / 2) >= this.min_x ? this.line_end_x2 : this.min_x
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
          let move_x = -left_txt * per_pixels
          let move_data = [move_x, 0]
          let [all_graph_svg_mat, draw_text_svg] = this.AllGraphMoveRefresh(this.graph_data_mat, move_data)
          // this.slider_start_x = Math.round(this.slider_start_x * 100) / 100
          // this.slider_width = Math.round((this.slider_end_x - this.slider_start_x) * 100) / 100
          // console.log('左：this.slider_end_x - this.slider_start_x + this.smile_box_x', this.slider_end_x - this.slider_start_x + this.smile_box_x,)
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
            graph_svg: all_graph_svg_mat,    // 图形渲染
            draw_graph_svg: [draw_text_svg]
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
    this._panResponderRotatingDisk = PanResponder.create({
      // 要求成为响应者：旋转圆盘
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
        this.line_start_x3 = Math.round(tempfirstX * 100) / 100
        this.line_start_y3 = Math.round(tempFirstY * 100) / 100
        // 判定是否选中
        if (Math.abs(this.line_start_x3 - this.state.cx) < this.state.cr &&
          Math.abs(this.line_start_y3 - this.state.cy) < this.state.cr) {
          console.log('选中旋转图标')
          this.choice_circle = 1
          this.setState({
            cCorlor: 'red',
          })
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        this.line_end_x3 = Math.round(pointX * 100) / 100
        this.line_end_y3 = Math.round(pointY * 100) / 100
        console.log('二组移动', this.line_start_x3, this.line_start_y3, this.line_end_x3, this.line_end_y3)
        if (this.choice_circle === 1) {
          // 选中旋转圆
          let line_k = 0
          let angle_k = 0
          if (this.line_end_x3 === this.circle_ring_x) {
            if (this.line_end_y3 > this.circle_ring_y) {
              angle_k = -90 + 360
            }
            else {
              angle_k = 90 + 360
            }
          }
          else {
            line_k = -(this.line_end_y3 - this.circle_ring_y) / (this.line_end_x3 - this.circle_ring_x)
            angle_k = Math.atan(line_k) / Math.PI * 180 + 360
          }
          let new_cx = this.line_end_x3
          let new_cy = this.line_end_y3
          console.log('角度angle_k', angle_k)
          let [vector_x, vector_y] = [this.line_end_x3 - this.circle_ring_x, this.line_end_y3 - this.circle_ring_y]
          let p_distance = bpc_cls.TwoPointDistance([this.line_end_x3, this.line_end_y3], [this.circle_ring_x, this.circle_ring_y])
          let [normal_vector_x, normal_vector_y] = [vector_x / p_distance, vector_y / p_distance]
          new_cx = normal_vector_x * this.circle_ring_r + this.circle_ring_x
          new_cy = normal_vector_y * this.circle_ring_r + this.circle_ring_y
          if (this.line_end_x3 < this.circle_ring_x) {
            // angle_k
            angle_k += 180 + 360
          }
          // angle_k = angle_k % 360 // 3点方向0度
          angle_k = (angle_k % 360 + 270) % 360  // 12点方向0°
          // 建立旋转坐标变换
          let temp_graph_mat = bpc_cls.AllGraphRotate([this.graph_data_mat[0]], this.graph_data_mat[0][2], angle_k)
          console.log('temp_graph_mat', JSON.stringify(temp_graph_mat))
          let temp_svg_mat = svg_cls.DeconstructionDrawPolygonSvg({ polygon_mat: temp_graph_mat, fill_color: 'transparent', stroke_color: 'red' })
          // 文本
          let temp_graph_mat0 = bpc_cls.AllGraphRotate([this.graph_data_mat[0]], this.graph_data_mat[0][2], 0)
          let graph_text_mat = bpc_cls.getAllGraphLocText(temp_graph_mat0)
          console.log('graph_text_mat', JSON.stringify(graph_text_mat))
          let text_rotate_mat = bpc_cls.AllGraphTextRotate(graph_text_mat, this.graph_data_mat[0][2], angle_k) // 原始文本坐标旋转
          console.log('text_rotate_mat', JSON.stringify(text_rotate_mat))
          let draw_text_svg = []
          for (let idx = 0; idx < graph_text_mat.length; idx++) {
            for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
              // console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
              // draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'black')) // 文本
              draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], text_rotate_mat[idx][s_idx], 20, 'black')) // 文本
            }
          }
          let circle_ring_mat = []
          if (this.last_angle == 0) {
            // 0为顺、1为逆this.clockwise_flage = 0
            if (angle_k > 0 && angle_k < 30) {
              this.clockwise_flag = 1
            }
            else if (angle_k > 330 && angle_k < 360) {
              this.clockwise_flag = 0
            }
          } else {
            // 跨过0°位置
            if (this.last_angle > 270 && angle_k < 90) {
              // 逆时针
              this.clockwise_flag = 1
            }
            else if (angle_k > 270 && this.last_angle < 90) {
              // 顺时针
              this.clockwise_flag = 0
            }
          }
          if (angle_k != 0) {
            // let circle_ring_mat = bpc_cls.getClockwiseCircleLoc(0, angle_k, this.circle_ring_x, this.circle_ring_y, this.circle_ring_r)
            if (this.clockwise_flag === 0) {
              // 顺时针
              circle_ring_mat = bpc_cls.getClockwiseCircleLoc(0, angle_k, this.circle_ring_x, this.circle_ring_y, this.circle_ring_r)

            }
            else if (this.clockwise_flag === 1) {
              // 逆时针
              circle_ring_mat = bpc_cls.getAnticlockwiseCircleLoc(0, angle_k, this.circle_ring_x, this.circle_ring_y, this.circle_ring_r)
            }
          }
          this.last_angle = angle_k
          console.log('旋转前', JSON.stringify(circle_ring_mat))
          circle_ring_mat = bpc_cls.SingleGraphRotate(circle_ring_mat, [this.circle_ring_x, this.circle_ring_y], 90)  // 计算切换方向
          console.log('旋转后', JSON.stringify(circle_ring_mat))

          let circle_ring_svg = svg_cls.DeconstructionDrawPolylineSvg({
            polyline_mat: circle_ring_mat,
            stroke_width: 20,
            stroke_color: 'lime'
          })
          let rotate_point_svg = svg_cls.DeconstructionDrawPointSvg({ point_mat: this.graph_data_mat[0][2] })
          this.setState({
            // split_mat_svg: new_split_svg_mat,
            // dash_line_color:'transparent'
            cx: new_cx,//this.touch_end_x2,  //
            cy: new_cy,//this.touch_end_y2,  //
            angele_text: this.clockwise_flag === 1 ? (Math.round(angle_k * 1) / 1 + '°') : (360 - Math.round(angle_k * 1) / 1 + '°'),
            draw_graph_svg: [temp_svg_mat, draw_text_svg, rotate_point_svg],
            graph_svg: [],
            rotate_svg_mat: circle_ring_svg,
            rotate_text: this.clockwise_flag === 1 ? '逆时针旋转:' : '顺时针旋转:'
          })
        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        console.log('渲染点击点', this.line_start_x3, this.line_start_y3)
        this.choice_circle = -1
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
    this._panResponderSlider = PanResponder.create({
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
        this.line_start_x2 = Math.round(tempfirstX * 100) / 100
        this.line_start_y2 = Math.round(tempFirstY * 100) / 100
        if (this.line_start_y2 > 0 && this.line_start_y2 < 50 &&
          Math.abs(this.line_start_x2 - this.sign_cx) <= this.sign_width * 0.6) {
          // 有效区域
          this.effective_flag = 1
          console.log('有效选择初始点 ', this.line_start_x2, this.line_start_y2)
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        this.line_end_x2 = Math.round(pointX * 100) / 100 // 应修正移动值
        this.line_end_y2 = Math.round(pointY * 100) / 100
        console.log('上下二组移动', this.line_start_x2, this.line_start_y2, this.line_end_x2, this.line_end_y2)
        if (this.line_end_y2 > 0 && this.line_end_y2 < 50 && this.effective_flag == 1) {
          if (this.line_end_x2 >= this.sign_width * 0.5 && this.line_end_x2 <= this.view_width - this.sign_width * 0.5) { // 大于半宽
            // console.log('大于半宽')
            // 绘图计算
            if (this.line_end_x2 >= this.init_cx) {
              // 右滑
              let length_num = Math.round((this.line_end_x2 - this.init_cx - this.sign_width * 0.5) / this.per_width) // 长度整数值
              this.sign_cx = this.init_cx + this.per_width * length_num + this.sign_width * 0.5
              this.width_polygon = [
                [this.init_cx, 0], [this.sign_cx - this.sign_width * 0.5, 0],
                [this.sign_cx - this.sign_width * 0.5, this.slider_height], [this.init_cx, this.slider_height]
              ]
              // 长度计算整数倍
              this.setState({
                sign_cx: this.sign_cx,
                downTxt: length_num,
                upTxt: 0,
              })
            }
            else {
              // 左滑
              let length_num = Math.round((this.init_cx - this.line_end_x2 + this.sign_width * 0.5) / this.per_width * 10) / 10 // 长度整数值
              this.sign_cx = this.init_cx - this.per_width * length_num + this.sign_width * 0.5
              this.width_polygon = [
                [this.init_cx, 0], [this.sign_cx - this.sign_width * 0.5, 0],
                [this.sign_cx - this.sign_width * 0.5, this.slider_height], [this.init_cx, this.slider_height]
              ]
              this.width_polygon = [
                [this.init_cx, 0], [this.sign_cx - this.sign_width * 0.5, 0],
                [this.sign_cx - this.sign_width * 0.5, this.slider_height], [this.init_cx, this.slider_height]
              ]
              this.setState({
                sign_cx: this.sign_cx,
                downTxt: 0,
                upTxt: length_num,
              })
            }

          }

        }
        else {
          this.effective_flag = -1
        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // console.log('渲染点击点', this.line_start_x2, this.line_start_y2)
        this.effective_flag = -1
        this.setState({
          smile_color: 'orange'
        })
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        console.log('另一个组件已经成为了新的响应者，所以当前手势将被取消')
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    })
  }

  TickMark = (left_num, right_num, all_length, height) => {
    /**
     * @description 刻度线
     */
    let per_len = all_length / (left_num + right_num)
    let tick_svg = []
    for (let idx = 0; idx <= (left_num + right_num); idx++) {
      if (idx == 0) {
        tick_svg.push(<Line
          x1={per_len * idx + 1}   //x轴的开始位置
          y1={height * 0.3}   //y轴的开始位置
          x2={per_len * idx + 1}  //x轴的结束位置
          y2={height}  //y轴的结束位置
          stroke="black"  //填充颜色
          strokeWidth="2"  //填充宽度
        />)
      }
      else if (idx === (left_num + right_num)) {
        tick_svg.push(<Line
          x1={per_len * idx - 1}   //x轴的开始位置
          y1={height * 0.3}   //y轴的开始位置
          x2={per_len * idx - 1}  //x轴的结束位置
          y2={height}  //y轴的结束位置
          stroke="black"  //填充颜色
          strokeWidth="2"  //填充宽度
        />)
      }
      else if (idx === (left_num)) {
        tick_svg.push(<Line
          x1={per_len * idx}   //x轴的开始位置
          y1={height * 0.2}   //y轴的开始位置
          x2={per_len * idx}  //x轴的结束位置
          y2={height}  //y轴的结束位置
          stroke="red"  //填充颜色
          strokeWidth="5"  //填充宽度
        />)
      }
      else {
        tick_svg.push(<Line
          x1={per_len * idx}   //x轴的开始位置
          y1={height * 0.3}   //y轴的开始位置
          x2={per_len * idx}  //x轴的结束位置
          y2={height}  //y轴的结束位置
          stroke="black"  //填充颜色
          strokeWidth="2"  //填充宽度
        />)
      }
      //画小格
      for (let idx = 0; idx < left_num; idx++) {
        // 
        let m_tick_num = 10 // 最小刻度划分数
        for (let m_idx = 1; m_idx < m_tick_num; m_idx++) {
          let tick_mx = per_len * idx + per_len / m_tick_num * m_idx    //10刻度
          if (m_idx === m_tick_num / 2) {
            tick_svg.push(<Line
              x1={tick_mx}   //x轴的开始位置
              y1={height * 0.4}   //y轴的开始位置
              x2={tick_mx}  //x轴的结束位置
              y2={height}  //y轴的结束位置
              stroke="black"  //填充颜色
              strokeWidth="1.5"  //填充宽度
            />)
          }
          else {
            tick_svg.push(<Line
              x1={tick_mx}   //x轴的开始位置
              y1={height * 0.5}   //y轴的开始位置
              x2={tick_mx}  //x轴的结束位置
              y2={height}  //y轴的结束位置
              stroke="black"  //填充颜色
              strokeWidth="1.5"  //填充宽度
            />)
          }

        }
      }

    }
    return tick_svg
  }

  AllGraphMoveRefresh = (all_graph_data, move_data) => {
    // 绘制文本
    let graph_data_mat = bpc_cls.MoveAllGraphData(all_graph_data, move_data)
    let all_graph_svg_mat = svg_cls.DrawAllGraph(graph_data_mat)
    let draw_text_svg = []
    let graph_text_mat = bpc_cls.getAllGraphLocText(graph_data_mat)
    for (let idx = 0; idx < graph_text_mat.length; idx++) {
      for (let s_idx = 0; s_idx < graph_text_mat[idx].length; s_idx++) {
        console.log('graph_text_mat[idx][s_idx][0]', graph_text_mat[idx][s_idx][0])
        draw_text_svg.push(svg_cls.DrawTextSvg(graph_text_mat[idx][s_idx][1], graph_text_mat[idx][s_idx][0], 20, 'black')) // 文本
      }
    }
    return [all_graph_svg_mat, draw_text_svg]
  }

  componentDidMount() {
    console.log('后渲染')
  }

  GriddingGenerator() {
    console.log('网格展示---')
  }

  GridPoint() {
    console.log('网点展示---')
  }

  GriddingZoomIn() {
    console.log('放大----')
  }

  GriddingZoomOut() {
    console.log('缩小---')
  }


  render() {
    // console.log('绘制渲染-------this.state.slider_end_x - this.state.slider_start_x',
    //   this.state.slider_start_x,
    //   this.state.slider_start_x + this.state.slider_end_x - this.state.slider_start_x)
    console.log('越界this.state.move_responder_flag', this.state.move_responder_flag)
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ height: 50, flexDirection: 'row', marginLeft: 100 }}>
          <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
            onPress={() => this.GriddingGenerator()} >
            <Text style={{ fontSize: 30 }}>网格</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
            onPress={() => this.GridPoint()} >
            <Text style={{ fontSize: 30 }}>网点</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
            onPress={() => this.GriddingZoomIn()} >
            <Text style={{ fontSize: 30 }}>放大</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.touch, { alignContent: 'center' }]}
            onPress={() => this.GriddingZoomOut()} >
            <Text style={{ fontSize: 30 }}>缩小</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: 50, marginTop: 10, flexDirection: 'row' }}>
          <View style={{ width: coordinate_width + gridding_strokeWidth, height: coordinate_height + gridding_strokeWidth, backgroundColor: 'white' }}
            {...this._panResponderDrawLine.panHandlers} pointerEvents={this.state.move_responder_flag}
          >
            {/* <Image style={{ width: 1000, height: height, backgroundColor: 'green', top: 0, left: 0, position: 'absolute' }} source={require('./pugongy.jpeg')} /> */}
            <Svg style={{
              width: coordinate_width + gridding_strokeWidth,
              height: coordinate_height + gridding_strokeWidth,
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              position: 'absolute'
            }} >
              {[
                this.state.gridding_svg, // 网格渲染
                this.state.touch_point_svg, // 触控点
              ]}
              {
                // this.state.gridding_svg
              }
            </Svg>
            <Svg style={{
              width: coordinate_width + gridding_strokeWidth,
              height: coordinate_height + gridding_strokeWidth,
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              position: 'absolute'
            }} >
              {
                this.state.graph_svg    // 静态图形渲染
              }
            </Svg>
            <Svg style={{
              width: coordinate_width + gridding_strokeWidth,
              height: coordinate_height + gridding_strokeWidth,
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              position: 'absolute'
            }} >
              {
                this.state.draw_graph_svg    // 过程图形渲染
              }
            </Svg>
          </View>
          <View>
            <View style={{ width: 450, height: 100, backgroundColor: 'lime', marginLeft: 20 }}>
              <View style={{ width: this.slider_width, height: this.smile_height, backgroundColor: 'transparent', borderRadius: this.smile_height / 2, top: 5, left: 25, }}>
                <Svg style={{ width: this.slider_width, height: this.slider_height, backgroundColor: 'white', top: (this.smile_height - this.slider_height) / 2, left: 0, borderRadius: this.smile_height / 2 }}>
                  <Polygon
                    points={this.width_polygon.join(' ')}  //多边形的每个角的x和y坐标
                    fill="gray"     //填充颜色
                    stroke="transparent"   //外边框颜色
                    strokeWidth="0"   //外边框宽度
                  />
                </Svg>
                <View style={{ backgroundColor: 'transparent', height: this.smile_height, width: this.smile_width, position: 'absolute', left: this.state.smile_box_x }}>
                  <AntDesign name={'smileo'} size={50} style={{ color: this.state.smile_color }} />
                </View>
              </View>
              <View style={{ width: 400, height: 50, top: 10, left: 25, backgroundColor: 'transparent', position: 'absolute' }}
                {...this._panResponderDrawLine2.panHandlers} >
              </View>
              <Text style={{ fontSize: 20, color: 'purple', position: 'absolute', top: 55 }}>左移:</Text>
              <Text style={{ fontSize: 20, color: 'red', position: 'absolute', top: 55, left: 100 }}>{this.state.leftTxt}</Text>
              <Text style={{ fontSize: 20, color: 'purple', position: 'absolute', top: 75 }}>右移:</Text>
              <Text style={{ fontSize: 20, color: 'red', position: 'absolute', top: 75, left: 100 }}>{this.state.rightTxt}</Text>
            </View>
            <View style={{ width: 450, height: 300, backgroundColor: 'lime', marginLeft: 20, marginTop: 5 }}>
              <View style={{ width: 300, height: 300, backgroundColor: 'red', marginLeft: 50, marginTop: 0 }}>
                <View style={{ width: 300, height: 300, backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0 }}>
                  <Svg style={{ height: 300, width: 300, backgroundColor: 'orange', borderRadius: 50 }}>
                    <Circle
                      cx={this.circle_ring_x}
                      cy={this.circle_ring_y}
                      r={this.circle_ring_r}
                      strokeWidth="20"
                      stroke="white"
                      fill='transparent' />
                    {
                      this.state.rotate_svg_mat
                    }
                    <Circle
                      cx={this.circle_ring_x}
                      cy={this.circle_ring_y}
                      r={this.circle_ring_r + 10}
                      strokeWidth="3"
                      stroke="black"
                      fill='transparent' />
                    <Circle
                      cx={this.circle_ring_x}
                      cy={this.circle_ring_y}
                      r={this.circle_ring_r - 10}
                      strokeWidth="3"
                      stroke="black"
                      fill='transparent' />

                    <Circle
                      cx={this.state.cx}
                      cy={this.state.cy}
                      r={this.state.cr}
                      strokeWidth="2"
                      stroke="lime"
                      fill={this.state.cCorlor} />
                  </Svg>
                  <View style={{
                    height: (this.circle_ring_r - 12) * 2,
                    width: (this.circle_ring_r - 12) * 2,
                    backgroundColor: 'wheat',
                    position: 'absolute',
                    top: this.circle_ring_x - this.circle_ring_r + 12,
                    left: this.circle_ring_y - this.circle_ring_r + 12,
                    borderRadius: (this.circle_ring_r - 12)
                  }}>
                    {/* <Image style={{
                      width: (this.circle_ring_r - 12) * 2,
                      height: (this.circle_ring_r - 12) * 2,
                      backgroundColor: 'green', top: 0, left: 0, position: 'absolute',
                      borderRadius: (this.circle_ring_r - 12)
                    }}
                      source={require('./triangle.jpg')} /> */}
                  </View>
                  <View style={{ width: 140, height: 80, backgroundColor: 'transparent', top: 120, left: 80, position: 'absolute', alignContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, color: 'red', }}>{this.state.rotate_text}</Text>
                    <Text style={{ fontSize: 25, color: 'red', }}>{this.state.angele_text}</Text>
                  </View>
                </View>
                <View style={{
                  backgroundColor: 'wheat', height: 40, width: 40,
                  position: 'absolute',
                  left: this.state.cx - 20,
                  top: this.state.cy - 20,
                  borderRadius: 20,
                }}>
                  <AntDesign name={'smileo'} size={40} style={{
                    color: 'red',
                  }} />
                </View>

                <View style={{ width: 300, height: 300, backgroundColor: 'transparent', }}
                  {...this._panResponderRotatingDisk.panHandlers}>
                </View>

              </View>
            </View>
            <View style={{ width: 450, height: 200, backgroundColor: 'lime', marginLeft: 20, marginTop: 10 }}>
              <View style={{
                width: this.up_down_width + this.sign_width, height: this.smile_height, backgroundColor: 'orange',
                position: 'absolute', top: 60, left: 5
              }}>
                <Svg style={{
                  width: this.up_down_width, height: this.slider_height, backgroundColor: 'white',
                  top: (this.smile_height - this.slider_height) / 2, left: this.sign_width / 2,
                }}>
                  <Polygon
                    points={this.width_polygon.join(' ')}  //多边形的每个角的x和y坐标
                    fill="gray"     //填充颜色
                    stroke="transparent"   //外边框颜色
                    strokeWidth="0"   //外边框宽度
                  />
                  {
                    this.tick_mark_svg
                  }
                </Svg>
              </View>
              <View style={{ width: this.view_width, height: 50, top: 10, left: 5, }}>
                <View style={{
                  backgroundColor: 'orange', height: this.sign_height, width: this.sign_width,
                  position: 'absolute', left: this.state.sign_cx - this.sign_width * 0.5,
                }}>
                  {/* <AntDesign name={'smileo'} size={50} style={{ color: this.state.smile_color }} /> */}
                  <Image style={{
                    width: this.sign_width,
                    height: this.sign_height * 1.0,
                    // borderRadius: (this.circle_ring_r - 12)
                  }}
                    resizeMode='stretch' // contain, stretch,center 
                    source={require('./triangle.jpg')} />
                </View>
              </View>


              <View style={{ width: this.view_width, height: 50, top: 10, left: 5, backgroundColor: 'red', position: 'absolute', opacity: 0.5 }}
                {...this._panResponderSlider.panHandlers}>
              </View>
              <Text style={{ fontSize: 30, color: 'purple', position: 'absolute', top: 110 }}>上移:</Text>
              <Text style={{ fontSize: 30, color: 'red', position: 'absolute', top: 110, left: 100 }}>{this.state.upTxt}</Text>
              <Text style={{ fontSize: 30, color: 'purple', position: 'absolute', top: 140 }}>下移:</Text>
              <Text style={{ fontSize: 30, color: 'red', position: 'absolute', top: 140, left: 100 }}>{this.state.downTxt}</Text>
            </View>
          </View>

        </View>
      </View >

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
