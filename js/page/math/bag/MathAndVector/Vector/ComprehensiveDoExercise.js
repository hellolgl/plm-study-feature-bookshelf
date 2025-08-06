import React, {Component} from "react"
import { View } from "react-native"
import api from "../../../../../util/http/api";
import axios from "../../../../../util/http/axios";
import Exercise from './components/Exercise'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import * as actionCreators from "../../../../../action/math/bag/index";
import OperationExercise from './components/OperationExercise'
import AnswerStatisticsModal from "../../../../../component/math/Topic/AnswerStatisticsModal";

const log = console.log.bind(console)

class ComprehensiveDoExercise extends Component {
    constructor(props) {
        super(props)
        this.g_n_id = this.props.navigation.state.params.data.g_n_id
        this.name = this.props.navigation.state.params.data.name
        this.yesNum = 0
        this.wrongNum = 0
        this.correctIdArr = []
        this.state = {
            isOperation:false,
            currentTopaicData:{},
            listIndex:-1,
            topaicDataList:[],
            answerStatisticsVisible:false
        }
    }
    goBack = ()=>{
        NavigationUtil.goBack(this.props);
    }

    componentDidMount(){
        // this.getTopic()
        const {listIndex} = this.state
        axios.get(api.getMathVectorComprehensiveTopicStatus, { params: {g_n_id:this.g_n_id}}).then((res) => {
            let data = res.data.data
            let topaicDataList = []
            for(let i in data){
                for(let j in data[i]){
                    topaicDataList.push({id:data[i][j],type:i,level:j})
                }
            }
            this.setState({
                topaicDataList
            })
            if(data.dead || (data.dead && data.live)){
                this.setState({
                    isOperation:false
                })
            }
            if(!data.dead && data.live){
                this.setState({
                    isOperation:true
                })
            }
            this.getTopic(topaicDataList[listIndex+1])
        });
    }

    getTopic = (data)=>{
        const {topaicDataList} = this.state
        if(!data){
            this.yesNum = this.correctIdArr.length 
            this.wrongNum = topaicDataList.length - this.yesNum
            this.setState({
                answerStatisticsVisible:true
            })
            // console.log('最终统计',this.correctIdArr,this.yesNum,this.wrongNum)
            return
        }
        let obj = {
            level:data.level,
            g_n_id:this.g_n_id
        }
        if(data.type === 'dead'){
            // 死题
            axios.get(api.getMathVectorComprehensiveTopic, { params: obj}).then((res) => {
                let data = res.data.data
                data.name = data.exercise_type_name
                data = actionCreators.normalTopicChange(data)
                console.log('死题',data)
                this.setState((prevState, props)=>({
                    currentTopaicData:data,
                    listIndex: prevState.listIndex +1,
                    isOperation:false
                  }))
            });
        }else{
            // 活题
            axios.get(api.getMathVectorComprehensiveTopicOperat, { params: obj}).then((res) => {
                let data = res.data.data
                console.log('活题',data)
                this.setState((prevState, props)=>({
                    currentTopaicData:data,
                    listIndex: prevState.listIndex +1,
                    isOperation:true
                  }))
            });
        }
      }
    
      toNextTopic = (topaicDataList_new,correct)=>{
        const {listIndex} = this.state
        console.log('跳下一道题',topaicDataList_new,listIndex,correct)
        if(correct) this.correctIdArr.push(topaicDataList_new[listIndex].id)
        console.log('this.correctIdArr',this.correctIdArr)
        this.getTopic(topaicDataList_new[listIndex+1])
        this.setState({
            topaicDataList:JSON.parse(JSON.stringify(topaicDataList_new)) 
        })
      }
      closeAnswerStatisticsModal = () => {
        this.setState({ answerStatisticsVisible: false }, () => {
          this.goBack();
        });
      };
    render() {
        const {currentTopaicData,listIndex,isOperation,topaicDataList,answerStatisticsVisible} = this.state
        if(topaicDataList.length === 0) return null
        return <>
        {isOperation?<OperationExercise goBack={this.goBack} currentTopaicData={currentTopaicData} listIndex={listIndex} toNextTopic={this.toNextTopic} topaicDataList={topaicDataList}></OperationExercise>
        : <Exercise name={this.name} goBack={this.goBack} currentTopaicData={currentTopaicData} listIndex={listIndex} toNextTopic={this.toNextTopic}  topaicDataList={topaicDataList}></Exercise>}
        <AnswerStatisticsModal
          dialogVisible={answerStatisticsVisible}
          yesNumber={this.yesNum}
          wrongNum={this.wrongNum}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
        </>
    }
}

export default ComprehensiveDoExercise