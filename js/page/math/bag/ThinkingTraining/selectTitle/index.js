import React, {PureComponent} from "react"
import {
    Dimensions,
    StyleSheet,
    View,
} from "react-native"

import ClickSelectFrame from './ClickSelectFrame'
import {pxToDp} from "../../../../../util/tools"

const log = console.log.bind(console)

class SelectTitle extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            completion_mat: [],
            img_uri: "",
            choice_data: [],
            choice_loc: [],
            img_size: [],
            stem: "",
            answer: [],
            alignDirection: [],
            ability: "",
        }
    }

    _getData = (completion_mat0) => {
        this.setState({
            completion_mat: completion_mat0,
        })
    }

    componentWillUpdate(nextProps) {
        // log("nextProps.rawData: ", nextProps.rawData)
        if (this.props.rawData["stem_img"] !== nextProps.rawData["stem_img"]) {
            let {rawData} = nextProps
            const {stem, tto} = rawData
            let imgWidth = rawData['img_long']
            let imgHeight = rawData['img_wide']
            let imgUrl = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${rawData['stem_img']}`
            let choiceData = []
            let choiceLoc = []
            let answer = []
            let alignDirection = []
            for (let i = 0; i < tto.length; i++) {
                let item = tto[i]
                let option = item['option']
                choiceData.push(option)
                let x = item['img_long']
                let y = item['img_wide']
                if (x !== 0 && y !== 0) {
                    answer.push([x, y, option])
                    choiceLoc.push([x, y, option])
                }
                let direction = item['choice_content_type']
                if (direction === "0") {
                    alignDirection.push("middle")
                } else if (direction === "1") {
                    alignDirection.push("left")
                } else {
                    alignDirection.push("right")
                }
            }
            this.setState({
                img_uri: imgUrl,
                choice_data: choiceData,
                choice_loc: choiceLoc,
                img_size: [imgWidth, imgHeight],
                answer,
                stem,
                alignDirection,
                ability: rawData["ability"],
            })
        }
    }

    componentWillMount() {
        const {rawData} = this.props
        let imgWidth = rawData['img_long']
        let imgHeight = rawData['img_wide']
        let imgUrl = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${rawData['stem_img']}`
        let stem = rawData['stem']
        let tto = rawData['tto']
        let choiceData = []
        let choiceLoc = []
        let answer = []
        let alignDirection = []
        for (let i = 0; i < tto.length; i++) {
            let item = tto[i]
            let option = item['option']
            choiceData.push(option)
            let x = item['img_long']
            let y = item['img_wide']
            if (x !== 0 && y !== 0) {
                answer.push([x, y, option])
                choiceLoc.push([x, y, option])
            }
            let direction = item['choice_content_type']
            if (direction === "0") {
                alignDirection.push("middle")
            } else if (direction === "1") {
                alignDirection.push("left")
            } else {
                alignDirection.push("right")
            }
        }
        this.setState({
            img_uri: imgUrl,
            choice_data: choiceData,
            choice_loc: choiceLoc,
            img_size: [imgWidth, imgHeight],
            answer,
            stem,
            alignDirection,
            ability: rawData["ability"],
        })
    }

    render() {
        const {choice_data, choice_loc, img_size, img_uri, alignDirection, ability } = this.state
        const {tid} = this.props.rawData
        let combine_data = {
            img_uri: { uri: img_uri },                   // uri封装路径
            img_require: "",           // require封装路径
            choice_data: choice_data,           // 选项
            choice_loc: choice_loc,             // 填空坐标
            align_direction: alignDirection,   // 填空文字对齐展示方向
            img_size: img_size,                 // 图片大小
            choice_frame_width: 700,             // 选项框宽度设置
            ability: ability,
            tid
        }     // 组件需要数据组装
        // log("combine_data: ", combine_data)
        return (
            <View style={[styles.content]}>
                <View style={[styles.questionPosition]}>
                    <ClickSelectFrame _getData={this._getData} level={this.props.level} combine_data={combine_data} receiveAnswer={this.props.receiveAnswer}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        left: pxToDp(70),
        width: Dimensions.get("window").width * 0.9,
        // borderWidth: 1,
        // borderColor: "black",
        // height: Dimensions.get("window").height * 0.5
    },
    title: {
        fontSize: pxToDp(36),
        // paddingBottom: -1000,
    },
    questionText: {
        fontSize: pxToDp(35),
        fontWeight: "100",
    },
    questionPosition: {
      top: -10,
    },
})

export default SelectTitle
