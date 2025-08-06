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
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, fitHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from 'react-redux';
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import Header from '../../../../component/math/Header'
import HelpModal from './components/HelpModal'
import LoadingModal from '../../../../component/LoadingModal'
import Stem from './components/Stem'
import KeyboardAndAnswer from '../../../../component/math/Keyboard/KeyboardAndAnswer'
import * as _ from "lodash";
import {getDebounceTime} from '../../../../util/commonUtils'
import {judgeByFront} from '../../../math/bag/MathBagNumExerciseDiagnosis'
import Explanation from './components/Explanation'
import { Toast } from 'antd-mobile-rn';
import AnswerStatisticsModal from '../../../../component/math/AnswerStatisticsModal'
import mathdiagnosis from "../../../../util/diagnosis/MathSpecificDiagnosisModule";
import topaicTypes from "../../../../res/data/MathTopaicType";
import StretchBtn from '../EasyCalculation/components/StretchBtn'
import Explanation2 from '../../../../component/math/Topic/Explanation2'
import * as actionCreators from "../../../../action/math/bag/index";
import MathFrameView from "../../../../component/math/MathFrameView";
import MathFrameSynthesisView from "../../../../component/math/MathFrameSynthesisView";
import YindaoAnswerView from '../../../../component/math/Topic/YindaoAnswerView'



let debounceTime = getDebounceTime();
class DoWrongExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined
    this.submitThrottle = _.debounce(this.submit, debounceTime);
    this.set_id = null
    this.state = {
      visibleHelp:false,
      currentTopaicData:this.props.navigation.state.params.data.currentTopaicData,
      isWrong:false,
      diagnosisByFrontVal:'',
      answerStatisticsVisible:false,
      isOpen:false,
      isYinDao:false,
      yinDaoNum: -1,
      yinDaoAnswerArr: [],
      yindaoViewHeight: 0,
      yinDaoArr:this.props.navigation.state.params.data.currentTopaicData.equation_distribution
    };
  }
  getAnswer = (value) => {
    if(value.length === 0) return
    this.setState({
      diagnosisByFrontVal:value,
    })
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  }
  componentWillUnmount(){
    DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
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
    const {currentTopaicData} = this.state
    if(currentTopaicData.isYinDao){
      this.setState({
        isYinDao:currentTopaicData.isYinDao,
        yinDaoNum:0
      })
    }
    this.setState({
      isWrong:false,
    },()=>{
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
    })
  }
  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsVisible: false }, () => {
      this.goBack();
    });
  };
  clickOpen = ()=>{
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }
  renderTopic = ()=>{
    const {currentTopaicData,isWrong,yinDaoNum,isYinDao,isOpen} = this.state
    if(isWrong){
      return <>
          <View style={[appStyle.flexTopLine,appStyle.flexJusBetween,]}>
            <View style={[appStyle.flexTopLine,appStyle.flexLineReverse,{marginBottom:pxToDp(16),width:'100%'}]}>
              <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.continue}>
                <Text style={[styles.btnText]}>继续作答</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            {currentTopaicData.alphabet_value?<Explanation2  currentTopaicData={currentTopaicData} yinDaoNum={yinDaoNum}></Explanation2>:<>
            <Stem currentTopaicData={currentTopaicData}></Stem>
            <Explanation currentTopaicData={currentTopaicData} ></Explanation>
            </>}
          </ScrollView>
      </>
    }else{
      return <>
          {isYinDao?<View style={[appStyle.flexAliEnd]}>
            <StretchBtn clickOpen={this.clickOpen}></StretchBtn>
          </View>:null}
          <ScrollView >
            <Stem currentTopaicData={currentTopaicData} width={isOpen?null:pxToDp(880)}></Stem>
            {isYinDao?this.renderMathFrameView(currentTopaicData):null}
          </ScrollView>
      </>
    }
  }
  // 框图渲染
  renderMathFrameView = (data) => {
    const { yinDaoNum, isYinDao } = this.state;
    let props_mat0 = actionCreators.getBlockdiagram(data, yinDaoNum);
    if (!props_mat0) return null;
    let htm = "";
    if (data.solve && data.solve.indexOf("框图") > -1) {
      return (
        <MathFrameView
          math_frame_svg0={props_mat0}
        ></MathFrameView>
      );
    }
    if (data.solve && data.solve === "综合法") {
      return (
        <MathFrameSynthesisView
          math_frame_svg0={props_mat0}
        ></MathFrameSynthesisView>
      );
    }
  };
  getSaveData = (currentTopaicData)=>{
    let data = {
        e_w_id:currentTopaicData.e_w_id
    }
    return data
  }
  submit = async()=>{
    const {currentTopaicData,diagnosisByFrontVal,isYinDao,yinDaoNum} = this.state
    let data = this.getSaveData(currentTopaicData)
    let value = true
    let reason = null
    let result = [value,reason?reason:'抱歉,你答错了']
    try{
      if(!diagnosisByFrontVal || !diagnosisByFrontVal[0] || !diagnosisByFrontVal[0][0]){
      // 没有写答案算错
      if(isYinDao){
        this.onYindaoFail(data,result[1])
      }else{
        this.onFail(data,result[1])
      }
    }else{
      if(currentTopaicData.alphabet_value){
        // 活题
        if(isYinDao){
          let equation = currentTopaicData.equation_distribution[yinDaoNum];
          result = await mathdiagnosis.SingleAIAplDiagnose(
            currentTopaicData.alphabet_value,
            currentTopaicData.variable_value,
            equation,
            JSON.parse(JSON.stringify(diagnosisByFrontVal))
          );
        }else{
          result = await mathdiagnosis.MultiAIAplDiagnose(
            currentTopaicData.alphabet_value,
            currentTopaicData.variable_value,
            currentTopaicData.equation_exercise,
            currentTopaicData.answer_content_beforeChange,
            JSON.parse(JSON.stringify(diagnosisByFrontVal))
          );
        }
      }else{
        // 死题
        if(currentTopaicData.name === topaicTypes.Application_Questions_NoDiagnosticProcess){
          // 不诊断过程的应用题
          let judgeByFrontResult = judgeByFront(currentTopaicData, diagnosisByFrontVal,data)
          let value = judgeByFrontResult.value
          result[0] = value
        }else{
          result = await mathdiagnosis.NonAIAplDiagnose(
            currentTopaicData.equation_list,
            currentTopaicData.choice_txt,
            diagnosisByFrontVal,
            currentTopaicData._answer_content
          );
        }
      }
      if(result[0]){
        // 答对了
        if(isYinDao){
          this.onYindaoSuccess(data)
        }else{
          this.onSuccess(data)
        }
      }else{
        // 答错了
        if(isYinDao){
          this.onYindaoFail(data,result[1])
        }else{
          this.onFail(data,result[1])
        }
      }
    }
    }catch (e){
      console.log("——————————————————————————catch答错");
      if(isYinDao){
        this.onYindaoFail(data,result[1])
      }else{
        this.onFail(data,result[1])
      }
      
    }
  }
  onSuccess = (data)=>{
    Toast.info('恭喜你答对了！', 1, () => {
    this.onSendResult(data,true)
    });
  }
  onFail = (data,info)=>{
    Toast.info(info, 2,()=>{
      this.setState({
        isWrong:true
      })
    });
  }
  getTrueOrFalse = (value) => {
    const { currentTopaicData } = this.state;
    if (currentTopaicData.unitArr && currentTopaicData.unitArr.length > 0) {
      for (let i = 0; i < currentTopaicData.unitArr.length; i++) {
        if (currentTopaicData.unitArr[i].value === value) {
          return true;
        }
      }
    }
    return false;
  };
  onYindaoSuccess = (data)=>{
    const {diagnosisByFrontVal,yinDaoNum,yinDaoArr,currentTopaicData} = this.state
    Toast.info('恭喜你答对了！', 1,()=>{
      if(yinDaoNum +1 < yinDaoArr.length){
        let yinDaoAnswer = [];
        if (
          currentTopaicData.exercise_data_type === "FS" ||
          currentTopaicData.data_type === "FS"
        ) {
          let _diagnosisByFrontVal = JSON.parse(
            JSON.stringify(diagnosisByFrontVal)
          );
          _diagnosisByFrontVal.forEach((i, index) => {
            i.forEach((j, indexj) => {
              if (
                j[0] === "+" ||
                j[0] === "-" ||
                j[0] === "×" ||
                j[0] === "÷" ||
                j[0] === "(" ||
                j[0] === ")" ||
                j[0] === "=" ||
                this.getTrueOrFalse(j[0]) ||
                j[0] === "[" ||
                j[0] === "]"
              ) {
                _diagnosisByFrontVal[index][indexj] = j[0];
              }
            });
          });
          _diagnosisByFrontVal.forEach((i) => {
            yinDaoAnswer = yinDaoAnswer.concat(i);
          });
          yinDaoAnswer = [yinDaoAnswer];
        } else{
          diagnosisByFrontVal.forEach((i, index) => {
            yinDaoAnswer = yinDaoAnswer.concat(i);
          });
          yinDaoAnswer = yinDaoAnswer.join("");
        }
        this.setState(
          (preState) => ({
            isYinDao: true,
            yinDaoNum: preState.yinDaoNum + 1,
            yinDaoAnswerArr: [...preState.yinDaoAnswerArr, yinDaoAnswer],
          })
        );
      }else{
        this.setState({
          isYinDao:false,
          isWrong:false,
          yinDaoNum:-1,
          yinDaoAnswerArr:[],
          yindaoViewHeight:0,
        })
      }
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()
    });
  }
  onYindaoFail = (data,info)=>{
    Toast.info(info, 1,()=>{
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()
    });
  }
  onSendResult = (data,result)=>{
    const {currentTopaicData} = this.state
    console.log('保存数据',data,currentTopaicData)
    if(currentTopaicData.isComprehensive){
      // 综合练习错题保存
      let obj = {
        t_w_id:currentTopaicData.t_w_id
      }
       axios.get(api.saveMathThinkingWronfComprehensiveTopic, {params:obj}).then(res=>{
      })
    }else{
      axios.get(api.saveExpandApplicationWrongTopic, data).then(res=>{
      })
    }
    this.setState({
      answerStatisticsVisible:true
    })
  }
  continueTodoTopic = ()=>{
    this.start_time = new Date().getTime();
    this.setState({
      isWrong:false,
      answerStatisticsVisible:false,
      isOpen:false
    })
  }
    //分步引导答题框渲染
    renderYindaoAnswerView = () => {
      const { yinDaoNum, yinDaoAnswerArr,currentTopaicData } = this.state;
      return (
        <YindaoAnswerView
          currentTopaicData={currentTopaicData}
          yinDaoNum={yinDaoNum}
          yinDaoAnswerArr={yinDaoAnswerArr}
        ></YindaoAnswerView>
      );
    };
    _onLayout = (event) => {
      let { x, y, width, height } = event.nativeEvent.layout;
      // console.log("通过onLayout得到的高度：" + height);
      this.setState({
        yindaoViewHeight: height > pxToDp(300) ? pxToDp(300) : height,
      });
    };
  render() {
    const {currentTopaicData,visibleHelp,isWrong,answerStatisticsVisible,isOpen,isYinDao,yindaoViewHeight} = this.state
    return (
    <ImageBackground source={require('../../../../images/thinkingTraining/do_exercise_bg.png')} style={[styles.container]}>
        <Header text={'错题集-再练一次'} goBack={this.goBack} seeHelp={this.helpMe}></Header>
        <View style={[appStyle.flexLine]}>
        {Object.keys(currentTopaicData).length === 0?<Text style={[styles.noData]}>暂无数据</Text>:<>
              <View style={[styles.left,isWrong || isOpen?{flex:1,marginRight:0}:null]}>
                {this.renderTopic()}
                {isOpen || isWrong?null:<View style={[appStyle.flexAliEnd]}>
                  <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.submitThrottle}>
                    <Text style={[styles.btnText]}>提交</Text>
                  </TouchableOpacity> 
                </View>
                }
            </View>
            {isWrong?null: <View style={[styles.right,isOpen?{display:'none'}:null]}>
              {isYinDao ?<ScrollView style={{ maxHeight: pxToDp(300) }}>
                <View onLayout={this._onLayout}>
                  {this.renderYindaoAnswerView()}
                </View>
              </ScrollView>:null}
              <KeyboardAndAnswer
                onRef={(ref) => {
                  this.KeyboardAndAnswer = ref;
                }}
                getAnswer={this.getAnswer}
                checkBtnArr={currentTopaicData.btnArr}
                unitBtnArr={currentTopaicData.unitArr}
                topicType={currentTopaicData.displayed_type}
                yindaoViewHeight={yindaoViewHeight}
              ></KeyboardAndAnswer>
            </View>}
          </>}
        </View>
        <HelpModal currentTopaicData={currentTopaicData} visible={visibleHelp} onCloseHelp={this.onCloseHelp}></HelpModal>
        <AnswerStatisticsModal dialogVisible={answerStatisticsVisible} btnText={"返回错题集"} content={"恭喜你答对了"} closeDialog={this.closeAnswerStatisticsModal}></AnswerStatisticsModal>
    </ImageBackground>  
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: pxToDp(40),
        paddingTop: pxToDp(28),
        backgroundColor: "#C8EFFF",
    },
    noData:{
      backgroundColor:'#fff',
      height:pxToDp(914),
      flex:1,
      borderRadius: pxToDp(32),
      fontSize:pxToDp(32),
      padding: pxToDp(40),
    },  
    left: {
        width: pxToDp(950),
        height: fitHeight(0.807,0.853),
        marginRight: pxToDp(40),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        padding: pxToDp(32),
        position:'relative'
    },
    right: {
      flex: 1,
      // height: fitHeight(0.81,0.88),
      backgroundColor: "#fff",
      borderRadius: pxToDp(32),
      padding: pxToDp(32),
    },
    baseBtn:{
      height: pxToDp(56),
      width:pxToDp(200),
      paddingLeft:pxToDp(32),
      paddingRight:pxToDp(32),
      borderRadius: pxToDp(40),
      backgroundColor:'#33A1FDFF',
    },
    btnText:{
      fontSize: pxToDp(32),
      color:'#fff'
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

export default connect(mapStateToProps, mapDispathToProps)(DoWrongExercise)
