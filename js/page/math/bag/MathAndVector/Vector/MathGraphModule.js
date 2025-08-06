/* eslint-disable */
export class MathGraphClass {
    // 数学图形类函数
    deepClone = (obj, newObj) => {
        // 深度复制
        var newObj = newObj || {};
        for (let key in obj) {
            if (typeof obj[key] == 'object') {
                newObj[key] = (obj[key].constructor === Array) ? [] : {}
                this.deepClone(obj[key], newObj[key]);
            }
            else {
                newObj[key] = obj[key]
            }
        }
        return newObj;
    }

    VectorialAngle = (vector_a, vector_b) => {
        let ab_dot = vector_a[0] * vector_b[0] + vector_a[1] * vector_b[1];   // 点积
        let ab_length = Math.sqrt(vector_a[0] * vector_a[0] + vector_a[1] * vector_a[1]) *
            Math.sqrt(vector_b[0] * vector_b[0] + vector_b[1] * vector_b[1]);// ab 模长乘积
        let cos_theta = ab_dot / ab_length;
        let cos_angle = Math.acos(cos_theta) / Math.PI * 180;
        console.log('向量夹角', cos_angle)
        return Math.round(cos_angle * 100) / 100;
    }

    VectorialAngleDirector = (vector_a, vector_b) => {
        // 向量顺时针逆时针夹角
        let ab_dot = vector_a[0] * vector_b[0] + vector_a[1] * vector_b[1];   // 点积
        let ab_cross = vector_a[0] * vector_b[1] - vector_a[1] * vector_b[0];   // 叉积
        let ab_length = Math.sqrt(vector_a[0] * vector_a[0] + vector_a[1] * vector_a[1]) *
            Math.sqrt(vector_b[0] * vector_b[0] + vector_b[1] * vector_b[1]);// ab 模长乘积
        let sin_theta = ab_cross / ab_length;
        let sin_angle = Math.asin(sin_theta) / Math.PI * 180;
        let cos_theta = ab_dot / ab_length;
        let cos_angle = Math.acos(cos_theta) / Math.PI * 180;
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

    ThreePointIntersection = (test_point, point_a, point_b) => {
        // 三点向量夹角
        if ((JSON.stringify(test_point) == JSON.stringify(point_a)) || (JSON.stringify(test_point) == JSON.stringify(point_b))) {
            // 线上端点
            return 0
        }
        else {
            let vector_a = [point_a[0] - test_point[0], point_a[1] - test_point[1]]
            let vector_b = [point_b[0] - test_point[0], point_b[1] - test_point[1]]
            return this.VectorialAngleDirector(vector_a, vector_b)
        }

    }

    JudgePointInArea = (point_mat, test_point) => {
        let intersection_angle;     // 夹角
        let [line_in_num, line_out_num, clockwise_num, anticlockwise_num] = [0, 0, 0, 0]
        // console.log('line_in_num, line_out_num,  clockwise_num, anticlockwise_num',
        // line_in_num, line_out_num,  clockwise_num, anticlockwise_num)
        for (let idx = 0; idx < point_mat.length; idx++) {
            if (idx == point_mat.length - 1) {
                // 取尾头
                intersection_angle = this.ThreePointIntersection(test_point, point_mat[idx], point_mat[0])
            }
            else {
                // 顺序取点
                intersection_angle = this.ThreePointIntersection(test_point, point_mat[idx], point_mat[idx + 1])
            }
            // 判定方向
            if (intersection_angle == 180 || intersection_angle == -180) {
                // 线上内点
                line_in_num += 1
            }
            else if (intersection_angle == 0) {
                // 线上外点
                line_out_num += 1
            }
            else if (intersection_angle > 0) {
                // 顺时针点
                clockwise_num += 1
            }
            else if (intersection_angle < 0) {
                // 逆时针点
                anticlockwise_num += 1
            }
            else {
                // 无效数据
                console.log('无效数据')
            }
        }
        // console.log('线上内点:%d\n线上外点:%d\n顺时针点:%d\n逆时针点:%d', line_in_num, line_out_num,  clockwise_num, anticlockwise_num)
        if (clockwise_num == point_mat.length || anticlockwise_num == point_mat.length) {
            // console.log('判定为：====区域内点=====')
            return 2
        }
        else if ((clockwise_num + line_in_num) == point_mat.length || (anticlockwise_num + line_in_num) == point_mat.length) {
            // console.log('判定为：====区域线上内点====')
            return 1
        }
        else {
            // console.log('判定为：====区域外点====')
            return 0
        }
    }

    AllLineIntersection = (point_mat_a, point_mat_b) => {
        // 相交线条
        let line_data_a, line_data_b
        let common_line = []
        let intersection_point = []
        for (let idx = 0; idx < point_mat_a.length; idx++) {
            if (idx == point_mat_a.length - 1) {
                line_data_a = [point_mat_a[idx], point_mat_a[0]]
            }
            else {
                line_data_a = [point_mat_a[idx], point_mat_a[idx + 1]]
            }
            for (let idx_jj = 0; idx_jj < point_mat_b.length; idx_jj++) {
                if (idx_jj == point_mat_b.length - 1) {
                    line_data_b = [point_mat_b[idx_jj], point_mat_b[0]]
                }
                else {
                    line_data_b = [point_mat_b[idx_jj], point_mat_b[idx_jj + 1]]
                }
                // console.log('线条情况', line_data_a, line_data_b)
                // console.log('线条相交情况', idx, idx_jj, new_graph_class.JudgeLineIntersectionLoc(line_data_a, line_data_b))
                let line_intersection_relation = this.JudgeLineIntersectionLoc(line_data_a, line_data_b)
                // console.log('线条相交情况', line_intersection_relation)
                if (line_intersection_relation.length == 2 && line_intersection_relation[0] == 1) {
                    // 公共线段
                    common_line.push(line_intersection_relation[1])
                }
                else if (line_intersection_relation.length == 3 && line_intersection_relation[0] == 0) {
                    // 线条交点
                    if (intersection_point.length < 1) {
                        intersection_point.push([line_intersection_relation[1], line_intersection_relation[2]])
                    }
                    else {
                        // 筛重
                        for (let idx_pp = 0; idx_pp < intersection_point.length; idx_pp++) {
                            if (line_intersection_relation[1] == intersection_point[idx_pp][0] &&
                                line_intersection_relation[2] == intersection_point[idx_pp][1]) {
                                break
                            }
                            if (idx_pp == intersection_point.length - 1) {
                                intersection_point.push([line_intersection_relation[1], line_intersection_relation[2]])
                            }
                        }
                    }
                }
            }
        }
        console.log('共线', common_line)
        console.log('交点', intersection_point)
        return [common_line, intersection_point]
    }

    AllLineIntersection2 = (point_mat_a, point_mat_b) => {
        // 相交线条与那条线有交点
        let line_data_a, line_data_b
        let common_line = []
        let intersection_point = []
        let intersection_idx = []  // 与那条线有交点
        for (let idx = 0; idx < point_mat_a.length; idx++) {
            if (idx == point_mat_a.length - 1) {
                line_data_a = [point_mat_a[idx], point_mat_a[0]]
            }
            else {
                line_data_a = [point_mat_a[idx], point_mat_a[idx + 1]]
            }
            for (let idx_jj = 0; idx_jj < point_mat_b.length - 1; idx_jj++) {
                // 处理为单挑直线情况
                if (idx_jj == point_mat_b.length - 1) {
                    line_data_b = [point_mat_b[idx_jj], point_mat_b[0]]
                }
                else {
                    line_data_b = [point_mat_b[idx_jj], point_mat_b[idx_jj + 1]]
                }
                // console.log('线条情况', line_data_a, line_data_b)
                // console.log('线条相交情况', idx, idx_jj, new_graph_class.JudgeLineIntersectionLoc(line_data_a, line_data_b))
                let line_intersection_relation = this.JudgeLineIntersectionLoc(line_data_a, line_data_b)
                // console.log('线条相交情况', line_intersection_relation)
                if (line_intersection_relation.length == 2 && line_intersection_relation[0] == 1) {
                    // 公共线段
                    common_line.push(line_intersection_relation[1])
                    intersection_idx.push(-1)   // 共线
                }
                else if (line_intersection_relation.length == 3 && line_intersection_relation[0] == 0) {
                    // 线条交点
                    if (intersection_point.length < 1) {
                        intersection_point.push([line_intersection_relation[1], line_intersection_relation[2]])
                    }
                    else {
                        // 筛重
                        for (let idx_pp = 0; idx_pp < intersection_point.length; idx_pp++) {
                            if (line_intersection_relation[1] == intersection_point[idx_pp][0] &&
                                line_intersection_relation[2] == intersection_point[idx_pp][1]) {
                                break
                            }
                            if (idx_pp == intersection_point.length - 1) {
                                intersection_point.push([line_intersection_relation[1], line_intersection_relation[2]])
                            }
                        }
                    }
                    intersection_idx.push(1)   // 相交

                }
                else {
                    intersection_idx.push(0)   // 无交点
                }
            }
        }
        // console.log('共线', common_line)
        // console.log('交点', intersection_point)
        // console.log('交点索引', intersection_idx)
        return [common_line, intersection_point, intersection_idx]
    }

    SieveHeavyData = (init_data) => {
        // 筛选重复的
        let new_data = []
        for (let idx = 0; idx < init_data.length; idx++) {
            if (idx == 0) {
                new_data.push(init_data[idx])
            }
            else {
                for (let idx_ii = 0; idx_ii < new_data.length; idx_ii++) {
                    if (init_data[idx][0] == new_data[idx_ii][0] &&
                        init_data[idx][1] == new_data[idx_ii][1]) {
                        // 有重复的点
                        break
                    }
                    if (idx_ii == new_data.length - 1) {
                        new_data.push(init_data[idx])
                    }
                }
            }
        }
        return new_data
    }

    AllPintsMatProcess = (point_mat_a, point_mat_b) => {
        // 两组区域内
        let a_in_b = []     // 依次判定mat_a各点在mat_b中的关系
        let b_in_a = []     // 依次判定mat_b各点在mat_a中的关系
        for (let idx = 0; idx < point_mat_a.length; idx++) {
            let relation_flag = this.JudgePointInArea(point_mat_b, point_mat_a[idx])
            a_in_b.push(relation_flag)
        }
        console.log('a各点在b中的情况', a_in_b)
        for (let idx = 0; idx < point_mat_b.length; idx++) {
            let relation_flag = this.JudgePointInArea(point_mat_a, point_mat_b[idx])
            b_in_a.push(relation_flag)
        }
        console.log('b各点在a中的情况', b_in_a)
        // 相交线条
        let [common_line, intersection_point] = this.AllLineIntersection(point_mat_a, point_mat_b)
        // 组合所有点并，筛重
        let all_point_data = []
        // 加载a在b中的
        for (let idx = 0; idx < a_in_b.length; idx++) {
            if (a_in_b[idx] == 1 || a_in_b[idx] == 2) {
                all_point_data.push(point_mat_a[idx])
            }
        }
        // 加载b在a中的
        for (let idx = 0; idx < b_in_a.length; idx++) {
            if (b_in_a[idx] == 1 || b_in_a[idx] == 2) {
                all_point_data.push(point_mat_b[idx])
            }
        }
        // 加载交点
        for (let idx = 0; idx < intersection_point.length; idx++) {
            all_point_data.push(intersection_point[idx])
        }
        console.log('全部点', all_point_data)
        let sieve_heavy_Data = this.SieveHeavyData(all_point_data)
        console.log('全部筛重', sieve_heavy_Data)
        let sort_idx = this.get_points_sort(sieve_heavy_Data)
    }

    LineABC = (point_a, point_b) => {
        // 两点求直线ABC值: Ax+By+C=0
        if (JSON.stringify(point_a) == JSON.stringify(point_b)) {
            // console.log('两点相同')
            return false;
        }
        else {
            // console.log('可求直线', point_a[0]==point_b[0])
            let line_A = 0;
            let line_B = 0;
            let line_C = 0;
            if (point_a[0] == point_b[0]) {
                // x值相等，直线方程为Bx+C=0
                line_A = 1;
                line_B = 0;
                line_C = -point_a[0];
            }
            else {
                line_A = -(point_a[1] - point_b[1]) / (point_a[0] - point_b[0]);
                line_B = 1;
                line_C = -line_A * point_a[0] - point_a[1]
            }
            // console.log('直线ABC求解', line_A, line_B, line_C)
            return [line_A, line_B, line_C]
        }
    }

    PointToLineDistance = (line_data, point_c) => {
        // 求解点到直线的距离:
        let length_AB = Math.sqrt(line_data[0] * line_data[0] + line_data[1] * line_data[1]);
        let length_point = line_data[0] * point_c[0] + line_data[1] * point_c[1] + line_data[2];
        let point_distance_abs = Math.abs(length_point / length_AB);
        let point_distance = length_point / length_AB;
        return point_distance_abs;
    }

    ArrayDistance = (part_line_data0) => {
        // 数组求端点直线其余点距离
        let part_line_data = [];
        part_line_data = this.deepClone(part_line_data0, part_line_data)
        let point_a = [part_line_data[0].shift(), part_line_data[1].shift()];   //弹出第一个
        let point_b = [part_line_data[0].pop(), part_line_data[1].pop()];     //弹出最后一个
        console.log('端点数据', point_a, point_b, part_line_data)
        // 求端点直线ABC:Ax+By+C=0
        let line_data = this.LineABC(point_a, point_b)
        // console.log('直线ABC求解', line_data)
        var part_distance_mat = []
        for (let ii in part_line_data) {
            let point_c = [part_line_data[0][ii], part_line_data[1][ii]]
            // console.log('求值距离点', point_c)
            let dis_p = this.PointToLineDistance(line_data, point_c)
            part_distance_mat[ii] = dis_p

        }
        // console.log('各点距离', part_distance_mat)
        return part_line_data;
    }

    TwoPointDistance = (point_a, point_b) => {
        // 求解两点之间的距离
        let x_div = point_a[0] - point_b[0]
        let y_div = point_a[1] - point_b[1]
        // console.log('x_div/y_div',x_div,y_div)
        return Math.sqrt(x_div * x_div + y_div * y_div)
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
        // console.log('cut_x1,cut_y1',cut_x1,cut_y1, start_point,end_point)
        // console.log('cut_x2,cut_y2',cut_x2,cut_y2, start_point,end_point)
        // console.log('取值', this.TwoPointDistance([cut_x1,cut_y1],end_point), this.TwoPointDistance([cut_x2,cut_y2],end_point))
        // console.log('直线参数1', line_abc, this.Line_ABC([cut_x1,cut_y1],end_point) )
        // console.log('直线参数2', line_abc, this.Line_ABC([cut_x2,cut_y2],end_point) )
        // console.log('比较', this.TwoPointDistance([cut_x1,cut_y1],end_point)<this.TwoPointDistance([cut_x2,cut_y2],end_point))
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

    CalculateLongVerticalPoint = (line_a, intersect_mat, vertical_length) => {
        //  求解较长垂线数据点
        let new_distance_1 = this.TwoPointDistance(line_a[0], [intersect_mat[1], intersect_mat[2]])
        let new_distance_2 = this.TwoPointDistance(line_a[1], [intersect_mat[1], intersect_mat[2]])
        if (new_distance_1 >= new_distance_2) {
            // 在起点到交点位置找便宜点
            // console.log('--------------前---------')
            return this.GetLengthLoc([intersect_mat[1], intersect_mat[2]], line_a[0], vertical_length)
        }
        else {
            // 在起点到交点位置找便宜点
            // console.log('--------------后---------')
            return this.GetLengthLoc([intersect_mat[1], intersect_mat[2]], line_a[1], vertical_length)
        }
    }


    ArrayAngle = (part_line_data0) => {
        // 获得数据点连续三个点的方向向量夹角
        // console.log('初始数据', part_line_data0, part_line_data0[0].length)
        let part_angle_mat = []
        for (let ii = 1; ii < part_line_data0[0].length - 1; ii++) {
            // 修改方向
            let vector_a = [part_line_data0[0][ii] - part_line_data0[0][ii - 1], -(part_line_data0[1][ii] - part_line_data0[1][ii - 1])];
            let vector_b = [part_line_data0[0][ii + 1] - part_line_data0[0][ii], -(part_line_data0[1][ii + 1] - part_line_data0[1][ii])];
            let part_angle = this.VectorialAngle(vector_a, vector_b);
            // console.log('索引ii:', ii, '角度：', part_angle)
            part_angle_mat[ii - 1] = part_angle;
        }
        return part_angle_mat;
    }

    TwoRegionRatio = (mat_a, mat_b) => {
        // 确定主次/
        let compare_mat;
        if ((mat_a[1] - mat_a[0]) >= (mat_b[1] - mat_b[0])) {
            compare_mat = this.TwoRegionMainSubRatio(mat_a, mat_b)
        }
        else {
            compare_mat = this.TwoRegionMainSubRatio(mat_b, mat_a)
        }
        return compare_mat
    }

    TwoRegionMainSubRatio = (mat_m, mat_s) => {
        // 第一组为母(横向较大)、第二组为子(横向较小)
        let common_ratio
        let common_direction // -1,0,1;左、中、右
        if (mat_m[1] < mat_s[0]) {
            // 两侧、横向无相交
            // 次在右
            // console.log('横向判断无相交')
            common_ratio = 0
            common_direction = 1
        }
        else if (mat_s[1] < mat_m[0]) {
            // 两侧、横向无相交
            // 次在左
            // console.log('横向判断无相交')
            common_ratio = 0
            common_direction = -1
        }
        else {
            // 有相交
            if (mat_m[0] <= mat_s[0] && mat_m[1] >= mat_s[1]) {
                // console.log("全相交")
                // 次在中
                common_ratio = 1
                common_direction = 0
            }
            else if (mat_m[0] <= mat_s[0] && mat_m[1] < mat_s[1]) {
                // 子右区域在内
                common_ratio = (mat_m[1] - mat_s[0] + 1) / (mat_s[1] - mat_s[0] + 1)
                common_direction = 1
            }
            else if (mat_m[0] >= mat_s[0] && mat_m[1] > mat_s[1]) {
                // 子左区域在内
                common_ratio = (mat_s[1] - mat_m[0] + 1) / (mat_s[1] - mat_s[0] + 1)
                common_direction = -1
            }
            else {
                // 有误
                common_ratio = 0
                common_direction = 0
            }
        }
        return [common_ratio, common_direction]
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

    double_line_intersection = (line_a, line_b) => {
        // 两线相交
        let intersection_x, intersection_y
        if (line_a[0] == line_b[0] && line_a[1] == line_b[1] && line_a[2] == line_b[2]) {
            // 共线
            return [1]
        }
        else if (line_a[0] == line_b[0] && line_a[1] == line_b[1] && line_a[2] != line_b[2]) {
            // 平行
            return [-1]
        }
        else {
            // 其余相交线
            intersection_x = -(line_b[1] * line_a[2] - line_b[2] * line_a[1]) / (line_b[1] * line_a[0] - line_b[0] * line_a[1])
            intersection_y = -(line_b[0] * line_a[2] - line_b[2] * line_a[0]) / (line_b[0] * line_a[1] - line_b[1] * line_a[0])
            return [0, intersection_x, intersection_y]
        }
    }

    judge_intersection_loc = (line_data_a, line_data_b) => {
        // 判断交点位置，在线内还是线外
        let line_a = this.Line_ABC(line_data_a[0], line_data_a[1])
        let line_b = this.Line_ABC(line_data_b[0], line_data_b[1])
        let intersection_mat = this.double_line_intersection(line_a, line_b)
        if (intersection_mat[0] == 1) {
            // 共线：也可能存在
            return [1]
        }
        else if (intersection_mat[0] == -1) {
            // 平行
            return [-1]
        }
        else {
            // 有交点、交点属于线
            let min_x_a = Math.min(line_data_a[0][0], line_data_a[1][0])
            let max_x_a = Math.max(line_data_a[0][0], line_data_a[1][0])
            let min_y_a = Math.min(line_data_a[0][1], line_data_a[1][1])
            let max_y_a = Math.max(line_data_a[0][1], line_data_a[1][1])
            let min_x_b = Math.min(line_data_b[0][0], line_data_b[1][0])
            let max_x_b = Math.max(line_data_b[0][0], line_data_b[1][0])
            let min_y_b = Math.min(line_data_b[0][1], line_data_b[1][1])
            let max_y_b = Math.max(line_data_b[0][1], line_data_b[1][1])
            // console.log('端点排序\n', min_x_a, max_x_a, min_y_a, max_y_a, '\n', min_x_b, max_x_b, min_y_b, max_y_b)
            // console.log('====交点====', intersection_mat)
            if ((intersection_mat[1] >= min_x_a && intersection_mat[1] <= max_x_a && intersection_mat[2] >= min_y_a && intersection_mat[2] <= max_y_a) &&
                (intersection_mat[1] >= min_x_b && intersection_mat[1] <= max_x_b && intersection_mat[2] >= min_y_b && intersection_mat[2] <= max_y_b)) {
                // 线内交点
                return intersection_mat
            }
            else {
                // '线外交点'
                return [0]
            }
        }
    }

    JudgeLineIntersectionLoc = (line_data_a, line_data_b) => {
        // 判断交点位置，在线内还是线外
        let line_a = this.Line_ABC(line_data_a[0], line_data_a[1])
        let line_b = this.Line_ABC(line_data_b[0], line_data_b[1])
        let intersection_mat = this.double_line_intersection(line_a, line_b)
        console.log('-------两条线相交情况', intersection_mat)
        if (intersection_mat[0] == 1) {
            // 共线：也可能存在
            // 获取公共线条区域
            let line_a_x = [line_data_a[0][0], line_data_a[1][0]]       // line_a x坐标
            let line_a_y = [line_data_a[0][1], line_data_a[1][1]]       // line_a y坐标
            let line_b_x = [line_data_b[0][0], line_data_b[1][0]]       // line_b x坐标
            let line_b_y = [line_data_b[0][1], line_data_b[1][1]]       // line_b y坐标
            let min_x_a = Math.min.apply(null, line_a_x)
            let max_x_a = Math.max.apply(null, line_a_x)
            let min_y_a = Math.min.apply(null, line_a_y)
            let max_y_a = Math.max.apply(null, line_a_y)
            let min_x_b = Math.min.apply(null, line_b_x)
            let max_x_b = Math.max.apply(null, line_b_x)
            let min_y_b = Math.min.apply(null, line_b_y)
            let max_y_b = Math.max.apply(null, line_b_y)
            // console.log('端点排序\n线条a：',  line_data_a, min_x_a, max_x_a, min_y_a, max_y_a,
            //                     '\n线条b：', line_data_b, min_x_b, max_x_b, min_y_b, max_y_b)
            let line_in_point = []
            // 分别判定各点在区域内情况
            if ((line_data_b[0][0] >= min_x_a && line_data_b[0][0] <= max_x_a) &&
                (line_data_b[0][1] >= min_y_a && line_data_b[0][1] <= max_y_a)) {
                line_in_point.push(line_data_b[0])
            }
            if ((line_data_b[1][0] >= min_x_a && line_data_b[1][0] <= max_x_a) &&
                (line_data_b[1][1] >= min_y_a && line_data_b[1][1] <= max_y_a)) {
                line_in_point.push(line_data_b[1])
            }
            if ((line_data_a[0][0] >= min_x_b && line_data_a[0][0] <= max_x_b) &&
                (line_data_a[0][1] >= min_y_b && line_data_a[0][1] <= max_y_b)) {
                line_in_point.push(line_data_a[0])
            }
            if ((line_data_a[1][0] >= min_x_b && line_data_a[1][0] <= max_x_b) &&
                (line_data_a[1][1] >= min_y_b && line_data_a[1][1] <= max_y_b)) {
                line_in_point.push(line_data_a[1])
            }
            // console.log('公共线段点', line_in_point)
            if (line_in_point.length >= 2) {
                // 筛除重复点
                let new_in_point = []
                for (let idx = 0; idx < line_in_point.length; idx++) {
                    if (idx == 0) {
                        new_in_point.push(line_in_point[0])
                    }
                    else {
                        for (let idx_jj = 0; idx_jj < new_in_point.length; idx_jj++) {
                            if (line_in_point[idx][0] == new_in_point[idx_jj][0] && line_in_point[idx][1] == new_in_point[idx_jj][1]) {
                                break
                            }
                            else if (idx_jj == new_in_point.length - 1) {
                                // 未找到相同点
                                new_in_point.push(line_in_point[idx])
                            }
                        }
                    }
                }
                // console.log('筛选数据======', new_in_point)
                return [1, new_in_point]
            }
            else {
                return [1]
            }
        }
        else if (intersection_mat[0] == -1) {
            // 平行
            return [-1]
        }
        else {
            // 有交点、交点属于线
            let min_x_a = Math.min(line_data_a[0][0], line_data_a[1][0])
            let max_x_a = Math.max(line_data_a[0][0], line_data_a[1][0])
            let min_y_a = Math.min(line_data_a[0][1], line_data_a[1][1])
            let max_y_a = Math.max(line_data_a[0][1], line_data_a[1][1])
            let min_x_b = Math.min(line_data_b[0][0], line_data_b[1][0])
            let max_x_b = Math.max(line_data_b[0][0], line_data_b[1][0])
            let min_y_b = Math.min(line_data_b[0][1], line_data_b[1][1])
            let max_y_b = Math.max(line_data_b[0][1], line_data_b[1][1])
            // console.log('端点排序\n', min_x_a, max_x_a, min_y_a, max_y_a, '\n', min_x_b, max_x_b, min_y_b, max_y_b)
            // console.log('======交点======', intersection_mat)
            if ((intersection_mat[1] >= min_x_a && intersection_mat[1] <= max_x_a && intersection_mat[2] >= min_y_a && intersection_mat[2] <= max_y_a) &&
                (intersection_mat[1] >= min_x_b && intersection_mat[1] <= max_x_b && intersection_mat[2] >= min_y_b && intersection_mat[2] <= max_y_b)) {
                // 线内交点
                return intersection_mat
            }
            else {
                // '线外交点'
                return [0]
            }
        }
    }

    JudgeLineIntersectionLoc2 = (line_data_a, line_data_b) => {
        // 判断交点位置，在线内还是线外---线外交点
        let line_a = this.Line_ABC(line_data_a[0], line_data_a[1])
        let line_b = this.Line_ABC(line_data_b[0], line_data_b[1])
        let intersection_mat = this.double_line_intersection(line_a, line_b)
        console.log('-------两条线相交情况---线外交点', intersection_mat)
        if (intersection_mat[0] == 1) {
            // 共线：也可能存在
            // 获取公共线条区域
            let line_a_x = [line_data_a[0][0], line_data_a[1][0]]       // line_a x坐标
            let line_a_y = [line_data_a[0][1], line_data_a[1][1]]       // line_a y坐标
            let line_b_x = [line_data_b[0][0], line_data_b[1][0]]       // line_b x坐标
            let line_b_y = [line_data_b[0][1], line_data_b[1][1]]       // line_b y坐标
            let min_x_a = Math.min.apply(null, line_a_x)
            let max_x_a = Math.max.apply(null, line_a_x)
            let min_y_a = Math.min.apply(null, line_a_y)
            let max_y_a = Math.max.apply(null, line_a_y)
            let min_x_b = Math.min.apply(null, line_b_x)
            let max_x_b = Math.max.apply(null, line_b_x)
            let min_y_b = Math.min.apply(null, line_b_y)
            let max_y_b = Math.max.apply(null, line_b_y)
            // console.log('端点排序\n线条a：',  line_data_a, min_x_a, max_x_a, min_y_a, max_y_a,
            //                     '\n线条b：', line_data_b, min_x_b, max_x_b, min_y_b, max_y_b)
            let line_in_point = []
            // 分别判定各点在区域内情况
            if ((line_data_b[0][0] >= min_x_a && line_data_b[0][0] <= max_x_a) &&
                (line_data_b[0][1] >= min_y_a && line_data_b[0][1] <= max_y_a)) {
                line_in_point.push(line_data_b[0])
            }
            if ((line_data_b[1][0] >= min_x_a && line_data_b[1][0] <= max_x_a) &&
                (line_data_b[1][1] >= min_y_a && line_data_b[1][1] <= max_y_a)) {
                line_in_point.push(line_data_b[1])
            }
            if ((line_data_a[0][0] >= min_x_b && line_data_a[0][0] <= max_x_b) &&
                (line_data_a[0][1] >= min_y_b && line_data_a[0][1] <= max_y_b)) {
                line_in_point.push(line_data_a[0])
            }
            if ((line_data_a[1][0] >= min_x_b && line_data_a[1][0] <= max_x_b) &&
                (line_data_a[1][1] >= min_y_b && line_data_a[1][1] <= max_y_b)) {
                line_in_point.push(line_data_a[1])
            }
            // console.log('公共线段点', line_in_point)
            if (line_in_point.length >= 2) {
                // 筛除重复点
                let new_in_point = []
                for (let idx = 0; idx < line_in_point.length; idx++) {
                    if (idx == 0) {
                        new_in_point.push(line_in_point[0])
                    }
                    else {
                        for (let idx_jj = 0; idx_jj < new_in_point.length; idx_jj++) {
                            if (line_in_point[idx][0] == new_in_point[idx_jj][0] && line_in_point[idx][1] == new_in_point[idx_jj][1]) {
                                break
                            }
                            else if (idx_jj == new_in_point.length - 1) {
                                // 未找到相同点
                                new_in_point.push(line_in_point[idx])
                            }
                        }
                    }
                }
                // console.log('筛选数据======', new_in_point)
                return [1, new_in_point]
            }
            else {
                return [1]
            }
        }
        else if (intersection_mat[0] == -1) {
            // 平行
            return [-1]
        }
        else {
            // 有交点、交点属于线
            let min_x_a = Math.min(line_data_a[0][0], line_data_a[1][0])
            let max_x_a = Math.max(line_data_a[0][0], line_data_a[1][0])
            let min_y_a = Math.min(line_data_a[0][1], line_data_a[1][1])
            let max_y_a = Math.max(line_data_a[0][1], line_data_a[1][1])
            let min_x_b = Math.min(line_data_b[0][0], line_data_b[1][0])
            let max_x_b = Math.max(line_data_b[0][0], line_data_b[1][0])
            let min_y_b = Math.min(line_data_b[0][1], line_data_b[1][1])
            let max_y_b = Math.max(line_data_b[0][1], line_data_b[1][1])
            // console.log('端点排序\n', min_x_a, max_x_a, min_y_a, max_y_a, '\n', min_x_b, max_x_b, min_y_b, max_y_b)
            // console.log('======交点======', intersection_mat)
            if ((intersection_mat[1] >= min_x_a && intersection_mat[1] <= max_x_a && intersection_mat[2] >= min_y_a && intersection_mat[2] <= max_y_a) &&
                (intersection_mat[1] >= min_x_b && intersection_mat[1] <= max_x_b && intersection_mat[2] >= min_y_b && intersection_mat[2] <= max_y_b)) {
                // 线内交点
                return intersection_mat
            }
            else {
                // '线外交点----特征数字100'
                return [100, intersection_mat[1],intersection_mat[2]]
            }
        }
    }

    judge_point_in_rectangle = (point_data, rect_data) => {
        // 判断点在方形区域内;point_data:[loc_x, loc_y], rect_data:[start_x, start_y, rect_width, rect_height]
        if (point_data[0] > rect_data[0] && point_data[0] < (rect_data[0] + rect_data[2]) &&
            point_data[1] > rect_data[1] && point_data[1] < (rect_data[1] + rect_data[3])) {
            return 1
        }
        else {
            return 0
        }
    }

    get_rectangle_point = (rect_data) => {
        // 获得方形坐标点:左上开始、逆时针排序
        return [[rect_data[0], rect_data[1]],
            [rect_data[0] + rect_data[2], rect_data[1]],
            [rect_data[0] + rect_data[2], rect_data[1] + rect_data[3]],
            [rect_data[0], rect_data[1] + rect_data[3]]]
    }

    get_rectangle_line = (rect_point_data) => {
        // 获得线段数据
        let rect_line_data = []
        for (let idx = 0; idx < rect_point_data.length; idx++) {
            if (idx == rect_point_data.length - 1) {
                // 最后一组数据
                rect_line_data.push([rect_point_data[idx], rect_point_data[0]])
            }
            else {
                rect_line_data.push([rect_point_data[idx], rect_point_data[idx + 1]])
            }
        }
        return rect_line_data
    }

    judge_point_in_area = (rect_point_data, rect_data) => {
        // 判断点集 在方形区域内的数据
        let point_in_area = []   // 点集a在区域b中的数据点
        for (let idx = 0; idx < rect_point_data.length; idx++) {
            if (this.judge_point_in_rectangle(rect_point_data[idx], rect_data) == 1) {
                point_in_area.push(rect_point_data[idx])
            }
        }
        return point_in_area
    }

    judge_line_intersection_line = (rect_line_a, rect_line_b) => {
        // 判断线条组的相交
        let line_intersection_point = []
        for (let idx_ii = 0; idx_ii < rect_line_a.length; idx_ii++) {
            for (let idx_jj = 0; idx_jj < rect_line_b.length; idx_jj++) {
                let intersection_mat = this.judge_intersection_loc(rect_line_a[idx_ii], rect_line_b[idx_jj])
                if (intersection_mat.length == 3) {
                    // 线内交点
                    if (line_intersection_point.length == 0) {
                        line_intersection_point.push([intersection_mat[1], intersection_mat[2]])
                    }
                    else {
                        let none_flag = 0
                        for (let p_idx = 0; p_idx < line_intersection_point.length; p_idx++) {
                            // 遍历数据
                            if (line_intersection_point[p_idx][0] == intersection_mat[1] && line_intersection_point[p_idx][1] == intersection_mat[2]) {
                                none_flag = 1
                                break
                            }
                        }
                        if (none_flag == 0) {
                            line_intersection_point.push([intersection_mat[1], intersection_mat[2]])
                        }
                    }
                }
            }
        }
        return line_intersection_point
    }

    get_points_sort = (points_data) => {
        // 将离散点有序排列组合封闭图像：线条无线内交点
        console.log('原始坐标点', JSON.stringify(points_data))
        let points_sort_data = []
        let points_sort_idx = []
        let point_idx = 0
        while (point_idx <= points_data.length) {
            point_idx += 1
            if (points_sort_idx.length < 1) {
                // 第一次组合
                points_sort_idx.push(0)
                for (let idx = 1; idx < points_data.length; idx++) {
                    // 找到一点，组合直线
                    let base_line = [points_data[0], points_data[idx]]
                    let false_flag = 0
                    for (let idx_ii = 0; idx_ii < points_data.length; idx_ii++) {
                        for (let idx_jj = 0; idx_jj < points_data.length; idx_jj++) {
                            if (points_sort_idx.indexOf(idx_ii) < 0 && idx_ii != idx &&
                                points_sort_idx.indexOf(idx_jj) < 0 && idx_ii != idx) {
                                // 测试线
                                let test_line = [points_data[idx_ii], points_data[idx_jj]]
                                let intersection_mat = this.judge_intersection_loc(base_line, test_line)
                                if (intersection_mat.length == 3) {
                                    false_flag = 1
                                    break
                                }
                            }
                        }
                    }
                    if (false_flag == 0) {
                        // 没有找到和其他组合线条的相交点
                        points_sort_idx.push(idx)
                        break
                    }
                }
            }
            else {
                //
                let end_idx = points_sort_idx[points_sort_idx.length - 1]
                for (let idx = 0; idx < points_data.length; idx++) {
                    if (points_sort_idx.indexOf(idx) < 0) { //未使用
                        let base_line = [points_data[end_idx], points_data[idx]]
                        let false_flag = 0
                        for (let idx_ii = 0; idx_ii < points_data.length; idx_ii++) {
                            for (let idx_jj = 0; idx_jj < points_data.length; idx_jj++) {
                                if ([end_idx, idx].indexOf(idx_ii) < 0 && [end_idx, idx].indexOf(idx_jj) < 0) {
                                    // 测试线
                                    let test_line = [points_data[idx_ii], points_data[idx_jj]]
                                    let intersection_mat = this.judge_intersection_loc(base_line, test_line)
                                    if (intersection_mat.length == 3) {
                                        false_flag = 1
                                        break
                                    }
                                }
                            }
                        }
                        if (false_flag == 0) {
                            // 没有找到和其他组合线条的相交点
                            points_sort_idx.push(idx)
                            break
                        }
                    }
                }
            }
        }
        console.log('排序idx', points_sort_idx)
        for (let idx = 0; idx < points_sort_idx.length; idx++) {
            points_sort_data.push(points_data[points_sort_idx[idx]][0])
            points_sort_data.push(points_data[points_sort_idx[idx]][1])
        }
        points_sort_data.push(points_data[points_sort_idx[0]][0])
        points_sort_data.push(points_data[points_sort_idx[0]][1])
        console.log('排序loc', JSON.stringify(points_sort_data))
        return points_sort_data
    }

    get_rectangle_side = (rect_data) => {
        // 获得方形坐标点:左上开始、逆时针排序
        let rect_point_data = this.get_rectangle_point(rect_data)
        let rect_side_data = [[rect_point_data[0], rect_point_data[1]],
            [rect_point_data[1], rect_point_data[2]],
            [rect_point_data[2], rect_point_data[3]],
            [rect_point_data[3], rect_point_data[0]]]
        return rect_side_data
    }

    judge_line_loc_relation = (rect_a, rect_b, point_line) => {
        // 判断线条组和矩形边的关系：适合方形
        // rect_a:方形a、rect_b:方形b参数、point_line:排列点
        let rect_side_a = this.get_rectangle_side(rect_a)
        let rect_side_b = this.get_rectangle_side(rect_b)
        let point_side = []
        for (let idx = 0; idx < point_line.length - 2; idx = idx + 2) {
            point_side.push([[point_line[idx], point_line[idx + 1]], [point_line[idx + 2], point_line[idx + 3]]])
        }
        let line_in_line_mat = []
        let line_notin_line_mat = []
        console.log('线条数据：\n', JSON.stringify(rect_side_a), '\n', JSON.stringify(rect_side_b), '\n', JSON.stringify(point_side))
        for (let idx = 0; idx < point_side.length; idx++) {
            if (this.judge_line_loc_area(rect_a, point_side[idx]) == 1 && this.judge_line_loc_area(rect_b, point_side[idx]) == 1) {
                // 都在边缘
                if (point_side[idx][0][0] == point_side[idx][1][0]) {
                    // x相等
                    if (point_side[idx][0][1] > point_side[idx][1][1]) {
                        line_in_line_mat.push([1, point_side[idx][1], point_side[idx][0]])
                    }
                    else {
                        line_in_line_mat.push([1, point_side[idx][0], point_side[idx][1]])
                    }
                }
                else {
                    // y相等
                    if (point_side[idx][0][0] > point_side[idx][1][0]) {
                        line_in_line_mat.push([0, point_side[idx][1], point_side[idx][0]])
                    }
                    else {
                        line_in_line_mat.push([0, point_side[idx][0], point_side[idx][1]])
                    }
                }
            }
            else {
                line_notin_line_mat.push(point_side[idx])
            }
        }
        console.log('边上', JSON.stringify(line_in_line_mat))
        console.log('面内', JSON.stringify(line_notin_line_mat))
        return line_in_line_mat
    }

    judge_line_loc_rect = (rect_side_mat, single_side_mat) => {
        // 判断单条线与方形线条的关系
        // let line_in_line_mat = []
        for (let idx = 0; idx < rect_side_mat.length; idx++) {
            if (this.judge_intersection_loc(rect_side_mat[idx], single_side_mat)[0] == 1) {
                // 共线
                return 1
            }
        }
        return 0
    }

    judge_line_loc_area = (rect_mat, single_side_mat) => {
        // 判断单线条和区域的关系：内部还是边缘、根据线条中心位置
        let center_x = (single_side_mat[0][0] + single_side_mat[1][0]) / 2
        let center_y = (single_side_mat[0][1] + single_side_mat[1][1]) / 2
        if ((rect_mat[0] < center_x && (rect_mat[0] + rect_mat[2]) > center_x) && (rect_mat[1] < center_y && (rect_mat[1] + rect_mat[3]) > center_y)) {
            return 0
        }
        else {
            return 1
        }
    }

    GetCircleLoc = (angle_mat, radius_mat, point_num = 1000) => {
        // 圆坐标
        let [start_angle, end_angle] = [angle_mat[0], angle_mat[1]]
        let [center_x, center_y, radius_0] = [radius_mat[0], radius_mat[1], radius_mat[2]]
        // 逆时针获取坐标点
        let data_num = point_num     // 数据点数
        let gap_angle = (end_angle - start_angle) / data_num    // 间距
        let loc_x_mat = []
        let loc_y_mat = []
        let all_loc_mat = []
        let decimal_num = 1
        for (let idx = 0; idx < data_num + 1; idx++) {
            let part_angle = (start_angle + gap_angle * idx)
            let part_radian = part_angle / 180 * Math.PI
            let part_x, part_y
            part_x = Math.round((Math.cos(part_radian) * radius_0 + center_x) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            part_y = Math.round((Math.sin(part_radian) * radius_0 + center_y) * Math.pow(10, decimal_num)) / Math.pow(10, decimal_num)
            // if(part_angle>=0 && part_angle<90){
            // }
            // else if(part_angle>=90 && part_angle<180){
            // }
            // else if(part_angle>=180 && part_angle<270){
            // }
            // else if(part_angle>=270 && part_angle<360){
            // }
            if (loc_x_mat.length >= 1) {
                let loc_length = loc_x_mat.length
                if (loc_x_mat[loc_length - 1] != part_x || loc_y_mat[loc_length - 1] != part_y) {
                    // 去重
                    loc_x_mat.push(part_x)
                    loc_y_mat.push(part_y)
                    all_loc_mat.push([part_x, part_y])
                }
            }
            else {
                loc_x_mat.push(part_x)
                loc_y_mat.push(part_y)
                all_loc_mat.push([part_x, part_y])
            }
        }
        // console.log('坐标x，y\n', JSON.stringify(loc_x_mat),'\n',JSON.stringify(loc_y_mat))
        return [loc_x_mat, loc_y_mat, all_loc_mat]
    }

    GetDoubleCircleIntersection = (circle_mat1, circle_mat2) => {
        console.log('=======求解两圆的交点======')
        let [center_x1, center_y1, radius_1] = [circle_mat1[0], circle_mat1[1], circle_mat1[2]];
        let [center_x2, center_y2, radius_2] = [circle_mat2[0], circle_mat2[1], circle_mat2[2]];
        let center_gap = Math.sqrt(Math.pow((center_x1 - center_x2), 2) + Math.pow((center_y1 - center_y2), 2))     // '圆心间距'
        console.log('圆心间距', center_gap)
        if (center_gap < (radius_1 + radius_2)) {
            let length_a = (Math.pow(radius_1, 2) - Math.pow(radius_2, 2) + Math.pow(center_gap, 2)) / (2 * center_gap)    // '圆1的高'
            // console.log('圆1的高', length_a)
            let center_x0 = center_x1 + length_a / center_gap * (center_x2 - center_x1) // 圆心连线与弦交点坐标
            let center_y0 = center_y1 + length_a / center_gap * (center_y2 - center_y1) // 圆心连线与弦交点坐标
            // console.log('连线交点', center_x0, center_y0)
            let half_chord = Math.sqrt(Math.pow(radius_1, 2) - Math.pow(length_a, 2)) // 半弦长
            let local_xc = center_x0 - half_chord / center_gap * (center_y2 - center_y1)    // 交点1
            let local_yc = center_y0 + half_chord / center_gap * (center_x2 - center_x1)
            let local_xd = center_x0 + half_chord / center_gap * (center_y2 - center_y1)    // 交点2
            let local_yd = center_y0 - half_chord / center_gap * (center_x2 - center_x1)
            console.log('相交：两个坐标', local_xc, local_yc, local_xd, local_yd)
            return [[local_xc, local_yc], [local_xd, local_yd]]
        }
        else if (center_gap == (radius_1 + radius_2)) {
            let length_a = (Math.pow(radius_1, 2) - Math.pow(radius_2, 2) + Math.pow(center_gap, 2)) / (2 * center_gap)    // '圆1的高'
            // console.log('圆1的高', length_a)
            let center_x0 = center_x1 + length_a / center_gap * (center_x2 - center_x1) // 圆心连线与弦交点坐标
            let center_y0 = center_y1 + length_a / center_gap * (center_y2 - center_y1) // 圆心连线与弦交点坐标
            // console.log('连线交点', center_x0, center_y0)
            let half_chord = Math.sqrt(Math.pow(radius_1, 2) - Math.pow(length_a, 2)) // 半弦长
            let local_xc = center_x0 - half_chord / center_gap * (center_y2 - center_y1)    // 交点1
            let local_yc = center_y0 + half_chord / center_gap * (center_x2 - center_x1)
            let local_xd = center_x0 + half_chord / center_gap * (center_y2 - center_y1)    // 交点2
            let local_yd = center_y0 - half_chord / center_gap * (center_x2 - center_x1)
            console.log('相切：一个交点', local_xc, local_yc)
            return [[local_xc, local_yc]]
        }
        else {
            console.log('无交点')
            return []
        }
    }

    LineDiscreteData = (point_a, point_b) => {
        // 根据两点求直线离散数据
        // let point_a = [1, 2]
        // let point_b = [3, 5]
        let abc_mat0 = this.Line_ABC(point_a, point_b)
        // console.log('abc_mat0', abc_mat0)
        let abc_mat1 = this.LineABC(point_a, point_b)
        // console.log('abc_mat1', abc_mat1)
        let loc_x_mat = []
        let loc_y_mat = []
        let loc_all_mat = []
        let pixle_gap = 0.1
        if (abc_mat0[0] == 0) {
            //  横线
            let min_x = Math.min(point_a[0], point_b[0])
            let max_x = Math.max(point_a[0], point_b[0])
            for (let idx = 0; idx < (max_x - min_x) / pixle_gap + 1; idx++) {
                loc_x_mat.push(Math.round((min_x + idx * pixle_gap) * 10) / 10)
                loc_y_mat.push(point_a[1])
                loc_all_mat.push([Math.round((min_x + idx * pixle_gap) * 10) / 10, point_a[1]])
            }
        }
        else if (abc_mat1[1] == 0) {
            // 竖线
            let min_y = Math.min(point_a[1], point_b[1])
            let max_y = Math.max(point_a[1], point_b[1])
            for (let idx = 0; idx < (max_y - min_y) / pixle_gap + 1; idx++) {
                loc_x_mat.push(point_a[0])
                loc_y_mat.push(Math.round((min_y + idx * pixle_gap) * 10) / 10)
                loc_all_mat.push([point_a[0], Math.round((min_y + idx * pixle_gap) * 10) / 10])
            }
        }
        else {
            // 斜线
            let min_x = Math.min(point_a[0], point_b[0])
            let max_x = Math.max(point_a[0], point_b[0])
            let min_y = Math.min(point_a[1], point_b[1])
            let max_y = Math.max(point_a[1], point_b[1])
            let part_x, part_y
            if ((max_x - min_x) >= (max_y - min_y)) {
                // 横轴长，
                for (let idx = 0; idx < (max_x - min_x) / pixle_gap + 1; idx++) {
                    part_x = Math.round((min_x + idx * pixle_gap) * 10) / 10
                    part_y = Math.round((part_x * abc_mat0[0] + abc_mat0[2]) * 10) / 10
                    loc_x_mat.push(part_x)
                    loc_y_mat.push(-part_y)
                    loc_all_mat.push([part_x, -part_y])
                }
            }
            else {
                // 纵轴长，
                for (let idx = 0; idx < (max_y - min_y) / pixle_gap + 1; idx++) {
                    part_y = Math.round((min_y + idx * pixle_gap) * 10) / 10
                    part_x = Math.round(((part_y + abc_mat0[2]) / abc_mat0[0]) * 10) / 10
                    loc_x_mat.push(-part_x)
                    loc_y_mat.push(part_y)
                    loc_all_mat.push([-part_x, part_y])
                }
            }
        }
        // console.log('loc_x_mat', JSON.stringify(loc_x_mat))
        // console.log('loc_y_mat', JSON.stringify(loc_y_mat))
        // console.log('loc_all_mat', JSON.stringify(loc_all_mat))
        return [loc_x_mat, loc_y_mat, loc_all_mat]
    }

    PointRotate = (fixed_point, rotate_point, rotate_angle) => {
        // 坐标点绕点旋转、顺时针、逆时针:顺时针添加负号
        // 固定点、旋转点、旋转角度
        // 顺时针
        let rotate_radian = rotate_angle / 180 * Math.PI
        // console.log('=========',fixed_point, rotate_point, rotate_radian)
        let new_x0 = (rotate_point[0] - fixed_point[0]) * Math.cos(-rotate_radian) - (rotate_point[1] - fixed_point[1]) * Math.sin(-rotate_radian) + fixed_point[0]
        let new_y0 = (rotate_point[0] - fixed_point[0]) * Math.sin(-rotate_radian) + (rotate_point[1] - fixed_point[1]) * Math.cos(-rotate_radian) + fixed_point[1]
        // console.log('======new_x0',new_x0)
        // 逆时针
        let new_x1 = (rotate_point[0] - fixed_point[0]) * Math.cos(rotate_radian) - (rotate_point[1] - fixed_point[1]) * Math.sin(rotate_radian) + fixed_point[0]
        let new_y1 = (rotate_point[0] - fixed_point[0]) * Math.sin(rotate_radian) + (rotate_point[1] - fixed_point[1]) * Math.cos(rotate_radian) + fixed_point[1]
        return [Math.round(new_x0 * 100) / 100, Math.round(new_y0 * 100) / 100,]
    }

    RegularPolygonMat = (side_num, [center_x, center_y], [init_x, init_y]) => {
        // 正多边形求坐标
        // let [center_x, center_y] = [50, 50]
        // let [init_x,init_y] = [50, 10]
        let regular_polygon_mat = []
        let angle_gap = 360 / side_num
        for (let idx = 0; idx < side_num; idx++) {
            if (idx == 0) {
                regular_polygon_mat.push([init_x, init_y])
            }
            else {
                let rotate_angle = angle_gap * idx
                let part_loc = this.PointRotate([center_x, center_y], [init_x, init_y], rotate_angle)
                regular_polygon_mat.push(part_loc)
            }
        }
        // console.log('正多边形坐标', regular_polygon_mat)
        return regular_polygon_mat
    }

    ApproximateEvaluationPI = (side_num, [center_x, center_y], [init_x, init_y]) => {
        // 近似求PI
        console.log('基础值', side_num, [center_x, center_y], [init_x, init_y])
        let angle_gap = 360 / side_num
        let circumcircle_radius = Math.sqrt((center_x - init_x) * (center_x - init_x) + (center_y - init_y) * (center_y - init_y))
        console.log('外接圆半径', circumcircle_radius)
        let [new_x0, new_y0] = this.PointRotate2([center_x, center_y], [init_x, init_y], angle_gap)
        console.log('[new_x0, new_y0]', [new_x0, new_y0])
        // let side_length = Math.sin(angle_gap/2/180*Math.PI)*circumcircle_radius*2       // 此处Math.PI有自证嫌疑，可转换为角度求正弦
        let side_length = Math.sqrt(Math.pow(init_x - new_x0, 2) + Math.pow(init_y - new_y0, 2))
        console.log('边长', side_length)
        let all_length = side_num * side_length
        console.log('总边长', all_length)
        let calculator_pi = all_length / (2 * circumcircle_radius)
        console.log('近似求π', calculator_pi)
        return calculator_pi
    }

    PointRotate2 = (fixed_point, rotate_point, rotate_angle) => {
        // 坐标点绕点旋转、顺时针、逆时针:顺时针添加负号
        // 固定点、旋转点、旋转角度
        // 顺时针
        let rotate_radian = rotate_angle / 180 * Math.PI
        let new_x0 = (rotate_point[0] - fixed_point[0]) * Math.cos(-rotate_radian) - (rotate_point[1] - fixed_point[1]) * Math.sin(-rotate_radian) + fixed_point[0]
        let new_y0 = (rotate_point[0] - fixed_point[0]) * Math.sin(-rotate_radian) + (rotate_point[1] - fixed_point[1]) * Math.cos(-rotate_radian) + fixed_point[1]
        return [new_x0, new_y0]
    }

    PolygonDiscreteData = (polygon_point_mat) => {
        // 多边形离散数据
        let all_line_discrete = []
        for (let idx = 0; idx < polygon_point_mat.length; idx++) {
            let single_side_point = []
            if (idx == polygon_point_mat.length - 1) {
                single_side_point = this.LineDiscreteData(polygon_point_mat[idx], polygon_point_mat[0])
            }
            else {
                single_side_point = this.LineDiscreteData(polygon_point_mat[idx], polygon_point_mat[idx + 1])
            }
            all_line_discrete.push(single_side_point[2])
        }

        let flat_all_line = all_line_discrete.flat()
        // console.log('all_line_discrete',all_line_discrete.length, JSON.stringify(all_line_discrete))
        // console.log('flat_all_line', JSON.stringify(flat_all_line))
        // return flat_all_line
        // 按照每条线
        return all_line_discrete

    }

    MoveMat = (init_mat, move_mat) => {
        // 矩阵移动
        let new_mat = []
        for (let idx = 0; idx < init_mat.length; idx++) {
            new_mat.push([init_mat[idx][0] + move_mat[0], init_mat[idx][1] + move_mat[1]])
        }
        return new_mat
    }

    DoubleAreaIntersection = (fixed_mat1, moved_mat1) => {
        // 获取
        let fixed_discrete = this.PolygonDiscreteData(fixed_mat1)
        // console.log('fixed_discrete', fixed_discrete.length, JSON.stringify(fixed_discrete))
        let moved_discrete = this.PolygonDiscreteData(moved_mat1)
        // console.log('moved_discrete', moved_discrete.length, JSON.stringify(moved_discrete))
        let move_in_fixed_mat = this.PointMatInArea(fixed_mat1, moved_discrete)
        let fixed_in_move_mat = this.PointMatInArea(moved_mat1, fixed_discrete)
        let m_in_f = []     // 提取端点
        let f_in_m = []
        if (move_in_fixed_mat.length > 0) {
            for (let idx = 0; idx < move_in_fixed_mat.length; idx++) {
                // m_in_f.push(move_in_fixed_mat[idx][0])
                // m_in_f.push(move_in_fixed_mat[idx][move_in_fixed_mat[idx].length-1])
                m_in_f.push([move_in_fixed_mat[idx][0],
                    move_in_fixed_mat[idx][move_in_fixed_mat[idx].length - 1]])
            }
        }
        if (fixed_in_move_mat.length > 0) {
            for (let idx = 0; idx < fixed_in_move_mat.length; idx++) {
                // f_in_m.push(fixed_in_move_mat[idx][0])
                // f_in_m.push(fixed_in_move_mat[idx][fixed_in_move_mat[idx].length-1])
                f_in_m.push([fixed_in_move_mat[idx][0], fixed_in_move_mat[idx][fixed_in_move_mat[idx].length - 1]])
            }
        }
        console.log('端点情况', JSON.stringify(m_in_f), '\n', JSON.stringify(f_in_m))
        // 由于任何一个图形存在起始和终止点，分别寻找开头，和下一个点的开头结尾匹配
        if (m_in_f.length > 0 && f_in_m.length > 0) {
            // 存在相交关系;无包含情况
            console.log('=====组合点======')
            let m_in_f_idx = []     // m_in_f索引
            let f_in_m_idx = []     // f_in_m索引
            let mf_idx = []
            let all_idx = []        // 看组
            let in_idx = []         // 看前后
            let start_point = m_in_f[0][0]
            let end_point = m_in_f[0][1]
            m_in_f_idx.push(0)      // 第一组
            all_idx.push(0)         //
            in_idx.push(0)          // 顺序
            mf_idx.push(0)
            let find_num = 0
            while (1) {
                // console.log('=======找move组')
                for (let idx = 0; idx < m_in_f.length; idx++) {
                    if (m_in_f_idx.indexOf(idx) < 0) {
                        // 未使用过，进行判定
                        // console.log('move未使用点', m_in_f[idx], end_point)
                        if (Math.abs(m_in_f[idx][0][0] - end_point[0]) <= 1 &&
                            Math.abs(m_in_f[idx][0][1] - end_point[1]) <= 1) {
                            // 某个开头的点
                            m_in_f_idx.push(idx)
                            all_idx.push(0)
                            in_idx.push(0)
                            end_point = m_in_f[idx][1]
                            mf_idx.push(idx)
                        }
                        else if (Math.abs(m_in_f[idx][1][0] - end_point[0]) <= 1 &&
                            Math.abs(m_in_f[idx][1][1] - end_point[1]) <= 1) {
                            // 某个结尾的点
                            m_in_f_idx.push(idx)
                            all_idx.push(0)
                            in_idx.push(1)      // 逆序
                            end_point = m_in_f[idx][0]
                            mf_idx.push(idx)
                        }
                    }
                }
                // console.log('=======找fixed组')
                for (let idx = 0; idx < f_in_m.length; idx++) {
                    if (f_in_m_idx.indexOf(idx) < 0) {
                        // 未使用过，进行判定
                        // console.log('fixed未使用点', f_in_m[idx], end_point)
                        if (Math.abs(f_in_m[idx][0][0] - end_point[0]) <= 1 &&
                            Math.abs(f_in_m[idx][0][1] - end_point[1]) <= 1) {
                            // 某个开头的点
                            f_in_m_idx.push(idx)
                            all_idx.push(1)
                            in_idx.push(0)
                            end_point = f_in_m[idx][1]
                            mf_idx.push(idx)
                        }
                        else if (Math.abs(f_in_m[idx][1][0] - end_point[0]) <= 1 &&
                            Math.abs(f_in_m[idx][1][1] - end_point[1]) <= 1) {
                            // 某个结尾的点
                            f_in_m_idx.push(idx)
                            all_idx.push(1)
                            in_idx.push(1)      // 逆序
                            end_point = f_in_m[idx][0]
                            mf_idx.push(idx)
                        }
                    }
                }

                if (all_idx.length >= (m_in_f.length + f_in_m.length)) {
                    break
                }
                find_num += 1
                if (find_num > 10) {
                    break
                }
                // console.log('find_num', find_num)
            }
            console.log('组合排序', m_in_f_idx, f_in_m_idx, all_idx, in_idx, mf_idx)
            // 组合数据
            let combine_point_mat = []
            let part_point_mat
            for (let idx = 0; idx < all_idx.length; idx++) {
                //
                if (all_idx[idx] == 0) {
                    part_point_mat = move_in_fixed_mat[mf_idx[idx]]     // 提取点
                    if (in_idx[idx] == 0) {
                        // 顺序存储
                        combine_point_mat.push(part_point_mat)
                    }
                    else {
                        combine_point_mat.push(part_point_mat.reverse())
                    }
                }
                else if (all_idx[idx] == 1) {
                    part_point_mat = fixed_in_move_mat[mf_idx[idx]]     // 提取点
                    if (in_idx[idx] == 0) {
                        // 顺序存储
                        combine_point_mat.push(part_point_mat)
                    }
                    else {
                        combine_point_mat.push(part_point_mat.reverse())
                    }
                }
            }
            // console.log('组合翻转点', JSON.stringify(combine_point_mat))
            return combine_point_mat.flat()
        }
        else {
            return [[]]
        }
    }

    PointMatInArea = (polygon_mat, discrete_mat0) => {
        // 判定一个离散点在区域内
        let in_area_mat = []
        let part_area_mat = []
        // 按照每条线
        for (let idx_ii = 0; idx_ii < discrete_mat0.length; idx_ii++) {
            let discrete_mat = discrete_mat0[idx_ii]
            // console.log('单条线idx_ii', idx_ii, JSON.stringify(discrete_mat))
            for (let idx = 0; idx < discrete_mat.length; idx++) {
                if (this.JudgePointInArea(polygon_mat, discrete_mat[idx]) >= 1) {
                    part_area_mat.push(discrete_mat[idx])
                }
                else {
                    if (part_area_mat.length > 0) {
                        in_area_mat.push(part_area_mat)
                        part_area_mat = []
                    }
                }
            }
            if (part_area_mat.length > 0) {
                in_area_mat.push(part_area_mat)
                part_area_mat = []
            }
        }

        // console.log('区域内点', JSON.stringify(in_area_mat))
        return in_area_mat
    }

    CirclePointMat = (circle_mat) => {
        // 获取圆边数据
        let angle_mat = [0, 360]
        let circle_points_mat = this.GetCircleLoc(angle_mat, circle_mat)
        return [circle_points_mat[2]]
    }

    PointMatInCircle = (circle_mat, discrete_mat0) => {
        // 判定一个离散点在区域内
        let in_area_mat = []
        let part_area_mat = []
        // 按照每条线
        for (let idx_ii = 0; idx_ii < discrete_mat0.length; idx_ii++) {
            let discrete_mat = discrete_mat0[idx_ii]
            // console.log('单条线idx_ii', idx_ii, JSON.stringify(discrete_mat))
            for (let idx = 0; idx < discrete_mat.length; idx++) {
                if (((discrete_mat[idx][0] - circle_mat[0]) * (discrete_mat[idx][0] - circle_mat[0]) +
                    (discrete_mat[idx][1] - circle_mat[1]) * (discrete_mat[idx][1] - circle_mat[1])) <= ((circle_mat[2]) * (circle_mat[2]))) {
                    part_area_mat.push(discrete_mat[idx])
                }
                else {
                    if (part_area_mat.length > 0) {
                        in_area_mat.push(part_area_mat)
                        part_area_mat = []
                    }
                }
            }
            if (part_area_mat.length > 0) {
                in_area_mat.push(part_area_mat)
                part_area_mat = []
            }
        }

        // console.log('区域内点', JSON.stringify(in_area_mat))
        return in_area_mat
    }

    PolygonCircleIntersection = (circle_mat, polygon_mat) => {
        // 获取
        let fixed_discrete = this.CirclePointMat(circle_mat)
        // console.log('fixed_discrete', fixed_discrete.length, JSON.stringify(fixed_discrete))
        let moved_discrete = this.PolygonDiscreteData(polygon_mat)
        // console.log('moved_discrete', moved_discrete.length, JSON.stringify(moved_discrete))
        let move_in_fixed_mat = this.PointMatInCircle(circle_mat, moved_discrete)
        let fixed_in_move_mat = this.PointMatInArea(polygon_mat, fixed_discrete)
        let m_in_f = []     // 提取端点
        let f_in_m = []
        if (move_in_fixed_mat.length > 0) {
            for (let idx = 0; idx < move_in_fixed_mat.length; idx++) {
                // m_in_f.push(move_in_fixed_mat[idx][0])
                // m_in_f.push(move_in_fixed_mat[idx][move_in_fixed_mat[idx].length-1])
                m_in_f.push([move_in_fixed_mat[idx][0],
                    move_in_fixed_mat[idx][move_in_fixed_mat[idx].length - 1]])
            }
        }
        if (fixed_in_move_mat.length > 0) {
            for (let idx = 0; idx < fixed_in_move_mat.length; idx++) {
                // f_in_m.push(fixed_in_move_mat[idx][0])
                // f_in_m.push(fixed_in_move_mat[idx][fixed_in_move_mat[idx].length-1])
                f_in_m.push([fixed_in_move_mat[idx][0], fixed_in_move_mat[idx][fixed_in_move_mat[idx].length - 1]])
            }
        }
        console.log('端点情况', JSON.stringify(m_in_f), '\n', JSON.stringify(f_in_m))
        // 由于任何一个图形存在起始和终止点，分别寻找开头，和下一个点的开头结尾匹配
        if (m_in_f.length > 0 && f_in_m.length > 0) {
            // 存在相交关系;无包含情况
            console.log('=====组合点======')
            let m_in_f_idx = []     // m_in_f索引
            let f_in_m_idx = []     // f_in_m索引
            let mf_idx = []
            let all_idx = []        // 看组
            let in_idx = []         // 看前后
            let start_point = m_in_f[0][0]
            let end_point = m_in_f[0][1]
            m_in_f_idx.push(0)      // 第一组
            all_idx.push(0)         //
            in_idx.push(0)          // 顺序
            mf_idx.push(0)
            let find_num = 0
            while (1) {
                // console.log('=======找move组')
                for (let idx = 0; idx < m_in_f.length; idx++) {
                    if (m_in_f_idx.indexOf(idx) < 0) {
                        // 未使用过，进行判定
                        // console.log('move未使用点', m_in_f[idx], end_point)
                        if (Math.abs(m_in_f[idx][0][0] - end_point[0]) <= 1 &&
                            Math.abs(m_in_f[idx][0][1] - end_point[1]) <= 1) {
                            // 某个开头的点
                            m_in_f_idx.push(idx)
                            all_idx.push(0)
                            in_idx.push(0)
                            end_point = m_in_f[idx][1]
                            mf_idx.push(idx)
                        }
                        else if (Math.abs(m_in_f[idx][1][0] - end_point[0]) <= 1 &&
                            Math.abs(m_in_f[idx][1][1] - end_point[1]) <= 1) {
                            // 某个结尾的点
                            m_in_f_idx.push(idx)
                            all_idx.push(0)
                            in_idx.push(1)      // 逆序
                            end_point = m_in_f[idx][0]
                            mf_idx.push(idx)
                        }
                    }
                }
                // console.log('=======找fixed组')
                for (let idx = 0; idx < f_in_m.length; idx++) {
                    if (f_in_m_idx.indexOf(idx) < 0) {
                        // 未使用过，进行判定
                        // console.log('fixed未使用点', f_in_m[idx], end_point)
                        if (Math.abs(f_in_m[idx][0][0] - end_point[0]) <= 1 &&
                            Math.abs(f_in_m[idx][0][1] - end_point[1]) <= 1) {
                            // 某个开头的点
                            f_in_m_idx.push(idx)
                            all_idx.push(1)
                            in_idx.push(0)
                            end_point = f_in_m[idx][1]
                            mf_idx.push(idx)
                        }
                        else if (Math.abs(f_in_m[idx][1][0] - end_point[0]) <= 1 &&
                            Math.abs(f_in_m[idx][1][1] - end_point[1]) <= 1) {
                            // 某个结尾的点
                            f_in_m_idx.push(idx)
                            all_idx.push(1)
                            in_idx.push(1)      // 逆序
                            end_point = f_in_m[idx][0]
                            mf_idx.push(idx)
                        }
                    }
                }

                if (all_idx.length >= (m_in_f.length + f_in_m.length)) {
                    break
                }
                find_num += 1
                if (find_num > 10) {
                    break
                }
                // console.log('find_num', find_num)
            }
            console.log('组合排序', m_in_f_idx, f_in_m_idx, all_idx, in_idx, mf_idx)
            // 组合数据
            let combine_point_mat = []
            let part_point_mat
            for (let idx = 0; idx < all_idx.length; idx++) {
                //
                if (all_idx[idx] == 0) {
                    part_point_mat = move_in_fixed_mat[mf_idx[idx]]     // 提取点
                    if (in_idx[idx] == 0) {
                        // 顺序存储
                        combine_point_mat.push(part_point_mat)
                    }
                    else {
                        combine_point_mat.push(part_point_mat.reverse())
                    }
                }
                else if (all_idx[idx] == 1) {
                    part_point_mat = fixed_in_move_mat[mf_idx[idx]]     // 提取点
                    if (in_idx[idx] == 0) {
                        // 顺序存储
                        combine_point_mat.push(part_point_mat)
                    }
                    else {
                        combine_point_mat.push(part_point_mat.reverse())
                    }
                }
            }
            // console.log('组合翻转点', JSON.stringify(combine_point_mat))
            return combine_point_mat.flat()
        }
        else {
            return [[]]
        }
    }

    SingleGraphSplitProcess000(init_loc_mat, cut_line_mat, init_split_mat) {
        //  单组图像分割处理
        // init_loc_mat, 单图数据处理
        // cut_line_mat, 分割线
        // 先获得分割线图像情况
        let [common_line, intersection_point, intersection_idx] = this.AllLineIntersection2(init_loc_mat, cut_line_mat)
        //  组合新数组
        let new_loc_mat = []
        // 一条直线只能分成两个部分
        if (intersection_point.length == 2) {
            // 两个交点
            let new_part_1 = []
            let new_part_2 = []
            let turn_flag = 0
            for (let idx = 0; idx < init_loc_mat.length; idx++) {
                if (intersection_idx[idx] == 1 && turn_flag == 0) {
                    // 有相交索引---初次
                    turn_flag = 1
                    new_part_1.push(init_loc_mat[idx])
                    new_part_1.push(intersection_point[0])
                    new_part_2.push(intersection_point[0])
                }
                else if (intersection_idx[idx] == 0 && turn_flag == 1) {
                    // 无相交索引---初次
                    new_part_2.push(init_loc_mat[idx])
                }
                else if (intersection_idx[idx] == 1 && turn_flag == 1) {
                    // 有相交索引---第二次
                    turn_flag = 0
                    new_part_1.push(intersection_point[1])
                    new_part_2.push(init_loc_mat[idx])
                    new_part_2.push(intersection_point[1])
                }
                else {
                    // 无相交索引---初次
                    new_part_1.push(init_loc_mat[idx])
                }
            }
            // console.log('new_part_1', new_part_1)
            // console.log('new_part_2', new_part_2)
            new_loc_mat.push(new_part_1)
            new_loc_mat.push(new_part_2)
        }
        else {
            // 单组
            new_loc_mat.push(init_loc_mat)
        }

        // 分离组
        // 注意分割两组的情况使用
        let line_abc_mat = this.Line_ABC(cut_line_mat[0], cut_line_mat[1])
        // console.log('切割线ABC', line_abc_mat)
        let splite_loc_mat = []
        let all_move_x = 500    // 整体移动
        if (intersection_point.length == 2) {
            let cut_center_x = (intersection_point[0][0] + intersection_point[1][0]) / 2
            let cut_center_y = (intersection_point[0][1] + intersection_point[1][1]) / 2
            // console.log('切线中心', cut_center_x, cut_center_y)
            if (Math.abs(line_abc_mat[0]) >= 1) {
                // 左右分割
                for (let idx = 0; idx < new_loc_mat.length; idx++) {
                    let part_loc_mat = []   // 定义新的坐标点
                    // 先判定每组的移动情况
                    let part_sum_x = 0
                    let part_sum_y = 0
                    for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                        part_sum_x += new_loc_mat[idx][idx_ii][0]
                        part_sum_y += new_loc_mat[idx][idx_ii][1]
                    }
                    let part_sum_center_x = part_sum_x / new_loc_mat[idx].length
                    let part_sum_center_y = part_sum_y / new_loc_mat[idx].length
                    // console.log('分组求和', part_sum_x, part_sum_y,part_sum_center_x,part_sum_center_y)
                    if (part_sum_center_x < cut_center_x) {
                        // 左移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] - 5 * (5 - cut_line_num) + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1]
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    else {
                        // 右移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + 5 * (5 - cut_line_num) + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1]
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    splite_loc_mat.push(part_loc_mat)
                }
            }
            else {
                // 上下分割
                for (let idx = 0; idx < new_loc_mat.length; idx++) {
                    let part_loc_mat = []   // 定义新的坐标点
                    // 先判定每组的移动情况
                    let part_sum_x = 0
                    let part_sum_y = 0
                    for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                        part_sum_x += new_loc_mat[idx][idx_ii][0]
                        part_sum_y += new_loc_mat[idx][idx_ii][1]
                    }
                    let part_sum_center_x = part_sum_x / new_loc_mat[idx].length
                    let part_sum_center_y = part_sum_y / new_loc_mat[idx].length
                    // console.log('分组求和', part_sum_x, part_sum_y,part_sum_center_x,part_sum_center_y)
                    if (part_sum_center_y < cut_center_y) {
                        // 左移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1] - 5 * (5 - cut_line_num)
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    else {
                        // 右移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1] + 5 * (5 - cut_line_num)
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    splite_loc_mat.push(part_loc_mat)
                }
            }
        }
        else {
            splite_loc_mat.push(init_split_mat)
        }
        // 单组分离数组
        return [new_loc_mat, splite_loc_mat]
    }

    SingleGraphSplitProcess(init_loc_mat, cut_line_mat, init_split_mat) {
        //  单组图像分割处理
        // init_loc_mat, 单图数据处理
        // cut_line_mat, 分割线
        // 先获得分割线图像情况
        let [common_line, intersection_point, intersection_idx] = this.AllLineIntersection2(init_loc_mat, cut_line_mat)
        let cut_line_num = 0
        //  组合新数组
        let new_loc_mat = []
        // 一条直线只能分成两个部分
        if (intersection_point.length == 2) {
            // 两个交点
            let new_part_1 = []
            let new_part_2 = []
            let turn_flag = 0
            for (let idx = 0; idx < init_loc_mat.length; idx++) {
                if (intersection_idx[idx] == 1 && turn_flag == 0) {
                    // 有相交索引---初次
                    turn_flag = 1
                    new_part_1.push(init_loc_mat[idx])
                    new_part_1.push(intersection_point[0])
                    new_part_2.push(intersection_point[0])
                }
                else if (intersection_idx[idx] == 0 && turn_flag == 1) {
                    // 无相交索引---初次
                    new_part_2.push(init_loc_mat[idx])
                }
                else if (intersection_idx[idx] == 1 && turn_flag == 1) {
                    // 有相交索引---第二次
                    turn_flag = 0
                    new_part_1.push(intersection_point[1])
                    new_part_2.push(init_loc_mat[idx])
                    new_part_2.push(intersection_point[1])
                }
                else {
                    // 无相交索引---初次
                    new_part_1.push(init_loc_mat[idx])
                }
            }
            // console.log('new_part_1', new_part_1)
            // console.log('new_part_2', new_part_2)
            new_loc_mat.push(new_part_1)
            new_loc_mat.push(new_part_2)
        }
        else {
            // 单组
            new_loc_mat.push(init_loc_mat)
        }

        // 分离组
        // 注意分割两组的情况使用
        let line_abc_mat = this.Line_ABC(cut_line_mat[0], cut_line_mat[1])
        // console.log('切割线ABC', line_abc_mat)
        let splite_loc_mat = []
        let all_move_x = 500    // 整体移动
        if (intersection_point.length == 2) {
            let cut_center_x = (intersection_point[0][0] + intersection_point[1][0]) / 2
            let cut_center_y = (intersection_point[0][1] + intersection_point[1][1]) / 2
            // console.log('切线中心', cut_center_x, cut_center_y)
            if (Math.abs(line_abc_mat[0]) >= 1) {
                // 左右分割
                for (let idx = 0; idx < new_loc_mat.length; idx++) {
                    let part_loc_mat = []   // 定义新的坐标点
                    // 先判定每组的移动情况
                    let part_sum_x = 0
                    let part_sum_y = 0
                    for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                        part_sum_x += new_loc_mat[idx][idx_ii][0]
                        part_sum_y += new_loc_mat[idx][idx_ii][1]
                    }
                    let part_sum_center_x = part_sum_x / new_loc_mat[idx].length
                    let part_sum_center_y = part_sum_y / new_loc_mat[idx].length
                    // console.log('分组求和', part_sum_x, part_sum_y,part_sum_center_x,part_sum_center_y)
                    if (part_sum_center_x < cut_center_x) {
                        // 左移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] - 0 * (5 - cut_line_num) + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1]
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    else {
                        // 右移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + 5 * (5 - cut_line_num) + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1]
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    splite_loc_mat.push(part_loc_mat)
                }
            }
            else {
                // 上下分割---只按照一个方向移动
                for (let idx = 0; idx < new_loc_mat.length; idx++) {
                    let part_loc_mat = []   // 定义新的坐标点
                    // 先判定每组的移动情况
                    let part_sum_x = 0
                    let part_sum_y = 0
                    for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                        part_sum_x += new_loc_mat[idx][idx_ii][0]
                        part_sum_y += new_loc_mat[idx][idx_ii][1]
                    }
                    let part_sum_center_x = part_sum_x / new_loc_mat[idx].length
                    let part_sum_center_y = part_sum_y / new_loc_mat[idx].length
                    // console.log('分组求和', part_sum_x, part_sum_y,part_sum_center_x,part_sum_center_y)
                    if (part_sum_center_y < cut_center_y) {
                        // 左移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1] - 0 * (5 - cut_line_num)
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    else {
                        // 下移
                        for (let idx_ii = 0; idx_ii < new_loc_mat[idx].length; idx_ii++) {
                            let part_x = new_loc_mat[idx][idx_ii][0] + all_move_x
                            let part_y = new_loc_mat[idx][idx_ii][1] + 5 * (5 - cut_line_num)
                            part_loc_mat.push([part_x, part_y])
                        }
                    }
                    splite_loc_mat.push(part_loc_mat)
                }
            }
        }
        else {
            splite_loc_mat.push(init_split_mat)
        }
        // 单组分离数组
        return [new_loc_mat, splite_loc_mat]
    }

    AllGraphSplitProcess(all_loc_mat, cut_line_mat, all_split_mat) {
        // 整体划分
        let all_loc_mat0 = []
        let all_split_mat0 = []
        for (let idx = 0; idx < all_loc_mat.length; idx++) {
            let [new_loc_mat, splite_loc_mat] = this.SingleGraphSplitProcess(all_loc_mat[idx], cut_line_mat, all_split_mat[idx])
            // console.log('new_loc_mat', new_loc_mat)
            // console.log('splite_loc_mat', splite_loc_mat)
            new_loc_mat.forEach((part_graph_mat) => {
                all_loc_mat0.push(part_graph_mat)
            })
            splite_loc_mat.forEach((part_splite_mat) => {
                all_split_mat0.push(part_splite_mat)
            })
        }
        // console.log('all_loc_mat0',all_loc_mat0.length)
        // console.log('all_split_mat0',all_split_mat0.length)
        return [all_loc_mat0, all_split_mat0]

    }

    SingleGraphNormaliz(loc_mat) {
        //  单幅图像的归一化中心量
        let [center_x, center_y] = this.SingleGraphCenter(loc_mat)
        let new_loc_mat000 = [] // 新坐标
        loc_mat.forEach((part_loc_mat) => {
            let new_loc_x = part_loc_mat[0] - center_x
            let new_loc_y = part_loc_mat[1] - center_y
            new_loc_mat000.push([new_loc_x, new_loc_y])
        })
        return new_loc_mat000
    }

    SingleGraphCenter(loc_mat) {
        //  单幅图像中心
        let sum_x = 0
        let sum_y = 0
        loc_mat.forEach((part_loc_mat) => {
            sum_x += part_loc_mat[0]
            sum_y += part_loc_mat[1]
        })
        let center_x = sum_x / loc_mat.length
        let center_y = sum_y / loc_mat.length
        return [center_x, center_y]
    }

    SingleGraphAmplify(loc_mat, amplify_num) {
        //  单幅图像的放大缩小，基于中心点;loc_mat:原始图像矩阵；amplify_num:放大数值
        let [center_x, center_y] = this.SingleGraphCenter(loc_mat)
        let new_loc_mat002 = this.SingleGraphAmplify2(loc_mat, amplify_num, [center_x, center_y])
        return new_loc_mat002
    }

    SingleGraphAmplify2(loc_mat, amplify_num, base_center) {
        //  以某个基准点放大或缩小
        let new_loc_mat001 = []
        loc_mat.forEach((part_loc_mat) => {
            // 单点缩放
            let part_x = (part_loc_mat[0] - base_center[0]) * amplify_num + base_center[0]
            let part_y = (part_loc_mat[1] - base_center[1]) * amplify_num + base_center[1]
            new_loc_mat001.push([part_x, part_y])
        })
        return new_loc_mat001
    }

    SingleGraphMove(loc_mat, move_mat) {
        //  单幅图像移动
        let new_loc_mat003 = []
        loc_mat.forEach((part_loc) => {
            // console.log('-----------初始-------', part_loc)
            let part_x = part_loc[0] + move_mat[0]
            let part_y = part_loc[1] + move_mat[1]
            // console.log('-----------移动-------', part_x, part_y)
            new_loc_mat003.push([part_x, part_y])
        })
        return new_loc_mat003
    }

    AllGraphAmplify(all_loc_mat, amplify_num, base_center) {
        //  所有图像以基准点放大缩小
        let new_all_loc_mat = []
        all_loc_mat.forEach((part_loc_mat) => {
            let part_new_loc_mat = this.SingleGraphAmplify2(part_loc_mat, amplify_num, base_center)
            new_all_loc_mat.push(part_new_loc_mat)
        })
        return new_all_loc_mat
    }
    AllGraphSingleAmplify(all_loc_mat, amplify_num) {
        //  全不单个图像独立中新缩放
        let new_all_loc_mat = []
        all_loc_mat.forEach((part_loc_mat) => {
            let new_part_loc = this.SingleGraphAmplify(part_loc_mat, amplify_num)
            new_all_loc_mat.push(new_part_loc)
        })
        return new_all_loc_mat
    }

    AllGraphMove(all_loc_mat, move_mat) {
        //  所有图像移动
        let new_all_loc_mat = []
        all_loc_mat.forEach((part_loc_mat) => {
            let part_all_loc = this.SingleGraphMove(part_loc_mat, move_mat)
            new_all_loc_mat.push(part_all_loc)
        })
        return new_all_loc_mat
    }

    CalculatePolygonArea(loc_mat) {
        //  获取多边形面积
        let sum_area = 0
        for (let idx = 0; idx < loc_mat.length; idx++) {
            // 依次计算多边形面积
            let loc_x1 = 0
            let loc_y1 = 0
            let loc_x2 = 0
            let loc_y2 = 0
            if (idx == loc_mat.length - 1) {
                loc_x1 = loc_mat[idx][0]
                loc_y1 = loc_mat[idx][1]
                loc_x2 = loc_mat[0][0]
                loc_y2 = loc_mat[0][1]
            }
            else {
                loc_x1 = loc_mat[idx][0]
                loc_y1 = loc_mat[idx][1]
                loc_x2 = loc_mat[idx + 1][0]
                loc_y2 = loc_mat[idx + 1][1]
            }
            let part_area = (loc_x1 * loc_y2 - loc_y1 * loc_x2) / 2
            sum_area += part_area
        }
        return sum_area
    }

    AllGraphSplitMat = (fixed_loc_mat, new_loc_mat, amplify_num, move_mat) => {
        //  所有图形分离
        // 分离组：处理逻辑，先整体放大倍率、再局部缩小到初始大小、再平移
        // console.log('初始图像坐标---------fixed_loc_mat-----', fixed_loc_mat)
        let init_center_mat = this.SingleGraphCenter(fixed_loc_mat)        // 初始图像中心
        // console.log('-------init_center_mat', init_center_mat)
        let all_amplify_mat = this.AllGraphAmplify(new_loc_mat, amplify_num, init_center_mat)     // 所有放大
        // 遍历缩放
        let all_zoom_mat = this.AllGraphSingleAmplify(all_amplify_mat, 1 / amplify_num)
        // console.log('all_zoom_mat', JSON.stringify(all_zoom_mat))
        // 平移
        let all_move_mat = this.AllGraphMove(all_zoom_mat, move_mat)
        // console.log('all_move_mat', JSON.stringify(all_move_mat))
        return all_move_mat
    }

    FixedGraphSplitMat = (fixed_loc_mat, all_cut_line_mat) => {
        //  初始数组矩阵和切割线矩阵获得新的切割数组
        let init_loc_mat = this.deepClone(fixed_loc_mat, [])
        let init_split_mat = this.deepClone(init_loc_mat, [])
        for (let cut_idx = 0; cut_idx < all_cut_line_mat.length; cut_idx++) {
            //
            let [new_loc_mat, splite_loc_mat] = this.AllGraphSplitProcess(init_loc_mat, all_cut_line_mat[cut_idx], init_split_mat)
            init_loc_mat = this.deepClone(new_loc_mat, [])
            init_split_mat = this.deepClone(splite_loc_mat, [])
        }
        return [init_loc_mat, init_split_mat]
    }

    JudgePointInRaisedArea = (graph_point_mat, point_mat) => {
        //  判定一个点在凸多边形区域内
        let horizontal_line = [[-1000, point_mat[1]], [10000, point_mat[1]]]         // 横向：y不变
        let vertical_line = [[point_mat[0], -1000], [point_mat[0], 10000]]           // 纵向：x不变
        let horizontal_point_mat = this.JudgeLineIntersectArea(graph_point_mat, horizontal_line, point_mat)
        // console.log('横向交点---------------horizontal_point_mat', horizontal_point_mat)
        let horizontal_flag = 0
        if (horizontal_point_mat.length == 2) {
            // 存在两个交点
            if (horizontal_point_mat[0][0] >= point_mat[0] && horizontal_point_mat[1][0] <= point_mat[0]) {
                horizontal_flag = 1
            }
            else if (horizontal_point_mat[0][0] <= point_mat[0] && horizontal_point_mat[1][0] >= point_mat[0]) {
                horizontal_flag = 1
            }
        }
        // console.log('横向内点标识', horizontal_flag)
        let vertical_point_mat = this.JudgeLineIntersectArea(graph_point_mat, vertical_line, point_mat)
        // console.log('纵向交点---------------vertical_point_mat', vertical_point_mat)
        let vertical_flag = 0
        if (vertical_point_mat.length == 2) {
            // 存在两个交点
            if (vertical_point_mat[0][1] >= point_mat[1] && vertical_point_mat[1][1] <= point_mat[1]) {
                vertical_flag = 1
            }
            else if (vertical_point_mat[0][1] <= point_mat[1] && vertical_point_mat[1][1] >= point_mat[1]) {
                vertical_flag = 1
            }
        }
        // console.log('纵向内点标识', vertical_flag)
        if ((horizontal_flag + vertical_flag) == 2) {
            return 1  // 图形内点
        }
        return 0     // 图形外点
    }

    JudgeLineIntersectArea = (graph_point_mat, line_data, point_mat) => {
        //  判断线条与区域的交点
        let intersection_point_mat = []
        for (let idx = 0; idx < graph_point_mat.length; idx++) {
            let graph_line = []
            if (idx == graph_point_mat.length - 1) {
                graph_line.push(graph_point_mat[idx])
                graph_line.push(graph_point_mat[0])
            }
            else {
                graph_line.push(graph_point_mat[idx])
                graph_line.push(graph_point_mat[idx + 1])
            }
            let intersection_mat = this.JudgeLineIntersectionLoc(graph_line, line_data)
            // console.log('intersection_mat', intersection_mat)
            if (intersection_mat[0] === 0 && intersection_mat.length == 3) {
                // 有交点
                if (this.JudgePointInMat(intersection_point_mat, [intersection_mat[1], intersection_mat[2]]) === 0) {
                    intersection_point_mat.push([intersection_mat[1], intersection_mat[2]])
                }
            }
        }
        return intersection_point_mat
    }

    JudgePointInMat = (base_mat, point_mat) => {
        //  判定点在点阵中
        for (let idx = 0; idx < base_mat.length; idx++) {
            if (Math.round(base_mat[idx][0] * 100) === Math.round(point_mat[0] * 100) &&
                Math.round(base_mat[idx][1] * 100) === Math.round(point_mat[1] * 100)) {
                return 1        // 存在相同点
            }
        }
        return 0        // 不存在相同点
    }

    JudgeGraphMatIdx = (graph_mat, point_mat) => {
        //  判定点属图形组
        // console.log('--------')
        let choice_idx_mat = []
        for (let idx = 0; idx < graph_mat.length; idx++) {
            if (this.JudgePointInRaisedArea(graph_mat[idx], point_mat) == 1) {
                choice_idx_mat.push(idx)   // 返回所在图形组索引
            }
        }
        if (choice_idx_mat.length > 0) {
            return choice_idx_mat[choice_idx_mat.length - 1]
        }
        return -1
    }

    JudgeGraphDictIdx = (graph_dict, point_mat, second_key) => {
        //  判定点属图形组
        // second_key:二级key
        // console.log('--------')
        let choice_key_mat = []
        for (let part_key in graph_dict) {
            // for (let idx=0;idx<graph_mat.length;idx++){
            // console.log('字典数据', graph_dict[part_key][second_key])
            if (this.JudgePointInRaisedArea(graph_dict[part_key][second_key], point_mat) == 1) {
                choice_key_mat.push(part_key)   // 返回所在图形组索引
            }
        }
        if (choice_key_mat.length > 0) {
            return choice_key_mat[choice_key_mat.length - 1]
        }
        return -1
    }


    //  求取多边形重心
    TriangleArea = (point_1, point_2, point_3) => {
        //  三角形面积端点求解
        let area = point_1[0] * point_2[1] - point_1[1] * point_2[0] +
            point_2[0] * point_3[1] - point_2[1] * point_3[0] +
            point_3[0] * point_1[1] - point_3[1] * point_1[0]
        return area / 2
    }

    GetPolygonAeraCenter = (graph_point_mat) => {
        // 计算多边形重心
        let sum_x = 0
        let sum_y = 0
        let sum_area = 0
        let point_1 = graph_point_mat[0]
        for (let idx = 1; idx < graph_point_mat.length - 1; idx++) {
            let point_2 = graph_point_mat[idx]
            let point_3 = graph_point_mat[idx + 1]
            let part_area = this.TriangleArea(point_1, point_2, point_3)
            sum_area += part_area
            sum_x += (point_1[0] + point_2[0] + point_3[0]) * part_area
            sum_y += (point_1[1] + point_2[1] + point_3[1]) * part_area
        }

        let center_x = sum_x / sum_area / 3
        let center_y = sum_y / sum_area / 3
        return [center_x, center_y]
    }

    PolygonRotateMat = (graph_mat, center_mat, rotate_angle) => {
        //  图形绕点旋转
        // let [center_x, center_y] = [50, 50]
        // let [init_x,init_y] = [50, 10]
        let regular_polygon_mat = []
        for (let idx = 0; idx < graph_mat.length; idx++) {
            let part_loc = this.PointRotate(center_mat, graph_mat[idx], rotate_angle)
            regular_polygon_mat.push(part_loc)
        }
        // console.log('图形绕点旋转', regular_polygon_mat)
        return regular_polygon_mat
    }

    PolygonZoomMat = (graph_mat, center_mat, amplify_num) => {
        //  图形绕点旋转
        // let [center_x, center_y] = [50, 50]
        // let [init_x,init_y] = [50, 10]
        //    let regular_polygon_mat = []
        //    for (let idx=0;idx<graph_mat.length;idx++){
        //        let part_loc = this.PointRotate(center_mat, graph_mat[idx], rotate_angle)
        //        regular_polygon_mat.push(part_loc)
        //    }
        // console.log('图形绕点旋转', regular_polygon_mat)
        let regular_polygon_mat = this.SingleGraphAmplify2(graph_mat, amplify_num, center_mat)
        return regular_polygon_mat
    }

    PolygonMoveMat = (graph_mat, move_mat) => {
        // 图像移动
        return this.MoveMat(graph_mat, move_mat)
    }

    PointSymmetry = (point_data, line_data) => {
        //    对称点
        let line_abc = this.Line_ABC(line_data[0], line_data[1])
        let point_line_distance = this.PointToLineDistance(line_abc, point_data)
        // console.log('点到直线距离', point_data, line_data, point_line_distance)
        if (this.PointToLineDistance(line_data, point_data) == 0) {
            return point_data
        }
        else {
            let new_line_abc = [line_abc[1], -line_abc[0]]  // 建立垂直斜线关系
            // 求解c
            let new_line_c = -(point_data[0] * new_line_abc[0] + point_data[1] * new_line_abc[1])
            new_line_abc.push(new_line_c)
            // 求解交点
            let intersection_data = this.double_line_intersection(new_line_abc, line_abc)
            // 求解对称点（x1+x2)/2 = x
            let sym_x = intersection_data[1] * 2 - point_data[0]
            let sym_y = intersection_data[2] * 2 - point_data[1]
            return [sym_x, sym_y]
        }
    }

    PloygonSymmetryMat = (graph_mat, sym_line_data) => {
        //    图形对称
        let sym_graph_data = [] // 对称图像
        for (let idx = 0; idx < graph_mat.length; idx++) {
            console.log('----------', graph_mat[idx], sym_line_data)
            sym_graph_data.push(this.PointSymmetry(graph_mat[idx], sym_line_data))
        }
        console.log('----------sym_graph_data', sym_graph_data)
        return sym_graph_data
    }

}

