/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// import Util from './common/util'
import Svg, { Line, Polygon, Path, Polyline, Circle } from "react-native-svg";
//  import RNBaiduvoice from 'react-native-baidu-vtts'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { pxToDp } from "../../util/tools";

// Tts.setDefaultVoice('com.apple.ttsbundle.Martin-compact')
let show_color = "#4D5B75"; //箭头颜色
let hidden_color = "transparent";
let view_color_mat = [];
let view_show_mat = [];
class ChineseMindMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view_color_mat: {},
      all_choice_svg: [],
      view_show_mat: {},
      all_choice_view: [],
      showView: [],
    };
    this.rect_loc_mat = {};
    this.view_color_mat = {};
    this.all_choice_svg = [];
    this.level_mat = []; // 层级关系
    this.all_children_parent = {}; // 父子属性
    this.all_choice_view = [];
    this.view_show_mat = {};
    this.frame_min_y = 10000; //
    this.frame_max_y = -10000;
    this.global_init_y = 250;
    this.showView = [];
  }

  componentWillMount() {
    for (let part_key in this.props.mindmapping) {
      if (this.props.mindmapping[part_key].parent.length < 1) {
        // 根节点
        this.view_color_mat[part_key] = show_color;
        this.view_show_mat[part_key] = true;
        this.showView[part_key] = false;
      } else {
        // 子节点
        this.view_color_mat[part_key] = hidden_color;
        this.view_show_mat[part_key] = false;
        this.showView[part_key] = false;
      }
    }

    // this.ChineseMindView(this.props.mindmapping)
    this.setState({
      view_show_mat: this.view_show_mat,
      view_color_mat: this.view_color_mat,
      showView: this.showView,
      // all_choice_svg: this.all_choice_svg,
      // all_choice_view: this.all_choice_view
    });
    this.ChineseMindView(this.props.mindmapping);
  }

  componentDidMount() {
    console.log("后渲染");
    // this.ChineseMindView(this.props.mindmapping)
  }

  static getDerivedStateFromProps(props, state) {
    let tempState = state;
    if (JSON.stringify(state.view_show_mat) === "{}") {
      for (let part_key in props.mindmapping) {
        if (props.mindmapping[part_key].parent.length < 1) {
          // 根节点
          state.view_color_mat[part_key] = show_color;
          state.view_show_mat[part_key] = true;
        } else {
          // 子节点
          state.view_color_mat[part_key] = hidden_color;
          state.view_show_mat[part_key] = false;
        }
      }
    } else {
      for (let part_key in props.mindmapping) {
        if (props.mindmapping[part_key].parent.length < 1) {
          // 根节点
          state.view_color_mat[part_key] = show_color;
          state.view_show_mat[part_key] = true;
        }
      }
    }

    console.log("=========", state.view_color_mat);
    console.log("=========", state.view_show_mat);
    // this.ChineseMindView(props.mindmapping)
    // this.setState({
    //   view_show_mat: this.view_show_mat,
    //   view_color_mat: this.view_color_mat,
    // })
  }

  ChineseMindView = (do_exercises_dict) => {
    // 计算保存每个字符区域大小
    let all_init_loc = {};
    let gap_x = 50; // 横向间隔
    let gap_y = [100, 100, 20, 10]; // 纵向间隔
    let font_size = 22; // 字体大小
    let min_width = font_size * 6; // 最小宽度
    let min_height = 35; // 最小高度
    let max_width = font_size * 10; // 最大宽度---10个字
    let state_height = 40; // 状态栏高度
    let global_init_x = 10; //初始坐标---横向
    let global_init_y = this.global_init_y; //初始坐标---纵向
    let button_width = 40; // 最底层点击箭头组宽度
    // 添加Title：
    let title_size = 30; //title大小
    // 计算得到单组字符串的文字分组情况：单排起始位、宽度大小、标点分割
    for (let part_key in do_exercises_dict) {
      // 遍历计算所需文本宽度
      let part_text_mat = [];
      let part_text_str = "";
      for (let idx = 0; idx < do_exercises_dict[part_key].text.length; idx++) {
        if ((part_text_str.length + 1) * font_size * 1 <= max_width) {
          part_text_str += do_exercises_dict[part_key].text[idx];
        } else {
          if (
            ["，", ",", "。", "!", "?"].indexOf(
              do_exercises_dict[part_key].text[idx]
            ) >= 0
          ) {
            // 存在标点符号，直接添加
            part_text_str += do_exercises_dict[part_key].text[idx];
            part_text_mat.push(part_text_str);
            part_text_str = "";
          } else {
            part_text_mat.push(part_text_str);
            // 消除多余标点符号----
            part_text_str = do_exercises_dict[part_key].text[idx];
          }
        }
      }
      if (part_text_str.length > 0) {
        part_text_mat.push(part_text_str);
      }
      // console.log('--------part_text_mat', part_key, part_text_mat)
      let part_max_width = 0;
      let part_max_height = 0;
      if (part_text_mat.length == 1) {
        // 只有一行的情况判定最小
        part_max_height = font_size > min_height ? font_size : min_height;
        part_max_width =
          part_text_mat[0].length * font_size > min_width
            ? part_text_mat[0].length * font_size
            : min_width;
      } else {
        part_max_width = max_width + font_size;
        part_max_height = part_text_mat.length * font_size * 1.3;
      }
      all_init_loc[part_key] = {
        resolve_text: part_text_mat,
        part_max_width: part_max_width * 1.2,
        part_max_height: part_max_height,
      };
    }
    // console.log('all_init_loc', all_init_loc)
    // 建立整体分步坐标
    let all_global_loc = {};

    for (let part_key in do_exercises_dict) {
      // console.log('part_key', part_key, `do_exercises_dict.${part_key}`)
      // console.log('part_key', part_key, do_exercises_dict[part_key])
      // console.log('part_key', part_key, do_exercises_dict[part_key].parent, do_exercises_dict.length)
      if (do_exercises_dict[part_key].parent.length < 1) {
        // 没有父节点---自身为唯一父节点
        all_global_loc[part_key] = {
          start_x: global_init_x, // 起始x
          start_y: global_init_y, // 起始y
          max_width: all_init_loc[part_key].part_max_width, // 最大宽度
          max_height: all_init_loc[part_key].part_max_height, // 最大高度
          level: 0, // 层级
        };
      } else {
        // 其余子节点预处理
        all_global_loc[part_key] = {
          start_x: -1, // 起始x
          start_y: -1, // 起始y
          max_width: all_init_loc[part_key].part_max_width, // 最大宽度
          max_height: all_init_loc[part_key].part_max_height, // 最大高度
          level: -1, // 层级
        };
      }
    }
    // console.log('all_global_loc', all_global_loc)
    // 字节点处理
    let flag_num = 1;
    let max_level = 0;
    while (flag_num > 0) {
      flag_num = 0;
      // console.log('while------------')
      for (let part_key2 in do_exercises_dict) {
        //
        if (do_exercises_dict[part_key2].parent.length > 0) {
          // 循环遍历----属于子节点
          if (
            all_global_loc[do_exercises_dict[part_key2].parent].level >= 0 &&
            all_global_loc[part_key2].level < 0
          ) {
            // 父节点的层级有效,自身层级无效
            flag_num = 1;
            all_global_loc[part_key2].level =
              all_global_loc[do_exercises_dict[part_key2].parent].level + 1;
            max_level =
              all_global_loc[part_key2].level > max_level
                ? all_global_loc[part_key2].level
                : max_level;
          }
        }
      }
    }
    // console.log('all_global_loc', all_global_loc, max_level)
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
            let children_height = 0;
            let children_height_loc_mat = [];
            for (
              let c_idx = 0;
              c_idx < do_exercises_dict[part_key].children.length;
              c_idx++
            ) {
              //
              children_height_loc_mat.push(children_height);
              children_height +=
                all_global_loc[do_exercises_dict[part_key].children[c_idx]]
                  .max_height +
                (gap_y[idx + 1] + state_height); // 添加间隔
            }
            // children_height += (do_exercises_dict[part_key].children.length-1)*gap_y  // 可以根据层级设置gap_y的值
            children_height -= gap_y[idx + 1];
            // console.log('part_key', part_key, 'children_height', children_height, 'children_height_loc_mat', children_height_loc_mat)
            // 建立垂直居中排坐标--子节点
            for (
              let c_idx = 0;
              c_idx < do_exercises_dict[part_key].children.length;
              c_idx++
            ) {
              //
              all_global_loc[do_exercises_dict[part_key].children[c_idx]] = {
                start_x:
                  all_global_loc[part_key].start_x +
                  all_global_loc[part_key].max_width +
                  gap_x, // 起始x
                start_y:
                  all_global_loc[part_key].start_y +
                  (all_global_loc[part_key].max_height + state_height) / 2 -
                  children_height / 2 +
                  children_height_loc_mat[c_idx], // 起始y
                max_width:
                  all_global_loc[do_exercises_dict[part_key].children[c_idx]]
                    .max_width, // 最大宽度
                max_height:
                  all_global_loc[do_exercises_dict[part_key].children[c_idx]]
                    .max_height, // 最大高度
                level:
                  all_global_loc[do_exercises_dict[part_key].children[c_idx]]
                    .level, // 层级
              };
            }
          }
        }
      }
    }
    // console.log('all_global_loc2', all_global_loc, max_level)
    // 简单绘制图形
    let all_view_mat = [];
    let rect_loc_mat = {};
    let all_level = {};
    let all_children_parent = {};
    for (let part_key in all_global_loc) {
      let part_svg_mat = [];
      all_level[part_key] = all_global_loc[part_key].level; // 层级
      all_children_parent[part_key] = {
        children: do_exercises_dict[part_key].children,
        parent: do_exercises_dict[part_key].parent,
      };
      // 绘制方框
      // console.log('起始坐标', all_global_loc[part_key].start_y - font_size * 0.8, all_global_loc[part_key].start_x)
      let state_view = []; // 状态展示
      for (
        let state_idx = 0;
        state_idx < do_exercises_dict[part_key].state.length;
        state_idx++
      ) {
        if (do_exercises_dict[part_key].state[state_idx] === -1) {
          state_view.push(
            <View
              style={{
                width: 12,
                height: 12,
                marginRight: 5,
                marginLeft: state_idx === 0 ? 8 : 0,
                backgroundColor: "#EDEEF0",
                borderRadius: 6,
              }}
            />
          );
        } else if (do_exercises_dict[part_key].state[state_idx] === 0) {
          state_view.push(
            <View
              style={{
                width: 12,
                height: 12,
                marginRight: 5,
                marginLeft: state_idx === 0 ? 8 : 0,
                backgroundColor: "#FF502A",
                borderRadius: 6,
              }}
            />
          );
        } else if (do_exercises_dict[part_key].state[state_idx] === 1) {
          state_view.push(
            <View
              style={{
                width: 12,
                height: 12,
                marginRight: 5,
                marginLeft: state_idx === 0 ? 8 : 0,
                backgroundColor: "#FFC913",
                borderRadius: 6,
              }}
            />
          );
        } else if (do_exercises_dict[part_key].state[state_idx] >= 1) {
          state_view.push(
            <View
              style={{
                width: 12,
                height: 12,
                marginRight: 5,
                marginLeft: state_idx === 0 ? 8 : 0,
                backgroundColor: "#00E09F",
                borderRadius: 6,
              }}
            />
          );
        }
      }
      if (all_global_loc[part_key].start_y < this.frame_min_y) {
        this.frame_min_y = all_global_loc[part_key].start_y;
      }
      if (
        all_global_loc[part_key].start_y +
          all_global_loc[part_key].max_height +
          state_height >
        this.frame_max_y
      ) {
        this.frame_max_y =
          all_global_loc[part_key].start_y +
          all_global_loc[part_key].max_height +
          state_height; // 最大高度计算
      }
      // 文本单行依次展示
      let part_text_view = [];

      all_init_loc[part_key].resolve_text.forEach((part_text) => {
        part_text_view.push(
          <Text
            style={{
              fontSize: font_size,
              lineHeight: font_size + 5,
              width: font_size * 11,
              paddingLeft: 4,
              color: "#fff",
            }}
          >
            {/* {all_init_loc[part_key].resolve_text[0]} */}
            {part_text}
          </Text>
        );
      });
      // 最大的底层
      let show = this.showView[part_key];
      part_svg_mat.push(
        this.state.view_show_mat[part_key] ? (
          <TouchableOpacity
            style={{
              width:
                all_global_loc[part_key].max_width +
                (do_exercises_dict[part_key].children.length > 0
                  ? 0
                  : button_width),
              height: all_global_loc[part_key].max_height + state_height, // state-heigth
              top: all_global_loc[part_key].start_y,
              left: all_global_loc[part_key].start_x,
              backgroundColor: "#323F56",
              borderRadius: 20,
              // borderColor: '#fff',
              // borderWidth: 4,
              position: "absolute",
              paddingBottom: 4,
            }}
            // activeOpacity={0}
            onPress={() => this.TextMat(part_key)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#4D5B75",
                borderRadius: 20,
                justifyContent: "center",
                // backgroundColor: "#fff",
              }}
            >
              {state_view.length > 0 ? (
                <View
                  style={{
                    width:
                      all_global_loc[part_key].max_width +
                      (do_exercises_dict[part_key].children.length > 0
                        ? 0
                        : button_width),
                    height: 30,
                    top: 0,
                    left: 0,
                    backgroundColor: "#4D5B75",
                    borderRadius: 20,
                    // borderColor: '#F9AD63',
                    // borderWidth: 4,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* <View style={{ width: 12, height: 12, marginRight: 5, marginLeft: 8, backgroundColor: '#9C6004', borderRadius: 6, }} />
            <View style={{ width: 12, height: 12, marginRight: 5, backgroundColor: 'orange', borderRadius: 6, }} />
            <View style={{ width: 12, height: 12, marginRight: 5, backgroundColor: 'violet', borderRadius: 6, }} /> */}
                  {state_view}
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // top: -3,
                  left: -3,
                  // backgroundColor: "pink",
                  // flex: 1,
                }}
              >
                <View
                  style={{
                    width: all_global_loc[part_key].max_width - 5,
                    height: all_global_loc[part_key].max_height,
                    backgroundColor: "transparent",
                    borderRadius: 5,
                    borderColor: "transparent",
                    borderWidth: 2,
                    // alignItems:'center'
                    justifyContent: "center",
                  }}
                >
                  {/* 文字内容 */}
                  {/* <Text style={{ fontSize: font_size,lineHeight:font_size+5}}>
                {/* {all_init_loc[part_key].resolve_text[0]} */}
                  {/* {do_exercises_dict[part_key].text}
              </Text> */}
                  {part_text_view}
                </View>
                {do_exercises_dict[part_key].children.length > 0 ? null : (
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#4D5B75",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                      left: 5,
                      // textAlignVertical:'center',
                    }}
                  >
                    {/* 右边箭头 */}
                    {/* chevron-right */}
                    <FontAwesome
                      name={"chevron-right"}
                      size={20}
                      style={{ color: "#A3A8B3" }}
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ) : null
      );

      // 居中分布计算
      let title_div_x =
        (all_global_loc[part_key].max_width +
          (do_exercises_dict[part_key].children.length > 0
            ? 0
            : button_width)) /
          2 - // 组件半宽
        (do_exercises_dict[part_key].title.length * title_size) / 2; // title半宽
      part_svg_mat.push(
        this.state.view_show_mat[part_key] &&
          (do_exercises_dict[part_key].parent.length < 1
            ? true
            : part_key ===
              do_exercises_dict[do_exercises_dict[part_key].parent]
                .children[0]) ? (
          <View
            style={{
              // width:10,
              height: 50, // state-heigth
              top: all_global_loc[part_key].start_y - (title_size + 20),
              left: all_global_loc[part_key].start_x + title_div_x,
              backgroundColor: "transparent",
              position: "absolute",
            }}
          >
            <Text
              style={{
                fontSize: title_size,
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              {do_exercises_dict[part_key].title}
            </Text>
          </View>
        ) : null
      );
      // 更新最小高度
      if (do_exercises_dict[part_key].title.length > 0) {
        // 存在有效title
        if (
          all_global_loc[part_key].start_y - (title_size + 20) <
          this.frame_min_y
        ) {
          this.frame_min_y =
            all_global_loc[part_key].start_y - (title_size + 20);
        }
      }
      rect_loc_mat[part_key] = {
        x: all_global_loc[part_key].start_x,
        y: all_global_loc[part_key].start_y - font_size * 0.8,
        width: all_global_loc[part_key].max_width,
        height: all_global_loc[part_key].max_height,
        view_state: 1, // 显示隐藏状态
      };
      all_view_mat.push(part_svg_mat);
    }
    // 简单绘制图形----连线
    let all_svg_mat = [];
    for (let part_key in all_global_loc) {
      let part_svg_mat = [];
      // 绘制 连线
      if (do_exercises_dict[part_key].children.length > 0) {
        // 存在子节点

        for (
          let line_idx = 0;
          line_idx < do_exercises_dict[part_key].children.length;
          line_idx++
        ) {
          // console.log('--------all_global_loc[part_key].max_height', all_global_loc[part_key].max_height)
          let x1 =
            all_global_loc[part_key].start_x +
            all_global_loc[part_key].max_width; //x轴的开始位置
          let y1 =
            all_global_loc[part_key].start_y +
            all_global_loc[part_key].max_height / 2 +
            state_height -
            10; //y轴的开始位置
          let x2 =
            all_global_loc[do_exercises_dict[part_key].children[line_idx]]
              .start_x; //x轴的结束位置
          let y2 =
            all_global_loc[do_exercises_dict[part_key].children[line_idx]]
              .start_y +
            all_global_loc[do_exercises_dict[part_key].children[line_idx]]
              .max_height /
              2 +
            state_height -
            10; //y轴的结束位置
          // 绘制连线
          let cut_rotate_angle =
            (Math.atan((y2 - y1) / (x2 - x1)) * 180) / Math.PI;
          let [new_x2, new_y2] = this.GetLengthLoc(
            [x2, y2],
            [x1, y1],
            8 / Math.cos((cut_rotate_angle / 180) * Math.PI)
          ); // 定义箭头端点
          let [new_x1, new_y1] = this.GetLengthLoc(
            [x1, y1],
            [x2, y2],
            6 / Math.cos((cut_rotate_angle / 180) * Math.PI)
          ); // 定义起始点
          let cut_line_loc = this.GetLengthLoc([new_x2, new_y2], [x1, y1], 10);
          part_svg_mat.push(
            <Line
              x1={new_x1} //x轴的开始位置
              y1={new_y1} //y轴的开始位置
              x2={cut_line_loc[0]} //x轴的结束位置
              y2={cut_line_loc[1]} //y轴的结束位置
              stroke={
                this.state.view_color_mat[
                  do_exercises_dict[part_key].children[line_idx]
                ]
              } //填充颜色
              // stroke='#9C6004' //填充颜色
              strokeWidth="3" //填充箭头线的宽度
            />
          );
          // 计算绘制箭头
          let arrow_len = 25; // 箭头长度
          let cut_len = 10; // 线上长度
          let arrow_loc = this.GetLengthLoc(
            [new_x2, new_y2],
            [x1, y1],
            arrow_len
          );
          let cut_loc = this.GetLengthLoc([new_x2, new_y2], [x1, y1], cut_len);
          let rotate_angle = 30;
          let arrow_right_loc = this.PointRotate(
            [new_x2, new_y2],
            arrow_loc,
            rotate_angle
          );
          let arrow_left_loc = this.PointRotate(
            [new_x2, new_y2],
            arrow_loc,
            -rotate_angle
          );
          let mode_str2 = [
            arrow_right_loc,
            [new_x2, new_y2],
            arrow_left_loc,
            cut_loc,
          ].join(",");
          part_svg_mat.push(
            <Polygon
              points={mode_str2} //多段线的各个点
              fill={
                this.state.view_color_mat[
                  do_exercises_dict[part_key].children[line_idx]
                ]
              } //填充颜色 无
            />
          );
          // 绘制曲线---
          let start_point = [200, 200];
          let end_point = [400, 100];
          let draw_path = this.PathDrawTransform([x1, y1], cut_loc);
          // all_svg_mat.push(<Path
          //   // d='M200,200 l 50,0 a50,50 0 0,1 50,50 a25,25 0 0,1 -50,0 a60,60 0 0,1 50,-50 l 50,-110 z'
          //   // d={'M' + start_point.join(',') + ' l 50,0 ' + draw_path + ' l 50,0'}
          //   d={draw_path}
          //   stroke={this.state.view_color_mat[do_exercises_dict[part_key].children[line_idx]]}  //填充颜色 无
          //   // stroke='#9C6004' //填充颜色
          //   strokeWidth="3"  //填充宽度
          // // fill='#9C6004'
          // />)
        }
      }
      all_svg_mat.push(part_svg_mat);
    }
    // console.log('all_level', all_level)
    // console.log('all_children_parent', all_children_parent)
    this.level_mat = all_level;
    this.all_children_parent = all_children_parent;
    // return all_svg_mat
    this.all_choice_view = all_view_mat;
    this.all_choice_svg = all_svg_mat;
    if (this.frame_min_y < 0) {
      this.global_init_y += -this.frame_min_y;
      this.frame_min_y = 10000;
      this.ChineseMindView(this.props.mindmapping);
    }
    // console.log('this.frame_min_y-------最小', this.frame_min_y)
    // this.setState({
    //   all_choice_svg: this.all_choice_svg,
    //   all_choice_view: this.all_choice_view
    // })
  };
  TextMat = (part_key0) => {
    // alert('按下组件索引---' + part_key + '---' + do_exercises_dict[part_key].text)
    // 修正所有图像的颜色
    this.view_color_mat[part_key0] = show_color;
    let choice_level = this.level_mat[part_key0]; // 选择层级
    // 当前选择等级下的全部为隐藏色
    for (let part_key in this.level_mat) {
      if (this.level_mat[part_key] > choice_level) {
        this.view_color_mat[part_key] = hidden_color;
        this.view_show_mat[part_key] = false; // 隐藏子组件
      }
    }
    // for (let i in this.showView) {
    //   this.view_cshowViewolor_mat[i] = false;
    // }
    // this.showView[part_key0] = true;
    console.log("状态-----", this.showView);

    let children_mat = this.all_children_parent[part_key0].children; // 选择子
    console.log("children_mat", children_mat);
    for (let part_idx in children_mat) {
      console.log("part_str", children_mat[part_idx]);
      this.view_color_mat[children_mat[part_idx]] = show_color;
      this.view_show_mat[children_mat[part_idx]] = true; // 显示
    }
    console.log("this.view_show_mat", this.view_show_mat);
    this.setState({
      view_color_mat: this.view_color_mat,
      view_show_mat: this.view_show_mat,
    });
    this.ChineseMindView(this.props.mindmapping);
    this.props._getData(part_key0); // 返回传参
  };

  PathDrawTransform = (start_point, end_point) => {
    // 绘制特定曲线转换---截取中间固定长度绘制，旋转后的坐标组合
    let cut_line_len = 10; // 等于小圆直径--- 小半圆
    let min_radius = (cut_line_len / 2) * 1;
    let max_radius = cut_line_len; // 大圆半径----四分之一圆
    let rotate_angle =
      (Math.atan(
        (end_point[1] - start_point[1]) / (end_point[0] - start_point[0])
      ) *
        180) /
      Math.PI;
    let cut_start_point = this.GetLengthLoc(
      start_point,
      end_point,
      5 /
        Math.cos((rotate_angle / 180) * Math.PI) /
        Math.cos((rotate_angle / 180) * Math.PI)
    );
    // console.log("rotate_angle", rotate_angle);
    // 建立初始相对坐标
    let init_max_start_point_1 = [0, 0]; // 相对起点
    let init_max_end_point_1 = [max_radius, max_radius]; // 相对终点
    let init_max_rxy_point_1 = [max_radius, max_radius]; // 椭圆xy长度，可以考虑用椭圆参数生成其他类型----绘制圆弧
    let init_max_end_point_r_1 = this.PointRotate(
      init_max_start_point_1,
      init_max_end_point_1,
      -rotate_angle
    ); // 旋转角度----相对终点
    let init_min_start_point_1 = [0, 0];
    let init_min_end_point_1 = [-min_radius * 2, 0];
    let init_min_rxy_point_1 = [min_radius, min_radius];
    let init_min_end_point_r_1 = this.PointRotate(
      init_min_start_point_1,
      init_min_end_point_1,
      -rotate_angle
    ); // 旋转角度----相对终点
    let init_max_start_point_2 = [0, 0];
    let init_max_end_point_2 = [max_radius, -max_radius];
    let init_max_rxy_point_2 = [max_radius, max_radius];
    let init_max_end_point_r_2 = this.PointRotate(
      init_max_start_point_2,
      init_max_end_point_2,
      -rotate_angle
    ); // 旋转角度----相对终点
    let draw_path =
      "a" +
      init_max_rxy_point_1.join(",") +
      " 0 0,1 " +
      init_max_end_point_r_1.join(",") + // 四分之一圆弧
      "a" +
      init_min_rxy_point_1.join(",") +
      " 0 0,1 " +
      init_min_end_point_r_1.join(",") +
      "a" +
      init_max_rxy_point_2.join(",") +
      " 0 0,1 " +
      init_max_end_point_r_2.join(",");
    // a50,50 0 0,1 50,50 a25,25 0 0,1 -50,0 a50,50 0 0,1 50,-50
    let all_length = Math.sqrt(
      (cut_start_point[0] - end_point[0]) *
        (cut_start_point[0] - end_point[0]) +
        (cut_start_point[1] - end_point[1]) *
          (cut_start_point[1] - end_point[1])
    );
    // console.log("all_length", all_length);
    let end_len = (all_length - cut_line_len) / 2;
    let start_end_xy = this.GetLengthLoc(cut_start_point, end_point, end_len);
    let end_start_xy = this.GetLengthLoc(end_point, cut_start_point, end_len);
    // let draw_path2 = 'M' + start_point.join(',') + 'L' + start_end_xy.join(',') + draw_path + ' L ' + end_point.join(',')
    let draw_path2 =
      "M" +
      cut_start_point.join(",") +
      "L" +
      start_end_xy.join(",") +
      draw_path +
      " L " +
      end_point.join(",");
    return draw_path2;
  };

  PointRotate = (fixed_point, rotate_point, rotate_angle) => {
    // 坐标点绕点旋转、顺时针、逆时针:顺时针添加负号
    // 固定点、旋转点、旋转角度
    // 顺时针
    let rotate_radian = (rotate_angle / 180) * Math.PI;
    let new_x0 =
      (rotate_point[0] - fixed_point[0]) * Math.cos(-rotate_radian) -
      (rotate_point[1] - fixed_point[1]) * Math.sin(-rotate_radian) +
      fixed_point[0];
    let new_y0 =
      (rotate_point[0] - fixed_point[0]) * Math.sin(-rotate_radian) +
      (rotate_point[1] - fixed_point[1]) * Math.cos(-rotate_radian) +
      fixed_point[1];
    return [new_x0, new_y0];
  };

  GetLengthLoc = (start_point, end_point, cut_len) => {
    // 在某条直线上，以某个点到另一个点获得多长距离的一个点
    // 起点、终点、截取长度
    let line_abc = this.Line_ABC(start_point, end_point); // 直线参数
    // console.log('line_abc',line_abc, -line_abc[1]/line_abc[0])
    // 转换圆半径正余弦值求解
    let sin_value =
      line_abc[0] /
      Math.sqrt(line_abc[0] * line_abc[0] + line_abc[1] * line_abc[1]);
    let cos_value =
      -line_abc[1] /
      Math.sqrt(line_abc[0] * line_abc[0] + line_abc[1] * line_abc[1]); // 直角坐标和实际图形坐标y方向相反
    // console.log('cos_value/sin_value', cos_value, sin_value, cos_value/sin_value, )
    let cut_x1 = cut_len * cos_value + start_point[0];
    let cut_y1 = cut_len * sin_value + start_point[1];
    let cut_x2 = -cut_len * cos_value + start_point[0];
    let cut_y2 = -cut_len * sin_value + start_point[1];
    if (
      this.TwoPointDistance([cut_x1, cut_y1], end_point) <
      this.TwoPointDistance([cut_x2, cut_y2], end_point)
    ) {
      // 取短边----线段内交点
      // console.log('cut_x1,cut_y1', cut_x1,cut_y1, start_point,end_point)
      return [cut_x1, cut_y1];
    } else {
      // console.log('cut_x2,cut_y2', cut_x2,cut_y2, start_point,end_point)
      return [cut_x2, cut_y2];
    }
  };
  Line_ABC = (point_a, point_b) => {
    // 根据两点求直线Ax+By+C=0
    if (point_a[0] == point_b[0] && point_a[1] == point_b[1]) {
      // 同一点
      return false;
    } else if (point_a[0] == point_b[0]) {
      // 同 x，与y平行
      return [1, 0, -point_b[0]];
    } else if (point_a[1] == point_b[1]) {
      // 同 y， 与x平行
      return [0, 1, -point_a[1]];
    } else {
      // 斜线
      let line_k = (point_a[1] - point_b[1]) / (point_a[0] - point_b[0]);
      let line_c = point_a[1] - line_k * point_a[0];
      return [-line_k, 1, -line_c];
    }
  };
  TwoPointDistance = (point_a, point_b) => {
    // 求解两点之间的距离
    let x_div = point_a[0] - point_b[0];
    let y_div = point_a[1] - point_b[1];
    // console.log('x_div/y_div',x_div,y_div)
    return Math.sqrt(x_div * x_div + y_div * y_div);
  };

  CubicInterpolationFunc = (p) => {
    // 三次插值函数
    // let p=[[-340+400,-200+400],[-150+400,0+400],[0+400,-50+400],[100+400,-100+400],[250+400,-100+400],[350+400,-50+400]]
    let n = p.length;
    let b1 = 10;
    let bn = -10;
    let [h, lambda, mu, D] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    let [l, m, u] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]; // 追赶法
    let [M, K] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]; // 最高法过度矩阵
    let [a, b, c, d] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ]; //函数系数
    for (let ii = 0; ii < n - 1; ii++) {
      // console.log('ii',ii)
      h[ii] = p[ii + 1][0] - p[ii][0];
      // console.log(h)
    }
    for (let jj = 1; jj < n - 1; jj++) {
      lambda[jj] = h[jj - 1] / (h[jj - 1] + h[jj]);
      mu[jj] = h[jj] / (h[jj - 1] + h[jj]);
      D[jj] =
        (6 / (h[jj - 1] + h[jj])) *
        ((p[jj + 1][1] - p[jj][1]) / h[jj] -
          (p[jj][1] - p[jj - 1][1]) / h[jj - 1]);
    }
    D[0] = (6 * ((p[1][1] - p[0][1]) / h[0] - b1)) / h[0];
    D[5] = (6 * (bn - (p[5][1] - p[4][1]) / h[4])) / h[4];
    // console.log('h',h)
    // console.log('lambda',lambda)
    // console.log('mu',mu)
    // console.log('D',D)
    mu[0] = 1;
    lambda[5] = 1;
    // 追赶法求解三湾距方程
    l[0] = 2;
    u[0] = mu[0] / l[0];
    for (let ii = 1; ii < n; ii++) {
      m[ii] = lambda[ii];
      l[ii] = 2 - m[ii] * u[ii - 1];
      u[ii] = mu[ii] / l[ii];
    }
    K[0] = D[0] / l[0]; // 解LK=D
    for (let ii = 1; ii < n; ii++) {
      K[ii] = (D[ii] - m[ii] * K[ii - 1]) / l[ii];
    }
    M[n] = K[n]; // 解UM=K
    for (let ii = n - 2; ii >= 0; ii--) {
      M[ii] = K[ii] - u[ii] * M[ii + 1];
    }
    // 求解三次样条函数的系数
    for (let ii = 0; ii < n - 1; ii++) {
      a[ii] = p[ii][1];
      b[ii] =
        (p[ii + 1][1] - p[ii][1]) / h[ii] - h[ii] * (M[ii] / 3 + M[ii + 1] / 6);
      c[ii] = M[ii] / 2;
      d[ii] = (M[ii + 1] - M[ii]) / (6 * h[ii]);
    }

    let x_step = 5; // x步长
    let interpolat_xy = [];
    for (let ii = 0; ii < n - 1; ii++) {
      for (let init_x = p[ii][0]; init_x < p[ii + 1][0]; init_x += x_step) {
        let init_y =
          a[ii] +
          b[ii] * (init_x - p[ii][0]) +
          c[ii] * (init_x - p[ii][0]) * (init_x - p[ii][0]) +
          d[ii] *
            (init_x - p[ii][0]) *
            (init_x - p[ii][0]) *
            (init_x - p[ii][0]);
        // console.log('差值点求解', init_x,init_y)
        interpolat_xy.push([
          Math.round(init_x * 10) / 10,
          Math.round(init_y * 10) / 10,
        ]);
      }
    }
    return interpolat_xy;
  };

  createCurve = (originPoint, option) => {
    //控制点收缩系数 ，经调试0.6较好
    let scale = option.tension || 0.6;
    //平滑插值插入的最大点数
    let maxpoints = option.pointsPerSeg;
    let originCount = originPoint.length;
    let curvePoint = [];
    let midpoints = [];
    //生成中点
    for (let i = 0; i < originCount - 1; i++) {
      midpoints.push([
        (originPoint[i][0] + originPoint[i + 1][0]) / 2.0,
        (originPoint[i][1] + originPoint[i + 1][1]) / 2.0,
      ]);
    }
    console.log("中点", midpoints);
    //平移中点
    let extrapoints = [];
    for (let i = 1; i < originCount - 1; i++) {
      let backi = i - 1;
      let midinmid = [
        (midpoints[i][0] + midpoints[backi][0]) / 2.0,
        (midpoints[i][1] + midpoints[backi][1]) / 2.0,
      ];
      let offsetx = originPoint[i][0] - midinmid[0];
      let offsety = originPoint[i][1] - midinmid[1];
      let extraindex = 2 * i;
      extrapoints[extraindex] = [
        midpoints[backi][0] + offsetx,
        midpoints[backi][1] + offsety,
      ];
      //朝 originPoint[i]方向收缩
      let addx = (extrapoints[extraindex][0] - originPoint[i][0]) * scale;
      let addy = (extrapoints[extraindex][1] - originPoint[i][1]) * scale;
      extrapoints[extraindex] = [
        originPoint[i][0] + addx,
        originPoint[i][1] + addy,
      ];
      let extranexti = extraindex + 1;
      extrapoints[extranexti] = [
        midpoints[i][0] + offsetx,
        midpoints[i][1] + offsety,
      ];
      //朝 originPoint[i]方向收缩
      addx = (extrapoints[extranexti][0] - originPoint[i][0]) * scale;
      addy = (extrapoints[extranexti][1] - originPoint[i][1]) * scale;
      extrapoints[extranexti] = [
        originPoint[i][0] + addx,
        originPoint[i][1] + addy,
      ];
    }
    console.log("平移中点", extrapoints);
    // 新增平移中点
    let controlPoint = [];
    //生成4控制点，产生贝塞尔曲线
    for (let i = 0; i < originCount - 1; i++) {
      if (i == 0) {
        // 二次样条
        // console.log('头')
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2; // 新增控制点
        controlPoint[1] = extrapoints[extraindex];
        let nexti = i + 1;
        controlPoint[2] = originPoint[nexti]; // 已知固定点
        console.log("头控制点controlPoint", controlPoint);
        let fn = this.bezier2func;
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      } else if (i == originCount - 2) {
        // console.log('尾')
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2 * i; // 新增控制点
        controlPoint[1] = extrapoints[extraindex + 1];
        let nexti = i + 1;
        controlPoint[2] = originPoint[nexti]; // 已知固定点
        console.log("尾控制点controlPoint", controlPoint);
        let fn = this.bezier2func;
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      } else {
        controlPoint[0] = originPoint[i]; // 已知固定点
        let extraindex = 2 * i; // 新增控制点
        controlPoint[1] = extrapoints[extraindex + 1];
        let extranexti = extraindex + 2;
        controlPoint[2] = extrapoints[extranexti];
        let nexti = i + 1;
        controlPoint[3] = originPoint[nexti]; // 已知固定点
        console.log("控制点controlPoint", controlPoint);
        let fn = this.bezier3func;
        // let fn = this.bezier3func;
        let cp = this.intersects(
          controlPoint.slice(0, 2),
          controlPoint.slice(-2)
        );
        if (cp && this.isContains(controlPoint[0], controlPoint[1], cp)) {
          controlPoint[1] = cp;
        }

        if (cp && this.isContains(controlPoint[2], controlPoint[3], cp)) {
          controlPoint[2] = cp;
        }
        if (
          controlPoint[1][0] == controlPoint[2][0] &&
          controlPoint[1][1] == controlPoint[2][1]
        ) {
          fn = this.bezier2func;
          controlPoint.splice(1, 1);
        }
        for (var n = maxpoints; n >= 0; n--) {
          //存入曲线点
          curvePoint.push(fn(n / maxpoints, controlPoint));
        }
      }
    }
    return curvePoint;
  };

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
    return [partX, partY];
  };

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
    return [partX, partY];
  };

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
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    if (denom === 0) {
      //斜率一样，平行线
      return null;
    }
    const uA = numeA / denom;
    const uB = numeB / denom;
    const x = x1 + uA * (x2 - x1);
    const y = y1 + uA * (y2 - y1);
    return [x, y];
  };

  isContains = (sp, ep, p) => {
    return (
      ((p[0] > ep[0] && p[0] < sp[0]) || (p[0] > sp[0] && p[0] < ep[0])) &&
      ((p[1] > ep[1] && p[1] < sp[1]) || (p[1] > sp[1] && p[1] < ep[1]))
    );
  };

  CurePoint = () => {
    let point_mat = [
      [100, 100],
      [150, 100],
      [200, 100],
      [350, 150],
      [300, 200],
      [250, 150],
      [400, 100],
      [500, 100],
    ];
    // 过固定点bezier曲线
    let option = [];
    option.pointsPerSeg = 15;
    // console.log('option',option)
    let fixed_mat = this.createCurve(point_mat, option);
    console.log("--------", fixed_mat);
    all_svg_mat.push(
      <Polyline
        points={fixed_mat.join(",")} //多段线的各个点
        fill="none" //填充颜色 无
        stroke="black" //边框色
        strokeWidth="3" //边框宽度
      />
    );
    point_mat.forEach((part_xy) => {
      all_svg_mat.push(
        <Circle
          cx={part_xy[0]} //中心点x
          cy={part_xy[1]} //中心点y
          r="5" //半径
          stroke="black" //外边框 颜色
          strokeWidth="2.5" //外边框 宽度
          fill="#9C6004" //填充颜色
        />
      );
    });
  };
  render() {
    // 连线题：智能组题
    console.log("组件初始状态--------------");
    // this.all_choice_svg = this.ChineseChoiceSVG(do_exercises_dict)   this.frame_min_y
    // this.ChineseMindView(this.props.mindmapping)
    this.ChineseMindView(this.props.mindmapping);

    // let frame_height = this.frame_max_y - this.frame_min_y
    let frame_height = this.frame_max_y;
    let frame_width = pxToDp(1900);
    return (
      <View
        style={{
          width: frame_width,
          height: frame_height,
          top: 0,
          left: 0,
          backgroundColor: "transparent",
        }}
      >
        <Svg
          style={{
            width: frame_width,
            height: frame_height,
            backgroundColor: "transparent",
            top: 0,
            left: 0,
            position: "absolute",
          }}
        >
          {this.all_choice_svg}
        </Svg>
        <View
          style={{
            width: frame_width,
            height: frame_height,
            top: 0,
            left: 0,
            backgroundColor: "transparent",
            position: "absolute",
          }}
        >
          {this.all_choice_view}
        </View>
      </View>
    );
  }
}

export default ChineseMindMapping;
const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9C6004",
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  btn1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  button3: {
    //
    borderColor: "black",
    borderWidth: 1,
    //  borderRadius:5,
    fontSize: 25,
    // alignSelf:'flex-start',
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    position: "absolute",
    alignSelf: "flex-start",
  },
});
