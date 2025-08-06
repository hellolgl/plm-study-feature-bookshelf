/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, Text, Easing, StyleSheet, Image, TouchableOpacity, PanResponder, ART, ImageBackground, Animated, Alert } from 'react-native'
// import Util from './common/util'
import Svg, { Line, Path, Rect, Polygon, Text as SText, Circle, Ellipse, Polyline } from "react-native-svg";
import _, { times } from 'lodash'

let AnimatePolygon = Animated.createAnimatedComponent(Polygon);
let AnimateSvg = Animated.createAnimatedComponent(Svg);

let base_color = '#d3b280'  //最浅色号---字底色
let animated_color = '#af814b'  //动图色号
let writing_color = "#292726" // 书写色号
let line_ratio = 2 // 圆和线宽的比例
class HanZiGuideDrawModule extends Component {
  constructor(props) {
    super(props);
    this.stroke_idx = this.props.guide_stroke_idx   // 当前绘制笔画索引----按照顺序依次绘制笔画且可绘制
    this.gif_guide_zoom = this.props.guide_zoom_num
    this.hanzi_data = this.props.hanzi_data
    this.base_color = props.base_color?props.base_color:'#d3b280'  //最浅色号---字底色
    this.animated_color = props.animated_color?props.animated_color:'#af814b'  //动图色号
    this.writing_color = props.writing_color?props.writing_color:"#292726" // 书写色号
    this.state = {
      current_gif_svg: [],
      opacity_group: this.getInitGroupValue(),  // 透明
      draw_temp_svg: [],
      draw_all_svg: [],
      base_svg_mat: [],
      used_base_svg_mat: [],
      chn_char: '',
    }
    this.animate_mat = []
    this.state_flag = 1
    this.temp_loc = []
    this.all_stroke = []
    this.new_hanzi_char = ''
    this.group_svg_mat = []
    this.init_speed = 500   // 动图速度设置
    this.init_len = 30
    // 画笔
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
        let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
        let tempFirstY = evt.nativeEvent.locationY
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.line_start_x = Math.round(tempfirstX * 100) / 100
        this.line_start_y = Math.round(tempFirstY * 100) / 100
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100     // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100
        // 修正坐标点
        console.log('=====组件与页面差值', this.div_page_x, this.div_page_y)
        // 判定初始点位的索引---先判定点在区域内
        this.temp_loc.push([Math.round((this.line_start_x) * 100) / 100, Math.round((this.line_start_y) * 100) / 100])
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        // console.log('越界判定手指移动接触====111111111', evt.nativeEvent)
        let page_x = evt.nativeEvent.pageX    // 页面坐标
        let page_y = evt.nativeEvent.pageY
        this.line_end_x = page_x - this.div_page_x // 页面定义
        this.line_end_y = page_y - this.div_page_y
        // console.log('this.line_end_x, this.line_end_y---------', this.line_end_x, this.line_end_y)
        this.temp_loc.push([Math.round((this.line_end_x) * 100) / 100, Math.round((this.line_end_y) * 100) / 100])
        this.setState({
          draw_temp_svg: this.getDrawPolyLine(this.temp_loc, 10, this.writing_color)
        })

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。

        console.log('渲染点击点', this.line_start_x, this.line_start_y)
        // console.log('this.draw_all_svg', this.draw_all_svg)
        console.log("this.stroke_idx", this.stroke_idx)
        // 判定当前笔画书写是否正确
        if (this.stroke_idx >= this.hanzi_data["skeleton_loc"].length) {
          console.log("FINISH")
          this.setState({
            draw_temp_svg: [],
          })
        } else {
          let [new_sleketon_mat, draw_flag] = this.judgeDrawLine(this.hanzi_data["skeleton_loc"][this.stroke_idx], this.temp_loc)
          if (draw_flag) {
            // 正确书写----下一笔
            // Alert.alert("书写正确")
            if (this.stroke_idx < this.hanzi_data["skeleton_loc"].length - 1) {
              this.stroke_idx += 1
              this.all_stroke.push(this.temp_loc)
              let all_line_svg_mat = this.getDrawAllStroke(this.all_stroke, 10, this.writing_color)
              // let all_line_svg_mat = this.getDrawAllStroke([new_sleketon_mat],5,"wheat")
              // console.log("all_line_svg_mat", all_line_svg_mat)
              this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx - 1)
              this.StateRefresh()
              this.setState({
                used_base_svg_mat: this.used_base_svg_mat,
                draw_all_svg: all_line_svg_mat,
                // draw_temp_svg: this.getDrawPolyLine(new_sleketon_mat, 5, "red")
                draw_temp_svg: [],
              })
            }
            else {
              console.log("完成最后一笔", this.stroke_idx)
              this.stroke_idx += 1
              this.all_stroke.push(this.temp_loc)
              let all_line_svg_mat = this.getDrawAllStroke(this.all_stroke, 10, this.writing_color)
              // let all_line_svg_mat = this.getDrawAllStroke([new_sleketon_mat],5,"wheat")
              this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.hanzi_data["skeleton_loc"].length)
              this.setState({
                used_base_svg_mat: this.used_base_svg_mat,
                draw_all_svg: all_line_svg_mat,
                // draw_temp_svg: this.getDrawPolyLine(new_sleketon_mat, 5, "red")
                draw_temp_svg: []
              })
              this.props.finishEvent()
            }
          }
          else {
            //错误书写----重写当铅笔画
            // Alert.alert("书写错误，请重写")
            this.props.errEvent()
            this.setState({
              // draw_all_svg: all_line_svg_mat,
              draw_temp_svg: []
            })
          }
        }
        this.temp_loc = []
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

  judgeDrawLine = (skeleton_data, temp_data) => {
    /**
     * 判定书写数据与骨架信息的数据是否一致：
     * 1.计算每一点与骨架的最近距离，与点的距离；2.获取最近距离的索引数组；3. 检查排序，是否符合书写顺序
     * @param skeleton_data:骨架数据
     * @param temp_data:书写数据
     */
    console.log("骨架笔画比对", JSON.stringify(skeleton_data), '\n', JSON.stringify(temp_data))
    let inter_skeleton_data = this.getSkeletonInterpolation(skeleton_data, 6)
    // 笔画判定---最小距离及索引
    let all_idx_mat = []
    let all_dis_mat = []
    let out_num = 0  // 超出标定点
    for (let idx = 0; idx < temp_data.length; idx++) {
      let [part_idx0, part_distance0, part_idx1, part_distance1] = this.getMinDistanceIdx(inter_skeleton_data, temp_data[idx])
      // console.log('--------距离索引', part_idx0, part_distance0, part_idx1, part_distance1)
      if (part_idx0 >= 1) {
        all_idx_mat.push(part_idx0)
        all_dis_mat.push(part_distance0)
      }
      else {
        out_num += 1
      }
    }
    let temp_len = temp_data.length   // 书写数据长度
    let near_sieve_mat = []
    for (let idx = 0; idx < all_idx_mat.length; idx++) {
      if (near_sieve_mat.length < 1) {
        near_sieve_mat.push(all_idx_mat[idx])
      }
      else if (near_sieve_mat.indexOf(all_idx_mat[idx]) < 0) {
        // 重复----
        near_sieve_mat.push(all_idx_mat[idx])
      }
      else if (near_sieve_mat[near_sieve_mat.length - 1] != all_idx_mat[idx]) {
        near_sieve_mat.push(all_idx_mat[idx])
      }
    }
    // console.log("all_idx_mat", all_idx_mat)
    // console.log("总长和无效长度", temp_len, out_num)
    // console.log("邻近筛重near_sieve_mat", near_sieve_mat)
    // 记录按顺序书写的长度
    let sequence_num = 0
    for (let idx = 0; idx < near_sieve_mat.length - 1; idx++) {
      if (near_sieve_mat[idx] < near_sieve_mat[idx + 1]) {
        sequence_num += 1
      }
    }
    // console.log("顺序记录sequence_num", sequence_num)
    let sieve_mat = new Set(near_sieve_mat)
    sieve_mat = [...sieve_mat]
    // console.log("筛重数据", sieve_mat)
    let draw_flag = true
    let inter_length = inter_skeleton_data.length // 骨架插值长度
    // 书写判定
    // console.log("书写匹配度", sieve_mat.length / inter_length)
    // console.log("无效书写率", out_num / temp_len)
    // console.log("顺序书写率", sequence_num / near_sieve_mat.length)
    // console.log("书写匹配度", sieve_mat.length / inter_length)
    if ((sieve_mat.length / inter_length) >= 0.7 &&
      (out_num / temp_len) <= 0.2 &&
      (sequence_num / near_sieve_mat.length) >= 0.4) {
      draw_flag = true
    }
    else {
      draw_flag = false
    }
    if (_.flatten(skeleton_data).length / 2 < 5) {
      if ((out_num / temp_len) <= 0.4 &&
          (sequence_num / near_sieve_mat.length) >= 0.4) {
        // console.log("*******")
        draw_flag = true
      }
    }
    return [inter_skeleton_data, draw_flag]
  }

  getSkeletonInterpolation = (skeleton_xy_data, min_dis = 10) => {
    /**
     * 骨架插值----xy----[x,y],
     * @param min_dis 原数据大小下的分割距离
     */
    let skeleton_mat = []
    skeleton_mat.push([skeleton_xy_data[0][0] * this.gif_guide_zoom, skeleton_xy_data[1][0] * this.gif_guide_zoom])
    // let min_dis = 100
    for (let idx = 0; idx < skeleton_xy_data[0].length - 1; idx++) {
      let part_distance = this.getTwoPointDistance(
        [skeleton_xy_data[0][idx], skeleton_xy_data[1][idx]],
        [skeleton_xy_data[0][idx + 1], skeleton_xy_data[1][idx + 1]])
      let segment_num = Math.round(part_distance / min_dis)
      // console.log("-----------插值", segment_num)
      if (segment_num > 1) {
        let vector_x = (skeleton_xy_data[0][idx + 1] - skeleton_xy_data[0][idx]) / segment_num
        let vector_y = (skeleton_xy_data[1][idx + 1] - skeleton_xy_data[1][idx]) / segment_num
        for (let seg_idx = 1; seg_idx < segment_num; seg_idx++) {
          skeleton_mat.push([
            (skeleton_xy_data[0][idx] + vector_x * seg_idx) * this.gif_guide_zoom,
            (skeleton_xy_data[1][idx] + vector_y * seg_idx) * this.gif_guide_zoom])
        }
        skeleton_mat.push([
          skeleton_xy_data[0][idx + 1] * this.gif_guide_zoom,
          skeleton_xy_data[1][idx + 1] * this.gif_guide_zoom])
      }
      else {
        skeleton_mat.push([
          skeleton_xy_data[0][idx + 1] * this.gif_guide_zoom,
          skeleton_xy_data[1][idx + 1] * this.gif_guide_zoom])
      }
    }
    // console.log('skeleton_mat', skeleton_mat)
    return skeleton_mat
  }

  getDistance = (point_group, point_mat) => {
    /**
     * 获取点与数组点的距离
     */
    let distance_mat = []
    for (let idx = 0; idx < point_group.length; idx++) {
      distance_mat.push(this.getTwoPointDistance(point_group[idx], point_mat))
    }
    return distance_mat
  }

  getTwoPointDistance = (point_a, poit_b) => {
    // 两点距离
    let distance = Math.sqrt((point_a[0] - poit_b[0]) * (point_a[0] - poit_b[0]) + (point_a[1] - poit_b[1]) * (point_a[1] - poit_b[1]))
    return distance
  }

  getMinDistanceIdx = (point_group, point_mat) => {
    // 获取最小值索引
    let distance_mat = this.getDistance(point_group, point_mat)
    let [distance_sort, index_sort] = this.ArraySortMat(distance_mat)
    // console.log('distance_sort, index_sort', JSON.stringify(distance_sort), JSON.stringify(index_sort))
    if (distance_sort[0] < 20) {
      // 最小距离阈值判定
      return [index_sort[0], distance_sort[0], index_sort[1], distance_sort[1]]
    }
    return [-1, -1, -1, -1]
  }

  ArraySortMat = (combine_center) => {
    /**
     * @description 一维数组小大排序---排序及索引
     * @param combine_center 一维数组[11,13,12,17]
     * @return 返回排序及索引---[11,12,13,17],[0,2,1,3]
     */
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

  getDrawPolyLine = (loc_mat, radius = 10, color = "lime") => {
    let temp_polyline_svg = []
    // let radius = 10
    // let color = "lime"
    // temp_polyline_svg.push(
    //   <Polyline
    //     points={loc_mat.join(',')}  //多边形的每个角的x和y坐标
    //     // points={this.triangle_frame.join(',')} //多边形的每个角的x和y坐标
    //     fill="none"     //填充颜色
    //     stroke={color}   //外边框颜色
    //     strokeWidth={radius * 2}   //外边框宽度
    //   />
    // )
    for (let idx = 0; idx < loc_mat.length; idx++) {
      if (idx > 0) {
        temp_polyline_svg.push(<Line
          x1={loc_mat[idx - 1][0]}   //x轴的开始位置
          y1={loc_mat[idx - 1][1]}  //y轴的开始位置
          x2={loc_mat[idx][0]}  //x轴的结束位置
          y2={loc_mat[idx][1]}   //y轴的结束位置
          stroke={color}   //填充颜色
          strokeWidth={radius * line_ratio}  //填充宽度
        />)
      }
      temp_polyline_svg.push(
        <Circle
          cx={loc_mat[idx][0]}   //中心点x
          cy={loc_mat[idx][1]}    //中心点y
          r={radius}    //半径
          // stroke={color}　　//外边框 颜色　　
          // strokeWidth="2.5"  //外边框 宽度
          fill={color}   //填充颜色
        />
      )
    }
    return temp_polyline_svg
  }
  getDrawAllStroke = (all_line_loc_mat, radius = 10, color = "wheat") => {
    let all_line_svg = []
    for (let idx = 0; idx < all_line_loc_mat.length; idx++) {
      all_line_svg.push(this.getDrawPolyLine(all_line_loc_mat[idx], radius, color))
    }
    return all_line_svg
  }

  getBaseMapSvg = (all_loc_data, base_zoom_num) => {
    // console.log("123all_loc_data.loc_mat: ", all_loc_data.loc_mat)
    /**
     * 绘制底图svg
     */
    let base_svg_mat = []
    for (let ii = 0; ii < all_loc_data.loc_mat.length; ii++) {
      let loc_x = all_loc_data.loc_mat[ii][0]
      let loc_y = all_loc_data.loc_mat[ii][1]
      let polygon_str = ''
      for (let loc_ii = 0; loc_ii < loc_x.length; loc_ii++) {
        polygon_str = polygon_str + (loc_x[loc_ii] * base_zoom_num).toString() + ',' + (loc_y[loc_ii] * base_zoom_num).toString() + ' '
      }
      base_svg_mat.push(
        <Polygon
          points={polygon_str}  //多边形的每个角的x和y坐标
          fill={this.base_color}     //填充颜色
          stroke={this.base_color}   //外边框颜色
          strokeWidth="4"   //外边框宽度
          strokeOpacity={1}
          fillOpacity={1}
        />
      )
    }
    this.base_svg_mat = base_svg_mat
  }

  getUsedBaseMapSvg = (all_loc_data, base_zoom_num, max_idx) => {
    /**
     * 绘制底图svg
     */
    let used_base_svg_mat = []
    for (let ii = 0; ii < max_idx; ii++) {
      let loc_x = all_loc_data.loc_mat[ii][0]
      let loc_y = all_loc_data.loc_mat[ii][1]
      let polygon_str = ''
      for (let loc_ii = 0; loc_ii < loc_x.length; loc_ii++) {
        polygon_str = polygon_str + (loc_x[loc_ii] * base_zoom_num).toString() + ',' + (loc_y[loc_ii] * base_zoom_num).toString() + ' '
      }
      used_base_svg_mat.push(
        <Polygon
          points={polygon_str}  //多边形的每个角的x和y坐标
          fill={this.base_color}    //填充颜色
          stroke={this.base_color}   //外边框颜色
          strokeWidth="4"   //外边框宽度
          strokeOpacity={1}
          fillOpacity={1}
        />
      )
    }
    this.used_base_svg_mat = used_base_svg_mat
  }

  getInitGroupValue = () => {
    // 获取初始动画Value组
    // let group_mat = [2, 3]
    // console.log('this.hanzi_data', this.hanzi_data)
    let group_value = []
    for (let row_idx = 0; row_idx < this.hanzi_data.split_idx.length; row_idx++) {
      let part_value_mat = []
      // console.log("this.hanzi_data.split_idx: ", this.hanzi_data.split_idx, row_idx)
      for (let col_idx = 0; col_idx < this.hanzi_data.split_idx[row_idx].start_end_0.length; col_idx++) {
        // console.log('this.hanzi_data.split_idx[row_idx].start_end_0.length', this.hanzi_data.split_idx[row_idx].start_end_0.length)
        part_value_mat.push(new Animated.Value(0))
      }
      group_value.push(part_value_mat)
    }
    this.gif_opacity_group = _.cloneDeep(group_value)
    return group_value
  }

  getAllAnimateFunc = () => {
    /**
     * 获取所有笔画组动画---参数
     */
    let animate_mat = []
    for (let row_idx = 0; row_idx < this.hanzi_data.split_idx.length; row_idx++) {
      let part_animate_mat = []
      let disappear_animate = []
      for (let col_idx = 0; col_idx < this.hanzi_data.split_idx[row_idx].start_end_0.length; col_idx++) {
        // 消失
        disappear_animate.push(
          Animated.timing(this.state.opacity_group[row_idx][col_idx],
            {
              toValue: 0,
              duration: 0.01,
              useNativeDriver: false,
            }
          ))
      }
      part_animate_mat.push(Animated.parallel(disappear_animate))
      for (let col_idx = 0; col_idx < this.hanzi_data.split_idx[row_idx].start_end_0.length; col_idx++) {
        // 计算长度
        let div_x = this.hanzi_data.skeleton_loc[row_idx][0][col_idx] - this.hanzi_data.skeleton_loc[row_idx][0][col_idx + 1]
        let div_y = this.hanzi_data.skeleton_loc[row_idx][1][col_idx] - this.hanzi_data.skeleton_loc[row_idx][1][col_idx + 1]
        let dis_len = Math.sqrt(div_x * div_x + div_y * div_y)
        part_animate_mat.push(
          Animated.timing(this.state.opacity_group[row_idx][col_idx],
            {
              toValue: 1,
              duration: isNaN(dis_len) ? this.init_speed : this.init_speed * dis_len / this.init_len,
              useNativeDriver: false,
              easing: Easing.bezier(0.0, 0.999, 0.1, 1) // 缓动函数
            }
          )
        )
      }
      part_animate_mat.push(Animated.parallel(disappear_animate))
      animate_mat.push(part_animate_mat)
    }
    this.animate_mat = animate_mat
  }

  getAllAnimateSvg = () => {
    /**
     * 获取所有动画Svg
     */
    let group_svg_mat = []
    for (let row_idx = 0; row_idx < this.hanzi_data.split_idx.length; row_idx++) {
      let part_group_mat = []
      // 绘制当前笔动画
      let single_stroke_split = this.hanzi_data.split_idx[row_idx]
      let single_edge_mat = this.hanzi_data.loc_mat[row_idx]
      let gif_len = single_edge_mat[0].length
      // console.log('gif_len----', gif_len, single_stroke_split.start_end_0.length)
      // 大到小
      for (let idx = 0; idx < single_stroke_split.start_end_0.length - 1; idx++) {
        // 单笔分帧
        let part_loc_mat = []
        // 场景分解          // 开始
        // console.log('--------------------------单笔-----------------')
        if (single_stroke_split.start_end_0[idx] <= single_stroke_split.start_end_0[idx + 1]) {
          for (let s_idx = single_stroke_split.start_end_0[idx]; s_idx <= single_stroke_split.start_end_0[idx + 1]; s_idx++) {
            // console.log('s_idx', s_idx)
            part_loc_mat.push([
              single_edge_mat[0][(s_idx + gif_len) % gif_len] * this.gif_guide_zoom,
              single_edge_mat[1][(s_idx + gif_len) % gif_len] * this.gif_guide_zoom
            ])
          }
        }
        else {
          for (let s_idx = single_stroke_split.start_end_0[idx]; s_idx <= single_stroke_split.start_end_0[idx + 1] + gif_len; s_idx++) {
            // console.log('s_idx', s_idx)
            part_loc_mat.push([
              single_edge_mat[0][(s_idx + gif_len) % gif_len] * this.gif_guide_zoom,
              single_edge_mat[1][(s_idx + gif_len) % gif_len] * this.gif_guide_zoom
            ])
          }
        }
        // 结束
        if (single_stroke_split.start_end_1[idx] >= single_stroke_split.start_end_1[idx + 1]) {
          for (let e_idx = single_stroke_split.start_end_1[idx + 1]; e_idx <= single_stroke_split.start_end_1[idx]; e_idx++) {
            // console.log('e_idx', e_idx)
            part_loc_mat.push([
              single_edge_mat[0][(e_idx + gif_len) % gif_len] * this.gif_guide_zoom,
              single_edge_mat[1][(e_idx + gif_len) % gif_len] * this.gif_guide_zoom
            ])
          }
        }
        else {
          for (let e_idx = single_stroke_split.start_end_1[idx + 1]; e_idx <= single_stroke_split.start_end_1[idx] + gif_len; e_idx++) {
            // console.log('e_idx', e_idx)
            part_loc_mat.push([
              single_edge_mat[0][(e_idx + gif_len) % gif_len] * this.gif_guide_zoom,
              single_edge_mat[1][(e_idx + gif_len) % gif_len] * this.gif_guide_zoom
            ])
          }
        }
        // console.log('part_loc_mat', part_loc_mat, part_loc_mat.join(' '))
        part_group_mat.push(
          <AnimatePolygon
            points={part_loc_mat.join(' ')}  //多边形的每个角的x和y坐标
            fill={this.animated_color}     //填充颜色
            stroke={this.animated_color}   //外边框颜色
            strokeWidth="1"   //外边框宽度
            strokeOpacity={this.state.opacity_group[row_idx][idx]}
            fillOpacity={this.state.opacity_group[row_idx][idx]}
          />
        )
      }
      group_svg_mat.push(part_group_mat)
    }
    this.group_svg_mat = group_svg_mat
  }

  NextStroke = () => {
    /**
     * 测试下一笔
     */
    // console.log('下一笔')
    this.stroke_idx += 1
    this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx)
    if (this.stroke_idx < this.animate_mat.length) {
      Animated.loop(
        Animated.sequence(this.animate_mat[this.stroke_idx])
      ).start()
      this.setState({
        current_gif_svg: this.group_svg_mat[this.stroke_idx]
      })
    }
    else {
      this.stroke_idx = -1
      this.setState({
        current_gif_svg: []
      })
    }
  }

  StateRefresh = () => {
    // this.state_flag = 0
    this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx)
    if (this.props.guide_stroke_idx < this.animate_mat.length) {
      Animated.loop(
        Animated.sequence(this.animate_mat[this.stroke_idx])
      ).start()
      // this.setState({
      //   current_gif_svg: this.group_svg_mat[this.stroke_idx]
      // })
    }
    else {
      this.stroke_idx = -1
      // this.setState({
      //   current_gif_svg: []
      // })
    }
  }

  Revoke = () => {
    /**
     * 撤回一笔
     */
    // console.log("撤回一笔")
    this.stroke_idx = this.stroke_idx > 0 ? this.stroke_idx - 1 : 0
    this.all_stroke.pop()
    let all_line_svg_mat = this.getDrawAllStroke(this.all_stroke, 10, this.writing_color)
    // let all_line_svg_mat = this.getDrawAllStroke([new_sleketon_mat],5,"wheat")
    // console.log("all_line_svg_mat", all_line_svg_mat)
    this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx - 1)
    this.StateRefresh()
    this.setState({
      used_base_svg_mat: this.used_base_svg_mat,
      draw_all_svg: all_line_svg_mat,
      // draw_temp_svg: this.getDrawPolyLine(new_sleketon_mat, 5, "red")
      draw_temp_svg: [],

    })
  }

  Clean = () => {
    /**
     * 清空---重写
     */
    if (this.props.hanzi_data["chn_char"] != "") {
      this.all_stroke = []
      this.stroke_idx = this.props.guide_stroke_idx   // 当前绘制笔画索引----按照顺序依次绘制笔画且可绘制
      this.gif_guide_zoom = this.props.guide_zoom_num
      this.hanzi_data = this.props.hanzi_data
      this.state.chn_char = this.props.hanzi_data["chn_char"]
      // 动画组初始化
      this.getInitGroupValue()
      this.getBaseMapSvg(this.hanzi_data, this.gif_guide_zoom) // 获取底图绘制svg
      // console.log('------------1---------')
      this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx)
      // console.log('------------2---------')
      this.getAllAnimateFunc()
      // console.log('------------3---------')
      this.getAllAnimateSvg()
      // console.log('------------4---------')
      Animated.loop(
        Animated.sequence(this.animate_mat[this.stroke_idx])
      ).start()
      this.setState({
        current_gif_svg: this.group_svg_mat[this.stroke_idx],
        base_svg_mat: this.base_svg_mat,
        used_base_svg_mat: this.used_base_svg_mat,
        draw_all_svg: [],
        draw_temp_svg: [],
        chn_char: this.props.hanzi_data["chn_char"]
      })
    }
  }

  render() {
    // console.log('this.props.hanzi_data', this.props.hanzi_char)
    // if (this.props.state_flag === 1) {
    //   console.log('--------')
    // }
    if (this.state.chn_char != this.props.hanzi_data["chn_char"]) {
      // 更新
      // console.log('更新显示汉字', this.props.hanzi_char)
      this.all_stroke = []
      this.stroke_idx = this.props.guide_stroke_idx   // 当前绘制笔画索引----按照顺序依次绘制笔画且可绘制
      this.gif_guide_zoom = this.props.guide_zoom_num
      this.hanzi_data = this.props.hanzi_data
      this.state.chn_char = this.props.hanzi_data["chn_char"]
      // 动画组初始化
      this.getInitGroupValue()
      this.getBaseMapSvg(this.hanzi_data, this.gif_guide_zoom) // 获取底图绘制svg
      // console.log('------------1---------')
      this.getUsedBaseMapSvg(this.hanzi_data, this.gif_guide_zoom, this.stroke_idx)
      // console.log('------------2---------')
      this.getAllAnimateFunc()
      // console.log('------------3---------')
      this.getAllAnimateSvg()
      // console.log('------------4---------')
      Animated.loop(
        Animated.sequence(this.animate_mat[this.stroke_idx])
      ).start()
      this.setState({
        current_gif_svg: this.group_svg_mat[this.stroke_idx],
        base_svg_mat: this.base_svg_mat,
        used_base_svg_mat: this.used_base_svg_mat,
        draw_all_svg: [],
        draw_temp_svg: [],
        chn_char: this.props.hanzi_data["chn_char"]
      })
    }

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'transparent',

      }}>
        <View style={{
          width: 256 * this.gif_guide_zoom,
          height: 256 * this.gif_guide_zoom,
          backgroundColor: 'transparent', alignItems: 'center', alignContent: 'center', marginRight: 0, marginLeft: 0
        }}
          {...this._panResponderDrawLine.panHandlers}>
          <AnimateSvg style={{
            width: 256 * this.gif_guide_zoom,
            height: 256 * this.gif_guide_zoom,
            backgroundColor: 'transparent', alignItems: 'center', alignContent: 'center'
          }}>
            {this.state.base_svg_mat}
            {this.state.used_base_svg_mat}
            {/* {this.state.current_gif_svg} */}
            {this.stroke_idx < this.group_svg_mat.length ? this.group_svg_mat[this.stroke_idx] : []}
            {this.state.draw_all_svg}
            {this.state.draw_temp_svg}
          </AnimateSvg>
        </View>
        {/* <TouchableOpacity style={{ backgroundColor: 'gray', borderRadius: 10, margin: 10 }}
          onPress={() => this.NextStroke()}>
          <Text style={{ fontSize: 40, margin: 10 }}>下一笔</Text>
        </TouchableOpacity> */}
        <View style={{ flexDirection: "column" }}>
          {/*<TouchableOpacity style={{ margin: 10, backgroundColor: base_color, borderRadius: 10 }}*/}
          {/*  onPress={() => this.Revoke()}>*/}
          {/*  <Text style={{ fontSize: 40, margin: 10 }}>撤回</Text>*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity style={{ margin: 10, backgroundColor: base_color, borderRadius: 10 }}*/}
          {/*  onPress={() => this.Clean()}>*/}
          {/*  <Text style={{ fontSize: 40, margin: 10 }}>清空</Text>*/}
          {/*</TouchableOpacity>*/}
        </View>
      </View >

    );
  }
}

export default HanZiGuideDrawModule;
