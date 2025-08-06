/* eslint-disable */
/**
 * 图与数：Svg图形绘制
 * Created by on 2022/07/13.
 *
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, PanResponder, ART, ImageBackground } from 'react-native'
import Svg, { Line, Path, Rect, Polygon, Text as SText, Circle, Ellipse, Polyline } from "react-native-svg";
var _ = require('lodash')

export class DrawSvgClass {
    /**
     * @description 绘制图形
     */

    constructor(width, height) {
        /**
         * @description 初始化一些颜色、宽度、字体等
         */
        this.gridding_width = width     // 网格SVG宽度
        this.gridding_height = height
        this.choice_color = 'red'       // 选中颜色
        this.un_choice_color = 'black'  // 未选中颜色
        this.stroke_red = 'black'         // 指定线条颜色
        this.stroke_black = '#C8F5FF'
        this.stroke_width = 2           // 线条宽度
        this.stroke_opacity = 0.1          // 线条宽度
    }

    DrawGriddingSvg = (img_x_mat, img_y_mat, origin_mat = []) => {
        /**
         * @description 绘制网格图
         * @param img_x_mat x轴像素点坐标---[x0,x1,x2]---左往右
         * @param img_y_mat y轴像素点坐标---[y0,y1,y2]---下往上
         * @param origin_mat 坐标系原点坐标---[origion_x, origion_y]
         */
        // 绘制端点线网格
        this.gridding_svg_mat = []
        for (let idx = 0; idx < img_x_mat.length; idx++) {
            // console.log('----------')
            this.gridding_svg_mat.push(
                // this.DrawLineSvg([img_x_mat[idx], 0], [img_x_mat[idx], img_y_mat[0]], this.stroke_black, this.stroke_width)
                this.DeconstructionDrawLineSvg({
                    point_a_mat: [img_x_mat[idx], 0],
                    point_b_mat: [img_x_mat[idx], img_y_mat[0]],
                    stroke_color: this.stroke_black,
                    stroke_opacity: 1,
                    stroke_width: idx % 5 === 0 ? 2 : 2
                })
            )
            if (idx % 5 === 0) {
                this.gridding_svg_mat.push(this.DrawTextSvg(idx, [img_x_mat[idx], img_y_mat[0] + 20], 20, 'black'))
            }
        }
        for (let idx = 0; idx < img_y_mat.length; idx++) {
            this.gridding_svg_mat.push(
                // this.DrawLineSvg([img_x_mat[0], img_y_mat[idx]], [this.gridding_width, img_y_mat[idx]], this.stroke_black, this.stroke_width)
                this.DeconstructionDrawLineSvg({
                    point_a_mat: [img_x_mat[0], img_y_mat[idx]],
                    point_b_mat: [this.gridding_width, img_y_mat[idx]],
                    stroke_color: this.stroke_black,
                    stroke_opacity: 1,
                    stroke_width: idx % 5 === 0 ? 2 : 2
                })
            )
            if (idx % 5 === 0) {
                this.gridding_svg_mat.push(this.DrawTextSvg(idx, [img_x_mat[0] - 15, img_y_mat[idx] + 20 * 0.3], 20, 'black'))
            }
        }
        if (origin_mat.length > 50) {
            // 原点绘制
            this.gridding_svg_mat.push(
                this.DeconstructionDrawPointSvg({
                    point_mat: origin_mat,
                    radius: 6,
                    fill_color: 'black' // 选中图形绘制
                })
            )
        }
    }

    DrawGridPointSvg = (img_x_mat, img_y_mat, origin_mat = []) => {
        /**
         * @description 绘制网点图
         * @param img_x_mat x轴像素点坐标---[x0,x1,x2]---左往右
         * @param img_y_mat y轴像素点坐标---[y0,y1,y2]---下往上
         * @param origin_mat 坐标系原点坐标---[origion_x, origion_y]
         */
        // 绘制端点线网格
        this.gridpoint_svg_mat = []
        for (let idx_x = 0; idx_x < img_x_mat.length; idx_x++) {
            // console.log('----------')
            for (let idx_y = 0; idx_y < img_y_mat.length; idx_y++) {
                this.gridpoint_svg_mat.push(
                    this.DeconstructionDrawPointSvg({
                        point_mat: [img_x_mat[idx_x], img_y_mat[idx_y]],
                        radius: 3,
                    })
                )
            }
        }
        if (origin_mat.length > 0) {
            // 原点绘制
            this.gridpoint_svg_mat.push(
                this.DeconstructionDrawPointSvg({
                    point_mat: origin_mat,
                    radius: 6,
                    fill_color: 'black' // 选中图形绘制
                })
            )
        }
    }

    DrawTextSvg = (text_str, loc_mat, font_size, stroke_color) => {
        /**
         * @description 绘制文本
         * @param text_str 文本字符串
         * @param loc_mat  文本坐标
         * @param font_size 文本大小
         * @param stroke_color 文本颜色
         */
        return (
            <SText
                fill={stroke_color}
                stroke={stroke_color}
                fontSize={font_size}
                // fontWeight="bold"
                x={loc_mat[0]}
                y={loc_mat[1]}
                textAnchor="middle"
            >{text_str}</SText>)
    }

    DrawPointSvg = (point_mat, radius = 5, fill_color = 'black', stroke_width = 3, stroke_color = 'transparent') => {
        /**
         * @description 绘制点
         * @param point_mat:点坐标[x,y]：像素值
         * @param radius:绘制点半径：像素值
         * @param fill_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         */
        return (
            <Circle
                cx={point_mat[0]}   //x轴的开始位置
                cy={point_mat[1]}  //y轴的开始位置
                r={radius}    //半径
                fill={fill_color}   //填充颜色
                strokeWidth={stroke_width}  //外边框 宽度
                stroke={stroke_color}　　//外边框 颜色　　
            />)
    }

    DeconstructionDrawPointSvg = ({ point_mat, radius = 5, fill_color = 'black', stroke_width = 3, stroke_color = 'transparent' }) => {
        /**
         * @description 绘制点----解构赋值
         * @param point_mat:点坐标[x,y]：像素值
         * @param radius:绘制点半径：像素值
         * @param fill_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         */
        return (
            <Circle
                cx={point_mat[0]}   //x轴的开始位置
                cy={point_mat[1]}  //y轴的开始位置
                r={radius}    //半径
                fill={fill_color}   //填充颜色
                strokeWidth={stroke_width}  //外边框 宽度
                stroke={stroke_color}   //外边框 颜色　　
            />)
    }

    DrawLineSvg = (point_a_mat, point_b_mat, stroke_color = 'black', stroke_width = 3, dash_mat = [1, 0], stroke_opacity = 1) => {
        /**
         * @description 绘制线
         * @param point_a_mat:点a坐标[x,y]：像素值
         * @param point_b_mat:点b坐标[x,y]：像素值
         * @param stroke_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param dash_mat:虚线绘制数组：[实线长度,虚线长度]
         * @param stroke_opacity：线条透明度：0~1
         */
        return (
            <Line
                x1={point_a_mat[0]}   // x轴的开始位置
                y1={point_a_mat[1]}   // y轴的开始位置
                x2={point_b_mat[0]}   // x轴的结束位置
                y2={point_b_mat[1]}   // y轴的结束位置
                stroke={stroke_color}  //填充颜色
                strokeWidth={stroke_width}  //填充宽度
                strokeDasharray={dash_mat}
                strokeOpacity={stroke_opacity}  // 线条透明度
            />
        )
    }
    DeconstructionDrawLineSvg = ({ point_a_mat, point_b_mat, stroke_color = 'black', stroke_width = 3, dash_mat = [1, 0], stroke_opacity = 1 }) => {
        /**
         * @description 绘制线----解构赋值
         * @param point_a_mat:点a坐标[x,y]：像素值
         * @param point_b_mat:点b坐标[x,y]：像素值
         * @param stroke_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param dash_mat:虚线绘制数组：[实线长度,虚线长度]
         * @param stroke_opacity：线条透明度：0~1
         */
        return (
            <Line
                x1={point_a_mat[0]}   // x轴的开始位置
                y1={point_a_mat[1]}   // y轴的开始位置
                x2={point_b_mat[0]}   // x轴的结束位置
                y2={point_b_mat[1]}   // y轴的结束位置
                stroke={stroke_color}  //填充颜色
                strokeWidth={stroke_width}  //填充宽度
                strokeDasharray={dash_mat}
                strokeOpacity={stroke_opacity}  // 线条透明度
            />
        )
    }

    DrawPolylineSvg = (polyline_mat, stroke_color = 'black', stroke_width = 3, fill_color = 'none', stroke_opacity = 1, dash_mat = [1, 0]) => {
        /**
         * @description 绘制多线条
         * @param polyline_mat:多线条数据：[[x0,y0],[x1,y1],[x2,y2],...]
         * @param fill_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         * @param stroke_opacity: 线条透明度：0~1
         * @param dash_mat:虚线绘制数组：[实线长度,虚线长度]
         */
        return (
            <Polyline
                points={polyline_mat.join(' ')}  //多段线的各个点
                stroke={stroke_color}  //填充颜色
                strokeWidth={stroke_width}  //填充宽度
                fill={fill_color}   //填充颜色 无
                strokeDasharray={dash_mat}
                strokeOpacity={stroke_opacity}
            />
        )
    }

    DeconstructionDrawPolylineSvg = ({ polyline_mat, stroke_color = 'black', stroke_width = 3, fill_color = 'none', stroke_opacity = 1, dash_mat = [1, 0] }) => {
        /**
         * @description 绘制多线条
         * @param polyline_mat:多线条数据：[[x0,y0],[x1,y1],[x2,y2],...]
         * @param fill_color：填充颜色：color_str
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         * @param stroke_opacity: 线条透明度：0~1
         * @param dash_mat:虚线绘制数组：[实线长度,虚线长度]
         */
        return (
            <Polyline
                points={polyline_mat.join(' ')}  //多段线的各个点
                stroke={stroke_color}  //填充颜色
                strokeWidth={stroke_width}  //填充宽度
                fill={fill_color}   //填充颜色 无
                strokeDasharray={dash_mat}
                strokeOpacity={stroke_opacity}
            />
        )
    }

    DrawPolygonSvg = (polygon_mat, stroke_color = 'black', stroke_width = 3, fill_color = 'black', fill_opacity = 1) => {
        /**
         * @description 绘制多边形
         * @param polygon_mat:多边形数据：[[x0,y0],[x1,y1],[x2,y2],...]
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         * @param fill_opacity:填充透明度：0~1 
         * @param fill_color：填充颜色：color_str
         */
        return (
            <Polygon
                points={polygon_mat.join(' ')}  //多边形的每个角的x和y坐标
                stroke={stroke_color}   //外边框颜色
                strokeWidth={stroke_width}   //外边框宽度
                fill={fill_color}     //填充颜色
                fillOpacity={fill_opacity}
            />)
    }

    DeconstructionDrawPolygonSvg = ({ polygon_mat, stroke_color = 'black', stroke_width = 3, fill_color = 'black', fill_opacity = 1 }) => {
        /**
         * @description 绘制多边形---解构赋值
         * @param polygon_mat:多边形数据：[[x0,y0],[x1,y1],[x2,y2],...]
         * @param stroke_width：线条宽度：像素值
         * @param stroke_color：线条颜色：color_str
         * @param fill_opacity:填充透明度：0~1 
         * @param fill_color：填充颜色：color_str
         */
        return (
            <Polygon
                points={polygon_mat.join(' ')}  //多边形的每个角的x和y坐标
                stroke={stroke_color}   //外边框颜色
                strokeWidth={stroke_width}   //外边框宽度
                fill={fill_color}     //填充颜色
                fillOpacity={fill_opacity}
            />)
    }

    DrawAllGraph = (all_graph_img_data, graph_choice_idx = -1, un_choice_color = 'black', choice_color = 'red') => {
        /**
         * @description 绘制所有图形
         * @param all_graph_img_data:所有图形组坐标点数据---未涉及到圆：[[[x0,y0],[x1,y1],...],[[x0,y0],[x1,y1],[x2,y2],...],...]
         * @param graph_choice_idx:选中图形---修改颜色
         * @param un_choice_color:未选中颜色
         * @param choice_color:选中颜色
         */
        let all_graph_svg_mat = []  // 所有图形绘制Svg
        for (let idx = 0; idx < all_graph_img_data.length; idx++) {
            // 遍历图形组
            if (all_graph_img_data[idx].length === 1) {
                // 绘制点
                all_graph_svg_mat.push(
                    this.DeconstructionDrawPointSvg({
                        point_mat: all_graph_img_data[idx][0],
                        fill_color: idx === graph_choice_idx ? 'red' : 'black' // 选中图形绘制
                    }))
            }
            else if (all_graph_img_data[idx].length === 2) {
                // 绘制直线
                console.log('直线')
                all_graph_svg_mat.push(
                    this.DeconstructionDrawLineSvg({
                        point_a_mat: all_graph_img_data[idx][0],
                        point_b_mat: all_graph_img_data[idx][1],
                        stroke_color: idx === graph_choice_idx ? 'red' : un_choice_color
                    }))
            }
            else if (all_graph_img_data[idx].length >= 3) {
                // 绘制多边形---封闭图形---polygon
                all_graph_svg_mat.push(
                    this.DeconstructionDrawPolygonSvg({
                        polygon_mat: all_graph_img_data[idx],
                        stroke_color: idx === graph_choice_idx ? 'black' : un_choice_color,
                        fill_color: idx === graph_choice_idx ? 'red' : 'transparent',
                        fill_opacity: 0.2
                    }))
            }
            else {
                all_graph_svg_mat.push([])
            }
        }
        return all_graph_svg_mat
    }

    DrawAllPointSvg = (all_graph_img_data, graph_choice_idx = -1, un_choice_color = 'black', choice_color = 'red') => {
        /**
         * @description 绘制所有图形点数据
         * @param all_graph_img_data:所有图形组坐标点数据---未涉及到圆：[[[x0,y0],[x1,y1],...],[[x0,y0],[x1,y1],[x2,y2],...],...]
         * @param graph_choice_idx:选中图形---修改颜色
         * @param un_choice_color:未选中颜色
         * @param choice_color:选中颜色
         */
        let all_graph_svg_mat = []  // 所有图形绘制Svg
        for (let idx = 0; idx < all_graph_img_data.length; idx++) {
            // 遍历图形组
            for (let p_idx = 0; p_idx < all_graph_img_data[idx].length; p_idx++) {
                // 绘制点
                // console.log('')
                all_graph_svg_mat.push(
                    this.DeconstructionDrawPointSvg({
                        point_mat: all_graph_img_data[idx][p_idx],
                        fill_color: idx === graph_choice_idx ? choice_color : un_choice_color // 选中图形绘制
                    })
                )
            }
        }
        return all_graph_svg_mat
    }

    DrawAllPolylineGraph = (all_polyline_mat, stroke_color) => {
        /**
         * @description 绘制所有多线条组
         * 
         */
        let all_polyline_svg = []
        for (let idx = 0; idx < all_polyline_mat.length; idx++) {
            all_polyline_svg.push(this.DeconstructionDrawPolylineSvg({ polyline_mat: all_polyline_mat[idx], stroke_color: stroke_color }))
        }
        return all_polyline_svg
    }

    DrawSequentialPoints = (single_points_mat) => {
        /**
         * @description 单组连续点图形绘制
         * @param single_points_mat 单组连续点坐标:[[img_x0,img_y0],[img_x1,img_y1],...]
         */
        let single_svg_mat = []
        if (single_points_mat.length > 0) {
            for (let idx = 0; idx < single_points_mat.length; idx++) {
                single_svg_mat.push(
                    this.DeconstructionDrawPointSvg({
                        point_mat: single_points_mat[idx],
                        radius: 4,
                        fill_color: 'black' // 选中图形绘制
                    })
                )
            }
        }
        return single_svg_mat
    }

    AllSequentialPoints = (all_points_mat) => {
        /**
         * @description 绘制所有图形组下的端点
         * @param all_points_mat 所有序列点组:[[[img_x0,img_y0],[img_x1,img_y1],...],[[img_x0,img_y0],[img_x1,img_y1],...]]
         */
        // 
        let all_svg_mat = []
        for (let idx = 0; idx < all_points_mat.lengthl; idx++) {
            // 所有绘制
            let part_svg_mat = this.DrawSequentialPoints(all_points_mat[idx])
            all_svg_mat.push(part_svg_mat)
        }
        return all_svg_mat
    }

}
