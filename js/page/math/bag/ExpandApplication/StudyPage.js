import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  DeviceEventEmitter,
  Modal,
  Platform
} from "react-native";
import { appStyle } from "../../../../theme";
import { getHeaderPadding, pxToDp, fitHeight } from "../../../../util/tools";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import { connect } from 'react-redux';
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import LoadingModal from '../../../../component/LoadingModal'
import HelpModal from './components/HelpModal'
import Stem from './components/Stem'
import {getDebounceTime} from '../../../../util/commonUtils'
import KeyboardAndAnswer from '../../../../component/math/Keyboard/KeyboardAndAnswer'
import AnswerStatisticsModal from '../../../../component/math/AnswerStatisticsModal'
import { Toast } from 'antd-mobile-rn';
import * as _ from "lodash";
import {changeTopicData} from './tools'
import Explanation2 from '../../../../component/math/Topic/Explanation2'
import mathdiagnosis from "../../../../util/diagnosis/MathSpecificDiagnosisModule";
import YindaoAnswerView from '../../../../component/math/Topic/YindaoAnswerView'
import MathFrameView from "../../../../component/math/MathFrameView";
import MathFrameSynthesisView from "../../../../component/math/MathFrameSynthesisView";
import * as actionCreators from "../../../../action/math/bag/index";
import VideoPlayer from '../EasyCalculation/VideoPlayer';
import StretchBtn from '../EasyCalculation/components/StretchBtn'
import Explanation from './components/Explanation'
import {judgeByFront} from '../../../math/bag/MathBagNumExerciseDiagnosis'
import topaicTypes from "../../../../res/data/MathTopaicType";
import ScribblingPadModal from "../../../../util/draft/ScribblingPadModal"

let debounceTime = getDebounceTime();
// scene_code为-1不引导，1要引导
class ExpandApplicationStudyPage extends PureComponent {
  constructor(props) {
    super(props);
    this.name = this.props.navigation.state.params.data.name
    this.practical_category = this.props.navigation.state.params.data.code
    this.answerNum = 0
    this.KeyboardAndAnswer = null;
    this.eventListenerRefreshPage = undefined
    this.submitThrottle = _.debounce(this.submit, debounceTime);
    this.info = ''
    this.state = {
      list:[],
      animating:true,
      currentTopaicData:{},
      visibleHelp:false,
      isWrong:true,   //一开始默认做错显示完整解析
      diagnosisByFrontVal:'',
      visibleSuccsess:false,
      isYinDao:false,
      exercise_result_fs:'',
      isOpen:false,
      isStart:false,
      yinDaoNum: -1,
      yindaoViewHeight: 0,
      yinDaoAnswerArr: [],
      yinDaoArr:[],
      videoIsVisible: false,
      draftVisible: false,
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
          currentTopaicData:data,
          animating:false,
        })
        if(data.alphabet_value){
          this.setState({
            isYinDao:data.isYinDao,
            yinDaoArr:data.equation_distribution
          })
        }
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
  getSaveData = (currentTopaicData)=>{
    let data = {
      e_h_id:currentTopaicData.set_id,
      m_a_id:currentTopaicData.m_a_id,
      right_answer:currentTopaicData.isFraction?JSON.stringify(currentTopaicData._answer_content):currentTopaicData._answer_content,
    }
    return data
  }
  submit = async()=>{
    const {currentTopaicData,diagnosisByFrontVal,exercise_result_fs,isYinDao,yinDaoNum} = this.state
    this.answerNum ++
    let data = this.getSaveData(currentTopaicData)
    data.exercise_result = currentTopaicData.isFraction?exercise_result_fs:JSON.stringify(diagnosisByFrontVal)
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
        this.onFail(data,'抱歉,你答错了')
      }
    }
  }
  onSuccess = (data)=>{
    const {isYinDao} = this.state
    Toast.info('恭喜你答对了！', 1,()=>{
      this.onSendResult(data)
    });
  }
  onFail = (data,info)=>{
    Toast.info(info, 2,()=>{
      this.setState({
        isWrong:true
      })
    });
  }
  onYindaoFail = (data,info)=>{
    Toast.info(info, 1,()=>{
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()
    });
  }

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
          yindaoViewHeight:0
        })
      }
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()
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
  onSendResult = (data)=>{
    console.log('保存数据',data)
    axios.post(api.saveExpandApplicationStudyTopic, data).then(res=>{
    })
    this.setState({
      visibleSuccsess:true
    })
  }
  closeAnswerStatisticsModal = () => {
    this.setState({ visibleSuccsess: false },()=>{
      this.goBack()
    });
  }
  toDoAnswer = ()=>{
    const {currentTopaicData} = this.state
    console.log('99999',JSON.parse(JSON.stringify(currentTopaicData)) )
    if(currentTopaicData.alphabet_value){
      this.setState({
        isYinDao:currentTopaicData.isYinDao,
        yinDaoNum:0
      })
    }
    this.setState({
      isWrong:false,
      isOpen:false,
      isStart:true,
    },()=>{
      if(this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData()  //调用键盘清除方法
    })

  }
  clickOpen = ()=>{
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  }
  renderLeft = ()=>{
    const {isWrong,currentTopaicData,yinDaoNum,isYinDao,isOpen} = this.state
    let htm = <>
    <ScrollView>
      {isYinDao?<View style={{width:pxToDp(140)}}>
        <StretchBtn clickOpen={this.clickOpen}></StretchBtn>
      </View>:null}
      <Stem currentTopaicData={currentTopaicData} width={isOpen?null:pxToDp(880)}></Stem>
      {isYinDao?this.renderMathFrameView(currentTopaicData):null}
    </ScrollView>
     {isOpen?null:<View style={[appStyle.flexAliEnd]}>
     <TouchableOpacity style={[styles.submitBtn,appStyle.flexCenter]} onPress={this.submitThrottle}>
      <Text style={[{fontSize:pxToDp(32),color:'#fff'}]}>提交</Text>
    </TouchableOpacity>
   </View>}
   </>
    if(isWrong){
      htm = <View>
        <View style={[appStyle.flexLine,appStyle.flexEnd]}>
          {isWrong?<>
            {currentTopaicData.exercise_video?<TouchableOpacity onPress={this.doVideoAction}>
              <Image style={[{ width:pxToDp(224),height:pxToDp(80), right: 25}]} source={require('../../../../images/study_page_video.png')} resizeMode="contain"></Image>
            </TouchableOpacity>:null}
            <TouchableOpacity  onPress={this.toDoAnswer}>
              <Image style={[{ width:pxToDp(224),height:pxToDp(80)}]} source={this.answerNum>0?require('../../../../images/study_page_reanswer.png'):require('../../../../images/study_page_answer.png')} resizeMode="contain"></Image>
            </TouchableOpacity>
          </>:null}
        </View>
        <ScrollView style={{height:fitHeight(0.68,0.7)}}>
        {currentTopaicData.alphabet_value?<Explanation2  currentTopaicData={currentTopaicData} yinDaoNum={yinDaoNum}></Explanation2>:<>
          <Stem currentTopaicData={currentTopaicData}></Stem>
          <Explanation currentTopaicData={currentTopaicData} ></Explanation>
          </>}
        </ScrollView>
      </View>
    }
    return <View style={[styles.left,isWrong || isOpen?{flex:1,marginRight:0}:null]}>
      {htm}
    </View>
  }
  // 框图渲染
  renderMathFrameView = (data) => {
    const { yinDaoNum, isYinDao } = this.state;
    let props_mat0 = actionCreators.getBlockdiagram(data, yinDaoNum);
    if (!props_mat0) return null;
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
  renderRight = ()=>{
    const {currentTopaicData,isYinDao,yindaoViewHeight,isOpen} = this.state
    return <View style={[styles.right,isOpen?{display:"none"}:'']}>
      {isYinDao ?<ScrollView style={{ maxHeight: pxToDp(300) }}>
                <View onLayout={this._onLayout}>
                  {this.renderYindaoAnswerView()}
                </View>
              </ScrollView>:null}
      <KeyboardAndAnswer
        onRef={(ref)=>{this.KeyboardAndAnswer = ref}}
        yindaoViewHeight={yindaoViewHeight}
        getAnswer={this.getAnswer}
        unitBtnArr={currentTopaicData.unitArr}
        topicType={currentTopaicData.displayed_type}
        fitHeightNum={[0.38,0.49]}
        >
       </KeyboardAndAnswer>
    </View>
  }
  _onLayout = (event) => {
    let { x, y, width, height } = event.nativeEvent.layout;
    // console.log("通过onLayout得到的高度：" + height);
    this.setState({
      yindaoViewHeight: height > pxToDp(300) ?pxToDp(300) : height,
    });
  };
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
  hideVideoShow = () => {
    console.log("will hide video")
    this.setState({"videoIsVisible": false})
  }

  doVideoAction = () => {
    console.log("click video...", this.state.videoIsVisible)
    this.setState({"videoIsVisible": true})
  }

  toggleDraftShow = () => {
    const {draftVisible} = this.state
    const newVisible = !draftVisible
    this.setState({
      draftVisible: newVisible,
    })
  }

  render() {
    const {animating,visibleHelp,currentTopaicData,isWrong,visibleSuccsess,isOpen,isStart, draftVisible} = this.state
    return (
        <ImageBackground style={[styles.container]} source={require('../../../../images/study_page_bg.png')}>
          <ScribblingPadModal visible={draftVisible} toggleEvent={this.toggleDraftShow}/>
          <Modal
              supportedOrientations={['portrait', 'landscape']}
              visible={this.state.videoIsVisible}>
              <VideoPlayer hideVideoShow={this.hideVideoShow} fileUrl={currentTopaicData["exercise_video"]}
            />
            </Modal>
            <View style={[styles.header, appStyle.flexCenter,Platform.OS === 'ios'?{paddingTop:getHeaderPadding(pxToDp(40)),marginBottom:pxToDp(80)}:null]}>
              <View style={styles.titleView}>
                <View style={[styles.yellowCircle, styles.circlePosition]}></View>
                <Text style={[styles.txt,{fontSize:pxToDp(42),color:"#fff"}]}>{'学习—'+(this.name||'拓展应用题')}</Text>
                <View style={[styles.yellowCircle, styles.circlePosition]}></View>
              </View>
              <TouchableOpacity style={[styles.backBtn,Platform.OS === 'ios'?{top:pxToDp(10)}:null]} onPress={() => {
                    this.goBack()
                  }}
              >
                <Image
                    source={require("../../../../images/study_page_back.png")}
                    style={[{width:pxToDp(80), height:pxToDp(80)}]}
                ></Image>
              </TouchableOpacity>
              {
                !isStart?null:<TouchableOpacity
                    style={[styles.draftBtn]}
                    onPress={() => this.toggleDraftShow()}
                >
                  <View
                      style={{
                        borderWidth: pxToDp(4),
                        borderColor: "#fbcd38",
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        width: pxToDp(140),
                        height: pxToDp(65),
                        borderRadius: pxToDp(30),
                      }}
                  >
                    <Text style={{fontSize: pxToDp(28), color: "#fbcd38"}}>打草稿</Text>
                  </View>
                </TouchableOpacity>
              }
              {!isStart?null:<TouchableOpacity
                  onPress={this.helpMe}
                  style={[styles.helpBtn,Platform.OS === 'ios'?{top:pxToDp(10)}:null]}
              >
                <Image
                    source={require("../../../../images/math_help.png")}
                    style={{width:'100%',height:'100%'}}
                ></Image>
              </TouchableOpacity>}
            </View>
            <View style={[styles.content, appStyle.flexLine]}>
             {animating?<LoadingModal animating={animating} height={fitHeight(0.8,0.82)}></LoadingModal>:Object.keys(currentTopaicData).length>0?<>
             {this.renderLeft()}
              {isWrong?null:this.renderRight()}
             </>:<Text style={{fontSize:pxToDp(32)}}>暂无数据</Text>}
          </View>
        <AnswerStatisticsModal dialogVisible={visibleSuccsess} content = {'点击返回按钮,查看是否解锁练习功能'} closeDialog={this.closeAnswerStatisticsModal}></AnswerStatisticsModal>
        <HelpModal currentTopaicData={currentTopaicData} visible={visibleHelp} onCloseHelp={this.onCloseHelp}></HelpModal>
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
  left:{
    position:'relative',
    width:pxToDp(950),
    backgroundColor:'#fff',
    height:fitHeight(0.8,0.834),
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
    marginRight:pxToDp(40)
  },
  right:{
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
  },
  header: {
    height: pxToDp(64),
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(40),
    position: "relative",
  },
  titleView: {
    // width: pxToDp(300),
    alignItems: "center",
    flexDirection: "row",
    height: pxToDp(96),
    backgroundColor: "#FFA900",
    borderRadius: 11,
  },
  yellowCircle: {
    alignItems:'center',
    justifyContent:'center',
    width: pxToDp(16),
    height:pxToDp(16),
    backgroundColor:'#FFD59F',
    borderColor:'#FFD59F',
    borderStyle:'solid',
    borderRadius:50,
    paddingBottom: 2,
    shadowColor: "black",
    elevation: 2,
    // boxShadow: "inset 0px 4px 0px 0px #CE9016",
  },
  circlePosition: {
    // position: ""
    marginLeft: pxToDp(20),
    marginRight: pxToDp(20),
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  helpBtn: {
    position: "absolute",
    right: 0,
    width: pxToDp(140),
    height: pxToDp(64),
  },
  submitBtn:{
    width: pxToDp(130),
    height: pxToDp(56),
    borderRadius: 80,
    fontSize: pxToDp(32),
    backgroundColor:'#33A1FDFF',
  },
  draftBtn: {
    position: "absolute",
    right: pxToDp(160),
    width: pxToDp(140),
    height: pxToDp(64),
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

export default connect(mapStateToProps, mapDispathToProps)(ExpandApplicationStudyPage)
