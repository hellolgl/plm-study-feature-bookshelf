/* eslint-disable */
/**
 * 图与数：数据处理方法
 * Created by on 2022/07/13.
 */
import { MathGraphClass } from "./MathGraphModule.js"
import _, { cond, max, pick } from 'lodash';

let newgraphcls = new MathGraphClass()


export class GriddingClass {
    /**
     * @description 网格坐标计算及转换
     */

    constructor(width = 300, height = 200, init_x = 100, init_y = 150, per_pixels = 30) {
        /**
         * @description 初始化对象
         * @param width Svg宽度---像素点数
         * @param height Svg高度---像素点数
         * @param init_x 原点坐标x---像素点数-----采用四象限坐标关系
         * @param init_y 原点坐标y---像素点数-----采用四象限坐标关系
         * @param per_pixels 坐标系中单位1的像素点数
         */

        this.gridding_width = width     // 网格SVG宽度
        this.gridding_height = height
        this.origin_x = init_x          // 原点坐标
        this.origin_y = init_y
        this.max_pixels = 100           // 单格最大像素点数
        this.min_pixels = 20            // 单格最小像素点数
        this.per_pixels = per_pixels > this.max_pixels ? this.max_pixels : (per_pixels < this.min_pixels ? this.min_pixels : per_pixels)    // 单格像素点数
        this.StandardGridding()
    }

    StandardGridding = () => {
        /**
         * @description 标准网格坐标系x-y格点坐标生成：根据原点坐标计算生成SVG有效区域内的坐标系坐标及对应像素坐标
         */
        // console.log('类----标准坐标系数据生成')
        // console.log('this.per_pixels========',this.per_pixels)
        let min_coordinate_x = Math.ceil((0 - this.origin_x) / this.per_pixels)         // 最小坐标系x值;ceil:向上取整、floor：向下取整
        let max_coordinate_x = Math.floor((this.gridding_width - this.origin_x) / this.per_pixels)         // 最大坐标系x值;ceil:向上取整、floor：向下取整
        let min_coordinate_y = Math.ceil((0 - (this.gridding_height - this.origin_y)) / this.per_pixels)         // 最小坐标系y值
        let max_coordinate_y = Math.floor((this.gridding_height - (this.gridding_height - this.origin_y)) / this.per_pixels)         // 最大坐标系y值
        // console.log('坐标系下最小、最大x值', min_coordinate_x, max_coordinate_x)
        // console.log('坐标系下最小、最大y值', min_coordinate_y, max_coordinate_y)
        let [coordinate_x_mat, img_x_mat] = [[], []]       // x轴对应坐标系值、图形数据点
        let [coordinate_y_mat, img_y_mat] = [[], []]       // y轴对应坐标系值、图形数据点
        for (let coordinate_x = min_coordinate_x; coordinate_x <= max_coordinate_x; coordinate_x++) {
            coordinate_x_mat.push(coordinate_x)
            img_x_mat.push(this.origin_x + coordinate_x * this.per_pixels)
        }
        for (let coordinate_y = min_coordinate_y; coordinate_y <= max_coordinate_y; coordinate_y++) {
            coordinate_y_mat.push(coordinate_y)
            img_y_mat.push(this.origin_y - coordinate_y * this.per_pixels)

        }
        this.coordinate_x_mat = _.cloneDeep(coordinate_x_mat)
        this.img_x_mat = _.cloneDeep(img_x_mat)
        this.coordinate_y_mat = _.cloneDeep(coordinate_y_mat)
        this.img_y_mat = _.cloneDeep(img_y_mat)
        // console.log('坐标系下及图形下数据x值', this.coordinate_x_mat, this.img_x_mat)
        // console.log('坐标系下及图形下数据y值', this.coordinate_y_mat, this.img_y_mat)
    }

    AllGraphCoordinateToImg = (all_graph_coordinate_mat) => {
        /**
         * @description 所有坐标系图形组转换图像坐标
         * @param all_graph_coordinate_mat 所有图形坐标系坐标组：[[[-1,1],[1,2],[3,4],...],[[-1,1],[1,2],[3,4],...],...]
         * @return all_graph_img_data 图像坐标：坐上为[0,0]
         */
        let all_graph_img_data = []
        for (let idx = 0; idx < all_graph_coordinate_mat.length; idx++) {
            let part_graph_img_data = this.CoordinateTransformImg(all_graph_coordinate_mat[idx])
            all_graph_img_data.push(part_graph_img_data)
        }
        return all_graph_img_data
    }

    CoordinateTransformImg = (coordinate_mat) => {
        /**
         * @description 坐标系坐标转换图像/组件坐标转换---单幅图像坐标转换
         * @param coordinate_mat 单幅图像各点坐标系坐标:[[-1,1],[1,2],[3,4]....]
         * @return img_mat 单幅图形的图像坐标
         */
        let img_mat = []
        for (let idx = 0; idx < coordinate_mat.length; idx++) {
            // 单点换算
            let [img_x, img_y] = this.SingleCoordinatePointToImg(coordinate_mat[idx][0], coordinate_mat[idx][1])
            img_mat.push([img_x, img_y])
        }
        // console.log('坐标转换----coordinate_mat----component_mat', JSON.stringify(coordinate_mat), JSON.stringify(component_mat))
        return img_mat

    }

    SingleCoordinatePointToImg = (coordinate_x, coordinate_y) => {
        /**
         * @description 单点坐标系坐标转换图像坐标
         * @param coordinate_x 坐标系下x值
         * @param coordinate_y 坐标系下y值
         * @return img_x、img_y 图像坐标
         */
        let img_x = this.origin_x + coordinate_x * this.per_pixels      // 圆心坐标+坐标系坐标*单位像素长度
        let img_y = this.origin_y - coordinate_y * this.per_pixels      // 圆心坐标+坐标系坐标*单位像素长度---左下圆心---四象限分布
        return [img_x, img_y]
    }

    AllGraphImgToCoordinate = (all_graph_img_mat) => {
        /**
         * @description 所有坐标系图形组转换图像坐标
         * @param all_graph_img_mat 所有图形坐标系坐标组：[[[-1,1],[1,2],[3,4],...],[[-1,1],[1,2],[3,4],...],...]
         * @return all_graph_img_data 图像坐标：坐上为[0,0]
         */
        let all_graph_coordinate_mat = []
        for (let idx = 0; idx < all_graph_img_mat.length; idx++) {
            let part_graph_coordinate_data = this.ImgTransformCoordinate(all_graph_img_mat[idx])
            all_graph_coordinate_mat.push(part_graph_coordinate_data)
        }
        return all_graph_coordinate_mat
    }

    ImgTransformCoordinate = (img_mat) => {
        /**
         * @description 坐标系坐标转换图像/组件坐标转换---单幅图像坐标转换
         * @param img_mat 单幅图像各点图像坐标:[[100,100],[200,200],[300,400]....]
         * @return coordinate_mat 单幅图形的坐标系坐标
         */
        let coordinate_mat = []
        for (let idx = 0; idx < img_mat.length; idx++) {
            // 单点换算
            let [coordinate_x, coordinate_y] = this.SingleImgPointToCoordinate(img_mat[idx][0], img_mat[idx][1])
            coordinate_mat.push([coordinate_x, coordinate_y])
        }
        // console.log('坐标转换----coordinate_mat----component_mat', JSON.stringify(coordinate_mat), JSON.stringify(component_mat))
        return coordinate_mat

    }

    SingleImgPointToCoordinate = (img_x, img_y, decimal_num = 1) => {
        /**
         * @description 单点图像坐标转换坐标系坐标
         * @param img_x 图像坐x值
         * @param img_y 图像坐y值
         * @param decimal_num  保留小数点位数
         * @return coordinate_x, coordinate_y 坐标系坐标
         */
        let coordinate_x = Math.round((img_x - this.origin_x) / this.per_pixels * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)      // 保留1位有效小数
        let coordinate_y = Math.round((this.origin_y - img_y) / this.per_pixels * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)      // 
        return [coordinate_x, coordinate_y]
    }

    getLineCoordinateLength = (start_point, end_point, decimal_num = 0) => {
        /**
         * @description 获取直线坐标系长度
         * @param start_point 起点:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param end_point 终点:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param decimal_num 保留有效位数
         * @return 返回坐标系长度值
         */
        let img_length = Math.sqrt((start_point[0] - end_point[0]) * (start_point[0] - end_point[0]) + (start_point[1] - end_point[1]) * (start_point[1] - end_point[1]))
        let coordinate_length = Math.round(img_length / this.per_pixels * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
        // console.log('start_point, end_point',start_point, end_point, img_length,this.per_pixels, coordinate_length)
        return coordinate_length
    }
}

export class BaseProcessClass {
    /**
     * @description 基础数据处理类函数
     */
    constructor(per_pixels = 30) {
        /**
         * @param per_pixels 单格长度
         */
        this.per_pixels = per_pixels
    }

    VectorialAngleDirector = (vector_a, vector_b) => {
        /**
         * @description 向量顺时针逆时针夹角--
         * @param vector_a 向量a：[vec_x,vec_y]
         * @param vector_b 向量b：[vec_x,vec_y]
         * @return 返回vector_a->vector_b旋转夹角方向 顺时针+或逆时针-向量夹角 
         */
        let ab_dot = vector_a[0] * vector_b[0] + vector_a[1] * vector_b[1];   // 点积
        let ab_cross = vector_a[0] * vector_b[1] - vector_a[1] * vector_b[0];   // 叉积
        let ab_length = Math.sqrt(vector_a[0] * vector_a[0] + vector_a[1] * vector_a[1]) *
            Math.sqrt(vector_b[0] * vector_b[0] + vector_b[1] * vector_b[1]);// ab 模长乘积
        let sin_theta = Math.round(ab_cross / ab_length * 1000) / 1000;
        let sin_angle = Math.asin(sin_theta) / Math.PI * 180;
        let cos_theta = Math.round(ab_dot / ab_length * 1000) / 1000;
        let cos_angle = Math.acos(cos_theta) / Math.PI * 180;
        // console.log('cos', ab_dot, ab_length, cos_theta, cos_angle)
        let angle_0 = Math.round(cos_angle * 100) / 100;
        if (sin_angle <= 0) {
            // console.log('顺时针向量夹角', angle_0)
            // return angle_0;
            return isNaN(angle_0) ? 0 : angle_0
        }
        else {
            // console.log('逆时针向量夹角', -angle_0)
            // return -angle_0;
            return isNaN(-angle_0) ? 0 : -angle_0
        }
    }

    PointRotate = (fixed_point, rotate_point, rotate_angle) => {
        /**
         * @description 一个点绕固定点按角度旋转
         * @param fixed_point 固定点 [x,y]
         * @param rotate_point 移动旋转点 [x,y]
         * @param rotate_angle 旋转角度 1°
         */
        let rotate_radian = rotate_angle / 180 * Math.PI    // 角度数转换弧度数
        let new_x0 = (rotate_point[0] - fixed_point[0]) * Math.cos(-rotate_radian) - (rotate_point[1] - fixed_point[1]) * Math.sin(-rotate_radian) + fixed_point[0]
        let new_y0 = (rotate_point[0] - fixed_point[0]) * Math.sin(-rotate_radian) + (rotate_point[1] - fixed_point[1]) * Math.cos(-rotate_radian) + fixed_point[1]
        return [new_x0, new_y0]
    }

    SingleGraphRotate = (single_graph_mat, fixed_point, rotate_angle) => {
        /**
         * @description 单幅图像绕固定点旋转
         * @param single_graph_mat 单幅图像坐标：[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param fixed_point 绕点旋转固定点：[img_x,img_y]
         * @param rotate_angle 旋转角度
         * @return 返回旋转后的新图形坐标：[[img_x0,img_y0],[img_x1,img_y1],...]
         */
        let new_graph_mat = []
        for (let idx = 0; idx < single_graph_mat.length; idx++) {
            let part_point_mat = this.PointRotate(fixed_point, single_graph_mat[idx], rotate_angle)
            new_graph_mat.push(part_point_mat)
        }
        return new_graph_mat
    }

    AllGraphRotate = (all_graph_mat, fixed_point, rotate_angle) => {
        /**
         * @description 所有图形绕点旋转
         * @param all_graph_mat 所有图形组坐标：[[[img_x0,img_y0],[img_x1,img_y1],...],[[img_x0,img_y0],[img_x1,img_y1],...],....]
         * @param fixed_point 绕点旋转固定点：[img_x,img_y]
         * @param rotate_angle 旋转角度
         * @return 返回所有图形的旋转坐标：[[[img_x0,img_y0],[img_x1,img_y1],...],[[img_x0,img_y0],[img_x1,img_y1],...],....]
         */
        let new_all_graph_mat = []
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            new_all_graph_mat.push(this.SingleGraphRotate(all_graph_mat[idx], fixed_point, rotate_angle))
        }
        return new_all_graph_mat
    }

    AllGraphTextRotate = (all_text_mat, fixed_point, rotate_angle) => {
        /**
         * @description 原始文本坐标旋转
         * @param all_text_mat 文本坐标：[[[[img_x0,img_y0],"7.3"],[[img_x1,img_y1],"3.6"]],...]]
         * @param fixed_point 绕点旋转固定点：[img_x,img_y]
         * @param rotate_angle 旋转角度
         * @return 返回文本坐标
         */
        let new_text_loc_mat = []
        for (let idx = 0; idx < all_text_mat.length; idx++) {
            let single_text_mat = []
            for (let p_idx = 0; p_idx < all_text_mat[idx].length; p_idx++) {
                console.log('======fixed_point', fixed_point, all_text_mat[idx][p_idx])
                let point_loc = this.PointRotate(fixed_point, all_text_mat[idx][p_idx][0], rotate_angle)
                single_text_mat.push(point_loc)
            }
            new_text_loc_mat.push(single_text_mat)
        }
        return new_text_loc_mat
    }

    DataScreeningHeavy = (judge_mat, old_data) => {
        /**
         * @description 数据筛重2D
         * @param judge_mat 判定二元数组
         * @param old_data 筛选数组:[[x0,y0],[x1,y1],...]
         * @return 存在相同元素的索引
         */
        for (let idx = 0; idx < old_data.length; idx++) {
            if (judge_mat[0] === old_data[idx][0] && judge_mat[1] === old_data[idx][1]) {
                return idx
            }
        }
        return -1
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

    ParallelogramMoveLine = (old_graph_mat, move_mat, line_choice_idx) => {
        /**
         * @description 平行四边形移动边---验证不稳定性---四条边长度不变---
         * @param old_graph_mat 原平行四边形的四个点坐标：图像坐标，[[x0,y0],[x1,y1],[x2,y2],[x3,y3]]
         * @param move_mat 坐标移动长度:[move_x,move_y]
         * @param line_choice_idx 选择移动边索引---以数据点顺序
         * @return new_graph_mat 返回新的平行四边形坐标
         */
        let new_graph_mat = []      // 更新选择图形坐标矩阵
        // 固定边端点和移动点的之间的半径
        let fixed_point = old_graph_mat[(line_choice_idx + 2) % 4]
        let move_point = old_graph_mat[(line_choice_idx + 1) % 4]
        let vector_a = [move_point[0] - fixed_point[0], move_point[1] - fixed_point[1]]
        let vector_b = [move_point[0] + move_mat[0] - fixed_point[0], move_point[1] + move_mat[1] - fixed_point[1]]
        let rotate_angle = this.VectorialAngleDirector(vector_a, vector_b)
        let new_move_point = this.PointRotate(fixed_point, move_point, rotate_angle)
        let new_move_mat = [new_move_point[0] - move_point[0], new_move_point[1] - move_point[1]]
        for (let idx = 0; idx < old_graph_mat.length; idx++) {
            if ((line_choice_idx + 2) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([old_graph_mat[idx][0], old_graph_mat[idx][1]])
            }
            else if ((line_choice_idx + 3) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([old_graph_mat[idx][0], old_graph_mat[idx][1]])
            }
            else {
                // 非对角边--移动
                // new_graph_mat.push([old_graph_mat[idx][0] + move_mat[0], old_graph_mat[idx][1] + move_mat[1]])
                // 添加--固定边长---
                new_graph_mat.push([old_graph_mat[idx][0] + new_move_mat[0], old_graph_mat[idx][1] + new_move_mat[1]])
            }
        }
        return new_graph_mat
    }

    ParallelogramMovePoint = (old_graph_mat, move_mat, point_choice_idx) => {
        /**
         * @description 平行四边形移动点---验证不稳定性---四条边长度不变---
         * @param old_graph_mat 原平行四边形的四个点坐标：图像坐标，[[x0,y0],[x1,y1],[x2,y2],[x3,y3]]
         * @param move_mat 坐标移动长度:[move_x,move_y]
         * @param point_choice_idx 选择移动点索引---以数据点顺序
         * @return new_graph_mat 返回新的平行四边形坐标
         */
        let new_graph_mat = []      // 更新选择图形坐标矩阵
        // 固定边端点和移动点的之间的半径
        let fixed_point = old_graph_mat[(point_choice_idx + 2) % 4]
        let move_point = old_graph_mat[(point_choice_idx + 1) % 4]
        let vector_a = [move_point[0] - fixed_point[0], move_point[1] - fixed_point[1]]
        let vector_b = [move_point[0] + move_mat[0] - fixed_point[0], move_point[1] + move_mat[1] - fixed_point[1]]
        let rotate_angle = this.VectorialAngleDirector(vector_a, vector_b)
        let new_move_point = this.PointRotate(fixed_point, move_point, rotate_angle)
        let new_move_mat = [new_move_point[0] - move_point[0], new_move_point[1] - move_point[1]]
        for (let idx = 0; idx < old_graph_mat.length; idx++) {
            if ((point_choice_idx + 2) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([old_graph_mat[idx][0], old_graph_mat[idx][1]])
            }
            else if ((point_choice_idx + 3) % 4 === idx) {
                // 对角点固定
                new_graph_mat.push([old_graph_mat[idx][0], old_graph_mat[idx][1]])
            }
            else {
                // 非对角边--移动
                new_graph_mat.push([old_graph_mat[idx][0] + move_mat[0], old_graph_mat[idx][1] + move_mat[1]])
                // 添加--固定边长---
                // new_graph_mat.push([old_graph_mat[idx][0] + new_move_mat[0], old_graph_mat[idx][1] + new_move_mat[1]])
            }
        }
        return new_graph_mat
    }

    getChoiceGridData = (img_x_mat, img_y_mat, choice_grid_idx_mat) => {
        /**
         * @description 选择的网格索引获取网格坐标
         * @param img_x_mat 网格图像坐标x[x0,x1,x2,...]
         * @param img_y_mat 网格图像坐标y[y0,y1,y2,...]
         * @param choice_grid_idx_mat 网格索引组[[x_idx0,y_idx0],[x_idx1,y_idx1],...]
         * @return 选择网格的图像坐标组[[point0,point1,point2,point3],[],...]
         */
        let choice_grid_mat = []
        console.log('网格左下索引choice_grid_idx_mat', choice_grid_idx_mat)
        for (let idx = 0; idx < choice_grid_idx_mat.length; idx++) {
            let x_idx = choice_grid_idx_mat[idx][0]
            let y_idx = choice_grid_idx_mat[idx][1]
            let point_a = [img_x_mat[x_idx], img_y_mat[y_idx]]
            let point_b = [img_x_mat[x_idx + 1], img_y_mat[y_idx]]
            let point_c = [img_x_mat[x_idx + 1], img_y_mat[y_idx + 1][1]]
            let point_d = [img_x_mat[x_idx], img_y_mat[y_idx + 1][1]]
            choice_grid_mat.push([point_a, point_b, point_c, point_d])
        }
        return choice_grid_mat
    }

    JudgePointInArea = (point_mat, area_mat) => {
        /**
         * @description 判定点是否在一个封闭区域中
         * @param point_mat 判定点：[img_x,img_y]
         * @param area_mat 封闭图形点坐标[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2],...]
         * @return 四个方向的相交情况，是否在区域内的标签
         */
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
            // console.log('-----------up_judge', idx, up_judge)
            let down_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [point_mat, [point_mat[0], 5000]])  // 下方交点
            // console.log('-----------down_judge', idx, down_judge)
            let left_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [[-100, point_mat[1]], point_mat])  // 左方交点
            // console.log('-----------left_judge', idx, left_judge)
            let right_judge = newgraphcls.JudgeLineIntersectionLoc([start_point, end_point], [point_mat, [5000, point_mat[1]]])  // 右方交点
            // console.log('-----------right_judge', idx, right_judge, JSON.stringify([start_point, end_point]), JSON.stringify([point_mat, [5000, point_mat[1]]]))
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

    JudgeTouchGraphIdx = (touch_point, all_graph_mat) => {
        /**
         * @description 遍历判定图形选择索引
         * @param touch_point 触控点:[img_x,img_y]
         * @param all_graph_mat 所有待判定图形的图形坐标点[[[img1_x0,img1_y0],[img1_x1,img1_y1],...],[[img2_x0,img2_y0],[img2_x1,img2_y1],...],...]
         * @return 返回选择图形的索引--未选中返回-1
         */
        // console.log('all_graph_mat', all_graph_mat)
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
        return [-1]
    }

    JudgePointExist = (init_data, [start_point, end_point]) => {
        /**
         * @description 判定线条是否存在初始数组中
         * @param init_data 对比线条数组：[[[img_x0,img_y0],[img_x1,img_y1]],[],[]]
         * @param start_point end_point  对比线条端点[img_x0,img_y0],[img_x1,img_y1]
         * @return 返回ture/false
         */
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

    JudgePointInLine = (point_mat, area_mat) => {
        /**
         * @description 判定点在选择线条----以点到直线最小距离为判定
         * @param point_mat 待判定点：[img_x,img_y]
         * @param area_mat  所有图形的端点数据[[[img0_x0,img0_y0],[img0_x1,img0_y1],[img0_x2,img0_y2],...],[],[]]
         * @return 返回图形组索引及对应的线条起点索引
         */
        let all_graph_min_distance = []
        let all_graph_min_idx = []
        for (let idx = 0; idx < area_mat.length; idx++) {
            // 单组图像
            let part_graph_distance = []
            for (let p_idx = 0; p_idx < area_mat[idx].length; p_idx++) {
                let distance = this.JudgePointInLineLoc(point_mat, [area_mat[idx][p_idx], area_mat[idx][(p_idx + 1) % area_mat[idx].length]])
                part_graph_distance.push(distance)
            }
            // console.log('--------part_graph_distance', part_graph_distance)
            let [center_sort, index_sort] = this.ArraySortMat(part_graph_distance)
            // console.log('-------排序及索引', center_sort, index_sort)
            all_graph_min_distance.push(center_sort[0])
            all_graph_min_idx.push(index_sort[0])
        }
        // 全部图像最小距离排序
        let [all_center_sort, all_index_sort] = this.ArraySortMat(all_graph_min_distance)
        // console.log('========全局图像最小排序', all_center_sort, all_index_sort)
        if (all_center_sort[0] < 10) {
            // 取最小阈值
            return [all_index_sort[0], all_graph_min_idx[all_index_sort[0]]]  // 第几幅图中的第几条线
        }
        else {
            return [-1, -1]
        }
    }

    JudgePointInLineLoc = (point_mat, line_mat) => {
        /**
         * @description 判定点到直线的距离和线内交点
         * @param point_mat 判定点:[img_x,img_y]
         * @param line_mat 线条端点数据：[[img_x0,img_y0],[img_x1,img_y1]]
         * @return 返回点到直线的实交点距离，没有实交点返回一个较大的常数值
         */
        // console.log('---------计算点', point_mat, line_mat)
        let symmetry_point = newgraphcls.PointSymmetry(point_mat, line_mat)  // 对称点
        console.log('对称点', point_mat, symmetry_point)
        let intersection_mat = [(point_mat[0] + symmetry_point[0]) / 2, (point_mat[1] + symmetry_point[1]) / 2]
        console.log('----交点', intersection_mat)
        // 线内交点判定
        let in_out_judge = newgraphcls.JudgeLineIntersectionLoc([point_mat, symmetry_point], line_mat)  // 上方交点
        console.log('线内--线外---交点判定', in_out_judge)
        let distance = this.TwoPointDistance(point_mat, intersection_mat)
        console.log('============点到直线距离-----', distance)
        if (in_out_judge.length === 3) {
            // 有效线内交点
            return distance
        }
        else {
            return 1000
        }
    }

    JudgePointInLineFlag = (point_mat, line_mat) => {
        /**
         * @description 判定点在直线内
         * @param point_mat 判定点:[img_x,img_y]
         * @param line_mat 线条端点数据：[[img_x0,img_y0],[img_x1,img_y1]]
         * @return [线上、线内、端点] 标签 true or false
         */
        // console.log('---------计算点', point_mat, line_mat)
        let distance_line = this.TwoPointDistance(line_mat[0], line_mat[1])
        let distance_0 = this.TwoPointDistance(point_mat, line_mat[0])
        let distance_1 = this.TwoPointDistance(point_mat, line_mat[1])
        let threshold_value = 0.0001
        if ((point_mat[0] === line_mat[0][0] && point_mat[1] === line_mat[0][1]) ||
            (point_mat[0] === line_mat[1][0] && point_mat[1] === line_mat[1][1])) {
            // 端点---线上不在线内
            return { 'on_line': true, 'in_line': false, 'end_point': true }
        }
        else if (Math.abs(distance_line - distance_0 - distance_1) < threshold_value) {
            // 线内点
            return { 'on_line': true, 'in_line': true, 'end_point': false }
        }
        else if (Math.abs(distance_0 - distance_line - distance_1) < threshold_value ||
            Math.abs(distance_1 - distance_line - distance_0) < threshold_value) {
            // 线上、线外
            return { 'on_line': true, 'in_line': false, 'end_point': false }
        }
        else {
            return { 'on_line': false, 'in_line': false, 'end_point': false }
        }
    }


    JudgePointInPoint = (point_mat, area_mat) => {
        /**
         * @description 判定触摸点与图像端点选择情况
         * @param point_mat 待判定点坐标：[img_x,img_y]
         * @param area_mat  所有图形的端点数据[[[img0_x0,img0_y0],[img0_x1,img0_y1],[img0_x2,img0_y2],...],[],[]]
         * @return 返回图形组索引及对应的点索引
         */
        let all_graph_min_distance = []
        let all_graph_min_idx = []
        for (let idx = 0; idx < area_mat.length; idx++) {
            // 单组图像
            let part_graph_distance = []
            for (let p_idx = 0; p_idx < area_mat[idx].length; p_idx++) {
                let distance = Math.round(this.TwoPointDistance(point_mat, area_mat[idx][p_idx]) * 10) / 10
                part_graph_distance.push(distance)
            }
            //   console.log('点对点--------part_graph_distance', part_graph_distance)
            let [center_sort, index_sort] = this.ArraySortMat(part_graph_distance)
            //   console.log('点对点-------排序及索引', center_sort, index_sort)
            all_graph_min_distance.push(center_sort[0])
            all_graph_min_idx.push(index_sort[0])
        }
        // 全部图像最小距离排序
        let [all_center_sort, all_index_sort] = this.ArraySortMat(all_graph_min_distance)
        // console.log('点对点========全局图像最小排序', all_center_sort, all_index_sort)
        if (all_center_sort[0] < 10) {
            // 取最小阈值
            return [all_index_sort[0], all_graph_min_idx[all_index_sort[0]]]  // 第几幅图中的第几条线
        }
        else {
            return [-1, -1]
        }
    }

    JudgeDrawGraphLine = (answer_point_mat, draw_line_mat) => {
        /**
         * @description 判定答案坐标和绘制线条之间的包含关系
         * @param answer_point_mat 答案坐标点：[[img0_x0,img0_y0],[img0_x1,img0_y1],[img0_x2,img0_y2],...]
         * @param draw_line_mat 绘制直线组：[[[img0_x0,img0_y0],[img0_x1,img0_y1]],[[img1_x0,img1_y0],[img1_x1,img1_y1]],...]
         * @return ture:正确绘制、false：错误绘制
         */
        // 初始化---
        let in_line_dict = {}
        for (let idx = 0; idx < answer_point_mat.length - 1; idx++) {
            in_line_dict[idx] = []
        }
        // console.log('in_line_dict-------init', in_line_dict)
        // 1.判定所有的绘制直线端点在答案的线条内或端点上---排除错误直线
        // draw_line_mat.forEach((part_line_mat) => {
        for (let idx = 0; idx < draw_line_mat.length; idx++) {
            let part_line_mat = draw_line_mat[idx]
            let part_point_a = part_line_mat[0]     // 第一个点
            let part_point_b = part_line_mat[1]     //第二个点
            let valid_flag = 1
            for (let idx = 0; idx < answer_point_mat.length - 1; idx++) {
                let part_answer_line = [answer_point_mat[idx], answer_point_mat[idx + 1]]
                let judge_flag_a_dict = this.JudgePointInLineFlag(part_point_a, part_answer_line)
                // console.log('init_line_judge_flag_a_dict', judge_flag_a_dict)
                if (judge_flag_a_dict['in_line'] === false && judge_flag_a_dict['end_point'] === false) {
                    // 不在线内也不在端点上
                    // console.log('init_line=---------return false')
                    // return false
                    valid_flag = 0
                    continue
                }
                let judge_flag_b_dict = this.JudgePointInLineFlag(part_point_b, part_answer_line)
                // console.log('init_line_judge_flag_b_dict', judge_flag_b_dict)

                if (judge_flag_b_dict['in_line'] === false && judge_flag_b_dict['end_point'] === false) {
                    // console.log('init_line=---------return false')
                    // return false
                    valid_flag = 0
                    continue
                }
                // 保存在对应的数组序号内，进行单线条二次计算
                in_line_dict[idx].push(part_line_mat)
                valid_flag = 1
                break
            }
            if (valid_flag === 0) {
                return false
            }
        }
        // console.log('init_line_in_line_dict-------in_line', in_line_dict)
        for (let part_key in in_line_dict) {
            // console.log('init_line_mat_part_key', part_key, JSON.stringify(in_line_dict[part_key]))
            let [part_flag, part_line] = this.CombineStraightLine(in_line_dict[part_key])
            // console.log('init_line组合', part_flag, JSON.stringify(part_line))
            // console.log('init_line组合', part_flag, JSON.stringify([answer_point_mat[parseInt(part_key)], answer_point_mat[parseInt(part_key) + 1]]))
            if (part_flag) {
                let answer_line = [answer_point_mat[parseInt(part_key)], answer_point_mat[parseInt(part_key) + 1]]
                if (Math.abs(this.TwoPointDistance(part_line[0], part_line[1]) - this.TwoPointDistance(answer_line[0], answer_line[1])) > 0.001) {
                    return false
                }
            }
            else {
                return false
            }
        }
        return true
    }

    CombineStraightLine = (discrete_line_mat) => {
        /**
         * @description 多条线段离散同一直线上组合直线
         * @param discrete_line_mat 离散线条组
         * @return 是否可组合一条直线标签及对应组合直线
         */
        if (discrete_line_mat.length === 1) {
            return [true, discrete_line_mat[0]]
        }
        else if (discrete_line_mat.length < 1) {
            return [false, []]
        }
        else {
            // 组合直线
            let init_line_mat = discrete_line_mat[0]
            let used_idx = [0]
            let flag_num = 0
            // console.log('init_line_mat', flag_num, JSON.stringify(init_line_mat))
            while (flag_num < discrete_line_mat.length) {
                for (let idx = 0; idx < discrete_line_mat.length; idx++) {
                    if (used_idx.indexOf(idx) < 0) {
                        // 未使用判定
                        let [judge_flag, combie_line_mat] = this.TwoLineCombineStraightLine(init_line_mat, discrete_line_mat[idx])
                        if (judge_flag === true) {
                            init_line_mat = _.cloneDeep(combie_line_mat)
                            used_idx.push(idx)
                        }
                    }
                }
                flag_num += 1
                // console.log('init_line_mat', flag_num, JSON.stringify(init_line_mat))
            }
            return [true, init_line_mat]
        }
    }

    TwoLineCombineStraightLine = (line_a_mat, line_b_mat) => {
        /**
         * @description 两条直线组合一条直线
         * @param line_a_mat 线条a:[[img0_x0,img0_y0],[img0_x1,img0_y1]]
         * @param line_b_mat 线条b:[[img0_x0,img0_y0],[img0_x1,img0_y1]]
         * @return 返回可组合标签
         */
        let judge_flag_a_in_b_0 = this.JudgePointInLineFlag(line_a_mat[0], line_b_mat)
        let judge_flag_a_in_b_1 = this.JudgePointInLineFlag(line_a_mat[1], line_b_mat)
        let judge_flag_b_in_a_0 = this.JudgePointInLineFlag(line_b_mat[0], line_a_mat)
        let judge_flag_b_in_a_1 = this.JudgePointInLineFlag(line_b_mat[1], line_a_mat)
        if (judge_flag_a_in_b_0['in_line'] === false && judge_flag_a_in_b_0['end_point'] === false &&
            judge_flag_a_in_b_1['in_line'] === false && judge_flag_a_in_b_1['end_point'] === false &&
            judge_flag_b_in_a_0['in_line'] === false && judge_flag_b_in_a_0['end_point'] === false &&
            judge_flag_b_in_a_1['in_line'] === false && judge_flag_b_in_a_1['end_point'] === false) {
            // 两条直线无公共部分
            return [false, []]
        }
        else if (judge_flag_a_in_b_0['in_line'] === true && judge_flag_a_in_b_1['in_line'] === true) {
            // a在b中
            return [true, line_b_mat]
        }
        else if (judge_flag_b_in_a_0['in_line'] === true && judge_flag_b_in_a_1['in_line'] === true) {
            // b在a中
            return [true, line_a_mat]
        }
        else {
            // 交叉
            if (judge_flag_a_in_b_0['in_line'] === false && judge_flag_a_in_b_0['end_point'] === false &&       //线外
                (judge_flag_a_in_b_1['in_line'] === true || judge_flag_a_in_b_1['end_point'] === true) &&        // 线内+端点
                judge_flag_b_in_a_0['in_line'] === false && judge_flag_b_in_a_0['end_point'] === false &&       //线外
                (judge_flag_b_in_a_1['in_line'] === true || judge_flag_b_in_a_1['end_point'] === true)         // 线内+端点   
            ) {
                return [true, [line_a_mat[0], line_b_mat[0]]]
            }
            else if (judge_flag_a_in_b_0['in_line'] === false && judge_flag_a_in_b_0['end_point'] === false &&       //线外
                (judge_flag_a_in_b_1['in_line'] === true || judge_flag_a_in_b_1['end_point'] === true) &&        // 线内+端点
                (judge_flag_b_in_a_0['in_line'] === true || judge_flag_b_in_a_0['end_point'] === true) &&       //线内+端点
                judge_flag_b_in_a_1['in_line'] === false && judge_flag_b_in_a_1['end_point'] === false          // 线外   
            ) {
                return [true, [line_a_mat[0], line_b_mat[1]]]
            }
            else if ((judge_flag_a_in_b_0['in_line'] === true || judge_flag_a_in_b_0['end_point'] === true) &&       //线内+端点
                judge_flag_a_in_b_1['in_line'] === false && judge_flag_a_in_b_1['end_point'] === false &&        // 线外
                (judge_flag_b_in_a_0['in_line'] === true || judge_flag_b_in_a_0['end_point'] === true) &&       //线内+端点
                judge_flag_b_in_a_1['in_line'] === false && judge_flag_b_in_a_1['end_point'] === false          // 线外   
            ) {
                return [true, [line_a_mat[1], line_b_mat[1]]]
            }
            else if ((judge_flag_a_in_b_0['in_line'] === true || judge_flag_a_in_b_0['end_point'] === true) &&       //线内+端点
                judge_flag_a_in_b_1['in_line'] === false && judge_flag_a_in_b_1['end_point'] === false &&        // 线外
                judge_flag_b_in_a_0['in_line'] === false && judge_flag_b_in_a_0['end_point'] === false &&       // 线外
                (judge_flag_b_in_a_1['in_line'] === true || judge_flag_b_in_a_1['end_point'] === true)         // 线内+端点
            ) {
                return [true, [line_a_mat[1], line_b_mat[0]]]
            }
            else if (judge_flag_a_in_b_0['in_line'] === false && judge_flag_a_in_b_0['end_point'] === false       //线外
                || judge_flag_a_in_b_1['in_line'] === false && judge_flag_a_in_b_1['end_point'] === false       //线外
            ) {
                return [true, line_a_mat]
            }
            else if (judge_flag_b_in_a_0['in_line'] === false && judge_flag_b_in_a_0['end_point'] === false       //线外
                || judge_flag_b_in_a_1['in_line'] === false && judge_flag_b_in_a_1['end_point'] === false       //线外
            ) {
                return [true, line_b_mat]
            }
            else {
                return [false, []]
            }
        }
    }

    TwoPointDistance = (point_a, point_b) => {
        /**
         * @description  计算两点距离
         * @param point_a 点a坐标: [img_x,img_y]
         * @param point_b 点b坐标: [img_x,img_y]
         * @return 两点距离
         */
        let distance = Math.sqrt((point_a[0] - point_b[0]) * (point_a[0] - point_b[0]) + (point_a[1] - point_b[1]) * (point_a[1] - point_b[1]))
        return distance
    }

    JudgeGridChoiceIdx = (img_x_mat, img_y_mat, point_mat) => {
        /**
        * @description 格子选择判定---触摸点/横向----纵向---依次判定
        * @param img_x_mat 网格图像坐标x[x0,x1,x2,...]
        * @param img_y_mat 网格图像坐标y[y0,y1,y2,...]
        * @param point_mat 待判定点坐标
        * @return 返回选择的格子属于图形索引
        */
        let row_choice_idx = -1
        let col_choice_idx = -1
        // 横向
        for (let idx = 0; idx < img_x_mat.length; idx++) {
            if (idx < img_x_mat.length - 1) {
                // console.log('========', point_mat, img_x_mat[idx])
                if (point_mat[0] < img_x_mat[idx + 1] && point_mat[0] >= img_x_mat[idx]) {
                    col_choice_idx = idx
                }
            }
            else {
                if (point_mat[0] >= img_x_mat[idx - 1]) {
                    col_choice_idx = idx - 1
                }
            }
        }
        // 纵向
        for (let idx = 0; idx < img_y_mat.length; idx++) {
            if (idx < img_y_mat.length - 1) {
                console.log('==========', point_mat[1], img_y_mat[idx])
                if (point_mat[1] > (img_y_mat[idx + 1][1]) && point_mat[1] <= (img_y_mat[idx][1])) {
                    row_choice_idx = idx
                }
            }
            else {
                if (point_mat[1] <= (img_y_mat[idx - 1][1])) {
                    row_choice_idx = idx - 1
                }
            }
        }
        return [col_choice_idx, row_choice_idx]
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

    EndpointAdsorptionCalculate = (all_line_data, choice_idx, temporary_data) => {
        /**
         * @description 判定计算移动线段与其余线条组的端点距离情况
         * @param all_line_data 所有线条数组：[[[img0_x0,img0_y0],[img0_x1,img0_y1]],[[img1_x0,img1_y0],[img1_x1,img1_y1]],...]
         * @param choice_idx 选择移动线条组的索引idx:避免重复比较
         * @param temporary_data 移动过程中变化的临时线条数据：[[img_x0,img_y0],[img_x1,img_y1]]
         * @return 返回接近的线条索引、移动线条的端点索引、比较吸附的线条的端点索引
         */
        let choice_data = _.cloneDeep(temporary_data) // 移动线段
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

    JudgeCombineLine = (all_line_data) => {
        /**
         * @description 遍历所有直线组合情况
         * @param all_line_data 所有线条数组：[[[img0_x0,img0_y0],[img0_x1,img0_y1]],[[img1_x0,img1_y0],[img1_x1,img1_y1]],...]
         * @return 返回组合索引---单组
        */
        let distance_threshold = 5
        let combine_line_idx = []
        for (let idx1 = 0; idx1 < all_line_data.length - 1; idx1++) {
            for (let idx2 = idx1 + 1; idx2 < all_line_data.length; idx2++) {
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
        // console.log('组合组', combine_line_idx)
        return combine_line_idx
    }

    JudgeClosedGraph = (all_graph_mat, combine_idx) => {
        /**
         * @description 判定封闭图形
         * @param all_graph_mat 所有线条数据:[[[img0_x0,img0_y0],[img0_x1,img0_y1]],[[img1_x0,img1_y0],[img1_x1,img1_y1]],...]
         * @param combine_idx   组合索引[1,5,3]
         * @return 返回正确的组合图像坐标
         */
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
                // 第一条线的第一个点与最后一条线的最后一个点相同----线条
                return closed_graph
            }
            return []
        }
        return []
    }

    LinkLinePoint = (line_graph_mat) => {
        /**
         * @description 连接并判定线条组的端点
         * @param line_graph_mat 线条图组:[[[img_x0,img_y0],[img_x1,img_y1]],[[],[]],...] 
         * @return 返回线条拼接点的[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2],...]
         */
        let link_point_mat = []
        for (let idx = 0; idx < line_graph_mat.length; idx++) {
            // 需保证单组长度为2的线条组
            if (this.TwoPointDistance(line_graph_mat[idx][0], line_graph_mat[(idx - 1 + line_graph_mat.length) % line_graph_mat.length][1]) < 0.01) {
                link_point_mat.push(line_graph_mat[idx][0])
            }
            else {
                return []
            }
        }
        return link_point_mat
    }

    CalculateHighLine = (cut_line_mat, graph_line_mat, vertical_length) => {
        /**
         * @description 求解画线与单条线的垂直情况---实交点情况
         * @param cut_line_mat 绘制直线坐标数组[[img_x0,img_y0],[img_x1,img_y1]]
         * @param graph_line_mat 图像直线坐标数组[[img_x0,img_y0],[img_x1,img_y1]]
         * @param vertical_length 直角符号长度：5
         * @return 返回相交情况及存在的直角符号坐标数组
         */
        // for (let idx = 0; idx < draw_line_mat.length; idx++) {
        let intersect_mat = newgraphcls.JudgeLineIntersectionLoc(cut_line_mat, graph_line_mat)
        // console.log('相交情况', intersect_mat)
        let new_abc = newgraphcls.Line_ABC(cut_line_mat[0], cut_line_mat[1])
        let old_abc = newgraphcls.Line_ABC(graph_line_mat[0], graph_line_mat[1])
        // console.log('两条直线的线参数', new_abc, old_abc)
        if (intersect_mat.length == 3) {
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
                // 绘制垂线标识符号// 求解拐点---正方形终点
                let center_x = (vertical_x1 + vertical_x2) / 2
                let center_y = (vertical_y1 + vertical_y2) / 2
                let inflect_x = center_x + (center_x - intersect_mat[1])
                let inflect_y = center_y + (center_y - intersect_mat[2])
                // let ployline_str = vertical_x1 + ',' + vertical_y1 + ' ' + inflect_x + ',' + inflect_y + ' ' + vertical_x2 + ',' + vertical_y2
                let ployline_mat = [[vertical_x1, vertical_y1], [inflect_x, inflect_y], [vertical_x2, vertical_y2]]
                return [intersect_mat, ployline_mat]
            }
            return [intersect_mat, []]
        }
        return [[], []]
    }

    AllCalculateHighLine = (cut_line_mat, graph_all_line_mat, choice_point_idx, vertical_length) => {
        /**
         * @description 单幅图像，任意端点选择绘制计算高
         * @param cut_line_mat 绘制判定直线坐标：[[img_x0,img_y0],[img_x1,img_y1]]
         * @param graph_all_line_mat 单幅图像连续点坐标：[[img_x0,img_y0],[img_x1,img_y1],....]
         * @param choice_point_idx 该单幅图形中的选定做线的端点索引
         * @param vertical_length 直角符号长度
         * @return 返回相交情况及存在的直角符号坐标数组
         */
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
        /**
         * @description 求解画线与单条线的垂直情况----包含延长线垂直情况
         * @param cut_line_mat 绘制直线坐标数组[[img_x0,img_y0],[img_x1,img_y1]]
         * @param graph_line_mat 图像直线坐标数组[[img_x0,img_y0],[img_x1,img_y1]]
         * @param vertical_length 直角符号长度：5
         * @return 返回相交情况及存在的直角符号坐标数组
         */
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
        /**
         * @description 单幅图像，任意端点选择绘制高----添加虚线求解---新增---添加所有有效交点---建立筛选决策：直角优先、内交点优先
         * @param cut_line_mat 绘制判定直线坐标：[[img_x0,img_y0],[img_x1,img_y1]]
         * @param graph_all_line_mat 单幅图像连续点坐标：[[img_x0,img_y0],[img_x1,img_y1],....]
         * @param choice_point_idx 该单幅图形中的选定做线的端点索引
         * @param vertical_length 直角符号长度
         * @return 返回相交情况及存在的直角符号坐标数组、相交垂直索引
         */
        let all_line_intersect_mat = []
        for (let idx = 0; idx < graph_all_line_mat.length; idx++) {
            if (idx !== choice_point_idx && (idx + 1) % graph_all_line_mat.length != choice_point_idx) {
                // console.log('-------合适点')
                let [intersect_mat, ployline_mat] = this.CalculateHighLine2(cut_line_mat, [graph_all_line_mat[idx], graph_all_line_mat[(idx + 1) % graph_all_line_mat.length]], vertical_length)
                // intersect_mat[0]===0 内交点、 intersect_mat[0]===100 外交点
                // console.log('---交点情况-', JSON.stringify([intersect_mat, ployline_mat]), idx)
                if (intersect_mat.length === 3 && ployline_mat.length > 0) {
                    // 有交点且为直角情况直接返回
                    // console.log('交点有直角', intersect_mat, ployline_mat, idx)
                    return [intersect_mat, ployline_mat, idx]   // 新增---交线索引
                }
                else if (intersect_mat.length === 3 && intersect_mat[0] === 0) {
                    // 保存查看内交点
                    // console.log('内交点', intersect_mat, ployline_mat, idx)
                    // return [intersect_mat, ployline_mat, idx]   // 新增---交线索引
                    all_line_intersect_mat.push([intersect_mat, ployline_mat, idx])
                }
            }
        }
        console.log('所有交点情况二次判定', JSON.stringify(all_line_intersect_mat))
        for (let idx = 0; idx < all_line_intersect_mat.length; idx++) {
            if (all_line_intersect_mat[idx][0].length === 3 && all_line_intersect_mat[idx][0][0] === 0) {
                return all_line_intersect_mat[idx]
            }
        }
        return [[], [], []]
    }

    CalculateAllGraphHeight = (all_graph_mat, cut_line_mat, vertical_length) => {
        /**
         * @description 计算所有图形与分割线存在垂直符号的情况
         * @param all_graph_mat:所有图像坐标点, 
         * @param cut_line_mat：切割线
         * @param vertical_length:直角长度
         * @return 返回所有直角高符号的坐标
         */
        let all_height_mat = [] // 所有高符号点
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            // 遍历图像
            let part_graph_mat = all_graph_mat[idx]
            if (part_graph_mat.length > 2) {
                for (let point_idx = 0; point_idx < part_graph_mat.length; point_idx++) {
                    // 遍历所有线条
                    let graph_line_mat = [part_graph_mat[point_idx], part_graph_mat[(point_idx + 1) % part_graph_mat.length]]
                    // console.log('单边计算', cut_line_mat, graph_line_mat)
                    let [intersect_mat, ployline_mat] = this.CalculateHighLine(cut_line_mat, graph_line_mat, vertical_length)
                    // console.log('ployline_mat----------',JSON.stringify(ployline_mat))
                    if (ployline_mat.length > 0) {
                        all_height_mat.push(ployline_mat)
                    }
                }
            }
        }
        return all_height_mat
    }

    CalculateSideAbsorb = (all_graph_data, choice_graph_idx, choice_graph_data, min_threshold = 5) => {
        /**
         * @description 计算移动图形对应边移动过程的吸附情况----图形为3点及以上封闭图形
         * @param all_graph_data:所有图形数据,
         * @param choice_graph_idx：选择图形索引
         * @return choice_point_mat:移动组匹配点, group_point_mat：匹配图像组, neighbor_side_mat：邻近边组
         */
        let [neighbor_point_mat, neighbor_side_mat] = [[], []] // 邻近点、邻近边
        // let choice_graph_data = all_graph_data[choice_graph_idx]  // 移动选择图形
        for (let idx = 0; idx < all_graph_data.length; idx++) {
            if (idx != choice_graph_idx) {
                let [part_point_mat, part_side_idx_mat] = this.SingleGroupSideAbsorb(choice_graph_data, all_graph_data[idx], min_threshold)
                if (part_point_mat.length > 0) {
                    neighbor_point_mat.push(part_point_mat)
                    neighbor_side_mat.push([idx, part_side_idx_mat])
                }
            }
        }
        // 索引端点数据提取
        let choice_point_mat = []
        let group_point_mat = []
        for (let idx = 0; idx < neighbor_side_mat.length; idx++) {
            let part_graph_mat = all_graph_data[neighbor_side_mat[idx][0]] // 比较组数据
            let part_side_idx_mat = neighbor_side_mat[idx][1]   // 对边组
            // console.log('对边组', part_side_idx_mat)
            for (let side_idx = 0; side_idx < part_side_idx_mat.length; side_idx++) {
                let choice_side_point = [choice_graph_data[part_side_idx_mat[side_idx][0][0]], choice_graph_data[part_side_idx_mat[side_idx][0][1]]]
                let group_side_point = [part_graph_mat[part_side_idx_mat[side_idx][1][0]], part_graph_mat[part_side_idx_mat[side_idx][1][1]]]
                // console.log('边组', JSON.stringify(choice_side_point), JSON.stringify(group_side_point))
                choice_point_mat.push(choice_side_point)
                group_point_mat.push(group_side_point)
            }
        }
        console.log('匹配索引---cut', JSON.stringify(choice_point_mat), JSON.stringify(group_point_mat), JSON.stringify(neighbor_side_mat))
        // return [neighbor_point_mat, neighbor_side_mat]
        return [choice_point_mat, group_point_mat, neighbor_side_mat]  // 直接返回待渲染边
    }

    SingleGroupSideAbsorb = (graph_mat_a, graph_mat_b, distance_threshold = 5) => {
        /**
         * @description 两幅图像对比---邻近点、邻近边
         * @param graph_mat_a 图像a坐标：[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param graph_mat_b 图像b坐标：[[img_x0,img_y0],[img_x1,img_y1],...]
         * @return 返回邻近点坐标和 边索引 ---neighbor_point_mat, neighbor_side_idx_mat
         */
        // console.log('点边吸附graph_mat_a, graph_mat_b', JSON.stringify(graph_mat_a), JSON.stringify(graph_mat_b))
        let [neighbor_point_mat, neighbor_side_idx_mat] = [[], []] // 邻近点、邻近边索引组
        // 点--边（连续点）
        // let distance_threshold = 20
        for (let idx_a = 0; idx_a < graph_mat_a.length; idx_a++) {
            for (let idx_b = 0; idx_b < graph_mat_b.length; idx_b++) {
                let point_distance = this.TwoPointDistance(graph_mat_a[idx_a], graph_mat_b[idx_b])
                // console.log('点边吸附、距离------', JSON.stringify([graph_mat_a[idx_a], graph_mat_b[idx_b]]), point_distance)
                if (point_distance < distance_threshold) {
                    // 两点距离
                    neighbor_point_mat.push([graph_mat_a[idx_a], graph_mat_b[idx_b]])  // 邻近点组
                    // 遍历相邻四组
                    let point_distance_a = this.TwoPointDistance(
                        graph_mat_a[(idx_a + 1) % graph_mat_a.length],
                        graph_mat_b[(idx_b + 1) % graph_mat_b.length])
                    let point_distance_b = this.TwoPointDistance(
                        graph_mat_a[(idx_a + 1) % graph_mat_a.length],
                        graph_mat_b[(idx_b - 1 + graph_mat_b.length) % graph_mat_b.length])
                    let point_distance_c = this.TwoPointDistance(
                        graph_mat_a[(idx_a - 1 + graph_mat_a.length) % graph_mat_a.length],
                        graph_mat_b[(idx_b + 1) % graph_mat_b.length])
                    let point_distance_d = this.TwoPointDistance(
                        graph_mat_a[(idx_a - 1 + graph_mat_a.length) % graph_mat_a.length],
                        graph_mat_b[(idx_b - 1 + graph_mat_b.length) % graph_mat_b.length])
                    if (point_distance_a < distance_threshold) {
                        let part_group_idx_mat = [
                            [(idx_a + graph_mat_a.length) % graph_mat_a.length, (idx_a + 1 + graph_mat_a.length) % graph_mat_a.length],
                            [(idx_b + graph_mat_b.length) % graph_mat_b.length, (idx_b + 1 + graph_mat_b.length) % graph_mat_b.length]
                        ]
                        let group_flag = 1
                        for (let group_idx = 0; group_idx < neighbor_side_idx_mat.length; group_idx++) {
                            if (neighbor_side_idx_mat[group_idx].join(',') === part_group_idx_mat.join(',')) {
                                group_flag = 0
                                break
                            }
                        }
                        if (group_flag === 1) {
                            neighbor_side_idx_mat.push(part_group_idx_mat)   // 索引边组
                        }
                    }
                    if (point_distance_b < distance_threshold) {
                        let part_group_idx_mat = [
                            [(idx_a + graph_mat_a.length) % graph_mat_a.length, (idx_a + 1 + graph_mat_a.length) % graph_mat_a.length],
                            [(idx_b + graph_mat_b.length) % graph_mat_b.length, (idx_b - 1 + graph_mat_b.length) % graph_mat_b.length]
                        ]  // 索引边组  
                        let group_flag = 1
                        for (let group_idx = 0; group_idx < neighbor_side_idx_mat.length; group_idx++) {
                            if (neighbor_side_idx_mat[group_idx].join(',') === part_group_idx_mat.join(',')) {
                                group_flag = 0
                                break
                            }
                        }
                        if (group_flag === 1) {
                            neighbor_side_idx_mat.push(part_group_idx_mat)   // 索引边组
                        }
                    }
                    if (point_distance_c < distance_threshold) {
                        let part_group_idx_mat = [
                            [(idx_a - 1 + graph_mat_a.length) % graph_mat_a.length, (idx_a + graph_mat_a.length) % graph_mat_a.length],
                            [(idx_b + 1 + graph_mat_b.length) % graph_mat_b.length, (idx_b + graph_mat_b.length) % graph_mat_b.length]
                        ]   // 索引边组    
                        let group_flag = 1
                        for (let group_idx = 0; group_idx < neighbor_side_idx_mat.length; group_idx++) {
                            if (neighbor_side_idx_mat[group_idx].join(',') === part_group_idx_mat.join(',')) {
                                group_flag = 0
                                break
                            }
                        }
                        if (group_flag === 1) {
                            neighbor_side_idx_mat.push(part_group_idx_mat)   // 索引边组
                        }
                    }
                    if (point_distance_d < distance_threshold) {
                        let part_group_idx_mat = [
                            [(idx_a - 1 + graph_mat_a.length) % graph_mat_a.length, (idx_a + graph_mat_a.length) % graph_mat_a.length],
                            [(idx_b - 1 + graph_mat_b.length) % graph_mat_b.length, (idx_b + graph_mat_b.length) % graph_mat_b.length]]
                        let group_flag = 1
                        for (let group_idx = 0; group_idx < neighbor_side_idx_mat.length; group_idx++) {
                            if (neighbor_side_idx_mat[group_idx].join(',') === part_group_idx_mat.join(',')) {
                                group_flag = 0
                                break
                            }
                        }
                        if (group_flag === 1) {
                            neighbor_side_idx_mat.push(part_group_idx_mat)   // 索引边组
                        }
                    }
                }
            }
        }
        console.log('两幅图像比较结果', JSON.stringify(neighbor_point_mat), JSON.stringify(neighbor_side_idx_mat))
        return [neighbor_point_mat, neighbor_side_idx_mat]
    }

    DataReordering = (init_data, idx_data) => {
        /**
         * @description 数据重排数据
         * @param init_data 初始数据
         * @param idx_data 索引
         * @return 返回重新排序 
         */
        let new_data = []
        if ((idx_data[1] - idx_data[0]) === 1 || (((idx_data[1] + init_data.length) % init_data.length) === 0 && idx_data[0] > 1)) {
            // 反向
            console.log('数据原始反向')
            for (let idx = 0; idx < init_data.length; idx++) {
                new_data.push(init_data[(init_data.length - idx + idx_data[0]) % init_data.length])
            }
        }
        else {
            // 原始顺序方向
            console.log('数据原始方向')
            for (let idx = 0; idx < init_data.length; idx++) {
                new_data.push(init_data[(idx + idx_data[0]) % init_data.length])
            }
        }
        console.log('数据重排', JSON.stringify(init_data), JSON.stringify(idx_data), JSON.stringify(new_data))
        return new_data
    }

    CalculateVirtualVerticalIntersection = (line_start_mat, line_end_mat, point_extended_mat, intersect_mat) => {
        /**
         * @description 计算虚垂直交点情况
         * @param line_start_mat 线起点：[img_x, img_y]
         * @param line_end_mat 线终点：[img_x, img_y]
         * @param point_extended_mat 延长点：[img_x, img_y]
         * @param intersect_mat 线交点：[img_x, img_y]
         * 
         */
        if (this.TwoPointDistance(line_start_mat, intersect_mat) <= this.TwoPointDistance(line_start_mat, line_end_mat)) {
            // 交点距离与实际触点距离比较，小于绘制交点 // 添加方向----
            let touch_vector = [line_end_mat[0] - line_start_mat[0], line_end_mat[1] - line_start_mat[1]]           // 触摸点向量
            let intersect_vector = [intersect_mat[0] - line_start_mat[0], intersect_mat[1] - line_start_mat[1]]    // 交点方向向量
            if ((touch_vector[0] * intersect_vector[0] + touch_vector[1] * intersect_vector[1]) > 0) {
                // 同方向 // 绘制延长线 // 处理计算交点外的延长线段:向量、长度、
                let part_end_point = this.CalculateExtendedLine(point_extended_mat, intersect_mat, 10)
                return part_end_point
            }
            return []
        }
        return []
    }

    CalculateExtendedLine = (point_start_mat, point_end_mat, extended_length) => {
        /**
         * @description 计算延长线
         * @param point_start_mat 起点坐标[img_x, img_y]
         * @param point_end_mat 终点坐标[img_x, img_y]
         * @param extended_length 延长长度
         * @return 返回延长线坐标组
         */
        let part_distance = this.TwoPointDistance(point_start_mat, point_end_mat)  // 长度
        let part_vector_x = (point_end_mat[0] - point_start_mat[0]) / part_distance    // 单位向量
        let part_vector_y = (point_end_mat[1] - point_start_mat[1]) / part_distance
        let part_end_point = [
            point_end_mat[0] + extended_length * part_vector_x,
            point_end_mat[1] + extended_length * part_vector_y,
        ]
        return part_end_point
    }

    CalculateNearestPoint = (fixed_point, point_a, point_b) => {
        /**
         * @description 计算近点---
         * @param fixed_point 固定点：[img_x,img_y]
         * @param point_a  计算比较点a：[img_x,img_y]
         * @param point_b  计算比较点b：[img_x,img_y]
         */
        if (this.TwoPointDistance(fixed_point, point_a) >= this.TwoPointDistance(fixed_point, point_b)) {
            return point_b
        }
        else {
            return point_a
        }
    }

    JudgePointInPolygon = (polygon_mat, test_point) => {
        /**
         * @description 判定点在多边形区域内：pnpoly---判定y区间内、再判定横向右侧交点x值与实际判定点x值的大小，相较于之前所写，只判定一个方向的奇偶性
         * @param polygon_mat   多边形点数组：[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2],...]
         * @param test_point    测试点：[img_x0,img_y0]
         */
        let judge_flag = 0
        for (let idx = 0; idx < polygon_mat.length; idx++) {
            let last_idx = (idx - 1 + polygon_mat.length) % polygon_mat.length
            // console.log('序号1', idx, last_idx)
            // console.log('序号2(polygon_mat[idx][1] > test_point[1]) != (polygon_mat[last_idx][1] > test_point[1])',
            //     (polygon_mat[idx][1] > test_point[1]) != (polygon_mat[last_idx][1] > test_point[1]),
            //     polygon_mat[idx][1], test_point[1], polygon_mat[last_idx][1], test_point[1])
            // console.log('序号3(test_point[0] - polygon_mat[idx][0]) < (polygon_mat[last_idx][0] - polygon_mat[idx][0]) * (test_point[1] - polygon_mat[idx][1])) / (polygon_mat[last_idx][1] - polygon_mat[idx][1])',
            //     test_point[0] - polygon_mat[idx][0],
            //     polygon_mat[last_idx][1] - polygon_mat[idx][1],
            //     polygon_mat[last_idx][0] - polygon_mat[idx][0],
            //     test_point[1] - polygon_mat[idx][1],
            //     (polygon_mat[last_idx][0] - polygon_mat[idx][0]) * (test_point[1] - polygon_mat[idx][1]) / (polygon_mat[last_idx][1] - polygon_mat[idx][1]))
            if ((polygon_mat[idx][1] > test_point[1]) != (polygon_mat[last_idx][1] > test_point[1]) &&
                (test_point[0] - polygon_mat[idx][0]) <
                (polygon_mat[last_idx][0] - polygon_mat[idx][0]) * (test_point[1] - polygon_mat[idx][1]) / (polygon_mat[last_idx][1] - polygon_mat[idx][1])) {
                // console.log('累计', judge_flag)// 
                judge_flag += 1
            }
        }
        console.log('点在多边形内判定---偶数为假---奇数为真', judge_flag, judge_flag % 2 == 0 ? false : true)
        // return judge_flag % 2 == 0 ? false : true
        return judge_flag % 2
    }

    JudgeTouchPolygonIdx = (touch_point, all_graph_mat) => {
        /**
         * @description 遍历判定图形选择索引---pnpoly
         * @param touch_point 触控点:[img_x,img_y]
         * @param all_graph_mat 所有待判定图形的图形坐标点[[[img1_x0,img1_y0],[img1_x1,img1_y1],...],[[img2_x0,img2_y0],[img2_x1,img2_y1],...],...]
         * @return 返回选择图形的索引--未选中返回-1
         */
        // console.log('all_graph_mat', all_graph_mat)
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            // 判定所有图形
            console.log('图形选择-------', all_graph_mat[idx])
            if (all_graph_mat[idx].length > 2) {  // 封闭图形
                // let [[up_mat, down_mat, left_mat, right_mat], judge_flag] = this.JudgePointInArea(touch_point, all_graph_mat[idx])
                let judge_flag = this.JudgePointInPolygon(all_graph_mat[idx], touch_point)
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
        return [-1]
    }

    CombineReorderData = (all_graph_data, move_graph_data, neighbor_side_mat) => {
        /**
         * @description 组合所有端点组数据---目前只处理一组
         * @param all_graph_data 所有图形坐标数据：[[[img0_x0,img0_y0],[img0_x1,img0_y1],...],[[img1_x0,img1_y0],[img1_x1,img1_y1],...]]
         * @param move_graph_data 移动图形组数据:[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param neighbor_side_mat：邻近边组数据：[[1,[[[1,2],[3,2]],[[1,2],[3,2]]]],]
         */
        let single_combine_data = []
        for (let idx = 0; idx < neighbor_side_mat.length; idx++) {
            // 获取组合端点数据
            let part_graph = neighbor_side_mat[idx]     // 与单幅图像的组合情况
            // console.log('part_graph', JSON.stringify(part_graph))
            let part_graph_data = _.cloneDeep(all_graph_data[part_graph[0]]) // 匹配图像数据
            // let move_graph_data = _.cloneDeep(move_graph_data)      // 移动临时数据
            let combine_mat = []  // 组合图像坐标
            if (part_graph[1].length === 1) {
                for (let side_idx = 0; side_idx < part_graph[1].length; side_idx++) {
                    // 单边组合
                    let match_idx_mat = part_graph[1][side_idx]
                    // 移动组按照顺序索引---match组顺序可能正向反向
                    for (let m_idx = 0; m_idx < move_graph_data.length; m_idx++) {
                        if (m_idx === match_idx_mat[0][0]) {
                            // 进入match索引坐标点
                            combine_mat.push(move_graph_data[m_idx])
                            // 重新建立索引坐标点数据
                            let reorder_data = this.DataReordering(part_graph_data, match_idx_mat[1])
                            for (let o_idx = 0; o_idx < reorder_data.length; o_idx++) {
                                combine_mat.push(reorder_data[o_idx])
                            }
                        }
                        else {
                            // 添加移动组
                            combine_mat.push(move_graph_data[m_idx])
                        }
                    }
                }
            }
            single_combine_data = _.cloneDeep(combine_mat)
        }
        return single_combine_data
    }

    FindParallelLines = (all_graph_data, draw_line_mat) => {
        /**
         * @description 寻找平行线组
         * @param all_graph_data 所有图形坐标点数据:[[[],[],...],[[],[],...],...]
         * @param draw_line_mat 绘制比较线数据:[[img_x0,img_y0],[img_x1,img_y1]]
         * @return 返回对应平行线条索引、数据、延长线
         */
        for (let idx = 0; idx < all_graph_data.length; idx++) {
            if (all_graph_data[idx].length > 1) {
                for (let p_idx = 0; p_idx < all_graph_data[idx].length; p_idx++) {
                    // 逐点计算
                    let parallel_line = [all_graph_data[idx][p_idx], all_graph_data[idx][(p_idx + 1) % all_graph_data[idx].length]]
                    if (this.JudgeParallelLine(parallel_line, draw_line_mat)) {
                        // 满足最小角度平行线
                        return parallel_line
                    }
                }
            }
        }
        return []
    }

    JudgeParallelLine = (line_a_mat, line_b_mat) => {
        /**
         * @description 判定两条直线平行
         * @param line_a_mat 线条a：[[img_x0,img_y0],[img_x1,img_y1]]
         * @param line_b_mat 线条b: [[img_x0,img_y0],[img_x1,img_y1]]
         * @return 返回平行判定标志
         */
        console.log('直线组', JSON.stringify([line_a_mat, line_b_mat]))
        let vector_a = [line_a_mat[1][0] - line_a_mat[0][0], line_a_mat[1][1] - line_a_mat[0][1]]
        let vector_b = [line_b_mat[1][0] - line_b_mat[0][0], line_b_mat[1][1] - line_b_mat[0][1]]
        let angle_value = this.VectorialAngle(vector_a, vector_b)
        console.log('夹角angle_value', angle_value)
        let min_threshold = 1
        if (Math.abs(180 - angle_value) < min_threshold || Math.abs(0 - angle_value) < min_threshold) {
            // 小于 平行最小角度阈值
            return true
        }
        else {
            return false
        }
    }

    JudgePerpendicularLine = (line_a_mat, line_b_mat) => {
        /**
         * @description 判定垂直线
         * @param line_a_mat 线条a：[[img_x0,img_y0],[img_x1,img_y1]]
         * @param line_b_mat 线条b: [[img_x0,img_y0],[img_x1,img_y1]]
         * @return 返回垂直判定标志
         */
        let vector_a = [line_a_mat[1][0] - line_a_mat[0][0], line_a_mat[1][1] - line_a_mat[0][1]]
        let vector_b = [line_b_mat[1][0] - line_b_mat[0][0], line_b_mat[1][1] - line_b_mat[0][1]]
        let angle_value = this.VectorialAngle(vector_a, vector_b)
        console.log('夹角angle_value', angle_value)
        let min_threshold = 1
        if (Math.abs(90 - Math.abs(angle_value)) < min_threshold) {
            // 小于 平行最小角度阈值 ---正负90°
            return true
        }
        else {
            return false
        }
    }

    VectorialAngle = (vector_a, vector_b) => {
        /**
         * @description 向量夹角
         * @param vector_a 向量a:[vec_x,vec_y]
         * @param vector_b 向量b:[vec_x,vec_y]
         * @return 返回向量夹角
         */
        let ab_dot = vector_a[0] * vector_b[0] + vector_a[1] * vector_b[1];   // 点积
        let ab_length = Math.sqrt(vector_a[0] * vector_a[0] + vector_a[1] * vector_a[1]) * Math.sqrt(vector_b[0] * vector_b[0] + vector_b[1] * vector_b[1]);// ab 模长乘积
        let cos_theta = ab_dot / ab_length;
        let cos_angle = Math.acos(cos_theta) / Math.PI * 180;
        // console.log('向量夹角', cos_angle)
        return Math.round(cos_angle * 100) / 100;
    }

    CalculateTwoExtendedLine = (point_start_mat, point_end_mat, extended_length) => {
        /**
         * @description 计算两端延长线
         * @param point_start_mat 起点坐标[img_x, img_y]
         * @param point_end_mat 终点坐标[img_x, img_y]
         * @param extended_length 延长长度
         * @return 返回两端延长线坐标组
         */
        let part_distance = this.TwoPointDistance(point_start_mat, point_end_mat)  // 长度
        let part_vector_x = (point_end_mat[0] - point_start_mat[0]) / part_distance    // 单位向量
        let part_vector_y = (point_end_mat[1] - point_start_mat[1]) / part_distance
        let part_start_point = [
            point_start_mat[0] - extended_length * part_vector_x,
            point_start_mat[1] - extended_length * part_vector_y,
        ]
        let part_end_point = [
            point_end_mat[0] + extended_length * part_vector_x,
            point_end_mat[1] + extended_length * part_vector_y,
        ]
        return [part_start_point, part_end_point]
    }

    MoveGraphFixedPoint = (graph_data, move_idx, fixed_point) => {
        /**
         * @description 将图形的一点移动至固定点---同时更新整体图形数据
         * @param graph_data 图形数据:[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param move_idx 移动点索引:
         * @param fixed_point 移动至固定点:[img_x,img_y]
         * @return 返回新图形数据
         */
        let move_x = fixed_point[0] - graph_data[move_idx][0]
        let move_y = fixed_point[1] - graph_data[move_idx][1]
        return this.DataMove2D(graph_data, [move_x, move_y])
    }

    MoveAllGraphData = (all_graph_data, move_data) => {
        /**
         * @description 移动所有图形数据点数据
         * @param all_graph_data 所有图形数据
         * @param move_data 移动相对坐标值：[move_x,move_y]
         * @return 更新返回所有坐标点
         */
        let new_all_graph_data = []
        for (let idx = 0; idx < all_graph_data.length; idx++) {
            new_all_graph_data.push(this.DataMove2D(all_graph_data[idx], move_data))
        }
        return new_all_graph_data
    }

    ShearLineChoiceIdx = (all_graph_mat, shear_line) => {
        /**
         * @description 剪切线选择索引---1、全为线条组；2、图形组
         * @param all_graph_mat 所有图形数据组[[[x0,y0],[],...],...]
         * @param shear_line 选择切割线条
         * @return 返回线条组索引及线条端点坐标
         */
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            for (let p_idx = 0; p_idx < all_graph_mat[idx].length; p_idx++) {
                // 单条直线比较
                let graph_line_mat = [all_graph_mat[idx][p_idx], all_graph_mat[idx][(p_idx + 1) % all_graph_mat[idx].length]]
                let intersect_mat = newgraphcls.JudgeLineIntersectionLoc(shear_line, graph_line_mat)
                if (intersect_mat.length === 3) {
                    // 实交点
                    return [idx, p_idx, graph_line_mat, [intersect_mat[1], intersect_mat[2]]]
                }
            }
        }
        return [-1, -1]
    }

    getLineGraphIntersection = (all_graph_mat, shear_idx, graph_line) => {
        /**
         * @description 获取单挑线和其他图形的线条的所有交点
         * @param all_graph_mat 所有图形数据点[[[x0,y0],[x1,y1],...],...]
         * @param shear_idx 图形选择索引
         * @param graph_line 图形线坐标[[x0,y0],[x1,y1]]
         * @return 返回所有交点坐标数据，包含端点---排序 
         */
        let all_intersect_mat = []
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            if (idx !== shear_idx) {
                for (let p_idx = 0; p_idx < (all_graph_mat[idx].length > 2 ? all_graph_mat[idx].length : all_graph_mat[idx].length - 1); p_idx++) {
                    // 单条直线比较
                    let graph_line_mat = [all_graph_mat[idx][p_idx], all_graph_mat[idx][(p_idx + 1) % all_graph_mat[idx].length]]
                    let intersect_mat = newgraphcls.JudgeLineIntersectionLoc(graph_line, graph_line_mat)
                    if (intersect_mat.length === 3) {
                        // 实交点
                        // return [idx, p_idx, graph_line_mat]
                        all_intersect_mat.push([intersect_mat[1], intersect_mat[2]])
                    }
                }
            }
        }
        // console.log('所有交点', JSON.stringify(all_intersect_mat))
        // 排序
        let distance_mat = this.getPointToAllPointDistance(all_intersect_mat, graph_line[0])
        // console.log('端点与交点的距离', JSON.stringify(distance_mat))
        let [distance_sort, idx_sort] = this.ArraySortMat(distance_mat)
        // console.log('端点与交点的距离排序', JSON.stringify(distance_sort))
        // console.log('端点与交点的距离排序索引', JSON.stringify(idx_sort))
        let new_intersect_mat = []
        new_intersect_mat.push(graph_line[0])
        for (let idx = 0; idx < idx_sort.length; idx++) {
            new_intersect_mat.push(all_intersect_mat[idx_sort[idx]])
        }
        new_intersect_mat.push(graph_line[1])
        return new_intersect_mat
    }

    getPointToAllPointDistance = (all_points_mat, point_mat) => {
        /**
         * @description 获取点与所有点距离
         * @param all_points_mat 所有点坐标数据：[[x0,y0],[x1,y1],...]
         * @param point_mat 计算点
         * @return 返回所有距离
         */
        let distance_mat = []
        for (let idx = 0; idx < all_points_mat.length; idx++) {
            distance_mat.push(this.TwoPointDistance(all_points_mat[idx], point_mat))
        }
        return distance_mat
    }

    getShearLine = (all_intersect_mat, shear_point) => {
        /**
         * @description 获取剪切线段
         * @param all_intersect_mat 选择线段交点数据
         * @param shear_point 剪切点
         * @return 返回剪切数据
         */
        // let distance_mat = this.getPointToAllPointDistance(all_intersect_mat, shear_point)
        // let [distance_sort, idx_sort] = this.ArraySortMat(distance_mat)
        // // 返回最近两点索引及数据
        // let idx_mat = [idx_sort[0], idx_sort[1]]
        // let point_mat = [all_intersect_mat[idx_sort[0]], all_intersect_mat[idx_sort[1]]]
        for (let idx = 0; idx < all_intersect_mat.length - 1; idx++) {
            // 方向判定
            let vector_a = [all_intersect_mat[idx][0] - shear_point[0], all_intersect_mat[idx][1] - shear_point[1]]
            let vector_b = [all_intersect_mat[idx + 1][0] - shear_point[0], all_intersect_mat[idx + 1][1] - shear_point[1]]
            console.log('方向计算', JSON.stringify(vector_a), JSON.stringify(vector_b), Math.abs(this.VectorialAngleDirector(vector_a, vector_b)))
            if (Math.abs(this.VectorialAngleDirector(vector_a, vector_b)) > 170) {
                // 获取计算剩余直线数据
                if (idx === 0) {
                    // 去头
                    return [
                        [idx, idx + 1],
                        [all_intersect_mat[idx], all_intersect_mat[idx + 1]],
                        [[all_intersect_mat[idx + 1], all_intersect_mat[all_intersect_mat.length - 1]]]
                    ]
                }
                else if (idx === all_intersect_mat.length - 2) {
                    // 去尾
                    return [
                        [idx, idx + 1],
                        [all_intersect_mat[idx], all_intersect_mat[idx + 1]],
                        [[all_intersect_mat[0], all_intersect_mat[all_intersect_mat.length - 2]]]
                    ]
                }
                else {
                    // 去中间
                    return [
                        [idx, idx + 1],
                        [all_intersect_mat[idx], all_intersect_mat[idx + 1]],
                        [[all_intersect_mat[0], all_intersect_mat[idx]], [all_intersect_mat[idx + 1], all_intersect_mat[all_intersect_mat.length - 1]]]
                    ]
                }

            }
        }
        return [[], [-100, -100], [[all_intersect_mat[0], all_intersect_mat[all_intersect_mat.length - 1]]]]
    }

    getLineAndLineIntersection = (line_a, line_b) => {
        /**
         * @description 获取线与线的交点
         */
        let intersection_mat = newgraphcls.JudgeLineIntersectionLoc(line_a, line_b)
        if (intersection_mat.length === 3) {
            return [intersection_mat[1], intersection_mat[2]]
        }
        return []
    }

    getLineTextLoc = (start_point, end_point, font_size, text_str, display_mode) => {
        /**
         * @description 计算线条文本放置点：中心、横向、间隔
         * @param start_point 起点：[img_x,img_y]
         * @param end_point 终点：[img_x,img_y]
         * @param font_size 字体大小
         * @param text_str 字符串
         * @param display_mode 展示在线条的上方或下方：up/down
         * @return 返回展示坐标点
         */
        if (start_point.join(',') !== end_point.join(',')) {
            // 两点不等
            let [center_x, center_y] = [(start_point[0] + end_point[0]) / 2, (start_point[1] + end_point[1]) / 2]
            // 切换方向向量
            let mod_length = this.TwoPointDistance(start_point, end_point)
            let [vector_x, vector_y] = [end_point[0] - start_point[0], end_point[1] - start_point[1]]
            let [normal_x, normal_y] = [vector_x / mod_length, vector_y / mod_length]
            // 直线的法线向上向量
            if (display_mode === 'up') {
                let t_vector_x = -normal_y
                let t_vector_y = normal_x
                if (t_vector_y >= 0) {
                    // 切换方向
                    t_vector_x = -t_vector_x
                    t_vector_y = -t_vector_y
                }
                // console.log('t_vector_x,t_vector_y', t_vector_x, t_vector_y)
                let text_x = center_x + t_vector_x * (text_str.length * font_size * 0.05 + font_size)
                let text_y = center_y + t_vector_y * (font_size * 0.6)
                return [text_x, text_y]
            }
            else if (display_mode === 'left') {
                // 左侧
                let text_x = center_x + (-1) * (text_str.length * font_size * 0.5 * 0.7)
                let text_y = center_y + 1 * (font_size * 0.3)
                return [text_x, text_y]
            }
            else if (display_mode === 'right') {
                // 右侧
                let text_x = center_x + (1) * (text_str.length * font_size * 0.5 * 0.7)
                let text_y = center_y + 1 * (font_size * 0.3)
                return [text_x, text_y]
            }
            else {
                // down、默认
                let t_vector_x = -normal_y
                let t_vector_y = normal_x
                if (t_vector_y <= 0) {
                    // 切换方向
                    t_vector_x = -t_vector_x
                    t_vector_y = -t_vector_y
                }
                // console.log('t_vector_x,t_vector_y', t_vector_x, t_vector_y)
                let text_x = center_x + t_vector_x * (text_str.length * font_size * 0.1 + font_size)
                let text_y = center_y + t_vector_y * (font_size * 1.2)
                return [text_x, text_y]
            }
        }
        return start_point
    }

    getLineTextLoc2 = (start_point, end_point, font_size, text_str, display_mode) => {
        /**
         * @description 计算线条文本放置点：中心、横向、间隔
         * @param start_point 起点：[img_x,img_y]
         * @param end_point 终点：[img_x,img_y]
         * @param font_size 字体大小
         * @param text_str 字符串
         * @param display_mode 展示在线条的上方或下方：up/down
         * @return 返回展示坐标点
         */
        if (start_point.join(',') !== end_point.join(',')) {
            // 两点不等
            let [center_x, center_y] = [(start_point[0] + end_point[0]) / 2, (start_point[1] + end_point[1]) / 2]
            if (Math.abs(start_point[1] - end_point[1]) < 2) {
                // 横线
                if (display_mode === 'up') {
                    let text_x = center_x - font_size * 0.1 * text_str.length
                    let text_y = center_y - font_size * 0.5
                    return [text_x, text_y]
                }
                else {
                    // down、默认
                    let text_x = center_x - font_size * 0.1 * text_str.length
                    let text_y = center_y + font_size * 1.5
                    return [text_x, text_y]
                }
            }
            else if (Math.abs(start_point[0] - end_point[0]) < 2) {
                // 纵向
                if (display_mode === 'up') {
                    // 对应右
                    console.log()
                    let text_x = center_x + font_size * 1.2
                    let text_y = center_y + font_size * 0.3
                    return [text_x, text_y]
                }
                else {
                    // down、默认对应左
                    let text_x = center_x - font_size * 0.2 * text_str.length
                    let text_y = center_y + font_size * 0.3
                    return [text_x, text_y]
                }
            }
            else {
                if (display_mode === 'up') {
                    // 对应右
                    if ((end_point[1] - start_point[1]) / (end_point[0] - start_point[0]) > 0) {
                        let text_x = center_x + font_size * 0.5
                        let text_y = center_y - font_size * 0.5
                        return [text_x, text_y]
                    }
                    else {
                        let text_x = center_x - font_size * 0.6 * text_str.length
                        let text_y = center_y - font_size * 0.5
                        return [text_x, text_y]
                    }
                }
                else {
                    // down、默认对应左
                    if ((end_point[1] - start_point[1]) / (end_point[0] - start_point[0]) < 0) {
                        let text_x = center_x + font_size * 0.5
                        let text_y = center_y + font_size * 1
                        return [text_x, text_y]
                    }
                    else {
                        let text_x = center_x - font_size * 0.6 * text_str.length
                        let text_y = center_y + font_size * 1
                        return [text_x, text_y]
                    }
                }
            }
        }
        return start_point
    }

    NumAdditionZeros = (num_str, zero_num) => {
        /**
         * @description 数字末尾补齐0
         * @param num_str 数字、数字字符串
         * @param zero_num 加零个数
         * @return 返回修改字符串
         */
        if (isNaN(Number(num_str))) {
            return num_str
        }
        else {
            // 是否为有效数字
            let init_str = (num_str).toString()
            // console.log('init_str', init_str)
            if (init_str.indexOf('.') < 0) {
                // 无小数点
                init_str += '.'
                for (let idx = 0; idx < zero_num; idx++) {
                    init_str += '0'
                }
                return init_str
            }
            else {
                let decimal_digit = init_str.length - (init_str.indexOf('.') + 1)
                if (decimal_digit < zero_num) {// 位数不够
                    for (let idx = 0; idx < (zero_num - decimal_digit); idx++) {
                        init_str += '0'
                    }
                    return init_str
                }
                else {
                    return init_str
                }
            }
        }
    }

    getGridAdsorptionIdx = (gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy) => {
        /**
         * @description 计算吸附网格点
         * @param gridding_x_mat 网格横向坐标划分：[x0,x1,x2,...]
         * @param gridding_y_mat 网格横向坐标划分：[y0,y1,y2,...]
         * @param point_mat 判定点[img_x,img_y]
         * @param gridding_accuracy 网格吸附半径格子数：1为1格宽度、0.5为半格宽度
         * @return 返回坐标
         */
        let per_pixels = gridding_x_mat[1] - gridding_x_mat[0]    // 单格长度
        let absorb_flag = -1
        let [absorb_x, absorb_y] = [0, 0]
        for (let idx = 0; idx < gridding_x_mat.length; idx++) {
            if (Math.abs(point_mat[0] - gridding_x_mat[idx]) <= gridding_accuracy * per_pixels) {
                absorb_x = gridding_x_mat[idx]
                absorb_flag += 1
                break
            }
        }
        for (let idx = 0; idx < gridding_y_mat.length; idx++) {
            if (Math.abs(point_mat[1] - gridding_y_mat[idx]) <= gridding_accuracy * per_pixels) {
                absorb_y = gridding_y_mat[idx]
                absorb_flag += 1
                break
            }
        }
        if (absorb_flag === 1) {
            return [absorb_x, absorb_y, absorb_flag]
        }
        else {
            return [point_mat[0], point_mat[1], absorb_flag]
        }

    }

    getPointAdsorptionPoint = (all_graph_data, point_mat, absorb_pixels) => {
        /**
         * @description 查找最近吸附点
         * @param all_graph_data 所有线条数组：[[[img0_x0,img0_y0],[img0_x1,img0_y1],...],[[img1_x0,img1_y0],[img1_x1,img1_y1]],...]
         * @param point_mat 判定点数据：[img_x0,img_y0]
         * @param absorb_pixels 吸附点半径
         * @return 返回接近的线条索引、移动线条的端点索引、吸附点
         */
        for (let idx = 0; idx < all_graph_data.length; idx++) {
            // 遍历所有线条端点
            for (let p_idx = 0; p_idx < all_graph_data[idx].length; p_idx++) {
                if (this.TwoPointDistance(all_graph_data[idx][p_idx], point_mat) <= absorb_pixels) {
                    return [idx, p_idx, all_graph_data[idx][p_idx]]
                }
            }
        }
        return [-1, -1, point_mat]
    }

    JudgeContinuityPoint = (squential_mat, gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy) => {
        /**
         * @description 连续点判定---添加---消除--
         * @param squential_mat 原始连续坐标点:[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param gridding_x_mat 网格x坐标:[img_x0,img_x1,...]
         * @param gridding_y_mat 网格y坐标:[img_y0,img_y1,...]
         * @param point_mat 判定点[img_x,img_y]
         * @param gridding_accuracy 判定精度:0~0.5
         * @return 返回新的连续坐标点数组
         */
        console.log('squential_mat, gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy\n',
            JSON.stringify([squential_mat, gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy]))
        let [new_x, new_y, absorb_flag] = this.getGridAdsorptionIdx(gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy)
        console.log('new_x, new_y, absorb_flag', new_x, new_y, absorb_flag, JSON.stringify(point_mat))
        if (absorb_flag === 1) {
            // 存在吸附
            if (squential_mat.length > 1 &&
                new_x === squential_mat[squential_mat.length - 2][0] &&
                new_y === squential_mat[squential_mat.length - 2][1]) {
                console.log('-----',)
                squential_mat.pop()
            }
            else if (new_x !== squential_mat[squential_mat.length - 1][0] ||
                new_y !== squential_mat[squential_mat.length - 1][1]) {
                squential_mat.push([new_x, new_y])
            }
        }
        console.log('squential_mat', squential_mat.length)
        return squential_mat
    }


    JudgeGraphType = (graph_data) => {
        /**
         * @description 判定数据图形类型：三角形、四边形、多变形、不包含圆---数据点的位置顺序判定
         * @param graph_data 图形数据 [[img_x0,img_y0],[img_x1,img_y1],...]
         */
        if (graph_data.length === 3) {
            // 三角形判定
            if (this.JudgeGraphDataHeavy(graph_data)[0]) {
                if (this.JudgeTriangleReasonable(graph_data)) {

                    return "三角形"
                }
                else {
                    return "共线"
                }
            }
            // 无效数据点
            return false
        }
        else if (graph_data.length === 4) {
            // 四边形判定
            return "四边形"
        }
        else if (graph_data.length >= 5) {
            // 多边形
            return "多边形"
        }
        else if (graph_data.length === 2) {
            // 线条
            return "线段"
        }
        else {
            // 点
            return "点"
        }
    }

    // getGridAdsorptionIdx = (gridding_x_mat, gridding_y_mat, point_mat, gridding_accuracy) => {
    //     /**
    //      * @description 计算吸附网格点
    //      * @param gridding_x_mat 网格横向坐标划分：[x0,x1,x2,...]
    //      * @param gridding_y_mat 网格横向坐标划分：[y0,y1,y2,...]
    //      * @param point_mat 判定点[img_x,img_y]
    //      * @param gridding_accuracy 网格吸附半径格子数：1为1格宽度、0.5为半格宽度
    //      * @return 返回坐标
    //      */
    //     let new_point_mat = _.cloneDeep(point_mat)
    //     let per_pixels = gridding_x_mat[1] - gridding_x_mat[0]    // 单格长度
    //     for (let idx = 0; idx < gridding_x_mat.length; idx++) {
    //         if (Math.abs(point_mat[0] - gridding_x_mat[idx]) <= gridding_accuracy * per_pixels) {
    //             new_point_mat[0] = gridding_x_mat[idx]
    //         }
    //     }
    //     for (let idx = 0; idx < gridding_y_mat.length; idx++) {
    //         if (Math.abs(point_mat[1] - gridding_y_mat[idx]) <= gridding_accuracy * per_pixels) {
    //             new_point_mat[1] = gridding_y_mat[idx]
    //         }
    //     }
    //     return new_point_mat
    // }

    JudgeGraphDataHeavy = (graph_data) => {
        /**
         * @description 判定图形数组是否存在相同数据
         * @param graph_data 图形数据
         * @return 返回判定布尔值、重复数据
         */
        let heavy_data = []
        for (let idx = 0; idx < graph_data.length - 1; idx++) {
            for (let p_idx = idx + 1; p_idx < graph_data.length; p_idx++) {
                if (graph_data[idx][0] === graph_data[p_idx][0] && graph_data[idx][1] === graph_data[p_idx][1]) {
                    heavy_data.push([idx, p_idx])
                }
            }
        }
        if (heavy_data.length < 1) {
            return [true, heavy_data]
        }
        else {
            return [false, heavy_data]
        }
    }

    LineABC = (point_a, point_b) => {
        /**
         * @description 求解两点之间斜率
         * @param point_a 点a：[img_x,img_y]
         * @param point_b 点b：[img_x,img_y]
         * @return 返回直线参数ABC矩阵
         */
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

    JudgeTriangleReasonable = (graph_data) => {
        /**
         * @description 判定三角形的合理性：无共同点、不在一条直线上
         */
        if (graph_data.length !== 3) {
            // 不是三点组
            return false;
        }
        else {
            let line_abc_1 = this.LineABC(graph_data[0], graph_data[1])
            let line_abc_2 = this.LineABC(graph_data[1], graph_data[2])
            if (line_abc_1 === false || line_abc_2 === false) {
                // 存在同点坐标
                return false;
            }
            else if (Math.abs(line_abc_1[0] - line_abc_2[0]) > 0.001) {
                // 任意两条直线的斜率之差大于阈值、不判定同线
                return true
            }
            else {
                return false
            }
        }
    }

    MatchingGraphType = (all_point_data, match_type = 'none') => {
        /**
         * @description 匹配图形类型
         * @param all_point_data 图形点数据：[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2],....]
         * @param match_type 匹配类型：直接根据类型判定或者自判定none
         * @return 返回图形类型和正误
         */
        if (match_type === 'none') {
            // 根据数据点遍历判定
            let graph_type = '三角形'
            return [graph_type, 1]
        }
        else if (match_type === 'parallelogram' || match_type === '平行四边形') {
            // 平行四边形判定
            if (all_point_data.length !== 4) {
                return ['数据点数有误', 0]
            }
            else {
                let parallel_flag = 0   // 平行组对
                for (let idx = 0; idx < 2; idx++) {
                    // 判定对边是否平行
                    if (this.JudgeParallelLine([all_point_data[idx], all_point_data[idx + 1]], [all_point_data[idx + 2], all_point_data[(idx + 1 + 2) % 4]])) {
                        parallel_flag += 1
                    }
                }
                if (parallel_flag != 2) {
                    return ['对边不平行', 0]
                }
                // 直角关系
                if (this.JudgePerpendicularLine([all_point_data[0], all_point_data[1]], [all_point_data[1], all_point_data[2]])) {
                    return ['长方形', 1]
                }
                else {
                    return ['平行四边形', 1]
                }
            }

        }
        else if (match_type === 'rectangle' || match_type === '长方形' || match_type === '矩形') {
            // 长方形判定
            if (all_point_data.length !== 4) {
                return ['数据点数有误', 0]
            }
            else {
                let parallel_flag = 0   // 平行组对
                for (let idx = 0; idx < 2; idx++) {
                    // 判定对边是否平行
                    if (this.JudgeParallelLine([all_point_data[idx], all_point_data[idx + 1]], [all_point_data[idx + 2], all_point_data[(idx + 1 + 2) % 4]])) {
                        parallel_flag += 1
                    }
                }
                if (parallel_flag != 2) {
                    return ['对边不平行', 0]
                }
                // 直角关系
                if (this.JudgePerpendicularLine([all_point_data[0], all_point_data[1]], [all_point_data[1], all_point_data[2]])) {
                    return ['长方形', 1]
                }
                else {
                    return ['平行四边形', 0]
                }
            }

        }
        else if (match_type === 'rhombus' || match_type === '菱形') {
            // 平行四边形判定
            if (all_point_data.length !== 4) {
                return ['数据点数有误', 0]
            }
            else {
                let parallel_flag = 0   // 平行组对
                for (let idx = 0; idx < 2; idx++) {
                    // 判定对边是否平行
                    if (this.JudgeParallelLine([all_point_data[idx], all_point_data[idx + 1]], [all_point_data[idx + 2], all_point_data[(idx + 1 + 2) % 4]])) {
                        parallel_flag += 1
                    }
                }
                if (parallel_flag != 2) {
                    return ['对边不平行', 0]
                }
                // 直角关系
                if (this.JudgePerpendicularLine([all_point_data[0], all_point_data[1]], [all_point_data[1], all_point_data[2]])) {
                    if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                        return ['正方形', 1]
                    }
                    else {
                        return ['长方形', 0]
                    }

                }
                else {
                    if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                        return ['菱形', 1]
                    }
                    else {
                        return ['平行四边形', 0]
                    }
                }
            }

        }
        else if (match_type === 'square' || match_type === '正方形') {
            // 平行四边形判定
            if (all_point_data.length !== 4) {
                return ['数据点数有误', 0]
            }
            else {
                let parallel_flag = 0   // 平行组对
                for (let idx = 0; idx < 2; idx++) {
                    // 判定对边是否平行
                    if (this.JudgeParallelLine([all_point_data[idx], all_point_data[idx + 1]], [all_point_data[idx + 2], all_point_data[(idx + 1 + 2) % 4]])) {
                        parallel_flag += 1
                    }
                }
                if (parallel_flag != 2) {
                    return ['对边不平行', 0]
                }
                // 直角关系
                if (this.JudgePerpendicularLine([all_point_data[0], all_point_data[1]], [all_point_data[1], all_point_data[2]])) {
                    if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                        return ['正方形', 1]
                    }
                    else {
                        return ['长方形', 0]
                    }

                }
                else {
                    if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                        return ['菱形', 0]
                    }
                    else {
                        return ['平行四边形', 0]
                    }
                }
            }

        }
        else if (match_type === 'trapezoid' || match_type === '梯形') {
            // 平行四边形判定
            if (all_point_data.length !== 4) {
                return ['数据点数有误', 0]
            }
            else {
                let parallel_flag = 0   // 平行组对
                let parallel_idx_mat = []
                for (let idx = 0; idx < 2; idx++) {
                    // 判定对边是否平行
                    if (this.JudgeParallelLine([all_point_data[idx], all_point_data[idx + 1]], [all_point_data[idx + 2], all_point_data[(idx + 1 + 2) % 4]])) {
                        parallel_flag += 1
                        parallel_idx_mat.push(idx)
                    }
                }
                if (parallel_flag == 2) {
                    // 直角关系
                    if (this.JudgePerpendicularLine([all_point_data[0], all_point_data[1]], [all_point_data[1], all_point_data[2]])) {
                        if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                            return ['正方形', 0]
                        }
                        else {
                            return ['长方形', 0]
                        }

                    }
                    else {
                        if (Math.abs(this.TwoPointDistance(all_point_data[0], all_point_data[1]) - this.TwoPointDistance(all_point_data[1], all_point_data[2])) < 0.01) {
                            return ['菱形', 0]
                        }
                        else {
                            return ['平行四边形', 0]
                        }
                    }
                }
                else if (parallel_flag == 0) {
                    // 需要判定点的顺序
                    return ['一般四边形', 0]
                }
                else if (parallel_flag === 1) {
                    // 梯形判定:
                    if (Math.abs(this.TwoPointDistance(all_point_data[(parallel_idx_mat[0] + 1) % 4], all_point_data[(parallel_idx_mat[0] + 2) % 4]) -
                        this.TwoPointDistance(all_point_data[(parallel_idx_mat[0] + 3) % 4], all_point_data[(parallel_idx_mat[0] + 4) % 4])) < 0.01) {
                        return ['等腰梯形', 1]
                    }
                    else if (this.JudgePerpendicularLine([all_point_data[(parallel_idx_mat[0] + 0) % 4], all_point_data[(parallel_idx_mat[0] + 1) % 4]],
                        [all_point_data[(parallel_idx_mat[0] + 1) % 4], all_point_data[(parallel_idx_mat[0] + 2) % 4]]) ||
                        this.JudgePerpendicularLine([all_point_data[(parallel_idx_mat[0] + 1) % 4], all_point_data[(parallel_idx_mat[0] + 2) % 4]],
                            [all_point_data[(parallel_idx_mat[0] + 2) % 4], all_point_data[(parallel_idx_mat[0] + 3) % 4]])) {
                        return ['直角梯形', 1]
                    }
                    else {
                        return ['一般梯形', 1]
                    }
                }

            }

        }
        else {
            return ['none', -1] // -1无判定
        }
    }

    getSingleLineLocText = (point_a, point_b, decimal_num = 1, display_mode = 'up') => {
        /**
         * @description 获取单条直线的位置文本
         * @param point_a 点a的坐标：[img_x,img_y]
         * @param point_b 点b的坐标: [img_x,img_y]
         * @param decimal_num 有效位数
         * @return 返回文本坐标点及文本
         */
        let point_distance = this.getLineCoordinateLength(point_a, point_b, decimal_num)  // 坐标系长度
        // console.log()
        point_distance = this.NumAdditionZeros(point_distance, decimal_num)  // 修正0位
        // console.log('point_distance', point_distance)
        let text_point = this.getLineTextLoc(point_a, point_b, 20, point_distance.toString(), display_mode) // 文本坐标点
        return [text_point, point_distance.toString()]
    }

    getLineCoordinateLength = (start_point, end_point, decimal_num = 0) => {
        /**
         * @description 获取直线坐标系长度
         * @param start_point 起点:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param end_point 终点:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param decimal_num 保留有效位数
         * @return 返回坐标系长度值
         */
        let img_length = Math.sqrt((start_point[0] - end_point[0]) * (start_point[0] - end_point[0]) + (start_point[1] - end_point[1]) * (start_point[1] - end_point[1]))
        let coordinate_length = Math.round(img_length / this.per_pixels * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
        // console.log('start_point, end_point',start_point, end_point, img_length,this.per_pixels, coordinate_length)
        return coordinate_length
    }

    getSingleGraphLocText = (single_graph_mat) => {
        /**
         * @description 获取单幅图形的坐标系长度文本及坐标
         * @param single_graph_mat 单幅图像坐标：[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2]]
         */
        let [center_x, center_y] = newgraphcls.GetPolygonAeraCenter(single_graph_mat)   // 图形几何中心
        let graph_loc_text_mat = []
        for (let idx = 0; idx < single_graph_mat.length; idx++) {
            // 单组线条
            let point_a = single_graph_mat[idx]
            let point_b = single_graph_mat[(idx + 1) % single_graph_mat.length]
            let line_abc = this.LineABC(point_a, point_b)
            let display_mode = point_a[1] < center_y || point_b[1] < center_y ? 'up' : 'down'   // 初略设定---后期详细设定
            // 细化展示方位
            if (line_abc[0] === 0 || Math.abs(line_abc[0] < 0.0001)) {
                // 横线---精度问题
                display_mode = point_a[1] < center_y || point_b[1] < center_y ? 'up' : 'down'
            }
            else if (line_abc[1] === 0 || Math.abs(line_abc[1] < 0.0001)) {
                // 竖线---精度问题
                display_mode = point_a[0] < center_x ? 'left' : 'right'
            }
            else {
                // 斜线
                // console.log('line_abc', line_abc)
                if (line_abc[0] > 0) {
                    if ((point_a[0] + point_b[0]) / 2 < center_x) {
                        display_mode = 'up'
                    }
                    else {
                        display_mode = 'down'
                    }
                }
                else {
                    if ((point_a[0] + point_b[0]) / 2 > center_x) {
                        display_mode = 'up'
                    }
                    else {
                        display_mode = 'down'
                    }
                }
            }
            let [point_loc, distance_str] = this.getSingleLineLocText(point_a, point_b, 1, display_mode)
            // console.log('point_a, point_b,point_loc===', point_a, point_b, point_loc)
            graph_loc_text_mat.push([point_loc, distance_str])
        }
        return graph_loc_text_mat
    }

    getAllGraphLocText = (all_graph_mat) => {
        /**
         * @description 获取多幅图形的坐标系长度文本及坐标
         * @param all_graph_mat 单幅图像坐标：[[img_x0,img_y0],[img_x1,img_y1],[img_x2,img_y2]]
         * @return 返回所有图像的线条文本坐标及长度
         */
        let all_loc_text_mat = []
        for (let idx = 0; idx < all_graph_mat.length; idx++) {
            // 单幅图像
            let part_loc_text_mat = this.getSingleGraphLocText(all_graph_mat[idx])
            all_loc_text_mat.push(part_loc_text_mat)
        }
        return all_loc_text_mat
    }
    TwoLineVectorMove = (line_a_mat, line_b_mat, move_data) => {
        /**
         * @description 两条线移动
         * @param line_a_mat 线条a移动:[start_point,end_point]
         * @param line_b_mat 线条a移动:[start_point,end_point]
         * @param move_data 相对移动向量[move_x,move_y]
         */

        // let new_line_a = this.getFixedVectorMove(line_a_mat[0], line_a_mat[1], move_data)
        // let new_line_b = this.getFixedVectorMove(line_b_mat[0], line_b_mat[1], move_data)
        // return [new_line_a, new_line_b]
        // 更改解算方法,移动线条，和两边延长线求交点
        let move_line = [line_a_mat[1], line_b_mat[1]]
        let new_move_line = this.DataMove2D(move_line, move_data)
        console.log('移动前后数组', JSON.stringify(move_line), JSON.stringify(move_data), JSON.stringify(new_move_line))
        // 求解交点
        let intersect_mat_a = this.getTwoLineIntersection(line_a_mat, new_move_line)
        let intersect_mat_b = this.getTwoLineIntersection(line_b_mat, new_move_line)
        console.log('新交点', JSON.stringify(intersect_mat_a), JSON.stringify(intersect_mat_b))
        return [[line_a_mat[0], intersect_mat_a], [line_b_mat[0], intersect_mat_b]]
    }

    getTwoLineIntersection = (line_data_a, line_data_b) => {
        /**
         * @description 获取两条直线交点
         * 
         */
        let line_a = this.LineABC(line_data_a[0], line_data_a[1])
        let line_b = this.LineABC(line_data_b[0], line_data_b[1])
        let intersection_mat = newgraphcls.double_line_intersection(line_a, line_b)
        if (intersection_mat.length === 3) {
            // 有交点
            return [intersection_mat[1], intersection_mat[2]]
        }
        else {
            // 无交点
            console.log('无交点')
            return [line_data_a[0]]
        }
    }

    getFixedVectorMove = (start_point, end_point, move_data) => {
        /**
         * @description 线条固定方向向量移动---延长或收缩
         * @param start_point 起点坐标：[img_x,img_y]  固定点
         * @param end_point 终点坐标：[img_x,img_y] 移动点
         * @param move_data 相对移动向量[move_x,move_y]
         * @return 移动后坐标
         */
        let normal_vector = this.NormalVector(start_point, end_point)
        if (Math.abs(move_data[0]) >= Math.abs(move_data[1])) {
            // x主方向
            if (normal_vector[0] === 0) {
                // 横向为0 纵为主
                let new_x = end_point[0] + move_data[1] * normal_vector[0] / normal_vector[1]
                let new_y = end_point[1] + move_data[1]
                return [start_point, [new_x, new_y]]
            }
            else {
                let new_x = end_point[0] + move_data[0]
                let new_y = end_point[1] + move_data[0] * normal_vector[1] / normal_vector[0]
                return [start_point, [new_x, new_y]]
            }

        }
        else {
            if (normal_vector[1] === 0) {
                // 纵向为0 不能移动，以横向为主
                let new_x = end_point[0] + move_data[0]
                let new_y = end_point[1] + move_data[0] * normal_vector[1] / normal_vector[0]
                return [start_point, [new_x, new_y]]
            }
            else {
                let new_x = end_point[0] + move_data[1] * normal_vector[0] / normal_vector[1]
                let new_y = end_point[1] + move_data[1]
                return [start_point, [new_x, new_y]]
            }

        }
    }

    NormalVector = (point_start_mat, point_end_mat) => {
        /**
         * @description 单位向量求解
         * @param point_start_mat 起点：[img_x,img_y]
         * @param point_end_mat 终点：[img_x,img_y]
         * @return 返回两点的单位向量
         */
        let part_distance = this.TwoPointDistance(point_start_mat, point_end_mat)  // 长度
        let part_vector_x = (point_end_mat[0] - point_start_mat[0]) / part_distance    // 单位向量
        let part_vector_y = (point_end_mat[1] - point_start_mat[1]) / part_distance
        return [part_vector_x, part_vector_y]
    }

    getClockwiseCircleLoc = (start_angle, end_angle, center_x, center_y, radius, point_num = 360) => {
        /**
         * @description 顺时针计算圆环坐标
         * @param start_angle 起始角度：以逆时针方向设定角度值 0~360
         * @param end_angle 终点角度
         * @param center_x 圆中心坐标x：img_x
         * @param center_y 圆中心坐标y：img_y
         * @param radius   圆半径长度：img
         * @param point_num 分割点数
         */
        end_angle = end_angle - 360             // 逆时针反向取值
        point_num = Math.abs(end_angle)         // 去1度几个数值
        let gap_angle = (end_angle - start_angle) % 360 / point_num    // 求余0~360
        let all_loc_mat = []
        let decimal_num = 1
        for (let idx = 0; idx < point_num + 1; idx++) {
            let part_radian = (start_angle + gap_angle * idx) / 180 * Math.PI
            let part_x = Math.round((Math.cos(part_radian) * radius + center_x) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            let part_y = Math.round((-Math.sin(part_radian) * radius + center_y) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            all_loc_mat.push([part_x, part_y])
        }
        // console.log('坐标x，y\n', JSON.stringify(loc_x_mat),'\n',JSON.stringify(loc_y_mat))
        return all_loc_mat
    }

    getAnticlockwiseCircleLoc = (start_angle, end_angle, center_x, center_y, radius, point_num = 360) => {
        /**
         * @description 逆时针计算圆环坐标
         * @param start_angle 起始角度：以逆时针方向设定角度值 0~360
         * @param end_angle 终点角度
         * @param center_x 圆中心坐标x：img_x
         * @param center_y 圆中心坐标y：img_y
         * @param radius   圆半径长度：img
         * @param point_num 分割点数
         */
        point_num = Math.abs(end_angle)         // 去1度几个数值
        let gap_angle = (end_angle - start_angle) % 360 / point_num    // 求余0~360
        let all_loc_mat = []
        let decimal_num = 1
        for (let idx = 0; idx < point_num + 1; idx++) {
            let part_radian = (start_angle + gap_angle * idx) / 180 * Math.PI
            let part_x = Math.round((Math.cos(part_radian) * radius + center_x) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            let part_y = Math.round((-Math.sin(part_radian) * radius + center_y) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            all_loc_mat.push([part_x, part_y])
        }
        // console.log('坐标x，y\n', JSON.stringify(loc_x_mat),'\n',JSON.stringify(loc_y_mat))
        return all_loc_mat
    }

    JudgeGraphInRengion = ({ graph_mat, min_x = 0, min_y = 0, max_x, max_y }) => {
        /**
         * @description 判定单幅图像各端点在区域内
         * @param graph_mat 线条端点数据：[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param min_x 最小x值
         * @param min_y 最小y值
         * @param max_x 最大x值
         * @param max_y 最大y值
         * @return ture false
         */
        //  console.log("越界", min_x, min_y, max_x, max_y,)
        for (let idx = 0; idx < graph_mat.length; idx++) {
            // console.log("越界", graph_mat[idx], min_x, min_y, max_x, max_y,this.JudgePointInRegion({ point_mat: graph_mat[idx], min_x: min_x, min_y: min_y, max_x: max_x, max_y: max_y }))
            if (this.JudgePointInRegion({ point_mat: graph_mat[idx], min_x: min_x, min_y: min_y, max_x: max_x, max_y: max_y })) {
                continue
            }
            else {
                return false
            }
        }
        return true
    }

    JudgeLineInRegion = ({ line_mat, min_x = 0, min_y = 0, max_x, max_y }) => {
        /**
         * @description 判定线条数据在区域内
         * @param line_mat 线条端点数据：[[img_x0,img_y0],[img_x1,img_y1]]
         * @param min_x 最小x值
         * @param min_y 最小y值
         * @param max_x 最大x值
         * @param max_y 最大y值
         * @return ture false
         */
        if (this.JudgePointInRegion({ point_mat: line_mat[0], min_x: min_x, min_y: min_y, max_x: max_x, max_y: max_y }) &&
            this.JudgePointInRegion({ point_mat: line_mat[1], min_x: min_x, min_y: min_y, max_x: max_x, max_y: max_y })) {
            return true
        }
        return false

    }

    JudgePointInRegion = ({ point_mat, min_x = 0, min_y = 0, max_x, max_y }) => {
        /**
         * @description 判定点在区域中
         * @param point_mat 点数据：[img_x0,img_y0]
         * @param min_x 最小x值
         * @param min_y 最小y值
         * @param max_x 最大x值
         * @param max_y 最大y值
         * @return ture false
         */
        if (point_mat[0] >= min_x && point_mat[0] <= max_x && point_mat[1] >= min_y && point_mat[1] <= max_y) {
            return true
        }
        else {
            return false
        }
    }

    AllGraphSplitProcess = (all_graph_data, cut_line_mat, init_split_mat = [[]]) => {
        /**
         * @description 所有封闭图形与直线切割后的图形数据变化
         * @param all_graph_data 所有图形坐标数据:[[[img_x0,img_y0],[img_x0,img_y0],...],[[img_x0,img_y0],[img_x0,img_y0],...],...]
         * @param cut_line_mat 切割线数据:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param init_split_mat 初始切割数据：默认空数组，可不填写
         * @return 返回切割后的数组
         */
        return newgraphcls.AllGraphSplitProcess(all_graph_data, cut_line_mat, init_split_mat)
    }

    CalculateGraphPointMove = (graph_data, point_idx, move_data) => {
        /**
         * @description 计算图像移动点产生相邻两线平移
         * @param graph_data 单幅图像数据：[[img_x0,img_y0],[img_x1,img_y1],...]
         * @param point_idx 选择的点索引
         * @param move_data 移动向量
         * @return 返回新的图形坐标
         */
        let move_point = graph_data[point_idx]
        let last_line = [graph_data[point_idx], graph_data[(point_idx - 1 + graph_data.length) % graph_data.length]]
        let next_line = [graph_data[point_idx], graph_data[(point_idx + 1 + graph_data.length) % graph_data.length]]
        console.log('last_line, next_line', graph_data, last_line, next_line)
        // 新的两条平移线条
        let new_last_line = this.DataMove2D(last_line, move_data)
        let new_next_line = this.DataMove2D(next_line, move_data)
        // 新的交叉点---相交线----相交点
        let last_line_last = [graph_data[(point_idx - 1 + graph_data.length) % graph_data.length], graph_data[(point_idx - 2 + graph_data.length) % graph_data.length]]
        let next_line_next = [graph_data[(point_idx + 1 + graph_data.length) % graph_data.length], graph_data[(point_idx + 2 + graph_data.length) % graph_data.length]]
        let last_intersection_mat = newgraphcls.JudgeLineIntersectionLoc2(new_last_line, last_line_last)
        let next_intersection_mat = newgraphcls.JudgeLineIntersectionLoc2(new_next_line, next_line_next)
        let new_last_point = [last_intersection_mat[1], last_intersection_mat[2]]
        let new_next_point = [next_intersection_mat[1], next_intersection_mat[2]]
        let new_graph_data = _.cloneDeep(graph_data)
        new_graph_data[(point_idx - 1 + graph_data.length) % graph_data.length] = new_last_point
        new_graph_data[point_idx] = new_last_line[0]
        new_graph_data[(point_idx + 1 + graph_data.length) % graph_data.length] = new_next_point
        return new_graph_data
    }

    getPointToLineVerticalPoint = (line_data, point_data) => {
        /**
         * @description 计算点到直线的垂线交点
         * @param line_data 线条端点数据:[[img_x0,img_y0],[img_x1,img_y1]]
         * @param point_data 点坐标:[img_x,img_y]
         */
        let line_abc = this.LineABC(line_data[0], line_data[1])
        let p_A = line_abc[1]
        let p_B = -line_abc[0]
        let p_C = -(point_data[0] * p_A + point_data[1] * p_B)
        let intersection_mat = newgraphcls.double_line_intersection(line_abc, [p_A, p_B, p_C])
        console.log('点到直线的垂线交点', JSON.stringify(intersection_mat))
        return [intersection_mat[1], intersection_mat[2]]
    }

}

// python -m SimpleHTTPServer

export class AutoGraphData {
    /**
     * @description 自动图形数据生成---正方形、长方形、平行四边形、梯形、三角形、圆等各类图形的特殊生成方式---坐标点、边、周长、面积、角度、方向等
     */

    constructor(center_x = 5, center_y = 5) {
        /**
         * @description 初始化对象基本构造函数---定义单个图形绘制全局中心
         * @param center_x 图像中心位---x值
         * @param center_y 图像中心位---y值
         */
        this.coordinate_center_x = center_x
        this.coordinate_center_y = center_y
    }

    getParallelogramData = ({
        bottom_length,
        height_length,
        perimeter,
        area,
        down_left_angle,
        center_x = this.coordinate_center_x,
        center_y = this.coordinate_center_y }) => {
        /**
         * @description 获取平行四边形端点数据---同设定平行四边形的高、底边、面积、周长、左下角度等Bottom, height, area, perimeter,down-left-angle
         * @param bottom_length 底边长度
         * @param height_length 高
         * @param perimeter 周长
         * @param area 面积
         * @param down_left_angle 左下角度
         * @param center_x 几何中心x
         * @param center_y 几何中心y
         * @return 返回坐标
         */
    }

    getTriangleData = () => {
        /**
         * @description 获取三角形端点数据：底、高、周长、面积、三角形类型、左下角度、几何中心点
         */
    }

    getRectangleData = () => {
        /**
         * @description 获取矩形端点数据：
         */

    }

    getSquareData = () => {
        /**
         * @description 获取正方形数据：
         */

    }

    getTrapezoidData = () => {
        /**
         * @description 获取梯形数据：
         */
    }

    getCircleData = () => {
        /**
         * @description 获取圆数据：
         */
    }

}