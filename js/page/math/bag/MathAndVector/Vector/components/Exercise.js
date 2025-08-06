import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter
} from "react-native";
import { appStyle } from "../../../../../../theme";
import { size_tool, pxToDp, fitHeight } from "../../../../../../util/tools";
import { connect } from 'react-redux';
import axios from '../../../../../../util/http/axios'  
import api from '../../../../../../util/http/api'
import Header from '../../../../../../component/math/Header'
import HelpModal from "../../../../../../component/math/HelpModal";
import LoadingModal from '../../../../../../component/LoadingModal'
import TopicCard from "../../../../../../component/math/TopicCard";
import TopicSteam from "../../../../../../component/math/Topic/TopicSteam";
import KeyboardAndAnswer from '../../../../../../component/math/Keyboard/KeyboardAndAnswer'
import * as _ from "lodash";
import {getDebounceTime} from '../../../../../../util/commonUtils'
import {judgeByFront} from '../../../../../math/bag/MathBagNumExerciseDiagnosis'
import { Toast } from 'antd-mobile-rn';
import mathdiagnosis from "../../../../../../util/diagnosis/MathSpecificDiagnosisModule";
import topaicTypes from "../../../../../../res/data/MathTopaicType";
import styles from "../../../../../../theme/math/doExcesiceStyle";
import BaseButton from "../../../../../../component/BaseButton";
import ChioceNormal from "../../../../../../component/math/Topic/ChioceNormal";
import Explanation1 from "../../../../../../component/math/Topic/Explanation1";
let debounceTime = getDebounceTime();
class EasyCalculationDoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined
    this.submitThrottle = _.debounce(this.submit, debounceTime);
    this.toNextTopicThrottle = _.debounce(this.toNextTopic, debounceTime);
    // this.max_level = this.props.navigation.state.params.data.max_level
    this.answerNum = 0
    this.start_time = new Date().getTime();
    this.state = {
      animating:false,
      visibleHelp:false,
      topaicDataList:this.props.topaicDataList,
      isWrong:false,
      exampleTopicData:'',
      diagnosisByFrontVal:'',
      exercise_result_fs:'',
    };
  }
  getAnswer = (value) => {
    if(value.length === 0) return
    this.setState({
      diagnosisByFrontVal:value,
      exercise_result_fs:JSON.stringify(value) 
    })
  };
  componentDidMount() {
  }
  componentWillUnmount(){
    DeviceEventEmitter.emit("refreshPage", this.answer_origin); //返回页面刷新
  }
  goBack = () => {
    this.props.goBack()
    // NavigationUtil.goBack(this.props);
  }
  helpMe = () => {
    this.setState({
      visibleHelp: true,
    })
  }
  onCloseHelp = ()=>{
    this.setState({
      visibleHelp: false,
    })
  }
  continue = ()=>{
    if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
    this.setState({
      isWrong:false,
    })
  }
  renderTopic = ()=>{
    const {currentTopaicData,listIndex} = this.props
    const {isWrong} = this.state
    if(isWrong){
      return <>
          <View style={[appStyle.flexTopLine,appStyle.flexJusBetween,]}>
            <Text style={[{fontSize:pxToDp(32),color:'#AAAAAA'}]}>第{listIndex+1}题</Text>
            <View style={[appStyle.flexTopLine,{marginBottom:pxToDp(16)}]}>
            <BaseButton style={styles.commonBtn} onPress={this.continue} text={"继续作答"}></BaseButton>
            </View>
          </View>
          <ScrollView>
          <Explanation1 currentTopaicData={currentTopaicData}></Explanation1>
          </ScrollView>
      </>
    }else{
      return <>
          <View style={[appStyle.flexTopLine,appStyle.flexJusBetween]}>
            <View>
              <Text style={[{fontSize:pxToDp(32),color:'#AAAAAA'}]}>第{listIndex+1}题</Text>
              <Text style={[{fontSize:pxToDp(36)}]}>{currentTopaicData.displayed_type}</Text>
            </View>
          </View>
          <ScrollView >
          <TopicSteam data={currentTopaicData}></TopicSteam>
            {currentTopaicData.choice_content?<ChioceNormal currentTopaicData={currentTopaicData}></ChioceNormal>:null}
          </ScrollView>
      </>
    }
  }
  getSaveData = (currentTopaicData)=>{
    let data = {
    }
    return data
  }
  submit = async()=>{
    const {currentTopaicData} = this.props
    const {diagnosisByFrontVal,exercise_result_fs} = this.state
    this.answerNum ++
    let data = this.getSaveData(currentTopaicData)
    data.exercise_result = currentTopaicData.topic_type === '0'?JSON.stringify(diagnosisByFrontVal):exercise_result_fs
    let endTime = new Date().getTime();
    let spend_time = parseInt((endTime - this.start_time) / 1000);
    data.spend_time = spend_time;
    try{
      if(!diagnosisByFrontVal || !diagnosisByFrontVal[0] || !diagnosisByFrontVal[0][0]){
      // 没有写答案算错
      data.correction = '0'
      data.exercise_result = ''
      this.onFail(data,'抱歉,你答错了')
    }else{
      let value = true
      let reason = null
      let result = [value,reason?reason:'抱歉,你答错了']
      switch(currentTopaicData.exercise_type_name) {
        case topaicTypes.Application_Questions:
        // 死题诊断
        result = await mathdiagnosis.NonAIAplDiagnose(
            currentTopaicData.equation_exercise,
            currentTopaicData.choice_txt,
            diagnosisByFrontVal,
            currentTopaicData.answer_content
        );
    break;
        default:
          let judgeByFrontResult = judgeByFront(currentTopaicData, diagnosisByFrontVal,{})
          reason = judgeByFrontResult.reason
          value = judgeByFrontResult.value
          result = [value,reason?reason:'抱歉,你答错了']
      }
      if(result[0]){
        // 答对了
        data.correction = '1'
        this.onSuccess(data)
      }else{
        // 答错了
        data.correction = '0'
        this.onFail(data,result[1])
      }
    }
    }catch (e){
      console.log("——————————————————————————catch答错");
      data.correction = "0";
      this.onFail(data,'抱歉,你答错了')
    }
  }
  toNextTopic = (correct)=>{
    const {topaicDataList,} = this.state
    if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
    this.answerNum = 0
    this.start_time = new Date().getTime();
    this.setState((prevState, props)=>({
        isWrong:false,
    }))
    this.props.toNextTopic(topaicDataList,correct)
  }
  onSuccess = (data)=>{
    const {listIndex} = this.props
    const {topaicDataList} = this.state
    Toast.info('恭喜你答对了！', 1, () => {
      let _topaicDataList = JSON.parse(JSON.stringify(topaicDataList))
      _topaicDataList[listIndex].colorFlag = 1
      this.setState({
        topaicDataList:_topaicDataList
      })
      if(this.answerNum === 1){
        console.log('保存数据')
        this.onSendResult(data,true)
      }else{
        this.toNextTopic()
      }
    });
  
  }
  onFail = (data,info)=>{
    const {currentTopaicData,listIndex} = this.props
    const {topaicDataList} = this.state
    Toast.info(info, 2,()=>{
      if(this.answerNum === 1){
        console.log('保存数据')
        this.onSendResult(data,false)
      }
      this.setState({
        isWrong:true
      })
      let _topaicDataList = JSON.parse(JSON.stringify(topaicDataList))
      _topaicDataList[listIndex].colorFlag = 2
      this.setState({
        topaicDataList:_topaicDataList
      })
    });
  }
  onSendResult = (data,result)=>{
    // console.log('保存数据',data)
    // axios.post(api.saveExpandStudyrecord, data).then(res=>{
    // })
    if(result){
      // 作答成功
      this.toNextTopic(true)
    }
  }
  render() {
    const {currentTopaicData} = this.props
    const {animating,visibleHelp,topaicDataList,exampleTopicData,isWrong,answerStatisticsVisible} = this.state
    console.log('当前的题目',currentTopaicData)
    return (
    <ImageBackground source={require('../../../../../../images/thinkingTraining/do_exercise_bg.png')} style={[styles.container]}>
        <Header text={this.props.name} goBack={this.goBack} seeHelp={this.helpMe}></Header>
        <View style={[appStyle.flexLine]}>
        {animating?<LoadingModal animating={animating} height={fitHeight(0.81,0.87)}></LoadingModal>:<>
        {topaicDataList.length === 0?<Text style={[selfStyles.noData]}>暂无数据</Text>:<>
              <View style={[styles.left]}>
                <View style={[styles.leftOne]}>
                    <TopicCard list={topaicDataList}></TopicCard>
                </View>
                <View style={[styles.leftTwo]}>
                    {this.renderTopic()}
                    <View style={[appStyle.flexAliEnd]}>
                      {isWrong?
                       <BaseButton style={styles.commonBtn} onPress={this.toNextTopicThrottle} text={"下一题"}></BaseButton>
                      :<BaseButton style={styles.commonBtn} onPress={this.submitThrottle} text={"提交"}></BaseButton>
                      }
                    </View>
                </View>
            </View>
            <View style={[styles.right]}>
            <KeyboardAndAnswer
                onRef={(ref) => {
                this.KeyboardAndAnswer = ref;
                }}
                getAnswer={this.getAnswer}
                checkBtnArr={currentTopaicData.btnArr}
                tip={currentTopaicData.tip}
                unitBtnArr={currentTopaicData.unitArr}
                topicType={currentTopaicData.displayed_type}
            ></KeyboardAndAnswer>
            </View>
          </>}
        </>}
        </View>
        <HelpModal currentTopaicData={currentTopaicData} visible={visibleHelp} onCloseHelp={this.onCloseHelp}></HelpModal>
    </ImageBackground>  
    );
  }
}
const selfStyles = StyleSheet.create({
    noData:{
      backgroundColor:'#fff',
      height:pxToDp(914),
      flex:1,
      borderRadius: pxToDp(32),
      fontSize:pxToDp(32),
      padding: pxToDp(40),
    }, 
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(['userInfo', 'currentUserInfo']),
    textCode: state.getIn(['bagMath', 'textBookCode'])
  }
}

const mapDispathToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispathToProps)(EasyCalculationDoExercise)
