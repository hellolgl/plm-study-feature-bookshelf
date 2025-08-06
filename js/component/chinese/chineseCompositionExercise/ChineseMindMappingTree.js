/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
// import Util from './common/util'
import Svg, { Line, Polygon, Path, Polyline, Circle } from "react-native-svg";
//  import RNBaiduvoice from 'react-native-baidu-vtts'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Tts.setDefaultVoice('com.apple.ttsbundle.Martin-compact')
let show_color = '#9C6004';
let hidden_color = 'transparent';
let view_color_mat = []
let view_show_mat = []
class ChineseMindMappingTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_color_mat: {},
      all_choice_svg: [],
      view_show_mat: {},
      all_choice_view: []
    }
    this.rect_loc_mat = {}
    this.view_color_mat = {}
    this.all_choice_svg = []
    this.level_mat = []       // 层级关系
    this.all_children_parent = {}    // 父子属性
    this.all_choice_view = []
    this.view_show_mat = {}
    this.frame_min_y = 10000        // 
    this.frame_max_y = -10000
  }

  componentWillMount() {
    console.log('前渲染=====================', this.props.mindmapping)
    for (let part_key in this.props.mindmapping) {
      if (this.props.mindmapping[part_key].parent.length < 1) {
        // 根节点
        this.view_color_mat[part_key] = show_color
        this.view_show_mat[part_key] = true
      } else {
        // 子节点
        this.view_color_mat[part_key] = hidden_color
        this.view_show_mat[part_key] = true
      }
    }
    // this.ChineseMindView(this.props.mindmapping)
    this.setState({
      view_show_mat: this.view_show_mat,
      view_color_mat: this.view_color_mat,
      // all_choice_svg: this.all_choice_svg,
      // all_choice_view: this.all_choice_view
    })
    this.ChineseMindView(this.props.mindmapping)

  }

  componentDidMount() {
    console.log('后渲染')
    // this.ChineseMindView(this.props.mindmapping)
  }

  static getDerivedStateFromProps(props, state) {
    console.log('前渲染---------------', state.view_color_mat.length, JSON.stringify(state.view_show_mat) === '{}')
    let tempState = state
    if (JSON.stringify(state.view_show_mat) === '{}') {
      for (let part_key in props.mindmapping) {
        if (props.mindmapping[part_key].parent.length < 1) {
          // 根节点
          state.view_color_mat[part_key] = show_color
          state.view_show_mat[part_key] = true
        } else {
          // 子节点
          state.view_color_mat[part_key] = hidden_color
          state.view_show_mat[part_key] = true
        }
      }
    }
    else {
      for (let part_key in props.mindmapping) {
        if (props.mindmapping[part_key].parent.length < 1) {
          // 根节点
          state.view_color_mat[part_key] = show_color
          state.view_show_mat[part_key] = true
        }
      }
    }

    console.log('=========', state.view_color_mat)
    console.log('=========', state.view_show_mat)
    // this.ChineseMindView(props.mindmapping)
    // this.setState({
    //   view_show_mat: this.view_show_mat,
    //   view_color_mat: this.view_color_mat,
    // })
  }

  ChineseMindView = (do_exercises_dict) => {
    // 计算保存每个字符区域大小
    let all_init_loc = {}
    let gap_x = 50  // 横向间隔
    let gap_y = [0, 0, 0, 0, 0, 0, 0, 0, 0]  // 纵向间隔
    let font_size = 22  // 字体大小
    let [min_text_num, max_text_num] = [6, 13]
    let min_width = font_size * min_text_num // 最小宽度
    let min_height = 35 // 最小高度
    let max_width = font_size * max_text_num // 最大宽度---10个字
    let state_height = 0     // 状态栏高度
    let global_init_x = 10   //初始坐标---横向
    let global_init_y = 250   //初始坐标---纵向
    let button_width = 40 // 最底层点击箭头组宽度
    let min_gap_y = 20    // 最小纵向间隔
    // 添加Title：
    let title_size = 30; //title大小
    // 计算得到单组字符串的文字分组情况：单排起始位、宽度大小、标点分割
    for (let part_key in do_exercises_dict) {
      // 遍历计算所需文本宽度
      let part_text_mat = []
      let part_text_str = ''
      if (typeof do_exercises_dict[part_key].text === 'string') {
        for (let idx = 0; idx < do_exercises_dict[part_key].text.length; idx++) {
          // 字符串类型
          if ((part_text_str.length + 1) * font_size * 1 <= max_width) {
            part_text_str += do_exercises_dict[part_key].text[idx]
          }
          else {
            if ((['，', ',', '。', '!', '?']).indexOf(do_exercises_dict[part_key].text[idx]) >= 0) {
              // 存在标点符号，直接添加
              part_text_str += do_exercises_dict[part_key].text[idx]
              part_text_mat.push(part_text_str)
              part_text_str = ''
            }
            else {
              part_text_mat.push(part_text_str)
              // 消除多余标点符号----
              part_text_str = do_exercises_dict[part_key].text[idx]
            }
          }
        }
      }
      else if (typeof do_exercises_dict[part_key].text === 'object') {
        // 数组
        let all_str = do_exercises_dict[part_key].text.join('')
        for (let idx = 0; idx < all_str.length; idx++) {
          // 字符串类型
          if ((part_text_str.length + 1) * font_size * 1 <= max_width) {
            part_text_str += all_str[idx]
          }
          else {
            if ((['，', ',', '。', '!', '?']).indexOf(all_str[idx]) >= 0) {
              // 存在标点符号，直接添加
              part_text_str += all_str[idx]
              part_text_mat.push(part_text_str)
              part_text_str = ''
            }
            else {
              part_text_mat.push(part_text_str)
              // 消除多余标点符号----
              part_text_str = all_str[idx]
            }
          }
        }
      }
      if (part_text_str.length > 0) {
        part_text_mat.push(part_text_str)
      }
      console.log('--------part_text_mat', part_key, part_text_mat)
      let part_max_width = 0
      let part_max_height = 0
      if (part_text_mat.length == 1) {
        // 只有一行的情况判定最小
        part_max_height = font_size > min_height ? font_size : min_height;
        part_max_width = part_text_mat[0].length * font_size >= min_width ? part_text_mat[0].length * font_size + 10 : min_width + 20; // min_width
      }
      else {
        part_max_width = max_width + font_size * 0.5
        //  part_max_height = part_text_mat.length * font_size * 1.3
        part_max_height = font_size > min_height ? font_size : min_height; // 同一标准高度
      }
      all_init_loc[part_key] = { resolve_text: part_text_mat, part_max_width: part_max_width, part_max_height: part_max_height }
    }
    console.log('all_init_loc', all_init_loc)
    // 建立整体分步坐标
    let all_global_loc = {}
    let parent_key = ''
    for (let part_key in do_exercises_dict) {
      // console.log('part_key', part_key, `do_exercises_dict.${part_key}`)
      // console.log('part_key', part_key, do_exercises_dict[part_key])
      // console.log('part_key', part_key, do_exercises_dict[part_key].parent, do_exercises_dict.length)
      if (do_exercises_dict[part_key].parent.length < 1) {
        // 没有父节点---自身为唯一父节点
        parent_key = part_key
        all_global_loc[part_key] = {
          start_x: global_init_x,             // 起始x
          start_y: global_init_y,             // 起始y
          max_width: all_init_loc[part_key].part_max_width,    // 最大宽度
          max_height: all_init_loc[part_key].part_max_height,  // 最大高度
          level: 0,    // 层级
        }
      }
      else {
        // 其余子节点预处理
        all_global_loc[part_key] = {
          start_x: -1,             // 起始x
          start_y: -1,             // 起始y
          max_width: all_init_loc[part_key].part_max_width,    // 最大宽度
          max_height: all_init_loc[part_key].part_max_height,  // 最大高度
          level: -1,    // 层级
        }
      }
    }
    // console.log('all_global_loc', all_global_loc)
    // 字节点处理
    let flag_num = 1
    let max_level = 0
    while (flag_num > 0) {
      flag_num = 0
      // console.log('while------------')
      for (let part_key2 in do_exercises_dict) {
        // 
        if (do_exercises_dict[part_key2].parent.length > 0) {
          // 循环遍历----属于子节点
          if (all_global_loc[do_exercises_dict[part_key2].parent].level >= 0 && all_global_loc[part_key2].level < 0) {
            // 父节点的层级有效,自身层级无效
            flag_num = 1
            all_global_loc[part_key2].level = all_global_loc[do_exercises_dict[part_key2].parent].level + 1
            max_level = all_global_loc[part_key2].level > max_level ? all_global_loc[part_key2].level : max_level
          }

        }
      }
    }
    console.log('all_global_loc', all_global_loc, max_level, parent_key)
    // 可以根据层级设置间隔
    // 设置子节点全局坐标
    for (let idx = 0; idx < max_level; idx++) {
      for (let part_key in do_exercises_dict) {
        // console.log('---------part_key', part_key)
        if (all_global_loc[part_key].level === idx) {
          // 找到节点下的子节点
          if (do_exercises_dict[part_key].children.length > 0) {
            //   console.log('level---字母', idx, part_key, do_exercises_dict[part_key].children)
            // 统计所有子组件高度,居中排布---奇数行的中心排布 
            let children_height = 0
            let children_height_loc_mat = []
            for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
              // 
              children_height_loc_mat.push(children_height)
              children_height += all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height + (gap_y[idx + 1] + state_height)    // 添加间隔
            }
            // children_height += (do_exercises_dict[part_key].children.length-1)*gap_y  // 可以根据层级设置gap_y的值
            children_height -= (gap_y[idx + 1])
            // console.log('part_key', part_key, 'children_height', children_height, 'children_height_loc_mat', children_height_loc_mat)
            // 建立垂直居中排坐标--子节点
            for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
              // 
              all_global_loc[do_exercises_dict[part_key].children[c_idx]] = {
                start_x: all_global_loc[part_key].start_x + all_global_loc[part_key].max_width + gap_x,             // 起始x
                start_y: all_global_loc[part_key].start_y + (all_global_loc[part_key].max_height + state_height) / 2 - children_height / 2 + children_height_loc_mat[c_idx],             // 起始y
                max_width: all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_width,    // 最大宽度
                max_height: all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height,  // 最大高度
                level: all_global_loc[do_exercises_dict[part_key].children[c_idx]].level,    // 层级
              }
            }
          }
        }
      }
    }
    console.log('all_global_loc2', all_global_loc, max_level)
    // 计算层级之间的交叉问题----为每个节点设计1个间隔值
    let level_key_mat = [parent_key]
    let next_level = 1
    let all_key_gap = {}
    let all_flag = 0
    let all_level_key_mat = []
    while (next_level > 0 && all_flag < 10) {
      let next_level_mat = []
      console.log('level_key_mat', level_key_mat)
      all_level_key_mat.push(level_key_mat)   // 层级
      let part_gap_x = []
      level_key_mat.forEach((part_key) => {
        // all_key_gap[part_key] = { gap_y: 10 }
        if (do_exercises_dict[part_key].children.length < 1) {
          console.log('无子节点')
          all_key_gap[part_key] = { gap_y_mat: [] }
        }
        else {
          let part_gap_mat = []
          for (let idx = 0; idx < do_exercises_dict[part_key].children.length - 1; idx++) {
            part_gap_mat.push(0)
          }
          next_level_mat.push(do_exercises_dict[part_key].children)
          all_key_gap[part_key] = { gap_y_mat: part_gap_mat }
        }
      })
      if (next_level_mat.length < 1) {
        next_level = 0
        break
      }
      else {
        level_key_mat = next_level_mat.flat()
      }
      all_flag += 1
    }
    console.log('节点间隔---all_key_gap', all_key_gap, all_level_key_mat)
    // 遍历更新节点
    let refresh_flag = 1
    let refresh_num = 0
    while (refresh_flag > 0 && refresh_num < 200) {
      // 遍历每一层相邻两个节点的交叠情况，满足最小gap_y跳过，否则找到相同根节点，若根节点下的子节点相邻则直接添加，否则分开添加，直至遍历完成所有节点
      let inner_flag = 0
      for (let level_idx = 0; level_idx < all_level_key_mat.length; level_idx++) {
        // 遍历层级
        // console.log('all_level_key_mat[level_idx]----层级', all_level_key_mat[level_idx])
        if (all_level_key_mat[level_idx].length > 1) {
          // 存在两个子节点的才对比计算交叠情况
          let level_key_mat = all_level_key_mat[level_idx]
          for (let children_idx = 0; children_idx < level_key_mat.length - 1; children_idx++) {
            // 获取两个子节点
            let children_key_1 = level_key_mat[children_idx]
            let children_key_2 = level_key_mat[children_idx + 1]
            // 查看子节点的y坐标值
            let key_y_1 = all_global_loc[children_key_1].start_y + all_global_loc[children_key_1].max_height
            let key_y_2 = all_global_loc[children_key_2].start_y
            // console.log('子节点y值', key_y_1, key_y_2)
            let div_y = (key_y_2 - key_y_1)   // 纵向间隔差
            if (div_y < min_gap_y) {
              // 小于最小间隔---寻找父节点
              let [same_parent, new_children_key_1, new_children_key_2] = this.FindSameParentDot(children_key_1, children_key_2, do_exercises_dict)
              // console.log('同一父节点', same_parent)
              // 判定--间隔几层，---间隔1层直接判定，间隔多层，读取最高节点下一节点的的索引
              let key_idx_1 = do_exercises_dict[same_parent].children.indexOf(new_children_key_1)
              let key_idx_2 = do_exercises_dict[same_parent].children.indexOf(new_children_key_2)
              // console.log('同一父节点下子节点索引', key_idx_1, key_idx_2)
              if (key_idx_2 - key_idx_1 === 1) {
                // 表示相邻节点---只更改一个间隔值
                let amend_y = min_gap_y - div_y   // 修正间隔值
                all_key_gap[same_parent].gap_y_mat[key_idx_1] += amend_y
                // console.log('迭代修正间隔值', all_key_gap)
              } else {
                // 分别添加
                let amend_y = min_gap_y - div_y   // 修正间隔值
                all_key_gap[same_parent].gap_y_mat[key_idx_1] += amend_y / 2
                all_key_gap[same_parent].gap_y_mat[key_idx_1 - 1] += amend_y / 2
              }
              // 根据基准重新计算全局坐标
              for (let idx = 0; idx < max_level; idx++) {
                for (let part_key in do_exercises_dict) {
                  // console.log('---------part_key', part_key)
                  if (all_global_loc[part_key].level === idx) {
                    // 找到节点下的子节点
                    if (do_exercises_dict[part_key].children.length > 0) {
                      //   console.log('level---字母', idx, part_key, do_exercises_dict[part_key].children)
                      // 统计所有子组件高度,居中排布---奇数行的中心排布 
                      let children_height = 0
                      let children_height_loc_mat = []
                      for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
                        // 
                        children_height_loc_mat.push(children_height)
                        if (c_idx < do_exercises_dict[part_key].children.length - 1) {
                          // 添加修正间隔
                          children_height += all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height + (all_key_gap[part_key].gap_y_mat[c_idx] + state_height)    // 添加间隔
                        }
                        else {
                          children_height += all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height + (state_height)    // 添加间隔
                        }
                      }
                      // console.log('part_key', part_key, 'children_height', children_height, 'children_height_loc_mat', children_height_loc_mat)
                      // 建立垂直居中排坐标--子节点
                      for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
                        // 子节点坐标
                        all_global_loc[do_exercises_dict[part_key].children[c_idx]].start_y =
                          all_global_loc[part_key].start_y + (all_global_loc[part_key].max_height + state_height) / 2 - children_height / 2 + children_height_loc_mat[c_idx]             // 起始y
                      }
                    }
                  }
                }
              }

              inner_flag = 1
              break
            }
            if (inner_flag === 1) {
              break
            }
          }
        }
        if (inner_flag === 1) {
          break
        }
        if (level_idx === all_level_key_mat.length - 1) {
          // 完全遍历完成
          refresh_flag = 0
        }
        // break
      }
      console.log('循环次数-----------', refresh_num)
      refresh_num += 1
    }
    // 间隔修正相同距离---均分
    console.log('---------all_key_gap', all_key_gap)
    for (let part_key in all_key_gap) {
      if (all_key_gap[part_key].gap_y_mat.length > 0) {
        // 修正数据---选择最大值
        let max_gap_y = Math.max.apply(null, all_key_gap[part_key].gap_y_mat)
        // 最大值
        console.log('=====max_gap_y', max_gap_y, all_key_gap[part_key].gap_y_mat)
        let new_gap_y_mat = []
        for (let gap_idx = 0; gap_idx < all_key_gap[part_key].gap_y_mat.length; gap_idx++) {
          max_gap_y = all_key_gap[part_key].gap_y_mat[gap_idx] > all_key_gap[part_key].gap_y_mat[all_key_gap[part_key].gap_y_mat.length - 1 - gap_idx] ?
            all_key_gap[part_key].gap_y_mat[gap_idx] : all_key_gap[part_key].gap_y_mat[all_key_gap[part_key].gap_y_mat.length - 1 - gap_idx]
          new_gap_y_mat.push(max_gap_y)
        }
        console.log('=========new_gap_y_mat', new_gap_y_mat)
        all_key_gap[part_key].gap_y_mat = new_gap_y_mat
      }
    }
    // 重新计算全局坐标
    for (let idx = 0; idx < max_level; idx++) {
      for (let part_key in do_exercises_dict) {
        // console.log('---------part_key', part_key)
        if (all_global_loc[part_key].level === idx) {
          // 找到节点下的子节点
          if (do_exercises_dict[part_key].children.length > 0) {
            //   console.log('level---字母', idx, part_key, do_exercises_dict[part_key].children)
            // 统计所有子组件高度,居中排布---奇数行的中心排布 
            let children_height = 0
            let children_height_loc_mat = []
            for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
              // 
              children_height_loc_mat.push(children_height)
              if (c_idx < do_exercises_dict[part_key].children.length - 1) {
                // 添加修正间隔
                children_height += all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height + (all_key_gap[part_key].gap_y_mat[c_idx] + state_height)    // 添加间隔
              }
              else {
                children_height += all_global_loc[do_exercises_dict[part_key].children[c_idx]].max_height + (state_height)    // 添加间隔
              }
            }
            // console.log('part_key', part_key, 'children_height', children_height, 'children_height_loc_mat', children_height_loc_mat)
            // 建立垂直居中排坐标--子节点
            for (let c_idx = 0; c_idx < do_exercises_dict[part_key].children.length; c_idx++) {
              // 子节点坐标
              all_global_loc[do_exercises_dict[part_key].children[c_idx]].start_y =
                all_global_loc[part_key].start_y + (all_global_loc[part_key].max_height + state_height) / 2 - children_height / 2 + children_height_loc_mat[c_idx]             // 起始y
            }
          }
        }
      }
    }
    // 简单绘制图形
    let all_view_mat = []
    let rect_loc_mat = {}
    let all_level = {}
    let all_children_parent = {}
    for (let part_key in all_global_loc) {
      let part_svg_mat = []
      all_level[part_key] = all_global_loc[part_key].level    // 层级
      all_children_parent[part_key] = {
        children: do_exercises_dict[part_key].children,
        parent: do_exercises_dict[part_key].parent,
      }
      // 绘制方框
      // console.log('起始坐标', all_global_loc[part_key].start_y - font_size * 0.8, all_global_loc[part_key].start_x)
      if (all_global_loc[part_key].start_y < this.frame_min_y) {
        this.frame_min_y = all_global_loc[part_key].start_y
      }
      // 文本单行依次展示
      let part_text_view = []
      if (all_init_loc[part_key].resolve_text.length <= 1) {
        //单行直接展示
        part_text_view.push(<Text style={{ fontSize: font_size, lineHeight: font_size + 5, width: max_width }}>
          {/* {all_init_loc[part_key].resolve_text[0]} */}
          {all_init_loc[part_key].resolve_text[0]}
        </Text>)
      }
      else {
        let first_str = all_init_loc[part_key].resolve_text[0]
        console.log('first_str', first_str)
        // console.log(part_key, all_init_loc[part_key].resolve_text)
        if (first_str.indexOf("“") >= 0 || first_str.indexOf("”") >= 0) {
          first_str = first_str.substr(0, max_text_num) + '...'
        }
        else {
          first_str = first_str.substr(0, max_text_num - 1) + '...'
        }
        part_text_view.push(<Text style={{ fontSize: font_size, lineHeight: font_size + 5, width: max_width }}>
          {/* {all_init_loc[part_key].resolve_text[0]} */}
          {first_str}
        </Text>)
      }
      part_svg_mat.push(
        this.state.view_show_mat[part_key] ? (<TouchableOpacity style={{
          width: all_global_loc[part_key].max_width + (do_exercises_dict[part_key].children.length > 0 ? 0 : 0),//button_width
          height: all_global_loc[part_key].max_height + state_height,     // state-heigth
          top: all_global_loc[part_key].start_y,
          left: all_global_loc[part_key].start_x,
          backgroundColor: '#fff',
          borderRadius: 5,
          borderColor: '#F9AD63',
          borderWidth: 3,
          position: 'absolute',
        }}
          // activeOpacity={0}
          onPress={() => this.TextMat(part_key)}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            top: -3,
            left: -1,
          }}>
            <View style={{
              width: all_global_loc[part_key].max_width - 5,
              height: all_global_loc[part_key].max_height,
              backgroundColor: 'transparent',
              borderRadius: 5,
              borderColor: 'transparent',
              borderWidth: 2,
              // alignItems:'center'
              justifyContent: 'center',
            }}>
              {/* <Text style={{ fontSize: font_size,lineHeight:font_size+5}}>
                 {/* {all_init_loc[part_key].resolve_text[0]} */}
              {/* {do_exercises_dict[part_key].text}
               </Text> */}
              {part_text_view}
            </View>
            {
              do_exercises_dict[part_key].children.length > -1 ? null : (
                <View style={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'white',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  left: 5,
                  // textAlignVertical:'center',
                }}>
                  <FontAwesome name={'arrow-right'} size={26} style={{ color: '#9C6004' }} />
                </View>)
            }

          </View>
        </TouchableOpacity>) : null)

      // 居中分布计算
      // console.log('do_exercises_dict[part_key].title', do_exercises_dict[part_key], do_exercises_dict[part_key].title)
      let title_div_x = (all_global_loc[part_key].max_width + (do_exercises_dict[part_key].children.length > 0 ? 0 : button_width)) / 2 - // 组件半宽
        (do_exercises_dict[part_key].hasOwnProperty('title') ? do_exercises_dict[part_key].title.length * title_size / 2 : 0) // title半宽
      part_svg_mat.push(
        (this.state.view_show_mat[part_key] && (do_exercises_dict[part_key].parent.length < 1 ? true :
          (part_key === do_exercises_dict[do_exercises_dict[part_key].parent].children[0]))) ? (<View style={{
            // width:10,
            height: 50,     // state-heigth
            top: all_global_loc[part_key].start_y - (title_size + 20),
            left: all_global_loc[part_key].start_x + title_div_x,
            backgroundColor: 'transparent',
            position: 'absolute',
          }}>
            <Text style={{ fontSize: title_size, backgroundColor: 'transparent', color: 'white', }}>
              {do_exercises_dict[part_key].title}
            </Text>
          </View>) : null)
      // 更新最小高度
      if (do_exercises_dict[part_key].hasOwnProperty('title') && do_exercises_dict[part_key].title.length > 0) {
        // 存在有效title
        if ((all_global_loc[part_key].start_y - (title_size + 20)) < this.frame_min_y) {
          this.frame_min_y = all_global_loc[part_key].start_y - (title_size + 20)
        }
      }
      rect_loc_mat[part_key] = {
        x: all_global_loc[part_key].start_x,
        y: all_global_loc[part_key].start_y - font_size * 0.8,
        width: all_global_loc[part_key].max_width,
        height: all_global_loc[part_key].max_height,
        view_state: 1, // 显示隐藏状态
      }
      all_view_mat.push(part_svg_mat)
    }
    // 简单绘制图形----连线
    let all_svg_mat = []
    for (let part_key in all_global_loc) {
      let part_svg_mat = []
      // 绘制 连线
      if (do_exercises_dict[part_key].children.length > 0) {
        // 存在子节点
        // console.log('绘制直线')
        for (let line_idx = 0; line_idx < do_exercises_dict[part_key].children.length; line_idx++) {
          // console.log('--------all_global_loc[part_key].max_height', all_global_loc[part_key].max_height)
          let x1 = all_global_loc[part_key].start_x + all_global_loc[part_key].max_width + 1   //x轴的开始位置
          let y1 = all_global_loc[part_key].start_y + all_global_loc[part_key].max_height / 2 + state_height //y轴的开始位置
          let x2 = all_global_loc[do_exercises_dict[part_key].children[line_idx]].start_x - 1  //x轴的结束位置
          let y2 = all_global_loc[do_exercises_dict[part_key].children[line_idx]].start_y +
            all_global_loc[do_exercises_dict[part_key].children[line_idx]].max_height / 2 + state_height   //y轴的结束位置
          // 绘制连线
          let cut_rotate_angle = Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI
          let [new_x2, new_y2] = this.GetLengthLoc([x2, y2], [x1, y1], 14 / Math.cos(cut_rotate_angle / 180 * Math.PI))  // 定义箭头端点
          let cut_len = 15   // 线上长度
          let cut_loc = this.GetLengthLoc([new_x2, new_y2], [x1, y1], cut_len)
          // 绘制曲线---
          let div_y = 0
          let div_x = 30
          let start_xy = [x1, y1]
          let c_start_xy = [x1 + div_x, y1 - div_y]   // 综合法为减---向上移动+ div_y
          let c_end_xy = [x2 - div_x, y2 + div_y]   // 综合法为加---向下移动- div_y
          let end_xy = [x2, y2]
          let path_str = "M" + start_xy.join(',') + ' C' + c_start_xy.join(',') + ' ' + c_end_xy.join(',') + ' ' + end_xy.join(',')  // "200 C100,100 250,100 250,200 S400,300 400,200"
          all_svg_mat.push(<Path
            // d='M200,200 l 50,0 a50,50 0 0,1 50,50 a25,25 0 0,1 -50,0 a60,60 0 0,1 50,-50 l 50,-110 z'
            // d={'M' + start_point.join(',') + ' l 50,0 ' + draw_path + ' l 50,0'}
            d={path_str}
            // stroke={this.state.view_color_mat[do_exercises_dict[part_key].children[line_idx]]}  //填充颜色 无
            stroke='#9C6004' //填充颜色
            strokeWidth="2"  //填充宽度
          // fill='#9C6004'
          />)
          // all_svg_mat.push(<Circle
          //   cx={x2+2}
          //   cy={y2}
          //   r={3}
          //   fill='#F9AD63' //
          // />)
          // all_svg_mat.push(<Circle
          //   cx={x1}
          //   cy={y1}
          //   r={3}
          //   fill='#9C6004'  //
          // />)
        }
      }
      all_svg_mat.push(part_svg_mat)
    }
    // console.log('all_level', all_level)
    // console.log('all_children_parent', all_children_parent)
    this.level_mat = all_level
    this.all_children_parent = all_children_parent
    // return all_svg_mat
    this.all_choice_view = all_view_mat
    this.all_choice_svg = all_svg_mat
    // this.frame_min_y = 0
    console.log('this.frame_min_y-------最小', this.frame_min_y)
    // this.setState({
    //   all_choice_svg: this.all_choice_svg,
    //   all_choice_view: this.all_choice_view
    // })
  }

  FindSameParentDot = (key_a, key_b, binary_dict) => {
    let same_parent = ''
    let find_num = 0
    while (find_num < 20) {
      find_num += 1
      let parent_a = binary_dict[key_a].parent
      let parent_b = binary_dict[key_b].parent
      // console.log('寻找父节点', parent_a, parent_b)
      if (parent_a === parent_b) {
        same_parent = parent_a
        break
      }
      else {
        key_a = parent_a
        key_b = parent_b
      }
    }
    console.log('相同父节点', same_parent)
    return [same_parent, key_a, key_b]
  }

  TextMat = (part_key0) => {
    console.log('按下组件索引', part_key0, this.props.mindmapping[part_key0].text)
    // alert('按下组件索引---' + part_key + '---' + do_exercises_dict[part_key].text)
    this.props._getData(part_key0)  // 返回传参
  }

  PathDrawTransform = (start_point, end_point) => {
    // 绘制特定曲线转换---截取中间固定长度绘制，旋转后的坐标组合
    let cut_line_len = 10 // 等于小圆直径--- 小半圆
    let min_radius = cut_line_len / 2 * 1
    let max_radius = cut_line_len // 大圆半径----四分之一圆
    let rotate_angle = Math.atan((end_point[1] - start_point[1]) / (end_point[0] - start_point[0])) * 180 / Math.PI
    let cut_start_point = this.GetLengthLoc(start_point, end_point, 5 / Math.cos(rotate_angle / 180 * Math.PI) / Math.cos(rotate_angle / 180 * Math.PI))
    // console.log('rotate_angle', rotate_angle)
    // 建立初始相对坐标
    let init_max_start_point_1 = [0, 0]                       // 相对起点
    let init_max_end_point_1 = [max_radius, max_radius]      // 相对终点
    let init_max_rxy_point_1 = [max_radius, max_radius]      // 椭圆xy长度，可以考虑用椭圆参数生成其他类型----绘制圆弧
    let init_max_end_point_r_1 = this.PointRotate(init_max_start_point_1, init_max_end_point_1, -rotate_angle)     // 旋转角度----相对终点
    let init_min_start_point_1 = [0, 0]
    let init_min_end_point_1 = [-min_radius * 2, 0]
    let init_min_rxy_point_1 = [min_radius, min_radius]
    let init_min_end_point_r_1 = this.PointRotate(init_min_start_point_1, init_min_end_point_1, -rotate_angle)     // 旋转角度----相对终点
    let init_max_start_point_2 = [0, 0]
    let init_max_end_point_2 = [max_radius, -max_radius]
    let init_max_rxy_point_2 = [max_radius, max_radius]
    let init_max_end_point_r_2 = this.PointRotate(init_max_start_point_2, init_max_end_point_2, -rotate_angle)     // 旋转角度----相对终点
    let draw_path =
      'a' + init_max_rxy_point_1.join(',') + ' 0 0,1 ' + init_max_end_point_r_1.join(',') +     // 四分之一圆弧
      'a' + init_min_rxy_point_1.join(',') + ' 0 0,1 ' + init_min_end_point_r_1.join(',') +
      'a' + init_max_rxy_point_2.join(',') + ' 0 0,1 ' + init_max_end_point_r_2.join(',')
    // a50,50 0 0,1 50,50 a25,25 0 0,1 -50,0 a50,50 0 0,1 50,-50
    let all_length = Math.sqrt(
      (cut_start_point[0] - end_point[0]) * (cut_start_point[0] - end_point[0]) +
      (cut_start_point[1] - end_point[1]) * (cut_start_point[1] - end_point[1]))
    // console.log('all_length', all_length)
    let end_len = (all_length - cut_line_len) / 2
    let start_end_xy = this.GetLengthLoc(cut_start_point, end_point, end_len)
    let end_start_xy = this.GetLengthLoc(end_point, cut_start_point, end_len)
    // let draw_path2 = 'M' + start_point.join(',') + 'L' + start_end_xy.join(',') + draw_path + ' L ' + end_point.join(',')
    let draw_path2 = 'M' + cut_start_point.join(',') + 'L' + start_end_xy.join(',') + draw_path + ' L ' + end_point.join(',')
    return draw_path2
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

  GetLengthLoc = (start_point, end_point, cut_len) => {
    // 在某条直线上，以某个点到另一个点获得多长距离的一个点
    // 起点、终点、截取长度
    let line_abc = this.Line_ABC(start_point, end_point)   // 直线参数
    // console.log('line_abc',line_abc, -line_abc[1]/line_abc[0])
    // 转换圆半径正余弦值求解
    let sin_value = line_abc[0] / (Math.sqrt(line_abc[0] * line_abc[0] + line_abc[1] * line_abc[1]))
    let cos_value = -line_abc[1] / (Math.sqrt(line_abc[0] * line_abc[0] + line_abc[1] * line_abc[1]))   // 直角坐标和实际图形坐标y方向相反
    // console.log('cos_value/sin_value', cos_value, sin_value, cos_value/sin_value, )
    let cut_x1 = cut_len * cos_value + start_point[0]
    let cut_y1 = cut_len * sin_value + start_point[1]
    let cut_x2 = -cut_len * cos_value + start_point[0]
    let cut_y2 = -cut_len * sin_value + start_point[1]
    if (this.TwoPointDistance([cut_x1, cut_y1], end_point) < this.TwoPointDistance([cut_x2, cut_y2], end_point)) {
      // 取短边----线段内交点
      // console.log('cut_x1,cut_y1', cut_x1,cut_y1, start_point,end_point)
      return [cut_x1, cut_y1]
    }
    else {
      // console.log('cut_x2,cut_y2', cut_x2,cut_y2, start_point,end_point)
      return [cut_x2, cut_y2]
    }
  }
  Line_ABC = (point_a, point_b) => {
    // 根据两点求直线Ax+By+C=0
    if (point_a[0] == point_b[0] && point_a[1] == point_b[1]) {
      // 同一点
      return false
    }
    else if (point_a[0] == point_b[0]) {
      // 同 x，与y平行
      return [1, 0, -point_b[0]]
    }
    else if (point_a[1] == point_b[1]) {
      // 同 y， 与x平行
      return [0, 1, -point_a[1]]
    }
    else {
      // 斜线
      let line_k = (point_a[1] - point_b[1]) / (point_a[0] - point_b[0])
      let line_c = point_a[1] - line_k * point_a[0]
      return [-line_k, 1, -line_c]
    }
  }
  TwoPointDistance = (point_a, point_b) => {
    // 求解两点之间的距离
    let x_div = point_a[0] - point_b[0]
    let y_div = point_a[1] - point_b[1]
    // console.log('x_div/y_div',x_div,y_div)
    return Math.sqrt(x_div * x_div + y_div * y_div)
  }

  render() {
    // 连线题：智能组题
    console.log('组件初始状态--------------')
    // this.all_choice_svg = this.ChineseChoiceSVG(do_exercises_dict)   this.frame_min_y
    // this.ChineseMindView(this.props.mindmapping)
    this.ChineseMindView(this.props.mindmapping)
    let frame_height = 600
    let frame_width = 1200
    return (
      <View style={{ width: frame_width, height: frame_height, top: 0, left: 0, backgroundColor: 'transparent' }}>
        <Svg style={{ width: frame_width, height: frame_height, backgroundColor: 'transparent', top: 0 - this.frame_min_y, left: 0 }} >
          {this.all_choice_svg}
        </Svg>
        <View style={{ width: frame_width, height: frame_height, top: -frame_height - this.frame_min_y, left: 0, backgroundColor: 'transparent' }}>
          {
            this.all_choice_view
          }
        </View>
      </View>
    );
  }
}

export default ChineseMindMappingTree;
const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9C6004',
    width: 100,
    height: 60,
    borderRadius: 10
  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    width: 100,
    height: 60,
    borderRadius: 10
  },
  button3: {
    //  
    borderColor: 'black',
    borderWidth: 1,
    //  borderRadius:5,
    fontSize: 25,
    // alignSelf:'flex-start',
    textAlign: 'center',
    justifyContent: "center",
    textAlignVertical: 'center',
    position: 'absolute',
    alignSelf: 'flex-start'

  },
})
