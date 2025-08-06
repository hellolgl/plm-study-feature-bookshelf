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
  Image,
  TouchableOpacity,
  PanResponder,
  ART,
  ImageBackground,
} from "react-native";
// import Util from './common/util'
import Svg, {
  Line,
  Path,
  Rect,
  Polygon,
  Text as SText,
  Circle,
  Ellipse,
  Polyline,
} from "react-native-svg";
import _ from "lodash";
import { pxToDp, size_tool } from "../../../util/tools";
import { sizeObj } from "./size";
import { appStyle, appFont } from "../../../theme";
import Audio from "../../../util/audio";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import { connect } from "react-redux";
import NavigationUtil from "../../../navigator/NavigationUtil";
class PinYinModule extends Component {
  constructor(props) {
    super(props);
    this.allPoint = "";
    this.line_start_x = -1;
    this.line_start_y = -1;
    this.line_end_x = -1;
    this.line_end_y = -1;
    this.temp_point_mat = [];
    this.all_point_mat = [];
    this.stroke_width = this.props.stroke_width; //线条宽度
    this.blank_view_color = "white"; // 空白区域填充颜色
    this.state = {
      // drawPath: 'M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25'
      drawPath: "", // 绘制轨迹
      draw_all_svg: [], // 全局线条绘制
      draw_temp_svg: [], // 临时轨迹线
      opsity: 0,
      pausedSuccess: true,
    };
    this.successAudiopath = require("../../../res/data/good.mp3");
  }
  componentWillMount() {
    // 初始化渲染
    // 引用类计算
    this.CombinePinYinView(); // 组合拼音字符串数据
    this._panResponderDrawLine = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
        console.log("手指开始接触====111111111", evt.nativeEvent);
        // let tempfirstX = evt.nativeEvent.pageX     // 页面坐标
        // let tempFirstY = evt.nativeEvent.pageY
        let tempfirstX = evt.nativeEvent.locationX; // 组件坐标
        let tempFirstY = evt.nativeEvent.locationY;
        let page_x = evt.nativeEvent.pageX; // 页面坐标
        let page_y = evt.nativeEvent.pageY;
        this.line_start_x = Math.round(tempfirstX * 100) / 100;
        this.line_start_y = Math.round(tempFirstY * 100) / 100;
        this.div_page_x = Math.round((page_x - tempfirstX) * 100) / 100; // 页面和组件相差
        this.div_page_y = Math.round((page_y - tempFirstY) * 100) / 100;
        this.temp_point_mat.push([this.line_start_x, this.line_start_y]);
      },

      onPanResponderMove: (evt, gestureState) => {
        // console.log('移动响应==========================================')
        // 最近一次的移动距离为gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        console.log("越界判定手指移动接触====111111111", evt.nativeEvent);
        let pointX = evt.nativeEvent.locationX;
        let pointY = evt.nativeEvent.locationY;
        this.line_end_x = Math.round(pointX * 100) / 100;
        this.line_end_y = Math.round(pointY * 100) / 100;
        let page_x = evt.nativeEvent.pageX; // 页面坐标
        let page_y = evt.nativeEvent.pageY;
        this.line_end_x = page_x - this.div_page_x; // 页面定义
        this.line_end_y = page_y - this.div_page_y;
        console.log(
          "越界判定this.line_end_x",
          this.line_end_x,
          this.line_end_y
        );
        if (
          this.line_end_x > 0 &&
          this.line_end_x < 800 &&
          this.line_end_y > 0 &&
          this.line_end_y < 500
        ) {
          this.temp_point_mat.push([this.line_end_x, this.line_end_y]);
        } else if (
          this.line_end_x > 0 &&
          this.line_end_x < 800 &&
          this.line_end_y >= 500
        ) {
          this.temp_point_mat.push([this.line_end_x, 500]);
        } else if (
          this.line_end_x > 0 &&
          this.line_end_x < 800 &&
          this.line_end_y <= 0
        ) {
          this.temp_point_mat.push([this.line_end_x, 0]);
        } else if (
          this.line_end_x >= 800 &&
          this.line_end_y > 0 &&
          this.line_end_y < 500
        ) {
          this.temp_point_mat.push([800, this.line_end_y]);
        } else if (
          this.line_end_x <= 0 &&
          this.line_end_y > 0 &&
          this.line_end_y < 500
        ) {
          this.temp_point_mat.push([0, this.line_end_y]);
        }
        this.props._getData({
          temp_data: this.temp_point_mat,
          all_data: this.all_point_mat,
        }); // 返回传参
        // 绘制临时线
        let temp_svg_mat = this.DrawPointMat({
          point_mat: this.temp_point_mat,
          stroke_width: this.stroke_width,
          stroke_color: "#FDE46F",
          fill_color: "#FDE46F",
        });
        this.setState({
          draw_temp_svg: temp_svg_mat, // 绘制零时轨迹线
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        console.log("渲染点击点", this.line_start_x, this.line_start_y);
        this.all_point_mat.push(this.temp_point_mat);
        // 添加数据判定---是否绘制不同的颜色和返回值

        // 渲染全局数据
        let draw_all_svg_mat = this.DrawAllPointMat({
          all_point_mat: this.all_point_mat,
          stroke_color: "#FD9390",
          fill_color: "#FD9390",
          stroke_width: this.stroke_width,
        });
        //
        this.temp_point_mat = []; // 释放更新
        this.props._getData({
          temp_data: this.temp_point_mat,
          all_data: this.all_point_mat,
        }); // 返回传参
        this.setState({
          draw_temp_svg: [],
          draw_all_svg: [draw_all_svg_mat],
        });
        // this.uploadData()
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
  }

  componentDidMount() {
    console.log("后渲染");
  }

  uploadData = () => {
    if (this.all_point_mat.length > 0) {
      // this.setState({
      //   opsity: 1,
      //   // pausedSuccess: false
      // })
      axios
        .post(api.savePinyinListenAndWRiteStatus, {
          write_status: "1",
          p_id: this.props.p_id,
        })
        .then((res) => {
          console.log("返回来", res.data);
          if (res.data.err_code === 0) {
            if (res.data.data.tag) {
              this.props.showStar();
            }
          }
        });
    } else {
      // this.setState({
      //   opsity: 1,
      //   // pausedSuccess: true
      // })
    }
  };

  DrawPointMat = ({
    point_mat,
    stroke_color = "red",
    stroke_width = 8,
    fill_color = "none",
    stroke_opacity = 1,
  }) => {
    /**
     * @description 绘制点矩阵数据
     * @param point_mat 点阵：[[img_x0,img_y0],[img_x1,img_y1],....]
     */
    let point_svg_mat = [];
    for (let idx = 0; idx < point_mat.length; idx++) {
      // 绘制单点
      point_svg_mat.push(
        <Circle
          cx={point_mat[idx][0]} //x轴的开始位置
          cy={point_mat[idx][1]} //y轴的开始位置
          r={stroke_width / 2} //半径
          fill={fill_color} //填充颜色
          // strokeWidth={stroke_width}  //外边框 宽度
          // stroke={stroke_color}　　//外边框 颜色
        />
      );
      // 画线
      if (idx > 0) {
        point_svg_mat.push(
          <Line
            x1={point_mat[idx - 1][0]} // x轴的开始位置
            y1={point_mat[idx - 1][1]} // y轴的开始位置
            x2={point_mat[idx][0]} // x轴的结束位置
            y2={point_mat[idx][1]} // y轴的结束位置
            stroke={stroke_color} //填充颜色
            strokeWidth={stroke_width} //填充宽度
            // strokeDasharray={dash_mat}
            // strokeOpacity={stroke_opacity}  // 线条透明度
          />
        );
      }
    }
    return point_svg_mat;
  };
  DrawAllPointMat = ({
    all_point_mat,
    stroke_color = "red",
    stroke_width = 8,
    fill_color = "none",
    stroke_opacity = 1,
  }) => {
    /**
     * @description 绘制所有数据 点矩阵
     * @param all_point_mat 点阵：[[[img_x0,img_y0],[img_x1,img_y1],....],[[img_x0,img_y0],[img_x1,img_y1],....],...]
     */
    let all_point_svg_mat = [];
    for (let idx = 0; idx < all_point_mat.length; idx++) {
      //
      all_point_svg_mat.push(
        this.DrawPointMat({
          point_mat: all_point_mat[idx],
          stroke_width: stroke_width,
          stroke_color: stroke_color,
          fill_color: fill_color,
        })
      );
    }

    return all_point_svg_mat;
  };
  RollbackData = () => {
    /**
     * @description 回退一组数据
     */
    this.all_point_mat.pop();
    let draw_all_svg_mat = this.DrawAllPointMat({
      all_point_mat: this.all_point_mat,
      stroke_color: "#FD9390",
      stroke_width: this.stroke_width,
      fill_color: "#FD9390",
    });
    //
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [draw_all_svg_mat],
      opsity: 0,
    });
  };
  clear = () => {
    /**
     * @description 回退一组数据
     */
    this.all_point_mat = [];
    let draw_all_svg_mat = this.DrawAllPointMat({
      all_point_mat: this.all_point_mat,
      stroke_color: "#FD9390",
      stroke_width: this.stroke_width,
      fill_color: "#FD9390",
    });
    //
    this.setState({
      draw_temp_svg: [],
      draw_all_svg: [draw_all_svg_mat],
      opsity: 0,
    });
  };
  CombinePinYinView = () => {
    /**
     * @description 组合字符串图形
     */
    let combine_view_mat = [];
    // for (let idx = 0; idx < this.props.pinyin_mat.length; idx++) {
    this.props.pinyin_mat.forEach((item, index) => {
      let width = sizeObj[item].width;
      combine_view_mat.push(
        <View
          style={{
            width: pxToDp(width),
            height: this.props.height,
            // marginLeft: pxToDp(-1),
          }}
        >
          <View style={{ width: pxToDp(width), height: this.props.height }}>
            <Image
              style={{
                width: pxToDp(width + 1),
                height: this.props.height,
              }}
              source={this.props.img_resource_mat[item]}
            />
          </View>
        </View>
      );
    });

    // }
    // }

    let all_combine_view = (
      <View
        style={{
          height: this.props.height,
          backgroundColor: "transparent",
          flexDirection: "row",
          width: this.props.width,
          // backgroundColor: 'rgba(0,255,0,0.1)',
          justifyContent: "center",
        }}
      >
        {/* <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }]}></View> */}
        {combine_view_mat}
        {/* <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }]}></View> */}
      </View>
    );

    this.combine_view_mat = _.cloneDeep(all_combine_view);
    this.four_line_mat = (
      <View
        style={{
          width: this.props.width,
          height: this.props.height,
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "transparent",
        }}
      >
        {/* <Image style={{ width: 1000, height: height, backgroundColor: 'green', top: 0, left: 0, position: 'absolute' }} source={require('./pugongy.jpeg')} /> */}
        <Svg
          style={{
            width: this.props.width,
            height: this.props.height,
            backgroundColor: "transparent",
            top: 0,
            left: 0,
            position: "absolute",
          }}
        >
          <Line
            x1={0} // x轴的开始位置
            y1={100} // y轴的开始位置
            x2={this.props.width} // x轴的结束位置
            y2={100} // y轴的结束位置
            stroke={"black"} //填充颜色
            strokeWidth={3} //填充宽度
            // strokeDasharray={dash_mat}
            // strokeOpacity={stroke_opacity}  // 线条透明度
          />
          <Line
            x1={0} // x轴的开始位置
            y1={200} // y轴的开始位置
            x2={this.props.width} // x轴的结束位置
            y2={200} // y轴的结束位置
            stroke={"black"} //填充颜色
            strokeWidth={3} //填充宽度
            // strokeDasharray={dash_mat}
            // strokeOpacity={stroke_opacity}  // 线条透明度
          />
          <Line
            x1={0} // x轴的开始位置
            y1={300} // y轴的开始位置
            x2={this.props.width} // x轴的结束位置
            y2={300} // y轴的结束位置
            stroke={"black"} //填充颜色
            strokeWidth={3} //填充宽度
            // strokeDasharray={dash_mat}
            // strokeOpacity={stroke_opacity}  // 线条透明度
          />
          <Line
            x1={0} // x轴的开始位置
            y1={400} // y轴的开始位置
            x2={this.props.width} // x轴的结束位置
            y2={400} // y轴的结束位置
            stroke={"black"} //填充颜色
            strokeWidth={3} //填充宽度
            // strokeDasharray={dash_mat}
            // strokeOpacity={stroke_opacity}  // 线条透明度
          />
        </Svg>
      </View>
    );
  };

  render() {
    const { opsity, pausedSuccess } = this.state;
    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: this.props.width,
            height: this.props.height,
            backgroundColor: "#FFFAE5",
          }}
        >
          <View
            style={{
              width: this.props.width,
              height: this.props.height,
              position: "absolute",
              left: 0,
              backgroundColor: "transparent",
            }}
          >
            <Svg
              style={{
                width: this.props.width,
                height: this.props.height,
                backgroundColor: "transparent",
                top: 0,
                left: 0,
                position: "absolute",
              }}
            >
              {
                this.state.draw_all_svg //  全图像
              }
            </Svg>
            <Svg
              style={{
                width: this.props.width,
                height: this.props.height,
                backgroundColor: "transparent",
                top: 0,
                left: 0,
                position: "absolute",
              }}
            >
              {
                this.state.draw_temp_svg //  临时图像
              }
            </Svg>
          </View>
          {/* <Image style={{ width: this.props.width, height: this.props.height, position: 'absolute', top: 0, left: 0 }}
            resizeMode='stretch' // contain, stretch,center             // source={require('./b1.png')} />
            // source={require('./caoyuan.jpeg')} />
            source={this.props.img_uri.uri.length > 0 ? this.props.img_uri : this.props.img_resource}
          // source={require('./test1.png')}
          /> */}
          <View
            style={{
              width: this.props.width,
              height: this.props.height,
              position: "absolute",
              top: pxToDp(0),
              left: 0,
              // backgroundColor: 'transparent',
              alignItems: "center",
              backgroundColor: `rgba(253,147,144,${opsity})`,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {this.combine_view_mat}
          </View>

          <View
            style={{
              width: this.props.width,
              height: this.props.height,
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "transparent",
            }}
            {...this._panResponderDrawLine.panHandlers}
          ></View>
        </View>
        <View
          style={[
            appStyle.flexTopLine,
            { position: "absolute", bottom: pxToDp(-50), zIndex: 999 },
          ]}
        >
          {/* <TouchableOpacity style={{ height: pxToDp(79), width: pxToDp(200), marginRight: pxToDp(40) }}
            onPress={() => this.RollbackData()}>
            <ImageBackground source={require('../../../images/chineseHomepage/pingyin/writeBtn.png')}
              style={[size_tool(194, 79), appStyle.flexCenter]}
            >
              <Text style={[{ fontSize: pxToDp(40), color: "#A86A33" }, appFont.fontFamily_syst]}> 撤回</Text>

            </ImageBackground>
          </TouchableOpacity> */}
          {this.state.draw_all_svg.length === 0 ? (
            <TouchableOpacity
              style={{
                height: pxToDp(120),
                width: pxToDp(120),
                marginRight: pxToDp(40),
              }}
            >
              <Image
                source={require("../../../images/chineseHomepage/pingyin/new/pinyinUnWiteClear.png")}
                style={[size_tool(120), appStyle.flexCenter]}
              ></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                height: pxToDp(120),
                width: pxToDp(120),
                marginRight: pxToDp(40),
              }}
              onPress={() => this.clear()}
            >
              <Image
                source={require("../../../images/chineseHomepage/pingyin/new/pinyinWiteClear.png")}
                style={[size_tool(120), appStyle.flexCenter]}
              ></Image>
            </TouchableOpacity>
          )}

          {this.state.draw_all_svg.length === 0 ? (
            <TouchableOpacity
              style={{ width: pxToDp(200), height: pxToDp(120) }}
              onPress={() => {
                const { token, resetToLogin } = this.props;
                if (!token && resetToLogin) {
                  resetToLogin();
                  return;
                }
                if (this.all_point_mat.length > 0) {
                  this.setState({
                    opsity: 1,
                    // pausedSuccess: false
                  });
                  axios
                    .post(api.savePinyinListenAndWRiteStatus, {
                      write_status: "1",
                      p_id: this.props.p_id,
                    })
                    .then((res) => {
                      console.log("返回来", res.data);
                      if (res.data.err_code === 0) {
                        if (res.data.data.tag) {
                          this.props.showStar();
                        }
                      }
                    });
                } else {
                  this.setState({
                    opsity: 1,
                    // pausedSuccess: true
                  });
                }
              }}
            >
              <Image
                source={require("../../../images/chineseHomepage/pingyin/new/unfinish.png")}
                style={[size_tool(200, 120), appStyle.flexCenter]}
                resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                width: pxToDp(200),
                height: pxToDp(120),
              }}
              onPress={() => {
                const { token, resetToLogin } = this.props;
                if (!token && resetToLogin) {
                  resetToLogin();
                  return;
                }
                console.log("返回来----");
                if (this.all_point_mat.length > 0) {
                  this.setState({
                    opsity: 1,
                    // pausedSuccess: false
                  });
                  axios
                    .post(api.savePinyinListenAndWRiteStatus, {
                      write_status: "1",
                      p_id: this.props.p_id,
                    })
                    .then((res) => {
                      console.log("返回来", res.data);
                      if (res.data.err_code === 0) {
                        if (res.data.data.tag) {
                          this.props.showStar();
                        }
                      }
                    });
                } else {
                  this.setState({
                    opsity: 1,
                    // pausedSuccess: true
                  });
                }
              }}
            >
              <Image
                source={require("../../../images/chineseHomepage/pingyin/new/finish.png")}
                style={[size_tool(200, 120), appStyle.flexCenter]}
                resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          )}
        </View>
        <Audio
          isLocal={true}
          uri={this.successAudiopath}
          paused={pausedSuccess}
          pausedEvent={() => this.setState({ pausedSuccess: true })}
          ref={this.audio1}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.getIn(["userInfo", "token"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(PinYinModule);
