/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, PanResponder, ART, ImageBackground, Modal, Dimensions, Platform,
  FlatList,
} from 'react-native'
// import Util from './common/util'
import Svg, { Line, Path, Rect, Polygon, Text as SText, Circle, Ellipse, Polyline } from "react-native-svg";
import _, { times } from 'lodash'
import PropTypes from 'prop-types';
import { MathGraphClass } from "./MathGraphModule.js"
import { pxToDp } from "../tools";

const log = console.log.bind(console)

let newgraphcls = new MathGraphClass()
class ScribblingPadModal extends Component {

  // 入参类型
  static propTypes = {
    visible: PropTypes.bool
  }

  // 默认值
  static defaultProps = {
    visible: false
  }

  constructor(props) {
    super(props);

    // 获取屏幕尺寸
    this.windowWidth = Dimensions.get('window').width
    this.windowHeight = Dimensions.get('window').height

    // 初始数据组
    this.stroke_width = 5  //线条宽度
    this.stroke_color = 'black'
    this.blank_view_color = 'white'   // 空白区域填充颜色
    // this.view_width = pxToDp(1410)
    this.view_width = "100%"
    // this.view_height = pxToDp(Platform.OS==="ios"? 1050: 800)
    this.view_height = "100%"
    this.choice_width_idx = 0
    this.eraser_flag = 0
    // this.eraser_choice_color = 'red'
    // 变量初始化
    this.temp_point_mat = []  // 当前绘制线条坐标
    this.temp_point_dict = {
      "stroke_color": 'black',    // 线条颜色
      "stroke_width": 5,          // 线条宽度
      "stroke_data": [],          // 线条数据
    }
    this.bezier_temp_mat = [] // 当前贝塞尔插值
    this.amend_point_mat = [] // 修正坐标点
    this.all_point_mat = []
    this.all_point_dict = []
    this.combine_locxy_mat = []
    this.stroke_svg_mat = []
    this.all_scribbling_mat = [[]] // 所有草稿历史数据
    this.scribbling_idx = 0
    this.init_eraser_dict = []  // 擦除数组初始索引
    this.eraser_squence_idx = [] // 擦除顺序索引
    this.temp_eraser_dict = []    // 临时擦除数据
    this.scribbling_svg_mat = []  // 当前画板笔画保存

    // 绘制区
    this.line_start_x = -1
    this.line_start_y = -1
    this.line_end_x = -1
    this.line_end_y = -1
    // 移动草稿纸---滚动
    this.scrollbar_start_x = -1
    this.scrollbar_start_y = -1
    this.scrollbar_end_x = -1
    this.scrollbar_end_y = -1
    this.fixed_scrollbar_x = 10
    this.fixed_scrollbar_y = 10
    this.scrollbar_loc_y = 0
    this.scrollbar_loc_x = 0
    // 工具区
    this.tool = "pen"
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
        this.temp_point_mat.push([this.line_start_x + this.scrollbar_x_loc_x, this.line_start_y + this.scrollbar_loc_y])
        if (this.eraser_flag % 2 === 1) {
          this.init_eraser_dict = _.cloneDeep(this.all_point_dict)
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log('移动响应==========================================evt.nativeEvent', evt.nativeEvent)
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // console.log('越界判定手指移动接触====111111111', evt.nativeEvent)
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        this.line_end_x = Math.round(pointX * 100) / 100
        this.line_end_y = Math.round(pointY * 100) / 100
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.line_end_x = page_x - this.div_page_x // 页面定义
        this.line_end_y = page_y - this.div_page_y
        // console.log('越界判定this.line_end_x', this.line_end_x, this.line_end_y)
        // 框选区域
        if (this.selected_area_flag === 1) {
          console.log('框选有区域')
          let rectangle_mat = [
            [this.line_start_x, this.line_start_y],
            [this.line_start_x, this.line_end_y],
            [this.line_end_x, this.line_end_y],
            [this.line_end_x, this.line_start_y]]
          let temp_svg = (<Polygon
            points={rectangle_mat.join(' ')}  //多边形的每个角的x和y坐标
            stroke='red'   //外边框颜色
            strokeWidth={5}   //外边框宽度
            fill='lime'     //填充颜色
            fillOpacity={0.5}
            strokeDasharray={[10, 10]}
          />)
          this.setState({
            draw_temp_svg: [temp_svg], // 绘制零时轨迹线
            // draw_all_svg: []
          })
        }
        else {
          this.temp_point_mat.push([this.line_end_x + this.scrollbar_x_loc_x, this.line_end_y + this.scrollbar_loc_y])
          // this.props._getData({ temp_data: this.temp_point_mat, all_data: this.all_point_mat })  // 返回传参
          // 绘制临时线
          if (this.eraser_flag % 2 === 0) {
            // 图形绘制
            let bezier_point_mat = []
            if (this.temp_point_mat.length > 3) {
              bezier_point_mat = this.createBezierCurve(this.temp_point_mat)
              // bezier_point_mat.splice(0, 1)
              // bezier_point_mat = this.temp_point_mat
            }
            else {
              bezier_point_mat = this.temp_point_mat
            }
            // let temp_svg_mat = this.DrawPointMat({ point_mat: this.temp_point_mat, stroke_width: this.stroke_width, stroke_color: this.stroke_color, })
            bezier_point_mat = this.DataMove2D(bezier_point_mat, [-this.scrollbar_x_loc_x, -this.scrollbar_loc_y])
            let temp_svg_mat = this.DrawPointMat({ point_mat: bezier_point_mat, stroke_width: this.stroke_width, stroke_color: this.stroke_color, })
            this.setState({
              draw_temp_svg: [temp_svg_mat], // 绘制零时轨迹线
              // draw_all_svg: []
            })
          }
          else {
            // 擦除判定
            let temp_svg_mat = this.DrawPointMat({ point_mat: this.temp_point_mat, stroke_width: 10, stroke_color: 'white', })
            // 判定与当前绘制数据的相交关系 this.all_point_dict
            let intersect_idx_mat = this.JudgeSingleMatIntersectionMultiMat(this.init_eraser_dict,
              [this.temp_point_mat[this.temp_point_mat.length - 2], this.temp_point_mat[this.temp_point_mat.length - 1]]
            )
            this.eraser_squence_idx = this.getIdxSquenceMat(this.eraser_squence_idx, intersect_idx_mat)
            console.log('相交顺序索引', this.eraser_squence_idx)
            // this.temp_eraser_dict = this.getTempEraserDict(this.init_eraser_dict, this.eraser_squence_idx)    // 临时擦除数据
            this.init_eraser_dict = this.getTempEraserDict(this.init_eraser_dict, intersect_idx_mat)    // 临时擦除数据
            console.log('选择草稿--this.init_eraser_dict', this.init_eraser_dict)
            this.temp_eraser_dict = _.cloneDeep(this.init_eraser_dict)
            let draw_all_svg_mat = this.DrawAllPointDict(this.init_eraser_dict)
            this.scribbling_svg_mat = _.cloneDeep(draw_all_svg_mat)
            this.setState({
              draw_temp_svg: [temp_svg_mat], // 绘制零时轨迹线
              draw_all_svg: [draw_all_svg_mat]
            })
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        console.log('渲染点击点', this.line_start_x, this.line_start_y)
        if (this.selected_area_flag === 1) {
          console.log('框选有区域')
          Alert.alert('标题内容', '正文内容',
            [
              // { text: "选项一", onPress: this.opntionSelected(1) },
              // { text: "选项二", onPress: this.opntionSelected(2) },
              { text: "确认", onPress: () => this.opntionSelected(1) },
              { text: "重选", onPress: () => this.opntionSelected(2) },
            ]
          );


        }
        else {
          // 擦除与绘制
          if (this.eraser_flag % 2 === 0) {
            // 绘制添加
            // 添加数据判定---是否绘制不同的颜色和返回值
            let bezier_point_mat = []
            if (this.temp_point_mat.length > 3) {
              bezier_point_mat = this.createBezierCurve(this.temp_point_mat)
              // bezier_point_mat.splice(0, 1)
            }
            else {
              bezier_point_mat = this.temp_point_mat
            }

            let part_stroke_svg = this.DrawPointMat({
              // point_mat: this.temp_point_mat,
              point_mat: this.DataMove2D(bezier_point_mat, [-this.scrollbar_x_loc_x, -this.scrollbar_loc_y]),   // 贝塞尔
              stroke_width: this.stroke_width,
              stroke_color: this.stroke_color,
            })
            this.all_point_dict.push({
              "stroke_color": this.stroke_color,    // 线条颜色
              "stroke_width": this.stroke_width,          // 线条宽度
              "stroke_data": this.temp_point_mat,          // 线条数据
              "bezier_data": bezier_point_mat,          // bezier线条数据
              "stroke_svg": part_stroke_svg,
            })
            // 保存对应草稿数据
            this.all_scribbling_mat[this.scribbling_idx] = _.cloneDeep(this.all_point_dict)
            // 渲染全局数据
            // let draw_all_svg_mat = this.DrawAllPointMat({ all_point_mat: this.all_point_mat, stroke_color: 'black', fill_color: 'black', stroke_width: 5 })
            // let draw_all_svg_mat = this.DrawAllPointDict(this.all_point_dict)
            this.scribbling_svg_mat.push(part_stroke_svg)
            //
            this.temp_point_mat = [] // 释放更新
            // this.props._getData({ temp_data: this.temp_point_mat, all_data: this.all_point_mat })  // 返回传参、
            let move_all_data = this.AllLineMoveScrollData(this.all_point_dict, [-this.scrollbar_x_loc_x, -this.scrollbar_loc_y])
            let move_all_svg_mat = this.DrawAllPointDict(move_all_data)
            this.setState({
              draw_temp_svg: [],
              draw_all_svg: move_all_svg_mat
            })
          }
          else {
            // 擦除释放渲染
            let draw_all_svg_mat = this.DrawAllPointDict(this.temp_eraser_dict)
            //
            this.temp_point_mat = [] // 释放更新
            // this.props._getData({ temp_data: this.temp_point_mat, all_data: this.all_point_mat })  // 返回传参、
            this.setState({
              draw_temp_svg: [],
              draw_all_svg: [draw_all_svg_mat]
            })
            // 擦除数据
            this.all_point_dict = _.cloneDeep(this.temp_eraser_dict)
            console.log('选择草稿--this.temp_eraser_dict', this.temp_eraser_dict)
            this.all_scribbling_mat[this.scribbling_idx] = this.all_point_dict
            this.eraser_squence_idx = []
          }
        }
        this.init_eraser_dict = []
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

    // 窗口移动定义
    this.pad_start_x = -1
    this.pad_start_y = -1
    this.pad_end_x = -1
    this.pad_end_y = -1
    // this.fixed_pad_x = (this.windowWidth / 2.0) - (1050 / 2.0) - (Platform.OS==="ios"? 0: 100)
    // this.fixed_pad_y = (this.windowHeight / 2.0) - (580 / 2.0) - 30
    this.fixed_pad_x = pxToDp(60)
    this.fixed_pad_y = pxToDp(70)
    this._panResponderMovePad = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        console.log('手指开始接触====草稿窗口', evt.nativeEvent)
        // let tempfirstX = evt.nativeEvent.pageX     // 页面坐标
        // let tempFirstY = evt.nativeEvent.pageY
        let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
        let tempFirstY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.pad_start_x = Math.round(tempfirstX * 100) / 100
        this.pad_start_y = Math.round(tempFirstY * 100) / 100
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100     // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100
        this.setState({
          move_pad_color: 'red',
          drag_btn_opacity: 0.5,
        })
      },


      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        console.log('草稿窗口移动', evt.nativeEvent)
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.pad_end_x = page_x - this.div_page_x // 页面定义
        this.pad_end_y = page_y - this.div_page_y
        let x = this.fixed_pad_x + (this.pad_end_x - this.pad_start_x)
        let y = this.fixed_pad_y + (this.pad_end_y - this.pad_start_y)
        const limitY = pxToDp(40)
        // 防止超出屏幕上限
        if (y < limitY) {
          y = limitY
        }
        if (x > pxToDp(200)) {
          x = pxToDp(200)
        }
        this.setState({
          // draw_temp_svg: [temp_svg_mat], // 绘制零时轨迹线
          // draw_temp_svg: amend_svg_mat, // 绘制零时轨迹线
          scribbling_x: x,
          scribbling_y: y,
          drag_btn_opacity: 0.5,
        })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // this.all_point_mat.push(this.amend_point_mat)
        // 添加数据判定---是否绘制不同的颜色和返回值
        this.fixed_pad_x += (this.pad_end_x - this.pad_start_x)
        this.fixed_pad_y += (this.pad_end_y - this.pad_start_y)
        this.setState({
          move_pad_color: 'gray',
          drag_btn_opacity: 1,
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

    // 移动草稿纸---滚动
    this.scrollbar_start_x = -1
    this.scrollbar_start_y = -1
    this.scrollbar_end_x = -1
    this.scrollbar_end_y = -1
    this.fixed_scrollbar_x = 10
    this.fixed_scrollbar_y = 10
    this.scrollbar_loc_y = 0
    this.scrollbar_loc_x = 0

    this._panResponderMoveScrollbarY = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        console.log('手指开始接触this.scrollbar_loc_y', evt.nativeEvent, this.scrollbar_loc_y)
        // let tempfirstX = evt.nativeEvent.pageX     // 页面坐标
        // let tempFirstY = evt.nativeEvent.pageY
        let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
        let tempFirstY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.scrollbar_start_x = Math.round(tempfirstX * 100) / 100
        this.scrollbar_start_y = Math.round(tempFirstY * 100) / 100
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100     // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100
        if (this.scrollbar_start_y >= (this.scrollbar_loc_y) && this.scrollbar_start_y <= (this.scrollbar_loc_y + 100)) {
          this.setState({
            move_scrollbar_y_color: '#afdef3',
          })
        }
        console.log('触摸========', this.scrollbar_start_y, this.scrollbar_loc_y, evt.nativeEvent)
      },


      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // console.log('草稿窗口移动', evt.nativeEvent)
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.scrollbar_end_x = page_x - this.div_page_x // 页面定义
        this.scrollbar_end_y = page_y - this.div_page_y
        if (this.scrollbar_start_y >= (this.scrollbar_loc_y) && this.scrollbar_start_y <= (this.scrollbar_loc_y + 100)) {
          if (this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y) >= 0
            && (this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y) + 100) <= 530) {
            // 更新计算坐标绘制值
            // console.log('触摸', this.all_point_dict)
            let temp_all_point_dict = _.cloneDeep(this.all_point_dict)
            //  this.MoveAllGraphData(all_line_data, [0, -(this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y))])
            for (let idx = 0; idx < this.all_point_dict.length; idx++) {
              let move_line_data = this.DataMove2D(this.all_point_dict[idx].bezier_data, [-this.scrollbar_x_loc_x, -(this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y))]) // 单笔保存
              temp_all_point_dict[idx].bezier_data = move_line_data
            }
            // console.log('触摸temp_all_point_dict', temp_all_point_dict)
            // 笔画移动
            let all_svg_mat = this.DrawAllPointDict(temp_all_point_dict)
            // console.log('触摸all_svg_mat', all_svg_mat)
            let y = this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y)
            if (Platform.OS === "ios" && y > pxToDp(910 - 100)) {
              y = pxToDp(910 - 100)
            }
            if (Platform.OS !== "ios" && y > pxToDp(695 - 100)) {
              y = pxToDp(695 - 100)
            }
            this.setState({
              move_scrollbar_y_color: '#afdef3',
              scrollbar_loc_y: y,
              draw_all_svg: all_svg_mat,
              // temp_svg_mat: all_svg_mat,
            })
          }
        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // this.all_point_mat.push(this.amend_point_mat)
        // 添加数据判定---是否绘制不同的颜色和返回值
        // this.scrollbar_loc_y += (this.scrollbar_end_y - this.scrollbar_start_y)
        console.log('触摸', this.state.scrollbar_loc_y)
        this.scrollbar_loc_y = this.state.scrollbar_loc_y
        this.setState({
          move_scrollbar_color: 'gray',
          move_scrollbar_y_color: '#dcdcdc'
          // scrollbar_loc_y: this.scrollbar_loc_y
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

    this.scrollbar_x_start_x = -1
    this.scrollbar_x_start_y = -1
    this.scrollbar_x_end_x = -1
    this.scrollbar_x_end_y = -1
    this.fixed_scrollbar_x_x = 10
    this.fixed_scrollbar_x_y = 10
    this.scrollbar_x_loc_y = 0
    this.scrollbar_x_loc_x = 0
    this._panResponderMoveScrollbarX = PanResponder.create({
      //创建手势 X
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        console.log('手指开始接触this.scrollbar_loc_y', evt.nativeEvent, this.scrollbar_loc_y)
        // let tempfirstX = evt.nativeEvent.pageX     // 页面坐标
        // let tempFirstY = evt.nativeEvent.pageY
        let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
        let tempFirstY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.scrollbar_x_start_x = Math.round(tempfirstX * 100) / 100
        this.scrollbar_x_start_y = Math.round(tempFirstY * 100) / 100
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100     // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100
        if (this.scrollbar_x_start_x >= (this.scrollbar_x_loc_x) && this.scrollbar_x_start_x <= (this.scrollbar_x_loc_x + 100)) {
          this.setState({
            move_scrollbar_x_color: '#afdef3'
          })
        }
        console.log('触摸========', this.scrollbar_start_x, this.scrollbar_loc_x, evt.nativeEvent)
      },


      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // console.log('草稿窗口移动', evt.nativeEvent)
        let pointX = evt.nativeEvent.locationX
        let pointY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.scrollbar_x_end_x = page_x - this.div_page_x // 页面定义
        this.scrollbar_x_end_y = page_y - this.div_page_y
        if (this.scrollbar_x_start_x >= (this.scrollbar_x_loc_x) && this.scrollbar_x_start_x <= (this.scrollbar_x_loc_x + 100)) {
          if (this.scrollbar_x_loc_x + (this.scrollbar_x_end_x - this.scrollbar_x_start_x) >= 0
            && (this.scrollbar_x_loc_x + (this.scrollbar_x_end_x - this.scrollbar_x_start_x) + 100) <= pxToDp(1400)) {
            // 更新计算坐标绘制值
            // console.log('触摸', this.all_point_dict)
            let temp_all_point_dict = _.cloneDeep(this.all_point_dict)
            //  this.MoveAllGraphData(all_line_data, [0, -(this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y))])
            for (let idx = 0; idx < this.all_point_dict.length; idx++) {
              let move_line_data = this.DataMove2D(
                this.all_point_dict[idx].bezier_data,
                [-(this.scrollbar_x_loc_x + (this.scrollbar_x_end_x - this.scrollbar_x_start_x)), -(this.scrollbar_loc_y)]) // 单笔保存
              temp_all_point_dict[idx].bezier_data = move_line_data
            }
            // console.log('触摸temp_all_point_dict', temp_all_point_dict)
            // 笔画移动
            let all_svg_mat = this.DrawAllPointDict(temp_all_point_dict)
            let x = this.scrollbar_x_loc_x + (this.scrollbar_x_end_x - this.scrollbar_x_start_x)
            if (Platform.OS === "ios" && x > pxToDp(1300 - 100)) {
              x = pxToDp(1300 - 100)
            }
            // console.log('触摸all_svg_mat', all_svg_mat)
            this.setState({
              move_scrollbar_x_color: '#afdef3',
              scrollbar_loc_x: x,
              draw_all_svg: all_svg_mat,
              // temp_svg_mat: all_svg_mat,
            })
          }
        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // this.all_point_mat.push(this.amend_point_mat)
        // 添加数据判定---是否绘制不同的颜色和返回值
        // this.scrollbar_loc_y += (this.scrollbar_end_y - this.scrollbar_start_y)
        console.log('触摸', this.state.scrollbar_loc_x)
        this.scrollbar_x_loc_x = this.state.scrollbar_loc_x
        this.setState({
          move_scrollbar_x_color: '#dcdcdc',
          // scrollbar_loc_y: this.scrollbar_loc_y
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

    // 草稿窗口组展示
    this.scribbling_view_mat = []
    this.ScribblingView()
    // 更新组
    this.state = {
      // drawPath: 'M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25'
      drawPath: '',                 // 绘制轨迹
      draw_all_svg: [],              // 全局线条绘制
      draw_temp_svg: [],            // 临时轨迹线
      modalVisible: this.props.visible, // 弹窗显隐
      scribbling_x: this.fixed_pad_x,
      scribbling_y: this.fixed_pad_y,
      move_pad_color: 'gray', //窗口移动区颜色
      drag_btn_opacity: 1,
      eraser_btn_opacity: 1,
      draftNameList: ["草稿1", "+"],

      recognize_str: '', // 字符串识别
      move_scrollbar_x_color: '#dcdcdc',
      move_scrollbar_y_color: '#dcdcdc',
      scrollbar_loc_y: 0,
      scrollbar_loc_x: 0,
    }

  }
  componentWillMount() {
    // 初始化渲染
    // 引用类计算
    // this.CombinePinYinView()// 组合拼音字符串数据
  }

  componentDidMount() {
    // console.log('后渲染')
  }

  DataMove2D = (old_data, move_mat) => {
    /**
     * @description 2维数据坐标点移动
     * @param old_data 原数组[[x0,y0],[x1,y1],...]
     * @param move_mat 移动长度[move_x,move_y]
     * @return 返回移动后的坐标数据点组
     */
    let new_data = []
    console.log('old_data', old_data)
    for (let idx = 0; idx < old_data.length; idx++) {
      // console.log('线条', JSON.stringify(old_data[idx]))
      new_data.push([old_data[idx][0] + move_mat[0], old_data[idx][1] + move_mat[1]])
    }
    return new_data
  }

  CombineRegion = (frame_mat) => {
    // 外形框组合区域
    let [min_x, max_x, min_y, max_y] = [100000, -1000000, 1000000, -1000000]
    for (let line_idx = 0; line_idx < frame_mat.length; line_idx++) {
      // 单条
      let part_stick = frame_mat[line_idx]
      let [part_min_x, part_max_x, part_min_y, part_max_y] = this.LineRegion(part_stick)
      if (part_min_x < min_x) {
        min_x = part_min_x
      }
      if (part_max_x > max_x) {
        max_x = part_max_x
      }
      if (part_min_y < min_y) {
        min_y = part_min_y
      }
      if (part_max_y > max_y) {
        max_y = part_max_y
      }
    }
    return [min_x, max_x, min_y, max_y]
  }

  LineRegion = (line_data) => {
    // 线条区域
    let [min_x, max_x, min_y, max_y] = [100000, -1000000, 1000000, -1000000]
    for (let idx = 0; idx < line_data.length; idx++) {
      if (line_data[idx][0] < min_x) {
        min_x = line_data[idx][0]
      }
      if (line_data[idx][0] > max_x) {
        max_x = line_data[idx][0]
      }
      if (line_data[idx][1] < min_y) {
        min_y = line_data[idx][1]
      }
      if (line_data[idx][1] > max_y) {
        max_y = line_data[idx][1]
      }
    }
    return [min_x, max_x, min_y, max_y]
  }

  // 该钩子函数表示当父组件的props入参改变时调用，常用于父组件入参变化影响子组件渲染
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ modalVisible: newProps.visible });
  }

  AllLineMoveScrollData = (all_line_data, move_data) => {
    let temp_all_point_dict = _.cloneDeep(all_line_data)
    //  this.MoveAllGraphData(all_line_data, [0, -(this.scrollbar_loc_y + (this.scrollbar_end_y - this.scrollbar_start_y))])
    for (let idx = 0; idx < this.all_point_dict.length; idx++) {
      let move_line_data = this.DataMove2D(all_line_data[idx].bezier_data, move_data) // 单笔保存
      temp_all_point_dict[idx].bezier_data = move_line_data
    }
    return temp_all_point_dict
  }

  cancelModal() {
    this.setState({ modalVisible: false });
  }

  getIdxSquenceMat = (old_squence_mat, judge_squence_mat) => {
    /**
     * @description 判定索引顺序数组
     * @param old_squence_mat  旧顺序数组
     * @param judge_squence_mat 待判定组
     */
    for (let idx = 0; idx < judge_squence_mat.length; idx++) {
      if (old_squence_mat.indexOf(judge_squence_mat[idx]) < 0) {
        old_squence_mat.push(judge_squence_mat[idx])
      }
    }
    return old_squence_mat
  }

  getTempEraserDict = (scribbling_data, erase_idx_mat) => {
    /**
     * @
     */
    let temp_scribbling_data = []
    for (let idx = 0; idx < scribbling_data.length; idx++) {
      if (erase_idx_mat.indexOf(idx) < 0) {
        temp_scribbling_data.push(scribbling_data[idx])
      }
    }
    return temp_scribbling_data
  }

  DrawPointMat = ({ point_mat, stroke_color = 'red', stroke_width = 8, fill_color = 'none', stroke_opacity = 1 }) => {
    /**
     * @description 绘制点矩阵数据
     * @param point_mat 点阵：[[img_x0,img_y0],[img_x1,img_y1],....]
     */
    // bezier 贝塞尔曲线插值
    let bezier_point_mat = point_mat
    let point_svg_mat = []
    // 绘制贝塞尔插值曲线
    point_svg_mat.push(
      <Polyline
        points={bezier_point_mat.join(' ')}  //多段线的各个点
        // points={point_mat.join(' ')}  //多段线的各个点
        stroke={stroke_color}  //填充颜色
        strokeWidth={stroke_width}  //填充宽度
      />)
    // 单组渲染
    // for (let idx = 0; idx < bezier_point_mat.length; idx++) {
    //   // 画线
    //   if (idx > 0) {
    //     point_svg_mat.push(<Line
    //       x1={bezier_point_mat[idx - 1][0]}   // x轴的开始位置
    //       y1={bezier_point_mat[idx - 1][1]}   // y轴的开始位置
    //       x2={bezier_point_mat[idx][0]}   // x轴的结束位置
    //       y2={bezier_point_mat[idx][1]}   // y轴的结束位置
    //       stroke={stroke_color}  //填充颜色
    //       strokeWidth={stroke_width}  //填充宽度
    //     // strokeDasharray={dash_mat}
    //     // strokeOpacity={stroke_opacity}  // 线条透明度
    //     />)
    //   }
    // }
    // 单点测试
    // for (let idx = 0; idx < bezier_point_mat.length; idx++) {
    //   // 绘制单点
    //   point_svg_mat.push(<Circle
    //     cx={bezier_point_mat[idx][0]}   //x轴的开始位置
    //     cy={bezier_point_mat[idx][1]}  //y轴的开始位置
    //     r={stroke_width / 2}    //半径
    //     fill={stroke_color}   //填充颜色
    //   // strokeWidth={stroke_width}  //外边框 宽度
    //   // stroke={stroke_color}　　//外边框 颜色　　
    //   />)
    // }
    // for (let idx = 0; idx < point_mat.length; idx++) {
    //   // 绘制单点
    //   point_svg_mat.push(<Circle
    //     cx={point_mat[idx][0]}   //x轴的开始位置
    //     cy={point_mat[idx][1]}  //y轴的开始位置
    //     r={stroke_width / 2}    //半径
    //     fill='lime'   //填充颜色
    //   // strokeWidth={stroke_width}  //外边框 宽度
    //   // stroke={stroke_color}　　//外边框 颜色　　
    //   />)
    // }
    return point_svg_mat

  }
  DrawAllPointMat = ({ all_point_mat, stroke_color = 'red', stroke_width = 8, fill_color = 'none', stroke_opacity = 1 }) => {
    /**
     * @description 绘制所有数据 点矩阵
     * @param all_point_mat 点阵：[[[img_x0,img_y0],[img_x1,img_y1],....],[[img_x0,img_y0],[img_x1,img_y1],....],...]
     */
    let all_point_svg_mat = []
    for (let idx = 0; idx < all_point_mat.length; idx++) {
      //
      all_point_svg_mat.push(this.DrawPointMat({
        point_mat: all_point_mat[idx],
        stroke_width: stroke_width,
        stroke_color: stroke_color,
        fill_color: fill_color,
      }))
    }
    return all_point_svg_mat
  }
  DrawAllPointDict = (all_point_dict) => {
    /**
     * @description 绘制所有数据 点矩阵
     * @param all_point_mat 点阵：[[[img_x0,img_y0],[img_x1,img_y1],....],[[img_x0,img_y0],[img_x1,img_y1],....],...]
     */
    let all_point_svg_mat = []
    for (let idx = 0; idx < all_point_dict.length; idx++) {
      // "stroke_color": 'black',    // 线条颜色
      // "stroke_width": 5,          // 线条宽度
      // "stroke_data": [],          // 线条数据
      all_point_svg_mat.push(this.DrawPointMat({
        // point_mat: all_point_dict[idx].stroke_data,
        point_mat: all_point_dict[idx].bezier_data,   // 贝塞尔
        stroke_width: all_point_dict[idx].stroke_width,
        stroke_color: all_point_dict[idx].stroke_color,
      }))
    }
    return all_point_svg_mat
  }
  DrawPointPath = (point_mat) => {
    /**
     * @description 绘制点路径
     */
    let path_str = ''
    for (let idx = 0; idx < point_mat.length; idx++) {
      if (idx === 0) {
        //
        path_str += 'M' + point_mat[idx][0] + ' ' + point_mat[idx][1]
      }
      else {
        //
        path_str += 'L' + point_mat[idx][0] + ' ' + point_mat[idx][1]

      }
    }
    return (
      <Path
        d={path_str}
        fill="none"
        stroke="red"
        strokeWidth={4}
      />)
  }
  NewData = () => {
    /**
     * @description 新建图---保留原始草稿数据
     */
    log("click here add new data...： ", this.all_scribbling_mat.length, this.all_scribbling_mat)
    this.scribbling_idx = this.all_scribbling_mat.length - 1
    if (this.all_scribbling_mat[this.all_scribbling_mat.length - 1].length > 0) { // 最后一个草稿数据
      log("will add new data...")
      // if (this.all_point_dict.length > 0) {
      this.all_scribbling_mat.push([])
      this.scribbling_idx = this.all_scribbling_mat.length - 1
    }
    // const t = this.all_scribbling_mat.filter(item => item.length !== 0)
    const newDaftList = this.all_scribbling_mat.map((item, index) => `草稿${index + 1}`)
    // newDaftList.pop()
    log("newDaftList: ", newDaftList)
    // newDaftList.pop()
    this.all_point_dict = []
    this.ScribblingView()
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [],
      draftNameList: [...newDaftList, "+"],
    })
  }

  RollbackData = () => {
    /**
     * @description 回退一组数据
     */
    this.all_point_dict.pop()
    this.all_scribbling_mat[this.scribbling_idx] = this.all_point_dict
    let draw_all_svg_mat = this.DrawAllPointDict(this.all_point_dict)
    //
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [draw_all_svg_mat]
    })
  }

  CleanData = () => {
    /**
     * @description 清空数据
     */
    this.all_point_dict = []
    this.all_scribbling_mat[this.scribbling_idx] = this.all_point_dict
    //
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [],
    })
  }

  EraserData = (flag) => {
    /**
     * @description 橡皮擦清楚单条数据
     */
    // 偶数画
    this.eraser_flag = flag
    let newOpacity = 1
    const { eraser_btn_opacity } = this.state
    if (eraser_btn_opacity === 1) {
      newOpacity = 0.3
    }
    this.setState({ eraser_btn_opacity: newOpacity })
  }

  CloseWindow = () => {
    // this.all_point_mat = [] // 是否保留数据
    this.props.toggleEvent()
    this.setState({
      modalVisible: false,
      // draw_temp_svg: [], // 是否保留数据
      // draw_all_svg: [], // 是否保留数据
    })
  }

  StrokeColor = (color_str) => {
    /**
     * @description 绘笔颜色
     */
    this.stroke_color = color_str
    this.setState({})
  }

  StrokeWidth = (stroke_width) => {
    /**
     * @description 绘笔大小
     */
    this.stroke_width = stroke_width
    this.choice_width_idx = stroke_width / 5 - 1
    this.setState({})
  }

  LastData = () => {
    /**
     * @description 上一组草稿
     */
    if (this.all_scribbling_mat.length > 0) {
      // 存在历史草稿数据
      if (this.scribbling_idx >= 1) {
        this.scribbling_idx -= 1
        let last_scribbling_mat = this.all_scribbling_mat[this.scribbling_idx]
        let draw_all_svg_mat = this.DrawAllPointDict(last_scribbling_mat)
        //
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat]
        })

      }
      else {
        alert('无更早草稿')
      }
    }
    else {
      alert('无历史草稿')
    }
    this.ScribblingView()
  }

  NextData = () => {
    /**
     * @description 下一组草稿
     */
    if (this.all_scribbling_mat.length > 0) {
      // 存在历史草稿数据
      if (this.scribbling_idx < this.all_scribbling_mat.length - 1) {
        this.scribbling_idx += 1
        let last_scribbling_mat = this.all_scribbling_mat[this.scribbling_idx]
        let draw_all_svg_mat = this.DrawAllPointDict(last_scribbling_mat)
        //
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat]
        })

      }
      else if (this.scribbling_idx === this.all_scribbling_mat.length - 1) {
        // 已读取完历史草稿
        this.scribbling_idx += 1
        let draw_all_svg_mat = this.DrawAllPointDict(this.all_point_dict)
        //
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat]
        })
      }
      else {
        alert('当前为最新草稿')
      }
    }
    else {
      alert('当前为最新草稿')
    }
    this.ScribblingView()
  }

  JudgeSingleMatIntersectionMultiMat = (init_scribbling_data, eraser_data) => {
    /**
     * @description 判定单组绘制曲线与所有曲线相交情况并更新
     * @param init_scribbling_data 初始草稿所有数据
     * @param eraser_data 橡皮擦数据
     */
    let intersection_idx_mat = []
    for (let idx = 0; idx < init_scribbling_data.length; idx++) {
      // 单组
      if (this.JudgeSingleMatIntersectionSingleMat(init_scribbling_data[idx].stroke_data, eraser_data) >= 0) {
        console.log('删除相交索引', idx)
        intersection_idx_mat.push(idx)
      }
    }
    console.log('所用相交索引', intersection_idx_mat)
    return intersection_idx_mat
  }
  JudgeSingleMatIntersectionSingleMat = (scribbling_data, eraser_data) => {
    /**
     * @description 判定单组绘制曲线与所有曲线相交情况并更新
     * @param scribbling_data 草稿单组数据
     * @param eraser_data 橡皮擦数据
     */
    for (let scribble_idx = 0; scribble_idx < scribbling_data.length - 1; scribble_idx++) {
      for (let eraser_idx = 0; eraser_idx < eraser_data.length - 1; eraser_idx++) {
        let line_data_a = [scribbling_data[scribble_idx], scribbling_data[scribble_idx + 1]]
        let line_data_b = [eraser_data[eraser_idx], eraser_data[eraser_idx + 1]]
        if (newgraphcls.JudgeLineIntersectionLoc(line_data_a, line_data_b).length === 3) {
          // 实交点
          return scribble_idx
        }
      }
    }

    return -1
  }

  ScribblingView = () => {
    /**
     * @description 画布窗口展示
     */
    this.scribbling_view_mat = []
    for (let idx = 0; idx < this.all_scribbling_mat.length; idx++) {
      let scribble_name = '草稿' + idx
      this.scribbling_view_mat.push(
        <View style={{ backgroundColor: idx === this.scribbling_idx ? 'red' : 'white', opacity: 1, marginLeft: 5 }}>
          <TouchableOpacity onPress={() => this.ChoiceScribblingView(idx)}>
            <Text style={{ fontSize: 25 }}>{scribble_name}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  ChoiceScribblingView = (scribbling_idx) => {
    /**
     * @description 点选索引草稿本
     */
    this.scribbling_idx = scribbling_idx
    console.log('草稿索引选择', scribbling_idx)
    let choice_scribbling_mat = this.all_scribbling_mat[this.scribbling_idx] // 当前选择草稿
    this.all_point_dict = _.cloneDeep(choice_scribbling_mat)
    let draw_all_svg_mat = this.DrawAllPointDict(choice_scribbling_mat)
    // this.ScribblingView()
    //
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [draw_all_svg_mat]
    })
  }

  DeleteData = () => {
    /**
     * @description 删除当前选择草稿
     */
    console.log('删除草稿', this.scribbling_idx, this.all_scribbling_mat.length)
    if (this.all_scribbling_mat.length > 1) {
      // 存在多个草稿本可删除
      if (this.scribbling_idx == this.all_scribbling_mat.length - 1) {
        // 当前展示为新建草稿窗口--最后一组
        console.log('删除草稿')
        this.all_point_dict = _.cloneDeep(this.all_scribbling_mat[this.scribbling_idx - 1]) // 更新单草稿数据
        this.scribbling_idx -= 1
        this.all_scribbling_mat.pop()
        let draw_all_svg_mat = this.DrawAllPointDict(this.all_point_dict)
        const newDaftList = this.all_scribbling_mat.map((item, index) => `草稿${index + 1}`)
        // newDaftList.pop()
        this.ScribblingView()
        //
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat],
          draftNameList: [...newDaftList, "+"],
        })
      }
      else {
        // 删除已存在草稿---展示当前
        this.all_point_dict = _.cloneDeep(this.all_scribbling_mat[this.scribbling_idx + 1]) // 更新单草稿数据
        this.all_scribbling_mat.splice(this.scribbling_idx, 1)
        console.log("after delete: ", this.all_scribbling_mat.length, this.all_scribbling_mat)
        let draw_all_svg_mat = this.DrawAllPointDict(this.all_point_dict)
        const newDaftList = this.all_scribbling_mat.map((item, index) => `草稿${index + 1}`)
        // newDaftList.pop()
        this.ScribblingView()
        //
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat],
          draftNameList: [...newDaftList, "+"],
        })
      }
    }
  }

  createBezierCurve = (originPoint) => {
    //控制点收缩系数 ，经调试0.6较好
    let option = []
    option.pointsPerSeg = 3
    let scale = option.tension || 0.9;
    //平滑插值插入的最大点数
    let maxpoints = option.pointsPerSeg
    let originCount = originPoint.length
    let curvePoint = []
    let midpoints = []
    //生成中点
    for (let i = 0; i < originCount - 1; i++) {
      midpoints.push([
        (originPoint[i][0] + originPoint[i + 1][0]) / 2.0,
        (originPoint[i][1] + originPoint[i + 1][1]) / 2.0
      ])
    }
    // console.log('中点', midpoints)
    //平移中点
    let extrapoints = []
    for (let i = 1; i < originCount - 1; i++) {
      let backi = i - 1;
      let midinmid = [
        (midpoints[i][0] + midpoints[backi][0]) / 2.0,
        (midpoints[i][1] + midpoints[backi][1]) / 2.0
      ]
      let offsetx = originPoint[i][0] - midinmid[0];
      let offsety = originPoint[i][1] - midinmid[1];
      let extraindex = 2 * i;
      extrapoints[extraindex] = [
        midpoints[backi][0] + offsetx,
        midpoints[backi][1] + offsety
      ]
      //朝 originPoint[i]方向收缩
      let addx = (extrapoints[extraindex][0] - originPoint[i][0]) * scale;
      let addy = (extrapoints[extraindex][1] - originPoint[i][1]) * scale;
      extrapoints[extraindex] = [
        originPoint[i][0] + addx,
        originPoint[i][1] + addy
      ]
      let extranexti = extraindex + 1;
      extrapoints[extranexti] = [
        midpoints[i][0] + offsetx,
        midpoints[i][1] + offsety
      ]
      //朝 originPoint[i]方向收缩
      addx = (extrapoints[extranexti][0] - originPoint[i][0]) * scale;
      addy = (extrapoints[extranexti][1] - originPoint[i][1]) * scale;
      extrapoints[extranexti] = [
        originPoint[i][0] + addx,
        originPoint[i][1] + addy
      ]
    }
    // console.log('平移中点', extrapoints)
    // 新增平移中点
    let controlPoint = []
    //生成4控制点，产生贝塞尔曲线
    for (let i = 0; i < originCount - 1; i++) {
      if (i == 0) {
        // 二次样条
        // console.log('头')
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2;            // 新增控制点
        controlPoint[1] = extrapoints[extraindex];
        let nexti = i + 1;
        controlPoint[2] = originPoint[nexti];  // 已知固定点
        // console.log('头控制点controlPoint', controlPoint)
        let fn = this.bezier2func
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      }
      else if (i == originCount - 2) {
        // console.log('尾')
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2 * i;            // 新增控制点
        controlPoint[1] = extrapoints[extraindex + 1];
        let nexti = i + 1;
        controlPoint[2] = originPoint[nexti];  // 已知固定点
        // console.log('尾控制点controlPoint', controlPoint)
        let fn = this.bezier2func
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      }
      else {
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2 * i;            // 新增控制点
        controlPoint[1] = extrapoints[extraindex + 1];
        let extranexti = extraindex + 2;
        controlPoint[2] = extrapoints[extranexti];
        let nexti = i + 1;
        controlPoint[3] = originPoint[nexti];  // 已知固定点
        // console.log('控制点controlPoint', controlPoint)
        let fn = this.bezier3func;
        // let fn = this.bezier3func;
        let cp = this.intersects(controlPoint.slice(0, 2), controlPoint.slice(-2))
        if (cp && this.isContains(controlPoint[0], controlPoint[1], cp)) {
          controlPoint[1] = cp
        }

        if (cp && this.isContains(controlPoint[2], controlPoint[3], cp)) {
          controlPoint[2] = cp
        }
        if (controlPoint[1][0] == controlPoint[2][0] && controlPoint[1][1] == controlPoint[2][1]) {
          fn = this.bezier2func
          controlPoint.splice(1, 1)
        }
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      }
    }
    return curvePoint
  }
  //三次贝塞尔曲线
  bezier3func = (uu, controlP) => {
    let partX0 = controlP[0][0] * uu * uu * uu;
    let partX1 = 3 * controlP[1][0] * uu * uu * (1 - uu);
    let partX2 = 3 * controlP[2][0] * uu * (1 - uu) * (1 - uu);
    let partX3 = controlP[3][0] * (1 - uu) * (1 - uu) * (1 - uu);
    let partX = partX0 + partX1 + partX2 + partX3;
    let partY0 = controlP[0][1] * uu * uu * uu;
    let partY1 = 3 * controlP[1][1] * uu * uu * (1 - uu);
    let partY2 = 3 * controlP[2][1] * uu * (1 - uu) * (1 - uu);
    let partY3 = controlP[3][1] * (1 - uu) * (1 - uu) * (1 - uu);
    let partY = partY0 + partY1 + partY2 + partY3;
    return [partX, partY]
  }
  //二次贝塞尔曲线
  bezier2func = (uu, controlP) => {
    let partX0 = controlP[0][0] * uu * uu;
    let partX1 = 2 * controlP[1][0] * uu * (1 - uu);
    let partX2 = controlP[2][0] * (1 - uu) * (1 - uu);
    let partX = partX0 + partX1 + partX2;
    let partY0 = controlP[0][1] * uu * uu;
    let partY1 = 2 * controlP[1][1] * uu * (1 - uu);
    let partY2 = controlP[2][1] * (1 - uu) * (1 - uu);
    let partY = partY0 + partY1 + partY2;
    return [partX, partY]
  }
  /**
   * Find a point that intersects LineStrings with two coordinates each
   * 找到一个点，该点与每个线串有两个坐标相交
   */
  intersects = (coords1, coords2) => {
    if (coords1.length !== 2) {
      throw new Error("<intersects> line1 must only contain 2 coordinates");
    }
    if (coords2.length !== 2) {
      throw new Error("<intersects> line2 must only contain 2 coordinates");
    }
    const x1 = coords1[0][0];
    const y1 = coords1[0][1];
    const x2 = coords1[1][0];
    const y2 = coords1[1][1];
    const x3 = coords2[0][0];
    const y3 = coords2[0][1];
    const x4 = coords2[1][0];
    const y4 = coords2[1][1];
    //斜率交叉相乘 k1 = (y4 - y3) / (x4 - x3) ... k2 = (y2 - y1) / (x2 - x1)
    //k1 k2 同乘 (x4 - x3) * (x2 - x1) 得到denom
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
    const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
    const numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));
    if (denom === 0) { //斜率一样，平行线
      return null;
    }
    const uA = numeA / denom;
    const uB = numeB / denom;
    const x = x1 + (uA * (x2 - x1));
    const y = y1 + (uA * (y2 - y1));
    return [x, y];
  }

  isContains = (sp, ep, p) => {
    return ((p[0] > ep[0] && p[0] < sp[0]) || (p[0] > sp[0] && p[0] < ep[0])) &&
      ((p[1] > ep[1] && p[1] < sp[1]) || (p[1] > sp[1] && p[1] < ep[1]))
  }

  _renderPageTag = (name, index) => {
    if (name === "+") {
      return (
        <TouchableOpacity
          style={{
            // marginLeft: pxToDp(3),
            marginTop: pxToDp(12),
            marginLeft: pxToDp(-5),
            width: pxToDp(70),
            height: pxToDp(70),
            borderRadius: pxToDp(60),
          }}
          onPress={() => {
            this.NewData()
          }}
        >
          <View style={{
            width: pxToDp(60),
            height: pxToDp(60),
            borderWidth: pxToDp(3),
            borderColor: "#fff",
            borderRadius: pxToDp(60),
            backgroundColor: "#4AB3DE",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text
              style={{
                color: "#fff",
                fontSize: pxToDp(30),
                fontWeight: "bold",
              }}
            >{name}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={{
            width: pxToDp(150),
            height: pxToDp(80),
          }}
          onPress={() => {
            log("click here: ", name, index)
            this.ChoiceScribblingView(index)
          }}
        >
          <View style={{
            // marginLeft: pxToDp(3),
            backgroundColor: "#4AB3DE",
            width: pxToDp(130),
            height: pxToDp(80),
            justifyContent: "center",
            alignItems: "center",
            borderWidth: pxToDp(4),
            borderColor: this.scribbling_idx === index ? "#fff" : "#4AB3DE",
            borderTopLeftRadius: pxToDp(20),
            borderTopRightRadius: pxToDp(20),
          }}>
            {/*{*/}
            {/*  this.scribbling_idx === index?*/}
            {/*      <TouchableOpacity*/}
            {/*        onPress={() => log("click delete here...")}*/}
            {/*        style={{*/}
            {/*          position: "absolute",*/}
            {/*          top: pxToDp(-20),*/}
            {/*          left: pxToDp(100),*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        <Image*/}
            {/*            source={require("../../images/draft/close.png")}*/}
            {/*            style={{*/}
            {/*              width: pxToDp(40),*/}
            {/*              height: pxToDp(40),*/}
            {/*            }}*/}
            {/*        >*/}
            {/*        </Image>*/}
            {/*      </TouchableOpacity>*/}
            {/*      :*/}
            {/*      null*/}
            {/*}*/}
            <Text
              style={{
                color: "#fff",
                fontSize: pxToDp(30),
                fontWeight: "bold",
              }}
            >{name}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  _renderStokeColorList = (colorName, index) => {
    // log("will render colo name: ", colorName, index)
    return (
      <TouchableOpacity
        style={{
          width: pxToDp(50),
          height: pxToDp(50),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => this.StrokeColor(colorName)}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: pxToDp(this.stroke_color === colorName ? 50 : 40),
            height: pxToDp(this.stroke_color === colorName ? 50 : 40),
            backgroundColor: colorName,
            borderColor: this.stroke_color === colorName ? "#fff" : colorName,
            borderWidth: pxToDp(this.stroke_color === colorName ? 6 : 0),
            borderStyle: 'solid',
            borderRadius: pxToDp(this.stroke_color === colorName ? 50 : 30),
            paddingBottom: 2,
          }}
        >
        </View>
      </TouchableOpacity>
    )
  }

  _getToolImg = (toolName) => {
    const toolImgMap = {
      pen: require("../../images/draft/pen.png"),
      un_pen: require("../../images/draft/un_pen.png"),
      rubber: require("../../images/draft/rubber.png"),
      un_rubber: require("../../images/draft/un_rubber.png"),
    }
    let imgSource
    if (this.tool === toolName) {
      imgSource = toolImgMap[toolName]
    } else {
      imgSource = toolImgMap[`un_${toolName}`]
    }
    return imgSource
  }

  render() {
    const { drag_btn_opacity, eraser_btn_opacity, draftNameList } = this.state
    return (
      <Modal
        animationType="slide"
        visible={this.state.modalVisible}
        transparent={true}
        onRequestClose={() => this.setState({ modalVisible: false })}
        supportedOrientations={['portrait', 'landscape']}
      >
        {/*关闭按钮*/}
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: pxToDp(60),
            right: pxToDp(80),

          }}
        >
          <TouchableOpacity
            style={{
              width: pxToDp(80), height: pxToDp(80),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#767b7d",
              borderRadius: pxToDp(80),
            }}
            onPress={() => {
              this.CloseWindow()
              this.CleanData()
            }}
          >
            <Image
              source={require("../../images/draft/close.png")}
              style={{
                width: pxToDp(60),
                height: pxToDp(60),
              }}
            >
            </Image>
          </TouchableOpacity>
        </View>

        {/*画图区域*/}
        <View style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: 'white',
          opacity: 0.6,
        }}>
          <View style={{
            height: this.view_height,
            width: this.view_width,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'transparent'
          }}>
            <Svg style={{
              height: this.view_height,
              width: this.view_width,
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              position: 'absolute'
            }} >
              {
                [this.stroke_svg_mat, this.state.draw_all_svg, this.four_line_mat,]  //  全图像
              }
            </Svg>
            <Svg style={{
              height: this.view_height,
              width: this.view_width,
              backgroundColor: 'transparent',
              top: 0,
              left: 0,
              position: 'absolute'
            }} >
              {
                this.state.draw_temp_svg  //  临时图像
              }
            </Svg>
          </View>
          <View style={{
            height: this.view_height,
            width: this.view_width,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'transparent',
            // backgroundColor: 'red',
          }}
            {...this._panResponderDrawLine.panHandlers}
          >
          </View>
        </View>
        {/*底部功能区*/}
        <View
          style={{
            alignSelf: "center",
            marginTop: pxToDp(30),
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            top: Dimensions.get("window").height - pxToDp(180),
            height: pxToDp(80),
            backgroundColor: "#797a80",
            width: pxToDp(420),
            borderRadius: pxToDp(20),
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View>
              {this._renderStokeColorList("black", 0)}
            </View>
            <View
              style={{
                marginLeft: pxToDp(10),
              }}
            >
              {this._renderStokeColorList("#ec5c6f", 1)}
            </View>
          </View>

          <View
            style={{
              width: pxToDp(100),
            }}
          >
            <TouchableOpacity
              style={{
                width: pxToDp(100),
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => this.RollbackData()}
            >
              <Image
                source={require("../../images/draft/recall.png")}
                style={{ width: pxToDp(40), height: pxToDp(40) }
                }
              >
              </Image>
              <Text
                style={{
                  color: "white",
                  fontSize: pxToDp(22),
                  marginLeft: pxToDp(6),
                  fontWeight: "bold",
                }}
              >撤回</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              width: pxToDp(60),
            }}
            onPress={() => this.CleanData()}
          >
            <Image
              source={require("../../images/draft/clear.png")}
              style={{ width: pxToDp(40), height: pxToDp(40) }
              }
            >
            </Image>
          </TouchableOpacity>
        </View>

        {/*<View*/}
        {/*    style={{*/}
        {/*      marginTop: pxToDp(50),*/}
        {/*      top: pxToDp(Platform.OS === "ios"? 100: -30),*/}
        {/*      right: pxToDp(-1610),*/}
        {/*      height: pxToDp(70),*/}
        {/*      width: pxToDp(200),*/}
        {/*    }}*/}
        {/*>*/}

        {/*  <View*/}
        {/*      style={{*/}
        {/*        alignItems: "center",*/}
        {/*        marginBottom: pxToDp(15),*/}
        {/*      }}*/}
        {/*  >*/}
        {/*    <Text*/}
        {/*        style={{fontSize: pxToDp(34), color: "#3884a4", fontWeight: "bold"}}*/}
        {/*    >*/}
        {/*      画笔工具*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*  <View*/}
        {/*      style={{*/}
        {/*        flexDirection: "row",*/}
        {/*        justifyContent: "space-around",*/}
        {/*      }}*/}
        {/*  >*/}
        {/*    <TouchableOpacity*/}
        {/*        onPress={() => {*/}
        {/*          this.tool = "pen"*/}
        {/*          this.EraserData(2)*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <Image*/}
        {/*          source={this._getToolImg("pen")}*/}
        {/*          style={{width: pxToDp(64), height: pxToDp(64)}*/}
        {/*          }*/}
        {/*      >*/}
        {/*      </Image>*/}
        {/*    </TouchableOpacity>*/}
        {/*    <TouchableOpacity*/}
        {/*        onPress={() => {*/}
        {/*          log("click rubber btn")*/}
        {/*          this.tool = "rubber"*/}
        {/*          this.EraserData(1)*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <Image*/}
        {/*          source={this._getToolImg("rubber")}*/}
        {/*          style={{width: pxToDp(64), height: pxToDp(64)}*/}
        {/*          }*/}
        {/*      >*/}
        {/*      </Image>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/*画笔颜色*/}
        {/*{this.tool === "pen"?*/}
        {/*    <View*/}
        {/*        style={{*/}
        {/*          marginTop: pxToDp(Platform.OS === "ios"? 0: 30),*/}
        {/*          flexDirection: "column",*/}
        {/*          justifyContent: "space-between",*/}
        {/*          top: pxToDp(Platform.OS === "ios"? 200: 30),*/}
        {/*          right: pxToDp(-1610),*/}
        {/*          marginBottom: pxToDp(Platform.OS === "ios"? 35: 35),*/}
        {/*          // height: pxToDp(450),*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <View*/}
        {/*          style={{*/}
        {/*            width: pxToDp(200),*/}
        {/*            alignItems: "center",*/}
        {/*            marginBottom: pxToDp(15),*/}
        {/*          }}*/}
        {/*      >*/}
        {/*        <Text*/}
        {/*            style={{fontSize: pxToDp(34), color: "#3884a4", fontWeight: "bold"}}*/}
        {/*        >*/}
        {/*          画笔颜色*/}
        {/*        </Text>*/}
        {/*      </View>*/}
        {/*      <View*/}
        {/*          style={{*/}
        {/*            // backgroundColor: "red",*/}
        {/*            width: pxToDp(200),*/}
        {/*            flexDirection: "column",*/}
        {/*            alignItems: "center",*/}
        {/*            justifyContent: "space-between",*/}
        {/*          }}*/}
        {/*      >*/}
        {/*        <FlatList*/}
        {/*            horizontal*/}
        {/*            data={["black", "#ed3b3f","green", "#f3b737", ]}*/}
        {/*            renderItem={({ item, index }) => this._renderStokeColorList(item, index)}*/}
        {/*        />*/}
        {/*        <FlatList*/}
        {/*            horizontal*/}
        {/*            data={["#3090bc", "#a22993", "#de4d7e"]}*/}
        {/*            renderItem={({ item, index }) => this._renderStokeColorList(item, index)}*/}
        {/*        />*/}

        {/*      </View>*/}
        {/*    </View>*/}
        {/*    :*/}
        {/*    null*/}
        {/*}*/}
        {/*画笔粗细*/}
        {/*{this.tool==="pen"?*/}
        {/*    <View*/}
        {/*        style={{*/}
        {/*          marginTop: pxToDp(30),*/}
        {/*          flexDirection: "column",*/}
        {/*          justifyContent: "space-between",*/}
        {/*          top: pxToDp(Platform.OS === "ios"? 200: 30),*/}
        {/*          right: pxToDp(-1610),*/}
        {/*        }}*/}
        {/*    >*/}
        {/*      <View*/}
        {/*          style={{*/}
        {/*            width: pxToDp(200),*/}
        {/*            alignItems: "center",*/}
        {/*            marginBottom: pxToDp(15),*/}
        {/*          }}*/}
        {/*      >*/}
        {/*        <Text*/}
        {/*            style={{fontSize: pxToDp(34), color: "#3884a4", fontWeight: "bold"}}*/}
        {/*        >*/}
        {/*          画笔粗细*/}
        {/*        </Text>*/}
        {/*      </View>*/}
        {/*      <View*/}
        {/*          style={{*/}
        {/*            width: pxToDp(200),*/}
        {/*            height: pxToDp(50),*/}
        {/*            flexDirection: "row",*/}
        {/*            alignItems: "center",*/}
        {/*            justifyContent: "center",*/}
        {/*          }}*/}
        {/*      >*/}
        {/*        <TouchableOpacity*/}
        {/*            style={{*/}
        {/*              marginLeft: pxToDp(30),*/}
        {/*              marginRight:10,*/}
        {/*              alignItems:'center',*/}
        {/*              justifyContent:'center',*/}
        {/*              width: pxToDp(50),*/}
        {/*              height: pxToDp(50),*/}
        {/*            }}*/}
        {/*            onPress={() => this.StrokeWidth(4)}*/}
        {/*        >*/}
        {/*          <View*/}
        {/*              style={{*/}
        {/*                marginRight:10,*/}
        {/*                alignItems:'center',*/}
        {/*                justifyContent:'center',*/}
        {/*                width: pxToDp(this.stroke_width === 4? 30: 20),*/}
        {/*                height: pxToDp(this.stroke_width === 4? 30: 20),*/}
        {/*                backgroundColor:'black',*/}
        {/*                borderColor: this.stroke_width === 4? '#fff': "black",*/}
        {/*                borderWidth: pxToDp(4),*/}
        {/*                borderStyle:'solid',*/}
        {/*                borderRadius: pxToDp(this.stroke_width === 4? 30: 20),*/}
        {/*                paddingBottom: 2,*/}
        {/*              }}*/}
        {/*          >*/}
        {/*          </View>*/}
        {/*        </TouchableOpacity>*/}

        {/*        <TouchableOpacity*/}
        {/*            style={{*/}
        {/*              marginLeft: pxToDp(30),*/}
        {/*              marginRight:10,*/}
        {/*              alignItems:'center',*/}
        {/*              justifyContent:'center',*/}
        {/*              width: pxToDp(40),*/}
        {/*              height: pxToDp(40),*/}
        {/*            }}*/}
        {/*            onPress={() => this.StrokeWidth(10)}*/}
        {/*        >*/}
        {/*          <View*/}
        {/*              style={{*/}
        {/*                marginRight:10,*/}
        {/*                alignItems:'center',*/}
        {/*                justifyContent:'center',*/}
        {/*                width: pxToDp(this.stroke_width === 10? 50: 40),*/}
        {/*                height: pxToDp(this.stroke_width === 10? 50: 40),*/}
        {/*                backgroundColor:'black',*/}
        {/*                borderColor: this.stroke_width === 10? '#fff': "black",*/}
        {/*                borderWidth: pxToDp(4),*/}
        {/*                borderStyle:'solid',*/}
        {/*                borderRadius: pxToDp(this.stroke_width === 10? 50: 40),*/}
        {/*                paddingBottom: 2,*/}
        {/*              }}*/}
        {/*          >*/}
        {/*          </View>*/}
        {/*        </TouchableOpacity>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*    :*/}
        {/*    null*/}
        {/*}*/}
      </Modal>
    );
  }
}

export default ScribblingPadModal;
const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: 100,
    height: 60,
    borderRadius: 10
  },
  actionItem: {
    width: 120,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#cccccc',
    borderTopWidth: 0.5,
    backgroundColor: 'wheat',
    borderRadius: 10,
    alignContent: 'center',
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 0,
  },
  actionItemTitle: {
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
  stroke_width: {
    width: 100,
    height: 30,
    marginTop: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center'
  },
})
