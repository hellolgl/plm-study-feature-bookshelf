/* eslint-disable */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { PureComponent, Component } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    PanResponder,
    ScrollView,
    Text as RN_Text,
} from "react-native";

import Svg, {
    Circle,
    Ellipse,
    G,
    LinearGradient,
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
    TSpan,
} from "react-native-svg";
import { pxToDp } from "../../util/tools";

export default class DataGraphicalDisplay extends PureComponent {
    constructor(props) {
        super(props);
    }

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
        // 逆时针
        let new_x1 =
            (rotate_point[0] - fixed_point[0]) * Math.cos(rotate_radian) -
            (rotate_point[1] - fixed_point[1]) * Math.sin(rotate_radian) +
            fixed_point[0];
        let new_y1 =
            (rotate_point[0] - fixed_point[0]) * Math.sin(rotate_radian) +
            (rotate_point[1] - fixed_point[1]) * Math.cos(rotate_radian) +
            fixed_point[1];
        return [Math.round(new_x0 * 100) / 100, Math.round(new_y0 * 100) / 100];
    };

    RegularPolygonMat = (side_num, [center_x, center_y], [init_x, init_y]) => {
        // 正多边形求坐标
        // let [center_x, center_y] = [50, 50]
        // let [init_x,init_y] = [50, 10]
        let regular_polygon_mat = [];
        let angle_gap = 360 / side_num;
        for (let idx = 0; idx < side_num; idx++) {
            if (idx == 0) {
                regular_polygon_mat.push([init_x, init_y]);
            } else {
                let rotate_angle = 360 - angle_gap * idx; // 顺时针 // angle_gap*idx:逆时针
                let part_loc = this.PointRotate(
                    [center_x, center_y],
                    [init_x, init_y],
                    rotate_angle
                );
                regular_polygon_mat.push(part_loc);
            }
        }
        // //console.log('正多边形坐标', regular_polygon_mat)
        return regular_polygon_mat;
    };

    DrawPolygonStr = (regular_polygon_mat) => {
        // 多边形转换字符串
        let regular_str_mat = [];
        regular_polygon_mat.forEach((part_value) => {
            regular_str_mat.push(part_value.join(","));
        });
        // //console.log('regular_str_mat.join', regular_str_mat.join(' '))
        return regular_str_mat.join(" ");
    };

    PolygonSvgCombine = (
        center_mat,
        radius,
        polygon_num,
        layer = 5,
        values_mat,
        namelist_mat
    ) => {
        const { border_color, label_color, rate_color } = this.props;
        // 组装雷达多边形
        // 绘制基础框
        let polyon_svg = [];
        for (let ii = 0; ii < layer; ii++) {
            let regular_polygon_mat = this.RegularPolygonMat(
                polygon_num,
                center_mat,
                [center_mat[0], center_mat[1] - (radius / layer) * (ii + 1)]
            );
            let polygon_str = this.DrawPolygonStr(regular_polygon_mat);
            polyon_svg.push(
                <Polygon
                    points={[polygon_str]} //多边形的每个角的x和y坐标
                    fill="transparent" //填充颜色
                    stroke={border_color ? border_color : "#F5F5FA"} //外边框颜色
                    strokeWidth="2" //外边框宽度
                />
            );
            // 绘制经线
            // //console.log('regular_polygon_mat', JSON.stringify(regular_polygon_mat), center_mat)
            if (ii == layer - 1) {
                // 最外层
                regular_polygon_mat.forEach((part_loc) => {
                    polyon_svg.push(
                        <Line
                            x1={center_mat[0]} //x轴的开始位置
                            y1={center_mat[1]} //y轴的开始位置
                            x2={part_loc[0]} //x轴的结束位置
                            y2={part_loc[1]} //y轴的结束位置
                            // stroke="#F5F5FA"   //外边框颜色
                            stroke={border_color ? border_color : "#F5F5FA"} //外边框颜色
                            strokeWidth="2" //外边框宽度
                        />
                    );
                });
            }
        }

        // 绘制有效区域
        let effect_loc = [];
        let effect_polygon_mat = [];
        values_mat.forEach((part_value, part_idx) => {
            let effect_radius = 0;
            if (
                values_mat[part_idx].length < 1 ||
                values_mat[part_idx] == "null" ||
                values_mat[part_idx] == null
            ) {
                effect_radius = 0;
            } else {
                effect_radius = (radius * eval(part_value)) / 100;
            }
            // //console.log('eval(part_value)', eval(part_value), effect_radius)
            effect_polygon_mat = this.RegularPolygonMat(polygon_num, center_mat, [
                center_mat[0],
                center_mat[1] - effect_radius,
            ]);
            // //console.log('effect_polygon_mat[part_idx]', effect_polygon_mat[part_idx])
            effect_loc.push(effect_polygon_mat[part_idx]); // 获取对应有效坐标数据
        });
        let polygon_str = this.DrawPolygonStr(effect_loc);
        // //console.log('effect_locpolygon_str', polygon_str)
        // 添加渐变色
        // 获取有效雷达区域
        let [radar_min_x, radar_max_x, radar_min_y, radar_max_y] =
            this.GetGraphRegion(effect_loc);
        // 线性渐变
        polyon_svg.push(
            <LinearGradient
                id="gradient"
                x1={radar_min_x}
                x2={radar_min_x}
                y1={radar_min_y}
                y2={radar_max_y} // this.props.math_frame_svg[4][1]
                gradientUnits="userSpaceOnUse"
            >
                <Stop
                    stopColor="#9F65FF"
                    offset="0%"
                    stopOpacity="0.8"
                    key="BorderTop"
                />
                <Stop
                    stopColor="#707EFE"
                    offset="100%"
                    stopOpacity="0.8"
                    key="BorderTop"
                />
            </LinearGradient>
        );
        polyon_svg.push(
            <Polygon
                points={[polygon_str]} //多边形的每个角的x和y坐标
                fill="url(#gradient)" //线填充颜色 #7076FF #0179FF
                // fill="url(#grad)"    // 圆填充颜色 #7076FF #0179FF
                fillOpacity={0.8}
                stroke="#7076FF" //外边框颜色 7076FF#38B3FF
                strokeWidth="0" //外边框宽度
            />
        );

        // 单条绘制边线
        for (let idx = 0; idx < effect_loc.length; idx++) {
            // //console.log('单独边线绘制', effect_loc[idx])
            if (idx < effect_loc.length - 1) {
                polyon_svg.push(
                    <Line
                        x1={effect_loc[idx][0]} //x轴的开始位置
                        y1={effect_loc[idx][1]} //y轴的开始位置
                        x2={effect_loc[idx + 1][0]} //x轴的结束位置
                        y2={effect_loc[idx + 1][1]} //y轴的结束位置
                        stroke="#7076FF" //填充颜色
                        strokeWidth="3.75" //填充宽度
                    />
                );
            } else {
                polyon_svg.push(
                    <Line
                        x1={effect_loc[idx][0]} //x轴的开始位置
                        y1={effect_loc[idx][1]} //y轴的开始位置
                        x2={effect_loc[0][0]} //x轴的结束位置
                        y2={effect_loc[0][1]} //y轴的结束位置
                        stroke="#7076FF" //填充颜色
                        strokeWidth="3.75" //填充宽度
                    />
                );
            }
        }
        // 绘制点---尖角情况
        effect_loc.forEach((part_loc) => {
            polyon_svg.push(
                <Circle
                    cx={part_loc[0]} //中心点x
                    cy={part_loc[1]} //中心点y
                    r="4" //半径
                    stroke="#7076FF" //外边框 颜色
                    strokeWidth="3" //外边框 宽度
                    fill="#fff" //填充颜色
                // fill="red"   //填充颜色
                />
            );
        });
        // 放置文本数据
        let effective_size = pxToDp(24); // 有效率size
        let name_size = effective_size; // 名称size
        let max_name_length = 0;
        namelist_mat.forEach((part_name) => {
            if (part_name.length > max_name_length) {
                max_name_length = part_name.length;
            }
        });
        // //console.log('最大长度', max_name_length)
        let base_radius = (4 / 2 + 0.5) * name_size * 0;
        let effect_polygon_loc_mat = this.RegularPolygonMat(
            polygon_num,
            center_mat,
            [center_mat[0], center_mat[1] - radius - base_radius]
        );
        // 放置文本虚拟线
        let text_polygon_str = this.DrawPolygonStr(effect_polygon_loc_mat);
        // polyon_svg.push(<Polygon
        //                     points= {[text_polygon_str]}  //多边形的每个角的x和y坐标
        //                     fill="transparent"     //填充颜色
        //                     stroke="lime"   //外边框颜色
        //                     strokeWidth="2"   //外边框宽度
        //                 />)
        let [min_x, max_x, min_y, max_y] = [1000, -1000, 1000, -1000];
        effect_polygon_loc_mat.forEach((part_value, part_idx) => {
            // 修正区间排布：分区8份或者12份
            let [effect_start, name_start, new_frame_mat] = this.RadarSubZoneRemend(
                center_mat,
                part_value,
                namelist_mat[part_idx],
                values_mat[part_idx],
                name_size,
                [min_x, max_x, min_y, max_y]
            );
            if (
                values_mat[part_idx].length < 1 ||
                values_mat[part_idx] == "null" ||
                values_mat[part_idx] == null
            ) {
                polyon_svg.push(
                    <Text
                        // x={part_value[0]-('未作答').length/2*name_size}
                        // y={part_value[1]}
                        x={part_value[0] + effect_start[0]}
                        y={part_value[1] + effect_start[1]}
                        fill="#38B3FF"
                        backgroundColor="transparent"
                        fontSize={18}
                    >
                        {"未作答"}
                    </Text>
                );
            } else {
                polyon_svg.push(
                    <Text
                        // x={part_value[0]-(values_mat[part_idx]+'%').length*3/11*effective_size}
                        // y={part_value[1]}
                        x={part_value[0] + effect_start[0]}
                        y={part_value[1] + effect_start[1]}
                        fill={rate_color ? rate_color : "#7076FF"}
                        backgroundColor="transparent"
                        fontSize={effective_size}
                    >
                        {values_mat[part_idx] + "%"}
                    </Text>
                );
            }
            polyon_svg.push(
                <Text
                    // x={part_value[0]-namelist_mat[part_idx].length/2*name_size}
                    // y={part_value[1]+effective_size}
                    x={part_value[0] + name_start[0]}
                    y={part_value[1] + name_start[1]}
                    fill={label_color ? label_color : "#AAAAAA"}
                    backgroundColor="transparent"
                    fontSize={name_size}
                >
                    {namelist_mat[part_idx]}
                </Text>
            );
            min_x = new_frame_mat[0];
            max_x = new_frame_mat[1];
            min_y = new_frame_mat[2];
            max_y = new_frame_mat[3];
        });
        // //console.log('边界值-----', min_x, max_x, min_y, max_y)
        polyon_svg.push(
            <Circle
                cx={center_mat[0]} //中心点x
                cy={center_mat[1]} //中心点y
                r="0" //半径
                fill="#38B3FF" //填充颜色
            // strokefill
            // strokefill="silver"   //填充颜色
            // stroke = '#38B3FF'
            // strokeWidth={3}
            />
        );
        return [
            [min_x, max_x, min_y, max_y],
            <Svg height={1000} width={1000} top={0 - min_y + 20} left={0 - min_x}>
                {polyon_svg}
            </Svg>,
        ];
    };
    GetGraphRegion = (graph_mat) => {
        // 获得图像区域
        let [min_x, max_x, min_y, max_y] = [100000, -1000000, 1000000, -10000000];
        for (let idx = 0; idx < graph_mat.length; idx++) {
            if (graph_mat[idx][0] < min_x) {
                min_x = graph_mat[idx][0];
            }
            if (graph_mat[idx][0] > max_x) {
                max_x = graph_mat[idx][0];
            }
            if (graph_mat[idx][1] < min_y) {
                min_y = graph_mat[idx][1];
            }
            if (graph_mat[idx][1] > max_y) {
                max_y = graph_mat[idx][1];
            }
        }
        return [min_x, max_x, min_y, max_y];
    };
    RadarSubZoneRemend = (
        center_mat,
        max_loc_mat,
        name_value,
        effect_value,
        font_size,
        frame_mat
    ) => {
        // 雷达图分区修正：返回一个起始坐标；按角度区分设计, frame_mat:框图大小
        //console.log('center_mat', center_mat, max_loc_mat)
        let radar_angle = 0;
        if (center_mat[0] == max_loc_mat[0] && center_mat[1] > max_loc_mat[1]) {
            radar_angle = 90;
        } else if (
            center_mat[0] == max_loc_mat[0] &&
            center_mat[1] < max_loc_mat[1]
        ) {
            radar_angle = 270;
        } else {
            let radar_tan =
                (center_mat[1] - max_loc_mat[1]) / (max_loc_mat[0] - center_mat[0]);
            let tan_angle = (Math.atan(radar_tan) / Math.PI) * 180;
            // //console.log('Math.atan', tan_angle)
            if (tan_angle > 0) {
                if (max_loc_mat[0] > center_mat[0]) {
                    radar_angle = tan_angle;
                } else {
                    radar_angle = 180 + tan_angle;
                }
            } else {
                if (max_loc_mat[0] > center_mat[0]) {
                    radar_angle = 360 + tan_angle;
                } else {
                    radar_angle = 180 + tan_angle;
                }
            }
        }
        // //console.log('radar_angle', radar_angle)
        // 返回两组值坐标：正确率和名称 ---- 分裂24份设计
        if (radar_angle < 97.5 && radar_angle >= 82.5) {
            // //console.log('上')
            let effect_x = ((-(effect_value.length + 1) / 2) * font_size * 5) / 11;
            let effect_y = -font_size * 1.5;
            let name_x = (-name_value.length / 2) * font_size;
            let name_y = -font_size * 0.5;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 82.5 && radar_angle >= 67.5) {
            let name_x = 0.4 * font_size;
            let name_y = -font_size * 0.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 67.5 && radar_angle >= 52.5) {
            let name_x = 0.6 * font_size;
            let name_y = font_size * 0.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 52.5 && radar_angle >= 37.5) {
            let name_x = 0.6 * font_size;
            let name_y = font_size * 0.4;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 37.5 && radar_angle >= 22.5) {
            let name_x = 0.6 * font_size;
            let name_y = font_size * 0.6;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 22.5 && radar_angle >= 7.5) {
            let name_x = 0.4 * font_size;
            let name_y = font_size * 0.8;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 7.5 || radar_angle >= 352.5) {
            //console.log('右')
            let name_x = 0.4 * font_size;
            let name_y = font_size * 1;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 352.5 && radar_angle >= 337.5) {
            let name_x = 0.2 * font_size;
            let name_y = font_size * 1.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 337.5 && radar_angle >= 322.5) {
            let name_x = 0.8 * font_size;
            let name_y = font_size * 1.3;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 322.5 && radar_angle >= 307.5) {
            let name_x = 0.2 * font_size;
            let name_y = font_size * 1.3;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 307.5 && radar_angle >= 292.5) {
            let name_x = 0.2 * font_size;
            let name_y = font_size * 1.5;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 292.5 && radar_angle >= 277.5) {
            let name_x = -0.4 * font_size;
            let name_y = font_size * 1.8;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 277.5 && radar_angle >= 262.5) {
            //console.log('下')
            let name_x = (-name_value.length / 2) * font_size;
            let name_y = font_size * 2.5;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 262.5 && radar_angle >= 247.5) {
            let name_x = -name_value.length * font_size + font_size * 0.0;
            let name_y = font_size * 1.8;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 247.5 && radar_angle >= 232.5) {
            let name_x = -name_value.length * font_size + font_size * 0.0;
            let name_y = font_size * 1.5;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 232.5 && radar_angle >= 217.5) {
            let name_x = -name_value.length * font_size + font_size * 0.0;
            let name_y = font_size * 1.3;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 217.5 && radar_angle >= 202.5) {
            let name_x = -name_value.length * font_size - font_size * 1;
            let name_y = font_size * 1.3;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 202.5 && radar_angle >= 187.5) {
            let name_x = -name_value.length * font_size - font_size * 0.6;
            let name_y = font_size * 1.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 187.5 && radar_angle >= 172.5) {
            //console.log('左')
            let name_x = -name_value.length * font_size - font_size * 0.8;
            let name_y = font_size * 1;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 172.5 && radar_angle >= 157.5) {
            let name_x = -name_value.length * font_size - font_size * 0.6;
            let name_y = font_size * 0.8;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 157.5 && radar_angle >= 142.5) {
            let name_x = -name_value.length * font_size - font_size * 1;
            let name_y = font_size * 0.6;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 142.5 && radar_angle >= 127.5) {
            let name_x = -name_value.length * font_size - font_size * 1;
            let name_y = font_size * 0.4;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 127.5 && radar_angle >= 112.5) {
            let name_x = -name_value.length * font_size - font_size * 1;
            let name_y = font_size * 0.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        } else if (radar_angle < 112.5 && radar_angle >= 97.5) {
            let name_x = -name_value.length * font_size - font_size * 0.8;
            let name_y = -font_size * 0.2;
            let effect_x =
                name_x +
                (name_value.length / 2) * font_size -
                (((effect_value.length + 1) / 2) * font_size * 6) / 11;
            let effect_y = name_y - font_size;
            // 求解区域
            let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
                max_loc_mat,
                frame_mat,
                name_value,
                font_size,
                effect_x,
                effect_y,
                name_x,
                name_y
            );
            // //console.log('求解区域', min_x, max_x, min_y, max_y)
            return [
                [effect_x, effect_y],
                [name_x, name_y],
                [min_x, max_x, min_y, max_y],
            ];
        }
        let effect_x = ((-effect_value.length / 2) * font_size * 7) / 11;
        let effect_y = -font_size * 1.5;
        let name_x = (-name_value.length / 2) * font_size;
        let name_y = -font_size * 0.5;
        let [min_x, max_x, min_y, max_y] = this.GetGraphSize(
            max_loc_mat,
            frame_mat,
            name_value,
            font_size,
            effect_x,
            effect_y,
            name_x,
            name_y
        );
        // //console.log('求解区域', min_x, max_x, min_y, max_y)
        return [
            [effect_x, effect_y],
            [name_x, name_y],
            [min_x, max_x, min_y, max_y],
        ];
    };

    GetGraphSize = (
        max_loc_mat,
        frame_mat,
        name_value,
        font_size,
        effect_x,
        effect_y,
        name_x,
        name_y
    ) => {
        // 最小最大x值
        let [min_x, max_x, min_y, max_y] = [0, 0, 0, 0];
        if (max_loc_mat[0] + name_x < frame_mat[0]) {
            min_x = max_loc_mat[0] + name_x;
        } else {
            min_x = frame_mat[0];
        }
        if (
            max_loc_mat[0] + name_x + name_value.length * font_size <
            frame_mat[1]
        ) {
            max_x = frame_mat[1];
        } else {
            max_x = max_loc_mat[0] + name_x + name_value.length * font_size;
        }
        // 最小最大y值
        if (max_loc_mat[1] + effect_y < frame_mat[2]) {
            min_y = max_loc_mat[1] + effect_y;
        } else {
            min_y = frame_mat[2];
        }
        if (max_loc_mat[1] + name_y < frame_mat[3]) {
            max_y = frame_mat[3];
        } else {
            max_y = max_loc_mat[1] + name_y;
        }
        return [min_x, max_x, min_y, max_y];
    };
    EffectiveAreaSvg = (center_mat, radius, polygon_num, values_mat) => {
        // 组装雷达多边形
        let polyon_svg = [];
        let effect_loc = [];
        let regular_polygon_mat = [];
        values_mat.forEach((part_value, part_idx) => {
            let effect_radius = (radius * eval(part_value)) / 100;
            regular_polygon_mat = this.RegularPolygonMat(polygon_num, center_mat, [
                center_mat[0],
                center_mat[1] - effect_radius,
            ]);
            effect_loc.push(regular_polygon_mat[part_idx]); // 获取对应有效坐标数据
        });
        let polygon_str = this.DrawPolygonStr(regular_polygon_mat);
        //console.log('regular_polygon_mat', regular_polygon_mat)
        polyon_svg.push(
            <Polygon
                points={[polygon_str]} //多边形的每个角的x和y坐标
                fill="transparent" //填充颜色
                stroke="#6FB3FE" //外边框颜色
                strokeWidth="2" //外边框宽度
            />
        );
        return (
            <Svg height="900" width="900" backgroundColor="red">
                {polyon_svg}
            </Svg>
        );
    };

    PolygonSvgCombine2 = (
        center_mat,
        radius,
        polygon_num,
        layer = 5,
        values_mat,
        namelist_mat,
        average_mat
    ) => {
        // 组装雷达多边形
        // 绘制基础框
        let polyon_svg = [];
        for (let ii = 0; ii < layer; ii++) {
            let regular_polygon_mat = this.RegularPolygonMat(
                polygon_num,
                center_mat,
                [center_mat[0], center_mat[1] - (radius / layer) * (ii + 1)]
            );
            let polygon_str = this.DrawPolygonStr(regular_polygon_mat);
            polyon_svg.push(
                <Polygon
                    points={[polygon_str]} //多边形的每个角的x和y坐标
                    fill="transparent" //填充颜色
                    stroke="#6FB3FE" //外边框颜色
                    strokeWidth="2" //外边框宽度
                />
            );
        }
        // 绘制有效区域
        let effect_loc = [];
        let effect_polygon_mat = [];
        values_mat.forEach((part_value, part_idx) => {
            let effect_radius = 0;
            if (
                values_mat[part_idx].length < 1 ||
                values_mat[part_idx] == "null" ||
                values_mat[part_idx] == null
            ) {
                effect_radius = 0;
            } else {
                effect_radius = (radius * eval(part_value)) / 100;
            }
            // //console.log('eval(part_value)', eval(part_value), effect_radius)
            effect_polygon_mat = this.RegularPolygonMat(polygon_num, center_mat, [
                center_mat[0],
                center_mat[1] - effect_radius,
            ]);
            // //console.log('effect_polygon_mat[part_idx]', effect_polygon_mat[part_idx])
            effect_loc.push(effect_polygon_mat[part_idx]); // 获取对应有效坐标数据
        });
        let polygon_str = this.DrawPolygonStr(effect_loc);
        //console.log('effect_loc', effect_loc)
        polyon_svg.push(
            <Polygon
                points={[polygon_str]} //多边形的每个角的x和y坐标
                fill="#0179FF" //填充颜色
                fillOpacity={0.22}
                stroke="#38B3FF" //外边框颜色
                strokeWidth="3.75" //外边框宽度
            />
        );
        // 绘制点---尖角情况
        effect_loc.forEach((part_loc) => {
            polyon_svg.push(
                <Circle
                    cx={part_loc[0]} //中心点x
                    cy={part_loc[1]} //中心点y
                    r="2" //半径
                    // stroke="#38B3FF"　　//外边框 颜色
                    // strokeWidth="0"  //外边框 宽度
                    // fill="#38B3FF"   //填充颜色
                    fill="red" //填充颜色
                />
            );
        });
        // 绘制平均水平, average_mat:
        let average_loc = [];
        let average_polygon_mat = [];
        average_mat.forEach((part_value, part_idx) => {
            let effect_radius = 0;
            if (
                average_mat[part_idx].length < 1 ||
                average_mat[part_idx] == "null" ||
                average_mat[part_idx] == null
            ) {
                effect_radius = 0;
            } else {
                effect_radius = (radius * eval(part_value)) / 100;
            }
            // //console.log('eval(part_value)', eval(part_value), effect_radius)
            average_polygon_mat = this.RegularPolygonMat(polygon_num, center_mat, [
                center_mat[0],
                center_mat[1] - effect_radius,
            ]);
            // //console.log('effect_polygon_mat[part_idx]', effect_polygon_mat[part_idx])
            average_loc.push(average_polygon_mat[part_idx]); // 获取对应有效坐标数据
        });
        //console.log('average_loc', average_loc)
        let [average_loc_1, average_loc_2] = [0, 0];
        for (let idx = 0; idx < average_loc.length; idx++) {
            if (idx == average_loc.length - 1) {
                //  最后一组
                average_loc_1 = average_loc[idx];
                average_loc_2 = average_loc[0];
            } else {
                average_loc_1 = average_loc[idx];
                average_loc_2 = average_loc[idx + 1];
            }
            // 绘制虚线
            //console.log('average_loc_1', average_loc_1, average_loc_2)
            let dotted_mat = this.DottedLineMat(average_loc_1, average_loc_2);
            // //console.log('dotted_mat', dotted_mat)
            for (let ii = 0; ii < dotted_mat.length; ii = ii + 2) {
                let part_average_loc_1 = dotted_mat[ii];
                let part_average_loc_2 = dotted_mat[ii + 1];
                //console.log(part_average_loc_1, part_average_loc_2)
                polyon_svg.push(
                    <Line
                        x1={part_average_loc_1[0]} //x轴的开始位置
                        y1={part_average_loc_1[1]} //y轴的开始位置
                        x2={part_average_loc_2[0]} //x轴的结束位置
                        y2={part_average_loc_2[1]} //y轴的结束位置
                        stroke="red" //填充颜色
                        strokeWidth="2" //填充宽度
                    />
                );
            }
            // polyon_svg.push(<Line
            //                     x1={average_loc_1[0]}   //x轴的开始位置
            //                     y1={average_loc_1[1]}   //y轴的开始位置
            //                     x2={average_loc_2[0]}  //x轴的结束位置
            //                     y2={average_loc_2[1]}   //y轴的结束位置
            //                     stroke="red"  //填充颜色
            //                     strokeWidth="2"  //填充宽度
            // />)
        }
        // 放置文本数据
        let effective_size = 20; // 有效率size
        let name_size = effective_size; // 名称size
        let max_name_length = 0;
        namelist_mat.forEach((part_name) => {
            if (part_name.length > max_name_length) {
                max_name_length = part_name.length;
            }
        });
        //console.log('最大长度', max_name_length)
        let base_radius = (4 / 2 + 0.5) * name_size * 0;
        let effect_polygon_loc_mat = this.RegularPolygonMat(
            polygon_num,
            center_mat,
            [center_mat[0], center_mat[1] - radius - base_radius]
        );
        // 放置文本虚拟线
        let text_polygon_str = this.DrawPolygonStr(effect_polygon_loc_mat);
        // polyon_svg.push(<Polygon
        //                     points= {[text_polygon_str]}  //多边形的每个角的x和y坐标
        //                     fill="transparent"     //填充颜色
        //                     stroke="lime"   //外边框颜色
        //                     strokeWidth="2"   //外边框宽度
        //                 />)
        let [min_x, max_x, min_y, max_y] = [1000, -1000, 1000, -1000];
        effect_polygon_loc_mat.forEach((part_value, part_idx) => {
            // 修正区间排布：分区8份或者12份
            let [effect_start, name_start, new_frame_mat] = this.RadarSubZoneRemend(
                center_mat,
                part_value,
                namelist_mat[part_idx],
                values_mat[part_idx],
                name_size,
                [min_x, max_x, min_y, max_y]
            );
            if (
                values_mat[part_idx].length < 1 ||
                values_mat[part_idx] == "null" ||
                values_mat[part_idx] == null
            ) {
                polyon_svg.push(
                    <Text
                        // x={part_value[0]-('未作答').length/2*name_size}
                        // y={part_value[1]}
                        x={part_value[0] + effect_start[0]}
                        y={part_value[1] + effect_start[1]}
                        fill="#FF0000"
                        backgroundColor="transparent"
                        fontSize={18}
                    >
                        {"未作答"}
                    </Text>
                );
            } else {
                polyon_svg.push(
                    <Text
                        // x={part_value[0]-(values_mat[part_idx]+'%').length*3/11*effective_size}
                        // y={part_value[1]}
                        x={part_value[0] + effect_start[0]}
                        y={part_value[1] + effect_start[1]}
                        fill="#0179FF"
                        backgroundColor="transparent"
                        fontSize={effective_size}
                    >
                        {values_mat[part_idx] + "%"}
                    </Text>
                );
            }
            polyon_svg.push(
                <Text
                    // x={part_value[0]-namelist_mat[part_idx].length/2*name_size}
                    // y={part_value[1]+effective_size}
                    x={part_value[0] + name_start[0]}
                    y={part_value[1] + name_start[1]}
                    fill="#AAAAAA"
                    backgroundColor="transparent"
                    fontSize={name_size}
                >
                    {namelist_mat[part_idx]}
                </Text>
            );
            min_x = new_frame_mat[0];
            max_x = new_frame_mat[1];
            min_y = new_frame_mat[2];
            max_y = new_frame_mat[3];
        });
        //console.log('边界值-----', min_x, max_x, min_y, max_y)
        return [
            [min_x, max_x, min_y, max_y],
            <Svg height={1000} width={1000} top={0 - min_y + 20} left={0 - min_x}>
                {polyon_svg}
            </Svg>,
        ];
    };

    DottedLineMat = (loc_mat_1, loc_mat_2) => {
        // 设置虚线坐标
        let dotted_num = 12; // 设置点数还是设置虚线长度
        let all_length = Math.sqrt(
            (loc_mat_1[0] - loc_mat_2[0]) * (loc_mat_1[0] - loc_mat_2[0]) +
            (loc_mat_1[1] - loc_mat_2[1]) * (loc_mat_1[1] - loc_mat_2[1])
        );
        let dotted_length = all_length / dotted_num; // 单组虚线长度
        let [loc_x_mat, loc_y_mat, loc_all_mat] = this.LineDiscreteData(
            loc_mat_1,
            loc_mat_2
        );
        // //console.log('loc_all_mat.length', loc_all_mat.length)
        let part_length = loc_all_mat.length / (dotted_num - 1);
        let dotted_mat = [];
        for (let idx = 0; idx < dotted_num; idx++) {
            if (idx == 0) {
                dotted_mat.push([loc_x_mat[0], loc_y_mat[0]]);
            } else if (idx == dotted_num - 1) {
                dotted_mat.push([
                    loc_x_mat[loc_x_mat.length - 1],
                    loc_y_mat[loc_y_mat.length - 1],
                ]);
            } else {
                let part_ii = parseInt(part_length * idx);
                // //console.log('part_ii', part_ii)
                dotted_mat.push([loc_x_mat[part_ii], loc_y_mat[part_ii]]);
            }
        }
        return dotted_mat;
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

    LineABC = (point_a, point_b) => {
        // 两点求直线ABC值: Ax+By+C=0
        if (JSON.stringify(point_a) == JSON.stringify(point_b)) {
            // //console.log('两点相同')
            return false;
        } else {
            // //console.log('可求直线', point_a[0]==point_b[0])
            let line_A = 0;
            let line_B = 0;
            let line_C = 0;
            if (point_a[0] == point_b[0]) {
                // x值相等，直线方程为Bx+C=0
                line_A = 1;
                line_B = 0;
                line_C = -point_a[0];
            } else {
                line_A = -(point_a[1] - point_b[1]) / (point_a[0] - point_b[0]);
                line_B = 1;
                line_C = -line_A * point_a[0] - point_a[1];
            }
            // //console.log('直线ABC求解', line_A, line_B, line_C)
            return [line_A, line_B, line_C];
        }
    };

    LineDiscreteData = (point_a, point_b) => {
        // 根据两点求直线离散数据
        // let point_a = [1, 2]
        // let point_b = [3, 5]
        let abc_mat0 = this.Line_ABC(point_a, point_b);
        // //console.log('abc_mat0', abc_mat0)
        let abc_mat1 = this.LineABC(point_a, point_b);
        // //console.log('abc_mat1', abc_mat1)
        let loc_x_mat = [];
        let loc_y_mat = [];
        let loc_all_mat = [];
        let pixle_gap = 0.1;
        if (abc_mat0[0] == 0) {
            //  横线
            let min_x = Math.min(point_a[0], point_b[0]);
            let max_x = Math.max(point_a[0], point_b[0]);
            for (let idx = 0; idx < (max_x - min_x) / pixle_gap + 1; idx++) {
                loc_x_mat.push(Math.round((min_x + idx * pixle_gap) * 10) / 10);
                loc_y_mat.push(point_a[1]);
                loc_all_mat.push([
                    Math.round((min_x + idx * pixle_gap) * 10) / 10,
                    point_a[1],
                ]);
            }
        } else if (abc_mat1[1] == 0) {
            // 竖线
            let min_y = Math.min(point_a[1], point_b[1]);
            let max_y = Math.max(point_a[1], point_b[1]);
            for (let idx = 0; idx < (max_y - min_y) / pixle_gap + 1; idx++) {
                loc_x_mat.push(point_a[0]);
                loc_y_mat.push(Math.round((min_y + idx * pixle_gap) * 10) / 10);
                loc_all_mat.push([
                    point_a[0],
                    Math.round((min_y + idx * pixle_gap) * 10) / 10,
                ]);
            }
        } else {
            // 斜线
            let min_x = Math.min(point_a[0], point_b[0]);
            let max_x = Math.max(point_a[0], point_b[0]);
            let min_y = Math.min(point_a[1], point_b[1]);
            let max_y = Math.max(point_a[1], point_b[1]);
            let part_x, part_y;
            if (max_x - min_x >= max_y - min_y) {
                // 横轴长，
                for (let idx = 0; idx < (max_x - min_x) / pixle_gap + 1; idx++) {
                    part_x = Math.round((min_x + idx * pixle_gap) * 10) / 10;
                    part_y = Math.round((part_x * abc_mat0[0] + abc_mat0[2]) * 10) / 10;
                    loc_x_mat.push(part_x);
                    loc_y_mat.push(-part_y);
                    loc_all_mat.push([part_x, -part_y]);
                }
            } else {
                // 纵轴长，
                for (let idx = 0; idx < (max_y - min_y) / pixle_gap + 1; idx++) {
                    part_y = Math.round((min_y + idx * pixle_gap) * 10) / 10;
                    part_x = Math.round(((part_y + abc_mat0[2]) / abc_mat0[0]) * 10) / 10;
                    loc_x_mat.push(-part_x);
                    loc_y_mat.push(part_y);
                    loc_all_mat.push([-part_x, part_y]);
                }
            }
        }
        // //console.log('loc_x_mat', JSON.stringify(loc_x_mat))
        // //console.log('loc_y_mat', JSON.stringify(loc_y_mat))
        // //console.log('loc_all_mat', JSON.stringify(loc_all_mat))
        return [loc_x_mat, loc_y_mat, loc_all_mat];
    };

    RadarMap = (values_mat, namelist_mat, radius) => {
        // 雷达图展示
        let [center_x, center_y] = [300, 300];
        // let radius = 120
        let polygon_num = values_mat.length;
        let layer = 4;
        // 绘制基础框
        let [[min_x, max_x, min_y, max_y], polyon_svg_mat] = this.PolygonSvgCombine(
            [center_x, center_y],
            radius,
            polygon_num,
            layer,
            values_mat,
            namelist_mat
        );
        // // 绘制有效区域
        // let effect_svg_mat = this.EffectiveAreaSvg([center_x, center_y], radius, polygon_num, values_mat)
        return (
            <View
                height={max_y - min_y + 40}
                width={max_x - min_x + 20}
                style={styles.radar_view}
            >
                {polyon_svg_mat}
            </View>
        );
    };

    RadarMap2 = (
        values_mat,
        namelist_mat,
        radius,
        [radar_width, radar_height]
    ) => {
        // 雷达图展示
        let [center_x, center_y] = [300, 300];
        // let radius = 120
        let polygon_num = values_mat.length;
        let layer = 5;
        // 绘制基础框
        let [[min_x, max_x, min_y, max_y], polyon_svg_mat] = this.PolygonSvgCombine(
            [center_x, center_y],
            radius,
            polygon_num,
            layer,
            values_mat,
            namelist_mat
        );
        // // 绘制有效区域
        // 修正直径
        let init_width = max_x - min_x;
        let init_height = max_y - min_y;
        //console.log('init_width', init_width, 'init_height', init_height)
        if (init_height + 25 <= radar_height && init_width + 5 <= radar_width) {
            return (
                <View
                    height={max_y - min_y + 25}
                    width={max_x - min_x + 5}
                    style={styles.radar_view}
                >
                    {polyon_svg_mat}
                </View>
            );
        }
        // 计算多边形的最大有效区域
        let regular_polygon_mat = this.RegularPolygonMat(
            polygon_num,
            [center_x, center_y],
            [center_x, center_x - radius]
        );
        //console.log('regular_polygon_mat', JSON.stringify(regular_polygon_mat))
        let [init_min_x, init_max_x, init_min_y, init_max_y] = [
            10000, -10000, 10000, -10000,
        ];
        regular_polygon_mat.forEach((part_loc) => {
            if (init_min_x > part_loc[0]) {
                init_min_x = part_loc[0];
            }
            if (init_max_x < part_loc[0]) {
                init_max_x = part_loc[0];
            }
            if (init_min_y > part_loc[1]) {
                init_min_y = part_loc[1];
            }
            if (init_max_y < part_loc[0]) {
                init_max_y = part_loc[0];
            }
        });
        //console.log('端点坐标', init_min_x, init_max_x, init_min_y, init_max_y)
        // 多余量或偏少量
        let offset_x = init_width + 5 - radar_width;
        let offset_y = init_height + 25 - radar_height;
        let scale_x = offset_x / (init_max_x - init_min_x + 1);
        let scale_y = offset_y / (init_max_y - init_min_y + 1);
        let new_radius = 1;
        if (scale_x >= scale_y) {
            new_radius = radius * (1 - scale_x);
        } else {
            new_radius = radius * (1 - scale_y);
        }
        // 固定大小修正
        let [[min_x2, max_x2, min_y2, max_y2], polyon_svg_mat2] =
            this.PolygonSvgCombine(
                [center_x, center_y],
                new_radius,
                polygon_num,
                layer,
                values_mat,
                namelist_mat
            );
        // let effect_svg_mat = this.EffectiveAreaSvg([center_x, center_y], radius, polygon_num, values_mat)
        return (
            <View
                height={max_y2 - min_y2 + 25}
                width={max_x2 - min_x2 + 5}
                style={styles.radar_view}
            >
                {polyon_svg_mat2}
            </View>
        );
    };

    RadarMap3 = (values_mat, namelist_mat, radius, average_mat) => {
        // 雷达图展示---添加平均水平
        let [center_x, center_y] = [300, 300];
        // let radius = 120
        let polygon_num = values_mat.length;
        let layer = 5;
        // 绘制基础框
        let [[min_x, max_x, min_y, max_y], polyon_svg_mat] =
            this.PolygonSvgCombine2(
                [center_x, center_y],
                radius,
                polygon_num,
                layer,
                values_mat,
                namelist_mat,
                average_mat
            );
        // // 绘制有效区域
        // let effect_svg_mat = this.EffectiveAreaSvg([center_x, center_y], radius, polygon_num, values_mat)
        return (
            <View
                height={max_y - min_y + 40}
                width={max_x - min_x + 20}
                style={styles.radar_view}
            >
                {polyon_svg_mat}
            </View>
        );
    };

    render() {
        if (this.props.math_frame_svg[0] == "radar_mode1") {
            // 数据图形展示雷达图---模型1
            let values_mat = this.props.math_frame_svg[1];
            let namelist_mat = this.props.math_frame_svg[2];
            let radius = this.props.math_frame_svg[3];
            // //console.log('values_mat', values_mat)
            // //console.log('namelist_mat', namelist_mat)
            return this.RadarMap(values_mat, namelist_mat, radius);
        } else if (this.props.math_frame_svg[0] == "radar_mode2") {
            // 数据图形展示雷达图---模型2---固定大小收缩框图
            let values_mat = this.props.math_frame_svg[1];
            let namelist_mat = this.props.math_frame_svg[2];
            let radius = this.props.math_frame_svg[3];
            let [radar_width, radar_height] = [
                this.props.math_frame_svg[4][0],
                this.props.math_frame_svg[4][1],
            ];
            // //console.log('values_mat', values_mat)
            // //console.log('namelist_mat', namelist_mat)
            return this.RadarMap2(values_mat, namelist_mat, radius, [
                radar_width,
                radar_height,
            ]);
        } else if (this.props.math_frame_svg[0] == "radar_mode3") {
            // 数据图形展示雷达图---模型3---添加平均水平
            let values_mat = this.props.math_frame_svg[1];
            let namelist_mat = this.props.math_frame_svg[2];
            let radius = this.props.math_frame_svg[3];
            let average_mat = this.props.math_frame_svg[4];
            // //console.log('values_mat', values_mat)
            // //console.log('namelist_mat', namelist_mat)
            return this.RadarMap3(values_mat, namelist_mat, radius, average_mat);
        } else {
            return [];
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        flexDirection: "column",
        alignItems: "center",
    },
    radar_view: {
        // backgroundColor:'transparent',
        backgroundColor: "transparent",
    },
});
