import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
} from "react-native";
import Canvas from "../../util/canvas/YuwenWebCanvas";
import CircleCard from "../../component/CircleCard";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import NavigationUtil from "../../navigator/NavigationUtil";
import { connect } from "react-redux";
import * as actionCreators from "../../action/yuwen/desk/index";
import * as diagnosisUtil from "../../util/MathmaticalJudgment";
import * as diagnosisChineseHWRUtil from "../../util/ChineseHWR";
import UsbDataUtil from "../../util/canvas/UsbDataUtil";
import CanvasDialog from "../../component/YuwenCanvasDialog";
import types from "../../res/data/YuwenTopaicType";
import AnswerStatisticsModal from "../../component/AnswerStatisticsModal";
import {
  yuwenCompleteByPad,
  parseYuwenOneConnectionAnswer,
  diagnosisOneGroupConnection,
  diagnosisYuwenLeftRightConnectAnswer,
} from "../../util/commonUtils";
import { Toast, Modal } from "antd-mobile-rn";
import ViewControl from "react-native-image-pan-zoom";
import {
  BasicProcessingFunc,
  MathProcessingFunc,
  MathBaseCaculateFunc,
  PadProcessingFunc,
} from "../../util/diagnosis/pyramidhwr";
import _ from "lodash";
import {
  margin_tool,
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../util/tools";
import { appStyle } from "../../theme";
import RichShowView from "../../component/chinese/RichShowView";
const zimu = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const num = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const chooseMap = new Map();
let url = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
let padDiagnosisUtil = new PadProcessingFunc();
let diagnosisUtilNew = new MathProcessingFunc();
class YuwenCanvas extends PureComponent {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.usbUtil = new UsbDataUtil();
    // this.closeAnswerStatisticsModalTimer = ''
    (this.isInExplain = false), //是否处于讲解阶段
      (this.handleCloseHlepDialogThrottled = _.throttle(
        this.onCloseHelp,
        10 * 1000
      ));
    this.state = {
      isDialogVisible: false,
      isDestoryDialog: false,
      answerStatisticsModalVisible: false,
      canvasWidth: 0,
      canvasHeight: 0,
      topaicNum: 0,
      status: false,
      indentifyContext: "",
      lookDetailNum: 0,
      answerNum: 0,
      useUsb: true,
      //题目统计结果
      blank: 0,
      correct: 0,
      wrong: 0,
      isLookHelp: false,
      lookhelp: false,
    };
    this.isElementTopaic = false;
    this.answerdata = {
      exercise_id: "", //题编号
      student_code: "", //学生编号
      exercise_point_loc: "", //题点位
      exercise_result: "", //做题结果
      exercise_set_id: "", //题套ID
      identification_results: "", //识别结果
      is_modification: "", //是否修改 1:否，0:是
      answer_start_time: "", //答题开始时间
      answer_end_time: "", //答题结束时间
      is_correction: "", //是否批改1:,否0:是
      correction_remarks: "", //批改备注信息
      correction: "2", //批改对错1:错,0:对，2不能批改
      record: "", //批改记录
      is_element_exercise: "1", //是否是做错后推送的要素题 0:是, 1:否
      subject: "01",
    };
  }

  static navigationOptions = {
    // title:'答题'
  };

  componentDidMount() {
    let exercise = this.props.navigation.state.params.exercise_origin;
    //console.log("exercise", exercise)
    const { userInfo } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {
      subject: "01",
      team: "00",
      // unit: '1',
      // student_code: '15',
      exercise_origin: exercise.exercise_origin,
      exercise_set_id: exercise.exercise_set_id,
      origin: exercise.origin,
      choose_exercise: exercise.choose_exercise,
    };

    data.grade_name = userInfoJs.grade_code;
    data.class_info = userInfoJs.class_code;
    data.team = userInfoJs.term_code;
    data.student_code = userInfoJs.id + "";
    this.props.getTopaciData(data);
    //原生发来蓝牙数据
    DeviceEventEmitter.addListener("usbData", this.eventHandler);
    this.showDialog();
  }

  componentDidUpdate() {
    const { answerNum, isDestoryDialog } = this.state;
    if (this.isInExplain) {
      //如果处于讲解阶段，则不显示手写dialog和获取手写数据
      return;
    }
    if (answerNum == 0 && !isDestoryDialog) {
      this.showDialog(true);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount this.closeAnswerStatisticsModalTimer',this.closeAnswerStatisticsModalTimer )
    this.props.initRedux();
    this.closeAnswerStatisticsModalTimer && clearTimeout(this.closeAnswerStatisticsModalTimer)
    DeviceEventEmitter.removeListener("usbData", this.eventHandler);
    this.closeDialog();
  }

  eventHandler = (message) => {
    const { isDialogVisible, useUsb } = this.state;
    if (this.isInExplain) {
      //如果处于讲解阶段，则不显示手写dialog和获取手写数据
      return;
    }
    if (!isDialogVisible) {
      this.showDialog();
      return;
    }
    if (!useUsb) {
      return;
    }
    this.usbUtil.initListXY(message);
    // if (!this.canvas.webview) return
    // this.canvas.sendUsbData(message.usbCanvasDataX, message.usbCanvasDataY, message.usbCanvasDataPressure);
  };

  onRef = (ref) => {
    this.canvas = ref;
  };

  showDialog = (isDidupdate = false) => {
    if (!this.props.currentTopaicData) return;
    //console.log('showDialog', this.props.currentTopaicData.toJS())
    if (yuwenCompleteByPad(this.props.currentTopaicData.toJS())) {
      this.setState({ isDialogVisible: true, useUsb: false });
    } else {
      if (isDidupdate) {
        this.setState({ useUsb: true });
      } else {
        this.setState({ isDialogVisible: true, useUsb: true });
      }
    }
  };
  closeDialog = () => {
    this.setState({ isDialogVisible: false });
  };

  closeAnswerStatisticsModal = () => {
    this.setState({ answerStatisticsModalVisible: false });
    console.log('closeAnswerStatisticsModal')
    this.closeAnswerStatisticsModalTimer =  setTimeout(() => {
      this.goBack();
    }, 0);
  };

  destoryDialog = () => {
    this.setState({ isDialogVisible: false, isDestoryDialog: true });
  };

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  clear = () => {
    if (!this.canvas || !this.canvas.clear) return;
    this.canvas.clear();
    this.usbUtil.clearListXY();
  };

  //答题成功通用处理部分
  onSuccess = () => {
    const {
      fromServeCharacterList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;

    //console.log('onSuccess', fromServeCharacterList)
    //console.log('onSuccess data', this.answerdata)
    const { answerNum } = this.state;
    if (answerNum > 0) {
      this.isElementTopaic = true;
    }
    if (this.answerdata.correction === "2") {
      //不能诊断的题 答题卡为橙色
      changeTopaiclistColorFlag(3, fromServeCharacterList.toJS(), topaicIndex);
    } else {
      changeTopaiclistColorFlag(1, fromServeCharacterList.toJS(), topaicIndex);
    }

    this.changeAnswerDataIsElment(this.answerdata);
    this.onSendResult(this.answerdata, true);
    this.setState(() => ({
      answerNum: 0,
    }));
    if (!fromServeCharacterList) return;
    this.clear();
    this.showDialog();
    if (topaicIndex - 0 + 1 == fromServeCharacterList.toJS().length) {
      // this.getAnswerResult();
      //  this.goBack()
      return;
    }
    this.props.changeTopaicIndex(+topaicIndex + 1);
    this.props.changeCurrentTopaic(
      fromServeCharacterList.toJS()[+topaicIndex + 1]
    );
  };

  //答题失败通用处理部分
  onFail = () => {
    const {
      fromServeCharacterList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    console.log("onFail");
    const { answerNum } = this.state;
    if (answerNum > 0) {
      this.isElementTopaic = true;
    }
    this.changeAnswerDataIsElment(this.answerdata);
    changeTopaiclistColorFlag(2, fromServeCharacterList.toJS(), topaicIndex);
    this.onSendResult(this.answerdata);
    this.clear();
    this.closeDialog();
    this.isInExplain = true; //是否处于讲解阶段
    this.failToast();
  };

  //第二次答题失败处理
  onSecendFail = () => {
    const {
      fromServeCharacterList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    console.log("onSecendFail");
    const { answerNum } = this.state;

    this.setState(() => ({
      answerNum: 0,
    }));
    if (!fromServeCharacterList) return;
    if (topaicIndex - 0 + 1 == fromServeCharacterList.toJS().length) {
      this.getAnswerResult();
      return;
    }
    this.clear();
    this.showDialog();
    changeTopaiclistColorFlag(2, fromServeCharacterList.toJS(), topaicIndex);
    this.props.changeTopaicIndex(+topaicIndex + 1);
    this.props.changeCurrentTopaic(
      fromServeCharacterList.toJS()[+topaicIndex + 1]
    );
  };

  //发送答题记录给后台
  onSendResult = (data, isSuccess) => {
    if (!data) return;
    console.log("参数", data);
    const {
      fromServeCharacterList,
      topaicIndex,
      changeTopaiclistColorFlag,
    } = this.props;
    //记录答题结果
    let { isLookHelp } = this.state;
    if (isLookHelp) {
      data.correction = 1;
      // 刷新页面
    }

    if (topaicIndex + 1 == fromServeCharacterList.toJS().length) {
      data.is_finish = "0";
    }
    this.setState({ isLookHelp: false });
    console.log("onSendResult", data);
    axios
      .post(api.finshOneHomeWork, data, { timeout: 30000 })
      .then((res) => {
        console.log("onSendResult res", res);
        //默认答题参数
        this.answerdata.exercise_type = 1;
        this.answerdata.actual_img_size = [];
        this.answerdata.actual_img_loc = [];
        this.answerdata.private_stem_picture = "";
        if (topaicIndex - 0 + 1 == fromServeCharacterList.toJS().length) {
          if (isSuccess) {
            Toast.loading("正在获取整套题答题结果", 3, () => {
              this.getAnswerResult();
            });
          }
          return;
        }
      })
      .catch((err) => {});
  };
  //获取整套题作答结果
  getAnswerResult = () => {
    let exercise = this.props.navigation.state.params.exercise_origin;
    const data = {};
    data.exercise_set_id = exercise.exercise_set_id;
    data.student_code = this.props.userInfo.toJS().id;
    data.subject = "01";

    axios
      .post(api.yuwenResult, data)
      .then((res) => {
        this.setState(() => ({
          wrong: res.data.data.wrong,
          blank: res.data.data.blank,
          correct: res.data.data.correct,
          answerStatisticsModalVisible: true,
        }));
      })
      .catch((e) => {
        //console.log(e)
      });
  };

  onCloseHelp = () => {
    Toast.loading("请等待", 3);
    this.isElementTopaic = true;
    this.isInExplain = false;
    this.setState((preState) => {
      return {
        status: false,
        answerNum:
          preState.answerNum + 1 == 2
            ? this.onSecendFail()
            : preState.answerNum + 1,
      };
    });
  };
  helpMe = () => {
    // 点击查看帮助
    let { status, lookDetailNum, isLookHelp } = this.state;
    ++lookDetailNum;
    this.setState({
      status: true,
      // lookDetailNum,
      // isLookHelp: true
    });
  };

  changeAnswerDataIsElment = (data) => {
    if (!data) return;
    console.log("changeAnswerDataIsElment", this.isElementTopaic);
    if (this.isElementTopaic) {
      data.is_element_exercise = "0";
    } else {
      data.is_element_exercise = "1";
    }
  };

  //下一题
  nextTopaic = () => {
    Toast.loading("请等待", 3);
    this.getDataFromCanvas(this.usbUtil.toServeXY);
    this.usbUtil.clearListXY();
  };

  successToast = () => {
    Toast.success("恭喜你答对了 !!!", 1);
  };

  failToast = () => {
    Toast.fail("抱歉，你答错了呢 !!!", 3, () => {
      this.helpMe();
    });
  };

  /**
   * 前端诊断结果
   * @param topaciType 题目类型
   * @param data 诊断数据
   *
   */
  diagnosisByFront = (currentTopaicData, data, type) => {
    switch (type) {
      case types.Multipl_Choice:
        if (currentTopaicData.diagnose_type === types.Num_Multipl_Choice) {
          let answer = diagnosisUtilNew.MathAllStrokesProcess(data)[1];
          console.log("Multipl_Choice Num_Multipl_Choice", answer);
          return currentTopaicData.answer_content === answer;
        } else {
          let answer = diagnosisUtilNew.MultiChoiceABCD(data)[10][0];
          console.log("Multipl_Choice", answer);
          console.log("Multipl_Choice1", chooseMap.get(answer));
          console.log("Multipl_Choice2", chooseMap);
          //选择题(A/B/C/D)
          return currentTopaicData.answer_content === chooseMap.get(answer);
        }
      case types.Connection_Question:
        let arrOneGroopuConnectAnswer = parseYuwenOneConnectionAnswer(
          currentTopaicData.answer_content
        );
        let exercise_pointConnect = currentTopaicData.exercise_point
          .replaceAll("；", ";")
          .replaceAll("，", ",");
        console.log(
          "diagnosisUtilNew.LineConnectionMode13(data, exercise_pointConnect data)",
          data
        );
        console.log(
          "diagnosisUtilNew.LineConnectionMode13(data, exercise_pointConnect)",
          diagnosisUtilNew.LineConnectionMode13(data, exercise_pointConnect)
        );
        //左右连线题
        // return diagnosisYuwenLeftRightConnectAnswer(arrOneGroopuConnectAnswer, diagnosisUtilNew.LineConnectionMode8(data))
        return diagnosisOneGroupConnection(
          arrOneGroopuConnectAnswer,
          diagnosisUtilNew.LineConnectionMode13(data, exercise_pointConnect)[0]
        );
      case types.Judgment:
        // console.log('Judgment',diagnosisUtilNew.MathJudgementCompletion(data)[0].join('#'))
        //判断题
        let result = diagnosisUtilNew
          .MathJudgementCompletion(data)[0]
          .join("#");
        return this.judgmentFilter(currentTopaicData.answer_content) === result;
    }
  };

  judgmentFilter = (value) => {
    return value.replaceAll("×", "x").replaceAll("X", "x");
  };

  topaicContainerOnLayout = (e) => {
    let { width, height } = e.nativeEvent.layout;
    this.setState(() => ({
      canvasWidth: width,
      canvasHeight: height,
    }));
  };

  renderTopaicCard = (fromServeCharacterListJs) => {
    let cardList = new Array();
    const { topaicIndex } = this.props;
    for (let i = 0; i < fromServeCharacterListJs.length; i++) {
      cardList.push(
        <CircleCard
          key={i}
          text={i + 1}
          className={"oldCheck"}
          colorFlag={fromServeCharacterListJs[i].colorFlag}
        />
      );
    }
    return cardList;
  };

  renderChooise = (data) => {
    let chooseView = [];
    if (data.diagnose_type === types.Num_Multipl_Choice) {
      data.exercise_content
        ? data.exercise_content.split("#").map((item, index) => {
            console.log("set chooseMap", chooseMap);

            chooseMap.set(num[index], item);
            chooseView.push(
              <Text
                key={index}
                style={{ marginRight: 10, fontSize: pxToDp(35) }}
              >
                {num[index] + ". " + item}
              </Text>
            );
          })
        : null;
    } else {
      data.exercise_content
        ? data.exercise_content.split("#").map((item, index) => {
            chooseMap.set(zimu[index], item);
            chooseView.push(
              <Text
                key={index}
                style={{ marginRight: 10, fontSize: pxToDp(35) }}
              >
                {zimu[index] + ". " + item}
              </Text>
            );
          })
        : null;
    }

    console.log("chooseMap", chooseMap);
    return chooseView;
  };

  renderWriteTopaic = () => {
    const { currentTopaicData } = this.props;
    if (!currentTopaicData) return <Text style={{fontSize:pxToDp(32)}}>数据加载中.</Text>;
    const data = currentTopaicData.toJS();
    chooseMap.clear(); //重新渲染题目时清空选择题map
    if (data && data.exercise_id) {
      //console.log('renderWriteTopaic', data)
      let baseUrl =
        "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
        data.private_stem_picture;
      // let baseUrl = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/math/10/03/00/04/00/exercise/image/01031010409130101.png'
      //console.log("图片地址", baseUrl)
      return (
        // 不同题型组装题目
        <View>
          <View style={{}}>
            {data.private_stem_picture &&
            data.exercise_type_public != types.Gou_Xuan ? (
              <View>
                <Image
                  style={{ width: 500, height: 200 }}
                  resizeMode={"contain"}
                  source={{ uri: baseUrl }}
                ></Image>
              </View>
            ) : null}
            <RichShowView
              divStyle={"font-size: x-large"}
              pStyle={"font-size: x-large"}
              spanStyle={"font-size: x-large"}
              width={pxToDp(1000)}
              value={
                data.private_exercise_stem ? data.private_exercise_stem : " "
              }
            ></RichShowView>
          </View>
          <View
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {this.renderChooise(data)}
          </View>
        </View>
      );
    } else {
      return <Text style={{fontSize:pxToDp(32)}}>数据加载中...</Text>;
    }
  };

  //获取平板canvas手写数据
  getPadDataFromCanvas = (canvasData) => {
    if (!canvasData) return;
    //console.log('getPadDataFromCanvas', canvasData)
    let exercise = this.props.navigation.state.params.exercise_origin;
    this.isElementTopaic = false;
    const { currentTopaicData, userInfo } = this.props;
    if (!currentTopaicData) return;

    const currentTopaicDataJs = currentTopaicData.toJS();
    const userInfoJs = userInfo.toJS();
    this.answerdata.exercise_id = currentTopaicDataJs.exercise_id;
    this.answerdata.student_code = userInfoJs.id;
    this.answerdata.exercise_set_id = exercise.exercise_set_id;
    this.answerdata.exercise_point_loc = canvasData;
    this.closeDialog(); //诊断之前关闭canvas dialog，否则后续的手写板答题无法实现
    //console.log('getPadDataFromCanvas data', this.answerdata)
    if (canvasData.length === 0) {
      //对于不诊断的题目，若是没有作答则判定为作答错误
      this.answerdata.correction = "1";
      this.onFail();
      return;
    }
    if (currentTopaicDataJs.exercise_type_public === types.Gou_Xuan) {
      try {
        let result = true;
        let picSize = currentTopaicDataJs.exercise_point
          .split("##")[1]
          .replaceAll("，", ",")
          .split(",");
        console.log("picSize", picSize);
        let resultArr = padDiagnosisUtil.PadChnCheckProcessSub1(
          [
            [0 + picSize[0], 0 + picSize[1]],
            currentTopaicDataJs.exercise_point.split("##")[0],
          ],
          [
            [850, 150],
            [60, 115],
          ],
          canvasData
        );
        this.answerdata.exercise_type = 5;
        this.answerdata.actual_img_size = [850, 150];
        this.answerdata.actual_img_loc = [60, 115];
        this.answerdata.private_stem_picture =
          "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/" +
          currentTopaicDataJs.private_stem_picture;
        console.log("getPadDataFromCanvas answerdata", this.answerdata);
        resultArr[0].forEach((item) => {
          if (item.length <= 0) {
            result = false;
          }
        });
        console.log("result::::::::::", result);
        if (result) {
          this.answerdata.correction = "0";
          this.onSuccess();
        } else {
          this.answerdata.correction = "1";
          this.onFail();
        }
      } catch (e) {
        //console.log(e)
      }
    }
  };

  //获取canvas手写数据
  getDataFromCanvas = (canvasData) => {
    if (!canvasData) return;
    //console.log('getDataFromCanvas', canvasData)
    let exercise = this.props.navigation.state.params.exercise_origin;
    this.isElementTopaic = false;
    const {
      currentTopaicData,
      userInfo,
      topaicIndex,
      fromServeCharacterList,
    } = this.props;
    if (!currentTopaicData) return;

    const currentTopaicDataJs = currentTopaicData.toJS();
    const userInfoJs = userInfo.toJS();
    this.answerdata.exercise_id = currentTopaicDataJs.exercise_id;
    this.answerdata.student_code = userInfoJs.id;
    this.answerdata.exercise_set_id = exercise.exercise_set_id;
    this.answerdata.exercise_point_loc = canvasData;

    //console.log('getDataFromCanvas data', this.answerdata)
    if (canvasData.length === 0) {
      //对于不诊断的题目，若是没有作答则判定为作答错误
      // this.answerdata.correction = '1'
      // this.onFail()
      return;
    }
    if (
      currentTopaicDataJs.exercise_type_public === types.Connection_Question ||
      currentTopaicDataJs.exercise_type_public === types.Judgment ||
      currentTopaicDataJs.exercise_type_public === types.Multipl_Choice
    ) {
      try {
        let result = this.diagnosisByFront(
          currentTopaicDataJs,
          canvasData,
          currentTopaicDataJs.exercise_type_public
        );
        console.log("result", result);
        if (result) {
          this.answerdata.correction = "0";
          this.onSuccess();
        } else {
          this.answerdata.correction = "1";
          this.onFail();
        }
      } catch (e) {
        console.log(e);
      }
    } else if (currentTopaicDataJs.exercise_type_public === types.YUE_DU) {
      if (
        currentTopaicDataJs.exercise_type_private ===
          types.Connection_Question ||
        currentTopaicDataJs.exercise_type_private === types.Judgment ||
        currentTopaicDataJs.exercise_type_private === types.Multipl_Choice
      ) {
        try {
          let result = this.diagnosisByFront(
            currentTopaicDataJs,
            canvasData,
            currentTopaicDataJs.exercise_type_private
          );

          if (result) {
            this.answerdata.correction = "0";
            this.onSuccess();
          } else {
            this.answerdata.correction = "1";
            this.onFail();
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        this.answerdata.correction = "2";
        this.onSuccess();
      }
    } else {
      this.answerdata.correction = "2";
      this.onSuccess();
    }
  };

  //答题板和题目讲解显隐控制
  renderCanvasOrKnowldge = (canvasWidth, indentifyContext) => {
    const { status } = this.state;
    if (status === 1) {
      return <ScrollView style={{ flex: 1 }}></ScrollView>;
    } else {
      return (
        <View>
          <Canvas
            onRef={this.onRef}
            height={1}
            width={1}
            getDataFromCanvas={this.getDataFromCanvas}
          ></Canvas>
        </View>
      );
    }
  };
  lookhelpMe = () => {
    let { status, lookDetailNum, isLookHelp } = this.state;
    ++lookDetailNum;
    this.setState({
      lookhelp: true,
      lookDetailNum,
      isLookHelp: true,
    });
  };
  handelCloseHelpMe = () => {
    Toast.loading("请等待", 3);
    // this.isElementTopaic = true
    // this.isInExplain = false
    this.setState((preState) => {
      return {
        lookhelp: false,
        // answerNum: preState.answerNum + 1
      };
    });
  };
  render() {
    //console.log('YuwenCanvas render')
    const {
      fromServeCharacterList,
      currentTopaicData,
      topaicIndex,
      topaicNum,
    } = this.props;
    let currentTopaicDataJs = undefined;
    let fromServeCharacterListJs = [];
    if (currentTopaicData) {
      currentTopaicDataJs = currentTopaicData.toJS();
    }
    if (fromServeCharacterList) {
      fromServeCharacterListJs = [...fromServeCharacterList.toJS()];
    }
    if(!currentTopaicDataJs) return null
    const baseImgUrl = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
    return (
      <View style={styles.mainWrap}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.goBack()}>
            <Image
              source={require("../../images/backBtn.png")}
              style={[appStyle.helpBtn]}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {this.props.navigation.state.params.exercise_origin.learning_point}
          </Text>
          <Text></Text>
        </View>
        <View style={styles.container}>
          <View
            style={styles.topaic}
            ref="topaicBox"
            onLayout={(event) => this.topaicContainerOnLayout(event)}
          >
            <View style={styles.topaicText}>
              <ScrollView>
                {/* 展示公共题干 */}
                {currentTopaicDataJs &&
                currentTopaicDataJs.public_stem_picture ? (
                  <RichShowView
                    divStyle={"font-size: x-large"}
                    pStyle={"font-size: x-large"}
                    spanStyle={"font-size: x-large"}
                    width={pxToDp(1000)}
                    value={
                      currentTopaicDataJs.public_exercise_stem +
                      `<img src="${
                        baseImgUrl + currentTopaicDataJs.public_stem_picture
                      }" style="width:100%"></img>`
                    }
                  ></RichShowView>
                ) : (
                  <RichShowView
                    divStyle={"font-size: x-large"}
                    pStyle={"font-size: x-large"}
                    spanStyle={"font-size: x-large"}
                    width={pxToDp(1000)}
                    value={currentTopaicDataJs.public_exercise_stem?currentTopaicDataJs.public_exercise_stem:''}
                  ></RichShowView>
                )}
                {this.renderWriteTopaic()}
              </ScrollView>
              <TouchableOpacity onPress={this.lookhelpMe}>
                <Image
                  source={require("../../images/help.png")}
                  style={[appStyle.helpBtn]}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.topaicCard}>
            <ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  flexWrap: "wrap",
                  padding: 24,
                }}
              >
                {this.renderTopaicCard(fromServeCharacterListJs)}
              </View>
            </ScrollView>
            <Text
              style={{
                color: "#666666",
                height: 30,
                fontSize: 21,
                marginBottom: 50,
              }}
            >
              答题卡{topaicIndex - 0 + 1}/{topaicNum}
            </Text>
          </View>
        </View>
        <Modal
          animationType="fade"
          title="知识讲解"
          transparent
          onClose={this.handelCloseHelpMe}
          maskClosable={false}
          visible={this.state.lookhelp}
          closable
          style={{ paddingVertical: 20, width: 700 }}
        >
          <View style={{ paddingVertical: 20 , maxHeight: 400 }}>
            <ScrollView>
              <RichShowView
                divStyle={"font-size: x-large"}
                pStyle={"font-size: x-large"}
                spanStyle={"font-size: x-large"}
                width={pxToDp(800)}
                value={
                  currentTopaicDataJs &&
                  currentTopaicDataJs.knowledgepoint_explanation != ""
                    ? currentTopaicDataJs.knowledgepoint_explanation
                    : "没讲解 "
                }
              ></RichShowView>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          title="诊断标记"
          transparent
          onClose={this.handleCloseHlepDialogThrottled}
          maskClosable={false}
          visible={this.state.status}
          closable
          style={{ paddingVertical: 20, width: 700 }}
        >
          <View style={{ paddingVertical: 20 , maxHeight: 400 }}>
            <ScrollView>
              <RichShowView
                divStyle={"font-size: x-large"}
                pStyle={"font-size: x-large"}
                spanStyle={"font-size: x-large"}
                width={pxToDp(800)}
                value={
                  currentTopaicDataJs &&
                  currentTopaicDataJs.knowledgepoint_explanation != ""
                    ? currentTopaicDataJs.knowledgepoint_explanation
                    : "没讲解 "
                }
              ></RichShowView>
            </ScrollView>
          </View>
        </Modal>

        <CanvasDialog
          clearListXY={this.usbUtil.clearListXY}
          currentData={currentTopaicData}
          useUsb={this.state.useUsb}
          _dialogVisible={this.state.isDialogVisible}
          onBack={this.goBack}
          closeDialog={this.closeDialog}
          destoryDialog={this.destoryDialog}
          getPadDataFromCanvas={this.getPadDataFromCanvas}
          _dialogRightBtnAction={this.clear}
          _dialogLeftBtnAction={this.nextTopaic}
        ></CanvasDialog>

        <AnswerStatisticsModal
          dialogVisible={this.state.answerStatisticsModalVisible}
          yesNumber={this.state.correct}
          noNumber={this.state.wrong}
          waitNumber={this.state.blank}
          closeDialog={this.closeAnswerStatisticsModal}
        ></AnswerStatisticsModal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    backgroundColor:
      "linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)",
    height: "100%",
    width: "100%",
    padding: 24,
    // paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: pxToDp(110),
    // width: 952,
    marginBottom: 24,
    paddingLeft: 33,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 15,
  },
  headerTitle: {
    fontSize: 22,
    color: "#3F403F",
  },
  container: {
    // flex: 1,
    flexDirection: "row",
  },
  topaic: {
    backgroundColor: "#FFFFFFFF",
    width: "70%",
    height: pxToDp(890),
    marginRight: 24,
    borderRadius: 15,
  },
  topaicBtn: {
    backgroundColor: "#FFFFFFFF",
    width: "95%",
    alignItems: "flex-end",
    // height: 80,
    // margin: 20,
  },
  topaicText: {
    // width: 686,
    flex: 1,
    height: pxToDp(800),
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topaicCard: {
    width: pxToDp(550),
    height: pxToDp(890),
    borderRadius: 15,
    backgroundColor: "#FFFFFFFF",
    alignItems: "center",
  },
  topaicWrite: {
    position: "absolute",
  },
  buttonGroup: {
    flexDirection: "row",
    // flex: 1
  },
  checkOptions: {
    width: 25,
    height: 25,
    // backgroundColor: '#FA603B',
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    marginRight: 23,
  },
  checkedOption: {
    width: 25,
    height: 25,
    backgroundColor: "#FA603B",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: '#D4D4D4',
    marginRight: 23,
  },
});

const mapStateToProps = (state) => {
  return {
    fromServeCharacterList: state.getIn([
      "deskYuwen",
      "fromServeCharacterList",
    ]),
    currentTopaicData: state.getIn(["deskYuwen", "currentTopaicData"]),
    topaicNum: state.getIn(["deskYuwen", "topaicNum"]),
    topaicIndex: state.getIn(["deskYuwen", "topaicIndex"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    // topaicDataList: state.getIn(['deskYuwen', 'topaicDataList']),
  };
};

const mapDispathToProps = (dispatch) => {
  return {
    getTopaciData(data) {
      dispatch(actionCreators.getTopaic(data));
    },
    changeCurrentTopaic(changeTopaicData) {
      if (!changeTopaicData) throw new TypeError("题目上限");
      //console.log('changeTopaicData', changeTopaicData)
      dispatch(actionCreators.changeCurrentTopaic(changeTopaicData));
    },
    changeTopaicIndex(index) {
      dispatch(actionCreators.changeTopaicIndex(index));
    },
    changeTopaiclistColorFlag(colorFlag, topaiclist, index) {
      if (!topaiclist || topaiclist.length === 0)
        throw new TypeError("题目列表为空");
      topaiclist[index].colorFlag = colorFlag;
      //console.log('changeTopaiclistColorFlag YuwenCanvas', topaiclist)
      dispatch(actionCreators.changeTopaiclistColorFlag(topaiclist));
    },
    initRedux() {
      dispatch(actionCreators.initRedux());
    },
  };
};

export default connect(mapStateToProps, mapDispathToProps)(YuwenCanvas);
