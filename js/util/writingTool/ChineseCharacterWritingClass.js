/* eslint-disable */
import _ from 'lodash'
import Svg, { Line, Path, Rect, Polygon, Text as SText, Circle, Ellipse, Polyline } from "react-native-svg";

let guide_zoom_num = 1.5
export class ChineseCharacterWritingClass {

    getSkeletonReSegment = (hanzi_data) => {
        /**
         * 骨架二次分割----分离较长线条
         */
        // let min_length = 10 // 最小分离量
        // let new_hanzi_data = {}
        let all_skeleton_loc = []
        let all_split_mat = []
        for (let idx = 0; idx < hanzi_data["skeleton_loc"].length; idx++) {//hanzi_data["skeleton_loc"].length
            // console.log("Single-----一笔---------", idx)
            let path_loc = hanzi_data["loc_mat"][idx]
            let split_mat = hanzi_data["split_idx"][idx]
            let skeleton_loc = hanzi_data["skeleton_loc"][idx]
            let [new_skeleton_loc, new_split_mat] = this.getSingleSkeletonMinLength(path_loc, skeleton_loc, split_mat)
            all_skeleton_loc.push(new_skeleton_loc)
            all_split_mat.push(new_split_mat)
        }
        return {
            "loc_mat": hanzi_data["loc_mat"],
            "split_idx": all_split_mat,
            "skeleton_loc": all_skeleton_loc,
            "chn_char": hanzi_data["chn_char"]
        }
    }
    getSingleSkeletonRatio = (path_xy_loc, skeleton_xy_loc, split_mat) => {
        // 单根骨架二次分离
        let min_length = 20
        // console.log('path_loc', path_xy_loc)
        // console.log('skeleton_loc', skeleton_xy_loc)
        // console.log('split_mat', split_mat)
        // end_idx: 18
        // skeleton_idx: [0, 1, 2, 3]
        // start_end_0: [93, 111, 116, 18]
        // start_end_1: [93, 76, 58, 18]
        // start_idx: 93
        let path_length = path_xy_loc[0].length
        let new_skeleton_x_loc = []
        let new_skeleton_y_loc = []
        let new_start_end_0 = []
        let new_start_end_1 = []
        new_start_end_0.push(split_mat["start_end_0"][0])
        new_start_end_1.push(split_mat["start_end_1"][0])
        new_skeleton_x_loc.push(skeleton_xy_loc[0][0])
        new_skeleton_y_loc.push(skeleton_xy_loc[1][0])
        for (let idx = 0; idx < skeleton_xy_loc[0].length - 1; idx++) {
            // 单段处理
            let part_length = this.TwoPointDistance(
                [skeleton_xy_loc[0][idx], skeleton_xy_loc[1][idx]],
                [skeleton_xy_loc[0][idx + 1], skeleton_xy_loc[1][idx + 1]])
            // console.log('Single距离part_length--------', idx, '---------', part_length)
            let segment_num = parseInt(Math.round(part_length / min_length))
            if (segment_num > 1) {
                // 分段
                // console.log("Single----可以分段", segment_num)
                // 添加骨架点
                let s_div_x = (skeleton_xy_loc[0][idx + 1] - skeleton_xy_loc[0][idx]) / segment_num
                let s_div_y = (skeleton_xy_loc[1][idx + 1] - skeleton_xy_loc[1][idx]) / segment_num
                for (let k_idx = 1; k_idx < segment_num + 1; k_idx++) {
                    new_skeleton_x_loc.push(skeleton_xy_loc[0][idx] + s_div_x * k_idx)
                    new_skeleton_y_loc.push(skeleton_xy_loc[1][idx] + s_div_y * k_idx)
                }
                // 计算单边单段总长----正向
                let length_0 = 0
                let part_start_idx = split_mat["start_end_0"][idx]
                let part_end_idx = split_mat["start_end_0"][idx + 1]
                part_end_idx = part_start_idx < part_end_idx ? part_end_idx : part_end_idx + path_length
                let part_length_mat = []
                for (let p_idx = part_start_idx; p_idx < part_end_idx; p_idx++) {
                    let part_length = this.TwoPointDistance(
                        [path_xy_loc[0][p_idx % path_length], path_xy_loc[1][p_idx % path_length]],
                        [path_xy_loc[0][(p_idx + 1) % path_length], path_xy_loc[1][(p_idx + 1) % path_length]]
                    )
                    length_0 += part_length
                    part_length_mat.push(_.cloneDeep(length_0))
                }
                // console.log('Single-----总长', length_0, part_length_mat)
                for (let seg_idx = 1; seg_idx < segment_num; seg_idx++) {
                    let ratio = seg_idx / segment_num
                    for (let l_idx = 0; l_idx < part_length_mat.length; l_idx++) {
                        // 查找最接近点
                        // console.log('Single-----查找近点0',l_idx, part_length_mat[l_idx] / length_0, ratio, part_length_mat[l_idx] / length_0)
                        // console.log('Single-----查找近点0', (part_length_mat[l_idx] / length_0) <= ratio , (part_length_mat[l_idx] / length_0) >= ratio)
                        if ((part_length_mat[l_idx] / length_0) <= ratio && (part_length_mat[l_idx + 1] / length_0) >= ratio) {
                            //
                            // console.log('Single-----查找近点0-----')
                            new_start_end_0.push((part_start_idx + l_idx + 1) % path_length)
                            break
                        }
                    }
                }
                new_start_end_0.push(part_end_idx % path_length)
                // 计算单边单段总长----反向
                let length_1 = 0
                part_start_idx = split_mat["start_end_1"][idx]
                part_end_idx = split_mat["start_end_1"][idx + 1]
                part_start_idx = part_start_idx < part_end_idx ? part_start_idx + path_length : part_start_idx
                part_length_mat = []
                for (let p_idx = part_start_idx; p_idx > part_end_idx; p_idx--) {
                    let part_length = this.TwoPointDistance(
                        [path_xy_loc[0][p_idx % path_length], path_xy_loc[1][p_idx % path_length]],
                        [path_xy_loc[0][(p_idx + 1) % path_length], path_xy_loc[1][(p_idx + 1) % path_length]]
                    )
                    length_1 += part_length
                    part_length_mat.push(_.cloneDeep(length_1))
                }
                // console.log('Single-----总长1', length_1, part_length_mat)
                for (let seg_idx = 1; seg_idx < segment_num; seg_idx++) {
                    let ratio = seg_idx / segment_num
                    for (let l_idx = 0; l_idx < part_length_mat.length; l_idx++) {
                        // 查找最接近点
                        // console.log('Single-----查找近点1', (part_length_mat[l_idx]) / length_1, ratio, (part_length_mat[l_idx + 1]) / length_1)
                        if ((part_length_mat[l_idx] / length_1) <= ratio && (part_length_mat[l_idx + 1] / length_1) >= ratio) {
                            //
                            // console.log('Single-----查找近点----')
                            new_start_end_1.push((part_start_idx - l_idx - 1 + path_length) % path_length)
                            break
                        }
                    }
                }
                new_start_end_1.push(part_end_idx % path_length)
            }
            else {
                new_skeleton_x_loc.push(skeleton_xy_loc[0][idx + 1])
                new_skeleton_y_loc.push(skeleton_xy_loc[1][idx + 1])
                new_start_end_0.push(split_mat["start_end_0"][idx + 1])
                new_start_end_1.push(split_mat["start_end_1"][idx + 1])
            }
        }
        // console.log("Single---1--split_mat[start_end_0]", split_mat["start_end_0"])
        // console.log("Single---1--split_mat[start_end_1]", split_mat["start_end_1"])
        // console.log("Single---1--new_start_end_0", new_start_end_0)
        // console.log("Single---1--new_start_end_1", new_start_end_1)
        // console.log("Single---1--new_skeleton_x_loc", new_skeleton_x_loc)
        // console.log("Single---1--new_skeleton_y_loc", new_skeleton_y_loc)
        let skeleton_split_idx = []
        for (let idx = 0; idx < new_start_end_0.length; idx++) {
            skeleton_split_idx.push(idx)
        }
        // console.log('---------------', path_length, new_start_end_0, new_start_end_1)
        return [
            [new_skeleton_x_loc, new_skeleton_y_loc],
            {
                "end_idx": split_mat["end_idx"],
                "skeleton_idx": skeleton_split_idx,
                "start_end_0": new_start_end_0,
                "start_end_1": new_start_end_1,
                "start_idx": split_mat["start_idx"]
            }
        ]
    }

    getSingleSkeletonMinLength = (path_xy_loc, skeleton_xy_loc, split_mat) => {
        // 单根骨架二次分离----最近距离
        let min_length = 22
        // console.log('path_loc', path_xy_loc)
        // console.log('skeleton_loc', skeleton_xy_loc)
        // console.log('split_mat', split_mat)
        // end_idx: 18
        // skeleton_idx: [0, 1, 2, 3]
        // start_end_0: [93, 111, 116, 18]
        // start_end_1: [93, 76, 58, 18]
        // start_idx: 93
        let path_length = path_xy_loc[0].length
        let new_skeleton_x_loc = []
        let new_skeleton_y_loc = []
        let new_start_end_0 = []
        let new_start_end_1 = []
        new_start_end_0.push(split_mat["start_end_0"][0])
        new_start_end_1.push(split_mat["start_end_1"][0])
        new_skeleton_x_loc.push(skeleton_xy_loc[0][0])
        new_skeleton_y_loc.push(skeleton_xy_loc[1][0])
        for (let idx = 0; idx < skeleton_xy_loc[0].length - 1; idx++) {
            // 单段处理
            let part_length = this.TwoPointDistance(
                [skeleton_xy_loc[0][idx], skeleton_xy_loc[1][idx]],
                [skeleton_xy_loc[0][idx + 1], skeleton_xy_loc[1][idx + 1]])
            // console.log('Single距离part_length--------', idx, '---------', part_length)
            let segment_num = parseInt(Math.round(part_length / min_length))
            if (segment_num > 1) {
                // 分段
                // console.log("Single----可以分段", segment_num)
                // 添加骨架点
                let s_div_x = (skeleton_xy_loc[0][idx + 1] - skeleton_xy_loc[0][idx]) / segment_num
                let s_div_y = (skeleton_xy_loc[1][idx + 1] - skeleton_xy_loc[1][idx]) / segment_num
                // 正向
                let part_start_idx_0 = split_mat["start_end_0"][idx]
                let part_end_idx_0 = split_mat["start_end_0"][idx + 1]
                part_end_idx_0 = part_start_idx_0 < part_end_idx_0 ? part_end_idx_0 : part_end_idx_0 + path_length
                // console.log("--------part_start_idx_0, part_end_idx_0", part_start_idx_0, part_end_idx_0)
                // 反向
                let part_start_idx_1 = split_mat["start_end_1"][idx]
                let part_end_idx_1 = split_mat["start_end_1"][idx + 1]
                part_start_idx_1 = part_start_idx_1 < part_end_idx_1 ? part_start_idx_1 + path_length : part_start_idx_1
                // console.log("--------part_start_idx_1, part_end_idx_1", part_start_idx_1, part_end_idx_1)
                for (let k_idx = 1; k_idx < segment_num; k_idx++) {
                    let part_loc_x = skeleton_xy_loc[0][idx] + s_div_x * k_idx
                    let part_lco_y = skeleton_xy_loc[1][idx] + s_div_y * k_idx
                    new_skeleton_x_loc.push(part_loc_x)
                    new_skeleton_y_loc.push(part_lco_y)
                    // 寻找最近点----正向
                    let part_length_mat = []
                    for (let p_idx = part_start_idx_0; p_idx < part_end_idx_0; p_idx++) {
                        let part_length = this.TwoPointDistance(
                            [path_xy_loc[0][p_idx % path_length], path_xy_loc[1][p_idx % path_length]],
                            [part_loc_x, part_lco_y]
                        )
                        part_length_mat.push(_.cloneDeep(part_length))
                    }
                    let [center_sort, index_sort] = this.ArraySortMat(part_length_mat)
                    // console.log("--------part_length_mat", part_length_mat, center_sort, index_sort)
                    new_start_end_0.push((part_start_idx_0 + index_sort[0]) % path_length)
                    // 寻找最近点----反向
                    let part_length_mat_1 = []
                    for (let p_idx = part_start_idx_1; p_idx > part_end_idx_1; p_idx--) {
                        let part_length = this.TwoPointDistance(
                            [path_xy_loc[0][p_idx % path_length], path_xy_loc[1][p_idx % path_length]],
                            [part_loc_x, part_lco_y]
                        )
                        part_length_mat_1.push(_.cloneDeep(part_length))
                    }
                    let [center_sort_1, index_sort_1] = this.ArraySortMat(part_length_mat_1)
                    // console.log("--------part_length_mat", part_length_mat, center_sort_1, index_sort_1)
                    new_start_end_1.push((part_start_idx_1 - index_sort_1[0] + path_length) % path_length)
                }
                // 计算单边单段总长----正向
                new_start_end_0.push(part_end_idx_0 % path_length)
                // 计算单边单段总长----反向
                new_start_end_1.push(part_end_idx_1 % path_length)
                // console.log("----------new_start_end_0", new_start_end_0)
                // console.log("----------new_start_end_1", new_start_end_1)
                new_skeleton_x_loc.push(skeleton_xy_loc[0][idx + 1])
                new_skeleton_y_loc.push(skeleton_xy_loc[1][idx + 1])
            }
            else {
                new_skeleton_x_loc.push(skeleton_xy_loc[0][idx + 1])
                new_skeleton_y_loc.push(skeleton_xy_loc[1][idx + 1])
                new_start_end_0.push(split_mat["start_end_0"][idx + 1])
                new_start_end_1.push(split_mat["start_end_1"][idx + 1])
            }
        }
        // console.log("Single---1--split_mat[start_end_0]", split_mat["start_end_0"])
        // console.log("Single---1--split_mat[start_end_1]", split_mat["start_end_1"])
        // console.log("Single---1--new_start_end_0", new_start_end_0)
        // console.log("Single---1--new_start_end_1", new_start_end_1)
        // console.log("Single---1--new_skeleton_x_loc", new_skeleton_x_loc)
        // console.log("Single---1--new_skeleton_y_loc", new_skeleton_y_loc)
        let skeleton_split_idx = []
        for (let idx = 0; idx < new_start_end_0.length; idx++) {
            skeleton_split_idx.push(idx)
        }
        // console.log('---------------', path_length, new_start_end_0, new_start_end_1)
        return [
            [new_skeleton_x_loc, new_skeleton_y_loc],
            {
                "end_idx": split_mat["end_idx"],
                "skeleton_idx": skeleton_split_idx,
                "start_end_0": new_start_end_0,
                "start_end_1": new_start_end_1,
                "start_idx": split_mat["start_idx"]
            }
        ]
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

    TwoPointDistance = (point_a, point_b) => {
        // 求解两点之间的距离
        let x_div = point_a[0] - point_b[0]
        let y_div = point_a[1] - point_b[1]
        // console.log('x_div/y_div',x_div,y_div)
        return Math.sqrt(x_div * x_div + y_div * y_div)
    }

    getHanZiData = (part_hanzi) => {
        // 提取汉字
        // let part_hanzi = chn_char_mat100[this.hanzi_idx]
        // console.log('part_hanzi', part_hanzi)
        let new_hanzi_data0 = {
            // "loc_mat":[part_hanzi["stroke_loc_xy_mat"][0]],
            // "split_idx":[part_hanzi["split_idx"][0]],
            "loc_mat": part_hanzi["stroke_loc_xy_mat"],
            "split_idx": part_hanzi["split_idx"],
            "skeleton_loc": part_hanzi["skeleton_dict"]["zoom_xy_skeleton"],
            "chn_char": part_hanzi["chn_char"]
        }
        // 添加骨架分割点----最小分量取整
        let new_hanzi_data = this.getSkeletonReSegment(new_hanzi_data0)
        // console.log('----------new_hanzi_data0', new_hanzi_data0)
        // console.log('----------new_hanzi_data', new_hanzi_data)
        // this.hanzi_char = part_hanzi["chn_char"]
        // 骨架数据处理----两点之间的距离超过多少进行分解
        // console.log('new_hanzi_data', new_hanzi_data)
        // let skeleton_svg_mat = []
        // for (let idx = 0; idx < new_hanzi_data.loc_mat.length; idx++) { //new_hanzi_data.loc_mat.length
        //     let loc_x = new_hanzi_data.loc_mat[idx][0]
        //     let loc_y = new_hanzi_data.loc_mat[idx][1]
        //     let polygon_str = ''
        //     console.log('-=======================0',loc_x.length)

        //     for (let loc_ii = 0; loc_ii < loc_x.length; loc_ii++) {
        //         console.log('-=======================1',loc_ii)
        //         polygon_str = polygon_str + (loc_x[loc_ii] * guide_zoom_num).toString() + ',' + (loc_y[loc_ii] * guide_zoom_num).toString() + ' '
        //         // console.log("============", polygon_str)
        //     }
        //     skeleton_svg_mat.push(
        //         <Polygon
        //             points={polygon_str}  //多边形的每个角的x和y坐标
        //             fill="gray"     //填充颜色
        //             stroke="black"   //外边框颜色
        //             strokeWidth="2"   //外边框宽度
        //             strokeOpacity={1}
        //             fillOpacity={0.5}
        //         />
        //     )
        //     console.log('-=======================0')
        //     let skeleton_x = new_hanzi_data.skeleton_loc[idx][0]
        //     let skeleton_y = new_hanzi_data.skeleton_loc[idx][1]
        //     let skeleton_str = ''

        //     for (let loc_ii = 0; loc_ii < skeleton_x.length; loc_ii++) {
        //         skeleton_str = skeleton_str + (skeleton_x[loc_ii] * guide_zoom_num).toString() + ',' + (skeleton_y[loc_ii] * guide_zoom_num).toString() + ' '
        //     }
        //     skeleton_svg_mat.push(
        //         <Polyline
        //             points={skeleton_str}  //多边形的每个角的x和y坐标
        //             stroke="red"   //外边框颜色
        //             strokeWidth="2"   //外边框宽度
        //             strokeOpacity={1}
        //         />
        //     )
        //     console.log('-=======================2')
        //     // 分支
        //     for (let tree_idx = 0; tree_idx < new_hanzi_data.split_idx[idx].skeleton_idx.length; tree_idx++) {
        //         // "start_end_0": [75, 85, 0, 3, 6, 14], "start_end_1": [75, 66, 39, 33, 26, 14], "skeleton_idx": [0, 1, 2, 3, 4, 5]
        //         // new_hanzi_data.split_idx[idx].skeleton_idx.length
        //         let tree_str =
        //             (loc_x[new_hanzi_data.split_idx[idx]['start_end_0'][tree_idx]] * guide_zoom_num).toString() + ',' +
        //             (loc_y[new_hanzi_data.split_idx[idx]['start_end_0'][tree_idx]] * guide_zoom_num).toString() + ' ' +
        //             (skeleton_x[new_hanzi_data.split_idx[idx]['skeleton_idx'][tree_idx]] * guide_zoom_num).toString() + ',' +
        //             (skeleton_y[new_hanzi_data.split_idx[idx]['skeleton_idx'][tree_idx]] * guide_zoom_num).toString() + ' ' +
        //             (loc_x[new_hanzi_data.split_idx[idx]['start_end_1'][tree_idx]] * guide_zoom_num).toString() + ' ' +
        //             (loc_y[new_hanzi_data.split_idx[idx]['start_end_1'][tree_idx]] * guide_zoom_num).toString()
        //         skeleton_svg_mat.push(
        //             <Polyline
        //                 points={tree_str}  //多边形的每个角的x和y坐标
        //                 stroke="lime"   //外边框颜色
        //                 strokeWidth="2"   //外边框宽度
        //                 strokeOpacity={1}
        //             />
        //         )
        //     }
        //     console.log('-=======================2')
        // }
        // console.log("==============", skeleton_svg_mat, new_hanzi_data)
        // this.skeleton_svg_mat = skeleton_svg_mat
        // this.new_hanzi_data = new_hanzi_data
        // this.setState({
        //   hanzi_skeleton_svg: this.skeleton_svg_mat,
        //   new_hanzi_data: this.new_hanzi_data
        // })
        return new_hanzi_data
    }
}

