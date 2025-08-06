import React, {Component} from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    SafeAreaView,
    Dimensions, 
    FlatList,
    ScrollView,
} from "react-native"
import Svg from "react-native-svg"
import _, { constant } from "lodash"
import {pxToDp} from "../../../../../util/tools"
import NavigationUtil from "../../../../../navigator/NavigationUtil"
import {DrawSvgClass} from "./GraphAndNumSVG"
import axios from "../../../../../util/http/axios"
import api from "../../../../../util/http/api"
import Parallelogram from "./Parallelogram"
import Grad from "./Grad"
import RotatingDisk from "./RotatingDisk"
import MathNavigationUtil from "../../../../../navigator/NavigationMathUtil";
import KeyboardAndAnswer from './components/Keyboard/KeyboardAndAnswer'
import { appStyle } from "../../../../../theme"
import { Toast } from "antd-mobile-rn";
import ResovingModal from './components/ResovingModal'



const os = Platform.OS
const log = console.log.bind(console)

class VectorOperator extends Component {
    constructor(props) {
        super(props)
        this.width = 1100
        this.height = os==="ios"? 1240: 880
        this.opBase = null
        this.draw = new DrawSvgClass(pxToDp(this.width), pxToDp(this.height))

        this.vectorInstance = React.createRef()
        this.rotatingDiskInstance = React.createRef()
        this.KeyboardAndAnswer = null;
        this.gestureState = {
            funcMode: "",
        }

        this.state = {
            currentOperator: "概念",
            svgData: [],
            operatorInfoList: [
                {
                    name: "概念",
                    imgUrl: require(`../../../../../images/vector/gainian.png`),
                },
                {
                    name: "特点",
                    imgUrl: require(`../../../../../images/vector/tedian.png`),
                },
                {
                    name: "周长",
                    imgUrl: require(`../../../../../images/vector/zhouchang.png`),
                },
                {
                    name: "面积",
                    imgUrl: require(`../../../../../images/vector/mianji.png`),
                },
                {
                    name: "平移",
                    imgUrl: require(`../../../../../images/vector/pingyi.png`),
                },
                {
                    name: "旋转",
                    imgUrl: require(`../../../../../images/vector/xuanzhuan.png`),
                },
            ],
            operatorInfo: [],
            gifModalShow: false,
            gifInfo: {
                imgWidth: 0,
                imgHeight: 0,
            },
            // 是否显示网格, 否则显示点状图
            isGrid: true,
            movePoints: [],
            drawMovePoints: [],
            removeLimit: [],
            elementStatus: "0",
            gridNumsPixels: 15,
            textSvg: [],
            externalData: [],
            gradInfo: {
                width: pxToDp(this.width),
                height: pxToDp(this.height),
                gridNumsPixels: 15,
            },
            vectorOPEvent: "",
            refreshFlag: false,
            currentMoveInfo: [0, 0, 0, 0],
            rotateAngle: 0,
            btnInfo:{},
            showCreatTopic:false,
            creatStem:'',
            creatAnswer:'',
            resolve:'',
            diagnosisByFrontVal:'',
            visible:false
        }
        this.vector = null
    }

    getAnswer = (value) => {
        if(value.length === 0) return
        this.setState({
          diagnosisByFrontVal:value,
        })
      };

    drawGrad = (gridNumsPixels) => {
        const grad = Grad.draw(pxToDp(this.width), pxToDp(this.height), gridNumsPixels)
        return grad
    }

    getOpData = async (g_n_id, currentOperator) => {
        const url = `${api.getMathGraphButtonInfoList}?g_n_id=${g_n_id}`
        const res = await axios.get(url)
        let operatorInfoList = res.data.data
        operatorInfoList = this.concatOperatorInfo(operatorInfoList)
        const o = operatorInfoList.filter(item => item.name === currentOperator)[0]
        const rawData = await this.getOperatorDetail(o["g_b_id"])
        return {rawData, operatorInfoList}
    }

    getGridNumsPixels = (width, gridSize) => {
        return pxToDp(width / gridSize)
    }

    reducePoints = (receiveData) => {
        if (receiveData["detail"].includes("平移")) {
            const {grid_size, remove, point} = receiveData["button"][0]
            const gridNumsPixels = this.getGridNumsPixels(this.width, grid_size[0])
            const gradInfo = {
                width: pxToDp(this.width),
                height: pxToDp(this.height),
                gridNumsPixels,
            }
            // const newPoints = Algorithm.reducePoints(gradInfo, point)
            this.setState({
                movePoints: point,
                gridNumsPixels,
                removeLimit: remove[0],
                gradInfo,
                currentOperator: "平移",
                currentMoveInfo: [0,0,0,0],
                pointOne: [],
            })
        } else if (receiveData["detail"].includes("旋转")) {
            const {grid_size, point, point_one} = receiveData["button"][0]
            const gridNumsPixels = this.getGridNumsPixels(this.width, grid_size[0])
            const gradInfo = {
                width: pxToDp(this.width),
                height: pxToDp(this.height),
                gridNumsPixels,
            }
            this.setState({
                movePoints: point,
                gridNumsPixels,
                pointOne: [[point_one]],
                currentOperator: "旋转",
                gradInfo,
                currentMoveInfo: [0,0,0,0],
            })
        }
    }

    async componentDidMount() {
        const {currentOperator} = this.state
        const {g_n_id} = this.props.navigation.state.params.data
        const {rawData, operatorInfoList} = await this.getOpData(g_n_id, currentOperator)
        const {data, element_status} = rawData
        this.setState({
            operatorInfoList,
            operatorInfo: data,
            elementStatus: element_status
        })
        await this.reducePoints(data[0])
    }

    getOperatorDetail = async (g_b_id) => {
        const url = `${api.getMathGraphButtonInfo}?g_b_id=${g_b_id}`
        const res = await axios.get(url)
        const opData = res.data.data
        return opData
    }

    getImageSize = async (uri) => new Promise(resolve => {
        Image.getSize(uri, (width, height) => {
            resolve([width, height])
        })
    })

    concatOperatorInfo = (r) => {
        const operatorImgInfo = {
            "概念": require(`../../../../../images/vector/gainian.png`),
            "特点": require(`../../../../../images/vector/tedian.png`),
            "周长": require(`../../../../../images/vector/zhouchang.png`),
            "面积": require(`../../../../../images/vector/mianji.png`),
            "平移": require(`../../../../../images/vector/pingyi.png`),
            "旋转": require(`../../../../../images/vector/xuanzhuan.png`),
        }
        r = r.map(item => {
            return {
                name: item.name,
                imgUrl: operatorImgInfo[item.name],
                g_b_id: item["g_b_id"]
            }
        })
        return r
    }

    toggleOperator = async (operator) => {
        // 清除操作逻辑所对应的函数
        this.gestureState.funcMode = ""
        const {operatorInfoList, gradInfo} = this.state
        const o = operatorInfoList.filter(item => item.name === operator)[0]
        const opData = await this.getOperatorDetail(o["g_b_id"])
        const {data} = opData
        const specialOpList = ["平移", "旋转"]
        if (specialOpList.includes(operator)) {
            const receiveData = data[0]
            this.reducePoints(receiveData)
            this.gestureState.funcMode = operator
            log("gestureState.funcMode: ", this.gestureState.funcMode)
            await this.setState({
                currentOperator: operator,
                operatorInfo: data,
                // 切换类别时，恢复网格显示
                gifModalShow: false,
                isGrid: true,
                showCreatTopic:false,
                isCreat:false
            })
        } else {
            await this.setState({
                currentOperator: operator,
                operatorInfo: data,
                // 切换类别时，恢复网格显示
                gifModalShow: false,
                movePoints: [],
                drawMovePoints: [],
                externalData: [],
                isGrid: true,
                gradInfo: {...gradInfo, gridNumsPixels: 15,},
                pointOne: [],
                btnInfo:{},
                showCreatTopic:false,
                isCreat:false
            })
        }
    }

    renderItem = ({ item, currentOperator }) => {
        return (
            <TouchableOpacity style={[styles.sideBarItem, item.name === currentOperator? styles.selectedItem: {}]}
                              onPress={() => this.toggleOperator(item.name)}
            >
                <Image
                    source={item.imgUrl}
                    style={{width: pxToDp(88), height: pxToDp(88)}}
                ></Image>
                <View style={[{width: pxToDp(88), alignItems: "center", textAlign: "center", justifyContent: "center"}]}>
                    <Text style={[styles.sideBarFont]}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    initSvgPaddle = (btnInfo, funcMode, otherSvg=[]) => {
        log("funcMode: ", funcMode)
        const {gradInfo} = this.state
        // 展示 svg 相关组件
        const {grid_size, point} = btnInfo
        const gridNumsPixels = this.getGridNumsPixels(this.width, grid_size[0])
        const newGradInfo = {
            ...gradInfo,
            gridNumsPixels,
        }

        this.setState({
            gradInfo: newGradInfo,
            movePoints: point,
            gifModalShow: false,
        })
    }

    btnEvent = async(btnInfo) => {
        const {b_t_name} = btnInfo
        log("b_t_name: ", b_t_name)
        if (b_t_name === "演示") {
            const {img_url} = btnInfo
            let imgUri = `https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${img_url}`
            let [w, h] = await this.getImageSize(imgUri)
            this.setState({
                gifModalShow: true,
                gifInfo: {
                    imgUrl: imgUri,
                    imgWidth: w * 2.0,
                    imgHeight: h * 2.0,
                }
            })
        } else if (b_t_name === "边长变化") {
            log("将要展示周长")
            const {name} = btnInfo
            // 展示 svg 相关组件
            if(name === '自由创作'){
                log('自由创作')
                // this.reductionEvent()
            }
            this.gestureState.funcMode = "graphText"
            // 展示 svg 相关组件
            this.initSvgPaddle(btnInfo, "graphText")
        } else if (b_t_name === "做高") {
            log("做高")
            // 展示 svg 相关组件
            this.gestureState.funcMode = "auxiliaryHigh"
            this.initSvgPaddle(btnInfo, "auxiliaryHigh")
        } else if (b_t_name === "垂直分割") {
            log("垂直分割")
            // 展示 svg 相关组件
            this.gestureState.funcMode = "cutAbsorb"
            this.initSvgPaddle(btnInfo, "cutAbsorb")
        } else if (b_t_name === "面积变化") {
            log("面积变化")
            const {name} = btnInfo
            // 展示 svg 相关组件
            if(name === '自由创作'){
                log('自由创作')
                this.reductionEvent()
            }
            this.gestureState.funcMode = "graphArea"
            this.initSvgPaddle(btnInfo, "graphArea",)
        } else if (b_t_name === "拖拽组合") {
            this.setState({
                vectorOPEvent: "拖拽组合",
            })
            const {name} = btnInfo
            if (name === "拖拽拼接") {
                log("拖拽线条")
                const funcMode = "combineLine"
                this.gestureState.funcMode = funcMode
                this.initSvgPaddle(btnInfo, funcMode)
            } else if (name === "拖一拖") {
                log("拖一拖")
                this.initSvgPaddle(btnInfo, "combination", )
                this.gestureState.funcMode = "combination"
            }
        } else if (b_t_name === "稳定性") {
            this.gestureState.funcMode = "lineMove"
            this.initSvgPaddle(btnInfo, "line_move")
        }
        const {name} = btnInfo
        // 展示 svg 相关组件
        if(name === '自由创作'){
            log('自由创作')
            this.setState({
                isCreat:true
            })
        }else{
            this.setState({
                isCreat:false
            })
        }
        this.setState({
            btnInfo,
        })
    }

    parseText = (text) => {
        let c = text.replaceAll("<p>", "")
        c = c.replaceAll("</p>", "")
        if (c.includes("：")) {
            const [title, info] = c.split("：")
            return (
                <View
                    style={{
                        marginBottom: pxToDp(20),
                    }}
                >
                    <View>
                        <Text style={{fontSize: pxToDp(50), lineHeight: pxToDp(70), fontWeight: "bold"}}>
                            {`${title}：`}
                        </Text>
                    </View>
                    <View>
                        <Text style={{fontSize: pxToDp(36), lineHeight: pxToDp(70)}}>
                            {info}
                        </Text>
                    </View>
                </View>
            )
        } else {
            return (
                <Text style={{fontSize: pxToDp(36), lineHeight: pxToDp(70)}}>
                    {c}
                </Text>
            )
        }
    }

    parseBtn = (info) => {
        const {btnInfo} = this.state
        const {name, b_t_name, img_url} = info
        if(b_t_name === '演示'){
            return (
                <TouchableOpacity
                    style={[styles.btn,{backgroundColor:btnInfo.g_b_b_id === info.g_b_b_id?'#B4CFFF':'#E9F1FF'}]}
                    onPress={() => {this.btnEvent(info)}}
                >
                    <Text style={[styles.btnText,{color:'#4E88FD'}]}>
                        {name}
                    </Text>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity
                style={[styles.btn,{backgroundColor:btnInfo.g_b_b_id === info.g_b_b_id?'#9EF1B8':'#DEFFE9'}]}
                onPress={() => {this.btnEvent(info)}}
            >
                <Text style={[styles.btnText,{color:'#01CC42'}]}>
                    {name}
                </Text>
            </TouchableOpacity>
        )
    }

    parseStem = (operatorInfo) => {
        const r = []
        for (let i = 0; i < operatorInfo.length; i++) {
            let item = operatorInfo[i]
            const {detail, button} = item
            const detailText = this.parseText(detail)
            r.push(detailText)
            // 操作按钮的渲染排在题干描述后面
            if (button.length !== 0) {
                const btns = []
                for (let b of button) {
                    btns.push(this.parseBtn(b))
                }
                r.push(
                    <View style={{flexDirection: "row",flexWrap:'wrap'}}>
                        {btns}
                    </View>
                )
            }
            if (detail.includes("改变周长")) {
                const {externalData} = this.state
                if (externalData.length !== 0) {
                    r.push(<Text style={{fontSize: pxToDp(32)}}>{`C = 2 x ( ${externalData[0]} + ${externalData[1]} ) = ${externalData[2]}`}</Text>)
                }
            }
            if (detail.includes("面积公式")) {
                const {externalData} = this.state
                if (externalData.length !== 0) {
                    r.push(<Text style={{fontSize: pxToDp(32)}}>{`S = ${externalData[0]} x ${externalData[1]} = ${externalData[2]}`}</Text>)
                }
            }
        }
        return r
    }

    toggleGrid = () => {
        let {isGrid} = this.state
        isGrid = !isGrid
        this.setState({
            isGrid,
        })
    }

    moveEvent = (direction) => {
        const {removeLimit, currentMoveInfo} = this.state
        const [upLimit, downLimit, leftLimit, rightLimit] = removeLimit
        let [currentUp, currentDown, currentLeft, currentRight] = currentMoveInfo
        let doFlag = true
        const _upEvent = () => {
            if (currentUp >= upLimit) {
                doFlag = false
                return
            }
            if (currentDown > 0) {
                currentDown = currentDown - 1
            } else {
                currentUp  = currentUp + 1
            }
        }
        const _downEvent = () => {
            if (currentDown >= downLimit) {
                doFlag = false
                return
            }
            if (currentUp > 0) {
                currentUp = currentUp - 1
            } else {
                currentDown  = currentDown + 1
            }
        }
        const _leftEvent = () => {
            if (currentLeft >= leftLimit) {
                doFlag = false
                return
            }
            if (currentRight > 0) {
                currentRight = currentRight - 1
            } else {
                currentLeft  = currentLeft + 1
            }
        }
        const _rightEvent = () => {
            if (currentRight >= rightLimit) {
                doFlag = false
                return
            }
            if (currentLeft > 0) {
                currentLeft = currentLeft - 1
            } else {
                currentRight  = currentRight + 1
            }
        }
        const m = {
            "up": _upEvent,
            "down": _downEvent,
            "left": _leftEvent,
            "right": _rightEvent,
        }
        const e = m[direction]
        e()
        this.setState({
            currentMoveInfo: [currentUp, currentDown, currentLeft, currentRight],
        })
        if (doFlag) {
            this.vectorInstance.current.moveEvent(direction)
        }
    }

    updateRotateAngle = (angle) => {
        const {movePoints} = this.state
        this.vectorInstance.current.rotateEvent(movePoints, angle)
    }

    todoExcersice = ()=>{
        const {currentOperator,operatorInfoList} = this.state
        const o = operatorInfoList.filter(item => item.name === currentOperator)[0]
        MathNavigationUtil.toVectorDoexercise({...this.props,data:{g_b_id:o.g_b_id,name:currentOperator}})
    }

    release = (fomular_values)=>{
        const {btnInfo} = this.state
        const {b_t_name} = btnInfo
        // console.log('fomular_values',fomular_values,b_t_name)
        if(b_t_name === '边长变化'){
            // 周长
            let answer_arr = [fomular_values[0],fomular_values[1],2*(fomular_values[0]*10 + fomular_values[1]*10) / 10.0]
            let obj = {
                0:'一条边=',
                1:'一条边=',
                2:'周长='
            }
            const r = Math.floor(Math.random() * 3)  //生成[0,2]的随机数
            let stem_arr = []
            let unit = '厘米'
            answer_arr.forEach((item,index)=>{
                if(index !== r){
                    stem_arr.push(obj[index]+item+unit)
                }
            })
            if(r === 0 || r === 1){
                stem_arr.push('另'+ obj[r]+'(   ) '+unit+'？')
            }else{
                stem_arr.push(obj[r]+'(   ) '+unit+'？')
            }
            console.log('题干信息',stem_arr)
            console.log('答案',answer_arr[r])
            let resolve = ''
            if(r === 0) resolve = answer_arr[2]+ '÷2' + '-' + answer_arr[1] + '=' + answer_arr[0] + '(厘米)'
            if(r === 1) resolve = answer_arr[2]+ '÷2' + '-' + answer_arr[0] + '=' + answer_arr[1] + '(厘米)'
            if(r === 2) resolve = '(' + answer_arr[0] + '+' + answer_arr[1]+ ')' + '×2'+ '=' + answer_arr[2] + '(厘米)'
            console.log('解析',resolve)
            this.setState({
                showCreatTopic:true,
                creatStem:stem_arr,
                creatAnswer:answer_arr[r],
                resolve
            },()=>{
                if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
            })
        }else{
            // 面积变化
            let answer_arr = [fomular_values[0],fomular_values[1], ((fomular_values[0] * 10) * (fomular_values[1] * 10)) / 100.0]
            let obj = {
                0:'底=',
                1:'高=',
                2:'面积='
            }
            const r = Math.floor(Math.random() * 3)  //生成[0,2]的随机数
            let stem_arr = []
            answer_arr.forEach((item,index)=>{
                let unit = ''
                if(index !== r){
                    if(index !== 2){
                        unit = '厘米'
                    }else{
                        unit = '平方厘米'
                    }
                    stem_arr.push(obj[index]+item+unit)
                }
            })
            let answerUnit = r === 2?'平方厘米':'厘米'
            stem_arr.push(obj[r]+'(   ) '+answerUnit+'？')
            console.log('题干信息',stem_arr)
            console.log('答案',answer_arr[r])
            let resolve = ''
            if(r === 0) resolve = answer_arr[2] + '÷' + answer_arr[1] + '=' + answer_arr[0] + '(厘米)'
            if(r === 1) resolve = answer_arr[2] + '÷' + answer_arr[0] + '=' + answer_arr[1] + '(厘米)'
            if(r === 2) resolve = answer_arr[0] + '×' + answer_arr[1] + '=' + answer_arr[2] + '(平方厘米)'
            console.log('解析',resolve)
            this.setState({
                showCreatTopic:true,
                creatStem:stem_arr,
                creatAnswer:answer_arr[r],
                resolve
            },()=>{
                if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
            })
        }
        
    }

    // 还原操作区域事件
    reductionEvent = () => {
        this.vectorInstance.current.reductionEvent()
        log("here: ", this.gestureState.funcMode)
        if (this.gestureState.funcMode === "平移") {
            this.setState({
                currentMoveInfo: [0, 0, 0, 0],
            })
        } else if (this.gestureState.funcMode === "旋转") {
            this.rotatingDiskInstance.current.init()
        }
    }
    submit = ()=>{
        const {diagnosisByFrontVal,creatAnswer,showCreatTopic} = this.state
        if(!showCreatTopic){
            Toast.info('还没有生成题目')
            return
        }
        if( !diagnosisByFrontVal ||!diagnosisByFrontVal[0] ||!diagnosisByFrontVal[0][0]){
            Toast.info('没有填写答案')
            return
        }
        console.log('作答答案',diagnosisByFrontVal[0][0][0])
        console.log('实际答案',creatAnswer)
        if(diagnosisByFrontVal[0][0][0] === creatAnswer +''){
            Toast.info('恭喜你，答对了！',1,()=>{
                if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
            })
        }else{
            Toast.info('抱歉，你答错了',1,()=>{
                this.setState({
                    visible:true
                })
            })
        }
    }
    backPre = ()=>{
        const {gradInfo} = this.state
        this.gestureState.funcMode = '面积'
        this.setState({
            showCreatTopic:false,
            diagnosisByFrontVal:'',
            btnInfo:{},
            isCreat:false,
            movePoints: [],
            gradInfo: {...gradInfo, gridNumsPixels: 15,},
        })
    }

    render() {
        const {currentMoveInfo, removeLimit, operatorInfo, operatorInfoList, currentOperator, gifModalShow, gifInfo, isGrid, elementStatus, movePoints, gradInfo, pointOne,btnInfo,showCreatTopic,creatStem,resolve,visible,isCreat} = this.state
        // operatorInfo 右边栏操作所需的数据
        // operatorInfoList 左边栏的操作列表
        log("gradInfo: ", gradInfo)
        log("render pointOne: ", pointOne)
        console.log('btnInfo: ',btnInfo)
        const {imgWidth, imgHeight, imgUrl} = gifInfo
        let stemContent = this.parseStem(operatorInfo)
        log("stemContent: ", stemContent)
        let rightContent
        if (currentOperator === "平移") {
            const [upLimit, downLimit, leftLimit, rightLimit] = currentMoveInfo
            const contentInfo = ["显示"]
            if (!isGrid) {
                contentInfo[0] = "隐藏"
            }
            rightContent = (
                <View style={{
                    alignItems: "center",
                    backgroundColor:"#fff",
                    padding:pxToDp(32),
                    borderRadius:pxToDp(16),
                    width:pxToDp(650),
                    flex:1
                }}>
                    <View
                        style={[
                        {
                            backgroundColor: "#49CAE8",
                            width:'100%',
                            height: pxToDp(this.height / 8),
                            borderRadius: pxToDp(16),
                            flexDirection: "row",
                            alignItems: "center",
                            
                        },appStyle.flexJusBetween]
                    }
                    >
                        <Text style={{color: "#fff", marginLeft: pxToDp(30), fontSize: os==="ios"? pxToDp(40): pxToDp(35), fontWeight: "bold"}}>网格</Text>

                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center",}}
                                          onPress={() => {this.toggleGrid()}}
                        >
                            <Text style={{color: isGrid? "#fff": "#98ECFF", fontSize: os==="ios"? pxToDp(40): pxToDp(35), marginRight: pxToDp(20), fontWeight: "bold"}}>{contentInfo[0]}</Text>
                            {isGrid?
                                <Image
                                    source={require("../../../../../images/vector/show.png")}
                                    style={{width: pxToDp(58), height: pxToDp(40), marginRight: pxToDp(30)}}
                                ></Image>
                                :
                                <Image
                                    source={require("../../../../../images/vector/unshow.png")}
                                    style={{width: pxToDp(58), height: pxToDp(40), marginRight: pxToDp(30)}}
                                ></Image>
                            }
                        </TouchableOpacity>

                    </View>
                    <View
                        style={
                            {
                                borderRadius: pxToDp(16),
                                width:'100%'
                            }
                        }
                    >
                        <Text style={{color: "#28375F", fontSize: os==="ios"? pxToDp(40): pxToDp(60), fontWeight: "bold", marginTop: pxToDp(32),marginBottom:pxToDp(20)}}>上下</Text>
                        <View style={{
                            flexDirection: "row",
                            marginBottom: pxToDp(30),
                        }}>
                            <TouchableOpacity
                                style={{width: pxToDp(198), height: pxToDp(57)}}
                                onPress={() => {this.moveEvent("up")}}
                            >
                                <Image
                                    source={require("../../../../../images/vector/up_btn.png")}
                                    style={{width: pxToDp(198), height: pxToDp(57), }}
                                ></Image>
                                <View
                                    style={{
                                        position: "absolute",
                                        height: pxToDp(57),
                                        width: pxToDp(198),
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginRight: upLimit < 10? pxToDp(20): pxToDp(13),
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            marginLeft: "auto",
                                            color: "#985831",
                                            fontSize: pxToDp(32),
                                        }}
                                        >{upLimit}
                                        </Text>
                                    </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{width: pxToDp(198), height: pxToDp(57), marginLeft: "auto", marginRight: pxToDp(30)}}
                                onPress={() => {this.moveEvent("down")}}
                            >
                                <Image
                                    source={require("../../../../../images/vector/down_btn.png")}
                                    style={{width: pxToDp(198), height: pxToDp(57),}}
                                ></Image>
                                <View
                                    style={{
                                        position: "absolute",
                                        height: pxToDp(57),
                                        width: pxToDp(198),
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginRight: downLimit < 10? pxToDp(20): pxToDp(13),
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            marginLeft: "auto",
                                            color: "#985831",
                                            fontSize: pxToDp(32),
                                        }}
                                    >{downLimit}</Text>
                                    </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={
                            {
                                borderRadius: pxToDp(16),
                                justifyContent: "space-between",
                                width:'100%'
                            }
                        }
                    >
                        <Text style={{color: "#28375F", fontSize: os==="ios"? pxToDp(40): pxToDp(60), fontWeight: "bold", marginTop: pxToDp(30),marginBottom:pxToDp(20)}}>左右</Text>

                        <View style={{
                            flexDirection: "row",
                            marginBottom: pxToDp(30),
                        }}>
                            <TouchableOpacity
                                style={{width: pxToDp(198), height: pxToDp(57)}}
                                onPress={() => {this.moveEvent("left")}}
                            >
                                <Image
                                    source={require("../../../../../images/vector/left_btn.png")}
                                    style={{width: pxToDp(198), height: pxToDp(57), }}
                                ></Image>
                                <View
                                    style={{
                                        position: "absolute",
                                        height: pxToDp(57),
                                        width: pxToDp(198),
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginRight: leftLimit < 10? pxToDp(20): pxToDp(13),
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            marginLeft: "auto",
                                            color: "#985831",
                                            fontSize: pxToDp(32),
                                        }}
                                    >{leftLimit}</Text>
                                    </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{width: pxToDp(198), height: pxToDp(57), marginLeft: "auto", marginRight: pxToDp(30)}}
                                onPress={() => {this.moveEvent("right")}}
                            >
                                <Image
                                    source={require("../../../../../images/vector/right_btn.png")}
                                    style={{width: pxToDp(198), height: pxToDp(57),}}
                                ></Image>
                                <View
                                    style={{
                                        position: "absolute",
                                        height: pxToDp(57),
                                        width: pxToDp(198),
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginRight: rightLimit < 10? pxToDp(20): pxToDp(13),
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            marginLeft: "auto",
                                            color: "#985831",
                                            fontSize: pxToDp(32),
                                        }}
                                    >{rightLimit}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
            )
        }
        else if (currentOperator === "旋转") {
            const [upLimit, downLimit, leftLimit, rightLimit] = removeLimit
            const contentInfo = ["显示"]
            if (!isGrid) {
                contentInfo[0] = "隐藏"
            }
            rightContent = (
                <View style={{
                    backgroundColor:'#fff',
                    flex:1,
                    padding:pxToDp(32),
                    width:pxToDp(650),
                    borderRadius:pxToDp(24)

                }}>
                    <View
                        style={
                            {
                                backgroundColor: "#49CAE8",
                                width: '100%',
                                height: pxToDp(this.height / 8),
                                borderRadius: pxToDp(16),
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom:pxToDp(24),
                            }
                        }
                    >
                        <Text style={{color: "#fff", marginLeft: pxToDp(30), fontSize: os==="ios"? pxToDp(40): pxToDp(35), fontWeight: "bold"}}>网格</Text>

                        <TouchableOpacity style={{flexDirection: "row", alignItems: "center", marginLeft: "auto"}}
                                          onPress={() => {this.toggleGrid()}}
                        >
                            <Text style={{color: isGrid? "#fff": "#98ECFF", fontSize: os==="ios"? pxToDp(40): pxToDp(35), marginRight: pxToDp(20), fontWeight: "bold"}}>{contentInfo[0]}</Text>
                            {isGrid?
                                <Image
                                    source={require("../../../../../images/vector/show.png")}
                                    style={{width: pxToDp(58), height: pxToDp(40), marginRight: pxToDp(30)}}
                                ></Image>
                                :
                                <Image
                                    source={require("../../../../../images/vector/unshow.png")}
                                    style={{width: pxToDp(58), height: pxToDp(40), marginRight: pxToDp(30)}}
                                ></Image>
                            }
                        </TouchableOpacity>

                    </View>
                    <View
                        style={
                            {
                                backgroundColor: "#49CAE8",
                                width: '100%',
                                height: "80%",
                                borderRadius: pxToDp(16),
                                padding:pxToDp(24)
                            }
                        }
                    >
                        <View
                            style={[{
                                flexDirection: "row",
                                alignItems:'center',
                                // marginTop: pxToDp(10),
                            },appStyle.flexJusBetween]}
                        >
                            <Text style={{color: "#fff",fontSize: os==="ios"? pxToDp(40): pxToDp(40), fontWeight: "bold"}}>旋转</Text>
                            <View style={{
                                marginLeft: pxToDp(17),
                                backgroundColor: "#FFD05D",
                                justifyContent: "center",
                                alignItems: "center",
                                width: pxToDp(410),
                                height: pxToDp(50),
                            }}>
                                <Text style={{color: "#fff", fontSize: os==="ios"? pxToDp(33): pxToDp(28), fontWeight: "bold", }}>顺时针和逆时针都可以旋转</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                height: "90%",
                                justifyContent: "center",
                                marginTop: pxToDp(10),
                            }}
                        >
                            <RotatingDisk
                                gradInfo={gradInfo}
                                updateRotateAngleEvent={this.updateRotateAngle}
                                ref={this.rotatingDiskInstance}
                            />
                        </View>
                    </View>
                </View>
            )
        }
        else {
            rightContent = (
                <ScrollView contentContainerStyle={{paddingBottom:pxToDp(60)}} style={
                    {
                        backgroundColor: "#fff",
                        width: '100%',
                        borderRadius: pxToDp(20),
                        padding:pxToDp(40),
                    }
                }>
                    <View>
                        {stemContent}
                    </View>
                </ScrollView>
            )
        }
        return (
            <View style={[styles.content]}>
                <ImageBackground
                    source={require("../../../../../images/vector/navigationBar.png")}
                    style={[{height: os === "ios"? pxToDp(148): pxToDp(128), width: "100%", zIndex: 10}, styles.header]}
                    resizeMode={'stretch'}
                >
                    <TouchableOpacity style={[styles.backBtnPosition]}
                                      onPress={() => {NavigationUtil.goBack(this.props)}}
                    >
                        <View
                        >
                            <Image
                                source={require("../../../../../images/vector/back.png")}
                                style={{width: pxToDp(80), height: pxToDp(80)}}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.toggleHeader]}>
                        <View style={[styles.headerItemTouch, styles.headerItem]}>
                            <Image
                                source={require("../../../../../images/vector/small_pingxing.png")}
                                style={{width: pxToDp(64), height: pxToDp(64)}}
                            ></Image>
                            <Text style={[styles.headerItemFont]}>平行四边形</Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.body]}>
                    <SafeAreaView
                        style={{
                            width: pxToDp(194),
                            backgroundColor: "#fff",
                        }}
                    >
                        <FlatList
                            data={operatorInfoList}
                            renderItem={({ item, index }) => this.renderItem({item, index, currentOperator})}
                        />
                    </SafeAreaView>
                    <View
                        style={{alignItems: "center", justifyContent: "center"}}
                    >
                        {gifModalShow?
                            <View style={{justifyContent: "center", alignItems: "center",  width: pxToDp(this.width),
                                height: pxToDp(this.height),
                                backgroundColor: '#fff',}}>
                                <Image
                                    style={{
                                        width: pxToDp(this.width),
                                        height: pxToDp(imgHeight),
                                        resizeMode: "contain",
                                    }}
                                    source={{
                                        uri: imgUrl
                                    }}
                                ></Image>
                            </View>
                            :
                            <View
                                style={{
                                    flex: 3,
                                    width: pxToDp(this.width),
                                    height: pxToDp(this.height),
                                    justifyContent: "center",
                                }}
                            >
                                {
                                    movePoints.length === 0?
                                        null
                                        :
                                        <TouchableOpacity
                                            style={[{
                                                width: pxToDp(180),
                                                height: pxToDp(70),
                                                backgroundColor: "rgba(233, 241, 255, 0.8)",
                                                zIndex: 999,
                                                position: "absolute",
                                                right: pxToDp(10),
                                                top: Platform.OS==="ios"?pxToDp(80): pxToDp(60),
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: pxToDp(20),
                                            }]}
                                            onPress={() => this.reductionEvent()}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-evenly",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View>
                                                    <Image
                                                        source={require(`../../../../../images/vector/recover.png`)}
                                                        style={{width: pxToDp(40), height: pxToDp(40)}}
                                                    ></Image>
                                                </View>
                                                <View>
                                                    <Text style={[styles.btnText,{color:'#43D3F4'}]}> 还 原</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                }
                                <Svg
                                    style={{
                                        width: pxToDp(this.width),
                                        height: pxToDp(this.height),
                                        position: 'absolute',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    {isGrid? this.drawGrad(gradInfo.gridNumsPixels): null}
                                </Svg>
                                <Parallelogram
                                    gradInfo={gradInfo}
                                    points={movePoints}
                                    externalProps={{
                                        pointOne,
                                        funcMode: this.gestureState.funcMode,
                                    }}
                                    isCreat={isCreat}
                                    release={this.release}
                                    ref={this.vectorInstance}
                                />
                            </View>
                        }
                    </View>
                    {isCreat?<View style={[styles.creatWrap,{height:pxToDp(this.height)}]}>
                        <View>
                            <View style={[styles.stemContent]}>
                                {showCreatTopic?<View>
                                    {creatStem.map((item,index)=>{
                                        return <Text style={[index === 2?{fontSize:pxToDp(40),fontWeight:'bold',marginTop:pxToDp(24)}:{fontSize:pxToDp(36),color:'#666'}]}>{item}</Text>
                                    })}
                                </View>:<Text style={[{fontSize:pxToDp(40)}]}>
                                    请拖拽左侧图形生成一道题目
                                </Text>}
                            </View>
                            <KeyboardAndAnswer
                                onRef={(ref) => {
                                this.KeyboardAndAnswer = ref;
                                }}
                                getAnswer={this.getAnswer}
                            ></KeyboardAndAnswer>
                            <View style={[appStyle.flexLine]}>
                                <TouchableOpacity style={[
                                    {
                                        backgroundColor: "#4E88FD",
                                        height: pxToDp(108),
                                        width:pxToDp(200),
                                        borderRadius: pxToDp(54),
                                        marginTop:pxToDp(24),
                                        marginRight:pxToDp(16)
                                        
                                    },appStyle.flexCenter]}
                                    onPress={this.backPre}
                                    >
                                    <Text style={{color: "#fff", fontSize: pxToDp(32)}}>返回</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[
                                    {
                                        backgroundColor: "#43D3F4",
                                        height: pxToDp(108),
                                        flex:1,
                                        borderRadius: pxToDp(54),
                                        marginTop:pxToDp(24),
                                    },appStyle.flexCenter]}
                                    onPress={this.submit}
                                    >
                                    <Text style={{color: "#fff", fontSize: pxToDp(32)}}>提交</Text>
                                </TouchableOpacity>
                               
                            </View>
                        </View>
                    </View>:<View style={{width: pxToDp(650), height: pxToDp(this.height), borderRadius: pxToDp(20), alignItems: "center", flexDirection: "column", justifyContent: 'space-between', marginRight: pxToDp(32)}}>
                        {rightContent}
                        {elementStatus ==="1"?
                            <TouchableOpacity style={[
                                {
                                    backgroundColor: "#43D3F4",
                                    height: pxToDp(108),
                                    width:'100%',
                                    borderRadius: pxToDp(54),
                                    marginTop:pxToDp(24)
                                    
                                },appStyle.flexCenter]}
                                onPress={this.todoExcersice}
                                >
                                <Text style={{color: "#fff", fontSize: pxToDp(32)}}>开始测试</Text>
                            </TouchableOpacity>
                            :
                            null
                        }
                    </View>}
                </View>
                <ResovingModal visible={visible} resolve={resolve}  onClose={()=>{
                    if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
                    this.setState({
                        visible:false
                    })
                }}></ResovingModal>
            </View>
        )
    }
}

const sideBarItemHeight = os === "ios"? 260: 225
const fontSize = os === "ios"? 30: 25

const styles = StyleSheet.create({
    content: {
        flexDirection: "column",
        flex: 1,
    },
    header: {
        flexDirection: "row",
    },
    backBtnPosition:{
        zIndex: 1,
        position: "absolute",
        marginLeft: pxToDp(64),
        top: os === "ios"? pxToDp(37): pxToDp(24),
    },
    toggleHeader: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedItem: {
        backgroundColor: "#E3ECFE",
    },
    headerItemTouch: {
        backgroundColor: "#43D3F4",
        height: pxToDp(80),
        // width: pxToDp(278),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(50),
        justifyContent: "center",
        alignItems: "center",
    },
    headerItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    headerItem1Position: {
        left: pxToDp(278 + 10)
    },
    headerItem2Position: {
        left: pxToDp(278 * 2 + 20)
    },
    headerItemFont: {
        marginLeft: pxToDp(10),
        fontSize: pxToDp(32),
        color: "#fff",
    },
    body: {
        backgroundColor: "#E7EFFF",
        width: "100%",
        height: "100%",
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    sideBar: {
        width: pxToDp(200),
        // height: "100%",
        backgroundColor: "#fff",
        flexDirection: "column",
        // alignItems: "center",
    },
    sideBarItem: {
        height: pxToDp(190),
        width: pxToDp(164),
        marginLeft: pxToDp(40),
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#f00",
        borderTopLeftRadius: pxToDp(20),
        borderBottomLeftRadius: pxToDp(20),
    },
    sideBarFont: {
        fontSize: pxToDp(fontSize),
    },
    selectedSideBarItem: {
        position: "absolute",
        left: pxToDp(30),
        paddingLeft: pxToDp(36),
        backgroundColor: "#f00",
        width: "86%",
        height: pxToDp(sideBarItemHeight),
        borderTopLeftRadius: pxToDp(20),
        borderBottomLeftRadius: pxToDp(20),
        // alignItems: "center",
        justifyContent: "center",
    },
    selectedSideBarItemColor: {
        backgroundColor: "#E3ECFE",
    },
    vectorContent: {
        width: "91%",
        borderWidth: 1,
        borderColor: "blue",
        maxHeight: Dimensions.get("window").height - (os === "ios"? 80: 110),
    },
    vectorItem: {
        height: pxToDp(200),
    },
    vectorItemFont: {
        color: "#43D3F4",
        fontSize: pxToDp(24),
    },
    creatWrap:{
        width: pxToDp(650), 
        marginRight:pxToDp(32)
    },
    stemContent:{
        height:Platform.OS === 'android'?pxToDp(260):pxToDp(600),
        backgroundColor:'#fff',
        padding:pxToDp(32),
        borderRadius:pxToDp(24),
        marginBottom:pxToDp(24)

    },
    btn:{
        marginRight:pxToDp(24),
        marginBottom:pxToDp(24),
        paddingLeft:pxToDp(32),
        paddingRight:pxToDp(32),
        height:pxToDp(80),
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter
    },
    btnText:{
        fontSize:pxToDp(36)
    }
});

export default VectorOperator
