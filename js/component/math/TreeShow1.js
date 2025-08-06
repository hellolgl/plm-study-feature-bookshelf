import React, { Component, PureComponent } from 'react';
import { Text, View, StyleSheet, Animated, TouchableOpacity, Image, ScrollView, Dimensions ,UIManager,findNodeHandle} from 'react-native';
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../util/tools";
import { appStyle, appFont } from "../../theme";
import CircleButton from './BaseButton'
import axios from '../../util/http/axios'
import api from '../../util/http/api'
// import { Shape, Surface, Path, Text as TextArt, Group } from '@react-native-community/art';
import Svg, {Circle, ForeignObject,Line} from "react-native-svg"
import _ from 'lodash'

//解析树结构，并回显
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class TreeShow extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
        nodeList:[],
        treeLength:0,
        layoutMapState:new Map(),
        lineNodeArr:[],
    }
    this.layoutBody = { }
    this.nodeMap = new Map()
    this.layoutMap = new Map()
   console.log('props',props)

  }


  componentDidMount() {
    // this.getData()
    let list = []
    let treeLength = 0
    this.getAllTreeNode(this.props.treeData,list)
    treeLength = this.getTreeDeep(this.props.treeData) 
    this.setState( ()=>({
      nodeList : [...list],
      treeLength : treeLength
    }))
    

  }

  componentDidUpdate() {
 
  }

  componentWillUnmount(){
    console.log('TreeShow componentWillUnmount')
    this.layoutBody = { }
    this.nodeMap = new Map()
    this.layoutMap = new Map()
  }

    // 获取树的深度
   getTreeDeep = (treeData) =>{
        let arr = [];
        arr.push(treeData);
        let depth = 0;
        while (arr.length > 0) {
            let temp = [];
            for (let i = 0; i < arr.length; i++) {
                temp.push(arr[i]);
            }
            arr = [];
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].children && temp[i].children.length > 0) {
                    for (let j = 0; j < temp[i].children.length; j++) {
                        arr.push(temp[i].children[j]);
                    }
                }
            }
            if (arr.length >= 0) {
                depth++;
            }
        }
        return depth;
  }
  // 提取树的所有节点，最终树的所有节点都会存入传入的nodeList数组中(深度优先DFS)
  getAllTreeNode = (treeData, nodeList) => {
        // 判断是否为数组
        if (Array.isArray(treeData)) {
            treeData.forEach(item => {
                if (item.children && item.children.length > 0) {
                    nodeList.push(item)
                    this.getAllTreeNode(item.children, nodeList)
                } else {
                    nodeList.push(item)
                }
            })
        } else {
            if (treeData.children && treeData.children.length > 0) {
                nodeList.push(treeData)
                this.getAllTreeNode(treeData.children, nodeList)
            } else {
                nodeList.push(treeData)
            }
        }
  }

  // 提取树的所有节点，最终树的所有节点都会存入传入的nodeList数组中(广度优先BFS)
  getAllTreeNodeBFS = (treeData, nodeList) => {
    // 判断是否为数组
    if (Array.isArray(treeData)) {
        treeData.forEach(item => {
            if (item.children && item.children.length > 0) {
                nodeList.push(item)
                this.getAllTreeNode(item.children, nodeList)
            } else {
                nodeList.push(item)
            }
        })
    } else {
        if (treeData.children && treeData.children.length > 0) {
            nodeList.push(treeData.label)
            this.getAllTreeNode(treeData.children, nodeList)
        } else {
            nodeList.push(treeData)
        }
    }
  }


  // 提取树的叶子节点，最终所有树的叶子节点都会存入传入的leafList数组中
  getTreeLeaf = (treeData, leafList) => {
            // 判断是否为数组
            if (Array.isArray(treeData)) {
                treeData.forEach(item => {
                    if (item.children && item.children.length > 0) {
                        getTreeLeaf(item.children, leafList)
                    } else {
                        leafList.push(item)
                    }
                })
            } else {
                if (treeData.children && treeData.children.length > 0) {
                    getTreeLeaf(treeData.children, leafList)
                } else {
                    leafList.push(treeData)
                }
            }
  }

  //过滤树节点数组
  filterTreeArr = (list)=>{
    let treeMap = new Map()
    let mapNodeArr = []
    let tempIndex = 0
    if(list){
      //将list根据index进行升序排序
      list.sort((a, b)=> {
        return a.index - b.index;
      });
      console.log('filterTreeArr list',list)
      list.map((item)=>{
        if(item.index != tempIndex){
          tempIndex = item.index
          mapNodeArr = []
        }
        mapNodeArr.push(item)
        treeMap.set(tempIndex,mapNodeArr)
    })
    }
    return treeMap
  }

  //过滤渲染线过程的数组
  filterRenderLineNodeList = (nodeList)=>{
    if(!nodeList || nodeList.length<=0) return
    let result  = nodeList.filter( (item)=>{
        if(item.label === '+'||item.label === '-'||item.label ==='×'||item.label ==="x"||item.label ==="*"||item.label === '÷'){
          return false
        }
        return true
    })

    return result
  }

  //判断当前元素是否为运算符
  filterFuhao = (item)=>{
    console.log('filterFuhao',item)
    if(item === '+'||item === '-'||item ==='×'||item ==="x"||item ==="*"||item === '÷'){
      return true
    }
    return false
  }

  //根据后台获取对应数据进行替换
  filterTreeData = (data) =>{
    let tempData = _.cloneDeep(data)
    let equationExerciseArr = this.props.equationExercise.match(/[A-W]/ig)
    console.log('filterTreeData',equationExerciseArr)
    console.log('filterTreeData data',data)
    console.log('filterTreeData this.props.equationDistribution',this.props.equationDistribution)
    console.log('filterTreeData this.props.yinDaoNum',this.props.yinDaoNum)
    if(!this.props.variableValue)return data
    for(let i =0;i<this.props.equationDistribution.length;i++){
      if(this.props.equationDistribution[i].includes(tempData.label)&&!this.filterFuhao(tempData.label)){
        tempData.color  = 'red'
        break;
      }else{
        tempData.color  = 'black'
      }
    }
    this.props.variableValue.forEach((item)=>{
        if(item.key === tempData.label){
          if(!this.props.parseData[tempData.label]){

          }else{
            
            if(-1===equationExerciseArr.indexOf(tempData.label)){
              tempData.label = item.value[0]+'?'+item.value[1]+''
            }else{
              tempData.label = item.value[0]+this.props.parseData[tempData.label]+item.value[1]+''
            }

            

          }
        }
        if(item.key === tempData.parentId){
          if(this.props.parseData[tempData.parentId]){
            if(-1 === equationExerciseArr.indexOf(tempData.label) ){
              tempData.parentId = item.value[0]+'?'+item.value[1]+''
            }
            else{ 
            tempData.parentId = item.value[0]+this.props.parseData[tempData.parentId]+item.value[1]+''
            }
          }
        }
       
    })
    return tempData
  }

  //根据后台获取对应数据进行替换
  filterTreeList = (data) =>{
    console.log('filterTreeList data',data)
    let equationExerciseArr = this.props.equationExercise.match(/[A-W]/ig)
    if(!this.props.variableValue) return data
    this.props.variableValue.forEach((item)=>{
        if(item.key === data.label){
          if(!this.props.parseData[data.label]){
            // data.isQuestion = true
          }else{
            if( -1 ===equationExerciseArr.indexOf(data.label)){
             data.label = item.value[0]+'?'+item.value[1]+''

            }else{  
             data.label = item.value[0]+this.props.parseData[data.label]+item.value[1]+''
            }
            // data.isQuestion = false
          }
        }
        if(item.key === data.parentId){
          if(this.props.parseData[data.parentId]){
            if(-1 === equationExerciseArr.indexOf(data.parentId)){
            data.parentId = item.value[0]+'?'+item.value[1]+''

            }
            else{
             data.parentId = item.value[0]+this.props.parseData[data.parentId]+item.value[1]+''

            }
          }
        }
    })
  
  }

  //组件本身定位
  onLayoutSelf = (key,color, e) => {
    if(key === '+'||key === '-'||key==='×'||key ==="x"||key ==="*"||key === '÷'){
      return 
    }
    UIManager.measure(findNodeHandle(e.target), (x,y,width,height,pageX,pageY)=>{
      // console.log('key',key)
      // console.log('width',width)
      // console.log('height',height)
      // console.log('pageX',pageX)
      // console.log('pageY',pageY)
      this.layoutBody.x = pageX
      this.layoutBody.y = pageY
      this.layoutBody.width = width
      this.layoutBody.height = height
      this.layoutBody.color = color
      this.layoutMap.set(key+'', { ...this.layoutBody })
      
    })
   
  }

  //组件本身定位
  onLayoutCanvsSelf = (key,e) => {
    UIManager.measure(findNodeHandle(e.target), (x,y,width,height,pageX,pageY)=>{
      // console.log('onLayoutCanvsSelf')
      // console.log('x',x)
      // console.log('y',y)
      // console.log('canvaspageX',pageX)
      // console.log('canvaspageY',pageY)
    
      this.layoutBody.x = pageX
      this.layoutBody.y = pageY
      this.layoutMap.set(key+'', { ...this.layoutBody })
      this.setState((preState)=>({
        layoutMapState:new Map([...preState.layoutMapState,...this.layoutMap])
      }),()=>{
      })
      
    })
   
  }


  renderNode = (obj)=>{
    console.log('renderNode')
    if(!obj) return
    let nodeViewArr = []
    let textStyle = this.filterFuhao(obj.label)?styles.fuhaoText:styles.itemText
    let objResult = this.filterTreeData(obj)
    console.log('renderNode objResult',objResult)
    objResult.children&&objResult.children.length>0 ?
      nodeViewArr.push(
      <View style={{  alignItems: 'center'}}>
        <View  onLayout={(e) => this.onLayoutSelf(objResult.label,objResult.color, e)} style={{marginBottom:pxToDp(48),alignItems:'center'}}>
          <Text numberOfLines={10} style={[textStyle,{color:objResult.color }]}>{objResult.label}</Text>
        </View>
          <View style={{ flexDirection:'row'}} >
              {
                  objResult.children && objResult.children.length > 0 ? objResult.children.map((item, index) => {
                      return this.renderNode(item)
                  })
                      : ''
              }
          </View>
      </View>)
      : 
      nodeViewArr.push(<Text onLayout={(e) => this.onLayoutSelf(objResult.label,objResult.color ,e)} style={[textStyle,{marginRight:pxToDp(48),color:objResult.color}]}>{objResult.label}</Text>  )
    
    return  nodeViewArr
  }

  renderLine = ()=>{
      const {nodeList,treeLength,layoutMapState} = this.state
      if(nodeList.length <= 0 ) return
      let parentIndex = 0
      let  parentPoint  = {}
      let  childPoint = {}
      let parentId = ''
      let svgPointBody = {}
      let svgPointBodyArr = []
      let renderLineNodeList =  this.filterRenderLineNodeList([...nodeList])
      console.log('renderline renderLineNodeList',renderLineNodeList) 
      console.log('renderline layoutMap',layoutMapState) 
      if( renderLineNodeList.length <= 0 ) return    
      if(layoutMapState.size != renderLineNodeList.length+1) return   
      for(let i = 0 ;i<renderLineNodeList.length;i++){
        this.filterTreeList(renderLineNodeList[i])
        console.log('renderLine nodeList[i]',renderLineNodeList[i])
        if(!renderLineNodeList[i].parentId){
          continue
        }
        console.log('renderLineNodeList[i].parentId',renderLineNodeList[i].parentId)
        parentPoint.x = layoutMapState.get(renderLineNodeList[i].parentId).x-layoutMapState.get('canvasMeasure').x+layoutMapState.get(renderLineNodeList[i].parentId).width/2
        parentPoint.y = layoutMapState.get(renderLineNodeList[i].parentId).y-layoutMapState.get('canvasMeasure').y+layoutMapState.get(renderLineNodeList[i].parentId).height
        console.log('renderLine parentPoint',parentPoint)
        console.log('renderLineNodeList[i].label',renderLineNodeList[i].label)
        childPoint.x = layoutMapState.get(renderLineNodeList[i].label).x-layoutMapState.get('canvasMeasure').x+layoutMapState.get(renderLineNodeList[i].label).width/2
        childPoint.y = layoutMapState.get(renderLineNodeList[i].label).y-layoutMapState.get('canvasMeasure').y
        console.log('renderLine childPoint',childPoint)
        svgPointBody.x1 = parentPoint.x
        svgPointBody.y1 = parentPoint.y
        svgPointBody.x2 = childPoint.x
        svgPointBody.y2 = childPoint.y
        svgPointBody.color = layoutMapState.get(renderLineNodeList[i].label).color === layoutMapState.get(renderLineNodeList[i].parentId).color?layoutMapState.get(renderLineNodeList[i].label).color :'black'
        svgPointBodyArr.push({...svgPointBody})
      }

      console.log('this.svgPointBodyArr',svgPointBodyArr)
      if (svgPointBodyArr.length <= 0) return null
      console.log('showLine',svgPointBodyArr)
      let  lineArr = []
      for (let i = 0; i < svgPointBodyArr.length; i++) {
        lineArr.push(
          <Line  x1={svgPointBodyArr[i].x1} y1={svgPointBodyArr[i].y1} x2={svgPointBodyArr[i].x2} y2={svgPointBodyArr[i].y2}stroke={svgPointBodyArr[i].color||"black"} strokeWidth="1" />
        )
      }
      return lineArr
      
  }

  render() {
    return (
        <View style={{ width: '100%', height: '100%', zIndex: 999 }}>
          <ScrollView horizontal={true} style={{ flex: 1 }}>
            <View onLayout={(e) => this.onLayoutCanvsSelf('canvasMeasure',e)} >
              <Svg  width={'100%'} height={'100%'}>
                  <ForeignObject>
                    <View style={[{  zIndex: 999, }]}>
                       {this.renderNode(this.props.treeData)}
                    
                   </View>
                  </ForeignObject>      
                 {this.renderLine()}
            
              </Svg>
            </View>
          </ScrollView>

        </View>

    );
  }
}
const styles = StyleSheet.create({
  contentWrap: {
    backgroundColor: "#fff",
    zIndex: 1,
    minWidth: pxToDp(220),
    minHeight: pxToDp(110),
  },
  itemText:{
    fontSize:pxToDp(32),
    borderStyle:'solid',
    borderColor:'black',
    borderWidth:2,
    textAlign:'center',
    minWidth:pxToDp(48),
    height:pxToDp(48),
  },
  fuhaoText:{
    fontSize:pxToDp(32),
    // borderStyle:'solid',
    // borderColor:'black',
    // borderWidth:0,
    textAlign:'center',
  }
});
