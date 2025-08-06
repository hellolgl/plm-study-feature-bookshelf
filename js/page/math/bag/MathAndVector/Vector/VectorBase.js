import React, {Component} from "react"
import _ from "lodash"
import {DrawSvgClass} from "./GraphAndNumSVG"
import Svg from "react-native-svg"
import Algorithm from "./Algorithm"

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

class VectorBase extends Component {
    constructor() {
        super()
        this.state = {
            points: [],
            gradInfo: {},
        }
    }

    shouldComponentUpdate(nextProps, nextState , nextContext) {
        if (!_.isEqual(nextProps, this.props)) {
            return true
        } else {
            return false
        }
    }

    moveEvent = (direction) => {
        const eventMap = {
            "left": Algorithm.moveLeft,
            "right": Algorithm.moveRight,
            "up": Algorithm.moveUp,
            "down": Algorithm.moveDown,
        }
        const moveFunction = eventMap[direction]
        const {points, gradInfo, updatePointsEvent} = this.props
        const newPoints = moveFunction(gradInfo, points)
        updatePointsEvent([newPoints])
    }

    rotateEvent = (direction) => {
        const eventMap = {
            "clockwise": Algorithm.rotateClockwise,
            "eastern": Algorithm.rotateEastern,
        }
        // pointOne
        const {points, gradInfo, updatePointsEvent, externalProps} = this.props
        const {pointOne} = externalProps
        log("receive pointOne: ", pointOne)
        const moveFunction = eventMap[direction]
        const newPoints = moveFunction(gradInfo, points, pointOne)
        updatePointsEvent([newPoints])
    }

    render() {
        const {points, gradInfo} = this.props
        const {width, height} = gradInfo
        const draw = new DrawSvgClass(width, height)
        const svgData = draw.DrawPolygonSvg(points,  "black", 3, "transparent")
        log("Parallelogram: ", svgData)
        return <CustomSvg
            width={width}
            height={height}
            svgData={svgData}
        />
    }
}

export default VectorBase