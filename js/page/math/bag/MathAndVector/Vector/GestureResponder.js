import {PanResponder} from "react-native";

class GestureResponder {
    constructor() {
        // 手势相关变量
        this.gestureState = {
            /*
            *
            line_start_x: 0,
            line_start_y: 0,
            line_end_x: 0,
            line_end_y: 0,
            graph_choice_idx: -1,
            line_choice_idx: -1,
            tmpPointList: [],
            tmpMovePointList: [],
            temp_move_data: [],
            all_graph_svg_mat: [],
            init_split_mat: [[]],    // 上一次切割数据
            temporary_graph_mat: [],
            tmp_high_point: [],
            multi_points_index: -1,
            adsorb_svg: [],
            tmp_all_points: [],
            * */
            funcMode: "",
            lineStartX: 0,
            lineStartY: 0,
            lineEndX: 0,
            lineEndY: 0,
            graphChoiceIdx: -1,
            lineChoiceIdx: -1,
            temporaryDataMat: [],
            allGraphSvgMat: [],
            adsorbSvg: [],
            dragSvgMat: [],
        }
    }

    create = () => {
        const responder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        })
        return responder
    }
}

export default GestureResponder