import React, {Component} from "react"
import _ from "lodash"
import {DrawSvgClass} from "./GraphAndNumSVG"
import Svg, {Circle, Polyline, Text as SText} from "react-native-svg"
import Algorithm from "./Algorithm"
import {PanResponder, Text, View, TouchableOpacity} from "react-native";
import {pxToDp} from "../../../../../util/tools";
import {MathGraphClass} from "./MathGraphModule";

const log = console.log.bind(console)

class CustomSvg extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {svgData, width, height} = this.props
        return (
            <Svg
                style={{
                    width,
                    height,
                    backgroundColor: 'transparent',
                    position: 'absolute'
                }}
            >
                {
                    svgData
                }
            </Svg>
        )
    }
}

class Parallelogram extends Component {
    constructor() {
        super()
        this.panResponder = null
        this.state = {
            opEvent: "",
            externalProps: {},
            gradInfo: {},
            // 存放点信息
            points: [],
            // 备份点信息，用来还原
            bakPoints: [],
            // 存放svg信息
            svgData: [],
            // 存放手势操作时的临时svg数据
            tmpSvgData: [],
            // 存放计算出来的周长/面积数据
            externalData: [],
            // 临时存放周长数据
            tmpExternalData: [],
        }
        // 手势相关变量
        this.gestureState = {
            funcMode: "",
            lineStartX: 0,
            lineStartY: 0,
            lineEndX: 0,
            lineEndY: 0,
            graphChoiceIdx: -1,
            lineChoiceIdx: -1,
            pointChoiceIdx: -1,
            temporaryDataMat: [],
            fakeTemporaryDataMat: [],
            allGraphSvg: [],
            allGraphSvgMat: [],
            adsorbSvg: [],
            dragSvgMat: [],
            tmpHighLine: [],
            initSplitMat: [[]],    // 上一次切割数据
            // 页面和组件相差坐标
            divPageX: -1,
            divPageY: -1,
        }
        this.algorithm = null
        this.draw = null
        this.symmetric_point_index = -1    //对称轴题目对称轴坐标的索引
    }

    shouldComponentUpdate(nextProps, nextState , nextContext) {
        if ((!_.isEqual(nextState, this.state)) || (!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextProps.externalProps.funcMode, this.state.externalProps.funcMode))) {
            return true
        } else {
            return false
        }
    }

    componentWillUnmount() {
        log("~~~~~~ componentWillUnmount")
        this.setState({
            points: [],
            svgData: [],
        })
    }

    componentWillMount() {
        this._createResponder()
    }

    componentDidMount() {
        const {externalProps, gradInfo, points} = this.props
        this.setState({
            externalProps,
            gradInfo,
            points,
            bakPoints: points,
        })
    }

     componentDidUpdate(prevProps, prevState) {
        log("componentDidUpdate: ")
        log("funcMode: ", !_.isEqual(this.state.externalProps.funcMode, this.props.externalProps.funcMode))
        // log("props: ", !_.isEqual(this.props.points, prevProps.points))
        // log("state: ", prevState.points.length === 0)
        if ((!_.isEqual(this.props.points, prevProps.points))
            || (prevState.points.length === 0)
            || ((!_.isEqual(this.state.externalProps.funcMode, this.props.externalProps.funcMode)) && (this.props.externalProps.funcMode !== "平移"))
        ) {
            log("componentDidUpdate true")
            const {externalProps, gradInfo, points} = this.props
            log("externalProps: ", externalProps)
            // init tools
            this._initTools(gradInfo, externalProps)
            const newPoints = this.algorithm.reducePoints(points)
            log("debug points: ", points, newPoints)
            let svgData = this._getSvg(newPoints)
            let tmpSvgData = this._getTmpSvg()
            this.setState({
                externalProps,
                gradInfo,
                points: newPoints,
                svgData,
                tmpSvgData,
                bakPoints: points,
            })
        }
    }

    _createResponder = (funcMode="") => {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                log("touch here : ", funcMode)
                let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
                let tempFirstY = evt.nativeEvent.locationY

                let pageX = evt.nativeEvent.pageX    // 页面坐标
                let pageY = evt.nativeEvent.pageY

                this.gestureState.lineStartX = Math.round(tempfirstX * 100) / 100
                this.gestureState.lineStartY = Math.round(tempFirstY * 100) / 100

                this.gestureState.divPageX = Math.round((pageX - tempfirstX) * 100) / 100
                this.gestureState.divPageY = Math.round((pageY - tempFirstY) * 100) / 100

                const {points, svgData} = this.state
                // 创建线条
                if (funcMode === "gribAbsorb") {
                    log("gribAbsorb: ", this.algorithm)
                    const t = this.algorithm.getGridAdsorptionIdx([this.gestureState.lineStartX, this.gestureState.lineStartY])
                    this.gestureState.lineStartX = t[0]
                    this.gestureState.lineStartY = t[1]
                    console.log("click here...: ", t)
                }
                // 拖拽线条
                else if (funcMode === "combineLine") {
                    let choiceData = this.algorithm.judgeTouchGraphIndex([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    this.gestureState.graphChoiceIdx = choiceData[0]
                    this.gestureState.lineChoiceIdx = choiceData[1]
                    this.gestureState.allGraphSvg = _.cloneDeep(svgData)
                }
                else if (funcMode === "combination") {
                    let choiceData = this.algorithm.judgeTouchGraphIndex([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    this.gestureState.graphChoiceIdx = choiceData[0]
                    if (this.gestureState.graphChoiceIdx !== -1) {
                        this.gestureState.allGraphSvgMat = _.cloneDeep(points)
                    }
                }
                else if (funcMode === "lineMove") {
                    let choiceData = this.algorithm.judgePointInLine([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    this.gestureState.graphChoiceIdx = choiceData[0]
                    this.gestureState.lineChoiceIdx = choiceData[1]
                    log("grant lineMove: ", choiceData)
                }
                else if (funcMode === "graphText") {
                    const {tmpExternalData, externalData} = this.state
                    let choiceData = this.algorithm.judgePointInLine([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    log("touch here...: ", choiceData)
                    this.gestureState.graphChoiceIdx = choiceData[0]
                    this.gestureState.lineChoiceIdx = choiceData[1]

                    // 触摸到了图形的边
                    if (this.gestureState.lineChoiceIdx >= 0) {
                        let temporaryDataMat = _.cloneDeep(points[this.gestureState.graphChoiceIdx]) // 临时数据
                        this.gestureState.allGraphSvgMat = _.cloneDeep(points)
                        this.gestureState.temporaryDataMat = _.cloneDeep(temporaryDataMat)
                        const linePoints = [points[0][this.gestureState.lineChoiceIdx], points[0][(this.gestureState.lineChoiceIdx + 1) % 4]]
                        let cutLineSvg = this.draw.DrawLineSvg(linePoints[0], linePoints[1], '#2162f6', 4, )
                        if (tmpExternalData.length === 0) {
                            this.setState({
                                svgData: [...svgData, cutLineSvg],
                                tmpExternalData: externalData,
                            })
                        } else {
                            this.setState({
                                svgData: [...svgData, cutLineSvg],
                            })
                        }
                    }
                }
                else if (funcMode === "auxiliaryHigh") {
                    const touchPoint = [this.gestureState.lineStartX, this.gestureState.lineStartY]
                    const t = this.algorithm.judgePointInPoint(touchPoint, points)
                    this.gestureState.graphChoiceIdx = t[0]
                    this.gestureState.pointChoiceIdx = t[1]
                    if (this.gestureState.graphChoiceIdx >= 0) {
                        // 有效选择图形端点
                        this.gestureState.lineStartX = points[this.gestureState.graphChoiceIdx][this.gestureState.pointChoiceIdx][0]
                        this.gestureState.lineStartY = points[this.gestureState.graphChoiceIdx][this.gestureState.pointChoiceIdx][1]
                    }
                }
                else if (funcMode === "graphArea") {
                    const {tmpExternalData, externalData} = this.state
                    let choiceData = this.algorithm.judgePointInLine([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    this.gestureState.graphChoiceIdx = choiceData[0]
                    this.gestureState.lineChoiceIdx = choiceData[1]
                    this.gestureState.allGraphSvgMat = _.cloneDeep(points)
                    // 触摸到了图形的边
                    if (this.gestureState.lineChoiceIdx >= 0) {
                        let temporaryDataMat = _.cloneDeep(points[this.gestureState.graphChoiceIdx]) // 临时数据
                        this.gestureState.allGraphSvgMat = _.cloneDeep(points)
                        this.gestureState.temporaryDataMat = _.cloneDeep(temporaryDataMat)
                        const linePoints = [points[0][this.gestureState.lineChoiceIdx], points[0][(this.gestureState.lineChoiceIdx + 1) % 4]]
                        let cutLineSvg = this.draw.DrawLineSvg(linePoints[0], linePoints[1], '#2162f6', 4, )
                        if (tmpExternalData.length === 0) {
                            this.setState({
                                svgData: [...svgData, cutLineSvg],
                                tmpExternalData: externalData,
                            })
                        } else {
                            this.setState({
                                svgData: [...svgData, cutLineSvg],
                            })
                        }
                    }
                }
                else if (funcMode === "cutAbsorb") {
                    const {points, gradInfo} = this.state
                    let choiceData = this.algorithm.judgeTouchGraphIndex([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    console.log('分割图形选择---------1', choiceData, JSON.stringify([this.gestureState.lineStartX, this.gestureState.lineStartY]), JSON.stringify(points))
                    let choicePolygon = this.algorithm.judgeTouchPolygonIdx([this.gestureState.lineStartX, this.gestureState.lineStartY], points)
                    this.gestureState.graphChoiceIdx = choicePolygon[0]
                    console.log('分割图形选择---------2', choicePolygon, JSON.stringify([this.gestureState.lineStartX, this.gestureState.lineStartY]), JSON.stringify(points))
                    this.gestureState.allGraphSvg = _.cloneDeep(svgData)
                    log("graphChoiceIds: ", this.gestureState.graphChoiceIdx, typeof this.gestureState.graphChoiceIdx)
                    log("       choiceData: ", choiceData)
                    log("this.state.points: ", points)
                    log("here...: ", _.isEqual(choiceData, points))
                    if (this.gestureState.graphChoiceIdx >= 0) {
                        let moveDx = 0
                        let moveDy = 0
                        // 绘制临时图形
                        this.gestureState.fakeTemporaryDataMat = this.algorithm.computeMovePoints(points[this.gestureState.graphChoiceIdx], [moveDx, moveDy])
                        if (this.algorithm.judgeGraphInRengion(this.gestureState.fakeTemporaryDataMat, gradInfo)) {
                            this.gestureState.temporaryDataMat = _.cloneDeep(this.gestureState.fakeTemporaryDataMat)
                            this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.draw.DrawAllGraph([this.gestureState.temporaryDataMat], 0))
                            // 计算处理连续点的点距离接近范围----判定接近点所对应直线的斜率/夹角情况
                            let [choicePointMat, groupPointMat, neighborSideMat] = this.algorithm.calculateSideAbsorb(points, this.gestureState.graphChoiceIdx, this.gestureState.temporaryDataMat)
                            let sideDx = 0 // 重新渲染计算移动量
                            let sideDy = 0
                            if (groupPointMat.length > 0) {
                                if (this.algorithm.twoPointDistance(groupPointMat[0][0], choicePointMat[0][0]) < 10) {
                                    sideDx = groupPointMat[0][0][0] - choicePointMat[0][0][0]
                                    sideDy = groupPointMat[0][0][1] - choicePointMat[0][0][1]
                                }
                                else {
                                    sideDx = groupPointMat[0][0][0] - choicePointMat[0][1][0]
                                    sideDy = groupPointMat[0][0][1] - choicePointMat[0][1][1]
                                }
                                // 更新移动组
                                this.gestureState.temporaryDataMat = this.algorithm.computeMovePoints(points[this.gestureState.graphChoiceIdx], [moveDx + sideDx, moveDy + sideDy])
                                this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.draw.DrawAllGraph([this.gestureState.temporaryDataMat], 0))
                            }
                            // 合并线绘制
                            let groupLineSvg = this.draw.DrawAllGraph(groupPointMat, -1, 'red')
                            // 组合图像合并数据
                            let singleCombineData = this.algorithm.combineReorderData(points, this.gestureState.temporaryDataMat, neighborSideMat)
                            let combineDataSvg = []
                            combineDataSvg.push(
                                this.draw.DrawAllGraph([singleCombineData], -1, 'blue', 'blue')
                            )
                            this.setState({
                                svgData: _.cloneDeep(this.gestureState.allGraphSvg),   // 修改多组图形存在时的数据
                                tmpSvgData: [combineDataSvg, groupLineSvg, ]
                            })
                        }
                    }
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                let pageX = evt.nativeEvent.pageX    // 页面坐标
                let pageY = evt.nativeEvent.pageY

                this.gestureState.lineEndX = pageX - this.gestureState.divPageX
                this.gestureState.lineEndY = pageY - this.gestureState.divPageY

                const {points, gradInfo, externalData, tmpExternalData} = this.state

                if (funcMode === "gribAbsorb") {
                    const {key_name} = this.props.externalProps
                    let [lineEndX, lineEndY] = this.algorithm.getGridAdsorptionIdx([this.gestureState.lineEndX, this.gestureState.lineEndY])
                    let drawLineMat = [[this.gestureState.lineStartX, this.gestureState.lineStartY], [lineEndX, lineEndY]]
                    let drawLineSvg = []
                    if(key_name === '对称轴'){
                        drawLineSvg.push(this.draw.DeconstructionDrawLineSvg({ point_a_mat: drawLineMat[0], point_b_mat: drawLineMat[1], stroke_color: 'black',stroke_width:3,dash_mat:[10,5] }))
                    }else{
                        drawLineSvg.push(this.draw.DeconstructionDrawLineSvg({ point_a_mat: drawLineMat[0], point_b_mat: drawLineMat[1], stroke_color: 'black' }))
                    }
                    drawLineSvg.push(this.draw.DeconstructionDrawPointSvg({ point_mat: drawLineMat[0], fill_color: 'red' }))
                    drawLineSvg.push(this.draw.DeconstructionDrawPointSvg({ point_mat: drawLineMat[1], fill_color: 'red' }))
                    this.setState({
                        tmpSvgData: [drawLineSvg],
                    })
                }
                else if (funcMode === "combineLine" && this.gestureState.graphChoiceIdx >= 0) {
                    let moveDx = this.gestureState.lineEndX - this.gestureState.lineStartX
                    let moveDy = this.gestureState.lineEndY - this.gestureState.lineStartY
                    this.gestureState.fakeTemporaryDataMat = this.algorithm.computeMovePoints(points[this.gestureState.graphChoiceIdx], [moveDx, moveDy]) // 临时移动数据
                    if (this.algorithm.judgeGraphInRengion(this.gestureState.fakeTemporaryDataMat, gradInfo)) {
                        this.gestureState.temporaryDataMat = _.cloneDeep(this.gestureState.fakeTemporaryDataMat)
                        this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = this.draw.DeconstructionDrawPolylineSvg({
                            polyline_mat: this.gestureState.temporaryDataMat,
                            stroke_color: 'red'
                        })
                        // 建立自动吸附计算----控制距离内绘制圆圈，更新坐标显示，释放后自动判定是否为吸附计算
                        let contrastMat = this.algorithm.endPointAdsorptionCalculate(points, this.gestureState.graphChoiceIdx, this.gestureState.temporaryDataMat)
                        this.gestureState.adsorbSvg = []
                        if (contrastMat[0] >= 0) {
                            // 存在吸附接近点
                            let absorbPoint = points[contrastMat[0]][contrastMat[2]]
                            this.gestureState.adsorbSvg.push(this.draw.DeconstructionDrawPointSvg({
                                point_mat: absorbPoint,
                                radius: 10,
                                fill_color: 'transparent',
                                stroke_color: 'red',
                                stroke_width: 2,
                            }))
                            let absorbX = absorbPoint[0] - this.gestureState.temporaryDataMat[contrastMat[1]][0]
                            let absorbY = absorbPoint[1] - this.gestureState.temporaryDataMat[contrastMat[1]][1]
                            this.gestureState.temporaryDataMat[contrastMat[1]][0] += absorbX
                            this.gestureState.temporaryDataMat[contrastMat[1]][1] += absorbY
                            this.gestureState.temporaryDataMat[(contrastMat[1] + 1) % 2][0] += absorbX
                            this.gestureState.temporaryDataMat[(contrastMat[1] + 1) % 2][1] += absorbY
                            this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = this.draw.DeconstructionDrawPolylineSvg({
                                polyline_mat: this.gestureState.temporaryDataMat,
                                stroke_color: 'red'
                            })
                        }
                        this.setState({
                            svgData: _.cloneDeep(this.gestureState.allGraphSvg),   // 修改多组图形存在时的数据
                            tmpSvgData: this.gestureState.adsorbSvg
                            // drawMovePoints: this.gestureState.adsorb_svg // 吸附展示更新
                        })
                    }
                }
                else if (funcMode === "combination" && this.gestureState.graphChoiceIdx >= 0) {
                    let moveDx = this.gestureState.lineEndX - this.gestureState.lineStartX
                    let moveDy = this.gestureState.lineEndY - this.gestureState.lineStartY
                    const tmpMovePoints = points[this.gestureState.graphChoiceIdx]
                    this.gestureState.fakeTemporaryDataMat = this.algorithm.computeMovePoints(tmpMovePoints, [moveDx, moveDy])
                    if (this.algorithm.judgeGraphInRengion(this.gestureState.fakeTemporaryDataMat, gradInfo)) {
                        this.gestureState.temporaryDataMat = _.cloneDeep(this.gestureState.fakeTemporaryDataMat)
                        this.gestureState.allGraphSvgMat[this.gestureState.graphChoiceIdx] = this.gestureState.temporaryDataMat
                        let [choicePointMat, groupPointMat, neighborSideMat] = this.algorithm.calculateSideAbsorb(points, this.gestureState.graphChoiceIdx, this.gestureState.temporaryDataMat)
                        // 重新渲染计算移动量
                        let sideDx = 0
                        let sideDy = 0
                        if (groupPointMat.length > 0) {
                            if (this.algorithm.twoPointDistance(groupPointMat[0][0], groupPointMat[0][0]) < 10) {
                                sideDx = groupPointMat[0][0][0] - choicePointMat[0][0][0]
                                sideDy = groupPointMat[0][0][1] - choicePointMat[0][0][1]
                            }
                            else {
                                sideDx = groupPointMat[0][0][0] - choicePointMat[0][1][0]
                                sideDy = groupPointMat[0][0][1] - choicePointMat[0][1][1]
                            }
                            // 更新移动组
                            this.gestureState.temporaryDataMat = this.algorithm.computeMovePoints(tmpMovePoints, [moveDx + sideDx, moveDy + sideDy])
                            this.gestureState.allGraphSvgMat[this.gestureState.graphChoiceIdx] = this.gestureState.temporaryDataMat
                            // 合并线绘制
                            let choiceLineSvg = []
                            let groupLineSvg = this.draw.DrawAllGraph(groupPointMat, -1, 'red')
                            // 组合图像合并数据
                            let singleCombineData = this.algorithm.combineReorderData(points, this.gestureState.temporaryDataMat, neighborSideMat)
                            let combineDataSvg = []
                            combineDataSvg.push(
                                this.draw.DrawAllGraph([singleCombineData], -1, 'blue', 'blue')
                            )
                            this.setState({
                                tmpSvgData: [combineDataSvg],
                                svgData: [...this.draw.DrawAllGraph(this.gestureState.allGraphSvgMat, 0)],   // 修改多组图形存在时的数据
                            })
                        } else {
                            this.setState({
                                tmpSvgData: [],
                                svgData: [...this.draw.DrawAllGraph(this.gestureState.allGraphSvgMat, this.gestureState.graphChoiceIdx)],   // 修改多组图形存在时的数据
                            })
                        }
                    }
                }
                else if (funcMode === "lineMove" && this.gestureState.graphChoiceIdx >= 0 && this.gestureState.lineChoiceIdx >= 0) {
                    let moveData = [this.gestureState.lineEndX - this.gestureState.lineStartX, this.gestureState.lineEndY - this.gestureState.lineStartY]
                    let newGraphData = this.algorithm.parallelogramMoveLine(points[this.gestureState.graphChoiceIdx], moveData, this.gestureState.lineChoiceIdx) // 平行四边形不稳定性验证，周长不变
                    if (this.algorithm.judgeGraphInRengion(newGraphData, gradInfo)) {
                        let choiceLineSvg = this.draw.DeconstructionDrawLineSvg({
                            point_a_mat: newGraphData[this.gestureState.lineChoiceIdx],
                            point_b_mat: newGraphData[(this.gestureState.lineChoiceIdx + 1) % newGraphData.length],
                            stroke_color: 'red'
                        })
                        let newGraphSvg = this.draw.DeconstructionDrawPolygonSvg({
                            polygon_mat: newGraphData,
                            fill_color: 'transparent'
                        })
                        this.gestureState.allGraphSvgMat = _.cloneDeep(newGraphData)
                        this.setState({
                            tmpSvgData: [newGraphSvg, choiceLineSvg],
                            svgData: [],
                        })
                    }
                }
                else if (funcMode === "graphText" && this.gestureState.graphChoiceIdx !== -1) {
                    let moveData = [this.gestureState.lineEndX - this.gestureState.lineStartX, this.gestureState.lineEndY - this.gestureState.lineStartY]
                    let graphLength = points[this.gestureState.graphChoiceIdx].length
                    let lineAMat = [
                        points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx - 1 + graphLength) % graphLength],
                        points[this.gestureState.graphChoiceIdx][this.gestureState.lineChoiceIdx]]
                    let lineBMat = [
                        points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx + 2 + graphLength) % graphLength],
                        points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx + 1 + graphLength) % graphLength]
                    ]
                    let [newLineA, newLineB] = this.algorithm.twoLineVectorMove(lineAMat, lineBMat, moveData)
                    if (this.algorithm.judgeGraphInRengion(newLineA, gradInfo) && this.algorithm.judgeGraphInRengion(newLineB, gradInfo)) {
                        const s = this._getPerimeter()
                        log("newLineA: ", newLineA)
                        log("newLineB: ", newLineB)
                        let strokeColor = "#00CB41"
                        if ((externalData[0] + externalData[1]) < (tmpExternalData[0] + tmpExternalData[1])) {
                            strokeColor = "red"
                        }
                        // 保存点位信息
                        let newLineSvgMatPoints = []
                        newLineSvgMatPoints.push(...newLineA)
                        newLineSvgMatPoints.push(...newLineB)

                        let newLineSvgMat = []
                        newLineSvgMat.push(this.draw.DeconstructionDrawLineSvg({
                            point_a_mat: lineAMat[1],
                            point_b_mat: newLineA[1],
                            stroke_color: strokeColor,
                            stroke_width: 4,
                        }))
                        newLineSvgMat.push(this.draw.DeconstructionDrawLineSvg({
                            point_a_mat: lineBMat[1],
                            point_b_mat: newLineB[1],
                            stroke_color: strokeColor,
                            stroke_width: 4,
                        }))
                        // 动边
                        newLineSvgMat.push(this.draw.DeconstructionDrawLineSvg({
                            point_a_mat: lineAMat[1],
                            point_b_mat: lineBMat[1],
                            stroke_color: strokeColor,
                            stroke_width: 4,
                        }))
                        newLineSvgMat.push(this.draw.DeconstructionDrawLineSvg({
                            point_a_mat: newLineA[1],
                            point_b_mat: newLineB[1],
                            stroke_color: strokeColor,
                            stroke_width: 4,
                        }))
                        // 临时保存运动后的点位信息
                        let temporaryDataMat = _.cloneDeep(points[this.gestureState.graphChoiceIdx]) // 临时数据
                        temporaryDataMat[this.gestureState.lineChoiceIdx] = newLineA[1]
                        temporaryDataMat[(this.gestureState.lineChoiceIdx + 1) % temporaryDataMat.length] = newLineB[1]
                        this.gestureState.allGraphSvgMat = _.cloneDeep(points)
                        this.gestureState.temporaryDataMat = _.cloneDeep(temporaryDataMat)
                        this.gestureState.allGraphSvgMat[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.gestureState.temporaryDataMat)
                        let allGraphSvg = this.draw.DrawAllGraph(points)
                        // const drawTextSvg = this._getSTextSvg(this.gestureState.allGraphSvgMat)
                        let externalSTextSvg = []
                        const drawTextSvg = this._getSTextSvg(this.gestureState.allGraphSvgMat)
                        log("sum: ", drawTextSvg.map(d => d.props.children).reduce((prev,current,index,arr)=>{
                            return parseFloat(prev) + parseFloat(current)
                        }))
                        externalSTextSvg.push(this._getExternalDataSTextSvg(s, pxToDp(220), pxToDp(60)))
                        this.setState({
                            tmpSvgData: [newLineSvgMat, this.props.isCreat?[]:externalSTextSvg],
                        })
                    }
                }
                else if (funcMode === "auxiliaryHigh") {
                    let intersectSvgMat = []
                    if (this.gestureState.graphChoiceIdx !== -1) {
                        let touchPointSvg = [this.draw.DeconstructionDrawPointSvg({ point_mat: [this.gestureState.lineStartX, this.gestureState.lineStartY], fill_color: 'red' })]
                        // 做辅助线
                        let cutLineMat = [[this.gestureState.lineStartX, this.gestureState.lineStartY], [this.gestureState.lineEndX, this.gestureState.lineEndY]]
                        let tempLineSvg = this.draw.DrawLineSvg(cutLineMat[0], cutLineMat[1], 'red', 3, [10, 5])//绘制单线
                        let [intersectMat, ploylineMat, lineIdx] = this.algorithm.allCalculateHighLine2(cutLineMat, points[this.gestureState.graphChoiceIdx], this.gestureState.pointChoiceIdx, 15)
                        if (intersectMat.length === 3 && intersectMat[0] === 0) {
                            // 绘制交点---实交点
                            log("--------- 绘制交点---实交点")
                            intersectSvgMat.push(this.draw.DrawPointSvg([intersectMat[1], intersectMat[2]], 5, 'red'))
                            tempLineSvg = this.draw.DrawLineSvg([this.gestureState.lineStartX, this.gestureState.lineStartY], [intersectMat[1], intersectMat[2]], 'red', 3, [10, 5])
                            if (ploylineMat.length === 3) {
                                log("自动吸附...")
                                intersectSvgMat = []
                                // 垂线修正---自动吸附
                                let lineData = [
                                    points[this.gestureState.graphChoiceIdx][(lineIdx) % points[this.gestureState.graphChoiceIdx].length],
                                    points[this.gestureState.graphChoiceIdx][(lineIdx + 1) % points[this.gestureState.graphChoiceIdx].length]
                                ]
                                log("lineData: ", lineData)
                                // 待做垂线---线段
                                let touchPointData = [this.gestureState.lineStartX, this.gestureState.lineStartX] //待做垂线点
                                let verticalIntersctionMat = this.algorithm.getPointToLineVerticalPoint(lineData, touchPointData) // 固定垂点
                                let [intersectMat2, ploylineMat2] = this.algorithm.calculateHighLine2([this.gestureState.lineStartX, this.gestureState.lineStartY], verticalIntersctionMat, lineData, 15) // 重新计算垂直符号
                                tempLineSvg = this.draw.DrawLineSvg([this.gestureState.lineStartX, this.gestureState.lineStartY], verticalIntersctionMat, 'red', 3, [10, 5])
                                // 绘制直线符号
                                intersectSvgMat.push(this.draw.DrawPointSvg(verticalIntersctionMat, 5, 'red'))
                                intersectSvgMat.push(this.draw.DrawPolylineSvg(ploylineMat2, 'red'))
                            }
                        }
                        else if (intersectMat.length === 3 && intersectMat[0] === 100) {
                            let pointExtendedMat = this.algorithm.calculateNearestPoint([intersectMat[1], intersectMat[2]],
                                points[this.gestureState.graphChoiceIdx][(lineIdx) % points[this.gestureState.graphChoiceIdx].length],
                                points[this.gestureState.graphChoiceIdx][(lineIdx + 1) % points[this.gestureState.graphChoiceIdx].length]) // 相交线两点
                            let endPointMat = this.algorithm.calculateVirtualVerticalIntersection(cutLineMat, pointExtendedMat, intersectMat)
                            if (endPointMat.length > 0) {
                                intersectSvgMat.push(this.draw.DrawPointSvg([intersectMat[1], intersectMat[2]], 5, 'red'))
                                intersectSvgMat.push(this.draw.DrawLineSvg(pointExtendedMat, endPointMat, "red", 3, [10, 5]))
                                tempLineSvg = this.draw.DrawLineSvg(cutLineMat[0], [intersectMat[1], intersectMat[2]], 'red', 3, [10, 5])
                                if (ploylineMat.length === 3) {
                                    intersectSvgMat = []
                                    // 垂线修正---自动吸附
                                    let lineData = [
                                        points[this.gestureState.graphChoiceIdx][(lineIdx) % points[this.gestureState.graphChoiceIdx].length],
                                        points[this.gestureState.graphChoiceIdx][(lineIdx + 1) % points[this.gestureState.graphChoiceIdx].length]
                                    ]
                                    // 待做垂线---线段
                                    let touchPointData = [this.gestureState.lineStartX, this.gestureState.lineStartY] //待做垂线点
                                    let verticalIntersctionMat = this.algorithm.getPointToLineVerticalPoint(lineData, touchPointData) // 固定垂点
                                    let [intersectMat2, ploylineMat2] = this.algorithm.calculateHighLine2([this.gestureState.lineStartX, this.gestureState.lineStartY], verticalIntersctionMat, lineData, 15) // 重新计算垂直符号
                                    tempLineSvg = this.draw.DrawLineSvg([this.gestureState.lineStartX, this.gestureState.lineStartY], verticalIntersctionMat, 'red', 3, [10, 5])
                                    // 绘制直线符号
                                    // 绘制交点---实交点
                                    intersectSvgMat.push(this.draw.DrawPointSvg(verticalIntersctionMat, 5, 'red'))
                                    intersectSvgMat.push(this.draw.DrawPolylineSvg(ploylineMat2, 'red'))
                                    intersectSvgMat.push(this.draw.DrawLineSvg(pointExtendedMat, endPointMat, "black", 3, [10, 5]))
                                }
                            }
                        }
                        this.setState({
                            tmpSvgData: [touchPointSvg, tempLineSvg, intersectSvgMat],
                        })
                    }
                }
                else if (funcMode === "graphArea") {
                    let moveData = [this.gestureState.lineEndX - this.gestureState.lineStartX, this.gestureState.lineEndY - this.gestureState.lineStartY]
                    if (this.gestureState.graphChoiceIdx !== -1) {
                        let graphLength = points[this.gestureState.graphChoiceIdx].length
                        let lineAMat = [
                            points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx - 1 + graphLength) % graphLength],
                            points[this.gestureState.graphChoiceIdx][this.gestureState.lineChoiceIdx]]
                        let lineBMat = [
                            points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx + 2 + graphLength) % graphLength],
                            points[this.gestureState.graphChoiceIdx][(this.gestureState.lineChoiceIdx + 1 + graphLength) % graphLength]
                        ]
                        let [newLineA, newLineB] = this.algorithm.twoLineVectorMove(lineAMat, lineBMat, moveData)
                        if (this.algorithm.judgeGraphInRengion(newLineA, gradInfo) && this.algorithm.judgeGraphInRengion(newLineB, gradInfo)) {
                            let newLineSvgMatPoints = []
                            // 保存点位信息
                            newLineSvgMatPoints.push(newLineA[0])
                            newLineSvgMatPoints.push(newLineA[1])
                            newLineSvgMatPoints.push(newLineB[1])
                            newLineSvgMatPoints.push(newLineB[0])

                            let strokeColor = ["green", 'rgba(184, 255, 207, 0.5)']
                            if ((parseFloat(externalData[0]) * parseFloat(externalData[1])) < (parseFloat(tmpExternalData[0]) * parseFloat(tmpExternalData[1]))) {
                                strokeColor = ["red", 'rgba(255, 227, 222, 0.5)']
                            }
                            const newLineSvgMat = this.draw.DrawPolygonSvg([[[lineAMat[1], lineBMat[1]], [lineBMat[1], newLineB[1]], [newLineB[1], newLineA[1]], [newLineA[1], lineAMat[1]]]], strokeColor[0], 4, strokeColor[1])
                            // 临时保存运动后的点位信息
                            const drawTextSvg = this._getSTextSvg([newLineSvgMatPoints])
                            this.gestureState.allGraphSvgMat = _.cloneDeep([newLineSvgMatPoints])
                            let tempGraphMat = _.cloneDeep(points[this.gestureState.graphChoiceIdx]) // 临时数据
                            tempGraphMat[this.gestureState.lineChoiceIdx] = newLineA[1]
                            tempGraphMat[(this.gestureState.lineChoiceIdx + 1) % tempGraphMat.length] = newLineB[1]
                            this.gestureState.temporaryDataMat = _.cloneDeep(tempGraphMat)
                            const highLineSvg = this._getHighLine([newLineSvgMatPoints], )
                            const hightSvg = _.cloneDeep(highLineSvg).slice(0, highLineSvg.length - 1)
                            if (this.props.isCreat) {
                                this._setAreaExternalData([newLineSvgMatPoints], highLineSvg)
                                this.gestureState.tmpHighLine = _.cloneDeep(hightSvg)
                                this.setState({
                                    tmpSvgData: [newLineSvgMat],
                                })
                            } else {
                                this._setSpecialAreaExternalData([newLineSvgMatPoints], highLineSvg)
                                this.gestureState.tmpHighLine = _.cloneDeep(highLineSvg)
                                const s = this._getArea()
                                const areaSText = this._getExternalDataSTextSvg(s, pxToDp(180), pxToDp(60))
                                this.setState({
                                    tmpSvgData: [newLineSvgMat, areaSText],
                                })
                            }
                        }
                    }
                }
                else if (funcMode === "cutAbsorb") {
                    if (this.gestureState.graphChoiceIdx < 0) {
                        let cutLineMat = [[this.gestureState.lineStartX, this.gestureState.lineStartY], [this.gestureState.lineEndX, this.gestureState.lineEndY]]     // 切割线
                        let cutLineSvg = this.draw.DeconstructionDrawLineSvg({ point_a_mat: cutLineMat[0], point_b_mat: cutLineMat[1], stroke_color: 'red' })
                        let allRightAngle = this.algorithm.calculateAllGraphHeight(points, cutLineMat, 15)
                        let rightAngleSvg = this.draw.DrawAllPolylineGraph(allRightAngle, 'red') // 直角渲染
                        this.setState({
                            tmpSvgData: [cutLineSvg, rightAngleSvg]
                        })
                    } else {
                        let moveDx = this.gestureState.lineEndX - this.gestureState.lineStartX
                        let moveDy = this.gestureState.lineEndY - this.gestureState.lineStartY
                        // 绘制临时图形
                        this.gestureState.fakeTemporaryDataMat = this.algorithm.computeMovePoints(points[this.gestureState.graphChoiceIdx], [moveDx, moveDy])
                        if (this.algorithm.judgeGraphInRengion(this.gestureState.fakeTemporaryDataMat, gradInfo)) {
                            this.gestureState.temporaryDataMat = _.cloneDeep(this.gestureState.fakeTemporaryDataMat)
                            this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.draw.DrawAllGraph([this.gestureState.temporaryDataMat], 0))
                            // 计算处理连续点的点距离接近范围----判定接近点所对应直线的斜率/夹角情况
                            let [choicePointMat, groupPointMat, neighborSideMat] = this.algorithm.calculateSideAbsorb(points, this.gestureState.graphChoiceIdx, this.gestureState.temporaryDataMat)
                            let sideDx = 0 // 重新渲染计算移动量
                            let sideDy = 0
                            if (groupPointMat.length > 0) {
                                if (this.algorithm.twoPointDistance(groupPointMat[0][0], choicePointMat[0][0]) < 10) {
                                    sideDx = groupPointMat[0][0][0] - choicePointMat[0][0][0]
                                    sideDy = groupPointMat[0][0][1] - choicePointMat[0][0][1]
                                }
                                else {
                                    sideDx = groupPointMat[0][0][0] - choicePointMat[0][1][0]
                                    sideDy = groupPointMat[0][0][1] - choicePointMat[0][1][1]
                                }
                                // 更新移动组
                                this.gestureState.temporaryDataMat = this.algorithm.computeMovePoints(points[this.gestureState.graphChoiceIdx], [moveDx + sideDx, moveDy + sideDy])
                                this.gestureState.allGraphSvg[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.draw.DrawAllGraph([this.gestureState.temporaryDataMat], 0))
                            }
                            // 合并线绘制
                            let groupLineSvg = this.draw.DrawAllGraph(groupPointMat, -1, 'red')
                            // 组合图像合并数据
                            let singleCombineData = this.algorithm.combineReorderData(points, this.gestureState.temporaryDataMat, neighborSideMat)
                            let combineDataSvg = []
                            combineDataSvg.push(
                                this.draw.DrawAllGraph([singleCombineData], -1, 'blue', 'blue')
                            )
                            this.setState({
                                svgData: _.cloneDeep(this.gestureState.allGraphSvg),   // 修改多组图形存在时的数据
                                tmpSvgData: [combineDataSvg, groupLineSvg, ]
                            })
                        }
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                const {points, tmpSvgData, svgData, externalData} = this.state
                if (funcMode === "gribAbsorb") {
                    const {externalProps} = this.props
                    const {symmetric_points,key_name} = externalProps
                    // 吸附判定
                    log("lineEndX: ", this.gestureState.lineEndX)
                    log("lineEndY: ", this.gestureState.lineEndY)
                    if ((this.gestureState.lineEndX === 0) && (this.gestureState.lineEndY === 0)) {
                        return
                    }
                    let [lineEndX, lineEndY] = this.algorithm.getGridAdsorptionIdx([this.gestureState.lineEndX, this.gestureState.lineEndY])
                    let pre_points = JSON.parse(JSON.stringify(points))
                    points.push([[this.gestureState.lineStartX, this.gestureState.lineStartY], [lineEndX, lineEndY]])
                    const svgData = this.draw.DrawAllPointSvg(points, -1, 'lime', 'lime')
                    if(symmetric_points.length > 0){
                        // 表示是对称轴相关题目，需要提取对称轴坐标数据单独处理
                        if(key_name === '对称'){
                            let symmetric_line_point = points[this.symmetric_point_index]
                            let otherGraph_point = points.filter((i,x)=>{
                                return x !== this.symmetric_point_index
                            })
                            this.gestureState.allGraphSvgMat = [...otherGraph_point.map((i,x)=>{
                                return this.draw.DrawPolylineSvg(i, "black", 3, "transparent")
                            })]
                            let symmetric_line = this.draw.DrawLineSvg(symmetric_line_point[0], symmetric_line_point[1], 'black', 3, [10, 5])
                            this.setState({
                                svgData: [svgData, this.gestureState.allGraphSvgMat,symmetric_line],
                                tmpSvgData: [],
                            })
                        } else {
                            let len = symmetric_points.length
                            let symmetric_line_points = points.slice(len)
                            let symmetric_line_svg = [...symmetric_line_points.map((i,x)=>{
                                return this.draw.DrawLineSvg(i[0], i[1], 'black', 3, [10, 5])
                            })]
                            this.gestureState.allGraphSvgMat = this.draw.DrawAllGraph(pre_points.slice(0,len))
                            this.setState({
                                svgData: [svgData, this.gestureState.allGraphSvgMat,symmetric_line_svg],
                                tmpSvgData: [],
                            })
                        }
                    }else{
                        log("here...")
                        this.gestureState.allGraphSvgMat = this.draw.DrawAllGraph(points)
                        // 还原下次画线时初始点信息
                        this.gestureState.lineEndX = 0
                        this.gestureState.lineEndY = 0
                        this.setState({
                            svgData: [svgData, this.gestureState.allGraphSvgMat],
                            tmpSvgData: [],
                        })
                    }
                    this.props.release([[this.gestureState.lineStartX, this.gestureState.lineStartY], [lineEndX, lineEndY]])
                }
                else if (funcMode === "combineLine") {
                    if (this.gestureState.graphChoiceIdx >= 0) {
                        points[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.gestureState.temporaryDataMat)
                        this.gestureState.allGraphSvg = this.draw.DrawAllGraph(points)
                        // 组合图形判定
                        let combineIdxMat = this.algorithm.judgeCombineLine(points)
                        if (combineIdxMat.length > 0) {
                            this.gestureState.dragSvgMat = []
                            this.gestureState.adsorbSvg = []
                            for (let idx = 0; idx < combineIdxMat.length; idx++) {
                                // 单组判定
                                if (combineIdxMat[idx].length > 2) {
                                    // 最少为3组线---封闭图形----头尾关系---正负方向
                                    let closedGraphMat0 = this.algorithm.judgeClosedGraph(points, combineIdxMat[idx])
                                    // 绘制封闭图像
                                    let closedGraphMat = this.algorithm.linkLinePoint(closedGraphMat0)
                                    if (closedGraphMat.length > 0) {
                                        this.gestureState.dragSvgMat.push(this.draw.DeconstructionDrawPolygonSvg({
                                            polygon_mat: closedGraphMat,
                                            stroke_color: 'red',
                                            fill_color: 'lime',
                                            fill_opacity: 0.2
                                        }))
                                    }
                                }
                            }
                        }
                        this.setState({
                            points,
                            svgData: _.cloneDeep(this.gestureState.allGraphSvg),  // 修改多组图形存在时的数据
                            tmpSvgData: this.gestureState.dragSvgMat    // 吸附展示更新
                        })
                    }
                }
                else if (funcMode === "combination") {
                    if (this.gestureState.graphChoiceIdx !== -1) {
                        if (this.gestureState.temporaryDataMat) {
                            points[this.gestureState.graphChoiceIdx] = this.gestureState.temporaryDataMat
                            this.setState({
                                points,
                                svgData: [this.draw.DrawAllGraph(points), tmpSvgData],
                                tmpSvgData: [],
                            })
                        } else {
                            this.setState({
                                svgData: [svgData, ...this.draw.DrawAllGraph(points), this.gestureState.graphChoiceIdx],
                            })
                        }
                    }
                }
                else if (funcMode === "lineMove") {
                    // log("this.gestureState.graphChoiceIdx: ", this.gestureState.graphChoiceIdx)
                    if (this.gestureState.graphChoiceIdx >= -1) {
                        let newGraphSvg = this.draw.DeconstructionDrawPolygonSvg({
                            polygon_mat: this.gestureState.allGraphSvgMat,
                            fill_color: 'transparent'
                        })
                        if (this.gestureState.allGraphSvgMat.length !== 0) {
                            // log("svgData: ", this.gestureState.allGraphSvgMat)
                            this.setState({
                                points: _.cloneDeep([this.gestureState.allGraphSvgMat]),
                                svgData: newGraphSvg,
                                tmpSvgData: [],
                            })
                        }
                    }
                }
                else if (funcMode === "graphText") {
                    if (this.gestureState.lineChoiceIdx !== -1) {
                        points[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.gestureState.temporaryDataMat)
                        let allGraphSvg = this.draw.DrawAllGraph(points)
                        const drawTextSvg = this._getSTextSvg(points)

                        const s = this._getPerimeter()
                        const externalSTextSvg = this._getExternalDataSTextSvg(s, pxToDp(220), pxToDp(60))
                        this.props.release(externalData)
                        let svgData = [allGraphSvg, drawTextSvg]
                        if(this.props.isCreat){
                            svgData = [allGraphSvg, []]
                        }
                        this.setState({
                            points,
                            tmpSvgData: this.props.isCreat?[]:[externalSTextSvg],
                            svgData,
                            tmpExternalData: externalData,
                        })
                    }
                }
                else if (funcMode === "graphArea") {
                    if (tmpSvgData.length !== 0 && this.gestureState.graphChoiceIdx !== -1) {
                        points[this.gestureState.graphChoiceIdx] = _.cloneDeep(this.gestureState.temporaryDataMat)
                        let allGraphSvg = this.draw.DrawAllGraph(points)
                        log("DEBUG points: ", points)
                        const t = _.cloneDeep(points)
                        const sortPoints = t[0].sort((x, y) => {return Math.floor(y[1]) - Math.floor(x[1])})
                        log("DEBUG sortPoints: ", sortPoints)
                        log("DEBUG points: ", points)
                        const drawTextSvg = this._getSTextSvg([[sortPoints[0], sortPoints[1]]])
                        const s = this._getArea()
                        const areaSTextSvg = this._getExternalDataSTextSvg(s, pxToDp(180), pxToDp(60))
                        this.props.release(externalData)
                        let svgData = [this.gestureState.tmpHighLine, allGraphSvg, drawTextSvg]
                        if(this.props.isCreat){
                            svgData = [this.gestureState.tmpHighLine, allGraphSvg, []]
                        }
                        this.setState({
                            // points: points,
                            points: _.cloneDeep(points),
                            tmpSvgData:this.props.isCreat?[]:[areaSTextSvg],
                            svgData,
                            tmpExternalData: externalData,
                        })
                    }
                }
                else if (funcMode === "cutAbsorb") {
                    // 切割图形
                    let newgraphcls = new MathGraphClass()
                    if (this.gestureState.graphChoiceIdx < 0) {
                        let cutLineMat = [[this.gestureState.lineStartX, this.gestureState.lineStartY], [this.gestureState.lineEndX, this.gestureState.lineEndY]]     // 切割线
                        let [newLocMat, splitLocMat] = newgraphcls.AllGraphSplitProcess(points, cutLineMat, this.gestureState.initSplitMat)
                        this.gestureState.allGraphSvg = _.cloneDeep(this.draw.DrawAllGraph(newLocMat, -1))
                        const newPoints = _.cloneDeep(newLocMat)
                        this.setState({
                            points: newPoints,
                            svgData: _.cloneDeep(this.gestureState.allGraphSvg),   // 修改多组图形存在时的数据
                            tmpSvgData: [],
                        })
                    } else {
                        if (this.gestureState.temporaryDataMat.length !== 0) {
                            points[this.gestureState.graphChoiceIdx] = this.gestureState.temporaryDataMat
                            this.gestureState.allGraphSvg = this.draw.DrawAllGraph(points)
                            this.setState({
                                points,
                                svgData: _.cloneDeep(this.gestureState.allGraphSvg),
                                tmpSvgData: [],
                            })
                        }
                    }
                }
            },
        })
    }

    _getPerimeter = () => {
        const {externalData} = this.state
        const [l0, l1] = externalData
        const c = 2 * (l0 * 10 + l1 * 10) / 10.0
        const s = `C = 2 x ( ${l0} + ${l1} ) = ${c}`
        return s
    }

    _getArea = () => {
        const {externalData} = this.state
        const [l0, l1] = externalData
        const s = ((l0 * 10) * (l1 * 10)) / 100.0
        const r = `S = ${l0} x ${l1} = ${s}`
        return r
    }

    _initTools = (gradInfo, externalProps) => {
        const {funcMode} = externalProps
        log("!!!!! funcMode: ", funcMode)
        this._createResponder(funcMode)
        this.algorithm = new Algorithm(gradInfo)
        const {width, height} = gradInfo
        this.draw = new DrawSvgClass(width, height)
    }

    _setPermitterExternalData = (info) => {
        const i = info[0]
        // 获取封闭图形的两个边长
        const t = [parseFloat(i[0][1]), parseFloat(i[1][1])]
        this.setState({
            externalData: t
        })
    }

    _setAreaExternalData = (points, highLine) => {
        const _t = <SText></SText>
        let high = 0
        const r = _.flattenDeep(highLine)
        for (let i = 0; i < r.length; i++) {
            const s = r[i]
            if (s["type"] === _t["type"]) {
                high = s["props"]["children"]
                break
            }
        }

        let info = this.algorithm.getLineLength(points)
        const i = info[0]
        // 获取封闭图形的两个边长
        const t = [parseFloat(i[1][1]), parseFloat(high)]
        this.setState({
            externalData: t
        })
    }

    _setSpecialAreaExternalData = (points, highLine) => {
        const _t = <SText></SText>
        let high = 0
        let r = _.flattenDeep(highLine)
        r = r.filter(_r => _r !== undefined)
        for (let i = 0; i < r.length; i++) {
            const s = r[i]
            if (s["type"] === _t["type"]) {
                high = s["props"]["children"]
                break
            }
        }
        const sortPoints = points[0].sort((x, y) => {return Math.floor(x[0]) - Math.floor(y[0])})
        let info
        if (sortPoints.length === 5) {
            info = this.algorithm.getLineLength([[sortPoints[0], sortPoints[1]]])
        } else {
            info = this.algorithm.getLineLength([[sortPoints[0], sortPoints[2]]])
        }
        const i = info[0]
        // 获取封闭图形的两个边长
        const t = [parseFloat(i[0][1]), parseFloat(high)]
        this.setState({
            externalData: t
        })
    }

    _getExternalDataSTextSvg = (info, x, y) => {
        return (
            <SText
                fill={"#0969da"}
                stroke={"#0969da"}
                fontSize={pxToDp(33)}
                // fontWeight="bold"`
                x={x}
                y={y}
                textAnchor="middle"
            >{info}</SText>
        )
    }

    _getSTextSvg = (points) => {
        let graphTextMat = this.algorithm.getLineLength(points)
        this._setPermitterExternalData(graphTextMat)
        const drawTextSvg = []
        for (let idx = 0; idx < graphTextMat.length; idx++) {
            for (let s_idx = 0; s_idx < graphTextMat[idx].length; s_idx++) {
                drawTextSvg.push(this.draw.DrawTextSvg(graphTextMat[idx][s_idx][1], graphTextMat[idx][s_idx][0], 20, '#457af6')) // 文本
            }
        }
        return drawTextSvg
    }

    _getSvg =  (points) => {
        const {externalProps} = this.props
        const {funcMode, pointOne,symmetric_points,key_name} = externalProps
        log("debug func mode: ", funcMode)
        log("pointOne: ", pointOne)
        let svgData = null
        if (funcMode === "combineLine") {
            svgData = [...points.map(point => this.draw.DrawPolygonSvg(point, "black", 3, "transparent"))]
        }
        else if (funcMode === "gribAbsorb") {
            let symmetric_line = null
            let polygonSvg = []
            if(key_name === '对称' || key_name === '对称轴'){
                symmetric_points.forEach((i,x)=>{
                    if(i.line === '0'){
                        // 画虚线
                        symmetric_line = this.draw.DrawLineSvg(points[x][0], points[x][1], 'black', 3, [10, 5])
                        this.symmetric_point_index = x
                    }
                    else{
                        polygonSvg.push(this.draw.DrawPolylineSvg(points[x], "black", 3, "transparent"))
                    }
                })
                svgData = [polygonSvg,symmetric_line]
            }else{
                svgData = [...points.map((point) => {
                    if(point.length === 1){
                        return this.draw.DrawPointSvg(point[0])
                    }
                    return this.draw.DrawPolygonSvg(point, "black", 3, "transparent")
                })]
            }
        }
        // 渲染拖拽三角形
        else if (funcMode === "combination") {
            svgData = [...points.map(point => this.draw.DrawPolygonSvg(point, "black", 3, "transparent"))]
        }
        else if (funcMode === "graphText") {
            const drawTextSvg = this._getSTextSvg(points)
            let graphTextMat = this.algorithm.getLineLength(points)
            this._setPermitterExternalData(graphTextMat)
            svgData = [this.draw.DrawPolygonSvg(points,  "black", 3, "transparent"), drawTextSvg]
        }
        else if (funcMode === "graphArea") {
            const t = _.cloneDeep(points)
            const sortPoints = t[0].sort((x, y) => {return Math.floor(y[1]) - Math.floor(x[1])})
            const drawTextSvg = this._getSTextSvg([[sortPoints[0], sortPoints[1]]])
            const highLine = this._getHighLine(points)
            this._setAreaExternalData(points, highLine)
            svgData = [this.draw.DrawPolygonSvg(points,  "black", 3, "transparent"), drawTextSvg, highLine]
        }
        else if (funcMode === "auxiliaryHigh") {
            const redPointList = points[0].map(points => {
                return this.draw.DeconstructionDrawPointSvg({ point_mat: points, fill_color: 'red' })
            })
            svgData = [this.draw.DrawPolygonSvg(points,  "black", 3, "transparent"), redPointList]
        }
        // 渲染单个多边形
        else {
            svgData = []
            if (pointOne && pointOne.length !== 0) {
                const p = this.algorithm.reducePoints(pointOne)
                svgData.push(this.draw.DrawPointSvg(p[0][0], 5, 'red'))
            }
            svgData.push(this.draw.DrawPolygonSvg(points,  "black", 3, "transparent"))
        }
        return svgData
    }

    _getHighLine = (points, isNew=false) => {
        const judgeItemInArr = (arr, item) => {
            let t = false
            for (let i = 0; i < arr.length; i++) {
                let a = arr[i]
                if (JSON.stringify(a) === JSON.stringify(item)) {
                    t = true
                    break
                }
            }
            return t
        }

        let strokeColor = "red"
        if (isNew) {
            strokeColor = "blue"
        }
        const s = _.flatten(points)
        let xList = []
        let yList = []
        for (let i = 0; i < s.length; i++) {
            const [x, y] = s[i]
            xList.push(x)
            yList.push(y)
        }
        xList = xList.sort((a, b) => {return Math.floor(a) - Math.floor(b)})
        yList = yList.sort((a, b) => {return Math.floor(a) - Math.floor(b)})
        log("xList: ", xList)
        log("yList: ", yList)
        const minY = yList[0]
        const littleX = xList[1]
        const littleY = yList[2]
        const cutLineMat = [[littleX, littleY], [littleX, minY]]
        // 高线定点中不属于图形定点的点
        const specialPoint = cutLineMat.filter(item => judgeItemInArr(s, item) === false)[0]
        // 获取与特殊点的y值相同的两个点
        const commonYPoints = s.filter(point => Math.floor(point[1]) === Math.floor(specialPoint[1]))
        let xRange = [commonYPoints[0][0], commonYPoints[1][0]].sort((a, b) => Math.floor(a) - Math.floor(b))
        if ((specialPoint[0] >= xRange[0]) && (specialPoint[0] <= xRange[1])) {
            const drawTextSvg = this._getSTextSvg([cutLineMat])
            let cutLineSvg = this.draw.DrawLineSvg(cutLineMat[0], cutLineMat[1], strokeColor, 3, [10, 5])
            const intersectSvgMat = []
            let touchPointData = [xList[1], yList[1]] //待做垂线点

            log("points: ", points)
            log("touchPointData: ", touchPointData)
            let lineData = [cutLineMat[1], cutLineMat[0]]
            let verticalIntersctionMat = lineData[1] // 固定垂点
            const bottomLine = [[xList[0], yList[3]], [xList[3], yList[3]]]
            let [intersectMat2, ploylineMat2] = this.algorithm.calculateHighLine2(touchPointData, verticalIntersctionMat, bottomLine, 15) // 重新计算垂直符号
            intersectSvgMat.push(this.draw.DrawPointSvg(verticalIntersctionMat, 5, strokeColor))
            intersectSvgMat.push(this.draw.DrawPolylineSvg(ploylineMat2, strokeColor))
            return [cutLineSvg, intersectSvgMat, drawTextSvg]
        } else {
            const spX = specialPoint[0]
            // 高的辅助线
            const newLinePoint = [specialPoint]
            if (spX < xRange[0]) {
                const p = s.filter(point => Math.floor(point[0]) === Math.floor(xRange[0]))[0]
                newLinePoint.push(p)
            } else {
                const p = s.filter(point => Math.floor(point[0]) === Math.floor(xRange[1]))[0]
                newLinePoint.push(p)
            }
            // 画高的辅助线
            let tempLineSvg = this.draw.DrawLineSvg(newLinePoint[0], newLinePoint[1], strokeColor, 3, [10, 5])//绘制单线
            const drawTextSvg = this._getSTextSvg([cutLineMat])
            let cutLineSvg = this.draw.DrawLineSvg(cutLineMat[0], cutLineMat[1], strokeColor, 3, [10, 5])
            points[0].push(specialPoint)
            let allRightAngle = this.algorithm.calculateAllGraphHeight(points, cutLineMat, 15)
            let rightAngleSvgMat = this.draw.DrawAllPolylineGraph(allRightAngle, strokeColor) // 直角渲染
            return [cutLineSvg, rightAngleSvgMat[1], tempLineSvg, drawTextSvg]
        }
    }

    _getTmpSvg = () => {
        const {externalProps} = this.props
        const {funcMode} = externalProps
        let tmpSvgData = []
        if (funcMode === "graphText"){
            const {externalData} = this.state
            log("_getTmpSvg externalData: ", externalData)
            let externalSTextSvg = []
            if (externalData.length !== 0) {
                const s = this._getPerimeter()
                externalSTextSvg.push(this._getExternalDataSTextSvg(s, pxToDp(220), pxToDp(60)))
            }
            tmpSvgData = externalSTextSvg
        }
        else if (funcMode === "graphArea"){
            const {externalData} = this.state
            let externalSTextSvg = []
            if (externalData.length !== 0) {
                const s = this._getArea()
                externalSTextSvg.push(this._getExternalDataSTextSvg(s, pxToDp(180), pxToDp(60)))
            }
            tmpSvgData = externalSTextSvg
        }
        return tmpSvgData
    }

    moveEvent = (direction) => {
        const {externalProps} = this.state
        const eventMap = {
            "left": this.algorithm.moveLeft,
            "right": this.algorithm.moveRight,
            "up": this.algorithm.moveUp,
            "down": this.algorithm.moveDown,
        }
        const moveFunction = eventMap[direction]
        const {points} = this.state
        const newPoints = moveFunction(points)
        let svgData = this._getSvg(newPoints)
        this.setState({
            points: [newPoints],
            svgData,
        })
    }

    rotateEvent = (rawPoints, rotateAngle) => {
        const {externalProps, gradInfo} = this.state
        const points = this.algorithm.reducePoints(rawPoints)
        const {pointOne} = externalProps
        const p = this.algorithm.reducePoints(pointOne)
        const newPoints = this.algorithm.rotateEastern(points, p, rotateAngle)
        let svgData = this._getSvg(newPoints)
        this.setState({
            points: [newPoints],
            svgData,
        })
    }

    reductionEvent = () => {
        const {bakPoints} = this.state
        const newPoints = this.algorithm.reducePoints(bakPoints)
        const svgData = this._getSvg(newPoints)
        const {externalProps} = this.props
        const {funcMode,} = externalProps
        this.setState({
            points: newPoints,
            svgData,
        }, () => {
            let tmpSvgData = this._getTmpSvg()
            this.setState({
                tmpSvgData
            })
        })
    }

    showResolution = (values)=>{
        //    0题目   1我的答案  2正确答案
        const {points} = this.state
        const {symmetric_points,key_name} = this.props.externalProps
        // console.log('做错了回显数据',points,symmetric_points,values)
        let symmetric_line = null
        let polygonSvg = []
        let original_data = []
        if(key_name === '对称' || key_name === '对称轴'){
            symmetric_points.forEach((i,x)=>{
                if(i.line === '0'){
                    // 画虚线
                    symmetric_line = this.draw.DrawLineSvg(points[x][0], points[x][1], 'black', 3, [10, 5])
                    this.symmetric_point_index = x
                }
                else{
                    polygonSvg.push(this.draw.DrawPolylineSvg(points[x], "black", 3, "transparent"))
                }
            })
            original_data = [polygonSvg,symmetric_line]
        }else{
            original_data = [...points.map((point) => {
                if(point.length === 1){
                    return this.draw.DrawPointSvg(point[0])
                }
                return this.draw.DrawPolygonSvg(point, "black", 3, "transparent")
            })]
        }
        let answer_data = []
        answer_data = [...values[2].map((i,x)=>{
            return this.draw.DrawPolygonSvg(i, "red", 3, "transparent")
        })]
        let my_answer_data = [...values[1].map((i,x)=>{
            return this.draw.DrawLineSvg(i[0],i[1], "blue", 3)
        })]
        if(key_name === '对称'){
            answer_data = [...values[2].map((i,x)=>{
                return this.draw.DrawPolylineSvg(i, "red", 3, "transparent")
            })]
        }
        if(key_name === '对称轴'){
            my_answer_data = [...values[1].map((i,x)=>{
                return this.draw.DrawLineSvg(i[0],i[1], "blue", 3,[10,5])
            })]
            answer_data = [...values[2].map((i,x)=>{
                return this.draw.DrawLineSvg(i[0],i[1], "red", 3,[10,5])
            })]
        }
        this.setState({
            svgData:[...original_data,...answer_data,...my_answer_data]
        })
    }

    render() {
        const {svgData, gradInfo, tmpSvgData,} = this.state
        log("this.state.externalProps: ", this.state.externalProps)
        const {points, externalProps} = this.props
        const {width, height} = gradInfo
        return (
            <View>
                {/*{*/}
                {/*    points.length === 0?*/}
                {/*        null*/}
                {/*        :*/}
                {/*        <TouchableOpacity*/}
                {/*            style={{*/}
                {/*                width: pxToDp(200),*/}
                {/*                height: pxToDp(60),*/}
                {/*                backgroundColor: "green",*/}
                {/*                zIndex: 999,*/}
                {/*                position: "absolute",*/}
                {/*                right: pxToDp(30),*/}
                {/*                top: pxToDp(30),*/}
                {/*                alignItems: "center",*/}
                {/*                justifyContent: "center",*/}
                {/*            }}*/}
                {/*            onPress={() => this.reductionEvent()}*/}
                {/*        >*/}
                {/*            <Text>还原</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*}*/}
                <View
                    style={{
                        width: width,
                        height: height,
                        // backgroundColor: "red",
                    }}
                    {...this.panResponder.panHandlers}
                >
                    <CustomSvg
                        width={width}
                        height={height}
                        svgData={svgData}
                    />
                    <CustomSvg
                        width={width}
                        height={height}
                        svgData={tmpSvgData}
                    />
                </View>
            </View>

        )
    }
}

export default Parallelogram
