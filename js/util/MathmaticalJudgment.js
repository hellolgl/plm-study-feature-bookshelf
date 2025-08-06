export const deepClone = (obj, newObj) => {
	// 深度复制
	var newObj = newObj || {};
	for (key in obj) {
		if (typeof obj[key] == 'object') {
			newObj[key] = (obj[key].constructor === Array) ? [] : {}
			deepClone(obj[key], newObj[key]);
		}
		else {
			newObj[key] = obj[key]
		}
	}
	return newObj;
}

export const line_data = (line_mat) => {
	// 分离一条线字符串数字
	var line_mat_2nd = line_mat.split(',')
	var mouse_x = []
	var mouse_y = []
	for (var ii = 0; ii < line_mat_2nd.length / 2; ii++) {
		// 取xy值
		mouse_x[ii] = line_mat_2nd[ii * 2]
		mouse_y[ii] = line_mat_2nd[ii * 2 + 1]
	}
	x_min = Math.min.apply(null, mouse_x)
	x_max = Math.max.apply(null, mouse_x)
	y_min = Math.min.apply(null, mouse_y)
	y_max = Math.max.apply(null, mouse_y)
	x_start = mouse_x[0]
	x_end = mouse_x[mouse_x.length - 1]
	y_start = mouse_y[0]
	y_end = mouse_y[mouse_y.length - 1]
	return [x_min, x_max, y_min, y_max, x_start, x_end, y_start, y_end]
}

export const LineRegionData = (line_mat) => {
	// 获取一条线段的基础数据值：最小、最大、起始、结束端点
	var mouse_x = line_mat[0]
	var mouse_y = line_mat[1]
	x_min = Math.min.apply(null, mouse_x)
	x_max = Math.max.apply(null, mouse_x)
	y_min = Math.min.apply(null, mouse_y)
	y_max = Math.max.apply(null, mouse_y)
	x_start = mouse_x[0]
	x_end = mouse_x[mouse_x.length - 1]
	y_start = mouse_y[0]
	y_end = mouse_y[mouse_y.length - 1]
	return [x_min, x_max, y_min, y_max, x_start, x_end, y_start, y_end]
}


export const GLEsymbol = (all_line_mat) => {
	if(!all_line_mat){
		throw new TypeError('all_line_mat is undifined')
	} 
	//	大小于判断
	var line_1 = []
	// 根据每笔手写数据获取每笔基础数据
	for (var ii = 0; ii < all_line_mat.length; ii++) {
		line_1[ii] = LineRegionData(all_line_mat[ii])
	}
	var judgestr = []
	if (line_1.length == 1) {
		x_min = line_1[0][0]
		x_max = line_1[0][1]
		y_min = line_1[0][2]
		y_max = line_1[0][3]
		x_start = line_1[0][4]
		x_end = line_1[0][5]
		y_start = line_1[0][6]
		y_end = line_1[0][7]
		if ((x_start < x_max) && (x_end < x_max)) {
			judgestr = [0, '>']
		}
		else if ((x_start > x_min) && (x_end > x_min)) {
			judgestr = [1, '<']
		}
	}
	else if (line_1.length == 2) {
		line_k1 = (line_1[0][2] - line_1[0][3]) / (line_1[0][0] - line_1[0][1])
		line_k2 = (line_1[1][2] - line_1[1][3]) / (line_1[1][0] - line_1[1][1])
		if ((line_k1 + line_k2) < 0.3) {
			judgestr = [2, '=']
		}
		else {
			line_end_k = (line_1[1][6] - line_1[1][7]) / (line_1[1][4] - line_1[1][5])
			if (line_1[1][3] > line_1[0][3]) {
				// 判断最大y值，上下区域
				if (line_end_k >= 0) {
					judgestr = [1, '<']
				}
				else {
					judgestr = [0, '>']
				}
			}
			else {
				if (line_end_k >= 0) {
					judgestr = [0, '>']
				}
				else {
					judgestr = [1, '<']
				}
			}
		}
	}
	console.log(judgestr,'judgestr')
	return judgestr
}


export const LineItemEntitled = (all_line_mat, Linemode) => {
	// Linemode ：1表示上下连线、2 表示左右连线、3表示？、4表示？
	//	Linemode = 1
	line_1 = []
	// 根据每笔手写数据获取每笔基础数据
	for (var ii = 0; ii < all_line_mat.length; ii++) {
		line_1[ii] = LineRegionData(all_line_mat[ii])
	}

	if (Linemode == 1) {
		// 上下连线题
		y_midle = (line_1[0][2] + line_1[0][3]) / 2
		//中位数
		for (var ii = 1; ii < line_1.length; ii++) {
			y_midle = Math.round((y_midle * (ii) + (line_1[ii][2] + line_1[ii][3]) / 2) / (ii + 1))
		}
		y_up_mat = []
		y_down_mat = []
		x_up_mat = []
		x_down_mat = []
		for (var ii = 0; ii < line_1.length; ii++) {
			if (line_1[ii][6] < y_midle) {
				y_up_mat[ii] = line_1[ii][2];
				y_down_mat[ii] = line_1[ii][3];
				x_up_mat[ii] = line_1[ii][4];
				x_down_mat[ii] = line_1[ii][5];
			}
			else {
				y_up_mat[ii] = line_1[ii][3];
				y_down_mat[ii] = line_1[ii][2];
				x_up_mat[ii] = line_1[ii][5];
				x_down_mat[ii] = line_1[ii][4];
			}
		}
		// 筛选排序
		// 升序
		newObj1 = []
		newObj2 = []
		var x_up_mat2 = deepClone(x_up_mat, newObj1)
		var x_down_mat2 = deepClone(x_down_mat, newObj2)
		x_up_mat_sort = (x_up_mat2.sort(function (x, y) { return x - y; }));
		x_down_mat_sort = (x_down_mat2.sort(function (x, y) { return x - y; }));
		// 索引
		x_up_mat_index = []
		x_down_mat_index = []
		for (var ii = 0; ii < line_1.length; ii++) {
			x_up_mat_index[ii] = x_up_mat.indexOf(x_up_mat_sort[ii])
			x_down_mat_index[ii] = x_down_mat.indexOf(x_down_mat_sort[ii])
		}
		return validLineData(x_up_mat_index,x_down_mat_index)
	}
	else if (Linemode == 2) {
		// 左右连线题
		x_midle = (line_1[0][0] + line_1[0][1]) / 2
		//中位数
		for (var ii = 1; ii < line_1.length; ii++) {
			x_midle = Math.round((x_midle * (ii) + (line_1[ii][0] + line_1[ii][1]) / 2) / (ii + 1))
		}
		y_left_mat = []
		y_right_mat = []
		x_left_mat = []
		x_right_mat = []
		for (var ii = 0; ii < line_1.length; ii++) {
			if (line_1[ii][4] < x_midle) {
				x_left_mat[ii] = line_1[ii][0];
				x_right_mat[ii] = line_1[ii][1];
				// 笔画端点
				y_left_mat[ii] = line_1[ii][6];
				y_right_mat[ii] = line_1[ii][7];
			}
			else {
				x_left_mat[ii] = line_1[ii][1];
				x_right_mat[ii] = line_1[ii][0];
				// 笔画端点
				y_left_mat[ii] = line_1[ii][7];
				y_right_mat[ii] = line_1[ii][6];
			}
		}
		// 筛选排序
		// 升序
		newObj1 = []
		newObj2 = []
		var y_left_mat2 = deepClone(y_left_mat, newObj1)
		var y_right_mat2 = deepClone(y_right_mat, newObj2)
		y_left_mat_sort = (y_left_mat2.sort(function (x, y) { return x - y; }));
		y_right_mat_sort = (y_right_mat2.sort(function (x, y) { return x - y; }));
		// 索引
		y_left_mat_index = []
		y_right_mat_index = []

		for (var ii = 0; ii < line_1.length; ii++) {
			y_left_mat_index[ii] = y_left_mat.indexOf(y_left_mat_sort[ii])
			y_right_mat_index[ii] = y_right_mat.indexOf(y_right_mat_sort[ii])
		}
		return validLineData(y_left_mat_index,y_right_mat_index)
	}

}

function validLineData (sourceData,targetData){
	if(!sourceData){
		return
	}
	console.log(sourceData,'sourceData')
	console.log(targetData,'targetData')
	let result = new Array();
	sourceData.map((item) =>{
		result.push(targetData.indexOf(item)+1);
	})
	console.log(result,'targetData.findIndex(item)')
	return result;
}


export const DTW_min_dis = (Mat_a, Mat_b, diagonal_factor) => {
	//	字符串分离
	//	Mat_a_xy = Linexymat(Mat_a)
	//	Mat_b_xy = Linexymat(Mat_b)
	//  标准赋值
	var Mat_a_xy = Mat_a
	var Mat_b_xy = Mat_b
	//	Mat_a_xy = [[100, 200, 300, 400], [100, 100, 100, 100]]
	//	Mat_b_xy = [[150, 250, 350, 450], [210, 220, 230, 240]]
	var Mat_ab_dis = []
	for (var ii = 0; ii < Mat_a_xy[0].length; ii++) {
		var mat_a_x0 = Mat_a_xy[0][ii]
		var mat_a_y0 = Mat_a_xy[1][ii]
		var Mat_ab_row = []
		for (var jj = 0; jj < Mat_b_xy[0].length; jj++) {
			var mat_b_x0 = Mat_b_xy[0][jj]
			var mat_b_y0 = Mat_b_xy[1][jj]
			dis_ab = Math.round(Math.sqrt(Math.pow(mat_a_x0 - mat_b_x0, 2) + Math.pow(mat_a_y0 - mat_b_y0, 2)))
			Mat_ab_row[jj] = dis_ab
		}
		Mat_ab_dis[ii] = Mat_ab_row
	}
	// 距离矩阵
	//	Mat_ab_dis=[[3,1,2,3],[2,3,6,2],[3,1,6,4],[4,5,3,3],[2,1,2,1]]
	// 求取最小值
	//	dwt_mat = []
	var dwt_mat = newArray2d(Mat_ab_dis.length, Mat_ab_dis[0].length)
	for (var ii = 0; ii < Mat_ab_dis.length; ii++) {
		for (var jj = 0; jj < Mat_ab_dis[0].length; jj++) {
			if (ii == 0 && jj == 0) {
				dwt_mat[ii][jj] = Mat_ab_dis[ii][jj] * diagonal_factor
			}
			else if (ii == 0 && jj > 0) {
				dwt_mat[ii][jj] = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
			}
			else if (ii > 0 && jj == 0) {
				dwt_mat[ii][jj] = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
			}
			else {
				var dwt_num1 = dwt_mat[ii - 1][jj] + Mat_ab_dis[ii][jj]
				var dwt_num2 = dwt_mat[ii - 1][jj - 1] + Mat_ab_dis[ii][jj] * diagonal_factor
				var dwt_num3 = dwt_mat[ii][jj - 1] + Mat_ab_dis[ii][jj]
				var min_dwt_num = Math.min.apply(null, [dwt_num1, dwt_num2, dwt_num3])
				dwt_mat[ii][jj] = min_dwt_num;
			}
		}
	}
	return dwt_mat[ii - 1][jj - 1]
}


export const Linexymat = (line_mat) => {
	line_mat_2nd = line_mat.split(',')
	mouse_xy = []
	mouse_x = []
	mouse_y = []
	for (var ii = 0; ii < line_mat_2nd.length / 2; ii++) {
		// 取xy值
		mouse_x[ii] = line_mat_2nd[ii * 2]
		mouse_y[ii] = line_mat_2nd[ii * 2 + 1]
	}
	mouse_xy[0] = mouse_x
	mouse_xy[1] = mouse_y
	return mouse_xy
}


export const newArray2d = (rows, cols) => {
	var newarray2d = new Array();
	for (ii = 0; ii < rows; ii++) {
		newarray2d[ii] = new Array();
		for (jj = 0; jj < cols; jj++) {
			newarray2d[ii][jj] = 0;
		}
	}
	return newarray2d;
}


export const InterpolationPoint = (point_1, point_2) => {
	var point_a = [parseInt(point_1[0]), parseInt(point_1[1])]
	var point_b = [parseInt(point_2[0]), parseInt(point_2[1])]
	var inter_x = []
	var inter_y = []
	if ((point_a[0] == point_b[0]) && (point_a[1] == point_b[1])) {
		inter_x[0] = point_a[0]
		inter_y[0] = point_a[1]
	}
	else if (Math.abs(point_a[0] - point_b[0]) >= Math.abs(point_a[1] - point_b[1])) {
		inter_x = JsArange(point_a[0], point_b[0], 1)
		if (point_a[1] != point_b[1]) {
			line_k = (point_a[1] - point_b[1]) / (point_a[0] - point_b[0])
			for (var jj = 0; jj < inter_x.length; jj++) {
				inter_y[jj] = parseInt(line_k * (inter_x[jj] - point_a[0]) + point_a[1])
			}
		}
		else {
			for (var jj = 0; jj < inter_x.length; jj++) {
				inter_y[jj] = point_b[1]
			}
		}
	}
	else {
		inter_y = JsArange(point_a[1], point_b[1], 1)
		if (point_a[0] != point_b[0]) {
			let r_line_k = (point_a[0] - point_b[0]) / (point_a[1] - point_b[1])
			for (var jj = 0; jj < inter_y.length; jj++) {
				inter_x[jj] = parseInt(r_line_k * (inter_y[jj] - point_a[1]) + point_a[0])
			}
		}
		else {
			for (var jj = 0; jj < inter_y.length; jj++) {
				inter_x[jj] = point_b[0]
			}
		}
	}
	var inter_line_mat = []
	inter_line_mat[0] = inter_x
	inter_line_mat[1] = inter_y
	return inter_line_mat
}


export const JsArange = (start_num, end_num, stepnum) => {
	var arange_mat = []
	if (start_num == end_num) {
		arange_mat[0] = start_num
	}
	else {
		if (start_num > end_num) {
			//			var start_ii = 0
			for (var start_ii = 0; start_ii < ((start_num - end_num + 1) / stepnum); start_ii++) {
				arange_mat[start_ii] = start_num - stepnum * start_ii
			}
			if (arange_mat[start_ii - 1] > end_num) {
				arange_mat[start_ii] = end_num
			}
		}
		else {
			for (var start_ii = 0; start_ii < ((end_num - start_num + 1) / stepnum); start_ii++) {
				arange_mat[start_ii] = start_num + stepnum * start_ii
			}
			if (arange_mat[start_ii - 1] < end_num) {
				arange_mat[start_ii] = end_num
			}
		}
	}
	return arange_mat
}


export const DataScale = (line_mat_001, parScale) => {
	// 数据缩放
	var new_line_mat = []
	var new_line_mat_x = []
	var new_line_mat_y = []
	for (var ii = 0; ii < line_mat_001[0].length; ii++) {
		new_line_mat_x[ii] = parseInt(Math.round(line_mat_001[0][ii] * parScale[0]))
		new_line_mat_y[ii] = parseInt(Math.round(line_mat_001[1][ii] * parScale[1]))
	}
	new_line_mat[0] = new_line_mat_x
	new_line_mat[1] = new_line_mat_y
	return new_line_mat
}


export const DataToHeavy = (data_mat) => {
	var new_data_mat = deepClone(data_mat, [])
	var judg_flag = 1
	while (judg_flag == 1) {
		for (var ii = 0; ii < new_data_mat[0].length - 1; ii++) {
			var judg_x0 = new_data_mat[0][ii]
			var judg_y0 = new_data_mat[1][ii]
			var judg_ii = 1
			for (var jj = ii + 1; jj < new_data_mat[0].length; jj++) {
				var judg_x1 = new_data_mat[0][jj]
				var judg_y1 = new_data_mat[1][jj]
				if ((judg_x0 == judg_x1) && (judg_y0 == judg_y1)) {
					new_data_mat[0] = DeleteSeqList(new_data_mat[0], jj)
					new_data_mat[1] = DeleteSeqList(new_data_mat[1], jj)
					judg_ii = 0
					break
				}
			}
			//			&&(ii == new_data_mat[0].length-1)
			if ((judg_ii == 0) && (ii >= new_data_mat[0].length - 1)) {
				judg_flag = 0
				break
			}
		}
	}
	return new_data_mat
}


export const DeleteSeqList = (L, i) => {
	// 删除线性表L中的第i个数据结构
	if (i < 0 || i > L.length) {
		return;
	}
	delete L[i];
	for (var j = i; j < L.length - 1; j++) {
		L[j] = L[j + 1]    // 向左移动
		//      L[i] = L[i+1]
	}
	L.length--;
	return L;
}

export const matInterpolation = (Mat_data) => {
	// 多数据点连续插值
	//	Mat_data =[[1,5,9],[5,3,8]]
	var new_mat_data = [[], []]
	for (var ii = 0; ii < Mat_data[0].length - 1; ii++) {
		var point_1 = [Mat_data[0][ii], Mat_data[1][ii]]
		var point_2 = [Mat_data[0][ii + 1], Mat_data[1][ii + 1]]
		var part_mat = InterpolationPoint(point_1, point_2)
		//		new_mat_data[0].push(part_mat[0].slice(0,part_mat[0].length-1))
		//		new_mat_data[1].push(part_mat[1].slice(0,part_mat[0].length-1))
		for (var jj = 0; jj < part_mat[0].length - 1; jj++) {
			new_mat_data[0].push(part_mat[0][jj])
			new_mat_data[1].push(part_mat[1][jj])
		}
	}
	new_mat_data[0].push(part_mat[0][part_mat[0].length - 1])
	new_mat_data[1].push(part_mat[1][part_mat[0].length - 1])
	return new_mat_data
}


export const BaseDataMate = (char_num) => {
	var char_num_mat = []
	char_num_mat[0] = [[[[50, 0], [0, 100]], [[50, 100], [0, 100]], [[26, 74], [50, 50]]]]
	char_num_mat[1] = [[[[0, 0], [0, 100]], [[0, 25, 50, 25, 5, 25, 50, 25, 0], [0, 10, 25, 40, 50, 60, 75, 90, 100]]],
	[[[0, 0], [0, 100]], [[0, 25, 50, 35, 25, 35, 50, 25, 0], [0, 10, 25, 40, 50, 60, 75, 90, 100]]],
	[[[0, 0], [0, 100]], [[0, 25, 50, 35, 25, 35, 50, 25, 0], [0, 10, 20, 30, 40, 55, 70, 85, 100]]],
	[[[0, 0], [0, 100]], [[9, 35, 40, 40, 36, 27, 50, 70, 60, 10], [2, 3, 6, 16, 23, 28, 34, 57, 92, 100]]]]
	//					 ,[[[0,0],[0,100]],[[10,60,70,50,27,36,40,40,35,9],[0,8,43,66,72,77,84,94,97,98]]]]
	char_num_mat[2] = [[[[70, 20, 0, 20, 70], [0, 12, 50, 88, 100]]]]
	char_num_mat[3] = [[[[0, 0], [0, 100]], [[0, 50, 70, 50, 0], [0, 12, 50, 88, 100]]]]
	// 后期添加处理手写数据
	//	var region_num_mat000 = BaseRegionPro(char_num_mat)
	var region_num_mat = [[], [], [], []]
	region_num_mat[0] = [[0, 100, 0, 100]]
	region_num_mat[1] = [[0, 50, 0, 100], [0, 50, 0, 100], [0, 50, 0, 100], [0, 70, 0, 100], [0, 70, 0, 100]]
	region_num_mat[2] = [[0, 70, 0, 100]]
	region_num_mat[3] = [[0, 70, 0, 100]]
	return [char_num_mat[char_num], region_num_mat[char_num]]
}


export const line_xy_mat = (line_mat) => {
	// 分离一条线字符串数字
	line_mat_2nd = line_mat.split(',')
	var mouse_x = []
	var mouse_y = []
	var line_mat_data = []
	for (var ii = 0; ii < line_mat_2nd.length / 2; ii++) {
		// 取xy值
		mouse_x[ii] = line_mat_2nd[ii * 2]
		mouse_y[ii] = line_mat_2nd[ii * 2 + 1]
		// 按照一条线xy值存储
	}
	//	一条线
	line_mat_data[0] = mouse_x
	line_mat_data[1] = mouse_y
	return line_mat_data
}


export const AllLineRegion = (line_1) => {
	// 书写区域的全局坐标
	var region_mat = []
	var x_min = 1000000
	var x_max = -10
	var y_min = 1000000
	var y_max = -10
	// 这么写效率不高
	for (var ii = 0; ii < line_1.length; ii++) {
		if (line_1[ii][0] < x_min) {
			x_min = line_1[ii][0]
		}
		if (line_1[ii][1] > x_max) {
			x_max = line_1[ii][1]
		}
		if (line_1[ii][2] < y_min) {
			y_min = line_1[ii][2]
		}
		if (line_1[ii][3] > y_max) {
			y_max = line_1[ii][3]
		}
	}
	region_mat[0] = x_min
	region_mat[1] = x_max
	region_mat[2] = y_min
	region_mat[3] = y_max
	return region_mat
}


export const RegionNormalize = (all_line_mat, region_mat) => {
	var new_line_mat = []
	for (var ii = 0; ii < all_line_mat.length; ii++) {
		var part_line = all_line_mat[ii]
		var part_x = MatSub(part_line[0], region_mat[0])
		var part_y = MatSub(part_line[1], region_mat[2])
		new_line_mat[ii] = [part_x, part_y]
	}
	return new_line_mat
}


export const MatSub = (Mat_a, sub_num) => {
	var new_mat = []
	var deep_Mat_a = deepClone(Mat_a, [])
	for (var ii = 0; ii < deep_Mat_a.length; ii++) {
		new_mat[ii] = deep_Mat_a[ii] - sub_num
	}
	return new_mat
}


export const JudgeHWR = (new_line_mat, region_mat) => {
	//	var region_mat = AllLineRegion(new_line_mat)
	var test_x = region_mat[1] - region_mat[0] + 1
	var test_y = region_mat[3] - region_mat[2] + 1
	var test_mat = [test_x, test_y]
	var test_inter_one_mat = AllLineInter(new_line_mat)
	var max_point_num = 400
	var test_sample_data = SamplingData(test_inter_one_mat, max_point_num)
	// Canvasdata(test_inter_one_mat)
	var base_dis_mat = [[], [], [], []]
	for (var base_ii = 0; base_ii < 4; base_ii++) {
		//		var base_char_mat
		var base_char_mat000 = BaseDataMate(base_ii)
		for (var base_jj = 0; base_jj < base_char_mat000[0].length; base_jj++) {
			var base_data_mat = [base_char_mat000[0][base_jj], base_char_mat000[1][base_jj]]
			var mat_dis = DataProcessDis(test_sample_data, base_data_mat, test_mat, max_point_num)
			base_dis_mat[base_ii].push(mat_dis)
		}
	}
	return [base_dis_mat, test_inter_one_mat]
}


export const AllLineInter = (new_line_mat) => {
	var new_line_inter_mat = []
	for (var data_ii = 0; data_ii < new_line_mat.length; data_ii++) {
		var part_inter_mat = []
		part_inter_mat = matInterpolation(new_line_mat[data_ii])
		new_line_inter_mat[data_ii] = part_inter_mat
	}
	var new_inter_one_mat = [[], []]
	//	var new_num = 0
	for (var data_ii = 0; data_ii < new_line_inter_mat.length; data_ii++) {
		var new_part_inter_mat = new_line_inter_mat[data_ii]
		for (var data_jj = 0; data_jj < new_part_inter_mat[0].length; data_jj++) {
			new_inter_one_mat[0].push(new_part_inter_mat[0][data_jj])
			new_inter_one_mat[1].push(new_part_inter_mat[1][data_jj])
		}
	}
	return new_inter_one_mat
}


export const Canvasdata = (Mat_data) => {
	var c = document.getElementById("test");
	var ctx = c.getContext("2d");
	ctx.moveTo(Mat_data[0][0], Mat_data[1][0]);
	for (var canvas_ii = 1; canvas_ii < Mat_data[0].length; canvas_ii++) {
		ctx.lineTo(Mat_data[0][canvas_ii], Mat_data[1][canvas_ii]);
	}

	ctx.stroke();
}


export const SamplingData = (test_inter_one_mat, Data_num) => {
	var sample_mat = [[], []]
	if (test_inter_one_mat[0].length <= Data_num) {
		sample_mat[0] = test_inter_one_mat[0]
		sample_mat[1] = test_inter_one_mat[1]
	}
	else {
		var sample_gap = test_inter_one_mat[0].length / Data_num
		for (var sample_ii = 0; sample_ii < Data_num; sample_ii++) {
			var data_index = parseInt(sample_ii * sample_gap)
			sample_mat[0].push(test_inter_one_mat[0][data_index])
			sample_mat[1].push(test_inter_one_mat[1][data_index])
		}
	}
	return sample_mat
}


export const JudgeSelect = (dis_mat000) => {
	// indexOf
	var dis_mat = []
	for (var judge_ii = 0; judge_ii < 4; judge_ii++) {
		dis_mat[judge_ii] = Math.min.apply(null, dis_mat000[judge_ii])
	}

	var dis_min = Math.min.apply(null, dis_mat);
	var indexOfMin = dis_mat.indexOf(dis_min);

	return indexOfMin
}


export const DataProcessDis = (test_sample_data, base_data_mat, test_mat, max_point_num) => {
	var base_char_mat, base_char_region
	var base_char_mat = base_data_mat[0]
	var base_char_region = base_data_mat[1]
	var base_x = base_char_region[1] - base_char_region[0] + 1
	var base_y = base_char_region[3] - base_char_region[2] + 1
	var scale_x = test_mat[0] / base_x
	var scale_y = test_mat[1] / base_y
	var scale_mat = [scale_x, scale_y]
	var base_data_scale_mat = []
	for (var scale_ii = 0; scale_ii < base_char_mat.length; scale_ii++) {
		var scale_line_mat = []
		scale_line_mat = DataScale(base_char_mat[scale_ii], scale_mat)
		base_data_scale_mat[scale_ii] = scale_line_mat
	}
	// 基础数据点和测试数据点插值// 数据点组合一组
	var base_inter_one_mat = AllLineInter(base_data_scale_mat)
	//	canvas 绘图
	// Canvasdata(base_inter_one_mat)
	var base_sample_data = SamplingData(base_inter_one_mat, max_point_num)
	// 检查相似距离
	var mat_dis = DTW_min_dis(test_sample_data, base_sample_data, 1)
	return mat_dis
}


export const BaseRegionPro = (char_num_mat) => {
	var region_num_mat000 = [[], [], [], []]
	for (var char_ii = 0; char_ii < 4; char_ii++) {
		var par_char_num_mat = char_num_mat[char_ii]
		for (var char_jj = 0; char_jj < par_char_num_mat.length; char_jj++) {
			var part_line = par_char_num_mat[char_jj]
			var part_line_region = []
			for (var char_kk = 0; char_kk < part_line.length; char_kk++) {
				var part_x_min = Math.min.apply(null, part_line[char_kk][0])
				var part_x_max = Math.max.apply(null, part_line[char_kk][0])
				var part_y_min = Math.min.apply(null, part_line[char_kk][1])
				var part_y_max = Math.max.apply(null, part_line[char_kk][1])
				part_line_region[char_kk] = [part_x_min, part_x_max, part_y_min, part_y_max]
			}
			var part_region = AllLineRegion(part_line_region)
			region_num_mat000[char_ii].push(part_region)
		}
	}
	return region_num_mat000
}


export const SelectJudge2nd = (indexOfMin, test_line_mat) => {
	if ((indexOfMin == 1) || (indexOfMin == 3)) {
		// 进入二次判断
		line_x_max = Math.max.apply(null, test_line_mat[0])
		line_y_max = Math.max.apply(null, test_line_mat[1])
		row_y_min = parseInt(line_y_max * 0.1)
		row_y_max = parseInt(line_y_max * 0.9)
		// 根据实际值动态修改
		var judge_num = 3
		for (var ii = 3; ii < test_line_mat[0].length - judge_num; ii++) {
			var point_mat0 = [test_line_mat[0][ii - 3], test_line_mat[1][ii - 3]]
			var point_mat1 = [test_line_mat[0][ii], test_line_mat[1][ii]]
			var point_mat2 = [test_line_mat[0][ii + 3], test_line_mat[1][ii + 3]]
			if ((point_mat1[1] >= row_y_min) && (point_mat1[1] <= row_y_max)) {
				//y区间内
				if ((point_mat1[0] < (point_mat0[0] - judge_num / 2)) &&
					(point_mat1[0] < (point_mat2[0] - judge_num / 2))) {
					indexOfMin = 1
					break
				}
				else {
					indexOfMin = 3
				}
			}
		}
	}
	return indexOfMin
}


export const SelectMainFunc = (all_line_mat) => {
	if(!all_line_mat){
		throw new TypeError('all_line_mat is undifined')
	} 
	//	ABCD选择题
	var line_1 = []
	// 根据每笔手写数据获取每笔基础数据
	for (var ii = 0; ii < all_line_mat.length; ii++) {
		line_1[ii] = LineRegionData(all_line_mat[ii])
	}
	// 取值全局区域min、max
	var region_mat = AllLineRegion(line_1)
	// 书写归一化
	var new_line_data = RegionNormalize(all_line_mat, region_mat)
	// 调取对应数据库对比
	var all_judge_mat = JudgeHWR(new_line_data, region_mat)
	var dis_mat = all_judge_mat[0]
	var indexOfMin = JudgeSelect(dis_mat)
	var test_line_mat = all_judge_mat[1]
	var indexOfMin = SelectJudge2nd(indexOfMin, test_line_mat)
	return indexOfMin
}


export const JudgeABCD = (indexOfMin) => {
	var judgestr
	if (indexOfMin == 0) {
		judgestr = 'A'
	}
	else if (indexOfMin == 1) {
		judgestr = 'B'
	}
	else if (indexOfMin == 2) {
		judgestr = 'C'
	}
	else if (indexOfMin == 3) {
		judgestr = 'D'
	}
	return judgestr
}

//数字判断
export const NumJudge = (linedata) => {
	//	console.log('数字判断')
	//	console.log(one_Line_Numdata[0])
		// 计算每一笔的区域坐标
		var line_region = [] 	
			// 根据每笔手写数据获取每笔基础数据
			for (var ii=0; ii<linedata.length; ii++){
				line_region[ii]=LineRegionData(linedata[ii])
	//		console.log(['区域', line_region[ii]])
			}
		// 计算每一笔的最佳匹配
		var newlinedata=[]
		var rec_one_line_mat = []

		var scale_par
		var scale_axis
		var part_all_mat
		var part_xy_mat

		for (var ii=0; ii<linedata.length; ii++){
			// 数据归一
	//		console.log(['前', linedata[ii]])
				var regionlinedata = RegionNormalize([linedata[ii]],line_region[ii])
				var onelinedata = regionlinedata[0]
	//		console.log(['后', onelinedata])
	//		console.log(['长宽比', line_region[ii][1]-line_region[ii][0]+1, line_region[ii][3]-line_region[ii][2]+1])
			var ratio_xy = (line_region[ii][1]-line_region[ii][0]+1)/(line_region[ii][3]-line_region[ii][2]+1)
			if (ratio_xy>5){
				// 简单 ‘-’判断
				rec_one_line_mat.push(10)
				newlinedata.push(onelinedata)
			}
			else if(ratio_xy<0.2){
				// 简单‘1’判断
				rec_one_line_mat.push(1)
				newlinedata.push(onelinedata)
			}
			else{
				// 数据转换到基准数据同等大小61x61
				if ((line_region[ii][1]-line_region[ii][0]+1)>=(line_region[ii][3]-line_region[ii][2]+1)){
					scale_par = 61/(line_region[ii][1]-line_region[ii][0]+1)
					scale_axis = 0
				}
				else{
					scale_par = 61/(line_region[ii][3]-line_region[ii][2]+1)
					scale_axis = 1
				}
	//			console.log(['缩放系数', scale_par])
	//			scale_par_x = 61/(line_region[ii][1]-line_region[ii][0]+1)
	//			scale_par_y = 61/(line_region[ii][3]-line_region[ii][2]+1)
				var part_x = []
				var part_y = []
				for (var jj=0; jj<onelinedata[0].length; jj++){
	//				console.log(['单点', onelinedata[0].length, onelinedata[0][jj], onelinedata[1][jj]])
					part_x.push(parseInt(Math.ceil((onelinedata[0][jj]+1)*scale_par-1)))
					part_y.push(parseInt(Math.ceil((onelinedata[1][jj]+1)*scale_par-1)))
				}
	//			console.log(['缩放x:', part_x, '缩放y:',part_y])
				// 去重
				var part_x_to_heavy = []
				var part_y_to_heavy = []
				var part_num = 0
				var x_max = Math.max.apply(null, part_x)
				var y_max = Math.max.apply(null, part_y)
	//			console.log(['最大坐标值', x_max, y_max])
				if (scale_axis===0){
					// x方向满，平移y
					part_x_to_heavy.push(part_x[0])
					part_y_to_heavy.push(part_y[0]+(30-parseInt(y_max/2)))
				}
				else{
					// y方向满，平移x
					part_x_to_heavy.push(part_x[0]+(30-parseInt(x_max/2)))
					part_y_to_heavy.push(part_y[0])
				}
				for (var jj=1; jj<part_x.length; jj++){
					if((part_x[jj]==part_x[jj-1])&&(part_y[jj]==part_y[jj-1])){
						continue
					}
					else{
						if (scale_axis===0){
							// x方向满，平移y
							part_x_to_heavy.push(part_x[jj])
							part_y_to_heavy.push(part_y[jj]+(30-parseInt(y_max/2)))
						}
						else{
							// y方向满，平移x
							part_x_to_heavy.push(part_x[jj]+(30-parseInt(x_max/2)))
							part_y_to_heavy.push(part_y[jj])
						}					
						part_num = part_num + 1				
					}
				}
	//			console.log(['去重x:', part_x_to_heavy, '去重y:',part_y_to_heavy])
				// 插值
				var test_line_mat = matInterpolation([part_x_to_heavy, part_y_to_heavy])
	//			console.log(['测试数据插值', test_line_mat])
				newlinedata.push(test_line_mat)
				var max_point_num = 200 
				var test_sample_mat = SamplingData(test_line_mat,max_point_num)
	//			console.log(['测试数据抽样', test_sample_mat[0]])			
				// 对比模板
				var all_modle_min_dis=[]
				for(var kk=0; kk<one_Line_Numdata.length;kk++){
					//提取一笔所有模板
					part_all_mat = one_Line_Numdata[kk]
					var part_modle_dis = []
					for(var mm=0; mm<part_all_mat.length;mm++){
						// 提取模板中一笔样式的x，y值
						part_xy_mat =part_all_mat[mm]
	//					console.log(['模板每笔数据:', part_xy_mat[0],'模板每笔数据y:', part_xy_mat[1]])
						// 模板数据缩放平移
						var new_part_x =[]
						var new_part_y =[]
						if (scale_axis===0){
							// 缩放y值
							for(var nn=0;nn<part_xy_mat[0].length;nn++){
								var point_x = part_xy_mat[0][nn]
								var point_y = parseInt(part_xy_mat[1][nn]*(1/ratio_xy)+30*(1-1/ratio_xy))
								new_part_x.push(point_x)
								new_part_y.push(point_y)
							}
						}
						else{
							// 缩放x值
							for(var nn=0;nn<part_xy_mat[0].length;nn++){
								var point_x = parseInt(part_xy_mat[0][nn]*ratio_xy+30*(1-ratio_xy))
								var point_y = part_xy_mat[1][nn]
								new_part_x.push(point_x)
								new_part_y.push(point_y)
							}
						}
	//					console.log(['缩放模板每笔数据:', new_part_x,'缩放模板每笔数据y:', new_part_y])		
						//
						// 插值
						var modle_line_mat = matInterpolation([new_part_x, new_part_y])
	//					console.log(['模型数据插值', modle_line_mat])
						var modle_sample_mat = SamplingData(modle_line_mat,test_sample_mat[0].length)
	//					console.log(['模型数据抽样', modle_sample_mat])	
						var part_dis = DTW_min_dis(test_sample_mat, modle_sample_mat, 1)
	//					console.log(['dtw距离',kk,part_dis])
						part_modle_dis.push(part_dis)
					}
					var min_modle_dis= Math.min.apply(null, part_modle_dis)
					all_modle_min_dis.push(min_modle_dis)
				}
	//			console.log(['所有模板的最小距离', all_modle_min_dis])
				var min_all_dis = Math.min.apply(null, all_modle_min_dis)
				for (var bb=0;bb<all_modle_min_dis.length;bb++){
					if (all_modle_min_dis[bb]==min_all_dis){
						var minIndex = bb
						break
					}
				}
	//			console.log(['最小值索引', minIndex])
				rec_one_line_mat.push(minIndex)
			}
			}
	//	console.log(['一笔识别', rec_one_line_mat])
		// 根据相交情况计算4和5 笔画索引组合
		var used_num = []	// 已经用过的标号索引
		var combine_mat = [] // 组合
		var rec_combine_mat = [] // 识别
		var combine_newlinedata = [] //组合后数据
	//	console.log(['笔画数组大小', rec_one_line_mat.length])
		for (var com_ii=0;com_ii<rec_one_line_mat.length;com_ii++){
			if(used_num.indexOf(com_ii)>=0){
				// 如果存在
				continue
			}
			else if(com_ii==(rec_one_line_mat.length-1)){
				// 最后一个未引用直接保存
	//			console.log('最后一个未引用直接保存')
				combine_mat.push([com_ii])
				rec_combine_mat.push(rec_one_line_mat[com_ii])
				combine_newlinedata.push(newlinedata[com_ii])
			}
			else{
				for(var com_jj=com_ii+1;com_jj<rec_one_line_mat.length;com_jj++){
					// 比较两组区域是否相交
					if(used_num.indexOf(com_jj)>=0){
						// 如果存在
						continue
					}
					else if ((line_region[com_ii][0]>line_region[com_jj][1])||
							 (line_region[com_ii][1]<line_region[com_jj][0])||
							 (line_region[com_ii][2]>line_region[com_jj][3])||
							 (line_region[com_ii][3]<line_region[com_jj][2])){
							 // 不相交
							 if(com_jj==rec_one_line_mat.length-1){
								 // 匹配到最后一个
								 combine_mat.push([com_ii])
								 rec_combine_mat.push(rec_one_line_mat[com_ii])
								 combine_newlinedata.push(newlinedata[com_ii])
							 }
					}
					else{
						// 存在相交看是否属于4和5的情况
						var combine_45 = [rec_one_line_mat[com_ii], rec_one_line_mat[com_jj]]
	//					console.log(['相交组合', combine_45, '转字符串',combine_45.toString()])
						if ((combine_45.toString()=='4,1')||(combine_45.toString()=='1,4')){
							combine_mat.push([com_ii, com_jj])
	//						console.log(['组合识别：4','笔画索引', [com_ii, com_jj]])
							used_num.push(com_jj)
							rec_combine_mat.push(4)
							combine_newlinedata.push([newlinedata[com_ii],newlinedata[com_jj]])
							break
						}
						else if ((combine_45.toString()=='2,1')||(combine_45.toString()=='1,2')){
							combine_mat.push([com_ii, com_jj])
	//						console.log(['组合识别：4','笔画索引', [com_ii, com_jj]])
							used_num.push(com_jj)
							rec_combine_mat.push(4)
							combine_newlinedata.push([newlinedata[com_ii],newlinedata[com_jj]])
							break
						}
						else if ((combine_45.toString()=='5,10')||(combine_45.toString()=='10,5')){
							// 还需继续优化
							combine_mat.push([com_ii, com_jj])
	//						console.log(['组合识别：5','笔画索引', [com_ii, com_jj]])
							used_num.push(com_jj)
							rec_combine_mat.push(5)
							combine_newlinedata.push([newlinedata[com_ii],newlinedata[com_jj]])
							break
						}
						else if ((combine_45.toString()=='3,10')||(combine_45.toString()=='10,3')){
							// 还需继续优化
							combine_mat.push([com_ii, com_jj])
	//						console.log(['组合识别：5','笔画索引', [com_ii, com_jj]])
							used_num.push(com_jj)
							rec_combine_mat.push(5)
							combine_newlinedata.push([newlinedata[com_ii],newlinedata[com_jj]])
							break
						}
					}
				}
			}
		}
	//	console.log(['组合', combine_mat.length, '数组', combine_mat])
		for (var print_ii =0; print_ii<combine_mat.length;print_ii++){
	//		console.log(['打印识别：索引组合',combine_mat[print_ii], '识别组合', rec_combine_mat[print_ii]])
			if ((combine_mat[print_ii].length==1)&&(rec_combine_mat[print_ii]==5)){
				// 修改识别3/5
				rec_combine_mat[print_ii]=3
			}
			else if((combine_mat[print_ii].length==1)&&(rec_combine_mat[print_ii]==4)){
				// 修改识别2/4
				rec_combine_mat[print_ii]=2
			}
			else if((combine_mat[print_ii].length==1)&&
					 ((rec_combine_mat[print_ii]==3)||(rec_combine_mat[print_ii]==7))){
				var amend_mat_2nd = combine_newlinedata[print_ii]
				var test_num=6
				for(var amend_ii=test_num; amend_ii<amend_mat_2nd[0].length-test_num;amend_ii++){
					if((amend_mat_2nd[0][amend_ii]<amend_mat_2nd[0][amend_ii-test_num])&&
					(amend_mat_2nd[0][amend_ii]<amend_mat_2nd[0][amend_ii+test_num])){
						// 发现拐点
						rec_combine_mat[print_ii]=3
						break
					}
					else if(amend_ii == amend_mat_2nd[0].length-test_num-1){
						rec_combine_mat[print_ii]=7
					}
				}
	//			console.log(['识别3、7',amend_mat_2nd])
			}
		}
		// 获取 combine_mat 的组合中心
		var combine_center=[]
		var char_height = []
		for (var center_ii =0; center_ii<combine_mat.length;center_ii++){
			if (combine_mat[center_ii].length == 1){
				var part_region1 = line_region[combine_mat[center_ii][0]]
				combine_center.push((part_region1[0]+part_region1[1])/2)
				char_height.push(part_region1[3]-part_region1[2]+1)
			}
			else{
				var part_center_mat = []
				for (var center_jj =0; center_jj<combine_mat[center_ii].length; center_jj++){
					part_center_mat.push(line_region[combine_mat[center_ii][center_jj]])
				}
	//			console.log(['多笔组合', part_center_mat])
				var part_region2 = AllLineRegion(part_center_mat)
	//			console.log(['多笔组合区域', part_region2])
				combine_center.push((part_region2[0]+part_region2[1])/2)
				char_height.push(part_region2[3]-part_region2[2]+1)
			}
		}
	//	console.log(['中心x坐标', combine_center])
	//	console.log(['高度', char_height])
		// 升序
		var combine_center2 = deepClone(combine_center,[])
		var center_sort = combine_center2.sort(function (x,y) {return x-y;})
	//	console.log(['中心坐标x排序', center_sort])
		var index_sort = []
		for (var sort_ii=0;sort_ii<center_sort.length;sort_ii++){
	//		console.log([combine_center, center_sort[sort_ii]])
			index_sort.push(combine_center.indexOf(center_sort[sort_ii]))
		}
	//	console.log(['索引', index_sort])
		// 识别重组
		var rec_mat_2nd = []
		var char_height_2nd = []
		for(var rec_ii=0;rec_ii<index_sort.length;rec_ii++){
			rec_mat_2nd.push(rec_combine_mat[index_sort[rec_ii]])
			char_height_2nd.push(char_height[index_sort[rec_ii]])
		}
	//	console.log(['识别重组1', rec_mat_2nd])
	//	console.log(['高度重组', char_height_2nd])
		// 小数重组
		if (char_height_2nd.length>=2){
			for (var char_ii =1;char_ii<char_height_2nd.length;char_ii++){
				if(char_height_2nd[char_ii-1]/char_height_2nd[char_ii]>=3){
					rec_mat_2nd[char_ii] = '.'
				}
			}
		}
		console.log(['识别重组2', rec_mat_2nd])
		return rec_mat_2nd
	}
	//一笔数据、61x61、9个点
	var one_Line_Numdata = []
	one_Line_Numdata[0]=[[[30,9,0,9,30,51,60,51,30],[0,9,30,51,60,51,30,9,0]],
						 [[60,51,30,9,0,9,30,51,60],[30,9,0,9,30,51,60,51,30]],
						 [[0,9,30,51,60,51,30,9,0],[30,51,60,51,30,9,0,9,30]],
						 [[30,51,60,51,30,9,0,9,30],[0,9,30,51,60,51,30,9,0]],
						 [[60,51,30,9,0,9,30,51,60],[30,51,60,51,30,9,0,9,30]],
						 [[0,9,30,51,60,51,30,9,0],[30,9,0,9,30,51,60,51,30]]]
	one_Line_Numdata[1]=[[[30,30,30,30,30,30,30,30,30],[0,8,15,23,30,38,45,53,60]],
						 [[30,30,30,30,30,30,30,30,30],[60,53,45,38,30,23,15,8,0]]]
	one_Line_Numdata[2]=[[[3,21,36,44,38,20,0,27,60],[13,6,2,13,33,45,60,58,57]]]
	one_Line_Numdata[3]=[[[1,30,60,30,0,30,60,30,0],[5,0,15,25,30,35,45,55,60]],
						 [[1,30,60,40,20,40,60,50,30],[5,0,15,25,30,35,45,55,60]],
						 [[1,30,60,45,30,45,60,45,30],[5,0,15,25,30,35,45,55,60]]]
	one_Line_Numdata[4]=[[[30,23,15,7,0,15,30,45,60],[0,15,30,45,60,60,60,60,60]]]
	one_Line_Numdata[5]=[[[15,7,0,20,40,60,40,20,0],[0,15,30,35,40,45,52,56,60]]]
	one_Line_Numdata[6]=[[[15,8,0,6,30,54,60,30,5],[0,18,36,52,60,52,44,36,40]]]
	one_Line_Numdata[7]=[[[0,15,30,45,60,55,50,45,40],[1,1,0,0,0,15,30,45,60]]]
	one_Line_Numdata[8]=[[[30,60,30,0,30,60,30,0,30],[30,15,0,15,30,45,60,45,30]],
						 [[30,0,30,60,30,0,30,60,30],[0,15,30,45,60,45,30,15,0]]]
	one_Line_Numdata[9]=[[[60,40,20,0,20,40,60,55,50],[13,0,0,13,25,25,13,36,60]],
						 [[30,40,60,40,20,0,40,40,40],[30,25,13,0,0,13,25,43,60]],]
	one_Line_Numdata[10]=[[[0,8,15,23,30,38,45,53,60],[30,30,30,30,30,30,30,30,30]]]
