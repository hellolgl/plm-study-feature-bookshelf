import React, {Component} from "react"
import {View, Text, PanResponder, Image} from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import Svg, {Circle} from "react-native-svg"
import {BaseProcessClass} from "./GraphAndNumAlgorithm";
import Algorithm from "./Algorithm";
import {DrawSvgClass} from "./GraphAndNumSVG";
import _ from "lodash";
import {pxToDp} from "../../../../../util/tools";

const log = console.log.bind(console)

class RotatingDisk extends Component {
    constructor() {
        super()

        // 手势操作变量
        this.lineStartX = -1
        this.lineStartY = -1
        this.lineEndX = -1
        this.lineEndY = -1
        this.choiceCircle = -1
        this.graphDataMat = [] // 组件屏幕坐标

        this.componentWidth = pxToDp(500)
        this.componentHeight = pxToDp(500)

        // 圆盘旋转
        this.circleRingX = this.componentWidth / 2
        this.circleRingY = this.componentWidth / 2
        this.circleRingR = pxToDp(200)
        this.lastAngle = 0
        this.clockwiseFlag = 0  // 0为顺、1为逆


        this.state = {
            cy: this.circleRingY - this.circleRingR,
            cx: this.circleRingX,    // 圆中心坐标
            cr: pxToDp(12),                 // 圆半径
            cCorlor: 'white',       // 圆颜色
            rotateSvgMat: [],     // 旋转环
            angeleText: '0°',
            drawGraphSvg: [],        //绘图
            graphSvg: [],           // 图形绘制
            rotateText: '顺时针旋转',
        }
        this.algorithm = null
        this.draw = null
    }

    _initTools = (gradInfo) => {
        this.algorithm = new Algorithm(gradInfo)
        const {width, height} = gradInfo
        this.draw =  new DrawSvgClass(width, height)
    }

    init = () => {
        this.lineStartX = -1
        this.lineStartY = -1
        this.lineEndX = -1
        this.lineEndY = -1
        this.choiceCircle = -1
        this.graphDataMat = [] // 组件屏幕坐标

        this.componentWidth = pxToDp(500)
        this.componentHeight = pxToDp(500)

        // 圆盘旋转
        this.circleRingX = this.componentWidth / 2
        this.circleRingY = this.componentWidth / 2
        this.circleRingR = pxToDp(200)
        this.lastAngle = 0
        this.clockwiseFlag = 0  // 0为顺、1为逆

        this.setState({
            cy: this.circleRingY - this.circleRingR,
            cx: this.circleRingX,    // 圆中心坐标
            cr: pxToDp(12),                 // 圆半径
            cCorlor: 'white',       // 圆颜色
            rotateSvgMat: [],     // 旋转环
            angeleText: '0°',
            drawGraphSvg: [],        //绘图
            graphSvg: [],           // 图形绘制
            rotateText: '顺时针旋转',
        })
        this.algorithm = null
        this.draw = null
    }

    _createResponder = () => {
        this._panResponderRotatingDisk = PanResponder.create({
            // 要求成为响应者：旋转圆盘
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                let tempfirstX = evt.nativeEvent.locationX    // 组件坐标
                let tempFirstY = evt.nativeEvent.locationY
                this.lineStartX = Math.round(tempfirstX * 100) / 100
                this.lineStartY = Math.round(tempFirstY * 100) / 100
                // 判定是否选中
                const {cx, cy, cr} = this.state
                if (Math.abs(this.lineStartX - cx) < cr &&
                    Math.abs(this.lineStartY - cy) < cr) {
                    this.choiceCircle = 1
                    this.setState({
                        cCorlor: 'red',
                    })
                }
            },

            onPanResponderMove: (evt, gestureState) => {
                log("move...")
                // console.log('移动响应==========================================')
                // 最近一次的移动距离为gestureState.move{X,Y}
                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
                let pointX = evt.nativeEvent.locationX
                let pointY = evt.nativeEvent.locationY
                this.lineEndX = Math.round(pointX * 100) / 100
                this.lineEndY = Math.round(pointY * 100) / 100
                if (this.choiceCircle === 1) {
                    // 选中旋转圆
                    let lineK = 0
                    let angleK = 0
                    if (this.lineEndX === this.circleRingX) {
                        if (this.lineEndY > this.circleRingY) {
                            angleK = -90 + 360
                        }
                        else {
                            angleK = 90 + 360
                        }
                    }
                    else {
                        lineK = -(this.lineEndY - this.circleRingY) / (this.lineEndX - this.circleRingX)
                        angleK = Math.atan(lineK) / Math.PI * 180 + 360
                    }
                    let newCx = this.lineEndX
                    let newCy = this.lineEndY
                    let [vectorX, vectorY] = [this.lineEndX - this.circleRingX, this.lineEndY - this.circleRingY]
                    let pDistance = this.algorithm.twoPointDistance([this.lineEndX, this.lineEndY], [this.circleRingX, this.circleRingY])
                    let [normalVectorX, normalVectorY] = [vectorX / pDistance, vectorY / pDistance]
                    newCx = normalVectorX * this.circleRingR + this.circleRingX
                    newCy = normalVectorY * this.circleRingR + this.circleRingY
                    if (this.lineEndX < this.circleRingX) {
                        // angleK
                        angleK += 180 + 360
                    }
                    // angleK = angleK % 360 // 3点方向0度
                    angleK = (angleK % 360 + 270) % 360  // 12点方向0°
                    // 建立旋转坐标变换
                    let circleRingMat = []
                    if (this.lastAngle == 0) {
                        // 0为顺、1为逆this.clockwiseFlage = 0
                        if (angleK > 0 && angleK < 30) {
                            this.clockwiseFlag = 1
                        }
                        else if (angleK > 330 && angleK < 360) {
                            this.clockwiseFlag = 0
                        }
                    } else {
                        // 跨过0°位置
                        if (this.lastAngle > 270 && angleK < 90) {
                            // 逆时针
                            this.clockwiseFlag = 1
                        }
                        else if (angleK > 270 && this.lastAngle < 90) {
                            // 顺时针
                            this.clockwiseFlag = 0
                        }
                    }
                    if (angleK != 0) {
                        // let circleRingMat = bpc_cls.getClockwiseCircleLoc(0, angleK, this.circleRingX, this.circleRingY, this.circleRingR)
                        if (this.clockwiseFlag === 0) {
                            // 顺时针
                            circleRingMat = this.algorithm.getClockwiseCircleLoc(0, angleK, this.circleRingX, this.circleRingY, this.circleRingR)

                        }
                        else if (this.clockwiseFlag === 1) {
                            // 逆时针
                            circleRingMat = this.algorithm.getAnticlockwiseCircleLoc(0, angleK, this.circleRingX, this.circleRingY, this.circleRingR)
                        }
                    }
                    this.lastAngle = angleK
                    circleRingMat = this.algorithm.singleGraphRotate(circleRingMat, [this.circleRingX, this.circleRingY], 90)  // 计算切换方向
                    let circleRingSvg = this.draw.DeconstructionDrawPolylineSvg({
                        polyline_mat: circleRingMat,
                        stroke_width: 20,
                        stroke_color: '#6AD100'
                    })

                    // updateRotateAngleEvent
                    this.props.updateRotateAngleEvent(angleK)
                    this.setState({
                        cx: newCx,
                        cy: newCy,
                        angeleText: this.clockwiseFlag === 1 ? (Math.round(angleK * 1) / 1 + '°') : (360 - Math.round(angleK * 1) / 1 + '°'),
                        rotateSvgMat: circleRingSvg,
                        rotateText: this.clockwiseFlag === 1 ? '逆时针旋转:' : '顺时针旋转:'
                    })
                }

            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                this.choiceCircle = -1
            },

            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },

            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
    }

    componentWillMount() {
        this._createResponder()
    }

    componentDidUpdate() {
        const {gradInfo} = this.props
        this._initTools(gradInfo)
        this._createResponder()
    }

    render() {
        const {rotateSvgMat} = this.state
        return (
            <View style={{
                justifyContent: "center",
                alignItems: "center",
            }}>
                <View style={{ width: this.componentWidth, height: this.componentHeight, backgroundColor: 'transparent', justifyContent: "center", alignItems: "center", }}
                      {...this._panResponderRotatingDisk.panHandlers}>
                    <Svg style={{ backgroundColor: 'transparent', borderRadius: pxToDp(50), alignItems: "center", justifyContent: "center" }}>
                        <Circle
                            cx={this.circleRingX}
                            cy={this.circleRingY}
                            r={this.circleRingR}
                            strokeWidth="20"
                            stroke="white"
                            fill='transparent' />
                        {
                            rotateSvgMat
                        }
                        <Circle
                            cx={this.circleRingX}
                            cy={this.circleRingY}
                            r={this.circleRingR + 10}
                            strokeWidth="3"
                            stroke="black"
                            fill='transparent' />
                        <Circle
                            cx={this.circleRingX}
                            cy={this.circleRingY}
                            r={this.circleRingR - 10}
                            strokeWidth="3"
                            stroke="black"
                            fill='transparent' />
                        <Circle
                            cx={this.state.cx}
                            cy={this.state.cy}
                            r={this.state.cr}
                            strokeWidth="2"
                            stroke="lime"
                            fill={this.state.cCorlor} />
                        <Circle
                            cx={this.componentWidth / 2}
                            cy={this.componentWidth / 2}
                            r={pxToDp(150)}
                            strokeWidth="2"
                            stroke="white"
                            fill={"white"} />
                        <View style={{
                            backgroundColor: 'transparent',
                            height: pxToDp(60), width: pxToDp(60),
                            position: 'absolute',
                            left: this.state.cx - 20,
                            top: this.state.cy - 20,
                            borderRadius: 20,
                            zIndex: 999,
                        }}>
                            <Image
                                source={require("../../../../../images/vector/rotate_btn.png")}
                                style={{width: pxToDp(64), height: pxToDp(64)}}
                            ></Image>
                        </View>
                        <View style={{
                            height: (this.circleRingR - 12) * 2,
                            width: (this.circleRingR - 12) * 2,
                            // backgroundColor: 'wheat',
                            position: 'absolute',
                            top: this.circleRingX - this.circleRingR + 12,
                            left: this.circleRingY - this.circleRingR + 12,
                            borderRadius: (this.circleRingR - 12)
                        }}>
                        </View>
                    </Svg>
                    {/*圈内样式*/}
                </View>
                <View style={{ width: pxToDp(300), height: pxToDp(80), backgroundColor: 'transparent', position: 'absolute', alignContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: pxToDp(50), color: '#49CAE8', fontWeight: "bold" }}>{this.state.angeleText}</Text>
                    <Text style={{ fontSize: pxToDp(40), color: '#49CAE8', }}>{this.state.rotateText}</Text>
                </View>
            </View>
        )
    }
}

export default RotatingDisk
