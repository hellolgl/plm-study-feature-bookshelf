export const AllLineRegion = (line_region_mat) => {
	// 书写区域的全局坐标
	let region_mat = []
	let x_min = 1000000
	let x_max = -10
	let y_min = 1000000
	let y_max = -10
	// 这么写效率不高
	for (let ii = 0; ii < line_region_mat.length; ii++) {
		if (line_region_mat[ii][0] < x_min) {
			x_min = line_region_mat[ii][0];
		}
		if (line_region_mat[ii][1] > x_max) {
			x_max = line_region_mat[ii][1];
		}
		if (line_region_mat[ii][2] < y_min) {
			y_min = line_region_mat[ii][2];
		}
		if (line_region_mat[ii][3] > y_max) {
			y_max = line_region_mat[ii][3];
		}
	}
	region_mat[0] = x_min;
	region_mat[1] = x_max;
	region_mat[2] = y_min;
	region_mat[3] = y_max;
	return region_mat;
}

export const partLineRegion = (line_mat) => {
	// 获取一条线段的基础数据值：最小、最大、起始、结束端点
	let mouse_x = line_mat[0]
	let mouse_y = line_mat[1]
	let x_min = Math.min.apply(null, mouse_x)
	let x_max = Math.max.apply(null, mouse_x)
	let y_min = Math.min.apply(null, mouse_y)
	let y_max = Math.max.apply(null, mouse_y)
	let x_start = mouse_x[0]
	let x_end = mouse_x[mouse_x.length - 1]
	let y_start = mouse_y[0]
	let y_end = mouse_y[mouse_y.length - 1]
	return [x_min, x_max, y_min, y_max, x_start, x_end, y_start, y_end]
}
export const ArraySortMat=(combine_center)=>{
    // 排序及索引
    // let combine_center = [1,3,2,7,3,3]
    let combine_center2 = deepClone(combine_center, [])
    let center_sort = combine_center2.sort(function (x,y) {return x-y;})
	// console.log(['中心坐标x排序', center_sort])
    let index_sort = []
    for (let sort_ii=0;sort_ii<center_sort.length;sort_ii++){
        //	console.log([combine_center, center_sort[sort_ii]])
        for(let sort_jj=0; sort_jj<combine_center.length; sort_jj++){
            // console.log(typeof(sort_jj), combine_center[sort_jj])
            if (index_sort.indexOf(sort_jj)>=0){
                continue
            }
            else{
                if (center_sort[sort_ii] == combine_center[sort_jj]){
                    index_sort.push(sort_jj)
                }
            }
        }
    }
    // console.log('索引', index_sort, typeof(index_sort[0]))
    // 返回小大排序及对应索引，相同坐标情况下，根据初始书写顺序计算序号索引
    return [center_sort, index_sort]
}
export const deepClone = (obj, newObj) => {
	// 深度复制
	var newObj = newObj || {};
	for (let key in obj) {
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

export const DataToHeavy = (part_line_data0) =>{
    // 连续两点去重
    let part_x_to_heavy = []
    let part_y_to_heavy = []
    part_x_to_heavy.push(part_line_data0[0][0]);
    part_y_to_heavy.push(part_line_data0[1][0]);
    let part_xy_data = []
    for(let ii=1; ii<part_line_data0[0].length;ii++){
        if((part_line_data0[0][ii]==part_line_data0[0][ii-1])&&(part_line_data0[1][ii]==part_line_data0[1][ii-1])){
            continue;
        }
        else{
            part_x_to_heavy.push(part_line_data0[0][ii]);
            // 实际像素点坐标系与标准坐标系相反，y值取负
            part_y_to_heavy.push(part_line_data0[1][ii]);
        }
    }
    part_xy_data.push(part_x_to_heavy);
    part_xy_data.push(part_y_to_heavy);
    return part_xy_data;
}

export const matInterpolation = (Mat_data) => {
	// 多数据点连续插值
	//	Mat_data =[[1,5,9],[5,3,8]]
	let new_mat_data = [[], []]
	for (let ii = 0; ii < Mat_data[0].length - 1; ii++) {
		let point_1 = [Mat_data[0][ii], Mat_data[1][ii]]
		let point_2 = [Mat_data[0][ii + 1], Mat_data[1][ii + 1]]
		let part_mat = InterpolationPoint(point_1, point_2)
		//		new_mat_data[0].push(part_mat[0].slice(0,part_mat[0].length-1))
		//		new_mat_data[1].push(part_mat[1].slice(0,part_mat[0].length-1))
		for (let jj = 0; jj < part_mat[0].length - 1; jj++) {
			new_mat_data[0].push(part_mat[0][jj])
			new_mat_data[1].push(part_mat[1][jj])
		}
	}
	new_mat_data[0].push(Mat_data[0][Mat_data[0].length - 1])
	new_mat_data[1].push(Mat_data[1][Mat_data[1].length - 1])
	return new_mat_data
}

export const InterpolationPoint = (point_1, point_2) => {
    // 两点线性插值
	let point_a = [parseInt(point_1[0]), parseInt(point_1[1])]
	let point_b = [parseInt(point_2[0]), parseInt(point_2[1])]
	let inter_x = []
	let inter_y = []
	if ((point_a[0] == point_b[0]) && (point_a[1] == point_b[1])) {
		inter_x[0] = point_a[0]
		inter_y[0] = point_a[1]
	}
	else if (Math.abs(point_a[0] - point_b[0]) >= Math.abs(point_a[1] - point_b[1])) {
		inter_x = JsArange(point_a[0], point_b[0], 1)
		if (point_a[1] != point_b[1]) {
			let line_k = (point_a[1] - point_b[1]) / (point_a[0] - point_b[0])
			for (let jj = 0; jj < inter_x.length; jj++) {
				// inter_y[jj] = parseInt(line_k * (inter_x[jj] - point_a[0]) + point_a[1])
				inter_y[jj] = Math.round(line_k * (inter_x[jj] - point_a[0]) + point_a[1])
			}
		}
		else {
			for (let jj = 0; jj < inter_x.length; jj++) {
				inter_y[jj] = point_b[1]
			}
		}
	}
	else {
		inter_y = JsArange(point_a[1], point_b[1], 1)
		if (point_a[0] != point_b[0]) {
			let r_line_k = (point_a[0] - point_b[0]) / (point_a[1] - point_b[1])
			for (let jj = 0; jj < inter_y.length; jj++) {
				// inter_x[jj] = parseInt(r_line_k * (inter_y[jj] - point_a[1]) + point_a[0])
				inter_x[jj] = Math.round(r_line_k * (inter_y[jj] - point_a[1]) + point_a[0])
			}
		}
		else {
			for (let jj = 0; jj < inter_y.length; jj++) {
				inter_x[jj] = point_b[0]
			}
		}
	}
	let inter_line_mat = []
	inter_line_mat[0] = inter_x
	inter_line_mat[1] = inter_y
	return inter_line_mat
}

export const UniformSplit = (start_stop_mat, split_num)=>{
    // 根据起止数据值start_stop_mat, 等间隔划分split_num个点，split_num-1个数据段，取整；split_num第一次设计16;
    let step_num = (start_stop_mat[1]-start_stop_mat[0])/(split_num-1);
    let step_mat = []
    for (let ii=0;ii<split_num;ii++){
        step_mat.push(parseInt(Math.round(start_stop_mat[0]+step_num*ii)));
    }
    return step_mat;
}
export const JsArange = (start_num, end_num, stepnum) => {
    // 产生标准等差数组、stepnum：间隔
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

export const OneLineJudg=(line_data)=>{
	// 判断斜线和勾
	let part_line_data00 = DataToHeavy(line_data)
	// console.log('数据去重', part_line_data00)
	let part_line_data0 = matInterpolation(part_line_data00)
	// console.log('x轴插值',part_line_data0)
	let idx_mat = UniformSplit([0, part_line_data0[0].length-1],16)
	// console.log('分区索引',idx_mat, part_line_data0[0].length)
	// 统计斜率方向值
	let k_0 =0 //小于0
	let k_1 =0 //大于0
	for(let ii=0;ii<idx_mat.length-1;ii++){
    	let part_k = -(part_line_data0[1][idx_mat[ii+1]]-part_line_data0[1][idx_mat[ii]])/(part_line_data0[0][idx_mat[ii+1]]-part_line_data0[0][idx_mat[ii]])
    	// console.log('斜率k', part_k)
    	if (part_k>=0){
        	k_1 +=1
    	}
    	else{
        	k_0 +=1
    	}
	}
	// console.log('大于0统计',k_1,'小于0统计',k_0)
	let line_flag = 0
	if (k_1>12){
    	// console.log('单笔为/')
    	line_flag =1
	}
	else if(k_0>12){
    	// console.log('单笔为\\')
    	line_flag =-1
	}
	else{
    	// console.log('单笔为√')
    	line_flag = 0
	}
	return line_flag
}

export const JudgeCross=(line_data1, line_data2)=>{
	let part_line0_1 = DataToHeavy(line_data1)
	let part_line0_2 = matInterpolation(part_line0_1)
	let part_line1_1 = DataToHeavy(line_data2)
	let part_line1_2 = matInterpolation(part_line1_1)
	let judg_flag = 0
	let line_idx = []
	for(let ii=0;ii<part_line0_2[0].length-1;ii++){
    	let point_a = [part_line0_2[0][ii],part_line0_2[1][ii]]
    	// console.log('point_a',point_a)
   	 	for(let jj=0;jj<part_line1_2[0].length-1;jj++){
        	let point_b = [part_line1_2[0][jj],part_line1_2[1][jj]]
        	let min_x = Math.min(point_a[0], point_b[0])
        	let max_x = Math.max(point_a[0], point_b[0])
        	let min_y = Math.min(point_a[1], point_b[1])
        	let max_y = Math.max(point_a[1], point_b[1])
        	if((max_x-min_x)==1 && (max_y-min_y)==1){
            	// console.log('找到相交点', ii, jj)
            	line_idx.push(ii,jj)
            	judg_flag =1
            	break;
        	}
    	}
    	if (judg_flag==1){
        	break
    	}
	}
	// 判断两笔相交区间确定
	let line0_ratio = (line_idx[0]+1)/part_line0_2[0].length
	let line1_ratio = (line_idx[1]+1)/part_line1_2[0].length
	let cross_flag = 0
	if ((line0_ratio>0.1 && line0_ratio <0.9)&&(line1_ratio>0.1 && line1_ratio <0.9)){
		// console.log('判定为×')
		cross_flag = 1
	}
	return cross_flag
}

export const LineSubarea=(line_data)=>{
	let part_region_mat = []
	for(let ii=0;ii<line_data.length;ii++){
    	part_region_mat.push(partLineRegion(line_data[ii]))
	}
	// console.log('每笔区域', part_region_mat)
	let all_region_mat = AllLineRegion(part_region_mat)
	// console.log('全局区域', all_region_mat)
	let row_mat = new Array(all_region_mat[3]-all_region_mat[2]+1).fill(0)
	// console.log('初始行划分', row_mat)
	// 统计行
	for(let ii=0;ii<part_region_mat.length;ii++){
    	for(let jj=part_region_mat[ii][2];jj<part_region_mat[ii][3]+1;jj++){
        	row_mat[jj-all_region_mat[2]] += 1
    	}
	}
	// console.log('统计行',row_mat)
	let num_1_0 = []
	let num_0_1 = []
	for (let ii=0;ii<row_mat.length-1;ii++){
    	if (row_mat[ii]<0.5 && row_mat[ii+1]>0.5){
        	// console.log(row_mat[ii],row_mat[ii]<0.5, row_mat[ii+1], row_mat[ii+1]>0.5)
        	num_0_1.push(ii)
    	}
    	if (row_mat[ii]>0.5 && row_mat[ii+1]<0.5){
        	// console.log(row_mat[ii],row_mat[ii]<0.5, row_mat[ii+1], row_mat[ii+1]>0.5)
        	num_1_0.push(ii+1)
    	}
	}
	// console.log('1_0', num_1_0, '0_1', num_0_1)
	// 中间分离线
	let split_mat = []
	for(let ii=0;ii<num_1_0.length;ii++){
    	split_mat.push((num_1_0[ii]+num_0_1[ii])/2)
	}
	// console.log('分离线', split_mat)
	let line_idx_mat = []
	if (split_mat.length<1){
    	let part_idx = []
    	for(let ii=0;ii<part_region_mat.length;ii++){
        	part_idx.push(ii)
    	}
    	line_idx_mat.push(part_idx)
	}
	else{
    	for (let ii=0;ii<split_mat.length+1;ii++){
        	line_idx_mat[ii]=[]
    	}
    	for (let ii=0;ii<part_region_mat.length;ii++){
        	// 取一条线获取，y
        	let part_y_c = (part_region_mat[ii][2]+part_region_mat[ii][3])/2
       	 	for(let jj=0;jj<split_mat.length+1;jj++){
            	if(jj==0 && split_mat[jj]>part_y_c){
                	line_idx_mat[jj].push(ii)
            	}
            	else if(jj==split_mat.length && split_mat[jj-1]<part_y_c){
                	line_idx_mat[jj].push(ii)
            	}
            	else{
                	if (split_mat[jj-1]<part_y_c && split_mat[jj]>part_y_c){
                    	line_idx_mat[jj].push(ii)
                	}
            	}
        	}
    	}
	}
	// console.log('线条分区', line_idx_mat)
	return [line_idx_mat,part_region_mat]
}

export const RowSort=(line_idx_mat,part_region_mat)=>{
	// 为每一行建立x中心排序
	let idx_2nd_mat=[]
	let idx_3rd_mat = []
	for(let ii=0;ii<line_idx_mat.length;ii++){
    	let part_center_x =[]
    	for (let jj=0; jj<line_idx_mat[ii].length;jj++){
        	let part_line_idx = line_idx_mat[ii][jj]
        	// console.log('line_idx',part_line_idx)
        	let line_center_x = (part_region_mat[part_line_idx][0]+part_region_mat[part_line_idx][1])/2
        	part_center_x.push(line_center_x)
    	}
    	// console.log('中心',part_center_x)
    	let [center_sort, index_sort] = ArraySortMat(part_center_x)
    	// console.log('排序', center_sort, index_sort)
    	// 排序重组
    	let part_idx_2nd = []
    	for(let kk=0;kk<index_sort.length;kk++){
        	part_idx_2nd.push(line_idx_mat[ii][index_sort[kk]])
        	idx_3rd_mat.push(line_idx_mat[ii][index_sort[kk]])
    	}
    	idx_2nd_mat.push(part_idx_2nd)
	}
	// console.log('重排', idx_2nd_mat,idx_3rd_mat)
	return [idx_2nd_mat,idx_3rd_mat]
}

export const JudgeCheck=(standard_loc_mat,part_region_mat,idx_3rd_mat)=>{
	// 勾选题
	let answer_num =0
	for (let ii=0;ii<standard_loc_mat.length;ii++){
    	// right_loc需要根据前端实际返回图片值乘以系数
    	let right_loc = standard_loc_mat[ii]
    	let test_loc = part_region_mat[idx_3rd_mat[ii]]
    	if ((right_loc[0]>=test_loc[0]&&right_loc[0]<=test_loc[1])&&(right_loc[1]>=test_loc[2]&&right_loc[1]<=test_loc[3])){
        	// console.log('答案正确')
        	answer_num += 1
    	}
	}
	// console.log('回答正确数',answer_num)
	return answer_num
}

export const JudgeCheck2=(standard_loc_mat,line_data)=>{
	let part_region_mat = []
	for(let ii=0;ii<line_data.length;ii++){
    	part_region_mat.push(partLineRegion(line_data[ii]))
	}
	let answer_combine = []
	for(let ii=0;ii<standard_loc_mat.length;ii++){
    	// right_loc需要根据前端实际返回图片值乘以系数
    	let right_loc = standard_loc_mat[ii]
    	for(let jj=0;jj<part_region_mat.length;jj++){
        	let test_loc = part_region_mat[jj]
        	if ((right_loc[0]>=test_loc[0]&&right_loc[0]<=test_loc[1])&&(right_loc[1]>=test_loc[2]&&right_loc[1]<=test_loc[3])){
            	// console.log('答案正确')
            	answer_combine.push([ii,jj])
            	break
        	}
    	}
	}
	// console.log('直接比对答案', answer_combine.length,answer_combine)
	return answer_combine
}
export const JudgeRW=(line_data,line_idx_mat)=>{
	let judg_str_mat = []
	let judg_num_mat = []
	for(let ii=0;ii<line_idx_mat.length;ii++){
    	let part_idx_mat = line_idx_mat[ii]
    	let part_judg_str = ''
    	let part_judg_num = -1
    	if (part_idx_mat.length==1){
        	// 判断是否为√
        	let part_line_data = line_data[part_idx_mat[0]]
        	console.log(part_idx_mat[0], part_line_data)
        	let flag_1 = OneLineJudg(part_line_data)
        	console.log('判断属性-1为\\,0为√，1为/;数据判断为：', flag_1)
        	if (flag_1 ==-1){
            	part_judg_str = '\\'
        	}
        	else if(flag_1 ==1){
            	part_judg_str = '/'
        	}
        	else{
            	part_judg_str = '√'
            	part_judg_num=1
        	}
    	}
    	else if(part_idx_mat.length==2){
        	let flag_1 = OneLineJudg(line_data[part_idx_mat[0]])
        	let flag_2 = OneLineJudg(line_data[part_idx_mat[1]])
        	// console.log('两组判定',flag_1, flag_2)
        	if ((flag_1==-1 && flag_2==1)||(flag_1==1 && flag_2==-1)){
            	console.log('x判定')
            	let cross_flag = JudgeCross(line_data[part_idx_mat[0]], line_data[part_idx_mat[1]])
            	if (cross_flag==0){
                	console.log('错误书写判定')
            	}
            	else{
                	console.log('x正确判定')
                	part_judg_str = 'x'
                	part_judg_num = 0
            	}

        	}
        	else{
            	console.log('错误书写判定')
        	}

    	}
    	else{
        	console.log('错误书写判定')
    	}
    	judg_str_mat.push(part_judg_str)
    	judg_num_mat.push(part_judg_num)
	}
	console.log(judg_str_mat,judg_num_mat)
	return [judg_str_mat,judg_num_mat]
}