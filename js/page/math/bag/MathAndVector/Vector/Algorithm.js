import {BaseProcessClass, GriddingClass} from "./GraphAndNumAlgorithm"
import _ from "lodash"

const log = console.log.bind(console)

class Algorithm {
    constructor(gradInfo) {
        const {width, height, gridNumsPixels} = gradInfo
        this.grad = new GriddingClass(width, height, 0, height, gridNumsPixels)
        this.opBase = new BaseProcessClass(gridNumsPixels)
    }

    reducePoints = (points) => {
        const newPoints = points.map(point => this.grad.CoordinateTransformImg(point))
        return newPoints
    }

    allImgToCording = (points) => {
        return this.grad.AllGraphImgToCoordinate(points)
    }

    computeMovePoints = (points, moveInfo) => {
        return this.opBase.DataMove2D(points, moveInfo)
    }

    moveLeft = (points) => {
        const gridNumsPixels = this.grad.per_pixels
        const d = this.computeMovePoints(points[0], [gridNumsPixels * -1, 0])
        return d
    }

    moveRight = (points) => {
        const gridNumsPixels = this.grad.per_pixels
        const d = this.computeMovePoints(points[0], [gridNumsPixels, 0])
        return d
    }

    moveUp = (points) => {
        const gridNumsPixels = this.grad.per_pixels
        const d = this.computeMovePoints(points[0], [0, gridNumsPixels * -1])
        return d
    }

    moveDown = (points) => {
        const gridNumsPixels = this.grad.per_pixels
        const d = this.computeMovePoints(points[0], [0, gridNumsPixels])
        return d
    }

    rotateClockwise = (points, pointOne, rotateAngle) => {
        // log("顺时针")
        const newPoints = points[0].map(points => this.opBase.PointRotate(pointOne[0][0], points, -30))
        return newPoints
    }

    rotateEastern = (points, pointOne, rotateAngle) => {
        const newPoints = points[0].map(points => this.opBase.PointRotate(pointOne[0][0], points, rotateAngle))
        return newPoints
    }

    judgeTouchGraphIndex = ([startX, startY], points) => {
        let choiceData = this.opBase.JudgeTouchGraphIdx([startX, startY], points)
        return choiceData
    }
    judgeTouchPolygonIdx = ([startX, startY], points) => {
        return this.opBase.JudgeTouchPolygonIdx([startX, startY], points)
    }
    // 建立自动吸附计算----控制距离内绘制圆圈，更新坐标显示，释放后自动判定是否为吸附计算
    endPointAdsorptionCalculate = (points, graphIndex, tmpGraphMat) => {
        let contrastMat = this.opBase.EndpointAdsorptionCalculate(points, graphIndex, tmpGraphMat)
        return contrastMat
    }

    judgeCombineLine = (points) => {
        let combineIdxMat = this.opBase.JudgeCombineLine(points)
        return combineIdxMat
    }

    judgeClosedGraph = (points, combineMat) => {
        const closedGraphMat = this.opBase.JudgeClosedGraph(points, combineMat)
        return closedGraphMat
    }

    linkLinePoint = (closedGraphMat) => {
        return this.opBase.LinkLinePoint(closedGraphMat)
    }

    calculateSideAbsorb = (points, graphIndex, tmpGraphMat) => {
        return this.opBase.CalculateSideAbsorb(points, graphIndex, tmpGraphMat)
    }

    twoPointDistance = (pointA, pointB) => {
        return this.opBase.TwoPointDistance(pointA, pointB)
    }

    combineReorderData = (points, tmpGraphMat, neighborSideMat) => {
        return this.opBase.CombineReorderData(points, tmpGraphMat, neighborSideMat)
    }

    judgePointInLine = (lineMat, point) => {
        return this.opBase.JudgePointInLine(lineMat, point)
    }

    parallelogramMoveLine = (point, parallelogramMat, choiceLineIndex) => {
        // 平行四边形不稳定性验证，周长不变
        return this.opBase.ParallelogramMoveLine(point, parallelogramMat, choiceLineIndex)
    }
    twoLineVectorMove = (lineAMat, lineBMat, moveLineMat) => {
        let [newLineA, newLineB] = this.opBase.TwoLineVectorMove(lineAMat, lineBMat, moveLineMat)
        return [newLineA, newLineB]
    }
    getLineLength = (points) => {
        let graphMat = this.opBase.getAllGraphLocText(points)
        return graphMat
    }
    judgePointInPoint = (touchPoint, points) => {
        const [s, e] = this.opBase.JudgePointInPoint(touchPoint, points)
        return [s, e]
    }
    calculateHighLine2 = (touchPoint, verticalIntersctionMat, lineMat,) => {
        return this.opBase.CalculateHighLine2([touchPoint, verticalIntersctionMat], lineMat, 15) // 重新计算垂直符号
    }
    allCalculateHighLine2 = (cutLineMat, selectGraphPoints, selectPointIndex) => {
        return this.opBase.AllCalculateHighLine2(cutLineMat, selectGraphPoints, selectPointIndex, 15)
    }
    getPointToLineVerticalPoint = (lineMat, touchPointMat) => {
        return this.opBase.getPointToLineVerticalPoint(lineMat, touchPointMat) // 固定垂点
    }
    calculateNearestPoint = (touchPoint, nearPointA, nearPointB) => {
        return this.opBase.CalculateNearestPoint(touchPoint, nearPointA, nearPointB)
    }
    calculateVirtualVerticalIntersection = (cutLineMat, pointExtendedMat, intersectMat) => {
        return this.opBase.CalculateVirtualVerticalIntersection(cutLineMat[0], cutLineMat[1], pointExtendedMat, [intersectMat[1], intersectMat[2]])
    }
    calculateAllGraphHeight = (points, cutLineMat) => {
        return this.opBase.CalculateAllGraphHeight(points, cutLineMat, 15)
    }
    allGraphRotate = (allGraphMat, fixedPoint, angle) => {
        return this.opBase.AllGraphRotate(allGraphMat, fixedPoint, angle)
    }
    // 原始文本坐标旋转
    allGraphTextRotate = (allTextMat, fixedPoint, rotateAngle) => {
        return this.opBase.AllGraphTextRotate(allTextMat, fixedPoint, rotateAngle)
    }
    // 顺时针计算圆环坐标
    getClockwiseCircleLoc = (startAngle, endAngle, centerX, centerY, radius, pointNum) => {
        return this.opBase.getClockwiseCircleLoc(startAngle, endAngle, centerX, centerY, radius)
    }
    // 逆时针计算圆环坐标
    getAnticlockwiseCircleLoc = (startAngle, endAngle, centerX, centerY, radius, pointNum) => {
        return this.opBase.getAnticlockwiseCircleLoc(startAngle, endAngle, centerX, centerY, radius, pointNum)
    }
    // 单幅图像绕固定点旋转
    singleGraphRotate = (singleGraphMat, fixedPoint, rotateAngle) => {
        return this.opBase.SingleGraphRotate(singleGraphMat, fixedPoint, rotateAngle)
    }
    allGraphCoordinateToImg = (allGraphCoordinateMat) => {
        return this.grad.AllGraphCoordinateToImg(allGraphCoordinateMat)
    }
    // 判断图形是否越界
    judgeGraphInRengion = (moveGraphMat, gradInfo) => {
        return this.opBase.JudgeGraphInRengion({ graph_mat: moveGraphMat, min_x: 0, max_x: gradInfo["width"] - 4, min_y: 0, max_y: gradInfo["height"] - 4 })
    }
    getGridAdsorptionIdx = (startPoint) => {
        return this.opBase.getGridAdsorptionIdx(this.grad.img_x_mat, this.grad.img_y_mat, startPoint, 0.5)
    }
    // 对称轴诊断
    JudgePointInLineFlag = (point_mat, line_mat)=>{
       return this.opBase.JudgePointInLineFlag(point_mat, line_mat)
    }
    // 操作题诊断
    JudgeDrawGraphLine = (answer_point_mat, draw_line_mat)=>{
        return this.opBase.JudgeDrawGraphLine(answer_point_mat, draw_line_mat)
    }

    // 验证答案是否正确
    // checkParallelogramAnswerBak = (answer, userAnswer) => {
    //     // const answer = [
    //     //     [5, 2],
    //     //     [6, 5],
    //     //     [10, 5],
    //     //     [9, 2],
    //     //     [5, 2],
    //     // ]
    //     //
    //     // const userAnswer = [
    //     //     [6, 5],
    //     //     [5, 2],
    //     //     [6, 5],
    //     //     [10, 5],
    //     //     [10, 5],
    //     //     [9, 2],
    //     //     [5, 2],
    //     //     [9, 2],
    //     // ]
    //
    //     const arrToDict = (arr) => {
    //         const d = {}
    //         for (let i = 0; i < arr.length; i++) {
    //             const a = arr[i]
    //             d[JSON.stringify(a)] = 0
    //         }
    //         return d
    //     }
    //
    //     const lineNums = answer.length - 1
    //
    //     const answerLineNumsDict = {}
    //     const userLineNumsDict = arrToDict(userAnswer)
    //
    //     // const isEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2)
    //
    //     for (let i = 0; i < lineNums; i++) {
    //         const point = answer[i]
    //         const nextPointA = answer[(i + (lineNums - 1)) % lineNums]
    //         const nextPointB = answer[(i + (lineNums + 1)) % lineNums]
    //
    //         const lineA = [point, nextPointA]
    //         const lineB = [point, nextPointB]
    //
    //         // log("point: ", point)
    //         // log("nextPointA: ", nextPointA)
    //         // log("nextPointB: ", nextPointB)
    //
    //         answerLineNumsDict[JSON.stringify(lineA)] = 0
    //
    //         for (let j = i * 2; j < userAnswer.length; j+=2) {
    //             const userPoint = userAnswer[j]
    //             const userNextPoint = userAnswer[j + 1]
    //             const userLine = [userPoint, userNextPoint]
    //             // log("userLine: ", userLine)
    //             if ((_.isEqual(userLine, [point, nextPointA]) || _.isEqual(userLine, [nextPointA, point])) || (_.isEqual(userLine, [point, nextPointB]) || _.isEqual(userLine, [nextPointB, point]))) {
    //             // if ((isEqual(userLine, [point, nextPointA]) || isEqual(userLine, [nextPointA, point])) || (isEqual(userLine, [point, nextPointB]) || isEqual(userLine, [nextPointB, point]))) {
    //                 answerLineNumsDict[JSON.stringify(lineA)] = 1
    //                 userLineNumsDict[JSON.stringify(userPoint)] = userLineNumsDict[JSON.stringify(userPoint)] + 1
    //                 userLineNumsDict[JSON.stringify(userNextPoint)] = userLineNumsDict[JSON.stringify(userNextPoint)] + 1
    //                 break
    //             }
    //         }
    //     }
    //
    //     const checkAnswerResult = Array.from(new Set(Object.values(answerLineNumsDict)))
    //     const checkUserInfoResult = Array.from(new Set(Object.values(userLineNumsDict)))
    //
    //     if (((checkAnswerResult.length === 1) && (checkAnswerResult[0] === 1)) && ((checkUserInfoResult.length === 1) && (checkUserInfoResult[0] === 2))) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    // 验证答案是否正确
    checkParallelogramAnswer = (answer, userAnswer) => {
        // const answer = [
        //     [5, 2],
        //     [6, 5],
        //     [10, 5],
        //     [9, 2],
        //     [5, 2],
        // ]
        //
        // const userAnswer = [
        //     [6, 5],
        //     [5, 2],
        //     [6, 5],
        //     [10, 5],
        //     [10, 5],
        //     [9, 2],
        //     [5, 2],
        //     [9, 2],
        // ]

        // const answer = [
        //     [5, 7],
        //     [7, 6],
        //     [6, 6],
        //     [8, 5],
        //     [6, 5],
        //     [6, 3],
        //     [5, 3],
        // ]
        //
        // const userAnswer = [
        //     [5, 7],
        //     [7, 6],
        //     [7, 6],
        //     [6, 6],
        //     [6, 6],
        //     [8, 5],
        //     [8, 5],
        //     [6, 5],
        //     [6, 5],
        //     [6, 3],
        //     [5, 3],
        //     [6, 3],
        // ]

        const arrToDict = (arr) => {
            const d = {}
            for (let i = 0; i < arr.length; i++) {
                const a = arr[i]
                d[JSON.stringify(a)] = 0
            }
            return d
        }

        const isEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2)

        const answerLineNumsDict = arrToDict(answer)

        for (let i = 0; i < userAnswer.length; i+=2) {
            const userPoint = userAnswer[i]
            const nextUserPoint = userAnswer[i + 1]
            const userLine = [userPoint, nextUserPoint]
            for (let j = 0; j < answer.length; j++) {
                const answerPoint = answer[j]
                const nextAnswerPoint = answer[j + 1]

                // if (_.isEqual(userLine, [answerPoint, nextAnswerPoint]) || _.isEqual(userLine, [nextAnswerPoint, answerPoint])) {
                if (isEqual(userLine, [answerPoint, nextAnswerPoint]) || isEqual(userLine, [nextAnswerPoint, answerPoint])) {
                    answerLineNumsDict[JSON.stringify(answerPoint)] = answerLineNumsDict[JSON.stringify(answerPoint)] + 1
                    answerLineNumsDict[JSON.stringify(nextAnswerPoint)] = answerLineNumsDict[JSON.stringify(nextAnswerPoint)] + 1
                    break
                }
            }
        }

        log("checkAnswerResult: ", answerLineNumsDict)

        if (answer[0] === answer[answer.length - 1]) {
            const checkAnswerResult = Array.from(new Set(Object.values(answerLineNumsDict)))
            if ((checkAnswerResult.length === 1) && (checkAnswerResult[0] === 2)) {
                return true
            } else {
                return false
            }
        } else {
            const v = Object.values(answerLineNumsDict)
            for (let i = 0; i < v.length; i++) {
                const _v = v[i]
                if ((i === 0) && (_v === 1)) {
                    continue
                } else if ((i === v.length - 1) && (_v === 1)) {
                    continue
                } else if (_v === 2) {
                    continue
                } else {
                    return false
                }
            }
            return true
        }
        // if (((checkAnswerResult.length === 1) && (checkAnswerResult[0] === 1)) && ((checkUserInfoResult.length === 1) && (checkUserInfoResult[0] === 2))) {
        //     return true
        // } else {
        //     return false
        // }
    }
}

export default Algorithm