import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  DeviceEventEmitter,
} from "react-native";
import { Toast, Modal } from "antd-mobile-rn";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import KeyboardAndAnswer from "../../../../component/math/Keyboard/KeyboardAndAnswer";
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/math/bag/index";
import axios from "../../../../util/http/axios";
import _axios from "axios";
import api from "../../../../util/http/api";
import Header from "../../../../component/math/Header";
import * as _ from "lodash";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import TopicCard from "../../../../component/math/TopicCard";
import topaicTypes from "../../../../res/data/MathTopaicType";
import {getDebounceTime } from "../../../../util/commonUtils";
import BaseButton from "../../../../component/BaseButton";
import { judgeByFront } from "../MathBagNumExerciseDiagnosis";
import mathdiagnosis from "../../../../util/diagnosis/MathSpecificDiagnosisModule";
import styles from "../../../../theme/math/doExcesiceStyle";
import HelpModal from "../../../../component/math/HelpModal";
import Explanation1 from "../../../../component/math/Topic/Explanation1";
import AnswerStatisticsModal from "../../../../component/math/Topic/AnswerStatisticsModal";
import ChioceNormal from "../../../../component/math/Topic/ChioceNormal";
import TopicSteam from "../../../../component/math/Topic/TopicSteam";
import LoadingModal from "../../../../component/LoadingModal";

let debounceTime = getDebounceTime();

// processType 业务流程区分   1：同步学习类流程、基础学习、同步学习题错题集基础学习 A计划 π计划基础学习 π计划同步学习   2：智能题类需要分布引导流程（同步应用题、拓展应用题），派学日记（前B计划，因为推的错题有活题） 3:智能题类不需要分布引导流程（同步计算题、B计划计算方向、π计划同步计算、拓展计算题）

class DoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.errorInfo = "抱歉，你答错了。";
    this.successInfo = "作答正确！";
    this.KeyboardAndAnswer = null;
    this.start_time = new Date().getTime();
    this.wrongNum = 0;
    this.nextTopaicThrottle = _.debounce(this.nextTopaic, debounceTime);
    this.wrongToNextTopaicThrottle = _.debounce(
      this.wrongToNextTopaic,
      debounceTime
    );
    this.continueWriteThrottle = _.debounce(this.continueWrite, debounceTime);
    this.origin = this.props.navigation.state.params.data.origin
    this.lesson_code = this.props.navigation.state.params.data.lesson_code
    this.status = this.props.navigation.state.params.data.status
    this.lesson_name = this.props.navigation.state.params.data.lesson_name
    this.content = '习题已完成'

    this.source = _axios.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
    this.cancelToken = this.source.token;
    this.wrongIdArr = []
    this.recommendProducts = []
    this.state = {
      answerStatisticsModalVisible: false,
      helpStatus: false,
      isLookHelp: false,
      // //引导
      currentAnswerNum: 0,
      diagnosisByFrontVal: "",
      isHidden: false, //同步计算题需要隐藏头部帮助按钮

      animating: true,
      all_count:0,
      topaicIndex:0,
      currentTopaicData:{},
      topaicDataList:[],
      isWrong:false,
      b_list:[]  
    };
  }
  componentDidMount() {
    this.getTopic()
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("refreshPage"); //返回页面刷新
    this.source.cancel("组件卸载,取消请求");
    this.setState = (state, callback) => {
      return;
    };
  }

  getAnswer = (value) => {
    if (value.length === 0) return;
    this.setState({
      diagnosisByFrontVal:value,
    });
  };
  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false }, () => {
      this.goBack();
    });
  };
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  helpMe = () => {
    this.setState({
      helpStatus: true,
      isLookHelp: true,
    });
  };
  onCloseHelp = () => {
    this.setState({
      helpStatus: false,
    });
  };
  getTopic = (status)=>{
    let obj = {
        origin:this.origin,
        lesson_code:this.lesson_code,
        status:status?status:this.status
    }
    axios.get(api.getMathDiagnosisTopic, { params: obj}).then((res) => {
        let data = res.data.data
        data = actionCreators.normalTopicChange(data)
        if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(data); //调用键盘清除方法
        if(this.state.topaicDataList.length === 0){
            let topaicDataList = []
            for(let i=0; i<data.all_count;i++){
                topaicDataList.push({})
            }
            if(this.status === 1){
                // 继续做题
                data.b_list.forEach((item,index)=>{
                    topaicDataList[index].colorFlag = item.correct === '0'?1:2
                })
                this.setState({
                  b_list:data.b_list
                })
            }
            this.setState({
                animating:false,
                topaicDataList
            })
        }
        this.setState({
            topaicIndex:data.now_count - 1,
            currentTopaicData:data,
        })
    });
  }

  getSaveData = (currentTopaicData)=>{
    let data = {
        s_d_id:currentTopaicData.s_d_id,
        m_e_s_id:currentTopaicData.m_e_s_id,
    }
    return data
  }

  //下一题进行诊断
  nextTopaic = async () => {
    const {
      diagnosisByFrontVal,
    } = this.state;
    const {currentTopaicData} = this.props
    let data = this.getSaveData(currentTopaicData)
    try {
      let result = [false, false];
      let finalresult = false;
      if (
        !diagnosisByFrontVal ||
        !diagnosisByFrontVal[0] ||
        !diagnosisByFrontVal[0][0]
      ) {
        console.log("没填答案算错");
        data.correct = "1";
        data.answer = ''
        this.onFail(data, "没有填写答案");
        return;
      }
      data.answer = JSON.stringify(diagnosisByFrontVal)
      switch (currentTopaicData.name) {
        case topaicTypes.Equation_Calculation:
            // 死题诊断
            result = await mathdiagnosis.NonAICalculateDiagnose(
              currentTopaicData._stem,
              currentTopaicData.answer_content,
              diagnosisByFrontVal
            );
            finalresult = result[0];
          break;
        case topaicTypes.Application_Questions:
            // 死题诊断
            result = await mathdiagnosis.NonAIAplDiagnose(
              currentTopaicData.equation_exercise,
              currentTopaicData.choice_txt,
              diagnosisByFrontVal,
              currentTopaicData.answer_content
            );
            finalresult = result[0];
          break;
        default:
          let judgeByFrontResult = judgeByFront(currentTopaicData, diagnosisByFrontVal,{})
          let reason = judgeByFrontResult.reason
          let value = judgeByFrontResult.value
          result = [
            value,
            reason?reason:"抱歉，你答错了哦",
          ]; //只有做错才给提示，所以死题默认给做错提示
          finalresult = result[0];
          break;
      }
      console.log("诊断结果", finalresult, result);
      // finalresult = true
      if (finalresult) {
        data.correct = "0"
        this.onSuccess(data);
      } else {
        data.correct = "1";
        this.onFail(data, result[1]);
      }
    } catch (e) {
      console.log("——————————————————————————catch答错");
      data.correct = "1";
      this.onFail(data, "抱歉，你答错了哦");
    }
  };

  toNext = (data, isSuccess) => {
    const { currentAnswerNum,topaicIndex,currentTopaicData,topaicDataList } = this.state;
    if (isSuccess) {
      this.start_time = new Date().getTime();
      if (topaicIndex + 1 === topaicDataList.length) {
          this.getAnswerResult();
          return
        }
      this.setState(() => ({
        currentAnswerNum: 0,
      }),()=>{
        this.getTopic('1')
      });
    } else {
      //当前题目已经完成分布引导过程还是做错
      if (currentAnswerNum + 1 === 1) 
        // 同步学习，同步计算不确定有没有这一步
        this.setState((preState) => ({
          currentAnswerNum: 1,
        }));
    }
  };

  //答题成功通用处理部分
  onSuccess = (data) => {
    const {topaicIndex} = this.state
    Toast.info('恭喜你答对了！', 1, () => {
      this.onSendResult(data, true);
    });
    let topaicDataList = JSON.parse(JSON.stringify(this.state.topaicDataList))
    topaicDataList[topaicIndex].colorFlag = 1
    this.setState({
        isWrong:false,
        topaicDataList
    })
  };

  //答题失败通用处理部分
  onFail = (data, errorInfo) => {
    const {topaicIndex,currentTopaicData} = this.state
    Toast.info(this.errorInfo, 2, () => {
        this.onSendResult(data, false, errorInfo);
      });
    let topaicDataList = JSON.parse(JSON.stringify(this.state.topaicDataList))
    topaicDataList[topaicIndex].colorFlag = 2
    this.errorInfo = errorInfo;
    this.wrongIdArr.push(currentTopaicData.m_e_s_id)
    this.setState({
        isWrong:true,
        topaicDataList
    })
  };

  //发送答题记录给后台
  onSendResult = (data, isSuccess) => {
    const {currentAnswerNum,topaicIndex,topaicDataList} = this.state
    if (currentAnswerNum + 1 === 1) {
      // 只第一次保存
      console.log('第一次保存数据',data)
      axios.post(api.saveMathDiagnosisTopic, data).then((res) => {
        this.toNext(data, isSuccess);
      });
    } else {
      this.toNext(data, isSuccess);
    }
  };

  //继续作答
  continueWrite = () => {
    const {  currentAnswerNum } = this.state;
    if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(); //调用键盘清除方法
    this.start_time = new Date().getTime();
    this.setState((preState) => ({
        currentAnswerNum: preState.currentAnswerNum + 1,
        isWrong:false
    }));
  };

  //讲解跳至下一题
  wrongToNextTopaic = () => {
    const { topaicIndex,topaicDataList,currentTopaicData } = this.state;
    if (topaicIndex + 1 == topaicDataList.length) {
      this.getAnswerResult();
      return;
    }
    this.start_time = new Date().getTime();
    this.setState(() => ({
      currentAnswerNum: 0,
      isWrong:false
    }),()=>{
        this.getTopic('1')
    });
  };

  renderTopaicOrKnowldge = () => {
    const { isWrong,currentAnswerNum } = this.state;
    if (isWrong) {
      //显示作业答题错误之后
      return this.renderKnowldge();
    } else {
      // 显示题
      return this.renderTopic();
    }
  };

  //显示作答题目
  renderTopic = () => {
    const {topaicIndex,currentTopaicData} = this.state;
    console.log("renderWriteTopaic data", currentTopaicData);
    if (
      Object.keys(currentTopaicData).length === 0
    ) {
      return (
        <Text style={{ marginLeft: pxToDp(24), fontSize: pxToDp(48) }}>
          数据加载中...
        </Text>
      );
    }
    return (
      <>
        <Text style={[styles.num]}>第{topaicIndex + 1}题</Text>
        <ScrollView>
          <View style={[appStyle.flexLine]}>
            <Text style={[styles.displayedTypeText]}>
              {currentTopaicData.displayed_type}
            </Text>
            {currentTopaicData.displayed_type === "选择题" ? (
              <Text style={[styles.displayedTypeTextChioce]}>
                {"（选项显示不全请上下滑动）"}
              </Text>
            ) : null}
          </View>
          <TopicSteam
            data={currentTopaicData}
          ></TopicSteam>
          {currentTopaicData.choice_content ? this.showChoice(currentTopaicData) : null}
        </ScrollView>
      </>
    );
  };

  //显示选择题题干
  showChoice = (currentTopaicData) => {
    return <ChioceNormal currentTopaicData={currentTopaicData}></ChioceNormal>;
  };

  renderKnowldge = () => {
    const {currentTopaicData} = this.state
    let htm = "";
      // 死题解析
    htm = <Explanation1 currentTopaicData={currentTopaicData}></Explanation1>
    return (
      <>
        <View style={{ flexDirection: "row-reverse" }}>
          <BaseButton
            style={styles.commonBtn}
            onPress={this.continueWriteThrottle}
            text={"继续作答"}
          ></BaseButton>
        </View>
        <ScrollView
        >
          {htm}
        </ScrollView>
        <View style={[appStyle.flexAliEnd]}>
          <BaseButton
            style={styles.commonBtn}
            onPress={this.wrongToNextTopaicThrottle}
            text={"下一题"}
          ></BaseButton>
        </View>
      </>
    );
  };

  //获取整套题作答结果
  getAnswerResult = () => {
    const {topaicDataList,b_list} = this.state
    const info = this.props.userInfo.toJS();
    let obj = {
        textbook:this.props.textCode,
        grade_code: info.checkGrade,
        term_code: info.checkTeam,
    }
    axios.get(api.getMathDiagnosisRecommend, { params: obj}).then((res) => {
        let data = res.data.data
        if(data.all_count > 0){
            // 代表做满了3套
            let rate = Math.round((data.right_count / data.all_count) * 100)
            this.content = `3套测试已完成，推荐以下模块`
            if(rate < 80 ){
                this.recommendProducts = ['知识图谱','同步学习']
            }
            if(rate>=80 && rate < 90 ){
                this.recommendProducts = ['同步学习','单元检测']
            }
            if(rate >= 90){
                this.recommendProducts = ['巧算','拓展应用','思维训练']
            }
            console.log('rate:',rate)
        }
        this.wrongNum = Array.from(new Set(this.wrongIdArr)).length
        if(b_list.length>0){
          b_list.forEach(i=>{
            if(i.correct === '1') this.wrongNum += 1
          })
        }
        this.yesNum = topaicDataList.length - this.wrongNum
        this.setState({
            answerStatisticsModalVisible: true,
        }); 
    });
  };

  renderLeft = () => {
    const { topaicDataList,isWrong} = this.state;
    return  <View style={[styles.left]}>
        <View style={[styles.leftOne]}>
        <TopicCard list={topaicDataList}></TopicCard>
        </View>
        <View style={[styles.leftTwo]}>
        {this.renderTopaicOrKnowldge()}
        <View style={{ flexDirection: "row-reverse" }}>
            {isWrong?null:<BaseButton
            style={styles.commonBtn}
            onPress={this.nextTopaicThrottle}
            text={"提交"}
        ></BaseButton>}
        </View>
    </View>
    </View>
  };

  renderRight = () => {
    const { currentTopaicData } = this.state;
      return <View style={[styles.right]}>
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
  };

  renderHelpModal = () => {
    const { helpStatus,currentTopaicData } = this.state;
      return (
        <HelpModal
          visible={helpStatus}
          currentTopaicData={currentTopaicData}
          onCloseHelp={this.onCloseHelp}
        ></HelpModal>
      );
  };

  render() {
    const { answerStatisticsModalVisible, isHidden, animating,currentTopaicData,topaicDataList } = this.state;
    if (topaicDataList.length === 0 && !animating)
    return (
      <View style={[styles.container]}>
        <Header
          text={this.lesson_name}
          goBack={this.goBack}
          seeHelp={this.helpMe}
          isHidden={isHidden}
        ></Header>
        <Text
          style={{
            fontSize: pxToDp(36),
            flex: 1,
            backgroundColor: "#fff",
            padding: pxToDp(32),
            borderRadius: pxToDp(32),
          }}
        >
          暂无数据
        </Text>
      </View>
    );
    return (
      <ImageBackground source={require('../../../../images/thinkingTraining/do_exercise_bg.png')} style={[styles.container]}>
        <Header
          text={this.lesson_name}
          goBack={this.goBack}
          seeHelp={this.helpMe}
          isHidden={isHidden}
        ></Header>
        {animating ? (
          <LoadingModal animating={animating}></LoadingModal>
        ) : (
          <View style={[styles.content, appStyle.flexLine]}>
            {this.renderLeft()}
            {this.renderRight()}
          </View>
        )}
        {this.renderHelpModal()}
        <AnswerStatisticsModal
          dialogVisible={answerStatisticsModalVisible}
          yesNumber={this.yesNum}
          wrongNum={this.wrongNum}
          closeDialog={this.closeAnswerStatisticsModal}
          content={this.content}
          recommendProducts = {this.recommendProducts}
        ></AnswerStatisticsModal>
      </ImageBackground>
    );
  }
}

const stylesSelf = StyleSheet.create({});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};
export default connect(mapStateToProps)(DoExercise);
