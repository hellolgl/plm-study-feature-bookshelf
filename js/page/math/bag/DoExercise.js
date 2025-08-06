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
import { appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import KeyboardAndAnswer from "../../../component/math/Keyboard/KeyboardAndAnswer";
import { connect } from "react-redux";
import * as actionCreators from "../../../action/math/bag/index";
import axios from "../../../util/http/axios";
import _axios from "axios";
import api from "../../../util/http/api";
import Header from "../../../component/math/Header";
import * as _ from "lodash";
import NavigationUtil from "../../../navigator/NavigationUtil";
import TopicCard from "../../../component/math/TopicCard";
import topaicTypes from "../../../res/data/MathTopaicType";
import {getDebounceTime } from "../../../util/commonUtils";
import BaseButton from "../../../component/BaseButton";
import { judgeByFront } from "./MathBagNumExerciseDiagnosis";
import mathdiagnosis from "../../../util/diagnosis/MathSpecificDiagnosisModule";
import styles from "../../../theme/math/doExcesiceStyle";
import HelpModal from "../../../component/math/HelpModal";
import url from "../../../util/url";
import HelpMadalApplication from "../../../component/math/HelpMadalApplication";
import Explanation1 from "../../../component/math/Topic/Explanation1";
import Explanation2 from "../../../component/math/Topic/Explanation2";
import Explanation3 from "../../../component/math/Topic/Explanation3";
import AnswerStatisticsModal from "../../../component/math/Topic/AnswerStatisticsModal";
import YindaoAnswerView from "../../../component/math/Topic/YindaoAnswerView";
import MathFrameView from "../../../component/math/MathFrameView";
import MathFrameSynthesisView from "../../../component/math/MathFrameSynthesisView";
import ChioceNormal from "../../../component/math/Topic/ChioceNormal";
import TopicSteam from "../../../component/math/Topic/TopicSteam";
import LoadingModal from "../../../component/LoadingModal";
import StretchBtn from "../../../component/math/Topic/StretchBtn";

let debounceTime = getDebounceTime();

// processType 业务流程区分   1：同步学习类流程、基础学习、同步学习题错题集基础学习 A计划 π计划基础学习 π计划同步学习   2：智能题类需要分布引导流程（同步应用题、拓展应用题），派学日记（前B计划，因为推的错题有活题） 3:智能题类不需要分布引导流程（同步计算题、B计划计算方向、π计划同步计算、拓展计算题）

// 保存题接口
const apiMap = {
  "6": api.savenonPracticalExercise,
  "4": api.savenonPracticalExercise,
  "2": api.savenonPracticalExercise,
  "5": api.savenonPracticalExercise,
  "7": api.recordSelfExercise,
  "7wrong": api.recordSelfExercise,
  element_exercise: api.recordSelfExercise,
  collection_exercise: api.saveDiaryWrong,
  sync_study: api.savenonPracticalExercise,
  cal: api.savenonPracticalExercise,
  app: api.savenonPracticalExercise,
  appExp: api.savenonPracticalExercise,
  "3": api.saveExpandCal,
};

class DoExercise extends PureComponent {
  constructor(props) {
    super(props);
    this.errorInfo = "抱歉，你答错了。";
    this.successInfo = "作答正确！";
    this.KeyboardAndAnswer = null;
    this.start_time = new Date().getTime();
    this.yesNum = 0;
    this.wrongNum = 0;
    this.nextTopaicThrottle = _.debounce(this.nextTopaic, debounceTime);
    this.wrongToNextTopaicThrottle = _.debounce(
      this.wrongToNextTopaic,
      debounceTime
    );
    this.continueWriteThrottle = _.debounce(this.continueWrite, debounceTime);
    this.imgUrl = url.baseURL;
    this.head_text = this.props.navigation.state.params.data.pageType.name;
    this.answer_origin = this.props.navigation.state.params.data.pageType.answer_origin;
    if (
      this.answer_origin === "6" ||
      this.answer_origin === "4" ||
      this.answer_origin === "2"
    ) {
      let name = this.props.navigation.state.params.data.pageType.name;
      let name_child = this.props.navigation.state.params.data.lesson_name;
      if (this.answer_origin === "4" || this.answer_origin === "2") {
        let name = this.props.navigation.state.params.data.unit_name;
        name_child = name.substring(name.indexOf("元") + 1).trim();
      }

      this.head_have_lessonName = name + " " + name_child;
    }
    this.isExpandStudy = this.props.navigation.state.params.data.pageType.isExpandStudy;
    this.practical_category = this.props.navigation.state.params.data.practical_category;
    this.api = apiMap[this.answer_origin];
    this.isSendStudentElementExercise = false;
    this.correct = "1"; //默认为1，只要答错一题就为0，在一套题答完之后上传
    this.source = _axios.CancelToken.source(); //生成取消令牌用于组件卸载阻止axios请求
    this.cancelToken = this.source.token;
    this.state = {
      answerStatisticsModalVisible: false,
      helpStatus: false,
      isLookHelp: false,
      // //引导
      status: 0, //0：成功，1：列式错误 2：计算错误
      currentAnswerNum: 0,
      isYinDao: false, //是否是引导题目
      yinDaoNum: -1,
      diagnosisByFrontVal: "",
      yindaoViewHeight: 0,
      processType: "",
      yinDaoAnswerArr: [],
      isHidden: false, //同步计算题需要隐藏头部帮助按钮
      animating: true,
      isOpen: false,
    };
  }
  componentDidMount() {
    let data = this.getListData(this.answer_origin);
    this.props.initRedux();
    this.props.getTopaciData(
      data,
      this.answer_origin,
      this.head_text,
      this.isExpandStudy,
      this.cancelToken
    );
  }
  componentDidUpdate() {
    const { topaicDataList } = this.props;
    if (topaicDataList.toJS().length > 0) {
      this.setState({
        animating: false,
      });
    }
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit("refreshPage", this.answer_origin); //返回页面刷新
    this.props.initRedux();
    this.source.cancel("组件卸载,取消请求");
    this.setState = (state, callback) => {
      return;
    };
  }
  getListData = (answer_origin) => {
    const { userInfo, textCode } = this.props;
    const userInfoJs = userInfo.toJS();
    let data = this.props.navigation.state.params.data;
    switch (answer_origin) {
      // 同步学习
      case "6":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 1,
        });
        return data;
      //同步应用题
      case "4":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 2,
        });
        return data;
      //同步计算题
      case "2":
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 3,
          isHidden: true,
        });
        return data;
      //拓展应用题
      case "5":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 2,
        });
        return data;
      //基础学习题
      case "7":
        this.setState({
          processType: 1,
        });
        return data;
      //同步学习错题集的基础学习
      case "7wrong":
        const obj = {};
        obj.grade_code = userInfoJs.checkGrade;
        obj.term_code = userInfoJs.checkTeam;
        obj.unit_code = data.unit_code;
        obj.textbook = textCode;
        obj.m_e_s_id = data.m_e_s_id;
        this.setState({
          processType: 1,
        });
        return obj;
      // A计划B计划（混合基础学习，同步学习，错题的课时练习）
      case "paiAB": 
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType:this.head_text === "派学日记"?2: 1,
        });
        return data;
      // B计划计算方向
      case "cal":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 3,
          isHidden: true,
        });
        return data;
      // B计划应用方向
      case "app":
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 2,
        });
        return data;
      // B计划拓展应用方向
      case "appExp":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 2,
        });
        return data;
      case "improve7":
        // π计划基础学习
        this.setState({
          processType: 1,
        });
        return data;
      // π计划同步学习
      case "improve6":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 1,
        });
        return data;
      // π计划同步计算
      case "improve2":
        data.grade_code = userInfoJs.checkGrade;
        data.class_info = userInfoJs.class_code;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 3,
          isHidden: true,
        });
        return data;
      // π计划同步应用
      case "improve4":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 2,
        });
        return data;
      // π计划拓展应用
      case "improve5":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;

        this.setState({
          processType: 2,
        });
        return data;
      // 拓展计算题
      case "3":
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.textbook = textCode;
        data.student_code = userInfoJs.id;
        this.setState({
          processType: 3,
          isHidden: true,
        });
        return data;
      default:
        return {};
    }
  };

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
  //下一题
  nextTopaic = () => {
    //console.log(JSON.stringify(this.usbUtil.toServeXY),'next Topaic')
    this.getDataFromCanvas();
  };

  //进行诊断
  getDataFromCanvas = async () => {
    //console.log('getDataFromCanvas',canvasData)
    const {
      diagnosisByFrontVal,
      isYinDao,
      yinDaoNum,
      isLookHelp,
      currentAnswerNum,
    } = this.state;
    const { currentTopaicData, userInfo, textCode } = this.props;
    const currentTopaicDataJs = currentTopaicData.toJS();
    let unit_code = this.props.navigation.state.params.data.unit_code;
    let lesson_code = this.props.navigation.state.params.data.lesson_code;
    let knowledge_code = this.props.navigation.state.params.data.knowledge_code;
    let data = actionCreators.getBasicRecordData(
      this.answer_origin,
      currentTopaicDataJs,
      userInfo.toJS(),
      isLookHelp,
      diagnosisByFrontVal,
      currentAnswerNum,
      textCode,
      unit_code,
      lesson_code,
      knowledge_code,
      this.isExpandStudy,
      this.practical_category
    );
    try {
      let result = [false, false];
      let finalresult = false;
      if (
        !diagnosisByFrontVal ||
        !diagnosisByFrontVal[0] ||
        !diagnosisByFrontVal[0][0]
      ) {
        console.log("没填答案算错");
        this.correct = "0";
        if (!isYinDao) {
          data.correction = "1";
          if (
            this.answer_origin === "7" ||
            this.answer_origin === "7wrong" ||
            this.answer_origin === "improve7"
          )
            data.correction = "0"; //基础学习0是错
          this.onFail(data, "没有填写答案");
        } else {
          this.onYindaoFail(data, "没有填写答案");
        }
        return;
      }
      switch (currentTopaicDataJs.name) {
        case topaicTypes.Equation_Calculation:
          if (currentTopaicDataJs.alphabet_value) {
            // 活题诊断
            result = await mathdiagnosis.AICalculateDiagnose(
              currentTopaicDataJs.equation_detail,
              currentTopaicDataJs.alphabet_value,
              currentTopaicDataJs.answer_content,
              diagnosisByFrontVal
            );
            finalresult = result[0];
          } else {
            // 死题诊断
            result = await mathdiagnosis.NonAICalculateDiagnose(
              currentTopaicDataJs._stem,
              currentTopaicDataJs.answer_content,
              diagnosisByFrontVal
            );
            finalresult = result[0];
          }
          break;
        case topaicTypes.Application_Questions:
          if (currentTopaicDataJs.alphabet_value) {
            // 表示是活题
            if (isYinDao) {
              let equation =
                currentTopaicDataJs.equation_distribution[yinDaoNum];
              result = await mathdiagnosis.SingleAIAplDiagnose(
                currentTopaicDataJs.alphabet_value,
                currentTopaicDataJs.variable_value,
                equation,
                JSON.parse(JSON.stringify(diagnosisByFrontVal))
              );
              finalresult = result[0];
            } else {
              result = await mathdiagnosis.MultiAIAplDiagnose(
                currentTopaicDataJs.alphabet_value,
                currentTopaicDataJs.variable_value,
                currentTopaicDataJs.equation_exercise,
                currentTopaicDataJs.answer_content_beforeChange,
                JSON.parse(JSON.stringify(diagnosisByFrontVal))
              );
              finalresult = result[0];
            }
          } else {
            // 死题诊断
            result = await mathdiagnosis.NonAIAplDiagnose(
              currentTopaicDataJs.equation_exercise,
              currentTopaicDataJs.choice_txt,
              diagnosisByFrontVal,
              currentTopaicDataJs.answer_content
            );
            finalresult = result[0];
          }
          break;
        default:
          let judgeByFrontResult = judgeByFront(currentTopaicDataJs, diagnosisByFrontVal,data)
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
        data.correction = "0"
        if (
          this.answer_origin === "7" ||
          this.answer_origin === "7wrong" ||
          this.answer_origin === "improve7"
        )
          data.correction = "1"; //基础学习1是对
        if (!isYinDao) {
          this.onSuccess(data);
        } else {
          this.onYindaoSuccess(data);
        }
      } else {
        data.correction = "1";
        this.correct = "0";
        if (
          this.answer_origin === "7" ||
          this.answer_origin === "7wrong" ||
          this.answer_origin === "improve7"
        )
          data.correction = "0"; //基础学习0是错
        if (!isYinDao) {
          this.onFail(data, result[1]);
        } else {
          this.onYindaoFail(data, result[1]);
        }
      }
    } catch (e) {
      console.log("——————————————————————————catch答错");
      data.correction = "1";
      if (
        this.answer_origin === "7" ||
        this.answer_origin === "7wrong" ||
        this.answer_origin === "improve7"
      )
        data.correction = "0"; //基础学习0是错
      if (!isYinDao) {
        this.onFail(data, "抱歉，你答错了哦");
      } else {
        this.onYindaoFail(data, "抱歉，你答错了哦");
      }
    }
  };

  toNext = (data, isSuccess) => {
    const {
      topaicDataList,
      topaicIndex,
      changeCurrentTopaic,
      changeTopaiclistColorFlag,
      currentTopaicData,
      yinDaoArr,
    } = this.props;
    const { processType, currentAnswerNum } = this.state;
    if (
      (this.answer_origin === "7" || this.answer_origin === "7wrong") &&
      topaicIndex + 1 == topaicDataList.toJS().length
    )
      this.studentElementExercise(data, isSuccess); // 基础学习题需要保存套题
    if (
      (this.answer_origin === "improve7" || this.answer_origin === "paiAB") &&
      currentTopaicData.isSaveExercise
    )
      this.studentElementExerciseImprove(data, isSuccess); //这是π计划的基础学习保存套题的流程（有可能有几套题） AB计划中的基础题
    if (isSuccess) {
      if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(topaicDataList.toJS()[topaicIndex+1]); //调用键盘清除方法
      if (currentAnswerNum + 1 === 1) this.yesNum++;
      this.start_time = new Date().getTime();
      if (topaicIndex + 1 == topaicDataList.toJS().length) {
        if (
          this.answer_origin !== "7" ||
          this.answer_origin !== "7wrong" ||
          this.answer_origin !== "improve7"
        )
          this.getAnswerResult();
      }
      this.setState(() => ({
        status: 0,
        currentAnswerNum: 0,
        diagnosisByFrontVal: "",
        isYinDao: false,
        yinDaoNum: processType === 1 || processType === 3 ? 0 : -1,
      }));
      this.isSendStudentElementExercise = false;
      changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
      changeCurrentTopaic(
        topaicDataList.toJS()[topaicIndex + 1],
        topaicIndex,
        topaicDataList.toJS()
      );
    } else {
      //当前题目已经完成分布引导过程还是做错
      if (currentAnswerNum + 1 === 1) this.wrongNum++;
      if (
        this.state.currentAnswerNum == 0 &&
        currentTopaicData.toJS().scene_code != "" &&
        yinDaoArr.toJS().length > 0 &&
        (processType === 1 || processType === 3)
      ) {
        // 同步学习，同步计算不确定有没有这一步
        this.setState((preState) => ({
          currentAnswerNum: 1,
          isYinDao: true,
          status: 1,
        }));
        return;
      }
      if (
        this.state.currentAnswerNum == 0 &&
        yinDaoArr.toJS().length > 0 &&
        actionCreators.getIsYindao(currentTopaicData.toJS()) &&
        processType === 2
      ) {
        this.setState((preState) => ({
          currentAnswerNum: 1,
          isYinDao: true,
          status: 1,
        }));
        changeTopaiclistColorFlag(2, topaicDataList.toJS(), topaicIndex);
        return;
      }
      this.setRsultFailCommon();
    }
  };

  //答题成功通用处理部分
  onSuccess = (answerData) => {
    Toast.info('恭喜你答对了！', 1, () => {
      this.onSendResult(answerData, true);
    });
  };

  //答题失败通用处理部分
  onFail = (data, errorInfo) => {
    const { currentTopaicData, yinDaoArr } = this.props;
    this.errorInfo = errorInfo;
    if (
      this.state.currentAnswerNum == 0 &&
      currentTopaicData.toJS().scene_code != "" &&
      yinDaoArr.toJS().length > 0
    ) {
      // this.errorInfo = errorInfo
    }
    Toast.info(this.errorInfo, 2, () => {
      this.onSendResult(data, false, errorInfo);
    });
  };

  getTrueOrFalse = (value) => {
    const { currentTopaicData } = this.props;
    let currentTopaicDataJs = currentTopaicData.toJS();
    if (currentTopaicDataJs.unitArr && currentTopaicDataJs.unitArr.length > 0) {
      for (let i = 0; i < currentTopaicDataJs.unitArr.length; i++) {
        if (currentTopaicDataJs.unitArr[i].value === value) {
          return true;
        }
      }
    }
    return false;
  };

  //引导题目答题成功
  onYindaoSuccess = (data) => {
    //console.log('onYindaoSuccess res')
    const { processType, diagnosisByFrontVal, yinDaoNum } = this.state;
    const {
      currentTopaicData,
      yinDaoArr,
      changeCurrentTopaic,
      topaicIndex,
      topaicDataList,
      changeTopaiclistColorFlag,
      changeYindaoCurrentTopaic,
    } = this.props;
    if (processType === 1) {
      if (this.state.yinDaoNum + 1 <= yinDaoArr.toJS().length) {
        axios
          .get(
            api.stepExercise +
              currentTopaicData.toJS().scene_code +
              "/" +
              yinDaoArr.toJS()[this.state.yinDaoNum] +
              "/" +
              currentTopaicData.toJS().exercise_category
          )
          .then((res) => {
            //console.log('onYindaoSuccess res',res)
            this.setState((preState) => ({
              isYinDao: true,
              status: 0,
              yinDaoNum: preState.yinDaoNum + 1,
            }));
            changeCurrentTopaic(
              res.data.data,
              topaicIndex - 1,
              topaicDataList.toJS()
            );
          });
      } else {
        changeCurrentTopaic(
          topaicDataList.toJS()[topaicIndex],
          topaicIndex - 1,
          topaicDataList.toJS()
        );
        this.start_time = new Date().getTime();
        this.setState(() => ({
          isYinDao: false,
          status: 0,
          yindaoViewHeight: 0,
        }));
      }
    }
    if (processType === 2) {
      let yinDaoAnswer = [];
      if (diagnosisByFrontVal) {
        if (
          currentTopaicData.toJS().exercise_data_type === "FS" ||
          currentTopaicData.toJS().data_type === "FS"
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
        } else {
          diagnosisByFrontVal.forEach((i, index) => {
            yinDaoAnswer = yinDaoAnswer.concat(i);
          });
          yinDaoAnswer = yinDaoAnswer.join("");
        }
      }
      // console.log('yinDaoAnsweryinDaoAnsweryinDaoAnsweryinDaoAnsweryinDaoAnswer',yinDaoAnswer,yinDaoNum,yinDaoArr.toJS())
      Toast.info(this.successInfo, 1, () => {
        if (yinDaoNum + 1 < yinDaoArr.toJS().length) {
          this.setState(
            (preState) => ({
              isYinDao: true,
              status: 0,
              yinDaoNum: preState.yinDaoNum + 1,
              yinDaoAnswerArr: [...preState.yinDaoAnswerArr, yinDaoAnswer],
            }),
            () => {
              changeYindaoCurrentTopaic(
                currentTopaicData.toJS(),
                yinDaoNum,
                true
              );
            }
          );
        } else {
          if (topaicIndex + 1 == topaicDataList.toJS().length) {
            changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
            this.getAnswerResult();
            return;
          }
          this.setState(
            (preState) => ({
              isYinDao: false,
              status: 0,
              currentAnswerNum: 0,
              yinDaoNum: -1,
              diagnosisByFrontVal: "",
              yinDaoAnswerArr: [],
              yindaoViewHeight: 0,
            }),
            () => {
              changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
              changeCurrentTopaic(
                topaicDataList.toJS()[topaicIndex + 1],
                topaicIndex,
                topaicDataList.toJS()
              );
            }
          );
          this.start_time = new Date().getTime();
        }
        if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(); //调用键盘清除方法
      });
    }
  };

  //引导题目答题错误
  onYindaoFail = (data, errorInfo) => {
    const { processType } = this.state;
    if (processType === 1) {
      this.errorInfo = errorInfo;
      //console.log('onYindaoFail')
      this.setState(() => ({
        status: 1,
        diagnosisByFrontVal: "",
      }));
    }
    if (processType === 2 || processType === 3) {
      this.errorInfo = errorInfo;
      //console.log('onYindaoFail')
      Toast.fail(this.errorInfo, 2, () => {
        this.setState(() => ({
          status: 2,
          diagnosisByFrontVal: "",
        }));
      });
    }
    if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(); //调用键盘清除方法
  };

  //发送答题记录给后台
  onSendResult = (data, isSuccess) => {
    //console.log('onSendResult',data)
    const {
      topaicDataList,
      topaicIndex,
      currentTopaicData,
    } = this.props;
    if (!data) return;
    let currentTopaicDataJs = currentTopaicData.toJS();
    if (
      currentTopaicDataJs.type_key === "sync_study" &&
      currentTopaicDataJs.addIsfinish
    ) {
      // ab计划的同步学习题最后一题保存的时候加is_finish
      data.is_finish = "0";
    }
    if (topaicIndex + 1 == topaicDataList.toJS().length) {
      data.is_finish = "0";
    }
    let endTime = new Date().getTime();
    let spend_time = parseInt((endTime - this.start_time) / 1000);
    data.spend_time = spend_time;
    if (!currentTopaicDataJs.alphabet_value && this.answer_origin !== "3") {
      // 代表是死题
      data.exercise_pattern = currentTopaicDataJs.exercise_pattern;
      if (this.answer_origin !== "5")
        data.exercise_phase = currentTopaicDataJs.exercise_phase;
    }
    console.log("recordSelfExercise", data);
    if (this.answer_origin === "paiAB") {
      if (currentTopaicDataJs.type_key === "element_exercise") {
        // 基础是1是对，0是错，这里要重新给值
        if (data.correction === "1") {
          data.correction = "0";
        } else {
          data.correction = "1";
        }
      }
      this.api = apiMap[currentTopaicDataJs.type_key];
    }
    if (this.answer_origin.substring(0, 7) === "improve") {
      let type = this.answer_origin.substring(7);
      if (type === "7") this.api = api.recordSelfExercise;
      if (type === "6" || type === "2" || type === "4" || type === "5")
        this.api = api.savenonPracticalExercise;
      if (currentTopaicDataJs.category && type !== "7")
        this.api = api.saveDiaryWrong;
    }
    if (data.record_times === "1") {
      // 只第一次保存
      axios.post(this.api, data).then((res) => {
        this.toNext(data, isSuccess);
      });
    } else {
      this.toNext(data, isSuccess);
    }
  };

  //失败统一处理
  setRsultFailCommon = () => {
    const {
      topaicDataList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    const { processType } = this.state;
    this.setState(
      (pre) => ({
        status: 1,
        diagnosisByFrontVal: "",
        isYinDao: false,
        yinDaoNum: processType === 1 || processType === 3 ? 0 : -1,
        yindaoViewHeight: 0,
      }),
      () => {
        changeTopaiclistColorFlag(2, topaicDataList.toJS(), topaicIndex);
      }
    );
  };

  //继续作答
  continueWrite = () => {
    const { isYinDao, currentAnswerNum, processType } = this.state;
    const {
      currentTopaicData,
      yinDaoArr,
      changeCurrentTopaic,
      topaicIndex,
      topaicDataList,
      changeYindaoCurrentTopaic,
    } = this.props;
    if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(); //调用键盘清除方法
    if (isYinDao && currentAnswerNum == 1) {
      if (processType === 1 || processType === 3) {
        //第一次原题答错进入引导时
        axios
          .get(
            api.stepExercise +
              currentTopaicData.toJS().scene_code +
              "/" +
              yinDaoArr.toJS()[this.state.yinDaoNum] +
              "/" +
              currentTopaicData.toJS().exercise_category
          )
          .then((res) => {
            changeCurrentTopaic(
              res.data.data,
              topaicIndex - 1,
              topaicDataList.toJS()
            );
            this.setState((preState) => ({
              yinDaoNum: preState.yinDaoNum + 1,
              status: 0,
            }));
          });
      }
      if (processType === 2) {
        this.setState(
          (preState) => ({
            yinDaoNum: preState.yinDaoNum + 1,
            status: 0,
          }),
          () => {
            changeYindaoCurrentTopaic(
              currentTopaicData.toJS(),
              this.state.yinDaoNum,
              false
            );
          }
        );
      }
    } else {
      this.start_time = new Date().getTime();
      this.setState((preState) => ({
        status: 0,
        currentAnswerNum: preState.currentAnswerNum + 1,
      }));
    }
  };

  //讲解跳至下一题
  wrongToNextTopaic = () => {
    const {
      topaicDataList,
      topaicIndex,
      changeCurrentTopaic,
      changeTopaiclistColorFlag,
      changeTopaicIndex,
    } = this.props;
    const { processType } = this.state;
    if (topaicIndex + 1 == topaicDataList.toJS().length) {
      this.getAnswerResult();
      return;
    }
    if (this.KeyboardAndAnswer) this.KeyboardAndAnswer.clearData(topaicDataList.toJS()[topaicIndex+1]); //调用键盘清除方法
    this.isSendStudentElementExercise = false;
    this.start_time = new Date().getTime();
    this.setState(() => ({
      status: 0,
      currentAnswerNum: 0,
      diagnosisByFrontVal: "",
      isYinDao: false,
      yinDaoNum: processType === 1 || processType === 3 ? 0 : -1,
      yinDaoAnswerArr: [],
    }));
    changeTopaiclistColorFlag(2, topaicDataList.toJS(), topaicIndex);
    changeCurrentTopaic(
      topaicDataList.toJS()[topaicIndex + 1],
      topaicIndex,
      topaicDataList.toJS()
    );
  };

  renderTopaicOrKnowldge = () => {
    const { status } = this.state;
    if (status === 1) {
      //显示作业答题错误之后
      return this.renderKnowldge();
    } else {
      // 显示题
      return this.renderTopic();
    }
  };

  studentElementExercise = (data, isSuccess) => {
    const {
      topaicDataList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    data.correct = this.correct;
    // console.log('22222222222222222222222222222',data)
    if (isSuccess && !this.isSendStudentElementExercise) {
      //最后一题作答成功，并且未提交过整套题答题记录
      changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
      axios.put(api.studentElementExercise, data).then((res) => {
        // console.log("整套题作答完毕", res);
        this.isSendStudentElementExercise = true;
        this.getAnswerResult();
      });
      return;
    }
    if (this.isSendStudentElementExercise) {
      if (isSuccess) {
        changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
        this.getAnswerResult();
      } else {
        this.setRsultFailCommon();
      }
      return;
    }
    if (!isSuccess && !this.isSendStudentElementExercise) {
      //最后一题作答失败，并且未提交过整套题答题记录
      axios.put(api.studentElementExercise, data).then((res) => {
        //console.log('整套题作答完毕',res)
        this.isSendStudentElementExercise = true;
        this.setRsultFailCommon();
      });
      return;
    }
  };

  studentElementExerciseImprove = (data, isSuccess) => {
    const {
      topaicDataList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    data.correct = this.correct;
    if (isSuccess && !this.isSendStudentElementExercise) {
      //最后一题作答成功，并且未提交过整套题答题记录
      // console.log('最后一题作答成功，并且未提交过整套题答题记录',data)
      changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
      if (topaicIndex + 1 == topaicDataList.toJS().length)
        this.getAnswerResult();
      if (data.is_type !== null) {
        // 如果is_type为null不需要走这个保存
        axios.put(api.studentElementExercise, data).then((res) => {
          // console.log('整套题作答完毕',res)
          this.isSendStudentElementExercise = true;
        });
      }
      return;
    }
    if (!isSuccess && !this.isSendStudentElementExercise) {
      //最后一题作答失败，并且未提交过整套题答题记录
      // console.log('最后一题作答失败，并且未提交过整套题答题记录',data)
      this.setRsultFailCommon();
      if (data.is_type !== null) {
        axios.put(api.studentElementExercise, data).then((res) => {
          // console.log('整套题作答完毕',res)
          this.isSendStudentElementExercise = true;
        });
      }
      return;
    }

    if (this.isSendStudentElementExercise) {
      if (isSuccess) {
        // console.log('最后一题继续作答成功',data)
        changeTopaiclistColorFlag(1, topaicDataList.toJS(), topaicIndex);
        if (topaicIndex + 1 == topaicDataList.toJS().length)
          this.getAnswerResult();
      } else {
        // console.log('最后一题继续作答失败',data)
        this.setRsultFailCommon();
      }
      return;
    }
  };
  clickOpen = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen,
    });
  };

  //显示作答题目
  renderTopic = () => {
    const { currentTopaicData, topaicIndex } = this.props;
    const {  isOpen } = this.state;
    const { yinDaoNum, isYinDao } = this.state;
    const { processType } = this.state;
    console.log("renderWriteTopaic data", currentTopaicData.toJS());
    if (
      !currentTopaicData ||
      JSON.stringify(currentTopaicData.toJS()) === "{}"
    ) {
      return (
        <Text style={{ marginLeft: pxToDp(24), fontSize: pxToDp(48) }}>
          数据加载中...
        </Text>
      );
    }
    const data = currentTopaicData.toJS();
    return (
      <>
        <Text style={[styles.num]}>第{topaicIndex + 1}题</Text>
        <ScrollView>
          <View style={[appStyle.flexLine]}>
            <Text style={[styles.displayedTypeText]}>
              {data.displayed_type}
            </Text>
            {data.displayed_type === "选择题" ? (
              <Text style={[styles.displayedTypeTextChioce]}>
                {"（选项显示不全请上下滑动）"}
              </Text>
            ) : null}
          </View>
          <TopicSteam
            data={data}
            width={isOpen ? styles.applicaBywrongRichStemWidth.width: null}
          ></TopicSteam>
          {data.choice_content ? this.showChoice(data) : null}
          {isYinDao && processType === 2
            ? this.renderMathFrameView(data)
            : null}
        </ScrollView>
        {isYinDao?<StretchBtn clickOpen={this.clickOpen}></StretchBtn>:null}
          
      </>
    );
  };
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

  //显示选择题题干
  showChoice = (currentTopaicData) => {
    return <ChioceNormal currentTopaicData={currentTopaicData}></ChioceNormal>;
  };

  renderKnowldge = () => {
    const {
      processType,
      yinDaoNum,
    } = this.state;
    const { currentTopaicData, yinDaoArr } = this.props;
    const currentTopaicDataJs = currentTopaicData.toJS();
    let htm = "";
    if (processType === 1) {
      // 死题解析
      htm = (
        <Explanation1 currentTopaicData={currentTopaicDataJs}></Explanation1>
      );
    }
    if (processType === 2) {
      // 同步应用题解析
      htm = (
        <Explanation2
          currentTopaicData={currentTopaicDataJs}
          yinDaoNum={yinDaoNum}
        ></Explanation2>
      );
      // 派学日记（原B计划，死题和活题会混合），所以加下面的判断
      if(currentTopaicDataJs.displayed_type === '等式计算题' && currentTopaicDataJs.alphabet_value){
          htm = (
            <Explanation3 currentTopaicData={currentTopaicDataJs}></Explanation3>
          );
      }
    }
    if (processType === 3) {
      // 同步计算解析
      htm = (
        <Explanation3 currentTopaicData={currentTopaicDataJs}></Explanation3>
      );
    }
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

  //分步引导答题框渲染
  renderYindaoAnswerView = () => {
    const { currentTopaicData } = this.props;
    const { yinDaoNum, yinDaoAnswerArr } = this.state;
    let currentTopaicDataJs = currentTopaicData.toJS();
    return (
      <YindaoAnswerView
        currentTopaicData={currentTopaicDataJs}
        yinDaoNum={yinDaoNum}
        yinDaoAnswerArr={yinDaoAnswerArr}
      ></YindaoAnswerView>
    );
  };

  //获取整套题作答结果
  getAnswerResult = () => {
    this.setState({
      answerStatisticsModalVisible: true,
    });
  };

  _onLayout = (event) => {
    const { isYinDao } = this.state;
    let { x, y, width, height } = event.nativeEvent.layout;
    // console.log("通过onLayout得到的高度：" + height);
    this.setState({
      yindaoViewHeight: height > pxToDp(300) ? pxToDp(300) : height,
    });
  };

  renderLeft = () => {
    const { processType, status, yinDaoNum, isYinDao, isOpen } = this.state;
    const { topaicDataList, yinDaoArr } = this.props;
    let topaicDataListJs = [...topaicDataList.toJS()];
    if (processType === 1 || processType === 3) {
      return (
        <View style={[styles.left]}>
          <View style={[styles.leftOne]}>
            <TopicCard list={topaicDataListJs}></TopicCard>
          </View>
          <View style={[styles.leftTwo]}>
            {this.renderTopaicOrKnowldge()}
            {status === 0 || status === 2 ? (
              <View style={{ flexDirection: "row-reverse" }}>
                <BaseButton
                  style={styles.commonBtn}
                  onPress={this.nextTopaicThrottle}
                  text={"提交"}
                ></BaseButton>
              </View>
            ) : null}
          </View>
        </View>
      );
    }
    if (processType === 2) {
      let txt = "提交";
      if (isYinDao) txt = "下一步";
      if (isYinDao && yinDaoNum + 1 === yinDaoArr.toJS().length) txt = "提交";
      return (
        <View style={[styles.left]}>
          {isOpen ? null : status === 0 || yinDaoNum !== -1 ? (
            <View style={[styles.leftOne]}>
              <TopicCard list={topaicDataListJs}></TopicCard>
            </View>
          ) : null}
          <View
            style={[
              styles.leftTwo,
              status === 0 || yinDaoNum !== -1 
                ? null
                : styles.applicaBywrongleftTwo,
              isOpen
                ? styles.applicaBywrongleftTwo: null,
            ]}
          >
            {this.renderTopaicOrKnowldge()}
            {isOpen ? null : status === 0 || status === 2 ? (
              <View style={{ flexDirection: "row-reverse" }}>
                <BaseButton
                  style={styles.commonBtn}
                  onPress={this.nextTopaicThrottle}
                  text={txt}
                ></BaseButton>
              </View>
            ) : null}
          </View>
        </View>
      );
    }
  };

  renderRight = () => {
    const {
      processType,
      status,
      yinDaoNum,
      isYinDao,
      yindaoViewHeight,
      isOpen,
    } = this.state;
    const { currentTopaicData } = this.props;
    let currentTopaicDataJs = currentTopaicData.toJS();
    let display_none = {display:'none'}
    if(!isOpen) display_none = ''
    if (processType === 1 || processType === 3) {
      return (
        <View style={[styles.right,display_none]}>
          <KeyboardAndAnswer
            onRef={(ref) => {
              this.KeyboardAndAnswer = ref;
            }}
            getAnswer={this.getAnswer}
            checkBtnArr={currentTopaicDataJs.btnArr}
            tip={currentTopaicDataJs.tip}
            unitBtnArr={currentTopaicDataJs.unitArr}
            topicType={currentTopaicDataJs.displayed_type}
          ></KeyboardAndAnswer>
        </View>
      );
    }
    if (processType === 2) {
      if (status === 0 || yinDaoNum !== -1) {
        return (
          <View style={[styles.right,display_none]}>
            {isYinDao ? (
              <ScrollView style={{ maxHeight: pxToDp(300)}}>
                <View onLayout={this._onLayout}>
                  {this.renderYindaoAnswerView()}
                </View>
              </ScrollView>
            ) : null}
            <KeyboardAndAnswer
              onRef={(ref) => {
                this.KeyboardAndAnswer = ref;
              }}
              getAnswer={this.getAnswer}
              yindaoViewHeight={yindaoViewHeight}
              unitBtnArr={currentTopaicDataJs.unitArr}
              topicType={currentTopaicDataJs.displayed_type}
              tip={currentTopaicDataJs.tip}
              checkBtnArr={currentTopaicDataJs.btnArr}
            ></KeyboardAndAnswer>
          </View>
        );
      }
      return null;
    }
  };

  renderHelpModal = () => {
    const { processType, helpStatus } = this.state;
    const { currentTopaicData } = this.props;
    let currentTopaicDataJs = currentTopaicData.toJS();
    if (processType === 1) {
      return (
        <HelpModal
          visible={helpStatus}
          currentTopaicData={currentTopaicDataJs}
          onCloseHelp={this.onCloseHelp}
        ></HelpModal>
      );
    }
    if (processType === 2) {
      if (!currentTopaicData.alphabet_value) {
        return (
          <HelpModal
            visible={helpStatus}
            currentTopaicData={currentTopaicDataJs}
            onCloseHelp={this.onCloseHelp}
          ></HelpModal>
        );
      }
      return (
        <HelpMadalApplication
          visible={helpStatus}
          currentTopaicDataJs={currentTopaicDataJs}
          onCloseHelp={this.onCloseHelp}
        ></HelpMadalApplication>
      );
    }
  };

  render() {
    const { currentTopaicData } = this.props;
    const { answerStatisticsModalVisible, isHidden, animating } = this.state;
    if (!currentTopaicData)
      return (
        <View style={[styles.container]}>
          <Header
            text={this.head_text}
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
      <ImageBackground source={require('../../../images/thinkingTraining/do_exercise_bg.png')} style={[styles.container]}>
        <Header
          text={
            this.head_have_lessonName
              ? this.head_have_lessonName
              : this.head_text
          }
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
        ></AnswerStatisticsModal>
      </ImageBackground>
    );
  }
}

const stylesSelf = StyleSheet.create({});
const mapStateToProps = (state) => {
  return {
    topaicDataList: state.getIn(["bagMath", "topaicDataList"]),
    currentTopaicData: state.getIn(["bagMath", "currentTopaicData"]),
    topaicIndex: state.getIn(["bagMath", "topaicNum"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    yinDaoArr: state.getIn(["bagMath", "yinDaoArr"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTopaciData(
      params,
      answer_origin,
      head_text,
      isExpandStudy,
      cancelToken
    ) {
      switch (answer_origin) {
        // 同步学习(同步诊断)
        case "6":
          dispatch(
            actionCreators.getTopaic(
              api.getSyncStudyExercise,
              params,
              cancelToken
            )
          );
          break;
        //同步应用
        case "4":
          dispatch(
            actionCreators.getTopaicMathAuto(
              api.getTongbuAolicationTopaicList,
              params,
              false,
              cancelToken
            )
          );
          break;
        //同步计算
        case "2":
          dispatch(
            actionCreators.getAutoCalTopaic(
              api.queryBagWorkListSyncAutoCalExercise,
              params,
              cancelToken
            )
          );
          break;
        // 拓展应用题
        case "5":
          dispatch(
            actionCreators.getTopaicMathAuto(
              api.getExpandPracticalExercise2,
              params,
              false,
              cancelToken
            )
          );
          break;
        // 基础学习题
        case "7":
          dispatch(
            actionCreators.getTopaic(
              api.queryBagWorkListNumExercise,
              params,
              cancelToken
            )
          );
          break;
        // 同步学习题错题集的基础学习题
        case "7wrong":
          dispatch(
            actionCreators.getTopaic(
              api.getElementexercise,
              params,
              cancelToken
            )
          );
          break;
        // 同步学习题错题集的基础学习题
        case "paiAB":
          if (head_text === "A学习日记") {
            dispatch(
              actionCreators.getPaiTopic(
                api.getDiaryLessonExc,
                params,
                cancelToken
              )
            );
          }
          if (head_text === "派学日记") {
            dispatch(
              actionCreators.getPaiTopic(
                api.getDiaryLessonExcPlanB,
                params,
                cancelToken
              )
            );
          }
          break;
        //B计划计算方向
        case "cal":
          dispatch(
            actionCreators.getPaiCalTopaic(
              api.getDiaryCalExcPlanB,
              params,
              cancelToken
            )
          );
          break;
        //B计划应用方向
        case "app":
          dispatch(
            actionCreators.getTopaicMathAuto(
              api.getDiaryApplicaExcPlanB,
              params,
              true,
              cancelToken
            )
          );
          break;
        //B计划拓展应用方向
        case "appExp":
          dispatch(
            actionCreators.getTopaicMathAuto(
              api.getDiaryExpandApplicaExcPlanB,
              params,
              true,
              cancelToken
            )
          );
          break;
        // π计划基础学习
        case "improve7":
          dispatch(
            actionCreators.getSpecailImproveTopaicBase(
              api.getImproveexercise,
              params,
              cancelToken
            )
          );
          break;
        // π计划同步学习
        case "improve6":
          dispatch(
            actionCreators.getSpecailImproveTopaic(
              api.getImproveexercise,
              params,
              cancelToken
            )
          );
          break;
        // π计划同步计算
        case "improve2":
          dispatch(
            actionCreators.getSpecialImproveCalTopaic(
              api.getImproveexercise,
              params,
              cancelToken
            )
          );
          break;
        // π计划同步应用
        case "improve4":
          dispatch(
            actionCreators.getTopaicMathAuto(
              api.getImproveexercise,
              params,
              false,
              cancelToken
            )
          );
          break;
        // π计划拓展应用
        case "improve5":
          if (isExpandStudy) {
            //  π计划拓展应用中有未学习的
            dispatch(
              actionCreators.getTopaicMathAuto(
                api.getExpandPracticalExercise,
                params,
                false,
                cancelToken
              )
            );
          } else {
            dispatch(
              actionCreators.getTopaicMathAuto(
                api.getExpandPracticalExercise2,
                params,
                false,
                cancelToken
              )
            );
          }

          break;
        // 拓展计算题
        case "3":
          dispatch(
            actionCreators.getExpandCal(
              api.getSyncExpandExercise,
              params,
              3,
              cancelToken
            )
          );
          break;
      }
    },
    changeCurrentTopaic(currentTopaicData, topaicIndex, topaiclist) {
      if (!currentTopaicData || topaicIndex + 1 == topaiclist.length) {
        return;
      }
      let yinDaoArr = [];
      if (
        currentTopaicData.alphabet_value &&
        currentTopaicData.name !== topaicTypes.Equation_Calculation
      ) {
        if (
          topaiclist[topaicIndex + 1].equation_distribution &&
          topaiclist[topaicIndex + 1].equation_distribution.length > 0
        ) {
          yinDaoArr = [...topaiclist[topaicIndex + 1].equation_distribution];
        }
      }
      dispatch(
        actionCreators.changeCurrentTopaic(
          currentTopaicData,
          topaicIndex + 1,
          yinDaoArr
        )
      );
    },
    changeTopaiclistColorFlag(colorFlag, topaiclist, index) {
      if (!topaiclist || topaiclist.length === 0)
        throw new TypeError("题目列表为空");
      topaiclist[index].colorFlag = colorFlag;
      //console.log('changeTopaiclistColorFlag MathCanvas',topaiclist)
      dispatch(actionCreators.changeTopaiclistColorFlag(topaiclist));
    },
    changeTopaicIndex(topaicIndex, topaiclist) {
      if (topaicIndex + 1 == topaiclist.length) {
        return;
      }
      dispatch(actionCreators.changeTopaicIndex(topaicIndex + 1));
    },
    changeYindaoCurrentTopaic(currentTopaicData, yinDaoNum, isSuccess) {
      console.log("changeYindaoCurrentTopaic yinDaoNum", yinDaoNum);
      console.log("changeYindaoCurrentTopaic", currentTopaicData);
      dispatch(actionCreators.changeYindaoCurrentTopaic(currentTopaicData));
    },
    initRedux() {
      dispatch(actionCreators.initRedux());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(DoExercise);
