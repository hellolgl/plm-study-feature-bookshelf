import React, {Component} from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Dimensions, 
} from "react-native"
import Svg from "react-native-svg"
import {pxToDp} from "../../../../../../util/tools"
import {DrawSvgClass} from "../GraphAndNumSVG"
import axios from "../../../../../../util/http/axios"
import api from "../../../../../../util/http/api"
import Parallelogram from "../Parallelogram"
import Grad from "../Grad"
import MathNavigationUtil from "../../../../../../navigator/NavigationMathUtil";
import KeyboardAndAnswer from './Keyboard/KeyboardAndAnswer'
import { appStyle } from "../../../../../../theme"
import { Toast } from "antd-mobile-rn";
import ResovingModal from './ResovingModal'
import RichShowView from '../../../../../../component/math/RichShowView'
import Algorithm from "../Algorithm"
import * as _ from "lodash";
import {getDebounceTime} from '../../../../../../util/commonUtils'
let debounceTime = getDebounceTime();

const os = Platform.OS
const log = console.log.bind(console)

const correct_style = {
    1:{backgroundColor:'#7FD23F',borderColor:'#7FD23F'},
    2:{backgroundColor:'#FC6161',borderColor:'#FC6161'}
}

class VectorOperator extends Component {
    constructor(props) {
        super(props)
        this.submitThrottle = _.debounce(this.submit, debounceTime);
        this.toNextTopicThrottle = _.debounce(this.nextTopic, debounceTime);
        this.width = 1100
        this.height = os==="ios"? 1300: 880
        this.opBase = null
        this.draw = new DrawSvgClass(pxToDp(this.width), pxToDp(this.height))
        this.algorithm = null
        this.answerNum = 0
        this.vectorInstance = React.createRef()
        this.KeyboardAndAnswer = null;

        this.state = {
            currentOperator: "概念",
            svgData: [],
            operatorInfo: [],
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
            visible:false,
            topaicDataList:this.props.topaicDataList,
            answerPoints:[],
            isWrong:false,
            my_answer_line_data:[]
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

    getGridNumsPixels = (width, gridSize) => {
        return pxToDp(width / gridSize)
    }

    componentDidMount() {
    }

    release = (values)=>{
        const {currentTopaicData} = this.props
        // console.log('松开数据',values)
        if(currentTopaicData.field.length > 0){
            // 自由创作类题目
            let formular_values = [values[0],values[1], ((values[0] * 10) * (values[1] * 10)) / 100.0]
            if(currentTopaicData.key_name === '边长变化'){
                formular_values = [values[0],values[1], 2 * (values[0] * 10 + values[1] * 10) / 10.0]
            }
            // console.log('图返回数据',formular_values)
            let varible_map = {}
            let index = 0
            // 用field的第一个数据的公式来确定字母的替换值
            for(let i in JSON.parse(currentTopaicData.field[0].info)){
                let data = JSON.parse(currentTopaicData.field[0].info)[i]
                let key = data.substring(0,1)
                varible_map[key] = formular_values[index]
                index ++ 
            }
            console.log('变量数据',varible_map)
            const r = Math.floor(Math.random() * 3)  //生成[0,2]的随机数
            let variable_data = currentTopaicData.field[r]
            // console.log('替换数据',variable_data,currentTopaicData.exercise_stem)
            let variable_data_arr = []
            for(let i in JSON.parse(variable_data.info)){
                let data = JSON.parse( variable_data.info)[i]
                variable_data_arr.push({
                    label_1:i,
                    label_2:data
                })
            }
            let stem_arr = currentTopaicData.exercise_stem.split('')
            let $_index = 0
            let creatAnswer = ''
            let answerUnit = ''
            stem_arr.forEach((i,index)=>{
                if(i === '$'){
                    if($_index === variable_data_arr.length - 1){
                        // 最后一个替换
                        stem_arr[index] = variable_data_arr[$_index].label_1 + variable_data_arr[$_index].label_2.substring(1)
                        creatAnswer = varible_map[variable_data_arr[$_index].label_2.substring(0,1)]
                        answerUnit = variable_data_arr[$_index].label_2.substring(1)
                    }else{
                        for(let j in varible_map){
                            // 变量替换
                            if(variable_data_arr[$_index].label_2.indexOf(j)> -1){
                                variable_data_arr[$_index].label_2 = variable_data_arr[$_index].label_2.replaceAll(j,varible_map[j])
                            }
                        }
                        stem_arr[index] = variable_data_arr[$_index].label_1 + variable_data_arr[$_index].label_2
                    }
                    $_index ++ 
                }
            })
            let formula_arr = variable_data.formula.split('')
            formula_arr.forEach((i,index)=>{
                if(varible_map[i]){
                    if(index === formula_arr.length-1){
                        formula_arr[index] = varible_map[i] + '(' + answerUnit + ')'
                    }else{
                        formula_arr[index] = varible_map[i]
                    }
                }
            })
            let resolve = formula_arr.join('')
            console.log('转换后的题目信息',stem_arr.join(''),creatAnswer,resolve)
            this.setState({
                creatStem:stem_arr.join(''),
                showCreatTopic:true,
                creatAnswer,
                resolve
            })
        }else{
            let answerPoints = JSON.parse(JSON.stringify(this.state.answerPoints)).concat(values)
            let my_answer_line_data = JSON.parse(JSON.stringify(this.state.my_answer_line_data)).concat([values])
            this.setState({
                answerPoints,
                my_answer_line_data
            })
        }
    }

    submit = ()=>{
        const {currentTopaicData,listIndex} = this.props
        const {answerPoints,topaicDataList,gradInfo,isWrong,diagnosisByFrontVal,creatAnswer,showCreatTopic,my_answer_line_data} = this.state
        let colorFlag = 1
        this.answerNum ++ 
        // console.log('提交',answerPoints,currentTopaicData)
        if(currentTopaicData.field.length > 0){
            //  自由创作
            if(!showCreatTopic){
                Toast.info('还没有生成题目')
                return
            }
            if(diagnosisByFrontVal && diagnosisByFrontVal[0] && diagnosisByFrontVal[0][0] && diagnosisByFrontVal[0][0][0] === creatAnswer +''){
                colorFlag = 1
            }else{
                colorFlag = 2
            }
        }else{
            let topicAnswer_arr = []
            let topicAnswer_arr_show = []
            currentTopaicData.chart.forEach((item,index)=>{
                item._point =  this.algorithm.reducePoints([item.point])[0]
                item.answer.forEach((i,x)=>{
                    i._point = this.algorithm.reducePoints([i.point])[0]
                    topicAnswer_arr_show.push(i._point)
                    topicAnswer_arr.push(i.point)
                })
            })
            if(currentTopaicData.key_name === '对称轴'){
                if(my_answer_line_data.length > 1 || my_answer_line_data.length === 0){
                    colorFlag = 2
                }else{
                    for(let i = 0 ; i<topicAnswer_arr_show[0].length;i++){
                        let data = topicAnswer_arr_show[0][i]
                        let result = this.algorithm.JudgePointInLineFlag(data,my_answer_line_data[0])
                        if((result.in_line && result.on_line) || (result.on_line && result.end_point)){
                            colorFlag = 1
                            break
                        }
                        colorFlag = 2
                    }
                }
            }else{
                // let myAnswer = this.algorithm.allImgToCording([answerPoints])
                for(let i = 0; i<topicAnswer_arr.length ;i++){
                    let data = topicAnswer_arr[i]
                    console.log('答案数组',JSON.stringify(data),)
                    console.log('我的答案数组',JSON.stringify(this.algorithm.allImgToCording(my_answer_line_data)))
                    // console.log('88888888',this.algorithm.checkParallelogramAnswer(data,myAnswer[0]),data,myAnswer[0])
                    // if(this.algorithm.checkParallelogramAnswer(data,myAnswer[0])){
                    //     colorFlag =1
                    //     break
                    // }
                    // colorFlag =2
                    if(this.algorithm.JudgeDrawGraphLine(data,this.algorithm.allImgToCording(my_answer_line_data))){
                        colorFlag =1
                        break
                    }
                    colorFlag =2
                }
            }
            if(colorFlag ===2){
                let points = [
                    currentTopaicData.chart,
                    my_answer_line_data,
                    topicAnswer_arr_show
                ]
                this.vectorInstance.current.showResolution(points)
            }
        }
        let _topaicDataList = JSON.parse(JSON.stringify(topaicDataList))
        _topaicDataList[listIndex].colorFlag = colorFlag
        if(colorFlag === 1){
            Toast.info('恭喜你答对了!',1,()=>{
                if(this.answerNum === 1){
                    this.setState({
                        topaicDataList:_topaicDataList,
                    })
                }
                if(isWrong){
                    // 做错了答对
                    this.answerNum = 0
                }
                this.nextTopic(_topaicDataList)
            })
        }
        if(colorFlag === 2){
            Toast.info('抱歉，你答错了',1,()=>{
                this.setState({
                    topaicDataList:_topaicDataList,
                    isWrong:currentTopaicData.field.length>0?false:true
                })
                if(currentTopaicData.field.length >0){
                    this.setState({
                        visible:true
                    })
                }
            })
        }
    }

    nextTopic = ()=>{
        const {listIndex} = this.props
        const {topaicDataList} = this.state
        this.setState({
            isWrong:false,
            showCreatTopic:false,
        })
        if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
        this.reductionEvent()
        this.props.toNextTopic(topaicDataList,this.answerNum === 1 && topaicDataList[listIndex].colorFlag === 1?true:false)  //只记录第一次答对的
        this.answerNum = 0
    }

    // 还原操作区域事件
    reductionEvent = () => {
        this.setState({
            answerPoints:[],
            my_answer_line_data:[]
        })
        this.vectorInstance.current.reductionEvent()
    }

    continue = ()=>{
        this.reductionEvent()
        this.setState({
            isWrong:false
        })
    }
    render() {
        const {listIndex,currentTopaicData} = this.props
        console.log('当前的题',currentTopaicData)
        const {topaicDataList,currentMoveInfo, removeLimit, operatorInfo, currentOperator, isGrid, elementStatus, gradInfo, pointOne,btnInfo,showCreatTopic,creatStem,resolve,visible,isWrong} = this.state
        let movePoints = []
        currentTopaicData.chart.forEach((i,x)=>{
            movePoints.push(i.point)
        })
        const gridNumsPixels = this.getGridNumsPixels(this.width, currentTopaicData.grid_size[0])
        const newGradInfo = {
            ...gradInfo,
            gridNumsPixels,
        }
        let funcMode = 'gribAbsorb'
        this.algorithm = new Algorithm(newGradInfo)
        let isCreat = false
        if(currentTopaicData.field.length > 0) isCreat = true
        if(currentTopaicData.field.length > 0){
            if(currentTopaicData.key_name === '边长变化'){
                funcMode = 'graphText'
            }
            if(currentTopaicData.key_name === '面积变化'){
                funcMode = 'graphArea'
            }
        }
        let symmetric_points = []  //有对称轴题目的坐标
        if(currentTopaicData.key_name === '对称' || currentTopaicData.key_name === '对称轴' ){
            currentTopaicData.chart.forEach((i,x)=>{
                symmetric_points.push({
                    point:i.point,
                    line:i.line,
                    name:i.name
                })
            })
        }

        return (
            <View style={[styles.content]}>
                <ImageBackground
                    source={require("../../../../../../images/vector/navigationBar.png")}
                    style={[{height: os === "ios"? pxToDp(148): pxToDp(128), width: "100%", zIndex: 10}, styles.header]}
                    resizeMode={'stretch'}
                >
                    <TouchableOpacity style={[styles.backBtnPosition]} onPress={() => {this.props.goBack()}}>
                        <View>
                            <Image
                                source={require("../../../../../../images/vector/back.png")}
                                style={{width: pxToDp(80), height: pxToDp(80)}}
                            ></Image>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.toggleHeader]}>
                        <View style={[styles.headerItemTouch, styles.headerItem]}>
                            <Image
                                source={require("../../../../../../images/vector/small_pingxing.png")}
                                style={{width: pxToDp(64), height: pxToDp(64)}}
                            ></Image>
                            <Text style={[styles.headerItemFont]}>平行四边形</Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.body]}>
                    <View style={[styles.leftWrap]}> 
                        {topaicDataList.map((item,index)=>{
                            return <View key={index} style={[styles.topicCard,appStyle.flexCenter,index === listIndex?{backgroundColor:'#10D9E6',borderColor:'#04C0CC'}:null,correct_style[item.colorFlag]]}>
                                <Text style={[{fontSize:pxToDp(48),color:'#fff'}]}>
                                    {index+1}
                                </Text>
                            </View>
                        })}
                    </View>
                    <View
                        style={{alignItems: "center", justifyContent: "center"}}
                    >
                            <View
                                style={{
                                    flex: 3,
                                    width: pxToDp(this.width),
                                    height: pxToDp(this.height),
                                    justifyContent: "center",
                                    position:"relative"
                                }}
                            >
                                {isWrong?<>
                                    <TouchableOpacity style={[
                                        {
                                            backgroundColor: "#43D3F4",
                                            height: pxToDp(80),
                                            borderRadius: pxToDp(54),
                                            width:pxToDp(220),
                                            position:'absolute',
                                            top:pxToDp(60),
                                            right:pxToDp(248),
                                            zIndex:1
                                        },appStyle.flexCenter]}
                                        onPress={this.continue}
                                        >
                                        <Text style={{color: "#fff", fontSize: pxToDp(32)}}>继续作答</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[
                                        {
                                            backgroundColor: "#43D3F4",
                                            height: pxToDp(80),
                                            width:pxToDp(200),
                                            borderRadius: pxToDp(54),
                                            position:'absolute',
                                            top:pxToDp(60),
                                            right:pxToDp(24),
                                            zIndex:1
                                        },appStyle.flexCenter]}
                                        onPress={this.toNextTopicThrottle}
                                        >
                                        <Text style={{color: "#fff", fontSize: pxToDp(32)}}>下一题</Text>
                                    </TouchableOpacity>
                                </>
                               :<TouchableOpacity style={[
                                {
                                    width: pxToDp(180),
                                    height: pxToDp(70),
                                    backgroundColor: "rgba(233, 241, 255, .8)",
                                    borderRadius: pxToDp(54),
                                    position:'absolute',
                                    top:pxToDp(60),
                                    right:pxToDp(24),
                                    zIndex:1
                                },appStyle.flexCenter]}
                                onPress={this.reductionEvent}
                                >
                                 <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={require(`../../../../../../images/vector/recover.png`)}
                                        style={{width: pxToDp(40), height: pxToDp(40)}}
                                    ></Image>
                                    <Text style={[styles.btnText,{color:'#43D3F4'}]}> 还 原</Text>
                                </View>
                            </TouchableOpacity>}
                                <Svg
                                    style={{
                                        width: pxToDp(this.width),
                                        height: pxToDp(this.height),
                                        position: 'absolute',
                                        backgroundColor: '#fff',
                                        borderRadius:pxToDp(24)
                                    }}
                                >
                                    {isGrid? this.drawGrad(newGradInfo.gridNumsPixels): null}
                                </Svg>
                                <Parallelogram
                                    gradInfo={newGradInfo}
                                    points={movePoints}
                                    externalProps={{
                                        pointOne,
                                        funcMode:funcMode,
                                        symmetric_points,
                                        key_name:currentTopaicData.key_name
                                    }}
                                    isCreat={true}
                                    release={this.release}
                                    ref={this.vectorInstance}
                                />
                            </View>
                    </View>
                    {currentTopaicData.field.length>0?<View style={[styles.creatWrap,{height:pxToDp(this.height)}]}>
                        <View>
                            <View style={[styles.stemContent]}>
                                {showCreatTopic?<View>
                                    <RichShowView width={pxToDp(530)} divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} value = {creatStem}></RichShowView>
                                </View>:<Text style={[{fontSize:Platform.OS==="ios"? pxToDp(30): pxToDp(40)}]}>
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
                    </View>:<View style={{width: pxToDp(650), height: pxToDp(this.height), borderRadius: pxToDp(20),marginRight: pxToDp(32)}}>
                        <View style={[{backgroundColor:'#fff',borderRadius:pxToDp(24),padding:pxToDp(40),flex:1},appStyle.flexJusBetween]}>
                             <RichShowView width={pxToDp(530)} divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} value = {currentTopaicData.exercise_stem}> 
                             </RichShowView>
                        </View>
                        <TouchableOpacity style={[
                            {
                                backgroundColor: "#43D3F4",
                                height: pxToDp(108),
                                borderRadius: pxToDp(54),
                                marginTop:pxToDp(24),
                            },appStyle.flexCenter]}
                            onPress={this.submitThrottle}
                            >
                            <Text style={{color: "#fff", fontSize: pxToDp(32)}}>提交</Text>
                        </TouchableOpacity>
                    </View>}
                    
                </View>
                <ResovingModal isDoEcerxise={true} visible={visible} resolve={resolve} onContinue={()=>{
                        this.setState({
                            visible:false
                        },()=>{
                            if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
                        })
                    }}  
                    onClose={()=>{
                        if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
                        this.setState({
                            visible:false
                        })
                    }}
                    onNextTopic = {()=>{
                        if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData();
                        this.setState({
                            visible:false
                        },()=>{
                            this.nextTopic()
                        })
                    }}
                ></ResovingModal>
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
    },
    topicCard:{
        width:pxToDp(100),
        height:pxToDp(100),
        borderRadius:pxToDp(50),
        backgroundColor:"#E6E6E6",
        borderColor:"#E6E6E6",
        borderWidth:pxToDp(4),
        marginBottom:pxToDp(32),
       
    },
    leftWrap:{
        height:'100%',
        padding:pxToDp(32),
        backgroundColor:"#fff"
    },
    restoreBtn:{
        width:pxToDp(206),
        height:pxToDp(80),
        backgroundColor:'#DEFFE9',borderRadius:pxToDp(40)
    }
});

export default VectorOperator
