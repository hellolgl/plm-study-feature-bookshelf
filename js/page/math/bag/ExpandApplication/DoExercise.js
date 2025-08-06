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
import TopicCard from "../../../../component/math/TopicCard";
import Stem from './components/Stem'
import KeyboardAndAnswer from '../../../../component/math/Keyboard/KeyboardAndAnswer'
import ExampleTopic from '../EasyCalculation/components/ExampleTopic'
import * as _ from "lodash";
import {getDebounceTime} from '../../../../util/commonUtils'
import {judgeByFront} from '../../../math/bag/MathBagNumExerciseDiagnosis'
import Explanation from './components/Explanation'
import { Toast } from 'antd-mobile-rn';
import AnswerStatisticsModal from "../../../../component/math/Topic/AnswerStatisticsModal";
import {changeTopicData} from './tools'
import mathdiagnosis from "../../../../util/diagnosis/MathSpecificDiagnosisModule";
import topaicTypes from "../../../../res/data/MathTopaicType";
import StretchBtn from '../EasyCalculation/components/StretchBtn'
import Explanation2 from '../../../../component/math/Topic/Explanation2'
import * as actionCreators from "../../../../action/math/bag/index";
import MathFrameView from "../../../../component/math/MathFrameView";
import MathFrameSynthesisView from "../../../../component/math/MathFrameSynthesisView";
import YindaoAnswerView from '../../../../component/math/Topic/YindaoAnswerView'



let debounceTime = getDebounceTime();
class EasyCalculationDoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.eventListenerRefreshPage = undefined
    this.name = this.props.navigation.state.params.data.name  
    this.practical_category = this.props.navigation.state.params.data.practical_category
    this.seeExampleThrottle = _.debounce(this.seeExample, debounceTime);
    this.submitThrottle = _.debounce(this.submit, debounceTime);
    this.toNextTopicThrottle = _.debounce(this.toNextTopic, debounceTime);
    this.max_level = this.props.navigation.state.params.data.max_level
    this.answerNum = 0
    this.yesNum = 0
    this.wrongNum = 0
    this.wrongIdArr = []
    this.set_id = null
    this.start_time = new Date().getTime();
    this.state = {
      animating:true,
      visibleHelp:false,
      currentTopaicData:{},
      topaicDataList:[{},{},{}],
      listIndex:0,
      isWrong:false,
      showExample:false,
      exampleTopicData:'',
      diagnosisByFrontVal:'',
      answerStatisticsVisible:false,
      exercise_result_fs:'',
      isOpen:false,
      isYinDao:false,
      yinDaoNum: -1,
      yinDaoAnswerArr: [],
      yindaoViewHeight: 0,
      yinDaoArr:[]
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
    this.getData()
  }
  componentWillUnmount(){
    DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
  }
  getData = () => {
    const { userInfo, textCode } = this.props
    const {listIndex} = this.state
    const userInfoJs = userInfo.toJS();
    let first = listIndex+1
    let obj = {
      textbook: textCode,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      practical_category:this.practical_category,
      first
    }
    axios.get(api.getExpandApplicationDoTopic, { params: obj }).then(
      res => {
          let data = res.data.data.data
          data = changeTopicData(data)
          this.setState({
            animating:false,
            currentTopaicData:data,
          })
          if(data.alphabet_value){
            this.setState({
              yinDaoArr:data.equation_distribution
            })
          }
          if(first === 1) this.set_id = res.data.data.set_id
          this.expand_level = res.data.data.data.exercise_level?res.data.data.data.exercise_level:null
      }
    )
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
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
  seeExample = ()=>{
    const {exampleTopicData} = this.state
    if(!exampleTopicData){
      const { userInfo, textCode } = this.props
      const userInfoJs = userInfo.toJS();
      let obj = {
        textbook: textCode,
        grade_code: userInfoJs.checkGrade,
        term_code: userInfoJs.checkTeam,
        practical_category:this.practical_category
      }
      axios.get(api.getExpandApplicationStudy, { params: obj }).then(
        res => {
          let data = res.data.data
          data = changeTopicData(data)
          this.setState({
            exampleTopicData:data,
            showExample:true
          })
        }
      )
    }else{
      this.setState({
        showExample:true
      })
    }
  }
  closeExample = ()=>{
    this.setState({
      showExample:false
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
    const {currentTopaicData,isWrong,listIndex,yinDaoNum,isYinDao,isOpen} = this.state
    if(isWrong){
      return <>
          <View style={[appStyle.flexTopLine,appStyle.flexJusBetween,]}>
            <Text style={[{fontSize:pxToDp(32),color:'#AAAAAA'}]}>第{listIndex+1}题</Text>
            <View style={[appStyle.flexTopLine,{marginBottom:pxToDp(16)}]}>
              <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter,{marginRight:pxToDp(16)}]} onPress={this.seeExampleThrottle}>
                <Text style={[styles.btnText]}>查看例题</Text>
              </TouchableOpacity>
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
          <View style={[appStyle.flexTopLine,appStyle.flexJusBetween]}>
            <View>
              <Text style={[{fontSize:pxToDp(32),color:'#AAAAAA'}]}>第{listIndex+1}题</Text>
              <Text style={[{fontSize:pxToDp(36)}]}>{currentTopaicData.displayed_type}{currentTopaicData.stem_tips?currentTopaicData.stem_tips:null}</Text>
            </View>
            {isYinDao?<View style={{position:'absolute',right:pxToDp(220)}}>
              <StretchBtn clickOpen={this.clickOpen}></StretchBtn>
            </View>:null}
            <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.seeExampleThrottle}>
              <Text style={[styles.btnText]}>查看例题</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
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
      e_h_id:this.set_id,
      m_a_id:currentTopaicData.m_a_id,
      right_answer:currentTopaicData.isFraction?JSON.stringify(currentTopaicData._answer_content):currentTopaicData._answer_content,
    }
    if(currentTopaicData.alphabet_value) data.alphabet_value = currentTopaicData.alphabet_value
    return data
  }
  submit = async()=>{
    const {currentTopaicData,diagnosisByFrontVal,exercise_result_fs,isYinDao,yinDaoNum} = this.state
    this.answerNum ++
    let data = this.getSaveData(currentTopaicData)
    data.exercise_result = currentTopaicData.isFraction?exercise_result_fs:JSON.stringify(diagnosisByFrontVal)
    let endTime = new Date().getTime();
    let spend_time = parseInt((endTime - this.start_time) / 1000);
    data.spend_time = spend_time;
    let value = true
    let reason = null
    let result = [value,reason?reason:'抱歉,你答错了']
    try{
      if(!diagnosisByFrontVal || !diagnosisByFrontVal[0] || !diagnosisByFrontVal[0][0]){
      // 没有写答案算错
      data.correction = '0'
      data.exercise_result = ''
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
        data.correction = '1'
        if(isYinDao){
          this.onYindaoSuccess(data)
        }else{
          this.onSuccess(data)
        }
      }else{
        // 答错了
        data.correction = '0'
        if(isYinDao){
          this.onYindaoFail(data,result[1])
        }else{
          this.onFail(data,result[1])
        }
      }
    }
    }catch (e){
      console.log("——————————————————————————catch答错");
      data.correction = "0";
      if(isYinDao){
        this.onYindaoFail(data,result[1])
      }else{
        this.onFail(data,result[1])
      }
      
    }
  }
  toNextTopic = ()=>{
    const {listIndex,topaicDataList,} = this.state
    this.answerNum = 0
    this.start_time = new Date().getTime();
    if(topaicDataList.length-1 === listIndex){
      this.wrongNum = Array.from(new Set(this.wrongIdArr)).length
      this.yesNum = topaicDataList.length - this.wrongNum
      console.log('最后一题做完，弹统计框',this.wrongNum,this.yesNum,this.wrongIdArr)
      this.setState({
        answerStatisticsVisible:true
      })
    }else{
      this.setState((prevState, props) => (
        {
        listIndex: prevState.listIndex +1,
        isWrong:false,
        isOpen:false
      }),()=>{
        if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
        this.getData()
      });
    }
  }
  onSuccess = (data)=>{
    const {listIndex,topaicDataList} = this.state
    Toast.info('恭喜你答对了！', 1, () => {
      if(this.answerNum === 1){
        console.log('保存数据')
        this.onSendResult(data,true)
      }else{
        this.toNextTopic()
      }
      let _topaicDataList = JSON.parse(JSON.stringify(topaicDataList))
      _topaicDataList[listIndex].colorFlag = 1
      this.setState({
        topaicDataList:_topaicDataList
      })
    });
  
  }
  onFail = (data,info)=>{
    const {listIndex,topaicDataList,currentTopaicData} = this.state
    Toast.info(info, 2,()=>{
      if(this.answerNum === 1){
        this.wrongIdArr.push(currentTopaicData.m_a_id)
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
    const {diagnosisByFrontVal,yinDaoNum,yinDaoArr,currentTopaicData,listIndex} = this.state
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
        },()=>{
          this.toNextTopic()
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
    console.log('保存数据',data)
    axios.post(api.saveExpandApplicationStudyTopic, data).then(res=>{
      if(result){
        // 作答成功
        this.toNextTopic()
      }
    })
  }
  continueTodoTopic = ()=>{
    this.answerNum = 0
    this.wrongIdArr = []
    this.start_time = new Date().getTime();
    this.setState({
      isWrong:false,
      listIndex:0,
      exampleTopicData:'',
      answerStatisticsVisible:false,
      isOpen:false,
      isYinDao:false,
      yinDaoNum:-1,
      yinDaoAnswerArr:[],
      yindaoViewHeight:0,
      topaicDataList:[{},{},{}],
    },()=>{
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
      this.getData()
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
    const {currentTopaicData,animating,visibleHelp,topaicDataList,listIndex,showExample,exampleTopicData,isWrong,answerStatisticsVisible,isOpen,isYinDao,yindaoViewHeight} = this.state
    return (
    <ImageBackground source={require('../../../../images/thinkingTraining/do_exercise_bg.png')} style={[styles.container]}>
        <Header text={this.name||'拓展应用'} goBack={this.goBack} seeHelp={this.helpMe} isHiddenBack={showExample?true:false}></Header>
        <View style={[appStyle.flexLine]}>
        {animating?<LoadingModal animating={animating} height={fitHeight(0.807,0.853)}></LoadingModal>:<>
        {Object.keys(currentTopaicData).length === 0?<Text style={[styles.noData]}>暂无数据</Text>:<>
              <View style={[styles.left,isWrong || isOpen?{flex:1,marginRight:0}:null]}>
                {isWrong || isOpen?null:<View style={[styles.leftOne]}>
                    <TopicCard list={topaicDataList}></TopicCard>
                </View>}
                <View style={[styles.leftTwo,isWrong || isOpen?{height: fitHeight(0.807,0.853),}:null]}>
                    {this.renderTopic()}
                    <View style={[appStyle.flexAliEnd]}>
                      {isWrong?<TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.toNextTopicThrottle}>
                        <Text style={[styles.btnText]}>下一题</Text>
                      </TouchableOpacity>:isOpen?null:
                        <TouchableOpacity style={[styles.baseBtn,appStyle.flexCenter]} onPress={this.submitThrottle}>
                          <Text style={[styles.btnText]}>提交</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
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
        </>}
        </View>
        <HelpModal currentTopaicData={currentTopaicData} visible={visibleHelp} onCloseHelp={this.onCloseHelp}></HelpModal>
        <AnswerStatisticsModal
          dialogVisible={answerStatisticsVisible}
          yesNumber={this.yesNum}
          wrongNum={this.wrongNum}
          closeDialog={this.closeAnswerStatisticsModal}
          continue={ this.continueTodoTopic}
          showContinue = {this.max_level === this.expand_level?false:true}
          content = {this.max_level === this.expand_level && this.yesNum === 3?'恭喜你已达到本阶段最高水平':null}
        ></AnswerStatisticsModal>
        {showExample?<View style={[styles.example]}>
            <ExampleTopic currentTopaicData={exampleTopicData} close={this.closeExample}></ExampleTopic>
        </View>:null}
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
        marginRight: pxToDp(40),
    },
    leftOne: {
      height:fitHeight(0.12,0.1),
        backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        marginBottom: pxToDp(40),
    },
    leftTwo: {
      position: "relative",
      height: fitHeight(0.653,0.73),
      backgroundColor: "#fff",
      borderRadius: pxToDp(32),
      padding: pxToDp(32),
    },
    right: {
      flex: 1,
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
    example:{
      position:'absolute',
      width:pxToDp(1970),
      height:pxToDp(914),
      left:pxToDp(40),
      top:pxToDp(130),
      borderRadius:pxToDp(32),
      backgroundColor:'#fff'
    }
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
